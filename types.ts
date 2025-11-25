export interface MarketSentiment {
  totalTurnover: string; // e.g. "1.5万亿"
  upCount: number;
  downCount: number;
  flatCount: number; // New: Number of stocks with 0% change
  limitUpCount: number;
  limitDownCount: number;
  sentimentScore: number; // 0-100
  sentimentDescription: string;
}

export interface HotSector {
  name: string;
  limitUpCount: number;
  leaderStock: string; // e.g. "中信证券"
  reason: string;
  stockList: string[]; // New: List of strong stocks in this sector
  firstBoardList?: string[]; // New: List of first-board (1-ban) stocks
}

export interface LadderLevel {
  level: string; // e.g. "5连板"
  stocks: string[];
  reason?: string;
}

export interface StyleStat {
  label: string; // e.g. "权重蓝筹"
  score: number; // 0-100
}

export interface MarketData {
  date: string;
  sentiment: MarketSentiment;
  hotSectors: HotSector[];
  ladder: LadderLevel[];
  styleAnalysis: string; // Market style description
  styleStats?: StyleStat[]; // Quantitative style analysis
  aiSummary: string; // General AI commentary
}

export interface GroundingChunk {
  web?: {
    uri: string;
    title: string;
  };
}

export interface APIResponse {
  data: MarketData | null;
  rawText: string;
  groundingChunks: GroundingChunk[];
}