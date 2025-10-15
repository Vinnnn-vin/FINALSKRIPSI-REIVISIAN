// src\app\api\dashboard\lecturer\materials\material-details\[materialId]\route.ts
/* eslint-disable @typescript-eslint/no-explicit-any */
import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import { Material, MaterialDetail, Quiz, Course } from "@/models";
import sequelize from "@/lib/database";

// Helper untuk verifikasi kepemilikan Bab (Material)
async function getMaterialIfOwner(materialId: number, lecturerId: string) {
  return await Material.findOne({
    where: { material_id: materialId },
    include: [{
      model: Course,
      as: 'course',
      required: true,
      where: { user_id: lecturerId }
    }]
  });
}

export async function DELETE(
  req: NextRequest,
  { params }: { params: Promise<{ materialId: string }> }
) {
  const session = await getServerSession(authOptions);
  const lecturerId = (session?.user as any)?.id;
  const materialId = parseInt((await params).materialId, 10);

  if (!session || (session.user as any)?.role !== "lecturer") {
    return NextResponse.json({ error: "Unauthorized" }, { status: 403 });
  }
  if (isNaN(materialId)) {
    return NextResponse.json({ error: "Invalid Material ID" }, { status: 400 });
  }

  const transaction = await sequelize.transaction();

  try {
    const material = await getMaterialIfOwner(materialId, lecturerId);
    if (!material) {
      await transaction.rollback();
      return NextResponse.json({ error: "Material not found or permission denied" }, { status: 404 });
    }

    await MaterialDetail.destroy({ where: { material_id: materialId }, transaction });
    await Quiz.destroy({ where: { material_id: materialId }, transaction });

    // 2. Hapus Bab itu sendiri
    await material.destroy({ transaction });
    
    // 3. Konfirmasi transaksi jika semua berhasil
    await transaction.commit();

    return NextResponse.json({ success: true, message: "Material and its content deleted successfully" });

  } catch (error: any) {
    // Batalkan semua operasi jika terjadi error
    await transaction.rollback();
    console.error("Error deleting material:", error);
    return NextResponse.json({ error: "Failed to delete material" }, { status: 500 });
  }
}