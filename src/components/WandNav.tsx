"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useRef, useState } from "react";

const navItems = [
  { href: "/",          label: "Overview",   icon: "bi-house-door"    },
  { href: "/clients",   label: "Wishers",    icon: "bi-people"        },
  { href: "/retainers", label: "Retainers",  icon: "bi-arrow-repeat"  },
  { href: "/kit",       label: "Beamer Kit", icon: "bi-box-seam"      },
  { href: "/meetups",   label: "Meetups",    icon: "bi-calendar-event"},
];

export function WandNav() {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);
  const closeTimer = useRef<ReturnType<typeof setTimeout> | null>(null);

  const handleEnter = () => {
    if (closeTimer.current) clearTimeout(closeTimer.current);
    setOpen(true);
  };

  const handleLeave = () => {
    closeTimer.current = setTimeout(() => setOpen(false), 120);
  };

  return (
    <>
      <style>{`
        .wand-nav { position: fixed; top: 1.5rem; right: 1.75rem; z-index: 100; display: flex; flex-direction: column; align-items: flex-end; gap: 0.5rem; pointer-events: none; }
        .wand-trigger { width: 44px; height: 44px; border-radius: 50%; background: var(--bg-surface); border: 1px solid var(--gold-border); display: flex; align-items: center; justify-content: center; transition: background 0.2s, box-shadow 0.2s; cursor: default; pointer-events: auto; }
        .wand-trigger.open { background: var(--gold); box-shadow: 0 0 20px rgba(245,200,66,0.3); }
        .wand-cards { display: flex; flex-direction: column; gap: 0.4rem; align-items: flex-end; }
        .wand-card { display: flex; align-items: center; gap: 0.6rem; padding: 0.55rem 1rem; border-radius: 999px; background: var(--bg-surface); border: 1px solid var(--gold-border); color: var(--text-primary); font-size: 0.88rem; white-space: nowrap; box-shadow: 0 4px 16px rgba(0,0,0,0.4); opacity: 0; transform: translateX(10px) scale(0.96); pointer-events: none; transition: opacity 0.18s ease, transform 0.18s ease; text-decoration: none; }
        .wand-card:hover { background: var(--bg-card-hover); border-color: var(--gold); color: var(--text-primary); }
        .wand-card.active { background: var(--gold); border-color: var(--gold); color: #0B0F1A; font-weight: 600; }
        .wand-card.active:hover { background: var(--gold); color: #0B0F1A; }
        .wand-card.visible { opacity: 1; transform: translateX(0) scale(1); pointer-events: auto; }
        .wand-card.visible:nth-child(1) { transition-delay: 0s; }
        .wand-card.visible:nth-child(2) { transition-delay: 0.04s; }
        .wand-card.visible:nth-child(3) { transition-delay: 0.08s; }
        .wand-card.visible:nth-child(4) { transition-delay: 0.12s; }
        .wand-card.visible:nth-child(5) { transition-delay: 0.16s; }
      `}</style>

      <div className="wand-nav">
        <div
          className={`wand-trigger${open ? " open" : ""}`}
          onMouseEnter={handleEnter}
          onMouseLeave={handleLeave}
        >
          <img src="/wand.svg" alt="" width={24} height={24} style={{ display: "block" }} />
        </div>
        <div
          className="wand-cards"
          style={{ pointerEvents: open ? "auto" : "none" }}
          onMouseEnter={handleEnter}
          onMouseLeave={handleLeave}
        >
          {navItems.map(({ href, label, icon }) => {
            const isActive = href === "/" ? pathname === "/" : pathname.startsWith(href);
            return (
              <Link key={href} href={href} className={`wand-card${isActive ? " active" : ""}${open ? " visible" : ""}`}>
                <i className={`bi ${icon}`} style={{ fontSize: "0.9rem" }} />
                {label}
              </Link>
            );
          })}
        </div>
      </div>
    </>
  );
}
