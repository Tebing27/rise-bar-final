"use client";

import { useState, useRef, useCallback, useEffect } from "react";
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

const ChevronsLeftRightIcon = (props: React.SVGProps<SVGSVGElement>) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width="24"
    height="24"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
    {...props}
  >
    <path d="m8 17-5-5 5-5" />
    <path d="m16 7 5 5-5 5" />
  </svg>
);

const BeforeAfterSlider = ({
  before,
  after,
}: {
  before: string;
  after: string;
}) => {
  const [sliderPosition, setSliderPosition] = useState(50);
  const [isDragging, setIsDragging] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  const handleMove = useCallback(
    (clientX: number) => {
      if (!isDragging || !containerRef.current) return;
      const rect = containerRef.current.getBoundingClientRect();
      const x = Math.max(0, Math.min(clientX - rect.left, rect.width));
      const percent = (x / rect.width) * 100;
      setSliderPosition(percent);
    },
    [isDragging]
  );

  const startDragging = () => setIsDragging(true);
  const stopDragging = () => setIsDragging(false);

  const onMouseMove = useCallback(
    (e: MouseEvent) => handleMove(e.clientX),
    [handleMove]
  );
  const onTouchMove = useCallback(
    (e: TouchEvent) => {
      if (e.touches[0]) handleMove(e.touches[0].clientX);
    },
    [handleMove]
  );

  useEffect(() => {
    if (isDragging) {
      window.addEventListener("mousemove", onMouseMove);
      window.addEventListener("touchmove", onTouchMove);
      window.addEventListener("mouseup", stopDragging);
      window.addEventListener("touchend", stopDragging);

      return () => {
        window.removeEventListener("mousemove", onMouseMove);
        window.removeEventListener("touchmove", onTouchMove);
        window.removeEventListener("mouseup", stopDragging);
        window.removeEventListener("touchend", stopDragging);
      };
    }
  }, [isDragging, onMouseMove, onTouchMove]);

  return (
    <div
      ref={containerRef}
      className={`relative w-full aspect-[686/556] rounded-xl overflow-hidden select-none group bg-gray-100 border border-gray-200 ${
        isDragging ? "cursor-ew-resize" : "cursor-default"
      }`}
      onMouseDown={startDragging}
      onTouchStart={startDragging}
    >
      <div className="absolute inset-0 cursor-ew-resize">
        <Image
          src={before}
          alt="Before design"
          layout="fill"
          objectFit="cover"
          quality={100}
          className="pointer-events-none"
        />
        <div className="absolute top-4 left-4 bg-black/50 text-white text-[10px] font-semibold px-2 py-1 rounded uppercase tracking-wider">
          Before
        </div>
      </div>

      <div
        className="absolute inset-0 cursor-ew-resize"
        style={{ clipPath: `inset(0 ${100 - sliderPosition}% 0 0)` }}
      >
        <Image
          src={after}
          alt="After design"
          layout="fill"
          objectFit="cover"
          quality={100}
          className="pointer-events-none"
        />
        <div className="absolute top-4 right-4 bg-black/50 text-white text-[10px] font-semibold px-2 py-1 rounded uppercase tracking-wider">
          After
        </div>
      </div>

      <div
        className="absolute top-0 bottom-0 w-0.5 bg-white cursor-ew-resize"
        style={{
          left: `${sliderPosition}%`,
          transform: "translateX(-50%)",
        }}
        onMouseDown={startDragging}
        onTouchStart={startDragging}
      >
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-10 h-10 rounded-full bg-white shadow-lg flex items-center justify-center pointer-events-none">
          <ChevronsLeftRightIcon className="w-5 h-5 text-gray-500" />
        </div>
      </div>
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
            <BeforeAfterSlider
              before={currentTab.before}
              after={currentTab.after}
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
