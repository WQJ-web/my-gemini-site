import React from 'react';
import { ResponsiveContainer, PieChart, Pie, Cell } from 'recharts';
import { ArrowUp, ArrowDown, Activity, Minus } from 'lucide-react';
import { MarketSentiment } from '../types';

interface Props {
  data: MarketSentiment;
}

const SentimentGauge: React.FC<Props> = ({ data }) => {
  const pieData = [
    { name: 'Score', value: data.sentimentScore },
    { name: 'Remaining', value: 100 - data.sentimentScore },
  ];

  const scoreColor = data.sentimentScore > 50 ? '#ef4444' : '#22c55e';
  const totalStocks = data.upCount + data.downCount + data.flatCount;
  
  // Prevent division by zero
  const upPct = totalStocks ? (data.upCount / totalStocks) * 100 : 0;
  const downPct = totalStocks ? (data.downCount / totalStocks) * 100 : 0;
  const flatPct = totalStocks ? (data.flatCount / totalStocks) * 100 : 0;

  return (
    <div className="bg-cardBg p-6 rounded-xl border border-slate-700 shadow-lg flex flex-col items-center justify-between h-full">
      <div className="w-full flex justify-between items-start mb-2">
        <h3 className="text-gray-400 text-sm font-semibold uppercase tracking-wider flex items-center gap-2">
            <Activity size={16} /> 市场核心数据
        </h3>
        <div className="bg-slate-800 px-3 py-1 rounded border border-slate-600">
            <span className="text-xs text-slate-400 mr-2">成交额</span>
            <span className="text-lg font-mono font-bold text-yellow-400">{data.totalTurnover}</span>
        </div>
      </div>

      <div className="w-full flex gap-6 items-center">
          {/* Gauge */}
          <div className="w-32 h-32 relative flex-shrink-0">
            <ResponsiveContainer width="100%" height="100%">
            <PieChart>
                <Pie
                data={pieData}
                cx="50%"
                cy="50%"
                startAngle={90}
                endAngle={-270}
                innerRadius={45}
                outerRadius={60}
                paddingAngle={0}
                dataKey="value"
                stroke="none"
                >
                <Cell key="cell-0" fill={scoreColor} />
                <Cell key="cell-1" fill="#334155" />
                </Pie>
            </PieChart>
            </ResponsiveContainer>
            <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
                <span className="text-2xl font-bold text-white">{data.sentimentScore}</span>
                <span className="text-[10px] text-slate-400">情绪值</span>
            </div>
          </div>

          {/* Limit Up/Down Stats */}
          <div className="flex-1 grid grid-cols-2 gap-3">
             <div className="bg-red-500/10 p-2 rounded border border-red-500/20 text-center">
                 <div className="flex items-center justify-center gap-1 text-red-400 text-xs font-bold mb-1">
                     <ArrowUp size={12} /> 涨停
                 </div>
                 <span className="text-xl font-bold text-stockRed">{data.limitUpCount}</span>
             </div>
             <div className="bg-green-500/10 p-2 rounded border border-green-500/20 text-center">
                 <div className="flex items-center justify-center gap-1 text-green-400 text-xs font-bold mb-1">
                     <ArrowDown size={12} /> 跌停
                 </div>
                 <span className="text-xl font-bold text-stockGreen">{data.limitDownCount}</span>
             </div>
             <div className="col-span-2 text-center text-sm text-slate-300 font-medium">
                {data.sentimentDescription}
             </div>
          </div>
      </div>

      {/* Distribution Bar */}
      <div className="w-full mt-4">
        <div className="flex justify-between text-xs text-slate-400 mb-1 px-1">
            <span className="text-stockRed flex items-center gap-1"><ArrowUp size={10}/> {data.upCount}</span>
            <span className="text-slate-400 flex items-center gap-1"><Minus size={10}/> {data.flatCount}</span>
            <span className="text-stockGreen flex items-center gap-1"><ArrowDown size={10}/> {data.downCount}</span>
        </div>
        <div className="w-full h-3 bg-slate-800 rounded-full overflow-hidden flex">
            <div className="bg-stockRed h-full transition-all duration-1000" style={{ width: `${upPct}%` }}></div>
            <div className="bg-slate-500 h-full transition-all duration-1000" style={{ width: `${flatPct}%` }}></div>
            <div className="bg-stockGreen h-full transition-all duration-1000" style={{ width: `${downPct}%` }}></div>
        </div>
      </div>
    </div>
  );
};

export default SentimentGauge;