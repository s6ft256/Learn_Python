
import React from 'react';

interface EditorProps {
  code: string;
  onChange: (value: string) => void;
  readOnly?: boolean;
}

const Editor: React.FC<EditorProps> = ({ code, onChange, readOnly }) => {
  return (
    <div className="relative flex w-full flex-grow bg-[#1a1c1e] border-t border-[#44474e] overflow-hidden font-mono text-base">
      <textarea
        value={code}
        onChange={(e) => onChange(e.target.value)}
        readOnly={readOnly}
        spellCheck={false}
        className="w-full bg-transparent text-[#d0e4ff] p-6 outline-none resize-none overflow-y-auto leading-relaxed selection:bg-[#334155]"
        placeholder="# Start coding..."
      />
      <div className="absolute top-4 right-4 flex flex-col items-end gap-2 opacity-40 pointer-events-none">
        <div className="text-[10px] uppercase font-bold text-[#c4c6cf] tracking-widest">Python 3.12</div>
        <div className="text-[10px] uppercase font-bold text-[#c4c6cf] tracking-widest">UTF-8</div>
      </div>
    </div>
  );
};

export default Editor;
