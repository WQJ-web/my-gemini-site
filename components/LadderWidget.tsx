import React from 'react';
import { Layers } from 'lucide-react';
import { LadderLevel } from '../types';

interface Props {
  ladder: LadderLevel[];
}

const LadderWidget: React.FC<Props> = ({ ladder }) => {
  return (
    <div className="bg-cardBg p-6 rounded-xl border border-slate-700 shadow-lg h-full overflow-hidden flex flex-col">
      <h3 className="text-gray-400 text-sm font-semibold uppercase tracking-wider mb-4 flex items-center gap-2">
        <Layers size={16} className="text-purple-400" /> 连板天梯 (高度空间)
      </h3>

      <div className="flex-1 overflow-y-auto pr-2 space-y-3">
         {ladder.length === 0 && <div className="text-slate-500 text-center py-4">暂无连板数据</div>}
         {ladder.map((level, idx) => {
             // Generate dynamic styles based on board height severity
             const isHigh = idx === 0; // Highest board
             const bgColor = isHigh ? 'bg-purple-900/30 border-purple-500/50' : 'bg-slate-800/30 border-slate-700';
             
             return (
                <div key={idx} className={`relative p-3 rounded-lg border ${bgColor} flex items-center gap-4 transition-all hover:bg-slate-800`}>
                    <div className="flex flex-col items-center justify-center min-w-[60px] h-full border-r border-slate-700 pr-4">
                        <span className={`text-lg font-black ${isHigh ? 'text-purple-400' : 'text-slate-300'}`}>
                            {level.level.replace(/[^0-9]/g, '')}
                        </span>
                        <span className="text-[10px] text-slate-500 uppercase">Boards</span>
                    </div>
                    <div className="flex flex-wrap gap-2">
                        {level.stocks.map((stock, sIdx) => (
                            <span key={sIdx} className="px-2 py-1 bg-red-600/20 text-red-200 text-sm rounded border border-red-500/30 hover:bg-red-600/40 cursor-default">
                                {stock}
                            </span>
                        ))}
                    </div>
                </div>
             );
         })}
      </div>
    </div>
  );
};

export default LadderWidget;
