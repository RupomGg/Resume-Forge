'use client'

import { useEditor, EditorContent } from '@tiptap/react'
import StarterKit from '@tiptap/starter-kit'
import Placeholder from '@tiptap/extension-placeholder'
import TextAlign from '@tiptap/extension-text-align'
import Underline from '@tiptap/extension-underline'
import { Bold, Italic, List, ListOrdered, AlignLeft, AlignJustify, Underline as UnderlineIcon } from 'lucide-react'
import { cn } from '@/lib/utils'
import { useEffect } from 'react'

interface RichTextEditorProps {
  content: string
  onChange: (content: string) => void
  placeholder?: string
  className?: string
}

export default function RichTextEditor({
  content,
  onChange,
  placeholder = 'Start writing...',
  className,
}: RichTextEditorProps) {
  const editor = useEditor({
    extensions: [
      StarterKit,
      Placeholder.configure({
        placeholder,
      }),
      TextAlign.configure({
        types: ['heading', 'paragraph'],
        alignments: ['left', 'center', 'right', 'justify'],
      }),
      Underline,
    ],
    immediatelyRender: false,
    content,
    onUpdate: ({ editor }) => {
      onChange(editor.getHTML())
    },
    editorProps: {
      attributes: {
        class: 'prose prose-sm max-w-none focus:outline-none min-h-[120px] px-4 py-3 font-work-sans text-on-surface text-sm [&_p]:my-0',
      },
    },
  })

  // Sync external content changes
  useEffect(() => {
    if (editor && content !== editor.getHTML()) {
      editor.commands.setContent(content)
    }
  }, [content, editor])

  if (!editor) return null

  return (
    <div className={cn('border-[1.5px] border-secondary-fixed-dim rounded-md overflow-hidden bg-surface-container-lowest focus-within:border-primary focus-within:ring-[3px] focus-within:ring-primary/10 transition-all duration-200', className)}>
      {/* Toolbar */}
      <div className="flex items-center gap-1 p-1.5 border-b border-outline-variant bg-surface-container-low">
        <button
          type="button"
          onClick={() => editor.chain().focus().toggleBold().run()}
          className={cn(
            'p-1.5 rounded transition-all hover:bg-surface-container-high',
            editor.isActive('bold') ? 'bg-primary-container text-surface' : 'text-on-surface-variant'
          )}
          title="Bold"
        >
          <Bold className="w-3.5 h-3.5" />
        </button>
        <button
          type="button"
          onClick={() => editor.chain().focus().toggleItalic().run()}
          className={cn(
            'p-1.5 rounded transition-all hover:bg-surface-container-high',
            editor.isActive('italic') ? 'bg-primary-container text-surface' : 'text-on-surface-variant'
          )}
          title="Italic"
        >
          <Italic className="w-3.5 h-3.5" />
        </button>
        <div className="w-px h-4 bg-outline-variant mx-1" />
        <button
          type="button"
          onClick={() => editor.chain().focus().toggleBulletList().run()}
          className={cn(
            'p-1.5 rounded transition-all hover:bg-surface-container-high',
            editor.isActive('bulletList') ? 'bg-primary-container text-surface' : 'text-on-surface-variant'
          )}
          title="Bullet List"
        >
          <List className="w-3.5 h-3.5" />
        </button>
        <button
          type="button"
          onClick={() => editor.chain().focus().toggleOrderedList().run()}
          className={cn(
            'p-1.5 rounded transition-all hover:bg-surface-container-high',
            editor.isActive('orderedList') ? 'bg-primary-container text-surface' : 'text-on-surface-variant'
          )}
          title="Numbered List"
        >
          <ListOrdered className="w-3.5 h-3.5" />
        </button>
        <div className="w-px h-4 bg-outline-variant mx-1" />
        <button
          type="button"
          onClick={() => editor.chain().focus().setTextAlign('left').run()}
          className={cn(
            'p-1.5 rounded transition-all hover:bg-surface-container-high',
            editor.isActive({ textAlign: 'left' }) ? 'bg-primary-container text-surface' : 'text-on-surface-variant'
          )}
          title="Align Left"
        >
          <AlignLeft className="w-3.5 h-3.5" />
        </button>
        <button
          type="button"
          onClick={() => editor.chain().focus().setTextAlign('justify').run()}
          className={cn(
            'p-1.5 rounded transition-all hover:bg-surface-container-high',
            editor.isActive({ textAlign: 'justify' }) ? 'bg-primary-container text-surface' : 'text-on-surface-variant'
          )}
          title="Justify"
        >
          <AlignJustify className="w-3.5 h-3.5" />
        </button>
        <div className="w-px h-4 bg-outline-variant mx-1" />
        <button
          type="button"
          onClick={() => editor.chain().focus().toggleUnderline().run()}
          className={cn(
            'p-1.5 rounded transition-all hover:bg-surface-container-high',
            editor.isActive('underline') ? 'bg-primary-container text-surface' : 'text-on-surface-variant'
          )}
          title="Underline"
        >
          <UnderlineIcon className="w-3.5 h-3.5" />
        </button>
      </div>

      {/* Content Area */}
      <EditorContent 
        editor={editor} 
        className="cv-rich-text"
      />
    </div>
  )
}
