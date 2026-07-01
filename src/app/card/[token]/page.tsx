import { notFound } from 'next/navigation'
import { prisma } from '@/lib/prisma'

export default async function PublicCardPage({ params }: { params: Promise<{ token: string }> }) {
  const { token } = await params

  const wisher = await prisma.wisher.findUnique({
    where: { shareToken: token },
    include: {
      wishes: { orderBy: { position: 'asc' } },
      wizard: { select: { name: true } },
    },
  })

  if (!wisher) notFound()

  const allDone = wisher.wishes.every(w => w.done)
  const doneCount = wisher.wishes.filter(w => w.done).length

  return (
    <>
      <style>{`
        @keyframes sparkle-a { 0%,100%{opacity:0;transform:scale(0.3) rotate(-20deg)} 40%,58%{opacity:0.9;transform:scale(1) rotate(14deg)} }
        @keyframes sparkle-b { 0%,100%{opacity:0;transform:scale(0.2) rotate(10deg)} 45%,62%{opacity:0.75;transform:scale(0.85) rotate(-9deg)} }
        @keyframes sparkle-c { 0%,18%,100%{opacity:0;transform:scale(0.4) rotate(25deg)} 54%,70%{opacity:1;transform:scale(1.1) rotate(-6deg)} }
        @keyframes sparkle-d { 0%,100%{opacity:0;transform:scale(0.5) rotate(-14deg)} 30%,48%{opacity:0.7;transform:scale(0.88) rotate(20deg)} }
        @keyframes float-up { 0%{transform:translateY(0)} 50%{transform:translateY(-6px)} 100%{transform:translateY(0)} }

        .pub-wrap {
          position: relative;
          z-index: 1;
          min-height: 100vh;
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          padding: 2rem 1rem;
          gap: 0;
        }

        .pub-card {
          position: relative;
          width: min(300px, 88vw);
          aspect-ratio: 5/7;
          background: linear-gradient(160deg, #131d35 0%, #0d1420 100%);
          border: 2px solid var(--gold);
          border-radius: 14px;
          overflow: hidden;
          box-shadow:
            0 0 60px rgba(245,200,66,0.18),
            0 0 120px rgba(245,200,66,0.07),
            0 24px 80px rgba(0,0,0,0.7);
          display: flex;
          flex-direction: column;
          animation: float-up 5s ease-in-out infinite;
        }
        .pub-card::before {
          content: '';
          position: absolute;
          inset: 6px;
          border: 1px solid rgba(245,200,66,0.22);
          border-radius: 10px;
          pointer-events: none;
          z-index: 1;
        }
        .pub-card::after {
          content: '';
          position: absolute;
          top: 0; left: -100%;
          width: 60%; height: 100%;
          background: linear-gradient(105deg, transparent, rgba(255,255,255,0.05), transparent);
          transform: skewX(-15deg);
          animation: shimmer 6s ease-in-out infinite 2s;
          pointer-events: none;
          z-index: 2;
        }
        @keyframes shimmer { 0%,70%,100%{left:-100%} 35%{left:160%} }

        .pub-card-header {
          padding: 0.75rem 1.5rem 0.6rem;
          font-size: 0.65rem;
          font-weight: 600;
          letter-spacing: 0.14em;
          text-transform: uppercase;
          color: rgba(245,200,66,0.45);
          text-align: center;
          border-bottom: 1px solid rgba(245,200,66,0.12);
          position: relative;
          z-index: 3;
        }
        .pub-card-name {
          padding: 1rem 1rem 0.85rem;
          font-size: 2.1rem;
          font-weight: 700;
          font-family: var(--font-dancing-script);
          color: var(--text-primary);
          text-align: center;
          border-bottom: 1px solid rgba(245,200,66,0.18);
          position: relative;
          z-index: 3;
          line-height: 1.2;
        }
        .pub-card-art {
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 0.6rem;
          padding: 1.1rem 0.75rem;
          background: linear-gradient(135deg, #060c1a, #0e1828, #060c1a);
          border-bottom: 1px solid rgba(245,200,66,0.18);
          position: relative;
          z-index: 3;
        }
        .pub-sparkle { font-size: 2.6rem; color: rgba(255,255,255,0.1); }
        .pub-sparkle.done {
          color: var(--gold);
          filter: drop-shadow(0 0 10px rgba(245,200,66,0.7));
        }
        .pub-card-wishes {
          padding: 0.85rem 1rem;
          display: flex;
          flex-direction: column;
          gap: 0.5rem;
          flex: 1;
          position: relative;
          z-index: 3;
        }
        .pub-wish-row {
          display: flex;
          align-items: flex-start;
          gap: 0.5rem;
        }
        .pub-wish-dot {
          font-size: 0.95rem;
          flex-shrink: 0;
          margin-top: 2px;
        }
        .pub-wish-label {
          font-size: 0.95rem;
          line-height: 1.4;
        }
        .pub-card-footer {
          padding: 0.6rem 1rem 0.75rem;
          font-size: 0.72rem;
          color: rgba(245,200,66,0.35);
          text-align: center;
          border-top: 1px solid rgba(245,200,66,0.12);
          position: relative;
          z-index: 3;
          font-family: var(--font-cormorant);
          letter-spacing: 0.04em;
        }

        .pub-meta {
          margin-top: 1.75rem;
          text-align: center;
          display: flex;
          flex-direction: column;
          align-items: center;
          gap: 0.3rem;
        }
        .pub-brand {
          font-size: 0.72rem;
          font-weight: 600;
          letter-spacing: 0.12em;
          text-transform: uppercase;
          color: rgba(245,200,66,0.35);
        }
        .pub-wizard {
          font-size: 0.88rem;
          color: var(--text-muted);
        }
        .pub-progress {
          font-size: 0.8rem;
          color: ${allDone ? 'var(--gold)' : 'var(--text-muted)'};
          font-weight: ${allDone ? '600' : '400'};
          margin-top: 0.2rem;
        }

        /* floating ambient sparkles */
        .amb { position: fixed; pointer-events: none; color: var(--gold); font-size: 0.9rem; opacity: 0; }
        .amb-1 { top: 12%; left: 8%;  animation: sparkle-a 3.2s ease-in-out infinite 0.3s; }
        .amb-2 { top: 25%; right: 10%; animation: sparkle-b 4.8s ease-in-out infinite 1.5s; }
        .amb-3 { top: 65%; left: 6%;  animation: sparkle-c 3.8s ease-in-out infinite 2.1s; }
        .amb-4 { bottom: 20%; right: 8%; animation: sparkle-d 5.2s ease-in-out infinite 0.8s; }
        .amb-5 { top: 45%; left: 18%; animation: sparkle-a 2.9s ease-in-out infinite 3.4s; }
        .amb-6 { bottom: 35%; right: 18%; animation: sparkle-b 4.1s ease-in-out infinite 1.1s; }
      `}</style>

      {/* Ambient sparkles */}
      <span className="amb amb-1">✦</span>
      <span className="amb amb-2">✦</span>
      <span className="amb amb-3">✦</span>
      <span className="amb amb-4">✦</span>
      <span className="amb amb-5">✦</span>
      <span className="amb amb-6">✦</span>

      <div className="pub-wrap">
        <div className="pub-card">
          <div className="pub-card-header">Beamers Network</div>

          <div className="pub-card-name">{wisher.name}</div>

          <div className="pub-card-art">
            {wisher.wishes.map(w => (
              <i key={w.id} className={`bi bi-stars pub-sparkle${w.done ? ' done' : ''}`} />
            ))}
          </div>

          <div className="pub-card-wishes">
            {wisher.wishes.map(w => (
              <div key={w.id} className="pub-wish-row">
                <span
                  className="pub-wish-dot"
                  style={{ color: w.done ? 'var(--gold)' : 'rgba(255,255,255,0.12)' }}
                >
                  ✦
                </span>
                <span
                  className="pub-wish-label"
                  style={{
                    color: w.done ? 'var(--text-secondary)' : 'rgba(255,255,255,0.18)',
                    textDecoration: w.done ? 'line-through' : 'none',
                    textDecorationColor: 'rgba(155,163,192,0.35)',
                  }}
                >
                  {w.label}
                </span>
              </div>
            ))}
          </div>

          <div className="pub-card-footer">
            Enchanted by {wisher.wizard.name}
          </div>
        </div>

        <div className="pub-meta">
          <span className="pub-progress">
            {allDone
              ? '✦ All three wishes granted ✦'
              : `${doneCount} of 3 wishes granted`}
          </span>
          <span className="pub-wizard" style={{ marginTop: '0.15rem' }}>
            Your wizard: <strong style={{ color: 'var(--text-primary)' }}>{wisher.wizard.name}</strong>
          </span>
          <span className="pub-brand" style={{ marginTop: '0.5rem' }}>
            beamers.network
          </span>
        </div>
      </div>
    </>
  )
}
