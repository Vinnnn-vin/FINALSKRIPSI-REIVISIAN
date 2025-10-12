// src\app\api\dashboard\admin\payment\route.ts

/* eslint-disable @typescript-eslint/no-explicit-any */

import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "../../../auth/[...nextauth]/route";
import { Payment, User, Course, Enrollment } from "@/models";
import sequelize from "@/lib/database";
import { QueryTypes } from "sequelize";

export async function GET() {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user || (session.user as any)?.role !== "admin") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 403 });
    }

    // Get payment records with user and course details
    const payments = await Payment.findAll({
      include: [
        {
          model: User,
          attributes: ["user_id", "first_name", "last_name", "email"],
          as: "user",
        },
        {
          model: Course,
          attributes: ["course_id", "course_title"],
          as: "course",
        },
        {
          model: Enrollment,
          attributes: ["enrollment_id", "status"],
          as: "enrollment",
        },
      ],
      order: [["created_at", "DESC"]],
      limit: 100,
    });

    const paymentsData = payments.map((payment) => payment.toJSON());

    const paymentStats = await sequelize.query(
      `SELECT 
        status,
        COUNT(*) as count,
        SUM(amount) as total_amount,
        AVG(amount) as average_amount
      FROM payments 
      GROUP BY status`,
      { type: QueryTypes.SELECT }
    );

    // Get monthly payment trends
    const monthlyTrends = await sequelize.query(
      `SELECT 
        DATE_FORMAT(created_at, '%Y-%m') as month,
        COUNT(*) as payment_count,
        SUM(amount) as total_revenue
      FROM payments 
      WHERE status = 'paid' 
        AND created_at >= DATE_SUB(NOW(), INTERVAL 12 MONTH)
      GROUP BY DATE_FORMAT(created_at, '%Y-%m')
      ORDER BY month ASC`,
      { type: QueryTypes.SELECT }
    );

    return NextResponse.json({
      payments: paymentsData, // Return plain objects
      stats: paymentStats,
      trends: monthlyTrends,
    });
    
  } catch (error) {
    console.error("Error fetching payments:", error);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 }
    );
  }
}
