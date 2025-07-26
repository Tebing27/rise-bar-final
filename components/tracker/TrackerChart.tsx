// components/tracker/TrackerChart.tsx
'use client';

import { 
  LineChart, 
  Line, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer,
  ReferenceLine
} from 'recharts';
import { type GlucoseEntry } from '@/lib/actions/trackerActions';

// ✅ Perbaikan Tipe: Berikan tipe yang lebih spesifik
interface TooltipProps {
  active?: boolean;
  payload?: { value: number }[];
  label?: string;
}

const CustomTooltip = ({ active, payload, label }: TooltipProps) => { // <-- Gunakan tipe di sini
  if (active && payload && payload.length) {
    return (
      <div className="p-2 bg-background border rounded-md shadow-lg">
        <p className="font-bold">{`${label}`}</p>
        <p className="text-primary">{`Gula: ${payload[0].value} mg/dL`}</p>
      </div>
    );
  }
  return null;
};

export default function TrackerChart({ data }: { data: GlucoseEntry[] }) {
  const formattedData = data.map(entry => ({
    time: new Date(entry.created_at).toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit' }),
    gula: entry.sugar_g,
  })).reverse(); 

  const yDomain = [60, 160];

  return (
    <div className="h-[300px] w-full"> 
      <ResponsiveContainer width="100%" height="100%">
        <LineChart
          data={formattedData}
          margin={{ top: 5, right: 20, left: -10, bottom: 5 }}
        >
          <defs>
            <linearGradient id="lineGradient" x1="0" y1="0" x2="1" y2="0">
              <stop offset="5%" stopColor="#10b981" stopOpacity={0.8}/>
              <stop offset="95%" stopColor="#10b981" stopOpacity={1}/>
            </linearGradient>
          </defs>
          <CartesianGrid strokeDasharray="3 3" vertical={false} />
          <XAxis 
            dataKey="time" 
            tick={{ fontSize: 12 }} 
            axisLine={false} 
            tickLine={false}
          />
          <YAxis 
            domain={yDomain} 
            ticks={[60, 85, 110, 135, 160]} 
            tick={{ fontSize: 12 }} 
            axisLine={false} 
            tickLine={false} 
          />
          <Tooltip content={<CustomTooltip />} />
          <ReferenceLine y={140} stroke="red" strokeDasharray="3 3" />
          <ReferenceLine y={70} stroke="orange" strokeDasharray="3 3" />
          <Line 
            type="monotone" 
            dataKey="gula" 
            stroke="url(#lineGradient)" 
            strokeWidth={3}
            dot={{ r: 5, fill: '#10b981', strokeWidth: 2, stroke: '#ffffff' }}
            activeDot={{ r: 8, fill: '#10b981', strokeWidth: 2, stroke: '#ffffff' }} 
          />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
}