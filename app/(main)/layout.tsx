// app/(main)/layout.tsx
// import { MobileHeader } from "@/components/shared/MobileHeader";

export default function MainLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    // Struktur flexbox dan sidebar dihilangkan
    <div className="flex flex-col min-h-screen w-full">
      {/* <MobileHeader /> */}
      <main className="flex-1 bg-muted/40">
        {children}
      </main>
    </div>
  );
}