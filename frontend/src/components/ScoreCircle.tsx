import React from 'react';
import { TrendingUp } from 'lucide-react';

interface ScoreCircleProps {
  score: number;
}

function getScoreColor(score: number): { stroke: string; glow: string; label: string; labelColor: string } {
  if (score >= 80) return { stroke: '#22c55e', glow: 'shadow-green-500/10', label: 'Excellent', labelColor: 'text-green-600' };
  if (score >= 60) return { stroke: '#4f46e5', glow: 'shadow-indigo-500/10', label: 'Good', labelColor: 'text-indigo-600' };
  if (score >= 40) return { stroke: '#f59e0b', glow: 'shadow-amber-500/10', label: 'Average', labelColor: 'text-amber-600' };
  return { stroke: '#ef4444', glow: 'shadow-red-500/10', label: 'Needs Work', labelColor: 'text-red-600' };
}

export const ScoreCircle: React.FC<ScoreCircleProps> = ({ score }) => {
  const radius = 70;
  const stroke = 8;
  const normalizedRadius = radius - stroke * 2;
  const circumference = normalizedRadius * 2 * Math.PI;
  const strokeDashoffset = circumference - (score / 100) * circumference;
  const { stroke: strokeColor, glow, label, labelColor } = getScoreColor(score);

  return (
    <div className={`bg-white border border-indigo-50 rounded-2xl p-6 flex flex-col items-center justify-center gap-4 shadow-sm ${glow}`}>
      {/* Header */}
      <div className="flex items-center gap-2 self-start">
        <div className="p-1.5 rounded-lg bg-indigo-50 border border-indigo-100">
          <TrendingUp className="w-4 h-4 text-indigo-600" />
        </div>
        <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">Engagement Score</span>
      </div>

      {/* SVG Ring */}
      <div className="relative flex items-center justify-center">
        {/* Glow backdrop */}
        <div
          className="absolute w-28 h-28 rounded-full blur-xl opacity-10 transition-all duration-700"
          style={{ backgroundColor: strokeColor }}
        />

        <svg height={radius * 2} width={radius * 2}>
          <defs>
            <linearGradient id="scoreGrad" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor={strokeColor} stopOpacity="1" />
              <stop offset="100%" stopColor={strokeColor} stopOpacity="0.6" />
            </linearGradient>
          </defs>
          {/* Track circle */}
          <circle
            stroke="#f1f5f9"
            fill="transparent"
            strokeWidth={stroke}
            r={normalizedRadius}
            cx={radius}
            cy={radius}
          />
          {/* Progress circle */}
          <circle
            stroke="url(#scoreGrad)"
            fill="transparent"
            strokeWidth={stroke}
            strokeLinecap="round"
            strokeDasharray={`${circumference} ${circumference}`}
            style={{
              strokeDashoffset,
              transition: 'stroke-dashoffset 1s ease-in-out',
              transform: 'rotate(-90deg)',
              transformOrigin: '50% 50%',
            }}
            r={normalizedRadius}
            cx={radius}
            cy={radius}
          />
        </svg>

        {/* Score Text */}
        <div className="absolute flex flex-col items-center">
          <span className="text-4xl font-black text-slate-800 leading-none tracking-tight">{score}</span>
          <span className="text-[10px] font-bold text-slate-400 tracking-widest uppercase">/ 100</span>
        </div>
      </div>

      {/* Grade label */}
      <div className="flex flex-col items-center gap-1">
        <span className={`text-base font-bold ${labelColor}`}>{label}</span>
        <p className="text-[11px] text-slate-500 text-center max-w-[140px]">
          Based on hook, readability, CTA & structure
        </p>
      </div>

      {/* Progress bar */}
      <div className="w-full bg-slate-100 rounded-full h-1.5 overflow-hidden">
        <div
          className="h-full rounded-full transition-all duration-700"
          style={{ width: `${score}%`, backgroundColor: strokeColor }}
        />
      </div>
    </div>
  );
};
