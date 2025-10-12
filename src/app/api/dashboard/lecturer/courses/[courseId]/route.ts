// src\app\api\dashboard\lecturer\courses\[courseId]\route.ts
/* eslint-disable @typescript-eslint/no-explicit-any */
import { NextRequest, NextResponse } from 'next/server';
import { Course, User } from '@/models';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/app/api/auth/[...nextauth]/route';
import { cleanupOldThumbnails, uploadCourseThumbnail } from '@/lib/utils/fileUtils';
// import fs from 'fs';
// import path from 'path';

// Helper function to verify ownership
async function getCourseIfOwner(courseId: number, lecturerId: string) {
    return await Course.findOne({
        where: { course_id: courseId, user_id: lecturerId },
    });
}

// GET: Untuk mendapatkan detail kursus berdasarkan ID
export async function GET(
  req: NextRequest,
  { params }: { params: { courseId: string } }
) {
  const session = await getServerSession(authOptions);
  const lecturerId = (session?.user as any)?.id;
  const courseId = parseInt(params.courseId, 10);

  if (!session || (session.user as any)?.role !== 'lecturer') {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 403 });
  }
  if (isNaN(courseId)) {
    return NextResponse.json({ error: 'Invalid course ID' }, { status: 400 });
  }

  try {
    const course = await getCourseIfOwner(courseId, lecturerId);

    if (!course) {
      return NextResponse.json({ error: 'Course not found or permission denied' }, { status: 404 });
    }
    return NextResponse.json({ success: true, course });
  } catch (error) {
    console.error("Error fetching course:", error);
    return NextResponse.json({ error: 'Failed to fetch course', details: process.env.NODE_ENV === 'development' ? error : undefined }, { status: 500 });
  }
}

// PUT: Untuk mengedit detail kursus ATAU hanya mengubah status publish
export async function PUT(
  req: NextRequest,
  { params }: { params: { courseId: string } }
) {
  const session = await getServerSession(authOptions);
  const lecturerId = (session?.user as any)?.id;
  const courseId = parseInt(params.courseId, 10);

  if (!session || (session.user as any)?.role !== 'lecturer') {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 403 });
  }
  if (isNaN(courseId)) {
    return NextResponse.json({ error: 'Invalid course ID' }, { status: 400 });
  }

  try {
    const course = await getCourseIfOwner(courseId, lecturerId);
    if (!course) {
      return NextResponse.json({ error: 'Course not found or permission denied' }, { status: 404 });
    }

    const contentType = req.headers.get('content-type') || '';
    let updateData: any = {};

    // Kasus 1: Toggle publish status (dari body JSON)
    if (contentType.includes('application/json')) {
      const body = await req.json();
      if (body.hasOwnProperty('publish_status')) {
        const newStatus = parseInt(body.publish_status);
        if (isNaN(newStatus) || (newStatus !== 0 && newStatus !== 1)) {
          return NextResponse.json({ error: 'Invalid publish status. Must be 0 or 1' }, { status: 400 });
        }
        updateData.publish_status = newStatus;
      }

      // Optional: update basic fields
      if (body.course_title) updateData.course_title = body.course_title;
      if (body.course_description) updateData.course_description = body.course_description;
      if (body.course_level && ['beginner', 'intermediate', 'advanced'].includes(body.course_level)) {
        updateData.course_level = body.course_level;
      }
      if (body.course_price !== undefined) {
        const price = parseInt(body.course_price);
        if (!isNaN(price) && price >= 0) updateData.course_price = price;
      }
      if (body.category_id) {
        const catId = parseInt(body.category_id);
        if (!isNaN(catId)) updateData.category_id = catId;
      }

      if (Object.keys(updateData).length === 0) {
        return NextResponse.json({ error: 'No valid data to update' }, { status: 400 });
      }

      await course.update(updateData);
      return NextResponse.json({ success: true, course });
    }

    // Kasus 2: Update data lengkap (dari FormData)
    if (contentType.includes('multipart/form-data')) {
      const formData = await req.formData();
      const courseTitle = formData.get('course_title') as string;
      const courseDescription = formData.get('course_description') as string;
      const courseLevel = (formData.get('course_level') as string)?.toLowerCase();
      const coursePriceStr = formData.get('course_price') as string;
      const categoryIdStr = formData.get('category_id') as string;
      const thumbnailFile = formData.get('thumbnail') as File | null;

      if (!courseTitle || !courseDescription || !courseLevel || !coursePriceStr || !categoryIdStr) {
        return NextResponse.json({ error: 'Missing required fields for course update' }, { status: 400 });
      }

      const coursePrice = parseInt(coursePriceStr);
      const categoryId = parseInt(categoryIdStr);

      if (isNaN(coursePrice) || isNaN(categoryId)) {
        return NextResponse.json({ error: 'Invalid price or category ID' }, { status: 400 });
      }

      if (!['beginner','intermediate','advanced'].includes(courseLevel)) {
        return NextResponse.json({ error: 'Invalid course level' }, { status: 400 });
      }

      // Handle thumbnail upload
      let thumbnailUrl = course.getDataValue('thumbnail_url');
      if (thumbnailFile && thumbnailFile.size > 0) {
        const uploadResult = await uploadCourseThumbnail({
          file: thumbnailFile,
          lecturerName: (await User.findByPk(lecturerId))?.full_name || `lecturer_${lecturerId}`,
          courseTitle,
          lecturerId,
        });
        if (uploadResult.success && uploadResult.thumbnailUrl) {
          // Cleanup old thumbnail
          if (thumbnailUrl) cleanupOldThumbnails(thumbnailUrl);
          thumbnailUrl = uploadResult.thumbnailUrl;
        } else {
          return NextResponse.json({ error: uploadResult.error || 'Failed to upload thumbnail' }, { status: 400 });
        }
      }

      updateData = {
        course_title: courseTitle,
        course_description: courseDescription,
        course_level: courseLevel,
        course_price: coursePrice,
        category_id: categoryId,
        thumbnail_url: thumbnailUrl,
        updated_at: new Date(),
      };

      await course.update(updateData);
      return NextResponse.json({ success: true, message: 'Course updated successfully', course });
    }

    return NextResponse.json({ error: 'Unsupported content type' }, { status: 415 });

  } catch (error) {
    console.error("Error updating course:", error);
    return NextResponse.json({ error: 'Failed to update course', details: process.env.NODE_ENV === 'development' ? error : undefined }, { status: 500 });
  }
}

// DELETE: Untuk menghapus kursus
export async function DELETE(
  req: NextRequest,
  { params }: { params: { courseId: string } }
) {
  const session = await getServerSession(authOptions);
  const lecturerId = (session?.user as any)?.id;
  const courseId = parseInt(params.courseId, 10);

  if (!session || (session.user as any)?.role !== 'lecturer') {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 403 });
  }
  if (isNaN(courseId)) {
    return NextResponse.json({ error: 'Invalid course ID' }, { status: 400 });
  }

  try {
    const course = await getCourseIfOwner(courseId, lecturerId);
    if (!course) {
      return NextResponse.json({ error: 'Course not found or permission denied' }, { status: 404 });
    }

    // Cleanup thumbnail
    if (course.thumbnail_url) {
      cleanupOldThumbnails(course.thumbnail_url);
    }

    const deletedRows = await Course.destroy({
      where: { course_id: courseId, user_id: lecturerId },
    });

    if (deletedRows === 0) {
      return NextResponse.json({ error: 'No course was deleted. Check ownership.' }, { status: 404 });
    }

    return NextResponse.json({ success: true, message: 'Course deleted successfully', deletedCourseId: courseId });

  } catch (error) {
    console.error("Error deleting course:", error);
    return NextResponse.json({ error: 'Failed to delete course', details: process.env.NODE_ENV === 'development' ? error : undefined }, { status: 500 });
  }
}
