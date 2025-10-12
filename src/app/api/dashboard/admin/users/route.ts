// src\app\api\dashboard\admin\users\route.ts

/* eslint-disable @typescript-eslint/no-explicit-any */

import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '../../../auth/[...nextauth]/route';
import { User } from '@/models';
import bcrypt from 'bcrypt';

export async function GET() {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user || (session.user as any)?.role !== 'admin') {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 403 });
    }

    const users = await User.findAll({
      attributes: ['user_id', 'first_name', 'last_name', 'email', 'role', 'created_at'],
      order: [['created_at', 'DESC']]
    });

    return NextResponse.json(users);

  } catch (error) {
    console.error('Error fetching users:', error);
    return NextResponse.json(
      { error: 'Internal Server Error' }, 
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user || (session.user as any)?.role !== 'admin') {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 403 });
    }

    const body = await request.json();
    const { first_name, last_name, email, role, password } = body;

    // Check if email already exists
    const existingUser = await User.findOne({ where: { email } });
    if (existingUser) {
      return NextResponse.json(
        { error: 'Email already exists' }, 
        { status: 400 }
      );
    }

    // Create new user
    const newUser = await User.create({
      first_name,
      last_name,
      email,
      role,
    });

    // Set password if provided
    if (password) {
      await newUser.setPassword(password);
      await newUser.save();
    }

    return NextResponse.json({
      message: 'User created successfully',
      user: newUser.toSafeJSON()
    });

  } catch (error) {
    console.error('Error creating user:', error);
    return NextResponse.json(
      { error: 'Internal Server Error' }, 
      { status: 500 }
    );
  }
}