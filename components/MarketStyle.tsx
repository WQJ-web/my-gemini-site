import React from 'react';
import { Bot, BarChart2 } from 'lucide-react';
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, Cell } from 'recharts';
import { StyleStat } from '../types';

interface Props {
  styleAnalysis: string;
  styleStats?: StyleStat[];
  aiSummary: string;
}

const MarketStyle: React.FC<Props> = ({ styleAnalysis, styleStats, aiSummary }) => {
    
  // Custom tooltip for the chart
  const CustomTooltip = ({ active, payload, label }: any) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-slate-800 border border-slate-600 p-2 rounded shadow-xl">
          <p className="text-slate-200 text-sm font-semibold">{label}</p>
          <p className="text-blue-400 text-xs">
            强度: {payload[0].value}
          </p>
        </div>
      );
    }
    return null;
  };

  return (
    <div className="bg-cardBg p-6 rounded-xl border border-slate-700 shadow-lg h-full flex flex-col">
       <div className="mb-6 pb-6 border-b border-slate-700 flex flex-col md:flex-row gap-6">
            <div className="flex-1">
                <h3 className="text-gray-400 text-sm font-semibold uppercase tracking-wider mb-2 flex items-center gap-2">
                    <BarChart2 size={16} className="text-blue-400" /> 市场风格分析
                </h3>
                <p className="text-slate-200 font-medium leading-relaxed">{styleAnalysis}</p>
            </div>
            
            {/* Visualization Chart */}
            {styleStats && styleStats.length > 0 && (
                <div className="flex-1 min-h-[160px] md:border-l border-slate-700 md:pl-6">
                    <h4 className="text-xs text-slate-500 font-semibold mb-2">风格强度 (0-100)</h4>
                    <ResponsiveContainer width="100%" height="100%">
                        <BarChart data={styleStats} layout="vertical" margin={{ top: 5, right: 30, left: 20, bottom: 5 }}>
                            <XAxis type="number" domain={[0, 100]} hide />
                            <YAxis 
                                dataKey="label" 
                                type="category" 
                                width={70} 
                                tick={{ fill: '#94a3b8', fontSize: 12 }} 
                                axisLine={false}
                                tickLine={false}
                            />
                            <Tooltip content={<CustomTooltip />} cursor={{fill: '#334155', opacity: 0.4}} />
                            <Bar dataKey="score" radius={[0, 4, 4, 0]} barSize={20}>
                                {styleStats.map((entry, index) => (
                                    <Cell key={`cell-${index}`} fill={entry.score > 60 ? '#f59e0b' : '#3b82f6'} />
                                ))}
                            </Bar>
                        </BarChart>
                    </ResponsiveContainer>
                </div>
            )}
       </div>

       <div className="flex-1 overflow-y-auto">
            <h3 className="text-gray-400 text-sm font-semibold uppercase tracking-wider mb-3 flex items-center gap-2">
                <Bot size={16} className="text-emerald-400" /> AI 深度复盘逻辑
            </h3>
            <div className="prose prose-invert prose-sm max-w-none text-slate-300">
               <div className="whitespace-pre-wrap font-sans text-sm leading-7">
                   {aiSummary}
               </div>
            </div>
       </div>
    </div>
  );
};

export default MarketStyle;