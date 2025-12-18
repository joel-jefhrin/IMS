'use client';

import { useState, useEffect } from 'react';
import {
  TrophyIcon,
  ChartBarIcon,
  FunnelIcon,
  ArrowDownTrayIcon,
  UserGroupIcon,
  CheckCircleIcon,
  XCircleIcon,
} from '@heroicons/react/24/outline';
import { downloadCSV } from '@/utils/csvHelpers';
import toast from 'react-hot-toast';
import { useDBDataStore } from '@/store/dbData';

interface CandidateResult {
  id: string;
  rank: number;
  name: string;
  email: string;
  campaign: string;
  campaignPassingScore: number;
  technicalScore: number;
  behavioralScore: number;
  logicalScore: number;
  totalScore: number;
  passingScore: number;
  status: 'passed' | 'failed';
  timeTaken: number; // minutes
  completedAt: string;
}

export default function ResultsPage() {
  const { candidates, campaigns, fetchCandidates, fetchCampaigns } = useDBDataStore();
  const [results, setResults] = useState<CandidateResult[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState<'all' | 'passed' | 'failed'>('all');
  const [campaignFilter, setCampaignFilter] = useState('all');

  // Fetch data on mount
  useEffect(() => {
    fetchCandidates();
    fetchCampaigns();
  }, [fetchCandidates, fetchCampaigns]);

  // Transform candidates to results
  useEffect(() => {
    if (candidates.length > 0 && campaigns.length > 0) {
      const completedCandidates = candidates
        .filter(c => c.status === 'completed') // include all completed, even score 0
        .map(c => {
          const campaign = campaigns.find(camp => camp.id === c.campaignId);
          const campaignName = campaign?.name || 'Unknown Campaign';
          const campaignPassingScore = campaign?.passingScore || 70;
          
          // Calculate time taken
          let timeTaken = 0;
          if (c.interviewStartedAt && c.interviewCompletedAt) {
            const start = new Date(c.interviewStartedAt).getTime();
            const end = new Date(c.interviewCompletedAt).getTime();
            timeTaken = Math.round((end - start) / 60000); // Convert to minutes
          }

          // Use recorded score; default to 0 if missing
          const totalScore = typeof c.score === 'number' ? c.score : 0;
          const status = totalScore >= campaignPassingScore ? 'passed' : 'failed';

          return {
            id: c.id,
            rank: 0, // Will be calculated after sorting
            name: `${c.firstName} ${c.lastName}`,
            email: c.email,
            campaign: campaignName,
            campaignPassingScore,
            technicalScore: totalScore, // Simplified - using total score
            behavioralScore: totalScore,
            logicalScore: totalScore,
            totalScore,
            passingScore: campaignPassingScore,
            status: status as 'passed' | 'failed',
            timeTaken,
            completedAt: c.interviewCompletedAt || c.updatedAt,
          };
        })
        .sort((a, b) => b.totalScore - a.totalScore) // Sort by score descending
        .map((result, index) => ({ ...result, rank: index + 1 })); // Assign ranks

      setResults(completedCandidates);
    }
  }, [candidates, campaigns]);

  const filteredResults = results.filter((r) => {
    const matchesSearch = r.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         r.email.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesStatus = statusFilter === 'all' || r.status === statusFilter;
    const matchesCampaign = campaignFilter === 'all' || r.campaign === campaignFilter;
    return matchesSearch && matchesStatus && matchesCampaign;
  });

  const uniqueCampaigns = Array.from(new Set(results.map(r => r.campaign)));
  const passedCount = results.filter(r => r.status === 'passed').length;
  const failedCount = results.filter(r => r.status === 'failed').length;
  const avgScore = results.length > 0 ? results.reduce((sum, r) => sum + r.totalScore, 0) / results.length : 0;

  const handleExport = () => {
    const dataToExport = results.map(r => ({
      rank: r.rank,
      name: r.name,
      email: r.email,
      campaign: r.campaign,
      technicalScore: r.technicalScore,
      behavioralScore: r.behavioralScore,
      logicalScore: r.logicalScore,
      totalScore: r.totalScore,
      status: r.status,
      timeTaken: r.timeTaken,
    }));
    downloadCSV(dataToExport, 'candidate_results');
    toast.success('Results exported successfully');
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Results & Rankings</h1>
          <p className="text-gray-600 mt-1">View candidate performance and rankings</p>
        </div>
        <button onClick={handleExport} className="btn-outline flex items-center gap-2">
          <ArrowDownTrayIcon className="w-4 h-4" />
          Export Results
        </button>
      </div>

      {/* Statistics */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="card p-4 border-l-4 border-primary-500">
          <div className="flex items-center gap-3">
            <UserGroupIcon className="w-8 h-8 text-primary-600" />
            <div>
              <p className="text-sm text-gray-600">Total Evaluated</p>
              <p className="text-2xl font-bold text-gray-900">{results.length}</p>
            </div>
          </div>
        </div>

        <div className="card p-4 border-l-4 border-success-500">
          <div className="flex items-center gap-3">
            <CheckCircleIcon className="w-8 h-8 text-success-600" />
            <div>
              <p className="text-sm text-gray-600">Passed</p>
              <p className="text-2xl font-bold text-gray-900">{passedCount}</p>
              <p className="text-xs text-gray-500">{results.length > 0 ? ((passedCount/results.length)*100).toFixed(0) : 0}% pass rate</p>
            </div>
          </div>
        </div>

        <div className="card p-4 border-l-4 border-danger-500">
          <div className="flex items-center gap-3">
            <XCircleIcon className="w-8 h-8 text-danger-600" />
            <div>
              <p className="text-sm text-gray-600">Failed</p>
              <p className="text-2xl font-bold text-gray-900">{failedCount}</p>
              <p className="text-xs text-gray-500">{results.length > 0 ? ((failedCount/results.length)*100).toFixed(0) : 0}% fail rate</p>
            </div>
          </div>
        </div>

        <div className="card p-4 border-l-4 border-warning-500">
          <div className="flex items-center gap-3">
            <ChartBarIcon className="w-8 h-8 text-warning-600" />
            <div>
              <p className="text-sm text-gray-600">Average Score</p>
              <p className="text-2xl font-bold text-gray-900">{avgScore.toFixed(1)}%</p>
              <p className="text-xs text-gray-500">Overall performance</p>
            </div>
          </div>
        </div>
      </div>

      {/* Filters */}
      <div className="card p-4">
        <div className="flex flex-col md:flex-row gap-4">
          <div className="flex-1 relative">
            <input
              type="text"
              placeholder="Search by name or email..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="input"
            />
          </div>
          <select
            value={campaignFilter}
            onChange={(e) => setCampaignFilter(e.target.value)}
            className="input md:w-64"
          >
            <option value="all">All Campaigns</option>
            {uniqueCampaigns.map(campaign => (
              <option key={campaign} value={campaign}>{campaign}</option>
            ))}
          </select>
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value as any)}
            className="input md:w-48"
          >
            <option value="all">All Results</option>
            <option value="passed">Passed Only</option>
            <option value="failed">Failed Only</option>
          </select>
        </div>
      </div>

      {/* Top 3 Performers */}
      <div className="card p-6">
        <h2 className="text-xl font-semibold text-gray-900 mb-4 flex items-center gap-2">
          <TrophyIcon className="w-6 h-6 text-warning-500" />
          Top Performers
        </h2>
        <div className="grid md:grid-cols-3 gap-4">
          {filteredResults.slice(0, 3).map((result, index) => (
            <div
              key={result.id}
              className={`card p-4 ${
                index === 0
                  ? 'bg-gradient-to-br from-warning-50 to-warning-100 border-2 border-warning-400'
                  : 'bg-gray-50'
              }`}
            >
              <div className="flex items-center gap-3 mb-3">
                <div className={`w-12 h-12 rounded-full flex items-center justify-center font-bold text-xl ${
                  index === 0
                    ? 'bg-warning-500 text-white'
                    : index === 1
                    ? 'bg-gray-400 text-white'
                    : 'bg-orange-400 text-white'
                }`}>
                  #{result.rank}
                </div>
                <div className="flex-1">
                  <p className="font-semibold text-gray-900">{result.name}</p>
                  <p className="text-xs text-gray-600">{result.campaign}</p>
                </div>
              </div>
              <div className="text-center pt-3 border-t">
                <p className="text-3xl font-bold text-gray-900">{result.totalScore.toFixed(1)}%</p>
                <p className="text-xs text-gray-600 mt-1">Total Score</p>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Results Table */}
      <div className="card overflow-hidden">
        {results.length === 0 ? (
          <div className="text-center py-12">
            <TrophyIcon className="w-16 h-16 text-gray-300 mx-auto mb-4" />
            <h3 className="text-lg font-semibold text-gray-900 mb-2">No Results Yet</h3>
            <p className="text-gray-600">
              Results will appear here once candidates complete their interviews.
            </p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full">
            <thead className="bg-gray-50 border-b border-gray-200">
              <tr>
                <th className="text-left text-xs font-medium text-gray-500 uppercase px-4 py-3">Rank</th>
                <th className="text-left text-xs font-medium text-gray-500 uppercase px-4 py-3">Candidate</th>
                <th className="text-left text-xs font-medium text-gray-500 uppercase px-4 py-3">Campaign</th>
                <th className="text-left text-xs font-medium text-gray-500 uppercase px-4 py-3">Technical</th>
                <th className="text-left text-xs font-medium text-gray-500 uppercase px-4 py-3">Behavioral</th>
                <th className="text-left text-xs font-medium text-gray-500 uppercase px-4 py-3">Logical</th>
                <th className="text-left text-xs font-medium text-gray-500 uppercase px-4 py-3">Total</th>
                <th className="text-left text-xs font-medium text-gray-500 uppercase px-4 py-3">Status</th>
                <th className="text-left text-xs font-medium text-gray-500 uppercase px-4 py-3">Time</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {filteredResults.map((result) => (
                <tr key={result.id} className="hover:bg-gray-50">
                  <td className="px-4 py-4">
                    <div className="flex items-center gap-2">
                      {result.rank <= 3 && (
                        <TrophyIcon className={`w-5 h-5 ${
                          result.rank === 1 ? 'text-warning-500' :
                          result.rank === 2 ? 'text-gray-400' :
                          'text-orange-400'
                        }`} />
                      )}
                      <span className="text-sm font-bold text-gray-900">#{result.rank}</span>
                    </div>
                  </td>
                  <td className="px-4 py-4">
                    <div>
                      <p className="text-sm font-medium text-gray-900">{result.name}</p>
                      <p className="text-xs text-gray-500">{result.email}</p>
                    </div>
                  </td>
                  <td className="px-4 py-4">
                    <span className="text-sm text-gray-700">{result.campaign}</span>
                  </td>
                  <td className="px-4 py-4">
                    <div className="flex items-center gap-2">
                      <div className="flex-1 h-2 bg-gray-200 rounded-full overflow-hidden w-16">
                        <div
                          className="h-full bg-primary-600 rounded-full"
                          style={{ width: `${result.technicalScore}%` }}
                        />
                      </div>
                      <span className="text-sm font-semibold text-gray-900 w-10 text-right">
                        {result.technicalScore}
                      </span>
                    </div>
                  </td>
                  <td className="px-4 py-4">
                    <div className="flex items-center gap-2">
                      <div className="flex-1 h-2 bg-gray-200 rounded-full overflow-hidden w-16">
                        <div
                          className="h-full bg-success-600 rounded-full"
                          style={{ width: `${result.behavioralScore}%` }}
                        />
                      </div>
                      <span className="text-sm font-semibold text-gray-900 w-10 text-right">
                        {result.behavioralScore}
                      </span>
                    </div>
                  </td>
                  <td className="px-4 py-4">
                    <div className="flex items-center gap-2">
                      <div className="flex-1 h-2 bg-gray-200 rounded-full overflow-hidden w-16">
                        <div
                          className="h-full bg-warning-600 rounded-full"
                          style={{ width: `${result.logicalScore}%` }}
                        />
                      </div>
                      <span className="text-sm font-semibold text-gray-900 w-10 text-right">
                        {result.logicalScore}
                      </span>
                    </div>
                  </td>
                  <td className="px-4 py-4">
                    <span className="text-lg font-bold text-gray-900">
                      {result.totalScore.toFixed(1)}%
                    </span>
                  </td>
                  <td className="px-4 py-4">
                    <span className={`badge ${
                      result.status === 'passed' ? 'badge-success' : 'badge-danger'
                    } capitalize`}>
                      {result.status === 'passed' ? (
                        <span className="flex items-center gap-1">
                          <CheckCircleIcon className="w-4 h-4" />
                          Passed
                        </span>
                      ) : (
                        <span className="flex items-center gap-1">
                          <XCircleIcon className="w-4 h-4" />
                          Failed
                        </span>
                      )}
                    </span>
                  </td>
                  <td className="px-4 py-4">
                    <span className="text-sm text-gray-700">{result.timeTaken} min</span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        )}
      </div>

      {/* Score Distribution */}
      <div className="grid md:grid-cols-2 gap-6">
        <div className="card p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Score Distribution</h3>
          <div className="space-y-3">
            <div>
              <div className="flex justify-between mb-1">
                <span className="text-sm text-gray-600">90-100 (Excellent)</span>
                <span className="text-sm font-semibold text-gray-900">
                  {results.filter(r => r.totalScore >= 90).length}
                </span>
              </div>
              <div className="h-3 bg-gray-200 rounded-full overflow-hidden">
                <div
                  className="h-full bg-success-600 rounded-full"
                  style={{ width: `${(results.filter(r => r.totalScore >= 90).length / results.length) * 100}%` }}
                />
              </div>
            </div>

            <div>
              <div className="flex justify-between mb-1">
                <span className="text-sm text-gray-600">75-89 (Good)</span>
                <span className="text-sm font-semibold text-gray-900">
                  {results.filter(r => r.totalScore >= 75 && r.totalScore < 90).length}
                </span>
              </div>
              <div className="h-3 bg-gray-200 rounded-full overflow-hidden">
                <div
                  className="h-full bg-primary-600 rounded-full"
                  style={{ width: `${(results.filter(r => r.totalScore >= 75 && r.totalScore < 90).length / results.length) * 100}%` }}
                />
              </div>
            </div>

            <div>
              <div className="flex justify-between mb-1">
                <span className="text-sm text-gray-600">60-74 (Fair)</span>
                <span className="text-sm font-semibold text-gray-900">
                  {results.filter(r => r.totalScore >= 60 && r.totalScore < 75).length}
                </span>
              </div>
              <div className="h-3 bg-gray-200 rounded-full overflow-hidden">
                <div
                  className="h-full bg-warning-600 rounded-full"
                  style={{ width: `${(results.filter(r => r.totalScore >= 60 && r.totalScore < 75).length / results.length) * 100}%` }}
                />
              </div>
            </div>

            <div>
              <div className="flex justify-between mb-1">
                <span className="text-sm text-gray-600">Below 60 (Poor)</span>
                <span className="text-sm font-semibold text-gray-900">
                  {results.filter(r => r.totalScore < 60).length}
                </span>
              </div>
              <div className="h-3 bg-gray-200 rounded-full overflow-hidden">
                <div
                  className="h-full bg-danger-600 rounded-full"
                  style={{ width: `${(results.filter(r => r.totalScore < 60).length / results.length) * 100}%` }}
                />
              </div>
            </div>
          </div>
        </div>

        <div className="card p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Performance Summary</h3>
          <div className="space-y-4">
            <div>
              <p className="text-sm text-gray-600 mb-2">Average Technical Score</p>
              <div className="flex items-center gap-3">
                <div className="flex-1 h-3 bg-gray-200 rounded-full overflow-hidden">
                  <div
                    className="h-full bg-primary-600 rounded-full"
                    style={{ width: `${results.reduce((sum, r) => sum + r.technicalScore, 0) / results.length}%` }}
                  />
                </div>
                <span className="text-sm font-bold text-gray-900 w-12 text-right">
                  {(results.reduce((sum, r) => sum + r.technicalScore, 0) / results.length).toFixed(1)}%
                </span>
              </div>
            </div>

            <div>
              <p className="text-sm text-gray-600 mb-2">Average Behavioral Score</p>
              <div className="flex items-center gap-3">
                <div className="flex-1 h-3 bg-gray-200 rounded-full overflow-hidden">
                  <div
                    className="h-full bg-success-600 rounded-full"
                    style={{ width: `${results.reduce((sum, r) => sum + r.behavioralScore, 0) / results.length}%` }}
                  />
                </div>
                <span className="text-sm font-bold text-gray-900 w-12 text-right">
                  {(results.reduce((sum, r) => sum + r.behavioralScore, 0) / results.length).toFixed(1)}%
                </span>
              </div>
            </div>

            <div>
              <p className="text-sm text-gray-600 mb-2">Average Logical Score</p>
              <div className="flex items-center gap-3">
                <div className="flex-1 h-3 bg-gray-200 rounded-full overflow-hidden">
                  <div
                    className="h-full bg-warning-600 rounded-full"
                    style={{ width: `${results.reduce((sum, r) => sum + r.logicalScore, 0) / results.length}%` }}
                  />
                </div>
                <span className="text-sm font-bold text-gray-900 w-12 text-right">
                  {(results.reduce((sum, r) => sum + r.logicalScore, 0) / results.length).toFixed(1)}%
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

