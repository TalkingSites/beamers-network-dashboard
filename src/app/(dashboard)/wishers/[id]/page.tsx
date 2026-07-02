import { notFound } from 'next/navigation'
import QRCode from 'qrcode'
import { getWizard } from '@/lib/wizard'
import { prisma } from '@/lib/prisma'
import { WishSlot } from '@/components/WishSlot'
import { WisherCardFlip } from '@/components/WisherCardFlip'
import { WisherInfo } from '@/components/WisherInfo'
import { deleteWisher } from '@/app/actions/wishers'
import { DeleteWisherButton } from '@/components/DeleteWisherButton'

export default async function WisherPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params
  const wizard = await getWizard()

  let wisher = await prisma.wisher.findFirst({
    where: { id, wizardId: wizard.id },
    include: { wishes: { orderBy: { position: 'asc' } } },
  })

  if (!wisher) notFound()

  if (!wisher.shareToken) {
    wisher = await prisma.wisher.update({
      where: { id },
      data: { shareToken: crypto.randomUUID() },
      include: { wishes: { orderBy: { position: 'asc' } } },
    })
  }

  const baseUrl = process.env.AUTH_URL ?? process.env.NEXTAUTH_URL ?? 'http://localhost:3000'
  const cardUrl = `${baseUrl}/card/${wisher.shareToken}`

  const qrDataUrl = await QRCode.toDataURL(cardUrl, {
    color: { dark: '#F5C842', light: '#0d1420' },
    margin: 1,
    width: 200,
  })

  const allDone = wisher.wishes.every(w => w.done)

  return (
    <div className="row g-5">

      {/* ── Left column ── */}
      <div className="col-12 col-lg-7">

        <WisherInfo
          id={wisher.id}
          name={wisher.name}
          email={wisher.email}
          notes={wisher.notes}
          allDone={allDone}
        />

        <p style={{ fontSize: '0.8rem', fontWeight: 600, letterSpacing: '0.1em', textTransform: 'uppercase', color: 'var(--text-muted)', marginBottom: '0.75rem' }}>
          Three Wishes
        </p>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem', marginBottom: '2.5rem' }}>
          {wisher.wishes.map(wish => (
            <WishSlot key={wish.id} wish={wish} />
          ))}
        </div>

        <hr style={{ border: 'none', borderTop: '1px solid var(--border)', margin: '0 0 1.5rem' }} />

        <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', flexWrap: 'wrap' }}>
          <button
            disabled
            title="Coming in Phase 4 — Clients"
            style={{
              padding: '0.5rem 1.1rem', borderRadius: 8,
              background: 'transparent', color: 'var(--text-muted)',
              fontWeight: 500, fontSize: '0.88rem',
              border: '1px solid var(--border)', cursor: 'not-allowed', opacity: 0.5,
            }}
          >
            <i className="bi bi-arrow-up-circle" style={{ marginRight: '0.4rem' }} />
            Convert to Client
          </button>
          <DeleteWisherButton wisherId={wisher.id} wisherName={wisher.name} deleteWisher={deleteWisher} />
        </div>
      </div>

      {/* ── Right column: card preview ── */}
      <div className="col-12 col-lg-5 d-flex flex-column align-items-center align-items-lg-end" style={{ paddingTop: '0.25rem' }}>
        <p style={{ fontSize: '0.75rem', fontWeight: 600, letterSpacing: '0.1em', textTransform: 'uppercase', color: 'var(--text-muted)', marginBottom: '1rem', alignSelf: 'flex-start' }}>
          Wish Card
        </p>
        <WisherCardFlip
          name={wisher.name}
          wishes={wisher.wishes}
          qrDataUrl={qrDataUrl}
          shareUrl={cardUrl}
          publicUrl={`/card/${wisher.shareToken}`}
        />
        <p style={{ fontSize: '0.75rem', color: 'var(--text-muted)', marginTop: '0.85rem', textAlign: 'center' }}>
          Share this with {wisher.name.split(' ')[0]} so they can see their wishes.
        </p>
      </div>

    </div>
  )
}
