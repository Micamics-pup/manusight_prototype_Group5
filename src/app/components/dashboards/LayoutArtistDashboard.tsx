import React, { useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import { useData } from '../../context/DataContext';
import { FileText, Upload, Image as ImageIcon } from 'lucide-react';
import * as Dialog from '@radix-ui/react-dialog';
import type { Manuscript } from '../../types';

export function LayoutArtistDashboard() {
  const { currentUser } = useAuth();
  const { manuscripts, designFiles, updateDesignFile } = useData();
  const [selectedManuscript, setSelectedManuscript] = useState<Manuscript | null>(null);
  const [designNotes, setDesignNotes] = useState('');

  const approvedManuscripts = manuscripts.filter((ms) => ms.status === 'production');

  const getDesignFileForManuscript = (manuscriptId: string) => {
    return designFiles.find((df) => df.manuscriptId === manuscriptId);
  };

  const handleUpdateDesignStatus = (manuscriptId: string, status: 'in_progress' | 'submitted') => {
    const designFile = getDesignFileForManuscript(manuscriptId);
    if (designFile) {
      updateDesignFile(designFile.id, {
        status,
        submittedAt: status === 'submitted' ? new Date() : undefined,
        revisionNotes: designNotes,
      });
    } else {
      // Create new design file would happen here
    }
    setDesignNotes('');
    setSelectedManuscript(null);
  };

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-semibold text-gray-900">Layout Artist Dashboard</h2>
        <p className="text-gray-600 mt-1">Design covers and layouts for approved manuscripts</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="bg-white p-6 rounded-lg border border-gray-200">
          <p className="text-sm text-gray-600">Total Projects</p>
          <p className="text-3xl font-semibold text-gray-900 mt-2">{approvedManuscripts.length}</p>
        </div>
        <div className="bg-white p-6 rounded-lg border border-gray-200">
          <p className="text-sm text-gray-600">In Progress</p>
          <p className="text-3xl font-semibold text-blue-600 mt-2">
            {designFiles.filter((df) => df.status === 'in_progress').length}
          </p>
        </div>
        <div className="bg-white p-6 rounded-lg border border-gray-200">
          <p className="text-sm text-gray-600">Completed</p>
          <p className="text-3xl font-semibold text-green-600 mt-2">
            {designFiles.filter((df) => df.status === 'approved').length}
          </p>
        </div>
      </div>

      <div className="bg-white rounded-lg border border-gray-200">
        <div className="p-6 border-b border-gray-200">
          <h3 className="text-lg font-semibold text-gray-900">Approved Manuscripts</h3>
        </div>
        {approvedManuscripts.length === 0 ? (
          <div className="p-12 text-center">
            <FileText className="w-12 h-12 text-gray-400 mx-auto mb-3" />
            <p className="text-gray-600">No approved manuscripts available</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50 border-b border-gray-200">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-700 uppercase tracking-wider">
                    Title & Author
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-700 uppercase tracking-wider">
                    Category
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-700 uppercase tracking-wider">
                    Design Status
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-700 uppercase tracking-wider">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {approvedManuscripts.map((manuscript) => {
                  const designFile = getDesignFileForManuscript(manuscript.id);
                  return (
                    <tr key={manuscript.id} className="hover:bg-gray-50 transition-colors">
                      <td className="px-6 py-4">
                        <div className="text-sm font-medium text-gray-900">{manuscript.title}</div>
                        <div className="text-sm text-gray-600">{manuscript.authorName}</div>
                      </td>
                      <td className="px-6 py-4">
                        <div className="text-sm text-gray-600">{manuscript.category}</div>
                      </td>
                      <td className="px-6 py-4">
                        {designFile ? (
                          <span
                            className={`px-3 py-1 text-xs font-medium rounded-full ${
                              designFile.status === 'approved'
                                ? 'bg-green-100 text-green-800'
                                : designFile.status === 'submitted'
                                ? 'bg-blue-100 text-blue-800'
                                : designFile.status === 'in_progress'
                                ? 'bg-yellow-100 text-yellow-800'
                                : 'bg-gray-100 text-gray-800'
                            }`}
                          >
                            {designFile.status.replace(/_/g, ' ')}
                          </span>
                        ) : (
                          <span className="px-3 py-1 text-xs font-medium rounded-full bg-gray-100 text-gray-800">
                            Not Started
                          </span>
                        )}
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex gap-2">
                          <button
                            onClick={() => setSelectedManuscript(manuscript)}
                            className="flex items-center gap-1 px-3 py-1.5 bg-blue-100 text-blue-700 rounded hover:bg-blue-200"
                          >
                            <ImageIcon className="w-4 h-4" />
                            {designFile ? 'Update' : 'Start'}
                          </button>
                          {designFile?.status === 'in_progress' && (
                            <button
                              onClick={() => handleUpdateDesignStatus(manuscript.id, 'submitted')}
                              className="flex items-center gap-1 px-3 py-1.5 bg-green-100 text-green-700 rounded hover:bg-green-200"
                            >
                              <Upload className="w-4 h-4" />
                              Submit
                            </button>
                          )}
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>

      <Dialog.Root
        open={!!selectedManuscript}
        onOpenChange={() => setSelectedManuscript(null)}
      >
        <Dialog.Portal>
          <Dialog.Overlay className="fixed inset-0 bg-black/50 z-50" />
          <Dialog.Content className="fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 bg-white rounded-lg shadow-lg p-6 w-full max-w-2xl z-50 max-h-[90vh] overflow-y-auto">
            <Dialog.Title className="text-xl font-semibold text-gray-900 mb-4">
              Design: {selectedManuscript?.title}
            </Dialog.Title>
            <Dialog.Description className="sr-only">
              Upload and manage cover design and layout files for this manuscript
            </Dialog.Description>
            <div className="space-y-6">
              <div>
                <p className="text-sm font-medium text-gray-700 mb-1">Manuscript Details</p>
                <p className="text-sm text-gray-600 p-3 bg-gray-50 rounded-lg">
                  {selectedManuscript?.abstract}
                </p>
              </div>

              <div className="p-4 bg-blue-50 border border-blue-200 rounded-lg">
                <div className="flex items-start gap-3">
                  <Upload className="w-5 h-5 text-blue-600 mt-0.5" />
                  <div className="flex-1">
                    <p className="text-sm font-medium text-blue-900 mb-1">File Upload</p>
                    <p className="text-xs text-blue-700">
                      Cover design and layout file upload would be available with Supabase
                      integration. For now, this is a demonstration of the workflow.
                    </p>
                  </div>
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Cover Design URL (Demo)
                </label>
                <input
                  type="text"
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="https://example.com/cover.jpg"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Layout URL (Demo)
                </label>
                <input
                  type="text"
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="https://example.com/layout.pdf"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Design Notes</label>
                <textarea
                  rows={4}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="Add notes about the design approach, revisions needed, etc."
                  value={designNotes}
                  onChange={(e) => setDesignNotes(e.target.value)}
                />
              </div>

              <div className="flex justify-end gap-3 mt-6">
                <Dialog.Close asChild>
                  <button className="px-4 py-2 text-gray-700 border border-gray-300 rounded-lg hover:bg-gray-50">
                    Cancel
                  </button>
                </Dialog.Close>
                <button
                  onClick={() =>
                    selectedManuscript && handleUpdateDesignStatus(selectedManuscript.id, 'in_progress')
                  }
                  className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
                >
                  Save Progress
                </button>
                <button
                  onClick={() =>
                    selectedManuscript && handleUpdateDesignStatus(selectedManuscript.id, 'submitted')
                  }
                  className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700"
                >
                  Submit for Approval
                </button>
              </div>
            </div>
          </Dialog.Content>
        </Dialog.Portal>
      </Dialog.Root>
    </div>
  );
}
