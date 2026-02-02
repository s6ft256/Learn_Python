
import React from 'react';
import { UserStats } from '../types';
import { RANK_THRESHOLDS } from '../constants';

const StatsBar: React.FC<{ stats: UserStats }> = ({ stats }) => {
  const currentRank = RANK_THRESHOLDS.reduce((prev, curr) => {
    return stats.xp >= curr.minXp ? curr : prev;
  }).rank;

  const nextRank = RANK_THRESHOLDS.find(r => r.minXp > stats.xp) || { rank: 'Python Master', minXp: stats.xp };
  const progressPercent = Math.min(100, (stats.xp / nextRank.minXp) * 100);

  return (
    <div className="bg-[#1a1c1e] px-4 pt-8 pb-4 z-50 flex flex-col gap-3">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 rounded-2xl bg-[#d0e4ff] flex items-center justify-center text-[#00315d] font-bold text-xl shadow-md">
            {stats.level}
          </div>
          <div>
            <h2 className="text-lg font-bold text-[#e2e2e6] leading-tight">{currentRank}</h2>
            <div className="flex items-center gap-1.5 text-xs text-[#c4c6cf]">
               <i className="fa-solid fa-fire text-orange-400"></i>
               <span>{stats.streak} Day Streak</span>
            </div>
          </div>
        </div>
        <div className="flex items-center gap-2">
            <button className="w-10 h-10 rounded-full bg-[#333538] flex items-center justify-center text-[#e2e2e6]">
                <i className="fa-solid fa-bell"></i>
            </button>
        </div>
      </div>

      <div className="w-full">
        <div className="flex justify-between text-[10px] text-[#8e9199] uppercase font-bold tracking-widest mb-1.5 px-1">
          <span>XP: {stats.xp}</span>
          <span>Target: {nextRank.minXp}</span>
        </div>
        <div className="w-full bg-[#44474e] h-1.5 rounded-full overflow-hidden">
          <div 
            className="h-full bg-[#d0e4ff] transition-all duration-500 ease-out rounded-full" 
            style={{ width: `${progressPercent}%` }}
          />
        </div>
      </div>
    </div>
  );
};

export default StatsBar;
