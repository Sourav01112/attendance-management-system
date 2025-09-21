import React, { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { Layout } from '@/components/shared/Layout';
import { CheckInOutCard } from '@/components/employee/ChekcInOutCard';
import { AttendanceHistory } from '@/components/employee/AttendanceHistory';
import { CorrectionForm } from '@/components/employee/CorrectionForm';
// import { LoadingSpinner } from '@/components/shared/LoadingSpinner';
import api from '@/services/api';
import { API_ENDPOINTS } from '@/utils/constants';
import type { Attendance, ApiResponse } from '@/types';
import { CorrectionStatus } from '@/components/employee/CorrectionStatus';

export const EmployeeDashboard: React.FC = () => {
  const [showCorrectionForm, setShowCorrectionForm] = useState(false);
  const [selectedAttendance, setSelectedAttendance] = useState<Attendance | null>(null);

  const { data: attendances, isLoading } = useQuery({
    queryKey: ['attendance'],
    queryFn: async () => {
      const response = await api.get<ApiResponse<Attendance[]>>(API_ENDPOINTS.MY_ATTENDANCE);
      return response.data.data || [];
    },
  });

  const invalidAttendances = attendances?.filter(a => a.status === 'invalid') || [];

  const handleRequestCorrection = (attendance: Attendance) => {
    setSelectedAttendance(attendance);
    setShowCorrectionForm(true);
  };

  const closeModal = () => {
    setShowCorrectionForm(false);
    setSelectedAttendance(null);
  };

  return (
    <Layout title="Employee Dashboard">
      <div className="space-y-6">
        <CheckInOutCard />


        <CorrectionStatus />

        {invalidAttendances.length > 0 && (
          <div className="card">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-lg font-semibold text-red-700">
                Entries Requiring Correction ({invalidAttendances.length})
              </h3>
            </div>
            
            <div className="bg-red-50 border border-red-200 rounded-md p-4 mb-4">
              <p className="text-sm text-red-700">
                The following attendance entries are marked as invalid and require correction within 48 hours.
              </p>
            </div>

            <div className="overflow-x-auto">
              <table className="min-w-full bg-white">
                <thead>
                  <tr className="table-header">
                    <th className="px-6 py-3 text-left">Date</th>
                    <th className="px-6 py-3 text-left">Check In</th>
                    <th className="px-6 py-3 text-left">Check Out</th>
                    <th className="px-6 py-3 text-left">Status</th>
                    <th className="px-6 py-3 text-left">Action</th>
                  </tr>
                </thead>
                <tbody>
                  {invalidAttendances.map((attendance) => (
                    <tr key={attendance.id} className="hover:bg-gray-50">
                      <td className="table-cell">{attendance.date}</td>
                      <td className="table-cell">
                        {attendance.check_in ? new Date(attendance.check_in).toLocaleTimeString() : '-'}
                      </td>
                      <td className="table-cell">
                        {attendance.check_out ? new Date(attendance.check_out).toLocaleTimeString() : '-'}
                      </td>
                      <td className="table-cell">
                        <span className="status-invalid">Invalid</span>
                      </td>
                      <td className="table-cell">
                        <button
                          onClick={() => handleRequestCorrection(attendance)}
                          className="text-primary-600 hover:text-primary-800 text-sm font-medium"
                        >
                          Request Correction
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        <AttendanceHistory />
      </div>

      {showCorrectionForm && selectedAttendance && (
        <CorrectionForm
          attendanceId={selectedAttendance.id}
          currentCheckIn={selectedAttendance.check_in || undefined}
          currentCheckOut={selectedAttendance.check_out || undefined}
          onClose={closeModal}
        />
      )}
    </Layout>
  );
};