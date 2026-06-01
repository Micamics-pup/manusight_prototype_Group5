import React, { useState, useMemo } from 'react';
import { useData } from '../context/DataContext';
import {
  ArrowLeft,
  Calendar,
  Clock,
  TrendingUp,
  AlertTriangle,
  CheckCircle,
  XCircle,
  Target,
  Edit3,
  User,
  FileText,
  AlertCircle,
  Activity,
  BarChart3,
} from 'lucide-react';
import type { Manuscript, Review } from '../types';

interface TimelineRecommendationPageProps {
  manuscript: Manuscript;
  onBack: () => void;
  onTimelineUpdated: () => void;
}

interface WorkflowStage {
  id: string;
  name: string;
  estimatedDuration: number;
  status: 'completed' | 'in_progress' | 'pending';
  completedDate?: Date;
}

interface DelayFactor {
  id: string;
  type: 'reviewer' | 'complexity' | 'revision' | 'workload';
  description: string;
  impact: number; // days
  severity: 'low' | 'medium' | 'high';
}

export function TimelineRecommendationPage({
  manuscript,
  onBack,
  onTimelineUpdated,
}: TimelineRecommendationPageProps) {
  const { users, reviews } = useData();

  // Get manuscript reviewers
  const manuscriptReviewers = manuscript.assignedReviewers.map((rid) => {
    const reviewer = users.find((u) => u.id === rid);
    const review = reviews.find((r) => r.manuscriptId === manuscript.id && r.reviewerId === rid);
    const allReviewerReviews = reviews.filter((r) => r.reviewerId === rid && r.status === 'completed');

    // Calculate average review time
    let avgReviewTime = 12; // default
    if (allReviewerReviews.length > 0) {
      avgReviewTime = rid === '4' ? 10 : rid === '5' ? 14 : 12;
    }

    return {
      id: rid,
      name: reviewer?.name || 'Unknown',
      avgReviewTime,
      status: review?.status || 'pending',
      response: review ? (review.status === 'pending' ? 'pending' : 'accepted') : 'pending',
    };
  });

  // Calculate manuscript complexity
  const manuscriptComplexity = useMemo(() => {
    const abstractLength = manuscript.abstract.length;
    const fileCount = manuscript.files.length;

    if (abstractLength > 500 || fileCount > 3) {
      return { level: 'high', factor: 1.3 };
    } else if (abstractLength > 300 || fileCount > 1) {
      return { level: 'medium', factor: 1.15 };
    }
    return { level: 'low', factor: 1.0 };
  }, [manuscript]);

  // Detect delay factors
  const delayFactors: DelayFactor[] = useMemo(() => {
    const factors: DelayFactor[] = [];

    // Reviewer-related factors
    const declinedReviewers = manuscriptReviewers.filter((r) => r.response === 'declined');
    if (declinedReviewers.length > 0) {
      factors.push({
        id: 'decline-1',
        type: 'reviewer',
        description: `${declinedReviewers.length} reviewer(s) declined invitation`,
        impact: 4,
        severity: 'high',
      });
    }

    const pendingReviewers = manuscriptReviewers.filter((r) => r.response === 'pending');
    if (pendingReviewers.length > 0) {
      factors.push({
        id: 'pending-1',
        type: 'reviewer',
        description: `${pendingReviewers.length} reviewer(s) invitation(s) still pending`,
        impact: 2,
        severity: 'medium',
      });
    }

    const slowReviewers = manuscriptReviewers.filter((r) => r.avgReviewTime > 13);
    if (slowReviewers.length > 0) {
      factors.push({
        id: 'slow-1',
        type: 'reviewer',
        description: `${slowReviewers.length} reviewer(s) have longer average review times`,
        impact: 3,
        severity: 'medium',
      });
    }

    // Complexity factor
    if (manuscriptComplexity.level === 'high') {
      factors.push({
        id: 'complex-1',
        type: 'complexity',
        description: 'Manuscript complexity is high',
        impact: 5,
        severity: 'high',
      });
    } else if (manuscriptComplexity.level === 'medium') {
      factors.push({
        id: 'complex-2',
        type: 'complexity',
        description: 'Manuscript complexity is moderate',
        impact: 2,
        severity: 'low',
      });
    }

    // Revision history factor
    if (manuscript.revisionHistory.length > 3) {
      factors.push({
        id: 'revision-1',
        type: 'revision',
        description: 'Multiple revision cycles detected',
        impact: 4,
        severity: 'medium',
      });
    }

    return factors;
  }, [manuscriptReviewers, manuscriptComplexity, manuscript]);

  // Base workflow stages with durations
  const baseStages: WorkflowStage[] = [
    {
      id: 'confirmation',
      name: 'Reviewer Confirmation',
      estimatedDuration: 2,
      status: manuscript.assignedReviewers.length > 0 ? 'completed' : 'pending',
      completedDate: manuscript.assignedReviewers.length > 0 ? new Date() : undefined,
    },
    {
      id: 'initial_review',
      name: 'Initial Review Stage',
      estimatedDuration: Math.max(...manuscriptReviewers.map((r) => r.avgReviewTime)),
      status: manuscript.status === 'review' ? 'in_progress' : 'pending',
    },
    {
      id: 'consolidation',
      name: 'Review Consolidation',
      estimatedDuration: 3,
      status: 'pending',
    },
    {
      id: 'author_revision',
      name: 'Author Revision',
      estimatedDuration: 10 * manuscriptComplexity.factor,
      status: 'pending',
    },
    {
      id: 'rereview',
      name: 'Re-review Stage',
      estimatedDuration: 7,
      status: 'pending',
    },
    {
      id: 'editorial',
      name: 'Editorial Recommendation',
      estimatedDuration: 2,
      status: 'pending',
    },
    {
      id: 'copyediting',
      name: 'Copyediting',
      estimatedDuration: 5,
      status: 'pending',
    },
    {
      id: 'layout',
      name: 'Layout & Typesetting',
      estimatedDuration: 4,
      status: 'pending',
    },
    {
      id: 'proof',
      name: 'Final Proof Approval',
      estimatedDuration: 3,
      status: 'pending',
    },
    {
      id: 'publication',
      name: 'Publication Preparation',
      estimatedDuration: 2,
      status: 'pending',
    },
  ];

  const [workflowStages, setWorkflowStages] = useState<WorkflowStage[]>(baseStages);
  const [timelineDecision, setTimelineDecision] = useState<'accept' | 'adjust' | 'escalate'>('accept');
  const [additionalReviewerId, setAdditionalReviewerId] = useState('');
  const [timelineNotes, setTimelineNotes] = useState('');
  const [showSuccess, setShowSuccess] = useState(false);

  // Calculate timeline metrics
  const timelineMetrics = useMemo(() => {
    const originalDuration = baseStages.reduce((sum, stage) => {
      if (stage.id === 'initial_review') {
        return sum + 14; // Original estimated review time
      }
      if (stage.id === 'author_revision') {
        return sum + 10; // Original revision time without complexity factor
      }
      return sum + stage.estimatedDuration;
    }, 0);

    const adjustedDuration = workflowStages.reduce((sum, stage) => sum + stage.estimatedDuration, 0);
    const additionalDelays = delayFactors.reduce((sum, factor) => sum + factor.impact, 0);
    const totalDuration = Math.ceil(adjustedDuration + additionalDelays);
    const difference = totalDuration - originalDuration;

    let delayRisk: 'Low' | 'Moderate' | 'High' = 'Low';
    if (difference > 10) {
      delayRisk = 'High';
    } else if (difference > 5) {
      delayRisk = 'Moderate';
    }

    const projectedPublicationDate = new Date();
    projectedPublicationDate.setDate(projectedPublicationDate.getDate() + totalDuration);

    return {
      originalDuration,
      adjustedDuration: Math.ceil(adjustedDuration),
      additionalDelays,
      totalDuration,
      difference,
      delayRisk,
      projectedPublicationDate,
    };
  }, [workflowStages, delayFactors, baseStages]);

  const availableReviewers = users.filter(
    (u) => u.role === 'reviewer' && !manuscript.assignedReviewers.includes(u.id)
  );

  const handleStageAdjustment = (stageId: string, newDuration: number) => {
    setWorkflowStages((prev) =>
      prev.map((stage) =>
        stage.id === stageId ? { ...stage, estimatedDuration: Math.max(1, newDuration) } : stage
      )
    );
  };

  const handleUpdateTimeline = () => {
    setShowSuccess(true);
  };

  if (showSuccess) {
    return (
      <div className="min-h-screen bg-[#F7F8FA]">
        <div className="bg-[#0F2D5E] text-[#f5f1e8] py-8 px-6 border-b-4 border-[#8b7355]">
          <div className="max-w-6xl mx-auto">
            <h1 className="text-3xl font-serif">Timeline Update Confirmation</h1>
            <p className="mt-2 text-[#d4c5b0]">Timeline successfully updated</p>
          </div>
        </div>

        <div className="max-w-6xl mx-auto py-8 px-6">
          <div className="bg-white border border-[#EAEDF2] rounded-sm p-8 mb-6">
            <div className="flex items-start gap-4 mb-6">
              <div className="p-3 bg-green-100 rounded-sm">
                <CheckCircle className="w-8 h-8 text-green-700" />
              </div>
              <div>
                <h2 className="text-2xl font-serif text-[#0F2D5E] mb-2">Timeline Updated Successfully</h2>
                <p className="text-gray-700">
                  The workflow timeline has been updated and all stakeholders have been notified.
                </p>
              </div>
            </div>

            <div className="border-t border-[#EAEDF2] pt-6 mt-6 space-y-4">
              <h3 className="text-lg font-serif text-[#0F2D5E] mb-4">System Outputs</h3>

              <div className="space-y-3">
                <div className="flex items-start gap-3">
                  <CheckCircle className="w-5 h-5 text-green-600 mt-0.5 flex-shrink-0" />
                  <div>
                    <p className="font-medium text-gray-900">Updated Workflow Timeline</p>
                    <p className="text-sm text-gray-600">
                      Total estimated duration: {timelineMetrics.totalDuration} days
                    </p>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <CheckCircle className="w-5 h-5 text-green-600 mt-0.5 flex-shrink-0" />
                  <div>
                    <p className="font-medium text-gray-900">Revised Deadlines</p>
                    <p className="text-sm text-gray-600">
                      Updated deadlines sent to reviewers and author
                    </p>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <CheckCircle className="w-5 h-5 text-green-600 mt-0.5 flex-shrink-0" />
                  <div>
                    <p className="font-medium text-gray-900">Timeline Alerts</p>
                    <p className="text-sm text-gray-600">
                      Dashboard updated with new timeline milestones
                    </p>
                  </div>
                </div>

                {timelineMetrics.delayRisk !== 'Low' && (
                  <div className="flex items-start gap-3">
                    <CheckCircle className="w-5 h-5 text-green-600 mt-0.5 flex-shrink-0" />
                    <div>
                      <p className="font-medium text-gray-900">Delay Warnings</p>
                      <p className="text-sm text-gray-600">
                        {timelineMetrics.delayRisk} risk delay alerts sent to editor dashboard
                      </p>
                    </div>
                  </div>
                )}

                <div className="flex items-start gap-3">
                  <CheckCircle className="w-5 h-5 text-green-600 mt-0.5 flex-shrink-0" />
                  <div>
                    <p className="font-medium text-gray-900">Updated Publication Forecast</p>
                    <p className="text-sm text-gray-600">
                      Projected publication date:{' '}
                      {timelineMetrics.projectedPublicationDate.toLocaleDateString('en-US', {
                        month: 'long',
                        day: 'numeric',
                        year: 'numeric',
                      })}
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <button
            onClick={onBack}
            className="px-6 py-3 bg-[#0F2D5E] text-[#f5f1e8] rounded-sm hover:bg-[#2a3142] transition-colors font-medium"
          >
            Return to Dashboard
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#F7F8FA]">
      <div className="bg-[#0F2D5E] text-[#f5f1e8] py-8 px-6 border-b-4 border-[#8b7355]">
        <div className="max-w-6xl mx-auto">
          <button
            onClick={onBack}
            className="flex items-center gap-2 text-[#d4c5b0] hover:text-[#f5f1e8] mb-4 transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
            Back to Dashboard
          </button>
          <h1 className="text-3xl font-serif">Dynamic Timeline Adjustment</h1>
          <p className="mt-2 text-[#d4c5b0]">
            AI-powered timeline recommendations and workflow duration optimization
          </p>
        </div>
      </div>

      <div className="max-w-6xl mx-auto py-8 px-6 space-y-6">
        {/* Manuscript Context */}
        <div className="bg-white border border-[#EAEDF2] rounded-sm p-6">
          <div className="flex items-start gap-4">
            <div className="p-2 bg-[#0F2D5E] rounded-sm">
              <FileText className="w-6 h-6 text-[#f5f1e8]" />
            </div>
            <div className="flex-1">
              <h2 className="text-xl font-serif text-[#0F2D5E] mb-1">{manuscript.title}</h2>
              <p className="text-sm text-gray-600">
                {manuscript.id} • {manuscript.category} • by {manuscript.authorName}
              </p>
            </div>
          </div>
        </div>

        {/* Timeline Summary Cards */}
        <div className="grid grid-cols-4 gap-4">
          <div className="bg-blue-50 border border-blue-200 rounded-sm p-4">
            <p className="text-sm text-blue-700 font-medium mb-1">Original Timeline</p>
            <p className="text-3xl font-bold text-blue-900">{timelineMetrics.originalDuration}</p>
            <p className="text-xs text-blue-600 mt-1">Days</p>
          </div>

          <div className="bg-purple-50 border border-purple-200 rounded-sm p-4">
            <p className="text-sm text-purple-700 font-medium mb-1">Adjusted Timeline</p>
            <p className="text-3xl font-bold text-purple-900">{timelineMetrics.totalDuration}</p>
            <p className="text-xs text-purple-600 mt-1">Days</p>
          </div>

          <div
            className={`rounded-sm p-4 border ${
              timelineMetrics.delayRisk === 'Low'
                ? 'bg-green-50 border-green-200'
                : timelineMetrics.delayRisk === 'Moderate'
                ? 'bg-amber-50 border-amber-200'
                : 'bg-red-50 border-red-200'
            }`}
          >
            <p
              className={`text-sm font-medium mb-1 ${
                timelineMetrics.delayRisk === 'Low'
                  ? 'text-green-700'
                  : timelineMetrics.delayRisk === 'Moderate'
                  ? 'text-amber-700'
                  : 'text-red-700'
              }`}
            >
              Delay Risk
            </p>
            <p
              className={`text-3xl font-bold ${
                timelineMetrics.delayRisk === 'Low'
                  ? 'text-green-900'
                  : timelineMetrics.delayRisk === 'Moderate'
                  ? 'text-amber-900'
                  : 'text-red-900'
              }`}
            >
              {timelineMetrics.delayRisk}
            </p>
            {timelineMetrics.difference !== 0 && (
              <p className="text-xs mt-1 text-gray-600">
                {timelineMetrics.difference > 0 ? '+' : ''}
                {timelineMetrics.difference} days
              </p>
            )}
          </div>

          <div className="bg-indigo-50 border border-indigo-200 rounded-sm p-4">
            <p className="text-sm text-indigo-700 font-medium mb-1">Projected Date</p>
            <p className="text-lg font-bold text-indigo-900">
              {timelineMetrics.projectedPublicationDate.toLocaleDateString('en-US', {
                month: 'short',
                day: 'numeric',
              })}
            </p>
            <p className="text-xs text-indigo-600 mt-1">
              {timelineMetrics.projectedPublicationDate.getFullYear()}
            </p>
          </div>
        </div>

        {/* Current Workflow Status */}
        <div className="bg-white border border-[#EAEDF2] rounded-sm">
          <div className="bg-[#0F2D5E] text-[#f5f1e8] px-6 py-4 border-b border-[#EAEDF2] flex items-center gap-2">
            <Activity className="w-5 h-5" />
            <h2 className="text-xl font-serif">Current Workflow Status</h2>
          </div>
          <div className="p-6">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-blue-100 rounded-sm">
                <Target className="w-5 h-5 text-blue-700" />
              </div>
              <div>
                <p className="font-semibold text-gray-900">Current Stage</p>
                <p className="text-sm text-gray-600">
                  {workflowStages.find((s) => s.status === 'in_progress')?.name ||
                    workflowStages.find((s) => s.status === 'completed')?.name ||
                    'Not Started'}
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Stage-by-Stage Duration Breakdown */}
        <div className="bg-white border border-[#EAEDF2] rounded-sm">
          <div className="bg-[#0F2D5E] text-[#f5f1e8] px-6 py-4 border-b border-[#EAEDF2] flex items-center gap-2">
            <BarChart3 className="w-5 h-5" />
            <h2 className="text-xl font-serif">Stage-by-Stage Duration Breakdown</h2>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50 border-b border-[#EAEDF2]">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-semibold text-gray-700 uppercase">
                    Workflow Stage
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-semibold text-gray-700 uppercase">
                    Status
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-semibold text-gray-700 uppercase">
                    Estimated Duration
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-semibold text-gray-700 uppercase">
                    {timelineDecision === 'adjust' ? 'Adjust' : 'Progress'}
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#d1c7b3]">
                {workflowStages.map((stage, index) => (
                  <tr key={stage.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-3">
                        <span className="text-sm font-medium text-gray-500">{index + 1}.</span>
                        <span className="text-sm font-medium text-gray-900">{stage.name}</span>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      {stage.status === 'completed' && (
                        <span className="flex items-center gap-1 text-sm text-green-700">
                          <CheckCircle className="w-4 h-4" />
                          Completed
                        </span>
                      )}
                      {stage.status === 'in_progress' && (
                        <span className="flex items-center gap-1 text-sm text-blue-700">
                          <Clock className="w-4 h-4" />
                          In Progress
                        </span>
                      )}
                      {stage.status === 'pending' && (
                        <span className="flex items-center gap-1 text-sm text-gray-500">
                          <Clock className="w-4 h-4" />
                          Pending
                        </span>
                      )}
                    </td>
                    <td className="px-6 py-4">
                      {timelineDecision === 'adjust' ? (
                        <div className="flex items-center gap-2">
                          <input
                            type="number"
                            min="1"
                            value={Math.ceil(stage.estimatedDuration)}
                            onChange={(e) =>
                              handleStageAdjustment(stage.id, parseInt(e.target.value) || 1)
                            }
                            className="w-20 border border-gray-300 rounded px-2 py-1 text-sm focus:ring-[#1a1f2e] focus:border-[#1a1f2e]"
                          />
                          <span className="text-sm text-gray-600">Days</span>
                        </div>
                      ) : (
                        <span className="text-sm font-semibold text-gray-900">
                          {Math.ceil(stage.estimatedDuration)} Days
                        </span>
                      )}
                    </td>
                    <td className="px-6 py-4">
                      <div className="w-full bg-gray-200 rounded-full h-2">
                        <div
                          className={`h-2 rounded-full ${
                            stage.status === 'completed'
                              ? 'bg-green-500'
                              : stage.status === 'in_progress'
                              ? 'bg-blue-500'
                              : 'bg-gray-300'
                          }`}
                          style={{
                            width:
                              stage.status === 'completed'
                                ? '100%'
                                : stage.status === 'in_progress'
                                ? '50%'
                                : '0%',
                          }}
                        />
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
              <tfoot className="bg-gray-50 border-t-2 border-[#8b7355]">
                <tr>
                  <td colSpan={2} className="px-6 py-4 text-right font-semibold text-gray-900">
                    Total Estimated Processing Time:
                  </td>
                  <td colSpan={2} className="px-6 py-4 font-bold text-xl text-[#0F2D5E]">
                    {timelineMetrics.totalDuration} Days
                  </td>
                </tr>
              </tfoot>
            </table>
          </div>
        </div>

        {/* Timeline Adjustment Summary */}
        <div className="bg-white border border-[#EAEDF2] rounded-sm">
          <div className="bg-[#0F2D5E] text-[#f5f1e8] px-6 py-4 border-b border-[#EAEDF2] flex items-center gap-2">
            <TrendingUp className="w-5 h-5" />
            <h2 className="text-xl font-serif">Timeline Adjustment Summary</h2>
          </div>
          <div className="p-6">
            <div className="grid grid-cols-3 gap-6">
              <div>
                <p className="text-sm font-medium text-gray-600 mb-1">Original Timeline</p>
                <p className="text-2xl font-bold text-gray-900">{timelineMetrics.originalDuration} Days</p>
              </div>
              <div>
                <p className="text-sm font-medium text-gray-600 mb-1">Adjusted Timeline</p>
                <p className="text-2xl font-bold text-[#0F2D5E]">{timelineMetrics.totalDuration} Days</p>
              </div>
              <div>
                <p className="text-sm font-medium text-gray-600 mb-1">Difference</p>
                <p
                  className={`text-2xl font-bold ${
                    timelineMetrics.difference > 0
                      ? 'text-red-600'
                      : timelineMetrics.difference < 0
                      ? 'text-green-600'
                      : 'text-gray-900'
                  }`}
                >
                  {timelineMetrics.difference > 0 ? '+' : ''}
                  {timelineMetrics.difference} Days
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Delay Factors Detected */}
        {delayFactors.length > 0 && (
          <div className="bg-white border border-[#EAEDF2] rounded-sm">
            <div className="bg-[#0F2D5E] text-[#f5f1e8] px-6 py-4 border-b border-[#EAEDF2] flex items-center gap-2">
              <AlertTriangle className="w-5 h-5" />
              <h2 className="text-xl font-serif">Detected Delay Factors</h2>
            </div>
            <div className="p-6 space-y-3">
              {delayFactors.map((factor) => (
                <div
                  key={factor.id}
                  className={`border-l-4 pl-4 py-2 ${
                    factor.severity === 'high'
                      ? 'border-red-500 bg-red-50'
                      : factor.severity === 'medium'
                      ? 'border-amber-500 bg-amber-50'
                      : 'border-blue-500 bg-blue-50'
                  }`}
                >
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <p className="text-sm font-medium text-gray-900">{factor.description}</p>
                      <p className="text-xs text-gray-600 mt-1">
                        Type: {factor.type.charAt(0).toUpperCase() + factor.type.slice(1)}
                      </p>
                    </div>
                    <div className="text-right">
                      <p className="text-lg font-bold text-gray-900">+{factor.impact}</p>
                      <p className="text-xs text-gray-600">days</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Reviewer Performance Impact */}
        {manuscriptReviewers.length > 0 && (
          <div className="bg-white border border-[#EAEDF2] rounded-sm">
            <div className="bg-[#0F2D5E] text-[#f5f1e8] px-6 py-4 border-b border-[#EAEDF2] flex items-center gap-2">
              <User className="w-5 h-5" />
              <h2 className="text-xl font-serif">Reviewer Performance Impact</h2>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-gray-50 border-b border-[#EAEDF2]">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-semibold text-gray-700 uppercase">
                      Reviewer
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-semibold text-gray-700 uppercase">
                      Status
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-semibold text-gray-700 uppercase">
                      Avg Review Time
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-semibold text-gray-700 uppercase">
                      Impact
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-[#d1c7b3]">
                  {manuscriptReviewers.map((reviewer) => (
                    <tr key={reviewer.id} className="hover:bg-gray-50">
                      <td className="px-6 py-4">
                        <span className="text-sm font-medium text-gray-900">{reviewer.name}</span>
                      </td>
                      <td className="px-6 py-4">
                        <span
                          className={`px-2 py-1 text-xs font-medium rounded ${
                            reviewer.response === 'accepted'
                              ? 'bg-green-100 text-green-800'
                              : 'bg-amber-100 text-amber-800'
                          }`}
                        >
                          {reviewer.response}
                        </span>
                      </td>
                      <td className="px-6 py-4">
                        <span className="text-sm font-semibold text-gray-900">
                          {reviewer.avgReviewTime} Days
                        </span>
                      </td>
                      <td className="px-6 py-4">
                        <span
                          className={`text-sm font-medium ${
                            reviewer.avgReviewTime > 13
                              ? 'text-red-600'
                              : reviewer.avgReviewTime > 10
                              ? 'text-amber-600'
                              : 'text-green-600'
                          }`}
                        >
                          {reviewer.avgReviewTime > 13
                            ? 'High'
                            : reviewer.avgReviewTime > 10
                            ? 'Moderate'
                            : 'Low'}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* Projected Publication Date */}
        <div className="bg-gradient-to-br from-indigo-50 to-purple-50 border border-indigo-200 rounded-sm">
          <div className="p-8 text-center">
            <Calendar className="w-12 h-12 text-indigo-700 mx-auto mb-4" />
            <h2 className="text-2xl font-serif text-[#0F2D5E] mb-2">Projected Publication Date</h2>
            <p className="text-5xl font-bold text-indigo-900 mb-2">
              {timelineMetrics.projectedPublicationDate.toLocaleDateString('en-US', {
                month: 'long',
                day: 'numeric',
                year: 'numeric',
              })}
            </p>
            <p className="text-sm text-gray-600">
              Based on current workflow progress and estimated stage durations
            </p>
          </div>
        </div>

        {/* Editor Actions */}
        <div className="bg-white border border-[#EAEDF2] rounded-sm">
          <div className="bg-[#0F2D5E] text-[#f5f1e8] px-6 py-4 border-b border-[#EAEDF2]">
            <h2 className="text-xl font-serif">Timeline Decision</h2>
          </div>
          <div className="p-6 space-y-6">
            {/* Timeline Decision */}
            <div>
              <label className="block text-sm font-semibold text-gray-900 mb-2">
                Timeline Decision
              </label>
              <select
                value={timelineDecision}
                onChange={(e) => setTimelineDecision(e.target.value as any)}
                className="w-full border border-gray-300 rounded-sm px-4 py-2.5 focus:ring-2 focus:ring-[#1a1f2e] focus:border-[#1a1f2e]"
              >
                <option value="accept">Accept Recommended Timeline</option>
                <option value="adjust">Adjust Timeline Manually</option>
                <option value="escalate">Escalate Delay Concern</option>
              </select>
            </div>

            {/* Additional Reviewer */}
            {timelineDecision === 'escalate' && (
              <div>
                <label className="block text-sm font-semibold text-gray-900 mb-2">
                  Additional Reviewer Request (Optional)
                </label>
                <select
                  value={additionalReviewerId}
                  onChange={(e) => setAdditionalReviewerId(e.target.value)}
                  className="w-full border border-gray-300 rounded-sm px-4 py-2.5 focus:ring-2 focus:ring-[#1a1f2e] focus:border-[#1a1f2e]"
                >
                  <option value="">Select reviewer...</option>
                  {availableReviewers.map((u) => (
                    <option key={u.id} value={u.id}>
                      {u.name}
                    </option>
                  ))}
                </select>
              </div>
            )}

            {/* Timeline Notes */}
            <div>
              <label className="block text-sm font-semibold text-gray-900 mb-2">
                Timeline Notes
              </label>
              <textarea
                value={timelineNotes}
                onChange={(e) => setTimelineNotes(e.target.value)}
                rows={4}
                placeholder="Add notes about timeline adjustments, delay factors, or special considerations..."
                className="w-full border border-gray-300 rounded-sm px-4 py-2.5 focus:ring-2 focus:ring-[#1a1f2e] focus:border-[#1a1f2e] resize-none"
              />
            </div>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex items-center justify-between">
          <button
            onClick={onBack}
            className="px-6 py-3 bg-white border border-[#EAEDF2] text-[#0F2D5E] rounded-sm hover:bg-gray-50 transition-colors font-medium"
          >
            Cancel
          </button>
          <button
            onClick={handleUpdateTimeline}
            className="px-8 py-3 bg-[#0F2D5E] text-[#f5f1e8] rounded-sm hover:bg-[#2a3142] transition-colors font-medium flex items-center gap-2"
          >
            <CheckCircle className="w-5 h-5" />
            Update Timeline
          </button>
        </div>
      </div>
    </div>
  );
}
