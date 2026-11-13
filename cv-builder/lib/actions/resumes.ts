'use server'

import { and, desc, eq, sql } from 'drizzle-orm'
import { revalidatePath } from 'next/cache'
import { z } from 'zod'
import { db } from '@/lib/db'
import { resume } from '@/lib/db/schema'
import { limitsFor } from '@/lib/plans'
import { sanitizeResume } from '@/lib/sanitize'
import { requireUser } from '@/lib/session'
import { generateId } from '@/lib/utils'
import { blankResume, normalizeResume } from '@/store/initial-state'
import type { CVData } from '@/models/cv.types'

export type ActionResult<T = undefined> = { ok: true; data: T } | { ok: false; error: string }

const MAX_BYTES = 1_500_000 // one resume incl. embedded photo
const title = z.string().trim().min(1).max(120)
// Shape check only: the editor owns the full structure, the server guards size and markup.
const cvShape = z.object({
  personal: z.object({}).passthrough(),
  design: z.object({}).passthrough(),
  sectionOrder: z.array(z.object({ id: z.string(), visible: z.boolean(), label: z.string() }).passthrough()),
}).passthrough()

/**
 * Insert that only succeeds while the user is under their plan's resume limit.
 * Count and insert are one statement, so parallel requests cannot overshoot.
 */
async function insertWithinLimit(userId: string, plan: string | null | undefined, name: string, data: CVData) {
  const { resumes: limit } = limitsFor(plan)
  const id = generateId()
  const res = await db.run(sql`
    INSERT INTO resume (id, user_id, title, data)
    SELECT ${id}, ${userId}, ${name}, ${JSON.stringify(data)}
    WHERE (SELECT count(*) FROM resume WHERE user_id = ${userId}) < ${Number.isFinite(limit) ? limit : 1e9}`)
  return res.rowsAffected === 1 ? id : null
}

const limitError = (plan: string | null | undefined) =>
  `You've reached the ${limitsFor(plan).resumes}-resume limit of your plan. Delete one to create another.`

export async function listResumes() {
  const user = await requireUser()
  return db.select().from(resume).where(eq(resume.userId, user.id)).orderBy(desc(resume.updatedAt))
}

export async function getResume(id: string) {
  const user = await requireUser()
  const [row] = await db.select().from(resume).where(and(eq(resume.id, id), eq(resume.userId, user.id)))
  return row ?? null
}

export async function createResume(design?: Partial<CVData['design']>): Promise<ActionResult<string>> {
  const user = await requireUser()
  const data = blankResume(user.name, user.email)
  if (design) Object.assign(data.design, z.object({}).passthrough().parse(design))
  const id = await insertWithinLimit(user.id, user.plan, 'Untitled resume', data)
  if (!id) return { ok: false, error: limitError(user.plan) }
  revalidatePath('/app/resumes')
  return { ok: true, data: id }
}

export async function duplicateResume(id: string): Promise<ActionResult<string>> {
  const user = await requireUser()
  const source = await getResume(id)
  if (!source) return { ok: false, error: 'Resume not found.' }
  const copy = await insertWithinLimit(user.id, user.plan, `${source.title} (copy)`.slice(0, 120), source.data)
  if (!copy) return { ok: false, error: limitError(user.plan) }
  revalidatePath('/app/resumes')
  return { ok: true, data: copy }
}

export async function renameResume(id: string, name: string): Promise<ActionResult> {
  const user = await requireUser()
  const parsed = title.safeParse(name)
  if (!parsed.success) return { ok: false, error: 'Title must be 1–120 characters.' }
  await db.update(resume).set({ title: parsed.data, updatedAt: new Date() })
    .where(and(eq(resume.id, id), eq(resume.userId, user.id)))
  revalidatePath('/app/resumes')
  return { ok: true, data: undefined }
}

export async function saveResume(id: string, data: CVData): Promise<ActionResult> {
  const user = await requireUser()
  if (!cvShape.safeParse(data).success) return { ok: false, error: 'Invalid resume data.' }
  const clean = sanitizeResume(normalizeResume(data))
  if (JSON.stringify(clean).length > MAX_BYTES) {
    return { ok: false, error: 'Resume is too large to save. Try a smaller photo.' }
  }
  const res = await db.update(resume).set({ data: clean, updatedAt: new Date() })
    .where(and(eq(resume.id, id), eq(resume.userId, user.id)))
  if (res.rowsAffected !== 1) return { ok: false, error: 'Resume not found.' }
  return { ok: true, data: undefined }
}

export async function deleteResume(id: string): Promise<ActionResult> {
  const user = await requireUser()
  await db.delete(resume).where(and(eq(resume.id, id), eq(resume.userId, user.id)))
  revalidatePath('/app/resumes')
  return { ok: true, data: undefined }
}
