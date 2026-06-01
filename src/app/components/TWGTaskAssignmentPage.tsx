import React, { useState, useEffect } from 'react';
import {
  ArrowLeft,
  FileText,
  Download,
  Eye,
  AlertCircle,
  CheckCircle,
  Clock,
  Users,
  Calendar,
  AlertTriangle,
  Save,
  Send,
  X,
  ChevronUp,
  ChevronDown,
  Activity,
  Target,
  TrendingUp,
  Mail,
} from 'lucide-react';
import type { Manuscript, Review } from '../types';

export interface TWGTaskAssignment {
  taskName: string;
  role: 'copyeditor' | 'twg' | 'production_coordinator' | 'print_coordinator' | 'distribution';
  assignedTo: string;
  startDate: Date;
  deadline: Date;
  priority: 'low' | 'normal' | 'high';
  notes: string;
  status: 'pending' | 'in_progress' | 'completed';
}

export interface TWGAssignmentData {
  tasks: TWGTaskAssignment[];
  generalInstructions: string;
  specialHandlingInstructions: string;
  confidentialNotes: string;
  productionDeadline: Date;
}

interface TWGTaskAssignmentPageProps {
  manuscript: Manuscript;
  reviews: Review[];
  endorsementData?: {
    decision: string;
    justification: string;
    technicalConcerns: string;
    publicationReadiness: string;
    revisionCompliance: string;
    timestamp: Date;
    endorsedBy: string;
  };
  onBack: () => void;
  onSubmitAssignment: (assignmentData: TWGAssignmentData) => void;
}

interface TWGMember {
  id: string;
  name: string;
  role: 'copyeditor' | 'twg' | 'production_coordinator' | 'print_coordinator' | 'distribution';
  activeTaskCount: number;
  availability: 'available' | 'busy' | 'overloaded';
  email: string;
}

const mockTWGMembers: TWGMember[] = [
  {
    id: 'twg-m-001',
    name: 'Sarah Martinez',
    role: 'copyeditor',
    activeTaskCount: 1,
    availability: 'available',
    email: 'sarah.martinez@publisher.com',
  },
  {
    id: 'twg-m-002',
    name: 'David Kim',
    role: 'copyeditor',
    activeTaskCount: 3,
    availability: 'busy',
    email: 'david.kim@publisher.com',
  },
  {
    id: 'twg-m-003',
    name: 'Emma Thompson',
    role: 'twg',
    activeTaskCount: 2,
    availability: 'available',
    email: 'emma.thompson@publisher.com',
  },
  {
    id: 'twg-m-004',
    name: 'Michael Chang',
    role: 'twg',
    activeTaskCount: 4,
    availability: 'overloaded',
    email: 'michael.chang@publisher.com',
  },
  {
    id: 'twg-m-005',
    name: 'Rachel Foster',
    role: 'production_coordinator',
    activeTaskCount: 2,
    availability: 'available',
    email: 'rachel.foster@publisher.com',
  },
  {
    id: 'twg-m-006',
    name: 'James Wilson',
    role: 'print_coordinator',
    activeTaskCount: 1,
    availability: 'available',
    email: 'james.wilson@publisher.com',
  },
  {
    id: 'twg-m-007',
    name: 'Lisa Anderson',
    role: 'print_coordinator',
    activeTaskCount: 3,
    availability: 'busy',
    email: 'lisa.anderson@publisher.com',
  },
  {
    id: 'twg-m-008',
    name: 'Robert Chen',
    role: 'distribution',
    activeTaskCount: 2,
    availability: 'available',
    email: 'robert.chen@publisher.com',
  },
];

export function TWGTaskAssignmentPage({
  manuscript,
  reviews,
  endorsementData,
  onBack,
  onSubmitAssignment,
}: TWGTaskAssignmentPageProps) {
  const [showConfirmModal, setShowConfirmModal] = useState(false);
  const [expandedSections, setExpandedSections] = useState({
    summary: true,
    endorsement: true,
    assignment: true,
    workload: true,
    timeline: true,
    instructions: false,
    workflow: false,
    alerts: true,
    activity: false,
  });

  // Default task structure
  const defaultTasks: TWGTaskAssignment[] = [
    {
      taskName: 'Copyediting & Plagiarism Check',
      role: 'copyeditor',
      assignedTo: '',
      startDate: new Date(),
      deadline: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
      priority: 'high',
      notes: '',
      status: 'pending',
    },
    {
      taskName: 'Cover Page Design',
      role: 'twg',
      assignedTo: '',
      startDate: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
      deadline: new Date(Date.now() + 14 * 24 * 60 * 60 * 1000),
      priority: 'normal',
      notes: '',
      status: 'pending',
    },
    {
      taskName: 'ISBN Application & Copyright Page',
      role: 'production_coordinator',
      assignedTo: 'twg-m-005',
      startDate: new Date(),
      deadline: new Date(Date.now() + 10 * 24 * 60 * 60 * 1000),
      priority: 'high',
      notes: '',
      status: 'pending',
    },
    {
      taskName: 'Initial & Master Book Layout',
      role: 'twg',
      assignedTo: '',
      startDate: new Date(Date.now() + 14 * 24 * 60 * 60 * 1000),
      deadline: new Date(Date.now() + 21 * 24 * 60 * 60 * 1000),
      priority: 'high',
      notes: '',
      status: 'pending',
    },
    {
      taskName: 'Galley Proof & Final Print',
      role: 'print_coordinator',
      assignedTo: '',
      startDate: new Date(Date.now() + 21 * 24 * 60 * 60 * 1000),
      deadline: new Date(Date.now() + 28 * 24 * 60 * 60 * 1000),
      priority: 'normal',
      notes: '',
      status: 'pending',
    },
    {
      taskName: 'Sorting, Inventory & Distribution',
      role: 'distribution',
      assignedTo: '',
      startDate: new Date(Date.now() + 28 * 24 * 60 * 60 * 1000),
      deadline: new Date(Date.now() + 35 * 24 * 60 * 60 * 1000),
      priority: 'normal',
      notes: '',
      status: 'pending',
    },
  ];

  const [tasks, setTasks] = useState<TWGTaskAssignment[]>(defaultTasks);
  const [generalInstructions, setGeneralInstructions] = useState('');
  const [specialHandlingInstructions, setSpecialHandlingInstructions] = useState('');
  const [confidentialNotes, setConfidentialNotes] = useState('');
  const [productionDeadline, setProductionDeadline] = useState(
    new Date(Date.now() + 35 * 24 * 60 * 60 * 1000)
  );

  // Auto-save functionality
  useEffect(() => {
    const autoSaveInterval = setInterval(() => {
      const draftData = {
        tasks,
        generalInstructions,
        specialHandlingInstructions,
        confidentialNotes,
        productionDeadline,
      };
      localStorage.setItem(`twg-assignment-draft-${manuscript.id}`, JSON.stringify(draftData));
    }, 30000);

    return () => clearInterval(autoSaveInterval);
  }, [tasks, generalInstructions, specialHandlingInstructions, confidentialNotes, productionDeadline, manuscript.id]);

  const toggleSection = (section: keyof typeof expandedSections) => {
    setExpandedSections((prev) => ({ ...prev, [section]: !prev[section] }));
  };

  const getRoleBadgeColor = (role: string) => {
    const colors: Record<string, string> = {
      copyeditor: 'bg-blue-100 text-blue-800 border-blue-300',
      twg: 'bg-purple-100 text-purple-800 border-purple-300',
      production_coordinator: 'bg-green-100 text-green-800 border-green-300',
      print_coordinator: 'bg-orange-100 text-orange-800 border-orange-300',
      distribution: 'bg-teal-100 text-teal-800 border-teal-300',
    };
    return colors[role] || 'bg-gray-100 text-gray-800 border-gray-300';
  };

  const getRoleLabel = (role: string) => {
    const labels: Record<string, string> = {
      copyeditor: 'TWG Copyeditor',
      twg: 'TWG',
      production_coordinator: 'TWG Production Coordinator',
      print_coordinator: 'TWG Print Coordinator',
      distribution: 'TWG Distribution',
    };
    return labels[role] || role;
  };

  const getAvailabilityColor = (availability: string) => {
    const colors: Record<string, string> = {
      available: 'bg-green-100 text-green-800',
      busy: 'bg-amber-100 text-amber-800',
      overloaded: 'bg-red-100 text-red-800',
    };
    return colors[availability] || 'bg-gray-100 text-gray-800';
  };

  const getPriorityColor = (priority: string) => {
    const colors: Record<string, string> = {
      low: 'bg-gray-100 text-gray-700',
      normal: 'bg-blue-100 text-blue-700',
      high: 'bg-red-100 text-red-700',
    };
    return colors[priority] || 'bg-gray-100 text-gray-700';
  };

  const getDeadlineWarning = (deadline: Date) => {
    const now = new Date();
    const daysUntil = Math.ceil((deadline.getTime() - now.getTime()) / (1000 * 60 * 60 * 24));
    if (daysUntil < 0) return 'text-red-600 font-semibold';
    if (daysUntil <= 3) return 'text-amber-600 font-medium';
    return 'text-gray-700';
  };

  const updateTask = (index: number, field: keyof TWGTaskAssignment, value: any) => {
    const updatedTasks = [...tasks];
    updatedTasks[index] = { ...updatedTasks[index], [field]: value };
    setTasks(updatedTasks);
  };

  const getMembersByRole = (role: string) => {
    return mockTWGMembers.filter((m) => m.role === role);
  };

  const unassignedTasks = tasks.filter((t) => !t.assignedTo);
  const assignedTasks = tasks.filter((t) => t.assignedTo);

  const handleAssignAndNotify = () => {
    setShowConfirmModal(true);
  };

  const confirmAssignment = () => {
    const assignmentData: TWGAssignmentData = {
      tasks,
      generalInstructions,
      specialHandlingInstructions,
      confidentialNotes,
      productionDeadline,
    };
    onSubmitAssignment(assignmentData);
    setShowConfirmModal(false);
  };

  const handleSaveDraft = () => {
    const draftData = {
      tasks,
      generalInstructions,
      specialHandlingInstructions,
      confidentialNotes,
      productionDeadline,
    };
    localStorage.setItem(`twg-assignment-draft-${manuscript.id}`, JSON.stringify(draftData));
    alert('Draft saved successfully');
  };

  return (
    <div className="min-h-screen bg-[#F7F8FA]">
      {/* Header */}
      <div className="bg-[#0F2D5E] text-white py-6 px-8 shadow-lg">
        <div className="max-w-[1400px] mx-auto">
          <div className="flex items-center justify-between mb-4">
            <button
              onClick={onBack}
              className="flex items-center gap-2 text-gray-300 hover:text-white transition-colors"
            >
              <ArrowLeft className="w-5 h-5" />
              <span className="text-sm font-medium">Back to Dashboard</span>
            </button>
            <div className="flex items-center gap-3">
              <span className="px-3 py-1 bg-blue-600 text-white text-xs font-medium rounded-full">
                Awaiting Task Assignment
              </span>
            </div>
          </div>
          <div className="flex items-start justify-between">
            <div>
              <h1 className="text-3xl font-bold mb-2">Task Assignment – TWG Coordinator</h1>
              <p className="text-gray-300 text-sm">
                Assign production tasks to TWG members and set deadlines
              </p>
            </div>
            <div className="text-right">
              <p className="text-sm text-gray-400">Manuscript ID</p>
              <p className="text-lg font-mono font-semibold">{manuscript.id}</p>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-[1400px] mx-auto px-8 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* LEFT COLUMN - Main Content */}
          <div className="lg:col-span-2 space-y-6">
            {/* Manuscript Summary Card */}
            <div className="bg-white rounded-sm border-2 border-[#1a1f2e] shadow-md">
              <button
                onClick={() => toggleSection('summary')}
                className="w-full flex items-center justify-between p-5 hover:bg-gray-50 transition-colors"
              >
                <h2 className="text-lg font-bold text-[#0F2D5E]">Manuscript Summary</h2>
                {expandedSections.summary ? (
                  <ChevronUp className="w-5 h-5 text-gray-600" />
                ) : (
                  <ChevronDown className="w-5 h-5 text-gray-600" />
                )}
              </button>
              {expandedSections.summary && (
                <div className="px-5 pb-5 border-t border-gray-200">
                  <div className="grid grid-cols-2 gap-4 mt-4">
                    <div>
                      <p className="text-xs font-semibold text-gray-500 mb-1">TITLE</p>
                      <p className="text-sm font-medium text-gray-900">{manuscript.title}</p>
                    </div>
                    <div>
                      <p className="text-xs font-semibold text-gray-500 mb-1">AUTHORS</p>
                      <p className="text-sm text-gray-900">{manuscript.authorName}</p>
                    </div>
                    <div>
                      <p className="text-xs font-semibold text-gray-500 mb-1">CATEGORY</p>
                      <p className="text-sm text-gray-900">{manuscript.category}</p>
                    </div>
                    <div>
                      <p className="text-xs font-semibold text-gray-500 mb-1">VERSION</p>
                      <p className="text-sm text-gray-900">v{manuscript.files.length}</p>
                    </div>
                    <div>
                      <p className="text-xs font-semibold text-gray-500 mb-1">SUBMISSION DATE</p>
                      <p className="text-sm text-gray-900">
                        {manuscript.submittedAt.toLocaleDateString()}
                      </p>
                    </div>
                    <div>
                      <p className="text-xs font-semibold text-gray-500 mb-1">ENDORSED BY</p>
                      <p className="text-sm text-gray-900">
                        {endorsementData?.endorsedBy || 'Dr. Sarah Johnson'}
                      </p>
                    </div>
                    <div className="col-span-2">
                      <p className="text-xs font-semibold text-gray-500 mb-1">ABSTRACT</p>
                      <p className="text-sm text-gray-700 leading-relaxed">
                        {manuscript.abstract.substring(0, 200)}...
                      </p>
                    </div>
                    <div className="col-span-2">
                      <p className="text-xs font-semibold text-gray-500 mb-2">WORKFLOW STAGE</p>
                      <span className="px-3 py-1 bg-purple-100 text-purple-800 text-xs font-medium rounded-full">
                        TWG Task Assignment
                      </span>
                    </div>
                  </div>
                  <div className="flex items-center gap-3 mt-4 pt-4 border-t border-gray-200">
                    <button className="flex items-center gap-2 px-4 py-2 bg-[#0F2D5E] text-white rounded hover:bg-[#1A4A8A] transition-colors text-sm">
                      <Eye className="w-4 h-4" />
                      View Manuscript
                    </button>
                    <button className="flex items-center gap-2 px-4 py-2 border border-gray-300 rounded hover:bg-gray-50 transition-colors text-sm text-gray-700">
                      <Download className="w-4 h-4" />
                      Download Files
                    </button>
                    <button className="flex items-center gap-2 px-4 py-2 border border-gray-300 rounded hover:bg-gray-50 transition-colors text-sm text-gray-700">
                      <FileText className="w-4 h-4" />
                      View Editorial Notes
                    </button>
                  </div>
                </div>
              )}
            </div>

            {/* Endorsement Details Panel */}
            <div className="bg-white rounded-sm border-2 border-[#1a1f2e] shadow-md">
              <button
                onClick={() => toggleSection('endorsement')}
                className="w-full flex items-center justify-between p-5 hover:bg-gray-50 transition-colors"
              >
                <h2 className="text-lg font-bold text-[#0F2D5E]">Endorsement Details</h2>
                {expandedSections.endorsement ? (
                  <ChevronUp className="w-5 h-5 text-gray-600" />
                ) : (
                  <ChevronDown className="w-5 h-5 text-gray-600" />
                )}
              </button>
              {expandedSections.endorsement && (
                <div className="px-5 pb-5 border-t border-gray-200">
                  <div className="space-y-4 mt-4">
                    <div className="p-4 bg-green-50 rounded border border-green-200">
                      <div className="flex items-start gap-3">
                        <CheckCircle className="w-5 h-5 text-green-600 flex-shrink-0 mt-0.5" />
                        <div className="flex-1">
                          <p className="text-sm font-semibold text-gray-900 mb-1">
                            Endorsement Decision
                          </p>
                          <p className="text-sm text-gray-700">
                            {endorsementData?.decision || 'Endorsed to TWG for Production'}
                          </p>
                        </div>
                      </div>
                    </div>

                    <div className="p-4 bg-gray-50 rounded border border-gray-200">
                      <p className="text-xs font-semibold text-gray-500 mb-2">
                        EDITORIAL JUSTIFICATION
                      </p>
                      <p className="text-sm text-gray-700 leading-relaxed">
                        {endorsementData?.justification ||
                          'Manuscript has successfully completed all peer review and editorial evaluation stages. Technical quality is excellent and publication readiness criteria are met. Recommended for production workflow.'}
                      </p>
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                      <div className="p-4 bg-green-50 rounded border border-green-200">
                        <div className="flex items-center gap-2 mb-2">
                          <CheckCircle className="w-4 h-4 text-green-600" />
                          <p className="text-xs font-semibold text-gray-700">
                            PUBLICATION READINESS
                          </p>
                        </div>
                        <p className="text-sm text-gray-700">All criteria met</p>
                      </div>
                      <div className="p-4 bg-green-50 rounded border border-green-200">
                        <div className="flex items-center gap-2 mb-2">
                          <CheckCircle className="w-4 h-4 text-green-600" />
                          <p className="text-xs font-semibold text-gray-700">REVISION COMPLIANCE</p>
                        </div>
                        <p className="text-sm text-gray-700">Fully compliant</p>
                      </div>
                    </div>

                    <div className="p-4 bg-yellow-50 rounded border border-yellow-200">
                      <div className="flex items-start gap-3">
                        <AlertCircle className="w-5 h-5 text-yellow-600 flex-shrink-0 mt-0.5" />
                        <div className="flex-1">
                          <p className="text-sm font-semibold text-gray-900 mb-1">
                            Technical Concerns
                          </p>
                          <p className="text-sm text-gray-700">
                            {endorsementData?.technicalConcerns ||
                              'Minor formatting adjustments needed during copyediting phase. Ensure figure quality meets print standards.'}
                          </p>
                        </div>
                      </div>
                    </div>

                    <div className="text-xs text-gray-500">
                      Endorsed on{' '}
                      {endorsementData?.timestamp?.toLocaleString() || new Date().toLocaleString()}
                    </div>
                  </div>
                </div>
              )}
            </div>

            {/* Task Assignment Table Panel */}
            <div className="bg-white rounded-sm border-2 border-[#1a1f2e] shadow-md">
              <button
                onClick={() => toggleSection('assignment')}
                className="w-full flex items-center justify-between p-5 hover:bg-gray-50 transition-colors"
              >
                <h2 className="text-lg font-bold text-[#0F2D5E]">Assign Tasks to TWG Members</h2>
                {expandedSections.assignment ? (
                  <ChevronUp className="w-5 h-5 text-gray-600" />
                ) : (
                  <ChevronDown className="w-5 h-5 text-gray-600" />
                )}
              </button>
              {expandedSections.assignment && (
                <div className="px-5 pb-5 border-t border-gray-200">
                  <div className="overflow-x-auto mt-4">
                    <table className="w-full text-sm">
                      <thead className="bg-gray-50 border-b border-gray-200">
                        <tr>
                          <th className="px-3 py-3 text-left text-xs font-semibold text-gray-700">
                            TASK NAME
                          </th>
                          <th className="px-3 py-3 text-left text-xs font-semibold text-gray-700">
                            ROLE
                          </th>
                          <th className="px-3 py-3 text-left text-xs font-semibold text-gray-700">
                            ASSIGN TO
                          </th>
                          <th className="px-3 py-3 text-left text-xs font-semibold text-gray-700">
                            START DATE
                          </th>
                          <th className="px-3 py-3 text-left text-xs font-semibold text-gray-700">
                            DEADLINE
                          </th>
                          <th className="px-3 py-3 text-left text-xs font-semibold text-gray-700">
                            PRIORITY
                          </th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-gray-200">
                        {tasks.map((task, index) => (
                          <tr key={index} className="hover:bg-gray-50">
                            <td className="px-3 py-4">
                              <p className="font-medium text-gray-900">{task.taskName}</p>
                            </td>
                            <td className="px-3 py-4">
                              <span
                                className={`px-3 py-1 text-xs font-medium rounded-full border ${getRoleBadgeColor(
                                  task.role
                                )}`}
                              >
                                {getRoleLabel(task.role)}
                              </span>
                            </td>
                            <td className="px-3 py-4">
                              <select
                                value={task.assignedTo}
                                onChange={(e) => updateTask(index, 'assignedTo', e.target.value)}
                                className="w-full px-3 py-2 border border-gray-300 rounded text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                              >
                                <option value="">Select member...</option>
                                {getMembersByRole(task.role).map((member) => (
                                  <option key={member.id} value={member.id}>
                                    {member.name} ({member.activeTaskCount} active)
                                  </option>
                                ))}
                              </select>
                            </td>
                            <td className="px-3 py-4">
                              <input
                                type="date"
                                value={task.startDate.toISOString().split('T')[0]}
                                onChange={(e) =>
                                  updateTask(index, 'startDate', new Date(e.target.value))
                                }
                                className="px-3 py-2 border border-gray-300 rounded text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                              />
                            </td>
                            <td className="px-3 py-4">
                              <input
                                type="date"
                                value={task.deadline.toISOString().split('T')[0]}
                                onChange={(e) =>
                                  updateTask(index, 'deadline', new Date(e.target.value))
                                }
                                className={`px-3 py-2 border border-gray-300 rounded text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 ${getDeadlineWarning(
                                  task.deadline
                                )}`}
                              />
                            </td>
                            <td className="px-3 py-4">
                              <select
                                value={task.priority}
                                onChange={(e) =>
                                  updateTask(
                                    index,
                                    'priority',
                                    e.target.value as 'low' | 'normal' | 'high'
                                  )
                                }
                                className="px-3 py-2 border border-gray-300 rounded text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                              >
                                <option value="low">Low</option>
                                <option value="normal">Normal</option>
                                <option value="high">High</option>
                              </select>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>

                  {/* Task Notes Section */}
                  <div className="mt-4 space-y-3">
                    {tasks.map((task, index) => (
                      <div key={index} className="p-3 bg-gray-50 rounded border border-gray-200">
                        <p className="text-xs font-semibold text-gray-700 mb-2">
                          NOTES FOR: {task.taskName}
                        </p>
                        <input
                          type="text"
                          value={task.notes}
                          onChange={(e) => updateTask(index, 'notes', e.target.value)}
                          placeholder="Add specific instructions or notes for this task..."
                          className="w-full px-3 py-2 border border-gray-300 rounded text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                        />
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>

            {/* TWG Member Workload Panel */}
            <div className="bg-white rounded-sm border-2 border-[#1a1f2e] shadow-md">
              <button
                onClick={() => toggleSection('workload')}
                className="w-full flex items-center justify-between p-5 hover:bg-gray-50 transition-colors"
              >
                <h2 className="text-lg font-bold text-[#0F2D5E]">TWG Member Workload Overview</h2>
                {expandedSections.workload ? (
                  <ChevronUp className="w-5 h-5 text-gray-600" />
                ) : (
                  <ChevronDown className="w-5 h-5 text-gray-600" />
                )}
              </button>
              {expandedSections.workload && (
                <div className="px-5 pb-5 border-t border-gray-200">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
                    {mockTWGMembers.map((member) => (
                      <div
                        key={member.id}
                        className="p-4 bg-gray-50 rounded border border-gray-200 hover:shadow-md transition-shadow"
                      >
                        <div className="flex items-start justify-between mb-3">
                          <div className="flex items-center gap-3">
                            <div className="w-10 h-10 rounded-full bg-gradient-to-br from-blue-500 to-purple-600 text-white flex items-center justify-center text-sm font-semibold">
                              {member.name.charAt(0)}
                            </div>
                            <div>
                              <p className="font-semibold text-gray-900">{member.name}</p>
                              <span
                                className={`text-xs px-2 py-1 rounded-full border ${getRoleBadgeColor(
                                  member.role
                                )}`}
                              >
                                {getRoleLabel(member.role)}
                              </span>
                            </div>
                          </div>
                          <span
                            className={`px-2 py-1 text-xs font-medium rounded-full ${getAvailabilityColor(
                              member.availability
                            )}`}
                          >
                            {member.availability.charAt(0).toUpperCase() +
                              member.availability.slice(1)}
                          </span>
                        </div>
                        <div className="space-y-2">
                          <div className="flex items-center justify-between text-sm">
                            <span className="text-gray-600">Active Tasks</span>
                            <span className="font-semibold text-gray-900">
                              {member.activeTaskCount}
                            </span>
                          </div>
                          <div className="w-full bg-gray-200 rounded-full h-2">
                            <div
                              className={`h-2 rounded-full ${
                                member.availability === 'available'
                                  ? 'bg-green-500'
                                  : member.availability === 'busy'
                                  ? 'bg-amber-500'
                                  : 'bg-red-500'
                              }`}
                              style={{
                                width: `${Math.min((member.activeTaskCount / 5) * 100, 100)}%`,
                              }}
                            ></div>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>

            {/* Production Timeline Panel */}
            <div className="bg-white rounded-sm border-2 border-[#1a1f2e] shadow-md">
              <button
                onClick={() => toggleSection('timeline')}
                className="w-full flex items-center justify-between p-5 hover:bg-gray-50 transition-colors"
              >
                <h2 className="text-lg font-bold text-[#0F2D5E]">Production Timeline</h2>
                {expandedSections.timeline ? (
                  <ChevronUp className="w-5 h-5 text-gray-600" />
                ) : (
                  <ChevronDown className="w-5 h-5 text-gray-600" />
                )}
              </button>
              {expandedSections.timeline && (
                <div className="px-5 pb-5 border-t border-gray-200">
                  <div className="mt-4 space-y-4">
                    <div className="flex items-center justify-between p-4 bg-blue-50 rounded border border-blue-200">
                      <div>
                        <p className="text-sm font-semibold text-gray-900">
                          Overall Production Deadline
                        </p>
                        <p className="text-xs text-gray-600 mt-1">
                          Recommended completion date for all tasks
                        </p>
                      </div>
                      <div className="text-right">
                        <p className="text-lg font-bold text-blue-900">
                          {productionDeadline.toLocaleDateString()}
                        </p>
                        <span className="px-2 py-1 bg-green-100 text-green-800 text-xs font-medium rounded">
                          On Schedule
                        </span>
                      </div>
                    </div>

                    <div className="grid grid-cols-3 gap-3">
                      {tasks.map((task, index) => (
                        <div
                          key={index}
                          className="p-3 bg-gray-50 rounded border border-gray-200"
                        >
                          <p className="text-xs font-semibold text-gray-700 mb-2">
                            {task.taskName}
                          </p>
                          <div className="flex items-center gap-2 text-xs text-gray-600 mb-1">
                            <Calendar className="w-3 h-3" />
                            <span>
                              {task.startDate.toLocaleDateString()} →{' '}
                              {task.deadline.toLocaleDateString()}
                            </span>
                          </div>
                          <span className={`text-xs px-2 py-1 rounded ${getPriorityColor(task.priority)}`}>
                            {task.priority.charAt(0).toUpperCase() + task.priority.slice(1)} Priority
                          </span>
                        </div>
                      ))}
                    </div>

                    <div className="p-4 bg-gray-50 rounded border border-gray-200">
                      <div className="flex items-center justify-between mb-2">
                        <p className="text-sm font-semibold text-gray-900">
                          Total Estimated Duration
                        </p>
                        <p className="text-lg font-bold text-gray-900">35 days</p>
                      </div>
                      <div className="w-full bg-gray-200 rounded-full h-3">
                        <div
                          className="bg-gradient-to-r from-blue-500 to-blue-600 h-3 rounded-full"
                          style={{ width: '0%' }}
                        ></div>
                      </div>
                      <p className="text-xs text-gray-600 mt-2">Not started</p>
                    </div>
                  </div>
                </div>
              )}
            </div>

            {/* TWG Coordinator Instructions Panel */}
            <div className="bg-white rounded-sm border-2 border-[#1a1f2e] shadow-md">
              <button
                onClick={() => toggleSection('instructions')}
                className="w-full flex items-center justify-between p-5 hover:bg-gray-50 transition-colors"
              >
                <h2 className="text-lg font-bold text-[#0F2D5E]">
                  TWG Coordinator Instructions
                </h2>
                {expandedSections.instructions ? (
                  <ChevronUp className="w-5 h-5 text-gray-600" />
                ) : (
                  <ChevronDown className="w-5 h-5 text-gray-600" />
                )}
              </button>
              {expandedSections.instructions && (
                <div className="px-5 pb-5 border-t border-gray-200">
                  <div className="space-y-4 mt-4">
                    <div>
                      <label className="block text-xs font-semibold text-gray-700 mb-2">
                        GENERAL INSTRUCTIONS
                      </label>
                      <textarea
                        value={generalInstructions}
                        onChange={(e) => setGeneralInstructions(e.target.value)}
                        placeholder="Add general instructions or notes for the TWG team..."
                        rows={4}
                        className="w-full px-4 py-3 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-semibold text-gray-700 mb-2">
                        SPECIAL HANDLING INSTRUCTIONS
                      </label>
                      <textarea
                        value={specialHandlingInstructions}
                        onChange={(e) => setSpecialHandlingInstructions(e.target.value)}
                        placeholder="Note any special handling requirements..."
                        rows={3}
                        className="w-full px-4 py-3 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-semibold text-gray-700 mb-2">
                        CONFIDENTIAL COORDINATOR NOTES
                      </label>
                      <textarea
                        value={confidentialNotes}
                        onChange={(e) => setConfidentialNotes(e.target.value)}
                        placeholder="Internal notes (not shared with team members)..."
                        rows={3}
                        className="w-full px-4 py-3 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm bg-amber-50"
                      />
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* RIGHT COLUMN - Sidebar */}
          <div className="space-y-6">
            {/* Workflow Status Panel */}
            <div className="bg-white rounded-sm border-2 border-[#1a1f2e] shadow-md">
              <div className="p-5">
                <h3 className="text-sm font-bold text-[#0F2D5E] mb-4">Workflow Status</h3>
                <div className="space-y-3">
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-full bg-purple-600 text-white flex items-center justify-center text-xs font-semibold">
                      8
                    </div>
                    <div className="flex-1">
                      <p className="text-xs font-semibold text-gray-900">Current Stage</p>
                      <p className="text-xs text-gray-600">TWG Task Assignment</p>
                    </div>
                  </div>
                  <div className="w-full h-px bg-gray-300"></div>
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-full bg-gray-200 text-gray-600 flex items-center justify-center text-xs font-semibold">
                      9
                    </div>
                    <div className="flex-1">
                      <p className="text-xs font-semibold text-gray-900">Next Stage</p>
                      <p className="text-xs text-gray-600">Production Workflow</p>
                    </div>
                  </div>
                </div>

                <div className="mt-4 pt-4 border-t border-gray-200">
                  <p className="text-xs font-semibold text-gray-700 mb-2">WORKFLOW PROGRESSION</p>
                  <div className="space-y-2">
                    {[
                      { stage: 'Submission', status: 'completed' },
                      { stage: 'Review', status: 'completed' },
                      { stage: 'Revision', status: 'completed' },
                      { stage: 'Editorial Recommendation', status: 'completed' },
                      { stage: 'TWG Endorsement', status: 'completed' },
                      { stage: 'Task Assignment', status: 'current' },
                      { stage: 'Production', status: 'pending' },
                    ].map((item, index) => (
                      <div key={index} className="flex items-center gap-2">
                        {item.status === 'completed' ? (
                          <CheckCircle className="w-4 h-4 text-green-600" />
                        ) : item.status === 'current' ? (
                          <Target className="w-4 h-4 text-purple-600" />
                        ) : (
                          <div className="w-4 h-4 rounded-full border-2 border-gray-300"></div>
                        )}
                        <span
                          className={`text-xs ${
                            item.status === 'current'
                              ? 'font-semibold text-purple-900'
                              : item.status === 'completed'
                              ? 'text-gray-600'
                              : 'text-gray-400'
                          }`}
                        >
                          {item.stage}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="mt-4 pt-4 border-t border-gray-200">
                  <div className="flex items-center justify-between text-xs">
                    <span className="text-gray-600">Assignment Deadline</span>
                    <span className="font-semibold text-gray-900">
                      {new Date(Date.now() + 2 * 24 * 60 * 60 * 1000).toLocaleDateString()}
                    </span>
                  </div>
                  <div className="flex items-center justify-between text-xs mt-2">
                    <span className="text-gray-600">Delay Risk</span>
                    <span className="px-2 py-1 bg-green-100 text-green-800 font-medium rounded">
                      Low
                    </span>
                  </div>
                </div>
              </div>
            </div>

            {/* Alerts & Notifications Panel */}
            <div className="bg-white rounded-sm border-2 border-[#1a1f2e] shadow-md">
              <div className="p-5">
                <h3 className="text-sm font-bold text-[#0F2D5E] mb-4">Alerts & Notifications</h3>
                <div className="space-y-3">
                  {unassignedTasks.length > 0 && (
                    <div className="p-3 bg-amber-50 rounded border-l-4 border-amber-500">
                      <div className="flex items-start gap-2">
                        <AlertTriangle className="w-4 h-4 text-amber-600 flex-shrink-0 mt-0.5" />
                        <div>
                          <p className="text-xs font-semibold text-gray-900">
                            Unassigned Tasks
                          </p>
                          <p className="text-xs text-gray-600 mt-1">
                            {unassignedTasks.length} {unassignedTasks.length === 1 ? 'task' : 'tasks'}{' '}
                            still need to be assigned
                          </p>
                        </div>
                      </div>
                    </div>
                  )}

                  {assignedTasks.length > 0 && (
                    <div className="p-3 bg-green-50 rounded border-l-4 border-green-500">
                      <div className="flex items-start gap-2">
                        <CheckCircle className="w-4 h-4 text-green-600 flex-shrink-0 mt-0.5" />
                        <div>
                          <p className="text-xs font-semibold text-gray-900">
                            Tasks Assigned
                          </p>
                          <p className="text-xs text-gray-600 mt-1">
                            {assignedTasks.length} {assignedTasks.length === 1 ? 'task has' : 'tasks have'}{' '}
                            been assigned
                          </p>
                        </div>
                      </div>
                    </div>
                  )}

                  {mockTWGMembers.filter((m) => m.availability === 'overloaded').length > 0 && (
                    <div className="p-3 bg-red-50 rounded border-l-4 border-red-500">
                      <div className="flex items-start gap-2">
                        <Users className="w-4 h-4 text-red-600 flex-shrink-0 mt-0.5" />
                        <div>
                          <p className="text-xs font-semibold text-gray-900">
                            Overloaded Members
                          </p>
                          <p className="text-xs text-gray-600 mt-1">
                            {mockTWGMembers.filter((m) => m.availability === 'overloaded').length}{' '}
                            members are currently overloaded
                          </p>
                        </div>
                      </div>
                    </div>
                  )}

                  {unassignedTasks.length === 0 && assignedTasks.length === tasks.length && (
                    <div className="p-3 bg-blue-50 rounded border-l-4 border-blue-500">
                      <div className="flex items-start gap-2">
                        <CheckCircle className="w-4 h-4 text-blue-600 flex-shrink-0 mt-0.5" />
                        <div>
                          <p className="text-xs font-semibold text-gray-900">
                            Ready to Notify
                          </p>
                          <p className="text-xs text-gray-600 mt-1">
                            All tasks assigned. Ready to notify team members.
                          </p>
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </div>

            {/* Activity Log Panel */}
            <div className="bg-white rounded-sm border-2 border-[#1a1f2e] shadow-md">
              <button
                onClick={() => toggleSection('activity')}
                className="w-full flex items-center justify-between p-5 hover:bg-gray-50 transition-colors"
              >
                <h3 className="text-sm font-bold text-[#0F2D5E]">Activity Log</h3>
                {expandedSections.activity ? (
                  <ChevronUp className="w-4 h-4 text-gray-600" />
                ) : (
                  <ChevronDown className="w-4 h-4 text-gray-600" />
                )}
              </button>
              {expandedSections.activity && (
                <div className="px-5 pb-5 border-t border-gray-200">
                  <div className="space-y-3 mt-4">
                    <div className="flex items-start gap-3">
                      <div className="w-2 h-2 rounded-full bg-green-500 mt-1.5"></div>
                      <div className="flex-1">
                        <p className="text-xs font-medium text-gray-900">Endorsement Received</p>
                        <p className="text-xs text-gray-600">
                          {new Date().toLocaleString()}
                        </p>
                      </div>
                    </div>
                    <div className="flex items-start gap-3">
                      <div className="w-2 h-2 rounded-full bg-blue-500 mt-1.5"></div>
                      <div className="flex-1">
                        <p className="text-xs font-medium text-gray-900">Task Assignment Started</p>
                        <p className="text-xs text-gray-600">
                          {new Date().toLocaleString()}
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Bottom Action Bar */}
      <div className="fixed bottom-0 left-0 right-0 bg-white border-t-2 border-[#1a1f2e] shadow-2xl z-50">
        <div className="max-w-[1400px] mx-auto px-8 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <div className="flex items-center gap-2 text-sm text-gray-600">
                <Clock className="w-4 h-4" />
                <span>Last saved: {new Date().toLocaleTimeString()}</span>
              </div>
              <span className="text-sm text-gray-400">•</span>
              <div className="text-sm text-gray-600">
                {assignedTasks.length} of {tasks.length} tasks assigned
              </div>
            </div>
            <div className="flex items-center gap-3">
              <button
                onClick={onBack}
                className="flex items-center gap-2 px-5 py-2.5 border border-gray-300 rounded hover:bg-gray-50 transition-colors text-sm font-medium text-gray-700"
              >
                <X className="w-4 h-4" />
                Cancel
              </button>
              <button
                onClick={handleSaveDraft}
                className="flex items-center gap-2 px-5 py-2.5 border border-gray-300 rounded hover:bg-gray-50 transition-colors text-sm font-medium text-gray-700"
              >
                <Save className="w-4 h-4" />
                Save Draft
              </button>
              <button className="flex items-center gap-2 px-5 py-2.5 border border-gray-300 rounded hover:bg-gray-50 transition-colors text-sm font-medium text-gray-700">
                <Eye className="w-4 h-4" />
                Preview Assignment
              </button>
              <button
                onClick={handleAssignAndNotify}
                disabled={unassignedTasks.length > 0}
                className={`flex items-center gap-2 px-6 py-2.5 rounded text-sm font-medium transition-colors ${
                  unassignedTasks.length > 0
                    ? 'bg-gray-300 text-gray-500 cursor-not-allowed'
                    : 'bg-[#0F2D5E] text-white hover:bg-[#1A4A8A]'
                }`}
              >
                <Send className="w-4 h-4" />
                Assign & Notify All
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Confirmation Modal */}
      {showConfirmModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <div className="p-6 border-b border-gray-200">
              <h2 className="text-2xl font-bold text-[#0F2D5E]">Confirm Task Assignment</h2>
              <p className="text-sm text-gray-600 mt-2">
                Review the task assignments before notifying team members
              </p>
            </div>

            <div className="p-6 space-y-4">
              <div className="p-4 bg-amber-50 rounded border border-amber-200">
                <div className="flex items-start gap-3">
                  <AlertCircle className="w-5 h-5 text-amber-600 flex-shrink-0 mt-0.5" />
                  <p className="text-sm text-gray-700">
                    All assigned members will be notified immediately via email with their task
                    details and deadlines.
                  </p>
                </div>
              </div>

              <div>
                <h3 className="text-sm font-bold text-gray-900 mb-3">Assigned Tasks Summary:</h3>
                <div className="space-y-3">
                  {tasks
                    .filter((t) => t.assignedTo)
                    .map((task, index) => {
                      const assignedMember = mockTWGMembers.find((m) => m.id === task.assignedTo);
                      return (
                        <div
                          key={index}
                          className="p-4 bg-gray-50 rounded border border-gray-200"
                        >
                          <div className="flex items-start justify-between mb-2">
                            <p className="font-semibold text-gray-900 text-sm">{task.taskName}</p>
                            <span className={`px-2 py-1 text-xs rounded ${getPriorityColor(task.priority)}`}>
                              {task.priority.charAt(0).toUpperCase() + task.priority.slice(1)}
                            </span>
                          </div>
                          <div className="grid grid-cols-2 gap-2 text-xs">
                            <div>
                              <span className="text-gray-600">Assigned to:</span>
                              <p className="font-medium text-gray-900">
                                {assignedMember?.name || 'Unknown'}
                              </p>
                            </div>
                            <div>
                              <span className="text-gray-600">Deadline:</span>
                              <p className="font-medium text-gray-900">
                                {task.deadline.toLocaleDateString()}
                              </p>
                            </div>
                          </div>
                        </div>
                      );
                    })}
                </div>
              </div>

              <div className="pt-4 border-t border-gray-200">
                <p className="text-sm text-gray-700">
                  <span className="font-semibold">Total tasks to assign:</span>{' '}
                  {assignedTasks.length}
                </p>
                <p className="text-sm text-gray-700 mt-1">
                  <span className="font-semibold">Team members to notify:</span>{' '}
                  {new Set(tasks.filter((t) => t.assignedTo).map((t) => t.assignedTo)).size}
                </p>
              </div>
            </div>

            <div className="p-6 border-t border-gray-200 flex items-center justify-end gap-3">
              <button
                onClick={() => setShowConfirmModal(false)}
                className="px-5 py-2.5 border border-gray-300 rounded hover:bg-gray-50 transition-colors text-sm font-medium text-gray-700"
              >
                Cancel
              </button>
              <button
                onClick={confirmAssignment}
                className="flex items-center gap-2 px-6 py-2.5 bg-[#0F2D5E] text-white rounded hover:bg-[#1A4A8A] transition-colors text-sm font-medium"
              >
                <Mail className="w-4 h-4" />
                Confirm & Send
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Bottom spacing for fixed action bar */}
      <div className="h-20"></div>
    </div>
  );
}
