// src\app\api\dashboard\lecturer\materi\route.ts
/* eslint-disable @typescript-eslint/no-explicit-any */

import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "../../../auth/[...nextauth]/route";
import {
  Course,
  Material,
  MaterialDetail,
  Quiz,
  QuizQuestion,
  QuizAnswerOption,
} from "@/models";
import sequelize from "@/lib/database";

export async function POST(request: NextRequest) {
  try {
    // Check session and role
    const session = await getServerSession(authOptions);

    if (!session?.user || (session.user as any)?.role !== "lecturer") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 403 });
    }

    const userId = (session.user as any)?.id;
    const { course_id, material_name, material_description, content } =
      await request.json();

    // Validate required fields
    if (
      !course_id ||
      !material_name?.trim() ||
      !content ||
      !Array.isArray(content)
    ) {
      return NextResponse.json(
        {
          error:
            "Missing required fields: course_id, material_name, and content are required",
        },
        { status: 400 }
      );
    }

    // Verify course belongs to this lecturer
    const course = await Course.findOne({
      where: {
        course_id,
        user_id: userId,
      },
    });

    if (!course) {
      return NextResponse.json(
        { error: "Course not found or access denied" },
        { status: 404 }
      );
    }

    const transaction = await sequelize.transaction();

    try {
      // Create material (chapter)
      const newMaterial = await Material.create(
        {
          course_id,
          material_name: material_name.trim(),
          material_description: material_description?.trim() || "",
        },
        { transaction }
      );

      // Process each content item
      for (let i = 0; i < content.length; i++) {
        const item = content[i];

        if (item.type === "lesson") {
          // Create material detail for lesson
          await MaterialDetail.create(
            {
              material_id: newMaterial.material_id,
              material_detail_name: item.name,
              material_detail_description: item.description || "",
              material_detail_type:
                item.lessonType === "video"
                  ? 1
                  : item.lessonType === "pdf"
                  ? 2
                  : 3, 
              materi_detail_url: item.url || "",
              is_free: item.isFree || false,
            },
            { transaction }
          );
        } else if (item.type === "quiz") {
          // Create quiz
          const newQuiz = await Quiz.create(
            {
              material_id: newMaterial.material_id,
              course_id,
              quiz_title: item.title,
              quiz_description: item.description || "",
              passing_score: item.passing_score,
              time_limit: item.time_limit,
              max_attempts: item.max_attempts,
            },
            { transaction }
          );

          // Create quiz questions and answer options
          if (item.questions && Array.isArray(item.questions)) {
            for (let j = 0; j < item.questions.length; j++) {
              const question = item.questions[j];

              const newQuestion = await QuizQuestion.create(
                {
                  quiz_id: newQuiz.quiz_id,
                  question_text: question.text,
                  question_type: question.type,
                  question_order: j + 1,
                  points: 10, // Default points per question
                },
                { transaction }
              );

              // Create answer options
              if (question.options && Array.isArray(question.options)) {
                for (const option of question.options) {
                  await QuizAnswerOption.create(
                    {
                      quiz_id: newQuiz.quiz_id,
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
        } else if (item.type === "assignment") {
          // Create material detail for assignment
          await MaterialDetail.create(
            {
              material_id: newMaterial.material_id,
              material_detail_name: item.title,
              material_detail_description: item.description || "",
              material_detail_type: 4, // 4: Assignment
              materi_detail_url: "",
              is_free: false, // Assignments are typically not free
            },
            { transaction }
          );
        }
      }

      await transaction.commit();

      return NextResponse.json(
        {
          message: "Material created successfully",
          material_id: newMaterial.material_id,
        },
        { status: 201 }
      );
    } catch (error) {
      await transaction.rollback();
      throw error;
    }
  } catch (error) {
    console.error("Create material error:", error);
    return NextResponse.json(
      { error: "Failed to create material" },
      { status: 500 }
    );
  }
}
