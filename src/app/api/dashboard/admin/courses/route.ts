// src\app\api\dashboard\admin\courses\route.ts
/* eslint-disable @typescript-eslint/no-explicit-any */
import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "../../../auth/[...nextauth]/route";
import { Course, User, Category } from "@/models";

export async function GET() {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user || (session.user as any)?.role !== "admin") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 403 });
    }

    const courses = await Course.findAll({
      include: [
        {
          model: User,
          attributes: ["user_id", "first_name", "last_name", "email"],
          as: "lecturer",
        },
        {
          model: Category,
          attributes: ["category_id", "category_name"],
          as: "category",
        },
      ],
      order: [["created_at", "DESC"]],
    });

    const coursesData = courses.map((course) => {
      const plainCourse = course.toJSON();
      return plainCourse;
    });
    
    console.log("ini course data:", coursesData);
    

    return NextResponse.json(coursesData);
  } catch (error) {
    console.error("Error fetching courses:", error);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 }
    );
  }
}

export async function POST(req: NextRequest) {
  const session = await getServerSession(authOptions);
  if (!session?.user || (session.user as any)?.role !== 'admin') {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 403 });
  }

  try {
    const body = await req.json();
    const { course_title, course_description, course_level, course_price, category_id, user_id } = body;

    // Asumsi admin memilih instructor saat membuat course
    if (!course_title || !user_id) {
      return NextResponse.json({ error: "Title and instructor ID are required" }, { status: 400 });
    }

    const newCourse = await Course.create({
      course_title,
      course_description: course_description || '',
      course_level: course_level || 'beginner',
      course_price: course_price || 0,
      publish_status: 0, // Default to draft
      user_id, // ID Dosen yang dipilih
      category_id: category_id || 1, // Default category
    });

    return NextResponse.json({ success: true, course: newCourse }, { status: 201 });
  } catch (error) {
    console.error("Error creating course:", error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}