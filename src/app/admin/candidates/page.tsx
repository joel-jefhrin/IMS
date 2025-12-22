"use client";

import { useState, useEffect } from "react";
import {
  PlusIcon,
  MagnifyingGlassIcon,
  EyeIcon,
  PencilIcon,
  TrashIcon,
} from "@heroicons/react/24/outline";
import type { Campaign } from "@/types";
import { downloadCSV } from "@/utils/csvHelpers";
import toast from "react-hot-toast";
import { CampaignForm } from "@/components/admin/CampaignForm";
import { CampaignDetailModal } from "@/components/admin/CampaignDetailModal";
import { useDBDataStore } from "@/store/dbData";

const statusColors = {
  draft: "badge-gray",
  active: "badge-success",
  completed: "badge-primary",
  archived: "badge-gray",
};

export default function CampaignsPage() {
  const {
    campaigns,
    addCampaign,
    updateCampaign,
    deleteCampaign,
    fetchCampaigns,
    questions,
    fetchQuestions,
    candidates,
    fetchCandidates,
  } = useDBDataStore();

  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState<"all" | Campaign["status"]>(
    "all"
  );

  // Modal states
  const [showForm, setShowForm] = useState(false);
  const [showDetail, setShowDetail] = useState(false);
  const [editingCampaign, setEditingCampaign] = useState<Campaign | null>(null);
  const [viewingCampaign, setViewingCampaign] = useState<Campaign | null>(null);

  useEffect(() => {
    fetchCampaigns();
    fetchQuestions();
    fetchCandidates();
  }, [fetchCampaigns, fetchQuestions, fetchCandidates]);

  // Calculate candidate counts & averages
  const campaignsWithCounts = campaigns.map((campaign) => {
    const campaignCandidates = candidates.filter(
      (c) => c.campaignId === campaign.id
    );
    const completedCount = campaignCandidates.filter(
      (c) => c.status === "completed"
    ).length;
    const avgScore =
      completedCount > 0
        ? campaignCandidates
            .filter((c) => c.status === "completed")
            .reduce((sum, c) => sum + c.score, 0) / completedCount
        : 0;

    return {
      ...campaign,
      totalCandidates: campaignCandidates.length,
      completedCandidates: completedCount,
      averageScore: avgScore,
    };
  });

  const search = searchQuery.toLowerCase();

  const filteredCampaigns = campaignsWithCounts.filter((c) => {
    const name = (c.name ?? "").toLowerCase();
    const description = (c.description ?? "").toLowerCase();

    const matchesSearch = name.includes(search) || description.includes(search);
    const matchesStatus = statusFilter === "all" || c.status === statusFilter;

    return matchesSearch && matchesStatus;
  });

  const handleExport = () => {
    const dataToExport = campaignsWithCounts.map((c) => ({
      name: c.name ?? "",
      status: c.status,
      totalCandidates: c.totalCandidates,
      completedCandidates: c.completedCandidates,
      averageScore: c.averageScore,
    }));
    downloadCSV(dataToExport, "campaigns_export");
    toast.success("Campaigns exported successfully");
  };

  const handleDelete = (id: string) => {
    if (confirm("Are you sure you want to delete this campaign?")) {
      deleteCampaign(id);
      toast.success("Campaign deleted successfully");
    }
  };

  const handleCreateCampaign = (data: any) => {
    const newCampaign: Campaign = {
      id: `c-${Date.now()}`,
      ...data,
      status: "draft",
      totalCandidates: 0,
      completedCandidates: 0,
      averageScore: 0,
      createdBy: "admin",
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
      updatedAt: new Date().toISOString(),
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
          <button onClick={handleExport} className="btn-outline">
            Export
          </button>
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
              <h3 className="text-lg font-semibold text-gray-900">
                {campaign.name ?? ""}
              </h3>
              <span
                className={`badge ${statusColors[campaign.status]} capitalize`}
              >
                {campaign.status}
              </span>
            </div>
            <p className="text-sm text-gray-600 mb-4">
              {campaign.description ?? ""}
            </p>
            <div className="space-y-2 text-sm text-gray-700">
              <div className="flex justify-between">
                <span>Candidates:</span>
                <span className="font-medium">{campaign.totalCandidates}</span>
              </div>
              <div className="flex justify-between">
                <span>Completed:</span>
                <span className="font-medium">
                  {campaign.completedCandidates}
                </span>
              </div>
              <div className="flex justify-between">
                <span>Avg Score:</span>
                <span className="font-medium">
                  {campaign.averageScore.toFixed(1)}
                </span>
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
          onSubmit={
            editingCampaign ? handleUpdateCampaign : handleCreateCampaign
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
