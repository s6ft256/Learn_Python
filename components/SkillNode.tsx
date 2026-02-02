
import React from 'react';

interface SkillNodeProps {
  name: string;
  level: number;
  icon: string;
  color: string;
}

const SkillNode: React.FC<SkillNodeProps> = ({ name, level, icon, color }) => {
  return (
    <div className="flex flex-col items-center gap-3">
      <div className={`w-20 h-20 rounded-[32px] bg-[#333538] border-2 border-[#44474e] flex items-center justify-center text-2xl ${color} shadow-sm active:scale-95 transition-transform`}>
        <i className={`fa-solid ${icon}`}></i>
      </div>
      <div className="text-center">
        <div className="text-[10px] font-bold uppercase tracking-widest text-[#8e9199] mb-1">{name}</div>
        <div className="flex gap-1 justify-center">
          {[...Array(5)].map((_, i) => (
            <div key={i} className={`w-3 h-1 rounded-full ${i < Math.floor(level) ? 'bg-[#d0e4ff]' : 'bg-[#44474e]'}`}></div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default SkillNode;
