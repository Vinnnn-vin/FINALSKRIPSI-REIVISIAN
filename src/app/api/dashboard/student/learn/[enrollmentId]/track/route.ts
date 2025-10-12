// src\app\api\dashboard\student\learn\[enrollmentId]\track\route.ts
/* eslint-disable @typescript-eslint/no-explicit-any */

import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "../../../../../auth/[...nextauth]/route";
// import { Enrollment } from "@/models";

export async function POST(
  req: NextRequest,
  // { params }: { params: Promise<{ enrollmentId: string }> }
) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user || (session.user as any)?.role !== "student") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 403 });
    }
    // const userId = parseInt((session.user as any).id);
    // const enrollmentId = parseInt((await params).enrollmentId);

    const { itemId, itemType } = await req.json();
    if (!itemId || !itemType) {
      return NextResponse.json(
        { error: "Invalid tracking data" },
        { status: 400 }
      );
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Tracking error:", error);
    return NextResponse.json(
      { error: "Failed to track progress" },
      { status: 500 }
    );
  }
}
