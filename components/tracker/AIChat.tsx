// components/tracker/AIChat.tsx
'use client';

import { useState } from 'react';
import { useActions, useUIState } from 'ai/rsc';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Bot, User, MessageCircle, X } from 'lucide-react';
import { AI } from '@/app/action';
import { cn } from '@/lib/utils';
import { BotMessage } from './BotMessage'; // <-- ✅ Pastikan impor BotMessage ada di sini
import { StreamableValue } from 'ai/rsc'

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
          className="rounded-full w-16 h-16 shadow-lg"
        >
          {isOpen ? <X className="w-8 h-8" /> : <MessageCircle className="w-8 h-8" />}
          <span className="sr-only">Buka Asisten AI</span>
        </Button>
      </div>
      <div
        className={cn(
          "fixed bottom-24 right-6 z-50 transition-all duration-300 ease-in-out",
          isOpen ? "opacity-100 translate-y-0" : "opacity-0 translate-y-4 pointer-events-none"
        )}
      >
        <Card className="w-[380px] h-[500px] flex flex-col bg-blue-50 dark:bg-blue-900/20">
          <CardHeader>
            <div className="flex items-center gap-3">
              <Bot className="w-8 h-8 text-primary" />
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
                  {msg.role === 'assistant' && <Bot className="w-6 h-6 text-primary flex-shrink-0" />}
                  
                  <div className={`rounded-lg p-3 max-w-sm ${msg.role === 'assistant' ? 'bg-muted' : 'bg-primary text-primary-foreground'}`}>
                    {msg.role === 'assistant' ? (
                      // Gunakan BotMessage untuk merender pesan dari AI
                      <BotMessage content={msg.display as StreamableValue<string>} />
                    ) : (
                      // Tampilkan pesan pengguna seperti biasa
                      msg.display
                    )}
                  </div>
                  
                  {msg.role === 'user' && <User className="w-6 h-6 text-muted-foreground flex-shrink-0" />}
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