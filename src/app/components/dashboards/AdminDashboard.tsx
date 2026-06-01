import React, { useState } from 'react';
import { useData } from '../../context/DataContext';
import { Users, FileText, BarChart3, Settings, UserCheck, UserX, UserPlus, Mail, Lock, User as UserIcon, AlertCircle, List, Brain, Activity, TrendingUp, Database } from 'lucide-react';
import * as Tabs from '@radix-ui/react-tabs';
import * as Dialog from '@radix-ui/react-dialog';
import type { User, UserRole, Manuscript } from '../../types';
import { ManuscriptListPage } from '../ManuscriptListPage';
import { ManuscriptComplexityAssessmentPage } from '../ml/ManuscriptComplexityAssessmentPage';
import { ReviewerExpertiseManagementPage } from '../ml/ReviewerExpertiseManagementPage';
import { ReviewerPerformanceDashboard } from '../ml/ReviewerPerformanceDashboard';
import { HistoricalWorkflowRecordsPage } from '../ml/HistoricalWorkflowRecordsPage';
import { ProductionCapacityDashboard } from '../ml/ProductionCapacityDashboard';
import { ReviewerMatchmakingDataFlowPage } from '../ml/ReviewerMatchmakingDataFlowPage';
import { TimelineRecommenderDataFlowPage } from '../ml/TimelineRecommenderDataFlowPage';

export function AdminDashboard() {
  const { manuscripts, users, reviews, designFiles, updateUser, addUser } = useData();
  const [selectedUser, setSelectedUser] = useState<User | null>(null);
  const [editRole, setEditRole] = useState<UserRole>('author');
  const [showAddUserDialog, setShowAddUserDialog] = useState(false);
  const [showListView, setShowListView] = useState(false);
  const [viewManuscript, setViewManuscript] = useState<Manuscript | null>(null);
  const [mlView, setMlView] = useState<string | null>(null);
  const [newUserData, setNewUserData] = useState({
    name: '',
    email: '',
    password: '',
    role: 'reviewer' as UserRole,
  });
  const [addUserError, setAddUserError] = useState('');

  const handleUpdateUser = (userId: string, updates: Partial<User>) => {
    updateUser(userId, updates);
    setSelectedUser(null);
  };

  const handleAddUser = () => {
    setAddUserError('');

    if (!newUserData.name || !newUserData.email || !newUserData.password) {
      setAddUserError('Please fill in all fields');
      return;
    }

    if (!newUserData.email.includes('@')) {
      setAddUserError('Please enter a valid email address');
      return;
    }

    if (newUserData.password.length < 6) {
      setAddUserError('Password must be at least 6 characters');
      return;
    }

    // Check if user already exists
    const existingUser = users.find((u) => u.email === newUserData.email);
    if (existingUser) {
      setAddUserError('A user with this email already exists');
      return;
    }

    addUser({
      name: newUserData.name,
      email: newUserData.email,
      role: newUserData.role,
      active: true,
    });

    setNewUserData({ name: '', email: '', password: '', role: 'reviewer' });
    setShowAddUserDialog(false);
  };

  const getManuscriptsByStatus = () => {
    const statusCounts: Record<string, number> = {};
    manuscripts.forEach((ms) => {
      statusCounts[ms.status] = (statusCounts[ms.status] || 0) + 1;
    });
    return statusCounts;
  };

  const statusCounts = getManuscriptsByStatus();

  const roleLabels: Record<UserRole, string> = {
    author: 'Author',
    editor: 'Editor',
    reviewer: 'Reviewer',
    layout_artist: 'Layout Artist',
    admin: 'Administrator',
    editor_in_chief: 'Editor-in-Chief',
    twg_coordinator: 'TWG Coordinator',
    twg_copyeditor: 'TWG Copyeditor',
    twg_layout: 'TWG Layout',
    twg_production_coordinator: 'TWG Production Coordinator',
    twg_print_coordinator: 'TWG Print Coordinator',
    twg_distribution: 'TWG Distribution',
  };

  if (showListView) {
    return (
      <ManuscriptListPage
        onViewDetails={(manuscript) => {
          setViewManuscript(manuscript);
          setShowListView(false);
        }}
        onBack={() => setShowListView(false)}
      />
    );
  }

  if (mlView === 'complexity') {
    return <ManuscriptComplexityAssessmentPage onBack={() => setMlView(null)} />;
  }
  if (mlView === 'reviewer-expertise') {
    return <ReviewerExpertiseManagementPage onBack={() => setMlView(null)} />;
  }
  if (mlView === 'reviewer-performance') {
    return <ReviewerPerformanceDashboard onBack={() => setMlView(null)} />;
  }
  if (mlView === 'workflow-history') {
    return <HistoricalWorkflowRecordsPage onBack={() => setMlView(null)} />;
  }
  if (mlView === 'production-capacity') {
    return <ProductionCapacityDashboard onBack={() => setMlView(null)} />;
  }
  if (mlView === 'matchmaking-flow') {
    return <ReviewerMatchmakingDataFlowPage onBack={() => setMlView(null)} />;
  }
  if (mlView === 'timeline-flow') {
    return <TimelineRecommenderDataFlowPage onBack={() => setMlView(null)} />;
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-semibold text-gray-900">Admin Dashboard</h2>
          <p className="text-gray-600 mt-1">Manage users and system settings</p>
        </div>
        <button
          onClick={() => setShowListView(true)}
          className="flex items-center gap-2 px-4 py-2 bg-white border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
        >
          <List className="w-4 h-4" />
          View All Manuscripts
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="bg-white p-6 rounded-lg border border-gray-200">
          <div className="flex items-center gap-3 mb-2">
            <Users className="w-5 h-5 text-blue-600" />
            <p className="text-sm text-gray-600">Total Users</p>
          </div>
          <p className="text-3xl font-semibold text-gray-900">{users.length}</p>
        </div>
        <div className="bg-white p-6 rounded-lg border border-gray-200">
          <div className="flex items-center gap-3 mb-2">
            <FileText className="w-5 h-5 text-purple-600" />
            <p className="text-sm text-gray-600">Total Manuscripts</p>
          </div>
          <p className="text-3xl font-semibold text-gray-900">{manuscripts.length}</p>
        </div>
        <div className="bg-white p-6 rounded-lg border border-gray-200">
          <div className="flex items-center gap-3 mb-2">
            <BarChart3 className="w-5 h-5 text-green-600" />
            <p className="text-sm text-gray-600">Reviews Completed</p>
          </div>
          <p className="text-3xl font-semibold text-gray-900">
            {reviews.filter((r) => r.status === 'completed').length}
          </p>
        </div>
        <div className="bg-white p-6 rounded-lg border border-gray-200">
          <div className="flex items-center gap-3 mb-2">
            <Settings className="w-5 h-5 text-orange-600" />
            <p className="text-sm text-gray-600">Active Users</p>
          </div>
          <p className="text-3xl font-semibold text-gray-900">
            {users.filter((u) => u.active).length}
          </p>
        </div>
      </div>

      <Tabs.Root defaultValue="users" className="bg-white rounded-lg border border-gray-200">
        <Tabs.List className="flex border-b border-gray-200">
          <Tabs.Trigger
            value="users"
            className="px-6 py-3 text-sm font-medium text-gray-600 hover:text-gray-900 data-[state=active]:text-blue-600 data-[state=active]:border-b-2 data-[state=active]:border-blue-600"
          >
            User Management
          </Tabs.Trigger>
          <Tabs.Trigger
            value="stats"
            className="px-6 py-3 text-sm font-medium text-gray-600 hover:text-gray-900 data-[state=active]:text-blue-600 data-[state=active]:border-b-2 data-[state=active]:border-blue-600"
          >
            System Statistics
          </Tabs.Trigger>
          <Tabs.Trigger
            value="settings"
            className="px-6 py-3 text-sm font-medium text-gray-600 hover:text-gray-900 data-[state=active]:text-blue-600 data-[state=active]:border-b-2 data-[state=active]:border-blue-600"
          >
            Settings
          </Tabs.Trigger>
          <Tabs.Trigger
            value="ml-data"
            className="px-6 py-3 text-sm font-medium text-gray-600 hover:text-gray-900 data-[state=active]:text-purple-600 data-[state=active]:border-b-2 data-[state=active]:border-purple-600"
          >
            ML Data Modules
          </Tabs.Trigger>
        </Tabs.List>

        <Tabs.Content value="users" className="p-6">
          <div className="space-y-4">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold text-gray-900">All Users</h3>
              <button
                onClick={() => setShowAddUserDialog(true)}
                className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
              >
                <UserPlus className="w-4 h-4" />
                Add New User
              </button>
            </div>
            <div className="divide-y divide-gray-200">
              {users.map((user) => (
                <div key={user.id} className="py-4 flex items-center justify-between">
                  <div className="flex-1">
                    <div className="flex items-center gap-3">
                      <h4 className="font-medium text-gray-900">{user.name}</h4>
                      <span className="px-2 py-0.5 text-xs bg-blue-100 text-blue-800 rounded">
                        {roleLabels[user.role]}
                      </span>
                      {user.active ? (
                        <span className="flex items-center gap-1 text-xs text-green-600">
                          <UserCheck className="w-3 h-3" />
                          Active
                        </span>
                      ) : (
                        <span className="flex items-center gap-1 text-xs text-red-600">
                          <UserX className="w-3 h-3" />
                          Inactive
                        </span>
                      )}
                    </div>
                    <p className="text-sm text-gray-600 mt-1">{user.email}</p>
                  </div>
                  <div className="flex gap-2">
                    <button
                      onClick={() => {
                        setSelectedUser(user);
                        setEditRole(user.role);
                      }}
                      className="px-3 py-1.5 text-sm bg-blue-100 text-blue-700 rounded hover:bg-blue-200"
                    >
                      Edit
                    </button>
                    <button
                      onClick={() => handleUpdateUser(user.id, { active: !user.active })}
                      className={`px-3 py-1.5 text-sm rounded ${
                        user.active
                          ? 'bg-red-100 text-red-700 hover:bg-red-200'
                          : 'bg-green-100 text-green-700 hover:bg-green-200'
                      }`}
                    >
                      {user.active ? 'Deactivate' : 'Activate'}
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </Tabs.Content>

        <Tabs.Content value="stats" className="p-6">
          <div className="space-y-6">
            <div>
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Manuscript Statistics</h3>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                {Object.entries(statusCounts).map(([status, count]) => (
                  <div key={status} className="p-4 bg-gray-50 rounded-lg border border-gray-200">
                    <p className="text-sm text-gray-600 capitalize">
                      {status.replace(/_/g, ' ')}
                    </p>
                    <p className="text-2xl font-semibold text-gray-900 mt-1">{count}</p>
                  </div>
                ))}
              </div>
            </div>

            <div>
              <h3 className="text-lg font-semibold text-gray-900 mb-4">User Distribution</h3>
              <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                {(['author', 'editor', 'editor_in_chief', 'reviewer', 'layout_artist', 'twg_coordinator', 'twg_copyeditor', 'admin'] as UserRole[]).map(
                  (role) => {
                    const count = users.filter((u) => u.role === role).length;
                    return (
                      <div key={role} className="p-4 bg-gray-50 rounded-lg border border-gray-200">
                        <p className="text-sm text-gray-600">{roleLabels[role]}</p>
                        <p className="text-2xl font-semibold text-gray-900 mt-1">{count}</p>
                      </div>
                    );
                  }
                )}
              </div>
            </div>

            <div>
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Design Progress</h3>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <div className="p-4 bg-gray-50 rounded-lg border border-gray-200">
                  <p className="text-sm text-gray-600">Pending</p>
                  <p className="text-2xl font-semibold text-gray-900 mt-1">
                    {designFiles.filter((df) => df.status === 'pending').length}
                  </p>
                </div>
                <div className="p-4 bg-gray-50 rounded-lg border border-gray-200">
                  <p className="text-sm text-gray-600">In Progress</p>
                  <p className="text-2xl font-semibold text-gray-900 mt-1">
                    {designFiles.filter((df) => df.status === 'in_progress').length}
                  </p>
                </div>
                <div className="p-4 bg-gray-50 rounded-lg border border-gray-200">
                  <p className="text-sm text-gray-600">Submitted</p>
                  <p className="text-2xl font-semibold text-gray-900 mt-1">
                    {designFiles.filter((df) => df.status === 'submitted').length}
                  </p>
                </div>
                <div className="p-4 bg-gray-50 rounded-lg border border-gray-200">
                  <p className="text-sm text-gray-600">Approved</p>
                  <p className="text-2xl font-semibold text-gray-900 mt-1">
                    {designFiles.filter((df) => df.status === 'approved').length}
                  </p>
                </div>
              </div>
            </div>
          </div>
        </Tabs.Content>

        <Tabs.Content value="settings" className="p-6">
          <div className="space-y-6">
            <h3 className="text-lg font-semibold text-gray-900">System Settings</h3>
            <div className="p-4 bg-blue-50 border border-blue-200 rounded-lg">
              <p className="text-sm text-blue-900">
                System configuration, submission guidelines, and other administrative settings would
                be managed here. With Supabase integration, these could be stored and updated
                dynamically.
              </p>
            </div>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Default Review Deadline (days)
                </label>
                <input
                  type="number"
                  defaultValue={14}
                  className="w-full max-w-xs px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Manuscript Categories
                </label>
                <textarea
                  defaultValue="Environmental Science, Computer Science, Neuroscience, Architecture"
                  rows={3}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
              <button className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700">
                Save Settings
              </button>
            </div>
          </div>
        </Tabs.Content>

        <Tabs.Content value="ml-data" className="p-6">
          <div className="space-y-6">
            <div>
              <h3 className="text-2xl font-semibold text-gray-900 mb-2">Machine Learning Data Collection Modules</h3>
              <p className="text-gray-600">
                Access data collection and monitoring pages that demonstrate ML model transparency.
                These modules show the complete data pipeline: Collection → Storage → Processing → Output
              </p>
            </div>

            <div className="bg-purple-50 border-2 border-purple-200 rounded-lg p-4 mb-6">
              <div className="flex items-center gap-2 mb-2">
                <Brain className="w-5 h-5 text-purple-600" />
                <h4 className="font-semibold text-purple-900">ML Model Transparency</h4>
              </div>
              <p className="text-sm text-purple-800">
                All modules demonstrate where data originates, how it's processed, and what outputs are generated.
                The Reviewer Matchmaking and Timeline Recommender models are fully explainable with visible inputs and processing steps.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
              <div className="bg-white border border-gray-200 rounded-lg p-5 hover:shadow-md transition-shadow">
                <div className="flex items-center gap-3 mb-3">
                  <Brain className="w-6 h-6 text-purple-600" />
                  <h4 className="font-semibold text-gray-900">Manuscript Complexity Assessment</h4>
                </div>
                <p className="text-sm text-gray-600 mb-4">
                  Generate complexity scores used by Timeline Recommender. Shows calculation inputs, processing visualization, and outputs.
                </p>
                <button
                  onClick={() => setMlView('complexity')}
                  className="w-full bg-purple-600 text-white py-2 rounded-md hover:bg-purple-700 transition-colors"
                >
                  Open Module
                </button>
              </div>

              <div className="bg-white border border-gray-200 rounded-lg p-5 hover:shadow-md transition-shadow">
                <div className="flex items-center gap-3 mb-3">
                  <Users className="w-6 h-6 text-blue-600" />
                  <h4 className="font-semibold text-gray-900">Reviewer Expertise Management</h4>
                </div>
                <p className="text-sm text-gray-600 mb-4">
                  Maintain reviewer profiles, expertise areas, availability status, and workload metrics for matchmaking.
                </p>
                <button
                  onClick={() => setMlView('reviewer-expertise')}
                  className="w-full bg-blue-600 text-white py-2 rounded-md hover:bg-blue-700 transition-colors"
                >
                  Open Module
                </button>
              </div>

              <div className="bg-white border border-gray-200 rounded-lg p-5 hover:shadow-md transition-shadow">
                <div className="flex items-center gap-3 mb-3">
                  <TrendingUp className="w-6 h-6 text-green-600" />
                  <h4 className="font-semibold text-gray-900">Reviewer Performance Dashboard</h4>
                </div>
                <p className="text-sm text-gray-600 mb-4">
                  Historical reviewer performance data with ratings, reliability scores, and completion metrics.
                </p>
                <button
                  onClick={() => setMlView('reviewer-performance')}
                  className="w-full bg-green-600 text-white py-2 rounded-md hover:bg-green-700 transition-colors"
                >
                  Open Module
                </button>
              </div>

              <div className="bg-white border border-gray-200 rounded-lg p-5 hover:shadow-md transition-shadow">
                <div className="flex items-center gap-3 mb-3">
                  <Database className="w-6 h-6 text-orange-600" />
                  <h4 className="font-semibold text-gray-900">Historical Workflow Records</h4>
                </div>
                <p className="text-sm text-gray-600 mb-4">
                  Training data showing historical processing times, bottleneck analysis, and completion trends.
                </p>
                <button
                  onClick={() => setMlView('workflow-history')}
                  className="w-full bg-orange-600 text-white py-2 rounded-md hover:bg-orange-700 transition-colors"
                >
                  Open Module
                </button>
              </div>

              <div className="bg-white border border-gray-200 rounded-lg p-5 hover:shadow-md transition-shadow">
                <div className="flex items-center gap-3 mb-3">
                  <Activity className="w-6 h-6 text-indigo-600" />
                  <h4 className="font-semibold text-gray-900">Production Capacity Dashboard</h4>
                </div>
                <p className="text-sm text-gray-600 mb-4">
                  Copyeditor, layout artist, and production coordinator workload metrics for capacity planning.
                </p>
                <button
                  onClick={() => setMlView('production-capacity')}
                  className="w-full bg-indigo-600 text-white py-2 rounded-md hover:bg-indigo-700 transition-colors"
                >
                  Open Module
                </button>
              </div>
            </div>

            <div className="border-t border-gray-300 pt-6">
              <h4 className="text-lg font-semibold text-gray-900 mb-4">Complete Data Flow Demonstrations</h4>
              <p className="text-sm text-gray-600 mb-4">
                These pages show the complete INPUT → PROCESSING → OUTPUT workflow for each ML model,
                demonstrating transparency and explainability.
              </p>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="bg-gradient-to-br from-blue-50 to-purple-50 border-2 border-blue-300 rounded-lg p-5">
                  <div className="flex items-center gap-3 mb-3">
                    <BarChart3 className="w-6 h-6 text-blue-600" />
                    <h4 className="font-semibold text-gray-900">Reviewer Matchmaking Data Flow</h4>
                  </div>
                  <p className="text-sm text-gray-600 mb-4">
                    Complete demonstration of how manuscript data and reviewer profiles are processed to generate ranked recommendations.
                  </p>
                  <button
                    onClick={() => setMlView('matchmaking-flow')}
                    className="w-full bg-gradient-to-r from-blue-600 to-purple-600 text-white py-2 rounded-md hover:from-blue-700 hover:to-purple-700 transition-colors font-semibold"
                  >
                    View Data Flow
                  </button>
                </div>

                <div className="bg-gradient-to-br from-purple-50 to-pink-50 border-2 border-purple-300 rounded-lg p-5">
                  <div className="flex items-center gap-3 mb-3">
                    <TrendingUp className="w-6 h-6 text-purple-600" />
                    <h4 className="font-semibold text-gray-900">Timeline Recommender Data Flow</h4>
                  </div>
                  <p className="text-sm text-gray-600 mb-4">
                    Complete demonstration of how complexity, historical data, and capacity metrics predict manuscript timelines.
                  </p>
                  <button
                    onClick={() => setMlView('timeline-flow')}
                    className="w-full bg-gradient-to-r from-purple-600 to-pink-600 text-white py-2 rounded-md hover:from-purple-700 hover:to-pink-700 transition-colors font-semibold"
                  >
                    View Data Flow
                  </button>
                </div>
              </div>
            </div>
          </div>
        </Tabs.Content>
      </Tabs.Root>

      <Dialog.Root open={!!selectedUser} onOpenChange={() => setSelectedUser(null)}>
        <Dialog.Portal>
          <Dialog.Overlay className="fixed inset-0 bg-black/50 z-50" />
          <Dialog.Content className="fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 bg-white rounded-lg shadow-lg p-6 w-full max-w-md z-50">
            <Dialog.Title className="text-xl font-semibold text-gray-900 mb-4">
              Edit User
            </Dialog.Title>
            <Dialog.Description className="sr-only">
              Edit user account details and role assignment
            </Dialog.Description>
            {selectedUser && (
              <div className="space-y-4">
                <div>
                  <p className="text-sm font-medium text-gray-700">Name</p>
                  <p className="text-gray-900">{selectedUser.name}</p>
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-700">Email</p>
                  <p className="text-gray-900">{selectedUser.email}</p>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Role</label>
                  <select
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    value={editRole}
                    onChange={(e) => setEditRole(e.target.value as UserRole)}
                  >
                    {(['author', 'editor', 'editor_in_chief', 'reviewer', 'layout_artist', 'twg_coordinator', 'twg_copyeditor', 'twg_layout', 'twg_production_coordinator', 'admin'] as UserRole[]).map(
                      (role) => (
                        <option key={role} value={role}>
                          {roleLabels[role]}
                        </option>
                      )
                    )}
                  </select>
                </div>
                <div className="flex justify-end gap-3 mt-6">
                  <Dialog.Close asChild>
                    <button className="px-4 py-2 text-gray-700 border border-gray-300 rounded-lg hover:bg-gray-50">
                      Cancel
                    </button>
                  </Dialog.Close>
                  <button
                    onClick={() => handleUpdateUser(selectedUser.id, { role: editRole })}
                    className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
                  >
                    Save Changes
                  </button>
                </div>
              </div>
            )}
          </Dialog.Content>
        </Dialog.Portal>
      </Dialog.Root>

      {/* Add New User Dialog */}
      <Dialog.Root open={showAddUserDialog} onOpenChange={setShowAddUserDialog}>
        <Dialog.Portal>
          <Dialog.Overlay className="fixed inset-0 bg-black/50 z-50" />
          <Dialog.Content className="fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 bg-white rounded-lg shadow-lg p-6 w-full max-w-md z-50">
            <Dialog.Title className="text-xl font-semibold text-gray-900 mb-4">
              Add New User
            </Dialog.Title>
            <Dialog.Description className="sr-only">
              Create credentials for editor, reviewer, or layout artist
            </Dialog.Description>
            <div className="space-y-4">
              {addUserError && (
                <div className="flex items-center gap-2 p-3 bg-red-50 border border-red-200 rounded-lg">
                  <AlertCircle className="w-5 h-5 text-red-600" />
                  <p className="text-sm text-red-700">{addUserError}</p>
                </div>
              )}

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Full Name</label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <UserIcon className="w-5 h-5 text-gray-400" />
                  </div>
                  <input
                    type="text"
                    value={newUserData.name}
                    onChange={(e) => setNewUserData({ ...newUserData, name: e.target.value })}
                    className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="John Doe"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Email Address</label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <Mail className="w-5 h-5 text-gray-400" />
                  </div>
                  <input
                    type="email"
                    value={newUserData.email}
                    onChange={(e) => setNewUserData({ ...newUserData, email: e.target.value })}
                    className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="user@example.com"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Password</label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <Lock className="w-5 h-5 text-gray-400" />
                  </div>
                  <input
                    type="password"
                    value={newUserData.password}
                    onChange={(e) => setNewUserData({ ...newUserData, password: e.target.value })}
                    className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="••••••••"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Role</label>
                <select
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  value={newUserData.role}
                  onChange={(e) => setNewUserData({ ...newUserData, role: e.target.value as UserRole })}
                >
                  <option value="author">Author</option>
                  <option value="editor">Editor</option>
                  <option value="editor_in_chief">Editor-in-Chief</option>
                  <option value="reviewer">Reviewer</option>
                  <option value="layout_artist">Layout Artist</option>
                  <option value="twg_coordinator">TWG Coordinator</option>
                  <option value="twg_copyeditor">TWG Copyeditor</option>
                  <option value="twg_layout">TWG Layout</option>
                  <option value="twg_production_coordinator">TWG Production Coordinator</option>
                  <option value="admin">Administrator</option>
                </select>
                <p className="text-xs text-gray-500 mt-1">
                  Authors register through the signup page
                </p>
              </div>

              <div className="flex justify-end gap-3 mt-6">
                <Dialog.Close asChild>
                  <button
                    onClick={() => {
                      setNewUserData({ name: '', email: '', password: '', role: 'reviewer' });
                      setAddUserError('');
                    }}
                    className="px-4 py-2 text-gray-700 border border-gray-300 rounded-lg hover:bg-gray-50"
                  >
                    Cancel
                  </button>
                </Dialog.Close>
                <button
                  onClick={handleAddUser}
                  className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
                >
                  Create User
                </button>
              </div>
            </div>
          </Dialog.Content>
        </Dialog.Portal>
      </Dialog.Root>
    </div>
  );
}
