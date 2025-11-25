import React, { useState, useMemo } from 'react';
import { Flame, ChevronDown, ChevronUp, ArrowDownWideNarrow, ArrowUpNarrowWide, Sparkles } from 'lucide-react';
import { HotSector } from '../types';

interface Props {
  sectors: HotSector[];
}

type SortDirection = 'desc' | 'asc';

const HotSectors: React.FC<Props> = ({ sectors }) => {
  // Use name for expansion key so sorting doesn't mess up which item is open
  const [expandedName, setExpandedName] = useState<string | null>(null);
  const [sortDirection, setSortDirection] = useState<SortDirection>('desc');

  const toggleSector = (name: string) => {
    setExpandedName(expandedName === name ? null : name);
  };

  const toggleSort = () => {
    setSortDirection(prev => prev === 'desc' ? 'asc' : 'desc');
  };

  const sortedSectors = useMemo(() => {
    return [...sectors].sort((a, b) => {
      // Primary Sort: Limit Up Count
      const diff = a.limitUpCount - b.limitUpCount;
      if (diff !== 0) {
        return sortDirection === 'desc' ? -diff : diff;
      }
      // Secondary Sort: Stock List Length (as a proxy for activity)
      const lenDiff = (a.stockList?.length || 0) - (b.stockList?.length || 0);
      return sortDirection === 'desc' ? -lenDiff : lenDiff;
    });
  }, [sectors, sortDirection]);

  // Set default expanded to the first item after sort changes (optional, but good UX usually)
  // React.useEffect(() => {
  //   if (sortedSectors.length > 0 && !expandedName) {
  //       setExpandedName(sortedSectors[0].name);
  //   }
  // }, [sortedSectors]);

  return (
    <div className="bg-cardBg p-6 rounded-xl border border-slate-700 shadow-lg h-full overflow-hidden flex flex-col">
      <div className="flex justify-between items-center mb-4">
        <h3 className="text-gray-400 text-sm font-semibold uppercase tracking-wider flex items-center gap-2">
            <Flame size={16} className="text-orange-500" /> 核心热点题材
        </h3>
        
        <button 
            onClick={toggleSort}
            className="flex items-center gap-1.5 px-2 py-1 bg-slate-800 hover:bg-slate-700 rounded text-xs text-slate-400 border border-slate-700 transition-colors"
            title="切换排序方式"
        >
            <span>涨停数</span>
            {sortDirection === 'desc' ? <ArrowDownWideNarrow size={14} /> : <ArrowUpNarrowWide size={14} />}
        </button>
      </div>
      
      <div className="flex-1 overflow-y-auto space-y-3 pr-2">
        {sortedSectors.length === 0 && <div className="text-slate-500 text-center py-4">暂无板块数据</div>}
        {sortedSectors.map((sector, idx) => {
          const isExpanded = expandedName === sector.name;
          return (
            <div 
                key={sector.name} 
                onClick={() => toggleSector(sector.name)}
                className={`cursor-pointer group relative bg-slate-800/40 rounded-lg border transition-all duration-300 overflow-hidden ${isExpanded ? 'border-orange-500/50 bg-slate-800/80' : 'border-slate-700 hover:border-slate-600'}`}
            >
              {/* Card Header */}
              <div className="p-4 flex justify-between items-center">
                <div className="flex items-center gap-3">
                    <div className="flex flex-col">
                        <h4 className="text-lg font-bold text-orange-400 flex items-center gap-2">
                            {sector.name}
                        </h4>
                        <span className="text-xs text-slate-500 mt-0.5">
                            龙头: <span className="text-slate-300">{sector.leaderStock}</span>
                        </span>
                    </div>
                </div>
                
                <div className="flex items-center gap-4">
                     <span className="text-xs bg-red-500/20 text-red-400 px-2 py-1 rounded border border-red-500/30 whitespace-nowrap font-medium">
                      {sector.limitUpCount}板
                    </span>
                    {isExpanded ? <ChevronUp size={18} className="text-slate-400" /> : <ChevronDown size={18} className="text-slate-500" />}
                </div>
              </div>

              {/* Expanded Details */}
              {isExpanded && (
                  <div className="px-4 pb-4 pt-0 border-t border-slate-700/50 mt-2">
                      <div className="mt-3">
                          <p className="text-xs text-slate-400 uppercase font-semibold mb-2">板块逻辑</p>
                          <p className="text-sm text-slate-300 leading-relaxed bg-slate-900/50 p-2 rounded border border-slate-700/50">
                              {sector.reason}
                          </p>
                      </div>

                      <div className="mt-3 grid grid-cols-1 md:grid-cols-2 gap-4">
                          <div>
                              <p className="text-xs text-slate-400 uppercase font-semibold mb-2">强势个股</p>
                              <div className="flex flex-wrap gap-2">
                                  {sector.stockList && sector.stockList.length > 0 ? (
                                      sector.stockList.map((stock, sIdx) => (
                                          <span key={sIdx} className="text-sm px-2 py-1 bg-blue-900/30 text-blue-200 border border-blue-500/20 rounded hover:bg-blue-900/50 transition-colors">
                                              {stock}
                                          </span>
                                      ))
                                  ) : (
                                      <span className="text-sm text-slate-500">暂无数据</span>
                                  )}
                              </div>
                          </div>
                          
                          {/* First Board Stocks Section */}
                          {sector.firstBoardList && sector.firstBoardList.length > 0 && (
                            <div>
                                <p className="text-xs text-slate-400 uppercase font-semibold mb-2 flex items-center gap-1">
                                    <Sparkles size={12} className="text-yellow-400"/> 首板挖掘
                                </p>
                                <div className="flex flex-wrap gap-2">
                                    {sector.firstBoardList.map((stock, sIdx) => (
                                        <span key={sIdx} className="text-sm px-2 py-1 bg-yellow-900/30 text-yellow-200 border border-yellow-500/20 rounded hover:bg-yellow-900/50 transition-colors">
                                            {stock}
                                        </span>
                                    ))}
                                </div>
                            </div>
                          )}
                      </div>
                  </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default HotSectors;