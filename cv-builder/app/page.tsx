import type { Metadata } from 'next'
import Hero from '@/components/features/landing/Hero'
import FeatureList from '@/components/features/landing/FeatureList'
import TemplateGallery from '@/components/features/landing/TemplateGallery'
import Link from 'next/link'
import { Sparkles } from 'lucide-react'

export const metadata: Metadata = {
  title: 'ResumeForge — Free CV Builder | No Account Needed',
  description:
    'Build a professional, ATS-friendly resume in minutes. Choose from 5 beautiful templates, export to PDF, customize fonts and colors — 100% free, no account required.',
  openGraph: {
    title: 'ResumeForge — Free CV Builder',
    description: 'Professional resumes in minutes. Free forever.',
    type: 'website',
  },
}

export default function HomePage() {
  return (
    <main>
      {/* Hero */}
      <Hero />

      {/* Features */}
      <FeatureList />

      {/* Templates */}
      <TemplateGallery />

      {/* Final CTA Banner */}
      <section className="bg-gray-900 py-20 px-6 text-center">
        <div className="max-w-2xl mx-auto">
          <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-white/10 text-xs text-gray-300 mb-6">
            <Sparkles className="w-3.5 h-3.5 text-yellow-400" />
            100% free · No credit card · No signup
          </div>
          <h2
            className="text-4xl md:text-5xl font-bold text-white mb-4 tracking-tight"
            style={{ fontFamily: 'var(--font-display)' }}
          >
            Your next job starts with
            <br />a great resume.
          </h2>
          <p className="text-gray-400 text-lg mb-8" style={{ fontFamily: 'var(--font-body)' }}>
            Join thousands of professionals who built their CV with ResumeForge.
          </p>
          <Link
            href="/editor"
            id="bottom-cta-button"
            className="inline-flex items-center gap-2 px-8 py-4 rounded-xl font-semibold text-base text-white shadow-2xl shadow-blue-500/20 hover:shadow-blue-500/40 hover:scale-[1.02] transition-all duration-300"
            style={{
              background: 'linear-gradient(135deg, #3b82f6 0%, #8b5cf6 100%)',
            }}
          >
            Build Your Resume Free
          </Link>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-950 border-t border-white/5 py-10 px-6">
        <div className="max-w-6xl mx-auto flex flex-col md:flex-row items-center justify-between gap-4">
          {/* Logo */}
          <div className="flex items-center gap-2">
            <div className="w-6 h-6 rounded-md bg-gradient-to-br from-blue-500 to-violet-600 flex items-center justify-center">
              <Sparkles className="w-3 h-3 text-white" />
            </div>
            <span className="text-sm font-semibold text-white tracking-tight">
              ResumeForge
            </span>
          </div>

          {/* Links */}
          <nav className="flex items-center gap-6 text-xs text-gray-500">
            <Link href="/editor" className="hover:text-gray-300 transition-colors">
              Editor
            </Link>
            <span>·</span>
            <Link href="#features" className="hover:text-gray-300 transition-colors">
              Features
            </Link>
            <span>·</span>
            <Link href="#templates" className="hover:text-gray-300 transition-colors">
              Templates
            </Link>
          </nav>

          {/* Copyright */}
          <p className="text-xs text-gray-600">
            © 2025 ResumeForge · Free CV Builder
          </p>
        </div>
      </footer>
    </main>
  )
}
