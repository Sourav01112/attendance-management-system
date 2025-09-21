
import React from 'react';
import { useQuery } from '@tanstack/react-query';
import { AttendanceTable } from '@/components/shared/AttendanceTable';
import { LoadingSpinner } from '@/components/shared/LoadingSpinner';
import { ErrorMessage } from '@/components/shared/ErrorMessage';
import api from '@/services/api';
import { API_ENDPOINTS } from '@/utils/constants';
import type { Attendance, ApiResponse } from '@/types';




export const AttendanceHistory: React.FC = () => {
  const { data, isLoading, error } = useQuery({
    queryKey: ['attendance'],
    queryFn: async () => {
      const response = await api.get<ApiResponse<Attendance[]>>(API_ENDPOINTS.MY_ATTENDANCE);
      return response.data.data || [];
    },
  });

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
        <ErrorMessage message="Failed to load attendance history" />
      </div>
    );
  }

  return (
    <div className="card">
      <div className="flex justify-between items-center mb-4">
        <h3 className="text-lg font-semibold text-gray-900">
          My Attendance History
        </h3>
        <div className="text-sm text-gray-500">
          Total Records: {data?.length || 0}
        </div>
      </div>
      
      <AttendanceTable attendances={data || []} />
    </div>
  );
};