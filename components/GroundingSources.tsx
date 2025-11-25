import React from 'react';
import { ExternalLink } from 'lucide-react';
import { GroundingChunk } from '../types';

interface Props {
  sources: GroundingChunk[];
}

const GroundingSources: React.FC<Props> = ({ sources }) => {
  if (!sources || sources.length === 0) return null;

  // Filter out duplicates based on URI
  const uniqueSourcesMap = new Map<string, GroundingChunk>();
  sources.forEach((item) => {
    if (item.web?.uri) {
      uniqueSourcesMap.set(item.web.uri, item);
    }
  });

  const uniqueSources = Array.from(uniqueSourcesMap.values());

  return (
    <div className="mt-8 pt-4 border-t border-slate-800">
      <h4 className="text-xs font-semibold text-slate-500 uppercase mb-3 flex items-center gap-2">
        <ExternalLink size={12} /> 数据来源 (Google Search Grounding)
      </h4>
      <div className="flex flex-wrap gap-2">
        {uniqueSources.map((chunk, idx) => {
            if (!chunk.web) return null;
            return (
                <a 
                    key={idx} 
                    href={chunk.web.uri} 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="text-xs bg-slate-800 text-slate-400 hover:text-blue-400 hover:bg-slate-700 px-3 py-1 rounded-full transition-colors flex items-center gap-1 truncate max-w-[200px]"
                >
                    {chunk.web.title || "Source"}
                </a>
            );
        })}
      </div>
    </div>
  );
};

export default GroundingSources;