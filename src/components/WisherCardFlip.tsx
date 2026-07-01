'use client'

import { useState } from 'react'

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

  const handleShare = async () => {
    if (typeof navigator !== 'undefined' && navigator.share) {
      try {
        await navigator.share({ title: `${name}'s Wish Card`, url: shareUrl })
      } catch {
        // user cancelled — that's fine
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
        .card-flip-scene { perspective: 900px; width: 220px; }
        .card-flip-inner {
          position: relative;
          width: 220px;
          aspect-ratio: 5/7;
          transform-style: preserve-3d;
          transition: transform 0.65s cubic-bezier(0.4, 0, 0.2, 1);
        }
        .card-flip-inner.flipped { transform: rotateY(180deg); }
        .card-face {
          position: absolute;
          inset: 0;
          backface-visibility: hidden;
          -webkit-backface-visibility: hidden;
          border-radius: 10px;
          overflow: hidden;
        }
        .card-back-face { transform: rotateY(180deg); }

        /* Front — MTG wisher card styles */
        .flip-front {
          background: linear-gradient(160deg, #131d35 0%, #0d1420 100%);
          border: 2px solid var(--gold);
          display: flex;
          flex-direction: column;
        }
        .flip-front::before {
          content: '';
          position: absolute;
          inset: 5px;
          border: 1px solid rgba(245,200,66,0.22);
          border-radius: 6px;
          pointer-events: none;
          z-index: 1;
        }
        .flip-card-name {
          padding: 0.75rem 0.5rem 0.6rem;
          font-size: 1.35rem;
          font-weight: 700;
          font-family: var(--font-dancing-script);
          color: var(--text-primary);
          text-align: center;
          border-bottom: 1px solid rgba(245,200,66,0.2);
          position: relative;
          z-index: 3;
          line-height: 1.25;
        }
        .flip-card-art {
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 0.3rem;
          padding: 0.75rem 0.4rem;
          background: linear-gradient(135deg, #070e1e, #101a30, #070e1e);
          border-bottom: 1px solid rgba(245,200,66,0.2);
          position: relative;
          z-index: 3;
        }
        .flip-sparkle { font-size: 1.6rem; color: rgba(255,255,255,0.12); }
        .flip-sparkle.done { color: var(--gold); filter: drop-shadow(0 0 5px rgba(245,200,66,0.55)); }
        .flip-card-body {
          padding: 0.5rem 0.6rem;
          display: flex;
          flex-direction: column;
          gap: 0.3rem;
          flex: 1;
          position: relative;
          z-index: 3;
        }
        .flip-card-icons {
          position: absolute;
          bottom: 0.55rem;
          left: 0.55rem;
          z-index: 10;
          display: flex;
          gap: 0.35rem;
        }
        .flip-icon-btn {
          width: 28px;
          height: 28px;
          border-radius: 6px;
          background: rgba(245,200,66,0.1);
          border: 1px solid rgba(245,200,66,0.25);
          color: rgba(245,200,66,0.6);
          display: flex;
          align-items: center;
          justify-content: center;
          cursor: pointer;
          font-size: 0.8rem;
          transition: background 0.15s, color 0.15s, border-color 0.15s;
          padding: 0;
        }
        .flip-icon-btn:hover {
          background: rgba(245,200,66,0.18);
          color: var(--gold);
          border-color: rgba(245,200,66,0.5);
        }

        /* Back — QR side */
        .flip-back {
          background: linear-gradient(160deg, #0d1420 0%, #0a0f1c 100%);
          border: 2px solid var(--gold);
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          gap: 0.6rem;
          padding: 1rem 0.75rem;
        }
        .flip-back::before {
          content: '';
          position: absolute;
          inset: 5px;
          border: 1px solid rgba(245,200,66,0.18);
          border-radius: 6px;
          pointer-events: none;
          z-index: 1;
        }
        .flip-back-label {
          font-size: 0.65rem;
          font-weight: 600;
          letter-spacing: 0.12em;
          text-transform: uppercase;
          color: rgba(245,200,66,0.5);
          position: relative;
          z-index: 2;
        }
        .flip-qr-img {
          border-radius: 6px;
          display: block;
          position: relative;
          z-index: 2;
        }
        .flip-back-url {
          font-size: 0.6rem;
          color: rgba(245,200,66,0.35);
          text-align: center;
          word-break: break-all;
          position: relative;
          z-index: 2;
          line-height: 1.4;
        }
        .flip-back-close {
          position: absolute;
          bottom: 0.55rem;
          right: 0.55rem;
          z-index: 10;
          width: 28px;
          height: 28px;
          border-radius: 6px;
          background: rgba(245,200,66,0.08);
          border: 1px solid rgba(245,200,66,0.2);
          color: rgba(245,200,66,0.5);
          display: flex;
          align-items: center;
          justify-content: center;
          cursor: pointer;
          font-size: 0.8rem;
          transition: background 0.15s, color 0.15s;
          padding: 0;
        }
        .flip-back-close:hover { background: rgba(245,200,66,0.16); color: var(--gold); }

        .copied-toast {
          position: absolute;
          bottom: calc(100% + 0.5rem);
          left: 50%;
          transform: translateX(-50%);
          background: var(--bg-surface);
          border: 1px solid var(--gold-border);
          color: var(--gold);
          font-size: 0.78rem;
          padding: 0.3rem 0.7rem;
          border-radius: 6px;
          white-space: nowrap;
          pointer-events: none;
        }
      `}</style>

      <div className="card-flip-scene" style={{ position: 'relative' }}>
        {copied && <div className="copied-toast">Link copied!</div>}

        <div className={`card-flip-inner${flipped ? ' flipped' : ''}`}>

          {/* ── Front ── */}
          <div className="card-face flip-front">
            <div className="flip-card-name">{name}</div>
            <div className="flip-card-art">
              {wishes.map(w => (
                <i key={w.id} className={`bi bi-stars flip-sparkle${w.done ? ' done' : ''}`} />
              ))}
            </div>
            <div className="flip-card-body">
              {wishes.map(w => (
                <div key={w.id} style={{ display: 'flex', alignItems: 'flex-start', gap: '0.4rem' }}>
                  <span style={{
                    fontSize: '0.85rem',
                    color: w.done ? 'var(--gold)' : 'rgba(255,255,255,0.12)',
                    flexShrink: 0,
                    marginTop: '2px',
                  }}>✦</span>
                  <span style={{
                    fontSize: '0.78rem',
                    color: w.done ? 'var(--text-secondary)' : 'rgba(255,255,255,0.12)',
                    lineHeight: 1.4,
                    textDecoration: w.done ? 'line-through' : 'none',
                    textDecorationColor: 'rgba(155,163,192,0.35)',
                  }}>
                    {w.label}
                  </span>
                </div>
              ))}
            </div>

            {/* Bottom-left icons */}
            <div className="flip-card-icons">
              <button
                className="flip-icon-btn"
                onClick={() => setFlipped(true)}
                title="Show QR code"
                type="button"
              >
                <i className="bi bi-qr-code" />
              </button>
              <button
                className="flip-icon-btn"
                onClick={handleShare}
                title={copied ? 'Copied!' : 'Share card link'}
                type="button"
              >
                <i className={`bi bi-${copied ? 'check2' : 'share'}`} />
              </button>
            </div>
          </div>

          {/* ── Back (QR) ── */}
          <div className="card-face card-back-face flip-back">
            <span className="flip-back-label">Scan to open</span>
            <img
              src={qrDataUrl}
              alt="QR code"
              width={140}
              height={140}
              className="flip-qr-img"
            />
            <span className="flip-back-url">{publicUrl}</span>

            <button
              className="flip-back-close"
              onClick={() => setFlipped(false)}
              title="Flip back"
              type="button"
            >
              <i className="bi bi-arrow-counterclockwise" />
            </button>
          </div>

        </div>
      </div>
    </>
  )
}
