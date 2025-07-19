// lib/actions/fatsecretActions.ts
'use server';

async function getFatsecretToken() {
  try {
    const response = await fetch('https://oauth.fatsecret.com/connect/token', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
        'Authorization': 'Basic ' + Buffer.from(
          `${process.env.FATSECRET_CLIENT_ID}:${process.env.FATSECRET_CLIENT_SECRET}`
        ).toString('base64'),
      },
      body: 'grant_type=client_credentials&scope=basic',
      cache: 'no-store'
    });
    if (!response.ok) {
        console.error("Gagal mendapatkan token FatSecret:", await response.json());
        return null;
    }
    const data = await response.json();
    return data.access_token;
  } catch (error) {
    console.error("Error saat meminta token FatSecret:", error);
    return null;
  }
}

export async function searchFood(query: string) {
  if (!query) return [];
  try {
    const token = await getFatsecretToken();
    if (!token) throw new Error("Token FatSecret tidak valid.");

    const searchUrl = `https://platform.fatsecret.com/rest/server.api?method=foods.search&search_expression=${encodeURIComponent(query)}&format=json`;
    const response = await fetch(searchUrl, {
      headers: { Authorization: `Bearer ${token}` },
    });
    const data = await response.json();
    if (data.error) throw new Error(`API Error: ${data.error.message}`);
    return data.foods?.food ? (Array.isArray(data.foods.food) ? data.foods.food : [data.foods.food]) : [];
  } catch (error) {
    console.error("❌ [FATSECRET] Terjadi Error:", error);
    return [];
  }
}

export async function getFoodDetails(foodId: string) {
    try {
        const token = await getFatsecretToken();
        if (!token) throw new Error("Token FatSecret tidak valid.");

        const detailsUrl = `https://platform.fatsecret.com/rest/server.api?method=food.get.v2&food_id=${foodId}&format=json`;
        const response = await fetch(detailsUrl, {
            headers: { Authorization: `Bearer ${token}` },
        });
        const data = await response.json();
        if (data.error) throw new Error(`API Error on getFoodDetails: ${data.error.message}`);
        return data.food;
    } catch (error) {
        console.error("❌ [FATSECRET DETAILS] Terjadi Error:", error);
        return null;
    }
}