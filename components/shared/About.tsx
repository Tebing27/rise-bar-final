// components/shared/About.tsx
import Image from "next/image";

interface AboutProps {
  aboutTitle: string;
  aboutDescription: string;
  aboutMainParagraph: string;
  aboutMainMotto: string;
  pilltext_about: string;
  founderImages: string[]; // Array of image URLs for the four founders
  founderNames: string[]; // Array of names for the four founders
}

export function About({
  aboutTitle,
  aboutDescription,
  aboutMainParagraph,
  aboutMainMotto,
  pilltext_about,
  founderImages,
  founderNames,
}: AboutProps) {
  return (
    <section id="tentang-kami" className="bg-background py-24 sm:py-32">
      <div className="mx-auto max-w-7xl px-6 lg:px-8">
        {/* Judul Section */}
        <div className="mx-auto max-w-2xl text-center">
          <div className="inline-flex items-center gap-2 rounded-full bg-primary/10 px-4 py-1 text-sm font-semibold text-primary mb-4">
            {pilltext_about}
          </div>
          <h2 className="text-3xl font-bold tracking-tight text-foreground sm:text-4xl">
            {aboutTitle}
          </h2>
          <p className="mt-4 text-lg leading-8 text-foreground/60">
            {aboutDescription}
          </p>
        </div>

        {/* Konten Dua Kolom */}
        <div className="mt-16 grid grid-cols-1 md:grid-cols-2 gap-16 items-center">
          {/* Kolom Gambar */}
          <div className="flex justify-center animate-in fade-in zoom-in-95 duration-700">
            <div className="grid grid-cols-2 gap-6 justify-items-center">
              {founderImages.map((image, index) => (
                <div key={index} className="text-center">
                  <div className="w-40 h-40 overflow-hidden rounded-lg ">
                    <Image
                      src={image || "/risebar_hero.webp"} // Fallback image
                      alt={`Pendiri ${founderNames[index] || `Founder ${index + 1}`}`}
                      width={160}
                      height={160}
                      className="object-cover"
                    />
                  </div>
                  <p className="mt-4 text-lg font-semibold text-foreground">
                    {founderNames[index] || `Founder ${index + 1}`}
                  </p>
                </div>
              ))}
            </div>
          </div>

          {/* Kolom Teks dan Statistik */}
          <div className="animate-in fade-in slide-in-from-right-8 duration-700">
            <p className="mt-6 text-lg leading-8 text-foreground">
              {aboutMainParagraph}
            </p>
            <p className="mt-6 text-lg leading-8 text-foreground">
              {aboutMainMotto}
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}
