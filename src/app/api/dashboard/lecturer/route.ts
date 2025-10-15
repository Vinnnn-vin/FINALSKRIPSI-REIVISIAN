// src\app\api\dashboard\lecturer\route.ts
/* eslint-disable @typescript-eslint/no-explicit-any */

import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "../../auth/[...nextauth]/route";
import { Course, Enrollment, User, Category } from "@/models";

export async function GET() {
  try {
    const session = await getServerSession(authOptions);

    if (!session?.user || (session.user as any)?.role !== "lecturer") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 403 });
    }

    const userId = (session.user as any)?.id;

    if (!userId) {
      return NextResponse.json(
        { error: "User ID not found in session" },
        { status: 400 }
      );
    }

    // 2. Get lecturer's courses with student count - FIXED ASSOCIATION
    const courses = await Course.findAll({
      where: {
        user_id: userId,
      },
      include: [
        {
          model: User,
          as: "lecturer",
          attributes: ["first_name", "last_name"],
        },
        {
          model: Category,
          as: "category",
          attributes: ["category_name"],
        },
        {
          model: Enrollment,
          as: "enrollments", // Make sure this matches your model association
          attributes: ["enrollment_id", "user_id", "status"],
          required: false,
          where: {
            status: "active", // Only count active enrollments
          },
        },
      ],
      order: [["created_at", "DESC"]],
    });

    // 3. Process courses data and add student count - FIXED PROPERTY ACCESS
    const coursesWithStats = courses.map((course) => {
      const courseJson = course.toJSON();
      const enrollments = courseJson.enrollments || [];

      console.log(`Course ${courseJson.course_id} enrollments:`, enrollments);

      return {
        ...courseJson,
        course_level: courseJson.course_level,
        student_count: enrollments.length,
        enrollments: undefined,
      };
    });

    // 4. Calculate statistics - IMPROVED QUERIES
    const totalCourses = courses.length;

    // Get total unique students across all lecturer's courses - FIXED QUERY
    const totalStudentsResult = await Enrollment.findAll({
      include: [
        {
          model: Course,
          as: "course", // Make sure this matches your Enrollment model association
          where: { user_id: userId },
          attributes: [],
        },
      ],
      attributes: ["user_id"],
      where: {
        status: "active", // Only active enrollments
      },
      group: ["user_id"],
    });
    const totalStudents = totalStudentsResult.length;

    // Get total enrollments - FIXED QUERY
    const totalEnrollments = await Enrollment.count({
      include: [
        {
          model: Course,
          as: "course", // Make sure this matches your Enrollment model association
          where: { user_id: userId },
          attributes: [],
        },
      ],
      where: {
        status: "active", // Only active enrollments
      },
    });

    // Calculate average rating (placeholder - you can implement reviews later)
    const averageRating = 4.5; // Placeholder

    // Debug logs
    console.log("Dashboard Stats:", {
      totalCourses,
      totalStudents,
      totalEnrollments,
      coursesWithStudentCounts: coursesWithStats.map((c) => ({
        id: c.course_id,
        title: c.course_title,
        student_count: c.student_count,
      })),
    });

    // 5. Return response
    return NextResponse.json({
      stats: {
        totalCourses,
        totalStudents,
        totalEnrollments,
        averageRating,
      },
      courses: coursesWithStats,
    });
  } catch (error) {
    console.error("Lecturer dashboard API error:", error);
    return NextResponse.json(
      { error: "Internal Server Error: Failed to load dashboard data" },
      { status: 500 }
    );
  }
}

// Alternative approach if the above doesn't work - Manual query method
export async function GET_ALTERNATIVE() {
  try {
    const session = await getServerSession(authOptions);

    if (!session?.user || (session.user as any)?.role !== "lecturer") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 403 });
    }

    const userId = (session.user as any)?.id;

    if (!userId) {
      return NextResponse.json(
        { error: "User ID not found in session" },
        { status: 400 }
      );
    }

    // Get courses first
    const courses = await Course.findAll({
      where: {
        user_id: userId,
      },
      include: [
        {
          model: User,
          as: "lecturer",
          attributes: ["first_name", "last_name"],
        },
        {
          model: Category,
          as: "category",
          attributes: ["category_name"],
        },
      ],
      order: [["created_at", "DESC"]],
    });

    // Then get student counts for each course separately
    const coursesWithStats = await Promise.all(
      courses.map(async (course) => {
        const courseJson = course.toJSON();

        // Count active enrollments for this specific course
        const studentCount = await Enrollment.count({
          where: {
            course_id: courseJson.course_id,
            status: "active",
          },
        });

        return {
          ...courseJson,
          student_count: studentCount,
        };
      })
    );

    // Calculate totals
    const totalCourses = courses.length;
    const totalEnrollments = await Enrollment.count({
      include: [
        {
          model: Course,
          as: "course",
          where: { user_id: userId },
          attributes: [],
        },
      ],
      where: { status: "active" },
    });

    const totalStudentsResult = await Enrollment.findAll({
      include: [
        {
          model: Course,
          as: "course",
          where: { user_id: userId },
          attributes: [],
        },
      ],
      attributes: ["user_id"],
      where: { status: "active" },
      group: ["user_id"],
    });
    const totalStudents = totalStudentsResult.length;

    return NextResponse.json({
      stats: {
        totalCourses,
        totalStudents,
        totalEnrollments,
        averageRating: 4.5,
      },
      courses: coursesWithStats,
    });
  } catch (error) {
    console.error("Lecturer dashboard API error:", error);
    return NextResponse.json(
      { error: "Internal Server Error: Failed to load dashboard data" },
      { status: 500 }
    );
  }
}
