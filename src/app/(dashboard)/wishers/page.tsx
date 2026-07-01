import Link from 'next/link'
import { getWizard } from '@/lib/wizard'
import { prisma } from '@/lib/prisma'
import { NewWisherCard } from '@/components/NewWisherCard'

export default async function WishersPage() {
  const wizard = await getWizard()
  const wishers = await prisma.wisher.findMany({
    where: { wizardId: wizard.id },
    include: { wishes: { orderBy: { position: 'asc' } } },
    orderBy: { createdAt: 'desc' },
  })

  return (
    <>
      <style>{`
        .wisher-card { position: relative; background: linear-gradient(160deg, #131d35 0%, #0d1420 100%); border: 2px solid var(--gold); border-radius: 10px; text-decoration: none; color: inherit; display: flex; flex-direction: column; overflow: hidden; transition: transform 0.35s ease, box-shadow 0.35s ease; box-shadow: 0 4px 20px rgba(0,0,0,0.5); aspect-ratio: 5/7; }
        .wisher-card::before { content: ''; position: absolute; inset: 5px; border: 1px solid rgba(245,200,66,0.22); border-radius: 6px; pointer-events: none; z-index: 1; }
        .wisher-card::after { content: ''; position: absolute; top: 0; left: -100%; width: 60%; height: 100%; background: linear-gradient(105deg, transparent, rgba(255,255,255,0.07), transparent); transform: skewX(-15deg); transition: left 0.55s ease; pointer-events: none; z-index: 2; }
        .wisher-card:hover { transform: perspective(700px) rotateY(-6deg) rotateX(3deg) scale(1.06); box-shadow: 0 16px 50px rgba(245,200,66,0.22), 0 0 40px rgba(245,200,66,0.08), 0 8px 30px rgba(0,0,0,0.6); text-decoration: none; color: inherit; }
        .wisher-card:hover::after { left: 160%; }
        .wisher-card-name { padding: 0.9rem 0.6rem; min-height: 2.75rem; font-size: 1.6rem; font-weight: 700; font-family: var(--font-dancing-script); color: var(--text-primary); text-align: center; border-bottom: 1px solid rgba(245,200,66,0.2); position: relative; z-index: 3; line-height: 1.3; display: flex; align-items: center; justify-content: center; }
        .wisher-card-art { display: flex; align-items: center; justify-content: center; gap: 0.4rem; padding: 0.9rem 0.5rem; background: linear-gradient(135deg, #070e1e, #101a30, #070e1e); border-bottom: 1px solid rgba(245,200,66,0.2); position: relative; z-index: 3; }
        .wisher-card-body { padding: 0.6rem 0.7rem; display: flex; flex-direction: column; gap: 0.4rem; flex: 1; position: relative; z-index: 3; }
        .wish-sparkle { font-size: 2rem; color: rgba(255,255,255,0.12); }
        .wish-sparkle.done { color: var(--gold); filter: drop-shadow(0 0 6px rgba(245,200,66,0.55)); }
        .section-label { font-size: 0.8rem; font-weight: 600; letter-spacing: 0.1em; text-transform: uppercase; color: var(--text-muted); }
      `}</style>

      {/* Header */}
      <div className="mb-5">
        <h1 style={{ fontFamily: 'Georgia, serif', fontSize: '2rem', fontWeight: 700, marginBottom: '0.3rem' }}>
          Wishers
        </h1>
        <p style={{ color: 'var(--text-secondary)', fontSize: '0.95rem', margin: 0 }}>
          {wishers.length === 0
            ? 'No wishers yet — add your first one below.'
            : `${wishers.length} wisher${wishers.length === 1 ? '' : 's'}`}
        </p>
      </div>

      <div className="row row-cols-2 row-cols-md-3 row-cols-lg-5 g-3">
        {wishers.map(w => (
          <div key={w.id} className="col">
            <Link href={`/wishers/${w.id}`} className="wisher-card">
              <div className="wisher-card-name">{w.name}</div>
              <div className="wisher-card-art">
                {w.wishes.map(wish => (
                  <i
                    key={wish.id}
                    className={`bi bi-stars wish-sparkle${wish.done ? ' done' : ''}`}
                  />
                ))}
              </div>
              <div className="wisher-card-body">
                {w.wishes.map(wish => (
                  <div key={wish.id} className="d-flex align-items-start gap-2">
                    <span style={{
                      fontSize: '1rem',
                      color: wish.done ? 'var(--gold)' : 'rgba(255,255,255,0.12)',
                      marginTop: '2px',
                      flexShrink: 0,
                    }}>
                      ✦
                    </span>
                    <span style={{
                      fontSize: '0.9rem',
                      color: wish.done ? 'var(--text-secondary)' : 'rgba(255,255,255,0.1)',
                      lineHeight: 1.4,
                    }}>
                      {wish.label}
                    </span>
                  </div>
                ))}
              </div>
            </Link>
          </div>
        ))}

        {/* + card */}
        <div className="col">
          <NewWisherCard />
        </div>
      </div>
    </>
  )
}
