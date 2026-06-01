import React from 'react';
import { useData } from '../../context/DataContext';
import { ArrowLeft, Users, Clock, AlertCircle, Activity, TrendingUp } from 'lucide-react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend } from 'recharts';

interface ProductionCapacityDashboardProps {
  onBack?: () => void;
}

export function ProductionCapacityDashboard({ onBack }: ProductionCapacityDashboardProps) {
  const { productionWorkload } = useData();

  const copyeditors = productionWorkload.filter(w => w.role === 'copyeditor');
  const layoutArtists = productionWorkload.filter(w => w.role === 'layout_artist');
  const productionCoords = productionWorkload.filter(w => w.role === 'production_coordinator');

  const getCapacityStatus = (current: number, max: number) => {
    const percent = (current / max) * 100;
    if (percent >= 80) return { status: 'High Load', color: 'red' };
    if (percent >= 60) return { status: 'Moderate', color: 'yellow' };
    return { status: 'Available', color: 'green' };
  };

  const chartData = productionWorkload.map(w => ({
    name: w.userName.split(' ')[0],
    active: w.activeTasks,
    pending: w.pendingTasks,
    capacity: w.maxCapacity,
  }));

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
            <Activity className="w-8 h-8 text-indigo-600" />
            <h1 className="text-3xl font-bold text-gray-900">Production Capacity Dashboard</h1>
          </div>
          <p className="text-gray-600">
            Production workload data used by Timeline Recommender for capacity-aware predictions
          </p>
        </div>

        {/* Summary Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
          <div className="bg-white rounded-lg shadow-md p-6">
            <h2 className="text-lg font-semibold text-gray-900 mb-4">Copyeditor Metrics</h2>
            <div className="space-y-3">
              <div className="flex justify-between"><span className="text-gray-600">Active Tasks:</span><span className="font-semibold">{copyeditors.reduce((s, c) => s + c.activeTasks, 0)}</span></div>
              <div className="flex justify-between"><span className="text-gray-600">Pending Tasks:</span><span className="font-semibold">{copyeditors.reduce((s, c) => s + c.pendingTasks, 0)}</span></div>
              <div className="flex justify-between"><span className="text-gray-600">Avg Completion:</span><span className="font-semibold">{Math.round(copyeditors.reduce((s, c) => s + c.averageCompletionDays, 0) / copyeditors.length)}d</span></div>
              <div className="flex justify-between"><span className="text-gray-600">Total Capacity:</span><span className="font-semibold">{copyeditors.reduce((s, c) => s + c.currentCapacity, 0)} / {copyeditors.reduce((s, c) => s + c.maxCapacity, 0)}</span></div>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow-md p-6">
            <h2 className="text-lg font-semibold text-gray-900 mb-4">Layout Artist Metrics</h2>
            <div className="space-y-3">
              <div className="flex justify-between"><span className="text-gray-600">Active Projects:</span><span className="font-semibold">{layoutArtists.reduce((s, l) => s + l.activeTasks, 0)}</span></div>
              <div className="flex justify-between"><span className="text-gray-600">Pending Projects:</span><span className="font-semibold">{layoutArtists.reduce((s, l) => s + l.pendingTasks, 0)}</span></div>
              <div className="flex justify-between"><span className="text-gray-600">Avg Layout Duration:</span><span className="font-semibold">{Math.round(layoutArtists.reduce((s, l) => s + l.averageCompletionDays, 0) / layoutArtists.length)}d</span></div>
              <div className="flex justify-between"><span className="text-gray-600">Total Capacity:</span><span className="font-semibold">{layoutArtists.reduce((s, l) => s + l.currentCapacity, 0)} / {layoutArtists.reduce((s, l) => s + l.maxCapacity, 0)}</span></div>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow-md p-6">
            <h2 className="text-lg font-semibold text-gray-900 mb-4">Production Coordinator</h2>
            <div className="space-y-3">
              <div className="flex justify-between"><span className="text-gray-600">Active Publications:</span><span className="font-semibold">{productionCoords.reduce((s, p) => s + p.activeTasks, 0)}</span></div>
              <div className="flex justify-between"><span className="text-gray-600">Pending Queue:</span><span className="font-semibold">{productionCoords.reduce((s, p) => s + p.pendingTasks, 0)}</span></div>
              <div className="flex justify-between"><span className="text-gray-600">Avg Production:</span><span className="font-semibold">{Math.round(productionCoords.reduce((s, p) => s + p.averageCompletionDays, 0) / productionCoords.length)}d</span></div>
              <div className="flex justify-between"><span className="text-gray-600">Total Capacity:</span><span className="font-semibold">{productionCoords.reduce((s, p) => s + p.currentCapacity, 0)} / {productionCoords.reduce((s, p) => s + p.maxCapacity, 0)}</span></div>
            </div>
          </div>
        </div>

        {/* Workload Chart */}
        <div className="bg-white rounded-lg shadow-md p-6 mb-6">
          <h2 className="text-xl font-semibold text-gray-900 mb-4">Individual Workload Distribution</h2>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={chartData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="name" />
              <YAxis />
              <Tooltip />
              <Legend />
              <Bar dataKey="active" fill="#3b82f6" name="Active Tasks" />
              <Bar dataKey="pending" fill="#8b5cf6" name="Pending Tasks" />
              <Bar dataKey="capacity" fill="#d1d5db" name="Max Capacity" />
            </BarChart>
          </ResponsiveContainer>
        </div>

        {/* Individual Staff */}
        <div className="space-y-4">
          {productionWorkload.map((workload) => {
            const capacity = getCapacityStatus(workload.currentCapacity, workload.maxCapacity);
            const percent = (workload.currentCapacity / workload.maxCapacity) * 100;

            return (
              <div key={workload.id} className="bg-white rounded-lg shadow-md p-6">
                <div className="flex justify-between items-start mb-4">
                  <div>
                    <h3 className="text-xl font-semibold text-gray-900">{workload.userName}</h3>
                    <div className="text-sm text-gray-600 capitalize">{workload.role.replace('_', ' ')}</div>
                  </div>
                  <span className={`px-3 py-1 rounded-full text-xs font-medium ${
                    capacity.color === 'red' ? 'bg-red-100 text-red-800' :
                    capacity.color === 'yellow' ? 'bg-yellow-100 text-yellow-800' :
                    'bg-green-100 text-green-800'
                  }`}>
                    {capacity.status}
                  </span>
                </div>

                <div className="grid grid-cols-3 gap-4 mb-4">
                  <div><div className="text-xs text-gray-600">Active Tasks</div><div className="text-xl font-bold text-blue-600">{workload.activeTasks}</div></div>
                  <div><div className="text-xs text-gray-600">Pending Tasks</div><div className="text-xl font-bold text-purple-600">{workload.pendingTasks}</div></div>
                  <div><div className="text-xs text-gray-600">Avg Completion</div><div className="text-xl font-bold text-gray-900">{workload.averageCompletionDays}d</div></div>
                </div>

                <div>
                  <div className="flex justify-between text-sm mb-2">
                    <span>Capacity: {workload.currentCapacity} / {workload.maxCapacity}</span>
                    <span className="font-medium">{percent.toFixed(0)}%</span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-3">
                    <div className={`h-3 rounded-full ${
                      capacity.color === 'red' ? 'bg-red-500' :
                      capacity.color === 'yellow' ? 'bg-yellow-500' :
                      'bg-green-500'
                    }`} style={{ width: `${Math.min(percent, 100)}%` }} />
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {/* ML Usage */}
        <div className="bg-indigo-50 rounded-lg p-6 mt-6 border border-indigo-200">
          <div className="flex items-center gap-2 mb-3">
            <TrendingUp className="w-5 h-5 text-indigo-600" />
            <h3 className="font-semibold text-gray-900">ML Model Usage</h3>
          </div>
          <div className="space-y-2 text-sm text-gray-700">
            <p>→ <strong>Timeline Recommender</strong> adjusts predictions based on production team capacity</p>
            <p>→ <strong>Risk assessment</strong> flags potential delays when capacity is near maximum</p>
            <p>→ <strong>Resource allocation</strong> optimizes manuscript assignment based on current workload</p>
          </div>
        </div>
      </div>
    </div>
  );
}
