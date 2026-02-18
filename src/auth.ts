import NextAuth from "next-auth";
import Credentials from "next-auth/providers/credentials";

// Default admin credentials (in production, store these in environment variables)
const ADMIN_EMAIL = process.env.ADMIN_EMAIL || "admin@klowq.com";
const ADMIN_PASSWORD = process.env.ADMIN_PASSWORD || "admin123";

// Use environment variable or fallback to a default secret for development
// In production, always set NEXTAUTH_SECRET in your environment variables
const NEXTAUTH_SECRET = process.env.NEXTAUTH_SECRET || "development-secret-key-change-in-production";

export const { handlers, signIn, signOut, auth } = NextAuth({
  secret: NEXTAUTH_SECRET,
  providers: [
    Credentials({
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials) {
        if (!credentials?.email || !credentials?.password) {
          return null;
        }

        // In production, you would check against a database
        // For now, we'll use simple comparison
        // In a real app, you'd hash the password and compare
        if (
          credentials.email === ADMIN_EMAIL &&
          credentials.password === ADMIN_PASSWORD
        ) {
          return {
            id: "1",
            email: ADMIN_EMAIL,
            name: "Admin",
          };
        }

        return null;
      },
    }),
  ],
  pages: {
    signIn: "/login",
  },
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.id = user.id;
        token.email = user.email;
        token.name = user.name;
      }
      return token;
    },
    async session({ session, token }) {
      if (session.user) {
        session.user.id = token.id as string;
      }
      return session;
    },
  },
  session: {
    strategy: "jwt",
  },
});

