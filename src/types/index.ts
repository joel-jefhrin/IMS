// Core Types for Interview Management System

export type AnswerType = 'multiple_choice' | 'code_editor' | 'essay' | 'file_upload' | 'rating_scale';
export type DifficultyLevel = 'beginner' | 'intermediate' | 'advanced';
export type SkillType = 'technical' | 'behavioral' | 'logical';
export type CampaignStatus = 'draft' | 'active' | 'completed' | 'archived';
export type CandidateStatus = 'invited' | 'in_progress' | 'completed' | 'not_started';

export interface Campaign {
  id: string;
  name: string;
  description: string;
  departmentId: string;
  startDate: string;
  endDate: string;
  durationPerCandidate: number;
  status: CampaignStatus;
  questionSetIds: string[];
  questionsPerCandidate: number;
  isRandomized: boolean;
  passingScore: number; // Campaign-level passing percentage
  passingCriteria?: string;
  totalCandidates: number;
  completedCandidates: number;
  averageScore: number;
  createdBy: string;
  createdAt: string;
  updatedAt: string;
}

export interface Candidate {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  phone?: string;
  education: {
    degree: string;
    institution: string;
    graduationYear: number;
    gpa?: string;
  };
  preferredDepartmentId: string;
  campaignId: string;
  status: CandidateStatus;
  assignedQuestions: string[];
  answers: any[];
  score: number;
  rank?: number;
  tempPassword: string;
  interviewStartedAt?: string;
  interviewCompletedAt?: string;
  createdAt: string;
  updatedAt: string;
}

export interface Question {
  id: string;
  title: string;
  description: string;
  answerType: AnswerType;
  departmentId: string;
  difficulty: DifficultyLevel;
  skillType: SkillType;
  tags: string[];
  marks: 10; // Fixed 10 points per question
  options?: string[];
  correctAnswer?: string | string[];
  codeTemplate?: string;
  rubric?: string;
  fileTypes?: string[];
  ratingScale?: number;
  solutionTemplate?: string;
  createdBy: string;
  createdAt: string;
  updatedAt: string;
}

export interface CampaignFormData {
  name: string;
  description: string;
  departmentId: string;
  startDate: string;
  endDate: string;
  durationPerCandidate: number; // Manual duration in minutes
  questionSetIds: string[];
  questionsPerCandidate: number;
  isRandomized: boolean;
  passingScore: number; // Pass percentage (0-100)
  passingCriteria?: string;
}

export interface CandidateFormData {
  firstName: string;
  lastName: string;
  email: string;
  phone?: string;
  degree: string;
  institution: string;
  graduationYear: number;
  gpa?: string;
  preferredDepartmentId: string;
}

export interface Department {
  id: string;
  name: string;
  description?: string;
  createdAt: string;
  updatedAt: string;
}

