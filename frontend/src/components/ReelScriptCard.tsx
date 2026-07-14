import React, { useState } from 'react';
import { Film, Copy, Check, ChevronRight } from 'lucide-react';

interface ReelScriptCardProps {
  script: string;
}

// Parse the structured reel script text into labelled sections
function parseScript(raw: string): { label: string; text: string }[] {
  if (!raw) return [];

  const LABELS = [
    'HOOK', 'SCENE 1', 'SCENE 2', 'SCENE 3', 'ENDING', 
    'CALL TO ACTION', 'CTA', 'SUGGESTED CAPTION', 'HASHTAGS', 
    'ESTIMATED DURATION', 'SUGGESTED DURATION', 
    'BACKGROUND MUSIC MOOD', 'MUSIC MOOD'
  ];
  const sections: { label: string; text: string }[] = [];

  let remaining = raw;
  for (let i = 0; i < LABELS.length; i++) {
    const label  = LABELS[i];
    
    // Find the next label that actually exists in remaining
    let next: string | undefined = undefined;
    for (let j = i + 1; j < LABELS.length; j++) {
      if (remaining.includes(LABELS[j] + ':')) {
        next = LABELS[j];
        break;
      }
    }

    const start  = remaining.indexOf(label + ':');
    if (start === -1) continue;

    const contentStart = start + label.length + 1;
    const end = next ? remaining.indexOf(next + ':') : remaining.length;
    const text = remaining.slice(contentStart, end !== -1 ? end : undefined).trim();
    sections.push({ label, text });
  }

  // Fallback: return raw if no labels matched
  return sections.length ? sections : [{ label: 'SCRIPT', text: raw }];
}

const LABEL_COLORS: Record<string, string> = {
  'HOOK':                  'from-rose-500 to-pink-500',
  'SCENE 1':               'from-indigo-500 to-indigo-600',
  'SCENE 2':               'from-purple-500 to-purple-600',
  'SCENE 3':               'from-violet-500 to-violet-600',
  'ENDING':                'from-emerald-500 to-teal-500',
  'CALL TO ACTION':        'from-indigo-600 to-purple-600',
  'CTA':                   'from-indigo-600 to-purple-600',
  'SUGGESTED CAPTION':     'from-sky-500 to-blue-600',
  'HASHTAGS':              'from-slate-700 to-slate-800',
  'ESTIMATED DURATION':    'from-slate-500 to-slate-600',
  'SUGGESTED DURATION':    'from-slate-500 to-slate-600',
  'BACKGROUND MUSIC MOOD': 'from-pink-500 to-fuchsia-500',
  'MUSIC MOOD':            'from-pink-500 to-fuchsia-500',
};

export const ReelScriptCard: React.FC<ReelScriptCardProps> = ({ script }) => {
  const [copied, setCopied] = useState(false);
  const sections = parseScript(script);

  const handleCopy = async () => {
    await navigator.clipboard.writeText(script);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  if (!script) return null;

  return (
    <div className="rounded-2xl bg-white border border-indigo-50 p-5 space-y-4 shadow-sm">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-lg bg-indigo-50 border border-indigo-100 flex items-center justify-center shadow-sm">
            <Film className="w-4 h-4 text-indigo-600" />
          </div>
          <h3 className="font-black text-slate-800">Reel Script</h3>
        </div>
        <button
          onClick={handleCopy}
          className="flex items-center gap-1.5 text-xs font-bold px-3 py-1.5 rounded-xl bg-indigo-50 hover:bg-indigo-100 text-indigo-600 border border-indigo-100 transition-all cursor-pointer"
        >
          {copied ? <Check className="w-3 h-3 text-green-600" /> : <Copy className="w-3 h-3" />}
          {copied ? 'Copied!' : 'Copy Script'}
        </button>
      </div>

      <div className="h-px bg-indigo-100/50" />

      {/* Script sections */}
      <div className="space-y-3">
        {sections.map(({ label, text }, i) => {
          const gradient = LABEL_COLORS[label] ?? 'from-indigo-500 to-purple-600';
          return (
            <div key={i} className="flex gap-3">
              <div className="flex-shrink-0 mt-0.5 animate-scaleIn">
                <span className={`inline-block px-2 py-0.5 rounded-md text-[10px] font-black text-white bg-gradient-to-r ${gradient} shadow-sm whitespace-nowrap`}>
                  {label}
                </span>
              </div>
              <div className="flex items-start gap-1.5 pt-0.5 text-slate-700 text-sm leading-relaxed min-w-0">
                <ChevronRight className="w-3.5 h-3.5 flex-shrink-0 text-indigo-500 mt-0.5 animate-pulse" />
                <p className="break-words font-medium">{text}</p>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
