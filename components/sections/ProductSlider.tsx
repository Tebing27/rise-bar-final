"use client";

import { useState } from "react";
import Image from "next/image";

// Definisikan tipe data untuk Tab
interface TabData {
  name: string;
  title: string;
  description: string;
  before: string;
  after: string;
}

// Definisikan tipe untuk props komponen ini
interface ProductSliderProps {
  tabsData: TabData[];
  pillText: string;
  headline: string;
  subheadline: string;
}

// Gambar statis sederhana (tanpa slider)
const StaticImage = ({
  src,
  alt,
  label,
}: {
  src: string;
  alt: string;
  label?: string;
}) => {
  return (
    <div className="relative w-full aspect-[686/556] rounded-xl overflow-hidden border-gray-200">
      <Image
        src={src}
        alt={alt}
        layout="fill"
        objectFit="cover"
        quality={100}
        className="pointer-events-none"
      />
      {label && (
        <div className="absolute top-4 left-4 bg-black/50 text-white text-[10px] font-semibold px-2 py-1 rounded uppercase tracking-wider">
          {label}
        </div>
      )}
    </div>
  );
};

export default function ProductSlider({
  tabsData,
  pillText,
  headline,
  subheadline,
}: ProductSliderProps) {
  const [activeTab, setActiveTab] = useState(tabsData[0]?.name || "");
  const currentTab =
    tabsData.find((tab) => tab.name === activeTab) || tabsData[0];

  if (!currentTab) return null;

  // Pilih gambar utama: gunakan "after" jika tersedia, fallback ke "before"
  const mainImageSrc = currentTab.after || currentTab.before;

  return (
    <section id="produk" className="bg-[#FDFBF8] py-20 lg:py-[120px] px-4">
      <div className="container mx-auto max-w-6xl">
        <div className="text-center space-y-4">
          <span className="inline-flex items-center gap-2 bg-[#C5F29B] text-black text-sm font-medium px-4 py-1.5 rounded-full">
            {pillText}
          </span>
          <h2 className="font-display text-3xl md:text-4xl lg:text-[40px] text-black font-normal leading-tight mx-auto max-w-3xl [text-wrap:balance]">
            {headline}
          </h2>
          <p className="text-gray-600 text-lg max-w-2xl mx-auto [text-wrap:balance]">
            {subheadline}
          </p>
        </div>

        <div className="mt-12 mb-8 flex flex-wrap justify-center gap-3">
          {tabsData.map((tab) => (
            <button
              key={tab.name}
              onClick={() => setActiveTab(tab.name)}
              className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                activeTab === tab.name
                  ? "bg-black text-white"
                  : "bg-white text-black hover:bg-gray-100 border border-gray-200"
              }`}
            >
              {tab.name}
            </button>
          ))}
        </div>

        <div className="grid lg:grid-cols-2 gap-10 xl:gap-20 items-center">
          <div className="order-1 lg:order-1">
            <StaticImage
              src={mainImageSrc}
              alt={currentTab.title || "Gambar Produk"}
              label={currentTab.name}
            />
          </div>
          <div className="order-2 lg:order-2 space-y-8">
            <h3 className="font-display text-2xl text-black uppercase">
              {currentTab.title}
            </h3>
            <div className="space-y-6">
              <p className="text-gray-700 mt-1 leading-relaxed">
                {currentTab.description}
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
