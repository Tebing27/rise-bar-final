'use client';

import { Button } from '@/components/ui/button';
import { GlucoseEntry } from '@/lib/actions/solutionActions';

// Fungsi untuk mengonversi array of objects ke format CSV
function convertToCSV(data: GlucoseEntry[]): string {
  if (data.length === 0) return '';
  
  // Membersihkan dan memformat data sebelum konversi
  const sanitizedData = data.map(item => ({
    tanggal: new Date(item.created_at).toLocaleString('id-ID'),
    makanan: item.food_name.replace(/,/g, ''), // Hapus koma agar tidak merusak CSV
    porsi: item.serving_size?.replace(/,/g, ''),
    gula_gram: item.sugar_g,
    catatan: item.notes?.replace(/,/g, '') || ''
  }));

  const header = Object.keys(sanitizedData[0]);
  const csv = [
    header.join(','), // baris header
    ...sanitizedData.map(row => header.map(fieldName => (row as any)[fieldName]).join(','))
  ].join('\r\n');

  return csv;
}

export default function ExportButton({ entries }: { entries: GlucoseEntry[] }) {
  const handleExport = () => {
    if (!entries || entries.length === 0) {
      alert('Tidak ada data untuk diekspor.');
      return;
    }

    const csvData = convertToCSV(entries);
    const blob = new Blob([csvData], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    const url = URL.createObjectURL(blob);
    
    link.setAttribute('href', url);
    link.setAttribute('download', `riwayat_gula_${new Date().toISOString().split('T')[0]}.csv`);
    link.style.visibility = 'hidden';
    
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <Button onClick={handleExport} variant="outline">
      Export ke CSV
    </Button>
  );
}