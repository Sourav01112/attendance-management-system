import React, { useState } from 'react';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { LoadingSpinner } from '@/components/shared/LoadingSpinner';
import { ErrorMessage } from '@/components/shared/ErrorMessage';
import { SuccessMessage } from '@/components/shared/SuccessMessage';
import api from '@/services/api';
import { API_ENDPOINTS } from '@/utils/constants';
import type { CorrectionRequest, ApiResponse, CorrectionFormProps } from '@/types';






export const CorrectionForm: React.FC<CorrectionFormProps> = ({
  attendanceId,
  currentCheckIn,
  currentCheckOut,
  onClose,
}) => {
  const [formData, setFormData] = useState({
    requestedCheckIn: currentCheckIn?.slice(0, 16) || '',
    requestedCheckOut: currentCheckOut?.slice(0, 16) || '',
    reason: '',
  });
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const queryClient = useQueryClient();

  const mutation = useMutation({
    mutationFn: async (data: CorrectionRequest) => {
      const response = await api.post<ApiResponse<any>>(API_ENDPOINTS.CORRECTION, data);
      return response.data;
    },
    onSuccess: () => {
      setSuccess('Correction request submitted successfully!');
      setError('');
      queryClient.invalidateQueries({ queryKey: ['attendance'] });
      setTimeout(() => {
        onClose();
      }, 2000);
    },
    onError: (err: any) => {
      setError(err.response?.data?.error || 'Failed to submit correction request');
      setSuccess('');
    },
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.reason.trim()) {
      setError('Please provide a reason for the correction');
      return;
    }

    const correctionData: CorrectionRequest = {
      attendance_id: attendanceId,
      requested_check_in: formData.requestedCheckIn ? new Date(formData.requestedCheckIn).toISOString() : null,
      requested_check_out: formData.requestedCheckOut ? new Date(formData.requestedCheckOut).toISOString() : null,
      reason: formData.reason,
    };

    mutation.mutate(correctionData);
  };

  return (
    <div className="fixed inset-0 bg-gray-600 bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-lg shadow-xl max-w-md w-full p-6">
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-lg font-semibold text-gray-900">
            Request Attendance Correction
          </h3>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600"
            disabled={mutation.isPending}
          >
            <svg className="h-6 w-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        {success && <SuccessMessage message={success} className="mb-4" />}
        {error && <ErrorMessage message={error} className="mb-4" />}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Corrected Check-in Time
            </label>
            <input
              type="datetime-local"
              value={formData.requestedCheckIn}
              onChange={(e) => setFormData(prev => ({ ...prev, requestedCheckIn: e.target.value }))}
              className="input-field"
              disabled={mutation.isPending}
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Corrected Check-out Time
            </label>
            <input
              type="datetime-local"
              value={formData.requestedCheckOut}
              onChange={(e) => setFormData(prev => ({ ...prev, requestedCheckOut: e.target.value }))}
              className="input-field"
              disabled={mutation.isPending}
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Reason for Correction *
            </label>
            <textarea
              value={formData.reason}
              onChange={(e) => setFormData(prev => ({ ...prev, reason: e.target.value }))}
              className="input-field"
              rows={3}
              placeholder="Please explain why this correction is needed..."
              required
              disabled={mutation.isPending}
            />
          </div>

          <div className="flex space-x-3 pt-4">
            <button
              type="button"
              onClick={onClose}
              className="btn-secondary flex-1"
              disabled={mutation.isPending}
            >
              Cancel
            </button>
            <button
              type="submit"
              className="btn-primary flex-1 flex justify-center items-center"
              disabled={mutation.isPending}
            >
              {mutation.isPending ? <LoadingSpinner size="sm" /> : 'Submit Request'}
            </button>
          </div>
        </form>

        <div className="mt-4 text-xs text-gray-500">
          <p>• Correction requests expire in 48 hours</p>
          <p>• Requests require admin approval</p>
        </div>
      </div>
    </div>
  );
};