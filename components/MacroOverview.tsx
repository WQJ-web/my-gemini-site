import React from 'react';
import { Globe } from 'lucide-react';
import { MacroData } from '../types';

interface Props {
  data?: MacroData;
}

const MacroOverview: React.FC<Props> = ({ data }) => {
  if (!data || !data.items || data.items.length === 0) return null;

  return (
    <div className="bg-cardBg p-4 rounded-xl border border-slate-700 shadow-lg mb-6">
      <div className="flex items-center gap-2 mb-3">
        <h3 className="text-gray-400 text-xs font-semibold uppercase tracking-wider flex items-center gap-2">
           <Globe size={14} className="text-blue-400" /> 全球宏观环境
        </h3>
        <span className="text-xs text-slate-500 border-l border-slate-700 pl-2">
            {data.summary}
        </span>
      </div>
      
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-3">
        {data.items.map((item, idx) => (
            <div key={idx} className="bg-slate-800/50 rounded p-2 border border-slate-700/50 flex flex-col justify-center">
                <div className="text-xs text-slate-400 mb-1 truncate">{item.name}</div>
                <div className="flex justify-between items-baseline">
                    <span className="text-sm font-mono text-slate-200">{item.price}</span>
                    <span className={`text-xs font-bold ${item.isUp ? 'text-stockRed' : 'text-stockGreen'}`}>
                        {item.change}
                    </span>
                </div>
            </div>
        ))}
      </div>
    </div>
  );
};

export default MacroOverview;