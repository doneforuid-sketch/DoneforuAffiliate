import React from 'react';
import {
  X,
  BookOpen,
  Camera,
  Cpu,
  BarChart3,
  Video,
  FileDown,
  Sparkles,
  CheckCircle2,
  HelpCircle,
  ShieldCheck,
  ChevronRight,
} from 'lucide-react';

interface TutorialModalProps {
  isOpen: boolean;
  onClose: () => void;
  onTryDemo: () => void;
}

export const TutorialModal: React.FC<TutorialModalProps> = ({
  isOpen,
  onClose,
  onTryDemo,
}) => {
  if (!isOpen) return null;

  const steps = [
    {
      step: '01',
      title: 'Ambil Screenshot TikTok Shop',
      icon: Camera,
      badge: 'Langkah Awal',
      color: 'bg-rose-50 text-[#FE2C55] border-rose-200',
      description:
        'Buka aplikasi TikTok > Masuk ke TikTok Shop Creator Center / Pusat Kreator Afiliasi > Cari produk yang ingin dianalisis > Ambil screenshot layar yang memuat informasi nama produk, total pesanan, jumlah kreator, CTR, atau tambah keranjang.',
      tip: 'Tips: Pastikan teks dan angka pada gambar terlihat jelas dan tidak blur.',
    },
    {
      step: '02',
      title: 'Upload atau Paste Gambar',
      icon: Sparkles,
      badge: 'Input Sistem',
      color: 'bg-cyan-50 text-cyan-700 border-cyan-200',
      description:
        'Tarik (drag & drop) gambar ke kotak upload, klik tombol pilih file, atau tekan tombol Ctrl+V (Cmd+V di Mac) untuk langsung paste dari clipboard. Anda juga bisa mengatur perkiraan rata-rata views per video Anda.',
      tip: 'Jika belum punya screenshot, Anda bisa klik tombol "Coba Demo Contoh" untuk melihat cara kerja sistem secara instan.',
    },
    {
      step: '03',
      title: 'AI Membaca & Menghitung Data Otomatis',
      icon: Cpu,
      badge: 'Pemrosesan Cerdas',
      color: 'bg-purple-50 text-purple-700 border-purple-200',
      description:
        'Klik tombol "Mulai Analisis AI". Mesin AI Vision akan mengekstrak metrik kunci secara real-time dan menerapkan algoritma statistik probabilitas untuk menguji kelayakan produk.',
      tip: 'Pemrosesan berlangsung 100% aman di memori (Zero Database Policy) tanpa menyimpan gambar Anda ke database.',
    },
    {
      step: '04',
      title: 'Baca Hasil Analisis & Skor Kelayakan',
      icon: BarChart3,
      badge: 'Evaluasi Pasar',
      color: 'bg-emerald-50 text-emerald-700 border-emerald-200',
      description:
        'Sistem akan menampilkan Skor Kelayakan Produk (0-100) beserta indikator: Sangat Layak, Layak Dicoba, atau Risiko Tinggi. Anda juga dapat melihat rasio persaingan antar kreator dan efektivitas keranjang.',
      tip: 'Skor di atas 70 menunjukkan produk berpotensi tinggi dengan rasio konversi yang sehat.',
    },
    {
      step: '05',
      title: 'Lihat Target Jumlah Video Variasi',
      icon: Video,
      badge: 'Kalkulasi Closing',
      color: 'bg-amber-50 text-amber-700 border-amber-200',
      description:
        'Ketahui secara pasti berapa jumlah minimal video variasi yang harus Anda upload agar mencapai target keyakinan closing 90%. Lengkap dengan tabel peluang kumulatif (1 video, 3 video, 5 video, dst.).',
      tip: 'Tidak perlu menebak-nebak lagi kapan akun afiliasi Anda akan pecah telur.',
    },
    {
      step: '06',
      title: 'Dapatkan Rekomendasi Hook & Download PDF',
      icon: FileDown,
      badge: 'Eksekusi Konten',
      color: 'bg-blue-50 text-blue-700 border-blue-200',
      description:
        'Gunakan rekomendasi Hook 3 detik pertama, sudut pandang pembeda, dan CTA yang disarankan sistem. Anda juga dapat mengedit angka secara manual, menyalin ringkasan teks ke WhatsApp, atau mendownload laporan resmi PDF.',
      tip: 'Simpan PDF untuk portofolio atau panduan jadwal posting harian Anda.',
    },
  ];

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-900/60 backdrop-blur-sm flex items-center justify-center p-4 sm:p-6 animate-fadeIn">
      <div className="bg-white rounded-2xl max-w-3xl w-full shadow-2xl border border-slate-200 overflow-hidden flex flex-col max-h-[90vh]">
        {/* Header Modal */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-200 bg-gradient-to-r from-slate-900 via-slate-800 to-slate-900 text-white">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-xl bg-[#FE2C55] flex items-center justify-center shadow-md">
              <BookOpen className="w-5 h-5 text-white" />
            </div>
            <div>
              <h3 className="text-base sm:text-lg font-black tracking-tight text-white flex items-center gap-1.5">
                Panduan Penggunaan Lengkap
              </h3>
              <p className="text-xs text-slate-300">
                Langkah mudah memprediksi closing produk TikTok Shop Affiliate
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-slate-300 hover:text-white hover:bg-slate-700/60 transition cursor-pointer"
            aria-label="Tutup panduan"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content Body */}
        <div className="overflow-y-auto p-6 space-y-6 flex-1">
          {/* Quick Highlight Banner */}
          <div className="bg-rose-50/70 border border-rose-200 rounded-xl p-4 flex items-start gap-3.5">
            <div className="p-2 rounded-lg bg-[#FE2C55] text-white shrink-0 mt-0.5">
              <Sparkles className="w-4 h-4" />
            </div>
            <div className="text-xs text-slate-700 leading-relaxed">
              <span className="font-bold text-slate-900 block text-sm mb-0.5">
                Tujuan Sistem Ini
              </span>
              Membantu kreator TikTok Shop Affiliate menentukan apakah suatu produk layak dipromosikan atau tidak, serta menghitung secara matematis <strong>berapa video variasi yang harus dibuat</strong> agar pasti terjadi penjualan (closing) tanpa buang waktu dan tenaga.
            </div>
          </div>

          {/* Steps List */}
          <div className="space-y-4">
            <h4 className="text-xs font-bold uppercase tracking-wider text-slate-500">
              Langkah Demi Langkah (Workflow)
            </h4>

            <div className="grid grid-cols-1 gap-3.5">
              {steps.map((item) => {
                const IconComponent = item.icon;
                return (
                  <div
                    key={item.step}
                    className="border border-slate-200/90 rounded-xl p-4 bg-white hover:border-slate-300 transition-all shadow-2xs group flex flex-col sm:flex-row items-start gap-3.5"
                  >
                    <div className="flex items-center gap-3 shrink-0">
                      <div className="w-8 h-8 rounded-lg bg-slate-900 text-white font-black text-xs flex items-center justify-center">
                        {item.step}
                      </div>
                      <div className={`p-2 rounded-lg border ${item.color}`}>
                        <IconComponent className="w-4 h-4" />
                      </div>
                    </div>

                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 mb-1 flex-wrap">
                        <h5 className="text-sm font-bold text-slate-900">
                          {item.title}
                        </h5>
                        <span className="text-[10px] font-semibold px-2 py-0.5 rounded-full bg-slate-100 text-slate-600 border border-slate-200">
                          {item.badge}
                        </span>
                      </div>
                      <p className="text-xs text-slate-600 leading-relaxed mb-2">
                        {item.description}
                      </p>
                      <div className="text-[11px] font-medium text-emerald-800 bg-emerald-50/70 border border-emerald-200/60 rounded-md px-2.5 py-1 inline-flex items-center gap-1.5">
                        <CheckCircle2 className="w-3 h-3 text-emerald-600 shrink-0" />
                        <span>{item.tip}</span>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Rumus & Logika Singkat */}
          <div className="border border-slate-200 rounded-xl p-4 bg-slate-50 space-y-2">
            <h5 className="text-xs font-bold text-slate-800 flex items-center gap-1.5">
              <HelpCircle className="w-3.5 h-3.5 text-slate-500" />
              Bagaimana Rumus Prediksi Bekerja?
            </h5>
            <p className="text-xs text-slate-600 leading-relaxed">
              Sistem menggunakan <strong>Distribusi Geometrik Statistik</strong>: Setiap video dengan views tertentu memiliki peluang closing berdasarkan CTR produk dan Checkout CR. Dari probabilitas tersebut, sistem menghitung kuantitas video yang dibutuhkan agar Anda mencapai tingkat keyakinan 90% (Closing Confidence).
            </p>
          </div>

          {/* Privacy Note */}
          <div className="flex items-center gap-2 text-xs text-slate-500 pt-1">
            <ShieldCheck className="w-4 h-4 text-emerald-600 shrink-0" />
            <span>
              <strong>Zero Database:</strong> Gambar dan data Anda tidak pernah disimpan permanen di database. Seluruh komputasi bersifat privat.
            </span>
          </div>
        </div>

        {/* Footer Modal */}
        <div className="px-6 py-3.5 bg-slate-50 border-t border-slate-200 flex flex-col sm:flex-row items-center justify-between gap-3">
          <button
            onClick={() => {
              onClose();
              onTryDemo();
            }}
            className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-4 py-2 rounded-xl text-xs font-bold bg-[#FE2C55] hover:bg-[#E0264B] text-white shadow-sm transition active:scale-95 cursor-pointer"
          >
            <Sparkles className="w-3.5 h-3.5" />
            <span>Coba Sekarang dengan Demo Contoh</span>
            <ChevronRight className="w-3.5 h-3.5" />
          </button>

          <button
            onClick={onClose}
            className="w-full sm:w-auto px-4 py-2 rounded-xl text-xs font-semibold text-slate-700 hover:bg-slate-200 transition cursor-pointer"
          >
            Tutup Panduan
          </button>
        </div>
      </div>
    </div>
  );
};
