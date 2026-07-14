import React from 'react';
import { MessageCircle, BookOpen, Anchor, Target, Tag, Smile, Sparkles, ShieldCheck, PenLine } from 'lucide-react';

interface ResultCardProps {
  tone: string;
  sentiment: string;
  readability: string;
  hook: string;          // hookStrength
  cta: string;
  hashtags: number;
  emojiUsage: string;
  grammar?: string;
  professionalism?: string;
}

function getValueColor(value: string): string {
  const v = (value ?? '').toLowerCase();
  if (['strong', 'present', 'easy', 'positive', 'high', 'professional', 'inspirational', 'casual', 'excellent', 'good'].some(w => v.includes(w)))
    return 'text-green-600 font-bold';
  if (['average', 'medium', 'neutral', 'moderate'].some(w => v.includes(w)))
    return 'text-amber-600 font-bold';
  if (['missing', 'hard', 'negative', 'low', 'weak', 'needs work'].some(w => v.includes(w)))
    return 'text-red-600 font-bold';
  return 'text-slate-700';
}

export const ResultCard: React.FC<ResultCardProps> = ({
  tone, sentiment, readability, hook, cta, hashtags, emojiUsage, grammar, professionalism,
}) => {
  const metrics = [
    { label: 'Tone',           value: tone,              icon: MessageCircle, cls: 'text-indigo-600  bg-indigo-50  border-indigo-100'  },
    { label: 'Sentiment',      value: sentiment,         icon: Smile,         cls: 'text-emerald-600 bg-emerald-50 border-emerald-100' },
    { label: 'Readability',    value: readability,       icon: BookOpen,      cls: 'text-sky-600     bg-sky-50     border-sky-100'     },
    { label: 'Hook Strength',  value: hook,              icon: Anchor,        cls: 'text-purple-600  bg-purple-50  border-purple-100'  },
    { label: 'CTA Detected',   value: cta,               icon: Target,        cls: 'text-rose-600    bg-rose-50    border-rose-100'    },
    { label: 'Hashtags',       value: `${hashtags}`,     icon: Tag,           cls: 'text-amber-600   bg-amber-50   border-amber-100'   },
    { label: 'Emoji Density',  value: emojiUsage,        icon: Sparkles,      cls: 'text-fuchsia-600 bg-fuchsia-50 border-fuchsia-100' },
    ...(grammar       ? [{ label: 'Grammar',        value: grammar,       icon: PenLine,      cls: 'text-teal-600    bg-teal-50    border-teal-100'    }] : []),
    ...(professionalism ? [{ label: 'Professionalism', value: professionalism, icon: ShieldCheck, cls: 'text-cyan-600     bg-cyan-50    border-cyan-100'    }] : []),
  ];

  return (
    <div className="bg-white border border-indigo-50 rounded-2xl p-5 h-full shadow-sm">
      <div className="flex items-center gap-2 mb-4">
        <span className="text-xs font-bold tracking-widest uppercase text-slate-500">Analysis Breakdown</span>
        <div className="flex-1 h-px bg-indigo-100/50 ml-2" />
      </div>

      <div className="grid grid-cols-1 gap-2 stagger-children">
        {metrics.map(({ label, value, icon: Icon, cls }, i) => (
          <div
            key={i}
            className="animate-fadeUp flex items-center gap-3 bg-slate-50 border border-slate-100 hover:border-indigo-200 p-3 rounded-xl transition-all duration-200 hover:bg-white cursor-default"
          >
            <div className={`flex-shrink-0 p-1.5 rounded-lg border ${cls}`}>
              <Icon className="w-3.5 h-3.5" />
            </div>
            <div className="flex items-center justify-between w-full min-w-0 gap-2">
              <p className="text-[11px] text-slate-500 font-bold flex-shrink-0">{label}</p>
              <p className={`text-xs truncate text-right ${getValueColor(value)}`}>{value || '—'}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
