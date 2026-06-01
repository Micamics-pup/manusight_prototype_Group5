import React, { useState } from 'react';
import type { Manuscript } from '../types';
import {
  ChevronLeft, ChevronRight, ZoomIn, ZoomOut,
  Bell, FileText, CheckCircle, XCircle, AlertTriangle, AlertCircle,
  Clock, Users, Activity, BarChart3, Settings, RefreshCw,
  Download, Send, MessageSquare, BookOpen, Eye, Calendar,
  Award, Home, TrendingUp, ChevronDown, ArrowRight,
  AlignLeft, Edit, Printer, Shield, Layers,
} from 'lucide-react';

interface FinalProofReviewPageProps {
  manuscript: Manuscript;
  onBack: () => void;
  onRequestRevisions: () => void;
  onSendForFinalApproval: () => void;
}

type ActiveNav = 'dashboard' | 'manuscripts' | 'reviewers' | 'revisions' | 'production' | 'proof_review' | 'approval' | 'notifications' | 'reports' | 'settings';
type ActiveProofTab = 'full' | 'thumbnails' | 'annotations' | 'typography';
type ModalAction = 'approve' | 'request_revisions' | 'return_twg' | 'send_approval' | null;

interface ValidationCheck {
  id: string;
  label: string;
  status: 'pass' | 'warning' | 'fail';
  detail: string;
}

const validationChecks: ValidationCheck[] = [
  { id: 'v1', label: 'Formatting Consistency', status: 'pass', detail: 'All sections conform to APA style template' },
  { id: 'v2', label: 'Typography Consistency', status: 'pass', detail: 'Font sizes and styles are uniform throughout' },
  { id: 'v3', label: 'Page Numbering', status: 'pass', detail: 'Sequential numbering verified (pp. 1–24)' },
  { id: 'v4', label: 'Margin Alignment', status: 'warning', detail: 'Minor margin variations on pp. 8 and 17' },
  { id: 'v5', label: 'Figure Placement', status: 'pass', detail: '8 of 8 figures correctly positioned' },
  { id: 'v6', label: 'Table Formatting', status: 'warning', detail: 'Table 3 header row bold formatting inconsistency' },
  { id: 'v7', label: 'Image Resolution', status: 'fail', detail: 'Figure 5 is 72 DPI — minimum 300 DPI required' },
  { id: 'v8', label: 'Missing Elements', status: 'pass', detail: 'All required sections present and accounted for' },
  { id: 'v9', label: 'References Format', status: 'pass', detail: 'APA 7th edition format fully compliant' },
  { id: 'v10', label: 'ISBN & Copyright Page', status: 'pass', detail: 'ISBN-13 validated, copyright page present' },
];

const passCount = validationChecks.filter(v => v.status === 'pass').length;
const warnCount = validationChecks.filter(v => v.status === 'warning').length;
const failCount = validationChecks.filter(v => v.status === 'fail').length;
const readinessScore = Math.round(((passCount * 10 + warnCount * 5) / (validationChecks.length * 10)) * 100);

const workflowStages = [
  { label: 'Submission', done: true },
  { label: 'Peer Review', done: true },
  { label: 'Copyediting', done: true },
  { label: 'Layout & Design', done: true },
  { label: 'Proof Generation', done: true },
  { label: 'Final Proof Review', done: false, current: true },
  { label: 'Approval & Signatures', done: false },
  { label: 'Publication', done: false },
];

const ganttItems = [
  { label: 'Typesetting', start: 0, width: 25, status: 'done' as const },
  { label: 'Proof Gen.', start: 25, width: 15, status: 'done' as const },
  { label: 'Editor Review', start: 40, width: 20, status: 'active' as const },
  { label: 'Revisions', start: 60, width: 15, status: 'pending' as const },
  { label: 'Approval', start: 75, width: 15, status: 'pending' as const },
  { label: 'Publication', start: 90, width: 10, status: 'pending' as const },
];

const proofHistory = [
  { version: 'v1.0', date: '2024-05-20', by: 'TWG Layout Team', note: 'Initial proof generated' },
  { version: 'v1.1', date: '2024-05-23', by: 'TWG Layout Team', note: 'Figure 5 resolution corrected (pending)' },
  { version: 'v1.2', date: '2024-05-25', by: 'TWG Coordinator', note: 'Final proof submitted for editor review' },
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

export function FinalProofReviewPage({ manuscript, onBack, onRequestRevisions, onSendForFinalApproval }: FinalProofReviewPageProps) {
  const [activeNav, setActiveNav] = useState<ActiveNav>('proof_review');
  const [currentPage, setCurrentPage] = useState(1);
  const [zoomLevel, setZoomLevel] = useState(100);
  const [activeTab, setActiveTab] = useState<ActiveProofTab>('full');
  const [showModal, setShowModal] = useState<ModalAction>(null);
  const [editorNotes, setEditorNotes] = useState('');
  const [revisionRequests, setRevisionRequests] = useState('');
  const [proofApproved, setProofApproved] = useState(false);
  const [validationExpanded, setValidationExpanded] = useState(true);

  const totalPages = 24;
  const deadline = new Date(Date.now() + 14 * 24 * 60 * 60 * 1000);
  const daysLeft = Math.ceil((deadline.getTime() - Date.now()) / (1000 * 60 * 60 * 24));
  const proofGeneratedDate = new Date(Date.now() - 2 * 24 * 60 * 60 * 1000);

  const handleConfirm = () => {
    if (showModal === 'approve') {
      setProofApproved(true);
      setShowModal(null);
    } else if (showModal === 'request_revisions') {
      setShowModal(null);
      onRequestRevisions();
    } else if (showModal === 'send_approval') {
      setShowModal(null);
      onSendForFinalApproval();
    } else if (showModal === 'return_twg') {
      setShowModal(null);
      onBack();
    }
  };

  const validationStatusIcon = (status: ValidationCheck['status']) => {
    if (status === 'pass') return <CheckCircle className="w-4 h-4 text-emerald-500 flex-shrink-0" />;
    if (status === 'warning') return <AlertTriangle className="w-4 h-4 text-amber-500 flex-shrink-0" />;
    return <XCircle className="w-4 h-4 text-red-500 flex-shrink-0" />;
  };

  return (
    <div className="flex h-screen bg-gray-50 overflow-hidden">
      {/* Sidebar */}
      <aside className="w-64 bg-[#0f2744] flex-shrink-0 flex flex-col">
        <div className="px-5 py-5 border-b border-white/10">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 bg-teal-500 rounded-lg flex items-center justify-center">
              <BookOpen className="w-5 h-5 text-white" />
            </div>
            <div>
              <p className="text-white text-sm font-semibold">MMS Editor Portal</p>
              <p className="text-blue-300 text-xs">Final Proof Review</p>
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
                onClick={() => {
                  if (item.id === 'dashboard') { onBack(); return; }
                  setActiveNav(item.id);
                }}
                className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-lg transition-all text-left ${
                  isActive
                    ? 'bg-teal-600 text-white font-medium'
                    : 'text-blue-200 hover:bg-white/10 hover:text-white'
                }`}
              >
                <Icon className="w-4 h-4 flex-shrink-0" />
                <span className="text-sm">{item.label}</span>
              </button>
            );
          })}
        </nav>

        <div className="px-5 py-4 border-t border-white/10">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-full bg-gradient-to-br from-blue-400 to-blue-600 flex items-center justify-center text-white text-xs font-semibold">
              {manuscript.authorName.charAt(0)}
            </div>
            <div>
              <p className="text-white text-xs font-medium">Dr. Sarah Mitchell</p>
              <p className="text-blue-300 text-xs">Senior Editor</p>
            </div>
          </div>
        </div>
      </aside>

      {/* Main area */}
      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Header */}
        <header className="bg-white border-b border-gray-200 px-6 py-3 flex-shrink-0 z-10">
          <div className="flex items-center justify-between gap-4">
            <div className="flex items-center gap-3 min-w-0">
              <button onClick={onBack} className="p-1.5 hover:bg-gray-100 rounded-lg transition-colors flex-shrink-0">
                <ChevronLeft className="w-5 h-5 text-gray-600" />
              </button>
              <div className="min-w-0">
                <div className="flex items-center gap-2 flex-wrap">
                  <span className="text-xs font-mono text-gray-500 bg-gray-100 px-2 py-0.5 rounded">{manuscript.id}</span>
                  <ChevronRight className="w-3 h-3 text-gray-400" />
                  <h1 className="text-sm font-semibold text-gray-900 truncate max-w-md">{manuscript.title}</h1>
                </div>
                <div className="flex items-center gap-2 mt-0.5">
                  <span className="text-xs text-gray-500">Workflow Stage 6 of 8</span>
                  <span className="text-xs text-gray-400">·</span>
                  <span className="text-xs text-gray-500">Proof generated {proofGeneratedDate.toLocaleDateString()}</span>
                </div>
              </div>
            </div>

            <div className="flex items-center gap-3 flex-shrink-0">
              {proofApproved ? (
                <span className="flex items-center gap-1.5 px-3 py-1.5 bg-emerald-100 text-emerald-800 rounded-full text-xs font-semibold">
                  <CheckCircle className="w-3.5 h-3.5" /> Proof Approved
                </span>
              ) : (
                <span className="flex items-center gap-1.5 px-3 py-1.5 bg-amber-100 text-amber-800 rounded-full text-xs font-semibold animate-pulse">
                  <Clock className="w-3.5 h-3.5" /> Awaiting Final Review
                </span>
              )}
              <div className="flex items-center gap-1.5 px-3 py-1.5 bg-red-50 text-red-700 rounded-full text-xs font-semibold border border-red-200">
                <Calendar className="w-3.5 h-3.5" />
                {daysLeft}d until publication deadline
              </div>
              <button className="relative p-2 hover:bg-gray-100 rounded-lg transition-colors">
                <Bell className="w-5 h-5 text-gray-600" />
                <span className="absolute top-1 right-1 w-4 h-4 bg-red-500 text-white text-xs rounded-full flex items-center justify-center font-medium">3</span>
              </button>
              <div className="w-8 h-8 rounded-full bg-gradient-to-br from-purple-500 to-purple-700 flex items-center justify-center text-white text-xs font-semibold">
                SM
              </div>
            </div>
          </div>
        </header>

        {/* Scrollable content */}
        <div className="flex-1 overflow-y-auto p-6">
          <div className="max-w-[1400px] mx-auto">
            <div className="grid grid-cols-12 gap-6">

              {/* Left — Main Workspace (8 cols) */}
              <div className="col-span-8 space-y-6">

                {/* Manuscript Info Card */}
                <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-5">
                  <div className="flex items-center gap-2 mb-4">
                    <FileText className="w-4 h-4 text-blue-600" />
                    <h2 className="text-sm font-semibold text-gray-900">Manuscript Information</h2>
                  </div>
                  <div className="grid grid-cols-4 gap-4">
                    <div className="col-span-2">
                      <p className="text-xs text-gray-500 mb-0.5">Title</p>
                      <p className="text-sm font-medium text-gray-900 leading-snug">{manuscript.title}</p>
                    </div>
                    <div>
                      <p className="text-xs text-gray-500 mb-0.5">Author(s)</p>
                      <p className="text-sm text-gray-800">{manuscript.authorName}</p>
                    </div>
                    <div>
                      <p className="text-xs text-gray-500 mb-0.5">Category</p>
                      <span className="px-2 py-0.5 bg-blue-100 text-blue-700 text-xs rounded-full font-medium">{manuscript.category}</span>
                    </div>
                    <div>
                      <p className="text-xs text-gray-500 mb-0.5">Publication Issue</p>
                      <p className="text-sm text-gray-800">Vol. 14, Issue 2, 2024</p>
                    </div>
                    <div>
                      <p className="text-xs text-gray-500 mb-0.5">Publication Date</p>
                      <p className="text-sm text-gray-800">{deadline.toLocaleDateString()}</p>
                    </div>
                    <div>
                      <p className="text-xs text-gray-500 mb-0.5">Proof Generated</p>
                      <p className="text-sm text-gray-800">{proofGeneratedDate.toLocaleDateString()}</p>
                    </div>
                    <div>
                      <p className="text-xs text-gray-500 mb-0.5">Assigned TWG</p>
                      <p className="text-sm text-gray-800">Layout Team · QA Team</p>
                    </div>
                    <div>
                      <p className="text-xs text-gray-500 mb-0.5">Workflow Stage</p>
                      <span className="px-2 py-0.5 bg-teal-100 text-teal-700 text-xs rounded-full font-medium">Final Proof Review</span>
                    </div>
                  </div>
                </div>

                {/* PDF Proof Viewer */}
                <div className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden">
                  {/* Viewer Header */}
                  <div className="flex items-center justify-between px-5 py-3 border-b border-gray-100 bg-gray-50">
                    <div className="flex items-center gap-1">
                      {(
                        [
                          { id: 'full', label: 'Full View', icon: Eye },
                          { id: 'thumbnails', label: 'Page Thumbnails', icon: Layers },
                          { id: 'annotations', label: 'Annotations', icon: Edit },
                          { id: 'typography', label: 'Typography', icon: AlignLeft },
                        ] as Array<{ id: ActiveProofTab; label: string; icon: React.ComponentType<{ className?: string }> }>
                      ).map(tab => {
                        const Icon = tab.icon;
                        return (
                          <button
                            key={tab.id}
                            onClick={() => setActiveTab(tab.id)}
                            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium transition-colors ${
                              activeTab === tab.id
                                ? 'bg-blue-600 text-white'
                                : 'text-gray-600 hover:bg-gray-100'
                            }`}
                          >
                            <Icon className="w-3.5 h-3.5" />
                            {tab.label}
                          </button>
                        );
                      })}
                    </div>
                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => setZoomLevel(z => Math.max(60, z - 10))}
                        className="p-1.5 hover:bg-gray-100 rounded text-gray-600"
                      >
                        <ZoomOut className="w-4 h-4" />
                      </button>
                      <span className="text-xs text-gray-600 w-12 text-center font-medium">{zoomLevel}%</span>
                      <button
                        onClick={() => setZoomLevel(z => Math.min(150, z + 10))}
                        className="p-1.5 hover:bg-gray-100 rounded text-gray-600"
                      >
                        <ZoomIn className="w-4 h-4" />
                      </button>
                      <div className="w-px h-4 bg-gray-200" />
                      <button className="p-1.5 hover:bg-gray-100 rounded text-gray-600">
                        <Download className="w-4 h-4" />
                      </button>
                      <button className="p-1.5 hover:bg-gray-100 rounded text-gray-600">
                        <Printer className="w-4 h-4" />
                      </button>
                    </div>
                  </div>

                  {/* Viewer Body */}
                  <div className="flex" style={{ height: '520px' }}>
                    {/* Thumbnail strip */}
                    <div className="w-20 border-r border-gray-100 bg-gray-50 overflow-y-auto flex-shrink-0 p-2 space-y-2">
                      {Array.from({ length: 8 }, (_, i) => i + 1).map(page => (
                        <button
                          key={page}
                          onClick={() => setCurrentPage(page)}
                          className={`w-full rounded border-2 transition-all overflow-hidden ${
                            currentPage === page ? 'border-blue-500' : 'border-transparent hover:border-gray-300'
                          }`}
                        >
                          <div className="bg-white p-1" style={{ aspectRatio: '3/4' }}>
                            <div className="h-1 bg-gray-300 rounded mb-0.5 w-full" />
                            <div className="h-0.5 bg-gray-200 rounded mb-1 w-4/5" />
                            <div className="space-y-0.5">
                              {Array.from({ length: 6 }).map((_, j) => (
                                <div key={j} className="h-0.5 bg-gray-200 rounded" style={{ width: `${70 + (j % 3) * 10}%` }} />
                              ))}
                            </div>
                          </div>
                          <div className="text-center py-0.5 bg-gray-50">
                            <span className="text-xs text-gray-500">{page}</span>
                          </div>
                        </button>
                      ))}
                    </div>

                    {/* Main page view */}
                    <div className="flex-1 overflow-auto bg-gray-200 p-4 flex items-start justify-center">
                      <div
                        className="bg-white shadow-lg transition-all duration-200"
                        style={{ width: `${Math.min(zoomLevel * 4.8, 100)}%`, minWidth: '380px' }}
                      >
                        {/* Page header */}
                        <div className="px-8 py-2 border-b border-gray-300 flex items-center justify-between">
                          <span className="text-xs font-semibold text-gray-500 uppercase tracking-wider">Academic Journal of Research</span>
                          <span className="text-xs text-gray-500">Vol. 14 · No. 2 · 2024</span>
                        </div>
                        {/* Article head */}
                        <div className="px-8 pt-5 pb-3">
                          <h1 className="text-base font-bold text-gray-900 leading-snug mb-2">{manuscript.title}</h1>
                          <p className="text-xs font-semibold text-blue-700 mb-0.5">{manuscript.authorName}</p>
                          <p className="text-xs text-gray-500 mb-3">Received 15 Mar 2024 · Accepted 10 May 2024</p>
                          <div className="border-t border-b border-gray-200 py-2 mb-3">
                            <p className="text-xs font-bold text-gray-700 mb-1">Abstract</p>
                            <p className="text-xs text-gray-600 leading-relaxed">{manuscript.abstract.substring(0, 220)}…</p>
                          </div>
                        </div>
                        {/* Two-column body */}
                        <div className="px-8 pb-5 grid grid-cols-2 gap-5">
                          <div className="space-y-1.5">
                            {Array.from({ length: 10 }, (_, i) => (
                              <div key={i} className="h-1.5 bg-gray-200 rounded" style={{ width: `${[100,92,100,88,100,95,100,91,100,86][i]}%` }} />
                            ))}
                            <div className="mt-3 border-2 border-dashed border-gray-300 rounded p-2 bg-gray-50">
                              <div className="w-full h-14 bg-gradient-to-br from-blue-50 to-indigo-100 rounded mb-1 flex items-center justify-center">
                                <span className="text-xs text-gray-400">Figure 3</span>
                              </div>
                              <p className="text-xs text-center text-gray-500 italic">Fig. 3: Research framework</p>
                            </div>
                          </div>
                          <div className="space-y-1.5">
                            {Array.from({ length: 10 }, (_, i) => (
                              <div key={i} className="h-1.5 bg-gray-200 rounded" style={{ width: `${[96,100,90,100,93,100,88,100,97,100][i]}%` }} />
                            ))}
                            <div className="mt-3 border border-gray-300 rounded overflow-hidden">
                              <div className="bg-gray-100 px-2 py-1 border-b border-gray-300 flex items-center justify-between">
                                <p className="text-xs font-semibold text-gray-600">Table 3: Statistical Summary</p>
                                <AlertTriangle className="w-3 h-3 text-amber-500" />
                              </div>
                              <div className="p-2 space-y-1">
                                {[1, 2, 3].map(r => (
                                  <div key={r} className="flex gap-1.5">
                                    <div className="h-1.5 bg-gray-200 rounded flex-1" />
                                    <div className="h-1.5 bg-gray-200 rounded w-10" />
                                    <div className="h-1.5 bg-gray-200 rounded w-10" />
                                  </div>
                                ))}
                              </div>
                            </div>
                          </div>
                        </div>
                        {/* Page footer */}
                        <div className="px-8 py-2 border-t border-gray-200 flex items-center justify-between">
                          <span className="text-xs text-gray-400">{manuscript.id}</span>
                          <span className="text-xs text-gray-700 font-semibold">{currentPage}</span>
                          <span className="text-xs text-gray-400">© 2024 Academic Press</span>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Page navigation bar */}
                  <div className="flex items-center justify-between px-5 py-2.5 border-t border-gray-100 bg-gray-50">
                    <button
                      onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
                      disabled={currentPage === 1}
                      className="flex items-center gap-1 px-3 py-1.5 text-xs text-gray-600 hover:bg-gray-100 rounded-lg disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
                    >
                      <ChevronLeft className="w-3.5 h-3.5" /> Previous
                    </button>
                    <span className="text-xs text-gray-600 font-medium">Page {currentPage} of {totalPages}</span>
                    <button
                      onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))}
                      disabled={currentPage === totalPages}
                      className="flex items-center gap-1 px-3 py-1.5 text-xs text-gray-600 hover:bg-gray-100 rounded-lg disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
                    >
                      Next <ChevronRight className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>

                {/* Automated Validation Panel */}
                <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-5">
                  <div className="flex items-center justify-between mb-4">
                    <div className="flex items-center gap-2">
                      <Shield className="w-4 h-4 text-blue-600" />
                      <h2 className="text-sm font-semibold text-gray-900">Automated Validation Results</h2>
                    </div>
                    <button
                      onClick={() => setValidationExpanded(v => !v)}
                      className="text-xs text-gray-500 hover:text-gray-700 flex items-center gap-1"
                    >
                      {validationExpanded ? 'Collapse' : 'Expand'}
                      <ChevronDown className={`w-3.5 h-3.5 transition-transform ${validationExpanded ? 'rotate-180' : ''}`} />
                    </button>
                  </div>

                  {/* Score row */}
                  <div className="grid grid-cols-4 gap-4 mb-4">
                    <div className="col-span-1 bg-gray-50 rounded-lg p-3 text-center border border-gray-100">
                      <p className="text-2xl font-bold text-gray-900">{readinessScore}%</p>
                      <p className="text-xs text-gray-500">Readiness Score</p>
                    </div>
                    <div className="bg-emerald-50 rounded-lg p-3 text-center border border-emerald-100">
                      <p className="text-2xl font-bold text-emerald-600">{passCount}</p>
                      <p className="text-xs text-emerald-700">Passed</p>
                    </div>
                    <div className="bg-amber-50 rounded-lg p-3 text-center border border-amber-100">
                      <p className="text-2xl font-bold text-amber-600">{warnCount}</p>
                      <p className="text-xs text-amber-700">Warnings</p>
                    </div>
                    <div className="bg-red-50 rounded-lg p-3 text-center border border-red-100">
                      <p className="text-2xl font-bold text-red-600">{failCount}</p>
                      <p className="text-xs text-red-700">Failed</p>
                    </div>
                  </div>

                  {validationExpanded && (
                    <div className="space-y-2">
                      {validationChecks.map(check => (
                        <div
                          key={check.id}
                          className={`flex items-start gap-3 p-3 rounded-lg border ${
                            check.status === 'pass' ? 'bg-emerald-50 border-emerald-100' :
                            check.status === 'warning' ? 'bg-amber-50 border-amber-100' :
                            'bg-red-50 border-red-100'
                          }`}
                        >
                          {validationStatusIcon(check.status)}
                          <div className="flex-1 min-w-0">
                            <p className="text-xs font-semibold text-gray-800">{check.label}</p>
                            <p className="text-xs text-gray-600 mt-0.5">{check.detail}</p>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>

                {/* Editor Notes */}
                <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-5">
                  <div className="flex items-center gap-2 mb-4">
                    <MessageSquare className="w-4 h-4 text-blue-600" />
                    <h2 className="text-sm font-semibold text-gray-900">Revision & Approval Notes</h2>
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs font-medium text-gray-700 mb-1.5">Editor Review Comments</label>
                      <textarea
                        value={editorNotes}
                        onChange={e => setEditorNotes(e.target.value)}
                        rows={4}
                        placeholder="Document your review observations, overall assessment, and any general comments for the record..."
                        className="w-full text-xs border border-gray-300 rounded-lg p-3 focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none text-gray-800 placeholder-gray-400"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-medium text-gray-700 mb-1.5">Specific Revision Requests <span className="text-red-500">*</span></label>
                      <textarea
                        value={revisionRequests}
                        onChange={e => setRevisionRequests(e.target.value)}
                        rows={4}
                        placeholder="List specific corrections required: page numbers, section references, figure/table issues, formatting errors..."
                        className="w-full text-xs border border-gray-300 rounded-lg p-3 focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none text-gray-800 placeholder-gray-400"
                      />
                    </div>
                  </div>
                </div>
              </div>

              {/* Right — Summary Panel (4 cols) */}
              <div className="col-span-4 space-y-5">

                {/* Workflow Stage Tracker */}
                <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-5">
                  <div className="flex items-center gap-2 mb-4">
                    <Activity className="w-4 h-4 text-blue-600" />
                    <h3 className="text-sm font-semibold text-gray-900">Workflow Progress</h3>
                  </div>
                  <div className="space-y-2">
                    {workflowStages.map((stage, i) => (
                      <div key={i} className="flex items-center gap-3">
                        <div className={`w-6 h-6 rounded-full flex items-center justify-center flex-shrink-0 text-xs font-bold ${
                          stage.done ? 'bg-emerald-500 text-white' :
                          (stage as any).current ? 'bg-blue-600 text-white ring-4 ring-blue-100' :
                          'bg-gray-100 text-gray-400 border-2 border-gray-200'
                        }`}>
                          {stage.done ? '✓' : i + 1}
                        </div>
                        <span className={`text-xs ${
                          stage.done ? 'text-gray-500 line-through' :
                          (stage as any).current ? 'text-blue-700 font-semibold' :
                          'text-gray-400'
                        }`}>{stage.label}</span>
                      </div>
                    ))}
                  </div>
                </div>

                {/* TWG Notes */}
                <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-5">
                  <div className="flex items-center gap-2 mb-3">
                    <Users className="w-4 h-4 text-teal-600" />
                    <h3 className="text-sm font-semibold text-gray-900">TWG Production Notes</h3>
                  </div>
                  <div className="space-y-3">
                    <div className="p-3 bg-teal-50 rounded-lg border border-teal-100">
                      <p className="text-xs font-semibold text-teal-800 mb-1">Layout Coordinator</p>
                      <p className="text-xs text-teal-700">Figure 5 replacement submitted and awaiting integration into proof v1.2. All other layout items confirmed.</p>
                    </div>
                    <div className="p-3 bg-blue-50 rounded-lg border border-blue-100">
                      <p className="text-xs font-semibold text-blue-800 mb-1">QA Validation Team</p>
                      <p className="text-xs text-blue-700">Table 3 header bold issue is a minor typographic correction. Can be resolved within 24 hours of instruction.</p>
                    </div>
                    <div className="p-3 bg-gray-50 rounded-lg border border-gray-100">
                      <p className="text-xs font-semibold text-gray-700 mb-1">TWG Coordinator</p>
                      <p className="text-xs text-gray-600">Proof package v1.2 ready for editor final review. Awaiting decision to proceed.</p>
                    </div>
                  </div>
                </div>

                {/* Proof Version History */}
                <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-5">
                  <div className="flex items-center gap-2 mb-3">
                    <RefreshCw className="w-4 h-4 text-gray-600" />
                    <h3 className="text-sm font-semibold text-gray-900">Proof Version History</h3>
                  </div>
                  <div className="space-y-3">
                    {proofHistory.map((entry, i) => (
                      <div key={i} className="flex items-start gap-3">
                        <div className={`w-6 h-6 rounded-full flex items-center justify-center flex-shrink-0 text-xs font-bold ${
                          i === proofHistory.length - 1 ? 'bg-blue-600 text-white' : 'bg-gray-100 text-gray-500'
                        }`}>
                          {i === proofHistory.length - 1 ? '★' : i + 1}
                        </div>
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center gap-2">
                            <span className="text-xs font-semibold text-gray-800">{entry.version}</span>
                            <span className="text-xs text-gray-400">{entry.date}</span>
                          </div>
                          <p className="text-xs text-gray-600 mt-0.5">{entry.note}</p>
                          <p className="text-xs text-gray-400">{entry.by}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Publication Timeline */}
                <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-5">
                  <div className="flex items-center justify-between mb-3">
                    <div className="flex items-center gap-2">
                      <TrendingUp className="w-4 h-4 text-indigo-600" />
                      <h3 className="text-sm font-semibold text-gray-900">Publication Timeline</h3>
                    </div>
                    <span className="text-xs text-indigo-600 font-medium">{daysLeft}d remaining</span>
                  </div>

                  {/* Mini Gantt */}
                  <div className="space-y-2 mb-4">
                    {ganttItems.map((item, i) => (
                      <div key={i}>
                        <div className="flex items-center justify-between mb-0.5">
                          <span className="text-xs text-gray-600">{item.label}</span>
                          {item.status === 'active' && (
                            <span className="text-xs text-blue-600 font-medium">In Progress</span>
                          )}
                        </div>
                        <div className="relative h-4 bg-gray-100 rounded-full overflow-hidden">
                          <div
                            className={`absolute h-full rounded-full transition-all ${
                              item.status === 'done' ? 'bg-emerald-400' :
                              item.status === 'active' ? 'bg-blue-500 animate-pulse' :
                              'bg-gray-200'
                            }`}
                            style={{ left: `${item.start}%`, width: `${item.width}%` }}
                          />
                        </div>
                      </div>
                    ))}
                  </div>

                  <div className="space-y-2">
                    <div className="flex items-center justify-between text-xs">
                      <span className="text-gray-600">Publication Forecast</span>
                      <span className="font-semibold text-gray-900">{deadline.toLocaleDateString()}</span>
                    </div>
                    <div className="flex items-center justify-between text-xs">
                      <span className="text-gray-600">Workflow Progress</span>
                      <span className="font-semibold text-blue-600">62%</span>
                    </div>
                    <div className="w-full bg-gray-100 rounded-full h-2">
                      <div className="bg-blue-500 h-2 rounded-full" style={{ width: '62%' }} />
                    </div>
                  </div>

                  {failCount > 0 && (
                    <div className="mt-3 p-2.5 bg-red-50 rounded-lg border border-red-200 flex items-start gap-2">
                      <AlertCircle className="w-3.5 h-3.5 text-red-600 flex-shrink-0 mt-0.5" />
                      <p className="text-xs text-red-700">
                        <span className="font-semibold">{failCount} critical issue{failCount > 1 ? 's' : ''}</span> must be resolved before approval
                      </p>
                    </div>
                  )}
                </div>

                {/* Analytics Summary */}
                <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-5">
                  <div className="flex items-center gap-2 mb-3">
                    <BarChart3 className="w-4 h-4 text-gray-600" />
                    <h3 className="text-sm font-semibold text-gray-900">Review Analytics</h3>
                  </div>
                  <div className="grid grid-cols-2 gap-3">
                    {[
                      { label: 'Print Quality', value: '87%', color: 'text-blue-600' },
                      { label: 'Layout Score', value: '91%', color: 'text-emerald-600' },
                      { label: 'Pub Readiness', value: `${readinessScore}%`, color: readinessScore >= 80 ? 'text-emerald-600' : 'text-amber-600' },
                      { label: 'Days in Review', value: '2', color: 'text-gray-700' },
                    ].map((stat, i) => (
                      <div key={i} className="p-3 bg-gray-50 rounded-lg text-center border border-gray-100">
                        <p className={`text-lg font-bold ${stat.color}`}>{stat.value}</p>
                        <p className="text-xs text-gray-500">{stat.label}</p>
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
                <Download className="w-4 h-4" /> Export Annotated Proof
              </button>
            </div>
            <div className="flex items-center gap-3">
              <button
                onClick={() => setShowModal('return_twg')}
                className="flex items-center gap-1.5 px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors text-sm"
              >
                Return to TWG
              </button>
              <button
                onClick={() => setShowModal('approve')}
                className="flex items-center gap-1.5 px-4 py-2 bg-emerald-600 text-white rounded-lg hover:bg-emerald-700 transition-colors text-sm font-medium"
              >
                <CheckCircle className="w-4 h-4" /> Approve Final Proof
              </button>
              <button
                onClick={() => setShowModal('request_revisions')}
                className="flex items-center gap-1.5 px-4 py-2 bg-amber-600 text-white rounded-lg hover:bg-amber-700 transition-colors text-sm font-medium"
              >
                <RefreshCw className="w-4 h-4" /> Request Final Revisions
              </button>
              <button
                onClick={() => setShowModal('send_approval')}
                className="flex items-center gap-1.5 px-4 py-2 bg-blue-700 text-white rounded-lg hover:bg-blue-800 transition-colors text-sm font-medium"
              >
                <Send className="w-4 h-4" /> Send for Final Approval &amp; Signatures
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
              showModal === 'approve' ? 'bg-emerald-100' :
              showModal === 'request_revisions' ? 'bg-amber-100' :
              showModal === 'return_twg' ? 'bg-gray-100' :
              'bg-blue-100'
            }`}>
              {showModal === 'approve' && <CheckCircle className="w-6 h-6 text-emerald-600" />}
              {showModal === 'request_revisions' && <RefreshCw className="w-6 h-6 text-amber-600" />}
              {showModal === 'return_twg' && <ChevronLeft className="w-6 h-6 text-gray-600" />}
              {showModal === 'send_approval' && <Send className="w-6 h-6 text-blue-600" />}
            </div>
            <h3 className="text-lg font-bold text-gray-900 text-center mb-2">
              {showModal === 'approve' && 'Approve Final Proof'}
              {showModal === 'request_revisions' && 'Request Final Revisions'}
              {showModal === 'return_twg' && 'Return to TWG'}
              {showModal === 'send_approval' && 'Send for Final Approval & Signatures'}
            </h3>
            <p className="text-sm text-gray-600 text-center mb-2">
              {showModal === 'approve' && 'Mark this proof as approved. The manuscript will be ready for final approval and signatures.'}
              {showModal === 'request_revisions' && 'Send the proof back for revisions. You will enter the revision management workflow to track and resolve issues.'}
              {showModal === 'return_twg' && 'Return this proof to the TWG Layout team for corrections. This will reset the proof review stage.'}
              {showModal === 'send_approval' && 'Forward this proof to the Final Approval & Signatures stage. Authors and editors will be notified to sign off.'}
            </p>
            {showModal === 'request_revisions' && failCount > 0 && (
              <div className="mb-3 p-3 bg-red-50 rounded-lg border border-red-200 text-xs text-red-700">
                <strong>{failCount} critical validation failure(s)</strong> detected. Revisions are required before this proof can be approved.
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
                  showModal === 'approve' ? 'bg-emerald-600 hover:bg-emerald-700' :
                  showModal === 'request_revisions' ? 'bg-amber-600 hover:bg-amber-700' :
                  showModal === 'return_twg' ? 'bg-gray-600 hover:bg-gray-700' :
                  'bg-blue-700 hover:bg-blue-800'
                }`}
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
