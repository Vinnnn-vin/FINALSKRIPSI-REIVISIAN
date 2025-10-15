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

async function getMaterialIfOwner(materialId: number, lecturerId: string) {
  return await Material.findOne({
    where: { material_id: materialId },
    include: [{ model: Course, as: 'course', required: true, where: { user_id: lecturerId } }]
  });
}

export async function PUT(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  const session = await getServerSession(authOptions);
  const lecturerId = (session?.user as any)?.id;
  const materialId = parseInt(params.id, 10);

  if (!session || (session.user as any)?.role !== "lecturer") {
    return NextResponse.json({ error: "Unauthorized" }, { status: 403 });
  }
  if (isNaN(materialId)) {
    return NextResponse.json({ error: "Invalid Material ID" }, { status: 400 });
  }

  try {
    const material = await getMaterialIfOwner(materialId, lecturerId);
    if (!material) {
      return NextResponse.json({ error: "Material not found or permission denied" }, { status: 404 });
    }
    
    const body = await req.json();
    const { material_name, material_description } = body;

    // Lakukan update dengan data dari body
    await material.update({
      material_name,
      material_description,
    });
    
    return NextResponse.json({ success: true, message: 'Material updated successfully', material });

  } catch (error: any) {
    console.error("Error updating material:", error);
    return NextResponse.json({ error: "Failed to update material" }, { status: 500 });
  }
}


export async function DELETE(
  req: NextRequest,
  { params }: { params: Promise<{ detailId: string }> }
) {
    const session = await getServerSession(authOptions);
    const lecturerId = (session?.user as any)?.id;
    const detailId = parseInt((await params).detailId, 10);
  
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