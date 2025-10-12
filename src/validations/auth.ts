// src\validations\auth.ts
import { z } from "zod";

export const registerSchema = z
  .object({
    first_name: z.string().min(2, "First name must have at least 2 letters"),
    last_name: z.string().min(2, "Last name must have at least 2 letters"),
    email: z.string().min(1, "Email is required").email("Invalid email format"),
    // password: z
    //   .string()
    //   .min(8, "Password must be at least 8 characters")
    //   .regex(/[A-Z]/, "Password must contain uppercase letter")
    //   .regex(/[a-z]/, "Password must contain lowercase letter")
    //   .regex(/[0-9]/, "Password must contain number")
    //   .regex(/[^A-Za-z0-9]/, "Password must contain symbol"),
    password: z.string().min(1),
    confirmPassword: z.string().min(1, "Confirm password is required"),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Passwords do not match",
    path: ["confirmPassword"],
  });

// export function processUserData(data: unknown) {
//   const loginSchema = z.object({
//     email: z
//       .string()
//       .min(1, "Email harus diisi")
//       .email("Format email tidak valid"),
//     password: z.string().min(1, "Password harus diisi"),
//   }).parse(data)
// }

export const loginSchema = z.object({
  email: z
    .string()
    .min(1, "Email harus diisi")
    .email("Format email tidak valid"),
  password: z.string().min(1, "Password harus diisi"),
});

export type RegisterInput = z.infer<typeof registerSchema>;
export type LoginInput = z.infer<typeof loginSchema>;
