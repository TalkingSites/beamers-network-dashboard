-- CreateTable
CREATE TABLE "Wizard" (
    "id" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "email" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "slug" TEXT NOT NULL,
    "stripeAccountId" TEXT,

    CONSTRAINT "Wizard_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Wisher" (
    "id" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "name" TEXT NOT NULL,
    "email" TEXT,
    "notes" TEXT,
    "wizardId" TEXT NOT NULL,

    CONSTRAINT "Wisher_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Wish" (
    "id" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "position" INTEGER NOT NULL,
    "label" TEXT,
    "done" BOOLEAN NOT NULL DEFAULT false,
    "completedAt" TIMESTAMP(3),
    "wisherId" TEXT NOT NULL,

    CONSTRAINT "Wish_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Client" (
    "id" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "stripeCustomerId" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "email" TEXT,
    "wizardId" TEXT NOT NULL,

    CONSTRAINT "Client_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Retainer" (
    "id" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "stripeSubscriptionId" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "amount" DECIMAL(10,2) NOT NULL,
    "active" BOOLEAN NOT NULL DEFAULT true,
    "wizardId" TEXT NOT NULL,
    "clientId" TEXT NOT NULL,

    CONSTRAINT "Retainer_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Meetup" (
    "id" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "title" TEXT NOT NULL,
    "date" TIMESTAMP(3) NOT NULL,
    "location" TEXT NOT NULL,
    "description" TEXT,
    "url" TEXT,
    "wizardId" TEXT NOT NULL,

    CONSTRAINT "Meetup_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "Wizard_email_key" ON "Wizard"("email");

-- CreateIndex
CREATE UNIQUE INDEX "Wizard_slug_key" ON "Wizard"("slug");

-- CreateIndex
CREATE UNIQUE INDEX "Wizard_stripeAccountId_key" ON "Wizard"("stripeAccountId");

-- CreateIndex
CREATE INDEX "Wisher_wizardId_idx" ON "Wisher"("wizardId");

-- CreateIndex
CREATE INDEX "Wish_wisherId_idx" ON "Wish"("wisherId");

-- CreateIndex
CREATE UNIQUE INDEX "Wish_wisherId_position_key" ON "Wish"("wisherId", "position");

-- CreateIndex
CREATE UNIQUE INDEX "Client_stripeCustomerId_key" ON "Client"("stripeCustomerId");

-- CreateIndex
CREATE INDEX "Client_wizardId_idx" ON "Client"("wizardId");

-- CreateIndex
CREATE UNIQUE INDEX "Retainer_stripeSubscriptionId_key" ON "Retainer"("stripeSubscriptionId");

-- CreateIndex
CREATE INDEX "Retainer_wizardId_idx" ON "Retainer"("wizardId");

-- CreateIndex
CREATE INDEX "Meetup_wizardId_idx" ON "Meetup"("wizardId");

-- AddForeignKey
ALTER TABLE "Wisher" ADD CONSTRAINT "Wisher_wizardId_fkey" FOREIGN KEY ("wizardId") REFERENCES "Wizard"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Wish" ADD CONSTRAINT "Wish_wisherId_fkey" FOREIGN KEY ("wisherId") REFERENCES "Wisher"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Client" ADD CONSTRAINT "Client_wizardId_fkey" FOREIGN KEY ("wizardId") REFERENCES "Wizard"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Retainer" ADD CONSTRAINT "Retainer_wizardId_fkey" FOREIGN KEY ("wizardId") REFERENCES "Wizard"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Retainer" ADD CONSTRAINT "Retainer_clientId_fkey" FOREIGN KEY ("clientId") REFERENCES "Client"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Meetup" ADD CONSTRAINT "Meetup_wizardId_fkey" FOREIGN KEY ("wizardId") REFERENCES "Wizard"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
