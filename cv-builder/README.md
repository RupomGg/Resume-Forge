# ResumeForge — Premium CV Builder (MVP)

ResumeForge is a high-performance, client-side CV builder designed to help users create professional, recruiter-ready resumes in minutes. Built with a focus on real-time feedback and high-fidelity typography.

![ResumeForge Preview](https://images.unsplash.com/photo-1586281380349-632531db7ed4?auto=format&fit=crop&q=80&w=1200)

## 🚀 Key Features

- **Live Visual Editor**: Side-by-side editing experience with instant real-time updates.
- **Rich Text Support**: Full formatting support for summaries and experience descriptions using Tiptap.
- **Dynamic Themes**: Choose from 5+ professional templates (Classic, Modern, Minimal, Bold, etc.) and curated color palettes.
- **Precision Typography**: Optimized line heights and font pairings for maximum readability.
- **High-Fidelity PDF Export**: Pixel-perfect PDF generation using a headless browser pipeline (Puppeteer).
- **Responsive Design**: Mobile-optimized editor for building resumes on any device.
- **Zero-Backend Persistence**: Works entirely on the client-side using Zustand for state management.

## 🛠️ Technology Stack

- **Frontend**: Next.js 15 (App Router), React 19
- **Styling**: Tailwind CSS v4
- **State Management**: Zustand with Immer middleware
- **Editor**: Tiptap Rich Text Editor
- **PDF Engine**: Puppeteer (Headless Chrome)
- **Icons**: Lucide React

## 🏁 Getting Started

### Prerequisites

- Node.js 20+ 
- npm or yarn

### Installation

1. Clone the repository:
   ```bash
   git clone <repository-url>
   cd cv-builder
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Run the development server:
   ```bash
   npm run dev
   ```

4. Open [http://localhost:3000/editor](http://localhost:3000/editor) in your browser.

## 📁 Project Structure

```text
├── app/                  # Next.js App Router (Pages & API)
│   ├── api/pdf/          # High-fidelity PDF generation route
│   └── editor/           # Main CV builder workspace
├── components/           # UI Components
│   ├── editor/           # Core editor panels (Left, Right, Design)
│   │   ├── forms/        # Section-specific editor forms
│   │   └── TemplateRenderer.tsx  # The A4 rendering engine
│   └── ui/               # Shared UI primitives
├── lib/                  # Utilities & State
│   ├── store.ts          # Global Zustand state
│   ├── themes.ts         # Color theme definitions
│   └── fonts.ts          # Curated font pairings
└── public/               # Static assets
```

## 📝 Roadmap (MVP Phase)

- [x] Core state management & CRUD for CV sections
- [x] Live A4 preview engine
- [x] Rich text editing for descriptions
- [x] Puppeteer-based PDF export
- [x] Initial set of 5 templates
- [ ] LocalStorage persistence
- [ ] Pre-built examples/templates
- [ ] Multi-language support

## ⚖️ License

MIT License. Created by [Radwan Ahamed](https://github.com/radwan-ahamed).
