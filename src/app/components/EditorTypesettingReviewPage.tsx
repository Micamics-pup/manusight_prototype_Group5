import React, { useState } from 'react';
import {
  ArrowLeft,
  FileText,
  CheckCircle,
  Clock,
  AlertCircle,
  AlertTriangle,
  Download,
  Eye,
  Save,
  Send,
  RotateCcw,
  Paperclip,
  XCircle,
  Info,
  PauseCircle,
  BookOpen,
  CalendarClock,
  Activity,
  History,
  Bell,
  Layout,
  Type,
  AlignLeft,
  Layers,
  Upload,
} from 'lucide-react';
import type { Manuscript } from '../types';

interface EditorTypesettingReviewPageProps {
  manuscript: Manuscript;
  onBack: () => void;
}

type PageStatus =
  | 'under_review'
  | 'draft_saved'
  | 'awaiting_author'
  | 'returned_layout'
  | 'approved'
  | 'on_hold';

type ReviewDecision = 'send_author' | 'return_layout' | 'hold' | null;

interface ValidationItem {
  id: string;
  label: string;
  status: 'verified' | 'warning' | 'failed';
}

export function EditorTypesettingReviewPage({ manuscript, onBack }: EditorTypesettingReviewPageProps) {
  const [pageStatus, setPageStatus] = useState<PageStatus>('under_review');
  const [decision, setDecision] = useState<ReviewDecision>(null);
  const [showConfirmModal, setShowConfirmModal] = useState(false);
  const [activePreview, setActivePreview] = useState<'full' | 'comparison' | 'figures'>('full');
  const [notesToAuthor, setNotesToAuthor] = useState('');
  const [notesToLayout, setNotesToLayout] = useState('');
  const [reviewComments, setReviewComments] = useState('');

  const validationItems: ValidationItem[] = [
    { id: 'v1', label: 'Typography consistency verified', status: 'verified' },
    { id: 'v2', label: 'Layout alignment verified', status: 'verified' },
    { id: 'v3', label: 'Pagination correct', status: 'verified' },
    { id: 'v4', label: 'Figures properly placed', status: 'warning' },
    { id: 'v5', label: 'Tables properly formatted', status: 'warning' },
    { id: 'v6', label: 'Print readiness confirmed', status: 'verified' },
    { id: 'v7', label: 'Formatting compliance verified', status: 'verified' },
  ];

  const verifiedCount = validationItems.filter(i => i.status === 'verified').length;
  const warningCount = validationItems.filter(i => i.status === 'warning').length;
  const failedCount = validationItems.filter(i => i.status === 'failed').length;
  const completeness = Math.round((verifiedCount / validationItems.length) * 100);

  const assessmentCards = [
    { label: 'Print Readiness', score: 91, badge: 'Approved', color: 'green' },
    { label: 'Formatting Quality', score: 87, badge: 'Good', color: 'green' },
    { label: 'Layout Consistency', score: 93, badge: 'Verified', color: 'green' },
    { label: 'Publication Readiness', score: 85, badge: 'Nearly Ready', color: 'amber' },
  ];

  const fileVersions = [
    { version: 'v1.0', date: new Date(Date.now() - 2 * 60 * 60 * 1000), name: 'typeset-manuscript-v1.pdf', size: '12.4 MB', status: 'Current' },
    { version: 'v0.9', date: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000), name: 'typeset-draft-v0.9.pdf', size: '11.8 MB', status: 'Previous' },
  ];

  const activityLog = [
    { id: 'a1', timestamp: new Date(Date.now() - 1 * 60 * 60 * 1000), action: 'Editor layout review session opened for v1.0', user: 'Dr. Sarah Johnson' },
    { id: 'a2', timestamp: new Date(Date.now() - 2 * 60 * 60 * 1000), action: 'Typeset PDF v1.0 downloaded for offline review', user: 'Dr. Sarah Johnson' },
    { id: 'a3', timestamp: new Date(Date.now() - 3 * 60 * 60 * 1000), action: 'Typeset manuscript v1.0 received from TWG Layout Artist Emma Thompson', user: 'System' },
  ];

  const alerts = [
    { id: 'al1', type: 'warning', message: 'Figure 2 placement note from Layout Artist — verify caption alignment matches journal style.' },
    { id: 'al2', type: 'warning', message: 'Table 3 column width flagged — confirm readability at print scale before approving.' },
    { id: 'al3', type: 'deadline', message: 'Editor review deadline: 2 days remaining. Send to author promptly to avoid production delay.' },
    { id: 'al4', type: 'info', message: 'Typeset manuscript v1.0 submitted by Emma Thompson (TWG Layout Artist). All source files attached.' },
  ];

  const workflowStages = ['Submission', 'Copyediting', 'Typesetting', 'Editor Review', 'Author Approval', 'Production'];
  const currentStageIndex = 3;

  const statusConfig: Record<PageStatus, { label: string; textColor: string; bgColor: string }> = {
    under_review: { label: 'Under Editor Layout Review', textColor: 'text-blue-800', bgColor: 'bg-blue-100' },
    draft_saved: { label: 'Review Draft Saved', textColor: 'text-gray-800', bgColor: 'bg-gray-100' },
    awaiting_author: { label: 'Awaiting Author Approval', textColor: 'text-purple-800', bgColor: 'bg-purple-100' },
    returned_layout: { label: 'Returned to Layout Artist', textColor: 'text-amber-800', bgColor: 'bg-amber-100' },
    approved: { label: 'Editor Approved Layout', textColor: 'text-green-800', bgColor: 'bg-green-100' },
    on_hold: { label: 'Held for Revision', textColor: 'text-red-800', bgColor: 'bg-red-100' },
  };

  const currentStatus = statusConfig[pageStatus];

  const getItemIcon = (status: ValidationItem['status']) => {
    if (status === 'verified') return <CheckCircle className="w-4 h-4 text-green-600" />;
    if (status === 'warning') return <AlertCircle className="w-4 h-4 text-amber-500" />;
    return <XCircle className="w-4 h-4 text-red-500" />;
  };

  const getItemBg = (status: ValidationItem['status']) => {
    if (status === 'verified') return 'bg-green-50 border-green-100';
    if (status === 'warning') return 'bg-amber-50 border-amber-100';
    return 'bg-red-50 border-red-100';
  };

  const getBarColor = (color: string) => {
    if (color === 'green') return 'bg-green-500';
    if (color === 'amber') return 'bg-amber-400';
    return 'bg-blue-500';
  };

  const getScoreColor = (score: number) => {
    if (score >= 90) return 'text-green-700';
    if (score >= 80) return 'text-amber-700';
    return 'text-red-700';
  };

  const getBadgeColor = (color: string) => {
    if (color === 'green') return 'bg-green-100 text-green-700';
    if (color === 'amber') return 'bg-amber-100 text-amber-700';
    return 'bg-blue-100 text-blue-700';
  };

  const handleDecisionClick = (d: ReviewDecision) => {
    setDecision(d);
    setShowConfirmModal(true);
  };

  const handleConfirm = () => {
    if (decision === 'send_author') setPageStatus('awaiting_author');
    else if (decision === 'return_layout') setPageStatus('returned_layout');
    else if (decision === 'hold') setPageStatus('on_hold');
    setShowConfirmModal(false);
  };

  const getDecisionLabel = (d: ReviewDecision) => {
    if (d === 'send_author') return 'Send to Author for Approval';
    if (d === 'return_layout') return 'Return to Layout Artist';
    return 'Hold for Revision';
  };

  const deadline = new Date(Date.now() + 2 * 24 * 60 * 60 * 1000);

  return (
    <div className="min-h-screen bg-[#F7F8FA]">

      {/* Sticky Header */}
      <div className="sticky top-0 z-50 bg-[#0F2D5E] text-white shadow-md">
        <div className="max-w-7xl mx-auto px-6 py-3 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <button onClick={onBack} className="flex items-center gap-2 text-sm text-slate-300 hover:text-white transition-colors">
              <ArrowLeft className="w-4 h-4" />
              Back to Dashboard
            </button>
            <div className="w-px h-5 bg-slate-600" />
            <div>
              <p className="text-xs text-slate-400 uppercase tracking-wider font-medium">Editor — Typesetting Review</p>
              <h1 className="text-base font-bold font-serif leading-tight truncate max-w-lg">{manuscript.title}</h1>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <span className={`text-xs font-semibold px-3 py-1 rounded-full ${currentStatus.bgColor} ${currentStatus.textColor}`}>
              {currentStatus.label}
            </span>
            <div className="text-right">
              <p className="text-xs text-slate-400">Review Deadline</p>
              <p className="text-sm font-semibold text-amber-300">{deadline.toLocaleDateString()}</p>
            </div>
          </div>
        </div>

        <div className="bg-[#141824] border-t border-slate-700 px-6 py-2">
          <div className="max-w-7xl mx-auto flex items-center gap-0 overflow-x-auto">
            {workflowStages.map((stage, idx) => (
              <React.Fragment key={stage}>
                <div className="flex flex-col items-center flex-shrink-0">
                  <div className={`w-5 h-5 rounded-full flex items-center justify-center text-xs font-bold border-2 ${
                    idx < currentStageIndex ? 'bg-emerald-500 border-emerald-500 text-white' :
                    idx === currentStageIndex ? 'bg-white border-white text-[#0F2D5E]' :
                    'bg-transparent border-slate-600 text-slate-500'
                  }`}>
                    {idx < currentStageIndex ? <CheckCircle className="w-3 h-3" /> : idx + 1}
                  </div>
                  <span className={`text-[9px] mt-1 whitespace-nowrap font-medium ${
                    idx === currentStageIndex ? 'text-white' : idx < currentStageIndex ? 'text-emerald-400' : 'text-slate-500'
                  }`}>{stage}</span>
                </div>
                {idx < workflowStages.length - 1 && (
                  <div className={`h-px flex-1 min-w-[20px] mx-1 mb-4 ${idx < currentStageIndex ? 'bg-emerald-500' : 'bg-slate-700'}`} />
                )}
              </React.Fragment>
            ))}
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-6 py-6 space-y-5">

        {/* SECTION 1 — Manuscript Summary */}
        <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-5">
          <div className="flex items-center gap-2 mb-4">
            <BookOpen className="w-4 h-4 text-[#0F2D5E]" />
            <h2 className="text-base font-bold font-serif text-[#0F2D5E] uppercase tracking-wide">Manuscript Summary</h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
            <div className="space-y-2 text-sm">
              <div><span className="text-gray-500 font-medium">Title:</span><p className="text-gray-900 font-semibold leading-snug mt-0.5">{manuscript.title}</p></div>
              <div><span className="text-gray-500 font-medium">Journal:</span><p className="text-gray-800 mt-0.5">{manuscript.journal}</p></div>
            </div>
            <div className="space-y-2 text-sm">
              <div><span className="text-gray-500 font-medium">Version:</span><p className="text-gray-800 mt-0.5 font-semibold">v1.0 (Typeset)</p></div>
              <div><span className="text-gray-500 font-medium">Layout Submitted:</span><p className="text-gray-800 mt-0.5">{new Date(Date.now() - 3 * 60 * 60 * 1000).toLocaleString()}</p></div>
              <div><span className="text-gray-500 font-medium">Current Stage:</span><p className="text-gray-800 mt-0.5 font-semibold text-blue-700">Editor Layout Review</p></div>
            </div>
          </div>
          <div className="flex gap-2 flex-wrap">
            <button className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium text-[#0F2D5E] border border-[#1a1f2e] rounded-lg hover:bg-[#0F2D5E] hover:text-white transition-colors">
              <Eye className="w-3.5 h-3.5" /> View Typeset PDF
            </button>
            <button className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium text-gray-700 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors">
              <Download className="w-3.5 h-3.5" /> Download Files
            </button>
            <button className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium text-gray-700 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors">
              <Paperclip className="w-3.5 h-3.5" /> Layout Artist Notes
            </button>
          </div>
        </div>

        {/* SECTION 2 — Layout Validation Panel */}
        <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-5">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-2">
              <CheckCircle className="w-4 h-4 text-[#0F2D5E]" />
              <h2 className="text-base font-bold font-serif text-[#0F2D5E] uppercase tracking-wide">Layout Validation</h2>
            </div>
            <div className="flex items-center gap-2">
              {warningCount > 0 && <span className="text-xs px-2 py-0.5 bg-amber-100 text-amber-800 rounded-full font-semibold">{warningCount} Notes</span>}
              {failedCount > 0 && <span className="text-xs px-2 py-0.5 bg-red-100 text-red-800 rounded-full font-semibold">{failedCount} Failed</span>}
              <span className="text-xs px-2 py-0.5 bg-green-100 text-green-800 rounded-full font-semibold">{verifiedCount}/{validationItems.length} Verified</span>
            </div>
          </div>

          <div className="mb-4">
            <div className="flex items-center justify-between text-xs text-gray-500 mb-1">
              <span>Validation Progress</span>
              <span className="font-semibold text-gray-700">{completeness}%</span>
            </div>
            <div className="h-2 bg-gray-100 rounded-full overflow-hidden">
              <div className="h-full bg-gradient-to-r from-emerald-500 to-emerald-400 rounded-full" style={{ width: `${completeness}%` }} />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
            {validationItems.map((item) => (
              <div key={item.id} className={`flex items-center gap-3 px-3 py-2.5 rounded-lg border ${getItemBg(item.status)}`}>
                {getItemIcon(item.status)}
                <span className="text-sm text-gray-800 font-medium">{item.label}</span>
              </div>
            ))}
          </div>
        </div>

        {/* SECTION 3 — Layout Review Panel */}
        <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-5">
          <div className="flex items-center gap-2 mb-4">
            <Layout className="w-4 h-4 text-[#0F2D5E]" />
            <h2 className="text-base font-bold font-serif text-[#0F2D5E] uppercase tracking-wide">Layout Review Panel</h2>
            <span className="ml-auto text-xs text-gray-400 italic">Preview only</span>
          </div>

          <div className="flex gap-1 mb-4 bg-gray-100 rounded-lg p-1 w-fit">
            {(['full', 'comparison', 'figures'] as const).map((tab) => (
              <button key={tab} onClick={() => setActivePreview(tab)} className={`px-4 py-1.5 rounded-md text-xs font-semibold transition-all ${
                activePreview === tab ? 'bg-white text-[#0F2D5E] shadow-sm' : 'text-gray-500 hover:text-gray-700'
              }`}>
                {tab === 'full' ? 'Full Manuscript' : tab === 'comparison' ? 'Copyedited vs Typeset' : 'Figures & Tables'}
              </button>
            ))}
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-5 items-start">
            <div className="bg-gray-50 rounded-xl border border-gray-200 overflow-hidden">
              {activePreview === 'full' && (
                <div className="p-5 space-y-3">
                  <div className="h-4 w-2/3 bg-gray-500 rounded" />
                  <div className="h-2 w-1/2 bg-gray-300 rounded" />
                  <div className="space-y-1.5 mt-2">
                    {Array.from({ length: 6 }).map((_, i) => (
                      <div key={i} className="h-2 bg-gray-200 rounded" style={{ width: i === 5 ? '70%' : '100%' }} />
                    ))}
                  </div>
                  <div className="mt-3 bg-gray-200 h-20 rounded flex items-center justify-center">
                    <span className="text-[9px] text-gray-400 font-medium">Figure 1 — Research Framework</span>
                  </div>
                  <div className="h-1.5 w-24 bg-gray-300 rounded mx-auto" />
                  <div className="space-y-1.5">
                    {Array.from({ length: 4 }).map((_, i) => (
                      <div key={i} className="h-2 bg-gray-200 rounded" style={{ width: i === 3 ? '60%' : '100%' }} />
                    ))}
                  </div>
                </div>
              )}
              {activePreview === 'comparison' && (
                <div className="grid grid-cols-2 divide-x divide-gray-200">
                  <div className="p-3">
                    <p className="text-[9px] font-bold text-blue-500 uppercase tracking-wider mb-2 text-center">Copyedited</p>
                    <div className="space-y-1">
                      {Array.from({ length: 10 }).map((_, i) => (
                        <div key={i} className="h-1.5 bg-blue-100 rounded" style={{ width: i % 4 === 3 ? '65%' : '100%' }} />
                      ))}
                    </div>
                  </div>
                  <div className="p-3">
                    <p className="text-[9px] font-bold text-emerald-600 uppercase tracking-wider mb-2 text-center">Typeset v1.0</p>
                    <div className="space-y-1">
                      {Array.from({ length: 10 }).map((_, i) => (
                        <div key={i} className={`h-1.5 rounded ${i === 3 || i === 7 ? 'bg-emerald-200' : 'bg-gray-200'}`} style={{ width: i % 4 === 3 ? '60%' : '100%' }} />
                      ))}
                    </div>
                  </div>
                </div>
              )}
              {activePreview === 'figures' && (
                <div className="p-4 space-y-3">
                  {[
                    { label: 'Figure 1 — Research Framework', warn: false },
                    { label: 'Figure 2 — Data Distribution', warn: true },
                    { label: 'Table 1 — Summary Statistics', warn: false },
                    { label: 'Table 3 — Comparative Analysis', warn: true },
                  ].map((item) => (
                    <div key={item.label} className={`h-12 rounded flex items-center justify-between px-3 border ${
                      item.warn ? 'bg-amber-50 border-amber-200' : 'bg-gray-100 border-gray-200'
                    }`}>
                      <span className="text-[9px] font-medium text-gray-500">{item.label}</span>
                      {item.warn && <span className="text-[8px] text-amber-600 font-semibold">Review Needed</span>}
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* File version history */}
            <div>
              <p className="text-xs font-semibold text-gray-700 uppercase tracking-wide mb-2">File Version History</p>
              <div className="space-y-2">
                {fileVersions.map((f) => (
                  <div key={f.version} className="flex items-center justify-between px-3 py-2.5 bg-gray-50 rounded-lg border border-gray-100 text-xs">
                    <div className="flex items-center gap-2 min-w-0">
                      <FileText className="w-3.5 h-3.5 text-gray-400 flex-shrink-0" />
                      <div className="min-w-0">
                        <p className="font-medium text-gray-900 truncate">{f.name}</p>
                        <p className="text-gray-500">{f.version} · {f.size} · {f.date.toLocaleDateString()}</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-2 flex-shrink-0 ml-2">
                      <span className={`px-2 py-0.5 rounded-full font-semibold text-[10px] ${
                        f.status === 'Current' ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-600'
                      }`}>{f.status}</span>
                      <button className="text-gray-400 hover:text-[#0F2D5E]"><Download className="w-3.5 h-3.5" /></button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* SECTION 4 — Editorial Assessment */}
        <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-5">
          <div className="flex items-center gap-2 mb-4">
            <Type className="w-4 h-4 text-[#0F2D5E]" />
            <h2 className="text-base font-bold font-serif text-[#0F2D5E] uppercase tracking-wide">Editorial Assessment</h2>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
            {assessmentCards.map((card) => (
              <div key={card.label} className="p-4 bg-gray-50 rounded-xl border border-gray-100">
                <div className="flex items-center justify-between mb-2">
                  <p className="text-xs font-semibold text-gray-600">{card.label}</p>
                  <span className={`text-xs px-2 py-0.5 rounded-full font-semibold ${getBadgeColor(card.color)}`}>{card.badge}</span>
                </div>
                <p className={`text-2xl font-bold mb-2 ${getScoreColor(card.score)}`}>
                  {card.score}<span className="text-sm font-normal text-gray-400">%</span>
                </p>
                <div className="h-1.5 bg-gray-200 rounded-full overflow-hidden">
                  <div className={`h-full rounded-full ${getBarColor(card.color)}`} style={{ width: `${card.score}%` }} />
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* SECTION 5 — Editorial Decision Panel */}
        <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-5">
          <div className="flex items-center gap-2 mb-5">
            <AlignLeft className="w-4 h-4 text-[#0F2D5E]" />
            <h2 className="text-base font-bold font-serif text-[#0F2D5E] uppercase tracking-wide">Editorial Decision</h2>
          </div>
          <div className="space-y-4 mb-5">
            <div>
              <label className="block text-xs font-semibold text-gray-700 mb-1">Notes to Author <span className="text-red-500">*</span></label>
              <textarea value={notesToAuthor} onChange={e => setNotesToAuthor(e.target.value)} rows={3}
                placeholder="Provide guidance for the author on what to review in the typeset layout..."
                className="w-full text-sm border border-gray-200 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-[#1a1f2e] resize-none text-gray-800 placeholder-gray-400" />
            </div>
            <div>
              <label className="block text-xs font-semibold text-gray-700 mb-1">Notes to TWG Layout Artist</label>
              <textarea value={notesToLayout} onChange={e => setNotesToLayout(e.target.value)} rows={3}
                placeholder="Communicate any layout corrections or revision requests to the TWG Layout Artist..."
                className="w-full text-sm border border-gray-200 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-[#1a1f2e] resize-none text-gray-800 placeholder-gray-400" />
            </div>
            <div>
              <label className="block text-xs font-semibold text-gray-700 mb-1">Final Review Comments</label>
              <textarea value={reviewComments} onChange={e => setReviewComments(e.target.value)} rows={2}
                placeholder="Add any final editorial observations about this typeset version..."
                className="w-full text-sm border border-gray-200 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-[#1a1f2e] resize-none text-gray-800 placeholder-gray-400" />
            </div>
          </div>

          <div className="flex flex-wrap gap-3">
            <button onClick={() => handleDecisionClick('send_author')} className={`flex items-center gap-2 px-5 py-2.5 rounded-lg text-sm font-semibold transition-colors ${
              decision === 'send_author' ? 'bg-emerald-600 text-white ring-2 ring-emerald-400' : 'bg-emerald-50 text-emerald-800 border border-emerald-200 hover:bg-emerald-600 hover:text-white'
            }`}>
              <Send className="w-4 h-4" /> Send to Author for Approval
            </button>
            <button onClick={() => handleDecisionClick('return_layout')} className={`flex items-center gap-2 px-5 py-2.5 rounded-lg text-sm font-semibold transition-colors ${
              decision === 'return_layout' ? 'bg-amber-500 text-white ring-2 ring-amber-300' : 'bg-amber-50 text-amber-800 border border-amber-200 hover:bg-amber-500 hover:text-white'
            }`}>
              <RotateCcw className="w-4 h-4" /> Return to Layout Artist
            </button>
            <button onClick={() => handleDecisionClick('hold')} className={`flex items-center gap-2 px-5 py-2.5 rounded-lg text-sm font-semibold transition-colors ${
              decision === 'hold' ? 'bg-gray-500 text-white ring-2 ring-gray-300' : 'bg-gray-50 text-gray-700 border border-gray-200 hover:bg-gray-500 hover:text-white'
            }`}>
              <PauseCircle className="w-4 h-4" /> Hold for Revision
            </button>
          </div>
        </div>

        {/* Workflow + Timeline */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-5">
            <div className="flex items-center gap-2 mb-4">
              <Activity className="w-4 h-4 text-[#0F2D5E]" />
              <h2 className="text-sm font-bold font-serif text-[#0F2D5E] uppercase tracking-wide">Workflow Status</h2>
            </div>
            <div className="space-y-3 text-sm">
              <div className="flex justify-between"><span className="text-gray-500 font-medium">Current Stage</span><span className="font-semibold text-[#0F2D5E]">Editor Layout Review</span></div>
              <div className="flex justify-between"><span className="text-gray-500 font-medium">Next Stage</span><span className="font-semibold text-gray-700">Author Approval</span></div>
              <div className="flex justify-between"><span className="text-gray-500 font-medium">Review Deadline</span><span className="font-semibold text-amber-700">{deadline.toLocaleDateString()}</span></div>
              <div className="flex justify-between items-center"><span className="text-gray-500 font-medium">Delay Risk</span><span className="px-2 py-0.5 bg-amber-100 text-amber-800 rounded-full text-xs font-semibold">Moderate</span></div>
            </div>
          </div>

          <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-5">
            <div className="flex items-center gap-2 mb-4">
              <CalendarClock className="w-4 h-4 text-[#0F2D5E]" />
              <h2 className="text-sm font-bold font-serif text-[#0F2D5E] uppercase tracking-wide">Timeline</h2>
            </div>
            <div className="space-y-3 text-sm">
              <div className="flex justify-between"><span className="text-gray-500 font-medium">Review Duration Est.</span><span className="font-semibold text-[#0F2D5E]">1–2 Business Days</span></div>
              <div className="flex justify-between items-center">
                <span className="text-gray-500 font-medium">Stage Progress</span>
                <div className="flex items-center gap-2">
                  <div className="w-20 h-1.5 bg-gray-200 rounded-full overflow-hidden">
                    <div className="h-full bg-blue-500 rounded-full" style={{ width: '40%' }} />
                  </div>
                  <span className="text-gray-700 font-medium">40%</span>
                </div>
              </div>
              <div className="flex justify-between items-center"><span className="text-gray-500 font-medium">Delay Risk</span><span className="px-2 py-0.5 bg-amber-100 text-amber-800 rounded-full text-xs font-semibold">Moderate</span></div>
              <div className="flex justify-between"><span className="text-gray-500 font-medium">Remaining Est.</span><span className="font-semibold text-gray-700">~1.5 days</span></div>
            </div>
          </div>
        </div>

        {/* Alerts */}
        <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-5">
          <div className="flex items-center gap-2 mb-4">
            <Bell className="w-4 h-4 text-[#0F2D5E]" />
            <h2 className="text-base font-bold font-serif text-[#0F2D5E] uppercase tracking-wide">Alerts</h2>
          </div>
          <div className="space-y-2">
            {alerts.map((alert) => (
              <div key={alert.id} className={`flex items-start gap-3 px-4 py-3 rounded-lg border text-sm ${
                alert.type === 'warning' ? 'bg-amber-50 border-amber-100' :
                alert.type === 'deadline' ? 'bg-red-50 border-red-100' : 'bg-blue-50 border-blue-100'
              }`}>
                {alert.type === 'warning' && <AlertTriangle className="w-4 h-4 text-amber-500 flex-shrink-0 mt-0.5" />}
                {alert.type === 'deadline' && <AlertCircle className="w-4 h-4 text-red-500 flex-shrink-0 mt-0.5" />}
                {alert.type === 'info' && <Info className="w-4 h-4 text-blue-500 flex-shrink-0 mt-0.5" />}
                <p className={alert.type === 'warning' ? 'text-amber-800' : alert.type === 'deadline' ? 'text-red-800' : 'text-blue-800'}>{alert.message}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Activity Log */}
        <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-5 mb-24">
          <div className="flex items-center gap-2 mb-4">
            <History className="w-4 h-4 text-[#0F2D5E]" />
            <h2 className="text-base font-bold font-serif text-[#0F2D5E] uppercase tracking-wide">Activity Log</h2>
          </div>
          <div className="space-y-2">
            {activityLog.map((entry) => (
              <div key={entry.id} className="flex items-start gap-3 px-3 py-2.5 bg-gray-50 rounded-lg border border-gray-100 text-xs">
                <Clock className="w-3.5 h-3.5 text-gray-400 flex-shrink-0 mt-0.5" />
                <div className="flex-1 min-w-0">
                  <p className="text-gray-800 font-medium">{entry.action}</p>
                  <p className="text-gray-500 mt-0.5">{entry.user} · {entry.timestamp.toLocaleString()}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Sticky Bottom Action Bar */}
      <div className="fixed bottom-0 left-0 right-0 z-40 bg-white border-t border-gray-200 shadow-lg">
        <div className="max-w-7xl mx-auto px-6 py-3 flex items-center justify-between gap-3">
          <div className="flex items-center gap-2">
            <button onClick={() => setPageStatus('draft_saved')} className="flex items-center gap-1.5 px-4 py-2 text-sm font-medium text-gray-700 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors">
              <Save className="w-4 h-4" /> Save Draft
            </button>
          </div>
          <div className="flex items-center gap-2">
            <button onClick={() => handleDecisionClick('return_layout')} className="flex items-center gap-1.5 px-4 py-2 text-sm font-semibold text-amber-700 bg-amber-50 border border-amber-200 rounded-lg hover:bg-amber-500 hover:text-white transition-colors">
              <RotateCcw className="w-4 h-4" /> Return to TWG
            </button>
            <button onClick={() => handleDecisionClick('send_author')} className="flex items-center gap-1.5 px-5 py-2 text-sm font-semibold text-white bg-[#0F2D5E] rounded-lg hover:bg-[#252b3d] transition-colors">
              <Send className="w-4 h-4" /> Send to Author
            </button>
            <button onClick={onBack} className="px-4 py-2 text-sm text-gray-500 hover:text-gray-700 transition-colors">Cancel</button>
          </div>
        </div>
      </div>

      {/* Confirmation Modal */}
      {showConfirmModal && decision && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm">
          <div className="bg-white rounded-2xl shadow-2xl p-6 w-full max-w-md mx-4">
            <div className="flex items-center gap-3 mb-4">
              <div className={`p-2 rounded-lg ${
                decision === 'send_author' ? 'bg-emerald-100' :
                decision === 'return_layout' ? 'bg-amber-100' : 'bg-gray-100'
              }`}>
                {decision === 'send_author' ? <Send className="w-5 h-5 text-emerald-600" /> :
                 decision === 'return_layout' ? <RotateCcw className="w-5 h-5 text-amber-600" /> :
                 <PauseCircle className="w-5 h-5 text-gray-600" />}
              </div>
              <div>
                <h3 className="font-bold text-gray-900">Confirm Decision</h3>
                <p className="text-xs text-gray-500">This will update the manuscript workflow</p>
              </div>
            </div>
            <div className="bg-gray-50 rounded-lg p-4 mb-4 space-y-1.5 text-sm">
              <p><span className="text-gray-500">Decision:</span> <span className="font-semibold">{getDecisionLabel(decision)}</span></p>
              <p><span className="text-gray-500">Manuscript:</span> <span className="font-medium text-xs">{manuscript.title}</span></p>
              <p><span className="text-gray-500">Next Stage:</span> <span className="font-medium">
                {decision === 'send_author' ? 'Author Typeset Approval' :
                 decision === 'return_layout' ? 'Layout Revision (TWG)' : 'Hold — Pending Revision'}
              </span></p>
            </div>
            <p className="text-sm text-gray-600 mb-5">
              {decision === 'send_author'
                ? 'The typeset manuscript will be sent to the author for final layout approval. Ensure your review notes are complete before confirming.'
                : decision === 'return_layout'
                ? 'The typeset manuscript will be returned to the TWG Layout Artist with your correction notes attached.'
                : 'The manuscript review will be placed on hold. No further workflow progression will occur until released.'}
            </p>
            <div className="flex gap-3">
              <button onClick={() => setShowConfirmModal(false)} className="flex-1 px-4 py-2 text-sm font-medium text-gray-700 border border-gray-300 rounded-lg hover:bg-gray-50">Cancel</button>
              <button onClick={handleConfirm} className={`flex-1 px-4 py-2 text-sm font-semibold text-white rounded-lg ${
                decision === 'send_author' ? 'bg-emerald-600 hover:bg-emerald-700' :
                decision === 'return_layout' ? 'bg-amber-500 hover:bg-amber-600' : 'bg-gray-700 hover:bg-gray-800'
              }`}>
                Confirm {decision === 'send_author' ? 'Send' : decision === 'return_layout' ? 'Return' : 'Hold'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
