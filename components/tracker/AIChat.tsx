// components/tracker/AIChat.tsx
'use client';

import { useState } from 'react';
import { useActions, useUIState } from 'ai/rsc';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
// ✅ 1. Hapus MessageCircle dari impor lucide-react, tambahkan Bot dan User jika belum ada
import { Bot, X } from 'lucide-react'; 
import { AI } from '@/app/action';
import { cn } from '@/lib/utils';
import { BotMessage } from './BotMessage';
import { StreamableValue } from 'ai/rsc';
import Image from 'next/image'; // ✅ 2. Pastikan Image sudah diimpor

export function AIChat() {
  const [isOpen, setIsOpen] = useState(false);
  const [inputValue, setInputValue] = useState('');
  const [messages, setMessages] = useUIState<typeof AI>();
  const { getAIResponse } = useActions<typeof AI>();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!inputValue.trim() || messages.length >= 10) {
      if (messages.length >= 10) {
        alert("Anda telah mencapai batas percakapan. Silakan segarkan halaman untuk memulai sesi baru.");
      }
      return;
    }

    setMessages(currentMessages => [
      ...currentMessages,
      { id: Date.now(), role: 'user', display: inputValue }
    ]);

    const aiResponse = await getAIResponse(inputValue);

    setMessages(currentMessages => [
      ...currentMessages,
      aiResponse
    ]);

    setInputValue('');
  };

  return (
    <>
      <div className="fixed bottom-6 right-6 z-50">
        <Button
          onClick={() => setIsOpen(!isOpen)}
          size="icon"
          className="rounded-full w-16 h-16 shadow-lg flex items-center justify-center" // ✅ Tambahkan flexbox
        >
          {/* ✅ 3. Logika untuk menampilkan gambar atau ikon X */}
          {isOpen ? (
            <X className="w-8 h-8" />
          ) : (
            <Image src="/mascot_menyapa.webp" alt="Buka Asisten AI" width={40} height={40} />
          )}
          <span className="sr-only">Buka Asisten AI</span>
        </Button>
      </div>
      <div
        className={cn(
          "fixed bottom-24 right-6 z-50 transition-all duration-300 ease-in-out",
          isOpen ? "opacity-100 translate-y-0" : "opacity-0 translate-y-4 pointer-events-none"
        )}
      >
        <Card className="w-[calc(100vw-2rem)] max-w-[380px] h-[500px] flex flex-col bg-blue-50 dark:bg-blue-900/20">
          <CardHeader>
            <div className="flex items-center gap-3">
              <Image src="/mascot_menyapa.webp" alt="AI Assistant" width={40} height={40} />
              <div>
                <CardTitle>Rise Asisten</CardTitle>
                <CardDescription>Tanya seputar glukosa & makanan.</CardDescription>
              </div>
            </div>
          </CardHeader>
          <CardContent className="flex-1 flex flex-col gap-4 overflow-hidden">
            <div className="flex-1 space-y-4 overflow-y-auto p-4 border rounded-md bg-background">
              {messages.length === 0 && (
                <div className="flex gap-3">
                  <Bot className="w-6 h-6 text-primary flex-shrink-0" />
                  <div className="rounded-lg p-3 max-w-sm bg-muted">
                    <p className="text-sm">Halo! Ada yang bisa saya bantu terkait kadar gula darah atau rekomendasi makanan sehat?</p>
                  </div>
                </div>
              )}
              {messages.map((msg) => (
                <div key={msg.id} className={`flex gap-3 ${msg.role === 'user' ? 'justify-end' : ''}`}>
                  {msg.role === 'assistant' && (
                    <div className="relative w-6 h-6 sm:w-8 sm:h-8 md:w-10 md:h-10 flex-shrink-0">
  <Image 
    src="/mascot_bertanya_arbie.webp" 
    alt="AI Assistant" 
    fill
    className="rounded-full object-cover"
  />
</div>
                  )}
                  
                  <div className={`rounded-lg p-3 max-w-sm ${msg.role === 'assistant' ? 'bg-muted' : 'bg-primary text-primary-foreground'}`}>
                    {msg.role === 'assistant' ? (
                      <BotMessage content={msg.display as StreamableValue<string>} />
                    ) : (
                      msg.display
                    )}
                  </div>
                  
                                    {msg.role === 'user' && (
                    <div className="relative w-6 h-6 sm:w-8 sm:h-8 md:w-10 md:h-10 flex-shrink-0">
  <Image 
    src="/maskot_bot.webp" 
    alt="User AI" 
    fill
    className="rounded-full object-cover"
  />
</div>
                  )}
                </div>
              ))}
            </div>
            <form onSubmit={handleSubmit} className="flex gap-2">
              <Input
                value={inputValue}
                onChange={(e) => setInputValue(e.target.value)}
                placeholder="Tulis pesan Anda..."
                disabled={messages.length >= 10}
              />
              <Button type="submit" disabled={messages.length >= 10}>Kirim</Button>
            </form>
          </CardContent>
        </Card>
      </div>
    </>
  );
}