import React, { useState } from 'react';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { useLocation } from '@/hooks/useLocation';
import { LoadingSpinner } from '@/components/shared/LoadingSpinner';
import { ErrorMessage } from '@/components/shared/ErrorMessage';
import { SuccessMessage } from '@/components/shared/SuccessMessage';
import { API_ENDPOINTS } from '@/utils/constants';
import type { CheckInRequest, CheckOutRequest, ApiResponse } from '@/types';
import api from '@/services/api';




export const CheckInOutCard: React.FC = () => {
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');
  const { getCurrentLocation, isLoading: locationLoading } = useLocation();
  const queryClient = useQueryClient();

  const checkInMutation = useMutation({
    mutationFn: async (data: CheckInRequest) => {
      const response = await api.post<ApiResponse<any>>(API_ENDPOINTS.CHECKIN, data);
      return response.data;
    },
    onSuccess: () => {
      setMessage('Check-in successful!');
      setError('');
      queryClient.invalidateQueries({ queryKey: ['attendance'] });
      setTimeout(() => setMessage(''), 3000);
    },
    onError: (err: any) => {
      setError(err.response?.data?.error || 'Check-in failed');
      setMessage('');
    },
  });

  const checkOutMutation = useMutation({
    mutationFn: async (data: CheckOutRequest) => {
      const response = await api.post<ApiResponse<any>>(API_ENDPOINTS.CHECKOUT, data);
      return response.data;
    },
    onSuccess: () => {
      setMessage('Check-out successful!');
      setError('');
      queryClient.invalidateQueries({ queryKey: ['attendance'] });
      setTimeout(() => setMessage(''), 3000);
    },
    onError: (err: any) => {
      setError(err.response?.data?.error || 'Check-out failed');
      setMessage('');
    },
  });

  const handleCheckIn = async () => {
    console.log("hereee1")
    try {
      setError('');
      setMessage('');
      const location = await getCurrentLocation();
      checkInMutation.mutate({ location });
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to get location');
    }
  };

  const handleCheckOut = async () => {
    console.log("hereee2")

    try {
      setError('');
      setMessage('');
      const location = await getCurrentLocation();
      console.log("-------location", location)
      checkOutMutation.mutate({ location });
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to get location');
    }
  };

  const isLoading = locationLoading || checkInMutation.isPending || checkOutMutation.isPending;

  return (
    <div className="card">
      <h3 className="text-lg font-semibold text-gray-900 mb-4">
        Daily Attendance
      </h3>
      
      {message && <SuccessMessage message={message} className="mb-4  w-72" />}
      {error && <ErrorMessage message={error} className="mb-4 w-72" />}
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <button
          onClick={handleCheckIn}
          disabled={isLoading}
          className="btn-success flex items-center justify-center space-x-2 py-4"
        >
          {isLoading && checkInMutation.isPending ? (
            <LoadingSpinner size="sm" />
          ) : (
            <>
              <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 16l-4-4m0 0l4-4m-4 4h14m-5 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h7a3 3 0 013 3v1" />
              </svg>
              <span>Check In</span>
            </>
          )}
        </button>
        
        <button
          onClick={handleCheckOut}
          disabled={isLoading}
          className="btn-danger flex items-center justify-center space-x-2 py-4"
        >
          {isLoading && checkOutMutation.isPending ? (
            <LoadingSpinner size="sm" />
          ) : (
            <>
              <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
              </svg>
              <span>Check Out</span>
            </>
          )}
        </button>
      </div>
      
      <div className="mt-4 text-sm text-gray-600">
        <p className="flex items-center">
          <svg className="h-4 w-4 mr-2 text-orange-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
          </svg>
          Location will be automatically captured
        </p>
      </div>
    </div>
  );
};
