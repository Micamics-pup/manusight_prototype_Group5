import React, { useState } from 'react';
import {
  ArrowLeft,
  FileText,
  Clock,
  CheckCircle,
  XCircle,
  AlertCircle,
  Calendar,
  User,
  Shield,
  Tag,
  Eye,
  Send,
  Mail,
  AlertTriangle,
} from 'lucide-react';
import type { Manuscript } from '../types';

interface ReviewerResponsePageProps {
  manuscript: Manuscript;
  invitationId?: string;
  onBack?: () => void;
  onResponseSubmitted?: (decision: string, data: any) => void;
}

export function ReviewerResponsePage({
  manuscript,
  invitationId = 'INV-' + Date.now().toString().slice(-6),
  onBack,
  onResponseSubmitted,
}: ReviewerResponsePageProps) {
  // Mock invitation data
  const invitationData = {
    invitationId,
    manuscriptId: manuscript.id,
    manuscriptTitle: manuscript.title,
    researchArea: manuscript.category,
    reviewType: 'Single-Blind Review',
    requestedDeadline: new Date(Date.now() + 14 * 24 * 60 * 60 * 1000), // 14 days from now
    dateInvited: new Date(),
    assigningEditor: 'Dr. Sarah Johnson',
    reviewerInstructions: 'Please focus on methodology accuracy and dataset validation. Pay special attention to the statistical analysis section.',
    priorityLevel: 'Normal',
    estimatedDuration: 12,
    complexityLevel: 'Moderate',
  };

  // Reviewer inputs
  const [reviewerDecision, setReviewerDecision] = useState('');
  const [availabilityConfirmation, setAvailabilityConfirmation] = useState('');
  const [extensionRequest, setExtensionRequest] = useState('');
  const [reviewerMessage, setReviewerMessage] = useState('');

  // UI state
  const [responseSubmitted, setResponseSubmitted] = useState(false);
  const [showExtensionField, setShowExtensionField] = useState(false);

  const handleSubmitResponse = () => {
    if (!reviewerDecision) {
      alert('Please make a decision before submitting.');
      return;
    }

    if (reviewerDecision === 'accept' && !availabilityConfirmation) {
      alert('Please confirm your availability.');
      return;
    }

    const responseData = {
      invitationId,
      manuscriptId: manuscript.id,
      decision: reviewerDecision,
      availabilityConfirmation,
      extensionRequest: showExtensionField ? extensionRequest : null,
      reviewerMessage,
      responseDate: new Date(),
    };

    setResponseSubmitted(true);

    if (onResponseSubmitted) {
      onResponseSubmitted(reviewerDecision, responseData);
    }
  };

  // Success state after submission
  if (responseSubmitted) {
    const getResponseContent = () => {
      if (reviewerDecision === 'accept') {
        return {
          icon: <CheckCircle className="w-16 h-16 text-green-600" />,
          title: 'Review Assignment Accepted',
          message: 'Thank you for accepting this review invitation.',
          status: 'Reviewer Assigned',
          notifications: [
            'Acceptance Notification sent to Editor',
            'Review Access Enabled',
            'Timeline Tracking Activated',
            'Manuscript Status Updated',
          ],
          nextStep: 'View Manuscript',
          bgColor: 'bg-green-50',
          borderColor: 'border-green-200',
          buttonColor: 'bg-green-600 hover:bg-green-700',
        };
      } else if (reviewerDecision === 'clarification') {
        return {
          icon: <AlertCircle className="w-16 h-16 text-blue-600" />,
          title: 'Clarification Request Sent',
          message: 'Your request has been sent to the editor.',
          status: 'Awaiting Clarification',
          notifications: [
            'Clarification Request sent to Editor',
            'Invitation Temporarily Pending',
          ],
          nextStep: 'Return to Dashboard',
          bgColor: 'bg-blue-50',
          borderColor: 'border-blue-200',
          buttonColor: 'bg-blue-600 hover:bg-blue-700',
        };
      } else {
        return {
          icon: <XCircle className="w-16 h-16 text-red-600" />,
          title: 'Review Assignment Declined',
          message: 'We understand and thank you for your response.',
          status: 'Reviewer Declined Invitation',
          notifications: [
            'Decline Notification sent to Editor',
            'Reviewer Slot Reopened',
            'Timeline Recalculation Initiated',
          ],
          nextStep: 'Return to Dashboard',
          bgColor: 'bg-red-50',
          borderColor: 'border-red-200',
          buttonColor: 'bg-red-600 hover:bg-red-700',
        };
      }
    };

    const content = getResponseContent();

    return (
      <div className="min-h-screen bg-[#F7F8FA] flex items-center justify-center p-6">
        <div className="max-w-3xl w-full bg-white rounded-sm shadow-xl border border-[#EAEDF2] p-12">
          <div className="text-center">
            <div className={`w-20 h-20 ${content.bgColor} rounded-full flex items-center justify-center mx-auto mb-6`}>
              {content.icon}
            </div>
            <h1 className="text-3xl font-serif font-semibold text-[#0F2D5E] mb-3">{content.title}</h1>
            <p className="text-lg text-gray-700 mb-2">{content.message}</p>
            <p className="text-sm text-gray-600 mb-8">
              Invitation ID: <span className="font-medium">{invitationId}</span>
            </p>

            <div className={`${content.bgColor} border ${content.borderColor} rounded-sm p-6 mb-8 text-left`}>
              <div className="flex items-center gap-2 mb-4">
                <Shield className="w-5 h-5 text-gray-700" />
                <h3 className="font-semibold text-gray-900">System Outputs</h3>
              </div>
              <p className="text-sm font-medium text-gray-900 mb-4">Status: {content.status}</p>
              <div className="space-y-2">
                {content.notifications.map((notification, index) => (
                  <div key={index} className="flex items-start gap-2">
                    <CheckCircle className="w-4 h-4 text-green-600 flex-shrink-0 mt-0.5" />
                    <span className="text-sm text-gray-700">{notification}</span>
                  </div>
                ))}
              </div>

              {reviewerDecision === 'accept' && extensionRequest && (
                <div className="mt-4 pt-4 border-t border-green-200">
                  <div className="flex items-center gap-2">
                    <Calendar className="w-4 h-4 text-gray-700" />
                    <span className="text-sm font-medium text-gray-900">
                      Extension Requested: {new Date(extensionRequest).toLocaleDateString()}
                    </span>
                  </div>
                </div>
              )}
            </div>

            <div className="flex gap-3 justify-center">
              <button
                onClick={onBack}
                className="px-8 py-3 border border-gray-300 rounded-sm text-gray-700 hover:bg-gray-50 transition-colors font-medium"
              >
                Return to Dashboard
              </button>
              {reviewerDecision === 'accept' && (
                <button className={`px-8 py-3 ${content.buttonColor} text-white rounded-sm transition-colors font-medium flex items-center gap-2`}>
                  <Eye className="w-5 h-5" />
                  {content.nextStep}
                </button>
              )}
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#F7F8FA]">
      {/* Header */}
      <div className="bg-[#0F2D5E] text-white py-6 px-6 shadow-md">
        <div className="max-w-7xl mx-auto">
          <div className="flex items-center gap-4">
            {onBack && (
              <button
                onClick={onBack}
                className="p-2 hover:bg-white/10 rounded-sm transition-colors"
              >
                <ArrowLeft className="w-5 h-5" />
              </button>
            )}
            <div className="flex-1">
              <h1 className="text-2xl font-serif font-semibold">Review Invitation</h1>
              <p className="text-sm text-gray-300 mt-1">
                Review your invitation and respond
              </p>
            </div>
            <div className="flex items-center gap-2 px-4 py-2 bg-white/10 rounded-sm backdrop-blur">
              <Mail className="w-5 h-5" />
              <span className="text-sm font-medium">{invitationId}</span>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-6 py-8">
        <div className="grid lg:grid-cols-3 gap-6">
          {/* Left Column - Invitation & Manuscript Info */}
          <div className="lg:col-span-2 space-y-6">
            {/* Invitation Information */}
            <div className="bg-white rounded-sm border border-[#EAEDF2] shadow-sm p-6">
              <div className="flex items-center gap-3 mb-6">
                <div className="w-10 h-10 bg-[#0F2D5E] rounded-sm flex items-center justify-center">
                  <Mail className="w-5 h-5 text-white" />
                </div>
                <h2 className="text-xl font-serif font-semibold text-[#0F2D5E]">Invitation Information</h2>
              </div>

              <div className="space-y-4">
                <div className="grid md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-medium text-gray-500 mb-1">Invitation ID</label>
                    <p className="text-sm text-gray-900 font-medium">{invitationData.invitationId}</p>
                  </div>
                  <div>
                    <label className="block text-xs font-medium text-gray-500 mb-1">Manuscript ID</label>
                    <p className="text-sm text-gray-900 font-medium">{invitationData.manuscriptId}</p>
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-medium text-gray-500 mb-1">Manuscript Title</label>
                  <p className="text-base font-medium text-gray-900">{invitationData.manuscriptTitle}</p>
                </div>

                <div className="grid md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-medium text-gray-500 mb-1">Research Area</label>
                    <p className="text-sm text-gray-900">{invitationData.researchArea}</p>
                  </div>
                  <div>
                    <label className="block text-xs font-medium text-gray-500 mb-1">Review Type</label>
                    <p className="text-sm text-gray-900">{invitationData.reviewType}</p>
                  </div>
                </div>

                <div className="grid md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-medium text-gray-500 mb-1">Requested Deadline</label>
                    <div className="flex items-center gap-2">
                      <Calendar className="w-4 h-4 text-gray-400" />
                      <p className="text-sm font-medium text-gray-900">
                        {invitationData.requestedDeadline.toLocaleDateString('en-US', {
                          month: 'long',
                          day: 'numeric',
                          year: 'numeric',
                        })}
                      </p>
                    </div>
                  </div>
                  <div>
                    <label className="block text-xs font-medium text-gray-500 mb-1">Date Invited</label>
                    <div className="flex items-center gap-2">
                      <Clock className="w-4 h-4 text-gray-400" />
                      <p className="text-sm text-gray-900">
                        {invitationData.dateInvited.toLocaleDateString('en-US', {
                          month: 'short',
                          day: 'numeric',
                          year: 'numeric',
                        })}
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Manuscript Summary */}
            <div className="bg-white rounded-sm border border-[#EAEDF2] shadow-sm p-6">
              <div className="flex items-center gap-3 mb-6">
                <div className="w-10 h-10 bg-[#0F2D5E] rounded-sm flex items-center justify-center">
                  <FileText className="w-5 h-5 text-white" />
                </div>
                <h2 className="text-xl font-serif font-semibold text-[#0F2D5E]">Manuscript Summary</h2>
              </div>

              <div className="space-y-4">
                <div>
                  <label className="block text-xs font-medium text-gray-500 mb-2">Abstract</label>
                  <div className="bg-gray-50 rounded-sm p-4 max-h-40 overflow-y-auto">
                    <p className="text-sm text-gray-700 leading-relaxed">{manuscript.abstract}</p>
                  </div>
                </div>

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

                <div className="grid md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-medium text-gray-500 mb-1">Complexity Level</label>
                    <div className="flex items-center gap-2">
                      <div className="flex-1 bg-gray-200 rounded-full h-2">
                        <div className="bg-amber-500 rounded-full h-2" style={{ width: '65%' }} />
                      </div>
                      <span className="text-sm font-medium text-gray-900">{invitationData.complexityLevel}</span>
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-medium text-gray-500 mb-1">Est. Review Duration</label>
                    <div className="flex items-center gap-2">
                      <Clock className="w-4 h-4 text-gray-400" />
                      <p className="text-sm text-gray-900">{invitationData.estimatedDuration} days</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Reviewer Assignment Information */}
            <div className="bg-white rounded-sm border border-[#EAEDF2] shadow-sm p-6">
              <div className="flex items-center gap-3 mb-6">
                <div className="w-10 h-10 bg-[#0F2D5E] rounded-sm flex items-center justify-center">
                  <User className="w-5 h-5 text-white" />
                </div>
                <h2 className="text-xl font-serif font-semibold text-[#0F2D5E]">Assignment Details</h2>
              </div>

              <div className="space-y-4">
                <div className="grid md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-medium text-gray-500 mb-1">Assigning Editor</label>
                    <p className="text-sm font-medium text-gray-900">{invitationData.assigningEditor}</p>
                  </div>
                  <div>
                    <label className="block text-xs font-medium text-gray-500 mb-1">Priority Level</label>
                    <span className={`inline-flex px-3 py-1 rounded-full text-xs font-medium ${
                      invitationData.priorityLevel === 'Urgent' ? 'bg-red-100 text-red-800' :
                      invitationData.priorityLevel === 'High' ? 'bg-amber-100 text-amber-800' :
                      'bg-gray-100 text-gray-800'
                    }`}>
                      {invitationData.priorityLevel}
                    </span>
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-medium text-gray-500 mb-2">Reviewer Instructions</label>
                  <div className="bg-blue-50 rounded-sm p-4 border border-blue-100">
                    <p className="text-sm text-gray-700 leading-relaxed">{invitationData.reviewerInstructions}</p>
                  </div>
                </div>

                <div className="bg-amber-50 border border-amber-200 rounded-sm p-4">
                  <div className="flex items-start gap-2">
                    <AlertTriangle className="w-5 h-5 text-amber-600 flex-shrink-0 mt-0.5" />
                    <div>
                      <p className="text-sm font-medium text-amber-900">Review Deadline</p>
                      <p className="text-sm text-amber-800 mt-1">
                        Please respond to this invitation by{' '}
                        {new Date(invitationData.dateInvited.getTime() + 3 * 24 * 60 * 60 * 1000).toLocaleDateString()}
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Right Column - Response Form */}
          <div className="space-y-6">
            {/* Response Form */}
            <div className="bg-white rounded-sm border border-[#EAEDF2] shadow-sm p-6">
              <div className="flex items-center gap-3 mb-6">
                <div className="w-10 h-10 bg-[#0F2D5E] rounded-sm flex items-center justify-center">
                  <Send className="w-5 h-5 text-white" />
                </div>
                <h2 className="text-lg font-serif font-semibold text-[#0F2D5E]">Your Response</h2>
              </div>

              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-3">
                    Decision <span className="text-red-500">*</span>
                  </label>
                  <div className="space-y-2">
                    <label className="flex items-center gap-3 p-3 border-2 rounded-sm cursor-pointer transition-all hover:bg-gray-50 ${reviewerDecision === 'accept' ? 'border-green-500 bg-green-50' : 'border-gray-200'}">
                      <input
                        type="radio"
                        name="decision"
                        value="accept"
                        checked={reviewerDecision === 'accept'}
                        onChange={(e) => setReviewerDecision(e.target.value)}
                        className="w-4 h-4 text-green-600"
                      />
                      <div className="flex-1">
                        <p className="text-sm font-medium text-gray-900">Accept Review Assignment</p>
                        <p className="text-xs text-gray-600">I will review this manuscript</p>
                      </div>
                      <CheckCircle className={`w-5 h-5 ${reviewerDecision === 'accept' ? 'text-green-600' : 'text-gray-300'}`} />
                    </label>

                    <label className="flex items-center gap-3 p-3 border-2 rounded-sm cursor-pointer transition-all hover:bg-gray-50 ${reviewerDecision === 'decline' ? 'border-red-500 bg-red-50' : 'border-gray-200'}">
                      <input
                        type="radio"
                        name="decision"
                        value="decline"
                        checked={reviewerDecision === 'decline'}
                        onChange={(e) => setReviewerDecision(e.target.value)}
                        className="w-4 h-4 text-red-600"
                      />
                      <div className="flex-1">
                        <p className="text-sm font-medium text-gray-900">Decline Review Assignment</p>
                        <p className="text-xs text-gray-600">I cannot review this manuscript</p>
                      </div>
                      <XCircle className={`w-5 h-5 ${reviewerDecision === 'decline' ? 'text-red-600' : 'text-gray-300'}`} />
                    </label>

                    <label className="flex items-center gap-3 p-3 border-2 rounded-sm cursor-pointer transition-all hover:bg-gray-50 ${reviewerDecision === 'clarification' ? 'border-blue-500 bg-blue-50' : 'border-gray-200'}">
                      <input
                        type="radio"
                        name="decision"
                        value="clarification"
                        checked={reviewerDecision === 'clarification'}
                        onChange={(e) => setReviewerDecision(e.target.value)}
                        className="w-4 h-4 text-blue-600"
                      />
                      <div className="flex-1">
                        <p className="text-sm font-medium text-gray-900">Request Clarification</p>
                        <p className="text-xs text-gray-600">I need more information</p>
                      </div>
                      <AlertCircle className={`w-5 h-5 ${reviewerDecision === 'clarification' ? 'text-blue-600' : 'text-gray-300'}`} />
                    </label>
                  </div>
                </div>

                {reviewerDecision === 'accept' && (
                  <>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Availability Confirmation <span className="text-red-500">*</span>
                      </label>
                      <select
                        value={availabilityConfirmation}
                        onChange={(e) => {
                          setAvailabilityConfirmation(e.target.value);
                          setShowExtensionField(e.target.value === 'extension');
                        }}
                        className="w-full px-3 py-2 border border-gray-300 rounded-sm focus:outline-none focus:ring-2 focus:ring-[#1a1f2e] text-sm"
                      >
                        <option value="">Select availability...</option>
                        <option value="within_deadline">Available Within Deadline</option>
                        <option value="extension">Available with Extension Request</option>
                        <option value="unavailable">Currently Unavailable</option>
                      </select>
                    </div>

                    {showExtensionField && (
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Extension Request Date <span className="text-red-500">*</span>
                        </label>
                        <input
                          type="date"
                          value={extensionRequest}
                          onChange={(e) => setExtensionRequest(e.target.value)}
                          min={invitationData.requestedDeadline.toISOString().split('T')[0]}
                          className="w-full px-3 py-2 border border-gray-300 rounded-sm focus:outline-none focus:ring-2 focus:ring-[#1a1f2e] text-sm"
                        />
                        <p className="text-xs text-gray-500 mt-1">
                          Original deadline: {invitationData.requestedDeadline.toLocaleDateString()}
                        </p>
                      </div>
                    )}
                  </>
                )}

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Message to Editor {reviewerDecision !== 'clarification' && <span className="text-gray-400">(optional)</span>}
                  </label>
                  <textarea
                    value={reviewerMessage}
                    onChange={(e) => setReviewerMessage(e.target.value)}
                    rows={6}
                    className="w-full px-3 py-2 border border-gray-300 rounded-sm focus:outline-none focus:ring-2 focus:ring-[#1a1f2e] text-sm resize-none"
                    placeholder={
                      reviewerDecision === 'accept'
                        ? 'Example: I can complete the review within 10 working days.'
                        : reviewerDecision === 'decline'
                        ? 'Example: I am declining due to workload conflict.'
                        : 'Please provide details about what clarification you need...'
                    }
                  />
                </div>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="bg-white rounded-sm border border-[#EAEDF2] shadow-sm p-6">
              <div className="space-y-3">
                <button
                  onClick={handleSubmitResponse}
                  disabled={!reviewerDecision}
                  className={`w-full flex items-center justify-center gap-2 px-4 py-3 rounded-sm transition-colors font-medium disabled:opacity-50 disabled:cursor-not-allowed ${
                    reviewerDecision === 'accept'
                      ? 'bg-green-600 hover:bg-green-700 text-white'
                      : reviewerDecision === 'decline'
                      ? 'bg-red-600 hover:bg-red-700 text-white'
                      : reviewerDecision === 'clarification'
                      ? 'bg-blue-600 hover:bg-blue-700 text-white'
                      : 'bg-[#0F2D5E] hover:bg-[#1A4A8A] text-white'
                  }`}
                >
                  <Send className="w-5 h-5" />
                  Send Response
                </button>

                <button className="w-full flex items-center justify-center gap-2 px-4 py-2.5 border border-gray-300 rounded-sm text-gray-700 hover:bg-gray-50 transition-colors text-sm font-medium">
                  <Eye className="w-4 h-4" />
                  View Manuscript
                </button>

                {!reviewerDecision && (
                  <div className="flex items-start gap-2 text-sm text-amber-700 bg-amber-50 border border-amber-200 rounded-sm p-3">
                    <AlertTriangle className="w-4 h-4 flex-shrink-0 mt-0.5" />
                    <p>Please make a decision before submitting your response</p>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
