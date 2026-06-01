import React, { useState } from 'react';
import { Eye, EyeOff, AlertCircle, Check, X, Loader2, Info, Mail } from 'lucide-react';

interface SignupPageProps {
  onSignup: (name: string, email: string, password: string) => void;
  onSwitchToLogin: () => void;
}

export function SignupPage({ onSignup, onSwitchToLogin }: SignupPageProps) {
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [email, setEmail] = useState('');
  const [affiliation, setAffiliation] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [agreedToTerms, setAgreedToTerms] = useState(false);
  const [error, setError] = useState('');
  const [fieldErrors, setFieldErrors] = useState<Record<string, string>>({});
  const [isLoading, setIsLoading] = useState(false);
  const [isPendingApproval, setIsPendingApproval] = useState(false);

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

  const passwordStrength = calculatePasswordStrength(password);

  // Validation rules
  const passwordValidationRules = [
    {
      label: 'At least 8 characters',
      valid: password.length >= 8
    },
    {
      label: 'At least one uppercase letter',
      valid: /[A-Z]/.test(password)
    },
    {
      label: 'At least one number or special character',
      valid: /[0-9]/.test(password) || /[^A-Za-z0-9]/.test(password)
    },
    {
      label: 'Passwords match',
      valid: confirmPassword === password && confirmPassword.length > 0
    }
  ];

  const validateEmail = (email: string): boolean => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setFieldErrors({});

    const errors: Record<string, string> = {};

    // Validate all fields
    if (!firstName.trim()) {
      errors.firstName = 'First name is required';
    }

    if (!lastName.trim()) {
      errors.lastName = 'Last name is required';
    }

    if (!email.trim()) {
      errors.email = 'Email is required';
    } else if (!validateEmail(email)) {
      errors.email = 'Please enter a valid email address';
    } else {
      // Mock check for existing email
      const existingEmails = ['existing@test.com', 'taken@example.com'];
      if (existingEmails.includes(email.toLowerCase())) {
        errors.email = 'An account with this email already exists. Try logging in instead.';
      }
    }

    if (!affiliation.trim()) {
      errors.affiliation = 'Institutional affiliation is required';
    }

    if (!password) {
      errors.password = 'Password is required';
    } else if (password.length < 8) {
      errors.password = 'Password must be at least 8 characters';
    } else if (!/[A-Z]/.test(password)) {
      errors.password = 'Password must contain at least one uppercase letter';
    } else if (!/[0-9]/.test(password) && !/[^A-Za-z0-9]/.test(password)) {
      errors.password = 'Password must contain at least one number or special character';
    }

    if (!confirmPassword) {
      errors.confirmPassword = 'Please confirm your password';
    } else if (password !== confirmPassword) {
      errors.confirmPassword = 'Passwords do not match';
    }

    if (!agreedToTerms) {
      setError('You must agree to the Terms of Use and Privacy Policy to continue');
    }

    if (Object.keys(errors).length > 0) {
      setFieldErrors(errors);
      return;
    }

    setIsLoading(true);

    // Simulate API call
    setTimeout(() => {
      setIsLoading(false);
      setIsPendingApproval(true);
    }, 1200);
  };

  // Pending Approval Screen
  if (isPendingApproval) {
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
            <div className="text-center space-y-6 py-4">
              <div className="inline-flex items-center justify-center w-16 h-16 bg-blue-50 rounded-full">
                <Mail className="w-8 h-8 text-blue-600" />
              </div>

              <div>
                <h2 className="text-2xl font-semibold text-[#1a1f2e] mb-3">
                  Registration Submitted
                </h2>
                <p className="text-sm text-[#4a4a4a] leading-relaxed">
                  Your author account request has been received. An administrator will review and activate your account. You will receive an email notification once approved.
                </p>
              </div>

              <div className="pt-4">
                <button
                  onClick={onSwitchToLogin}
                  className="w-full bg-[#1a1f2e] text-[#f5f1e8] py-3 px-4 rounded-sm hover:bg-[#252b3d] transition-all font-medium"
                >
                  Back to Login
                </button>
              </div>
            </div>
          </div>

          <div className="mt-6 text-center">
            <p className="text-xs text-[#9ca3af] font-light">
              Authorized users only. Access is role-based.
            </p>
          </div>
        </div>
      </div>
    );
  }

  // Registration Form
  return (
    <div className="min-h-screen bg-[#1a1f2e] flex items-center justify-center p-4 relative overflow-hidden">
      <div
        className="absolute inset-0 opacity-[0.03]"
        style={{
          backgroundImage: `linear-gradient(#f5f1e8 1px, transparent 1px), linear-gradient(90deg, #f5f1e8 1px, transparent 1px)`,
          backgroundSize: '32px 32px'
        }}
      />

      <div className="w-full max-w-2xl relative z-10">
        {/* Header */}
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

        {/* Card */}
        <div className="bg-[#f5f1e8] rounded-sm shadow-2xl p-8 border border-[#e5dcc8]">
          {/* Header */}
          <div className="mb-6">
            <h2 className="text-xl font-semibold text-[#1a1f2e] mb-2">
              Create Author Account
            </h2>
            <p className="text-sm text-[#4a4a4a]">
              Register to submit and manage your manuscripts.
            </p>
          </div>

          {/* Role Restriction Notice */}
          <div className="mb-6 p-4 bg-blue-50 border border-blue-100 rounded-sm flex items-start gap-3">
            <Info className="w-5 h-5 text-blue-600 flex-shrink-0 mt-0.5" />
            <div className="flex-1">
              <p className="text-sm text-blue-900 leading-relaxed">
                This registration form is for manuscript authors only. If you are a reviewer, editor, or staff member, please contact your system administrator to have your account created.
              </p>
            </div>
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-5">
            {/* General Error */}
            {error && (
              <div className="flex items-start gap-3 p-4 bg-red-50 border border-red-200 rounded-sm">
                <AlertCircle className="w-5 h-5 text-red-600 flex-shrink-0 mt-0.5" />
                <p className="text-sm text-red-800">{error}</p>
              </div>
            )}

            {/* Name Fields - Two Column */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label htmlFor="firstName" className="block text-sm font-medium text-[#1a1f2e] mb-2">
                  First Name <span className="text-red-600">*</span>
                </label>
                <input
                  id="firstName"
                  type="text"
                  value={firstName}
                  onChange={(e) => {
                    setFirstName(e.target.value);
                    setFieldErrors({ ...fieldErrors, firstName: '' });
                  }}
                  className={`w-full px-4 py-3 bg-white border ${
                    fieldErrors.firstName ? 'border-red-400' : 'border-[#d1c7b3]'
                  } rounded-sm text-[#1a1f2e] placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-[#1a1f2e] focus:border-transparent transition-all text-sm`}
                  placeholder="John"
                  disabled={isLoading}
                />
                {fieldErrors.firstName && (
                  <p className="mt-1 text-xs text-red-600">{fieldErrors.firstName}</p>
                )}
              </div>

              <div>
                <label htmlFor="lastName" className="block text-sm font-medium text-[#1a1f2e] mb-2">
                  Last Name <span className="text-red-600">*</span>
                </label>
                <input
                  id="lastName"
                  type="text"
                  value={lastName}
                  onChange={(e) => {
                    setLastName(e.target.value);
                    setFieldErrors({ ...fieldErrors, lastName: '' });
                  }}
                  className={`w-full px-4 py-3 bg-white border ${
                    fieldErrors.lastName ? 'border-red-400' : 'border-[#d1c7b3]'
                  } rounded-sm text-[#1a1f2e] placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-[#1a1f2e] focus:border-transparent transition-all text-sm`}
                  placeholder="Doe"
                  disabled={isLoading}
                />
                {fieldErrors.lastName && (
                  <p className="mt-1 text-xs text-red-600">{fieldErrors.lastName}</p>
                )}
              </div>
            </div>

            {/* Email */}
            <div>
              <label htmlFor="email" className="block text-sm font-medium text-[#1a1f2e] mb-2">
                Email Address <span className="text-red-600">*</span>
              </label>
              <input
                id="email"
                type="email"
                value={email}
                onChange={(e) => {
                  setEmail(e.target.value);
                  setFieldErrors({ ...fieldErrors, email: '' });
                }}
                className={`w-full px-4 py-3 bg-white border ${
                  fieldErrors.email ? 'border-red-400' : 'border-[#d1c7b3]'
                } rounded-sm text-[#1a1f2e] placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-[#1a1f2e] focus:border-transparent transition-all font-mono text-sm`}
                placeholder="your.email@institution.edu"
                disabled={isLoading}
              />
              {fieldErrors.email && (
                <p className="mt-1 text-xs text-red-600">{fieldErrors.email}</p>
              )}
            </div>

            {/* Institutional Affiliation */}
            <div>
              <label htmlFor="affiliation" className="block text-sm font-medium text-[#1a1f2e] mb-2">
                Institutional Affiliation <span className="text-red-600">*</span>
              </label>
              <input
                id="affiliation"
                type="text"
                value={affiliation}
                onChange={(e) => {
                  setAffiliation(e.target.value);
                  setFieldErrors({ ...fieldErrors, affiliation: '' });
                }}
                className={`w-full px-4 py-3 bg-white border ${
                  fieldErrors.affiliation ? 'border-red-400' : 'border-[#d1c7b3]'
                } rounded-sm text-[#1a1f2e] placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-[#1a1f2e] focus:border-transparent transition-all text-sm`}
                placeholder="University, organization, or publisher name"
                disabled={isLoading}
              />
              {fieldErrors.affiliation && (
                <p className="mt-1 text-xs text-red-600">{fieldErrors.affiliation}</p>
              )}
            </div>

            {/* Password */}
            <div>
              <label htmlFor="password" className="block text-sm font-medium text-[#1a1f2e] mb-2">
                Password <span className="text-red-600">*</span>
              </label>
              <div className="relative">
                <input
                  id="password"
                  type={showPassword ? 'text' : 'password'}
                  value={password}
                  onChange={(e) => {
                    setPassword(e.target.value);
                    setFieldErrors({ ...fieldErrors, password: '' });
                  }}
                  className={`w-full px-4 py-3 bg-white border ${
                    fieldErrors.password ? 'border-red-400' : 'border-[#d1c7b3]'
                  } rounded-sm text-[#1a1f2e] placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-[#1a1f2e] focus:border-transparent transition-all font-mono text-sm pr-12`}
                  placeholder="••••••••"
                  disabled={isLoading}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-[#1a1f2e] transition-colors"
                  disabled={isLoading}
                >
                  {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                </button>
              </div>
              {fieldErrors.password && (
                <p className="mt-1 text-xs text-red-600">{fieldErrors.password}</p>
              )}

              {/* Password Strength Indicator */}
              {password && !fieldErrors.password && (
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
              <label htmlFor="confirmPassword" className="block text-sm font-medium text-[#1a1f2e] mb-2">
                Confirm Password <span className="text-red-600">*</span>
              </label>
              <div className="relative">
                <input
                  id="confirmPassword"
                  type={showConfirmPassword ? 'text' : 'password'}
                  value={confirmPassword}
                  onChange={(e) => {
                    setConfirmPassword(e.target.value);
                    setFieldErrors({ ...fieldErrors, confirmPassword: '' });
                  }}
                  className={`w-full px-4 py-3 bg-white border ${
                    fieldErrors.confirmPassword ? 'border-red-400' : 'border-[#d1c7b3]'
                  } rounded-sm text-[#1a1f2e] placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-[#1a1f2e] focus:border-transparent transition-all font-mono text-sm pr-12`}
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
              {fieldErrors.confirmPassword && (
                <p className="mt-1 text-xs text-red-600">{fieldErrors.confirmPassword}</p>
              )}
            </div>

            {/* Password Requirements */}
            {password && (
              <div className="bg-white border border-[#d1c7b3] rounded-sm p-4">
                <p className="text-xs font-medium text-[#1a1f2e] mb-3">Password requirements:</p>
                <div className="space-y-2">
                  {passwordValidationRules.map((rule, index) => (
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
                  ))}
                </div>
              </div>
            )}

            {/* Terms & Privacy Checkbox */}
            <div className="flex items-start gap-3 pt-2">
              <input
                id="terms"
                type="checkbox"
                checked={agreedToTerms}
                onChange={(e) => setAgreedToTerms(e.target.checked)}
                className="w-4 h-4 mt-1 border-[#d1c7b3] rounded text-[#1a1f2e] focus:ring-[#1a1f2e] focus:ring-2"
                disabled={isLoading}
              />
              <label htmlFor="terms" className="text-sm text-[#4a4a4a] flex-1">
                I agree to the system's{' '}
                <button type="button" className="text-[#1a1f2e] underline hover:no-underline">
                  Terms of Use
                </button>{' '}
                and{' '}
                <button type="button" className="text-[#1a1f2e] underline hover:no-underline">
                  Data Privacy Policy
                </button>
                .
              </label>
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              disabled={isLoading}
              className="w-full bg-[#1a1f2e] text-[#f5f1e8] py-3 px-4 rounded-sm hover:bg-[#252b3d] focus:outline-none focus:ring-2 focus:ring-[#1a1f2e] focus:ring-offset-2 transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2 font-medium"
            >
              {isLoading ? (
                <>
                  <Loader2 className="w-5 h-5 animate-spin" />
                  <span>Creating Account...</span>
                </>
              ) : (
                'Create Account'
              )}
            </button>

            {/* Back to Login Link */}
            <div className="text-center pt-2">
              <button
                type="button"
                onClick={onSwitchToLogin}
                className="text-sm text-[#4a4a4a] hover:text-[#1a1f2e] transition-colors"
                disabled={isLoading}
              >
                Already have an account?{' '}
                <span className="underline underline-offset-2">Log In</span>
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
