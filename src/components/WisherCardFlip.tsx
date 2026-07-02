'use client'

import { useState, useRef, useTransition, useEffect } from 'react'
import { updateWishLabel } from '@/app/actions/wishers'

type Wish = { id: string; position: number; label: string | null; done: boolean }

type Props = {
  name: string
  wishes: Wish[]
  qrDataUrl: string
  shareUrl: string
  publicUrl: string
}

export function WisherCardFlip({ name, wishes, qrDataUrl, shareUrl, publicUrl }: Props) {
  const [flipped, setFlipped] = useState(false)
  const [copied, setCopied] = useState(false)

  // Zoom-to-edit state
  const [editOpen, setEditOpen] = useState(false)
  const [editIn, setEditIn] = useState(false)
  const [editFrom, setEditFrom] = useState('scale(0.9)')
  const [draftLabels, setDraftLabels] = useState<Record<string, string>>(
    Object.fromEntries(wishes.map(w => [w.id, w.label ?? '']))
  )
  const [isSaving, startSave] = useTransition()
  const cardRef = useRef<HTMLDivElement>(null)
  const editRafRef = useRef<number | null>(null)
  const editTimers = useRef<ReturnType<typeof setTimeout>[]>([])

  const clearEdit = () => {
    editTimers.current.forEach(clearTimeout)
    editTimers.current = []
    if (editRafRef.current !== null) { cancelAnimationFrame(editRafRef.current); editRafRef.current = null }
  }

  const measureEditFrom = () => {
    if (!cardRef.current) return 'scale(0.9)'
    const rect = cardRef.current.getBoundingClientRect()
    const dx = (rect.left + rect.width / 2) - window.innerWidth / 2
    const dy = (rect.top + rect.height / 2) - window.innerHeight / 2
    const targetWidth = Math.min(400, window.innerWidth * 0.9)
    const scale = rect.width / targetWidth
    return `translateX(${dx}px) translateY(${dy}px) scale(${scale})`
  }

  const openEdit = () => {
    clearEdit()
    setEditFrom(measureEditFrom())
    setEditIn(false)
    setEditOpen(true)
    editRafRef.current = requestAnimationFrame(() => {
      editRafRef.current = requestAnimationFrame(() => {
        setEditIn(true)
        editRafRef.current = null
      })
    })
  }

  const closeEdit = (save: boolean) => {
    clearEdit()
    if (save) {
      startSave(async () => {
        for (const w of wishes) {
          const newLabel = (draftLabels[w.id] ?? '').trim()
          if (newLabel !== (w.label ?? '')) {
            await updateWishLabel(w.id, newLabel)
          }
        }
      })
    } else {
      setDraftLabels(Object.fromEntries(wishes.map(w => [w.id, w.label ?? ''])))
    }
    setEditFrom(measureEditFrom())
    setEditIn(false)
    editTimers.current.push(setTimeout(() => setEditOpen(false), 300))
  }

  useEffect(() => () => clearEdit(), [])

  const handleShare = async () => {
    if (typeof navigator !== 'undefined' && navigator.share) {
      try {
        await navigator.share({ title: `${name}'s Wish Card`, url: shareUrl })
      } catch {
        // user cancelled
      }
    } else {
      await navigator.clipboard.writeText(shareUrl)
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    }
  }

  return (
    <>
      <style>{`
        .card-flip-scene { perspective: 900px; width: 360px; }
        .card-flip-inner {
          position: relative; width: 360px; aspect-ratio: 5/7;
          transform-style: preserve-3d;
          transition: transform 0.65s cubic-bezier(0.4, 0, 0.2, 1);
        }
        .card-flip-inner.flipped { transform: rotateY(180deg); }
        .card-face {
          position: absolute; inset: 0; backface-visibility: hidden;
          -webkit-backface-visibility: hidden; border-radius: 10px; overflow: hidden;
        }
        .card-back-face { transform: rotateY(180deg); }

        .flip-front {
          background: linear-gradient(160deg, #131d35 0%, #0d1420 100%);
          border: 2px solid var(--gold); display: flex; flex-direction: column;
        }
        .flip-front::before {
          content: ''; position: absolute; inset: 5px;
          border: 1px solid rgba(245,200,66,0.22); border-radius: 6px;
          pointer-events: none; z-index: 1;
        }
        .flip-card-name {
          padding: 0.75rem 0.5rem 0.6rem; font-size: 1.35rem; font-weight: 700;
          font-family: var(--font-dancing-script); color: var(--text-primary);
          text-align: center; border-bottom: 1px solid rgba(245,200,66,0.2);
          position: relative; z-index: 3; line-height: 1.25;
        }
        .flip-card-art {
          display: flex; align-items: center; justify-content: center; gap: 0.3rem;
          padding: 0.75rem 0.4rem;
          background: linear-gradient(135deg, #070e1e, #101a30, #070e1e);
          border-bottom: 1px solid rgba(245,200,66,0.2); position: relative; z-index: 3;
        }
        .flip-sparkle { font-size: 1.6rem; color: rgba(255,255,255,0.25); }
        .flip-sparkle.filled { color: rgba(245,200,66,0.5); }
        .flip-sparkle.done { color: var(--gold); filter: drop-shadow(0 0 5px rgba(245,200,66,0.55)); }
        .flip-card-body {
          padding: 0.5rem 0.6rem; display: flex; flex-direction: column;
          gap: 0.3rem; flex: 1; position: relative; z-index: 3;
        }
        .flip-card-icons {
          position: absolute; bottom: 0.55rem; left: 0.55rem; z-index: 10;
          display: flex; gap: 0.35rem;
        }
        .flip-icon-btn {
          width: 28px; height: 28px; border-radius: 6px;
          background: rgba(245,200,66,0.1); border: 1px solid rgba(245,200,66,0.25);
          color: rgba(245,200,66,0.6); display: flex; align-items: center;
          justify-content: center; cursor: pointer; font-size: 0.8rem;
          transition: background 0.15s, color 0.15s, border-color 0.15s; padding: 0;
        }
        .flip-icon-btn:hover { background: rgba(245,200,66,0.18); color: var(--gold); border-color: rgba(245,200,66,0.5); }

        .flip-back {
          background: linear-gradient(160deg, #0d1420 0%, #0a0f1c 100%);
          border: 2px solid var(--gold); display: flex; flex-direction: column;
          align-items: center; justify-content: center; gap: 0.6rem; padding: 1rem 0.75rem;
        }
        .flip-back::before {
          content: ''; position: absolute; inset: 5px;
          border: 1px solid rgba(245,200,66,0.18); border-radius: 6px;
          pointer-events: none; z-index: 1;
        }
        .flip-back-label {
          font-size: 0.65rem; font-weight: 600; letter-spacing: 0.12em;
          text-transform: uppercase; color: rgba(245,200,66,0.5);
          position: relative; z-index: 2;
        }
        .flip-qr-img { border-radius: 6px; display: block; position: relative; z-index: 2; }
        .flip-back-url {
          font-size: 0.6rem; color: rgba(245,200,66,0.35); text-align: center;
          word-break: break-all; position: relative; z-index: 2; line-height: 1.4;
        }
        .flip-back-close {
          position: absolute; bottom: 0.65rem; left: 50%; transform: translateX(-50%);
          z-index: 10; display: flex; align-items: center; gap: 0.35rem;
          padding: 0.35rem 0.85rem; border-radius: 20px;
          background: rgba(245,200,66,0.1); border: 1px solid rgba(245,200,66,0.3);
          color: rgba(245,200,66,0.7); cursor: pointer;
          font-size: 0.72rem; font-weight: 600; letter-spacing: 0.04em;
          transition: background 0.15s, color 0.15s, border-color 0.15s;
          white-space: nowrap;
        }
        .flip-back-close:hover { background: rgba(245,200,66,0.18); color: var(--gold); border-color: rgba(245,200,66,0.55); }
        .copied-toast {
          position: absolute; bottom: calc(100% + 0.5rem); left: 50%;
          transform: translateX(-50%); background: var(--bg-surface);
          border: 1px solid var(--gold-border); color: var(--gold);
          font-size: 0.78rem; padding: 0.3rem 0.7rem; border-radius: 6px;
          white-space: nowrap; pointer-events: none;
        }

        /* ── Zoom-to-edit overlay ── */
        .wcf-edit-backdrop {
          position: fixed; inset: 0; z-index: 500;
          background: rgba(5,9,20,0.88); backdrop-filter: blur(6px);
          animation: wcf-bd-in 0.28s ease forwards;
        }
        .wcf-edit-backdrop.closing { animation: wcf-bd-out 0.24s ease forwards; }
        @keyframes wcf-bd-in  { from { opacity: 0 } to { opacity: 1 } }
        @keyframes wcf-bd-out { from { opacity: 1 } to { opacity: 0 } }
        .wcf-edit-layer {
          position: fixed; inset: 0; z-index: 501;
          display: flex; align-items: center; justify-content: center;
          pointer-events: none;
        }
        .wcf-edit-card {
          pointer-events: auto;
          width: min(400px, 90vw); aspect-ratio: 5/7;
          background: linear-gradient(160deg, #131d35 0%, #0d1420 100%);
          border: 2px solid var(--gold); border-radius: 12px;
          display: flex; flex-direction: column; position: relative;
          box-shadow: 0 0 40px rgba(245,200,66,0.15), 0 24px 60px rgba(0,0,0,0.8);
          overflow: hidden;
        }
        .wcf-edit-card::before {
          content: ''; position: absolute; inset: 6px;
          border: 1px solid rgba(245,200,66,0.16); border-radius: 8px;
          pointer-events: none; z-index: 1;
        }
        .wcf-wish-input {
          flex: 1; background: none; border: none;
          border-bottom: 1px solid rgba(245,200,66,0.15);
          color: var(--text-primary); font-size: 1rem; font-family: inherit;
          outline: none; padding: 0.25rem 0;
          transition: border-color 0.15s;
        }
        .wcf-wish-input:focus { border-bottom-color: rgba(245,200,66,0.45); }
        .wcf-wish-input::placeholder { color: rgba(155,163,192,0.2); }
      `}</style>

      {/* ── Normal card (in the column) ── */}
      <div className="card-flip-scene" ref={cardRef} style={{ position: 'relative' }}>
        {copied && <div className="copied-toast">Link copied!</div>}

        <div className={`card-flip-inner${flipped ? ' flipped' : ''}`}>

          {/* Front — pointer-events:none when showing QR back so the back face buttons are clickable */}
          <div className="card-face flip-front" style={{ pointerEvents: flipped ? 'none' : 'auto' }}>
            <div className="flip-card-name">{name}</div>
            <div className="flip-card-art">
              {wishes.map(w => (
                <i key={w.id} className={`bi bi-stars flip-sparkle${w.done ? ' done' : w.label ? ' filled' : ''}`} />
              ))}
            </div>
            <div className="flip-card-body">
              {wishes.map(w => (
                <div key={w.id} style={{ display: 'flex', alignItems: 'flex-start', gap: '0.4rem' }}>
                  <span style={{ fontSize: '0.85rem', color: w.done ? 'var(--gold)' : w.label ? 'rgba(245,200,66,0.5)' : 'rgba(255,255,255,0.22)', flexShrink: 0, marginTop: '2px' }}>✦</span>
                  <span style={{ fontSize: '0.78rem', color: w.done ? 'var(--text-secondary)' : w.label ? 'rgba(255,255,255,0.7)' : 'rgba(255,255,255,0.22)', lineHeight: 1.4, textDecoration: w.done ? 'line-through' : 'none', textDecorationColor: 'rgba(155,163,192,0.35)' }}>
                    {w.label ?? <span style={{ opacity: 0.3, fontStyle: 'italic' }}>Wish {w.position}</span>}
                  </span>
                </div>
              ))}
            </div>

            <div className="flip-card-icons">
              <button className="flip-icon-btn" onClick={() => setFlipped(true)} title="Show QR code" type="button">
                <i className="bi bi-qr-code" />
              </button>
              <button className="flip-icon-btn" onClick={handleShare} title={copied ? 'Copied!' : 'Share card link'} type="button">
                <i className={`bi bi-${copied ? 'check2' : 'share'}`} />
              </button>
              <button className="flip-icon-btn" onClick={openEdit} title="Edit wishes" type="button">
                <i className="bi bi-pencil" />
              </button>
            </div>
          </div>

          {/* Back (QR) */}
          <div className="card-face card-back-face flip-back">
            <span className="flip-back-label">Scan to open</span>
            <img src={qrDataUrl} alt="QR code" width={160} height={160} className="flip-qr-img" />
            <span className="flip-back-url">{publicUrl}</span>
            <button className="flip-back-close" onClick={() => setFlipped(false)} type="button">
              <i className="bi bi-arrow-left" />
              Flip back
            </button>
          </div>

        </div>
      </div>

      {/* ── Zoom-to-edit overlay ── */}
      {editOpen && (
        <>
          <div
            className={`wcf-edit-backdrop${!editIn ? ' closing' : ''}`}
            onClick={() => closeEdit(false)}
          />
          <div className="wcf-edit-layer">
            <div
              style={{
                perspective: '1200px',
                transform: editIn ? 'translateX(0) translateY(0) scale(1)' : editFrom,
                transition: editIn
                  ? 'transform 0.5s cubic-bezier(0.22, 0.61, 0.36, 1)'
                  : 'transform 0.28s cubic-bezier(0.4, 0, 1, 1)',
              }}
              onClick={e => e.stopPropagation()}
            >
              <div className="wcf-edit-card">
                {/* Card header */}
                <div style={{ padding: '0.75rem 0.85rem 0.65rem', fontFamily: 'var(--font-dancing-script)', fontSize: '1.6rem', fontWeight: 700, color: 'var(--text-primary)', textAlign: 'center', borderBottom: '1px solid rgba(245,200,66,0.2)', position: 'relative', zIndex: 3, lineHeight: 1.25 }}>
                  {name}
                </div>

                {/* Stars row */}
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.4rem', padding: '0.75rem 0.4rem', background: 'linear-gradient(135deg, #070e1e, #101a30, #070e1e)', borderBottom: '1px solid rgba(245,200,66,0.2)', position: 'relative', zIndex: 3 }}>
                  {wishes.map(w => (
                    <i key={w.id} className={`bi bi-stars flip-sparkle${w.done ? ' done' : draftLabels[w.id]?.trim() ? ' filled' : ''}`} style={{ fontSize: '1.9rem' }} />
                  ))}
                </div>

                {/* Editable wish slots */}
                <div style={{ padding: '0.75rem 1rem', display: 'flex', flexDirection: 'column', gap: '0.65rem', flex: 1, position: 'relative', zIndex: 3 }}>
                  {wishes.map(w => (
                    <div key={w.id} style={{ display: 'flex', alignItems: 'center', gap: '0.55rem' }}>
                      <span style={{ fontSize: '1rem', color: w.done ? 'var(--gold)' : draftLabels[w.id]?.trim() ? 'rgba(245,200,66,0.5)' : 'rgba(255,255,255,0.22)', flexShrink: 0 }}>✦</span>
                      <input
                        className="wcf-wish-input"
                        value={draftLabels[w.id] ?? ''}
                        onChange={e => setDraftLabels(prev => ({ ...prev, [w.id]: e.target.value }))}
                        placeholder={`Wish ${w.position}…`}
                        onKeyDown={e => { if (e.key === 'Enter') closeEdit(true) }}
                      />
                    </div>
                  ))}
                </div>

                {/* Footer */}
                <div style={{ padding: '0.4rem 0.75rem 0.65rem', display: 'flex', gap: '0.45rem', position: 'relative', zIndex: 3, borderTop: '1px solid rgba(245,200,66,0.08)' }}>
                  <button
                    type="button"
                    onClick={() => closeEdit(false)}
                    disabled={isSaving}
                    style={{ flex: '0 0 64px', padding: '0.48rem 0', borderRadius: 8, background: 'transparent', color: 'var(--text-muted)', fontSize: '0.82rem', border: '1px solid rgba(255,255,255,0.08)', cursor: 'pointer' }}
                  >
                    Cancel
                  </button>
                  <button
                    type="button"
                    onClick={() => closeEdit(true)}
                    disabled={isSaving}
                    style={{ flex: 1, padding: '0.48rem 0', borderRadius: 8, background: 'var(--gold)', color: '#0B0F1A', fontWeight: 700, fontSize: '0.82rem', border: 'none', cursor: isSaving ? 'wait' : 'pointer', opacity: isSaving ? 0.7 : 1 }}
                  >
                    {isSaving ? 'Saving…' : 'Save'}
                  </button>
                </div>
              </div>
            </div>
          </div>
        </>
      )}
    </>
  )
}
