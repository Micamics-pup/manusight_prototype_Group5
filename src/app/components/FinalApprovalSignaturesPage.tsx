import React, { useState } from 'react';
import type { Manuscript } from '../types';
import {
  ChevronLeft, ChevronRight,
  Bell, FileText, CheckCircle, XCircle, AlertTriangle,
  Clock, Users, Activity, BarChart3, Settings, RefreshCw,
  Download, Send, BookOpen, Calendar,
  Award, Home, TrendingUp, Shield,
  AlignLeft, Eye, Lock, PenTool,
} from 'lucide-react';

interface FinalApprovalSignaturesPageProps {
  manuscript: Manuscript;
  onRejectForRevision: () => void;
  onApproveComplete: () => void;
}

type ActiveNav = 'dashboard' | 'manuscripts' | 'reviewers' | 'revisions' | 'production' | 'proof_review' | 'approval' | 'notifications' | 'reports' | 'settings';
type PreviewTab = 'cover' | 'prelims' | 'copyright' | 'toc' | 'chapter';
type ModalAction = 'approve_sign' | 'reject' | 'submit_final' | null;

interface ApprovalCheckItem {
  id: string;
  label: string;
  description: string;
  required: boolean;
}

const approvalChecklist: ApprovalCheckItem[] = [
  { id: 'a1', label: 'Final Content Verified', description: 'All manuscript content matches the approved final draft', required: true },
  { id: 'a2', label: 'Formatting Approved', description: 'Typography, layout, and styling conform to publication standards', required: true },
  { id: 'a3', label: 'Revisions Completed', description: 'All requested revisions have been applied and confirmed', required: true },
  { id: 'a4', label: 'Publication Proof Reviewed', description: 'Complete proof has been reviewed page by page', required: true },
  { id: 'a5', label: 'Copyright Information Confirmed', description: 'ISBN, copyright statement, and licensing terms are accurate', required: true },
  { id: 'a6', label: 'Author Consent Verified', description: 'Author has provided informed consent for publication', required: true },
];

const navItems: Array<{ id: ActiveNav; label: string; icon: React.ComponentType<{ className?: string }> }> = [
  { id: 'dashboard', label: 'Dashboard', icon: Home },
  { id: 'manuscripts', label: 'Assigned Manuscripts', icon: FileText },
  { id: 'reviewers', label: 'Reviewer Management', icon: Users },
  { id: 'revisions', label: 'Revision Monitoring', icon: RefreshCw },
  { id: 'production', label: 'Production Workflow', icon: Activity },
  { id: 'proof_review', label: 'Final Proof Review', icon: BookOpen },
  { id: 'approval', label: 'Publication Approval', icon: Award },
  { id: 'notifications', label: 'Notifications', icon: Bell },
  { id: 'reports', label: 'Reports', icon: BarChart3 },
  { id: 'settings', label: 'Settings', icon: Settings },
];

const productionTimeline = [
  { label: 'Submission', date: 'Mar 15, 2024', done: true },
  { label: 'Peer Review', date: 'Apr 3, 2024', done: true },
  { label: 'Copyediting', date: 'Apr 28, 2024', done: true },
  { label: 'Layout & Design', date: 'May 12, 2024', done: true },
  { label: 'Proof Generation', date: 'May 20, 2024', done: true },
  { label: 'Editor Proof Review', date: 'May 25, 2024', done: true },
  { label: 'Revision Corrections', date: 'May 27, 2024', done: true },
  { label: 'Final Approval & Signatures', date: 'Today', done: false, current: true },
  { label: 'Publication Preparation', date: 'Jun 4, 2024', done: false },
  { label: 'Publication', date: 'Jun 10, 2024', done: false },
];

export function FinalApprovalSignaturesPage({ manuscript, onRejectForRevision, onApproveComplete }: FinalApprovalSignaturesPageProps) {
  const [activeNav, setActiveNav] = useState<ActiveNav>('approval');
  const [previewTab, setPreviewTab] = useState<PreviewTab>('cover');
  const [showModal, setShowModal] = useState<ModalAction>(null);
  const [checkedItems, setCheckedItems] = useState<Record<string, boolean>>({});
  const [authorSigned, setAuthorSigned] = useState(false);
  const [editorSigned, setEditorSigned] = useState(false);
  const [secureApproval, setSecureApproval] = useState(false);
  const [authorSignDate, setAuthorSignDate] = useState('');
  const [editorSignDate, setEditorSignDate] = useState('');
  const [rejectionReason, setRejectionReason] = useState('');

  const publicationDate = new Date(Date.now() + 14 * 24 * 60 * 60 * 1000);
  const versionNumber = 'v2.0-final';
  const isbnNumber = '978-3-16-148410-0';

  const checkedCount = Object.values(checkedItems).filter(Boolean).length;
  const allChecked = checkedCount === approvalChecklist.length;
  const canSubmit = allChecked && authorSigned && editorSigned && secureApproval;
  const readinessScore = Math.round((
    (checkedCount / approvalChecklist.length) * 50 +
    (authorSigned ? 20 : 0) +
    (editorSigned ? 20 : 0) +
    (secureApproval ? 10 : 0)
  ));

  const toggleCheck = (id: string) => {
    setCheckedItems(prev => ({ ...prev, [id]: !prev[id] }));
  };

  const handleAuthorSign = () => {
    setAuthorSigned(true);
    setAuthorSignDate(new Date().toLocaleString());
  };

  const handleEditorSign = () => {
    setEditorSigned(true);
    setEditorSignDate(new Date().toLocaleString());
  };

  const handleConfirm = () => {
    if (showModal === 'reject') {
      setShowModal(null);
      onRejectForRevision();
    } else if (showModal === 'approve_sign' || showModal === 'submit_final') {
      setShowModal(null);
      onApproveComplete();
    }
  };

  // Simulated publication preview content
  const CoverPreview = () => (
    <div className="bg-gradient-to-br from-[#1a2744] to-[#0d1b35] rounded-lg h-full flex flex-col items-center justify-center text-center p-6">
      <div className="w-full max-w-sm">
        <div className="text-xs text-teal-400 font-semibold uppercase tracking-widest mb-4">Academic Journal of Research</div>
        <div className="text-white text-xl font-bold leading-tight mb-4">{manuscript.title}</div>
        <div className="w-16 h-0.5 bg-teal-400 mx-auto mb-4" />
        <div className="text-gray-300 text-sm mb-2">{manuscript.authorName}</div>
        <div className="text-gray-400 text-xs mb-8">Vol. 14, Issue 2 · June 2024</div>
        <div className="text-xs text-gray-500 border-t border-white/10 pt-4">
          ISBN {isbnNumber}
        </div>
      </div>
    </div>
  );

  const PrelimsPreview = () => (
    <div className="bg-white rounded-lg h-full overflow-y-auto p-6 grid grid-cols-2 gap-4">
      {/* Half-title page */}
      <div className="border border-gray-200 rounded p-4 flex flex-col items-center justify-center min-h-48">
        <div className="text-center">
          <div className="h-1 bg-gray-200 rounded w-3/4 mx-auto mb-2" />
          <div className="h-3 bg-gray-700 rounded w-5/6 mx-auto mb-1" />
          <div className="h-2 bg-gray-400 rounded w-2/3 mx-auto mb-1" />
          <div className="h-1.5 bg-gray-200 rounded w-1/2 mx-auto" />
          <div className="mt-6 h-1 bg-gray-200 rounded w-2/3 mx-auto mb-0.5" />
          <div className="h-1 bg-gray-200 rounded w-1/2 mx-auto" />
        </div>
        <p className="text-xs text-gray-400 mt-4">Half-title page</p>
      </div>
      {/* Copyright page */}
      <div className="border border-gray-200 rounded p-4 flex flex-col justify-between min-h-48">
        <div className="space-y-2">
          <div className="h-2 bg-gray-800 rounded w-2/3" />
          <div className="h-1.5 bg-gray-300 rounded w-full" />
          <div className="h-1.5 bg-gray-300 rounded w-5/6" />
          <div className="h-1.5 bg-gray-300 rounded w-full" />
          <div className="mt-3 h-1 bg-gray-200 rounded w-full" />
          <div className="h-1 bg-gray-200 rounded w-4/5" />
        </div>
        <div className="mt-4 pt-3 border-t border-gray-100 space-y-1">
          <div className="h-1 bg-gray-200 rounded w-full" />
          <div className="h-1 bg-gray-200 rounded w-3/4" />
          <p className="text-xs text-gray-400 mt-1">© Copyright {isbnNumber}</p>
        </div>
        <p className="text-xs text-gray-400 mt-2">Copyright &amp; ISBN page</p>
      </div>
    </div>
  );

  const CopyrightPreview = () => (
    <div className="bg-white rounded-lg h-full overflow-y-auto p-6">
      <div className="max-w-md mx-auto space-y-4">
        <div className="text-center border-b border-gray-200 pb-4">
          <p className="text-xs font-bold text-gray-800 mb-1">COPYRIGHT INFORMATION</p>
          <p className="text-xs text-gray-600">Academic Journal of Research · Vol. 14, No. 2</p>
        </div>
        {[
          { label: 'ISBN-13', value: isbnNumber },
          { label: 'Publisher', value: 'Academic Press International' },
          { label: 'Publication Year', value: '2024' },
          { label: 'License', value: 'CC BY-NC 4.0' },
          { label: 'DOI', value: '10.1234/ajr.2024.v14i2.001' },
          { label: 'ISSN (Online)', value: '2378-4520' },
          { label: 'Version', value: versionNumber },
        ].map((item, i) => (
          <div key={i} className="flex items-center justify-between py-2 border-b border-gray-50">
            <span className="text-xs font-semibold text-gray-600">{item.label}</span>
            <span className="text-xs text-gray-800 font-mono">{item.value}</span>
          </div>
        ))}
        <div className="mt-4 p-3 bg-emerald-50 border border-emerald-200 rounded-lg">
          <p className="text-xs text-emerald-700">
            <CheckCircle className="w-3 h-3 inline mr-1" />
            ISBN verified and registered with International ISBN Agency
          </p>
        </div>
      </div>
    </div>
  );

  const TOCPreview = () => (
    <div className="bg-white rounded-lg h-full overflow-y-auto p-6 grid grid-cols-2 gap-4">
      {[1, 2].map(pg => (
        <div key={pg} className="border border-gray-200 rounded p-4">
          <div className="text-xs font-bold text-gray-700 mb-3 uppercase tracking-wider">
            {pg === 1 ? 'Contents' : 'Contents (cont.)'}
          </div>
          <div className="space-y-2">
            {Array.from({ length: pg === 1 ? 5 : 4 }, (_, i) => (
              <div key={i} className="flex items-center gap-2">
                <div className="h-1.5 bg-gray-600 rounded w-1/12" />
                <div className="h-1.5 bg-gray-200 rounded flex-1" />
                <div className="h-1.5 bg-gray-400 rounded w-6" />
              </div>
            ))}
          </div>
        </div>
      ))}
    </div>
  );

  const ChapterPreview = () => (
    <div className="bg-white rounded-lg h-full overflow-y-auto p-4 grid grid-cols-2 gap-3">
      {[1, 2].map(pg => (
        <div key={pg} className="border border-gray-200 rounded overflow-hidden">
          <div className="px-3 py-2 border-b border-gray-100 flex items-center justify-between">
            <span className="text-xs text-gray-500 font-mono">{manuscript.id}</span>
            <span className="text-xs text-gray-500">{7 + pg}</span>
          </div>
          <div className="p-3 space-y-1.5">
            {pg === 1 && <div className="h-3 bg-gray-700 rounded w-4/5 mb-3" />}
            {Array.from({ length: 10 }, (_, i) => (
              <div key={i} className="h-1.5 bg-gray-200 rounded" style={{ width: `${[100,91,100,87,100,94,100,88,100,95][i]}%` }} />
            ))}
            {pg === 2 && (
              <div className="mt-2 border-2 border-dashed border-gray-200 rounded p-2 bg-gray-50">
                <div className="h-10 bg-gradient-to-br from-blue-50 to-indigo-100 rounded flex items-center justify-center">
                  <span className="text-xs text-gray-400">Figure</span>
                </div>
              </div>
            )}
          </div>
        </div>
      ))}
    </div>
  );

  const renderPreview = () => {
    switch (previewTab) {
      case 'cover': return <CoverPreview />;
      case 'prelims': return <PrelimsPreview />;
      case 'copyright': return <CopyrightPreview />;
      case 'toc': return <TOCPreview />;
      case 'chapter': return <ChapterPreview />;
    }
  };

  return (
    <div className="flex h-screen bg-gray-50 overflow-hidden">
      {/* Sidebar */}
      <aside className="w-64 bg-[#0f2744] flex-shrink-0 flex flex-col">
        <div className="px-5 py-5 border-b border-white/10">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 bg-emerald-500 rounded-lg flex items-center justify-center">
              <Award className="w-5 h-5 text-white" />
            </div>
            <div>
              <p className="text-white text-sm font-semibold">MMS Editor Portal</p>
              <p className="text-emerald-300 text-xs">Final Approval &amp; Signatures</p>
            </div>
          </div>
        </div>

        <nav className="flex-1 px-3 py-4 space-y-0.5 overflow-y-auto">
          {navItems.map(item => {
            const Icon = item.icon;
            const isActive = activeNav === item.id;
            return (
              <button
                key={item.id}
                onClick={() => setActiveNav(item.id)}
                className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-lg transition-all text-left ${
                  isActive
                    ? 'bg-emerald-600 text-white font-medium'
                    : 'text-blue-200 hover:bg-white/10 hover:text-white'
                }`}
              >
                <Icon className="w-4 h-4 flex-shrink-0" />
                <span className="text-sm">{item.label}</span>
              </button>
            );
          })}
        </nav>

        {/* Readiness in sidebar */}
        <div className="px-4 py-4 border-t border-white/10">
          <p className="text-xs text-blue-300 font-medium uppercase tracking-wider mb-3">Approval Readiness</p>
          <div className="flex items-center gap-3 mb-2">
            <div className="flex-1 bg-white/10 rounded-full h-2">
              <div
                className="bg-emerald-400 h-2 rounded-full transition-all"
                style={{ width: `${readinessScore}%` }}
              />
            </div>
            <span className="text-xs text-white font-bold">{readinessScore}%</span>
          </div>
          <div className="space-y-1 text-xs">
            <div className="flex items-center justify-between text-blue-200">
              <span>Checklist</span>
              <span className={checkedCount === approvalChecklist.length ? 'text-emerald-400' : 'text-amber-400'}>{checkedCount}/{approvalChecklist.length}</span>
            </div>
            <div className="flex items-center justify-between text-blue-200">
              <span>Author Signature</span>
              <span className={authorSigned ? 'text-emerald-400' : 'text-red-400'}>{authorSigned ? '✓ Signed' : 'Pending'}</span>
            </div>
            <div className="flex items-center justify-between text-blue-200">
              <span>Editor Signature</span>
              <span className={editorSigned ? 'text-emerald-400' : 'text-red-400'}>{editorSigned ? '✓ Signed' : 'Pending'}</span>
            </div>
          </div>
        </div>
      </aside>

      {/* Main area */}
      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Header */}
        <header className="bg-white border-b border-gray-200 px-6 py-3 flex-shrink-0">
          <div className="flex items-center justify-between gap-4">
            <div className="flex items-center gap-3 min-w-0">
              <div className="min-w-0">
                <div className="flex items-center gap-2">
                  <span className="text-xs font-mono text-gray-500 bg-gray-100 px-2 py-0.5 rounded">{manuscript.id}</span>
                  <ChevronRight className="w-3 h-3 text-gray-400" />
                  <h1 className="text-sm font-semibold text-gray-900 truncate max-w-md">{manuscript.title}</h1>
                </div>
                <div className="flex items-center gap-2 mt-0.5">
                  <span className="text-xs text-gray-500">Version {versionNumber}</span>
                  <span className="text-xs text-gray-400">·</span>
                  <span className="text-xs text-gray-500">Final Approval Stage (Step 8 of 10)</span>
                </div>
              </div>
            </div>

            <div className="flex items-center gap-3 flex-shrink-0">
              {canSubmit ? (
                <span className="flex items-center gap-1.5 px-3 py-1.5 bg-emerald-100 text-emerald-800 rounded-full text-xs font-semibold">
                  <CheckCircle className="w-3.5 h-3.5" /> Ready for Publication
                </span>
              ) : (
                <span className="flex items-center gap-1.5 px-3 py-1.5 bg-amber-100 text-amber-800 rounded-full text-xs font-semibold">
                  <Clock className="w-3.5 h-3.5" /> Awaiting Final Approval
                </span>
              )}
              <div className="flex items-center gap-1.5 px-3 py-1.5 bg-blue-50 text-blue-700 rounded-full text-xs font-medium">
                <Calendar className="w-3.5 h-3.5" />
                Pub: {publicationDate.toLocaleDateString()}
              </div>
              <div className="w-8 h-8 rounded-full bg-gradient-to-br from-purple-500 to-purple-700 flex items-center justify-center text-white text-xs font-semibold">
                SM
              </div>
            </div>
          </div>
        </header>

        {/* Content */}
        <div className="flex-1 overflow-y-auto p-6">
          <div className="max-w-[1400px] mx-auto">
            <div className="grid grid-cols-12 gap-6">

              {/* Left: Publication Preview & Summary (7 cols) */}
              <div className="col-span-7 space-y-5">

                {/* Approval Summary */}
                <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-5">
                  <div className="flex items-center justify-between mb-4">
                    <div className="flex items-center gap-2">
                      <Award className="w-4 h-4 text-emerald-600" />
                      <h2 className="text-sm font-semibold text-gray-900">Publication Approval Summary</h2>
                    </div>
                    <span className={`px-3 py-1 rounded-full text-xs font-semibold ${
                      canSubmit ? 'bg-emerald-100 text-emerald-700' : 'bg-amber-100 text-amber-700'
                    }`}>
                      {canSubmit ? 'Ready for Publication' : 'Approval Pending'}
                    </span>
                  </div>
                  <div className="grid grid-cols-4 gap-4">
                    <div className="col-span-2">
                      <p className="text-xs text-gray-500 mb-0.5">Manuscript Title</p>
                      <p className="text-sm font-semibold text-gray-900 leading-snug">{manuscript.title}</p>
                    </div>
                    <div>
                      <p className="text-xs text-gray-500 mb-0.5">Author(s)</p>
                      <p className="text-sm text-gray-800">{manuscript.authorName}</p>
                    </div>
                    <div>
                      <p className="text-xs text-gray-500 mb-0.5">Assigned Editor</p>
                      <p className="text-sm text-gray-800">Dr. S. Mitchell</p>
                    </div>
                    <div>
                      <p className="text-xs text-gray-500 mb-0.5">Publication Issue</p>
                      <p className="text-sm text-gray-800">Vol. 14, No. 2</p>
                    </div>
                    <div>
                      <p className="text-xs text-gray-500 mb-0.5">Final Approval Date</p>
                      <p className="text-sm text-gray-800">{new Date().toLocaleDateString()}</p>
                    </div>
                    <div>
                      <p className="text-xs text-gray-500 mb-0.5">Version</p>
                      <span className="inline-block px-2 py-0.5 bg-blue-100 text-blue-700 text-xs rounded font-mono">{versionNumber}</span>
                    </div>
                    <div>
                      <p className="text-xs text-gray-500 mb-0.5">ISBN-13</p>
                      <p className="text-xs font-mono text-gray-800">{isbnNumber}</p>
                    </div>
                  </div>
                </div>

                {/* Publication Preview */}
                <div className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden">
                  <div className="flex items-center justify-between px-5 py-3 border-b border-gray-100 bg-gray-50">
                    <div className="flex items-center gap-1">
                      {(
                        [
                          { id: 'cover', label: 'Cover' },
                          { id: 'prelims', label: 'Prelims' },
                          { id: 'copyright', label: 'Copyright & ISBN' },
                          { id: 'toc', label: 'Table of Contents' },
                          { id: 'chapter', label: 'Chapter View' },
                        ] as Array<{ id: PreviewTab; label: string }>
                      ).map(tab => (
                        <button
                          key={tab.id}
                          onClick={() => setPreviewTab(tab.id)}
                          className={`px-2.5 py-1.5 rounded-lg text-xs font-medium transition-colors ${
                            previewTab === tab.id ? 'bg-blue-600 text-white' : 'text-gray-600 hover:bg-gray-100'
                          }`}
                        >
                          {tab.label}
                        </button>
                      ))}
                    </div>
                    <button className="flex items-center gap-1 px-3 py-1.5 bg-gray-100 text-gray-600 rounded-lg hover:bg-gray-200 text-xs transition-colors">
                      <Download className="w-3.5 h-3.5" /> Download PDF
                    </button>
                  </div>
                  <div style={{ height: '360px' }} className="p-3">
                    {renderPreview()}
                  </div>
                </div>

                {/* Publication Readiness & Workflow Tracker */}
                <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-5">
                  <div className="flex items-center gap-2 mb-4">
                    <TrendingUp className="w-4 h-4 text-blue-600" />
                    <h2 className="text-sm font-semibold text-gray-900">Publication Readiness &amp; Workflow Completion</h2>
                  </div>
                  <div className="grid grid-cols-2 gap-6">
                    {/* Readiness score */}
                    <div>
                      <div className="flex items-center justify-between mb-2">
                        <span className="text-xs font-medium text-gray-700">Overall Readiness Score</span>
                        <span className={`text-xl font-bold ${readinessScore >= 80 ? 'text-emerald-600' : readinessScore >= 50 ? 'text-amber-600' : 'text-red-600'}`}>
                          {readinessScore}%
                        </span>
                      </div>
                      <div className="w-full bg-gray-100 rounded-full h-3 mb-4">
                        <div
                          className={`h-3 rounded-full transition-all ${readinessScore >= 80 ? 'bg-emerald-500' : readinessScore >= 50 ? 'bg-amber-500' : 'bg-red-500'}`}
                          style={{ width: `${readinessScore}%` }}
                        />
                      </div>
                      <div className="space-y-2">
                        {[
                          { label: 'Checklist Completion', value: `${checkedCount}/${approvalChecklist.length}`, done: allChecked },
                          { label: 'Digital Signatures', value: `${(authorSigned ? 1 : 0) + (editorSigned ? 1 : 0)}/2`, done: authorSigned && editorSigned },
                          { label: 'Proof Validation', value: '78% → 100%', done: false },
                          { label: 'Secure Approval', value: secureApproval ? 'Confirmed' : 'Pending', done: secureApproval },
                        ].map((item, i) => (
                          <div key={i} className="flex items-center justify-between text-xs">
                            <span className="text-gray-600">{item.label}</span>
                            <span className={`font-semibold ${item.done ? 'text-emerald-600' : 'text-amber-600'}`}>{item.value}</span>
                          </div>
                        ))}
                      </div>
                    </div>

                    {/* Production timeline */}
                    <div>
                      <p className="text-xs font-medium text-gray-700 mb-2">Production Timeline</p>
                      <div className="space-y-1.5 max-h-52 overflow-y-auto pr-1">
                        {productionTimeline.map((step, i) => (
                          <div key={i} className="flex items-center gap-2">
                            <div className={`w-5 h-5 rounded-full flex items-center justify-center flex-shrink-0 text-xs ${
                              step.done ? 'bg-emerald-500 text-white' :
                              (step as any).current ? 'bg-blue-600 text-white ring-4 ring-blue-100' :
                              'bg-gray-100 text-gray-400 border border-gray-200'
                            }`}>
                              {step.done ? '✓' : i + 1}
                            </div>
                            <div className="flex-1 min-w-0 flex items-center justify-between">
                              <span className={`text-xs truncate ${
                                step.done ? 'text-gray-400 line-through' :
                                (step as any).current ? 'text-blue-700 font-semibold' :
                                'text-gray-500'
                              }`}>{step.label}</span>
                              <span className="text-xs text-gray-400 ml-2 flex-shrink-0">{step.date}</span>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Right: Checklist, Signatures, Actions (5 cols) */}
              <div className="col-span-5 space-y-5">

                {/* Approval Checklist */}
                <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-5">
                  <div className="flex items-center justify-between mb-3">
                    <div className="flex items-center gap-2">
                      <CheckCircle className="w-4 h-4 text-teal-600" />
                      <h3 className="text-sm font-semibold text-gray-900">Final Approval Checklist</h3>
                    </div>
                    <span className={`text-xs font-bold ${allChecked ? 'text-emerald-600' : 'text-amber-600'}`}>
                      {checkedCount}/{approvalChecklist.length} Complete
                    </span>
                  </div>

                  <div className="space-y-2 mb-3">
                    {approvalChecklist.map(item => (
                      <button
                        key={item.id}
                        onClick={() => toggleCheck(item.id)}
                        className="w-full flex items-start gap-3 p-3 rounded-lg hover:bg-gray-50 transition-colors text-left border border-gray-100"
                      >
                        <div className={`w-5 h-5 rounded border-2 flex items-center justify-center flex-shrink-0 mt-0.5 transition-colors ${
                          checkedItems[item.id]
                            ? 'bg-emerald-600 border-emerald-600'
                            : 'border-gray-300 bg-white'
                        }`}>
                          {checkedItems[item.id] && <CheckCircle className="w-3 h-3 text-white" />}
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className={`text-xs font-semibold ${checkedItems[item.id] ? 'text-gray-400 line-through' : 'text-gray-800'}`}>
                            {item.label}
                          </p>
                          <p className="text-xs text-gray-500 mt-0.5">{item.description}</p>
                        </div>
                        {item.required && !checkedItems[item.id] && (
                          <span className="text-xs text-red-500 flex-shrink-0 font-medium">Required</span>
                        )}
                      </button>
                    ))}
                  </div>

                  <div className="w-full bg-gray-100 rounded-full h-2">
                    <div
                      className="bg-emerald-500 h-2 rounded-full transition-all"
                      style={{ width: `${(checkedCount / approvalChecklist.length) * 100}%` }}
                    />
                  </div>
                </div>

                {/* Digital Signature Panel */}
                <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-5">
                  <div className="flex items-center gap-2 mb-4">
                    <PenTool className="w-4 h-4 text-blue-600" />
                    <h3 className="text-sm font-semibold text-gray-900">Digital Signature Panel</h3>
                    <Shield className="w-3.5 h-3.5 text-teal-500 ml-auto" />
                    <span className="text-xs text-teal-600 font-medium">Secure</span>
                  </div>

                  {/* Author signature */}
                  <div className={`p-4 rounded-lg border-2 mb-3 transition-colors ${
                    authorSigned ? 'border-emerald-300 bg-emerald-50' : 'border-gray-200 bg-gray-50'
                  }`}>
                    <div className="flex items-start justify-between mb-2">
                      <div>
                        <p className="text-xs font-bold text-gray-800">Author Signature</p>
                        <p className="text-xs text-gray-600">{manuscript.authorName}</p>
                      </div>
                      {authorSigned ? (
                        <span className="flex items-center gap-1 text-xs text-emerald-700 font-semibold bg-emerald-100 px-2 py-1 rounded-full">
                          <CheckCircle className="w-3 h-3" /> Signed
                        </span>
                      ) : (
                        <span className="text-xs text-gray-400 font-medium">Awaiting</span>
                      )}
                    </div>
                    {authorSigned ? (
                      <div className="space-y-1">
                        <div className="font-bold italic text-lg text-gray-700" style={{ fontFamily: 'serif' }}>
                          {manuscript.authorName.split(' ').map(n => n[0]).join('.')} {manuscript.authorName.split(' ').pop()}
                        </div>
                        <p className="text-xs text-gray-500">Signed: {authorSignDate}</p>
                        <div className="flex items-center gap-1 text-xs text-teal-600">
                          <Shield className="w-3 h-3" /> Digitally authenticated
                        </div>
                      </div>
                    ) : (
                      <button
                        onClick={handleAuthorSign}
                        className="w-full py-2.5 bg-blue-600 text-white rounded-lg hover:bg-blue-700 text-xs font-medium transition-colors"
                      >
                        Sign as Author (Simulated)
                      </button>
                    )}
                  </div>

                  {/* Editor signature */}
                  <div className={`p-4 rounded-lg border-2 mb-4 transition-colors ${
                    editorSigned ? 'border-emerald-300 bg-emerald-50' : 'border-gray-200 bg-gray-50'
                  }`}>
                    <div className="flex items-start justify-between mb-2">
                      <div>
                        <p className="text-xs font-bold text-gray-800">Editor Signature</p>
                        <p className="text-xs text-gray-600">Dr. Sarah Mitchell (Senior Editor)</p>
                      </div>
                      {editorSigned ? (
                        <span className="flex items-center gap-1 text-xs text-emerald-700 font-semibold bg-emerald-100 px-2 py-1 rounded-full">
                          <CheckCircle className="w-3 h-3" /> Signed
                        </span>
                      ) : (
                        <span className="text-xs text-gray-400 font-medium">Awaiting</span>
                      )}
                    </div>
                    {editorSigned ? (
                      <div className="space-y-1">
                        <div className="font-bold italic text-lg text-gray-700" style={{ fontFamily: 'serif' }}>
                          S. Mitchell, Ph.D.
                        </div>
                        <p className="text-xs text-gray-500">Signed: {editorSignDate}</p>
                        <div className="flex items-center gap-1 text-xs text-teal-600">
                          <Shield className="w-3 h-3" /> Digitally authenticated
                        </div>
                      </div>
                    ) : (
                      <button
                        onClick={handleEditorSign}
                        className="w-full py-2.5 bg-purple-600 text-white rounded-lg hover:bg-purple-700 text-xs font-medium transition-colors"
                      >
                        Sign as Editor (You)
                      </button>
                    )}
                  </div>

                  {/* Secure approval checkbox */}
                  <div className={`p-3 rounded-lg border ${secureApproval ? 'border-emerald-300 bg-emerald-50' : 'border-gray-200 bg-gray-50'}`}>
                    <label className="flex items-start gap-3 cursor-pointer">
                      <input
                        type="checkbox"
                        checked={secureApproval}
                        onChange={e => setSecureApproval(e.target.checked)}
                        className="mt-0.5 w-4 h-4 rounded border-gray-300 text-emerald-600 focus:ring-emerald-500"
                      />
                      <div>
                        <p className="text-xs font-semibold text-gray-800">Secure Final Approval Confirmed</p>
                        <p className="text-xs text-gray-500 mt-0.5">I confirm that all manuscript contents, revisions, and proof corrections have been reviewed and approved. This action authorizes the manuscript for final publication.</p>
                      </div>
                    </label>
                  </div>

                  {/* Digital authentication indicator */}
                  <div className="mt-3 flex items-center gap-2 px-3 py-2 bg-blue-50 rounded-lg border border-blue-100">
                    <Lock className="w-3.5 h-3.5 text-blue-600 flex-shrink-0" />
                    <p className="text-xs text-blue-700">All signatures are digitally authenticated and timestamped via secure MMS protocol</p>
                  </div>
                </div>

                {/* Workflow Completion Tracker */}
                <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-5">
                  <div className="flex items-center gap-2 mb-3">
                    <Activity className="w-4 h-4 text-indigo-600" />
                    <h3 className="text-sm font-semibold text-gray-900">Workflow Completion</h3>
                  </div>
                  <div className="grid grid-cols-2 gap-3">
                    {[
                      { label: 'Checklist', progress: Math.round((checkedCount / approvalChecklist.length) * 100), color: 'bg-teal-500' },
                      { label: 'Signatures', progress: Math.round(((authorSigned ? 1 : 0) + (editorSigned ? 1 : 0)) / 2 * 100), color: 'bg-blue-500' },
                      { label: 'Proof Quality', progress: 82, color: 'bg-purple-500' },
                      { label: 'Overall', progress: readinessScore, color: 'bg-emerald-500' },
                    ].map((item, i) => (
                      <div key={i} className="p-3 bg-gray-50 rounded-lg border border-gray-100">
                        <div className="flex items-center justify-between mb-1.5">
                          <span className="text-xs text-gray-600">{item.label}</span>
                          <span className="text-xs font-bold text-gray-800">{item.progress}%</span>
                        </div>
                        <div className="w-full bg-gray-200 rounded-full h-1.5">
                          <div className={`${item.color} h-1.5 rounded-full transition-all`} style={{ width: `${item.progress}%` }} />
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Publication Schedule Confirmation */}
                <div className="bg-gradient-to-br from-blue-50 to-indigo-50 rounded-xl border border-blue-200 shadow-sm p-5">
                  <div className="flex items-center gap-2 mb-3">
                    <Calendar className="w-4 h-4 text-blue-600" />
                    <h3 className="text-sm font-semibold text-gray-900">Publication Schedule</h3>
                  </div>
                  <div className="space-y-2 text-xs">
                    {[
                      { label: 'Final Approval Today', value: new Date().toLocaleDateString() },
                      { label: 'Pub Prep & Upload', value: 'Jun 4–8, 2024' },
                      { label: 'Index & DOI Registration', value: 'Jun 9, 2024' },
                      { label: 'Online Publication', value: publicationDate.toLocaleDateString() },
                      { label: 'Print Distribution', value: 'Jun 20, 2024' },
                    ].map((item, i) => (
                      <div key={i} className="flex items-center justify-between py-1 border-b border-blue-100 last:border-0">
                        <span className="text-blue-700">{item.label}</span>
                        <span className="font-semibold text-blue-900">{item.value}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Sticky bottom action bar */}
        <div className="bg-white border-t border-gray-200 px-6 py-4 flex-shrink-0">
          <div className="flex items-center justify-between max-w-[1400px] mx-auto">
            <div className="flex items-center gap-2">
              <button className="flex items-center gap-1.5 px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors text-sm">
                <Download className="w-4 h-4" /> Download Final Proof
              </button>
              <button
                onClick={() => setShowModal('reject')}
                className="flex items-center gap-1.5 px-4 py-2 border border-red-300 text-red-600 rounded-lg hover:bg-red-50 transition-colors text-sm"
              >
                <XCircle className="w-4 h-4" /> Reject for Further Revision
              </button>
            </div>
            <div className="flex items-center gap-3">
              <button
                onClick={() => setShowModal('approve_sign')}
                disabled={!canSubmit}
                className="flex items-center gap-1.5 px-5 py-2.5 bg-emerald-600 text-white rounded-lg hover:bg-emerald-700 transition-colors text-sm font-medium disabled:opacity-40 disabled:cursor-not-allowed"
              >
                <PenTool className="w-4 h-4" /> Approve &amp; Sign
              </button>
              <button
                onClick={() => setShowModal('submit_final')}
                disabled={!canSubmit}
                className="flex items-center gap-1.5 px-5 py-2.5 bg-blue-700 text-white rounded-lg hover:bg-blue-800 transition-colors text-sm font-medium disabled:opacity-40 disabled:cursor-not-allowed"
              >
                <Send className="w-4 h-4" /> Submit Final Approval
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Confirmation Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl shadow-2xl max-w-md w-full p-6">
            <div className={`w-12 h-12 rounded-full flex items-center justify-center mx-auto mb-4 ${
              showModal === 'reject' ? 'bg-red-100' :
              showModal === 'approve_sign' ? 'bg-emerald-100' :
              'bg-blue-100'
            }`}>
              {showModal === 'reject' && <XCircle className="w-6 h-6 text-red-600" />}
              {showModal === 'approve_sign' && <PenTool className="w-6 h-6 text-emerald-600" />}
              {showModal === 'submit_final' && <Send className="w-6 h-6 text-blue-600" />}
            </div>
            <h3 className="text-lg font-bold text-gray-900 text-center mb-2">
              {showModal === 'reject' && 'Reject for Further Revision'}
              {showModal === 'approve_sign' && 'Approve & Sign Publication'}
              {showModal === 'submit_final' && 'Submit Final Approval'}
            </h3>
            <p className="text-sm text-gray-600 text-center mb-3">
              {showModal === 'reject' && 'Return this manuscript to the Final Review Revisions stage. Additional layout corrections will be required before re-submission.'}
              {showModal === 'approve_sign' && 'Digitally approve and sign this manuscript for publication. All signatures and checklist items will be recorded and timestamped.'}
              {showModal === 'submit_final' && 'Submit the final approval to advance this manuscript to Publication Preparation. This action is irreversible without editorial override.'}
            </p>
            {showModal === 'reject' && (
              <textarea
                value={rejectionReason}
                onChange={e => setRejectionReason(e.target.value)}
                rows={3}
                placeholder="Reason for rejection / additional revision instructions..."
                className="w-full text-xs border border-gray-300 rounded-lg p-3 focus:outline-none focus:ring-2 focus:ring-red-500 resize-none mb-3 placeholder-gray-400"
              />
            )}
            {(showModal === 'approve_sign' || showModal === 'submit_final') && (
              <div className="mb-3 p-3 bg-emerald-50 border border-emerald-200 rounded-lg text-xs text-emerald-700">
                <CheckCircle className="w-3 h-3 inline mr-1" />
                All {checkedCount} checklist items confirmed · {(authorSigned ? 1 : 0) + (editorSigned ? 1 : 0)} of 2 signatures secured · Secure approval confirmed
              </div>
            )}
            <div className="flex gap-3 mt-4">
              <button
                onClick={() => setShowModal(null)}
                className="flex-1 px-4 py-2.5 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 text-sm font-medium"
              >
                Cancel
              </button>
              <button
                onClick={handleConfirm}
                className={`flex-1 px-4 py-2.5 text-white rounded-lg text-sm font-medium ${
                  showModal === 'reject' ? 'bg-red-600 hover:bg-red-700' :
                  showModal === 'approve_sign' ? 'bg-emerald-600 hover:bg-emerald-700' :
                  'bg-blue-700 hover:bg-blue-800'
                }`}
              >
                {showModal === 'reject' ? 'Confirm Rejection' : 'Confirm & Submit'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
