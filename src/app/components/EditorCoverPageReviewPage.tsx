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
  ChevronRight,
  Paperclip,
  XCircle,
  Info,
  PauseCircle,
  Image,
  Layers,
  Palette,
  BookOpen,
  CalendarClock,
  TrendingUp,
  Star,
  User,
  History,
  Bell,
  Activity,
} from 'lucide-react';
import type { Manuscript } from '../types';

interface EditorCoverPageReviewPageProps {
  manuscript: Manuscript;
  onBack: () => void;
}

type PageStatus =
  | 'under_review'
  | 'draft_saved'
  | 'awaiting_author'
  | 'returned_layout'
  | 'approved'
  | 'ready_author_review'
  | 'on_hold'
  | 'review_completed';

type ReviewDecision = 'send_author' | 'return_layout' | 'hold' | null;

interface ValidationItem {
  id: string;
  label: string;
  status: 'complete' | 'warning' | 'unresolved';
}

interface CoverFile {
  id: string;
  name: string;
  size: string;
  type: string;
  status: 'uploaded' | 'pending' | 'draft';
  date: Date;
}

export function EditorCoverPageReviewPage({ manuscript, onBack }: EditorCoverPageReviewPageProps) {
  const [pageStatus, setPageStatus] = useState<PageStatus>('under_review');
  const [decision, setDecision] = useState<ReviewDecision>(null);
  const [showConfirmModal, setShowConfirmModal] = useState(false);
  const [activePreview, setActivePreview] = useState<'front' | 'back' | 'spine'>('front');
  const [editorialNotes, setEditorialNotes] = useState('');
  const [correctionRequests, setCorrectionRequests] = useState('');
  const [improvementRemarks, setImprovementRemarks] = useState('');
  const [authorInstructions, setAuthorInstructions] = useState('');
  const [publicationNotes, setPublicationNotes] = useState('');

  const validationItems: ValidationItem[] = [
    { id: 'v1', label: 'Journal branding verified', status: 'complete' },
    { id: 'v2', label: 'Title formatting validated', status: 'complete' },
    { id: 'v3', label: 'Author details placement verified', status: 'complete' },
    { id: 'v4', label: 'Typography consistency checked', status: 'warning' },
    { id: 'v5', label: 'Cover dimensions validated', status: 'complete' },
    { id: 'v6', label: 'Color palette compliance verified', status: 'complete' },
    { id: 'v7', label: 'Print-readiness confirmed', status: 'warning' },
    { id: 'v8', label: 'Layout quality approved', status: 'complete' },
  ];

  const completeCount = validationItems.filter(i => i.status === 'complete').length;
  const warningCount = validationItems.filter(i => i.status === 'warning').length;
  const unresolvedCount = validationItems.filter(i => i.status === 'unresolved').length;
  const completeness = Math.round((completeCount / validationItems.length) * 100);

  const assessmentCards = [
    { label: 'Branding Consistency', score: 96, badge: 'Validated', color: 'green' },
    { label: 'Typography Quality', score: 89, badge: 'Minor Issues', color: 'amber' },
    { label: 'Layout Alignment', score: 93, badge: 'Good', color: 'green' },
    { label: 'Print Readiness', score: 84, badge: 'Nearly Ready', color: 'blue' },
    { label: 'Publication Presentation', score: 91, badge: 'Approved', color: 'green' },
  ];

  const workflowStages = [
    'Submission',
    'Review',
    'Revision',
    'Copyediting',
    'Final Revisions',
    'Cover Page Design',
    'Editor Cover Review',
    'Author Cover Approval',
  ];
  const currentStageIndex = 6;

  const coverFiles: CoverFile[] = [
    { id: 'f1', name: 'cover-design-v2-final.pdf', size: '4.8 MB', type: 'Print-Ready PDF', status: 'uploaded', date: new Date(Date.now() - 2 * 60 * 60 * 1000) },
    { id: 'f2', name: 'cover-design-v2.ai', size: '18.2 MB', type: 'Editable Source (AI)', status: 'uploaded', date: new Date(Date.now() - 2 * 60 * 60 * 1000) },
    { id: 'f3', name: 'cover-mockup-v2.png', size: '3.1 MB', type: 'Mockup Preview', status: 'uploaded', date: new Date(Date.now() - 3 * 60 * 60 * 1000) },
    { id: 'f4', name: 'spine-layout-v1.pdf', size: '1.2 MB', type: 'Spine Layout', status: 'uploaded', date: new Date(Date.now() - 4 * 60 * 60 * 1000) },
    { id: 'f5', name: 'print-specifications.pdf', size: '0.4 MB', type: 'Print Specs', status: 'pending', date: new Date() },
    { id: 'f6', name: 'annotation-references.pdf', size: '0.6 MB', type: 'Layout Annotations', status: 'uploaded', date: new Date(Date.now() - 5 * 60 * 60 * 1000) },
  ];

  const revisionHistory = [
    { id: 'r1', version: 'v1.0', date: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000), note: 'Initial cover design submitted by layout artist', status: 'Returned' },
    { id: 'r2', version: 'v1.1', date: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000), note: 'Spine text repositioned, author list updated', status: 'Returned' },
    { id: 'r3', version: 'v2.0', date: new Date(Date.now() - 1 * 60 * 60 * 1000), note: 'ISBN placeholder corrected, dimensions adjusted', status: 'Current' },
  ];

  const designHistory = [
    { id: 'h1', date: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000), event: 'Cover design task assigned to Layout Artist', actor: 'Maria Rodriguez', badge: 'Assigned' },
    { id: 'h2', date: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000), event: 'Cover design v1.0 submitted for editor review', actor: 'Emma Thompson', badge: 'Submitted' },
    { id: 'h3', date: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000), event: 'Editor returned cover — spine and ISBN corrections required', actor: 'Dr. Sarah Johnson', badge: 'Returned' },
    { id: 'h4', date: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000), event: 'Cover design v1.1 resubmitted after spine corrections', actor: 'Emma Thompson', badge: 'Submitted' },
    { id: 'h5', date: new Date(Date.now() - 5 * 60 * 60 * 1000), event: 'Cover design v2.0 finalized and submitted for editorial review', actor: 'Emma Thompson', badge: 'Current' },
  ];

  const activityLog = [
    { id: 'a1', timestamp: new Date(Date.now() - 1 * 60 * 60 * 1000), action: 'Editor cover review session opened for v2.0', user: 'Dr. Sarah Johnson' },
    { id: 'a2', timestamp: new Date(Date.now() - 2 * 60 * 60 * 1000), action: 'Print-ready PDF v2.0 downloaded for offline review', user: 'Dr. Sarah Johnson' },
    { id: 'a3', timestamp: new Date(Date.now() - 5 * 60 * 60 * 1000), action: 'Cover design v2.0 received from Layout Artist Emma Thompson', user: 'System' },
    { id: 'a4', timestamp: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000), action: 'Layout revision request sent to Emma Thompson for spine correction', user: 'Dr. Sarah Johnson' },
    { id: 'a5', timestamp: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000), action: 'Initial cover design v1.0 reviewed — returned for revisions', user: 'Dr. Sarah Johnson' },
  ];

  const alerts = [
    { id: 'al1', type: 'warning', message: 'Typography inconsistency flagged — verify heading weight matches journal style guide.' },
    { id: 'al2', type: 'warning', message: 'Print-readiness validation pending — confirm bleed area and resolution before sending to author.' },
    { id: 'al3', type: 'deadline', message: 'Editorial review deadline: 2 days remaining. Timely action required.' },
    { id: 'al4', type: 'info', message: 'Cover design v2.0 uploaded successfully by Emma Thompson and ready for review.' },
  ];

  const layoutSubmissionDate = new Date(Date.now() - 5 * 60 * 60 * 1000);
  const reviewDeadline = new Date(Date.now() + 2 * 24 * 60 * 60 * 1000);

  const layoutAnnotations = [
    { id: 'la1', label: 'Front Cover Margin Notes', page: 'Front', icon: <Paperclip className="w-3.5 h-3.5" /> },
    { id: 'la2', label: 'Spine Alignment Reference', page: 'Spine', icon: <Paperclip className="w-3.5 h-3.5" /> },
    { id: 'la3', label: 'Back Cover Text Placement', page: 'Back', icon: <Paperclip className="w-3.5 h-3.5" /> },
    { id: 'la4', label: 'Color Bleed Specification', page: 'All', icon: <Paperclip className="w-3.5 h-3.5" /> },
  ];

  const getStatusConfig = () => {
    const map: Record<PageStatus, { label: string; textColor: string; bgColor: string }> = {
      under_review: { label: 'Under Cover Design Review', textColor: 'text-blue-800', bgColor: 'bg-blue-100' },
      draft_saved: { label: 'Validation Draft Saved', textColor: 'text-gray-800', bgColor: 'bg-gray-100' },
      awaiting_author: { label: 'Awaiting Author Approval', textColor: 'text-purple-800', bgColor: 'bg-purple-100' },
      returned_layout: { label: 'Returned to Layout Artist', textColor: 'text-amber-800', bgColor: 'bg-amber-100' },
      approved: { label: 'Cover Design Approved', textColor: 'text-green-800', bgColor: 'bg-green-100' },
      ready_author_review: { label: 'Ready for Author Review', textColor: 'text-emerald-800', bgColor: 'bg-emerald-100' },
      on_hold: { label: 'Validation On Hold', textColor: 'text-red-800', bgColor: 'bg-red-100' },
      review_completed: { label: 'Editorial Review Completed', textColor: 'text-indigo-800', bgColor: 'bg-indigo-100' },
    };
    return map[pageStatus];
  };

  const statusCfg = getStatusConfig();

  const getItemIcon = (status: ValidationItem['status']) => {
    if (status === 'complete') return <CheckCircle className="w-4 h-4 text-green-600" />;
    if (status === 'warning') return <AlertCircle className="w-4 h-4 text-amber-500" />;
    return <XCircle className="w-4 h-4 text-red-500" />;
  };

  const getFileBadge = (status: string) => {
    if (status === 'uploaded') return 'bg-green-100 text-green-800';
    if (status === 'pending') return 'bg-amber-100 text-amber-800';
    return 'bg-gray-100 text-gray-700';
  };

  const getFileLabel = (status: string) => {
    if (status === 'uploaded') return 'Uploaded';
    if (status === 'pending') return 'Pending';
    return 'Draft';
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
    if (d === 'send_author') return 'Send Cover Design to Author';
    if (d === 'return_layout') return 'Return to Layout Artist';
    if (d === 'hold') return 'Hold for Additional Validation';
    return '';
  };

  return (
    <div className="min-h-screen bg-[#F7F8FA]">

      {/* Sticky Header */}
      <div className="sticky top-0 z-50 bg-[#0F2D5E] text-white shadow-md">
        <div className="max-w-7xl mx-auto px-6 py-3 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <button
              onClick={onBack}
              className="flex items-center gap-2 text-sm text-slate-300 hover:text-white transition-colors"
            >
              <ArrowLeft className="w-4 h-4" />
              Back to Dashboard
            </button>
            <div className="w-px h-5 bg-slate-600" />
            <div>
              <p className="text-xs text-slate-400 uppercase tracking-wider font-medium">Editor — Cover Page Review</p>
              <h1 className="text-base font-bold font-serif leading-tight truncate max-w-lg">{manuscript.title}</h1>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <span className={`text-xs font-semibold px-3 py-1 rounded-full ${statusCfg.bgColor} ${statusCfg.textColor}`}>
              {statusCfg.label}
            </span>
            <div className="text-right">
              <p className="text-xs text-slate-400">Review Deadline</p>
              <p className="text-sm font-semibold text-amber-300">{reviewDeadline.toLocaleDateString()}</p>
            </div>
          </div>
        </div>

        {/* Workflow Progress Bar */}
        <div className="bg-[#141824] border-t border-slate-700 px-6 py-2">
          <div className="max-w-7xl mx-auto flex items-center gap-0 overflow-x-auto">
            {workflowStages.map((stage, idx) => (
              <React.Fragment key={stage}>
                <div className="flex flex-col items-center flex-shrink-0">
                  <div className={`w-5 h-5 rounded-full flex items-center justify-center text-xs font-bold border-2 ${
                    idx < currentStageIndex
                      ? 'bg-emerald-500 border-emerald-500 text-white'
                      : idx === currentStageIndex
                      ? 'bg-white border-white text-[#0F2D5E]'
                      : 'bg-transparent border-slate-600 text-slate-500'
                  }`}>
                    {idx < currentStageIndex ? <CheckCircle className="w-3 h-3" /> : idx + 1}
                  </div>
                  <span className={`text-[9px] mt-1 whitespace-nowrap font-medium ${
                    idx === currentStageIndex ? 'text-white' : idx < currentStageIndex ? 'text-emerald-400' : 'text-slate-500'
                  }`}>{stage}</span>
                </div>
                {idx < workflowStages.length - 1 && (
                  <div className={`h-px flex-1 min-w-[16px] mx-1 mb-4 ${idx < currentStageIndex ? 'bg-emerald-500' : 'bg-slate-700'}`} />
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
              <div><span className="text-gray-500 font-medium">Manuscript Title:</span><p className="text-gray-900 font-semibold leading-snug mt-0.5">{manuscript.title}</p></div>
              <div><span className="text-gray-500 font-medium">Authors & Affiliations:</span><p className="text-gray-800 mt-0.5">Dr. Jane Smith · University of Cambridge</p></div>
              <div><span className="text-gray-500 font-medium">Journal Category:</span><p className="text-gray-800 mt-0.5">{manuscript.journal}</p></div>
            </div>
            <div className="space-y-2 text-sm">
              <div><span className="text-gray-500 font-medium">Submission Date:</span><p className="text-gray-800 mt-0.5">{new Date(manuscript.submissionDate).toLocaleDateString()}</p></div>
              <div><span className="text-gray-500 font-medium">Cover Design Submitted:</span><p className="text-gray-800 mt-0.5">{layoutSubmissionDate.toLocaleDateString()} {layoutSubmissionDate.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</p></div>
              <div className="flex gap-4">
                <div><span className="text-gray-500 font-medium">Version:</span><p className="text-gray-800 mt-0.5 font-semibold">v2.0</p></div>
                <div><span className="text-gray-500 font-medium">Workflow Stage:</span><p className="text-gray-800 mt-0.5">Editor Cover Review</p></div>
              </div>
            </div>
          </div>
          <div className="flex gap-2 flex-wrap">
            <button className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium text-[#0F2D5E] border border-[#1a1f2e] rounded-lg hover:bg-[#0F2D5E] hover:text-white transition-colors">
              <Eye className="w-3.5 h-3.5" /> View Manuscript
            </button>
            <button className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium text-gray-700 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors">
              <Download className="w-3.5 h-3.5" /> Download Files
            </button>
            <button className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium text-gray-700 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors">
              <Paperclip className="w-3.5 h-3.5" /> View Layout Notes
            </button>
          </div>
        </div>

        {/* SECTION 2 — Cover Design Validation Panel */}
        <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-5">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-2">
              <CheckCircle className="w-4 h-4 text-[#0F2D5E]" />
              <h2 className="text-base font-bold font-serif text-[#0F2D5E] uppercase tracking-wide">Cover Design Validation</h2>
            </div>
            <div className="flex items-center gap-2">
              {warningCount > 0 && (
                <span className="text-xs px-2 py-0.5 bg-amber-100 text-amber-800 rounded-full font-semibold">{warningCount} Warning{warningCount !== 1 ? 's' : ''}</span>
              )}
              {unresolvedCount > 0 && (
                <span className="text-xs px-2 py-0.5 bg-red-100 text-red-800 rounded-full font-semibold">{unresolvedCount} Unresolved</span>
              )}
              <span className="text-xs px-2 py-0.5 bg-green-100 text-green-800 rounded-full font-semibold">{completeCount}/{validationItems.length} Complete</span>
            </div>
          </div>

          {/* Progress bar */}
          <div className="mb-4">
            <div className="flex items-center justify-between text-xs text-gray-500 mb-1">
              <span>Overall Validation Progress</span>
              <span className="font-semibold text-gray-700">{completeness}%</span>
            </div>
            <div className="h-2 bg-gray-100 rounded-full overflow-hidden">
              <div
                className="h-full bg-gradient-to-r from-emerald-500 to-emerald-400 rounded-full transition-all"
                style={{ width: `${completeness}%` }}
              />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
            {validationItems.map((item) => (
              <div key={item.id} className={`flex items-center gap-3 px-3 py-2.5 rounded-lg border ${
                item.status === 'complete' ? 'bg-green-50 border-green-100' :
                item.status === 'warning' ? 'bg-amber-50 border-amber-100' :
                'bg-red-50 border-red-100'
              }`}>
                {getItemIcon(item.status)}
                <span className="text-sm text-gray-800 font-medium">{item.label}</span>
              </div>
            ))}
          </div>
        </div>

        {/* SECTION 3 — Cover Design Review Panel */}
        <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-5">
          <div className="flex items-center gap-2 mb-4">
            <Palette className="w-4 h-4 text-[#0F2D5E]" />
            <h2 className="text-base font-bold font-serif text-[#0F2D5E] uppercase tracking-wide">Cover Design Preview</h2>
          </div>

          {/* Tab switcher */}
          <div className="flex gap-1 mb-4 bg-gray-100 rounded-lg p-1 w-fit">
            {(['front', 'back', 'spine'] as const).map((tab) => (
              <button
                key={tab}
                onClick={() => setActivePreview(tab)}
                className={`px-4 py-1.5 rounded-md text-xs font-semibold transition-all capitalize ${
                  activePreview === tab ? 'bg-white text-[#0F2D5E] shadow-sm' : 'text-gray-500 hover:text-gray-700'
                }`}
              >
                {tab === 'front' ? 'Front Cover' : tab === 'back' ? 'Back Cover' : 'Spine Layout'}
              </button>
            ))}
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
            {/* Preview panel */}
            <div className="flex items-center justify-center">
              {activePreview === 'front' && (
                <div className="w-52 bg-gradient-to-b from-[#1a1f2e] via-[#2a3048] to-[#1a1f2e] rounded-lg shadow-xl p-5 flex flex-col justify-between" style={{ minHeight: '280px' }}>
                  <div>
                    <div className="w-6 h-0.5 bg-amber-400 mb-3" />
                    <p className="text-amber-300 text-[8px] uppercase tracking-widest font-semibold mb-2">{manuscript.journal}</p>
                    <h3 className="text-white text-xs font-bold font-serif leading-tight mb-3">{manuscript.title}</h3>
                    <p className="text-slate-400 text-[8px]">Dr. Jane Smith</p>
                    <p className="text-slate-500 text-[8px]">University of Cambridge</p>
                  </div>
                  <div className="text-center">
                    <div className="w-full h-px bg-slate-600 mb-2" />
                    <p className="text-slate-500 text-[8px]">Vol. 12 · No. 3 · 2026</p>
                    <p className="text-slate-500 text-[8px]">ISSN 1234-5678</p>
                    <div className="mt-2 bg-slate-700 rounded px-2 py-1">
                      <p className="text-slate-400 text-[8px] font-mono">ISBN 978-0-000-00000-0</p>
                    </div>
                  </div>
                </div>
              )}
              {activePreview === 'back' && (
                <div className="w-52 bg-gradient-to-b from-[#2a3048] to-[#1a1f2e] rounded-lg shadow-xl p-5 flex flex-col justify-between" style={{ minHeight: '280px' }}>
                  <div>
                    <p className="text-amber-300 text-[8px] uppercase tracking-widest font-semibold mb-3">{manuscript.journal}</p>
                    <p className="text-slate-300 text-[8px] leading-relaxed mb-4">An in-depth exploration of current developments in academic research and scholarly discourse across interdisciplinary fields.</p>
                  </div>
                  <div>
                    <div className="w-full h-px bg-slate-600 mb-3" />
                    <div className="flex justify-between items-end">
                      <div>
                        <p className="text-slate-500 text-[8px] mb-1">ISSN 1234-5678</p>
                        <div className="bg-white rounded px-1 py-0.5 w-14">
                          <div className="flex gap-px">
                            {Array.from({ length: 12 }).map((_, i) => (
                              <div key={i} className={`w-px bg-black ${i % 3 === 0 ? 'h-5' : 'h-3'}`} />
                            ))}
                          </div>
                          <p className="text-[5px] text-black text-center mt-0.5 font-mono">978-0-000-00000-0</p>
                        </div>
                      </div>
                      <div className="text-right">
                        <p className="text-slate-500 text-[8px]">Vol. 12</p>
                        <p className="text-amber-400 text-[8px] font-bold">2026</p>
                      </div>
                    </div>
                  </div>
                </div>
              )}
              {activePreview === 'spine' && (
                <div
                  className="h-52 bg-[#0F2D5E] rounded-md shadow-xl flex flex-col items-center justify-between py-4"
                  style={{ width: '48px', writingMode: 'vertical-rl', textOrientation: 'mixed' }}
                >
                  <p className="text-amber-300 text-[8px] uppercase tracking-widest font-semibold" style={{ writingMode: 'vertical-rl' }}>
                    {manuscript.journal.substring(0, 16)}
                  </p>
                  <p className="text-white text-[8px] font-serif font-bold leading-none" style={{ writingMode: 'vertical-rl' }}>
                    {manuscript.title.substring(0, 24)}
                  </p>
                  <p className="text-slate-400 text-[7px]" style={{ writingMode: 'vertical-rl' }}>2026</p>
                </div>
              )}
            </div>

            {/* Revision history & annotations */}
            <div className="space-y-3">
              <div>
                <p className="text-xs font-semibold text-gray-700 uppercase tracking-wide mb-2">Uploaded Design Versions</p>
                <div className="space-y-1.5">
                  {revisionHistory.map((rev) => (
                    <div key={rev.id} className="flex items-center justify-between px-3 py-2 bg-gray-50 rounded-lg border border-gray-100 text-xs">
                      <div className="flex items-center gap-2">
                        <span className="font-bold text-[#0F2D5E]">{rev.version}</span>
                        <span className="text-gray-500">{rev.date.toLocaleDateString()}</span>
                        <span className="text-gray-600 truncate max-w-[160px]">{rev.note}</span>
                      </div>
                      <span className={`px-2 py-0.5 rounded-full font-semibold text-[10px] ${
                        rev.status === 'Current' ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-600'
                      }`}>{rev.status}</span>
                    </div>
                  ))}
                </div>
              </div>
              <div>
                <p className="text-xs font-semibold text-gray-700 uppercase tracking-wide mb-2">Layout Annotation References</p>
                <div className="space-y-1.5">
                  {layoutAnnotations.map((la) => (
                    <div key={la.id} className="flex items-center gap-2 px-3 py-2 bg-blue-50 rounded-lg border border-blue-100 text-xs">
                      <span className="text-blue-500">{la.icon}</span>
                      <span className="text-gray-700 flex-1">{la.label}</span>
                      <span className="text-blue-600 font-medium">{la.page}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* SECTION 4 — Editorial Assessment Panel */}
        <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-5">
          <div className="flex items-center gap-2 mb-4">
            <Star className="w-4 h-4 text-[#0F2D5E]" />
            <h2 className="text-base font-bold font-serif text-[#0F2D5E] uppercase tracking-wide">Editorial Assessment</h2>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
            {assessmentCards.map((card) => (
              <div key={card.label} className="p-4 bg-gray-50 rounded-xl border border-gray-100">
                <div className="flex items-center justify-between mb-2">
                  <p className="text-xs font-semibold text-gray-600">{card.label}</p>
                  <span className={`text-xs px-2 py-0.5 rounded-full font-semibold ${
                    card.color === 'green' ? 'bg-green-100 text-green-700' :
                    card.color === 'amber' ? 'bg-amber-100 text-amber-700' :
                    'bg-blue-100 text-blue-700'
                  }`}>{card.badge}</span>
                </div>
                <p className={`text-2xl font-bold mb-2 ${getScoreColor(card.score)}`}>{card.score}<span className="text-sm font-normal text-gray-400">%</span></p>
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
            <FileText className="w-4 h-4 text-[#0F2D5E]" />
            <h2 className="text-base font-bold font-serif text-[#0F2D5E] uppercase tracking-wide">Editorial Decision</h2>
          </div>

          <div className="space-y-4 mb-5">
            <div>
              <label className="block text-xs font-semibold text-gray-700 mb-1">Editorial Review Notes <span className="text-red-500">*</span></label>
              <textarea
                value={editorialNotes}
                onChange={e => setEditorialNotes(e.target.value)}
                rows={3}
                placeholder="Provide your overall editorial assessment of the cover design quality and readiness..."
                className="w-full text-sm border border-gray-200 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-[#1a1f2e] resize-none text-gray-800 placeholder-gray-400"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-gray-700 mb-1">Layout Correction Requests</label>
              <textarea
                value={correctionRequests}
                onChange={e => setCorrectionRequests(e.target.value)}
                rows={3}
                placeholder="List any specific layout corrections required before author approval..."
                className="w-full text-sm border border-gray-200 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-[#1a1f2e] resize-none text-gray-800 placeholder-gray-400"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-gray-700 mb-1">Design Improvement Remarks</label>
              <textarea
                value={improvementRemarks}
                onChange={e => setImprovementRemarks(e.target.value)}
                rows={2}
                placeholder="Suggest any design improvements or enhancements for consideration..."
                className="w-full text-sm border border-gray-200 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-[#1a1f2e] resize-none text-gray-800 placeholder-gray-400"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-gray-700 mb-1">Author Review Instructions</label>
              <textarea
                value={authorInstructions}
                onChange={e => setAuthorInstructions(e.target.value)}
                rows={2}
                placeholder="Provide instructions for the author on what to review and approve in the cover design..."
                className="w-full text-sm border border-gray-200 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-[#1a1f2e] resize-none text-gray-800 placeholder-gray-400"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-gray-700 mb-1">Publication Preparation Notes</label>
              <textarea
                value={publicationNotes}
                onChange={e => setPublicationNotes(e.target.value)}
                rows={2}
                placeholder="Add any notes relevant to production readiness and publication timeline..."
                className="w-full text-sm border border-gray-200 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-[#1a1f2e] resize-none text-gray-800 placeholder-gray-400"
              />
            </div>
          </div>

          {/* Decision buttons */}
          <div className="flex flex-wrap gap-3">
            <button
              onClick={() => handleDecisionClick('send_author')}
              className={`flex items-center gap-2 px-5 py-2.5 rounded-lg text-sm font-semibold transition-colors ${
                decision === 'send_author'
                  ? 'bg-emerald-600 text-white ring-2 ring-emerald-400'
                  : 'bg-emerald-50 text-emerald-800 border border-emerald-200 hover:bg-emerald-600 hover:text-white'
              }`}
            >
              <Send className="w-4 h-4" />
              Send Cover Design to Author
            </button>
            <button
              onClick={() => handleDecisionClick('return_layout')}
              className={`flex items-center gap-2 px-5 py-2.5 rounded-lg text-sm font-semibold transition-colors ${
                decision === 'return_layout'
                  ? 'bg-amber-500 text-white ring-2 ring-amber-300'
                  : 'bg-amber-50 text-amber-800 border border-amber-200 hover:bg-amber-500 hover:text-white'
              }`}
            >
              <RotateCcw className="w-4 h-4" />
              Return to Layout Artist
            </button>
            <button
              onClick={() => handleDecisionClick('hold')}
              className={`flex items-center gap-2 px-5 py-2.5 rounded-lg text-sm font-semibold transition-colors ${
                decision === 'hold'
                  ? 'bg-gray-500 text-white ring-2 ring-gray-300'
                  : 'bg-gray-50 text-gray-700 border border-gray-200 hover:bg-gray-500 hover:text-white'
              }`}
            >
              <PauseCircle className="w-4 h-4" />
              Hold for Additional Validation
            </button>
          </div>
        </div>

        {/* SECTION 6 — File Management Panel */}
        <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-5">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-2">
              <Layers className="w-4 h-4 text-[#0F2D5E]" />
              <h2 className="text-base font-bold font-serif text-[#0F2D5E] uppercase tracking-wide">Cover Design Files</h2>
            </div>
            <button className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium bg-[#0F2D5E] text-white rounded-lg hover:bg-[#252b3d] transition-colors">
              <Upload className="w-3.5 h-3.5" /> Upload File
            </button>
          </div>
          <div className="space-y-2">
            {coverFiles.map((file) => (
              <div key={file.id} className="flex items-center justify-between px-4 py-3 bg-gray-50 rounded-lg border border-gray-100 hover:bg-gray-100 transition-colors">
                <div className="flex items-center gap-3 min-w-0">
                  <FileText className="w-4 h-4 text-gray-400 flex-shrink-0" />
                  <div className="min-w-0">
                    <p className="text-sm font-medium text-gray-900 truncate">{file.name}</p>
                    <p className="text-xs text-gray-500">{file.type} · {file.size} · {file.date.toLocaleDateString()}</p>
                  </div>
                </div>
                <div className="flex items-center gap-2 flex-shrink-0 ml-3">
                  <span className={`text-xs px-2 py-0.5 rounded-full font-medium ${getFileBadge(file.status)}`}>
                    {getFileLabel(file.status)}
                  </span>
                  <button className="p-1.5 text-gray-400 hover:text-[#0F2D5E] transition-colors">
                    <Download className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* SECTION 7 + 8 — Workflow Status & Timeline side by side */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          {/* Workflow Status */}
          <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-5">
            <div className="flex items-center gap-2 mb-4">
              <Activity className="w-4 h-4 text-[#0F2D5E]" />
              <h2 className="text-sm font-bold font-serif text-[#0F2D5E] uppercase tracking-wide">Workflow Status</h2>
            </div>
            <div className="space-y-3 text-sm">
              <div className="flex justify-between">
                <span className="text-gray-500 font-medium">Current Stage</span>
                <span className="font-semibold text-[#0F2D5E]">Editor Cover Review</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-500 font-medium">Next Stage</span>
                <span className="font-semibold text-gray-700">Author Cover Approval</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-500 font-medium">Review Deadline</span>
                <span className="font-semibold text-amber-700">{reviewDeadline.toLocaleDateString()}</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-gray-500 font-medium">Delay Risk</span>
                <span className="px-2 py-0.5 bg-amber-100 text-amber-800 rounded-full text-xs font-semibold">Moderate</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-500 font-medium">Last Updated</span>
                <span className="font-medium text-gray-700">{new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })} today</span>
              </div>
            </div>
          </div>

          {/* Timeline Recommendation */}
          <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-5">
            <div className="flex items-center gap-2 mb-4">
              <CalendarClock className="w-4 h-4 text-[#0F2D5E]" />
              <h2 className="text-sm font-bold font-serif text-[#0F2D5E] uppercase tracking-wide">Timeline Recommendation</h2>
            </div>
            <div className="space-y-3 text-sm">
              <div className="flex justify-between">
                <span className="text-gray-500 font-medium">Recommended Duration</span>
                <span className="font-semibold text-[#0F2D5E]">2–3 Business Days</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-gray-500 font-medium">Stage Progress</span>
                <div className="flex items-center gap-2">
                  <div className="w-20 h-1.5 bg-gray-200 rounded-full overflow-hidden">
                    <div className="h-full bg-blue-500 rounded-full" style={{ width: '30%' }} />
                  </div>
                  <span className="text-gray-700 font-medium">30%</span>
                </div>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-gray-500 font-medium">Delay Risk</span>
                <span className="px-2 py-0.5 bg-amber-100 text-amber-800 rounded-full text-xs font-semibold">Moderate Delay Risk</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-500 font-medium">Next Stage Est.</span>
                <span className="font-semibold text-gray-700">{new Date(Date.now() + 3 * 24 * 60 * 60 * 1000).toLocaleDateString()}</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-gray-500 font-medium">Timeline Confidence</span>
                <span className="px-2 py-0.5 bg-blue-100 text-blue-800 rounded-full text-xs font-semibold">Moderate</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-500 font-medium">Remaining Est.</span>
                <span className="font-semibold text-gray-700">~2 days</span>
              </div>
              <div className="pt-1 border-t border-gray-100">
                <p className="text-xs text-gray-400">Last reassessed: Today at {new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</p>
              </div>
            </div>
          </div>
        </div>

        {/* SECTION 9 — Design & Revision History */}
        <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-5">
          <div className="flex items-center gap-2 mb-4">
            <History className="w-4 h-4 text-[#0F2D5E]" />
            <h2 className="text-base font-bold font-serif text-[#0F2D5E] uppercase tracking-wide">Design & Revision History</h2>
          </div>
          <div className="space-y-3">
            {designHistory.map((item, idx) => (
              <div key={item.id} className="flex gap-3">
                <div className="flex flex-col items-center">
                  <div className={`w-7 h-7 rounded-full flex items-center justify-center flex-shrink-0 ${
                    idx === designHistory.length - 1 ? 'bg-[#0F2D5E]' : 'bg-gray-200'
                  }`}>
                    <span className="text-[10px] font-bold text-white">{designHistory.length - idx}</span>
                  </div>
                  {idx < designHistory.length - 1 && <div className="w-px flex-1 bg-gray-200 my-1" />}
                </div>
                <div className="pb-3 flex-1">
                  <div className="flex items-center gap-2 flex-wrap mb-0.5">
                    <span className={`text-[10px] px-2 py-0.5 rounded-full font-semibold ${
                      item.badge === 'Current' ? 'bg-green-100 text-green-700' :
                      item.badge === 'Returned' ? 'bg-amber-100 text-amber-700' :
                      item.badge === 'Submitted' ? 'bg-blue-100 text-blue-700' :
                      'bg-gray-100 text-gray-600'
                    }`}>{item.badge}</span>
                    <span className="text-xs text-gray-500">{item.date.toLocaleDateString()}</span>
                  </div>
                  <p className="text-sm text-gray-800 font-medium">{item.event}</p>
                  <p className="text-xs text-gray-500">{item.actor}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* SECTION 10 — Alerts & Notifications */}
        <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-5">
          <div className="flex items-center gap-2 mb-4">
            <Bell className="w-4 h-4 text-[#0F2D5E]" />
            <h2 className="text-base font-bold font-serif text-[#0F2D5E] uppercase tracking-wide">Alerts & Notifications</h2>
          </div>
          <div className="space-y-2">
            {alerts.map((alert) => (
              <div key={alert.id} className={`flex items-start gap-3 px-4 py-3 rounded-lg border text-sm ${
                alert.type === 'warning' ? 'bg-amber-50 border-amber-100' :
                alert.type === 'deadline' ? 'bg-red-50 border-red-100' :
                'bg-blue-50 border-blue-100'
              }`}>
                {alert.type === 'warning' && <AlertTriangle className="w-4 h-4 text-amber-500 flex-shrink-0 mt-0.5" />}
                {alert.type === 'deadline' && <AlertCircle className="w-4 h-4 text-red-500 flex-shrink-0 mt-0.5" />}
                {alert.type === 'info' && <Info className="w-4 h-4 text-blue-500 flex-shrink-0 mt-0.5" />}
                <p className={`text-sm ${
                  alert.type === 'warning' ? 'text-amber-800' :
                  alert.type === 'deadline' ? 'text-red-800' :
                  'text-blue-800'
                }`}>{alert.message}</p>
              </div>
            ))}
          </div>
        </div>

        {/* SECTION 11 — Activity Log */}
        <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-5 mb-24">
          <div className="flex items-center gap-2 mb-4">
            <Activity className="w-4 h-4 text-[#0F2D5E]" />
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
            <button
              onClick={() => setPageStatus('draft_saved')}
              className="flex items-center gap-1.5 px-4 py-2 text-sm font-medium text-gray-700 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
            >
              <Save className="w-4 h-4" /> Save Draft
            </button>
            <button className="flex items-center gap-1.5 px-4 py-2 text-sm font-medium text-gray-700 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors">
              <Eye className="w-4 h-4" /> Preview Cover Design
            </button>
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={() => handleDecisionClick('return_layout')}
              className="flex items-center gap-1.5 px-4 py-2 text-sm font-semibold text-amber-700 bg-amber-50 border border-amber-200 rounded-lg hover:bg-amber-500 hover:text-white transition-colors"
            >
              <RotateCcw className="w-4 h-4" /> Return to Layout Artist
            </button>
            <button
              onClick={() => handleDecisionClick('send_author')}
              className="flex items-center gap-1.5 px-5 py-2 text-sm font-semibold text-white bg-[#0F2D5E] rounded-lg hover:bg-[#252b3d] transition-colors"
            >
              <Send className="w-4 h-4" /> Send Cover Design to Author
            </button>
            <button
              onClick={onBack}
              className="px-4 py-2 text-sm text-gray-500 hover:text-gray-700 transition-colors"
            >
              Cancel
            </button>
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
                <p className="text-xs text-gray-500">This action will update the manuscript workflow</p>
              </div>
            </div>
            <div className="bg-gray-50 rounded-lg p-4 mb-4 space-y-1.5 text-sm">
              <p><span className="text-gray-500">Decision:</span> <span className="font-semibold text-gray-900">{getDecisionLabel(decision)}</span></p>
              <p><span className="text-gray-500">Manuscript:</span> <span className="font-medium text-gray-800 text-xs">{manuscript.title}</span></p>
              <p><span className="text-gray-500">Current Stage:</span> <span className="font-medium text-gray-800">Editor Cover Review</span></p>
              <p><span className="text-gray-500">Next Stage:</span> <span className="font-medium text-gray-800">
                {decision === 'send_author' ? 'Author Cover Approval' :
                 decision === 'return_layout' ? 'Cover Page Design (Revision)' : 'Validation On Hold'}
              </span></p>
            </div>
            <p className="text-sm text-gray-600 mb-5">
              {decision === 'send_author'
                ? 'The cover design will be sent to the author for review and approval. This will advance the manuscript to the Author Cover Approval stage.'
                : decision === 'return_layout'
                ? 'The cover design will be returned to the Layout Artist with your correction requests. The manuscript will re-enter the design revision stage.'
                : 'The manuscript will be placed on hold pending additional validation. No further workflow progression will occur until released.'}
            </p>
            <div className="flex gap-3">
              <button
                onClick={() => setShowConfirmModal(false)}
                className="flex-1 px-4 py-2 text-sm font-medium text-gray-700 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={handleConfirm}
                className={`flex-1 px-4 py-2 text-sm font-semibold text-white rounded-lg transition-colors ${
                  decision === 'send_author' ? 'bg-emerald-600 hover:bg-emerald-700' :
                  decision === 'return_layout' ? 'bg-amber-500 hover:bg-amber-600' :
                  'bg-gray-700 hover:bg-gray-800'
                }`}
              >
                Confirm {decision === 'send_author' ? 'Send' : decision === 'return_layout' ? 'Return' : 'Hold'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
