import React from 'react';
import { Banknote } from 'lucide-react';
import { FundFlowData, FundFlowItem } from '../types';

interface Props {
  data?: FundFlowData;
}

const FlowList: React.FC<{ title: string; items: FundFlowItem[] }> = ({ title, items }) => (
    <div className="flex-1 min-w-[140px]">
        <h4 className="text-xs text-slate-500 font-semibold mb-2 flex items-center gap-1">
             {title}
        </h4>
        <div className="space-y-2">
            {items.map((item, idx) => (
                <div key={idx} className="flex justify-between items-center bg-slate-800/40 p-2 rounded border border-slate-700/50">
                    <span className="text-sm text-slate-200 font-medium truncate">{item.name}</span>
                    <span className="text-xs text-stockRed font-bold bg-red-900/10 px-1.5 py-0.5 rounded border border-red-500/10">
                        +{item.amount}
                    </span>
                </div>
            ))}
            {items.length === 0 && <div className="text-xs text-slate-600 text-center py-2">暂无数据</div>}
        </div>
    </div>
);

const FundFlowWidget: React.FC<Props> = ({ data }) => {
  if (!data) return null;

  return (
    <div className="bg-cardBg p-6 rounded-xl border border-slate-700 shadow-lg h-full overflow-hidden flex flex-col">
      <h3 className="text-gray-400 text-sm font-semibold uppercase tracking-wider mb-4 flex items-center gap-2">
        <Banknote size={16} className="text-emerald-400" /> 主力资金流向
      </h3>

      <div className="flex-1 overflow-y-auto flex gap-4">
          <FlowList title="近3日净流入" items={data.day3 || []} />
          <div className="w-px bg-slate-700/50 my-2"></div>
          <FlowList title="近5日净流入" items={data.day5 || []} />
      </div>
    </div>
  );
};

export default FundFlowWidget;