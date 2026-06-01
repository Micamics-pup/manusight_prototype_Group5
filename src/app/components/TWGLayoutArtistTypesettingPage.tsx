import React, { useState } from 'react';
import {
  ArrowLeft,
  FileText,
  CheckCircle,
  Clock,
  AlertCircle,
  AlertTriangle,
  Download,
  Upload,
  Eye,
  Save,
  Send,
  RotateCcw,
  Paperclip,
  XCircle,
  Info,
  PauseCircle,
  Layers,
  BookOpen,
  CalendarClock,
  Activity,
  History,
  Bell,
  Layout,
  Type,
  Grid,
  AlignLeft,
} from 'lucide-react';
import type { Manuscript } from '../types';

interface TWGLayoutArtistTypesettingPageProps {
  manuscript: Manuscript;
  onBack: () => void;
}

type PageStatus =
  | 'under_typesetting'
  | 'draft_saved'
  | 'awaiting_editor'
  | 'needs_revision'
  | 'completed';

type SubmitDecision = 'send_editor' | 'request_revision' | null;

interface ChecklistItem {
  id: string;
  label: string;
  status: 'completed' | 'pending' | 'needs_revision';
}

interface LayoutFile {
  id: string;
  name: string;
  size: string;
  type: string;
  version: string;
  status: 'uploaded' | 'pending';
  date: Date;
}

export function TWGLayoutArtistTypesettingPage({ manuscript, onBack }: TWGLayoutArtistTypesettingPageProps) {
  const [pageStatus, setPageStatus] = useState<PageStatus>('under_typesetting');
  const [decision, setDecision] = useState<SubmitDecision>(null);
  const [showConfirmModal, setShowConfirmModal] = useState(false);
  const [activePreview, setActivePreview] = useState<'spread' | 'chapter' | 'comparison'>('spread');
  const [typesettingNotes, setTypesettingNotes] = useState('');
  const [layoutDecisions, setLayoutDecisions] = useState('');
  const [issuesNotes, setIssuesNotes] = useState('');
  const [productionRemarks, setProductionRemarks] = useState('');

  const checklistItems: ChecklistItem[] = [
    { id: 'c1', label: 'Page size & trim format set', status: 'completed' },
    { id: 'c2', label: 'Margins and grid system applied', status: 'completed' },
    { id: 'c3', label: 'Typography hierarchy applied (headings, body, captions)', status: 'completed' },
    { id: 'c4', label: 'Pagination completed', status: 'completed' },
    { id: 'c5', label: 'Header/footer layout configured', status: 'needs_revision' },
    { id: 'c6', label: 'Figure placement validated', status: 'completed' },
    { id: 'c7', label: 'Table formatting standardized', status: 'pending' },
    { id: 'c8', label: 'Chapter/section structure applied', status: 'completed' },
  ];

  const completedCount = checklistItems.filter(i => i.status === 'completed').length;
  const pendingCount = checklistItems.filter(i => i.status === 'pending').length;
  const revisionCount = checklistItems.filter(i => i.status === 'needs_revision').length;
  const completeness = Math.round((completedCount / checklistItems.length) * 100);

  const qualityCards = [
    { label: 'Readability Check', score: 94, badge: 'Passed', color: 'green' },
    { label: 'Spacing Consistency', score: 88, badge: 'Good', color: 'green' },
    { label: 'Typography Alignment', score: 91, badge: 'Verified', color: 'green' },
    { label: 'Print Readiness', score: 82, badge: 'Nearly Ready', color: 'amber' },
    { label: 'Formatting Errors', score: 97, badge: '2 Minor', color: 'blue' },
  ];

  const layoutFiles: LayoutFile[] = [
    { id: 'f1', name: 'typeset-manuscript-v1.pdf', size: '12.4 MB', type: 'Typeset PDF', version: 'v1.0', status: 'uploaded', date: new Date(Date.now() - 1 * 60 * 60 * 1000) },
    { id: 'f2', name: 'layout-source-v1.indd', size: '34.1 MB', type: 'InDesign Source', version: 'v1.0', status: 'uploaded', date: new Date(Date.now() - 2 * 60 * 60 * 1000) },
    { id: 'f3', name: 'marked-layout-v1.pdf', size: '9.7 MB', type: 'Marked Layout', version: 'v1.0', status: 'uploaded', date: new Date(Date.now() - 3 * 60 * 60 * 1000) },
    { id: 'f4', name: 'fonts-embed-check.pdf', size: '2.1 MB', type: 'Font Validation', version: 'v1.0', status: 'pending', date: new Date() },
  ];

  const versionHistory = [
    { version: 'v0.5', date: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000), note: 'Initial layout structure drafted', status: 'Draft' },
    { version: 'v0.9', date: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000), note: 'Typography and pagination applied', status: 'In Progress' },
    { version: 'v1.0', date: new Date(Date.now() - 1 * 60 * 60 * 1000), note: 'Full typeset completed — ready for submission', status: 'Current' },
  ];

  const activityLog = [
    { id: 'a1', timestamp: new Date(Date.now() - 1 * 60 * 60 * 1000), action: 'Typeset PDF v1.0 uploaded for editor submission', user: 'Emma Thompson' },
    { id: 'a2', timestamp: new Date(Date.now() - 3 * 60 * 60 * 1000), action: 'InDesign source file v1.0 uploaded', user: 'Emma Thompson' },
    { id: 'a3', timestamp: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000), action: 'Typography hierarchy and pagination applied to layout', user: 'Emma Thompson' },
    { id: 'a4', timestamp: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000), action: 'Typesetting task received — grid and margin system established', user: 'Emma Thompson' },
    { id: 'a5', timestamp: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000), action: 'Typesetting & Layout Composition task assigned by TWG Coordinator', user: 'System' },
  ];

  const alerts = [
    { id: 'al1', type: 'warning', message: 'Header/footer layout flagged — verify running title truncation on narrow pages before submission.' },
    { id: 'al2', type: 'warning', message: 'Table formatting for Table 3 pending — review alignment and column widths.' },
    { id: 'al3', type: 'deadline', message: 'Editor submission deadline: 1 day remaining. Complete checklist before sending.' },
    { id: 'al4', type: 'info', message: 'Font embedding check file pending upload — required for print-readiness validation.' },
  ];

  const workflowStages = ['Submission', 'Copyediting', 'Final Revision', 'Cover Design', 'ISBN', 'Typesetting', 'Editor Review', 'Author Approval', 'Production'];
  const currentStageIndex = 5;

  const statusConfig: Record<PageStatus, { label: string; textColor: string; bgColor: string }> = {
    under_typesetting: { label: 'Under Typesetting', textColor: 'text-blue-800', bgColor: 'bg-blue-100' },
    draft_saved: { label: 'Layout Draft Saved', textColor: 'text-gray-800', bgColor: 'bg-gray-100' },
    awaiting_editor: { label: 'Awaiting Editor Review', textColor: 'text-purple-800', bgColor: 'bg-purple-100' },
    needs_revision: { label: 'Needs Layout Revision', textColor: 'text-amber-800', bgColor: 'bg-amber-100' },
    completed: { label: 'Typesetting Completed', textColor: 'text-green-800', bgColor: 'bg-green-100' },
  };

  const currentStatus = statusConfig[pageStatus];

  const getChecklistIcon = (status: ChecklistItem['status']) => {
    if (status === 'completed') return <CheckCircle className="w-4 h-4 text-green-600" />;
    if (status === 'needs_revision') return <AlertCircle className="w-4 h-4 text-amber-500" />;
    return <Clock className="w-4 h-4 text-gray-400" />;
  };

  const getChecklistBg = (status: ChecklistItem['status']) => {
    if (status === 'completed') return 'bg-green-50 border-green-100';
    if (status === 'needs_revision') return 'bg-amber-50 border-amber-100';
    return 'bg-gray-50 border-gray-100';
  };

  const getBarColor = (color: string) => {
    if (color === 'green') return 'bg-green-500';
    if (color === 'amber') return 'bg-amber-400';
    if (color === 'blue') return 'bg-blue-500';
    return 'bg-gray-400';
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

  const handleDecisionClick = (d: SubmitDecision) => {
    setDecision(d);
    setShowConfirmModal(true);
  };

  const handleConfirm = () => {
    if (decision === 'send_editor') setPageStatus('awaiting_editor');
    else if (decision === 'request_revision') setPageStatus('needs_revision');
    setShowConfirmModal(false);
  };

  const deadline = new Date(Date.now() + 1 * 24 * 60 * 60 * 1000);

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
              <p className="text-xs text-slate-400 uppercase tracking-wider font-medium">TWG Layout Artist — Typesetting & Layout Composition</p>
              <h1 className="text-base font-bold font-serif leading-tight truncate max-w-lg">{manuscript.title}</h1>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <span className={`text-xs font-semibold px-3 py-1 rounded-full ${currentStatus.bgColor} ${currentStatus.textColor}`}>
              {currentStatus.label}
            </span>
            <div className="text-right">
              <p className="text-xs text-slate-400">Submission Deadline</p>
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
                  <div className={`h-px flex-1 min-w-[12px] mx-1 mb-4 ${idx < currentStageIndex ? 'bg-emerald-500' : 'bg-slate-700'}`} />
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
              <div><span className="text-gray-500 font-medium">Authors & Affiliations:</span><p className="text-gray-800 mt-0.5">Dr. Jane Smith · University of Cambridge</p></div>
              <div><span className="text-gray-500 font-medium">Journal Category:</span><p className="text-gray-800 mt-0.5">{manuscript.journal}</p></div>
            </div>
            <div className="space-y-2 text-sm">
              <div><span className="text-gray-500 font-medium">Version:</span><p className="text-gray-800 mt-0.5 font-semibold">v3.0 (Post Copyediting)</p></div>
              <div><span className="text-gray-500 font-medium">Submission Status:</span><p className="text-gray-800 mt-0.5">Copyediting Complete · Cover Approved</p></div>
              <div><span className="text-gray-500 font-medium">Current Stage:</span><p className="text-gray-800 mt-0.5 font-semibold text-blue-700">Typesetting & Layout Composition</p></div>
            </div>
          </div>
          <div className="flex gap-2 flex-wrap">
            <button className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium text-[#0F2D5E] border border-[#1a1f2e] rounded-lg hover:bg-[#0F2D5E] hover:text-white transition-colors">
              <Eye className="w-3.5 h-3.5" /> View Manuscript
            </button>
            <button className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium text-gray-700 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors">
              <Download className="w-3.5 h-3.5" /> Download Source Files
            </button>
            <button className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium text-gray-700 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors">
              <Paperclip className="w-3.5 h-3.5" /> View Copyediting Notes
            </button>
          </div>
        </div>

        {/* SECTION 2 — Typesetting Checklist */}
        <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-5">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-2">
              <Grid className="w-4 h-4 text-[#0F2D5E]" />
              <h2 className="text-base font-bold font-serif text-[#0F2D5E] uppercase tracking-wide">Typesetting & Layout Checklist</h2>
            </div>
            <div className="flex items-center gap-2">
              {revisionCount > 0 && <span className="text-xs px-2 py-0.5 bg-amber-100 text-amber-800 rounded-full font-semibold">{revisionCount} Needs Revision</span>}
              {pendingCount > 0 && <span className="text-xs px-2 py-0.5 bg-gray-100 text-gray-700 rounded-full font-semibold">{pendingCount} Pending</span>}
              <span className="text-xs px-2 py-0.5 bg-green-100 text-green-800 rounded-full font-semibold">{completedCount}/{checklistItems.length} Done</span>
            </div>
          </div>

          <div className="mb-4">
            <div className="flex items-center justify-between text-xs text-gray-500 mb-1">
              <span>Overall Completion</span>
              <span className="font-semibold text-gray-700">{completeness}%</span>
            </div>
            <div className="h-2 bg-gray-100 rounded-full overflow-hidden">
              <div className="h-full bg-gradient-to-r from-emerald-500 to-emerald-400 rounded-full transition-all" style={{ width: `${completeness}%` }} />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
            {checklistItems.map((item) => (
              <div key={item.id} className={`flex items-center gap-3 px-3 py-2.5 rounded-lg border ${getChecklistBg(item.status)}`}>
                {getChecklistIcon(item.status)}
                <span className="text-sm text-gray-800 font-medium">{item.label}</span>
                <span className={`ml-auto text-[10px] font-semibold px-2 py-0.5 rounded-full flex-shrink-0 ${
                  item.status === 'completed' ? 'bg-green-100 text-green-700' :
                  item.status === 'needs_revision' ? 'bg-amber-100 text-amber-700' :
                  'bg-gray-100 text-gray-600'
                }`}>{item.status === 'completed' ? 'Completed' : item.status === 'needs_revision' ? 'Needs Revision' : 'Pending'}</span>
              </div>
            ))}
          </div>
        </div>

        {/* SECTION 3 — Layout Composition Preview */}
        <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-5">
          <div className="flex items-center gap-2 mb-4">
            <Layout className="w-4 h-4 text-[#0F2D5E]" />
            <h2 className="text-base font-bold font-serif text-[#0F2D5E] uppercase tracking-wide">Layout Composition Preview</h2>
            <span className="ml-auto text-xs text-gray-400 italic">Preview only — no editing</span>
          </div>

          <div className="flex gap-1 mb-4 bg-gray-100 rounded-lg p-1 w-fit">
            {(['spread', 'chapter', 'comparison'] as const).map((tab) => (
              <button key={tab} onClick={() => setActivePreview(tab)} className={`px-4 py-1.5 rounded-md text-xs font-semibold transition-all ${
                activePreview === tab ? 'bg-white text-[#0F2D5E] shadow-sm' : 'text-gray-500 hover:text-gray-700'
              }`}>
                {tab === 'spread' ? 'Page Spread' : tab === 'chapter' ? 'Chapter Layout' : 'Before/After'}
              </button>
            ))}
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-5 items-start">
            {/* Simulated preview */}
            <div className="bg-gray-50 rounded-xl border border-gray-200 overflow-hidden">
              {activePreview === 'spread' && (
                <div className="flex divide-x divide-gray-200">
                  {[0, 1].map((side) => (
                    <div key={side} className="flex-1 p-4 space-y-2">
                      {/* Page header */}
                      <div className="flex items-center justify-between pb-1 border-b border-gray-200">
                        <div className="h-1.5 w-16 bg-gray-300 rounded" />
                        <div className="h-1.5 w-6 bg-gray-400 rounded" />
                      </div>
                      {/* Body text simulation */}
                      <div className="space-y-1">
                        {Array.from({ length: 3 }).map((_, i) => (
                          <div key={i} className="h-2 bg-gray-200 rounded" style={{ width: i === 2 ? '70%' : '100%' }} />
                        ))}
                      </div>
                      {/* Heading */}
                      <div className="h-3 w-3/4 bg-gray-400 rounded mt-3" />
                      <div className="space-y-1">
                        {Array.from({ length: 4 }).map((_, i) => (
                          <div key={i} className="h-2 bg-gray-200 rounded" style={{ width: i === 3 ? '55%' : '100%' }} />
                        ))}
                      </div>
                      {/* Figure placeholder */}
                      <div className="bg-gray-200 rounded h-16 flex items-center justify-center mt-2">
                        <span className="text-[9px] text-gray-400 font-medium">Figure {side + 1}</span>
                      </div>
                      <div className="h-1.5 w-20 bg-gray-300 rounded mx-auto" />
                      {/* Footer */}
                      <div className="flex items-center justify-between pt-1 border-t border-gray-200 mt-2">
                        <div className="h-1.5 w-12 bg-gray-300 rounded" />
                        <div className="h-1.5 w-4 bg-gray-400 rounded" />
                      </div>
                    </div>
                  ))}
                </div>
              )}
              {activePreview === 'chapter' && (
                <div className="p-5">
                  <div className="h-px bg-gray-300 mb-3" />
                  <div className="h-4 w-1/3 bg-gray-500 rounded mb-1" />
                  <div className="h-2 w-1/2 bg-gray-300 rounded mb-4" />
                  <div className="space-y-1.5">
                    {Array.from({ length: 6 }).map((_, i) => (
                      <div key={i} className="h-2 bg-gray-200 rounded" style={{ width: i === 5 ? '65%' : '100%' }} />
                    ))}
                  </div>
                  <div className="mt-4 h-3 w-2/5 bg-gray-400 rounded" />
                  <div className="mt-2 space-y-1.5">
                    {Array.from({ length: 5 }).map((_, i) => (
                      <div key={i} className="h-2 bg-gray-200 rounded" style={{ width: i === 4 ? '80%' : '100%' }} />
                    ))}
                  </div>
                  <div className="mt-4 bg-gray-200 h-20 rounded flex items-center justify-center">
                    <span className="text-[9px] text-gray-400 font-medium">Table 1 — Data Summary</span>
                  </div>
                </div>
              )}
              {activePreview === 'comparison' && (
                <div className="grid grid-cols-2 divide-x divide-gray-200">
                  <div className="p-3">
                    <p className="text-[9px] font-bold text-gray-400 uppercase tracking-wider mb-2 text-center">Copyedited</p>
                    <div className="space-y-1">
                      {Array.from({ length: 8 }).map((_, i) => (
                        <div key={i} className="h-1.5 bg-blue-100 rounded" style={{ width: i % 3 === 2 ? '70%' : '100%' }} />
                      ))}
                    </div>
                  </div>
                  <div className="p-3">
                    <p className="text-[9px] font-bold text-emerald-500 uppercase tracking-wider mb-2 text-center">Typeset</p>
                    <div className="space-y-1">
                      {Array.from({ length: 8 }).map((_, i) => (
                        <div key={i} className={`h-1.5 rounded ${i === 2 || i === 5 ? 'bg-emerald-200' : 'bg-gray-200'}`} style={{ width: i % 3 === 2 ? '65%' : '100%' }} />
                      ))}
                    </div>
                    <div className="mt-2 bg-emerald-50 border border-emerald-200 rounded p-1">
                      <div className="h-6 bg-gray-200 rounded" />
                      <div className="h-1.5 w-16 bg-gray-300 rounded mx-auto mt-1" />
                    </div>
                  </div>
                </div>
              )}
            </div>

            {/* Version history */}
            <div>
              <p className="text-xs font-semibold text-gray-700 uppercase tracking-wide mb-2">Version History</p>
              <div className="space-y-2">
                {versionHistory.map((v) => (
                  <div key={v.version} className="flex items-center justify-between px-3 py-2 bg-gray-50 rounded-lg border border-gray-100 text-xs">
                    <div className="flex items-center gap-2 min-w-0">
                      <span className="font-bold text-[#0F2D5E]">{v.version}</span>
                      <span className="text-gray-500">{v.date.toLocaleDateString()}</span>
                      <span className="text-gray-600 truncate">{v.note}</span>
                    </div>
                    <span className={`ml-2 flex-shrink-0 px-2 py-0.5 rounded-full font-semibold text-[10px] ${
                      v.status === 'Current' ? 'bg-green-100 text-green-700' :
                      v.status === 'In Progress' ? 'bg-blue-100 text-blue-700' :
                      'bg-gray-100 text-gray-600'
                    }`}>{v.status}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* SECTION 4 — Layout Quality Validation */}
        <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-5">
          <div className="flex items-center gap-2 mb-4">
            <Type className="w-4 h-4 text-[#0F2D5E]" />
            <h2 className="text-base font-bold font-serif text-[#0F2D5E] uppercase tracking-wide">Layout Quality Validation</h2>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
            {qualityCards.map((card) => (
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

        {/* SECTION 5 — Layout Artist Notes */}
        <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-5">
          <div className="flex items-center gap-2 mb-5">
            <AlignLeft className="w-4 h-4 text-[#0F2D5E]" />
            <h2 className="text-base font-bold font-serif text-[#0F2D5E] uppercase tracking-wide">Layout Artist Notes</h2>
          </div>
          <div className="space-y-4">
            <div>
              <label className="block text-xs font-semibold text-gray-700 mb-1">Typesetting Notes <span className="text-red-500">*</span></label>
              <textarea value={typesettingNotes} onChange={e => setTypesettingNotes(e.target.value)} rows={3}
                placeholder="Document your typesetting approach, tools used, and any standard deviations applied..."
                className="w-full text-sm border border-gray-200 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-[#1a1f2e] resize-none text-gray-800 placeholder-gray-400" />
            </div>
            <div>
              <label className="block text-xs font-semibold text-gray-700 mb-1">Layout Decisions Explanation</label>
              <textarea value={layoutDecisions} onChange={e => setLayoutDecisions(e.target.value)} rows={3}
                placeholder="Explain key layout decisions — grid system choices, typography hierarchy rationale, figure placement logic..."
                className="w-full text-sm border border-gray-200 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-[#1a1f2e] resize-none text-gray-800 placeholder-gray-400" />
            </div>
            <div>
              <label className="block text-xs font-semibold text-gray-700 mb-1">Issues Encountered</label>
              <textarea value={issuesNotes} onChange={e => setIssuesNotes(e.target.value)} rows={2}
                placeholder="Log any issues encountered during typesetting — orphaned lines, figure sizing conflicts, font embedding issues..."
                className="w-full text-sm border border-gray-200 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-[#1a1f2e] resize-none text-gray-800 placeholder-gray-400" />
            </div>
            <div>
              <label className="block text-xs font-semibold text-gray-700 mb-1">Production Remarks</label>
              <textarea value={productionRemarks} onChange={e => setProductionRemarks(e.target.value)} rows={2}
                placeholder="Add any production remarks relevant to print preparation, binding, or downstream processing..."
                className="w-full text-sm border border-gray-200 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-[#1a1f2e] resize-none text-gray-800 placeholder-gray-400" />
            </div>
          </div>
        </div>

        {/* SECTION 6 — File Management */}
        <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-5">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-2">
              <Layers className="w-4 h-4 text-[#0F2D5E]" />
              <h2 className="text-base font-bold font-serif text-[#0F2D5E] uppercase tracking-wide">Layout Files</h2>
            </div>
            <div className="flex gap-2">
              <button className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors">
                <Upload className="w-3.5 h-3.5" /> Upload Typeset PDF
              </button>
              <button className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium bg-[#0F2D5E] text-white rounded-lg hover:bg-[#252b3d] transition-colors">
                <Upload className="w-3.5 h-3.5" /> Upload Source File
              </button>
            </div>
          </div>
          <div className="space-y-2">
            {layoutFiles.map((file) => (
              <div key={file.id} className="flex items-center justify-between px-4 py-3 bg-gray-50 rounded-lg border border-gray-100 hover:bg-gray-100 transition-colors">
                <div className="flex items-center gap-3 min-w-0">
                  <FileText className="w-4 h-4 text-gray-400 flex-shrink-0" />
                  <div className="min-w-0">
                    <p className="text-sm font-medium text-gray-900 truncate">{file.name}</p>
                    <p className="text-xs text-gray-500">{file.type} · {file.version} · {file.size} · {file.date.toLocaleDateString()}</p>
                  </div>
                </div>
                <div className="flex items-center gap-2 flex-shrink-0 ml-3">
                  <span className={`text-xs px-2 py-0.5 rounded-full font-medium ${
                    file.status === 'uploaded' ? 'bg-green-100 text-green-800' : 'bg-amber-100 text-amber-800'
                  }`}>{file.status === 'uploaded' ? 'Uploaded' : 'Pending'}</span>
                  <button className="p-1.5 text-gray-400 hover:text-[#0F2D5E] transition-colors">
                    <Download className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* SECTION 7 + 8 — Workflow & Timeline */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-5">
            <div className="flex items-center gap-2 mb-4">
              <Activity className="w-4 h-4 text-[#0F2D5E]" />
              <h2 className="text-sm font-bold font-serif text-[#0F2D5E] uppercase tracking-wide">Workflow Status</h2>
            </div>
            <div className="space-y-3 text-sm">
              <div className="flex justify-between"><span className="text-gray-500 font-medium">Current Stage</span><span className="font-semibold text-[#0F2D5E]">Typesetting & Layout</span></div>
              <div className="flex justify-between"><span className="text-gray-500 font-medium">Next Stage</span><span className="font-semibold text-gray-700">Editor Layout Review</span></div>
              <div className="flex justify-between"><span className="text-gray-500 font-medium">Submission Deadline</span><span className="font-semibold text-amber-700">{deadline.toLocaleDateString()}</span></div>
              <div className="flex justify-between items-center"><span className="text-gray-500 font-medium">Delay Risk</span><span className="px-2 py-0.5 bg-amber-100 text-amber-800 rounded-full text-xs font-semibold">Moderate</span></div>
              <div className="flex justify-between"><span className="text-gray-500 font-medium">Last Updated</span><span className="font-medium text-gray-700">{new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })} today</span></div>
            </div>
          </div>

          <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-5">
            <div className="flex items-center gap-2 mb-4">
              <CalendarClock className="w-4 h-4 text-[#0F2D5E]" />
              <h2 className="text-sm font-bold font-serif text-[#0F2D5E] uppercase tracking-wide">Timeline Recommendation</h2>
            </div>
            <div className="space-y-3 text-sm">
              <div className="flex justify-between"><span className="text-gray-500 font-medium">Recommended Duration</span><span className="font-semibold text-[#0F2D5E]">3–5 Business Days</span></div>
              <div className="flex justify-between items-center">
                <span className="text-gray-500 font-medium">Stage Progress</span>
                <div className="flex items-center gap-2">
                  <div className="w-20 h-1.5 bg-gray-200 rounded-full overflow-hidden">
                    <div className="h-full bg-blue-500 rounded-full" style={{ width: '75%' }} />
                  </div>
                  <span className="text-gray-700 font-medium">75%</span>
                </div>
              </div>
              <div className="flex justify-between items-center"><span className="text-gray-500 font-medium">Delay Risk</span><span className="px-2 py-0.5 bg-amber-100 text-amber-800 rounded-full text-xs font-semibold">Moderate</span></div>
              <div className="flex justify-between"><span className="text-gray-500 font-medium">Next Stage Est.</span><span className="font-semibold text-gray-700">{new Date(Date.now() + 2 * 24 * 60 * 60 * 1000).toLocaleDateString()}</span></div>
              <div className="flex justify-between items-center"><span className="text-gray-500 font-medium">Confidence Score</span><span className="px-2 py-0.5 bg-blue-100 text-blue-800 rounded-full text-xs font-semibold">Moderate</span></div>
              <div className="flex justify-between"><span className="text-gray-500 font-medium">Remaining Est.</span><span className="font-semibold text-gray-700">~1 day</span></div>
            </div>
          </div>
        </div>

        {/* Alerts */}
        <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-5">
          <div className="flex items-center gap-2 mb-4">
            <Bell className="w-4 h-4 text-[#0F2D5E]" />
            <h2 className="text-base font-bold font-serif text-[#0F2D5E] uppercase tracking-wide">Alerts & Notifications</h2>
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
            <button className="flex items-center gap-1.5 px-4 py-2 text-sm font-medium text-gray-700 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors">
              <Upload className="w-4 h-4" /> Upload Typeset File
            </button>
          </div>
          <div className="flex items-center gap-2">
            <button onClick={() => handleDecisionClick('request_revision')} className="flex items-center gap-1.5 px-4 py-2 text-sm font-semibold text-amber-700 bg-amber-50 border border-amber-200 rounded-lg hover:bg-amber-500 hover:text-white transition-colors">
              <RotateCcw className="w-4 h-4" /> Request Revision
            </button>
            <button onClick={() => handleDecisionClick('send_editor')} className="flex items-center gap-1.5 px-5 py-2 text-sm font-semibold text-white bg-[#0F2D5E] rounded-lg hover:bg-[#252b3d] transition-colors">
              <Send className="w-4 h-4" /> Send to Editor for Review
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
              <div className={`p-2 rounded-lg ${decision === 'send_editor' ? 'bg-emerald-100' : 'bg-amber-100'}`}>
                {decision === 'send_editor' ? <Send className="w-5 h-5 text-emerald-600" /> : <RotateCcw className="w-5 h-5 text-amber-600" />}
              </div>
              <div>
                <h3 className="font-bold text-gray-900">Confirm Submission</h3>
                <p className="text-xs text-gray-500">This will update the manuscript workflow</p>
              </div>
            </div>
            <div className="bg-gray-50 rounded-lg p-4 mb-4 space-y-1.5 text-sm">
              <p><span className="text-gray-500">Action:</span> <span className="font-semibold">{decision === 'send_editor' ? 'Send to Editor for Review' : 'Request Layout Revision'}</span></p>
              <p><span className="text-gray-500">Manuscript:</span> <span className="font-medium text-xs">{manuscript.title}</span></p>
              <p><span className="text-gray-500">Next Stage:</span> <span className="font-medium">{decision === 'send_editor' ? 'Editor Layout Review' : 'Layout Revision'}</span></p>
            </div>
            <p className="text-sm text-gray-600 mb-5">
              {decision === 'send_editor'
                ? 'The typeset manuscript will be submitted to the editor for layout validation and review. Ensure all checklist items are complete before confirming.'
                : 'The layout will be flagged for revision and returned to the revision queue with your notes attached.'}
            </p>
            <div className="flex gap-3">
              <button onClick={() => setShowConfirmModal(false)} className="flex-1 px-4 py-2 text-sm font-medium text-gray-700 border border-gray-300 rounded-lg hover:bg-gray-50">Cancel</button>
              <button onClick={handleConfirm} className={`flex-1 px-4 py-2 text-sm font-semibold text-white rounded-lg ${decision === 'send_editor' ? 'bg-emerald-600 hover:bg-emerald-700' : 'bg-amber-500 hover:bg-amber-600'}`}>
                Confirm {decision === 'send_editor' ? 'Send' : 'Request'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
