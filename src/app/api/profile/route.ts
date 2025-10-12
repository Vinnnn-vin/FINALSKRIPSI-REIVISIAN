// src\app\api\profile\route.ts
import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '../auth/[...nextauth]/route'; // Pastikan path ini benar
import { User } from '@/models';

// GET: Mengambil data profil pengguna yang sedang login
export async function GET() {
  // Panggilan ke getServerSession memerlukan authOptions yang sudah Anda definisikan.
  // Ini memberitahu NextAuth cara menemukan dan mendekode sesi dari cookie request.
  const session = await getServerSession(authOptions);

  // Jika tidak ada sesi atau sesi tidak memiliki ID pengguna, berarti pengguna belum terotentikasi.
  if (!session?.user?.id) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  try {
    // Cari pengguna di database menggunakan ID dari sesi.
    const user = await User.findByPk(session.user.id, {
      // Selalu kecualikan password hash saat mengirim data ke client.
      attributes: { exclude: ['password_hash'] } 
    });

    if (!user) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 });
    }

    // Kembalikan data pengguna sebagai JSON.
    return NextResponse.json(user);
  } catch (error) {
    console.error("Error fetching profile:", error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}

// PUT: Memperbarui data profil pengguna
export async function PUT(req: NextRequest) {
  const session = await getServerSession(authOptions);

  if (!session?.user?.id) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  try {
    const body = await req.json();
    const { first_name, last_name } = body;

    const user = await User.findByPk(session.user.id);

    if (!user) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 });
    }

    // Perbarui field yang diizinkan
    user.first_name = first_name;
    user.last_name = last_name;
    await user.save();

    // Menggunakan toJSON() untuk mendapatkan objek biasa dan membuang info sensitif
    const updatedUser = user.toJSON();
    delete updatedUser.password_hash;

    return NextResponse.json({ message: 'Profile updated successfully', user: updatedUser });
  } catch (error) {
    console.error("Error updating profile:", error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}
