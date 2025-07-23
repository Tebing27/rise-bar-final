// lib/utils.ts
import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

// FUNGSI BARU: Menghitung usia dari string tanggal lahir (YYYY-MM-DD)
export function calculateAge(dateOfBirth: string | Date): number {
  const birthDate = new Date(dateOfBirth);
  const today = new Date();
  let age = today.getFullYear() - birthDate.getFullYear();
  const m = today.getMonth() - birthDate.getMonth();
  if (m < 0 || (m === 0 && today.getDate() < birthDate.getDate())) {
    age--;
  }
  return age;
}


/**
 * Menentukan status gula darah berdasarkan usia, kondisi, dan level glukosa.
 */
export function getBloodSugarStatus(
  age: number,
  condition: string,
  glucoseLevel: number
): 'Tinggi' | 'Normal' | 'Rendah' {
  
  // Kategori 1: Anak-anak (0-12 tahun)
  if (age <= 12) {
    switch (condition) {
      case 'Sebelum Makan (Puasa)':
        if (glucoseLevel < 70) return 'Rendah';
        if (glucoseLevel > 100) return 'Tinggi';
        return 'Normal';
      case 'Setelah Makan':
        if (glucoseLevel >= 140) return 'Tinggi';
        return 'Normal';
      case 'Sewaktu':
        if (glucoseLevel >= 140) return 'Tinggi';
        return 'Normal'; 
      default:
        return 'Normal';
    }
  }

  // Kategori 2: Remaja & Dewasa (13-59 tahun)
  if (age >= 13 && age <= 59) {
    switch (condition) {
      case 'Sebelum Makan (Puasa)':
        if (glucoseLevel < 70) return 'Rendah';
        if (glucoseLevel > 99) return 'Tinggi';
        return 'Normal';
      case 'Setelah Makan':
        if (glucoseLevel >= 140) return 'Tinggi';
        return 'Normal';
      case 'Sewaktu':
        if (glucoseLevel >= 140) return 'Tinggi';
        return 'Normal';
      default:
        return 'Normal';
    }
  }

  // Kategori 3: Lansia (60+ tahun)
  if (age >= 60) {
    switch (condition) {
      case 'Sebelum Makan (Puasa)':
        if (glucoseLevel < 80) return 'Rendah';
        if (glucoseLevel > 120) return 'Tinggi';
        return 'Normal';
      case 'Setelah Makan':
        if (glucoseLevel >= 180) return 'Tinggi';
        return 'Normal';
      case 'Sewaktu':
        if (glucoseLevel >= 160) return 'Tinggi';
        return 'Normal';
      default:
        return 'Normal';
    }
  }

  return 'Normal';
}

export function calculateReadingTime(content: string): number {
  if (!content) return 0;
  const wordsPerMinute = 200;
  const text = content.replace(/<[^>]+>/g, '');
  const wordCount = text.split(/\s+/).length;
  const readingTime = Math.ceil(wordCount / wordsPerMinute);
  return readingTime;
}
