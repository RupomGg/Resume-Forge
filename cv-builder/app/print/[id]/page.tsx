import { eq } from 'drizzle-orm'
import { notFound } from 'next/navigation'
import PagedResume from '@/components/resume/PagedResume'
import { geometry } from '@/components/resume/blocks'
import { db } from '@/lib/db'
import { resume } from '@/lib/db/schema'
import { verifyPrintToken } from '@/lib/print-token'
import { normalizeResume } from '@/store/initial-state'

export const dynamic = 'force-dynamic'
export const metadata = { robots: { index: false } }

// Bare page the PDF renderer opens. Access is by signed token only (see lib/print-token).
export default async function PrintPage({
  params,
  searchParams,
}: {
  params: Promise<{ id: string }>
  searchParams: Promise<{ token?: string }>
}) {
  const { id } = await params
  const { token } = await searchParams
  if (!verifyPrintToken(id, token)) notFound()
  const [row] = await db.select().from(resume).where(eq(resume.id, id))
  if (!row) notFound()

  const data = normalizeResume(row.data)
  const { pageW, pageH } = geometry(data.design)
  return (
    <>
      <style>{`@page { size: ${pageW}px ${pageH}px; margin: 0 } html, body { margin: 0; background: #fff }`}</style>
      <PagedResume data={data} />
    </>
  )
}
