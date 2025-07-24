// app/admin/layout.tsx
import { AdminSidebar } from "@/components/admin/AdminSidebar";
import { auth } from "@/lib/auth";
import { redirect } from "next/navigation";

export default async function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = await auth();

  // Proteksi tambahan jika middleware gagal
  if (session?.user?.role !== 'admin') {
    redirect('/login');
  }

  return (
    <div className="flex min-h-screen w-full bg-muted/40">
      <AdminSidebar />
      <div className="flex flex-1 flex-col">
        <main className="flex-1 p-4 sm:p-6 lg:p-8">
          {children}
        </main>
      </div>
    </div>
  );
}
