// lib/hooks/use-streamable-text.ts
'use client';

import { readStreamableValue, type StreamableValue } from 'ai/rsc'; // 👈 1. Impor tipenya
import { useState, useEffect } from 'react';

// 👇 2. Ganti 'any' dengan tipe yang benar
export const useStreamableText = (streamable: StreamableValue<string>) => {
  const [text, setText] = useState('');

  useEffect(() => {
    (async () => {
      let concatenatedText = '';
      for await (const value of readStreamableValue(streamable)) {
        concatenatedText += value;
        setText(concatenatedText);
      }
    })();
  }, [streamable]);

  return text;
};