// Plan limits. Fonts and templates are never gated — only counts are.

export type Plan = 'free' | 'pro'

export const PLAN_LIMITS: Record<Plan, { resumes: number; applications: number }> = {
  free: { resumes: 3, applications: 15 },
  pro: { resumes: Infinity, applications: Infinity },
}

export const limitsFor = (plan: string | null | undefined) => PLAN_LIMITS[plan === 'pro' ? 'pro' : 'free']
