// src\app\api\dashboard\student\learn\[enrollmentId]\claim-certificate\route.ts
/* eslint-disable @typescript-eslint/no-explicit-any */

import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import { Enrollment, Certificate, StudentProgress, Quiz, StudentQuizAnswer, MaterialDetail, Material } from "@/models";

export async function POST(
  req: NextRequest,
  { params }: { params: Promise<{ enrollmentId: string }> }
) {
  try {
    const session = await getServerSession(authOptions);
    const userId = parseInt((session?.user as any)?.id);
    
    // Await params sebelum mengakses properties
    const resolvedParams = await params;
    const enrollmentId = parseInt(resolvedParams.enrollmentId);

    if (!userId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }
    
    if (isNaN(enrollmentId)) {
      return NextResponse.json({ error: "Invalid Enrollment ID" }, { status: 400 });
    }

    // Cari enrollment
    const enrollment = await Enrollment.findOne({ 
      where: { 
        enrollment_id: enrollmentId, 
        user_id: userId 
      } 
    });
    
    if (!enrollment) {
      return NextResponse.json({ error: "Enrollment not found" }, { status: 404 });
    }

    const courseId = enrollment.course_id;
    if (!courseId) {
      return NextResponse.json({ error: "Course ID not found in enrollment" }, { status: 500 });
    }

    // Hitung total items di course
    const totalMaterialDetails = await MaterialDetail.count({ 
      include: [{ 
        model: Material, 
        as: 'material', 
        where: { course_id: courseId },
        required: true
      }] 
    });
    
    const totalQuizzes = await Quiz.count({ 
      where: { course_id: courseId } 
    });
    
    const totalItems = totalMaterialDetails + totalQuizzes;

    // Pastikan course punya konten
    if (totalItems === 0) {
      return NextResponse.json({ 
        error: "This course has no content to complete" 
      }, { status: 400 });
    }

    // Hitung completed items
    const completedMaterialDetails = await StudentProgress.count({ 
      where: { 
        user_id: userId, 
        course_id: courseId, 
        is_completed: true 
      } 
    });
    
    // Join dengan Quiz untuk mendapatkan course_id
    const completedQuizzes = await StudentQuizAnswer.count({
      where: { 
        user_id: userId, 
        status: 'passed' 
      },
      include: [{
        model: Quiz,
        as: 'quiz',
        where: { course_id: courseId },
        attributes: [],
        required: true
      }],
      distinct: true,
      col: 'quiz_id'
    });
    
    const completedItems = completedMaterialDetails + completedQuizzes;
    const progress = Math.round((completedItems / totalItems) * 100);

    // Verifikasi progress 100%
    if (progress < 100) {
      return NextResponse.json({ 
        error: `Course is not 100% complete yet. Current progress: ${progress}%` 
      }, { status: 400 });
    }

    // Cek apakah sertifikat sudah ada
    let certificate = await Certificate.findOne({ 
      where: { enrollment_id: enrollmentId } 
    });
    
    if (!certificate) {
      // Buat sertifikat baru
      certificate = await Certificate.create({
        user_id: userId,
        course_id: courseId,
        enrollment_id: enrollmentId,
        certificate_url: `/certificates/${enrollmentId}`, // Placeholder URL
        certificate_number: `CERT-${courseId}-${userId}-${Date.now()}`,
        issued_at: new Date(),
      });
      
      // Update status enrollment menjadi 'completed'
      await enrollment.update({ 
        status: 'completed', 
        completed_at: new Date() 
      });
    }

    return NextResponse.json({ 
      success: true, 
      certificate 
    }, { status: 200 });

  } catch (error) {
    console.error("Claim certificate error:", error);
    return NextResponse.json({ 
      error: "Failed to claim certificate" 
    }, { status: 500 });
  }
}