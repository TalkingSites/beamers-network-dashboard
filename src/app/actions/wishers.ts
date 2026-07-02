'use server'

import { revalidatePath } from 'next/cache'
import { redirect } from 'next/navigation'
import { getWizard } from '@/lib/wizard'
import { prisma } from '@/lib/prisma'

export async function createWisher(
  _prev: unknown,
  formData: FormData,
): Promise<{ id: string; shareToken: string; name: string }> {
  const wizard = await getWizard()
  const name = (formData.get('name') as string).trim()
  const email = (formData.get('email') as string)?.trim() || null
  const shareToken = crypto.randomUUID()

  const wishes = [1, 2, 3].map(pos => ({
    position: pos,
    label: (formData.get(`wish${pos}`) as string)?.trim() || null,
  }))

  const wisher = await prisma.wisher.create({
    data: {
      name,
      email,
      shareToken,
      wizardId: wizard.id,
      wishes: { create: wishes },
    },
  })

  revalidatePath('/wishers')
  return { id: wisher.id, shareToken, name }
}

export async function updateWisher(id: string, name: string, email: string | null) {
  const wizard = await getWizard()
  const existing = await prisma.wisher.findFirst({ where: { id, wizardId: wizard.id } })
  if (!existing) throw new Error('Unauthorized')

  await prisma.wisher.update({ where: { id }, data: { name: name.trim(), email } })

  revalidatePath(`/wishers/${id}`)
  revalidatePath('/wishers')
}

export async function updateWisherNotes(id: string, notes: string | null) {
  const wizard = await getWizard()
  const existing = await prisma.wisher.findFirst({ where: { id, wizardId: wizard.id } })
  if (!existing) throw new Error('Unauthorized')

  await prisma.wisher.update({ where: { id }, data: { notes } })
  revalidatePath(`/wishers/${id}`)
}

export async function toggleWish(wishId: string, done: boolean) {
  const wizard = await getWizard()
  const wish = await prisma.wish.findFirst({
    where: { id: wishId, wisher: { wizardId: wizard.id } },
  })
  if (!wish) throw new Error('Not found')

  await prisma.wish.update({
    where: { id: wishId },
    data: {
      done,
      completedAt: done && !wish.done ? new Date() : done ? wish.completedAt : null,
    },
  })

  revalidatePath(`/wishers/${wish.wisherId}`)
  revalidatePath('/wishers')
}

export async function updateWishLabel(wishId: string, label: string) {
  const wizard = await getWizard()
  const wish = await prisma.wish.findFirst({
    where: { id: wishId, wisher: { wizardId: wizard.id } },
  })
  if (!wish) throw new Error('Not found')

  await prisma.wish.update({
    where: { id: wishId },
    data: { label: label.trim() || null },
  })

  revalidatePath(`/wishers/${wish.wisherId}`)
  revalidatePath('/wishers')
}

export async function deleteWisher(wisherId: string) {
  const wizard = await getWizard()
  const existing = await prisma.wisher.findFirst({ where: { id: wisherId, wizardId: wizard.id } })
  if (!existing) throw new Error('Unauthorized')

  await prisma.wish.deleteMany({ where: { wisherId } })
  await prisma.wisher.delete({ where: { id: wisherId } })

  revalidatePath('/wishers')
  redirect('/wishers')
}
