// app/admin/layout.tsx
import { AdminSidebar } from '@/components/admin/AdminSidebar';
import { Toaster } from '@/components/ui/sonner';

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen w-full bg-muted/40">
      <AdminSidebar />
      <main className="flex flex-col sm:gap-4 sm:py-4 sm:pl-64">
        <Toaster position="top-center" richColors />
        {children}
      </main>
    </div>
  );
}