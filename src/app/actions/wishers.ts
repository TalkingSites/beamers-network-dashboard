'use server'

import { revalidatePath } from 'next/cache'
import { redirect } from 'next/navigation'
import { getWizard } from '@/lib/wizard'
import { prisma } from '@/lib/prisma'

export async function createWisher(formData: FormData) {
  const wizard = await getWizard()
  const name = (formData.get('name') as string).trim()
  const email = (formData.get('email') as string)?.trim() || null

  const wisher = await prisma.wisher.create({
    data: {
      name,
      email,
      wizardId: wizard.id,
      wishes: { create: [{ position: 1 }, { position: 2 }, { position: 3 }] },
    },
  })

  revalidatePath('/wishers')
  redirect(`/wishers/${wisher.id}`)
}

export async function updateWisher(formData: FormData) {
  const wizard = await getWizard()
  const id = formData.get('id') as string
  const name = (formData.get('name') as string).trim()
  const email = (formData.get('email') as string)?.trim() || null
  const notes = (formData.get('notes') as string)?.trim() || null

  const existing = await prisma.wisher.findFirst({ where: { id, wizardId: wizard.id } })
  if (!existing) throw new Error('Unauthorized')

  await prisma.wisher.update({ where: { id }, data: { name, email, notes } })

  revalidatePath(`/wishers/${id}`)
  revalidatePath('/wishers')
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
