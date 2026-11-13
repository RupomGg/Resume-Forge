import Link from 'next/link'
import { redirect } from 'next/navigation'
import { getUser } from '@/lib/session'

export default async function AuthLayout({ children }: { children: React.ReactNode }) {
  if (await getUser()) redirect('/app/resumes')
  return (
    <main className="min-h-screen flex flex-col items-center justify-center gap-8 px-6 py-12 bg-surface">
      <Link href="/" className="font-manrope text-xl font-black tracking-tight text-primary">ResumeForge</Link>
      <div className="w-full max-w-md bg-white rounded-2xl border border-outline-variant/40 shadow-sm p-8 flex justify-center">
        {children}
      </div>
    </main>
  )
}
