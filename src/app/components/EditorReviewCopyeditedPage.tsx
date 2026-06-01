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
  X,
  Calendar,
  User,
  TrendingUp,
  AlertTriangle,
  Check,
  FileCheck,
  BookOpen,
  Edit3,
  MessageSquare,
  RotateCcw,
  Pause,
} from 'lucide-react';
import type { Manuscript } from '../types';

interface ValidationTask {
  id: string;
  label: string;
  status: 'completed' | 'warning' | 'unresolved';
}

interface UploadedFile {
  id: string;
  type: string;
  fileName: string;
  uploadDate: Date;
  fileSize: string;
  uploadedBy: string;
}

interface AssessmentMetric {
  id: string;
  label: string;
  status: 'excellent' | 'good' | 'needs_attention';
  progress: number;
}

interface ActivityRecord {
  id: string;
  timestamp: Date;
  action: string;
  user: string;
}

interface EditorReviewCopyeditedPageProps {
  manuscript: Manuscript;
  onBack: () => void;
}

export function EditorReviewCopyeditedPage({
  manuscript,
  onBack,
}: EditorReviewCopyeditedPageProps) {
  const [showConfirmModal, setShowConfirmModal] = useState(false);
  const [decision, setDecision] = useState<'send_to_author' | 'return_to_coordinator' | 'hold' | null>(null);
  const [editorialNotes, setEditorialNotes] = useState('');
  const [formattingConcerns, setFormattingConcerns] = useState('');
  const [validationRemarks, setValidationRemarks] = useState('');
  const [authorGuidance, setAuthorGuidance] = useState('');
  const [copyeditingFeedback, setCopyeditingFeedback] = useState('');

  // Copyediting validation tasks
  const validationTasks: ValidationTask[] = [
    { id: 'task-1', label: 'Grammar and spelling corrections verified', status: 'completed' },
    { id: 'task-2', label: 'Formatting consistency validated', status: 'completed' },
    { id: 'task-3', label: 'Citation and reference formatting verified', status: 'completed' },
    { id: 'task-4', label: 'Figure and table formatting checked', status: 'completed' },
    { id: 'task-5', label: 'Journal template compliance confirmed', status: 'completed' },
    { id: 'task-6', label: 'Language clarity improvements verified', status: 'completed' },
    { id: 'task-7', label: 'Metadata completeness validated', status: 'completed' },
  ];

  const completedTasks = validationTasks.filter(t => t.status === 'completed').length;
  const warningTasks = validationTasks.filter(t => t.status === 'warning').length;
  const unresolvedTasks = validationTasks.filter(t => t.status === 'unresolved').length;

  // Uploaded files
  const uploadedFiles: UploadedFile[] = [
    {
      id: 'file-1',
      type: 'Final Copyedited Manuscript',
      fileName: 'ms-006-copyedited-final.docx',
      uploadDate: new Date(Date.now() - 12 * 60 * 60 * 1000),
      fileSize: '2.8 MB',
      uploadedBy: 'Sarah Martinez (Copyeditor)',
    },
    {
      id: 'file-2',
      type: 'Marked Manuscript (Tracked Changes)',
      fileName: 'ms-006-marked-tracked-changes.docx',
      uploadDate: new Date(Date.now() - 12 * 60 * 60 * 1000),
      fileSize: '2.9 MB',
      uploadedBy: 'Sarah Martinez (Copyeditor)',
    },
    {
      id: 'file-3',
      type: 'Copyediting Summary Report',
      fileName: 'copyediting-summary-report.pdf',
      uploadDate: new Date(Date.now() - 12 * 60 * 60 * 1000),
      fileSize: '456 KB',
      uploadedBy: 'Sarah Martinez (Copyeditor)',
    },
    {
      id: 'file-4',
      type: 'TWG Coordinator Validation Notes',
      fileName: 'twg-coordinator-validation.pdf',
      uploadDate: new Date(Date.now() - 4 * 60 * 60 * 1000),
      fileSize: '234 KB',
      uploadedBy: 'Maria Rodriguez (TWG Coordinator)',
    },
  ];

  // Editorial assessment metrics
  const assessmentMetrics: AssessmentMetric[] = [
    { id: 'assess-1', label: 'Publication Readiness', status: 'excellent', progress: 98 },
    { id: 'assess-2', label: 'Formatting Quality', status: 'excellent', progress: 95 },
    { id: 'assess-3', label: 'Citation Consistency', status: 'excellent', progress: 100 },
    { id: 'assess-4', label: 'Readability Assessment', status: 'excellent', progress: 92 },
    { id: 'assess-5', label: 'Production Readiness', status: 'excellent', progress: 96 },
  ];

  // Activity log
  const activityLog: ActivityRecord[] = [
    {
      id: 'act-1',
      timestamp: new Date(Date.now() - 4 * 60 * 60 * 1000),
      action: 'Manuscript forwarded by TWG Coordinator for editor review',
      user: 'Maria Rodriguez',
    },
    {
      id: 'act-2',
      timestamp: new Date(Date.now() - 6 * 60 * 60 * 1000),
      action: 'TWG Coordinator validation completed',
      user: 'Maria Rodriguez',
    },
    {
      id: 'act-3',
      timestamp: new Date(Date.now() - 12 * 60 * 60 * 1000),
      action: 'Copyedited manuscript submitted',
      user: 'Sarah Martinez',
    },
    {
      id: 'act-4',
      timestamp: new Date(Date.now() - 14 * 60 * 60 * 1000),
      action: 'Plagiarism check completed (8% similarity)',
      user: 'Sarah Martinez',
    },
  ];

  const copyeditingCompletionDate = new Date(Date.now() - 12 * 60 * 60 * 1000);
  const deadline = new Date(Date.now() + 4 * 24 * 60 * 60 * 1000);
  const daysRemaining = Math.ceil((deadline.getTime() - Date.now()) / (1000 * 60 * 60 * 24));
  const workflowStatus = 'Under Editorial Copyediting Review';

  const canSendToAuthor = unresolvedTasks === 0 && editorialNotes.length > 0;

  const getTaskStatusIcon = (status: string) => {
    switch (status) {
      case 'completed':
        return <CheckCircle className="w-5 h-5 text-green-600" />;
      case 'warning':
        return <AlertTriangle className="w-5 h-5 text-amber-600" />;
      case 'unresolved':
        return <AlertCircle className="w-5 h-5 text-red-600" />;
      default:
        return <Clock className="w-5 h-5 text-gray-400" />;
    }
  };

  const getTaskStatusColor = (status: string) => {
    switch (status) {
      case 'completed':
        return 'bg-green-100 text-green-800';
      case 'warning':
        return 'bg-amber-100 text-amber-800';
      case 'unresolved':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const getAssessmentStatusColor = (status: string) => {
    switch (status) {
      case 'excellent':
        return 'bg-green-100 text-green-800';
      case 'good':
        return 'bg-blue-100 text-blue-800';
      case 'needs_attention':
        return 'bg-amber-100 text-amber-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const handleConfirmDecision = () => {
    setShowConfirmModal(false);
    if (decision === 'send_to_author') {
      alert('Copyedited manuscript sent to author for review and approval!');
    } else if (decision === 'return_to_coordinator') {
      alert('Manuscript returned to TWG Coordinator with feedback!');
    } else if (decision === 'hold') {
      alert('Manuscript validation on hold!');
    }
    onBack();
  };

  return (
    <div className="min-h-screen bg-[#F7F8FA] pb-32">
      {/* Header */}
      <div className="bg-[#0F2D5E] text-white py-6 px-8 shadow-lg sticky top-0 z-50">
        <div className="max-w-[1600px] mx-auto">
          <button
            onClick={onBack}
            className="flex items-center gap-2 text-gray-300 hover:text-white transition-colors mb-4"
          >
            <ArrowLeft className="w-5 h-5" />
            <span className="text-sm font-medium">Back to Dashboard</span>
          </button>
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-bold font-serif mb-2">Review Copyedited Manuscript</h1>
              <p className="text-sm text-gray-300">Validate copyediting quality and send to author</p>
            </div>
            <div className="text-right">
              <span className="px-4 py-2 bg-blue-600 text-white text-sm font-medium rounded-lg inline-block mb-2">
                {workflowStatus}
              </span>
              <div className="text-sm">
                <p className="text-gray-400">Review Deadline</p>
                <p className="text-lg font-bold">{deadline.toLocaleDateString()}</p>
                <p className="text-amber-400 font-medium">{daysRemaining} days remaining</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-[1600px] mx-auto px-8 py-8">
        {/* Manuscript Summary Card */}
        <div className="bg-white rounded-sm border-2 border-[#1a1f2e] shadow-md p-6 mb-6">
          <h2 className="text-lg font-bold font-serif text-[#0F2D5E] mb-4">Manuscript Summary</h2>
          <div className="grid grid-cols-2 gap-6">
            <div className="space-y-3">
              <div>
                <p className="text-sm text-gray-600">Title</p>
                <p className="font-bold text-gray-900">{manuscript.title}</p>
              </div>
              <div>
                <p className="text-sm text-gray-600">Authors and Affiliations</p>
                <p className="font-semibold text-gray-900">{manuscript.authorName}</p>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="text-sm text-gray-600">Manuscript ID</p>
                  <p className="font-semibold text-gray-900">{manuscript.id}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-600">Version</p>
                  <p className="font-semibold text-gray-900">{manuscript.files.length}</p>
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="text-sm text-gray-600">Category</p>
                  <p className="font-semibold text-gray-900">{manuscript.category}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-600">Submission Date</p>
                  <p className="font-semibold text-gray-900">{manuscript.submittedAt.toLocaleDateString()}</p>
                </div>
              </div>
              <div>
                <p className="text-sm text-gray-600">Copyediting Completion Date</p>
                <p className="font-semibold text-gray-900">{copyeditingCompletionDate.toLocaleDateString()}</p>
              </div>
              <div>
                <p className="text-sm text-gray-600">Current Workflow Stage</p>
                <p className="font-semibold text-gray-900">Editor Copyediting Review</p>
              </div>
            </div>
            <div>
              <p className="text-sm text-gray-600 mb-2">Abstract Preview</p>
              <div className="bg-[#F7F8FA] rounded border border-gray-300 p-4 max-h-[240px] overflow-y-auto">
                <p className="text-sm text-gray-700 leading-relaxed">{manuscript.abstract}</p>
              </div>
              <div className="flex gap-2 mt-4">
                <button className="flex items-center gap-2 px-4 py-2 bg-[#0F2D5E] text-white rounded hover:bg-gray-800 transition-colors text-sm font-medium">
                  <Eye className="w-4 h-4" />
                  View Manuscript
                </button>
                <button className="flex items-center gap-2 px-4 py-2 border-2 border-[#1a1f2e] rounded hover:bg-gray-50 transition-colors text-sm font-medium">
                  <Download className="w-4 h-4" />
                  Download Files
                </button>
                <button className="flex items-center gap-2 px-4 py-2 border-2 border-[#1a1f2e] rounded hover:bg-gray-50 transition-colors text-sm font-medium">
                  <MessageSquare className="w-4 h-4" />
                  Copyediting Notes
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Copyediting Validation Panel */}
        <div className="bg-white rounded-sm border-2 border-[#1a1f2e] shadow-md p-6 mb-6">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-bold font-serif text-[#0F2D5E]">Copyediting Validation</h2>
            <div className="flex items-center gap-4">
              <div className="text-center">
                <p className="text-sm text-gray-600">Validation</p>
                <p className="text-2xl font-bold text-green-600">{Math.round((completedTasks / validationTasks.length) * 100)}%</p>
              </div>
              <div className="text-center">
                <p className="text-sm text-gray-600">Warnings</p>
                <p className="text-2xl font-bold text-amber-600">{warningTasks}</p>
              </div>
              <div className="text-center">
                <p className="text-sm text-gray-600">Unresolved</p>
                <p className="text-2xl font-bold text-red-600">{unresolvedTasks}</p>
              </div>
            </div>
          </div>

          <div className="mb-4">
            <div className="w-full bg-gray-200 rounded-full h-3">
              <div
                className="bg-green-600 h-3 rounded-full transition-all"
                style={{ width: `${(completedTasks / validationTasks.length) * 100}%` }}
              ></div>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            {validationTasks.map((task) => (
              <div key={task.id} className="flex items-center gap-3 p-3 bg-gray-50 rounded border border-gray-200">
                {getTaskStatusIcon(task.status)}
                <div className="flex-1">
                  <p className="text-sm font-medium text-gray-900">{task.label}</p>
                </div>
                <span className={`px-3 py-1 rounded-full text-xs font-medium ${getTaskStatusColor(task.status)}`}>
                  {task.status === 'completed' ? 'Verified' : task.status === 'warning' ? 'Warning' : 'Unresolved'}
                </span>
              </div>
            ))}
          </div>

          <div className="mt-4 bg-green-50 border-2 border-green-300 rounded p-3">
            <p className="text-sm font-semibold text-green-800">
              <CheckCircle className="w-4 h-4 inline mr-1" />
              All copyediting validations completed successfully
            </p>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-6 mb-6">
          {/* Copyedited Manuscript Review Panel */}
          <div className="bg-white rounded-sm border-2 border-[#1a1f2e] shadow-md p-6">
            <h2 className="text-lg font-bold font-serif text-[#0F2D5E] mb-4">Copyedited Manuscript Review</h2>
            <div className="bg-[#F7F8FA] rounded border-2 border-gray-300 p-6 mb-4 min-h-[280px]">
              <div className="text-center">
                <FileText className="w-16 h-16 text-gray-400 mx-auto mb-3" />
                <p className="text-sm font-semibold text-gray-700 mb-2">Copyedited Document Preview</p>
                <p className="text-xs text-gray-600 mb-4">
                  Preview-only viewer for copyedited manuscript
                </p>
                <div className="space-y-2 text-left">
                  <div className="flex items-center justify-between p-2 bg-white rounded border border-gray-200">
                    <span className="text-xs text-gray-700">Finalized manuscript uploaded</span>
                    <FileCheck className="w-4 h-4 text-green-600" />
                  </div>
                  <div className="flex items-center justify-between p-2 bg-white rounded border border-gray-200">
                    <span className="text-xs text-gray-700">Tracked changes available</span>
                    <FileCheck className="w-4 h-4 text-green-600" />
                  </div>
                  <div className="flex items-center justify-between p-2 bg-white rounded border border-gray-200">
                    <span className="text-xs text-gray-700">Copyediting summary included</span>
                    <MessageSquare className="w-4 h-4 text-blue-600" />
                  </div>
                  <div className="flex items-center justify-between p-2 bg-white rounded border border-gray-200">
                    <span className="text-xs text-gray-700">TWG Coordinator approved</span>
                    <CheckCircle className="w-4 h-4 text-green-600" />
                  </div>
                </div>
              </div>
            </div>
            <div className="flex gap-2">
              <button className="flex-1 flex items-center justify-center gap-2 px-3 py-2 bg-[#0F2D5E] text-white rounded hover:bg-gray-800 transition-colors text-sm font-medium">
                <Eye className="w-4 h-4" />
                Open Preview
              </button>
              <button className="flex-1 flex items-center justify-center gap-2 px-3 py-2 border-2 border-[#1a1f2e] rounded hover:bg-gray-50 transition-colors text-sm font-medium">
                <Download className="w-4 h-4" />
                Download
              </button>
            </div>
          </div>

          {/* Editorial Review Assessment Panel */}
          <div className="bg-white rounded-sm border-2 border-[#1a1f2e] shadow-md p-6">
            <h2 className="text-lg font-bold font-serif text-[#0F2D5E] mb-4">Editorial Review Assessment</h2>
            <div className="space-y-3 mb-4">
              {assessmentMetrics.map((metric) => (
                <div key={metric.id} className="p-3 bg-gray-50 rounded border border-gray-200">
                  <div className="flex items-center justify-between mb-2">
                    <p className="text-sm font-semibold text-gray-900">{metric.label}</p>
                    <span className={`px-3 py-1 rounded-full text-xs font-medium ${getAssessmentStatusColor(metric.status)}`}>
                      {metric.status === 'excellent' ? 'Excellent' : metric.status === 'good' ? 'Good' : 'Needs Attention'}
                    </span>
                  </div>
                  <div className="flex items-center gap-3">
                    <div className="flex-1 bg-gray-200 rounded-full h-2">
                      <div
                        className={`h-2 rounded-full ${
                          metric.status === 'excellent' ? 'bg-green-600' :
                          metric.status === 'good' ? 'bg-blue-600' :
                          'bg-amber-600'
                        }`}
                        style={{ width: `${metric.progress}%` }}
                      ></div>
                    </div>
                    <span className="text-sm font-bold text-gray-700">{metric.progress}%</span>
                  </div>
                </div>
              ))}
            </div>
            <div className="bg-green-50 border-2 border-green-300 rounded p-4 text-center">
              <CheckCircle className="w-8 h-8 text-green-600 mx-auto mb-2" />
              <p className="text-sm font-semibold text-green-800">Overall Assessment: Excellent</p>
              <p className="text-xs text-green-700 mt-1">Ready to send to author for approval</p>
            </div>
          </div>
        </div>

        {/* Editorial Decision Panel */}
        <div className="bg-white rounded-sm border-2 border-[#1a1f2e] shadow-md p-6 mb-6">
          <h2 className="text-lg font-bold font-serif text-[#0F2D5E] mb-4">Editorial Decision</h2>
          <div className="grid grid-cols-2 gap-4 mb-4">
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Editorial Review Notes *
              </label>
              <textarea
                value={editorialNotes}
                onChange={(e) => setEditorialNotes(e.target.value)}
                className="w-full px-3 py-2 border-2 border-gray-300 rounded focus:border-[#1a1f2e] focus:outline-none text-sm"
                rows={4}
                placeholder="Provide editorial review notes and validation summary..."
              ></textarea>
            </div>
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Remaining Formatting Concerns
              </label>
              <textarea
                value={formattingConcerns}
                onChange={(e) => setFormattingConcerns(e.target.value)}
                className="w-full px-3 py-2 border-2 border-gray-300 rounded focus:border-[#1a1f2e] focus:outline-none text-sm"
                rows={4}
                placeholder="Note any remaining formatting concerns for the author..."
              ></textarea>
            </div>
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Final Validation Remarks
              </label>
              <textarea
                value={validationRemarks}
                onChange={(e) => setValidationRemarks(e.target.value)}
                className="w-full px-3 py-2 border-2 border-gray-300 rounded focus:border-[#1a1f2e] focus:outline-none text-sm"
                rows={4}
                placeholder="Document final validation results..."
              ></textarea>
            </div>
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Author Guidance Notes
              </label>
              <textarea
                value={authorGuidance}
                onChange={(e) => setAuthorGuidance(e.target.value)}
                className="w-full px-3 py-2 border-2 border-gray-300 rounded focus:border-[#1a1f2e] focus:outline-none text-sm"
                rows={4}
                placeholder="Provide guidance for the author's review..."
              ></textarea>
            </div>
          </div>
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">
              Copyediting Feedback Instructions
            </label>
            <textarea
              value={copyeditingFeedback}
              onChange={(e) => setCopyeditingFeedback(e.target.value)}
              className="w-full px-3 py-2 border-2 border-gray-300 rounded focus:border-[#1a1f2e] focus:outline-none text-sm"
              rows={3}
              placeholder="Provide instructions for how the author should review copyediting changes..."
            ></textarea>
          </div>
        </div>

        {/* File Management Panel */}
        <div className="bg-white rounded-sm border-2 border-[#1a1f2e] shadow-md p-6 mb-6">
          <h2 className="text-lg font-bold font-serif text-[#0F2D5E] mb-4">File Management</h2>
          <div className="space-y-3">
            {uploadedFiles.map((file) => (
              <div key={file.id} className="flex items-center justify-between p-4 bg-gray-50 rounded border-2 border-gray-200">
                <div className="flex items-center gap-3 flex-1">
                  <FileText className="w-8 h-8 text-blue-600" />
                  <div>
                    <p className="font-semibold text-sm text-gray-900">{file.type}</p>
                    <p className="text-xs text-gray-600">{file.fileName}</p>
                    <p className="text-xs text-gray-500 mt-1">
                      Uploaded by {file.uploadedBy} • {file.uploadDate.toLocaleString()} • {file.fileSize}
                    </p>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <span className="px-3 py-1 rounded-full text-xs font-medium bg-green-100 text-green-800">
                    Validated
                  </span>
                  <button className="flex items-center gap-1 px-3 py-1 border-2 border-[#1a1f2e] rounded hover:bg-gray-50 transition-colors text-xs font-medium">
                    <Download className="w-3 h-3" />
                    Download
                  </button>
                  <button className="flex items-center gap-1 px-3 py-1 border-2 border-[#1a1f2e] rounded hover:bg-gray-50 transition-colors text-xs font-medium">
                    <Eye className="w-3 h-3" />
                    Preview
                  </button>
                </div>
              </div>
            ))}
          </div>

          <div className="mt-4 flex items-center justify-between bg-blue-50 border-2 border-blue-300 rounded p-3">
            <p className="text-sm font-semibold text-blue-800">
              <CheckCircle className="w-4 h-4 inline mr-1" />
              All {uploadedFiles.length} files reviewed and validated
            </p>
            <span className="px-3 py-1 bg-blue-600 text-white rounded text-xs font-medium">Version {manuscript.files.length}</span>
          </div>
        </div>

        <div className="grid grid-cols-3 gap-6 mb-6">
          {/* Workflow Status Panel */}
          <div className="bg-white rounded-sm border-2 border-[#1a1f2e] shadow-md p-6">
            <h2 className="text-lg font-bold font-serif text-[#0F2D5E] mb-4">Workflow Status</h2>
            <div className="space-y-3">
              <div>
                <p className="text-sm text-gray-600">Current Stage</p>
                <p className="font-bold text-gray-900">Editor Copyediting Review</p>
              </div>
              <div>
                <p className="text-sm text-gray-600">Next Stage</p>
                <p className="font-semibold text-gray-900">Author Copyediting Review</p>
              </div>
              <div>
                <p className="text-sm text-gray-600">Review Deadline</p>
                <p className="font-semibold text-gray-900">{deadline.toLocaleDateString()}</p>
              </div>
              <div>
                <p className="text-sm text-gray-600">Delay Risk</p>
                <span className="px-3 py-1 bg-green-100 text-green-800 rounded-full text-xs font-medium">Low Risk</span>
              </div>
              <div>
                <p className="text-sm text-gray-600">Last Updated</p>
                <p className="text-xs text-gray-700">{new Date().toLocaleString()}</p>
              </div>
            </div>
            <div className="mt-4 pt-4 border-t border-gray-200">
              <p className="text-xs text-gray-600 mb-2">Workflow Progression</p>
              <div className="flex flex-wrap gap-1">
                {['Submit', 'Review', 'Revision', 'Editorial', 'TWG Endorse', 'Copyedit', 'TWG Review', 'Editor Review', 'Author Review'].map((stage, idx) => (
                  <span
                    key={idx}
                    className={`px-2 py-1 rounded text-xs ${
                      idx <= 7 ? 'bg-[#0F2D5E] text-white' : 'bg-gray-200 text-gray-600'
                    }`}
                  >
                    {stage}
                  </span>
                ))}
              </div>
            </div>
          </div>

          {/* Timeline Recommendation Panel */}
          <div className="bg-white rounded-sm border-2 border-[#1a1f2e] shadow-md p-6">
            <h2 className="text-lg font-bold font-serif text-[#0F2D5E] mb-4">Timeline Recommendation</h2>
            <div className="space-y-3">
              <div>
                <p className="text-sm text-gray-600">Recommended Duration</p>
                <p className="font-bold text-gray-900">1 day</p>
              </div>
              <div>
                <p className="text-sm text-gray-600">Current Progress</p>
                <div className="flex items-center gap-2 mt-1">
                  <div className="flex-1 bg-gray-200 rounded-full h-2">
                    <div className="bg-green-600 h-2 rounded-full" style={{ width: '75%' }}></div>
                  </div>
                  <span className="text-sm font-bold text-gray-700">75%</span>
                </div>
              </div>
              <div>
                <p className="text-sm text-gray-600">Delay Risk Assessment</p>
                <span className="px-3 py-1 bg-green-100 text-green-800 rounded-full text-xs font-medium">On Schedule</span>
              </div>
              <div>
                <p className="text-sm text-gray-600">Est. Next-Stage Transition</p>
                <p className="font-semibold text-gray-900">{new Date(Date.now() + 1 * 24 * 60 * 60 * 1000).toLocaleDateString()}</p>
              </div>
              <div>
                <p className="text-sm text-gray-600">Timeline Confidence</p>
                <span className="px-3 py-1 bg-blue-100 text-blue-800 rounded-full text-xs font-medium">High Confidence</span>
              </div>
            </div>
            <div className="mt-4 pt-4 border-t border-gray-200">
              <p className="text-xs text-gray-600">Remaining Duration</p>
              <p className="text-2xl font-bold text-[#0F2D5E]">{daysRemaining} days</p>
              <p className="text-xs text-gray-500 mt-1">Last reassessed: {new Date().toLocaleString()}</p>
            </div>
          </div>

          {/* Review & Editorial History Panel */}
          <div className="bg-white rounded-sm border-2 border-[#1a1f2e] shadow-md p-6">
            <h2 className="text-lg font-bold font-serif text-[#0F2D5E] mb-4">Review & Editorial History</h2>
            <div className="space-y-3">
              <div className="p-3 bg-gray-50 rounded border border-gray-200">
                <p className="text-xs text-gray-600">Reviewer Recommendation</p>
                <p className="text-sm font-semibold text-gray-900 mt-1">Minor Revision</p>
                <p className="text-xs text-gray-600 mt-1">2 reviewers completed</p>
              </div>
              <div className="p-3 bg-gray-50 rounded border border-gray-200">
                <p className="text-xs text-gray-600">Editorial Recommendation</p>
                <p className="text-sm font-semibold text-gray-900 mt-1">Accept with Revisions</p>
                <p className="text-xs text-gray-600 mt-1">Dr. Sarah Johnson</p>
              </div>
              <div className="p-3 bg-gray-50 rounded border border-gray-200">
                <p className="text-xs text-gray-600">TWG Copyediting</p>
                <p className="text-sm font-semibold text-gray-900 mt-1">Completed by Sarah Martinez</p>
                <p className="text-xs text-gray-600 mt-1">Duration: 2 days</p>
              </div>
              <div className="p-3 bg-gray-50 rounded border border-gray-200">
                <p className="text-xs text-gray-600">TWG Coordinator Validation</p>
                <p className="text-sm font-semibold text-gray-900 mt-1">Approved by Maria Rodriguez</p>
                <p className="text-xs text-gray-600 mt-1">All validations passed</p>
              </div>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-6 mb-6">
          {/* Alerts & Notifications Panel */}
          <div className="bg-white rounded-sm border-2 border-[#1a1f2e] shadow-md p-6">
            <h2 className="text-lg font-bold font-serif text-[#0F2D5E] mb-4">Alerts & Notifications</h2>
            <div className="space-y-3">
              <div className="flex items-start gap-3 p-3 bg-green-50 border-2 border-green-300 rounded">
                <CheckCircle className="w-5 h-5 text-green-600 flex-shrink-0 mt-0.5" />
                <div>
                  <p className="text-sm font-semibold text-green-900">All validations passed</p>
                  <p className="text-xs text-green-800 mt-1">Copyediting quality meets publication standards</p>
                </div>
              </div>
              <div className="flex items-start gap-3 p-3 bg-green-50 border-2 border-green-300 rounded">
                <CheckCircle className="w-5 h-5 text-green-600 flex-shrink-0 mt-0.5" />
                <div>
                  <p className="text-sm font-semibold text-green-900">TWG Coordinator approved</p>
                  <p className="text-xs text-green-800 mt-1">Maria Rodriguez completed validation successfully</p>
                </div>
              </div>
              <div className="flex items-start gap-3 p-3 bg-blue-50 border-2 border-blue-300 rounded">
                <Clock className="w-5 h-5 text-blue-600 flex-shrink-0 mt-0.5" />
                <div>
                  <p className="text-sm font-semibold text-blue-900">Review deadline reminder</p>
                  <p className="text-xs text-blue-800 mt-1">{daysRemaining} days remaining for editorial review</p>
                </div>
              </div>
            </div>
          </div>

          {/* Activity Log Panel */}
          <div className="bg-white rounded-sm border-2 border-[#1a1f2e] shadow-md p-6">
            <h2 className="text-lg font-bold font-serif text-[#0F2D5E] mb-4">Activity Log</h2>
            <div className="space-y-3 max-h-[240px] overflow-y-auto">
              {activityLog.map((activity) => (
                <div key={activity.id} className="flex gap-3">
                  <div className="flex flex-col items-center">
                    <div className="w-2 h-2 bg-[#0F2D5E] rounded-full"></div>
                    <div className="w-0.5 h-full bg-gray-200"></div>
                  </div>
                  <div className="flex-1 pb-3">
                    <p className="text-sm font-medium text-gray-900">{activity.action}</p>
                    <div className="flex items-center gap-2 mt-1">
                      <span className="text-xs text-gray-600">{activity.user}</span>
                      <span className="text-xs text-gray-400">•</span>
                      <span className="text-xs text-gray-500">{activity.timestamp.toLocaleString()}</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Bottom Sticky Action Bar */}
      <div className="fixed bottom-0 left-0 right-0 bg-white border-t-2 border-gray-300 px-8 py-4 shadow-lg z-40">
        <div className="max-w-[1600px] mx-auto flex items-center justify-between">
          <div>
            <p className="font-semibold text-gray-900">{manuscript.title}</p>
            <p className="text-sm text-gray-600">Last saved: {new Date().toLocaleString()}</p>
          </div>
          <div className="flex items-center gap-3">
            <button className="px-4 py-2 text-gray-600 hover:text-gray-900 font-medium text-sm">
              Cancel
            </button>
            <button className="flex items-center gap-2 px-4 py-2 border-2 border-gray-300 rounded hover:bg-gray-50 transition-colors text-sm font-medium">
              <Save className="w-4 h-4" />
              Save Draft
            </button>
            <button className="flex items-center gap-2 px-4 py-2 border-2 border-[#1a1f2e] rounded hover:bg-gray-50 transition-colors text-sm font-medium">
              <Eye className="w-4 h-4" />
              Preview Manuscript
            </button>
            <button
              onClick={() => {
                setDecision('return_to_coordinator');
                setShowConfirmModal(true);
              }}
              className="flex items-center gap-2 px-4 py-2 border-2 border-amber-600 text-amber-800 rounded hover:bg-amber-50 transition-colors text-sm font-medium"
            >
              <RotateCcw className="w-4 h-4" />
              Return to Coordinator
            </button>
            <button
              onClick={() => {
                if (canSendToAuthor) {
                  setDecision('send_to_author');
                  setShowConfirmModal(true);
                }
              }}
              disabled={!canSendToAuthor}
              className={`flex items-center gap-2 px-6 py-2 rounded transition-colors text-sm font-medium ${
                canSendToAuthor
                  ? 'bg-[#0F2D5E] text-white hover:bg-gray-800'
                  : 'bg-gray-300 text-gray-500 cursor-not-allowed'
              }`}
            >
              <Send className="w-4 h-4" />
              Send to Author
            </button>
          </div>
        </div>
      </div>

      {/* Confirmation Modal */}
      {showConfirmModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg shadow-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <div className="p-6 border-b border-gray-200">
              <h2 className="text-xl font-bold font-serif text-[#0F2D5E]">
                {decision === 'send_to_author' ? 'Confirm Send to Author' :
                 decision === 'return_to_coordinator' ? 'Confirm Return to TWG Coordinator' :
                 'Confirm Hold for Validation'}
              </h2>
            </div>
            <div className="p-6 space-y-4">
              {decision === 'send_to_author' && (
                <>
                  <div className="bg-blue-50 border-2 border-blue-300 rounded p-4">
                    <h3 className="font-semibold text-blue-900 mb-2">Editorial Review Summary</h3>
                    <div className="space-y-2 text-sm text-blue-800">
                      <p>✓ All {validationTasks.length} copyediting validations verified</p>
                      <p>✓ {uploadedFiles.length} files reviewed and approved</p>
                      <p>✓ Overall assessment: Excellent quality</p>
                      <p>✓ Ready for author copyediting review</p>
                    </div>
                  </div>

                  <div>
                    <h3 className="font-semibold text-gray-900 mb-2">Editorial Notes</h3>
                    <div className="bg-gray-50 p-3 rounded border border-gray-200 text-sm text-gray-700">
                      {editorialNotes || '(No notes provided)'}
                    </div>
                  </div>

                  <div>
                    <h3 className="font-semibold text-gray-900 mb-2">Author Guidance</h3>
                    <div className="bg-gray-50 p-3 rounded border border-gray-200 text-sm text-gray-700">
                      {authorGuidance || '(No guidance provided)'}
                    </div>
                  </div>
                </>
              )}

              {decision === 'return_to_coordinator' && (
                <>
                  <div className="bg-amber-50 border-2 border-amber-300 rounded p-4">
                    <h3 className="font-semibold text-amber-900 mb-2">Return Reason</h3>
                    <p className="text-sm text-amber-800">
                      The manuscript will be returned to the TWG Coordinator for additional validation based on your feedback.
                    </p>
                  </div>

                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                      Feedback for TWG Coordinator *
                    </label>
                    <textarea
                      className="w-full px-3 py-2 border-2 border-gray-300 rounded focus:border-[#1a1f2e] focus:outline-none text-sm"
                      rows={4}
                      placeholder="Provide specific feedback on what needs additional validation..."
                    ></textarea>
                  </div>
                </>
              )}

              <div className="bg-green-50 border-2 border-green-300 rounded p-4 flex items-start gap-3">
                <CheckCircle className="w-5 h-5 text-green-600 flex-shrink-0 mt-0.5" />
                <div>
                  <p className="text-sm font-semibold text-green-900">Confirmation</p>
                  <p className="text-sm text-green-800 mt-1">
                    {decision === 'send_to_author'
                      ? 'This action will send the copyedited manuscript to the author for review and approval. The author will be able to review all copyediting changes.'
                      : 'This action will return the manuscript to the TWG Coordinator with your feedback for additional validation.'}
                  </p>
                </div>
              </div>
            </div>
            <div className="p-6 border-t border-gray-200 flex items-center justify-end gap-3">
              <button
                onClick={() => setShowConfirmModal(false)}
                className="px-4 py-2 border-2 border-gray-300 rounded hover:bg-gray-50 transition-colors text-sm font-medium"
              >
                Cancel
              </button>
              <button
                onClick={handleConfirmDecision}
                className="flex items-center gap-2 px-6 py-2 bg-[#0F2D5E] text-white rounded hover:bg-gray-800 transition-colors text-sm font-medium"
              >
                {decision === 'send_to_author' ? <Send className="w-4 h-4" /> : <RotateCcw className="w-4 h-4" />}
                Confirm
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
