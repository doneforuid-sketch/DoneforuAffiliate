import React, { useState } from 'react';
import { Sparkles, ShieldCheck, BookOpen } from 'lucide-react';
import { TutorialModal } from './TutorialModal';

interface HeaderProps {
  onLoadSampleData: () => void;
}

export const Header: React.FC<HeaderProps> = ({ onLoadSampleData }) => {
  const [isTutorialOpen, setIsTutorialOpen] = useState(false);

  return (
    <>
      <header className="sticky top-0 z-40 bg-white/95 backdrop-blur-md border-b border-slate-200/80 shadow-2xs">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16 sm:h-20">
            {/* Logo & Brand */}
            <div className="flex items-center gap-3">
              {/* TikTok inspired icon with Cyan & Red accent */}
              <div className="relative w-10 h-10 sm:w-11 sm:h-11 rounded-xl bg-[#121212] flex items-center justify-center shadow-md shadow-black/15 overflow-hidden group">
                {/* Cyan & Red glow corners */}
                <div className="absolute -top-1 -left-1 w-4 h-4 bg-[#25F4EE] rounded-full blur-xs opacity-80" />
                <div className="absolute -bottom-1 -right-1 w-4 h-4 bg-[#FE2C55] rounded-full blur-xs opacity-80" />
                <span className="relative z-10 text-white font-black text-lg sm:text-xl tracking-tight">
                  AP
                </span>
              </div>

              <div>
                <div className="flex items-center gap-2">
                  <h1 className="text-lg sm:text-xl font-black text-slate-900 tracking-tight flex items-center gap-1.5">
                    Affiliate Predictor <span className="text-[#FE2C55] font-black">AI</span>
                  </h1>
                  <span className="hidden md:inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-emerald-50 text-emerald-700 border border-emerald-200">
                    <ShieldCheck className="w-3 h-3 text-emerald-600" />
                    Privacy-First (No DB)
                  </span>
                </div>
                <p className="text-xs text-slate-500 hidden sm:block font-medium">
                  TikTok Shop Affiliate Intelligence Engine
                </p>
              </div>
            </div>

            {/* Action buttons */}
            <div className="flex items-center gap-2 sm:gap-2.5">
              {/* Tutorial / Panduan Button */}
              <button
                onClick={() => setIsTutorialOpen(true)}
                type="button"
                className="inline-flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs font-bold bg-white hover:bg-slate-50 text-slate-700 border border-slate-200 hover:border-slate-300 transition-all shadow-2xs active:scale-95 cursor-pointer"
                title="Buka panduan langkah demi langkah penggunaan sistem"
              >
                <BookOpen className="w-3.5 h-3.5 text-slate-500" />
                <span className="hidden sm:inline">Panduan</span>
                <span className="sm:hidden">Bantuan</span>
              </button>

              {/* Quick Demo Sample Data Button */}
              <button
                onClick={onLoadSampleData}
                type="button"
                className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-xs font-bold bg-slate-50 hover:bg-slate-100 text-slate-800 border border-slate-200 hover:border-slate-300 transition-all shadow-2xs active:scale-95 cursor-pointer"
                title="Coba simulasi dengan screenshot contoh Wired Earphone"
              >
                <Sparkles className="w-3.5 h-3.5 text-[#FFB800]" />
                <span>Coba Demo Contoh</span>
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* Tutorial Interactive Modal */}
      <TutorialModal
        isOpen={isTutorialOpen}
        onClose={() => setIsTutorialOpen(false)}
        onTryDemo={onLoadSampleData}
      />
    </>
  );
};
