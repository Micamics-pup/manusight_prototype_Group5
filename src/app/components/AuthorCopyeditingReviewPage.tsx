import React, { useState } from 'react';
import {
  ArrowLeft,
  FileText,
  CheckCircle,
  Clock,
  AlertCircle,
  Download,
  Upload,
  Eye,
  Save,
  Send,
  AlertTriangle,
  FileCheck,
  MessageSquare,
  RotateCcw,
  ThumbsUp,
} from 'lucide-react';
import type { Manuscript } from '../types';

interface CopyeditingItem {
  id: string;
  label: string;
  status: 'applied' | 'warning' | 'concern';
}

interface FeedbackFile {
  id: string;
  name: string;
  size: string;
  uploadedAt: Date;
  status: 'uploaded';
}

interface ActivityRecord {
  id: string;
  timestamp: Date;
  action: string;
  user: string;
}

interface AuthorCopyeditingReviewPageProps {
  manuscript: Manuscript;
  onBack: () => void;
}

export function AuthorCopyeditingReviewPage({ manuscript, onBack }: AuthorCopyeditingReviewPageProps) {
  const [decision, setDecision] = useState<'approve' | 'minor_corrections' | 'additional_revisions' | null>(null);
  const [showConfirmModal, setShowConfirmModal] = useState(false);
  const [feedbackComments, setFeedbackComments] = useState('');
  const [formattingConcerns, setFormattingConcerns] = useState('');
  const [languageClarifications, setLanguageClarifications] = useState('');
  const [citationConcerns, setCitationConcerns] = useState('');
  const [additionalRequests, setAdditionalRequests] = useState('');
  const [approvalRemarks, setApprovalRemarks] = useState('');
  const [uploadedFiles, setUploadedFiles] = useState<FeedbackFile[]>([]);

  const copyeditingItems: CopyeditingItem[] = [
    { id: 'ce-1', label: 'Grammar and spelling corrections applied', status: 'applied' },
    { id: 'ce-2', label: 'Formatting consistency improved', status: 'applied' },
    { id: 'ce-3', label: 'Citation and reference formatting updated', status: 'applied' },
    { id: 'ce-4', label: 'Figure and table formatting adjusted', status: 'warning' },
    { id: 'ce-5', label: 'Journal template compliance applied', status: 'applied' },
    { id: 'ce-6', label: 'Language clarity improvements completed', status: 'applied' },
  ];

  const appliedCount = copyeditingItems.filter(i => i.status === 'applied').length;
  const warningCount = copyeditingItems.filter(i => i.status === 'warning').length;
  const concernCount = copyeditingItems.filter(i => i.status === 'concern').length;

  const activityLog: ActivityRecord[] = [
    { id: 'a-1', timestamp: new Date(Date.now() - 2 * 60 * 60 * 1000), action: 'Copyedited manuscript forwarded by editor for author review', user: 'Dr. Sarah Johnson' },
    { id: 'a-2', timestamp: new Date(Date.now() - 4 * 60 * 60 * 1000), action: 'Editor copyediting review completed', user: 'Dr. Sarah Johnson' },
    { id: 'a-3', timestamp: new Date(Date.now() - 8 * 60 * 60 * 1000), action: 'TWG Coordinator validation approved', user: 'Maria Rodriguez' },
    { id: 'a-4', timestamp: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000), action: 'Copyediting completed and submitted', user: 'Sarah Martinez' },
  ];

  const deadline = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000);
  const daysRemaining = Math.ceil((deadline.getTime() - Date.now()) / (1000 * 60 * 60 * 24));

  const getItemIcon = (status: string) => {
    if (status === 'applied') return <CheckCircle className="w-5 h-5 text-green-600" />;
    if (status === 'warning') return <AlertTriangle className="w-5 h-5 text-amber-600" />;
    return <AlertCircle className="w-5 h-5 text-red-600" />;
  };

  const getItemBadge = (status: string) => {
    if (status === 'applied') return 'bg-green-100 text-green-800';
    if (status === 'warning') return 'bg-amber-100 text-amber-800';
    return 'bg-red-100 text-red-800';
  };

  const getItemLabel = (status: string) => {
    if (status === 'applied') return 'Applied';
    if (status === 'warning') return 'Verify';
    return 'Concern';
  };

  const canSubmit = decision !== null && (
    decision === 'approve' ? approvalRemarks.length > 0 : feedbackComments.length > 0
  );

  const handleSubmit = () => {
    setShowConfirmModal(false);
    onBack();
  };

  const getStatusBadge = () => {
    if (decision === 'approve') return { label: 'Copyediting Approved', color: 'bg-green-100 text-green-800' };
    if (decision === 'minor_corrections') return { label: 'Minor Corrections Requested', color: 'bg-amber-100 text-amber-800' };
    if (decision === 'additional_revisions') return { label: 'Additional Revision Requested', color: 'bg-red-100 text-red-800' };
    return { label: 'Under Author Copyediting Review', color: 'bg-blue-100 text-blue-800' };
  };

  const statusBadge = getStatusBadge();

  return (
    <div className="min-h-screen bg-[#F7F8FA] pb-32">
      {/* Header */}
      <div className="bg-[#0F2D5E] text-white py-6 px-8 sticky top-0 z-50 shadow-lg">
        <div className="max-w-[1400px] mx-auto">
          <button onClick={onBack} className="flex items-center gap-2 text-gray-300 hover:text-white transition-colors mb-4 text-sm">
            <ArrowLeft className="w-4 h-4" />
            Back to Dashboard
          </button>
          <div className="flex items-start justify-between">
            <div>
              <h1 className="text-2xl font-bold font-serif mb-1">Copyediting Review</h1>
              <p className="text-sm text-gray-300">Review copyediting changes and submit your feedback</p>
            </div>
            <div className="text-right">
              <span className={`px-4 py-2 text-sm font-medium rounded-lg inline-block mb-2 ${statusBadge.color}`}>
                {statusBadge.label}
              </span>
              <div className="text-sm">
                <p className="text-gray-400">Feedback Deadline</p>
                <p className="text-lg font-bold">{deadline.toLocaleDateString()}</p>
                <p className="text-amber-400 font-medium">{daysRemaining} days remaining</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-[1400px] mx-auto px-8 py-8">

        {/* Manuscript Summary Card */}
        <div className="bg-white rounded-sm border-2 border-[#1a1f2e] shadow-md p-6 mb-6">
          <h2 className="text-lg font-bold font-serif text-[#0F2D5E] mb-4">Manuscript Summary</h2>
          <div className="grid grid-cols-2 gap-6">
            <div className="space-y-3">
              <div>
                <p className="text-xs text-gray-500 uppercase tracking-wide">Title</p>
                <p className="font-bold text-gray-900 mt-1">{manuscript.title}</p>
              </div>
              <div>
                <p className="text-xs text-gray-500 uppercase tracking-wide">Authors and Affiliations</p>
                <p className="font-semibold text-gray-900 mt-1">{manuscript.authorName}</p>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="text-xs text-gray-500 uppercase tracking-wide">Manuscript ID</p>
                  <p className="font-semibold text-gray-900 mt-1">{manuscript.id}</p>
                </div>
                <div>
                  <p className="text-xs text-gray-500 uppercase tracking-wide">Version</p>
                  <p className="font-semibold text-gray-900 mt-1">{manuscript.files.length}</p>
                </div>
                <div>
                  <p className="text-xs text-gray-500 uppercase tracking-wide">Category</p>
                  <p className="font-semibold text-gray-900 mt-1">{manuscript.category}</p>
                </div>
                <div>
                  <p className="text-xs text-gray-500 uppercase tracking-wide">Submission Date</p>
                  <p className="font-semibold text-gray-900 mt-1">{manuscript.submittedAt.toLocaleDateString()}</p>
                </div>
              </div>
              <div>
                <p className="text-xs text-gray-500 uppercase tracking-wide">Copyediting Completion Date</p>
                <p className="font-semibold text-gray-900 mt-1">{new Date(Date.now() - 2 * 60 * 60 * 1000).toLocaleDateString()}</p>
              </div>
              <div>
                <p className="text-xs text-gray-500 uppercase tracking-wide">Current Workflow Stage</p>
                <p className="font-semibold text-gray-900 mt-1">Author Copyediting Review</p>
              </div>
            </div>
            <div className="flex flex-col">
              <p className="text-xs text-gray-500 uppercase tracking-wide mb-2">Abstract Preview</p>
              <div className="bg-[#F7F8FA] rounded border border-gray-300 p-4 flex-1 overflow-y-auto max-h-[200px]">
                <p className="text-sm text-gray-700 leading-relaxed">{manuscript.abstract}</p>
              </div>
              <div className="flex gap-2 mt-4">
                <button className="flex items-center gap-2 px-4 py-2 bg-[#0F2D5E] text-white rounded hover:bg-gray-800 transition-colors text-sm font-medium">
                  <Eye className="w-4 h-4" /> View Manuscript
                </button>
                <button className="flex items-center gap-2 px-4 py-2 border-2 border-[#1a1f2e] rounded hover:bg-gray-50 transition-colors text-sm font-medium">
                  <Download className="w-4 h-4" /> Download Files
                </button>
                <button className="flex items-center gap-2 px-4 py-2 border-2 border-[#1a1f2e] rounded hover:bg-gray-50 transition-colors text-sm font-medium">
                  <MessageSquare className="w-4 h-4" /> Copyediting Notes
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Copyediting Review Summary + Manuscript Review */}
        <div className="grid grid-cols-2 gap-6 mb-6">

          {/* Copyediting Review Summary */}
          <div className="bg-white rounded-sm border-2 border-[#1a1f2e] shadow-md p-6">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-lg font-bold font-serif text-[#0F2D5E]">Copyediting Review Summary</h2>
              <div className="flex items-center gap-3 text-sm">
                <span className="text-green-700 font-semibold">{appliedCount} applied</span>
                {warningCount > 0 && <span className="text-amber-700 font-semibold">{warningCount} verify</span>}
                {concernCount > 0 && <span className="text-red-700 font-semibold">{concernCount} concerns</span>}
              </div>
            </div>
            <div className="mb-4">
              <div className="flex items-center justify-between text-xs text-gray-500 mb-1">
                <span>Review progress</span>
                <span>{appliedCount}/{copyeditingItems.length}</span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-2.5">
                <div className="bg-green-600 h-2.5 rounded-full" style={{ width: `${(appliedCount / copyeditingItems.length) * 100}%` }}></div>
              </div>
            </div>
            <div className="space-y-2">
              {copyeditingItems.map(item => (
                <div key={item.id} className="flex items-center gap-3 p-3 bg-gray-50 rounded border border-gray-200">
                  {getItemIcon(item.status)}
                  <p className="text-sm font-medium text-gray-900 flex-1">{item.label}</p>
                  <span className={`px-2 py-1 rounded-full text-xs font-medium ${getItemBadge(item.status)}`}>
                    {getItemLabel(item.status)}
                  </span>
                </div>
              ))}
            </div>
            {warningCount > 0 && (
              <div className="mt-3 bg-amber-50 border border-amber-300 rounded p-3">
                <p className="text-xs font-semibold text-amber-800">
                  <AlertTriangle className="w-3.5 h-3.5 inline mr-1" />
                  {warningCount} item(s) flagged for your verification before approving
                </p>
              </div>
            )}
          </div>

          {/* Copyedited Manuscript Review */}
          <div className="bg-white rounded-sm border-2 border-[#1a1f2e] shadow-md p-6">
            <h2 className="text-lg font-bold font-serif text-[#0F2D5E] mb-4">Copyedited Manuscript Review</h2>
            <div className="bg-[#F7F8FA] rounded border-2 border-gray-300 p-5 mb-4 min-h-[260px] flex flex-col items-center justify-center">
              <FileText className="w-14 h-14 text-gray-400 mb-3" />
              <p className="text-sm font-semibold text-gray-700 mb-1">Preview-Only Document Viewer</p>
              <p className="text-xs text-gray-500 mb-4 text-center">Review the finalized copyedited manuscript</p>
              <div className="w-full space-y-2">
                <div className="flex items-center justify-between p-2 bg-white rounded border border-gray-200">
                  <span className="text-xs text-gray-700">Final copyedited manuscript</span>
                  <FileCheck className="w-4 h-4 text-green-600" />
                </div>
                <div className="flex items-center justify-between p-2 bg-white rounded border border-gray-200">
                  <span className="text-xs text-gray-700">Marked manuscript (tracked changes)</span>
                  <FileCheck className="w-4 h-4 text-green-600" />
                </div>
                <div className="flex items-center justify-between p-2 bg-white rounded border border-gray-200">
                  <span className="text-xs text-gray-700">Copyediting summary notes</span>
                  <MessageSquare className="w-4 h-4 text-blue-600" />
                </div>
                <div className="flex items-center justify-between p-2 bg-white rounded border border-gray-200">
                  <span className="text-xs text-gray-700">Version {manuscript.files.length} — Editor validated</span>
                  <CheckCircle className="w-4 h-4 text-green-600" />
                </div>
              </div>
            </div>
            <div className="flex gap-2">
              <button className="flex-1 flex items-center justify-center gap-2 px-3 py-2 bg-[#0F2D5E] text-white rounded hover:bg-gray-800 transition-colors text-sm font-medium">
                <Eye className="w-4 h-4" /> Open Preview
              </button>
              <button className="flex-1 flex items-center justify-center gap-2 px-3 py-2 border-2 border-[#1a1f2e] rounded hover:bg-gray-50 transition-colors text-sm font-medium">
                <Download className="w-4 h-4" /> Download
              </button>
            </div>
          </div>
        </div>

        {/* Author Feedback Panel */}
        <div className="bg-white rounded-sm border-2 border-[#1a1f2e] shadow-md p-6 mb-6">
          <h2 className="text-lg font-bold font-serif text-[#0F2D5E] mb-4">Author Feedback</h2>

          {/* Decision selector */}
          <div className="mb-6">
            <p className="text-sm font-semibold text-gray-700 mb-3">Select your decision *</p>
            <div className="grid grid-cols-3 gap-4">
              <button
                onClick={() => setDecision('approve')}
                className={`p-4 rounded border-2 text-left transition-all ${decision === 'approve' ? 'border-green-600 bg-green-50' : 'border-gray-200 hover:border-green-400 hover:bg-green-50'}`}
              >
                <ThumbsUp className={`w-5 h-5 mb-2 ${decision === 'approve' ? 'text-green-600' : 'text-gray-400'}`} />
                <p className={`text-sm font-semibold ${decision === 'approve' ? 'text-green-800' : 'text-gray-700'}`}>Approve Copyedited Manuscript</p>
                <p className="text-xs text-gray-500 mt-1">Accept all copyediting changes</p>
              </button>
              <button
                onClick={() => setDecision('minor_corrections')}
                className={`p-4 rounded border-2 text-left transition-all ${decision === 'minor_corrections' ? 'border-amber-600 bg-amber-50' : 'border-gray-200 hover:border-amber-400 hover:bg-amber-50'}`}
              >
                <AlertTriangle className={`w-5 h-5 mb-2 ${decision === 'minor_corrections' ? 'text-amber-600' : 'text-gray-400'}`} />
                <p className={`text-sm font-semibold ${decision === 'minor_corrections' ? 'text-amber-800' : 'text-gray-700'}`}>Submit Minor Corrections</p>
                <p className="text-xs text-gray-500 mt-1">Request small targeted fixes</p>
              </button>
              <button
                onClick={() => setDecision('additional_revisions')}
                className={`p-4 rounded border-2 text-left transition-all ${decision === 'additional_revisions' ? 'border-red-600 bg-red-50' : 'border-gray-200 hover:border-red-400 hover:bg-red-50'}`}
              >
                <RotateCcw className={`w-5 h-5 mb-2 ${decision === 'additional_revisions' ? 'text-red-600' : 'text-gray-400'}`} />
                <p className={`text-sm font-semibold ${decision === 'additional_revisions' ? 'text-red-800' : 'text-gray-700'}`}>Request Additional Revisions</p>
                <p className="text-xs text-gray-500 mt-1">Return for substantive changes</p>
              </button>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            {decision === 'approve' ? (
              <div className="col-span-2">
                <label className="block text-sm font-semibold text-gray-700 mb-2">Approval Remarks *</label>
                <textarea
                  value={approvalRemarks}
                  onChange={e => setApprovalRemarks(e.target.value)}
                  rows={4}
                  className="w-full px-3 py-2 border-2 border-gray-300 rounded focus:border-[#1a1f2e] focus:outline-none text-sm"
                  placeholder="Provide your approval remarks and any final comments..."
                ></textarea>
              </div>
            ) : (
              <>
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">Copyediting Feedback Comments *</label>
                  <textarea
                    value={feedbackComments}
                    onChange={e => setFeedbackComments(e.target.value)}
                    rows={4}
                    className="w-full px-3 py-2 border-2 border-gray-300 rounded focus:border-[#1a1f2e] focus:outline-none text-sm"
                    placeholder="Describe your overall feedback on the copyediting..."
                  ></textarea>
                </div>
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">Formatting Concern Notes</label>
                  <textarea
                    value={formattingConcerns}
                    onChange={e => setFormattingConcerns(e.target.value)}
                    rows={4}
                    className="w-full px-3 py-2 border-2 border-gray-300 rounded focus:border-[#1a1f2e] focus:outline-none text-sm"
                    placeholder="Note any formatting concerns..."
                  ></textarea>
                </div>
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">Language Clarification Requests</label>
                  <textarea
                    value={languageClarifications}
                    onChange={e => setLanguageClarifications(e.target.value)}
                    rows={4}
                    className="w-full px-3 py-2 border-2 border-gray-300 rounded focus:border-[#1a1f2e] focus:outline-none text-sm"
                    placeholder="Request clarification on language changes..."
                  ></textarea>
                </div>
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">Citation Correction Concerns</label>
                  <textarea
                    value={citationConcerns}
                    onChange={e => setCitationConcerns(e.target.value)}
                    rows={4}
                    className="w-full px-3 py-2 border-2 border-gray-300 rounded focus:border-[#1a1f2e] focus:outline-none text-sm"
                    placeholder="Flag any citation or reference concerns..."
                  ></textarea>
                </div>
                <div className="col-span-2">
                  <label className="block text-sm font-semibold text-gray-700 mb-2">Additional Revision Requests</label>
                  <textarea
                    value={additionalRequests}
                    onChange={e => setAdditionalRequests(e.target.value)}
                    rows={3}
                    className="w-full px-3 py-2 border-2 border-gray-300 rounded focus:border-[#1a1f2e] focus:outline-none text-sm"
                    placeholder="List any additional revision requests..."
                  ></textarea>
                </div>
              </>
            )}
          </div>
        </div>

        {/* File Attachment Panel */}
        <div className="bg-white rounded-sm border-2 border-[#1a1f2e] shadow-md p-6 mb-6">
          <h2 className="text-lg font-bold font-serif text-[#0F2D5E] mb-4">File Attachment Panel</h2>
          <div className="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center hover:border-gray-400 transition-colors cursor-pointer mb-4">
            <Upload className="w-10 h-10 text-gray-400 mx-auto mb-3" />
            <p className="text-sm font-medium text-gray-700 mb-1">Upload supporting feedback files or annotated manuscript</p>
            <p className="text-xs text-gray-500">PDF, DOCX, or ZIP — Max 50MB</p>
          </div>
          {uploadedFiles.length > 0 ? (
            <div className="space-y-2">
              {uploadedFiles.map(file => (
                <div key={file.id} className="flex items-center justify-between p-3 bg-gray-50 rounded border border-gray-200">
                  <div className="flex items-center gap-3">
                    <FileText className="w-6 h-6 text-blue-600" />
                    <div>
                      <p className="text-sm font-medium text-gray-900">{file.name}</p>
                      <p className="text-xs text-gray-500">{file.size} • {file.uploadedAt.toLocaleDateString()}</p>
                    </div>
                  </div>
                  <span className="px-2 py-1 bg-green-100 text-green-800 text-xs font-medium rounded-full">Uploaded</span>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-sm text-gray-500 text-center py-2">No files attached. You may attach annotated manuscripts or supporting documents.</p>
          )}
        </div>

        {/* Three columns: Workflow, Timeline, History */}
        <div className="grid grid-cols-3 gap-6 mb-6">
          {/* Workflow Status */}
          <div className="bg-white rounded-sm border-2 border-[#1a1f2e] shadow-md p-6">
            <h2 className="text-lg font-bold font-serif text-[#0F2D5E] mb-4">Workflow Status</h2>
            <div className="space-y-3 mb-4">
              <div>
                <p className="text-xs text-gray-500">Current Stage</p>
                <p className="font-bold text-gray-900 mt-1">Author Copyediting Review</p>
              </div>
              <div>
                <p className="text-xs text-gray-500">Next Stage</p>
                <p className="font-semibold text-gray-900 mt-1">Final Production</p>
              </div>
              <div>
                <p className="text-xs text-gray-500">Feedback Deadline</p>
                <p className="font-semibold text-gray-900 mt-1">{deadline.toLocaleDateString()}</p>
              </div>
              <div>
                <p className="text-xs text-gray-500">Delay Risk</p>
                <span className="mt-1 inline-block px-3 py-1 bg-green-100 text-green-800 rounded-full text-xs font-medium">Low Risk</span>
              </div>
              <div>
                <p className="text-xs text-gray-500">Last Updated</p>
                <p className="text-xs text-gray-700 mt-1">{new Date().toLocaleString()}</p>
              </div>
            </div>
            <div className="pt-4 border-t border-gray-200">
              <p className="text-xs text-gray-500 mb-2">Workflow Progression</p>
              <div className="flex flex-wrap gap-1">
                {['Submit', 'Review', 'Revision', 'Editorial', 'TWG', 'Copyedit', 'TWG Review', 'Editor Review', 'Author Review', 'Production'].map((s, i) => (
                  <span key={i} className={`px-2 py-1 rounded text-xs font-medium ${i <= 8 ? 'bg-[#0F2D5E] text-white' : 'bg-gray-200 text-gray-600'}`}>{s}</span>
                ))}
              </div>
            </div>
          </div>

          {/* Timeline Recommendation */}
          <div className="bg-white rounded-sm border-2 border-[#1a1f2e] shadow-md p-6">
            <h2 className="text-lg font-bold font-serif text-[#0F2D5E] mb-4">Timeline Recommendation</h2>
            <div className="space-y-3">
              <div>
                <p className="text-xs text-gray-500">Recommended Duration</p>
                <p className="font-bold text-gray-900 mt-1">5 days</p>
              </div>
              <div>
                <p className="text-xs text-gray-500">Current Progress</p>
                <div className="flex items-center gap-2 mt-1">
                  <div className="flex-1 bg-gray-200 rounded-full h-2">
                    <div className="bg-green-600 h-2 rounded-full" style={{ width: '20%' }}></div>
                  </div>
                  <span className="text-sm font-bold text-gray-700">20%</span>
                </div>
              </div>
              <div>
                <p className="text-xs text-gray-500">Delay Risk</p>
                <span className="mt-1 inline-block px-3 py-1 bg-green-100 text-green-800 rounded-full text-xs font-medium">On Schedule</span>
              </div>
              <div>
                <p className="text-xs text-gray-500">Est. Next-Stage Transition</p>
                <p className="font-semibold text-gray-900 mt-1">{new Date(Date.now() + 5 * 24 * 60 * 60 * 1000).toLocaleDateString()}</p>
              </div>
              <div>
                <p className="text-xs text-gray-500">Confidence</p>
                <span className="mt-1 inline-block px-3 py-1 bg-blue-100 text-blue-800 rounded-full text-xs font-medium">High Confidence</span>
              </div>
            </div>
            <div className="mt-4 pt-4 border-t border-gray-200">
              <p className="text-xs text-gray-500">Remaining Duration</p>
              <p className="text-2xl font-bold text-[#0F2D5E]">{daysRemaining} days</p>
              <p className="text-xs text-gray-400 mt-1">Last reassessed: {new Date().toLocaleString()}</p>
            </div>
          </div>

          {/* Editorial & Copyediting History */}
          <div className="bg-white rounded-sm border-2 border-[#1a1f2e] shadow-md p-6">
            <h2 className="text-lg font-bold font-serif text-[#0F2D5E] mb-4">Editorial & Copyediting History</h2>
            <div className="space-y-3">
              {[
                { label: 'Editorial Recommendation', value: 'Accept with Revisions', sub: 'Dr. Sarah Johnson' },
                { label: 'Peer Review Outcome', value: 'Minor Revision', sub: '2 reviewers completed' },
                { label: 'TWG Copyediting', value: 'Completed', sub: 'Sarah Martinez — 2 days' },
                { label: 'TWG Coordinator', value: 'Validated & Approved', sub: 'Maria Rodriguez' },
                { label: 'Editor Review', value: 'Approved & Forwarded', sub: 'Dr. Sarah Johnson' },
              ].map((item, i) => (
                <div key={i} className="p-3 bg-gray-50 rounded border border-gray-200">
                  <p className="text-xs text-gray-500">{item.label}</p>
                  <p className="text-sm font-semibold text-gray-900 mt-0.5">{item.value}</p>
                  <p className="text-xs text-gray-500 mt-0.5">{item.sub}</p>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Alerts + Activity Log */}
        <div className="grid grid-cols-2 gap-6 mb-6">
          {/* Alerts & Notifications */}
          <div className="bg-white rounded-sm border-2 border-[#1a1f2e] shadow-md p-6">
            <h2 className="text-lg font-bold font-serif text-[#0F2D5E] mb-4">Alerts & Notifications</h2>
            <div className="space-y-3">
              <div className="flex items-start gap-3 p-3 bg-blue-50 border-2 border-blue-300 rounded">
                <Clock className="w-5 h-5 text-blue-600 flex-shrink-0 mt-0.5" />
                <div>
                  <p className="text-sm font-semibold text-blue-900">Feedback deadline in {daysRemaining} days</p>
                  <p className="text-xs text-blue-700 mt-1">Please review the copyedited manuscript and submit your response before {deadline.toLocaleDateString()}.</p>
                </div>
              </div>
              <div className="flex items-start gap-3 p-3 bg-amber-50 border-2 border-amber-300 rounded">
                <AlertTriangle className="w-5 h-5 text-amber-600 flex-shrink-0 mt-0.5" />
                <div>
                  <p className="text-sm font-semibold text-amber-900">1 item flagged for verification</p>
                  <p className="text-xs text-amber-700 mt-1">Figure and table formatting adjustment — please verify before approving.</p>
                </div>
              </div>
              <div className="flex items-start gap-3 p-3 bg-green-50 border-2 border-green-300 rounded">
                <CheckCircle className="w-5 h-5 text-green-600 flex-shrink-0 mt-0.5" />
                <div>
                  <p className="text-sm font-semibold text-green-900">Copyediting approved by editor</p>
                  <p className="text-xs text-green-700 mt-1">Dr. Sarah Johnson reviewed and validated all copyediting work.</p>
                </div>
              </div>
            </div>
          </div>

          {/* Activity Log */}
          <div className="bg-white rounded-sm border-2 border-[#1a1f2e] shadow-md p-6">
            <h2 className="text-lg font-bold font-serif text-[#0F2D5E] mb-4">Activity Log</h2>
            <div className="space-y-3 max-h-[260px] overflow-y-auto">
              {activityLog.map((entry) => (
                <div key={entry.id} className="flex gap-3">
                  <div className="flex flex-col items-center">
                    <div className="w-2 h-2 rounded-full bg-[#0F2D5E] flex-shrink-0 mt-1"></div>
                    <div className="w-0.5 flex-1 bg-gray-200 mt-1"></div>
                  </div>
                  <div className="pb-3 flex-1">
                    <p className="text-sm font-medium text-gray-900">{entry.action}</p>
                    <p className="text-xs text-gray-500 mt-0.5">{entry.user} · {entry.timestamp.toLocaleString()}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Bottom Action Bar */}
      <div className="fixed bottom-0 left-0 right-0 bg-white border-t-2 border-gray-300 px-8 py-4 shadow-lg z-40">
        <div className="max-w-[1400px] mx-auto flex items-center justify-between">
          <div>
            <p className="font-semibold text-gray-900 text-sm">{manuscript.title}</p>
            <p className="text-xs text-gray-500">Last saved: {new Date().toLocaleString()}</p>
          </div>
          <div className="flex items-center gap-3">
            <button className="px-4 py-2 text-gray-600 hover:text-gray-900 font-medium text-sm">
              Cancel
            </button>
            <button className="flex items-center gap-2 px-4 py-2 border-2 border-gray-300 rounded hover:bg-gray-50 transition-colors text-sm font-medium">
              <Save className="w-4 h-4" /> Save Draft Feedback
            </button>
            <button className="flex items-center gap-2 px-4 py-2 border-2 border-[#1a1f2e] rounded hover:bg-gray-50 transition-colors text-sm font-medium">
              <Eye className="w-4 h-4" /> Preview Manuscript
            </button>
            <button className="flex items-center gap-2 px-4 py-2 border-2 border-[#1a1f2e] rounded hover:bg-gray-50 transition-colors text-sm font-medium">
              <Upload className="w-4 h-4" /> Upload Feedback File
            </button>
            {decision !== 'approve' && (
              <button
                onClick={() => canSubmit && setShowConfirmModal(true)}
                disabled={!canSubmit}
                className={`flex items-center gap-2 px-5 py-2 rounded transition-colors text-sm font-medium ${canSubmit ? 'bg-[#0F2D5E] text-white hover:bg-gray-800' : 'bg-gray-300 text-gray-500 cursor-not-allowed'}`}
              >
                <Send className="w-4 h-4" /> Submit Feedback to Editor
              </button>
            )}
            {decision === 'approve' && (
              <button
                onClick={() => canSubmit && setShowConfirmModal(true)}
                disabled={!canSubmit}
                className={`flex items-center gap-2 px-5 py-2 rounded transition-colors text-sm font-medium ${canSubmit ? 'bg-green-700 text-white hover:bg-green-800' : 'bg-gray-300 text-gray-500 cursor-not-allowed'}`}
              >
                <ThumbsUp className="w-4 h-4" /> Approve Copyedited Manuscript
              </button>
            )}
          </div>
        </div>
      </div>

      {/* Confirm Modal */}
      {showConfirmModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg shadow-xl max-w-xl w-full">
            <div className="p-6 border-b border-gray-200">
              <h2 className="text-xl font-bold font-serif text-[#0F2D5E]">
                {decision === 'approve' ? 'Confirm Manuscript Approval' : 'Confirm Feedback Submission'}
              </h2>
            </div>
            <div className="p-6 space-y-4">
              <div className={`border-2 rounded p-4 ${decision === 'approve' ? 'bg-green-50 border-green-300' : decision === 'minor_corrections' ? 'bg-amber-50 border-amber-300' : 'bg-red-50 border-red-300'}`}>
                <p className="text-sm font-semibold mb-1">
                  {decision === 'approve' ? '✓ Approving copyedited manuscript' : decision === 'minor_corrections' ? '⚠ Submitting minor correction requests' : '↩ Requesting additional revisions'}
                </p>
                <p className="text-xs text-gray-700">
                  {decision === 'approve'
                    ? approvalRemarks
                    : feedbackComments}
                </p>
              </div>
              <div className="bg-amber-50 border border-amber-300 rounded p-3 flex items-start gap-2">
                <AlertCircle className="w-4 h-4 text-amber-600 flex-shrink-0 mt-0.5" />
                <p className="text-xs text-amber-800">
                  {decision === 'approve'
                    ? 'This will approve all copyediting changes and send the manuscript to final production. This cannot be undone.'
                    : 'This will send your feedback to the editor. The manuscript will be reviewed based on your comments.'}
                </p>
              </div>
            </div>
            <div className="p-6 border-t border-gray-200 flex items-center justify-end gap-3">
              <button onClick={() => setShowConfirmModal(false)} className="px-4 py-2 border-2 border-gray-300 rounded hover:bg-gray-50 text-sm font-medium">
                Cancel
              </button>
              <button
                onClick={handleSubmit}
                className={`flex items-center gap-2 px-6 py-2 rounded text-white text-sm font-medium ${decision === 'approve' ? 'bg-green-700 hover:bg-green-800' : 'bg-[#0F2D5E] hover:bg-gray-800'}`}
              >
                {decision === 'approve' ? <ThumbsUp className="w-4 h-4" /> : <Send className="w-4 h-4" />}
                Confirm & Submit
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
