// src\app\api\dashboard\lecturer\materi\[courseId]\route.ts
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
  context: { params: { courseId: string } }
) {
  try {
    const { courseId } = await context.params; 
    const id = Number(courseId);

    if (isNaN(id)) {
      return NextResponse.json(
        { error: "Invalid courseId" },
        { status: 400 }
      );
    }

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
                  include: [
                    { model: QuizAnswerOption, as: "answerOptions" },
                  ],
                },
              ],
            },
          ],
        },
      ],
    });

    if (!course) {
      return NextResponse.json(
        { error: "Course not found" },
        { status: 404 }
      );
    }

    return NextResponse.json(course.toJSON());
  } catch (e: any) {
    console.error("GET /materi/:courseId error:", e);
    return NextResponse.json({ error: e.message }, { status: 500 });
  }
}
