// src\app\api\dashboard\student\learn\[enrollmentId]\start\route.ts
/* eslint-disable @typescript-eslint/no-explicit-any */
import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "../../../../../auth/[...nextauth]/route";
import { Enrollment, Course } from "@/models";

export async function POST(
  req: NextRequest,
  { params }: { params: Promise<{ enrollmentId: string }> }
) {
  try {
    const session = await getServerSession(authOptions);
    const userId = parseInt((session?.user as any)?.id);
    const enrollmentId = parseInt((await params).enrollmentId);

    if (!userId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const enrollment = await Enrollment.findOne({
      where: { enrollment_id: enrollmentId, user_id: userId },
      include: [{ model: Course, as: "course", required: true }],
    });

    if (!enrollment) {
      return NextResponse.json({ error: "Enrollment not found" }, { status: 404 });
    }

    let learningStartedAt = enrollment.learning_started_at;
    let accessExpiresAt = enrollment.access_expires_at;

    // Hanya jalankan jika belum pernah dimulai
    if (enrollment.learning_started_at === null) {
      const courseDuration = (enrollment.course as any)?.course_duration;
      
      if (courseDuration && courseDuration > 0) {
        const now = new Date();
        const expiryDate = new Date(now);
        expiryDate.setDate(now.getDate() + courseDuration);
        
        // Inilah bagian yang melakukan INSERT/UPDATE ke database
        await Enrollment.update(
          {
            learning_started_at: now,
            access_expires_at: expiryDate,
          },
          {
            where: { enrollment_id: enrollmentId, user_id: userId }
          }
        );

        // Simpan nilai baru untuk dikirim kembali
        learningStartedAt = now;
        accessExpiresAt = expiryDate;
      }
    }

    // [!] PERBAIKAN: Kembalikan tanggal yang baru di-update ke frontend
    return NextResponse.json({ 
      success: true, 
      message: "Action completed",
      data: {
        learning_started_at: learningStartedAt,
        access_expires_at: accessExpiresAt,
      }
    });

  } catch (error) {
    console.error("Start learning API error:", error);
    return NextResponse.json({ error: "Failed to start learning" }, { status: 500 });
  }
}