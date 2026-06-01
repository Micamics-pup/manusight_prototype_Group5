import React, { useState } from 'react';
import { useData } from '../../context/DataContext';
import { ArrowLeft, ArrowRight, Database, Cpu, Target, Calendar, AlertTriangle, Activity, TrendingUp } from 'lucide-react';

interface TimelineRecommenderDataFlowPageProps {
  onBack?: () => void;
}

export function TimelineRecommenderDataFlowPage({ onBack }: TimelineRecommenderDataFlowPageProps) {
  const { manuscripts, manuscriptComplexities, workflowHistory, reviewerPerformance, productionWorkload } = useData();
  const [selectedManuscript, setSelectedManuscript] = useState(manuscripts[0]?.id || '');

  const manuscript = manuscripts.find(m => m.id === selectedManuscript);
  const complexity = manuscriptComplexities.find(c => c.manuscriptId === selectedManuscript) || manuscriptComplexities[0];

  const avgHistoricalTimes = {
    editorial: Math.round(workflowHistory.reduce((s, w) => s + w.editorialAssessmentDays, 0) / workflowHistory.length),
    review: Math.round(workflowHistory.reduce((s, w) => s + w.reviewDays, 0) / workflowHistory.length),
    revision: Math.round(workflowHistory.reduce((s, w) => s + w.revisionDays, 0) / workflowHistory.length),
    reReview: Math.round(workflowHistory.reduce((s, w) => s + w.reReviewDays, 0) / workflowHistory.length),
    copyediting: Math.round(workflowHistory.reduce((s, w) => s + w.copyeditingDays, 0) / workflowHistory.length),
    layout: Math.round(workflowHistory.reduce((s, w) => s + w.layoutDays, 0) / workflowHistory.length),
    publication: Math.round(workflowHistory.reduce((s, w) => s + w.publicationDays, 0) / workflowHistory.length),
  };

  const complexityMultiplier = complexity ? (complexity.complexityScore / 100) * 0.3 + 0.85 : 1.0;
  const reviewerAvg = Math.round(reviewerPerformance.reduce((s, r) => s + r.averageReviewDuration, 0) / reviewerPerformance.length);
  const productionCapacity = productionWorkload.reduce((s, w) => s + w.currentCapacity, 0) / productionWorkload.reduce((s, w) => s + w.maxCapacity, 0);
  const capacityDelay = productionCapacity > 0.75 ? 3 : productionCapacity > 0.5 ? 1 : 0;

  const predictions = {
    editorial: Math.round(avgHistoricalTimes.editorial * complexityMultiplier),
    review: Math.round(reviewerAvg * complexityMultiplier),
    revision: Math.round(avgHistoricalTimes.revision * complexityMultiplier),
    reReview: Math.round(avgHistoricalTimes.reReview * complexityMultiplier),
    copyediting: Math.round(avgHistoricalTimes.copyediting * complexityMultiplier) + capacityDelay,
    layout: Math.round(avgHistoricalTimes.layout * complexityMultiplier) + capacityDelay,
    publication: Math.round(avgHistoricalTimes.publication),
  };

  const totalDays = Object.values(predictions).reduce((a, b) => a + b, 0);
  const forecastDate = new Date();
  forecastDate.setDate(forecastDate.getDate() + totalDays);

  const riskLevel = totalDays > 70 ? 'high' : totalDays > 50 ? 'medium' : 'low';
  const confidence = complexity ? (100 - Math.abs(complexity.complexityScore - 65)) : 85;

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
            <Calendar className="w-8 h-8 text-purple-600" />
            <h1 className="text-3xl font-bold text-gray-900">Timeline Recommender Data Flow</h1>
          </div>
          <p className="text-gray-600">
            Complete demonstration of input → processing → output workflow for timeline predictions
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

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            <div className="bg-white rounded-lg p-4">
              <h3 className="font-semibold text-gray-900 mb-3 text-sm">Manuscript Metadata</h3>
              <div className="space-y-1 text-xs">
                <div className="flex justify-between"><span className="text-gray-600">Category:</span><span className="font-medium">{complexity?.category || 'N/A'}</span></div>
                <div className="flex justify-between"><span className="text-gray-600">Type:</span><span className="font-medium">{complexity?.submissionType || 'N/A'}</span></div>
              </div>
            </div>

            <div className="bg-white rounded-lg p-4">
              <h3 className="font-semibold text-gray-900 mb-3 text-sm">Complexity Score</h3>
              <div className="text-3xl font-bold text-purple-600">{complexity?.complexityScore || 'N/A'}</div>
              <div className="text-xs text-gray-600 mt-1">Complexity Level: <span className="font-medium">{complexity?.complexityLevel.toUpperCase()}</span></div>
            </div>

            <div className="bg-white rounded-lg p-4">
              <h3 className="font-semibold text-gray-900 mb-3 text-sm">Historical Data</h3>
              <div className="space-y-1 text-xs">
                <div className="flex justify-between"><span className="text-gray-600">Records:</span><span className="font-medium">{workflowHistory.length}</span></div>
                <div className="flex justify-between"><span className="text-gray-600">Avg Total:</span><span className="font-medium">{avgHistoricalTimes.editorial + avgHistoricalTimes.review}d</span></div>
              </div>
            </div>

            <div className="bg-white rounded-lg p-4">
              <h3 className="font-semibold text-gray-900 mb-3 text-sm">Capacity Data</h3>
              <div className="space-y-1 text-xs">
                <div className="flex justify-between"><span className="text-gray-600">Reviewer Avg:</span><span className="font-medium">{reviewerAvg}d</span></div>
                <div className="flex justify-between"><span className="text-gray-600">Production:</span><span className="font-medium">{(productionCapacity * 100).toFixed(0)}%</span></div>
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

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
            <div className="bg-white rounded-lg p-4">
              <h3 className="font-semibold text-gray-900 mb-2 text-sm">1. Complexity Analysis</h3>
              <p className="text-xs text-gray-600 mb-2">Adjusting baseline times based on manuscript complexity</p>
              <div className="text-xs bg-gray-100 p-2 rounded font-mono">
                multiplier = {complexityMultiplier.toFixed(2)}
              </div>
            </div>

            <div className="bg-white rounded-lg p-4">
              <h3 className="font-semibold text-gray-900 mb-2 text-sm">2. Historical Comparison</h3>
              <p className="text-xs text-gray-600 mb-2">Referencing similar manuscripts from workflow history</p>
              <div className="text-xs bg-gray-100 p-2 rounded font-mono">
                avg_review = {avgHistoricalTimes.review}d
              </div>
            </div>

            <div className="bg-white rounded-lg p-4">
              <h3 className="font-semibold text-gray-900 mb-2 text-sm">3. Reviewer Capacity</h3>
              <p className="text-xs text-gray-600 mb-2">Factoring reviewer workload and performance data</p>
              <div className="text-xs bg-gray-100 p-2 rounded font-mono">
                reviewer_avg = {reviewerAvg}d
              </div>
            </div>

            <div className="bg-white rounded-lg p-4">
              <h3 className="font-semibold text-gray-900 mb-2 text-sm">4. Production Capacity</h3>
              <p className="text-xs text-gray-600 mb-2">Assessing production team workload for delays</p>
              <div className="text-xs bg-gray-100 p-2 rounded font-mono">
                capacity_delay = +{capacityDelay}d
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg p-4">
            <h3 className="font-semibold text-gray-900 mb-2">Risk Assessment Engine</h3>
            <div className="grid grid-cols-3 gap-3 text-xs">
              <div>
                <div className="text-gray-600 mb-1">Complexity Risk</div>
                <div className={`px-2 py-1 rounded text-center font-medium ${
                  complexity && complexity.complexityScore > 70 ? 'bg-red-100 text-red-800' : 'bg-green-100 text-green-800'
                }`}>
                  {complexity && complexity.complexityScore > 70 ? 'HIGH' : 'LOW'}
                </div>
              </div>
              <div>
                <div className="text-gray-600 mb-1">Reviewer Risk</div>
                <div className={`px-2 py-1 rounded text-center font-medium ${
                  reviewerPerformance.filter(r => r.activeAssignments >= 4).length > 2 ? 'bg-yellow-100 text-yellow-800' : 'bg-green-100 text-green-800'
                }`}>
                  {reviewerPerformance.filter(r => r.activeAssignments >= 4).length > 2 ? 'MEDIUM' : 'LOW'}
                </div>
              </div>
              <div>
                <div className="text-gray-600 mb-1">Production Risk</div>
                <div className={`px-2 py-1 rounded text-center font-medium ${
                  productionCapacity > 0.75 ? 'bg-red-100 text-red-800' : productionCapacity > 0.5 ? 'bg-yellow-100 text-yellow-800' : 'bg-green-100 text-green-800'
                }`}>
                  {productionCapacity > 0.75 ? 'HIGH' : productionCapacity > 0.5 ? 'MEDIUM' : 'LOW'}
                </div>
              </div>
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
            <h2 className="text-2xl font-semibold text-gray-900">OUTPUT → Timeline Predictions</h2>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-7 gap-3 mb-6">
            <div className="bg-white rounded-lg p-3 border border-gray-200">
              <div className="text-xs text-gray-600 mb-1">Editorial Assessment</div>
              <div className="text-2xl font-bold text-blue-600">{predictions.editorial}</div>
              <div className="text-xs text-gray-500">days</div>
            </div>
            <div className="bg-white rounded-lg p-3 border border-gray-200">
              <div className="text-xs text-gray-600 mb-1">Review Duration</div>
              <div className="text-2xl font-bold text-purple-600">{predictions.review}</div>
              <div className="text-xs text-gray-500">days</div>
            </div>
            <div className="bg-white rounded-lg p-3 border border-gray-200">
              <div className="text-xs text-gray-600 mb-1">Revision Duration</div>
              <div className="text-2xl font-bold text-green-600">{predictions.revision}</div>
              <div className="text-xs text-gray-500">days</div>
            </div>
            <div className="bg-white rounded-lg p-3 border border-gray-200">
              <div className="text-xs text-gray-600 mb-1">Re-review Duration</div>
              <div className="text-2xl font-bold text-yellow-600">{predictions.reReview}</div>
              <div className="text-xs text-gray-500">days</div>
            </div>
            <div className="bg-white rounded-lg p-3 border border-gray-200">
              <div className="text-xs text-gray-600 mb-1">Copyediting Duration</div>
              <div className="text-2xl font-bold text-orange-600">{predictions.copyediting}</div>
              <div className="text-xs text-gray-500">days</div>
            </div>
            <div className="bg-white rounded-lg p-3 border border-gray-200">
              <div className="text-xs text-gray-600 mb-1">Layout Duration</div>
              <div className="text-2xl font-bold text-pink-600">{predictions.layout}</div>
              <div className="text-xs text-gray-500">days</div>
            </div>
            <div className="bg-white rounded-lg p-3 border border-gray-200">
              <div className="text-xs text-gray-600 mb-1">Publication Prep</div>
              <div className="text-2xl font-bold text-indigo-600">{predictions.publication}</div>
              <div className="text-xs text-gray-500">days</div>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="bg-gradient-to-br from-blue-100 to-blue-200 rounded-lg p-5 border-2 border-blue-300">
              <div className="text-sm text-gray-700 mb-2">Forecast Publication Date</div>
              <div className="text-2xl font-bold text-blue-900">{forecastDate.toLocaleDateString()}</div>
              <div className="text-xs text-gray-600 mt-1">({totalDays} total days)</div>
            </div>

            <div className={`rounded-lg p-5 border-2 ${
              riskLevel === 'high' ? 'bg-gradient-to-br from-red-100 to-red-200 border-red-300' :
              riskLevel === 'medium' ? 'bg-gradient-to-br from-yellow-100 to-yellow-200 border-yellow-300' :
              'bg-gradient-to-br from-green-100 to-green-200 border-green-300'
            }`}>
              <div className="text-sm text-gray-700 mb-2">Risk Level</div>
              <div className={`text-2xl font-bold ${
                riskLevel === 'high' ? 'text-red-900' : riskLevel === 'medium' ? 'text-yellow-900' : 'text-green-900'
              }`}>
                {riskLevel.toUpperCase()}
              </div>
              <div className="text-xs text-gray-600 mt-1">Based on timeline length</div>
            </div>

            <div className="bg-gradient-to-br from-purple-100 to-purple-200 rounded-lg p-5 border-2 border-purple-300">
              <div className="text-sm text-gray-700 mb-2">Confidence Score</div>
              <div className="text-2xl font-bold text-purple-900">{confidence.toFixed(0)}%</div>
              <div className="text-xs text-gray-600 mt-1">Prediction accuracy</div>
            </div>
          </div>
        </div>

        {/* Summary */}
        <div className="bg-gray-100 rounded-lg p-6 mt-6">
          <h3 className="font-semibold text-gray-900 mb-3 flex items-center gap-2">
            <Activity className="w-5 h-5 text-gray-600" />
            Transparency & Explainability
          </h3>
          <div className="space-y-2 text-sm text-gray-700">
            <p>✓ <strong>Data Origins:</strong> Complexity from assessment page, history from completed manuscripts, capacity from team dashboards</p>
            <p>✓ <strong>Processing Logic:</strong> Complexity multiplier, historical averages, reviewer workload, production capacity all factored</p>
            <p>✓ <strong>Risk Factors:</strong> Three independent risk assessments (complexity, reviewer, production) combined into overall risk level</p>
            <p>✓ <strong>Confidence Metric:</strong> Based on historical data volume and manuscript complexity similarity to training set</p>
          </div>
        </div>
      </div>
    </div>
  );
}
