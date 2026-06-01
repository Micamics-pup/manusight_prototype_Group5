import React, { useState } from 'react';
import { Eye, EyeOff, AlertCircle, Loader2 } from 'lucide-react';

interface LoginPageProps {
  onLogin: (email: string, password: string) => void;
  onSwitchToSignup: () => void;
}

export function LoginPage({ onLogin, onSwitchToSignup }: LoginPageProps) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(false);
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [showForgotPassword, setShowForgotPassword] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (!email || !password) {
      setError('Please fill in all fields');
      return;
    }

    if (!email.includes('@')) {
      setError('Please enter a valid email address');
      return;
    }

    setIsLoading(true);

    // Simulate API call delay
    setTimeout(() => {
      onLogin(email, password);
      setIsLoading(false);
    }, 800);
  };

  if (showForgotPassword) {
    return (
      <ForgotPasswordPage onBack={() => setShowForgotPassword(false)} />
    );
  }

  return (
    <div className="min-h-screen bg-[#1a1f2e] flex items-center justify-center p-4 relative overflow-hidden">
      {/* Subtle grid background */}
      <div
        className="absolute inset-0 opacity-[0.03]"
        style={{
          backgroundImage: `linear-gradient(#f5f1e8 1px, transparent 1px), linear-gradient(90deg, #f5f1e8 1px, transparent 1px)`,
          backgroundSize: '32px 32px'
        }}
      />

      <div className="w-full max-w-md relative z-10">
        {/* Header - System Name & Logo Area */}
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

        {/* Login Card */}
        <div className="bg-[#f5f1e8] rounded-sm shadow-2xl p-8 border border-[#e5dcc8]">
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Error Alert */}
            {error && (
              <div className="flex items-start gap-3 p-4 bg-red-50 border border-red-200 rounded-sm">
                <AlertCircle className="w-5 h-5 text-red-600 flex-shrink-0 mt-0.5" />
                <div className="flex-1">
                  <p className="text-sm text-red-800 font-medium">
                    {error === 'Please fill in all fields' || error === 'Please enter a valid email address'
                      ? error
                      : 'Invalid credentials. Please try again.'}
                  </p>
                </div>
              </div>
            )}

            {/* Email Field */}
            <div>
              <label htmlFor="email" className="block text-sm font-medium text-[#1a1f2e] mb-2">
                Email Address
              </label>
              <input
                id="email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full px-4 py-3 bg-white border border-[#d1c7b3] rounded-sm text-[#1a1f2e] placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-[#1a1f2e] focus:border-transparent transition-all font-mono text-sm"
                placeholder="your.email@institution.edu"
                disabled={isLoading}
              />
            </div>

            {/* Password Field */}
            <div>
              <label htmlFor="password" className="block text-sm font-medium text-[#1a1f2e] mb-2">
                Password
              </label>
              <div className="relative">
                <input
                  id="password"
                  type={showPassword ? 'text' : 'password'}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full px-4 py-3 bg-white border border-[#d1c7b3] rounded-sm text-[#1a1f2e] placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-[#1a1f2e] focus:border-transparent transition-all font-mono text-sm pr-12"
                  placeholder="••••••••"
                  disabled={isLoading}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-[#1a1f2e] transition-colors"
                  disabled={isLoading}
                >
                  {showPassword ? (
                    <EyeOff className="w-5 h-5" />
                  ) : (
                    <Eye className="w-5 h-5" />
                  )}
                </button>
              </div>
            </div>

            {/* Remember Me Checkbox */}
            <div className="flex items-center">
              <input
                id="remember"
                type="checkbox"
                checked={rememberMe}
                onChange={(e) => setRememberMe(e.target.checked)}
                className="w-4 h-4 border-[#d1c7b3] rounded text-[#1a1f2e] focus:ring-[#1a1f2e] focus:ring-2"
                disabled={isLoading}
              />
              <label htmlFor="remember" className="ml-2 text-sm text-[#4a4a4a]">
                Remember me
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
                  <span>Authenticating...</span>
                </>
              ) : (
                'Log In'
              )}
            </button>

            {/* Forgot Password Link */}
            <div className="text-center">
              <button
                type="button"
                onClick={() => setShowForgotPassword(true)}
                className="text-sm text-[#4a4a4a] hover:text-[#1a1f2e] transition-colors underline underline-offset-2"
                disabled={isLoading}
              >
                Forgot Password?
              </button>
            </div>
          </form>

          {/* Sign Up Link */}
          <div className="mt-6 text-center pt-6 border-t border-[#d1c7b3]">
            <p className="text-sm text-[#4a4a4a]">
              New author?{' '}
              <button
                onClick={onSwitchToSignup}
                className="text-[#1a1f2e] font-medium underline underline-offset-2 hover:no-underline transition-colors"
                disabled={isLoading}
              >
                Create an account
              </button>
            </p>
          </div>
        </div>

        {/* Demo Accounts */}
        <div className="mt-6 bg-[#f5f1e8] rounded-sm shadow-lg p-6 border border-[#e5dcc8]">
          <h3 className="text-sm font-semibold text-[#1a1f2e] mb-4 text-center">Demo Accounts</h3>
          <div className="space-y-3">
            <div className="bg-white rounded-sm p-3 border border-[#d1c7b3]">
              <div className="flex items-center justify-between mb-1">
                <span className="text-xs font-medium text-[#1a1f2e]">Author</span>
                <span className="text-xs px-2 py-0.5 bg-blue-100 text-blue-800 rounded">Author</span>
              </div>
              <div className="text-xs font-mono text-[#4a4a4a] mb-1">jane.smith@university.edu</div>
              <div className="text-xs text-gray-500">Password: demo123</div>
            </div>

            <div className="bg-white rounded-sm p-3 border border-[#d1c7b3]">
              <div className="flex items-center justify-between mb-1">
                <span className="text-xs font-medium text-[#1a1f2e]">Editor</span>
                <span className="text-xs px-2 py-0.5 bg-purple-100 text-purple-800 rounded">Editor</span>
              </div>
              <div className="text-xs font-mono text-[#4a4a4a] mb-1">sarah.johnson@publisher.com</div>
              <div className="text-xs text-gray-500">Password: demo123</div>
            </div>

            <div className="bg-white rounded-sm p-3 border border-[#d1c7b3]">
              <div className="flex items-center justify-between mb-1">
                <span className="text-xs font-medium text-[#1a1f2e]">Editor-in-Chief</span>
                <span className="text-xs px-2 py-0.5 bg-indigo-100 text-indigo-800 rounded">EIC</span>
              </div>
              <div className="text-xs font-mono text-[#4a4a4a] mb-1">robert.williams@publisher.com</div>
              <div className="text-xs text-gray-500">Password: demo123</div>
            </div>

            <div className="bg-white rounded-sm p-3 border border-[#d1c7b3]">
              <div className="flex items-center justify-between mb-1">
                <span className="text-xs font-medium text-[#1a1f2e]">Reviewer</span>
                <span className="text-xs px-2 py-0.5 bg-green-100 text-green-800 rounded">Reviewer</span>
              </div>
              <div className="text-xs font-mono text-[#4a4a4a] mb-1">michael.chen@reviewer.org</div>
              <div className="text-xs text-gray-500">Password: demo123</div>
            </div>

            <div className="bg-white rounded-sm p-3 border border-[#d1c7b3]">
              <div className="flex items-center justify-between mb-1">
                <span className="text-xs font-medium text-[#1a1f2e]">TWG Coordinator</span>
                <span className="text-xs px-2 py-0.5 bg-orange-100 text-orange-800 rounded">TWG</span>
              </div>
              <div className="text-xs font-mono text-[#4a4a4a] mb-1">maria.rodriguez@publisher.com</div>
              <div className="text-xs text-gray-500">Password: demo123</div>
            </div>

            <div className="bg-white rounded-sm p-3 border border-[#d1c7b3]">
              <div className="flex items-center justify-between mb-1">
                <span className="text-xs font-medium text-[#1a1f2e]">Administrator</span>
                <span className="text-xs px-2 py-0.5 bg-red-100 text-red-800 rounded">Admin</span>
              </div>
              <div className="text-xs font-mono text-[#4a4a4a] mb-1">admin@system.com</div>
              <div className="text-xs text-gray-500">Password: demo123</div>
            </div>
          </div>
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

// Forgot Password Component
interface ForgotPasswordPageProps {
  onBack: () => void;
}

function ForgotPasswordPage({ onBack }: ForgotPasswordPageProps) {
  const [email, setEmail] = useState('');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [sentEmail, setSentEmail] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (!email) {
      setError('Please enter your email address');
      return;
    }

    if (!email.includes('@')) {
      setError('Please enter a valid email address');
      return;
    }

    setIsLoading(true);

    // Simulate API call
    setTimeout(() => {
      // Mock validation - in real app, check if email exists
      const mockEmails = ['demo@example.com', 'author@test.com', 'editor@test.com'];

      if (!mockEmails.includes(email)) {
        setError('No account associated with this email address.');
        setIsLoading(false);
      } else {
        setSentEmail(email);
        setIsSuccess(true);
        setIsLoading(false);
      }
    }, 1000);
  };

  const handleResend = () => {
    setIsLoading(true);
    setTimeout(() => {
      setIsLoading(false);
      // Could show a toast here
    }, 1000);
  };

  return (
    <div className="min-h-screen bg-[#1a1f2e] flex items-center justify-center p-4 relative overflow-hidden">
      {/* Subtle grid background */}
      <div
        className="absolute inset-0 opacity-[0.03]"
        style={{
          backgroundImage: `linear-gradient(#f5f1e8 1px, transparent 1px), linear-gradient(90deg, #f5f1e8 1px, transparent 1px)`,
          backgroundSize: '32px 32px'
        }}
      />

      <div className="w-full max-w-md relative z-10">
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
          {isSuccess ? (
            // Success State
            <div className="space-y-6">
              <div className="text-center">
                <div className="inline-flex items-center justify-center w-12 h-12 bg-green-100 rounded-full mb-4">
                  <svg className="w-6 h-6 text-green-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                </div>
                <h2 className="text-xl font-semibold text-[#1a1f2e] mb-2">
                  Check Your Email
                </h2>
                <p className="text-sm text-[#4a4a4a] mb-4">
                  A password reset link has been sent to
                </p>
                <p className="text-sm font-mono text-[#1a1f2e] mb-6">
                  {sentEmail}
                </p>
                <p className="text-sm text-[#4a4a4a]">
                  Please check your inbox and follow the instructions to reset your password.
                </p>
              </div>

              <div className="text-center pt-4 border-t border-[#d1c7b3]">
                <p className="text-sm text-[#4a4a4a] mb-2">
                  Didn't receive it?
                </p>
                <button
                  onClick={handleResend}
                  disabled={isLoading}
                  className="text-sm text-[#1a1f2e] hover:underline font-medium disabled:opacity-50"
                >
                  {isLoading ? 'Sending...' : 'Resend'}
                </button>
              </div>

              <button
                onClick={onBack}
                className="w-full text-center text-sm text-[#4a4a4a] hover:text-[#1a1f2e] transition-colors"
              >
                ← Back to Login
              </button>
            </div>
          ) : (
            // Form State
            <div>
              <div className="mb-6">
                <h2 className="text-xl font-semibold text-[#1a1f2e] mb-2">
                  Reset Your Password
                </h2>
                <p className="text-sm text-[#4a4a4a]">
                  Enter your registered email address and we'll send you a reset link.
                </p>
              </div>

              <form onSubmit={handleSubmit} className="space-y-6">
                {/* Error Alert */}
                {error && (
                  <div className="flex items-start gap-3 p-4 bg-red-50 border border-red-200 rounded-sm">
                    <AlertCircle className="w-5 h-5 text-red-600 flex-shrink-0 mt-0.5" />
                    <p className="text-sm text-red-800">{error}</p>
                  </div>
                )}

                {/* Email Field */}
                <div>
                  <label htmlFor="reset-email" className="block text-sm font-medium text-[#1a1f2e] mb-2">
                    Email Address
                  </label>
                  <input
                    id="reset-email"
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="w-full px-4 py-3 bg-white border border-[#d1c7b3] rounded-sm text-[#1a1f2e] placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-[#1a1f2e] focus:border-transparent transition-all font-mono text-sm"
                    placeholder="your.email@institution.edu"
                    disabled={isLoading}
                  />
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
                      <span>Sending...</span>
                    </>
                  ) : (
                    'Send Reset Link'
                  )}
                </button>

                {/* Back Link */}
                <button
                  type="button"
                  onClick={onBack}
                  className="w-full text-center text-sm text-[#4a4a4a] hover:text-[#1a1f2e] transition-colors"
                  disabled={isLoading}
                >
                  ← Back to Login
                </button>
              </form>
            </div>
          )}
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
