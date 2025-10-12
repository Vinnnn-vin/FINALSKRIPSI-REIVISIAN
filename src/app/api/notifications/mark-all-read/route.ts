// src\app\api\notifications\mark-all-read\route.ts
/* eslint-disable @typescript-eslint/no-explicit-any */
import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '../../auth/[...nextauth]/route';
import { Notification } from '@/models';

export async function PATCH(req: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    
    if (!session?.user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const user = session.user as SessionUser;

    // Mark all user's notifications as read
    const [updatedCount] = await Notification.update(
      { is_read: true },
      {
        where: {
          user_id: user.id,
          is_read: false
        }
      }
    );

    return NextResponse.json({
      success: true,
      message: `${updatedCount} notifications marked as read`,
      updated_count: updatedCount
    });

  } catch (error: any) {
    console.error('Error marking all notifications as read:', error);
    return NextResponse.json({ 
      error: 'Internal server error' 
    }, { status: 500 });
  }
}