// src\app\api\notifications\[id]\read\route.ts
import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '../../../auth/[...nextauth]/route';
import { Notification } from '@/models';

interface RouteParams {
  params: {
    id: string;
  };
}

export async function PATCH(req: NextRequest, { params }: RouteParams) {
  try {
    const session = await getServerSession(authOptions);
    
    if (!session?.user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const user = session.user as SessionUser;
    const notificationId = params.id;

    // Find and update notification
    const notification = await Notification.findOne({
      where: {
        notification_id: notificationId,
        user_id: user.id
      }
    });

    if (!notification) {
      return NextResponse.json({ error: 'Notification not found' }, { status: 404 });
    }

    await notification.update({ is_read: true });

    return NextResponse.json({
      success: true,
      message: 'Notification marked as read',
      data: notification
    });

  } catch (error: any) {
    console.error('Error marking notification as read:', error);
    return NextResponse.json({ 
      error: 'Internal server error' 
    }, { status: 500 });
  }
}