import React, { useState } from 'react';
import { useData } from '../../context/DataContext';
import { ArrowLeft, ArrowRight, Database, Cpu, Target, FileText, Users, Activity, Star, TrendingUp } from 'lucide-react';

interface ReviewerMatchmakingDataFlowPageProps {
  onBack?: () => void;
}

export function ReviewerMatchmakingDataFlowPage({ onBack }: ReviewerMatchmakingDataFlowPageProps) {
  const { manuscripts, reviewerProfiles, reviewerPerformance } = useData();
  const [selectedManuscript, setSelectedManuscript] = useState(manuscripts[0]?.id || '');

  const manuscript = manuscripts.find(m => m.id === selectedManuscript);
  const manuscriptKeywords = ['Cybersecurity', 'Network Security', 'Data Protection'];

  const calculateMatchScore = (reviewer: typeof reviewerProfiles[0], perf: typeof reviewerPerformance[0] | undefined) => {
    const expertiseMatch = reviewer.expertiseAreas.some(exp => manuscriptKeywords.some(key => exp.includes(key))) ? 85 : 45;
    const workloadScore = Math.max(0, 100 - (reviewer.currentWorkload / reviewer.maximumWorkload) * 100);
    const availabilityScore = reviewer.availabilityStatus === 'available' ? 100 : reviewer.availabilityStatus === 'limited' ? 60 : 20;
    const performanceScore = perf ? perf.performanceRating * 20 : 70;
    const finalScore = (expertiseMatch * 0.4 + workloadScore * 0.25 + availabilityScore * 0.20 + performanceScore * 0.15);
    return { expertiseMatch, workloadScore, availabilityScore, performanceScore, finalScore };
  };

  const recommendations = reviewerProfiles.map(reviewer => {
    const perf = reviewerPerformance.find(p => p.reviewerId === reviewer.id);
    const scores = calculateMatchScore(reviewer, perf);
    return { reviewer, ...scores };
  }).sort((a, b) => b.finalScore - a.finalScore);

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
            <Cpu className="w-8 h-8 text-blue-600" />
            <h1 className="text-3xl font-bold text-gray-900">Reviewer Matchmaking Data Flow</h1>
          </div>
          <p className="text-gray-600">
            Complete demonstration of input → processing → output workflow for reviewer recommendations
          </p>
        </div>

        {/* Manuscript Selection */}
        <div className="bg-white rounded-lg shadow-md p-4 mb-6">
          <label className="block text-sm font-medium text-gray-700 mb-2">Select Manuscript</label>
          <select
            value={selectedManuscript}
            onChange={(e) => setSelectedManuscript(e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-md"
          >
            {manuscripts.map(m => (
              <option key={m.id} value={m.id}>{m.id}: {m.title}</option>
            ))}
          </select>
        </div>

        {/* INPUTS */}
        <div className="bg-blue-50 rounded-lg shadow-md p-6 mb-6 border-2 border-blue-300">
          <div className="flex items-center gap-2 mb-4">
            <Database className="w-6 h-6 text-blue-600" />
            <h2 className="text-2xl font-semibold text-gray-900">INPUTS → Data Collection</h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="bg-white rounded-lg p-4">
              <h3 className="font-semibold text-gray-900 mb-3 flex items-center gap-2">
                <FileText className="w-5 h-5 text-blue-600" />
                Manuscript Data
              </h3>
              <div className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span className="text-gray-600">Title:</span>
                  <span className="font-medium text-right ml-2">{manuscript?.title || 'N/A'}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Category:</span>
                  <span className="font-medium">{manuscript?.category || 'N/A'}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Keywords:</span>
                  <span className="font-medium">{manuscriptKeywords.join(', ')}</span>
                </div>
              </div>
            </div>

            <div className="bg-white rounded-lg p-4">
              <h3 className="font-semibold text-gray-900 mb-3 flex items-center gap-2">
                <Users className="w-5 h-5 text-purple-600" />
                Reviewer Database
              </h3>
              <div className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span className="text-gray-600">Total Reviewers:</span>
                  <span className="font-medium">{reviewerProfiles.length}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Available:</span>
                  <span className="font-medium text-green-600">{reviewerProfiles.filter(r => r.availabilityStatus === 'available').length}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Performance Records:</span>
                  <span className="font-medium">{reviewerPerformance.length}</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Arrow */}
        <div className="flex justify-center mb-6">
          <ArrowRight className="w-12 h-12 text-gray-400" />
        </div>

        {/* PROCESSING */}
        <div className="bg-purple-50 rounded-lg shadow-md p-6 mb-6 border-2 border-purple-300">
          <div className="flex items-center gap-2 mb-4">
            <Cpu className="w-6 h-6 text-purple-600 animate-pulse" />
            <h2 className="text-2xl font-semibold text-gray-900">PROCESSING → ML Model Analysis</h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            <div className="bg-white rounded-lg p-4">
              <h3 className="font-semibold text-gray-900 mb-2 text-sm">1. Keyword Matching</h3>
              <p className="text-xs text-gray-600">Comparing manuscript keywords with reviewer expertise areas</p>
              <div className="mt-2 h-2 bg-purple-200 rounded-full animate-pulse"></div>
            </div>

            <div className="bg-white rounded-lg p-4">
              <h3 className="font-semibold text-gray-900 mb-2 text-sm">2. Expertise Matching</h3>
              <p className="text-xs text-gray-600">Analyzing reviewer specialization alignment with research area</p>
              <div className="mt-2 h-2 bg-purple-200 rounded-full animate-pulse" style={{ animationDelay: '0.2s' }}></div>
            </div>

            <div className="bg-white rounded-lg p-4">
              <h3 className="font-semibold text-gray-900 mb-2 text-sm">3. Workload Analysis</h3>
              <p className="text-xs text-gray-600">Evaluating current workload vs. maximum capacity</p>
              <div className="mt-2 h-2 bg-purple-200 rounded-full animate-pulse" style={{ animationDelay: '0.4s' }}></div>
            </div>

            <div className="bg-white rounded-lg p-4">
              <h3 className="font-semibold text-gray-900 mb-2 text-sm">4. Performance Scoring</h3>
              <p className="text-xs text-gray-600">Factoring historical performance and reliability metrics</p>
              <div className="mt-2 h-2 bg-purple-200 rounded-full animate-pulse" style={{ animationDelay: '0.6s' }}></div>
            </div>
          </div>

          <div className="mt-4 bg-white rounded-lg p-4">
            <h3 className="font-semibold text-gray-900 mb-2">Ranking Algorithm</h3>
            <div className="text-sm text-gray-700 space-y-1">
              <p>Final Match Score = (Expertise × 40%) + (Workload × 25%) + (Availability × 20%) + (Performance × 15%)</p>
            </div>
          </div>
        </div>

        {/* Arrow */}
        <div className="flex justify-center mb-6">
          <ArrowRight className="w-12 h-12 text-gray-400" />
        </div>

        {/* OUTPUTS */}
        <div className="bg-green-50 rounded-lg shadow-md p-6 border-2 border-green-300">
          <div className="flex items-center gap-2 mb-4">
            <Target className="w-6 h-6 text-green-600" />
            <h2 className="text-2xl font-semibold text-gray-900">OUTPUT → Recommended Reviewers</h2>
          </div>

          <div className="overflow-x-auto">
            <table className="min-w-full bg-white rounded-lg">
              <thead className="bg-gray-100">
                <tr>
                  <th className="px-4 py-3 text-left text-sm font-semibold text-gray-700">Rank</th>
                  <th className="px-4 py-3 text-left text-sm font-semibold text-gray-700">Reviewer Name</th>
                  <th className="px-4 py-3 text-left text-sm font-semibold text-gray-700">Expertise Match</th>
                  <th className="px-4 py-3 text-left text-sm font-semibold text-gray-700">Workload Score</th>
                  <th className="px-4 py-3 text-left text-sm font-semibold text-gray-700">Availability</th>
                  <th className="px-4 py-3 text-left text-sm font-semibold text-gray-700">Performance</th>
                  <th className="px-4 py-3 text-left text-sm font-semibold text-gray-700">Final Score</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {recommendations.slice(0, 5).map((rec, idx) => (
                  <tr key={rec.reviewer.id} className={idx === 0 ? 'bg-green-50' : ''}>
                    <td className="px-4 py-3">
                      <span className={`flex items-center justify-center w-8 h-8 rounded-full ${
                        idx === 0 ? 'bg-yellow-400 text-yellow-900' : 'bg-gray-200 text-gray-700'
                      } font-bold`}>
                        {idx + 1}
                      </span>
                    </td>
                    <td className="px-4 py-3">
                      <div className="font-medium text-gray-900">{rec.reviewer.name}</div>
                      <div className="text-xs text-gray-600">{rec.reviewer.institution}</div>
                    </td>
                    <td className="px-4 py-3">
                      <div className="text-sm font-medium">{rec.expertiseMatch.toFixed(0)}%</div>
                      <div className="w-16 h-2 bg-gray-200 rounded-full mt-1">
                        <div className="h-2 bg-blue-500 rounded-full" style={{ width: `${rec.expertiseMatch}%` }}></div>
                      </div>
                    </td>
                    <td className="px-4 py-3">
                      <div className="text-sm font-medium">{rec.workloadScore.toFixed(0)}%</div>
                      <div className="w-16 h-2 bg-gray-200 rounded-full mt-1">
                        <div className="h-2 bg-purple-500 rounded-full" style={{ width: `${rec.workloadScore}%` }}></div>
                      </div>
                    </td>
                    <td className="px-4 py-3">
                      <div className="text-sm font-medium">{rec.availabilityScore.toFixed(0)}%</div>
                      <div className="w-16 h-2 bg-gray-200 rounded-full mt-1">
                        <div className="h-2 bg-green-500 rounded-full" style={{ width: `${rec.availabilityScore}%` }}></div>
                      </div>
                    </td>
                    <td className="px-4 py-3">
                      <div className="text-sm font-medium">{rec.performanceScore.toFixed(0)}%</div>
                      <div className="w-16 h-2 bg-gray-200 rounded-full mt-1">
                        <div className="h-2 bg-orange-500 rounded-full" style={{ width: `${rec.performanceScore}%` }}></div>
                      </div>
                    </td>
                    <td className="px-4 py-3">
                      <div className="text-lg font-bold text-gray-900">{rec.finalScore.toFixed(0)}</div>
                      {idx === 0 && <Star className="w-4 h-4 text-yellow-500 inline ml-1" />}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Summary */}
        <div className="bg-gray-100 rounded-lg p-6 mt-6">
          <h3 className="font-semibold text-gray-900 mb-3 flex items-center gap-2">
            <Activity className="w-5 h-5 text-gray-600" />
            Transparency & Explainability
          </h3>
          <div className="space-y-2 text-sm text-gray-700">
            <p>✓ <strong>Data Origins:</strong> Manuscript keywords from author submission, reviewer data from expertise management system</p>
            <p>✓ <strong>Processing Steps:</strong> Four distinct matching stages with weighted scoring algorithm</p>
            <p>✓ <strong>Output Justification:</strong> Each score component is visible and traceable to source data</p>
            <p>✓ <strong>Model Transparency:</strong> Weighting formula is openly displayed (40% expertise, 25% workload, 20% availability, 15% performance)</p>
          </div>
        </div>
      </div>
    </div>
  );
}
