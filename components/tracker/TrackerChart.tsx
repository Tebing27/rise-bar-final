// components/tracker/TrackerChart.tsx
'use client';

import { createChart, ColorType, LineStyle, LineSeries, Time } from 'lightweight-charts';
import React, { useEffect, useRef } from 'react';
import { type GlucoseEntry } from '@/lib/actions/trackerActions';

export default function TrackerChart({ data }: { data: GlucoseEntry[] }) {
  const chartContainerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!chartContainerRef.current || data.length === 0) return;

    const handleResize = () => {
      if (chartContainerRef.current) {
        chart.applyOptions({ width: chartContainerRef.current.clientWidth });
      }
    };

    const chart = createChart(chartContainerRef.current, {
      layout: {
        background: { type: ColorType.Solid, color: 'transparent' },
        textColor: '#6b7280', // text-gray-500
      },
      grid: {
        vertLines: { color: '#e5e7eb' }, // border-gray-200
        horzLines: { color: '#e5e7eb' },
      },
      width: chartContainerRef.current.clientWidth,
      height: 300,
    });

    // ✅ PERBAIKAN: Menggunakan addSeries() dengan LineSeries yang diimport
    const lineSeries = chart.addSeries(LineSeries, {
      color: '#10b981', // emerald-500
      lineWidth: 3,
      lineStyle: LineStyle.Solid,
    });

    const formattedData = data
      .map(entry => ({
        time: (new Date(entry.created_at).getTime() / 1000) as Time, // Unix timestamp dengan tipe Time
        value: entry.sugar_g,
      }))
      .sort((a, b) => (a.time as number) - (b.time as number)); // Pastikan data diurutkan berdasarkan waktu

    lineSeries.setData(formattedData);

    // Tambahkan garis referensi
    lineSeries.createPriceLine({ price: 140, color: 'red', lineStyle: LineStyle.Dashed, title: 'Tinggi' });
    lineSeries.createPriceLine({ price: 70, color: 'orange', lineStyle: LineStyle.Dashed, title: 'Rendah' });

    chart.timeScale().fitContent();
    window.addEventListener('resize', handleResize);

    return () => {
      window.removeEventListener('resize', handleResize);
      chart.remove();
    };
  }, [data]);

  return <div ref={chartContainerRef} className="h-[300px] w-full" />;
}