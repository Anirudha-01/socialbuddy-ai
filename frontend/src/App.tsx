import './App.css';
import { useState, useRef, useEffect } from 'react';
import { Navbar }              from './components/Navbar';
import { UploadCard }          from './components/UploadCard';
import { LoadingOverlay }      from './components/LoadingOverlay';
import { ScoreCircle }         from './components/ScoreCircle';
import { ResultCard }          from './components/ResultCard';
import { SuggestionCard }      from './components/SuggestionCard';
import { ImprovedPost }        from './components/ImprovedPost';
import { ContentSummaryCard }  from './components/ContentSummaryCard';
import { CaptionCard }         from './components/CaptionCard';
import { ReelScriptCard }      from './components/ReelScriptCard';
import { PlannerTab }          from './components/PlannerTab';
import { Footer }              from './components/Footer';
import { DocumentModal }       from './components/DocumentModal';
import { StrategyModal }       from './components/StrategyModal';
import type { DocType }        from './types';
import { analyzeContent }      from './services/api';
import type { AnalysisResult, ApiError } from './types';
import { Download, AlertTriangle, ArrowLeft, BarChart2, CalendarDays, FileText, Image as ImageIcon, ChevronDown, Heart, MessageCircle, Share2, ThumbsUp, Send, Sparkle } from 'lucide-react';
import axios from 'axios';
import jsPDF from 'jspdf';
import html2canvas from 'html2canvas';

type ActiveTab = 'analyzer' | 'planner';

/* ─── PDF Report ──────────────────────────────────────────────────────────── */
function generatePdfReport(a: AnalysisResult) {
  const doc  = new jsPDF({ unit: 'pt', format: 'a4' });
  const W    = doc.internal.pageSize.getWidth();
  const margin = 48;
  let y = margin;

  const checkPage = (needed = 24) => {
    if (y + needed > doc.internal.pageSize.getHeight() - margin) {
      doc.addPage();
      y = margin;
    }
  };

  // Header gradient bar (Indigo/Purple)
  doc.setFillColor(79, 70, 229);
  doc.rect(0, 0, W, 6, 'F');

  // Title
  doc.setFontSize(22);
  doc.setTextColor(15, 23, 42);
  doc.setFont('helvetica', 'bold');
  doc.text('SocialBuddy AI Content Report', margin, y + 24);

  doc.setFontSize(9);
  doc.setTextColor(100, 116, 139);
  doc.setFont('helvetica', 'normal');
  doc.text(`Generated: ${new Date().toLocaleString()}`, margin, y + 40);
  y += 64;

  const section = (title: string) => {
    checkPage(32);
    doc.setFontSize(11);
    doc.setFont('helvetica', 'bold');
    doc.setTextColor(79, 70, 229);
    doc.text(title.toUpperCase(), margin, y);
    doc.setDrawColor(79, 70, 229);
    doc.setLineWidth(0.5);
    doc.line(margin, y + 3, W - margin, y + 3);
    y += 18;
  };

  const row = (label: string, value: string) => {
    checkPage(16);
    doc.setFontSize(10);
    doc.setFont('helvetica', 'bold');
    doc.setTextColor(51, 65, 85);
    doc.text(`${label}:`, margin, y);
    doc.setFont('helvetica', 'normal');
    doc.setTextColor(30, 41, 59);
    const lines = doc.splitTextToSize(value || '—', W - margin - 160);
    doc.text(lines, margin + 160, y);
    y += Math.max(14, lines.length * 12);
  };

  const list = (items: string[] = []) => {
    items.forEach((item, i) => {
      checkPage(14);
      doc.setFontSize(9.5);
      doc.setFont('helvetica', 'normal');
      doc.setTextColor(51, 65, 85);
      const lines = doc.splitTextToSize(`${i + 1}. ${item}`, W - margin * 2 - 12);
      doc.text(lines, margin + 12, y);
      y += lines.length * 13;
    });
  };

  // ── Content Identity
  section('Content Identity');
  row('Content Type',      a.contentType);
  row('Detected Platform', a.detectedPlatform);
  row('Word Count',        String(a.wordCount));
  row('Reading Time',      a.estimatedReadingTime);
  y += 8;

  // ── Engagement Metrics
  section('Engagement Metrics');
  row('Engagement Score',   `${a.engagementScore} / 100`);
  row('Estimated Reach',    a.estimatedReach);
  row('Virality Potential', a.viralityPotential);
  y += 8;

  // ── Content Quality
  section('Content Quality');
  row('Tone',            a.tone);
  row('Sentiment',       a.sentiment);
  row('Readability',     a.readability);
  row('Hook Strength',   a.hookStrength);
  row('Call To Action',  a.cta);
  row('Grammar',         a.grammar);
  row('Professionalism', a.professionalism);
  row('Emoji Usage',     a.emojiUsage);
  row('Keyword Density', a.keywordDensity);
  y += 8;

  // ── Suggestions
  section('AI Improvement Suggestions');
  list(a.suggestions);
  y += 8;

  // ── Generated Caption
  section('AI-Generated Caption');
  checkPage(20);
  doc.setFontSize(9.5);
  doc.setFont('helvetica', 'normal');
  doc.setTextColor(51, 65, 85);
  const captionLines = doc.splitTextToSize(a.caption || '—', W - margin * 2);
  doc.text(captionLines, margin, y);
  y += captionLines.length * 13 + 4;
  row('Call To Action', a.callToAction);
  row('Recommended Hashtags', (a.recommendedHashtags ?? []).join('  '));
  y += 8;

  // ── Reel Script (only if present)
  if (a.reelScript) {
    section('Reel Script');
    checkPage(20);
    doc.setFontSize(9.5);
    doc.setFont('helvetica', 'normal');
    doc.setTextColor(51, 65, 85);
    const scriptLines = doc.splitTextToSize(a.reelScript, W - margin * 2);
    doc.text(scriptLines, margin, y);
    y += scriptLines.length * 13 + 8;
  }

  // ── Improved Post
  section('AI-Optimized Post');
  checkPage(20);
  doc.setFontSize(9.5);
  doc.setFont('helvetica', 'normal');
  doc.setTextColor(51, 65, 85);
  const improvedLines = doc.splitTextToSize(a.improvedPost || '—', W - margin * 2);
  doc.text(improvedLines, margin, y);
  y += improvedLines.length * 13 + 8;

  // ── Posting Schedule
  section('Posting Schedule');
  list(a.postingSchedule);
  y += 8;

  // ── Content Ideas
  section('Content Ideas for Your Niche');
  list(a.contentIdeas);

  // Footer
  const totalPages = doc.getNumberOfPages();
  for (let p = 1; p <= totalPages; p++) {
    doc.setPage(p);
    doc.setFontSize(8);
    doc.setTextColor(148, 163, 184);
    doc.text(
      `Generated by SocialBuddy AI · Page ${p} of ${totalPages}`,
      W / 2,
      doc.internal.pageSize.getHeight() - 20,
      { align: 'center' }
    );
  }

  doc.save(`SocialBuddy_Report_${Date.now()}.pdf`);
}

/* ─── Word Report ─────────────────────────────────────────────────────────── */
function generateWordReport(a: AnalysisResult) {
  const content = `
    <html xmlns:o='urn:schemas-microsoft-com:office:office' xmlns:w='urn:schemas-microsoft-com:office:word' xmlns='http://www.w3.org/TR/REC-html40'>
    <head>
      <meta charset="utf-8">
      <title>SocialBuddy AI Content Report</title>
      <style>
        body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
        h1 { color: #4f46e5; font-size: 24px; border-bottom: 2px solid #4f46e5; padding-bottom: 5px; }
        h2 { color: #7c3aed; font-size: 18px; margin-top: 20px; border-bottom: 1px solid #ddd; padding-bottom: 3px; }
        p { margin: 8px 0; font-size: 14px; }
        .label { font-weight: bold; color: #475569; width: 150px; display: inline-block; }
        .value { color: #0f172a; }
        ul { padding-left: 20px; }
        li { margin-bottom: 5px; font-size: 14px; }
        .script-section { background-color: #f8fafc; border-left: 3px solid #cbd5e1; padding: 10px; margin-bottom: 10px; }
      </style>
    </head>
    <body>
      <h1>SocialBuddy AI Content Report</h1>
      <p><b>Generated:</b> ${new Date().toLocaleString()}</p>
      
      <h2>Content Identity</h2>
      <p><span class="label">Content Type:</span> <span class="value">${a.contentType}</span></p>
      <p><span class="label">Detected Platform:</span> <span class="value">${a.detectedPlatform}</span></p>
      <p><span class="label">Word Count:</span> <span class="value">${a.wordCount}</span></p>
      <p><span class="label">Reading Time:</span> <span class="value">${a.estimatedReadingTime}</span></p>

      <h2>Engagement Metrics</h2>
      <p><span class="label">Engagement Score:</span> <span class="value"><b>${a.engagementScore} / 100</b></span></p>
      <p><span class="label">Estimated Reach:</span> <span class="value">${a.estimatedReach}</span></p>
      <p><span class="label">Virality Potential:</span> <span class="value">${a.viralityPotential}</span></p>

      <h2>Content Quality</h2>
      <p><span class="label">Tone:</span> <span class="value">${a.tone}</span></p>
      <p><span class="label">Sentiment:</span> <span class="value">${a.sentiment}</span></p>
      <p><span class="label">Readability:</span> <span class="value">${a.readability}</span></p>
      <p><span class="label">Hook Strength:</span> <span class="value">${a.hookStrength}</span></p>
      <p><span class="label">Call To Action:</span> <span class="value">${a.cta}</span></p>
      <p><span class="label">Grammar:</span> <span class="value">${a.grammar || '—'}</span></p>
      <p><span class="label">Professionalism:</span> <span class="value">${a.professionalism || '—'}</span></p>

      <h2>AI Suggestions</h2>
      <ul>
        ${a.suggestions.map(s => `<li>${s}</li>`).join('')}
      </ul>

      <h2>AI-Generated Caption</h2>
      <p style="background: #f5f3ff; border: 1px solid #ddd; padding: 12px; font-style: italic;">
        ${a.caption ? a.caption.replace(/\n/g, '<br/>') : '—'}
      </p>
      <p><span class="label">Caption CTA:</span> <span class="value">${a.callToAction || '—'}</span></p>
      <p><span class="label">Hashtags:</span> <span class="value">${(a.recommendedHashtags ?? []).join(' ')}</span></p>

      ${a.reelScript ? `
      <h2>Reel Script</h2>
      <div class="script-section">
        ${a.reelScript.replace(/\n/g, '<br/>')}
      </div>
      ` : ''}

      <h2>AI-Optimized Post</h2>
      <p style="background: #f0fdf4; border: 1px solid #dcfce7; padding: 12px; white-space: pre-wrap;">
        ${a.improvedPost ? a.improvedPost.replace(/\n/g, '<br/>') : '—'}
      </p>

      <h2>Posting Schedule</h2>
      <ul>
        ${a.postingSchedule.map(s => `<li>${s}</li>`).join('')}
      </ul>

      <h2>Content Ideas for Your Niche</h2>
      <ul>
        ${a.contentIdeas.map(s => `<li>${s}</li>`).join('')}
      </ul>
    </body>
    </html>
  `;
  const blob = new Blob(['\ufeff' + content], { type: 'application/msword' });
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = url;
  link.download = `SocialBuddy_Report_${Date.now()}.doc`;
  link.click();
  URL.revokeObjectURL(url);
}

const SAMPLE_PREVIEWS = [
  {
    id: 0,
    image: 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?auto=format&fit=crop&w=600&q=80',
    title: 'Visual Branding Graphic',
    postText: 'Struggling to scale your marketing? Stop guessing and start growing with our proven system. We break down the pillars of sustainable growth into one actionable guide.',
    analysis: {
      contentType: 'Advertisement',
      detectedPlatform: 'Instagram',
      engagementScore: 92,
      estimatedReach: 'High (50K–100K+)',
      viralityPotential: 'High',
      tone: 'Inspiring & Bold',
      sentiment: 'Positive',
      readability: 'Easy',
      hookStrength: 'Strong',
      suggestions: [
        'Add a direct link to bio in caption',
        'Use key bullet points to highlight values',
        'Include high-contrast color highlights'
      ],
      improvedPost: 'Ready to scale? 🚀 Our free guide breaks down onboarding, churn reduction, and expansion revenue. Get the blueprint now! 👇'
    }
  },
  {
    id: 1,
    image: 'https://images.unsplash.com/photo-1620712943543-bcc4688e7485?auto=format&fit=crop&w=600&q=80',
    title: 'Tech & AI Optimization',
    postText: 'Announcing our new machine learning engine! We leverage advanced neural networks to process queries with sub-millisecond latency. Try it today.',
    analysis: {
      contentType: 'Promotional Post',
      detectedPlatform: 'LinkedIn',
      engagementScore: 88,
      estimatedReach: 'Medium (10K–30K)',
      viralityPotential: 'Medium',
      tone: 'Professional & Tech',
      sentiment: 'Positive',
      readability: 'Medium',
      hookStrength: 'Average',
      suggestions: [
        'Open with a specific problem or stat',
        'Add visual emojis to technical terms',
        'Call out developer benefits directly'
      ],
      improvedPost: 'Sub-millisecond API latency is here. ⚡ Our new ML engine processes data in real-time. See how we did it in our case study!'
    }
  },
  {
    id: 2,
    image: 'https://images.unsplash.com/photo-1611162617213-7d7a39e9b1d7?auto=format&fit=crop&w=600&q=80',
    title: 'Analytics Dashboard',
    postText: 'Check out our new dashboard! See your conversion rates, traffic sources, and monthly recurring revenue (MRR) all in one clean user interface.',
    analysis: {
      contentType: 'Product Post',
      detectedPlatform: 'General Marketing',
      engagementScore: 84,
      estimatedReach: 'Medium (5K-20K)',
      viralityPotential: 'High',
      tone: 'Informative',
      sentiment: 'Positive',
      readability: 'Easy',
      hookStrength: 'Strong',
      suggestions: [
        'Highlight one major metric visual',
        'Invite user questions in comments',
        'Include target pricing or a trial offer'
      ],
      improvedPost: 'Every SaaS metric you care about, in one gorgeous dashboard. 📊 Track MRR, churn, and conversion rates without context switching.'
    }
  }
];

/* ─── App ─────────────────────────────────────────────────────────────────── */
function App() {
  const [loading,     setLoading]     = useState(false);
  const [loadingStep, setLoadingStep] = useState(0);
  const [analysis,   setAnalysis]     = useState<AnalysisResult | null>(null);
  const [ocrNotice,   setOcrNotice]    = useState<boolean>(false);
  const [error,      setError]        = useState<string | null>(null);
  const [activeTab,  setActiveTab]    = useState<ActiveTab>('analyzer');

  // Strategy Modal states
  const [isStrategyOpen, setIsStrategyOpen] = useState(false);
  const [selectedFile,   setSelectedFile]   = useState<File | null>(null);

  // Dropdown states
  const [downloadDropdownOpen, setDownloadDropdownOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  // Document states
  const [isDocOpen,  setIsDocOpen]    = useState(false);
  const [activeDoc,  setActiveDoc]    = useState<DocType | null>(null);

  // Close dropdown on click outside
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setDownloadDropdownOpen(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // Redesigned homepage states
  const [expandedFaq, setExpandedFaq] = useState<number | null>(null);
  const [sampleIndex, setSampleIndex] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setSampleIndex((prev) => (prev + 1) % SAMPLE_PREVIEWS.length);
    }, 5000);
    return () => clearInterval(interval);
  }, []);

  const startLoadingSimulation = () => {
    setLoading(true);
    setLoadingStep(0);
    const t1 = setTimeout(() => setLoadingStep(1), 600);
    const t2 = setTimeout(() => setLoadingStep(2), 1400);
    const t3 = setTimeout(() => setLoadingStep(3), 2200);
    const t4 = setTimeout(() => setLoadingStep(4), 3200);
    const t5 = setTimeout(() => setLoadingStep(5), 4500);
    const t6 = setTimeout(() => setLoadingStep(6), 5800);
    return [t1, t2, t3, t4, t5, t6];
  };

  const handleFileUpload = async (file: File, campaignGoal?: string, targetAudience?: string, tonePreference?: string) => {
    setError(null);
    setOcrNotice(false);
    const timers = startLoadingSimulation();
    try {
      const response = await analyzeContent(file, campaignGoal, targetAudience, tonePreference);
      timers.forEach(clearTimeout);
      setAnalysis(response.analysis);
      if (response.ocrFailed) {
        setOcrNotice(true);
      }
      setActiveTab('analyzer');
    } catch (err) {
      timers.forEach(clearTimeout);
      let msg = 'Failed to analyze the content. Please try again.';
      if (axios.isAxiosError(err) && err.response?.data) {
        msg = (err.response.data as ApiError).message || msg;
      } else if (err instanceof Error) {
        msg = err.message;
      }
      setError(msg);
    } finally {
      setLoading(false);
    }
  };

  const handleFileAccepted = (file: File) => {
    setSelectedFile(file);
    setIsStrategyOpen(true);
  };

  const resetState = () => {
    setAnalysis(null);
    setOcrNotice(false);
    setError(null);
    setSelectedFile(null);
    setIsStrategyOpen(false);
    setActiveTab('analyzer');
  };

  const openDocument = (type: DocType) => {
    setActiveDoc(type);
    setIsDocOpen(true);
  };

  const downloadImageReport = async () => {
    const element = document.getElementById('analyzer-dashboard-content');
    if (!element) return;

    try {
      const canvas = await html2canvas(element, {
        scale: 2,
        useCORS: true,
        backgroundColor: '#F8FAFC',
      });
      const imgData = canvas.toDataURL('image/png');
      const link = document.createElement('a');
      link.href = imgData;
      link.download = `SocialBuddy_Dashboard_${Date.now()}.png`;
      link.click();
    } catch (err) {
      console.error('Failed to capture dashboard image', err);
    }
  };

  const tabs: { id: ActiveTab; label: string; icon: React.ReactNode }[] = [
    { id: 'analyzer', label: 'Analysis', icon: <BarChart2   className="w-4 h-4" /> },
    { id: 'planner',  label: 'Planner',  icon: <CalendarDays className="w-4 h-4" /> },
  ];

  const isReel = analysis
    ? /reel|story/i.test(analysis.contentType)
    : false;

  return (
    <div className="min-h-screen flex flex-col bg-mesh text-slate-800 relative">
      {/* Background Floating Social Doodles */}
      {!analysis && (
        <div className="absolute inset-0 overflow-hidden pointer-events-none z-0 opacity-[0.06]">
          {/* Top Left */}
          <div className="absolute top-[12%] left-[10%] animate-float">
            <Heart className="w-12 h-12 text-indigo-600 fill-indigo-600/10" />
          </div>
          <div className="absolute top-[28%] left-[5%] animate-float-reverse">
            <MessageCircle className="w-16 h-16 text-purple-600" />
          </div>
          <div className="absolute top-[48%] left-[12%] animate-float">
            <Share2 className="w-10 h-10 text-indigo-500" />
          </div>
          <div className="absolute top-[75%] left-[8%] animate-float-reverse">
            <ThumbsUp className="w-14 h-14 text-purple-500 fill-purple-500/10" />
          </div>

          {/* Top Right */}
          <div className="absolute top-[15%] right-[8%] animate-float-reverse">
            <Send className="w-12 h-12 text-purple-600" />
          </div>
          <div className="absolute top-[32%] right-[12%] animate-float">
            <Sparkle className="w-16 h-16 text-indigo-600 fill-indigo-600/10" />
          </div>
          <div className="absolute top-[55%] right-[6%] animate-float-reverse">
            <MessageCircle className="w-10 h-10 text-purple-500" />
          </div>
          <div className="absolute top-[72%] right-[15%] animate-float">
            <Heart className="w-14 h-14 text-indigo-500 fill-indigo-500/10" />
          </div>
        </div>
      )}

      <Navbar onLogoClick={resetState} />

      <main className="flex-1 max-w-6xl w-full mx-auto px-4 sm:px-6 py-10 flex flex-col z-10">

        {/* ── REDESIGNED HOMEPAGE ── */}
        {!analysis ? (
          <div className="animate-fadeIn space-y-16">
            
            {/* 1. Hero Section */}
            <section className="min-h-[50vh] lg:min-h-[55vh] flex flex-col items-center justify-center text-center py-6 relative overflow-hidden">
              <div className="absolute inset-0 bg-gradient-to-b from-indigo-500/5 via-purple-500/5 to-transparent pointer-events-none" />
              <div className="max-w-3xl mx-auto relative z-10">
                <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-indigo-50 border border-indigo-100 text-indigo-600 text-xs font-black mb-6 uppercase tracking-wider">
                  <span className="w-1.5 h-1.5 rounded-full bg-indigo-500 animate-pulse" />
                  AI-Powered · Real-time Analysis
                </div>
                <h1 className="text-4xl sm:text-5xl lg:text-6xl font-black tracking-tight text-slate-800 mb-6 leading-tight">
                  Turn Social Posts into{' '}
                  <span className="bg-gradient-to-r from-indigo-600 via-purple-600 to-indigo-500 bg-clip-text text-transparent">
                    High-Engagement Content
                  </span>
                </h1>
                <p className="text-slate-500 text-base sm:text-lg leading-relaxed font-medium mb-8 max-w-2xl mx-auto">
                  Upload PDFs or Images to receive AI-powered engagement insights, captions, scripts, and niche-targeted improvement suggestions.
                </p>
                <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
                  <a
                    href="#upload-analyzer"
                    className="w-full sm:w-auto px-6 py-3 rounded-xl bg-gradient-to-r from-indigo-600 to-purple-600 text-white font-bold text-sm shadow-md shadow-indigo-500/20 hover:scale-[1.02] active:scale-[0.98] transition-all cursor-pointer text-center"
                  >
                    Analyze Your Post
                  </a>
                  <a
                    href="#sample-preview"
                    className="w-full sm:w-auto px-6 py-3 rounded-xl bg-white border border-slate-200 text-slate-700 hover:text-indigo-600 hover:border-indigo-100 hover:bg-slate-50/50 font-bold text-sm transition-all cursor-pointer text-center"
                  >
                    View Sample Audit
                  </a>
                </div>
              </div>
            </section>

            {/* 2. Trusted Features */}
            <section className="py-6 border-t border-slate-100/80">
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                {[
                  { title: 'AI-Powered Vision', desc: 'Analyzes visual composition, layout aesthetics, and design hierarchy.', icon: <Sparkle className="w-5 h-5 text-indigo-600" /> },
                  { title: 'Targeted Personas', desc: 'Tailors tone, copy rewrites, and schedules to your exact niche and audience.', icon: <Heart className="w-5 h-5 text-purple-600" /> },
                  { title: 'Deep Text Parsing', desc: 'Extracts post copy, scripts, and content from images and PDFs using advanced OCR.', icon: <FileText className="w-5 h-5 text-indigo-600" /> },
                  { title: 'Flexible Formats', desc: 'Instantly download high-quality reports in PDF, Microsoft Word, or PNG dashboard.', icon: <Download className="w-5 h-5 text-purple-600" /> },
                ].map((feat, idx) => (
                  <div key={idx} className="bg-white/80 backdrop-blur-sm border border-indigo-50/50 p-5 rounded-2xl shadow-sm hover:shadow-md hover:scale-[1.01] transition-all duration-300 flex flex-col items-start select-none">
                    <div className="p-2 bg-indigo-50/50 rounded-xl mb-3.5">
                      {feat.icon}
                    </div>
                    <h3 className="font-bold text-slate-800 text-sm mb-1">{feat.title}</h3>
                    <p className="text-[11px] text-slate-500 leading-relaxed font-semibold">{feat.desc}</p>
                  </div>
                ))}
              </div>
            </section>

            {/* 3. Upload Analyzer */}
            <section id="upload-analyzer" className="py-8 scroll-mt-20">
              <div className="max-w-2xl mx-auto text-center mb-8">
                <h2 className="text-2xl sm:text-3xl font-black text-slate-800 mb-2">Upload Analyzer</h2>
                <p className="text-sm text-slate-400 font-semibold">Drop your image or PDF below to scan engagement quality instantly</p>
              </div>

              {error && (
                <div className="mb-6 w-full max-w-md mx-auto bg-red-50 border border-red-200 text-red-600 p-4 rounded-2xl flex items-start gap-3 animate-scaleIn">
                  <AlertTriangle className="w-5 h-5 flex-shrink-0 mt-0.5" />
                  <div>
                    <p className="font-bold text-sm">Analysis Failed</p>
                    <p className="text-xs text-red-700 mt-0.5 leading-relaxed">{error}</p>
                  </div>
                </div>
              )}

              {loading && <LoadingOverlay step={loadingStep} />}

              {!loading && (
                <div className="w-full max-w-md mx-auto animate-scaleIn">
                  <UploadCard onFileAccepted={handleFileAccepted} onError={(msg) => setError(msg)} />
                </div>
              )}
            </section>

            {/* 4. How It Works */}
            <section className="py-8 border-t border-slate-100/80">
              <div className="text-center mb-10">
                <h2 className="text-2xl sm:text-3xl font-black text-slate-800 mb-2">How It Works</h2>
                <p className="text-sm text-slate-400 font-semibold max-w-md mx-auto">Get full strategist analysis and content ideas in 4 simple stages</p>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                {[
                  { step: '01', title: 'Upload Draft', desc: 'Drag and drop your post images (PNG/JPG) or promotional PDF documents.' },
                  { step: '02', title: 'Set Strategy', desc: 'Specify campaign goals, target audience demographics, and brand tone.' },
                  { step: '03', title: 'AI Processing', desc: 'SocialBuddy extracts text copy, evaluates design, and processes strategic optimization.' },
                  { step: '04', title: 'Scale Engagement', desc: 'Export high-converting caption rewrites, post ideas, scripts, and posting calendars.' }
                ].map((step, idx) => (
                  <div key={idx} className="relative bg-white/70 backdrop-blur-sm border border-slate-100 p-6 rounded-2xl shadow-sm hover:shadow-md transition-all select-none">
                    <span className="absolute -top-3 left-6 text-3xl font-black bg-gradient-to-r from-indigo-600/10 to-purple-600/10 bg-clip-text text-transparent">{step.step}</span>
                    <h3 className="font-bold text-slate-800 text-sm mb-1.5 mt-2">{step.title}</h3>
                    <p className="text-[11px] text-slate-500 leading-relaxed font-semibold">{step.desc}</p>
                  </div>
                ))}
              </div>
            </section>

            {/* 5. What We Analyze */}
            <section className="py-8 border-t border-slate-100/80">
              <div className="text-center mb-10">
                <h2 className="text-2xl sm:text-3xl font-black text-slate-800 mb-2">What We Analyze</h2>
                <p className="text-sm text-slate-400 font-semibold max-w-md mx-auto">Comprehensive 9-dimensional checks for maximum post performance</p>
              </div>
              
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                {[
                  { title: 'Engagement Score', desc: 'Predicted audience resonance model scored out of 100.', tag: 'Core Metric' },
                  { title: 'Sentiment Analysis', desc: 'Detection of positive, negative, or neutral emotional tone.', tag: 'Emotional Hook' },
                  { title: 'Readability Level', desc: 'Flesch-Kincaid style layout parsing for text clarity and flow.', tag: 'Copywriting' },
                  { title: 'Hook Strength', desc: 'Analysis of the opening line capability to stop user scroll.', tag: 'Attention' },
                  { title: 'Call To Action (CTA)', desc: 'Validates existence and alignment of CTA link triggers.', tag: 'Conversion' },
                  { title: 'Grammar & Tone', desc: 'Typos check and tone-of-voice compliance audit.', tag: 'Quality' },
                  { title: 'Virality Potential', desc: 'Predictive assessment of shareable hooks and concepts.', tag: 'Growth' },
                  { title: 'Keyword Density', desc: 'SEO and algorithm indexing density check.', tag: 'SEO & Reach' },
                  { title: 'Emoji & Hashtag Density', desc: 'Appropriate visual break and discoverability score.', tag: 'Metadata' }
                ].map((item, idx) => (
                  <div key={idx} className="bg-white/70 backdrop-blur-sm border border-slate-100/80 p-5 rounded-2xl hover:border-indigo-100 hover:shadow-md transition-all group select-none">
                    <span className="text-[9px] uppercase font-bold tracking-wider px-2 py-0.5 rounded-full bg-slate-50 text-indigo-600 border border-slate-100 group-hover:bg-indigo-50 group-hover:border-indigo-100 transition-colors">
                      {item.tag}
                    </span>
                    <h3 className="font-bold text-slate-800 text-sm mb-1.5 mt-3">{item.title}</h3>
                    <p className="text-[11px] text-slate-500 leading-relaxed font-semibold">{item.desc}</p>
                  </div>
                ))}
              </div>
            </section>

            {/* 6. Sample Dashboard Preview */}
            <section id="sample-preview" className="py-8 border-t border-slate-100/80 scroll-mt-20">
              <div className="text-center mb-10">
                <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-indigo-50 text-indigo-600 text-xs font-bold mb-3">
                  <Sparkle className="w-3.5 h-3.5" /> Live Sandbox Preview
                </div>
                <h2 className="text-2xl sm:text-3xl font-black text-slate-800 mb-2">Sample Dashboard Preview</h2>
                <p className="text-sm text-slate-400 font-semibold max-w-md mx-auto">Interact with live demo mockups generated by our AI strategist engine</p>
              </div>
              
              <div className="bg-white border border-indigo-50/50 rounded-3xl p-6 md:p-8 shadow-xl shadow-indigo-500/[0.01] grid grid-cols-1 lg:grid-cols-12 gap-8 items-stretch">
                {/* Left Column: Sample input & rotation */}
                <div className="lg:col-span-5 flex flex-col justify-between space-y-6">
                  <div>
                    <div className="flex items-center justify-between mb-4">
                      <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Sample Post</span>
                      <span className="text-[10px] font-bold text-indigo-600 bg-indigo-50 px-2 py-0.5 rounded-full animate-pulse">Rotating Live</span>
                    </div>
                    
                    {/* Carousel image container */}
                    <div className="relative rounded-2xl overflow-hidden aspect-video shadow-sm border border-slate-100 mb-4 bg-slate-50">
                      <img
                        src={SAMPLE_PREVIEWS[sampleIndex].image}
                        alt={SAMPLE_PREVIEWS[sampleIndex].title}
                        className="w-full h-full object-cover transition-all duration-700 ease-in-out scale-100 hover:scale-102"
                      />
                      <div className="absolute bottom-3 left-3 bg-slate-900/80 backdrop-blur-sm text-white text-[9px] font-bold px-2 py-0.5 rounded-md">
                        {SAMPLE_PREVIEWS[sampleIndex].title}
                      </div>
                    </div>

                    {/* Caption */}
                    <div className="bg-slate-50/80 border border-slate-100 rounded-xl p-4 min-h-[90px] select-text">
                      <span className="text-[9px] uppercase font-bold text-slate-400 block mb-1">Post Draft</span>
                      <p className="text-xs text-slate-600 leading-relaxed font-semibold italic">
                        "{SAMPLE_PREVIEWS[sampleIndex].postText}"
                      </p>
                    </div>
                  </div>

                  {/* Manual switch tabs */}
                  <div className="flex items-center gap-2">
                    {SAMPLE_PREVIEWS.map((sample) => (
                      <button
                        key={sample.id}
                        onClick={() => setSampleIndex(sample.id)}
                        className={`flex-1 text-center py-2 px-3 rounded-xl text-[10px] font-bold transition-all border ${
                          sampleIndex === sample.id
                            ? 'bg-indigo-600 border-indigo-600 text-white shadow-md shadow-indigo-600/10'
                            : 'bg-white border-slate-200 text-slate-500 hover:bg-slate-50'
                        }`}
                      >
                        Demo {sample.id + 1}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Right Column: Simulated Analysis dashboard results */}
                <div className="lg:col-span-7 bg-slate-50/50 border border-slate-100 rounded-2xl p-5 md:p-6 flex flex-col justify-between">
                  <div className="select-text">
                    <div className="flex items-center justify-between border-b border-slate-100 pb-3 mb-4">
                      <div className="flex items-center gap-2">
                        <div className="w-2 h-2 rounded-full bg-emerald-500" />
                        <span className="font-bold text-slate-800 text-xs sm:text-sm">Analysis Results</span>
                      </div>
                      <span className="text-[10px] font-bold text-slate-400 bg-white border border-slate-200 px-2 py-0.5 rounded-lg">
                        {SAMPLE_PREVIEWS[sampleIndex].analysis.contentType} ({SAMPLE_PREVIEWS[sampleIndex].analysis.detectedPlatform})
                      </span>
                    </div>

                    <div className="grid grid-cols-2 sm:grid-cols-4 gap-3.5 mb-4">
                      <div className="bg-white border border-slate-100 p-3 rounded-xl text-center shadow-sm">
                        <span className="text-[9px] font-bold text-slate-400 block mb-1">Score</span>
                        <span className="text-lg font-black text-indigo-600">{SAMPLE_PREVIEWS[sampleIndex].analysis.engagementScore}</span>
                      </div>
                      <div className="bg-white border border-slate-100 p-3 rounded-xl text-center shadow-sm">
                        <span className="text-[9px] font-bold text-slate-400 block mb-1">Tone</span>
                        <span className="text-[10px] font-bold text-slate-700 block truncate mt-1">{SAMPLE_PREVIEWS[sampleIndex].analysis.tone}</span>
                      </div>
                      <div className="bg-white border border-slate-100 p-3 rounded-xl text-center shadow-sm">
                        <span className="text-[9px] font-bold text-slate-400 block mb-1">Reach</span>
                        <span className="text-[10px] font-bold text-slate-700 block truncate mt-1">{SAMPLE_PREVIEWS[sampleIndex].analysis.estimatedReach.split(' ')[0]}</span>
                      </div>
                      <div className="bg-white border border-slate-100 p-3 rounded-xl text-center shadow-sm">
                        <span className="text-[9px] font-bold text-slate-400 block mb-1">Hook</span>
                        <span className="text-[10px] font-bold text-emerald-600 block mt-1">{SAMPLE_PREVIEWS[sampleIndex].analysis.hookStrength}</span>
                      </div>
                    </div>

                    <div className="space-y-3">
                      <div className="bg-white border border-slate-100 p-3.5 rounded-xl shadow-sm">
                        <span className="text-[9px] uppercase font-bold text-indigo-600 block mb-1.5">AI Suggestion</span>
                        <ul className="space-y-1">
                          {SAMPLE_PREVIEWS[sampleIndex].analysis.suggestions.slice(0, 2).map((sug, i) => (
                            <li key={i} className="text-[11px] text-slate-600 font-semibold flex items-center gap-1.5">
                              <span className="w-1 h-1 rounded-full bg-indigo-500 flex-shrink-0" />
                              <span className="truncate">{sug}</span>
                            </li>
                          ))}
                        </ul>
                      </div>

                      <div className="bg-white border border-emerald-50/50 p-3.5 rounded-xl shadow-sm">
                        <span className="text-[9px] uppercase font-bold text-emerald-600 block mb-1">Optimized Rewrite</span>
                        <p className="text-[11px] text-slate-700 leading-relaxed font-semibold italic">
                          "{SAMPLE_PREVIEWS[sampleIndex].analysis.improvedPost}"
                        </p>
                      </div>
                    </div>
                  </div>

                  <button
                    onClick={() => {
                      setAnalysis({
                        contentType: SAMPLE_PREVIEWS[sampleIndex].analysis.contentType,
                        detectedPlatform: SAMPLE_PREVIEWS[sampleIndex].analysis.detectedPlatform,
                        engagementScore: SAMPLE_PREVIEWS[sampleIndex].analysis.engagementScore,
                        estimatedReach: SAMPLE_PREVIEWS[sampleIndex].analysis.estimatedReach,
                        viralityPotential: SAMPLE_PREVIEWS[sampleIndex].analysis.viralityPotential,
                        tone: SAMPLE_PREVIEWS[sampleIndex].analysis.tone,
                        sentiment: SAMPLE_PREVIEWS[sampleIndex].analysis.sentiment,
                        readability: SAMPLE_PREVIEWS[sampleIndex].analysis.readability,
                        hookStrength: SAMPLE_PREVIEWS[sampleIndex].analysis.hookStrength,
                        cta: 'Actionable Link',
                        grammar: 'Excellent',
                        professionalism: 'High',
                        hashtags: 4,
                        emojiUsage: 'Medium',
                        wordCount: 45,
                        estimatedReadingTime: '20 seconds',
                        keywordDensity: 'Optimal',
                        suggestions: SAMPLE_PREVIEWS[sampleIndex].analysis.suggestions,
                        improvedPost: SAMPLE_PREVIEWS[sampleIndex].analysis.improvedPost,
                        caption: SAMPLE_PREVIEWS[sampleIndex].postText,
                        callToAction: 'Click to learn more',
                        recommendedHashtags: ['#SaaSGrowth', '#AIMarketing', '#SocialStrategy'],
                        reelScript: 'HOOK: Ready to scale your SaaS?\nSCENE 1: View of flat charts.\nSCENE 2: The 4 pillars guide download.\nCALL TO ACTION: Click bio!',
                        postingSchedule: [
                          'Tuesday 10:00 AM - Peak B2B professional activity',
                          'Wednesday 2:00 PM - Mid-week decision-making window',
                          'Thursday 9:00 AM - High engagement for industry insights'
                        ],
                        contentIdeas: [
                          'A deep-dive video series on product growth metrics.',
                          'Case study showcasing a team executing the roadmap.',
                          'Interactive checklist audit infographic.'
                        ]
                      });
                    }}
                    className="w-full mt-4 bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-[10px] py-2.5 rounded-xl flex items-center justify-center gap-1.5 shadow-md shadow-indigo-600/10 hover:shadow-indigo-600/20 active:scale-[0.99] transition-all cursor-pointer"
                  >
                    Load Full Sandbox Dashboard
                  </button>
                </div>
              </div>
            </section>

            {/* 7. Why Choose SocialBuddy AI */}
            <section className="py-8 border-t border-slate-100/80">
              <div className="text-center mb-10">
                <h2 className="text-2xl sm:text-3xl font-black text-slate-800 mb-2">Why Choose SocialBuddy AI</h2>
                <p className="text-sm text-slate-400 font-semibold max-w-md mx-auto">Backed by real metrics and performance boosts</p>
              </div>
              
              <div className="grid grid-cols-2 lg:grid-cols-4 gap-6">
                {[
                  { stat: '85%', label: 'Avg Engagement Lift', desc: 'Lift in likes, comments, and shares across audited channels.' },
                  { stat: '10x', label: 'Faster Strategy Cycle', desc: 'Reduce campaign concept planning time to seconds.' },
                  { stat: '50k+', label: 'Social Posts Scored', desc: 'Deep learning intelligence model tuned on verified templates.' },
                  { stat: '99.8%', label: 'AI Strategy Uptime', desc: 'Fault-tolerant processing frameworks handling global volume.' }
                ].map((stat, idx) => (
                  <div key={idx} className="bg-white/80 backdrop-blur-sm border border-indigo-50/30 p-5 rounded-2xl text-center shadow-sm hover:shadow-md transition-all select-none">
                    <span className="text-2xl sm:text-3xl font-black bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent block mb-1">
                      {stat.stat}
                    </span>
                    <h4 className="font-bold text-slate-800 text-xs mb-1">{stat.label}</h4>
                    <p className="text-[10px] text-slate-400 font-semibold leading-relaxed">{stat.desc}</p>
                  </div>
                ))}
              </div>
            </section>

            {/* 8. FAQ */}
            <section className="py-8 border-t border-slate-100/80">
              <div className="text-center mb-10">
                <h2 className="text-2xl sm:text-3xl font-black text-slate-800 mb-2">Frequently Asked Questions</h2>
                <p className="text-sm text-slate-400 font-semibold max-w-md mx-auto">Answers to common queries regarding security, models, and usage</p>
              </div>
              
              <div className="max-w-2xl mx-auto space-y-3.5">
                {[
                  {
                    q: 'What file formats are supported for upload?',
                    a: 'You can upload documents in PDF format or image files in PNG, JPG, or JPEG format, up to a maximum file size of 10 MB.'
                  },
                  {
                    q: 'How does the AI analyze my visual content?',
                    a: 'We leverage OCR to extract direct text copy. Additionally, we pass raw image bytes to Gemini Vision to assess design layout, branding hierarchy, visual subject matter, and color theme context.'
                  },
                  {
                    q: 'Can I export the audit reports?',
                    a: 'Yes. You can download complete reports as PDF files, Microsoft Word (.doc) templates, or save a full dashboard snapshot as a PNG image.'
                  },
                  {
                    q: 'Is my data and uploads kept secure?',
                    a: 'Absolutely. We process uploads directly inside transient memory and do not permanently persist or utilize your private post designs to train public LLM models.'
                  }
                ].map((faq, idx) => (
                  <div key={idx} className="bg-white border border-slate-100 rounded-2xl overflow-hidden shadow-sm hover:shadow-md transition-all">
                    <button
                      onClick={() => setExpandedFaq(expandedFaq === idx ? null : idx)}
                      className="w-full flex items-center justify-between p-4.5 text-left font-bold text-slate-800 text-xs sm:text-sm hover:bg-slate-50/50 transition-colors"
                    >
                      <span>{faq.q}</span>
                      <ChevronDown className={`w-3.5 h-3.5 text-slate-400 transition-transform duration-200 ${expandedFaq === idx ? 'rotate-180' : ''}`} />
                    </button>
                    {expandedFaq === idx && (
                      <div className="px-5 pb-4.5 pt-1 border-t border-slate-50 text-[11px] text-slate-500 leading-relaxed font-semibold select-text">
                        {faq.a}
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </section>
          </div>
        ) : (
          /* ── RESULTS VIEW ── */
          <div className="animate-fadeUp space-y-6">

            {/* Action bar */}
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 relative">
              <button
                id="btn-upload-another"
                onClick={resetState}
                className="flex items-center gap-2 text-sm font-bold text-slate-500 hover:text-indigo-600 transition-colors group cursor-pointer"
              >
                <ArrowLeft className="w-4 h-4 group-hover:-translate-x-0.5 transition-transform" />
                Upload Another Post
              </button>

              {/* Multi-Format Download Dropdown */}
              <div className="relative" ref={dropdownRef}>
                <button
                  id="btn-download-dropdown"
                  onClick={() => setDownloadDropdownOpen(!downloadDropdownOpen)}
                  className="flex items-center gap-2 bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 text-white font-bold px-5 py-2.5 rounded-xl text-sm shadow-md shadow-indigo-500/10 hover:scale-[1.02] active:scale-[0.98] transition-all duration-200 cursor-pointer"
                >
                  <Download className="w-4 h-4" />
                  <span>Download Report</span>
                  <ChevronDown className={`w-4 h-4 ml-1 transition-transform duration-200 ${downloadDropdownOpen ? 'rotate-180' : ''}`} />
                </button>

                {downloadDropdownOpen && (
                  <div className="absolute right-0 mt-2 w-56 rounded-2xl bg-white border border-indigo-100 shadow-xl py-2 z-30 animate-scaleIn">
                    <button
                      onClick={() => {
                        generatePdfReport(analysis);
                        setDownloadDropdownOpen(false);
                      }}
                      className="w-full flex items-center gap-3 px-4 py-2.5 text-sm text-slate-700 hover:bg-indigo-50 hover:text-indigo-600 font-semibold text-left transition-colors cursor-pointer"
                    >
                      <FileText className="w-4 h-4 text-indigo-600" />
                      <span>Download as PDF (.pdf)</span>
                    </button>

                    <button
                      onClick={() => {
                        generateWordReport(analysis);
                        setDownloadDropdownOpen(false);
                      }}
                      className="w-full flex items-center gap-3 px-4 py-2.5 text-sm text-slate-700 hover:bg-indigo-50 hover:text-indigo-600 font-semibold text-left transition-colors cursor-pointer"
                    >
                      <FileText className="w-4 h-4 text-purple-600" />
                      <span>Download as Word (.doc)</span>
                    </button>

                    <button
                      onClick={() => {
                        downloadImageReport();
                        setDownloadDropdownOpen(false);
                      }}
                      className="w-full flex items-center gap-3 px-4 py-2.5 text-sm text-slate-700 hover:bg-indigo-50 hover:text-indigo-600 font-semibold text-left transition-colors cursor-pointer"
                    >
                      <ImageIcon className="w-4 h-4 text-indigo-600" />
                      <span>Download Dashboard (PNG)</span>
                    </button>
                  </div>
                )}
              </div>
            </div>

            {/* Inline error */}
            {error && (
              <div className="bg-red-50 border border-red-200 text-red-600 p-4 rounded-2xl flex items-start gap-3">
                <AlertTriangle className="w-5 h-5 flex-shrink-0 mt-0.5" />
                <p className="text-sm">{error}</p>
              </div>
            )}

            {/* Inline OCR failure notice */}
            {ocrNotice && (
              <div className="bg-amber-50 border border-amber-200 text-amber-800 p-4 rounded-2xl flex items-start gap-3 animate-scaleIn shadow-sm">
                <AlertTriangle className="w-5 h-5 flex-shrink-0 text-amber-500 mt-0.5" />
                <div>
                  <p className="font-bold text-sm">No Readable Text Detected</p>
                  <p className="text-xs text-amber-700 mt-0.5 leading-relaxed">
                    We couldn't extract any text copy from the image. Don't worry — we passed the image directly to <strong>Gemini Vision</strong> to analyze the visual composition, branding, subject intent, and layout.
                  </p>
                </div>
              </div>
            )}

            {/* ── TAB BAR ── */}
            <div className="flex gap-1 bg-white border border-indigo-50 rounded-2xl p-1 w-fit shadow-sm">
              {tabs.map((tab) => (
                <button
                  key={tab.id}
                  id={`tab-${tab.id}`}
                  onClick={() => setActiveTab(tab.id)}
                  className={`flex items-center gap-2 px-5 py-2 rounded-xl text-sm font-bold transition-all duration-200 cursor-pointer ${
                    activeTab === tab.id
                      ? 'bg-gradient-to-r from-indigo-600 to-purple-600 text-white shadow-sm'
                      : 'text-slate-500 hover:text-slate-800 hover:bg-indigo-50/50'
                  }`}
                >
                  {tab.icon}
                  {tab.label}
                  {tab.id === 'planner' && (
                    <span className="text-[10px] font-bold bg-indigo-400 text-white px-1.5 py-0.5 rounded-full ml-0.5">
                      NEW
                    </span>
                  )}
                </button>
              ))}
            </div>

            {/* ── ANALYZER TAB ── */}
            {activeTab === 'analyzer' && (
              <div id="analyzer-dashboard-content" className="space-y-5 animate-fadeUp p-1">

                {/* Row 1: Score + Content Summary + Analysis Breakdown */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
                  <ScoreCircle score={analysis.engagementScore} />
                  <ContentSummaryCard
                    contentType={analysis.contentType}
                    detectedPlatform={analysis.detectedPlatform}
                    wordCount={analysis.wordCount}
                    estimatedReadingTime={analysis.estimatedReadingTime}
                    estimatedReach={analysis.estimatedReach}
                    viralityPotential={analysis.viralityPotential}
                    keywordDensity={analysis.keywordDensity}
                  />
                  <ResultCard
                    tone={analysis.tone}
                    sentiment={analysis.sentiment}
                    readability={analysis.readability}
                    hook={analysis.hookStrength}
                    cta={analysis.cta}
                    hashtags={analysis.hashtags}
                    emojiUsage={analysis.emojiUsage}
                  />
                </div>

                {/* Row 2: Suggestions + Improved Post */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                  <SuggestionCard suggestions={analysis.suggestions} />
                  <ImprovedPost   content={analysis.improvedPost}   />
                </div>

                {/* Row 3: Generated Caption (always shown) */}
                <CaptionCard
                  caption={analysis.caption}
                  callToAction={analysis.callToAction}
                  recommendedHashtags={analysis.recommendedHashtags}
                />

                {/* Row 4: Reel Script (only when content is a Reel / Story) */}
                {isReel && analysis.reelScript && (
                  <ReelScriptCard script={analysis.reelScript} />
                )}
              </div>
            )}

            {/* ── PLANNER TAB ── */}
            {activeTab === 'planner' && (
              <div className="animate-fadeUp">
                <PlannerTab
                  postingSchedule={analysis.postingSchedule ?? []}
                  contentIdeas={analysis.contentIdeas ?? []}
                />
              </div>
            )}
          </div>
        )}
      </main>

      <Footer onOpenDoc={openDocument} />

      {/* Document Modal */}
      <DocumentModal isOpen={isDocOpen} docType={activeDoc} onClose={() => setIsDocOpen(false)} />

      {/* Strategy Modal */}
      <StrategyModal
        isOpen={isStrategyOpen}
        fileName={selectedFile?.name || ''}
        onClose={() => {
          setIsStrategyOpen(false);
          setSelectedFile(null);
        }}
        onSubmit={(goal, audience, tone) => {
          setIsStrategyOpen(false);
          if (selectedFile) {
            handleFileUpload(selectedFile, goal, audience, tone);
          }
        }}
      />
    </div>
  );
}

export default App;
