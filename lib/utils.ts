// lib/utils.ts
import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function getBloodSugarStatus(age: number, condition: string, glucoseLevel: number): 'Tinggi' | 'Normal' | 'Rendah' {
    if (age < 6) {
        // Logika untuk anak di bawah 6 tahun
        if (condition === 'Sebelum Makan (Puasa)') {
            if (glucoseLevel < 100) return 'Rendah';
            if (glucoseLevel > 200) return 'Tinggi';
        } else {
            if (glucoseLevel > 200) return 'Tinggi';
        }
    } else if (age >= 6 && age <= 12) {
        // Logika untuk anak 6-12 tahun
        if (condition === 'Sebelum Makan (Puasa)') {
            if (glucoseLevel < 70) return 'Rendah';
            if (glucoseLevel > 150) return 'Tinggi';
        } else {
            if (glucoseLevel > 150) return 'Tinggi';
        }
    } else { 
        // Logika untuk di atas 12 tahun
        // --- PERBAIKAN DI SINI ---
        if (condition === 'Sebelum Makan (Puasa)') { // Diubah dari 'Puasa'
            if (glucoseLevel < 70) return 'Rendah';
            if (glucoseLevel > 130) return 'Tinggi';
        } else if (condition === 'Setelah Makan') {
            if (glucoseLevel > 180) return 'Tinggi';
        } else { // Untuk kondisi "Sewaktu"
            if (glucoseLevel < 100) return 'Rendah';
            if (glucoseLevel > 140) return 'Tinggi';
        }
    }
    // Jika tidak ada kondisi di atas yang terpenuhi, statusnya adalah Normal
    return 'Normal';
}

export function calculateReadingTime(content: string): number {
  if (!content) return 0;
  const wordsPerMinute = 200; // Average reading speed
  const text = content.replace(/<[^>]+>/g, ''); // Remove HTML tags
  const wordCount = text.split(/\s+/).length;
  const readingTime = Math.ceil(wordCount / wordsPerMinute);
  return readingTime;
}