// src\app\api\dashboard\admin\stats\route.ts

/* eslint-disable @typescript-eslint/no-explicit-any */

import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "../../../auth/[...nextauth]/route";
import { User, Course, Enrollment, Category, Payment } from "@/models";
import sequelize from "@/lib/database";
import { Op } from "sequelize";
import { QueryTypes } from "sequelize";

export async function GET() {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user || (session.user as any)?.role !== "admin") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 403 });
    }

    // 1. Total courses (published and unpublished)
    const totalCourses = await Course.count();
    const publishedCourses = await Course.count({
      where: { publish_status: 1 },
    });
    const unpublishedCourses = await Course.count({
      where: { publish_status: 0 },
    });

    // 2. Count students and lecturers
    const totalStudents = await User.count({
      where: { role: "student" },
    });
    const totalLecturers = await User.count({
      where: { role: "lecturer" },
    });

    // 3. Total enrollments
    const totalEnrollments = await Enrollment.count();

    // 4. Analytics per category
    const categoryAnalytics = await sequelize.query(
      `SELECT 
        c.category_name,
        c.category_id,
        COUNT(co.course_id) as course_count,
        COUNT(e.enrollment_id) as enrollment_count
      FROM categories c
      LEFT JOIN courses co ON c.category_id = co.category_id
      LEFT JOIN enrollments e ON co.course_id = e.course_id
      GROUP BY c.category_id, c.category_name
      ORDER BY course_count DESC`,
      { type: QueryTypes.SELECT }
    );

    // 5. Payment records summary
    const paymentSummary = await sequelize.query(
      `SELECT 
        status,
        COUNT(*) as count,
        SUM(amount) as total_amount
      FROM payments 
      GROUP BY status`,
      { type: QueryTypes.SELECT }
    );

    // 6. Monthly enrollment trends (last 6 months)
    const enrollmentTrends = await sequelize.query(
      `SELECT 
        DATE_FORMAT(created_at, '%Y-%m') as month,
        COUNT(*) as enrollments
      FROM enrollments 
      WHERE created_at >= DATE_SUB(NOW(), INTERVAL 6 MONTH)
      GROUP BY DATE_FORMAT(created_at, '%Y-%m')
      ORDER BY month ASC`,
      { type: QueryTypes.SELECT }
    );

    // 7. Recent activities summary
    const recentEnrollments = await Enrollment.count({
      where: {
        created_at: {
          [Op.gte]: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000), // Last 30 days
        },
      },
    });

    return NextResponse.json({
      totalCourses,
      publishedCourses,
      unpublishedCourses,
      totalStudents,
      totalLecturers,
      totalEnrollments,
      recentEnrollments,
      categoryAnalytics,
      paymentSummary,
      enrollmentTrends,
    });
  } catch (error) {
    console.error("Error fetching admin stats:", error);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 }
    );
  }
}
