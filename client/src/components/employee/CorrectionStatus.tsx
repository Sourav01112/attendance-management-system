import React from 'react';
import { useQuery } from '@tanstack/react-query';
import { LoadingSpinner } from '@/components/shared/LoadingSpinner';
import { ErrorMessage } from '@/components/shared/ErrorMessage';
import { formatDateTime } from '@/utils/helpers';
import api from '@/services/api';
import type { Correction, ApiResponse } from '@/types';




export const CorrectionStatus: React.FC = () => {
  const { data: corrections, isLoading, error } = useQuery({
    queryKey: ['my-corrections'],
    queryFn: async () => {
      const response = await api.get<ApiResponse<Correction[]>>('/my-corrections');
      return response.data.data || [];
    },
  });

  if (isLoading) {
    return (
      <div className="card">
        <div className="flex justify-center items-center py-4">
          <LoadingSpinner size="sm" />
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="card">
        <ErrorMessage message="Failed to load correction status" />
      </div>
    );
  }

  if (!corrections || corrections.length === 0) {
    return null;
  }

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'pending':
        return <span className="status-pending">Pending Review</span>;
      case 'approved':
        return <span className="status-valid">Approved</span>;
      case 'rejected':
        return <span className="status-invalid">Rejected</span>;
      default:
        return <span className="status-pending">{status}</span>;
    }
  };

  const getStatusMessage = (correction: Correction) => {
    switch (correction.status) {
      case 'pending':
        const timeLeft = new Date(correction.expires_at).getTime() - new Date().getTime();
        const hoursLeft = Math.max(0, Math.floor(timeLeft / (1000 * 60 * 60)));
        return `Your correction request is under review. ${hoursLeft > 0 ? `Expires in ${hoursLeft} hours.` : 'Expired'}`;
      case 'approved':
        return `Your correction was approved on ${formatDateTime(correction.reviewed_at!)}. Attendance record has been updated.`;
      case 'rejected':
        return `Your correction was rejected on ${formatDateTime(correction.reviewed_at!)}. You may submit a new request if needed.`;
      default:
        return 'Status unknown';
    }
  };

  return (
    <div className="card">
      <h3 className="text-lg font-semibold text-slate-900 mb-4">
        My Correction Requests ({corrections.length})
      </h3>
      
      <div className="space-y-4">
        {corrections.map((correction) => (
          <div 
            key={correction.id} 
            className="border border-slate-200 rounded-lg p-4 bg-slate-50"
          >
            <div className="flex justify-between items-start mb-3">
              <div>
                <p className="text-sm font-medium text-slate-900">
                  Correction Request #{correction.id.slice(-6)}
                </p>
                <p className="text-xs text-slate-600">
                  Submitted: {formatDateTime(correction.created_at)}
                </p>
              </div>
              {getStatusBadge(correction.status)}
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3 mb-3">
              {correction.requested_check_in && (
                <div className="text-sm">
                  <span className="font-medium text-slate-700">Requested Check-in:</span>
                  <p className="text-slate-600">{formatDateTime(correction.requested_check_in)}</p>
                </div>
              )}
              {correction.requested_check_out && (
                <div className="text-sm">
                  <span className="font-medium text-slate-700">Requested Check-out:</span>
                  <p className="text-slate-600">{formatDateTime(correction.requested_check_out)}</p>
                </div>
              )}
            </div>
            
            <div className="mb-3">
              <span className="font-medium text-slate-700 text-sm">Your Reason:</span>
              <p className="text-sm text-slate-600 mt-1 bg-white p-2 rounded border">
                {correction.reason}
              </p>
            </div>

            {correction.status === 'rejected' && correction.comments && (
              <div className="mb-3">
                <span className="font-medium text-red-700 text-sm">Rejection Comments:</span>
                <p className="text-sm text-red-600 mt-1 bg-red-50 p-2 rounded border border-red-200">
                  {correction.comments}
                </p>
              </div>
            )}
            
            <div className={`text-sm p-3 rounded-md ${
              correction.status === 'pending' ? 'bg-amber-50 text-amber-800 border border-amber-200' :
              correction.status === 'approved' ? 'bg-emerald-50 text-emerald-800 border border-emerald-200' :
              'bg-red-50 text-red-800 border border-red-200'
            }`}>
              {getStatusMessage(correction)}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
