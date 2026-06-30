import { WandNav } from "@/components/WandNav";
import { BackButton } from "@/components/BackButton";

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  return (
    <div style={{ minHeight: "100vh", position: "relative", zIndex: 1 }}>
      <BackButton />
      <WandNav />
      <main className="container py-5">
        {children}
      </main>
    </div>
  );
}
