import React, { useState, useEffect } from 'react';
import { useAuthStore } from '@/stores/authStore';
import { LoadingSpinner } from '@/components/shared/LoadingSpinner';
import { ErrorMessage } from '@/components/shared/ErrorMessage';
import { 
  LockClosedIcon, 
  AtSymbolIcon, 
  UserIcon,
  UserCircleIcon 
} from '@heroicons/react/24/outline';

export const LoginForm: React.FC = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [showDemo, setShowDemo] = useState(false);
  const { login, isLoading } = useAuthStore();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setError('');

    try {
      const result = await login(email, password);
      console.log("logged----- ", result);
    } catch (err: any) {
      let errorMessage = 'Login failed';
      if (err && typeof err === 'object' && err.message) {
        errorMessage = err.message;
      } else if (typeof err === 'string') {
        errorMessage = err;
      }
      setError(errorMessage);
    } finally {
      console.log("all done");
    }
  };

  const DemoCred = (demoEmail: string, demoPassword: string) => {
    setEmail(demoEmail);
    setPassword(demoPassword);
    setError('');
  };

  const demoCredentials = [
    {
      role: 'Employee',
      email: 'employee@test.com',
      password: 'password123',
      icon: UserIcon
    },
    {
      role: 'Admin',
      email: 'admin@test.com',
      password: 'password123',
      icon: UserCircleIcon
    }
  ];

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8">
        <div className="text-center">
          
          <div className="mx-auto w-16 h-16 bg-orange-100 rounded-full flex items-center justify-center mb-4">
            <LockClosedIcon className="w-8 h-8 text-orange-500" />
          </div>
           <h2 className="mt-6 text-center text-3xl font-bold text-gray-900">
             Attendance Management System
           </h2>
          <p className="mt-2 text-sm text-gray-600">
            Sign in to your account
          </p>
        </div>

        <form className="mt-8 space-y-6 bg-white p-8 rounded-xl shadow-sm border border-gray-200" onSubmit={handleSubmit}>
          <div className="space-y-4">
            <div>
              <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-2">
                Email Address
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <AtSymbolIcon className="h-5 w-5 text-gray-400" />
                </div>
                <input
                  id="email"
                  name="email"
                  type="email"
                  required
                  className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md leading-5 bg-white placeholder-gray-500 focus:outline-none focus:placeholder-gray-400 focus:ring-1 focus:ring-blue-500 focus:border-blue-500 transition duration-150 ease-in-out sm:text-sm disabled:bg-gray-50 disabled:text-gray-500 disabled:border-gray-200"
                  placeholder="Enter your email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  disabled={isLoading}
                />
              </div>
            </div>

            <div>
              <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-2">
                Password
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <LockClosedIcon className="h-5 w-5 text-gray-400" />
                </div>
                <input
                  id="password"
                  name="password"
                  type="password"
                  required
                  className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md leading-5 bg-white placeholder-gray-500 focus:outline-none focus:placeholder-gray-400 focus:ring-1 focus:ring-blue-500 focus:border-blue-500 transition duration-150 ease-in-out sm:text-sm disabled:bg-gray-50 disabled:text-gray-500 disabled:border-gray-200"
                  placeholder="Enter your password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  disabled={isLoading}
                />
              </div>
            </div>
          </div>

          {error && (
            <div className="mb-4">
              <ErrorMessage message={error} />
            </div>
          )}

          <div>
            <button
              type="submit"
              disabled={isLoading}
              className="group btn-primary relative w-full flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-md text-white focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed transition duration-150 ease-in-out"
            >
              {isLoading ? (
                <LoadingSpinner size="sm" />
              ) : (
                <>
                  <svg className="w-5 h-5 mr-2 -ml-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 16l-4-4m0 0l4-4m-4 4h14m-5 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h7a3 3 0 013 3v1" />
                  </svg>
                  Sign In
                </>
              )}
            </button>
          </div>
        </form>

        <div className="text-center">
          <button
            type="button"
            onClick={() => setShowDemo(!showDemo)}
            disabled={isLoading}
            className="inline-flex items-center text-sm  text-orange-400 hover:text-orange-600 font-medium transition-colors duration-150 disabled:text-gray-400 disabled:cursor-not-allowed"
          >
            {showDemo ? 'Hide' : 'Show'} Demo Credentials
            <svg className={`w-4 h-4 ml-1 transition-transform ${showDemo ? 'rotate-180' : ''}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
            </svg>
          </button>
        </div>

        {showDemo && (
          <div className="space-y-3">
            <div className="relative">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-gray-200" />
              </div>
              <div className="relative flex justify-center text-center">
                <span className="px-2 bg-gray-50 text-xs font-medium text-gray-500">
                  Quick Demo Access
                </span>
              </div>
            </div>

            <div className="grid gap-3">
              {demoCredentials.map((credential, index) => (
                <div
                  key={credential.role}
                  className="group bg-white border border-orange-200 rounded-lg p-4 hover:border-orange-300 hover:shadow-sm transition-all duration-200"
                >
                  <div className="flex items-start space-x-3">
                    <div className="flex-shrink-0 w-10 h-10 bg-orange-100 rounded-lg flex items-center justify-center group-hover:bg-orange-200 transition-colors duration-200">
                      <credential.icon className="w-5 h-5 text-orange-600" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <h4 className="text-sm font-medium text-orange-900 mb-1">
                        {credential.role} Account
                      </h4>
                      <p className="text-xs text-gray-600 mb-1">
                        Email: <span className="font-mono text-gray-900">{credential.email}</span>
                      </p>
                      <p className="text-xs text-gray-600 mb-3">
                        Password: <span className="font-mono text-gray-900">{credential.password}</span>
                      </p>
                      <button
                        type="button"
                        onClick={() => DemoCred(credential.email, credential.password)}
                        disabled={isLoading}
                        className="inline-flex items-center px-3 py-1.5 border border-orange-300 shadow-sm text-xs font-medium rounded-md text-orange-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-orange-500 disabled:opacity-50 disabled:cursor-not-allowed transition duration-150 ease-in-out"
                      >
                        Copy
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        <div className="text-center border border-orange-500 p-2 hover:bg-orange-100 rounded-lg">
          <a href="https://souravcodes.in/contact">
          <p className="text-xs text-orange-500">
            Need help? Contact support
          </p>
          </a>
        </div>
      </div>
    </div>
  );
};