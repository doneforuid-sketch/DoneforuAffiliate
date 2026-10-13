import React, { useState, useEffect } from 'react';
import {
  Download,
  Copy,
  Check,
  Edit3,
  RotateCcw,
  Sparkles,
  TrendingUp,
  Users,
  MousePointerClick,
  ShoppingCart,
  Package,
  CheckCircle2,
  Target,
  BarChart2,
  Calendar,
  Award,
  Zap,
  AlertCircle,
  Clock,
  Compass,
} from 'lucide-react';
import confetti from 'canvas-confetti';
import { PredictionResults, ExtractedProductData } from '../types';
import { formatCompactNumber } from '../utils/calculator';
import { generatePdfWithAutoTable } from '../utils/pdfExport';
import { EditMetricsModal } from './EditMetricsModal';

interface DashboardProps {
  results: PredictionResults;
  onReset: () => void;
  onUpdateMetrics: (updatedData: ExtractedProductData) => void;
}

export const Dashboard: React.FC<DashboardProps> = ({
  results,
  onReset,
  onUpdateMetrics,
}) => {
  const [isExportingPdf, setIsExportingPdf] = useState(false);
  const [isCopied, setIsCopied] = useState(false);
  const [pdfSuccess, setPdfSuccess] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);

  const {
    productData,
    parameters,
    viability,
    ordersPerCreator,
    cartToOrderRate,
    pSingleVideo,
    recommendedVideos,
    cumulativeTable,
    competitionStatus,
    demandStatus,
    strategicInsights,
  } = results;

  // Trigger celebration confetti on mount
  useEffect(() => {
    try {
      confetti({
        particleCount: 65,
        spread: 60,
        origin: { y: 0.6 },
        colors: ['#FE2C55', '#25F4EE', '#FFB800', '#10b981'],
      });
    } catch {
      // Ignore if confetti not supported
    }
  }, [results.timestamp]);

  const handleDownloadPdf = () => {
    try {
      setIsExportingPdf(true);
      setPdfSuccess(false);

      // Instant, clean vector PDF generation via jsPDF + jspdf-autotable
      generatePdfWithAutoTable(results);

      setPdfSuccess(true);
      setTimeout(() => setPdfSuccess(false), 3000);
    } catch (err: unknown) {
      console.error('PDF export error:', err);
      alert('Gagal mengekspor PDF. Silakan coba kembali.');
    } finally {
      setIsExportingPdf(false);
    }
  };

  const handleCopySummary = async () => {
    const summaryText = `📊 LAPORAN ANALISIS AFFILIATE PREDICTOR
Produk: ${productData.productName}
Platform: ${productData.platform || 'TikTok Shop'}
Skor Kelayakan: ${viability.totalScore}/100 [${viability.badgeText}]
Pesanan: ${productData.totalOrders.toLocaleString('id-ID')} | Kreator: ${productData.totalCreators.toLocaleString('id-ID')}
CTR: ${productData.ctrPercent}% | Cart Adds: ${productData.cartAdds.toLocaleString('id-ID')}

🎯 EVALUASI KELAYAKAN:
${viability.recommendationMessage}

🚀 REKOMENDASI KUANTITAS KONTEN:
Unggah Minimal ${recommendedVideos} Video Variasi untuk mencapai keyakinan closing ${(parameters.targetConfidence * 100).toFixed(0)}%!
Probabilitas Closing per Video: ${(pSingleVideo * 100).toFixed(1)}%

📈 ANALISIS PASAR:
- Rasio Pesanan/Kreator: ${ordersPerCreator.toFixed(2)} (${competitionStatus.title})
- Cart-to-Order Rate: ${cartToOrderRate.toFixed(1)}% (${demandStatus.title})

💡 STRATEGI KONTEN:
Hook: ${strategicInsights.contentHook}
Angle: ${strategicInsights.competitionAngle}
CTA: ${strategicInsights.callToAction}
Jadwal: ${strategicInsights.postingSchedule}

Dihitung via Affiliate Predictor AI (TikTok Shop Intelligence)`;

    try {
      await navigator.clipboard.writeText(summaryText);
      setIsCopied(true);
      setTimeout(() => setIsCopied(false), 2000);
    } catch {
      // Clipboard fallback
    }
  };

  return (
    <div className="w-full max-w-5xl mx-auto space-y-6 pb-20 animate-in fade-in duration-300 px-1 sm:px-0">
      {/* 1. TOP ACTION BAR */}
      <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3 bg-white border border-slate-200/90 p-4 rounded-2xl shadow-xs">
        <div className="flex items-center gap-2">
          <button
            onClick={onReset}
            className="inline-flex items-center justify-center gap-1.5 px-3.5 py-2 rounded-xl text-xs font-bold bg-slate-100 hover:bg-slate-200 text-slate-700 transition-colors cursor-pointer"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            <span>Upload Gambar Baru</span>
          </button>

          <button
            onClick={() => setIsEditModalOpen(true)}
            className="inline-flex items-center justify-center gap-1.5 px-3.5 py-2 rounded-xl text-xs font-bold bg-slate-50 hover:bg-slate-100 text-slate-800 border border-slate-300 transition-colors cursor-pointer"
          >
            <Edit3 className="w-3.5 h-3.5 text-[#FE2C55]" />
            <span>Sesuaikan Angka</span>
          </button>
        </div>

        <div className="flex items-center justify-end gap-2.5">
          {/* Copy Summary */}
          <button
            onClick={handleCopySummary}
            className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-xs font-semibold bg-white hover:bg-slate-50 text-slate-700 border border-slate-200 transition-colors cursor-pointer shadow-2xs"
            title="Salin ringkasan teks"
          >
            {isCopied ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Copy className="w-3.5 h-3.5" />}
            <span>{isCopied ? 'Tersalin!' : 'Salin Teks'}</span>
          </button>

          {/* PRIMARY TIKTOK RED DOWNLOAD PDF BUTTON */}
          <button
            onClick={handleDownloadPdf}
            disabled={isExportingPdf}
            className="inline-flex items-center justify-center gap-2 px-5 py-2.5 rounded-xl text-xs sm:text-sm font-bold bg-[#FE2C55] hover:bg-[#E0264B] active:scale-95 text-white shadow-md shadow-[#FE2C55]/25 transition-all cursor-pointer disabled:opacity-50"
          >
            {isExportingPdf ? (
              <>
                <div className="w-4 h-4 border-2 border-white/40 border-t-white rounded-full animate-spin" />
                <span>Membuat PDF...</span>
              </>
            ) : pdfSuccess ? (
              <>
                <Check className="w-4 h-4 text-[#25F4EE]" />
                <span>PDF Terunduh!</span>
              </>
            ) : (
              <>
                <Download className="w-4 h-4" />
                <span>Download Laporan PDF</span>
              </>
            )}
          </button>
        </div>
      </div>

      {/* 2. PRODUCT SUMMARY CARD */}
      <div className="bg-white border border-slate-200/90 rounded-3xl p-5 sm:p-7 shadow-xs">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-5 border-b border-slate-100">
          <div>
            <div className="flex items-center gap-2 mb-1.5">
              <span className="px-2.5 py-0.5 rounded-full text-[11px] font-black bg-[#121212] text-white flex items-center gap-1">
                <span className="w-1.5 h-1.5 rounded-full bg-[#FE2C55]" />
                {productData.platform || 'TikTok Shop Affiliate'}
              </span>
              {productData.timePeriod && (
                <span className="text-xs text-slate-500 flex items-center gap-1 font-medium">
                  <Calendar className="w-3 h-3 text-slate-400" />
                  {productData.timePeriod}
                </span>
              )}
            </div>
            <h2 className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight">
              {productData.productName}
            </h2>
          </div>

          <div className="flex items-center gap-2">
            <span className="px-3 py-1 rounded-full text-xs font-bold bg-emerald-50 text-emerald-700 border border-emerald-200 flex items-center gap-1.5">
              <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
              Data Tervalidasi
            </span>
          </div>
        </div>

        {/* 4 Stat Cards */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4 pt-5">
          {/* Total Orders */}
          <div className="p-4 rounded-2xl bg-slate-50/80 border border-slate-200/80 hover:border-slate-300 transition-colors">
            <div className="flex items-center justify-between text-slate-600 mb-1.5">
              <span className="text-xs font-bold uppercase tracking-wider text-slate-500">Total Pesanan</span>
              <Package className="w-4 h-4 text-slate-800" />
            </div>
            <p className="text-xl sm:text-2xl font-black text-slate-900">
              {productData.totalOrders.toLocaleString('id-ID')}
            </p>
            <p className="text-[11px] text-slate-500 mt-1 font-medium">
              Notasi: <span className="text-slate-900 font-bold">{formatCompactNumber(productData.totalOrders)}</span>
            </p>
          </div>

          {/* Total Creators */}
          <div className="p-4 rounded-2xl bg-slate-50/80 border border-slate-200/80 hover:border-slate-300 transition-colors">
            <div className="flex items-center justify-between text-slate-600 mb-1.5">
              <span className="text-xs font-bold uppercase tracking-wider text-slate-500">Jumlah Kreator</span>
              <Users className="w-4 h-4 text-[#00B4D8]" />
            </div>
            <p className="text-xl sm:text-2xl font-black text-slate-900">
              {productData.totalCreators.toLocaleString('id-ID')}
            </p>
            <p className="text-[11px] text-slate-500 mt-1 font-medium">
              Kreator: <span className="text-[#00B4D8] font-bold">{formatCompactNumber(productData.totalCreators)}</span>
            </p>
          </div>

          {/* CTR */}
          <div className="p-4 rounded-2xl bg-slate-50/80 border border-slate-200/80 hover:border-slate-300 transition-colors">
            <div className="flex items-center justify-between text-slate-600 mb-1.5">
              <span className="text-xs font-bold uppercase tracking-wider text-slate-500">CTR Produk</span>
              <MousePointerClick className="w-4 h-4 text-[#FE2C55]" />
            </div>
            <p className="text-xl sm:text-2xl font-black text-[#FE2C55]">
              {productData.ctrPercent.toFixed(1)}%
            </p>
            <p className="text-[11px] text-slate-500 mt-1 font-medium">
              Rasio klik tayangan
            </p>
          </div>

          {/* Cart Adds (TikTok Keranjang Kuning) */}
          <div className="p-4 rounded-2xl bg-[#FFB800]/5 border border-[#FFB800]/25 hover:border-[#FFB800]/50 transition-colors">
            <div className="flex items-center justify-between text-amber-800 mb-1.5">
              <span className="text-xs font-bold uppercase tracking-wider text-amber-900">Keranjang Kuning</span>
              <ShoppingCart className="w-4 h-4 text-[#FFB800]" />
            </div>
            <p className="text-xl sm:text-2xl font-black text-slate-900">
              {productData.cartAdds.toLocaleString('id-ID')}
            </p>
            <p className="text-[11px] text-amber-700 mt-1 font-medium">
              Masuk keranjang: <span className="font-bold">{formatCompactNumber(productData.cartAdds)}</span>
            </p>
          </div>
        </div>
      </div>

      {/* 3. PRODUCT VIABILITY ASSESSMENT CARD */}
      <div className="bg-white border-2 border-slate-200 rounded-3xl p-5 sm:p-7 shadow-xs relative overflow-hidden">
        {/* Top header & score callout */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-5 border-b border-slate-100">
          <div className="flex items-start sm:items-center gap-3.5">
            <div className={`w-12 h-12 rounded-2xl flex items-center justify-center shrink-0 border shadow-xs ${
              viability.status === 'SANGAT_LAYAK'
                ? 'bg-emerald-50 text-emerald-600 border-emerald-200'
                : viability.status === 'LAYAK_BERSYARAT'
                ? 'bg-amber-50 text-amber-600 border-amber-200'
                : 'bg-rose-50 text-rose-600 border-rose-200'
            }`}>
              <Award className="w-6 h-6" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">
                  Product Viability Assessment
                </span>
                <span className="text-[11px] font-semibold text-slate-400 hidden sm:inline">
                  • Evaluasi Potensi Pasar TikTok
                </span>
              </div>
              <h3 className="text-xl sm:text-2xl font-black text-slate-900 tracking-tight">
                Skor Kelayakan Produk Affiliate
              </h3>
            </div>
          </div>

          <div className="flex items-center gap-3">
            {/* Big Score Display */}
            <div className="text-right">
              <span className="text-xs font-bold text-slate-400 block uppercase">Skor Total</span>
              <div className="flex items-baseline gap-1">
                <span className="text-3xl sm:text-4xl font-black text-slate-900">
                  {viability.totalScore}
                </span>
                <span className="text-xs font-bold text-slate-400">/ 100</span>
              </div>
            </div>

            {/* Status Badge */}
            <div className={`px-4 py-2 rounded-2xl border font-black text-xs sm:text-sm tracking-wide shadow-xs flex items-center gap-1.5 ${viability.badgeClass}`}>
              {viability.status === 'SANGAT_LAYAK' && <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />}
              {viability.status === 'LAYAK_BERSYARAT' && <Zap className="w-4 h-4 text-amber-600 shrink-0" />}
              {viability.status === 'TIDAK_DISARANKAN' && <AlertCircle className="w-4 h-4 text-rose-600 shrink-0" />}
              <span>{viability.badgeText}</span>
            </div>
          </div>
        </div>

        {/* Recommendation Message Box */}
        <div className={`mt-4 p-3.5 sm:p-4 rounded-2xl border flex items-start gap-3 ${viability.bgLight} ${viability.borderClass}`}>
          <div className="mt-0.5">
            {viability.status === 'SANGAT_LAYAK' && <CheckCircle2 className="w-4 h-4 text-emerald-700 shrink-0" />}
            {viability.status === 'LAYAK_BERSYARAT' && <Zap className="w-4 h-4 text-amber-700 shrink-0" />}
            {viability.status === 'TIDAK_DISARANKAN' && <AlertCircle className="w-4 h-4 text-rose-700 shrink-0" />}
          </div>
          <div className="flex-1 text-xs sm:text-sm font-semibold leading-relaxed text-slate-800">
            <strong>Keputusan Algoritma:</strong> {viability.recommendationMessage}
          </div>
        </div>

        {/* Master Score Progress Bar with Threshold Markers */}
        <div className="mt-5 space-y-2">
          <div className="flex justify-between text-xs font-bold text-slate-500">
            <span>0</span>
            <span className="text-rose-600 font-bold">&lt;60 Tidak Disarankan</span>
            <span className="text-amber-600 font-bold">60 - 79 Layak Bersyarat</span>
            <span className="text-emerald-600 font-bold">&gt;=80 Sangat Layak</span>
            <span>100</span>
          </div>

          <div className="w-full bg-slate-100 rounded-full h-3.5 overflow-hidden p-0.5 border border-slate-200 relative">
            <div
              className={`h-full rounded-full transition-all duration-700 bg-gradient-to-r ${viability.progressColor} shadow-xs`}
              style={{ width: `${Math.min(100, Math.max(4, viability.totalScore))}%` }}
            />
          </div>
        </div>

        {/* 3 Parameter Breakdown Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-3 sm:gap-4 mt-6 pt-5 border-t border-slate-100">
          {/* 1. Demand to Competition (45%) */}
          <div className="p-3.5 sm:p-4 rounded-2xl bg-slate-50/80 border border-slate-200/90 space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-slate-700 flex items-center gap-1">
                <span>Rasio Demand / Kreator</span>
                <span className="text-[10px] px-1.5 py-0.2 rounded bg-slate-200 text-slate-800 font-bold">Bobot 45%</span>
              </span>
              <span className="text-xs font-black text-slate-900">{viability.breakdown.demandScore}/100</span>
            </div>

            <div className="w-full bg-slate-200 rounded-full h-1.5 overflow-hidden">
              <div
                className="bg-[#121212] h-1.5 rounded-full"
                style={{ width: `${viability.breakdown.demandScore}%` }}
              />
            </div>

            <p className="text-[11px] text-slate-500 font-medium">
              Output: <strong className="text-slate-800">{ordersPerCreator.toFixed(2)}</strong> pesanan/kreator (Target: &gt;= 3.0)
            </p>
          </div>

          {/* 2. Cart to Order Rate (35%) */}
          <div className="p-3.5 sm:p-4 rounded-2xl bg-slate-50/80 border border-slate-200/90 space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-slate-700 flex items-center gap-1">
                <span>Minat Checkout (Cart CR)</span>
                <span className="text-[10px] px-1.5 py-0.2 rounded bg-[#00B4D8]/10 text-teal-800 font-bold">Bobot 35%</span>
              </span>
              <span className="text-xs font-black text-slate-900">{viability.breakdown.cartScore}/100</span>
            </div>

            <div className="w-full bg-slate-200 rounded-full h-1.5 overflow-hidden">
              <div
                className="bg-[#00B4D8] h-1.5 rounded-full"
                style={{ width: `${viability.breakdown.cartScore}%` }}
              />
            </div>

            <p className="text-[11px] text-slate-500 font-medium">
              Konversi: <strong className="text-slate-800">{cartToOrderRate.toFixed(1)}%</strong> checkout (Target: &gt;= 30%)
            </p>
          </div>

          {/* 3. CTR Keranjang Kuning (20%) */}
          <div className="p-3.5 sm:p-4 rounded-2xl bg-slate-50/80 border border-slate-200/90 space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-slate-700 flex items-center gap-1">
                <span>CTR Keranjang</span>
                <span className="text-[10px] px-1.5 py-0.2 rounded bg-[#FE2C55]/10 text-[#FE2C55] font-bold">Bobot 20%</span>
              </span>
              <span className="text-xs font-black text-slate-900">{viability.breakdown.ctrScore}/100</span>
            </div>

            <div className="w-full bg-slate-200 rounded-full h-1.5 overflow-hidden">
              <div
                className="bg-[#FE2C55] h-1.5 rounded-full"
                style={{ width: `${viability.breakdown.ctrScore}%` }}
              />
            </div>

            <p className="text-[11px] text-slate-500 font-medium">
              CTR: <strong className="text-slate-800">{productData.ctrPercent.toFixed(1)}%</strong> klik (Target: &gt;= 3.5%)
            </p>
          </div>
        </div>
      </div>

      {/* 4. HIGHLIGHT RECOMMENDATION CARD (TIKTOK DARK HERO AESTHETIC) */}
      <div className="relative rounded-3xl p-6 sm:p-8 bg-[#121212] text-white border-2 border-slate-800 shadow-xl overflow-hidden">
        {/* Subtle TikTok glow */}
        <div className="absolute top-0 right-0 w-80 h-80 bg-[#25F4EE]/10 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute bottom-0 left-0 w-80 h-80 bg-[#FE2C55]/10 rounded-full blur-3xl pointer-events-none" />

        <div className="relative z-10 grid grid-cols-1 lg:grid-cols-12 gap-6 items-center">
          {/* Main callout */}
          <div className="lg:col-span-8 space-y-3">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/10 border border-white/20 text-xs font-bold text-slate-200">
              <Target className="w-4 h-4 text-[#25F4EE]" />
              Target Keyakinan Closing: {(parameters.targetConfidence * 100).toFixed(0)}%
            </div>

            <h3 className="text-3xl sm:text-5xl font-black text-white tracking-tight">
              Unggah Minimal{' '}
              <span className="text-[#25F4EE] underline decoration-[#FE2C55] decoration-wavy underline-offset-8">
                {recommendedVideos} Video
              </span>
            </h3>

            <p className="text-sm sm:text-base text-slate-300 leading-relaxed max-w-2xl">
              Dengan estimasi <strong>{parameters.views.toLocaleString('id-ID')} views/video</strong> dan rasio klik <strong>{productData.ctrPercent.toFixed(1)}%</strong>, Anda membutuhkan minimal <strong>{recommendedVideos} video variasi</strong> untuk mencapai probabilitas di atas {(parameters.targetConfidence * 100).toFixed(0)}% menghasilkan pesanan pertama.
            </p>

            <div className="pt-2 flex flex-wrap gap-2.5 text-xs text-slate-300">
              <span className="px-3 py-1.5 rounded-xl bg-white/10 border border-white/15">
                Peluang 1 Video: <strong className="text-[#25F4EE]">{(pSingleVideo * 100).toFixed(1)}%</strong>
              </span>
              <span className="px-3 py-1.5 rounded-xl bg-white/10 border border-white/15">
                Peluang Kumulatif di Video ke-{recommendedVideos}: <strong className="text-emerald-400">{(cumulativeTable[recommendedVideos - 1]?.cumulativeProbability * 100 || 90).toFixed(1)}%</strong>
              </span>
            </div>
          </div>

          {/* Visual Probability Gauge */}
          <div className="lg:col-span-4 bg-white/5 backdrop-blur-md border border-white/10 rounded-2xl p-5 text-center space-y-3">
            <span className="text-xs font-bold text-slate-400 uppercase tracking-wider block">
              Peluang Pecah Telur per Video
            </span>

            <div className="text-4xl sm:text-5xl font-black text-[#25F4EE]">
              {(pSingleVideo * 100).toFixed(1)}%
            </div>

            <p className="text-xs text-slate-400">
              Setiap video memiliki peluang ~{(pSingleVideo * 100).toFixed(1)}%. Konsistensi variasi video adalah kunci closing.
            </p>

            <div className="w-full bg-white/10 rounded-full h-2.5 overflow-hidden">
              <div
                className="bg-gradient-to-r from-[#25F4EE] to-[#FE2C55] h-2.5 rounded-full transition-all duration-500"
                style={{ width: `${Math.min(100, pSingleVideo * 100)}%` }}
              />
            </div>
          </div>
        </div>
      </div>

      {/* 5. SIDE-BY-SIDE ANALYTICS & ACTION PLAYBOOK */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left Column (7 cols): Progression Table */}
        <div className="lg:col-span-7 bg-white border border-slate-200/90 rounded-3xl p-5 sm:p-6 shadow-xs flex flex-col">
          <div className="flex items-center justify-between pb-4 mb-4 border-b border-slate-100">
            <div className="flex items-center gap-2">
              <BarChart2 className="w-5 h-5 text-[#FE2C55]" />
              <div>
                <h4 className="text-base font-bold text-slate-900">
                  Tabel Progres Akumulasi (Video 1 s/d 15)
                </h4>
                <p className="text-xs text-slate-500">Lonjakan probabilitas closing seiring bertambahnya variasi video</p>
              </div>
            </div>
          </div>

          <div className="overflow-x-auto rounded-2xl border border-slate-200 bg-white flex-1">
            <table className="w-full text-left text-xs sm:text-sm">
              <thead>
                <tr className="border-b border-slate-200 text-slate-600 bg-slate-50/90 font-bold">
                  <th className="py-2.5 px-3.5">Video</th>
                  <th className="py-2.5 px-3">Probabilitas</th>
                  <th className="py-2.5 px-3">Progres Bar</th>
                  <th className="py-2.5 px-3 text-right">Target</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {cumulativeTable.slice(0, 15).map((step) => {
                  const isTarget = step.videoCount === recommendedVideos;
                  const percent = step.cumulativeProbability * 100;
                  return (
                    <tr
                      key={step.videoCount}
                      className={`transition-colors ${
                        isTarget
                          ? 'bg-[#FE2C55]/5 font-bold text-slate-900'
                          : 'hover:bg-slate-50 text-slate-700'
                      }`}
                    >
                      <td className="py-2.5 px-3.5 font-semibold">
                        <div className="flex items-center gap-1.5">
                          <span>Video #{step.videoCount}</span>
                          {isTarget && (
                            <span className="px-1.5 py-0.5 rounded text-[9px] font-black bg-[#FE2C55] text-white shadow-2xs">
                              TARGET
                            </span>
                          )}
                        </div>
                      </td>

                      <td className="py-2.5 px-3 font-mono font-bold text-slate-900">
                        {percent.toFixed(1)}%
                      </td>

                      <td className="py-2.5 px-3 w-32 sm:w-44">
                        <div className="w-full bg-slate-100 rounded-full h-2 overflow-hidden">
                          <div
                            className={`h-2 rounded-full transition-all duration-300 ${
                              step.targetReached
                                ? 'bg-emerald-500'
                                : 'bg-[#FE2C55]'
                            }`}
                            style={{ width: `${Math.min(100, percent)}%` }}
                          />
                        </div>
                      </td>

                      <td className="py-2.5 px-3 text-right">
                        {step.targetReached ? (
                          <span className="inline-flex items-center gap-1 text-emerald-700 text-xs font-bold">
                            <CheckCircle2 className="w-3.5 h-3.5" />
                            Tercapai
                          </span>
                        ) : (
                          <span className="text-slate-400 text-xs font-medium">
                            +{ (step.incrementalGain * 100).toFixed(1) }%
                          </span>
                        )}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>

          <div className="mt-3.5 p-3 rounded-xl bg-slate-50 border border-slate-200 text-xs text-slate-500 flex items-center gap-2">
            <Sparkles className="w-4 h-4 text-[#FFB800] shrink-0" />
            <span>Target {(parameters.targetConfidence * 100).toFixed(0)}% closing tercapai saat Anda mengunggah minimal <strong>{recommendedVideos} video</strong>.</span>
          </div>
        </div>

        {/* Right Column (5 cols): Content Playbook & Strategy */}
        <div className="lg:col-span-5 bg-white border border-slate-200/90 rounded-3xl p-5 sm:p-6 shadow-xs flex flex-col justify-between space-y-4">
          <div className="pb-3 border-b border-slate-100 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Compass className="w-5 h-5 text-[#FE2C55]" />
              <div>
                <h4 className="text-base font-bold text-slate-900">
                  Playbook Strategi Konten
                </h4>
                <p className="text-xs text-slate-500">Panduan eksekusi konten untuk TikTok Shop</p>
              </div>
            </div>
          </div>

          <div className="space-y-3 flex-1">
            {/* Hook 3 Detik (TikTok Cyan accent) */}
            <div className="p-3.5 rounded-2xl bg-[#25F4EE]/10 border border-[#25F4EE]/30 space-y-1">
              <span className="text-xs font-bold text-teal-900 uppercase tracking-wider flex items-center gap-1.5">
                <Target className="w-3.5 h-3.5 text-[#00B4D8]" />
                1. Hook 3 Detik Pertama
              </span>
              <p className="text-xs text-slate-800 leading-relaxed font-medium">
                {strategicInsights.contentHook}
              </p>
            </div>

            {/* Taktik Menembus Saturasi (TikTok Red accent) */}
            <div className="p-3.5 rounded-2xl bg-[#FE2C55]/10 border border-[#FE2C55]/25 space-y-1">
              <span className="text-xs font-bold text-rose-950 uppercase tracking-wider flex items-center gap-1.5">
                <TrendingUp className="w-3.5 h-3.5 text-[#FE2C55]" />
                2. Taktik Melewati Saturasi
              </span>
              <p className="text-xs text-slate-800 leading-relaxed font-medium">
                {strategicInsights.competitionAngle}
              </p>
            </div>

            {/* CTA Rekomendasi (Keranjang Kuning accent) */}
            <div className="p-3.5 rounded-2xl bg-[#FFB800]/10 border border-[#FFB800]/30 space-y-1">
              <span className="text-xs font-bold text-amber-950 uppercase tracking-wider flex items-center gap-1.5">
                <ShoppingCart className="w-3.5 h-3.5 text-[#FFB800]" />
                3. Call to Action (Keranjang Kuning)
              </span>
              <p className="text-xs text-slate-800 leading-relaxed font-medium">
                {strategicInsights.callToAction}
              </p>
            </div>

            {/* Jadwal Upload */}
            <div className="p-3.5 rounded-2xl bg-slate-50 border border-slate-200 space-y-1">
              <span className="text-xs font-bold text-slate-800 uppercase tracking-wider flex items-center gap-1.5">
                <Clock className="w-3.5 h-3.5 text-slate-600" />
                4. Tempo & Jadwal Upload
              </span>
              <p className="text-xs text-slate-700 leading-relaxed font-medium">
                {strategicInsights.postingSchedule}
              </p>
            </div>
          </div>

          <div className="p-3.5 rounded-2xl bg-emerald-50 border border-emerald-200 text-xs text-emerald-900 flex items-start gap-2">
            <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
            <div>
              <strong>Evaluasi Risiko:</strong> {strategicInsights.riskAssessment}
            </div>
          </div>
        </div>
      </div>

      {/* Edit Metrics Modal */}
      <EditMetricsModal
        isOpen={isEditModalOpen}
        onClose={() => setIsEditModalOpen(false)}
        productData={productData}
        onSave={(updated) => onUpdateMetrics(updated)}
      />
    </div>
  );
};
