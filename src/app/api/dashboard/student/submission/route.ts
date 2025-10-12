// src\app\api\dashboard\student\submission\route.ts
/* eslint-disable @typescript-eslint/no-explicit-any */

import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "../../../auth/[...nextauth]/route";
import { writeFile, mkdir } from "fs/promises";
import path from "path";
import { existsSync } from "fs";
import {
  AssignmentSubmission,
  StudentProgress,
  Enrollment,
  MaterialDetail,
  Material,
} from "@/models";
import sequelize from "@/lib/database";

export async function POST(req: NextRequest) {
  const session = await getServerSession(authOptions);
  if (!session || (session.user as any)?.role !== "student") {
    return NextResponse.json({ error: "Unauthorized" }, { status: 403 });
  }

  const transaction = await sequelize.transaction();

  try {
    const formData = await req.formData();
    const file = formData.get("file") as File | null;
    const submissionText = formData.get("submissionText") as string;

    // Ambil data lain dari form
    const userId = parseInt((session.user as any).id);
    const courseId = parseInt(formData.get("courseId") as string);
    const materialDetailId = parseInt(
      formData.get("materialDetailId") as string
    );
    const enrollmentId = parseInt(formData.get("enrollmentId") as string);

    // [!] Validasi Lengkap (dari file Anda)
    if (!file && !submissionText) {
      return NextResponse.json(
        { error: "Submission content is required (file or text)." },
        { status: 400 }
      );
    }

    // Verifikasi bahwa siswa memang terdaftar dan tugas ini ada di kursus tersebut
    const enrollment = await Enrollment.findOne({
      where: { enrollment_id: enrollmentId, user_id: userId },
    });
    if (!enrollment) {
      return NextResponse.json(
        { error: "Enrollment not found or access denied" },
        { status: 404 }
      );
    }
    const materialDetail = await MaterialDetail.findOne({
      where: { material_detail_id: materialDetailId },
      include: [
        { model: Material, as: "material", where: { course_id: courseId } },
      ],
    });
    if (!materialDetail) {
      return NextResponse.json(
        { error: "Assignment not found in this course" },
        { status: 404 }
      );
    }
    // Selesai verifikasi

    let publicUrl: string | null = null;
    let submissionType: "file" | "text" | "url" = submissionText
      ? "text"
      : "file";

    if (file) {
      submissionType = "file";
      const bytes = await file.arrayBuffer();
      const buffer = Buffer.from(bytes);

      const relativeUploadDir = path.join(
        "uploads",
        "submissions",
        String(courseId)
      );
      const uploadDir = path.join(process.cwd(), "public", relativeUploadDir);

      if (!existsSync(uploadDir)) {
        await mkdir(uploadDir, { recursive: true });
      }

      const uniqueSuffix = `${userId}-${Date.now()}`;
      const originalName = file.name.replace(/[^a-zA-Z0-9.-]/g, "_");
      const fileName = `${uniqueSuffix}-${originalName}`;
      const filePath = path.join(uploadDir, fileName);

      await writeFile(filePath, buffer);
      publicUrl = path
        .join("/", relativeUploadDir, fileName)
        .replace(/\\/g, "/");
    }

    // Dapatkan nomor attempt baru
    const lastSubmission = await AssignmentSubmission.findOne({
      where: { user_id: userId, material_detail_id: materialDetailId },
      order: [["attempt_number", "DESC"]],
    });
    const attemptNumber = lastSubmission
      ? (lastSubmission as any).attempt_number + 1
      : 1;

    // Simpan informasi ke database
    const submission = await AssignmentSubmission.create(
      {
        user_id: userId,
        material_detail_id: materialDetailId,
        course_id: courseId,
        enrollment_id: enrollmentId,
        submission_type: submissionType,
        file_path: publicUrl || undefined,
        submission_text: submissionText || undefined,
        status: "submitted",
        attempt_number: attemptNumber,
      },
      { transaction }
    );

    // [!] KUNCI UTAMA: Perbarui tabel StudentProgress
    // upsert akan membuat record baru jika belum ada, atau memperbarui jika sudah ada.
    await StudentProgress.upsert(
      {
        user_id: userId,
        course_id: courseId,
        material_detail_id: materialDetailId,
        is_completed: true,
        completed_at: new Date(),
      },
      { transaction }
    );

    await transaction.commit();

    return NextResponse.json({
      success: true,
      message: "Assignment submitted successfully!",
      submission,
    });
  } catch (error: any) {
    await transaction.rollback();
    console.error("File submission error:", error);
    return NextResponse.json(
      { error: "Failed to submit assignment" },
      { status: 500 }
    );
  }
}
