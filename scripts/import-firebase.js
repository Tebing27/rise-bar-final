// scripts/import-firebase.js
const admin = require('firebase-admin');
const fs = require('fs');
const path = require('path');

// Ganti dengan path ke file service account Anda
const serviceAccount = require('../serviceAccountKey.json');

// Ganti dengan nama koleksi yang Anda inginkan
const COLLECTION_NAME = 'foods'; 

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount)
});

const db = admin.firestore();
const foodDataPath = path.join(__dirname, '..', 'nilai-gizi.json');
const foods = JSON.parse(fs.readFileSync(foodDataPath, 'utf8'));

async function importData() {
  console.log(`Mulai mengimpor ${foods.length} data makanan...`);

  // Firestore batch writes hanya bisa menangani 500 operasi sekaligus
  const batchSize = 500;
  for (let i = 0; i < foods.length; i += batchSize) {
    const batch = db.batch();
    const chunk = foods.slice(i, i + batchSize);
    
    chunk.forEach(food => {
      // Membersihkan 'serving_size' dan mengubahnya menjadi angka jika memungkinkan
      const servingSize = parseFloat(food.serving_size.replace(' g', '')) || 0;

      const docRef = db.collection(COLLECTION_NAME).doc(); // Firestore akan generate ID otomatis
      batch.set(docRef, {
        name: food.name,
        // Kita simpan versi lowercase untuk mempermudah pencarian
        name_lowercase: food.name.toLowerCase(), 
        serving_size_g: servingSize,
        sugar_g: food.sugar_g,
      });
    });

    await batch.commit();
    console.log(`Batch ${i / batchSize + 1} selesai.`);
  }

  console.log('Semua data berhasil diimpor!');
}

importData().catch(console.error);