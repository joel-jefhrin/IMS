"use client";

import { useState, useEffect } from "react";
import { XMarkIcon, CheckIcon } from "@heroicons/react/24/outline";
import type { Campaign } from "@/types";
import toast from "react-hot-toast";

// Mock departments list
const mockDepartments = [
  { id: "d1", name: "Engineering" },
  { id: "d2", name: "Product Design" },
  { id: "d3", name: "Data Science" },
  { id: "d4", name: "Marketing" },
  { id: "d5", name: "Sales" },
];

// For now, keeping as placeholder - actual questions should be passed as prop
const mockQuestions: any[] = [];

interface CampaignFormProps {
  campaign?: Campaign | null;
  onClose: () => void;
  onSubmit: (data: any) => void;
  availableQuestions?: any[]; // Pass questions from parent
}

export function CampaignForm({
  campaign,
  onClose,
  onSubmit,
  availableQuestions = mockQuestions,
}: CampaignFormProps) {
  const isEdit = !!campaign;

  const [formData, setFormData] = useState({
    name: campaign?.name || "",
    description: campaign?.description || "",
    departmentId: campaign?.departmentId || "",
    status: campaign?.status || "draft",
    startDate: campaign?.startDate || new Date().toISOString().split("T")[0],
    endDate:
      campaign?.endDate ||
      new Date(Date.now() + 30 * 24 * 60 * 60 * 1000)
        .toISOString()
        .split("T")[0],
    durationPerCandidate: campaign?.durationPerCandidate || 90,
    questionsPerCandidate: campaign?.questionsPerCandidate || 10,
    passingScore: campaign?.passingScore || 70,
    isRandomized:
      campaign?.isRandomized !== undefined ? campaign.isRandomized : true,
  });

  const [selectedQuestionIds, setSelectedQuestionIds] = useState<string[]>(
    campaign?.questionSetIds || []
  );

  // Filter questions by selected department
  const filteredQuestions = availableQuestions.filter(
    (q) => q.departmentId === formData.departmentId
  );

  // Reset selected questions when department changes
  useEffect(() => {
    if (!isEdit) {
      setSelectedQuestionIds([]);
    }
  }, [formData.departmentId, isEdit]);

  // Clean up invalid question IDs (ones that don't exist in available questions)
  useEffect(() => {
    const validQuestionIds = availableQuestions.map((q) => q.id);
    const cleanedIds = selectedQuestionIds.filter((id) =>
      validQuestionIds.includes(id)
    );
    if (cleanedIds.length !== selectedQuestionIds.length) {
      setSelectedQuestionIds(cleanedIds);
    }
  }, [availableQuestions, selectedQuestionIds]);

  const handleChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
    >
  ) => {
    const value =
      e.target.type === "checkbox"
        ? (e.target as HTMLInputElement).checked
        : e.target.value;
    setFormData({ ...formData, [e.target.name]: value });
  };

  const toggleQuestion = (questionId: string) => {
    if (selectedQuestionIds.includes(questionId)) {
      setSelectedQuestionIds(
        selectedQuestionIds.filter((id) => id !== questionId)
      );
    } else {
      setSelectedQuestionIds([...selectedQuestionIds, questionId]);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    // Validation
    if (!formData.departmentId) {
      toast.error("Please select a department");
      return;
    }

    if (selectedQuestionIds.length === 0) {
      toast.error("Please select at least one question");
      return;
    }

    onSubmit({
      ...formData,
      questionSetIds: selectedQuestionIds,
      durationPerCandidate: Number(formData.durationPerCandidate),
      questionsPerCandidate: Number(formData.questionsPerCandidate),
      passingScore: Number(formData.passingScore),
    });
    toast.success(isEdit ? "Campaign updated!" : "Campaign created!");
    onClose();
  };

  const departmentName = mockDepartments.find(
    (d) => d.id === formData.departmentId
  )?.name;

  // Calculate total marks (10 points per question)
  const totalMarks = selectedQuestionIds.length * 10;

  return (
    <div className="fixed inset-0 bg-gray-900/50 z-50 flex items-center justify-center p-4 overflow-y-auto">
      <div className="card max-w-4xl w-full my-8 max-h-[90vh] overflow-y-auto">
        <div className="p-6 border-b border-gray-200 flex items-center justify-between sticky top-0 bg-white z-10">
          <h2 className="text-xl font-semibold text-gray-900">
            {isEdit ? "Edit Campaign" : "Create New Campaign"}
          </h2>
          <button
            onClick={onClose}
            className="p-2 text-gray-400 hover:text-gray-600"
          >
            <XMarkIcon className="w-5 h-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-6">
          {/* Basic Info */}
          <div>
            <h3 className="text-lg font-medium text-gray-900 mb-4">
              Campaign Details
            </h3>
            <div className="space-y-4">
              <div>
                <label className="label">Campaign Name *</label>
                <input
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  className="input"
                  placeholder="e.g., Software Engineering - Q1 2024"
                  required
                />
              </div>

              <div>
                <label className="label">Description *</label>
                <textarea
                  name="description"
                  value={formData.description}
                  onChange={handleChange}
                  className="input"
                  rows={3}
                  placeholder="Brief description of the campaign..."
                  required
                />
              </div>

              <div>
                <label className="label">Department *</label>
                <select
                  name="departmentId"
                  value={formData.departmentId}
                  onChange={handleChange}
                  className="input"
                  required
                >
                  <option value="">Select a department...</option>
                  {mockDepartments.map((dept) => (
                    <option key={dept.id} value={dept.id}>
                      {dept.name}
                    </option>
                  ))}
                </select>
                <p className="text-xs text-gray-500 mt-1">
                  Campaign will use questions from the selected department
                </p>
              </div>

              <div>
                <label className="label">Status *</label>
                <select
                  name="status"
                  value={formData.status}
                  onChange={handleChange}
                  className="input"
                  required
                >
                  <option value="draft">Draft</option>
                  <option value="active">Active</option>
                  <option value="completed">Completed</option>
                  <option value="archived">Archived</option>
                </select>
                <p className="text-xs text-gray-500 mt-1">
                  Only <strong>Active</strong> campaigns allow candidates to
                  login and take interviews
                </p>
              </div>
            </div>
          </div>

          {/* Question Selection */}
          {formData.departmentId && (
            <div className="pt-6 border-t">
              <h3 className="text-lg font-medium text-gray-900 mb-2">
                Select Questions ({selectedQuestionIds.length} selected •{" "}
                {totalMarks} points total)
              </h3>
              <p className="text-sm text-gray-600 mb-4">
                Available questions from <strong>{departmentName}</strong>{" "}
                department • Each question = 10 points
              </p>

              {filteredQuestions.length === 0 ? (
                <div className="p-8 text-center bg-gray-50 rounded-lg border border-gray-200">
                  <p className="text-gray-600">
                    No questions available for this department yet.
                  </p>
                  <p className="text-sm text-gray-500 mt-1">
                    Create questions first in the Questions module.
                  </p>
                </div>
              ) : (
                <div className="grid md:grid-cols-2 gap-3 max-h-96 overflow-y-auto p-1">
                  {filteredQuestions.map((question) => {
                    const isSelected = selectedQuestionIds.includes(
                      question.id
                    );
                    return (
                      <div
                        key={question.id}
                        onClick={() => toggleQuestion(question.id)}
                        className={`p-4 rounded-lg border-2 cursor-pointer transition-all ${
                          isSelected
                            ? "border-primary-500 bg-primary-50"
                            : "border-gray-200 hover:border-gray-300 bg-white"
                        }`}
                      >
                        <div className="flex items-start gap-3">
                          <div
                            className={`w-5 h-5 rounded border-2 flex-shrink-0 mt-0.5 flex items-center justify-center ${
                              isSelected
                                ? "border-primary-500 bg-primary-500"
                                : "border-gray-300"
                            }`}
                          >
                            {isSelected && (
                              <CheckIcon className="w-3 h-3 text-white" />
                            )}
                          </div>
                          <div className="flex-1">
                            <p className="font-medium text-gray-900 text-sm">
                              {question.title}
                            </p>
                            <div className="flex gap-2 mt-2">
                              <span
                                className={`badge badge-sm ${
                                  question.difficulty === "beginner"
                                    ? "badge-success"
                                    : question.difficulty === "intermediate"
                                    ? "badge-warning"
                                    : "badge-danger"
                                }`}
                              >
                                {question.difficulty}
                              </span>
                              <span className="badge badge-sm badge-info">
                                {question.skillType}
                              </span>
                            </div>
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>
          )}

          {/* Campaign Settings */}
          <div className="pt-6 border-t">
            <h3 className="text-lg font-medium text-gray-900 mb-4">
              Campaign Settings
            </h3>
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="label">Start Date *</label>
                  <input
                    type="date"
                    name="startDate"
                    value={formData.startDate}
                    onChange={handleChange}
                    className="input"
                    required
                  />
                </div>
                <div>
                  <label className="label">End Date *</label>
                  <input
                    type="date"
                    name="endDate"
                    value={formData.endDate}
                    onChange={handleChange}
                    className="input"
                    required
                  />
                </div>
              </div>

              <div className="grid grid-cols-3 gap-4">
                <div>
                  <label className="label">Duration (min) *</label>
                  <input
                    type="number"
                    name="durationPerCandidate"
                    value={formData.durationPerCandidate}
                    onChange={handleChange}
                    className="input"
                    min="1"
                    required
                    placeholder="e.g., 60"
                  />
                  <p className="text-xs text-gray-600 mt-1">
                    Set the total time allowed for this campaign
                  </p>
                </div>
                <div>
                  <label className="label">Questions per Candidate *</label>
                  <input
                    type="number"
                    name="questionsPerCandidate"
                    value={formData.questionsPerCandidate}
                    onChange={handleChange}
                    className="input"
                    min="1"
                    max={selectedQuestionIds.length || 999}
                    required
                  />
                  <p className="text-xs text-gray-500 mt-1">
                    Max: {selectedQuestionIds.length} (total selected)
                  </p>
                </div>
                <div>
                  <label className="label">Passing Score % *</label>
                  <input
                    type="number"
                    name="passingScore"
                    value={formData.passingScore}
                    onChange={handleChange}
                    className="input"
                    min="0"
                    max="100"
                    required
                  />
                </div>
              </div>

              <div className="flex items-center gap-2">
                <input
                  type="checkbox"
                  id="isRandomized"
                  name="isRandomized"
                  checked={formData.isRandomized}
                  onChange={handleChange}
                  className="rounded border-gray-300"
                />
                <label htmlFor="isRandomized" className="text-sm text-gray-700">
                  Randomize question order for each candidate
                </label>
              </div>
            </div>
          </div>

          {/* Actions */}
          <div className="flex items-center gap-3 pt-6 border-t">
            <button type="submit" className="btn flex-1">
              {isEdit ? "Update Campaign" : "Create Campaign"}
            </button>
            <button
              type="button"
              onClick={onClose}
              className="btn-outline flex-1"
            >
              Cancel
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
