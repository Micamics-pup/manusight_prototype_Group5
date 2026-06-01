import React, { useState } from 'react';
import type { Manuscript } from '../types';
import {
  ChevronLeft, ChevronRight,
  Bell, FileText, CheckCircle, XCircle, AlertTriangle, AlertCircle,
  Clock, Activity, BarChart3, Settings, RefreshCw,
  Download, Send, BookOpen, Calendar, Eye, Home,
  TrendingUp, ChevronDown, Package, Globe, Database,
  Award, Shield, Zap, ArrowRight, Users,
} from 'lucide-react';

interface PublicationPreparationPageProps {
  manuscript: Manuscript;
  onBack: () => void;
  onSendToTimeline: () => void;
}

type ActiveNav = 'dashboard' | 'workflow' | 'queue' | 'preparation' | 'timeline' | 'reports' | 'notifications' | 'settings';
type ModalAction = 'prepare' | 'generate' | 'validate' | 'send_timeline' | 'notify' | null;

interface AssetItem {
  id: string;
  name: string;
  type: string;
  size: string;
  status: 'ready' | 'generating' | 'missing';
  icon: React.ComponentType<{ className?: string }>;
}

interface ValidationItem {
  id: string;
  label: string;
  status: 'pass' | 'warning' | 'fail';
  detail: string;
  score?: number;
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

const validationItems: ValidationItem[] = [
  { id: 'v1', label: 'Final Formatting Verification', status: 'pass', detail: 'All layout specs conform to APA 7 & journal template', score: 100 },
  { id: 'v2', label: 'Metadata Completeness', status: 'pass', detail: 'Title, abstract, keywords, DOI, ORCID all populated', score: 100 },
  { id: 'v3', label: 'Copyright Validation', status: 'pass', detail: 'CC BY-NC 4.0 confirmed, author transfer agreement on file', score: 100 },
  { id: 'v4', label: 'Publication Compliance', status: 'warning', detail: 'Minor COPE checklist item pending — expected to clear within 2 hours', score: 88 },
  { id: 'v5', label: 'Archive Readiness', status: 'pass', detail: 'PDF/A-3b compliant, EPUB 3.0 bundle validated, XML export clean', score: 96 },
];

const assetItems: AssetItem[] = [
  { id: 'a1', name: 'manuscript-final-v2.0.pdf', type: 'Final Manuscript PDF', size: '4.7 MB', status: 'ready', icon: FileText },
  { id: 'a2', name: 'cover-design-final.pdf', type: 'Cover Design', size: '2.1 MB', status: 'ready', icon: Eye },
  { id: 'a3', name: 'copyright-page.pdf', type: 'Copyright Page', size: '0.4 MB', status: 'ready', icon: Shield },
  { id: 'a4', name: 'preliminaries.pdf', type: 'Preliminaries', size: '1.2 MB', status: 'ready', icon: FileText },
  { id: 'a5', name: 'publication-metadata.xml', type: 'Publication Metadata', size: '0.1 MB', status: 'ready', icon: Database },
  { id: 'a6', name: 'doi-isbn-record.json', type: 'DOI / ISBN Record', size: '0.05 MB', status: 'ready', icon: Globe },
];

const checklistItems = [
  { id: 'c1', label: 'Final content approved by all parties', done: true },
  { id: 'c2', label: 'Digital signatures completed (Author + Editor)', done: true },
  { id: 'c3', label: 'Production finalized and proof confirmed', done: true },
  { id: 'c4', label: 'Metadata verified and cross-referenced', done: true },
  { id: 'c5', label: 'Publication files generated and validated', done: true },
  { id: 'c6', label: 'Publication schedule confirmed by Editor in Chief', done: false },
];

const workflowStages = [
  { label: 'Submission', pct: 100 },
  { label: 'Peer Review', pct: 100 },
  { label: 'Copyediting', pct: 100 },
  { label: 'Layout & Design', pct: 100 },
  { label: 'Proof Review', pct: 100 },
  { label: 'Approval & Signatures', pct: 100 },
  { label: 'Publication Preparation', pct: 92, current: true },
  { label: 'Timeline Confirmation', pct: 0 },
  { label: 'Publication', pct: 0 },
];

const passCount = validationItems.filter(v => v.status === 'pass').length;
const warnCount = validationItems.filter(v => v.status === 'warning').length;
const overallReadiness = Math.round(validationItems.reduce((sum, v) => sum + (v.score ?? (v.status === 'pass' ? 100 : v.status === 'warning' ? 75 : 0)), 0) / validationItems.length);
const doneCount = checklistItems.filter(c => c.done).length;

export function PublicationPreparationPage({ manuscript, onBack, onSendToTimeline }: PublicationPreparationPageProps) {
  const [activeNav, setActiveNav] = useState<ActiveNav>('preparation');
  const [showModal, setShowModal] = useState<ModalAction>(null);
  const [packageGenerated, setPackageGenerated] = useState(false);

  const publicationDate = new Date(Date.now() + 10 * 24 * 60 * 60 * 1000);
  const approvalDate = new Date(Date.now() - 1 * 24 * 60 * 60 * 1000);
  const daysToPublication = 10;
  const completionPct = Math.round((doneCount / checklistItems.length) * 100);

  const handleConfirm = () => {
    if (showModal === 'prepare' || showModal === 'generate') {
      setPackageGenerated(true);
      setShowModal(null);
    } else if (showModal === 'send_timeline') {
      setShowModal(null);
      onSendToTimeline();
    } else {
      setShowModal(null);
    }
  };

  const validIcon = (status: ValidationItem['status']) => {
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
              <p className="text-teal-300 text-xs">Editor in Chief</p>
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
                  isActive ? 'bg-teal-600 text-white font-medium' : 'text-blue-200 hover:bg-white/10 hover:text-white'
                }`}
              >
                <Icon className="w-4 h-4 flex-shrink-0" />
                <span className="text-sm">{item.label}</span>
              </button>
            );
          })}
        </nav>

        {/* Sidebar footer stats */}
        <div className="px-4 py-4 border-t border-white/10 space-y-3">
          <p className="text-xs text-blue-300 font-medium uppercase tracking-wider">Pub Readiness</p>
          <div className="flex items-center gap-2">
            <div className="flex-1 bg-white/10 rounded-full h-2">
              <div className="bg-teal-400 h-2 rounded-full" style={{ width: `${overallReadiness}%` }} />
            </div>
            <span className="text-xs font-bold text-white">{overallReadiness}%</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="flex-1 bg-white/10 rounded-full h-2">
              <div className="bg-blue-400 h-2 rounded-full" style={{ width: `${completionPct}%` }} />
            </div>
            <span className="text-xs font-bold text-white">{completionPct}%</span>
          </div>
          <p className="text-xs text-blue-300">{daysToPublication} days to publication</p>
        </div>
      </aside>

      {/* Main */}
      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Header */}
        <header className="bg-white border-b border-gray-200 px-6 py-3 flex-shrink-0 z-10">
          <div className="flex items-center justify-between gap-4">
            <div className="flex items-center gap-3 min-w-0">
              <button onClick={onBack} className="p-1.5 hover:bg-gray-100 rounded-lg flex-shrink-0">
                <ChevronLeft className="w-5 h-5 text-gray-600" />
              </button>
              <div className="min-w-0">
                <div className="flex items-center gap-2">
                  <h1 className="text-base font-bold text-gray-900">Publication Preparation</h1>
                  <ChevronRight className="w-3.5 h-3.5 text-gray-400" />
                  <span className="text-xs font-mono text-gray-500 bg-gray-100 px-2 py-0.5 rounded">{manuscript.id}</span>
                </div>
                <p className="text-xs text-gray-500 mt-0.5 truncate max-w-lg">{manuscript.title}</p>
              </div>
            </div>
            <div className="flex items-center gap-3 flex-shrink-0">
              <span className="flex items-center gap-1.5 px-3 py-1.5 bg-emerald-100 text-emerald-800 rounded-full text-xs font-semibold">
                <CheckCircle className="w-3.5 h-3.5" /> Ready for Publication
              </span>
              <div className="flex items-center gap-1.5 px-3 py-1.5 bg-blue-50 text-blue-700 rounded-full text-xs font-medium border border-blue-200">
                <Clock className="w-3.5 h-3.5" />{daysToPublication}d to publish
              </div>
              <button className="relative p-2 hover:bg-gray-100 rounded-lg">
                <Bell className="w-5 h-5 text-gray-600" />
                <span className="absolute top-1 right-1 w-4 h-4 bg-red-500 text-white text-xs rounded-full flex items-center justify-center">2</span>
              </button>
              <div className="w-8 h-8 rounded-full bg-gradient-to-br from-teal-500 to-blue-600 flex items-center justify-center text-white text-xs font-bold">EIC</div>
            </div>
          </div>
        </header>

        {/* Scrollable content */}
        <div className="flex-1 overflow-y-auto p-6">
          <div className="max-w-[1400px] mx-auto">

            {/* Workflow Progress Breadcrumb */}
            <div className="flex items-center gap-1 mb-6 overflow-x-auto pb-1">
              {['Submission', 'Review', 'Copyediting', 'Layout', 'Proof Review', 'Approval', 'Pub Prep ●', 'Timeline', 'Publish'].map((step, i) => (
                <React.Fragment key={i}>
                  <span className={`text-xs px-2.5 py-1 rounded-full whitespace-nowrap font-medium ${
                    i < 6 ? 'bg-emerald-100 text-emerald-700' :
                    i === 6 ? 'bg-teal-600 text-white' :
                    'bg-gray-100 text-gray-400'
                  }`}>{step}</span>
                  {i < 8 && <ChevronRight className="w-3.5 h-3.5 text-gray-300 flex-shrink-0" />}
                </React.Fragment>
              ))}
            </div>

            <div className="grid grid-cols-12 gap-6">
              {/* Left — Main Workspace (8 cols) */}
              <div className="col-span-8 space-y-6">

                {/* Publication Summary Card */}
                <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-5">
                  <div className="flex items-center gap-2 mb-4">
                    <Award className="w-4 h-4 text-teal-600" />
                    <h2 className="text-sm font-semibold text-gray-900">Publication Summary</h2>
                    <span className="ml-auto px-3 py-1 bg-emerald-100 text-emerald-700 text-xs rounded-full font-semibold">
                      {completionPct}% Complete
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
                      <p className="text-xs text-gray-500 mb-0.5">Editor in Chief</p>
                      <p className="text-sm text-gray-800">Dr. R. Chambers</p>
                    </div>
                    <div>
                      <p className="text-xs text-gray-500 mb-0.5">Publication Issue</p>
                      <p className="text-sm text-gray-800">Vol. 14, No. 2, 2024</p>
                    </div>
                    <div>
                      <p className="text-xs text-gray-500 mb-0.5">ISBN Status</p>
                      <span className="px-2 py-0.5 bg-emerald-100 text-emerald-700 text-xs rounded-full font-medium">Registered ✓</span>
                    </div>
                    <div>
                      <p className="text-xs text-gray-500 mb-0.5">Final Approval Date</p>
                      <p className="text-sm text-gray-800">{approvalDate.toLocaleDateString()}</p>
                    </div>
                    <div>
                      <p className="text-xs text-gray-500 mb-0.5">Publication Date</p>
                      <p className="text-sm font-semibold text-teal-700">{publicationDate.toLocaleDateString()}</p>
                    </div>
                    <div>
                      <p className="text-xs text-gray-500 mb-0.5">DOI</p>
                      <p className="text-xs font-mono text-gray-700">10.1234/ajr.2024.{manuscript.id}</p>
                    </div>
                  </div>
                  {/* Completion bar */}
                  <div className="mt-4 pt-4 border-t border-gray-100">
                    <div className="flex items-center justify-between text-xs mb-1.5">
                      <span className="text-gray-600">Workflow Completion</span>
                      <span className="font-semibold text-teal-700">{completionPct}%</span>
                    </div>
                    <div className="w-full bg-gray-100 rounded-full h-2.5">
                      <div className="bg-gradient-to-r from-teal-500 to-emerald-500 h-2.5 rounded-full transition-all" style={{ width: `${completionPct}%` }} />
                    </div>
                  </div>
                </div>

                {/* Publication Assets */}
                <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-5">
                  <div className="flex items-center justify-between mb-4">
                    <div className="flex items-center gap-2">
                      <Package className="w-4 h-4 text-blue-600" />
                      <h2 className="text-sm font-semibold text-gray-900">Publication Assets</h2>
                    </div>
                    <button
                      onClick={() => setShowModal('generate')}
                      className="flex items-center gap-1.5 px-3 py-1.5 bg-blue-600 text-white rounded-lg hover:bg-blue-700 text-xs font-medium transition-colors"
                    >
                      <Package className="w-3.5 h-3.5" /> Generate Package
                    </button>
                  </div>
                  <div className="grid grid-cols-3 gap-3">
                    {assetItems.map(asset => {
                      const Icon = asset.icon;
                      return (
                        <div key={asset.id} className={`p-3.5 rounded-lg border transition-all hover:shadow-sm ${
                          asset.status === 'ready' ? 'bg-gray-50 border-gray-200' :
                          asset.status === 'generating' ? 'bg-blue-50 border-blue-200' :
                          'bg-red-50 border-red-200'
                        }`}>
                          <div className="flex items-start justify-between mb-2">
                            <div className={`p-2 rounded-lg ${asset.status === 'ready' ? 'bg-teal-100' : 'bg-blue-100'}`}>
                              <Icon className={`w-4 h-4 ${asset.status === 'ready' ? 'text-teal-600' : 'text-blue-600'}`} />
                            </div>
                            {asset.status === 'ready' ? (
                              <CheckCircle className="w-4 h-4 text-emerald-500" />
                            ) : asset.status === 'generating' ? (
                              <RefreshCw className="w-4 h-4 text-blue-500 animate-spin" />
                            ) : (
                              <AlertCircle className="w-4 h-4 text-red-500" />
                            )}
                          </div>
                          <p className="text-xs font-semibold text-gray-800 mb-0.5 truncate">{asset.type}</p>
                          <p className="text-xs text-gray-500 truncate">{asset.name}</p>
                          <div className="flex items-center justify-between mt-2">
                            <span className="text-xs text-gray-400">{asset.size}</span>
                            <button className="p-1 hover:bg-gray-200 rounded text-gray-500 hover:text-gray-700 transition-colors">
                              <Download className="w-3.5 h-3.5" />
                            </button>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                  {packageGenerated && (
                    <div className="mt-3 p-3 bg-emerald-50 border border-emerald-200 rounded-lg flex items-center gap-2">
                      <CheckCircle className="w-4 h-4 text-emerald-600 flex-shrink-0" />
                      <p className="text-xs text-emerald-700 font-medium">Publication package generated successfully — <span className="font-bold">publication-package-{manuscript.id}-v2.0.zip</span> (8.6 MB)</p>
                    </div>
                  )}
                </div>

                {/* Readiness Validation */}
                <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-5">
                  <div className="flex items-center justify-between mb-4">
                    <div className="flex items-center gap-2">
                      <Shield className="w-4 h-4 text-blue-600" />
                      <h2 className="text-sm font-semibold text-gray-900">Publication Readiness Validation</h2>
                    </div>
                    <div className="flex items-center gap-3">
                      <div className="flex items-center gap-1.5">
                        <span className="w-2.5 h-2.5 rounded-full bg-emerald-400 inline-block" />
                        <span className="text-xs text-gray-600">{passCount} Pass</span>
                      </div>
                      <div className="flex items-center gap-1.5">
                        <span className="w-2.5 h-2.5 rounded-full bg-amber-400 inline-block" />
                        <span className="text-xs text-gray-600">{warnCount} Warning</span>
                      </div>
                      <span className={`px-2 py-0.5 rounded-full text-xs font-bold ${overallReadiness >= 90 ? 'bg-emerald-100 text-emerald-700' : 'bg-amber-100 text-amber-700'}`}>
                        {overallReadiness}% Ready
                      </span>
                    </div>
                  </div>
                  <div className="space-y-3">
                    {validationItems.map(item => (
                      <div key={item.id} className={`p-3.5 rounded-lg border flex items-start gap-3 ${
                        item.status === 'pass' ? 'bg-emerald-50 border-emerald-100' :
                        item.status === 'warning' ? 'bg-amber-50 border-amber-100' :
                        'bg-red-50 border-red-100'
                      }`}>
                        {validIcon(item.status)}
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center justify-between mb-0.5">
                            <p className="text-xs font-semibold text-gray-800">{item.label}</p>
                            {item.score !== undefined && (
                              <span className={`text-xs font-bold ${item.score === 100 ? 'text-emerald-600' : item.score >= 80 ? 'text-amber-600' : 'text-red-600'}`}>
                                {item.score}%
                              </span>
                            )}
                          </div>
                          <p className="text-xs text-gray-600">{item.detail}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Publication Checklist */}
                <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-5">
                  <div className="flex items-center justify-between mb-4">
                    <div className="flex items-center gap-2">
                      <CheckCircle className="w-4 h-4 text-teal-600" />
                      <h2 className="text-sm font-semibold text-gray-900">Publication Checklist</h2>
                    </div>
                    <span className={`text-xs font-bold px-2 py-0.5 rounded-full ${
                      doneCount === checklistItems.length ? 'bg-emerald-100 text-emerald-700' : 'bg-amber-100 text-amber-700'
                    }`}>{doneCount}/{checklistItems.length} Complete</span>
                  </div>
                  <div className="grid grid-cols-2 gap-3">
                    {checklistItems.map(item => (
                      <div key={item.id} className={`flex items-start gap-3 p-3 rounded-lg border ${
                        item.done ? 'bg-emerald-50 border-emerald-100' : 'bg-gray-50 border-gray-200 border-dashed'
                      }`}>
                        <div className={`w-5 h-5 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5 ${
                          item.done ? 'bg-emerald-500' : 'bg-gray-200'
                        }`}>
                          {item.done && <CheckCircle className="w-3 h-3 text-white" />}
                        </div>
                        <p className={`text-xs ${item.done ? 'text-emerald-800 font-medium' : 'text-gray-500'}`}>
                          {item.label}
                        </p>
                        {!item.done && <span className="ml-auto text-xs text-amber-600 font-medium flex-shrink-0">Pending</span>}
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              {/* Right — Monitoring Panel (4 cols) */}
              <div className="col-span-4 space-y-5">

                {/* Publication Analytics */}
                <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-5">
                  <div className="flex items-center gap-2 mb-4">
                    <BarChart3 className="w-4 h-4 text-blue-600" />
                    <h3 className="text-sm font-semibold text-gray-900">Publication Analytics</h3>
                  </div>
                  <div className="grid grid-cols-2 gap-3">
                    {[
                      { label: 'Readiness Score', value: `${overallReadiness}%`, color: 'text-teal-600', bg: 'bg-teal-50' },
                      { label: 'Checklist', value: `${doneCount}/${checklistItems.length}`, color: 'text-blue-600', bg: 'bg-blue-50' },
                      { label: 'Assets Ready', value: `${assetItems.filter(a => a.status === 'ready').length}/${assetItems.length}`, color: 'text-emerald-600', bg: 'bg-emerald-50' },
                      { label: 'Days Remaining', value: `${daysToPublication}d`, color: 'text-indigo-600', bg: 'bg-indigo-50' },
                    ].map((stat, i) => (
                      <div key={i} className={`p-3 rounded-lg ${stat.bg} text-center border border-gray-100`}>
                        <p className={`text-xl font-bold ${stat.color}`}>{stat.value}</p>
                        <p className="text-xs text-gray-500 mt-0.5">{stat.label}</p>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Workflow Stages Progress */}
                <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-5">
                  <div className="flex items-center gap-2 mb-4">
                    <Activity className="w-4 h-4 text-teal-600" />
                    <h3 className="text-sm font-semibold text-gray-900">Workflow Progress</h3>
                  </div>
                  <div className="space-y-2.5">
                    {workflowStages.map((stage, i) => (
                      <div key={i}>
                        <div className="flex items-center justify-between mb-1">
                          <span className={`text-xs ${(stage as any).current ? 'text-teal-700 font-semibold' : stage.pct === 100 ? 'text-gray-500' : 'text-gray-400'}`}>
                            {stage.label}
                          </span>
                          <span className={`text-xs font-bold ${stage.pct === 100 ? 'text-emerald-600' : (stage as any).current ? 'text-teal-600' : 'text-gray-300'}`}>
                            {stage.pct}%
                          </span>
                        </div>
                        <div className="w-full bg-gray-100 rounded-full h-1.5">
                          <div
                            className={`h-1.5 rounded-full transition-all ${
                              stage.pct === 100 ? 'bg-emerald-400' :
                              (stage as any).current ? 'bg-teal-500' :
                              'bg-gray-200'
                            }`}
                            style={{ width: `${stage.pct}%` }}
                          />
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Final Production Statistics */}
                <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-5">
                  <div className="flex items-center gap-2 mb-3">
                    <TrendingUp className="w-4 h-4 text-indigo-600" />
                    <h3 className="text-sm font-semibold text-gray-900">Production Statistics</h3>
                  </div>
                  <div className="space-y-3 text-xs">
                    {[
                      { label: 'Total Workflow Days', value: '87 days' },
                      { label: 'Peer Reviews Completed', value: '3 reviews' },
                      { label: 'Revision Cycles', value: '2 cycles' },
                      { label: 'Proof Versions', value: 'v1.0 → v2.0' },
                      { label: 'TWG Members Involved', value: '6 specialists' },
                      { label: 'Validation Checks', value: '47 checks' },
                    ].map((stat, i) => (
                      <div key={i} className="flex items-center justify-between py-1.5 border-b border-gray-50 last:border-0">
                        <span className="text-gray-600">{stat.label}</span>
                        <span className="font-semibold text-gray-800">{stat.value}</span>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Bottleneck Alerts */}
                <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-5">
                  <div className="flex items-center gap-2 mb-3">
                    <Zap className="w-4 h-4 text-amber-500" />
                    <h3 className="text-sm font-semibold text-gray-900">Bottleneck Alerts</h3>
                  </div>
                  <div className="space-y-2.5">
                    <div className="p-3 bg-amber-50 border border-amber-100 rounded-lg flex items-start gap-2">
                      <AlertTriangle className="w-3.5 h-3.5 text-amber-500 flex-shrink-0 mt-0.5" />
                      <div>
                        <p className="text-xs font-semibold text-amber-800">COPE Compliance Item</p>
                        <p className="text-xs text-amber-700">Minor checklist gap expected to resolve by 17:00 today</p>
                      </div>
                    </div>
                    <div className="p-3 bg-blue-50 border border-blue-100 rounded-lg flex items-start gap-2">
                      <AlertCircle className="w-3.5 h-3.5 text-blue-500 flex-shrink-0 mt-0.5" />
                      <div>
                        <p className="text-xs font-semibold text-blue-800">Schedule Confirmation Pending</p>
                        <p className="text-xs text-blue-700">Final publication schedule awaits EIC confirmation in next stage</p>
                      </div>
                    </div>
                    <div className="p-3 bg-emerald-50 border border-emerald-100 rounded-lg flex items-start gap-2">
                      <CheckCircle className="w-3.5 h-3.5 text-emerald-500 flex-shrink-0 mt-0.5" />
                      <div>
                        <p className="text-xs font-semibold text-emerald-800">No Critical Blockers</p>
                        <p className="text-xs text-emerald-700">All required publication files validated and ready</p>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Publication Readiness Tracker */}
                <div className="bg-gradient-to-br from-teal-50 to-blue-50 rounded-xl border border-teal-200 shadow-sm p-5">
                  <div className="flex items-center gap-2 mb-3">
                    <Globe className="w-4 h-4 text-teal-600" />
                    <h3 className="text-sm font-semibold text-gray-900">Publication Readiness Tracker</h3>
                  </div>
                  <div className="text-center mb-3">
                    <p className="text-4xl font-bold text-teal-600">{overallReadiness}%</p>
                    <p className="text-xs text-gray-600">Overall Publication Readiness</p>
                  </div>
                  <div className="space-y-2">
                    {[
                      { label: 'Content & Formatting', pct: 100 },
                      { label: 'Legal & Compliance', pct: 88 },
                      { label: 'Technical Assets', pct: 100 },
                      { label: 'Metadata & DOI', pct: 100 },
                    ].map((item, i) => (
                      <div key={i}>
                        <div className="flex items-center justify-between text-xs mb-0.5">
                          <span className="text-gray-600">{item.label}</span>
                          <span className="font-semibold text-gray-800">{item.pct}%</span>
                        </div>
                        <div className="w-full bg-teal-100 rounded-full h-1.5">
                          <div className="bg-teal-500 h-1.5 rounded-full" style={{ width: `${item.pct}%` }} />
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
              <button onClick={() => setShowModal('prepare')} className="flex items-center gap-1.5 px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 text-sm transition-colors">
                <Package className="w-4 h-4" /> Prepare Publication Package
              </button>
              <button onClick={() => setShowModal('validate')} className="flex items-center gap-1.5 px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 text-sm transition-colors">
                <Shield className="w-4 h-4" /> Validate Publication Files
              </button>
              <button className="flex items-center gap-1.5 px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 text-sm transition-colors">
                <Users className="w-4 h-4" /> Notify Production Team
              </button>
            </div>
            <div className="flex items-center gap-3">
              <button onClick={() => setShowModal('generate')} className="flex items-center gap-1.5 px-4 py-2 bg-teal-600 text-white rounded-lg hover:bg-teal-700 text-sm font-medium transition-colors">
                <Database className="w-4 h-4" /> Generate Publication Archive
              </button>
              <button
                onClick={() => setShowModal('send_timeline')}
                className="flex items-center gap-1.5 px-5 py-2 bg-blue-700 text-white rounded-lg hover:bg-blue-800 text-sm font-medium transition-colors"
              >
                Send to Final Timeline Confirmation <ArrowRight className="w-4 h-4" />
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
              showModal === 'send_timeline' ? 'bg-blue-100' :
              showModal === 'validate' ? 'bg-teal-100' :
              'bg-emerald-100'
            }`}>
              {showModal === 'send_timeline' ? <ArrowRight className="w-6 h-6 text-blue-600" /> :
               showModal === 'validate' ? <Shield className="w-6 h-6 text-teal-600" /> :
               <Package className="w-6 h-6 text-emerald-600" />}
            </div>
            <h3 className="text-lg font-bold text-gray-900 text-center mb-2">
              {showModal === 'prepare' && 'Prepare Publication Package'}
              {showModal === 'generate' && 'Generate Publication Archive'}
              {showModal === 'validate' && 'Validate Publication Files'}
              {showModal === 'send_timeline' && 'Send to Final Timeline Confirmation'}
              {showModal === 'notify' && 'Notify Production Team'}
            </h3>
            <p className="text-sm text-gray-600 text-center mb-4">
              {showModal === 'prepare' && 'Compile all publication assets into a final preparation package for quality check and archive generation.'}
              {showModal === 'generate' && 'Generate a complete publication archive bundle (PDF/A, EPUB, XML) ready for repository submission.'}
              {showModal === 'validate' && 'Run automated validation checks on all publication files to confirm publication compliance standards.'}
              {showModal === 'send_timeline' && 'Advance this manuscript to the Final Publication Timeline Confirmation stage for EIC schedule review and release approval.'}
              {showModal === 'notify' && 'Send publication preparation status notification to the production team and TWG coordinator.'}
            </p>
            <div className="flex gap-3">
              <button onClick={() => setShowModal(null)} className="flex-1 px-4 py-2.5 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 text-sm font-medium">Cancel</button>
              <button
                onClick={handleConfirm}
                className={`flex-1 px-4 py-2.5 text-white rounded-lg text-sm font-medium ${
                  showModal === 'send_timeline' ? 'bg-blue-700 hover:bg-blue-800' : 'bg-teal-600 hover:bg-teal-700'
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
