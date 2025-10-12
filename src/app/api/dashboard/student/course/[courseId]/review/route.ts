// src\app\api\dashboard\student\course\[courseId]\review\route.ts
/* eslint-disable @typescript-eslint/no-explicit-any */
import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import { Review, Enrollment, MaterialDetail, Material, Quiz, StudentProgress, StudentQuizAnswer } from "@/models";

export async function POST(
  req: NextRequest,
  { params }: { params: Promise<{ courseId: string }> }
) {
  try {
    const session = await getServerSession(authOptions);
    const userId = parseInt((session?.user as any)?.id);
    
    // Await params sebelum mengakses properties
    const resolvedParams = await params;
    const courseId = parseInt(resolvedParams.courseId);

    if (!userId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    if (isNaN(courseId)) {
      return NextResponse.json({ error: "Invalid Course ID" }, { status: 400 });
    }

    const { rating, review_text } = await req.json();
    
    // Validasi rating
    if (!rating || rating < 1 || rating > 5) {
      return NextResponse.json({ error: "Rating must be between 1 and 5" }, { status: 400 });
    }

    // Verifikasi siswa terdaftar di kursus ini
    const enrollment = await Enrollment.findOne({ 
      where: { user_id: userId, course_id: courseId } 
    });
    
    if (!enrollment) {
      return NextResponse.json({ error: "You must be enrolled in this course" }, { status: 403 });
    }

    // Hitung progress untuk memverifikasi 100% completion
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

    // Jika tidak ada konten, tidak bisa review
    if (totalItems === 0) {
      return NextResponse.json({ error: "This course has no content" }, { status: 400 });
    }

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

    // Verifikasi progress harus 100%
    if (progress < 100) {
      return NextResponse.json({ 
        error: `You must complete the course before leaving a review. Current progress: ${progress}%` 
      }, { status: 403 });
    }

    // Cek apakah sudah pernah review
    const existingReview = await Review.findOne({ 
      where: { user_id: userId, course_id: courseId } 
    });
    
    if (existingReview) {
      return NextResponse.json({ error: "You have already reviewed this course" }, { status: 409 });
    }

    // Buat review baru
    const newReview = await Review.create({
      user_id: userId,
      course_id: courseId,
      rating,
      review_text: review_text || "",
    });

    return NextResponse.json({ 
      success: true, 
      review: newReview 
    }, { status: 201 });

  } catch (error) {
    console.error("Submit review error:", error);
    return NextResponse.json({ 
      error: "Failed to submit review" 
    }, { status: 500 });
  }
}