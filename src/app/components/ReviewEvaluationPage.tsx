import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import {
  ArrowLeft,
  FileText,
  Download,
  Upload,
  X,
  Clock,
  AlertTriangle,
  CheckCircle,
  Eye,
  Save,
  Send,
  AlertCircle,
  Calendar,
  Tag,
  BookOpen,
  TrendingUp,
  Shield,
  FilePlus,
  ChevronDown,
  ChevronUp,
} from 'lucide-react';
import type { Manuscript, Review } from '../types';

interface ReviewEvaluationPageProps {
  manuscript: Manuscript;
  review: Review;
  onBack: () => void;
  onSubmitReview: (reviewData: ReviewSubmissionData) => void;
}

export interface ReviewSubmissionData {
  overallRecommendation: string;
  manuscriptQuality: string;
  originalityAssessment: string;
  methodologyEvaluation: string;
  commentsToAuthor: string;
  confidentialCommentsToEditor: string;
  uploadedFiles: File[];
  ethicalConfirmation: boolean;
}

export function ReviewEvaluationPage({
  manuscript,
  review,
  onBack,
  onSubmitReview,
}: ReviewEvaluationPageProps) {
  const { currentUser } = useAuth();
  const [overallRecommendation, setOverallRecommendation] = useState('');
  const [manuscriptQuality, setManuscriptQuality] = useState('');
  const [originalityAssessment, setOriginalityAssessment] = useState('');
  const [methodologyEvaluation, setMethodologyEvaluation] = useState('');
  const [reviewerComments, setReviewerComments] = useState('');
  const [uploadedFiles, setUploadedFiles] = useState<File[]>([]);
  const [ethicalConfirmation, setEthicalConfirmation] = useState(false);
  const [showAbstract, setShowAbstract] = useState(false);
  const [showConfirmModal, setShowConfirmModal] = useState(false);
  const [showSuccessModal, setShowSuccessModal] = useState(false);
  const [draftSaved, setDraftSaved] = useState(false);
  const [validationErrors, setValidationErrors] = useState<string[]>([]);
  const [isDragging, setIsDragging] = useState(false);

  // Calculate deadline info
  const deadline = review.deadline;
  const now = new Date();
  const timeRemaining = deadline.getTime() - now.getTime();
  const daysRemaining = Math.ceil(timeRemaining / (1000 * 60 * 60 * 24));
  const isUrgent = daysRemaining <= 3;
  const isOverdue = daysRemaining < 0;

  // Auto-save draft every 30 seconds
  useEffect(() => {
    const timer = setInterval(() => {
      if (overallRecommendation || reviewerComments) {
        handleSaveDraft();
      }
    }, 30000);
    return () => clearInterval(timer);
  }, [overallRecommendation, reviewerComments]);

  const handleSaveDraft = () => {
    localStorage.setItem(
      `review-draft-${manuscript.id}`,
      JSON.stringify({
        overallRecommendation,
        manuscriptQuality,
        originalityAssessment,
        methodologyEvaluation,
        reviewerComments,
      })
    );
    setDraftSaved(true);
    setTimeout(() => setDraftSaved(false), 3000);
  };

  const handleFileUpload = (files: FileList | null) => {
    if (!files) return;

    const validFiles: File[] = [];
    const allowedTypes = ['application/pdf', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document', 'application/zip'];

    Array.from(files).forEach((file) => {
      if (allowedTypes.includes(file.type)) {
        validFiles.push(file);
      }
    });

    setUploadedFiles([...uploadedFiles, ...validFiles]);
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = () => {
    setIsDragging(false);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    handleFileUpload(e.dataTransfer.files);
  };

  const removeFile = (index: number) => {
    setUploadedFiles(uploadedFiles.filter((_, i) => i !== index));
  };

  const validateForm = (): boolean => {
    const errors: string[] = [];

    if (!overallRecommendation) errors.push('Overall Recommendation is required');
    if (!manuscriptQuality) errors.push('Manuscript Quality is required');
    if (!originalityAssessment) errors.push('Originality Assessment is required');
    if (!methodologyEvaluation) errors.push('Methodology Evaluation is required');
    if (!reviewerComments.trim()) errors.push('Review Comments are required');
    if (!ethicalConfirmation) errors.push('Ethical confirmation is required');

    setValidationErrors(errors);
    return errors.length === 0;
  };

  const handleSubmit = () => {
    if (!validateForm()) {
      return;
    }
    setShowConfirmModal(true);
  };

  const confirmSubmit = () => {
    const reviewData: ReviewSubmissionData = {
      overallRecommendation,
      manuscriptQuality,
      originalityAssessment,
      methodologyEvaluation,
      commentsToAuthor: reviewerComments,
      confidentialCommentsToEditor: reviewerComments,
      uploadedFiles,
      ethicalConfirmation,
    };

    onSubmitReview(reviewData);
    setShowConfirmModal(false);
    setShowSuccessModal(true);
  };

  if (showSuccessModal) {
    return (
      <div className="min-h-screen bg-[#F7F8FA]">
        <div className="bg-[#0F2D5E] text-[#f5f1e8] py-8 px-6 border-b-4 border-[#8b7355]">
          <div className="max-w-6xl mx-auto">
            <h1 className="text-3xl font-serif">Review Submission Confirmation</h1>
            <p className="mt-2 text-[#d4c5b0]">Your review has been submitted successfully</p>
          </div>
        </div>

        <div className="max-w-6xl mx-auto py-8 px-6">
          <div className="bg-white border border-[#EAEDF2] rounded-sm p-8 mb-6">
            <div className="flex items-start gap-4 mb-6">
              <div className="p-3 bg-green-100 rounded-sm">
                <CheckCircle className="w-8 h-8 text-green-700" />
              </div>
              <div>
                <h2 className="text-2xl font-serif text-[#0F2D5E] mb-2">Review Submitted</h2>
                <p className="text-gray-700">
                  Your review has been sent to the editor.
                </p>
              </div>
            </div>

            <div className="border-t border-[#EAEDF2] pt-6 mt-6">
              <div className="grid grid-cols-2 gap-4">
                <div className="bg-gray-50 border border-gray-200 rounded-sm p-4">
                  <CheckCircle className="w-5 h-5 text-green-600 mb-2" />
                  <p className="font-medium text-gray-900 text-sm">Review Forwarded</p>
                </div>
                <div className="bg-gray-50 border border-gray-200 rounded-sm p-4">
                  <CheckCircle className="w-5 h-5 text-green-600 mb-2" />
                  <p className="font-medium text-gray-900 text-sm">Inputs Locked</p>
                </div>
                <div className="bg-gray-50 border border-gray-200 rounded-sm p-4">
                  <CheckCircle className="w-5 h-5 text-green-600 mb-2" />
                  <p className="font-medium text-gray-900 text-sm">Editor Notified</p>
                </div>
                <div className="bg-gray-50 border border-gray-200 rounded-sm p-4">
                  <CheckCircle className="w-5 h-5 text-green-600 mb-2" />
                  <p className="font-medium text-gray-900 text-sm">Status Updated</p>
                </div>
              </div>
            </div>

            <div className="border-t border-[#EAEDF2] pt-6 mt-6">
              <div className="bg-blue-50 border border-blue-200 rounded-sm p-4">
                <p className="font-medium text-blue-900 mb-2">What's Next?</p>
                <p className="text-sm text-blue-700">
                  The editor will consolidate all reviews and make a decision. You'll be notified of the outcome.
                </p>
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
      {/* Header Section */}
      <div className="bg-[#0F2D5E] text-[#f5f1e8] py-8 px-6 border-b-4 border-[#8b7355]">
        <div className="max-w-6xl mx-auto">
          <button
            onClick={onBack}
            className="flex items-center gap-2 text-[#d4c5b0] hover:text-[#f5f1e8] mb-4 transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
            Back to Dashboard
          </button>


          <div className="flex items-start justify-between">
            <div>
              <h1 className="text-3xl font-serif">Review Evaluation</h1>
              <p className="mt-2 text-[#d4c5b0]">Complete your manuscript review</p>
            </div>
            <div
              className={`px-4 py-2 rounded-sm font-medium text-sm flex items-center gap-2 ${
                isOverdue
                  ? 'bg-red-600 text-white'
                  : isUrgent
                  ? 'bg-amber-500 text-white'
                  : 'bg-green-600 text-white'
              }`}
            >
              <Clock className="w-4 h-4" />
              {isOverdue
                ? `${Math.abs(daysRemaining)} Days Overdue`
                : `${daysRemaining} Days Remaining`}
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-6xl mx-auto py-8 px-6 space-y-6">
        {/* Validation Errors */}
        {validationErrors.length > 0 && (
          <div className="bg-red-50 border border-red-200 rounded-sm p-4 flex items-start gap-3">
            <AlertTriangle className="w-5 h-5 text-red-600 mt-0.5" />
            <div>
              <p className="text-sm font-medium text-red-800">Please complete all required fields</p>
            </div>
          </div>
        )}

        {/* Manuscript Information Panel */}
        <div className="bg-white border border-[#EAEDF2] rounded-sm">
          <div className="bg-[#0F2D5E] text-[#f5f1e8] px-6 py-4 border-b border-[#EAEDF2] flex items-center gap-2">
            <BookOpen className="w-5 h-5" />
            <h2 className="text-xl font-serif">Manuscript Information</h2>
          </div>
          <div className="p-6">
            <div className="mb-4">
              <p className="text-lg font-semibold text-gray-900">{manuscript.title}</p>
              <p className="text-sm text-gray-600 mt-1">{manuscript.category}</p>
            </div>

            <div className="flex flex-wrap gap-2 mb-4">
              {['Machine Learning', 'Climate Science', 'Deep Learning', 'Weather Prediction'].map(
                (keyword) => (
                  <span
                    key={keyword}
                    className="px-3 py-1 bg-blue-100 text-blue-800 rounded-full text-xs font-medium"
                  >
                    {keyword}
                  </span>
                )
              )}
            </div>

            <button
              onClick={() => setShowAbstract(!showAbstract)}
              className="flex items-center gap-2 text-sm text-blue-600 hover:text-blue-700"
            >
              {showAbstract ? 'Hide' : 'Show'} Abstract
              {showAbstract ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
            </button>
            {showAbstract && (
              <div className="bg-gray-50 border border-gray-200 rounded-sm p-4 mt-2">
                <p className="text-sm text-gray-700 leading-relaxed">{manuscript.abstract}</p>
              </div>
            )}
          </div>
        </div>

        {/* Manuscript File Viewer */}
        <div className="bg-white border border-[#EAEDF2] rounded-sm">
          <div className="bg-[#0F2D5E] text-[#f5f1e8] px-6 py-4 border-b border-[#EAEDF2] flex items-center gap-2">
            <FileText className="w-5 h-5" />
            <h2 className="text-xl font-serif">Manuscript Files</h2>
          </div>
          <div className="p-6">
            {manuscript.files.map((file) => (
              <div
                key={file.id}
                className="flex items-center justify-between bg-gray-50 border border-gray-200 rounded-sm p-4"
              >
                <div className="flex items-center gap-3">
                  <FileText className="w-5 h-5 text-blue-600" />
                  <div>
                    <p className="font-medium text-gray-900 text-sm">{file.fileName}</p>
                    <p className="text-xs text-gray-600">Version {file.version}</p>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <button className="px-3 py-1.5 bg-blue-600 text-white rounded-sm hover:bg-blue-700 text-sm flex items-center gap-1">
                    <Eye className="w-4 h-4" />
                    Preview
                  </button>
                  <button className="px-3 py-1.5 bg-gray-600 text-white rounded-sm hover:bg-gray-700 text-sm flex items-center gap-1">
                    <Download className="w-4 h-4" />
                    Download
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Timeline Monitoring Panel */}
        <div className="bg-white border border-[#EAEDF2] rounded-sm">
          <div className="bg-[#0F2D5E] text-[#f5f1e8] px-6 py-4 border-b border-[#EAEDF2] flex items-center gap-2">
            <TrendingUp className="w-5 h-5" />
            <h2 className="text-xl font-serif">Timeline Monitoring</h2>
          </div>
          <div className="p-6">
            <div className="grid grid-cols-2 gap-4 mb-4">
              <div className="bg-blue-50 border border-blue-200 rounded-sm p-3">
                <p className="text-xs text-blue-700 mb-1">Deadline</p>
                <p className="text-lg font-bold text-blue-900">
                  {review.deadline.toLocaleDateString('en-US', {
                    month: 'short',
                    day: 'numeric',
                  })}
                </p>
              </div>

              <div
                className={`border rounded-sm p-3 ${
                  isOverdue
                    ? 'bg-red-50 border-red-200'
                    : isUrgent
                    ? 'bg-amber-50 border-amber-200'
                    : 'bg-green-50 border-green-200'
                }`}
              >
                <p className="text-xs mb-1">Time Left</p>
                <p className="text-lg font-bold">
                  {isOverdue ? 'Overdue' : `${daysRemaining} Days`}
                </p>
              </div>
            </div>

            <div className="w-full bg-gray-200 rounded-full h-2">
              <div
                className={`h-2 rounded-full ${
                  isOverdue ? 'bg-red-500' : isUrgent ? 'bg-amber-500' : 'bg-green-500'
                }`}
                style={{
                  width: `${Math.max(0, Math.min(100, ((14 - daysRemaining) / 14) * 100))}%`,
                }}
              />
            </div>

            {(isUrgent || isOverdue) && (
              <div className={`mt-3 rounded-sm p-3 flex items-center gap-2 ${
                isOverdue ? 'bg-red-50 border border-red-200' : 'bg-amber-50 border border-amber-200'
              }`}>
                <AlertTriangle className={`w-4 h-4 ${isOverdue ? 'text-red-600' : 'text-amber-600'}`} />
                <p className={`text-sm ${isOverdue ? 'text-red-800' : 'text-amber-800'}`}>
                  {isOverdue ? 'Review overdue - submit immediately' : `${daysRemaining} days remaining`}
                </p>
              </div>
            )}
          </div>
        </div>

        {/* Review Evaluation Section */}
        <div className="bg-white border border-[#EAEDF2] rounded-sm">
          <div className="bg-[#0F2D5E] text-[#f5f1e8] px-6 py-4 border-b border-[#EAEDF2] flex items-center gap-2">
            <Shield className="w-5 h-5" />
            <h2 className="text-xl font-serif">Review Evaluation</h2>
          </div>
          <div className="p-6 space-y-6">
            {/* Overall Recommendation */}
            <div>
              <label className="block text-sm font-semibold text-gray-900 mb-2">
                Overall Recommendation <span className="text-red-600">*</span>
              </label>
              <select
                value={overallRecommendation}
                onChange={(e) => setOverallRecommendation(e.target.value)}
                className="w-full border border-gray-300 rounded-sm px-4 py-2.5 focus:ring-2 focus:ring-[#1a1f2e] focus:border-[#1a1f2e]"
              >
                <option value="">Select recommendation...</option>
                <option value="accept">Accept</option>
                <option value="minor_revision">Minor Revision</option>
                <option value="major_revision">Major Revision</option>
                <option value="reject">Reject</option>
              </select>
            </div>

            {/* Manuscript Quality */}
            <div>
              <label className="block text-sm font-semibold text-gray-900 mb-2">
                Manuscript Quality <span className="text-red-600">*</span>
              </label>
              <select
                value={manuscriptQuality}
                onChange={(e) => setManuscriptQuality(e.target.value)}
                className="w-full border border-gray-300 rounded-sm px-4 py-2.5 focus:ring-2 focus:ring-[#1a1f2e] focus:border-[#1a1f2e]"
              >
                <option value="">Select quality level...</option>
                <option value="excellent">Excellent</option>
                <option value="good">Good</option>
                <option value="fair">Fair</option>
                <option value="poor">Poor</option>
              </select>
            </div>

            {/* Originality Assessment */}
            <div>
              <label className="block text-sm font-semibold text-gray-900 mb-2">
                Originality Assessment <span className="text-red-600">*</span>
              </label>
              <select
                value={originalityAssessment}
                onChange={(e) => setOriginalityAssessment(e.target.value)}
                className="w-full border border-gray-300 rounded-sm px-4 py-2.5 focus:ring-2 focus:ring-[#1a1f2e] focus:border-[#1a1f2e]"
              >
                <option value="">Select originality level...</option>
                <option value="highly_original">Highly Original</option>
                <option value="moderately_original">Moderately Original</option>
                <option value="limited_originality">Limited Originality</option>
                <option value="similarity_concern">Similarity Concern</option>
              </select>
            </div>

            {/* Methodology Evaluation */}
            <div>
              <label className="block text-sm font-semibold text-gray-900 mb-2">
                Methodology/Content Evaluation <span className="text-red-600">*</span>
              </label>
              <select
                value={methodologyEvaluation}
                onChange={(e) => setMethodologyEvaluation(e.target.value)}
                className="w-full border border-gray-300 rounded-sm px-4 py-2.5 focus:ring-2 focus:ring-[#1a1f2e] focus:border-[#1a1f2e]"
              >
                <option value="">Select methodology strength...</option>
                <option value="strong">Strong</option>
                <option value="acceptable">Acceptable</option>
                <option value="needs_improvement">Needs Improvement</option>
                <option value="weak">Weak</option>
              </select>
            </div>
          </div>
        </div>

        {/* Reviewer Comments Section */}
        <div className="bg-white border border-[#EAEDF2] rounded-sm">
          <div className="bg-[#0F2D5E] text-[#f5f1e8] px-6 py-4 border-b border-[#EAEDF2]">
            <h2 className="text-xl font-serif">Review Comments</h2>
          </div>
          <div className="p-6">
            <label className="block text-sm font-semibold text-gray-900 mb-2">
              Your Feedback <span className="text-red-600">*</span>
            </label>
            <textarea
              value={reviewerComments}
              onChange={(e) => setReviewerComments(e.target.value)}
              rows={10}
              placeholder="Provide detailed feedback on the manuscript's strengths, weaknesses, methodology, and suggestions for improvement..."
              className="w-full border border-gray-300 rounded-sm px-4 py-2.5 focus:ring-2 focus:ring-[#1a1f2e] focus:border-[#1a1f2e] resize-none"
            />
            <p className="text-sm text-gray-500 mt-1">{reviewerComments.length} characters</p>
          </div>
        </div>

        {/* Annotated File Upload Section */}
        <div className="bg-white border border-[#EAEDF2] rounded-sm">
          <div className="bg-[#0F2D5E] text-[#f5f1e8] px-6 py-4 border-b border-[#EAEDF2] flex items-center gap-2">
            <Upload className="w-5 h-5" />
            <h2 className="text-xl font-serif">Upload Files (Optional)</h2>
          </div>
          <div className="p-6">
            <div
              onDragOver={handleDragOver}
              onDragLeave={handleDragLeave}
              onDrop={handleDrop}
              className={`border-2 border-dashed rounded-sm p-6 text-center ${
                isDragging ? 'border-blue-500 bg-blue-50' : 'border-gray-300 bg-gray-50'
              }`}
            >
              <FilePlus className="w-10 h-10 text-gray-400 mx-auto mb-3" />
              <p className="text-gray-700 text-sm mb-2">Drag files here or click to browse</p>
              <p className="text-xs text-gray-500 mb-3">PDF, DOCX, ZIP • Max 50MB</p>
              <input
                type="file"
                id="file-upload"
                multiple
                accept=".pdf,.docx,.zip"
                onChange={(e) => handleFileUpload(e.target.files)}
                className="hidden"
              />
              <label
                htmlFor="file-upload"
                className="inline-flex items-center gap-2 px-4 py-2 bg-[#0F2D5E] text-[#f5f1e8] rounded-sm hover:bg-[#2a3142] cursor-pointer text-sm"
              >
                <Upload className="w-4 h-4" />
                Browse
              </label>
            </div>

            {uploadedFiles.length > 0 && (
              <div className="mt-3 space-y-2">
                {uploadedFiles.map((file, index) => (
                  <div
                    key={index}
                    className="flex items-center justify-between bg-gray-50 border border-gray-200 rounded-sm p-2"
                  >
                    <div className="flex items-center gap-2">
                      <FileText className="w-4 h-4 text-blue-600" />
                      <p className="text-sm text-gray-900">{file.name}</p>
                    </div>
                    <button
                      onClick={() => removeFile(index)}
                      className="p-1 text-red-600 hover:bg-red-50 rounded-sm"
                    >
                      <X className="w-4 h-4" />
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Ethical Confirmation Section */}
        <div className="bg-white border border-[#EAEDF2] rounded-sm p-6">
          <div className="flex items-start gap-3">
            <input
              type="checkbox"
              id="ethical-confirmation"
              checked={ethicalConfirmation}
              onChange={(e) => setEthicalConfirmation(e.target.checked)}
              className="w-5 h-5 text-[#0F2D5E] border-gray-300 rounded focus:ring-[#1a1f2e] mt-0.5"
            />
            <label htmlFor="ethical-confirmation" className="text-sm text-gray-900 cursor-pointer">
              I confirm this review is objective and ethical{' '}
              <span className="text-red-600">*</span>
            </label>
          </div>
        </div>

        {/* Submission Controls */}
        <div className="flex items-center justify-between">
          <button
            onClick={onBack}
            className="px-6 py-3 bg-white border border-[#EAEDF2] text-[#0F2D5E] rounded-sm hover:bg-gray-50 transition-colors font-medium"
          >
            Cancel Review
          </button>
          <div className="flex items-center gap-3">
            <button
              onClick={handleSaveDraft}
              className="px-6 py-3 bg-white border border-[#EAEDF2] text-[#0F2D5E] rounded-sm hover:bg-gray-50 transition-colors font-medium flex items-center gap-2"
            >
              <Save className="w-4 h-4" />
              Save Draft
            </button>
            <button
              onClick={handleSubmit}
              className="px-8 py-3 bg-[#0F2D5E] text-[#f5f1e8] rounded-sm hover:bg-[#2a3142] transition-colors font-medium flex items-center gap-2"
            >
              <Send className="w-4 h-4" />
              Submit Review Feedback
            </button>
          </div>
        </div>
      </div>

      {/* Confirmation Modal */}
      {showConfirmModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-sm max-w-md w-full p-6 border border-[#EAEDF2]">
            <div className="text-center mb-6">
              <div className="inline-flex p-3 bg-amber-100 rounded-sm mb-3">
                <AlertTriangle className="w-8 h-8 text-amber-600" />
              </div>
              <h3 className="text-xl font-serif text-[#0F2D5E] mb-2">Submit Review?</h3>
              <p className="text-sm text-gray-700">
                You won't be able to modify your review after submission.
              </p>
            </div>

            <div className="flex justify-center gap-3">
              <button
                onClick={() => setShowConfirmModal(false)}
                className="px-6 py-2 bg-white border border-gray-300 text-gray-700 rounded-sm hover:bg-gray-50"
              >
                Cancel
              </button>
              <button
                onClick={confirmSubmit}
                className="px-6 py-2 bg-[#0F2D5E] text-[#f5f1e8] rounded-sm hover:bg-[#2a3142] font-medium"
              >
                Submit
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
