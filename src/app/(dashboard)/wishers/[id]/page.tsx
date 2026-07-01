import { notFound } from 'next/navigation'
import { getWizard } from '@/lib/wizard'
import { prisma } from '@/lib/prisma'
import { WishSlot } from '@/components/WishSlot'
import { updateWisher, deleteWisher } from '@/app/actions/wishers'
import { DeleteWisherButton } from '@/components/DeleteWisherButton'

export default async function WisherPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params
  const wizard = await getWizard()

  const wisher = await prisma.wisher.findFirst({
    where: { id, wizardId: wizard.id },
    include: { wishes: { orderBy: { position: 'asc' } } },
  })

  if (!wisher) notFound()

  const allDone = wisher.wishes.every(w => w.done)

  return (
    <>
      <style>{`
        .field-label { font-size: 0.82rem; color: var(--text-secondary); font-weight: 500; margin-bottom: 0.35rem; display: block; }
        .text-input { width: 100%; background: var(--bg-card); border: 1px solid var(--border); border-radius: 8px; padding: 0.6rem 0.85rem; color: var(--text-primary); font-size: 0.95rem; font-family: inherit; outline: none; transition: border-color 0.15s; }
        .text-input:focus { border-color: var(--gold-border); }
        .text-input::placeholder { color: var(--text-muted); }
        .save-btn { padding: 0.5rem 1.1rem; border-radius: 8px; background: var(--gold); color: #0B0F1A; font-weight: 700; font-size: 0.88rem; border: none; cursor: pointer; }
        .save-btn:hover { opacity: 0.88; }
        .divider { border: none; border-top: 1px solid var(--border); margin: 2rem 0; }
      `}</style>

      {/* Name + completion badge */}
      <div className="d-flex align-items-center gap-3 mb-1">
        <h1 style={{
          fontFamily: 'Georgia, serif',
          fontSize: '2.2rem',
          fontWeight: 700,
          margin: 0,
          lineHeight: 1.2,
        }}>
          {wisher.name}
        </h1>
        {allDone && (
          <span style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: '0.35rem',
            padding: '0.3rem 0.75rem',
            borderRadius: 999,
            background: 'rgba(245,200,66,0.12)',
            border: '1px solid rgba(245,200,66,0.3)',
            color: 'var(--gold)',
            fontSize: '0.82rem',
            fontWeight: 600,
          }}>
            <i className="bi bi-check2-circle" /> All wishes granted!
          </span>
        )}
      </div>
      {wisher.email && (
        <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem', marginBottom: '2rem' }}>
          {wisher.email}
        </p>
      )}

      {/* Wishes */}
      <p style={{ fontSize: '0.8rem', fontWeight: 600, letterSpacing: '0.1em', textTransform: 'uppercase', color: 'var(--text-muted)', marginBottom: '0.75rem' }}>
        Three Wishes
      </p>
      <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem', marginBottom: '2.5rem' }}>
        {wisher.wishes.map(wish => (
          <WishSlot key={wish.id} wish={wish} />
        ))}
      </div>

      <hr className="divider" />

      {/* Edit info */}
      <p style={{ fontSize: '0.8rem', fontWeight: 600, letterSpacing: '0.1em', textTransform: 'uppercase', color: 'var(--text-muted)', marginBottom: '1rem' }}>
        Edit Info
      </p>
      <form action={updateWisher} style={{ display: 'flex', flexDirection: 'column', gap: '1rem', maxWidth: 480 }}>
        <input type="hidden" name="id" value={wisher.id} />

        <div>
          <label className="field-label">Name *</label>
          <input
            name="name"
            required
            defaultValue={wisher.name}
            className="text-input"
          />
        </div>

        <div>
          <label className="field-label">
            Email <span style={{ color: 'var(--text-muted)', fontWeight: 400 }}>(optional)</span>
          </label>
          <input
            name="email"
            type="email"
            defaultValue={wisher.email ?? ''}
            className="text-input"
          />
        </div>

        <div>
          <label className="field-label">
            Notes <span style={{ color: 'var(--text-muted)', fontWeight: 400 }}>(optional)</span>
          </label>
          <textarea
            name="notes"
            defaultValue={wisher.notes ?? ''}
            rows={3}
            placeholder="Context, background, anything useful…"
            className="text-input"
            style={{ resize: 'vertical' }}
          />
        </div>

        <div>
          <button type="submit" className="save-btn">Save</button>
        </div>
      </form>

      <hr className="divider" />

      {/* Danger zone */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', flexWrap: 'wrap' }}>
        <button
          disabled
          title="Coming in Phase 4 — Clients"
          style={{
            padding: '0.5rem 1.1rem',
            borderRadius: 8,
            background: 'transparent',
            color: 'var(--text-muted)',
            fontWeight: 500,
            fontSize: '0.88rem',
            border: '1px solid var(--border)',
            cursor: 'not-allowed',
            opacity: 0.5,
          }}
        >
          <i className="bi bi-arrow-up-circle" style={{ marginRight: '0.4rem' }} />
          Convert to Client
        </button>

        <DeleteWisherButton wisherId={wisher.id} wisherName={wisher.name} deleteWisher={deleteWisher} />
      </div>
    </>
  )
}
