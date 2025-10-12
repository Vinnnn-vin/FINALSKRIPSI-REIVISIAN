// src\app\api\dashboard\student\learn\[enrollmentId]\reset\route.ts
/* eslint-disable @typescript-eslint/no-explicit-any */
import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import { Enrollment, StudentProgress, StudentQuizAnswer } from "@/models";

export async function POST(
  req: NextRequest,
  { params }: { params: { enrollmentId: string } }
) {
  try {
    const session = await getServerSession(authOptions);
    const userId = parseInt((session?.user as any)?.id);
    const enrollmentId = parseInt(params.enrollmentId);

    if (!userId) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    const enrollment = await Enrollment.findOne({ where: { enrollment_id: enrollmentId, user_id: userId } });
    if (!enrollment) return NextResponse.json({ error: "Enrollment not found" }, { status: 404 });
    
    // Hapus semua catatan StudentProgress untuk kursus ini
    await StudentProgress.destroy({ where: { user_id: userId, course_id: enrollment.course_id } });
    
    // Hapus semua jawaban kuis untuk kursus ini
    await StudentQuizAnswer.destroy({ where: { user_id: userId, course_id: enrollment.course_id } });
    
    // Reset timer dan status
    await enrollment.update({
        learning_started_at: null,
        access_expires_at: null,
        status: 'active',
        completed_at: null,
    });

    return NextResponse.json({ success: true, message: "Course progress has been reset." });
  } catch (error) {
    console.error("Reset progress error:", error);
    return NextResponse.json({ error: "Failed to reset progress" }, { status: 500 });
  }
}