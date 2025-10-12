// src\app\api\dashboard\admin\courses\[id]\route.ts
/* eslint-disable @typescript-eslint/no-explicit-any */

import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '../../../../auth/[...nextauth]/route';
import { Course } from '@/models';

// FUNGSI UNTUK MENGEDIT KURSUS (HANDLE "SAVE CHANGES")
export async function PUT(req: NextRequest, { params }: { params: { id: string } }) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user || (session.user as any)?.role !== 'admin') {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 403 });
    }

    const courseId = parseInt(params.id, 10);
    if (isNaN(courseId)) {
      return NextResponse.json({ error: 'Invalid course ID' }, { status: 400 });
    }

    const course = await Course.findByPk(courseId);
    if (!course) {
      // Ini juga bisa menyebabkan 404 jika kursus dengan ID tersebut tidak ada di DB
      return NextResponse.json({ error: 'Course not found' }, { status: 404 });
    }
    
    const body = await req.json();

    // Lakukan update dengan data dari body
    await course.update(body);

    return NextResponse.json({ success: true, message: 'Course updated successfully', course });
  } catch (error) {
    console.error("Error updating course:", error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}

// FUNGSI UNTUK MENGHAPUS KURSUS
export async function DELETE(req: NextRequest, { params }: { params: { id: string } }) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user || (session.user as any)?.role !== 'admin') {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 403 });
    }
  
    const courseId = parseInt(params.id, 10);
    if (isNaN(courseId)) {
      return NextResponse.json({ error: 'Invalid course ID' }, { status: 400 });
    }

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