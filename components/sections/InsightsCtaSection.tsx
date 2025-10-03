import Image from "next/image";
import Link from "next/link";
import { ArrowUpRight } from "lucide-react";
import { getSiteContentAsMap } from "@/lib/content";

const InsightsCtaSection = async () => {
  const content = await getSiteContentAsMap();
  return (
    <section className="relative py-12 lg:py-20 xl:py-24 bg-gray-50">
      <div className="max-w-[1200px] mx-auto px-4">
        <div className="grid lg:grid-cols-2 gap-8 items-center">
          <div className="bg-green-100 p-8 md:p-12 rounded-lg flex flex-col justify-center">
            <div className="mb-6">
              <Image
                alt="Magnifying glass illustration"
                width={90}
                height={90}
                src={
                  content.cta_image ||
                  "https://slelguoygbfzlpylpxfs.supabase.co/storage/v1/object/public/test-clones/03ab0be7-345c-4de6-8b77-c1a3b786e28e-peekinsights-clone-vercel-app/assets/svgs/magnifying-glass-13-13.svg?"
                }
              />
            </div>
            <h2 className="text-3xl md:text-4xl font-bold leading-tight text-gray-800">
              {content.cta_headline || "Cerita di Balik Rise Bar"}
            </h2>
          </div>
          <div className="p-6 flex flex-col jusatify-center space-y-6">
            <p className="text-lg leading-relaxed text-gray-600">
              {content.cta_subheadline ||
                "Ayo jelajahi kisah Rise Bar, dari ide sederhana di Universitas Brawijaya hingga menjadi inovasi pangan sehat berbahan lokal yang mendukung gaya hidup aktif dan ramah lingkungan."}
            </p>
            <div className="pt-2">
              <Link
                href={content.cta_button_link || "/#tentang-kami"}
                className="inline-flex items-center gap-2 bg-black text-white font-medium rounded-lg px-6 py-4 text-base transition-colors hover:bg-gray-800"
              >
                {content.cta_button_text || "Jelajahi Cerita Kami"}
                <ArrowUpRight className="w-5 h-5" />
              </Link>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default InsightsCtaSection;
