import React, { useState } from 'react';
import { Sparkles, Copy, Check, Hash, Megaphone } from 'lucide-react';

interface CaptionCardProps {
  caption: string;
  callToAction: string;
  recommendedHashtags: string[];
}

export const CaptionCard: React.FC<CaptionCardProps> = ({ caption, callToAction, recommendedHashtags }) => {
  const [copiedCaption, setCopiedCaption] = useState(false);
  const [copiedHashtags, setCopiedHashtags] = useState(false);

  const copyText = async (text: string, setter: (v: boolean) => void) => {
    await navigator.clipboard.writeText(text);
    setter(true);
    setTimeout(() => setter(false), 2000);
  };

  const hashtagsText = (recommendedHashtags ?? []).join(' ');

  return (
    <div className="rounded-2xl bg-white border border-indigo-50 p-5 space-y-4 shadow-sm">
      {/* Header */}
      <div className="flex items-center gap-2">
        <div className="w-8 h-8 rounded-lg bg-indigo-50 border border-indigo-100 flex items-center justify-center shadow-sm">
          <Sparkles className="w-4 h-4 text-indigo-600" />
        </div>
        <h3 className="font-black text-slate-800">AI-Generated Caption</h3>
      </div>

      <div className="h-px bg-indigo-100/50" />

      {/* Caption block */}
      <div className="relative group">
        <p className="text-slate-700 text-sm leading-relaxed bg-slate-50 rounded-xl p-4 pr-12 border border-slate-100 whitespace-pre-wrap">
          {caption || 'No caption generated.'}
        </p>
        <button
          onClick={() => copyText(caption, setCopiedCaption)}
          className="absolute top-3 right-3 p-1.5 rounded-lg bg-white border border-indigo-100 text-indigo-600 hover:bg-indigo-50 shadow-sm transition-all opacity-0 group-hover:opacity-100 cursor-pointer"
          title="Copy caption"
        >
          {copiedCaption ? <Check className="w-3.5 h-3.5 text-green-600" /> : <Copy className="w-3.5 h-3.5" />}
        </button>
      </div>

      {/* CTA */}
      {callToAction && (
        <div className="flex items-start gap-3 p-3 rounded-xl bg-indigo-50/50 border border-indigo-100">
          <Megaphone className="w-4 h-4 text-indigo-600 flex-shrink-0 mt-0.5" />
          <div>
            <p className="text-[10px] text-indigo-600 uppercase font-bold tracking-wider mb-0.5">Call To Action</p>
            <p className="text-sm text-slate-800 font-bold">{callToAction}</p>
          </div>
        </div>
      )}

      {/* Hashtags */}
      {(recommendedHashtags ?? []).length > 0 && (
        <div>
          <div className="flex items-center justify-between mb-2">
            <div className="flex items-center gap-2 text-slate-500 text-xs font-bold">
              <Hash className="w-3.5 h-3.5 text-indigo-600" />
              <span>Recommended Hashtags</span>
            </div>
            <button
              onClick={() => copyText(hashtagsText, setCopiedHashtags)}
              className="flex items-center gap-1 text-xs text-indigo-600 hover:text-indigo-700 font-bold transition-colors cursor-pointer"
            >
              {copiedHashtags ? <Check className="w-3 h-3 text-green-600" /> : <Copy className="w-3 h-3" />}
              {copiedHashtags ? 'Copied!' : 'Copy all'}
            </button>
          </div>
          <div className="flex flex-wrap gap-1.5">
            {recommendedHashtags.map((tag, i) => (
              <span
                key={i}
                className="px-2.5 py-1 rounded-full bg-indigo-50 text-indigo-600 text-xs font-semibold border border-indigo-100/70 hover:bg-indigo-100/50 cursor-pointer transition-colors"
                onClick={() => copyText(tag, () => {})}
              >
                {tag}
              </span>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};
