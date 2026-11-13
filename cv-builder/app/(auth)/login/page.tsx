import AuthForm from '@/components/app/AuthForm'
import { googleEnabled } from '@/lib/auth'

export const metadata = { title: 'Sign in — ResumeForge' }

export default function LoginPage() {
  return <AuthForm mode="login" googleEnabled={googleEnabled} />
}
