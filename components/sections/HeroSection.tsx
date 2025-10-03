import Image from "next/image";
import { getSiteContentAsMap } from "@/lib/content";

const HeroSection = async () => {
  const content = await getSiteContentAsMap();

  return (
    <section className="relative min-h-screen py-20 lg:py-24 overflow-x-clip">
      {/* Background */}
      <div className="absolute inset-0 -z-10">
        <Image
          alt="hero-bg"
          src="https://slelguoygbfzlpylpxfs.supabase.co/storage/v1/object/public/test-clones/81954346-2d71-4407-878e-fa6c34e52479-yapp-ink/assets/images/next-360250-img-hero-bg.png?"
          fill
          priority
          className="object-cover"
          sizes="100vw"
        />
      </div>
      <div className="absolute bottom-0 left-0 -z-10 h-32 w-full bg-gradient-to-t from-white to-transparent"></div>

      <div className="container mx-auto px-4 max-w-[1200px]">
        <div className="grid lg:grid-cols-2 gap-12 lg:gap-8 items-center">
          {/* Text */}
          <div className="flex flex-col items-center lg:items-start lg:text-left space-y-6 z-10 order-2 lg:order-1">
            <h1 className="font-display text-[#1A1A1A] text-5xl md:text-[56px] font-normal leading-tight [text-wrap:balance]">
              {content.hero_headline || "Bangun Hari dengan Rise Bar"}
            </h1>
            <p className="font-body text-lg text-[#666666] max-w-lg [text-wrap:balance]">
              {content.hero_subheadline || "Snack bar sehat berbahan lokal..."}
            </p>
          </div>
          {/* Image + Floating Label */}
          <div className="relative w-full max-w-[550px] aspect-square mx-auto order-1 lg:order-2">
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[90%] h-[90%] bg-secondary rounded-lg" />
            <div className="absolute inset-0 flex items-center justify-center z-[1]">
              <Image
                src={content.hero_image || "/risebar_hero.webp"}
                alt="Rise Bar Product"
                width={380}
                height={600}
                priority
                className="w-auto h-auto max-w-[70%] max-h-[110%] object-contain drop-shadow-lg"
              />
            </div>
            <div className="absolute -top-2 right-0 sm:right-4 z-[2] flex flex-col items-center justify-center bg-blue-100 text-blue-800 p-4 rounded-xl shadow-lg w-40 text-center">
              <span className="text-lg font-bold">
                {content.hero_label1 || "Serat Tinggi"}
              </span>
            </div>
            <div className="absolute top-[35%] -left-6 sm:left-4 z-[2] flex flex-col items-center justify-center bg-yellow-100 text-yellow-800 p-4 rounded-xl shadow-lg w-40 text-center">
              <span className="text-lg font-bold">
                {content.hero_label2 || "Vitamin & Antioksidan"}
              </span>
            </div>
            <div className="absolute bottom-12 -right-2 sm:right-4 z-[2] bg-purple-100 text-purple-800 px-6 py-3 rounded-full shadow-lg font-bold text-lg">
              {content.hero_label3 || "Praktis & Lezat"}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default HeroSection;
