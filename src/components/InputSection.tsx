import React, { useState, useRef, useEffect } from 'react';
import {
  Upload,
  Sliders,
  Sparkles,
  ArrowRight,
  AlertCircle,
  FileCheck,
  X,
  Eye,
  Percent,
  CheckCircle,
  Zap,
  BookOpen,
} from 'lucide-react';
import { PredictionParameters } from '../types';

interface InputSectionProps {
  onAnalyze: (image: File | string, params: PredictionParameters) => void;
  isLoading: boolean;
  loadingMessage: string;
  error: string | null;
  onClearError: () => void;
  onUseSampleData: () => void;
  onOpenTutorial?: () => void;
}

export const InputSection: React.FC<InputSectionProps> = ({
  onAnalyze,
  isLoading,
  loadingMessage,
  error,
  onClearError,
  onUseSampleData,
  onOpenTutorial,
}) => {
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [isDragOver, setIsDragOver] = useState(false);

  // Parameter states
  const [views, setViews] = useState<number>(1000);
  const [targetConfidence, setTargetConfidence] = useState<number>(0.90);
  const [checkoutCrPercent, setCheckoutCrPercent] = useState<number>(1.0);
  const [showAdvancedParams, setShowAdvancedParams] = useState(false);

  const fileInputRef = useRef<HTMLInputElement>(null);

  // Paste from clipboard support
  useEffect(() => {
    const handlePaste = (e: ClipboardEvent) => {
      const items = e.clipboardData?.items;
      if (!items) return;

      for (let i = 0; i < items.length; i++) {
        if (items[i].type.indexOf('image') !== -1) {
          const file = items[i].getAsFile();
          if (file) {
            handleFileSelect(file);
            break;
          }
        }
      }
    };

    window.addEventListener('paste', handlePaste);
    return () => window.removeEventListener('paste', handlePaste);
  }, []);

  const handleFileSelect = (file: File) => {
    if (!file.type.startsWith('image/')) {
      alert('Mohon pilih file gambar (PNG, JPG, WebP).');
      return;
    }
    if (file.size > 20 * 1024 * 1024) {
      alert('Ukuran gambar maksimal 20MB.');
      return;
    }

    onClearError();
    setSelectedFile(file);
    const objectUrl = URL.createObjectURL(file);
    setPreviewUrl(objectUrl);
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(true);
  };

  const handleDragLeave = () => {
    setIsDragOver(false);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(false);
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      handleFileSelect(e.dataTransfer.files[0]);
    }
  };

  const handleRemoveImage = () => {
    setSelectedFile(null);
    if (previewUrl) {
      URL.revokeObjectURL(previewUrl);
      setPreviewUrl(null);
    }
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedFile) {
      alert('Silakan upload gambar screenshot analitik terlebih dahulu.');
      return;
    }

    onAnalyze(selectedFile, {
      views: Number(views) || 1000,
      targetConfidence: Number(targetConfidence) || 0.90,
      checkoutCrPercent: Number(checkoutCrPercent) || 1.0,
    });
  };

  return (
    <div className="w-full max-w-4xl mx-auto mb-10 px-1 sm:px-0">
      {/* Intro Banner */}
      <div className="text-center mb-8 sm:mb-10">
        <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-[#121212] text-white text-xs font-bold mb-3 shadow-sm border border-slate-800">
          <span className="w-2 h-2 rounded-full bg-[#25F4EE] animate-pulse" />
          <span className="text-[#25F4EE]">TikTok Shop</span> Sales Intelligence
        </div>
        <h2 className="text-2xl sm:text-4xl md:text-5xl font-black text-slate-900 tracking-tight leading-tight">
          Berapa Video yang Harus Diunggah agar <span className="text-[#FE2C55] underline decoration-[#25F4EE] decoration-wavy underline-offset-8">Pasti Pecah Telur?</span>
        </h2>
        <p className="mt-3 text-sm sm:text-base text-slate-600 max-w-2xl mx-auto leading-relaxed">
          Unggah screenshot analitik produk affiliate TikTok Shop. Algoritma kami akan memindai data metrik secara instan dan memproyeksikan jumlah video yang diperlukan untuk mencapai target closing 90%.
        </p>

        {/* Quick Guide & Demo Pills */}
        <div className="flex flex-wrap items-center justify-center gap-2.5 mt-4">
          {onOpenTutorial && (
            <button
              type="button"
              onClick={onOpenTutorial}
              className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full text-xs font-bold bg-white text-slate-800 border border-slate-300 hover:border-slate-400 hover:bg-slate-50 shadow-2xs transition active:scale-95 cursor-pointer"
            >
              <BookOpen className="w-3.5 h-3.5 text-[#FE2C55]" />
              <span>Panduan Interaktif Pengguna Baru (5 Langkah)</span>
            </button>
          )}

          <button
            type="button"
            onClick={onUseSampleData}
            className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-full text-xs font-bold bg-slate-900 text-white hover:bg-slate-800 shadow-2xs transition active:scale-95 cursor-pointer"
          >
            <Sparkles className="w-3.5 h-3.5 text-[#FFB800]" />
            <span>Coba Demo Contoh (Wired Earphone)</span>
          </button>
        </div>
      </div>

      {/* Main Upload Box */}
      <div className="bg-white border border-slate-200/90 rounded-3xl p-5 sm:p-8 md:p-10 shadow-xl shadow-slate-200/40 relative overflow-hidden">
        {/* Subtle decorative glow */}
        <div className="absolute top-0 right-0 w-80 h-80 bg-[#FE2C55]/5 rounded-full blur-3xl pointer-events-none -mr-20 -mt-20" />
        <div className="absolute bottom-0 left-0 w-80 h-80 bg-[#25F4EE]/5 rounded-full blur-3xl pointer-events-none -ml-20 -mb-20" />

        {/* Error Alert */}
        {error && (
          <div className="mb-6 p-4 rounded-2xl bg-rose-50 border border-rose-200 text-rose-800 flex items-start justify-between gap-3 animate-in fade-in">
            <div className="flex items-start gap-3">
              <AlertCircle className="w-5 h-5 text-rose-600 shrink-0 mt-0.5" />
              <div>
                <p className="font-bold text-sm text-rose-900">Pemindaian Gagal</p>
                <p className="text-xs text-rose-700 mt-0.5 leading-relaxed">{error}</p>
              </div>
            </div>
            <button
              onClick={onClearError}
              className="p-1 rounded-lg text-rose-500 hover:text-rose-800 hover:bg-rose-100 transition-colors cursor-pointer"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        )}

        <form onSubmit={handleSubmit} className="relative z-10 space-y-6">
          {/* Dropzone */}
          <div>
            <div className="flex items-center justify-between mb-2">
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-700">
                1. Unggah Tangkapan Layar (Screenshot Analitik)
              </label>
              <span className="text-[11px] font-medium text-slate-500">
                Format: PNG, JPG, WebP
              </span>
            </div>

            {!previewUrl ? (
              <div
                onDragOver={handleDragOver}
                onDragLeave={handleDragLeave}
                onDrop={handleDrop}
                onClick={() => fileInputRef.current?.click()}
                className={`relative border-2 border-dashed rounded-2xl p-6 sm:p-10 text-center cursor-pointer transition-all duration-200 ${
                  isDragOver
                    ? 'border-[#FE2C55] bg-[#FE2C55]/5 scale-[1.01]'
                    : 'border-slate-300 hover:border-[#FE2C55]/60 bg-slate-50/50 hover:bg-slate-50'
                }`}
              >
                <input
                  ref={fileInputRef}
                  type="file"
                  accept="image/*"
                  className="hidden"
                  onChange={(e) => {
                    if (e.target.files && e.target.files[0]) {
                      handleFileSelect(e.target.files[0]);
                    }
                  }}
                />

                <div className="mx-auto w-14 h-14 rounded-2xl bg-[#FE2C55]/10 text-[#FE2C55] flex items-center justify-center mb-4 shadow-xs">
                  <Upload className="w-7 h-7" />
                </div>

                <p className="text-sm sm:text-base font-bold text-slate-900">
                  Tarik & Lepas gambar ke sini, atau <span className="text-[#FE2C55] underline underline-offset-2">Pilih dari Galeri/Komputer</span>
                </p>
                <p className="text-xs text-slate-500 mt-1.5 max-w-md mx-auto">
                  Screenshot dari menu "Tren Produk", "Info Promosi", atau Pusat Kreator TikTok Shop Affiliate
                </p>
                <p className="text-[11px] text-slate-400 mt-2 font-mono">
                  Bisa juga paste langsung dengan <strong>Ctrl + V</strong> (atau <strong>Cmd + V</strong>)
                </p>

                {/* Quick Sample Demo Button */}
                <div className="mt-5 pt-4 border-t border-slate-200 flex items-center justify-center">
                  <button
                    type="button"
                    onClick={(e) => {
                      e.stopPropagation();
                      onUseSampleData();
                    }}
                    className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs font-bold bg-white hover:bg-slate-50 text-slate-800 border border-slate-300 hover:border-[#FE2C55]/50 transition-all shadow-xs hover:scale-105 active:scale-95 cursor-pointer"
                  >
                    <Sparkles className="w-3.5 h-3.5 text-[#FFB800]" />
                    Belum ada screenshot? Uji coba langsung dengan data contoh
                  </button>
                </div>
              </div>
            ) : (
              <div className="relative rounded-2xl bg-slate-50 border border-slate-200 p-4 flex flex-col sm:flex-row items-center gap-4">
                <div className="relative w-full sm:w-48 h-40 bg-white rounded-xl overflow-hidden border border-slate-200 shrink-0 flex items-center justify-center shadow-2xs">
                  <img
                    src={previewUrl}
                    alt="Pratinjau Screenshot"
                    className="w-full h-full object-contain"
                  />
                  <div className="absolute top-2 left-2 px-2 py-0.5 rounded bg-[#121212]/90 backdrop-blur-xs text-[10px] text-white flex items-center gap-1 font-medium">
                    <FileCheck className="w-3 h-3 text-[#25F4EE]" />
                    Siap Dianalisis
                  </div>
                </div>

                <div className="flex-1 w-full text-left space-y-1.5">
                  <h4 className="text-sm font-bold text-slate-900 truncate">
                    {selectedFile?.name || 'Screenshot Analitik'}
                  </h4>
                  <p className="text-xs text-slate-500">
                    Ukuran: {selectedFile ? (selectedFile.size / 1024).toFixed(1) + ' KB' : '-'} • Format:{' '}
                    {selectedFile?.type || 'Image'}
                  </p>
                  <p className="text-xs text-emerald-700 font-semibold pt-1 flex items-center gap-1">
                    <CheckCircle className="w-3.5 h-3.5 text-emerald-600" />
                    Pemrosesan aman di memori browser (Privacy-First)
                  </p>

                  <div className="pt-2 flex items-center gap-2">
                    <button
                      type="button"
                      onClick={() => fileInputRef.current?.click()}
                      className="px-3.5 py-1.5 rounded-lg text-xs font-semibold bg-white hover:bg-slate-100 text-slate-700 border border-slate-200 transition-colors shadow-2xs cursor-pointer"
                    >
                      Ganti Gambar
                    </button>
                    <button
                      type="button"
                      onClick={handleRemoveImage}
                      className="px-3.5 py-1.5 rounded-lg text-xs font-semibold text-rose-600 hover:bg-rose-50 transition-colors flex items-center gap-1 cursor-pointer"
                    >
                      <X className="w-3.5 h-3.5" />
                      Hapus
                    </button>
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Parameters Section (Toggle / Accordion) */}
          <div className="p-4 sm:p-5 rounded-2xl bg-slate-50 border border-slate-200/90">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Sliders className="w-4 h-4 text-[#FE2C55]" />
                <span className="text-xs font-bold uppercase tracking-wider text-slate-800">
                  2. Parameter Prediksi (Opsional)
                </span>
              </div>
              <button
                type="button"
                onClick={() => setShowAdvancedParams(!showAdvancedParams)}
                className="text-xs text-[#FE2C55] hover:text-[#E0264B] font-bold underline underline-offset-2 cursor-pointer"
              >
                {showAdvancedParams ? 'Sembunyikan Pengaturan' : 'Sesuaikan Nilai'}
              </button>
            </div>

            {/* Quick summary badges if closed */}
            {!showAdvancedParams && (
              <div className="mt-3 flex flex-wrap gap-2 text-xs">
                <span className="px-3 py-1 rounded-lg bg-white border border-slate-200 text-slate-600 font-medium">
                  Estimasi Views: <strong className="text-slate-900">{views.toLocaleString('id-ID')}</strong>
                </span>
                <span className="px-3 py-1 rounded-lg bg-white border border-slate-200 text-slate-600 font-medium">
                  Target Closing: <strong className="text-[#FE2C55]">{(targetConfidence * 100).toFixed(0)}%</strong>
                </span>
                <span className="px-3 py-1 rounded-lg bg-white border border-slate-200 text-slate-600 font-medium">
                  Checkout CR: <strong className="text-slate-900">{checkoutCrPercent}%</strong>
                </span>
              </div>
            )}

            {/* Expanded fields */}
            {showAdvancedParams && (
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mt-4 pt-4 border-t border-slate-200">
                {/* Views per video */}
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1 flex items-center gap-1">
                    <Eye className="w-3.5 h-3.5 text-[#00B4D8]" />
                    Rata-rata Views / Video
                  </label>
                  <input
                    type="number"
                    min="100"
                    max="1000000"
                    step="100"
                    value={views}
                    onChange={(e) => setViews(Math.max(10, Number(e.target.value)))}
                    className="w-full px-3 py-2 rounded-xl bg-white border border-slate-300 text-slate-900 text-sm focus:outline-none focus:ring-2 focus:ring-[#FE2C55] shadow-2xs font-semibold"
                  />
                  {/* Quick Preset Pills */}
                  <div className="flex items-center gap-1.5 mt-2">
                    {[500, 1000, 2500, 5000].map((val) => (
                      <button
                        key={val}
                        type="button"
                        onClick={() => setViews(val)}
                        className={`px-2 py-0.5 rounded-lg text-[10px] font-bold transition-colors cursor-pointer ${
                          views === val
                            ? 'bg-[#121212] text-[#25F4EE]'
                            : 'bg-white border border-slate-200 text-slate-600 hover:bg-slate-100'
                        }`}
                      >
                        {val.toLocaleString('id-ID')}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Target Confidence */}
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1 flex items-center gap-1">
                    <Percent className="w-3.5 h-3.5 text-[#FE2C55]" />
                    Target Keyakinan Closing
                  </label>
                  <select
                    value={targetConfidence}
                    onChange={(e) => setTargetConfidence(Number(e.target.value))}
                    className="w-full px-3 py-2 rounded-xl bg-white border border-slate-300 text-slate-900 text-sm focus:outline-none focus:ring-2 focus:ring-[#FE2C55] shadow-2xs font-semibold cursor-pointer"
                  >
                    <option value={0.80}>80% (Standar Percaya Diri)</option>
                    <option value={0.90}>90% (Rekomendasi Utama)</option>
                    <option value={0.95}>95% (Keyakinan Sangat Tinggi)</option>
                    <option value={0.99}>99% (Hampir Pasti Closing)</option>
                  </select>
                  {/* Quick Target Pills */}
                  <div className="flex items-center gap-1.5 mt-2">
                    {[0.80, 0.90, 0.95].map((val) => (
                      <button
                        key={val}
                        type="button"
                        onClick={() => setTargetConfidence(val)}
                        className={`px-2 py-0.5 rounded-lg text-[10px] font-bold transition-colors cursor-pointer ${
                          targetConfidence === val
                            ? 'bg-[#FE2C55] text-white'
                            : 'bg-white border border-slate-200 text-slate-600 hover:bg-slate-100'
                        }`}
                      >
                        {(val * 100).toFixed(0)}%
                      </button>
                    ))}
                  </div>
                </div>

                {/* Checkout CR */}
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1 flex items-center gap-1">
                    <Percent className="w-3.5 h-3.5 text-[#FFB800]" />
                    Estimasi Checkout CR dari Klik
                  </label>
                  <input
                    type="number"
                    min="0.1"
                    max="50"
                    step="0.1"
                    value={checkoutCrPercent}
                    onChange={(e) => setCheckoutCrPercent(Math.max(0.01, Number(e.target.value)))}
                    className="w-full px-3 py-2 rounded-xl bg-white border border-slate-300 text-slate-900 text-sm focus:outline-none focus:ring-2 focus:ring-[#FE2C55] shadow-2xs font-semibold"
                  />
                  <div className="flex items-center gap-1.5 mt-2">
                    {[0.5, 1.0, 2.0].map((val) => (
                      <button
                        key={val}
                        type="button"
                        onClick={() => setCheckoutCrPercent(val)}
                        className={`px-2 py-0.5 rounded-lg text-[10px] font-bold transition-colors cursor-pointer ${
                          checkoutCrPercent === val
                            ? 'bg-[#121212] text-white'
                            : 'bg-white border border-slate-200 text-slate-600 hover:bg-slate-100'
                        }`}
                      >
                        {val}%
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Submit Action */}
          <div className="pt-2">
            <button
              type="submit"
              disabled={isLoading || !selectedFile}
              className={`w-full py-3.5 sm:py-4 px-6 rounded-2xl font-bold text-white text-sm sm:text-base transition-all shadow-lg flex items-center justify-center gap-2 ${
                isLoading || !selectedFile
                  ? 'bg-slate-200 text-slate-400 cursor-not-allowed border border-slate-300 shadow-none'
                  : 'bg-[#FE2C55] hover:bg-[#E0264B] active:scale-[0.99] shadow-[#FE2C55]/25 cursor-pointer'
              }`}
            >
              {isLoading ? (
                <>
                  <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                  <span>{loadingMessage || 'Sedang Memproses Analisis...'}</span>
                </>
              ) : (
                <>
                  <Sparkles className="w-5 h-5 text-[#FFB800]" />
                  <span>Mulai Analisis & Hitung Prediksi</span>
                  <ArrowRight className="w-5 h-5" />
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
