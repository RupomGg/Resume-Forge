import 'server-only'
import { cache } from 'react'
import { headers } from 'next/headers'
import { redirect } from 'next/navigation'
import { auth } from './auth'

export const getUser = cache(async () => {
  const session = await auth.api.getSession({ headers: await headers() })
  return session?.user ?? null
})

/** For pages and server actions: the signed-in user, or a redirect to /login. */
export async function requireUser() {
  const user = await getUser()
  if (!user) redirect('/login')
  return user
}
