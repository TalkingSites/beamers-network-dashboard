import { LoadingMark } from "@/components/LoadingMark";

export default function Loading() {
  return (
    <div
      style={{
        minHeight: "100vh",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        position: "relative",
        zIndex: 1,
      }}
    >
      <LoadingMark size={72} />
    </div>
  );
}
