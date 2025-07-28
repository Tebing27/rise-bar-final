// lib/actions/aiActions.ts
'use server';

import { createGoogleGenerativeAI } from '@ai-sdk/google';
import { createStreamableValue, type StreamableValue } from 'ai/rsc';
import { streamText } from 'ai';
import { adminDb } from '@/lib/firebase-admin';
import type { DocumentData } from 'firebase-admin/firestore';
import { auth } from '@/lib/auth'; // <- 1. Impor untuk mendapatkan sesi pengguna
import { createClient } from '@/utils/supabase/server'; // <- 2. Impor Supabase client untuk server

const google = createGoogleGenerativeAI({
  apiKey: process.env.GOOGLE_API_KEY,
});

// Fungsi ini tetap sama
async function getFoodData() {
  try {
    const snapshot = await adminDb.collection('foods').limit(200).get();
    const foods = snapshot.docs.map(doc => doc.data() as DocumentData);
    return foods.map(food => `'${food.name}' (gula: ${food.sugar_g}g)`).join(', ');
  } catch (error) {
    console.error("Error fetching food data:", error);
    return "Data makanan tidak tersedia.";
  }
}

// ✅ FUNGSI BARU: Untuk mengambil data glukosa terakhir pengguna
async function getLatestGlucose() {
    const session = await auth();
    if (!session?.user?.id) {
        return null;
    }

    const supabase = await createClient();
    const { data, error } = await supabase
        .from('glucose_entries')
        .select('sugar_g, status')
        .eq('user_id', session.user.id)
        .order('created_at', { ascending: false })
        .limit(1)
        .single();

    if (error || !data) {
        // Tidak perlu log error jika datanya memang belum ada
        return null;
    }

    return { value: data.sugar_g, status: data.status };
}


export async function getAIResponse(input: string): Promise<{
  id: number;
  role: 'assistant';
  display: StreamableValue<string>;
}> {
  const stream = createStreamableValue('');

  (async () => {
    // ✅ Ambil data makanan dan data glukosa pengguna secara bersamaan
    const [foodData, latestGlucose] = await Promise.all([
        getFoodData(),
        getLatestGlucose()
    ]);

    // ✅ Siapkan konteks glukosa untuk diberikan ke AI
    let glucoseContext = "Data glukosa pengguna saat ini tidak tersedia.";
    if (latestGlucose) {
        glucoseContext = `Kadar glukosa terakhir pengguna adalah ${latestGlucose.value.toFixed(0)} mg/dL, yang tergolong '${latestGlucose.status}'.`;
    }

    // ✅ SYSTEM PROMPT DIPERBARUI SECARA SIGNIFIKAN
    const systemPrompt = `
      Anda adalah "Rise Asisten", seorang asisten kesehatan AI yang sangat fokus pada diabetes dan nutrisi.

      INFORMASI PENGGUNA SAAT INI:
      - ${glucoseContext}

      TUGAS DAN ATURAN ANDA:
      1.  **Gunakan Data Pengguna**: Selalu gunakan informasi "Kadar glukosa terakhir pengguna" untuk menjawab pertanyaan seperti "glukosa saya berapa?" atau untuk memberikan saran yang relevan.
      2.  **Rekomendasi Olahraga Berdasarkan Glukosa**:
          - Jika status glukosa **'Tinggi'**: Sarankan aktivitas aerobik **ringan hingga sedang** seperti jalan cepat, bersepeda santai, atau berenang selama 20-30 menit untuk membantu menurunkan gula darah secara bertahap.
          - Jika status glukosa **'Normal'**: Berikan pujian dan sarankan untuk **mempertahankan rutinitas olahraga** yang biasa dilakukan atau mencoba aktivitas baru yang menyenangkan.
          - Jika status glukosa **'Rendah'**: **PENTING!** Sarankan pengguna untuk **mengonsumsi 15 gram karbohidrat sederhana** (contoh: setengah gelas jus buah, atau beberapa permen) terlebih dahulu. Minta mereka menunggu 15 menit, lalu memeriksa kembali gula darahnya sebelum melakukan aktivitas fisik yang sangat ringan. Larang olahraga berat saat gula darah rendah.
      3.  **Rekomendasi Makanan**: Berikan rekomendasi makanan rendah gula **HANYA** berdasarkan daftar data makanan berikut: [${foodData}].
      4.  **Batasan Topik**: Jika pengguna bertanya di luar topik kesehatan glukosa, diabetes, atau nutrisi (misalnya tentang cuaca, politik, atau topik umum lainnya), Anda **WAJIB** menolak dengan sopan. Katakan: "Mohon maaf, saya adalah asisten kesehatan dan hanya bisa membantu dengan pertanyaan seputar glukosa, diabetes, dan nutrisi."
      5.  **Disclaimer Wajib**: Setiap jawaban **HARUS** diakhiri dengan disclaimer berikut di baris baru: "*Informasi ini bukan pengganti nasihat medis profesional.*"
      6.  **Format**: Selalu gunakan format Markdown dan berikan penekanan dengan **teks tebal** pada poin-poin penting.
    `;
    
    const { textStream } = await streamText({
      model: google('models/gemini-1.5-flash-latest'),
      system: systemPrompt,
      prompt: input,
      maxTokens: 1024,
    });

    for await (const delta of textStream) {
      stream.update(delta);
    }

    stream.done();
  })();

  return {
    id: Date.now(),
    role: 'assistant',
    display: stream.value,
  };
}