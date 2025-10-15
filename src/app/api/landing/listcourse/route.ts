// src\app\api\landing\listcourse\route.ts
/* eslint-disable @typescript-eslint/no-explicit-any */
import { NextRequest, NextResponse } from "next/server";
import { Course, User, Category, Enrollment } from "@/models";
import { FindOptions, Op, QueryTypes } from "sequelize";
import sequelize from "@/lib/database";

export async function GET(request: NextRequest) {
  try {
    console.log("=== API Request Start ===");

    const searchParams = request.nextUrl.searchParams;
    const limit = parseInt(searchParams.get("limit") || "9", 10);
    const sort = searchParams.get("sort") || "newest";
    const page = parseInt(searchParams.get("page") || "1", 10);
    const searchQuery = searchParams.get("search");
    const categoryId = searchParams.get("category_id");
    const categoryName = searchParams.get("category"); // Support both formats
    const level = searchParams.get("level");

    const whereClause: any = { publish_status: 1 };

    // Search filter
    if (searchQuery && searchQuery.trim()) {
      whereClause[Op.or] = [
        { course_title: { [Op.like]: `%${searchQuery.trim()}%` } },
        { course_description: { [Op.like]: `%${searchQuery.trim()}%` } },
      ];
    }

    // Level filter
    if (level && level.trim()) {
      whereClause.course_level = level.trim().toLowerCase();
    }

    // Category filter
    const categoryParam = categoryId || categoryName;
    if (categoryParam && categoryParam.trim()) {
      const isNumericId = /^\d+$/.test(categoryParam);
      if (isNumericId) {
        whereClause.category_id = parseInt(categoryParam, 10);
      } else {
        const category = await Category.findOne({
          where: {
            [Op.or]: [
              { category_name: { [Op.like]: `%${categoryParam.trim()}%` } },
              sequelize.where(
                sequelize.fn(
                  "LOWER",
                  sequelize.fn("TRIM", sequelize.col("category_name"))
                ),
                sequelize.fn("LOWER", categoryParam.trim())
              ),
            ],
          },
        });
        if (category) {
          whereClause.category_id = category.category_id;
        } else {
          return NextResponse.json({
            courses: [],
            totalCount: 0,
            currentPage: page,
            totalPages: 0,
            message: `Category not found: ${categoryParam}`,
          });
        }
      }
    }

    const queryOptions: FindOptions = {
      where: whereClause,
      include: [
        {
          model: User,
          as: "lecturer",
          attributes: ["user_id", "first_name", "last_name"],
          required: false,
        },
        {
          model: Category,
          as: "category",
          attributes: ["category_id", "category_name"],
          required: false,
        },
      ],
      raw: false,
      nest: true,
      limit: limit,
      offset: (page - 1) * limit,
    };

    // Sorting
    switch (sort) {
      case "newest":
        queryOptions.order = [["created_at", "DESC"]];
        break;
      case "popularity":
        queryOptions.order = [["course_id", "DESC"]];
        break;
      case "rating":
        queryOptions.order = [["course_title", "ASC"]]; // placeholder
        break;
      case "price-low":
        queryOptions.order = [["course_price", "ASC"]];
        break;
      case "price-high":
        queryOptions.order = [["course_price", "DESC"]];
        break;
      default:
        queryOptions.order = [["created_at", "DESC"]];
    }

    // Execute queries in parallel
    const [courses, totalCount, reviewSummary] = await Promise.all([
      Course.findAll(queryOptions),
      Course.count({ where: whereClause }),
      sequelize.query(
        `
        SELECT 
          course_id,
          COUNT(*) AS reviewCount,
          COALESCE(ROUND(AVG(rating), 1), 0) AS avgRating
        FROM reviews
        WHERE deleted_at IS NULL
        GROUP BY course_id
        `,
        { type: QueryTypes.SELECT }
      ),
    ]);

    // Buat map dari hasil review summary
    const reviewMap: Record<
      number,
      { reviewCount: number; avgRating: number }
    > = {};
    (reviewSummary as any[]).forEach((row) => {
      reviewMap[row.course_id] = {
        reviewCount: Number(row.reviewCount) || 0,
        avgRating: Number(row.avgRating) || 0,
      };
    });

    // Format hasil courses
    const formattedCourses = await Promise.all(
      courses.map(async (course: any) => {
        const courseData = course.get({ plain: true });
        const instructor = courseData.lecturer;
        const category = courseData.category;

        const studentCount = await Enrollment.count({
          where: { course_id: courseData.course_id, status: "active" },
        });

        // Review data dari map
        const reviewData = reviewMap[courseData.course_id] || {
          reviewCount: 0,
          avgRating: 0,
        };

        // Handle image
        let imageUrl = courseData.thumbnail_url;
        if (!imageUrl || imageUrl.trim() === "") {
          imageUrl = "/SIGNIN.jpg";
        } else if (
          !imageUrl.startsWith("http") &&
          !imageUrl.startsWith("/")
        ) {
          imageUrl = `/${imageUrl}`;
        }

        return {
          id: courseData.course_id,
          title: courseData.course_title || "Untitled Course",
          instructor: instructor
            ? `${instructor.first_name || ""} ${
                instructor.last_name || ""
              }`.trim() || "Unknown Instructor"
            : "Unknown Instructor",
          instructorAvatar: instructor
            ? `${instructor.first_name?.charAt(0) || ""}${
                instructor.last_name?.charAt(0) || ""
              }`
            : "UI",
          rating: reviewData.avgRating,
          reviewCount: reviewData.reviewCount,
          students: studentCount,
          duration: courseData.course_duration
            ? `${courseData.course_duration} jam`
            : "Flexible",
          image: imageUrl,
          price:
            courseData.course_price === 0 ||
            courseData.course_price === null
              ? "Gratis"
              : `Rp ${
                  courseData.course_price?.toLocaleString("id-ID") || "0"
                }`,
          originalPrice:
            courseData.course_price > 0
              ? `Rp ${(courseData.course_price * 1.2)?.toLocaleString(
                  "id-ID"
                )}`
              : null,
          category: category?.category_name || "General",
          level: courseData.course_level || "Beginner",
          description:
            courseData.course_description || "No description available",
          isBestseller: studentCount > 100,
          isNew:
            new Date(courseData.created_at) >
            new Date(Date.now() - 30 * 24 * 60 * 60 * 1000),
        };
      })
    );

    // Additional sorting (client side)
    if (sort === "popularity") {
      formattedCourses.sort((a, b) => b.students - a.students);
    } else if (sort === "rating") {
      formattedCourses.sort((a, b) => b.rating - a.rating);
    }

    const totalPages = Math.ceil(totalCount / limit);

    return NextResponse.json({
      courses: formattedCourses,
      totalCount,
      currentPage: page,
      totalPages,
    });
  } catch (error) {
    console.error("Error in list course API:", error);
    return NextResponse.json(
      {
        error: "Internal Server Error",
        message: error instanceof Error ? error.message : "Unknown error",
        courses: [],
        totalCount: 0,
        currentPage: 1,
        totalPages: 0,
      },
      { status: 500 }
    );
  }
}
