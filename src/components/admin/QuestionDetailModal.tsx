'use client';

import { XMarkIcon } from '@heroicons/react/24/outline';
import type { Question } from '@/types';

interface QuestionDetailModalProps {
  question: Question;
  onClose: () => void;
  onEdit: () => void;
}

const answerTypeLabels: Record<string, string> = {
  multiple_choice: 'Multiple Choice',
  code_editor: 'Code Editor',
  essay: 'Essay',
  file_upload: 'File Upload',
  rating_scale: 'Rating Scale',
};

const difficultyColors = {
  beginner: 'badge-success',
  intermediate: 'badge-warning',
  advanced: 'badge-danger',
};

const skillTypeColors = {
  technical: 'badge-primary',
  behavioral: 'badge-secondary',
  logical: 'badge-gray',
};

export function QuestionDetailModal({ question, onClose, onEdit }: QuestionDetailModalProps) {
  return (
    <div className="fixed inset-0 bg-gray-900/50 z-50 flex items-center justify-center p-4">
      <div className="card max-w-3xl w-full max-h-[90vh] overflow-y-auto">
        <div className="p-6 border-b border-gray-200 flex items-center justify-between sticky top-0 bg-white z-10">
          <h2 className="text-xl font-semibold text-gray-900">Question Details</h2>
          <button onClick={onClose} className="p-2 text-gray-400 hover:text-gray-600">
            <XMarkIcon className="w-5 h-5" />
          </button>
        </div>

        <div className="p-6 space-y-6">
          {/* Title */}
          <div>
            <h3 className="text-2xl font-bold text-gray-900">{question.title}</h3>
            <div className="flex items-center gap-2 mt-3">
              <span className={`badge ${difficultyColors[question.difficulty]} capitalize`}>
                {question.difficulty}
              </span>
              <span className={`badge ${skillTypeColors[question.skillType]} capitalize`}>
                {question.skillType}
              </span>
              <span className="badge badge-gray">
                {answerTypeLabels[question.answerType]}
              </span>
            </div>
          </div>

          {/* Description */}
          <div>
            <h4 className="text-sm font-semibold text-gray-700 mb-2">Description</h4>
            <p className="text-gray-600">{question.description}</p>
          </div>

          {/* Metadata */}
          <div className="grid grid-cols-2 gap-4 pt-4 border-t">
            <div>
              <h4 className="text-sm font-semibold text-gray-700 mb-1">Points</h4>
              <p className="text-gray-900">10 points (Fixed)</p>
            </div>
          </div>

          {/* Tags */}
          {question.tags && question.tags.length > 0 && (
            <div>
              <h4 className="text-sm font-semibold text-gray-700 mb-2">Tags</h4>
              <div className="flex flex-wrap gap-2">
                {question.tags.map((tag) => (
                  <span key={tag} className="badge badge-primary">
                    {tag}
                  </span>
                ))}
              </div>
            </div>
          )}

          {/* Type-Specific Content */}
          {question.answerType === 'multiple_choice' && question.options && (
            <div className="pt-4 border-t">
              <h4 className="text-sm font-semibold text-gray-700 mb-3">Options</h4>
              <div className="space-y-2">
                {question.options.map((option, index) => {
                  const isCorrect = Array.isArray(question.correctAnswer)
                    ? question.correctAnswer.includes(option)
                    : question.correctAnswer === option;
                  
                  return (
                    <div
                      key={index}
                      className={`p-3 rounded-lg border-2 ${
                        isCorrect
                          ? 'border-success-500 bg-success-50'
                          : 'border-gray-200 bg-gray-50'
                      }`}
                    >
                      <div className="flex items-center justify-between">
                        <span className="text-gray-900">{option}</span>
                        {isCorrect && (
                          <span className="badge badge-success text-xs">Correct</span>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          {question.answerType === 'code_editor' && question.codeTemplate && (
            <div className="pt-4 border-t">
              <h4 className="text-sm font-semibold text-gray-700 mb-3">Code Template</h4>
              <pre className="bg-gray-900 text-gray-100 p-4 rounded-lg overflow-x-auto text-sm">
                <code>{question.codeTemplate}</code>
              </pre>
            </div>
          )}

          {question.answerType === 'essay' && question.rubric && (
            <div className="pt-4 border-t">
              <h4 className="text-sm font-semibold text-gray-700 mb-3">Grading Rubric</h4>
              <div className="bg-gray-50 p-4 rounded-lg">
                <p className="text-gray-700">{question.rubric}</p>
              </div>
            </div>
          )}

          {question.answerType === 'file_upload' && question.fileTypes && (
            <div className="pt-4 border-t">
              <h4 className="text-sm font-semibold text-gray-700 mb-3">Allowed File Types</h4>
              <div className="flex flex-wrap gap-2">
                {question.fileTypes.map((type) => (
                  <span key={type} className="badge badge-gray uppercase">
                    .{type}
                  </span>
                ))}
              </div>
            </div>
          )}

          {question.answerType === 'rating_scale' && question.ratingScale && (
            <div className="pt-4 border-t">
              <h4 className="text-sm font-semibold text-gray-700 mb-3">Rating Scale</h4>
              <p className="text-gray-900">1 to {question.ratingScale}</p>
            </div>
          )}
        </div>

        {/* Actions */}
        <div className="p-6 border-t border-gray-200 flex items-center gap-3">
          <button onClick={onEdit} className="btn-primary flex-1">
            Edit Question
          </button>
          <button onClick={onClose} className="btn-outline flex-1">
            Close
          </button>
        </div>
      </div>
    </div>
  );
}

