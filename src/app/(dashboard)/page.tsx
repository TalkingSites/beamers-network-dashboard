"use client";

import Link from "next/link";

const WIZARD_NAME = "Alex";
const WIZARD_SLUG = "alex";

const quickActions = [
  {
    label: "New punch card",
    description: "Set up a new digital wish punch card for a wisher",
    href: "/clients",
    external: false,
  },
  {
    label: "View your profile",
    description: "See your public Beamers page",
    href: `https://beamers.network/wizards/${WIZARD_SLUG}`,
    external: true,
  },
  {
    label: "Edit your profile",
    description: "Open a PR on the beamers-network repo",
    href: "https://github.com/electronworkshop/beamers-network",
    external: true,
  },
  {
    label: "Business card",
    description: "Edit and print your Beamer card",
    href: "/kit/card",
    external: false,
  },
  {
    label: "Create a flyer",
    description: "Download your printable flyer",
    href: "/kit/flyer",
    external: false,
  },
];

const wishers = [
  {
    name: "Sarah Chen",
    wishes: [
      { label: "Migrate off Squarespace", done: true },
      { label: "Set up email automation", done: true },
      { label: "Train on managing site", done: false },
    ],
  },
  {
    name: "Marcus Webb",
    wishes: [
      { label: "Set up GitHub repo", done: true },
      { label: "Deploy to Netlify", done: false },
      { label: "", done: false },
    ],
  },
  {
    name: "Priya Nair",
    wishes: [
      { label: "Audit current tools", done: false },
      { label: "", done: false },
      { label: "", done: false },
    ],
  },
];

export default function OverviewPage() {
  return (
    <>
      <style>{`
        .action-card { background: var(--bg-card); border: 1px solid var(--border); border-radius: var(--radius); text-decoration: none; color: inherit; transition: border-color 0.15s, background 0.15s; display: flex; flex-direction: column; gap: 0.65rem; }
        .action-card:hover { border-color: var(--gold-border); background: var(--bg-card-hover); color: inherit; }
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
        .section-label { font-size: 0.8rem; font-weight: 600; letter-spacing: 0.1em; text-transform: uppercase; color: var(--text-muted); }
      `}</style>

      {/* Greeting */}
      <div className="mb-5">
        <h1 style={{ fontFamily: "Georgia, serif", fontSize: "2.6rem", fontWeight: 700, color: "var(--text-primary)" }}>
          Welcome back, {WIZARD_NAME}.
        </h1>
        <p className="mb-0" style={{ fontSize: "1.15rem", color: "var(--text-secondary)" }}>
          Here&apos;s where things are at.
        </p>
      </div>

      {/* Quick actions */}
      <p className="section-label mb-3">Quick actions</p>
      <div className="row g-3 mb-5">
        {quickActions.map(({ label, description, href, external }) => (
          <div key={label} className="col-6 col-md-4 col-lg">
            <Link
              href={href}
              target={external ? "_blank" : undefined}
              rel={external ? "noopener noreferrer" : undefined}
              className="action-card p-4 h-100"
            >
              <span style={{ fontSize: "1rem", fontWeight: 600, color: "var(--text-primary)" }}>
                {label}
                {external && <i className="bi bi-arrow-up-right ms-1" style={{ fontSize: "0.8rem", color: "var(--text-secondary)" }} />}
              </span>
              <span style={{ fontSize: "0.9rem", color: "var(--text-secondary)", lineHeight: 1.5 }}>
                {description}
              </span>
            </Link>
          </div>
        ))}
      </div>

      {/* Recent wishers */}
      <p className="section-label mb-3">Recent wishers</p>
      <div className="row row-cols-2 row-cols-md-3 row-cols-lg-5 g-3">
        {wishers.map(({ name, wishes }) => (
          <div key={name} className="col">
            <Link href="/clients" className="wisher-card">
              <div className="wisher-card-name">{name}</div>
              <div className="wisher-card-art">
                {wishes.map((w, i) => (
                  <i key={i} className={`bi bi-stars wish-sparkle${w.done ? " done" : ""}`} />
                ))}
              </div>
              <div className="wisher-card-body">
                {wishes.map((w, i) => (
                  <div key={i} className="d-flex align-items-start gap-2">
                    <span style={{ fontSize: "1rem", color: w.done ? "var(--gold)" : "rgba(255,255,255,0.12)", marginTop: "2px", flexShrink: 0 }}>✦</span>
                    <span style={{ fontSize: "1.05rem", color: w.done ? "var(--text-secondary)" : "rgba(255,255,255,0.1)", lineHeight: 1.4 }}>
                      {w.done ? w.label : "—"}
                    </span>
                  </div>
                ))}
              </div>
            </Link>
          </div>
        ))}
      </div>
    </>
  );
}
