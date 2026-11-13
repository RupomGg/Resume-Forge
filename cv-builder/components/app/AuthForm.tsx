'use client'

import { useState } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { authClient } from '@/lib/auth-client'

const field = 'w-full px-3.5 py-2.5 rounded-lg border border-outline-variant bg-white text-[14px] text-on-surface outline-none focus:border-primary focus:ring-2 focus:ring-primary/15'

export default function AuthForm({ mode, googleEnabled }: { mode: 'login' | 'signup'; googleEnabled: boolean }) {
  const router = useRouter()
  const [error, setError] = useState<string | null>(null)
  const [pending, setPending] = useState(false)
  const signup = mode === 'signup'

  const onSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    const form = new FormData(e.currentTarget)
    const email = String(form.get('email'))
    const password = String(form.get('password'))
    setPending(true)
    setError(null)
    const { error } = signup
      ? await authClient.signUp.email({ email, password, name: String(form.get('name')).trim() })
      : await authClient.signIn.email({ email, password })
    if (error) {
      setPending(false)
      return setError(error.message ?? 'Something went wrong. Please try again.')
    }
    router.push('/app/resumes')
    router.refresh()
  }

  return (
    <div className="w-full max-w-sm">
      <h1 className="font-manrope text-2xl font-bold text-on-surface">{signup ? 'Create your account' : 'Welcome back'}</h1>
      <p className="mt-1.5 text-[14px] text-outline">
        {signup ? 'Free forever: 3 resumes, 15 tracked applications, every template and font.' : 'Sign in to continue to your resumes.'}
      </p>

      <form onSubmit={onSubmit} className="mt-7 flex flex-col gap-4">
        {signup && (
          <label className="flex flex-col gap-1.5 text-[13px] font-semibold text-on-surface-variant">
            Full name
            <input name="name" required maxLength={80} autoComplete="name" className={field} />
          </label>
        )}
        <label className="flex flex-col gap-1.5 text-[13px] font-semibold text-on-surface-variant">
          Email
          <input name="email" type="email" required autoComplete="email" className={field} />
        </label>
        <label className="flex flex-col gap-1.5 text-[13px] font-semibold text-on-surface-variant">
          Password
          <input name="password" type="password" required minLength={8} autoComplete={signup ? 'new-password' : 'current-password'} className={field} />
          {signup && <span className="text-[12px] font-normal text-outline">At least 8 characters.</span>}
        </label>

        {error && <p role="alert" className="text-[13px] text-error bg-error-container/50 rounded-lg px-3 py-2">{error}</p>}

        <button
          disabled={pending}
          className="mt-1 py-2.5 rounded-lg bg-primary text-white font-manrope text-[14px] font-bold hover:bg-primary-container transition-colors disabled:opacity-60"
        >
          {pending ? 'Please wait…' : signup ? 'Create account' : 'Sign in'}
        </button>
      </form>

      {googleEnabled && (
        <button
          onClick={() => authClient.signIn.social({ provider: 'google', callbackURL: '/app/resumes' })}
          className="mt-3 w-full py-2.5 rounded-lg border border-outline-variant bg-white text-[14px] font-semibold text-on-surface hover:bg-surface-container-low"
        >
          Continue with Google
        </button>
      )}

      <p className="mt-6 text-[13px] text-outline">
        {signup ? 'Already have an account? ' : 'New to ResumeForge? '}
        <Link href={signup ? '/login' : '/signup'} className="font-semibold text-primary hover:underline">
          {signup ? 'Sign in' : 'Create an account'}
        </Link>
      </p>
    </div>
  )
}
