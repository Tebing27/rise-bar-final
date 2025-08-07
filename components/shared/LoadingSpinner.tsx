// components/shared/LoadingSpinner.tsx
import Image from "next/image";

export function LoadingSpinner() {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-background/80 backdrop-blur-sm">
      <div className="flex flex-col items-center gap-4">
        <div className="relative h-24 w-24 animate-pulse">
          <Image
            src="/mascot_berjelajah_arbie.webp"
            alt="Loading..."
            layout="fill"
            objectFit="contain"
            priority
          />
        </div>
        <p className="text-lg font-semibold text-foreground animate-pulse">
          Memuat...
        </p>
      </div>
    </div>
  );
}
