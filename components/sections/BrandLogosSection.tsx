import { getSiteContentAsMap } from "@/lib/content";
import { db } from "@/lib/supabase";
import BrandLogosClient from "./BrandLogosClient"; // <-- Impor komponen client yang baru

// Fungsi untuk mengambil data logo dari database
async function getLogos() {
  const { data, error } = await db
    .from("brand_logos")
    .select("*")
    .order("display_order");
  if (error) {
    console.error("Error fetching logos:", error);
    return [];
  }
  return data || [];
}

// Ini adalah Server Component murni
const BrandLogosSection = async () => {
  // Ambil data konten dan data logo secara bersamaan
  const [content, logos] = await Promise.all([
    getSiteContentAsMap(),
    getLogos(),
  ]);

  // Jika tidak ada logo di database, jangan tampilkan apa-apa
  if (logos.length === 0) {
    return null;
  }

  // Render komponen klien dan kirimkan data sebagai props
  return (
    <BrandLogosClient
      logos={logos}
      headline={content.brands_headline || "Dipercaya oleh:"}
    />
  );
};

export default BrandLogosSection;
