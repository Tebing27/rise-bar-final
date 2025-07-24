// components/tracker/tabs/HistoryTab.tsx

import { type GlucoseEntry } from "@/lib/actions/trackerActions";
import { CardContent } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { DateFilter } from "@/components/tracker/DateFilter";
import EditEntryDialog from "@/components/tracker/EditEntryDialog";
import { DeleteEntryButton } from "@/components/tracker/DeleteEntryButton";
import { TrackerActions } from "@/components/tracker/TrackerActions";

interface HistoryTabProps {
  entries: GlucoseEntry[];
}

const moodToEmoji: { [key: string]: string } = {
  'Senang': '😊',
  'Biasa': '😐',
  'Stres': '😩',
  'Lelah': '😴',
};

export function HistoryTab({ entries }: HistoryTabProps) {
  return (
    <CardContent className="pt-0"> 
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 py-4">
        <DateFilter />
        <TrackerActions entries={entries} />
      </div>
      <div className="border rounded-md">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="w-[100px]">Tanggal</TableHead>
              <TableHead>Makanan</TableHead>
              <TableHead className="text-center">Gula (mg/dL)</TableHead>
              <TableHead className="text-center">Status</TableHead>
              <TableHead className="text-center">Mood</TableHead>
              <TableHead>Aktivitas</TableHead>
              <TableHead className="text-center">Aksi</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {entries.map((entry) => (
              <TableRow key={entry.id}>
                {/* --- PERBAIKAN: Mengganti align-top menjadi align-middle di semua TableCell --- */}
                <TableCell className="font-medium text-xs align-middle">
                  {new Date(entry.created_at).toLocaleDateString("id-ID", { day: "2-digit", month: "short", year: "2-digit" })}
                  <br />
                  <span className="text-muted-foreground">{new Date(entry.created_at).toLocaleTimeString("id-ID", { hour: "2-digit", minute: "2-digit" })}</span>
                </TableCell>
                
                <TableCell className="text-sm text-muted-foreground max-w-[250px] align-middle">
                  <div className="flex flex-col">
                    {entry.food_name.split(', ').map((food, index) => (
                      <span key={index}>
                        {`${index + 1}. ${food}`}
                      </span>
                    ))}
                  </div>
                </TableCell>

                <TableCell className="text-center font-semibold align-middle">{entry.sugar_g.toFixed(0)}</TableCell>
                <TableCell className="text-center align-middle">
                  <span className={`px-2 py-1 text-xs font-semibold rounded-full ${
                    entry.status === "Tinggi" ? "bg-red-100 text-red-800"
                    : entry.status === "Normal" ? "bg-green-100 text-green-800"
                    : "bg-blue-100 text-blue-800"
                  }`}>
                    {entry.status}
                  </span>
                </TableCell>
                <TableCell className="text-center text-sm text-muted-foreground align-middle">
                  {entry.mood ? `${moodToEmoji[entry.mood] || ''} ${entry.mood}` : '-'}
                </TableCell>
                <TableCell className="text-sm text-muted-foreground max-w-[150px] align-middle truncate">{entry.activity || '-'}</TableCell>
                <TableCell className="text-right align-middle">
                  <div className="flex items-center justify-end gap-1">
                      <EditEntryDialog entry={entry} /> 
                      <DeleteEntryButton id={entry.id} />
                  </div>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </CardContent>
  );
}