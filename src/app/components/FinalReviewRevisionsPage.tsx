import React, { useState } from 'react';
import type { Manuscript } from '../types';
import {
  ChevronLeft, ChevronRight,
  Bell, FileText, CheckCircle, XCircle, AlertTriangle, AlertCircle,
  Clock, Users, Activity, BarChart3, Settings, RefreshCw,
  Download, Send, MessageSquare, BookOpen, Eye, Calendar,
  Award, Home, TrendingUp, ChevronDown, ArrowRight,
  AlignLeft, Edit, Printer, Shield,
} from 'lucide-react';

interface FinalReviewRevisionsPageProps {
  manuscript: Manuscript;
  onReturnToProofReview: () => void;
  onProceedToFinalApproval: () => void;
}

type ActiveNav = 'dashboard' | 'manuscripts' | 'reviewers' | 'revisions' | 'production' | 'proof_review' | 'approval' | 'notifications' | 'reports' | 'settings';
type ComparisonTab = 'side_by_side' | 'overlay' | 'annotations';
type ModalAction = 'approve_revised' | 'proceed_approval' | 'return_proof' | null;

interface RevisionItem {
  id: string;
  section: string;
  type: 'typography' | 'formatting' | 'image' | 'layout' | 'content';
  priority: 'critical' | 'high' | 'medium';
  description: string;
  status: 'pending' | 'resolved' | 'in_progress';
  assignedTo: string;
  pageRef: string;
}

const revisionItems: RevisionItem[] = [
  { id: 'r1', section: 'Figure 5', type: 'image', priority: 'critical', description: 'Replace Figure 5 with 300 DPI version — current file is 72 DPI and print-unacceptable', status: 'in_progress', assignedTo: 'TWG Layout Team', pageRef: 'p. 11' },
  { id: 'r2', section: 'Table 3', type: 'typography', priority: 'high', description: 'Apply bold formatting to the entire header row; currently only first column is bold', status: 'pending', assignedTo: 'TWG Layout Team', pageRef: 'p. 14' },
  { id: 'r3', section: 'Chapter 2 Margin', type: 'formatting', priority: 'medium', description: 'Left margin 0.3mm wider than template spec on p. 8 — realign to 25mm', status: 'pending', assignedTo: 'TWG Layout Team', pageRef: 'p. 8' },
  { id: 'r4', section: 'Section 4 Margin', type: 'formatting', priority: 'medium', description: 'Top margin deviation of 0.5mm on p. 17 — minor but must conform to template', status: 'pending', assignedTo: 'TWG Layout Team', pageRef: 'p. 17' },
];

const resolvedItems = [
  { description: 'Abstract line spacing corrected from 1.3 to 1.5', resolvedBy: 'TWG Layout', date: '2024-05-24' },
  { description: 'Running header alignment fixed across all chapters', resolvedBy: 'TWG Layout', date: '2024-05-24' },
  { description: 'Bibliography page numbering synchronized', resolvedBy: 'TWG Layout', date: '2024-05-25' },
];

const checklistItems = [
  { id: 'c1', label: 'Figure 5 high-resolution replacement', required: true },
  { id: 'c2', label: 'Table 3 bold header formatting', required: true },
  { id: 'c3', label: 'Margin correction on pp. 8 and 17', required: false },
  { id: 'c4', label: 'Final QA validation pass', required: true },
  { id: 'c5', label: 'Editor sign-off on all critical revisions', required: true },
  { id: 'c6', label: 'TWG confirmation of corrections applied', required: true },
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

export function FinalReviewRevisionsPage({ manuscript, onReturnToProofReview, onProceedToFinalApproval }: FinalReviewRevisionsPageProps) {
  const [activeNav, setActiveNav] = useState<ActiveNav>('revisions');
  const [comparisonTab, setComparisonTab] = useState<ComparisonTab>('side_by_side');
  const [showModal, setShowModal] = useState<ModalAction>(null);
  const [revisionNotes, setRevisionNotes] = useState('');
  const [twgInstructions, setTwgInstructions] = useState('');
  const [checkedItems, setCheckedItems] = useState<Record<string, boolean>>({});
  const [currentSpread, setCurrentSpread] = useState(11);

  const deadline = new Date(Date.now() + 11 * 24 * 60 * 60 * 1000);
  const daysLeft = 11;
  const delayDays = 3;
  const unresolvedCritical = revisionItems.filter(r => r.priority === 'critical' && r.status !== 'resolved').length;
  const unresolvedTotal = revisionItems.filter(r => r.status !== 'resolved').length;
  const checkedCount = Object.values(checkedItems).filter(Boolean).length;
  const requiredCount = checklistItems.filter(c => c.required).length;

  const toggleCheck = (id: string) => {
    setCheckedItems(prev => ({ ...prev, [id]: !prev[id] }));
  };

  const handleConfirm = () => {
    if (showModal === 'return_proof') {
      setShowModal(null);
      onReturnToProofReview();
    } else if (showModal === 'proceed_approval') {
      setShowModal(null);
      onProceedToFinalApproval();
    } else if (showModal === 'approve_revised') {
      setShowModal(null);
    }
  };

  const priorityBadge = (p: RevisionItem['priority']) => {
    const map = {
      critical: 'bg-red-100 text-red-700',
      high: 'bg-amber-100 text-amber-700',
      medium: 'bg-blue-100 text-blue-700',
    };
    return <span className={`px-2 py-0.5 rounded-full text-xs font-medium ${map[p]}`}>{p.charAt(0).toUpperCase() + p.slice(1)}</span>;
  };

  const statusBadge = (s: RevisionItem['status']) => {
    const map = {
      pending: 'bg-gray-100 text-gray-600',
      in_progress: 'bg-blue-100 text-blue-700',
      resolved: 'bg-emerald-100 text-emerald-700',
    };
    const labels = { pending: 'Pending', in_progress: 'In Progress', resolved: 'Resolved' };
    return <span className={`px-2 py-0.5 rounded-full text-xs font-medium ${map[s]}`}>{labels[s]}</span>;
  };

  const typeBadge = (t: RevisionItem['type']) => {
    const icons: Record<RevisionItem['type'], React.ComponentType<{ className?: string }>> = {
      typography: AlignLeft, formatting: Edit, image: Eye, layout: Activity, content: FileText,
    };
    const Icon = icons[t];
    return (
      <span className="flex items-center gap-1 px-2 py-0.5 bg-gray-100 text-gray-600 rounded-full text-xs">
        <Icon className="w-3 h-3" />{t}
      </span>
    );
  };

  return (
    <div className="flex h-screen bg-gray-50 overflow-hidden">
      {/* Sidebar */}
      <aside className="w-64 bg-[#0f2744] flex-shrink-0 flex flex-col">
        <div className="px-5 py-5 border-b border-white/10">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 bg-amber-500 rounded-lg flex items-center justify-center">
              <RefreshCw className="w-5 h-5 text-white" />
            </div>
            <div>
              <p className="text-white text-sm font-semibold">MMS Editor Portal</p>
              <p className="text-amber-300 text-xs">Revision Management</p>
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
                    ? 'bg-amber-600 text-white font-medium'
                    : 'text-blue-200 hover:bg-white/10 hover:text-white'
                }`}
              >
                <Icon className="w-4 h-4 flex-shrink-0" />
                <span className="text-sm">{item.label}</span>
              </button>
            );
          })}
        </nav>

        {/* Revision summary in sidebar */}
        <div className="px-4 py-4 border-t border-white/10 space-y-2">
          <p className="text-xs text-blue-300 font-medium uppercase tracking-wider mb-2">Revision Status</p>
          <div className="flex items-center justify-between">
            <span className="text-xs text-blue-200">Unresolved</span>
            <span className="text-xs font-bold text-red-400">{unresolvedTotal}</span>
          </div>
          <div className="flex items-center justify-between">
            <span className="text-xs text-blue-200">Critical Issues</span>
            <span className="text-xs font-bold text-amber-400">{unresolvedCritical}</span>
          </div>
          <div className="flex items-center justify-between">
            <span className="text-xs text-blue-200">Days Remaining</span>
            <span className="text-xs font-bold text-white">{daysLeft}</span>
          </div>
        </div>
      </aside>

      {/* Main area */}
      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Header */}
        <header className="bg-white border-b border-gray-200 px-6 py-3 flex-shrink-0">
          <div className="flex items-center justify-between gap-4">
            <div className="flex items-center gap-3 min-w-0">
              <button onClick={onReturnToProofReview} className="p-1.5 hover:bg-gray-100 rounded-lg transition-colors flex-shrink-0">
                <ChevronLeft className="w-5 h-5 text-gray-600" />
              </button>
              <div className="min-w-0">
                <div className="flex items-center gap-2">
                  <span className="text-xs font-mono text-gray-500 bg-gray-100 px-2 py-0.5 rounded">{manuscript.id}</span>
                  <ChevronRight className="w-3 h-3 text-gray-400" />
                  <h1 className="text-sm font-semibold text-gray-900 truncate max-w-md">{manuscript.title}</h1>
                </div>
                <p className="text-xs text-gray-500 mt-0.5">Final Review Revisions &amp; Layout Corrections</p>
              </div>
            </div>

            <div className="flex items-center gap-3 flex-shrink-0">
              <span className="flex items-center gap-1.5 px-3 py-1.5 bg-amber-100 text-amber-800 rounded-full text-xs font-semibold">
                <RefreshCw className="w-3.5 h-3.5" /> Revision Mode — {unresolvedTotal} Issue{unresolvedTotal !== 1 ? 's' : ''} Open
              </span>
              <div className="flex items-center gap-1.5 px-3 py-1.5 bg-orange-50 text-orange-700 rounded-full text-xs font-medium border border-orange-200">
                <AlertTriangle className="w-3.5 h-3.5" />+{delayDays}d delay impact
              </div>
              <button className="relative p-2 hover:bg-gray-100 rounded-lg transition-colors">
                <Bell className="w-5 h-5 text-gray-600" />
                <span className="absolute top-1 right-1 w-4 h-4 bg-red-500 text-white text-xs rounded-full flex items-center justify-center font-medium">5</span>
              </button>
            </div>
          </div>
        </header>

        {/* Content */}
        <div className="flex-1 overflow-y-auto p-6">
          <div className="max-w-[1400px] mx-auto space-y-6">

            {/* Row 1: Dynamic Timeline Alert */}
            <div className="grid grid-cols-4 gap-4">
              {[
                { label: 'Revised Deadline', value: deadline.toLocaleDateString(), color: 'text-orange-600', bg: 'bg-orange-50 border-orange-200' },
                { label: 'Delay Impact', value: `+${delayDays} days`, color: 'text-red-600', bg: 'bg-red-50 border-red-200' },
                { label: 'Production Days Left', value: `${daysLeft - delayDays}d`, color: 'text-amber-600', bg: 'bg-amber-50 border-amber-200' },
                { label: 'Revisions Required', value: `${unresolvedTotal} of ${revisionItems.length}`, color: 'text-blue-600', bg: 'bg-blue-50 border-blue-200' },
              ].map((stat, i) => (
                <div key={i} className={`rounded-xl p-4 border ${stat.bg}`}>
                  <p className="text-xs text-gray-600 mb-1">{stat.label}</p>
                  <p className={`text-xl font-bold ${stat.color}`}>{stat.value}</p>
                </div>
              ))}
            </div>

            {/* Row 2: Main Grid */}
            <div className="grid grid-cols-12 gap-6">

              {/* Center-left: Comparison Viewer (8 cols) */}
              <div className="col-span-8 space-y-5">

                {/* Comparison viewer */}
                <div className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden">
                  <div className="flex items-center justify-between px-5 py-3 border-b border-gray-100 bg-gray-50">
                    <div className="flex items-center gap-1">
                      {(
                        [
                          { id: 'side_by_side', label: 'Side-by-Side' },
                          { id: 'overlay', label: 'Overlay Changes' },
                          { id: 'annotations', label: 'Annotation View' },
                        ] as Array<{ id: ComparisonTab; label: string }>
                      ).map(tab => (
                        <button
                          key={tab.id}
                          onClick={() => setComparisonTab(tab.id)}
                          className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-colors ${
                            comparisonTab === tab.id ? 'bg-amber-600 text-white' : 'text-gray-600 hover:bg-gray-100'
                          }`}
                        >
                          {tab.label}
                        </button>
                      ))}
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="text-xs text-gray-500">Spread {currentSpread} of 24</span>
                      <button onClick={() => setCurrentSpread(p => Math.max(1, p - 1))} className="p-1 hover:bg-gray-100 rounded">
                        <ChevronLeft className="w-4 h-4 text-gray-600" />
                      </button>
                      <button onClick={() => setCurrentSpread(p => Math.min(24, p + 1))} className="p-1 hover:bg-gray-100 rounded">
                        <ChevronRight className="w-4 h-4 text-gray-600" />
                      </button>
                    </div>
                  </div>

                  {comparisonTab === 'side_by_side' ? (
                    <div className="grid grid-cols-2 gap-0 bg-gray-200" style={{ height: '420px' }}>
                      {/* Original */}
                      <div className="p-3 bg-gray-100 flex flex-col">
                        <div className="text-center mb-2">
                          <span className="text-xs font-semibold text-gray-500 bg-gray-200 px-3 py-1 rounded-full uppercase tracking-wide">Original Proof v1.2</span>
                        </div>
                        <div className="flex-1 bg-white rounded shadow-sm overflow-hidden relative">
                          <div className="px-4 py-3">
                            <div className="h-2 bg-gray-200 rounded w-full mb-1" />
                            <div className="h-2 bg-gray-200 rounded w-4/5 mb-3" />
                            <div className="grid grid-cols-2 gap-3">
                              <div className="space-y-1">
                                {Array.from({ length: 7 }).map((_, i) => (
                                  <div key={i} className="h-1.5 bg-gray-200 rounded" style={{ width: `${[100,90,100,85,100,93,88][i]}%` }} />
                                ))}
                                {/* Issue: low-res figure */}
                                <div className="mt-2 border-2 border-red-300 bg-red-50 rounded p-2 relative">
                                  <div className="w-full h-14 bg-gray-200 rounded flex items-center justify-center">
                                    <span className="text-xs text-gray-400">Fig. 5 (72 DPI)</span>
                                  </div>
                                  <div className="absolute -top-2 -right-2 w-5 h-5 bg-red-500 rounded-full flex items-center justify-center">
                                    <XCircle className="w-3 h-3 text-white" />
                                  </div>
                                </div>
                              </div>
                              <div className="space-y-1">
                                {Array.from({ length: 5 }).map((_, i) => (
                                  <div key={i} className="h-1.5 bg-gray-200 rounded" style={{ width: `${[100,95,88,100,92][i]}%` }} />
                                ))}
                                {/* Issue: Table 3 */}
                                <div className="mt-2 border border-amber-300 bg-amber-50 rounded overflow-hidden relative">
                                  <div className="bg-gray-200 px-2 py-1">
                                    <span className="text-xs text-gray-600">Table 3 header (not bold)</span>
                                  </div>
                                  <div className="p-1 space-y-0.5">
                                    {[1, 2, 3].map(r => <div key={r} className="flex gap-1"><div className="h-1.5 bg-gray-200 rounded flex-1" /><div className="h-1.5 bg-gray-200 rounded w-8" /></div>)}
                                  </div>
                                  <div className="absolute -top-2 -right-2 w-5 h-5 bg-amber-500 rounded-full flex items-center justify-center">
                                    <AlertTriangle className="w-3 h-3 text-white" />
                                  </div>
                                </div>
                              </div>
                            </div>
                          </div>
                          <div className="absolute bottom-2 left-0 right-0 flex justify-center">
                            <span className="text-xs text-gray-400 bg-white px-2 py-0.5 border border-gray-200 rounded">{currentSpread}</span>
                          </div>
                        </div>
                      </div>

                      {/* Revised */}
                      <div className="p-3 bg-emerald-50 flex flex-col">
                        <div className="text-center mb-2">
                          <span className="text-xs font-semibold text-emerald-700 bg-emerald-100 px-3 py-1 rounded-full uppercase tracking-wide">Revised Proof v1.3 (Proposed)</span>
                        </div>
                        <div className="flex-1 bg-white rounded shadow-sm overflow-hidden relative">
                          <div className="px-4 py-3">
                            <div className="h-2 bg-gray-200 rounded w-full mb-1" />
                            <div className="h-2 bg-gray-200 rounded w-4/5 mb-3" />
                            <div className="grid grid-cols-2 gap-3">
                              <div className="space-y-1">
                                {Array.from({ length: 7 }).map((_, i) => (
                                  <div key={i} className="h-1.5 bg-gray-200 rounded" style={{ width: `${[100,90,100,85,100,93,88][i]}%` }} />
                                ))}
                                {/* Fixed: high-res figure */}
                                <div className="mt-2 border-2 border-emerald-300 bg-emerald-50 rounded p-2 relative">
                                  <div className="w-full h-14 bg-gradient-to-br from-blue-100 to-indigo-100 rounded flex items-center justify-center">
                                    <span className="text-xs text-gray-500">Fig. 5 (300 DPI) ✓</span>
                                  </div>
                                  <div className="absolute -top-2 -right-2 w-5 h-5 bg-emerald-500 rounded-full flex items-center justify-center">
                                    <CheckCircle className="w-3 h-3 text-white" />
                                  </div>
                                </div>
                              </div>
                              <div className="space-y-1">
                                {Array.from({ length: 5 }).map((_, i) => (
                                  <div key={i} className="h-1.5 bg-gray-200 rounded" style={{ width: `${[100,95,88,100,92][i]}%` }} />
                                ))}
                                {/* Fixed: Table 3 */}
                                <div className="mt-2 border border-emerald-300 bg-emerald-50 rounded overflow-hidden relative">
                                  <div className="bg-gray-700 px-2 py-1">
                                    <span className="text-xs text-white font-bold">Table 3 header (bold ✓)</span>
                                  </div>
                                  <div className="p-1 space-y-0.5">
                                    {[1, 2, 3].map(r => <div key={r} className="flex gap-1"><div className="h-1.5 bg-gray-200 rounded flex-1" /><div className="h-1.5 bg-gray-200 rounded w-8" /></div>)}
                                  </div>
                                  <div className="absolute -top-2 -right-2 w-5 h-5 bg-emerald-500 rounded-full flex items-center justify-center">
                                    <CheckCircle className="w-3 h-3 text-white" />
                                  </div>
                                </div>
                              </div>
                            </div>
                          </div>
                          <div className="absolute bottom-2 left-0 right-0 flex justify-center">
                            <span className="text-xs text-emerald-600 bg-white px-2 py-0.5 border border-emerald-200 rounded">{currentSpread} (revised)</span>
                          </div>
                        </div>
                      </div>
                    </div>
                  ) : comparisonTab === 'overlay' ? (
                    <div className="p-6 bg-gray-100" style={{ height: '420px' }}>
                      <div className="bg-white rounded-lg shadow h-full relative overflow-hidden flex items-center justify-center">
                        <div className="text-center">
                          <div className="w-12 h-12 bg-amber-100 rounded-full flex items-center justify-center mx-auto mb-3">
                            <Eye className="w-6 h-6 text-amber-600" />
                          </div>
                          <p className="text-sm font-semibold text-gray-700">Overlay Change Detection</p>
                          <p className="text-xs text-gray-500 mt-1">4 changed regions detected on this spread</p>
                          <div className="mt-4 grid grid-cols-2 gap-2 text-xs">
                            <div className="bg-red-50 border border-red-200 rounded p-2 text-red-700">2 deletions</div>
                            <div className="bg-emerald-50 border border-emerald-200 rounded p-2 text-emerald-700">2 additions</div>
                          </div>
                        </div>
                      </div>
                    </div>
                  ) : (
                    <div className="p-4 bg-gray-100" style={{ height: '420px' }}>
                      <div className="bg-white rounded-lg shadow h-full overflow-y-auto p-4 space-y-3">
                        {revisionItems.map((item, i) => (
                          <div key={item.id} className={`p-3 rounded-lg border-l-4 ${
                            item.priority === 'critical' ? 'border-red-500 bg-red-50' :
                            item.priority === 'high' ? 'border-amber-500 bg-amber-50' :
                            'border-blue-500 bg-blue-50'
                          }`}>
                            <div className="flex items-start gap-2">
                              <div className={`w-5 h-5 rounded-full flex items-center justify-center flex-shrink-0 text-xs font-bold ${
                                item.priority === 'critical' ? 'bg-red-500 text-white' :
                                item.priority === 'high' ? 'bg-amber-500 text-white' :
                                'bg-blue-500 text-white'
                              }`}>{i + 1}</div>
                              <div>
                                <p className="text-xs font-semibold text-gray-800">{item.section} — {item.pageRef}</p>
                                <p className="text-xs text-gray-600 mt-0.5">{item.description}</p>
                              </div>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </div>

                {/* Layout Corrections */}
                <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-5">
                  <div className="flex items-center gap-2 mb-4">
                    <Edit className="w-4 h-4 text-amber-600" />
                    <h2 className="text-sm font-semibold text-gray-900">Layout Correction Tracking</h2>
                    <span className="ml-auto text-xs text-gray-500">{unresolvedTotal} unresolved · {resolvedItems.length} resolved</span>
                  </div>

                  {/* Active revisions */}
                  <div className="space-y-3 mb-5">
                    {revisionItems.map(item => (
                      <div key={item.id} className={`p-4 rounded-lg border ${
                        item.status === 'resolved' ? 'bg-gray-50 border-gray-200 opacity-60' :
                        item.priority === 'critical' ? 'bg-red-50 border-red-200' :
                        item.priority === 'high' ? 'bg-amber-50 border-amber-200' :
                        'bg-blue-50 border-blue-200'
                      }`}>
                        <div className="flex items-start justify-between gap-3">
                          <div className="flex-1 min-w-0">
                            <div className="flex items-center gap-2 flex-wrap mb-1">
                              <span className="text-xs font-bold text-gray-800">{item.section}</span>
                              <span className="text-xs text-gray-500">{item.pageRef}</span>
                              {priorityBadge(item.priority)}
                              {typeBadge(item.type)}
                            </div>
                            <p className="text-xs text-gray-700 mb-2">{item.description}</p>
                            <p className="text-xs text-gray-500">Assigned: <span className="font-medium text-gray-700">{item.assignedTo}</span></p>
                          </div>
                          <div className="flex flex-col items-end gap-2 flex-shrink-0">
                            {statusBadge(item.status)}
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>

                  {/* QA Results */}
                  <div className="border-t border-gray-100 pt-4">
                    <p className="text-xs font-semibold text-gray-700 mb-3">Final QA Validation Results (after revisions applied)</p>
                    <div className="grid grid-cols-2 gap-3">
                      {[
                        { label: 'Typography Corrections', result: 'Pass after fix', pending: true },
                        { label: 'Formatting Adjustments', result: 'In Progress', pending: true },
                        { label: 'Image Replacement', result: 'Pending upload', pending: true },
                        { label: 'Page Layout Modifications', result: 'Minor pending', pending: true },
                      ].map((qa, i) => (
                        <div key={i} className="flex items-center justify-between p-2 bg-gray-50 rounded-lg border border-gray-100">
                          <span className="text-xs text-gray-600">{qa.label}</span>
                          <span className={`text-xs font-medium ${qa.pending ? 'text-amber-600' : 'text-emerald-600'}`}>{qa.result}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>

                {/* Revision Notes */}
                <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-5">
                  <div className="flex items-center gap-2 mb-4">
                    <MessageSquare className="w-4 h-4 text-blue-600" />
                    <h2 className="text-sm font-semibold text-gray-900">Correction Instructions to TWG</h2>
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs font-medium text-gray-700 mb-1.5">Editor Revision Notes <span className="text-red-500">*</span></label>
                      <textarea
                        value={revisionNotes}
                        onChange={e => setRevisionNotes(e.target.value)}
                        rows={4}
                        placeholder="Detailed editor notes on what needs to be corrected and acceptance criteria for each revision..."
                        className="w-full text-xs border border-gray-300 rounded-lg p-3 focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none placeholder-gray-400"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-medium text-gray-700 mb-1.5">TWG Instructions</label>
                      <textarea
                        value={twgInstructions}
                        onChange={e => setTwgInstructions(e.target.value)}
                        rows={4}
                        placeholder="Specific technical instructions for the TWG Layout Team — file specs, deadlines, and delivery format..."
                        className="w-full text-xs border border-gray-300 rounded-lg p-3 focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none placeholder-gray-400"
                      />
                    </div>
                  </div>
                </div>
              </div>

              {/* Right: Revision Requests + Checklist (4 cols) */}
              <div className="col-span-4 space-y-5">

                {/* Revision Requests Panel */}
                <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-5">
                  <div className="flex items-center gap-2 mb-3">
                    <MessageSquare className="w-4 h-4 text-amber-600" />
                    <h3 className="text-sm font-semibold text-gray-900">Revision Request Log</h3>
                  </div>
                  <div className="space-y-3">
                    <div className="p-3 bg-blue-50 rounded-lg border border-blue-100">
                      <div className="flex items-center gap-2 mb-1">
                        <span className="text-xs font-bold text-blue-800">Editor (You)</span>
                        <span className="text-xs text-blue-400">May 25, 14:32</span>
                      </div>
                      <p className="text-xs text-blue-700">Figure 5 must be replaced with 300 DPI version. Table 3 needs bold header. Both are blocking for publication.</p>
                    </div>
                    <div className="p-3 bg-gray-50 rounded-lg border border-gray-100">
                      <div className="flex items-center gap-2 mb-1">
                        <span className="text-xs font-bold text-gray-700">TWG Layout (Response)</span>
                        <span className="text-xs text-gray-400">May 25, 16:10</span>
                      </div>
                      <p className="text-xs text-gray-600">High-res Figure 5 being sourced from author. Expected within 24 hrs. Table 3 correction will be applied in same revision cycle.</p>
                    </div>
                    <div className="p-3 bg-purple-50 rounded-lg border border-purple-100">
                      <div className="flex items-center gap-2 mb-1">
                        <span className="text-xs font-bold text-purple-800">Author ({manuscript.authorName})</span>
                        <span className="text-xs text-purple-400">May 25, 18:45</span>
                      </div>
                      <p className="text-xs text-purple-700">High-resolution Figure 5 submitted to TWG portal. File: fig5-300dpi-final.tif (24.3 MB)</p>
                    </div>
                  </div>
                </div>

                {/* Revision Checklist */}
                <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-5">
                  <div className="flex items-center justify-between mb-3">
                    <div className="flex items-center gap-2">
                      <CheckCircle className="w-4 h-4 text-teal-600" />
                      <h3 className="text-sm font-semibold text-gray-900">Revision Approval Checklist</h3>
                    </div>
                    <span className="text-xs text-teal-600 font-medium">{checkedCount}/{checklistItems.length}</span>
                  </div>
                  <div className="space-y-2">
                    {checklistItems.map(item => (
                      <button
                        key={item.id}
                        onClick={() => toggleCheck(item.id)}
                        className="w-full flex items-center gap-3 p-2.5 rounded-lg hover:bg-gray-50 transition-colors text-left"
                      >
                        <div className={`w-5 h-5 rounded border-2 flex items-center justify-center flex-shrink-0 transition-colors ${
                          checkedItems[item.id]
                            ? 'bg-teal-600 border-teal-600'
                            : 'border-gray-300 bg-white'
                        }`}>
                          {checkedItems[item.id] && <CheckCircle className="w-3 h-3 text-white" />}
                        </div>
                        <span className={`text-xs flex-1 ${checkedItems[item.id] ? 'line-through text-gray-400' : 'text-gray-700'}`}>
                          {item.label}
                        </span>
                        {item.required && <span className="text-xs text-red-500 flex-shrink-0">Required</span>}
                      </button>
                    ))}
                  </div>
                  <div className="mt-3 w-full bg-gray-100 rounded-full h-2">
                    <div
                      className="bg-teal-500 h-2 rounded-full transition-all"
                      style={{ width: `${(checkedCount / checklistItems.length) * 100}%` }}
                    />
                  </div>
                </div>

                {/* Unresolved Issues Counter */}
                <div className={`rounded-xl border shadow-sm p-5 ${
                  unresolvedCritical > 0 ? 'bg-red-50 border-red-200' : 'bg-amber-50 border-amber-200'
                }`}>
                  <div className="flex items-center gap-2 mb-3">
                    <AlertCircle className={`w-4 h-4 ${unresolvedCritical > 0 ? 'text-red-600' : 'text-amber-600'}`} />
                    <h3 className="text-sm font-semibold text-gray-900">Issue Summary</h3>
                  </div>
                  <div className="space-y-2">
                    <div className="flex items-center justify-between text-xs">
                      <span className="text-gray-700">Critical (blocking)</span>
                      <span className={`font-bold ${unresolvedCritical > 0 ? 'text-red-600' : 'text-emerald-600'}`}>{unresolvedCritical}</span>
                    </div>
                    <div className="flex items-center justify-between text-xs">
                      <span className="text-gray-700">High priority</span>
                      <span className="font-bold text-amber-600">{revisionItems.filter(r => r.priority === 'high' && r.status !== 'resolved').length}</span>
                    </div>
                    <div className="flex items-center justify-between text-xs">
                      <span className="text-gray-700">Medium priority</span>
                      <span className="font-bold text-blue-600">{revisionItems.filter(r => r.priority === 'medium' && r.status !== 'resolved').length}</span>
                    </div>
                    <div className="border-t border-gray-200 pt-2 flex items-center justify-between text-xs">
                      <span className="font-semibold text-gray-700">Total Unresolved</span>
                      <span className="font-bold text-gray-900">{unresolvedTotal}</span>
                    </div>
                  </div>
                </div>

                {/* Timeline Recalculation */}
                <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-5">
                  <div className="flex items-center gap-2 mb-3">
                    <TrendingUp className="w-4 h-4 text-indigo-600" />
                    <h3 className="text-sm font-semibold text-gray-900">Revised Timeline Forecast</h3>
                  </div>
                  <div className="space-y-2 text-xs">
                    {[
                      { label: 'Revisions Sent to TWG', value: 'Today', status: 'current' },
                      { label: 'TWG Correction Window', value: '+24–48 hrs', status: 'pending' },
                      { label: 'Revised Proof Delivery', value: `${daysLeft - 5}d`, status: 'pending' },
                      { label: 'Editor Final Approval', value: `${daysLeft - 3}d`, status: 'pending' },
                      { label: 'Signatures & Publication', value: `${daysLeft}d`, status: 'pending' },
                    ].map((step, i) => (
                      <div key={i} className="flex items-center justify-between py-1 border-b border-gray-50 last:border-0">
                        <span className={step.status === 'current' ? 'text-blue-700 font-semibold' : 'text-gray-600'}>{step.label}</span>
                        <span className={`font-medium ${step.status === 'current' ? 'text-blue-600' : 'text-gray-500'}`}>{step.value}</span>
                      </div>
                    ))}
                  </div>
                  <div className="mt-3 p-2.5 bg-orange-50 border border-orange-200 rounded-lg">
                    <p className="text-xs text-orange-700"><span className="font-semibold">Delay impact:</span> +{delayDays} days added to original timeline. Publication at risk if revisions not received within 48 hours.</p>
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
              <button
                onClick={() => setShowModal('return_proof')}
                className="flex items-center gap-1.5 px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors text-sm"
              >
                <ChevronLeft className="w-4 h-4" /> Return to Proof Review
              </button>
              <button className="flex items-center gap-1.5 px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors text-sm">
                Save Revision Notes
              </button>
            </div>
            <div className="flex items-center gap-3">
              <button className="flex items-center gap-1.5 px-4 py-2 bg-amber-600 text-white rounded-lg hover:bg-amber-700 transition-colors text-sm font-medium">
                <Send className="w-4 h-4" /> Send Corrections to TWG
              </button>
              <button
                onClick={() => setShowModal('approve_revised')}
                className="flex items-center gap-1.5 px-4 py-2 bg-emerald-600 text-white rounded-lg hover:bg-emerald-700 transition-colors text-sm font-medium"
              >
                <CheckCircle className="w-4 h-4" /> Approve Revised Layout
              </button>
              <button
                onClick={() => setShowModal('proceed_approval')}
                className="flex items-center gap-1.5 px-4 py-2 bg-blue-700 text-white rounded-lg hover:bg-blue-800 transition-colors text-sm font-medium"
              >
                Proceed to Final Approval <ArrowRight className="w-4 h-4" />
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
              showModal === 'return_proof' ? 'bg-gray-100' :
              showModal === 'approve_revised' ? 'bg-emerald-100' :
              'bg-blue-100'
            }`}>
              {showModal === 'return_proof' && <ChevronLeft className="w-6 h-6 text-gray-600" />}
              {showModal === 'approve_revised' && <CheckCircle className="w-6 h-6 text-emerald-600" />}
              {showModal === 'proceed_approval' && <ArrowRight className="w-6 h-6 text-blue-600" />}
            </div>
            <h3 className="text-lg font-bold text-gray-900 text-center mb-2">
              {showModal === 'return_proof' && 'Return to Proof Review'}
              {showModal === 'approve_revised' && 'Approve Revised Layout'}
              {showModal === 'proceed_approval' && 'Proceed to Final Approval'}
            </h3>
            <p className="text-sm text-gray-600 text-center mb-2">
              {showModal === 'return_proof' && 'Return to the Final Proof Review page for additional proof validation before proceeding.'}
              {showModal === 'approve_revised' && 'Confirm that the revised layout meets all editorial requirements and is approved for the final approval stage.'}
              {showModal === 'proceed_approval' && 'Advance this manuscript to the Final Approval & Signatures stage. Authors and editors will be notified to provide sign-off.'}
            </p>
            {showModal === 'proceed_approval' && unresolvedCritical > 0 && (
              <div className="mb-3 p-3 bg-red-50 border border-red-200 rounded-lg text-xs text-red-700">
                <strong>Warning:</strong> {unresolvedCritical} critical revision(s) are still unresolved. Proceeding without resolving these may result in publication quality issues.
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
                  showModal === 'return_proof' ? 'bg-gray-600 hover:bg-gray-700' :
                  showModal === 'approve_revised' ? 'bg-emerald-600 hover:bg-emerald-700' :
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
