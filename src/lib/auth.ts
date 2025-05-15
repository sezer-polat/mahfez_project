import { NextAuthOptions } from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import { prisma } from "@/lib/prisma";
import { compare, hash } from 'bcryptjs';

export const authOptions: NextAuthOptions = {
  providers: [
    CredentialsProvider({
      id: "credentials",
      name: "Credentials",
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" }
      },
      async authorize(credentials) {
        try {
          if (!credentials?.email || !credentials?.password) {
            console.log('Missing credentials');
            throw new Error("Email ve şifre gereklidir");
          }

          console.log('Looking for user:', credentials.email);
          const user = await prisma.user.findUnique({
            where: {
              email: credentials.email,
            },
          });

          if (!user) {
            console.log('User not found');
            throw new Error("Kullanıcı bulunamadı");
          }

          console.log('Comparing passwords');
          const isPasswordValid = await compare(credentials.password, user.password);

          if (!isPasswordValid) {
            console.log('Invalid password');
            throw new Error("Geçersiz şifre");
          }

          console.log('Login successful');
          return {
            id: user.id,
            email: user.email,
            name: user.name || '',
            role: user.role,
          };
        } catch (error) {
          console.error('Auth error:', error);
          throw error;
        }
      },
    }),
  ],
  session: {
    strategy: "jwt",
    maxAge: 30 * 24 * 60 * 60, // 30 days
  },
  pages: {
    signIn: "/giris",
  },
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        return {
          ...token,
          id: user.id,
          role: user.role,
        };
      }
      return token;
    },
    async session({ session, token }) {
      return {
        ...session,
        user: {
          ...session.user,
          id: token.id,
          role: token.role,
        },
      };
    },
  },
  secret: process.env.NEXTAUTH_SECRET,
  debug: process.env.NODE_ENV === 'development',
};

export async function hashPassword(password: string): Promise<string> {
  return hash(password, 12);
}

export async function verifyPassword(password: string, hashedPassword: string): Promise<boolean> {
  return compare(password, hashedPassword);
}

export function validatePassword(password: string): { isValid: boolean; message?: string } {
  // En az 8 karakter
  if (password.length < 8) {
    return {
      isValid: false,
      message: 'Şifre en az 8 karakter uzunluğunda olmalıdır',
    };
  }

  // En az bir büyük harf
  if (!/[A-Z]/.test(password)) {
    return {
      isValid: false,
      message: 'Şifre en az bir büyük harf içermelidir',
    };
  }

  // En az bir küçük harf
  if (!/[a-z]/.test(password)) {
    return {
      isValid: false,
      message: 'Şifre en az bir küçük harf içermelidir',
    };
  }

  // En az bir rakam
  if (!/[0-9]/.test(password)) {
    return {
      isValid: false,
      message: 'Şifre en az bir rakam içermelidir',
    };
  }

  // En az bir özel karakter
  if (!/[!@#$%^&*(),.?":{}|<>]/.test(password)) {
    return {
      isValid: false,
      message: 'Şifre en az bir özel karakter içermelidir (!@#$%^&*(),.?":{}|<>)',
    };
  }

  return { isValid: true };
} 