import React, { useState } from 'react';
import {
  ArrowLeft,
  FileText,
  Shield,
  Users,
  Clock,
  AlertCircle,
  CheckCircle,
  XCircle,
  Target,
  Calendar,
  Send,
  Tag,
  TrendingUp,
  AlertTriangle,
  User,
} from 'lucide-react';
import type { Manuscript } from '../types';

interface EditorAssignmentPageProps {
  manuscript: Manuscript;
  onBack?: () => void;
  onAssignmentComplete?: (data: any) => void;
}

interface Editor {
  id: string;
  name: string;
  specialization: string;
  currentWorkload: number;
  maxCapacity: number;
  availabilityStatus: 'available' | 'limited' | 'full';
  activeManuscripts: number;
  avgReviewTime: number;
  expertise: string[];
}

export function EditorAssignmentPage({
  manuscript,
  onBack,
  onAssignmentComplete,
}: EditorAssignmentPageProps) {
  // Mock editorial assessment summary
  const assessmentSummary = {
    scopeRelevance: 'Highly Relevant',
    completeness: 'Complete',
    writingQuality: 'Good',
    ethicalCompliance: 'Passed',
    plagiarismStatus: 'Passed',
    editorialNotes: 'Manuscript demonstrates strong methodology and clear presentation. Recommend assignment to editor with expertise in machine learning and climate science.',
    requiredChanges: 'None - manuscript is ready for peer review',
    authorAgreementStatus: 'Accepted',
    assessmentDate: new Date(),
  };

  // Mock available editors
  const availableEditors: Editor[] = [
    {
      id: 'ed-001',
      name: 'Dr. Maria Santos',
      specialization: 'Information Technology',
      currentWorkload: 3,
      maxCapacity: 8,
      availabilityStatus: 'available',
      activeManuscripts: 3,
      avgReviewTime: 18,
      expertise: ['Machine Learning', 'Data Science', 'Artificial Intelligence'],
    },
    {
      id: 'ed-002',
      name: 'Prof. Carlos Reyes',
      specialization: 'Literature',
      currentWorkload: 6,
      maxCapacity: 8,
      availabilityStatus: 'limited',
      activeManuscripts: 6,
      avgReviewTime: 22,
      expertise: ['Literary Theory', 'Comparative Literature', 'Critical Analysis'],
    },
    {
      id: 'ed-003',
      name: 'Engr. Juan Cruz',
      specialization: 'Engineering',
      currentWorkload: 2,
      maxCapacity: 6,
      availabilityStatus: 'available',
      activeManuscripts: 2,
      avgReviewTime: 15,
      expertise: ['Civil Engineering', 'Structural Analysis', 'Construction Management'],
    },
    {
      id: 'ed-004',
      name: 'Dr. Ana Mendoza',
      specialization: 'Medical Research',
      currentWorkload: 7,
      maxCapacity: 8,
      availabilityStatus: 'limited',
      activeManuscripts: 7,
      avgReviewTime: 25,
      expertise: ['Clinical Trials', 'Epidemiology', 'Public Health'],
    },
    {
      id: 'ed-005',
      name: 'Dr. Robert Chen',
      specialization: 'Environmental Science',
      currentWorkload: 4,
      maxCapacity: 8,
      availabilityStatus: 'available',
      activeManuscripts: 4,
      avgReviewTime: 20,
      expertise: ['Climate Science', 'Environmental Modeling', 'Sustainability'],
    },
  ];

  // Assignment inputs
  const [selectedEditor, setSelectedEditor] = useState<string>('');
  const [assignmentNotes, setAssignmentNotes] = useState('');
  const [priorityLevel, setPriorityLevel] = useState('normal');
  const [assignmentDeadline, setAssignmentDeadline] = useState('');

  // UI state
  const [assignmentSubmitted, setAssignmentSubmitted] = useState(false);

  const handleAssignEditor = () => {
    if (!selectedEditor) {
      alert('Please select an editor before submitting.');
      return;
    }

    const editor = availableEditors.find((e) => e.id === selectedEditor);
    const assignmentData = {
      manuscriptId: manuscript.id,
      editorId: selectedEditor,
      editorName: editor?.name,
      assignmentNotes,
      priorityLevel,
      assignmentDeadline,
      assignmentDate: new Date(),
    };

    setAssignmentSubmitted(true);

    if (onAssignmentComplete) {
      onAssignmentComplete(assignmentData);
    }
  };

  // Success state after submission
  if (assignmentSubmitted) {
    const assignedEditor = availableEditors.find((e) => e.id === selectedEditor);

    return (
      <div className="min-h-screen bg-[#F7F8FA] flex items-center justify-center p-6">
        <div className="max-w-3xl w-full bg-white rounded-sm shadow-xl border border-[#EAEDF2] p-12">
          <div className="text-center">
            <div className="w-20 h-20 bg-green-50 rounded-full flex items-center justify-center mx-auto mb-6">
              <CheckCircle className="w-16 h-16 text-green-600" />
            </div>
            <h1 className="text-3xl font-serif font-semibold text-[#0F2D5E] mb-3">
              Editor Assigned Successfully
            </h1>
            <p className="text-lg text-gray-700 mb-2">
              {assignedEditor?.name} has been assigned to this manuscript
            </p>
            <p className="text-sm text-gray-600 mb-8">
              Manuscript ID: <span className="font-medium">{manuscript.id}</span>
            </p>

            <div className="bg-green-50 border border-green-200 rounded-sm p-6 mb-8 text-left">
              <div className="flex items-center gap-2 mb-4">
                <Shield className="w-5 h-5 text-gray-700" />
                <h3 className="font-semibold text-gray-900">Assignment Confirmation</h3>
              </div>
              <div className="space-y-3">
                <div className="flex items-start gap-2">
                  <CheckCircle className="w-4 h-4 text-green-600 flex-shrink-0 mt-0.5" />
                  <div className="flex-1">
                    <p className="text-sm font-medium text-gray-900">Editor Notified</p>
                    <p className="text-xs text-gray-600">Assignment notification sent to {assignedEditor?.name}</p>
                  </div>
                </div>
                <div className="flex items-start gap-2">
                  <CheckCircle className="w-4 h-4 text-green-600 flex-shrink-0 mt-0.5" />
                  <div className="flex-1">
                    <p className="text-sm font-medium text-gray-900">Workflow Updated</p>
                    <p className="text-xs text-gray-600">Manuscript status changed to "Assigned to Editor"</p>
                  </div>
                </div>
                <div className="flex items-start gap-2">
                  <CheckCircle className="w-4 h-4 text-green-600 flex-shrink-0 mt-0.5" />
                  <div className="flex-1">
                    <p className="text-sm font-medium text-gray-900">Author Notified</p>
                    <p className="text-xs text-gray-600">Update sent to manuscript author</p>
                  </div>
                </div>
                <div className="flex items-start gap-2">
                  <CheckCircle className="w-4 h-4 text-green-600 flex-shrink-0 mt-0.5" />
                  <div className="flex-1">
                    <p className="text-sm font-medium text-gray-900">Timeline Monitoring Activated</p>
                    <p className="text-xs text-gray-600">Review timeline tracking initiated</p>
                  </div>
                </div>
              </div>

              {priorityLevel !== 'normal' && (
                <div className="mt-4 pt-4 border-t border-green-200">
                  <div className="flex items-center gap-2">
                    <AlertTriangle className="w-4 h-4 text-amber-600" />
                    <span className="text-sm font-medium text-gray-900">
                      Priority Level: {priorityLevel === 'high' ? 'High Priority' : 'Urgent'}
                    </span>
                  </div>
                </div>
              )}
            </div>

            <div className="flex gap-3 justify-center">
              <button
                onClick={onBack}
                className="px-8 py-3 bg-[#0F2D5E] text-white rounded-sm hover:bg-[#1A4A8A] transition-colors font-medium"
              >
                Return to Dashboard
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  const getAvailabilityColor = (status: string) => {
    if (status === 'available') return 'bg-green-100 text-green-800';
    if (status === 'limited') return 'bg-amber-100 text-amber-800';
    return 'bg-red-100 text-red-800';
  };

  const getWorkloadPercentage = (editor: Editor) => {
    return Math.round((editor.currentWorkload / editor.maxCapacity) * 100);
  };

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
              <h1 className="text-2xl font-serif font-semibold">Editor Assignment</h1>
              <p className="text-sm text-gray-300 mt-1">
                Manual editor assignment by Editor-in-Chief
              </p>
            </div>
            <div className="flex items-center gap-2 px-4 py-2 bg-white/10 rounded-sm backdrop-blur">
              <FileText className="w-5 h-5" />
              <span className="text-sm font-medium">{manuscript.id}</span>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-6 py-8">
        <div className="grid lg:grid-cols-3 gap-6">
          {/* Left Column - Manuscript & Assessment Info */}
          <div className="lg:col-span-2 space-y-6">
            {/* Manuscript Information */}
            <div className="bg-white rounded-sm border border-[#EAEDF2] shadow-sm p-6">
              <div className="flex items-center gap-3 mb-6">
                <div className="w-10 h-10 bg-[#0F2D5E] rounded-sm flex items-center justify-center">
                  <FileText className="w-5 h-5 text-white" />
                </div>
                <h2 className="text-xl font-serif font-semibold text-[#0F2D5E]">Manuscript Information</h2>
              </div>

              <div className="space-y-4">
                <div className="grid md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-medium text-gray-500 mb-1">Manuscript ID</label>
                    <p className="text-sm text-gray-900 font-medium">{manuscript.id}</p>
                  </div>
                  <div>
                    <label className="block text-xs font-medium text-gray-500 mb-1">Manuscript Type</label>
                    <p className="text-sm text-gray-900">Research Article</p>
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-medium text-gray-500 mb-1">Manuscript Title</label>
                  <p className="text-base font-medium text-gray-900">{manuscript.title}</p>
                </div>

                <div className="grid md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-medium text-gray-500 mb-2">Research Area</label>
                    <p className="text-sm text-gray-900 font-medium">{manuscript.category}</p>
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
                    </div>
                  </div>
                </div>

                <div className="grid md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-medium text-gray-500 mb-1">Complexity Level</label>
                    <div className="flex items-center gap-2">
                      <div className="flex-1 bg-gray-200 rounded-full h-2">
                        <div className="bg-amber-500 rounded-full h-2" style={{ width: '65%' }} />
                      </div>
                      <span className="text-sm font-medium text-gray-900">Moderate</span>
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-medium text-gray-500 mb-1">Estimated Timeline</label>
                    <div className="flex items-center gap-2">
                      <Clock className="w-4 h-4 text-gray-400" />
                      <p className="text-sm text-gray-900">21-28 days</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Editorial Assessment Summary */}
            <div className="bg-white rounded-sm border border-[#EAEDF2] shadow-sm p-6">
              <div className="flex items-center gap-3 mb-6">
                <div className="w-10 h-10 bg-[#0F2D5E] rounded-sm flex items-center justify-center">
                  <Shield className="w-5 h-5 text-white" />
                </div>
                <h2 className="text-xl font-serif font-semibold text-[#0F2D5E]">Editorial Assessment Summary</h2>
              </div>

              <div className="space-y-4">
                <div className="grid md:grid-cols-2 gap-4">
                  <div className="bg-gray-50 rounded-sm p-3">
                    <label className="block text-xs font-medium text-gray-500 mb-1">Scope Relevance</label>
                    <p className="text-sm font-medium text-gray-900">{assessmentSummary.scopeRelevance}</p>
                  </div>

                  <div className="bg-gray-50 rounded-sm p-3">
                    <label className="block text-xs font-medium text-gray-500 mb-1">Completeness</label>
                    <p className="text-sm font-medium text-gray-900">{assessmentSummary.completeness}</p>
                  </div>

                  <div className="bg-gray-50 rounded-sm p-3">
                    <label className="block text-xs font-medium text-gray-500 mb-1">Writing Quality</label>
                    <p className="text-sm font-medium text-gray-900">{assessmentSummary.writingQuality}</p>
                  </div>

                  <div className="bg-gray-50 rounded-sm p-3">
                    <label className="block text-xs font-medium text-gray-500 mb-1">Plagiarism Status</label>
                    <div className="flex items-center gap-2">
                      <CheckCircle className="w-4 h-4 text-green-600" />
                      <p className="text-sm font-medium text-green-700">{assessmentSummary.plagiarismStatus}</p>
                    </div>
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-medium text-gray-500 mb-2">Editorial Notes</label>
                  <div className="bg-blue-50 rounded-sm p-4 border border-blue-100">
                    <p className="text-sm text-gray-700 leading-relaxed">{assessmentSummary.editorialNotes}</p>
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-medium text-gray-500 mb-2">Required Changes</label>
                  <p className="text-sm text-gray-900">{assessmentSummary.requiredChanges}</p>
                </div>

                <div className="flex items-center gap-2 bg-green-50 rounded-sm p-3 border border-green-100">
                  <CheckCircle className="w-5 h-5 text-green-600" />
                  <div>
                    <label className="block text-xs font-medium text-gray-500">Author Agreement Status</label>
                    <p className="text-sm font-medium text-green-700">{assessmentSummary.authorAgreementStatus}</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Available Editors List */}
            <div className="bg-white rounded-sm border border-[#EAEDF2] shadow-sm p-6">
              <div className="flex items-center gap-3 mb-6">
                <div className="w-10 h-10 bg-[#0F2D5E] rounded-sm flex items-center justify-center">
                  <Users className="w-5 h-5 text-white" />
                </div>
                <h2 className="text-xl font-serif font-semibold text-[#0F2D5E]">Available Editors</h2>
              </div>

              <div className="space-y-3">
                {availableEditors.map((editor) => (
                  <div
                    key={editor.id}
                    onClick={() => setSelectedEditor(editor.id)}
                    className={`border-2 rounded-sm p-4 cursor-pointer transition-all ${
                      selectedEditor === editor.id
                        ? 'border-[#1a1f2e] bg-blue-50'
                        : 'border-gray-200 hover:border-gray-300'
                    }`}
                  >
                    <div className="flex items-start justify-between mb-3">
                      <div className="flex-1">
                        <div className="flex items-center gap-3 mb-2">
                          <h3 className="text-base font-semibold text-gray-900">{editor.name}</h3>
                          <span className={`px-2 py-1 rounded-full text-xs font-medium ${getAvailabilityColor(editor.availabilityStatus)}`}>
                            {editor.availabilityStatus}
                          </span>
                        </div>
                        <p className="text-sm text-gray-600 mb-2">{editor.specialization}</p>
                        <div className="flex flex-wrap gap-2">
                          {editor.expertise.map((exp, index) => (
                            <span key={index} className="px-2 py-1 bg-gray-100 text-gray-700 rounded-sm text-xs">
                              {exp}
                            </span>
                          ))}
                        </div>
                      </div>
                      {selectedEditor === editor.id && (
                        <CheckCircle className="w-6 h-6 text-[#0F2D5E] flex-shrink-0" />
                      )}
                    </div>

                    <div className="grid grid-cols-3 gap-4 pt-3 border-t border-gray-200">
                      <div>
                        <label className="block text-xs text-gray-500 mb-1">Current Workload</label>
                        <div className="flex items-center gap-2">
                          <p className="text-sm font-medium text-gray-900">
                            {editor.activeManuscripts}/{editor.maxCapacity}
                          </p>
                          <span className="text-xs text-gray-500">({getWorkloadPercentage(editor)}%)</span>
                        </div>
                        <div className="w-full bg-gray-200 rounded-full h-1.5 mt-1">
                          <div
                            className={`h-1.5 rounded-full ${
                              getWorkloadPercentage(editor) >= 75
                                ? 'bg-red-500'
                                : getWorkloadPercentage(editor) >= 50
                                ? 'bg-amber-500'
                                : 'bg-green-500'
                            }`}
                            style={{ width: `${getWorkloadPercentage(editor)}%` }}
                          />
                        </div>
                      </div>

                      <div>
                        <label className="block text-xs text-gray-500 mb-1">Avg Review Time</label>
                        <p className="text-sm font-medium text-gray-900">{editor.avgReviewTime} days</p>
                      </div>

                      <div>
                        <label className="block text-xs text-gray-500 mb-1">Active Manuscripts</label>
                        <p className="text-sm font-medium text-gray-900">{editor.activeManuscripts}</p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Right Column - Assignment Form */}
          <div className="space-y-6">
            {/* Assignment Form */}
            <div className="bg-white rounded-sm border border-[#EAEDF2] shadow-sm p-6">
              <div className="flex items-center gap-3 mb-6">
                <div className="w-10 h-10 bg-[#0F2D5E] rounded-sm flex items-center justify-center">
                  <Target className="w-5 h-5 text-white" />
                </div>
                <h2 className="text-lg font-serif font-semibold text-[#0F2D5E]">Assignment Details</h2>
              </div>

              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Selected Editor <span className="text-red-500">*</span>
                  </label>
                  {selectedEditor ? (
                    <div className="bg-blue-50 border border-blue-200 rounded-sm p-3">
                      <div className="flex items-center gap-2">
                        <User className="w-4 h-4 text-blue-600" />
                        <p className="text-sm font-medium text-gray-900">
                          {availableEditors.find((e) => e.id === selectedEditor)?.name}
                        </p>
                      </div>
                      <p className="text-xs text-gray-600 mt-1">
                        {availableEditors.find((e) => e.id === selectedEditor)?.specialization}
                      </p>
                    </div>
                  ) : (
                    <div className="bg-gray-50 border border-gray-200 rounded-sm p-3 text-center">
                      <p className="text-sm text-gray-500">Select an editor from the list above</p>
                    </div>
                  )}
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Priority Level <span className="text-red-500">*</span>
                  </label>
                  <select
                    value={priorityLevel}
                    onChange={(e) => setPriorityLevel(e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-sm focus:outline-none focus:ring-2 focus:ring-[#1a1f2e] text-sm"
                  >
                    <option value="normal">Normal</option>
                    <option value="high">High Priority</option>
                    <option value="urgent">Urgent</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Assignment Deadline <span className="text-gray-400">(optional)</span>
                  </label>
                  <input
                    type="date"
                    value={assignmentDeadline}
                    onChange={(e) => setAssignmentDeadline(e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-sm focus:outline-none focus:ring-2 focus:ring-[#1a1f2e] text-sm"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Assignment Notes</label>
                  <textarea
                    value={assignmentNotes}
                    onChange={(e) => setAssignmentNotes(e.target.value)}
                    rows={6}
                    className="w-full px-3 py-2 border border-gray-300 rounded-sm focus:outline-none focus:ring-2 focus:ring-[#1a1f2e] text-sm resize-none"
                    placeholder="Example: Please prioritize reviewer selection for cybersecurity expertise."
                  />
                </div>
              </div>
            </div>

            {/* Action Button */}
            <div className="bg-white rounded-sm border border-[#EAEDF2] shadow-sm p-6">
              <button
                onClick={handleAssignEditor}
                disabled={!selectedEditor}
                className="w-full flex items-center justify-center gap-2 px-4 py-3 bg-[#0F2D5E] text-white rounded-sm hover:bg-[#1A4A8A] transition-colors font-medium disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <Send className="w-5 h-5" />
                Assign Editor
              </button>

              {!selectedEditor && (
                <div className="mt-3 flex items-start gap-2 text-sm text-amber-700 bg-amber-50 border border-amber-200 rounded-sm p-3">
                  <AlertCircle className="w-4 h-4 flex-shrink-0 mt-0.5" />
                  <p>Please select an editor before submitting</p>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
