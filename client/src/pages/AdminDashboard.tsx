import React, { useState } from 'react';
import { Layout } from '@/components/shared/Layout';
import { TeamAttendance } from '@/components/admin/TeamAttendance';
import { CorrectionPending } from '@/components/admin/PendingCorrection';
import { RegisterEmployee } from '@/components/admin/RegisterEmployee';

type TabType = 'attendance' | 'corrections' | 'register';

export const AdminDashboard: React.FC = () => {
  const [activeTab, setActiveTab] = useState<TabType>('attendance');

  const tabs = [
    { id: 'attendance', label: 'Team Attendance', icon: '' },
    { id: 'corrections', label: 'Pending Corrections', icon: '' },
    { id: 'register', label: 'Register Employee', icon: '' },
  ];

  return (
    <Layout title="Admin Dashboard">
      <div className="space-y-6">
        <div className="border-b border-gray-200">
          <nav className="flex space-x-8">
            {tabs.map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id as TabType)}
                className={`py-2 px-1 border-b-2 font-medium text-sm whitespace-nowrap ${
                  activeTab === tab.id
                    ? 'border-orange-500 text-orange-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                }`}
              >
                <span className="mr-2">{tab.icon}</span>
                {tab.label}
              </button>
            ))}
          </nav>
        </div>

        <div>
          {activeTab === 'attendance' && <TeamAttendance />}
          {activeTab === 'corrections' && <CorrectionPending />}
          {activeTab === 'register' && <RegisterEmployee />}
        </div>
      </div>
    </Layout>
  );
};