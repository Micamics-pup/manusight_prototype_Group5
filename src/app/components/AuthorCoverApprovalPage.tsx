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
  ThumbsUp,
  RotateCcw,
  ChevronRight,
  Paperclip,
  XCircle,
  Info,
  PauseCircle,
  Layers,
  BookOpen,
  CalendarClock,
  Star,
  History,
  Bell,
  Activity,
  Palette,
  User,
  CheckSquare,
} from 'lucide-react';
import type { Manuscript } from '../types';

interface AuthorCoverApprovalPageProps {
  manuscript: Manuscript;
  onBack: () => void;
}

type PageStatus =
  | 'under_review'
  | 'draft_saved'
  | 'awaiting_final'
  | 'minor_revisions'
  | 'additional_revisions'
  | 'approved'
  | 'ready_production'
  | 'on_hold';

type ApprovalDecision = 'approve' | 'minor_revisions' | 'additional_revisions' | null;

interface ReviewItem {
  id: string;
  label: string;
  status: 'complete' | 'warning' | 'issue';
}

interface CoverFile {
  id: string;
  name: string;
  size: string;
  type: string;
  status: 'uploaded' | 'pending' | 'draft';
  date: Date;
}

export function AuthorCoverApprovalPage({ manuscript, onBack }: AuthorCoverApprovalPageProps) {
  const [pageStatus, setPageStatus] = useState<PageStatus>('under_review');
  const [decision, setDecision] = useState<ApprovalDecision>(null);
  const [showConfirmModal, setShowConfirmModal] = useState(false);
  const [activePreview, setActivePreview] = useState<'front' | 'back' | 'spine'>('front');
  const [approvalNotes, setApprovalNotes] = useState('');
  const [correctionRequests, setCorrectionRequests] = useState('');
  const [improvementRemarks, setImprovementRemarks] = useState('');
  const [presentationComments, setPresentationComments] = useState('');
  const [finalRemarks, setFinalRemarks] = useState('');

  const reviewItems: ReviewItem[] = [
    { id: 'r1', label: 'Manuscript title accuracy verified', status: 'complete' },
    { id: 'r2', label: 'Author information verified', status: 'complete' },
    { id: 'r3', label: 'Journal branding confirmed', status: 'complete' },
    { id: 'r4', label: 'Typography readability approved', status: 'warning' },
    { id: 'r5', label: 'Cover layout consistency verified', status: 'complete' },
    { id: 'r6', label: 'Color palette approved', status: 'complete' },
    { id: 'r7', label: 'Cover dimensions validated', status: 'complete' },
    { id: 'r8', label: 'Publication presentation quality confirmed', status: 'warning' },
  ];

  const completeCount = reviewItems.filter(i => i.status === 'complete').length;
  const warningCount = reviewItems.filter(i => i.status === 'warning').length;
  const issueCount = reviewItems.filter(i => i.status === 'issue').length;
  const completeness = Math.round((completeCount / reviewItems.length) * 100);

  const assessmentCards = [
    { label: 'Branding Approval', score: 97, badge: 'Approved', color: 'green' },
    { label: 'Typography Readability', score: 86, badge: 'Minor Note', color: 'amber' },
    { label: 'Layout Presentation', score: 93, badge: 'Good', color: 'green' },
    { label: 'Visual Consistency', score: 90, badge: 'Verified', color: 'green' },
    { label: 'Publication Readiness', score: 88, badge: 'Nearly Ready', color: 'blue' },
  ];

  const workflowStages = [
    'Submission',
    'Review',
    'Revision',
    'Copyediting',
    'Final Revisions',
    'Cover Page Design',
    'Editor Review',
    'Author Cover Approval',
    'Production Preparation',
  ];
  const currentStageIndex = 7;

  const coverFiles: CoverFile[] = [
    { id: 'f1', name: 'cover-design-v2-final.pdf', size: '4.8 MB', type: 'Print-Ready PDF', status: 'uploaded', date: new Date(Date.now() - 2 * 60 * 60 * 1000) },
    { id: 'f2', name: 'cover-mockup-v2.png', size: '3.1 MB', type: 'Mockup Preview', status: 'uploaded', date: new Date(Date.now() - 3 * 60 * 60 * 1000) },
    { id: 'f3', name: 'spine-layout-v1.pdf', size: '1.2 MB', type: 'Spine Layout', status: 'uploaded', date: new Date(Date.now() - 4 * 60 * 60 * 1000) },
    { id: 'f4', name: 'author-supplementary-ref.pdf', size: '0.6 MB', type: 'Supplementary', status: 'pending', date: new Date() },
  ];

  const revisionHistory = [
    { id: 'r1', version: 'v1.0', date: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000), note: 'Initial cover design — returned for corrections', status: 'Returned' },
    { id: 'r2', version: 'v1.1', date: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000), note: 'Spine repositioned and author list corrected', status: 'Returned' },
    { id: 'r3', version: 'v2.0', date: new Date(Date.now() - 4 * 60 * 60 * 1000), note: 'Final revision — editor approved and forwarded', status: 'Current' },
  ];

  const layoutAnnotations = [
    { id: 'la1', label: 'Front Cover Typography Notes', page: 'Front' },
    { id: 'la2', label: 'Spine Alignment Reference', page: 'Spine' },
    { id: 'la3', label: 'Author Information Placement', page: 'Front' },
    { id: 'la4', label: 'ISBN & Barcode Positioning', page: 'Back' },
  ];

  const approvalHistory = [
    { id: 'h1', date: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000), event: 'Cover design task assigned to Layout Artist', actor: 'Maria Rodriguez (TWG Coordinator)', badge: 'Assigned' },
    { id: 'h2', date: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000), event: 'Cover design v1.0 submitted for review', actor: 'Emma Thompson (TWG Layout Artist)', badge: 'Submitted' },
    { id: 'h3', date: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000), event: 'Cover v1.0 returned — spine and author corrections required', actor: 'Dr. Sarah Johnson (Editor)', badge: 'Returned' },
    { id: 'h4', date: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000), event: 'Cover design v2.0 finalized and approved by editor', actor: 'Dr. Sarah Johnson (Editor)', badge: 'Approved' },
    { id: 'h5', date: new Date(Date.now() - 2 * 60 * 60 * 1000), event: 'Cover design forwarded to author for final approval', actor: 'Dr. Sarah Johnson (Editor)', badge: 'Current' },
  ];

  const activityLog = [
    { id: 'a1', timestamp: new Date(Date.now() - 1 * 60 * 60 * 1000), action: 'Author cover approval session opened', user: 'Dr. Jane Smith' },
    { id: 'a2', timestamp: new Date(Date.now() - 2 * 60 * 60 * 1000), action: 'Print-ready PDF v2.0 downloaded for review', user: 'Dr. Jane Smith' },
    { id: 'a3', timestamp: new Date(Date.now() - 4 * 60 * 60 * 1000), action: 'Cover design v2.0 received from editor Dr. Sarah Johnson', user: 'System' },
    { id: 'a4', timestamp: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000), action: 'Author notified — cover design ready for approval', user: 'System' },
  ];

  const alerts = [
    { id: 'al1', type: 'deadline', message: 'Cover approval deadline: 3 days remaining. Please review and approve to avoid production delays.' },
    { id: 'al2', type: 'warning', message: 'Typography note flagged by editor — verify heading weight on front cover matches your expectations.' },
    { id: 'al3', type: 'info', message: 'Cover design v2.0 has been approved by the editor and is ready for your final confirmation.' },
    { id: 'al4', type: 'info', message: 'Once approved, the cover design proceeds directly to Production Preparation.' },
  ];

  const coverSubmissionDate = new Date(Date.now() - 4 * 60 * 60 * 1000);
  const approvalDeadline = new Date(Date.now() + 3 * 24 * 60 * 60 * 1000);

  const statusConfig: Record<PageStatus, { label: string; textColor: string; bgColor: string }> = {
    under_review: { label: 'Under Cover Approval Review', textColor: 'text-blue-800', bgColor: 'bg-blue-100' },
    draft_saved: { label: 'Feedback Draft Saved', textColor: 'text-gray-800', bgColor: 'bg-gray-100' },
    awaiting_final: { label: 'Awaiting Final Approval', textColor: 'text-purple-800', bgColor: 'bg-purple-100' },
    minor_revisions: { label: 'Minor Revisions Requested', textColor: 'text-amber-800', bgColor: 'bg-amber-100' },
    additional_revisions: { label: 'Additional Design Revisions Requested', textColor: 'text-orange-800', bgColor: 'bg-orange-100' },
    approved: { label: 'Cover Design Approved', textColor: 'text-green-800', bgColor: 'bg-green-100' },
    ready_production: { label: 'Ready for Production Preparation', textColor: 'text-emerald-800', bgColor: 'bg-emerald-100' },
    on_hold: { label: 'Approval On Hold', textColor: 'text-red-800', bgColor: 'bg-red-100' },
  };

  const currentStatus = statusConfig[pageStatus];

  const getItemIcon = (status: ReviewItem['status']) => {
    if (status === 'complete') return <CheckCircle className="w-4 h-4 text-green-600" />;
    if (status === 'warning') return <AlertCircle className="w-4 h-4 text-amber-500" />;
    return <XCircle className="w-4 h-4 text-red-500" />;
  };

  const getFileBadgeStyle = (status: string) => {
    if (status === 'uploaded') return 'bg-green-100 text-green-800';
    if (status === 'pending') return 'bg-amber-100 text-amber-800';
    return 'bg-gray-100 text-gray-700';
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
    if (color === 'blue') return 'bg-blue-100 text-blue-700';
    return 'bg-gray-100 text-gray-700';
  };

  const handleDecisionClick = (d: ApprovalDecision) => {
    setDecision(d);
    setShowConfirmModal(true);
  };

  const handleConfirm = () => {
    if (decision === 'approve') setPageStatus('approved');
    else if (decision === 'minor_revisions') setPageStatus('minor_revisions');
    else if (decision === 'additional_revisions') setPageStatus('additional_revisions');
    setShowConfirmModal(false);
  };

  const getDecisionLabel = (d: ApprovalDecision) => {
    if (d === 'approve') return 'Approve Cover Design';
    if (d === 'minor_revisions') return 'Request Minor Revisions';
    if (d === 'additional_revisions') return 'Request Additional Design Revisions';
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
              <p className="text-xs text-slate-400 uppercase tracking-wider font-medium">Author — Cover Page Approval</p>
              <h1 className="text-base font-bold font-serif leading-tight truncate max-w-lg">{manuscript.title}</h1>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <span className={`text-xs font-semibold px-3 py-1 rounded-full ${currentStatus.bgColor} ${currentStatus.textColor}`}>
              {currentStatus.label}
            </span>
            <div className="text-right">
              <p className="text-xs text-slate-400">Approval Deadline</p>
              <p className="text-sm font-semibold text-amber-300">{approvalDeadline.toLocaleDateString()}</p>
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
              <div>
                <span className="text-gray-500 font-medium">Manuscript Title:</span>
                <p className="text-gray-900 font-semibold leading-snug mt-0.5">{manuscript.title}</p>
              </div>
              <div>
                <span className="text-gray-500 font-medium">Authors & Affiliations:</span>
                <p className="text-gray-800 mt-0.5">Dr. Jane Smith · University of Cambridge</p>
              </div>
              <div>
                <span className="text-gray-500 font-medium">Journal Category:</span>
                <p className="text-gray-800 mt-0.5">{manuscript.journal}</p>
              </div>
            </div>
            <div className="space-y-2 text-sm">
              <div>
                <span className="text-gray-500 font-medium">Submission Date:</span>
                <p className="text-gray-800 mt-0.5">{new Date(manuscript.submissionDate).toLocaleDateString()}</p>
              </div>
              <div>
                <span className="text-gray-500 font-medium">Cover Design Forwarded:</span>
                <p className="text-gray-800 mt-0.5">{coverSubmissionDate.toLocaleDateString()} {coverSubmissionDate.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</p>
              </div>
              <div className="flex gap-4">
                <div>
                  <span className="text-gray-500 font-medium">Version:</span>
                  <p className="text-gray-800 mt-0.5 font-semibold">v2.0</p>
                </div>
                <div>
                  <span className="text-gray-500 font-medium">Workflow Stage:</span>
                  <p className="text-gray-800 mt-0.5">Author Cover Approval</p>
                </div>
              </div>
            </div>
          </div>
          <div className="flex gap-2 flex-wrap">
            <button className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium text-[#0F2D5E] border border-[#1a1f2e] rounded-lg hover:bg-[#0F2D5E] hover:text-white transition-colors">
              <Eye className="w-3.5 h-3.5" /> View Manuscript
            </button>
            <button className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium text-gray-700 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors">
              <Download className="w-3.5 h-3.5" /> Download Cover Files
            </button>
            <button className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium text-gray-700 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors">
              <Paperclip className="w-3.5 h-3.5" /> View Editorial Notes
            </button>
          </div>
        </div>

        {/* SECTION 2 — Cover Design Review Summary */}
        <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-5">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-2">
              <CheckSquare className="w-4 h-4 text-[#0F2D5E]" />
              <h2 className="text-base font-bold font-serif text-[#0F2D5E] uppercase tracking-wide">Cover Design Review Summary</h2>
            </div>
            <div className="flex items-center gap-2">
              {warningCount > 0 && (
                <span className="text-xs px-2 py-0.5 bg-amber-100 text-amber-800 rounded-full font-semibold">{warningCount} Note{warningCount !== 1 ? 's' : ''}</span>
              )}
              {issueCount > 0 && (
                <span className="text-xs px-2 py-0.5 bg-red-100 text-red-800 rounded-full font-semibold">{issueCount} Issue{issueCount !== 1 ? 's' : ''}</span>
              )}
              <span className="text-xs px-2 py-0.5 bg-green-100 text-green-800 rounded-full font-semibold">{completeCount}/{reviewItems.length} Verified</span>
            </div>
          </div>

          <div className="mb-4">
            <div className="flex items-center justify-between text-xs text-gray-500 mb-1">
              <span>Overall Review Progress</span>
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
            {reviewItems.map((item) => (
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

        {/* SECTION 3 — Cover Design Preview */}
        <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-5">
          <div className="flex items-center gap-2 mb-4">
            <Palette className="w-4 h-4 text-[#0F2D5E]" />
            <h2 className="text-base font-bold font-serif text-[#0F2D5E] uppercase tracking-wide">Cover Design Preview</h2>
          </div>

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
            {/* Preview */}
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
                  style={{ width: '48px' }}
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

            {/* Versions & annotations */}
            <div className="space-y-3">
              <div>
                <p className="text-xs font-semibold text-gray-700 uppercase tracking-wide mb-2">Design Versions</p>
                <div className="space-y-1.5">
                  {revisionHistory.map((rev) => (
                    <div key={rev.id} className="flex items-center justify-between px-3 py-2 bg-gray-50 rounded-lg border border-gray-100 text-xs">
                      <div className="flex items-center gap-2 min-w-0">
                        <span className="font-bold text-[#0F2D5E] flex-shrink-0">{rev.version}</span>
                        <span className="text-gray-500 flex-shrink-0">{rev.date.toLocaleDateString()}</span>
                        <span className="text-gray-600 truncate">{rev.note}</span>
                      </div>
                      <span className={`ml-2 flex-shrink-0 px-2 py-0.5 rounded-full font-semibold text-[10px] ${
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
                      <Paperclip className="w-3.5 h-3.5 text-blue-500 flex-shrink-0" />
                      <span className="text-gray-700 flex-1">{la.label}</span>
                      <span className="text-blue-600 font-medium">{la.page}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* SECTION 4 — Author Approval Assessment */}
        <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-5">
          <div className="flex items-center gap-2 mb-4">
            <Star className="w-4 h-4 text-[#0F2D5E]" />
            <h2 className="text-base font-bold font-serif text-[#0F2D5E] uppercase tracking-wide">Approval Assessment</h2>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
            {assessmentCards.map((card) => (
              <div key={card.label} className="p-4 bg-gray-50 rounded-xl border border-gray-100">
                <div className="flex items-center justify-between mb-2">
                  <p className="text-xs font-semibold text-gray-600">{card.label}</p>
                  <span className={`text-xs px-2 py-0.5 rounded-full font-semibold ${getBadgeColor(card.color)}`}>
                    {card.badge}
                  </span>
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

        {/* SECTION 5 — Author Feedback & Approval */}
        <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-5">
          <div className="flex items-center gap-2 mb-5">
            <FileText className="w-4 h-4 text-[#0F2D5E]" />
            <h2 className="text-base font-bold font-serif text-[#0F2D5E] uppercase tracking-wide">Author Feedback & Approval</h2>
          </div>

          <div className="space-y-4 mb-5">
            <div>
              <label className="block text-xs font-semibold text-gray-700 mb-1">
                Cover Approval Notes <span className="text-red-500">*</span>
              </label>
              <textarea
                value={approvalNotes}
                onChange={e => setApprovalNotes(e.target.value)}
                rows={3}
                placeholder="Provide your overall assessment of the cover design — note any concerns or confirm full approval..."
                className="w-full text-sm border border-gray-200 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-[#1a1f2e] resize-none text-gray-800 placeholder-gray-400"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-gray-700 mb-1">Layout Correction Requests</label>
              <textarea
                value={correctionRequests}
                onChange={e => setCorrectionRequests(e.target.value)}
                rows={3}
                placeholder="List any specific corrections required — title text, author information, typography, dimensions..."
                className="w-full text-sm border border-gray-200 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-[#1a1f2e] resize-none text-gray-800 placeholder-gray-400"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-gray-700 mb-1">Design Improvement Remarks</label>
              <textarea
                value={improvementRemarks}
                onChange={e => setImprovementRemarks(e.target.value)}
                rows={2}
                placeholder="Suggest any design improvements or enhancements for consideration before production..."
                className="w-full text-sm border border-gray-200 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-[#1a1f2e] resize-none text-gray-800 placeholder-gray-400"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-gray-700 mb-1">Publication Presentation Comments</label>
              <textarea
                value={presentationComments}
                onChange={e => setPresentationComments(e.target.value)}
                rows={2}
                placeholder="Share any comments on the overall publication presentation and cover design quality..."
                className="w-full text-sm border border-gray-200 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-[#1a1f2e] resize-none text-gray-800 placeholder-gray-400"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-gray-700 mb-1">Final Approval Remarks</label>
              <textarea
                value={finalRemarks}
                onChange={e => setFinalRemarks(e.target.value)}
                rows={2}
                placeholder="Add any final remarks for the editorial team regarding this cover design approval..."
                className="w-full text-sm border border-gray-200 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-[#1a1f2e] resize-none text-gray-800 placeholder-gray-400"
              />
            </div>
          </div>

          {/* Decision buttons */}
          <div className="flex flex-wrap gap-3">
            <button
              onClick={() => handleDecisionClick('approve')}
              className={`flex items-center gap-2 px-5 py-2.5 rounded-lg text-sm font-semibold transition-colors ${
                decision === 'approve'
                  ? 'bg-emerald-600 text-white ring-2 ring-emerald-400'
                  : 'bg-emerald-50 text-emerald-800 border border-emerald-200 hover:bg-emerald-600 hover:text-white'
              }`}
            >
              <ThumbsUp className="w-4 h-4" />
              Approve Cover Design
            </button>
            <button
              onClick={() => handleDecisionClick('minor_revisions')}
              className={`flex items-center gap-2 px-5 py-2.5 rounded-lg text-sm font-semibold transition-colors ${
                decision === 'minor_revisions'
                  ? 'bg-amber-500 text-white ring-2 ring-amber-300'
                  : 'bg-amber-50 text-amber-800 border border-amber-200 hover:bg-amber-500 hover:text-white'
              }`}
            >
              <AlertCircle className="w-4 h-4" />
              Request Minor Revisions
            </button>
            <button
              onClick={() => handleDecisionClick('additional_revisions')}
              className={`flex items-center gap-2 px-5 py-2.5 rounded-lg text-sm font-semibold transition-colors ${
                decision === 'additional_revisions'
                  ? 'bg-orange-600 text-white ring-2 ring-orange-300'
                  : 'bg-orange-50 text-orange-800 border border-orange-200 hover:bg-orange-600 hover:text-white'
              }`}
            >
              <RotateCcw className="w-4 h-4" />
              Request Additional Design Revisions
            </button>
          </div>
        </div>

        {/* SECTION 6 — File Management */}
        <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-5">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-2">
              <Layers className="w-4 h-4 text-[#0F2D5E]" />
              <h2 className="text-base font-bold font-serif text-[#0F2D5E] uppercase tracking-wide">Cover Design Files</h2>
            </div>
            <button className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium bg-[#0F2D5E] text-white rounded-lg hover:bg-[#252b3d] transition-colors">
              <Upload className="w-3.5 h-3.5" /> Upload Supporting File
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
                  <span className={`text-xs px-2 py-0.5 rounded-full font-medium ${getFileBadgeStyle(file.status)}`}>
                    {file.status === 'uploaded' ? 'Uploaded' : file.status === 'pending' ? 'Pending' : 'Draft'}
                  </span>
                  <button className="p-1.5 text-gray-400 hover:text-[#0F2D5E] transition-colors">
                    <Download className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* SECTION 7 + 8 — Workflow Status & Timeline */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-5">
            <div className="flex items-center gap-2 mb-4">
              <Activity className="w-4 h-4 text-[#0F2D5E]" />
              <h2 className="text-sm font-bold font-serif text-[#0F2D5E] uppercase tracking-wide">Workflow Status</h2>
            </div>
            <div className="space-y-3 text-sm">
              <div className="flex justify-between">
                <span className="text-gray-500 font-medium">Current Stage</span>
                <span className="font-semibold text-[#0F2D5E]">Author Cover Approval</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-500 font-medium">Next Stage</span>
                <span className="font-semibold text-gray-700">Production Preparation</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-500 font-medium">Approval Deadline</span>
                <span className="font-semibold text-amber-700">{approvalDeadline.toLocaleDateString()}</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-gray-500 font-medium">Delay Risk</span>
                <span className="px-2 py-0.5 bg-green-100 text-green-800 rounded-full text-xs font-semibold">On Schedule</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-500 font-medium">Last Updated</span>
                <span className="font-medium text-gray-700">{new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })} today</span>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-5">
            <div className="flex items-center gap-2 mb-4">
              <CalendarClock className="w-4 h-4 text-[#0F2D5E]" />
              <h2 className="text-sm font-bold font-serif text-[#0F2D5E] uppercase tracking-wide">Timeline Recommendation</h2>
            </div>
            <div className="space-y-3 text-sm">
              <div className="flex justify-between">
                <span className="text-gray-500 font-medium">Recommended Duration</span>
                <span className="font-semibold text-[#0F2D5E]">1–3 Business Days</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-gray-500 font-medium">Stage Progress</span>
                <div className="flex items-center gap-2">
                  <div className="w-20 h-1.5 bg-gray-200 rounded-full overflow-hidden">
                    <div className="h-full bg-blue-500 rounded-full" style={{ width: '20%' }} />
                  </div>
                  <span className="text-gray-700 font-medium">20%</span>
                </div>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-gray-500 font-medium">Delay Risk</span>
                <span className="px-2 py-0.5 bg-green-100 text-green-800 rounded-full text-xs font-semibold">On Schedule</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-500 font-medium">Next Stage Est.</span>
                <span className="font-semibold text-gray-700">{new Date(Date.now() + 3 * 24 * 60 * 60 * 1000).toLocaleDateString()}</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-gray-500 font-medium">Timeline Confidence</span>
                <span className="px-2 py-0.5 bg-green-100 text-green-800 rounded-full text-xs font-semibold">High</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-500 font-medium">Remaining Est.</span>
                <span className="font-semibold text-gray-700">~3 days</span>
              </div>
              <div className="pt-1 border-t border-gray-100">
                <p className="text-xs text-gray-400">Last reassessed: Today at {new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</p>
              </div>
            </div>
          </div>
        </div>

        {/* SECTION 9 — Design & Approval History */}
        <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-5">
          <div className="flex items-center gap-2 mb-4">
            <History className="w-4 h-4 text-[#0F2D5E]" />
            <h2 className="text-base font-bold font-serif text-[#0F2D5E] uppercase tracking-wide">Design & Approval History</h2>
          </div>
          <div className="space-y-3">
            {approvalHistory.map((item, idx) => (
              <div key={item.id} className="flex gap-3">
                <div className="flex flex-col items-center">
                  <div className={`w-7 h-7 rounded-full flex items-center justify-center flex-shrink-0 ${
                    idx === approvalHistory.length - 1 ? 'bg-[#0F2D5E]' : 'bg-gray-200'
                  }`}>
                    <span className="text-[10px] font-bold text-white">{approvalHistory.length - idx}</span>
                  </div>
                  {idx < approvalHistory.length - 1 && <div className="w-px flex-1 bg-gray-200 my-1" />}
                </div>
                <div className="pb-3 flex-1">
                  <div className="flex items-center gap-2 flex-wrap mb-0.5">
                    <span className={`text-[10px] px-2 py-0.5 rounded-full font-semibold ${
                      item.badge === 'Current' ? 'bg-green-100 text-green-700' :
                      item.badge === 'Returned' ? 'bg-amber-100 text-amber-700' :
                      item.badge === 'Approved' ? 'bg-emerald-100 text-emerald-700' :
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
                <p className={`${
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
              <Save className="w-4 h-4" /> Save Draft Feedback
            </button>
            <button className="flex items-center gap-1.5 px-4 py-2 text-sm font-medium text-gray-700 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors">
              <Eye className="w-4 h-4" /> Preview Cover Design
            </button>
            <button className="flex items-center gap-1.5 px-4 py-2 text-sm font-medium text-gray-700 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors">
              <Upload className="w-4 h-4" /> Upload Supporting File
            </button>
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={() => handleDecisionClick('minor_revisions')}
              className="flex items-center gap-1.5 px-4 py-2 text-sm font-semibold text-amber-700 bg-amber-50 border border-amber-200 rounded-lg hover:bg-amber-500 hover:text-white transition-colors"
            >
              <AlertCircle className="w-4 h-4" /> Request Revisions
            </button>
            <button
              onClick={() => handleDecisionClick('approve')}
              className="flex items-center gap-1.5 px-5 py-2 text-sm font-semibold text-white bg-[#0F2D5E] rounded-lg hover:bg-[#252b3d] transition-colors"
            >
              <ThumbsUp className="w-4 h-4" /> Approve Cover Design
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
                decision === 'approve' ? 'bg-emerald-100' :
                decision === 'minor_revisions' ? 'bg-amber-100' : 'bg-orange-100'
              }`}>
                {decision === 'approve' ? <ThumbsUp className="w-5 h-5 text-emerald-600" /> :
                 decision === 'minor_revisions' ? <AlertCircle className="w-5 h-5 text-amber-600" /> :
                 <RotateCcw className="w-5 h-5 text-orange-600" />}
              </div>
              <div>
                <h3 className="font-bold text-gray-900">Confirm Approval Decision</h3>
                <p className="text-xs text-gray-500">This will update the manuscript workflow</p>
              </div>
            </div>
            <div className="bg-gray-50 rounded-lg p-4 mb-4 space-y-1.5 text-sm">
              <p><span className="text-gray-500">Decision:</span> <span className="font-semibold text-gray-900">{getDecisionLabel(decision)}</span></p>
              <p><span className="text-gray-500">Manuscript:</span> <span className="font-medium text-gray-800 text-xs">{manuscript.title}</span></p>
              <p><span className="text-gray-500">Current Stage:</span> <span className="font-medium text-gray-800">Author Cover Approval</span></p>
              <p><span className="text-gray-500">Next Stage:</span> <span className="font-medium text-gray-800">
                {decision === 'approve' ? 'Production Preparation' :
                 decision === 'minor_revisions' ? 'Cover Page Design (Minor Revision)' :
                 'Cover Page Design (Full Revision)'}
              </span></p>
            </div>
            <p className="text-sm text-gray-600 mb-5">
              {decision === 'approve'
                ? 'The cover design will be confirmed as approved and the manuscript will advance to Production Preparation. This completes the cover approval stage.'
                : decision === 'minor_revisions'
                ? 'Your minor revision requests will be sent to the Layout Artist and Editor. The cover design will re-enter the revision stage for targeted corrections.'
                : 'The cover design will be returned for a full revision cycle. The Layout Artist will produce an updated cover based on your detailed feedback.'}
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
                  decision === 'approve' ? 'bg-emerald-600 hover:bg-emerald-700' :
                  decision === 'minor_revisions' ? 'bg-amber-500 hover:bg-amber-600' :
                  'bg-orange-600 hover:bg-orange-700'
                }`}
              >
                Confirm {decision === 'approve' ? 'Approval' : 'Revision Request'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
