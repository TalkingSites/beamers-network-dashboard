'use client'

import { useTransition, useState } from 'react'
import { toggleWish, updateWishLabel } from '@/app/actions/wishers'

type Wish = {
  id: string
  position: number
  label: string | null
  done: boolean
}

export function WishSlot({ wish }: { wish: Wish }) {
  const [done, setDone] = useState(wish.done)
  const [label, setLabel] = useState(wish.label ?? '')
  const [isPending, startTransition] = useTransition()

  const handleToggle = () => {
    const newDone = !done
    setDone(newDone)
    startTransition(() => toggleWish(wish.id, newDone))
  }

  const handleLabelBlur = () => {
    const trimmed = label.trim()
    if (trimmed !== (wish.label ?? '')) {
      startTransition(() => updateWishLabel(wish.id, trimmed))
    }
  }

  return (
    <div
      style={{
        display: 'flex',
        alignItems: 'center',
        gap: '0.75rem',
        padding: '0.85rem 1rem',
        borderRadius: 10,
        background: done ? 'rgba(245,200,66,0.05)' : 'rgba(255,255,255,0.02)',
        border: `1px solid ${done ? 'rgba(245,200,66,0.22)' : 'rgba(255,255,255,0.06)'}`,
        opacity: isPending ? 0.55 : 1,
        transition: 'all 0.2s ease',
      }}
    >
      <button
        onClick={handleToggle}
        type="button"
        disabled={isPending}
        title={done ? 'Mark as not done' : 'Mark as done'}
        style={{
          background: 'none',
          border: 'none',
          cursor: isPending ? 'default' : 'pointer',
          padding: 0,
          flexShrink: 0,
          fontSize: '1.5rem',
          lineHeight: 1,
          color: done ? 'var(--gold)' : 'rgba(255,255,255,0.15)',
          filter: done ? 'drop-shadow(0 0 6px rgba(245,200,66,0.55))' : 'none',
          transition: 'color 0.2s, filter 0.2s',
        }}
      >
        ✦
      </button>

      <span style={{
        fontFamily: 'Georgia, serif',
        fontSize: '0.82rem',
        color: 'var(--text-muted)',
        flexShrink: 0,
        userSelect: 'none',
      }}>
        {wish.position}.
      </span>

      <input
        value={label}
        onChange={e => setLabel(e.target.value)}
        onBlur={handleLabelBlur}
        onKeyDown={e => {
          if (e.key === 'Enter') (e.target as HTMLInputElement).blur()
        }}
        placeholder="What's the wish?"
        style={{
          flex: 1,
          background: 'none',
          border: 'none',
          outline: 'none',
          color: done ? 'var(--text-secondary)' : 'var(--text-primary)',
          fontSize: '1rem',
          fontFamily: 'inherit',
          textDecoration: done ? 'line-through' : 'none',
          textDecorationColor: 'rgba(155,163,192,0.4)',
        }}
      />
    </div>
  )
}
