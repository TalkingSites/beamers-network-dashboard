'use client'

import { useTransition } from 'react'

type Props = {
  wisherId: string
  wisherName: string
  deleteWisher: (id: string) => Promise<void>
}

export function DeleteWisherButton({ wisherId, wisherName, deleteWisher }: Props) {
  const [isPending, startTransition] = useTransition()

  const handleDelete = () => {
    if (!window.confirm(`Remove ${wisherName} and all their wishes? This can't be undone.`)) return
    startTransition(() => deleteWisher(wisherId))
  }

  return (
    <button
      onClick={handleDelete}
      disabled={isPending}
      style={{
        padding: '0.5rem 1.1rem',
        borderRadius: 8,
        background: 'transparent',
        color: isPending ? 'var(--text-muted)' : '#e05252',
        fontWeight: 500,
        fontSize: '0.88rem',
        border: `1px solid ${isPending ? 'var(--border)' : 'rgba(224,82,82,0.35)'}`,
        cursor: isPending ? 'not-allowed' : 'pointer',
        transition: 'all 0.15s',
      }}
    >
      <i className="bi bi-trash3" style={{ marginRight: '0.4rem' }} />
      {isPending ? 'Removing…' : 'Remove Wisher'}
    </button>
  )
}
