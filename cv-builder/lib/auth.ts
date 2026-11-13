import { betterAuth } from 'better-auth'
import { drizzleAdapter } from 'better-auth/adapters/drizzle'
import { nextCookies } from 'better-auth/next-js'
import { db } from './db'
import * as schema from './db/schema'

const google = process.env.GOOGLE_CLIENT_ID && process.env.GOOGLE_CLIENT_SECRET
  ? { google: { clientId: process.env.GOOGLE_CLIENT_ID, clientSecret: process.env.GOOGLE_CLIENT_SECRET } }
  : undefined

export const auth = betterAuth({
  database: drizzleAdapter(db, { provider: 'sqlite', schema }),
  emailAndPassword: { enabled: true, minPasswordLength: 8 },
  socialProviders: google,
  user: {
    additionalFields: {
      // input: false — users cannot set their own plan at sign-up
      plan: { type: 'string', defaultValue: 'free', input: false },
    },
  },
  plugins: [nextCookies()], // must stay last
})

export const googleEnabled = !!google
