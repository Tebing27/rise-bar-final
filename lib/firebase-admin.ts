// lib/firebase-admin.ts
import admin from 'firebase-admin';

// Periksa apakah semua variabel lingkungan yang diperlukan sudah ada
if (
  !process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID ||
  !process.env.FIREBASE_CLIENT_EMAIL ||
  !process.env.FIREBASE_PRIVATE_KEY
) {
  // Kondisi ini akan true jika Anda salah mengetik nama variabel di .env.local
  // atau lupa menambahkannya sama sekali.
  throw new Error('Variabel lingkungan Firebase (PROJECT_ID, CLIENT_EMAIL, PRIVATE_KEY) belum diatur dengan benar.');
}

// Buat objek service account dari variabel-variabel tersebut
const serviceAccount = {
  projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
  clientEmail: process.env.FIREBASE_CLIENT_EMAIL,
  // Baris ini sangat penting: ia mengganti karakter '\n' dari string .env
  // menjadi karakter newline yang sebenarnya yang dibutuhkan oleh Firebase SDK.
  privateKey: process.env.FIREBASE_PRIVATE_KEY.replace(/\\n/g, '\n'),
};

// Inisialisasi Firebase Admin SDK hanya jika belum pernah dilakukan
if (!admin.apps.length) {
  try {
    admin.initializeApp({
      credential: admin.credential.cert(serviceAccount),
    });
  } catch (error: unknown) { // ✅ Perbaikan: Ganti 'any' dengan 'unknown'
    // ✅ Perbaikan: Tambahkan pengecekan tipe sebelum mengakses properti error
    if (error instanceof Error) {
      console.error('Firebase admin initialization error', error.stack);
    } else {
      console.error('An unknown error occurred during Firebase admin initialization', error);
    }
    throw new Error('Gagal menginisialisasi Firebase Admin SDK. Periksa kembali service account key Anda.');
  }
}

// Ekspor instance database admin yang sudah siap pakai
const adminDb = admin.firestore();
export { adminDb };