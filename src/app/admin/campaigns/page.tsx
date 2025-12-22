'use client';

import { useState, useEffect } from 'react';
import {
  PlusIcon,
  MagnifyingGlassIcon,
  EyeIcon,
  PencilIcon,
  TrashIcon,
} from '@heroicons/react/24/outline';
import type { Campaign } from '@/types';
import { downloadCSV } from '@/utils/csvHelpers';
import toast from 'react-hot-toast';
import { CampaignForm } from '@/components/admin/CampaignForm';
import { CampaignDetailModal } from '@/components/admin/CampaignDetailModal';
import { useDBDataStore } from '@/store/dbData';

const statusColors: Record<Campaign['status'], string> = {
  draft: 'badge-gray',
  active: 'badge-success',
  completed: 'badge-primary',
  archived: 'badge-gray',
};

export default function CampaignsPage() {
  const {
    campaigns,
    questions,
    candidates,
    fetchCampaigns,
    fetchQuestions,
    fetchCandidates,
    addCampaign,
    updateCampaign,
    deleteCampaign,
  } = useDBDataStore();

  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] =
    useState<'all' | Campaign['status']>('all');

  const [showForm, setShowForm] = useState(false);
  const [showDetail, setShowDetail] = useState(false);
  const [editingCampaign, setEditingCampaign] =
    useState<Campaign | null>(null);
  const [viewingCampaign, setViewingCampaign] =
    useState<Campaign | null>(null);

  /* ----------------------------------------
     FETCH DATA
  ----------------------------------------- */
  useEffect(() => {
    fetchCampaigns();
    fetchQuestions();
    fetchCandidates();
  }, [fetchCampaigns, fetchQuestions, fetchCandidates]);

  /* ----------------------------------------
     CALCULATE REAL STATS
  ----------------------------------------- */
  const campaignsWithStats: Campaign[] = campaigns.map((campaign) => {
    const relatedCandidates = candidates.filter(
      (c) => c.campaignId === campaign.id
    );

    const completedCandidates = relatedCandidates.filter(
      (c) => c.status === 'completed'
    );

    const averageScore =
      completedCandidates.length > 0
        ? completedCandidates.reduce(
            (sum, c) => sum + (c.score ?? 0),
            0
          ) / completedCandidates.length
        : 0;

    return {
      ...campaign,
      totalCandidates: relatedCandidates.length,
      completedCandidates: completedCandidates.length,
      averageScore,
    };
  });

  /* ----------------------------------------
     FILTERING
  ----------------------------------------- */
  const filteredCampaigns = campaignsWithStats.filter((c) => {
    const search = searchQuery.toLowerCase();

    const matchesSearch =
      c?.name?.toLowerCase().includes(search) ||
      (c.description ?? '').toLowerCase().includes(search);

    const matchesStatus =
      statusFilter === 'all' || c.status === statusFilter;

    return matchesSearch && matchesStatus;
  });

  /* ----------------------------------------
     HANDLERS
  ----------------------------------------- */
  const handleExport = () => {
    const exportData = campaignsWithStats.map((c) => ({
      Name: c.name,
      Status: c.status,
      TotalCandidates: c.totalCandidates,
      CompletedCandidates: c.completedCandidates,
      AverageScore: c.averageScore.toFixed(2),
    }));

    downloadCSV(exportData, 'campaigns');
    toast.success('Campaigns exported');
  };

  const handleDelete = (id: string) => {
    if (!confirm('Delete this campaign?')) return;
    deleteCampaign(id);
    toast.success('Campaign deleted');
  };

  const handleCreateCampaign = (data: any) => {
    const newCampaign: Campaign = {
      id: `c-${Date.now()}`,
      ...data,
      status: 'draft',
      totalCandidates: 0,
      completedCandidates: 0,
      averageScore: 0,
      createdBy: 'admin',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    addCampaign(newCampaign);
    setShowForm(false);
  };

  const handleUpdateCampaign = (data: any) => {
    if (!editingCampaign) return;

    updateCampaign(editingCampaign.id, {
      ...editingCampaign,
      ...data,
      updatedAt: new Date().toISOString(),
    });

    setEditingCampaign(null);
    setShowForm(false);
  };

  /* ----------------------------------------
     UI
  ----------------------------------------- */
  return (
    <div className="space-y-6">
      {/* HEADER */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Campaigns</h1>
          <p className="text-gray-600">
            Manage interview campaigns
          </p>
        </div>
        <div className="flex gap-3">
          <button onClick={handleExport} className="btn-outline">
            Export
          </button>
          <button
            className="btn-primary flex items-center gap-2"
            onClick={() => {
              setEditingCampaign(null);
              setShowForm(true);
            }}
          >
            <PlusIcon className="w-4 h-4" />
            Create Campaign
          </button>
        </div>
      </div>

      {/* FILTERS */}
      <div className="card p-4 flex gap-4">
        <div className="flex-1 relative">
          <MagnifyingGlassIcon className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
          <input
            className="input pl-10"
            placeholder="Search campaigns..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>

        <select
          className="input w-48"
          value={statusFilter}
          onChange={(e) =>
            setStatusFilter(e.target.value as any)
          }
        >
          <option value="all">All Status</option>
          <option value="draft">Draft</option>
          <option value="active">Active</option>
          <option value="completed">Completed</option>
          <option value="archived">Archived</option>
        </select>
      </div>

      {/* GRID */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredCampaigns.map((campaign) => (
          <div key={campaign.id} className="card p-6">
            <div className="flex justify-between mb-3">
              <h3 className="font-semibold text-lg">
                {campaign.name}
              </h3>
              <span
                className={`badge ${statusColors[campaign.status]}`}
              >
                {campaign.status}
              </span>
            </div>

            <p className="text-sm text-gray-600 mb-4">
              {campaign.description}
            </p>

            <div className="text-sm space-y-1">
              <div className="flex justify-between">
                <span>Candidates</span>
                <span>{campaign.totalCandidates}</span>
              </div>
              <div className="flex justify-between">
                <span>Completed</span>
                <span>{campaign.completedCandidates}</span>
              </div>
              <div className="flex justify-between">
                <span>Avg Score</span>
                <span>
                  {campaign.averageScore.toFixed(1)}
                </span>
              </div>
            </div>

            <div className="flex gap-2 mt-4 pt-4 border-t">
              <button
                className="btn-outline flex-1 flex items-center justify-center gap-2"
                onClick={() => {
                  setViewingCampaign(campaign);
                  setShowDetail(true);
                }}
              >
                <EyeIcon className="w-4 h-4" />
                View
              </button>

              <button
                className="btn-ghost p-2"
                onClick={() => {
                  setEditingCampaign(campaign);
                  setShowForm(true);
                }}
              >
                <PencilIcon className="w-4 h-4" />
              </button>

              <button
                className="btn-ghost p-2 text-danger-600"
                onClick={() => handleDelete(campaign.id)}
              >
                <TrashIcon className="w-4 h-4" />
              </button>
            </div>
          </div>
        ))}
      </div>

      {filteredCampaigns.length === 0 && (
        <div className="card p-12 text-center text-gray-500">
          No campaigns found
        </div>
      )}

      {/* MODALS */}
      {showForm && (
        <CampaignForm
          campaign={editingCampaign}
          availableQuestions={questions}
          onClose={() => {
            setShowForm(false);
            setEditingCampaign(null);
          }}
          onSubmit={
            editingCampaign
              ? handleUpdateCampaign
              : handleCreateCampaign
          }
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
