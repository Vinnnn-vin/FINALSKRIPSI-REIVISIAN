// src\app\api\dashboard\admin\enrollments\route.ts
/* eslint-disable @typescript-eslint/no-explicit-any */
import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "../../../auth/[...nextauth]/route";
import { Enrollment, User, Course, Category } from "@/models";
import sequelize from "@/lib/database";
import { QueryTypes } from "sequelize";

export async function GET() {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user || (session.user as any)?.role !== "admin") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 403 });
    }

    // Get recent enrollments with user and course details
    const enrollments = await Enrollment.findAll({
      include: [
        {
          model: User,
          attributes: ["user_id", "first_name", "last_name", "email"],
          as: "student",
        },
        {
          model: Course,
          attributes: ["course_id", "course_title", "course_level"],
          include: [
            {
              model: Category,
              attributes: ["category_id", "category_name"],
              as: "category",
            },
          ],
          as: "course",
        },
      ],
      order: [["created_at", "DESC"]],
      limit: 100,
    });

    // Convert to plain objects
    const enrollmentsData = enrollments.map((enrollment) =>
      enrollment.toJSON()
    );

    // Get enrollment statistics by status
    const enrollmentStats = await sequelize.query(
      `SELECT 
        status,
        COUNT(*) as count
      FROM enrollments 
      GROUP BY status`,
      { type: QueryTypes.SELECT }
    );

    // Get enrollment trends by month
    const enrollmentTrends = await sequelize.query(
      `SELECT 
        DATE_FORMAT(created_at, '%Y-%m') as month,
        COUNT(*) as enrollment_count,
        COUNT(CASE WHEN status = 'completed' THEN 1 END) as completed_count
      FROM enrollments 
      WHERE created_at >= DATE_SUB(NOW(), INTERVAL 12 MONTH)
      GROUP BY DATE_FORMAT(created_at, '%Y-%m')
      ORDER BY month ASC`,
      { type: QueryTypes.SELECT }
    );

    // Get enrollment by category
    const enrollmentsByCategory = await sequelize.query(
      `SELECT 
        c.category_name,
        COUNT(e.enrollment_id) as enrollment_count
      FROM categories c
      LEFT JOIN courses co ON c.category_id = co.category_id
      LEFT JOIN enrollments e ON co.course_id = e.course_id
      GROUP BY c.category_id, c.category_name
      ORDER BY enrollment_count DESC`,
      { type: QueryTypes.SELECT }
    );

    return NextResponse.json({
      enrollments: enrollmentsData,
      stats: enrollmentStats,
      trends: enrollmentTrends,
      byCategory: enrollmentsByCategory,
    });
  } catch (error) {
    console.error("Error fetching enrollments:", error);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 }
    );
  }
}
