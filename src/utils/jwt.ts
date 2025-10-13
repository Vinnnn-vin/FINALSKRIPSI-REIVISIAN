// src\utils\jwt.ts
import jwt, { SignOptions } from 'jsonwebtoken';
import { User } from "../types";

const JWT_SECRET = process.env.JWT_SECRET || "AKUMAULULUS";
const JWT_REFRESH_SECRET = process.env.JWT_REFRESH_SECRET || "AKUMAUJWTBARU";

// export interface JWTPayload {
//   userId: number;
//   email: string;
//   role: string;
//   type: 'access' | 'refresh';
// }

// type TokenUserPayload = Pick<User, 'user_id' | 'email' | 'role'>;

// export class JWTService {
//   static generateAccessToken(user: any): string {
//     return jwt.sign(
//       {
//         userId: user.user_id || user.id,
//         email: user.email,
//         role: user.role,
//         type: 'access'
//       },
//       JWT_SECRET,
//       {
//         expiresIn: '15m',
//         issuer: 'learning-platform',
//         audience: 'platform-users'
//       }
//     );
//   }

//   // Generate Refresh Token (7 days)
//   static generateRefreshToken(user: any): string {
//     return jwt.sign(
//       {
//         userId: user.user_id || user.id,
//         email: user.email,
//         role: user.role,
//         type: 'refresh'
//       },
//       JWT_REFRESH_SECRET,
//       {
//         expiresIn: '7d',
//         issuer: 'learning-platform',
//         audience: 'platform-users'
//       }
//     );
//   }

//   // Verify Access Token
//   static verifyAccessToken(token: string): JWTPayload | null {
//     try {
//       const decoded = jwt.verify(token, JWT_SECRET, {
//         issuer: 'learning-platform',
//         audience: 'platform-users'
//       }) as JWTPayload;

//       return decoded.type === 'access' ? decoded : null;
//     } catch (error) {
//       console.error('Access token verification failed:', error);
//       return null;
//     }
//   }

//   // Verify Refresh Token
//   static verifyRefreshToken(token: string): JWTPayload | null {
//     try {
//       const decoded = jwt.verify(token, JWT_REFRESH_SECRET, {
//         issuer: 'learning-platform',
//         audience: 'platform-users'
//       }) as JWTPayload;

//       return decoded.type === 'refresh' ? decoded : null;
//     } catch (error) {
//       console.error('Refresh token verification failed:', error);
//       return null;
//     }
//   }

//   // Extract token from Authorization header
//   static extractTokenFromHeader(authHeader: string | null): string | null {
//     if (!authHeader || !authHeader.startsWith('Bearer ')) {
//       return null;
//     }
//     return authHeader.substring(7);
//   }
// }

export interface JWTPayload {
  userId: number;
  email: string;
  role: string;
}

// ✅ Terima payload minimal, bukan seluruh objek 'any' atau 'User'
type TokenUserPayload = Pick<User, "user_id" | "email" | "role">;

export class JWTService {
  private static sign(
    payload: object,
    secret: string,
    options: SignOptions
  ): string {
    return jwt.sign(payload, secret, options);
  }

  private static verify(token: string, secret: string): JWTPayload | null {
    try {
      return jwt.verify(token, secret) as JWTPayload;
    } catch (error) {
      console.error("Token verification failed:", error);
      return null;
    }
  }

  static generateAccessToken(user: TokenUserPayload): string {
    const payload = {
      userId: user.user_id,
      email: user.email!,
      role: user.role!,
    };
    return this.sign(payload, JWT_SECRET, { expiresIn: "15m" });
  }

  static generateRefreshToken(user: TokenUserPayload): string {
    const payload = {
      userId: user.user_id,
      email: user.email!,
      role: user.role!,
    };
    return this.sign(payload, JWT_REFRESH_SECRET, { expiresIn: "7d" });
  }

  static verifyAccessToken(token: string): JWTPayload | null {
    return this.verify(token, JWT_SECRET);
  }

  static verifyRefreshToken(token: string): JWTPayload | null {
    return this.verify(token, JWT_REFRESH_SECRET);
  }
}
