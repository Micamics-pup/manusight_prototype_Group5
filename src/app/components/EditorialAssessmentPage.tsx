import React, { useState } from 'react';
import {
  ArrowLeft,
  FileText,
  Download,
  Eye,
  CheckCircle,
  XCircle,
  AlertTriangle,
  Clock,
  Users,
  TrendingUp,
  Calendar,
  Target,
  Shield,
  Edit3,
  Send,
  Save,
  UserPlus,
  ChevronDown,
  ChevronUp,
  Mail,
  Building,
  Tag,
} from 'lucide-react';
import type { Manuscript } from '../types';
import { EditorAssignmentPage } from './EditorAssignmentPage';

interface EditorialAssessmentPageProps {
  manuscript: Manuscript;
  onBack?: () => void;
  onAssessmentComplete?: (decision: string, data: any) => void;
}

export function EditorialAssessmentPage({
  manuscript,
  onBack,
  onAssessmentComplete,
}: EditorialAssessmentPageProps) {
  // Assessment inputs
  const [scopeRelevance, setScopeRelevance] = useState('');
  const [completeness, setCompleteness] = useState('');
  const [writingQuality, setWritingQuality] = useState('');
  const [ethicalCompliance, setEthicalCompliance] = useState('');
  const [plagiarismStatus, setPlagiarismStatus] = useState('');
  const [editorialNotes, setEditorialNotes] = useState('');
  const [initialDecision, setInitialDecision] = useState('');

  // UI state
  const [showCoAuthors, setShowCoAuthors] = useState(false);
  const [assessmentSubmitted, setAssessmentSubmitted] = useState(false);
  const [savedDraft, setSavedDraft] = useState(false);
  const [showAssignmentPage, setShowAssignmentPage] = useState(false);

  // Mock system-generated data
  const systemAssessment = {
    timelinePrediction: '21-28 days',
    estimatedReviewDuration: '21 days',
    complexityScore: 'Moderate',
    complexityLevel: 65,
    suggestedReviewers: 2,
    riskFlags: ['Extensive References Detected', 'Multi-disciplinary Research'],
    workflowComplexity: 'Moderate',
    estimatedStages: 5,
  };

  // Mock co-authors data
  const coAuthors = [
    {
      name: 'Dr. Michael Roberts',
      email: 'michael.roberts@university.edu',
      affiliation: 'Department of Environmental Science, State University',
    },
    {
      name: 'Prof. Lisa Chen',
      email: 'lisa.chen@institute.org',
      affiliation: 'Climate Research Institute',
    },
  ];

  const handleSaveDraft = () => {
    setSavedDraft(true);
    setTimeout(() => setSavedDraft(false), 3000);
  };

  const handleSubmitAssessment = (decision: string) => {
    if (!scopeRelevance || !completeness || !writingQuality || !ethicalCompliance || !plagiarismStatus) {
      alert('Please complete all assessment fields before submitting.');
      return;
    }

    const assessmentData = {
      manuscriptId: manuscript.id,
      scopeRelevance,
      completeness,
      writingQuality,
      ethicalCompliance,
      plagiarismStatus,
      editorialNotes,
      decision,
      assessmentDate: new Date(),
    };

    setInitialDecision(decision);
    setAssessmentSubmitted(true);

    if (onAssessmentComplete) {
      onAssessmentComplete(decision, assessmentData);
    }
  };

  // Show Editor Assignment Page if approved and user clicked Assign Editor
  if (showAssignmentPage) {
    return (
      <EditorAssignmentPage
        manuscript={manuscript}
        onBack={() => {
          // Go back to success screen, not dashboard
          setShowAssignmentPage(false);
        }}
        onAssignmentComplete={(data) => {
          // After successful assignment, go back to dashboard
          if (onBack) {
            onBack();
          }
        }}
      />
    );
  }

  // Success state after submission
  if (assessmentSubmitted) {
    const getDecisionContent = () => {
      if (initialDecision === 'accept') {
        return {
          icon: <CheckCircle className="w-16 h-16 text-green-600" />,
          title: 'Manuscript Accepted for Editorial Processing',
          message: 'The manuscript has been approved and will proceed to editor assignment.',
          status: 'Accepted for Editorial Processing',
          notifications: [
            'Initial Acceptance Notification sent to Author',
            'Workflow Complexity Confirmation recorded',
            'Manuscript Status updated in Database',
            'Editor Assignment Activation enabled',
            'Timeline Monitoring initialized',
          ],
          nextStep: 'Assign Editor',
          bgColor: 'bg-green-50',
          borderColor: 'border-green-200',
          buttonColor: 'bg-green-600 hover:bg-green-700',
        };
      } else if (initialDecision === 'revision') {
        return {
          icon: <AlertTriangle className="w-16 h-16 text-amber-600" />,
          title: 'Revision Requested',
          message: 'The author has been notified to make the required revisions.',
          status: 'Initial Revision Required',
          notifications: [
            'Revision Request Notification sent to Author',
            'Editorial Notes delivered to Author',
            'Submission Status updated',
          ],
          nextStep: 'Return to Dashboard',
          bgColor: 'bg-amber-50',
          borderColor: 'border-amber-200',
          buttonColor: 'bg-amber-600 hover:bg-amber-700',
        };
      } else {
        return {
          icon: <XCircle className="w-16 h-16 text-red-600" />,
          title: 'Manuscript Rejected',
          message: 'The rejection notification has been sent to the author with feedback.',
          status: 'Rejected During Editorial Assessment',
          notifications: [
            'Rejection Notification sent to Author',
            'Editorial Feedback delivered',
            'Workflow Closure processed',
          ],
          nextStep: 'Return to Dashboard',
          bgColor: 'bg-red-50',
          borderColor: 'border-red-200',
          buttonColor: 'bg-red-600 hover:bg-red-700',
        };
      }
    };

    const content = getDecisionContent();

    return (
      <div className="min-h-screen flex items-center justify-center p-6" style={{ backgroundColor: '#F7F8FA' }}>
        <div className="max-w-3xl w-full bg-white rounded-xl p-12" style={{ border: '0.5px solid #EAEDF2' }}>
          <div className="text-center">
            <div className={`w-20 h-20 ${content.bgColor} rounded-full flex items-center justify-center mx-auto mb-6`}>
              {content.icon}
            </div>
            <h1 className="text-[32px] font-semibold mb-3" style={{ fontFamily: 'Inter, sans-serif', color: '#2C2C2A' }}>{content.title}</h1>
            <p className="text-[16px] text-gray-700 mb-2" style={{ fontFamily: 'DM Sans, sans-serif' }}>{content.message}</p>
            <p className="text-[14px] text-gray-600 mb-8" style={{ fontFamily: 'DM Sans, sans-serif' }}>
              Manuscript ID: <span className="font-medium" style={{ fontFamily: 'JetBrains Mono, monospace' }}>{manuscript.id}</span>
            </p>

            <div className={`${content.bgColor} border ${content.borderColor} rounded-sm p-6 mb-8 text-left`}>
              <div className="flex items-center gap-2 mb-4">
                <Shield className="w-5 h-5 text-gray-700" />
                <h3 className="font-semibold text-gray-900">Status Update</h3>
              </div>
              <p className="text-sm font-medium text-gray-900 mb-4">{content.status}</p>
              <div className="space-y-2">
                {content.notifications.map((notification, index) => (
                  <div key={index} className="flex items-start gap-2">
                    <CheckCircle className="w-4 h-4 text-green-600 flex-shrink-0 mt-0.5" />
                    <span className="text-sm text-gray-700">{notification}</span>
                  </div>
                ))}
              </div>
            </div>

            <div className="flex gap-3 justify-center">
              <button
                onClick={onBack}
                className="px-8 py-3 text-gray-700 hover:bg-gray-50 transition-colors font-semibold rounded-lg"
                style={{ border: '0.5px solid #EAEDF2', fontFamily: 'DM Sans, sans-serif' }}
              >
                Return to Dashboard
              </button>
              {initialDecision === 'accept' && (
                <button
                  onClick={() => setShowAssignmentPage(true)}
                  className="px-8 py-3 text-white rounded-lg transition-colors font-semibold flex items-center gap-2"
                  style={{ backgroundColor: '#0F2D5E', fontFamily: 'DM Sans, sans-serif' }}
                  onMouseEnter={(e) => e.currentTarget.style.backgroundColor = '#1A4A8A'}
                  onMouseLeave={(e) => e.currentTarget.style.backgroundColor = '#0F2D5E'}
                >
                  <UserPlus className="w-5 h-5" />
                  {content.nextStep}
                </button>
              )}
            </div>
          </div>
        </div>
      </div>
    );
  }

  const getComplexityColor = (level: number) => {
    if (level >= 75) return 'text-red-600';
    if (level >= 50) return 'text-amber-600';
    return 'text-green-600';
  };

  return (
    <div className="min-h-screen" style={{ backgroundColor: '#F7F8FA' }}>
      {/* Header */}
      <div className="text-white py-6 px-6" style={{ backgroundColor: '#0F2D5E' }}>
        <div className="max-w-7xl mx-auto">
          <div className="flex items-center gap-4">
            {onBack && (
              <button
                onClick={onBack}
                className="p-2 hover:bg-white/10 rounded-lg transition-colors"
                style={{ color: '#4D9DE0' }}
              >
                <ArrowLeft className="w-5 h-5" />
              </button>
            )}
            <div className="flex-1">
              <h1 className="text-[22px] font-semibold" style={{ fontFamily: 'Inter, sans-serif' }}>Editorial Assessment</h1>
              <p className="text-[14px] text-gray-300 mt-1" style={{ fontFamily: 'DM Sans, sans-serif' }}>
                Initial screening evaluation by Editor-in-Chief
              </p>
            </div>
            <div className="flex items-center gap-2 px-4 py-2 bg-white/10 rounded-lg backdrop-blur">
              <FileText className="w-5 h-5" style={{ color: '#4D9DE0' }} />
              <span className="text-[12px]" style={{ fontFamily: 'JetBrains Mono, monospace' }}>{manuscript.id}</span>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-6 py-8">
        <div className="grid lg:grid-cols-3 gap-6">
          {/* Left Column - Manuscript & Author Info */}
          <div className="lg:col-span-2 space-y-6">
            {/* Manuscript Information */}
            <div className="bg-white rounded-xl p-6" style={{ border: '0.5px solid #EAEDF2' }}>
              <div className="flex items-center gap-3 mb-6">
                <div className="w-10 h-10 rounded-lg flex items-center justify-center" style={{ backgroundColor: '#0F2D5E' }}>
                  <FileText className="w-5 h-5 text-white" />
                </div>
                <h2 className="text-[22px] font-semibold" style={{ fontFamily: 'Inter, sans-serif', color: '#2C2C2A' }}>Manuscript Information</h2>
              </div>

              <div className="space-y-4">
                <div>
                  <label className="block text-xs font-medium text-gray-500 mb-1">Manuscript Title</label>
                  <p className="text-base font-medium text-gray-900">{manuscript.title}</p>
                </div>

                <div>
                  <label className="block text-xs font-medium text-gray-500 mb-1">Abstract</label>
                  <div className="bg-gray-50 rounded-lg p-4 max-h-32 overflow-y-auto">
                    <p className="text-sm text-gray-700 leading-relaxed">{manuscript.abstract}</p>
                  </div>
                </div>

                <div className="grid md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-medium text-gray-500 mb-2">Keywords</label>
                    <div className="flex flex-wrap gap-2">
                      <span className="px-3 py-1 bg-blue-100 text-blue-800 rounded-full text-xs font-medium">
                        Machine Learning
                      </span>
                      <span className="px-3 py-1 bg-blue-100 text-blue-800 rounded-full text-xs font-medium">
                        Climate Science
                      </span>
                      <span className="px-3 py-1 bg-blue-100 text-blue-800 rounded-full text-xs font-medium">
                        Prediction Models
                      </span>
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-medium text-gray-500 mb-2">Research Area</label>
                    <p className="text-sm text-gray-900 font-medium">{manuscript.category}</p>
                  </div>
                </div>

                <div className="grid md:grid-cols-3 gap-4">
                  <div>
                    <label className="block text-xs font-medium text-gray-500 mb-1">Manuscript Type</label>
                    <p className="text-sm text-gray-900">Research Article</p>
                  </div>

                  <div>
                    <label className="block text-xs font-medium text-gray-500 mb-1">Submission Date</label>
                    <p className="text-sm text-gray-900">
                      {manuscript.submittedAt.toLocaleDateString('en-US', {
                        month: 'short',
                        day: 'numeric',
                        year: 'numeric',
                      })}
                    </p>
                  </div>

                  <div>
                    <label className="block text-xs font-medium text-gray-500 mb-1">Manuscript ID</label>
                    <p className="text-sm text-gray-900 font-medium">{manuscript.id}</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Author Information */}
            <div className="bg-white rounded-xl p-6" style={{ border: '0.5px solid #EAEDF2' }}>
              <div className="flex items-center gap-3 mb-6">
                <div className="w-10 h-10 rounded-lg flex items-center justify-center" style={{ backgroundColor: '#0F2D5E' }}>
                  <Users className="w-5 h-5 text-white" />
                </div>
                <h2 className="text-[22px] font-semibold" style={{ fontFamily: 'Inter, sans-serif', color: '#2C2C2A' }}>Author Information</h2>
              </div>

              <div className="space-y-4">
                <div className="grid md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-medium text-gray-500 mb-1">Author Name</label>
                    <p className="text-sm text-gray-900 font-medium">{manuscript.authorName}</p>
                  </div>
                  <div>
                    <label className="block text-xs font-medium text-gray-500 mb-1">Email</label>
                    <div className="flex items-center gap-2">
                      <Mail className="w-4 h-4 text-gray-400" />
                      <p className="text-sm text-gray-900">jane.smith@university.edu</p>
                    </div>
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-medium text-gray-500 mb-1">Affiliation</label>
                  <div className="flex items-center gap-2">
                    <Building className="w-4 h-4 text-gray-400" />
                    <p className="text-sm text-gray-900">Department of Computer Science, State University</p>
                  </div>
                </div>

                {/* Co-authors */}
                <div>
                  <button
                    onClick={() => setShowCoAuthors(!showCoAuthors)}
                    className="flex items-center gap-2 text-sm font-medium text-blue-600 hover:text-blue-700 transition-colors"
                  >
                    {showCoAuthors ? (
                      <ChevronUp className="w-4 h-4" />
                    ) : (
                      <ChevronDown className="w-4 h-4" />
                    )}
                    Co-authors ({coAuthors.length})
                  </button>

                  {showCoAuthors && (
                    <div className="mt-3 space-y-3">
                      {coAuthors.map((coAuthor, index) => (
                        <div key={index} className="bg-gray-50 rounded-lg p-3">
                          <p className="text-sm font-medium text-gray-900">{coAuthor.name}</p>
                          <p className="text-xs text-gray-600">{coAuthor.email}</p>
                          <p className="text-xs text-gray-500 mt-1">{coAuthor.affiliation}</p>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            </div>

            {/* Uploaded Files */}
            <div className="bg-white rounded-xl p-6" style={{ border: '0.5px solid #EAEDF2' }}>
              <div className="flex items-center gap-3 mb-6">
                <div className="w-10 h-10 rounded-lg flex items-center justify-center" style={{ backgroundColor: '#0F2D5E' }}>
                  <Download className="w-5 h-5 text-white" />
                </div>
                <h2 className="text-[22px] font-semibold" style={{ fontFamily: 'Inter, sans-serif', color: '#2C2C2A' }}>Uploaded Files</h2>
              </div>

              <div className="space-y-3">
                {manuscript.files.map((file) => (
                  <div
                    key={file.id}
                    className="flex items-center justify-between p-4 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors"
                  >
                    <div className="flex items-center gap-3">
                      <FileText className="w-5 h-5 text-gray-400" />
                      <div>
                        <p className="text-sm font-medium text-gray-900">{file.fileName}</p>
                        <p className="text-xs text-gray-500">Uploaded on {file.uploadedAt.toLocaleDateString()}</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <button className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors">
                        <Eye className="w-4 h-4" />
                      </button>
                      <button className="p-2 text-gray-600 hover:bg-gray-100 rounded-lg transition-colors">
                        <Download className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                ))}

                {/* Cover Letter */}
                <div className="flex items-center justify-between p-4 bg-blue-50 rounded-lg border border-blue-100">
                  <div className="flex items-center gap-3">
                    <Mail className="w-5 h-5 text-blue-600" />
                    <div>
                      <p className="text-sm font-medium text-gray-900">Cover Letter</p>
                      <p className="text-xs text-gray-500">Submitted with manuscript</p>
                    </div>
                  </div>
                  <button className="p-2 text-blue-600 hover:bg-blue-100 rounded-lg transition-colors">
                    <Eye className="w-4 h-4" />
                  </button>
                </div>
              </div>
            </div>
          </div>

          {/* Right Column - Assessment & System Data */}
          <div className="space-y-6">
            {/* System-Generated Assessment */}
            <div className="rounded-xl p-6 text-white" style={{ backgroundColor: '#0F2D5E' }}>
              <div className="flex items-center gap-3 mb-6">
                <div className="w-10 h-10 bg-white/10 rounded-lg flex items-center justify-center">
                  <TrendingUp className="w-5 h-5 text-white" />
                </div>
                <h2 className="text-[22px] font-semibold" style={{ fontFamily: 'Inter, sans-serif' }}>System Assessment</h2>
              </div>

              <div className="space-y-4">
                <div className="bg-white/10 backdrop-blur rounded-lg p-4">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-sm text-white/80">Complexity Level</span>
                    <span className="text-lg font-bold">{systemAssessment.complexityScore}</span>
                  </div>
                  <div className="w-full bg-white/20 rounded-full h-2">
                    <div
                      className="bg-white rounded-full h-2 transition-all"
                      style={{ width: `${systemAssessment.complexityLevel}%` }}
                    />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div className="bg-white/10 backdrop-blur rounded-lg p-3">
                    <div className="flex items-center gap-2 mb-1">
                      <Clock className="w-4 h-4 text-white/80" />
                      <span className="text-xs text-white/80">Review Time</span>
                    </div>
                    <p className="text-base font-semibold">{systemAssessment.estimatedReviewDuration}</p>
                  </div>

                  <div className="bg-white/10 backdrop-blur rounded-lg p-3">
                    <div className="flex items-center gap-2 mb-1">
                      <Users className="w-4 h-4 text-white/80" />
                      <span className="text-xs text-white/80">Reviewers</span>
                    </div>
                    <p className="text-base font-semibold">{systemAssessment.suggestedReviewers}</p>
                  </div>
                </div>

                <div className="bg-white/10 backdrop-blur rounded-lg p-3">
                  <div className="flex items-center gap-2 mb-2">
                    <AlertTriangle className="w-4 h-4 text-white/80" />
                    <span className="text-xs text-white/80 font-medium">Risk Flags</span>
                  </div>
                  <div className="space-y-1">
                    {systemAssessment.riskFlags.map((flag, index) => (
                      <p key={index} className="text-xs text-white/90">
                        • {flag}
                      </p>
                    ))}
                  </div>
                </div>

                <div className="bg-white/10 backdrop-blur rounded-lg p-3">
                  <div className="flex items-center gap-2 mb-1">
                    <Calendar className="w-4 h-4 text-white/80" />
                    <span className="text-xs text-white/80">Timeline Prediction</span>
                  </div>
                  <p className="text-base font-semibold">{systemAssessment.timelinePrediction}</p>
                </div>
              </div>
            </div>

            {/* Editorial Assessment Form */}
            <div className="bg-white rounded-xl p-6" style={{ border: '0.5px solid #EAEDF2' }}>
              <div className="flex items-center gap-3 mb-6">
                <div className="w-10 h-10 rounded-lg flex items-center justify-center" style={{ backgroundColor: '#0F2D5E' }}>
                  <Edit3 className="w-5 h-5 text-white" />
                </div>
                <h2 className="text-[22px] font-semibold" style={{ fontFamily: 'Inter, sans-serif', color: '#2C2C2A' }}>Editorial Assessment</h2>
              </div>

              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Scope Relevance <span className="text-red-500">*</span>
                  </label>
                  <select
                    value={scopeRelevance}
                    onChange={(e) => setScopeRelevance(e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-sm focus:outline-none focus:ring-2 focus:ring-[#1a1f2e] text-sm"
                  >
                    <option value="">Select...</option>
                    <option value="highly_relevant">Highly Relevant</option>
                    <option value="relevant">Relevant</option>
                    <option value="partially_relevant">Partially Relevant</option>
                    <option value="not_relevant">Not Relevant</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Manuscript Completeness <span className="text-red-500">*</span>
                  </label>
                  <select
                    value={completeness}
                    onChange={(e) => setCompleteness(e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-sm focus:outline-none focus:ring-2 focus:ring-[#1a1f2e] text-sm"
                  >
                    <option value="">Select...</option>
                    <option value="complete">Complete</option>
                    <option value="minor_missing">Minor Missing Components</option>
                    <option value="incomplete">Incomplete</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Writing Quality <span className="text-red-500">*</span>
                  </label>
                  <select
                    value={writingQuality}
                    onChange={(e) => setWritingQuality(e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-sm focus:outline-none focus:ring-2 focus:ring-[#1a1f2e] text-sm"
                  >
                    <option value="">Select...</option>
                    <option value="excellent">Excellent</option>
                    <option value="good">Good</option>
                    <option value="needs_improvement">Needs Improvement</option>
                    <option value="poor">Poor</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Ethical Compliance <span className="text-red-500">*</span>
                  </label>
                  <select
                    value={ethicalCompliance}
                    onChange={(e) => setEthicalCompliance(e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-sm focus:outline-none focus:ring-2 focus:ring-[#1a1f2e] text-sm"
                  >
                    <option value="">Select...</option>
                    <option value="passed">Passed</option>
                    <option value="needs_verification">Needs Verification</option>
                    <option value="failed">Failed</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Plagiarism Screening <span className="text-red-500">*</span>
                  </label>
                  <select
                    value={plagiarismStatus}
                    onChange={(e) => setPlagiarismStatus(e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-sm focus:outline-none focus:ring-2 focus:ring-[#1a1f2e] text-sm"
                  >
                    <option value="">Select...</option>
                    <option value="passed">Passed</option>
                    <option value="moderate_similarity">Moderate Similarity</option>
                    <option value="high_similarity">High Similarity</option>
                    <option value="requires_investigation">Requires Investigation</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Editorial Notes</label>
                  <textarea
                    value={editorialNotes}
                    onChange={(e) => setEditorialNotes(e.target.value)}
                    rows={4}
                    className="w-full px-3 py-2 border border-gray-300 rounded-sm focus:outline-none focus:ring-2 focus:ring-[#1a1f2e] text-sm resize-none"
                    placeholder="Add any observations, concerns, or recommendations..."
                  />
                </div>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="bg-white rounded-xl p-6" style={{ border: '0.5px solid #EAEDF2' }}>
              <h3 className="text-[16px] font-semibold mb-4" style={{ fontFamily: 'Inter, sans-serif', color: '#2C2C2A' }}>Decision & Actions</h3>

              <div className="space-y-3">
                <button
                  onClick={handleSaveDraft}
                  className="w-full flex items-center justify-center gap-2 px-4 py-2.5 rounded-lg text-gray-700 hover:bg-gray-50 transition-colors text-[14px] font-semibold"
                  style={{ border: '0.5px solid #EAEDF2', fontFamily: 'DM Sans, sans-serif' }}
                >
                  <Save className="w-4 h-4" />
                  Save Assessment
                </button>

                {savedDraft && (
                  <div className="bg-green-50 border border-green-200 rounded-sm p-3 flex items-center gap-2">
                    <CheckCircle className="w-4 h-4 text-green-600" />
                    <span className="text-sm text-green-800">Assessment saved successfully</span>
                  </div>
                )}

                <div className="pt-3 border-t border-[#d1c7b3] space-y-3">
                  <button
                    onClick={() => handleSubmitAssessment('accept')}
                    className="w-full flex items-center justify-center gap-2 px-4 py-3 text-white rounded-lg transition-colors font-semibold"
                    style={{ backgroundColor: '#0F2D5E', fontFamily: 'DM Sans, sans-serif' }}
                    onMouseEnter={(e) => e.currentTarget.style.backgroundColor = '#1A4A8A'}
                    onMouseLeave={(e) => e.currentTarget.style.backgroundColor = '#0F2D5E'}
                  >
                    <CheckCircle className="w-5 h-5" />
                    Approve Submission
                  </button>

                  <button
                    onClick={() => handleSubmitAssessment('revision')}
                    className="w-full flex items-center justify-center gap-2 px-4 py-3 bg-amber-600 text-white rounded-lg hover:bg-amber-700 transition-colors font-semibold"
                    style={{ fontFamily: 'DM Sans, sans-serif' }}
                  >
                    <Send className="w-5 h-5" />
                    Request Revision
                  </button>

                  <button
                    onClick={() => handleSubmitAssessment('reject')}
                    className="w-full flex items-center justify-center gap-2 px-4 py-3 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors font-semibold"
                    style={{ fontFamily: 'DM Sans, sans-serif' }}
                  >
                    <XCircle className="w-5 h-5" />
                    Reject Submission
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
