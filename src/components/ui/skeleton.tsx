// Skeleton.tsx (Reusable Skeleton Component)

export function Skeleton({ className }: { className?: string }) {
  return (
    <div
      className={`bg-gray-300 animate-pulse rounded-md ${className}`}
      style={{ height: "1rem", width: "100%" }}
    />
  );
}
