// src\app\api\dashboard\student\certificates\route.ts

import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import { Certificate, Course } from "@/models";

export async function GET() {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.id) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    const certificates = await Certificate.findAll({
      where: { user_id: session.user.id },
      include: [{ model: Course, as: "course" }],
    });

    return NextResponse.json(certificates);
  } catch (err) {
    console.error("Error fetching certificates:", err);
    return NextResponse.json({ error: "Failed to fetch certificates" }, { status: 500 });
  }
}
