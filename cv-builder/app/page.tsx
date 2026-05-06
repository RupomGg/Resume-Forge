import type { Metadata } from 'next'
import Link from 'next/link'

export const metadata: Metadata = {
  title: 'ResumeForge — Build a resume that gets you hired',
  description:
    'Create professional, ATS-friendly resumes in minutes. Our AI-driven templates ensure your skills stand out, helping you land your dream job faster.',
}

export default function HomePage() {
  return (
    <div className="bg-background text-on-background font-work-sans antialiased min-h-screen flex flex-col selection:bg-primary selection:text-on-primary">
      {/* TopNavBar */}
      <header className="fixed top-0 w-full z-50 bg-surface border-b border-surface-container-highest transition-all duration-300">
        <div className="flex justify-between items-center w-full px-lg py-md max-w-7xl mx-auto">
          {/* Brand */}
          <Link 
            className="font-h3 text-h3 font-bold text-primary active:scale-95 transition-transform duration-150 flex items-center gap-2" 
            href="/"
          >
            <span className="material-symbols-outlined" style={{ fontVariationSettings: "'FILL' 1" }}>description</span>
            ResumeForge
          </Link>

          {/* Nav Links (Desktop) */}
          <nav className="hidden md:flex items-center gap-lg">
            <a className="font-body-md text-body-md text-on-surface-variant hover:text-secondary transition-colors duration-200" href="#features">Features</a>
            <a className="font-body-md text-body-md text-on-surface-variant hover:text-secondary transition-colors duration-200" href="#templates">Templates</a>
            <a className="font-body-md text-body-md text-on-surface-variant hover:text-secondary transition-colors duration-200" href="#pricing">Pricing</a>
            <a className="font-body-md text-body-md text-on-surface-variant hover:text-secondary transition-colors duration-200" href="#reviews">Reviews</a>
          </nav>

          {/* Actions */}
          <div className="flex items-center gap-md">
            <Link className="hidden md:inline-flex font-label-sm text-label-sm text-primary hover:text-secondary transition-colors active:scale-95" href="/login">Login</Link>
            <Link className="inline-flex items-center justify-center bg-primary-container text-on-primary-container font-label-sm text-label-sm px-6 py-2 rounded-full hover:bg-inverse-primary transition-colors active:scale-95" href="/editor">Sign Up</Link>
          </div>
        </div>
      </header>

      <main className="flex-grow pt-[80px]">
        {/* Hero Section */}
        <section className="relative min-h-[921px] flex items-center justify-center px-lg py-xl overflow-hidden">
          {/* Background Decoration */}
          <div className="absolute inset-0 z-0 opacity-20 pointer-events-none">
            <div className="absolute top-1/4 left-1/4 w-[500px] h-[500px] bg-primary rounded-full blur-[120px] mix-blend-screen"></div>
            <div className="absolute bottom-1/4 right-1/4 w-[400px] h-[400px] bg-secondary-container rounded-full blur-[100px] mix-blend-screen"></div>
          </div>
          <div className="relative z-10 max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-xl items-center">
            <div className="flex flex-col items-start gap-lg max-w-2xl">
              <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-surface-container border border-surface-container-highest">
                <span className="material-symbols-outlined text-secondary text-[16px]" style={{ fontVariationSettings: "'FILL' 1" }}>auto_awesome</span>
                <span className="font-label-sm text-label-sm text-on-surface-variant">AI-Powered Resume Builder</span>
              </div>
              <h1 className="font-h1 text-h1 text-on-surface">Build a resume that gets you hired.</h1>
              <p className="font-body-lg text-body-lg text-on-surface-variant">
                Create professional, ATS-friendly resumes in minutes. Our AI-driven templates ensure your skills stand out, helping you land your dream job faster.
              </p>
              <div className="flex flex-col sm:flex-row gap-md mt-sm w-full sm:w-auto">
                <Link className="inline-flex items-center justify-center bg-primary-container text-on-primary-container font-label-sm text-label-sm px-8 py-4 rounded-full hover:bg-inverse-primary transition-colors active:scale-95 shadow-[0_0_40px_rgba(45,90,39,0.3)]" href="/editor">Start Building Free</Link>
                <a className="inline-flex items-center justify-center border border-outline-variant text-on-surface font-label-sm text-label-sm px-8 py-4 rounded-full hover:bg-surface-container transition-colors active:scale-95" href="#templates">View Templates</a>
              </div>
              <div className="flex items-center gap-4 mt-md text-on-surface-variant font-caption text-caption">
                <div className="flex -space-x-2">
                  <div className="w-8 h-8 rounded-full bg-surface-container-high border-2 border-background flex items-center justify-center"><span className="material-symbols-outlined text-[16px]">person</span></div>
                  <div className="w-8 h-8 rounded-full bg-surface-container-highest border-2 border-background flex items-center justify-center"><span className="material-symbols-outlined text-[16px]">person</span></div>
                  <div className="w-8 h-8 rounded-full bg-surface-variant border-2 border-background flex items-center justify-center"><span className="material-symbols-outlined text-[16px]">person</span></div>
                </div>
                <span>Join 50,000+ professionals hired last month</span>
              </div>
            </div>
            <div className="relative w-full aspect-[4/3] lg:aspect-[3/4] rounded-2xl overflow-hidden glass-panel flex items-center justify-center shadow-2xl">
              <img 
                alt="A mock resume displayed on a digital screen" 
                className="object-cover w-full h-full opacity-80 hover:opacity-100 transition-opacity duration-500" 
                src="/images/hero_section.jpg" 
              />
              <div className="absolute inset-0 bg-gradient-to-t from-background to-transparent opacity-50"></div>
            </div>
          </div>
        </section>

        {/* Features Grid */}
        <section className="py-xl px-lg bg-surface-container-lowest" id="features">
          <div className="max-w-7xl mx-auto">
            <div className="text-center mb-xl max-w-2xl mx-auto">
              <h2 className="font-h2 text-h2 text-on-surface mb-sm">Everything you need to succeed</h2>
              <p className="font-body-md text-body-md text-on-surface-variant">Streamlined tools designed to bypass ATS filters and catch recruiters' attention.</p>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-md">
              {/* Feature Card 1 */}
              <div className="bg-surface-container-low border border-surface-container-highest rounded-xl p-lg hover:border-primary transition-colors duration-300 group">
                <div className="w-12 h-12 rounded-lg bg-surface-container-high flex items-center justify-center mb-lg group-hover:bg-primary-container transition-colors">
                  <span className="material-symbols-outlined text-secondary text-[24px]">visibility</span>
                </div>
                <h3 className="font-h3 text-[20px] text-on-surface mb-xs">Real-time Preview</h3>
                <p className="font-body-md text-[14px] text-on-surface-variant">See your changes instantly as you type. No more guessing how your final resume will look.</p>
              </div>
              {/* Feature Card 2 */}
              <div className="bg-surface-container-low border border-surface-container-highest rounded-xl p-lg hover:border-primary transition-colors duration-300 group">
                <div className="w-12 h-12 rounded-lg bg-surface-container-high flex items-center justify-center mb-lg group-hover:bg-primary-container transition-colors">
                  <span className="material-symbols-outlined text-secondary text-[24px]">picture_as_pdf</span>
                </div>
                <h3 className="font-h3 text-[20px] text-on-surface mb-xs">One-click PDF Export</h3>
                <p className="font-body-md text-[14px] text-on-surface-variant">Download a pixel-perfect PDF instantly, ready to be attached to your next job application.</p>
              </div>
              {/* Feature Card 3 */}
              <div className="bg-surface-container-low border border-surface-container-highest rounded-xl p-lg hover:border-primary transition-colors duration-300 group">
                <div className="w-12 h-12 rounded-lg bg-surface-container-high flex items-center justify-center mb-lg group-hover:bg-primary-container transition-colors">
                  <span className="material-symbols-outlined text-secondary text-[24px]">fact_check</span>
                </div>
                <h3 className="font-h3 text-[20px] text-on-surface mb-xs">ATS-Friendly Output</h3>
                <p className="font-body-md text-[14px] text-on-surface-variant">Our templates are engineered to pass through Applicant Tracking Systems without errors.</p>
              </div>
              {/* Feature Card 4 */}
              <div className="bg-surface-container-low border border-surface-container-highest rounded-xl p-lg hover:border-primary transition-colors duration-300 group">
                <div className="w-12 h-12 rounded-lg bg-surface-container-high flex items-center justify-center mb-lg group-hover:bg-primary-container transition-colors">
                  <span className="material-symbols-outlined text-secondary text-[24px]">no_accounts</span>
                </div>
                <h3 className="font-h3 text-[20px] text-on-surface mb-xs">No Account Needed</h3>
                <p className="font-body-md text-[14px] text-on-surface-variant">Start building immediately. We respect your time and privacy. Save locally or create an account later.</p>
              </div>
            </div>
          </div>
        </section>

        {/* Template Showcase */}
        <section className="py-xl px-lg" id="templates">
          <div className="max-w-7xl mx-auto">
            <div className="flex flex-col md:flex-row justify-between items-end mb-xl gap-md">
              <div className="max-w-2xl">
                <h2 className="font-h2 text-h2 text-on-surface mb-sm">Choose your perfect layout</h2>
                <p className="font-body-md text-body-md text-on-surface-variant">Professionally designed templates tailored for different industries and career stages.</p>
              </div>
              <a className="inline-flex items-center gap-2 text-primary hover:text-secondary font-label-sm text-label-sm transition-colors" href="#">
                View All Templates <span className="material-symbols-outlined text-[16px]">arrow_forward</span>
              </a>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-lg">
              {/* Template 1 */}
              <div className="group cursor-pointer">
                <div className="aspect-[1/1.4] bg-surface-container rounded-xl border border-surface-container-highest overflow-hidden mb-sm relative flex items-center justify-center">
                  <div className="absolute inset-0 bg-gradient-to-br from-surface-container-low to-surface-container-highest opacity-50"></div>
                  <span className="material-symbols-outlined text-outline text-[48px] z-10 group-hover:scale-110 transition-transform">draft</span>
                  <div className="absolute inset-0 bg-primary/10 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center z-20">
                    <span className="bg-primary-container text-on-primary-container px-4 py-2 rounded-full font-label-sm text-label-sm shadow-lg">Preview</span>
                  </div>
                </div>
                <h4 className="font-label-sm text-label-sm text-on-surface">The Executive</h4>
                <p className="font-caption text-caption text-on-surface-variant">Clean, traditional, robust.</p>
              </div>
              {/* Template 2 */}
              <div className="group cursor-pointer">
                <div className="aspect-[1/1.4] bg-surface-container rounded-xl border border-surface-container-highest overflow-hidden mb-sm relative flex items-center justify-center">
                  <div className="absolute inset-0 bg-gradient-to-br from-surface-container-low to-surface-container-highest opacity-50"></div>
                  <span className="material-symbols-outlined text-outline text-[48px] z-10 group-hover:scale-110 transition-transform">style</span>
                  <div className="absolute inset-0 bg-primary/10 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center z-20">
                    <span className="bg-primary-container text-on-primary-container px-4 py-2 rounded-full font-label-sm text-label-sm shadow-lg">Preview</span>
                  </div>
                </div>
                <h4 className="font-label-sm text-label-sm text-on-surface">The Creative</h4>
                <p className="font-caption text-caption text-on-surface-variant">Modern, two-column, distinct.</p>
              </div>
              {/* Template 3 */}
              <div className="group cursor-pointer">
                <div className="aspect-[1/1.4] bg-surface-container rounded-xl border border-surface-container-highest overflow-hidden mb-sm relative flex items-center justify-center">
                  <div className="absolute inset-0 bg-gradient-to-br from-surface-container-low to-surface-container-highest opacity-50"></div>
                  <span className="material-symbols-outlined text-outline text-[48px] z-10 group-hover:scale-110 transition-transform">description</span>
                  <div className="absolute inset-0 bg-primary/10 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center z-20">
                    <span className="bg-primary-container text-on-primary-container px-4 py-2 rounded-full font-label-sm text-label-sm shadow-lg">Preview</span>
                  </div>
                </div>
                <h4 className="font-label-sm text-label-sm text-on-surface">The Tech</h4>
                <p className="font-caption text-caption text-on-surface-variant">Skill-focused, compact, sleek.</p>
              </div>
            </div>
          </div>
        </section>

        {/* CTA Section */}
        <section className="py-xl px-lg bg-surface-container-highest relative overflow-hidden">
          <div className="absolute inset-0 pointer-events-none">
            <div className="absolute top-0 right-0 w-[600px] h-[600px] bg-primary/5 rounded-full blur-[100px] translate-x-1/2 -translate-y-1/2"></div>
          </div>
          <div className="max-w-4xl mx-auto text-center relative z-10">
            <h2 className="font-h1 text-h1 text-on-surface mb-md">Your next job starts with a great resume.</h2>
            <p className="font-body-lg text-body-lg text-on-surface-variant mb-lg max-w-2xl mx-auto">Join thousands of professionals who have advanced their careers using ResumeForge. Build, download, and apply today.</p>
            <Link className="inline-flex items-center justify-center bg-primary-container text-on-primary-container font-label-sm text-label-sm px-10 py-5 rounded-full hover:bg-inverse-primary transition-colors active:scale-95 shadow-[0_0_40px_rgba(45,90,39,0.2)]" href="/editor">Build Your Resume</Link>
          </div>
        </section>
      </main>

      {/* Footer */}
      <footer className="bg-surface-container-lowest border-t border-outline-variant full-width py-xl">
        <div className="max-w-7xl mx-auto px-lg flex flex-col md:flex-row justify-between items-center gap-md">
          <div className="flex flex-col items-center md:items-start gap-sm">
            <div className="font-h3 text-h3 font-bold text-primary flex items-center gap-2">
              <span className="material-symbols-outlined" style={{ fontVariationSettings: "'FILL' 1" }}>description</span>
              ResumeForge
            </div>
            <p className="font-body-md text-body-md text-on-surface-variant">© 2024 ResumeForge. Built for professionals.</p>
          </div>
          <nav className="flex flex-wrap justify-center gap-md">
            <Link className="font-body-md text-body-md text-on-surface-variant hover:text-primary transition-colors" href="/privacy">Privacy Policy</Link>
            <Link className="font-body-md text-body-md text-on-surface-variant hover:text-primary transition-colors" href="/terms">Terms of Service</Link>
            <Link className="font-body-md text-body-md text-on-surface-variant hover:text-primary transition-colors" href="/help">Help Center</Link>
            <Link className="font-body-md text-body-md text-on-surface-variant hover:text-primary transition-colors" href="/contact">Contact Us</Link>
          </nav>
          <div className="flex items-center gap-sm">
            <a className="w-10 h-10 rounded-full bg-surface-container flex items-center justify-center text-on-surface-variant hover:text-primary hover:bg-surface-container-high transition-colors" href="#">
              <span className="material-symbols-outlined text-[20px]">share</span>
            </a>
            <a className="w-10 h-10 rounded-full bg-surface-container flex items-center justify-center text-on-surface-variant hover:text-primary hover:bg-surface-container-high transition-colors" href="#">
              <span className="material-symbols-outlined text-[20px]">mail</span>
            </a>
          </div>
        </div>
      </footer>
    </div>
  )
}
