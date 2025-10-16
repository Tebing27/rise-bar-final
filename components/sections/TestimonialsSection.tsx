"use client";
import React, { useState, useRef, useEffect } from "react";
import { db } from "@/lib/supabase";

interface Testimonial {
  id: string;
  quote: string;
  author: string;
  initials: string;
  customer_since: string | null;
  stars: number;
}

const StarIcon = ({ filled }: { filled: boolean }) => (
  <svg
    className={`w-6 h-6 ${filled ? "text-yellow-400" : "text-gray-300"}`}
    fill="currentColor"
    viewBox="0 0 20 20"
    xmlns="http://www.w3.org/2000/svg"
  >
    <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
  </svg>
);

const ArrowIcon = ({
  direction = "left",
}: {
  direction?: "left" | "right";
}) => (
  <svg
    className="w-6 h-6"
    fill="none"
    stroke="currentColor"
    viewBox="0 0 24 24"
    xmlns="http://www.w3.org/2000/svg"
  >
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth={2}
      d={
        direction === "left"
          ? "M10 19l-7-7m0 0l7-7m-7 7h18"
          : "M14 5l7 7m0 0l-7 7m7-7H3"
      }
    />
  </svg>
);

export default function TestimonialsSection() {
  const [testimonials, setTestimonials] = useState<Testimonial[]>([]);
  const [activeCard, setActiveCard] = useState<string | null>(null);
  const scrollContainerRef = useRef<HTMLDivElement>(null);
  const [cardWidth, setCardWidth] = useState(0);

  useEffect(() => {
    const fetchTestimonials = async () => {
      const { data, error } = await db
        .from("testimonials")
        .select("*")
        .order("created_at", { ascending: false });
      if (data) {
        setTestimonials(data);
      }
      if (error) {
        console.error("Error fetching testimonials:", error);
      }
    };
    fetchTestimonials();
  }, []);

  useEffect(() => {
    const calculateCardWidth = () => {
      if (
        scrollContainerRef.current &&
        scrollContainerRef.current.children.length > 0
      ) {
        const firstChild = scrollContainerRef.current
          .children[0] as HTMLElement;
        const gap = parseInt(
          window.getComputedStyle(scrollContainerRef.current).gap
        );
        setCardWidth(firstChild.offsetWidth + gap);
      }
    };

    if (testimonials.length > 0) {
      setTimeout(calculateCardWidth, 100);
    }
    window.addEventListener("resize", calculateCardWidth);
    return () => window.removeEventListener("resize", calculateCardWidth);
  }, [testimonials]);

  const scroll = (direction: "left" | "right") => {
    if (scrollContainerRef.current) {
      const scrollAmount = direction === "left" ? -cardWidth : cardWidth;
      scrollContainerRef.current.scrollBy({
        left: scrollAmount,
        behavior: "smooth",
      });
    }
  };

  if (testimonials.length === 0) {
    return null;
  }

  return (
    <section id="testimoni" className="bg-gray-100 py-16 sm:py-24">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-8">
          <h2 className="font-display text-4xl md:text-5xl text-gray-900 mb-4 sm:mb-0 text-center sm:text-left">
            Testimoni <br className="sm:hidden" />
            Rise Bar
          </h2>
          <div className="flex justify-center items-center gap-3">
            <button
              onClick={() => scroll("left")}
              aria-label="Previous testimonial"
              className="bg-[#C5F29B] border-2 cursor-pointer border-black rounded-lg p-2 sm:p-3 shadow-[4px_4px_0_0_#000] transition-all duration-200 ease-in-out hover:-translate-x-1 hover:-translate-y-1 hover:shadow-[6px_6px_0_0_#000] active:translate-x-0 active:translate-y-0 active:shadow-[2px_2px_0_0_#000]"
            >
              <ArrowIcon direction="left" />
            </button>
            <button
              onClick={() => scroll("right")}
              aria-label="Next testimonial"
              className="bg-[#C5F29B] border-2 cursor-pointer border-black rounded-lg p-2 sm:p-3 shadow-[4px_4px_0_0_#000] transition-all duration-200 ease-in-out hover:-translate-x-1 hover:-translate-y-1 hover:shadow-[6px_6px_0_0_#000] active:translate-x-0 active:translate-y-0 active:shadow-[2px_2px_0_0_#000]"
            >
              <ArrowIcon direction="right" />
            </button>
          </div>
        </div>
        <div className="relative">
          <div
            ref={scrollContainerRef}
            className="flex items-start overflow-x-auto gap-6 snap-x snap-mandatory scroll-smooth no-scrollbar py-3 px-4 scroll-p-4"
          >
            {testimonials.map((testimonial) => (
              <div
                key={testimonial.id}
                onTouchStart={() => setActiveCard(testimonial.id)}
                onTouchEnd={() => setActiveCard(null)}
                className={`
                  flex-shrink-0 w-[90%] sm:w-[45%] md:w-[30%] snap-start 
                  bg-white border-2 border-black rounded-2xl p-6 
                  flex flex-col justify-between cursor-pointer 
                  transition-all duration-300
                  md:hover:-translate-x-2 md:hover:-translate-y-2 md:hover:shadow-[8px_8px_0_0_#000]
                  ${
                    activeCard === testimonial.id
                      ? "-translate-x-1 -translate-y-1 shadow-[6px_6px_0_0_#000]"
                      : "shadow-[4px_4px_0_0_#000]"
                  }
                `}
                // style={{ minHeight: "320px" }}
              >
                <div>
                  <div className="bg-green-600 rounded-full w-12 h-12 flex items-center justify-center text-white text-4xl font-black mb-4">
                    &ldquo;
                  </div>
                  <div className="flex items-center gap-1 mb-4">
                    {[...Array(5)].map((_, i) => (
                      <StarIcon key={i} filled={i < testimonial.stars} />
                    ))}
                  </div>
                  <p className="text-gray-700 text-lg leading-relaxed">
                    {testimonial.quote}
                  </p>
                </div>
                <div className="flex items-center gap-4 mt-6">
                  <div className="bg-green-600 rounded-full w-12 h-12 flex items-center justify-center text-white font-bold text-xl">
                    {testimonial.initials}
                  </div>
                  <div>
                    <p className="font-bold text-gray-900 text-lg">
                      {testimonial.author}
                    </p>
                    <p className="text-gray-500 text-sm">
                      {testimonial.customer_since}
                    </p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
      <style jsx>{`
        .no-scrollbar::-webkit-scrollbar {
          display: none;
        }
        .no-scrollbar {
          -ms-overflow-style: none;
          scrollbar-width: none;
        }
      `}</style>
    </section>
  );
}
