'use client'

import { useRef, useState, useEffect } from 'react'
import { useFormStatus } from 'react-dom'
import { createWisher } from '@/app/actions/wishers'

type Phase = 'idle' | 'entering' | 'form' | 'closing'

function SubmitButton() {
  const { pending } = useFormStatus()
  return (
    <button
      type="submit"
      disabled={pending}
      style={{
        flex: 1,
        padding: '0.6rem 0',
        borderRadius: 8,
        background: 'var(--gold)',
        color: '#0B0F1A',
        fontWeight: 700,
        fontSize: '0.88rem',
        border: 'none',
        cursor: pending ? 'not-allowed' : 'pointer',
        opacity: pending ? 0.7 : 1,
        transition: 'opacity 0.15s',
      }}
    >
      {pending ? 'Creating…' : 'Create'}
    </button>
  )
}

export function NewWisherCard() {
  const [phase, setPhase] = useState<Phase>('idle')
  const nameRef = useRef<HTMLInputElement>(null)
  const timers = useRef<ReturnType<typeof setTimeout>[]>([])

  const clear = () => { timers.current.forEach(clearTimeout); timers.current = [] }

  const open = () => {
    clear()
    setPhase('entering')
    timers.current.push(setTimeout(() => setPhase('form'), 480))
  }

  const close = () => {
    clear()
    setPhase('closing')
    timers.current.push(setTimeout(() => setPhase('idle'), 220))
  }

  useEffect(() => {
    if (phase === 'form') {
      timers.current.push(setTimeout(() => nameRef.current?.focus(), 720))
    }
  }, [phase])

  useEffect(() => () => clear(), [])

  return (
    <>
      <style>{`
        /* ── Trigger card ── */
        .nwc-trigger {
          all: unset;
          box-sizing: border-box;
          cursor: pointer;
          display: flex;
          flex-direction: column;
          width: 100%;
          aspect-ratio: 5/7;
          position: relative;
          background: transparent;
          border: 2px dashed rgba(245,200,66,0.28);
          border-radius: 10px;
          overflow: hidden;
          transition: border-color 0.3s, box-shadow 0.3s, transform 0.3s;
        }
        .nwc-trigger:hover {
          border-color: rgba(245,200,66,0.65);
          box-shadow: 0 16px 50px rgba(245,200,66,0.15), 0 0 40px rgba(245,200,66,0.06);
          transform: perspective(700px) rotateY(-4deg) rotateX(2deg) scale(1.04);
        }
        .nwc-trigger-name {
          padding: 0.9rem 0.6rem;
          font-size: 1.5rem;
          font-weight: 700;
          font-family: var(--font-dancing-script);
          color: rgba(245,200,66,0.35);
          text-align: center;
          border-bottom: 1px solid rgba(245,200,66,0.1);
          position: relative;
          z-index: 1;
          line-height: 1.3;
          display: flex;
          align-items: center;
          justify-content: center;
        }
        .nwc-trigger-art {
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 0.4rem;
          padding: 0.9rem 0.5rem;
          background: rgba(6,12,26,0.4);
          border-bottom: 1px solid rgba(245,200,66,0.1);
          position: relative;
          z-index: 1;
        }
        .nwc-trigger-body {
          padding: 0.6rem 0.7rem;
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          flex: 1;
          position: relative;
          z-index: 1;
        }

        /* ── Backdrop ── */
        .nwc-backdrop {
          position: fixed;
          inset: 0;
          z-index: 500;
          background: rgba(5, 9, 20, 0.88);
          backdrop-filter: blur(6px);
          display: flex;
          align-items: center;
          justify-content: center;
          animation: nwc-bd-in 0.28s ease forwards;
        }
        .nwc-backdrop.closing { animation: nwc-bd-out 0.22s ease forwards; }
        @keyframes nwc-bd-in  { from { opacity: 0 } to { opacity: 1 } }
        @keyframes nwc-bd-out { from { opacity: 1 } to { opacity: 0 } }

        /* ── Zoom wrapper ── */
        .nwc-zoom { perspective: 1200px; }
        .nwc-zoom.entering { animation: nwc-zoom-in 0.48s cubic-bezier(0.22, 0.61, 0.36, 1) forwards; }
        @keyframes nwc-zoom-in {
          from { transform: scale(0.05); opacity: 0; }
          to   { transform: scale(1);    opacity: 1; }
        }

        /* ── Flip container ── */
        .nwc-flip {
          width: min(300px, 85vw);
          aspect-ratio: 5/7;
          position: relative;
          transform-style: preserve-3d;
          transition: transform 0.65s cubic-bezier(0.4, 0, 0.2, 1);
        }

        /* ── Faces ── */
        .nwc-face {
          position: absolute;
          inset: 0;
          backface-visibility: hidden;
          -webkit-backface-visibility: hidden;
          border-radius: 12px;
          overflow: hidden;
        }
        .nwc-back-face { transform: rotateY(180deg); }

        /* ── Front: blank magical card ── */
        .nwc-front-card {
          width: 100%; height: 100%;
          background: linear-gradient(160deg, #131d35 0%, #0d1420 100%);
          border: 2px solid var(--gold);
          border-radius: 12px;
          display: flex;
          flex-direction: column;
          position: relative;
          box-shadow: 0 0 40px rgba(245,200,66,0.12), 0 24px 60px rgba(0,0,0,0.7);
          animation: nwc-pulse 2.8s ease-in-out infinite;
        }
        .nwc-front-card::before {
          content: '';
          position: absolute;
          inset: 6px;
          border: 1px solid rgba(245,200,66,0.16);
          border-radius: 8px;
          pointer-events: none;
          z-index: 1;
        }
        @keyframes nwc-pulse {
          0%,100% { box-shadow: 0 0 30px rgba(245,200,66,0.10), 0 24px 60px rgba(0,0,0,0.7); }
          50%      { box-shadow: 0 0 55px rgba(245,200,66,0.22), 0 24px 60px rgba(0,0,0,0.7); }
        }
        .nwc-placeholder-line {
          height: 0.85rem;
          background: rgba(245,200,66,0.06);
          border-radius: 20px;
          animation: nwc-shimmer 2s ease-in-out infinite;
        }
        @keyframes nwc-shimmer {
          0%,100% { opacity: 0.6 }
          50%      { opacity: 1   }
        }

        /* ── Back: form card ── */
        .nwc-back-card {
          width: 100%; height: 100%;
          background: linear-gradient(160deg, #131d35 0%, #0d1420 100%);
          border: 2px solid var(--gold);
          border-radius: 12px;
          position: relative;
          box-shadow: 0 0 40px rgba(245,200,66,0.12), 0 24px 60px rgba(0,0,0,0.7);
        }
        .nwc-back-card::before {
          content: '';
          position: absolute;
          inset: 6px;
          border: 1px solid rgba(245,200,66,0.16);
          border-radius: 8px;
          pointer-events: none;
          z-index: 1;
        }
        .nwc-form-input {
          width: 100%;
          background: rgba(255,255,255,0.04);
          border: 1px solid rgba(245,200,66,0.18);
          border-radius: 6px;
          padding: 0.5rem 0.7rem;
          color: var(--text-primary);
          font-size: 0.88rem;
          font-family: inherit;
          outline: none;
          transition: border-color 0.15s, background 0.15s;
        }
        .nwc-form-input:focus {
          border-color: rgba(245,200,66,0.45);
          background: rgba(255,255,255,0.06);
        }
        .nwc-form-input::placeholder { color: rgba(155,163,192,0.3); }
        .nwc-cancel-btn {
          padding: 0.6rem 0;
          flex: 0 0 72px;
          border-radius: 8px;
          background: transparent;
          color: var(--text-muted);
          font-size: 0.88rem;
          border: 1px solid rgba(255,255,255,0.08);
          cursor: pointer;
          transition: border-color 0.15s, color 0.15s;
        }
        .nwc-cancel-btn:hover { border-color: rgba(255,255,255,0.18); color: var(--text-secondary); }
      `}</style>

      {/* ── Trigger card ─────────────────────────────────── */}
      <button className="nwc-trigger" onClick={open} type="button">
        <div className="nwc-trigger-name">New Wisher</div>
        <div className="nwc-trigger-art">
          {[0, 1, 2].map(i => (
            <i key={i} className="bi bi-stars" style={{ fontSize: '2rem', color: 'rgba(255,255,255,0.07)' }} />
          ))}
        </div>
        <div className="nwc-trigger-body">
          <i className="bi bi-plus-lg" style={{ fontSize: '1.8rem', color: 'rgba(245,200,66,0.32)' }} />
        </div>
      </button>

      {/* ── Modal ─────────────────────────────────────────── */}
      {phase !== 'idle' && (
        <div
          className={`nwc-backdrop${phase === 'closing' ? ' closing' : ''}`}
          onClick={close}
        >
          <div
            className={`nwc-zoom${phase === 'entering' ? ' entering' : ''}`}
            onClick={e => e.stopPropagation()}
          >
            <div
              className="nwc-flip"
              style={{ transform: phase === 'form' ? 'rotateY(180deg)' : 'rotateY(0deg)' }}
            >

              {/* Front — blank card zooms in */}
              <div className="nwc-face">
                <div className="nwc-front-card">
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
                    Enchanted by ···
                  </div>
                </div>
              </div>

              {/* Back — form */}
              <div className="nwc-face nwc-back-face">
                <div className="nwc-back-card">
                  <form
                    action={createWisher}
                    style={{ display: 'flex', flexDirection: 'column', gap: '0.8rem', height: '100%', padding: '1.4rem 1.25rem', position: 'relative', zIndex: 3 }}
                  >
                    <div>
                      <p style={{ fontFamily: 'Georgia, serif', fontSize: '1.25rem', fontWeight: 700, color: 'var(--text-primary)', margin: '0 0 0.15rem' }}>
                        New Wisher
                      </p>
                      <p style={{ fontSize: '0.72rem', color: 'rgba(245,200,66,0.4)', margin: 0, letterSpacing: '0.04em' }}>
                        Three wishes await
                      </p>
                    </div>

                    <div style={{ display: 'flex', flexDirection: 'column', gap: '0.65rem', flex: 1 }}>
                      <div style={{ display: 'flex', flexDirection: 'column', gap: '0.3rem' }}>
                        <label style={{ fontSize: '0.72rem', color: 'rgba(245,200,66,0.55)', fontWeight: 600, letterSpacing: '0.06em', textTransform: 'uppercase' }}>
                          Name *
                        </label>
                        <input
                          ref={nameRef}
                          name="name"
                          required
                          placeholder="Sarah Chen"
                          className="nwc-form-input"
                        />
                      </div>
                      <div style={{ display: 'flex', flexDirection: 'column', gap: '0.3rem' }}>
                        <label style={{ fontSize: '0.72rem', color: 'rgba(245,200,66,0.55)', fontWeight: 600, letterSpacing: '0.06em', textTransform: 'uppercase' }}>
                          Email <span style={{ color: 'rgba(155,163,192,0.35)', fontWeight: 400, textTransform: 'none' }}>(optional)</span>
                        </label>
                        <input
                          name="email"
                          type="email"
                          placeholder="sarah@example.com"
                          className="nwc-form-input"
                        />
                      </div>
                    </div>

                    <div style={{ display: 'flex', gap: '0.5rem', paddingTop: '0.25rem' }}>
                      <button type="button" onClick={close} className="nwc-cancel-btn">
                        Cancel
                      </button>
                      <SubmitButton />
                    </div>
                  </form>
                </div>
              </div>

            </div>
          </div>
        </div>
      )}
    </>
  )
}
