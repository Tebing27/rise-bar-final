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

    autoTable(doc, {
      startY: 22,
      head: [['Tanggal', 'Waktu', 'Makanan', 'Gula (mg/dL)', 'Usia', 'Kondisi', 'Status']],
      body: entries.map(e => [
        new Date(e.created_at).toLocaleDateString('id-ID'),
        new Date(e.created_at).toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit' }),
        e.food_name,
        e.sugar_g.toFixed(0),
        e.age_at_input || '-',
        e.condition,
        e.status
      ]),
      styles: { fontSize: 8 },
      headStyles: { fillColor: [38, 145, 131] }, // Warna Teal (Primary)
    });

    doc.save(`laporan-gula-darah-${new Date().toISOString().split('T')[0]}.pdf`);
  };

  return (
    <div className="flex justify-end mb-4">
      <Button onClick={handleExportPDF} variant="outline" size="sm">
        <Download className="w-4 h-4 mr-2" />
        Export Laporan (PDF)
      </Button>
    </div>
  );
}
