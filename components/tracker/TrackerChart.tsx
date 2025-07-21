'use client';

import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { GlucoseEntry } from '@/lib/actions/trackerActions';

interface TrackerChartProps {
  data: GlucoseEntry[];
}

export default function TrackerChart({ data }: TrackerChartProps) {
  // Format data untuk chart
  const formattedData = data.map(entry => ({
    name: new Date(entry.created_at).toLocaleDateString('id-ID', { day: '2-digit', month: 'short' }),
    gula: entry.sugar_g,
  })).reverse(); // Reverse agar data terbaru di kanan

  return (
    <div className="p-4 bg-white rounded-lg shadow-sm mb-8 h-80">
      <ResponsiveContainer width="100%" height="100%">
        <LineChart
          data={formattedData}
          margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
        >
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="name" />
          <YAxis label={{ value: 'Gula (g)', angle: -90, position: 'insideLeft' }} />
          <Tooltip />
          <Legend />
          <Line type="monotone" dataKey="gula" stroke="#10b981" activeDot={{ r: 8 }} />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
}