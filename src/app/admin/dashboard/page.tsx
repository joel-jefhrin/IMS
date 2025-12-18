"use client";

import {
  BriefcaseIcon,
  UserGroupIcon,
  DocumentTextIcon,
  BuildingOfficeIcon,
  ClockIcon,
  TrophyIcon,
  ArrowTrendingUpIcon,
} from "@heroicons/react/24/outline";

import { useDBDataStore } from "@/store/dbData";
import { useEffect } from "react";

export default function AdminDashboardPage() {
  const department = useDBDataStore((state) => state.departments);
  const fetchDepartments = useDBDataStore((state) => state.fetchDepartments);
  const question = useDBDataStore((state) => state.questions);
  const fetchQuestions = useDBDataStore((state) => state.fetchQuestions);
  const campaigns = useDBDataStore((state) => state.campaigns);
  const fetchCampaigns = useDBDataStore((state) => state.fetchCampaigns);
  const candidates = useDBDataStore((state) => state.candidates);
  const fetchCandidates = useDBDataStore((state) => state.fetchCandidates);
  // console.log("candidate",candidates);

  // Accurate KPIs based on mock data from all modules
  // const kpis = {
  //   departments: department.length,
  //   questions: question.length,
  //   campaigns: 2,
  //   candidates: 3,
  //   completedInterviews: 1, // Sarah Johnson completed
  //   inProgressInterviews: 1, // Michael Chen in progress
  //   avgScore: 95, // Sarah's score
  //   activeCampaigns: 1, // Frontend Dev Hiring is active
  // };
  useEffect(() => {
    fetchDepartments();
    fetchQuestions();
    fetchCampaigns();
    fetchCandidates();
  }, [fetchDepartments, fetchQuestions, fetchCampaigns, fetchCandidates]);

  const totalDepartments = department.length;
  const totalQuestions = question.length;

  const totalCampaigns = campaigns.length;
  const activeCampaigns = campaigns.filter((c) => c.status === "active").length;

  const totalCandidates = candidates.length;

  const completedCandidates = candidates.filter(
    (c) => c.status === "completed"
  ).length;

  const inProgressCandidates = candidates.filter(
    (c: any) => c.status === "in progress"
  ).length;

  const completionRate =
    totalCandidates === 0
      ? 0
      : Math.round((completedCandidates / totalCandidates) * 100);
  const avgScore = 95;

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-gray-900">Admin Dashboard</h1>
        <p className="text-gray-600 mt-1">
          Welcome back! Here's what's happening today.
        </p>
      </div>

      {/* Main Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="card p-6 border-l-4 border-primary-500">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Total Departments</p>
              <p className="text-3xl font-bold text-gray-900 mt-1">
                {totalDepartments}
              </p>
              <p className="text-xs text-success-600 mt-1">✓ All configured</p>
            </div>
            <BuildingOfficeIcon className="w-12 h-12 text-primary-600" />
          </div>
        </div>

        <div className="card p-6 border-l-4 border-success-500">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Questions Bank</p>
              <p className="text-3xl font-bold text-gray-900 mt-1">
                {totalQuestions}
              </p>
              <p className="text-xs text-gray-600 mt-1">Ready to use</p>
            </div>
            <DocumentTextIcon className="w-12 h-12 text-success-600" />
          </div>
        </div>

        <div className="card p-6 border-l-4 border-warning-500">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Active Campaigns</p>
              <p className="text-3xl font-bold text-gray-900 mt-1">
                {activeCampaigns}
              </p>
              <p className="text-xs text-warning-600 mt-1">
                {totalCampaigns} total
              </p>
            </div>
            <BriefcaseIcon className="w-12 h-12 text-warning-600" />
          </div>
        </div>

        <div className="card p-6 border-l-4 border-primary-500">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Total Candidates</p>
              <p className="text-3xl font-bold text-gray-900 mt-1">
                {totalCandidates}
              </p>
              <p className="text-xs text-gray-600 mt-1">
                {completedCandidates}
                completed
              </p>
            </div>
            <UserGroupIcon className="w-12 h-12 text-primary-600" />
          </div>
        </div>
      </div>

      {/* Secondary Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="card p-6">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 bg-success-100 rounded-full flex items-center justify-center">
              <TrophyIcon className="w-6 h-6 text-success-600" />
            </div>
            <div>
              <p className="text-sm text-gray-600">Average Score</p>
              <p className="text-2xl font-bold text-gray-900">{avgScore}%</p>
              <p className="text-xs text-success-600">
                ↑ Excellent performance
              </p>
            </div>
          </div>
        </div>

        <div className="card p-6">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 bg-warning-100 rounded-full flex items-center justify-center">
              <ClockIcon className="w-6 h-6 text-warning-600" />
            </div>
            <div>
              <p className="text-sm text-gray-600">In Progress</p>
              <p className="text-2xl font-bold text-gray-900">
                {inProgressCandidates}
              </p>
              <p className="text-xs text-gray-600">Interviews ongoing</p>
            </div>
          </div>
        </div>

        <div className="card p-6">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 bg-primary-100 rounded-full flex items-center justify-center">
              <ArrowTrendingUpIcon className="w-6 h-6 text-primary-600" />
            </div>
            <div>
              <p className="text-sm text-gray-600">Completion Rate</p>
              <p className="text-2xl font-bold text-gray-900">
                {completionRate}%
              </p>
              <p className="text-xs text-gray-600">{completedCandidates}</p>
            </div>
          </div>
        </div>
      </div>

      {/* Quick Stats Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Module Breakdown */}
        <div className="card p-6">
          <h2 className="text-xl font-semibold text-gray-900 mb-4">
            System Overview
          </h2>
          <div className="space-y-4">
            <div>
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm text-gray-600">Departments</span>
                <span className="text-sm font-semibold text-gray-900">
                  {totalDepartments}
                </span>
              </div>
              <div className="h-2 bg-gray-200 rounded-full overflow-hidden">
                <div
                  className="h-full bg-primary-600 rounded-full"
                  style={{ width: "100%" }}
                />
              </div>
            </div>

            <div>
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm text-gray-600">Questions</span>
                <span className="text-sm font-semibold text-gray-900">
                  {totalQuestions}
                </span>
              </div>
              <div className="h-2 bg-gray-200 rounded-full overflow-hidden">
                <div
                  className="h-full bg-success-600 rounded-full"
                  style={{ width: "80%" }}
                />
              </div>
            </div>

            <div>
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm text-gray-600">Campaigns</span>
                <span className="text-sm font-semibold text-gray-900">
                  {totalCampaigns} ({activeCampaigns} active)
                </span>
              </div>
              <div className="h-2 bg-gray-200 rounded-full overflow-hidden">
                <div
                  className="h-full bg-warning-600 rounded-full"
                  style={{ width: "50%" }}
                />
              </div>
            </div>

            <div>
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm text-gray-600">Candidates</span>
                <span className="text-sm font-semibold text-gray-900">
                  {totalCandidates}
                </span>
              </div>
              <div className="h-2 bg-gray-200 rounded-full overflow-hidden">
                <div
                  className="h-full bg-primary-600 rounded-full"
                  style={{ width: "30%" }}
                />
              </div>
            </div>
          </div>
        </div>

        {/* Recent Activity */}
        <div className="card p-6">
          <h2 className="text-xl font-semibold text-gray-900 mb-4">
            Recent Activity
          </h2>
          <div className="space-y-3">
            <div className="flex items-start gap-3 p-3 bg-success-50 rounded-lg">
              <div className="w-2 h-2 bg-success-600 rounded-full mt-2"></div>
              <div className="flex-1">
                <p className="text-sm font-medium text-gray-900">
                  Interview Completed
                </p>
                <p className="text-xs text-gray-600">
                  Sarah Johnson scored 95% in Frontend Dev Hiring
                </p>
                <p className="text-xs text-gray-500 mt-1">Recently</p>
              </div>
            </div>

            <div className="flex items-start gap-3 p-3 bg-warning-50 rounded-lg">
              <div className="w-2 h-2 bg-warning-600 rounded-full mt-2"></div>
              <div className="flex-1">
                <p className="text-sm font-medium text-gray-900">
                  Interview In Progress
                </p>
                <p className="text-xs text-gray-600">
                  Michael Chen is taking the Data Science test
                </p>
                <p className="text-xs text-gray-500 mt-1">Ongoing</p>
              </div>
            </div>

            <div className="flex items-start gap-3 p-3 bg-gray-50 rounded-lg">
              <div className="w-2 h-2 bg-gray-400 rounded-full mt-2"></div>
              <div className="flex-1">
                <p className="text-sm font-medium text-gray-900">
                  Candidate Added
                </p>
                <p className="text-xs text-gray-600">
                  Emily Davis invited to Product Design campaign
                </p>
                <p className="text-xs text-gray-500 mt-1">Pending</p>
              </div>
            </div>

            <div className="flex items-start gap-3 p-3 bg-primary-50 rounded-lg">
              <div className="w-2 h-2 bg-primary-600 rounded-full mt-2"></div>
              <div className="flex-1">
                <p className="text-sm font-medium text-gray-900">
                  System Ready
                </p>
                <p className="text-xs text-gray-600">
                  All 4 modules configured and operational
                </p>
                <p className="text-xs text-gray-500 mt-1">Active</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Quick Actions */}
      <div className="card p-6">
        <h2 className="text-xl font-semibold text-gray-900 mb-4">
          Quick Actions
        </h2>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <a href="/admin/questions" className="btn-outline text-center py-4">
            <DocumentTextIcon className="w-6 h-6 mx-auto mb-2" />
            <span className="text-sm">Add Question</span>
          </a>
          <a href="/admin/campaigns" className="btn-outline text-center py-4">
            <BriefcaseIcon className="w-6 h-6 mx-auto mb-2" />
            <span className="text-sm">New Campaign</span>
          </a>
          <a href="/admin/candidates" className="btn-outline text-center py-4">
            <UserGroupIcon className="w-6 h-6 mx-auto mb-2" />
            <span className="text-sm">Add Candidate</span>
          </a>
          <a href="/admin/departments" className="btn-outline text-center py-4">
            <BuildingOfficeIcon className="w-6 h-6 mx-auto mb-2" />
            <span className="text-sm">New Department</span>
          </a>
        </div>
      </div>
    </div>
  );
}
