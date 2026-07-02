'use client'

import { useState, useRef, useTransition, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import QRCode from 'qrcode'
import { updateWishLabel } from '@/app/actions/wishers'

type Wish = { id: string; position: number; label: string | null; done: boolean }
type Props = { id: string; name: string; shareToken: string | null; wishes: Wish[] }

export function WisherGridCard({ id, name, shareToken, wishes }: Props) {
  const router = useRouter()
  const [flipped, setFlipped] = useState(false)
  const [copied, setCopied] = useState(false)
  const [qrDataUrl, setQrDataUrl] = useState<string | null>(null)

  // Zoom-to-edit
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
        router.refresh()
      })
    } else {
      setDraftLabels(Object.fromEntries(wishes.map(w => [w.id, w.label ?? ''])))
    }
    setEditFrom(measureEditFrom())
    setEditIn(false)
    editTimers.current.push(setTimeout(() => setEditOpen(false), 300))
  }

  useEffect(() => () => clearEdit(), [])

  const handleQr = async (e: React.MouseEvent) => {
    e.stopPropagation()
    if (!shareToken) return
    if (!qrDataUrl) {
      const url = `${window.location.origin}/card/${shareToken}`
      const dataUrl = await QRCode.toDataURL(url, {
        color: { dark: '#F5C842', light: '#0d1420' }, margin: 1, width: 200,
      })
      setQrDataUrl(dataUrl)
    }
    setFlipped(true)
  }

  const handleShare = async (e: React.MouseEvent) => {
    e.stopPropagation()
    if (!shareToken) return
    const url = `${window.location.origin}/card/${shareToken}`
    if (navigator.share) {
      try { await navigator.share({ title: `${name}'s Wish Card`, url }) } catch { /* cancelled */ }
    } else {
      await navigator.clipboard.writeText(url)
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    }
  }

  return (
    <>
      <style>{`
        .wgc-scene { perspective: 700px; width: 100%; aspect-ratio: 5/7; position: relative; }
        .wgc-inner {
          width: 100%; height: 100%; position: relative;
          transform-style: preserve-3d;
          transition: transform 0.65s cubic-bezier(0.4, 0, 0.2, 1);
        }
        .wgc-inner.flipped { transform: rotateY(180deg); }
        .wgc-face {
          position: absolute; inset: 0; backface-visibility: hidden;
          -webkit-backface-visibility: hidden; border-radius: 10px; overflow: hidden;
        }
        .wgc-back { transform: rotateY(180deg); }

        /* Front — same styling as wisher-card on the list */
        .wgc-front {
          background: linear-gradient(160deg, #131d35 0%, #0d1420 100%);
          border: 2px solid var(--gold);
          display: flex; flex-direction: column;
          box-shadow: 0 4px 20px rgba(0,0,0,0.5);
          cursor: pointer;
          transition: transform 0.35s ease, box-shadow 0.35s ease;
        }
        .wgc-front::before {
          content: ''; position: absolute; inset: 5px;
          border: 1px solid rgba(245,200,66,0.22); border-radius: 6px;
          pointer-events: none; z-index: 1;
        }
        .wgc-front::after {
          content: ''; position: absolute; top: 0; left: -100%; width: 60%; height: 100%;
          background: linear-gradient(105deg, transparent, rgba(255,255,255,0.07), transparent);
          transform: skewX(-15deg); transition: left 0.55s ease; pointer-events: none; z-index: 2;
        }
        .wgc-front:hover { transform: perspective(700px) rotateY(-6deg) rotateX(3deg) scale(1.06); box-shadow: 0 16px 50px rgba(245,200,66,0.22), 0 0 40px rgba(245,200,66,0.08), 0 8px 30px rgba(0,0,0,0.6); }
        .wgc-front:hover::after { left: 160%; }

        /* QR back */
        .wgc-qr-back {
          background: linear-gradient(160deg, #0d1420 0%, #0a0f1c 100%);
          border: 2px solid var(--gold);
          display: flex; flex-direction: column;
          align-items: center; justify-content: center;
          gap: 0.5rem; padding: 0.75rem 0.5rem;
        }
        .wgc-qr-back::before {
          content: ''; position: absolute; inset: 5px;
          border: 1px solid rgba(245,200,66,0.18); border-radius: 6px;
          pointer-events: none; z-index: 1;
        }
        .wgc-flip-back-btn {
          position: absolute; bottom: 0.5rem; left: 50%; transform: translateX(-50%);
          z-index: 10; display: flex; align-items: center; gap: 0.3rem;
          padding: 0.28rem 0.65rem; border-radius: 20px;
          background: rgba(245,200,66,0.1); border: 1px solid rgba(245,200,66,0.3);
          color: rgba(245,200,66,0.7); cursor: pointer;
          font-size: 0.65rem; font-weight: 600;
          transition: background 0.15s, color 0.15s; white-space: nowrap;
        }
        .wgc-flip-back-btn:hover { background: rgba(245,200,66,0.18); color: var(--gold); }

        /* Action icon buttons */
        .wgc-icons {
          position: absolute; bottom: 0.5rem; left: 0.5rem; z-index: 10;
          display: flex; gap: 0.3rem;
        }
        .wgc-icon-btn {
          width: 26px; height: 26px; border-radius: 6px;
          background: rgba(245,200,66,0.1); border: 1px solid rgba(245,200,66,0.25);
          color: rgba(245,200,66,0.6); display: flex; align-items: center;
          justify-content: center; cursor: pointer; font-size: 0.75rem;
          transition: background 0.15s, color 0.15s, border-color 0.15s; padding: 0;
        }
        .wgc-icon-btn:hover { background: rgba(245,200,66,0.18); color: var(--gold); border-color: rgba(245,200,66,0.5); }

        /* Zoom-to-edit overlay */
        .wgc-edit-backdrop {
          position: fixed; inset: 0; z-index: 500;
          background: rgba(5,9,20,0.88); backdrop-filter: blur(6px);
          animation: wgc-bd-in 0.28s ease forwards;
        }
        .wgc-edit-backdrop.closing { animation: wgc-bd-out 0.24s ease forwards; }
        @keyframes wgc-bd-in  { from { opacity: 0 } to { opacity: 1 } }
        @keyframes wgc-bd-out { from { opacity: 1 } to { opacity: 0 } }
        .wgc-edit-layer {
          position: fixed; inset: 0; z-index: 501;
          display: flex; align-items: center; justify-content: center; pointer-events: none;
        }
        .wgc-edit-card {
          pointer-events: auto; width: min(400px, 90vw); aspect-ratio: 5/7;
          background: linear-gradient(160deg, #131d35 0%, #0d1420 100%);
          border: 2px solid var(--gold); border-radius: 12px;
          display: flex; flex-direction: column; position: relative;
          box-shadow: 0 0 40px rgba(245,200,66,0.15), 0 24px 60px rgba(0,0,0,0.8);
          overflow: hidden;
        }
        .wgc-edit-card::before {
          content: ''; position: absolute; inset: 6px;
          border: 1px solid rgba(245,200,66,0.16); border-radius: 8px;
          pointer-events: none; z-index: 1;
        }
        .wgc-wish-input {
          flex: 1; background: none; border: none;
          border-bottom: 1px solid rgba(245,200,66,0.15);
          color: var(--text-primary); font-size: 1rem; font-family: inherit;
          outline: none; padding: 0.28rem 0; transition: border-color 0.15s;
        }
        .wgc-wish-input:focus { border-bottom-color: rgba(245,200,66,0.45); }
        .wgc-wish-input::placeholder { color: rgba(155,163,192,0.2); }
        .wgc-sparkle { font-size: 1.6rem; color: rgba(255,255,255,0.22); }
        .wgc-sparkle.filled { color: rgba(245,200,66,0.5); }
        .wgc-sparkle.done { color: var(--gold); filter: drop-shadow(0 0 5px rgba(245,200,66,0.55)); }
      `}</style>

      {/* Card in the grid */}
      <div className="wgc-scene" ref={cardRef}>
        {copied && (
          <div style={{ position: 'absolute', bottom: 'calc(100% + 0.4rem)', left: '50%', transform: 'translateX(-50%)', background: 'var(--bg-surface)', border: '1px solid rgba(245,200,66,0.3)', color: 'var(--gold)', fontSize: '0.75rem', padding: '0.25rem 0.6rem', borderRadius: 6, whiteSpace: 'nowrap', zIndex: 20, pointerEvents: 'none' }}>
            Copied!
          </div>
        )}

        <div className={`wgc-inner${flipped ? ' flipped' : ''}`}>

          {/* Front */}
          <div
            className="wgc-face wgc-front"
            style={{ pointerEvents: flipped ? 'none' : 'auto' }}
            onClick={() => router.push(`/wishers/${id}`)}
          >
            {/* Name */}
            <div style={{ padding: '0.9rem 0.6rem', minHeight: '2.75rem', fontSize: '1.6rem', fontWeight: 700, fontFamily: 'var(--font-dancing-script)', color: 'var(--text-primary)', textAlign: 'center', borderBottom: '1px solid rgba(245,200,66,0.2)', position: 'relative', zIndex: 3, lineHeight: 1.3, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              {name}
            </div>
            {/* Stars */}
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.4rem', padding: '0.9rem 0.5rem', background: 'linear-gradient(135deg, #070e1e, #101a30, #070e1e)', borderBottom: '1px solid rgba(245,200,66,0.2)', position: 'relative', zIndex: 3 }}>
              {wishes.map(w => (
                <i key={w.id} className={`bi bi-stars wgc-sparkle${w.done ? ' done' : w.label ? ' filled' : ''}`} />
              ))}
            </div>
            {/* Wishes */}
            <div style={{ padding: '0.6rem 0.7rem', display: 'flex', flexDirection: 'column', gap: '0.4rem', flex: 1, position: 'relative', zIndex: 3 }}>
              {wishes.map(w => (
                <div key={w.id} style={{ display: 'flex', alignItems: 'flex-start', gap: '0.4rem' }}>
                  <span style={{ fontSize: '1rem', color: w.done ? 'var(--gold)' : w.label ? 'rgba(245,200,66,0.5)' : 'rgba(255,255,255,0.22)', marginTop: '2px', flexShrink: 0 }}>✦</span>
                  <span style={{ fontSize: '0.9rem', color: w.done ? 'var(--text-secondary)' : w.label ? 'rgba(255,255,255,0.7)' : 'rgba(255,255,255,0.22)', lineHeight: 1.4 }}>
                    {w.label}
                  </span>
                </div>
              ))}
            </div>
            {/* Action icons */}
            <div className="wgc-icons" onClick={e => e.stopPropagation()}>
              {shareToken && (
                <button className="wgc-icon-btn" onClick={handleQr} title="Show QR code" type="button">
                  <i className="bi bi-qr-code" />
                </button>
              )}
              {shareToken && (
                <button className="wgc-icon-btn" onClick={handleShare} title="Share" type="button">
                  <i className={`bi bi-${copied ? 'check2' : 'share'}`} />
                </button>
              )}
              <button className="wgc-icon-btn" onClick={e => { e.stopPropagation(); openEdit() }} title="Edit wishes" type="button">
                <i className="bi bi-pencil" />
              </button>
            </div>
          </div>

          {/* Back — QR */}
          <div className="wgc-face wgc-back wgc-qr-back">
            <span style={{ fontSize: '0.58rem', fontWeight: 600, letterSpacing: '0.12em', textTransform: 'uppercase', color: 'rgba(245,200,66,0.5)', position: 'relative', zIndex: 2 }}>
              Scan to open
            </span>
            {qrDataUrl && (
              <img src={qrDataUrl} alt="QR code" width={120} height={120} style={{ borderRadius: 5, display: 'block', position: 'relative', zIndex: 2 }} />
            )}
            <span style={{ fontSize: '0.55rem', color: 'rgba(245,200,66,0.35)', textAlign: 'center', position: 'relative', zIndex: 2, lineHeight: 1.4, wordBreak: 'break-all' }}>
              {shareToken ? `/card/${shareToken.slice(0, 8)}…` : ''}
            </span>
            <button className="wgc-flip-back-btn" onClick={() => setFlipped(false)} type="button">
              <i className="bi bi-arrow-left" /> Flip back
            </button>
          </div>

        </div>
      </div>

      {/* Zoom-to-edit overlay */}
      {editOpen && (
        <>
          <div
            className={`wgc-edit-backdrop${!editIn ? ' closing' : ''}`}
            onClick={() => closeEdit(false)}
          />
          <div className="wgc-edit-layer">
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
              <div className="wgc-edit-card">
                <div style={{ padding: '0.75rem 0.85rem 0.65rem', fontFamily: 'var(--font-dancing-script)', fontSize: '1.6rem', fontWeight: 700, color: 'var(--text-primary)', textAlign: 'center', borderBottom: '1px solid rgba(245,200,66,0.2)', position: 'relative', zIndex: 3, lineHeight: 1.25 }}>
                  {name}
                </div>
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.4rem', padding: '0.75rem 0.4rem', background: 'linear-gradient(135deg, #070e1e, #101a30, #070e1e)', borderBottom: '1px solid rgba(245,200,66,0.2)', position: 'relative', zIndex: 3 }}>
                  {wishes.map(w => (
                    <i key={w.id} className={`bi bi-stars wgc-sparkle${w.done ? ' done' : draftLabels[w.id]?.trim() ? ' filled' : ''}`} style={{ fontSize: '1.9rem' }} />
                  ))}
                </div>
                <div style={{ padding: '0.75rem 1rem', display: 'flex', flexDirection: 'column', gap: '0.65rem', flex: 1, position: 'relative', zIndex: 3 }}>
                  {wishes.map(w => (
                    <div key={w.id} style={{ display: 'flex', alignItems: 'center', gap: '0.55rem' }}>
                      <span style={{ fontSize: '1rem', color: w.done ? 'var(--gold)' : draftLabels[w.id]?.trim() ? 'rgba(245,200,66,0.5)' : 'rgba(255,255,255,0.22)', flexShrink: 0 }}>✦</span>
                      <input
                        className="wgc-wish-input"
                        value={draftLabels[w.id] ?? ''}
                        onChange={e => setDraftLabels(prev => ({ ...prev, [w.id]: e.target.value }))}
                        placeholder={`Wish ${w.position}…`}
                        onKeyDown={e => { if (e.key === 'Enter') closeEdit(true) }}
                      />
                    </div>
                  ))}
                </div>
                <div style={{ padding: '0.5rem 0.85rem 0.75rem', display: 'flex', gap: '0.45rem', position: 'relative', zIndex: 3, borderTop: '1px solid rgba(245,200,66,0.08)' }}>
                  <button type="button" onClick={() => closeEdit(false)} disabled={isSaving} style={{ flex: '0 0 72px', padding: '0.5rem 0', borderRadius: 8, background: 'transparent', color: 'var(--text-muted)', fontSize: '0.9rem', border: '1px solid rgba(255,255,255,0.08)', cursor: 'pointer' }}>
                    Cancel
                  </button>
                  <button type="button" onClick={() => closeEdit(true)} disabled={isSaving} style={{ flex: 1, padding: '0.5rem 0', borderRadius: 8, background: 'var(--gold)', color: '#0B0F1A', fontWeight: 700, fontSize: '0.9rem', border: 'none', cursor: isSaving ? 'wait' : 'pointer', opacity: isSaving ? 0.7 : 1 }}>
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
