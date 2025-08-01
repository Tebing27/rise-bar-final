// components/blog/ShareButtons.tsx
'use client';

import { usePathname } from 'next/navigation';
import { Twitter, Facebook, Linkedin, Send } from 'lucide-react';
import { Button } from '@/components/ui/button';

export function ShareButtons({ title }: { title: string }) {
  const pathname = usePathname();
  const url = `${process.env.NEXT_PUBLIC_SITE_URL}${pathname}`;

  const shareLinks = [
    {
      name: 'Twitter',
      icon: Twitter,
      href: `https://twitter.com/intent/tweet?url=${encodeURIComponent(url)}&text=${encodeURIComponent(title)}`,
    },
    {
      name: 'Facebook',
      icon: Facebook,
      href: `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(url)}`,
    },
    {
      name: 'LinkedIn',
      icon: Linkedin,
      href: `https://www.linkedin.com/shareArticle?mini=true&url=${encodeURIComponent(url)}&title=${encodeURIComponent(title)}`,
    },
    {
      name: 'WhatsApp',
      icon: Send,
      href: `https://api.whatsapp.com/send?text=${encodeURIComponent(`${title}\n${url}`)}`,
    },
  ];

  return (
    <div className="space-y-4">
        <div className="flex gap-2">
            {shareLinks.map((link) => (
                <a
                key={link.name}
                href={link.href}
                target="_blank"
                rel="noopener noreferrer"
                >
                <Button variant="outline" size="icon">
                    <link.icon className="h-4 w-4" />
                    <span className="sr-only">Share on {link.name}</span>
                </Button>
                </a>
            ))}
        </div>
    </div>
  );
}