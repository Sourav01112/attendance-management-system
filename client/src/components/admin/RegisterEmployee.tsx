
import React, { useState } from 'react';
import { useMutation } from '@tanstack/react-query';
import { LoadingSpinner } from '@/components/shared/LoadingSpinner';
import { ErrorMessage } from '@/components/shared/ErrorMessage';
import { SuccessMessage } from '@/components/shared/SuccessMessage';
import api from '@/services/api';
import { API_ENDPOINTS } from '@/utils/constants';
import type { RegisterEmployeeRequest, ApiResponse } from '@/types';





export const RegisterEmployee: React.FC = () => {
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    name: '',
    role: 'employee' as 'employee' | 'admin',
  });
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  const mutation = useMutation({
    mutationFn: async (data: RegisterEmployeeRequest) => {
      const response = await api.post<ApiResponse<any>>(API_ENDPOINTS.REGISTER_EMPLOYEE, data);
      return response.data;
    },
    onSuccess: () => {
      setSuccess('Employee registered successfully!');
      setError('');
      setFormData({
        email: '',
        password: '',
        name: '',
        role: 'employee',
      });
      setTimeout(() => setSuccess(''), 5000);
    },
    onError: (err: any) => {
      setError(err.response?.data?.error || 'Failed to register employee');
      setSuccess('');
    },
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (!formData.email || !formData.password || !formData.name) {
      setError('Please fill in all required fields');
      return;
    }

    if (formData.password.length < 6) {
      setError('Password must be at least 6 characters long');
      return;
    }

    setError('');
    mutation.mutate(formData);
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  return (
    <div className="card">
      <h3 className="text-lg font-semibold text-gray-900 mb-4">
        Register New Employee
      </h3>

      {success && <SuccessMessage message={success} className="mb-4" />}
      {error && <ErrorMessage message={error} className="mb-4" />}

      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-1">
              Full Name *
            </label>
            <input
              type="text"
              id="name"
              name="name"
              value={formData.name}
              onChange={handleInputChange}
              className="input-field"
              placeholder="Enter employee's full name"
              required
              disabled={mutation.isPending}
            />
          </div>

          <div>
            <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">
              Email Address *
            </label>
            <input
              type="email"
              id="email"
              name="email"
              value={formData.email}
              onChange={handleInputChange}
              className="input-field"
              placeholder="Enter employee's email"
              required
              disabled={mutation.isPending}
            />
          </div>

          <div>
            <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-1">
              Password *
            </label>
            <input
              type="password"
              id="password"
              name="password"
              value={formData.password}
              onChange={handleInputChange}
              className="input-field"
              placeholder="Enter temporary password"
              required
              disabled={mutation.isPending}
              minLength={6}
            />
            <p className="text-xs text-gray-500 mt-1">Minimum 6 characters</p>
          </div>

          <div>
            <label htmlFor="role" className="block text-sm font-medium text-gray-700 mb-1">
              Role *
            </label>
            <select
              id="role"
              name="role"
              value={formData.role}
              onChange={handleInputChange}
              className="input-field"
              required
              disabled={mutation.isPending}
            >
              <option value="employee">Employee</option>
              <option value="admin">Admin</option>
            </select>
          </div>
        </div>

        <div className="flex justify-end pt-4">
          <button
            type="submit"
            disabled={mutation.isPending}
            className="btn-primary flex items-center space-x-2"
          >
            {mutation.isPending ? (
              <LoadingSpinner size="sm" />
            ) : (
              <>
                <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                </svg>
                <span>Register Employee</span>
              </>
            )}
          </button>
        </div>
      </form>

      <div className="mt-6 p-4 bg-orange-50 border border-orange-200 rounded-md">
        <h4 className="text-sm font-medium text-orange-900 mb-2">Registration Notes:</h4>
        <ul className="text-sm text-orange-700 space-y-1">
          <li>• Employees will receive login credentials via email</li>
          <li>• Employees are requested to change their password on first login</li>
          <li>• Admin can manage attendance and corrections</li>
          <li>• Employees can only view their own attendance records</li>
        </ul>
      </div>
    </div>
  );
};