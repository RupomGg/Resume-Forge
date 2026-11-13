'use client'

import { useEffect } from 'react'
import { create } from 'zustand'
import { saveResume } from '@/lib/actions/resumes'
import { useCVStore } from './cv-store'
import { DATA_KEYS, normalizeResume } from './initial-state'

export type SaveStatus = 'saved' | 'unsaved' | 'saving' | 'error'

export const useSaveStatus = create<{ status: SaveStatus; error: string | null }>(() => ({ status: 'saved', error: null }))

/** Debounced autosave of the CV store to the server while the editor is mounted. */
export function useAutosave(resumeId: string) {
  useEffect(() => {
    let timer: ReturnType<typeof setTimeout> | undefined
    let saving = false
    let queued = false
    useSaveStatus.setState({ status: 'saved', error: null })

    const flush = async () => {
      clearTimeout(timer)
      timer = undefined
      if (saving) { queued = true; return }
      saving = true
      useSaveStatus.setState({ status: 'saving', error: null })
      const res = await saveResume(resumeId, normalizeResume(useCVStore.getState()))
        .catch(() => ({ ok: false as const, error: 'Could not reach the server.' }))
      saving = false
      if (queued) { queued = false; return flush() }
      useSaveStatus.setState(res.ok ? { status: 'saved', error: null } : { status: 'error', error: res.error })
    }

    const unsubscribe = useCVStore.subscribe((state, prev) => {
      if (!DATA_KEYS.some((k) => state[k] !== prev[k])) return
      useSaveStatus.setState({ status: 'unsaved', error: null })
      clearTimeout(timer)
      timer = setTimeout(flush, 1000)
    })

    const warn = (e: BeforeUnloadEvent) => {
      if (useSaveStatus.getState().status !== 'saved') e.preventDefault()
    }
    window.addEventListener('beforeunload', warn)

    return () => {
      unsubscribe()
      window.removeEventListener('beforeunload', warn)
      if (timer) void flush() // leaving the editor with a pending edit
    }
  }, [resumeId])
}

/** Resolves once nothing is pending — used before generating a PDF from saved data. */
export function waitForSave(timeoutMs = 10_000) {
  return new Promise<boolean>((resolve) => {
    const done = () => useSaveStatus.getState().status === 'saved'
    if (done()) return resolve(true)
    const t = setTimeout(() => { unsub(); resolve(false) }, timeoutMs)
    const unsub = useSaveStatus.subscribe(() => {
      const s = useSaveStatus.getState().status
      if (s === 'saved' || s === 'error') { clearTimeout(t); unsub(); resolve(s === 'saved') }
    })
  })
}
