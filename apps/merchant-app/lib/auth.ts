import GoogleProvider from "next-auth/providers/google";
import CredentialsProvider from "next-auth/providers/credentials";
import db from "@repo/db/client";

export const authOptions = {
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID || "",
      clientSecret: process.env.GOOGLE_CLIENT_SECRET || ""
    }),
    CredentialsProvider({
      name: "Credentials",
      credentials: {
        email: { label: "Email", type: "text", placeholder: "merchant@example.com" },
        password: { label: "Password", type: "password" }
      },
      async authorize(credentials: any) {
        if (!credentials?.email || !credentials?.password) {
          return null;
        }

        const email = credentials.email;
        const name = email.split('@')[0];

        // Create or find mock merchant in DB for local test credentials
        let existingMerchant = await db.merchant.findUnique({
          where: { email }
        });

        if (!existingMerchant) {
          existingMerchant = await db.merchant.create({
            data: {
              email,
              name,
              auth_type: "Google"
            }
          });
        }

        return {
          id: existingMerchant.id.toString(),
          name: existingMerchant.name,
          email: existingMerchant.email
        };
      }
    })
  ],
  callbacks: {
    async signIn({ user, account }: {
      user: any;
      account: any;
    }) {
      if (!user || !user.email) {
        return false;
      }

      await db.merchant.upsert({
        select: {
          id: true
        },
        where: {
          email: user.email
        },
        create: {
          email: user.email,
          name: user.name || user.email.split('@')[0],
          auth_type: account.provider === "google" ? "Google" : "Google"
        },
        update: {
          name: user.name || user.email.split('@')[0],
          auth_type: account.provider === "google" ? "Google" : "Google"
        }
      });

      return true;
    },
    async session({ token, session }: any) {
      if (session.user) {
        session.user.id = token.sub;
      }
      return session;
    }
  },
  pages: {
    signIn: "/signin"
  },
  secret: process.env.NEXTAUTH_SECRET || "secret"
};