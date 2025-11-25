import { GoogleGenAI } from "@google/genai";
import { APIResponse, MarketData } from "../types";

// Helper to get the best available API key
const getApiKey = (providedKey?: string): string => {
  if (providedKey) return providedKey;
  // Try Local Storage (browser)
  if (typeof window !== 'undefined') {
    const stored = localStorage.getItem('gemini_api_key');
    if (stored) return stored;
  }
  
  // Try Environment variables (Vite Standard)
  return (import.meta as any).env?.VITE_API_KEY || '';
};

export const fetchMarketReview = async (userApiKey?: string): Promise<APIResponse> => {
  const finalApiKey = getApiKey(userApiKey);

  if (!finalApiKey) {
    throw new Error("MISSING_KEY"); // Special error code to trigger UI modal
  }

  // Initialize client dynamically with the specific key
  const ai = new GoogleGenAI({ apiKey: finalApiKey });

  const prompt = `
  作为一个A股量化交易专家，请利用 Google Search 工具搜索 **今日** (如果今日休市，则搜索最近一个交易日) 的A股全市场复盘数据。
  
  **最高指令：所有数据必须基于 Google Search 的实时结果，严禁编造数据！如果搜索不到具体数值，请填 "N/A" 或 0。**
  
  请重点搜索并提取以下数据：
  1. **市场核心数据**：
     - 两市成交总额 (例如：1.5万亿)。
     - 具体涨跌分布：上涨家数、下跌家数、平盘(持平)家数。
     - 涨停家数、跌停家数。
     - 根据以上数据给出一个0-100的市场情绪评分。
  
  2. **热点题材板块**：
     - 找出今日最强的3-5个主线板块。
     - 对于每个板块，列出：板块名称、涨停数量、龙头股、**板块内3-5只代表性强势股**、**今日该板块内的首板个股(挖掘)**、以及上涨的驱动逻辑。
  
  3. **连板天梯**：
     - 统计今日的最高连板高度。
     - 列出各个连板梯队的代表个股，以及该梯队的**上涨核心逻辑/题材**。

  4. **市场风格量化与分析**：
     - 分析资金风格。
     - **关键**：请对以下四种风格进行0-100的强度打分：
       1. "权重蓝筹" (大盘股/中字头等)
       2. "成长赛道" (新能源/科技/医药等趋势)
       3. "连板接力" (纯情绪/高标/妖股)
       4. "微盘投机" (小市值/ST等)

  5. **宏观外围行情**：
     - 搜索隔夜美股收盘表现（纳斯达克、标普500、道琼斯、热门中概股）。
     - 搜索当前大宗商品价格（COMEX黄金、原油）。
     - 搜索离岸人民币汇率 (USD/CNH)。
     - 简述宏观环境对A股今日的影响。

  6. **主力资金流向趋势 (重点搜索)**：
     - **请专门搜索 "东方财富网 行业板块资金流向" 或 "同花顺 资金流向" 的最新数据。**
     - 统计 **近3日** 和 **近5日** 主力资金净流入最多的行业板块。
     - 分别列出前3-5个板块名称及大致净流入金额（务必带上单位，如“20亿”）。

  搜索完成后，请**严格**按照以下两个部分输出：

  **第一部分：JSON数据块**
  必须包含在 \`\`\`json ... \`\`\` 代码块中。格式如下：
  {
    "date": "YYYY-MM-DD",
    "sentiment": {
      "totalTurnover": "精确数字带单位",
      "upCount": 1234,
      "downCount": 1234,
      "flatCount": 123,
      "limitUpCount": 80,
      "limitDownCount": 5,
      "sentimentScore": 85,
      "sentimentDescription": "简短描述，如'放量大涨，情绪高潮'"
    },
    "macro": {
        "summary": "一句话概括宏观影响",
        "items": [
            { "name": "纳斯达克", "price": "16300", "change": "+1.2%", "isUp": true }
        ]
    },
    "fundFlows": {
        "day3": [
            { "name": "半导体", "amount": "50亿" },
            { "name": "证券", "amount": "30亿" }
        ],
        "day5": [
             { "name": "半导体", "amount": "120亿" },
             { "name": "计算机", "amount": "80亿" }
        ]
    },
    "hotSectors": [
      { 
        "name": "板块名", 
        "limitUpCount": 10, 
        "leaderStock": "龙头名", 
        "stockList": ["股票A", "股票B", "股票C"],
        "firstBoardList": ["首板A", "首板B"],
        "reason": "详细逻辑" 
      }
    ],
    "ladder": [
      { "level": "5连板", "stocks": ["股票A", "股票B"], "reason": "并购重组" }
    ],
    "styleStats": [
      { "label": "权重蓝筹", "score": 40 },
      { "label": "成长赛道", "score": 60 },
      { "label": "连板接力", "score": 90 },
      { "label": "微盘投机", "score": 75 }
    ],
    "styleAnalysis": "一句话概括市场风格"
  }

  **第二部分：AI 深度复盘**
  在JSON之后，写一段不少于300字的深度复盘。请像一个资深游资一样思考，分析资金流向、情绪周期阶段（启动/发酵/高潮/分歧/退潮），并给出明日策略预期。使用 Markdown 格式。
  `;

  try {
    const response = await ai.models.generateContent({
      model: "gemini-2.5-flash",
      contents: prompt,
      config: {
        tools: [{ googleSearch: {} }],
      },
    });

    const text = response.text || "";
    const groundingChunks = response.candidates?.[0]?.groundingMetadata?.groundingChunks || [];

    // Parse JSON from code block
    let parsedData: MarketData | null = null;
    const jsonMatch = text.match(/```json\s*([\s\S]*?)\s*```/);
    if (jsonMatch && jsonMatch[1]) {
      try {
        const cleanJson = jsonMatch[1].replace(/\\n/g, ''); 
        parsedData = JSON.parse(cleanJson);
        
        // Extract the narrative part (text after the json block)
        const parts = text.split('```');
        const afterJsonIndex = text.indexOf(jsonMatch[0]) + jsonMatch[0].length;
        const aiSummaryText = text.substring(afterJsonIndex).trim();
        
        if (parsedData) {
             parsedData.aiSummary = aiSummaryText || "暂无文字复盘";
        }
      } catch (e) {
        console.error("Failed to parse extracted JSON", e);
      }
    } else {
        // Fallback
         parsedData = {
            date: new Date().toLocaleDateString(),
            sentiment: {
                totalTurnover: "数据获取失败",
                upCount: 0,
                downCount: 0,
                flatCount: 0,
                limitUpCount: 0,
                limitDownCount: 0,
                sentimentScore: 0,
                sentimentDescription: "AI 解析数据结构失败，请参考下方原始文本"
            },
            hotSectors: [],
            ladder: [],
            styleAnalysis: "未知",
            aiSummary: text,
            // Fallback for fundFlows to prevent UI errors
            fundFlows: {
                day3: [],
                day5: []
            }
         };
    }

    return {
      data: parsedData,
      rawText: text,
      groundingChunks: groundingChunks as any,
    };

  } catch (error) {
    console.error("Gemini API Error:", error);
    throw error;
  }
};