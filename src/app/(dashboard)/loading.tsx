import { LoadingMark } from "@/components/LoadingMark";

export default function DashboardLoading() {
  return (
    <div
      style={{
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        minHeight: "40vh",
        padding: "4rem 0",
      }}
    >
      <LoadingMark size={48} />
    </div>
  );
}
