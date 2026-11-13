import Link from 'next/link'
import AppNav from '@/components/app/AppNav'
import { requireUser } from '@/lib/session'

export default async function DashboardLayout({ children }: { children: React.ReactNode }) {
  const user = await requireUser()
  return (
    <div className="min-h-screen flex flex-col md:flex-row bg-surface">
      <aside className="md:w-60 md:min-h-screen flex-shrink-0 bg-white border-b md:border-b-0 md:border-r border-outline-variant/40 flex md:flex-col items-center md:items-stretch gap-2 px-4 py-3 md:py-6">
        <Link href="/app/resumes" className="font-manrope text-lg font-black tracking-tight text-primary md:px-3 md:mb-6">ResumeForge</Link>
        <AppNav name={user.name} email={user.email} plan={user.plan === 'pro' ? 'pro' : 'free'} />
      </aside>
      <main className="flex-1 min-w-0 px-5 md:px-10 py-8">{children}</main>
    </div>
  )
}
