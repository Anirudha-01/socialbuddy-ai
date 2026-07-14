import React, { useState } from 'react';
import { Target, Users, Sparkles, X, ChevronRight } from 'lucide-react';

interface StrategyModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (campaignGoal: string, targetAudience: string, tonePreference: string) => void;
  fileName: string;
}

const GOALS = [
  { id: 'reach',      label: 'Increase Reach & Virality',   desc: 'Optimize for shares, views, and discoverability.', icon: '🚀' },
  { id: 'engage',     label: 'Boost Engagement & Replies',  desc: 'Optimize for comments, likes, and conversations.', icon: '💬' },
  { id: 'authority',  label: 'Establish Brand Authority',  desc: 'Optimize for professional value, trust, and saves.', icon: '🤝' },
];

const AUDIENCES = [
  { id: 'genz',       label: 'Gen Z & Trend-Savvy',         desc: 'Fast-paced, casual, meme/slang friendly.', icon: '⚡' },
  { id: 'pro',        label: 'Professionals & B2B',         desc: 'Industry leaders, polished, business-oriented.', icon: '💼' },
  { id: 'general',    label: 'General Consumer',            desc: 'Warm, informative, relatable to everyone.', icon: '🛍️' },
];

const TONES = [
  { id: 'bold',       label: 'Bold & Creative',             desc: 'High energy, punchy hooks, risk-taking.', icon: '🔥' },
  { id: 'trust',      label: 'Professional & Trustworthy',  desc: 'Credible, direct, value-first storytelling.', icon: '🛡️' },
  { id: 'friendly',   label: 'Friendly & Conversational',   desc: 'Inviting, personal, community-building.', icon: '🎉' },
];

export const StrategyModal: React.FC<StrategyModalProps> = ({ isOpen, onClose, onSubmit, fileName }) => {
  const [goal, setGoal]         = useState('reach');
  const [audience, setAudience] = useState('general');
  const [tone, setTone]         = useState('friendly');

  if (!isOpen) return null;

  const handleSubmit = () => {
    const selectedGoal = GOALS.find(g => g.id === goal)?.label || '';
    const selectedAudience = AUDIENCES.find(a => a.id === audience)?.label || '';
    const selectedTone = TONES.find(t => t.id === tone)?.label || '';
    onSubmit(selectedGoal, selectedAudience, selectedTone);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/40 backdrop-blur-sm animate-fadeIn">
      <div className="relative w-full max-w-2xl bg-white rounded-3xl border border-indigo-100 shadow-2xl p-6 md:p-8 flex flex-col max-h-[90vh] overflow-y-auto animate-scaleIn">
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-2 rounded-xl text-slate-400 hover:text-slate-600 hover:bg-slate-50 transition-all cursor-pointer"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Header */}
        <div className="mb-6 flex items-start gap-4 pr-8">
          <div className="p-3 bg-indigo-50 border border-indigo-100 rounded-2xl text-indigo-600 flex-shrink-0">
            <Sparkles className="w-6 h-6 animate-pulse" />
          </div>
          <div>
            <h2 className="text-xl md:text-2xl font-black text-slate-800 tracking-tight">Strategy Optimizer</h2>
            <p className="text-xs text-slate-500 mt-1">
              Select targets for <span className="font-semibold text-indigo-600 break-all">{fileName}</span> to build a tailored posting strategy.
            </p>
          </div>
        </div>

        {/* Form Fields */}
        <div className="space-y-6 flex-1">
          {/* Question 1: Goal */}
          <div>
            <label className="flex items-center gap-2 text-xs font-bold text-slate-500 uppercase tracking-wider mb-3">
              <Target className="w-4 h-4 text-indigo-500" />
              1. What is your primary campaign goal?
            </label>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-2.5">
              {GOALS.map((g) => (
                <button
                  key={g.id}
                  onClick={() => setGoal(g.id)}
                  className={`text-left p-3.5 rounded-2xl border transition-all duration-200 cursor-pointer ${
                    goal === g.id
                      ? 'border-indigo-600 bg-indigo-50/30 ring-1 ring-indigo-600'
                      : 'border-slate-100 bg-slate-50/50 hover:bg-slate-50 hover:border-slate-200'
                  }`}
                >
                  <span className="text-xl mb-1.5 block">{g.icon}</span>
                  <p className="text-xs font-extrabold text-slate-800 leading-snug">{g.label}</p>
                  <p className="text-[10px] text-slate-500 mt-1 leading-normal font-medium">{g.desc}</p>
                </button>
              ))}
            </div>
          </div>

          {/* Question 2: Audience */}
          <div>
            <label className="flex items-center gap-2 text-xs font-bold text-slate-500 uppercase tracking-wider mb-3">
              <Users className="w-4 h-4 text-purple-500" />
              2. Who is your target audience?
            </label>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-2.5">
              {AUDIENCES.map((a) => (
                <button
                  key={a.id}
                  onClick={() => setAudience(a.id)}
                  className={`text-left p-3.5 rounded-2xl border transition-all duration-200 cursor-pointer ${
                    audience === a.id
                      ? 'border-purple-600 bg-purple-50/30 ring-1 ring-purple-600'
                      : 'border-slate-100 bg-slate-50/50 hover:bg-slate-50 hover:border-slate-200'
                  }`}
                >
                  <span className="text-xl mb-1.5 block">{a.icon}</span>
                  <p className="text-xs font-extrabold text-slate-800 leading-snug">{a.label}</p>
                  <p className="text-[10px] text-slate-500 mt-1 leading-normal font-medium">{a.desc}</p>
                </button>
              ))}
            </div>
          </div>

          {/* Question 3: Tone */}
          <div>
            <label className="flex items-center gap-2 text-xs font-bold text-slate-500 uppercase tracking-wider mb-3">
              <Sparkles className="w-4 h-4 text-violet-500" />
              3. What tone of voice do you prefer?
            </label>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-2.5">
              {TONES.map((t) => (
                <button
                  key={t.id}
                  onClick={() => setTone(t.id)}
                  className={`text-left p-3.5 rounded-2xl border transition-all duration-200 cursor-pointer ${
                    tone === t.id
                      ? 'border-violet-600 bg-violet-50/30 ring-1 ring-violet-600'
                      : 'border-slate-100 bg-slate-50/50 hover:bg-slate-50 hover:border-slate-200'
                  }`}
                >
                  <span className="text-xl mb-1.5 block">{t.icon}</span>
                  <p className="text-xs font-extrabold text-slate-800 leading-snug">{t.label}</p>
                  <p className="text-[10px] text-slate-500 mt-1 leading-normal font-medium">{t.desc}</p>
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Footer Actions */}
        <div className="mt-8 pt-4 border-t border-slate-100 flex flex-col sm:flex-row items-center justify-end gap-3">
          <button
            onClick={onClose}
            className="w-full sm:w-auto px-5 py-2.5 rounded-xl text-xs font-bold text-slate-500 hover:text-slate-700 transition-colors cursor-pointer"
          >
            Cancel
          </button>
          <button
            onClick={handleSubmit}
            className="w-full sm:w-auto flex items-center justify-center gap-2 bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 text-white font-extrabold px-6 py-2.5 rounded-xl text-xs shadow-md shadow-indigo-500/10 hover:scale-[1.02] active:scale-[0.98] transition-all duration-200 cursor-pointer"
          >
            <span>Generate Strategy</span>
            <ChevronRight className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );
};
