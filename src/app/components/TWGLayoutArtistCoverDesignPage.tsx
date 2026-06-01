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
  XCircle,
  Info,
  PauseCircle,
  Image,
  Layers,
  Palette,
  MessageSquare,
} from 'lucide-react';
import type { Manuscript } from '../types';

interface TWGLayoutArtistCoverDesignPageProps {
  manuscript: Manuscript;
  onBack: () => void;
}

type PageStatus =
  | 'under_design'
  | 'draft_saved'
  | 'awaiting_editor'
  | 'revision_required'
  | 'submitted'
  | 'validation_pending'
  | 'ready_production'
  | 'on_hold';

type DesignDecision = 'send' | 'revise' | 'hold' | null;

interface DesignItem {
  id: string;
  label: string;
  status: 'complete' | 'warning' | 'unresolved';
}

interface DesignFile {
  id: string;
  name: string;
  size: string;
  type: string;
  status: 'uploaded' | 'pending' | 'draft';
  date: Date;
}

export function TWGLayoutArtistCoverDesignPage({ manuscript, onBack }: TWGLayoutArtistCoverDesignPageProps) {
  const [pageStatus, setPageStatus] = useState<PageStatus>('under_design');
  const [decision, setDecision] = useState<DesignDecision>(null);
  const [showConfirmModal, setShowConfirmModal] = useState(false);
  const [coverNotes, setCoverNotes] = useState('');
  const [revisionNotes, setRevisionNotes] = useState('');
  const [justificationNotes, setJustificationNotes] = useState('');
  const [printNotes, setPrintNotes] = useState('');
  const [editorGuidanceNotes, setEditorGuidanceNotes] = useState('');
  const [activePreview, setActivePreview] = useState<'front' | 'back' | 'spine'>('front');

  const designItems: DesignItem[] = [
    { id: 'd1', label: 'Journal branding applied', status: 'complete' },
    { id: 'd2', label: 'Title formatting verified', status: 'complete' },
    { id: 'd3', label: 'Author details placement verified', status: 'complete' },
    { id: 'd4', label: 'ISBN placeholder placement', status: 'warning' },
    { id: 'd5', label: 'Spine layout readiness', status: 'complete' },
    { id: 'd6', label: 'Color palette compliance', status: 'complete' },
    { id: 'd7', label: 'Typography consistency', status: 'complete' },
    { id: 'd8', label: 'Cover dimensions validated', status: 'unresolved' },
  ];

  const completeCount = designItems.filter(i => i.status === 'complete').length;
  const warningCount = designItems.filter(i => i.status === 'warning').length;
  const unresolvedCount = designItems.filter(i => i.status === 'unresolved').length;
  const completeness = Math.round((completeCount / designItems.length) * 100);

  const validationCards = [
    { label: 'Branding Consistency', score: 97, badge: 'Validated', color: 'green' },
    { label: 'Typography Quality', score: 94, badge: 'Good', color: 'green' },
    { label: 'Layout Alignment', score: 88, badge: 'Minor Issues', color: 'amber' },
    { label: 'Image Resolution', score: 100, badge: 'Print Ready', color: 'green' },
    { label: 'Print Readiness', score: 82, badge: 'Nearly Ready', color: 'blue' },
  ];

  const workflowStages = [
    'Submission',
    'Review',
    'Revision',
    'Copyediting',
    'Final Revisions',
    'Cover Page Design',
    'Editor Approval',
    'Production Layout',
  ];
  const currentStageIndex = 5;

  const designFiles: DesignFile[] = [
    { id: 'f1', name: 'cover-design-v2-final.pdf', size: '4.8 MB', type: 'Print-Ready PDF', status: 'uploaded', date: new Date(Date.now() - 2 * 60 * 60 * 1000) },
    { id: 'f2', name: 'cover-design-v2.ai', size: '18.2 MB', type: 'Editable Source (AI)', status: 'uploaded', date: new Date(Date.now() - 2 * 60 * 60 * 1000) },
    { id: 'f3', name: 'cover-mockup-v2.png', size: '3.1 MB', type: 'Mockup Preview', status: 'uploaded', date: new Date(Date.now() - 3 * 60 * 60 * 1000) },
    { id: 'f4', name: 'spine-layout-v1.pdf', size: '1.2 MB', type: 'Spine Layout', status: 'uploaded', date: new Date(Date.now() - 4 * 60 * 60 * 1000) },
    { id: 'f5', name: 'print-specifications.pdf', size: '0.4 MB', type: 'Print Specs', status: 'pending', date: new Date() },
  ];

  const revisionHistory = [
    { id: 'r1', version: 'v1.0', date: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000), note: 'Initial cover design submitted', status: 'Returned' },
    { id: 'r2', version: 'v1.1', date: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000), note: 'Spine text repositioned, author list updated', status: 'Returned' },
    { id: 'r3', version: 'v2.0', date: new Date(Date.now() - 1 * 60 * 60 * 1000), note: 'ISBN placeholder corrected, dimensions adjusted', status: 'Current' },
  ];

  const history = [
    { id: 'h1', date: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000), event: 'Cover page design task assigned by TWG Coordinator', actor: 'Maria Rodriguez', badge: 'Assigned' },
    { id: 'h2', date: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000), event: 'Cover design v1.0 submitted to editor', actor: 'Emma Thompson', badge: 'Submitted' },
    { id: 'h3', date: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000), event: 'Editor returned cover for revision — spine and ISBN corrections required', actor: 'Dr. Sarah Johnson', badge: 'Revision Required' },
    { id: 'h4', date: new Date(Date.now() - 1 * 60 * 60 * 1000), event: 'Cover design v2.0 revision completed', actor: 'Emma Thompson', badge: 'In Progress' },
  ];

  const activityLog = [
    { id: 'a1', timestamp: new Date(Date.now() - 1 * 60 * 60 * 1000), action: 'Cover design v2.0 finalized and uploaded', user: 'Emma Thompson' },
    { id: 'a2', timestamp: new Date(Date.now() - 2 * 60 * 60 * 1000), action: 'Spine layout corrections applied', user: 'Emma Thompson' },
    { id: 'a3', timestamp: new Date(Date.now() - 5 * 60 * 60 * 1000), action: 'ISBN placeholder repositioned per editor feedback', user: 'Emma Thompson' },
    { id: 'a4', timestamp: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000), action: 'Editor revision request received for v1.1', user: 'Dr. Sarah Johnson' },
    { id: 'a5', timestamp: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000), action: 'Cover design v1.0 submitted to editor for review', user: 'Emma Thompson' },
  ];

  const alerts = [
    { id: 'al1', type: 'warning', message: 'Cover dimensions validation pending — confirm bleed area specifications before submitting.' },
    { id: 'al2', type: 'warning', message: 'ISBN placeholder positioning requires editor confirmation on final placement.' },
    { id: 'al3', type: 'deadline', message: 'Cover design submission deadline: 1 day remaining.' },
    { id: 'al4', type: 'info', message: 'Print-ready PDF (v2.0) has been uploaded successfully.' },
  ];

  const layoutDate = new Date(Date.now() - 7 * 24 * 60 * 60 * 1000);
  const deadline = new Date(Date.now() + 1 * 24 * 60 * 60 * 1000);

  const getStatusConfig = () => {
    const map: Record<PageStatus, { label: string; textColor: string; bgColor: string }> = {
      under_design: { label: 'Under Cover Design Processing', textColor: 'text-[#0C447C]', bgColor: 'bg-[#E6F1FB]' },
      draft_saved: { label: 'Cover Design Draft Saved', textColor: 'text-[#444441]', bgColor: 'bg-[#EAEDF2]' },
      awaiting_editor: { label: 'Awaiting Editor Review', textColor: 'text-[#3C3489]', bgColor: 'bg-[#EEEDFE]' },
      revision_required: { label: 'Cover Design Revision Required', textColor: 'text-[#633806]', bgColor: 'bg-[#FAEEDA]' },
      submitted: { label: 'Cover Design Submitted', textColor: 'text-[#085041]', bgColor: 'bg-[#E1F5EE]' },
      validation_pending: { label: 'Layout Validation Pending', textColor: 'text-[#3C3489]', bgColor: 'bg-[#EEEDFE]' },
      ready_production: { label: 'Ready for Production Layout', textColor: 'text-[#085041]', bgColor: 'bg-[#E1F5EE]' },
      on_hold: { label: 'Design Processing On Hold', textColor: 'text-[#633806]', bgColor: 'bg-[#FAEEDA]' },
    };
    return map[pageStatus];
  };

  const statusCfg = getStatusConfig();

  const getItemIcon = (status: DesignItem['status']) => {
    if (status === 'complete') return <CheckCircle className="w-4 h-4 text-[#085041]" />;
    if (status === 'warning') return <AlertCircle className="w-4 h-4 text-[#633806]" />;
    return <XCircle className="w-4 h-4 text-[#633806]" />;
  };

  const getFileBadge = (status: string) => {
    if (status === 'uploaded') return 'bg-[#E1F5EE] text-[#085041]';
    if (status === 'pending') return 'bg-[#FAEEDA] text-[#633806]';
    return 'bg-[#EAEDF2] text-[#444441]';
  };

  const getFileLabel = (status: string) => {
    if (status === 'uploaded') return 'Uploaded';
    if (status === 'pending') return 'Pending';
    return 'Draft';
  };

  const getBarColor = (color: string) => {
    if (color === 'green') return 'bg-[#085041]';
    if (color === 'amber') return 'bg-[#633806]';
    if (color === 'blue') return 'bg-[#4D9DE0]';
    return 'bg-[#EAEDF2]';
  };

  const getBadgeColor = (color: string) => {
    if (color === 'green') return 'bg-[#E1F5EE] text-[#085041]';
    if (color === 'amber') return 'bg-[#FAEEDA] text-[#633806]';
    if (color === 'blue') return 'bg-[#E6F1FB] text-[#0C447C]';
    return 'bg-[#EAEDF2] text-[#444441]';
  };

  const handleConfirm = () => {
    if (decision === 'send') setPageStatus('awaiting_editor');
    else if (decision === 'revise') setPageStatus('revision_required');
    else if (decision === 'hold') setPageStatus('on_hold');
    setShowConfirmModal(false);
    onBack();
  };

  const previewLabels = { front: 'Front Cover', back: 'Back Cover', spine: 'Spine Layout' };

  return (
    <div className="min-h-screen bg-[#F7F8FA] pb-32">

      {/* Header */}
      <div className="bg-[#0F2D5E] text-white py-6 px-8 sticky top-0 z-50 border-b border-[#EAEDF2]" style={{ borderWidth: '0.5px' }}>
        <div className="max-w-[1400px] mx-auto">
          <button onClick={onBack} className="flex items-center gap-2 text-white hover:text-[#4D9DE0] transition-colors mb-4" style={{ fontFamily: 'DM Sans', fontSize: '14px', fontWeight: 400 }}>
            <ArrowLeft className="w-4 h-4" />
            Back to Dashboard
          </button>
          <div className="flex items-start justify-between">
            <div>
              <p style={{ fontFamily: 'DM Sans', fontSize: '12px', fontWeight: 400 }} className="text-white opacity-80 uppercase tracking-widest mb-1">TWG Layout Artist Workflow</p>
              <h1 style={{ fontFamily: 'Inter', fontSize: '22px', fontWeight: 600 }} className="mb-1">Cover Page Design & Send to Editor</h1>
              <p style={{ fontFamily: 'DM Sans', fontSize: '14px', fontWeight: 400 }} className="text-white opacity-90">Design and finalize manuscript cover page — submit for editorial approval and production validation</p>
            </div>
            <div className="text-right flex flex-col items-end gap-2">
              <span style={{ fontFamily: 'DM Sans', fontSize: '12px', fontWeight: 400, borderRadius: '6px' }} className={`px-4 py-1.5 ${statusCfg.bgColor} ${statusCfg.textColor}`}>
                {statusCfg.label}
              </span>
              <div style={{ fontFamily: 'DM Sans', fontSize: '14px', fontWeight: 400 }} className="text-white opacity-90">
                <span className="mr-3">Deadline: <span style={{ fontWeight: 600 }}>{deadline.toLocaleDateString()}</span></span>
                <span className="text-[#FAEEDA]" style={{ fontWeight: 600 }}>1 day remaining</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-[1400px] mx-auto px-8 py-8 space-y-6">

        {/* SECTION 1 — Manuscript Summary */}
        <div className="bg-[#FFFFFF] border border-[#EAEDF2] p-6" style={{ borderRadius: '12px', borderWidth: '0.5px' }}>
          <div className="flex items-start justify-between mb-5">
            <h2 style={{ fontFamily: 'Inter', fontSize: '16px', fontWeight: 600 }} className="text-[#2C2C2A] uppercase tracking-wide">Manuscript Summary</h2>
            <div className="flex items-center gap-2">
              <button className="flex items-center gap-1.5 px-3 py-1.5 border border-[#0F2D5E] text-[#0F2D5E] hover:bg-[#0F2D5E] hover:text-white transition-colors" style={{ borderRadius: '8px', borderWidth: '0.5px', fontFamily: 'DM Sans', fontSize: '12px', fontWeight: 400 }}>
                <Eye className="w-3.5 h-3.5" />
                View Manuscript
              </button>
              <button className="flex items-center gap-1.5 px-3 py-1.5 border border-[#EAEDF2] text-[#2C2C2A] hover:bg-[#D6E8F7] transition-colors" style={{ borderRadius: '8px', borderWidth: '0.5px', fontFamily: 'DM Sans', fontSize: '12px', fontWeight: 400 }}>
                <Download className="w-3.5 h-3.5" />
                Download Files
              </button>
              <button className="flex items-center gap-1.5 px-3 py-1.5 border border-[#EAEDF2] text-[#2C2C2A] hover:bg-[#D6E8F7] transition-colors" style={{ borderRadius: '8px', borderWidth: '0.5px', fontFamily: 'DM Sans', fontSize: '12px', fontWeight: 400 }}>
                <Palette className="w-3.5 h-3.5" />
                Design Instructions
              </button>
            </div>
          </div>

          <div className="grid grid-cols-3 gap-6">
            <div className="col-span-2 space-y-4">
              <div>
                <p style={{ fontFamily: 'DM Sans', fontSize: '12px', fontWeight: 400 }} className="text-[#2C2C2A] opacity-60 uppercase tracking-wide mb-1">Title</p>
                <p style={{ fontFamily: 'DM Sans', fontSize: '14px', fontWeight: 600 }} className="text-[#2C2C2A] leading-snug">{manuscript.title}</p>
              </div>
              <div className="grid grid-cols-3 gap-4">
                <div>
                  <p style={{ fontFamily: 'DM Sans', fontSize: '12px', fontWeight: 400 }} className="text-[#2C2C2A] opacity-60 uppercase tracking-wide mb-1">Authors</p>
                  <p style={{ fontFamily: 'DM Sans', fontSize: '14px', fontWeight: 600 }} className="text-[#2C2C2A]">{manuscript.authorName}</p>
                </div>
                <div>
                  <p style={{ fontFamily: 'DM Sans', fontSize: '12px', fontWeight: 400 }} className="text-[#2C2C2A] opacity-60 uppercase tracking-wide mb-1">Journal Category</p>
                  <p style={{ fontFamily: 'DM Sans', fontSize: '14px', fontWeight: 600 }} className="text-[#2C2C2A]">{manuscript.category}</p>
                </div>
                <div>
                  <p style={{ fontFamily: 'DM Sans', fontSize: '12px', fontWeight: 400 }} className="text-[#2C2C2A] opacity-60 uppercase tracking-wide mb-1">Manuscript ID</p>
                  <p style={{ fontFamily: 'JetBrains Mono', fontSize: '12px', fontWeight: 400 }} className="text-[#2C2C2A]">{manuscript.id}</p>
                </div>
                <div>
                  <p style={{ fontFamily: 'DM Sans', fontSize: '12px', fontWeight: 400 }} className="text-[#2C2C2A] opacity-60 uppercase tracking-wide mb-1">Submission Date</p>
                  <p style={{ fontFamily: 'JetBrains Mono', fontSize: '12px', fontWeight: 400 }} className="text-[#2C2C2A]">{manuscript.submittedAt.toLocaleDateString()}</p>
                </div>
                <div>
                  <p style={{ fontFamily: 'DM Sans', fontSize: '12px', fontWeight: 400 }} className="text-[#2C2C2A] opacity-60 uppercase tracking-wide mb-1">Assigned Layout Date</p>
                  <p style={{ fontFamily: 'JetBrains Mono', fontSize: '12px', fontWeight: 400 }} className="text-[#2C2C2A]">{layoutDate.toLocaleDateString()}</p>
                </div>
                <div>
                  <p style={{ fontFamily: 'DM Sans', fontSize: '12px', fontWeight: 400 }} className="text-[#2C2C2A] opacity-60 uppercase tracking-wide mb-1">Version</p>
                  <p style={{ fontFamily: 'DM Sans', fontSize: '14px', fontWeight: 600 }} className="text-[#2C2C2A]">v{manuscript.files.length}.0 — Cover v2.0</p>
                </div>
              </div>
            </div>

            <div className="space-y-3">
              <div className="bg-[#D6E8F7] border border-[#EAEDF2] p-4" style={{ borderRadius: '8px', borderWidth: '0.5px' }}>
                <p style={{ fontFamily: 'DM Sans', fontSize: '12px', fontWeight: 600 }} className="text-[#0F2D5E] uppercase tracking-wide mb-3">Workflow Stage</p>
                <div className="space-y-1.5">
                  {['Final Revisions', 'Cover Page Design', 'Editor Approval', 'Production Layout'].map((stage, i) => (
                    <div key={stage} className="flex items-center gap-2">
                      <div className={`w-2 h-2 ${i === 1 ? 'bg-[#0F2D5E]' : i < 1 ? 'bg-[#085041]' : 'bg-[#EAEDF2]'}`} style={{ borderRadius: '50%' }} />
                      <span style={{ fontFamily: 'DM Sans', fontSize: '12px', fontWeight: i === 1 ? 600 : 400 }} className={i === 1 ? 'text-[#0F2D5E]' : i < 1 ? 'text-[#085041]' : 'text-[#2C2C2A] opacity-60'}>{stage}</span>
                      {i === 1 && <span style={{ fontFamily: 'DM Sans', fontSize: '12px', fontWeight: 400, borderRadius: '6px' }} className="ml-auto bg-[#0F2D5E] text-white px-1.5 py-0.5">Current</span>}
                    </div>
                  ))}
                </div>
              </div>
              <div className="bg-[#FAEEDA] border border-[#EAEDF2] p-3" style={{ borderRadius: '8px', borderWidth: '0.5px' }}>
                <p style={{ fontFamily: 'DM Sans', fontSize: '12px', fontWeight: 600 }} className="text-[#633806] mb-1">Submission Deadline</p>
                <p style={{ fontFamily: 'DM Sans', fontSize: '14px', fontWeight: 600 }} className="text-[#633806]">{deadline.toLocaleDateString()}</p>
                <p style={{ fontFamily: 'DM Sans', fontSize: '12px', fontWeight: 400 }} className="text-[#633806] mt-0.5">1 day remaining — urgent</p>
              </div>
              <div className="bg-[#D6E8F7] border border-[#EAEDF2] p-3" style={{ borderRadius: '8px', borderWidth: '0.5px' }}>
                <p style={{ fontFamily: 'DM Sans', fontSize: '12px', fontWeight: 600 }} className="text-[#0F2D5E] mb-2">Cover Revision</p>
                <span style={{ fontFamily: 'DM Sans', fontSize: '12px', fontWeight: 600, borderRadius: '6px' }} className="px-2.5 py-1 bg-[#E6F1FB] text-[#0C447C]">Version 2.0</span>
                <p style={{ fontFamily: 'DM Sans', fontSize: '12px', fontWeight: 400 }} className="text-[#2C2C2A] opacity-60 mt-2">Revised per editor correction requests</p>
              </div>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-3 gap-6">

          {/* SECTION 2 — Cover Design Requirements */}
          <div className="bg-[#FFFFFF] border border-[#EAEDF2] p-5" style={{ borderRadius: '12px', borderWidth: '0.5px' }}>
            <h2 style={{ fontFamily: 'Inter', fontSize: '16px', fontWeight: 600 }} className="text-[#0F2D5E] uppercase tracking-wide mb-4">Cover Design Requirements</h2>

            <div className="mb-4">
              <div className="flex items-center justify-between mb-1.5">
                <span style={{ fontFamily: 'DM Sans', fontSize: '12px', fontWeight: 400 }} className="text-[#2C2C2A] opacity-60">Design Completion</span>
                <span style={{ fontFamily: 'DM Sans', fontSize: '12px', fontWeight: 600 }} className="text-[#0F2D5E]">{completeness}%</span>
              </div>
              <div className="w-full bg-[#EAEDF2] h-2" style={{ borderRadius: '8px' }}>
                <div className="bg-[#0F2D5E] h-2 transition-all" style={{ width: `${completeness}%`, borderRadius: '8px' }} />
              </div>
              <div className="flex gap-3 mt-2">
                <span style={{ fontFamily: 'DM Sans', fontSize: '12px', fontWeight: 400 }} className="text-[#085041]">{completeCount} complete</span>
                {warningCount > 0 && <span style={{ fontFamily: 'DM Sans', fontSize: '12px', fontWeight: 400 }} className="text-[#633806]">{warningCount} warning</span>}
                {unresolvedCount > 0 && <span style={{ fontFamily: 'DM Sans', fontSize: '12px', fontWeight: 400 }} className="text-[#633806]">{unresolvedCount} unresolved</span>}
              </div>
            </div>

            <div className="flex flex-wrap gap-1.5 mb-4">
              <span style={{ fontFamily: 'DM Sans', fontSize: '12px', fontWeight: 400, borderRadius: '6px' }} className="px-2 py-0.5 bg-[#E1F5EE] text-[#085041]">{completeCount} Complete</span>
              {warningCount > 0 && <span style={{ fontFamily: 'DM Sans', fontSize: '12px', fontWeight: 400, borderRadius: '6px' }} className="px-2 py-0.5 bg-[#FAEEDA] text-[#633806]">{warningCount} Warning</span>}
              {unresolvedCount > 0 && <span style={{ fontFamily: 'DM Sans', fontSize: '12px', fontWeight: 400, borderRadius: '6px' }} className="px-2 py-0.5 bg-[#FAEEDA] text-[#633806]">{unresolvedCount} Unresolved</span>}
            </div>

            <div className="space-y-2.5">
              {designItems.map(item => (
                <div key={item.id} className="flex items-start gap-2.5">
                  <div className="flex-shrink-0 mt-0.5">{getItemIcon(item.status)}</div>
                  <span style={{ fontFamily: 'DM Sans', fontSize: '12px', fontWeight: 400 }} className={`leading-snug ${item.status === 'complete' ? 'text-[#085041]' : 'text-[#633806]'}`}>
                    {item.label}
                  </span>
                </div>
              ))}
            </div>
          </div>

          {/* SECTION 3 — Cover Design Preview Panel */}
          <div className="col-span-2 bg-[#FFFFFF] border border-[#EAEDF2] p-5" style={{ borderRadius: '12px', borderWidth: '0.5px' }}>
            <h2 style={{ fontFamily: 'Inter', fontSize: '16px', fontWeight: 600 }} className="text-[#0F2D5E] uppercase tracking-wide mb-4">Cover Design Preview</h2>

            {/* Preview tab selector */}
            <div className="flex gap-1 mb-4 border-b border-[#EAEDF2] pb-0" style={{ borderWidth: '0.5px' }}>
              {(['front', 'back', 'spine'] as const).map(tab => (
                <button
                  key={tab}
                  onClick={() => setActivePreview(tab)}
                  className={`px-4 py-2 border-b-2 transition-colors -mb-px ${
                    activePreview === tab
                      ? 'border-[#0F2D5E] text-[#0F2D5E] bg-[#FFFFFF]'
                      : 'border-transparent text-[#2C2C2A] opacity-60 hover:opacity-100'
                  }`}
                  style={{ fontFamily: 'DM Sans', fontSize: '12px', fontWeight: 600, borderRadius: '8px 8px 0 0' }}
                >
                  {previewLabels[tab]}
                </button>
              ))}
              <div className="ml-auto flex items-center gap-2 pb-1">
                <span style={{ fontFamily: 'DM Sans', fontSize: '12px', fontWeight: 400, borderRadius: '6px' }} className="px-2 py-0.5 bg-[#E6F1FB] text-[#0C447C]">Preview Only</span>
                <button className="flex items-center gap-1 px-2.5 py-1 border border-[#0F2D5E] text-[#0F2D5E] hover:bg-[#0F2D5E] hover:text-white transition-colors" style={{ borderRadius: '8px', borderWidth: '0.5px', fontFamily: 'DM Sans', fontSize: '12px', fontWeight: 400 }}>
                  <Download className="w-3 h-3" />
                  Download
                </button>
              </div>
            </div>

            {/* Preview area */}
            <div className="bg-[#D6E8F7] border border-[#EAEDF2] p-4 mb-4 flex items-center justify-center min-h-[200px]" style={{ borderRadius: '8px', borderWidth: '0.5px' }}>
              <div className="text-center">
                {activePreview === 'spine' ? (
                  <div className="flex flex-col items-center gap-2">
                    <div className="w-12 h-40 bg-white border border-[#EAEDF2] flex items-end justify-center pb-3 relative overflow-hidden" style={{ borderRadius: '8px', borderWidth: '0.5px' }}>
                      <div className="absolute inset-0 bg-[#0F2D5E]" />
                      <div className="relative z-10 text-white" style={{ writingMode: 'vertical-rl', transform: 'rotate(180deg)', fontFamily: 'DM Sans', fontSize: '12px', fontWeight: 600 }}>
                        {manuscript.title.substring(0, 20)}...
                      </div>
                    </div>
                    <p style={{ fontFamily: 'DM Sans', fontSize: '12px', fontWeight: 400 }} className="text-[#2C2C2A] opacity-60">Spine Layout Preview</p>
                  </div>
                ) : activePreview === 'front' ? (
                  <div className="flex flex-col items-center gap-2">
                    <div className="w-32 h-44 bg-white border border-[#EAEDF2] relative overflow-hidden flex flex-col" style={{ borderRadius: '8px', borderWidth: '0.5px' }}>
                      <div className="h-1/2 bg-[#0F2D5E] flex items-center justify-center p-2">
                        <Layers className="w-8 h-8 text-white opacity-40" />
                      </div>
                      <div className="flex-1 p-2 flex flex-col justify-center">
                        <div className="h-1 bg-[#EAEDF2] mb-1 w-full" style={{ borderRadius: '8px' }} />
                        <div className="h-1 bg-[#EAEDF2] mb-1 w-3/4" style={{ borderRadius: '8px' }} />
                        <div className="h-0.5 bg-[#EAEDF2] mt-1 w-1/2" style={{ borderRadius: '8px' }} />
                      </div>
                    </div>
                    <p style={{ fontFamily: 'DM Sans', fontSize: '12px', fontWeight: 400 }} className="text-[#2C2C2A] opacity-60">Front Cover · v2.0</p>
                    <p style={{ fontFamily: 'JetBrains Mono', fontSize: '12px', fontWeight: 400 }} className="text-[#2C2C2A] opacity-40">210 × 297 mm (A4) · 300 DPI</p>
                  </div>
                ) : (
                  <div className="flex flex-col items-center gap-2">
                    <div className="w-32 h-44 bg-white border border-[#EAEDF2] relative overflow-hidden flex flex-col" style={{ borderRadius: '8px', borderWidth: '0.5px' }}>
                      <div className="flex-1 p-2 flex flex-col justify-end">
                        <div className="h-0.5 bg-[#EAEDF2] mb-2 w-3/4" style={{ borderRadius: '8px' }} />
                        <div className="h-1 bg-[#EAEDF2] mb-1 w-1/2" style={{ borderRadius: '8px' }} />
                        <div className="w-8 h-8 border border-[#EAEDF2] mx-auto mt-2 flex items-center justify-center" style={{ borderRadius: '8px', borderWidth: '0.5px' }}>
                          <span style={{ fontFamily: 'DM Sans', fontSize: '12px', fontWeight: 400 }} className="text-[#2C2C2A] opacity-40">ISBN</span>
                        </div>
                      </div>
                      <div className="h-6 bg-[#0F2D5E]" />
                    </div>
                    <p style={{ fontFamily: 'DM Sans', fontSize: '12px', fontWeight: 400 }} className="text-[#2C2C2A] opacity-60">Back Cover · v2.0</p>
                    <p style={{ fontFamily: 'JetBrains Mono', fontSize: '12px', fontWeight: 400 }} className="text-[#2C2C2A] opacity-40">210 × 297 mm (A4) · 300 DPI</p>
                  </div>
                )}
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-3">
                {/* Revision history */}
                <div>
                  <p style={{ fontFamily: 'DM Sans', fontSize: '12px', fontWeight: 400 }} className="text-[#2C2C2A] opacity-60 uppercase tracking-wide mb-2">Cover Revision History</p>
                  <div className="space-y-1.5">
                    {revisionHistory.map(rev => (
                      <div key={rev.id} className="flex items-center justify-between py-1.5 border-b border-[#EAEDF2] last:border-0" style={{ borderWidth: '0.5px' }}>
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center gap-2">
                            <span style={{ fontFamily: 'JetBrains Mono', fontSize: '12px', fontWeight: 600 }} className="text-[#2C2C2A]">{rev.version}</span>
                            <span style={{ fontFamily: 'DM Sans', fontSize: '12px', fontWeight: 400 }} className="text-[#2C2C2A] opacity-60 truncate">{rev.note}</span>
                          </div>
                          <p style={{ fontFamily: 'JetBrains Mono', fontSize: '12px', fontWeight: 400 }} className="text-[#2C2C2A] opacity-40">{rev.date.toLocaleDateString()}</p>
                        </div>
                        <span style={{ fontFamily: 'DM Sans', fontSize: '12px', fontWeight: 400, borderRadius: '6px' }} className={`ml-2 px-1.5 py-0.5 whitespace-nowrap ${rev.status === 'Current' ? 'bg-[#0F2D5E] text-white' : 'bg-[#EAEDF2] text-[#444441]'}`}>{rev.status}</span>
                      </div>
                    ))}
                  </div>
                </div>
                {/* Layout annotations */}
                <div>
                  <p style={{ fontFamily: 'DM Sans', fontSize: '12px', fontWeight: 400 }} className="text-[#2C2C2A] opacity-60 uppercase tracking-wide mb-2">Layout Annotation References</p>
                  <div className="space-y-1.5">
                    {['Title area — centered, 18pt serif bold', 'Author list — 11pt, 4mm from title', 'ISBN barcode — bottom-right, 25×18mm', 'Spine text — vertical, 9pt condensed'].map((ref, i) => (
                      <div key={i} className="flex items-center gap-2">
                        <Paperclip className="w-3 h-3 text-[#4D9DE0] flex-shrink-0" />
                        <span style={{ fontFamily: 'DM Sans', fontSize: '12px', fontWeight: 400 }} className="text-[#2C2C2A]">{ref}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
              <div className="space-y-3">
                {/* Design specifications */}
                <div>
                  <p style={{ fontFamily: 'DM Sans', fontSize: '12px', fontWeight: 400 }} className="text-[#2C2C2A] opacity-60 uppercase tracking-wide mb-2">Design Specifications</p>
                  <div className="bg-[#D6E8F7] border border-[#EAEDF2] p-3 space-y-1.5" style={{ borderRadius: '8px', borderWidth: '0.5px' }}>
                    {[
                      { label: 'Format', value: 'A4 (210×297 mm)' },
                      { label: 'Resolution', value: '300 DPI' },
                      { label: 'Color Mode', value: 'CMYK' },
                      { label: 'Bleed', value: '3 mm all sides' },
                      { label: 'Font', value: 'Palatino / Helvetica Neue' },
                    ].map(spec => (
                      <div key={spec.label} className="flex justify-between">
                        <span style={{ fontFamily: 'DM Sans', fontSize: '12px', fontWeight: 400 }} className="text-[#2C2C2A] opacity-60">{spec.label}</span>
                        <span style={{ fontFamily: 'DM Sans', fontSize: '12px', fontWeight: 600 }} className="text-[#2C2C2A]">{spec.value}</span>
                      </div>
                    ))}
                  </div>
                </div>
                <div className="bg-[#FAEEDA] border border-[#EAEDF2] p-3" style={{ borderRadius: '8px', borderWidth: '0.5px' }}>
                  <p style={{ fontFamily: 'DM Sans', fontSize: '12px', fontWeight: 600 }} className="text-[#633806] mb-1 flex items-center gap-1">
                    <AlertCircle className="w-3.5 h-3.5" />
                    Open Issues
                  </p>
                  <ul className="space-y-0.5">
                    <li style={{ fontFamily: 'DM Sans', fontSize: '12px', fontWeight: 400 }} className="text-[#633806]">• Cover dimensions bleed area unconfirmed</li>
                    <li style={{ fontFamily: 'DM Sans', fontSize: '12px', fontWeight: 400 }} className="text-[#633806]">• ISBN placement pending editor confirmation</li>
                  </ul>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-6">

          {/* SECTION 4 — Layout Validation Panel */}
          <div className="bg-[#FFFFFF] border border-[#EAEDF2] p-5" style={{ borderRadius: '12px', borderWidth: '0.5px' }}>
            <h2 style={{ fontFamily: 'Inter', fontSize: '16px', fontWeight: 600 }} className="text-[#0F2D5E] uppercase tracking-wide mb-4">Layout Validation</h2>
            <div className="space-y-3">
              {validationCards.map(card => (
                <div key={card.label}>
                  <div className="flex items-center justify-between mb-1">
                    <span style={{ fontFamily: 'DM Sans', fontSize: '12px', fontWeight: 400 }} className="text-[#2C2C2A]">{card.label}</span>
                    <div className="flex items-center gap-2">
                      <span style={{ fontFamily: 'DM Sans', fontSize: '12px', fontWeight: 400, borderRadius: '6px' }} className={`px-2 py-0.5 ${getBadgeColor(card.color)}`}>{card.badge}</span>
                      <span style={{ fontFamily: 'DM Sans', fontSize: '12px', fontWeight: 600 }} className="text-[#2C2C2A]">{card.score}%</span>
                    </div>
                  </div>
                  <div className="w-full bg-[#EAEDF2] h-1.5" style={{ borderRadius: '8px' }}>
                    <div className={`h-1.5 ${getBarColor(card.color)}`} style={{ width: `${card.score}%`, borderRadius: '8px' }} />
                  </div>
                </div>
              ))}
            </div>
            <div className="mt-4 pt-4 border-t border-[#EAEDF2]" style={{ borderWidth: '0.5px' }}>
              <div className="flex items-center justify-between">
                <p style={{ fontFamily: 'DM Sans', fontSize: '12px', fontWeight: 600 }} className="text-[#2C2C2A]">Overall Layout Score</p>
                <span style={{ fontFamily: 'DM Sans', fontSize: '12px', fontWeight: 600, borderRadius: '6px' }} className="px-3 py-1 bg-[#E6F1FB] text-[#0C447C]">92% — Nearly Print Ready</span>
              </div>
              <p style={{ fontFamily: 'DM Sans', fontSize: '12px', fontWeight: 400 }} className="text-[#633806] mt-2 flex items-center gap-1.5">
                <AlertCircle className="w-3.5 h-3.5 flex-shrink-0" />
                Resolve cover dimensions before submitting to editor.
              </p>
            </div>
          </div>

          {/* SECTION 5 — Layout Artist Notes Panel */}
          <div className="bg-[#FFFFFF] border border-[#EAEDF2] p-5" style={{ borderRadius: '12px', borderWidth: '0.5px' }}>
            <h2 style={{ fontFamily: 'Inter', fontSize: '16px', fontWeight: 600 }} className="text-[#0F2D5E] uppercase tracking-wide mb-4">Layout Artist Notes</h2>

            <div className="space-y-3 mb-5">
              {[
                { label: 'Cover Design Notes', value: coverNotes, setter: setCoverNotes, placeholder: 'Describe key design decisions and approach for this cover...', required: true },
                { label: 'Layout Revision Notes', value: revisionNotes, setter: setRevisionNotes, placeholder: 'Document changes made in this revision from prior version...' },
                { label: 'Design Justification Notes', value: justificationNotes, setter: setJustificationNotes, placeholder: 'Justify typographic and layout choices made...' },
                { label: 'Print Preparation Notes', value: printNotes, setter: setPrintNotes, placeholder: 'Notes for print production team regarding this design...' },
                { label: 'Editor Guidance Notes', value: editorGuidanceNotes, setter: setEditorGuidanceNotes, placeholder: 'Any specific guidance or requests for the reviewing editor...' },
              ].map(field => (
                <div key={field.label}>
                  <label style={{ fontFamily: 'DM Sans', fontSize: '12px', fontWeight: 400 }} className="text-[#2C2C2A] opacity-60 uppercase tracking-wide block mb-1">
                    {field.label}{field.required && <span className="text-[#633806] ml-1">*</span>}
                  </label>
                  <textarea
                    value={field.value}
                    onChange={e => field.setter(e.target.value)}
                    placeholder={field.placeholder}
                    rows={2}
                    className="w-full border border-[#EAEDF2] p-2.5 text-[#2C2C2A] resize-none focus:outline-none focus:ring-1 focus:ring-[#4D9DE0] focus:border-[#4D9DE0]"
                    style={{ borderRadius: '8px', borderWidth: '0.5px', fontFamily: 'DM Sans', fontSize: '14px', fontWeight: 400 }}
                  />
                </div>
              ))}
            </div>

            <div className="space-y-2">
              <p style={{ fontFamily: 'DM Sans', fontSize: '12px', fontWeight: 400 }} className="text-[#2C2C2A] opacity-60 uppercase tracking-wide mb-2">Decision</p>
              {[
                { id: 'send' as DesignDecision, label: 'Send Cover Design to Editor', icon: Send, colors: 'border-[#085041] text-[#085041] bg-[#E1F5EE] hover:bg-[#085041] hover:text-white' },
                { id: 'revise' as DesignDecision, label: 'Revise Cover Design', icon: RotateCcw, colors: 'border-[#633806] text-[#633806] bg-[#FAEEDA] hover:bg-[#633806] hover:text-white' },
                { id: 'hold' as DesignDecision, label: 'Hold for Additional Validation', icon: PauseCircle, colors: 'border-[#EAEDF2] text-[#444441] bg-[#EAEDF2] hover:bg-[#444441] hover:text-white' },
              ].map(opt => {
                const Icon = opt.icon;
                return (
                  <button
                    key={opt.id}
                    onClick={() => setDecision(decision === opt.id ? null : opt.id)}
                    className={`w-full flex items-center gap-2.5 px-3 py-2.5 border transition-all ${opt.colors} ${decision === opt.id ? 'ring-2 ring-offset-1 ring-[#0F2D5E]' : ''}`}
                    style={{ borderRadius: '8px', borderWidth: '0.5px', fontFamily: 'DM Sans', fontSize: '12px', fontWeight: 600 }}
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
          <div className="bg-[#FFFFFF] border border-[#EAEDF2] p-5" style={{ borderRadius: '12px', borderWidth: '0.5px' }}>
            <h2 style={{ fontFamily: 'Inter', fontSize: '16px', fontWeight: 600 }} className="text-[#0F2D5E] uppercase tracking-wide mb-4">File Management</h2>
            <div className="space-y-2.5 mb-4">
              {designFiles.map(file => (
                <div key={file.id} className="flex items-start gap-2.5 p-2.5 bg-[#F7F8FA] border border-[#EAEDF2] hover:border-[#4D9DE0] transition-colors" style={{ borderRadius: '8px', borderWidth: '0.5px' }}>
                  <Image className="w-4 h-4 text-[#0F2D5E] flex-shrink-0 mt-0.5" />
                  <div className="flex-1 min-w-0">
                    <p style={{ fontFamily: 'DM Sans', fontSize: '12px', fontWeight: 600 }} className="text-[#2C2C2A] truncate">{file.name}</p>
                    <p style={{ fontFamily: 'DM Sans', fontSize: '12px', fontWeight: 400 }} className="text-[#2C2C2A] opacity-60">{file.type} · {file.size}</p>
                    <p style={{ fontFamily: 'JetBrains Mono', fontSize: '12px', fontWeight: 400 }} className="text-[#2C2C2A] opacity-40">{file.date.toLocaleDateString()}</p>
                  </div>
                  <div className="flex flex-col items-end gap-1.5">
                    <span style={{ fontFamily: 'DM Sans', fontSize: '12px', fontWeight: 400, borderRadius: '6px' }} className={`px-1.5 py-0.5 whitespace-nowrap ${getFileBadge(file.status)}`}>
                      {getFileLabel(file.status)}
                    </span>
                    <button className="text-[#4D9DE0] hover:text-[#0F2D5E] transition-colors">
                      <Download className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              ))}
            </div>
            <div className="space-y-2">
              {['Upload Final Cover Design', 'Upload Editable Source Files', 'Upload Print-Ready Files'].map(label => (
                <button key={label} className="w-full flex items-center justify-center gap-2 px-3 py-2 border border-dashed border-[#EAEDF2] text-[#2C2C2A] opacity-60 hover:border-[#0F2D5E] hover:text-[#0F2D5E] transition-colors" style={{ borderRadius: '8px', borderWidth: '0.5px', fontFamily: 'DM Sans', fontSize: '12px', fontWeight: 400 }}>
                  <Upload className="w-3.5 h-3.5" />
                  {label}
                </button>
              ))}
            </div>
          </div>

          {/* SECTION 7 + 8 — Workflow + Timeline */}
          <div className="space-y-4">
            <div className="bg-[#FFFFFF] border border-[#EAEDF2] p-5" style={{ borderRadius: '12px', borderWidth: '0.5px' }}>
              <h2 style={{ fontFamily: 'Inter', fontSize: '16px', fontWeight: 600 }} className="text-[#0F2D5E] uppercase tracking-wide mb-3">Workflow Status</h2>
              <div className="space-y-1">
                {workflowStages.map((stage, i) => (
                  <div key={stage} className="flex items-center gap-2">
                    <div className={`w-2 h-2 flex-shrink-0 ${i === currentStageIndex ? 'bg-[#0F2D5E]' : i < currentStageIndex ? 'bg-[#085041]' : 'bg-[#EAEDF2]'}`} style={{ borderRadius: '50%' }} />
                    <span style={{ fontFamily: 'DM Sans', fontSize: '12px', fontWeight: i === currentStageIndex ? 600 : 400 }} className={i === currentStageIndex ? 'text-[#0F2D5E]' : i < currentStageIndex ? 'text-[#085041]' : 'text-[#2C2C2A] opacity-40'}>{stage}</span>
                    {i === currentStageIndex && <ChevronRight className="w-3 h-3 text-[#0F2D5E] ml-auto" />}
                  </div>
                ))}
              </div>
              <div className="mt-3 pt-3 border-t border-[#EAEDF2] space-y-1.5" style={{ borderWidth: '0.5px' }}>
                <div className="flex justify-between">
                  <span style={{ fontFamily: 'DM Sans', fontSize: '12px', fontWeight: 400 }} className="text-[#2C2C2A] opacity-60">Last Updated</span>
                  <span style={{ fontFamily: 'JetBrains Mono', fontSize: '12px', fontWeight: 400 }} className="text-[#2C2C2A]">{new Date().toLocaleDateString()}</span>
                </div>
                <div className="flex justify-between">
                  <span style={{ fontFamily: 'DM Sans', fontSize: '12px', fontWeight: 400 }} className="text-[#2C2C2A] opacity-60">Delay Risk</span>
                  <span style={{ fontFamily: 'DM Sans', fontSize: '12px', fontWeight: 400, borderRadius: '6px' }} className="px-2 py-0.5 bg-[#FAEEDA] text-[#633806]">High Risk</span>
                </div>
                <div className="flex justify-between">
                  <span style={{ fontFamily: 'DM Sans', fontSize: '12px', fontWeight: 400 }} className="text-[#2C2C2A] opacity-60">Next Stage</span>
                  <span style={{ fontFamily: 'DM Sans', fontSize: '12px', fontWeight: 400 }} className="text-[#2C2C2A]">Editor Approval</span>
                </div>
              </div>
            </div>

            <div className="bg-[#FFFFFF] border border-[#EAEDF2] p-5" style={{ borderRadius: '12px', borderWidth: '0.5px' }}>
              <h2 style={{ fontFamily: 'Inter', fontSize: '16px', fontWeight: 600 }} className="text-[#0F2D5E] uppercase tracking-wide mb-3">Timeline Recommendation</h2>
              <div className="space-y-2.5">
                {[
                  { label: 'Recommended Layout Duration', value: '3–5 days', badge: null },
                  { label: 'Current Stage Progress', value: '70%', badge: null },
                  { label: 'Delay Risk', value: '', badge: 'Moderate Delay Risk' },
                  { label: 'Est. Next-Stage Transition', value: 'May 28, 2026', badge: null },
                  { label: 'Timeline Confidence', value: '', badge: 'On Schedule' },
                ].map(item => (
                  <div key={item.label} className="flex items-center justify-between py-1.5 border-b border-[#EAEDF2] last:border-0" style={{ borderWidth: '0.5px' }}>
                    <span style={{ fontFamily: 'DM Sans', fontSize: '12px', fontWeight: 400 }} className="text-[#2C2C2A] opacity-60">{item.label}</span>
                    {item.badge ? (
                      <span style={{ fontFamily: 'DM Sans', fontSize: '12px', fontWeight: 400, borderRadius: '6px' }} className={`px-2 py-0.5 ${item.badge === 'On Schedule' ? 'bg-[#E1F5EE] text-[#085041]' : 'bg-[#FAEEDA] text-[#633806]'}`}>{item.badge}</span>
                    ) : (
                      <span style={{ fontFamily: 'DM Sans', fontSize: '12px', fontWeight: 600 }} className="text-[#2C2C2A]">{item.value}</span>
                    )}
                  </div>
                ))}
              </div>
              <p style={{ fontFamily: 'JetBrains Mono', fontSize: '12px', fontWeight: 400 }} className="text-[#2C2C2A] opacity-40 mt-3">Last reassessed: {new Date().toLocaleDateString()}</p>
            </div>
          </div>

          {/* SECTION 9 + 10 + 11 — History, Alerts, Activity */}
          <div className="space-y-4">
            <div className="bg-[#FFFFFF] border border-[#EAEDF2] p-5" style={{ borderRadius: '12px', borderWidth: '0.5px' }}>
              <h2 style={{ fontFamily: 'Inter', fontSize: '16px', fontWeight: 600 }} className="text-[#0F2D5E] uppercase tracking-wide mb-3">Design & Revision History</h2>
              <div className="space-y-2.5">
                {history.map(item => (
                  <div key={item.id} className="flex items-start gap-2.5 pb-2.5 border-b border-[#EAEDF2] last:border-0" style={{ borderWidth: '0.5px' }}>
                    <div className="w-1.5 h-1.5 bg-[#0F2D5E] mt-1.5 flex-shrink-0" style={{ borderRadius: '50%' }} />
                    <div className="flex-1 min-w-0">
                      <p style={{ fontFamily: 'DM Sans', fontSize: '12px', fontWeight: 400 }} className="text-[#2C2C2A] leading-snug">{item.event}</p>
                      <p style={{ fontFamily: 'DM Sans', fontSize: '12px', fontWeight: 400 }} className="text-[#2C2C2A] opacity-60">{item.actor} · {item.date.toLocaleDateString()}</p>
                    </div>
                    <span style={{ fontFamily: 'DM Sans', fontSize: '12px', fontWeight: 400, borderRadius: '6px' }} className="px-1.5 py-0.5 bg-[#EAEDF2] text-[#444441] whitespace-nowrap">{item.badge}</span>
                  </div>
                ))}
              </div>
            </div>

            <div className="bg-[#FFFFFF] border border-[#EAEDF2] p-5" style={{ borderRadius: '12px', borderWidth: '0.5px' }}>
              <h2 style={{ fontFamily: 'Inter', fontSize: '16px', fontWeight: 600 }} className="text-[#0F2D5E] uppercase tracking-wide mb-3">Alerts & Notifications</h2>
              <div className="space-y-2">
                {alerts.map(alert => (
                  <div
                    key={alert.id}
                    className={`flex items-start gap-2 p-2.5 border-l-4 ${
                      alert.type === 'warning' ? 'bg-[#FAEEDA] border-[#633806] text-[#633806]' :
                      alert.type === 'deadline' ? 'bg-[#FAEEDA] border-[#633806] text-[#633806]' :
                      'bg-[#E6F1FB] border-[#0C447C] text-[#0C447C]'
                    }`}
                    style={{ borderRadius: '8px', fontFamily: 'DM Sans', fontSize: '12px', fontWeight: 400 }}
                  >
                    {alert.type === 'warning' ? <AlertTriangle className="w-3.5 h-3.5 flex-shrink-0 mt-0.5" /> :
                     alert.type === 'deadline' ? <Clock className="w-3.5 h-3.5 flex-shrink-0 mt-0.5" /> :
                     <Info className="w-3.5 h-3.5 flex-shrink-0 mt-0.5" />}
                    {alert.message}
                  </div>
                ))}
              </div>
            </div>

            <div className="bg-[#FFFFFF] border border-[#EAEDF2] p-5" style={{ borderRadius: '12px', borderWidth: '0.5px' }}>
              <h2 style={{ fontFamily: 'Inter', fontSize: '16px', fontWeight: 600 }} className="text-[#0F2D5E] uppercase tracking-wide mb-3">Activity Log</h2>
              <div className="space-y-2.5">
                {activityLog.map(item => (
                  <div key={item.id} className="flex items-start gap-2.5 pb-2 border-b border-[#EAEDF2] last:border-0" style={{ borderWidth: '0.5px' }}>
                    <div className="w-1.5 h-1.5 bg-[#4D9DE0] mt-1.5 flex-shrink-0" style={{ borderRadius: '50%' }} />
                    <div className="flex-1">
                      <p style={{ fontFamily: 'DM Sans', fontSize: '12px', fontWeight: 400 }} className="text-[#2C2C2A] leading-snug">{item.action}</p>
                      <p style={{ fontFamily: 'JetBrains Mono', fontSize: '12px', fontWeight: 400 }} className="text-[#2C2C2A] opacity-40 mt-0.5">{item.user} · {item.timestamp.toLocaleString()}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Sticky Bottom Action Bar */}
      <div className="fixed bottom-0 left-0 right-0 z-50 bg-white border-t border-[#EAEDF2]" style={{ borderWidth: '0.5px' }}>
        <div className="max-w-[1400px] mx-auto px-8 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <button
              onClick={() => setPageStatus('draft_saved')}
              className="flex items-center gap-2 px-4 py-2 border border-[#EAEDF2] text-[#2C2C2A] hover:bg-[#D6E8F7] transition-colors"
              style={{ borderRadius: '8px', borderWidth: '0.5px', fontFamily: 'DM Sans', fontSize: '14px', fontWeight: 400 }}
            >
              <Save className="w-4 h-4" />
              Save Draft
            </button>
            <button className="flex items-center gap-2 px-4 py-2 border border-[#EAEDF2] text-[#2C2C2A] hover:bg-[#D6E8F7] transition-colors" style={{ borderRadius: '8px', borderWidth: '0.5px', fontFamily: 'DM Sans', fontSize: '14px', fontWeight: 400 }}>
              <Eye className="w-4 h-4" />
              Preview Cover Design
            </button>
            <button className="flex items-center gap-2 px-4 py-2 border border-[#EAEDF2] text-[#2C2C2A] hover:bg-[#D6E8F7] transition-colors" style={{ borderRadius: '8px', borderWidth: '0.5px', fontFamily: 'DM Sans', fontSize: '14px', fontWeight: 400 }}>
              <Upload className="w-4 h-4" />
              Upload Final Cover Design
            </button>
          </div>

          <div className="flex items-center gap-3">
            {pageStatus === 'draft_saved' && (
              <span className="flex items-center gap-1.5" style={{ fontFamily: 'DM Sans', fontSize: '12px', fontWeight: 400, color: '#444441' }}>
                <CheckCircle className="w-3.5 h-3.5 text-[#085041]" />
                Draft saved
              </span>
            )}
            <button onClick={onBack} className="px-4 py-2 border border-[#EAEDF2] text-[#2C2C2A] opacity-60 hover:opacity-100 transition-colors" style={{ borderRadius: '8px', borderWidth: '0.5px', fontFamily: 'DM Sans', fontSize: '14px', fontWeight: 400 }}>
              Cancel
            </button>
            <button
              onClick={() => { setDecision('revise'); setShowConfirmModal(true); }}
              className="flex items-center gap-2 px-4 py-2 border border-[#633806] text-[#633806] bg-[#FAEEDA] hover:bg-[#633806] hover:text-white transition-colors"
              style={{ borderRadius: '8px', borderWidth: '0.5px', fontFamily: 'DM Sans', fontSize: '14px', fontWeight: 600 }}
            >
              <RotateCcw className="w-4 h-4" />
              Request Additional Revision
            </button>
            <button
              onClick={() => { setDecision('send'); setShowConfirmModal(true); }}
              className="flex items-center gap-2 px-5 py-2 bg-[#0F2D5E] text-white hover:bg-[#1A4A8A] transition-colors"
              style={{ borderRadius: '8px', fontFamily: 'DM Sans', fontSize: '14px', fontWeight: 600 }}
            >
              <Send className="w-4 h-4" />
              Send Cover Design to Editor
            </button>
          </div>
        </div>
      </div>

      {/* Confirmation Modal */}
      {showConfirmModal && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
          <div className="bg-white border border-[#EAEDF2] w-full max-w-md p-6" style={{ borderRadius: '12px', borderWidth: '0.5px' }}>
            <h3 style={{ fontFamily: 'Inter', fontSize: '22px', fontWeight: 600 }} className="text-[#0F2D5E] mb-2">
              {decision === 'send' ? 'Send Cover Design to Editor' : decision === 'revise' ? 'Revise Cover Design' : 'Hold for Additional Validation'}
            </h3>
            <p style={{ fontFamily: 'DM Sans', fontSize: '14px', fontWeight: 400 }} className="text-[#2C2C2A] mb-4">
              {decision === 'send'
                ? 'The finalized cover design (v2.0) and all supporting files will be submitted to the editor for review and production approval.'
                : decision === 'revise'
                ? 'The cover design will be marked for revision. You can continue making changes and resubmit.'
                : 'The cover design will be placed on hold pending further validation before submission.'}
            </p>
            <div className="bg-[#D6E8F7] border border-[#EAEDF2] p-3 mb-5 space-y-1.5" style={{ borderRadius: '8px', borderWidth: '0.5px', fontFamily: 'DM Sans', fontSize: '12px', fontWeight: 400, color: '#2C2C2A' }}>
              <p><span style={{ fontWeight: 600 }}>Manuscript:</span> {manuscript.title}</p>
              <p><span style={{ fontWeight: 600 }}>Author:</span> {manuscript.authorName}</p>
              <p><span style={{ fontWeight: 600 }}>Cover Version:</span> v2.0</p>
              <p><span style={{ fontWeight: 600 }}>Action:</span> {decision === 'send' ? 'Submit to Editor for Approval' : decision === 'revise' ? 'Mark for Revision' : 'Place on Hold'}</p>
            </div>
            <div className="flex gap-3">
              <button onClick={() => setShowConfirmModal(false)} className="flex-1 px-4 py-2 border border-[#EAEDF2] text-[#2C2C2A] hover:bg-[#D6E8F7]" style={{ borderRadius: '8px', borderWidth: '0.5px', fontFamily: 'DM Sans', fontSize: '14px', fontWeight: 400 }}>
                Cancel
              </button>
              <button
                onClick={handleConfirm}
                className={`flex-1 px-4 py-2 text-white ${decision === 'send' ? 'bg-[#0F2D5E] hover:bg-[#1A4A8A]' : decision === 'revise' ? 'bg-[#633806] hover:bg-[#633806] opacity-90' : 'bg-[#444441] hover:bg-[#2C2C2A]'}`}
                style={{ borderRadius: '8px', fontFamily: 'DM Sans', fontSize: '14px', fontWeight: 600 }}
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
