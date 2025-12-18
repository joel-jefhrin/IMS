'use client';

import { useState, useEffect } from 'react';
import { XMarkIcon } from '@heroicons/react/24/outline';
import type { Candidate } from '@/types';
import toast from 'react-hot-toast';
import { useDBDataStore } from '@/store/dbData';

interface CandidateFormProps {
  candidate?: Candidate | null;
  onClose: () => void;
  onSubmit: (data: any) => void;
}

export function CandidateForm({ candidate, onClose, onSubmit }: CandidateFormProps) {
  const isEdit = !!candidate;
  const { campaigns = [], departments = [], fetchDepartments, fetchCampaigns } = useDBDataStore();

  const [formData, setFormData] = useState({
    firstName: candidate?.firstName || '',
    lastName: candidate?.lastName || '',
    email: candidate?.email || '',
    phone: candidate?.phone || '',
    degree: candidate?.education.degree || '',
    institution: candidate?.education.institution || '',
    graduationYear: candidate?.education.graduationYear || new Date().getFullYear(),
    gpa: candidate?.education.gpa || '',
    preferredDepartmentId: candidate?.preferredDepartmentId || '',
    campaignId: candidate?.campaignId || '',
  });

  // Fetch data on mount
  useEffect(() => {
    fetchDepartments();
    fetchCampaigns();
  }, [fetchDepartments, fetchCampaigns]);

  // Filter campaigns by selected department
  const filteredCampaigns = formData.preferredDepartmentId
    ? campaigns.filter(c => c.departmentId === formData.preferredDepartmentId)
    : [];

  // When department changes, reset campaign if it doesn't match
  useEffect(() => {
    if (formData.preferredDepartmentId && formData.campaignId && campaigns.length > 0) {
      const campaign = campaigns.find(c => c.id === formData.campaignId);
      if (campaign && campaign.departmentId !== formData.preferredDepartmentId) {
        // Campaign doesn't match department, reset to first matching campaign
        const firstMatchingCampaign = campaigns.find(
          c => c.departmentId === formData.preferredDepartmentId
        );
        setFormData(prev => ({
          ...prev,
          campaignId: firstMatchingCampaign?.id || '',
        }));
      }
    }
  }, [formData.preferredDepartmentId, campaigns]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    
    // If campaign is changed, update department to match
    if (name === 'campaignId') {
      const campaign = campaigns.find(c => c.id === value);
      if (campaign) {
        setFormData({
          ...formData,
          campaignId: value,
          preferredDepartmentId: campaign.departmentId,
        });
        return;
      }
    }
    
    setFormData({ ...formData, [name]: value });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit({
      firstName: formData.firstName,
      lastName: formData.lastName,
      email: formData.email,
      phone: formData.phone,
      education: {
        degree: formData.degree,
        institution: formData.institution,
        graduationYear: Number(formData.graduationYear),
        gpa: formData.gpa,
      },
      preferredDepartmentId: formData.preferredDepartmentId,
      campaignId: formData.campaignId,
    });
    toast.success(isEdit ? 'Candidate updated!' : 'Candidate added!');
    onClose();
  };

  return (
    <div className="fixed inset-0 bg-gray-900/50 z-50 flex items-center justify-center p-4 overflow-y-auto">
      <div className="card max-w-2xl w-full my-8">
        <div className="p-6 border-b border-gray-200 flex items-center justify-between">
          <h2 className="text-xl font-semibold text-gray-900">
            {isEdit ? 'Edit Candidate' : 'Add New Candidate'}
          </h2>
          <button onClick={onClose} className="p-2 text-gray-400 hover:text-gray-600">
            <XMarkIcon className="w-5 h-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-6">
          <div>
            <h3 className="text-lg font-medium text-gray-900 mb-4">Personal Information</h3>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="label">First Name *</label>
                <input
                  name="firstName"
                  value={formData.firstName}
                  onChange={handleChange}
                  className="input"
                  placeholder="John"
                  required
                />
              </div>
              <div>
                <label className="label">Last Name *</label>
                <input
                  name="lastName"
                  value={formData.lastName}
                  onChange={handleChange}
                  className="input"
                  placeholder="Doe"
                  required
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4 mt-4">
              <div>
                <label className="label">Email *</label>
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  className="input"
                  placeholder="john.doe@email.com"
                  required
                />
              </div>
              <div>
                <label className="label">Phone</label>
                <input
                  type="tel"
                  name="phone"
                  value={formData.phone}
                  onChange={handleChange}
                  className="input"
                  placeholder="+1-555-0100"
                />
              </div>
            </div>
          </div>

          <div className="pt-6 border-t">
            <h3 className="text-lg font-medium text-gray-900 mb-4">Educational Background</h3>
            <div>
              <label className="label">Degree *</label>
              <input
                name="degree"
                value={formData.degree}
                onChange={handleChange}
                className="input"
                placeholder="e.g., B.Tech Computer Science"
                required
              />
            </div>

            <div className="grid grid-cols-2 gap-4 mt-4">
              <div>
                <label className="label">Institution *</label>
                <input
                  name="institution"
                  value={formData.institution}
                  onChange={handleChange}
                  className="input"
                  placeholder="e.g., MIT"
                  required
                />
              </div>
              <div>
                <label className="label">Graduation Year *</label>
                <input
                  type="number"
                  name="graduationYear"
                  value={formData.graduationYear}
                  onChange={handleChange}
                  className="input"
                  min="1950"
                  max="2030"
                  required
                />
              </div>
            </div>

            <div className="mt-4">
              <label className="label">GPA (Optional)</label>
              <input
                name="gpa"
                value={formData.gpa}
                onChange={handleChange}
                className="input"
                placeholder="e.g., 3.8"
              />
            </div>
          </div>

          <div className="pt-6 border-t">
            <h3 className="text-lg font-medium text-gray-900 mb-4">Assignment</h3>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="label">Department *</label>
                <select
                  name="preferredDepartmentId"
                  value={formData.preferredDepartmentId}
                  onChange={handleChange}
                  className="input"
                  required
                >
                  <option value="">Select Department</option>
                  {departments.map(dept => (
                    <option key={dept.id} value={dept.id}>
                      {dept.name}
                    </option>
                  ))}
                </select>
                <p className="text-xs text-gray-600 mt-1">
                  {departments.length} department{departments.length !== 1 ? 's' : ''} available
                </p>
              </div>
              <div>
                <label className="label">Campaign *</label>
                <select
                  name="campaignId"
                  value={formData.campaignId}
                  onChange={handleChange}
                  className="input"
                  required
                  disabled={!formData.preferredDepartmentId || filteredCampaigns.length === 0}
                >
                  <option value="">
                    {!formData.preferredDepartmentId 
                      ? 'Select department first' 
                      : filteredCampaigns.length === 0 
                        ? 'No campaigns for this department' 
                        : 'Select Campaign'}
                  </option>
                  {filteredCampaigns.map(campaign => (
                    <option key={campaign.id} value={campaign.id}>
                      {campaign.name}
                    </option>
                  ))}
                </select>
                <p className="text-xs text-gray-600 mt-1">
                  {!formData.preferredDepartmentId 
                    ? 'Select department first to see campaigns'
                    : campaigns.length === 0
                      ? 'No campaigns created yet'
                      : filteredCampaigns.length > 0 
                        ? `${filteredCampaigns.length} campaign${filteredCampaigns.length > 1 ? 's' : ''} available`
                        : 'No campaigns for this department - create one first'}
                </p>
              </div>
            </div>
          </div>

          <div className="flex items-center gap-3 pt-6 border-t">
            <button type="submit" className="btn-primary flex-1">
              {isEdit ? 'Update Candidate' : 'Add Candidate'}
            </button>
            <button type="button" onClick={onClose} className="btn-outline flex-1">
              Cancel
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

