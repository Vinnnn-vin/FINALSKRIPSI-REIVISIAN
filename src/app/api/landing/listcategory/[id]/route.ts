/* eslint-disable @typescript-eslint/no-explicit-any */
// src\app\api\landing\listcategory\[id]\route.ts
import { NextResponse } from "next/server";
import { NextRequest } from "next/server";
import { Category, Course, User } from "@/models";
import { Sequelize } from "sequelize";

interface RouteParams {
  params: {
    id: string;
  };
}

export async function GET(request: NextRequest, { params }: RouteParams) {
  try {
    const categoryId = parseInt(params.id, 10);

    if (isNaN(categoryId)) {
      return NextResponse.json(
        { error: "Bad Request", message: "Invalid category ID" },
        { status: 400 }
      );
    }

    // 1. Fetch Category Details
    const category = await Category.findByPk(categoryId);
    if (!category) {
      return NextResponse.json(
        { error: "Not Found", message: "Category not found" },
        { status: 404 }
      );
    }

    // 2. Fetch Courses in this Category with DYNAMIC data
    const courses = await Course.findAll({
      where: {
        category_id: categoryId,
        publish_status: 1,
      },
      attributes: {
        include: [
          [
            Sequelize.literal(`(
              SELECT COUNT(*)
              FROM enrollments
              WHERE enrollments.course_id = Course.course_id
            )`),
            "student_count",
          ],
          [
            Sequelize.literal(`(
              SELECT AVG(rating)
              FROM reviews
              WHERE reviews.course_id = Course.course_id
            )`),
            "average_rating",
          ],
          [
            Sequelize.literal(`(
              SELECT COUNT(*)
              FROM reviews
              WHERE reviews.course_id = Course.course_id
            )`),
            "review_count",
          ],
        ],
      },
      include: [
        {
          model: User,
          as: "lecturer", // Sesuai dengan asosiasi di index.ts
          attributes: ["user_id", "first_name", "last_name"],
          required: false,
        },
      ],
      order: [["created_at", "DESC"]],
      raw: false,
    });

    // 3. Fetch instructors teaching in this category
    const instructors = await User.findAll({
      attributes: [
        "user_id",
        "first_name", 
        "last_name",
        [
          Sequelize.fn("COUNT", Sequelize.col("courses.course_id")),
          "course_count",
        ],
      ],
      include: [
        {
          model: Course,
          as: "courses", // Sesuai dengan asosiasi di index.ts
          where: {
            category_id: categoryId,
            publish_status: 1,
          },
          attributes: [],
          required: true,
        },
      ],
      group: ["User.user_id", "User.first_name", "User.last_name"],
      raw: false,
    });

    // 4. Calculate statistics
    const totalStudents = courses.reduce((sum, course) => {
      const studentCount = (course as any).getDataValue('student_count');
      return sum + (studentCount ? parseInt(studentCount.toString()) : 0);
    }, 0);

    const coursesWithRating = courses.filter((course) => {
      const rating = (course as any).getDataValue('average_rating');
      return rating && parseFloat(rating.toString()) > 0;
    });

    const avgRatingOverall = coursesWithRating.length > 0
      ? coursesWithRating.reduce((sum, course) => {
          const rating = (course as any).getDataValue('average_rating');
          return sum + (rating ? parseFloat(rating.toString()) : 0);
        }, 0) / coursesWithRating.length
      : 0;

    // 5. Format the response
    const formattedCourses = courses.map((course) => {
      // Akses instructor data dengan cara yang aman untuk TypeScript
      const instructor = (course as any).instructor;

      const studentCountRaw = (course as any).getDataValue('student_count');
      const studentCount = studentCountRaw
        ? parseInt(studentCountRaw.toString())
        : 0;

      const averageRatingRaw = (course as any).getDataValue('average_rating');
      const averageRating = averageRatingRaw
        ? parseFloat(averageRatingRaw.toString())
        : 0;

      const reviewCountRaw = (course as any).getDataValue('review_count');
      const reviewCount = reviewCountRaw
        ? parseInt(reviewCountRaw.toString())
        : 0;

      const coursePrice = course.course_price || 0;
      const courseDuration = course.course_duration;

      // Generate instructor name
      const instructorName = instructor
        ? `${instructor.first_name || ''} ${instructor.last_name || ''}`.trim()
        : 'Unknown Instructor';

      return {
        id: course.course_id,
        title: course.course_title || "Untitled Course",
        instructor: instructorName,
        instructorAvatar: instructor
          ? `${instructor.first_name?.charAt(0) || ''}${instructor.last_name?.charAt(0) || ''}`
          : "UI",
        rating: parseFloat(averageRating.toFixed(1)),
        reviewCount: reviewCount,
        students: studentCount,
        duration: courseDuration ? `${courseDuration} jam` : "N/A",
        level: course.course_level || "Semua Level",
        price:
          coursePrice === 0
            ? "Gratis"
            : `Rp ${coursePrice.toLocaleString("id-ID")}`,
        image: course.thumbnail_url || "/SIGNIN.jpg",
        description:
          course.course_description || "No description available.",
        lastUpdated: course.updated_at
          ? new Date(course.updated_at).toISOString()
          : course.created_at
          ? new Date(course.created_at).toISOString()
          : new Date().toISOString(),
        isBestseller: studentCount > 1000,
        isNew: course.created_at
          ? new Date(course.created_at).getTime() >
            Date.now() - 30 * 24 * 60 * 60 * 1000
          : false,
      };
    });

        const formattedInstructors = instructors.map((instructor) => {
      const courseCountRaw = (instructor as any).getDataValue('course_count');
      const courseCount = courseCountRaw
        ? parseInt(courseCountRaw.toString())
        : 0;

      const instructorName = instructor.first_name && instructor.last_name
        ? `${instructor.first_name} ${instructor.last_name}`.trim()
        : `Instructor ${instructor.user_id}`;

      return {
        id: instructor.user_id,
        name: instructorName,
        avatar: `${instructor.first_name?.charAt(0) || 'U'}${instructor.last_name?.charAt(0) || 'I'}`,
        courses: courseCount,
        expertise: category.category_name,
        rating: 4.5 + Math.random() * 0.5,
        students: 500 + Math.floor(Math.random() * 2000),
      };
    });

    const response = {
      category: {
        id: category.category_id,
        category_name: category.category_name,
        category_description: category.category_description,
        courseCount: courses.length,
        studentCount: totalStudents,
        instructorCount: instructors.length,
        avgRating: parseFloat(avgRatingOverall.toFixed(1)),
      },
      courses: formattedCourses,
      instructors: formattedInstructors,
    };

    return NextResponse.json(response);
  } catch (error) {
    console.error("Error in category details API:", error);
    const errorMessage =
      error instanceof Error ? error.message : "An unknown error occurred";
    return NextResponse.json(
      {
        error: "Internal Server Error",
        message: "Failed to load category details",
        details:
          process.env.NODE_ENV === "development" ? errorMessage : undefined,
      },
      { status: 500 }
    );
  }
}