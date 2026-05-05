'use client'

import Link from 'next/link'
import { ArrowRight, Sparkles } from 'lucide-react'

export default function Hero() {
  return (
    <section className="relative min-h-screen flex flex-col overflow-hidden bg-[#0D1117]">
      {/* ── Animated background ─────────────────────────────────────────── */}
      <div className="absolute inset-0 pointer-events-none" aria-hidden="true">
        {/* Radial gradient glow top-left */}
        <div
          className="absolute -top-40 -left-40 w-[600px] h-[600px] rounded-full opacity-20"
          style={{
            background: 'radial-gradient(circle, #3b82f6 0%, transparent 70%)',
          }}
        />
        {/* Radial gradient glow bottom-right */}
        <div
          className="absolute -bottom-40 -right-20 w-[500px] h-[500px] rounded-full opacity-15"
          style={{
            background: 'radial-gradient(circle, #8b5cf6 0%, transparent 70%)',
          }}
        />
        {/* Subtle grid pattern */}
        <div
          className="absolute inset-0 opacity-[0.03]"
          style={{
            backgroundImage: `
              linear-gradient(rgba(255,255,255,0.5) 1px, transparent 1px),
              linear-gradient(90deg, rgba(255,255,255,0.5) 1px, transparent 1px)
            `,
            backgroundSize: '60px 60px',
          }}
        />
      </div>

      {/* ── Navigation ──────────────────────────────────────────────────── */}
      <nav className="relative z-10 flex items-center justify-between px-6 md:px-12 py-6">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-blue-500 to-violet-600 flex items-center justify-center">
            <Sparkles className="w-4 h-4 text-white" />
          </div>
          <span
            className="text-white text-xl font-semibold tracking-tight"
            style={{ fontFamily: 'var(--font-display)' }}
          >
            ResumeForge
          </span>
        </div>

        <div className="flex items-center gap-3">
          <Link
            href="/editor"
            className="hidden md:inline-flex items-center gap-1.5 text-sm text-gray-400 hover:text-white transition-colors duration-200"
          >
            Open Editor
          </Link>
          <Link
            href="/editor"
            id="hero-nav-cta"
            className="inline-flex items-center gap-1.5 px-4 py-2 rounded-lg bg-white text-gray-900 text-sm font-semibold hover:bg-gray-100 transition-all duration-200 shadow-sm"
          >
            Start Building
            <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>
      </nav>

      {/* ── Hero content ────────────────────────────────────────────────── */}
      <div className="relative z-10 flex-1 flex flex-col items-center justify-center text-center px-6 md:px-12 py-16 md:py-24">
        {/* Badge */}
        <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full border border-white/10 bg-white/5 text-xs text-gray-400 mb-8 backdrop-blur-sm">
          <span className="w-1.5 h-1.5 rounded-full bg-green-400 animate-pulse" />
          Free forever · No account needed · No watermarks
        </div>

        {/* Headline */}
        <h1
          className="text-5xl md:text-7xl lg:text-8xl font-bold text-white leading-[1.05] tracking-tight mb-6 max-w-5xl"
          style={{ fontFamily: 'var(--font-display)' }}
        >
          Build a resume that
          <br />
          <span
            className="bg-clip-text text-transparent"
            style={{
              backgroundImage: 'linear-gradient(135deg, #60a5fa 0%, #a78bfa 50%, #f472b6 100%)',
            }}
          >
            gets you hired.
          </span>
        </h1>

        {/* Subheadline */}
        <p
          className="text-lg md:text-xl text-gray-400 max-w-2xl mb-10 leading-relaxed"
          style={{ fontFamily: 'var(--font-body)' }}
        >
          Create a polished, ATS-friendly CV in minutes with real-time preview,
          5 beautiful templates, and one-click PDF export.
        </p>

        {/* CTA Buttons */}
        <div className="flex flex-col sm:flex-row items-center gap-4 mb-12">
          <Link
            href="/editor"
            id="hero-primary-cta"
            className="group inline-flex items-center gap-2 px-7 py-3.5 rounded-xl font-semibold text-base text-white transition-all duration-300 shadow-xl shadow-blue-500/25 hover:shadow-blue-500/40 hover:scale-[1.02]"
            style={{
              background: 'linear-gradient(135deg, #3b82f6 0%, #8b5cf6 100%)',
            }}
          >
            Start Building Free
            <ArrowRight className="w-4 h-4 transition-transform duration-200 group-hover:translate-x-0.5" />
          </Link>
          <Link
            href="#templates"
            id="hero-templates-link"
            className="inline-flex items-center gap-2 px-7 py-3.5 rounded-xl font-medium text-base text-gray-300 border border-white/10 bg-white/5 hover:bg-white/10 hover:text-white transition-all duration-200 backdrop-blur-sm"
          >
            View Templates
          </Link>
        </div>

        {/* Stats strip */}
        <div className="flex flex-wrap items-center justify-center gap-8 md:gap-12 text-center">
          {[
            { value: '5', label: 'Templates' },
            { value: '30+', label: 'Color Themes' },
            { value: '12', label: 'Font Options' },
            { value: '100%', label: 'Free' },
          ].map((stat) => (
            <div key={stat.label} className="flex flex-col items-center">
              <span
                className="text-2xl md:text-3xl font-bold text-white"
                style={{ fontFamily: 'var(--font-display)' }}
              >
                {stat.value}
              </span>
              <span className="text-xs text-gray-500 mt-0.5 uppercase tracking-widest">
                {stat.label}
              </span>
            </div>
          ))}
        </div>
      </div>

      {/* ── Bottom fade to white ─────────────────────────────────────────── */}
      <div
        className="absolute bottom-0 left-0 right-0 h-32 pointer-events-none"
        style={{
          background: 'linear-gradient(to bottom, transparent, #f9fafb)',
        }}
      />
    </section>
  )
}
