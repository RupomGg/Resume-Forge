import JobBoard from '@/components/app/JobBoard'
import { listApplications } from '@/lib/actions/applications'
import { listResumes } from '@/lib/actions/resumes'
import { limitsFor } from '@/lib/plans'
import { requireUser } from '@/lib/session'

export const metadata = { title: 'Job tracker — ResumeForge' }

export default async function JobsPage() {
  const user = await requireUser()
  const [applications, resumes] = await Promise.all([listApplications(), listResumes()])
  const { applications: limit } = limitsFor(user.plan)
  return (
    <JobBoard
      applications={applications.map(({ id, company, position, status, location, url, salary, notes, appliedAt, resumeId }) =>
        ({ id, company, position, status, location, url, salary, notes, appliedAt, resumeId }))}
      resumes={resumes.map((r) => ({ id: r.id, title: r.title }))}
      limit={Number.isFinite(limit) ? limit : null}
    />
  )
}
