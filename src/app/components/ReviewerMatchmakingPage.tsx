import React, { useState, useMemo } from 'react';
import {
  ArrowLeft,
  FileText,
  Users,
  Clock,
  CheckCircle,
  XCircle,
  AlertTriangle,
  Search,
  Filter,
  Star,
  TrendingUp,
  Calendar,
  Send,
  Save,
  Eye,
  Target,
  BarChart3,
  Shield,
  RefreshCw,
  Tag,
  Sparkles,
} from 'lucide-react';
import type { Manuscript } from '../types';

interface ReviewerMatchmakingPageProps {
  manuscript: Manuscript;
  onBack?: () => void;
  onInvitationSent?: (data: any) => void;
}

interface Reviewer {
  id: string;
  name: string;
  email: string;
  expertise: string[];
  specialization: string;
  currentWorkload: number;
  maxCapacity: number;
  avgReviewDuration: number;
  availabilityStatus: 'available' | 'limited' | 'unavailable';
  completedReviews: number;
  onTimeRate: number;
  qualityScore: number;
  lastReviewDate: Date;
}

export function ReviewerMatchmakingPage({
  manuscript,
  onBack,
  onInvitationSent,
}: ReviewerMatchmakingPageProps) {
  // Mock reviewers data
  const allReviewers: Reviewer[] = [
    {
      id: 'rev-001',
      name: 'Dr. Maria Cruz',
      email: 'maria.cruz@university.edu',
      expertise: ['Cybersecurity', 'Network Security', 'Data Protection'],
      specialization: 'Cybersecurity',
      currentWorkload: 2,
      maxCapacity: 5,
      avgReviewDuration: 12,
      availabilityStatus: 'available',
      completedReviews: 45,
      onTimeRate: 92,
      qualityScore: 4.8,
      lastReviewDate: new Date('2026-04-15'),
    },
    {
      id: 'rev-002',
      name: 'Prof. Carlos Santos',
      email: 'carlos.santos@institute.org',
      expertise: ['Data Analytics', 'Machine Learning', 'Statistical Analysis'],
      specialization: 'Data Science',
      currentWorkload: 4,
      maxCapacity: 5,
      avgReviewDuration: 18,
      availabilityStatus: 'limited',
      completedReviews: 67,
      onTimeRate: 88,
      qualityScore: 4.6,
      lastReviewDate: new Date('2026-05-10'),
    },
    {
      id: 'rev-003',
      name: 'Dr. Ana Reyes',
      email: 'ana.reyes@tech.edu',
      expertise: ['Software Engineering', 'Systems Design', 'Code Quality'],
      specialization: 'Software Engineering',
      currentWorkload: 1,
      maxCapacity: 4,
      avgReviewDuration: 10,
      availabilityStatus: 'available',
      completedReviews: 32,
      onTimeRate: 95,
      qualityScore: 4.9,
      lastReviewDate: new Date('2026-03-20'),
    },
    {
      id: 'rev-004',
      name: 'Dr. Robert Chen',
      email: 'robert.chen@research.com',
      expertise: ['Machine Learning', 'Climate Science', 'Environmental Modeling'],
      specialization: 'Climate & AI',
      currentWorkload: 3,
      maxCapacity: 6,
      avgReviewDuration: 15,
      availabilityStatus: 'available',
      completedReviews: 58,
      onTimeRate: 90,
      qualityScore: 4.7,
      lastReviewDate: new Date('2026-05-01'),
    },
    {
      id: 'rev-005',
      name: 'Prof. Linda Wang',
      email: 'linda.wang@university.edu',
      expertise: ['Artificial Intelligence', 'Deep Learning', 'Neural Networks'],
      specialization: 'AI Research',
      currentWorkload: 5,
      maxCapacity: 5,
      avgReviewDuration: 20,
      availabilityStatus: 'unavailable',
      completedReviews: 89,
      onTimeRate: 85,
      qualityScore: 4.5,
      lastReviewDate: new Date('2026-05-18'),
    },
    {
      id: 'rev-006',
      name: 'Dr. James Miller',
      email: 'james.miller@tech.edu',
      expertise: ['Data Mining', 'Predictive Analytics', 'Big Data'],
      specialization: 'Data Science',
      currentWorkload: 2,
      maxCapacity: 5,
      avgReviewDuration: 14,
      availabilityStatus: 'available',
      completedReviews: 41,
      onTimeRate: 93,
      qualityScore: 4.8,
      lastReviewDate: new Date('2026-04-28'),
    },
  ];

  // State
  const [selectedReviewers, setSelectedReviewers] = useState<string[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [filterExpertise, setFilterExpertise] = useState('all');
  const [reviewPriority, setReviewPriority] = useState('normal');
  const [reviewDeadline, setReviewDeadline] = useState('');
  const [reviewerInstructions, setReviewerInstructions] = useState('');
  const [reviewType, setReviewType] = useState('single_blind');
  const [invitationSent, setInvitationSent] = useState(false);

  // System recommendations
  const systemRecommendations = useMemo(() => {
    const selectedReviewerData = allReviewers.filter((r) => selectedReviewers.includes(r.id));
    const avgDuration = selectedReviewerData.length > 0
      ? Math.round(selectedReviewerData.reduce((sum, r) => sum + r.avgReviewDuration, 0) / selectedReviewerData.length)
      : 14;

    const delayRisk = selectedReviewerData.some((r) => r.onTimeRate < 85) ? 'High' :
                      selectedReviewerData.some((r) => r.onTimeRate < 90) ? 'Medium' : 'Low';

    const hasOverloaded = selectedReviewerData.some((r) => r.currentWorkload >= r.maxCapacity);

    return {
      suggestedCount: 2,
      estimatedDuration: avgDuration,
      delayRisk,
      workloadWarning: hasOverloaded,
    };
  }, [selectedReviewers, allReviewers]);

  // Filter reviewers
  const filteredReviewers = useMemo(() => {
    let filtered = allReviewers;

    if (searchQuery.trim()) {
      filtered = filtered.filter(
        (r) =>
          r.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
          r.specialization.toLowerCase().includes(searchQuery.toLowerCase()) ||
          r.expertise.some((exp) => exp.toLowerCase().includes(searchQuery.toLowerCase()))
      );
    }

    if (filterExpertise !== 'all') {
      filtered = filtered.filter((r) => r.expertise.includes(filterExpertise));
    }

    return filtered;
  }, [searchQuery, filterExpertise, allReviewers]);

  const handleToggleReviewer = (reviewerId: string) => {
    setSelectedReviewers((prev) =>
      prev.includes(reviewerId)
        ? prev.filter((id) => id !== reviewerId)
        : [...prev, reviewerId]
    );
  };

  const handleSendInvitation = () => {
    if (selectedReviewers.length === 0) {
      alert('Please select at least one reviewer before sending invitations.');
      return;
    }

    if (!reviewDeadline) {
      alert('Please set a review deadline.');
      return;
    }

    const invitationData = {
      manuscriptId: manuscript.id,
      selectedReviewers: selectedReviewers.map((id) => {
        const reviewer = allReviewers.find((r) => r.id === id);
        return {
          id: reviewer?.id,
          name: reviewer?.name,
          email: reviewer?.email,
        };
      }),
      reviewPriority,
      reviewDeadline,
      reviewerInstructions,
      reviewType,
      sentAt: new Date(),
    };

    setInvitationSent(true);

    if (onInvitationSent) {
      onInvitationSent(invitationData);
    }
  };

  // Success state after sending invitations
  if (invitationSent) {
    const invitedReviewers = allReviewers.filter((r) => selectedReviewers.includes(r.id));

    return (
      <div className="min-h-screen flex items-center justify-center p-6" style={{ backgroundColor: '#F7F8FA' }}>
        <div className="max-w-3xl w-full bg-white rounded-xl p-12" style={{ border: '0.5px solid #EAEDF2' }}>
          <div className="text-center">
            <div className="w-20 h-20 bg-green-50 rounded-full flex items-center justify-center mx-auto mb-6">
              <CheckCircle className="w-16 h-16 text-green-600" />
            </div>
            <h1 className="text-[32px] font-semibold mb-3" style={{ fontFamily: 'Inter, sans-serif', color: '#2C2C2A' }}>
              Reviewer Invitations Sent
            </h1>
            <p className="text-[16px] text-gray-700 mb-2" style={{ fontFamily: 'DM Sans, sans-serif' }}>
              {selectedReviewers.length} reviewer{selectedReviewers.length > 1 ? 's have' : ' has'} been invited to review this manuscript
            </p>
            <p className="text-[14px] text-gray-600 mb-8" style={{ fontFamily: 'DM Sans, sans-serif' }}>
              Manuscript ID: <span className="font-medium" style={{ fontFamily: 'JetBrains Mono, monospace' }}>{manuscript.id}</span>
            </p>

            <div className="bg-green-50 border border-green-200 rounded-sm p-6 mb-6 text-left">
              <div className="flex items-center gap-2 mb-4">
                <Shield className="w-5 h-5 text-gray-700" />
                <h3 className="font-semibold text-gray-900">System Outputs</h3>
              </div>
              <div className="space-y-3">
                <div className="flex items-start gap-2">
                  <CheckCircle className="w-4 h-4 text-green-600 flex-shrink-0 mt-0.5" />
                  <div className="flex-1">
                    <p className="text-sm font-medium text-gray-900">Reviewer Invitations Sent</p>
                    <p className="text-xs text-gray-600">Email notifications sent to all selected reviewers</p>
                  </div>
                </div>
                <div className="flex items-start gap-2">
                  <CheckCircle className="w-4 h-4 text-green-600 flex-shrink-0 mt-0.5" />
                  <div className="flex-1">
                    <p className="text-sm font-medium text-gray-900">Timeline Monitoring Started</p>
                    <p className="text-xs text-gray-600">Review deadline tracking activated</p>
                  </div>
                </div>
                <div className="flex items-start gap-2">
                  <CheckCircle className="w-4 h-4 text-green-600 flex-shrink-0 mt-0.5" />
                  <div className="flex-1">
                    <p className="text-sm font-medium text-gray-900">Reviewer Assignment Recorded</p>
                    <p className="text-xs text-gray-600">Assignment data saved to database</p>
                  </div>
                </div>
                <div className="flex items-start gap-2">
                  <CheckCircle className="w-4 h-4 text-green-600 flex-shrink-0 mt-0.5" />
                  <div className="flex-1">
                    <p className="text-sm font-medium text-gray-900">Manuscript Status Updated</p>
                    <p className="text-xs text-gray-600">Status changed to "Reviewer Invitation Sent"</p>
                  </div>
                </div>
                <div className="flex items-start gap-2">
                  <CheckCircle className="w-4 h-4 text-green-600 flex-shrink-0 mt-0.5" />
                  <div className="flex-1">
                    <p className="text-sm font-medium text-gray-900">Activity Log Updated</p>
                    <p className="text-xs text-gray-600">Audit trail entry created</p>
                  </div>
                </div>
              </div>
            </div>

            <div className="bg-blue-50 border border-blue-200 rounded-sm p-4 mb-8 text-left">
              <h4 className="text-sm font-semibold text-gray-900 mb-3">Invited Reviewers</h4>
              <div className="space-y-2">
                {invitedReviewers.map((reviewer) => (
                  <div key={reviewer.id} className="flex items-center gap-2">
                    <Users className="w-4 h-4 text-blue-600" />
                    <span className="text-sm text-gray-700">{reviewer.name}</span>
                    <span className="text-xs text-gray-500">({reviewer.specialization})</span>
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
              <button className="px-8 py-3 text-white rounded-lg transition-colors font-semibold" style={{ backgroundColor: '#0F2D5E', fontFamily: 'DM Sans, sans-serif' }} onMouseEnter={(e) => e.currentTarget.style.backgroundColor = '#1A4A8A'} onMouseLeave={(e) => e.currentTarget.style.backgroundColor = '#0F2D5E'}>
                View Review Status
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

  const getWorkloadPercentage = (reviewer: Reviewer) => {
    return Math.round((reviewer.currentWorkload / reviewer.maxCapacity) * 100);
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
              <h1 className="text-[22px] font-semibold" style={{ fontFamily: 'Inter, sans-serif' }}>Reviewer Matchmaking</h1>
              <p className="text-[14px] text-gray-300 mt-1" style={{ fontFamily: 'DM Sans, sans-serif' }}>
                Select and invite reviewers with timeline optimization
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
          {/* Left Column - Manuscript Info & Reviewers */}
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
                <div className="grid md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-medium text-gray-500 mb-1">Manuscript ID</label>
                    <p className="text-sm text-gray-900 font-medium">{manuscript.id}</p>
                  </div>
                  <div>
                    <label className="block text-xs font-medium text-gray-500 mb-1">Required Reviewers</label>
                    <p className="text-sm text-gray-900 font-medium">{systemRecommendations.suggestedCount}</p>
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
                    <label className="block text-xs font-medium text-gray-500 mb-1">Est. Review Timeline</label>
                    <div className="flex items-center gap-2">
                      <Clock className="w-4 h-4 text-gray-400" />
                      <p className="text-sm text-gray-900">{systemRecommendations.estimatedDuration} days</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Search and Filter */}
            <div className="bg-white rounded-xl p-4" style={{ border: '0.5px solid #EAEDF2' }}>
              <div className="flex gap-3">
                <div className="flex-1 relative">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                  <input
                    type="text"
                    placeholder="Search reviewers by name, expertise..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-sm focus:outline-none focus:ring-2 focus:ring-[#1a1f2e] text-sm"
                  />
                </div>
                <select
                  value={filterExpertise}
                  onChange={(e) => setFilterExpertise(e.target.value)}
                  className="px-4 py-2 border border-gray-300 rounded-sm focus:outline-none focus:ring-2 focus:ring-[#1a1f2e] text-sm"
                >
                  <option value="all">All Expertise</option>
                  <option value="Machine Learning">Machine Learning</option>
                  <option value="Cybersecurity">Cybersecurity</option>
                  <option value="Data Analytics">Data Analytics</option>
                  <option value="Climate Science">Climate Science</option>
                </select>
                <button className="flex items-center gap-2 px-4 py-2 border border-gray-300 rounded-sm hover:bg-gray-50 transition-colors">
                  <Filter className="w-4 h-4" />
                  <span className="text-sm">Filter</span>
                </button>
              </div>
            </div>

            {/* Reviewer Pool List */}
            <div className="bg-white rounded-xl p-6" style={{ border: '0.5px solid #EAEDF2' }}>
              <div className="flex items-center justify-between mb-6">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-lg flex items-center justify-center" style={{ backgroundColor: '#0F2D5E' }}>
                    <Users className="w-5 h-5 text-white" />
                  </div>
                  <div>
                    <h2 className="text-[22px] font-semibold" style={{ fontFamily: 'Inter, sans-serif', color: '#2C2C2A' }}>Reviewer Pool</h2>
                    <p className="text-xs text-gray-600">
                      {selectedReviewers.length} of {filteredReviewers.length} selected
                    </p>
                  </div>
                </div>
                <button className="flex items-center gap-2 px-3 py-2 text-sm text-blue-600 hover:bg-blue-50 rounded-sm transition-colors">
                  <RefreshCw className="w-4 h-4" />
                  Recalculate Timeline
                </button>
              </div>

              <div className="space-y-3">
                {filteredReviewers.map((reviewer) => (
                  <div
                    key={reviewer.id}
                    className={`border-2 rounded-sm p-4 cursor-pointer transition-all ${
                      selectedReviewers.includes(reviewer.id)
                        ? 'border-[#1a1f2e] bg-blue-50'
                        : 'border-gray-200 hover:border-gray-300'
                    }`}
                    onClick={() => handleToggleReviewer(reviewer.id)}
                  >
                    <div className="flex items-start gap-4">
                      <input
                        type="checkbox"
                        checked={selectedReviewers.includes(reviewer.id)}
                        onChange={() => handleToggleReviewer(reviewer.id)}
                        className="mt-1 w-5 h-5 text-[#1a1f2e] rounded focus:ring-2 focus:ring-[#1a1f2e]"
                        onClick={(e) => e.stopPropagation()}
                      />

                      <div className="flex-1">
                        <div className="flex items-start justify-between mb-2">
                          <div>
                            <div className="flex items-center gap-3 mb-1">
                              <h3 className="text-base font-semibold text-gray-900">{reviewer.name}</h3>
                              <span className={`px-2 py-1 rounded-full text-xs font-medium ${getAvailabilityColor(reviewer.availabilityStatus)}`}>
                                {reviewer.availabilityStatus}
                              </span>
                            </div>
                            <p className="text-sm text-gray-600 mb-2">{reviewer.specialization}</p>
                            <div className="flex flex-wrap gap-2">
                              {reviewer.expertise.map((exp, index) => (
                                <span key={index} className="px-2 py-1 bg-gray-100 text-gray-700 rounded-sm text-xs">
                                  {exp}
                                </span>
                              ))}
                            </div>
                          </div>
                        </div>

                        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 pt-3 border-t border-gray-200">
                          <div>
                            <label className="block text-xs text-gray-500 mb-1">Workload</label>
                            <div className="flex items-center gap-2">
                              <p className="text-sm font-medium text-gray-900">
                                {reviewer.currentWorkload}/{reviewer.maxCapacity}
                              </p>
                              <span className="text-xs text-gray-500">({getWorkloadPercentage(reviewer)}%)</span>
                            </div>
                            <div className="w-full bg-gray-200 rounded-full h-1.5 mt-1">
                              <div
                                className={`h-1.5 rounded-full ${
                                  getWorkloadPercentage(reviewer) >= 75
                                    ? 'bg-red-500'
                                    : getWorkloadPercentage(reviewer) >= 50
                                    ? 'bg-amber-500'
                                    : 'bg-green-500'
                                }`}
                                style={{ width: `${getWorkloadPercentage(reviewer)}%` }}
                              />
                            </div>
                          </div>

                          <div>
                            <label className="block text-xs text-gray-500 mb-1">Avg Duration</label>
                            <p className="text-sm font-medium text-gray-900">{reviewer.avgReviewDuration} days</p>
                          </div>

                          <div>
                            <label className="block text-xs text-gray-500 mb-1">On-Time Rate</label>
                            <div className="flex items-center gap-1">
                              <p className="text-sm font-medium text-gray-900">{reviewer.onTimeRate}%</p>
                              {reviewer.onTimeRate >= 90 ? (
                                <CheckCircle className="w-3.5 h-3.5 text-green-600" />
                              ) : (
                                <AlertTriangle className="w-3.5 h-3.5 text-amber-600" />
                              )}
                            </div>
                          </div>

                          <div>
                            <label className="block text-xs text-gray-500 mb-1">Quality Score</label>
                            <div className="flex items-center gap-1">
                              <Star className="w-3.5 h-3.5 text-amber-500 fill-amber-500" />
                              <p className="text-sm font-medium text-gray-900">{reviewer.qualityScore}/5.0</p>
                            </div>
                          </div>
                        </div>

                        <div className="flex items-center gap-3 mt-3 pt-3 border-t border-gray-200">
                          <div className="text-xs text-gray-600">
                            <span className="font-medium">{reviewer.completedReviews}</span> completed reviews
                          </div>
                          <div className="text-xs text-gray-600">
                            Last review: {reviewer.lastReviewDate.toLocaleDateString()}
                          </div>
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                            }}
                            className="ml-auto flex items-center gap-1 px-3 py-1 text-xs text-blue-600 hover:bg-blue-50 rounded-sm transition-colors"
                          >
                            <Eye className="w-3.5 h-3.5" />
                            View Profile
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Right Column - System Recommendations & Assignment Form */}
          <div className="space-y-6">
            {/* System Timeline Recommendations */}
            <div className="rounded-xl p-6 text-white" style={{ backgroundColor: '#0F2D5E' }}>
              <div className="flex items-center gap-3 mb-6">
                <div className="w-10 h-10 bg-white/10 rounded-lg flex items-center justify-center">
                  <Sparkles className="w-5 h-5 text-white" />
                </div>
                <h2 className="text-[22px] font-semibold" style={{ fontFamily: 'Inter, sans-serif' }}>System Recommendations</h2>
              </div>

              <div className="space-y-4">
                <div className="bg-white/10 backdrop-blur rounded-sm p-4">
                  <label className="block text-xs text-white/80 mb-2">Suggested Reviewer Count</label>
                  <p className="text-2xl font-bold">{systemRecommendations.suggestedCount}</p>
                </div>

                <div className="bg-white/10 backdrop-blur rounded-sm p-4">
                  <label className="block text-xs text-white/80 mb-2">Estimated Review Duration</label>
                  <div className="flex items-center gap-2">
                    <Clock className="w-5 h-5" />
                    <p className="text-2xl font-bold">{systemRecommendations.estimatedDuration} Days</p>
                  </div>
                </div>

                <div className="bg-white/10 backdrop-blur rounded-sm p-4">
                  <label className="block text-xs text-white/80 mb-2">Reviewer Delay Risk</label>
                  <div className="flex items-center gap-2">
                    {systemRecommendations.delayRisk === 'Low' ? (
                      <CheckCircle className="w-5 h-5 text-green-400" />
                    ) : systemRecommendations.delayRisk === 'Medium' ? (
                      <AlertTriangle className="w-5 h-5 text-amber-400" />
                    ) : (
                      <XCircle className="w-5 h-5 text-red-400" />
                    )}
                    <p className="text-xl font-bold">{systemRecommendations.delayRisk}</p>
                  </div>
                </div>

                {systemRecommendations.workloadWarning && (
                  <div className="bg-red-500/20 border border-red-400/30 rounded-sm p-4">
                    <div className="flex items-start gap-2">
                      <AlertTriangle className="w-5 h-5 text-red-300 flex-shrink-0 mt-0.5" />
                      <div>
                        <p className="text-sm font-medium text-white">Workload Warning</p>
                        <p className="text-xs text-white/80 mt-1">
                          One or more selected reviewers are at full capacity
                        </p>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </div>

            {/* Assignment Form */}
            <div className="bg-white rounded-xl p-6" style={{ border: '0.5px solid #EAEDF2' }}>
              <div className="flex items-center gap-3 mb-6">
                <div className="w-10 h-10 rounded-lg flex items-center justify-center" style={{ backgroundColor: '#0F2D5E' }}>
                  <Target className="w-5 h-5 text-white" />
                </div>
                <h2 className="text-[22px] font-semibold" style={{ fontFamily: 'Inter, sans-serif', color: '#2C2C2A' }}>Assignment Details</h2>
              </div>

              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Review Priority <span className="text-red-500">*</span>
                  </label>
                  <select
                    value={reviewPriority}
                    onChange={(e) => setReviewPriority(e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-sm focus:outline-none focus:ring-2 focus:ring-[#1a1f2e] text-sm"
                  >
                    <option value="normal">Normal</option>
                    <option value="priority">Priority Assignment</option>
                    <option value="urgent">Urgent Review</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Review Deadline <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="date"
                    value={reviewDeadline}
                    onChange={(e) => setReviewDeadline(e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-sm focus:outline-none focus:ring-2 focus:ring-[#1a1f2e] text-sm"
                  />
                  <p className="text-xs text-gray-500 mt-1">
                    Suggested: {new Date(Date.now() + systemRecommendations.estimatedDuration * 24 * 60 * 60 * 1000).toLocaleDateString()}
                  </p>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Review Type <span className="text-red-500">*</span>
                  </label>
                  <select
                    value={reviewType}
                    onChange={(e) => setReviewType(e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-sm focus:outline-none focus:ring-2 focus:ring-[#1a1f2e] text-sm"
                  >
                    <option value="single_blind">Single-Blind Review</option>
                    <option value="double_blind">Double-Blind Review</option>
                    <option value="open">Open Review</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Reviewer Instructions</label>
                  <textarea
                    value={reviewerInstructions}
                    onChange={(e) => setReviewerInstructions(e.target.value)}
                    rows={5}
                    className="w-full px-3 py-2 border border-gray-300 rounded-sm focus:outline-none focus:ring-2 focus:ring-[#1a1f2e] text-sm resize-none"
                    placeholder="Example: Please focus on methodology accuracy and dataset validation."
                  />
                </div>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="bg-white rounded-xl p-6" style={{ border: '0.5px solid #EAEDF2' }}>
              <div className="space-y-3">
                <button
                  onClick={handleSendInvitation}
                  disabled={selectedReviewers.length === 0}
                  className="w-full flex items-center justify-center gap-2 px-4 py-3 text-white rounded-lg transition-colors font-semibold disabled:opacity-50 disabled:cursor-not-allowed"
                  style={{ backgroundColor: '#0F2D5E', fontFamily: 'DM Sans, sans-serif' }}
                  onMouseEnter={(e) => !selectedReviewers.length ? null : e.currentTarget.style.backgroundColor = '#1A4A8A'}
                  onMouseLeave={(e) => e.currentTarget.style.backgroundColor = '#0F2D5E'}
                >
                  <Send className="w-5 h-5" />
                  Send Invitation
                </button>

                <button className="w-full flex items-center justify-center gap-2 px-4 py-2.5 text-gray-700 hover:bg-gray-50 transition-colors text-[14px] font-semibold rounded-lg" style={{ border: '0.5px solid #EAEDF2', fontFamily: 'DM Sans, sans-serif' }}>
                  <Save className="w-4 h-4" />
                  Save Selection
                </button>

                {selectedReviewers.length === 0 && (
                  <div className="flex items-start gap-2 text-sm text-amber-700 bg-amber-50 border border-amber-200 rounded-sm p-3">
                    <AlertTriangle className="w-4 h-4 flex-shrink-0 mt-0.5" />
                    <p>Please select at least one reviewer before sending invitations</p>
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
