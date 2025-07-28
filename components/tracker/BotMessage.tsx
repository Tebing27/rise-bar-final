// components/tracker/BotMessage.tsx
'use client';

import { useStreamableText } from "@/lib/hooks/use-streamable-text";
import { StreamableValue } from "ai/rsc"; // <-- Impor tipe ini
import { marked } from "marked";

export function BotMessage({ content }: { content: StreamableValue<string> }) {
    const text = useStreamableText(content);
  
    // Menggunakan marked untuk mengubah Markdown menjadi HTML
    const sanitizedHtml = marked.parse(text);

    return (
      <div
        className="prose prose-sm max-w-none"
        // ✅ PERBAIKAN: Pastikan output di-cast sebagai string
        dangerouslySetInnerHTML={{ __html: sanitizedHtml as string }}
      />
    );
  }