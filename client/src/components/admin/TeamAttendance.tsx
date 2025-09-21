import React, { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { AttendanceTable } from '@/components/shared/AttendanceTable';
import { LoadingSpinner } from '@/components/shared/LoadingSpinner';
import { ErrorMessage } from '@/components/shared/ErrorMessage';
import api from '@/services/api';
import { API_ENDPOINTS } from '@/utils/constants';
import type { Attendance, ApiResponse } from '@/types';




export const TeamAttendance: React.FC = () => {
  const [dateFilter, setDateFilter] = useState('');
  const [statusFilter, setStatusFilter] = useState('');

  const { data, isLoading, error } = useQuery({
    queryKey: ['team-attendance'],
    queryFn: async () => {
      const response = await api.get<ApiResponse<Attendance[]>>(API_ENDPOINTS.TEAM_ATTENDANCE);
      return response.data.data || [];
    },
  });

  const filteredData = data?.filter(attendance => {
    const matchesDate = !dateFilter || attendance.date === dateFilter;
    const matchesStatus = !statusFilter || attendance.status === statusFilter;
    return matchesDate && matchesStatus;
  }) || [];

  const stats = {
    total: data?.length || 0,
    valid: data?.filter(a => a.status === 'valid').length || 0,
    invalid: data?.filter(a => a.status === 'invalid').length || 0,
    pending: data?.filter(a => a.status === 'pending').length || 0,
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
        <ErrorMessage message="Failed to load team attendance" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
          <div className="text-2xl font-bold text-gray-900">{stats.total}</div>
          <div className="text-sm text-gray-600">Total Records</div>
        </div>
        <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
          <div className="text-2xl font-bold text-green-600">{stats.valid}</div>
          <div className="text-sm text-gray-600">Valid Entries</div>
        </div>
        <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
          <div className="text-2xl font-bold text-red-600">{stats.invalid}</div>
          <div className="text-sm text-gray-600">Invalid Entries</div>
        </div>
        <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
          <div className="text-2xl font-bold text-yellow-600">{stats.pending}</div>
          <div className="text-sm text-gray-600">Pending Entries</div>
        </div>
      </div>

      <div className="card">
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-lg font-semibold text-gray-900">
            Team Attendance Records
          </h3>
          
          <div className="flex space-x-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Filter by Date
              </label>
              <input
                type="date"
                value={dateFilter}
                onChange={(e) => setDateFilter(e.target.value)}
                className="input-field"
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Filter by Status
              </label>
              <select
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
                className="input-field"
              >
                <option value="">All Status</option>
                <option value="valid">Valid</option>
                <option value="invalid">Invalid</option>
                <option value="pending">Pending</option>
              </select>
            </div>
            
            {(dateFilter || statusFilter) && (
              <div className="flex items-end">
                <button
                  onClick={() => {
                    setDateFilter('');
                    setStatusFilter('');
                  }}
                  className="btn-secondary"
                >
                  Clear Filters
                </button>
              </div>
            )}
          </div>
        </div>
        
        <div className="text-sm text-gray-600 mb-4">
          Showing {filteredData.length} of {data?.length || 0} records
        </div>
        
        <AttendanceTable attendances={filteredData} showUserColumn={true} />
      </div>
    </div>
  );
};