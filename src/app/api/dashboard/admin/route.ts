// src\app\api\dashboard\admin\route.ts

/* eslint-disable @typescript-eslint/no-explicit-any */

import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '../../auth/[...nextauth]/route';
import { User, Course, Enrollment } from '@/models';

export async function GET() {
  try {
    // Check if user is admin
    const session = await getServerSession(authOptions);
    if (!session?.user || (session.user as any)?.role !== 'admin') {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 403 });
    }

    // Basic stats for quick overview
    const totalCourses = await Course.count();
    const totalStudents = await User.count({ where: { role: 'student' } });
    const totalLecturers = await User.count({ where: { role: 'lecturer' } });
    const totalEnrollments = await Enrollment.count();

    return NextResponse.json({
      success: true,
      stats: {
        totalCourses,
        totalStudents,
        totalLecturers,
        totalEnrollments,
      },
      message: 'Admin dashboard accessible'
    });

  } catch (error) {
    console.error("Error in admin dashboard route:", error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}