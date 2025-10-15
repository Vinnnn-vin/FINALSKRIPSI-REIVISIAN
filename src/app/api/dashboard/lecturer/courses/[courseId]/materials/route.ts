// src\app\api\dashboard\lecturer\courses\[courseId]\materials\route.ts
/* eslint-disable @typescript-eslint/no-explicit-any */
import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import sequelize from "@/lib/database";
import {
  Course,
  Material,
  MaterialDetail,
  Quiz,
  QuizQuestion,
  QuizAnswerOption,
} from "@/models";

export async function POST(
  req: NextRequest,
  { params }: { params: Promise <{ courseId: string }> }
) {
  const session = await getServerSession(authOptions);
  const lecturerId = (session?.user as any)?.id;
  const courseId = parseInt((await params).courseId, 10);

  // 1. --- Validation and Authorization ---
  if (!session || (session.user as any)?.role !== "lecturer") {
    return NextResponse.json({ error: "Unauthorized" }, { status: 403 });
  }
  if (isNaN(courseId)) {
    return NextResponse.json({ error: "Invalid Course ID" }, { status: 400 });
  }

  const { babs } = await req.json();

  if (!Array.isArray(babs) || babs.length === 0) {
    return NextResponse.json(
      { error: "Materials (babs) data is required and must be an array" },
      { status: 400 }
    );
  }

  // 2. --- Verify Course Ownership ---
  const course = await Course.findOne({
    where: { course_id: courseId, user_id: lecturerId },
  });

  if (!course) {
    return NextResponse.json(
      { error: "Course not found or you do not have permission" },
      { status: 404 }
    );
  }

  const transaction = await sequelize.transaction();

  try {
    // 3. --- Process Each "Bab" and its Content ---
    for (const bab of babs) {
      // Create the Material (Bab)
      const newMaterial = await Material.create(
        {
          course_id: courseId,
          material_name: bab.name,
          material_description: bab.description || "",
        },
        { transaction }
      );

      // Process content items (lessons, quizzes, assignments) for this material
      for (const item of bab.items) {
        switch (item.type) {
          case "lesson":
            await MaterialDetail.create(
              {
                material_id: newMaterial.material_id,
                material_detail_name: item.name,
                material_detail_description: item.description || "",
                material_detail_type:
                  item.lessonType === "video" ? 1 : item.lessonType === "pdf" ? 2 : 3, // 1:Video, 2:PDF, 3:URL
                materi_detail_url: item.url || "", // Note: File uploads need a separate handler
                is_free: item.isFree || false,
              },
              { transaction }
            );
            break;

          case "quiz":
            const newQuiz = await Quiz.create(
              {
                material_id: newMaterial.material_id,
                course_id: courseId,
                quiz_title: item.title,
                quiz_description: item.description || "",
                passing_score: item.passing_score || 70,
                time_limit: item.time_limit || 60,
                max_attempts: item.max_attempts || 1,
              },
              { transaction }
            );

            for (const question of item.questions || []) {
              const newQuestion = await QuizQuestion.create(
                {
                  quiz_id: newQuiz.quiz_id,
                  question_text: question.text,
                  question_type: question.type,
                },
                { transaction }
              );

              for (const option of question.options || []) {
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
            break;

          case "assignment":
            await MaterialDetail.create(
              {
                  material_id: newMaterial.material_id,
                  material_detail_name: item.title,
                  material_detail_description: item.instructions || "",
                  material_detail_type: 4, // 4: Assignment
                  is_free: false,
                  materi_detail_url: ""
              },
              { transaction }
            );
            break;
        }
      }
    }

    await transaction.commit();
    return NextResponse.json(
      { success: true, message: "All materials created successfully" },
      { status: 201 }
    );
  } catch (error: any) {
    await transaction.rollback();
    console.error("Error creating materials:", error);
    return NextResponse.json(
      { error: "Failed to create materials", details: error.message },
      { status: 500 }
    );
  }
}

// [FIX] TAMBAHKAN FUNGSI PUT UNTUK MEMPERBARUI KURIKULUM (UPDATE)
export async function PUT(
  req: NextRequest,
  { params }: { params: { courseId: string } }
) {
  const session = await getServerSession(authOptions);
  const lecturerId = (session?.user as any)?.id;
  const courseId = parseInt(params.courseId, 10);

  if (!session || (session.user as any)?.role !== "lecturer") {
    return NextResponse.json({ error: "Unauthorized" }, { status: 403 });
  }
  if (isNaN(courseId)) {
    return NextResponse.json({ error: "Invalid Course ID" }, { status: 400 });
  }

  const { babs } = await req.json();

  if (!Array.isArray(babs)) {
    return NextResponse.json(
      { error: "Materials data must be an array" },
      { status: 400 }
    );
  }

  const course = await Course.findOne({
    where: { course_id: courseId, user_id: lecturerId },
  });

  if (!course) {
    return NextResponse.json(
      { error: "Course not found or permission denied" },
      { status: 404 }
    );
  }

  const transaction = await sequelize.transaction();
  try {
    // 1. Hapus semua materi lama yang terkait dengan kursus ini
    const oldMaterials = await Material.findAll({ where: { course_id: courseId }, transaction });
    for (const material of oldMaterials) {
        await MaterialDetail.destroy({ where: { material_id: material.material_id }, transaction });
        await Quiz.destroy({ where: { material_id: material.material_id }, transaction });
        await material.destroy({ transaction });
    }

    // 2. Buat ulang semua materi dari data yang baru (sama seperti logika POST)
    for (const bab of babs) {
        const newMaterial = await Material.create({
            course_id: courseId,
            material_name: bab.name,
            material_description: bab.description || "",
        }, { transaction });

        for (const item of bab.items) {
        switch (item.type) {
          case "lesson":
            await MaterialDetail.create(
              {
                material_id: newMaterial.material_id,
                material_detail_name: item.name,
                material_detail_description: item.description || "",
                material_detail_type:
                  item.lessonType === "video" ? 1 : item.lessonType === "pdf" ? 2 : 3, // 1:Video, 2:PDF, 3:URL
                materi_detail_url: item.url || "", // Note: File uploads need a separate handler
                is_free: item.isFree || false,
              },
              { transaction }
            );
            break;

          case "quiz":
            const newQuiz = await Quiz.create(
              {
                material_id: newMaterial.material_id,
                course_id: courseId,
                quiz_title: item.title,
                quiz_description: item.description || "",
                passing_score: item.passing_score || 70,
                time_limit: item.time_limit || 60,
                max_attempts: item.max_attempts || 1,
              },
              { transaction }
            );

            for (const question of item.questions || []) {
              const newQuestion = await QuizQuestion.create(
                {
                  quiz_id: newQuiz.quiz_id,
                  question_text: question.text,
                  question_type: question.type,
                },
                { transaction }
              );

              for (const option of question.options || []) {
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
            break;

          case "assignment":
            await MaterialDetail.create(
              {
                  material_id: newMaterial.material_id,
                  material_detail_name: item.title,
                  material_detail_description: item.instructions || "",
                  material_detail_type: 4, // 4: Assignment
                  is_free: false,
                  materi_detail_url: ""
              },
              { transaction }
            );
            break;
        }
      }
    }

    await transaction.commit();
    return NextResponse.json(
      { success: true, message: "Curriculum updated successfully" },
      { status: 200 }
    );
  } catch (error: any) {
    await transaction.rollback();
    console.error("Error updating materials:", error);
    return NextResponse.json(
      { error: "Failed to update materials", details: error.message },
      { status: 500 }
    );
  }
}