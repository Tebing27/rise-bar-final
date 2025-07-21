import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function getBloodSugarStatus(age: number, condition: string, glucoseLevel: number): 'Tinggi' | 'Normal' | 'Rendah' {
    if (age < 6) {
        if (condition === 'Puasa') {
            if (glucoseLevel < 100) return 'Rendah';
            if (glucoseLevel > 200) return 'Tinggi';
        } else { // Setelah makan, sebelum tidur, sewaktu
            if (glucoseLevel > 200) return 'Tinggi';
        }
    } else if (age >= 6 && age <= 12) {
        if (condition === 'Puasa') {
            if (glucoseLevel < 70) return 'Rendah';
            if (glucoseLevel > 150) return 'Tinggi';
        } else {
            if (glucoseLevel > 150) return 'Tinggi';
        }
    } else { // > 12 tahun
        if (condition === 'Puasa') {
            if (glucoseLevel < 70) return 'Rendah';
            if (glucoseLevel > 130) return 'Tinggi';
        } else if (condition === 'Setelah Makan') {
            if (glucoseLevel > 180) return 'Tinggi';
        } else { // Sebelum tidur, sewaktu
            if (glucoseLevel < 100) return 'Rendah';
            if (glucoseLevel > 140) return 'Tinggi';
        }
    }
    return 'Normal';
}