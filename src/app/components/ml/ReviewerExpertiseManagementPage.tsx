import React, { useState } from 'react';
import { useData } from '../../context/DataContext';
import {
  ArrowLeft,
  Users,
  Plus,
  Edit,
  CheckCircle,
  XCircle,
  Clock,
  Award,
  Building,
  Mail,
  Tag,
  TrendingUp,
  Activity,
  AlertCircle,
} from 'lucide-react';
import type { ReviewerProfile, AvailabilityStatus } from '../../types';

interface ReviewerExpertiseManagementPageProps {
  onBack?: () => void;
}

export function ReviewerExpertiseManagementPage({ onBack }: ReviewerExpertiseManagementPageProps) {
  const { reviewerProfiles, reviewerPerformance, addReviewerProfile, updateReviewerProfile } = useData();
  const [showAddForm, setShowAddForm] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterAvailability, setFilterAvailability] = useState<AvailabilityStatus | 'all'>('all');

  const [formData, setFormData] = useState({
    name: '',
    email: '',
    institution: '',
    department: '',
    position: '',
    highestDegree: '',
    expertiseAreas: '',
    researchInterests: '',
    yearsOfExperience: 0,
    averageReviewDays: 14,
    currentWorkload: 0,
    maximumWorkload: 5,
    availabilityStatus: 'available' as AvailabilityStatus,
  });

  const filteredReviewers = reviewerProfiles.filter((reviewer) => {
    const matchesSearch = reviewer.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      reviewer.institution.toLowerCase().includes(searchTerm.toLowerCase()) ||
      reviewer.expertiseAreas.some(exp => exp.toLowerCase().includes(searchTerm.toLowerCase()));
    const matchesAvailability = filterAvailability === 'all' || reviewer.availabilityStatus === filterAvailability;
    return matchesSearch && matchesAvailability;
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (editingId) {
      updateReviewerProfile(editingId, {
        ...formData,
        expertiseAreas: formData.expertiseAreas.split(',').map(s => s.trim()),
        researchInterests: formData.researchInterests.split(',').map(s => s.trim()),
      });
      setEditingId(null);
    } else {
      addReviewerProfile({
        ...formData,
        expertiseAreas: formData.expertiseAreas.split(',').map(s => s.trim()),
        researchInterests: formData.researchInterests.split(',').map(s => s.trim()),
      });
    }
    setShowAddForm(false);
    resetForm();
  };

  const resetForm = () => {
    setFormData({
      name: '',
      email: '',
      institution: '',
      department: '',
      position: '',
      highestDegree: '',
      expertiseAreas: '',
      researchInterests: '',
      yearsOfExperience: 0,
      averageReviewDays: 14,
      currentWorkload: 0,
      maximumWorkload: 5,
      availabilityStatus: 'available',
    });
  };

  const startEdit = (reviewer: ReviewerProfile) => {
    setFormData({
      name: reviewer.name,
      email: reviewer.email,
      institution: reviewer.institution,
      department: reviewer.department,
      position: reviewer.position,
      highestDegree: reviewer.highestDegree,
      expertiseAreas: reviewer.expertiseAreas.join(', '),
      researchInterests: reviewer.researchInterests.join(', '),
      yearsOfExperience: reviewer.yearsOfExperience,
      averageReviewDays: reviewer.averageReviewDays,
      currentWorkload: reviewer.currentWorkload,
      maximumWorkload: reviewer.maximumWorkload,
      availabilityStatus: reviewer.availabilityStatus,
    });
    setEditingId(reviewer.id);
    setShowAddForm(true);
  };

  const getAvailabilityColor = (status: AvailabilityStatus) => {
    switch (status) {
      case 'available':
        return 'text-green-700 bg-green-100';
      case 'limited':
        return 'text-yellow-700 bg-yellow-100';
      case 'unavailable':
        return 'text-red-700 bg-red-100';
    }
  };

  const getPerformance = (reviewerId: string) => {
    return reviewerPerformance.find(p => p.reviewerId === reviewerId);
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
            <Users className="w-8 h-8 text-blue-600" />
            <h1 className="text-3xl font-bold text-gray-900">Reviewer Expertise Management</h1>
          </div>
          <p className="text-gray-600">
            Maintain reviewer information used by the Reviewer Matchmaking ML model
          </p>
        </div>

        {/* Controls */}
        <div className="bg-white rounded-lg shadow-md p-6 mb-6">
          <div className="flex flex-col sm:flex-row gap-4 mb-4">
            <input
              type="text"
              placeholder="Search by name, institution, or expertise..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="flex-1 px-4 py-2 border border-gray-300 rounded-md"
            />
            <select
              value={filterAvailability}
              onChange={(e) => setFilterAvailability(e.target.value as AvailabilityStatus | 'all')}
              className="px-4 py-2 border border-gray-300 rounded-md"
            >
              <option value="all">All Availability</option>
              <option value="available">Available</option>
              <option value="limited">Limited</option>
              <option value="unavailable">Unavailable</option>
            </select>
            <button
              onClick={() => {
                resetForm();
                setEditingId(null);
                setShowAddForm(!showAddForm);
              }}
              className="bg-blue-600 text-white px-6 py-2 rounded-md hover:bg-blue-700 flex items-center gap-2"
            >
              <Plus className="w-5 h-5" />
              Add Reviewer
            </button>
          </div>

          <div className="text-sm text-gray-600">
            Total Reviewers: {filteredReviewers.length} | Available: {filteredReviewers.filter(r => r.availabilityStatus === 'available').length}
          </div>
        </div>

        {/* Add/Edit Form */}
        {showAddForm && (
          <div className="bg-white rounded-lg shadow-md p-6 mb-6 border-2 border-blue-200">
            <h2 className="text-xl font-semibold text-gray-900 mb-4">
              {editingId ? 'Edit Reviewer Profile' : 'Add New Reviewer'}
            </h2>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Name *</label>
                  <input
                    type="text"
                    required
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Email *</label>
                  <input
                    type="email"
                    required
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Institution *</label>
                  <input
                    type="text"
                    required
                    value={formData.institution}
                    onChange={(e) => setFormData({ ...formData, institution: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Department *</label>
                  <input
                    type="text"
                    required
                    value={formData.department}
                    onChange={(e) => setFormData({ ...formData, department: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Position</label>
                  <input
                    type="text"
                    value={formData.position}
                    onChange={(e) => setFormData({ ...formData, position: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Highest Degree</label>
                  <input
                    type="text"
                    value={formData.highestDegree}
                    onChange={(e) => setFormData({ ...formData, highestDegree: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Years of Experience</label>
                  <input
                    type="number"
                    value={formData.yearsOfExperience}
                    onChange={(e) => setFormData({ ...formData, yearsOfExperience: parseInt(e.target.value) || 0 })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Average Review Days</label>
                  <input
                    type="number"
                    value={formData.averageReviewDays}
                    onChange={(e) => setFormData({ ...formData, averageReviewDays: parseInt(e.target.value) || 14 })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Current Workload</label>
                  <input
                    type="number"
                    value={formData.currentWorkload}
                    onChange={(e) => setFormData({ ...formData, currentWorkload: parseInt(e.target.value) || 0 })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Maximum Workload</label>
                  <input
                    type="number"
                    value={formData.maximumWorkload}
                    onChange={(e) => setFormData({ ...formData, maximumWorkload: parseInt(e.target.value) || 5 })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Availability Status</label>
                  <select
                    value={formData.availabilityStatus}
                    onChange={(e) => setFormData({ ...formData, availabilityStatus: e.target.value as AvailabilityStatus })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md"
                  >
                    <option value="available">Available</option>
                    <option value="limited">Limited</option>
                    <option value="unavailable">Unavailable</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Expertise Areas (comma-separated) *
                </label>
                <input
                  type="text"
                  required
                  value={formData.expertiseAreas}
                  onChange={(e) => setFormData({ ...formData, expertiseAreas: e.target.value })}
                  placeholder="e.g., Cybersecurity, Network Security, Data Protection"
                  className="w-full px-3 py-2 border border-gray-300 rounded-md"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Research Interests (comma-separated)
                </label>
                <input
                  type="text"
                  value={formData.researchInterests}
                  onChange={(e) => setFormData({ ...formData, researchInterests: e.target.value })}
                  placeholder="e.g., Cloud Security, IoT Security, Blockchain"
                  className="w-full px-3 py-2 border border-gray-300 rounded-md"
                />
              </div>

              <div className="flex gap-3">
                <button
                  type="submit"
                  className="flex-1 bg-blue-600 text-white py-2 rounded-md hover:bg-blue-700"
                >
                  {editingId ? 'Update Reviewer' : 'Add Reviewer'}
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setShowAddForm(false);
                    setEditingId(null);
                    resetForm();
                  }}
                  className="flex-1 bg-gray-200 text-gray-700 py-2 rounded-md hover:bg-gray-300"
                >
                  Cancel
                </button>
              </div>
            </form>
          </div>
        )}

        {/* Reviewer List */}
        <div className="space-y-4">
          {filteredReviewers.map((reviewer) => {
            const performance = getPerformance(reviewer.id);
            const capacityPercent = (reviewer.currentWorkload / reviewer.maximumWorkload) * 100;

            return (
              <div key={reviewer.id} className="bg-white rounded-lg shadow-md p-6">
                <div className="flex justify-between items-start mb-4">
                  <div>
                    <div className="flex items-center gap-3 mb-2">
                      <h3 className="text-xl font-semibold text-gray-900">{reviewer.name}</h3>
                      <span className={`px-3 py-1 rounded-full text-xs font-medium ${getAvailabilityColor(reviewer.availabilityStatus)}`}>
                        {reviewer.availabilityStatus.toUpperCase()}
                      </span>
                    </div>
                    <div className="flex items-center gap-2 text-sm text-gray-600 mb-1">
                      <Building className="w-4 h-4" />
                      <span>{reviewer.institution} • {reviewer.department}</span>
                    </div>
                    <div className="flex items-center gap-2 text-sm text-gray-600 mb-1">
                      <Mail className="w-4 h-4" />
                      <span>{reviewer.email}</span>
                    </div>
                    {reviewer.position && (
                      <div className="flex items-center gap-2 text-sm text-gray-600">
                        <Award className="w-4 h-4" />
                        <span>{reviewer.position} • {reviewer.highestDegree}</span>
                      </div>
                    )}
                  </div>
                  <button
                    onClick={() => startEdit(reviewer)}
                    className="text-blue-600 hover:text-blue-700 flex items-center gap-1"
                  >
                    <Edit className="w-4 h-4" />
                    Edit
                  </button>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-4">
                  <div className="bg-blue-50 rounded-lg p-3">
                    <div className="text-xs text-gray-600 mb-1">Workload</div>
                    <div className="text-lg font-semibold text-blue-900">
                      {reviewer.currentWorkload} / {reviewer.maximumWorkload}
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-2 mt-2">
                      <div
                        className={`h-2 rounded-full ${capacityPercent >= 80 ? 'bg-red-500' : capacityPercent >= 60 ? 'bg-yellow-500' : 'bg-green-500'}`}
                        style={{ width: `${Math.min(capacityPercent, 100)}%` }}
                      />
                    </div>
                  </div>

                  <div className="bg-purple-50 rounded-lg p-3">
                    <div className="text-xs text-gray-600 mb-1">Avg Review Time</div>
                    <div className="text-lg font-semibold text-purple-900">
                      {reviewer.averageReviewDays} days
                    </div>
                  </div>

                  <div className="bg-green-50 rounded-lg p-3">
                    <div className="text-xs text-gray-600 mb-1">Experience</div>
                    <div className="text-lg font-semibold text-green-900">
                      {reviewer.yearsOfExperience} years
                    </div>
                  </div>

                  {performance && (
                    <div className="bg-amber-50 rounded-lg p-3">
                      <div className="text-xs text-gray-600 mb-1">Performance Rating</div>
                      <div className="text-lg font-semibold text-amber-900">
                        {performance.performanceRating.toFixed(1)} / 5.0
                      </div>
                    </div>
                  )}
                </div>

                <div className="mb-3">
                  <div className="text-sm font-medium text-gray-700 mb-2 flex items-center gap-2">
                    <Tag className="w-4 h-4" />
                    Expertise Areas:
                  </div>
                  <div className="flex flex-wrap gap-2">
                    {reviewer.expertiseAreas.map((area, idx) => (
                      <span key={idx} className="px-3 py-1 bg-blue-100 text-blue-800 rounded-full text-xs">
                        {area}
                      </span>
                    ))}
                  </div>
                </div>

                {reviewer.researchInterests.length > 0 && (
                  <div>
                    <div className="text-sm font-medium text-gray-700 mb-2 flex items-center gap-2">
                      <TrendingUp className="w-4 h-4" />
                      Research Interests:
                    </div>
                    <div className="flex flex-wrap gap-2">
                      {reviewer.researchInterests.map((interest, idx) => (
                        <span key={idx} className="px-3 py-1 bg-purple-100 text-purple-800 rounded-full text-xs">
                          {interest}
                        </span>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            );
          })}
        </div>

        {/* Usage Information */}
        <div className="bg-blue-50 rounded-lg p-6 mt-6 border border-blue-200">
          <div className="flex items-center gap-2 mb-3">
            <AlertCircle className="w-5 h-5 text-blue-600" />
            <h3 className="font-semibold text-gray-900">ML Model Usage</h3>
          </div>
          <div className="space-y-2 text-sm text-gray-700">
            <p>
              → <strong>Reviewer Matchmaking Model</strong> uses expertise areas to match manuscripts with qualified reviewers
            </p>
            <p>
              → <strong>Workload balancing</strong> considers current workload and availability status for fair assignment
            </p>
            <p>
              → <strong>Timeline predictions</strong> use average review days to estimate manuscript processing time
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
