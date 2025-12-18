'use client';

import { useState } from 'react';
import { 
  XMarkIcon, 
  AcademicCapIcon, 
  EnvelopeIcon, 
  PhoneIcon, 
  ClipboardDocumentIcon,
  ArrowPathIcon,
  EyeIcon,
  EyeSlashIcon,
} from '@heroicons/react/24/outline';
import type { Candidate } from '@/types';
import { format } from 'date-fns';
import toast from 'react-hot-toast';

interface CandidateDetailModalProps {
  candidate: Candidate;
  onClose: () => void;
  onEdit: () => void;
  onPasswordReset?: (candidateId: string, newPassword: string) => void;
}

const statusColors = {
  invited: 'badge-primary',
  in_progress: 'badge-warning',
  completed: 'badge-success',
  not_started: 'badge-gray',
};

const statusLabels = {
  invited: 'Invited',
  in_progress: 'In Progress',
  completed: 'Completed',
  not_started: 'Not Started',
};

export function CandidateDetailModal({ candidate, onClose, onEdit, onPasswordReset }: CandidateDetailModalProps) {
  const [showPassword, setShowPassword] = useState(false);
  const [isResetting, setIsResetting] = useState(false);
  const [currentPassword, setCurrentPassword] = useState(candidate.tempPassword);

  const handleCopyPassword = async () => {
    try {
      await navigator.clipboard.writeText(currentPassword);
      toast.success('Password copied to clipboard!');
    } catch (error) {
      toast.error('Failed to copy password');
    }
  };

  const handleResetPassword = async () => {
    if (!confirm('Are you sure you want to reset this candidate\'s password?')) {
      return;
    }

    setIsResetting(true);
    
    try {
      const response = await fetch(`/api/candidates/${candidate.id}/reset-password`, {
        method: 'POST',
      });

      if (!response.ok) {
        throw new Error('Failed to reset password');
      }

      const data = await response.json();
      setCurrentPassword(data.tempPassword);
      
      if (onPasswordReset) {
        onPasswordReset(candidate.id, data.tempPassword);
      }

      toast.success('Password reset successfully!');
    } catch (error) {
      console.error('Error resetting password:', error);
      toast.error('Failed to reset password');
    } finally {
      setIsResetting(false);
    }
  };

  const handleSendCredentials = () => {
    // In production, this would send an email
    const mailtoLink = `mailto:${candidate.email}?subject=Your Interview Login Credentials&body=Hello ${candidate.firstName},\n\nYour interview login credentials:\n\nEmail: ${candidate.email}\nTemporary Password: ${currentPassword}\n\nLogin at: http://localhost:3001/login\n\nBest regards,\nInterview Team`;
    window.location.href = mailtoLink;
  };

  return (
    <div className="fixed inset-0 bg-gray-900/50 z-50 flex items-center justify-center p-4">
      <div className="card max-w-2xl w-full max-h-[90vh] overflow-y-auto">
        <div className="p-6 border-b border-gray-200 flex items-center justify-between sticky top-0 bg-white z-10">
          <div className="flex items-center gap-4">
            <div className="w-16 h-16 bg-primary-100 rounded-full flex items-center justify-center">
              <span className="text-2xl font-bold text-primary-600">
                {candidate.firstName[0]}{candidate.lastName[0]}
              </span>
            </div>
            <div>
              <div className="flex items-center gap-3">
                <h2 className="text-xl font-semibold text-gray-900">
                  {candidate.firstName} {candidate.lastName}
                </h2>
                <span className={`badge ${statusColors[candidate.status]}`}>
                  {statusLabels[candidate.status]}
                </span>
              </div>
              <p className="text-sm text-gray-600 mt-1">{candidate.email}</p>
            </div>
          </div>
          <button onClick={onClose} className="p-2 text-gray-400 hover:text-gray-600">
            <XMarkIcon className="w-5 h-5" />
          </button>
        </div>

        <div className="p-6 space-y-6">
          {/* Contact Info */}
          <div>
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Contact Information</h3>
            <div className="grid md:grid-cols-2 gap-4">
              <div className="flex items-center gap-3">
                <EnvelopeIcon className="w-5 h-5 text-gray-400" />
                <div>
                  <p className="text-sm text-gray-600">Email</p>
                  <p className="font-medium text-gray-900">{candidate.email}</p>
                </div>
              </div>
              {candidate.phone && (
                <div className="flex items-center gap-3">
                  <PhoneIcon className="w-5 h-5 text-gray-400" />
                  <div>
                    <p className="text-sm text-gray-600">Phone</p>
                    <p className="font-medium text-gray-900">{candidate.phone}</p>
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Education */}
          <div className="pt-6 border-t">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Education</h3>
            <div className="card p-4 bg-gray-50">
              <div className="flex items-start gap-3">
                <AcademicCapIcon className="w-6 h-6 text-gray-400 mt-1" />
                <div>
                  <p className="font-semibold text-gray-900">{candidate.education.degree}</p>
                  <p className="text-gray-700">{candidate.education.institution}</p>
                  <div className="flex items-center gap-4 mt-2 text-sm text-gray-600">
                    <span>Graduation: {candidate.education.graduationYear}</span>
                    {candidate.education.gpa && <span>GPA: {candidate.education.gpa}</span>}
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Interview Status */}
          <div className="pt-6 border-t">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Interview Status</h3>
            <div className="grid sm:grid-cols-2 gap-4">
              <div className="card p-4">
                <p className="text-sm text-gray-600">Score</p>
                <p className="text-3xl font-bold text-gray-900 mt-1">
                  {candidate.score > 0 ? candidate.score : '-'}
                </p>
              </div>
              <div className="card p-4">
                <p className="text-sm text-gray-600">Rank</p>
                <p className="text-3xl font-bold text-gray-900 mt-1">
                  {candidate.rank ? `#${candidate.rank}` : '-'}
                </p>
              </div>
            </div>

            {candidate.interviewStartedAt && !isNaN(new Date(candidate.interviewStartedAt).getTime()) && (
              <div className="mt-4">
                <p className="text-sm text-gray-600">Started At</p>
                <p className="text-sm font-medium text-gray-900">
                  {format(new Date(candidate.interviewStartedAt), 'MMM dd, yyyy HH:mm')}
                </p>
              </div>
            )}

            {candidate.interviewCompletedAt && !isNaN(new Date(candidate.interviewCompletedAt).getTime()) && (
              <div className="mt-2">
                <p className="text-sm text-gray-600">Completed At</p>
                <p className="text-sm font-medium text-gray-900">
                  {format(new Date(candidate.interviewCompletedAt), 'MMM dd, yyyy HH:mm')}
                </p>
              </div>
            )}
          </div>

          {/* Access Credentials */}
          <div className="pt-6 border-t">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Access Credentials</h3>
            <div className="card p-4 bg-warning-50 border border-warning-200">
              <div className="space-y-3">
                <div>
                  <p className="text-sm font-medium text-warning-800 mb-2">Login Email</p>
                  <p className="font-mono text-sm text-warning-900">
                    {candidate.email}
                  </p>
                </div>
                
                <div>
                  <p className="text-sm font-medium text-warning-800 mb-2">Temporary Password</p>
                  <div className="flex items-center gap-2">
                    <div className="flex-1 bg-warning-100 rounded-lg p-3 flex items-center gap-3">
                      <p className="font-mono text-lg font-bold text-warning-900 flex-1">
                        {showPassword ? currentPassword : '••••••••'}
                      </p>
                      <button
                        onClick={() => setShowPassword(!showPassword)}
                        className="p-1.5 hover:bg-warning-200 rounded transition-colors"
                        title={showPassword ? "Hide password" : "Show password"}
                      >
                        {showPassword ? (
                          <EyeSlashIcon className="w-5 h-5 text-warning-700" />
                        ) : (
                          <EyeIcon className="w-5 h-5 text-warning-700" />
                        )}
                      </button>
                    </div>
                    <button
                      onClick={handleCopyPassword}
                      className="p-3 bg-warning-100 hover:bg-warning-200 rounded-lg transition-colors"
                      title="Copy password"
                    >
                      <ClipboardDocumentIcon className="w-5 h-5 text-warning-700" />
                    </button>
                  </div>
                </div>

                <div className="flex items-center gap-2 pt-2">
                  <button
                    onClick={handleResetPassword}
                    disabled={isResetting}
                    className="btn-outline text-sm flex items-center gap-2 disabled:opacity-50"
                  >
                    <ArrowPathIcon className={`w-4 h-4 ${isResetting ? 'animate-spin' : ''}`} />
                    {isResetting ? 'Resetting...' : 'Reset Password'}
                  </button>
                  <button
                    onClick={handleSendCredentials}
                    className="btn-outline text-sm flex items-center gap-2"
                  >
                    <EnvelopeIcon className="w-4 h-4" />
                    Email Credentials
                  </button>
                </div>

                <div className="pt-3 border-t border-warning-300">
                  <p className="text-xs text-warning-700">
                    <strong>Note:</strong> Share these credentials securely with the candidate. 
                    They will use these to login at the candidate portal.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="p-6 border-t border-gray-200 flex items-center gap-3">
          <button onClick={onEdit} className="btn-primary flex-1">
            Edit Candidate
          </button>
          <button onClick={onClose} className="btn-outline">
            Close
          </button>
        </div>
      </div>
    </div>
  );
}
