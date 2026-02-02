
import React, { useState, useEffect, useRef } from 'react';
import { UserStats, Challenge, Feedback, Pitfall } from './types';
import { LEVELS } from './constants';
import Editor from './components/Editor';
import StatsBar from './components/StatsBar';
import SkillNode from './components/SkillNode';
import { getCodeFeedback } from './services/geminiService';

const ADVANCE_DELAY = 3000; 

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
    const firstIncomplete = LEVELS.find(l => !stats.completedIds.includes(l.id)) || LEVELS[0];
    setActiveChallenge(firstIncomplete);
    setUserCode(firstIncomplete.initialCode);
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

  const handleDeepScan = async () => {
    if (!activeChallenge) return;
    setIsLoading(true);
    const aiFeedback = await getCodeFeedback(
      activeChallenge.title,
      activeChallenge.description,
      userCode,
      activeChallenge.solutionTemplate
    );
    setFeedback(aiFeedback);
    setIsLoading(false);
  };

  // Local validation system with pitfall detection
  const handleSubmit = () => {
    if (!activeChallenge) return;
    
    const normalize = (s: string) => s.replace(/\s+/g, ' ').trim();
    const userNorm = normalize(userCode);
    const solNorm = normalize(activeChallenge.solutionTemplate);

    let result: Feedback;

    // 1. Check for perfect match
    if (userNorm === solNorm) {
      result = {
        status: 'correct',
        message: activeChallenge.localFeedback.success.msg,
        aiExplanation: activeChallenge.localFeedback.success.explanation
      };
    } 
    // 2. Check for specific pitfalls
    else {
      let foundPitfall: Pitfall | undefined;
      if (activeChallenge.localFeedback.pitfalls) {
        foundPitfall = activeChallenge.localFeedback.pitfalls.find(p => {
          if (p.pattern instanceof RegExp) {
            return p.pattern.test(userCode);
          }
          return userCode.includes(p.pattern as string);
        });
      }

      if (foundPitfall) {
        result = {
          status: 'incorrect',
          message: foundPitfall.guidance,
          aiExplanation: "Logic Alert!",
          actionableStep: foundPitfall.action
        };
      } else {
        result = {
          status: 'incorrect',
          message: "Wait, that's not quite right...",
          aiExplanation: "Python is very picky about spelling and spaces. Your code doesn't match the mission goal yet.",
          suggestion: "Common fix: Check your colons (:) or quotes (\")."
        };
      }
    }

    setFeedback(result);

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
          if (activeChallenge.tier === 'Advanced') newSkills.architecture = Math.min(5, newSkills.architecture + 0.5);

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

  const handleGetHint = () => {
    if (!activeChallenge) return;
    setAiHint(activeChallenge.localFeedback.hint);
  };

  return (
    <div className="h-screen flex flex-col bg-[#0f1113] text-[#e2e2e6] overflow-hidden portrait:max-w-full">
      <StatsBar stats={stats} />

      <main className="flex-grow flex flex-col overflow-hidden relative">
        
        {/* Play Tab */}
        {activeTab === 'mission' && activeChallenge && (
          <div className="flex-grow flex flex-col overflow-hidden">
            {/* Mission Header */}
            <div className="px-6 py-4 bg-[#1a1c1e] border-b border-[#333538] shadow-lg relative z-10">
              <div className="flex justify-between items-center mb-1">
                <span className={`text-[10px] font-black uppercase tracking-widest px-2 py-0.5 rounded ${activeChallenge.tier === 'Beginner' ? 'bg-emerald-500/10 text-emerald-400' : activeChallenge.tier === 'Intermediate' ? 'bg-amber-500/10 text-amber-400' : 'bg-rose-500/10 text-rose-400'}`}>
                   {activeChallenge.tier} • Mission {LEVELS.indexOf(activeChallenge) + 1}
                </span>
                <button onClick={() => setShowGuide(!showGuide)} className="text-[10px] font-black text-[#d0e4ff] bg-[#333538] px-3 py-1 rounded-full flex items-center gap-2">
                   <i className="fa-solid fa-graduation-cap"></i> {showGuide ? 'HIDE' : 'GUIDE'}
                </button>
              </div>
              <h1 className="text-xl font-black text-white">{activeChallenge.title}</h1>
              <p className="text-sm text-[#c4c6cf] mt-1 font-medium">{activeChallenge.description}</p>
            </div>

            {/* Editor Area */}
            <div className="flex-grow relative flex flex-col overflow-hidden">
              <Editor code={userCode} onChange={setUserCode} />

              {/* Guide Overlay */}
              {showGuide && (
                <div className="absolute inset-0 bg-[#1a1c1e]/98 z-40 p-8 overflow-y-auto animate-in fade-in duration-200">
                  <h3 className="text-xl font-black mb-6 text-[#d0e4ff]">Python Mini-Manual</h3>
                  <div className="space-y-6">
                    <div className="bg-[#333538] p-4 rounded-2xl">
                      <h4 className="text-xs font-black text-emerald-400 uppercase mb-2">Printing</h4>
                      <code className="text-xs">print("Text Here")</code>
                    </div>
                    <div className="bg-[#333538] p-4 rounded-2xl">
                      <h4 className="text-xs font-black text-amber-400 uppercase mb-2">Variables</h4>
                      <code className="text-xs">box_name = 100</code>
                    </div>
                    <div className="bg-[#333538] p-4 rounded-2xl">
                      <h4 className="text-xs font-black text-rose-400 uppercase mb-2">Lists</h4>
                      <code className="text-xs">items = ["A", "B"]</code>
                    </div>
                  </div>
                  <button onClick={() => setShowGuide(false)} className="mt-8 w-full py-4 rounded-3xl bg-[#d0e4ff] text-[#00315d] font-black text-sm">BACK TO CODE</button>
                </div>
              )}

              {/* Feedback UI */}
              {(feedback || aiHint) && (
                <div className="absolute bottom-4 left-4 right-4 bg-[#2e3032] p-6 rounded-[32px] animate-in slide-in-from-bottom duration-300 z-30 shadow-2xl border border-white/5">
                  {feedback && (
                    <div className="flex flex-col gap-2">
                      <div className={`flex items-center gap-3 font-black text-xs uppercase ${feedback.status === 'correct' ? 'text-emerald-400' : 'text-orange-400'}`}>
                        <div className={`w-8 h-8 rounded-full flex items-center justify-center ${feedback.status === 'correct' ? 'bg-emerald-400/20' : 'bg-orange-400/20'}`}>
                          <i className={`fa-solid ${feedback.status === 'correct' ? 'fa-check' : 'fa-lightbulb'}`}></i>
                        </div>
                        {feedback.message}
                      </div>
                      
                      <div className="flex flex-col gap-3 mt-1">
                        <p className="text-sm text-[#e2e2e6] font-medium leading-relaxed">
                          {feedback.aiExplanation}
                        </p>
                        
                        {feedback.actionableStep && (
                          <div className="p-3 bg-orange-400/10 rounded-2xl border border-orange-400/20 animate-pulse-subtle">
                            <span className="text-[9px] font-black text-orange-400 uppercase block mb-1">Actionable Step:</span>
                            <p className="text-xs text-[#d0e4ff] font-bold">{feedback.actionableStep}</p>
                          </div>
                        )}

                        {feedback.status === 'correct' && (
                          <div className="p-3 bg-emerald-400/10 rounded-2xl border border-emerald-400/20">
                            <span className="text-[9px] font-black text-emerald-400 uppercase block mb-1">The Core Concept:</span>
                            <p className="text-xs text-[#c4c6cf] font-medium italic">
                              "{activeChallenge.concepts.join(' & ')}: You just mastered a key building block of modern Python."
                            </p>
                          </div>
                        )}
                      </div>

                      {feedback.status === 'correct' && (
                        <div className="mt-3 pt-3 border-t border-white/5 flex justify-between items-center">
                          <span className="text-[10px] font-black text-emerald-400">NEXT MISSION IN {countdown}S</span>
                          <button onClick={advanceToNextLevel} className="text-[10px] font-black bg-emerald-400 text-black px-4 py-1.5 rounded-full uppercase active:scale-95">Skip Wait</button>
                        </div>
                      )}
                      
                      {feedback.status !== 'correct' && (
                        <div className="flex gap-2 mt-4">
                          <button onClick={() => setFeedback(null)} className="flex-1 py-3 rounded-2xl bg-white/5 text-[10px] font-black text-[#8e9199] uppercase">Edit Code</button>
                          <button onClick={handleDeepScan} className="flex-1 py-3 rounded-2xl bg-[#d0e4ff]/10 text-[10px] font-black text-[#d0e4ff] uppercase border border-[#d0e4ff]/20">AI Deep Scan</button>
                        </div>
                      )}
                    </div>
                  )}
                  {aiHint && !feedback && (
                    <div className="flex flex-col gap-3">
                      <div className="flex items-center gap-2 text-[#d0e4ff] font-black text-[10px] uppercase">
                        <i className="fa-solid fa-wand-magic-sparkles"></i> Guided Hint
                      </div>
                      <p className="text-sm text-[#d0e4ff] italic font-medium leading-relaxed">"{aiHint}"</p>
                      <button onClick={() => setAiHint(null)} className="text-[10px] font-black text-[#8e9199] uppercase w-full text-center py-2 border-t border-white/5 mt-2">Close</button>
                    </div>
                  )}
                </div>
              )}
            </div>

            {/* Actions */}
            <div className="px-6 py-4 bg-[#1a1c1e] flex gap-4 items-center border-t border-[#333538] shadow-2xl">
              <button onClick={handleGetHint} className="w-14 h-14 rounded-2xl bg-[#333538] flex items-center justify-center text-[#d0e4ff] active:scale-90 transition-transform shadow-inner border border-white/5">
                <i className="fa-solid fa-lightbulb text-xl"></i>
              </button>
              <button onClick={handleSubmit} disabled={!!countdown} className="flex-grow h-14 rounded-2xl bg-[#d0e4ff] text-[#00315d] font-black flex items-center justify-center gap-3 shadow-lg active:scale-95 transition-all disabled:opacity-50">
                <i className="fa-solid fa-play"></i>
                <span className="tracking-widest text-sm uppercase">Verify Logic</span>
              </button>
            </div>
          </div>
        )}

        {/* Browser Tab */}
        {activeTab === 'browser' && (
          <div className="flex-grow flex flex-col p-6 overflow-y-auto bg-[#0f1113]">
            <h1 className="text-3xl font-black mb-1">The Path</h1>
            <p className="text-sm text-[#8e9199] mb-8 font-medium">Progress through the levels to unlock new ranks.</p>
            <div className="space-y-4 pb-20">
              {LEVELS.map((l, i) => {
                const isCompleted = stats.completedIds.includes(l.id);
                const isActive = activeChallenge?.id === l.id;
                return (
                  <button 
                    key={l.id} 
                    onClick={() => handleSelectChallenge(l)}
                    className={`w-full p-5 rounded-[28px] border flex items-center gap-4 text-left transition-all active:scale-[0.98] ${isActive ? 'bg-[#d0e4ff] border-[#d0e4ff] text-[#00315d]' : 'bg-[#1a1c1e] border-white/5 text-white'}`}
                  >
                    <div className={`w-10 h-10 rounded-2xl flex items-center justify-center font-black text-xs ${isActive ? 'bg-[#00315d] text-white' : isCompleted ? 'bg-emerald-500/10 text-emerald-400' : 'bg-[#333538] text-[#44474e]'}`}>
                      {isCompleted ? <i className="fa-solid fa-check"></i> : i + 1}
                    </div>
                    <div className="flex-grow">
                      <div className="font-black text-sm">{l.title}</div>
                      <div className={`text-[9px] font-black uppercase tracking-widest ${isActive ? 'text-[#00315d]/60' : l.tier === 'Beginner' ? 'text-emerald-400' : l.tier === 'Intermediate' ? 'text-amber-400' : 'text-rose-400'}`}>
                        {l.tier} • {l.concepts[0]}
                      </div>
                    </div>
                    <i className="fa-solid fa-chevron-right text-[10px] opacity-20"></i>
                  </button>
                );
              })}
            </div>
          </div>
        )}

        {/* Stats Tab */}
        {activeTab === 'skills' && (
          <div className="flex-grow flex flex-col p-8 overflow-y-auto bg-[#0f1113]">
            <h1 className="text-3xl font-black mb-8">Evolution</h1>
            <div className="grid grid-cols-2 gap-y-12 gap-x-8 mb-16">
              <SkillNode name="Syntax" level={stats.skills.syntax} icon="fa-terminal" color="text-emerald-400" />
              <SkillNode name="Logic" level={stats.skills.logic} icon="fa-brain" color="text-amber-400" />
              <SkillNode name="Architecture" level={stats.skills.architecture} icon="fa-layer-group" color="text-rose-400" />
              <SkillNode name="Specialty" level={0} icon="fa-flask" color="text-blue-400" />
            </div>

            <div className="bg-[#1a1c1e] p-8 rounded-[40px] border border-white/5 shadow-2xl relative overflow-hidden">
              <div className="absolute top-0 right-0 p-4 opacity-5">
                 <i className="fa-brands fa-python text-6xl"></i>
              </div>
              <div className="flex items-center gap-4 mb-6 relative z-10">
                <div className="w-14 h-14 rounded-full bg-emerald-500/10 flex items-center justify-center text-emerald-400 text-xl shadow-inner border border-emerald-500/20">
                   <i className="fa-solid fa-medal"></i>
                </div>
                <div>
                   <h3 className="font-black tracking-wide text-white">Current Rank</h3>
                   <p className="text-xs text-[#d0e4ff] font-black uppercase tracking-widest">{stats.rank}</p>
                </div>
              </div>
              <div className="space-y-4 relative z-10">
                <div className="flex justify-between text-[10px] font-black uppercase tracking-widest text-[#8e9199]">
                  <span>XP Gained</span>
                  <span className="text-white">{stats.xp} pts</span>
                </div>
                <div className="flex justify-between text-[10px] font-black uppercase tracking-widest text-[#8e9199]">
                  <span>Missions Cleared</span>
                  <span className="text-white">{stats.completedIds.length}</span>
                </div>
              </div>
            </div>
          </div>
        )}

      </main>

      {/* Nav */}
      <nav className="h-24 bg-[#1a1c1e] border-t border-[#333538] flex items-center justify-around px-8 pb-4 shadow-2xl relative z-50">
        {[
          { id: 'mission', icon: 'fa-code', label: 'Play' },
          { id: 'browser', icon: 'fa-map-signs', label: 'Levels' },
          { id: 'skills', icon: 'fa-chart-line', label: 'Stats' }
        ].map(tab => (
          <button 
            key={tab.id}
            onClick={() => setActiveTab(tab.id as any)}
            className={`flex flex-col items-center gap-2 transition-all duration-200 ${activeTab === tab.id ? 'text-[#d0e4ff] -translate-y-1 scale-110' : 'text-[#44474e]'}`}
          >
            <div className={`w-12 h-12 rounded-2xl flex items-center justify-center transition-all ${activeTab === tab.id ? 'bg-[#d0e4ff]/10 shadow-lg' : ''}`}>
              <i className={`fa-solid ${tab.icon} text-xl`}></i>
            </div>
            <span className="text-[9px] font-black uppercase tracking-widest">{tab.label}</span>
          </button>
        ))}
      </nav>

      {/* Deep Scan Loader */}
      {isLoading && (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-md z-[200] flex items-center justify-center animate-in fade-in duration-300">
          <div className="bg-[#1a1c1e] p-10 rounded-[48px] flex flex-col items-center gap-6 border border-[#d0e4ff]/20 shadow-[0_0_50px_rgba(208,228,255,0.1)]">
            <div className="relative">
              <div className="w-12 h-12 border-4 border-[#d0e4ff]/10 rounded-full"></div>
              <div className="w-12 h-12 border-4 border-[#d0e4ff] border-t-transparent rounded-full animate-spin absolute top-0 left-0"></div>
            </div>
            <div className="text-center">
              <p className="text-[#d0e4ff] text-[10px] font-black uppercase tracking-[0.3em] mb-1">AI Deep Scan</p>
              <p className="text-[#44474e] text-[9px] font-bold uppercase">Parsing Syntax Tree...</p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default App;
