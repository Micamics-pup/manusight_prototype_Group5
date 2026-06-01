import React, { useState } from 'react';
import {
  ArrowLeft,
  FileText,
  Calendar,
  Clock,
  CheckCircle,
  AlertCircle,
  Download,
  Eye,
  FileDown,
  Activity,
  CheckSquare,
  AlertTriangle,
  Target,
  TrendingUp,
} from 'lucide-react';
import type { Manuscript } from '../types';

interface AuthorAgreementPageProps {
  manuscript: Manuscript;
  onBack: () => void;
  onAgree: () => void;
}

interface TimelineStage {
  id: string;
  name: string;
  estimatedDuration: number;
}

export function AuthorAgreementPage({
  manuscript,
  onBack,
  onAgree,
}: AuthorAgreementPageProps) {
  const [agreementScrolled, setAgreementScrolled] = useState(false);
  const [acknowledgments, setAcknowledgments] = useState({
    publicationProcess: false,
    editorialWorkflow: false,
    authorResponsibilities: false,
    publicationPolicy: false,
    copyrightEthics: false,
    withdrawalConditions: false,
  });
  const [additionalRemarks, setAdditionalRemarks] = useState('');
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

  const allAcknowledged = Object.values(acknowledgments).every((v) => v);

  const handleAgreeClick = () => {
    if (!allAcknowledged) {
      alert('Please acknowledge all agreement terms before proceeding.');
      return;
    }
    if (!agreementScrolled) {
      alert('Please review the complete agreement document before proceeding.');
      return;
    }
    setShowConfirmation(true);
  };

  const handleConfirmAgree = () => {
    onAgree();
  };

  if (showConfirmation) {
    return (
      <div className="min-h-screen" style={{ backgroundColor: '#F7F8FA' }}>
        <div className="text-white py-8 px-6" style={{ backgroundColor: '#0F2D5E' }}>
          <div className="max-w-6xl mx-auto">
            <h1 className="text-[32px] font-semibold" style={{ fontFamily: 'Inter, sans-serif' }}>Agreement Confirmation</h1>
            <p className="mt-2 text-[14px]" style={{ fontFamily: 'DM Sans, sans-serif', color: '#D6E8F7' }}>Confirm your decision to proceed with publication</p>
          </div>
        </div>

        <div className="max-w-4xl mx-auto py-8 px-6">
          <div className="bg-white rounded-xl p-8 mb-6" style={{ border: '0.5px solid #EAEDF2' }}>
            <div className="flex items-start gap-4 mb-6">
              <div className="p-3 bg-green-100 rounded-sm">
                <CheckCircle className="w-8 h-8 text-green-700" />
              </div>
              <div>
                <h2 className="text-2xl font-serif text-[#1a1f2e] mb-2">
                  Ready to Proceed with Publication
                </h2>
                <p className="text-gray-700">
                  You are about to formally accept the publication agreement and commit to the
                  publication workflow for your manuscript.
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
              </div>
            </div>

            <div className="border-t border-[#d1c7b3] pt-6 mt-6">
              <h3 className="text-lg font-serif text-[#1a1f2e] mb-4">Your Commitments</h3>
              <div className="space-y-3">
                <div className="flex items-start gap-3">
                  <CheckCircle className="w-5 h-5 text-green-600 mt-0.5 flex-shrink-0" />
                  <p className="text-sm text-gray-700">
                    Agree to publication process overview and workflow conditions
                  </p>
                </div>
                <div className="flex items-start gap-3">
                  <CheckCircle className="w-5 h-5 text-green-600 mt-0.5 flex-shrink-0" />
                  <p className="text-sm text-gray-700">
                    Accept responsibility for timely revisions and responses
                  </p>
                </div>
                <div className="flex items-start gap-3">
                  <CheckCircle className="w-5 h-5 text-green-600 mt-0.5 flex-shrink-0" />
                  <p className="text-sm text-gray-700">
                    Acknowledge copyright and ethical compliance requirements
                  </p>
                </div>
                <div className="flex items-start gap-3">
                  <CheckCircle className="w-5 h-5 text-green-600 mt-0.5 flex-shrink-0" />
                  <p className="text-sm text-gray-700">
                    Understand withdrawal conditions and timeline expectations
                  </p>
                </div>
              </div>
            </div>
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
              onClick={handleConfirmAgree}
              className="px-8 py-3 text-white rounded-lg transition-colors font-semibold flex items-center gap-2"
              style={{ backgroundColor: '#0F2D5E', fontFamily: 'DM Sans, sans-serif' }}
              onMouseEnter={(e) => e.currentTarget.style.backgroundColor = '#1A4A8A'}
              onMouseLeave={(e) => e.currentTarget.style.backgroundColor = '#0F2D5E'}
            >
              <CheckCircle className="w-5 h-5" />
              Confirm & Proceed
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
          <h1 className="text-[32px] font-semibold" style={{ fontFamily: 'Inter, sans-serif' }}>Publication Agreement Review</h1>
          <p className="mt-2 text-[14px]" style={{ fontFamily: 'DM Sans, sans-serif', color: '#D6E8F7' }}>
            Review and accept the publication terms and workflow conditions
          </p>
        </div>
      </div>

      <div className="max-w-6xl mx-auto py-8 px-6 space-y-6">
        {/* Manuscript Summary */}
        <div className="bg-white rounded-xl p-6" style={{ border: '0.5px solid #EAEDF2' }}>
          <div className="flex items-start justify-between">
            <div className="flex items-start gap-4 flex-1">
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
                </div>
              </div>
            </div>
            <div className="flex flex-col gap-2">
              <button className="px-4 py-2 bg-white border border-[#d1c7b3] text-[#1a1f2e] rounded-sm hover:bg-gray-50 transition-colors text-sm flex items-center gap-2">
                <Eye className="w-4 h-4" />
                View Manuscript
              </button>
              <button className="px-4 py-2 bg-white border border-[#d1c7b3] text-[#1a1f2e] rounded-sm hover:bg-gray-50 transition-colors text-sm flex items-center gap-2">
                <Download className="w-4 h-4" />
                Download Files
              </button>
            </div>
          </div>
        </div>

        {/* Agreement Status Indicator */}
        <div className="bg-blue-50 border border-blue-200 rounded-sm p-4 flex items-start gap-3">
          <AlertCircle className="w-5 h-5 text-blue-700 mt-0.5 flex-shrink-0" />
          <div>
            <p className="font-medium text-blue-900">Agreement Pending Review</p>
            <p className="text-sm text-blue-700 mt-1">
              Please review all sections, acknowledge the terms, and confirm your agreement to proceed
              with the publication workflow.
            </p>
          </div>
        </div>

        {/* Timeline Recommendation */}
        <div className="bg-white rounded-xl" style={{ border: '0.5px solid #EAEDF2' }}>
          <div className="text-white px-6 py-4 flex items-center gap-2" style={{ backgroundColor: '#0F2D5E', borderTopLeftRadius: '12px', borderTopRightRadius: '12px' }}>
            <Clock className="w-5 h-5" />
            <h2 className="text-[22px] font-semibold" style={{ fontFamily: 'Inter, sans-serif' }}>Timeline Recommendation</h2>
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

            <div className="border-t border-[#d1c7b3] pt-4">
              <h3 className="text-sm font-semibold text-gray-900 mb-3">
                Stage-by-Stage Breakdown
              </h3>
              <div className="space-y-2">
                {timelineStages.map((stage, index) => (
                  <div
                    key={stage.id}
                    className="flex items-center justify-between py-2 px-3 hover:bg-gray-50 rounded-sm"
                  >
                    <div className="flex items-center gap-3">
                      <span className="text-sm font-medium text-gray-500 w-6">{index + 1}.</span>
                      <span className="text-sm font-medium text-gray-900">{stage.name}</span>
                    </div>
                    <span className="text-sm font-semibold text-gray-900">
                      {stage.estimatedDuration} days
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Publication Agreement Overview */}
        <div className="bg-white rounded-xl" style={{ border: '0.5px solid #EAEDF2' }}>
          <div className="text-white px-6 py-4 flex items-center gap-2" style={{ backgroundColor: '#0F2D5E', borderTopLeftRadius: '12px', borderTopRightRadius: '12px' }}>
            <FileText className="w-5 h-5" />
            <h2 className="text-[22px] font-semibold" style={{ fontFamily: 'Inter, sans-serif' }}>Publication Agreement Overview</h2>
          </div>

          <div className="p-6 space-y-4">
            <div className="border border-[#d1c7b3] rounded-sm">
              <div
                className="max-h-96 overflow-y-auto p-6 prose prose-sm max-w-none"
                onScroll={(e) => {
                  const target = e.target as HTMLDivElement;
                  if (
                    target.scrollHeight - target.scrollTop - target.clientHeight < 50 &&
                    !agreementScrolled
                  ) {
                    setAgreementScrolled(true);
                  }
                }}
              >
                <h3 className="font-serif text-[#1a1f2e]">Publication Process Overview</h3>
                <p>
                  By accepting this agreement, you commit to participate in the full publication
                  workflow as outlined by the editorial board. This includes peer review, revision
                  cycles, copyediting, and final production stages.
                </p>

                <h3 className="font-serif text-[#1a1f2e] mt-4">Editorial Workflow</h3>
                <p>
                  Your manuscript will undergo rigorous peer review by experts in your field.
                  Reviewers will provide detailed feedback, and you may be required to make
                  revisions based on their recommendations and editorial decisions.
                </p>

                <h3 className="font-serif text-[#1a1f2e] mt-4">Author Responsibilities</h3>
                <ul>
                  <li>Respond to reviewer comments within the specified timeframe</li>
                  <li>Submit revised manuscripts with detailed response letters</li>
                  <li>Review and approve copyedited versions promptly</li>
                  <li>Verify final proofs for accuracy before publication</li>
                  <li>Maintain communication with the editorial team throughout the process</li>
                </ul>

                <h3 className="font-serif text-[#1a1f2e] mt-4">Publication Policy</h3>
                <p>
                  All manuscripts must comply with our publication ethics, including originality,
                  proper attribution, and disclosure of conflicts of interest. Any violations may
                  result in manuscript rejection or retraction post-publication.
                </p>

                <h3 className="font-serif text-[#1a1f2e] mt-4">Copyright and Ethics</h3>
                <p>
                  You confirm that the manuscript is original work, does not infringe on any
                  copyright, and has not been published elsewhere. You agree to transfer copyright
                  to the publisher upon acceptance, while retaining certain author rights as
                  outlined in our author rights policy.
                </p>

                <h3 className="font-serif text-[#1a1f2e] mt-4">Withdrawal Conditions</h3>
                <p>
                  You may withdraw your manuscript at any stage before final acceptance. However,
                  withdrawal after editorial approval may result in restrictions on future
                  submissions. Please communicate withdrawal decisions promptly to the editorial
                  team.
                </p>

                <div className="bg-blue-50 border-l-4 border-blue-500 p-4 mt-4">
                  <p className="text-sm text-blue-900">
                    <strong>Important:</strong> By scrolling to the bottom of this agreement and
                    checking all acknowledgment boxes below, you confirm that you have read,
                    understood, and agree to all terms and conditions outlined in this publication
                    agreement.
                  </p>
                </div>
              </div>
            </div>

            {!agreementScrolled && (
              <div className="flex items-start gap-2 text-sm text-amber-700 bg-amber-50 border border-amber-200 rounded-sm p-3">
                <AlertTriangle className="w-4 h-4 mt-0.5 flex-shrink-0" />
                <p>Please scroll through the entire agreement document to continue.</p>
              </div>
            )}
          </div>
        </div>

        {/* Agreement Acknowledgment */}
        <div className="bg-white border border-[#d1c7b3] rounded-sm">
          <div className="bg-[#1a1f2e] text-[#f5f1e8] px-6 py-4 border-b border-[#d1c7b3] flex items-center gap-2">
            <CheckSquare className="w-5 h-5" />
            <h2 className="text-xl font-serif">Required Acknowledgments</h2>
          </div>

          <div className="p-6 space-y-4">
            {[
              {
                key: 'publicationProcess',
                label: 'I have reviewed and understand the publication process overview',
              },
              {
                key: 'editorialWorkflow',
                label: 'I understand the editorial workflow and review process',
              },
              {
                key: 'authorResponsibilities',
                label: 'I acknowledge my responsibilities as an author throughout the workflow',
              },
              {
                key: 'publicationPolicy',
                label: 'I agree to comply with all publication policies and standards',
              },
              {
                key: 'copyrightEthics',
                label:
                  'I confirm the manuscript meets copyright and ethical compliance requirements',
              },
              {
                key: 'withdrawalConditions',
                label: 'I understand the conditions and implications of manuscript withdrawal',
              },
            ].map(({ key, label }) => (
              <label
                key={key}
                className="flex items-start gap-3 p-3 border border-gray-200 rounded-sm hover:bg-gray-50 cursor-pointer"
              >
                <input
                  type="checkbox"
                  checked={acknowledgments[key as keyof typeof acknowledgments]}
                  onChange={(e) =>
                    setAcknowledgments((prev) => ({ ...prev, [key]: e.target.checked }))
                  }
                  className="mt-1 w-5 h-5 text-[#1a1f2e] border-gray-300 rounded focus:ring-[#1a1f2e]"
                />
                <span className="text-sm text-gray-900">{label}</span>
              </label>
            ))}

            <div className="flex items-center gap-2 mt-4 p-4 bg-green-50 border border-green-200 rounded-sm">
              <CheckCircle
                className={`w-5 h-5 ${allAcknowledged ? 'text-green-600' : 'text-gray-400'}`}
              />
              <span
                className={`text-sm font-medium ${
                  allAcknowledged ? 'text-green-900' : 'text-gray-600'
                }`}
              >
                {allAcknowledged
                  ? 'All acknowledgments completed'
                  : `${
                      Object.values(acknowledgments).filter(Boolean).length
                    }/${Object.keys(acknowledgments).length} completed`}
              </span>
            </div>
          </div>
        </div>

        {/* Additional Remarks */}
        <div className="bg-white border border-[#d1c7b3] rounded-sm">
          <div className="bg-[#1a1f2e] text-[#f5f1e8] px-6 py-4 border-b border-[#d1c7b3]">
            <h2 className="text-xl font-serif">Additional Remarks (Optional)</h2>
          </div>

          <div className="p-6">
            <textarea
              value={additionalRemarks}
              onChange={(e) => setAdditionalRemarks(e.target.value)}
              rows={4}
              placeholder="Add any additional comments, questions, or concerns about the agreement or timeline..."
              className="w-full border border-gray-300 rounded-sm px-4 py-2.5 focus:ring-2 focus:ring-[#1a1f2e] focus:border-[#1a1f2e] resize-none"
            />
          </div>
        </div>

        {/* File Downloads */}
        <div className="bg-white border border-[#d1c7b3] rounded-sm">
          <div className="bg-[#1a1f2e] text-[#f5f1e8] px-6 py-4 border-b border-[#d1c7b3] flex items-center gap-2">
            <FileDown className="w-5 h-5" />
            <h2 className="text-xl font-serif">Documents & Resources</h2>
          </div>

          <div className="p-6 space-y-3">
            <button className="w-full flex items-center justify-between p-4 border border-[#d1c7b3] rounded-sm hover:bg-gray-50 transition-colors">
              <div className="flex items-center gap-3">
                <FileText className="w-5 h-5 text-gray-600" />
                <div className="text-left">
                  <p className="font-medium text-gray-900">Publication Agreement Document</p>
                  <p className="text-sm text-gray-600">PDF • 245 KB</p>
                </div>
              </div>
              <Download className="w-5 h-5 text-gray-600" />
            </button>

            <button className="w-full flex items-center justify-between p-4 border border-[#d1c7b3] rounded-sm hover:bg-gray-50 transition-colors">
              <div className="flex items-center gap-3">
                <FileText className="w-5 h-5 text-gray-600" />
                <div className="text-left">
                  <p className="font-medium text-gray-900">Workflow Summary</p>
                  <p className="text-sm text-gray-600">PDF • 182 KB</p>
                </div>
              </div>
              <Download className="w-5 h-5 text-gray-600" />
            </button>

            <button className="w-full flex items-center justify-between p-4 border border-[#d1c7b3] rounded-sm hover:bg-gray-50 transition-colors">
              <div className="flex items-center gap-3">
                <FileText className="w-5 h-5 text-gray-600" />
                <div className="text-left">
                  <p className="font-medium text-gray-900">Author Guidelines</p>
                  <p className="text-sm text-gray-600">PDF • 321 KB</p>
                </div>
              </div>
              <Download className="w-5 h-5 text-gray-600" />
            </button>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex items-center justify-between">
          <button
            onClick={onBack}
            className="px-6 py-3 bg-white border border-[#d1c7b3] text-[#1a1f2e] rounded-sm hover:bg-gray-50 transition-colors font-medium"
          >
            Save for Later
          </button>
          <div className="flex items-center gap-3">
            <button
              onClick={onBack}
              className="px-6 py-3 bg-white border border-red-300 text-red-700 rounded-sm hover:bg-red-50 transition-colors font-medium"
            >
              Decline Agreement
            </button>
            <button
              onClick={handleAgreeClick}
              disabled={!allAcknowledged || !agreementScrolled}
              className="px-8 py-3 bg-[#1a1f2e] text-[#f5f1e8] rounded-sm hover:bg-[#2a3142] transition-colors font-medium flex items-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <CheckCircle className="w-5 h-5" />
              Agree & Proceed
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
