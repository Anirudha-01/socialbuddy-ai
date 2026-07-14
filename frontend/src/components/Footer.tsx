import React from 'react';
import type { DocType } from '../types';

interface FooterProps {
  onOpenDoc: (docType: DocType) => void;
}

export const Footer: React.FC<FooterProps> = ({ onOpenDoc }) => {
  const handleClick = (e: React.MouseEvent, docType: DocType) => {
    e.preventDefault();
    onOpenDoc(docType);
  };

  return (
    <footer className="border-t border-indigo-50 py-6 px-6 mt-auto bg-white/50 shadow-inner">
      <div className="max-w-6xl mx-auto flex flex-col md:flex-row items-center justify-between text-xs text-slate-500 space-y-4 md:space-y-0">
        <div>
          <span>&copy; {new Date().getFullYear()} <span className="font-semibold text-slate-700">SocialBuddy.ai</span>. All rights reserved.</span>
        </div>
        <div className="flex space-x-6">
          <a
            href="#privacy"
            onClick={(e) => handleClick(e, 'privacy')}
            className="hover:text-indigo-600 hover:underline transition-all cursor-pointer font-semibold"
          >
            Privacy Policy
          </a>
          <a
            href="#terms"
            onClick={(e) => handleClick(e, 'terms')}
            className="hover:text-indigo-600 hover:underline transition-all cursor-pointer font-semibold"
          >
            Terms of Service
          </a>
          <a
            href="#support"
            onClick={(e) => handleClick(e, 'support')}
            className="hover:text-indigo-600 hover:underline transition-all cursor-pointer font-semibold"
          >
            Support Center
          </a>
        </div>
      </div>
    </footer>
  );
};
