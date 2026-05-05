// services/api/pdf.service.ts — PDF Generation Service

import { CVData } from '@/models/cv.types'

/**
 * Sends CV data to the server to generate and download a PDF.
 */
export async function downloadPdf(cvData: CVData) {
  const element = document.getElementById('cv-preview-card')
  if (!element) {
    console.error('CV Preview element not found')
    return
  }

  try {
    // Get all style tags and link tags to preserve custom styles
    const styles = Array.from(document.querySelectorAll('style, link[rel="stylesheet"]'))
      .map(s => s.outerHTML)
      .join('\n')

    const htmlContent = `
      <!DOCTYPE html>
      <html>
        <head>
          <meta charset="utf-8">
          <meta name="viewport" content="width=device-width, initial-scale=1">
          <script src="https://cdn.tailwindcss.com"></script>
          <style>
            @page { margin: 0; }
            body { 
              margin: 0; 
              padding: 0; 
              background: white; 
              -webkit-print-color-adjust: exact;
              print-color-adjust: exact;
            }
            #pdf-export-container {
              width: 210mm;
              min-height: 297mm;
              margin: 0 auto;
            }
          </style>
          ${styles}
        </head>
        <body>
          <div id="pdf-export-container">
            ${element.outerHTML}
          </div>
        </body>
      </html>
    `

    const response = await fetch('/api/pdf', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ 
        html: htmlContent,
        design: cvData.design 
      }),
    })

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}))
      throw new Error(errorData.details || 'Failed to generate PDF')
    }

    const buffer = await response.arrayBuffer()
    const blob = new Blob([buffer], { type: 'application/pdf' })
    const url = window.URL.createObjectURL(blob)
    
    const fileName = `${(cvData.personal.fullName || 'Resume').replace(/\s+/g, '_')}.pdf`
    
    const link = document.createElement('a')
    link.href = url
    link.setAttribute('download', fileName)
    document.body.appendChild(link)
    link.click()
    
    // Cleanup
    setTimeout(() => {
      document.body.removeChild(link)
      window.URL.revokeObjectURL(url)
    }, 100)
  } catch (error: any) {
    console.error('Download Error:', error)
    alert(`PDF Export failed: ${error.message}\n\nFallback: Try using your browser's Print (Ctrl+P) and select "Save as PDF".`)
  }
}
