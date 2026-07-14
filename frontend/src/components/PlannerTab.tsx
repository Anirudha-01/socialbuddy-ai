import React, { useState } from 'react';
import { Calendar, Clock, Lightbulb, Zap, ChevronRight, Star } from 'lucide-react';

interface PlannerTabProps {
  postingSchedule: string[];
  contentIdeas: string[];
}

const DAYS = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];
const DAY_COLORS = [
  'from-indigo-50/60 to-purple-50/60 border-indigo-100',
  'from-purple-50/60 to-violet-50/60 border-purple-100',
  'from-violet-50/60 to-sky-50/60 border-violet-100',
  'from-indigo-50/60 to-purple-50/60 border-indigo-100',
  'from-purple-50/60 to-violet-50/60 border-purple-100',
  'from-violet-50/60 to-sky-50/60 border-violet-100',
  'from-indigo-50/60 to-purple-50/60 border-indigo-100',
];

export const PlannerTab: React.FC<PlannerTabProps> = ({ postingSchedule, contentIdeas }) => {
  const [activeIdea, setActiveIdea] = useState<number | null>(null);

  return (
    <div className="space-y-8">
      {/* Posting Schedule */}
      <div>
        <div className="flex items-center gap-3 mb-5">
          <div className="p-2 rounded-xl bg-indigo-50 border border-indigo-100">
            <Calendar className="w-5 h-5 text-indigo-600" />
          </div>
          <div>
            <h2 className="text-lg font-bold text-slate-800">Posting Schedule</h2>
            <p className="text-xs text-slate-500">AI-recommended best times for your niche</p>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-3">
          {postingSchedule.map((slot, i) => {
            // Try to extract day/time from the slot string
            const dashIdx = slot.indexOf(' - ');
            const timePart = dashIdx > -1 ? slot.substring(0, dashIdx) : slot;
            const reason = dashIdx > -1 ? slot.substring(dashIdx + 3) : '';
            const dayLabel = DAYS[i % DAYS.length];
            const colorClass = DAY_COLORS[i % DAY_COLORS.length];

            return (
              <div
                key={i}
                className={`relative group p-4 rounded-2xl bg-gradient-to-br ${colorClass} border transition-all duration-300 hover:scale-[1.02] hover:shadow-md`}
              >
                <div className="flex items-center gap-2 mb-2">
                  <span className="text-[10px] font-bold uppercase tracking-widest text-indigo-600 bg-indigo-50 px-2 py-0.5 rounded-full">
                    {dayLabel}
                  </span>
                  <Clock className="w-3.5 h-3.5 text-slate-400 ml-auto" />
                </div>
                <p className="text-sm font-extrabold text-slate-800 leading-snug mb-1">
                  {timePart}
                </p>
                {reason && (
                  <p className="text-xs text-slate-500 leading-relaxed font-medium">{reason}</p>
                )}
                <div className="absolute top-3 right-3 opacity-0 group-hover:opacity-100 transition-opacity">
                  <Star className="w-3 h-3 text-purple-500 fill-purple-400/30" />
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Divider */}
      <div className="h-px bg-indigo-100/50" />

      {/* Content Ideas */}
      <div>
        <div className="flex items-center gap-3 mb-5">
          <div className="p-2 rounded-xl bg-indigo-50 border border-indigo-100">
            <Lightbulb className="w-5 h-5 text-indigo-600" />
          </div>
          <div>
            <h2 className="text-lg font-bold text-slate-800">Content Ideas</h2>
            <p className="text-xs text-slate-500">Fresh angles tailored to your niche</p>
          </div>
        </div>

        <div className="space-y-3">
          {contentIdeas.map((idea, i) => (
            <button
              key={i}
              onClick={() => setActiveIdea(activeIdea === i ? null : i)}
              className={`w-full text-left p-4 rounded-2xl border transition-all duration-300 group cursor-pointer ${
                activeIdea === i
                  ? 'bg-indigo-50/50 border-indigo-200 shadow-sm'
                  : 'bg-white border-indigo-100/70 hover:border-indigo-200 hover:bg-slate-50/30 hover:shadow-sm'
              }`}
            >
              <div className="flex items-start gap-3">
                <div className={`flex-shrink-0 w-7 h-7 rounded-xl flex items-center justify-center text-xs font-bold transition-all ${
                  activeIdea === i
                    ? 'bg-indigo-600 text-white'
                    : 'bg-slate-100 text-slate-500 group-hover:bg-indigo-50 group-hover:text-indigo-600'
                }`}>
                  {i + 1}
                </div>
                <div className="flex-1 min-w-0">
                  <p className={`text-sm font-semibold leading-relaxed transition-colors ${
                    activeIdea === i ? 'text-slate-800' : 'text-slate-600 group-hover:text-slate-800'
                  }`}>
                    {idea}
                  </p>
                </div>
                <ChevronRight className={`flex-shrink-0 w-4 h-4 transition-all duration-300 ${
                  activeIdea === i ? 'text-indigo-600 rotate-90' : 'text-slate-400 group-hover:text-indigo-600'
                }`} />
              </div>

              {activeIdea === i && (
                <div className="mt-3 ml-10 pt-3 border-t border-indigo-100">
                  <div className="flex items-center gap-2 text-xs text-indigo-600 font-bold">
                    <Zap className="w-3 h-3" />
                    <span>Use this idea as your next post topic!</span>
                  </div>
                </div>
              )}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
};
