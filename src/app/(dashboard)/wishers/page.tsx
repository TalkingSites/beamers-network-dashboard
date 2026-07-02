import { getWizard } from '@/lib/wizard'
import { prisma } from '@/lib/prisma'
import { NewWisherCard } from '@/components/NewWisherCard'
import { WisherGridCard } from '@/components/WisherGridCard'

export default async function WishersPage({
  searchParams,
}: {
  searchParams: Promise<{ new?: string }>
}) {
  const sp = await searchParams
  const autoOpen = sp.new === '1'
  const wizard = await getWizard()
  const wishers = await prisma.wisher.findMany({
    where: { wizardId: wizard.id },
    include: { wishes: { orderBy: { position: 'asc' } } },
    orderBy: { createdAt: 'desc' },
  })

  return (
    <>
      {/* Header */}
      <div className="mb-5">
        <h1 style={{ fontFamily: 'Georgia, serif', fontSize: '2rem', fontWeight: 700, marginBottom: '0.3rem' }}>
          Wishers
        </h1>
        <p style={{ color: 'var(--text-secondary)', fontSize: '0.95rem', margin: 0 }}>
          {wishers.length === 0
            ? 'No wishers yet. Add your first one below.'
            : `${wishers.length} wisher${wishers.length === 1 ? '' : 's'}`}
        </p>
      </div>

      <div className="row row-cols-2 row-cols-md-3 row-cols-lg-5 g-3">
        {wishers.map(w => (
          <div key={w.id} className="col">
            <WisherGridCard
              id={w.id}
              name={w.name}
              shareToken={w.shareToken}
              wishes={w.wishes}
            />
          </div>
        ))}

        {/* New wisher card */}
        <div className="col">
          <NewWisherCard autoOpen={autoOpen} />
        </div>
      </div>
    </>
  )
}
