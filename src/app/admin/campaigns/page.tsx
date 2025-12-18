'use client';

import { useState, useEffect } from 'react';
import { PlusIcon, MagnifyingGlassIcon, EyeIcon, PencilIcon, TrashIcon } from '@heroicons/react/24/outline';
import type { Campaign } from '@/types';
import { downloadCSV } from '@/utils/csvHelpers';
import toast from 'react-hot-toast';
import { CampaignForm } from '@/components/admin/CampaignForm';
import { CampaignDetailModal } from '@/components/admin/CampaignDetailModal';
import { useDBDataStore } from '@/store/dbData';

// Mock questions - should match questions from questions page
const mockQuestions = [
  { id: '1', title: 'Implement Binary Search Algorithm', departmentId: 'd1', difficulty: 'intermediate', skillType: 'technical' },
  { id: '2', title: 'Explain React Hooks', departmentId: 'd1', difficulty: 'intermediate', skillType: 'technical' },
  { id: '3', title: 'JavaScript Data Types', departmentId: 'd1', difficulty: 'beginner', skillType: 'technical' },
  { id: '4', title: 'System Design: URL Shortener', departmentId: 'd1', difficulty: 'advanced', skillType: 'technical' },
  { id: '5', title: 'Problem Solving Skills', departmentId: 'd1', difficulty: 'beginner', skillType: 'behavioral' },
  { id: '6', title: 'Upload Your Portfolio', departmentId: 'd1', difficulty: 'beginner', skillType: 'technical' },
  { id: '7', title: 'Database Normalization', departmentId: 'd1', difficulty: 'intermediate', skillType: 'technical' },
  { id: '8', title: 'Build a REST API', departmentId: 'd1', difficulty: 'advanced', skillType: 'technical' },
  // Add questions for other departments as needed
  { id: '101', title: 'UI/UX Design Principles', departmentId: 'd2', difficulty: 'intermediate', skillType: 'behavioral' },
  { id: '102', title: 'Figma Prototyping', departmentId: 'd2', difficulty: 'advanced', skillType: 'technical' },
  { id: '201', title: 'Python Data Analysis', departmentId: 'd3', difficulty: 'intermediate', skillType: 'technical' },
  { id: '202', title: 'SQL Query Optimization', departmentId: 'd3', difficulty: 'advanced', skillType: 'technical' },
  { id: '203', title: 'Machine Learning Basics', departmentId: 'd3', difficulty: 'beginner', skillType: 'technical' },
  { id: '301', title: 'Marketing Strategy', departmentId: 'd4', difficulty: 'intermediate', skillType: 'behavioral' },
  { id: '401', title: 'Sales Negotiation', departmentId: 'd5', difficulty: 'intermediate', skillType: 'behavioral' },
];

const mockCampaigns: Campaign[] = [
  {
    id: '1',
    name: 'Frontend Developer Hiring - Q4 2023',
    description: 'Hiring campaign for frontend developer positions',
    departmentId: 'd1', // Engineering
    startDate: '2023-10-01',
    endDate: '2023-12-31',
    durationPerCandidate: 90,
    status: 'active',
    questionSetIds: ['1', '2', '3'], // Matches actual question IDs
    questionsPerCandidate: 10,
    isRandomized: true,
    passingScore: 70,
    totalCandidates: 75,
    completedCandidates: 50,
    averageScore: 82.5,
    createdBy: 'admin',
    createdAt: '2023-09-15T10:00:00Z',
    updatedAt: '2023-11-20T15:30:00Z',
  },
  {
    id: '2',
    name: 'Data Scientist Recruitment',
    description: 'Q1 2024 Data Science hiring',
    departmentId: 'd3', // Data Science
    startDate: '2024-01-01',
    endDate: '2024-03-31',
    durationPerCandidate: 120,
    status: 'draft',
    questionSetIds: ['201', '202'], // Matches actual question IDs for Data Science
    questionsPerCandidate: 15,
    isRandomized: false,
    passingScore: 75,
    totalCandidates: 0,
    completedCandidates: 0,
    averageScore: 0,
    createdBy: 'admin',
    createdAt: '2023-12-01T10:00:00Z',
    updatedAt: '2023-12-01T10:00:00Z',
  },
];

const statusColors = {
  draft: 'badge-gray',
  active: 'badge-success',
  completed: 'badge-primary',
  archived: 'badge-gray',
};

export default function CampaignsPage() {
  const { campaigns, addCampaign, updateCampaign, deleteCampaign, fetchCampaigns, questions, fetchQuestions, candidates, fetchCandidates } = useDBDataStore();
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState<'all' | Campaign['status']>('all');
  
  // Modal states
  const [showForm, setShowForm] = useState(false);
  const [showDetail, setShowDetail] = useState(false);
  const [editingCampaign, setEditingCampaign] = useState<Campaign | null>(null);
  const [viewingCampaign, setViewingCampaign] = useState<Campaign | null>(null);

  // Fetch campaigns, questions, and candidates from database on mount
  useEffect(() => {
    fetchCampaigns();
    fetchQuestions();
    fetchCandidates();
  }, [fetchCampaigns, fetchQuestions, fetchCandidates]);

  // Calculate real candidate counts for each campaign
  const campaignsWithCounts = campaigns.map(campaign => {
    const campaignCandidates = candidates.filter(c => c.campaignId === campaign.id);
    const completedCount = campaignCandidates.filter(c => c.status === 'completed').length;
    const avgScore = completedCount > 0
      ? campaignCandidates.filter(c => c.status === 'completed').reduce((sum, c) => sum + c.score, 0) / completedCount
      : 0;
    
    return {
      ...campaign,
      totalCandidates: campaignCandidates.length,
      completedCandidates: completedCount,
      averageScore: avgScore,
    };
  });

  const filteredCampaigns = campaignsWithCounts.filter((c) => {
    const matchesSearch = c.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         c.description.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesStatus = statusFilter === 'all' || c.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  const handleExport = () => {
    const dataToExport = campaigns.map(c => ({
      name: c.name,
      status: c.status,
      totalCandidates: c.totalCandidates,
      completedCandidates: c.completedCandidates,
      averageScore: c.averageScore,
    }));
    downloadCSV(dataToExport, 'campaigns_export');
    toast.success('Campaigns exported successfully');
  };

  const handleDelete = (id: string) => {
    if (confirm('Are you sure you want to delete this campaign?')) {
      deleteCampaign(id);
      toast.success('Campaign deleted successfully');
    }
  };

  const handleCreateCampaign = (data: any) => {
    const newCampaign: Campaign = {
      id: `c-${Date.now()}`,
      ...data,
      status: 'draft' as const,
      totalCandidates: 0,
      completedCandidates: 0,
      averageScore: 0,
      createdBy: 'admin',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };
    addCampaign(newCampaign);
  };

  const handleUpdateCampaign = (data: any) => {
    if (!editingCampaign) return;
    const updatedCampaign = { 
      ...editingCampaign, 
      ...data, 
      updatedAt: new Date().toISOString() 
    };
    updateCampaign(editingCampaign.id, updatedCampaign);
    setEditingCampaign(null);
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Campaigns</h1>
          <p className="text-gray-600 mt-1">Manage your interview campaigns</p>
        </div>
        <div className="flex items-center gap-3">
          <button onClick={handleExport} className="btn-outline">Export</button>
          <button
            onClick={() => {
              setEditingCampaign(null);
              setShowForm(true);
            }}
            className="btn-primary flex items-center gap-2"
          >
            <PlusIcon className="w-4 h-4" />
            Create Campaign
          </button>
        </div>
      </div>

      {/* Filters */}
      <div className="card p-4">
        <div className="flex gap-4">
          <div className="flex-1 relative">
            <MagnifyingGlassIcon className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
            <input
              type="text"
              placeholder="Search campaigns..."
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
            <option value="draft">Draft</option>
            <option value="active">Active</option>
            <option value="completed">Completed</option>
            <option value="archived">Archived</option>
          </select>
        </div>
      </div>

      {/* Campaigns Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredCampaigns.map((campaign) => (
          <div key={campaign.id} className="card p-6">
            <div className="flex items-start justify-between mb-4">
              <h3 className="text-lg font-semibold text-gray-900">{campaign.name}</h3>
              <span className={`badge ${statusColors[campaign.status]} capitalize`}>
                {campaign.status}
              </span>
            </div>
            <p className="text-sm text-gray-600 mb-4">{campaign.description}</p>
            <div className="space-y-2 text-sm text-gray-700">
              <div className="flex justify-between">
                <span>Candidates:</span>
                <span className="font-medium">{campaign.totalCandidates}</span>
              </div>
              <div className="flex justify-between">
                <span>Completed:</span>
                <span className="font-medium">{campaign.completedCandidates}</span>
              </div>
              <div className="flex justify-between">
                <span>Avg Score:</span>
                <span className="font-medium">{campaign.averageScore.toFixed(1)}</span>
              </div>
            </div>
            <div className="mt-4 pt-4 border-t flex items-center gap-2">
              <button
                onClick={() => {
                  setViewingCampaign(campaign);
                  setShowDetail(true);
                }}
                className="btn-outline flex-1 py-2 text-sm flex items-center justify-center gap-2"
              >
                <EyeIcon className="w-4 h-4" />
                View
              </button>
              <button
                onClick={() => {
                  setEditingCampaign(campaign);
                  setShowForm(true);
                }}
                className="btn-ghost p-2"
              >
                <PencilIcon className="w-4 h-4" />
              </button>
              <button 
                onClick={() => handleDelete(campaign.id)}
                className="btn-ghost p-2 text-danger-600 hover:bg-danger-50"
              >
                <TrashIcon className="w-4 h-4" />
              </button>
            </div>
          </div>
        ))}
      </div>

      {filteredCampaigns.length === 0 && (
        <div className="card p-12 text-center">
          <p className="text-gray-500">No campaigns found</p>
        </div>
      )}

      {/* Modals */}
      {showForm && (
        <CampaignForm
          campaign={editingCampaign}
          availableQuestions={questions}
          onClose={() => {
            setShowForm(false);
            setEditingCampaign(null);
          }}
          onSubmit={editingCampaign ? handleUpdateCampaign : handleCreateCampaign}
        />
      )}

      {showDetail && viewingCampaign && (
        <CampaignDetailModal
          campaign={viewingCampaign}
          onClose={() => {
            setShowDetail(false);
            setViewingCampaign(null);
          }}
          onEdit={() => {
            setEditingCampaign(viewingCampaign);
            setShowDetail(false);
            setShowForm(true);
          }}
        />
      )}
    </div>
  );
}

