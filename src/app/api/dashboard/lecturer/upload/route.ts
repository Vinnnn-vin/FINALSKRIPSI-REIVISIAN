// src\app\api\dashboard\lecturer\upload\route.ts
/* eslint-disable @typescript-eslint/no-explicit-any */
import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "../../../auth/[...nextauth]/route";
import { writeFile, mkdir } from "fs/promises";
import path from "path";
import { existsSync } from "fs";

export async function POST(req: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    
    if (!session || (session.user as any)?.role !== "lecturer") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 403 });
    }

    const formData = await req.formData();
    const file = formData.get("file") as File;
    const uploadType = formData.get("type") as string; // "material" | "assignment"
    const fileCategory = formData.get("category") as string; // "video" | "pdf" | "image" (for materials)
    
    if (!file) {
      return NextResponse.json({ error: "No file provided" }, { status: 400 });
    }

    if (!uploadType || !["material", "assignment"].includes(uploadType)) {
      return NextResponse.json({ 
        error: "Invalid upload type. Must be 'material' or 'assignment'" 
      }, { status: 400 });
    }

    let allowedTypes: string[] = [];
    let maxSize: number = 0;
    let uploadPath: string = "";

    // Configure based on upload type
    if (uploadType === "material") {
      if (!fileCategory || !["video", "pdf", "image"].includes(fileCategory)) {
        return NextResponse.json({ 
          error: "Invalid file category for material. Must be 'video', 'pdf', or 'image'" 
        }, { status: 400 });
      }

      const materialTypes = {
        video: {
          types: ["video/mp4", "video/webm", "video/ogg", "video/mov", "video/avi"],
          maxSize: 500 * 1024 * 1024, // 500MB
        },
        pdf: {
          types: ["application/pdf"],
          maxSize: 50 * 1024 * 1024, // 50MB
        },
        image: {
          types: ["image/jpeg", "image/jpg", "image/png", "image/gif", "image/webp"],
          maxSize: 10 * 1024 * 1024, // 10MB
        }
      };

      const config = materialTypes[fileCategory as keyof typeof materialTypes];
      allowedTypes = config.types;
      maxSize = config.maxSize;
      uploadPath = path.join("uploads", "materials", fileCategory);

    } else if (uploadType === "assignment") {
      allowedTypes = [
        "application/pdf",
        "application/msword",
        "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
        "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
        "application/vnd.ms-excel",
        "text/plain",
        "image/jpeg",
        "image/jpg", 
        "image/png"
      ];
      maxSize = 50 * 1024 * 1024; // 50MB
      uploadPath = path.join("uploads", "assignments");
    }

    // Validate file type
    if (!allowedTypes.includes(file.type)) {
      return NextResponse.json({ 
        error: `Invalid file type. Allowed types: ${allowedTypes.join(", ")}` 
      }, { status: 400 });
    }

    // Validate file size
    if (file.size > maxSize) {
      return NextResponse.json({ 
        error: `File too large. Maximum size: ${Math.round(maxSize / 1024 / 1024)}MB` 
      }, { status: 400 });
    }

    // Create directory structure
    const fullUploadDir = path.join(process.cwd(), "public", uploadPath);
    if (!existsSync(fullUploadDir)) {
      await mkdir(fullUploadDir, { recursive: true });
    }

    // Generate unique filename
    const timestamp = Date.now();
    const lecturerId = (session.user as any)?.id;
    const sanitizedFileName = file.name.replace(/[^a-zA-Z0-9.-]/g, '_');
    const fileExtension = path.extname(sanitizedFileName);
    const baseName = path.basename(sanitizedFileName, fileExtension);
    const fileName = `${lecturerId}_${timestamp}_${baseName}${fileExtension}`;
    const filePath = path.join(fullUploadDir, fileName);

    // Save file
    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);
    await writeFile(filePath, buffer);

    // Generate public URL
    const publicUrl = `/${uploadPath.replace(/\\/g, '/')}/${fileName}`;
    
    // Return response with file info
    return NextResponse.json({
      success: true,
      data: {
        url: publicUrl,
        originalName: file.name,
        fileName: fileName,
        size: file.size,
        type: file.type,
        uploadType: uploadType,
        category: uploadType === "material" ? fileCategory : undefined,
        uploadedAt: new Date().toISOString(),
      }
    });

  } catch (error: any) {
    console.error("File upload error:", error);
    return NextResponse.json(
      { 
        error: "Failed to upload file", 
        details: process.env.NODE_ENV === 'development' ? error.message : undefined 
      },
      { status: 500 }
    );
  }
}

// Optional: GET method to list uploaded files (for management)
export async function GET(req: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    
    if (!session || (session.user as any)?.role !== "lecturer") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 403 });
    }

    const { searchParams } = new URL(req.url);
    const type = searchParams.get("type"); // "material" | "assignment"
    const lecturerId = (session.user as any)?.id;

    // This is a basic implementation - you might want to store file metadata in database
    return NextResponse.json({
      message: "File listing endpoint - implement based on your needs",
      lecturerId,
      type
    });

  } catch (error: any) {
    console.error("File listing error:", error);
    return NextResponse.json(
      { error: "Failed to list files" },
      { status: 500 }
    );
  }
}