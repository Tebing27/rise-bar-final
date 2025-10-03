// components/sections/VisualizedCroSection.tsx
import { getSiteContentAsMap } from "@/lib/content";
import ProductSlider from "./ProductSlider"; // Impor komponen client yang baru

export default async function VisualizedCroSection() {
  const content = await getSiteContentAsMap();

  const tabsData = [
    {
      name: content.product_section_tab1_name || "Tentang Produk",
      title: content.product_section_tab1_title || "Tentang Produk",
      description:
        content.product_section_tab1_description || "Deskripsi produk...",
      before: content.product_section_tab1_before_image || "/risebar_hero.webp",
      after: content.product_section_tab1_after_image || "/logo.webp",
    },
    {
      name: content.product_section_tab2_name || "Filosofi Logo",
      title: content.product_section_tab2_title || "Filosofi di Balik Logo",
      description:
        content.product_section_tab2_description || "Deskripsi filosofi...",
      before: content.product_section_tab2_before_image || "/risebar_hero.webp",
      after: content.product_section_tab2_after_image || "/logo.webp",
    },
  ];

  return (
    <ProductSlider
      tabsData={tabsData}
      pillText={
        content.product_section_pill_text || "Lebih Dekat dengan Rise Bar"
      }
      headline={
        content.product_section_headline ||
        "Dari Limbah Pertanian Menjadi Kebaikan"
      }
      subheadline={
        content.product_section_subheadline || "Inovasi Pangan Lokal"
      }
    />
  );
}
