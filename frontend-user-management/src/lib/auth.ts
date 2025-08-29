import { betterAuth } from "better-auth"
import { prismaAdapter } from "better-auth/adapters/prisma"
import { nextCookies } from "better-auth/next-js"
//import { Resend } from "resend"
import { db } from "~/server/db"


// const resend = new Resend(process.env.RESEND_API_KEY);

export const auth = betterAuth({
  database: prismaAdapter(db, {
    provider: "postgresql",
  }),
    emailAndPassword: {
        enabled: true,
        autoSignIn: false,
      /*   requireEmailVerification: true,
       sendResetPassword: async ({ user, url }) => {
        try {
            console.log('Attempting to send reset password email to:', user.email);
            // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
            const result = await resend.emails.send({
            from: "onboarding@resend.dev", // Use verified domain for testing
            to: user.email,
            subject: "Reset Your Password",
            html: `
                <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
                <h2>Reset Your Password</h2>
                <p>Hi ${user.name || user.email},</p>
                <p>You requested to reset your password. Click the button below to reset it:</p>
                <a href="${url}" style="display: inline-block; background-color: #007bff; color: white; padding: 12px 24px; text-decoration: none; border-radius: 4px; margin: 16px 0;">
                    Reset Password
                </a>
                <p>If you didn't request this, please ignore this email.</p>
                <p>This link will expire in 1 hour.</p>
                </div>
            `,
            });
            console.log('Reset password email sent successfully:', result);
        } catch (error) {
            console.error('Failed to send reset password email:', error);
            throw error;
        }
        },
        */
    },
  /*  emailVerification: {
        sendVerificationEmail: async ({ user, url }) => {
        try {
            console.log('Attempting to send verification email to:', user.email);
            // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
            const result = await resend.emails.send({
            from: "onboarding@resend.dev", // Use verified domain for testing
            to: user.email,
            subject: "Verify Your Email Address",
            html: `
                <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
                <h2>Verify Your Email Address</h2>
                <p>Hi ${user.name || user.email},</p>
                <p>Thank you for signing up! Please verify your email address by clicking the button below:</p>
                <a href="${url}" style="display: inline-block; background-color: #28a745; color: white; padding: 12px 24px; text-decoration: none; border-radius: 4px; margin: 16px 0;">
                    Verify Email
                </a>
                <p>If you didn't create an account, please ignore this email.</p>
                <p>This link will expire in 24 hours.</p>
                </div>
            `,
            });
            console.log('Verification email sent successfully:', result);
        } catch (error) {
            console.error('Failed to send verification email:', error);
            throw error;
        }
        },
        sendOnSignUp: true,
        autoSignInAfterVerification: true,
    },*/
  socialProviders: {
    google: {
      clientId: process.env.GOOGLE_CLIENT_ID!,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
    },
  },
   session: {
        expiresIn: 60 * 60 * 24 * 1 , // 1 days
        updateAge: 60 * 60 * 12 // 12 hours (every 12 hours the session expiration is updated)
    },
  plugins: [nextCookies()],
})

export type Session = typeof auth.$Infer.Session
export type User = typeof auth.$Infer.Session["user"]
