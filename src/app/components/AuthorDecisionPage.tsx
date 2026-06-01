import React, { useState } from 'react';
import {
  ArrowLeft,
  FileText,
  Calendar,
  Clock,
  CheckCircle,
  XCircle,
  AlertCircle,
  Target,
  TrendingUp,
  AlertTriangle,
  ThumbsUp,
  ThumbsDown,
  Activity,
  CheckSquare,
} from 'lucide-react';
import type { Manuscript } from '../types';

interface AuthorDecisionPageProps {
  manuscript: Manuscript;
  onBack: () => void;
  onProceed: () => void;
  onWithdraw: () => void;
}

interface TimelineStage {
  id: string;
  name: string;
  estimatedDuration: number;
}

export function AuthorDecisionPage({
  manuscript,
  onBack,
  onProceed,
  onWithdraw,
}: AuthorDecisionPageProps) {
  const [decision, setDecision] = useState<'proceed' | 'withdraw' | null>(null);
  const [decisionRemarks, setDecisionRemarks] = useState('');
  const [withdrawalReason, setWithdrawalReason] = useState('');
  const [timelineConcerns, setTimelineConcerns] = useState('');
  const [showConfirmation, setShowConfirmation] = useState(false);

  const timelineStages: TimelineStage[] = [
    { id: 'review', name: 'Peer Review', estimatedDuration: 14 },
    { id: 'consolidation', name: 'Review Consolidation', estimatedDuration: 3 },
    { id: 'revision', name: 'Author Revision', estimatedDuration: 10 },
    { id: 'rereview', name: 'Re-review', estimatedDuration: 7 },
    { id: 'editorial', name: 'Editorial Decision', estimatedDuration: 2 },
    { id: 'copyediting', name: 'Copyediting', estimatedDuration: 5 },
    { id: 'layout', name: 'Layout & Typesetting', estimatedDuration: 4 },
    { id: 'proof', name: 'Final Proof', estimatedDuration: 3 },
    { id: 'publication', name: 'Publication', estimatedDuration: 2 },
  ];

  const totalDuration = timelineStages.reduce((sum, stage) => sum + stage.estimatedDuration, 0);
  const projectedDate = new Date();
  projectedDate.setDate(projectedDate.getDate() + totalDuration);

  const delayRisk = totalDuration > 55 ? 'High' : totalDuration > 45 ? 'Moderate' : 'Low';

  const agreementChecklist = [
    { id: 'agreement_reviewed', label: 'Publication agreement reviewed', completed: true },
    { id: 'workflow_understood', label: 'Editorial workflow understood', completed: true },
    { id: 'timeline_acknowledged', label: 'Timeline recommendations acknowledged', completed: true },
    { id: 'ethics_confirmed', label: 'Ethical compliance confirmed', completed: true },
    { id: 'responsibilities_acknowledged', label: 'Publication responsibilities acknowledged', completed: true },
  ];

  const handleMakeDecision = () => {
    if (!decision) {
      alert('Please select a decision (Proceed or Withdraw) before continuing.');
      return;
    }
    if (decision === 'withdraw' && !withdrawalReason.trim()) {
      alert('Please provide a reason for withdrawal.');
      return;
    }
    setShowConfirmation(true);
  };

  const handleConfirmDecision = () => {
    if (decision === 'proceed') {
      onProceed();
    } else {
      onWithdraw();
    }
  };

  if (showConfirmation) {
    return (
      <div className="min-h-screen" style={{ backgroundColor: '#F7F8FA' }}>
        <div className="text-white py-8 px-6" style={{ backgroundColor: '#0F2D5E' }}>
          <div className="max-w-6xl mx-auto">
            <h1 className="text-[32px] font-semibold" style={{ fontFamily: 'Inter, sans-serif' }}>Decision Confirmation</h1>
            <p className="mt-2 text-[14px]" style={{ fontFamily: 'DM Sans, sans-serif', color: '#D6E8F7' }}>
              {decision === 'proceed'
                ? 'Confirm your decision to proceed with publication'
                : 'Confirm manuscript withdrawal'}
            </p>
          </div>
        </div>

        <div className="max-w-4xl mx-auto py-8 px-6">
          <div className="bg-white rounded-xl p-8 mb-6" style={{ border: '0.5px solid #EAEDF2' }}>
            <div className="flex items-start gap-4 mb-6">
              <div
                className={`p-3 rounded-sm ${
                  decision === 'proceed' ? 'bg-green-100' : 'bg-red-100'
                }`}
              >
                {decision === 'proceed' ? (
                  <CheckCircle className="w-8 h-8 text-green-700" />
                ) : (
                  <XCircle className="w-8 h-8 text-red-700" />
                )}
              </div>
              <div>
                <h2 className="text-2xl font-serif text-[#1a1f2e] mb-2">
                  {decision === 'proceed'
                    ? 'Proceeding with Publication Workflow'
                    : 'Withdrawing Manuscript Submission'}
                </h2>
                <p className="text-gray-700">
                  {decision === 'proceed'
                    ? 'You are about to formally commit to the publication workflow. Your manuscript will move to the next stage for editor assignment.'
                    : 'You are about to withdraw your manuscript from the publication process. This action will cancel the submission.'}
                </p>
              </div>
            </div>

            <div className="border-t border-[#d1c7b3] pt-6 mt-6">
              <h3 className="text-lg font-serif text-[#1a1f2e] mb-4">Manuscript Details</h3>
              <div className="space-y-3">
                <div className="flex justify-between py-2">
                  <span className="text-gray-600">Title:</span>
                  <span className="font-medium text-gray-900 text-right max-w-md">
                    {manuscript.title}
                  </span>
                </div>
                <div className="flex justify-between py-2">
                  <span className="text-gray-600">Manuscript ID:</span>
                  <span className="font-medium text-gray-900">{manuscript.id}</span>
                </div>
                <div className="flex justify-between py-2">
                  <span className="text-gray-600">Category:</span>
                  <span className="font-medium text-gray-900">{manuscript.category}</span>
                </div>
                {decision === 'proceed' && (
                  <>
                    <div className="flex justify-between py-2">
                      <span className="text-gray-600">Estimated Timeline:</span>
                      <span className="font-medium text-gray-900">{totalDuration} days</span>
                    </div>
                    <div className="flex justify-between py-2">
                      <span className="text-gray-600">Target Publication:</span>
                      <span className="font-medium text-gray-900">
                        {projectedDate.toLocaleDateString('en-US', {
                          month: 'long',
                          day: 'numeric',
                          year: 'numeric',
                        })}
                      </span>
                    </div>
                  </>
                )}
              </div>
            </div>

            {decision === 'proceed' && (
              <div className="border-t border-[#d1c7b3] pt-6 mt-6">
                <h3 className="text-lg font-serif text-[#1a1f2e] mb-4">Next Steps</h3>
                <div className="space-y-3">
                  <div className="flex items-start gap-3">
                    <CheckCircle className="w-5 h-5 text-green-600 mt-0.5 flex-shrink-0" />
                    <div>
                      <p className="font-medium text-gray-900">Editor Assignment</p>
                      <p className="text-sm text-gray-600">
                        Editor-in-Chief will assign an editor to your manuscript
                      </p>
                    </div>
                  </div>
                  <div className="flex items-start gap-3">
                    <CheckCircle className="w-5 h-5 text-green-600 mt-0.5 flex-shrink-0" />
                    <div>
                      <p className="font-medium text-gray-900">Reviewer Selection</p>
                      <p className="text-sm text-gray-600">
                        Editor will select and invite peer reviewers
                      </p>
                    </div>
                  </div>
                  <div className="flex items-start gap-3">
                    <CheckCircle className="w-5 h-5 text-green-600 mt-0.5 flex-shrink-0" />
                    <div>
                      <p className="font-medium text-gray-900">Peer Review Process</p>
                      <p className="text-sm text-gray-600">
                        Reviewers will evaluate your manuscript and provide feedback
                      </p>
                    </div>
                  </div>
                  <div className="flex items-start gap-3">
                    <CheckCircle className="w-5 h-5 text-green-600 mt-0.5 flex-shrink-0" />
                    <div>
                      <p className="font-medium text-gray-900">Dashboard Notifications</p>
                      <p className="text-sm text-gray-600">
                        You will receive updates on your dashboard at each stage
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {decision === 'withdraw' && (
              <div className="border-t border-[#d1c7b3] pt-6 mt-6">
                <h3 className="text-lg font-serif text-[#1a1f2e] mb-4">Withdrawal Reason</h3>
                <div className="bg-gray-50 border border-[#d1c7b3] rounded-sm p-4">
                  <p className="text-sm text-gray-900 whitespace-pre-wrap">{withdrawalReason}</p>
                </div>
              </div>
            )}

            {decisionRemarks && (
              <div className="border-t border-[#d1c7b3] pt-6 mt-6">
                <h3 className="text-lg font-serif text-[#1a1f2e] mb-4">Additional Remarks</h3>
                <div className="bg-gray-50 border border-[#d1c7b3] rounded-sm p-4">
                  <p className="text-sm text-gray-900 whitespace-pre-wrap">{decisionRemarks}</p>
                </div>
              </div>
            )}
          </div>

          <div className="flex items-center justify-between">
            <button
              onClick={() => setShowConfirmation(false)}
              className="px-6 py-3 bg-white text-gray-700 rounded-lg hover:bg-gray-50 transition-colors font-semibold"
              style={{ border: '0.5px solid #EAEDF2', fontFamily: 'DM Sans, sans-serif' }}
            >
              Back to Review
            </button>
            <button
              onClick={handleConfirmDecision}
              className={`px-8 py-3 rounded-lg transition-colors font-semibold flex items-center gap-2 ${
                decision === 'proceed'
                  ? 'text-white'
                  : 'bg-red-600 text-white hover:bg-red-700'
              }`}
              style={decision === 'proceed' ? { backgroundColor: '#0F2D5E', fontFamily: 'DM Sans, sans-serif' } : { fontFamily: 'DM Sans, sans-serif' }}
              onMouseEnter={(e) => decision === 'proceed' ? e.currentTarget.style.backgroundColor = '#1A4A8A' : null}
              onMouseLeave={(e) => decision === 'proceed' ? e.currentTarget.style.backgroundColor = '#0F2D5E' : null}
            >
              {decision === 'proceed' ? (
                <>
                  <CheckCircle className="w-5 h-5" />
                  Confirm & Proceed
                </>
              ) : (
                <>
                  <XCircle className="w-5 h-5" />
                  Confirm Withdrawal
                </>
              )}
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen" style={{ backgroundColor: '#F7F8FA' }}>
      <div className="text-white py-8 px-6" style={{ backgroundColor: '#0F2D5E' }}>
        <div className="max-w-6xl mx-auto">
          <button
            onClick={onBack}
            className="flex items-center gap-2 mb-4 transition-colors hover:opacity-80"
            style={{ color: '#4D9DE0', fontFamily: 'DM Sans, sans-serif' }}
          >
            <ArrowLeft className="w-4 h-4" />
            Back to Dashboard
          </button>
          <h1 className="text-[32px] font-semibold" style={{ fontFamily: 'Inter, sans-serif' }}>Final Author Decision</h1>
          <p className="mt-2 text-[14px]" style={{ fontFamily: 'DM Sans, sans-serif', color: '#D6E8F7' }}>
            Decide whether to proceed with publication workflow or withdraw manuscript
          </p>
        </div>
      </div>

      <div className="max-w-6xl mx-auto py-8 px-6 space-y-6">
        {/* Manuscript Summary */}
        <div className="bg-white rounded-xl p-6" style={{ border: '0.5px solid #EAEDF2' }}>
          <div className="flex items-start gap-4">
            <div className="p-2 bg-[#1a1f2e] rounded-sm">
              <FileText className="w-6 h-6 text-[#f5f1e8]" />
            </div>
            <div className="flex-1">
              <h2 className="text-xl font-serif text-[#1a1f2e] mb-1">{manuscript.title}</h2>
              <p className="text-sm text-gray-600 mb-3">
                {manuscript.id} • {manuscript.category} • by {manuscript.authorName}
              </p>
              <div className="flex items-center gap-4 text-sm text-gray-600">
                <span className="flex items-center gap-1">
                  <Calendar className="w-4 h-4" />
                  Submitted: {manuscript.submittedAt.toLocaleDateString()}
                </span>
                <span className="flex items-center gap-1">
                  <Activity className="w-4 h-4" />
                  Version: {manuscript.version}
                </span>
                <span className="flex items-center gap-1">
                  <Target className="w-4 h-4" />
                  Stage: Agreement Review
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Decision Pending Alert */}
        <div className="bg-amber-50 border border-amber-200 rounded-sm p-4 flex items-start gap-3">
          <AlertCircle className="w-5 h-5 text-amber-700 mt-0.5 flex-shrink-0" />
          <div>
            <p className="font-medium text-amber-900">Final Decision Required</p>
            <p className="text-sm text-amber-700 mt-1">
              Please review the information below and make your final decision to either proceed with
              the publication workflow or withdraw your manuscript submission.
            </p>
          </div>
        </div>

        {/* Workflow & Timeline Summary */}
        <div className="bg-white border border-[#d1c7b3] rounded-sm">
          <div className="bg-[#1a1f2e] text-[#f5f1e8] px-6 py-4 border-b border-[#d1c7b3] flex items-center gap-2">
            <Clock className="w-5 h-5" />
            <h2 className="text-xl font-serif">Workflow & Timeline Summary</h2>
          </div>

          <div className="p-6">
            <div className="grid grid-cols-3 gap-4 mb-6">
              <div className="bg-purple-50 border border-purple-200 rounded-sm p-4">
                <p className="text-sm text-purple-700 font-medium mb-1">Estimated Duration</p>
                <p className="text-3xl font-bold text-purple-900">{totalDuration}</p>
                <p className="text-xs text-purple-600 mt-1">Days</p>
              </div>

              <div
                className={`rounded-sm p-4 border ${
                  delayRisk === 'Low'
                    ? 'bg-green-50 border-green-200'
                    : delayRisk === 'Moderate'
                    ? 'bg-amber-50 border-amber-200'
                    : 'bg-red-50 border-red-200'
                }`}
              >
                <p
                  className={`text-sm font-medium mb-1 ${
                    delayRisk === 'Low'
                      ? 'text-green-700'
                      : delayRisk === 'Moderate'
                      ? 'text-amber-700'
                      : 'text-red-700'
                  }`}
                >
                  Delay Risk
                </p>
                <p
                  className={`text-3xl font-bold ${
                    delayRisk === 'Low'
                      ? 'text-green-900'
                      : delayRisk === 'Moderate'
                      ? 'text-amber-900'
                      : 'text-red-900'
                  }`}
                >
                  {delayRisk}
                </p>
              </div>

              <div className="bg-indigo-50 border border-indigo-200 rounded-sm p-4">
                <p className="text-sm text-indigo-700 font-medium mb-1">Target Date</p>
                <p className="text-lg font-bold text-indigo-900">
                  {projectedDate.toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
                </p>
                <p className="text-xs text-indigo-600 mt-1">{projectedDate.getFullYear()}</p>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-6">
              <div>
                <h3 className="text-sm font-semibold text-gray-900 mb-3">
                  Publication Readiness
                </h3>
                <div className="space-y-2">
                  <div className="flex items-center gap-2">
                    <CheckCircle className="w-4 h-4 text-green-600 flex-shrink-0" />
                    <span className="text-sm text-gray-700">Manuscript quality verified</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <CheckCircle className="w-4 h-4 text-green-600 flex-shrink-0" />
                    <span className="text-sm text-gray-700">Agreement terms reviewed</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <CheckCircle className="w-4 h-4 text-green-600 flex-shrink-0" />
                    <span className="text-sm text-gray-700">Timeline feasibility assessed</span>
                  </div>
                </div>
              </div>

              <div>
                <h3 className="text-sm font-semibold text-gray-900 mb-3">Workflow Commitment</h3>
                <div className="space-y-2">
                  <div className="flex items-center gap-2">
                    <CheckCircle className="w-4 h-4 text-green-600 flex-shrink-0" />
                    <span className="text-sm text-gray-700">Author availability confirmed</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <CheckCircle className="w-4 h-4 text-green-600 flex-shrink-0" />
                    <span className="text-sm text-gray-700">Revision responsibilities understood</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <CheckCircle className="w-4 h-4 text-green-600 flex-shrink-0" />
                    <span className="text-sm text-gray-700">Communication channels established</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Agreement Confirmation Checklist */}
        <div className="bg-white border border-[#d1c7b3] rounded-sm">
          <div className="bg-[#1a1f2e] text-[#f5f1e8] px-6 py-4 border-b border-[#d1c7b3] flex items-center gap-2">
            <CheckSquare className="w-5 h-5" />
            <h2 className="text-xl font-serif">Agreement Confirmation Status</h2>
          </div>

          <div className="p-6 space-y-3">
            {agreementChecklist.map((item) => (
              <div
                key={item.id}
                className="flex items-center justify-between p-3 bg-green-50 border border-green-200 rounded-sm"
              >
                <div className="flex items-center gap-3">
                  <CheckCircle className="w-5 h-5 text-green-600 flex-shrink-0" />
                  <span className="text-sm font-medium text-gray-900">{item.label}</span>
                </div>
                <span className="text-xs font-medium text-green-700 px-2 py-1 bg-green-100 rounded">
                  Completed
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* Decision Assessment */}
        <div className="bg-white border border-[#d1c7b3] rounded-sm">
          <div className="bg-[#1a1f2e] text-[#f5f1e8] px-6 py-4 border-b border-[#d1c7b3] flex items-center gap-2">
            <TrendingUp className="w-5 h-5" />
            <h2 className="text-xl font-serif">Editorial Assessment Overview</h2>
          </div>

          <div className="p-6">
            <div className="grid grid-cols-2 gap-6">
              <div className="border border-[#d1c7b3] rounded-sm p-4">
                <div className="flex items-center gap-2 mb-3">
                  <CheckCircle className="w-5 h-5 text-green-600" />
                  <h3 className="font-semibold text-gray-900">Editorial Recommendation</h3>
                </div>
                <p className="text-sm text-gray-700 mb-2">
                  The editorial board has assessed your manuscript and recommends proceeding with the
                  peer review process.
                </p>
                <div className="flex items-center gap-2 mt-3">
                  <span className="px-3 py-1 bg-green-100 text-green-800 text-xs font-medium rounded">
                    Recommended
                  </span>
                </div>
              </div>

              <div className="border border-[#d1c7b3] rounded-sm p-4">
                <div className="flex items-center gap-2 mb-3">
                  <Target className="w-5 h-5 text-blue-600" />
                  <h3 className="font-semibold text-gray-900">Workflow Readiness</h3>
                </div>
                <p className="text-sm text-gray-700 mb-2">
                  Your manuscript meets all requirements for entering the publication workflow and is
                  ready for the next stage.
                </p>
                <div className="flex items-center gap-2 mt-3">
                  <span className="px-3 py-1 bg-blue-100 text-blue-800 text-xs font-medium rounded">
                    Ready
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Final Decision Panel */}
        <div className="bg-white border border-[#d1c7b3] rounded-sm">
          <div className="bg-[#1a1f2e] text-[#f5f1e8] px-6 py-4 border-b border-[#d1c7b3]">
            <h2 className="text-xl font-serif">Final Decision</h2>
          </div>

          <div className="p-6 space-y-6">
            <div>
              <label className="block text-sm font-semibold text-gray-900 mb-3">
                Select Your Decision
              </label>
              <div className="grid grid-cols-2 gap-4">
                <button
                  onClick={() => setDecision('proceed')}
                  className={`p-6 border-2 rounded-sm transition-all ${
                    decision === 'proceed'
                      ? 'border-green-500 bg-green-50'
                      : 'border-gray-300 hover:border-green-300 hover:bg-green-50'
                  }`}
                >
                  <div className="flex flex-col items-center gap-3">
                    <div
                      className={`p-3 rounded-sm ${
                        decision === 'proceed' ? 'bg-green-500' : 'bg-gray-200'
                      }`}
                    >
                      <ThumbsUp
                        className={`w-8 h-8 ${
                          decision === 'proceed' ? 'text-white' : 'text-gray-600'
                        }`}
                      />
                    </div>
                    <div className="text-center">
                      <p className="font-semibold text-gray-900 mb-1">Proceed with Publication</p>
                      <p className="text-sm text-gray-600">
                        Continue to peer review and publication workflow
                      </p>
                    </div>
                  </div>
                </button>

                <button
                  onClick={() => setDecision('withdraw')}
                  className={`p-6 border-2 rounded-sm transition-all ${
                    decision === 'withdraw'
                      ? 'border-red-500 bg-red-50'
                      : 'border-gray-300 hover:border-red-300 hover:bg-red-50'
                  }`}
                >
                  <div className="flex flex-col items-center gap-3">
                    <div
                      className={`p-3 rounded-sm ${
                        decision === 'withdraw' ? 'bg-red-500' : 'bg-gray-200'
                      }`}
                    >
                      <ThumbsDown
                        className={`w-8 h-8 ${
                          decision === 'withdraw' ? 'text-white' : 'text-gray-600'
                        }`}
                      />
                    </div>
                    <div className="text-center">
                      <p className="font-semibold text-gray-900 mb-1">Withdraw Manuscript</p>
                      <p className="text-sm text-gray-600">
                        Cancel submission and exit publication process
                      </p>
                    </div>
                  </div>
                </button>
              </div>
            </div>

            {decision === 'withdraw' && (
              <div>
                <label className="block text-sm font-semibold text-gray-900 mb-2">
                  Withdrawal Reason <span className="text-red-600">*</span>
                </label>
                <textarea
                  value={withdrawalReason}
                  onChange={(e) => setWithdrawalReason(e.target.value)}
                  rows={4}
                  placeholder="Please provide a reason for withdrawing your manuscript..."
                  className="w-full border border-gray-300 rounded-sm px-4 py-2.5 focus:ring-2 focus:ring-[#1a1f2e] focus:border-[#1a1f2e] resize-none"
                />
              </div>
            )}

            <div>
              <label className="block text-sm font-semibold text-gray-900 mb-2">
                Decision Remarks (Optional)
              </label>
              <textarea
                value={decisionRemarks}
                onChange={(e) => setDecisionRemarks(e.target.value)}
                rows={4}
                placeholder="Add any additional comments about your decision..."
                className="w-full border border-gray-300 rounded-sm px-4 py-2.5 focus:ring-2 focus:ring-[#1a1f2e] focus:border-[#1a1f2e] resize-none"
              />
            </div>

            {decision === 'proceed' && (
              <div>
                <label className="block text-sm font-semibold text-gray-900 mb-2">
                  Timeline Concerns (Optional)
                </label>
                <textarea
                  value={timelineConcerns}
                  onChange={(e) => setTimelineConcerns(e.target.value)}
                  rows={3}
                  placeholder="Share any concerns about the estimated timeline or deadlines..."
                  className="w-full border border-gray-300 rounded-sm px-4 py-2.5 focus:ring-2 focus:ring-[#1a1f2e] focus:border-[#1a1f2e] resize-none"
                />
              </div>
            )}
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex items-center justify-between">
          <button
            onClick={onBack}
            className="px-6 py-3 bg-white border border-[#d1c7b3] text-[#1a1f2e] rounded-sm hover:bg-gray-50 transition-colors font-medium"
          >
            Cancel
          </button>
          <button
            onClick={handleMakeDecision}
            disabled={!decision}
            className="px-8 py-3 bg-[#1a1f2e] text-[#f5f1e8] rounded-sm hover:bg-[#2a3142] transition-colors font-medium flex items-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {decision === 'proceed' ? (
              <>
                <CheckCircle className="w-5 h-5" />
                Submit Decision - Proceed
              </>
            ) : decision === 'withdraw' ? (
              <>
                <XCircle className="w-5 h-5" />
                Submit Decision - Withdraw
              </>
            ) : (
              <>
                <AlertCircle className="w-5 h-5" />
                Select Decision to Continue
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
}
