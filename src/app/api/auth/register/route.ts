// src\app\api\auth\register\route.ts
/* eslint-disable @typescript-eslint/no-explicit-any */
import { NextResponse } from "next/server";
import { User } from "@/models";
import bcrypt from "bcrypt";
import { registerSchema } from "@/validations/auth";

export async function POST(req: Request) {
  try {
    const body = await req.json();

    console.log("Registration attempt:", {
      email: body.email,
      timestamp: new Date().toISOString(),
    });

    const validation = registerSchema.safeParse(body);

    if (!validation.success) {
      const formattedErrors = validation.error.issues.reduce((acc, issue) => {
        const field = issue.path[0];
        acc[String(field)] = issue.message;
        return acc;
      }, {} as Record<string, string>);

      console.log("Validation errors:", formattedErrors);

      return NextResponse.json(
        {
          error: "Please correct the errors in the form",
          fields: formattedErrors,
        },
        { status: 400 }
      );
    }

    const { first_name, last_name, email, password } = validation.data;

    try {
      const existingUser = await User.findOne({
        where: { email: email.toLowerCase() },
      });
      if (existingUser) {
        console.log("User already exists:", email);
        return NextResponse.json(
          {
            error:
              "An account with this email already exists. Please use a different email or try logging in instead.",
            fields: { email: "This email is already registered" },
          },
          { status: 409 }
        );
      }
    } catch (dbError) {
      console.error("Database error when checking existing user:", dbError);
      return NextResponse.json(
        { error: "Database connection error. Please try again later." },
        { status: 503 }
      );
    }

    // Hash password
    let password_hash: string;
    try {
      password_hash = await bcrypt.hash(password, 12);
    } catch (hashError) {
      console.error("Password hashing error:", hashError);
      return NextResponse.json(
        { error: "Password processing error. Please try again." },
        { status: 500 }
      );
    }

    try {
      const newUser = await User.create({
        first_name: first_name.trim(),
        last_name: last_name.trim(),
        email: email.toLowerCase().trim(),
        password_hash,
        role: "student",
        created_at: new Date(),
        updated_at: new Date(),
      });

      console.log("User created successfully:", {
        id: newUser.user_id,
        email: newUser.email,
        timestamp: new Date().toISOString(),
      });

      return NextResponse.json(
        {
          message: "Account created successfully",
          user: {
            id: newUser.user_id,
            first_name: newUser.first_name,
            last_name: newUser.last_name,
            email: newUser.email,
            role: newUser.role,
          },
        },
        { status: 201 }
      );
    } catch (error: any) {
      console.error("User creation error:", error);

      if (error.name === "SequelizeUniqueConstraintError") {
        return NextResponse.json(
          {
            error: "An account with this email already exists.",
            fields: { email: "This email is already registered" },
          },
          { status: 409 }
        );
      }

      return NextResponse.json(
        { error: "Failed to create account. Please try again later." },
        { status: 500 }
      );
    }
  } catch (error: any) {
    console.error("Registration error:", error);

    if (error instanceof SyntaxError) {
      return NextResponse.json(
        { error: "Invalid request format. Please try again." },
        { status: 400 }
      );
    }

    return NextResponse.json(
      { error: "An unexpected error occurred. Please try again later." },
      { status: 500 }
    );
  }
}
