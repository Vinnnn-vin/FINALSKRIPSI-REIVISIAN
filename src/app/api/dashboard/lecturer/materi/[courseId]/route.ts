/* eslint-disable @typescript-eslint/no-explicit-any */
import { NextResponse } from "next/server";
import {
  Course,
  Material,
  MaterialDetail,
  Quiz,
  QuizQuestion,
  QuizAnswerOption,
  Assignment,
} from "@/models";

export async function GET(
  req: Request,
  context: { params: Promise<{ courseId: string }> }
) {
  try {
    const { courseId } = await context.params;
    const id = Number(courseId);

    if (isNaN(id)) {
      return NextResponse.json({ error: "Invalid courseId" }, { status: 400 });
    }

    // ==============================
    // 🔍 FETCH COURSE + RELATIONS
    // ==============================
    const course = await Course.findByPk(id, {
      include: [
        {
          model: Material,
          as: "materials",
          include: [
            {
              model: MaterialDetail,
              as: "details",
              include: [{ model: Assignment, as: "assignment" }],
            },
            {
              model: Quiz,
              as: "quizzes",
              include: [
                {
                  model: QuizQuestion,
                  as: "questions",
                  include: [{ model: QuizAnswerOption, as: "answerOptions" }],
                },
              ],
            },
          ],
        },
      ],
    });

    // ==============================
    // 🔍 DEBUG LOGGING
    // ==============================
    console.log("=== DEBUG QUIZ RELATIONS ===");

    if (!course) {
      console.log("❌ Course tidak ditemukan");
      return NextResponse.json({ error: "Course not found" }, { status: 404 });
    }

    console.log(
      `📘 Course ID: ${course.course_id}, Title: ${course.course_title}`
    );
    console.log(`Jumlah Material: ${course.materials?.length || 0}`);

    for (const m of course.materials || []) {
      console.log(`\n🧩 Material ${m.material_id}: ${m.material_name}`);
      if (!m.quizzes?.length) {
        console.log("⚠️ Tidak ada quiz di material ini");
        continue;
      }

      for (const q of m.quizzes) {
        console.log(`\n📝 Quiz ID: ${q.quiz_id}, Judul: ${q.quiz_title}`);
        console.log(`Deskripsi: ${q.quiz_description}`);
        console.log(`Jumlah pertanyaan: ${q.questions?.length || 0}`);

        if (!q.questions?.length) {
          console.log("⚠️ Quiz ini tidak memiliki pertanyaan (questions = [])");
        } else {
          for (const question of q.questions) {
            console.log(
              `  ❓Q${question.question_id}: ${question.question_text}`
            );
            console.log(`    Tipe: ${question.question_type}`);
            console.log(
              `    Jumlah opsi: ${question.answerOptions?.length || 0}`
            );
            if (!question.answerOptions?.length) {
              console.log("    ⚠️ Tidak ada opsi jawaban untuk pertanyaan ini");
            } else {
              for (const opt of question.answerOptions) {
                console.log(
                  `    - ${opt.option_text} ${opt.is_correct ? "✅" : ""}`
                );
              }
            }
          }
        }
      }
    }

    console.log("\n=== TEST SINGLE QUIZ ===");

    // ==============================
    // 🔍 TEST LANGSUNG QUIZ ID TERTENTU
    // ==============================
    const testQuiz = await Quiz.findByPk(41, {
      include: [
        {
          model: QuizQuestion,
          as: "questions",
          include: [{ model: QuizAnswerOption, as: "answerOptions" }],
        },
      ],
    });

    if (testQuiz) {
      console.log(
        `Quiz ID: ${testQuiz.quiz_id}, Judul: ${testQuiz.quiz_title}`
      );
      console.log(`Jumlah pertanyaan: ${testQuiz.questions?.length || 0}`);

      for (const question of testQuiz.questions || []) {
        console.log(`  ❓ ${question.question_text}`);
        for (const opt of question.answerOptions || []) {
          console.log(`    - ${opt.option_text} ${opt.is_correct ? "✅" : ""}`);
        }
      }
    } else {
      console.log("⚠️ Quiz dengan ID 41 tidak ditemukan");
    }

    console.log("=== END DEBUG ===");

    // ==============================
    // ✅ RETURN RESPONSE
    // ==============================
    return NextResponse.json(course.toJSON());
  } catch (e: any) {
    console.error("GET /materi/:courseId error:", e);
    return NextResponse.json({ error: e.message }, { status: 500 });
  }
}
