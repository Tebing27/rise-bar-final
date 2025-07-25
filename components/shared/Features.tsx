// components/shared/Features.tsx - Modern Features Section
import { BarChart, ClipboardList, BrainCircuit, Shield, Zap, Users } from 'lucide-react';

const features = [
  {
    name: 'Pencatatan Mudah',
    description: 'Catat kadar gula darah, makanan, dan aktivitas Anda hanya dengan beberapa klik. Interface yang intuitif memudahkan penggunaan sehari-hari.',
    icon: ClipboardList,
    color: 'from-blue-500 to-cyan-500',
  },
  {
    name: 'Visualisasi Data',
    description: 'Lihat tren kesehatan Anda melalui grafik interaktif yang mudah dipahami. Dashboard yang informatif dan menarik secara visual.',
    icon: BarChart,
    color: 'from-purple-500 to-pink-500',
  },
  {
    name: 'Analisis Cerdas',
    description: 'Dapatkan wawasan dan rekomendasi berdasarkan data yang Anda masukkan untuk pengelolaan yang lebih baik dengan teknologi AI.',
    icon: BrainCircuit,
    color: 'from-green-500 to-emerald-500',
  },
  {
    name: 'Keamanan Data',
    description: 'Data kesehatan Anda dilindungi dengan enkripsi tingkat enterprise. Privasi dan keamanan adalah prioritas utama kami.',
    icon: Shield,
    color: 'from-orange-500 to-red-500',
  },
  {
    name: 'Performa Cepat',
    description: 'Aplikasi yang responsif dan cepat. Akses data Anda kapan saja tanpa delay, bahkan dengan koneksi internet yang lambat.',
    icon: Zap,
    color: 'from-yellow-500 to-orange-500',
  },
  {
    name: 'Komunitas Sehat',
    description: 'Bergabung dengan komunitas pengguna yang saling mendukung dalam perjalanan menuju hidup yang lebih sehat.',
    icon: Users,
    color: 'from-indigo-500 to-purple-500',
  },
];

export function Features() {
  return (
    <section id="fitur" className="section-padding bg-gradient-to-b from-background to-muted/20">
      <div className="container-modern">
        <div className="text-center max-w-3xl mx-auto mb-20 animate-fade-in">
          <div className="inline-flex items-center gap-2 bg-primary/10 text-primary px-4 py-2 rounded-full text-sm font-medium mb-6">
            <BrainCircuit className="w-4 h-4" />
            Fitur Unggulan
          </div>
          <h2 className="text-4xl md:text-5xl font-bold tracking-tight mb-6">
            Semua yang Anda Butuhkan untuk
            <span className="text-gradient"> Hidup Sehat</span>
          </h2>
          <p className="text-xl text-muted-foreground leading-relaxed">
            Platform kami menyediakan alat-alat canggih dan mudah digunakan untuk membantu Anda memahami dan mengambil tindakan yang tepat dalam mengelola kesehatan.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {features.map((feature, index) => (
            <div
              key={feature.name}
              className="group modern-card card-hover animate-fade-in"
              style={{ animationDelay: `${index * 100}ms` }}
            >
              {/* Icon with Gradient Background */}
              <div className="relative mb-6">
                <div className={`w-16 h-16 rounded-2xl bg-gradient-to-r ${feature.color} p-0.5`}>
                  <div className="w-full h-full bg-white rounded-2xl flex items-center justify-center">
                    <feature.icon className="w-8 h-8 text-gray-700" />
                  </div>
                </div>
                {/* Glow Effect */}
                <div className={`absolute inset-0 w-16 h-16 rounded-2xl bg-gradient-to-r ${feature.color} opacity-20 blur-xl group-hover:opacity-40 transition-opacity duration-300`} />
              </div>

              {/* Content */}
              <div>
                <h3 className="text-xl font-bold text-foreground mb-3 group-hover:text-primary transition-colors duration-200">
                  {feature.name}
                </h3>
                <p className="text-muted-foreground leading-relaxed">
                  {feature.description}
                </p>
              </div>

              {/* Hover Effect Border */}
              <div className="absolute inset-0 rounded-2xl border-2 border-transparent group-hover:border-primary/20 transition-colors duration-300" />
            </div>
          ))}
        </div>

        {/* Bottom CTA */}
        <div className="text-center mt-20 animate-fade-in">
          <div className="inline-flex items-center gap-2 text-muted-foreground text-sm mb-4">
            <div className="w-2 h-2 bg-primary rounded-full animate-pulse" />
            Bergabung dengan ribuan pengguna yang sudah merasakan manfaatnya
          </div>
          <div className="flex items-center justify-center gap-8 text-sm text-muted-foreground">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 bg-green-100 rounded-full flex items-center justify-center">
                <span className="text-green-600 font-bold text-xs">✓</span>
              </div>
              <span>Gratis Selamanya</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center">
                <span className="text-blue-600 font-bold text-xs">✓</span>
              </div>
              <span>Data Aman</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 bg-purple-100 rounded-full flex items-center justify-center">
                <span className="text-purple-600 font-bold text-xs">✓</span>
              </div>
              <span>Support 24/7</span>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}