"use client";

import { useState, useEffect } from "react";
import { XMarkIcon, PlusIcon, TrashIcon } from "@heroicons/react/24/outline";
import type { Question } from "@/types";
import toast from "react-hot-toast";
import { useDBDataStore } from "@/store/dbData";

interface QuestionFormProps {
  question?: Question | null;
  onClose: () => void;
  onSubmit: (data: any) => void;
}

export function QuestionForm({
  question,
  onClose,
  onSubmit,
}: QuestionFormProps) {
  const isEdit = !!question;
  const { departments, fetchDepartments } = useDBDataStore();

  // Fetch departments on mount
  useEffect(() => {
    if (departments.length === 0) {
      fetchDepartments();
    }
  }, [fetchDepartments]);

  const [formData, setFormData] = useState({
    title: question?.title || "",
    description: question?.description || "",
    answerType: question?.answerType || "multiple_choice",
    departmentId: question?.departmentId || "",
    difficulty: question?.difficulty || "beginner",
    skillType: question?.skillType || "technical",
    tags: question?.tags?.join(", ") || "",
    // Type-specific
    options: question?.options || [""],
    correctAnswer: Array.isArray(question?.correctAnswer)
      ? question.correctAnswer.join(", ")
      : question?.correctAnswer || "",
    codeTemplate: question?.codeTemplate || "",
    rubric: question?.rubric || "",
    fileTypes: question?.fileTypes?.join(", ") || "pdf, doc, docx",
    ratingScale: question?.ratingScale || 5,
  });

  const handleChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
    >
  ) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleOptionChange = (index: number, value: string) => {
    const newOptions = [...formData.options];
    newOptions[index] = value;
    setFormData({ ...formData, options: newOptions });
  };

  const addOption = () => {
    setFormData({ ...formData, options: [...formData.options, ""] });
  };

  const removeOption = (index: number) => {
    const newOptions = formData.options.filter((_, i) => i !== index);
    setFormData({ ...formData, options: newOptions });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    // Validation
    if (!formData.departmentId) {
      toast.error("Please select a department");
      return;
    }

    const questionData = {
      ...(question?.id && { id: question.id }), // Include ID when editing
      title: formData.title,
      description: formData.description,
      answerType: formData.answerType,
      departmentId: formData.departmentId,
      difficulty: formData.difficulty,
      skillType: formData.skillType,
      marks: 10, // Fixed 10 points per question
      tags: formData.tags
        .split(",")
        .map((t) => t.trim())
        .filter(Boolean),
      createdBy: question?.createdBy || "admin",
      createdAt: question?.createdAt || new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      // Type-specific fields
      ...(formData.answerType === "multiple_choice" && {
        options: formData.options.filter(Boolean),
        correctAnswer: formData.correctAnswer.includes(",")
          ? formData.correctAnswer.split(",").map((a) => a.trim())
          : formData.correctAnswer,
      }),
      ...(formData.answerType === "code_editor" && {
        codeTemplate: formData.codeTemplate,
      }),
      ...(formData.answerType === "essay" && {
        rubric: formData.rubric,
      }),
      ...(formData.answerType === "file_upload" && {
        fileTypes: formData.fileTypes.split(",").map((t) => t.trim()),
      }),
      ...(formData.answerType === "rating_scale" && {
        ratingScale: Number(formData.ratingScale),
      }),
    };

    onSubmit(questionData);
    toast.success(isEdit ? "Question updated!" : "Question created!");
    onClose();
  };

  return (
    <div className="fixed inset-0 bg-gray-900/50 z-50 flex items-center justify-center p-4 overflow-y-auto">
      <div className="card max-w-4xl w-full my-8 max-h-[90vh] overflow-y-auto">
        <div className="p-6 border-b border-gray-200 flex items-center justify-between sticky top-0 bg-white z-10">
          <h2 className="text-xl font-semibold text-gray-900">
            {isEdit ? "Edit Question" : "Create New Question"}
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
              Basic Information
            </h3>
            <div className="space-y-4">
              <div>
                <label className="label">Question Title *</label>
                <input
                  name="title"
                  value={formData.title}
                  onChange={handleChange}
                  className="input"
                  placeholder="e.g., Implement Binary Search"
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
                  placeholder="Detailed description of the question..."
                  required
                />
              </div>

              {/* Department Selector */}
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
                  {departments.map((dept) => (
                    <option key={dept.id} value={dept.id}>
                      {dept.name}
                    </option>
                  ))}
                </select>
                <p className="text-xs text-gray-500 mt-1">
                  This question will be available for campaigns in the selected
                  department
                </p>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="label">Answer Type *</label>
                  <select
                    name="answerType"
                    value={formData.answerType}
                    onChange={handleChange}
                    className="input"
                  >
                    <option value="multiple_choice">Multiple Choice</option>
                    <option value="code_editor">Code Editor</option>
                    <option value="essay">Essay</option>
                    <option value="file_upload">File Upload</option>
                    <option value="rating_scale">Rating Scale</option>
                  </select>
                </div>

                <div>
                  <label className="label">Difficulty *</label>
                  <select
                    name="difficulty"
                    value={formData.difficulty}
                    onChange={handleChange}
                    className="input"
                  >
                    <option value="beginner">Beginner</option>
                    <option value="intermediate">Intermediate</option>
                    <option value="advanced">Advanced</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-3 gap-4">
                <div>
                  <label className="label">Skill Type *</label>
                  <select
                    name="skillType"
                    value={formData.skillType}
                    onChange={handleChange}
                    className="input"
                  >
                    <option value="technical">Technical</option>
                    <option value="behavioral">Behavioral</option>
                    <option value="logical">Logical</option>
                  </select>
                </div>

                <div>
                  <label className="label">Points</label>
                  <div className="input bg-gray-50 text-gray-600 cursor-not-allowed flex items-center justify-between">
                    <span>10 points</span>
                    <span className="text-xs">(Fixed per question)</span>
                  </div>
                </div>
              </div>

              <div>
                <label className="label">Tags (comma-separated)</label>
                <input
                  name="tags"
                  value={formData.tags}
                  onChange={handleChange}
                  className="input"
                  placeholder="javascript, arrays, algorithms"
                />
              </div>
            </div>
          </div>

          {/* Type-Specific Fields */}
          {formData.answerType === "multiple_choice" && (
            <div className="pt-6 border-t">
              <h3 className="text-lg font-medium text-gray-900 mb-4">
                Multiple Choice Options
              </h3>
              <div className="space-y-3">
                {formData.options.map((option, index) => (
                  <div key={index} className="flex items-center gap-2">
                    <input
                      value={option}
                      onChange={(e) =>
                        handleOptionChange(index, e.target.value)
                      }
                      className="input flex-1"
                      placeholder={`Option ${index + 1}`}
                      required
                    />
                    {formData.options.length > 1 && (
                      <button
                        type="button"
                        onClick={() => removeOption(index)}
                        className="p-2 text-danger-600 hover:bg-danger-50 rounded"
                      >
                        <TrashIcon className="w-5 h-5" />
                      </button>
                    )}
                  </div>
                ))}
                <button
                  type="button"
                  onClick={addOption}
                  className="btn-outline text-sm flex items-center gap-2"
                >
                  <PlusIcon className="w-4 h-4" />
                  Add Option
                </button>
              </div>
              <div className="mt-4">
                <label className="label">Correct Answer(s) *</label>
                <input
                  name="correctAnswer"
                  value={formData.correctAnswer}
                  onChange={handleChange}
                  className="input"
                  placeholder="Option 1 (or: Option 1, Option 2 for multiple)"
                  required
                />
                <p className="text-xs text-gray-500 mt-1">
                  Enter one answer or multiple comma-separated answers
                </p>
              </div>
            </div>
          )}

          {formData.answerType === "code_editor" && (
            <div className="pt-6 border-t">
              <h3 className="text-lg font-medium text-gray-900 mb-4">
                Code Template
              </h3>
              <textarea
                name="codeTemplate"
                value={formData.codeTemplate}
                onChange={handleChange}
                className="input font-mono text-sm"
                rows={8}
                placeholder="function solution() {\n  // Your code here\n}"
              />
            </div>
          )}

          {formData.answerType === "essay" && (
            <div className="pt-6 border-t">
              <h3 className="text-lg font-medium text-gray-900 mb-4">
                Grading Rubric
              </h3>
              <textarea
                name="rubric"
                value={formData.rubric}
                onChange={handleChange}
                className="input"
                rows={4}
                placeholder="Clarity (25pts), Examples (25pts), Best Practices (50pts)"
              />
            </div>
          )}

          {formData.answerType === "file_upload" && (
            <div className="pt-6 border-t">
              <h3 className="text-lg font-medium text-gray-900 mb-4">
                Allowed File Types
              </h3>
              <input
                name="fileTypes"
                value={formData.fileTypes}
                onChange={handleChange}
                className="input"
                placeholder="pdf, doc, docx"
              />
              <p className="text-xs text-gray-500 mt-1">
                Comma-separated file extensions
              </p>
            </div>
          )}

          {formData.answerType === "rating_scale" && (
            <div className="pt-6 border-t">
              <h3 className="text-lg font-medium text-gray-900 mb-4">
                Rating Scale
              </h3>
              <select
                name="ratingScale"
                value={formData.ratingScale}
                onChange={handleChange}
                className="input w-48"
              >
                <option value="5">1 to 5</option>
                <option value="10">1 to 10</option>
              </select>
            </div>
          )}

          {/* Actions */}
          <div className="flex items-center gap-3 pt-6 border-t">
            <button type="submit" className="btn-primary flex-1">
              {isEdit ? "Update Question" : "Create Question"}
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
