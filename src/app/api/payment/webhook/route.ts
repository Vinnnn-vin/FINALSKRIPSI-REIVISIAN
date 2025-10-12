// src\app\api\payment\webhook\route.ts
/* eslint-disable @typescript-eslint/no-explicit-any */
import { NextRequest, NextResponse } from 'next/server';
import { Payment, Enrollment } from '@/models';

export async function POST(req: NextRequest) {
  try {
    // Log semua request yang masuk untuk debugging
    console.log("=== XENDIT WEBHOOK RECEIVED ===");
    console.log("Timestamp:", new Date().toISOString());
    console.log("Headers:", Object.fromEntries(req.headers.entries()));

    const webhookData = await req.json();
    console.log("Webhook payload:", JSON.stringify(webhookData, null, 2));

    // Verify callback token (optional - comment out if not using)
    const xenditCallbackToken = process.env.XENDIT_CALLBACK_VERIFICATION_TOKEN;
    const requestToken = req.headers.get('x-callback-token');

    if (xenditCallbackToken && requestToken !== xenditCallbackToken) {
      console.error("Invalid callback token received:", requestToken);
      return NextResponse.json({ error: 'Invalid callback token' }, { status: 401 });
    }

    // Extract data dari webhook
    const { 
      external_id, 
      status, 
      paid_at, 
      payment_method, 
      payment_channel,
      amount,
      id: invoice_id 
    } = webhookData;

    if (!external_id) {
      console.error("Missing external_id in webhook payload");
      return NextResponse.json({ error: 'Missing external_id' }, { status: 400 });
    }

    console.log("Processing payment with external_id:", external_id, "status:", status);

    // Cari payment record berdasarkan external_id
    const payment = await Payment.findOne({
      where: { gateway_external_id: external_id }
    });

    if (!payment) {
      console.error("Payment not found for external_id:", external_id);
      return NextResponse.json({ error: 'Payment not found' }, { status: 404 });
    }

    const paymentData = payment.toJSON();
    console.log("Found payment:", {
      payment_id: paymentData.payment_id,
      user_id: paymentData.user_id,
      course_id: paymentData.course_id,
      current_status: paymentData.status,
      amount: paymentData.amount
    });

    // Process SUCCESSFUL payment
    if (status === 'PAID' && paymentData.status !== 'success') {
      console.log("🎉 Processing SUCCESSFUL payment...");

      // Tentukan payment method string
      let paymentMethodString = 'UNKNOWN';
      if (payment_method && payment_channel) {
        paymentMethodString = `${payment_method}_${payment_channel}`.toUpperCase();
      } else if (payment_method) {
        paymentMethodString = payment_method.toUpperCase();
      } else if (payment_channel) {
        paymentMethodString = payment_channel.toUpperCase();
      }

      // Update payment status ke success
      await payment.update({
        status: 'success',
        paid_at: paid_at ? new Date(paid_at) : new Date(),
        payment_method: paymentMethodString,
        gateway_invoice_id: invoice_id || paymentData.gateway_invoice_id,
        updated_at: new Date(),
      });

      console.log("✅ Payment status updated to SUCCESS");

      // Cek apakah enrollment sudah ada
      const existingEnrollment = await Enrollment.findOne({
        where: {
          user_id: paymentData.user_id,
          course_id: paymentData.course_id,
        }
      });

      if (existingEnrollment) {
        console.log("⚠️ Enrollment already exists:", existingEnrollment.enrollment_id);
        
        // Update payment dengan enrollment_id yang sudah ada
        await payment.update({
          enrollment_id: existingEnrollment.enrollment_id,
          updated_at: new Date(),
        });
      } else {
        // Buat enrollment baru
        console.log("📚 Creating new enrollment...");
        
        const newEnrollment = await Enrollment.create({
          user_id: paymentData.user_id,
          course_id: paymentData.course_id,
          status: 'active',
          enrolled_at: new Date(),
          created_at: new Date(),
          updated_at: new Date(),
        });

        console.log("✅ New enrollment created:", newEnrollment.enrollment_id);

        // Update payment dengan enrollment_id baru
        await payment.update({
          enrollment_id: newEnrollment.enrollment_id,
          updated_at: new Date(),
        });

        console.log("✅ Payment linked to enrollment");
      }

      console.log("🎯 PAYMENT SUCCESS PROCESSING COMPLETED");

    } else if (status === 'EXPIRED' && paymentData.status !== 'expired') {
      console.log("⏰ Processing EXPIRED payment...");
      
      await payment.update({
        status: 'expired',
        updated_at: new Date(),
      });

      console.log("✅ Payment status updated to EXPIRED");

    } else if (status === 'FAILED' && paymentData.status !== 'failed') {
      console.log("❌ Processing FAILED payment...");
      
      await payment.update({
        status: 'failed',
        updated_at: new Date(),
      });

      console.log("✅ Payment status updated to FAILED");

    } else {
      console.log("ℹ️ Payment status not processed - Current:", paymentData.status, "Webhook:", status);
    }

    // Response success ke Xendit
    const response = { 
      message: 'Webhook processed successfully',
      external_id,
      status,
      processed_at: new Date().toISOString()
    };

    console.log("=== WEBHOOK PROCESSING COMPLETE ===");
    console.log("Response:", response);

    return NextResponse.json(response);

  } catch (error: any) {
    console.error("❌ XENDIT WEBHOOK ERROR:", error);
    console.error("Error details:", {
      message: error.message,
      stack: error.stack,
      timestamp: new Date().toISOString()
    });

    // Tetap return 200 agar Xendit tidak retry terus menerus
    return NextResponse.json(
      { 
        error: 'Webhook processing failed', 
        message: error.message,
        timestamp: new Date().toISOString()
      },
      { status: 200 } // Ubah ke 200 agar Xendit tidak retry
    );
  }
}