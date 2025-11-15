import { NextAuthOptions } from "next-auth"
import { PrismaAdapter } from "@next-auth/prisma-adapter"
import CredentialsProvider from "next-auth/providers/credentials"
import GoogleProvider from "next-auth/providers/google"
import AzureADProvider from "next-auth/providers/azure-ad"
import bcrypt from "bcryptjs"
import prisma from "@/lib/prisma"

export const authOptions: NextAuthOptions = {
  adapter: PrismaAdapter(prisma),
  providers: [
    ...(process.env.GOOGLE_CLIENT_ID && process.env.GOOGLE_CLIENT_SECRET
      ? [
          GoogleProvider({
            clientId: process.env.GOOGLE_CLIENT_ID,
            clientSecret: process.env.GOOGLE_CLIENT_SECRET,
            allowDangerousEmailAccountLinking: true,
          }),
        ]
      : []),
    ...(process.env.AZURE_AD_CLIENT_ID && process.env.AZURE_AD_CLIENT_SECRET
      ? [
          AzureADProvider({
            clientId: process.env.AZURE_AD_CLIENT_ID,
            clientSecret: process.env.AZURE_AD_CLIENT_SECRET,
            tenantId: process.env.AZURE_AD_TENANT_ID || "common",
            allowDangerousEmailAccountLinking: true,
          }),
        ]
      : []),
    // Yahoo OAuth provider configuration
    ...(process.env.YAHOO_CLIENT_ID && process.env.YAHOO_CLIENT_SECRET
      ? [
          {
            id: "yahoo",
            name: "Yahoo",
            type: "oauth" as const,
            wellKnown: "https://api.login.yahoo.com/.well-known/openid-configuration",
            authorization: { params: { scope: "openid email profile" } },
            clientId: process.env.YAHOO_CLIENT_ID,
            clientSecret: process.env.YAHOO_CLIENT_SECRET,
            allowDangerousEmailAccountLinking: true,
            profile(profile: any) {
              return {
                id: profile.sub,
                name: profile.name || profile.nickname,
                email: profile.email,
                image: profile.picture,
              }
            },
          },
        ]
      : []),
    CredentialsProvider({
      name: "credentials",
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials) {
        try {
          if (!credentials?.email || !credentials?.password) {
            console.error("Missing credentials")
            return null
          }

          const user = await prisma.user.findUnique({
            where: { email: credentials.email.toLowerCase().trim() },
          })

          if (!user || !user.password) {
            console.error("User not found or no password set")
            return null
          }

          const isCorrectPassword = await bcrypt.compare(
            credentials.password,
            user.password
          )

          if (!isCorrectPassword) {
            console.error("Invalid password")
            return null
          }

          return {
            id: user.id,
            email: user.email,
            name: user.name,
            role: user.role,
            image: user.image,
          }
        } catch (error) {
          console.error("Authorization error:", error)
          return null
        }
      },
    }),
  ],
  callbacks: {
    async signIn({ user, account, profile }) {
      try {
        // For OAuth providers, ensure user exists in database
        if (account?.provider !== "credentials" && user.email) {
          const existingUser = await prisma.user.findUnique({
            where: { email: user.email },
          })

          if (!existingUser && profile) {
            // Create user if doesn't exist
            await prisma.user.create({
              data: {
                email: user.email,
                name: user.name || profile.name || "User",
                image: user.image || (profile as any)?.picture,
                role: "APPLICANT", // Default role
              },
            })
          }
        }
        return true
      } catch (error) {
        console.error("Sign in error:", error)
        return false
      }
    },
    async jwt({ token, user, trigger, session }) {
      if (trigger === "update" && session) {
        return { ...token, ...session.user }
      }
      
      if (user) {
        token.id = user.id
        token.role = (user as any).role || "APPLICANT"
        token.companyName = (user as any).companyName
      }
      
      // Fetch fresh user data to ensure role is up to date
      if (token.email) {
        try {
          const dbUser = await prisma.user.findUnique({
            where: { email: token.email },
            select: { id: true, role: true, companyName: true, name: true, image: true, employerId: true },
          })
          
          if (dbUser) {
            token.id = dbUser.id
            token.role = dbUser.role
            token.companyName = dbUser.companyName
            token.name = dbUser.name
            token.picture = dbUser.image
            token.employerId = dbUser.employerId
          }
        } catch (error) {
          console.error("Error fetching user in JWT callback:", error)
        }
      }
      
      return token
    },
    async session({ session, token }) {
      if (session.user) {
        (session.user as any).id = token.id;
        (session.user as any).role = token.role || "APPLICANT";
        (session.user as any).companyName = token.companyName;
        (session.user as any).employerId = token.employerId;
        session.user.name = token.name as string;
        session.user.image = token.picture as string;
      }
      return session;
    },
  },
  pages: {
    signIn: "/auth/applicant",
  },
  session: {
    strategy: "jwt",
  },
  secret: process.env.NEXTAUTH_SECRET,
}
