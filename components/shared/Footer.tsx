// ricebarfinal/components/shared/Footer.tsx
export function Footer() {
  return (
    <footer className="bg-gray-900 text-white py-12">
      <div className="max-w-7xl mx-auto px-4">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          <div className="space-y-4">
            <h3 className="text-xl font-bold">GlucoseTracker</h3>
            <p className="text-gray-400">
              Solusi modern untuk pemantauan kesehatan Anda.
            </p>
          </div>
          <div className="space-y-4">
            <h3 className="text-xl font-bold">Layanan</h3>
            <ul className="space-y-2">
              <li>Pemantauan Glukosa</li>
              <li>Analisis Data</li>
              <li>Artikel Kesehatan</li>
            </ul>
          </div>
          <div className="space-y-4">
            <h3 className="text-xl font-bold">Tautan</h3>
            <ul className="space-y-2">
              <li><a href="/about" className="hover:text-green-400">Tentang</a></li>
              <li><a href="/blog" className="hover:text-green-400">Blog</a></li>
              <li><a href="/login" className="hover:text-green-400">Login</a></li>
            </ul>
          </div>
          <div className="space-y-4">
            <h3 className="text-xl font-bold">Ikuti Kami</h3>
            {/* Tambahkan ikon media sosial di sini jika diperlukan */}
          </div>
        </div>
        <div className="border-t border-gray-800 mt-8 pt-8 text-center">
          <p>&copy; {new Date().getFullYear()} GlucoseTracker. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
}