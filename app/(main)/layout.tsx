// app/(main)/layout.tsx
import { DashboardSidebar } from "@/components/shared/DashboardSidebar";
import { MobileHeader } from "@/components/shared/MobileHeader";

export default function MainLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="flex min-h-screen w-full">
      <DashboardSidebar />
      <div className="flex flex-1 flex-col">
        <MobileHeader />
        <main className="flex-1 overflow-y-auto bg-muted/40">
          {children}
        </main>
      </div>
    </div>
  );
}
