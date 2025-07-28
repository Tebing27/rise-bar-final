// components/tracker/ChartSkeleton.tsx
export function ChartSkeleton() {
  return (
    <div className="h-[300px] w-full animate-pulse rounded-lg bg-muted/50 p-4">
      <div className="h-full w-full flex items-end justify-between">
        {/* Simulasi beberapa bar grafik */}
        <div className="h-1/3 w-8 rounded-t-md bg-muted"></div>
        <div className="h-1/2 w-8 rounded-t-md bg-muted"></div>
        <div className="h-3/4 w-8 rounded-t-md bg-muted"></div>
        <div className="h-1/2 w-8 rounded-t-md bg-muted"></div>
        <div className="h-2/3 w-8 rounded-t-md bg-muted"></div>
        <div className="h-1/3 w-8 rounded-t-md bg-muted"></div>
      </div>
    </div>
  );
}