// src\app\api\payment\create-invoice\route.ts
/* eslint-disable @typescript-eslint/no-explicit-any */
import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "../../auth/[...nextauth]/route";
import { Course, Payment, Enrollment } from "@/models";
import { v4 as uuidv4 } from "uuid";

interface SessionUser {
  id: number;
  email: string;
}

export async function POST(req: NextRequest) {
  try {
    const { courseId } = await req.json();

    // Authentication check
    const session = await getServerSession(authOptions);
    if (!session?.user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const user = session.user as unknown as SessionUser;

    // Validate course exists and get price
    const course = await Course.findByPk(courseId);
    if (!course) {
      return NextResponse.json({ error: "Course not found" }, { status: 404 });
    }

    const courseData = course.toJSON() as any;
    const coursePrice = courseData.course_price || courseData.price || 0;

    if (coursePrice <= 0) {
      return NextResponse.json(
        { error: "Course is free or price not available" },
        { status: 400 }
      );
    }

    // Check if user already enrolled
    const existingEnrollment = await Enrollment.findOne({
      where: { user_id: user.id, course_id: courseId },
    });

    if (existingEnrollment) {
      return NextResponse.json(
        { error: "Already enrolled in this course" },
        { status: 409 }
      );
    }

    // Check for pending payment
    const existingPayment = await Payment.findOne({
      where: { 
        user_id: user.id, 
        course_id: courseId,
        status: 'pending'
      },
    });

    if (existingPayment) {
      return NextResponse.json(
        { error: "Pending payment already exists for this course" },
        { status: 409 }
      );
    }

    // Generate unique external ID
    const externalId = `inv_${courseId}_${user.id}_${Date.now()}`;

    // Create payment record
    const payment = await Payment.create({
      user_id: user.id,
      course_id: courseId,
      amount: coursePrice,
      status: "pending",
      gateway_external_id: externalId,
      created_at: new Date(),
    });

    // Create Xendit invoice
    const xenditSecretKey = process.env.XENDIT_SECRET_KEY;
    if (!xenditSecretKey) {
      await payment.destroy();
      return NextResponse.json(
        { error: "Payment gateway not configured" },
        { status: 500 }
      );
    }

    const baseUrl = process.env.NEXTAUTH_URL || "http://localhost:3000";
    const encodedKey = Buffer.from(`${xenditSecretKey}:`).toString("base64");

    const invoicePayload = {
      external_id: externalId,
      amount: coursePrice,
      payer_email: user.email,
      description: `Payment for course: ${courseData.course_title || courseData.title}`,
      success_redirect_url: `${baseUrl}/frontend/dashboard/student?payment=success&courseId=${courseId}&externalId=${externalId}`,
      failure_redirect_url: `${baseUrl}/frontend/dashboard/student?payment=failed&courseId=${courseId}`,
      invoice_duration: 86400, 
    };

    console.log("Creating Xendit invoice with payload:", invoicePayload);

    const xenditResponse = await fetch("https://api.xendit.co/v2/invoices", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Basic ${encodedKey}`,
      },
      body: JSON.stringify(invoicePayload),
    });

    const invoiceData = await xenditResponse.json();

    if (!xenditResponse.ok) {
      console.error("Xendit invoice creation failed:", invoiceData);
      await payment.destroy();
      return NextResponse.json(
        { error: invoiceData.message || "Failed to create payment invoice" },
        { status: 400 }
      );
    }

    // Update payment with Xendit invoice ID
    await payment.update({
      gateway_invoice_id: invoiceData.id,
      updated_at: new Date(),
    });

    console.log("Payment invoice created successfully:", {
      paymentId: payment.payment_id,
      invoiceId: invoiceData.id,
      externalId,
    });

    return NextResponse.json({
      invoice_url: invoiceData.invoice_url,
      external_id: externalId,
      amount: coursePrice,
    });

  } catch (error: any) {
    console.error("Payment invoice creation error:", error);
    return NextResponse.json(
      { error: error.message || "Internal server error" },
      { status: 500 }
    );
  }
}