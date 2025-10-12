// src\app\api\dashboard\lecturer\assignments\[submissionId]\route.ts
/* eslint-disable @typescript-eslint/no-explicit-any */
import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import {
  AssignmentSubmission,
  Course,
  User,
  MaterialDetail,
  Material,
} from "@/models";

export async function GET(
  request: NextRequest,
  { params }: { params: { submissionId: string } }
) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const user = session.user as any;
    const submissionId = parseInt(params.submissionId);

    if (isNaN(submissionId)) {
      return NextResponse.json(
        { error: "Invalid submission ID" },
        { status: 400 }
      );
    }

    // Get submission with all related data
    const submission = await AssignmentSubmission.findByPk(submissionId, {
      include: [
        {
          model: User,
          as: "student",
          attributes: ["user_id", "first_name", "last_name", "email"],
          required: true,
        },
        {
          model: Course,
          as: "course",
          attributes: ["course_id", "course_title"],
          required: true,
        },
        {
          model: MaterialDetail,
          as: "materialDetail",
          attributes: [
            "material_detail_id",
            "material_detail_name",
            "material_detail_description",
          ],
          required: true,
          include: [
            {
              model: Material,
              as: "material",
              attributes: ["material_id", "material_name"],
              required: true,
            },
          ],
        },
        {
          model: User,
          as: "reviewer",
          attributes: ["user_id", "first_name", "last_name"],
          required: false,
        },
      ],
    });

    if (!submission) {
      return NextResponse.json(
        { error: "Submission not found" },
        { status: 404 }
      );
    }

    const submissionData = submission.toJSON() as any;

    // Verify access (instructor or student who submitted)
    const instructorId = parseInt(user.id);
    const isInstructor = user.role === "lecturer";
    const isStudent = user.role === "student" && submissionData.user_id === instructorId;

    if (isInstructor) {
      // Verify instructor owns this course
      const course = await Course.findOne({
        where: {
          course_id: submissionData.course_id,
          user_id: instructorId,
        },
      });

      if (!course) {
        return NextResponse.json(
          { error: "Access denied" },
          { status: 403 }
        );
      }
    } else if (!isStudent) {
      return NextResponse.json({ error: "Access denied" }, { status: 403 });
    }

    // Get all submissions for this assignment by this student
    const allSubmissions = await AssignmentSubmission.findAll({
      where: {
        user_id: submissionData.user_id,
        material_detail_id: submissionData.material_detail_id,
      },
      order: [["attempt_number", "ASC"]],
      attributes: [
        "submission_id",
        "attempt_number",
        "status",
        "score",
        "submitted_at",
        "reviewed_at",
      ],
    });

    return NextResponse.json({
      submission: {
        submission_id: submissionData.submission_id,
        student: {
          user_id: submissionData.student.user_id,
          name: `${submissionData.student.first_name} ${submissionData.student.last_name}`,
          email: submissionData.student.email,
        },
        course: {
          course_id: submissionData.course.course_id,
          course_title: submissionData.course.course_title,
        },
        assignment: {
          material_detail_id: submissionData.materialDetail.material_detail_id,
          name: submissionData.materialDetail.material_detail_name,
          description: submissionData.materialDetail.material_detail_description,
          material_name: submissionData.materialDetail.material?.material_name,
        },
        submission_type: submissionData.submission_type,
        file_path: submissionData.file_path,
        submission_url: submissionData.submission_url,
        submission_text: submissionData.submission_text,
        attempt_number: submissionData.attempt_number,
        status: submissionData.status,
        score: submissionData.score,
        feedback: submissionData.feedback,
        submitted_at: submissionData.submitted_at,
        reviewed_at: submissionData.reviewed_at,
        reviewer: submissionData.reviewer
          ? {
              user_id: submissionData.reviewer.user_id,
              name: `${submissionData.reviewer.first_name} ${submissionData.reviewer.last_name}`,
            }
          : null,
      },
      history: allSubmissions.map((s: any) => s.toJSON()),
    });
  } catch (error: any) {
    console.error("Get submission detail error:", error);
    return NextResponse.json(
      {
        error: "Failed to fetch submission",
        details: process.env.NODE_ENV === "development" ? error.message : undefined,
      },
      { status: 500 }
    );
  }
}