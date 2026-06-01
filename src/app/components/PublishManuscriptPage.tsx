import React, { useState } from 'react';
import type { Manuscript } from '../types';
import {
  ChevronLeft, ChevronRight,
  Bell, FileText, CheckCircle, XCircle, AlertTriangle, AlertCircle,
  Clock, Activity, BarChart3, Settings, RefreshCw,
  Download, Send, BookOpen, Calendar, Eye, Home,
  TrendingUp, Package, Globe, Database,
  Award, Shield, Zap, ArrowRight, Users, Target,
} from 'lucide-react';

interface PublishManuscriptPageProps {
  manuscript: Manuscript;
  onBack: () => void;
}

type ActiveNav = 'dashboard' | 'workflow' | 'queue' | 'preparation' | 'timeline' | 'reports' | 'notifications' | 'settings';
type PublishState = 'ready' | 'publishing' | 'published';
type ModalAction = 'publish' | 'certificate' | null;

interface ProcessingStep {
  id: string;
  label: string;
  status: 'complete' | 'active' | 'pending';
  progress: number;
  detail: string;
  timestamp?: string;
}

interface DistributionChannel {
  name: string;
  icon: React.ComponentType<{ className?: string }>;
  status: 'live' | 'syncing' | 'queued';
  url?: string;
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

const processingStepsPublished: ProcessingStep[] = [
  { id: 'p1', label: 'Publication Deployment', status: 'complete', progress: 100, detail: 'All publication files deployed to servers', timestamp: '14:23:07' },
  { id: 'p2', label: 'Archive Generation', status: 'complete', progress: 100, detail: 'PDF/A-3b, EPUB 3.0, XML bundle archived', timestamp: '14:23:14' },
  { id: 'p3', label: 'Metadata Indexing', status: 'complete', progress: 100, detail: 'Dublin Core, CrossRef, OpenAIRE records indexed', timestamp: '14:23:51' },
  { id: 'p4', label: 'DOI Registration', status: 'complete', progress: 100, detail: 'DOI 10.1234/ajr.2024.001 registered with CrossRef', timestamp: '14:24:03' },
  { id: 'p5', label: 'Repository Sync', status: 'complete', progress: 100, detail: 'Synced to PubMed, SCOPUS, Web of Science', timestamp: '14:24:18' },
  { id: 'p6', label: 'Website Publication', status: 'complete', progress: 100, detail: 'Article page live at journal website', timestamp: '14:24:22' },
  { id: 'p7', label: 'Notification Dispatch', status: 'complete', progress: 100, detail: 'Author, editor, and subscriber notifications sent', timestamp: '14:24:35' },
];

const processingStepsPublishing: ProcessingStep[] = [
  { id: 'p1', label: 'Publication Deployment', status: 'complete', progress: 100, detail: 'All publication files deployed', timestamp: '14:23:07' },
  { id: 'p2', label: 'Archive Generation', status: 'complete', progress: 100, detail: 'Bundle archived successfully', timestamp: '14:23:14' },
  { id: 'p3', label: 'Metadata Indexing', status: 'active', progress: 72, detail: 'Indexing records across 4 registries…' },
  { id: 'p4', label: 'DOI Registration', status: 'complete', progress: 100, detail: 'DOI registered with CrossRef', timestamp: '14:24:03' },
  { id: 'p5', label: 'Repository Sync', status: 'active', progress: 45, detail: 'Syncing to external repositories…' },
  { id: 'p6', label: 'Website Publication', status: 'pending', progress: 0, detail: 'Awaiting metadata indexing' },
  { id: 'p7', label: 'Notification Dispatch', status: 'pending', progress: 0, detail: 'Queued — will dispatch after website live' },
];

const channels: DistributionChannel[] = [
  { name: 'Journal Website', icon: Globe, status: 'live', url: 'journal.academic-press.org' },
  { name: 'PubMed Central', icon: Database, status: 'live' },
  { name: 'SCOPUS', icon: Database, status: 'syncing' },
  { name: 'Web of Science', icon: Database, status: 'syncing' },
  { name: 'OpenAIRE', icon: Globe, status: 'live' },
  { name: 'Institutional Repository', icon: Database, status: 'queued' },
];

const workflowCompletion = [
  { label: 'Submission → Acceptance', pct: 100, color: 'bg-emerald-400' },
  { label: 'Production Workflow', pct: 100, color: 'bg-teal-500' },
  { label: 'Publication Preparation', pct: 100, color: 'bg-blue-500' },
  { label: 'Distribution & Indexing', pct: 85, color: 'bg-indigo-500' },
];

export function PublishManuscriptPage({ manuscript, onBack }: PublishManuscriptPageProps) {
  const [activeNav, setActiveNav] = useState<ActiveNav>('preparation');
  const [publishState, setPublishState] = useState<PublishState>('ready');
  const [showModal, setShowModal] = useState<ModalAction>(null);
  const [certificateGenerated, setCertificateGenerated] = useState(false);

  const publicationDate = new Date();
  const doi = `10.1234/ajr.2024.${manuscript.id}`;
  const isbnNumber = '978-3-16-148410-0';
  const pubUrl = `https://journal.academic-press.org/articles/${doi.replace(/\//g, '-')}`;
  const processingSteps = publishState === 'published' ? processingStepsPublished :
                          publishState === 'publishing' ? processingStepsPublishing :
                          processingStepsPublished.map(s => ({ ...s, status: 'pending' as const, progress: 0, timestamp: undefined }));

  const handlePublish = () => {
    setShowModal(null);
    setPublishState('publishing');
    setTimeout(() => setPublishState('published'), 2000);
  };

  const handleCertificate = () => {
    setCertificateGenerated(true);
    setShowModal(null);
  };

  const overallProgress = publishState === 'published' ? 100 :
                          publishState === 'publishing' ? Math.round(processingStepsPublishing.reduce((s, p) => s + p.progress, 0) / processingStepsPublishing.length) :
                          0;

  return (
    <div className="flex h-screen bg-gray-50 overflow-hidden">
      {/* Sidebar */}
      <aside className="w-64 bg-[#0f2744] flex-shrink-0 flex flex-col">
        <div className="px-5 py-5 border-b border-white/10">
          <div className="flex items-center gap-3">
            <div className={`w-9 h-9 rounded-lg flex items-center justify-center transition-colors ${
              publishState === 'published' ? 'bg-emerald-500' : publishState === 'publishing' ? 'bg-blue-500' : 'bg-indigo-500'
            }`}>
              <Globe className="w-5 h-5 text-white" />
            </div>
            <div>
              <p className="text-white text-sm font-semibold">MMS Editor Portal</p>
              <p className={`text-xs ${publishState === 'published' ? 'text-emerald-300' : 'text-indigo-300'}`}>
                {publishState === 'published' ? 'Published ✓' : publishState === 'publishing' ? 'Publishing…' : 'Publish Manuscript'}
              </p>
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
                    ? publishState === 'published' ? 'bg-emerald-600 text-white font-medium' : 'bg-indigo-600 text-white font-medium'
                    : 'text-blue-200 hover:bg-white/10 hover:text-white'
                }`}
              >
                <Icon className="w-4 h-4 flex-shrink-0" />
                <span className="text-sm">{item.label}</span>
              </button>
            );
          })}
        </nav>

        <div className="px-4 py-4 border-t border-white/10 space-y-2">
          <p className="text-xs text-blue-300 font-medium uppercase tracking-wider">Publication Status</p>
          <div className="flex items-center gap-2">
            <div className="flex-1 bg-white/10 rounded-full h-2">
              <div
                className={`h-2 rounded-full transition-all duration-1000 ${publishState === 'published' ? 'bg-emerald-400' : 'bg-blue-400'}`}
                style={{ width: `${overallProgress}%` }}
              />
            </div>
            <span className="text-xs font-bold text-white">{overallProgress}%</span>
          </div>
          <div className="flex items-center gap-2 text-xs">
            <span className={`w-2.5 h-2.5 rounded-full flex-shrink-0 ${
              publishState === 'published' ? 'bg-emerald-400' :
              publishState === 'publishing' ? 'bg-blue-400 animate-pulse' :
              'bg-gray-500'
            }`} />
            <span className={`font-semibold ${
              publishState === 'published' ? 'text-emerald-300' :
              publishState === 'publishing' ? 'text-blue-300' :
              'text-gray-400'
            }`}>
              {publishState === 'published' ? 'LIVE — Published' : publishState === 'publishing' ? 'Publishing in Progress' : 'Ready to Publish'}
            </span>
          </div>
          <p className="text-xs text-blue-300">DOI: {doi}</p>
        </div>
      </aside>

      {/* Main */}
      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Header */}
        <header className={`border-b px-6 py-3 flex-shrink-0 z-10 transition-colors ${
          publishState === 'published'
            ? 'bg-gradient-to-r from-emerald-600 to-teal-600 border-emerald-500'
            : 'bg-white border-gray-200'
        }`}>
          <div className="flex items-center justify-between gap-4">
            <div className="flex items-center gap-3 min-w-0">
              <button onClick={onBack} className={`p-1.5 rounded-lg flex-shrink-0 ${publishState === 'published' ? 'hover:bg-white/20' : 'hover:bg-gray-100'}`}>
                <ChevronLeft className={`w-5 h-5 ${publishState === 'published' ? 'text-white' : 'text-gray-600'}`} />
              </button>
              <div className="min-w-0">
                <div className="flex items-center gap-2">
                  <h1 className={`text-base font-bold ${publishState === 'published' ? 'text-white' : 'text-gray-900'}`}>Publish Manuscript</h1>
                  <ChevronRight className={`w-3.5 h-3.5 ${publishState === 'published' ? 'text-white/60' : 'text-gray-400'}`} />
                  <span className={`text-xs font-mono px-2 py-0.5 rounded ${publishState === 'published' ? 'bg-white/20 text-white' : 'bg-gray-100 text-gray-500'}`}>{manuscript.id}</span>
                </div>
                <p className={`text-xs mt-0.5 truncate max-w-lg ${publishState === 'published' ? 'text-emerald-100' : 'text-gray-500'}`}>{manuscript.title}</p>
              </div>
            </div>
            <div className="flex items-center gap-3 flex-shrink-0">
              {publishState === 'published' ? (
                <>
                  <span className="flex items-center gap-1.5 px-3 py-1.5 bg-white text-emerald-700 rounded-full text-xs font-bold shadow">
                    <CheckCircle className="w-3.5 h-3.5" /> PUBLISHED
                  </span>
                  <span className="text-white/80 text-xs">{publicationDate.toLocaleTimeString()}</span>
                </>
              ) : publishState === 'publishing' ? (
                <span className="flex items-center gap-1.5 px-3 py-1.5 bg-blue-100 text-blue-800 rounded-full text-xs font-semibold animate-pulse">
                  <RefreshCw className="w-3.5 h-3.5 animate-spin" /> Publishing…
                </span>
              ) : (
                <span className="flex items-center gap-1.5 px-3 py-1.5 bg-indigo-100 text-indigo-800 rounded-full text-xs font-semibold">
                  <Clock className="w-3.5 h-3.5" /> Ready to Publish
                </span>
              )}
              <div className="w-8 h-8 rounded-full bg-white/20 border-2 border-white/40 flex items-center justify-center text-white text-xs font-bold">EIC</div>
            </div>
          </div>
        </header>

        {/* Content */}
        <div className="flex-1 overflow-y-auto p-6">
          <div className="max-w-[1400px] mx-auto space-y-6">

            {/* Published status banner */}
            {publishState === 'published' && (
              <div className="bg-gradient-to-r from-emerald-600 to-teal-600 rounded-xl p-5 text-white shadow-lg">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 bg-white/20 rounded-full flex items-center justify-center">
                      <CheckCircle className="w-7 h-7 text-white" />
                    </div>
                    <div>
                      <p className="text-xs text-emerald-100 font-medium uppercase tracking-wider mb-1">Publication Successful</p>
                      <h2 className="text-lg font-bold">This manuscript is now publicly available</h2>
                      <p className="text-sm text-emerald-100 mt-0.5">Published {publicationDate.toLocaleString()} · DOI: {doi}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    <a href="#" className="flex items-center gap-1.5 px-4 py-2 bg-white text-emerald-700 rounded-lg hover:bg-emerald-50 text-sm font-medium transition-colors">
                      <Eye className="w-4 h-4" /> View Published Article
                    </a>
                  </div>
                </div>
              </div>
            )}

            {/* Breadcrumb */}
            <div className="flex items-center gap-1 overflow-x-auto pb-1">
              {['Submission', 'Review', 'Copyediting', 'Layout', 'Proof Review', 'Approval', 'Pub Prep', 'Timeline', 'Publish ●'].map((step, i) => (
                <React.Fragment key={i}>
                  <span className={`text-xs px-2.5 py-1 rounded-full whitespace-nowrap font-medium ${
                    i < 8 ? 'bg-emerald-100 text-emerald-700' : 'bg-emerald-600 text-white'
                  }`}>{step}</span>
                  {i < 8 && <ChevronRight className="w-3.5 h-3.5 text-gray-300 flex-shrink-0" />}
                </React.Fragment>
              ))}
            </div>

            {/* Final Publication Summary */}
            <div className={`rounded-xl border shadow-sm p-5 ${publishState === 'published' ? 'bg-white border-emerald-200' : 'bg-white border-gray-200'}`}>
              <div className="flex items-center gap-2 mb-4">
                <Award className="w-4 h-4 text-emerald-600" />
                <h2 className="text-sm font-semibold text-gray-900">Final Publication Summary</h2>
                <span className={`ml-auto px-3 py-1 rounded-full text-xs font-bold ${
                  publishState === 'published' ? 'bg-emerald-600 text-white' :
                  publishState === 'publishing' ? 'bg-blue-100 text-blue-700' :
                  'bg-indigo-100 text-indigo-700'
                }`}>
                  {publishState === 'published' ? '✓ PUBLISHED' : publishState === 'publishing' ? 'Publishing…' : 'Ready to Publish'}
                </span>
              </div>
              <div className="grid grid-cols-5 gap-4">
                <div className="col-span-2">
                  <p className="text-xs text-gray-500 mb-0.5">Manuscript Title</p>
                  <p className="text-sm font-semibold text-gray-900 leading-snug">{manuscript.title}</p>
                </div>
                <div>
                  <p className="text-xs text-gray-500 mb-0.5">Author(s)</p>
                  <p className="text-sm text-gray-800">{manuscript.authorName}</p>
                </div>
                <div>
                  <p className="text-xs text-gray-500 mb-0.5">Publication Issue</p>
                  <p className="text-sm text-gray-800">Vol. 14, No. 2</p>
                </div>
                <div>
                  <p className="text-xs text-gray-500 mb-0.5">Category</p>
                  <span className="px-2 py-0.5 bg-blue-100 text-blue-700 text-xs rounded-full font-medium">{manuscript.category}</span>
                </div>
                <div>
                  <p className="text-xs text-gray-500 mb-0.5">ISBN-13</p>
                  <p className="text-xs font-mono text-gray-800">{isbnNumber}</p>
                </div>
                <div>
                  <p className="text-xs text-gray-500 mb-0.5">DOI</p>
                  <p className="text-xs font-mono text-blue-700">{doi}</p>
                </div>
                <div>
                  <p className="text-xs text-gray-500 mb-0.5">Release Date</p>
                  <p className="text-sm font-semibold text-emerald-700">{publicationDate.toLocaleDateString()}</p>
                </div>
                <div className="col-span-2">
                  <p className="text-xs text-gray-500 mb-0.5">Publication URL</p>
                  <p className="text-xs font-mono text-blue-600 truncate">{pubUrl}</p>
                </div>
              </div>
            </div>

            <div className="grid grid-cols-12 gap-6">
              {/* Left: Release Workspace + Confirmation (8 cols) */}
              <div className="col-span-8 space-y-5">

                {/* Publication Release Workspace */}
                <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-5">
                  <div className="flex items-center gap-2 mb-4">
                    <Package className="w-4 h-4 text-blue-600" />
                    <h2 className="text-sm font-semibold text-gray-900">Publication Release Workspace</h2>
                  </div>
                  <div className="grid grid-cols-3 gap-3">
                    {[
                      { label: 'Final Publication Package', icon: Package, desc: 'Complete publication bundle', size: '8.6 MB', format: 'ZIP', ready: true },
                      { label: 'Digital Archive Preview', icon: Database, desc: 'PDF/A-3b + EPUB 3.0', size: '6.8 MB', format: 'PDF/EPUB', ready: true },
                      { label: 'Journal Website Preview', icon: Globe, desc: 'Online article page', size: 'Live', format: 'HTML', ready: publishState === 'published' },
                      { label: 'Downloadable Manuscript', icon: FileText, desc: 'Author-facing download', size: '4.7 MB', format: 'PDF', ready: true },
                      { label: 'Metadata Record', icon: Shield, desc: 'Dublin Core + CrossRef XML', size: '0.1 MB', format: 'XML', ready: true },
                      { label: 'Repository Distribution', icon: Database, desc: 'Multi-repository sync pack', size: '9.1 MB', format: 'Bundle', ready: publishState === 'published' },
                    ].map((item, i) => {
                      const Icon = item.icon;
                      return (
                        <div key={i} className={`p-3.5 rounded-lg border transition-all ${
                          item.ready ? 'bg-gray-50 border-gray-200 hover:shadow-sm' : 'bg-gray-50 border-dashed border-gray-200 opacity-60'
                        }`}>
                          <div className="flex items-start justify-between mb-2">
                            <div className={`p-2 rounded-lg ${item.ready ? 'bg-teal-100' : 'bg-gray-100'}`}>
                              <Icon className={`w-4 h-4 ${item.ready ? 'text-teal-600' : 'text-gray-400'}`} />
                            </div>
                            {item.ready
                              ? <CheckCircle className="w-4 h-4 text-emerald-500" />
                              : <Clock className="w-4 h-4 text-gray-300" />
                            }
                          </div>
                          <p className="text-xs font-semibold text-gray-800 mb-0.5">{item.label}</p>
                          <p className="text-xs text-gray-500">{item.desc}</p>
                          <div className="flex items-center justify-between mt-2">
                            <span className="text-xs text-gray-400">{item.size} · {item.format}</span>
                            {item.ready && (
                              <button className="p-1 hover:bg-gray-200 rounded text-gray-500 transition-colors">
                                <Download className="w-3.5 h-3.5" />
                              </button>
                            )}
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>

                {/* Automated System Processing */}
                <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-5">
                  <div className="flex items-center justify-between mb-4">
                    <div className="flex items-center gap-2">
                      <Zap className="w-4 h-4 text-amber-500" />
                      <h2 className="text-sm font-semibold text-gray-900">Automated System Processing</h2>
                    </div>
                    <span className={`text-xs px-2.5 py-1 rounded-full font-semibold ${
                      publishState === 'published' ? 'bg-emerald-100 text-emerald-700' :
                      publishState === 'publishing' ? 'bg-blue-100 text-blue-700 animate-pulse' :
                      'bg-gray-100 text-gray-500'
                    }`}>
                      {publishState === 'published' ? 'All Systems Complete' : publishState === 'publishing' ? 'Processing…' : 'Awaiting Publish Command'}
                    </span>
                  </div>
                  <div className="space-y-3">
                    {processingSteps.map(step => (
                      <div key={step.id} className={`p-3.5 rounded-lg border ${
                        step.status === 'complete' ? 'bg-emerald-50 border-emerald-100' :
                        step.status === 'active' ? 'bg-blue-50 border-blue-100' :
                        'bg-gray-50 border-gray-100'
                      }`}>
                        <div className="flex items-start gap-3">
                          <div className={`w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 ${
                            step.status === 'complete' ? 'bg-emerald-500' :
                            step.status === 'active' ? 'bg-blue-500' :
                            'bg-gray-200'
                          }`}>
                            {step.status === 'complete' ? (
                              <CheckCircle className="w-4 h-4 text-white" />
                            ) : step.status === 'active' ? (
                              <RefreshCw className="w-4 h-4 text-white animate-spin" />
                            ) : (
                              <Clock className="w-4 h-4 text-gray-400" />
                            )}
                          </div>
                          <div className="flex-1 min-w-0">
                            <div className="flex items-center justify-between mb-1">
                              <p className={`text-xs font-semibold ${
                                step.status === 'complete' ? 'text-emerald-800' :
                                step.status === 'active' ? 'text-blue-800' :
                                'text-gray-500'
                              }`}>{step.label}</p>
                              <div className="flex items-center gap-2">
                                {step.timestamp && (
                                  <span className="text-xs text-gray-400 font-mono">{step.timestamp}</span>
                                )}
                                <span className={`text-xs font-bold ${
                                  step.status === 'complete' ? 'text-emerald-600' :
                                  step.status === 'active' ? 'text-blue-600' :
                                  'text-gray-400'
                                }`}>{step.progress}%</span>
                              </div>
                            </div>
                            <p className="text-xs text-gray-600 mb-1.5">{step.detail}</p>
                            <div className="w-full bg-white/70 rounded-full h-1.5">
                              <div
                                className={`h-1.5 rounded-full transition-all duration-700 ${
                                  step.status === 'complete' ? 'bg-emerald-500' :
                                  step.status === 'active' ? 'bg-blue-500 animate-pulse' :
                                  'bg-gray-200'
                                }`}
                                style={{ width: `${step.progress}%` }}
                              />
                            </div>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Publication Confirmation */}
                {publishState === 'published' && (
                  <div className="bg-white rounded-xl border border-emerald-200 shadow-sm p-5">
                    <div className="flex items-center gap-2 mb-4">
                      <CheckCircle className="w-4 h-4 text-emerald-600" />
                      <h2 className="text-sm font-semibold text-gray-900">Publication Confirmation</h2>
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                      {[
                        { label: 'Publication Timestamp', value: publicationDate.toLocaleString() },
                        { label: 'Release Verification', value: 'SHA-256 hash confirmed' },
                        { label: 'Public Accessibility', value: 'Open Access — CC BY-NC 4.0' },
                        { label: 'Citation Indexing', value: 'CrossRef · Scopus (pending 48h)' },
                      ].map((item, i) => (
                        <div key={i} className="p-3 bg-emerald-50 rounded-lg border border-emerald-100">
                          <p className="text-xs text-emerald-600 font-medium mb-0.5">{item.label}</p>
                          <p className="text-xs font-semibold text-gray-800">{item.value}</p>
                        </div>
                      ))}
                      <div className="col-span-2 p-3 bg-blue-50 rounded-lg border border-blue-100">
                        <p className="text-xs text-blue-600 font-medium mb-0.5">Publication URL</p>
                        <p className="text-xs font-mono text-blue-800 break-all">{pubUrl}</p>
                      </div>
                    </div>
                    {certificateGenerated && (
                      <div className="mt-3 p-3 bg-amber-50 border border-amber-200 rounded-lg flex items-center gap-2">
                        <Award className="w-4 h-4 text-amber-600 flex-shrink-0" />
                        <p className="text-xs text-amber-700 font-medium">Publication Certificate generated — <span className="font-bold">pub-cert-{manuscript.id}-{new Date().getFullYear()}.pdf</span></p>
                      </div>
                    )}
                  </div>
                )}
              </div>

              {/* Right: Distribution + Analytics (4 cols) */}
              <div className="col-span-4 space-y-5">

                {/* Distribution Channels */}
                <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-5">
                  <div className="flex items-center gap-2 mb-3">
                    <Globe className="w-4 h-4 text-teal-600" />
                    <h3 className="text-sm font-semibold text-gray-900">Distribution Channels</h3>
                  </div>
                  <div className="space-y-2.5">
                    {channels.map((ch, i) => {
                      const Icon = ch.icon;
                      return (
                        <div key={i} className="flex items-center gap-3 p-2.5 rounded-lg bg-gray-50 border border-gray-100">
                          <div className="p-1.5 bg-white rounded-lg border border-gray-200">
                            <Icon className="w-4 h-4 text-gray-600" />
                          </div>
                          <div className="flex-1 min-w-0">
                            <p className="text-xs font-medium text-gray-800">{ch.name}</p>
                            {ch.url && <p className="text-xs text-gray-400 truncate">{ch.url}</p>}
                          </div>
                          <span className={`text-xs font-bold px-2 py-0.5 rounded-full flex-shrink-0 ${
                            ch.status === 'live' ? 'bg-emerald-100 text-emerald-700' :
                            ch.status === 'syncing' ? 'bg-blue-100 text-blue-700' :
                            'bg-gray-100 text-gray-500'
                          }`}>
                            {ch.status === 'live' ? '● Live' : ch.status === 'syncing' ? '↺ Sync' : '○ Queued'}
                          </span>
                        </div>
                      );
                    })}
                  </div>
                </div>

                {/* Workflow Completion Analytics */}
                <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-5">
                  <div className="flex items-center gap-2 mb-3">
                    <BarChart3 className="w-4 h-4 text-indigo-600" />
                    <h3 className="text-sm font-semibold text-gray-900">Workflow Completion Analytics</h3>
                  </div>
                  <div className="text-center mb-4">
                    <p className="text-5xl font-black text-emerald-600">{overallProgress}<span className="text-2xl">%</span></p>
                    <p className="text-xs text-gray-500 mt-0.5">Publication Complete</p>
                  </div>
                  <div className="space-y-2.5">
                    {workflowCompletion.map((item, i) => (
                      <div key={i}>
                        <div className="flex items-center justify-between text-xs mb-1">
                          <span className="text-gray-600">{item.label}</span>
                          <span className="font-bold text-gray-800">{item.pct}%</span>
                        </div>
                        <div className="w-full bg-gray-100 rounded-full h-2">
                          <div className={`${item.color} h-2 rounded-full`} style={{ width: `${item.pct}%` }} />
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Publication Metrics */}
                <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-5">
                  <div className="flex items-center gap-2 mb-3">
                    <TrendingUp className="w-4 h-4 text-blue-600" />
                    <h3 className="text-sm font-semibold text-gray-900">Publication Metrics</h3>
                  </div>
                  <div className="grid grid-cols-2 gap-3">
                    {[
                      { label: 'Total Workflow', value: '87 days', color: 'text-gray-700' },
                      { label: 'Release Success', value: '100%', color: 'text-emerald-600' },
                      { label: 'Channels Live', value: `${channels.filter(c => c.status === 'live').length}/${channels.length}`, color: 'text-teal-600' },
                      { label: 'Pub Version', value: 'v2.0-final', color: 'text-blue-600' },
                    ].map((stat, i) => (
                      <div key={i} className="p-3 bg-gray-50 rounded-lg border border-gray-100 text-center">
                        <p className={`text-base font-bold ${stat.color}`}>{stat.value}</p>
                        <p className="text-xs text-gray-500">{stat.label}</p>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Final notification dispatch */}
                <div className={`rounded-xl border shadow-sm p-5 ${publishState === 'published' ? 'bg-emerald-50 border-emerald-200' : 'bg-gray-50 border-gray-200'}`}>
                  <div className="flex items-center gap-2 mb-3">
                    <Send className="w-4 h-4 text-emerald-600" />
                    <h3 className="text-sm font-semibold text-gray-900">Notification Status</h3>
                  </div>
                  <div className="space-y-2">
                    {[
                      { to: `Author (${manuscript.authorName})`, status: publishState === 'published' },
                      { to: 'Editor (Dr. S. Mitchell)', status: publishState === 'published' },
                      { to: 'Editor in Chief', status: publishState === 'published' },
                      { to: 'Journal Subscribers', status: publishState === 'published' },
                    ].map((notif, i) => (
                      <div key={i} className="flex items-center justify-between text-xs">
                        <span className="text-gray-600">{notif.to}</span>
                        <span className={`font-semibold ${notif.status ? 'text-emerald-600' : 'text-gray-400'}`}>
                          {notif.status ? '✓ Sent' : '○ Pending'}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom Action Bar */}
        <div className={`border-t px-6 py-4 flex-shrink-0 ${publishState === 'published' ? 'bg-emerald-50 border-emerald-200' : 'bg-white border-gray-200'}`}>
          <div className="flex items-center justify-between max-w-[1400px] mx-auto">
            <div className="flex items-center gap-2">
              <button className="flex items-center gap-1.5 px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 text-sm transition-colors">
                <Download className="w-4 h-4" /> Download Publication Archive
              </button>
              {publishState === 'published' && (
                <button
                  onClick={() => setShowModal('certificate')}
                  className="flex items-center gap-1.5 px-4 py-2 border border-amber-300 text-amber-700 bg-amber-50 rounded-lg hover:bg-amber-100 text-sm transition-colors"
                >
                  <Award className="w-4 h-4" /> Generate Publication Certificate
                </button>
              )}
              {publishState === 'published' && (
                <button className="flex items-center gap-1.5 px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 text-sm transition-colors">
                  <Send className="w-4 h-4" /> Notify Authors &amp; Editors
                </button>
              )}
            </div>
            <div className="flex items-center gap-3">
              {publishState === 'published' && (
                <button className="flex items-center gap-1.5 px-4 py-2 bg-white border border-emerald-300 text-emerald-700 rounded-lg hover:bg-emerald-50 text-sm font-medium transition-colors">
                  <Eye className="w-4 h-4" /> View Published Manuscript
                </button>
              )}
              {publishState !== 'published' && (
                <button
                  onClick={() => setShowModal('publish')}
                  disabled={publishState === 'publishing'}
                  className="flex items-center gap-1.5 px-6 py-2.5 bg-emerald-600 text-white rounded-lg hover:bg-emerald-700 text-sm font-bold transition-colors disabled:opacity-60 disabled:cursor-not-allowed shadow-lg shadow-emerald-200"
                >
                  <Globe className="w-5 h-5" />
                  {publishState === 'publishing' ? 'Publishing…' : 'Publish Manuscript'}
                </button>
              )}
              {publishState === 'published' && (
                <div className="flex items-center gap-2 px-5 py-2.5 bg-emerald-600 text-white rounded-lg text-sm font-bold">
                  <CheckCircle className="w-5 h-5" /> Manuscript Published Successfully
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl shadow-2xl max-w-md w-full p-6">
            <div className={`w-14 h-14 rounded-full flex items-center justify-center mx-auto mb-4 ${
              showModal === 'publish' ? 'bg-emerald-100' : 'bg-amber-100'
            }`}>
              {showModal === 'publish' ? <Globe className="w-7 h-7 text-emerald-600" /> : <Award className="w-7 h-7 text-amber-600" />}
            </div>
            <h3 className="text-xl font-bold text-gray-900 text-center mb-2">
              {showModal === 'publish' ? 'Publish Manuscript' : 'Generate Publication Certificate'}
            </h3>
            <p className="text-sm text-gray-600 text-center mb-4">
              {showModal === 'publish'
                ? 'This will initiate the final publication process. The manuscript will be deployed to all registered repositories, indexed, and made publicly accessible. This action cannot be undone.'
                : 'Generate an official publication certificate for this manuscript including DOI, publication metadata, and institutional seals.'}
            </p>
            {showModal === 'publish' && (
              <div className="mb-4 p-3 bg-blue-50 border border-blue-200 rounded-lg text-xs text-blue-700 space-y-1">
                <p><strong>Manuscript:</strong> {manuscript.title}</p>
                <p><strong>DOI:</strong> {doi}</p>
                <p><strong>Distribution:</strong> {channels.length} channels</p>
                <p><strong>This action is final and irreversible.</strong></p>
              </div>
            )}
            <div className="flex gap-3">
              <button onClick={() => setShowModal(null)} className="flex-1 px-4 py-2.5 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 text-sm font-medium">Cancel</button>
              <button
                onClick={showModal === 'publish' ? handlePublish : handleCertificate}
                className={`flex-1 px-4 py-2.5 text-white rounded-lg text-sm font-bold ${
                  showModal === 'publish' ? 'bg-emerald-600 hover:bg-emerald-700' : 'bg-amber-600 hover:bg-amber-700'
                }`}
              >
                {showModal === 'publish' ? 'Publish Now' : 'Generate Certificate'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
