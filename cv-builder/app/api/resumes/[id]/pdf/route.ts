import type { Browser } from 'puppeteer-core'
import { getResume } from '@/lib/actions/resumes'
import { createPrintToken } from '@/lib/print-token'
import { getUser } from '@/lib/session'
import { geometry } from '@/components/resume/blocks'
import { normalizeResume } from '@/store/initial-state'

export const dynamic = 'force-dynamic'
export const maxDuration = 60

const FONT_HOSTS = ['fonts.googleapis.com', 'fonts.gstatic.com']

async function launch(): Promise<Browser> {
  if (process.env.VERCEL || process.env.AWS_LAMBDA_FUNCTION_NAME) {
    const [{ default: chromium }, { default: puppeteer }] = await Promise.all([
      import('@sparticuz/chromium'),
      import('puppeteer-core'),
    ])
    return puppeteer.launch({ args: chromium.args, executablePath: await chromium.executablePath(), headless: true })
  }
  // Local / self-hosted: the full puppeteer package brings its own Chrome.
  const { default: puppeteer } = await import('puppeteer')
  return puppeteer.launch({ headless: true, args: ['--no-sandbox'] }) as unknown as Browser
}

export async function GET(req: Request, { params }: { params: Promise<{ id: string }> }) {
  if (!(await getUser())) return new Response('Unauthorized', { status: 401 })
  const { id } = await params
  const row = await getResume(id)
  if (!row) return new Response('Not found', { status: 404 })

  const origin = process.env.BETTER_AUTH_URL ?? new URL(req.url).origin
  const { pageW, pageH } = geometry(normalizeResume(row.data).design)
  let browser: Browser | undefined
  try {
    browser = await launch()
    const page = await browser.newPage()
    // The renderer may only talk to this app and Google Fonts.
    await page.setRequestInterception(true)
    page.on('request', (r) => {
      const url = new URL(r.url())
      const ok = url.protocol === 'data:' || url.origin === origin || FONT_HOSTS.includes(url.hostname)
      void (ok ? r.continue() : r.abort())
    })
    const res = await page.goto(`${origin}/print/${id}?token=${createPrintToken(id)}`, { waitUntil: 'networkidle0', timeout: 30_000 })
    if (!res?.ok()) throw new Error(`print page responded ${res?.status()}`)
    await page.waitForSelector('.rf-page', { timeout: 15_000 })
    // Fonts loaded, then two frames so pagination settles on the final metrics.
    await page.evaluate(async () => {
      await document.fonts.ready
      await new Promise((r) => requestAnimationFrame(() => requestAnimationFrame(r)))
    })
    const pdf = await page.pdf({ width: `${pageW}px`, height: `${pageH}px`, printBackground: true, preferCSSPageSize: true })

    const filename = row.title.replace(/[^\w\- ]+/g, '').trim().replace(/\s+/g, '_') || 'resume'
    return new Response(Buffer.from(pdf), {
      headers: {
        'Content-Type': 'application/pdf',
        'Content-Disposition': `${new URL(req.url).searchParams.has('inline') ? 'inline' : 'attachment'}; filename="${filename}.pdf"`,
        'Cache-Control': 'private, no-store',
      },
    })
  } catch (err) {
    console.error('PDF generation failed', err)
    return new Response('Could not generate the PDF. Please try again.', { status: 500 })
  } finally {
    await browser?.close()
  }
}
