import { signIn, auth } from "@/auth";
import { redirect } from "next/navigation";

export default async function LoginPage() {
  const session = await auth();
  if (session) redirect("/");
  return (
    <>
      <style>{`
        @keyframes nsp-a { 0%, 100% { opacity: 0; transform: scale(0.3) rotate(-20deg); } 40%, 58% { opacity: 0.95; transform: scale(1) rotate(14deg); } }
        @keyframes nsp-b { 0%, 100% { opacity: 0; transform: scale(0.2) rotate(10deg); } 45%, 62% { opacity: 0.8; transform: scale(0.85) rotate(-9deg); } }
        @keyframes nsp-e { 0%, 100% { opacity: 0; transform: scale(0.3) rotate(30deg); } 44%, 64% { opacity: 0.9; transform: scale(1) rotate(-13deg); } }
        @keyframes nsp-f { 0%, 100% { opacity: 0; transform: scale(0.25) rotate(-6deg); } 50%, 63% { opacity: 0.82; transform: scale(0.8) rotate(17deg); } }
        @keyframes tome-glow { 0%, 100% { opacity: 0.55; } 50% { opacity: 1; } }

        .login-wordmark-wrap { position: relative; display: inline-block; }
        .login-wordmark {
          font-family: var(--font-cinzel);
          font-weight: 600;
          font-size: 3.15rem;
          letter-spacing: 0.05em;
          background: linear-gradient(160deg, #FFFFFF 35%, #F5C842 100%);
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
          background-clip: text;
          text-shadow: 0 0 6px rgba(245,200,66,0.85), 0 0 20px rgba(245,200,66,0.5), 0 0 44px rgba(245,200,66,0.22);
          position: relative;
          margin: 0;
          text-align: center;
          line-height: 1.1;
        }
        .login-wordmark::before { content: '✦'; position: absolute; font-size: 0.4em; top: -0.5em; left: 4%; color: var(--gold); -webkit-text-fill-color: var(--gold); pointer-events: none; animation: nsp-a 2.8s ease-in-out infinite 0.3s; }
        .login-wordmark::after { content: '✦'; position: absolute; font-size: 0.28em; bottom: -0.15em; right: 2%; color: var(--gold); -webkit-text-fill-color: var(--gold); pointer-events: none; animation: nsp-b 4.6s ease-in-out infinite 2.1s; }
        .login-wordmark-sparkles { position: absolute; inset: 0; pointer-events: none; }
        .login-wordmark-sparkles::before { content: '✦'; position: absolute; font-size: 0.3em; top: 10%; left: 92%; color: var(--gold); -webkit-text-fill-color: var(--gold); pointer-events: none; animation: nsp-e 3.9s ease-in-out infinite 3.2s; }
        .login-wordmark-sparkles::after { content: '✦'; position: absolute; font-size: 0.22em; bottom: 5%; left: -3%; color: var(--gold); -webkit-text-fill-color: var(--gold); pointer-events: none; animation: nsp-f 2.4s ease-in-out infinite 1.7s; }

        /* Tome (book) login button */
        .login-tome {
          position: relative;
          width: 300px;
          aspect-ratio: 3 / 4;
          border: none;
          border-radius: 3px 12px 12px 3px;
          padding: 0;
          cursor: pointer;
          background: radial-gradient(ellipse 90% 80% at 50% 38%, #7a3818 0%, #55220e 45%, #341407 75%, #190a03 100%);
          box-shadow:
            -5px 2px 0 0 #2c1006,
            -9px 4px 0 0 #1a0a04,
            0 16px 40px rgba(0,0,0,0.65),
            inset 0 0 0 2px rgba(245,200,66,0.45);
          transition: transform 0.25s ease, box-shadow 0.25s ease;
        }
        .login-tome::before {
          content: '';
          position: absolute; inset: 0; border-radius: inherit;
          background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='256' height='256'%3E%3Cfilter id='p'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.7 0.75' numOctaves='4' seed='9' stitchTiles='stitch'/%3E%3CfeColorMatrix type='saturate' values='0'/%3E%3C/filter%3E%3Crect width='256' height='256' filter='url(%23p)' opacity='0.35'/%3E%3C/svg%3E");
          background-repeat: repeat; background-size: 200px 200px; pointer-events: none; mix-blend-mode: overlay;
        }
        .login-tome::after {
          content: '';
          position: absolute; top: 6px; right: -7px; bottom: 6px; width: 7px;
          background: repeating-linear-gradient(to bottom, #efe3ba 0 2px, #cdbb84 2px 3px);
          border-radius: 0 3px 3px 0;
          box-shadow: 2px 0 4px rgba(0,0,0,0.35);
        }
        .login-tome-frame {
          position: absolute; inset: 12px;
          border: 1px solid rgba(245,200,66,0.35);
          border-radius: 2px 9px 9px 2px;
          pointer-events: none;
        }
        .login-tome-frame::before,
        .login-tome-frame::after {
          content: ''; position: absolute; width: 16px; height: 16px;
          border: 1.5px solid rgba(245,200,66,0.7);
        }
        .login-tome-frame::before { top: -1px; left: -1px; border-right: none; border-bottom: none; }
        .login-tome-frame::after { bottom: -1px; right: -1px; border-left: none; border-top: none; }
        .login-tome-content {
          position: relative; height: 100%;
          display: flex; flex-direction: column; align-items: center; justify-content: center; gap: 0.9rem;
        }
        .login-tome-emblem {
          font-size: 2.4rem; color: var(--gold);
          filter: drop-shadow(0 0 10px rgba(245,200,66,0.7));
          animation: tome-glow 2.6s ease-in-out infinite;
        }
        .login-tome-label {
          font-family: var(--font-cinzel);
          font-weight: 600;
          font-size: 1.5rem;
          letter-spacing: 0.14em;
          text-transform: uppercase;
          color: #f5e6b8;
          text-shadow: 0 0 10px rgba(245,200,66,0.5), 0 1px 0 rgba(0,0,0,0.6);
        }
        .login-tome-hint {
          font-size: 0.78rem; letter-spacing: 0.08em; text-transform: uppercase;
          color: rgba(245,200,66,0.55);
        }
        .login-tome:hover {
          transform: translateY(-4px) rotate(-0.6deg);
          box-shadow:
            -5px 2px 0 0 #2c1006,
            -9px 4px 0 0 #1a0a04,
            0 22px 55px rgba(0,0,0,0.7), 0 0 50px rgba(245,200,66,0.25),
            inset 0 0 0 2px rgba(245,200,66,0.7);
        }
        .login-tome:active { transform: translateY(0) rotate(0deg); }

        .login-apply { text-align: center; font-size: 1.1rem; color: var(--text-secondary); margin: 0; }
        .login-apply a { color: var(--gold); font-weight: 600; text-decoration: underline; text-underline-offset: 3px; }
        .login-apply a:hover { color: #ffe08a; }
      `}</style>

      <div style={{
        minHeight: "100vh",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        gap: "2.75rem",
        position: "relative",
        zIndex: 1,
        padding: "2rem",
      }}>
        <h1 className="login-wordmark login-wordmark-wrap">
          Beamers Network
          <span className="login-wordmark-sparkles" aria-hidden="true" />
        </h1>

        <form action={async () => {
          "use server";
          await signIn("authentik", { redirectTo: "/" });
        }}>
          <button type="submit" className="login-tome" aria-label="Log in">
            <span className="login-tome-frame" aria-hidden="true" />
            <span className="login-tome-content">
              <i className="bi bi-stars login-tome-emblem" aria-hidden="true" />
              <span className="login-tome-label">Log In</span>
              <span className="login-tome-hint">Tap the tome</span>
            </span>
          </button>
        </form>

        <p className="login-apply">
          Don&apos;t have a login? <a href="https://beamers.network/apply">Apply</a>
        </p>
      </div>
    </>
  );
}
