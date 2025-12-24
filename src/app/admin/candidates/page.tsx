'use client';

import { useState, useEffect } from 'react';
import {
  PlusIcon,
  MagnifyingGlassIcon,
  ArrowUpTrayIcon,
  ArrowDownTrayIcon,
  EyeIcon,
  PencilIcon,
  EnvelopeIcon,
} from '@heroicons/react/24/outline';
import type { Candidate } from '@/types';
import { downloadCSV } from '@/utils/csvHelpers';
import toast from 'react-hot-toast';
import { CandidateForm } from '@/components/admin/CandidateForm';
import { CandidateDetailModal } from '@/components/admin/CandidateDetailModal';
import { useDBDataStore } from '@/store/dbData';

const mockCandidates: Candidate[] = [
  {
    id: '1',
    firstName: 'Sarah',
    lastName: 'Johnson',
    email: 'sarah.j@email.com',
    phone: '+1-555-0101',
    education: {
      degree: 'B.Tech Computer Science',
      institution: 'MIT',
      graduationYear: 2024,
      gpa: '3.8',
    },
    preferredDepartmentId: 'd1', // Engineering
    campaignId: 'camp-1',
    status: 'completed',
    assignedQuestions: ['q1', 'q2', 'q3'],
    answers: [],
    score: 95,
    rank: 1,
    tempPassword: 'temp123',
    createdAt: '2024-01-15T10:00:00Z',
    updatedAt: '2024-01-20T15:30:00Z',
  },
  {
    id: '2',
    firstName: 'Michael',
    lastName: 'Chen',
    email: 'michael.c@email.com',
    phone: '+1-555-0102',
    education: {
      degree: 'M.S. Data Science',
      institution: 'Stanford',
      graduationYear: 2024,
      gpa: '3.9',
    },
    preferredDepartmentId: 'd3', // Data Science
    campaignId: 'camp-2',
    status: 'in_progress',
    assignedQuestions: ['q4', 'q5'],
    answers: [],
    score: 0,
    tempPassword: 'temp456',
    createdAt: '2024-01-16T10:00:00Z',
    updatedAt: '2024-01-21T10:00:00Z',
  },
  {
    id: '3',
    firstName: 'Emily',
    lastName: 'Davis',
    email: 'emily.d@email.com',
    phone: '+1-555-0103',
    education: {
      degree: 'B.A. Product Design',
      institution: 'Berkeley',
      graduationYear: 2023,
      gpa: '3.7',
    },
    preferredDepartmentId: 'd2', // Product Management/Design
    campaignId: 'camp-3',
    status: 'not_started',
    assignedQuestions: ['q6', 'q7'],
    answers: [],
    score: 0,
    tempPassword: 'temp789',
    createdAt: '2024-01-17T10:00:00Z',
    updatedAt: '2024-01-17T10:00:00Z',
  },
];

const statusColors = {
  invited: 'badge-primary',
  in_progress: 'badge-warning',
  completed: 'badge-success',
  not_started: 'badge-gray',
};

const statusLabels = {
  invited: 'Invited',
  in_progress: 'In Progress',
  completed: 'Completed',
  not_started: 'Not Started',
};

export default function CandidatesPage() {
  const { candidates, addCandidate, updateCandidate, deleteCandidate, fetchCandidates } = useDBDataStore();
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState<'all' | Candidate['status']>('all');
  const [selectedCandidates, setSelectedCandidates] = useState<string[]>([]);
  
  // Modal states
  const [showForm, setShowForm] = useState(false);
  const [showDetail, setShowDetail] = useState(false);
  const [editingCandidate, setEditingCandidate] = useState<Candidate | null>(null);
  const [viewingCandidate, setViewingCandidate] = useState<Candidate | null>(null);

  // Fetch candidates from database on mount
  useEffect(() => {
    fetchCandidates();
  }, [fetchCandidates]);

  const filteredCandidates = candidates.filter((c) => {
    const fullName = `${c.firstName} ${c.lastName}`.toLowerCase();
    const matchesSearch = fullName.includes(searchQuery.toLowerCase()) ||
                         c.email.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesStatus = statusFilter === 'all' || c.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  const toggleSelectAll = () => {
    if (selectedCandidates.length === filteredCandidates.length) {
      setSelectedCandidates([]);
    } else {
      setSelectedCandidates(filteredCandidates.map(c => c.id));
    }
  };

  const toggleSelect = (id: string) => {
    setSelectedCandidates(prev =>
      prev.includes(id) ? prev.filter(c => c !== id) : [...prev, id]
    );
  };

  const handleExport = () => {
    const dataToExport = candidates.map(c => ({
      firstName: c.firstName,
      lastName: c.lastName,
      email: c.email,
      status: c.status,
      score: c.score,
      rank: c.rank || '',
    }));
    downloadCSV(dataToExport, 'candidates_export');
    toast.success('Candidates exported successfully');
  };

  const handleSendEmail = (candidateId: string) => {
    toast.success('Invitation email sent successfully');
  };

  const handleCreateCandidate = (data: any) => {
    const newCandidate: Candidate = {
      id: `cand-${Date.now()}`,
      ...data,
      status: 'not_started' as const,
      assignedQuestions: [],
      answers: [],
      score: 0,
      tempPassword: `temp${Math.floor(Math.random() * 10000)}`,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };
    addCandidate(newCandidate);
  };

  const handleUpdateCandidate = (data: any) => {
    if (!editingCandidate) return;
    const updatedCandidate = {
      ...editingCandidate,
      ...data,
      updatedAt: new Date().toISOString()
    };
    updateCandidate(editingCandidate.id, updatedCandidate);
    setEditingCandidate(null);
  };

  const handlePasswordReset = (candidateId: string, newPassword: string) => {
    // Update the candidate in the store with the new password
    const candidate = candidates.find(c => c.id === candidateId);
    if (candidate) {
      updateCandidate(candidateId, {
        ...candidate,
        tempPassword: newPassword,
        updatedAt: new Date().toISOString(),
      });
      // Also update the viewing candidate if it's the same one
      if (viewingCandidate?.id === candidateId) {
        setViewingCandidate({
          ...viewingCandidate,
          tempPassword: newPassword,
        });
      }
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Candidates</h1>
          <p className="text-gray-600 mt-1">Manage candidate profiles and interviews</p>
        </div>
        <div className="flex items-center gap-3">
          <button className="btn-outline flex items-center gap-2">
            <ArrowUpTrayIcon className="w-4 h-4" />
            Bulk Import
          </button>
          <button onClick={handleExport} className="btn-outline flex items-center gap-2">
            <ArrowDownTrayIcon className="w-4 h-4" />
            Export
          </button>
          <button
            onClick={() => {
              setEditingCandidate(null);
              setShowForm(true);
            }}
            className="btn-primary flex items-center gap-2"
          >
            <PlusIcon className="w-4 h-4" />
            Add Candidate
          </button>
        </div>
      </div>

      {/* Stats */}
      <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="card p-4 border-l-4 border-gray-400">
          <p className="text-sm text-gray-600">Total Candidates</p>
          <p className="text-2xl font-bold text-gray-900 mt-1">{candidates.length}</p>
        </div>
        <div className="card p-4 border-l-4 border-success-400">
          <p className="text-sm text-gray-600">Completed</p>
          <p className="text-2xl font-bold text-gray-900 mt-1">
            {candidates.filter(c => c.status === 'completed').length}
          </p>
        </div>
        <div className="card p-4 border-l-4 border-warning-400">
          <p className="text-sm text-gray-600">In Progress</p>
          <p className="text-2xl font-bold text-gray-900 mt-1">
            {candidates.filter(c => c.status === 'in_progress').length}
          </p>
        </div>
        <div className="card p-4 border-l-4 border-primary-400">
          <p className="text-sm text-gray-600">Average Score</p>
          <p className="text-2xl font-bold text-gray-900 mt-1">
            {Math.round(candidates.filter(c => c.score > 0).reduce((sum, c) => sum + c.score, 0) / 
             candidates.filter(c => c.score > 0).length) || 0}
          </p>
        </div>
      </div>

      {/* Filters */}
      <div className="card p-4">
        <div className="flex gap-4">
          <div className="flex-1 relative">
            <MagnifyingGlassIcon className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
            <input
              type="text"
              placeholder="Search by name or email..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="input pl-10"
            />
          </div>
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value as any)}
            className="input w-48"
          >
            <option value="all">All Status</option>
            <option value="not_started">Not Started</option>
            <option value="in_progress">In Progress</option>
            <option value="completed">Completed</option>
          </select>
        </div>
      </div>

      {/* Bulk Actions */}
      {selectedCandidates.length > 0 && (
        <div className="card p-4 bg-primary-50 border-primary-200">
          <div className="flex items-center justify-between">
            <span className="text-sm font-medium text-primary-900">
              {selectedCandidates.length} candidate{selectedCandidates.length > 1 ? 's' : ''} selected
            </span>
            <div className="flex items-center gap-3">
              <button className="btn-outline text-sm">Send Reminder</button>
              <button className="btn-outline text-sm">Export Selected</button>
            </div>
          </div>
        </div>
      )}

      {/* Candidates Table */}
      <div className="card overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50 border-b border-gray-200">
              <tr>
                <th className="text-left px-6 py-3">
                  <input
                    type="checkbox"
                    checked={selectedCandidates.length === filteredCandidates.length && filteredCandidates.length > 0}
                    onChange={toggleSelectAll}
                    className="rounded border-gray-300"
                  />
                </th>
                <th className="text-left text-xs font-medium text-gray-500 uppercase px-6 py-3">Candidate</th>
                <th className="text-left text-xs font-medium text-gray-500 uppercase px-6 py-3">Education</th>
                <th className="text-left text-xs font-medium text-gray-500 uppercase px-6 py-3">Status</th>
                <th className="text-left text-xs font-medium text-gray-500 uppercase px-6 py-3">Score</th>
                <th className="text-right text-xs font-medium text-gray-500 uppercase px-6 py-3">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {filteredCandidates.map((candidate) => (
                <tr key={candidate.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4">
                    <input
                      type="checkbox"
                      checked={selectedCandidates.includes(candidate.id)}
                      onChange={() => toggleSelect(candidate.id)}
                      className="rounded border-gray-300"
                    />
                  </td>
                  <td className="px-6 py-4">
                    <div>
                      <p className="text-sm font-medium text-gray-900">
                        {candidate.firstName} {candidate.lastName}
                      </p>
                      <p className="text-xs text-gray-500">{candidate.email}</p>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <div>
                      <p className="text-sm text-gray-900">{candidate.education.degree}</p>
                      <p className="text-xs text-gray-500">
                        {candidate.education.institution} • {candidate.education.graduationYear}
                      </p>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <span className={`badge ${statusColors[candidate.status]}`}>
                      {statusLabels[candidate.status]}
                    </span>
                  </td>
                  <td className="px-6 py-4">
                    <span className="text-sm font-semibold text-gray-900">
                      {candidate.score > 0 ? candidate.score : '-'}
                    </span>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex items-center justify-end gap-2">
                      <button
                        onClick={() => {
                          setViewingCandidate(candidate);
                          setShowDetail(true);
                        }}
                        className="p-2 text-gray-400 hover:text-primary-600"
                      >
                        <EyeIcon className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => {
                          setEditingCandidate(candidate);
                          setShowForm(true);
                        }}
                        className="p-2 text-gray-400 hover:text-primary-600"
                      >
                        <PencilIcon className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => handleSendEmail(candidate.id)}
                        className="p-2 text-gray-400 hover:text-primary-600"
                      >
                        <EnvelopeIcon className="w-4 h-4" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Modals */}
      {showForm && (
        <CandidateForm
          candidate={editingCandidate}
          onClose={() => {
            setShowForm(false);
            setEditingCandidate(null);
          }}
          onSubmit={editingCandidate ? handleUpdateCandidate : handleCreateCandidate}
        />
      )}

      {showDetail && viewingCandidate && (
        <CandidateDetailModal
          candidate={viewingCandidate}
          onClose={() => {
            setShowDetail(false);
            setViewingCandidate(null);
          }}
          onEdit={() => {
            setEditingCandidate(viewingCandidate);
            setShowDetail(false);
            setShowForm(true);
          }}
          onPasswordReset={handlePasswordReset}
        />
      )}
    </div>
  );
}

