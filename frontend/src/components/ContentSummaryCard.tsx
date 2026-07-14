import React from 'react';
import { Globe2, FileText, Clock, Eye, Zap, Type } from 'lucide-react';

interface ContentSummaryCardProps {
  contentType: string;
  detectedPlatform: string;
  wordCount: number;
  estimatedReadingTime: string;
  estimatedReach: string;
  viralityPotential: string;
  keywordDensity: string;
}

const PLATFORM_COLORS: Record<string, string> = {
  instagram: 'from-pink-500 to-rose-500',
  linkedin:  'from-blue-600 to-blue-700',
  twitter:   'from-slate-800 to-slate-900',
  facebook:  'from-blue-600 to-indigo-600',
  general:   'from-indigo-500 to-purple-600',
  unknown:   'from-slate-500 to-slate-600',
};

const VIRALITY_BADGE: Record<string, string> = {
  high:   'bg-green-50 text-green-700 border-green-200',
  medium: 'bg-indigo-50 text-indigo-700 border-indigo-200',
  low:    'bg-red-50 text-red-700 border-red-200',
};

function getPlatformGradient(platform: string) {
  return PLATFORM_COLORS[platform.toLowerCase()] ?? PLATFORM_COLORS.general;
}

function getViralityBadge(virality: string) {
  return VIRALITY_BADGE[virality.toLowerCase()] ?? VIRALITY_BADGE.medium;
}

const Stat: React.FC<{ icon: React.ReactNode; label: string; value: string }> = ({ icon, label, value }) => (
  <div className="flex items-center gap-3 p-3 rounded-xl bg-slate-50 border border-slate-100 hover:border-indigo-200 transition-colors">
    <div className="text-indigo-600 flex-shrink-0">{icon}</div>
    <div>
      <p className="text-[10px] text-slate-500 uppercase tracking-wider font-bold">{label}</p>
      <p className="text-sm font-extrabold text-slate-800 mt-0.5">{value}</p>
    </div>
  </div>
);

export const ContentSummaryCard: React.FC<ContentSummaryCardProps> = ({
  contentType, detectedPlatform, wordCount,
  estimatedReadingTime, estimatedReach, viralityPotential, keywordDensity,
}) => {
  const gradient = getPlatformGradient(detectedPlatform);

  return (
    <div className="rounded-2xl bg-white border border-indigo-50 p-5 space-y-4 h-full shadow-sm">
      {/* Header */}
      <div className="flex items-start justify-between gap-3">
        <div>
          <h3 className="text-xs text-slate-400 uppercase tracking-widest font-bold mb-1">Content Detected</h3>
          <p className="text-lg font-black text-slate-800">{contentType}</p>
        </div>
        <div className={`px-3 py-1.5 rounded-xl bg-gradient-to-r ${gradient} text-white text-xs font-bold shadow-md flex items-center gap-1.5`}>
          <Globe2 className="w-3.5 h-3.5" />
          {detectedPlatform}
        </div>
      </div>

      <div className="h-px bg-indigo-100/50" />

      {/* Stats grid */}
      <div className="grid grid-cols-2 gap-2">
        <Stat icon={<Type className="w-4 h-4" />}    label="Words"        value={String(wordCount)} />
        <Stat icon={<Clock className="w-4 h-4" />}   label="Read Time"    value={estimatedReadingTime} />
        <Stat icon={<Eye className="w-4 h-4" />}     label="Est. Reach"   value={estimatedReach} />
        <Stat icon={<FileText className="w-4 h-4" />} label="Keywords"    value={keywordDensity} />
      </div>

      {/* Virality badge */}
      <div className="flex items-center justify-between pt-1">
        <div className="flex items-center gap-2 text-slate-500 text-sm font-semibold">
          <Zap className="w-4 h-4 text-indigo-600" />
          <span>Virality Potential</span>
        </div>
        <span className={`px-3 py-1 rounded-full text-xs font-bold border ${getViralityBadge(viralityPotential)}`}>
          {viralityPotential}
        </span>
      </div>
    </div>
  );
};
