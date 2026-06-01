import React, { useState, useEffect } from 'react';
import { Eye, EyeOff, AlertCircle, Check, X, Loader2 } from 'lucide-react';

interface ChangePasswordPageProps {
  mode: 'reset' | 'change'; // reset = from email link, change = from settings
  resetToken?: string; // Only for reset mode
  onSuccess?: () => void;
  onCancel?: () => void;
}

export function ChangePasswordPage({
  mode,
  resetToken,
  onSuccess,
  onCancel
}: ChangePasswordPageProps) {
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showCurrentPassword, setShowCurrentPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [countdown, setCountdown] = useState(3);
  const [tokenExpired, setTokenExpired] = useState(false);

  // Check if reset token is valid (mock check)
  useEffect(() => {
    if (mode === 'reset' && resetToken) {
      // Mock token validation - in real app, validate with backend
      const mockValidTokens = ['valid-token-123', 'test-reset-token'];
      if (!mockValidTokens.includes(resetToken)) {
        setTokenExpired(true);
      }
    }
  }, [mode, resetToken]);

  // Countdown timer after success
  useEffect(() => {
    if (isSuccess && countdown > 0) {
      const timer = setTimeout(() => {
        setCountdown(countdown - 1);
      }, 1000);
      return () => clearTimeout(timer);
    } else if (isSuccess && countdown === 0 && onSuccess) {
      onSuccess();
    }
  }, [isSuccess, countdown, onSuccess]);

  // Password strength calculation
  const calculatePasswordStrength = (pwd: string): { strength: number; label: string; color: string } => {
    let strength = 0;
    if (pwd.length >= 8) strength++;
    if (pwd.length >= 12) strength++;
    if (/[A-Z]/.test(pwd)) strength++;
    if (/[a-z]/.test(pwd)) strength++;
    if (/[0-9]/.test(pwd)) strength++;
    if (/[^A-Za-z0-9]/.test(pwd)) strength++;

    if (strength <= 2) return { strength: 33, label: 'Weak', color: '#dc2626' };
    if (strength <= 4) return { strength: 66, label: 'Fair', color: '#eab308' };
    return { strength: 100, label: 'Strong', color: '#16a34a' };
  };

  const passwordStrength = calculatePasswordStrength(newPassword);

  // Validation rules
  const validationRules = [
    {
      label: 'At least 8 characters',
      valid: newPassword.length >= 8
    },
    {
      label: 'At least one uppercase letter',
      valid: /[A-Z]/.test(newPassword)
    },
    {
      label: 'At least one number or special character',
      valid: /[0-9]/.test(newPassword) || /[^A-Za-z0-9]/.test(newPassword)
    },
    {
      label: 'New password must not match old password',
      valid: mode === 'reset' || (newPassword !== currentPassword && newPassword.length > 0),
      skipIfReset: true
    },
    {
      label: 'Confirm password must match new password',
      valid: confirmPassword === newPassword && confirmPassword.length > 0
    }
  ];

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    // Validate all rules
    const failedRules = validationRules.filter(rule => {
      if (rule.skipIfReset && mode === 'reset') return false;
      return !rule.valid;
    });

    if (failedRules.length > 0) {
      setError('Please meet all password requirements');
      return;
    }

    if (mode === 'change' && !currentPassword) {
      setError('Please enter your current password');
      return;
    }

    setIsLoading(true);

    // Simulate API call
    setTimeout(() => {
      setIsLoading(false);
      setIsSuccess(true);
    }, 1000);
  };

  // Token expired state
  if (tokenExpired) {
    return (
      <div className="min-h-screen bg-[#1a1f2e] flex items-center justify-center p-4 relative overflow-hidden">
        <div
          className="absolute inset-0 opacity-[0.03]"
          style={{
            backgroundImage: `linear-gradient(#f5f1e8 1px, transparent 1px), linear-gradient(90deg, #f5f1e8 1px, transparent 1px)`,
            backgroundSize: '32px 32px'
          }}
        />

        <div className="w-full max-w-md relative z-10">
          <div className="text-center mb-8">
            <div className="inline-block mb-6">
              <div className="w-16 h-16 bg-[#f5f1e8] rounded-sm flex items-center justify-center mb-4 mx-auto">
                <svg className="w-10 h-10 text-[#1a1f2e]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
                </svg>
              </div>
              <h1 className="text-3xl font-serif text-[#f5f1e8] tracking-wide mb-2">
                Manuscript Management System
              </h1>
              <p className="text-[#9ca3af] text-sm font-light">Academic Publishing Portal</p>
            </div>
          </div>

          <div className="bg-[#f5f1e8] rounded-sm shadow-2xl p-8 border border-[#e5dcc8]">
            <div className="text-center space-y-4">
              <div className="inline-flex items-center justify-center w-12 h-12 bg-red-100 rounded-full">
                <AlertCircle className="w-6 h-6 text-red-600" />
              </div>
              <h2 className="text-xl font-semibold text-[#1a1f2e]">
                Link Expired
              </h2>
              <p className="text-sm text-[#4a4a4a]">
                This reset link has expired or is invalid. Please request a new one.
              </p>
              <button
                onClick={() => window.location.href = '/login'}
                className="w-full bg-[#1a1f2e] text-[#f5f1e8] py-3 px-4 rounded-sm hover:bg-[#252b3d] transition-all font-medium mt-6"
              >
                Return to Forgot Password
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // Success state
  if (isSuccess) {
    return (
      <div className="min-h-screen bg-[#1a1f2e] flex items-center justify-center p-4 relative overflow-hidden">
        <div
          className="absolute inset-0 opacity-[0.03]"
          style={{
            backgroundImage: `linear-gradient(#f5f1e8 1px, transparent 1px), linear-gradient(90deg, #f5f1e8 1px, transparent 1px)`,
            backgroundSize: '32px 32px'
          }}
        />

        <div className="w-full max-w-md relative z-10">
          <div className="text-center mb-8">
            <div className="inline-block mb-6">
              <div className="w-16 h-16 bg-[#f5f1e8] rounded-sm flex items-center justify-center mb-4 mx-auto">
                <svg className="w-10 h-10 text-[#1a1f2e]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
                </svg>
              </div>
              <h1 className="text-3xl font-serif text-[#f5f1e8] tracking-wide mb-2">
                Manuscript Management System
              </h1>
              <p className="text-[#9ca3af] text-sm font-light">Academic Publishing Portal</p>
            </div>
          </div>

          <div className="bg-[#f5f1e8] rounded-sm shadow-2xl p-8 border border-[#e5dcc8]">
            <div className="text-center space-y-4">
              <div className="inline-flex items-center justify-center w-12 h-12 bg-green-100 rounded-full">
                <Check className="w-6 h-6 text-green-600" />
              </div>
              <h2 className="text-xl font-semibold text-[#1a1f2e]">
                Password Updated Successfully
              </h2>
              <p className="text-sm text-[#4a4a4a]">
                Your password has been changed. You will be redirected to the login page in {countdown} second{countdown !== 1 ? 's' : ''}.
              </p>
              <div className="pt-4">
                <div className="w-full bg-[#d1c7b3] rounded-full h-1.5">
                  <div
                    className="bg-[#1a1f2e] h-1.5 rounded-full transition-all duration-1000"
                    style={{ width: `${((3 - countdown) / 3) * 100}%` }}
                  />
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // Main form
  return (
    <div className="min-h-screen bg-[#1a1f2e] flex items-center justify-center p-4 relative overflow-hidden">
      <div
        className="absolute inset-0 opacity-[0.03]"
        style={{
          backgroundImage: `linear-gradient(#f5f1e8 1px, transparent 1px), linear-gradient(90deg, #f5f1e8 1px, transparent 1px)`,
          backgroundSize: '32px 32px'
        }}
      />

      <div className="w-full max-w-md relative z-10">
        <div className="text-center mb-8">
          <div className="inline-block mb-6">
            <div className="w-16 h-16 bg-[#f5f1e8] rounded-sm flex items-center justify-center mb-4 mx-auto">
              <svg className="w-10 h-10 text-[#1a1f2e]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
              </svg>
            </div>
            <h1 className="text-3xl font-serif text-[#f5f1e8] tracking-wide mb-2">
              Manuscript Management System
            </h1>
            <p className="text-[#9ca3af] text-sm font-light">Academic Publishing Portal</p>
          </div>
        </div>

        <div className="bg-[#f5f1e8] rounded-sm shadow-2xl p-8 border border-[#e5dcc8]">
          <div className="mb-6">
            <h2 className="text-xl font-semibold text-[#1a1f2e] mb-2">
              {mode === 'reset' ? 'Set New Password' : 'Change Password'}
            </h2>
            <p className="text-sm text-[#4a4a4a]">
              {mode === 'reset'
                ? 'Create a strong password for your account.'
                : 'Update your account password.'}
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-5">
            {/* Error Alert */}
            {error && (
              <div className="flex items-start gap-3 p-4 bg-red-50 border border-red-200 rounded-sm">
                <AlertCircle className="w-5 h-5 text-red-600 flex-shrink-0 mt-0.5" />
                <p className="text-sm text-red-800">{error}</p>
              </div>
            )}

            {/* Current Password (only for change mode) */}
            {mode === 'change' && (
              <div>
                <label htmlFor="current-password" className="block text-sm font-medium text-[#1a1f2e] mb-2">
                  Current Password
                </label>
                <div className="relative">
                  <input
                    id="current-password"
                    type={showCurrentPassword ? 'text' : 'password'}
                    value={currentPassword}
                    onChange={(e) => setCurrentPassword(e.target.value)}
                    className="w-full px-4 py-3 bg-white border border-[#d1c7b3] rounded-sm text-[#1a1f2e] placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-[#1a1f2e] focus:border-transparent transition-all font-mono text-sm pr-12"
                    placeholder="••••••••"
                    disabled={isLoading}
                  />
                  <button
                    type="button"
                    onClick={() => setShowCurrentPassword(!showCurrentPassword)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-[#1a1f2e] transition-colors"
                    disabled={isLoading}
                  >
                    {showCurrentPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                  </button>
                </div>
              </div>
            )}

            {/* New Password */}
            <div>
              <label htmlFor="new-password" className="block text-sm font-medium text-[#1a1f2e] mb-2">
                New Password
              </label>
              <div className="relative">
                <input
                  id="new-password"
                  type={showNewPassword ? 'text' : 'password'}
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                  className="w-full px-4 py-3 bg-white border border-[#d1c7b3] rounded-sm text-[#1a1f2e] placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-[#1a1f2e] focus:border-transparent transition-all font-mono text-sm pr-12"
                  placeholder="••••••••"
                  disabled={isLoading}
                />
                <button
                  type="button"
                  onClick={() => setShowNewPassword(!showNewPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-[#1a1f2e] transition-colors"
                  disabled={isLoading}
                >
                  {showNewPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                </button>
              </div>

              {/* Password Strength Indicator */}
              {newPassword && (
                <div className="mt-2">
                  <div className="flex items-center justify-between mb-1">
                    <span className="text-xs text-[#4a4a4a]">Password strength</span>
                    <span className="text-xs font-medium" style={{ color: passwordStrength.color }}>
                      {passwordStrength.label}
                    </span>
                  </div>
                  <div className="w-full bg-[#d1c7b3] rounded-full h-1.5">
                    <div
                      className="h-1.5 rounded-full transition-all duration-300"
                      style={{
                        width: `${passwordStrength.strength}%`,
                        backgroundColor: passwordStrength.color
                      }}
                    />
                  </div>
                </div>
              )}
            </div>

            {/* Confirm Password */}
            <div>
              <label htmlFor="confirm-password" className="block text-sm font-medium text-[#1a1f2e] mb-2">
                Confirm New Password
              </label>
              <div className="relative">
                <input
                  id="confirm-password"
                  type={showConfirmPassword ? 'text' : 'password'}
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  className="w-full px-4 py-3 bg-white border border-[#d1c7b3] rounded-sm text-[#1a1f2e] placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-[#1a1f2e] focus:border-transparent transition-all font-mono text-sm pr-12"
                  placeholder="••••••••"
                  disabled={isLoading}
                />
                <button
                  type="button"
                  onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-[#1a1f2e] transition-colors"
                  disabled={isLoading}
                >
                  {showConfirmPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                </button>
              </div>
            </div>

            {/* Validation Rules */}
            {newPassword && (
              <div className="bg-white border border-[#d1c7b3] rounded-sm p-4">
                <p className="text-xs font-medium text-[#1a1f2e] mb-3">Password requirements:</p>
                <div className="space-y-2">
                  {validationRules.map((rule, index) => {
                    if (rule.skipIfReset && mode === 'reset') return null;
                    return (
                      <div key={index} className="flex items-center gap-2">
                        {rule.valid ? (
                          <Check className="w-4 h-4 text-green-600 flex-shrink-0" />
                        ) : (
                          <X className="w-4 h-4 text-gray-400 flex-shrink-0" />
                        )}
                        <span className={`text-xs ${rule.valid ? 'text-green-700' : 'text-[#4a4a4a]'}`}>
                          {rule.label}
                        </span>
                      </div>
                    );
                  })}
                </div>
              </div>
            )}

            {/* Buttons */}
            <div className="flex gap-3 pt-2">
              {mode === 'change' && onCancel && (
                <button
                  type="button"
                  onClick={onCancel}
                  disabled={isLoading}
                  className="flex-1 bg-white text-[#1a1f2e] py-3 px-4 rounded-sm border border-[#d1c7b3] hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-[#1a1f2e] focus:ring-offset-2 transition-all disabled:opacity-50 font-medium"
                >
                  Cancel
                </button>
              )}
              <button
                type="submit"
                disabled={isLoading}
                className="flex-1 bg-[#1a1f2e] text-[#f5f1e8] py-3 px-4 rounded-sm hover:bg-[#252b3d] focus:outline-none focus:ring-2 focus:ring-[#1a1f2e] focus:ring-offset-2 transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2 font-medium"
              >
                {isLoading ? (
                  <>
                    <Loader2 className="w-5 h-5 animate-spin" />
                    <span>Updating...</span>
                  </>
                ) : (
                  'Update Password'
                )}
              </button>
            </div>
          </form>
        </div>

        {/* Footer Note */}
        <div className="mt-6 text-center">
          <p className="text-xs text-[#9ca3af] font-light">
            Authorized users only. Access is role-based.
          </p>
        </div>
      </div>
    </div>
  );
}
