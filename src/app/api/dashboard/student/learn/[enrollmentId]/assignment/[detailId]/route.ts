// src\app\api\dashboard\student\learn\[enrollmentId]\assignment\[detailId]\route.ts
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
  AssignmentSubmission,
} from "@/models";

export async function GET(
  request: NextRequest,
  { params }: { params: { enrollmentId: string; detailId: string } }
) {
  try {
    const session = await getServerSession(authOptions);
    
    if (!session?.user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const user = session.user as any;
    if (user.role !== "student") {
      return NextResponse.json({ error: "Access denied" }, { status: 403 });
    }

    const userId = parseInt(user.id);
    const enrollmentId = parseInt(params.enrollmentId);
    const detailId = parseInt(params.detailId);

    if (isNaN(userId) || isNaN(enrollmentId) || isNaN(detailId)) {
      return NextResponse.json({ error: "Invalid parameters" }, { status: 400 });
    }

    // Build enrollment where clause
    const enrollmentWhere: any = {
      enrollment_id: enrollmentId,
      user_id: userId,
    };

    // Only add deleted_at condition if the attribute exists
    if (Enrollment.rawAttributes.deleted_at) {
      enrollmentWhere.deleted_at = null;
    }

    // Verify enrollment exists and belongs to user
    const enrollment = await Enrollment.findOne({
      where: enrollmentWhere,
      include: [
        {
          model: Course,
          as: "course",
          required: true,
          where: {
            publish_status: 1,
            ...(Course.rawAttributes.deleted_at && { deleted_at: null }),
          },
        },
      ],
    });

    if (!enrollment) {
      return NextResponse.json(
        { error: "Enrollment not found or access denied" },
        { status: 404 }
      );
    }

    const courseId = (enrollment.toJSON() as any).course.course_id;

    // Build assignment where clause
    const assignmentWhere: any = {
      material_detail_id: detailId,
      material_detail_type: 4, // Assignment type
    };

    if (MaterialDetail.rawAttributes.deleted_at) {
      assignmentWhere.deleted_at = null;
    }

    // Get assignment data
    const assignment = await MaterialDetail.findOne({
      where: assignmentWhere,
      include: [
        {
          model: Material,
          as: "material",
          required: true,
          where: {
            course_id: courseId,
            ...(Material.rawAttributes.deleted_at && { deleted_at: null }),
          },
          attributes: ["material_id", "material_name", "material_description"],
        },
      ],
    });

    if (!assignment) {
      return NextResponse.json({ error: "Assignment not found" }, { status: 404 });
    }

    // Build progress where clause
    const progressWhere: any = {
      user_id: userId,
      course_id: courseId,
      material_detail_id: detailId,
      is_completed: true,
    };

    if (StudentProgress.rawAttributes?.deleted_at) {
      progressWhere.deleted_at = null;
    }

    // Check if assignment is completed
    const progress = await StudentProgress.findOne({
      where: progressWhere,
    });

    const assignmentData = assignment.toJSON() as any;

    const history = await AssignmentSubmission.findAll({
      where: {
        user_id: userId,
        material_detail_id: detailId,
      },
      order: [['attempt_number', 'ASC']],
      attributes: ['submission_id', 'attempt_number', 'status', 'score', 'feedback', 'submitted_at'],
    });

    const responseData = {
      material_detail_id: assignmentData.material_detail_id,
      material_detail_name: assignmentData.material_detail_name,
      material_detail_description: assignmentData.material_detail_description,
      materi_detail_url: assignmentData.materi_detail_url || "",
      is_completed: !!progress,
      completed_at: progress?.completed_at || null,
      course_id: courseId,
      course_title: (enrollment.toJSON() as any).course.course_title,
      material: {
        material_id: assignmentData.material.material_id,
        material_name: assignmentData.material.material_name,
        material_description: assignmentData.material.material_description,
      },
      history: history.map(h => h.toJSON()),
    };

    return NextResponse.json(responseData);

  } catch (error: any) {
    console.error("Assignment API error:", error);
    return NextResponse.json(
      {
        error: "Internal Server Error",
        details: process.env.NODE_ENV === "development" ? error.message : undefined,
      },
      { status: 500 }
    );
  }
}