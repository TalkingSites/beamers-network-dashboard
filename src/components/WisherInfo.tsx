'use client'

import { useState, useRef, useTransition } from 'react'
import { updateWisher, updateWisherNotes } from '@/app/actions/wishers'

type Props = {
  id: string
  name: string
  email: string | null
  notes: string | null
  allDone: boolean
}

export function WisherInfo({ id, name, email, notes, allDone }: Props) {
  const [editing, setEditing] = useState(false)
  const [draftName, setDraftName] = useState(name)
  const [draftEmail, setDraftEmail] = useState(email ?? '')
  const [draftNotes, setDraftNotes] = useState(notes ?? '')
  const [isPending, startTransition] = useTransition()
  const nameInputRef = useRef<HTMLInputElement>(null)

  const startEdit = () => {
    setEditing(true)
    setTimeout(() => nameInputRef.current?.focus(), 50)
  }

  const cancelEdit = () => {
    setDraftName(name)
    setDraftEmail(email ?? '')
    setEditing(false)
  }

  const save = () => {
    const trimmedName = draftName.trim()
    if (!trimmedName) return
    startTransition(async () => {
      await updateWisher(id, trimmedName, draftEmail.trim() || null)
      setEditing(false)
    })
  }

  const saveNotes = (value: string) => {
    const trimmed = value.trim()
    if (trimmed === (notes ?? '')) return
    startTransition(() => updateWisherNotes(id, trimmed || null))
  }

  return (
    <div>
      <style>{`
        .wi-name-row { display: flex; align-items: center; gap: 0.6rem; margin-bottom: 0.2rem; }
        .wi-icon-btn {
          background: none; border: none; padding: 0.25rem; cursor: pointer; border-radius: 6px;
          color: rgba(155,163,192,0.45); font-size: 1rem; line-height: 1;
          transition: color 0.15s, background 0.15s; flex-shrink: 0;
        }
        .wi-icon-btn:hover { color: var(--gold); background: rgba(245,200,66,0.08); }
        .wi-icon-btn.save { color: rgba(245,200,66,0.7); }
        .wi-icon-btn.save:hover { color: var(--gold); background: rgba(245,200,66,0.12); }
        .wi-icon-btn.cancel { color: rgba(155,163,192,0.35); }
        .wi-icon-btn.cancel:hover { color: var(--text-secondary); background: rgba(255,255,255,0.06); }
        .wi-name-input {
          font-family: Georgia, serif; font-size: 2.2rem; font-weight: 700; line-height: 1.2;
          background: none; border: none; border-bottom: 1.5px solid rgba(245,200,66,0.35);
          color: var(--text-primary); outline: none; width: 100%; padding: 0 0 0.1rem;
          transition: border-color 0.15s;
        }
        .wi-name-input:focus { border-bottom-color: var(--gold); }
        .wi-email-input {
          background: none; border: none; border-bottom: 1px solid rgba(255,255,255,0.1);
          color: var(--text-muted); font-size: 0.9rem; outline: none; width: 100%; padding: 0 0 0.1rem;
          font-family: inherit; transition: border-color 0.15s;
        }
        .wi-email-input:focus { border-bottom-color: rgba(245,200,66,0.35); }
        .wi-email-input::placeholder { color: rgba(155,163,192,0.25); }
        .wi-notes-area {
          width: 100%; background: rgba(255,255,255,0.02); border: 1px solid rgba(255,255,255,0.06);
          border-radius: 8px; padding: 0.65rem 0.85rem; color: var(--text-secondary);
          font-size: 0.88rem; font-family: inherit; outline: none; resize: vertical; min-height: 80px;
          transition: border-color 0.15s, background 0.15s;
        }
        .wi-notes-area:focus { border-color: rgba(245,200,66,0.25); background: rgba(255,255,255,0.04); }
        .wi-notes-area::placeholder { color: rgba(155,163,192,0.25); }
      `}</style>

      {/* Name + edit/save */}
      <div className="wi-name-row">
        {editing ? (
          <input
            ref={nameInputRef}
            className="wi-name-input"
            value={draftName}
            onChange={e => setDraftName(e.target.value)}
            onKeyDown={e => { if (e.key === 'Enter') save(); if (e.key === 'Escape') cancelEdit() }}
            disabled={isPending}
          />
        ) : (
          <h1 style={{ fontFamily: 'Georgia, serif', fontSize: '2.2rem', fontWeight: 700, margin: 0, lineHeight: 1.2 }}>
            {name}
          </h1>
        )}

        {allDone && !editing && (
          <span style={{
            display: 'inline-flex', alignItems: 'center', gap: '0.35rem',
            padding: '0.3rem 0.75rem', borderRadius: 999,
            background: 'rgba(245,200,66,0.12)', border: '1px solid rgba(245,200,66,0.3)',
            color: 'var(--gold)', fontSize: '0.82rem', fontWeight: 600, flexShrink: 0,
          }}>
            <i className="bi bi-check2-circle" /> All wishes granted!
          </span>
        )}

        {editing ? (
          <>
            <button className="wi-icon-btn save" onClick={save} disabled={isPending} title="Save" type="button">
              <i className="bi bi-check-lg" />
            </button>
            <button className="wi-icon-btn cancel" onClick={cancelEdit} disabled={isPending} title="Cancel" type="button">
              <i className="bi bi-x-lg" />
            </button>
          </>
        ) : (
          <button className="wi-icon-btn" onClick={startEdit} title="Edit name & email" type="button">
            <i className="bi bi-pencil" />
          </button>
        )}
      </div>

      {/* Email */}
      {editing ? (
        <input
          className="wi-email-input"
          type="email"
          value={draftEmail}
          onChange={e => setDraftEmail(e.target.value)}
          onKeyDown={e => { if (e.key === 'Enter') save(); if (e.key === 'Escape') cancelEdit() }}
          placeholder="Email (optional)"
          disabled={isPending}
          style={{ marginBottom: '2rem' }}
        />
      ) : (
        <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem', marginBottom: '2rem', minHeight: '1.4rem' }}>
          {email ?? <span style={{ color: 'rgba(155,163,192,0.3)', fontStyle: 'italic' }}>No email</span>}
        </p>
      )}

      {/* Notes — always edit-in-place */}
      <div style={{ marginBottom: '2.5rem' }}>
        <p style={{ fontSize: '0.8rem', fontWeight: 600, letterSpacing: '0.1em', textTransform: 'uppercase', color: 'var(--text-muted)', marginBottom: '0.5rem' }}>
          Notes
        </p>
        <textarea
          className="wi-notes-area"
          value={draftNotes}
          onChange={e => setDraftNotes(e.target.value)}
          onBlur={e => saveNotes(e.target.value)}
          placeholder="Context, background, anything useful…"
          rows={3}
        />
      </div>
    </div>
  )
}
