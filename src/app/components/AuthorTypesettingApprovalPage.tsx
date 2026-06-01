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
  XCircle,
  Info,
  BookOpen,
  CalendarClock,
  Activity,
  History,
  Bell,
  Layout,
  ThumbsUp,
  Layers,
} from 'lucide-react';
import type { Manuscript } from '../types';

interface AuthorTypesettingApprovalPageProps {
  manuscript: Manuscript;
  onBack: () => void;
}

type PageStatus =
  | 'under_review'
  | 'approved'
  | 'minor_revision'
  | 'major_revision'
  | 'production_ready';

type ApprovalDecision = 'approve' | 'minor_revision' | 'major_revision' | null;

interface ChecklistItem {
  id: string;
  label: string;
  checked: boolean;
}

export function AuthorTypesettingApprovalPage({ manuscript, onBack }: AuthorTypesettingApprovalPageProps) {
  const [pageStatus, setPageStatus] = useState<PageStatus>('under_review');
  const [decision, setDecision] = useState<ApprovalDecision>(null);
  const [showConfirmModal, setShowConfirmModal] = useState(false);
  const [activePreview, setActivePreview] = useState<'full' | 'comparison' | 'figures'>('full');
  const [approvalRemarks, setApprovalRemarks] = useState('');
  const [minorCorrections, setMinorCorrections] = useState('');
  const [layoutIssues, setLayoutIssues] = useState('');

  const [checklistItems, setChecklistItems] = useState<ChecklistItem[]>([
    { id: 'c1', label: 'Formatting acceptable', checked: true },
    { id: 'c2', label: 'Figures correctly placed', checked: true },
    { id: 'c3', label: 'Tables correctly formatted', checked: false },
    { id: 'c4', label: 'Readability acceptable', checked: true },
    { id: 'c5', label: 'No content distortion', checked: true },
    { id: 'c6', label: 'Overall layout approved', checked: false },
  ]);

  const toggleCheck = (id: string) => {
    setChecklistItems(prev => prev.map(item => item.id === id ? { ...item, checked: !item.checked } : item));
  };

  const checkedCount = checklistItems.filter(i => i.checked).length;
  const completeness = Math.round((checkedCount / checklistItems.length) * 100);

  const workflowStages = ['Submission', 'Copyediting', 'Typesetting', 'Editor Review', 'Author Approval', 'Production'];
  const currentStageIndex = 4;

  const activityLog = [
    { id: 'a1', timestamp: new Date(Date.now() - 30 * 60 * 1000), action: 'Author typeset approval session opened', user: 'Dr. Jane Smith' },
    { id: 'a2', timestamp: new Date(Date.now() - 1 * 60 * 60 * 1000), action: 'Typeset PDF v1.0 downloaded for review', user: 'Dr. Jane Smith' },
    { id: 'a3', timestamp: new Date(Date.now() - 2 * 60 * 60 * 1000), action: 'Typeset manuscript forwarded to author by editor Dr. Sarah Johnson', user: 'System' },
    { id: 'a4', timestamp: new Date(Date.now() - 3 * 60 * 60 * 1000), action: 'Editor layout review completed — approved for author review', user: 'System' },
  ];

  const alerts = [
    { id: 'al1', type: 'deadline', message: 'Approval deadline: 3 days remaining. Your timely response is needed to avoid production delays.' },
    { id: 'al2', type: 'warning', message: 'Table 3 formatting flagged — please verify column widths and caption accuracy.' },
    { id: 'al3', type: 'info', message: 'Typeset PDF v1.0 is ready for your review. This is the final layout before production.' },
    { id: 'al4', type: 'info', message: 'Once approved, the manuscript proceeds directly to Production. No further layout changes will be possible.' },
  ];

  const statusConfig: Record<PageStatus, { label: string; textColor: string; bgColor: string }> = {
    under_review: { label: 'Under Author Review', textColor: 'text-blue-800', bgColor: 'bg-blue-100' },
    approved: { label: 'Layout Approved', textColor: 'text-green-800', bgColor: 'bg-green-100' },
    minor_revision: { label: 'Revision Requested', textColor: 'text-amber-800', bgColor: 'bg-amber-100' },
    major_revision: { label: 'Major Revision Requested', textColor: 'text-orange-800', bgColor: 'bg-orange-100' },
    production_ready: { label: 'Approved for Production', textColor: 'text-emerald-800', bgColor: 'bg-emerald-100' },
  };

  const currentStatus = statusConfig[pageStatus];

  const handleDecisionClick = (d: ApprovalDecision) => {
    setDecision(d);
    setShowConfirmModal(true);
  };

  const handleConfirm = () => {
    if (decision === 'approve') setPageStatus('production_ready');
    else if (decision === 'minor_revision') setPageStatus('minor_revision');
    else if (decision === 'major_revision') setPageStatus('major_revision');
    setShowConfirmModal(false);
  };

  const getDecisionLabel = (d: ApprovalDecision) => {
    if (d === 'approve') return 'Approve Typeset Manuscript';
    if (d === 'minor_revision') return 'Request Minor Corrections';
    return 'Request Major Revision';
  };

  const deadline = new Date(Date.now() + 3 * 24 * 60 * 60 * 1000);

  return (
    <div className="min-h-screen bg-[#F7F8FA]">

      {/* Sticky Header */}
      <div className="sticky top-0 z-50 bg-[#0F2D5E] text-white shadow-md">
        <div className="max-w-7xl mx-auto px-6 py-3 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <button onClick={onBack} className="flex items-center gap-2 text-sm text-slate-300 hover:text-white transition-colors">
              <ArrowLeft className="w-4 h-4" />
              Back to Dashboard
            </button>
            <div className="w-px h-5 bg-slate-600" />
            <div>
              <p className="text-xs text-slate-400 uppercase tracking-wider font-medium">Author — Typesetting Approval</p>
              <h1 className="text-base font-bold font-serif leading-tight truncate max-w-lg">{manuscript.title}</h1>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <span className={`text-xs font-semibold px-3 py-1 rounded-full ${currentStatus.bgColor} ${currentStatus.textColor}`}>
              {currentStatus.label}
            </span>
            <div className="text-right">
              <p className="text-xs text-slate-400">Approval Deadline</p>
              <p className="text-sm font-semibold text-amber-300">{deadline.toLocaleDateString()}</p>
            </div>
          </div>
        </div>

        <div className="bg-[#141824] border-t border-slate-700 px-6 py-2">
          <div className="max-w-7xl mx-auto flex items-center gap-0 overflow-x-auto">
            {workflowStages.map((stage, idx) => (
              <React.Fragment key={stage}>
                <div className="flex flex-col items-center flex-shrink-0">
                  <div className={`w-5 h-5 rounded-full flex items-center justify-center text-xs font-bold border-2 ${
                    idx < currentStageIndex ? 'bg-emerald-500 border-emerald-500 text-white' :
                    idx === currentStageIndex ? 'bg-white border-white text-[#0F2D5E]' :
                    'bg-transparent border-slate-600 text-slate-500'
                  }`}>
                    {idx < currentStageIndex ? <CheckCircle className="w-3 h-3" /> : idx + 1}
                  </div>
                  <span className={`text-[9px] mt-1 whitespace-nowrap font-medium ${
                    idx === currentStageIndex ? 'text-white' : idx < currentStageIndex ? 'text-emerald-400' : 'text-slate-500'
                  }`}>{stage}</span>
                </div>
                {idx < workflowStages.length - 1 && (
                  <div className={`h-px flex-1 min-w-[20px] mx-1 mb-4 ${idx < currentStageIndex ? 'bg-emerald-500' : 'bg-slate-700'}`} />
                )}
              </React.Fragment>
            ))}
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-6 py-6 space-y-5">

        {/* SECTION 1 — Manuscript Summary */}
        <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-5">
          <div className="flex items-center gap-2 mb-4">
            <BookOpen className="w-4 h-4 text-[#0F2D5E]" />
            <h2 className="text-base font-bold font-serif text-[#0F2D5E] uppercase tracking-wide">Manuscript Summary</h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
            <div className="space-y-2 text-sm">
              <div><span className="text-gray-500 font-medium">Title:</span><p className="text-gray-900 font-semibold leading-snug mt-0.5">{manuscript.title}</p></div>
              <div><span className="text-gray-500 font-medium">Journal:</span><p className="text-gray-800 mt-0.5">{manuscript.journal}</p></div>
            </div>
            <div className="space-y-2 text-sm">
              <div><span className="text-gray-500 font-medium">Version:</span><p className="text-gray-800 mt-0.5 font-semibold">v1.0 (Typeset — Editor Approved)</p></div>
              <div><span className="text-gray-500 font-medium">Stage:</span><p className="text-gray-800 mt-0.5 font-semibold text-blue-700">Author Typeset Approval</p></div>
            </div>
          </div>
          <div className="flex gap-2 flex-wrap">
            <button className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium text-[#0F2D5E] border border-[#1a1f2e] rounded-lg hover:bg-[#0F2D5E] hover:text-white transition-colors">
              <Download className="w-3.5 h-3.5" /> Download Typeset PDF
            </button>
            <button className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium text-gray-700 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors">
              <Eye className="w-3.5 h-3.5" /> View Full Manuscript
            </button>
          </div>
        </div>

        {/* SECTION 2 — Layout Review Panel */}
        <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-5">
          <div className="flex items-center gap-2 mb-4">
            <Layout className="w-4 h-4 text-[#0F2D5E]" />
            <h2 className="text-base font-bold font-serif text-[#0F2D5E] uppercase tracking-wide">Layout Review</h2>
            <span className="ml-auto text-xs text-gray-400 italic">Preview only</span>
          </div>

          <div className="flex gap-1 mb-4 bg-gray-100 rounded-lg p-1 w-fit">
            {(['full', 'comparison', 'figures'] as const).map((tab) => (
              <button key={tab} onClick={() => setActivePreview(tab)} className={`px-4 py-1.5 rounded-md text-xs font-semibold transition-all ${
                activePreview === tab ? 'bg-white text-[#0F2D5E] shadow-sm' : 'text-gray-500 hover:text-gray-700'
              }`}>
                {tab === 'full' ? 'Full Typeset' : tab === 'comparison' ? 'Before / After' : 'Figures & Tables'}
              </button>
            ))}
          </div>

          <div className="bg-gray-50 rounded-xl border border-gray-200 overflow-hidden">
            {activePreview === 'full' && (
              <div className="p-6 space-y-4">
                {/* Simulated typeset pages */}
                {[0, 1].map((page) => (
                  <div key={page} className="border border-gray-200 rounded-lg bg-white p-4 shadow-sm">
                    <div className="flex items-center justify-between pb-2 border-b border-gray-100 mb-3">
                      <div className="h-1.5 w-20 bg-gray-300 rounded" />
                      <div className="h-1.5 w-6 bg-gray-400 rounded" />
                    </div>
                    {page === 0 && <div className="h-4 w-2/3 bg-gray-500 rounded mb-2" />}
                    <div className="space-y-1.5">
                      {Array.from({ length: page === 0 ? 5 : 7 }).map((_, i) => (
                        <div key={i} className="h-2 bg-gray-200 rounded" style={{ width: i % 5 === 4 ? '60%' : '100%' }} />
                      ))}
                    </div>
                    {page === 0 && (
                      <div className="mt-3 bg-gray-100 rounded h-16 flex items-center justify-center">
                        <span className="text-[9px] text-gray-400 font-medium">Figure 1 — Research Framework</span>
                      </div>
                    )}
                    {page === 1 && (
                      <div className="mt-3 bg-amber-50 border border-amber-200 rounded h-14 flex items-center justify-center">
                        <span className="text-[9px] text-amber-500 font-medium">Table 3 — Review formatting</span>
                      </div>
                    )}
                    <div className="flex items-center justify-between pt-2 border-t border-gray-100 mt-3">
                      <div className="h-1.5 w-16 bg-gray-200 rounded" />
                      <div className="h-1.5 w-4 bg-gray-400 rounded" />
                    </div>
                  </div>
                ))}
              </div>
            )}
            {activePreview === 'comparison' && (
              <div className="grid grid-cols-2 divide-x divide-gray-200 p-0">
                <div className="p-4">
                  <p className="text-[9px] font-bold text-gray-400 uppercase tracking-wider mb-3 text-center">Original Manuscript</p>
                  <div className="space-y-1.5">
                    {Array.from({ length: 8 }).map((_, i) => (
                      <div key={i} className="h-2 bg-gray-200 rounded" style={{ width: i % 3 === 2 ? '70%' : '100%' }} />
                    ))}
                  </div>
                </div>
                <div className="p-4">
                  <p className="text-[9px] font-bold text-emerald-600 uppercase tracking-wider mb-3 text-center">Typeset Layout v1.0</p>
                  <div className="space-y-1.5">
                    {Array.from({ length: 8 }).map((_, i) => (
                      <div key={i} className={`h-2 rounded ${i === 2 || i === 6 ? 'bg-emerald-200' : 'bg-gray-200'}`} style={{ width: i % 3 === 2 ? '65%' : '100%' }} />
                    ))}
                  </div>
                  <div className="mt-2 bg-emerald-50 border border-emerald-200 rounded p-2">
                    <div className="h-8 bg-emerald-100 rounded" />
                    <div className="h-1.5 w-16 bg-gray-300 rounded mx-auto mt-1.5" />
                  </div>
                </div>
              </div>
            )}
            {activePreview === 'figures' && (
              <div className="p-4 space-y-2">
                {[
                  { label: 'Figure 1 — Research Framework', note: 'Placement verified', ok: true },
                  { label: 'Figure 2 — Data Distribution Chart', note: 'Caption alignment — check', ok: false },
                  { label: 'Table 1 — Summary Statistics', note: 'Column widths verified', ok: true },
                  { label: 'Table 2 — Literature Review Matrix', note: 'Formatting verified', ok: true },
                  { label: 'Table 3 — Comparative Analysis', note: 'Column widths — please verify', ok: false },
                ].map((item) => (
                  <div key={item.label} className={`flex items-center justify-between px-3 py-3 rounded-lg border ${
                    item.ok ? 'bg-green-50 border-green-100' : 'bg-amber-50 border-amber-100'
                  }`}>
                    <div className="flex items-center gap-2">
                      {item.ok ? <CheckCircle className="w-4 h-4 text-green-500" /> : <AlertCircle className="w-4 h-4 text-amber-500" />}
                      <span className="text-sm font-medium text-gray-800">{item.label}</span>
                    </div>
                    <span className={`text-xs font-medium ${item.ok ? 'text-green-600' : 'text-amber-600'}`}>{item.note}</span>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* SECTION 3 — Layout Approval Checklist */}
        <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-5">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-2">
              <CheckCircle className="w-4 h-4 text-[#0F2D5E]" />
              <h2 className="text-base font-bold font-serif text-[#0F2D5E] uppercase tracking-wide">Layout Approval Checklist</h2>
            </div>
            <span className="text-xs px-2 py-0.5 bg-green-100 text-green-800 rounded-full font-semibold">{checkedCount}/{checklistItems.length} Confirmed</span>
          </div>

          <div className="mb-4">
            <div className="flex items-center justify-between text-xs text-gray-500 mb-1">
              <span>Checklist Progress</span>
              <span className="font-semibold text-gray-700">{completeness}%</span>
            </div>
            <div className="h-2 bg-gray-100 rounded-full overflow-hidden">
              <div className="h-full bg-gradient-to-r from-emerald-500 to-emerald-400 rounded-full transition-all" style={{ width: `${completeness}%` }} />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
            {checklistItems.map((item) => (
              <button
                key={item.id}
                onClick={() => toggleCheck(item.id)}
                className={`flex items-center gap-3 px-3 py-2.5 rounded-lg border text-left transition-colors ${
                  item.checked ? 'bg-green-50 border-green-200 hover:bg-green-100' : 'bg-gray-50 border-gray-200 hover:bg-gray-100'
                }`}
              >
                <div className={`w-4 h-4 rounded flex items-center justify-center flex-shrink-0 border-2 transition-colors ${
                  item.checked ? 'bg-emerald-500 border-emerald-500' : 'border-gray-300 bg-white'
                }`}>
                  {item.checked && <CheckCircle className="w-3 h-3 text-white" />}
                </div>
                <span className="text-sm text-gray-800 font-medium">{item.label}</span>
              </button>
            ))}
          </div>
          <p className="text-xs text-gray-400 mt-3">Click each item to mark as confirmed. Complete all items before submitting your approval decision.</p>
        </div>

        {/* SECTION 4 — Author Feedback Panel */}
        <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-5">
          <div className="flex items-center gap-2 mb-5">
            <FileText className="w-4 h-4 text-[#0F2D5E]" />
            <h2 className="text-base font-bold font-serif text-[#0F2D5E] uppercase tracking-wide">Author Feedback & Decision</h2>
          </div>
          <div className="space-y-4 mb-5">
            <div>
              <label className="block text-xs font-semibold text-gray-700 mb-1">Approval Remarks <span className="text-red-500">*</span></label>
              <textarea value={approvalRemarks} onChange={e => setApprovalRemarks(e.target.value)} rows={3}
                placeholder="Provide your overall assessment of the typeset layout — confirm accuracy of content, typography, and structure..."
                className="w-full text-sm border border-gray-200 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-[#1a1f2e] resize-none text-gray-800 placeholder-gray-400" />
            </div>
            <div>
              <label className="block text-xs font-semibold text-gray-700 mb-1">Minor Correction Requests</label>
              <textarea value={minorCorrections} onChange={e => setMinorCorrections(e.target.value)} rows={3}
                placeholder="List any minor corrections needed — caption text, table headers, figure numbering, spacing issues..."
                className="w-full text-sm border border-gray-200 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-[#1a1f2e] resize-none text-gray-800 placeholder-gray-400" />
            </div>
            <div>
              <label className="block text-xs font-semibold text-gray-700 mb-1">Layout Issues Notes</label>
              <textarea value={layoutIssues} onChange={e => setLayoutIssues(e.target.value)} rows={2}
                placeholder="Document any layout issues — misplaced figures, distorted tables, readability concerns..."
                className="w-full text-sm border border-gray-200 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-[#1a1f2e] resize-none text-gray-800 placeholder-gray-400" />
            </div>
          </div>

          <div className="flex flex-wrap gap-3">
            <button onClick={() => handleDecisionClick('approve')} className={`flex items-center gap-2 px-5 py-2.5 rounded-lg text-sm font-semibold transition-colors ${
              decision === 'approve' ? 'bg-emerald-600 text-white ring-2 ring-emerald-400' : 'bg-emerald-50 text-emerald-800 border border-emerald-200 hover:bg-emerald-600 hover:text-white'
            }`}>
              <ThumbsUp className="w-4 h-4" /> Approve Typeset Manuscript
            </button>
            <button onClick={() => handleDecisionClick('minor_revision')} className={`flex items-center gap-2 px-5 py-2.5 rounded-lg text-sm font-semibold transition-colors ${
              decision === 'minor_revision' ? 'bg-amber-500 text-white ring-2 ring-amber-300' : 'bg-amber-50 text-amber-800 border border-amber-200 hover:bg-amber-500 hover:text-white'
            }`}>
              <AlertCircle className="w-4 h-4" /> Request Minor Corrections
            </button>
            <button onClick={() => handleDecisionClick('major_revision')} className={`flex items-center gap-2 px-5 py-2.5 rounded-lg text-sm font-semibold transition-colors ${
              decision === 'major_revision' ? 'bg-orange-600 text-white ring-2 ring-orange-300' : 'bg-orange-50 text-orange-800 border border-orange-200 hover:bg-orange-600 hover:text-white'
            }`}>
              <RotateCcw className="w-4 h-4" /> Request Major Revision
            </button>
          </div>
        </div>

        {/* SECTION 5 — File Panel */}
        <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-5">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-2">
              <Layers className="w-4 h-4 text-[#0F2D5E]" />
              <h2 className="text-base font-bold font-serif text-[#0F2D5E] uppercase tracking-wide">Files</h2>
            </div>
            <button className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium bg-[#0F2D5E] text-white rounded-lg hover:bg-[#252b3d] transition-colors">
              <Upload className="w-3.5 h-3.5" /> Upload Annotated Feedback
            </button>
          </div>
          <div className="space-y-2">
            {[
              { name: 'typeset-manuscript-v1.pdf', size: '12.4 MB', type: 'Final Typeset PDF', status: 'Available' },
              { name: 'typeset-source-v1.indd', size: '34.1 MB', type: 'InDesign Source', status: 'Available' },
              { name: 'layout-annotations.pdf', size: '1.8 MB', type: 'Layout Notes from Editor', status: 'Available' },
            ].map((file) => (
              <div key={file.name} className="flex items-center justify-between px-4 py-3 bg-gray-50 rounded-lg border border-gray-100 hover:bg-gray-100 transition-colors">
                <div className="flex items-center gap-3 min-w-0">
                  <FileText className="w-4 h-4 text-gray-400 flex-shrink-0" />
                  <div className="min-w-0">
                    <p className="text-sm font-medium text-gray-900 truncate">{file.name}</p>
                    <p className="text-xs text-gray-500">{file.type} · {file.size}</p>
                  </div>
                </div>
                <div className="flex items-center gap-2 ml-3">
                  <span className="text-xs px-2 py-0.5 bg-green-100 text-green-800 rounded-full font-medium">{file.status}</span>
                  <button className="p-1.5 text-gray-400 hover:text-[#0F2D5E] transition-colors"><Download className="w-3.5 h-3.5" /></button>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Workflow + Timeline */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-5">
            <div className="flex items-center gap-2 mb-4">
              <Activity className="w-4 h-4 text-[#0F2D5E]" />
              <h2 className="text-sm font-bold font-serif text-[#0F2D5E] uppercase tracking-wide">Workflow Status</h2>
            </div>
            <div className="space-y-3 text-sm">
              <div className="flex justify-between"><span className="text-gray-500 font-medium">Current Stage</span><span className="font-semibold text-[#0F2D5E]">Author Typeset Approval</span></div>
              <div className="flex justify-between"><span className="text-gray-500 font-medium">Next Stage</span><span className="font-semibold text-gray-700">Production</span></div>
              <div className="flex justify-between"><span className="text-gray-500 font-medium">Approval Deadline</span><span className="font-semibold text-amber-700">{deadline.toLocaleDateString()}</span></div>
              <div className="flex justify-between items-center"><span className="text-gray-500 font-medium">Delay Risk</span><span className="px-2 py-0.5 bg-green-100 text-green-800 rounded-full text-xs font-semibold">On Schedule</span></div>
            </div>
          </div>

          <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-5">
            <div className="flex items-center gap-2 mb-4">
              <CalendarClock className="w-4 h-4 text-[#0F2D5E]" />
              <h2 className="text-sm font-bold font-serif text-[#0F2D5E] uppercase tracking-wide">Timeline</h2>
            </div>
            <div className="space-y-3 text-sm">
              <div className="flex justify-between"><span className="text-gray-500 font-medium">Recommended Duration</span><span className="font-semibold text-[#0F2D5E]">1–3 Business Days</span></div>
              <div className="flex justify-between items-center">
                <span className="text-gray-500 font-medium">Stage Progress</span>
                <div className="flex items-center gap-2">
                  <div className="w-20 h-1.5 bg-gray-200 rounded-full overflow-hidden">
                    <div className="h-full bg-blue-500 rounded-full" style={{ width: '15%' }} />
                  </div>
                  <span className="text-gray-700 font-medium">15%</span>
                </div>
              </div>
              <div className="flex justify-between items-center"><span className="text-gray-500 font-medium">Delay Risk</span><span className="px-2 py-0.5 bg-green-100 text-green-800 rounded-full text-xs font-semibold">On Schedule</span></div>
              <div className="flex justify-between"><span className="text-gray-500 font-medium">Remaining Est.</span><span className="font-semibold text-gray-700">~3 days</span></div>
            </div>
          </div>
        </div>

        {/* Alerts */}
        <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-5">
          <div className="flex items-center gap-2 mb-4">
            <Bell className="w-4 h-4 text-[#0F2D5E]" />
            <h2 className="text-base font-bold font-serif text-[#0F2D5E] uppercase tracking-wide">Alerts & Notifications</h2>
          </div>
          <div className="space-y-2">
            {alerts.map((alert) => (
              <div key={alert.id} className={`flex items-start gap-3 px-4 py-3 rounded-lg border text-sm ${
                alert.type === 'warning' ? 'bg-amber-50 border-amber-100' :
                alert.type === 'deadline' ? 'bg-red-50 border-red-100' : 'bg-blue-50 border-blue-100'
              }`}>
                {alert.type === 'warning' && <AlertTriangle className="w-4 h-4 text-amber-500 flex-shrink-0 mt-0.5" />}
                {alert.type === 'deadline' && <AlertCircle className="w-4 h-4 text-red-500 flex-shrink-0 mt-0.5" />}
                {alert.type === 'info' && <Info className="w-4 h-4 text-blue-500 flex-shrink-0 mt-0.5" />}
                <p className={alert.type === 'warning' ? 'text-amber-800' : alert.type === 'deadline' ? 'text-red-800' : 'text-blue-800'}>{alert.message}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Activity Log */}
        <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-5 mb-24">
          <div className="flex items-center gap-2 mb-4">
            <History className="w-4 h-4 text-[#0F2D5E]" />
            <h2 className="text-base font-bold font-serif text-[#0F2D5E] uppercase tracking-wide">Activity Log</h2>
          </div>
          <div className="space-y-2">
            {activityLog.map((entry) => (
              <div key={entry.id} className="flex items-start gap-3 px-3 py-2.5 bg-gray-50 rounded-lg border border-gray-100 text-xs">
                <Clock className="w-3.5 h-3.5 text-gray-400 flex-shrink-0 mt-0.5" />
                <div className="flex-1 min-w-0">
                  <p className="text-gray-800 font-medium">{entry.action}</p>
                  <p className="text-gray-500 mt-0.5">{entry.user} · {entry.timestamp.toLocaleString()}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Sticky Bottom Action Bar */}
      <div className="fixed bottom-0 left-0 right-0 z-40 bg-white border-t border-gray-200 shadow-lg">
        <div className="max-w-7xl mx-auto px-6 py-3 flex items-center justify-between gap-3">
          <div className="flex items-center gap-2">
            <button className="flex items-center gap-1.5 px-4 py-2 text-sm font-medium text-gray-700 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors">
              <Save className="w-4 h-4" /> Save Draft Feedback
            </button>
          </div>
          <div className="flex items-center gap-2">
            <button onClick={() => handleDecisionClick('minor_revision')} className="flex items-center gap-1.5 px-4 py-2 text-sm font-semibold text-amber-700 bg-amber-50 border border-amber-200 rounded-lg hover:bg-amber-500 hover:text-white transition-colors">
              <AlertCircle className="w-4 h-4" /> Request Revision
            </button>
            <button onClick={() => handleDecisionClick('approve')} className="flex items-center gap-1.5 px-5 py-2 text-sm font-semibold text-white bg-[#0F2D5E] rounded-lg hover:bg-[#252b3d] transition-colors">
              <ThumbsUp className="w-4 h-4" /> Approve Layout
            </button>
            <button onClick={onBack} className="px-4 py-2 text-sm text-gray-500 hover:text-gray-700 transition-colors">Cancel</button>
          </div>
        </div>
      </div>

      {/* Confirmation Modal */}
      {showConfirmModal && decision && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm">
          <div className="bg-white rounded-2xl shadow-2xl p-6 w-full max-w-md mx-4">
            <div className="flex items-center gap-3 mb-4">
              <div className={`p-2 rounded-lg ${
                decision === 'approve' ? 'bg-emerald-100' :
                decision === 'minor_revision' ? 'bg-amber-100' : 'bg-orange-100'
              }`}>
                {decision === 'approve' ? <ThumbsUp className="w-5 h-5 text-emerald-600" /> :
                 decision === 'minor_revision' ? <AlertCircle className="w-5 h-5 text-amber-600" /> :
                 <RotateCcw className="w-5 h-5 text-orange-600" />}
              </div>
              <div>
                <h3 className="font-bold text-gray-900">Confirm Layout Decision</h3>
                <p className="text-xs text-gray-500">This will update the manuscript workflow</p>
              </div>
            </div>
            <div className="bg-gray-50 rounded-lg p-4 mb-4 space-y-1.5 text-sm">
              <p><span className="text-gray-500">Decision:</span> <span className="font-semibold">{getDecisionLabel(decision)}</span></p>
              <p><span className="text-gray-500">Manuscript:</span> <span className="font-medium text-xs">{manuscript.title}</span></p>
              <p><span className="text-gray-500">Next Stage:</span> <span className="font-medium">
                {decision === 'approve' ? 'Production' :
                 decision === 'minor_revision' ? 'Layout Revision (Minor)' : 'Layout Revision (Major)'}
              </span></p>
            </div>
            <p className="text-sm text-gray-600 mb-5">
              {decision === 'approve'
                ? 'The typeset manuscript will be confirmed as approved and will proceed directly to Production. This is the final layout approval — no further changes will be possible.'
                : decision === 'minor_revision'
                ? 'Your minor correction requests will be sent to the TWG Layout Artist for targeted revisions. The manuscript will re-enter the typesetting revision stage.'
                : 'The manuscript will be returned for a major layout revision cycle. Please ensure your detailed feedback is documented before confirming.'}
            </p>
            <div className="flex gap-3">
              <button onClick={() => setShowConfirmModal(false)} className="flex-1 px-4 py-2 text-sm font-medium text-gray-700 border border-gray-300 rounded-lg hover:bg-gray-50">Cancel</button>
              <button onClick={handleConfirm} className={`flex-1 px-4 py-2 text-sm font-semibold text-white rounded-lg ${
                decision === 'approve' ? 'bg-emerald-600 hover:bg-emerald-700' :
                decision === 'minor_revision' ? 'bg-amber-500 hover:bg-amber-600' : 'bg-orange-600 hover:bg-orange-700'
              }`}>
                Confirm {decision === 'approve' ? 'Approval' : 'Revision Request'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
