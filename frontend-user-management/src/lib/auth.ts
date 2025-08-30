import { betterAuth, number } from "better-auth"
import { prismaAdapter } from "better-auth/adapters/prisma"
import { nextCookies } from "better-auth/next-js"
import { jwt } from "better-auth/plugins"
import { admin } from "better-auth/plugins"
import { db } from "~/server/db"

export const auth = betterAuth({
  database: prismaAdapter(db, {
    provider: "postgresql",
  }),
  
  emailAndPassword: {
    enabled: true,
    autoSignIn: false,
    sendOnSignUp: true,
    autoSignInAfterVerification: true,
  },
  
  socialProviders: {
    google: {
      clientId: process.env.GOOGLE_CLIENT_ID!,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
    },
  },

  session: {
    expiresIn: 60 * 60 * 24 * 1, // 1 days
    updateAge: 60 * 60 * 12, // 12 hours
  },

  plugins: [
    jwt({
      issuer: "marketplace",
      audience: "marketplace-services",
      enableJwtInSignIn: true,
      jwt: {
        expirationTime: 60 * 60 * 24 * 1,
        algorithm: 'HS256',
        definePayload: ({ user }) => ({
          id: user.id,
          email: user.email,
          role: user.role as string
        })
      },
      jwks: {
        keyPairConfig: {
          alg: "EdDSA",
          crv: "Ed25519"
        }
      }
    }),
    admin({
      adminUserIds: [], 
         }),
        nextCookies(),

  ],
})

export type Session = typeof auth.$Infer.Session
export type User = typeof auth.$Infer.Session['user']