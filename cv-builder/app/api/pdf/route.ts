import { NextRequest, NextResponse } from 'next/server'
import puppeteer from 'puppeteer'

// Increase body limit for large HTML/Style payloads
export const config = {
  api: {
    bodyParser: {
      sizeLimit: '10mb',
    },
  },
}

export const dynamic = 'force-dynamic'
export const maxDuration = 60 // 60 seconds

export async function POST(req: NextRequest) {
  try {
    const body = await req.json()
    const { html, design } = body

    if (!html) {
      console.error('PDF API Error: No HTML content provided')
      return NextResponse.json({ error: 'No HTML content provided' }, { status: 400 })
    }

    console.log('PDF API: Starting Puppeteer generation... Payload size:', html.length)

    const browser = await puppeteer.launch({
      headless: true,
      args: [
        '--no-sandbox', 
        '--disable-setuid-sandbox',
        '--disable-dev-shm-usage',
        '--font-render-hinting=none',
      ],
    })

    const page = await browser.newPage()
    
    // Set viewport
    await page.setViewport({ width: 794, height: 1123, deviceScaleFactor: 2 })

    // Set content
    await page.setContent(html, { 
      waitUntil: 'networkidle0',
      timeout: 30000 
    })

    // Give Tailwind CDN a moment to process the classes
    await new Promise(r => setTimeout(r, 800))

    // Generate PDF
    const pdf = await page.pdf({
      format: (design?.pageSize as any) || 'A4',
      printBackground: true,
      preferCSSPageSize: true,
      margin: {
        top: 0,
        right: 0,
        bottom: 0,
        left: 0,
      },
    })

    await browser.close()
    console.log('PDF API: Generation successful, PDF size:', pdf.length)

    return new Response(pdf, {
      headers: {
        'Content-Type': 'application/pdf',
        'Content-Disposition': `attachment; filename="resume.pdf"`,
      },
    })
  } catch (error: any) {
    console.error('PDF Generation Error:', error)
    return NextResponse.json({ 
      error: 'Failed to generate PDF', 
      details: error.message 
    }, { status: 500 })
  }
}
