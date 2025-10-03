import { Sparkles } from "lucide-react";
import Image from "next/image";
import { getSiteContentAsMap } from "@/lib/content";

const BenefitsSection = async () => {
  const content = await getSiteContentAsMap();

  return (
    <section
      id="tentang-kami"
      className="py-20 lg:py-[120px] px-4 bg-[#FDFBF8] space-y-10"
    >
      <div className="text-center space-y-4">
        <span className="inline-flex items-center gap-2 bg-[#C5F29B] text-black text-sm font-medium px-4 py-1.5 rounded-full">
          <Sparkles className="w-4 h-4" />
          {content.benefits_pill_text || "Rise Bar"}
        </span>
        <h2 className="font-display text-3xl md:text-4xl lg:text-[40px] text-black font-normal leading-tight [text-wrap:balance]">
          {content.benefits_headline || "Tentang Kami"}
        </h2>
      </div>

      <div className="container mx-auto max-w-6xl">
        <div className="bg-white border border-gray-200 rounded-xl grid grid-cols-1 lg:grid-cols-2 items-center gap-5 p-3 lg:p-4">
          <div className="relative w-full h-full aspect-square lg:aspect-auto self-stretch rounded-lg overflow-hidden">
            <Image
              alt="Tentang Rise Bar"
              src={content.benefits_image1_url || "/risebar_hero.webp"}
              fill
              className="object-cover"
              sizes="(max-width: 1024px) 100vw, 50vw"
            />
          </div>

          <div className="space-y-4 p-2 md:p-4">
            <h3 className="font-display text-2xl md:text-3xl text-black font-normal leading-tight [text-wrap:balance]">
              <span className="relative inline-block">
                {content.benefits_subheadline1 || "Mengenal Rise Bar"}
                <span className="absolute left-0 bottom-0 h-[3px] w-full bg-[#B8E6B8] -mb-1"></span>
              </span>
            </h3>
            {/* Menggunakan div dengan kelas 'prose' untuk merender HTML */}
            <div
              className="text-gray-600 leading-relaxed prose prose-sm max-w-none prose-ul:list-disc prose-ul:ml-4 prose-li:my-1"
              dangerouslySetInnerHTML={{
                __html:
                  content.benefits_text1 || "Deskripsi tentang Rise Bar...",
              }}
            />
          </div>

          <div className="space-y-4 p-2 md:p-4 lg:pl-10">
            <h3 className="font-display text-2xl md:text-3xl text-black font-normal leading-tight [text-wrap:balance]">
              <span className="relative inline-block">
                {content.benefits_subheadline2 || "Visi Misi"}
                <span className="absolute left-0 bottom-0 h-[3px] w-full bg-[#B8E6B8] -mb-1"></span>
              </span>
            </h3>
            {/* Menggunakan div dengan kelas 'prose' untuk merender HTML */}
            <div
              className="text-gray-600 leading-relaxed prose prose-sm max-w-none prose-ol:list-decimal prose-ol:ml-4 prose-li:my-1"
              dangerouslySetInnerHTML={{
                __html: content.benefits_text2 || "Visi: ...",
              }}
            />
          </div>

          <div className="relative w-full h-full aspect-square lg:aspect-auto self-stretch rounded-lg overflow-hidden">
            <Image
              alt="Visi Misi Rise Bar"
              src={content.benefits_image2_url || "/risebar_hero.webp"}
              fill
              className="object-cover"
              sizes="(max-width: 1024px) 100vw, 50vw"
            />
          </div>
        </div>
      </div>
    </section>
  );
};

export default BenefitsSection;
