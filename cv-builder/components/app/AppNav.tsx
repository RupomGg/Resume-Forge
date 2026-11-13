'use client'

import Link from 'next/link'
import { usePathname, useRouter } from 'next/navigation'
import { Briefcase, FileText, LogOut } from 'lucide-react'
import { authClient } from '@/lib/auth-client'
import { cn } from '@/lib/utils'

const LINKS = [
  { href: '/app/resumes', label: 'Resumes', icon: FileText },
  { href: '/app/jobs', label: 'Job Tracker', icon: Briefcase },
]

export default function AppNav({ name, email, plan }: { name: string; email: string; plan: 'free' | 'pro' }) {
  const pathname = usePathname()
  const router = useRouter()
  const signOut = async () => {
    await authClient.signOut()
    router.push('/')
    router.refresh()
  }

  return (
    <>
      <nav className="flex md:flex-col gap-1 flex-1 justify-end md:justify-start">
        {LINKS.map(({ href, label, icon: Icon }) => (
          <Link
            key={href}
            href={href}
            aria-current={pathname.startsWith(href) ? 'page' : undefined}
            className={cn(
              'flex items-center gap-2.5 px-3 py-2 rounded-lg text-[14px] font-semibold transition-colors',
              pathname.startsWith(href) ? 'bg-primary/10 text-primary' : 'text-on-surface-variant hover:bg-surface-container-low',
            )}
          >
            <Icon className="w-4 h-4" />
            <span className="hidden sm:inline">{label}</span>
          </Link>
        ))}
      </nav>

      <div className="md:mt-auto md:pt-4 md:border-t border-outline-variant/40 flex items-center gap-2 md:px-1">
        <div className="hidden md:block min-w-0 flex-1">
          <div className="text-[13px] font-bold text-on-surface truncate">{name}</div>
          <div className="text-[11px] text-outline truncate">{email}</div>
          <span className="inline-block mt-1 px-1.5 py-0.5 rounded bg-secondary-container text-[10px] font-bold uppercase tracking-wider text-on-secondary-container">{plan} plan</span>
        </div>
        <button onClick={signOut} title="Sign out" aria-label="Sign out" className="p-2 rounded-lg text-outline hover:text-error hover:bg-error-container/40">
          <LogOut className="w-4 h-4" />
        </button>
      </div>
    </>
  )
}
