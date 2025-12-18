'use client';

import { XMarkIcon, BuildingOfficeIcon } from '@heroicons/react/24/outline';
import { format } from 'date-fns';

interface DepartmentDetailModalProps {
  department: any;
  onClose: () => void;
  onEdit: () => void;
}

const rankingMethodLabels = {
  score: 'Total Score',
  percentile: 'Percentile Ranking',
  weighted: 'Weighted Average',
};

export function DepartmentDetailModal({ department, onClose, onEdit }: DepartmentDetailModalProps) {
  const { evaluationCriteria } = department;

  return (
    <div className="fixed inset-0 bg-gray-900/50 z-50 flex items-center justify-center p-4">
      <div className="card max-w-3xl w-full max-h-[90vh] overflow-y-auto">
        <div className="p-6 border-b border-gray-200 flex items-center justify-between sticky top-0 bg-white z-10">
          <div className="flex items-center gap-4">
            <div className="w-16 h-16 bg-primary-100 rounded-lg flex items-center justify-center">
              <BuildingOfficeIcon className="w-8 h-8 text-primary-600" />
            </div>
            <div>
              <h2 className="text-2xl font-semibold text-gray-900">{department.name}</h2>
              <p className="text-sm text-gray-600 mt-1">{department.description}</p>
            </div>
          </div>
          <button onClick={onClose} className="p-2 text-gray-400 hover:text-gray-600">
            <XMarkIcon className="w-5 h-5" />
          </button>
        </div>

        <div className="p-6 space-y-6">
          {/* Statistics */}
          <div className="grid grid-cols-3 gap-4">
            <div className="card p-4 bg-primary-50 text-center">
              <p className="text-sm text-gray-600">Question Sets</p>
              <p className="text-3xl font-bold text-gray-900 mt-1">{department.questionSets}</p>
            </div>
            <div className="card p-4 bg-success-50 text-center">
              <p className="text-sm text-gray-600">Active Campaigns</p>
              <p className="text-3xl font-bold text-gray-900 mt-1">{department.campaigns}</p>
            </div>
            <div className="card p-4 bg-warning-50 text-center">
              <p className="text-sm text-gray-600">Total Candidates</p>
              <p className="text-3xl font-bold text-gray-900 mt-1">{department.candidates}</p>
            </div>
          </div>

          {/* Evaluation Criteria */}
          <div className="pt-6 border-t">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Evaluation Criteria</h3>
            
            <div className="space-y-4">
              {/* Weights */}
              <div>
                <h4 className="text-sm font-medium text-gray-700 mb-3">Skill Weightage</h4>
                <div className="space-y-3">
                  <div>
                    <div className="flex justify-between mb-1">
                      <span className="text-sm text-gray-600">Technical</span>
                      <span className="text-sm font-semibold text-gray-900">
                        {evaluationCriteria.technicalWeight}%
                      </span>
                    </div>
                    <div className="h-3 bg-gray-200 rounded-full overflow-hidden">
                      <div
                        className="h-full bg-primary-600 rounded-full"
                        style={{ width: `${evaluationCriteria.technicalWeight}%` }}
                      />
                    </div>
                  </div>

                  <div>
                    <div className="flex justify-between mb-1">
                      <span className="text-sm text-gray-600">Behavioral</span>
                      <span className="text-sm font-semibold text-gray-900">
                        {evaluationCriteria.behavioralWeight}%
                      </span>
                    </div>
                    <div className="h-3 bg-gray-200 rounded-full overflow-hidden">
                      <div
                        className="h-full bg-success-600 rounded-full"
                        style={{ width: `${evaluationCriteria.behavioralWeight}%` }}
                      />
                    </div>
                  </div>

                  <div>
                    <div className="flex justify-between mb-1">
                      <span className="text-sm text-gray-600">Logical</span>
                      <span className="text-sm font-semibold text-gray-900">
                        {evaluationCriteria.logicalWeight}%
                      </span>
                    </div>
                    <div className="h-3 bg-gray-200 rounded-full overflow-hidden">
                      <div
                        className="h-full bg-warning-600 rounded-full"
                        style={{ width: `${evaluationCriteria.logicalWeight}%` }}
                      />
                    </div>
                  </div>
                </div>
              </div>

              {/* Other Criteria */}
              <div className="grid md:grid-cols-2 gap-4 pt-4">
                <div className="card p-4 bg-gray-50">
                  <p className="text-sm text-gray-600">Passing Score</p>
                  <p className="text-2xl font-bold text-gray-900 mt-1">
                    {evaluationCriteria.passingScore}%
                  </p>
                  <p className="text-xs text-gray-500 mt-1">Minimum required to pass</p>
                </div>

                <div className="card p-4 bg-gray-50">
                  <p className="text-sm text-gray-600">Ranking Method</p>
                  <p className="text-lg font-semibold text-gray-900 mt-1">
                    {rankingMethodLabels[evaluationCriteria.rankingMethod as keyof typeof rankingMethodLabels]}
                  </p>
                  <p className="text-xs text-gray-500 mt-1">Candidate ranking system</p>
                </div>
              </div>
            </div>
          </div>

          {/* Metadata */}
          <div className="pt-6 border-t">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Metadata</h3>
            <div className="grid md:grid-cols-2 gap-4 text-sm">
              <div>
                <p className="text-gray-600">Created</p>
                <p className="font-medium text-gray-900">
                  {format(new Date(department.createdAt), 'MMM dd, yyyy HH:mm')}
                </p>
              </div>
              <div>
                <p className="text-gray-600">Last Updated</p>
                <p className="font-medium text-gray-900">
                  {format(new Date(department.updatedAt), 'MMM dd, yyyy HH:mm')}
                </p>
              </div>
            </div>
          </div>

          {/* Example Calculation */}
          <div className="pt-6 border-t">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Example Score Calculation</h3>
            <div className="card p-4 bg-primary-50 border border-primary-200">
              <p className="text-sm text-gray-700 mb-3">
                If a candidate scores:
              </p>
              <div className="space-y-1 text-sm mb-3">
                <p className="text-gray-700">• Technical: <span className="font-semibold">85/100</span></p>
                <p className="text-gray-700">• Behavioral: <span className="font-semibold">90/100</span></p>
                <p className="text-gray-700">• Logical: <span className="font-semibold">75/100</span></p>
              </div>
              <p className="text-sm text-gray-700 mb-2">Final Score:</p>
              <p className="text-gray-700 text-sm">
                = (85 × {evaluationCriteria.technicalWeight}%) 
                + (90 × {evaluationCriteria.behavioralWeight}%) 
                + (75 × {evaluationCriteria.logicalWeight}%)
              </p>
              <p className="text-xl font-bold text-primary-600 mt-3">
                = {(
                  (85 * evaluationCriteria.technicalWeight / 100) +
                  (90 * evaluationCriteria.behavioralWeight / 100) +
                  (75 * evaluationCriteria.logicalWeight / 100)
                ).toFixed(1)} / 100
              </p>
              <p className="text-sm text-gray-600 mt-2">
                {(
                  (85 * evaluationCriteria.technicalWeight / 100) +
                  (90 * evaluationCriteria.behavioralWeight / 100) +
                  (75 * evaluationCriteria.logicalWeight / 100)
                ).toFixed(1) >= evaluationCriteria.passingScore
                  ? '✅ Candidate would pass'
                  : '❌ Candidate would not pass'}
              </p>
            </div>
          </div>
        </div>

        <div className="p-6 border-t border-gray-200 flex items-center gap-3">
          <button onClick={onEdit} className="btn-primary flex-1">
            Edit Department
          </button>
          <button onClick={onClose} className="btn-outline flex-1">
            Close
          </button>
        </div>
      </div>
    </div>
  );
}

