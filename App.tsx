
import React, { useState, useEffect } from 'react';
import { UserStats, Challenge, Feedback } from './types';
import { LEVELS } from './constants';
import { getCodeFeedback, getHint } from './services/geminiService';
import Editor from './components/Editor';
import StatsBar from './components/StatsBar';
import SkillNode from './components/SkillNode';

const App: React.FC = () => {
  const [stats, setStats] = useState<UserStats>({
    xp: 0,
    level: 1,
    rank: 'Curious Beginner',
    streak: 1,
    completedIds: [],
    chosenPath: 'None',
    skills: { syntax: 1, logic: 1, oop: 0, async: 0, architecture: 0, data: 0 }
  });

  const [activeChallenge, setActiveChallenge] = useState<Challenge | null>(null);
  const [userCode, setUserCode] = useState('');
  const [feedback, setFeedback] = useState<Feedback | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [activeTab, setActiveTab] = useState<'mission' | 'skills' | 'browser'>('mission');
  const [aiHint, setAiHint] = useState<string | null>(null);
  const [showGuide, setShowGuide] = useState(false);

  useEffect(() => {
    // Start with the first level by default
    setActiveChallenge(LEVELS[0]);
    setUserCode(LEVELS[0].initialCode);
  }, []);

  const handleSelectChallenge = (c: Challenge) => {
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
      setActiveTab('browser'); // Show browser if all finished
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
          
          if (activeChallenge.tier === 'Beginner') newSkills.syntax = Math.min(5, newSkills.syntax + 0.5);
          if (activeChallenge.tier === 'Intermediate') newSkills.logic = Math.min(5, newSkills.logic + 0.5);

          return { ...prev, xp: newXp, level: newLevel, completedIds: newCompleted, skills: newSkills };
        });
      }

      // Automatically move on to next level after a short delay so they can see success
      setTimeout(() => {
        advanceToNextLevel();
      }, 3000);
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
    <div className="h-screen flex flex-col bg-[#1a1c1e] text-[#e2e2e6] overflow-hidden portrait:max-w-full">
      <StatsBar stats={stats} />

      <main className="flex-grow flex flex-col overflow-hidden relative">
        
        {/* Mission View (Editor) */}
        {activeTab === 'mission' && activeChallenge && (
          <div className="flex-grow flex flex-col overflow-hidden">
            {/* Header: Mission Instructions */}
            <div className="px-6 py-4 bg-[#1a1c1e] border-b border-[#44474e]">
              <div className="flex justify-between items-center mb-2">
                <span className="text-[10px] font-bold text-[#d0e4ff] uppercase tracking-widest">
                  {activeChallenge.tier} • Lesson {LEVELS.indexOf(activeChallenge) + 1} of {LEVELS.length}
                </span>
                <button 
                  onClick={() => setShowGuide(!showGuide)}
                  className="text-[10px] font-bold text-amber-400 border border-amber-400/30 px-2 py-1 rounded-full flex items-center gap-1 active:bg-amber-400/10"
                >
                  <i className="fa-solid fa-book-open"></i> {showGuide ? 'CLOSE GUIDE' : 'HELP GUIDE'}
                </button>
              </div>
              <h1 className="text-xl font-bold mb-1 text-white">{activeChallenge.title}</h1>
              <p className="text-sm text-[#c4c6cf] leading-snug">
                {activeChallenge.description}
              </p>
            </div>

            {/* Main Area: Editor + Overlays */}
            <div className="flex-grow relative flex flex-col overflow-hidden">
              <Editor code={userCode} onChange={setUserCode} />

              {/* Educational Helper Guide Overlay */}
              {showGuide && (
                <div className="absolute inset-0 bg-[#1a1c1e]/95 z-40 p-6 overflow-y-auto animate-in fade-in slide-in-from-top-2 duration-200">
                  <h3 className="text-lg font-bold mb-4 text-amber-400">Quick Python Help</h3>
                  <div className="space-y-6">
                    <div>
                      <h4 className="text-sm font-bold text-white mb-2">Printing Text</h4>
                      <p className="text-xs text-[#c4c6cf]">Use the print command: <code className="bg-slate-800 px-1 rounded text-emerald-400">{'print("Hello")'}</code></p>
                    </div>
                    <div>
                      <h4 className="text-sm font-bold text-white mb-2">F-Strings (Variables in Text)</h4>
                      <p className="text-xs text-[#c4c6cf]">Combine text and variables: <code className="bg-slate-800 px-1 rounded text-emerald-400">{'print(f"Level: {battery}")'}</code></p>
                    </div>
                    <div>
                      <h4 className="text-sm font-bold text-white mb-2">Indentation</h4>
                      <p className="text-xs text-[#c4c6cf]">Python uses spaces to show what code belongs to an "if" or "else" statement. Always use 4 spaces!</p>
                    </div>
                  </div>
                  <button 
                    onClick={() => setShowGuide(false)}
                    className="mt-8 w-full py-3 rounded-2xl bg-[#333538] font-bold text-sm"
                  >
                    I Got This!
                  </button>
                </div>
              )}

              {/* Feedback Drawer */}
              {(feedback || aiHint) && (
                <div className="absolute bottom-0 left-0 right-0 bg-[#2e3032] border-t border-[#44474e] p-6 animate-in slide-in-from-bottom duration-300 z-30 shadow-[0_-10px_30px_rgba(0,0,0,0.5)]">
                  {feedback && (
                    <div className="mb-2">
                      <div className={`flex items-center gap-2 font-bold text-xs uppercase mb-2 ${feedback.status === 'correct' ? 'text-emerald-400' : 'text-orange-400'}`}>
                        <i className={`fa-solid ${feedback.status === 'correct' ? 'fa-face-smile-wink' : 'fa-lightbulb'}`}></i>
                        {feedback.message}
                      </div>
                      <p className="text-sm text-[#e2e2e6] leading-relaxed">{feedback.aiExplanation}</p>
                      {feedback.status === 'correct' && (
                        <div className="mt-4 text-[10px] text-emerald-400/80 font-bold animate-pulse">
                          UPDATING SYSTEM... NEXT LESSON IN 3 SECONDS
                        </div>
                      )}
                      {feedback.suggestion && <div className="mt-2 text-[11px] text-amber-200/80 italic">💡 {feedback.suggestion}</div>}
                    </div>
                  )}
                  {aiHint && (
                    <div className="text-sm text-[#d0e4ff] italic flex items-start gap-3">
                      <i className="fa-solid fa-robot mt-1"></i>
                      <span>{aiHint}</span>
                    </div>
                  )}
                  {feedback?.status !== 'correct' && (
                    <button onClick={() => {setFeedback(null); setAiHint(null);}} className="mt-4 text-[10px] uppercase font-bold text-[#8e9199] tracking-widest w-full text-center py-2 border border-[#44474e] rounded-xl">Dismiss</button>
                  )}
                </div>
              )}
            </div>

            {/* Bottom Actions */}
            <div className="px-6 py-4 bg-[#1a1c1e] flex gap-3 items-center border-t border-[#44474e]">
              <button 
                onClick={handleGetHint}
                className="w-14 h-14 rounded-2xl bg-[#333538] flex items-center justify-center text-[#e2e2e6] active:scale-95 transition-transform"
                title="AI Hint"
              >
                <i className="fa-solid fa-wand-magic-sparkles"></i>
              </button>
              
              <button 
                onClick={handleSubmit}
                disabled={isLoading}
                className="flex-grow h-14 rounded-2xl bg-[#d0e4ff] text-[#00315d] font-bold flex items-center justify-center gap-3 shadow-lg active:scale-95 transition-transform disabled:opacity-50"
              >
                {isLoading ? <i className="fa-solid fa-circle-notch animate-spin"></i> : <i className="fa-solid fa-play"></i>}
                {isLoading ? 'ANALYZING...' : 'CHECK CODE'}
              </button>
            </div>
          </div>
        )}

        {/* Mission Browser Tab */}
        {activeTab === 'browser' && (
          <div className="flex-grow flex flex-col p-6 overflow-y-auto bg-[#1a1c1e]">
            <h1 className="text-2xl font-bold mb-2">Python Curriculum</h1>
            <p className="text-sm text-[#8e9199] mb-8">All lessons are free. Complete them to earn XP!</p>
            
            <div className="space-y-8 pb-10">
              <section>
                <h2 className="text-[10px] font-bold text-[#d0e4ff] uppercase tracking-[0.2em] mb-4 ml-1">Foundation (Beginner)</h2>
                <div className="grid gap-3">
                  {LEVELS.filter(l => l.tier === 'Beginner').map((l, index) => (
                    <button 
                      key={l.id} 
                      onClick={() => handleSelectChallenge(l)}
                      className={`p-4 rounded-3xl border flex items-center justify-between text-left transition-all active:scale-95 ${activeChallenge?.id === l.id ? 'bg-[#d0e4ff] border-[#d0e4ff] text-[#00315d]' : 'bg-[#333538] border-[#44474e] text-[#e2e2e6]'}`}
                    >
                      <div className="flex items-center gap-4">
                        <div className={`w-8 h-8 rounded-full flex items-center justify-center text-[10px] font-bold ${activeChallenge?.id === l.id ? 'bg-[#00315d] text-white' : 'bg-[#1a1c1e] text-[#8e9199]'}`}>
                          {index + 1}
                        </div>
                        <div className="flex flex-col">
                          <span className="font-bold text-sm">{l.title}</span>
                          <span className={`text-[10px] ${activeChallenge?.id === l.id ? 'text-[#00315d]/70' : 'text-[#8e9199]'}`}>{l.concepts.join(' • ')}</span>
                        </div>
                      </div>
                      {stats.completedIds.includes(l.id) && <i className="fa-solid fa-circle-check text-emerald-400"></i>}
                    </button>
                  ))}
                </div>
              </section>

              <section>
                <h2 className="text-[10px] font-bold text-amber-400 uppercase tracking-[0.2em] mb-4 ml-1">Logic & Structures (Intermediate)</h2>
                <div className="grid gap-3">
                  {LEVELS.filter(l => l.tier === 'Intermediate').map((l, index) => (
                    <button 
                      key={l.id} 
                      onClick={() => handleSelectChallenge(l)}
                      className={`p-4 rounded-3xl border flex items-center justify-between text-left transition-all active:scale-95 ${activeChallenge?.id === l.id ? 'bg-[#d0e4ff] border-[#d0e4ff] text-[#00315d]' : 'bg-[#333538] border-[#44474e] text-[#e2e2e6]'}`}
                    >
                      <div className="flex items-center gap-4">
                        <div className={`w-8 h-8 rounded-full flex items-center justify-center text-[10px] font-bold ${activeChallenge?.id === l.id ? 'bg-[#00315d] text-white' : 'bg-[#1a1c1e] text-[#8e9199]'}`}>
                          {index + 1}
                        </div>
                        <div className="flex flex-col">
                          <span className="font-bold text-sm">{l.title}</span>
                          <span className={`text-[10px] ${activeChallenge?.id === l.id ? 'text-[#00315d]/70' : 'text-[#8e9199]'}`}>{l.concepts.join(' • ')}</span>
                        </div>
                      </div>
                      {stats.completedIds.includes(l.id) && <i className="fa-solid fa-circle-check text-emerald-400"></i>}
                    </button>
                  ))}
                </div>
              </section>
            </div>
          </div>
        )}

        {/* Growth Tab */}
        {activeTab === 'skills' && (
          <div className="flex-grow flex flex-col p-8 overflow-y-auto">
            <h1 className="text-2xl font-bold mb-2">Mastery</h1>
            <p className="text-sm text-[#8e9199] mb-10">Track your coding skills across categories.</p>
            <div className="grid grid-cols-2 gap-8">
              <SkillNode name="Syntax" level={stats.skills.syntax} icon="fa-terminal" color="text-[#d0e4ff]" />
              <SkillNode name="Logic" level={stats.skills.logic} icon="fa-brain" color="text-[#d0e4ff]" />
              <SkillNode name="Data" level={stats.skills.data} icon="fa-database" color="text-[#d0e4ff]" />
              <SkillNode name="Web/API" level={stats.skills.async} icon="fa-globe" color="text-[#d0e4ff]" />
            </div>
            
            <div className="mt-12 p-6 bg-[#2e3032] rounded-[32px] border border-[#44474e]">
              <h4 className="font-bold text-sm mb-2 text-white flex items-center gap-2">
                <i className="fa-solid fa-graduation-cap text-[#d0e4ff]"></i>
                Learning Stats
              </h4>
              <div className="flex justify-between items-center text-xs py-2 border-b border-white/5">
                <span className="text-[#8e9199]">Missions Passed</span>
                <span className="font-bold">{stats.completedIds.length} / {LEVELS.length}</span>
              </div>
              <div className="flex justify-between items-center text-xs py-2 border-b border-white/5">
                <span className="text-[#8e9199]">Current Streak</span>
                <span className="font-bold">{stats.streak} Days</span>
              </div>
              <div className="flex justify-between items-center text-xs py-2">
                <span className="text-[#8e9199]">Global Rank</span>
                <span className="font-bold text-[#d0e4ff]">{stats.rank}</span>
              </div>
            </div>

            <div className="mt-auto pt-10 pb-4 text-center">
              <div className="text-[10px] font-bold text-[#44474e] uppercase tracking-[0.2em]">PyQuest: Mobile Mastery</div>
              <div className="text-[10px] font-bold text-[#8e9199] mt-1 underline opacity-50">
                <a href="https://pyquest.app/privacy" target="_blank" rel="noopener">Privacy & Legal</a>
              </div>
            </div>
          </div>
        )}

      </main>

      {/* Navigation */}
      <nav className="h-20 bg-[#1a1c1e] border-t border-[#44474e] flex items-center justify-around px-6 pb-2 shadow-[0_-4px_20px_rgba(0,0,0,0.4)]">
        <button 
          onClick={() => setActiveTab('mission')}
          className={`flex flex-col items-center gap-1 transition-colors ${activeTab === 'mission' ? 'text-[#d0e4ff]' : 'text-[#8e9199]'}`}
        >
          <i className="fa-solid fa-keyboard text-xl"></i>
          <span className="text-[9px] font-bold uppercase tracking-wider">Play</span>
        </button>
        <button 
          onClick={() => setActiveTab('browser')}
          className={`flex flex-col items-center gap-1 transition-colors ${activeTab === 'browser' ? 'text-[#d0e4ff]' : 'text-[#8e9199]'}`}
        >
          <i className="fa-solid fa-map-location-dot text-xl"></i>
          <span className="text-[9px] font-bold uppercase tracking-wider">Path</span>
        </button>
        <button 
          onClick={() => setActiveTab('skills')}
          className={`flex flex-col items-center gap-1 transition-colors ${activeTab === 'skills' ? 'text-[#d0e4ff]' : 'text-[#8e9199]'}`}
        >
          <i className="fa-solid fa-chart-line text-xl"></i>
          <span className="text-[9px] font-bold uppercase tracking-wider">Stats</span>
        </button>
      </nav>

      {/* Simplified Loading Overlay */}
      {isLoading && (
        <div className="fixed inset-0 bg-black/70 backdrop-blur-md z-[200] flex items-center justify-center p-12 text-center">
           <div className="bg-[#2e3032] p-8 rounded-[40px] shadow-2xl flex flex-col items-center border border-white/5">
              <div className="w-8 h-8 border-4 border-[#d0e4ff] border-t-transparent rounded-full animate-spin mb-4"></div>
              <p className="text-[#d0e4ff] text-xs font-bold tracking-widest uppercase">Checking Logic...</p>
           </div>
        </div>
      )}
    </div>
  );
};

export default App;
