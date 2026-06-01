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
  MessageSquare,
  Calendar,
  Users,
  ChevronRight,
  Paperclip,
  FileCheck,
  XCircle,
  Info,
  PauseCircle,
} from 'lucide-react';
import type { Manuscript } from '../types';

interface EditorForwardAuthorFeedbackPageProps {
  manuscript: Manuscript;
  onBack: () => void;
}

type PageStatus =
  | 'under_review'
  | 'draft_saved'
  | 'forwarded_twg'
  | 'returned_author'
  | 'on_hold'
  | 'additional_validation';

type ForwardDecision = 'forward' | 'return' | 'hold' | null;

interface FeedbackItem {
  id: string;
  label: string;
  status: 'submitted' | 'warning' | 'unresolved';
}

export function EditorForwardAuthorFeedbackPage({ manuscript, onBack }: EditorForwardAuthorFeedbackPageProps) {
  const [pageStatus, setPageStatus] = useState<PageStatus>('under_review');
  const [decision, setDecision] = useState<ForwardDecision>(null);
  const [showConfirmModal, setShowConfirmModal] = useState(false);
  const [editorialNotes, setEditorialNotes] = useState('');
  const [twgInstructions, setTwgInstructions] = useState('');
  const [priorityNotes, setPriorityNotes] = useState('');
  const [formattingRequests, setFormattingRequests] = useState('');
  const [productionRemarks, setProductionRemarks] = useState('');

  const feedbackItems: FeedbackItem[] = [
    { id: 'f1', label: 'Formatting concerns submitted', status: 'submitted' },
    { id: 'f2', label: 'Language clarification requests submitted', status: 'submitted' },
    { id: 'f3', label: 'Citation correction requests submitted', status: 'warning' },
    { id: 'f4', label: 'Additional revision requests submitted', status: 'submitted' },
    { id: 'f5', label: 'Author approval status confirmed', status: 'submitted' },
    { id: 'f6', label: 'Feedback completeness validated', status: 'unresolved' },
  ];

  const submittedCount = feedbackItems.filter(i => i.status === 'submitted').length;
  const warningCount = feedbackItems.filter(i => i.status === 'warning').length;
  const unresolvedCount = feedbackItems.filter(i => i.status === 'unresolved').length;
  const completeness = Math.round((submittedCount / feedbackItems.length) * 100);

  const validationCards = [
    { label: 'Feedback Validity', score: 92, badge: 'Valid', color: 'green' },
    { label: 'Formatting Concerns', score: 88, badge: 'Reviewed', color: 'green' },
    { label: 'Language Corrections', score: 95, badge: 'Validated', color: 'green' },
    { label: 'Citation Concerns', score: 74, badge: 'Needs Review', color: 'amber' },
    { label: 'Revision Priority', score: 85, badge: 'Medium', color: 'blue' },
  ];

  const workflowStages = [
    'Submission',
    'Review',
    'Revision',
    'Editorial Rec.',
    'TWG Endorsement',
    'Copyediting',
    'Author Review',
    'Editor Feedback Review',
    'TWG Final Revisions',
  ];
  const currentStageIndex = 7;

  const activityLog = [
    { id: 'a1', timestamp: new Date(Date.now() - 1 * 60 * 60 * 1000), action: 'Author feedback received and queued for editorial review', user: 'System' },
    { id: 'a2', timestamp: new Date(Date.now() - 3 * 60 * 60 * 1000), action: 'Author submitted copyediting feedback with annotations', user: manuscript.authorName },
    { id: 'a3', timestamp: new Date(Date.now() - 6 * 60 * 60 * 1000), action: 'Copyedited manuscript forwarded to author for review', user: 'Dr. Sarah Johnson' },
    { id: 'a4', timestamp: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000), action: 'TWG Coordinator validation completed and approved', user: 'Maria Rodriguez' },
    { id: 'a5', timestamp: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000), action: 'Copyediting completed by TWG Copyeditor', user: 'Sarah Martinez' },
  ];

  const history = [
    { id: 'h1', date: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000), event: 'Editorial recommendation submitted', actor: 'Dr. Sarah Johnson', badge: 'Accepted' },
    { id: 'h2', date: new Date(Date.now() - 8 * 24 * 60 * 60 * 1000), event: 'TWG endorsement granted', actor: 'TWG Committee', badge: 'Endorsed' },
    { id: 'h3', date: new Date(Date.now() - 12 * 24 * 60 * 60 * 1000), event: 'Copyediting assigned to TWG Copyeditor', actor: 'Maria Rodriguez', badge: 'In Progress' },
    { id: 'h4', date: new Date(Date.now() - 2 * 60 * 60 * 1000), event: 'Author copyediting feedback submitted', actor: manuscript.authorName, badge: 'Submitted' },
  ];

  const alerts = [
    { id: 'al1', type: 'warning', message: 'Citation correction request requires validation before forwarding to TWG.' },
    { id: 'al2', type: 'info', message: 'Author uploaded 2 annotated files. Review attachments before forwarding.' },
    { id: 'al3', type: 'deadline', message: 'Feedback review deadline: 3 days remaining.' },
  ];

  const authorFiles = [
    { id: 'af1', name: 'author-feedback-annotations.pdf', size: '2.4 MB', type: 'Author Annotations', status: 'uploaded', date: new Date(Date.now() - 3 * 60 * 60 * 1000) },
    { id: 'af2', name: 'copyedited-ms-with-comments.docx', size: '1.8 MB', type: 'Annotated Manuscript', status: 'uploaded', date: new Date(Date.now() - 3 * 60 * 60 * 1000) },
    { id: 'af3', name: 'citation-correction-list.pdf', size: '0.6 MB', type: 'Correction List', status: 'pending_review', date: new Date(Date.now() - 2 * 60 * 60 * 1000) },
    { id: 'af4', name: 'editorial-review-notes.docx', size: '0.3 MB', type: 'Editor Notes', status: 'draft', date: new Date() },
  ];

  const deadline = new Date(Date.now() + 3 * 24 * 60 * 60 * 1000);
  const reviewDate = new Date(Date.now() - 3 * 60 * 60 * 1000);

  const getStatusConfig = (): { label: string; color: string; bg: string } => {
    const map: Record<PageStatus, { label: string; color: string; bg: string }> = {
      under_review: { label: 'Under Editorial Feedback Review', color: 'text-blue-800', bg: 'bg-blue-100' },
      draft_saved: { label: 'Feedback Draft Saved', color: 'text-gray-800', bg: 'bg-gray-100' },
      forwarded_twg: { label: 'Feedback Forwarded to TWG', color: 'text-green-800', bg: 'bg-green-100' },
      returned_author: { label: 'Feedback Returned to Author', color: 'text-amber-800', bg: 'bg-amber-100' },
      on_hold: { label: 'Review On Hold', color: 'text-red-800', bg: 'bg-red-100' },
      additional_validation: { label: 'Additional Validation Required', color: 'text-purple-800', bg: 'bg-purple-100' },
    };
    return map[pageStatus];
  };

  const statusCfg = getStatusConfig();

  const getFeedbackIcon = (status: FeedbackItem['status']) => {
    if (status === 'submitted') return <CheckCircle className="w-4 h-4 text-green-600" />;
    if (status === 'warning') return <AlertCircle className="w-4 h-4 text-amber-500" />;
    return <XCircle className="w-4 h-4 text-red-500" />;
  };

  const getFileBadge = (status: string) => {
    if (status === 'uploaded') return 'bg-green-100 text-green-800';
    if (status === 'pending_review') return 'bg-amber-100 text-amber-800';
    return 'bg-gray-100 text-gray-700';
  };

  const getFileLabel = (status: string) => {
    if (status === 'uploaded') return 'Uploaded';
    if (status === 'pending_review') return 'Pending Review';
    return 'Draft';
  };

  const getBarColor = (color: string) => {
    if (color === 'green') return 'bg-green-500';
    if (color === 'amber') return 'bg-amber-500';
    if (color === 'blue') return 'bg-blue-500';
    return 'bg-gray-400';
  };

  const getBadgeColor = (color: string) => {
    if (color === 'green') return 'bg-green-100 text-green-800';
    if (color === 'amber') return 'bg-amber-100 text-amber-800';
    if (color === 'blue') return 'bg-blue-100 text-blue-800';
    return 'bg-gray-100 text-gray-800';
  };

  const handleDecisionConfirm = () => {
    if (decision === 'forward') setPageStatus('forwarded_twg');
    else if (decision === 'return') setPageStatus('returned_author');
    else if (decision === 'hold') setPageStatus('on_hold');
    setShowConfirmModal(false);
    onBack();
  };

  const canForward = editorialNotes.length > 0 || twgInstructions.length > 0;

  return (
    <div className="min-h-screen bg-[#F7F8FA] pb-32">
      {/* Header */}
      <div className="bg-[#0F2D5E] text-white py-6 px-8 sticky top-0 z-50 shadow-lg">
        <div className="max-w-[1400px] mx-auto">
          <button onClick={onBack} className="flex items-center gap-2 text-gray-300 hover:text-white transition-colors mb-4 text-sm">
            <ArrowLeft className="w-4 h-4" />
            Back to Dashboard
          </button>
          <div className="flex items-start justify-between">
            <div>
              <p className="text-xs text-gray-400 uppercase tracking-widest mb-1 font-medium">Editor Workflow</p>
              <h1 className="text-2xl font-bold font-serif mb-1">Forward Author Feedback to TWG</h1>
              <p className="text-sm text-gray-300">Review author copyediting feedback and forward revision requests to the Technical Working Group</p>
            </div>
            <div className="text-right flex flex-col items-end gap-2">
              <span className={`px-4 py-1.5 text-xs font-semibold rounded-full ${statusCfg.bg} ${statusCfg.color}`}>
                {statusCfg.label}
              </span>
              <div className="text-sm text-gray-300">
                <span className="mr-3">Deadline: <span className="text-white font-semibold">{deadline.toLocaleDateString()}</span></span>
                <span className="text-amber-400 font-semibold">3 days remaining</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-[1400px] mx-auto px-8 py-8 space-y-6">

        {/* SECTION 1 — Manuscript Summary */}
        <div className="bg-white rounded-sm border-2 border-[#1a1f2e] shadow-md p-6">
          <div className="flex items-start justify-between mb-5">
            <h2 className="text-base font-bold font-serif text-[#0F2D5E] uppercase tracking-wide">Manuscript Summary</h2>
            <div className="flex items-center gap-2">
              <button className="flex items-center gap-1.5 px-3 py-1.5 border border-[#1a1f2e] text-[#0F2D5E] rounded text-xs font-medium hover:bg-[#0F2D5E] hover:text-white transition-colors">
                <Eye className="w-3.5 h-3.5" />
                View Manuscript
              </button>
              <button className="flex items-center gap-1.5 px-3 py-1.5 border border-gray-300 text-gray-700 rounded text-xs font-medium hover:bg-gray-50 transition-colors">
                <Download className="w-3.5 h-3.5" />
                Download Files
              </button>
              <button className="flex items-center gap-1.5 px-3 py-1.5 border border-gray-300 text-gray-700 rounded text-xs font-medium hover:bg-gray-50 transition-colors">
                <FileText className="w-3.5 h-3.5" />
                Copyediting Notes
              </button>
            </div>
          </div>
          <div className="grid grid-cols-3 gap-6">
            <div className="col-span-2 space-y-4">
              <div>
                <p className="text-xs text-gray-500 uppercase tracking-wide mb-1">Title</p>
                <p className="font-bold text-gray-900 text-base leading-snug">{manuscript.title}</p>
              </div>
              <div className="grid grid-cols-3 gap-4">
                <div>
                  <p className="text-xs text-gray-500 uppercase tracking-wide mb-1">Authors</p>
                  <p className="text-sm font-semibold text-gray-800">{manuscript.authorName}</p>
                </div>
                <div>
                  <p className="text-xs text-gray-500 uppercase tracking-wide mb-1">Journal Category</p>
                  <p className="text-sm font-semibold text-gray-800">{manuscript.category}</p>
                </div>
                <div>
                  <p className="text-xs text-gray-500 uppercase tracking-wide mb-1">Manuscript ID</p>
                  <p className="text-sm font-mono font-semibold text-gray-800">{manuscript.id}</p>
                </div>
                <div>
                  <p className="text-xs text-gray-500 uppercase tracking-wide mb-1">Submission Date</p>
                  <p className="text-sm font-semibold text-gray-800">{manuscript.submittedAt.toLocaleDateString()}</p>
                </div>
                <div>
                  <p className="text-xs text-gray-500 uppercase tracking-wide mb-1">Copyediting Review Date</p>
                  <p className="text-sm font-semibold text-gray-800">{reviewDate.toLocaleDateString()}</p>
                </div>
                <div>
                  <p className="text-xs text-gray-500 uppercase tracking-wide mb-1">Version</p>
                  <p className="text-sm font-semibold text-gray-800">v{manuscript.files.length}.0</p>
                </div>
              </div>
              <div>
                <p className="text-xs text-gray-500 uppercase tracking-wide mb-1">Abstract Preview</p>
                <p className="text-sm text-gray-700 leading-relaxed line-clamp-2">{manuscript.abstract}</p>
              </div>
            </div>
            <div className="space-y-3">
              <div className="bg-[#F7F8FA] rounded p-4 border border-[#e8e3d8]">
                <p className="text-xs font-semibold text-[#0F2D5E] uppercase tracking-wide mb-3">Workflow Stage</p>
                <div className="space-y-1.5">
                  {['Copyediting', 'Author Review', 'Editor Feedback Review', 'TWG Final Revisions'].map((stage, i) => (
                    <div key={stage} className="flex items-center gap-2">
                      <div className={`w-2 h-2 rounded-full flex-shrink-0 ${i === 2 ? 'bg-[#0F2D5E]' : i < 2 ? 'bg-green-500' : 'bg-gray-300'}`} />
                      <span className={`text-xs ${i === 2 ? 'font-bold text-[#0F2D5E]' : i < 2 ? 'text-green-700' : 'text-gray-500'}`}>{stage}</span>
                      {i === 2 && <span className="ml-auto text-xs bg-[#0F2D5E] text-white px-1.5 py-0.5 rounded-full">Current</span>}
                    </div>
                  ))}
                </div>
              </div>
              <div className="bg-amber-50 border border-amber-200 rounded p-3">
                <p className="text-xs font-semibold text-amber-800 mb-1">Feedback Deadline</p>
                <p className="text-sm font-bold text-amber-900">{deadline.toLocaleDateString()}</p>
                <p className="text-xs text-amber-700 mt-0.5">3 days remaining</p>
              </div>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-3 gap-6">

          {/* SECTION 2 — Author Feedback Summary Panel */}
          <div className="bg-white rounded-sm border border-gray-200 shadow-sm p-5">
            <h2 className="text-sm font-bold font-serif text-[#0F2D5E] uppercase tracking-wide mb-4">Author Feedback Summary</h2>

            {/* Progress */}
            <div className="mb-4">
              <div className="flex items-center justify-between mb-1.5">
                <span className="text-xs text-gray-600 font-medium">Feedback Completeness</span>
                <span className="text-xs font-bold text-[#0F2D5E]">{completeness}%</span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-2">
                <div className="bg-[#0F2D5E] h-2 rounded-full transition-all" style={{ width: `${completeness}%` }} />
              </div>
              <div className="flex gap-3 mt-2">
                <span className="text-xs text-green-700 font-medium">{submittedCount} submitted</span>
                {warningCount > 0 && <span className="text-xs text-amber-700 font-medium">{warningCount} warning</span>}
                {unresolvedCount > 0 && <span className="text-xs text-red-700 font-medium">{unresolvedCount} unresolved</span>}
              </div>
            </div>

            {/* Validation summary badges */}
            <div className="flex flex-wrap gap-1.5 mb-4">
              <span className="px-2 py-0.5 text-xs rounded-full bg-green-100 text-green-800 font-medium">{submittedCount} Items Submitted</span>
              {warningCount > 0 && <span className="px-2 py-0.5 text-xs rounded-full bg-amber-100 text-amber-800 font-medium">{warningCount} Warnings</span>}
              {unresolvedCount > 0 && <span className="px-2 py-0.5 text-xs rounded-full bg-red-100 text-red-800 font-medium">{unresolvedCount} Unresolved</span>}
            </div>

            {/* Checklist */}
            <div className="space-y-2.5">
              {feedbackItems.map(item => (
                <div key={item.id} className="flex items-start gap-2.5">
                  <div className="flex-shrink-0 mt-0.5">{getFeedbackIcon(item.status)}</div>
                  <span className={`text-xs leading-snug ${item.status === 'submitted' ? 'text-gray-800' : item.status === 'warning' ? 'text-amber-800' : 'text-red-800'}`}>
                    {item.label}
                  </span>
                </div>
              ))}
            </div>
          </div>

          {/* SECTION 3 — Author Feedback Review Panel */}
          <div className="col-span-2 bg-white rounded-sm border border-gray-200 shadow-sm p-5">
            <h2 className="text-sm font-bold font-serif text-[#0F2D5E] uppercase tracking-wide mb-4">Author Feedback Review</h2>

            {/* Document preview area */}
            <div className="bg-[#F7F8FA] border border-[#e8e3d8] rounded p-4 mb-4 min-h-[160px] flex flex-col justify-between">
              <div className="flex items-center justify-between mb-3">
                <div className="flex items-center gap-2">
                  <FileCheck className="w-4 h-4 text-[#0F2D5E]" />
                  <span className="text-xs font-semibold text-[#0F2D5E]">Annotated Manuscript Preview</span>
                </div>
                <div className="flex gap-2">
                  <span className="px-2 py-0.5 text-xs bg-blue-100 text-blue-800 rounded-full font-medium">Preview Only</span>
                  <button className="flex items-center gap-1 px-2.5 py-1 border border-[#1a1f2e] text-[#0F2D5E] rounded text-xs font-medium hover:bg-[#0F2D5E] hover:text-white transition-colors">
                    <Download className="w-3 h-3" />
                    Download
                  </button>
                </div>
              </div>
              <div className="bg-white border border-gray-200 rounded p-4 text-center text-gray-400 text-sm flex-1 flex items-center justify-center">
                <div>
                  <FileText className="w-8 h-8 mx-auto mb-2 text-gray-300" />
                  <p className="text-xs text-gray-500">author-feedback-annotations.pdf</p>
                  <p className="text-xs text-gray-400 mt-1">Preview mode · 2.4 MB · 24 pages</p>
                </div>
              </div>
            </div>

            {/* Feedback details */}
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-3">
                <div>
                  <p className="text-xs text-gray-500 uppercase tracking-wide mb-1">Feedback Summary Notes</p>
                  <div className="bg-gray-50 border border-gray-200 rounded p-3 text-xs text-gray-700 leading-relaxed">
                    Author requests minor citation reformatting in sections 3.2 and 4.1. Language clarifications requested for technical terminology on pp. 12–14. No structural changes requested.
                  </div>
                </div>
                <div>
                  <p className="text-xs text-gray-500 uppercase tracking-wide mb-1">Attached Correction References</p>
                  <div className="space-y-1.5">
                    {['Section 3.2 — Citation Format', 'Section 4.1 — Citation Format', 'pp. 12–14 — Terminology'].map((ref, i) => (
                      <div key={i} className="flex items-center gap-2 text-xs text-gray-700">
                        <Paperclip className="w-3 h-3 text-gray-400 flex-shrink-0" />
                        {ref}
                      </div>
                    ))}
                  </div>
                </div>
              </div>
              <div className="space-y-3">
                <div>
                  <p className="text-xs text-gray-500 uppercase tracking-wide mb-1">Revision Comparison</p>
                  <div className="space-y-1.5">
                    {[
                      { label: 'Original Copyedited', version: 'v2.0', badge: 'Reference' },
                      { label: 'Author Annotated', version: 'v2.1', badge: 'Author Feedback' },
                      { label: 'Author Decision', version: '—', badge: 'Minor Corrections' },
                    ].map(item => (
                      <div key={item.label} className="flex items-center justify-between py-1.5 border-b border-gray-100 last:border-0">
                        <div>
                          <p className="text-xs font-medium text-gray-800">{item.label}</p>
                          <p className="text-xs text-gray-500">{item.version}</p>
                        </div>
                        <span className="px-2 py-0.5 text-xs rounded-full bg-gray-100 text-gray-700 font-medium">{item.badge}</span>
                      </div>
                    ))}
                  </div>
                </div>
                <div className="bg-[#F7F8FA] border border-[#e8e3d8] rounded p-3">
                  <p className="text-xs font-semibold text-[#0F2D5E] mb-1">Author Decision</p>
                  <span className="px-2.5 py-1 text-xs bg-amber-100 text-amber-800 rounded-full font-semibold">Minor Corrections Requested</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-6">

          {/* SECTION 4 — Editorial Validation Panel */}
          <div className="bg-white rounded-sm border border-gray-200 shadow-sm p-5">
            <h2 className="text-sm font-bold font-serif text-[#0F2D5E] uppercase tracking-wide mb-4">Editorial Validation</h2>
            <div className="space-y-3">
              {validationCards.map(card => (
                <div key={card.label} className="flex items-center gap-3">
                  <div className="flex-1">
                    <div className="flex items-center justify-between mb-1">
                      <span className="text-xs font-medium text-gray-800">{card.label}</span>
                      <div className="flex items-center gap-2">
                        <span className={`px-2 py-0.5 text-xs rounded-full font-medium ${getBadgeColor(card.color)}`}>{card.badge}</span>
                        <span className="text-xs font-bold text-gray-700">{card.score}%</span>
                      </div>
                    </div>
                    <div className="w-full bg-gray-100 rounded-full h-1.5">
                      <div className={`h-1.5 rounded-full ${getBarColor(card.color)}`} style={{ width: `${card.score}%` }} />
                    </div>
                  </div>
                </div>
              ))}
            </div>

            <div className="mt-4 pt-4 border-t border-gray-100">
              <div className="flex items-center justify-between">
                <p className="text-xs font-semibold text-gray-700">Overall Validation Score</p>
                <span className="px-3 py-1 bg-green-100 text-green-800 rounded-full text-xs font-bold">87% — Ready to Forward</span>
              </div>
              <p className="text-xs text-amber-700 mt-2 flex items-center gap-1.5">
                <AlertCircle className="w-3.5 h-3.5 flex-shrink-0" />
                Citation concern requires manual review before forwarding.
              </p>
            </div>
          </div>

          {/* SECTION 5 — Forward Feedback Decision Panel */}
          <div className="bg-white rounded-sm border border-gray-200 shadow-sm p-5">
            <h2 className="text-sm font-bold font-serif text-[#0F2D5E] uppercase tracking-wide mb-4">Forward Feedback Decision</h2>

            <div className="space-y-3 mb-5">
              <div>
                <label className="text-xs text-gray-500 uppercase tracking-wide block mb-1">Editorial Review Notes <span className="text-red-500">*</span></label>
                <textarea
                  value={editorialNotes}
                  onChange={e => setEditorialNotes(e.target.value)}
                  placeholder="Summarize your editorial review of the author's feedback..."
                  rows={2}
                  className="w-full border border-gray-300 rounded p-2.5 text-xs text-gray-800 resize-none focus:outline-none focus:ring-1 focus:ring-[#1a1f2e] focus:border-[#1a1f2e]"
                />
              </div>
              <div>
                <label className="text-xs text-gray-500 uppercase tracking-wide block mb-1">TWG Revision Instructions</label>
                <textarea
                  value={twgInstructions}
                  onChange={e => setTwgInstructions(e.target.value)}
                  placeholder="Specific instructions for TWG on how to handle the revision requests..."
                  rows={2}
                  className="w-full border border-gray-300 rounded p-2.5 text-xs text-gray-800 resize-none focus:outline-none focus:ring-1 focus:ring-[#1a1f2e] focus:border-[#1a1f2e]"
                />
              </div>
              <div>
                <label className="text-xs text-gray-500 uppercase tracking-wide block mb-1">Priority Correction Notes</label>
                <textarea
                  value={priorityNotes}
                  onChange={e => setPriorityNotes(e.target.value)}
                  placeholder="Flag any high-priority corrections that require immediate TWG attention..."
                  rows={2}
                  className="w-full border border-gray-300 rounded p-2.5 text-xs text-gray-800 resize-none focus:outline-none focus:ring-1 focus:ring-[#1a1f2e] focus:border-[#1a1f2e]"
                />
              </div>
              <div>
                <label className="text-xs text-gray-500 uppercase tracking-wide block mb-1">Additional Formatting Requests</label>
                <textarea
                  value={formattingRequests}
                  onChange={e => setFormattingRequests(e.target.value)}
                  placeholder="Any additional formatting instructions beyond author requests..."
                  rows={2}
                  className="w-full border border-gray-300 rounded p-2.5 text-xs text-gray-800 resize-none focus:outline-none focus:ring-1 focus:ring-[#1a1f2e] focus:border-[#1a1f2e]"
                />
              </div>
              <div>
                <label className="text-xs text-gray-500 uppercase tracking-wide block mb-1">Production Preparation Remarks</label>
                <textarea
                  value={productionRemarks}
                  onChange={e => setProductionRemarks(e.target.value)}
                  placeholder="Notes for production team once copyediting revisions are finalized..."
                  rows={2}
                  className="w-full border border-gray-300 rounded p-2.5 text-xs text-gray-800 resize-none focus:outline-none focus:ring-1 focus:ring-[#1a1f2e] focus:border-[#1a1f2e]"
                />
              </div>
            </div>

            {/* Decision buttons */}
            <div className="space-y-2">
              <p className="text-xs text-gray-500 uppercase tracking-wide font-medium mb-2">Decision</p>
              {[
                { id: 'forward' as ForwardDecision, label: 'Forward Feedback to TWG', icon: Send, color: 'border-green-600 text-green-700 bg-green-50 hover:bg-green-100' },
                { id: 'return' as ForwardDecision, label: 'Return Feedback to Author', icon: RotateCcw, color: 'border-amber-500 text-amber-700 bg-amber-50 hover:bg-amber-100' },
                { id: 'hold' as ForwardDecision, label: 'Hold for Additional Validation', icon: PauseCircle, color: 'border-gray-400 text-gray-700 bg-gray-50 hover:bg-gray-100' },
              ].map(opt => {
                const Icon = opt.icon;
                return (
                  <button
                    key={opt.id}
                    onClick={() => setDecision(decision === opt.id ? null : opt.id)}
                    className={`w-full flex items-center gap-2.5 px-3 py-2.5 border-2 rounded text-xs font-semibold transition-all ${opt.color} ${decision === opt.id ? 'ring-2 ring-offset-1 ring-[#1a1f2e]' : ''}`}
                  >
                    <Icon className="w-4 h-4 flex-shrink-0" />
                    {opt.label}
                    {decision === opt.id && <CheckCircle className="w-4 h-4 ml-auto" />}
                  </button>
                );
              })}
            </div>
          </div>
        </div>

        <div className="grid grid-cols-3 gap-6">

          {/* SECTION 6 — File Management */}
          <div className="bg-white rounded-sm border border-gray-200 shadow-sm p-5">
            <h2 className="text-sm font-bold font-serif text-[#0F2D5E] uppercase tracking-wide mb-4">File Management</h2>
            <div className="space-y-2.5">
              {authorFiles.map(file => (
                <div key={file.id} className="flex items-start gap-2.5 p-2.5 bg-gray-50 rounded border border-gray-100 hover:border-gray-300 transition-colors">
                  <FileText className="w-4 h-4 text-[#0F2D5E] flex-shrink-0 mt-0.5" />
                  <div className="flex-1 min-w-0">
                    <p className="text-xs font-semibold text-gray-800 truncate">{file.name}</p>
                    <p className="text-xs text-gray-500">{file.type} · {file.size}</p>
                    <p className="text-xs text-gray-400">{file.date.toLocaleDateString()}</p>
                  </div>
                  <div className="flex flex-col items-end gap-1.5">
                    <span className={`px-1.5 py-0.5 text-xs rounded-full font-medium ${getFileBadge(file.status)}`}>
                      {getFileLabel(file.status)}
                    </span>
                    <button className="text-gray-400 hover:text-[#0F2D5E] transition-colors">
                      <Download className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              ))}
            </div>
            <button className="mt-3 w-full flex items-center justify-center gap-2 px-3 py-2 border border-dashed border-gray-300 rounded text-xs text-gray-600 hover:border-[#1a1f2e] hover:text-[#0F2D5E] transition-colors">
              <Upload className="w-3.5 h-3.5" />
              Upload Additional Files
            </button>
          </div>

          {/* SECTION 7 — Workflow Status + Timeline */}
          <div className="space-y-4">
            {/* Workflow Status */}
            <div className="bg-white rounded-sm border border-gray-200 shadow-sm p-5">
              <h2 className="text-sm font-bold font-serif text-[#0F2D5E] uppercase tracking-wide mb-3">Workflow Status</h2>
              <div className="space-y-1">
                {workflowStages.map((stage, i) => (
                  <div key={stage} className="flex items-center gap-2">
                    <div className={`w-2 h-2 rounded-full flex-shrink-0 ${i === currentStageIndex ? 'bg-[#0F2D5E]' : i < currentStageIndex ? 'bg-green-500' : 'bg-gray-200'}`} />
                    <span className={`text-xs ${i === currentStageIndex ? 'font-bold text-[#0F2D5E]' : i < currentStageIndex ? 'text-green-700' : 'text-gray-400'}`}>{stage}</span>
                    {i === currentStageIndex && <ChevronRight className="w-3 h-3 text-[#0F2D5E] ml-auto" />}
                  </div>
                ))}
              </div>
              <div className="mt-3 pt-3 border-t border-gray-100 space-y-1.5">
                <div className="flex justify-between text-xs">
                  <span className="text-gray-500">Last Updated</span>
                  <span className="text-gray-800 font-medium">{new Date().toLocaleDateString()}</span>
                </div>
                <div className="flex justify-between text-xs">
                  <span className="text-gray-500">Delay Risk</span>
                  <span className="px-2 py-0.5 bg-amber-100 text-amber-800 rounded-full font-medium">Moderate</span>
                </div>
              </div>
            </div>

            {/* Timeline */}
            <div className="bg-white rounded-sm border border-gray-200 shadow-sm p-5">
              <h2 className="text-sm font-bold font-serif text-[#0F2D5E] uppercase tracking-wide mb-3">Timeline Recommendation</h2>
              <div className="space-y-2.5">
                {[
                  { label: 'Recommended Review Duration', value: '2–3 days', badge: null },
                  { label: 'Current Stage Progress', value: '40%', badge: null },
                  { label: 'Delay Risk', value: '', badge: 'Moderate Delay Risk' },
                  { label: 'Est. Next-Stage Transition', value: 'May 30, 2026', badge: null },
                  { label: 'Timeline Confidence', value: '', badge: 'On Schedule' },
                ].map(item => (
                  <div key={item.label} className="flex items-center justify-between py-1.5 border-b border-gray-50 last:border-0">
                    <span className="text-xs text-gray-600">{item.label}</span>
                    {item.badge ? (
                      <span className={`px-2 py-0.5 text-xs rounded-full font-medium ${item.badge === 'On Schedule' ? 'bg-green-100 text-green-800' : 'bg-amber-100 text-amber-800'}`}>{item.badge}</span>
                    ) : (
                      <span className="text-xs font-semibold text-gray-800">{item.value}</span>
                    )}
                  </div>
                ))}
              </div>
              <p className="text-xs text-gray-400 mt-3">Last reassessed: {new Date().toLocaleDateString()}</p>
            </div>
          </div>

          {/* SECTION 8 — History + Alerts + Activity */}
          <div className="space-y-4">
            {/* History */}
            <div className="bg-white rounded-sm border border-gray-200 shadow-sm p-5">
              <h2 className="text-sm font-bold font-serif text-[#0F2D5E] uppercase tracking-wide mb-3">Editorial & Copyediting History</h2>
              <div className="space-y-2.5">
                {history.map(item => (
                  <div key={item.id} className="flex items-start gap-2.5 pb-2.5 border-b border-gray-100 last:border-0">
                    <div className="w-1.5 h-1.5 rounded-full bg-[#0F2D5E] mt-1.5 flex-shrink-0" />
                    <div className="flex-1 min-w-0">
                      <p className="text-xs text-gray-800 font-medium leading-snug">{item.event}</p>
                      <p className="text-xs text-gray-500">{item.actor} · {item.date.toLocaleDateString()}</p>
                    </div>
                    <span className="text-xs px-1.5 py-0.5 bg-gray-100 text-gray-700 rounded-full font-medium whitespace-nowrap">{item.badge}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Alerts */}
            <div className="bg-white rounded-sm border border-gray-200 shadow-sm p-5">
              <h2 className="text-sm font-bold font-serif text-[#0F2D5E] uppercase tracking-wide mb-3">Alerts & Notifications</h2>
              <div className="space-y-2">
                {alerts.map(alert => (
                  <div
                    key={alert.id}
                    className={`flex items-start gap-2 p-2.5 rounded border-l-4 text-xs ${
                      alert.type === 'warning' ? 'bg-amber-50 border-amber-500 text-amber-800' :
                      alert.type === 'deadline' ? 'bg-red-50 border-red-400 text-red-800' :
                      'bg-blue-50 border-blue-400 text-blue-800'
                    }`}
                  >
                    {alert.type === 'warning' ? <AlertTriangle className="w-3.5 h-3.5 flex-shrink-0 mt-0.5" /> :
                     alert.type === 'deadline' ? <Clock className="w-3.5 h-3.5 flex-shrink-0 mt-0.5" /> :
                     <Info className="w-3.5 h-3.5 flex-shrink-0 mt-0.5" />}
                    {alert.message}
                  </div>
                ))}
              </div>
            </div>

            {/* Activity Log */}
            <div className="bg-white rounded-sm border border-gray-200 shadow-sm p-5">
              <h2 className="text-sm font-bold font-serif text-[#0F2D5E] uppercase tracking-wide mb-3">Activity Log</h2>
              <div className="space-y-2.5">
                {activityLog.map(item => (
                  <div key={item.id} className="flex items-start gap-2.5 pb-2 border-b border-gray-50 last:border-0">
                    <div className="w-1.5 h-1.5 rounded-full bg-gray-400 mt-1.5 flex-shrink-0" />
                    <div className="flex-1">
                      <p className="text-xs text-gray-700 leading-snug">{item.action}</p>
                      <p className="text-xs text-gray-400 mt-0.5">{item.user} · {item.timestamp.toLocaleString()}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Sticky Bottom Action Bar */}
      <div className="fixed bottom-0 left-0 right-0 z-50 bg-white border-t-2 border-[#1a1f2e] shadow-2xl">
        <div className="max-w-[1400px] mx-auto px-8 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <button
              onClick={() => setPageStatus('draft_saved')}
              className="flex items-center gap-2 px-4 py-2 border border-gray-300 text-gray-700 rounded text-sm font-medium hover:bg-gray-50 transition-colors"
            >
              <Save className="w-4 h-4" />
              Save Draft
            </button>
            <button className="flex items-center gap-2 px-4 py-2 border border-gray-300 text-gray-700 rounded text-sm font-medium hover:bg-gray-50 transition-colors">
              <Eye className="w-4 h-4" />
              Preview Author Feedback
            </button>
            <button className="flex items-center gap-2 px-4 py-2 border border-gray-300 text-gray-700 rounded text-sm font-medium hover:bg-gray-50 transition-colors">
              <Upload className="w-4 h-4" />
              Upload Additional Files
            </button>
          </div>

          <div className="flex items-center gap-3">
            {pageStatus === 'draft_saved' && (
              <span className="flex items-center gap-1.5 text-xs text-gray-500">
                <CheckCircle className="w-3.5 h-3.5 text-green-500" />
                Draft saved
              </span>
            )}
            <button
              onClick={onBack}
              className="px-4 py-2 border border-gray-300 text-gray-600 rounded text-sm font-medium hover:bg-gray-50 transition-colors"
            >
              Cancel
            </button>
            <button
              onClick={() => { setDecision('return'); setShowConfirmModal(true); }}
              className="flex items-center gap-2 px-4 py-2 border border-amber-500 text-amber-700 bg-amber-50 rounded text-sm font-medium hover:bg-amber-100 transition-colors"
            >
              <RotateCcw className="w-4 h-4" />
              Return to Author
            </button>
            <button
              onClick={() => { setDecision('forward'); setShowConfirmModal(true); }}
              className="flex items-center gap-2 px-5 py-2 bg-[#0F2D5E] text-white rounded text-sm font-semibold hover:bg-[#252b3d] transition-colors"
            >
              <Send className="w-4 h-4" />
              Forward Feedback to TWG
            </button>
          </div>
        </div>
      </div>

      {/* Confirmation Modal */}
      {showConfirmModal && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-sm border-2 border-[#1a1f2e] shadow-2xl w-full max-w-md p-6">
            <h3 className="text-lg font-bold font-serif text-[#0F2D5E] mb-2">
              {decision === 'forward' ? 'Forward Feedback to TWG' : decision === 'return' ? 'Return Feedback to Author' : 'Hold for Validation'}
            </h3>
            <p className="text-sm text-gray-600 mb-4">
              {decision === 'forward'
                ? 'The author feedback and your editorial review notes will be forwarded to the Technical Working Group for final copyediting revisions. This action cannot be undone.'
                : decision === 'return'
                ? 'The feedback will be returned to the author with your editorial notes. The author will need to resubmit.'
                : 'The feedback will be placed on hold pending additional validation.'}
            </p>
            <div className="bg-[#F7F8FA] border border-[#e8e3d8] rounded p-3 mb-5 space-y-1.5 text-xs text-gray-700">
              <p><span className="font-semibold">Manuscript:</span> {manuscript.title}</p>
              <p><span className="font-semibold">Author:</span> {manuscript.authorName}</p>
              <p><span className="font-semibold">Action:</span> {decision === 'forward' ? 'Forward to TWG' : decision === 'return' ? 'Return to Author' : 'Place on Hold'}</p>
            </div>
            <div className="flex gap-3">
              <button
                onClick={() => setShowConfirmModal(false)}
                className="flex-1 px-4 py-2 border border-gray-300 text-gray-700 rounded text-sm font-medium hover:bg-gray-50"
              >
                Cancel
              </button>
              <button
                onClick={handleDecisionConfirm}
                className={`flex-1 px-4 py-2 rounded text-sm font-semibold text-white ${decision === 'forward' ? 'bg-[#0F2D5E] hover:bg-[#252b3d]' : decision === 'return' ? 'bg-amber-600 hover:bg-amber-700' : 'bg-gray-600 hover:bg-gray-700'}`}
              >
                Confirm
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
