// components/tracker/TrackerActions.tsx
'use client';

import { Button } from '@/components/ui/button';
import { Download } from 'lucide-react';
import { type GlucoseEntry } from '@/lib/actions/trackerActions';
import { jsPDF } from 'jspdf';
import autoTable from 'jspdf-autotable';

export function TrackerActions({ entries }: { entries: GlucoseEntry[] }) {
  const handleExportPDF = () => {
    if (entries.length === 0) {
      alert("Tidak ada data untuk diekspor.");
      return;
    }
    
    const doc = new jsPDF();
    doc.text("Laporan Gula Darah", 14, 16);

    // --- PERBAIKAN DI SINI ---
    autoTable(doc, {
      startY: 22,
      // Menyesuaikan header PDF agar sama dengan tabel
      head: [['Tanggal', 'Waktu', 'Makanan', 'Gula (mg/dL)', 'Status', 'Mood', 'Aktivitas']],
      body: entries.map(e => [
        new Date(e.created_at).toLocaleDateString('id-ID'),
        new Date(e.created_at).toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit' }),
        // Membuat daftar makanan menjadi beberapa baris di PDF
        e.food_name.split(', ').map((food, index) => `${index + 1}. ${food}`).join('\n'),
        e.sugar_g.toFixed(0),
        e.status,
        e.mood || '-', // Menambahkan data Mood
        e.activity || '-' // Menambahkan data Aktivitas
      ]),
      styles: { fontSize: 8 },
      headStyles: { fillColor: [38, 145, 131] }, 
    });
    // -------------------------

    doc.save(`laporan-gula-darah-${new Date().toISOString().split('T')[0]}.pdf`);
  };

  return (
    <div className="flex justify-end">
      <Button onClick={handleExportPDF} variant="outline" size="sm">
        <Download className="w-4 h-4 mr-2" />
        Export
        <span className="hidden sm:inline ml-1">Laporan (PDF)</span>
      </Button>
    </div>
  );
}