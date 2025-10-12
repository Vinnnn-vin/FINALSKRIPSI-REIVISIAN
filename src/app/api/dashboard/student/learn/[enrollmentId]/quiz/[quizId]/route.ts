// src\app\api\dashboard\student\learn\[enrollmentId]\quiz\[quizId]\route.ts
/* eslint-disable @typescript-eslint/no-explicit-any */
import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import {
  Enrollment,
  Course,
  Material,
  Quiz,
  QuizQuestion,
  QuizAnswerOption,
} from "@/models";

export async function GET(
  request: NextRequest,
  { params }: { params: { enrollmentId: string; quizId: string } }
) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user || (session.user as any)?.role !== "student") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 403 });
    }

    const userId = parseInt((session.user as any).id);
    const enrollmentId = parseInt(params.enrollmentId);
    const quizId = parseInt(params.quizId);

    if (isNaN(userId) || isNaN(enrollmentId) || isNaN(quizId)) {
      return NextResponse.json({ error: "Invalid parameters" }, { status: 400 });
    }

    // 1. Verifikasi bahwa mahasiswa terdaftar di kursus ini
    const enrollment = await Enrollment.findOne({
      where: { enrollment_id: enrollmentId, user_id: userId },
      include: [{ model: Course, as: "course", required: true }],
    });

    if (!enrollment) {
      return NextResponse.json({ error: "Enrollment not found or access denied" }, { status: 404 });
    }
    const enrollmentData = enrollment.toJSON() as any;
    const courseId = enrollmentData.course.course_id;

    // 2. Ambil data kuis dengan query yang lebih sederhana dan aman
    const quiz = await Quiz.findOne({
      where: {
        quiz_id: quizId,
        course_id: courseId, // Langsung verifikasi kuis ini milik kursus yang benar
      },
      include: [
        {
          model: Material, // Kita tetap butuh ini untuk nama Bab
          as: "material",
          attributes: ["material_name"],
        },
        {
          model: QuizQuestion,
          as: "questions",
          required: false,
          order: [["question_order", "ASC"]],
          include: [
            {
              model: QuizAnswerOption,
              as: "answerOptions", // Alias yang benar sesuai model
              required: false,
              attributes: ["option_id", "option_text"], // Hanya kirim data yang aman
            },
          ],
        },
      ],
    });

    if (!quiz) {
      return NextResponse.json({ error: "Quiz not found for this course" }, { status: 404 });
    }

    // 3. Susun data respons agar cocok 100% dengan frontend
    const quizData = quiz.toJSON() as any;
    const responseData = {
      quiz_id: quizData.quiz_id,
      quiz_title: quizData.quiz_title,
      quiz_description: quizData.quiz_description || "",
      passing_score: quizData.passing_score || 70,
      time_limit: quizData.time_limit || 0,
      max_attempts: quizData.max_attempts || 0,
      course_title: enrollmentData.course.course_title,
      material_name: quizData.material?.material_name || "General Quiz",
      questions: (quizData.questions || []).map((q: any) => ({
        question_id: q.question_id,
        question_text: q.question_text,
        question_type: q.question_type,
        question_order: q.question_order || 0,
        points: q.points || 10,
        answerOptions: q.answerOptions || [], // Sesuaikan dengan nama properti di frontend
      })),
    };

    return NextResponse.json(responseData);

  } catch (error: any) {
    console.error("Quiz API server error:", error); // Log error asli di server
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}