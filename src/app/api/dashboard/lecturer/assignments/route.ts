// src\app\api\dashboard\lecturer\assignments\route.ts
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
  Enrollment,
} from "@/models";
import { Op } from "sequelize";

export async function GET(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const user = session.user as any;
    if (user.role !== "lecturer") {
      return NextResponse.json({ error: "Access denied" }, { status: 403 });
    }

    const instructorId = parseInt(user.id);
    const { searchParams } = new URL(request.url);
    const courseId = searchParams.get("courseId");
    const status = searchParams.get("status"); // submitted, approved, rejected

    // Get instructor's courses
    const instructorCourses = await Course.findAll({
      where: {
        user_id: instructorId,
        publish_status: 1,
        ...(Course.rawAttributes.deleted_at && { deleted_at: null }),
      },
      attributes: ["course_id", "course_title"],
    });

    const courseIds = instructorCourses.map(
      (c: any) => c.toJSON().course_id
    );

    if (courseIds.length === 0) {
      return NextResponse.json({
        submissions: [],
        grouped_by_course: {},
        total: 0,
      });
    }

    // Build where clause
    const whereClause: any = {
      course_id: {
        [Op.in]: courseIds,
      },
    };

    if (courseId) {
      whereClause.course_id = parseInt(courseId);
    }

    if (status) {
      whereClause.status = status;
    }

    // Get submissions
    const submissions = await AssignmentSubmission.findAll({
      where: whereClause,
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
          model: Enrollment,
          as: "enrollment",
          attributes: ["enrollment_id", "enrolled_at"],
          required: true,
        },
        {
          model: User,
          as: "reviewer",
          attributes: ["user_id", "first_name", "last_name"],
          required: false,
        },
      ],
      order: [["submitted_at", "DESC"]],
    });

    const submissionsData = submissions.map((sub) => {
      const subData = sub.toJSON() as any;
      return {
        submission_id: subData.submission_id,
        student: {
          user_id: subData.student.user_id,
          name: `${subData.student.first_name} ${subData.student.last_name}`,
          email: subData.student.email,
        },
        course: {
          course_id: subData.course.course_id,
          course_title: subData.course.course_title,
        },
        assignment: {
          material_detail_id: subData.materialDetail.material_detail_id,
          name: subData.materialDetail.material_detail_name,
          description: subData.materialDetail.material_detail_description,
          material_name: subData.materialDetail.material?.material_name,
        },
        submission_type: subData.submission_type,
        file_path: subData.file_path,
        submission_url: subData.submission_url,
        submission_text: subData.submission_text,
        attempt_number: subData.attempt_number,
        status: subData.status,
        score: subData.score,
        feedback: subData.feedback,
        submitted_at: subData.submitted_at,
        reviewed_at: subData.reviewed_at,
        reviewer: subData.reviewer
          ? {
              user_id: subData.reviewer.user_id,
              name: `${subData.reviewer.first_name} ${subData.reviewer.last_name}`,
            }
          : null,
      };
    });

    // Group by course
    const groupedByCourse: any = {};
    submissionsData.forEach((sub) => {
      const courseId = sub.course.course_id;
      if (!groupedByCourse[courseId]) {
        groupedByCourse[courseId] = {
          course_id: courseId,
          course_title: sub.course.course_title,
          submissions: [],
        };
      }
      groupedByCourse[courseId].submissions.push(sub);
    });

    return NextResponse.json({
      submissions: submissionsData,
      grouped_by_course: groupedByCourse,
      total: submissionsData.length,
      courses: instructorCourses.map((c: any) => c.toJSON()),
    });
  } catch (error: any) {
    console.error("Get instructor submissions error:", error);
    return NextResponse.json(
      {
        error: "Failed to fetch submissions",
        details: process.env.NODE_ENV === "development" ? error.message : undefined,
      },
      { status: 500 }
    );
  }
}