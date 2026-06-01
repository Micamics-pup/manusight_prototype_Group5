import React, { useState } from 'react';
import {
  ArrowLeft,
  Home,
  FileText,
  CheckCircle,
  Clock,
  X,
  ChevronRight,
  Bell,
  HelpCircle,
  LayoutDashboard,
  FolderOpen,
  Edit3,
  Mail,
  Settings,
  Download,
  Upload,
  Eye,
  AlertCircle,
  TrendingUp,
  Calendar,
  User,
  ArrowRight,
  Save,
  Send,
  Check,
  XCircle,
} from 'lucide-react';
import type { Manuscript } from '../types';

interface RevisionRound {
  roundNumber: number;
  submittedDate?: Date;
  status: 'in_progress' | 'submitted' | 'approved' | 'needs_revision';
  twgCoordinatorReview?: ReviewResponse;
  editorReview?: ReviewResponse;
  authorReview?: ReviewResponse;
}

interface ReviewResponse {
  reviewerName: string;
  reviewerRole: string;
  status: 'approved' | 'needs_revision' | 'awaiting' | 'not_forwarded';
  responseDate?: Date;
  comments?: string;
  concerns?: string[];
}

interface FileUpload {
  type: 'manuscript' | 'plagiarism_report' | 'tracked_changes' | 'supplementary';
  fileName?: string;
  uploadDate?: Date;
  fileSize?: string;
  status: 'uploaded' | 'pending' | 'missing';
}

interface ChecklistTask {
  id: string;
  label: string;
  status: 'completed' | 'in_progress' | 'pending' | 'needs_attention';
  lastUpdated?: Date;
}

interface Comment {
  id: string;
  reviewerName: string;
  reviewerRole: string;
  section: string;
  pageRef: string;
  text: string;
  addressed: boolean;
}

interface TWGCopyeditorCopyeditingPageProps {
  manuscript: Manuscript;
  onBack: () => void;
}

export function TWGCopyeditorCopyeditingPage({
  manuscript,
  onBack,
}: TWGCopyeditorCopyeditingPageProps) {
  const [currentRound, setCurrentRound] = useState(2);
  const [showSubmitModal, setShowSubmitModal] = useState(false);
  const [selectedSection, setSelectedSection] = useState('Abstract');
  const [notesToCoordinator, setNotesToCoordinator] = useState('');
  const [expandedRounds, setExpandedRounds] = useState<number[]>([]);

  // Mock revision rounds data
  const revisionRounds: RevisionRound[] = [
    {
      roundNumber: 1,
      submittedDate: new Date(Date.now() - 10 * 24 * 60 * 60 * 1000),
      status: 'needs_revision',
      twgCoordinatorReview: {
        reviewerName: 'Maria Rodriguez',
        reviewerRole: 'TWG Coordinator',
        status: 'approved',
        responseDate: new Date(Date.now() - 9 * 24 * 60 * 60 * 1000),
        comments: 'Good progress on copyediting. Formatting looks consistent.',
      },
      editorReview: {
        reviewerName: 'Dr. Sarah Johnson',
        reviewerRole: 'Editor',
        status: 'approved',
        responseDate: new Date(Date.now() - 8 * 24 * 60 * 60 * 1000),
        comments: 'Citations are properly formatted. Good work on clarity improvements.',
      },
      authorReview: {
        reviewerName: 'Dr. Jane Smith',
        reviewerRole: 'Author',
        status: 'needs_revision',
        responseDate: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000),
        comments: 'Please review the changes made to the methodology section. Some technical terms need adjustment.',
        concerns: [
          'Methodology section: Technical terminology in paragraph 3 changed incorrectly',
          'Results section: Data interpretation modified - needs to be reverted',
          'Discussion: One reference removed but it should remain',
        ],
      },
    },
    {
      roundNumber: 2,
      submittedDate: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000),
      status: 'submitted',
      twgCoordinatorReview: {
        reviewerName: 'Maria Rodriguez',
        reviewerRole: 'TWG Coordinator',
        status: 'approved',
        responseDate: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000),
        comments: 'Revisions look good. Author concerns have been addressed.',
      },
      editorReview: {
        reviewerName: 'Dr. Sarah Johnson',
        reviewerRole: 'Editor',
        status: 'awaiting',
      },
      authorReview: {
        reviewerName: 'Dr. Jane Smith',
        reviewerRole: 'Author',
        status: 'not_forwarded',
      },
    },
  ];

  const currentRoundData = revisionRounds.find(r => r.roundNumber === currentRound);

  // Mock checklist tasks
  const [checklistTasks, setChecklistTasks] = useState<ChecklistTask[]>([
    { id: 'task-1', label: 'Grammar and Spelling Corrections', status: 'completed', lastUpdated: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000) },
    { id: 'task-2', label: 'Formatting Consistency', status: 'completed', lastUpdated: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000) },
    { id: 'task-3', label: 'Citation and Reference Formatting', status: 'completed', lastUpdated: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000) },
    { id: 'task-4', label: 'Figure and Table Formatting', status: 'completed', lastUpdated: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000) },
    { id: 'task-5', label: 'Journal Template Compliance', status: 'completed', lastUpdated: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000) },
    { id: 'task-6', label: 'Language Clarity and Readability', status: 'completed', lastUpdated: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000) },
    { id: 'task-7', label: 'Metadata Completeness', status: 'completed', lastUpdated: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000) },
    { id: 'task-8', label: 'Plagiarism Check Completed', status: 'completed', lastUpdated: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000) },
    { id: 'task-9', label: 'Plagiarism Threshold Passed', status: 'completed', lastUpdated: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000) },
  ]);

  const completedTasks = checklistTasks.filter(t => t.status === 'completed').length;

  // Mock files data
  const [files, setFiles] = useState<FileUpload[]>([
    { type: 'manuscript', fileName: 'ms-006-copyedited-r2.docx', uploadDate: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000), fileSize: '2.4 MB', status: 'uploaded' },
    { type: 'plagiarism_report', fileName: 'plagiarism-report-r2.pdf', uploadDate: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000), fileSize: '856 KB', status: 'uploaded' },
    { type: 'tracked_changes', fileName: 'ms-006-tracked-r2.docx', uploadDate: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000), fileSize: '2.5 MB', status: 'uploaded' },
    { type: 'supplementary', fileName: 'supplementary-notes.pdf', uploadDate: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000), fileSize: '342 KB', status: 'uploaded' },
  ]);

  const allFilesReady = files.every(f => f.status === 'uploaded');
  const checklistComplete = completedTasks === checklistTasks.length;
  const canSubmit = allFilesReady && checklistComplete;

  // Mock comments
  const comments: Comment[] = [
    { id: 'c-1', reviewerName: 'Dr. Jane Smith', reviewerRole: 'Author', section: 'Methodology', pageRef: 'Page 5, Para 3', text: 'Please revert the technical term "algorithmic optimization" back to original wording.', addressed: false },
    { id: 'c-2', reviewerName: 'Dr. Jane Smith', reviewerRole: 'Author', section: 'Results', pageRef: 'Page 9, Para 1', text: 'Data interpretation should use "significant correlation" not "strong correlation".', addressed: false },
    { id: 'c-3', reviewerName: 'Dr. Sarah Johnson', reviewerRole: 'Editor', section: 'Discussion', pageRef: 'Page 12, Para 2', text: 'Good improvement in clarity here. Well done.', addressed: true },
  ];

  const plagiarismScore = 8;
  const plagiarismThreshold = 15;
  const plagiarismStatus = plagiarismScore < plagiarismThreshold ? 'passed' : plagiarismScore < plagiarismThreshold + 5 ? 'near_threshold' : 'failed';

  const sections = ['Abstract', 'Introduction', 'Methodology', 'Results', 'Discussion', 'References'];

  const activityLog = [
    { id: 'a-1', timestamp: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000), action: 'TWG Coordinator approved Round 2', roundNumber: 2, userName: 'Maria Rodriguez' },
    { id: 'a-2', timestamp: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000), action: 'Submitted Round 2 for review', roundNumber: 2, userName: 'Sarah Martinez' },
    { id: 'a-3', timestamp: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000), action: 'Uploaded plagiarism report', roundNumber: 2, userName: 'Sarah Martinez' },
    { id: 'a-4', timestamp: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000), action: 'Author requested revisions', roundNumber: 1, userName: 'Dr. Jane Smith' },
    { id: 'a-5', timestamp: new Date(Date.now() - 8 * 24 * 60 * 60 * 1000), action: 'Editor approved Round 1', roundNumber: 1, userName: 'Dr. Sarah Johnson' },
  ];

  const getStatusBadge = () => {
    const round = currentRoundData;
    if (!round) return { label: 'Unknown', color: 'bg-gray-100 text-gray-800' };

    if (round.twgCoordinatorReview?.status === 'awaiting') {
      return { label: 'Submitted to TWG Coordinator', color: 'bg-amber-100 text-amber-800' };
    }
    if (round.twgCoordinatorReview?.status === 'approved' && round.editorReview?.status === 'awaiting') {
      return { label: 'Forwarded to Editor', color: 'bg-amber-100 text-amber-800' };
    }
    if (round.editorReview?.status === 'approved' && round.authorReview?.status === 'awaiting') {
      return { label: 'Forwarded to Author', color: 'bg-amber-100 text-amber-800' };
    }
    if (round.authorReview?.status === 'approved') {
      return { label: 'Author Approved', color: 'bg-green-100 text-green-800' };
    }
    if (round.twgCoordinatorReview?.status === 'approved') {
      return { label: 'TWG Coordinator Approved', color: 'bg-green-100 text-green-800' };
    }
    if (round.editorReview?.status === 'approved') {
      return { label: 'Editor Approved', color: 'bg-green-100 text-green-800' };
    }
    if (round.status === 'needs_revision') {
      return { label: 'Revision Required', color: 'bg-red-100 text-red-800' };
    }
    return { label: 'Copyediting In Progress', color: 'bg-blue-100 text-blue-800' };
  };

  const getAwaitingLabel = () => {
    const round = currentRoundData;
    if (!round) return 'Unknown';
    if (round.twgCoordinatorReview?.status === 'awaiting') return 'Awaiting TWG Coordinator Review';
    if (round.editorReview?.status === 'awaiting') return 'Awaiting Editor Review';
    if (round.authorReview?.status === 'awaiting') return 'Awaiting Author Review';
    return 'All Approved';
  };

  const statusBadge = getStatusBadge();
  const deadline = new Date(Date.now() + 12 * 24 * 60 * 60 * 1000);
  const daysRemaining = Math.ceil((deadline.getTime() - Date.now()) / (1000 * 60 * 60 * 24));

  const toggleRoundExpansion = (roundNumber: number) => {
    setExpandedRounds(prev =>
      prev.includes(roundNumber)
        ? prev.filter(r => r !== roundNumber)
        : [...prev, roundNumber]
    );
  };

  const getReviewStatusBadge = (status: string) => {
    switch (status) {
      case 'approved':
        return { label: 'Approved', color: 'bg-green-100 text-green-800', icon: <Check className="w-4 h-4" /> };
      case 'needs_revision':
        return { label: 'Needs Revision', color: 'bg-red-100 text-red-800', icon: <XCircle className="w-4 h-4" /> };
      case 'awaiting':
        return { label: 'Awaiting Review', color: 'bg-gray-100 text-gray-800', icon: <Clock className="w-4 h-4" /> };
      case 'not_forwarded':
        return { label: 'Not Yet Forwarded', color: 'bg-gray-50 text-gray-500', icon: null };
      default:
        return { label: 'Unknown', color: 'bg-gray-100 text-gray-800', icon: null };
    }
  };

  const getChecklistStatusBadge = (status: string) => {
    switch (status) {
      case 'completed':
        return { label: 'Completed', color: 'bg-green-100 text-green-800' };
      case 'in_progress':
        return { label: 'In Progress', color: 'bg-blue-100 text-blue-800' };
      case 'pending':
        return { label: 'Pending', color: 'bg-gray-100 text-gray-800' };
      case 'needs_attention':
        return { label: 'Needs Attention', color: 'bg-red-100 text-red-800' };
      default:
        return { label: 'Unknown', color: 'bg-gray-100 text-gray-800' };
    }
  };

  const getFileTypeLabel = (type: string) => {
    switch (type) {
      case 'manuscript':
        return 'Copyedited Manuscript File';
      case 'plagiarism_report':
        return 'Plagiarism Report';
      case 'tracked_changes':
        return 'Marked Manuscript with Tracked Changes';
      case 'supplementary':
        return 'Supplementary Files';
      default:
        return 'Unknown';
    }
  };

  const getFileReadinessIndicator = () => {
    if (allFilesReady) {
      return { label: 'All Files Ready', color: 'bg-green-100 text-green-800 border-green-300' };
    }
    const uploadedCount = files.filter(f => f.status === 'uploaded').length;
    if (uploadedCount > 0) {
      return { label: 'Incomplete', color: 'bg-amber-100 text-amber-800 border-amber-300' };
    }
    return { label: 'Missing Required Files', color: 'bg-red-100 text-red-800 border-red-300' };
  };

  const fileReadiness = getFileReadinessIndicator();

  return (
    <div className="flex h-screen bg-[#F7F8FA]">
      {/* Fixed Left Sidebar */}
      <div className="w-64 bg-[#0F2D5E] text-white flex flex-col fixed h-full">
        <div className="p-6 border-b border-gray-700">
          <h2 className="text-xl font-bold">Manuscript Portal</h2>
        </div>
        <nav className="flex-1 p-4 space-y-2">
          <a href="#" className="flex items-center gap-3 px-4 py-3 rounded-lg hover:bg-gray-700 transition-colors">
            <LayoutDashboard className="w-5 h-5" />
            <span className="text-sm font-medium">Dashboard</span>
          </a>
          <a href="#" className="flex items-center gap-3 px-4 py-3 rounded-lg hover:bg-gray-700 transition-colors">
            <FileText className="w-5 h-5" />
            <span className="text-sm font-medium">My Manuscripts</span>
          </a>
          <a href="#" className="flex items-center gap-3 px-4 py-3 rounded-lg bg-blue-600 transition-colors">
            <Edit3 className="w-5 h-5" />
            <span className="text-sm font-medium">Copyediting Tasks</span>
          </a>
          <a href="#" className="flex items-center gap-3 px-4 py-3 rounded-lg hover:bg-gray-700 transition-colors">
            <FolderOpen className="w-5 h-5" />
            <span className="text-sm font-medium">File Manager</span>
          </a>
          <a href="#" className="flex items-center gap-3 px-4 py-3 rounded-lg hover:bg-gray-700 transition-colors">
            <Mail className="w-5 h-5" />
            <span className="text-sm font-medium">Messages</span>
          </a>
          <a href="#" className="flex items-center gap-3 px-4 py-3 rounded-lg hover:bg-gray-700 transition-colors">
            <Bell className="w-5 h-5" />
            <span className="text-sm font-medium">Notifications</span>
          </a>
          <a href="#" className="flex items-center gap-3 px-4 py-3 rounded-lg hover:bg-gray-700 transition-colors">
            <Settings className="w-5 h-5" />
            <span className="text-sm font-medium">Settings</span>
          </a>
        </nav>
        <div className="p-4 border-t border-gray-700">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-blue-600 flex items-center justify-center">
              <span className="text-sm font-bold">SM</span>
            </div>
            <div className="flex-1">
              <p className="text-sm font-medium">Sarah Martinez</p>
              <p className="text-xs px-2 py-0.5 bg-blue-600 rounded-full inline-block mt-1">TWG Copyeditor</p>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content Area */}
      <div className="ml-64 flex-1 flex flex-col">
        {/* Top Navigation Bar */}
        <div className="bg-white border-b border-gray-200 px-8 py-4 sticky top-0 z-40">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2 text-sm text-gray-600">
              <Home className="w-4 h-4" />
              <ChevronRight className="w-4 h-4" />
              <span>My Manuscripts</span>
              <ChevronRight className="w-4 h-4" />
              <span className="text-gray-900 font-medium">Copyediting Stage</span>
            </div>
            <div className="flex items-center gap-4">
              <button className="relative p-2 hover:bg-gray-100 rounded-lg">
                <Bell className="w-5 h-5 text-gray-600" />
                <span className="absolute top-1 right-1 w-4 h-4 bg-red-500 text-white text-xs rounded-full flex items-center justify-center">3</span>
              </button>
              <button className="p-2 hover:bg-gray-100 rounded-lg">
                <HelpCircle className="w-5 h-5 text-gray-600" />
              </button>
              <div className="w-8 h-8 rounded-full bg-blue-600 flex items-center justify-center">
                <span className="text-xs font-bold text-white">SM</span>
              </div>
            </div>
          </div>
        </div>

        {/* Sticky Manuscript Identity Bar */}
        <div className="bg-[#0F2D5E] text-white px-8 py-4 sticky top-[72px] z-30 shadow-lg">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-xl font-bold font-serif mb-2">{manuscript.title}</h1>
              <div className="flex items-center gap-6 text-sm text-gray-300">
                <span>ID: {manuscript.id}</span>
                <span>Version: {manuscript.files.length}</span>
                <span>Category: {manuscript.category}</span>
              </div>
            </div>
            <div className="text-right">
              <span className={`px-4 py-2 rounded-lg text-sm font-medium ${statusBadge.color} inline-block mb-2`}>
                {statusBadge.label}
              </span>
              <div className="text-sm">
                <p className="text-gray-400">Deadline</p>
                <p className="text-lg font-bold">{deadline.toLocaleDateString()}</p>
                <p className="text-amber-400 font-medium">{daysRemaining} days remaining</p>
              </div>
            </div>
          </div>
        </div>

        {/* Scrollable Content */}
        <div className="flex-1 overflow-y-auto px-8 py-8 pb-32">
          {/* Revision Round Tracker */}
          <div className="bg-white rounded-sm border-2 border-[#1a1f2e] shadow-md p-6 mb-6">
            <h2 className="text-lg font-bold font-serif text-[#0F2D5E] mb-4">Revision Round Tracker</h2>
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                {revisionRounds.map((round) => (
                  <button
                    key={round.roundNumber}
                    onClick={() => setCurrentRound(round.roundNumber)}
                    className={`px-4 py-2 rounded-lg font-medium transition-colors ${
                      currentRound === round.roundNumber
                        ? 'bg-[#0F2D5E] text-white'
                        : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                    }`}
                  >
                    Round {round.roundNumber}
                  </button>
                ))}
              </div>
              <div className="flex items-center gap-8 text-sm">
                <div>
                  <p className="text-gray-600">Current Round</p>
                  <p className="font-bold text-gray-900">{currentRound}</p>
                </div>
                {currentRoundData?.submittedDate && (
                  <div>
                    <p className="text-gray-600">Submitted On</p>
                    <p className="font-bold text-gray-900">{currentRoundData.submittedDate.toLocaleDateString()}</p>
                  </div>
                )}
                <div>
                  <p className="text-gray-600">Status</p>
                  <p className="font-bold text-gray-900">{getAwaitingLabel()}</p>
                </div>
              </div>
            </div>
          </div>

          {/* Approval Status Tracker */}
          <div className="bg-white rounded-sm border-2 border-[#1a1f2e] shadow-md p-6 mb-6">
            <h2 className="text-lg font-bold font-serif text-[#0F2D5E] mb-6">Approval Status Tracker</h2>
            <div className="grid grid-cols-3 gap-8">
              {/* TWG Coordinator */}
              <div className="relative">
                <div className="text-center">
                  <div className="w-16 h-16 rounded-full bg-blue-100 flex items-center justify-center mx-auto mb-3">
                    <User className="w-8 h-8 text-blue-600" />
                  </div>
                  <h3 className="font-bold text-gray-900 mb-1">TWG Coordinator</h3>
                  <p className="text-sm text-gray-600 mb-3">{currentRoundData?.twgCoordinatorReview?.reviewerName || 'Maria Rodriguez'}</p>
                  {currentRoundData?.twgCoordinatorReview && (
                    <>
                      <span className={`px-3 py-1 rounded-full text-xs font-medium inline-flex items-center gap-1 ${getReviewStatusBadge(currentRoundData.twgCoordinatorReview.status).color}`}>
                        {getReviewStatusBadge(currentRoundData.twgCoordinatorReview.status).icon}
                        {getReviewStatusBadge(currentRoundData.twgCoordinatorReview.status).label}
                      </span>
                      {currentRoundData.twgCoordinatorReview.responseDate && (
                        <p className="text-xs text-gray-500 mt-2">
                          {currentRoundData.twgCoordinatorReview.responseDate.toLocaleDateString()}
                        </p>
                      )}
                    </>
                  )}
                </div>
                <ArrowRight className="absolute top-1/2 -right-5 transform -translate-y-1/2 w-6 h-6 text-gray-400" />
              </div>

              {/* Editor */}
              <div className="relative">
                <div className="text-center">
                  <div className="w-16 h-16 rounded-full bg-green-100 flex items-center justify-center mx-auto mb-3">
                    <User className="w-8 h-8 text-green-600" />
                  </div>
                  <h3 className="font-bold text-gray-900 mb-1">Editor</h3>
                  <p className="text-sm text-gray-600 mb-3">{currentRoundData?.editorReview?.reviewerName || 'Dr. Sarah Johnson'}</p>
                  {currentRoundData?.editorReview && (
                    <>
                      <span className={`px-3 py-1 rounded-full text-xs font-medium inline-flex items-center gap-1 ${getReviewStatusBadge(currentRoundData.editorReview.status).color}`}>
                        {getReviewStatusBadge(currentRoundData.editorReview.status).icon}
                        {getReviewStatusBadge(currentRoundData.editorReview.status).label}
                      </span>
                      {currentRoundData.editorReview.responseDate && (
                        <p className="text-xs text-gray-500 mt-2">
                          {currentRoundData.editorReview.responseDate.toLocaleDateString()}
                        </p>
                      )}
                    </>
                  )}
                </div>
                <ArrowRight className="absolute top-1/2 -right-5 transform -translate-y-1/2 w-6 h-6 text-gray-400" />
              </div>

              {/* Author */}
              <div>
                <div className="text-center">
                  <div className="w-16 h-16 rounded-full bg-purple-100 flex items-center justify-center mx-auto mb-3">
                    <User className="w-8 h-8 text-purple-600" />
                  </div>
                  <h3 className="font-bold text-gray-900 mb-1">Author</h3>
                  <p className="text-sm text-gray-600 mb-3">{currentRoundData?.authorReview?.reviewerName || 'Dr. Jane Smith'}</p>
                  {currentRoundData?.authorReview && (
                    <>
                      <span className={`px-3 py-1 rounded-full text-xs font-medium inline-flex items-center gap-1 ${getReviewStatusBadge(currentRoundData.authorReview.status).color}`}>
                        {getReviewStatusBadge(currentRoundData.authorReview.status).icon}
                        {getReviewStatusBadge(currentRoundData.authorReview.status).label}
                      </span>
                      {currentRoundData.authorReview.responseDate && (
                        <p className="text-xs text-gray-500 mt-2">
                          {currentRoundData.authorReview.responseDate.toLocaleDateString()}
                        </p>
                      )}
                    </>
                  )}
                </div>
              </div>
            </div>
          </div>

          {/* Manuscript Viewer */}
          <div className="bg-white rounded-sm border-2 border-[#1a1f2e] shadow-md p-6 mb-6">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-lg font-bold font-serif text-[#0F2D5E]">Manuscript Viewer</h2>
              <div className="flex items-center gap-3">
                <button className="flex items-center gap-2 px-4 py-2 border-2 border-[#1a1f2e] rounded hover:bg-gray-50 transition-colors text-sm font-medium">
                  <Download className="w-4 h-4" />
                  Download Original
                </button>
                <button className="flex items-center gap-2 px-4 py-2 bg-[#0F2D5E] text-white rounded hover:bg-gray-800 transition-colors text-sm font-medium">
                  <Download className="w-4 h-4" />
                  Download Current Version
                </button>
              </div>
            </div>

            <div className="grid grid-cols-3 gap-6">
              {/* Document Preview */}
              <div className="col-span-2">
                <div className="flex items-center gap-2 mb-4 border-b border-gray-200">
                  {sections.map((section) => (
                    <button
                      key={section}
                      onClick={() => setSelectedSection(section)}
                      className={`px-4 py-2 text-sm font-medium transition-colors ${
                        selectedSection === section
                          ? 'border-b-2 border-[#1a1f2e] text-[#0F2D5E]'
                          : 'text-gray-600 hover:text-gray-900'
                      }`}
                    >
                      {section}
                    </button>
                  ))}
                </div>
                <div className="bg-gray-50 rounded border border-gray-200 p-6 min-h-[400px]">
                  <h3 className="font-bold text-lg mb-4 font-serif">{selectedSection}</h3>
                  <p className="text-gray-700 leading-relaxed mb-4">
                    This is a preview of the {selectedSection.toLowerCase()} section. The full document would be displayed here with highlighted annotations showing reviewer comments and suggested changes.
                  </p>
                  <p className="text-gray-700 leading-relaxed">
                    <span className="bg-yellow-200 px-1">Highlighted text would indicate areas with reviewer feedback.</span> Comments would appear as markers that can be clicked to view the full feedback.
                  </p>
                </div>
              </div>

              {/* Comments Panel */}
              <div>
                <h3 className="font-bold text-gray-900 mb-3">Comments ({comments.filter(c => !c.addressed).length})</h3>
                <div className="space-y-3 max-h-[500px] overflow-y-auto">
                  {comments.map((comment) => (
                    <div key={comment.id} className={`bg-gray-50 rounded border-l-4 p-3 ${comment.addressed ? 'border-green-500' : 'border-amber-500'}`}>
                      <div className="flex items-start justify-between mb-2">
                        <div>
                          <p className="font-semibold text-sm text-gray-900">{comment.reviewerName}</p>
                          <p className="text-xs text-gray-600">{comment.reviewerRole}</p>
                        </div>
                        {comment.addressed && (
                          <CheckCircle className="w-4 h-4 text-green-600" />
                        )}
                      </div>
                      <p className="text-xs text-gray-600 mb-2">{comment.section} • {comment.pageRef}</p>
                      <p className="text-sm text-gray-700 mb-3">{comment.text}</p>
                      {!comment.addressed && (
                        <button className="text-xs px-3 py-1 bg-[#0F2D5E] text-white rounded hover:bg-gray-800 transition-colors">
                          Mark as Addressed
                        </button>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* Copyediting Checklist */}
          <div className="bg-white rounded-sm border-2 border-[#1a1f2e] shadow-md p-6 mb-6">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-lg font-bold font-serif text-[#0F2D5E]">Copyediting Checklist</h2>
              <div className="text-right">
                <p className="text-sm text-gray-600">Progress</p>
                <p className="font-bold text-gray-900">{completedTasks} of {checklistTasks.length} tasks completed</p>
              </div>
            </div>
            <div className="mb-4">
              <div className="w-full bg-gray-200 rounded-full h-3">
                <div
                  className="bg-green-600 h-3 rounded-full transition-all"
                  style={{ width: `${(completedTasks / checklistTasks.length) * 100}%` }}
                ></div>
              </div>
            </div>
            <div className="space-y-2">
              {checklistTasks.map((task) => {
                const badge = getChecklistStatusBadge(task.status);
                return (
                  <div key={task.id} className="flex items-center justify-between p-3 bg-gray-50 rounded border border-gray-200">
                    <div className="flex items-center gap-3 flex-1">
                      <input
                        type="checkbox"
                        checked={task.status === 'completed'}
                        className="w-5 h-5"
                        readOnly
                      />
                      <span className="text-sm font-medium text-gray-900">{task.label}</span>
                    </div>
                    <div className="flex items-center gap-4">
                      <span className={`px-3 py-1 rounded-full text-xs font-medium ${badge.color}`}>
                        {badge.label}
                      </span>
                      {task.lastUpdated && (
                        <span className="text-xs text-gray-500">{task.lastUpdated.toLocaleDateString()}</span>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Plagiarism Check */}
          <div className="bg-white rounded-sm border-2 border-[#1a1f2e] shadow-md p-6 mb-6">
            <h2 className="text-lg font-bold font-serif text-[#0F2D5E] mb-6">Plagiarism Check</h2>
            <div className="grid grid-cols-2 gap-8">
              {/* Left: Similarity Score */}
              <div className="flex items-center justify-center">
                <div className="relative w-48 h-48">
                  <svg className="w-full h-full transform -rotate-90">
                    <circle
                      cx="96"
                      cy="96"
                      r="88"
                      stroke="#e5e7eb"
                      strokeWidth="16"
                      fill="none"
                    />
                    <circle
                      cx="96"
                      cy="96"
                      r="88"
                      stroke={plagiarismStatus === 'passed' ? '#10b981' : plagiarismStatus === 'near_threshold' ? '#f59e0b' : '#ef4444'}
                      strokeWidth="16"
                      fill="none"
                      strokeDasharray={`${(plagiarismScore / 100) * 553} 553`}
                      strokeLinecap="round"
                    />
                  </svg>
                  <div className="absolute inset-0 flex flex-col items-center justify-center">
                    <p className="text-4xl font-bold text-gray-900">{plagiarismScore}%</p>
                    <p className="text-sm text-gray-600 mt-1">Similarity</p>
                    <span className={`px-3 py-1 rounded-full text-xs font-medium mt-2 ${
                      plagiarismStatus === 'passed' ? 'bg-green-100 text-green-800' :
                      plagiarismStatus === 'near_threshold' ? 'bg-amber-100 text-amber-800' :
                      'bg-red-100 text-red-800'
                    }`}>
                      {plagiarismStatus === 'passed' ? 'Passed' : plagiarismStatus === 'near_threshold' ? 'Near Threshold' : 'Failed'}
                    </span>
                  </div>
                </div>
              </div>

              {/* Right: Details */}
              <div className="space-y-4">
                <div>
                  <p className="text-sm text-gray-600">Checking Tool</p>
                  <p className="font-semibold text-gray-900">Turnitin</p>
                </div>
                <div>
                  <p className="text-sm text-gray-600">Date Checked</p>
                  <p className="font-semibold text-gray-900">{new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toLocaleDateString()}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-600">Accepted Threshold</p>
                  <p className="font-semibold text-gray-900">{plagiarismThreshold}%</p>
                </div>
                <div className="pt-2 border-t border-gray-200">
                  <button className="flex items-center gap-2 px-4 py-2 bg-[#0F2D5E] text-white rounded hover:bg-gray-800 transition-colors text-sm font-medium mb-2">
                    <Upload className="w-4 h-4" />
                    Upload Plagiarism Report
                  </button>
                  <button className="flex items-center gap-2 px-4 py-2 border-2 border-[#1a1f2e] rounded hover:bg-gray-50 transition-colors text-sm font-medium">
                    <Download className="w-4 h-4" />
                    Download Report
                  </button>
                </div>
                <div className="pt-2">
                  <label className="block text-sm text-gray-600 mb-2">Remarks</label>
                  <textarea
                    className="w-full px-3 py-2 border border-gray-300 rounded text-sm"
                    rows={3}
                    placeholder="Add any remarks about the plagiarism check..."
                  ></textarea>
                </div>
                <div className="bg-amber-50 border border-amber-300 rounded p-3 flex items-start gap-2">
                  <AlertCircle className="w-5 h-5 text-amber-600 flex-shrink-0 mt-0.5" />
                  <p className="text-sm text-amber-800">Plagiarism report must be uploaded before submission.</p>
                </div>
              </div>
            </div>
          </div>

          {/* Feedback and Revision History */}
          <div className="bg-white rounded-sm border-2 border-[#1a1f2e] shadow-md p-6 mb-6">
            <h2 className="text-lg font-bold font-serif text-[#0F2D5E] mb-6">Feedback and Revision History</h2>
            <div className="space-y-4">
              {revisionRounds.map((round) => (
                <div key={round.roundNumber} className="border border-gray-200 rounded">
                  <button
                    onClick={() => toggleRoundExpansion(round.roundNumber)}
                    className="w-full flex items-center justify-between p-4 hover:bg-gray-50 transition-colors"
                  >
                    <div className="flex items-center gap-4">
                      <span className="font-bold text-gray-900">Round {round.roundNumber}</span>
                      {round.submittedDate && (
                        <span className="text-sm text-gray-600">Submitted: {round.submittedDate.toLocaleDateString()}</span>
                      )}
                    </div>
                    <ChevronRight className={`w-5 h-5 text-gray-400 transition-transform ${expandedRounds.includes(round.roundNumber) ? 'rotate-90' : ''}`} />
                  </button>

                  {expandedRounds.includes(round.roundNumber) && (
                    <div className="p-4 pt-0 grid grid-cols-3 gap-4">
                      {/* TWG Coordinator Response */}
                      {round.twgCoordinatorReview && (
                        <div className={`p-4 rounded border-2 ${round.twgCoordinatorReview.status === 'approved' ? 'border-green-300 bg-green-50' : 'border-red-300 bg-red-50'}`}>
                          <h4 className="font-bold text-sm mb-1">TWG Coordinator</h4>
                          <p className="text-sm text-gray-700 mb-2">{round.twgCoordinatorReview.reviewerName}</p>
                          <span className={`px-2 py-1 rounded-full text-xs font-medium inline-block mb-2 ${getReviewStatusBadge(round.twgCoordinatorReview.status).color}`}>
                            {getReviewStatusBadge(round.twgCoordinatorReview.status).label}
                          </span>
                          {round.twgCoordinatorReview.responseDate && (
                            <p className="text-xs text-gray-600 mb-2">{round.twgCoordinatorReview.responseDate.toLocaleDateString()}</p>
                          )}
                          {round.twgCoordinatorReview.comments && (
                            <p className="text-sm text-gray-700">{round.twgCoordinatorReview.comments}</p>
                          )}
                        </div>
                      )}

                      {/* Editor Response */}
                      {round.editorReview && (
                        <div className={`p-4 rounded border-2 ${round.editorReview.status === 'approved' ? 'border-green-300 bg-green-50' : round.editorReview.status === 'needs_revision' ? 'border-red-300 bg-red-50' : 'border-gray-200 bg-gray-50'}`}>
                          <h4 className="font-bold text-sm mb-1">Editor</h4>
                          <p className="text-sm text-gray-700 mb-2">{round.editorReview.reviewerName}</p>
                          <span className={`px-2 py-1 rounded-full text-xs font-medium inline-block mb-2 ${getReviewStatusBadge(round.editorReview.status).color}`}>
                            {getReviewStatusBadge(round.editorReview.status).label}
                          </span>
                          {round.editorReview.responseDate && (
                            <p className="text-xs text-gray-600 mb-2">{round.editorReview.responseDate.toLocaleDateString()}</p>
                          )}
                          {round.editorReview.comments && (
                            <p className="text-sm text-gray-700">{round.editorReview.comments}</p>
                          )}
                        </div>
                      )}

                      {/* Author Response */}
                      {round.authorReview && (
                        <div className={`p-4 rounded border-2 ${round.authorReview.status === 'approved' ? 'border-green-300 bg-green-50' : round.authorReview.status === 'needs_revision' ? 'border-red-300 bg-red-50' : 'border-gray-200 bg-gray-50'}`}>
                          <h4 className="font-bold text-sm mb-1">Author</h4>
                          <p className="text-sm text-gray-700 mb-2">{round.authorReview.reviewerName}</p>
                          <span className={`px-2 py-1 rounded-full text-xs font-medium inline-block mb-2 ${getReviewStatusBadge(round.authorReview.status).color}`}>
                            {getReviewStatusBadge(round.authorReview.status).label}
                          </span>
                          {round.authorReview.responseDate && (
                            <p className="text-xs text-gray-600 mb-2">{round.authorReview.responseDate.toLocaleDateString()}</p>
                          )}
                          {round.authorReview.comments && (
                            <p className="text-sm text-gray-700 mb-2">{round.authorReview.comments}</p>
                          )}
                          {round.authorReview.concerns && round.authorReview.concerns.length > 0 && (
                            <div className="mt-2">
                              <p className="text-xs font-semibold text-gray-700 mb-1">Concerns:</p>
                              <ul className="text-xs text-gray-700 space-y-1">
                                {round.authorReview.concerns.map((concern, idx) => (
                                  <li key={idx} className="flex items-start gap-1">
                                    <span className="text-red-600">•</span>
                                    <span>{concern}</span>
                                  </li>
                                ))}
                              </ul>
                            </div>
                          )}
                        </div>
                      )}
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>

          {/* File Upload */}
          <div className="bg-white rounded-sm border-2 border-[#1a1f2e] shadow-md p-6 mb-6">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-lg font-bold font-serif text-[#0F2D5E]">Upload Revision Round {currentRound}</h2>
              <div className={`px-4 py-2 rounded border-2 ${fileReadiness.color}`}>
                <span className="font-semibold text-sm">{fileReadiness.label}</span>
              </div>
            </div>

            <div className="border-2 border-dashed border-gray-300 rounded-lg p-8 mb-6 text-center hover:border-gray-400 transition-colors cursor-pointer">
              <Upload className="w-12 h-12 text-gray-400 mx-auto mb-3" />
              <p className="text-sm font-medium text-gray-700 mb-1">Drag and drop files here or click to browse</p>
              <p className="text-xs text-gray-500">Supported formats: PDF, DOCX, ZIP</p>
            </div>

            <div className="space-y-3 mb-4">
              {files.map((file, idx) => (
                <div key={idx} className="flex items-center justify-between p-4 bg-gray-50 rounded border border-gray-200">
                  <div className="flex-1">
                    <p className="font-semibold text-sm text-gray-900">{getFileTypeLabel(file.type)}</p>
                    {file.fileName && (
                      <p className="text-xs text-gray-600 mt-1">{file.fileName}</p>
                    )}
                  </div>
                  <div className="flex items-center gap-4">
                    <span className={`px-3 py-1 rounded-full text-xs font-medium ${
                      file.status === 'uploaded' ? 'bg-green-100 text-green-800' :
                      file.status === 'pending' ? 'bg-amber-100 text-amber-800' :
                      'bg-red-100 text-red-800'
                    }`}>
                      {file.status === 'uploaded' ? 'Uploaded' : file.status === 'pending' ? 'Pending' : 'Missing'}
                    </span>
                    {file.uploadDate && (
                      <span className="text-xs text-gray-500">{file.uploadDate.toLocaleDateString()}</span>
                    )}
                    {file.fileSize && (
                      <span className="text-xs text-gray-500">{file.fileSize}</span>
                    )}
                    {file.status === 'uploaded' ? (
                      <button className="flex items-center gap-1 px-3 py-1 border border-gray-300 rounded hover:bg-gray-100 transition-colors text-xs">
                        <Download className="w-3 h-3" />
                        Download
                      </button>
                    ) : (
                      <button className="flex items-center gap-1 px-3 py-1 bg-[#0F2D5E] text-white rounded hover:bg-gray-800 transition-colors text-xs">
                        <Upload className="w-3 h-3" />
                        Upload
                      </button>
                    )}
                  </div>
                </div>
              ))}
            </div>

            <div className="flex items-center justify-between">
              <p className="text-sm text-gray-600">Version History</p>
              <select className="px-3 py-2 border border-gray-300 rounded text-sm">
                <option>Current Round (Round {currentRound})</option>
                <option>Round 1</option>
              </select>
            </div>
          </div>

          {/* Notes to TWG Coordinator */}
          <div className="bg-white rounded-sm border-2 border-[#1a1f2e] shadow-md p-6 mb-6">
            <h2 className="text-lg font-bold font-serif text-[#0F2D5E] mb-4">Notes to TWG Coordinator</h2>
            <textarea
              value={notesToCoordinator}
              onChange={(e) => setNotesToCoordinator(e.target.value)}
              className="w-full px-4 py-3 border-2 border-gray-300 rounded focus:border-[#1a1f2e] focus:outline-none text-sm"
              rows={5}
              placeholder="Summarize the changes made in this revision round and any concerns before submitting..."
            ></textarea>
            <div className="flex items-center justify-between mt-2">
              <p className="text-xs text-gray-500">{notesToCoordinator.length} characters</p>
            </div>
          </div>

          {/* Two Column Layout for Workflow Status and Activity Log */}
          <div className="grid grid-cols-2 gap-6 mb-6">
            {/* Workflow Status */}
            <div className="bg-white rounded-sm border-2 border-[#1a1f2e] shadow-md p-6">
              <h2 className="text-lg font-bold font-serif text-[#0F2D5E] mb-4">Workflow Status</h2>
              <div className="space-y-3 mb-4">
                <div>
                  <p className="text-sm text-gray-600">Current Stage</p>
                  <p className="font-bold text-gray-900">Copyediting - Round {currentRound}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-600">Next Stage</p>
                  <p className="font-semibold text-gray-900">Book Layout & Design</p>
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
                  <p className="text-sm text-gray-700">{new Date(Date.now() - 1 * 24 * 60 * 60 * 1000).toLocaleString()}</p>
                </div>
              </div>
              <div className="pt-4 border-t border-gray-200">
                <p className="text-xs text-gray-600 mb-2">Progress</p>
                <div className="flex flex-wrap gap-2">
                  {['Task Assigned', 'Copyediting In Progress', 'Submitted to TWG Coordinator', 'TWG Coordinator Review', 'Forwarded to Editor', 'Editor Review', 'Forwarded to Author', 'Author Review', 'Approved'].map((step, idx) => (
                    <span
                      key={idx}
                      className={`px-2 py-1 rounded text-xs ${
                        idx <= 3 ? 'bg-[#0F2D5E] text-white' : 'bg-gray-200 text-gray-600'
                      }`}
                    >
                      {step}
                    </span>
                  ))}
                </div>
              </div>
            </div>

            {/* Activity Log */}
            <div className="bg-white rounded-sm border-2 border-[#1a1f2e] shadow-md p-6">
              <h2 className="text-lg font-bold font-serif text-[#0F2D5E] mb-4">Activity Log</h2>
              <div className="space-y-4 max-h-[400px] overflow-y-auto">
                {activityLog.map((activity) => (
                  <div key={activity.id} className="flex gap-3">
                    <div className="flex flex-col items-center">
                      <div className="w-2 h-2 bg-[#0F2D5E] rounded-full"></div>
                      <div className="w-0.5 h-full bg-gray-200"></div>
                    </div>
                    <div className="flex-1 pb-4">
                      <p className="text-sm font-medium text-gray-900">{activity.action}</p>
                      <div className="flex items-center gap-2 mt-1">
                        <span className="text-xs text-gray-600">{activity.userName}</span>
                        <span className="text-xs text-gray-400">•</span>
                        <span className="text-xs text-gray-600">Round {activity.roundNumber}</span>
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

        {/* Fixed Bottom Action Bar */}
        <div className="fixed bottom-0 left-64 right-0 bg-white border-t-2 border-gray-200 px-8 py-4 shadow-lg z-40">
          <div className="flex items-center justify-between">
            <div>
              <p className="font-semibold text-gray-900">{manuscript.title}</p>
              <p className="text-sm text-gray-600">Round {currentRound} • Last saved: {new Date().toLocaleString()}</p>
            </div>
            <div className="flex items-center gap-3">
              <button className="text-sm text-gray-600 hover:text-gray-900 font-medium">
                Cancel
              </button>
              <button className="flex items-center gap-2 px-4 py-2 border-2 border-[#1a1f2e] rounded hover:bg-gray-50 transition-colors text-sm font-medium">
                <Save className="w-4 h-4" />
                Save Draft
              </button>
              <button className="flex items-center gap-2 px-4 py-2 border-2 border-[#1a1f2e] rounded hover:bg-gray-50 transition-colors text-sm font-medium">
                <Eye className="w-4 h-4" />
                Preview Manuscript
              </button>
              <button
                onClick={() => canSubmit && setShowSubmitModal(true)}
                disabled={!canSubmit}
                className={`flex items-center gap-2 px-6 py-2 rounded transition-colors text-sm font-medium ${
                  canSubmit
                    ? 'bg-[#0F2D5E] text-white hover:bg-gray-800'
                    : 'bg-gray-300 text-gray-500 cursor-not-allowed'
                }`}
              >
                <Send className="w-4 h-4" />
                Submit This Revision to TWG Coordinator
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Confirmation Modal */}
      {showSubmitModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg shadow-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <div className="p-6 border-b border-gray-200">
              <h2 className="text-xl font-bold font-serif text-[#0F2D5E]">Confirm Submission - Round {currentRound}</h2>
            </div>
            <div className="p-6 space-y-4">
              <div>
                <h3 className="font-semibold text-gray-900 mb-2">Checklist Completion</h3>
                <p className="text-sm text-gray-700">
                  <CheckCircle className="w-4 h-4 inline text-green-600 mr-1" />
                  All {checklistTasks.length} tasks completed
                </p>
              </div>
              <div>
                <h3 className="font-semibold text-gray-900 mb-2">Plagiarism Score</h3>
                <p className="text-sm text-gray-700">
                  <CheckCircle className="w-4 h-4 inline text-green-600 mr-1" />
                  {plagiarismScore}% - {plagiarismStatus === 'passed' ? 'Passed' : plagiarismStatus === 'near_threshold' ? 'Near Threshold' : 'Failed'} (Threshold: {plagiarismThreshold}%)
                </p>
              </div>
              <div>
                <h3 className="font-semibold text-gray-900 mb-2">Uploaded Files</h3>
                <ul className="text-sm text-gray-700 space-y-1">
                  {files.map((file, idx) => (
                    <li key={idx}>
                      <CheckCircle className="w-4 h-4 inline text-green-600 mr-1" />
                      {getFileTypeLabel(file.type)}: {file.fileName}
                    </li>
                  ))}
                </ul>
              </div>
              <div>
                <h3 className="font-semibold text-gray-900 mb-2">Notes Preview</h3>
                <p className="text-sm text-gray-700 bg-gray-50 p-3 rounded border border-gray-200">
                  {notesToCoordinator || '(No notes added)'}
                </p>
              </div>
              <div className="bg-amber-50 border border-amber-300 rounded p-4 flex items-start gap-3">
                <AlertCircle className="w-5 h-5 text-amber-600 flex-shrink-0 mt-0.5" />
                <p className="text-sm text-amber-800">
                  <strong>Warning:</strong> This will notify the TWG Coordinator for review and cannot be undone. Make sure all files and information are correct before submitting.
                </p>
              </div>
            </div>
            <div className="p-6 border-t border-gray-200 flex items-center justify-end gap-3">
              <button
                onClick={() => setShowSubmitModal(false)}
                className="px-4 py-2 border-2 border-gray-300 rounded hover:bg-gray-50 transition-colors text-sm font-medium"
              >
                Cancel
              </button>
              <button
                onClick={() => {
                  setShowSubmitModal(false);
                  alert('Revision submitted successfully!');
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
