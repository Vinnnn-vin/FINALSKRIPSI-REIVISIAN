// src\app\api\payment\check-status\route.ts
/* eslint-disable @typescript-eslint/no-explicit-any */
// Endpoint untuk mengecek status payment dan manual processing
import { NextRequest, NextResponse } from 'next/server';
import { Payment, Enrollment } from '@/models';

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const external_id = searchParams.get('external_id');

    if (!external_id) {
      return NextResponse.json({ error: 'external_id required' }, { status: 400 });
    }

    // Cari payment dan enrollment terkait
    const payment = await Payment.findOne({
      where: { gateway_external_id: external_id },
      include: []
    });

    if (!payment) {
      return NextResponse.json({ error: 'Payment not found' }, { status: 404 });
    }

    const paymentData = payment.toJSON();

    // Cari enrollment jika ada
    let enrollment = null;
    if (paymentData.enrollment_id) {
      enrollment = await Enrollment.findByPk(paymentData.enrollment_id);
    } else {
      // Cari enrollment berdasarkan user_id dan course_id
      enrollment = await Enrollment.findOne({
        where: {
          user_id: paymentData.user_id,
          course_id: paymentData.course_id
        }
      });
    }

    return NextResponse.json({
      payment: {
        payment_id: paymentData.payment_id,
        user_id: paymentData.user_id,
        course_id: paymentData.course_id,
        amount: paymentData.amount,
        status: paymentData.status,
        gateway_external_id: paymentData.gateway_external_id,
        gateway_invoice_id: paymentData.gateway_invoice_id,
        enrollment_id: paymentData.enrollment_id,
        created_at: paymentData.created_at,
        updated_at: paymentData.updated_at,
        paid_at: paymentData.paid_at,
        payment_method: paymentData.payment_method
      },
      enrollment: enrollment ? {
        enrollment_id: enrollment.enrollment_id,
        user_id: enrollment.user_id,
        course_id: enrollment.course_id,
        status: enrollment.status,
        enrolled_at: enrollment.enrolled_at,
        created_at: enrollment.created_at,
        updated_at: enrollment.updated_at
      } : null,
      has_enrollment: !!enrollment
    });

  } catch (error: any) {
    console.error("Check status error:", error);
    return NextResponse.json(
      { error: error.message || 'Internal server error' },
      { status: 500 }
    );
  }
}

// POST method untuk manual processing (untuk testing)
export async function POST(req: NextRequest) {
  try {
    const { external_id, action } = await req.json();

    if (!external_id) {
      return NextResponse.json({ error: 'external_id required' }, { status: 400 });
    }

    const payment = await Payment.findOne({
      where: { gateway_external_id: external_id }
    });

    if (!payment) {
      return NextResponse.json({ error: 'Payment not found' }, { status: 404 });
    }

    const paymentData = payment.toJSON();

    if (action === 'activate' && paymentData.status === 'pending') {
      console.log("Manual activation for:", external_id);

      // Update payment ke success
      await payment.update({
        status: 'success',
        paid_at: new Date(),
        payment_method: 'MANUAL_ACTIVATION',
        updated_at: new Date(),
      });

      // Cek enrollment
      let enrollment = await Enrollment.findOne({
        where: {
          user_id: paymentData.user_id,
          course_id: paymentData.course_id,
        }
      });

      if (!enrollment) {
        // Buat enrollment baru
        enrollment = await Enrollment.create({
          user_id: paymentData.user_id,
          course_id: paymentData.course_id,
          status: 'active',
          enrolled_at: new Date(),
          created_at: new Date(),
          updated_at: new Date(),
        });

        console.log("Enrollment created:", enrollment.enrollment_id);
      }

      // Update payment dengan enrollment_id
      await payment.update({
        enrollment_id: enrollment.enrollment_id,
        updated_at: new Date(),
      });

      return NextResponse.json({
        message: 'Payment activated successfully',
        payment_id: paymentData.payment_id,
        enrollment_id: enrollment.enrollment_id,
        status: 'success'
      });
    }

    return NextResponse.json({ message: 'No action taken' });

  } catch (error: any) {
    console.error("Manual processing error:", error);
    return NextResponse.json(
      { error: error.message || 'Internal server error' },
      { status: 500 }
    );
  }
}