import React, { useState, useEffect } from 'react';
import {
  ArrowLeft,
  FileText,
  Users,
  Calendar,
  CheckCircle,
  XCircle,
  AlertTriangle,
  Clock,
  Download,
  Eye,
  ChevronDown,
  ChevronUp,
  Shield,
  FileCheck,
  Activity,
  Flag,
  Target,
  Send,
  Save,
  Sparkles,
  AlertCircle,
  User,
  BookOpen,
  Database,
} from 'lucide-react';
import type { Manuscript, Review } from '../types';

export interface TWGEndorsementData {
  endorsementDecision: 'endorse_to_twg' | 'endorse_with_concerns' | 'return_for_revision' | 'return_to_reviewer' | 'hold_endorsement' | 'reject_endorsement';
  editorialJustification: string;
  technicalConcernNotes: string;
  publicationReadinessNotes: string;
  riskAssessmentNotes: string;
  assignedTWGMembers: string[];
  evaluationInstructions: string;
  technicalFocusAreas: string;
  validationRequirements: string;
  reviewerConcernReferences: string;
  confidentialNotes: string;
  deadline?: Date;
}

interface TWGMember {
  id: string;
  name: string;
  expertise: string;
  availability: 'available' | 'limited' | 'unavailable';
  currentWorkload: number;
  matchScore: number;
}

interface TWGEndorsementPageProps {
  manuscript: Manuscript;
  reviews: Review[];
  onBack: () => void;
  onSubmitEndorsement: (endorsementData: TWGEndorsementData) => void;
}

export function TWGEndorsementPage({
  manuscript,
  reviews,
  onBack,
  onSubmitEndorsement,
}: TWGEndorsementPageProps) {
  const [manuscriptSummaryExpanded, setManuscriptSummaryExpanded] = useState(true);
  const [complianceExpanded, setComplianceExpanded] = useState(true);
  const [reviewHistoryExpanded, setReviewHistoryExpanded] = useState(false);

  const [endorsementDecision, setEndorsementDecision] = useState<TWGEndorsementData['endorsementDecision'] | ''>('');
  const [editorialJustification, setEditorialJustification] = useState('');
  const [technicalConcernNotes, setTechnicalConcernNotes] = useState('');
  const [publicationReadinessNotes, setPublicationReadinessNotes] = useState('');
  const [riskAssessmentNotes, setRiskAssessmentNotes] = useState('');
  const [assignedTWGMembers, setAssignedTWGMembers] = useState<string[]>([]);
  const [evaluationInstructions, setEvaluationInstructions] = useState('');
  const [technicalFocusAreas, setTechnicalFocusAreas] = useState('');
  const [validationRequirements, setValidationRequirements] = useState('');
  const [reviewerConcernReferences, setReviewerConcernReferences] = useState('');
  const [confidentialNotes, setConfidentialNotes] = useState('');
  const [deadline, setDeadline] = useState('');

  const [showSuccessScreen, setShowSuccessScreen] = useState(false);
  const [submittedData, setSubmittedData] = useState<TWGEndorsementData | null>(null);

  // Mock TWG members
  const twgMembers: TWGMember[] = [
    {
      id: 'twg-001',
      name: 'Dr. Robert Chen',
      expertise: 'Blockchain Technology & Distributed Systems',
      availability: 'available',
      currentWorkload: 2,
      matchScore: 95,
    },
    {
      id: 'twg-002',
      name: 'Prof. Maria Garcia',
      expertise: 'Supply Chain Management & Logistics',
      availability: 'available',
      currentWorkload: 1,
      matchScore: 88,
    },
    {
      id: 'twg-003',
      name: 'Dr. James Wilson',
      expertise: 'Information Systems & Technology',
      availability: 'limited',
      currentWorkload: 3,
      matchScore: 82,
    },
    {
      id: 'twg-004',
      name: 'Dr. Lisa Thompson',
      expertise: 'Data Security & Cryptography',
      availability: 'available',
      currentWorkload: 1,
      matchScore: 76,
    },
  ];

  // Auto-save draft every 30 seconds
  useEffect(() => {
    const interval = setInterval(() => {
      if (endorsementDecision || editorialJustification) {
        const draftKey = `twg-endorsement-draft-${manuscript.id}`;
        localStorage.setItem(
          draftKey,
          JSON.stringify({
            endorsementDecision,
            editorialJustification,
            technicalConcernNotes,
            publicationReadinessNotes,
            riskAssessmentNotes,
            savedAt: new Date().toISOString(),
          })
        );
      }
    }, 30000);

    return () => clearInterval(interval);
  }, [
    endorsementDecision,
    editorialJustification,
    technicalConcernNotes,
    publicationReadinessNotes,
    riskAssessmentNotes,
    manuscript.id,
  ]);

  const handleSubmit = () => {
    if (!endorsementDecision) {
      alert('Please select an endorsement decision');
      return;
    }

    if (!editorialJustification) {
      alert('Please provide editorial justification');
      return;
    }

    if (
      (endorsementDecision === 'endorse_to_twg' || endorsementDecision === 'endorse_with_concerns') &&
      assignedTWGMembers.length === 0
    ) {
      alert('Please assign at least one TWG member');
      return;
    }

    const endorsementData: TWGEndorsementData = {
      endorsementDecision: endorsementDecision as TWGEndorsementData['endorsementDecision'],
      editorialJustification,
      technicalConcernNotes,
      publicationReadinessNotes,
      riskAssessmentNotes,
      assignedTWGMembers,
      evaluationInstructions,
      technicalFocusAreas,
      validationRequirements,
      reviewerConcernReferences,
      confidentialNotes,
      deadline: deadline ? new Date(deadline) : undefined,
    };

    setSubmittedData(endorsementData);
    setShowSuccessScreen(true);

    // Clear draft
    const draftKey = `twg-endorsement-draft-${manuscript.id}`;
    localStorage.removeItem(draftKey);

    // Call parent callback after delay
    setTimeout(() => {
      onSubmitEndorsement(endorsementData);
    }, 3000);
  };

  const toggleTWGMember = (memberId: string) => {
    setAssignedTWGMembers((prev) =>
      prev.includes(memberId) ? prev.filter((id) => id !== memberId) : [...prev, memberId]
    );
  };

  if (showSuccessScreen && submittedData) {
    const decisionLabels = {
      endorse_to_twg: 'Endorsed to TWG',
      endorse_with_concerns: 'Endorsed with Technical Concerns',
      return_for_revision: 'Returned for Additional Revision',
      return_to_reviewer: 'Returned to Reviewer',
      hold_endorsement: 'Endorsement On Hold',
      reject_endorsement: 'Endorsement Rejected',
    };

    const decisionColors = {
      endorse_to_twg: 'bg-green-600',
      endorse_with_concerns: 'bg-yellow-600',
      return_for_revision: 'bg-orange-600',
      return_to_reviewer: 'bg-blue-600',
      hold_endorsement: 'bg-purple-600',
      reject_endorsement: 'bg-red-600',
    };

    return (
      <div className="min-h-screen bg-[#F7F8FA] p-8">
        <div className="max-w-4xl mx-auto">
          <div className="bg-white rounded-sm border-2 border-[#EAEDF2] shadow-lg p-12 text-center">
            <div
              className={`w-20 h-20 ${decisionColors[submittedData.endorsementDecision]} rounded-full flex items-center justify-center mx-auto mb-6`}
            >
              {submittedData.endorsementDecision === 'reject_endorsement' ? (
                <XCircle className="w-12 h-12 text-white" />
              ) : submittedData.endorsementDecision === 'endorse_to_twg' ? (
                <CheckCircle className="w-12 h-12 text-white" />
              ) : (
                <Send className="w-12 h-12 text-white" />
              )}
            </div>

            <h2 className="text-3xl font-serif font-bold text-[#0F2D5E] mb-4">
              TWG Endorsement Submitted
            </h2>

            <p className="text-xl text-gray-700 mb-8">
              <span className="font-semibold">Decision:</span>{' '}
              {decisionLabels[submittedData.endorsementDecision]}
            </p>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-8 text-left">
              <div className="bg-[#F7F8FA] rounded-sm p-4 border border-[#EAEDF2]">
                <div className="flex items-start gap-3">
                  <Users className="w-5 h-5 text-[#0F2D5E] mt-0.5" />
                  <div>
                    <h3 className="font-semibold text-[#0F2D5E] mb-1">TWG Members Assigned</h3>
                    <p className="text-sm text-gray-600">
                      {submittedData.assignedTWGMembers.length} evaluator(s) notified
                    </p>
                  </div>
                </div>
              </div>

              <div className="bg-[#F7F8FA] rounded-sm p-4 border border-[#EAEDF2]">
                <div className="flex items-start gap-3">
                  <Activity className="w-5 h-5 text-[#0F2D5E] mt-0.5" />
                  <div>
                    <h3 className="font-semibold text-[#0F2D5E] mb-1">Workflow Updated</h3>
                    <p className="text-sm text-gray-600">Status transitioned to TWG evaluation</p>
                  </div>
                </div>
              </div>

              <div className="bg-[#F7F8FA] rounded-sm p-4 border border-[#EAEDF2]">
                <div className="flex items-start gap-3">
                  <Send className="w-5 h-5 text-[#0F2D5E] mt-0.5" />
                  <div>
                    <h3 className="font-semibold text-[#0F2D5E] mb-1">Notifications Sent</h3>
                    <p className="text-sm text-gray-600">Author and TWG members notified</p>
                  </div>
                </div>
              </div>

              <div className="bg-[#F7F8FA] rounded-sm p-4 border border-[#EAEDF2]">
                <div className="flex items-start gap-3">
                  <Database className="w-5 h-5 text-[#0F2D5E] mt-0.5" />
                  <div>
                    <h3 className="font-semibold text-[#0F2D5E] mb-1">Record Created</h3>
                    <p className="text-sm text-gray-600">Endorsement logged in audit trail</p>
                  </div>
                </div>
              </div>
            </div>

            <div className="text-sm text-gray-500 mb-6">
              Submitted on {new Date().toLocaleDateString()} at {new Date().toLocaleTimeString()}
            </div>

            <button
              onClick={onBack}
              className="px-6 py-3 bg-[#0F2D5E] text-white rounded-sm hover:bg-[#1A4A8A] transition-colors font-medium"
            >
              Return to Dashboard
            </button>
          </div>
        </div>
      </div>
    );
  }

  const completedReviews = reviews.filter((r) => r.status === 'completed');

  return (
    <div className="min-h-screen bg-[#F7F8FA]">
      {/* Header */}
      <div className="bg-[#0F2D5E] text-white py-6 px-8 shadow-lg">
        <div className="max-w-7xl mx-auto">
          <button
            onClick={onBack}
            className="flex items-center gap-2 text-gray-300 hover:text-white mb-4 transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
            <span className="text-sm">Back to Dashboard</span>
          </button>

          <div className="flex items-start justify-between">
            <div className="flex-1">
              <div className="flex items-center gap-3 mb-2">
                <div className="w-12 h-12 bg-white/10 rounded-sm flex items-center justify-center">
                  <Target className="w-7 h-7 text-white" />
                </div>
                <div>
                  <h1 className="text-3xl font-serif font-bold">TWG Endorsement</h1>
                  <p className="text-gray-300 text-sm mt-1">Technical Working Group Evaluation</p>
                </div>
              </div>
              <div className="flex items-center gap-3 mt-3 text-sm">
                <span className="text-gray-400">Manuscript ID:</span>
                <span className="font-mono bg-white/10 px-2 py-1 rounded">{manuscript.id}</span>
                <span className="px-3 py-1 bg-blue-600 rounded-sm text-xs font-medium">
                  Under TWG Endorsement Evaluation
                </span>
              </div>
            </div>

            <div className="flex items-center gap-2">
              <button className="px-4 py-2 bg-white/10 hover:bg-white/20 rounded-sm transition-colors flex items-center gap-2">
                <Eye className="w-4 h-4" />
                <span className="text-sm">View Manuscript</span>
              </button>
              <button className="px-4 py-2 bg-white/10 hover:bg-white/20 rounded-sm transition-colors flex items-center gap-2">
                <Download className="w-4 h-4" />
                <span className="text-sm">Download Files</span>
              </button>
              <button className="px-4 py-2 bg-white/10 hover:bg-white/20 rounded-sm transition-colors flex items-center gap-2">
                <Activity className="w-4 h-4" />
                <span className="text-sm">View History</span>
              </button>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-8 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-6">
            {/* Manuscript Summary */}
            <div className="bg-white rounded-sm border-2 border-[#EAEDF2] shadow-md">
              <button
                onClick={() => setManuscriptSummaryExpanded(!manuscriptSummaryExpanded)}
                className="w-full flex items-center justify-between p-6 hover:bg-[#F7F8FA] transition-colors"
              >
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-[#0F2D5E] rounded-sm flex items-center justify-center">
                    <FileText className="w-5 h-5 text-white" />
                  </div>
                  <h2 className="text-xl font-serif font-bold text-[#0F2D5E]">Manuscript Summary</h2>
                </div>
                {manuscriptSummaryExpanded ? (
                  <ChevronUp className="w-5 h-5 text-gray-600" />
                ) : (
                  <ChevronDown className="w-5 h-5 text-gray-600" />
                )}
              </button>

              {manuscriptSummaryExpanded && (
                <div className="px-6 pb-6 space-y-4 border-t border-[#EAEDF2]">
                  <div className="pt-4">
                    <h3 className="text-2xl font-serif font-bold text-[#0F2D5E] mb-4">
                      {manuscript.title}
                    </h3>

                    <div className="grid grid-cols-2 gap-4 mb-4">
                      <div>
                        <p className="text-sm text-gray-600 mb-1">Author</p>
                        <p className="font-medium text-[#0F2D5E]">{manuscript.authorName}</p>
                      </div>
                      <div>
                        <p className="text-sm text-gray-600 mb-1">Category</p>
                        <p className="font-medium text-[#0F2D5E]">{manuscript.category}</p>
                      </div>
                      <div>
                        <p className="text-sm text-gray-600 mb-1">Submission Date</p>
                        <p className="font-medium text-[#0F2D5E]">
                          {manuscript.submittedAt.toLocaleDateString()}
                        </p>
                      </div>
                      <div>
                        <p className="text-sm text-gray-600 mb-1">Latest Revision</p>
                        <p className="font-medium text-[#0F2D5E]">
                          {manuscript.updatedAt.toLocaleDateString()}
                        </p>
                      </div>
                      <div>
                        <p className="text-sm text-gray-600 mb-1">Version</p>
                        <p className="font-medium text-[#0F2D5E]">v2.0</p>
                      </div>
                      <div>
                        <p className="text-sm text-gray-600 mb-1">Current Stage</p>
                        <span className="px-3 py-1 bg-blue-100 text-blue-800 rounded-sm text-xs font-medium">
                          TWG Endorsement
                        </span>
                      </div>
                    </div>

                    <div>
                      <p className="text-sm text-gray-600 mb-2">Abstract</p>
                      <p className="text-sm text-gray-700 leading-relaxed">{manuscript.abstract}</p>
                    </div>
                  </div>
                </div>
              )}
            </div>

            {/* Revision Compliance Panel */}
            <div className="bg-white rounded-sm border-2 border-[#EAEDF2] shadow-md">
              <button
                onClick={() => setComplianceExpanded(!complianceExpanded)}
                className="w-full flex items-center justify-between p-6 hover:bg-[#F7F8FA] transition-colors"
              >
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-[#0F2D5E] rounded-sm flex items-center justify-center">
                    <FileCheck className="w-5 h-5 text-white" />
                  </div>
                  <h2 className="text-xl font-serif font-bold text-[#0F2D5E]">
                    Revision Compliance
                  </h2>
                </div>
                {complianceExpanded ? (
                  <ChevronUp className="w-5 h-5 text-gray-600" />
                ) : (
                  <ChevronDown className="w-5 h-5 text-gray-600" />
                )}
              </button>

              {complianceExpanded && (
                <div className="px-6 pb-6 border-t border-[#EAEDF2]">
                  <div className="pt-4 space-y-3">
                    <div className="flex items-center justify-between p-3 bg-green-50 rounded-sm border border-green-200">
                      <div className="flex items-center gap-3">
                        <CheckCircle className="w-5 h-5 text-green-600" />
                        <span className="text-sm font-medium text-gray-900">
                          Reviewer concerns addressed
                        </span>
                      </div>
                      <span className="px-2 py-1 bg-green-100 text-green-800 text-xs font-medium rounded">
                        Verified
                      </span>
                    </div>

                    <div className="flex items-center justify-between p-3 bg-green-50 rounded-sm border border-green-200">
                      <div className="flex items-center gap-3">
                        <CheckCircle className="w-5 h-5 text-green-600" />
                        <span className="text-sm font-medium text-gray-900">Revision completeness</span>
                      </div>
                      <span className="px-2 py-1 bg-green-100 text-green-800 text-xs font-medium rounded">
                        Complete
                      </span>
                    </div>

                    <div className="flex items-center justify-between p-3 bg-green-50 rounded-sm border border-green-200">
                      <div className="flex items-center gap-3">
                        <CheckCircle className="w-5 h-5 text-green-600" />
                        <span className="text-sm font-medium text-gray-900">Formatting compliance</span>
                      </div>
                      <span className="px-2 py-1 bg-green-100 text-green-800 text-xs font-medium rounded">
                        Compliant
                      </span>
                    </div>

                    <div className="flex items-center justify-between p-3 bg-green-50 rounded-sm border border-green-200">
                      <div className="flex items-center gap-3">
                        <CheckCircle className="w-5 h-5 text-green-600" />
                        <span className="text-sm font-medium text-gray-900">Ethical compliance</span>
                      </div>
                      <span className="px-2 py-1 bg-green-100 text-green-800 text-xs font-medium rounded">
                        Approved
                      </span>
                    </div>

                    <div className="flex items-center justify-between p-3 bg-green-50 rounded-sm border border-green-200">
                      <div className="flex items-center gap-3">
                        <CheckCircle className="w-5 h-5 text-green-600" />
                        <span className="text-sm font-medium text-gray-900">Citation validation</span>
                      </div>
                      <span className="px-2 py-1 bg-green-100 text-green-800 text-xs font-medium rounded">
                        Validated
                      </span>
                    </div>

                    <div className="flex items-center justify-between p-3 bg-green-50 rounded-sm border border-green-200">
                      <div className="flex items-center gap-3">
                        <CheckCircle className="w-5 h-5 text-green-600" />
                        <span className="text-sm font-medium text-gray-900">
                          Plagiarism verification
                        </span>
                      </div>
                      <span className="px-2 py-1 bg-green-100 text-green-800 text-xs font-medium rounded">
                        Passed
                      </span>
                    </div>
                  </div>
                </div>
              )}
            </div>

            {/* Technical Readiness Assessment */}
            <div className="bg-white rounded-sm border-2 border-[#EAEDF2] shadow-md p-6">
              <div className="flex items-center gap-3 mb-4">
                <div className="w-10 h-10 bg-[#0F2D5E] rounded-sm flex items-center justify-center">
                  <Sparkles className="w-5 h-5 text-white" />
                </div>
                <h2 className="text-xl font-serif font-bold text-[#0F2D5E]">
                  Technical Readiness Assessment
                </h2>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="p-4 bg-green-50 rounded-sm border border-green-200">
                  <div className="flex items-center justify-between mb-2">
                    <p className="text-sm font-medium text-gray-900">Research Quality</p>
                    <CheckCircle className="w-5 h-5 text-green-600" />
                  </div>
                  <div className="w-full bg-green-200 rounded-full h-2 mb-2">
                    <div className="bg-green-600 h-2 rounded-full" style={{ width: '95%' }}></div>
                  </div>
                  <p className="text-xs text-gray-600">Excellent - 95%</p>
                </div>

                <div className="p-4 bg-green-50 rounded-sm border border-green-200">
                  <div className="flex items-center justify-between mb-2">
                    <p className="text-sm font-medium text-gray-900">Technical Quality</p>
                    <CheckCircle className="w-5 h-5 text-green-600" />
                  </div>
                  <div className="w-full bg-green-200 rounded-full h-2 mb-2">
                    <div className="bg-green-600 h-2 rounded-full" style={{ width: '90%' }}></div>
                  </div>
                  <p className="text-xs text-gray-600">Very Good - 90%</p>
                </div>

                <div className="p-4 bg-green-50 rounded-sm border border-green-200">
                  <div className="flex items-center justify-between mb-2">
                    <p className="text-sm font-medium text-gray-900">Publication Readiness</p>
                    <CheckCircle className="w-5 h-5 text-green-600" />
                  </div>
                  <div className="w-full bg-green-200 rounded-full h-2 mb-2">
                    <div className="bg-green-600 h-2 rounded-full" style={{ width: '92%' }}></div>
                  </div>
                  <p className="text-xs text-gray-600">Ready - 92%</p>
                </div>

                <div className="p-4 bg-green-50 rounded-sm border border-green-200">
                  <div className="flex items-center justify-between mb-2">
                    <p className="text-sm font-medium text-gray-900">Data Integrity</p>
                    <CheckCircle className="w-5 h-5 text-green-600" />
                  </div>
                  <div className="w-full bg-green-200 rounded-full h-2 mb-2">
                    <div className="bg-green-600 h-2 rounded-full" style={{ width: '100%' }}></div>
                  </div>
                  <p className="text-xs text-gray-600">Validated - 100%</p>
                </div>

                <div className="p-4 bg-green-50 rounded-sm border border-green-200">
                  <div className="flex items-center justify-between mb-2">
                    <p className="text-sm font-medium text-gray-900">Policy Compliance</p>
                    <CheckCircle className="w-5 h-5 text-green-600" />
                  </div>
                  <div className="w-full bg-green-200 rounded-full h-2 mb-2">
                    <div className="bg-green-600 h-2 rounded-full" style={{ width: '100%' }}></div>
                  </div>
                  <p className="text-xs text-gray-600">Compliant - 100%</p>
                </div>
              </div>
            </div>

            {/* Endorsement Decision Panel */}
            <div className="bg-gradient-to-br from-blue-50 to-indigo-50 rounded-sm border-2 border-blue-200 shadow-md p-6">
              <div className="flex items-center gap-3 mb-4">
                <div className="w-10 h-10 bg-blue-600 rounded-sm flex items-center justify-center">
                  <Flag className="w-5 h-5 text-white" />
                </div>
                <div>
                  <h2 className="text-xl font-serif font-bold text-[#0F2D5E]">
                    Endorsement Decision
                  </h2>
                  <p className="text-sm text-gray-600">Select decision and provide justification</p>
                </div>
              </div>

              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Endorsement Decision <span className="text-red-600">*</span>
                  </label>
                  <select
                    value={endorsementDecision}
                    onChange={(e) =>
                      setEndorsementDecision(
                        e.target.value as TWGEndorsementData['endorsementDecision']
                      )
                    }
                    className="w-full px-4 py-2 border border-blue-300 rounded-sm focus:outline-none focus:ring-2 focus:ring-blue-600 bg-white"
                  >
                    <option value="">Select endorsement decision...</option>
                    <option value="endorse_to_twg">Endorse to TWG</option>
                    <option value="endorse_with_concerns">Endorse with Technical Concerns</option>
                    <option value="return_for_revision">Return for Additional Revision</option>
                    <option value="return_to_reviewer">Return to Reviewer</option>
                    <option value="hold_endorsement">Hold Endorsement</option>
                    <option value="reject_endorsement">Reject Endorsement</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Editorial Justification <span className="text-red-600">*</span>
                  </label>
                  <textarea
                    value={editorialJustification}
                    onChange={(e) => setEditorialJustification(e.target.value)}
                    rows={4}
                    className="w-full px-4 py-3 border border-blue-300 rounded-sm focus:outline-none focus:ring-2 focus:ring-blue-600 font-serif resize-none"
                    placeholder="Provide detailed justification for your endorsement decision..."
                  />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Technical Concern Notes
                    </label>
                    <textarea
                      value={technicalConcernNotes}
                      onChange={(e) => setTechnicalConcernNotes(e.target.value)}
                      rows={3}
                      className="w-full px-4 py-3 border border-blue-300 rounded-sm focus:outline-none focus:ring-2 focus:ring-blue-600 font-serif resize-none"
                      placeholder="Note any technical concerns..."
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Publication Readiness Notes
                    </label>
                    <textarea
                      value={publicationReadinessNotes}
                      onChange={(e) => setPublicationReadinessNotes(e.target.value)}
                      rows={3}
                      className="w-full px-4 py-3 border border-blue-300 rounded-sm focus:outline-none focus:ring-2 focus:ring-blue-600 font-serif resize-none"
                      placeholder="Assessment of publication readiness..."
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Risk Assessment Notes
                  </label>
                  <textarea
                    value={riskAssessmentNotes}
                    onChange={(e) => setRiskAssessmentNotes(e.target.value)}
                    rows={3}
                    className="w-full px-4 py-3 border border-blue-300 rounded-sm focus:outline-none focus:ring-2 focus:ring-blue-600 font-serif resize-none"
                    placeholder="Identify any risks or concerns..."
                  />
                </div>
              </div>
            </div>

            {/* TWG Assignment Panel */}
            {(endorsementDecision === 'endorse_to_twg' ||
              endorsementDecision === 'endorse_with_concerns') && (
              <div className="bg-white rounded-sm border-2 border-[#EAEDF2] shadow-md p-6">
                <div className="flex items-center gap-3 mb-4">
                  <div className="w-10 h-10 bg-[#0F2D5E] rounded-sm flex items-center justify-center">
                    <Users className="w-5 h-5 text-white" />
                  </div>
                  <div>
                    <h2 className="text-xl font-serif font-bold text-[#0F2D5E]">TWG Assignment</h2>
                    <p className="text-sm text-gray-600">Select TWG members for evaluation</p>
                  </div>
                </div>

                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead className="bg-[#F7F8FA] border-b-2 border-[#EAEDF2]">
                      <tr>
                        <th className="px-4 py-3 text-left text-xs font-medium text-gray-700 uppercase">
                          Assign
                        </th>
                        <th className="px-4 py-3 text-left text-xs font-medium text-gray-700 uppercase">
                          TWG Member
                        </th>
                        <th className="px-4 py-3 text-left text-xs font-medium text-gray-700 uppercase">
                          Expertise
                        </th>
                        <th className="px-4 py-3 text-left text-xs font-medium text-gray-700 uppercase">
                          Availability
                        </th>
                        <th className="px-4 py-3 text-left text-xs font-medium text-gray-700 uppercase">
                          Workload
                        </th>
                        <th className="px-4 py-3 text-left text-xs font-medium text-gray-700 uppercase">
                          Match
                        </th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-[#d1c7b3]">
                      {twgMembers.map((member) => (
                        <tr key={member.id} className="hover:bg-[#F7F8FA] transition-colors">
                          <td className="px-4 py-4">
                            <input
                              type="checkbox"
                              checked={assignedTWGMembers.includes(member.id)}
                              onChange={() => toggleTWGMember(member.id)}
                              className="w-5 h-5 cursor-pointer"
                            />
                          </td>
                          <td className="px-4 py-4">
                            <div className="flex items-center gap-2">
                              <User className="w-4 h-4 text-gray-600" />
                              <span className="text-sm font-medium text-gray-900">{member.name}</span>
                            </div>
                          </td>
                          <td className="px-4 py-4">
                            <p className="text-sm text-gray-600">{member.expertise}</p>
                          </td>
                          <td className="px-4 py-4">
                            <span
                              className={`px-2 py-1 text-xs font-medium rounded ${
                                member.availability === 'available'
                                  ? 'bg-green-100 text-green-800'
                                  : member.availability === 'limited'
                                  ? 'bg-yellow-100 text-yellow-800'
                                  : 'bg-red-100 text-red-800'
                              }`}
                            >
                              {member.availability}
                            </span>
                          </td>
                          <td className="px-4 py-4">
                            <div className="flex items-center gap-2">
                              <div className="w-16 bg-gray-200 rounded-full h-2">
                                <div
                                  className={`h-2 rounded-full ${
                                    member.currentWorkload <= 1
                                      ? 'bg-green-600'
                                      : member.currentWorkload === 2
                                      ? 'bg-yellow-600'
                                      : 'bg-red-600'
                                  }`}
                                  style={{ width: `${(member.currentWorkload / 5) * 100}%` }}
                                ></div>
                              </div>
                              <span className="text-xs text-gray-600">{member.currentWorkload}</span>
                            </div>
                          </td>
                          <td className="px-4 py-4">
                            <div className="flex items-center gap-2">
                              <Sparkles className="w-4 h-4 text-purple-600" />
                              <span className="text-sm font-semibold text-purple-600">
                                {member.matchScore}%
                              </span>
                            </div>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>

                {assignedTWGMembers.length > 0 && (
                  <div className="mt-4 p-3 bg-blue-50 rounded-sm border border-blue-200">
                    <p className="text-sm text-blue-900">
                      <span className="font-semibold">{assignedTWGMembers.length}</span> TWG{' '}
                      {assignedTWGMembers.length === 1 ? 'member' : 'members'} selected for
                      evaluation
                    </p>
                  </div>
                )}
              </div>
            )}

            {/* TWG Instructions Panel */}
            {(endorsementDecision === 'endorse_to_twg' ||
              endorsementDecision === 'endorse_with_concerns') && (
              <div className="bg-white rounded-sm border-2 border-[#EAEDF2] shadow-md p-6">
                <div className="flex items-center gap-3 mb-4">
                  <div className="w-10 h-10 bg-[#0F2D5E] rounded-sm flex items-center justify-center">
                    <BookOpen className="w-5 h-5 text-white" />
                  </div>
                  <h2 className="text-xl font-serif font-bold text-[#0F2D5E]">TWG Instructions</h2>
                </div>

                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Evaluation Instructions
                    </label>
                    <textarea
                      value={evaluationInstructions}
                      onChange={(e) => setEvaluationInstructions(e.target.value)}
                      rows={3}
                      className="w-full px-4 py-3 border border-[#EAEDF2] rounded-sm focus:outline-none focus:ring-2 focus:ring-[#1a1f2e] font-serif resize-none"
                      placeholder="Provide specific evaluation instructions for TWG members..."
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Technical Focus Areas
                    </label>
                    <textarea
                      value={technicalFocusAreas}
                      onChange={(e) => setTechnicalFocusAreas(e.target.value)}
                      rows={3}
                      className="w-full px-4 py-3 border border-[#EAEDF2] rounded-sm focus:outline-none focus:ring-2 focus:ring-[#1a1f2e] font-serif resize-none"
                      placeholder="Specify technical areas that require focused evaluation..."
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Validation Requirements
                    </label>
                    <textarea
                      value={validationRequirements}
                      onChange={(e) => setValidationRequirements(e.target.value)}
                      rows={3}
                      className="w-full px-4 py-3 border border-[#EAEDF2] rounded-sm focus:outline-none focus:ring-2 focus:ring-[#1a1f2e] font-serif resize-none"
                      placeholder="List specific validation requirements..."
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Reviewer Concern References
                    </label>
                    <textarea
                      value={reviewerConcernReferences}
                      onChange={(e) => setReviewerConcernReferences(e.target.value)}
                      rows={3}
                      className="w-full px-4 py-3 border border-[#EAEDF2] rounded-sm focus:outline-none focus:ring-2 focus:ring-[#1a1f2e] font-serif resize-none"
                      placeholder="Reference specific reviewer concerns for TWG attention..."
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Confidential Editorial Notes
                    </label>
                    <textarea
                      value={confidentialNotes}
                      onChange={(e) => setConfidentialNotes(e.target.value)}
                      rows={3}
                      className="w-full px-4 py-3 border border-[#EAEDF2] rounded-sm focus:outline-none focus:ring-2 focus:ring-[#1a1f2e] font-serif resize-none"
                      placeholder="Internal notes for TWG (not shared with author)..."
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      TWG Evaluation Deadline
                    </label>
                    <input
                      type="date"
                      value={deadline}
                      onChange={(e) => setDeadline(e.target.value)}
                      className="w-full px-4 py-2 border border-[#EAEDF2] rounded-sm focus:outline-none focus:ring-2 focus:ring-[#1a1f2e] bg-white"
                    />
                  </div>
                </div>
              </div>
            )}

            {/* Review History Panel */}
            <div className="bg-white rounded-sm border-2 border-[#EAEDF2] shadow-md">
              <button
                onClick={() => setReviewHistoryExpanded(!reviewHistoryExpanded)}
                className="w-full flex items-center justify-between p-6 hover:bg-[#F7F8FA] transition-colors"
              >
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-[#0F2D5E] rounded-sm flex items-center justify-center">
                    <Activity className="w-5 h-5 text-white" />
                  </div>
                  <h2 className="text-xl font-serif font-bold text-[#0F2D5E]">Review History</h2>
                </div>
                {reviewHistoryExpanded ? (
                  <ChevronUp className="w-5 h-5 text-gray-600" />
                ) : (
                  <ChevronDown className="w-5 h-5 text-gray-600" />
                )}
              </button>

              {reviewHistoryExpanded && (
                <div className="px-6 pb-6 border-t border-[#EAEDF2]">
                  <div className="pt-4 space-y-3">
                    {completedReviews.length > 0 ? (
                      completedReviews.map((review) => (
                        <div
                          key={review.id}
                          className="p-4 bg-[#F7F8FA] rounded-sm border border-[#EAEDF2]"
                        >
                          <div className="flex items-start justify-between mb-2">
                            <div>
                              <h4 className="font-semibold text-[#0F2D5E]">{review.reviewerName}</h4>
                              <p className="text-xs text-gray-600">
                                Submitted {review.submittedAt?.toLocaleDateString()}
                              </p>
                            </div>
                            <span
                              className={`px-3 py-1 rounded-sm text-xs font-medium ${
                                review.decision === 'accept' ||
                                review.decision === 'accept_with_minor_changes'
                                  ? 'bg-green-100 text-green-800'
                                  : review.decision === 'minor_revision'
                                  ? 'bg-yellow-100 text-yellow-800'
                                  : 'bg-red-100 text-red-800'
                              }`}
                            >
                              {review.decision?.replace(/_/g, ' ').toUpperCase()}
                            </span>
                          </div>
                          <p className="text-sm text-gray-700">{review.comments}</p>
                        </div>
                      ))
                    ) : (
                      <p className="text-sm text-gray-600">No reviews available</p>
                    )}
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Workflow Status Panel */}
            <div className="bg-white rounded-sm border-2 border-[#EAEDF2] shadow-md p-6 sticky top-8">
              <h3 className="text-lg font-serif font-bold text-[#0F2D5E] mb-4">
                Workflow Status
              </h3>

              <div className="space-y-4 mb-6">
                <div>
                  <p className="text-xs text-gray-600 mb-1">Current Stage</p>
                  <span className="px-3 py-1 bg-blue-100 text-blue-800 rounded-sm text-xs font-medium">
                    TWG Endorsement
                  </span>
                </div>

                <div>
                  <p className="text-xs text-gray-600 mb-1">Next Stage</p>
                  <span className="px-3 py-1 bg-gray-100 text-gray-700 rounded-sm text-xs font-medium">
                    TWG Technical Evaluation
                  </span>
                </div>

                <div>
                  <p className="text-xs text-gray-600 mb-1">Delay Risk</p>
                  <span className="px-3 py-1 bg-green-100 text-green-800 rounded-sm text-xs font-medium">
                    Low Risk
                  </span>
                </div>

                <div>
                  <p className="text-xs text-gray-600 mb-1">Last Updated</p>
                  <p className="text-sm text-gray-900">{new Date().toLocaleTimeString()}</p>
                </div>
              </div>

              <div className="pt-4 border-t border-[#EAEDF2]">
                <p className="text-xs text-gray-600 mb-3">Workflow Progression</p>
                <div className="space-y-2 text-xs">
                  <div className="flex items-center gap-2">
                    <CheckCircle className="w-4 h-4 text-green-600" />
                    <span className="text-gray-700">Submission</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <CheckCircle className="w-4 h-4 text-green-600" />
                    <span className="text-gray-700">Review</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <CheckCircle className="w-4 h-4 text-green-600" />
                    <span className="text-gray-700">Revision</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <CheckCircle className="w-4 h-4 text-green-600" />
                    <span className="text-gray-700">Editorial Recommendation</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="w-4 h-4 rounded-full border-2 border-blue-600 flex items-center justify-center">
                      <div className="w-2 h-2 rounded-full bg-blue-600"></div>
                    </div>
                    <span className="text-blue-700 font-medium">TWG Endorsement</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="w-4 h-4 rounded-full border-2 border-gray-300"></div>
                    <span className="text-gray-400">Final Decision</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Alerts Panel */}
            {(!endorsementDecision ||
              (endorsementDecision === 'endorse_to_twg' && assignedTWGMembers.length === 0)) && (
              <div className="bg-yellow-50 rounded-sm border-2 border-yellow-200 shadow-md p-6">
                <div className="flex items-start gap-3">
                  <AlertTriangle className="w-5 h-5 text-yellow-600 mt-0.5" />
                  <div>
                    <h4 className="font-semibold text-yellow-900 mb-2">Action Required</h4>
                    <ul className="text-sm text-yellow-800 space-y-1">
                      {!endorsementDecision && <li>• Select endorsement decision</li>}
                      {endorsementDecision === 'endorse_to_twg' &&
                        assignedTWGMembers.length === 0 && <li>• Assign TWG members</li>}
                    </ul>
                  </div>
                </div>
              </div>
            )}

            {/* Activity Log */}
            <div className="bg-white rounded-sm border-2 border-[#EAEDF2] shadow-md p-6">
              <h3 className="text-lg font-serif font-bold text-[#0F2D5E] mb-4">Activity Log</h3>
              <div className="space-y-3 text-xs">
                <div className="pb-3 border-b border-[#EAEDF2]">
                  <p className="text-gray-900 font-medium">Editorial recommendation completed</p>
                  <p className="text-gray-500">{new Date().toLocaleDateString()}</p>
                </div>
                <div className="pb-3 border-b border-[#EAEDF2]">
                  <p className="text-gray-900 font-medium">Revision submitted by author</p>
                  <p className="text-gray-500">
                    {manuscript.updatedAt.toLocaleDateString()}
                  </p>
                </div>
                <div className="pb-3 border-b border-[#EAEDF2]">
                  <p className="text-gray-900 font-medium">Reviews completed</p>
                  <p className="text-gray-500">
                    {completedReviews[0]?.submittedAt?.toLocaleDateString()}
                  </p>
                </div>
                <div>
                  <p className="text-gray-900 font-medium">Manuscript submitted</p>
                  <p className="text-gray-500">
                    {manuscript.submittedAt.toLocaleDateString()}
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom Action Bar */}
        <div className="fixed bottom-0 left-0 right-0 bg-white border-t-2 border-[#EAEDF2] shadow-lg p-4 z-50">
          <div className="max-w-7xl mx-auto flex items-center justify-between gap-4">
            <button
              onClick={onBack}
              className="px-6 py-3 border-2 border-[#EAEDF2] text-[#0F2D5E] rounded-sm hover:bg-[#F7F8FA] transition-colors font-medium"
            >
              Cancel
            </button>

            <div className="flex items-center gap-3">
              <button className="px-6 py-3 border-2 border-[#EAEDF2] text-[#0F2D5E] rounded-sm hover:bg-[#F7F8FA] transition-colors font-medium flex items-center gap-2">
                <Save className="w-4 h-4" />
                Save Draft
              </button>
              <button className="px-6 py-3 border-2 border-[#EAEDF2] text-[#0F2D5E] rounded-sm hover:bg-[#F7F8FA] transition-colors font-medium flex items-center gap-2">
                <Eye className="w-4 h-4" />
                Preview
              </button>
              <button
                onClick={handleSubmit}
                className="px-8 py-3 bg-[#0F2D5E] text-white rounded-sm hover:bg-[#1A4A8A] transition-colors font-medium flex items-center gap-2"
              >
                <Send className="w-4 h-4" />
                Confirm Endorsement
              </button>
            </div>
          </div>
        </div>

        {/* Bottom padding to prevent content from being hidden behind fixed bar */}
        <div className="h-24"></div>
      </div>
    </div>
  );
}
