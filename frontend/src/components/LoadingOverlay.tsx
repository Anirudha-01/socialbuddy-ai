import React from 'react';
import { Loader2 } from 'lucide-react';

interface LoadingOverlayProps {
  step: number;
}

const STEPS = [
  'Uploading...',
  'Validating File...',
  'Extracting Text...',
  'Running OCR...',
  'Analyzing with AI...',
  'Generating Suggestions...',
  'Preparing Dashboard...'
];

export const LoadingOverlay: React.FC<LoadingOverlayProps> = ({ step }) => {
  return (
    <div className="fixed inset-0 z-50 bg-white/95 backdrop-blur-sm flex flex-col items-center justify-center p-6">
      <div className="w-full max-w-sm text-center animate-scaleIn">
        {/* Animated Outer Ring */}
        <div className="relative w-24 h-24 mx-auto mb-8 flex items-center justify-center">
          <div className="absolute inset-0 rounded-full border-4 border-indigo-500/10"></div>
          <div className="absolute inset-0 rounded-full border-4 border-transparent border-t-indigo-600 border-r-purple-600 animate-spin"></div>
          <Loader2 className="w-8 h-8 text-indigo-600 animate-pulse" />
        </div>

        {/* Dynamic Step Text */}
        <div className="h-8 mb-4">
          <p className="text-xl font-bold text-slate-800 transition-all duration-300 animate-pulse">
            {STEPS[step] || 'Processing...'}
          </p>
        </div>

        {/* Progress Dots / Bar */}
        <div className="flex items-center justify-center space-x-2 mb-6">
          {STEPS.map((_, index) => (
            <div
              key={index}
              className={`h-1.5 rounded-full transition-all duration-500 ${
                index <= step 
                  ? 'w-6 bg-gradient-to-r from-indigo-600 to-purple-600' 
                  : 'w-2 bg-slate-200'
              }`}
            />
          ))}
        </div>

        <p className="text-xs text-slate-400">
          This may take up to a few seconds. Please keep this tab active.
        </p>
      </div>
    </div>
  );
};
