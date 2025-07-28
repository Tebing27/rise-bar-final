/// lib/actions/aiActions.ts
'use server';

import { createGoogleGenerativeAI } from '@ai-sdk/google';
import { createStreamableValue, type StreamableValue } from 'ai/rsc'; // <-- Impor StreamableValue
import { streamText } from 'ai';
import { adminDb } from '@/lib/firebase-admin';
import type { DocumentData } from 'firebase-admin/firestore';

const google = createGoogleGenerativeAI({
  apiKey: process.env.GOOGLE_API_KEY,
});

async function getFoodData() {
  try {
    const snapshot = await adminDb.collection('foods').limit(200).get();
    const foods = snapshot.docs.map(doc => doc.data() as DocumentData);
    return foods.map(food => `${food.name} (Gula: ${food.sugar_g}g)`).join(', ');
  } catch (error) {
    console.error("Error fetching food data:", error);
    return "Data makanan tidak tersedia.";
  }
}

// ✅ PERBAIKAN: Tambahkan kembali 'async' dan definisikan tipe return sebagai Promise
export async function getAIResponse(input: string): Promise<{
  id: number;
  role: 'assistant';
  display: StreamableValue<string>;
}> {
  const stream = createStreamableValue('');

  (async () => {
    const foodData = await getFoodData();
    
    const { textStream } = await streamText({
      model: google('models/gemini-1.5-flash-latest'),
      system: `Anda adalah asisten kesehatan AI yang ramah dan membantu bernama "Rise Asisten". 
        Tugas Anda adalah memberikan saran terkait diabetes dan kadar glukosa. 
        Gunakan data makanan berikut untuk memberikan rekomendasi makanan rendah gula: [${foodData}].
        Selalu berikan jawaban dalam format Markdown yang rapi (gunakan **tebal** untuk penekanan). 
        Penting: Selalu sertakan disclaimer bahwa Anda bukan pengganti dokter profesional.`,
      prompt: input,
      maxTokens: 1024,
    });

    // Salurkan hasil stream ke streamable value
    for await (const delta of textStream) {
      stream.update(delta);
    }

    // Tutup stream setelah selesai
    stream.done();
  })();

  // Kembalikan objek yang berisi stream.value secara langsung.
  // Karena fungsinya async, ini akan otomatis terbungkus dalam Promise.
  return {
    id: Date.now(),
    role: 'assistant',
    display: stream.value,
  };
}