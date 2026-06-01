import React, { useState } from 'react';
import type { Manuscript } from '../types';
import {
  ChevronLeft, ChevronRight,
  Bell, FileText, CheckCircle, XCircle, AlertTriangle, AlertCircle,
  Clock, Activity, BarChart3, Settings, RefreshCw,
  Download, Send, BookOpen, Calendar, Eye, Home,
  TrendingUp, TrendingDown, Package, Globe, Database,
  Award, Shield, Zap, ArrowRight, Users, Target,
} from 'lucide-react';

interface FinalPublicationTimelinePageProps {
  manuscript: Manuscript;
  onReturnToPreparation: () => void;
  onProceedToPublish: () => void;
}

type ActiveNav = 'dashboard' | 'workflow' | 'queue' | 'preparation' | 'timeline' | 'reports' | 'notifications' | 'settings';
type ModalAction = 'confirm_timeline' | 'adjust_schedule' | 'return_prep' | 'approve_release' | 'proceed_publish' | null;

interface GanttRow {
  label: string;
  start: number;
  width: number;
  status: 'done' | 'active' | 'pending' | 'upcoming';
  daysAgo?: number;
  daysFrom?: number;
}

interface MilestoneItem {
  label: string;
  date: string;
  done: boolean;
  current?: boolean;
}

const navItems: Array<{ id: ActiveNav; label: string; icon: React.ComponentType<{ className?: string }> }> = [
  { id: 'dashboard', label: 'Dashboard', icon: Home },
  { id: 'workflow', label: 'Manuscript Workflow', icon: FileText },
  { id: 'queue', label: 'Production Queue', icon: Activity },
  { id: 'preparation', label: 'Publication Preparation', icon: BookOpen },
  { id: 'timeline', label: 'Timeline Monitoring', icon: Clock },
  { id: 'reports', label: 'Reports', icon: BarChart3 },
  { id: 'notifications', label: 'Notifications', icon: Bell },
  { id: 'settings', label: 'Settings', icon: Settings },
];

const ganttRows: GanttRow[] = [
  { label: 'Submission & Screening', start: 0, width: 8, status: 'done' },
  { label: 'Peer Review Process', start: 8, width: 16, status: 'done' },
  { label: 'Author Revision', start: 24, width: 10, status: 'done' },
  { label: 'Copyediting & QA', start: 34, width: 10, status: 'done' },
  { label: 'Layout & Cover Design', start: 44, width: 12, status: 'done' },
  { label: 'Proof Review Cycle', start: 56, width: 8, status: 'done' },
  { label: 'Approval & Signatures', start: 64, width: 6, status: 'done' },
  { label: 'Publication Preparation', start: 70, width: 8, status: 'done' },
  { label: 'Timeline Confirmation', start: 78, width: 5, status: 'active' },
  { label: 'Release & Distribution', start: 83, width: 10, status: 'upcoming' },
  { label: 'Index & Citation Reg.', start: 93, width: 7, status: 'pending' },
];

const milestones: MilestoneItem[] = [
  { label: 'Manuscript Submitted', date: 'Mar 15, 2024', done: true },
  { label: 'Review Completed', date: 'Apr 18, 2024', done: true },
  { label: 'Author Revisions Accepted', date: 'Apr 30, 2024', done: true },
  { label: 'Copyediting Finalized', date: 'May 8, 2024', done: true },
  { label: 'Layout Approved', date: 'May 18, 2024', done: true },
  { label: 'Proof Approved & Signed', date: 'May 27, 2024', done: true },
  { label: 'Publication Preparation', date: 'May 28, 2024', done: true },
  { label: 'Timeline Confirmation', date: 'Today', done: false, current: true },
  { label: 'Digital Publication', date: 'Jun 10, 2024', done: false },
  { label: 'Print Distribution', date: 'Jun 20, 2024', done: false },
];

const approvalSummary = [
  { role: 'Author Approval', name: 'Authors', status: 'approved', date: 'May 27, 2024' },
  { role: 'Editor Approval', name: 'Dr. S. Mitchell', status: 'approved', date: 'May 27, 2024' },
  { role: 'EIC Endorsement', name: 'Dr. R. Chambers', status: 'approved', date: 'May 28, 2024' },
  { role: 'Production Sign-off', name: 'TWG Coordinator', status: 'approved', date: 'May 28, 2024' },
  { role: 'Publication Compliance', name: 'Compliance Review', status: 'pending', date: 'Expected today' },
  { role: 'Archive Verification', name: 'Repository Team', status: 'approved', date: 'May 28, 2024' },
];

const publicationQueue = [
  { rank: 1, id: 'MS-2024-001', title: 'Machine Learning Approaches...', priority: 'high', readiness: 94, current: true },
  { rank: 2, id: 'MS-2024-007', title: 'Sustainable Urban Planning...', priority: 'medium', readiness: 88, current: false },
  { rank: 3, id: 'MS-2024-012', title: 'Quantum Computing Breakthroughs...', priority: 'medium', readiness: 81, current: false },
  { rank: 4, id: 'MS-2024-019', title: 'Genomic Analysis Techniques...', priority: 'low', readiness: 72, current: false },
];

export function FinalPublicationTimelinePage({ manuscript, onReturnToPreparation, onProceedToPublish }: FinalPublicationTimelinePageProps) {
  const [activeNav, setActiveNav] = useState<ActiveNav>('timeline');
  const [showModal, setShowModal] = useState<ModalAction>(null);
  const [timelineConfirmed, setTimelineConfirmed] = useState(false);
  const [adjustedDate, setAdjustedDate] = useState('2024-06-10');

  const publicationDate = new Date(Date.now() + 10 * 24 * 60 * 60 * 1000);
  const daysToRelease = 10;
  const timelineScore = 91;
  const readinessPct = 94;
  const completedStages = milestones.filter(m => m.done).length;
  const totalStages = milestones.length;
  const pendingApprovals = approvalSummary.filter(a => a.status === 'pending').length;

  const handleConfirm = () => {
    if (showModal === 'confirm_timeline' || showModal === 'approve_release') {
      setTimelineConfirmed(true);
      setShowModal(null);
    } else if (showModal === 'proceed_publish') {
      setShowModal(null);
      onProceedToPublish();
    } else if (showModal === 'return_prep' || showModal === 'adjust_schedule') {
      setShowModal(null);
      onReturnToPreparation();
    } else {
      setShowModal(null);
    }
  };

  return (
    <div className="flex h-screen bg-gray-50 overflow-hidden">
      {/* Sidebar */}
      <aside className="w-64 bg-[#0f2744] flex-shrink-0 flex flex-col">
        <div className="px-5 py-5 border-b border-white/10">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 bg-indigo-500 rounded-lg flex items-center justify-center">
              <Clock className="w-5 h-5 text-white" />
            </div>
            <div>
              <p className="text-white text-sm font-semibold">MMS Editor Portal</p>
              <p className="text-indigo-300 text-xs">Timeline Confirmation</p>
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
                  if (item.id === 'preparation') { onReturnToPreparation(); return; }
                  setActiveNav(item.id);
                }}
                className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-lg transition-all text-left ${
                  isActive ? 'bg-indigo-600 text-white font-medium' : 'text-blue-200 hover:bg-white/10 hover:text-white'
                }`}
              >
                <Icon className="w-4 h-4 flex-shrink-0" />
                <span className="text-sm">{item.label}</span>
              </button>
            );
          })}
        </nav>

        <div className="px-4 py-4 border-t border-white/10 space-y-2">
          <p className="text-xs text-blue-300 font-medium uppercase tracking-wider">Timeline Status</p>
          <div className="flex items-center justify-between text-xs">
            <span className="text-blue-200">Confidence Score</span>
            <span className="font-bold text-white">{timelineScore}%</span>
          </div>
          <div className="flex items-center justify-between text-xs">
            <span className="text-blue-200">Days to Release</span>
            <span className="font-bold text-indigo-300">{daysToRelease}d</span>
          </div>
          <div className="flex items-center justify-between text-xs">
            <span className="text-blue-200">Stages Complete</span>
            <span className="font-bold text-white">{completedStages}/{totalStages}</span>
          </div>
          {timelineConfirmed && (
            <div className="flex items-center gap-1.5 mt-1 text-emerald-300 text-xs">
              <CheckCircle className="w-3.5 h-3.5" />
              <span className="font-semibold">Timeline Confirmed</span>
            </div>
          )}
        </div>
      </aside>

      {/* Main */}
      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Header */}
        <header className="bg-white border-b border-gray-200 px-6 py-3 flex-shrink-0">
          <div className="flex items-center justify-between gap-4">
            <div className="flex items-center gap-3 min-w-0">
              <button onClick={onReturnToPreparation} className="p-1.5 hover:bg-gray-100 rounded-lg flex-shrink-0">
                <ChevronLeft className="w-5 h-5 text-gray-600" />
              </button>
              <div className="min-w-0">
                <div className="flex items-center gap-2">
                  <h1 className="text-base font-bold text-gray-900">Final Publication Timeline Confirmation</h1>
                  <ChevronRight className="w-3.5 h-3.5 text-gray-400" />
                  <span className="text-xs font-mono text-gray-500 bg-gray-100 px-2 py-0.5 rounded">{manuscript.id}</span>
                </div>
                <div className="flex items-center gap-2 mt-0.5">
                  <span className="text-xs text-gray-500">Step 8 of 10</span>
                  <span className="text-xs text-gray-400">·</span>
                  <span className="text-xs text-gray-500">Publication Preparation → <strong>Timeline Confirmation</strong> → Publish</span>
                </div>
              </div>
            </div>
            <div className="flex items-center gap-3 flex-shrink-0">
              {timelineConfirmed ? (
                <span className="flex items-center gap-1.5 px-3 py-1.5 bg-emerald-100 text-emerald-800 rounded-full text-xs font-semibold">
                  <CheckCircle className="w-3.5 h-3.5" /> Timeline Confirmed
                </span>
              ) : (
                <span className="flex items-center gap-1.5 px-3 py-1.5 bg-indigo-100 text-indigo-800 rounded-full text-xs font-semibold animate-pulse">
                  <Clock className="w-3.5 h-3.5" /> Awaiting Confirmation
                </span>
              )}
              <div className="flex items-center gap-1.5 px-3 py-1.5 bg-gray-100 text-gray-700 rounded-full text-xs font-medium">
                <Target className="w-3.5 h-3.5" />Timeline Confidence: {timelineScore}%
              </div>
              <div className="w-8 h-8 rounded-full bg-gradient-to-br from-indigo-500 to-blue-600 flex items-center justify-center text-white text-xs font-bold">EIC</div>
            </div>
          </div>
        </header>

        {/* Content */}
        <div className="flex-1 overflow-y-auto p-6">
          <div className="max-w-[1400px] mx-auto space-y-6">

            {/* Workflow Breadcrumb */}
            <div className="flex items-center gap-1 overflow-x-auto pb-1">
              {['Submission', 'Review', 'Copyediting', 'Layout', 'Proof Review', 'Approval', 'Pub Prep', 'Timeline ●', 'Publish'].map((step, i) => (
                <React.Fragment key={i}>
                  <span className={`text-xs px-2.5 py-1 rounded-full whitespace-nowrap font-medium ${
                    i < 7 ? 'bg-emerald-100 text-emerald-700' :
                    i === 7 ? 'bg-indigo-600 text-white' :
                    'bg-gray-100 text-gray-400'
                  }`}>{step}</span>
                  {i < 8 && <ChevronRight className="w-3.5 h-3.5 text-gray-300 flex-shrink-0" />}
                </React.Fragment>
              ))}
            </div>

            {/* Timeline Overview */}
            <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-5">
              <div className="flex items-center gap-2 mb-4">
                <Clock className="w-4 h-4 text-indigo-600" />
                <h2 className="text-sm font-semibold text-gray-900">Publication Timeline Overview</h2>
                <span className="ml-auto text-xs text-gray-500">{completedStages} of {totalStages} stages completed</span>
              </div>
              <div className="grid grid-cols-5 gap-4">
                {[
                  { label: 'Manuscript Title', value: manuscript.title.substring(0, 45) + (manuscript.title.length > 45 ? '...' : ''), wide: true },
                  { label: 'Publication Issue', value: 'Vol. 14, No. 2' },
                  { label: 'Scheduled Release', value: publicationDate.toLocaleDateString() },
                  { label: 'Days to Release', value: `${daysToRelease} days` },
                  { label: 'Completed Stages', value: `${completedStages}/${totalStages}` },
                ].slice(1).map((stat, i) => (
                  <div key={i} className="p-3 bg-gray-50 rounded-lg border border-gray-100">
                    <p className="text-xs text-gray-500 mb-0.5">{stat.label}</p>
                    <p className="text-sm font-semibold text-gray-900">{stat.value}</p>
                  </div>
                ))}
              </div>
              <div className="mt-4 grid grid-cols-3 gap-4">
                <div className="p-3 bg-indigo-50 rounded-lg border border-indigo-100 col-span-2">
                  <p className="text-xs text-indigo-600 font-medium mb-1">Manuscript</p>
                  <p className="text-sm font-bold text-gray-900 leading-snug">{manuscript.title}</p>
                  <p className="text-xs text-gray-600 mt-1">{manuscript.authorName} · {manuscript.category}</p>
                </div>
                <div className="p-3 bg-emerald-50 rounded-lg border border-emerald-100">
                  <p className="text-xs text-emerald-600 font-medium mb-1">Publication Forecast</p>
                  <p className="text-sm font-bold text-gray-900">{publicationDate.toLocaleDateString()}</p>
                  <p className="text-xs text-gray-600 mt-1">Online First + Vol. 14 No. 2</p>
                </div>
              </div>
            </div>

            <div className="grid grid-cols-12 gap-6">
              {/* Left: Gantt + Milestones (8 cols) */}
              <div className="col-span-8 space-y-5">

                {/* Gantt Timeline */}
                <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-5">
                  <div className="flex items-center justify-between mb-4">
                    <div className="flex items-center gap-2">
                      <Activity className="w-4 h-4 text-indigo-600" />
                      <h2 className="text-sm font-semibold text-gray-900">Production Timeline — Gantt View</h2>
                    </div>
                    <div className="flex items-center gap-3 text-xs">
                      <span className="flex items-center gap-1"><span className="w-3 h-3 bg-emerald-400 rounded inline-block" /> Completed</span>
                      <span className="flex items-center gap-1"><span className="w-3 h-3 bg-indigo-500 rounded animate-pulse inline-block" /> Active</span>
                      <span className="flex items-center gap-1"><span className="w-3 h-3 bg-blue-200 rounded inline-block" /> Upcoming</span>
                      <span className="flex items-center gap-1"><span className="w-3 h-3 bg-gray-200 rounded inline-block" /> Pending</span>
                    </div>
                  </div>

                  {/* Timeline ruler */}
                  <div className="flex items-center gap-0 mb-1 pl-44">
                    {['Mar', 'Apr', 'May', 'Jun'].map((m, i) => (
                      <div key={i} className="flex-1 text-xs text-gray-400 text-center border-l border-gray-200 pl-1">{m}</div>
                    ))}
                  </div>

                  <div className="space-y-2">
                    {ganttRows.map((row, i) => (
                      <div key={i} className="flex items-center gap-2">
                        <div className="w-44 text-right flex-shrink-0">
                          <span className={`text-xs ${row.status === 'active' ? 'text-indigo-700 font-semibold' : row.status === 'done' ? 'text-gray-500' : 'text-gray-400'}`}>
                            {row.label}
                          </span>
                        </div>
                        <div className="flex-1 relative h-6 bg-gray-100 rounded-full overflow-hidden">
                          <div
                            className={`absolute h-full rounded-full transition-all flex items-center justify-end pr-1 ${
                              row.status === 'done' ? 'bg-emerald-400' :
                              row.status === 'active' ? 'bg-indigo-500 animate-pulse' :
                              row.status === 'upcoming' ? 'bg-blue-300' :
                              'bg-gray-200'
                            }`}
                            style={{ left: `${row.start}%`, width: `${row.width}%` }}
                          >
                            {row.status === 'done' && <CheckCircle className="w-3 h-3 text-white" />}
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>

                  <div className="mt-4 grid grid-cols-3 gap-3">
                    {[
                      { label: 'Delay Risk', value: 'Low', color: 'text-emerald-600', bg: 'bg-emerald-50' },
                      { label: 'Feasibility Score', value: `${timelineScore}%`, color: 'text-indigo-600', bg: 'bg-indigo-50' },
                      { label: 'On-Schedule', value: '9/11 stages', color: 'text-blue-600', bg: 'bg-blue-50' },
                    ].map((stat, i) => (
                      <div key={i} className={`p-3 rounded-lg ${stat.bg} text-center`}>
                        <p className={`text-lg font-bold ${stat.color}`}>{stat.value}</p>
                        <p className="text-xs text-gray-500">{stat.label}</p>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Publication Scheduling Panel */}
                <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-5">
                  <div className="flex items-center justify-between mb-4">
                    <div className="flex items-center gap-2">
                      <Calendar className="w-4 h-4 text-blue-600" />
                      <h2 className="text-sm font-semibold text-gray-900">Publication Scheduling</h2>
                    </div>
                    <button
                      onClick={() => setShowModal('adjust_schedule')}
                      className="flex items-center gap-1.5 px-3 py-1.5 border border-amber-300 text-amber-700 bg-amber-50 rounded-lg hover:bg-amber-100 text-xs font-medium transition-colors"
                    >
                      <RefreshCw className="w-3.5 h-3.5" /> Adjust Schedule
                    </button>
                  </div>

                  <div className="grid grid-cols-2 gap-5">
                    {/* Release calendar */}
                    <div>
                      <p className="text-xs font-semibold text-gray-700 mb-3">Release Calendar — June 2024</p>
                      <div className="grid grid-cols-7 gap-1 text-center mb-2">
                        {['M', 'T', 'W', 'T', 'F', 'S', 'S'].map((d, i) => (
                          <div key={i} className="text-xs text-gray-400 font-medium py-0.5">{d}</div>
                        ))}
                        {Array.from({ length: 6 }, (_, i) => i + 1).map(pad => (
                          <div key={`p${pad}`} className="text-xs text-gray-200 py-1"></div>
                        ))}
                        {Array.from({ length: 30 }, (_, i) => i + 1).map(day => (
                          <div key={day} className={`text-xs py-1.5 rounded-md cursor-default ${
                            day === 10 ? 'bg-indigo-600 text-white font-bold' :
                            day === 20 ? 'bg-blue-500 text-white font-bold' :
                            day < 10 ? 'text-gray-300' :
                            'text-gray-600 hover:bg-gray-100'
                          }`}>
                            {day}
                          </div>
                        ))}
                      </div>
                      <div className="flex items-center gap-3 text-xs mt-2">
                        <span className="flex items-center gap-1"><span className="w-3 h-3 bg-indigo-600 rounded inline-block" /> Online (Jun 10)</span>
                        <span className="flex items-center gap-1"><span className="w-3 h-3 bg-blue-500 rounded inline-block" /> Print (Jun 20)</span>
                      </div>
                    </div>

                    {/* Queue & Workload */}
                    <div>
                      <p className="text-xs font-semibold text-gray-700 mb-3">Publication Queue — Vol. 14, No. 2</p>
                      <div className="space-y-2">
                        {publicationQueue.map(item => (
                          <div key={item.id} className={`p-2.5 rounded-lg border flex items-center gap-3 ${
                            item.current ? 'bg-indigo-50 border-indigo-200' : 'bg-gray-50 border-gray-200'
                          }`}>
                            <span className={`w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold flex-shrink-0 ${
                              item.current ? 'bg-indigo-600 text-white' : 'bg-gray-200 text-gray-600'
                            }`}>{item.rank}</span>
                            <div className="flex-1 min-w-0">
                              <p className="text-xs font-medium text-gray-800 truncate">{item.title}</p>
                              <div className="flex items-center gap-2 mt-0.5">
                                <span className={`text-xs px-1.5 py-0.5 rounded-full ${
                                  item.priority === 'high' ? 'bg-red-100 text-red-600' :
                                  item.priority === 'medium' ? 'bg-amber-100 text-amber-600' :
                                  'bg-gray-100 text-gray-500'
                                }`}>{item.priority}</span>
                                <div className="flex items-center gap-1 flex-1">
                                  <div className="flex-1 bg-gray-200 rounded-full h-1.5">
                                    <div className="bg-teal-500 h-1.5 rounded-full" style={{ width: `${item.readiness}%` }} />
                                  </div>
                                  <span className="text-xs text-gray-500">{item.readiness}%</span>
                                </div>
                              </div>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>

                {/* Publication Approval Summary */}
                <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-5">
                  <div className="flex items-center justify-between mb-4">
                    <div className="flex items-center gap-2">
                      <Shield className="w-4 h-4 text-teal-600" />
                      <h2 className="text-sm font-semibold text-gray-900">Publication Approval Summary</h2>
                    </div>
                    {pendingApprovals > 0 && (
                      <span className="text-xs text-amber-700 bg-amber-100 px-2 py-0.5 rounded-full font-medium">{pendingApprovals} pending</span>
                    )}
                  </div>
                  <div className="grid grid-cols-2 gap-3">
                    {approvalSummary.map((item, i) => (
                      <div key={i} className={`p-3 rounded-lg border flex items-start gap-3 ${
                        item.status === 'approved' ? 'bg-emerald-50 border-emerald-100' : 'bg-amber-50 border-amber-100'
                      }`}>
                        {item.status === 'approved'
                          ? <CheckCircle className="w-4 h-4 text-emerald-500 flex-shrink-0 mt-0.5" />
                          : <Clock className="w-4 h-4 text-amber-500 flex-shrink-0 mt-0.5" />
                        }
                        <div className="flex-1 min-w-0">
                          <p className="text-xs font-semibold text-gray-800">{item.role}</p>
                          <p className="text-xs text-gray-600">{item.name}</p>
                          <p className="text-xs text-gray-400 mt-0.5">{item.date}</p>
                        </div>
                        <span className={`text-xs font-bold flex-shrink-0 ${item.status === 'approved' ? 'text-emerald-600' : 'text-amber-600'}`}>
                          {item.status === 'approved' ? '✓' : '…'}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              {/* Right: Analytics + Milestones (4 cols) */}
              <div className="col-span-4 space-y-5">

                {/* Executive Analytics */}
                <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-5">
                  <div className="flex items-center gap-2 mb-4">
                    <BarChart3 className="w-4 h-4 text-indigo-600" />
                    <h3 className="text-sm font-semibold text-gray-900">Executive Analytics</h3>
                  </div>
                  <div className="grid grid-cols-2 gap-3 mb-4">
                    {[
                      { label: 'Timeline Confidence', value: `${timelineScore}%`, color: 'text-indigo-600', bg: 'bg-indigo-50' },
                      { label: 'Pub Readiness', value: `${readinessPct}%`, color: 'text-teal-600', bg: 'bg-teal-50' },
                      { label: 'Approval Rate', value: '5/6', color: 'text-emerald-600', bg: 'bg-emerald-50' },
                      { label: 'Days Ahead', value: '+2d', color: 'text-blue-600', bg: 'bg-blue-50' },
                    ].map((stat, i) => (
                      <div key={i} className={`p-3 rounded-lg ${stat.bg} text-center border border-gray-100`}>
                        <p className={`text-xl font-bold ${stat.color}`}>{stat.value}</p>
                        <p className="text-xs text-gray-500 mt-0.5">{stat.label}</p>
                      </div>
                    ))}
                  </div>
                  <div className="space-y-2.5">
                    {[
                      { label: 'Workflow Efficiency', pct: 94 },
                      { label: 'Schedule Adherence', pct: 88 },
                      { label: 'Resource Utilization', pct: 79 },
                    ].map((item, i) => (
                      <div key={i}>
                        <div className="flex items-center justify-between text-xs mb-1">
                          <span className="text-gray-600">{item.label}</span>
                          <span className="font-semibold text-gray-800">{item.pct}%</span>
                        </div>
                        <div className="w-full bg-gray-100 rounded-full h-2">
                          <div className="bg-indigo-500 h-2 rounded-full" style={{ width: `${item.pct}%` }} />
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Milestone Tracker */}
                <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-5">
                  <div className="flex items-center gap-2 mb-3">
                    <Target className="w-4 h-4 text-blue-600" />
                    <h3 className="text-sm font-semibold text-gray-900">Milestone Tracker</h3>
                  </div>
                  <div className="space-y-2 max-h-80 overflow-y-auto pr-1">
                    {milestones.map((m, i) => (
                      <div key={i} className="flex items-start gap-2.5">
                        <div className={`w-5 h-5 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5 text-xs ${
                          m.done ? 'bg-emerald-500 text-white' :
                          m.current ? 'bg-indigo-600 text-white ring-4 ring-indigo-100' :
                          'bg-gray-100 text-gray-400 border border-gray-200'
                        }`}>
                          {m.done ? '✓' : i + 1}
                        </div>
                        <div className="flex-1 min-w-0 flex items-center justify-between">
                          <span className={`text-xs ${
                            m.done ? 'text-gray-400 line-through' :
                            m.current ? 'text-indigo-700 font-semibold' :
                            'text-gray-500'
                          }`}>{m.label}</span>
                          <span className="text-xs text-gray-400 ml-2 flex-shrink-0">{m.date}</span>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Delay Risk Monitor */}
                <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-5">
                  <div className="flex items-center gap-2 mb-3">
                    <AlertCircle className="w-4 h-4 text-amber-500" />
                    <h3 className="text-sm font-semibold text-gray-900">Risk Monitor</h3>
                  </div>
                  <div className="space-y-2.5">
                    <div className="p-3 bg-emerald-50 border border-emerald-100 rounded-lg flex items-start gap-2">
                      <CheckCircle className="w-3.5 h-3.5 text-emerald-500 flex-shrink-0 mt-0.5" />
                      <div>
                        <p className="text-xs font-semibold text-emerald-800">No Critical Delays Detected</p>
                        <p className="text-xs text-emerald-700">All critical path items on schedule</p>
                      </div>
                    </div>
                    <div className="p-3 bg-amber-50 border border-amber-100 rounded-lg flex items-start gap-2">
                      <AlertTriangle className="w-3.5 h-3.5 text-amber-500 flex-shrink-0 mt-0.5" />
                      <div>
                        <p className="text-xs font-semibold text-amber-800">Compliance Gap (Minor)</p>
                        <p className="text-xs text-amber-700">Expected resolved by end of day — no release risk</p>
                      </div>
                    </div>
                    <div className="p-3 bg-blue-50 border border-blue-100 rounded-lg flex items-start gap-2">
                      <TrendingUp className="w-3.5 h-3.5 text-blue-500 flex-shrink-0 mt-0.5" />
                      <div>
                        <p className="text-xs font-semibold text-blue-800">Ahead of Original Plan</p>
                        <p className="text-xs text-blue-700">Manuscript completed 2 days ahead of original 89-day estimate</p>
                      </div>
                    </div>
                  </div>
                </div>

                {/* TWG Workload */}
                <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-5">
                  <div className="flex items-center gap-2 mb-3">
                    <Users className="w-4 h-4 text-gray-600" />
                    <h3 className="text-sm font-semibold text-gray-900">TWG Workload Distribution</h3>
                  </div>
                  <div className="space-y-2.5">
                    {[
                      { role: 'Layout & Design', available: 2, assigned: 1, pct: 50 },
                      { role: 'Copyediting', available: 3, assigned: 3, pct: 100 },
                      { role: 'QA & Validation', available: 2, assigned: 1, pct: 50 },
                      { role: 'Production Coord.', available: 1, assigned: 1, pct: 100 },
                    ].map((item, i) => (
                      <div key={i}>
                        <div className="flex items-center justify-between text-xs mb-0.5">
                          <span className="text-gray-700">{item.role}</span>
                          <span className="text-gray-500">{item.assigned}/{item.available} assigned</span>
                        </div>
                        <div className="w-full bg-gray-100 rounded-full h-1.5">
                          <div className={`h-1.5 rounded-full ${item.pct === 100 ? 'bg-amber-400' : 'bg-teal-400'}`} style={{ width: `${item.pct}%` }} />
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom Action Bar */}
        <div className="bg-white border-t border-gray-200 px-6 py-4 flex-shrink-0">
          <div className="flex items-center justify-between max-w-[1400px] mx-auto">
            <div className="flex items-center gap-2">
              <button
                onClick={() => setShowModal('return_prep')}
                className="flex items-center gap-1.5 px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 text-sm transition-colors"
              >
                <ChevronLeft className="w-4 h-4" /> Return to Publication Preparation
              </button>
              <button
                onClick={() => setShowModal('adjust_schedule')}
                className="flex items-center gap-1.5 px-4 py-2 border border-amber-300 text-amber-700 bg-amber-50 rounded-lg hover:bg-amber-100 text-sm transition-colors"
              >
                <RefreshCw className="w-4 h-4" /> Adjust Publication Schedule
              </button>
            </div>
            <div className="flex items-center gap-3">
              <button
                onClick={() => setShowModal('confirm_timeline')}
                className="flex items-center gap-1.5 px-4 py-2 bg-teal-600 text-white rounded-lg hover:bg-teal-700 text-sm font-medium transition-colors"
              >
                <CheckCircle className="w-4 h-4" /> Confirm Publication Timeline
              </button>
              <button
                onClick={() => setShowModal('approve_release')}
                className="flex items-center gap-1.5 px-4 py-2 bg-emerald-600 text-white rounded-lg hover:bg-emerald-700 text-sm font-medium transition-colors"
              >
                <Award className="w-4 h-4" /> Approve Final Release Schedule
              </button>
              <button
                onClick={() => setShowModal('proceed_publish')}
                className="flex items-center gap-1.5 px-5 py-2 bg-blue-700 text-white rounded-lg hover:bg-blue-800 text-sm font-medium transition-colors"
              >
                Proceed to Publish Manuscript <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl shadow-2xl max-w-md w-full p-6">
            <div className={`w-12 h-12 rounded-full flex items-center justify-center mx-auto mb-4 ${
              showModal === 'proceed_publish' ? 'bg-blue-100' :
              showModal === 'return_prep' || showModal === 'adjust_schedule' ? 'bg-amber-100' :
              'bg-emerald-100'
            }`}>
              {(showModal === 'return_prep' || showModal === 'adjust_schedule') && <RefreshCw className="w-6 h-6 text-amber-600" />}
              {showModal === 'confirm_timeline' && <CheckCircle className="w-6 h-6 text-emerald-600" />}
              {showModal === 'approve_release' && <Award className="w-6 h-6 text-emerald-600" />}
              {showModal === 'proceed_publish' && <ArrowRight className="w-6 h-6 text-blue-600" />}
            </div>
            <h3 className="text-lg font-bold text-gray-900 text-center mb-2">
              {showModal === 'confirm_timeline' && 'Confirm Publication Timeline'}
              {showModal === 'adjust_schedule' && 'Adjust Publication Schedule'}
              {showModal === 'return_prep' && 'Return to Publication Preparation'}
              {showModal === 'approve_release' && 'Approve Final Release Schedule'}
              {showModal === 'proceed_publish' && 'Proceed to Publish Manuscript'}
            </h3>
            <p className="text-sm text-gray-600 text-center mb-3">
              {showModal === 'confirm_timeline' && `Confirm the publication timeline with release date ${publicationDate.toLocaleDateString()}. This will lock in the production schedule.`}
              {showModal === 'adjust_schedule' && 'Return to Publication Preparation to adjust the release schedule, modify production timelines, or update publication requirements.'}
              {showModal === 'return_prep' && 'Go back to the Publication Preparation stage to review or update publication assets and settings.'}
              {showModal === 'approve_release' && 'Formally approve the final release schedule. The manuscript will be cleared for the Publish Manuscript stage.'}
              {showModal === 'proceed_publish' && 'Advance to the final Publish Manuscript stage. All publication files will be deployed and the manuscript will be released to the public.'}
            </p>
            {showModal === 'adjust_schedule' && (
              <div className="mb-3">
                <label className="block text-xs font-medium text-gray-700 mb-1.5">Revised Publication Date</label>
                <input
                  type="date"
                  value={adjustedDate}
                  onChange={e => setAdjustedDate(e.target.value)}
                  className="w-full text-sm border border-gray-300 rounded-lg p-2.5 focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
            )}
            {showModal === 'proceed_publish' && (
              <div className="mb-3 p-3 bg-indigo-50 border border-indigo-200 rounded-lg text-xs text-indigo-700">
                <strong>Timeline Confidence: {timelineScore}%</strong> · {readinessPct}% readiness · {completedStages}/{totalStages} milestones complete
              </div>
            )}
            <div className="flex gap-3">
              <button onClick={() => setShowModal(null)} className="flex-1 px-4 py-2.5 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 text-sm font-medium">Cancel</button>
              <button
                onClick={handleConfirm}
                className={`flex-1 px-4 py-2.5 text-white rounded-lg text-sm font-medium ${
                  showModal === 'return_prep' || showModal === 'adjust_schedule' ? 'bg-amber-600 hover:bg-amber-700' :
                  showModal === 'proceed_publish' ? 'bg-blue-700 hover:bg-blue-800' :
                  'bg-emerald-600 hover:bg-emerald-700'
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
