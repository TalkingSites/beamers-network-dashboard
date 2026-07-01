import { cache } from "react";
import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";
import { redirect } from "next/navigation";

function slugify(name: string): string {
  return name
    .toLowerCase()
    .replace(/\s+/g, "-")
    .replace(/[^a-z0-9-]/g, "")
    .replace(/-+/g, "-")
    .replace(/^-|-$/g, "");
}

export const getWizard = cache(async () => {
  const session = await auth();
  if (!session?.user?.email) redirect("/login");

  const email = session.user.email;

  let wizard = await prisma.wizard.findUnique({ where: { email } });

  if (!wizard) {
    const name = session.user.name ?? email.split("@")[0];
    let slug = slugify(name);

    const slugTaken = await prisma.wizard.findUnique({ where: { slug } });
    if (slugTaken) slug = `${slug}-${Date.now().toString(36)}`;

    wizard = await prisma.wizard.create({
      data: { email, name, slug },
    });
  }

  return wizard;
});
