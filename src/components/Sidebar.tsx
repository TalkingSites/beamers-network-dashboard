"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

const navItems = [
  { href: "/",          label: "Overview",   icon: "bi-house-door"    },
  { href: "/clients",   label: "Wishers",    icon: "bi-people"        },
  { href: "/retainers", label: "Retainers",  icon: "bi-arrow-repeat"  },
  { href: "/profile",   label: "My Profile", icon: "bi-person-circle" },
  { href: "/kit",       label: "Beamer Kit", icon: "bi-box-seam"      },
  { href: "/meetups",   label: "Meetups",    icon: "bi-calendar-event"},
];

export function Sidebar() {
  const pathname = usePathname();

  return (
    <aside
      style={{
        width: 240,
        flexShrink: 0,
        backgroundColor: "var(--bg-surface)",
        borderRight: "1px solid var(--border)",
        display: "flex",
        flexDirection: "column",
        padding: "1.5rem 1rem",
        gap: "0.25rem",
      }}
    >
      {/* Logo */}
      <div
        style={{
          fontFamily: "Georgia, serif",
          fontWeight: 700,
          fontSize: "1rem",
          color: "var(--gold)",
          letterSpacing: "0.04em",
          paddingLeft: "0.75rem",
          marginBottom: "1.75rem",
        }}
      >
        Beamers Network
      </div>

      {/* Nav */}
      <nav style={{ display: "flex", flexDirection: "column", gap: "0.2rem" }}>
        {navItems.map(({ href, label, icon }) => {
          const isActive =
            href === "/" ? pathname === "/" : pathname.startsWith(href);
          return (
            <Link
              key={href}
              href={href}
              style={{
                display: "flex",
                alignItems: "center",
                gap: "0.65rem",
                padding: "0.55rem 0.75rem",
                borderRadius: 8,
                fontSize: "0.9rem",
                fontWeight: isActive ? 600 : 400,
                color: isActive ? "var(--gold)" : "var(--text-secondary)",
                backgroundColor: isActive ? "var(--gold-dim)" : "transparent",
                transition: "background 0.15s, color 0.15s",
              }}
            >
              <i className={`bi ${icon}`} style={{ fontSize: "1rem", lineHeight: 1 }} />
              {label}
            </Link>
          );
        })}
      </nav>

      {/* Footer */}
      <div
        style={{
          marginTop: "auto",
          paddingLeft: "0.75rem",
          fontSize: "0.78rem",
          color: "var(--text-muted)",
        }}
      >
        Wizard Dashboard
      </div>
    </aside>
  );
}
