// src\app\api\dashboard\admin\lecturers\route.ts
/* eslint-disable @typescript-eslint/no-explicit-any */

import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '../../../auth/[...nextauth]/route';
import { User } from '@/models';
import { Op } from 'sequelize';

export async function GET() {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user || (session.user as any)?.role !== 'admin') {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 403 });
    }

    const lecturers = await User.findAll({
      where: { 
        role: {
          [Op.or]: ['lecturer', 'instructor'] // Mencari role lecturer atau instructor
        }
      },
      attributes: ['user_id', 'first_name', 'last_name'],
      order: [['first_name', 'ASC']],
    });

    // Format data agar sesuai untuk komponen Select di frontend
    const formattedLecturers = lecturers.map(lecturer => {
      const plain = lecturer.toJSON();
      return {
        value: String(plain.user_id),
        label: `${plain.first_name} ${plain.last_name}`.trim(),
      };
    });

    return NextResponse.json(formattedLecturers);

  } catch (error) {
    console.error('Error fetching lecturers:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}