'use client'

import { useEffect, useOptimistic, useRef, useState, useTransition } from 'react'
import { DndContext, PointerSensor, useDraggable, useDroppable, useSensor, useSensors, type DragEndEvent } from '@dnd-kit/core'
import { ExternalLink, MapPin, Plus, Trash2, X } from 'lucide-react'
import { createApplication, deleteApplication, updateApplication, type ApplicationInput } from '@/lib/actions/applications'
import { APPLICATION_STATUSES, type Application, type ApplicationStatus } from '@/lib/db/schema'
import { cn } from '@/lib/utils'

type Item = Omit<Application, 'userId' | 'createdAt' | 'updatedAt'>

const COLUMNS: Record<ApplicationStatus, { label: string; dot: string }> = {
  wishlist: { label: 'Wishlist', dot: 'bg-slate-400' },
  applied: { label: 'Applied', dot: 'bg-blue-500' },
  interview: { label: 'Interview', dot: 'bg-amber-500' },
  offer: { label: 'Offer', dot: 'bg-green-600' },
  rejected: { label: 'Rejected', dot: 'bg-red-500' },
}

const field = 'w-full px-3 py-2 rounded-lg border border-outline-variant bg-white text-[14px] text-on-surface outline-none focus:border-primary focus:ring-2 focus:ring-primary/15'
const label = 'flex flex-col gap-1 text-[12px] font-semibold text-on-surface-variant'

function Card({ item, onOpen }: { item: Item; onOpen: () => void }) {
  const { attributes, listeners, setNodeRef, transform, isDragging } = useDraggable({ id: item.id })
  return (
    <button
      ref={setNodeRef}
      {...listeners}
      {...attributes}
      onClick={onOpen}
      style={transform ? { transform: `translate(${transform.x}px, ${transform.y}px)` } : undefined}
      className={cn(
        'w-full text-left bg-white rounded-xl border border-outline-variant/50 p-3 shadow-sm hover:border-primary/40 cursor-grab touch-none',
        isDragging && 'relative z-10 shadow-xl cursor-grabbing',
      )}
    >
      <div className="text-[14px] font-bold text-on-surface leading-snug">{item.position}</div>
      <div className="text-[13px] text-on-surface-variant">{item.company}</div>
      {(item.location || item.appliedAt) && (
        <div className="mt-2 flex flex-wrap items-center gap-x-3 gap-y-1 text-[11px] text-outline">
          {item.location && <span className="inline-flex items-center gap-1"><MapPin className="w-3 h-3" />{item.location}</span>}
          {item.appliedAt && <span>Applied {item.appliedAt}</span>}
        </div>
      )}
    </button>
  )
}

function Column({ status, items, onOpen }: { status: ApplicationStatus; items: Item[]; onOpen: (i: Item) => void }) {
  const { setNodeRef, isOver } = useDroppable({ id: status })
  const { label: name, dot } = COLUMNS[status]
  return (
    <section ref={setNodeRef} className={cn('flex-1 min-w-44 rounded-2xl p-3 transition-colors', isOver ? 'bg-primary/10' : 'bg-surface-container-low')}>
      <h2 className="flex items-center gap-2 px-1 mb-3 text-[12px] font-bold uppercase tracking-wider text-on-surface-variant">
        <span className={cn('w-2 h-2 rounded-full', dot)} /> {name}
        <span className="ml-auto text-outline font-semibold">{items.length}</span>
      </h2>
      <div className="flex flex-col gap-2 min-h-16">
        {items.map((i) => <Card key={i.id} item={i} onOpen={() => onOpen(i)} />)}
      </div>
    </section>
  )
}

const EMPTY: ApplicationInput = { company: '', position: '', status: 'wishlist', location: '', url: '', salary: '', notes: '', appliedAt: '', resumeId: null }

export default function JobBoard({ applications, resumes, limit }: {
  applications: Item[]
  resumes: { id: string; title: string }[]
  limit: number | null
}) {
  const [items, moveOptimistic] = useOptimistic(applications, (state, m: { id: string; status: ApplicationStatus }) =>
    state.map((a) => (a.id === m.id ? { ...a, status: m.status } : a)))
  const [pending, startTransition] = useTransition()
  const [error, setError] = useState<string | null>(null)
  // null = closed, 'new' = create, Item = edit
  const [editing, setEditing] = useState<Item | 'new' | null>(null)
  const dialog = useRef<HTMLDialogElement>(null)
  const sensors = useSensors(useSensor(PointerSensor, { activationConstraint: { distance: 6 } }))
  const atLimit = limit !== null && applications.length >= limit

  useEffect(() => {
    if (editing) dialog.current?.showModal()
    else dialog.current?.close()
  }, [editing])

  const onDragEnd = ({ active, over }: DragEndEvent) => {
    const status = over?.id as ApplicationStatus | undefined
    const item = items.find((a) => a.id === active.id)
    if (!status || !item || item.status === status) return
    startTransition(async () => {
      moveOptimistic({ id: item.id, status })
      const res = await updateApplication(item.id, { status })
      setError(res.ok ? null : res.error)
    })
  }

  const onSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    const f = Object.fromEntries(new FormData(e.currentTarget)) as Record<string, string>
    const input = { ...f, resumeId: f.resumeId || null } as unknown as ApplicationInput
    startTransition(async () => {
      const res = editing === 'new' ? await createApplication(input) : await updateApplication((editing as Item).id, input)
      if (!res.ok) return setError(res.error)
      setError(null)
      setEditing(null)
    })
  }

  const onDelete = (item: Item) => {
    if (!confirm(`Delete the application for ${item.position} at ${item.company}?`)) return
    startTransition(async () => {
      await deleteApplication(item.id)
      setEditing(null)
    })
  }

  const current = editing && editing !== 'new' ? editing : EMPTY

  return (
    <div>
      <div className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <h1 className="font-manrope text-2xl font-bold text-on-surface">Job tracker</h1>
          <p className="mt-1 text-[14px] text-outline">
            {limit === null ? `${applications.length} applications` : `${applications.length} of ${limit} applications used on the free plan`}
            {' · '}drag a card to change its stage
          </p>
        </div>
        <button
          onClick={() => { setError(null); setEditing('new') }}
          disabled={atLimit}
          title={atLimit ? 'Delete an application to track a new one' : undefined}
          className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-primary text-white font-manrope text-[13px] font-bold hover:bg-primary-container disabled:opacity-50 disabled:cursor-not-allowed"
        >
          <Plus className="w-4 h-4" /> Add application
        </button>
      </div>

      {error && !editing && <p role="alert" className="mt-4 text-[13px] text-error bg-error-container/50 rounded-lg px-3 py-2">{error}</p>}

      <DndContext sensors={sensors} onDragEnd={onDragEnd}>
        <div className="mt-8 flex gap-4 overflow-x-auto pb-4 items-start">
          {APPLICATION_STATUSES.map((s) => (
            <Column key={s} status={s} items={items.filter((a) => a.status === s)} onOpen={(i) => { setError(null); setEditing(i) }} />
          ))}
        </div>
      </DndContext>

      <dialog
        ref={dialog}
        onClose={() => setEditing(null)}
        className="m-auto w-[min(92vw,520px)] rounded-2xl p-0 backdrop:bg-black/40"
      >
        {editing && (
          <form key={editing === 'new' ? 'new' : editing.id} onSubmit={onSubmit} className="p-6 flex flex-col gap-4">
            <div className="flex items-center justify-between">
              <h2 className="font-manrope text-lg font-bold text-on-surface">{editing === 'new' ? 'Add application' : 'Edit application'}</h2>
              <button type="button" onClick={() => setEditing(null)} aria-label="Close" className="p-1.5 rounded-lg text-outline hover:bg-surface-container"><X className="w-4 h-4" /></button>
            </div>
            <div className="grid grid-cols-2 gap-3">
              <label className={label}>Position *<input name="position" required maxLength={120} defaultValue={current.position} className={field} /></label>
              <label className={label}>Company *<input name="company" required maxLength={120} defaultValue={current.company} className={field} /></label>
              <label className={label}>Stage
                <select name="status" defaultValue={current.status} className={field}>
                  {APPLICATION_STATUSES.map((s) => <option key={s} value={s}>{COLUMNS[s].label}</option>)}
                </select>
              </label>
              <label className={label}>Date applied<input name="appliedAt" type="date" defaultValue={current.appliedAt ?? ''} className={field} /></label>
              <label className={label}>Location<input name="location" maxLength={120} defaultValue={current.location ?? ''} className={field} /></label>
              <label className={label}>Salary<input name="salary" maxLength={80} defaultValue={current.salary ?? ''} className={field} /></label>
            </div>
            <label className={label}>
              <span className="flex items-center gap-2">Job posting link
                {current.url && <a href={current.url} target="_blank" rel="noopener noreferrer" className="text-primary inline-flex items-center gap-1 font-normal">open <ExternalLink className="w-3 h-3" /></a>}
              </span>
              <input name="url" type="url" maxLength={500} placeholder="https://" defaultValue={current.url ?? ''} className={field} />
            </label>
            <label className={label}>Resume used
              <select name="resumeId" defaultValue={current.resumeId ?? ''} className={field}>
                <option value="">— none —</option>
                {resumes.map((r) => <option key={r.id} value={r.id}>{r.title}</option>)}
              </select>
            </label>
            <label className={label}>Notes<textarea name="notes" rows={4} maxLength={5000} defaultValue={current.notes ?? ''} className={field} /></label>

            {error && <p role="alert" className="text-[13px] text-error bg-error-container/50 rounded-lg px-3 py-2">{error}</p>}

            <div className="flex items-center justify-between pt-1">
              {editing !== 'new'
                ? <button type="button" onClick={() => onDelete(editing)} disabled={pending} className="inline-flex items-center gap-1.5 text-[13px] font-semibold text-error hover:underline"><Trash2 className="w-4 h-4" />Delete</button>
                : <span />}
              <button disabled={pending} className="px-5 py-2.5 rounded-xl bg-primary text-white font-manrope text-[13px] font-bold hover:bg-primary-container disabled:opacity-60">
                {pending ? 'Saving…' : 'Save'}
              </button>
            </div>
          </form>
        )}
      </dialog>
    </div>
  )
}
