import React from 'react';
import { Attendance, AttendanceTableProps } from '@/types';
import { formatDate, formatTime, formatHours } from '@/utils/helpers';
import { STATUS_COLORS } from '@/utils/constants';

export const AttendanceTable: React.FC<AttendanceTableProps> = ({
  attendances,
  showUserColumn = false
}) => {
  console.log("attendances----", attendances)
  if (attendances.length === 0) {
    return (
      <div className="text-center py-12 text-gray-500">
        <p>No attendance records found</p>
      </div>
    );
  }

  return (
    <div className="overflow-x-auto">
      <table className="min-w-full bg-white">
        <thead>
          <tr className="table-header">
            <th className="px-6 py-3 text-left">Date</th>
            {showUserColumn && <th className="px-6 py-3 text-left">Employee</th>}
            <th className="px-6 py-3 text-left">Check In</th>
            <th className="px-6 py-3 text-left">Check Out</th>
            <th className="px-6 py-3 text-left">Total Hours</th>
            <th className="px-6 py-3 text-left">Status</th>
          </tr>
        </thead>
        <tbody>
          {attendances.map((attendance) => (
            <tr key={attendance.id} className="hover:bg-gray-50">
              <td className="table-cell">
                {formatDate(attendance.date)}
              </td>
              {showUserColumn && (
                <td className="table-cell">
                  {attendance.user_id}
                </td>
              )}
              <td className="table-cell">
                {attendance.check_in ? formatTime(attendance.check_in) : '-'}
              </td>
              <td className="table-cell">
                {attendance.check_out ? formatTime(attendance.check_out) : '-'}
              </td>
              <td className="table-cell">
                {attendance.total_hours > 0 ? formatHours(attendance.total_hours) : '-'}
              </td>
              <td className="table-cell">
                <span className={STATUS_COLORS[attendance.status]}>
                  {attendance.status}
                </span>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};