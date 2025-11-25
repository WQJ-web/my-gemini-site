import React, { useEffect, useState } from 'react';
import { fetchMarketReview } from './services/geminiService';
import { MarketData, APIResponse } from './types';
import SentimentGauge from './components/SentimentGauge';
import HotSectors from './components/HotSectors';
import LadderWidget from './components/LadderWidget';
import MarketStyle from './components/MarketStyle';
import GroundingSources from './components/GroundingSources';
import MacroOverview from './components/MacroOverview';
import { Loader2, TrendingUp, RefreshCw, Key, Lock } from 'lucide-react';

const App: React.FC = () => {
  const [data, setData] = useState<MarketData | null>(null);
  const [sources, setSources] = useState<any[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [rawText, setRawText] = useState<string>("");
  
  // Key Management State
  const [apiKey, setApiKey] = useState<string>("");
  const [showKeyModal, setShowKeyModal] = useState<boolean>(false);

  useEffect(() => {
    // 1. Check if key exists in storage on load
    const storedKey = localStorage.getItem('gemini_api_key');
    const envKey = (import.meta as any).env?.VITE_API_KEY; 
    
    if (storedKey) {
      setApiKey(storedKey);
      loadData(storedKey);
    } else if (envKey) {
      setApiKey(envKey);
      loadData(envKey);
    } else {
      setShowKeyModal(true);
    }
  }, []);

  const saveKeyAndRun = (inputKey: string) => {
    if (!inputKey.trim()) return;
    localStorage.setItem('gemini_api_key', inputKey.trim());
    setApiKey(inputKey.trim());
    setShowKeyModal(false);
    loadData(inputKey.trim());
  };

  const clearKey = () => {
    localStorage.removeItem('gemini_api_key');
    setApiKey("");
    setData(null);
    setShowKeyModal(true);
  };

  const loadData = async (keyToUse: string) => {
    if (!keyToUse) {
        setShowKeyModal(true);
        return;
    }
    setLoading(true);
    setError(null);
    try {
      const response: APIResponse = await fetchMarketReview(keyToUse);
      if (response.data) {
        setData(response.data);
      } else {
        setError("无法解析市场数据结构，显示原始内容。");
      }
      setSources(response.groundingChunks);
      setRawText(response.rawText);
    } catch (err: any) {
      console.error(err);
      if (err.message === "MISSING_KEY") {
        setShowKeyModal(true);
      } else {
        setError(err.message || "Failed to fetch market data. Please check your API Key.");
      }
    } finally {
      setLoading(false);
    }
  };

  // --- Render: Key Input Modal ---
  if (showKeyModal) {
    return (
      <div className="min-h-screen bg-darkBg flex items-center justify-center p-4">
        <div className="bg-cardBg p-8 rounded-2xl border border-slate-700 shadow-2xl max-w-md w-full">
            <div className="flex flex-col items-center mb-6">
                <div className="w-12 h-12 bg-blue-600/20 rounded-full flex items-center justify-center mb-4">
                    <Key className="text-blue-400" size={24} />
                </div>
                <h2 className="text-2xl font-bold text-white">配置 API 密钥</h2>
                <p className="text-slate-400 text-center mt-2 text-sm">
                    为了使用 AI 复盘功能，请输入您的 Google Gemini API Key。它将仅存储在您的本地浏览器中。
                </p>
            </div>
            
            <form onSubmit={(e) => { e.preventDefault(); const fd = new FormData(e.currentTarget); saveKeyAndRun(fd.get('key') as string); }}>
                <div className="relative mb-6">
                    <Lock className="absolute left-3 top-3 text-slate-500" size={18} />
                    <input 
                        name="key"
                        type="password" 
                        placeholder="粘贴以 AIza 开头的 Key..."
                        className="w-full bg-slate-900 border border-slate-700 rounded-lg py-3 pl-10 pr-4 text-white focus:outline-none focus:border-blue-500 transition-colors"
                        autoFocus
                    />
                </div>
                <button 
                    type="submit"
                    className="w-full bg-gradient-to-r from-blue-600 to-blue-500 hover:from-blue-500 hover:to-blue-400 text-white font-bold py-3 rounded-lg shadow-lg shadow-blue-900/30 transition-all transform active:scale-95"
                >
                    开始复盘
                </button>
            </form>
            <p className="mt-6 text-xs text-center text-slate-600">
                还没有 Key? 去 <a href="https://aistudio.google.com/app/apikey" target="_blank" className="text-blue-500 underline">Google AI Studio</a> 免费申请。
            </p>
        </div>
      </div>
    );
  }

  // --- Render: Loading Screen ---
  if (loading) {
    return (
      <div className="min-h-screen bg-darkBg flex flex-col items-center justify-center text-slate-300">
        <Loader2 className="animate-spin mb-4 text-blue-500" size={48} />
        <h2 className="text-xl font-semibold">AI 正在复盘全市场数据...</h2>
        <p className="text-sm text-slate-500 mt-2">正在通过 Google Search 检索今日涨停、题材与龙虎榜</p>
      </div>
    );
  }

  // --- Render: Main Dashboard ---
  const hasData = !!data;

  return (
    <div className="min-h-screen bg-darkBg p-4 sm:p-6 lg:p-8 text-slate-200">
      {/* Header */}
      <header className="mb-8 flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-slate-800 pb-6">
        <div>
          <h1 className="text-3xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-purple-400 flex items-center gap-3">
            <TrendingUp className="text-blue-500" />
            A-Share Alpha Insight
          </h1>
          <p className="text-slate-500 mt-1 flex items-center gap-2">
            <span className="bg-slate-800 px-2 py-0.5 rounded text-xs text-slate-400">A股超短复盘</span>
            {data?.date && <span className="text-slate-400 text-sm">Target Date: {data.date}</span>}
          </p>
        </div>
        
        <div className="flex gap-3">
            <button 
            onClick={clearKey}
            className="flex items-center justify-center gap-2 px-3 py-2 bg-slate-800 hover:bg-slate-700 text-slate-300 rounded-lg transition-all font-medium text-xs border border-slate-700"
            title="更换 API Key"
            >
            <Key size={14} /> 更换 Key
            </button>
            <button 
            onClick={() => loadData(apiKey)}
            className="flex items-center justify-center gap-2 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-all font-medium text-sm shadow-lg shadow-blue-900/20"
            >
            <RefreshCw size={16} /> 刷新复盘
            </button>
        </div>
      </header>

      {error && !hasData && (
        <div className="bg-red-900/20 border border-red-900/50 p-6 rounded-xl text-red-200 text-center max-w-2xl mx-auto">
          <p className="font-bold mb-2">出错了</p>
          <p>{error}</p>
          <button onClick={() => loadData(apiKey)} className="mt-4 px-4 py-2 bg-red-800 rounded hover:bg-red-700 text-sm">重试</button>
        </div>
      )}

      {hasData && (
        <main className="grid grid-cols-1 lg:grid-cols-12 gap-6 auto-rows-[minmax(350px,auto)]">
          {/* New: Macro Overview Row */}
          <div className="lg:col-span-12">
            <MacroOverview data={data.macro} />
          </div>

          {/* Top Row: Sentiment (Left, 4 cols) & Hot Sectors (Right, 8 cols) */}
          <div className="lg:col-span-4 lg:row-span-1">
            <SentimentGauge data={data.sentiment} />
          </div>
          
          <div className="lg:col-span-4 lg:row-span-1">
             <LadderWidget ladder={data.ladder} />
          </div>

          <div className="lg:col-span-4 lg:row-span-1">
             <HotSectors sectors={data.hotSectors} />
          </div>

          {/* Bottom Row: AI Analysis & Style */}
          <div className="lg:col-span-12 min-h-[400px]">
            <MarketStyle 
              styleAnalysis={data.styleAnalysis} 
              styleStats={data.styleStats}
              aiSummary={data.aiSummary || rawText} 
            />
          </div>
        </main>
      )}

      <GroundingSources sources={sources} />
    </div>
  );
};

export default App;