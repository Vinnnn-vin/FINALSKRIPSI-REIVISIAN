// src\app\api\dashboard\lecturer\quiz\[quizId]\route.ts
/* eslint-disable @typescript-eslint/no-explicit-any */

import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "../../../../auth/[...nextauth]/route";
import { Course, Quiz, QuizQuestion, QuizAnswerOption } from "@/models";
import sequelize from "@/lib/database";

// Helper function to verify quiz ownership
async function verifyQuizOwner(lecturerId: string, quizId: number) {
  const quiz = await Quiz.findOne({
    where: { quiz_id: quizId },
    include: [
      {
        model: Course,
        where: { user_id: lecturerId },
        required: true,
      },
    ],
  });
  return quiz;
}

// PUT: Update quiz
export async function PUT(
  request: NextRequest,
  { params }: { params: { quizId: string } }
) {
  try {
    const session = await getServerSession(authOptions);

    if (!session?.user || (session.user as any)?.role !== "lecturer") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 403 });
    }

    const lecturerId = (session.user as any)?.id;
    const quizId = parseInt(params.quizId, 10);

    if (isNaN(quizId)) {
      return NextResponse.json({ error: "Invalid quiz ID" }, { status: 400 });
    }

    const quiz = await verifyQuizOwner(lecturerId, quizId);
    if (!quiz) {
      return NextResponse.json(
        {
          error: "Quiz not found or access denied",
        },
        { status: 404 }
      );
    }

    const {
      quiz_title,
      quiz_description,
      passing_score,
      time_limit,
      max_attempts,
      questions,
    } = await request.json();

    if (!quiz_title?.trim()) {
      return NextResponse.json(
        {
          error: "Quiz title is required",
        },
        { status: 400 }
      );
    }

    const transaction = await sequelize.transaction();

    try {
      // Update quiz basic info
      await Quiz.update(
        {
          quiz_title: quiz_title.trim(),
          quiz_description: quiz_description?.trim() || "",
          passing_score: passing_score || 70,
          time_limit: time_limit || null,
          max_attempts: max_attempts || 3,
        },
        {
          where: { quiz_id: quizId },
          transaction,
        }
      );

      // If questions are provided, update them
      if (questions && Array.isArray(questions)) {
        // Delete existing questions and options
        await QuizAnswerOption.destroy({
          where: { quiz_id: quizId },
          transaction,
        });

        await QuizQuestion.destroy({
          where: { quiz_id: quizId },
          transaction,
        });

        // Create new questions and options
        for (let i = 0; i < questions.length; i++) {
          const question = questions[i];

          const newQuestion = await QuizQuestion.create(
            {
              quiz_id: quizId,
              question_text: question.text,
              question_type: question.type,
              question_order: i + 1,
              points: 10,
            },
            { transaction }
          );

          if (question.options && Array.isArray(question.options)) {
            for (const option of question.options) {
              await QuizAnswerOption.create(
                {
                  quiz_id: quizId,
                  question_id: newQuestion.question_id,
                  option_text: option.text,
                  is_correct: option.is_correct || false,
                },
                { transaction }
              );
            }
          }
        }
      }

      await transaction.commit();

      return NextResponse.json({
        message: "Quiz updated successfully",
      });
    } catch (error) {
      await transaction.rollback();
      throw error;
    }
  } catch (error) {
    console.error("Update quiz error:", error);
    return NextResponse.json(
      { error: "Failed to update quiz" },
      { status: 500 }
    );
  }
}

// DELETE: Delete quiz and all related data
export async function DELETE(
  request: NextRequest,
  { params }: { params: { quizId: string } }
) {
  try {
    const session = await getServerSession(authOptions);

    if (!session?.user || (session.user as any)?.role !== "lecturer") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 403 });
    }

    const lecturerId = (session.user as any)?.id;
    const quizId = parseInt(params.quizId, 10);

    if (isNaN(quizId)) {
      return NextResponse.json({ error: "Invalid quiz ID" }, { status: 400 });
    }

    const quiz = await verifyQuizOwner(lecturerId, quizId);
    if (!quiz) {
      return NextResponse.json(
        {
          error: "Quiz not found or access denied",
        },
        { status: 404 }
      );
    }

    const transaction = await sequelize.transaction();

    try {
      // Delete quiz answer options first
      await QuizAnswerOption.destroy({
        where: { quiz_id: quizId },
        transaction,
      });

      // Delete quiz questions
      await QuizQuestion.destroy({
        where: { quiz_id: quizId },
        transaction,
      });

      // Delete quiz
      await quiz.destroy({ transaction });

      await transaction.commit();

      return NextResponse.json({
        message: "Quiz deleted successfully",
      });
    } catch (error) {
      await transaction.rollback();
      throw error;
    }
  } catch (error) {
    console.error("Delete quiz error:", error);
    return NextResponse.json(
      { error: "Failed to delete quiz" },
      { status: 500 }
    );
  }
}

// GET: Get quiz with questions and options
export async function GET(
  request: NextRequest,
  { params }: { params: { quizId: string } }
) {
  try {
    const session = await getServerSession(authOptions);

    if (!session?.user || (session.user as any)?.role !== "lecturer") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 403 });
    }

    const lecturerId = (session.user as any)?.id;
    const quizId = parseInt(params.quizId, 10);

    if (isNaN(quizId)) {
      return NextResponse.json({ error: "Invalid quiz ID" }, { status: 400 });
    }

    const quiz = await Quiz.findOne({
      where: { quiz_id: quizId },
      include: [
        {
          model: Course,
          where: { user_id: lecturerId },
          required: true,
        },
        {
          model: QuizQuestion,
          as: "questions",
          include: [
            {
              model: QuizAnswerOption,
              as: "answerOptions",
            },
          ],
          order: [["question_order", "ASC"]],
        },
      ],
    });

    if (!quiz) {
      return NextResponse.json(
        {
          error: "Quiz not found or access denied",
        },
        { status: 404 }
      );
    }

    return NextResponse.json(quiz);
  } catch (error) {
    console.error("Get quiz error:", error);
    return NextResponse.json({ error: "Failed to get quiz" }, { status: 500 });
  }
}
