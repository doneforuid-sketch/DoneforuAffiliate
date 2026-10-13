import {
  ExtractedProductData,
  PredictionParameters,
  PredictionResults,
  VideoProgressionStep,
  MarketCompetitionStatus,
  MarketDemandStatus,
  StrategicInsights,
} from '../types';

export function calculateAffiliatePrediction(
  data: ExtractedProductData,
  params: PredictionParameters
): PredictionResults {
  const safeOrders = Math.max(1, data.totalOrders);
  const safeCreators = Math.max(1, data.totalCreators);
  const safeCartAdds = Math.max(1, data.cartAdds);
  const safeViews = Math.max(10, params.views);
  const safeConfidence = Math.min(0.999, Math.max(0.01, params.targetConfidence));
  const safeCheckoutCr = Math.max(0.0001, params.checkoutCrPercent);
  const safeCtr = Math.max(0.001, data.ctrPercent);

  // 1. orders_per_creator = total_orders / total_creators
  const ordersPerCreator = safeOrders / safeCreators;

  // 2. cart_to_order_rate = (total_orders / cart_adds) * 100
  const cartToOrderRate = (safeOrders / safeCartAdds) * 100;

  // 3. P_single_video = 1 - ((1 - (CTR * checkout_cr)) ^ views)
  const ctrDecimal = safeCtr / 100;
  const checkoutCrDecimal = safeCheckoutCr / 100;
  const pPerView = Math.min(0.999999, ctrDecimal * checkoutCrDecimal);

  // Probability of at least 1 order in 1 video with `views` views
  let pSingleVideo = 1 - Math.pow(1 - pPerView, safeViews);
  pSingleVideo = Math.min(0.99999, Math.max(0.0001, pSingleVideo));

  // 4. recommended_videos = CEIL( LN(1 - target_confidence) / LN(1 - P_single_video) )
  const lnConfidence = Math.log(1 - safeConfidence);
  const lnNotSingle = Math.log(1 - pSingleVideo);
  let recommendedVideos = Math.ceil(lnConfidence / lnNotSingle);
  if (recommendedVideos < 1 || !isFinite(recommendedVideos)) {
    recommendedVideos = 1;
  }
  if (recommendedVideos > 100) {
    recommendedVideos = 100;
  }

  // 5. Progression table (Video 1 to max(15, recommendedVideos))
  const tableLength = Math.max(15, Math.min(25, recommendedVideos));
  const cumulativeTable: VideoProgressionStep[] = [];
  let prevProb = 0;

  for (let n = 1; n <= tableLength; n++) {
    const cumulativeProbability = 1 - Math.pow(1 - pSingleVideo, n);
    const incrementalGain = cumulativeProbability - prevProb;
    prevProb = cumulativeProbability;

    cumulativeTable.push({
      videoCount: n,
      cumulativeProbability,
      incrementalGain,
      targetReached: cumulativeProbability >= safeConfidence,
    });
  }

  // 6. Market Competition Status (Saturasi)
  let competitionStatus: MarketCompetitionStatus;
  if (ordersPerCreator < 1.0) {
    competitionStatus = {
      level: 'HIGH_SATURATION',
      title: 'Saturasi Tinggi / Kompetisi Ketat',
      badgeClass: 'bg-rose-500/20 text-rose-300 border-rose-500/40',
      textColor: 'text-rose-400',
      bgLight: 'bg-rose-950/40',
      description: `Rata-rata hanya ${ordersPerCreator.toFixed(2)} pesanan per kreator. Jumlah kreator (${safeCreators.toLocaleString('id-ID')}) melampaui output pesanan (${safeOrders.toLocaleString('id-ID')}). Wajib menggunakan angle unik & problem-solving!`,
      creatorRatio: ordersPerCreator,
    };
  } else if (ordersPerCreator <= 2.5) {
    competitionStatus = {
      level: 'MODERATE',
      title: 'Kompetisi Sehat / Sedang',
      badgeClass: 'bg-amber-500/20 text-amber-300 border-amber-500/40',
      textColor: 'text-amber-400',
      bgLight: 'bg-amber-950/40',
      description: `Rata-rata ${ordersPerCreator.toFixed(2)} pesanan per kreator. Pasar aktif dan stabil. Konsistensi konten dengan storytelling natural akan memenangkan traffic pembeli.`,
      creatorRatio: ordersPerCreator,
    };
  } else {
    competitionStatus = {
      level: 'HIGH_POTENTIAL',
      title: 'Peluang Emas / Potensi Tinggi',
      badgeClass: 'bg-emerald-500/20 text-emerald-300 border-emerald-500/40',
      textColor: 'text-emerald-400',
      bgLight: 'bg-emerald-950/40',
      description: `Sangat potensial! Rata-rata ${ordersPerCreator.toFixed(2)} pesanan per kreator. Permintaan pasar melimpah melampaui jumlah kreator aktif yang ada saat ini.`,
      creatorRatio: ordersPerCreator,
    };
  }

  // 7. Market Demand Status (Cart to Order Conversion)
  let demandStatus: MarketDemandStatus;
  if (cartToOrderRate >= 30.0) {
    demandStatus = {
      level: 'STRONG',
      title: 'Minat Checkout Sangat Kuat',
      badgeClass: 'bg-emerald-500/20 text-emerald-300 border-emerald-500/40',
      textColor: 'text-emerald-400',
      bgLight: 'bg-emerald-950/40',
      description: `Sebesar ${cartToOrderRate.toFixed(1)}% penambahan keranjang berhasil terkonversi jadi transaksi. Produk ini memiliki daya tarik instan tinggi tanpa banyak keraguan checkout.`,
      cartToOrderRate,
    };
  } else if (cartToOrderRate >= 15.0) {
    demandStatus = {
      level: 'MODERATE',
      title: 'Minat Keranjang Stabil',
      badgeClass: 'bg-blue-500/20 text-blue-300 border-blue-500/40',
      textColor: 'text-blue-400',
      bgLight: 'bg-blue-950/40',
      description: `Tingkat checkout ${cartToOrderRate.toFixed(1)}% dari keranjang. Pembeli tertarik namun perlu sentuhan reminder harga terjangkau atau garansi kualitas.`,
      cartToOrderRate,
    };
  } else {
    demandStatus = {
      level: 'FRICTION',
      title: 'Keranjang Tinggi, Checkout Tertahan',
      badgeClass: 'bg-orange-500/20 text-orange-300 border-orange-500/40',
      textColor: 'text-orange-400',
      bgLight: 'bg-orange-950/40',
      description: `Banyak yang menyimpan ke keranjang (${safeCartAdds.toLocaleString('id-ID')}), namun rasio checkout baru ${cartToOrderRate.toFixed(1)}%. Solusi: tekankan promo gratis ongkir & countdown voucher diskon!`,
      cartToOrderRate,
    };
  }

  // 8. Product Viability Assessment Engine (Skala 0 - 100)
  // a. Rasio Demand-to-Competition (Bobot 45%)
  let demandScore = 0;
  if (ordersPerCreator >= 3.0) {
    demandScore = 100;
  } else if (ordersPerCreator < 1.0) {
    demandScore = (ordersPerCreator / 1.0) * 50;
  } else {
    demandScore = 50 + ((ordersPerCreator - 1.0) / 2.0) * 50;
  }
  demandScore = Math.min(100, Math.max(0, demandScore));

  // b. Minat Nyata Checkout / Cart-to-Order (Bobot 35%)
  const cartRatio = safeOrders / safeCartAdds;
  let cartScore = 0;
  if (cartRatio >= 0.30) {
    cartScore = 100;
  } else {
    cartScore = (cartRatio / 0.30) * 100;
  }
  cartScore = Math.min(100, Math.max(0, cartScore));

  // c. CTR Keranjang Kuning (Bobot 20%)
  const ctrRatio = ctrDecimal;
  let ctrScore = 0;
  if (ctrRatio >= 0.035) {
    ctrScore = 100;
  } else {
    ctrScore = (ctrRatio / 0.035) * 100;
  }
  ctrScore = Math.min(100, Math.max(0, ctrScore));

  // Skor Total = (Skor Demand * 0.45) + (Skor Cart * 0.35) + (Skor CTR * 0.20)
  const totalViabilityScore = Math.min(
    100,
    Math.max(0, Math.round(demandScore * 0.45 + cartScore * 0.35 + ctrScore * 0.20))
  );

  let viability: PredictionResults['viability'];
  if (totalViabilityScore >= 80) {
    viability = {
      totalScore: totalViabilityScore,
      status: 'SANGAT_LAYAK',
      badgeText: 'SANGAT LAYAK',
      badgeClass: 'bg-emerald-50 text-emerald-800 border-emerald-300',
      textColor: 'text-emerald-700',
      bgLight: 'bg-emerald-50/70',
      borderClass: 'border-emerald-300',
      progressColor: 'from-emerald-500 to-teal-500',
      recommendationMessage:
        'Permintaan tinggi & kompetisi sehat. Sangat direkomendasikan untuk langsung diproduksi!',
      breakdown: {
        demandScore: Math.round(demandScore),
        cartScore: Math.round(cartScore),
        ctrScore: Math.round(ctrScore),
      },
    };
  } else if (totalViabilityScore >= 60) {
    viability = {
      totalScore: totalViabilityScore,
      status: 'LAYAK_BERSYARAT',
      badgeText: 'LAYAK BERSYARAT',
      badgeClass: 'bg-amber-50 text-amber-900 border-amber-300',
      textColor: 'text-amber-800',
      bgLight: 'bg-amber-50/70',
      borderClass: 'border-amber-300',
      progressColor: 'from-amber-500 to-yellow-500',
      recommendationMessage:
        'Produk terbukti laris, namun kompetisi kreator mulai padat. Wajib gunakan hook unik dan penuhi target video minimum.',
      breakdown: {
        demandScore: Math.round(demandScore),
        cartScore: Math.round(cartScore),
        ctrScore: Math.round(ctrScore),
      },
    };
  } else {
    viability = {
      totalScore: totalViabilityScore,
      status: 'TIDAK_DISARANKAN',
      badgeText: 'TIDAK DISARANKAN',
      badgeClass: 'bg-rose-50 text-rose-800 border-rose-300',
      textColor: 'text-rose-700',
      bgLight: 'bg-rose-50/70',
      borderClass: 'border-rose-300',
      progressColor: 'from-rose-500 to-red-500',
      recommendationMessage:
        'Saturasi kreator terlalu tinggi atau konversi rendah. Kurang ramah untuk akun pemula, prioritaskan produk lain.',
      breakdown: {
        demandScore: Math.round(demandScore),
        cartScore: Math.round(cartScore),
        ctrScore: Math.round(ctrScore),
      },
    };
  }

  // 9. Actionable Insights
  const daysRecommended = Math.max(2, Math.ceil(recommendedVideos / 3));
  const strategicInsights: StrategicInsights = {
    contentHook:
      ordersPerCreator < 1.0
        ? `Gunakan "Anti-Mainstream Hook" dalam 3 detik pertama (misal: "Jangan beli ${data.productName} sebelum tahu 1 kekurangan ini..."). Hindari template review umum karena ratusan kreator memakai gaya yang sama.`
        : `Tampilkan demonstrasi fungsi langsung di detik pertama (contoh: unboxing mikro, tes suara/ketahanan, atau visual sebelum vs sesudah).`,
    competitionAngle:
      ordersPerCreator < 1.0
        ? `Targetkan Micro-Niche tertentu (contoh: khusus mahasiswa, pekerja WFH, gaming santai, atau komuter harian) daripada menjual ke audiens umum yang sudah jenuh.`
        : `Manfaatkan momentum tren saat ini. Soroti fakta bahwa ${safeOrders.toLocaleString('id-ID')} pesanan sudah terjual untuk memperkuat efek Social Proof (bukti sosial).`,
    callToAction:
      cartToOrderRate < 25.0
        ? `Dorong aksi segera (Urgency CTA): "Voucher diskon di keranjang kuning terbatas s/d jam 12 malam ini, langsung checkout sebelum kehabisan!".`
        : `Tekankan kemudahan transaksi: "Klik keranjang kuning di kiri bawah sekarang untuk klaim gratis ongkir sebelum promo berakhir!".`,
    postingSchedule: `Unggah minimal ${recommendedVideos} video variasi berbeda secara konsisten (disarankan 2-3 video/hari selama ${daysRecommended} hari) untuk melipatgandakan peluang algoritma FYP.`,
    riskAssessment:
      ordersPerCreator < 0.8
        ? 'Risiko Kompetisi Tinggi: Jangan hanya unggah 1-2 video lalu menyerah; probabilitas closing baru stabil di atas 90% setelah mencapai rekomendasi video yang dihitung.'
        : 'Risiko Rendah: Konversi produk terbukti positif di ekosistem platform.',
  };

  return {
    productData: data,
    parameters: params,
    viability,
    ordersPerCreator,
    cartToOrderRate,
    pSingleVideo,
    recommendedVideos,
    cumulativeTable,
    competitionStatus,
    demandStatus,
    strategicInsights,
    timestamp: new Date().toISOString(),
  };
}

export function formatCompactNumber(num: number): string {
  if (num >= 1_000_000) {
    return (num / 1_000_000).toLocaleString('id-ID', { maximumFractionDigits: 1 }) + 'M';
  }
  if (num >= 1_000) {
    return (num / 1_000).toLocaleString('id-ID', { maximumFractionDigits: 1 }) + 'K';
  }
  return num.toLocaleString('id-ID');
}
