// src\app\api\auth\[...nextauth]\route.ts
import NextAuth, {
  AuthOptions,
  User as NextAuthUser,
  Account,
  Profile,
} from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import GoogleProvider, { GoogleProfile } from "next-auth/providers/google";
import { User } from "@/models"; 
import bcrypt from "bcrypt";

export const authOptions: AuthOptions = {
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID!,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
    }),
    CredentialsProvider({
      name: "Credentials",
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials) {
        if (!credentials?.email || !credentials?.password) {
          return null;
        }

        const user = await User.findOne({
          where: { email: credentials.email },
        });

        if (!user || !user.password_hash) {
          return null;
        }

        const isValidPassword = await bcrypt.compare(
          credentials.password,
          user.password_hash
        );

        if (!isValidPassword) {
          return null;
        }
        return {
          id: user.user_id.toString(),
          email: user.email,
          name: user.full_name,
          role: user.role,
        };
      },
    }),
  ],
  callbacks: {
    async signIn({
      user,
      account,
      profile,
    }: {
      user: NextAuthUser;
      account: Account | null;
      profile?: Profile | GoogleProfile;
    }) {
      if (account?.provider === "google") {
        try {
          const existingUser = await User.findOne({
            where: { email: user.email! },
          });

          if (!existingUser) {
            const googleProfile = profile as GoogleProfile;
            await User.create({
              first_name: googleProfile?.given_name || user.name?.split(" ")[0],
              last_name:
                googleProfile?.family_name || user.name?.split(" ")[1] || "",
              email: user.email!,
              password_hash: "Login Google",
              role: "student",
              created_at: new Date(),
            });
          }
        } catch (error) {
          console.error("Error creating Google user:", error);
          return false; 
        }
      }
      return true; 
    },
    jwt({ token, user }) {
      if (user) {
        token.id = user.id;
        token.role = user.role;
      }
      return token;
    },
    session({ session, token }) {
      if (session.user) {
        session.user.id = token.id;
        session.user.role = token.role;
      }
      return session;
    },
  },
  session: {
    strategy: "jwt",
    maxAge: 24 * 60 * 60, // 1 Hari
  },
  secret: process.env.NEXTAUTH_SECRET,
  pages: {
    signIn: "/frontend/auth/login",
  },
};

const handler = NextAuth(authOptions);

export { handler as GET, handler as POST };