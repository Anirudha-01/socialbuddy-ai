import React from 'react';
import { X, Shield, FileText, HelpCircle } from 'lucide-react';
import type { DocType } from '../types';

interface DocumentModalProps {
  isOpen: boolean;
  docType: DocType | null;
  onClose: () => void;
}

export const DocumentModal: React.FC<DocumentModalProps> = ({ isOpen, docType, onClose }) => {
  if (!isOpen || !docType) return null;

  const renderContent = () => {
    switch (docType) {
      case 'privacy':
        return (
          <div className="space-y-4 text-slate-600 text-sm leading-relaxed">
            <div className="flex items-center gap-2 text-orange-600 mb-2">
              <Shield className="w-5 h-5" />
              <h3 className="font-bold text-lg text-slate-800">Privacy Policy</h3>
            </div>
            <p className="text-[11px] text-slate-400">Last updated: July 2026</p>
            <p>
              At <strong>SOCIALbuddy</strong>, we take your privacy extremely seriously. We are committed to safeguarding your uploaded assets (PDFs and Images) and the text extracted from them.
            </p>
            <h4 className="font-bold text-slate-800">1. Data We Process</h4>
            <p>
              We process uploaded images and PDFs solely to extract text using our OCR pipeline and to analyze content via the secure Google Gemini Vision API.
            </p>
            <h4 className="font-bold text-slate-800">2. Local Storage & Security</h4>
            <p>
              Uploaded content is sent over secure SSL/TLS channels. We do not persist files on our backend servers permanently. If historical logging is enabled on your profile, only the generated text metadata is saved.
            </p>
            <h4 className="font-bold text-slate-800">3. Third-party APIs</h4>
            <p>
              Data transmission to Google Gemini and OCR.space conforms strictly to their commercial terms, meaning your data is not used for model training.
            </p>
          </div>
        );

      case 'terms':
        return (
          <div className="space-y-4 text-slate-600 text-sm leading-relaxed">
            <div className="flex items-center gap-2 text-orange-600 mb-2">
              <FileText className="w-5 h-5" />
              <h3 className="font-bold text-lg text-slate-800">Terms of Service</h3>
            </div>
            <p className="text-[11px] text-slate-400">Last updated: July 2026</p>
            <p>
              Welcome to <strong>SOCIALbuddy</strong>. By accessing our services, you agree to comply with the terms set forth below.
            </p>
            <h4 className="font-bold text-slate-800">1. License & Usage</h4>
            <p>
              We grant you a personal, non-transferable, and non-exclusive license to use the SOCIALbuddy analyzer dashboard to generate engagement strategies for your social media accounts.
            </p>
            <h4 className="font-bold text-slate-800">2. Fair Use Policy</h4>
            <p>
              To ensure system reliability, we impose a rate limit of 10MB per file and a general request limit of 60 analyses per hour. Automation of our upload mechanism is strictly prohibited.
            </p>
            <h4 className="font-bold text-slate-800">3. Disclaimer of Output</h4>
            <p>
              All suggestions, caption modifications, and schedules are AI-generated metrics. SOCIALbuddy is not liable for actual organic post performance on external networks.
            </p>
          </div>
        );

      case 'support':
        return (
          <div className="space-y-4 text-slate-600 text-sm leading-relaxed">
            <div className="flex items-center gap-2 text-orange-600 mb-2">
              <HelpCircle className="w-5 h-5" />
              <h3 className="font-bold text-lg text-slate-800">Support Center</h3>
            </div>
            <p>
              Need help or have questions about your social strategy analyzer? We're here for you!
            </p>
            <div className="bg-orange-50 border border-orange-100 rounded-xl p-4 space-y-2">
              <h4 className="font-bold text-orange-700 text-xs uppercase tracking-wider">Frequently Asked Questions</h4>
              <div className="space-y-2">
                <div>
                  <p className="font-bold text-slate-800 text-xs">Q: What file formats are supported?</p>
                  <p className="text-xs text-slate-600">A: We support PDF files containing post drafts and direct screenshots/images (PNG, JPG, JPEG).</p>
                </div>
                <div>
                  <p className="font-bold text-slate-800 text-xs">Q: Is my client data shared publicly?</p>
                  <p className="text-xs text-slate-600">A: No, your files are processed in real-time and remain strictly confidential.</p>
                </div>
              </div>
            </div>
            <h4 className="font-bold text-slate-800">Contact Us</h4>
            <p>
              For enterprise inquiries or general support issues, please email our support team at:
              <br />
              <span className="font-extrabold text-orange-600">support@socialbuddy.ai</span>
            </p>
            <p className="text-xs text-slate-400">Our average response time is under 12 hours.</p>
          </div>
        );

      default:
        return null;
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-fadeIn">
      <div className="bg-white border border-orange-100 rounded-3xl max-w-lg w-full max-h-[85vh] overflow-y-auto shadow-xl relative animate-scaleIn p-6">
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-1.5 rounded-full hover:bg-slate-100 text-slate-400 hover:text-slate-700 transition-colors cursor-pointer"
        >
          <X className="w-4 h-4" />
        </button>

        {/* Content */}
        <div className="pr-2">
          {renderContent()}
        </div>

        {/* Footer */}
        <div className="mt-6 pt-4 border-t border-orange-100 flex justify-end">
          <button
            onClick={onClose}
            className="bg-orange-500 hover:bg-orange-600 text-white font-bold text-xs px-4 py-2 rounded-xl shadow-sm cursor-pointer transition-colors"
          >
            Close Window
          </button>
        </div>
      </div>
    </div>
  );
};
