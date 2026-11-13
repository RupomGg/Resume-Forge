import AuthForm from '@/components/app/AuthForm'
import { googleEnabled } from '@/lib/auth'

export const metadata = { title: 'Create account — ResumeForge' }

export default function SignupPage() {
  return <AuthForm mode="signup" googleEnabled={googleEnabled} />
}
