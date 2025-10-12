// src\app\api\dashboard\lecturer\content\[contentId]\route.ts
/* eslint-disable @typescript-eslint/no-explicit-any */
import { NextResponse } from "next/server";
import { MaterialDetail, Assignment, QuizQuestion } from "@/models";

export async function PUT(
  req: Request,
  { params }: { params: { contentId: string } }
) {
  try {
    const body = await req.json();

    const updated = await MaterialDetail.update(
      {
        material_detail_name: body.name,
        material_detail_description: body.description,
      },
      { where: { material_detail_id: params.contentId } }
    );

    return NextResponse.json(updated);
  } catch (e: any) {
    return NextResponse.json({ error: e.message }, { status: 500 });
  }
}

export async function DELETE(
  req: Request,
  { params }: { params: { contentId: string } }
) {
  try {
    await MaterialDetail.destroy({ where: { material_detail_id: params.contentId } });
    return NextResponse.json({ success: true });
  } catch (e: any) {
    return NextResponse.json({ error: e.message }, { status: 500 });
  }
}
