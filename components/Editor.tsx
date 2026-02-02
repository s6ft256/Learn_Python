
import React from 'react';

interface EditorProps {
  code: string;
  onChange: (value: string) => void;
  readOnly?: boolean;
}

const Editor: React.FC<EditorProps> = ({ code, onChange, readOnly }) => {
  return (
    <div className="relative flex w-full flex-grow bg-[#0f1113] overflow-hidden font-mono text-base">
      <div className="w-12 bg-[#1a1c1e] flex flex-col items-center pt-6 text-[10px] font-bold text-[#44474e] select-none border-r border-white/5">
        {[...Array(15)].map((_, i) => (
          <div key={i} className="h-7">{i + 1}</div>
        ))}
      </div>
      <textarea
        value={code}
        onChange={(e) => onChange(e.target.value)}
        readOnly={readOnly}
        spellCheck={false}
        className="flex-grow bg-transparent text-[#d0e4ff] p-6 pt-6 outline-none resize-none overflow-y-auto leading-7 selection:bg-[#d0e4ff]/20 placeholder:text-[#333538]"
        placeholder="# Write your Python logic here..."
      />
      <div className="absolute top-4 right-4 flex flex-col items-end gap-1 opacity-20 pointer-events-none">
        <div className="text-[8px] uppercase font-black text-[#c4c6cf] tracking-[0.2em]">PY3.12-INSTANT</div>
        <div className="w-12 h-0.5 bg-emerald-500 rounded-full animate-pulse"></div>
      </div>
    </div>
  );
};

export default Editor;
