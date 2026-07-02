'use client'

import { useRef, useState, useEffect, useActionState } from 'react'
import { useFormStatus } from 'react-dom'
import { useRouter } from 'next/navigation'
import QRCode from 'qrcode'
import { createWisher } from '@/app/actions/wishers'

type Phase = 'idle' | 'entering' | 'form' | 'success' | 'closing'

function SubmitButton() {
  const { pending } = useFormStatus()
  return (
    <button
      type="submit"
      disabled={pending}
      style={{
        flex: 1, padding: '0.55rem 0', borderRadius: 8,
        background: 'var(--gold)', color: '#0B0F1A',
        fontWeight: 700, fontSize: '0.88rem', border: 'none',
        cursor: pending ? 'not-allowed' : 'pointer',
        opacity: pending ? 0.7 : 1, transition: 'opacity 0.15s',
      }}
    >
      {pending ? 'Creating…' : 'Create'}
    </button>
  )
}

export function NewWisherCard({ autoOpen }: { autoOpen?: boolean }) {
  const [phase, setPhase] = useState<Phase>('idle')
  const [cardIn, setCardIn] = useState(false)
  const [fromTransform, setFromTransform] = useState('scale(0.05)')
  const [qrDataUrl, setQrDataUrl] = useState<string | null>(null)
  const [result, formAction] = useActionState(createWisher, null)
  const processedId = useRef<string | null>(null)

  const nameRef = useRef<HTMLInputElement>(null)
  const triggerRef = useRef<HTMLButtonElement>(null)
  const timers = useRef<ReturnType<typeof setTimeout>[]>([])
  const rafRef = useRef<number | null>(null)
  const router = useRouter()

  const clear = () => {
    timers.current.forEach(clearTimeout)
    timers.current = []
    if (rafRef.current !== null) { cancelAnimationFrame(rafRef.current); rafRef.current = null }
  }

  const measureFromTransform = () => {
    if (!triggerRef.current) return 'scale(0.05)'
    const rect = triggerRef.current.getBoundingClientRect()
    const dx = (rect.left + rect.width / 2) - window.innerWidth / 2
    const dy = (rect.top + rect.height / 2) - window.innerHeight / 2
    const cardWidth = Math.min(400, window.innerWidth * 0.9)
    const scale = rect.width / cardWidth
    return `translateX(${dx}px) translateY(${dy}px) scale(${scale})`
  }

  const open = () => {
    clear()
    setFromTransform(measureFromTransform())
    setCardIn(false)
    setPhase('entering')
    rafRef.current = requestAnimationFrame(() => {
      rafRef.current = requestAnimationFrame(() => {
        setCardIn(true)
        setPhase('form')
        rafRef.current = null
      })
    })
  }

  const close = () => {
    clear()
    setFromTransform(measureFromTransform())
    setCardIn(false)
    setPhase('closing')
    timers.current.push(setTimeout(() => setPhase('idle'), 300))
  }

  // Handle successful creation — generate QR and flip to success face
  useEffect(() => {
    if (!result || processedId.current === result.id) return
    processedId.current = result.id
    const url = `${window.location.origin}/card/${result.shareToken}`
    QRCode.toDataURL(url, { color: { dark: '#F5C842', light: '#0d1420' }, margin: 1, width: 200 })
      .then(dataUrl => {
        setQrDataUrl(dataUrl)
        setPhase('success') // flips back to front face which now shows the QR
        router.refresh()   // refresh wishers grid so new card appears
      })
  }, [result, router])

  useEffect(() => {
    if (phase === 'form') {
      timers.current.push(setTimeout(() => nameRef.current?.focus(), 700))
    }
  }, [phase])

  // Auto-open on mount (used by the "New punch card" quick action via ?new=1)
  useEffect(() => {
    if (autoOpen) {
      timers.current.push(setTimeout(() => open(), 400))
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  useEffect(() => () => clear(), [])

  const isOpen = phase !== 'idle'
  const isFlipped = phase === 'form'
  const isSuccess = phase === 'success'

  return (
    <>
      <style>{`
        .nwc-trigger {
          all: unset; box-sizing: border-box; cursor: pointer;
          display: flex; flex-direction: column;
          width: 100%; aspect-ratio: 5/7; position: relative;
          background: transparent; border: 2px dashed rgba(245,200,66,0.28);
          border-radius: 10px; overflow: hidden;
          transition: border-color 0.3s, box-shadow 0.3s, transform 0.3s;
        }
        .nwc-trigger:hover {
          border-color: rgba(245,200,66,0.65);
          box-shadow: 0 16px 50px rgba(245,200,66,0.15), 0 0 40px rgba(245,200,66,0.06);
          transform: perspective(700px) rotateY(-4deg) rotateX(2deg) scale(1.04);
        }
        .nwc-backdrop {
          position: fixed; inset: 0; z-index: 500;
          background: rgba(5,9,20,0.88); backdrop-filter: blur(6px);
          animation: nwc-bd-in 0.28s ease forwards;
        }
        .nwc-backdrop.closing { animation: nwc-bd-out 0.24s ease forwards; }
        @keyframes nwc-bd-in  { from { opacity: 0 } to { opacity: 1 } }
        @keyframes nwc-bd-out { from { opacity: 1 } to { opacity: 0 } }
        .nwc-card-layer {
          position: fixed; inset: 0; z-index: 501;
          display: flex; align-items: center; justify-content: center;
          pointer-events: none;
        }
        .nwc-zoom { perspective: 1200px; pointer-events: auto; }
        .nwc-flip {
          width: min(400px, 90vw); aspect-ratio: 5/7; position: relative;
          transform-style: preserve-3d;
          transition: transform 0.65s cubic-bezier(0.4, 0, 0.2, 1);
        }
        .nwc-face {
          position: absolute; inset: 0; backface-visibility: hidden;
          -webkit-backface-visibility: hidden; border-radius: 12px; overflow: hidden;
        }
        .nwc-back-face { transform: rotateY(180deg); }
        .nwc-card-shell {
          width: 100%; height: 100%;
          background: linear-gradient(160deg, #131d35 0%, #0d1420 100%);
          border: 2px solid var(--gold); border-radius: 12px;
          display: flex; flex-direction: column; position: relative;
          box-shadow: 0 0 40px rgba(245,200,66,0.12), 0 24px 60px rgba(0,0,0,0.7);
        }
        .nwc-card-shell::before {
          content: ''; position: absolute; inset: 6px;
          border: 1px solid rgba(245,200,66,0.16); border-radius: 8px;
          pointer-events: none; z-index: 1;
        }
        .nwc-idle-pulse { animation: nwc-pulse 2.8s ease-in-out infinite; }
        @keyframes nwc-pulse {
          0%,100% { box-shadow: 0 0 30px rgba(245,200,66,0.10), 0 24px 60px rgba(0,0,0,0.7); }
          50%      { box-shadow: 0 0 55px rgba(245,200,66,0.22), 0 24px 60px rgba(0,0,0,0.7); }
        }
        .nwc-placeholder-line {
          height: 0.85rem; background: rgba(245,200,66,0.06); border-radius: 20px;
          animation: nwc-shimmer 2s ease-in-out infinite;
        }
        @keyframes nwc-shimmer { 0%,100% { opacity: 0.6 } 50% { opacity: 1 } }
        .nwc-form-input {
          width: 100%; background: rgba(255,255,255,0.04);
          border: 1px solid rgba(245,200,66,0.18); border-radius: 6px;
          padding: 0.42rem 0.65rem; color: var(--text-primary);
          font-size: 0.85rem; font-family: inherit; outline: none;
          transition: border-color 0.15s, background 0.15s;
        }
        .nwc-form-input:focus { border-color: rgba(245,200,66,0.45); background: rgba(255,255,255,0.06); }
        .nwc-form-input::placeholder { color: rgba(155,163,192,0.3); }
        .nwc-wish-input {
          flex: 1; background: none; border: none;
          border-bottom: 1px solid rgba(245,200,66,0.12);
          padding: 0.28rem 0.1rem; color: var(--text-primary);
          font-size: 0.82rem; font-family: inherit; outline: none;
          transition: border-color 0.15s;
        }
        .nwc-wish-input:focus { border-bottom-color: rgba(245,200,66,0.38); }
        .nwc-wish-input::placeholder { color: rgba(155,163,192,0.2); }
        .nwc-cancel-btn {
          padding: 0.55rem 0; flex: 0 0 64px; border-radius: 8px;
          background: transparent; color: var(--text-muted);
          font-size: 0.85rem; border: 1px solid rgba(255,255,255,0.08); cursor: pointer;
          transition: border-color 0.15s, color 0.15s;
        }
        .nwc-cancel-btn:hover { border-color: rgba(255,255,255,0.18); color: var(--text-secondary); }
      `}</style>

      {/* Trigger card — hidden while modal is open */}
      <button
        ref={triggerRef}
        className="nwc-trigger"
        onClick={open}
        type="button"
        style={{ opacity: isOpen ? 0 : 1, transition: 'opacity 0.12s ease', pointerEvents: isOpen ? 'none' : 'auto' }}
      >
        <div style={{ padding: '0.9rem 0.6rem', fontSize: '1.5rem', fontWeight: 700, fontFamily: 'var(--font-dancing-script)', color: 'rgba(245,200,66,0.35)', textAlign: 'center', borderBottom: '1px solid rgba(245,200,66,0.1)', lineHeight: 1.3, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          New Wisher
        </div>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.4rem', padding: '0.9rem 0.5rem', background: 'rgba(6,12,26,0.4)', borderBottom: '1px solid rgba(245,200,66,0.1)' }}>
          {[0, 1, 2].map(i => (
            <i key={i} className="bi bi-stars" style={{ fontSize: '2rem', color: 'rgba(255,255,255,0.07)' }} />
          ))}
        </div>
        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', flex: 1, padding: '0.6rem 0.7rem' }}>
          <i className="bi bi-plus-lg" style={{ fontSize: '1.8rem', color: 'rgba(245,200,66,0.32)' }} />
        </div>
      </button>

      {/* Modal */}
      {isOpen && (
        <>
          <div
            className={`nwc-backdrop${phase === 'closing' ? ' closing' : ''}`}
            onClick={close}
          />
          <div className="nwc-card-layer">
            <div
              className="nwc-zoom"
              onClick={e => e.stopPropagation()}
              style={{
                transform: cardIn ? 'translateX(0) translateY(0) scale(1)' : fromTransform,
                transition: cardIn
                  ? 'transform 0.5s cubic-bezier(0.22, 0.61, 0.36, 1)'
                  : phase === 'closing' ? 'transform 0.28s cubic-bezier(0.4, 0, 1, 1)' : 'none',
              }}
            >
              <div
                className="nwc-flip"
                style={{ transform: isFlipped ? 'rotateY(180deg)' : 'rotateY(0deg)' }}
              >

                {/* Front face — blank placeholder or QR success */}
                <div className="nwc-face" style={{ pointerEvents: isFlipped ? 'none' : 'auto' }}>
                  <div className={`nwc-card-shell${isSuccess ? '' : ' nwc-idle-pulse'}`}>
                    {isSuccess && result && qrDataUrl ? (
                      // ── Success: wisher created, show QR ──
                      <>
                        <div style={{ padding: '0.55rem 1rem', fontSize: '0.58rem', fontWeight: 600, letterSpacing: '0.14em', textTransform: 'uppercase', color: 'rgba(245,200,66,0.6)', textAlign: 'center', borderBottom: '1px solid rgba(245,200,66,0.1)', position: 'relative', zIndex: 3 }}>
                          Wish Card Created ✦
                        </div>
                        <div style={{ fontFamily: 'var(--font-dancing-script)', fontSize: '1.45rem', fontWeight: 700, color: 'var(--text-primary)', textAlign: 'center', padding: '0.5rem 0.75rem 0.15rem', position: 'relative', zIndex: 3, lineHeight: 1.2 }}>
                          {result.name}
                        </div>
                        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', flex: 1, position: 'relative', zIndex: 3, padding: '0.25rem' }}>
                          {/* eslint-disable-next-line @next/next/no-img-element */}
                          <img src={qrDataUrl} alt="QR code" width={150} height={150} style={{ borderRadius: 6, display: 'block' }} />
                        </div>
                        <div style={{ padding: '0.4rem 0.75rem 0.75rem', display: 'flex', gap: '0.45rem', position: 'relative', zIndex: 3 }}>
                          <button
                            type="button"
                            onClick={close}
                            style={{ flex: 0, padding: '0.5rem 0.8rem', borderRadius: 8, background: 'transparent', color: 'var(--text-muted)', fontSize: '0.82rem', border: '1px solid rgba(255,255,255,0.08)', cursor: 'pointer', whiteSpace: 'nowrap' }}
                          >
                            Done
                          </button>
                          <a
                            href={`/wishers/${result.id}`}
                            style={{ flex: 1, padding: '0.5rem 0', borderRadius: 8, background: 'var(--gold)', color: '#0B0F1A', fontWeight: 700, fontSize: '0.82rem', textDecoration: 'none', textAlign: 'center', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.3rem' }}
                          >
                            View <i className="bi bi-arrow-right" />
                          </a>
                        </div>
                      </>
                    ) : (
                      // ── Idle front: blank card placeholder ──
                      <>
                        <div style={{ padding: '0.55rem 1rem', fontSize: '0.6rem', fontWeight: 600, letterSpacing: '0.14em', textTransform: 'uppercase', color: 'rgba(245,200,66,0.35)', textAlign: 'center', borderBottom: '1px solid rgba(245,200,66,0.1)', position: 'relative', zIndex: 3 }}>
                          Beamers Network
                        </div>
                        <div style={{ padding: '1rem', borderBottom: '1px solid rgba(245,200,66,0.1)', position: 'relative', zIndex: 3, display: 'flex', alignItems: 'center', justifyContent: 'center', minHeight: '3.5rem' }}>
                          <div className="nwc-placeholder-line" style={{ width: '55%' }} />
                        </div>
                        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.5rem', padding: '1rem 0.75rem', background: 'linear-gradient(135deg, #060c1a, #0e1828, #060c1a)', borderBottom: '1px solid rgba(245,200,66,0.1)', position: 'relative', zIndex: 3 }}>
                          {[0, 1, 2].map(i => (
                            <i key={i} className="bi bi-stars" style={{ fontSize: '2.2rem', color: 'rgba(255,255,255,0.05)' }} />
                          ))}
                        </div>
                        <div style={{ padding: '0.75rem 1rem', display: 'flex', flexDirection: 'column', gap: '0.55rem', flex: 1, position: 'relative', zIndex: 3 }}>
                          {[70, 50, 35].map((w, i) => (
                            <div key={i} style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                              <span style={{ color: 'rgba(255,255,255,0.05)', fontSize: '0.85rem', flexShrink: 0 }}>✦</span>
                              <div className="nwc-placeholder-line" style={{ width: `${w}%`, animationDelay: `${i * 0.2}s` }} />
                            </div>
                          ))}
                        </div>
                        <div style={{ padding: '0.5rem 1rem 0.6rem', fontSize: '0.6rem', color: 'rgba(245,200,66,0.15)', textAlign: 'center', borderTop: '1px solid rgba(245,200,66,0.08)', position: 'relative', zIndex: 3, fontFamily: 'var(--font-cormorant)' }}>
                          Enchanted by &middot;&middot;&middot;
                        </div>
                      </>
                    )}
                  </div>
                </div>

                {/* Back face — form */}
                <div className="nwc-face nwc-back-face" style={{ pointerEvents: isFlipped ? 'auto' : 'none' }}>
                  <div className="nwc-card-shell" style={{ overflow: 'hidden' }}>
                    <form
                      action={formAction}
                      style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem', height: '100%', padding: '1.15rem 1.1rem', position: 'relative', zIndex: 3, overflowY: 'auto' }}
                    >
                      <div>
                        <p style={{ fontFamily: 'Georgia, serif', fontSize: '1.15rem', fontWeight: 700, color: 'var(--text-primary)', margin: '0 0 0.1rem' }}>
                          New Wisher
                        </p>
                        <p style={{ fontSize: '0.68rem', color: 'rgba(245,200,66,0.4)', margin: 0, letterSpacing: '0.04em' }}>
                          Three wishes await
                        </p>
                      </div>

                      <div style={{ display: 'flex', flexDirection: 'column', gap: '0.42rem' }}>
                        <input ref={nameRef} name="name" required placeholder="Name *" className="nwc-form-input" />
                        <input name="email" type="email" placeholder="Email (optional)" className="nwc-form-input" />
                      </div>

                      <div style={{ borderTop: '1px solid rgba(245,200,66,0.1)', paddingTop: '0.45rem' }}>
                        <p style={{ fontSize: '0.6rem', fontWeight: 600, letterSpacing: '0.1em', textTransform: 'uppercase', color: 'rgba(245,200,66,0.35)', margin: '0 0 0.4rem' }}>
                          Wishes (optional)
                        </p>
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.4rem' }}>
                          {[1, 2, 3].map(i => (
                            <div key={i} style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
                              <span style={{ fontSize: '0.72rem', color: 'rgba(245,200,66,0.3)', flexShrink: 0 }}>✦</span>
                              <input name={`wish${i}`} placeholder={`Wish ${i}…`} className="nwc-wish-input" />
                            </div>
                          ))}
                        </div>
                      </div>

                      <div style={{ display: 'flex', gap: '0.5rem', marginTop: 'auto', paddingTop: '0.2rem' }}>
                        <button type="button" onClick={close} className="nwc-cancel-btn">Cancel</button>
                        <SubmitButton />
                      </div>
                    </form>
                  </div>
                </div>

              </div>
            </div>
          </div>
        </>
      )}
    </>
  )
}
