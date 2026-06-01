import React, { useState } from 'react';
import { useData } from '../../context/DataContext';
import { ArrowLeft, Clock, TrendingUp, AlertTriangle, FileText, BarChart3 } from 'lucide-react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend, LineChart, Line } from 'recharts';

interface HistoricalWorkflowRecordsPageProps {
  onBack?: () => void;
}

export function HistoricalWorkflowRecordsPage({ onBack }: HistoricalWorkflowRecordsPageProps) {
  const { workflowHistory } = useData();
  const [filterCategory, setFilterCategory] = useState('all');

  const filteredHistory = filterCategory === 'all'
    ? workflowHistory
    : workflowHistory.filter(wf => wf.category === filterCategory);

  const categories = Array.from(new Set(workflowHistory.map(wf => wf.category)));

  const avgDurations = {
    editorialAssessment: Math.round(filteredHistory.reduce((sum, wf) => sum + wf.editorialAssessmentDays, 0) / filteredHistory.length),
    reviewerInvitation: Math.round(filteredHistory.reduce((sum, wf) => sum + wf.reviewerInvitationDays, 0) / filteredHistory.length),
    review: Math.round(filteredHistory.reduce((sum, wf) => sum + wf.reviewDays, 0) / filteredHistory.length),
    revision: Math.round(filteredHistory.reduce((sum, wf) => sum + wf.revisionDays, 0) / filteredHistory.length),
    reReview: Math.round(filteredHistory.reduce((sum, wf) => sum + wf.reReviewDays, 0) / filteredHistory.length),
    copyediting: Math.round(filteredHistory.reduce((sum, wf) => sum + wf.copyeditingDays, 0) / filteredHistory.length),
    layout: Math.round(filteredHistory.reduce((sum, wf) => sum + wf.layoutDays, 0) / filteredHistory.length),
    publication: Math.round(filteredHistory.reduce((sum, wf) => sum + wf.publicationDays, 0) / filteredHistory.length),
    total: Math.round(filteredHistory.reduce((sum, wf) => sum + wf.totalProcessingDays, 0) / filteredHistory.length),
  };

  const stageData = [
    { stage: 'Editorial', days: avgDurations.editorialAssessment },
    { stage: 'Invitation', days: avgDurations.reviewerInvitation },
    { stage: 'Review', days: avgDurations.review },
    { stage: 'Revision', days: avgDurations.revision },
    { stage: 'Re-review', days: avgDurations.reReview },
    { stage: 'Copyediting', days: avgDurations.copyediting },
    { stage: 'Layout', days: avgDurations.layout },
    { stage: 'Publication', days: avgDurations.publication },
  ];

  const trendData = filteredHistory.map((wf, idx) => ({
    manuscript: `MS-${idx + 1}`,
    total: wf.totalProcessingDays,
    complexity: wf.complexityScore,
  }));

  const bottlenecks = [
    { stage: 'Review', days: avgDurations.review, severity: avgDurations.review > 20 ? 'high' : avgDurations.review > 15 ? 'medium' : 'low' },
    { stage: 'Revision', days: avgDurations.revision, severity: avgDurations.revision > 15 ? 'high' : avgDurations.revision > 10 ? 'medium' : 'low' },
    { stage: 'Re-review', days: avgDurations.reReview, severity: avgDurations.reReview > 12 ? 'high' : avgDurations.reReview > 8 ? 'medium' : 'low' },
  ].sort((a, b) => b.days - a.days);

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {onBack && (
          <button onClick={onBack} className="mb-6 flex items-center gap-2 text-gray-600 hover:text-gray-900">
            <ArrowLeft className="w-5 h-5" />
            Back
          </button>
        )}

        <div className="mb-8">
          <div className="flex items-center gap-3 mb-2">
            <Clock className="w-8 h-8 text-orange-600" />
            <h1 className="text-3xl font-bold text-gray-900">Historical Workflow Records</h1>
          </div>
          <p className="text-gray-600">
            Training and reference data for Timeline Recommender ML model predictions
          </p>
        </div>

        {/* Filter */}
        <div className="bg-white rounded-lg shadow-md p-4 mb-6">
          <div className="flex items-center gap-4">
            <span className="text-sm font-medium text-gray-700">Filter by category:</span>
            <select
              value={filterCategory}
              onChange={(e) => setFilterCategory(e.target.value)}
              className="px-3 py-2 border border-gray-300 rounded-md"
            >
              <option value="all">All Categories</option>
              {categories.map(cat => (
                <option key={cat} value={cat}>{cat}</option>
              ))}
            </select>
            <span className="ml-auto text-sm text-gray-600">{filteredHistory.length} records</span>
          </div>
        </div>

        {/* Average Duration Statistics */}
        <div className="bg-white rounded-lg shadow-md p-6 mb-6">
          <h2 className="text-xl font-semibold text-gray-900 mb-6">Average Stage Durations</h2>
          <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-4">
            <div className="bg-blue-50 rounded-lg p-4 border border-blue-200">
              <div className="text-xs text-gray-600 mb-1">Editorial Assessment</div>
              <div className="text-2xl font-bold text-blue-900">{avgDurations.editorialAssessment}</div>
              <div className="text-xs text-gray-500">days</div>
            </div>
            <div className="bg-purple-50 rounded-lg p-4 border border-purple-200">
              <div className="text-xs text-gray-600 mb-1">Reviewer Invitation</div>
              <div className="text-2xl font-bold text-purple-900">{avgDurations.reviewerInvitation}</div>
              <div className="text-xs text-gray-500">days</div>
            </div>
            <div className="bg-green-50 rounded-lg p-4 border border-green-200">
              <div className="text-xs text-gray-600 mb-1">Review</div>
              <div className="text-2xl font-bold text-green-900">{avgDurations.review}</div>
              <div className="text-xs text-gray-500">days</div>
            </div>
            <div className="bg-yellow-50 rounded-lg p-4 border border-yellow-200">
              <div className="text-xs text-gray-600 mb-1">Revision</div>
              <div className="text-2xl font-bold text-yellow-900">{avgDurations.revision}</div>
              <div className="text-xs text-gray-500">days</div>
            </div>
            <div className="bg-orange-50 rounded-lg p-4 border border-orange-200">
              <div className="text-xs text-gray-600 mb-1">Re-review</div>
              <div className="text-2xl font-bold text-orange-900">{avgDurations.reReview}</div>
              <div className="text-xs text-gray-500">days</div>
            </div>
            <div className="bg-pink-50 rounded-lg p-4 border border-pink-200">
              <div className="text-xs text-gray-600 mb-1">Copyediting</div>
              <div className="text-2xl font-bold text-pink-900">{avgDurations.copyediting}</div>
              <div className="text-xs text-gray-500">days</div>
            </div>
            <div className="bg-indigo-50 rounded-lg p-4 border border-indigo-200">
              <div className="text-xs text-gray-600 mb-1">Layout</div>
              <div className="text-2xl font-bold text-indigo-900">{avgDurations.layout}</div>
              <div className="text-xs text-gray-500">days</div>
            </div>
            <div className="bg-teal-50 rounded-lg p-4 border border-teal-200">
              <div className="text-xs text-gray-600 mb-1">Publication</div>
              <div className="text-2xl font-bold text-teal-900">{avgDurations.publication}</div>
              <div className="text-xs text-gray-500">days</div>
            </div>
            <div className="bg-gradient-to-br from-gray-100 to-gray-200 rounded-lg p-4 border-2 border-gray-400">
              <div className="text-xs text-gray-600 mb-1">Total Processing</div>
              <div className="text-2xl font-bold text-gray-900">{avgDurations.total}</div>
              <div className="text-xs text-gray-500">days</div>
            </div>
          </div>
        </div>

        {/* Charts */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
          <div className="bg-white rounded-lg shadow-md p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Stage Duration Breakdown</h3>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={stageData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="stage" angle={-45} textAnchor="end" height={80} />
                <YAxis label={{ value: 'Days', angle: -90, position: 'insideLeft' }} />
                <Tooltip />
                <Bar dataKey="days" fill="#3b82f6" />
              </BarChart>
            </ResponsiveContainer>
          </div>

          <div className="bg-white rounded-lg shadow-md p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Processing Time Trends</h3>
            <ResponsiveContainer width="100%" height={300}>
              <LineChart data={trendData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="manuscript" />
                <YAxis yAxisId="left" label={{ value: 'Days', angle: -90, position: 'insideLeft' }} />
                <YAxis yAxisId="right" orientation="right" label={{ value: 'Complexity', angle: 90, position: 'insideRight' }} />
                <Tooltip />
                <Legend />
                <Line yAxisId="left" type="monotone" dataKey="total" stroke="#10b981" strokeWidth={2} name="Total Days" />
                <Line yAxisId="right" type="monotone" dataKey="complexity" stroke="#f59e0b" strokeWidth={2} name="Complexity Score" />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Bottleneck Analysis */}
        <div className="bg-white rounded-lg shadow-md p-6 mb-6">
          <div className="flex items-center gap-2 mb-4">
            <AlertTriangle className="w-5 h-5 text-orange-600" />
            <h2 className="text-xl font-semibold text-gray-900">Bottleneck Analysis</h2>
          </div>
          <div className="space-y-3">
            {bottlenecks.map((bottleneck, idx) => (
              <div key={idx} className={`p-4 rounded-lg border ${
                bottleneck.severity === 'high' ? 'bg-red-50 border-red-200' :
                bottleneck.severity === 'medium' ? 'bg-yellow-50 border-yellow-200' :
                'bg-green-50 border-green-200'
              }`}>
                <div className="flex justify-between items-center">
                  <div className="flex items-center gap-3">
                    <span className="text-2xl font-bold text-gray-400">#{idx + 1}</span>
                    <div>
                      <div className="font-semibold text-gray-900">{bottleneck.stage} Stage</div>
                      <div className="text-sm text-gray-600">Average: {bottleneck.days} days</div>
                    </div>
                  </div>
                  <span className={`px-3 py-1 rounded-full text-xs font-medium ${
                    bottleneck.severity === 'high' ? 'bg-red-200 text-red-800' :
                    bottleneck.severity === 'medium' ? 'bg-yellow-200 text-yellow-800' :
                    'bg-green-200 text-green-800'
                  }`}>
                    {bottleneck.severity.toUpperCase()} IMPACT
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Historical Records Table */}
        <div className="bg-white rounded-lg shadow-md p-6 mb-6">
          <h2 className="text-xl font-semibold text-gray-900 mb-4">Complete Historical Records</h2>
          <div className="overflow-x-auto">
            <table className="min-w-full">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Manuscript ID</th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Category</th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Complexity</th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Review Days</th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Revision Days</th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Production Days</th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Total Days</th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Completed</th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {filteredHistory.map((record) => (
                  <tr key={record.id} className="hover:bg-gray-50">
                    <td className="px-4 py-3 text-sm font-medium text-gray-900">{record.manuscriptId}</td>
                    <td className="px-4 py-3 text-sm text-gray-600">{record.category}</td>
                    <td className="px-4 py-3 text-sm">
                      <span className={`px-2 py-1 rounded text-xs ${
                        record.complexityScore >= 70 ? 'bg-red-100 text-red-800' :
                        record.complexityScore >= 50 ? 'bg-yellow-100 text-yellow-800' :
                        'bg-green-100 text-green-800'
                      }`}>
                        {record.complexityScore}
                      </span>
                    </td>
                    <td className="px-4 py-3 text-sm text-gray-600">{record.reviewDays}d</td>
                    <td className="px-4 py-3 text-sm text-gray-600">{record.revisionDays}d</td>
                    <td className="px-4 py-3 text-sm text-gray-600">{record.copyeditingDays + record.layoutDays}d</td>
                    <td className="px-4 py-3 text-sm font-semibold text-gray-900">{record.totalProcessingDays}d</td>
                    <td className="px-4 py-3 text-sm text-gray-600">
                      {new Date(record.completedAt).toLocaleDateString()}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* ML Usage */}
        <div className="bg-purple-50 rounded-lg p-6 border border-purple-200">
          <div className="flex items-center gap-2 mb-3">
            <TrendingUp className="w-5 h-5 text-purple-600" />
            <h3 className="font-semibold text-gray-900">ML Model Usage</h3>
          </div>
          <div className="space-y-2 text-sm text-gray-700">
            <p>→ <strong>Timeline Recommender</strong> uses historical data to predict manuscript processing duration</p>
            <p>→ <strong>Bottleneck detection</strong> identifies stages causing delays for resource optimization</p>
            <p>→ <strong>Complexity correlation</strong> links manuscript complexity to processing time for better forecasting</p>
          </div>
        </div>
      </div>
    </div>
  );
}
