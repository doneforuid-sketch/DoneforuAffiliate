/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { Header } from './components/Header';
import { InputSection } from './components/InputSection';
import { Dashboard } from './components/Dashboard';
import {
  ExtractedProductData,
  PredictionParameters,
  PredictionResults,
} from './types';
import { calculateAffiliatePrediction } from './utils/calculator';
import { analyzeProductScreenshot } from './utils/geminiClient';
import { ShieldCheck, Sparkles, CheckCircle2 } from 'lucide-react';

// Sample dataset based on the real uploaded TikTok Shop earphone analytics screenshot
const SAMPLE_EARPHONE_DATA: ExtractedProductData = {
  productName: 'Wired Earphone (12K+ Toko Pembelian Ulang)',
  totalOrders: 19500,
  totalCreators: 21000,
  ctrPercent: 2.6,
  cartAdds: 63100,
  timePeriod: '7 hari terakhir (3 Okt - 9 Okt 2026)',
  platform: 'TikTok Shop',
  notes: 'Data analitik dari panel Tren Produk TikTok Shop',
};

const DEFAULT_PARAMS: PredictionParameters = {
  views: 1000,
  targetConfidence: 0.90,
  checkoutCrPercent: 1.0,
};

export default function App() {
  const [results, setResults] = useState<PredictionResults | null>(null);
  const [currentParams, setCurrentParams] = useState<PredictionParameters>(DEFAULT_PARAMS);
  const [isLoading, setIsLoading] = useState(false);
  const [loadingMessage, setLoadingMessage] = useState('');
  const [error, setError] = useState<string | null>(null);

  const handleAnalyze = async (imageInput: File | string, params: PredictionParameters) => {
    setIsLoading(true);
    setError(null);
    setCurrentParams(params);

    try {
      setLoadingMessage('Mengekstrak data metrik dari gambar...');

      const timer1 = setTimeout(() => {
        setLoadingMessage('Menganalisis rasio CTR, saturasi pasar, dan checkout rate...');
      }, 1400);

      const timer2 = setTimeout(() => {
        setLoadingMessage('Menghitung proyeksi probabilitas closing per video...');
      }, 2800);

      const extracted = await analyzeProductScreenshot(imageInput);

      clearTimeout(timer1);
      clearTimeout(timer2);

      const prediction = calculateAffiliatePrediction(extracted, params);
      setResults(prediction);
    } catch (err: unknown) {
      const errorObj = err as Error;
      console.error('Analysis failed:', errorObj);
      setError(errorObj.message || 'Gagal memproses screenshot analitik. Pastikan gambar jelas dan coba kembali.');
    } finally {
      setIsLoading(false);
      setLoadingMessage('');
    }
  };

  const handleUseSampleData = () => {
    setError(null);
    const prediction = calculateAffiliatePrediction(SAMPLE_EARPHONE_DATA, currentParams);
    setResults(prediction);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleUpdateMetrics = (updatedData: ExtractedProductData) => {
    if (!results) return;
    const newPrediction = calculateAffiliatePrediction(updatedData, results.parameters);
    setResults(newPrediction);
  };

  const handleReset = () => {
    setResults(null);
    setError(null);
  };

  return (
    <div className="min-h-screen bg-[#f8fafc] text-slate-800 flex flex-col selection:bg-[#FE2C55] selection:text-white">
      {/* Navigation Header */}
      <Header onLoadSampleData={handleUseSampleData} />

      {/* Main Content Area */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-10">
        {!results ? (
          <InputSection
            onAnalyze={handleAnalyze}
            isLoading={isLoading}
            loadingMessage={loadingMessage}
            error={error}
            onClearError={() => setError(null)}
            onUseSampleData={handleUseSampleData}
          />
        ) : (
          <Dashboard
            results={results}
            onReset={handleReset}
            onUpdateMetrics={handleUpdateMetrics}
          />
        )}
      </main>

      {/* Privacy Guarantee & Professional Footer */}
      <footer className="border-t border-slate-200 bg-white py-8 px-4 sm:px-6 lg:px-8 text-xs text-slate-500 mt-auto">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-4 text-center md:text-left">
          <div className="flex items-center gap-2">
            <ShieldCheck className="w-4 h-4 text-emerald-600" />
            <span>
              <strong>Zero Database Policy:</strong> Seluruh gambar dan hasil analitik diproses langsung di memori browser Anda (Client-Side Privacy First).
            </span>
          </div>

          <div className="flex items-center gap-4 text-slate-400">
            <span>Affiliate Predictor AI • All Rights Reserved</span>
            <span>•</span>
            <span className="text-emerald-700 font-semibold flex items-center gap-1">
              <CheckCircle2 className="w-3.5 h-3.5" />
              Sistem Aktif & Terlindungi
            </span>
          </div>
        </div>
      </footer>
    </div>
  );
}
