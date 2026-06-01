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
  FileCheck,
  XCircle,
  Info,
  PauseCircle,
  MessageSquare,
} from 'lucide-react';
import type { Manuscript } from '../types';

interface TWGFinalCopyeditingRevisionsPageProps {
  manuscript: Manuscript;
  onBack: () => void;
}

type PageStatus =
  | 'under_revision'
  | 'draft_saved'
  | 'awaiting_validation'
  | 'additional_corrections'
  | 'revisions_applied'
  | 'ready_production'
  | 'on_hold'
  | 'finalized';

type RevisionDecision = 'finalize' | 'return' | 'hold' | null;

interface RevisionItem {
  id: string;
  label: string;
  status: 'complete' | 'warning' | 'unresolved';
}

interface RevisionFile {
  id: string;
  name: string;
  size: string;
  type: string;
  status: 'uploaded' | 'pending' | 'draft';
  date: Date;
}

export function TWGFinalCopyeditingRevisionsPage({ manuscript, onBack }: TWGFinalCopyeditingRevisionsPageProps) {
  const [pageStatus, setPageStatus] = useState<PageStatus>('under_revision');
  const [decision, setDecision] = useState<RevisionDecision>(null);
  const [showConfirmModal, setShowConfirmModal] = useState(false);
  const [finalRevisionNotes, setFinalRevisionNotes] = useState('');
  const [correctionSummary, setCorrectionSummary] = useState('');
  const [productionConcerns, setProductionConcerns] = useState('');
  const [layoutNotes, setLayoutNotes] = useState('');
  const [editorialCoordNotes, setEditorialCoordNotes] = useState('');

  const revisionItems: RevisionItem[] = [
    { id: 'r1', label: 'Formatting corrections applied', status: 'complete' },
    { id: 'r2', label: 'Language revisions completed', status: 'complete' },
    { id: 'r3', label: 'Citation corrections implemented', status: 'warning' },
    { id: 'r4', label: 'Figure and table corrections completed', status: 'complete' },
    { id: 'r5', label: 'Journal template compliance finalized', status: 'complete' },
    { id: 'r6', label: 'Metadata validation completed', status: 'complete' },
    { id: 'r7', label: 'Author feedback concerns resolved', status: 'unresolved' },
  ];

  const completeCount = revisionItems.filter(i => i.status === 'complete').length;
  const warningCount = revisionItems.filter(i => i.status === 'warning').length;
  const unresolvedCount = revisionItems.filter(i => i.status === 'unresolved').length;
  const completeness = Math.round((completeCount / revisionItems.length) * 100);

  const validationCards = [
    { label: 'Formatting Readiness', score: 96, badge: 'Ready', color: 'green' },
    { label: 'Language Quality', score: 94, badge: 'Validated', color: 'green' },
    { label: 'Citation Consistency', score: 78, badge: 'Needs Review', color: 'amber' },
    { label: 'Readability Assessment', score: 91, badge: 'Good', color: 'green' },
    { label: 'Production Readiness', score: 88, badge: 'Nearly Ready', color: 'blue' },
  ];

  const workflowStages = [
    'Submission',
    'Review',
    'Revision',
    'Editorial Rec.',
    'TWG Endorsement',
    'Copyediting',
    'Author Feedback',
    'Final Copyediting Revisions',
    'Production Preparation',
  ];
  const currentStageIndex = 7;

  const revisionFiles: RevisionFile[] = [
    { id: 'f1', name: 'final-revised-manuscript-v3.docx', size: '2.9 MB', type: 'Finalized Manuscript', status: 'uploaded', date: new Date(Date.now() - 2 * 60 * 60 * 1000) },
    { id: 'f2', name: 'marked-corrections-v3.pdf', size: '1.6 MB', type: 'Marked Version', status: 'uploaded', date: new Date(Date.now() - 2 * 60 * 60 * 1000) },
    { id: 'f3', name: 'author-feedback-applied.pdf', size: '0.8 MB', type: 'Author Feedback Reference', status: 'uploaded', date: new Date(Date.now() - 4 * 60 * 60 * 1000) },
    { id: 'f4', name: 'production-checklist.pdf', size: '0.3 MB', type: 'Production Checklist', status: 'pending', date: new Date() },
  ];

  const activityLog = [
    { id: 'a1', timestamp: new Date(Date.now() - 1 * 60 * 60 * 1000), action: 'Final copyediting revisions initiated based on editor-forwarded author feedback', user: 'TWG Copyeditor' },
    { id: 'a2', timestamp: new Date(Date.now() - 3 * 60 * 60 * 1000), action: 'Author feedback and editorial review notes received from editor', user: 'Dr. Sarah Johnson' },
    { id: 'a3', timestamp: new Date(Date.now() - 6 * 60 * 60 * 1000), action: 'Editor reviewed and approved author feedback for forwarding', user: 'Dr. Sarah Johnson' },
    { id: 'a4', timestamp: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000), action: 'Author copyediting feedback submitted with annotated manuscript', user: manuscript.authorName },
    { id: 'a5', timestamp: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000), action: 'Copyedited manuscript forwarded to author for review', user: 'Dr. Sarah Johnson' },
  ];

  const history = [
    { id: 'h1', date: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000), event: 'Initial copyediting submitted by TWG Copyeditor', actor: 'TWG Copyeditor', badge: 'Completed' },
    { id: 'h2', date: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000), event: 'TWG Coordinator validation approved copyedited manuscript', actor: 'Maria Rodriguez', badge: 'Approved' },
    { id: 'h3', date: new Date(Date.now() - 4 * 24 * 60 * 60 * 1000), event: 'Editor reviewed and forwarded copyedited manuscript to author', actor: 'Dr. Sarah Johnson', badge: 'Forwarded' },
    { id: 'h4', date: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000), event: 'Author submitted copyediting feedback — Minor corrections requested', actor: manuscript.authorName, badge: 'Minor Corrections' },
    { id: 'h5', date: new Date(Date.now() - 3 * 60 * 60 * 1000), event: 'Editor forwarded author feedback to TWG for final revisions', actor: 'Dr. Sarah Johnson', badge: 'Forwarded to TWG' },
  ];

  const alerts = [
    { id: 'al1', type: 'warning', message: 'Citation corrections in sections 3.2 and 4.1 require manual verification before finalizing.' },
    { id: 'al2', type: 'info', message: 'Author uploaded 2 annotated files. All corrections have been reviewed by editor.' },
    { id: 'al3', type: 'deadline', message: 'Final revision deadline: 2 days remaining.' },
    { id: 'al4', type: 'info', message: 'Author feedback concern regarding terminology on pp. 12–14 remains unresolved.' },
  ];

  const revisionDate = new Date(Date.now() - 2 * 60 * 60 * 1000);
  const deadline = new Date(Date.now() + 2 * 24 * 60 * 60 * 1000);

  const getStatusConfig = () => {
    const map: Record<PageStatus, { label: string; textColor: string; bgColor: string }> = {
      under_revision: { label: 'Under Final Copyediting Revisions', textColor: 'text-blue-800', bgColor: 'bg-blue-100' },
      draft_saved: { label: 'Revision Draft Saved', textColor: 'text-gray-800', bgColor: 'bg-gray-100' },
      awaiting_validation: { label: 'Awaiting Final Validation', textColor: 'text-purple-800', bgColor: 'bg-purple-100' },
      additional_corrections: { label: 'Additional Corrections Required', textColor: 'text-amber-800', bgColor: 'bg-amber-100' },
      revisions_applied: { label: 'Final Revisions Applied', textColor: 'text-teal-800', bgColor: 'bg-teal-100' },
      ready_production: { label: 'Ready for Production Preparation', textColor: 'text-green-800', bgColor: 'bg-green-100' },
      on_hold: { label: 'Revision Processing On Hold', textColor: 'text-red-800', bgColor: 'bg-red-100' },
      finalized: { label: 'Copyediting Finalized', textColor: 'text-emerald-800', bgColor: 'bg-emerald-100' },
    };
    return map[pageStatus];
  };

  const statusCfg = getStatusConfig();

  const getItemIcon = (status: RevisionItem['status']) => {
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

  const handleConfirm = () => {
    if (decision === 'finalize') setPageStatus('finalized');
    else if (decision === 'return') setPageStatus('additional_corrections');
    else if (decision === 'hold') setPageStatus('on_hold');
    setShowConfirmModal(false);
    onBack();
  };

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
              <p className="text-xs text-gray-400 uppercase tracking-widest mb-1 font-medium">TWG Copyeditor Workflow</p>
              <h1 className="text-2xl font-bold font-serif mb-1">Apply Final Copyediting Revisions</h1>
              <p className="text-sm text-gray-300">Review author-approved feedback, apply final manuscript revisions, and prepare for production</p>
            </div>
            <div className="text-right flex flex-col items-end gap-2">
              <span className={`px-4 py-1.5 text-xs font-semibold rounded-full ${statusCfg.bgColor} ${statusCfg.textColor}`}>
                {statusCfg.label}
              </span>
              <div className="text-sm text-gray-300">
                <span className="mr-3">Deadline: <span className="text-white font-semibold">{deadline.toLocaleDateString()}</span></span>
                <span className="text-red-400 font-semibold">2 days remaining</span>
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
                <MessageSquare className="w-3.5 h-3.5" />
                View Editorial Notes
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
                  <p className="text-xs text-gray-500 uppercase tracking-wide mb-1">Latest Revision Date</p>
                  <p className="text-sm font-semibold text-gray-800">{revisionDate.toLocaleDateString()}</p>
                </div>
                <div>
                  <p className="text-xs text-gray-500 uppercase tracking-wide mb-1">Version</p>
                  <p className="text-sm font-semibold text-gray-800">v{manuscript.files.length + 1}.0</p>
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
                  {['Author Feedback', 'Final Copyediting Revisions', 'Production Preparation'].map((stage, i) => (
                    <div key={stage} className="flex items-center gap-2">
                      <div className={`w-2 h-2 rounded-full flex-shrink-0 ${i === 1 ? 'bg-[#0F2D5E]' : i < 1 ? 'bg-green-500' : 'bg-gray-300'}`} />
                      <span className={`text-xs ${i === 1 ? 'font-bold text-[#0F2D5E]' : i < 1 ? 'text-green-700' : 'text-gray-500'}`}>{stage}</span>
                      {i === 1 && <span className="ml-auto text-xs bg-[#0F2D5E] text-white px-1.5 py-0.5 rounded-full">Current</span>}
                    </div>
                  ))}
                </div>
              </div>
              <div className="bg-red-50 border border-red-200 rounded p-3">
                <p className="text-xs font-semibold text-red-800 mb-1">Revision Deadline</p>
                <p className="text-sm font-bold text-red-900">{deadline.toLocaleDateString()}</p>
                <p className="text-xs text-red-700 mt-0.5">2 days remaining — urgent</p>
              </div>
              <div className="bg-[#F7F8FA] border border-[#e8e3d8] rounded p-3">
                <p className="text-xs font-semibold text-[#0F2D5E] mb-2">Author Decision</p>
                <span className="px-2.5 py-1 text-xs bg-amber-100 text-amber-800 rounded-full font-semibold">Minor Corrections Requested</span>
                <p className="text-xs text-gray-500 mt-2">Citation reformatting + terminology clarification</p>
              </div>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-3 gap-6">

          {/* SECTION 2 — Final Revision Summary Panel */}
          <div className="bg-white rounded-sm border border-gray-200 shadow-sm p-5">
            <h2 className="text-sm font-bold font-serif text-[#0F2D5E] uppercase tracking-wide mb-4">Final Revision Summary</h2>

            <div className="mb-4">
              <div className="flex items-center justify-between mb-1.5">
                <span className="text-xs text-gray-600 font-medium">Revision Completion</span>
                <span className="text-xs font-bold text-[#0F2D5E]">{completeness}%</span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-2">
                <div className="bg-[#0F2D5E] h-2 rounded-full transition-all" style={{ width: `${completeness}%` }} />
              </div>
              <div className="flex gap-3 mt-2">
                <span className="text-xs text-green-700 font-medium">{completeCount} complete</span>
                {warningCount > 0 && <span className="text-xs text-amber-700 font-medium">{warningCount} warning</span>}
                {unresolvedCount > 0 && <span className="text-xs text-red-700 font-medium">{unresolvedCount} unresolved</span>}
              </div>
            </div>

            <div className="flex flex-wrap gap-1.5 mb-4">
              <span className="px-2 py-0.5 text-xs rounded-full bg-green-100 text-green-800 font-medium">{completeCount} Complete</span>
              {warningCount > 0 && <span className="px-2 py-0.5 text-xs rounded-full bg-amber-100 text-amber-800 font-medium">{warningCount} Warning</span>}
              {unresolvedCount > 0 && <span className="px-2 py-0.5 text-xs rounded-full bg-red-100 text-red-800 font-medium">{unresolvedCount} Unresolved</span>}
            </div>

            <div className="space-y-2.5">
              {revisionItems.map(item => (
                <div key={item.id} className="flex items-start gap-2.5">
                  <div className="flex-shrink-0 mt-0.5">{getItemIcon(item.status)}</div>
                  <span className={`text-xs leading-snug ${item.status === 'complete' ? 'text-gray-800' : item.status === 'warning' ? 'text-amber-800' : 'text-red-800'}`}>
                    {item.label}
                  </span>
                </div>
              ))}
            </div>
          </div>

          {/* SECTION 3 — Final Copyediting Review Panel */}
          <div className="col-span-2 bg-white rounded-sm border border-gray-200 shadow-sm p-5">
            <h2 className="text-sm font-bold font-serif text-[#0F2D5E] uppercase tracking-wide mb-4">Final Copyediting Review</h2>

            <div className="bg-[#F7F8FA] border border-[#e8e3d8] rounded p-4 mb-4 min-h-[160px] flex flex-col justify-between">
              <div className="flex items-center justify-between mb-3">
                <div className="flex items-center gap-2">
                  <FileCheck className="w-4 h-4 text-[#0F2D5E]" />
                  <span className="text-xs font-semibold text-[#0F2D5E]">Final Revised Manuscript Preview</span>
                </div>
                <div className="flex gap-2">
                  <span className="px-2 py-0.5 text-xs bg-blue-100 text-blue-800 rounded-full font-medium">Preview Only</span>
                  <button className="flex items-center gap-1 px-2.5 py-1 border border-[#1a1f2e] text-[#0F2D5E] rounded text-xs font-medium hover:bg-[#0F2D5E] hover:text-white transition-colors">
                    <Download className="w-3 h-3" />
                    Download
                  </button>
                </div>
              </div>
              <div className="bg-white border border-gray-200 rounded p-4 text-center flex-1 flex items-center justify-center">
                <div>
                  <FileText className="w-8 h-8 mx-auto mb-2 text-gray-300" />
                  <p className="text-xs text-gray-500">final-revised-manuscript-v3.docx</p>
                  <p className="text-xs text-gray-400 mt-1">Preview mode · 2.9 MB · 28 pages</p>
                </div>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-3">
                <div>
                  <p className="text-xs text-gray-500 uppercase tracking-wide mb-1">Copyediting Revision Notes</p>
                  <div className="bg-gray-50 border border-gray-200 rounded p-3 text-xs text-gray-700 leading-relaxed">
                    Citation formatting in sections 3.2 and 4.1 updated per author request. Terminology clarifications applied to pp. 12–14. All other formatting maintained per journal template.
                  </div>
                </div>
                <div>
                  <p className="text-xs text-gray-500 uppercase tracking-wide mb-1">Applied Correction References</p>
                  <div className="space-y-1.5">
                    {['Section 3.2 — Citation Format Updated', 'Section 4.1 — Citation Format Updated', 'pp. 12–14 — Terminology Clarified'].map((ref, i) => (
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
                  <p className="text-xs text-gray-500 uppercase tracking-wide mb-1">Version Comparison</p>
                  <div className="space-y-1.5">
                    {[
                      { label: 'Original Copyedited', version: 'v2.0', badge: 'Reference' },
                      { label: 'Author Annotated', version: 'v2.1', badge: 'Author Feedback' },
                      { label: 'Final Revised', version: 'v3.0', badge: 'Current' },
                    ].map(item => (
                      <div key={item.label} className="flex items-center justify-between py-1.5 border-b border-gray-100 last:border-0">
                        <div>
                          <p className="text-xs font-medium text-gray-800">{item.label}</p>
                          <p className="text-xs text-gray-500">{item.version}</p>
                        </div>
                        <span className={`px-2 py-0.5 text-xs rounded-full font-medium ${item.badge === 'Current' ? 'bg-[#0F2D5E] text-white' : 'bg-gray-100 text-gray-700'}`}>{item.badge}</span>
                      </div>
                    ))}
                  </div>
                </div>
                <div className="bg-[#F7F8FA] border border-[#e8e3d8] rounded p-3">
                  <p className="text-xs font-semibold text-[#0F2D5E] mb-2">Author Feedback Reference</p>
                  <div className="space-y-1">
                    <p className="text-xs text-gray-600">Citation reformatting: <span className="font-medium text-amber-800">In Progress</span></p>
                    <p className="text-xs text-gray-600">Terminology clarification: <span className="font-medium text-green-800">Applied</span></p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-6">

          {/* SECTION 4 — Final Validation Assessment */}
          <div className="bg-white rounded-sm border border-gray-200 shadow-sm p-5">
            <h2 className="text-sm font-bold font-serif text-[#0F2D5E] uppercase tracking-wide mb-4">Final Validation Assessment</h2>
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
                <p className="text-xs font-semibold text-gray-700">Overall Readiness</p>
                <span className="px-3 py-1 bg-blue-100 text-blue-800 rounded-full text-xs font-bold">89% — Nearly Production Ready</span>
              </div>
              <p className="text-xs text-amber-700 mt-2 flex items-center gap-1.5">
                <AlertCircle className="w-3.5 h-3.5 flex-shrink-0" />
                Citation consistency must be resolved before finalizing.
              </p>
            </div>
          </div>

          {/* SECTION 5 — TWG Revision Processing Panel */}
          <div className="bg-white rounded-sm border border-gray-200 shadow-sm p-5">
            <h2 className="text-sm font-bold font-serif text-[#0F2D5E] uppercase tracking-wide mb-4">TWG Revision Processing</h2>

            <div className="space-y-3 mb-5">
              {[
                { label: 'Final Revision Notes', value: finalRevisionNotes, setter: setFinalRevisionNotes, placeholder: 'Summarize all applied corrections and remaining notes...', required: true },
                { label: 'Applied Correction Summary', value: correctionSummary, setter: setCorrectionSummary, placeholder: 'List all author-requested corrections that have been applied...' },
                { label: 'Remaining Production Concerns', value: productionConcerns, setter: setProductionConcerns, placeholder: 'Flag any concerns that need production team attention...' },
                { label: 'Layout Preparation Notes', value: layoutNotes, setter: setLayoutNotes, placeholder: 'Instructions for layout and typesetting team...' },
                { label: 'Editorial Coordination Notes', value: editorialCoordNotes, setter: setEditorialCoordNotes, placeholder: 'Notes for editorial team regarding this finalized revision...' },
              ].map(field => (
                <div key={field.label}>
                  <label className="text-xs text-gray-500 uppercase tracking-wide block mb-1">
                    {field.label}{field.required && <span className="text-red-500 ml-1">*</span>}
                  </label>
                  <textarea
                    value={field.value}
                    onChange={e => field.setter(e.target.value)}
                    placeholder={field.placeholder}
                    rows={2}
                    className="w-full border border-gray-300 rounded p-2.5 text-xs text-gray-800 resize-none focus:outline-none focus:ring-1 focus:ring-[#1a1f2e] focus:border-[#1a1f2e]"
                  />
                </div>
              ))}
            </div>

            <div className="space-y-2">
              <p className="text-xs text-gray-500 uppercase tracking-wide font-medium mb-2">Decision</p>
              {[
                { id: 'finalize' as RevisionDecision, label: 'Finalize Copyediting Revisions', icon: CheckCircle, colors: 'border-green-600 text-green-700 bg-green-50 hover:bg-green-100' },
                { id: 'return' as RevisionDecision, label: 'Return for Additional Corrections', icon: RotateCcw, colors: 'border-amber-500 text-amber-700 bg-amber-50 hover:bg-amber-100' },
                { id: 'hold' as RevisionDecision, label: 'Hold for Further Validation', icon: PauseCircle, colors: 'border-gray-400 text-gray-700 bg-gray-50 hover:bg-gray-100' },
              ].map(opt => {
                const Icon = opt.icon;
                return (
                  <button
                    key={opt.id}
                    onClick={() => setDecision(decision === opt.id ? null : opt.id)}
                    className={`w-full flex items-center gap-2.5 px-3 py-2.5 border-2 rounded text-xs font-semibold transition-all ${opt.colors} ${decision === opt.id ? 'ring-2 ring-offset-1 ring-[#1a1f2e]' : ''}`}
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
            <div className="space-y-2.5 mb-4">
              {revisionFiles.map(file => (
                <div key={file.id} className="flex items-start gap-2.5 p-2.5 bg-gray-50 rounded border border-gray-100 hover:border-gray-300 transition-colors">
                  <FileText className="w-4 h-4 text-[#0F2D5E] flex-shrink-0 mt-0.5" />
                  <div className="flex-1 min-w-0">
                    <p className="text-xs font-semibold text-gray-800 truncate">{file.name}</p>
                    <p className="text-xs text-gray-500">{file.type} · {file.size}</p>
                    <p className="text-xs text-gray-400">{file.date.toLocaleDateString()}</p>
                  </div>
                  <div className="flex flex-col items-end gap-1.5">
                    <span className={`px-1.5 py-0.5 text-xs rounded-full font-medium whitespace-nowrap ${getFileBadge(file.status)}`}>
                      {getFileLabel(file.status)}
                    </span>
                    <button className="text-gray-400 hover:text-[#0F2D5E] transition-colors">
                      <Download className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              ))}
            </div>
            <div className="space-y-2">
              {['Upload Finalized Manuscript', 'Upload Marked Version'].map(label => (
                <button key={label} className="w-full flex items-center justify-center gap-2 px-3 py-2 border border-dashed border-gray-300 rounded text-xs text-gray-600 hover:border-[#1a1f2e] hover:text-[#0F2D5E] transition-colors">
                  <Upload className="w-3.5 h-3.5" />
                  {label}
                </button>
              ))}
            </div>
          </div>

          {/* SECTION 7 + 8 — Workflow Status + Timeline */}
          <div className="space-y-4">
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
                  <span className="font-medium text-gray-800">{new Date().toLocaleDateString()}</span>
                </div>
                <div className="flex justify-between text-xs">
                  <span className="text-gray-500">Delay Risk</span>
                  <span className="px-2 py-0.5 bg-red-100 text-red-800 rounded-full font-medium">High Risk</span>
                </div>
                <div className="flex justify-between text-xs">
                  <span className="text-gray-500">Next Stage</span>
                  <span className="font-medium text-gray-800">Production Preparation</span>
                </div>
              </div>
            </div>

            <div className="bg-white rounded-sm border border-gray-200 shadow-sm p-5">
              <h2 className="text-sm font-bold font-serif text-[#0F2D5E] uppercase tracking-wide mb-3">Timeline Recommendation</h2>
              <div className="space-y-2.5">
                {[
                  { label: 'Recommended Revision Duration', value: '1–2 days', badge: null },
                  { label: 'Current Stage Progress', value: '55%', badge: null },
                  { label: 'Delay Risk', badge: 'Moderate Delay Risk', value: '' },
                  { label: 'Est. Next-Stage Transition', value: 'May 29, 2026', badge: null },
                  { label: 'Timeline Confidence', badge: 'On Schedule', value: '' },
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

          {/* SECTION 9 + 10 + 11 — History, Alerts, Activity */}
          <div className="space-y-4">
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
              Preview Final Manuscript
            </button>
            <button className="flex items-center gap-2 px-4 py-2 border border-gray-300 text-gray-700 rounded text-sm font-medium hover:bg-gray-50 transition-colors">
              <Upload className="w-4 h-4" />
              Upload Finalized Manuscript
            </button>
          </div>

          <div className="flex items-center gap-3">
            {pageStatus === 'draft_saved' && (
              <span className="flex items-center gap-1.5 text-xs text-gray-500">
                <CheckCircle className="w-3.5 h-3.5 text-green-500" />
                Draft saved
              </span>
            )}
            <button onClick={onBack} className="px-4 py-2 border border-gray-300 text-gray-600 rounded text-sm font-medium hover:bg-gray-50 transition-colors">
              Cancel
            </button>
            <button
              onClick={() => { setDecision('return'); setShowConfirmModal(true); }}
              className="flex items-center gap-2 px-4 py-2 border border-amber-500 text-amber-700 bg-amber-50 rounded text-sm font-medium hover:bg-amber-100 transition-colors"
            >
              <RotateCcw className="w-4 h-4" />
              Return for Corrections
            </button>
            <button
              onClick={() => { setDecision('finalize'); setShowConfirmModal(true); }}
              className="flex items-center gap-2 px-5 py-2 bg-[#0F2D5E] text-white rounded text-sm font-semibold hover:bg-[#252b3d] transition-colors"
            >
              <CheckCircle className="w-4 h-4" />
              Finalize Copyediting Revisions
            </button>
          </div>
        </div>
      </div>

      {/* Confirmation Modal */}
      {showConfirmModal && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-sm border-2 border-[#1a1f2e] shadow-2xl w-full max-w-md p-6">
            <h3 className="text-lg font-bold font-serif text-[#0F2D5E] mb-2">
              {decision === 'finalize' ? 'Finalize Copyediting Revisions' : decision === 'return' ? 'Return for Additional Corrections' : 'Hold for Further Validation'}
            </h3>
            <p className="text-sm text-gray-600 mb-4">
              {decision === 'finalize'
                ? 'The final revised manuscript will be marked as copyediting-complete and forwarded for production preparation. This action cannot be undone.'
                : decision === 'return'
                ? 'The manuscript will be returned for additional corrections. The editor and author will be notified.'
                : 'The revision processing will be placed on hold pending further validation.'}
            </p>
            <div className="bg-[#F7F8FA] border border-[#e8e3d8] rounded p-3 mb-5 space-y-1.5 text-xs text-gray-700">
              <p><span className="font-semibold">Manuscript:</span> {manuscript.title}</p>
              <p><span className="font-semibold">Author:</span> {manuscript.authorName}</p>
              <p><span className="font-semibold">Version:</span> v{manuscript.files.length + 1}.0</p>
              <p><span className="font-semibold">Action:</span> {decision === 'finalize' ? 'Finalize & Send to Production' : decision === 'return' ? 'Return for Corrections' : 'Place on Hold'}</p>
            </div>
            <div className="flex gap-3">
              <button onClick={() => setShowConfirmModal(false)} className="flex-1 px-4 py-2 border border-gray-300 text-gray-700 rounded text-sm font-medium hover:bg-gray-50">
                Cancel
              </button>
              <button
                onClick={handleConfirm}
                className={`flex-1 px-4 py-2 rounded text-sm font-semibold text-white ${decision === 'finalize' ? 'bg-[#0F2D5E] hover:bg-[#252b3d]' : decision === 'return' ? 'bg-amber-600 hover:bg-amber-700' : 'bg-gray-600 hover:bg-gray-700'}`}
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
