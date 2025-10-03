// components/sections/HowItWorksSection.tsx
import { GitMerge } from "lucide-react";
import { getSiteContentAsMap } from "@/lib/content";

const HowItWorksSection = async () => {
  const content = await getSiteContentAsMap();

  return (
    <section id="visi-misi" className="py-20 lg:py-[120px] bg-white">
      <div className="max-w-6xl mx-auto px-4">
        <div className="text-center space-y-4 mb-12">
          <span className="inline-flex items-center gap-2 bg-secondary text-secondary-foreground text-sm font-medium px-4 py-1.5 rounded-full">
            <GitMerge className="w-4 h-4" />
            {content.howitworks_pill_text || "Perjalanan Kami"}
          </span>
          <h2 className="font-display text-4xl md:text-5xl text-black leading-tight [text-wrap:balance]">
            {content.howitworks_headline || "DARI IDE KECIL KE GERAKAN BESAR"}
          </h2>
        </div>
        <div className="grid grid-cols-1 gap-6">
          <div className="bg-gray-50 border border-gray-100 rounded-lg p-6 lg:p-8 space-y-4 relative overflow-hidden">
            <div className="relative z-10 space-y-4">
              <p
                className="text-gray-700 leading-relaxed"
                dangerouslySetInnerHTML={{
                  __html:
                    content.howitworks_text?.replace(/\n/g, "<br />") ||
                    "Perjalanan Rise Bar dimulai...",
                }}
              ></p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default HowItWorksSection;
