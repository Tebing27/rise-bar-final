// components/tracker/TrackerActions.tsx
'use client';

import { useState } from 'react'; // <-- Impor useState
import { Button } from '@/components/ui/button';
import { Download, Loader2 } from 'lucide-react'; // <-- Impor Loader2
import { type GlucoseEntry } from '@/lib/actions/trackerActions';

export function TrackerActions({ entries }: { entries: GlucoseEntry[] }) {
  const [isExporting, setIsExporting] = useState(false); // <-- Tambahkan state untuk loading

  const handleExportPDF = async () => {
    if (entries.length === 0) {
      alert("Tidak ada data untuk diekspor.");
      return;
    }

    setIsExporting(true);

    try {
      // ✅ OPTIMASI: Impor library hanya saat fungsi ini dipanggil
      const { jsPDF } = await import('jspdf');
      const { default: autoTable } = await import('jspdf-autotable');

      const doc = new jsPDF();
      doc.text("Laporan Gula Darah", 14, 16);

      autoTable(doc, {
        startY: 22,
        head: [['Tanggal', 'Waktu', 'Makanan', 'Gula (mg/dL)', 'Status', 'Mood', 'Aktivitas']],
        body: entries.map(e => [
          new Date(e.created_at).toLocaleDateString('id-ID'),
          new Date(e.created_at).toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit' }),
          e.food_name.split(', ').map((food, index) => `${index + 1}. ${food}`).join('\n'),
          e.sugar_g.toFixed(0),
          e.status,
          e.mood || '-',
          e.activity || '-'
        ]),
        styles: { fontSize: 8 },
        headStyles: { fillColor: [38, 145, 131] }, 
      });

      doc.save(`laporan-gula-darah-${new Date().toISOString().split('T')[0]}.pdf`);
    } catch (error) {
        console.error("Gagal mengekspor PDF:", error);
        alert("Terjadi kesalahan saat membuat PDF.");
    } finally {
        setIsExporting(false); // <-- Set loading kembali ke false
    }
  };

  return (
    <div className="flex justify-end">
      <Button onClick={handleExportPDF} variant="outline" size="sm" disabled={isExporting}>
        {isExporting ? (
          <Loader2 className="w-4 h-4 mr-2 animate-spin" />
        ) : (
          <Download className="w-4 h-4 mr-2" />
        )}
        {isExporting ? 'Mengekspor...' : 'Export Laporan (PDF)'}
      </Button>
    </div>
  );
}