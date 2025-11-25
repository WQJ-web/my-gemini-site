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

export interface MacroItem {
  name: string; // e.g. "纳斯达克", "COMEX黄金"
  price: string; // e.g. "16300.5"
  change: string; // e.g. "+1.25%" or "-0.5%"
  isUp: boolean; // true for red (in CN context), false for green
}

export interface MacroData {
  summary: string; // Brief summary of macro environment
  items: MacroItem[];
}

export interface FundFlowItem {
  name: string;
  amount: string; // e.g. "50.2亿"
}

export interface FundFlowData {
  day3: FundFlowItem[]; // Recent 3 days
  day5: FundFlowItem[]; // Recent 5 days
}

export interface MarketData {
  date: string;
  sentiment: MarketSentiment;
  hotSectors: HotSector[];
  ladder: LadderLevel[];
  styleAnalysis: string; // Market style description
  styleStats?: StyleStat[]; // Quantitative style analysis
  aiSummary: string; // General AI commentary
  macro?: MacroData; // Macro economic context
  fundFlows?: FundFlowData; // New: Capital Flow Data
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