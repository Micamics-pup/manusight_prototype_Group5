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
} from 'lucide-react';
import type { Manuscript } from '../types';

interface CopyeditingTask {
  id: string;
  label: string;
  status: 'completed' | 'warning' | 'unresolved';
}

interface UploadedFile {
  id: string;
  type: 'copyedited' | 'marked' | 'supporting';
  fileName: string;
  uploadDate: Date;
  fileSize: string;
  status: 'uploaded' | 'pending';
}

interface EvaluationMetric {
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

interface TWGCopyeditorCopyeditingStagePageProps {
  manuscript: Manuscript;
  onBack: () => void;
}

export function TWGCopyeditorCopyeditingStagePage({
  manuscript,
  onBack,
}: TWGCopyeditorCopyeditingStagePageProps) {
  const [showConfirmModal, setShowConfirmModal] = useState(false);
  const [copyeditingNotes, setCopyeditingNotes] = useState('');
  const [formattingNotes, setFormattingNotes] = useState('');
  const [languageRecommendations, setLanguageRecommendations] = useState('');
  const [editorialConcerns, setEditorialConcerns] = useState('');
  const [productionNotes, setProductionNotes] = useState('');

  // Copyediting tasks
  const [tasks, setTasks] = useState<CopyeditingTask[]>([
    { id: 'task-1', label: 'Grammar and spelling review completed', status: 'completed' },
    { id: 'task-2', label: 'Formatting validation completed', status: 'completed' },
    { id: 'task-3', label: 'Citation and reference formatting checked', status: 'completed' },
    { id: 'task-4', label: 'Figure and table formatting checked', status: 'warning' },
    { id: 'task-5', label: 'Journal template compliance verified', status: 'completed' },
    { id: 'task-6', label: 'Language clarity reviewed', status: 'completed' },
    { id: 'task-7', label: 'Metadata completeness validated', status: 'completed' },
  ]);

  const completedTasks = tasks.filter(t => t.status === 'completed').length;
  const warningTasks = tasks.filter(t => t.status === 'warning').length;
  const unresolvedTasks = tasks.filter(t => t.status === 'unresolved').length;

  // Uploaded files
  const [uploadedFiles, setUploadedFiles] = useState<UploadedFile[]>([
    {
      id: 'file-1',
      type: 'copyedited',
      fileName: 'ms-006-copyedited-final.docx',
      uploadDate: new Date(Date.now() - 1 * 60 * 60 * 1000),
      fileSize: '2.8 MB',
      status: 'uploaded',
    },
    {
      id: 'file-2',
      type: 'marked',
      fileName: 'ms-006-marked-tracked-changes.docx',
      uploadDate: new Date(Date.now() - 1 * 60 * 60 * 1000),
      fileSize: '2.9 MB',
      status: 'uploaded',
    },
    {
      id: 'file-3',
      type: 'supporting',
      fileName: 'copyediting-summary-report.pdf',
      uploadDate: new Date(Date.now() - 30 * 60 * 1000),
      fileSize: '456 KB',
      status: 'uploaded',
    },
  ]);

  // Evaluation metrics
  const evaluationMetrics: EvaluationMetric[] = [
    { id: 'eval-1', label: 'Language Quality', status: 'excellent', progress: 95 },
    { id: 'eval-2', label: 'Formatting Compliance', status: 'good', progress: 88 },
    { id: 'eval-3', label: 'Citation Consistency', status: 'excellent', progress: 98 },
    { id: 'eval-4', label: 'Readability Assessment', status: 'good', progress: 90 },
    { id: 'eval-5', label: 'Publication Readiness', status: 'good', progress: 92 },
  ];

  // Activity log
  const activityLog: ActivityRecord[] = [
    {
      id: 'act-1',
      timestamp: new Date(Date.now() - 1 * 60 * 60 * 1000),
      action: 'Uploaded finalized copyedited manuscript',
      user: 'Sarah Martinez',
    },
    {
      id: 'act-2',
      timestamp: new Date(Date.now() - 2 * 60 * 60 * 1000),
      action: 'Completed citation formatting validation',
      user: 'Sarah Martinez',
    },
    {
      id: 'act-3',
      timestamp: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000),
      action: 'Started copyediting task',
      user: 'Sarah Martinez',
    },
    {
      id: 'act-4',
      timestamp: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000),
      action: 'Manuscript assigned for copyediting',
      user: 'Maria Rodriguez',
    },
  ];

  const deadline = new Date(Date.now() + 5 * 24 * 60 * 60 * 1000);
  const daysRemaining = Math.ceil((deadline.getTime() - Date.now()) / (1000 * 60 * 60 * 24));
  const workflowStatus = 'Under Copyediting';

  const allFilesUploaded = uploadedFiles.filter(f => f.type === 'copyedited' || f.type === 'marked').every(f => f.status === 'uploaded');
  const canSubmit = completedTasks >= tasks.length - 1 && allFilesUploaded && unresolvedTasks === 0;

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

  const getEvaluationStatusColor = (status: string) => {
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

  const getFileTypeLabel = (type: string) => {
    switch (type) {
      case 'copyedited':
        return 'Finalized Copyedited Manuscript';
      case 'marked':
        return 'Marked Manuscript (Tracked Changes)';
      case 'supporting':
        return 'Supporting Editorial Files';
      default:
        return 'Unknown File Type';
    }
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
              <h1 className="text-2xl font-bold font-serif mb-2">Copyediting Stage</h1>
              <p className="text-sm text-gray-300">Review, validate, and submit copyedited manuscript</p>
            </div>
            <div className="text-right">
              <span className="px-4 py-2 bg-blue-600 text-white text-sm font-medium rounded-lg inline-block mb-2">
                {workflowStatus}
              </span>
              <div className="text-sm">
                <p className="text-gray-400">Deadline</p>
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
                <p className="text-sm text-gray-600">Authors</p>
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
                <p className="text-sm text-gray-600">Assigned Copyediting Date</p>
                <p className="font-semibold text-gray-900">{new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toLocaleDateString()}</p>
              </div>
              <div>
                <p className="text-sm text-gray-600">Current Workflow Stage</p>
                <p className="font-semibold text-gray-900">Copyediting & Quality Validation</p>
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
                  View Editorial Notes
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Copyediting Progress Panel */}
        <div className="bg-white rounded-sm border-2 border-[#1a1f2e] shadow-md p-6 mb-6">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-bold font-serif text-[#0F2D5E]">Copyediting Progress</h2>
            <div className="flex items-center gap-4">
              <div className="text-center">
                <p className="text-sm text-gray-600">Completion</p>
                <p className="text-2xl font-bold text-green-600">{Math.round((completedTasks / tasks.length) * 100)}%</p>
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
                style={{ width: `${(completedTasks / tasks.length) * 100}%` }}
              ></div>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            {tasks.map((task) => (
              <div key={task.id} className="flex items-center gap-3 p-3 bg-gray-50 rounded border border-gray-200">
                {getTaskStatusIcon(task.status)}
                <div className="flex-1">
                  <p className="text-sm font-medium text-gray-900">{task.label}</p>
                </div>
                <span className={`px-3 py-1 rounded-full text-xs font-medium ${getTaskStatusColor(task.status)}`}>
                  {task.status === 'completed' ? 'Complete' : task.status === 'warning' ? 'Warning' : 'Unresolved'}
                </span>
              </div>
            ))}
          </div>

          <div className="mt-4 flex gap-3">
            <div className="flex-1 bg-green-50 border-2 border-green-300 rounded p-3">
              <p className="text-sm font-semibold text-green-800">✓ {completedTasks} tasks completed</p>
            </div>
            {warningTasks > 0 && (
              <div className="flex-1 bg-amber-50 border-2 border-amber-300 rounded p-3">
                <p className="text-sm font-semibold text-amber-800">⚠ {warningTasks} warnings require attention</p>
              </div>
            )}
            {unresolvedTasks > 0 && (
              <div className="flex-1 bg-red-50 border-2 border-red-300 rounded p-3">
                <p className="text-sm font-semibold text-red-800">✗ {unresolvedTasks} unresolved issues</p>
              </div>
            )}
          </div>
        </div>

        <div className="grid grid-cols-2 gap-6 mb-6">
          {/* Manuscript File Review Panel */}
          <div className="bg-white rounded-sm border-2 border-[#1a1f2e] shadow-md p-6">
            <h2 className="text-lg font-bold font-serif text-[#0F2D5E] mb-4">Manuscript File Review</h2>
            <div className="bg-[#F7F8FA] rounded border-2 border-gray-300 p-6 mb-4 min-h-[280px]">
              <div className="text-center">
                <FileText className="w-16 h-16 text-gray-400 mx-auto mb-3" />
                <p className="text-sm font-semibold text-gray-700 mb-2">Document Preview</p>
                <p className="text-xs text-gray-600 mb-4">
                  Preview-only viewer for manuscript review
                </p>
                <div className="space-y-2 text-left">
                  <div className="flex items-center justify-between p-2 bg-white rounded border border-gray-200">
                    <span className="text-xs text-gray-700">Uploaded versions: {manuscript.files.length}</span>
                    <Eye className="w-4 h-4 text-gray-500" />
                  </div>
                  <div className="flex items-center justify-between p-2 bg-white rounded border border-gray-200">
                    <span className="text-xs text-gray-700">Marked manuscript available</span>
                    <FileCheck className="w-4 h-4 text-green-600" />
                  </div>
                  <div className="flex items-center justify-between p-2 bg-white rounded border border-gray-200">
                    <span className="text-xs text-gray-700">Annotations: 12 comments</span>
                    <MessageSquare className="w-4 h-4 text-blue-600" />
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

          {/* Copyediting Evaluation Panel */}
          <div className="bg-white rounded-sm border-2 border-[#1a1f2e] shadow-md p-6">
            <h2 className="text-lg font-bold font-serif text-[#0F2D5E] mb-4">Copyediting Evaluation</h2>
            <div className="space-y-3">
              {evaluationMetrics.map((metric) => (
                <div key={metric.id} className="p-3 bg-gray-50 rounded border border-gray-200">
                  <div className="flex items-center justify-between mb-2">
                    <p className="text-sm font-semibold text-gray-900">{metric.label}</p>
                    <span className={`px-3 py-1 rounded-full text-xs font-medium ${getEvaluationStatusColor(metric.status)}`}>
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
            <div className="mt-4 bg-green-50 border-2 border-green-300 rounded p-3 text-center">
              <p className="text-sm font-semibold text-green-800">
                <CheckCircle className="w-4 h-4 inline mr-1" />
                Publication Readiness: High
              </p>
            </div>
          </div>
        </div>

        {/* Copyediting Notes & Recommendations Panel */}
        <div className="bg-white rounded-sm border-2 border-[#1a1f2e] shadow-md p-6 mb-6">
          <h2 className="text-lg font-bold font-serif text-[#0F2D5E] mb-4">Copyediting Notes & Recommendations</h2>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Copyediting Summary Notes
              </label>
              <textarea
                value={copyeditingNotes}
                onChange={(e) => setCopyeditingNotes(e.target.value)}
                className="w-full px-3 py-2 border-2 border-gray-300 rounded focus:border-[#1a1f2e] focus:outline-none text-sm"
                rows={4}
                placeholder="Provide a summary of copyediting work completed..."
              ></textarea>
            </div>
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Formatting Correction Notes
              </label>
              <textarea
                value={formattingNotes}
                onChange={(e) => setFormattingNotes(e.target.value)}
                className="w-full px-3 py-2 border-2 border-gray-300 rounded focus:border-[#1a1f2e] focus:outline-none text-sm"
                rows={4}
                placeholder="Detail formatting corrections applied..."
              ></textarea>
            </div>
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Language Improvement Recommendations
              </label>
              <textarea
                value={languageRecommendations}
                onChange={(e) => setLanguageRecommendations(e.target.value)}
                className="w-full px-3 py-2 border-2 border-gray-300 rounded focus:border-[#1a1f2e] focus:outline-none text-sm"
                rows={4}
                placeholder="List language improvements made..."
              ></textarea>
            </div>
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Remaining Editorial Concerns
              </label>
              <textarea
                value={editorialConcerns}
                onChange={(e) => setEditorialConcerns(e.target.value)}
                className="w-full px-3 py-2 border-2 border-gray-300 rounded focus:border-[#1a1f2e] focus:outline-none text-sm"
                rows={4}
                placeholder="Note any remaining concerns for TWG Coordinator..."
              ></textarea>
            </div>
          </div>
          <div className="mt-4">
            <label className="block text-sm font-semibold text-gray-700 mb-2">
              Production Preparation Notes
            </label>
            <textarea
              value={productionNotes}
              onChange={(e) => setProductionNotes(e.target.value)}
              className="w-full px-3 py-2 border-2 border-gray-300 rounded focus:border-[#1a1f2e] focus:outline-none text-sm"
              rows={3}
              placeholder="Add notes for production team preparation..."
            ></textarea>
          </div>
        </div>

        {/* File Management Panel */}
        <div className="bg-white rounded-sm border-2 border-[#1a1f2e] shadow-md p-6 mb-6">
          <h2 className="text-lg font-bold font-serif text-[#0F2D5E] mb-4">File Management</h2>
          <div className="border-2 border-dashed border-gray-300 rounded-lg p-8 mb-4 text-center hover:border-gray-400 transition-colors cursor-pointer">
            <Upload className="w-12 h-12 text-gray-400 mx-auto mb-3" />
            <p className="text-sm font-medium text-gray-700 mb-1">Upload copyedited files</p>
            <p className="text-xs text-gray-500">Drag and drop or click to browse (PDF, DOCX, ZIP)</p>
          </div>

          <div className="space-y-3">
            {uploadedFiles.map((file) => (
              <div key={file.id} className="flex items-center justify-between p-4 bg-gray-50 rounded border-2 border-gray-200">
                <div className="flex items-center gap-3 flex-1">
                  <FileText className="w-8 h-8 text-blue-600" />
                  <div>
                    <p className="font-semibold text-sm text-gray-900">{getFileTypeLabel(file.type)}</p>
                    <p className="text-xs text-gray-600">{file.fileName}</p>
                    <p className="text-xs text-gray-500 mt-1">
                      {file.uploadDate.toLocaleString()} • {file.fileSize}
                    </p>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <span className={`px-3 py-1 rounded-full text-xs font-medium ${
                    file.status === 'uploaded' ? 'bg-green-100 text-green-800' : 'bg-amber-100 text-amber-800'
                  }`}>
                    {file.status === 'uploaded' ? 'Uploaded' : 'Pending'}
                  </span>
                  <button className="flex items-center gap-1 px-3 py-1 border-2 border-[#1a1f2e] rounded hover:bg-gray-50 transition-colors text-xs font-medium">
                    <Download className="w-3 h-3" />
                    Download
                  </button>
                </div>
              </div>
            ))}
          </div>

          <div className="mt-4 flex items-center justify-between bg-blue-50 border-2 border-blue-300 rounded p-3">
            <p className="text-sm font-semibold text-blue-800">
              <CheckCircle className="w-4 h-4 inline mr-1" />
              All required files uploaded and validated
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
                <p className="font-bold text-gray-900">Copyediting</p>
              </div>
              <div>
                <p className="text-sm text-gray-600">Next Stage</p>
                <p className="font-semibold text-gray-900">TWG Coordinator Review</p>
              </div>
              <div>
                <p className="text-sm text-gray-600">Deadline</p>
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
                {['Submission', 'Review', 'Revision', 'Editorial', 'TWG Endorsement', 'Copyediting', 'TWG Review', 'Production'].map((stage, idx) => (
                  <span
                    key={idx}
                    className={`px-2 py-1 rounded text-xs ${
                      idx <= 5 ? 'bg-[#0F2D5E] text-white' : 'bg-gray-200 text-gray-600'
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
                <p className="font-bold text-gray-900">3 days</p>
              </div>
              <div>
                <p className="text-sm text-gray-600">Current Progress</p>
                <div className="flex items-center gap-2 mt-1">
                  <div className="flex-1 bg-gray-200 rounded-full h-2">
                    <div className="bg-green-600 h-2 rounded-full" style={{ width: '85%' }}></div>
                  </div>
                  <span className="text-sm font-bold text-gray-700">85%</span>
                </div>
              </div>
              <div>
                <p className="text-sm text-gray-600">Delay Risk Assessment</p>
                <span className="px-3 py-1 bg-green-100 text-green-800 rounded-full text-xs font-medium">On Schedule</span>
              </div>
              <div>
                <p className="text-sm text-gray-600">Est. Next-Stage Transition</p>
                <p className="font-semibold text-gray-900">{new Date(Date.now() + 2 * 24 * 60 * 60 * 1000).toLocaleDateString()}</p>
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
                <p className="text-xs text-gray-600">Revision Timeline</p>
                <p className="text-sm font-semibold text-gray-900 mt-1">1 revision round</p>
                <p className="text-xs text-gray-600 mt-1">Completed in 14 days</p>
              </div>
              <div className="p-3 bg-gray-50 rounded border border-gray-200">
                <p className="text-xs text-gray-600">TWG Evaluation</p>
                <p className="text-sm font-semibold text-gray-900 mt-1">Endorsed to TWG</p>
                <p className="text-xs text-gray-600 mt-1">All criteria met</p>
              </div>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-6 mb-6">
          {/* Alerts & Notifications Panel */}
          <div className="bg-white rounded-sm border-2 border-[#1a1f2e] shadow-md p-6">
            <h2 className="text-lg font-bold font-serif text-[#0F2D5E] mb-4">Alerts & Notifications</h2>
            <div className="space-y-3">
              <div className="flex items-start gap-3 p-3 bg-amber-50 border-2 border-amber-300 rounded">
                <AlertTriangle className="w-5 h-5 text-amber-600 flex-shrink-0 mt-0.5" />
                <div>
                  <p className="text-sm font-semibold text-amber-900">Minor formatting issue</p>
                  <p className="text-xs text-amber-800 mt-1">Figure 3 caption formatting needs adjustment</p>
                </div>
              </div>
              <div className="flex items-start gap-3 p-3 bg-green-50 border-2 border-green-300 rounded">
                <CheckCircle className="w-5 h-5 text-green-600 flex-shrink-0 mt-0.5" />
                <div>
                  <p className="text-sm font-semibold text-green-900">Upload confirmed</p>
                  <p className="text-xs text-green-800 mt-1">All files successfully validated and ready for submission</p>
                </div>
              </div>
              <div className="flex items-start gap-3 p-3 bg-blue-50 border-2 border-blue-300 rounded">
                <Clock className="w-5 h-5 text-blue-600 flex-shrink-0 mt-0.5" />
                <div>
                  <p className="text-sm font-semibold text-blue-900">Deadline reminder</p>
                  <p className="text-xs text-blue-800 mt-1">{daysRemaining} days remaining until copyediting deadline</p>
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
              Preview Files
            </button>
            <button className="flex items-center gap-2 px-4 py-2 border-2 border-[#1a1f2e] rounded hover:bg-gray-50 transition-colors text-sm font-medium">
              <Upload className="w-4 h-4" />
              Upload Final Manuscript
            </button>
            <button
              onClick={() => canSubmit && setShowConfirmModal(true)}
              disabled={!canSubmit}
              className={`flex items-center gap-2 px-6 py-2 rounded transition-colors text-sm font-medium ${
                canSubmit
                  ? 'bg-[#0F2D5E] text-white hover:bg-gray-800'
                  : 'bg-gray-300 text-gray-500 cursor-not-allowed'
              }`}
            >
              <Send className="w-4 h-4" />
              Send to TWG Coordinator
            </button>
          </div>
        </div>
      </div>

      {/* Confirmation Modal */}
      {showConfirmModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg shadow-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <div className="p-6 border-b border-gray-200">
              <h2 className="text-xl font-bold font-serif text-[#0F2D5E]">Confirm Copyediting Completion</h2>
            </div>
            <div className="p-6 space-y-4">
              <div className="bg-blue-50 border-2 border-blue-300 rounded p-4">
                <h3 className="font-semibold text-blue-900 mb-2">Copyediting Summary</h3>
                <div className="space-y-2 text-sm text-blue-800">
                  <p>✓ {completedTasks} of {tasks.length} tasks completed</p>
                  <p>✓ {uploadedFiles.length} files uploaded and validated</p>
                  <p>✓ All quality metrics meet publication standards</p>
                  <p>✓ Manuscript ready for TWG Coordinator review</p>
                </div>
              </div>

              <div>
                <h3 className="font-semibold text-gray-900 mb-2">Uploaded Files</h3>
                <ul className="space-y-1 text-sm text-gray-700">
                  {uploadedFiles.map((file) => (
                    <li key={file.id}>
                      <CheckCircle className="w-4 h-4 inline text-green-600 mr-1" />
                      {getFileTypeLabel(file.type)}: {file.fileName}
                    </li>
                  ))}
                </ul>
              </div>

              <div className="bg-amber-50 border-2 border-amber-300 rounded p-4 flex items-start gap-3">
                <AlertCircle className="w-5 h-5 text-amber-600 flex-shrink-0 mt-0.5" />
                <div>
                  <p className="text-sm font-semibold text-amber-900">Important Notice</p>
                  <p className="text-sm text-amber-800 mt-1">
                    This will send the copyedited manuscript to the TWG Coordinator for production review. The manuscript will proceed to the next workflow stage and cannot be recalled. Please ensure all copyediting work is finalized.
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
                onClick={() => {
                  setShowConfirmModal(false);
                  alert('Copyedited manuscript sent to TWG Coordinator successfully!');
                  onBack();
                }}
                className="flex items-center gap-2 px-6 py-2 bg-[#0F2D5E] text-white rounded hover:bg-gray-800 transition-colors text-sm font-medium"
              >
                <Send className="w-4 h-4" />
                Confirm and Submit
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
