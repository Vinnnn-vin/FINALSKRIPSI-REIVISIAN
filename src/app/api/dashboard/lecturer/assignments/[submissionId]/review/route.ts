// src\app\api\dashboard\lecturer\assignments\[submissionId]\review\route.ts

/* eslint-disable @typescript-eslint/no-explicit-any */
import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import { AssignmentSubmission, Course, StudentProgress } from "@/models";

export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ submissionId: string }> }
) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user || (session.user as any)?.role !== "lecturer") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 403 });
    }

    const instructorId = parseInt((session.user as any).id);
    const submissionId = parseInt((await params).submissionId);

    if (isNaN(submissionId)) {
      return NextResponse.json(
        { error: "Invalid submission ID" },
        { status: 400 }
      );
    }

    const body = await request.json();
    const { status, score, feedback } = body;
    const PASSING_SCORE = 75;

    // ... (Validasi input 'status' dan 'score' tetap sama)

    const submission = await AssignmentSubmission.findByPk(submissionId);
    if (!submission) {
      return NextResponse.json(
        { error: "Submission not found" },
        { status: 404 }
      );
    }

    // Pastikan course_id ada sebelum melanjutkan
    const courseId = submission.get("course_id");
    if (!courseId) {
      return NextResponse.json(
        { error: "Submission data is corrupted; missing course_id." },
        { status: 500 }
      );
    }

    const course = await Course.findOne({
      where: { course_id: courseId, user_id: instructorId },
    });
    if (!course) {
      return NextResponse.json(
        { error: "You don't have permission to review this submission" },
        { status: 403 }
      );
    }

    let isConsideredComplete = false;
    if (status === "approved" && score >= PASSING_SCORE) {
      isConsideredComplete = true;
    }

    // Update submission di database
    await submission.update({
      status: status,
      score: score,
      feedback: feedback || null,
      reviewed_by: instructorId,
      reviewed_at: new Date(),
    });

    // [!] PERBAIKAN: Gunakan 'null' bukan 'undefined'
    await StudentProgress.upsert({
      user_id: submission.user_id,
      course_id: courseId,
      material_detail_id: submission.material_detail_id,
      is_completed: isConsideredComplete,
      completed_at: isConsideredComplete ? new Date() : new Date(),
    });

    return NextResponse.json({
      message: `Assignment has been graded successfully.`,
      submission: {
        submission_id: submission.submission_id,
        status: status,
        score: score,
      },
    });
  } catch (error: any) {
    console.error("Review submission error:", error);
    return NextResponse.json(
      { error: "Failed to review submission" },
      { status: 500 }
    );
  }
}
