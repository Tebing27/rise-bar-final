import HeroSection from "@/components/sections/HeroSection";
import BrandLogosSection from "@/components/sections/BrandLogosSection";
import InsightsCtaSection from "@/components/sections/InsightsCtaSection";
import BenefitsSection from "@/components/sections/BenefitsSection";
import TestimonialsSection from "@/components/sections/TestimonialsSection";
import WhatsIncludedSection from "@/components/sections/WhatsIncludedSection";
import VisualizedCroSection from "@/components/sections/VisualizedCroSection";
import HowItWorksSection from "@/components/sections/HowItWorksSection";
import FooterSection from "@/components/sections/FooterSection";
import { Navbar } from "@/components/shared/Navbar";

export default function HomePage() {
  return (
    <main className="min-h-screen">
      <Navbar />
      <HeroSection />
      <BrandLogosSection />
      <InsightsCtaSection />
      <BenefitsSection />
      <HowItWorksSection />
      <VisualizedCroSection />
      <TestimonialsSection />
      <WhatsIncludedSection />
      <FooterSection />
    </main>
  );
}
