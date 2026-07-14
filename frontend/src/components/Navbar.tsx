import React from 'react';
import { Sparkles, Zap } from 'lucide-react';

interface NavbarProps {
  onLogoClick?: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({ onLogoClick }) => {
  return (
    <nav className="border-b border-indigo-50 bg-white/90 backdrop-blur-md sticky top-0 z-50 px-6 py-3 shadow-sm select-none">
      <div className="max-w-6xl mx-auto flex items-center justify-between">
        {/* Logo */}
        <div
          onClick={onLogoClick}
          className="flex items-center space-x-3 cursor-pointer group active:scale-95 transition-transform duration-150"
        >
          <div className="relative">
            {/* Unique double gradient ring logo */}
            <div className="bg-gradient-to-tr from-indigo-600 via-indigo-500 to-purple-600 p-2 rounded-2xl shadow-lg shadow-indigo-500/20 group-hover:rotate-6 transition-all duration-300 ring-2 ring-indigo-500/20">
              <Zap className="w-4 h-4 text-white fill-white/10" />
            </div>
            {/* Sparkle emblem decoration */}
            <div className="absolute -top-1 -right-1 bg-purple-500 text-white rounded-full p-0.5 border border-white shadow-sm">
              <Sparkles className="w-2 h-2" />
            </div>
            <div className="absolute inset-0 rounded-2xl bg-indigo-500/20 scale-110 opacity-0 group-hover:opacity-100 group-hover:scale-125 blur-sm transition-all duration-500" />
          </div>
          <div>
            <div className="flex items-center">
              <span className="text-lg font-black tracking-tight text-slate-800 group-hover:text-indigo-600 transition-colors">
                SocialBuddy<span className="text-indigo-600 font-black">.ai</span>
              </span>
            </div>
            <span className="hidden sm:inline text-[10px] text-slate-400 font-bold uppercase tracking-wider">
              AI Social strategist
            </span>
          </div>
        </div>

        {/* Right side controls */}
        <div className="flex items-center gap-3">
          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-indigo-50 text-indigo-600 border border-indigo-100">
            <span className="w-1.5 h-1.5 mr-1.5 rounded-full bg-indigo-500 animate-pulse" />
            Live Strategy Mode
          </span>
        </div>
      </div>
    </nav>
  );
};
