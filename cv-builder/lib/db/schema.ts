import { sql } from 'drizzle-orm'
import { index, integer, sqliteTable, text } from 'drizzle-orm/sqlite-core'
import type { CVData } from '@/models/cv.types'

const timestamps = {
  createdAt: integer('created_at', { mode: 'timestamp_ms' }).notNull().default(sql`(unixepoch() * 1000)`),
  updatedAt: integer('updated_at', { mode: 'timestamp_ms' }).notNull().default(sql`(unixepoch() * 1000)`),
}

// ─── Better Auth tables ──────────────────────────────────────────────────────

export const user = sqliteTable('user', {
  id: text('id').primaryKey(),
  name: text('name').notNull(),
  email: text('email').notNull().unique(),
  emailVerified: integer('email_verified', { mode: 'boolean' }).notNull().default(false),
  image: text('image'),
  plan: text('plan', { enum: ['free', 'pro'] }).notNull().default('free'),
  ...timestamps,
})

export const session = sqliteTable('session', {
  id: text('id').primaryKey(),
  expiresAt: integer('expires_at', { mode: 'timestamp_ms' }).notNull(),
  token: text('token').notNull().unique(),
  ipAddress: text('ip_address'),
  userAgent: text('user_agent'),
  userId: text('user_id').notNull().references(() => user.id, { onDelete: 'cascade' }),
  ...timestamps,
}, (t) => [index('session_user_idx').on(t.userId)])

export const account = sqliteTable('account', {
  id: text('id').primaryKey(),
  accountId: text('account_id').notNull(),
  providerId: text('provider_id').notNull(),
  userId: text('user_id').notNull().references(() => user.id, { onDelete: 'cascade' }),
  accessToken: text('access_token'),
  refreshToken: text('refresh_token'),
  idToken: text('id_token'),
  accessTokenExpiresAt: integer('access_token_expires_at', { mode: 'timestamp_ms' }),
  refreshTokenExpiresAt: integer('refresh_token_expires_at', { mode: 'timestamp_ms' }),
  scope: text('scope'),
  password: text('password'),
  ...timestamps,
}, (t) => [index('account_user_idx').on(t.userId)])

export const verification = sqliteTable('verification', {
  id: text('id').primaryKey(),
  identifier: text('identifier').notNull(),
  value: text('value').notNull(),
  expiresAt: integer('expires_at', { mode: 'timestamp_ms' }).notNull(),
  ...timestamps,
}, (t) => [index('verification_identifier_idx').on(t.identifier)])

// ─── App tables ──────────────────────────────────────────────────────────────

export const resume = sqliteTable('resume', {
  id: text('id').primaryKey(),
  userId: text('user_id').notNull().references(() => user.id, { onDelete: 'cascade' }),
  title: text('title').notNull(),
  data: text('data', { mode: 'json' }).$type<CVData>().notNull(),
  ...timestamps,
}, (t) => [index('resume_user_idx').on(t.userId)])

export const APPLICATION_STATUSES = ['wishlist', 'applied', 'interview', 'offer', 'rejected'] as const
export type ApplicationStatus = (typeof APPLICATION_STATUSES)[number]

export const application = sqliteTable('application', {
  id: text('id').primaryKey(),
  userId: text('user_id').notNull().references(() => user.id, { onDelete: 'cascade' }),
  company: text('company').notNull(),
  position: text('position').notNull(),
  status: text('status', { enum: APPLICATION_STATUSES }).notNull().default('wishlist'),
  location: text('location').notNull().default(''),
  url: text('url').notNull().default(''),
  salary: text('salary').notNull().default(''),
  notes: text('notes').notNull().default(''),
  appliedAt: text('applied_at').notNull().default(''), // yyyy-mm-dd
  resumeId: text('resume_id').references(() => resume.id, { onDelete: 'set null' }),
  ...timestamps,
}, (t) => [index('application_user_idx').on(t.userId)])

export type Resume = typeof resume.$inferSelect
export type Application = typeof application.$inferSelect
