// src\app\api\dashboard\student\learn\[enrollmentId]\route.ts
/* eslint-disable @typescript-eslint/no-explicit-any */
import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "../../../../auth/[...nextauth]/route";
import {
  Enrollment,
  Course,
  User,
  Material,
  MaterialDetail,
  Quiz,
  StudentProgress,
  StudentQuizAnswer,
  AssignmentSubmission,
} from "@/models";
import { Op } from "sequelize";
import sequelize from "@/lib/database";

export const dynamic = "force-dynamic";

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ enrollmentId: string }> }
) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user || (session.user as any)?.role !== "student") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 403 });
    }

    const userId = parseInt((session.user as any).id);
    const enrollmentId = parseInt((await params).enrollmentId);

    if (isNaN(userId) || isNaN(enrollmentId)) {
      return NextResponse.json(
        { error: "Invalid parameters" },
        { status: 400 }
      );
    }

    let enrollment = await Enrollment.findOne({
      where: { enrollment_id: enrollmentId, user_id: userId },
      include: [
        {
          model: Course,
          as: "course",
          required: true,
          include: [{ model: User, as: "lecturer" }],
        },
      ],
    });

    if (!enrollment) {
      return NextResponse.json(
        { error: "Enrollment not found" },
        { status: 404 }
      );
    }

    console.log("📊 Enrollment Data:", {
      enrollment_id: enrollment.enrollment_id,
      learning_started_at: enrollment.learning_started_at,
      access_expires_at: enrollment.access_expires_at,
    });

    const courseId = (enrollment.toJSON() as any).course.course_id;
    const now = new Date();
    const expiryDate = enrollment.access_expires_at
      ? new Date(enrollment.access_expires_at)
      : null;

    if (expiryDate && expiryDate < now) {
      const transaction = await sequelize.transaction();
      try {
        console.log(
          `Access for enrollment ${enrollmentId} has expired. Resetting progress...`
        );

        await StudentProgress.destroy({
          where: { user_id: userId, course_id: courseId },
          transaction,
        });
        await StudentQuizAnswer.destroy({
          where: { user_id: userId, course_id: courseId },
          transaction,
        });
        await AssignmentSubmission.destroy({
          where: { user_id: userId, course_id: courseId },
          transaction,
        });

        await enrollment.update(
          {
            learning_started_at: null,
            access_expires_at: null,
            status: "active",
            completed_at: null,
          },
          { transaction }
        );

        await transaction.commit();

        enrollment = await Enrollment.findOne({
          where: { enrollment_id: enrollmentId, user_id: userId },
          include: [
            {
              model: Course,
              as: "course",
              required: true,
              include: [{ model: User, as: "instructor" }],
            },
          ],
        });
      } catch (resetError) {
        await transaction.rollback();
        console.error("Failed to auto-reset progress:", resetError);
      }
    }

    const materials = await Material.findAll({
      where: { course_id: courseId },
      include: [
        { model: MaterialDetail, as: "details", required: false },
        { model: Quiz, as: "quizzes", required: false },
      ],
      order: [["material_id", "ASC"]],
    });

    // Calculate progress
    const totalMaterialDetails = await MaterialDetail.count({
      include: [
        {
          model: Material,
          as: "material",
          required: true,
          where: { course_id: courseId },
        },
      ],
    });
    const totalQuizzes = await Quiz.count({ where: { course_id: courseId } });
    const totalItems = totalMaterialDetails + totalQuizzes;

    const completedMaterialDetails = await StudentProgress.count({
      where: { user_id: userId, course_id: courseId, is_completed: true },
      distinct: true,
      col: "material_detail_id",
    });

    const allQuizIdsInCourse = materials.flatMap(
      (m) => m.quizzes?.map((q) => q.quiz_id) || []
    );

    const completedQuizzesResult =
      allQuizIdsInCourse.length > 0
        ? await StudentQuizAnswer.findAll({
            where: {
              user_id: userId,
              status: "passed",
              quiz_id: { [Op.in]: allQuizIdsInCourse },
            },
            attributes: ["quiz_id"],
            group: ["quiz_id"],
          })
        : [];
    const completedQuizzes = completedQuizzesResult.length;

    const completedItems = completedMaterialDetails + completedQuizzes;
    const progressPercentage =
      totalItems > 0 ? Math.round((completedItems / totalItems) * 100) : 0;

    console.log(
      `✅ Progress: ${completedItems}/${totalItems} = ${progressPercentage}%`
    );

    // 🔧 PERBAIKAN: Fetch quiz attempts dengan informasi lengkap
    const quizAttempts =
      allQuizIdsInCourse.length > 0
        ? await StudentQuizAnswer.findAll({
            where: {
              user_id: userId,
              quiz_id: { [Op.in]: allQuizIdsInCourse },
            },
            attributes: [
              "quiz_id",
              [
                sequelize.fn("MAX", sequelize.col("attempt_session")),
                "last_attempt_session",
              ],
            ],
            group: ["quiz_id"],
            raw: true,
          })
        : [];

    const latestAttemptsDetails =
      quizAttempts.length > 0
        ? await StudentQuizAnswer.findAll({
            where: {
              [Op.or]: quizAttempts.map((attempt) => ({
                user_id: userId,
                quiz_id: attempt.quiz_id,
                attempt_session: (attempt as any).last_attempt_session,
              })),
            },
            attributes: ["quiz_id", "score", "status", "attempt_session"],
            group: ["quiz_id", "score", "status", "attempt_session"],
            raw: true,
          })
        : [];

    const quizAttemptsMap = new Map();
    latestAttemptsDetails.forEach((attempt) => {
      quizAttemptsMap.set(attempt.quiz_id, {
        score: attempt.score,
        status: attempt.status,
        attempt_number: attempt.attempt_session,
      });
    });

    // Get completion status for materials
    const allProgressRecords = await StudentProgress.findAll({
      where: { user_id: userId, course_id: courseId, is_completed: true },
      attributes: ["material_detail_id"],
    });

    const submissions = await AssignmentSubmission.findAll({
      where: {
        user_id: userId,
        course_id: courseId,
      },
      order: [["submitted_at", "DESC"]],
      raw: true, // Ambil sebagai plain object
    });

    const submissionMap = new Map();
    submissions.forEach((sub) => {
      // Hanya simpan submission terbaru untuk setiap tugas
      if (!submissionMap.has(sub.material_detail_id)) {
        submissionMap.set(sub.material_detail_id, sub);
      }
    });

    const completionMap = new Map();
    allProgressRecords.forEach((record) =>
      completionMap.set(record.material_detail_id, true)
    );

    // 🔧 PERBAIKAN: Sertakan last_attempt di setiap quiz
    const processedMaterials = materials.map((material) => {
      const materialData = material.toJSON();

      const details = (materialData.details || []).map((detail: any) => ({
        ...detail,
        is_completed: completionMap.has(detail.material_detail_id),
        submission: submissionMap.get(detail.material_detail_id) || null,
      }));

      const quizzes = (materialData.quizzes || []).map((quiz: any) => ({
        ...quiz,
        last_attempt: quizAttemptsMap.get(quiz.quiz_id) || null,
      }));

      return { ...materialData, details, quizzes };
    });

    const responseData = {
      enrollment_id: enrollmentId,
      last_accessed: {
        id: (enrollment.toJSON() as any).last_accessed_item_id,
        type: (enrollment.toJSON() as any).last_accessed_item_type,
      },
      access_expires_at: enrollment.access_expires_at,
      learning_started_at: enrollment.learning_started_at,
      course: {
        ...(enrollment.toJSON() as any).course,
        materials: processedMaterials,
        progress_percentage: progressPercentage,
      },
    };

    return NextResponse.json(responseData);
  } catch (error: any) {
    console.error("Learn API error:", error);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 }
    );
  }
}
