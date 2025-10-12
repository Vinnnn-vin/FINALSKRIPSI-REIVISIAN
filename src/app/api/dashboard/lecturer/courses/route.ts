// src\app\api\dashboard\lecturer\courses\route.ts
/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable @typescript-eslint/no-explicit-any */
import { NextRequest, NextResponse } from "next/server";
import { Course, User, Enrollment } from "@/models"; // pastikan Enrollment ada
import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import { uploadCourseThumbnail } from "@/lib/utils/fileUtils";
import { Sequelize } from "sequelize";

// ✅ GET all courses with student_count
export async function GET(req: NextRequest) {
  const session = await getServerSession(authOptions);
  const lecturerId = (session?.user as any)?.id;

  if (!session || (session.user as any)?.role !== "lecturer") {
    return NextResponse.json({ error: "Unauthorized" }, { status: 403 });
  }

  try {
    const courses = await Course.findAll({
      where: { user_id: lecturerId },
      attributes: {
        include: [
          // hitung jumlah student dari Enrollment
          [
            Sequelize.fn("COUNT", Sequelize.col("enrollments.id")),
            "student_count",
          ],
        ],
      },
      include: [
        {
          model: Enrollment,
          as: "enrollments", // pastikan alias sesuai di model
          attributes: [],
        },
      ],
      group: ["Course.id"],
      order: [["created_at", "DESC"]],
    });

    return NextResponse.json({ success: true, courses });
  } catch (error) {
    console.error("Error fetching courses:", error);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 }
    );
  }
}

// ✅ POST create course with correct course_level
export async function POST(req: NextRequest) {
  const session = await getServerSession(authOptions);
  const lecturerId = (session?.user as any)?.id;

  if (!session || (session.user as any)?.role !== "lecturer") {
    return NextResponse.json({ error: "Unauthorized" }, { status: 403 });
  }

  try {
    const formData = await req.formData();

    const courseTitle = formData.get("course_title") as string;
    const courseDescription = formData.get("course_description") as string;
    const courseLevel = (formData.get("course_level") as string)
      ?.toLowerCase()
      ?.trim();
    // const coursePriceStr = formData.get("course_price") as string;
    const categoryIdStr = formData.get("category_id") as string;
    const thumbnailFile = formData.get("thumbnail") as File | null;

    if (
      !courseTitle ||
      !courseDescription ||
      !courseLevel ||
      // !coursePriceStr ||
      !categoryIdStr
    ) {
      return NextResponse.json(
        { error: "Missing required fields" },
        { status: 400 }
      );
    }

    const allowedLevels = ["beginner", "intermediate", "advanced"];
    if (!allowedLevels.includes(courseLevel)) {
      return NextResponse.json(
        { error: "Invalid course level", allowedLevels, received: courseLevel },
        { status: 400 }
      );
    }

    // const coursePrice = parseInt(coursePriceStr);
    const categoryId = parseInt(categoryIdStr);
    if (isNaN(categoryId)) {
      return NextResponse.json(
        { error: "Invalid Category" },
        { status: 400 }
      );
    }

    const lecturerData = await User.findByPk(lecturerId);
    if (!lecturerData)
      return NextResponse.json(
        { error: "Lecturer not found" },
        { status: 404 }
      );

    let thumbnailUrl: string | null = null;
    if (thumbnailFile && thumbnailFile.size > 0) {
      const uploadResult = await uploadCourseThumbnail({
        file: thumbnailFile,
        lecturerName: lecturerData.full_name || "",
        courseTitle,
        lecturerId,
      });
      if (uploadResult.success) {
        thumbnailUrl = uploadResult.thumbnailUrl || null;
      } else {
        return NextResponse.json(
          { error: uploadResult.error || "Failed to upload thumbnail" },
          { status: 400 }
        );
      }
    }

    const courseData = {
      course_title: courseTitle.trim(),
      course_description: courseDescription.trim(),
      course_level: courseLevel,
      course_price: 0,
      category_id: categoryId,
      user_id: lecturerId,
      publish_status: 0,
      thumbnail_url: thumbnailUrl,
    };

    const newCourse = await Course.create(courseData as any);

    return NextResponse.json(
      {
        success: true,
        message: "Course created successfully",
        course: {
          ...newCourse.get({ plain: true }),
          thumbnail_url: thumbnailUrl
            ? `${
                process.env.NEXT_PUBLIC_BASE_URL || "http://localhost:3000"
              }${thumbnailUrl}`
            : null,
          instructor_name: lecturerData.full_name || "",
          student_count: 0,
        },
      },
      { status: 201 }
    );
  } catch (error: any) {
    console.error("Error creating course:", error);
    return NextResponse.json(
      { error: "Failed to create course" },
      { status: 500 }
    );
  }
}
