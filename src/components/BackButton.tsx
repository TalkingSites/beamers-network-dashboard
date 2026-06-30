"use client";

import { useRouter, usePathname } from "next/navigation";

export function BackButton() {
  const router = useRouter();
  const pathname = usePathname();

  if (pathname === "/") return null;

  return (
    <button
      onClick={() => router.back()}
      style={{
        position: "fixed",
        top: "1.5rem",
        right: "calc(1.75rem + 44px + 0.5rem)",
        zIndex: 100,
        width: 44,
        height: 44,
        borderRadius: "50%",
        background: "var(--bg-surface)",
        border: "1px solid var(--gold-border)",
        color: "var(--text-secondary)",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        cursor: "pointer",
        transition: "background 0.2s, color 0.2s, box-shadow 0.2s",
      }}
      onMouseEnter={e => {
        (e.currentTarget as HTMLButtonElement).style.background = "var(--bg-card-hover)";
        (e.currentTarget as HTMLButtonElement).style.color = "var(--text-primary)";
        (e.currentTarget as HTMLButtonElement).style.boxShadow = "0 0 20px rgba(245,200,66,0.15)";
      }}
      onMouseLeave={e => {
        (e.currentTarget as HTMLButtonElement).style.background = "var(--bg-surface)";
        (e.currentTarget as HTMLButtonElement).style.color = "var(--text-secondary)";
        (e.currentTarget as HTMLButtonElement).style.boxShadow = "none";
      }}
      aria-label="Go back"
    >
      <i className="bi bi-arrow-left" style={{ fontSize: "1.1rem" }} />
    </button>
  );
}
