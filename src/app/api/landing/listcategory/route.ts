// src\app\api\landing\listcategory\route.ts
import { NextResponse } from 'next/server';
import { Category, Course } from '@/models';
import { Sequelize } from 'sequelize';

export async function GET() {
  try {
    // Fetch all categories and count the number of published courses in each.
    const categories = await Category.findAll({
      attributes: [
        'category_id',
        'category_name',
        'category_description',
        'image_url',
        // Use Sequelize to count associated courses
        [Sequelize.fn('COUNT', Sequelize.col('courses.course_id')), 'course_count']
      ],
      include: [{
        model: Course,
        as: 'courses', // Menggunakan alias yang benar sesuai dengan index.ts
        attributes: [], // We only need it for counting, so no course attributes are needed
        required: false, // Use LEFT JOIN to include categories with 0 courses
        where: { publish_status: 1 } // Only count published courses
      }],
      group: [
        'Category.category_id', 
        'Category.category_name', 
        'Category.category_description', 
        'Category.image_url'
      ],
      order: [[Sequelize.literal('course_count'), 'DESC']],
    });

    // The frontend will handle colors. The backend provides the raw data.
    return NextResponse.json(categories);

  } catch (error) {
    console.error("Error fetching categories:", error);
    // Provide a more detailed error message in development
    const errorMessage = error instanceof Error ? error.message : 'An unknown error occurred';
    return NextResponse.json({ 
        error: 'Internal Server Error', 
        details: process.env.NODE_ENV === "development" ? errorMessage : undefined 
    }, { status: 500 });
  }
}