import Link from "next/link";
import { getWizard } from "@/lib/wizard";
import { prisma } from "@/lib/prisma";

export default async function OverviewPage() {
  const wizard = await getWizard();
  const recentWishers = await prisma.wisher.findMany({
    where: { wizardId: wizard.id },
    include: { wishes: { orderBy: { position: 'asc' } } },
    orderBy: { createdAt: 'desc' },
    take: 4,
  });

  const quickActions = [
  {
    icon: "bi-stars",
    label: "New punch card",
    description: "Set up a new digital wish punch card for a wisher",
    href: "/wishers",
    external: false,
  },
  {
    icon: "bi-journal-text",
    label: "Log work",
    description: "Record a session or task for your fortnightly invoice",
    href: "/log",
    external: false,
  },
  {
    icon: "bi-globe2",
    label: "View your profile",
    description: "See your public Beamers page",
    href: `https://beamers.network/wizards/${wizard.slug}`,
    external: true,
  },
  {
    icon: "bi-feather",
    label: "Edit your profile",
    description: "Open a PR on the beamers-network repo",
    href: "https://github.com/electronworkshop/beamers-network",
    external: true,
  },
  {
    icon: "bi-person-vcard",
    label: "Business card",
    description: "Edit and print your Beamer card",
    href: "/kit/card",
    external: false,
  },
  {
    icon: "bi-newspaper",
    label: "Create a flyer",
    description: "Download your printable flyer",
    href: "/kit/flyer",
    external: false,
  },
];


  return (
    <>
      <style>{`
        @keyframes nsp-a { 0%, 100% { opacity: 0; transform: scale(0.3) rotate(-20deg); } 40%, 58% { opacity: 0.95; transform: scale(1) rotate(14deg); } }
        @keyframes nsp-b { 0%, 100% { opacity: 0; transform: scale(0.2) rotate(10deg); } 45%, 62% { opacity: 0.8; transform: scale(0.85) rotate(-9deg); } }
        @keyframes nsp-c { 0%, 18%, 100% { opacity: 0; transform: scale(0.4) rotate(25deg); } 54%, 70% { opacity: 1; transform: scale(1.1) rotate(-6deg); } }
        @keyframes nsp-d { 0%, 100% { opacity: 0; transform: scale(0.5) rotate(-14deg); } 30%, 48% { opacity: 0.72; transform: scale(0.88) rotate(20deg); } }
        @keyframes nsp-e { 0%, 100% { opacity: 0; transform: scale(0.3) rotate(30deg); } 44%, 64% { opacity: 0.9; transform: scale(1) rotate(-13deg); } }
        @keyframes nsp-f { 0%, 100% { opacity: 0; transform: scale(0.25) rotate(-6deg); } 50%, 63% { opacity: 0.82; transform: scale(0.8) rotate(17deg); } }
        .welcome-wrap { position: relative; display: inline-block; }
        .welcome-wrap::before { content: '✦'; position: absolute; font-size: 0.9rem; top: 0.1em; right: -0.2em; color: var(--gold); -webkit-text-fill-color: var(--gold); pointer-events: none; animation: nsp-c 3.3s ease-in-out infinite 1.4s; }
        .welcome-wrap::after { content: '✦'; position: absolute; font-size: 0.6rem; bottom: 0.2em; left: 52%; color: var(--gold); -webkit-text-fill-color: var(--gold); pointer-events: none; animation: nsp-d 5.1s ease-in-out infinite 0.7s; }
        .welcome-heading { font-family: var(--font-cinzel); font-weight: 600; font-size: 2.6rem; letter-spacing: 0.04em; background: linear-gradient(160deg, #FFFFFF 35%, #F5C842 100%); -webkit-background-clip: text; -webkit-text-fill-color: transparent; background-clip: text; text-shadow: 0 0 5px rgba(245,200,66,0.85), 0 0 16px rgba(245,200,66,0.5), 0 0 36px rgba(245,200,66,0.22); position: relative; display: inline; margin: 0; }
        .welcome-heading::before { content: '✦'; position: absolute; font-size: 0.4em; top: -0.52em; left: 2.8em; color: var(--gold); -webkit-text-fill-color: var(--gold); pointer-events: none; animation: nsp-a 2.8s ease-in-out infinite 0.3s; }
        .welcome-heading::after { content: '✦'; position: absolute; font-size: 0.25em; bottom: -0.1em; right: -1.5em; color: var(--gold); -webkit-text-fill-color: var(--gold); pointer-events: none; animation: nsp-b 4.6s ease-in-out infinite 2.1s; }
        .welcome-sparkles { position: absolute; inset: 0; pointer-events: none; overflow: visible; }
        .welcome-sparkles::before { content: '✦'; position: absolute; font-size: 0.32em; top: -0.6em; left: 69%; color: var(--gold); -webkit-text-fill-color: var(--gold); pointer-events: none; animation: nsp-e 3.9s ease-in-out infinite 3.2s; }
        .welcome-sparkles::after { content: '✦'; position: absolute; font-size: 0.22em; bottom: -0.15em; left: 19%; color: var(--gold); -webkit-text-fill-color: var(--gold); pointer-events: none; animation: nsp-f 2.4s ease-in-out infinite 1.7s; }
        .spell-card { position: relative; background: radial-gradient(ellipse 74% 69% at 50% 50%, #f0e6bc 0%, #e8d498 48%, #d0a84a 64%, #8a4818 80%, #461608 92%, #1e0800 100%); text-decoration: none; color: #352808; display: flex; flex-direction: column; align-items: center; justify-content: center; text-align: center; gap: 0.6rem; padding: 1rem 0.7rem; aspect-ratio: 1 / 1.414; transition: transform 0.25s ease, filter 0.25s ease; overflow: hidden; filter: drop-shadow(0 4px 14px rgba(0,0,0,0.55)); }
        .spell-card::before { content: ''; position: absolute; inset: 0; background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='256' height='256'%3E%3Cfilter id='p'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.65 0.7' numOctaves='4' seed='5' stitchTiles='stitch'/%3E%3CfeColorMatrix type='saturate' values='0'/%3E%3C/filter%3E%3Crect width='256' height='256' filter='url(%23p)' opacity='0.22'/%3E%3C/svg%3E"); background-repeat: repeat; background-size: 256px 256px; pointer-events: none; z-index: 0; }
        .spell-card::after { content: ''; position: absolute; inset: 16px; background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 28 28'%3E%3Cpath d='M2 22 L2 2 L22 2' stroke='%23a07838' stroke-width='1.5' fill='none' stroke-linecap='butt'/%3E%3Cpath d='M5 22 L5 5 L22 5' stroke='%23a07838' stroke-width='0.5' fill='none' opacity='0.5'/%3E%3Cpath d='M2 0 L4 2 L2 4 L0 2 Z' fill='%23a07838'/%3E%3Ccircle cx='2' cy='2' r='0.8' fill='%23e6deb8'/%3E%3Cline x1='0' y1='22' x2='5' y2='22' stroke='%23a07838' stroke-width='1' stroke-linecap='butt'/%3E%3Cline x1='22' y1='0' x2='22' y2='5' stroke='%23a07838' stroke-width='1' stroke-linecap='butt'/%3E%3C/svg%3E"), url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 28 28'%3E%3Cpath d='M26 22 L26 2 L6 2' stroke='%23a07838' stroke-width='1.5' fill='none' stroke-linecap='butt'/%3E%3Cpath d='M23 22 L23 5 L6 5' stroke='%23a07838' stroke-width='0.5' fill='none' opacity='0.5'/%3E%3Cpath d='M26 0 L28 2 L26 4 L24 2 Z' fill='%23a07838'/%3E%3Ccircle cx='26' cy='2' r='0.8' fill='%23e6deb8'/%3E%3Cline x1='23' y1='22' x2='28' y2='22' stroke='%23a07838' stroke-width='1' stroke-linecap='butt'/%3E%3Cline x1='6' y1='0' x2='6' y2='5' stroke='%23a07838' stroke-width='1' stroke-linecap='butt'/%3E%3C/svg%3E"), url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 28 28'%3E%3Cpath d='M26 6 L26 26 L6 26' stroke='%23a07838' stroke-width='1.5' fill='none' stroke-linecap='butt'/%3E%3Cpath d='M23 6 L23 23 L6 23' stroke='%23a07838' stroke-width='0.5' fill='none' opacity='0.5'/%3E%3Cpath d='M26 24 L28 26 L26 28 L24 26 Z' fill='%23a07838'/%3E%3Ccircle cx='26' cy='26' r='0.8' fill='%23e6deb8'/%3E%3Cline x1='23' y1='6' x2='28' y2='6' stroke='%23a07838' stroke-width='1' stroke-linecap='butt'/%3E%3Cline x1='6' y1='23' x2='6' y2='28' stroke='%23a07838' stroke-width='1' stroke-linecap='butt'/%3E%3C/svg%3E"), url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 28 28'%3E%3Cpath d='M2 6 L2 26 L22 26' stroke='%23a07838' stroke-width='1.5' fill='none' stroke-linecap='butt'/%3E%3Cpath d='M5 6 L5 23 L22 23' stroke='%23a07838' stroke-width='0.5' fill='none' opacity='0.5'/%3E%3Cpath d='M2 24 L4 26 L2 28 L0 26 Z' fill='%23a07838'/%3E%3Ccircle cx='2' cy='26' r='0.8' fill='%23e6deb8'/%3E%3Cline x1='0' y1='6' x2='5' y2='6' stroke='%23a07838' stroke-width='1' stroke-linecap='butt'/%3E%3Cline x1='22' y1='23' x2='22' y2='28' stroke='%23a07838' stroke-width='1' stroke-linecap='butt'/%3E%3C/svg%3E"); background-repeat: no-repeat; background-position: top left, top right, bottom right, bottom left; background-size: 28px 28px; pointer-events: none; z-index: 0; }
        .spell-card:hover { transform: translateY(-4px) rotate(-0.4deg); filter: drop-shadow(0 12px 28px rgba(0,0,0,0.65)) drop-shadow(0 0 16px rgba(90,40,5,0.15)); text-decoration: none; color: #2a1f04; }
        .col:nth-child(even) .spell-card:hover { transform: translateY(-4px) rotate(0.4deg); }
        .spell-row .col:nth-child(1) .spell-card { clip-path: polygon(0% 2%, 6% 2%, 9% 1%, 15% 2%, 18% 0%, 21% 0%, 23% 2%, 28% 4%, 31% 2%, 33% 0%, 36% 4%, 38% 3%, 42% 2%, 45% 2%, 48% 2%, 50% 2%, 53% 1%, 55% 3%, 59% 3%, 62% 0%, 64% 1%, 67% 1%, 69% 3%, 71% 1%, 73% 2%, 78% 1%, 81% 3%, 84% 1%, 87% 1%, 92% 3%, 94% 0%, 96% 0%, 100% 3%, 96% 0%, 99% 4%, 99% 11%, 97% 14%, 97% 19%, 99% 22%, 99% 25%, 96% 29%, 97% 35%, 98% 38%, 98% 41%, 98% 46%, 97% 50%, 97% 53%, 99% 58%, 99% 64%, 99% 68%, 98% 73%, 98% 77%, 98% 82%, 99% 85%, 98% 90%, 99% 96%, 99% 100%, 100% 98%, 97% 97%, 94% 98%, 91% 96%, 87% 96%, 81% 98%, 79% 99%, 76% 98%, 74% 97%, 69% 97%, 66% 96%, 63% 100%, 61% 99%, 58% 96%, 56% 97%, 54% 98%, 51% 98%, 47% 100%, 44% 98%, 39% 99%, 37% 96%, 33% 96%, 31% 100%, 29% 100%, 25% 100%, 20% 99%, 17% 97%, 12% 98%, 6% 97%, 0% 91%, 2% 85%, 0% 79%, 3% 73%, 1% 68%, 0% 62%, 2% 56%, 0% 50%, 3% 44%, 1% 38%, 0% 32%, 2% 26%, 0% 20%, 3% 14%, 1% 8%, 0% 2%); }
        .spell-row .col:nth-child(2) .spell-card { clip-path: polygon(0% 0%, 3% 0%, 6% 3%, 9% 1%, 13% 4%, 19% 2%, 24% 2%, 28% 3%, 33% 4%, 35% 2%, 37% 4%, 39% 2%, 42% 0%, 45% 0%, 50% 1%, 53% 1%, 56% 1%, 58% 0%, 63% 1%, 67% 2%, 70% 2%, 73% 1%, 76% 2%, 79% 2%, 84% 3%, 86% 1%, 88% 1%, 91% 1%, 94% 0%, 99% 3%, 100% 2%, 100% 0%, 96% 6%, 99% 13%, 97% 16%, 99% 23%, 96% 27%, 97% 30%, 99% 34%, 98% 41%, 98% 44%, 96% 50%, 100% 55%, 97% 58%, 96% 65%, 98% 69%, 96% 76%, 99% 80%, 97% 84%, 96% 89%, 97% 94%, 100% 100%, 100% 97%, 96% 99%, 93% 97%, 91% 99%, 88% 100%, 86% 97%, 84% 97%, 78% 99%, 75% 98%, 70% 99%, 66% 100%, 63% 98%, 60% 99%, 58% 100%, 55% 97%, 49% 98%, 47% 100%, 44% 97%, 42% 100%, 36% 97%, 34% 99%, 32% 99%, 30% 97%, 25% 97%, 22% 99%, 16% 99%, 13% 97%, 8% 100%, 6% 100%, 4% 97%, 0% 91%, 3% 85%, 1% 79%, 0% 73%, 2% 67%, 0% 61%, 3% 54%, 1% 48%, 0% 42%, 2% 36%, 3% 30%, 0% 23%, 2% 17%, 0% 11%, 3% 5%, 0% 0%); }
        .spell-row .col:nth-child(3) .spell-card { clip-path: polygon(0% 1%, 3% 2%, 6% 1%, 8% 1%, 13% 2%, 15% 4%, 21% 1%, 24% 3%, 28% 3%, 31% 1%, 34% 3%, 38% 0%, 40% 2%, 45% 0%, 47% 2%, 51% 4%, 53% 2%, 56% 2%, 58% 1%, 61% 4%, 64% 3%, 70% 2%, 73% 4%, 76% 0%, 78% 1%, 83% 0%, 88% 2%, 91% 1%, 93% 1%, 96% 2%, 99% 4%, 100% 2%, 96% 0%, 97% 6%, 99% 10%, 98% 15%, 98% 18%, 97% 23%, 97% 26%, 99% 29%, 98% 32%, 96% 38%, 99% 42%, 99% 47%, 96% 50%, 99% 57%, 99% 61%, 98% 67%, 98% 71%, 98% 74%, 99% 79%, 100% 84%, 96% 89%, 98% 92%, 100% 96%, 99% 100%, 100% 100%, 95% 98%, 92% 98%, 89% 96%, 86% 99%, 81% 100%, 76% 97%, 74% 98%, 70% 98%, 67% 100%, 64% 98%, 62% 99%, 59% 98%, 53% 99%, 49% 100%, 47% 100%, 43% 98%, 39% 97%, 37% 98%, 35% 97%, 30% 98%, 27% 99%, 24% 100%, 19% 99%, 17% 97%, 14% 99%, 11% 98%, 9% 97%, 5% 99%, 0% 93%, 1% 87%, 3% 81%, 0% 75%, 2% 68%, 0% 62%, 1% 55%, 3% 49%, 0% 43%, 2% 37%, 0% 30%, 3% 24%, 1% 18%, 0% 12%, 2% 6%, 0% 1%); }
        .spell-row .col:nth-child(4) .spell-card { clip-path: polygon(0% 4%, 2% 0%, 5% 1%, 10% 2%, 13% 3%, 16% 3%, 18% 1%, 24% 4%, 26% 2%, 29% 4%, 32% 1%, 35% 2%, 37% 1%, 41% 3%, 47% 3%, 50% 3%, 56% 4%, 59% 2%, 63% 1%, 68% 1%, 71% 2%, 73% 4%, 76% 2%, 78% 1%, 84% 1%, 88% 0%, 90% 4%, 96% 2%, 100% 2%, 99% 0%, 98% 6%, 98% 10%, 96% 13%, 97% 18%, 96% 24%, 97% 27%, 98% 34%, 97% 37%, 97% 43%, 96% 50%, 99% 53%, 99% 58%, 99% 61%, 100% 66%, 99% 73%, 97% 78%, 100% 82%, 96% 87%, 99% 90%, 98% 93%, 98% 99%, 98% 100%, 100% 100%, 95% 100%, 92% 96%, 87% 96%, 83% 98%, 81% 99%, 76% 97%, 73% 98%, 68% 100%, 63% 96%, 58% 98%, 56% 98%, 50% 98%, 47% 98%, 44% 96%, 41% 99%, 38% 100%, 35% 100%, 30% 99%, 26% 100%, 23% 99%, 20% 97%, 14% 98%, 11% 98%, 9% 99%, 6% 99%, 4% 96%, 1% 97%, 0% 91%, 2% 85%, 3% 79%, 0% 73%, 1% 67%, 3% 61%, 0% 55%, 2% 49%, 3% 43%, 0% 37%, 1% 31%, 3% 25%, 0% 19%, 2% 13%, 0% 7%, 1% 4%); }
        .spell-row .col:nth-child(5) .spell-card { clip-path: polygon(0% 1%, 6% 3%, 9% 2%, 11% 3%, 14% 2%, 20% 3%, 23% 2%, 27% 1%, 31% 1%, 35% 2%, 37% 4%, 42% 2%, 45% 1%, 51% 2%, 54% 1%, 57% 1%, 60% 3%, 66% 0%, 69% 1%, 73% 3%, 75% 3%, 78% 1%, 82% 1%, 85% 3%, 91% 0%, 97% 3%, 100% 2%, 100% 0%, 100% 7%, 98% 14%, 99% 19%, 96% 23%, 98% 26%, 99% 31%, 98% 35%, 96% 38%, 96% 41%, 99% 45%, 98% 49%, 98% 55%, 96% 58%, 97% 65%, 99% 71%, 99% 74%, 99% 79%, 99% 82%, 98% 87%, 98% 91%, 98% 96%, 99% 100%, 100% 98%, 98% 99%, 95% 100%, 92% 100%, 89% 97%, 84% 99%, 81% 99%, 76% 98%, 72% 100%, 69% 99%, 63% 98%, 61% 97%, 58% 96%, 56% 99%, 53% 97%, 50% 97%, 47% 97%, 45% 98%, 43% 99%, 37% 99%, 33% 99%, 30% 98%, 27% 99%, 25% 97%, 19% 97%, 15% 99%, 13% 99%, 8% 97%, 6% 99%, 4% 98%, 1% 98%, 0% 90%, 3% 84%, 1% 78%, 0% 72%, 2% 66%, 0% 59%, 3% 53%, 1% 47%, 0% 41%, 2% 35%, 0% 28%, 3% 22%, 1% 16%, 0% 10%, 2% 4%, 0% 1%); }
        .spell-row .col:nth-child(6) .spell-card { clip-path: polygon(0% 3%, 3% 3%, 7% 3%, 10% 1%, 13% 1%, 17% 3%, 20% 3%, 25% 0%, 27% 0%, 30% 3%, 34% 1%, 38% 0%, 43% 3%, 45% 2%, 47% 4%, 49% 4%, 51% 3%, 55% 3%, 57% 1%, 59% 3%, 63% 2%, 67% 2%, 69% 2%, 73% 1%, 75% 3%, 78% 1%, 81% 3%, 85% 2%, 88% 0%, 91% 0%, 93% 4%, 98% 3%, 100% 0%, 99% 0%, 98% 7%, 98% 14%, 100% 18%, 98% 23%, 98% 27%, 97% 33%, 97% 36%, 96% 41%, 99% 46%, 98% 49%, 98% 56%, 99% 61%, 98% 65%, 100% 68%, 96% 72%, 98% 77%, 99% 81%, 98% 86%, 97% 90%, 100% 94%, 99% 98%, 96% 100%, 100% 98%, 95% 99%, 92% 98%, 89% 100%, 83% 100%, 80% 98%, 78% 99%, 75% 100%, 70% 98%, 67% 98%, 65% 96%, 62% 97%, 59% 98%, 56% 99%, 53% 99%, 50% 100%, 47% 97%, 45% 96%, 40% 99%, 37% 99%, 34% 97%, 30% 99%, 27% 99%, 24% 97%, 21% 99%, 16% 99%, 10% 97%, 6% 100%, 2% 99%, 0% 93%, 1% 87%, 3% 81%, 0% 75%, 2% 69%, 1% 62%, 0% 56%, 3% 50%, 0% 43%, 2% 37%, 1% 31%, 3% 25%, 0% 18%, 2% 12%, 0% 6%, 3% 3%); }
        .spell-icon { font-size: 2.2rem; color: #5a4415; position: relative; z-index: 1; opacity: 0.75; }
        .spell-text { display: flex; flex-direction: column; gap: 0.2rem; position: relative; z-index: 1; }
        .spell-label { font-family: var(--font-cormorant); font-size: 1.25rem; font-weight: 700; color: #3a2e08; line-height: 1.2; letter-spacing: 0.01em; display: flex; align-items: center; justify-content: center; gap: 0.2rem; }
        .spell-desc { font-size: 0.82rem; color: rgba(55,40,5,0.55); line-height: 1.4; }
        .spell-external { font-size: 0.7rem; color: #3a2e08; }
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
        .wisher-card-add { border-style: dashed; border-color: rgba(245,200,66,0.3); background: transparent; box-shadow: none; }
        .wisher-card-add::before { border-color: rgba(245,200,66,0.15); }
        .wisher-card-add:hover { border-color: var(--gold); box-shadow: 0 16px 50px rgba(245,200,66,0.22), 0 0 40px rgba(245,200,66,0.08), 0 8px 30px rgba(0,0,0,0.6); transform: perspective(700px) rotateY(-6deg) rotateX(3deg) scale(1.06); }
        .wisher-card-add .wisher-card-art { background: transparent; }
        .section-label { font-size: 0.8rem; font-weight: 600; letter-spacing: 0.1em; text-transform: uppercase; color: var(--text-muted); }
      `}</style>

      {/* Greeting */}
      <div className="mb-5">
        <div className="welcome-wrap">
          <h1 className="welcome-heading">
            Welcome back, {wizard.name.split(" ")[0]}.
            <span className="welcome-sparkles" aria-hidden="true" />
          </h1>
        </div>
        <p className="mb-0 mt-3" style={{ fontSize: "1.15rem", color: "var(--text-secondary)" }}>
          Here&apos;s where things are at.
        </p>
      </div>

      {/* Quick actions */}
      <p className="section-label mb-3">Quick actions</p>
      <div className="row row-cols-2 row-cols-md-3 row-cols-lg-6 g-3 mb-5 spell-row">
        {quickActions.map(({ icon, label, description, href, external }) => (
          <div key={label} className="col">
            <Link
              href={href}
              target={external ? "_blank" : undefined}
              rel={external ? "noopener noreferrer" : undefined}
              className="spell-card"
            >
              <i className={`bi ${icon} spell-icon`} />
              <div className="spell-text">
                <span className="spell-label">
                  {label}{external && <i className="bi bi-arrow-up-right spell-external" />}
                </span>
                <span className="spell-desc">{description}</span>
              </div>
            </Link>
          </div>
        ))}
      </div>

      {/* Recent wishers */}
      <p className="section-label mb-3">Recent wishers</p>
      <div className="row row-cols-2 row-cols-md-3 row-cols-lg-5 g-3">
        {recentWishers.map(w => (
          <div key={w.id} className="col">
            <Link href={`/wishers/${w.id}`} className="wisher-card">
              <div className="wisher-card-name">{w.name}</div>
              <div className="wisher-card-art">
                {w.wishes.map(wish => (
                  <i key={wish.id} className={`bi bi-stars wish-sparkle${wish.done ? " done" : ""}`} />
                ))}
              </div>
              <div className="wisher-card-body">
                {w.wishes.map(wish => (
                  <div key={wish.id} className="d-flex align-items-start gap-2">
                    <span style={{ fontSize: "1rem", color: wish.done ? "var(--gold)" : "rgba(255,255,255,0.12)", marginTop: "2px", flexShrink: 0 }}>✦</span>
                    <span style={{ fontSize: "1.05rem", color: wish.done ? "var(--text-secondary)" : "rgba(255,255,255,0.1)", lineHeight: 1.4 }}>
                      {wish.label ?? "—"}
                    </span>
                  </div>
                ))}
              </div>
            </Link>
          </div>
        ))}
        <div className="col">
          <Link href="/wishers" className="wisher-card wisher-card-add h-100">
            <div className="wisher-card-name" style={{ color: "rgba(245,200,66,0.5)" }}>New Wisher</div>
            <div className="wisher-card-art">
              <i className="bi bi-stars wish-sparkle" />
              <i className="bi bi-stars wish-sparkle" />
              <i className="bi bi-stars wish-sparkle" />
            </div>
            <div className="wisher-card-body" style={{ alignItems: "center", justifyContent: "center" }}>
              <i className="bi bi-plus-lg" style={{ fontSize: "1.8rem", color: "rgba(245,200,66,0.4)" }} />
            </div>
          </Link>
        </div>
      </div>
    </>
  );
}
