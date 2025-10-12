// src\app\api\dashboard\admin\users\[id]\reset-password\route.ts

/* eslint-disable @typescript-eslint/no-explicit-any */

import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '../../../../../auth/[...nextauth]/route';
import { User } from '@/models';

export async function POST(
  request: NextRequest, 
  { params }: { params: { id: string } }
) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user || (session.user as any)?.role !== 'admin') {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 403 });
    }

    const userId = params.id;

    const user = await User.findByPk(userId);
    if (!user) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 });
    }

    // Generate new temporary password
    const tempPassword = Math.random().toString(36).slice(-8);
    
    // Set new password
    await user.setPassword(tempPassword);
    await user.save();

    // In production, you should send this password via email
    // For now, we'll return it in the response (NOT RECOMMENDED FOR PRODUCTION)
    return NextResponse.json({
      message: 'Password reset successfully',
      tempPassword: tempPassword, // Remove this in production
      note: 'Please send this password to the user via email'
    });

  } catch (error) {
    console.error('Error resetting password:', error);
    return NextResponse.json(
      { error: 'Internal Server Error' }, 
      { status: 500 }
    );
  }
}