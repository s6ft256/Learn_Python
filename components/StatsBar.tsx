
import React from 'react';
import { UserStats } from '../types';
import { RANK_THRESHOLDS } from '../constants';

const StatsBar: React.FC<{ stats: UserStats }> = ({ stats }) => {
  const currentRank = RANK_THRESHOLDS.reduce((prev, curr) => {
    return stats.xp >= curr.minXp ? curr : prev;
  }).rank;

  const nextRank = RANK_THRESHOLDS.find(r => r.minXp > stats.xp) || { rank: 'Python Legend', minXp: stats.xp + 500 };
  const prevRankMin = RANK_THRESHOLDS.slice().reverse().find(r => r.minXp <= stats.xp)?.minXp || 0;
  
  const range = nextRank.minXp - prevRankMin;
  const currentInRange = stats.xp - prevRankMin;
  const progressPercent = Math.min(100, (currentInRange / range) * 100);

  return (
    <div className="bg-[#1a1c1e] px-6 pt-10 pb-4 z-50 flex flex-col gap-4 shadow-xl">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <div className="relative">
            <div className="w-14 h-14 rounded-[22px] bg-[#d0e4ff] flex items-center justify-center text-[#00315d] font-black text-2xl shadow-lg transform -rotate-3">
              {stats.level}
            </div>
            <div className="absolute -top-1 -right-1 w-5 h-5 bg-orange-500 rounded-full border-2 border-[#1a1c1e] flex items-center justify-center">
               <i className="fa-solid fa-bolt text-[8px] text-white"></i>
            </div>
          </div>
          <div>
            <h2 className="text-sm font-black text-white uppercase tracking-widest leading-none mb-1.5">{currentRank}</h2>
            <div className="flex items-center gap-2 text-[10px] font-bold text-[#8e9199] uppercase tracking-wider">
               <span className="flex items-center gap-1"><i className="fa-solid fa-fire text-orange-400"></i> {stats.streak} DAYS</span>
               <span className="opacity-20">•</span>
               <span>{stats.xp} XP</span>
            </div>
          </div>
        </div>
      </div>

      <div className="w-full">
        <div className="w-full bg-[#333538] h-2 rounded-full overflow-hidden shadow-inner p-0.5 border border-white/5">
          <div 
            className="h-full bg-gradient-to-r from-[#d0e4ff] to-white transition-all duration-1000 ease-out rounded-full shadow-[0_0_10px_rgba(208,228,255,0.5)]" 
            style={{ width: `${progressPercent}%` }}
          />
        </div>
      </div>
    </div>
  );
};

export default StatsBar;
