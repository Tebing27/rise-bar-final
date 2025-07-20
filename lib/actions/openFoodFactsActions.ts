// lib/actions/openFoodFactsActions.ts
'use server';

// Tipe data untuk hasil pencarian
interface ProductSearchResult {
  code: string; // Ini adalah barcode/ID produk
  product_name: string;
}

// Tipe data untuk detail nutrisi (hanya membutuhkan sugars_100g)
interface ProductDetails {
    nutriments: {
        sugars_100g?: number;
    };
}

/**
 * Mencari produk makanan menggunakan API Open Food Facts untuk region Indonesia.
 */
export async function searchFood(query: string): Promise<{ food_id: string; food_name: string; }[]> {
  if (!query) return [];
  try {
    const searchUrl = `https://world.openfoodfacts.org/cgi/search.pl?search_terms=${encodeURIComponent(query)}&search_simple=1&action=process&json=1&cc=id`;
    const response = await fetch(searchUrl, {
      headers: { 'User-Agent': 'GlucoseTrackerApp - Web' },
    });

    if (!response.ok) {
      throw new Error(`Permintaan API gagal: ${response.status}`);
    }

    const data = await response.json();
    if (!data.products) return [];

    return data.products.map((product: ProductSearchResult) => ({
      food_id: product.code,
      food_name: product.product_name,
    }));
  } catch (error) {
    console.error("❌ [OpenFoodFacts Search] Terjadi Error:", error);
    return [];
  }
}

/**
 * Mendapatkan detail nutrisi (HANYA GULA) dari sebuah produk.
 */
export async function getFoodDetails(foodId: string): Promise<{ servings: { serving: { carbohydrate: string } } } | null> {
    try {
        // Meminta field 'nutriments' dari API
        const detailsUrl = `https://world.openfoodfacts.org/api/v2/product/${foodId}.json?fields=nutriments`;
        const response = await fetch(detailsUrl, {
            headers: { 'User-Agent': 'GlucoseTrackerApp - Web' },
        });

        if (!response.ok) {
            throw new Error(`Permintaan API gagal: ${response.status}`);
        }
        
        const data = await response.json();
        if (data.status !== 1 || !data.product) return null;

        const product: ProductDetails = data.product;

        // --- FOKUS HANYA PADA GULA ---
        const sugarPer100g = product.nutriments.sugars_100g;

        // Jika data gula tidak ada (undefined), maka kembalikan null.
        if (sugarPer100g === undefined) {
            console.warn(`Data gula tidak ditemukan untuk produk ${foodId}. Produk ini tidak dapat ditambahkan.`);
            return null;
        }
        
        // Jika data gula ada, kembalikan dalam format yang diharapkan.
        // Kita tetap menggunakan key 'carbohydrate' agar tidak perlu mengubah trackerActions.ts
        return {
            servings: {
                serving: {
                    carbohydrate: String(sugarPer100g)
                }
            }
        };

    } catch (error) {
        console.error("❌ [OpenFoodFacts Details] Terjadi Error:", error);
        return null;
    }
}