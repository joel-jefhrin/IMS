'use client';

import { useState, useEffect, useMemo } from 'react';
import {
  LinkIcon,
  BuildingOfficeIcon,
  DocumentTextIcon,
  BriefcaseIcon,
  UserGroupIcon,
  FunnelIcon,
  MagnifyingGlassIcon,
  ArrowRightIcon,
} from '@heroicons/react/24/outline';
import { useDBDataStore } from '@/store/dbData';

export default function MappingsPage() {
  const { departments, questions, campaigns, candidates, fetchDepartments, fetchQuestions, fetchCampaigns, fetchCandidates } = useDBDataStore();
  const [selectedView, setSelectedView] = useState<'overview' | 'department' | 'campaign' | 'question'>('overview');
  const [selectedDeptId, setSelectedDeptId] = useState<string>('');
  const [selectedCampaignId, setSelectedCampaignId] = useState<string>('');
  const [searchQuery, setSearchQuery] = useState('');

  // Fetch all data on mount
  useEffect(() => {
    fetchDepartments();
    fetchQuestions();
    fetchCampaigns();
    fetchCandidates();
  }, [fetchDepartments, fetchQuestions, fetchCampaigns, fetchCandidates]);

  // Transform questions with department names
  const questionsWithDepts = useMemo(() => 
    questions.map(q => {
      const dept = departments.find(d => d.id === q.departmentId);
      const usedInCampaigns = campaigns.filter(c => 
        c.questionSetIds && c.questionSetIds.includes(q.id)
      ).length;
      return {
        ...q,
        departmentName: dept?.name || 'Unknown',
        usedInCampaigns,
      };
    }),
    [questions, departments, campaigns]
  );

  // Transform campaigns with department names and counts
  const campaignsWithDetails = useMemo(() =>
    campaigns.map(c => {
      const dept = departments.find(d => d.id === c.departmentId);
      const candidateCount = candidates.filter(can => can.campaignId === c.id).length;
      const questionCount = c.questionSetIds ? c.questionSetIds.length : 0;
      return {
        ...c,
        departmentName: dept?.name || 'Unknown',
        candidateCount,
        questionCount,
      };
    }),
    [campaigns, departments, candidates]
  );

  // Transform candidates with campaign and department names
  const candidatesWithDetails = useMemo(() =>
    candidates.map(can => {
      const campaign = campaigns.find(c => c.id === can.campaignId);
      const dept = departments.find(d => d.id === can.preferredDepartmentId);
      return {
        ...can,
        name: `${can.firstName} ${can.lastName}`,
        campaignName: campaign?.name || 'Unknown',
        departmentName: dept?.name || 'Unknown',
        assignedQuestions: can.assignedQuestions ? can.assignedQuestions.length : 0,
      };
    }),
    [candidates, campaigns, departments]
  );

  // Transform departments with counts
  const departmentsWithCounts = useMemo(() =>
    departments.map(d => {
      const questionCount = questions.filter(q => q.departmentId === d.id).length;
      const campaignCount = campaigns.filter(c => c.departmentId === d.id).length;
      const candidateCount = candidates.filter(can => can.preferredDepartmentId === d.id).length;
      return {
        ...d,
        questionCount,
        campaignCount,
        candidateCount,
      };
    }),
    [departments, questions, campaigns, candidates]
  );

  // Filter data based on search
  const filteredQuestions = questionsWithDepts.filter(q => 
    q.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
    q.departmentName.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const filteredCampaigns = campaignsWithDetails.filter(c =>
    c.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    c.departmentName.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const filteredDepartments = departmentsWithCounts.filter(d =>
    d.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  // Get questions for selected department
  const deptQuestions = selectedDeptId ? questionsWithDepts.filter(q => q.departmentId === selectedDeptId) : [];
  const deptCampaigns = selectedDeptId ? campaignsWithDetails.filter(c => c.departmentId === selectedDeptId) : [];
  const selectedDept = departmentsWithCounts.find(d => d.id === selectedDeptId);

  // Get data for selected campaign
  const campaignQuestions = selectedCampaignId ? questionsWithDepts.filter(q => 
    campaignsWithDetails.find(c => c.id === selectedCampaignId)?.departmentId === q.departmentId
  ) : [];
  const campaignCandidates = selectedCampaignId ? candidatesWithDetails.filter(c => c.campaignId === selectedCampaignId) : [];
  const selectedCampaign = campaignsWithDetails.find(c => c.id === selectedCampaignId);

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Relationship Mappings</h1>
          <p className="text-gray-600 mt-1">View connections between Departments, Campaigns, Questions & Candidates</p>
        </div>
      </div>

      {/* View Selector */}
      <div className="flex gap-2 flex-wrap">
        <button
          onClick={() => setSelectedView('overview')}
          className={`btn-sm ${selectedView === 'overview' ? 'btn' : 'btn-outline'}`}
        >
          Overview
        </button>
        <button
          onClick={() => setSelectedView('department')}
          className={`btn-sm ${selectedView === 'department' ? 'btn' : 'btn-outline'}`}
        >
          By Department
        </button>
        <button
          onClick={() => setSelectedView('campaign')}
          className={`btn-sm ${selectedView === 'campaign' ? 'btn' : 'btn-outline'}`}
        >
          By Campaign
        </button>
        <button
          onClick={() => setSelectedView('question')}
          className={`btn-sm ${selectedView === 'question' ? 'btn' : 'btn-outline'}`}
        >
          By Question
        </button>
      </div>

      {/* Search */}
      <div className="card p-4">
        <div className="relative">
          <MagnifyingGlassIcon className="w-5 h-5 absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
          <input
            type="text"
            placeholder="Search departments, campaigns, or questions..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="input pl-10"
          />
        </div>
      </div>

      {/* Overview */}
      {selectedView === 'overview' && (
        <div className="space-y-6">
          {/* Statistics */}
          <div className="grid md:grid-cols-4 gap-4">
            <div className="card p-6 border-l-4 border-primary-500">
              <BuildingOfficeIcon className="w-8 h-8 text-primary-600 mb-2" />
              <p className="text-sm text-gray-600">Departments</p>
              <p className="text-3xl font-bold text-gray-900">{departments.length}</p>
            </div>
            <div className="card p-6 border-l-4 border-success-500">
              <BriefcaseIcon className="w-8 h-8 text-success-600 mb-2" />
              <p className="text-sm text-gray-600">Campaigns</p>
              <p className="text-3xl font-bold text-gray-900">{campaigns.length}</p>
            </div>
            <div className="card p-6 border-l-4 border-warning-500">
              <DocumentTextIcon className="w-8 h-8 text-warning-600 mb-2" />
              <p className="text-sm text-gray-600">Questions</p>
              <p className="text-3xl font-bold text-gray-900">{questions.length}</p>
            </div>
            <div className="card p-6 border-l-4 border-danger-500">
              <UserGroupIcon className="w-8 h-8 text-danger-600 mb-2" />
              <p className="text-sm text-gray-600">Candidates</p>
              <p className="text-3xl font-bold text-gray-900">{candidates.length}</p>
            </div>
          </div>

          {/* Relationship Flow */}
          <div className="card p-8">
            <h2 className="text-xl font-semibold text-gray-900 mb-6 flex items-center gap-2">
              <LinkIcon className="w-6 h-6 text-primary-600" />
              Data Relationship Flow
            </h2>
            <div className="flex flex-col md:flex-row items-center justify-between gap-6">
              <div className="flex-1 text-center">
                <div className="w-20 h-20 bg-gradient-to-br from-blue-500 to-blue-600 rounded-2xl flex items-center justify-center mx-auto mb-3 shadow-lg">
                  <BuildingOfficeIcon className="w-10 h-10 text-white" />
                </div>
                <h3 className="font-semibold text-gray-900 text-lg">Department</h3>
                <p className="text-sm text-gray-600 mt-1">Engineering, Design, etc.</p>
              </div>

              <ArrowRightIcon className="w-8 h-8 text-gray-400 hidden md:block" />

              <div className="flex-1 text-center">
                <div className="w-20 h-20 bg-gradient-to-br from-green-500 to-green-600 rounded-2xl flex items-center justify-center mx-auto mb-3 shadow-lg">
                  <DocumentTextIcon className="w-10 h-10 text-white" />
                </div>
                <h3 className="font-semibold text-gray-900 text-lg">Questions</h3>
                <p className="text-sm text-gray-600 mt-1">Belong to department</p>
              </div>

              <ArrowRightIcon className="w-8 h-8 text-gray-400 hidden md:block" />

              <div className="flex-1 text-center">
                <div className="w-20 h-20 bg-gradient-to-br from-purple-500 to-purple-600 rounded-2xl flex items-center justify-center mx-auto mb-3 shadow-lg">
                  <BriefcaseIcon className="w-10 h-10 text-white" />
                </div>
                <h3 className="font-semibold text-gray-900 text-lg">Campaign</h3>
                <p className="text-sm text-gray-600 mt-1">Uses dept questions</p>
              </div>

              <ArrowRightIcon className="w-8 h-8 text-gray-400 hidden md:block" />

              <div className="flex-1 text-center">
                <div className="w-20 h-20 bg-gradient-to-br from-orange-500 to-orange-600 rounded-2xl flex items-center justify-center mx-auto mb-3 shadow-lg">
                  <UserGroupIcon className="w-10 h-10 text-white" />
                </div>
                <h3 className="font-semibold text-gray-900 text-lg">Candidates</h3>
                <p className="text-sm text-gray-600 mt-1">Assigned to campaign</p>
              </div>
            </div>

            <div className="mt-8 p-4 bg-blue-50 rounded-lg border border-blue-200">
              <h4 className="font-semibold text-blue-900 mb-2">How It Works:</h4>
              <ul className="text-sm text-blue-800 space-y-2">
                <li className="flex items-start gap-2">
                  <span className="text-blue-600 font-bold">1.</span>
                  <span><strong>Departments</strong> are created (e.g., Engineering, Design)</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-blue-600 font-bold">2.</span>
                  <span><strong>Questions</strong> are tagged with a specific department</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-blue-600 font-bold">3.</span>
                  <span><strong>Campaigns</strong> select questions from their department's question pool</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-blue-600 font-bold">4.</span>
                  <span><strong>Candidates</strong> are assigned to a campaign and receive its questions</span>
                </li>
              </ul>
            </div>
          </div>

          {/* Department Summary */}
          <div className="card p-6">
            <h2 className="text-xl font-semibold text-gray-900 mb-4">Department Summary</h2>
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-gray-50 border-b border-gray-200">
                  <tr>
                    <th className="text-left text-xs font-medium text-gray-500 uppercase px-4 py-3">Department</th>
                    <th className="text-left text-xs font-medium text-gray-500 uppercase px-4 py-3">Questions</th>
                    <th className="text-left text-xs font-medium text-gray-500 uppercase px-4 py-3">Campaigns</th>
                    <th className="text-left text-xs font-medium text-gray-500 uppercase px-4 py-3">Candidates</th>
                    <th className="text-left text-xs font-medium text-gray-500 uppercase px-4 py-3">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200">
                  {filteredDepartments.map((dept) => (
                    <tr key={dept.id} className="hover:bg-gray-50">
                      <td className="px-4 py-4">
                        <div className="flex items-center gap-2">
                          <BuildingOfficeIcon className="w-5 h-5 text-primary-600" />
                          <span className="font-medium text-gray-900">{dept.name}</span>
                        </div>
                      </td>
                      <td className="px-4 py-4">
                        <span className="badge badge-warning">{dept.questionCount} questions</span>
                      </td>
                      <td className="px-4 py-4">
                        <span className="badge badge-success">{dept.campaignCount} campaigns</span>
                      </td>
                      <td className="px-4 py-4">
                        <span className="badge badge-info">{dept.candidateCount} candidates</span>
                      </td>
                      <td className="px-4 py-4">
                        <button
                          onClick={() => {
                            setSelectedDeptId(dept.id);
                            setSelectedView('department');
                          }}
                          className="text-sm text-primary-600 hover:text-primary-700 font-medium"
                        >
                          View Details →
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* By Department View */}
      {selectedView === 'department' && (
        <div className="space-y-6">
          {/* Department Selector */}
          <div className="card p-4">
            <select
              value={selectedDeptId}
              onChange={(e) => setSelectedDeptId(e.target.value)}
              className="input"
            >
              <option value="">Select a department...</option>
              {departmentsWithCounts.map(d => (
                <option key={d.id} value={d.id}>{d.name}</option>
              ))}
            </select>
          </div>

          {selectedDeptId && selectedDept && (
            <>
              {/* Department Info */}
              <div className="card p-6 bg-gradient-to-br from-primary-50 to-primary-100 border-2 border-primary-200">
                <div className="flex items-center gap-4">
                  <BuildingOfficeIcon className="w-12 h-12 text-primary-600" />
                  <div className="flex-1">
                    <h2 className="text-2xl font-bold text-gray-900">{selectedDept.name}</h2>
                    <p className="text-gray-600 mt-1">Department Details & Relationships</p>
                  </div>
                  <div className="text-right">
                    <p className="text-3xl font-bold text-primary-600">{selectedDept.questionCount + selectedDept.campaignCount + selectedDept.candidateCount}</p>
                    <p className="text-sm text-gray-600">Total Items</p>
                  </div>
                </div>
              </div>

              {/* Questions in Department */}
              <div className="card p-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
                  <DocumentTextIcon className="w-5 h-5 text-warning-600" />
                  Questions ({deptQuestions.length})
                </h3>
                <div className="grid md:grid-cols-2 gap-4">
                  {deptQuestions.map(q => (
                    <div key={q.id} className="p-4 bg-gray-50 rounded-lg border border-gray-200">
                      <h4 className="font-medium text-gray-900">{q.title}</h4>
                      <div className="flex gap-2 mt-2">
                        <span className={`badge ${
                          q.difficulty === 'beginner' ? 'badge-success' :
                          q.difficulty === 'intermediate' ? 'badge-warning' :
                          'badge-danger'
                        }`}>{q.difficulty}</span>
                        <span className="badge badge-info">{q.skillType}</span>
                        <span className="text-xs text-gray-600">Used in {q.usedInCampaigns} campaigns</span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Campaigns in Department */}
              <div className="card p-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
                  <BriefcaseIcon className="w-5 h-5 text-success-600" />
                  Campaigns ({deptCampaigns.length})
                </h3>
                <div className="space-y-3">
                  {deptCampaigns.map(c => (
                    <div key={c.id} className="p-4 bg-gray-50 rounded-lg border border-gray-200 flex items-center justify-between">
                      <div>
                        <h4 className="font-medium text-gray-900">{c.name}</h4>
                        <p className="text-sm text-gray-600 mt-1">
                          {c.questionCount} questions • {c.candidateCount} candidates
                        </p>
                      </div>
                      <span className={`badge ${c.status === 'active' ? 'badge-success' : 'badge-secondary'}`}>
                        {c.status}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            </>
          )}
        </div>
      )}

      {/* By Campaign View */}
      {selectedView === 'campaign' && (
        <div className="space-y-6">
          {/* Campaign Selector */}
          <div className="card p-4">
            <select
              value={selectedCampaignId}
              onChange={(e) => setSelectedCampaignId(e.target.value)}
              className="input"
            >
              <option value="">Select a campaign...</option>
              {campaignsWithDetails.map(c => (
                <option key={c.id} value={c.id}>{c.name} - {c.departmentName}</option>
              ))}
            </select>
          </div>

          {selectedCampaignId && selectedCampaign && (
            <>
              {/* Campaign Info */}
              <div className="card p-6 bg-gradient-to-br from-success-50 to-success-100 border-2 border-success-200">
                <div className="flex items-center gap-4">
                  <BriefcaseIcon className="w-12 h-12 text-success-600" />
                  <div className="flex-1">
                    <h2 className="text-2xl font-bold text-gray-900">{selectedCampaign.name}</h2>
                    <p className="text-gray-600 mt-1">
                      <BuildingOfficeIcon className="w-4 h-4 inline mr-1" />
                      {selectedCampaign.departmentName} Department
                    </p>
                  </div>
                  <div className="text-right">
                    <span className={`badge ${selectedCampaign.status === 'active' ? 'badge-success' : 'badge-secondary'}`}>
                      {selectedCampaign.status}
                    </span>
                  </div>
                </div>
              </div>

              {/* Campaign Stats */}
              <div className="grid md:grid-cols-3 gap-4">
                <div className="card p-4 text-center">
                  <DocumentTextIcon className="w-8 h-8 text-warning-600 mx-auto mb-2" />
                  <p className="text-2xl font-bold text-gray-900">{selectedCampaign.questionCount}</p>
                  <p className="text-sm text-gray-600">Questions Assigned</p>
                </div>
                <div className="card p-4 text-center">
                  <UserGroupIcon className="w-8 h-8 text-primary-600 mx-auto mb-2" />
                  <p className="text-2xl font-bold text-gray-900">{campaignCandidates.length}</p>
                  <p className="text-sm text-gray-600">Candidates</p>
                </div>
                <div className="card p-4 text-center">
                  <BuildingOfficeIcon className="w-8 h-8 text-success-600 mx-auto mb-2" />
                  <p className="text-2xl font-bold text-gray-900">1</p>
                  <p className="text-sm text-gray-600">Department</p>
                </div>
              </div>

              {/* Available Questions */}
              <div className="card p-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Available Questions Pool</h3>
                <p className="text-sm text-gray-600 mb-4">
                  Questions from <strong>{selectedCampaign.departmentName}</strong> department that can be used in this campaign:
                </p>
                <div className="grid md:grid-cols-2 gap-3">
                  {campaignQuestions.map(q => (
                    <div key={q.id} className="p-3 bg-gray-50 rounded-lg border border-gray-200 text-sm">
                      <div className="flex items-start justify-between">
                        <span className="font-medium text-gray-900">{q.title}</span>
                        <span className={`badge badge-sm ${
                          q.difficulty === 'beginner' ? 'badge-success' :
                          q.difficulty === 'intermediate' ? 'badge-warning' :
                          'badge-danger'
                        }`}>{q.difficulty}</span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Candidates */}
              <div className="card p-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Candidates ({campaignCandidates.length})</h3>
                <div className="space-y-2">
                  {campaignCandidates.map(can => (
                    <div key={can.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg border border-gray-200">
                      <div>
                        <p className="font-medium text-gray-900">{can.name}</p>
                        <p className="text-xs text-gray-600">{can.email}</p>
                      </div>
                      <div className="flex items-center gap-3">
                        <span className="text-sm text-gray-600">{can.assignedQuestions} questions</span>
                        <span className={`badge ${
                          can.status === 'completed' ? 'badge-success' :
                          can.status === 'in_progress' ? 'badge-warning' :
                          'badge-secondary'
                        }`}>{can.status}</span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </>
          )}
        </div>
      )}

      {/* By Question View */}
      {selectedView === 'question' && (
        <div className="space-y-6">
          <div className="card p-6">
            <h2 className="text-xl font-semibold text-gray-900 mb-4">Questions & Their Usage</h2>
            <div className="space-y-3">
              {filteredQuestions.map(q => (
                <div key={q.id} className="p-4 bg-gray-50 rounded-lg border border-gray-200">
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <h3 className="font-semibold text-gray-900">{q.title}</h3>
                      <div className="flex gap-2 mt-2 flex-wrap">
                        <span className="badge badge-primary flex items-center gap-1">
                          <BuildingOfficeIcon className="w-3 h-3" />
                          {q.departmentName}
                        </span>
                        <span className={`badge ${
                          q.difficulty === 'beginner' ? 'badge-success' :
                          q.difficulty === 'intermediate' ? 'badge-warning' :
                          'badge-danger'
                        }`}>{q.difficulty}</span>
                        <span className="badge badge-info">{q.skillType}</span>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="text-2xl font-bold text-primary-600">{q.usedInCampaigns}</p>
                      <p className="text-xs text-gray-600">campaigns</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

