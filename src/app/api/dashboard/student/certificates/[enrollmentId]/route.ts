// src\app\api\dashboard\student\certificates\[enrollmentId]\route.ts
import { NextRequest, NextResponse } from "next/server";
import { promises as fs } from 'fs';
import path from 'path';
import { PDFDocument, rgb, StandardFonts } from 'pdf-lib';
import { Enrollment, User, Course } from '@/models'; // Import model Anda

export async function GET(
  req: NextRequest,
  { params }: { params: { enrollmentId: string } }
) {
  try {
    const enrollmentId = parseInt(params.enrollmentId);
    // Di sini Anda perlu validasi sesi pengguna dan kepemilikan enrollment
    // ... (contoh validasi)
    // const session = await getServerSession(authOptions);
    // const userId = session.user.id;
    // const enrollment = await Enrollment.findOne({ where: { enrollment_id: enrollmentId, user_id: userId }});
    // if (!enrollment) throw new Error("Enrollment not found");
    
    // Asumsi kita sudah mendapatkan data ini dari database
    const studentName = "Andreas Calvin"; // <-- Ganti dengan data asli dari DB
    const courseName = "Dasar-Dasar Jaringan Komputer"; // <-- Ganti dengan data asli dari DB

    // 1. Muat gambar template sertifikat dari file
    const templatePath = path.join(process.cwd(), 'public', 'certificate-template.png');
    const templateBytes = await fs.readFile(templatePath);

    // 2. Muat file font kustom (opsional)
    // const fontPath = path.join(process.cwd(), 'public', 'fonts', 'Merriweather-Bold.ttf');
    // const fontBytes = await fs.readFile(fontPath);

    // 3. Buat dokumen PDF baru
    const pdfDoc = await PDFDocument.create();
    
    // Daftarkan font kustom jika digunakan
    // const customFont = await pdfDoc.embedFont(fontBytes);
    
    // Gunakan font standar jika tidak ada font kustom
    const standardFont = await pdfDoc.embedFont(StandardFonts.HelveticaBold);

    // 4. Ubah gambar template menjadi objek gambar PDF
    const templateImage = await pdfDoc.embedPng(templateBytes);
    const { width, height } = templateImage.scale(1);

    // 5. Tambahkan halaman baru seukuran gambar template
    const page = pdfDoc.addPage([width, height]);

    // 6. Gambar template di halaman
    page.drawImage(templateImage, { x: 0, y: 0, width, height });

    // 7. Tambahkan teks di atas template
    //    Anda harus menyesuaikan posisi (x, y), ukuran (size), dan warna (color)
    
    // Tambahkan nama siswa
    page.drawText(studentName, {
      x: 150, // Sesuaikan posisi horizontal
      y: 280, // Sesuaikan posisi vertikal
      font: standardFont,
      size: 48,
      color: rgb(0.1, 0.1, 0.3), // Warna biru tua
    });

    // Tambahkan nama kursus
    page.drawText(courseName, {
      x: 180,
      y: 180,
      font: standardFont,
      size: 32,
      color: rgb(0.2, 0.2, 0.5),
    });

    // 8. Simpan dokumen PDF sebagai bytes
    const pdfBytes = await pdfDoc.save();

    // 9. Kirim file PDF sebagai respons
    return new NextResponse(pdfBytes, {
      status: 200,
      headers: {
        'Content-Type': 'application/pdf',
        'Content-Disposition': `attachment; filename="certificate-${courseName.replace(/\s+/g, '-')}.pdf"`,
      },
    });

  } catch (error) {
    console.error("Certificate generation error:", error);
    return NextResponse.json({ error: "Failed to generate certificate" }, { status: 500 });
  }
}