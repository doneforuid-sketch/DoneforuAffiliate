export interface ExtractedProductData {
  productName: string;
  totalOrders: number;
  totalCreators: number;
  ctrPercent: number;
  cartAdds: number;
  timePeriod?: string;
  platform?: string;
  notes?: string;
}

export interface PredictionParameters {
  views: number;            // Default: 1000
  targetConfidence: number; // Default: 0.90 (90%)
  checkoutCrPercent: number;// Default: 1.0 (1%)
}

export interface VideoProgressionStep {
  videoCount: number;
  cumulativeProbability: number; // 0 to 1
  incrementalGain: number;       // Gain from previous video
  targetReached: boolean;
}

export interface MarketCompetitionStatus {
  level: 'HIGH_SATURATION' | 'MODERATE' | 'HIGH_POTENTIAL';
  title: string;
  badgeClass: string;
  textColor: string;
  bgLight: string;
  description: string;
  creatorRatio: number;
}

export interface MarketDemandStatus {
  level: 'STRONG' | 'MODERATE' | 'FRICTION';
  title: string;
  badgeClass: string;
  textColor: string;
  bgLight: string;
  description: string;
  cartToOrderRate: number;
}

export interface StrategicInsights {
  contentHook: string;
  competitionAngle: string;
  callToAction: string;
  postingSchedule: string;
  riskAssessment: string;
}

export interface ProductViabilityScore {
  totalScore: number; // 0 - 100
  status: 'SANGAT_LAYAK' | 'LAYAK_BERSYARAT' | 'TIDAK_DISARANKAN';
  badgeText: string;
  badgeClass: string;
  textColor: string;
  bgLight: string;
  borderClass: string;
  progressColor: string;
  recommendationMessage: string;
  breakdown: {
    demandScore: number;     // 45% weight
    cartScore: number;       // 35% weight
    ctrScore: number;        // 20% weight
  };
}

export interface PredictionResults {
  productData: ExtractedProductData;
  parameters: PredictionParameters;
  viability: ProductViabilityScore;
  ordersPerCreator: number;
  cartToOrderRate: number;
  pSingleVideo: number;
  recommendedVideos: number;
  cumulativeTable: VideoProgressionStep[];
  competitionStatus: MarketCompetitionStatus;
  demandStatus: MarketDemandStatus;
  strategicInsights: StrategicInsights;
  timestamp: string;
}
