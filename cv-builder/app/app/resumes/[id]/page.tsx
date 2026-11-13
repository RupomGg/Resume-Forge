import { notFound } from 'next/navigation'
import EditorShell from '@/components/features/editor/EditorShell'
import { getResume } from '@/lib/actions/resumes'

export const metadata = { title: 'Editor — ResumeForge' }

export default async function EditorPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params
  const resume = await getResume(id)
  if (!resume) notFound()
  // key: a different resume gets a fresh editor (and a fresh store hydration)
  return <EditorShell key={resume.id} resumeId={resume.id} title={resume.title} data={resume.data} />
}
