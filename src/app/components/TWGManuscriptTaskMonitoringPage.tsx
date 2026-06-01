import React, { useState } from 'react';
import {
  ArrowLeft,
  FileText,
  Clock,
  CheckCircle,
  Lock,
  ArrowRight,
  Bell,
  X,
  Eye,
  Mail,
  Download,
  AlertCircle,
  TrendingUp,
  User,
  Calendar,
} from 'lucide-react';
import type { Manuscript } from '../types';

interface TWGTask {
  id: string;
  name: string;
  assignedMember: string;
  assignedMemberRole: string;
  status: 'locked' | 'unlocked' | 'in_progress' | 'done';
  deadline: Date;
  priority: 'low' | 'normal' | 'high';
  progress: number;
  completionDate?: Date;
  lastActivity?: Date;
  dependencies: string[];
}

interface TWGManuscriptTaskMonitoringPageProps {
  manuscript: Manuscript;
  onBack: () => void;
}

export function TWGManuscriptTaskMonitoringPage({
  manuscript,
  onBack,
}: TWGManuscriptTaskMonitoringPageProps) {
  const [showUnlockNotification, setShowUnlockNotification] = useState(true);

  // Mock tasks data with dependencies
  const tasks: TWGTask[] = [
    {
      id: 'task-1',
      name: 'Copyediting & Plagiarism Check',
      assignedMember: 'Sarah Martinez',
      assignedMemberRole: 'TWG Copyeditor',
      status: 'in_progress',
      deadline: new Date(Date.now() + 5 * 24 * 60 * 60 * 1000),
      priority: 'high',
      progress: 65,
      lastActivity: new Date(Date.now() - 2 * 60 * 60 * 1000),
      dependencies: [],
    },
    {
      id: 'task-2',
      name: 'Cover Page Design',
      assignedMember: 'Emma Thompson',
      assignedMemberRole: 'TWG',
      status: 'unlocked',
      deadline: new Date(Date.now() + 8 * 24 * 60 * 60 * 1000),
      priority: 'normal',
      progress: 0,
      dependencies: [],
    },
    {
      id: 'task-3',
      name: 'ISBN Application & Copyright Page',
      assignedMember: 'Rachel Foster',
      assignedMemberRole: 'TWG Production Coordinator',
      status: 'done',
      deadline: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
      priority: 'high',
      progress: 100,
      completionDate: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000),
      dependencies: [],
    },
    {
      id: 'task-4',
      name: 'Initial Book Layout',
      assignedMember: 'Emma Thompson',
      assignedMemberRole: 'TWG',
      status: 'unlocked',
      deadline: new Date(Date.now() + 12 * 24 * 60 * 60 * 1000),
      priority: 'high',
      progress: 0,
      dependencies: ['task-1', 'task-2', 'task-3'],
    },
    {
      id: 'task-5',
      name: 'Master Book Layout',
      assignedMember: 'Emma Thompson',
      assignedMemberRole: 'TWG',
      status: 'locked',
      deadline: new Date(Date.now() + 15 * 24 * 60 * 60 * 1000),
      priority: 'high',
      progress: 0,
      dependencies: ['task-4'],
    },
    {
      id: 'task-6',
      name: 'Final Publication Proof',
      assignedMember: 'Rachel Foster',
      assignedMemberRole: 'TWG Production Coordinator',
      status: 'locked',
      deadline: new Date(Date.now() + 18 * 24 * 60 * 60 * 1000),
      priority: 'normal',
      progress: 0,
      dependencies: ['task-5'],
    },
    {
      id: 'task-7',
      name: 'Galley Proof & Print',
      assignedMember: 'James Wilson',
      assignedMemberRole: 'TWG Print Coordinator',
      status: 'locked',
      deadline: new Date(Date.now() + 21 * 24 * 60 * 60 * 1000),
      priority: 'normal',
      progress: 0,
      dependencies: ['task-6'],
    },
    {
      id: 'task-8',
      name: 'Final Production Print',
      assignedMember: 'James Wilson',
      assignedMemberRole: 'TWG Print Coordinator',
      status: 'locked',
      deadline: new Date(Date.now() + 24 * 24 * 60 * 60 * 1000),
      priority: 'normal',
      progress: 0,
      dependencies: ['task-7'],
    },
    {
      id: 'task-9',
      name: 'Sorting, Inventory & Distribution',
      assignedMember: 'Robert Chen',
      assignedMemberRole: 'TWG Distribution',
      status: 'locked',
      deadline: new Date(Date.now() + 28 * 24 * 60 * 60 * 1000),
      priority: 'normal',
      progress: 0,
      dependencies: ['task-8'],
    },
  ];

  const totalTasks = tasks.length;
  const inProgressTasks = tasks.filter(t => t.status === 'in_progress').length;
  const completedTasks = tasks.filter(t => t.status === 'done').length;
  const lockedTasks = tasks.filter(t => t.status === 'locked').length;

  const getDaysRemaining = (deadline: Date) => {
    return Math.ceil((deadline.getTime() - Date.now()) / (1000 * 60 * 60 * 24));
  };

  const getStatusDotColor = (status: string) => {
    const colors: Record<string, string> = {
      done: 'bg-green-500',
      in_progress: 'bg-blue-500',
      unlocked: 'bg-amber-500',
      locked: 'bg-gray-400',
    };
    return colors[status] || 'bg-gray-400';
  };

  const getRoleBadgeColor = (role: string) => {
    const colors: Record<string, string> = {
      'TWG Copyeditor': 'bg-blue-100 text-blue-800',
      'TWG': 'bg-purple-100 text-purple-800',
      'TWG Production Coordinator': 'bg-green-100 text-green-800',
      'TWG Print Coordinator': 'bg-orange-100 text-orange-800',
      'TWG Distribution': 'bg-teal-100 text-teal-800',
    };
    return colors[role] || 'bg-gray-100 text-gray-800';
  };

  const getPriorityBadgeColor = (priority: string) => {
    const colors: Record<string, string> = {
      low: 'bg-gray-100 text-gray-700',
      normal: 'bg-blue-100 text-blue-700',
      high: 'bg-red-100 text-red-700',
    };
    return colors[priority] || 'bg-gray-100 text-gray-700';
  };

  const isDependenciesMet = (task: TWGTask) => {
    return task.dependencies.every(depId => {
      const depTask = tasks.find(t => t.id === depId);
      return depTask?.status === 'done';
    });
  };

  const unlockedTasks = tasks.filter(t => t.status === 'unlocked');
  const inProgressTasksList = tasks.filter(t => t.status === 'in_progress');
  const doneTasks = tasks.filter(t => t.status === 'done');
  const lockedTasksList = tasks.filter(t => t.status === 'locked');

  // TWG member workload
  const twgMembers = [
    { name: 'Sarah Martinez', role: 'TWG Copyeditor', activeTasks: 1, availability: 'available' },
    { name: 'Emma Thompson', role: 'TWG', activeTasks: 2, availability: 'busy' },
    { name: 'Rachel Foster', role: 'TWG Production Coordinator', activeTasks: 1, availability: 'available' },
    { name: 'James Wilson', role: 'TWG Print Coordinator', activeTasks: 0, availability: 'available' },
    { name: 'Robert Chen', role: 'TWG Distribution', activeTasks: 0, availability: 'available' },
  ];

  const recentActivity = [
    {
      id: 'act-1',
      timestamp: new Date(Date.now() - 2 * 60 * 60 * 1000),
      action: 'Updated copyediting progress to 65%',
      member: 'Sarah Martinez',
    },
    {
      id: 'act-2',
      timestamp: new Date(Date.now() - 24 * 60 * 60 * 1000),
      action: 'Completed ISBN Application & Copyright Page',
      member: 'Rachel Foster',
    },
    {
      id: 'act-3',
      timestamp: new Date(Date.now() - 26 * 60 * 60 * 1000),
      action: 'Started copyediting task',
      member: 'Sarah Martinez',
    },
  ];

  return (
    <div className="min-h-screen bg-[#F7F8FA] pb-24">
      {/* Sticky Manuscript Identity Bar */}
      <div className="bg-[#0F2D5E] text-white py-4 px-8 shadow-lg sticky top-0 z-50">
        <div className="max-w-[1600px] mx-auto">
          <div className="flex items-center justify-between mb-3">
            <button
              onClick={onBack}
              className="flex items-center gap-2 text-gray-300 hover:text-white transition-colors"
            >
              <ArrowLeft className="w-5 h-5" />
              <span className="text-sm font-medium">Back to Dashboard</span>
            </button>
            <span className="px-3 py-1 bg-blue-600 text-white text-xs font-medium rounded-full">
              Production In Progress
            </span>
          </div>
          <div className="flex items-center justify-between">
            <div className="flex-1">
              <h1 className="text-2xl font-bold mb-2">{manuscript.title}</h1>
              <div className="flex items-center gap-6 text-sm text-gray-300">
                <span>ID: {manuscript.id}</span>
                <span>Version: {manuscript.files.length}</span>
                <span>Category: {manuscript.category}</span>
              </div>
            </div>
            <div className="text-right">
              <p className="text-sm text-gray-400">Production Deadline</p>
              <p className="text-xl font-bold">{new Date(Date.now() + 28 * 24 * 60 * 60 * 1000).toLocaleDateString()}</p>
              <p className="text-sm text-amber-400 font-medium">28 days remaining</p>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-[1600px] mx-auto px-8 py-8">
        {/* Stats Cards */}
        <div className="grid grid-cols-4 gap-6 mb-8">
          <div className="bg-white rounded-sm border-2 border-[#1a1f2e] shadow-md p-6">
            <div className="flex items-center justify-between mb-2">
              <FileText className="w-6 h-6 text-gray-700" />
              <span className="text-2xl font-bold text-gray-900">{totalTasks}</span>
            </div>
            <p className="text-sm font-semibold text-gray-700">Total Tasks</p>
          </div>
          <div className="bg-white rounded-sm border-2 border-blue-500 shadow-md p-6">
            <div className="flex items-center justify-between mb-2">
              <Clock className="w-6 h-6 text-blue-600" />
              <span className="text-2xl font-bold text-blue-600">{inProgressTasks}</span>
            </div>
            <p className="text-sm font-semibold text-gray-700">In Progress</p>
          </div>
          <div className="bg-white rounded-sm border-2 border-green-500 shadow-md p-6">
            <div className="flex items-center justify-between mb-2">
              <CheckCircle className="w-6 h-6 text-green-600" />
              <span className="text-2xl font-bold text-green-600">{completedTasks}</span>
            </div>
            <p className="text-sm font-semibold text-gray-700">Completed</p>
          </div>
          <div className="bg-white rounded-sm border-2 border-gray-300 shadow-md p-6">
            <div className="flex items-center justify-between mb-2">
              <Lock className="w-6 h-6 text-gray-500" />
              <span className="text-2xl font-bold text-gray-500">{lockedTasks}</span>
            </div>
            <p className="text-sm font-semibold text-gray-700">Locked</p>
          </div>
        </div>

        {/* Unlock Notification Banner */}
        {showUnlockNotification && unlockedTasks.length > 0 && (
          <div className="bg-gradient-to-r from-amber-50 to-yellow-50 border-2 border-amber-400 rounded-sm shadow-lg p-4 mb-8">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-4">
                <Bell className="w-6 h-6 text-amber-600" />
                <div>
                  <p className="font-bold text-gray-900">
                    Task Unlocked: "{unlockedTasks[0].name}" is now ready to start
                  </p>
                  <p className="text-sm text-gray-600">
                    Assigned to: {unlockedTasks[0].assignedMember}
                  </p>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <button className="px-4 py-2 bg-amber-600 text-white rounded hover:bg-amber-700 transition-colors text-sm font-medium">
                  <Mail className="w-4 h-4 inline mr-2" />
                  Notify Member
                </button>
                <button
                  onClick={() => setShowUnlockNotification(false)}
                  className="p-2 hover:bg-amber-100 rounded transition-colors"
                >
                  <X className="w-5 h-5 text-gray-600" />
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Kanban Board */}
        <div className="grid grid-cols-4 gap-6 mb-8">
          {/* Unlocked Column */}
          <div>
            <div className="bg-amber-100 rounded-t-sm p-3 border-2 border-amber-500">
              <h3 className="font-bold text-gray-900 text-sm">Unlocked ({unlockedTasks.length})</h3>
            </div>
            <div className="bg-white border-2 border-l-amber-500 border-r-gray-200 border-b-gray-200 rounded-b-sm p-4 space-y-3 min-h-[400px]">
              {unlockedTasks.map((task) => (
                <div key={task.id} className="bg-white border-l-4 border-amber-500 rounded shadow-sm p-4">
                  <h4 className="font-semibold text-gray-900 text-sm mb-2">{task.name}</h4>
                  <p className="text-xs text-gray-600 mb-2">{task.assignedMember}</p>
                  <span className={`inline-block text-xs px-2 py-1 rounded-full mb-2 ${getRoleBadgeColor(task.assignedMemberRole)}`}>
                    {task.assignedMemberRole}
                  </span>
                  <div className="flex items-center justify-between text-xs text-gray-600 mb-2">
                    <span>Deadline: {task.deadline.toLocaleDateString()}</span>
                  </div>
                  <div className="flex items-center gap-2 mb-3">
                    <span className={`text-xs px-2 py-1 rounded ${getPriorityBadgeColor(task.priority)}`}>
                      {task.priority.toUpperCase()}
                    </span>
                    <span className="text-xs px-2 py-1 rounded bg-green-100 text-green-800">Ready to Start</span>
                  </div>
                  <button className="w-full py-2 bg-amber-600 text-white rounded hover:bg-amber-700 transition-colors text-sm font-medium">
                    Start Task
                  </button>
                </div>
              ))}
            </div>
          </div>

          {/* In Progress Column */}
          <div>
            <div className="bg-blue-100 rounded-t-sm p-3 border-2 border-blue-500">
              <h3 className="font-bold text-gray-900 text-sm">In Progress ({inProgressTasksList.length})</h3>
            </div>
            <div className="bg-white border-2 border-l-blue-500 border-r-gray-200 border-b-gray-200 rounded-b-sm p-4 space-y-3 min-h-[400px]">
              {inProgressTasksList.map((task) => (
                <div key={task.id} className="bg-white border-l-4 border-blue-500 rounded shadow-sm p-4">
                  <h4 className="font-semibold text-gray-900 text-sm mb-2">{task.name}</h4>
                  <p className="text-xs text-gray-600 mb-2">{task.assignedMember}</p>
                  <span className={`inline-block text-xs px-2 py-1 rounded-full mb-2 ${getRoleBadgeColor(task.assignedMemberRole)}`}>
                    {task.assignedMemberRole}
                  </span>
                  <div className="flex items-center justify-between text-xs text-gray-600 mb-2">
                    <span>Deadline: {task.deadline.toLocaleDateString()}</span>
                  </div>
                  <div className="mb-3">
                    <div className="flex items-center justify-between text-xs mb-1">
                      <span className="text-gray-600">Progress:</span>
                      <span className="font-semibold text-gray-900">{task.progress}%</span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-2">
                      <div className="bg-blue-600 h-2 rounded-full" style={{ width: `${task.progress}%` }}></div>
                    </div>
                  </div>
                  <p className="text-xs text-gray-500 mb-3">
                    Last activity: {task.lastActivity?.toLocaleString()}
                  </p>
                  <div className="flex gap-2">
                    <button className="flex-1 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition-colors text-xs font-medium">
                      <Eye className="w-3 h-3 inline mr-1" />
                      View Task
                    </button>
                    <button className="flex-1 py-2 border border-blue-600 text-blue-600 rounded hover:bg-blue-50 transition-colors text-xs font-medium">
                      <Mail className="w-3 h-3 inline mr-1" />
                      Remind
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Done Column */}
          <div>
            <div className="bg-green-100 rounded-t-sm p-3 border-2 border-green-500">
              <h3 className="font-bold text-gray-900 text-sm">Done ({doneTasks.length})</h3>
            </div>
            <div className="bg-white border-2 border-l-green-500 border-r-gray-200 border-b-gray-200 rounded-b-sm p-4 space-y-3 min-h-[400px]">
              {doneTasks.map((task) => (
                <div key={task.id} className="bg-white border-l-4 border-green-500 rounded shadow-sm p-4">
                  <div className="flex items-start gap-2 mb-2">
                    <CheckCircle className="w-5 h-5 text-green-600 flex-shrink-0" />
                    <h4 className="font-semibold text-gray-900 text-sm">{task.name}</h4>
                  </div>
                  <p className="text-xs text-gray-600 mb-2">{task.assignedMember}</p>
                  <p className="text-xs text-green-600 font-medium mb-3">
                    Completed: {task.completionDate?.toLocaleDateString()}
                  </p>
                  <button className="w-full py-2 border border-green-600 text-green-600 rounded hover:bg-green-50 transition-colors text-sm font-medium">
                    View Summary
                  </button>
                </div>
              ))}
            </div>
          </div>

          {/* Locked Column */}
          <div>
            <div className="bg-gray-100 rounded-t-sm p-3 border-2 border-gray-400">
              <h3 className="font-bold text-gray-900 text-sm">Locked ({lockedTasksList.length})</h3>
            </div>
            <div className="bg-gray-50 border-2 border-gray-300 rounded-b-sm p-4 space-y-3 min-h-[400px]">
              {lockedTasksList.map((task) => (
                <div key={task.id} className="bg-gray-100 border border-gray-300 rounded shadow-sm p-4">
                  <div className="flex items-start gap-2 mb-2">
                    <Lock className="w-4 h-4 text-gray-500 flex-shrink-0 mt-0.5" />
                    <h4 className="font-semibold text-gray-500 text-sm">{task.name}</h4>
                  </div>
                  <p className="text-xs text-gray-500 mb-2">{task.assignedMember}</p>
                  <span className="inline-block text-xs px-2 py-1 rounded-full mb-3 bg-gray-200 text-gray-600">
                    {task.assignedMemberRole}
                  </span>
                  <span className="block text-xs px-2 py-1 rounded bg-gray-300 text-gray-700 mb-3 text-center">
                    Locked
                  </span>
                  <div className="bg-white rounded p-3 border border-gray-200">
                    <p className="text-xs font-semibold text-gray-700 mb-2">Waiting For:</p>
                    <div className="space-y-1">
                      {task.dependencies.map((depId) => {
                        const depTask = tasks.find(t => t.id === depId);
                        const isComplete = depTask?.status === 'done';
                        return (
                          <div key={depId} className="flex items-center gap-2 text-xs">
                            {isComplete ? (
                              <CheckCircle className="w-3 h-3 text-green-600" />
                            ) : (
                              <div className="w-3 h-3 border-2 border-gray-300 rounded"></div>
                            )}
                            <span className={isComplete ? 'text-green-600' : 'text-gray-600'}>
                              {depTask?.name}
                            </span>
                          </div>
                        );
                      })}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* TWG Member Workload */}
          <div className="lg:col-span-2">
            <div className="bg-white rounded-sm border-2 border-[#1a1f2e] shadow-md p-6">
              <h3 className="text-lg font-bold text-[#0F2D5E] mb-4">TWG Member Workload</h3>
              <div className="grid grid-cols-2 gap-4">
                {twgMembers.map((member) => (
                  <div key={member.name} className="p-4 bg-gray-50 rounded border border-gray-200">
                    <div className="flex items-center gap-3 mb-3">
                      <div className="w-10 h-10 rounded-full bg-gradient-to-br from-blue-500 to-purple-600 text-white flex items-center justify-center text-sm font-semibold">
                        {member.name.charAt(0)}
                      </div>
                      <div className="flex-1">
                        <p className="font-semibold text-gray-900 text-sm">{member.name}</p>
                        <span className={`text-xs px-2 py-0.5 rounded-full ${getRoleBadgeColor(member.role)}`}>
                          {member.role}
                        </span>
                      </div>
                    </div>
                    <div className="space-y-2">
                      <div className="flex items-center justify-between text-xs">
                        <span className="text-gray-600">Active Tasks</span>
                        <span className="font-semibold text-gray-900">{member.activeTasks}</span>
                      </div>
                      <div className="w-full bg-gray-200 rounded-full h-2">
                        <div
                          className={`h-2 rounded-full ${
                            member.availability === 'available' ? 'bg-green-500' : 'bg-amber-500'
                          }`}
                          style={{ width: `${(member.activeTasks / 3) * 100}%` }}
                        ></div>
                      </div>
                      <span
                        className={`inline-block text-xs px-2 py-1 rounded ${
                          member.availability === 'available'
                            ? 'bg-green-100 text-green-800'
                            : 'bg-amber-100 text-amber-800'
                        }`}
                      >
                        {member.availability === 'available' ? 'Available' : 'Busy'}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Production Timeline & Activity */}
          <div className="space-y-6">
            {/* Timeline */}
            <div className="bg-white rounded-sm border-2 border-[#1a1f2e] shadow-md p-6">
              <h3 className="text-lg font-bold text-[#0F2D5E] mb-4">Production Timeline</h3>
              <div className="space-y-3">
                <div className="flex items-center justify-between text-sm">
                  <span className="text-gray-600">Start Date:</span>
                  <span className="font-semibold text-gray-900">{new Date().toLocaleDateString()}</span>
                </div>
                <div className="flex items-center justify-between text-sm">
                  <span className="text-gray-600">Deadline:</span>
                  <span className="font-semibold text-gray-900">
                    {new Date(Date.now() + 28 * 24 * 60 * 60 * 1000).toLocaleDateString()}
                  </span>
                </div>
                <div className="flex items-center justify-between text-sm">
                  <span className="text-gray-600">Timeline Confidence:</span>
                  <span className="px-2 py-1 bg-green-100 text-green-800 text-xs font-medium rounded">
                    High
                  </span>
                </div>
                <div className="pt-3 border-t border-gray-200">
                  <p className="text-xs font-semibold text-gray-700 mb-2">Stage Duration:</p>
                  <div className="space-y-2">
                    <div className="flex items-center justify-between text-xs">
                      <span className="text-gray-600">Copyediting</span>
                      <span className="text-gray-900">5 days</span>
                    </div>
                    <div className="flex items-center justify-between text-xs">
                      <span className="text-gray-600">Layout Design</span>
                      <span className="text-gray-900">10 days</span>
                    </div>
                    <div className="flex items-center justify-between text-xs">
                      <span className="text-gray-600">Print Production</span>
                      <span className="text-gray-900">8 days</span>
                    </div>
                    <div className="flex items-center justify-between text-xs">
                      <span className="text-gray-600">Distribution</span>
                      <span className="text-gray-900">5 days</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Activity Log */}
            <div className="bg-white rounded-sm border-2 border-[#1a1f2e] shadow-md p-6">
              <h3 className="text-lg font-bold text-[#0F2D5E] mb-4">Activity Log</h3>
              <div className="space-y-4">
                {recentActivity.map((activity) => (
                  <div key={activity.id} className="relative pl-6 pb-4 border-l-2 border-gray-200 last:border-l-0 last:pb-0">
                    <div className="absolute left-0 top-0 -translate-x-1/2 w-3 h-3 rounded-full bg-blue-500 border-2 border-white"></div>
                    <p className="text-xs text-gray-500 mb-1">{activity.timestamp.toLocaleString()}</p>
                    <p className="text-sm text-gray-900 mb-1">{activity.action}</p>
                    <p className="text-xs text-gray-600">{activity.member}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Fixed Action Bar */}
      <div className="fixed bottom-0 left-0 right-0 bg-white border-t-2 border-[#1a1f2e] shadow-2xl z-50">
        <div className="max-w-[1600px] mx-auto px-8 py-4">
          <div className="flex items-center justify-between">
            <button
              onClick={onBack}
              className="flex items-center gap-2 px-5 py-2.5 border border-gray-300 rounded hover:bg-gray-50 transition-colors text-sm font-medium text-gray-700"
            >
              <ArrowLeft className="w-4 h-4" />
              Back to Dashboard
            </button>
            <div className="flex items-center gap-3">
              <button className="flex items-center gap-2 px-5 py-2.5 border border-gray-300 rounded hover:bg-gray-50 transition-colors text-sm font-medium text-gray-700">
                <Download className="w-4 h-4" />
                Export Task Report
              </button>
              <button className="flex items-center gap-2 px-6 py-2.5 bg-[#0F2D5E] text-white rounded hover:bg-[#1A4A8A] transition-colors text-sm font-medium">
                <Mail className="w-4 h-4" />
                Send Reminder to All
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
