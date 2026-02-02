
import React, { useState, useEffect, useRef } from 'react';
import { UserStats, Challenge, Feedback } from './types';
import { LEVELS } from './constants';
import { getCodeFeedback, getHint } from './services/geminiService';
import Editor from './components/Editor';
import StatsBar from './components/StatsBar';
import SkillNode from './components/SkillNode';

const ADVANCE_DELAY = 4000; // 4 seconds delay before auto-advancing

const App: React.FC = () => {
  const [stats, setStats] = useState<UserStats>(() => {
    const saved = localStorage.getItem('pyquest_stats');
    if (saved) return JSON.parse(saved);
    return {
      xp: 0,
      level: 1,
      rank: 'Curious Beginner',
      streak: 1,
      completedIds: [],
      chosenPath: 'None',
      skills: { syntax: 1, logic: 1, oop: 0, async: 0, architecture: 0, data: 0 }
    };
  });

  const [activeChallenge, setActiveChallenge] = useState<Challenge | null>(null);
  const [userCode, setUserCode] = useState('');
  const [feedback, setFeedback] = useState<Feedback | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [activeTab, setActiveTab] = useState<'mission' | 'skills' | 'browser'>('mission');
  const [aiHint, setAiHint] = useState<string | null>(null);
  const [showGuide, setShowGuide] = useState(false);
  const [countdown, setCountdown] = useState<number | null>(null);
  const advanceTimerRef = useRef<number | null>(null);

  useEffect(() => {
    localStorage.setItem('pyquest_stats', JSON.stringify(stats));
  }, [stats]);

  useEffect(() => {
    const lastChallenge = LEVELS[stats.completedIds.length] || LEVELS[0];
    setActiveChallenge(lastChallenge);
    setUserCode(lastChallenge.initialCode);
  }, []);

  const handleSelectChallenge = (c: Challenge) => {
    if (advanceTimerRef.current) {
      window.clearTimeout(advanceTimerRef.current);
      advanceTimerRef.current = null;
    }
    setCountdown(null);
    setActiveChallenge(c);
    setUserCode(c.initialCode);
    setFeedback(null);
    setAiHint(null);
    setShowGuide(false);
    setActiveTab('mission');
  };

  const advanceToNextLevel = () => {
    if (!activeChallenge) return;
    const currentIndex = LEVELS.findIndex(l => l.id === activeChallenge.id);
    if (currentIndex < LEVELS.length - 1) {
      handleSelectChallenge(LEVELS[currentIndex + 1]);
    } else {
      setActiveTab('browser');
    }
  };

  const handleSubmit = async () => {
    if (!activeChallenge) return;
    setIsLoading(true);
    setFeedback(null);
    setAiHint(null);

    const result = await getCodeFeedback(
      activeChallenge.title,
      activeChallenge.description,
      userCode,
      activeChallenge.solutionTemplate
    );

    setFeedback(result);
    setIsLoading(false);

    if (result.status === 'correct') {
      const isNewCompletion = !stats.completedIds.includes(activeChallenge.id);
      
      if (isNewCompletion) {
        setStats(prev => {
          const newXp = prev.xp + activeChallenge.points;
          const newLevel = Math.floor(newXp / 500) + 1;
          const newCompleted = [...prev.completedIds, activeChallenge.id];
          const newSkills = { ...prev.skills };
          
          if (activeChallenge.tier === 'Beginner') newSkills.syntax = Math.min(5, newSkills.syntax + 0.3);
          if (activeChallenge.tier === 'Intermediate') newSkills.logic = Math.min(5, newSkills.logic + 0.3);
          if (activeChallenge.tier === 'Advanced') newSkills.oop = Math.min(5, newSkills.oop + 0.5);

          return { ...prev, xp: newXp, level: newLevel, completedIds: newCompleted, skills: newSkills };
        });
      }

      setCountdown(ADVANCE_DELAY / 1000);
      const timer = window.setInterval(() => {
        setCountdown(prev => (prev !== null && prev > 1 ? prev - 1 : null));
      }, 1000);

      advanceTimerRef.current = window.setTimeout(() => {
        clearInterval(timer);
        advanceToNextLevel();
      }, ADVANCE_DELAY);
    }
  };

  const handleGetHint = async () => {
    if (!activeChallenge) return;
    setIsLoading(true);
    const hint = await getHint(activeChallenge.description, userCode);
    setAiHint(hint);
    setIsLoading(false);
  };

  return (
    <div className="h-screen flex flex-col bg-[#0f1113] text-[#e2e2e6] overflow-hidden portrait:max-w-full">
      <StatsBar stats={stats} />

      <main className="flex-grow flex flex-col overflow-hidden relative">
        
        {/* Mission View (Editor) */}
        {activeTab === 'mission' && activeChallenge && (
          <div className="flex-grow flex flex-col overflow-hidden">
            {/* Header: Lesson Context */}
            <div className="px-6 py-4 bg-[#1a1c1e] border-b border-[#333538] shadow-sm">
              <div className="flex justify-between items-center mb-1">
                <span className={`text-[9px] font-black uppercase tracking-[0.2em] px-2 py-0.5 rounded-sm ${activeChallenge.tier === 'Beginner' ? 'bg-emerald-500/10 text-emerald-400' : activeChallenge.tier === 'Intermediate' ? 'bg-amber-500/10 text-amber-400' : 'bg-rose-500/10 text-rose-400'}`}>
                  {activeChallenge.tier} • Lesson {LEVELS.indexOf(activeChallenge) + 1}
                </span>
                <button 
                  onClick={() => setShowGuide(!showGuide)}
                  className="text-[10px] font-bold text-[#d0e4ff] bg-[#333538] px-3 py-1 rounded-full flex items-center gap-2 active:scale-95 transition-all"
                >
                  <i className={`fa-solid ${showGuide ? 'fa-xmark' : 'fa-graduation-cap'}`}></i> {showGuide ? 'CLOSE' : 'LEARN'}
                </button>
              </div>
              <h1 className="text-lg font-bold text-white mb-1">{activeChallenge.title}</h1>
              <p className="text-sm text-[#c4c6cf] leading-tight font-medium">
                {activeChallenge.description}
              </p>
            </div>

            {/* Main Area: Editor + Overlays */}
            <div className="flex-grow relative flex flex-col overflow-hidden bg-[#0f1113]">
              <Editor code={userCode} onChange={setUserCode} />

              {/* Learning Guide Overlay */}
              {showGuide && (
                <div className="absolute inset-0 bg-[#1a1c1e]/98 z-40 p-8 overflow-y-auto animate-in fade-in zoom-in-95 duration-200">
                  <div className="max-w-md mx-auto">
                    <h3 className="text-xl font-bold mb-6 text-[#d0e4ff]">Python Cheat Sheet</h3>
                    <div className="space-y-8">
                      <div className="bg-[#333538] p-4 rounded-2xl border border-white/5">
                        <h4 className="text-xs font-bold text-emerald-400 uppercase tracking-widest mb-2">Displaying Info</h4>
                        <p className="text-sm text-[#e2e2e6] mb-3">The <code className="text-[#d0e4ff]">print()</code> function sends data to the screen.</p>
                        <code className="block bg-black/40 p-3 rounded-xl text-xs text-white">{'print("Hello World")'}</code>
                      </div>
                      <div className="bg-[#333538] p-4 rounded-2xl border border-white/5">
                        <h4 className="text-xs font-bold text-amber-400 uppercase tracking-widest mb-2">Logic Blocks</h4>
                        <p className="text-sm text-[#e2e2e6] mb-3">Python uses colons <code className="text-amber-400">:</code> and 4 spaces (indentation) to show nested code.</p>
                        <code className="block bg-black/40 p-3 rounded-xl text-xs text-white leading-relaxed">{'if level > 10:\n    print("Master")'}</code>
                      </div>
                      <div className="bg-[#333538] p-4 rounded-2xl border border-white/5">
                        <h4 className="text-xs font-bold text-rose-400 uppercase tracking-widest mb-2">Pro Tip</h4>
                        <p className="text-sm text-[#e2e2e6]">Variables are names for data. Keep them lowercase and use underscores like <code className="text-white">user_score</code>.</p>
                      </div>
                    </div>
                    <button 
                      onClick={() => setShowGuide(false)}
                      className="mt-10 w-full py-4 rounded-3xl bg-[#d0e4ff] text-[#00315d] font-black text-sm shadow-xl"
                    >
                      GOT IT, LET'S CODE!
                    </button>
                  </div>
                </div>
              )}

              {/* Enhanced Feedback UI */}
              {(feedback || aiHint) && (
                <div className="absolute bottom-4 left-4 right-4 bg-[#2e3032] border border-white/5 p-6 rounded-[32px] animate-in slide-in-from-bottom-4 duration-500 z-30 shadow-2xl">
                  {feedback && (
                    <div className="flex flex-col gap-3">
                      <div className={`flex items-center gap-3 font-black text-xs uppercase tracking-widest ${feedback.status === 'correct' ? 'text-emerald-400' : 'text-orange-400'}`}>
                        <div className={`w-8 h-8 rounded-full flex items-center justify-center ${feedback.status === 'correct' ? 'bg-emerald-400/20' : 'bg-orange-400/20'}`}>
                           <i className={`fa-solid ${feedback.status === 'correct' ? 'fa-check' : 'fa-lightbulb'}`}></i>
                        </div>
                        {feedback.message}
                      </div>
                      <p className="text-sm text-[#e2e2e6] leading-relaxed font-medium">
                        {feedback.aiExplanation}
                      </p>
                      
                      {feedback.status === 'correct' && (
                        <div className="flex items-center justify-between mt-2 pt-4 border-t border-white/5">
                          <div className="flex items-center gap-2">
                             <div className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></div>
                             <span className="text-[10px] font-bold text-emerald-400 uppercase">Auto-advance in {countdown}s</span>
                          </div>
                          <button 
                            onClick={advanceToNextLevel}
                            className="bg-emerald-400 text-black px-4 py-1.5 rounded-full text-[10px] font-black uppercase active:scale-95 transition-all"
                          >
                            Go Now
                          </button>
                        </div>
                      )}

                      {feedback.status !== 'correct' && (
                        <div className="flex gap-2 mt-2">
                          <button onClick={() => {setFeedback(null); setAiHint(null);}} className="flex-grow py-3 rounded-2xl bg-white/5 text-[#8e9199] text-[10px] font-black uppercase border border-white/5">Try Again</button>
                          <button onClick={handleGetHint} className="flex-grow py-3 rounded-2xl bg-[#d0e4ff]/10 text-[#d0e4ff] text-[10px] font-black uppercase border border-[#d0e4ff]/20">AI Hint</button>
                        </div>
                      )}
                    </div>
                  )}
                  {aiHint && (
                    <div className="flex flex-col gap-4">
                      <div className="flex items-start gap-4">
                        <div className="w-10 h-10 rounded-2xl bg-[#d0e4ff] flex items-center justify-center text-[#00315d] shadow-inner">
                           <i className="fa-solid fa-robot"></i>
                        </div>
                        <p className="text-sm text-[#d0e4ff] italic leading-relaxed pt-1">
                          "{aiHint}"
                        </p>
                      </div>
                      <button onClick={() => setAiHint(null)} className="w-full py-3 rounded-2xl bg-white/5 text-[10px] font-black uppercase text-[#8e9199]">Close Hint</button>
                    </div>
                  )}
                </div>
              )}
            </div>

            {/* Bottom Interaction Bar */}
            <div className="px-6 py-4 bg-[#1a1c1e] flex gap-4 items-center border-t border-[#333538] shadow-lg">
              <button 
                onClick={handleGetHint}
                className="w-14 h-14 rounded-2xl bg-[#333538] flex items-center justify-center text-[#d0e4ff] active:scale-90 transition-transform shadow-inner border border-white/5"
                title="AI Support"
              >
                <i className="fa-solid fa-wand-magic-sparkles text-xl"></i>
              </button>
              
              <button 
                onClick={handleSubmit}
                disabled={isLoading || !!countdown}
                className="flex-grow h-14 rounded-2xl bg-[#d0e4ff] text-[#00315d] font-black flex items-center justify-center gap-3 shadow-[0_8px_20px_rgba(208,228,255,0.2)] active:scale-[0.98] transition-all disabled:opacity-50 disabled:scale-100"
              >
                {isLoading ? (
                  <div className="flex items-center gap-2">
                    <i className="fa-solid fa-circle-notch animate-spin"></i>
                    <span className="text-sm tracking-widest">COMPILING...</span>
                  </div>
                ) : (
                  <div className="flex items-center gap-3">
                    <i className="fa-solid fa-bolt-lightning text-lg"></i>
                    <span className="text-sm tracking-widest uppercase">Check My Logic</span>
                  </div>
                )}
              </button>
            </div>
          </div>
        )}

        {/* Mission Path Browser */}
        {activeTab === 'browser' && (
          <div className="flex-grow flex flex-col p-6 overflow-y-auto bg-[#0f1113]">
            <h1 className="text-3xl font-black text-white mb-2">The Path</h1>
            <p className="text-sm text-[#8e9199] mb-10 font-medium">Progress through the levels to become a Python Master.</p>
            
            <div className="space-y-12 pb-20">
              {['Beginner', 'Intermediate', 'Advanced'].map(tier => (
                <section key={tier}>
                  <div className="flex items-center justify-between mb-5 px-1">
                    <h2 className={`text-[11px] font-black uppercase tracking-[0.25em] ${tier === 'Beginner' ? 'text-emerald-400' : tier === 'Intermediate' ? 'text-amber-400' : 'text-rose-400'}`}>
                      {tier} {tier === 'Beginner' ? 'Foundation' : tier === 'Intermediate' ? 'Logic' : 'Architecture'}
                    </h2>
                    <span className="text-[10px] text-[#44474e] font-bold">
                      {LEVELS.filter(l => l.tier === tier && stats.completedIds.includes(l.id)).length} / {LEVELS.filter(l => l.tier === tier).length}
                    </span>
                  </div>
                  <div className="grid gap-3">
                    {LEVELS.filter(l => l.tier === tier).map((l, index) => {
                      const isCompleted = stats.completedIds.includes(l.id);
                      const isActive = activeChallenge?.id === l.id;
                      return (
                        <button 
                          key={l.id} 
                          onClick={() => handleSelectChallenge(l)}
                          className={`group p-5 rounded-[28px] border transition-all active:scale-[0.97] flex items-center gap-5 text-left ${isActive ? 'bg-[#d0e4ff] border-[#d0e4ff] text-[#00315d] shadow-xl shadow-blue-500/10' : 'bg-[#1a1c1e] border-white/5 text-[#e2e2e6] hover:bg-[#333538]'}`}
                        >
                          <div className={`w-10 h-10 rounded-2xl flex items-center justify-center text-xs font-black shadow-inner ${isActive ? 'bg-[#00315d] text-white' : isCompleted ? 'bg-emerald-500/10 text-emerald-400' : 'bg-[#0f1113] text-[#44474e]'}`}>
                            {isCompleted ? <i className="fa-solid fa-check"></i> : index + 1}
                          </div>
                          <div className="flex-grow">
                             <h3 className="font-black text-sm mb-0.5">{l.title}</h3>
                             <p className={`text-[10px] font-bold ${isActive ? 'text-[#00315d]/60' : 'text-[#8e9199]'}`}>
                               {l.concepts.slice(0, 2).join(' • ')}
                             </p>
                          </div>
                          <i className={`fa-solid fa-chevron-right text-[10px] opacity-20 ${isActive ? 'text-[#00315d]' : ''}`}></i>
                        </button>
                      );
                    })}
                  </div>
                </section>
              ))}
            </div>
          </div>
        )}

        {/* Stats & Mastery Tab */}
        {activeTab === 'skills' && (
          <div className="flex-grow flex flex-col p-8 overflow-y-auto bg-[#0f1113]">
            <h1 className="text-3xl font-black text-white mb-2">Mastery</h1>
            <p className="text-sm text-[#8e9199] mb-12 font-medium">Your evolutionary coding metrics.</p>
            
            <div className="grid grid-cols-2 gap-x-8 gap-y-12">
              <SkillNode name="Syntax" level={stats.skills.syntax} icon="fa-terminal" color="text-[#d0e4ff]" />
              <SkillNode name="Logic" level={stats.skills.logic} icon="fa-brain" color="text-[#d0e4ff]" />
              <SkillNode name="OOP" level={stats.skills.oop} icon="fa-cube" color="text-[#d0e4ff]" />
              <SkillNode name="Advanced" level={stats.skills.async + stats.skills.data} icon="fa-meteor" color="text-[#d0e4ff]" />
            </div>
            
            <div className="mt-16 bg-[#1a1c1e] p-8 rounded-[40px] border border-white/5 shadow-2xl">
              <div className="flex items-center gap-4 mb-8">
                 <div className="w-14 h-14 rounded-full bg-emerald-500/10 flex items-center justify-center text-emerald-400 text-xl shadow-inner">
                    <i className="fa-solid fa-award"></i>
                 </div>
                 <div>
                    <h3 className="font-black text-white tracking-wide">Career Stats</h3>
                    <p className="text-xs text-[#8e9199] font-bold uppercase tracking-widest">Level {stats.level} Pythonista</p>
                 </div>
              </div>

              <div className="space-y-6">
                {[
                  { label: 'Completed Missions', value: stats.completedIds.length, icon: 'fa-check-double' },
                  { label: 'Coding Streak', value: `${stats.streak} Days`, icon: 'fa-fire', color: 'text-orange-400' },
                  { label: 'Current Rank', value: stats.rank, icon: 'fa-trophy', color: 'text-amber-400' }
                ].map((item, i) => (
                  <div key={i} className="flex items-center justify-between p-1">
                     <div className="flex items-center gap-3">
                        <i className={`fa-solid ${item.icon} text-xs ${item.color || 'text-[#d0e4ff]'}`}></i>
                        <span className="text-xs font-bold text-[#8e9199]">{item.label}</span>
                     </div>
                     <span className="text-sm font-black text-white">{item.value}</span>
                  </div>
                ))}
              </div>
            </div>

            <div className="mt-auto pt-16 pb-8 text-center">
              <div className="text-[10px] font-black text-[#333538] uppercase tracking-[0.3em] mb-3">PyQuest: Learn Python RPG</div>
              <div className="flex justify-center gap-6 text-[10px] font-bold text-[#44474e]">
                <button className="hover:text-[#d0e4ff]">Reset Progress</button>
                <a href="https://pyquest.app/privacy" target="_blank" rel="noopener" className="hover:text-[#d0e4ff]">Legal</a>
              </div>
            </div>
          </div>
        )}

      </main>

      {/* Android/iOS Tab Navigation */}
      <nav className="h-24 bg-[#1a1c1e] border-t border-[#333538] flex items-center justify-around px-8 pb-4 shadow-[0_-10px_30px_rgba(0,0,0,0.3)]">
        {[
          { id: 'mission', icon: 'fa-code', label: 'Play' },
          { id: 'browser', icon: 'fa-compass', label: 'Path' },
          { id: 'skills', icon: 'fa-chart-pie', label: 'Stats' }
        ].map(tab => (
          <button 
            key={tab.id}
            onClick={() => setActiveTab(tab.id as any)}
            className={`flex flex-col items-center gap-2 transition-all duration-300 ${activeTab === tab.id ? 'text-[#d0e4ff] -translate-y-1' : 'text-[#44474e]'}`}
          >
            <div className={`w-12 h-12 rounded-2xl flex items-center justify-center transition-all ${activeTab === tab.id ? 'bg-[#d0e4ff]/10' : ''}`}>
              <i className={`fa-solid ${tab.icon} text-xl`}></i>
            </div>
            <span className="text-[9px] font-black uppercase tracking-[0.15em]">{tab.label}</span>
          </button>
        ))}
      </nav>

      {/* Global Processing State */}
      {isLoading && (
        <div className="fixed inset-0 bg-black/70 backdrop-blur-md z-[200] flex items-center justify-center p-12 text-center animate-in fade-in duration-300">
           <div className="bg-[#1a1c1e] p-10 rounded-[48px] shadow-2xl flex flex-col items-center border border-white/5">
              <div className="relative w-16 h-16 mb-6">
                <div className="absolute inset-0 border-4 border-[#d0e4ff]/10 rounded-full"></div>
                <div className="absolute inset-0 border-4 border-[#d0e4ff] border-t-transparent rounded-full animate-spin"></div>
                <div className="absolute inset-0 flex items-center justify-center">
                   <i className="fa-brands fa-python text-2xl text-[#d0e4ff]"></i>
                </div>
              </div>
              <p className="text-[#d0e4ff] text-[10px] font-black tracking-[0.2em] uppercase">Consulting AI Mentor...</p>
           </div>
        </div>
      )}
    </div>
  );
};

export default App;
