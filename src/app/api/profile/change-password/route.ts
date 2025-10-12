// src\app\api\profile\change-password\route.ts
import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '../../auth/[...nextauth]/route'; // Pastikan path ini benar
import { User } from '@/models';

export async function POST(req: NextRequest) {
  const session = await getServerSession(authOptions);

  if (!session?.user?.id) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  try {
    const { oldPassword, newPassword } = await req.json();

    if (!oldPassword || !newPassword || newPassword.length < 6) {
      return NextResponse.json({ error: 'Invalid input' }, { status: 400 });
    }

    const user = await User.findByPk(session.user.id);

    if (!user || !user.password_hash) {
      return NextResponse.json({ error: 'User not found or password not set' }, { status: 404 });
    }

    // 1. Verifikasi password lama
    const isPasswordCorrect = await user.checkPassword(oldPassword);
    if (!isPasswordCorrect) {
      return NextResponse.json({ error: 'Incorrect old password' }, { status: 403 });
    }

    // 2. Hash dan simpan password baru
    await user.setPassword(newPassword);
    await user.save();

    return NextResponse.json({ message: 'Password updated successfully' });
  } catch (error) {
    console.error("Error changing password:", error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}
