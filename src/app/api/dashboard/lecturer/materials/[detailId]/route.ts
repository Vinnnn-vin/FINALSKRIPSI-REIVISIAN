// src\app\api\dashboard\lecturer\materials\[detailId]\route.ts
/* eslint-disable @typescript-eslint/no-explicit-any */
import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "../../../../auth/[...nextauth]/route";
import { MaterialDetail, Material, Course } from "@/models";

// Helper untuk verifikasi kepemilikan
async function getDetailIfOwner(detailId: number, lecturerId: string) {
  const materialDetail = await MaterialDetail.findByPk(detailId, {
    include: [{
      model: Material,
      as: 'material',
      required: true,
      include: [{
        model: Course,
        as: 'course',
        required: true,
        where: { user_id: lecturerId }
      }]
    }]
  });
  return materialDetail;
}

// PUT: Memperbarui satu pelajaran
export async function PUT(
  req: NextRequest,
  { params }: { params: { detailId: string } }
) {
  const session = await getServerSession(authOptions);
  const lecturerId = (session?.user as any)?.id;
  const detailId = parseInt(params.detailId, 10);

  if (!session || (session.user as any)?.role !== "lecturer") {
    return NextResponse.json({ error: "Unauthorized" }, { status: 403 });
  }
  if (isNaN(detailId)) {
    return NextResponse.json({ error: "Invalid detail ID" }, { status: 400 });
  }

  try {
    const materialDetail = await getDetailIfOwner(detailId, lecturerId);
    if (!materialDetail) {
      return NextResponse.json({ error: "Lesson not found or permission denied" }, { status: 404 });
    }

    const body = await req.json();
    const { material_detail_name, material_detail_description, is_free, materi_detail_url } = body;

    // Lakukan validasi dasar
    if (!material_detail_name || material_detail_name.trim() === "") {
        return NextResponse.json({ error: "Lesson title cannot be empty" }, { status: 400 });
    }

    await materialDetail.update({
      material_detail_name,
      material_detail_description,
      is_free,
      materi_detail_url,
    });

    return NextResponse.json({ success: true, materialDetail });
  } catch (error: any) {
    console.error("Error updating material detail:", error);
    return NextResponse.json({ error: "Failed to update lesson" }, { status: 500 });
  }
}

// DELETE: Menghapus satu pelajaran
export async function DELETE(
  req: NextRequest,
  { params }: { params: { detailId: string } }
) {
    const session = await getServerSession(authOptions);
    const lecturerId = (session?.user as any)?.id;
    const detailId = parseInt(params.detailId, 10);
  
    if (!session || (session.user as any)?.role !== "lecturer") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 403 });
    }
    if (isNaN(detailId)) {
      return NextResponse.json({ error: "Invalid detail ID" }, { status: 400 });
    }
  
    try {
      const materialDetail = await getDetailIfOwner(detailId, lecturerId);
      if (!materialDetail) {
        return NextResponse.json({ error: "Lesson not found or permission denied" }, { status: 404 });
      }

      await materialDetail.destroy();
      return NextResponse.json({ success: true, message: "Lesson deleted successfully" });

    } catch (error: any) {
        console.error("Error deleting material detail:", error);
        return NextResponse.json({ error: "Failed to delete lesson" }, { status: 500 });
    }
}