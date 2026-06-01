import React, { useState } from 'react';
import { useData } from '../../context/DataContext';
import {
  ArrowLeft,
  FileText,
  BarChart3,
  Activity,
  AlertTriangle,
  CheckCircle,
  TrendingUp,
  Layers,
  Users,
  BookOpen,
  Hash,
  Image,
  Table,
  Target,
  Brain,
  Sparkles,
} from 'lucide-react';
import { RadarChart, Radar, PolarGrid, PolarAngleAxis, PolarRadiusAxis, ResponsiveContainer } from 'recharts';
import type { MethodologyType } from '../../types';

interface ComplexityInputs {
  category: string;
  submissionType: string;
  researchArea: string;
  subfield: string;
  pageCount: number;
  wordCount: number;
  authorCount: number;
  chapterCount: number;
  referenceCount: number;
  figureCount: number;
  tableCount: number;
  methodologyType: MethodologyType;
}

interface ComplexityAssessmentPageProps {
  onBack?: () => void;
}

export function ManuscriptComplexityAssessmentPage({ onBack }: ComplexityAssessmentPageProps) {
  const { addManuscriptComplexity, manuscripts } = useData();
  const [selectedManuscript, setSelectedManuscript] = useState('');
  const [inputs, setInputs] = useState<ComplexityInputs>({
    category: 'Computer Science',
    submissionType: 'Research Article',
    researchArea: 'Cybersecurity',
    subfield: 'Network Security',
    pageCount: 20,
    wordCount: 7000,
    authorCount: 2,
    chapterCount: 5,
    referenceCount: 35,
    figureCount: 6,
    tableCount: 3,
    methodologyType: 'empirical',
  });
  const [showResults, setShowResults] = useState(false);
  const [calculating, setCalculating] = useState(false);

  const calculateComplexity = () => {
    setCalculating(true);
    setTimeout(() => {
      setShowResults(true);
      setCalculating(false);
    }, 1500);
  };

  const complexityScore = Math.round(
    (inputs.pageCount * 0.8) +
    (inputs.wordCount / 100) +
    (inputs.chapterCount * 2) +
    (inputs.referenceCount * 0.5) +
    (inputs.figureCount * 1.5) +
    (inputs.tableCount * 1.5) +
    (inputs.authorCount * 2) +
    (inputs.methodologyType === 'empirical' ? 10 : inputs.methodologyType === 'mixed' ? 8 : 5)
  );

  const complexityLevel = complexityScore >= 70 ? 'high' : complexityScore >= 50 ? 'medium' : 'low';
  const reviewDifficulty = Math.min(100, complexityScore + Math.random() * 10);
  const productionDifficulty = Math.min(100, complexityScore - Math.random() * 5);

  const radarData = [
    { metric: 'Length', value: Math.min(100, (inputs.pageCount / 30) * 100) },
    { metric: 'Structure', value: Math.min(100, (inputs.chapterCount / 10) * 100) },
    { metric: 'References', value: Math.min(100, (inputs.referenceCount / 50) * 100) },
    { metric: 'Visuals', value: Math.min(100, ((inputs.figureCount + inputs.tableCount) / 15) * 100) },
    { metric: 'Collaboration', value: Math.min(100, (inputs.authorCount / 5) * 100) },
    { metric: 'Methodology', value: inputs.methodologyType === 'empirical' ? 80 : inputs.methodologyType === 'mixed' ? 90 : 60 },
  ];

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
            <Brain className="w-8 h-8 text-purple-600" />
            <h1 className="text-3xl font-bold text-gray-900">Manuscript Complexity Assessment</h1>
          </div>
          <p className="text-gray-600">
            Generate manuscript complexity information used by the Timeline Recommender ML model
          </p>
        </div>

        {/* Data Collection Section */}
        <div className="bg-white rounded-lg shadow-md p-6 mb-6">
          <div className="flex items-center gap-2 mb-6">
            <FileText className="w-5 h-5 text-blue-600" />
            <h2 className="text-xl font-semibold text-gray-900">DATA COLLECTION → Manuscript Inputs</h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mb-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Manuscript Category
              </label>
              <select
                value={inputs.category}
                onChange={(e) => setInputs({ ...inputs, category: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 rounded-md"
              >
                <option>Computer Science</option>
                <option>Data Science</option>
                <option>Information Systems</option>
                <option>Software Engineering</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Submission Type
              </label>
              <select
                value={inputs.submissionType}
                onChange={(e) => setInputs({ ...inputs, submissionType: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 rounded-md"
              >
                <option>Research Article</option>
                <option>Review Article</option>
                <option>Case Study</option>
                <option>Technical Report</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Research Area
              </label>
              <input
                type="text"
                value={inputs.researchArea}
                onChange={(e) => setInputs({ ...inputs, researchArea: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 rounded-md"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                <BookOpen className="w-4 h-4 inline mr-1" />
                Page Count
              </label>
              <input
                type="number"
                value={inputs.pageCount}
                onChange={(e) => setInputs({ ...inputs, pageCount: parseInt(e.target.value) || 0 })}
                className="w-full px-3 py-2 border border-gray-300 rounded-md"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                <Hash className="w-4 h-4 inline mr-1" />
                Word Count
              </label>
              <input
                type="number"
                value={inputs.wordCount}
                onChange={(e) => setInputs({ ...inputs, wordCount: parseInt(e.target.value) || 0 })}
                className="w-full px-3 py-2 border border-gray-300 rounded-md"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                <Users className="w-4 h-4 inline mr-1" />
                Number of Authors
              </label>
              <input
                type="number"
                value={inputs.authorCount}
                onChange={(e) => setInputs({ ...inputs, authorCount: parseInt(e.target.value) || 0 })}
                className="w-full px-3 py-2 border border-gray-300 rounded-md"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                <Layers className="w-4 h-4 inline mr-1" />
                Number of Chapters
              </label>
              <input
                type="number"
                value={inputs.chapterCount}
                onChange={(e) => setInputs({ ...inputs, chapterCount: parseInt(e.target.value) || 0 })}
                className="w-full px-3 py-2 border border-gray-300 rounded-md"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                <FileText className="w-4 h-4 inline mr-1" />
                Number of References
              </label>
              <input
                type="number"
                value={inputs.referenceCount}
                onChange={(e) => setInputs({ ...inputs, referenceCount: parseInt(e.target.value) || 0 })}
                className="w-full px-3 py-2 border border-gray-300 rounded-md"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                <Image className="w-4 h-4 inline mr-1" />
                Number of Figures
              </label>
              <input
                type="number"
                value={inputs.figureCount}
                onChange={(e) => setInputs({ ...inputs, figureCount: parseInt(e.target.value) || 0 })}
                className="w-full px-3 py-2 border border-gray-300 rounded-md"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                <Table className="w-4 h-4 inline mr-1" />
                Number of Tables
              </label>
              <input
                type="number"
                value={inputs.tableCount}
                onChange={(e) => setInputs({ ...inputs, tableCount: parseInt(e.target.value) || 0 })}
                className="w-full px-3 py-2 border border-gray-300 rounded-md"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Methodology Type
              </label>
              <select
                value={inputs.methodologyType}
                onChange={(e) => setInputs({ ...inputs, methodologyType: e.target.value as MethodologyType })}
                className="w-full px-3 py-2 border border-gray-300 rounded-md"
              >
                <option value="qualitative">Qualitative</option>
                <option value="quantitative">Quantitative</option>
                <option value="mixed">Mixed Methods</option>
                <option value="theoretical">Theoretical</option>
                <option value="empirical">Empirical</option>
              </select>
            </div>
          </div>

          <button
            onClick={calculateComplexity}
            disabled={calculating}
            className="w-full bg-purple-600 text-white py-3 rounded-md hover:bg-purple-700 disabled:bg-gray-400 flex items-center justify-center gap-2"
          >
            {calculating ? (
              <>
                <Activity className="w-5 h-5 animate-spin" />
                Processing Data...
              </>
            ) : (
              <>
                <Sparkles className="w-5 h-5" />
                Calculate Complexity
              </>
            )}
          </button>
        </div>

        {/* Processing Visualization */}
        {calculating && (
          <div className="bg-gradient-to-r from-purple-50 to-blue-50 rounded-lg shadow-md p-6 mb-6 border-2 border-purple-200">
            <div className="flex items-center gap-2 mb-4">
              <Activity className="w-5 h-5 text-purple-600 animate-spin" />
              <h2 className="text-xl font-semibold text-gray-900">DATA PROCESSING → Complexity Analysis Engine</h2>
            </div>
            <div className="space-y-3">
              <div className="flex items-center gap-3">
                <div className="w-2 h-2 bg-purple-600 rounded-full animate-pulse"></div>
                <span className="text-gray-700">Analyzing manuscript metadata...</span>
              </div>
              <div className="flex items-center gap-3">
                <div className="w-2 h-2 bg-purple-600 rounded-full animate-pulse"></div>
                <span className="text-gray-700">Evaluating structural complexity...</span>
              </div>
              <div className="flex items-center gap-3">
                <div className="w-2 h-2 bg-purple-600 rounded-full animate-pulse"></div>
                <span className="text-gray-700">Computing difficulty scores...</span>
              </div>
            </div>
          </div>
        )}

        {/* Results Section */}
        {showResults && !calculating && (
          <>
            <div className="bg-white rounded-lg shadow-md p-6 mb-6">
              <div className="flex items-center gap-2 mb-6">
                <Target className="w-5 h-5 text-green-600" />
                <h2 className="text-xl font-semibold text-gray-900">OUTPUT → Complexity Assessment Results</h2>
              </div>

              {/* Score Cards */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
                <div className="bg-gradient-to-br from-purple-50 to-purple-100 rounded-lg p-6 border border-purple-200">
                  <div className="flex items-center gap-2 mb-2">
                    <BarChart3 className="w-5 h-5 text-purple-600" />
                    <h3 className="text-sm font-medium text-gray-600">Complexity Score</h3>
                  </div>
                  <div className="text-4xl font-bold text-purple-900 mb-2">{complexityScore}</div>
                  <div className="text-sm text-gray-600">out of 100</div>
                </div>

                <div className={`rounded-lg p-6 border ${
                  complexityLevel === 'high' ? 'bg-gradient-to-br from-red-50 to-red-100 border-red-200' :
                  complexityLevel === 'medium' ? 'bg-gradient-to-br from-yellow-50 to-yellow-100 border-yellow-200' :
                  'bg-gradient-to-br from-green-50 to-green-100 border-green-200'
                }`}>
                  <div className="flex items-center gap-2 mb-2">
                    {complexityLevel === 'high' ? <AlertTriangle className="w-5 h-5 text-red-600" /> :
                     complexityLevel === 'medium' ? <TrendingUp className="w-5 h-5 text-yellow-600" /> :
                     <CheckCircle className="w-5 h-5 text-green-600" />}
                    <h3 className="text-sm font-medium text-gray-600">Complexity Level</h3>
                  </div>
                  <div className={`text-4xl font-bold mb-2 ${
                    complexityLevel === 'high' ? 'text-red-900' :
                    complexityLevel === 'medium' ? 'text-yellow-900' :
                    'text-green-900'
                  }`}>
                    {complexityLevel.toUpperCase()}
                  </div>
                  <div className="text-sm text-gray-600">Classification</div>
                </div>

                <div className="bg-gradient-to-br from-blue-50 to-blue-100 rounded-lg p-6 border border-blue-200">
                  <div className="flex items-center gap-2 mb-2">
                    <Activity className="w-5 h-5 text-blue-600" />
                    <h3 className="text-sm font-medium text-gray-600">Review Difficulty</h3>
                  </div>
                  <div className="text-4xl font-bold text-blue-900 mb-2">{reviewDifficulty.toFixed(0)}</div>
                  <div className="text-sm text-gray-600">Estimated difficulty</div>
                </div>
              </div>

              {/* Radar Chart */}
              <div className="bg-gray-50 rounded-lg p-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Complexity Breakdown</h3>
                <ResponsiveContainer width="100%" height={300}>
                  <RadarChart data={radarData}>
                    <PolarGrid />
                    <PolarAngleAxis dataKey="metric" />
                    <PolarRadiusAxis angle={90} domain={[0, 100]} />
                    <Radar
                      name="Complexity"
                      dataKey="value"
                      stroke="#9333ea"
                      fill="#9333ea"
                      fillOpacity={0.6}
                    />
                  </RadarChart>
                </ResponsiveContainer>
              </div>

              {/* Detailed Breakdown */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-6">
                <div className="bg-gray-50 rounded-lg p-4">
                  <h4 className="font-semibold text-gray-900 mb-3">Review Difficulty Factors</h4>
                  <div className="space-y-2">
                    <div className="flex justify-between text-sm">
                      <span className="text-gray-600">Technical Depth:</span>
                      <span className="font-medium">{(reviewDifficulty * 0.4).toFixed(0)}%</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span className="text-gray-600">Content Volume:</span>
                      <span className="font-medium">{(reviewDifficulty * 0.35).toFixed(0)}%</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span className="text-gray-600">Methodology Complexity:</span>
                      <span className="font-medium">{(reviewDifficulty * 0.25).toFixed(0)}%</span>
                    </div>
                  </div>
                </div>

                <div className="bg-gray-50 rounded-lg p-4">
                  <h4 className="font-semibold text-gray-900 mb-3">Production Difficulty Factors</h4>
                  <div className="space-y-2">
                    <div className="flex justify-between text-sm">
                      <span className="text-gray-600">Visual Elements:</span>
                      <span className="font-medium">{(productionDifficulty * 0.4).toFixed(0)}%</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span className="text-gray-600">Formatting Needs:</span>
                      <span className="font-medium">{(productionDifficulty * 0.35).toFixed(0)}%</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span className="text-gray-600">Structure Complexity:</span>
                      <span className="font-medium">{(productionDifficulty * 0.25).toFixed(0)}%</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Usage Information */}
            <div className="bg-blue-50 rounded-lg p-6 border border-blue-200">
              <div className="flex items-center gap-2 mb-3">
                <Target className="w-5 h-5 text-blue-600" />
                <h3 className="font-semibold text-gray-900">How This Data Is Used</h3>
              </div>
              <div className="space-y-2 text-sm text-gray-700">
                <p>
                  → <strong>Timeline Recommender ML Model</strong> uses complexity scores to predict processing duration
                </p>
                <p>
                  → <strong>Reviewer Matchmaking</strong> considers complexity when assigning appropriate expertise levels
                </p>
                <p>
                  → <strong>Resource Allocation</strong> uses difficulty scores to balance workload across teams
                </p>
              </div>
            </div>
          </>
        )}
      </div>
    </div>
  );
}
