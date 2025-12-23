"use client";

import { useState, useEffect } from "react";
import {
  PlusIcon,
  MagnifyingGlassIcon,
  FunnelIcon,
  ArrowDownTrayIcon,
  ArrowUpTrayIcon,
  PencilIcon,
  TrashIcon,
  EyeIcon,
  DocumentTextIcon,
} from "@heroicons/react/24/outline";
import type { Question } from "@/types";
import { downloadCSV, formatQuestionsForExport } from "@/utils/csvHelpers";
import toast from "react-hot-toast";
import { QuestionForm } from "@/components/admin/QuestionForm";
import { QuestionDetailModal } from "@/components/admin/QuestionDetailModal";
import { useDBDataStore } from "@/store/dbData";
import { HashLoader } from "react-spinners";
import { Box, CircularProgress } from "@mui/material";
// Mock Questions Data
// const mockQuestions: Question[] = [
//   {
//     id: "1",
//     title: "Implement Binary Search Algorithm",
//     description:
//       "Write a function to perform binary search on a sorted array. The function should return the index of the target element or -1 if not found.",
//     answerType: "code_editor",
//     departmentId: "d1", // Engineering
//     difficulty: "intermediate",
//     skillType: "technical",
//     tags: ["algorithms", "arrays", "binary-search"],
//     marks: 10,
//     codeTemplate:
//       "function binarySearch(arr, target) {\n  // Your code here\n}",
//     createdBy: "admin",
//     createdAt: "2024-01-10T10:00:00Z",
//     updatedAt: "2024-01-10T10:00:00Z",
//   },
//   {
//     id: "2",
//     title: "Explain React Hooks",
//     description:
//       "Describe the purpose and usage of useState and useEffect hooks in React. Provide examples.",
//     answerType: "essay",
//     departmentId: "d1", // Engineering
//     difficulty: "intermediate",
//     skillType: "technical",
//     tags: ["react", "javascript", "hooks"],
//     marks: 10,
//     rubric:
//       "Clear explanation (20pts), Examples (20pts), Best practices (10pts)",
//     createdBy: "admin",
//     createdAt: "2024-01-11T10:00:00Z",
//     updatedAt: "2024-01-11T10:00:00Z",
//   },
//   {
//     id: "3",
//     title: "JavaScript Data Types",
//     description:
//       "Which of the following are primitive data types in JavaScript?",
//     answerType: "multiple_choice",
//     departmentId: "d1", // Engineering
//     difficulty: "beginner",
//     skillType: "technical",
//     tags: ["javascript", "fundamentals"],
//     marks: 10,
//     options: ["String", "Object", "Number", "Array", "Boolean"],
//     correctAnswer: ["String", "Number", "Boolean"],
//     createdBy: "admin",
//     createdAt: "2024-01-12T10:00:00Z",
//     updatedAt: "2024-01-12T10:00:00Z",
//   },
//   {
//     id: "4",
//     title: "System Design: URL Shortener",
//     description:
//       "Design a URL shortening service like bit.ly. Include architecture, database schema, and API endpoints.",
//     answerType: "essay",
//     departmentId: "d1", // Engineering
//     difficulty: "advanced",
//     skillType: "technical",
//     tags: ["system-design", "architecture", "scalability"],
//     marks: 10,
//     rubric:
//       "Architecture (30pts), Database design (25pts), API design (25pts), Scalability considerations (20pts)",
//     createdBy: "admin",
//     createdAt: "2024-01-13T10:00:00Z",
//     updatedAt: "2024-01-13T10:00:00Z",
//   },
//   {
//     id: "5",
//     title: "Problem Solving Skills",
//     description:
//       "Rate your ability to solve complex technical problems under pressure.",
//     answerType: "rating_scale",
//     departmentId: "d1", // Engineering
//     difficulty: "beginner",
//     skillType: "behavioral",
//     tags: ["soft-skills", "self-assessment"],
//     marks: 10,
//     ratingScale: 5,
//     createdBy: "admin",
//     createdAt: "2024-01-14T10:00:00Z",
//     updatedAt: "2024-01-14T10:00:00Z",
//   },
//   {
//     id: "6",
//     title: "Upload Your Portfolio",
//     description:
//       "Upload a PDF containing your best 3 projects with descriptions.",
//     answerType: "file_upload",
//     departmentId: "d1", // Engineering
//     difficulty: "beginner",
//     skillType: "technical",
//     tags: ["portfolio", "projects"],
//     marks: 10,
//     fileTypes: ["pdf", "doc", "docx"],
//     createdBy: "admin",
//     createdAt: "2024-01-15T10:00:00Z",
//     updatedAt: "2024-01-15T10:00:00Z",
//   },
//   {
//     id: "7",
//     title: "Database Normalization",
//     description: "What is the main purpose of database normalization?",
//     answerType: "multiple_choice",
//     departmentId: "d1", // Engineering
//     difficulty: "intermediate",
//     skillType: "technical",
//     tags: ["database", "sql", "normalization"],
//     marks: 10,
//     options: [
//       "To reduce data redundancy",
//       "To increase query speed",
//       "To add more tables",
//       "To compress data",
//     ],
//     correctAnswer: "To reduce data redundancy",
//     createdBy: "admin",
//     createdAt: "2024-01-16T10:00:00Z",
//     updatedAt: "2024-01-16T10:00:00Z",
//   },
//   {
//     id: "8",
//     title: "Build a REST API",
//     description:
//       "Create a RESTful API for a basic todo application with endpoints for CRUD operations.",
//     answerType: "code_editor",
//     departmentId: "d1", // Engineering
//     difficulty: "advanced",
//     skillType: "technical",
//     tags: ["api", "rest", "backend", "nodejs"],
//     marks: 10,
//     codeTemplate:
//       "// Create your REST API endpoints here\n// Use Express.js or your preferred framework",
//     createdBy: "admin",
//     createdAt: "2024-01-17T10:00:00Z",
//     updatedAt: "2024-01-17T10:00:00Z",
//   },
// ];

const answerTypeLabels: Record<string, string> = {
  multiple_choice: "Multiple Choice",
  code_editor: "Code Editor",
  essay: "Essay",
  file_upload: "File Upload",
  rating_scale: "Rating Scale",
};

const difficultyColors = {
  beginner: "badge-success",
  intermediate: "badge-warning",
  advanced: "badge-danger",
};

const skillTypeColors = {
  technical: "badge-primary",
  behavioral: "badge-secondary",
  logical: "badge-gray",
};

export default function QuestionsPage() {
  const {
    questions,
    addQuestion,
    updateQuestion,
    deleteQuestion,
    fetchQuestions,
  } = useDBDataStore();
  const loading = useDBDataStore((state) => state.loading);
  const [searchQuery, setSearchQuery] = useState("");
  const [typeFilter, setTypeFilter] = useState<"all" | Question["answerType"]>(
    "all"
  );
  const [difficultyFilter, setDifficultyFilter] = useState<
    "all" | Question["difficulty"]
  >("all");
  const [skillFilter, setSkillFilter] = useState<"all" | Question["skillType"]>(
    "all"
  );
  const [selectedQuestions, setSelectedQuestions] = useState<string[]>([]);

  // Modal states
  const [showForm, setShowForm] = useState(false);
  const [showDetail, setShowDetail] = useState(false);
  const [editingQuestion, setEditingQuestion] = useState<Question | null>(null);
  const [viewingQuestion, setViewingQuestion] = useState<Question | null>(null);

  // Fetch questions from database on mount
  useEffect(() => {
    fetchQuestions();
  }, [fetchQuestions]);

  const filteredQuestions = questions.filter((q) => {
    // Safety checks for undefined values
    if (!q || !q.title || !q.description) return false;

    const matchesSearch =
      q.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      q.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (q.tags &&
        Array.isArray(q.tags) &&
        q.tags.some((tag) =>
          tag.toLowerCase().includes(searchQuery.toLowerCase())
        ));
    const matchesType = typeFilter === "all" || q.answerType === typeFilter;
    const matchesDifficulty =
      difficultyFilter === "all" || q.difficulty === difficultyFilter;
    const matchesSkill = skillFilter === "all" || q.skillType === skillFilter;
    return matchesSearch && matchesType && matchesDifficulty && matchesSkill;
  });

  const handleExport = () => {
    const dataToExport = formatQuestionsForExport(questions);
    downloadCSV(dataToExport, "questions_export");
    toast.success("Questions exported successfully");
  };

  const handleDelete = (id: string) => {
    if (confirm("Are you sure you want to delete this question?")) {
      deleteQuestion(id);
      toast.success("Question deleted successfully");
    }
  };

  const handleCreateQuestion = (data: any) => {
    const newQuestion: Question = {
      id: `q-${Date.now()}`,
      ...data,
    };
    addQuestion(newQuestion);
  };

  const handleUpdateQuestion = (data: any) => {
    if (!editingQuestion) return;
    const updatedQuestion = { ...editingQuestion, ...data };
    updateQuestion(editingQuestion.id, updatedQuestion);
    setEditingQuestion(null);
  };

  const toggleSelectAll = () => {
    if (selectedQuestions.length === filteredQuestions.length) {
      setSelectedQuestions([]);
    } else {
      setSelectedQuestions(filteredQuestions.map((q) => q.id));
    }
  };

  const toggleSelect = (id: string) => {
    setSelectedQuestions((prev) =>
      prev.includes(id) ? prev.filter((qid) => qid !== id) : [...prev, id]
    );
  };

  if (loading) {
    return (
      <Box
        sx={{
          height: "70vh",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        <HashLoader color="#265145" size={80} />
      </Box>
    );
  }
  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Question Bank</h1>
          <p className="text-gray-600 mt-1">Manage your interview questions</p>
        </div>
        <div className="flex items-center gap-3">
          <button className="btn-outline flex items-center gap-2">
            <ArrowUpTrayIcon className="w-4 h-4" />
            Import CSV
          </button>
          <button
            onClick={handleExport}
            className="btn-outline flex items-center gap-2"
          >
            <ArrowDownTrayIcon className="w-4 h-4" />
            Export
          </button>
          <button
            onClick={() => {
              setEditingQuestion(null);
              setShowForm(true);
            }}
            className="btn-primary flex items-center gap-2"
          >
            <PlusIcon className="w-4 h-4" />
            Add Question
          </button>
        </div>
      </div>

      {/* Statistics */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div className="card p-4">
          <p className="text-sm text-gray-600">Total Questions</p>
          <p className="text-2xl font-bold text-gray-900 mt-1">
            {questions.length}
          </p>
        </div>
        <div className="card p-4">
          <p className="text-sm text-gray-600">Code Editor</p>
          <p className="text-2xl font-bold text-gray-900 mt-1">
            {questions.filter((q) => q.answerType === "code_editor").length}
          </p>
        </div>
        <div className="card p-4">
          <p className="text-sm text-gray-600">Multiple Choice</p>
          <p className="text-2xl font-bold text-gray-900 mt-1">
            {questions.filter((q) => q.answerType === "multiple_choice").length}
          </p>
        </div>
        <div className="card p-4">
          <p className="text-sm text-gray-600">Essay</p>
          <p className="text-2xl font-bold text-gray-900 mt-1">
            {questions.filter((q) => q.answerType === "essay").length}
          </p>
        </div>
      </div>

      {/* Filters */}
      <div className="card p-4">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
          <div className="lg:col-span-2 relative">
            <MagnifyingGlassIcon className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
            <input
              type="text"
              placeholder="Search questions, tags..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="input pl-10"
            />
          </div>
          <select
            value={typeFilter}
            onChange={(e) => setTypeFilter(e.target.value as any)}
            className="input"
          >
            <option value="all">All Types</option>
            <option value="multiple_choice">Multiple Choice</option>
            <option value="code_editor">Code Editor</option>
            <option value="essay">Essay</option>
            <option value="file_upload">File Upload</option>
            <option value="rating_scale">Rating Scale</option>
          </select>
          <select
            value={difficultyFilter}
            onChange={(e) => setDifficultyFilter(e.target.value as any)}
            className="input"
          >
            <option value="all">All Difficulties</option>
            <option value="beginner">Beginner</option>
            <option value="intermediate">Intermediate</option>
            <option value="advanced">Advanced</option>
          </select>
          <select
            value={skillFilter}
            onChange={(e) => setSkillFilter(e.target.value as any)}
            className="input"
          >
            <option value="all">All Skills</option>
            <option value="technical">Technical</option>
            <option value="behavioral">Behavioral</option>
            <option value="logical">Logical</option>
          </select>
        </div>
      </div>

      {/* Bulk Actions */}
      {selectedQuestions.length > 0 && (
        <div className="card p-4 bg-primary-50 border-primary-200">
          <div className="flex items-center justify-between">
            <span className="text-sm font-medium text-primary-900">
              {selectedQuestions.length} question
              {selectedQuestions.length > 1 ? "s" : ""} selected
            </span>
            <div className="flex items-center gap-3">
              <button className="btn-outline text-sm">Export Selected</button>
              <button className="btn-outline text-sm text-danger-600">
                Delete Selected
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Questions Table - Responsive */}
      <div className="card overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full min-w-full table-fixed">
            <thead className="bg-gray-50 border-b border-gray-200">
              <tr>
                <th className="text-left px-3 py-3 w-10">
                  <input
                    type="checkbox"
                    checked={
                      selectedQuestions.length === filteredQuestions.length &&
                      filteredQuestions.length > 0
                    }
                    onChange={toggleSelectAll}
                    className="rounded border-gray-300"
                  />
                </th>
                <th className="text-left text-xs font-medium text-gray-500 uppercase px-3 py-3 w-[35%]">
                  Question
                </th>
                <th className="text-left text-xs font-medium text-gray-500 uppercase px-3 py-3 w-[12%]">
                  Type
                </th>
                <th className="text-left text-xs font-medium text-gray-500 uppercase px-3 py-3 w-[10%]">
                  Difficulty
                </th>
                <th className="text-left text-xs font-medium text-gray-500 uppercase px-3 py-3 w-[10%]">
                  Skill
                </th>
                <th className="text-left text-xs font-medium text-gray-500 uppercase px-3 py-3 w-[8%]">
                  Points
                </th>
                <th className="text-left text-xs font-medium text-gray-500 uppercase px-3 py-3 w-[10%]">
                  Tags
                </th>
                <th className="text-right text-xs font-medium text-gray-500 uppercase px-3 py-3 w-[10%]">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {filteredQuestions.map((question) => (
                <tr key={question.id} className="hover:bg-gray-50">
                  <td className="px-3 py-4">
                    <input
                      type="checkbox"
                      checked={selectedQuestions.includes(question.id)}
                      onChange={() => toggleSelect(question.id)}
                      className="rounded border-gray-300"
                    />
                  </td>
                  <td className="px-3 py-4">
                    <div>
                      <p
                        className="text-sm font-medium text-gray-900 truncate"
                        title={question.title}
                      >
                        {question.title}
                      </p>
                      <p
                        className="text-xs text-gray-500 truncate mt-1"
                        title={question.description}
                      >
                        {question.description}
                      </p>
                    </div>
                  </td>
                  <td className="px-3 py-4">
                    <span className="text-xs text-gray-700 block truncate">
                      {answerTypeLabels[question.answerType]}
                    </span>
                  </td>
                  <td className="px-3 py-4">
                    <span
                      className={`badge ${
                        difficultyColors[question.difficulty]
                      } capitalize text-xs whitespace-nowrap`}
                    >
                      {question.difficulty}
                    </span>
                  </td>
                  <td className="px-3 py-4">
                    <span
                      className={`badge ${
                        skillTypeColors[question.skillType]
                      } capitalize text-xs whitespace-nowrap`}
                    >
                      {question.skillType}
                    </span>
                  </td>
                  <td className="px-3 py-4">
                    <span className="text-sm font-semibold text-gray-900 whitespace-nowrap">
                      10
                    </span>
                  </td>
                  <td className="px-3 py-4">
                    <div className="flex flex-wrap gap-1">
                      {question.tags.slice(0, 1).map((tag) => (
                        <span
                          key={tag}
                          className="badge badge-gray text-xs truncate max-w-[60px]"
                          title={tag}
                        >
                          {tag}
                        </span>
                      ))}
                      {question.tags.length > 1 && (
                        <span className="badge badge-gray text-xs">
                          +{question.tags.length - 1}
                        </span>
                      )}
                    </div>
                  </td>
                  <td className="px-3 py-4">
                    <div className="flex items-center justify-end gap-1">
                      <button
                        title="View"
                        onClick={() => {
                          setViewingQuestion(question);
                          setShowDetail(true);
                        }}
                        className="p-1.5 text-gray-400 hover:text-primary-600"
                      >
                        <EyeIcon className="w-4 h-4" />
                      </button>
                      <button
                        title="Edit"
                        onClick={() => {
                          setEditingQuestion(question);
                          setShowForm(true);
                        }}
                        className="p-1.5 text-gray-400 hover:text-primary-600"
                      >
                        <PencilIcon className="w-4 h-4" />
                      </button>
                      <button
                        title="Delete"
                        onClick={() => handleDelete(question.id)}
                        className="p-1.5 text-gray-400 hover:text-danger-600"
                      >
                        <TrashIcon className="w-4 h-4" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Pagination */}
        <div className="px-6 py-4 border-t border-gray-200 flex items-center justify-between">
          <p className="text-sm text-gray-600">
            Showing {filteredQuestions.length} of {questions.length} questions
          </p>
          <div className="flex items-center gap-2">
            <button className="btn-outline px-3 py-1 text-sm" disabled>
              Previous
            </button>
            <button className="px-3 py-1 text-sm bg-primary-600 text-white rounded-lg">
              1
            </button>
            <button className="px-3 py-1 text-sm text-gray-600 hover:bg-gray-100 rounded-lg">
              2
            </button>
            <button className="btn-outline px-3 py-1 text-sm">Next</button>
          </div>
        </div>
      </div>

      {/* Empty State */}
      {filteredQuestions.length === 0 && (
        <div className="card p-12 text-center">
          <DocumentTextIcon className="w-16 h-16 mx-auto text-gray-400 mb-4" />
          <h3 className="text-lg font-medium text-gray-900 mb-2">
            No questions found
          </h3>
          <p className="text-gray-600 mb-6">
            {searchQuery || typeFilter !== "all" || difficultyFilter !== "all"
              ? "Try adjusting your filters"
              : "Get started by creating your first question"}
          </p>
          {!searchQuery && typeFilter === "all" && (
            <button
              onClick={() => {
                setEditingQuestion(null);
                setShowForm(true);
              }}
              className="btn-primary inline-flex items-center gap-2"
            >
              <PlusIcon className="w-4 h-4" />
              Add Question
            </button>
          )}
        </div>
      )}

      {/* Modals */}
      {showForm && (
        <QuestionForm
          question={editingQuestion}
          onClose={() => {
            setShowForm(false);
            setEditingQuestion(null);
          }}
          onSubmit={
            editingQuestion ? handleUpdateQuestion : handleCreateQuestion
          }
        />
      )}

      {showDetail && viewingQuestion && (
        <QuestionDetailModal
          question={viewingQuestion}
          onClose={() => {
            setShowDetail(false);
            setViewingQuestion(null);
          }}
          onEdit={() => {
            setEditingQuestion(viewingQuestion);
            setShowDetail(false);
            setShowForm(true);
          }}
        />
      )}
    </div>
  );
}
