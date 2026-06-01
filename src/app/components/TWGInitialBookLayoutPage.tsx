import React, { useState } from 'react';
import {
  LayoutDashboard,
  FileText,
  Scissors,
  BookOpen,
  Image,
  Layers,
  Printer,
  Clock,
  MessageSquare,
  Settings,
  Bell,
  Search,
  ChevronRight,
  ChevronDown,
  ZoomIn,
  ZoomOut,
  Save,
  Download,
  Send,
  CheckCircle,
  AlertTriangle,
  AlertCircle,
  Upload,
  RefreshCw,
  AlignLeft,
  AlignCenter,
  Grid,
  Maximize2,
  MoreHorizontal,
  ChevronLeft,
  TrendingUp,
  Calendar,
  Activity,
  Star,
  Sliders,
  Type,
  Hash,
  Columns,
  Minus,
  Plus,
  Eye,
  LogOut,
  BarChart2,
  Info,
} from 'lucide-react';
import type { Manuscript } from '../types';

interface TWGInitialBookLayoutPageProps {
  manuscript: Manuscript;
  onBack: () => void;
}

type ActiveNav = 'dashboard' | 'assigned' | 'copyediting' | 'initial_layout' | 'cover' | 'composition' | 'proof' | 'timeline' | 'messages' | 'settings';
type SelectedTemplate = 'academic' | 'textbook' | 'research' | 'conference' | null;
type ActiveTool = 'margins' | 'typography' | 'spacing' | 'headers' | 'chapter' | 'image' | 'table' | 'numbering' | 'template' | null;

const navItems = [
  { id: 'dashboard' as const, label: 'Dashboard', icon: LayoutDashboard },
  { id: 'assigned' as const, label: 'Assigned Manuscripts', icon: FileText },
  { id: 'copyediting' as const, label: 'Copyediting Queue', icon: Scissors },
  { id: 'initial_layout' as const, label: 'Initial Book Layout', icon: BookOpen },
  { id: 'cover' as const, label: 'Cover Design', icon: Image },
  { id: 'composition' as const, label: 'Layout Composition', icon: Layers },
  { id: 'proof' as const, label: 'Proof Generation', icon: Printer },
  { id: 'timeline' as const, label: 'Timeline Monitoring', icon: Clock },
  { id: 'messages' as const, label: 'Messages', icon: MessageSquare, badge: 3 },
  { id: 'settings' as const, label: 'Settings', icon: Settings },
];

const workflowStages = [
  { label: 'Submitted', done: true },
  { label: 'Copyediting', done: true },
  { label: 'Cover Design', done: true },
  { label: 'Initial Layout', active: true },
  { label: 'Composition', done: false },
  { label: 'Proof Review', done: false },
  { label: 'Production', done: false },
];

const templates = [
  {
    id: 'academic' as const,
    label: 'Academic Journal',
    desc: 'Two-column grid, formal typography, citation-ready',
    pages: 48,
    cols: 2,
    font: 'Times New Roman / 10pt',
  },
  {
    id: 'textbook' as const,
    label: 'Textbook',
    desc: 'Single-column with wide margins for annotations',
    pages: 180,
    cols: 1,
    font: 'Palatino / 11pt',
  },
  {
    id: 'research' as const,
    label: 'Research Book',
    desc: 'Scholarly monograph layout with chapter titles',
    pages: 96,
    cols: 1,
    font: 'Garamond / 11pt',
  },
  {
    id: 'conference' as const,
    label: 'Conference Proceedings',
    desc: 'Compact two-column, abstract-first structure',
    pages: 24,
    cols: 2,
    font: 'Helvetica Neue / 9pt',
  },
];

const toolbarGroups = [
  {
    label: 'Page',
    tools: [
      { id: 'margins' as const, icon: Maximize2, label: 'Margins' },
      { id: 'spacing' as const, icon: Minus, label: 'Spacing' },
      { id: 'numbering' as const, icon: Hash, label: 'Page Numbers' },
    ],
  },
  {
    label: 'Text',
    tools: [
      { id: 'typography' as const, icon: Type, label: 'Typography' },
      { id: 'chapter' as const, icon: AlignLeft, label: 'Chapter Format' },
      { id: 'headers' as const, icon: AlignCenter, label: 'Header/Footer' },
    ],
  },
  {
    label: 'Elements',
    tools: [
      { id: 'image' as const, icon: Image, label: 'Images' },
      { id: 'table' as const, icon: Grid, label: 'Tables' },
      { id: 'template' as const, icon: Columns, label: 'Templates' },
    ],
  },
];

const revisionHistory = [
  { id: 'r1', date: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000), actor: 'Dr. Sarah Johnson', role: 'Editor', type: 'comment', note: 'Please ensure chapter headings use H1 at 18pt with 24pt leading. Current draft has inconsistent heading sizes.' },
  { id: 'r2', date: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000), actor: 'Dr. Jane Smith', role: 'Author', note: 'Figures 3 and 7 should be full-width — do not reduce to column width. Captions must match submitted caption file.', type: 'request' },
  { id: 'r3', date: new Date(Date.now() - 4 * 60 * 60 * 1000), actor: 'Maria Rodriguez', role: 'TWG Coordinator', note: 'Initial layout target: 12 May 2026. Priority: HIGH. Ensure ISBN block is positioned per journal template v2.4.', type: 'internal' },
];

const thumbnailPages = [1, 2, 3, 4, 5, 6, 7, 8];

export function TWGInitialBookLayoutPage({ manuscript, onBack }: TWGInitialBookLayoutPageProps) {
  const [activeNav, setActiveNav] = useState<ActiveNav>('initial_layout');
  const [selectedTemplate, setSelectedTemplate] = useState<SelectedTemplate>('academic');
  const [activeTool, setActiveTool] = useState<ActiveTool>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [zoomLevel, setZoomLevel] = useState(100);
  const [selectedThumbPage, setSelectedThumbPage] = useState(1);
  const [showToolPanel, setShowToolPanel] = useState(false);
  const [twgNotes, setTwgNotes] = useState('');
  const [layoutStatus, setLayoutStatus] = useState<'in_progress' | 'draft_saved' | 'ready_review' | 'sent'>('in_progress');

  const daysUntilDue = 8;
  const complexityScore = 74;
  const workloadPct = 62;
  const delayRisk = 28;
  const completionEst = 5;

  const statusLabels = {
    in_progress: { label: 'In Layout Stage', color: 'bg-blue-100 text-blue-800' },
    draft_saved: { label: 'Draft Saved', color: 'bg-gray-100 text-gray-800' },
    ready_review: { label: 'Ready for Review', color: 'bg-green-100 text-green-800' },
    sent: { label: 'Sent to Coordinator', color: 'bg-purple-100 text-purple-800' },
  };

  const handleZoomIn = () => setZoomLevel(z => Math.min(z + 10, 150));
  const handleZoomOut = () => setZoomLevel(z => Math.max(z - 10, 60));

  const handleToolClick = (tool: ActiveTool) => {
    setActiveTool(prev => prev === tool ? null : tool);
    setShowToolPanel(tool !== null && activeTool !== tool);
  };

  /* ── Simulated book page spread ── */
  const BookSpread = () => (
    <div className="flex gap-2 items-stretch justify-center" style={{ transform: `scale(${zoomLevel / 100})`, transformOrigin: 'top center', transition: 'transform 0.2s' }}>
      {/* Left page */}
      <div className="bg-white shadow-xl border border-gray-200 flex flex-col" style={{ width: '310px', minHeight: '440px', fontFamily: 'Georgia, serif' }}>
        {/* Header band */}
        <div className="flex items-center justify-between px-5 pt-3 pb-1 border-b border-gray-100">
          <span className="text-[7px] text-gray-400 uppercase tracking-widest truncate max-w-[160px]">{manuscript.journal}</span>
          <span className="text-[7px] text-gray-400">{currentPage * 2 - 1}</span>
        </div>
        <div className="flex gap-3 flex-1 px-5 py-3">
          {/* Main column */}
          <div className="flex-1 space-y-2">
            {/* Chapter heading */}
            <div className="h-3.5 bg-gray-700 rounded w-2/3 mb-2" />
            <div className="h-1.5 bg-gray-400 rounded w-1/2 mb-3" />
            {/* Body text lines */}
            {Array.from({ length: 5 }).map((_, i) => (
              <div key={i} className="h-1.5 bg-gray-200 rounded" style={{ width: i % 4 === 3 ? '75%' : '100%' }} />
            ))}
            {/* Figure */}
            <div className="bg-gray-100 border border-gray-200 rounded h-16 flex flex-col items-center justify-center gap-1 my-2">
              <div className="w-8 h-6 bg-gray-300 rounded" />
              <span className="text-[6px] text-gray-400">Figure 1</span>
            </div>
            {/* Caption */}
            <div className="h-1 bg-gray-300 rounded w-3/4 mx-auto" />
            {/* More text */}
            {Array.from({ length: 6 }).map((_, i) => (
              <div key={i} className="h-1.5 bg-gray-200 rounded" style={{ width: i % 5 === 4 ? '60%' : '100%' }} />
            ))}
          </div>
          {/* Margin annotation area */}
          <div className="w-7 flex flex-col gap-2 pt-1">
            <div className="h-1 bg-amber-200 rounded w-full" />
            <div className="h-1 bg-blue-200 rounded w-full" style={{ marginTop: '24px' }} />
          </div>
        </div>
        <div className="flex items-center justify-between px-5 py-1.5 border-t border-gray-100">
          <span className="text-[6px] text-gray-400 uppercase tracking-widest">Chapter 2</span>
          <span className="text-[7px] text-gray-400">{currentPage * 2 - 1}</span>
        </div>
      </div>

      {/* Right page */}
      <div className="bg-white shadow-xl border border-gray-200 flex flex-col" style={{ width: '310px', minHeight: '440px', fontFamily: 'Georgia, serif' }}>
        <div className="flex items-center justify-between px-5 pt-3 pb-1 border-b border-gray-100">
          <span className="text-[7px] text-gray-400">{currentPage * 2}</span>
          <span className="text-[7px] text-gray-400 uppercase tracking-widest truncate max-w-[160px]">{manuscript.title.substring(0, 28)}</span>
        </div>
        <div className="flex gap-3 flex-1 px-5 py-3">
          <div className="w-7 flex flex-col gap-2 pt-1">
            <div className="h-1 bg-green-200 rounded w-full" style={{ marginTop: '36px' }} />
          </div>
          <div className="flex-1 space-y-2">
            {/* Sub-heading */}
            <div className="h-2.5 bg-gray-600 rounded w-1/2 mb-2" />
            {Array.from({ length: 4 }).map((_, i) => (
              <div key={i} className="h-1.5 bg-gray-200 rounded" style={{ width: i % 3 === 2 ? '80%' : '100%' }} />
            ))}
            {/* Table */}
            <div className="border border-gray-300 rounded overflow-hidden my-2">
              <div className="bg-gray-700 h-4 flex items-center gap-2 px-2">
                {[40, 30, 30].map((w, i) => <div key={i} className="h-1 bg-gray-400 rounded" style={{ width: `${w}%` }} />)}
              </div>
              {[0, 1, 2].map(row => (
                <div key={row} className={`h-3.5 flex items-center gap-2 px-2 ${row % 2 === 0 ? 'bg-gray-50' : 'bg-white'}`}>
                  {[40, 30, 30].map((w, i) => <div key={i} className="h-1 bg-gray-200 rounded" style={{ width: `${w}%` }} />)}
                </div>
              ))}
            </div>
            <div className="h-1 bg-gray-300 rounded w-2/3 mx-auto" />
            {Array.from({ length: 6 }).map((_, i) => (
              <div key={i} className="h-1.5 bg-gray-200 rounded" style={{ width: i % 4 === 3 ? '55%' : '100%' }} />
            ))}
            {/* Second figure */}
            <div className="bg-blue-50 border border-blue-200 rounded h-12 flex flex-col items-center justify-center gap-1 my-2">
              <div className="flex gap-1">
                {[8, 12, 10, 14, 9].map((h, i) => <div key={i} className="w-1.5 bg-blue-300 rounded-sm" style={{ height: `${h}px` }} />)}
              </div>
              <span className="text-[6px] text-blue-400">Figure 2 — Chart</span>
            </div>
          </div>
        </div>
        <div className="flex items-center justify-between px-5 py-1.5 border-t border-gray-100">
          <span className="text-[7px] text-gray-400">{currentPage * 2}</span>
          <span className="text-[6px] text-gray-400 uppercase tracking-widest">Neuroplasticity Study</span>
        </div>
      </div>
    </div>
  );

  /* ── Template preview card ── */
  const TemplateCard = ({ t }: { t: typeof templates[0] }) => {
    const isSelected = selectedTemplate === t.id;
    return (
      <button
        onClick={() => setSelectedTemplate(t.id)}
        className={`text-left rounded-xl border-2 overflow-hidden transition-all ${
          isSelected ? 'border-[#1a1f2e] shadow-md ring-2 ring-[#1a1f2e]/20' : 'border-gray-200 hover:border-gray-400 hover:shadow-sm'
        }`}
      >
        {/* Mini page preview */}
        <div className={`h-28 flex ${t.cols === 2 ? 'gap-1.5 p-3' : 'p-3'} ${isSelected ? 'bg-[#0F2D5E]' : 'bg-gray-100'}`}>
          {Array.from({ length: t.cols }).map((_, ci) => (
            <div key={ci} className="flex-1 bg-white rounded shadow-sm p-2 space-y-1">
              <div className={`h-2 rounded ${isSelected ? 'bg-gray-600' : 'bg-gray-400'}`} style={{ width: ci === 0 ? '70%' : '55%' }} />
              {Array.from({ length: 5 }).map((_, li) => (
                <div key={li} className="h-1 bg-gray-200 rounded" style={{ width: li % 3 === 2 ? '65%' : '100%' }} />
              ))}
              {ci === 0 && <div className="h-6 bg-gray-100 rounded border border-gray-200 mt-1" />}
            </div>
          ))}
        </div>
        <div className="p-3 bg-white">
          <div className="flex items-center justify-between mb-1">
            <p className="text-sm font-bold text-gray-900">{t.label}</p>
            {isSelected && <CheckCircle className="w-4 h-4 text-emerald-600" />}
          </div>
          <p className="text-xs text-gray-500 leading-snug mb-2">{t.desc}</p>
          <div className="flex gap-3 text-xs text-gray-400">
            <span>~{t.pages}pp</span>
            <span>{t.cols} col{t.cols > 1 ? 's' : ''}</span>
            <span className="truncate">{t.font}</span>
          </div>
        </div>
      </button>
    );
  };

  return (
    <div className="flex h-screen bg-[#F7F8FA] overflow-hidden">

      {/* ── LEFT SIDEBAR ── */}
      <aside className="w-60 bg-[#0F2D5E] flex flex-col flex-shrink-0 overflow-y-auto">
        {/* Logo / system name */}
        <div className="px-5 py-5 border-b border-slate-700">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 bg-amber-400 rounded flex items-center justify-center">
              <BookOpen className="w-4 h-4 text-[#0F2D5E]" />
            </div>
            <div>
              <p className="text-white text-sm font-bold leading-tight">TWG</p>
              <p className="text-slate-400 text-[10px] leading-tight">Production Suite</p>
            </div>
          </div>
        </div>

        {/* Nav items */}
        <nav className="flex-1 py-4 px-3 space-y-0.5">
          {navItems.map(({ id, label, icon: Icon, badge }) => {
            const isActive = activeNav === id;
            return (
              <button
                key={id}
                onClick={() => { setActiveNav(id); if (id === 'dashboard') onBack(); }}
                className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-left transition-all text-sm ${
                  isActive
                    ? 'bg-amber-400 text-[#0F2D5E] font-semibold shadow-sm'
                    : 'text-slate-400 hover:bg-slate-700/50 hover:text-white'
                }`}
              >
                <Icon className={`w-4 h-4 flex-shrink-0 ${isActive ? 'text-[#0F2D5E]' : ''}`} />
                <span className="flex-1 truncate">{label}</span>
                {badge && (
                  <span className="bg-red-500 text-white text-[9px] font-bold rounded-full px-1.5 py-0.5 min-w-[18px] text-center">{badge}</span>
                )}
              </button>
            );
          })}
        </nav>

        {/* User info */}
        <div className="px-4 py-4 border-t border-slate-700">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 bg-purple-500 rounded-full flex items-center justify-center text-white text-xs font-bold">ET</div>
            <div className="flex-1 min-w-0">
              <p className="text-white text-xs font-semibold truncate">Emma Thompson</p>
              <p className="text-slate-400 text-[10px] truncate">TWG Layout Artist</p>
            </div>
            <button onClick={onBack} className="text-slate-500 hover:text-red-400 transition-colors">
              <LogOut className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      </aside>

      {/* ── MAIN AREA ── */}
      <div className="flex-1 flex flex-col overflow-hidden">

        {/* ── TOP HEADER ── */}
        <header className="bg-white border-b border-gray-200 shadow-sm flex-shrink-0">
          {/* Top bar */}
          <div className="px-6 py-3 flex items-center justify-between gap-4">
            <div className="flex items-center gap-3 min-w-0">
              {/* Breadcrumb */}
              <nav className="flex items-center gap-1.5 text-sm text-gray-500">
                <button onClick={onBack} className="hover:text-gray-900 transition-colors">Dashboard</button>
                <ChevronRight className="w-3.5 h-3.5 text-gray-400" />
                <span className="text-gray-400">Assigned Manuscripts</span>
                <ChevronRight className="w-3.5 h-3.5 text-gray-400" />
                <span className="font-semibold text-[#0F2D5E] truncate max-w-xs">{manuscript.title}</span>
              </nav>
            </div>

            {/* Header right */}
            <div className="flex items-center gap-4 flex-shrink-0">
              {/* Search */}
              <div className="relative hidden lg:block">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-gray-400" />
                <input type="text" placeholder="Search layouts…" className="pl-9 pr-4 py-1.5 text-sm border border-gray-200 rounded-lg bg-gray-50 focus:outline-none focus:ring-2 focus:ring-[#1a1f2e] w-44" />
              </div>
              {/* Notifications */}
              <button className="relative p-2 text-gray-500 hover:text-gray-900 transition-colors">
                <Bell className="w-5 h-5" />
                <span className="absolute top-1 right-1 w-2 h-2 bg-red-500 rounded-full" />
              </button>
              {/* Profile */}
              <div className="flex items-center gap-2 cursor-pointer">
                <div className="w-8 h-8 bg-purple-500 rounded-full flex items-center justify-center text-white text-xs font-bold">ET</div>
                <ChevronDown className="w-3.5 h-3.5 text-gray-400" />
              </div>
            </div>
          </div>

          {/* Page title row + status + countdown */}
          <div className="px-6 py-2 flex items-center justify-between gap-4 bg-gray-50 border-t border-gray-100">
            <div className="flex items-center gap-4">
              <div>
                <h1 className="text-lg font-bold font-serif text-[#0F2D5E]">Initial Book Layout</h1>
                <p className="text-xs text-gray-500 truncate max-w-sm">{manuscript.title}</p>
              </div>
              <span className={`text-xs font-semibold px-2.5 py-1 rounded-full ${statusLabels[layoutStatus].color}`}>
                {statusLabels[layoutStatus].label}
              </span>
            </div>

            {/* Due date + workflow stages */}
            <div className="flex items-center gap-6">
              <div className="flex items-center gap-2 text-sm">
                <Calendar className="w-4 h-4 text-amber-500" />
                <div>
                  <span className="text-xs text-gray-500 block leading-none">Due in</span>
                  <span className="font-bold text-amber-600">{daysUntilDue} days</span>
                </div>
              </div>

              {/* Compact workflow tracker */}
              <div className="hidden xl:flex items-center gap-0">
                {workflowStages.map((stage, idx) => (
                  <React.Fragment key={stage.label}>
                    <div className="flex flex-col items-center">
                      <div className={`w-4 h-4 rounded-full flex items-center justify-center text-[8px] font-bold border ${
                        stage.done ? 'bg-emerald-500 border-emerald-500 text-white' :
                        stage.active ? 'bg-[#0F2D5E] border-[#1a1f2e] text-white' :
                        'bg-white border-gray-300 text-gray-400'
                      }`}>
                        {stage.done ? '✓' : idx + 1}
                      </div>
                      <span className={`text-[8px] mt-0.5 whitespace-nowrap ${stage.active ? 'text-[#0F2D5E] font-bold' : stage.done ? 'text-emerald-600' : 'text-gray-400'}`}>
                        {stage.label}
                      </span>
                    </div>
                    {idx < workflowStages.length - 1 && (
                      <div className={`h-px w-5 mb-3 ${stage.done ? 'bg-emerald-500' : 'bg-gray-200'}`} />
                    )}
                  </React.Fragment>
                ))}
              </div>
            </div>
          </div>
        </header>

        {/* ── SCROLLABLE CONTENT ── */}
        <div className="flex-1 overflow-y-auto">
          <div className="p-6 space-y-5 max-w-[1200px] mx-auto">

            {/* ── ROW 1: Manuscript Info + Analytics cards ── */}
            <div className="grid grid-cols-12 gap-5">
              {/* Manuscript Info */}
              <div className="col-span-12 lg:col-span-5 bg-white rounded-xl border border-gray-200 shadow-sm p-5">
                <div className="flex items-center gap-2 mb-4">
                  <BookOpen className="w-4 h-4 text-[#0F2D5E]" />
                  <h2 className="text-sm font-bold font-serif text-[#0F2D5E] uppercase tracking-wide">Manuscript Information</h2>
                </div>
                <div className="space-y-2.5">
                  {[
                    { label: 'Title', value: manuscript.title, bold: true },
                    { label: 'Author', value: 'Dr. Jane Smith' },
                    { label: 'Category', value: manuscript.journal },
                    { label: 'Assigned Editor', value: 'Dr. Sarah Johnson' },
                    { label: 'Submission Date', value: new Date(manuscript.submissionDate).toLocaleDateString() },
                    { label: 'Target Publication', value: 'September 2026' },
                    { label: 'Current Stage', value: 'Initial Book Layout', highlight: true },
                    { label: 'Est. Timeline', value: `${completionEst} business days` },
                  ].map(({ label, value, bold, highlight }) => (
                    <div key={label} className="flex items-start justify-between gap-2 text-sm">
                      <span className="text-gray-500 font-medium flex-shrink-0 w-36">{label}</span>
                      <span className={`text-right leading-tight ${bold ? 'font-semibold text-gray-900' : highlight ? 'font-semibold text-blue-700' : 'text-gray-800'}`}>{value}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Analytics mini-cards (2×2) */}
              <div className="col-span-12 lg:col-span-7 grid grid-cols-2 gap-4">
                {[
                  { label: 'Layout Complexity', value: complexityScore, unit: '/100', color: 'text-amber-600', bg: 'bg-amber-50', barColor: 'bg-amber-400', icon: BarChart2, desc: 'Moderate complexity' },
                  { label: 'Workload Index', value: workloadPct, unit: '%', color: 'text-blue-700', bg: 'bg-blue-50', barColor: 'bg-blue-500', icon: Activity, desc: 'Current sprint load' },
                  { label: 'Delay Risk', value: delayRisk, unit: '%', color: delayRisk > 40 ? 'text-red-600' : 'text-green-700', bg: delayRisk > 40 ? 'bg-red-50' : 'bg-green-50', barColor: delayRisk > 40 ? 'bg-red-400' : 'bg-green-500', icon: AlertTriangle, desc: 'Low risk — on track' },
                  { label: 'Est. Completion', value: completionEst, unit: ' days', color: 'text-purple-700', bg: 'bg-purple-50', barColor: 'bg-purple-400', icon: Clock, desc: 'From today' },
                ].map(({ label, value, unit, color, bg, barColor, icon: Icon, desc }) => (
                  <div key={label} className={`${bg} rounded-xl border border-gray-200 p-4 flex flex-col gap-2`}>
                    <div className="flex items-center justify-between">
                      <p className="text-xs font-semibold text-gray-600">{label}</p>
                      <Icon className={`w-4 h-4 ${color}`} />
                    </div>
                    <p className={`text-3xl font-bold ${color}`}>{value}<span className="text-base font-normal text-gray-400">{unit}</span></p>
                    <div className="h-1.5 bg-gray-200 rounded-full overflow-hidden">
                      <div className={`h-full rounded-full ${barColor}`} style={{ width: `${Math.min(value, 100)}%` }} />
                    </div>
                    <p className="text-xs text-gray-500">{desc}</p>
                  </div>
                ))}
              </div>
            </div>

            {/* ── ROW 2: Layout Workspace ── */}
            <div className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden">
              {/* Workspace header */}
              <div className="px-5 py-3 border-b border-gray-200 flex items-center justify-between gap-4 bg-gray-50">
                <div className="flex items-center gap-2">
                  <Layers className="w-4 h-4 text-[#0F2D5E]" />
                  <h2 className="text-sm font-bold font-serif text-[#0F2D5E] uppercase tracking-wide">Layout Workspace</h2>
                  <span className="text-xs text-gray-400 ml-2">Template: <span className="font-medium text-gray-700">{templates.find(t => t.id === selectedTemplate)?.label ?? '—'}</span></span>
                </div>
                <div className="flex items-center gap-2">
                  {/* Zoom controls */}
                  <button onClick={handleZoomOut} className="p-1.5 rounded border border-gray-200 hover:bg-gray-100 transition-colors"><ZoomOut className="w-3.5 h-3.5 text-gray-600" /></button>
                  <span className="text-xs font-mono text-gray-600 w-12 text-center">{zoomLevel}%</span>
                  <button onClick={handleZoomIn} className="p-1.5 rounded border border-gray-200 hover:bg-gray-100 transition-colors"><ZoomIn className="w-3.5 h-3.5 text-gray-600" /></button>
                  <div className="w-px h-5 bg-gray-200 mx-1" />
                  {/* Page nav */}
                  <button onClick={() => setCurrentPage(p => Math.max(1, p - 1))} disabled={currentPage === 1} className="p-1.5 rounded border border-gray-200 hover:bg-gray-100 disabled:opacity-40 transition-colors"><ChevronLeft className="w-3.5 h-3.5 text-gray-600" /></button>
                  <span className="text-xs text-gray-600 font-medium w-16 text-center">Spread {currentPage}/{thumbnailPages.length}</span>
                  <button onClick={() => setCurrentPage(p => Math.min(thumbnailPages.length, p + 1))} disabled={currentPage === thumbnailPages.length} className="p-1.5 rounded border border-gray-200 hover:bg-gray-100 disabled:opacity-40 transition-colors"><ChevronRight className="w-3.5 h-3.5 text-gray-600" /></button>
                  <div className="w-px h-5 bg-gray-200 mx-1" />
                  <button className="p-1.5 rounded border border-gray-200 hover:bg-gray-100 transition-colors"><Maximize2 className="w-3.5 h-3.5 text-gray-600" /></button>
                </div>
              </div>

              {/* Toolbar */}
              <div className="px-5 py-2 border-b border-gray-100 bg-gray-50 flex items-center gap-1 flex-wrap">
                {toolbarGroups.map((group, gi) => (
                  <React.Fragment key={group.label}>
                    {gi > 0 && <div className="w-px h-5 bg-gray-300 mx-1" />}
                    <span className="text-[9px] text-gray-400 uppercase tracking-widest mr-1">{group.label}</span>
                    {group.tools.map(({ id, icon: TIcon, label }) => (
                      <button
                        key={id}
                        onClick={() => handleToolClick(id)}
                        title={label}
                        className={`flex items-center gap-1.5 px-2.5 py-1.5 rounded-md text-xs font-medium transition-colors ${
                          activeTool === id
                            ? 'bg-[#0F2D5E] text-white'
                            : 'text-gray-600 hover:bg-gray-200'
                        }`}
                      >
                        <TIcon className="w-3.5 h-3.5" />
                        <span className="hidden xl:inline">{label}</span>
                      </button>
                    ))}
                  </React.Fragment>
                ))}
              </div>

              {/* Workspace body */}
              <div className="flex h-[500px]">
                {/* Thumbnail strip */}
                <div className="w-24 border-r border-gray-200 bg-gray-50 overflow-y-auto py-3 flex flex-col gap-2 items-center flex-shrink-0">
                  {thumbnailPages.map((pg) => (
                    <button
                      key={pg}
                      onClick={() => { setSelectedThumbPage(pg); setCurrentPage(pg); }}
                      className={`w-16 rounded border-2 transition-all flex flex-col overflow-hidden ${
                        selectedThumbPage === pg ? 'border-[#1a1f2e] shadow-md' : 'border-gray-200 hover:border-gray-400'
                      }`}
                    >
                      <div className="bg-white p-1 space-y-0.5" style={{ minHeight: '58px' }}>
                        <div className="h-1 bg-gray-400 rounded w-2/3" />
                        {Array.from({ length: 5 }).map((_, i) => (
                          <div key={i} className="h-0.5 bg-gray-200 rounded" style={{ width: i % 3 === 2 ? '70%' : '100%' }} />
                        ))}
                        <div className="h-4 bg-gray-100 rounded border border-gray-200 mt-0.5" />
                        {Array.from({ length: 3 }).map((_, i) => (
                          <div key={i} className="h-0.5 bg-gray-200 rounded" />
                        ))}
                      </div>
                      <div className="bg-gray-100 text-[8px] text-gray-500 text-center py-0.5 font-medium">{pg * 2 - 1}–{pg * 2}</div>
                    </button>
                  ))}
                </div>

                {/* Main preview area */}
                <div className="flex-1 overflow-auto bg-gray-200 flex items-start justify-center py-8 px-6">
                  <BookSpread />
                </div>

                {/* Tool settings panel (appears when tool active) */}
                {activeTool && (
                  <div className="w-52 border-l border-gray-200 bg-white p-4 flex-shrink-0 overflow-y-auto">
                    <div className="flex items-center justify-between mb-3">
                      <p className="text-xs font-bold text-[#0F2D5E] uppercase tracking-wide">{activeTool.charAt(0).toUpperCase() + activeTool.slice(1)}</p>
                      <button onClick={() => setActiveTool(null)} className="text-gray-400 hover:text-gray-700"><Minus className="w-3.5 h-3.5" /></button>
                    </div>
                    {activeTool === 'margins' && (
                      <div className="space-y-3">
                        {['Top', 'Bottom', 'Inside', 'Outside'].map(side => (
                          <div key={side}>
                            <label className="text-[10px] text-gray-500 font-medium">{side} Margin</label>
                            <div className="flex items-center gap-2 mt-1">
                              <input type="range" min="10" max="40" defaultValue="25" className="flex-1 h-1 accent-[#1a1f2e]" />
                              <span className="text-[10px] text-gray-600 w-8 text-right">25mm</span>
                            </div>
                          </div>
                        ))}
                      </div>
                    )}
                    {activeTool === 'typography' && (
                      <div className="space-y-3">
                        {[
                          { label: 'Body Font', val: 'Palatino' },
                          { label: 'Heading Font', val: 'Georgia' },
                          { label: 'Body Size', val: '11pt' },
                          { label: 'Leading', val: '14pt' },
                        ].map(({ label, val }) => (
                          <div key={label}>
                            <label className="text-[10px] text-gray-500 font-medium">{label}</label>
                            <div className="mt-1 px-2 py-1.5 bg-gray-50 border border-gray-200 rounded text-xs text-gray-800">{val}</div>
                          </div>
                        ))}
                      </div>
                    )}
                    {(activeTool !== 'margins' && activeTool !== 'typography') && (
                      <div className="space-y-2">
                        <p className="text-xs text-gray-400">Configure {activeTool} settings…</p>
                        <div className="h-1.5 bg-gray-100 rounded-full"><div className="h-full w-2/3 bg-[#0F2D5E] rounded-full" /></div>
                        <div className="h-1.5 bg-gray-100 rounded-full"><div className="h-full w-1/2 bg-amber-400 rounded-full" /></div>
                      </div>
                    )}
                  </div>
                )}
              </div>
            </div>

            {/* ── ROW 3: Layout Templates ── */}
            <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-5">
              <div className="flex items-center gap-2 mb-4">
                <Columns className="w-4 h-4 text-[#0F2D5E]" />
                <h2 className="text-sm font-bold font-serif text-[#0F2D5E] uppercase tracking-wide">Layout Templates</h2>
                <span className="ml-auto text-xs text-gray-400">Select a template to apply to the manuscript</span>
              </div>
              <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
                {templates.map(t => <TemplateCard key={t.id} t={t} />)}
              </div>
            </div>

            {/* ── ROW 4: Timeline + Revision & Notes ── */}
            <div className="grid grid-cols-12 gap-5">

              {/* Timeline Recommendation */}
              <div className="col-span-12 lg:col-span-6 bg-white rounded-xl border border-gray-200 shadow-sm p-5">
                <div className="flex items-center gap-2 mb-4">
                  <TrendingUp className="w-4 h-4 text-[#0F2D5E]" />
                  <h2 className="text-sm font-bold font-serif text-[#0F2D5E] uppercase tracking-wide">AI Timeline Recommendation</h2>
                </div>

                <div className="grid grid-cols-2 gap-3 mb-4">
                  {[
                    { label: 'Est. Completion', value: `${completionEst} days`, icon: Clock, badge: 'On Track', badgeColor: 'bg-green-100 text-green-700' },
                    { label: 'Complexity Score', value: `${complexityScore}/100`, icon: BarChart2, badge: 'Moderate', badgeColor: 'bg-amber-100 text-amber-700' },
                    { label: 'Workload Load', value: `${workloadPct}%`, icon: Activity, badge: 'Normal', badgeColor: 'bg-blue-100 text-blue-700' },
                    { label: 'Delay Risk', value: `${delayRisk}%`, icon: AlertTriangle, badge: 'Low', badgeColor: 'bg-green-100 text-green-700' },
                  ].map(({ label, value, icon: Ic, badge, badgeColor }) => (
                    <div key={label} className="bg-gray-50 rounded-lg border border-gray-100 p-3">
                      <div className="flex items-center gap-1.5 mb-1">
                        <Ic className="w-3.5 h-3.5 text-gray-500" />
                        <span className="text-[10px] text-gray-500 font-medium">{label}</span>
                      </div>
                      <p className="text-xl font-bold text-gray-900 mb-1.5">{value}</p>
                      <span className={`text-[10px] px-2 py-0.5 rounded-full font-semibold ${badgeColor}`}>{badge}</span>
                    </div>
                  ))}
                </div>

                {/* AI suggestions */}
                <div className="space-y-2.5">
                  <p className="text-xs font-semibold text-gray-700 uppercase tracking-wide">Suggested Adjustments</p>
                  {[
                    { icon: Info, color: 'text-blue-500', msg: 'Apply academic journal template now to reduce formatting iteration time by ~35%.' },
                    { icon: AlertTriangle, color: 'text-amber-500', msg: 'Figure-heavy manuscripts: set image placement rules before body flow to avoid reflow at proof stage.' },
                    { icon: CheckCircle, color: 'text-green-500', msg: 'Current workload is within optimal range. Batch chapter sections 3–6 in a single session.' },
                  ].map(({ icon: Ic, color, msg }, i) => (
                    <div key={i} className="flex items-start gap-2.5 px-3 py-2.5 bg-gray-50 rounded-lg border border-gray-100 text-xs">
                      <Ic className={`w-3.5 h-3.5 flex-shrink-0 mt-0.5 ${color}`} />
                      <p className="text-gray-700">{msg}</p>
                    </div>
                  ))}
                </div>

                {/* Stage timeline bar */}
                <div className="mt-4 space-y-1.5">
                  <p className="text-xs font-semibold text-gray-700 uppercase tracking-wide">Stage Timeline</p>
                  {[
                    { label: 'Initial Layout', pct: 40, color: 'bg-blue-500', days: '2d' },
                    { label: 'Composition', pct: 0, color: 'bg-gray-300', days: '2d' },
                    { label: 'Proof Review', pct: 0, color: 'bg-gray-300', days: '1d' },
                  ].map(({ label, pct, color, days }) => (
                    <div key={label} className="flex items-center gap-2">
                      <span className="text-[10px] text-gray-500 w-24 flex-shrink-0">{label}</span>
                      <div className="flex-1 h-2 bg-gray-100 rounded-full overflow-hidden">
                        <div className={`h-full rounded-full ${color}`} style={{ width: `${pct}%` }} />
                      </div>
                      <span className="text-[10px] text-gray-400 w-5 text-right">{days}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Revision & Notes Panel */}
              <div className="col-span-12 lg:col-span-6 bg-white rounded-xl border border-gray-200 shadow-sm p-5">
                <div className="flex items-center gap-2 mb-4">
                  <MessageSquare className="w-4 h-4 text-[#0F2D5E]" />
                  <h2 className="text-sm font-bold font-serif text-[#0F2D5E] uppercase tracking-wide">Revision & Notes</h2>
                  <span className="ml-auto text-xs px-2 py-0.5 bg-gray-100 text-gray-700 rounded-full font-medium">{revisionHistory.length} entries</span>
                </div>

                <div className="space-y-3 mb-4 max-h-64 overflow-y-auto pr-1">
                  {revisionHistory.map((entry) => (
                    <div key={entry.id} className={`px-3 py-3 rounded-lg border text-xs ${
                      entry.type === 'comment' ? 'bg-blue-50 border-blue-100' :
                      entry.type === 'request' ? 'bg-amber-50 border-amber-100' :
                      'bg-gray-50 border-gray-100'
                    }`}>
                      <div className="flex items-center gap-2 mb-1.5 flex-wrap">
                        <span className={`font-semibold ${
                          entry.type === 'comment' ? 'text-blue-800' :
                          entry.type === 'request' ? 'text-amber-800' : 'text-gray-700'
                        }`}>{entry.actor}</span>
                        <span className={`text-[9px] px-1.5 py-0.5 rounded-full font-semibold ${
                          entry.type === 'comment' ? 'bg-blue-100 text-blue-700' :
                          entry.type === 'request' ? 'bg-amber-100 text-amber-700' :
                          'bg-gray-200 text-gray-600'
                        }`}>{entry.role}</span>
                        <span className="text-gray-400 text-[9px] ml-auto">{entry.date.toLocaleDateString()}</span>
                      </div>
                      <p className="text-gray-700 leading-relaxed">{entry.note}</p>
                    </div>
                  ))}
                </div>

                {/* Internal TWG notes input */}
                <div className="mb-3">
                  <label className="text-[10px] font-semibold text-gray-600 uppercase tracking-wide mb-1 block">Internal TWG Notes</label>
                  <textarea
                    value={twgNotes}
                    onChange={e => setTwgNotes(e.target.value)}
                    rows={3}
                    placeholder="Add internal production notes, layout decisions, or flagged items for the coordinator…"
                    className="w-full text-sm border border-gray-200 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-[#1a1f2e] resize-none text-gray-800 placeholder-gray-400"
                  />
                </div>

                <button className="w-full flex items-center justify-center gap-2 px-4 py-2.5 border-2 border-dashed border-gray-300 rounded-lg text-sm text-gray-500 hover:border-[#1a1f2e] hover:text-[#0F2D5E] transition-colors">
                  <Upload className="w-4 h-4" />
                  Upload Revised Layout File
                </button>
              </div>
            </div>

            {/* ── Bottom spacer for action bar ── */}
            <div className="h-20" />
          </div>
        </div>
      </div>

      {/* ── STICKY BOTTOM ACTION BAR ── */}
      <div className="absolute bottom-0 left-60 right-0 z-40 bg-white border-t border-gray-200 shadow-lg">
        <div className="px-6 py-3 flex items-center justify-between gap-3">
          <div className="flex items-center gap-2">
            <button
              onClick={() => setLayoutStatus('draft_saved')}
              className="flex items-center gap-1.5 px-4 py-2 text-sm font-medium text-gray-700 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
            >
              <Save className="w-4 h-4" /> Save Draft
            </button>
            <button className="flex items-center gap-1.5 px-4 py-2 text-sm font-medium text-gray-700 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors">
              <RefreshCw className="w-4 h-4" /> Generate Initial Layout
            </button>
            <button className="flex items-center gap-1.5 px-4 py-2 text-sm font-medium text-gray-700 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors">
              <Download className="w-4 h-4" /> Export PDF
            </button>
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={() => setLayoutStatus('ready_review')}
              className="flex items-center gap-1.5 px-4 py-2 text-sm font-semibold text-emerald-700 bg-emerald-50 border border-emerald-200 rounded-lg hover:bg-emerald-600 hover:text-white transition-colors"
            >
              <CheckCircle className="w-4 h-4" /> Mark as Ready for Review
            </button>
            <button
              onClick={() => setLayoutStatus('sent')}
              className="flex items-center gap-1.5 px-5 py-2 text-sm font-semibold text-white bg-[#0F2D5E] rounded-lg hover:bg-[#252b3d] transition-colors"
            >
              <Send className="w-4 h-4" /> Send to TWG Coordinator
            </button>
            <button onClick={onBack} className="px-4 py-2 text-sm text-gray-500 hover:text-gray-700 transition-colors">Cancel</button>
          </div>
        </div>
      </div>
    </div>
  );
}
