// scripts/seed.js
const { createClient } = require('@supabase/supabase-js');
const bcrypt = require('bcryptjs');
require('dotenv').config({ path: '.env.local' });

// Konfigurasi admin default
const ADMIN_EMAIL = 'ricebar@gmail.com';
const ADMIN_PASSWORD = 'ricebarPKM';

async function main() {
  // WAJIB menggunakan SERVICE_ROLE_KEY untuk bisa menulis ke DB dari script
  const supabaseAdmin = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL,
    process.env.SUPABASE_SERVICE_ROLE_KEY
  );

  console.log('Memulai proses seeding...');

  // 1. Cek apakah admin sudah ada
  const { data: existingAdmin } = await supabaseAdmin
    .from('users')
    .select('id')
    .eq('email', ADMIN_EMAIL)
    .single();

  if (existingAdmin) {
    console.log('Admin default sudah ada. Seeding dibatalkan.');
    return;
  }

  console.log('Admin default tidak ditemukan, membuat baru...');

  // 2. Dapatkan role_id untuk 'admin'
  const { data: adminRole, error: roleError } = await supabaseAdmin
    .from('roles')
    .select('id')
    .eq('name', 'admin')
    .single();

  if (roleError || !adminRole) {
    console.error('Error: Role "admin" tidak ditemukan di tabel roles.');
    return;
  }

  // 3. Hash password
  const hashedPassword = await bcrypt.hash(ADMIN_PASSWORD, 10);

  // 4. Masukkan admin baru
  const { error: insertError } = await supabaseAdmin.from('users').insert({
    email: ADMIN_EMAIL,
    password_hash: hashedPassword,
    role_id: adminRole.id,
    // Anda bisa menambahkan 'name' jika mau
    name: 'Default Admin',
  });

  if (insertError) {
    console.error('Gagal membuat admin default:', insertError.message);
  } else {
    console.log('✅ Admin default berhasil dibuat!');
    console.log(`   Email: ${ADMIN_EMAIL}`);
    console.log(`   Password: ${ADMIN_PASSWORD}`);
  }
}

main().catch((err) => {
  console.error('Proses seeding gagal:', err);
});