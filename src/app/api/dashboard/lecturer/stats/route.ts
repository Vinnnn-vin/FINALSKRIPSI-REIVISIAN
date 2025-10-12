// src\app\api\dashboard\lecturer\stats\route.ts
/* eslint-disable @typescript-eslint/no-explicit-any */

import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "../../../auth/[...nextauth]/route";
import { Course, Enrollment, User, Category, Material, MaterialDetail, Quiz, QuizQuestion, Payment, Review } from "@/models";
import { Op } from "sequelize";
import sequelize from "@/lib/database";

export async function GET() {
  try {
    // Check session and role
    const session = await getServerSession(authOptions);

    if (!session?.user || (session.user as any)?.role !== 'lecturer') {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 403 });
    }

    const userId = (session.user as any)?.id;

    if (!userId) {
      return NextResponse.json({ error: 'User ID not found in session' }, { status: 400 });
    }

    // Execute all queries in parallel for better performance
    const [
      coursesData,
      totalStudentsResult,
      totalEnrollments,
      totalMaterials,
      totalLessons,
      totalQuizzes,
      totalQuestions,
      totalRevenue,
      averageRatingResult,
      recentEnrollments
    ] = await Promise.all([
      // Get courses with detailed stats
      Course.findAll({
        where: { user_id: userId },
        include: [
          {
            model: User,
            as: 'instructor',
            attributes: ["first_name", "last_name"],
          },
          {
            model: Category,
            attributes: ["category_name"],
          },
          {
            model: Enrollment,
            attributes: ["enrollment_id"],
            required: false,
          },
          {
            model: Material,
            as: 'materials',
            attributes: ['material_id'],
            required: false,
          }
        ],
        order: [["created_at", "DESC"]],
      }),

      // Get total unique students
      Enrollment.findAll({
        include: [
          {
            model: Course,
            where: { user_id: userId },
            attributes: [],
          }
        ],
        attributes: ['user_id'],
        group: ['user_id'],
      }),

      // Get total enrollments
      Enrollment.count({
        include: [
          {
            model: Course,
            where: { user_id: userId },
            attributes: [],
          }
        ],
      }),

      // Get total materials (chapters)
      Material.count({
        include: [
          {
            model: Course,
            where: { user_id: userId },
            attributes: [],
          }
        ],
      }),

      // Get total lessons
      MaterialDetail.count({
        include: [
          {
            model: Material,
            include: [
              {
                model: Course,
                where: { user_id: userId },
                attributes: [],
              }
            ]
          }
        ],
      }),

      // Get total quizzes
      Quiz.count({
        include: [
          {
            model: Course,
            where: { user_id: userId },
            attributes: [],
          }
        ],
      }),

      // Get total quiz questions
      QuizQuestion.count({
        include: [
          {
            model: Quiz,
            include: [
              {
                model: Course,
                where: { user_id: userId },
                attributes: [],
              }
            ]
          }
        ],
      }),

      // Get total revenue from payments
      Payment.sum('amount', {
        where: { status: 'paid' },
        include: [
          {
            model: Course,
            where: { user_id: userId },
            attributes: [],
          }
        ],
      }),

      // Get average rating from reviews
      Review.findOne({
        attributes: [
          [sequelize.fn('AVG', sequelize.col('rating')), 'avgRating'],
          [sequelize.fn('COUNT', sequelize.col('review_id')), 'totalReviews']
        ],
        include: [
          {
            model: Course,
            where: { user_id: userId },
            attributes: [],
          }
        ],
        raw: true,
      }),

      // Get recent enrollments for activity feed
      Enrollment.findAll({
        include: [
          {
            model: Course,
            where: { user_id: userId },
            attributes: ['course_title'],
          },
          {
            model: User,
            as: 'student',
            attributes: ['first_name', 'last_name'],
          }
        ],
        order: [['created_at', 'DESC']],
        limit: 10,
      })
    ]);

    // Process courses data
    const coursesWithStats = coursesData.map(course => {
      const courseJson = course.toJSON();
      return {
        ...courseJson,
        student_count: courseJson.Enrollments ? courseJson.Enrollments.length : 0,
        material_count: courseJson.materials ? courseJson.materials.length : 0,
        instructor_name: courseJson.instructor 
          ? `${courseJson.instructor.first_name} ${courseJson.instructor.last_name}`.trim()
          : 'Unknown',
        category_name: courseJson.Category?.category_name || 'Uncategorized',
        // Remove nested objects from response to keep it clean
        Enrollments: undefined,
        materials: undefined,
        instructor: undefined,
        Category: undefined,
      };
    });

    // Calculate comprehensive statistics
    const totalCourses = coursesData.length;
    const publishedCourses = coursesData.filter(c => c.publish_status === 1).length;
    const draftCourses = totalCourses - publishedCourses;
    const freeCourses = coursesData.filter(c => c.course_price === 0).length;
    const paidCourses = totalCourses - freeCourses;
    
    const totalStudents = totalStudentsResult.length;
    const averageRating = averageRatingResult?.avgRating ? parseFloat(averageRatingResult.avgRating) : 0;
    const totalReviews = averageRatingResult?.totalReviews || 0;
    
    // Calculate content statistics
    const contentStats = {
      totalMaterials,
      totalLessons,
      totalQuizzes,
      totalQuestions,
      averageQuestionsPerQuiz: totalQuizzes > 0 ? Math.round(totalQuestions / totalQuizzes) : 0,
      averageLessonsPerCourse: totalCourses > 0 ? Math.round(totalLessons / totalCourses) : 0,
    };

    // Financial statistics
    const financialStats = {
      totalRevenue: totalRevenue || 0,
      averageRevenuePerCourse: totalCourses > 0 ? Math.round((totalRevenue || 0) / totalCourses) : 0,
      averageRevenuePerStudent: totalStudents > 0 ? Math.round((totalRevenue || 0) / totalStudents) : 0,
    };

    // Course level distribution
    const courseLevelDistribution = {
      beginner: coursesData.filter(c => c.course_level === 'beginner').length,
      intermediate: coursesData.filter(c => c.course_level === 'intermediate').length,
      advanced: coursesData.filter(c => c.course_level === 'advanced').length,
    };

    // Monthly growth (simplified - you might want to add date filtering)
    const monthlyStats = {
      coursesThisMonth: coursesData.filter(c => {
        const courseDate = new Date(c.created_at);
        const now = new Date();
        return courseDate.getMonth() === now.getMonth() && courseDate.getFullYear() === now.getFullYear();
      }).length,
      enrollmentsThisMonth: recentEnrollments.filter(e => {
        const enrollDate = new Date(e.created_at);
        const now = new Date();
        return enrollDate.getMonth() === now.getMonth() && enrollDate.getFullYear() === now.getFullYear();
      }).length,
    };

    // Recent activity
    const recentActivity = recentEnrollments.map(enrollment => ({
      type: 'enrollment',
      studentName: `${enrollment.student.first_name} ${enrollment.student.last_name}`.trim(),
      courseName: enrollment.course.course_title,
      createdAt: enrollment.created_at,
    }));

    const response = {
      // Basic stats (for backward compatibility)
      stats: {
        totalCourses,
        totalStudents,
        totalEnrollments,
        averageRating: Math.round(averageRating * 10) / 10, // Round to 1 decimal
      },

      // Detailed statistics
      detailedStats: {
        courses: {
          total: totalCourses,
          published: publishedCourses,
          draft: draftCourses,
          free: freeCourses,
          paid: paidCourses,
          levelDistribution: courseLevelDistribution,
        },
        students: {
          total: totalStudents,
          totalEnrollments,
          averageEnrollmentsPerStudent: totalStudents > 0 ? Math.round(totalEnrollments / totalStudents * 10) / 10 : 0,
        },
        content: contentStats,
        financial: financialStats,
        reviews: {
          averageRating: Math.round(averageRating * 10) / 10,
          totalReviews,
        },
        monthly: monthlyStats,
      },

      // Courses data
      courses: coursesWithStats,

      // Recent activity
      recentActivity: recentActivity.slice(0, 5), // Limit to 5 recent activities
    };

    return NextResponse.json(response);

  } catch (error) {
    console.error("Lecturer stats API error:", error);
    return NextResponse.json(
      { error: "Internal Server Error: Failed to load dashboard statistics" },
      { status: 500 }
    );
  }
}