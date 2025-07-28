// app/action.tsx
'use server';

import { createAI, type StreamableValue } from 'ai/rsc';
import { getAIResponse } from '@/lib/actions/aiActions';
import { ReactNode } from 'react';

// Definisikan tipe untuk pesan dari pengguna
interface UserMessage {
  id: number;
  role: 'user';
  display: ReactNode; // Pesan pengguna selalu ReactNode (teks)
}

// Definisikan tipe untuk pesan dari AI
interface AssistantMessage {
  id: number;
  role: 'assistant';
  display: StreamableValue<string>; // Pesan AI selalu StreamableValue
}

// Buat tipe Message sebagai gabungan dari keduanya
export type Message = UserMessage | AssistantMessage;

export const AI = createAI({
  actions: {
    getAIResponse,
  },
  initialAIState: [] as Message[],
  initialUIState: [] as Message[],
});