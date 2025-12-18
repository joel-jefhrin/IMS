import { create } from 'zustand';
import type { Question, Campaign, Candidate, Department } from '@/types';

interface DBDataStore {
  // Questions
  questions: Question[];
  fetchQuestions: () => Promise<void>;
  addQuestion: (question: Question) => Promise<void>;
  updateQuestion: (id: string, question: Question) => Promise<void>;
  deleteQuestion: (id: string) => Promise<void>;

  // Campaigns
  campaigns: Campaign[];
  fetchCampaigns: () => Promise<void>;
  addCampaign: (campaign: Campaign) => Promise<void>;
  updateCampaign: (id: string, campaign: Campaign) => Promise<void>;
  deleteCampaign: (id: string) => Promise<void>;

  // Candidates
  candidates: Candidate[];
  fetchCandidates: () => Promise<void>;
  addCandidate: (candidate: Candidate) => Promise<void>;
  updateCandidate: (id: string, candidate: Candidate) => Promise<void>;
  deleteCandidate: (id: string) => Promise<void>;

  // Departments
  departments: Department[];
  fetchDepartments: () => Promise<void>;
  addDepartment: (department: Department) => Promise<void>;
  updateDepartment: (id: string, department: Department) => Promise<void>;
  deleteDepartment: (id: string) => Promise<void>;

  // Loading states
  loading: boolean;
  setLoading: (loading: boolean) => void;
}

export const useDBDataStore = create<DBDataStore>((set, get) => ({
  // Questions
  questions: [],
  fetchQuestions: async () => {
    try {
      set({ loading: true });
      const res = await fetch('/api/questions');
      const questions = await res.json();
      set({ questions, loading: false });
    } catch (error) {
      console.error('Error fetching questions:', error);
      set({ loading: false });
    }
  },
  addQuestion: async (question) => {
    try {
      const res = await fetch('/api/questions', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(question),
      });
      const newQuestion = await res.json();
      set((state) => ({ questions: [newQuestion, ...state.questions] }));
    } catch (error) {
      console.error('Error adding question:', error);
    }
  },
  updateQuestion: async (id, question) => {
    try {
      const res = await fetch(`/api/questions/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(question),
      });
      const updated = await res.json();
      set((state) => ({
        questions: state.questions.map((q) => (q.id === id ? updated : q)),
      }));
    } catch (error) {
      console.error('Error updating question:', error);
    }
  },
  deleteQuestion: async (id) => {
    try {
      await fetch(`/api/questions/${id}`, { method: 'DELETE' });
      set((state) => ({
        questions: state.questions.filter((q) => q.id !== id),
      }));
    } catch (error) {
      console.error('Error deleting question:', error);
    }
  },

  // Campaigns
  campaigns: [],
  fetchCampaigns: async () => {
    try {
      set({ loading: true });
      const res = await fetch('/api/campaigns');
      const campaigns = await res.json();
      set({ campaigns, loading: false });
    } catch (error) {
      console.error('Error fetching campaigns:', error);
      set({ loading: false });
    }
  },
  addCampaign: async (campaign) => {
    try {
      const res = await fetch('/api/campaigns', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(campaign),
      });
      const newCampaign = await res.json();
      set((state) => ({ campaigns: [newCampaign, ...state.campaigns] }));
    } catch (error) {
      console.error('Error adding campaign:', error);
    }
  },
  updateCampaign: async (id, campaign) => {
    try {
      const res = await fetch(`/api/campaigns/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(campaign),
      });
      const updated = await res.json();
      set((state) => ({
        campaigns: state.campaigns.map((c) => (c.id === id ? updated : c)),
      }));
    } catch (error) {
      console.error('Error updating campaign:', error);
    }
  },
  deleteCampaign: async (id) => {
    try {
      await fetch(`/api/campaigns/${id}`, { method: 'DELETE' });
      set((state) => ({
        campaigns: state.campaigns.filter((c) => c.id !== id),
      }));
    } catch (error) {
      console.error('Error deleting campaign:', error);
    }
  },

  // Candidates
  candidates: [],
  fetchCandidates: async () => {
    try {
      set({ loading: true });
      const res = await fetch('/api/candidates');
      const candidates = await res.json();
      set({ candidates, loading: false });
    } catch (error) {
      console.error('Error fetching candidates:', error);
      set({ loading: false });
    }
  },
  addCandidate: async (candidate) => {
    try {
      const res = await fetch('/api/candidates', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(candidate),
      });
      const newCandidate = await res.json();
      set((state) => ({ candidates: [newCandidate, ...state.candidates] }));
    } catch (error) {
      console.error('Error adding candidate:', error);
    }
  },
  updateCandidate: async (id, candidate) => {
    try {
      const res = await fetch(`/api/candidates/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(candidate),
      });
      const updated = await res.json();
      set((state) => ({
        candidates: state.candidates.map((c) => (c.id === id ? updated : c)),
      }));
    } catch (error) {
      console.error('Error updating candidate:', error);
    }
  },
  deleteCandidate: async (id) => {
    try {
      await fetch(`/api/candidates/${id}`, { method: 'DELETE' });
      set((state) => ({
        candidates: state.candidates.filter((c) => c.id !== id),
      }));
    } catch (error) {
      console.error('Error deleting candidate:', error);
    }
  },

  // Departments
  departments: [],
  fetchDepartments: async () => {
    try {
      set({ loading: true });
      const res = await fetch('/api/departments');
      const departments = await res.json();
      set({ departments, loading: false });
    } catch (error) {
      console.error('Error fetching departments:', error);
      set({ loading: false });
    }
  },
  addDepartment: async (department) => {
    try {
      const res = await fetch('/api/departments', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(department),
      });
      const newDepartment = await res.json();
      set((state) => ({ departments: [newDepartment, ...state.departments] }));
    } catch (error) {
      console.error('Error adding department:', error);
    }
  },
  updateDepartment: async (id, department) => {
    try {
      const res = await fetch(`/api/departments/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(department),
      });
      const updated = await res.json();
      set((state) => ({
        departments: state.departments.map((d) => (d.id === id ? updated : d)),
      }));
    } catch (error) {
      console.error('Error updating department:', error);
    }
  },
  deleteDepartment: async (id) => {
    try {
      await fetch(`/api/departments/${id}`, { method: 'DELETE' });
      set((state) => ({
        departments: state.departments.filter((d) => d.id !== id),
      }));
    } catch (error) {
      console.error('Error deleting department:', error);
    }
  },

  // Loading
  loading: false,
  setLoading: (loading) => set({ loading }),
}));

