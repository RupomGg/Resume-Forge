import 'server-only'
import { createHmac, timingSafeEqual } from 'node:crypto'

// Short-lived signed token that lets the headless browser open /print/[id] without
// the user's session cookie. Signed with the auth secret.
const secret = () => {
  const s = process.env.BETTER_AUTH_SECRET
  if (!s) throw new Error('BETTER_AUTH_SECRET is not set')
  return s
}
const sign = (payload: string) => createHmac('sha256', secret()).update(payload).digest('base64url')

export function createPrintToken(resumeId: string, ttlMs = 60_000) {
  const exp = Date.now() + ttlMs
  return `${exp}.${sign(`${resumeId}.${exp}`)}`
}

export function verifyPrintToken(resumeId: string, token: string | undefined) {
  const [exp, sig] = (token ?? '').split('.')
  if (!exp || !sig || Number(exp) < Date.now()) return false
  const expected = Buffer.from(sign(`${resumeId}.${exp}`))
  const given = Buffer.from(sig)
  return expected.length === given.length && timingSafeEqual(expected, given)
}
