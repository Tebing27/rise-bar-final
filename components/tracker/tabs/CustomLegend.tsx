// components/tracker/tabs/CustomLegend.tsx
'use client';

export function CustomLegend() {
  return (
    // --- PERBAIKAN DI SINI ---
    // Mengubah breakpoint dari `sm` menjadi `lg` untuk tata letak yang lebih besar
    <div className="flex flex-col items-center gap-2 mt-4 text-sm text-muted-foreground lg:flex-row lg:justify-center lg:gap-4">
      
      {/* Baris Pertama (di mobile) atau grup kiri (di desktop) */}
      <div className="flex items-center justify-center gap-4">
        <div className="flex items-center gap-2">
          <div className="w-3 h-3 rounded-full bg-green-500 shrink-0"></div>
          <span>Normal (70-140)</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-3 h-3 rounded-full bg-orange-400 shrink-0"></div>
          <span>Rendah (&lt;70)</span>
        </div>
      </div>

      {/* Baris Kedua (di mobile) atau grup kanan (di desktop) */}
      <div className="flex items-center gap-2">
        <div className="w-3 h-3 rounded-full bg-red-500 shrink-0"></div>
        <span>Tinggi (&gt;140)</span>
      </div>

    </div>
  );
}