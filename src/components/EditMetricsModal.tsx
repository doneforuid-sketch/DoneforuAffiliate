import React, { useState, useEffect } from 'react';
import { X, Edit3, Check } from 'lucide-react';
import { ExtractedProductData } from '../types';

interface EditMetricsModalProps {
  isOpen: boolean;
  onClose: () => void;
  productData: ExtractedProductData;
  onSave: (updatedData: ExtractedProductData) => void;
}

export const EditMetricsModal: React.FC<EditMetricsModalProps> = ({
  isOpen,
  onClose,
  productData,
  onSave,
}) => {
  const [formData, setFormData] = useState<ExtractedProductData>(productData);

  useEffect(() => {
    if (isOpen) {
      setFormData(productData);
    }
  }, [isOpen, productData]);

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSave({
      ...formData,
      productName: formData.productName.trim() || 'Produk Affiliate',
      totalOrders: Math.max(1, Number(formData.totalOrders) || 1),
      totalCreators: Math.max(1, Number(formData.totalCreators) || 1),
      ctrPercent: Math.max(0.01, Number(formData.ctrPercent) || 0.1),
      cartAdds: Math.max(1, Number(formData.cartAdds) || 1),
    });
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/50 backdrop-blur-xs animate-in fade-in duration-200">
      <div className="relative w-full max-w-lg bg-white border border-slate-200 rounded-3xl shadow-2xl overflow-hidden p-6 text-slate-800">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-1.5 rounded-lg text-slate-400 hover:text-slate-700 hover:bg-slate-100 transition-colors"
        >
          <X className="w-5 h-5" />
        </button>

        <div className="flex items-center gap-3 mb-5">
          <div className="w-10 h-10 rounded-xl bg-[#FE2C55]/10 border border-[#FE2C55]/20 flex items-center justify-center text-[#FE2C55]">
            <Edit3 className="w-5 h-5" />
          </div>
          <div>
            <h3 className="text-lg font-bold text-slate-900">Sesuaikan / Koreksi Angka Metrik</h3>
            <p className="text-xs text-slate-500">Koreksi hasil ekstraksi atau uji coba skenario target penjualan baru</p>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1">
              Nama Produk
            </label>
            <input
              type="text"
              value={formData.productName}
              onChange={(e) => setFormData({ ...formData, productName: e.target.value })}
              className="w-full px-3.5 py-2.5 rounded-xl bg-slate-50 border border-slate-300 text-slate-900 text-sm focus:outline-none focus:ring-2 focus:ring-[#FE2C55] font-semibold"
              required
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">
                Total Pesanan (Orders)
              </label>
              <input
                type="number"
                min="1"
                step="1"
                value={formData.totalOrders}
                onChange={(e) => setFormData({ ...formData, totalOrders: Number(e.target.value) })}
                className="w-full px-3.5 py-2 rounded-xl bg-slate-50 border border-slate-300 text-slate-900 text-sm focus:outline-none focus:ring-2 focus:ring-[#FE2C55] font-semibold"
                required
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">
                Jumlah Kreator
              </label>
              <input
                type="number"
                min="1"
                step="1"
                value={formData.totalCreators}
                onChange={(e) => setFormData({ ...formData, totalCreators: Number(e.target.value) })}
                className="w-full px-3.5 py-2 rounded-xl bg-slate-50 border border-slate-300 text-slate-900 text-sm focus:outline-none focus:ring-2 focus:ring-[#FE2C55] font-semibold"
                required
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">
                CTR (%)
              </label>
              <input
                type="number"
                min="0.01"
                max="100"
                step="0.1"
                value={formData.ctrPercent}
                onChange={(e) => setFormData({ ...formData, ctrPercent: Number(e.target.value) })}
                className="w-full px-3.5 py-2 rounded-xl bg-slate-50 border border-slate-300 text-slate-900 text-sm focus:outline-none focus:ring-2 focus:ring-[#FE2C55] font-semibold"
                required
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">
                Add to Cart (Keranjang)
              </label>
              <input
                type="number"
                min="1"
                step="1"
                value={formData.cartAdds}
                onChange={(e) => setFormData({ ...formData, cartAdds: Number(e.target.value) })}
                className="w-full px-3.5 py-2 rounded-xl bg-slate-50 border border-slate-300 text-slate-900 text-sm focus:outline-none focus:ring-2 focus:ring-[#FE2C55] font-semibold"
                required
              />
            </div>
          </div>

          <div className="pt-3 flex items-center justify-end gap-2 border-t border-slate-100">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 rounded-xl text-xs font-bold text-slate-600 hover:bg-slate-100 transition-colors cursor-pointer"
            >
              Batal
            </button>
            <button
              type="submit"
              className="px-5 py-2 rounded-xl text-xs font-bold bg-[#FE2C55] hover:bg-[#E0264B] text-white transition-colors flex items-center gap-1.5 shadow-md shadow-[#FE2C55]/20 cursor-pointer"
            >
              <Check className="w-3.5 h-3.5" />
              Terapkan & Hitung Ulang
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
