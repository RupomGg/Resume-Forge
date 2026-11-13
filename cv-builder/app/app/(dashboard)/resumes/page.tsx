import ResumeGrid from '@/components/app/ResumeGrid'
import { listResumes } from '@/lib/actions/resumes'
import { limitsFor } from '@/lib/plans'
import { requireUser } from '@/lib/session'

export const metadata = { title: 'My resumes — ResumeForge' }

export default async function ResumesPage() {
  const user = await requireUser()
  const resumes = await listResumes()
  const { resumes: limit } = limitsFor(user.plan)
  return (
    <ResumeGrid
      resumes={resumes.map((r) => ({ id: r.id, title: r.title, data: r.data, updatedAt: r.updatedAt.toISOString() }))}
      limit={Number.isFinite(limit) ? limit : null}
    />
  )
}
