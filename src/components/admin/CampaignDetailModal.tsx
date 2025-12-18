'use client';

import { XMarkIcon } from '@heroicons/react/24/outline';
import type { Campaign } from '@/types';
import { format } from 'date-fns';

interface CampaignDetailModalProps {
  campaign: Campaign;
  onClose: () => void;
  onEdit: () => void;
}

const statusColors = {
  draft: 'badge-gray',
  active: 'badge-success',
  completed: 'badge-primary',
  archived: 'badge-gray',
};

export function CampaignDetailModal({ campaign, onClose, onEdit }: CampaignDetailModalProps) {
  return (
    <div className="fixed inset-0 bg-gray-900/50 z-50 flex items-center justify-center p-4">
      <div className="card max-w-2xl w-full max-h-[90vh] overflow-y-auto">
        <div className="p-6 border-b border-gray-200 flex items-center justify-between sticky top-0 bg-white z-10">
          <div className="flex-1">
            <div className="flex items-center gap-3">
              <h2 className="text-xl font-semibold text-gray-900">{campaign.name}</h2>
              <span className={`badge ${statusColors[campaign.status]} capitalize`}>
                {campaign.status}
              </span>
            </div>
            <p className="text-sm text-gray-600 mt-1">{campaign.description}</p>
          </div>
          <button onClick={onClose} className="p-2 text-gray-400 hover:text-gray-600 ml-4">
            <XMarkIcon className="w-5 h-5" />
          </button>
        </div>

        <div className="p-6 space-y-6">
          {/* Stats */}
          <div className="grid grid-cols-3 gap-4">
            <div className="card p-4 bg-primary-50">
              <p className="text-sm text-gray-600">Total Candidates</p>
              <p className="text-2xl font-bold text-gray-900 mt-1">{campaign.totalCandidates}</p>
            </div>
            <div className="card p-4 bg-success-50">
              <p className="text-sm text-gray-600">Completed</p>
              <p className="text-2xl font-bold text-gray-900 mt-1">{campaign.completedCandidates}</p>
            </div>
            <div className="card p-4 bg-warning-50">
              <p className="text-sm text-gray-600">Avg Score</p>
              <p className="text-2xl font-bold text-gray-900 mt-1">{campaign.averageScore.toFixed(1)}</p>
            </div>
          </div>

          {/* Progress */}
          <div>
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm font-medium text-gray-700">Completion Progress</span>
              <span className="text-sm font-semibold text-gray-900">
                {campaign.totalCandidates > 0 
                  ? ((campaign.completedCandidates / campaign.totalCandidates) * 100).toFixed(1)
                  : 0}%
              </span>
            </div>
            <div className="h-3 bg-gray-200 rounded-full overflow-hidden">
              <div
                className="h-full bg-primary-600 rounded-full"
                style={{ 
                  width: campaign.totalCandidates > 0
                    ? `${(campaign.completedCandidates / campaign.totalCandidates) * 100}%`
                    : '0%'
                }}
              />
            </div>
          </div>

          {/* Details */}
          <div className="grid md:grid-cols-2 gap-6 pt-4 border-t">
            <div className="space-y-3">
              <h3 className="font-semibold text-gray-900">Campaign Information</h3>
              <div>
                <p className="text-sm text-gray-600">Start Date</p>
                <p className="font-medium text-gray-900">
                  {format(new Date(campaign.startDate), 'MMM dd, yyyy')}
                </p>
              </div>
              <div>
                <p className="text-sm text-gray-600">End Date</p>
                <p className="font-medium text-gray-900">
                  {format(new Date(campaign.endDate), 'MMM dd, yyyy')}
                </p>
              </div>
              <div>
                <p className="text-sm text-gray-600">Duration per Candidate</p>
                <p className="font-medium text-gray-900">{campaign.durationPerCandidate} minutes</p>
              </div>
            </div>

            <div className="space-y-3">
              <h3 className="font-semibold text-gray-900">Configuration</h3>
              <div>
                <p className="text-sm text-gray-600">Questions per Candidate</p>
                <p className="font-medium text-gray-900">{campaign.questionsPerCandidate}</p>
              </div>
              <div>
                <p className="text-sm text-gray-600">Question Mode</p>
                <p className="font-medium text-gray-900">
                  {campaign.isRandomized ? '🔀 Randomized' : '📋 Fixed Order'}
                </p>
              </div>
              <div>
                <p className="text-sm text-gray-600">Passing Score</p>
                <p className="font-medium text-gray-900">{campaign.passingScore}%</p>
              </div>
            </div>
          </div>
        </div>

        <div className="p-6 border-t border-gray-200 flex items-center gap-3">
          <button onClick={onEdit} className="btn-primary flex-1">
            Edit Campaign
          </button>
          <button onClick={onClose} className="btn-outline flex-1">
            Close
          </button>
        </div>
      </div>
    </div>
  );
}

