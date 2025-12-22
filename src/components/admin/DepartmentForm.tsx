"use client";

import { useState, useEffect } from "react";
import { XMarkIcon } from "@heroicons/react/24/outline";
import toast from "react-hot-toast";

interface DepartmentFormProps {
  department?: any | null;
  onClose: () => void;
  onSubmit: (data: any) => void;
}

export function DepartmentForm({
  department,
  onClose,
  onSubmit,
}: DepartmentFormProps) {
  const isEdit = !!department;

  const [formData, setFormData] = useState({
    name: department?.name || "",
    description: department?.description || "",
    technicalWeight: department?.evaluationCriteria?.technicalWeight || 50,
    behavioralWeight: department?.evaluationCriteria?.behavioralWeight || 30,
    logicalWeight: department?.evaluationCriteria?.logicalWeight || 20,
    passingScore: department?.evaluationCriteria?.passingScore || 70,
    rankingMethod: department?.evaluationCriteria?.rankingMethod || "weighted",
  });

  // Calculate total weight
  const totalWeight =
    Number(formData.technicalWeight) +
    Number(formData.behavioralWeight) +
    Number(formData.logicalWeight);
  const isWeightValid = totalWeight === 100;

  const handleChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
    >
  ) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (!isWeightValid) {
      toast.error("Total weight must equal 100%");
      return;
    }

    onSubmit({
      name: formData.name,
      description: formData.description,
      evaluationCriteria: {
        technicalWeight: Number(formData.technicalWeight),
        behavioralWeight: Number(formData.behavioralWeight),
        logicalWeight: Number(formData.logicalWeight),
        passingScore: Number(formData.passingScore),
        rankingMethod: formData.rankingMethod,
      },
    });

    toast.success(isEdit ? "Department updated!" : "Department created!");
    onClose();
  };

  return (
    <div className="fixed inset-0 bg-gray-900/50 z-50 flex items-center justify-center p-4 overflow-y-auto">
      <div className="card max-w-2xl w-full my-8">
        <div className="p-6 border-b border-gray-200 flex items-center justify-between">
          <h2 className="text-xl font-semibold text-gray-900">
            {isEdit ? "Edit Department" : "Create New Department"}
          </h2>
          <button
            onClick={onClose}
            className="p-2 text-gray-400 hover:text-gray-600"
          >
            <XMarkIcon className="w-5 h-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-6">
          {/* Basic Information */}
          <div>
            <h3 className="text-lg font-medium text-gray-900 mb-4">
              Basic Information
            </h3>
            <div className="space-y-4">
              <div>
                <label className="label">Department Name *</label>
                <input
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  className="input"
                  placeholder="e.g., Engineering, Data Science"
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
                  placeholder="Brief description of the department..."
                  required
                />
              </div>
            </div>
          </div>

          {/* Evaluation Criteria */}
          <div className="pt-6 border-t">
            <h3 className="text-lg font-medium text-gray-900 mb-4">
              Evaluation Criteria
            </h3>

            <div className="bg-gray-50 p-4 rounded-lg mb-4">
              <p className="text-sm text-gray-700 mb-3">
                Set the weightage for different skill types. Total must equal
                100%.
              </p>

              <div className="grid grid-cols-3 gap-4">
                <div>
                  <label className="label">Technical Weight %</label>
                  <input
                    type="number"
                    name="technicalWeight"
                    value={formData.technicalWeight}
                    onChange={handleChange}
                    className={`input ${
                      !isWeightValid ? "border-danger-500" : ""
                    }`}
                    min="0"
                    max="100"
                    required
                  />
                </div>
                <div>
                  <label className="label">Behavioral Weight %</label>
                  <input
                    type="number"
                    name="behavioralWeight"
                    value={formData.behavioralWeight}
                    onChange={handleChange}
                    className={`input ${
                      !isWeightValid ? "border-danger-500" : ""
                    }`}
                    min="0"
                    max="100"
                    required
                  />
                </div>
                <div>
                  <label className="label">Logical Weight %</label>
                  <input
                    type="number"
                    name="logicalWeight"
                    value={formData.logicalWeight}
                    onChange={handleChange}
                    className={`input ${
                      !isWeightValid ? "border-danger-500" : ""
                    }`}
                    min="0"
                    max="100"
                    required
                  />
                </div>
              </div>

              <div className="mt-3 flex items-center justify-between">
                <span className="text-sm text-gray-600">Total Weight:</span>
                <span
                  className={`text-lg font-bold ${
                    isWeightValid ? "text-success-600" : "text-danger-600"
                  }`}
                >
                  {totalWeight}%
                </span>
              </div>

              {!isWeightValid && (
                <p className="text-sm text-danger-600 mt-2">
                  ⚠️ Total must equal 100%. Current: {totalWeight}%
                </p>
              )}
            </div>

            <div className="grid grid-cols-2 gap-4">
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
                <p className="text-xs text-gray-500 mt-1">
                  Minimum score required to pass
                </p>
              </div>

              <div>
                <label className="label">Ranking Method *</label>
                <select
                  name="rankingMethod"
                  value={formData.rankingMethod}
                  onChange={handleChange}
                  className="input"
                >
                  <option value="score">Total Score</option>
                  <option value="weighted">Weighted Average</option>
                  <option value="percentile">Percentile</option>
                </select>
                <p className="text-xs text-gray-500 mt-1">
                  How to calculate candidate rankings
                </p>
              </div>
            </div>
          </div>

          {/* Preview */}
          <div className="pt-6 border-t">
            <h3 className="text-lg font-medium text-gray-900 mb-4">Preview</h3>
            <div className="bg-primary-50 border border-primary-200 rounded-lg p-4">
              <p className="text-sm font-medium text-gray-900 mb-3">
                Evaluation Breakdown:
              </p>
              <div className="space-y-2">
                <div className="flex items-center">
                  <div className="flex-1">
                    <div className="flex justify-between mb-1">
                      <span className="text-sm text-gray-700">Technical</span>
                      <span className="text-sm font-semibold text-gray-900">
                        {formData.technicalWeight}%
                      </span>
                    </div>
                    <div className="h-2 bg-gray-200 rounded-full overflow-hidden">
                      <div
                        className="h-full bg-primary-600 rounded-full"
                        style={{ width: `${formData.technicalWeight}%` }}
                      />
                    </div>
                  </div>
                </div>
                <div className="flex items-center">
                  <div className="flex-1">
                    <div className="flex justify-between mb-1">
                      <span className="text-sm text-gray-700">Behavioral</span>
                      <span className="text-sm font-semibold text-gray-900">
                        {formData.behavioralWeight}%
                      </span>
                    </div>
                    <div className="h-2 bg-gray-200 rounded-full overflow-hidden">
                      <div
                        className="h-full bg-success-600 rounded-full"
                        style={{ width: `${formData.behavioralWeight}%` }}
                      />
                    </div>
                  </div>
                </div>
                <div className="flex items-center">
                  <div className="flex-1">
                    <div className="flex justify-between mb-1">
                      <span className="text-sm text-gray-700">Logical</span>
                      <span className="text-sm font-semibold text-gray-900">
                        {formData.logicalWeight}%
                      </span>
                    </div>
                    <div className="h-2 bg-gray-200 rounded-full overflow-hidden">
                      <div
                        className="h-full bg-warning-600 rounded-full"
                        style={{ width: `${formData.logicalWeight}%` }}
                      />
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Actions */}
          <div className="flex items-center gap-3 pt-6 border-t">
            <button
              type="submit"
              disabled={!isWeightValid}
              className="btn-primary flex-1 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isEdit ? "Update Department" : "Create Department"}
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
