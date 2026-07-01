import { signIn, auth } from "@/auth";
import { redirect } from "next/navigation";

export default async function LoginPage() {
  const session = await auth();
  if (session) redirect("/");
  return (
    <div style={{
      minHeight: "100vh",
      display: "flex",
      flexDirection: "column",
      alignItems: "center",
      justifyContent: "center",
      gap: "2rem",
      position: "relative",
      zIndex: 1,
    }}>
      <div style={{ textAlign: "center" }}>
        <h1 style={{
          fontFamily: "var(--font-cinzel)",
          fontSize: "2rem",
          fontWeight: 600,
          color: "var(--gold)",
          marginBottom: "0.5rem",
        }}>
          Beamers Network
        </h1>
        <p style={{ color: "var(--text-secondary)", fontSize: "0.95rem" }}>
          Wizard Dashboard
        </p>
      </div>

      <div style={{
        background: "var(--bg-surface)",
        border: "1px solid var(--border)",
        borderRadius: 12,
        padding: "2rem",
        display: "flex",
        flexDirection: "column",
        gap: "1rem",
        minWidth: 300,
        textAlign: "center",
      }}>
        <form action={async () => {
          "use server";
          await signIn("authentik", { redirectTo: "/" });
        }}>
          <button
            type="submit"
            style={{
              background: "var(--gold)",
              color: "#1a1200",
              border: "none",
              borderRadius: 8,
              padding: "0.75rem 1.5rem",
              fontSize: "1rem",
              fontWeight: 700,
              cursor: "pointer",
              width: "100%",
            }}
          >
            Log In
          </button>
        </form>

        <a
          href="https://beamers.network/apply"
          style={{
            color: "var(--text-secondary)",
            fontSize: "0.85rem",
            textDecoration: "none",
          }}
        >
          Apply to become a Beamer
        </a>
      </div>
    </div>
  );
}
