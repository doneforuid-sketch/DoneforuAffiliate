import React, { useState, useEffect } from 'react';
import {
  X,
  BookOpen,
  Camera,
  Cpu,
  BarChart3,
  Video,
  Sparkles,
  CheckCircle2,
  ChevronRight,
  ChevronLeft,
  ShieldCheck,
  Zap,
  Layers,
  ArrowRight,
  HelpCircle,
  Copy,
  Sliders,
  Check,
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
  const [currentStep, setCurrentStep] = useState(0);
  const [activeMetricHotspot, setActiveMetricHotspot] = useState<string>('ctr');
  const [simulatedViews, setSimulatedViews] = useState<number>(1000);
  const [selectedScoreCard, setSelectedScoreCard] = useState<'high' | 'medium' | 'low'>('high');
  const [copiedHook, setCopiedHook] = useState(false);

  // Keyboard navigation
  useEffect(() => {
    if (!isOpen) return;

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        onClose();
      } else if (e.key === 'ArrowRight') {
        setCurrentStep((prev) => Math.min(prev + 1, 4));
      } else if (e.key === 'ArrowLeft') {
        setCurrentStep((prev) => Math.max(prev - 1, 0));
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose]);

  // Reset to step 0 when reopened
  useEffect(() => {
    if (isOpen) {
      setCurrentStep(0);
    }
  }, [isOpen]);

  if (!isOpen) return null;

  const totalSteps = 5;

  const stepsMeta = [
    {
      id: 'step-1',
      number: '01',
      title: 'Screenshot TikTok Shop',
      shortTitle: 'Screenshot',
      badge: 'Langkah Awal',
      icon: Camera,
    },
    {
      id: 'step-2',
      number: '02',
      title: 'Upload / Paste Gambar',
      shortTitle: 'Input Data',
      badge: 'Input Sistem',
      icon: Layers,
    },
    {
      id: 'step-3',
      number: '03',
      title: 'AI Vision & Privasi Aman',
      shortTitle: 'Proses AI',
      badge: 'Zero Database',
      icon: Cpu,
    },
    {
      id: 'step-4',
      number: '04',
      title: 'Skor Kelayakan Produk',
      shortTitle: 'Skor Pasar',
      badge: 'Evaluasi Produk',
      icon: BarChart3,
    },
    {
      id: 'step-5',
      number: '05',
      title: 'Target Video & Hook 3 Detik',
      shortTitle: 'Target & Hook',
      badge: 'Strategi Closing',
      icon: Video,
    },
  ];

  const handleNext = () => {
    if (currentStep < totalSteps - 1) {
      setCurrentStep((prev) => prev + 1);
    } else {
      onClose();
    }
  };

  const handlePrev = () => {
    if (currentStep > 0) {
      setCurrentStep((prev) => prev - 1);
    }
  };

  const copyHookSample = (text: string) => {
    navigator.clipboard.writeText(text);
    setCopiedHook(true);
    setTimeout(() => setCopiedHook(false), 2000);
  };

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-labelledby="tutorial-modal-title"
      className="fixed inset-0 z-50 overflow-y-auto bg-slate-950/70 backdrop-blur-sm flex items-center justify-center p-3 sm:p-5 animate-in fade-in duration-200"
    >
      <div className="bg-white rounded-3xl max-w-3xl w-full shadow-2xl border border-slate-200/90 overflow-hidden flex flex-col max-h-[92vh] sm:max-h-[88vh]">
        {/* Header Modal */}
        <div className="px-5 sm:px-7 py-4 border-b border-slate-800 bg-[#121212] text-white flex items-center justify-between relative overflow-hidden">
          {/* Subtle Ambient Lights */}
          <div className="absolute -left-6 -top-6 w-28 h-28 bg-[#25F4EE]/20 rounded-full blur-2xl pointer-events-none" />
          <div className="absolute -right-6 -bottom-6 w-28 h-28 bg-[#FE2C55]/20 rounded-full blur-2xl pointer-events-none" />

          <div className="flex items-center gap-3 relative z-10">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-[#FE2C55] to-[#FF5475] flex items-center justify-center shadow-md">
              <BookOpen className="w-5 h-5 text-white" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3
                  id="tutorial-modal-title"
                  className="text-base sm:text-lg font-black tracking-tight text-white flex items-center gap-1.5"
                >
                  Panduan Interaktif Pengguna Baru
                </h3>
                <span className="hidden sm:inline-flex text-[10px] uppercase font-bold tracking-wider px-2 py-0.5 rounded-full bg-slate-800 text-[#25F4EE] border border-slate-700">
                  Langkah {currentStep + 1} dari {totalSteps}
                </span>
              </div>
              <p className="text-xs text-slate-400 mt-0.5">
                5 langkah ringkas memprediksi closing & kuantitas video affiliasi
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-2 rounded-xl text-slate-400 hover:text-white hover:bg-slate-800 transition cursor-pointer relative z-10"
            title="Tutup panduan (Esc)"
            aria-label="Tutup panduan"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Interactive Step Navigator Tabs */}
        <div className="bg-slate-50 border-b border-slate-200 px-4 sm:px-7 py-2.5 overflow-x-auto no-scrollbar">
          <div className="flex items-center gap-1 sm:gap-2 min-w-max">
            {stepsMeta.map((step, idx) => {
              const isCurrent = idx === currentStep;
              const isPast = idx < currentStep;
              const Icon = step.icon;

              return (
                <button
                  key={step.id}
                  onClick={() => setCurrentStep(idx)}
                  className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                    isCurrent
                      ? 'bg-slate-900 text-white shadow-xs'
                      : isPast
                      ? 'bg-emerald-50 text-emerald-800 hover:bg-emerald-100 border border-emerald-200/80'
                      : 'text-slate-500 hover:text-slate-800 hover:bg-slate-200/60'
                  }`}
                >
                  <span
                    className={`w-4 h-4 rounded-full flex items-center justify-center text-[10px] font-black ${
                      isCurrent
                        ? 'bg-[#FE2C55] text-white'
                        : isPast
                        ? 'bg-emerald-600 text-white'
                        : 'bg-slate-200 text-slate-600'
                    }`}
                  >
                    {isPast ? <Check className="w-2.5 h-2.5 stroke-[3]" /> : idx + 1}
                  </span>
                  <span>{step.shortTitle}</span>
                </button>
              );
            })}
          </div>
        </div>

        {/* Step Progress Line */}
        <div className="w-full bg-slate-100 h-1">
          <div
            className="h-full bg-gradient-to-r from-[#25F4EE] to-[#FE2C55] transition-all duration-300 ease-out"
            style={{ width: `${((currentStep + 1) / totalSteps) * 100}%` }}
          />
        </div>

        {/* Main Step Content Area */}
        <div className="overflow-y-auto p-5 sm:p-7 flex-1 space-y-5">
          {/* STEP 1: AMBIL SCREENSHOT TIKTOK SHOP */}
          {currentStep === 0 && (
            <div className="space-y-4 animate-in fade-in duration-150">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-slate-100 pb-3">
                <div>
                  <span className="text-[11px] font-bold uppercase tracking-wider text-[#FE2C55]">
                    Langkah 01 • Persiapan
                  </span>
                  <h4 className="text-lg font-black text-slate-900">
                    Ambil Screenshot Analitik di TikTok Shop
                  </h4>
                </div>
                <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[11px] font-semibold bg-rose-50 text-[#FE2C55] border border-rose-200 w-fit">
                  <Camera className="w-3.5 h-3.5" />
                  Pusat Kreator Afiliasi
                </span>
              </div>

              <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
                Buka aplikasi TikTok Anda &gt; menu <strong>Pusat Kreator TikTok Shop</strong> (atau Marketplace Produk Afiliasi) &gt; cari produk yang ingin Anda promosikan &gt; ambil tangkapan layar (screenshot) layar detailnya.
              </p>

              {/* Interactive Mockup Component */}
              <div className="bg-slate-900 text-white rounded-2xl p-4 sm:p-5 border border-slate-800 shadow-md">
                <div className="flex items-center justify-between border-b border-slate-800 pb-2 mb-3">
                  <div className="flex items-center gap-2">
                    <span className="w-2.5 h-2.5 rounded-full bg-rose-500" />
                    <span className="text-xs font-bold text-slate-300">
                      Simulasi Tangkapan Layar TikTok Shop
                    </span>
                  </div>
                  <span className="text-[10px] text-slate-400">
                    Klik item di bawah untuk melihat kegunaannya
                  </span>
                </div>

                <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 mb-3">
                  <button
                    type="button"
                    onClick={() => setActiveMetricHotspot('name')}
                    className={`p-2.5 rounded-xl text-left border transition cursor-pointer ${
                      activeMetricHotspot === 'name'
                        ? 'bg-slate-800 border-[#25F4EE] text-white ring-1 ring-[#25F4EE]'
                        : 'bg-slate-800/50 border-slate-700/60 text-slate-300 hover:bg-slate-800'
                    }`}
                  >
                    <span className="block text-[10px] text-slate-400">Nama Produk</span>
                    <span className="text-xs font-bold truncate block">Wired Earphone</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => setActiveMetricHotspot('orders')}
                    className={`p-2.5 rounded-xl text-left border transition cursor-pointer ${
                      activeMetricHotspot === 'orders'
                        ? 'bg-slate-800 border-[#25F4EE] text-white ring-1 ring-[#25F4EE]'
                        : 'bg-slate-800/50 border-slate-700/60 text-slate-300 hover:bg-slate-800'
                    }`}
                  >
                    <span className="block text-[10px] text-slate-400">Total Pesanan</span>
                    <span className="text-xs font-bold text-[#25F4EE]">19.500 pcs</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => setActiveMetricHotspot('creators')}
                    className={`p-2.5 rounded-xl text-left border transition cursor-pointer ${
                      activeMetricHotspot === 'creators'
                        ? 'bg-slate-800 border-[#25F4EE] text-white ring-1 ring-[#25F4EE]'
                        : 'bg-slate-800/50 border-slate-700/60 text-slate-300 hover:bg-slate-800'
                    }`}
                  >
                    <span className="block text-[10px] text-slate-400">Total Kreator</span>
                    <span className="text-xs font-bold text-amber-400">21.000 user</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => setActiveMetricHotspot('ctr')}
                    className={`p-2.5 rounded-xl text-left border transition cursor-pointer ${
                      activeMetricHotspot === 'ctr'
                        ? 'bg-slate-800 border-[#25F4EE] text-white ring-1 ring-[#25F4EE]'
                        : 'bg-slate-800/50 border-slate-700/60 text-slate-300 hover:bg-slate-800'
                    }`}
                  >
                    <span className="block text-[10px] text-slate-400">Rasio CTR</span>
                    <span className="text-xs font-bold text-[#FE2C55]">2,6%</span>
                  </button>
                </div>

                {/* Hotspot detail explanation */}
                <div className="bg-slate-800/90 rounded-xl p-3 text-xs border border-slate-700 text-slate-200">
                  {activeMetricHotspot === 'name' && (
                    <p>
                      <strong>Nama Produk:</strong> Digunakan oleh sistem untuk menganalisis kategori ceruk pasar, perilaku konsumen, dan membuat rekomendasi Hook konten yang spesifik.
                    </p>
                  )}
                  {activeMetricHotspot === 'orders' && (
                    <p>
                      <strong>Total Pesanan:</strong> Mengukur volume permintaan riil di pasar TikTok. Semakin besar pesanan riil, semakin terbukti produk diminati audiens.
                    </p>
                  )}
                  {activeMetricHotspot === 'creators' && (
                    <p>
                      <strong>Total Kreator:</strong> Mengukur saturasi kompetisi antar sesama affiliate. Dibagi dengan pesanan untuk menghitung apakah pasar sudah terlalu sesak atau masih gurih.
                    </p>
                  )}
                  {activeMetricHotspot === 'ctr' && (
                    <p>
                      <strong>CTR (Click-Through Rate):</strong> Persentase penonton yang mengeklik keranjang kuning. Angka kunci untuk menghitung probabilitas closing per video Anda!
                    </p>
                  )}
                </div>
              </div>

              <div className="bg-emerald-50 border border-emerald-200 rounded-xl p-3 text-xs text-emerald-900 flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                <span>
                  <strong>Tips Praktis:</strong> Pastikan gambar screenshot tidak buram agar angka metrik terbaca jelas oleh sensor AI Vision.
                </span>
              </div>
            </div>
          )}

          {/* STEP 2: UPLOAD ATAU PASTE GAMBAR */}
          {currentStep === 1 && (
            <div className="space-y-4 animate-in fade-in duration-150">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-slate-100 pb-3">
                <div>
                  <span className="text-[11px] font-bold uppercase tracking-wider text-cyan-700">
                    Langkah 02 • Input Cepat
                  </span>
                  <h4 className="text-lg font-black text-slate-900">
                    Upload File atau Langsung Paste (Ctrl+V)
                  </h4>
                </div>
                <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[11px] font-semibold bg-cyan-50 text-cyan-800 border border-cyan-200 w-fit">
                  <Zap className="w-3.5 h-3.5 text-cyan-600" />
                  Mendukung Paste Clipboard
                </span>
              </div>

              <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
                Anda memiliki 3 cara mudah memasukkan gambar ke sistem:
              </p>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <div className="p-3.5 rounded-2xl border border-slate-200 bg-white shadow-2xs">
                  <div className="w-7 h-7 rounded-lg bg-rose-100 text-[#FE2C55] font-black text-xs flex items-center justify-center mb-2">
                    1
                  </div>
                  <h5 className="text-xs font-bold text-slate-900 mb-1">Drag & Drop</h5>
                  <p className="text-[11px] text-slate-500 leading-relaxed">
                    Tarik file dari folder komputer Anda langsung ke kotak unggah.
                  </p>
                </div>

                <div className="p-3.5 rounded-2xl border border-slate-200 bg-white shadow-2xs">
                  <div className="w-7 h-7 rounded-lg bg-cyan-100 text-cyan-700 font-black text-xs flex items-center justify-center mb-2">
                    2
                  </div>
                  <h5 className="text-xs font-bold text-slate-900 mb-1">Shortcut Ctrl+V</h5>
                  <p className="text-[11px] text-slate-500 leading-relaxed">
                    Setelah screenshot (Snipping Tool/Mac), langsung tekan <strong>Ctrl+V</strong> di mana saja.
                  </p>
                </div>

                <div className="p-3.5 rounded-2xl border border-slate-200 bg-white shadow-2xs">
                  <div className="w-7 h-7 rounded-lg bg-purple-100 text-purple-700 font-black text-xs flex items-center justify-center mb-2">
                    3
                  </div>
                  <h5 className="text-xs font-bold text-slate-900 mb-1">Tombol Pilih File</h5>
                  <p className="text-[11px] text-slate-500 leading-relaxed">
                    Klik tombol telusuri untuk memilih file gambar (PNG, JPG, atau WebP).
                  </p>
                </div>
              </div>

              {/* Interactive Views Simulation */}
              <div className="bg-slate-50 border border-slate-200 rounded-2xl p-4">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-xs font-bold text-slate-800 flex items-center gap-1.5">
                    <Sliders className="w-3.5 h-3.5 text-slate-500" />
                    Simulasi Rata-rata Views Akun Anda:
                  </span>
                  <span className="text-xs font-black text-indigo-600 bg-indigo-50 border border-indigo-200 px-2 py-0.5 rounded-lg">
                    {simulatedViews.toLocaleString()} Views / Video
                  </span>
                </div>
                <div className="grid grid-cols-3 gap-2">
                  {[500, 1000, 3000].map((v) => (
                    <button
                      key={v}
                      type="button"
                      onClick={() => setSimulatedViews(v)}
                      className={`py-2 px-3 rounded-xl text-xs font-bold border transition cursor-pointer ${
                        simulatedViews === v
                          ? 'bg-slate-900 text-white border-slate-900 shadow-xs'
                          : 'bg-white text-slate-700 border-slate-200 hover:bg-slate-100'
                      }`}
                    >
                      {v.toLocaleString()} Views
                    </button>
                  ))}
                </div>
                <p className="text-[11px] text-slate-500 mt-2 leading-relaxed">
                  Jika akun baru/views kecil (500), Anda butuh sedikit lebih banyak video untuk pasti closing. Jika views Anda 3.000+, target closing dicapai jauh lebih cepat!
                </p>
              </div>
            </div>
          )}

          {/* STEP 3: PEMROSESAN AI & ZERO DATABASE */}
          {currentStep === 2 && (
            <div className="space-y-4 animate-in fade-in duration-150">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-slate-100 pb-3">
                <div>
                  <span className="text-[11px] font-bold uppercase tracking-wider text-purple-700">
                    Langkah 03 • Pemrosesan Cerdas
                  </span>
                  <h4 className="text-lg font-black text-slate-900">
                    Ekstraksi AI Vision & Komputasi Statistik
                  </h4>
                </div>
                <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[11px] font-semibold bg-purple-50 text-purple-700 border border-purple-200 w-fit">
                  <Cpu className="w-3.5 h-3.5 text-purple-600" />
                  AI OCR + Probabilitas
                </span>
              </div>

              <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
                Setelah Anda menekan tombol <strong>Mulai Analisis AI</strong>, sistem menjalankan 3 tahap komputasi otomatis secara realtime:
              </p>

              {/* Visual Pipeline */}
              <div className="space-y-2.5">
                <div className="flex items-start gap-3 p-3.5 rounded-2xl bg-white border border-slate-200 shadow-2xs">
                  <div className="w-8 h-8 rounded-xl bg-purple-50 text-purple-700 flex items-center justify-center shrink-0 font-black text-xs border border-purple-200">
                    1
                  </div>
                  <div>
                    <h5 className="text-xs font-bold text-slate-900">Ekstraksi Metrik Visual (AI OCR)</h5>
                    <p className="text-[11px] text-slate-600 leading-relaxed mt-0.5">
                      Model Vision membaca angka CTR, Pesanan, Kreator, dan Keranjang langsung dari gambar tanpa Anda perlu mengetik ulang manual satu per satu.
                    </p>
                  </div>
                </div>

                <div className="flex items-start gap-3 p-3.5 rounded-2xl bg-white border border-slate-200 shadow-2xs">
                  <div className="w-8 h-8 rounded-xl bg-cyan-50 text-cyan-700 flex items-center justify-center shrink-0 font-black text-xs border border-cyan-200">
                    2
                  </div>
                  <div>
                    <h5 className="text-xs font-bold text-slate-900">Kalkulasi Algoritma Geometrik</h5>
                    <p className="text-[11px] text-slate-600 leading-relaxed mt-0.5">
                      Rumus probabilitas matematis menghitung peluang closing per video berdasarkan views dan conversion checkout.
                    </p>
                  </div>
                </div>

                <div className="flex items-start gap-3 p-3.5 rounded-2xl bg-white border border-slate-200 shadow-2xs">
                  <div className="w-8 h-8 rounded-xl bg-emerald-50 text-emerald-700 flex items-center justify-center shrink-0 font-black text-xs border border-emerald-200">
                    3
                  </div>
                  <div>
                    <h5 className="text-xs font-bold text-slate-900">Zero Database Policy (100% Privat)</h5>
                    <p className="text-[11px] text-slate-600 leading-relaxed mt-0.5">
                      Gambar screenshot Anda diproses di memori tanpa disimpan di server database publik. Kerahasiaan riset produk affiliate Anda terjamin aman.
                    </p>
                  </div>
                </div>
              </div>

              <div className="bg-slate-900 text-white rounded-2xl p-4 flex items-center gap-3">
                <ShieldCheck className="w-6 h-6 text-emerald-400 shrink-0" />
                <div className="text-xs leading-relaxed">
                  <span className="font-bold text-white block">Tidak Perlu Registrasi / Akun Rumit</span>
                  Aplikasi dapat langsung dipakai untuk menganalisis puluhan produk tanpa batas kuota database.
                </div>
              </div>
            </div>
          )}

          {/* STEP 4: SKOR KELAYAKAN PRODUK */}
          {currentStep === 3 && (
            <div className="space-y-4 animate-in fade-in duration-150">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-slate-100 pb-3">
                <div>
                  <span className="text-[11px] font-bold uppercase tracking-wider text-emerald-700">
                    Langkah 04 • Evaluasi Pasar
                  </span>
                  <h4 className="text-lg font-black text-slate-900">
                    Membaca Skor Kelayakan Produk (0 - 100)
                  </h4>
                </div>
                <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[11px] font-semibold bg-emerald-50 text-emerald-700 border border-emerald-200 w-fit">
                  <BarChart3 className="w-3.5 h-3.5 text-emerald-600" />
                  Rasio Kompetisi
                </span>
              </div>

              <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
                Skor Kelayakan membantu Anda memfilter produk dalam 3 detik agar tidak membuang waktu mempromosikan produk yang sepi:
              </p>

              {/* Interactive Score Selector */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5">
                <button
                  type="button"
                  onClick={() => setSelectedScoreCard('high')}
                  className={`p-3.5 rounded-2xl text-left border transition cursor-pointer ${
                    selectedScoreCard === 'high'
                      ? 'bg-emerald-50/80 border-emerald-400 ring-2 ring-emerald-500/20'
                      : 'bg-white border-slate-200 hover:border-slate-300'
                  }`}
                >
                  <div className="flex items-center justify-between mb-1">
                    <span className="text-xs font-black text-emerald-700">Skor &gt; 70</span>
                    <span className="text-[10px] font-bold px-1.5 py-0.5 rounded-md bg-emerald-100 text-emerald-800">
                      Sangat Layak
                    </span>
                  </div>
                  <p className="text-[11px] text-slate-600 leading-relaxed">
                    Permintaan tinggi, CTR bagus, dan rasio pesanan per kreator sehat. Rekomendasi: gas buat konten!
                  </p>
                </button>

                <button
                  type="button"
                  onClick={() => setSelectedScoreCard('medium')}
                  className={`p-3.5 rounded-2xl text-left border transition cursor-pointer ${
                    selectedScoreCard === 'medium'
                      ? 'bg-amber-50/80 border-amber-400 ring-2 ring-amber-500/20'
                      : 'bg-white border-slate-200 hover:border-slate-300'
                  }`}
                >
                  <div className="flex items-center justify-between mb-1">
                    <span className="text-xs font-black text-amber-700">Skor 50 - 69</span>
                    <span className="text-[10px] font-bold px-1.5 py-0.5 rounded-md bg-amber-100 text-amber-800">
                      Uji Coba
                    </span>
                  </div>
                  <p className="text-[11px] text-slate-600 leading-relaxed">
                    Masih ada potensi, namun kompetisi kreator cukup padat. Buat 3-5 video dulu untuk validasi.
                  </p>
                </button>

                <button
                  type="button"
                  onClick={() => setSelectedScoreCard('low')}
                  className={`p-3.5 rounded-2xl text-left border transition cursor-pointer ${
                    selectedScoreCard === 'low'
                      ? 'bg-rose-50/80 border-rose-400 ring-2 ring-rose-500/20'
                      : 'bg-white border-slate-200 hover:border-slate-300'
                  }`}
                >
                  <div className="flex items-center justify-between mb-1">
                    <span className="text-xs font-black text-rose-700">Skor &lt; 50</span>
                    <span className="text-[10px] font-bold px-1.5 py-0.5 rounded-md bg-rose-100 text-rose-800">
                      Risiko Tinggi
                    </span>
                  </div>
                  <p className="text-[11px] text-slate-600 leading-relaxed">
                    Pasar over-jenuh atau minat beli rendah. Sebaiknya hindari dan cari produk alternatif lain.
                  </p>
                </button>
              </div>

              {/* Dynamic feedback based on active score selection */}
              <div className="bg-slate-50 border border-slate-200 rounded-2xl p-3.5 text-xs text-slate-700">
                <span className="font-bold text-slate-900 block mb-0.5">
                  Indikator Tambahan yang Dihitung:
                </span>
                <ul className="list-disc list-inside space-y-1 text-slate-600 text-[11px]">
                  <li>
                    <strong>Rasio Pesanan / Kreator:</strong> Mengetahui berapa rata-rata penjualan per affiliate (apakah terbagi rata atau hanya dimonopoli segelintir kreator top).
                  </li>
                  <li>
                    <strong>Rasio Keranjang Belanja:</strong> Menunjukkan seberapa tinggi niat beli audiens saat melihat produk di keranjang kuning.
                  </li>
                </ul>
              </div>
            </div>
          )}

          {/* STEP 5: TARGET VIDEO CLOSING & FORMULA HOOK */}
          {currentStep === 4 && (
            <div className="space-y-4 animate-in fade-in duration-150">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-slate-100 pb-3">
                <div>
                  <span className="text-[11px] font-bold uppercase tracking-wider text-amber-700">
                    Langkah 05 • Eksekusi Konten
                  </span>
                  <h4 className="text-lg font-black text-slate-900">
                    Target Jumlah Video & Hook 3 Detik
                  </h4>
                </div>
                <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[11px] font-semibold bg-amber-50 text-amber-800 border border-amber-200 w-fit">
                  <Video className="w-3.5 h-3.5 text-amber-600" />
                  Target Pecah Telur
                </span>
              </div>

              <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
                Di halaman hasil, Anda akan mendapatkan <strong>jumlah pasti video variasi</strong> yang wajib diupload untuk mencapai keyakinan closing 90%:
              </p>

              {/* Probability Roadmap Box */}
              <div className="bg-white border border-slate-200 rounded-2xl p-4 shadow-2xs space-y-3">
                <div className="flex items-center justify-between text-xs">
                  <span className="font-bold text-slate-900">
                    Simulasi Peluang Kumulatif Closing (Confidence Level)
                  </span>
                  <span className="text-emerald-700 font-bold bg-emerald-50 px-2 py-0.5 rounded-md border border-emerald-200 text-[10px]">
                    Target 90% Tercapai di Video ke-8
                  </span>
                </div>

                <div className="grid grid-cols-4 gap-2 text-center">
                  <div className="p-2.5 rounded-xl bg-slate-50 border border-slate-200">
                    <span className="text-[10px] text-slate-500 block">1 Video</span>
                    <span className="text-xs font-black text-slate-800">23%</span>
                  </div>
                  <div className="p-2.5 rounded-xl bg-slate-50 border border-slate-200">
                    <span className="text-[10px] text-slate-500 block">3 Video</span>
                    <span className="text-xs font-black text-slate-800">54%</span>
                  </div>
                  <div className="p-2.5 rounded-xl bg-slate-50 border border-slate-200">
                    <span className="text-[10px] text-slate-500 block">5 Video</span>
                    <span className="text-xs font-black text-slate-800">73%</span>
                  </div>
                  <div className="p-2.5 rounded-xl bg-emerald-50 border border-emerald-300">
                    <span className="text-[10px] text-emerald-700 block font-bold">8 Video</span>
                    <span className="text-xs font-black text-emerald-800">90% (Pasti)</span>
                  </div>
                </div>
              </div>

              {/* Interactive Hook Sample */}
              <div className="bg-slate-900 text-white rounded-2xl p-4 space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-slate-300 flex items-center gap-1.5">
                    <Sparkles className="w-3.5 h-3.5 text-[#FE2C55]" />
                    Contoh Formula Hook 3 Detik:
                  </span>
                  <button
                    type="button"
                    onClick={() =>
                      copyHookSample(
                        'Jangan beli earphone kabel ini sebelum tahu alasan kenapa 12 ribu toko sampai repeat order!'
                      )
                    }
                    className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg text-[10px] font-bold bg-slate-800 hover:bg-slate-700 text-slate-200 transition cursor-pointer"
                  >
                    {copiedHook ? (
                      <>
                        <Check className="w-3 h-3 text-emerald-400" />
                        <span>Tersalin!</span>
                      </>
                    ) : (
                      <>
                        <Copy className="w-3 h-3 text-slate-400" />
                        <span>Salin Hook</span>
                      </>
                    )}
                  </button>
                </div>
                <p className="text-xs text-slate-200 italic bg-slate-800/80 p-3 rounded-xl border border-slate-700/80 leading-relaxed">
                  &ldquo;Jangan beli earphone kabel ini sebelum tahu alasan kenapa 12 ribu toko sampai repeat order!&rdquo;
                </p>
                <p className="text-[10px] text-slate-400 leading-relaxed">
                  Sistem juga menyediakan tombol <strong>Download PDF Laporan</strong> & <strong>Salin Ringkasan</strong> untuk arsip dan tim Anda.
                </p>
              </div>
            </div>
          )}
        </div>

        {/* Footer Actions & Navigation */}
        <div className="px-5 sm:px-7 py-4 bg-slate-50 border-t border-slate-200 flex flex-col sm:flex-row items-center justify-between gap-3">
          {/* Quick Demo CTA */}
          <button
            type="button"
            onClick={() => {
              onClose();
              onTryDemo();
            }}
            className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-3.5 py-2 rounded-xl text-xs font-bold bg-white text-slate-800 border border-slate-300 hover:bg-slate-100 transition active:scale-95 cursor-pointer shadow-2xs"
            title="Muat contoh analitik Wired Earphone langsung ke aplikasi"
          >
            <Sparkles className="w-3.5 h-3.5 text-[#FFB800]" />
            <span>Coba Demo Contoh Sekarang</span>
          </button>

          {/* Stepper Buttons (Prev / Next) */}
          <div className="flex items-center gap-2 w-full sm:w-auto justify-end">
            {currentStep > 0 && (
              <button
                type="button"
                onClick={handlePrev}
                className="flex-1 sm:flex-initial inline-flex items-center justify-center gap-1 px-3.5 py-2 rounded-xl text-xs font-semibold text-slate-700 bg-white border border-slate-200 hover:bg-slate-100 transition cursor-pointer"
              >
                <ChevronLeft className="w-3.5 h-3.5" />
                <span>Sebelumnya</span>
              </button>
            )}

            <button
              type="button"
              onClick={handleNext}
              className="flex-1 sm:flex-initial inline-flex items-center justify-center gap-1.5 px-4 py-2 rounded-xl text-xs font-bold bg-[#FE2C55] hover:bg-[#E0264B] text-white shadow-sm transition active:scale-95 cursor-pointer"
            >
              <span>{currentStep === totalSteps - 1 ? 'Mulai Menggunakan' : 'Langkah Berikutnya'}</span>
              {currentStep === totalSteps - 1 ? (
                <Check className="w-3.5 h-3.5" />
              ) : (
                <ChevronRight className="w-3.5 h-3.5" />
              )}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
