'use client'

import { useRef } from 'react'
import { useFormStatus } from 'react-dom'
import { createWisher } from '@/app/actions/wishers'

function SubmitButton() {
  const { pending } = useFormStatus()
  return (
    <button
      type="submit"
      disabled={pending}
      style={{
        padding: '0.55rem 1.25rem',
        borderRadius: 8,
        background: 'var(--gold)',
        color: '#0B0F1A',
        fontWeight: 700,
        fontSize: '0.9rem',
        border: 'none',
        cursor: pending ? 'not-allowed' : 'pointer',
        opacity: pending ? 0.7 : 1,
        transition: 'opacity 0.15s',
      }}
    >
      {pending ? 'Creating…' : 'Create Wisher'}
    </button>
  )
}

export function AddWisherModal() {
  const dialogRef = useRef<HTMLDialogElement>(null)

  const open = () => dialogRef.current?.showModal()
  const close = () => dialogRef.current?.close()

  return (
    <>
      <style>{`
        .add-wisher-dialog {
          background: var(--bg-surface);
          border: 1px solid var(--gold-border);
          border-radius: 14px;
          padding: 0;
          color: var(--text-primary);
          width: min(420px, 90vw);
          box-shadow: 0 24px 80px rgba(0,0,0,0.7);
        }
        .add-wisher-dialog::backdrop {
          background: rgba(0,0,0,0.6);
          backdrop-filter: blur(3px);
        }
        .modal-input {
          width: 100%;
          background: var(--bg-card);
          border: 1px solid var(--border);
          border-radius: 8px;
          padding: 0.6rem 0.85rem;
          color: var(--text-primary);
          font-size: 0.95rem;
          font-family: inherit;
          outline: none;
          transition: border-color 0.15s;
        }
        .modal-input:focus { border-color: var(--gold-border); }
        .modal-input::placeholder { color: var(--text-muted); }
      `}</style>

      <button
        onClick={open}
        style={{
          display: 'inline-flex',
          alignItems: 'center',
          gap: '0.45rem',
          padding: '0.55rem 1.1rem',
          borderRadius: 8,
          background: 'var(--gold)',
          color: '#0B0F1A',
          fontWeight: 700,
          fontSize: '0.9rem',
          border: 'none',
          cursor: 'pointer',
        }}
      >
        <i className="bi bi-plus-lg" />
        Add Wisher
      </button>

      <dialog ref={dialogRef} className="add-wisher-dialog">
        <div style={{ padding: '1.75rem' }}>
          <h2 style={{
            fontFamily: 'Georgia, serif',
            fontSize: '1.35rem',
            fontWeight: 700,
            marginBottom: '1.5rem',
            color: 'var(--text-primary)',
          }}>
            New Wisher
          </h2>

          <form action={createWisher} style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.4rem' }}>
              <label style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', fontWeight: 500 }}>
                Name *
              </label>
              <input
                name="name"
                required
                autoFocus
                placeholder="e.g. Sarah Chen"
                className="modal-input"
              />
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.4rem' }}>
              <label style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', fontWeight: 500 }}>
                Email <span style={{ color: 'var(--text-muted)', fontWeight: 400 }}>(optional)</span>
              </label>
              <input
                name="email"
                type="email"
                placeholder="sarah@example.com"
                className="modal-input"
              />
            </div>

            <div style={{ display: 'flex', gap: '0.75rem', justifyContent: 'flex-end', paddingTop: '0.5rem' }}>
              <button
                type="button"
                onClick={close}
                style={{
                  padding: '0.55rem 1.1rem',
                  borderRadius: 8,
                  background: 'transparent',
                  color: 'var(--text-secondary)',
                  fontWeight: 500,
                  fontSize: '0.9rem',
                  border: '1px solid var(--border)',
                  cursor: 'pointer',
                }}
              >
                Cancel
              </button>
              <SubmitButton />
            </div>
          </form>
        </div>
      </dialog>
    </>
  )
}
