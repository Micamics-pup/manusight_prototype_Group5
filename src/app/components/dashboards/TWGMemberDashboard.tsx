import React, { useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import { useData } from '../../context/DataContext';
import type { Manuscript } from '../../types';
import { TWGLayoutArtistCoverDesignPage } from '../TWGLayoutArtistCoverDesignPage';
import { TWGLayoutArtistTypesettingPage } from '../TWGLayoutArtistTypesettingPage';
import { TWGInitialBookLayoutPage } from '../TWGInitialBookLayoutPage';
import { TWGMasterBookLayoutPage } from '../TWGMasterBookLayoutPage';
import {
  LogOut,
  FileText,
  Clock,
  CheckCircle,
  AlertCircle,
  Calendar,
  User,
  Palette,
  BookOpen,
  ChevronRight,
  Layout,
  BookMarked,
  ClipboardCheck,
} from 'lucide-react';

export function TWGMemberDashboard() {
  const { currentUser, logout } = useAuth();
  const { manuscripts } = useData();
  const [selectedManuscriptForCoverDesign, setSelectedManuscriptForCoverDesign] = useState<Manuscript | null>(null);
  const [selectedManuscriptForTypesetting, setSelectedManuscriptForTypesetting] = useState<Manuscript | null>(null);
  const [selectedManuscriptForInitialLayout, setSelectedManuscriptForInitialLayout] = useState<Manuscript | null>(null);
  const [selectedManuscriptForMasterLayout, setSelectedManuscriptForMasterLayout] = useState<Manuscript | null>(null);

  if (selectedManuscriptForMasterLayout) {
    return (
      <TWGMasterBookLayoutPage
        manuscript={selectedManuscriptForMasterLayout}
        onBack={() => setSelectedManuscriptForMasterLayout(null)}
      />
    );
  }

  if (selectedManuscriptForInitialLayout) {
    return (
      <TWGInitialBookLayoutPage
        manuscript={selectedManuscriptForInitialLayout}
        onBack={() => setSelectedManuscriptForInitialLayout(null)}
      />
    );
  }

  if (selectedManuscriptForCoverDesign) {
    return (
      <TWGLayoutArtistCoverDesignPage
        manuscript={selectedManuscriptForCoverDesign}
        onBack={() => setSelectedManuscriptForCoverDesign(null)}
      />
    );
  }

  if (selectedManuscriptForTypesetting) {
    return (
      <TWGLayoutArtistTypesettingPage
        manuscript={selectedManuscriptForTypesetting}
        onBack={() => setSelectedManuscriptForTypesetting(null)}
      />
    );
  }

  const getRoleLabel = (role: string) => {
    const labels: Record<string, string> = {
      twg_copyeditor: 'TWG Copyeditor',
      twg_layout: 'TWG Layout Artist',
      twg_production_coordinator: 'TWG Production Coordinator',
      twg_print_coordinator: 'TWG Print Coordinator',
      twg_distribution: 'TWG Distribution',
    };
    return labels[role] || role;
  };

  const getRoleBadgeColor = (role: string) => {
    const colors: Record<string, string> = {
      twg_copyeditor: 'bg-blue-100 text-blue-800',
      twg_layout: 'bg-purple-100 text-purple-800',
      twg_production_coordinator: 'bg-green-100 text-green-800',
      twg_print_coordinator: 'bg-orange-100 text-orange-800',
      twg_distribution: 'bg-teal-100 text-teal-800',
    };
    return colors[role] || 'bg-gray-100 text-gray-800';
  };

  // Mock assigned tasks
  const myTasks = [
    {
      id: 'task-1',
      manuscriptTitle: 'Blockchain Technology in Supply Chain Management',
      taskName: 'Copyediting & Plagiarism Check',
      deadline: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
      priority: 'high',
      status: 'pending',
    },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50">
      {/* Header */}
      <div className="bg-white/80 backdrop-blur-lg border-b border-gray-200 sticky top-0 z-50 shadow-sm">
        <div className="px-8 py-4">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-bold text-gray-900">
                {getRoleLabel(currentUser?.role || '')} Dashboard
              </h1>
              <p className="text-sm text-gray-600">Production task management</p>
            </div>
            <div className="flex items-center gap-4">
              <div className="text-right">
                <p className="text-sm font-medium text-gray-900">{currentUser?.name}</p>
                <span className={`text-xs px-2 py-1 rounded-full ${getRoleBadgeColor(currentUser?.role || '')}`}>
                  {getRoleLabel(currentUser?.role || '')}
                </span>
              </div>
              <button
                onClick={logout}
                className="flex items-center gap-2 px-4 py-2 text-sm text-red-600 hover:bg-red-50 rounded-lg transition-colors"
              >
                <LogOut className="w-4 h-4" />
                Logout
              </button>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-8 py-8">
        {/* Stats Overview */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <div className="bg-white rounded-xl p-6 border border-gray-200 shadow-sm">
            <div className="flex items-center justify-between mb-4">
              <div className="p-3 bg-blue-100 rounded-lg">
                <FileText className="w-6 h-6 text-blue-600" />
              </div>
            </div>
            <p className="text-sm text-gray-600 mb-1">Assigned Tasks</p>
            <p className="text-3xl font-bold text-gray-900">{myTasks.length}</p>
          </div>

          <div className="bg-white rounded-xl p-6 border border-gray-200 shadow-sm">
            <div className="flex items-center justify-between mb-4">
              <div className="p-3 bg-yellow-100 rounded-lg">
                <Clock className="w-6 h-6 text-yellow-600" />
              </div>
            </div>
            <p className="text-sm text-gray-600 mb-1">In Progress</p>
            <p className="text-3xl font-bold text-gray-900">0</p>
          </div>

          <div className="bg-white rounded-xl p-6 border border-gray-200 shadow-sm">
            <div className="flex items-center justify-between mb-4">
              <div className="p-3 bg-green-100 rounded-lg">
                <CheckCircle className="w-6 h-6 text-green-600" />
              </div>
            </div>
            <p className="text-sm text-gray-600 mb-1">Completed</p>
            <p className="text-3xl font-bold text-gray-900">0</p>
          </div>

          <div className="bg-white rounded-xl p-6 border border-gray-200 shadow-sm">
            <div className="flex items-center justify-between mb-4">
              <div className="p-3 bg-red-100 rounded-lg">
                <AlertCircle className="w-6 h-6 text-red-600" />
              </div>
            </div>
            <p className="text-sm text-gray-600 mb-1">Overdue</p>
            <p className="text-3xl font-bold text-gray-900">0</p>
          </div>
        </div>

        {/* Initial Book Layout — TWG Layout Artist only */}
        {currentUser?.role === 'twg_layout' && (() => {
          const initialLayoutManuscripts = manuscripts.filter(ms => ms.status === 'copyediting');
          return initialLayoutManuscripts.length > 0 ? (
            <div className="bg-white rounded-xl p-6 border border-indigo-200 shadow-sm mb-8">
              <div className="flex items-center gap-3 mb-1">
                <div className="p-2 bg-indigo-100 rounded-lg">
                  <BookMarked className="w-5 h-5 text-indigo-700" />
                </div>
                <div>
                  <h2 className="text-lg font-semibold text-gray-900">Initial Book Layout</h2>
                  <p className="text-xs text-indigo-700 font-medium">Action Required — Compose Structured Publication Layout</p>
                </div>
                <span className="ml-auto px-3 py-1 bg-indigo-100 text-indigo-800 text-xs font-semibold rounded-full">
                  {initialLayoutManuscripts.length} Manuscript{initialLayoutManuscripts.length !== 1 ? 's' : ''}
                </span>
              </div>
              <p className="text-sm text-gray-500 mb-4 ml-11">
                Apply typography, grid system, pagination, and formatting templates to create the initial book layout before composition.
              </p>
              <div className="space-y-3">
                {initialLayoutManuscripts.map((ms) => (
                  <div key={ms.id} className="p-4 bg-indigo-50 rounded-lg border border-indigo-100 hover:shadow-md transition-shadow">
                    <div className="flex items-start justify-between gap-4">
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2 mb-1 flex-wrap">
                          <BookOpen className="w-4 h-4 text-indigo-500 flex-shrink-0" />
                          <h3 className="font-semibold text-gray-900 text-sm truncate">{ms.title}</h3>
                        </div>
                        <p className="text-xs text-gray-500 mb-2 ml-6">{ms.journal} · Due in 8 days</p>
                        <div className="flex items-center gap-2 ml-6 flex-wrap">
                          <span className="px-2 py-0.5 text-xs bg-indigo-100 text-indigo-700 rounded-full font-medium">Initial Layout Required</span>
                          <span className="px-2 py-0.5 text-xs bg-amber-100 text-amber-700 rounded-full font-medium">High Priority</span>
                        </div>
                      </div>
                      <button
                        onClick={() => setSelectedManuscriptForInitialLayout(ms)}
                        className="flex items-center gap-1.5 px-4 py-2 bg-indigo-700 text-white rounded-lg hover:bg-indigo-800 transition-colors text-sm font-medium flex-shrink-0"
                      >
                        Open Layout Workspace
                        <ChevronRight className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          ) : null;
        })()}

        {/* Cover Page Design — TWG Layout Artist only */}
        {currentUser?.role === 'twg_layout' && (() => {
          const coverDesignManuscripts = manuscripts.filter(ms => ms.status === 'copyediting');
          return coverDesignManuscripts.length > 0 ? (
            <div className="bg-white rounded-xl p-6 border border-purple-200 shadow-sm mb-8">
              <div className="flex items-center gap-3 mb-1">
                <div className="p-2 bg-purple-100 rounded-lg">
                  <Palette className="w-5 h-5 text-purple-600" />
                </div>
                <div>
                  <h2 className="text-lg font-semibold text-gray-900">Cover Page Design</h2>
                  <p className="text-xs text-purple-700 font-medium">Action Required — Design & Submit to Editor</p>
                </div>
                <span className="ml-auto px-3 py-1 bg-purple-100 text-purple-800 text-xs font-semibold rounded-full">
                  {coverDesignManuscripts.length} Manuscript{coverDesignManuscripts.length !== 1 ? 's' : ''}
                </span>
              </div>

              <p className="text-sm text-gray-500 mb-4 ml-11">
                Manuscripts awaiting cover page design, layout finalization, and submission to the editor for approval.
              </p>

              <div className="space-y-3">
                {coverDesignManuscripts.map((ms) => (
                  <div
                    key={ms.id}
                    className="p-4 bg-purple-50 rounded-lg border border-purple-100 hover:shadow-md transition-shadow"
                  >
                    <div className="flex items-start justify-between gap-4">
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2 mb-1 flex-wrap">
                          <BookOpen className="w-4 h-4 text-purple-500 flex-shrink-0" />
                          <h3 className="font-semibold text-gray-900 text-sm truncate">{ms.title}</h3>
                        </div>
                        <p className="text-xs text-gray-500 mb-2 ml-6">{ms.journal} · Submitted {new Date(ms.submissionDate).toLocaleDateString()}</p>
                        <div className="flex items-center gap-2 ml-6 flex-wrap">
                          <span className="px-2 py-0.5 text-xs bg-purple-100 text-purple-700 rounded-full font-medium">
                            Cover Design Required
                          </span>
                          <span className="px-2 py-0.5 text-xs bg-amber-100 text-amber-700 rounded-full font-medium">
                            Pending Editor Approval
                          </span>
                        </div>
                      </div>
                      <button
                        onClick={() => setSelectedManuscriptForCoverDesign(ms)}
                        className="flex items-center gap-1.5 px-4 py-2 bg-purple-700 text-white rounded-lg hover:bg-purple-800 transition-colors text-sm font-medium flex-shrink-0"
                      >
                        Design Cover Page
                        <ChevronRight className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          ) : null;
        })()}

        {/* Typesetting & Layout — TWG Layout Artist only */}
        {currentUser?.role === 'twg_layout' && (() => {
          const typesettingManuscripts = manuscripts.filter(ms => ms.status === 'copyediting');
          return typesettingManuscripts.length > 0 ? (
            <div className="bg-white rounded-xl p-6 border border-blue-200 shadow-sm mb-8">
              <div className="flex items-center gap-3 mb-1">
                <div className="p-2 bg-blue-100 rounded-lg">
                  <Layout className="w-5 h-5 text-blue-700" />
                </div>
                <div>
                  <h2 className="text-lg font-semibold text-gray-900">Typesetting & Layout Composition</h2>
                  <p className="text-xs text-blue-700 font-medium">Action Required — Convert Manuscript to Publication Layout</p>
                </div>
                <span className="ml-auto px-3 py-1 bg-blue-100 text-blue-800 text-xs font-semibold rounded-full">
                  {typesettingManuscripts.length} Manuscript{typesettingManuscripts.length !== 1 ? 's' : ''}
                </span>
              </div>
              <p className="text-sm text-gray-500 mb-4 ml-11">
                Manuscripts requiring typesetting, layout composition, and structured publication formatting before editor review.
              </p>
              <div className="space-y-3">
                {typesettingManuscripts.map((ms) => (
                  <div key={ms.id} className="p-4 bg-blue-50 rounded-lg border border-blue-100 hover:shadow-md transition-shadow">
                    <div className="flex items-start justify-between gap-4">
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2 mb-1 flex-wrap">
                          <BookOpen className="w-4 h-4 text-blue-500 flex-shrink-0" />
                          <h3 className="font-semibold text-gray-900 text-sm truncate">{ms.title}</h3>
                        </div>
                        <p className="text-xs text-gray-500 mb-2 ml-6">{ms.journal} · Submitted {new Date(ms.submissionDate).toLocaleDateString()}</p>
                        <div className="flex items-center gap-2 ml-6 flex-wrap">
                          <span className="px-2 py-0.5 text-xs bg-blue-100 text-blue-700 rounded-full font-medium">Typesetting Required</span>
                          <span className="px-2 py-0.5 text-xs bg-amber-100 text-amber-700 rounded-full font-medium">Pending Editor Submission</span>
                        </div>
                      </div>
                      <button
                        onClick={() => setSelectedManuscriptForTypesetting(ms)}
                        className="flex items-center gap-1.5 px-4 py-2 bg-blue-700 text-white rounded-lg hover:bg-blue-800 transition-colors text-sm font-medium flex-shrink-0"
                      >
                        Begin Typesetting
                        <ChevronRight className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          ) : null;
        })()}

        {/* Master Book Layout — TWG Production Coordinator only */}
        {currentUser?.role === 'twg_production_coordinator' && (() => {
          const masterLayoutManuscripts = manuscripts.filter(ms => ms.status === 'copyediting');
          return masterLayoutManuscripts.length > 0 ? (
            <div className="bg-white rounded-xl p-6 border border-teal-200 shadow-sm mb-8">
              <div className="flex items-center gap-3 mb-1">
                <div className="p-2 bg-teal-100 rounded-lg">
                  <ClipboardCheck className="w-5 h-5 text-teal-700" />
                </div>
                <div>
                  <h2 className="text-lg font-semibold text-gray-900">Master Book Layout Review</h2>
                  <p className="text-xs text-teal-700 font-medium">Action Required — Validate & Approve Final Layout for Proof Generation</p>
                </div>
                <span className="ml-auto px-3 py-1 bg-teal-100 text-teal-800 text-xs font-semibold rounded-full">
                  {masterLayoutManuscripts.length} Manuscript{masterLayoutManuscripts.length !== 1 ? 's' : ''}
                </span>
              </div>
              <p className="text-sm text-gray-500 mb-4 ml-11">
                Review consolidated book layout, validate formatting and structure, then approve or return for revision before proof generation.
              </p>
              <div className="space-y-3">
                {masterLayoutManuscripts.map((ms) => (
                  <div key={ms.id} className="p-4 bg-teal-50 rounded-lg border border-teal-100 hover:shadow-md transition-shadow">
                    <div className="flex items-start justify-between gap-4">
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2 mb-1 flex-wrap">
                          <BookOpen className="w-4 h-4 text-teal-600 flex-shrink-0" />
                          <h3 className="font-semibold text-gray-900 text-sm truncate">{ms.title}</h3>
                        </div>
                        <p className="text-xs text-gray-500 mb-2 ml-6">{ms.journal} · Readiness Score: 84%</p>
                        <div className="flex items-center gap-2 ml-6 flex-wrap">
                          <span className="px-2 py-0.5 text-xs bg-teal-100 text-teal-700 rounded-full font-medium">Layout Validation Required</span>
                          <span className="px-2 py-0.5 text-xs bg-amber-100 text-amber-700 rounded-full font-medium">Pending Coordinator Approval</span>
                        </div>
                      </div>
                      <button
                        onClick={() => setSelectedManuscriptForMasterLayout(ms)}
                        className="flex items-center gap-1.5 px-4 py-2 bg-teal-700 text-white rounded-lg hover:bg-teal-800 transition-colors text-sm font-medium flex-shrink-0"
                      >
                        Open Master Layout
                        <ChevronRight className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          ) : null;
        })()}

        {/* My Assigned Tasks */}
        {myTasks.length > 0 ? (
          <div className="bg-white rounded-xl p-6 border border-gray-200 shadow-sm mb-8">
            <div className="flex items-center gap-3 mb-4">
              <FileText className="w-5 h-5 text-blue-600" />
              <h2 className="text-lg font-semibold text-gray-900">My Assigned Tasks</h2>
            </div>

            <div className="space-y-3">
              {myTasks.map((task) => (
                <div
                  key={task.id}
                  className="p-5 bg-gray-50 rounded-lg border border-gray-200 hover:shadow-md transition-shadow"
                >
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <div className="flex items-center gap-3 mb-2">
                        <h3 className="font-semibold text-gray-900">{task.taskName}</h3>
                        <span className="px-2 py-1 text-xs bg-red-100 text-red-800 rounded-full font-medium">
                          High Priority
                        </span>
                        <span className="px-2 py-1 text-xs bg-yellow-100 text-yellow-800 rounded-full font-medium">
                          Pending
                        </span>
                      </div>
                      <p className="text-sm text-gray-600 mb-3">
                        Manuscript: {task.manuscriptTitle}
                      </p>
                      <div className="flex items-center gap-4 text-sm text-gray-600">
                        <div className="flex items-center gap-2">
                          <Calendar className="w-4 h-4" />
                          <span>Due: {task.deadline.toLocaleDateString()}</span>
                        </div>
                      </div>
                    </div>
                    <button className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors text-sm font-medium">
                      Start Task
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        ) : (
          <div className="bg-white rounded-xl p-12 border border-gray-200 shadow-sm text-center">
            <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <FileText className="w-8 h-8 text-gray-400" />
            </div>
            <h3 className="text-lg font-semibold text-gray-900 mb-2">No Tasks Assigned</h3>
            <p className="text-sm text-gray-600">
              You will see your assigned production tasks here once the TWG Coordinator assigns them.
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
