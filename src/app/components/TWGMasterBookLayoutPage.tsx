import React, { useState } from 'react';
import {
  LayoutDashboard,
  ListOrdered,
  FileText,
  Scissors,
  MonitorCheck,
  BookMarked,
  Printer,
  BookOpen,
  Clock,
  Bell,
  BarChart3,
  Settings,
  Search,
  ChevronRight,
  ChevronDown,
  ChevronLeft,
  ZoomIn,
  ZoomOut,
  Maximize2,
  GitCompare,
  Columns2,
  MessageCircle,
  CheckCircle,
  AlertTriangle,
  AlertCircle,
  XCircle,
  Download,
  Send,
  Lock,
  RotateCcw,
  ThumbsUp,
  Upload,
  Eye,
  Layers,
  Hash,
  Image,
  AlignLeft,
  Calendar,
  TrendingUp,
  TrendingDown,
  Activity,
  User,
  LogOut,
  Info,
  Star,
  StickyNote,
  Tag,
} from 'lucide-react';
import type { Manuscript } from '../types';

interface TWGMasterBookLayoutPageProps {
  manuscript: Manuscript;
  onBack: () => void;
}

type ActiveNav = 'dashboard' | 'queue' | 'assigned' | 'copyediting' | 'monitoring' | 'master_layout' | 'proof' | 'publication' | 'timeline' | 'notifications' | 'reports' | 'settings';
type PreviewSection = 'cover' | 'prelims' | 'toc' | 'chapter' | 'figures';
type LayoutDecision = 'approve' | 'return' | 'send_proof' | null;

const sidebarItems = [
  { id: 'dashboard' as const, label: 'Dashboard', icon: LayoutDashboard },
  { id: 'queue' as const, label: 'Production Queue', icon: ListOrdered, badge: 4 },
  { id: 'assigned' as const, label: 'Assigned Manuscripts', icon: FileText },
  { id: 'copyediting' as const, label: 'Copyediting Review', icon: Scissors },
  { id: 'monitoring' as const, label: 'Layout Monitoring', icon: MonitorCheck },
  { id: 'master_layout' as const, label: 'Master Book Layout', icon: BookMarked },
  { id: 'proof' as const, label: 'Proof Generation', icon: Printer },
  { id: 'publication' as const, label: 'Publication Preparation', icon: BookOpen },
  { id: 'timeline' as const, label: 'Timeline Monitoring', icon: Clock },
  { id: 'notifications' as const, label: 'Notifications', icon: Bell, badge: 7 },
  { id: 'reports' as const, label: 'Reports', icon: BarChart3 },
  { id: 'settings' as const, label: 'Settings', icon: Settings },
];

const validationChecks = [
  { id: 'v1', label: 'Formatting consistency', status: 'pass', detail: 'All chapters match style guide' },
  { id: 'v2', label: 'Margin validation', status: 'pass', detail: '25mm all sides — compliant' },
  { id: 'v3', label: 'Typography consistency', status: 'warn', detail: 'Chapter 4 heading weight mismatch' },
  { id: 'v4', label: 'Missing images / tables', status: 'pass', detail: 'All 24 figures present' },
  { id: 'v5', label: 'Page numbering', status: 'pass', detail: 'Sequential — no gaps detected' },
  { id: 'v6', label: 'Spacing & alignment', status: 'warn', detail: 'Table 7 — column spacing irregular' },
  { id: 'v7', label: 'Low-resolution assets', status: 'fail', detail: 'Figure 12 below 300 DPI threshold' },
  { id: 'v8', label: 'Hyperlinks & cross-refs', status: 'pass', detail: '38 cross-references validated' },
  { id: 'v9', label: 'Index & bibliography', status: 'pass', detail: '182 bibliography entries — complete' },
  { id: 'v10', label: 'Print readiness', status: 'warn', detail: 'Bleed area pending final check' },
];

const readinessScore = 84;
const passCount = validationChecks.filter(c => c.status === 'pass').length;
const warnCount = validationChecks.filter(c => c.status === 'warn').length;
const failCount = validationChecks.filter(c => c.status === 'fail').length;

const revisionHistory = [
  { id: 'rh1', date: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000), actor: 'Emma Thompson', role: 'Layout Artist', type: 'upload', text: 'Initial book layout v1.0 submitted for coordinator review.' },
  { id: 'rh2', date: new Date(Date.now() - 4 * 24 * 60 * 60 * 1000), actor: 'Maria Rodriguez', role: 'TWG Coordinator', type: 'note', text: 'Returned v1.0 — Chapter 4 heading hierarchy and Figure 12 resolution must be corrected before master approval.' },
  { id: 'rh3', date: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000), actor: 'Dr. Sarah Johnson', role: 'Editor', type: 'comment', text: 'Confirm Table 7 column headers match the copyedited version — there was a correction in the final round.' },
  { id: 'rh4', date: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000), actor: 'Emma Thompson', role: 'Layout Artist', type: 'upload', text: 'Revised layout v1.1 — Chapter 4 headings corrected. Figure 12 re-exported at 350 DPI.' },
  { id: 'rh5', date: new Date(Date.now() - 3 * 60 * 60 * 1000), actor: 'Dr. Jane Smith', role: 'Author', type: 'comment', text: 'Table 7 caption text should read "Comparative Analysis" not "Comparison Data" — please verify against final manuscript.' },
];

const ganttItems = [
  { label: 'Copyediting', start: 0, width: 25, done: true },
  { label: 'Cover Design', start: 20, width: 15, done: true },
  { label: 'Initial Layout', start: 33, width: 20, done: true },
  { label: 'Master Layout', start: 50, width: 20, active: true },
  { label: 'Proof Review', start: 68, width: 15, done: false },
  { label: 'Production', start: 82, width: 18, done: false },
];

const uploadedFiles = [
  { name: 'master-layout-v1.1.pdf', size: '28.4 MB', version: 'v1.1', date: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000), type: 'Master Layout PDF' },
  { name: 'layout-source-v1.1.indd', size: '61.2 MB', version: 'v1.1', date: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000), type: 'InDesign Source' },
  { name: 'cover-final-v2.pdf', size: '4.9 MB', version: 'v2.0', date: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000), type: 'Cover PDF' },
  { name: 'fonts-embedded-check.pdf', size: '1.8 MB', version: 'v1.1', date: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000), type: 'Font Validation' },
];

export function TWGMasterBookLayoutPage({ manuscript, onBack }: TWGMasterBookLayoutPageProps) {
  const [activeNav, setActiveNav] = useState<ActiveNav>('master_layout');
  const [previewSection, setPreviewSection] = useState<PreviewSection>('chapter');
  const [currentSpread, setCurrentSpread] = useState(4);
  const [zoomLevel, setZoomLevel] = useState(90);
  const [viewMode, setViewMode] = useState<'spread' | 'single'>('spread');
  const [decision, setDecision] = useState<LayoutDecision>(null);
  const [showModal, setShowModal] = useState(false);
  const [coordinatorNote, setCoordinatorNote] = useState('');
  const [layoutStatus, setLayoutStatus] = useState<'under_review' | 'approved' | 'returned' | 'sent_proof' | 'locked'>('under_review');
  const totalSpreads = 18;
  const daysUntilDeadline = 6;

  const statusCfg = {
    under_review: { label: 'Production Finalization Stage', bg: 'bg-blue-100', text: 'text-blue-800' },
    approved: { label: 'Master Layout Approved', bg: 'bg-green-100', text: 'text-green-800' },
    returned: { label: 'Returned for Revision', bg: 'bg-amber-100', text: 'text-amber-800' },
    sent_proof: { label: 'Sent to Proof Generation', bg: 'bg-purple-100', text: 'text-purple-800' },
    locked: { label: 'Layout Version Locked', bg: 'bg-gray-100', text: 'text-gray-800' },
  };
  const status = statusCfg[layoutStatus];

  const handleConfirm = () => {
    if (decision === 'approve') setLayoutStatus('approved');
    else if (decision === 'return') setLayoutStatus('returned');
    else if (decision === 'send_proof') setLayoutStatus('sent_proof');
    setShowModal(false);
    setDecision(null);
  };

  /* ── Simulated book preview ── */
  const BookPreview = () => {
    const spreads: Record<PreviewSection, React.ReactNode> = {
      cover: (
        <div className="flex items-center justify-center gap-3">
          <div className="bg-white shadow-xl" style={{ width: '240px', height: '340px' }}>
            <div className="h-full bg-gradient-to-b from-[#0c1929] via-[#1e3a5f] to-[#0c1929] flex flex-col p-6 justify-between">
              <div>
                <div className="w-8 h-0.5 bg-teal-400 mb-4" />
                <p className="text-teal-300 text-[8px] uppercase tracking-widest mb-2">{manuscript.journal}</p>
                <p className="text-white text-xs font-bold font-serif leading-snug mb-3">{manuscript.title}</p>
                <p className="text-slate-400 text-[8px]">Dr. Jane Smith</p>
                <p className="text-slate-500 text-[8px]">University of Cambridge</p>
              </div>
              <div>
                <div className="w-full h-px bg-slate-600 mb-2" />
                <p className="text-slate-500 text-[7px]">Vol. 12 · 2026 · ISSN 1234-5678</p>
                <div className="mt-2 bg-slate-800 rounded px-2 py-1"><p className="text-slate-400 text-[7px] font-mono">ISBN 978-0-000-00000-0</p></div>
              </div>
            </div>
          </div>
          <div className="bg-white shadow-xl" style={{ width: '240px', height: '340px' }}>
            <div className="h-full bg-gradient-to-b from-[#1e3a5f] to-[#0c1929] flex flex-col p-6 justify-between">
              <p className="text-teal-300 text-[8px] uppercase tracking-widest">{manuscript.journal}</p>
              <div>
                <p className="text-slate-300 text-[8px] leading-relaxed mb-4">An in-depth scholarly exploration of current developments in neuroplasticity and adult learning mechanisms across interdisciplinary research fields.</p>
                <div className="w-full h-px bg-slate-600 mb-3" />
                <div className="bg-white rounded px-1 py-0.5 w-16">
                  <div className="flex gap-px">{Array.from({length:12}).map((_,i)=><div key={i} className={`w-px bg-black ${i%3===0?'h-5':'h-3'}`}/>)}</div>
                  <p className="text-[5px] text-black text-center mt-0.5 font-mono">978-0-000-00000-0</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      ),
      prelims: (
        <div className="flex gap-3">
          {['Copyright', 'Dedication'].map((label, pi) => (
            <div key={pi} className="bg-white shadow-md border border-gray-100" style={{ width: '240px', minHeight: '340px', padding: '28px 24px' }}>
              <div className="flex items-center justify-between pb-2 border-b border-gray-100 mb-4">
                <div className="h-1 w-10 bg-gray-200 rounded" />
                <span className="text-[7px] text-gray-400">{pi === 0 ? 'ii' : 'iii'}</span>
              </div>
              {pi === 0 ? (
                <div className="space-y-1.5">
                  <div className="h-1.5 bg-gray-700 rounded w-1/3 mb-3" />
                  {Array.from({length:8}).map((_,i)=><div key={i} className="h-1 bg-gray-200 rounded" style={{width:i%3===2?'75%':'100%'}}/>)}
                  <div className="mt-4 h-px bg-gray-200" />
                  <div className="mt-2 space-y-1">
                    {Array.from({length:4}).map((_,i)=><div key={i} className="h-1 bg-gray-200 rounded" style={{width:i%2===1?'60%':'90%'}}/>)}
                  </div>
                </div>
              ) : (
                <div className="flex flex-col items-center justify-center h-48">
                  <div className="h-1.5 w-32 bg-gray-300 rounded mb-2" />
                  <div className="h-1 w-24 bg-gray-200 rounded mb-1" />
                  <div className="h-1 w-20 bg-gray-200 rounded" />
                </div>
              )}
            </div>
          ))}
        </div>
      ),
      toc: (
        <div className="flex gap-3">
          {[0,1].map(pi=>(
            <div key={pi} className="bg-white shadow-md border border-gray-100" style={{width:'240px',minHeight:'340px',padding:'28px 24px'}}>
              <div className="flex items-center justify-between pb-2 border-b border-gray-100 mb-3">
                <span className="text-[8px] text-gray-400 uppercase tracking-widest">Table of Contents</span>
                <span className="text-[7px] text-gray-400">{pi+3}</span>
              </div>
              {pi===0 && <div className="h-2 bg-gray-600 rounded w-1/2 mb-4"/>}
              <div className="space-y-2">
                {[
                  {ch:'Chapter 1',title:'Introduction',pg:'1'},
                  {ch:'Chapter 2',title:'Literature Review',pg:'18'},
                  {ch:'Chapter 3',title:'Methodology',pg:'42'},
                  ...(pi===1?[{ch:'Chapter 4',title:'Findings',pg:'67'},{ch:'Chapter 5',title:'Discussion',pg:'89'},{ch:'Chapter 6',title:'Conclusion',pg:'112'}]:[]),
                ].map((item,i)=>(
                  <div key={i} className="flex items-center gap-1 text-[8px]">
                    <span className="text-gray-500 w-16 flex-shrink-0">{item.ch}</span>
                    <div className="flex-1 border-b border-dotted border-gray-300 mb-0.5"/>
                    <span className="text-gray-600 font-medium">{item.pg}</span>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      ),
      chapter: (
        <div className="flex gap-3">
          {[0,1].map(side=>(
            <div key={side} className="bg-white shadow-md border border-gray-100 flex flex-col" style={{width:'240px',minHeight:'340px'}}>
              <div className="flex items-center justify-between px-5 pt-4 pb-2 border-b border-gray-100">
                <span className="text-[7px] text-gray-400 uppercase tracking-widest truncate w-28">{side===0?'Chapter 3: Methodology':manuscript.title.substring(0,22)}</span>
                <span className="text-[7px] text-gray-400">{currentSpread*2-(1-side)}</span>
              </div>
              <div className="flex gap-2 flex-1 px-5 py-3">
                {side===0?<div className="w-5 flex flex-col gap-1.5 pt-2"><div className="h-0.5 w-full bg-amber-300 rounded"/><div className="h-0.5 w-full bg-teal-300 rounded mt-8"/></div>:null}
                <div className="flex-1 space-y-1.5">
                  {side===0&&<><div className="h-3 w-2/3 bg-gray-700 rounded mb-2"/><div className="h-1.5 w-1/2 bg-gray-400 rounded mb-3"/></>}
                  {side===1&&<div className="h-2.5 w-1/2 bg-gray-600 rounded mb-2"/>}
                  {Array.from({length:4}).map((_,i)=><div key={i} className="h-1.5 bg-gray-200 rounded" style={{width:i%4===3?'70%':'100%'}}/>)}
                  <div className={`border rounded h-16 flex flex-col items-center justify-center gap-1 my-2 ${side===0?'bg-teal-50 border-teal-200':'bg-blue-50 border-blue-200'}`}>
                    {side===1?<div className="flex gap-0.5 items-end mb-1">{[6,9,7,11,8,10,6].map((h,i)=><div key={i} className="w-1.5 bg-teal-400 rounded-sm" style={{height:`${h}px`}}/>)}</div>:null}
                    {side===0?<div className="w-12 h-8 bg-teal-200 rounded"/>:null}
                    <span className="text-[6px] text-gray-400">{side===0?'Figure 3':'Figure 4 — Chart'}</span>
                  </div>
                  <div className="h-0.5 w-20 bg-gray-300 rounded mx-auto"/>
                  {Array.from({length:5}).map((_,i)=><div key={i} className="h-1.5 bg-gray-200 rounded" style={{width:i%5===4?'55%':'100%'}}/>)}
                  {side===1&&(
                    <div className="border border-gray-200 rounded overflow-hidden mt-2">
                      <div className="bg-gray-700 h-4 flex items-center gap-1.5 px-2">{[40,30,30].map((w,i)=><div key={i} className="h-0.5 bg-gray-400 rounded" style={{width:`${w}%`}}/>)}</div>
                      {[0,1,2].map(r=><div key={r} className={`h-3 flex items-center gap-1.5 px-2 ${r%2===0?'bg-gray-50':'bg-white'}`}>{[40,30,30].map((w,i)=><div key={i} className="h-0.5 bg-gray-200 rounded" style={{width:`${w}%`}}/>)}</div>)}
                    </div>
                  )}
                </div>
              </div>
              <div className="flex items-center justify-between px-5 py-2 border-t border-gray-100">
                <span className="text-[6px] text-gray-400 uppercase tracking-widest">{side===0?'Methodology':'Results Overview'}</span>
                <span className="text-[7px] text-gray-400">{currentSpread*2-(1-side)}</span>
              </div>
            </div>
          ))}
        </div>
      ),
      figures: (
        <div className="flex gap-3">
          {[0,1].map(pi=>(
            <div key={pi} className="bg-white shadow-md border border-gray-100" style={{width:'240px',minHeight:'340px',padding:'20px'}}>
              <div className="flex items-center justify-between pb-2 border-b border-gray-100 mb-3">
                <span className="text-[7px] text-gray-400">Figures & Tables</span>
                <span className={`text-[7px] px-1.5 py-0.5 rounded font-medium ${pi===0?'bg-green-100 text-green-600':'bg-amber-100 text-amber-600'}`}>{pi===0?'Verified':'Needs Check'}</span>
              </div>
              {[1,2,3].map(fig=>(
                <div key={fig} className={`mb-3 rounded border p-2 ${pi===1&&fig===2?'border-amber-300 bg-amber-50':'border-gray-100 bg-gray-50'}`}>
                  <div className={`h-12 rounded mb-1.5 flex items-center justify-center ${pi===1&&fig===2?'bg-amber-100':'bg-gray-200'}`}>
                    {pi===1&&fig===2?<AlertTriangle className="w-4 h-4 text-amber-400"/>:<div className="w-8 h-6 bg-gray-300 rounded"/>}
                  </div>
                  <p className="text-[7px] text-gray-500">Figure {pi*3+fig} {pi===1&&fig===2?'— Low DPI Warning':''}</p>
                </div>
              ))}
            </div>
          ))}
        </div>
      ),
    };
    return spreads[previewSection];
  };

  return (
    <div className="flex h-screen bg-[#f0f4f8] overflow-hidden">

      {/* ── SIDEBAR ── */}
      <aside className="w-60 flex-shrink-0 bg-[#0c1929] flex flex-col overflow-y-auto">
        {/* Logo */}
        <div className="px-5 py-5 border-b border-slate-800">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 bg-teal-500 rounded-lg flex items-center justify-center">
              <BookOpen className="w-4 h-4 text-white" />
            </div>
            <div>
              <p className="text-white text-sm font-bold leading-tight">TWG Suite</p>
              <p className="text-slate-500 text-[10px]">Production Coordinator</p>
            </div>
          </div>
        </div>

        <nav className="flex-1 py-4 px-3 space-y-0.5">
          {sidebarItems.map(({ id, label, icon: Icon, badge }) => {
            const isActive = activeNav === id;
            return (
              <button key={id}
                onClick={() => { setActiveNav(id); if (id === 'dashboard') onBack(); }}
                className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-left text-sm transition-all ${
                  isActive ? 'bg-teal-600 text-white font-semibold shadow-sm' : 'text-slate-400 hover:bg-slate-800 hover:text-slate-200'
                }`}
              >
                <Icon className="w-4 h-4 flex-shrink-0" />
                <span className="flex-1 truncate">{label}</span>
                {badge && <span className="bg-red-500 text-white text-[9px] font-bold rounded-full px-1.5 min-w-[18px] text-center py-0.5">{badge}</span>}
              </button>
            );
          })}
        </nav>

        {/* User */}
        <div className="px-4 py-4 border-t border-slate-800">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 bg-teal-700 rounded-full flex items-center justify-center text-white text-xs font-bold">MR</div>
            <div className="flex-1 min-w-0">
              <p className="text-white text-xs font-semibold truncate">Maria Rodriguez</p>
              <p className="text-slate-500 text-[10px]">TWG Coordinator</p>
            </div>
            <button onClick={onBack} className="text-slate-600 hover:text-red-400 transition-colors"><LogOut className="w-3.5 h-3.5" /></button>
          </div>
        </div>
      </aside>

      {/* ── MAIN AREA ── */}
      <div className="flex-1 flex flex-col overflow-hidden">

        {/* ── HEADER ── */}
        <header className="bg-white border-b border-gray-200 shadow-sm flex-shrink-0 z-30">
          {/* Top row */}
          <div className="px-6 py-3 flex items-center justify-between gap-4">
            <div className="flex items-center gap-3 min-w-0">
              <nav className="flex items-center gap-1.5 text-sm text-gray-500">
                <button onClick={onBack} className="hover:text-gray-900 transition-colors">Dashboard</button>
                <ChevronRight className="w-3.5 h-3.5 text-gray-300" />
                <span className="text-gray-400">Production Queue</span>
                <ChevronRight className="w-3.5 h-3.5 text-gray-300" />
                <span className="font-semibold text-[#0c1929] truncate max-w-xs">Master Book Layout</span>
              </nav>
            </div>
            <div className="flex items-center gap-4 flex-shrink-0">
              <div className="relative hidden lg:block">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-gray-400" />
                <input type="text" placeholder="Search manuscripts…" className="pl-9 pr-4 py-1.5 text-sm border border-gray-200 rounded-lg bg-gray-50 focus:outline-none focus:ring-2 focus:ring-teal-500 w-48" />
              </div>
              <button className="relative p-2 text-gray-500 hover:text-gray-900 transition-colors">
                <Bell className="w-5 h-5" />
                <span className="absolute top-1 right-1 w-2 h-2 bg-red-500 rounded-full" />
              </button>
              <div className="flex items-center gap-2 cursor-pointer border-l pl-4 border-gray-100">
                <div className="w-8 h-8 bg-teal-700 rounded-full flex items-center justify-center text-white text-xs font-bold">MR</div>
                <div className="hidden lg:block">
                  <p className="text-xs font-semibold text-gray-900 leading-none">Maria Rodriguez</p>
                  <p className="text-[10px] text-gray-400">TWG Coordinator</p>
                </div>
                <ChevronDown className="w-3.5 h-3.5 text-gray-400" />
              </div>
            </div>
          </div>

          {/* Title row */}
          <div className="px-6 py-2.5 flex items-center justify-between gap-4 bg-gray-50 border-t border-gray-100">
            <div className="flex items-center gap-4">
              <div>
                <h1 className="text-lg font-bold text-[#0c1929]" style={{fontFamily:'Georgia, serif'}}>Master Book Layout</h1>
                <p className="text-xs text-gray-500 truncate max-w-md">{manuscript.title}</p>
              </div>
              <span className={`text-xs font-semibold px-3 py-1 rounded-full ${status.bg} ${status.text}`}>{status.label}</span>
            </div>
            <div className="flex items-center gap-6 flex-shrink-0">
              <div className="flex items-center gap-2">
                <div className="p-1.5 bg-amber-100 rounded-lg"><Calendar className="w-3.5 h-3.5 text-amber-600" /></div>
                <div>
                  <p className="text-[10px] text-gray-400 leading-none">Publication deadline</p>
                  <p className="text-sm font-bold text-amber-600">{daysUntilDeadline} days remaining</p>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <div className="p-1.5 bg-teal-100 rounded-lg"><Activity className="w-3.5 h-3.5 text-teal-600" /></div>
                <div>
                  <p className="text-[10px] text-gray-400 leading-none">Readiness score</p>
                  <p className="text-sm font-bold text-teal-700">{readinessScore}%</p>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <div className="p-1.5 bg-blue-100 rounded-lg"><FileText className="w-3.5 h-3.5 text-blue-600" /></div>
                <div>
                  <p className="text-[10px] text-gray-400 leading-none">Revision count</p>
                  <p className="text-sm font-bold text-blue-700">v1.1 (2 rounds)</p>
                </div>
              </div>
            </div>
          </div>
        </header>

        {/* ── SCROLLABLE CONTENT ── */}
        <div className="flex-1 overflow-y-auto p-5">
          <div className="max-w-[1280px] mx-auto space-y-5">

            {/* ROW 1 — Manuscript Info + Stat Cards */}
            <div className="grid grid-cols-12 gap-5">
              {/* Manuscript Info */}
              <div className="col-span-12 xl:col-span-5 bg-white rounded-xl border border-gray-200 shadow-sm p-5">
                <div className="flex items-center gap-2 mb-4">
                  <BookMarked className="w-4 h-4 text-teal-600" />
                  <h2 className="text-sm font-bold text-[#0c1929] uppercase tracking-wide">Master Manuscript Information</h2>
                </div>

                <div className="grid grid-cols-2 gap-x-6 gap-y-2.5 mb-4">
                  {[
                    { label: 'Manuscript Title', value: manuscript.title, full: true, bold: true },
                    { label: 'Author(s)', value: 'Dr. Jane Smith · University of Cambridge' },
                    { label: 'Assigned Editor', value: 'Dr. Sarah Johnson' },
                    { label: 'Layout Artist', value: 'Emma Thompson (TWG)' },
                    { label: 'Manuscript Type', value: manuscript.journal },
                    { label: 'Total Pages', value: '128 pages (typeset)' },
                    { label: 'Target Publication', value: 'September 2026' },
                    { label: 'ISBN Status', value: 'Registered · Active', highlight: 'green' },
                    { label: 'Est. Completion', value: `${daysUntilDeadline} days`, highlight: 'amber' },
                  ].map(({ label, value, full, bold, highlight }) => (
                    <div key={label} className={full ? 'col-span-2' : 'col-span-1'}>
                      <p className="text-[10px] text-gray-400 font-medium uppercase tracking-wider mb-0.5">{label}</p>
                      <p className={`text-sm leading-snug ${bold ? 'font-bold text-gray-900' : highlight === 'green' ? 'text-green-700 font-semibold' : highlight === 'amber' ? 'text-amber-700 font-semibold' : 'text-gray-800'}`}>{value}</p>
                    </div>
                  ))}
                </div>

                {/* Workflow progress */}
                <div className="pt-3 border-t border-gray-100">
                  <div className="flex items-center justify-between text-xs mb-2">
                    <span className="text-gray-500 font-medium">Workflow Progress</span>
                    <span className="font-bold text-teal-700">72%</span>
                  </div>
                  <div className="h-2 bg-gray-100 rounded-full overflow-hidden mb-2">
                    <div className="h-full bg-gradient-to-r from-teal-500 to-teal-400 rounded-full" style={{ width: '72%' }} />
                  </div>
                  <div className="flex items-center justify-between text-[10px] text-gray-400">
                    <span>Copyediting</span><span>Cover</span><span>Layout</span><span className="font-semibold text-teal-600">Master ←</span><span>Proof</span><span>Production</span>
                  </div>
                </div>
              </div>

              {/* Stat cards 2×3 */}
              <div className="col-span-12 xl:col-span-7 grid grid-cols-3 gap-4">
                {[
                  { label: 'Publication Readiness', value: readinessScore, unit: '%', color: 'text-teal-700', bg: 'bg-teal-50', bar: 'bg-teal-500', icon: Star, status: 'Good', statusColor: 'bg-teal-100 text-teal-700' },
                  { label: 'Validation Checks Passed', value: passCount, unit: `/${validationChecks.length}`, color: 'text-green-700', bg: 'bg-green-50', bar: 'bg-green-500', icon: CheckCircle, status: `${failCount} Failed`, statusColor: 'bg-red-100 text-red-700' },
                  { label: 'Delay Risk', value: 24, unit: '%', color: 'text-green-700', bg: 'bg-green-50', bar: 'bg-green-400', icon: TrendingDown, status: 'Low Risk', statusColor: 'bg-green-100 text-green-700' },
                  { label: 'Layout Revisions', value: 2, unit: ' rounds', color: 'text-blue-700', bg: 'bg-blue-50', bar: 'bg-blue-500', icon: RotateCcw, status: 'v1.1 Active', statusColor: 'bg-blue-100 text-blue-700' },
                  { label: 'TWG Workload', value: 68, unit: '%', color: 'text-amber-700', bg: 'bg-amber-50', bar: 'bg-amber-400', icon: Activity, status: 'Moderate', statusColor: 'bg-amber-100 text-amber-700' },
                  { label: 'Days to Deadline', value: daysUntilDeadline, unit: ' days', color: 'text-amber-700', bg: 'bg-amber-50', bar: 'bg-amber-400', icon: Calendar, status: 'On Track', statusColor: 'bg-amber-100 text-amber-700' },
                ].map(({ label, value, unit, color, bg, bar, icon: Ic, status: st, statusColor }) => (
                  <div key={label} className={`${bg} rounded-xl border border-gray-200 p-4 flex flex-col gap-2`}>
                    <div className="flex items-center justify-between">
                      <p className="text-[10px] font-semibold text-gray-600 leading-snug">{label}</p>
                      <Ic className={`w-4 h-4 ${color} flex-shrink-0`} />
                    </div>
                    <p className={`text-3xl font-bold ${color}`}>{value}<span className="text-sm font-normal text-gray-400">{unit}</span></p>
                    <div className="h-1.5 bg-white/60 rounded-full overflow-hidden">
                      <div className={`h-full rounded-full ${bar}`} style={{ width: `${typeof value === 'number' && value <= 100 ? value : Math.min((value/20)*100,100)}%` }} />
                    </div>
                    <span className={`text-[10px] px-2 py-0.5 rounded-full font-semibold self-start ${statusColor}`}>{st}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* ROW 2 — Layout Preview + Validation Panel */}
            <div className="grid grid-cols-12 gap-5">

              {/* Layout Preview Workspace */}
              <div className="col-span-12 xl:col-span-8 bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden">
                {/* Workspace header */}
                <div className="px-5 py-3 border-b border-gray-200 bg-gray-50 flex items-center justify-between gap-3 flex-wrap">
                  <div className="flex items-center gap-2">
                    <Layers className="w-4 h-4 text-teal-600" />
                    <h2 className="text-sm font-bold text-[#0c1929] uppercase tracking-wide">Consolidated Layout Preview</h2>
                    <span className="text-xs text-gray-400">v1.1 · 128pp</span>
                  </div>
                  <div className="flex items-center gap-1.5 flex-wrap">
                    {/* Section tabs */}
                    <div className="flex gap-0.5 bg-gray-200 rounded-lg p-0.5">
                      {([['cover','Cover'],['prelims','Prelims'],['toc','TOC'],['chapter','Chapter'],['figures','Figures']] as [PreviewSection,string][]).map(([s,l])=>(
                        <button key={s} onClick={()=>setPreviewSection(s)} className={`px-2.5 py-1 rounded-md text-[11px] font-semibold transition-all ${previewSection===s?'bg-white text-[#0c1929] shadow-sm':'text-gray-500 hover:text-gray-700'}`}>{l}</button>
                      ))}
                    </div>
                    <div className="w-px h-5 bg-gray-200 mx-1"/>
                    {/* Controls */}
                    <button onClick={()=>setZoomLevel(z=>Math.max(z-10,60))} className="p-1.5 border border-gray-200 rounded-lg hover:bg-gray-100"><ZoomOut className="w-3.5 h-3.5 text-gray-600"/></button>
                    <span className="text-[11px] font-mono text-gray-600 w-10 text-center">{zoomLevel}%</span>
                    <button onClick={()=>setZoomLevel(z=>Math.min(z+10,140))} className="p-1.5 border border-gray-200 rounded-lg hover:bg-gray-100"><ZoomIn className="w-3.5 h-3.5 text-gray-600"/></button>
                    <button onClick={()=>setViewMode(m=>m==='spread'?'single':'spread')} title="Toggle view" className={`p-1.5 border rounded-lg transition-colors ${viewMode==='spread'?'border-teal-300 bg-teal-50 text-teal-700':'border-gray-200 hover:bg-gray-100 text-gray-600'}`}><Columns2 className="w-3.5 h-3.5"/></button>
                    <button className="p-1.5 border border-gray-200 rounded-lg hover:bg-gray-100"><GitCompare className="w-3.5 h-3.5 text-gray-600"/></button>
                    <button className="p-1.5 border border-gray-200 rounded-lg hover:bg-gray-100"><Maximize2 className="w-3.5 h-3.5 text-gray-600"/></button>
                  </div>
                </div>

                {/* Preview body */}
                <div className="flex" style={{ height: '420px' }}>
                  {/* Thumbnail strip */}
                  <div className="w-20 border-r border-gray-100 bg-gray-50 overflow-y-auto py-2 flex flex-col gap-1.5 items-center flex-shrink-0">
                    {Array.from({ length: totalSpreads }).map(pg => (
                      <button key={pg} onClick={()=>setCurrentSpread(pg+1)}
                        className={`w-14 rounded border-2 transition-all overflow-hidden ${currentSpread===pg+1?'border-teal-500 shadow-md':'border-gray-200 hover:border-gray-400'}`}>
                        <div className="bg-white p-1 space-y-0.5" style={{minHeight:'46px'}}>
                          {pg===0?<div className="h-full bg-gradient-to-b from-[#0c1929] to-[#1e3a5f] rounded-sm min-h-[40px]"/>:<>
                            <div className="h-1 bg-gray-400 rounded w-2/3"/>
                            {Array.from({length:4}).map((_,i)=><div key={i} className="h-0.5 bg-gray-200 rounded" style={{width:i%3===2?'65%':'100%'}}/>)}
                            {pg%3===1&&<div className="h-4 bg-gray-100 rounded border border-gray-200 mt-0.5"/>}
                          </>}
                        </div>
                        <div className="bg-gray-100 text-[7px] text-gray-500 text-center py-0.5">{pg+1}</div>
                      </button>
                    ))}
                  </div>

                  {/* Main preview */}
                  <div className="flex-1 bg-gray-200 overflow-auto flex items-center justify-center py-6 px-4">
                    <div style={{ transform: `scale(${zoomLevel/100})`, transformOrigin: 'center top', transition: 'transform 0.2s' }}>
                      <BookPreview />
                    </div>
                  </div>
                </div>

                {/* Preview footer — approve/reject controls */}
                <div className="px-5 py-2.5 border-t border-gray-100 bg-gray-50 flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <button onClick={()=>setCurrentSpread(p=>Math.max(1,p-1))} disabled={currentSpread===1} className="flex items-center gap-1 px-3 py-1.5 text-xs font-medium border border-gray-200 rounded-lg hover:bg-white disabled:opacity-40 transition-colors"><ChevronLeft className="w-3.5 h-3.5"/>Prev</button>
                    <span className="text-xs text-gray-600">Spread <strong>{currentSpread}</strong> of {totalSpreads}</span>
                    <button onClick={()=>setCurrentSpread(p=>Math.min(totalSpreads,p+1))} disabled={currentSpread===totalSpreads} className="flex items-center gap-1 px-3 py-1.5 text-xs font-medium border border-gray-200 rounded-lg hover:bg-white disabled:opacity-40 transition-colors">Next<ChevronRight className="w-3.5 h-3.5"/></button>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="text-xs text-gray-500">Page action:</span>
                    <button className="flex items-center gap-1 px-3 py-1.5 text-xs font-semibold text-green-700 bg-green-50 border border-green-200 rounded-lg hover:bg-green-100 transition-colors"><CheckCircle className="w-3.5 h-3.5"/>Approve Page</button>
                    <button className="flex items-center gap-1 px-3 py-1.5 text-xs font-semibold text-red-700 bg-red-50 border border-red-200 rounded-lg hover:bg-red-100 transition-colors"><XCircle className="w-3.5 h-3.5"/>Flag Page</button>
                    <button className="flex items-center gap-1 px-3 py-1.5 text-xs font-medium text-gray-600 border border-gray-200 rounded-lg hover:bg-gray-100 transition-colors"><StickyNote className="w-3.5 h-3.5"/>Annotate</button>
                  </div>
                </div>
              </div>

              {/* Validation Panel */}
              <div className="col-span-12 xl:col-span-4 bg-white rounded-xl border border-gray-200 shadow-sm p-5">
                <div className="flex items-center justify-between mb-3">
                  <div className="flex items-center gap-2">
                    <MonitorCheck className="w-4 h-4 text-teal-600" />
                    <h2 className="text-sm font-bold text-[#0c1929] uppercase tracking-wide">Quality Validation</h2>
                  </div>
                </div>

                {/* Score ring-style summary */}
                <div className="flex items-center gap-4 mb-4 p-3 bg-gray-50 rounded-xl border border-gray-100">
                  <div className="relative w-16 h-16 flex-shrink-0">
                    <svg className="w-16 h-16 -rotate-90" viewBox="0 0 64 64">
                      <circle cx="32" cy="32" r="26" fill="none" stroke="#e5e7eb" strokeWidth="7"/>
                      <circle cx="32" cy="32" r="26" fill="none" stroke="#0d9488" strokeWidth="7"
                        strokeDasharray={`${2*Math.PI*26*readinessScore/100} ${2*Math.PI*26}`} strokeLinecap="round"/>
                    </svg>
                    <div className="absolute inset-0 flex items-center justify-center">
                      <span className="text-sm font-bold text-teal-700">{readinessScore}%</span>
                    </div>
                  </div>
                  <div>
                    <p className="text-xs font-semibold text-gray-700 mb-1">Publication Readiness</p>
                    <div className="flex gap-2 flex-wrap">
                      <span className="text-[10px] px-2 py-0.5 bg-green-100 text-green-700 rounded-full font-semibold">{passCount} Pass</span>
                      <span className="text-[10px] px-2 py-0.5 bg-amber-100 text-amber-700 rounded-full font-semibold">{warnCount} Warn</span>
                      <span className="text-[10px] px-2 py-0.5 bg-red-100 text-red-700 rounded-full font-semibold">{failCount} Fail</span>
                    </div>
                  </div>
                </div>

                {/* Check list */}
                <div className="space-y-1.5 overflow-y-auto" style={{ maxHeight: '295px' }}>
                  {validationChecks.map(check => (
                    <div key={check.id} className={`flex items-start gap-2.5 px-3 py-2.5 rounded-lg border text-xs ${
                      check.status==='pass'?'bg-green-50 border-green-100':check.status==='warn'?'bg-amber-50 border-amber-100':'bg-red-50 border-red-100'
                    }`}>
                      {check.status==='pass'?<CheckCircle className="w-3.5 h-3.5 text-green-600 flex-shrink-0 mt-0.5"/>:check.status==='warn'?<AlertTriangle className="w-3.5 h-3.5 text-amber-500 flex-shrink-0 mt-0.5"/>:<XCircle className="w-3.5 h-3.5 text-red-500 flex-shrink-0 mt-0.5"/>}
                      <div>
                        <p className={`font-semibold leading-tight ${check.status==='pass'?'text-green-800':check.status==='warn'?'text-amber-800':'text-red-800'}`}>{check.label}</p>
                        <p className="text-gray-500 leading-tight mt-0.5">{check.detail}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* ROW 3 — Timeline + Communication */}
            <div className="grid grid-cols-12 gap-5">

              {/* Timeline & Production Monitoring */}
              <div className="col-span-12 xl:col-span-6 bg-white rounded-xl border border-gray-200 shadow-sm p-5">
                <div className="flex items-center gap-2 mb-4">
                  <TrendingUp className="w-4 h-4 text-teal-600" />
                  <h2 className="text-sm font-bold text-[#0c1929] uppercase tracking-wide">Timeline & Production Monitoring</h2>
                </div>

                {/* Mini stats row */}
                <div className="grid grid-cols-3 gap-3 mb-4">
                  {[
                    { label: 'Remaining Time', value: `${daysUntilDeadline}d`, color: 'text-amber-600' },
                    { label: 'Current Stage', value: 'Master Layout', color: 'text-teal-700' },
                    { label: 'Bottlenecks', value: '2 Active', color: 'text-red-600' },
                  ].map(({ label, value, color }) => (
                    <div key={label} className="bg-gray-50 rounded-lg border border-gray-100 p-3 text-center">
                      <p className="text-[10px] text-gray-400 font-medium mb-1">{label}</p>
                      <p className={`text-sm font-bold ${color}`}>{value}</p>
                    </div>
                  ))}
                </div>

                {/* Gantt-style mini timeline */}
                <div className="mb-4">
                  <p className="text-[10px] font-semibold text-gray-500 uppercase tracking-wide mb-2">Production Timeline</p>
                  <div className="space-y-2">
                    {ganttItems.map(item => (
                      <div key={item.label} className="flex items-center gap-2">
                        <span className="text-[10px] text-gray-500 w-24 flex-shrink-0 text-right">{item.label}</span>
                        <div className="flex-1 h-5 bg-gray-100 rounded-md relative overflow-hidden">
                          <div
                            className={`absolute top-0 h-full rounded-md flex items-center px-1.5 ${
                              item.done ? 'bg-emerald-400' : item.active ? 'bg-teal-500 animate-pulse' : 'bg-gray-300'
                            }`}
                            style={{ left: `${item.start}%`, width: `${item.width}%` }}
                          >
                            {item.active && <span className="text-[8px] text-white font-bold whitespace-nowrap">← Active</span>}
                          </div>
                        </div>
                        {item.done && <CheckCircle className="w-3.5 h-3.5 text-emerald-500 flex-shrink-0"/>}
                        {item.active && <span className="text-[9px] text-teal-600 font-bold flex-shrink-0">Now</span>}
                        {!item.done && !item.active && <span className="w-3.5 h-3.5 flex-shrink-0"/>}
                      </div>
                    ))}
                  </div>
                  <div className="flex justify-between mt-1 px-[96px]">
                    {['0%','25%','50%','75%','100%'].map(p=><span key={p} className="text-[8px] text-gray-300">{p}</span>)}
                  </div>
                </div>

                {/* Bottleneck alerts */}
                <div className="space-y-2">
                  <p className="text-[10px] font-semibold text-gray-500 uppercase tracking-wide">Workflow Bottlenecks</p>
                  {[
                    { level: 'warn', msg: 'Figure 12 DPI failure blocking final print-readiness validation — requires re-export.' },
                    { level: 'warn', msg: 'Table 7 caption correction pending author confirmation before layout lock.' },
                  ].map((b, i) => (
                    <div key={i} className="flex items-start gap-2.5 px-3 py-2.5 bg-amber-50 border border-amber-100 rounded-lg text-xs">
                      <AlertTriangle className="w-3.5 h-3.5 text-amber-500 flex-shrink-0 mt-0.5"/>
                      <p className="text-amber-800">{b.msg}</p>
                    </div>
                  ))}
                </div>

                {/* Dynamic adjustments */}
                <div className="mt-4 pt-3 border-t border-gray-100">
                  <p className="text-[10px] font-semibold text-gray-500 uppercase tracking-wide mb-2">Dynamic Timeline Adjustment</p>
                  <div className="flex items-center gap-3 text-xs text-gray-600 bg-blue-50 border border-blue-100 rounded-lg px-3 py-2.5">
                    <Info className="w-4 h-4 text-blue-500 flex-shrink-0"/>
                    <p className="text-blue-800">Resolving current bottlenecks could recover ~1.5 days and restore deadline confidence to <strong>High</strong>. Escalate Figure 12 fix as priority.</p>
                  </div>
                </div>
              </div>

              {/* Communication & Revision Panel */}
              <div className="col-span-12 xl:col-span-6 bg-white rounded-xl border border-gray-200 shadow-sm p-5">
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center gap-2">
                    <MessageCircle className="w-4 h-4 text-teal-600" />
                    <h2 className="text-sm font-bold text-[#0c1929] uppercase tracking-wide">Communication & Revision</h2>
                  </div>
                  <span className="text-[10px] px-2 py-0.5 bg-gray-100 text-gray-600 rounded-full font-medium">{revisionHistory.length} entries</span>
                </div>

                {/* Revision history timeline */}
                <div className="space-y-3 mb-4 max-h-52 overflow-y-auto pr-1">
                  {revisionHistory.map((entry, idx) => (
                    <div key={entry.id} className="flex gap-3">
                      <div className="flex flex-col items-center">
                        <div className={`w-6 h-6 rounded-full flex items-center justify-center flex-shrink-0 text-white text-[9px] font-bold ${
                          entry.type==='upload'?'bg-teal-600':entry.type==='comment'?'bg-blue-600':'bg-amber-600'
                        }`}>
                          {entry.type==='upload'?<Upload className="w-3 h-3"/>:entry.type==='comment'?<MessageCircle className="w-3 h-3"/>:<StickyNote className="w-3 h-3"/>}
                        </div>
                        {idx < revisionHistory.length - 1 && <div className="w-px flex-1 bg-gray-200 my-1"/>}
                      </div>
                      <div className="pb-2 flex-1 min-w-0">
                        <div className="flex items-center gap-2 flex-wrap mb-1">
                          <span className="text-xs font-semibold text-gray-900">{entry.actor}</span>
                          <span className={`text-[9px] px-1.5 py-0.5 rounded-full font-medium ${
                            entry.role==='Layout Artist'?'bg-teal-100 text-teal-700':entry.role==='Editor'?'bg-blue-100 text-blue-700':entry.role==='TWG Coordinator'?'bg-purple-100 text-purple-700':'bg-orange-100 text-orange-700'
                          }`}>{entry.role}</span>
                          <span className="text-[9px] text-gray-400 ml-auto">{entry.date.toLocaleDateString()}</span>
                        </div>
                        <p className="text-xs text-gray-600 leading-relaxed">{entry.text}</p>
                      </div>
                    </div>
                  ))}
                </div>

                {/* Coordinator note */}
                <div className="mb-3">
                  <label className="text-[10px] font-semibold text-gray-500 uppercase tracking-wide mb-1 block">Coordinator Note</label>
                  <textarea value={coordinatorNote} onChange={e=>setCoordinatorNote(e.target.value)} rows={2}
                    placeholder="Add internal coordinator note, tag team member, or flag for follow-up…"
                    className="w-full text-sm border border-gray-200 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-teal-500 resize-none text-gray-800 placeholder-gray-400"/>
                </div>

                {/* Uploaded files */}
                <div>
                  <p className="text-[10px] font-semibold text-gray-500 uppercase tracking-wide mb-2">Uploaded Revision Files</p>
                  <div className="space-y-1.5">
                    {uploadedFiles.map(file => (
                      <div key={file.name} className="flex items-center justify-between px-3 py-2 bg-gray-50 border border-gray-100 rounded-lg hover:bg-gray-100 transition-colors">
                        <div className="flex items-center gap-2 min-w-0">
                          <FileText className="w-3.5 h-3.5 text-gray-400 flex-shrink-0"/>
                          <div className="min-w-0">
                            <p className="text-xs font-medium text-gray-900 truncate">{file.name}</p>
                            <p className="text-[10px] text-gray-400">{file.type} · {file.version} · {file.size}</p>
                          </div>
                        </div>
                        <button className="p-1 text-gray-400 hover:text-teal-600 transition-colors flex-shrink-0"><Download className="w-3.5 h-3.5"/></button>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>

            {/* Bottom spacer */}
            <div className="h-20"/>
          </div>
        </div>
      </div>

      {/* ── STICKY BOTTOM ACTION BAR ── */}
      <div className="absolute bottom-0 left-60 right-0 z-40 bg-white border-t border-gray-200 shadow-lg">
        <div className="px-6 py-3 flex items-center justify-between gap-3">
          <div className="flex items-center gap-2">
            <button className="flex items-center gap-1.5 px-4 py-2 text-sm font-medium text-gray-700 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors">
              <Download className="w-4 h-4" /> Export Final PDF
            </button>
            <button
              onClick={() => setLayoutStatus('locked')}
              className="flex items-center gap-1.5 px-4 py-2 text-sm font-medium text-gray-700 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
            >
              <Lock className="w-4 h-4" /> Lock Layout Version
            </button>
            <button className="flex items-center gap-1.5 px-4 py-2 text-sm font-medium text-gray-700 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors">
              <Bell className="w-4 h-4" /> Notify Editor
            </button>
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={() => { setDecision('return'); setShowModal(true); }}
              className="flex items-center gap-1.5 px-4 py-2 text-sm font-semibold text-amber-700 bg-amber-50 border border-amber-200 rounded-lg hover:bg-amber-500 hover:text-white transition-colors"
            >
              <RotateCcw className="w-4 h-4" /> Return for Revision
            </button>
            <button
              onClick={() => { setDecision('send_proof'); setShowModal(true); }}
              className="flex items-center gap-1.5 px-4 py-2 text-sm font-semibold text-blue-700 bg-blue-50 border border-blue-200 rounded-lg hover:bg-blue-600 hover:text-white transition-colors"
            >
              <Send className="w-4 h-4" /> Send to Proof Generation
            </button>
            <button
              onClick={() => { setDecision('approve'); setShowModal(true); }}
              className="flex items-center gap-1.5 px-5 py-2 text-sm font-semibold text-white bg-teal-600 rounded-lg hover:bg-teal-700 transition-colors"
            >
              <ThumbsUp className="w-4 h-4" /> Approve Master Layout
            </button>
            <button onClick={onBack} className="px-4 py-2 text-sm text-gray-500 hover:text-gray-700 transition-colors">Cancel</button>
          </div>
        </div>
      </div>

      {/* ── CONFIRMATION MODAL ── */}
      {showModal && decision && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm">
          <div className="bg-white rounded-2xl shadow-2xl p-6 w-full max-w-lg mx-4">
            <div className="flex items-center gap-3 mb-4">
              <div className={`p-2.5 rounded-xl ${decision==='approve'?'bg-teal-100':decision==='send_proof'?'bg-blue-100':'bg-amber-100'}`}>
                {decision==='approve'?<ThumbsUp className="w-5 h-5 text-teal-700"/>:decision==='send_proof'?<Send className="w-5 h-5 text-blue-700"/>:<RotateCcw className="w-5 h-5 text-amber-600"/>}
              </div>
              <div>
                <h3 className="font-bold text-gray-900">Confirm Production Decision</h3>
                <p className="text-xs text-gray-500">This action will update the master manuscript workflow</p>
              </div>
            </div>

            <div className="bg-gray-50 rounded-xl p-4 mb-4 space-y-2 text-sm">
              <div className="flex justify-between">
                <span className="text-gray-500">Decision:</span>
                <span className="font-semibold text-gray-900">
                  {decision==='approve'?'Approve Master Layout':decision==='send_proof'?'Send to Proof Generation':'Return for Revision'}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-500">Manuscript:</span>
                <span className="font-medium text-xs text-right max-w-[260px] text-gray-800">{manuscript.title}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-500">Readiness Score:</span>
                <span className={`font-semibold ${readinessScore>=90?'text-green-700':'text-amber-700'}`}>{readinessScore}% {readinessScore<90&&'— Warnings present'}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-500">Next Stage:</span>
                <span className="font-semibold text-gray-900">
                  {decision==='approve'?'Proof Generation Ready':decision==='send_proof'?'Proof Generation Queue':'Layout Revision (Round 3)'}
                </span>
              </div>
              {failCount > 0 && decision !== 'return' && (
                <div className="flex items-start gap-2 pt-2 border-t border-gray-200">
                  <AlertTriangle className="w-4 h-4 text-amber-500 flex-shrink-0 mt-0.5"/>
                  <p className="text-xs text-amber-700 font-medium">{failCount} validation failure{failCount>1?'s':''} detected. Proceeding will override these issues.</p>
                </div>
              )}
            </div>

            <p className="text-sm text-gray-600 mb-5">
              {decision==='approve'
                ? 'Approving the master layout confirms this version is ready for proof generation. The layout will be locked and forwarded to the production proof queue.'
                : decision==='send_proof'
                ? 'The master layout will be queued directly for proof generation. The layout artist and editor will be notified automatically.'
                : 'The master layout will be returned to the TWG Layout Artist with your coordinator notes and revision requirements attached.'}
            </p>

            <div className="flex gap-3">
              <button onClick={() => { setShowModal(false); setDecision(null); }} className="flex-1 px-4 py-2.5 text-sm font-medium text-gray-700 border border-gray-300 rounded-xl hover:bg-gray-50 transition-colors">Cancel</button>
              <button onClick={handleConfirm} className={`flex-1 px-4 py-2.5 text-sm font-semibold text-white rounded-xl transition-colors ${
                decision==='approve'?'bg-teal-600 hover:bg-teal-700':decision==='send_proof'?'bg-blue-600 hover:bg-blue-700':'bg-amber-500 hover:bg-amber-600'
              }`}>
                Confirm {decision==='approve'?'Approval':decision==='send_proof'?'Send to Proof':'Return'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
