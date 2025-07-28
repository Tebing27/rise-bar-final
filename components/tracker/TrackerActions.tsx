// components/tracker/TrackerActions.tsx
'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Download, Loader2, FileText, Printer } from 'lucide-react'; // Impor ikon Printer
import { type GlucoseEntry } from '@/lib/actions/trackerActions';

export function TrackerActions({ entries }: { entries: GlucoseEntry[] }) {
  const [isExporting, setIsExporting] = useState(false);

  // Fungsi Export CSV (Sangat Ringan)
  const handleExportCSV = () => {
    if (entries.length === 0) {
      alert("Tidak ada data untuk diekspor.");
      return;
    }
    const headers = ['Tanggal', 'Waktu', 'Makanan', 'Gula (mg/dL)', 'Status', 'Mood', 'Aktivitas'];
    const csvContent = [
      headers.join(','),
      ...entries.map(e => [
        new Date(e.created_at).toLocaleDateString('id-ID'),
        new Date(e.created_at).toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit' }),
        `"${e.food_name.replace(/"/g, '""')}"`,
        e.sugar_g.toFixed(0),
        e.status,
        e.mood || '-',
        e.activity || '-'
      ].join(','))
    ].join('\n');
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    link.href = URL.createObjectURL(blob);
    link.download = `laporan-gula-darah-${new Date().toISOString().split('T')[0]}.csv`;
    link.click();
    URL.revokeObjectURL(link.href);
  };

  // Fungsi Print (Sangat Ringan, 0 bytes)
  const handlePrint = () => {
    const printContent = `
      <html><head><title>Laporan Gula Darah</title><style>body{font-family:Arial,sans-serif;margin:20px}table{width:100%;border-collapse:collapse}th,td{border:1px solid #ddd;padding:8px;text-align:left}th{background-color:#269185;color:white}h1{color:#269185}</style></head><body>
      <h1>Laporan Gula Darah</h1><table><thead><tr><th>Tanggal</th><th>Waktu</th><th>Makanan</th><th>Gula (mg/dL)</th><th>Status</th><th>Mood</th><th>Aktivitas</th></tr></thead><tbody>
      ${entries.map(e => `<tr><td>${new Date(e.created_at).toLocaleDateString('id-ID')}</td><td>${new Date(e.created_at).toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit' })}</td><td>${e.food_name}</td><td>${e.sugar_g.toFixed(0)}</td><td>${e.status}</td><td>${e.mood || '-'}</td><td>${e.activity || '-'}</td></tr>`).join('')}
      </tbody></table></body></html>`;
    const printWindow = window.open('', '_blank');
    if (printWindow) {
      printWindow.document.write(printContent);
      printWindow.document.close();
      printWindow.print();
    }
  };
  
  // Fungsi Export PDF (Berat, hanya di-load saat di-klik)
  const handleExportPDF = async () => {
    if (entries.length === 0) {
      alert("Tidak ada data untuk diekspor.");
      return;
    }
    setIsExporting(true);
    try {
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
      setIsExporting(false);
    }
  };

  return (
    <div className="flex gap-2 justify-end">
      <Button onClick={handleExportCSV} variant="outline" size="sm">
        <FileText className="w-4 h-4 mr-2" />
        Export CSV
      </Button>
      <Button onClick={handlePrint} variant="outline" size="sm">
        <Printer className="w-4 h-4 mr-2" />
        Print
      </Button>
      <Button onClick={handleExportPDF} variant="outline" size="sm" disabled={isExporting}>
        {isExporting ? <Loader2 className="w-4 h-4 mr-2 animate-spin" /> : <Download className="w-4 h-4 mr-2" />}
        {isExporting ? 'Mengekspor...' : 'Export PDF'}
      </Button>
    </div>
  );
}