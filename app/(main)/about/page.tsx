// app/(main)/about/page.tsx
import { getSiteContentAsMap } from '@/lib/content';

export default async function AboutPage() {
  const content = await getSiteContentAsMap();

  return (
    <div className="mx-auto max-w-3xl py-12 px-4 prose lg:prose-xl">
      <h1>Tentang Glucose Tracker</h1>
      <p>{content.about_paragraph_1 || 'Konten belum diatur.'}</p>
      <p>{content.about_paragraph_2 || 'Konten belum diatur.'}</p>
    </div>
  );
}