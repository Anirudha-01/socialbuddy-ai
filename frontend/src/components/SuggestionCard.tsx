import React from 'react';
import { Lightbulb, CheckCircle2 } from 'lucide-react';

interface SuggestionCardProps {
  suggestions: string[];
}

const BADGE_COLORS = [
  { bg: 'bg-indigo-50/70 border-indigo-100/80', text: 'text-slate-700', num: 'bg-indigo-600' },
  { bg: 'bg-purple-50/70 border-purple-100/80', text: 'text-slate-700', num: 'bg-purple-600' },
  { bg: 'bg-sky-50/70 border-sky-100/80',       text: 'text-slate-700', num: 'bg-sky-600' },
  { bg: 'bg-violet-50/70 border-violet-100/80', text: 'text-slate-700', num: 'bg-violet-600' },
  { bg: 'bg-slate-50 border-slate-200',         text: 'text-slate-700', num: 'bg-slate-600' },
];

export const SuggestionCard: React.FC<SuggestionCardProps> = ({ suggestions }) => {
  return (
    <div className="bg-white border border-indigo-50 rounded-2xl p-6 flex flex-col gap-5 shadow-sm">
      {/* Header */}
      <div className="flex items-center gap-3">
        <div className="p-2 rounded-xl bg-indigo-50 border border-indigo-100">
          <Lightbulb className="w-4 h-4 text-indigo-600" />
        </div>
        <div>
          <h3 className="text-sm font-bold text-slate-800">Improvement Suggestions</h3>
          <p className="text-[11px] text-slate-500">AI-generated actionable tips</p>
        </div>
        <div className="ml-auto">
          <span className="text-[10px] font-bold bg-indigo-50 text-indigo-600 px-2.5 py-1 rounded-full border border-indigo-100">
            {suggestions.length} tips
          </span>
        </div>
      </div>

      {/* Suggestion Items */}
      <div className="space-y-3">
        {suggestions.map((s, i) => {
          const color = BADGE_COLORS[i % BADGE_COLORS.length];
          return (
            <div
              key={i}
              className={`flex items-start gap-3 p-3.5 rounded-xl border ${color.bg} transition-all duration-200 hover:scale-[1.01] group hover:shadow-sm`}
            >
              <div className={`flex-shrink-0 w-6 h-6 rounded-lg ${color.num} flex items-center justify-center text-[10px] font-bold text-white shadow-sm mt-0.5`}>
                {i + 1}
              </div>
              <p className={`text-xs leading-relaxed ${color.text} font-medium transition-all flex-1`}>
                {s}
              </p>
              <CheckCircle2 className="flex-shrink-0 w-3.5 h-3.5 text-slate-300 mt-0.5 ml-auto group-hover:text-indigo-500 transition-colors" />
            </div>
          );
        })}
      </div>
    </div>
  );
};
