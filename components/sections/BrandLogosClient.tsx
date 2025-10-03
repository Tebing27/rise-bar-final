"use client"; // Ini adalah Client Component
import Image from "next/image";
import React from "react";

// Tipe untuk mendefinisikan struktur data logo
interface Logo {
  id: string;
  name: string;
  image_url: string;
}

// Tipe untuk props yang diterima komponen ini
interface BrandLogosClientProps {
  logos: Logo[];
  headline: string;
}

const BrandLogosClient = ({ logos, headline }: BrandLogosClientProps) => {
  // Duplikasi logo untuk efek marquee yang mulus dan tidak pernah kosong
  const extendedLogos =
    logos.length > 1 ? [...logos, ...logos, ...logos, ...logos] : logos;

  return (
    <section className="bg-white py-8">
      <div className="mx-auto flex max-w-[1200px] items-center gap-x-4 px-4">
        <h2 className="flex-shrink-0 text-sm font-semibold text-gray-600">
          {headline}
        </h2>
        <div className="relative flex-1 overflow-hidden">
          <div className="flex animate-marquee whitespace-nowrap">
            {extendedLogos.map((logo, index) => (
              <div
                key={`${logo.id}-${index}`}
                className="flex-shrink-0 px-10 lg:px-14 flex items-center"
              >
                <Image
                  src={logo.image_url}
                  alt={logo.name}
                  width={200}
                  height={64}
                  className="h-16 w-auto max-w-none object-contain"
                />
              </div>
            ))}
          </div>
        </div>
      </div>
      {/* Style JSX akan bekerja dengan benar di sini */}
      <style jsx>{`
        @keyframes marquee {
          0% {
            transform: translateX(0%);
          }
          100% {
            transform: translateX(-50%);
          }
        }
        .animate-marquee {
          animation: marquee 20s linear infinite;
        }
      `}</style>
    </section>
  );
};

export default BrandLogosClient;
