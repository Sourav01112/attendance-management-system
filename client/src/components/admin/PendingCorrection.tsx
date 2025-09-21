import React, { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { LoadingSpinner } from '@/components/shared/LoadingSpinner';
import { ErrorMessage } from '@/components/shared/ErrorMessage';
import api from '@/services/api';
import { API_ENDPOINTS } from '@/utils/constants';
import { formatDateTime } from '@/utils/helpers';
import type { Correction, ApiResponse, RejectionModalProps } from '@/types';


const RejectionModal: React.FC<RejectionModalProps> = ({ 
  correction, 
  onClose, 
  onReject, 
  isLoading 
}) => {
  const [comments, setComments] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (comments.trim()) {
      onReject(correction.id, comments.trim());
    }
  };

  return (
    <div className="modal-overlay flex items-center justify-center p-4">
      <div className="modal-content p-6">
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-lg font-semibold text-slate-900">
            Reject Correction Request
          </h3>
          <button
            onClick={onClose}
            className="text-slate-400 hover:text-slate-600"
            disabled={isLoading}
          >
            <svg className="h-6 w-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        <div className="mb-4 p-3 bg-slate-50 rounded-lg">
          <p className="text-sm text-slate-600">
            <span className="font-medium">Employee:</span> {correction.user_id}
          </p>
          <p className="text-sm text-slate-600">
            <span className="font-medium">Reason:</span> {correction.reason}
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-2">
              Rejection Comments *
            </label>
            <textarea
              value={comments}
              onChange={(e) => setComments(e.target.value)}
              className="input-field"
              rows={4}
              placeholder="Please provide a reason for rejection..."
              required
              disabled={isLoading}
            />
            <p className="text-xs text-slate-500 mt-1">
              This comment will be visible to the employee
            </p>
          </div>

          <div className="flex space-x-3 pt-4">
            <button
              type="button"
              onClick={onClose}
              className="btn-secondary flex-1"
              disabled={isLoading}
            >
              Cancel
            </button>
            <button
              type="submit"
              className="btn-danger flex-1 flex justify-center items-center"
              disabled={isLoading || !comments.trim()}
            >
              {isLoading ? <LoadingSpinner size="sm" /> : 'Reject Request'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export const CorrectionPending: React.FC = () => {
  const queryClient = useQueryClient();
  const [rejectionModal, setRejectionModal] = useState<{
    isOpen: boolean;
    correction: Correction | null;
  }>({ isOpen: false, correction: null });

  const { data, isLoading, error } = useQuery({
    queryKey: ['pending-corrections'],
    queryFn: async () => {
      const response = await api.get<ApiResponse<Correction[]>>(API_ENDPOINTS.PENDING_CORRECTIONS);
      return response.data.data || [];
    },
  });

  const approveMutation = useMutation({
    mutationFn: async (correctionId: string) => {
      const response = await api.put<ApiResponse<any>>(`${API_ENDPOINTS.CORRECTION}/${correctionId}/approve`);
      return response.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['pending-corrections'] });
      queryClient.invalidateQueries({ queryKey: ['team-attendance'] });
    },
  });

  const rejectMutation = useMutation({
    mutationFn: async ({ correctionId, comments }: { correctionId: string; comments: string }) => {
      const response = await api.put<ApiResponse<any>>(
        `${API_ENDPOINTS.CORRECTION}/${correctionId}/reject`,
        { comments }
      );
      return response.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['pending-corrections'] });
      setRejectionModal({ isOpen: false, correction: null });
    },
  });

  const handleApprove = (correctionId: string) => {
    approveMutation.mutate(correctionId);
  };

  const handleRejectClick = (correction: Correction) => {
    setRejectionModal({ isOpen: true, correction });
  };

  const handleRejectSubmit = (correctionId: string, comments: string) => {
    rejectMutation.mutate({ correctionId, comments });
  };

  const closeRejectionModal = () => {
    setRejectionModal({ isOpen: false, correction: null });
  };

  if (isLoading) {
    return (
      <div className="card">
        <div className="flex justify-center items-center py-8">
          <LoadingSpinner />
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="card">
        <ErrorMessage message="Failed to load pending corrections" />
      </div>
    );
  }

  return (
    <>
      <div className="card">
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-lg font-semibold text-gray-900">
            Pending Correction Requests ({data?.length || 0})
          </h3>
        </div>

        {data?.length === 0 ? (
          <div className="text-center py-12 text-gray-500">
            <svg className="mx-auto h-12 w-12 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            <p className="mt-2">No pending correction requests</p>
          </div>
        ) : (
          <div className="space-y-4">
            {data?.map((correction) => (
              <div key={correction.id} className="border border-gray-200 rounded-lg p-4 bg-gray-50">
                <div className="flex justify-between items-start">
                  <div className="flex-1">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <h4 className="font-medium text-gray-900 mb-2">Correction Details</h4>
                        <div className="text-sm text-gray-600 space-y-1">
                          <p><span className="font-medium">Submitted:</span> {formatDateTime(correction.created_at)}</p>
                          <p><span className="font-medium">Expires:</span> {formatDateTime(correction.expires_at)}</p>
                          <p><span className="font-medium">Employee ID:</span> {correction.user_id}</p>
                        </div>
                      </div>
                      
                      <div>
                        <h4 className="font-medium text-gray-900 mb-2">Requested Changes</h4>
                        <div className="text-sm text-gray-600 space-y-1">
                          {correction.requested_check_in && (
                            <p><span className="font-medium">Check-in:</span> {formatDateTime(correction.requested_check_in)}</p>
                          )}
                          {correction.requested_check_out && (
                            <p><span className="font-medium">Check-out:</span> {formatDateTime(correction.requested_check_out)}</p>
                          )}
                        </div>
                      </div>
                    </div>
                    
                    <div className="mt-4">
                      <h4 className="font-medium text-gray-900 mb-2">Reason</h4>
                      <p className="text-sm text-gray-600 bg-white p-3 rounded border">
                        {correction.reason}
                      </p>
                    </div>
                  </div>
                  
                  <div className="flex space-x-2 ml-4">
                    <button
                      onClick={() => handleApprove(correction.id)}
                      disabled={approveMutation.isPending || rejectMutation.isPending}
                      className="btn-success flex items-center space-x-1"
                    >
                      {approveMutation.isPending ? (
                        <LoadingSpinner size="sm" />
                      ) : (
                        <>
                          <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                          </svg>
                          <span>Approve</span>
                        </>
                      )}
                    </button>
                    
                    <button
                      onClick={() => handleRejectClick(correction)}
                      disabled={approveMutation.isPending || rejectMutation.isPending}
                      className="btn-danger flex items-center space-x-1"
                    >
                      <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                      </svg>
                      <span>Reject</span>
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {rejectionModal.isOpen && rejectionModal.correction && (
        <RejectionModal
          correction={rejectionModal.correction}
          onClose={closeRejectionModal}
          onReject={handleRejectSubmit}
          isLoading={rejectMutation.isPending}
        />
      )}
    </>
  );
};
