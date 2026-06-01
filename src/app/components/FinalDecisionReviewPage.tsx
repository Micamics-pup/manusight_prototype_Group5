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
  TrendingUp,
  Target,
  Lock,
  Sparkles,
  Database,
  Activity,
  Flag,
  Award,
} from 'lucide-react';
import type { Manuscript, Review } from '../types';

export interface FinalDecisionData {
  decision: 'accept_for_publication' | 'accept_with_final_corrections' | 'final_minor_revision' | 'return_to_editor' | 'reject';
  justification: string;
  executiveSummary: string;
  riskAndImpactNotes: string;
  publicationApproval: {
    readinessLevel: string;
    journalFit: string;
    researchContribution: string;
    impactLevel: string;
  };
  policyCompliance: {
    ethicalCompliance: boolean;
    plagiarismCheck: boolean;
    conflictOfInterest: boolean;
    dataIntegrity: boolean;
    peerReviewCompleteness: boolean;
    journalPolicyCompliance: boolean;
  };
  validation: {
    reviewerConcernsAddressed: boolean;
    revisionCompleteness: boolean;
    ethicalCompliance: boolean;
    plagiarismStatus: boolean;
    formattingCompliance: boolean;
    policyAdherence: boolean;
  };
  publicationTimeline?: {
    estimatedDate: Date;
    issueVolume: string;
    priority: string;
  };
}

interface FinalDecisionReviewPageProps {
  manuscript: Manuscript;
  reviews: Review[];
  onBack: () => void;
  onSubmitDecision: (decisionData: FinalDecisionData) => void;
}

export function FinalDecisionReviewPage({
  manuscript,
  reviews,
  onBack,
  onSubmitDecision,
}: FinalDecisionReviewPageProps) {
  const [manuscriptInfoExpanded, setManuscriptInfoExpanded] = useState(true);
  const [reviewHistoryExpanded, setReviewHistoryExpanded] = useState(false);
  const [editorialSummaryExpanded, setEditorialSummaryExpanded] = useState(true);
  const [comparisonExpanded, setComparisonExpanded] = useState(false);

  const [decision, setDecision] = useState<FinalDecisionData['decision'] | ''>('');
  const [justification, setJustification] = useState('');
  const [executiveSummary, setExecutiveSummary] = useState('');
  const [riskAndImpactNotes, setRiskAndImpactNotes] = useState('');

  const [readinessLevel, setReadinessLevel] = useState('');
  const [journalFit, setJournalFit] = useState('');
  const [researchContribution, setResearchContribution] = useState('');
  const [impactLevel, setImpactLevel] = useState('');

  const [ethicalCompliance, setEthicalCompliance] = useState(false);
  const [plagiarismCheck, setPlagiarismCheck] = useState(false);
  const [conflictOfInterest, setConflictOfInterest] = useState(false);
  const [dataIntegrity, setDataIntegrity] = useState(false);
  const [peerReviewCompleteness, setPeerReviewCompleteness] = useState(false);
  const [journalPolicyCompliance, setJournalPolicyCompliance] = useState(false);

  const [reviewerConcernsAddressed, setReviewerConcernsAddressed] = useState(false);
  const [revisionCompleteness, setRevisionCompleteness] = useState(false);
  const [ethicalValidation, setEthicalValidation] = useState(false);
  const [plagiarismValidation, setPlagiarismValidation] = useState(false);
  const [formattingCompliance, setFormattingCompliance] = useState(false);
  const [policyAdherence, setPolicyAdherence] = useState(false);

  const [estimatedDate, setEstimatedDate] = useState('');
  const [issueVolume, setIssueVolume] = useState('');
  const [priority, setPriority] = useState('');

  const [showConfirmModal, setShowConfirmModal] = useState(false);
  const [showSuccessScreen, setShowSuccessScreen] = useState(false);
  const [submittedDecision, setSubmittedDecision] = useState<FinalDecisionData | null>(null);

  // Auto-save draft every 30 seconds
  useEffect(() => {
    const interval = setInterval(() => {
      if (decision || justification || executiveSummary) {
        const draftKey = `final-decision-draft-${manuscript.id}`;
        localStorage.setItem(
          draftKey,
          JSON.stringify({
            decision,
            justification,
            executiveSummary,
            riskAndImpactNotes,
            readinessLevel,
            journalFit,
            researchContribution,
            impactLevel,
            savedAt: new Date().toISOString(),
          })
        );
      }
    }, 30000);

    return () => clearInterval(interval);
  }, [
    decision,
    justification,
    executiveSummary,
    riskAndImpactNotes,
    readinessLevel,
    journalFit,
    researchContribution,
    impactLevel,
    manuscript.id,
  ]);

  // Load draft on mount
  useEffect(() => {
    const draftKey = `final-decision-draft-${manuscript.id}`;
    const savedDraft = localStorage.getItem(draftKey);
    if (savedDraft) {
      const draft = JSON.parse(savedDraft);
      setDecision(draft.decision || '');
      setJustification(draft.justification || '');
      setExecutiveSummary(draft.executiveSummary || '');
      setRiskAndImpactNotes(draft.riskAndImpactNotes || '');
      setReadinessLevel(draft.readinessLevel || '');
      setJournalFit(draft.journalFit || '');
      setResearchContribution(draft.researchContribution || '');
      setImpactLevel(draft.impactLevel || '');
    }
  }, [manuscript.id]);

  const handleSubmit = () => {
    if (!decision || !justification || !executiveSummary) {
      alert('Please complete all required fields');
      return;
    }

    if (!readinessLevel || !journalFit || !researchContribution || !impactLevel) {
      alert('Please complete all publication approval fields');
      return;
    }

    if (
      decision === 'accept_for_publication' &&
      (!ethicalCompliance ||
        !plagiarismCheck ||
        !conflictOfInterest ||
        !dataIntegrity ||
        !peerReviewCompleteness ||
        !journalPolicyCompliance)
    ) {
      alert('All policy compliance checks must be completed for acceptance');
      return;
    }

    if (
      decision === 'accept_for_publication' &&
      (!reviewerConcernsAddressed ||
        !revisionCompleteness ||
        !ethicalValidation ||
        !plagiarismValidation ||
        !formattingCompliance ||
        !policyAdherence)
    ) {
      alert('All validation checks must be completed for acceptance');
      return;
    }

    setShowConfirmModal(true);
  };

  const confirmSubmit = () => {
    const decisionData: FinalDecisionData = {
      decision: decision as FinalDecisionData['decision'],
      justification,
      executiveSummary,
      riskAndImpactNotes,
      publicationApproval: {
        readinessLevel,
        journalFit,
        researchContribution,
        impactLevel,
      },
      policyCompliance: {
        ethicalCompliance,
        plagiarismCheck,
        conflictOfInterest,
        dataIntegrity,
        peerReviewCompleteness,
        journalPolicyCompliance,
      },
      validation: {
        reviewerConcernsAddressed,
        revisionCompleteness,
        ethicalCompliance: ethicalValidation,
        plagiarismStatus: plagiarismValidation,
        formattingCompliance,
        policyAdherence,
      },
    };

    if (decision === 'accept_for_publication' && estimatedDate && issueVolume && priority) {
      decisionData.publicationTimeline = {
        estimatedDate: new Date(estimatedDate),
        issueVolume,
        priority,
      };
    }

    setSubmittedDecision(decisionData);
    setShowConfirmModal(false);
    setShowSuccessScreen(true);

    // Clear draft
    const draftKey = `final-decision-draft-${manuscript.id}`;
    localStorage.removeItem(draftKey);

    // Call parent callback after delay
    setTimeout(() => {
      onSubmitDecision(decisionData);
    }, 3000);
  };

  if (showSuccessScreen && submittedDecision) {
    const decisionLabels = {
      accept_for_publication: 'Accept for Publication',
      accept_with_final_corrections: 'Accept with Minor Final Corrections',
      final_minor_revision: 'Request Final Minor Revision',
      return_to_editor: 'Return to Editor for Re-evaluation',
      reject: 'Reject Manuscript',
    };

    const decisionColors = {
      accept_for_publication: 'bg-green-600',
      accept_with_final_corrections: 'bg-blue-600',
      final_minor_revision: 'bg-yellow-600',
      return_to_editor: 'bg-purple-600',
      reject: 'bg-red-600',
    };

    return (
      <div className="min-h-screen bg-[#F7F8FA] p-8">
        <div className="max-w-4xl mx-auto">
          <div className="bg-white rounded-sm border-2 border-[#EAEDF2] shadow-lg p-12 text-center">
            <div
              className={`w-20 h-20 ${decisionColors[submittedDecision.decision]} rounded-full flex items-center justify-center mx-auto mb-6`}
            >
              {submittedDecision.decision === 'reject' ? (
                <XCircle className="w-12 h-12 text-white" />
              ) : submittedDecision.decision === 'accept_for_publication' ? (
                <Award className="w-12 h-12 text-white" />
              ) : (
                <CheckCircle className="w-12 h-12 text-white" />
              )}
            </div>

            <h2 className="text-3xl font-serif font-bold text-[#0F2D5E] mb-4">
              Final Decision Submitted
            </h2>

            <p className="text-xl text-gray-700 mb-8">
              <span className="font-semibold">Decision:</span>{' '}
              {decisionLabels[submittedDecision.decision]}
            </p>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-8 text-left">
              <div className="bg-[#F7F8FA] rounded-sm p-4 border border-[#EAEDF2]">
                <div className="flex items-start gap-3">
                  <Lock className="w-5 h-5 text-[#0F2D5E] mt-0.5" />
                  <div>
                    <h3 className="font-semibold text-[#0F2D5E] mb-1">Manuscript Locked</h3>
                    <p className="text-sm text-gray-600">
                      Record finalized and locked for editing
                    </p>
                  </div>
                </div>
              </div>

              <div className="bg-[#F7F8FA] rounded-sm p-4 border border-[#EAEDF2]">
                <div className="flex items-start gap-3">
                  <Users className="w-5 h-5 text-[#0F2D5E] mt-0.5" />
                  <div>
                    <h3 className="font-semibold text-[#0F2D5E] mb-1">Notifications Sent</h3>
                    <p className="text-sm text-gray-600">Author, editors, and reviewers notified</p>
                  </div>
                </div>
              </div>

              <div className="bg-[#F7F8FA] rounded-sm p-4 border border-[#EAEDF2]">
                <div className="flex items-start gap-3">
                  <Activity className="w-5 h-5 text-[#0F2D5E] mt-0.5" />
                  <div>
                    <h3 className="font-semibold text-[#0F2D5E] mb-1">Workflow Updated</h3>
                    <p className="text-sm text-gray-600">
                      Status and stage transitioned automatically
                    </p>
                  </div>
                </div>
              </div>

              <div className="bg-[#F7F8FA] rounded-sm p-4 border border-[#EAEDF2]">
                <div className="flex items-start gap-3">
                  <Database className="w-5 h-5 text-[#0F2D5E] mt-0.5" />
                  <div>
                    <h3 className="font-semibold text-[#0F2D5E] mb-1">Audit Trail Created</h3>
                    <p className="text-sm text-gray-600">Complete decision history archived</p>
                  </div>
                </div>
              </div>
            </div>

            {submittedDecision.decision === 'accept_for_publication' &&
              submittedDecision.publicationTimeline && (
                <div className="bg-green-50 border-2 border-green-200 rounded-sm p-6 mb-6">
                  <div className="flex items-center gap-3 mb-3">
                    <Sparkles className="w-6 h-6 text-green-600" />
                    <h3 className="text-lg font-semibold text-green-900">
                      Production Pipeline Activated
                    </h3>
                  </div>
                  <p className="text-sm text-green-800 mb-2">
                    Manuscript moved to production queue
                  </p>
                  <p className="text-sm text-green-700">
                    Estimated Publication: {issueVolume} •{' '}
                    {new Date(submittedDecision.publicationTimeline.estimatedDate).toLocaleDateString()}
                  </p>
                </div>
              )}

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
  const avgScore = completedReviews.length > 0 ? 4.2 : 0;
  const totalReviews = completedReviews.length;
  const avgReviewTime = completedReviews.length > 0 ? 14 : 0;
  const revisionRounds = 2;
  const daysInReview = Math.floor(
    (new Date().getTime() - manuscript.submittedAt.getTime()) / (1000 * 60 * 60 * 24)
  );

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
                  <Shield className="w-7 h-7 text-white" />
                </div>
                <div>
                  <h1 className="text-3xl font-serif font-bold">Final Decision Review</h1>
                  <p className="text-gray-300 text-sm mt-1">Editor-in-Chief Approval</p>
                </div>
              </div>
              <div className="flex items-center gap-3 mt-3 text-sm">
                <span className="text-gray-400">Manuscript ID:</span>
                <span className="font-mono bg-white/10 px-2 py-1 rounded">{manuscript.id}</span>
                <span className="px-3 py-1 bg-purple-600 rounded-sm text-xs font-medium">
                  Final Review Stage
                </span>
                <span className="px-3 py-1 bg-yellow-600 rounded-sm text-xs font-medium">
                  Version 2.0
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
                <span className="text-sm">Download All</span>
              </button>
              <button className="px-4 py-2 bg-white/10 hover:bg-white/20 rounded-sm transition-colors flex items-center gap-2">
                <FileCheck className="w-4 h-4" />
                <span className="text-sm">Export Report</span>
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
                onClick={() => setManuscriptInfoExpanded(!manuscriptInfoExpanded)}
                className="w-full flex items-center justify-between p-6 hover:bg-[#F7F8FA] transition-colors"
              >
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-[#0F2D5E] rounded-sm flex items-center justify-center">
                    <FileText className="w-5 h-5 text-white" />
                  </div>
                  <h2 className="text-xl font-serif font-bold text-[#0F2D5E]">
                    Manuscript Summary
                  </h2>
                </div>
                {manuscriptInfoExpanded ? (
                  <ChevronUp className="w-5 h-5 text-gray-600" />
                ) : (
                  <ChevronDown className="w-5 h-5 text-gray-600" />
                )}
              </button>

              {manuscriptInfoExpanded && (
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
                        <p className="text-sm text-gray-600 mb-1">Current Status</p>
                        <span className="px-3 py-1 bg-purple-100 text-purple-800 rounded-sm text-xs font-medium">
                          {manuscript.status}
                        </span>
                      </div>
                    </div>

                    <div>
                      <p className="text-sm text-gray-600 mb-2">Abstract</p>
                      <p className="text-sm text-gray-700 leading-relaxed">{manuscript.abstract}</p>
                    </div>

                    <div className="mt-4 pt-4 border-t border-[#EAEDF2]">
                      <p className="text-sm text-gray-600 mb-2">Keywords</p>
                      <div className="flex flex-wrap gap-2">
                        <span className="px-3 py-1 bg-gray-100 text-gray-700 rounded-sm text-xs">
                          Blockchain
                        </span>
                        <span className="px-3 py-1 bg-gray-100 text-gray-700 rounded-sm text-xs">
                          Supply Chain
                        </span>
                        <span className="px-3 py-1 bg-gray-100 text-gray-700 rounded-sm text-xs">
                          Technology
                        </span>
                        <span className="px-3 py-1 bg-gray-100 text-gray-700 rounded-sm text-xs">
                          Transparency
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </div>

            {/* Review History */}
            <div className="bg-white rounded-sm border-2 border-[#EAEDF2] shadow-md">
              <button
                onClick={() => setReviewHistoryExpanded(!reviewHistoryExpanded)}
                className="w-full flex items-center justify-between p-6 hover:bg-[#F7F8FA] transition-colors"
              >
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-[#0F2D5E] rounded-sm flex items-center justify-center">
                    <Activity className="w-5 h-5 text-white" />
                  </div>
                  <h2 className="text-xl font-serif font-bold text-[#0F2D5E]">
                    Complete Review History
                  </h2>
                </div>
                {reviewHistoryExpanded ? (
                  <ChevronUp className="w-5 h-5 text-gray-600" />
                ) : (
                  <ChevronDown className="w-5 h-5 text-gray-600" />
                )}
              </button>

              {reviewHistoryExpanded && (
                <div className="px-6 pb-6 space-y-4 border-t border-[#EAEDF2]">
                  <div className="pt-4 space-y-3">
                    {completedReviews.length > 0 ? (
                      completedReviews.map((review) => (
                        <div
                          key={review.id}
                          className="p-4 bg-[#F7F8FA] rounded-sm border border-[#EAEDF2]"
                        >
                          <div className="flex items-start justify-between mb-3">
                            <div>
                              <h4 className="font-semibold text-[#0F2D5E]">{review.reviewerName}</h4>
                              <p className="text-xs text-gray-600">
                                Submitted {review.submittedAt?.toLocaleDateString()}
                              </p>
                            </div>
                            <span
                              className={`px-3 py-1 rounded-sm text-xs font-medium ${
                                review.decision === 'accept' || review.decision === 'accept_with_minor_changes'
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

            {/* Editorial Recommendation Summary */}
            <div className="bg-white rounded-sm border-2 border-[#EAEDF2] shadow-md">
              <button
                onClick={() => setEditorialSummaryExpanded(!editorialSummaryExpanded)}
                className="w-full flex items-center justify-between p-6 hover:bg-[#F7F8FA] transition-colors"
              >
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-[#0F2D5E] rounded-sm flex items-center justify-center">
                    <Target className="w-5 h-5 text-white" />
                  </div>
                  <h2 className="text-xl font-serif font-bold text-[#0F2D5E]">
                    Editorial Recommendation Summary
                  </h2>
                </div>
                {editorialSummaryExpanded ? (
                  <ChevronUp className="w-5 h-5 text-gray-600" />
                ) : (
                  <ChevronDown className="w-5 h-5 text-gray-600" />
                )}
              </button>

              {editorialSummaryExpanded && (
                <div className="px-6 pb-6 space-y-4 border-t border-[#EAEDF2]">
                  <div className="pt-4">
                    <div className="bg-green-50 border-2 border-green-200 rounded-sm p-4 mb-4">
                      <div className="flex items-center gap-2 mb-2">
                        <Award className="w-5 h-5 text-green-600" />
                        <h4 className="font-semibold text-green-900">
                          Editor Recommendation: Accept for Publication
                        </h4>
                      </div>
                      <p className="text-sm text-green-800">
                        The manuscript has undergone rigorous peer review and revision. All reviewer
                        concerns have been adequately addressed. The research quality is excellent
                        and the contribution is significant.
                      </p>
                    </div>

                    <div className="grid grid-cols-2 gap-4 mb-4">
                      <div className="p-3 bg-[#F7F8FA] rounded-sm border border-[#EAEDF2]">
                        <p className="text-xs text-gray-600 mb-1">Publication Readiness</p>
                        <p className="font-semibold text-[#0F2D5E]">Excellent</p>
                      </div>
                      <div className="p-3 bg-[#F7F8FA] rounded-sm border border-[#EAEDF2]">
                        <p className="text-xs text-gray-600 mb-1">Journal Fit</p>
                        <p className="font-semibold text-[#0F2D5E]">Perfect Alignment</p>
                      </div>
                      <div className="p-3 bg-[#F7F8FA] rounded-sm border border-[#EAEDF2]">
                        <p className="text-xs text-gray-600 mb-1">Research Contribution</p>
                        <p className="font-semibold text-[#0F2D5E]">High Impact</p>
                      </div>
                      <div className="p-3 bg-[#F7F8FA] rounded-sm border border-[#EAEDF2]">
                        <p className="text-xs text-gray-600 mb-1">Priority Level</p>
                        <p className="font-semibold text-[#0F2D5E]">High</p>
                      </div>
                    </div>

                    <div className="space-y-3">
                      <div>
                        <p className="text-sm font-medium text-gray-700 mb-1">Strengths</p>
                        <ul className="text-sm text-gray-600 space-y-1 ml-4 list-disc">
                          <li>Novel approach to blockchain implementation</li>
                          <li>Comprehensive literature review</li>
                          <li>Strong methodology and data analysis</li>
                          <li>Practical applications clearly demonstrated</li>
                        </ul>
                      </div>
                      <div>
                        <p className="text-sm font-medium text-gray-700 mb-1">
                          Compliance Status
                        </p>
                        <div className="flex flex-wrap gap-2">
                          <span className="px-2 py-1 bg-green-100 text-green-800 rounded text-xs flex items-center gap-1">
                            <CheckCircle className="w-3 h-3" />
                            Ethical Compliance
                          </span>
                          <span className="px-2 py-1 bg-green-100 text-green-800 rounded text-xs flex items-center gap-1">
                            <CheckCircle className="w-3 h-3" />
                            Plagiarism Check Passed
                          </span>
                          <span className="px-2 py-1 bg-green-100 text-green-800 rounded text-xs flex items-center gap-1">
                            <CheckCircle className="w-3 h-3" />
                            Formatting Compliant
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </div>

            {/* Validation Checklist */}
            <div className="bg-white rounded-sm border-2 border-[#EAEDF2] shadow-md">
              <div className="p-6">
                <div className="flex items-center gap-3 mb-4">
                  <div className="w-10 h-10 bg-[#0F2D5E] rounded-sm flex items-center justify-center">
                    <FileCheck className="w-5 h-5 text-white" />
                  </div>
                  <h2 className="text-xl font-serif font-bold text-[#0F2D5E]">
                    Final Manuscript Validation
                  </h2>
                </div>

                <div className="space-y-3">
                  <label className="flex items-center gap-3 p-3 bg-[#F7F8FA] rounded-sm border border-[#EAEDF2] hover:bg-gray-50 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={reviewerConcernsAddressed}
                      onChange={(e) => setReviewerConcernsAddressed(e.target.checked)}
                      className="w-5 h-5"
                    />
                    <span className="text-sm text-gray-700">
                      All reviewer concerns have been adequately addressed
                    </span>
                  </label>

                  <label className="flex items-center gap-3 p-3 bg-[#F7F8FA] rounded-sm border border-[#EAEDF2] hover:bg-gray-50 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={revisionCompleteness}
                      onChange={(e) => setRevisionCompleteness(e.target.checked)}
                      className="w-5 h-5"
                    />
                    <span className="text-sm text-gray-700">
                      All requested revisions are complete
                    </span>
                  </label>

                  <label className="flex items-center gap-3 p-3 bg-[#F7F8FA] rounded-sm border border-[#EAEDF2] hover:bg-gray-50 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={ethicalValidation}
                      onChange={(e) => setEthicalValidation(e.target.checked)}
                      className="w-5 h-5"
                    />
                    <span className="text-sm text-gray-700">
                      Ethical compliance verified
                    </span>
                  </label>

                  <label className="flex items-center gap-3 p-3 bg-[#F7F8FA] rounded-sm border border-[#EAEDF2] hover:bg-gray-50 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={plagiarismValidation}
                      onChange={(e) => setPlagiarismValidation(e.target.checked)}
                      className="w-5 h-5"
                    />
                    <span className="text-sm text-gray-700">
                      Plagiarism check passed (originality confirmed)
                    </span>
                  </label>

                  <label className="flex items-center gap-3 p-3 bg-[#F7F8FA] rounded-sm border border-[#EAEDF2] hover:bg-gray-50 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={formattingCompliance}
                      onChange={(e) => setFormattingCompliance(e.target.checked)}
                      className="w-5 h-5"
                    />
                    <span className="text-sm text-gray-700">
                      Manuscript follows journal formatting guidelines
                    </span>
                  </label>

                  <label className="flex items-center gap-3 p-3 bg-[#F7F8FA] rounded-sm border border-[#EAEDF2] hover:bg-gray-50 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={policyAdherence}
                      onChange={(e) => setPolicyAdherence(e.target.checked)}
                      className="w-5 h-5"
                    />
                    <span className="text-sm text-gray-700">
                      Manuscript adheres to all journal policies
                    </span>
                  </label>
                </div>
              </div>
            </div>

            {/* Cross-Stage Comparison */}
            <div className="bg-white rounded-sm border-2 border-[#EAEDF2] shadow-md">
              <button
                onClick={() => setComparisonExpanded(!comparisonExpanded)}
                className="w-full flex items-center justify-between p-6 hover:bg-[#F7F8FA] transition-colors"
              >
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-[#0F2D5E] rounded-sm flex items-center justify-center">
                    <TrendingUp className="w-5 h-5 text-white" />
                  </div>
                  <h2 className="text-xl font-serif font-bold text-[#0F2D5E]">
                    Version Comparison
                  </h2>
                </div>
                {comparisonExpanded ? (
                  <ChevronUp className="w-5 h-5 text-gray-600" />
                ) : (
                  <ChevronDown className="w-5 h-5 text-gray-600" />
                )}
              </button>

              {comparisonExpanded && (
                <div className="px-6 pb-6 border-t border-[#EAEDF2]">
                  <div className="pt-4">
                    <div className="bg-blue-50 border border-blue-200 rounded-sm p-4 mb-4">
                      <h4 className="font-semibold text-blue-900 mb-2">Major Changes Implemented</h4>
                      <ul className="space-y-2 text-sm text-blue-800">
                        <li className="flex items-start gap-2">
                          <CheckCircle className="w-4 h-4 mt-0.5 text-blue-600" />
                          <span>Enhanced methodology section with additional technical details</span>
                        </li>
                        <li className="flex items-start gap-2">
                          <CheckCircle className="w-4 h-4 mt-0.5 text-blue-600" />
                          <span>Added comprehensive discussion on scalability challenges</span>
                        </li>
                        <li className="flex items-start gap-2">
                          <CheckCircle className="w-4 h-4 mt-0.5 text-blue-600" />
                          <span>Improved figure quality and added detailed captions</span>
                        </li>
                        <li className="flex items-start gap-2">
                          <CheckCircle className="w-4 h-4 mt-0.5 text-blue-600" />
                          <span>Expanded literature review with 15 additional references</span>
                        </li>
                        <li className="flex items-start gap-2">
                          <CheckCircle className="w-4 h-4 mt-0.5 text-blue-600" />
                          <span>Addressed all grammatical and formatting issues</span>
                        </li>
                      </ul>
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                      <div className="p-4 bg-gray-50 rounded-sm border border-gray-200">
                        <p className="text-xs text-gray-600 mb-1">Original Version</p>
                        <p className="text-sm font-medium text-gray-900 mb-2">
                          blockchain-supply-chain-v1.pdf
                        </p>
                        <button className="text-xs text-blue-600 hover:text-blue-700 flex items-center gap-1">
                          <Eye className="w-3 h-3" />
                          View Original
                        </button>
                      </div>
                      <div className="p-4 bg-green-50 rounded-sm border border-green-200">
                        <p className="text-xs text-gray-600 mb-1">Final Revised Version</p>
                        <p className="text-sm font-medium text-gray-900 mb-2">
                          blockchain-supply-chain-v2.pdf
                        </p>
                        <button className="text-xs text-green-600 hover:text-green-700 flex items-center gap-1">
                          <Eye className="w-3 h-3" />
                          View Revised
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </div>

            {/* Publication Approval Assessment */}
            <div className="bg-white rounded-sm border-2 border-[#EAEDF2] shadow-md">
              <div className="p-6">
                <div className="flex items-center gap-3 mb-4">
                  <div className="w-10 h-10 bg-[#0F2D5E] rounded-sm flex items-center justify-center">
                    <Award className="w-5 h-5 text-white" />
                  </div>
                  <div>
                    <h2 className="text-xl font-serif font-bold text-[#0F2D5E]">
                      Publication Approval Assessment
                    </h2>
                    <p className="text-sm text-gray-600">All fields required</p>
                  </div>
                </div>

                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Publication Readiness Level <span className="text-red-600">*</span>
                    </label>
                    <select
                      value={readinessLevel}
                      onChange={(e) => setReadinessLevel(e.target.value)}
                      className="w-full px-4 py-2 border border-[#EAEDF2] rounded-sm focus:outline-none focus:ring-2 focus:ring-[#1a1f2e] bg-white"
                    >
                      <option value="">Select readiness level...</option>
                      <option value="excellent">Excellent - Ready for immediate publication</option>
                      <option value="good">Good - Minor corrections needed</option>
                      <option value="adequate">Adequate - Some improvements required</option>
                      <option value="needs_work">Needs Work - Significant issues remain</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Journal Fit <span className="text-red-600">*</span>
                    </label>
                    <select
                      value={journalFit}
                      onChange={(e) => setJournalFit(e.target.value)}
                      className="w-full px-4 py-2 border border-[#EAEDF2] rounded-sm focus:outline-none focus:ring-2 focus:ring-[#1a1f2e] bg-white"
                    >
                      <option value="">Select journal fit...</option>
                      <option value="perfect">Perfect Alignment</option>
                      <option value="strong">Strong Alignment</option>
                      <option value="moderate">Moderate Alignment</option>
                      <option value="weak">Weak Alignment</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Research Contribution <span className="text-red-600">*</span>
                    </label>
                    <select
                      value={researchContribution}
                      onChange={(e) => setResearchContribution(e.target.value)}
                      className="w-full px-4 py-2 border border-[#EAEDF2] rounded-sm focus:outline-none focus:ring-2 focus:ring-[#1a1f2e] bg-white"
                    >
                      <option value="">Select research contribution...</option>
                      <option value="groundbreaking">Groundbreaking - Major advancement</option>
                      <option value="significant">Significant - Notable contribution</option>
                      <option value="moderate">Moderate - Incremental advancement</option>
                      <option value="limited">Limited - Marginal contribution</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Impact Level <span className="text-red-600">*</span>
                    </label>
                    <select
                      value={impactLevel}
                      onChange={(e) => setImpactLevel(e.target.value)}
                      className="w-full px-4 py-2 border border-[#EAEDF2] rounded-sm focus:outline-none focus:ring-2 focus:ring-[#1a1f2e] bg-white"
                    >
                      <option value="">Select impact level...</option>
                      <option value="high">High Impact</option>
                      <option value="medium">Medium Impact</option>
                      <option value="low">Low Impact</option>
                    </select>
                  </div>
                </div>
              </div>
            </div>

            {/* Policy and Compliance Verification */}
            <div className="bg-white rounded-sm border-2 border-[#EAEDF2] shadow-md">
              <div className="p-6">
                <div className="flex items-center gap-3 mb-4">
                  <div className="w-10 h-10 bg-[#0F2D5E] rounded-sm flex items-center justify-center">
                    <Shield className="w-5 h-5 text-white" />
                  </div>
                  <h2 className="text-xl font-serif font-bold text-[#0F2D5E]">
                    Policy & Compliance Verification
                  </h2>
                </div>

                <div className="space-y-3">
                  <label className="flex items-center gap-3 p-3 bg-[#F7F8FA] rounded-sm border border-[#EAEDF2] hover:bg-gray-50 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={ethicalCompliance}
                      onChange={(e) => setEthicalCompliance(e.target.checked)}
                      className="w-5 h-5"
                    />
                    <span className="text-sm text-gray-700">
                      Ethical compliance verified and documented
                    </span>
                  </label>

                  <label className="flex items-center gap-3 p-3 bg-[#F7F8FA] rounded-sm border border-[#EAEDF2] hover:bg-gray-50 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={plagiarismCheck}
                      onChange={(e) => setPlagiarismCheck(e.target.checked)}
                      className="w-5 h-5"
                    />
                    <span className="text-sm text-gray-700">
                      Plagiarism check completed and passed
                    </span>
                  </label>

                  <label className="flex items-center gap-3 p-3 bg-[#F7F8FA] rounded-sm border border-[#EAEDF2] hover:bg-gray-50 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={conflictOfInterest}
                      onChange={(e) => setConflictOfInterest(e.target.checked)}
                      className="w-5 h-5"
                    />
                    <span className="text-sm text-gray-700">
                      No conflicts of interest identified
                    </span>
                  </label>

                  <label className="flex items-center gap-3 p-3 bg-[#F7F8FA] rounded-sm border border-[#EAEDF2] hover:bg-gray-50 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={dataIntegrity}
                      onChange={(e) => setDataIntegrity(e.target.checked)}
                      className="w-5 h-5"
                    />
                    <span className="text-sm text-gray-700">
                      Data integrity and reproducibility verified
                    </span>
                  </label>

                  <label className="flex items-center gap-3 p-3 bg-[#F7F8FA] rounded-sm border border-[#EAEDF2] hover:bg-gray-50 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={peerReviewCompleteness}
                      onChange={(e) => setPeerReviewCompleteness(e.target.checked)}
                      className="w-5 h-5"
                    />
                    <span className="text-sm text-gray-700">
                      Peer review process completed thoroughly
                    </span>
                  </label>

                  <label className="flex items-center gap-3 p-3 bg-[#F7F8FA] rounded-sm border border-[#EAEDF2] hover:bg-gray-50 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={journalPolicyCompliance}
                      onChange={(e) => setJournalPolicyCompliance(e.target.checked)}
                      className="w-5 h-5"
                    />
                    <span className="text-sm text-gray-700">
                      All journal policies and guidelines met
                    </span>
                  </label>
                </div>
              </div>
            </div>

            {/* Final Decision Selection */}
            <div className="bg-white rounded-sm border-2 border-[#EAEDF2] shadow-md">
              <div className="p-6">
                <div className="flex items-center gap-3 mb-4">
                  <div className="w-10 h-10 bg-[#0F2D5E] rounded-sm flex items-center justify-center">
                    <Flag className="w-5 h-5 text-white" />
                  </div>
                  <div>
                    <h2 className="text-xl font-serif font-bold text-[#0F2D5E]">
                      Final Editorial Decision
                    </h2>
                    <p className="text-sm text-gray-600">This decision is final and binding</p>
                  </div>
                </div>

                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Decision <span className="text-red-600">*</span>
                    </label>
                    <select
                      value={decision}
                      onChange={(e) => setDecision(e.target.value as FinalDecisionData['decision'])}
                      className="w-full px-4 py-2 border border-[#EAEDF2] rounded-sm focus:outline-none focus:ring-2 focus:ring-[#1a1f2e] bg-white"
                    >
                      <option value="">Select final decision...</option>
                      <option value="accept_for_publication">Accept for Publication</option>
                      <option value="accept_with_final_corrections">
                        Accept with Minor Final Corrections
                      </option>
                      <option value="final_minor_revision">Request Final Minor Revision</option>
                      <option value="return_to_editor">Return to Editor for Re-evaluation</option>
                      <option value="reject">Reject Manuscript</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Decision Justification <span className="text-red-600">*</span>
                    </label>
                    <textarea
                      value={justification}
                      onChange={(e) => setJustification(e.target.value)}
                      rows={4}
                      className="w-full px-4 py-3 border border-[#EAEDF2] rounded-sm focus:outline-none focus:ring-2 focus:ring-[#1a1f2e] font-serif resize-none"
                      placeholder="Provide detailed justification for your decision..."
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Executive Summary <span className="text-red-600">*</span>
                    </label>
                    <textarea
                      value={executiveSummary}
                      onChange={(e) => setExecutiveSummary(e.target.value)}
                      rows={3}
                      className="w-full px-4 py-3 border border-[#EAEDF2] rounded-sm focus:outline-none focus:ring-2 focus:ring-[#1a1f2e] font-serif resize-none"
                      placeholder="Brief summary of the manuscript and decision..."
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Risk & Impact Notes
                    </label>
                    <textarea
                      value={riskAndImpactNotes}
                      onChange={(e) => setRiskAndImpactNotes(e.target.value)}
                      rows={3}
                      className="w-full px-4 py-3 border border-[#EAEDF2] rounded-sm focus:outline-none focus:ring-2 focus:ring-[#1a1f2e] font-serif resize-none"
                      placeholder="Note any risks, concerns, or expected impact..."
                    />
                  </div>
                </div>
              </div>
            </div>

            {/* Publication Timeline & Scheduling (Conditional) */}
            {decision === 'accept_for_publication' && (
              <div className="bg-gradient-to-br from-green-50 to-emerald-50 rounded-sm border-2 border-green-200 shadow-md">
                <div className="p-6">
                  <div className="flex items-center gap-3 mb-6">
                    <div className="w-10 h-10 bg-green-600 rounded-sm flex items-center justify-center">
                      <Calendar className="w-5 h-5 text-white" />
                    </div>
                    <h2 className="text-xl font-serif font-bold text-[#0F2D5E]">
                      Publication Timeline & Scheduling
                    </h2>
                  </div>

                  {/* Estimated Publication Window & Issue Assignment */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
                    {/* Estimated Publication Window */}
                    <div className="bg-white rounded-sm border border-green-200 p-5 shadow-sm">
                      <div className="flex items-start justify-between mb-3">
                        <h3 className="text-sm font-semibold text-gray-900">Estimated Publication Window</h3>
                        <span className="px-2 py-1 bg-green-100 text-green-800 text-xs font-medium rounded">
                          On Schedule
                        </span>
                      </div>
                      <div className="space-y-2">
                        <div className="flex items-baseline gap-2">
                          <Calendar className="w-4 h-4 text-green-600 mt-0.5" />
                          <div>
                            <p className="text-lg font-bold text-[#0F2D5E]">June 2026 Issue</p>
                            <p className="text-sm text-gray-600">Estimated Release: June 14–20, 2026</p>
                          </div>
                        </div>
                        <div className="pt-2 border-t border-gray-200">
                          <p className="text-xs text-gray-500">Timeline confidence: High</p>
                        </div>
                      </div>
                    </div>

                    {/* Recommended Issue & Volume Assignment */}
                    <div className="bg-white rounded-sm border border-green-200 p-5 shadow-sm">
                      <h3 className="text-sm font-semibold text-gray-900 mb-3">Recommended Issue & Volume</h3>
                      <div className="space-y-2">
                        <div className="flex items-center gap-2">
                          <FileText className="w-4 h-4 text-green-600" />
                          <p className="text-lg font-bold text-[#0F2D5E]">Volume 12 • Issue 2</p>
                        </div>
                        <div className="flex items-center gap-2 text-sm text-gray-600">
                          <Clock className="w-4 h-4" />
                          <span>Queue Position: 3 manuscripts ahead</span>
                        </div>
                        <div className="pt-2 border-t border-gray-200">
                          <p className="text-xs text-gray-500">Auto-assigned based on workflow availability</p>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Publication Priority */}
                  <div className="bg-white rounded-sm border border-gray-200 p-5 shadow-sm mb-6">
                    <h3 className="text-sm font-semibold text-gray-900 mb-3">Publication Priority</h3>
                    <div className="flex items-center gap-3">
                      <button
                        onClick={() => setPriority('standard')}
                        className={`px-4 py-2 rounded-sm border-2 transition-all ${
                          priority === 'standard'
                            ? 'border-blue-500 bg-blue-50 text-blue-900 font-medium'
                            : 'border-gray-300 bg-white text-gray-700 hover:border-gray-400'
                        }`}
                      >
                        <div className="flex items-center gap-2">
                          <div className={`w-2 h-2 rounded-full ${priority === 'standard' ? 'bg-blue-500' : 'bg-gray-400'}`}></div>
                          <span className="text-sm">Standard</span>
                        </div>
                      </button>
                      <button
                        onClick={() => setPriority('high')}
                        className={`px-4 py-2 rounded-sm border-2 transition-all ${
                          priority === 'high'
                            ? 'border-orange-500 bg-orange-50 text-orange-900 font-medium'
                            : 'border-gray-300 bg-white text-gray-700 hover:border-gray-400'
                        }`}
                      >
                        <div className="flex items-center gap-2">
                          <div className={`w-2 h-2 rounded-full ${priority === 'high' ? 'bg-orange-500' : 'bg-gray-400'}`}></div>
                          <span className="text-sm">High Priority</span>
                        </div>
                      </button>
                      <button
                        onClick={() => setPriority('urgent')}
                        className={`px-4 py-2 rounded-sm border-2 transition-all ${
                          priority === 'urgent'
                            ? 'border-red-500 bg-red-50 text-red-900 font-medium'
                            : 'border-gray-300 bg-white text-gray-700 hover:border-gray-400'
                        }`}
                      >
                        <div className="flex items-center gap-2">
                          <div className={`w-2 h-2 rounded-full ${priority === 'urgent' ? 'bg-red-500' : 'bg-gray-400'}`}></div>
                          <span className="text-sm">Urgent</span>
                        </div>
                      </button>
                    </div>
                    {priority && (
                      <div className="mt-3 pt-3 border-t border-gray-200">
                        <p className="text-xs text-gray-600">
                          {priority === 'urgent' && 'Fast-track publication with expedited workflow'}
                          {priority === 'high' && 'Priority scheduling with reduced lead time'}
                          {priority === 'standard' && 'Normal publication schedule'}
                        </p>
                      </div>
                    )}
                  </div>

                  {/* Workflow Status Summary */}
                  <div className="bg-white rounded-sm border border-gray-200 p-5 shadow-sm mb-6">
                    <h3 className="text-sm font-semibold text-gray-900 mb-4">Workflow Status Summary</h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <div className="flex items-center gap-2 mb-2">
                          <Activity className="w-4 h-4 text-purple-600" />
                          <p className="text-xs text-gray-600">Current Stage</p>
                        </div>
                        <p className="text-sm font-semibold text-[#0F2D5E]">Final Decision Review</p>
                      </div>
                      <div>
                        <div className="flex items-center gap-2 mb-2">
                          <ArrowLeft className="w-4 h-4 text-green-600 rotate-180" />
                          <p className="text-xs text-gray-600">Next Stage</p>
                        </div>
                        <p className="text-sm font-semibold text-[#0F2D5E]">Production Formatting</p>
                      </div>
                    </div>
                    <div className="flex items-center justify-between mt-4 pt-4 border-t border-gray-200">
                      <div className="flex items-center gap-2">
                        <span className="px-2 py-1 bg-green-100 text-green-800 text-xs font-medium rounded">
                          Low Risk
                        </span>
                        <span className="text-xs text-gray-500">Delay Risk</span>
                      </div>
                      <p className="text-xs text-gray-500">Last updated: {new Date().toLocaleTimeString()}</p>
                    </div>
                  </div>

                  {/* Compact Timeline Breakdown */}
                  <div className="bg-white rounded-sm border border-gray-200 p-5 shadow-sm mb-6">
                    <h3 className="text-sm font-semibold text-gray-900 mb-4">Workflow Timeline Breakdown</h3>
                    <div className="grid grid-cols-3 gap-3 mb-4">
                      <div className="bg-gray-50 rounded p-3 border border-gray-200">
                        <p className="text-xs text-gray-600 mb-1">Final Approval</p>
                        <p className="text-lg font-bold text-[#0F2D5E]">3-5 days</p>
                      </div>
                      <div className="bg-gray-50 rounded p-3 border border-gray-200">
                        <p className="text-xs text-gray-600 mb-1">Production Formatting</p>
                        <p className="text-lg font-bold text-[#0F2D5E]">10-14 days</p>
                      </div>
                      <div className="bg-gray-50 rounded p-3 border border-gray-200">
                        <p className="text-xs text-gray-600 mb-1">Publication Scheduling</p>
                        <p className="text-lg font-bold text-[#0F2D5E]">7-10 days</p>
                      </div>
                    </div>
                    <div className="pt-3 border-t border-gray-200">
                      <div className="flex items-center justify-between mb-2">
                        <p className="text-sm font-medium text-gray-700">Total Estimated Duration</p>
                        <p className="text-sm font-bold text-green-700">20-29 days</p>
                      </div>
                      <div className="w-full bg-gray-200 rounded-full h-2">
                        <div className="bg-green-600 h-2 rounded-full" style={{ width: '35%' }}></div>
                      </div>
                      <p className="text-xs text-gray-500 mt-1">Workflow progress: 35% complete</p>
                    </div>
                  </div>

                  {/* Manual Override Controls */}
                  <div className="bg-amber-50 rounded-sm border border-amber-200 p-5 shadow-sm">
                    <div className="flex items-start gap-3 mb-4">
                      <AlertTriangle className="w-5 h-5 text-amber-600 mt-0.5" />
                      <div className="flex-1">
                        <h3 className="text-sm font-semibold text-gray-900 mb-1">Manual Override Controls</h3>
                        <p className="text-xs text-amber-800">Manual changes may affect publication scheduling and workflow queue</p>
                      </div>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-xs font-medium text-gray-700 mb-2">
                          Override Publication Date
                        </label>
                        <input
                          type="date"
                          value={estimatedDate}
                          onChange={(e) => setEstimatedDate(e.target.value)}
                          className="w-full px-3 py-2 border border-amber-300 rounded-sm focus:outline-none focus:ring-2 focus:ring-amber-500 bg-white text-sm"
                        />
                      </div>
                      <div>
                        <label className="block text-xs font-medium text-gray-700 mb-2">
                          Override Issue/Volume Assignment
                        </label>
                        <input
                          type="text"
                          value={issueVolume}
                          onChange={(e) => setIssueVolume(e.target.value)}
                          placeholder="e.g., Vol 12, Issue 2"
                          className="w-full px-3 py-2 border border-amber-300 rounded-sm focus:outline-none focus:ring-2 focus:ring-amber-500 text-sm"
                        />
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* Action Buttons */}
            <div className="flex items-center justify-between gap-4 pt-4">
              <button
                onClick={onBack}
                className="px-6 py-3 border-2 border-[#EAEDF2] text-[#0F2D5E] rounded-sm hover:bg-[#F7F8FA] transition-colors font-medium"
              >
                Cancel
              </button>

              <div className="flex items-center gap-3">
                <button className="px-6 py-3 border-2 border-[#EAEDF2] text-[#0F2D5E] rounded-sm hover:bg-[#F7F8FA] transition-colors font-medium">
                  Save Draft
                </button>
                <button
                  onClick={handleSubmit}
                  className="px-8 py-3 bg-[#0F2D5E] text-white rounded-sm hover:bg-[#1A4A8A] transition-colors font-medium flex items-center gap-2"
                >
                  <Lock className="w-4 h-4" />
                  Submit Final Decision
                </button>
              </div>
            </div>
          </div>

          {/* Sidebar - Quick Stats */}
          <div className="space-y-6">
            <div className="bg-white rounded-sm border-2 border-[#EAEDF2] shadow-md p-6 sticky top-8">
              <h3 className="text-lg font-serif font-bold text-[#0F2D5E] mb-4">Quick Stats</h3>

              <div className="space-y-4">
                <div className="pb-4 border-b border-[#EAEDF2]">
                  <p className="text-sm text-gray-600 mb-1">Total Reviews</p>
                  <p className="text-2xl font-bold text-[#0F2D5E]">{totalReviews}</p>
                </div>

                <div className="pb-4 border-b border-[#EAEDF2]">
                  <p className="text-sm text-gray-600 mb-1">Average Score</p>
                  <p className="text-2xl font-bold text-[#0F2D5E]">{avgScore.toFixed(1)}/5.0</p>
                </div>

                <div className="pb-4 border-b border-[#EAEDF2]">
                  <p className="text-sm text-gray-600 mb-1">Avg Review Time</p>
                  <p className="text-2xl font-bold text-[#0F2D5E]">{avgReviewTime} days</p>
                </div>

                <div className="pb-4 border-b border-[#EAEDF2]">
                  <p className="text-sm text-gray-600 mb-1">Revision Rounds</p>
                  <p className="text-2xl font-bold text-[#0F2D5E]">{revisionRounds}</p>
                </div>

                <div>
                  <p className="text-sm text-gray-600 mb-1">Time in Review</p>
                  <p className="text-2xl font-bold text-[#0F2D5E]">{daysInReview} days</p>
                </div>
              </div>

              <div className="mt-6 pt-6 border-t border-[#EAEDF2]">
                <div className="flex items-center gap-2 text-sm text-gray-600 mb-2">
                  <Clock className="w-4 h-4" />
                  <span>Last saved:</span>
                </div>
                <p className="text-xs text-gray-500">Auto-saving every 30 seconds</p>
              </div>
            </div>

            {/* Alert Panel */}
            <div className="bg-yellow-50 rounded-sm border-2 border-yellow-200 shadow-md p-6">
              <div className="flex items-start gap-3">
                <AlertTriangle className="w-5 h-5 text-yellow-600 mt-0.5" />
                <div>
                  <h4 className="font-semibold text-yellow-900 mb-2">Important Notice</h4>
                  <p className="text-sm text-yellow-800">
                    This is the final decision in the editorial process. Once submitted, the
                    decision cannot be reversed. Please ensure all validation and compliance
                    checks are complete.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Confirmation Modal */}
      {showConfirmModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-sm border-2 border-[#EAEDF2] shadow-2xl max-w-2xl w-full p-8">
            <div className="flex items-start gap-4 mb-6">
              <div className="w-12 h-12 bg-yellow-100 rounded-full flex items-center justify-center flex-shrink-0">
                <AlertTriangle className="w-6 h-6 text-yellow-600" />
              </div>
              <div>
                <h3 className="text-2xl font-serif font-bold text-[#0F2D5E] mb-2">
                  Confirm Final Decision
                </h3>
                <p className="text-gray-600">
                  Please review your decision carefully. This action is final and cannot be undone.
                </p>
              </div>
            </div>

            <div className="bg-[#F7F8FA] rounded-sm p-6 mb-6 space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium text-gray-700">Decision:</span>
                <span className="text-sm font-semibold text-[#0F2D5E]">
                  {decision === 'accept_for_publication'
                    ? 'Accept for Publication'
                    : decision === 'accept_with_final_corrections'
                    ? 'Accept with Minor Final Corrections'
                    : decision === 'final_minor_revision'
                    ? 'Request Final Minor Revision'
                    : decision === 'return_to_editor'
                    ? 'Return to Editor'
                    : 'Reject Manuscript'}
                </span>
              </div>

              {decision === 'accept_for_publication' && estimatedDate && (
                <div className="flex items-center justify-between">
                  <span className="text-sm font-medium text-gray-700">Publication Date:</span>
                  <span className="text-sm font-semibold text-[#0F2D5E]">
                    {new Date(estimatedDate).toLocaleDateString()}
                  </span>
                </div>
              )}

              {decision === 'accept_for_publication' && issueVolume && (
                <div className="flex items-center justify-between">
                  <span className="text-sm font-medium text-gray-700">Issue/Volume:</span>
                  <span className="text-sm font-semibold text-[#0F2D5E]">{issueVolume}</span>
                </div>
              )}

              <div className="pt-3 border-t border-[#EAEDF2]">
                <p className="text-xs text-gray-600 mb-1">Justification Summary:</p>
                <p className="text-sm text-gray-700 line-clamp-3">{justification}</p>
              </div>
            </div>

            <div className="flex items-center justify-end gap-3">
              <button
                onClick={() => setShowConfirmModal(false)}
                className="px-6 py-3 border-2 border-[#EAEDF2] text-[#0F2D5E] rounded-sm hover:bg-[#F7F8FA] transition-colors font-medium"
              >
                Cancel
              </button>
              <button
                onClick={confirmSubmit}
                className="px-6 py-3 bg-[#0F2D5E] text-white rounded-sm hover:bg-[#1A4A8A] transition-colors font-medium"
              >
                Confirm & Submit
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
