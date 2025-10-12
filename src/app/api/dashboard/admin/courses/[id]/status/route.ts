// src\app\api\dashboard\admin\courses\[id]\status\route.ts
/* eslint-disable @typescript-eslint/no-explicit-any */
import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '../../../../../auth/[...nextauth]/route';
import { Course } from '@/models';

// PUT: Update a course by ID
export async function PUT(req: NextRequest, { params }: { params: { id: string } }) {
  const session = await getServerSession(authOptions);
  if (!session?.user || (session.user as any)?.role !== 'admin') {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 403 });
  }

  try {
    const courseId = parseInt(params.id, 10);
    const course = await Course.findByPk(courseId);
    if (!course) {
      return NextResponse.json({ error: 'Course not found' }, { status: 404 });
    }
    
    const body = await req.json();
    await course.update(body);

    return NextResponse.json({ success: true, course });
  } catch (error) {
    console.error("Error updating course:", error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}

// DELETE: Delete a course by ID
export async function DELETE(req: NextRequest, { params }: { params: { id: string } }) {
  const session = await getServerSession(authOptions);
  if (!session?.user || (session.user as any)?.role !== 'admin') {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 403 });
  }
  
  try {
    const courseId = parseInt(params.id, 10);
    const deletedRows = await Course.destroy({ where: { course_id: courseId } });

    if (deletedRows === 0) {
      return NextResponse.json({ error: 'Course not found' }, { status: 404 });
    }

    return NextResponse.json({ success: true, message: 'Course deleted successfully' });
  } catch (error) {
    console.error("Error deleting course:", error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}