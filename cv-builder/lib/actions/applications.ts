'use server'

import { and, desc, eq, sql } from 'drizzle-orm'
import { revalidatePath } from 'next/cache'
import { z } from 'zod'
import { db } from '@/lib/db'
import { application, APPLICATION_STATUSES, resume } from '@/lib/db/schema'
import { limitsFor } from '@/lib/plans'
import { requireUser } from '@/lib/session'
import { generateId } from '@/lib/utils'
import type { ActionResult } from './resumes'

// No zod defaults here: the partial() used for updates must not reset omitted fields.
const input = z.object({
  company: z.string().trim().min(1, 'Company is required').max(120),
  position: z.string().trim().min(1, 'Position is required').max(120),
  status: z.enum(APPLICATION_STATUSES),
  location: z.string().trim().max(120),
  url: z.union([z.literal(''), z.string().trim().url('Link must be a full URL (https://…)').max(500)]),
  salary: z.string().trim().max(80),
  notes: z.string().max(5000),
  appliedAt: z.union([z.literal(''), z.string().regex(/^\d{4}-\d{2}-\d{2}$/)]),
  resumeId: z.string().nullable(),
})
export type ApplicationInput = z.input<typeof input>

const firstError = (e: z.ZodError) => e.issues[0]?.message ?? 'Invalid input.'

/** A resume link is only kept when the resume belongs to the same user. */
async function ownResumeId(userId: string, resumeId: string | null) {
  if (!resumeId) return null
  const [row] = await db.select({ id: resume.id }).from(resume)
    .where(and(eq(resume.id, resumeId), eq(resume.userId, userId)))
  return row?.id ?? null
}

export async function listApplications() {
  const user = await requireUser()
  return db.select().from(application).where(eq(application.userId, user.id)).orderBy(desc(application.updatedAt))
}

export async function createApplication(raw: ApplicationInput): Promise<ActionResult<string>> {
  const user = await requireUser()
  const parsed = input.safeParse(raw)
  if (!parsed.success) return { ok: false, error: firstError(parsed.error) }
  const a = parsed.data
  const { applications: limit } = limitsFor(user.plan)
  const id = generateId()
  const resumeId = await ownResumeId(user.id, a.resumeId)
  // Count + insert in one statement so parallel requests cannot exceed the plan limit.
  const res = await db.run(sql`
    INSERT INTO application (id, user_id, company, position, status, location, url, salary, notes, applied_at, resume_id)
    SELECT ${id}, ${user.id}, ${a.company}, ${a.position}, ${a.status}, ${a.location}, ${a.url}, ${a.salary},
           ${a.notes}, ${a.appliedAt}, ${resumeId}
    WHERE (SELECT count(*) FROM application WHERE user_id = ${user.id}) < ${Number.isFinite(limit) ? limit : 1e9}`)
  if (res.rowsAffected !== 1) {
    return { ok: false, error: `You've reached the ${limit}-application limit of your plan. Delete one to track another.` }
  }
  revalidatePath('/app/jobs')
  return { ok: true, data: id }
}

export async function updateApplication(id: string, raw: Partial<ApplicationInput>): Promise<ActionResult> {
  const user = await requireUser()
  const parsed = input.partial().safeParse(raw)
  if (!parsed.success) return { ok: false, error: firstError(parsed.error) }
  const patch = { ...parsed.data }
  if (patch.resumeId !== undefined) patch.resumeId = await ownResumeId(user.id, patch.resumeId)
  const res = await db.update(application).set({ ...patch, updatedAt: new Date() })
    .where(and(eq(application.id, id), eq(application.userId, user.id)))
  if (res.rowsAffected !== 1) return { ok: false, error: 'Application not found.' }
  revalidatePath('/app/jobs')
  return { ok: true, data: undefined }
}

export async function deleteApplication(id: string): Promise<ActionResult> {
  const user = await requireUser()
  await db.delete(application).where(and(eq(application.id, id), eq(application.userId, user.id)))
  revalidatePath('/app/jobs')
  return { ok: true, data: undefined }
}
