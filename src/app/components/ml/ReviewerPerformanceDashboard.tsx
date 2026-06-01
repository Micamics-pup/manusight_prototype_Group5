import React, { useState } from 'react';
import { useData } from '../../context/DataContext';
import {
  ArrowLeft,
  TrendingUp,
  Award,
  Clock,
  Target,
  AlertCircle,
  CheckCircle,
  Activity,
  BarChart3,
} from 'lucide-react';
import { BarChart, Bar, LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend } from 'recharts';

interface ReviewerPerformanceDashboardProps {
  onBack?: () => void;
}

export function ReviewerPerformanceDashboard({ onBack }: ReviewerPerformanceDashboardProps) {
  const { reviewerProfiles, reviewerPerformance } = useData();
  const [sortBy, setSortBy] = useState<'rating' | 'efficiency' | 'reliability'>('rating');

  const enrichedPerformance = reviewerPerformance.map(perf => {
    const reviewer = reviewerProfiles.find(r => r.id === perf.reviewerId);
    return {
      ...perf,
      reviewerName: reviewer?.name || 'Unknown',
      institution: reviewer?.institution || 'N/A',
    };
  }).sort((a, b) => {
    if (sortBy === 'rating') return b.performanceRating - a.performanceRating;
    if (sortBy === 'efficiency') return b.efficiencyScore - a.efficiencyScore;
    return b.reliabilityScore - a.reliabilityScore;
  });

  const chartData = enrichedPerformance.map(perf => ({
    name: perf.reviewerName.split(' ').slice(0, 2).join(' '),
    rating: perf.performanceRating,
    reliability: perf.reliabilityScore,
    efficiency: perf.efficiencyScore,
  }));

  const timelineData = enrichedPerformance.map((perf, idx) => ({
    month: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun'][idx % 6],
    reviews: perf.reviewsCompleted,
    avgDays: perf.averageReviewDuration,
  }));

  const getRatingColor = (rating: number) => {
    if (rating >= 4.5) return 'text-green-700 bg-green-100';
    if (rating >= 4.0) return 'text-blue-700 bg-blue-100';
    if (rating >= 3.5) return 'text-yellow-700 bg-yellow-100';
    return 'text-red-700 bg-red-100';
  };

  const getScoreBar = (score: number) => {
    const color = score >= 90 ? 'bg-green-500' : score >= 75 ? 'bg-blue-500' : score >= 60 ? 'bg-yellow-500' : 'bg-red-500';
    return (
      <div className="w-full bg-gray-200 rounded-full h-2">
        <div className={`h-2 rounded-full ${color}`} style={{ width: `${score}%` }} />
      </div>
    );
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {onBack && (
          <button
            onClick={onBack}
            className="mb-6 flex items-center gap-2 text-gray-600 hover:text-gray-900"
          >
            <ArrowLeft className="w-5 h-5" />
            Back
          </button>
        )}

        <div className="mb-8">
          <div className="flex items-center gap-3 mb-2">
            <TrendingUp className="w-8 h-8 text-green-600" />
            <h1 className="text-3xl font-bold text-gray-900">Reviewer Performance Dashboard</h1>
          </div>
          <p className="text-gray-600">
            Historical reviewer performance data used by ML models for matchmaking and timeline prediction
          </p>
        </div>

        {/* Summary Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
          <div className="bg-white rounded-lg shadow-md p-4">
            <div className="flex items-center gap-2 mb-2">
              <Award className="w-5 h-5 text-purple-600" />
              <h3 className="text-sm font-medium text-gray-600">Avg Performance</h3>
            </div>
            <div className="text-2xl font-bold text-gray-900">
              {(enrichedPerformance.reduce((sum, p) => sum + p.performanceRating, 0) / enrichedPerformance.length).toFixed(2)}
            </div>
            <div className="text-xs text-gray-500">out of 5.0</div>
          </div>

          <div className="bg-white rounded-lg shadow-md p-4">
            <div className="flex items-center gap-2 mb-2">
              <CheckCircle className="w-5 h-5 text-green-600" />
              <h3 className="text-sm font-medium text-gray-600">Total Reviews</h3>
            </div>
            <div className="text-2xl font-bold text-gray-900">
              {enrichedPerformance.reduce((sum, p) => sum + p.reviewsCompleted, 0)}
            </div>
            <div className="text-xs text-gray-500">completed</div>
          </div>

          <div className="bg-white rounded-lg shadow-md p-4">
            <div className="flex items-center gap-2 mb-2">
              <Clock className="w-5 h-5 text-blue-600" />
              <h3 className="text-sm font-medium text-gray-600">Avg Review Time</h3>
            </div>
            <div className="text-2xl font-bold text-gray-900">
              {Math.round(enrichedPerformance.reduce((sum, p) => sum + p.averageReviewDuration, 0) / enrichedPerformance.length)}
            </div>
            <div className="text-xs text-gray-500">days</div>
          </div>

          <div className="bg-white rounded-lg shadow-md p-4">
            <div className="flex items-center gap-2 mb-2">
              <Target className="w-5 h-5 text-orange-600" />
              <h3 className="text-sm font-medium text-gray-600">On-Time Rate</h3>
            </div>
            <div className="text-2xl font-bold text-gray-900">
              {Math.round(enrichedPerformance.reduce((sum, p) => sum + p.onTimeCompletionRate, 0) / enrichedPerformance.length)}%
            </div>
            <div className="text-xs text-gray-500">average</div>
          </div>
        </div>

        {/* Charts */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
          <div className="bg-white rounded-lg shadow-md p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Performance Metrics Comparison</h3>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={chartData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="name" />
                <YAxis />
                <Tooltip />
                <Legend />
                <Bar dataKey="reliability" fill="#3b82f6" name="Reliability %" />
                <Bar dataKey="efficiency" fill="#8b5cf6" name="Efficiency %" />
              </BarChart>
            </ResponsiveContainer>
          </div>

          <div className="bg-white rounded-lg shadow-md p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Review Completion Trends</h3>
            <ResponsiveContainer width="100%" height={300}>
              <LineChart data={timelineData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="month" />
                <YAxis yAxisId="left" />
                <YAxis yAxisId="right" orientation="right" />
                <Tooltip />
                <Legend />
                <Line yAxisId="left" type="monotone" dataKey="reviews" stroke="#10b981" name="Reviews" strokeWidth={2} />
                <Line yAxisId="right" type="monotone" dataKey="avgDays" stroke="#f59e0b" name="Avg Days" strokeWidth={2} />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Sort Control */}
        <div className="bg-white rounded-lg shadow-md p-4 mb-6">
          <div className="flex items-center gap-4">
            <span className="text-sm font-medium text-gray-700">Sort by:</span>
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value as any)}
              className="px-3 py-1 border border-gray-300 rounded-md"
            >
              <option value="rating">Performance Rating</option>
              <option value="efficiency">Efficiency Score</option>
              <option value="reliability">Reliability Score</option>
            </select>
          </div>
        </div>

        {/* Reviewer Performance List */}
        <div className="space-y-4">
          {enrichedPerformance.map((perf, idx) => (
            <div key={perf.id} className="bg-white rounded-lg shadow-md p-6">
              <div className="flex justify-between items-start mb-4">
                <div>
                  <div className="flex items-center gap-3 mb-1">
                    <span className="text-2xl font-bold text-gray-400">#{idx + 1}</span>
                    <h3 className="text-xl font-semibold text-gray-900">{perf.reviewerName}</h3>
                    <span className={`px-3 py-1 rounded-full text-xs font-medium ${getRatingColor(perf.performanceRating)}`}>
                      {perf.performanceRating.toFixed(1)} / 5.0
                    </span>
                  </div>
                  <div className="text-sm text-gray-600">{perf.institution}</div>
                </div>
                <div className="text-right">
                  <div className="text-sm text-gray-600">Active Assignments</div>
                  <div className="text-2xl font-bold text-blue-600">{perf.activeAssignments}</div>
                </div>
              </div>

              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-4">
                <div>
                  <div className="text-xs text-gray-600 mb-1">Reviews Completed</div>
                  <div className="text-lg font-semibold text-gray-900">{perf.reviewsCompleted}</div>
                </div>
                <div>
                  <div className="text-xs text-gray-600 mb-1">Avg Duration</div>
                  <div className="text-lg font-semibold text-gray-900">{perf.averageReviewDuration} days</div>
                </div>
                <div>
                  <div className="text-xs text-gray-600 mb-1">On-Time Rate</div>
                  <div className="text-lg font-semibold text-gray-900">{perf.onTimeCompletionRate}%</div>
                </div>
                <div>
                  <div className="text-xs text-gray-600 mb-1">Overdue</div>
                  <div className={`text-lg font-semibold ${perf.overdueReviews > 0 ? 'text-red-600' : 'text-green-600'}`}>
                    {perf.overdueReviews}
                  </div>
                </div>
              </div>

              <div className="space-y-3">
                <div>
                  <div className="flex justify-between text-sm mb-1">
                    <span className="text-gray-700">Reliability Score</span>
                    <span className="font-medium">{perf.reliabilityScore}%</span>
                  </div>
                  {getScoreBar(perf.reliabilityScore)}
                </div>
                <div>
                  <div className="flex justify-between text-sm mb-1">
                    <span className="text-gray-700">Efficiency Score</span>
                    <span className="font-medium">{perf.efficiencyScore}%</span>
                  </div>
                  {getScoreBar(perf.efficiencyScore)}
                </div>
              </div>

              {perf.lastReviewDate && (
                <div className="mt-4 text-sm text-gray-600">
                  <Clock className="w-4 h-4 inline mr-1" />
                  Last review: {new Date(perf.lastReviewDate).toLocaleDateString()}
                </div>
              )}
            </div>
          ))}
        </div>

        {/* Usage Information */}
        <div className="bg-green-50 rounded-lg p-6 mt-6 border border-green-200">
          <div className="flex items-center gap-2 mb-3">
            <Activity className="w-5 h-5 text-green-600" />
            <h3 className="font-semibold text-gray-900">ML Model Usage</h3>
          </div>
          <div className="space-y-2 text-sm text-gray-700">
            <p>
              → <strong>Reviewer Matchmaking</strong> prioritizes reviewers with high performance ratings and reliability scores
            </p>
            <p>
              → <strong>Timeline Recommender</strong> uses average review duration to predict manuscript processing time
            </p>
            <p>
              → <strong>Risk Assessment</strong> considers overdue reviews and on-time completion rates for delay prediction
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
