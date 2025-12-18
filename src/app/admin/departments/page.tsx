'use client';

import { useState, useEffect } from 'react';
import {
  PlusIcon,
  MagnifyingGlassIcon,
  BuildingOfficeIcon,
  PencilIcon,
  TrashIcon,
  Cog6ToothIcon,
  ChartBarIcon,
  UserGroupIcon,
  DocumentTextIcon,
} from '@heroicons/react/24/outline';
import { downloadCSV } from '@/utils/csvHelpers';
import toast from 'react-hot-toast';
import { DepartmentForm } from '@/components/admin/DepartmentForm';
import { DepartmentDetailModal } from '@/components/admin/DepartmentDetailModal';
import { useDBDataStore } from '@/store/dbData';
import type { Department } from '@/types';

// Extended interface for display (includes computed stats)
interface DepartmentWithStats extends Department {
  evaluationCriteria?: {
    technicalWeight: number;
    behavioralWeight: number;
    logicalWeight: number;
    passingScore: number;
    rankingMethod: 'score' | 'percentile' | 'weighted';
  };
  questionSets?: number;
  campaigns?: number;
  candidates?: number;
}

const mockDepartments: DepartmentWithStats[] = [
  {
    id: 'd1',
    name: 'Engineering',
    description: 'Software development and technical roles',
    evaluationCriteria: {
      technicalWeight: 60,
      behavioralWeight: 25,
      logicalWeight: 15,
      passingScore: 70,
      rankingMethod: 'weighted',
    },
    questionSets: 15,
    campaigns: 8,
    candidates: 120,
    createdAt: '2024-01-01T10:00:00Z',
    updatedAt: '2024-01-15T10:00:00Z',
  },
  {
    id: 'd3',
    name: 'Data Science',
    description: 'Data analysis, ML, and AI positions',
    evaluationCriteria: {
      technicalWeight: 70,
      behavioralWeight: 15,
      logicalWeight: 15,
      passingScore: 75,
      rankingMethod: 'score',
    },
    questionSets: 12,
    campaigns: 5,
    candidates: 45,
    createdAt: '2024-01-05T10:00:00Z',
    updatedAt: '2024-01-20T10:00:00Z',
  },
  {
    id: 'd2',
    name: 'Product Design',
    description: 'Product strategy and management roles',
    evaluationCriteria: {
      technicalWeight: 30,
      behavioralWeight: 50,
      logicalWeight: 20,
      passingScore: 65,
      rankingMethod: 'percentile',
    },
    questionSets: 8,
    campaigns: 3,
    candidates: 30,
    createdAt: '2024-01-10T10:00:00Z',
    updatedAt: '2024-01-25T10:00:00Z',
  },
  {
    id: 'd5',
    name: 'Sales',
    description: 'Sales and business development positions',
    evaluationCriteria: {
      technicalWeight: 20,
      behavioralWeight: 60,
      logicalWeight: 20,
      passingScore: 60,
      rankingMethod: 'weighted',
    },
    questionSets: 6,
    campaigns: 4,
    candidates: 50,
    createdAt: '2024-01-15T10:00:00Z',
    updatedAt: '2024-01-30T10:00:00Z',
  },
  {
    id: 'd4',
    name: 'Marketing',
    description: 'Marketing and content strategy roles',
    evaluationCriteria: {
      technicalWeight: 40,
      behavioralWeight: 40,
      logicalWeight: 20,
      passingScore: 65,
      rankingMethod: 'score',
    },
    questionSets: 10,
    campaigns: 2,
    candidates: 25,
    createdAt: '2024-01-20T10:00:00Z',
    updatedAt: '2024-02-01T10:00:00Z',
  },
];

const rankingMethodLabels = {
  score: 'Total Score',
  percentile: 'Percentile',
  weighted: 'Weighted Average',
};

export default function DepartmentsPage() {
  const { departments, addDepartment, updateDepartment, deleteDepartment, fetchDepartments } = useDBDataStore();
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedDepartments, setSelectedDepartments] = useState<string[]>([]);
  
  // Modal states
  const [showForm, setShowForm] = useState(false);
  const [showDetail, setShowDetail] = useState(false);
  const [editingDepartment, setEditingDepartment] = useState<DepartmentWithStats | null>(null);
  const [viewingDepartment, setViewingDepartment] = useState<DepartmentWithStats | null>(null);

  // Fetch departments from database on mount
  useEffect(() => {
    fetchDepartments();
  }, [fetchDepartments]);

  // Merge departments with mock data (for stats) - typed as DepartmentWithStats
  const departmentsWithStats: DepartmentWithStats[] = departments.map(dept => {
    const mockData = mockDepartments.find(m => m.id === dept.id);
    return mockData ? { ...dept, ...mockData } : { ...dept };
  });

  const filteredDepartments = departmentsWithStats.filter((d) => {
    return d.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
           (d.description || '').toLowerCase().includes(searchQuery.toLowerCase());
  });

  const toggleSelect = (id: string) => {
    setSelectedDepartments(prev =>
      prev.includes(id) ? prev.filter(did => did !== id) : [...prev, id]
    );
  };

  const handleExport = () => {
    const dataToExport = departmentsWithStats.map(d => ({
      name: d.name,
      description: d.description || '',
      technicalWeight: d.evaluationCriteria?.technicalWeight || 0,
      behavioralWeight: d.evaluationCriteria?.behavioralWeight || 0,
      logicalWeight: d.evaluationCriteria?.logicalWeight || 0,
      passingScore: d.evaluationCriteria?.passingScore || 70,
      rankingMethod: d.evaluationCriteria?.rankingMethod || 'score',
      questionSets: d.questionSets || 0,
      campaigns: d.campaigns || 0,
      candidates: d.candidates || 0,
    }));
    downloadCSV(dataToExport, 'departments_export');
    toast.success('Departments exported successfully');
  };

  const handleDelete = (id: string) => {
    const dept = departmentsWithStats.find(d => d.id === id);
    if (dept && (dept.campaigns || 0) > 0) {
      toast.error(`Cannot delete ${dept.name}: ${dept.campaigns} active campaigns`);
      return;
    }
    if (confirm('Are you sure you want to delete this department?')) {
      deleteDepartment(id);
      toast.success('Department deleted successfully');
    }
  };

  const handleCreateDepartment = (data: any) => {
    const newDepartment: Department = {
      id: `d-${Date.now()}`,
      name: data.name,
      description: data.description,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };
    addDepartment(newDepartment);
  };

  const handleUpdateDepartment = (data: any) => {
    if (!editingDepartment) return;
    const updatedDepartment = {
      ...editingDepartment,
      ...data,
      updatedAt: new Date().toISOString()
    };
    updateDepartment(editingDepartment.id, updatedDepartment);
    setEditingDepartment(null);
  };

  // Calculate totals
  const totalQuestions = departmentsWithStats.reduce((sum, d) => sum + (d.questionSets || 0), 0);
  const totalCampaigns = departmentsWithStats.reduce((sum, d) => sum + (d.campaigns || 0), 0);
  const totalCandidates = departmentsWithStats.reduce((sum, d) => sum + (d.candidates || 0), 0);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Departments</h1>
          <p className="text-gray-600 mt-1">Manage departments and evaluation criteria</p>
        </div>
        <div className="flex items-center gap-3">
          <button onClick={handleExport} className="btn-outline flex items-center gap-2">
            <ChartBarIcon className="w-4 h-4" />
            Export
          </button>
          <button
            onClick={() => {
              setEditingDepartment(null);
              setShowForm(true);
            }}
            className="btn-primary flex items-center gap-2"
          >
            <PlusIcon className="w-4 h-4" />
            Add Department
          </button>
        </div>
      </div>

      {/* Statistics */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div className="card p-4">
          <div className="flex items-center gap-3">
            <BuildingOfficeIcon className="w-8 h-8 text-primary-600" />
            <div>
              <p className="text-sm text-gray-600">Total Departments</p>
              <p className="text-2xl font-bold text-gray-900">{departments.length}</p>
            </div>
          </div>
        </div>
        <div className="card p-4">
          <div className="flex items-center gap-3">
            <DocumentTextIcon className="w-8 h-8 text-success-600" />
            <div>
              <p className="text-sm text-gray-600">Question Sets</p>
              <p className="text-2xl font-bold text-gray-900">{totalQuestions}</p>
            </div>
          </div>
        </div>
        <div className="card p-4">
          <div className="flex items-center gap-3">
            <ChartBarIcon className="w-8 h-8 text-warning-600" />
            <div>
              <p className="text-sm text-gray-600">Active Campaigns</p>
              <p className="text-2xl font-bold text-gray-900">{totalCampaigns}</p>
            </div>
          </div>
        </div>
        <div className="card p-4">
          <div className="flex items-center gap-3">
            <UserGroupIcon className="w-8 h-8 text-primary-600" />
            <div>
              <p className="text-sm text-gray-600">Total Candidates</p>
              <p className="text-2xl font-bold text-gray-900">{totalCandidates}</p>
            </div>
          </div>
        </div>
      </div>

      {/* Search */}
      <div className="card p-4">
        <div className="relative">
          <MagnifyingGlassIcon className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
          <input
            type="text"
            placeholder="Search departments..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="input pl-10"
          />
        </div>
      </div>

      {/* Departments Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredDepartments.map((department) => (
          <div key={department.id} className="card p-6 hover:shadow-lg transition-shadow">
            <div className="flex items-start justify-between mb-4">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 bg-primary-100 rounded-lg flex items-center justify-center">
                  <BuildingOfficeIcon className="w-6 h-6 text-primary-600" />
                </div>
                <div>
                  <h3 className="text-lg font-semibold text-gray-900">{department.name}</h3>
                  <p className="text-sm text-gray-600">{department.description}</p>
                </div>
              </div>
            </div>

            {/* Stats */}
            <div className="grid grid-cols-3 gap-2 mb-4 text-center">
              <div className="bg-gray-50 p-2 rounded">
                <p className="text-xs text-gray-600">Questions</p>
                <p className="text-lg font-bold text-gray-900">{department.questionSets || 0}</p>
              </div>
              <div className="bg-gray-50 p-2 rounded">
                <p className="text-xs text-gray-600">Campaigns</p>
                <p className="text-lg font-bold text-gray-900">{department.campaigns || 0}</p>
              </div>
              <div className="bg-gray-50 p-2 rounded">
                <p className="text-xs text-gray-600">Candidates</p>
                <p className="text-lg font-bold text-gray-900">{department.candidates || 0}</p>
              </div>
            </div>

            {/* Evaluation Criteria Preview */}
            <div className="mb-4 p-3 bg-gray-50 rounded-lg">
              <p className="text-xs font-semibold text-gray-700 mb-2">Evaluation Weights</p>
              <div className="space-y-1">
                <div className="flex justify-between text-xs">
                  <span className="text-gray-600">Technical</span>
                  <span className="font-medium text-gray-900">{department.evaluationCriteria?.technicalWeight || 0}%</span>
                </div>
                <div className="flex justify-between text-xs">
                  <span className="text-gray-600">Behavioral</span>
                  <span className="font-medium text-gray-900">{department.evaluationCriteria?.behavioralWeight || 0}%</span>
                </div>
                <div className="flex justify-between text-xs">
                  <span className="text-gray-600">Logical</span>
                  <span className="font-medium text-gray-900">{department.evaluationCriteria?.logicalWeight || 0}%</span>
                </div>
              </div>
              <div className="mt-2 pt-2 border-t border-gray-200">
                <div className="flex justify-between text-xs">
                  <span className="text-gray-600">Passing Score</span>
                  <span className="font-semibold text-gray-900">{department.evaluationCriteria?.passingScore || 70}%</span>
                </div>
              </div>
            </div>

            {/* Actions */}
            <div className="flex items-center gap-2 pt-4 border-t">
              <button
                onClick={() => {
                  setViewingDepartment(department);
                  setShowDetail(true);
                }}
                className="btn-outline flex-1 py-2 text-sm flex items-center justify-center gap-2"
              >
                <Cog6ToothIcon className="w-4 h-4" />
                Configure
              </button>
              <button
                onClick={() => {
                  setEditingDepartment(department);
                  setShowForm(true);
                }}
                className="btn-ghost p-2"
              >
                <PencilIcon className="w-4 h-4" />
              </button>
              <button
                onClick={() => handleDelete(department.id)}
                className="btn-ghost p-2 text-danger-600 hover:bg-danger-50"
              >
                <TrashIcon className="w-4 h-4" />
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* Empty State */}
      {filteredDepartments.length === 0 && (
        <div className="card p-12 text-center">
          <BuildingOfficeIcon className="w-16 h-16 mx-auto text-gray-400 mb-4" />
          <h3 className="text-lg font-medium text-gray-900 mb-2">No departments found</h3>
          <p className="text-gray-600 mb-6">
            {searchQuery
              ? 'Try adjusting your search'
              : 'Get started by creating your first department'}
          </p>
          {!searchQuery && (
            <button
              onClick={() => {
                setEditingDepartment(null);
                setShowForm(true);
              }}
              className="btn-primary inline-flex items-center gap-2"
            >
              <PlusIcon className="w-4 h-4" />
              Add Department
            </button>
          )}
        </div>
      )}

      {/* Modals */}
      {showForm && (
        <DepartmentForm
          department={editingDepartment}
          onClose={() => {
            setShowForm(false);
            setEditingDepartment(null);
          }}
          onSubmit={editingDepartment ? handleUpdateDepartment : handleCreateDepartment}
        />
      )}

      {showDetail && viewingDepartment && (
        <DepartmentDetailModal
          department={viewingDepartment}
          onClose={() => {
            setShowDetail(false);
            setViewingDepartment(null);
          }}
          onEdit={() => {
            setEditingDepartment(viewingDepartment);
            setShowDetail(false);
            setShowForm(true);
          }}
        />
      )}
    </div>
  );
}
