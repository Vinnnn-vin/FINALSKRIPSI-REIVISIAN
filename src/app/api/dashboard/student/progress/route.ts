// src\app\api\dashboard\student\progress\route.ts
/* eslint-disable @typescript-eslint/no-explicit-any */

import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import {
  Enrollment,
  Course,
  Material,
  MaterialDetail,
  StudentProgress,
} from "@/models";

export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    
    if (!session?.user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const user = session.user as any;
    if (user.role !== "student") {
      return NextResponse.json({ error: "Access denied" }, { status: 403 });
    }

    const body = await request.json();
    const { enrollmentId, courseId, materialDetailId, isCompleted } = body;

    const userId = parseInt(user.id);
    
    if (
      isNaN(userId) || 
      !enrollmentId || 
      !courseId || 
      !materialDetailId ||
      typeof isCompleted !== "boolean"
    ) {
      return NextResponse.json({ error: "Invalid input data" }, { status: 400 });
    }

    // Verify enrollment ownership
    const enrollment = await Enrollment.findOne({
      where: { 
        enrollment_id: parseInt(enrollmentId), 
        user_id: userId,
        ...(Enrollment.rawAttributes.deleted_at && { deleted_at: null }),
      },
      include: [{
        model: Course,
        as: "course",
        required: true,
        where: { 
          course_id: parseInt(courseId),
          ...(Course.rawAttributes.deleted_at && { deleted_at: null }),
        },
      }],
    });

    if (!enrollment) {
      return NextResponse.json(
        { error: "Enrollment not found or access denied" }, 
        { status: 404 }
      );
    }

    // Verify material belongs to this course
    const materialDetail = await MaterialDetail.findOne({
      where: {
        material_detail_id: parseInt(materialDetailId),
        ...(MaterialDetail.rawAttributes.deleted_at && { deleted_at: null }),
      },
      include: [
        {
          model: Material,
          as: "material",
          required: true,
          where: { 
            course_id: parseInt(courseId),
            ...(Material.rawAttributes.deleted_at && { deleted_at: null }),
          },
        },
      ],
    });

    if (!materialDetail) {
      return NextResponse.json(
        { error: "Material not found in this course" },
        { status: 404 }
      );
    }

    // Check if progress record already exists
    let progress = await StudentProgress.findOne({
      where: {
        user_id: userId,
        course_id: parseInt(courseId),
        material_detail_id: parseInt(materialDetailId),
        ...(StudentProgress.rawAttributes?.deleted_at && { deleted_at: null }),
      },
    });

    if (progress) {
      // Update existing progress
      await progress.update({
        is_completed: isCompleted,
        completed_at: isCompleted ? new Date() : null,
        updated_at: new Date(),
      });
    } else {
      // Create new progress record
      progress = await StudentProgress.create({
        user_id: userId,
        course_id: parseInt(courseId),
        material_detail_id: parseInt(materialDetailId),
        is_completed: isCompleted,
        completed_at: isCompleted ? new Date() : null,
      });
    }

    return NextResponse.json({
      message: "Progress saved successfully",
      progress: {
        material_detail_id: parseInt(materialDetailId),
        is_completed: isCompleted,
        completed_at: progress.completed_at,
      }
    });

  } catch (error: any) {
    console.error("Progress API error:", error);
    return NextResponse.json(
      {
        error: "Internal Server Error",
        details: process.env.NODE_ENV === "development" ? error.message : undefined,
      },
      { status: 500 }
    );
  }
}