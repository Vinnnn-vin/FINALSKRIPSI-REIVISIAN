// src\app\api\dashboard\student\route.ts
/* eslint-disable @typescript-eslint/no-explicit-any */

import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "../../auth/[...nextauth]/route";
import {
  Course,
  Enrollment,
  Category,
  User,
  StudentProgress,
  Material,
  MaterialDetail,
  Certificate,
  Quiz,
  StudentQuizAnswer,
  AssignmentSubmission,
  Review,
} from "@/models";
import { Op } from "sequelize";

export async function GET() {
  try {
    const session = await getServerSession(authOptions);

    type SessionUser = {
      id: string;
      role: string;
      name?: string | null;
      email?: string | null;
    };

    const user = session?.user as SessionUser;

    if (!user || user.role !== "student") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 403 });
    }

    const userId = parseInt(user.id);

    if (!userId || isNaN(userId)) {
      return NextResponse.json(
        { error: "Invalid user ID in session" },
        { status: 400 }
      );
    }

    console.log("Fetching dashboard data for user:", userId);

    const enrolledCoursesData = await Enrollment.findAll({
      where: {
        user_id: userId,
        deleted_at: null,
      } as any,
      include: [
        {
          model: Course,
          as: "course",
          required: true,
          where: {
            publish_status: 1,
            deleted_at: null,
          },
          include: [
            {
              model: User,
              as: "lecturer",
              attributes: ["user_id", "first_name", "last_name"],
              required: false,
            },
            {
              model: Category,
              as: "category",
              attributes: ["category_id", "category_name"],
              required: false,
            },
          ],
        },
      ],
      order: [["created_at", "DESC"]],
    });

    // Transform enrolled courses with progress calculation
    const enrolledCourses = await Promise.all(
      enrolledCoursesData.map(async (enrollment) => {
        const enrollmentData = enrollment.toJSON() as any;
        const course = enrollmentData.course;

        if (!course) {
          console.warn(
            `Course not found for enrollment ${enrollment.enrollment_id}`
          );
          return null;
        }

        try {
          // [!] LANGKAH 1: Hitung total semua item yang bisa diselesaikan
          const totalMaterialDetails = await MaterialDetail.count({
            include: [
              {
                model: Material,
                as: "material",
                required: true,
                where: { course_id: course.course_id },
              },
            ],
          });

          // Hitung total kuis
          const totalQuizzes = await Quiz.count({
            where: { course_id: course.course_id },
          });

          const totalItems = totalMaterialDetails + totalQuizzes;
          console.log(
            `Course ${course.course_id}: Total Items = ${totalItems} (Details: ${totalMaterialDetails}, Quizzes: ${totalQuizzes})`
          );

          // [!] LANGKAH 2: Hitung total item yang sudah selesai
          // Hitung materi/tugas yang selesai dari StudentProgress
          const completedMaterialDetails = await StudentProgress.count({
            where: {
              user_id: userId,
              course_id: course.course_id,
              is_completed: true,
            },
            distinct: true,
            col: "material_detail_id",
          });

          // Hitung kuis yang sudah lulus (status 'passed') dari StudentQuizAnswer
          const completedQuizzesResult = await StudentQuizAnswer.findAll({
            where: {
              user_id: userId,
              quiz_id: {
                [Op.in]: (
                  await Quiz.findAll({
                    where: { course_id: course.course_id },
                    attributes: ["quiz_id"],
                  })
                ).map((q) => q.quiz_id),
              },
              status: "passed", // Asumsi status 'passed' ada saat lulus
            },
            attributes: ["quiz_id"],
            group: ["quiz_id"],
          });
          const completedQuizzes = completedQuizzesResult.length;

          const completedItems = completedMaterialDetails + completedQuizzes;
          console.log(
            `Course ${course.course_id}: Completed Items = ${completedItems} (Details: ${completedMaterialDetails}, Quizzes: ${completedQuizzes})`
          );

          // Get total material details count for this course
          const totalMaterials = await MaterialDetail.count({
            include: [
              {
                model: Material,
                as: "material",
                required: true,
                where: {
                  course_id: course.course_id,
                  ...(Material.rawAttributes.deleted_at && {
                    deleted_at: null,
                  }),
                },
              },
            ],
            where: {
              ...(MaterialDetail.rawAttributes.deleted_at && {
                deleted_at: null,
              }),
            },
          });

          console.log(
            `Course ${course.course_id} total materials:`,
            totalMaterials
          );

          // Get completed materials count - find unique material_detail_ids that are completed
          const completedProgressRecords = await StudentProgress.findAll({
            where: {
              user_id: userId,
              course_id: course.course_id,
              material_detail_id: {
                [Op.ne]: null,
              },
              is_completed: true,
              ...(StudentProgress.rawAttributes.deleted_at && {
                deleted_at: null,
              }),
            } as any,
            attributes: ["material_detail_id"],
            group: ["material_detail_id"],
          });

          const completedMaterials = completedProgressRecords.length;
          console.log(
            `Course ${course.course_id} completed materials:`,
            completedMaterials
          );

          // Calculate progress percentage
          const progress =
            totalItems > 0
              ? Math.round((completedItems / totalItems) * 100)
              : 0;
          console.log(
            `Course ${course.course_id} final progress: ${progress}%`
          );

          const existingReview = await Review.findOne({
                where: { user_id: userId, course_id: course.course_id }
            });

          return {
            enrollment_id: enrollmentData.enrollment_id,
            enrollment_date:
              enrollmentData.enrolled_at || enrollmentData.created_at,
            status: enrollmentData.status,
            last_accessed: enrollmentData.updated_at,
            course: {
              course_id: course.course_id,
              course_title: course.course_title,
              course_description: course.course_description,
              course_level: course.course_level,
              course_price: course.course_price,
              course_duration: course.course_duration,
              thumbnail_url: course.thumbnail_url,
              created_at: course.created_at,
              progress: progress,
              has_reviewed: !!existingReview,
              totalMaterials: totalItems,
              completedMaterials: completedMaterials,
              instructor: {
                user_id: course.instructor?.user_id,
                first_name: course.instructor?.first_name || "Unknown",
                last_name: course.instructor?.last_name || "Instructor",
              },
              category: {
                category_id: course.category?.category_id,
                category_name:
                  course.category?.category_name || "Uncategorized",
              },
            },
          };
        } catch (progressError) {
          console.error(
            `Error calculating progress for course ${course.course_id}:`,
            progressError
          );
          return {
            enrollment_id: enrollmentData.enrollment_id,
            enrollment_date:
              enrollmentData.enrolled_at || enrollmentData.created_at,
            status: enrollmentData.status,
            last_accessed: enrollmentData.updated_at,
            course: {
              course_id: course.course_id,
              course_title: course.course_title,
              course_description: course.course_description,
              course_level: course.course_level,
              course_price: course.course_price,
              course_duration: course.course_duration,
              thumbnail_url: course.thumbnail_url,
              created_at: course.created_at,
              progress: 0,
              totalMaterials: 0,
              completedMaterials: 0,
              instructor: {
                user_id: course.instructor?.user_id,
                first_name: course.instructor?.first_name || "Unknown",
                last_name: course.instructor?.last_name || "Instructor",
              },
              category: {
                category_id: course.category?.category_id,
                category_name:
                  course.category?.category_name || "Uncategorized",
              },
            },
          };
        }
      })
    );

    const validEnrolledCourses = enrolledCourses.filter(
      (course) => course !== null
    );

    // Get available courses (not enrolled)
    const enrolledCourseIds = validEnrolledCourses
      .map((e: any) => e.course?.course_id)
      .filter((id) => id && !isNaN(id));

    const availableCoursesData = await Course.findAll({
      where: {
        publish_status: 1,
        deleted_at: null,
        ...(enrolledCourseIds.length > 0 && {
          course_id: {
            [Op.notIn]: enrolledCourseIds,
          },
        }),
      } as any,
      include: [
        {
          model: User,
          as: "lecturer",
          attributes: ["user_id", "first_name", "last_name"],
          required: false,
        },
        {
          model: Category,
          as: "category",
          attributes: ["category_id", "category_name"],
          required: false,
        },
      ],
      order: [["created_at", "DESC"]],
      limit: 10,
    });

    // Transform available courses
    const availableCourses = availableCoursesData.map((course) => {
      const courseData = course.toJSON() as any;
      return {
        course_id: courseData.course_id,
        course_title: courseData.course_title,
        course_description: courseData.course_description,
        course_level: courseData.course_level,
        course_price: courseData.course_price,
        course_duration: courseData.course_duration,
        thumbnail_url: courseData.thumbnail_url,
        created_at: courseData.created_at,
        instructor: {
          user_id: courseData.instructor?.user_id,
          first_name: courseData.instructor?.first_name || "Unknown",
          last_name: courseData.instructor?.last_name || "Instructor",
        },
        category: {
          category_id: courseData.category?.category_id,
          category_name: courseData.category?.category_name || "Uncategorized",
        },
      };
    });

    // Calculate statistics
    const totalEnrolled = validEnrolledCourses.length;

    // Calculate completed courses based on 100% progress
    const totalCompleted = validEnrolledCourses.filter(
      (course: any) => course.course?.progress === 100
    ).length;

    const totalCertificates = await Certificate.count({
      where: {
        user_id: userId,
        ...(Certificate.rawAttributes.deleted_at && {
          deleted_at: null,
        }),
      },
    });

    // Get user data
    const userData = await User.findByPk(userId, {
      attributes: ["user_id", "first_name", "last_name", "email", "created_at"],
    });

    const responseData = {
      user: {
        user_id: userId,
        first_name:
          userData?.first_name || user.name?.split(" ")[0] || "Student",
        last_name: userData?.last_name || user.name?.split(" ")[1] || "",
        email: userData?.email || user.email,
        member_since: userData?.created_at,
      },
      stats: {
        totalEnrolled,
        totalCompleted,
        totalCertificates,
      },
      enrolledCourses: validEnrolledCourses,
      availableCourses,
    };

    return NextResponse.json(responseData);
  } catch (error) {
    console.error("Student dashboard API error:", error);

    if (error instanceof Error) {
      console.error("Error details:", {
        message: error.message,
        stack: error.stack,
        name: error.name,
      });
    }

    return NextResponse.json(
      {
        error: "Internal Server Error",
        details:
          process.env.NODE_ENV === "development"
            ? error instanceof Error
              ? error.message
              : String(error)
            : undefined,
      },
      { status: 500 }
    );
  }
}
