import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import type { Question, Campaign, Candidate, Department } from '@/types';

interface DataStore {
  // Questions
  questions: Question[];
  addQuestion: (question: Question) => void;
  updateQuestion: (id: string, question: Question) => void;
  deleteQuestion: (id: string) => void;
  setQuestions: (questions: Question[]) => void;

  // Campaigns
  campaigns: Campaign[];
  addCampaign: (campaign: Campaign) => void;
  updateCampaign: (id: string, campaign: Campaign) => void;
  deleteCampaign: (id: string) => void;
  setCampaigns: (campaigns: Campaign[]) => void;

  // Candidates
  candidates: Candidate[];
  addCandidate: (candidate: Candidate) => void;
  updateCandidate: (id: string, candidate: Candidate) => void;
  deleteCandidate: (id: string) => void;
  setCandidates: (candidates: Candidate[]) => void;

  // Departments
  departments: Department[];
  addDepartment: (department: Department) => void;
  updateDepartment: (id: string, department: Department) => void;
  deleteDepartment: (id: string) => void;
  setDepartments: (departments: Department[]) => void;
}

export const useDataStore = create<DataStore>()(
  persist(
    (set) => ({
      // Questions
      questions: [],
      addQuestion: (question) =>
        set((state) => ({
          questions: [...state.questions, { ...question, id: question.id || `q-${Date.now()}` }],
        })),
      updateQuestion: (id, question) =>
        set((state) => ({
          questions: state.questions.map((q) => (q.id === id ? { ...question, id } : q)),
        })),
      deleteQuestion: (id) =>
        set((state) => ({
          questions: state.questions.filter((q) => q.id !== id),
        })),
      setQuestions: (questions) => set({ questions }),

      // Campaigns
      campaigns: [],
      addCampaign: (campaign) =>
        set((state) => ({
          campaigns: [...state.campaigns, { ...campaign, id: campaign.id || `c-${Date.now()}` }],
        })),
      updateCampaign: (id, campaign) =>
        set((state) => ({
          campaigns: state.campaigns.map((c) => (c.id === id ? { ...campaign, id } : c)),
        })),
      deleteCampaign: (id) =>
        set((state) => ({
          campaigns: state.campaigns.filter((c) => c.id !== id),
        })),
      setCampaigns: (campaigns) => set({ campaigns }),

      // Candidates
      candidates: [],
      addCandidate: (candidate) =>
        set((state) => ({
          candidates: [...state.candidates, { ...candidate, id: candidate.id || `cand-${Date.now()}` }],
        })),
      updateCandidate: (id, candidate) =>
        set((state) => ({
          candidates: state.candidates.map((c) => (c.id === id ? { ...candidate, id } : c)),
        })),
      deleteCandidate: (id) =>
        set((state) => ({
          candidates: state.candidates.filter((c) => c.id !== id),
        })),
      setCandidates: (candidates) => set({ candidates }),

      // Departments
      departments: [],
      addDepartment: (department) =>
        set((state) => ({
          departments: [...state.departments, { ...department, id: department.id || `d-${Date.now()}` }],
        })),
      updateDepartment: (id, department) =>
        set((state) => ({
          departments: state.departments.map((d) => (d.id === id ? { ...department, id } : d)),
        })),
      deleteDepartment: (id) =>
        set((state) => ({
          departments: state.departments.filter((d) => d.id !== id),
        })),
      setDepartments: (departments) => set({ departments }),
    }),
    {
      name: 'interview-system-data',
    }
  )
);

