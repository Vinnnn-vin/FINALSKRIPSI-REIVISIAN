// src\app\api\notifications\route.ts
/* eslint-disable @typescript-eslint/no-explicit-any */
import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '../auth/[...nextauth]/route';
import { Notification } from '@/models';
import { Op } from 'sequelize';

interface SessionUser {
  id: string;
  email: string;
}

export async function GET(req: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    
    if (!session?.user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const user = session.user as SessionUser;
    const { searchParams } = new URL(req.url);
    
    // Query parameters
    const page = parseInt(searchParams.get('page') || '1');
    const limit = parseInt(searchParams.get('limit') || '10');
    const unreadOnly = searchParams.get('unread_only') === 'true';
    const type = searchParams.get('type');
    
    const offset = (page - 1) * limit;
    
    // Build where conditions
    const whereConditions: any = {
      user_id: user.id
    };
    
    if (unreadOnly) {
      whereConditions.is_read = false;
    }
    
    if (type && ['info', 'success', 'warning', 'error', 'system'].includes(type)) {
      whereConditions.notification_type = type;
    }

    // Get notifications
    const { count, rows } = await Notification.findAndCountAll({
      where: whereConditions,
      order: [['created_at', 'DESC']],
      limit,
      offset,
    });

    // Get unread count
    const unreadCount = await Notification.count({
      where: {
        user_id: user.id,
        is_read: false
      }
    });

    return NextResponse.json({
      success: true,
      data: {
        notifications: rows,
        pagination: {
          current_page: page,
          per_page: limit,
          total: count,
          total_pages: Math.ceil(count / limit)
        },
        unread_count: unreadCount
      }
    });

  } catch (error: any) {
    console.error('Error fetching notifications:', error);
    return NextResponse.json({ 
      error: 'Internal server error' 
    }, { status: 500 });
  }
}
