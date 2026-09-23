import { useState } from 'react';
import {
  Building2,
  Lock,
  Mail,
  Eye,
  EyeOff,
  AlertCircle,
  Loader2,
  ShieldCheck,
  TrendingUp,
  KeyRound,
  CheckCircle2,
} from 'lucide-react';
import { useAuth } from '../context/useAuth';
import { ROLES } from '../data/mockAuth';

export default function Login() {
  const { login } = useAuth();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(true);

  // States
  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const [validationErrors, setValidationErrors] = useState({});

  // Quick fill helper for demo evaluation
  const handleQuickFill = (roleType) => {
    setErrorMessage('');
    setValidationErrors({});
    if (roleType === ROLES.ADMIN) {
      setEmail('admin@estatecrm.com');
      setPassword('admin123');
    } else {
      setEmail('agent@estatecrm.com');
      setPassword('agent123');
    }
  };

  const validateForm = () => {
    const errors = {};
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    if (!email.trim()) {
      errors.email = 'Work email is required';
    } else if (!emailRegex.test(email.trim())) {
      errors.email = 'Please enter a valid email address';
    }

    if (!password) {
      errors.password = 'Password is required';
    } else if (password.length < 6) {
      errors.password = 'Password must be at least 6 characters';
    }

    setValidationErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrorMessage('');

    if (!validateForm()) return;

    setIsLoading(true);
    try {
      await login(email, password);
    } catch (err) {
      setErrorMessage(err.message || 'Authentication failed. Please check credentials.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col justify-center bg-slate-50 lg:bg-gradient-to-br lg:from-slate-900 lg:via-purple-950 lg:to-slate-900 p-4 sm:p-6 lg:p-8">
      <div className="mx-auto w-full max-w-5xl rounded-3xl overflow-hidden bg-white shadow-2xl border border-slate-200/80 flex flex-col lg:flex-row">
        {/* Left Side: Brand & Value Showcase (Hidden on small mobile if needed, elegant on desktop) */}
        <div className="lg:w-5/12 bg-gradient-to-br from-purple-700 via-purple-800 to-slate-900 p-8 sm:p-10 text-white flex flex-col justify-between relative overflow-hidden">
          {/* Background Ambient Glow */}
          <div className="absolute -top-24 -left-24 h-72 w-72 rounded-full bg-purple-500/20 blur-3xl pointer-events-none" />
          <div className="absolute -bottom-24 -right-24 h-72 w-72 rounded-full bg-purple-400/20 blur-3xl pointer-events-none" />

          {/* Top Logo */}
          <div className="relative z-10">
            <div className="flex items-center gap-3">
              <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-white/10 backdrop-blur-md border border-white/20 text-white shadow-md">
                <Building2 className="h-6 w-6" />
              </div>
              <div>
                <div className="flex items-center gap-1.5">
                  <span className="text-xl font-bold tracking-tight">EstateFlow</span>
                  <span className="rounded bg-white/20 px-1.5 py-0.5 text-[10px] font-bold uppercase tracking-wider">
                    CRM
                  </span>
                </div>
                <p className="text-xs text-purple-200">Realty Enterprise Suite</p>
              </div>
            </div>

            <div className="mt-8">
              <span className="inline-flex items-center gap-1.5 rounded-full bg-purple-500/20 px-3 py-1 text-xs font-semibold text-purple-200 border border-purple-400/30">
                <ShieldCheck className="h-3.5 w-3.5 text-purple-300" />
                Role-Based Agency Access
              </span>
              <h1 className="mt-3 text-2xl sm:text-3xl font-bold tracking-tight text-white leading-tight">
                Modern Real Estate Sales & Inventory Suite
              </h1>
              <p className="mt-3 text-xs sm:text-sm text-purple-100/80 leading-relaxed">
                Connect brokers, track property walkthroughs, manage luxury listings, and accelerate deal closures.
              </p>
            </div>
          </div>

          {/* Metric Highlights */}
          <div className="relative z-10 my-8 space-y-3">
            <div className="flex items-center gap-3 rounded-2xl bg-white/10 backdrop-blur-xs p-3.5 border border-white/10">
              <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-white/15 text-purple-200">
                <TrendingUp className="h-5 w-5" />
              </div>
              <div>
                <div className="text-sm font-bold text-white">$24.6M Portfolio</div>
                <div className="text-[11px] text-purple-200">Tracked in active CRM pipeline</div>
              </div>
            </div>

            <div className="flex items-center gap-3 rounded-2xl bg-white/10 backdrop-blur-xs p-3.5 border border-white/10">
              <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-white/15 text-purple-200">
                <CheckCircle2 className="h-5 w-5" />
              </div>
              <div>
                <div className="text-sm font-bold text-white">Double-Booking Guard</div>
                <div className="text-[11px] text-purple-200">Real-time inventory conflict locks</div>
              </div>
            </div>
          </div>

          {/* Footer Note */}
          <div className="relative z-10 pt-4 border-t border-white/15 text-[11px] text-purple-200/70 flex items-center justify-between">
            <span>Enterprise Realty Edition</span>
            <span>v2.4 Pro</span>
          </div>
        </div>

        {/* Right Side: Login Form */}
        <div className="lg:w-7/12 p-8 sm:p-12 flex flex-col justify-center">
          <div className="max-w-md w-full mx-auto">
            {/* Header */}
            <div>
              <h2 className="text-2xl font-bold tracking-tight text-slate-900">
                Sign in to your account
              </h2>
              <p className="mt-1 text-xs sm:text-sm text-slate-500">
                Enter your credentials to access the agency workspace
              </p>
            </div>

            {/* Quick Demo Credentials Panel */}
            <div className="mt-5 rounded-2xl border border-purple-100 bg-purple-50/70 p-4">
              <div className="flex items-center gap-1.5 text-xs font-semibold text-purple-900">
                <KeyRound className="h-3.5 w-3.5 text-purple-600" />
                <span>Demo One-Click Credentials:</span>
              </div>
              <div className="mt-2.5 grid grid-cols-1 sm:grid-cols-2 gap-2">
                <button
                  type="button"
                  onClick={() => handleQuickFill(ROLES.ADMIN)}
                  className="flex flex-col items-start rounded-xl border border-purple-200 bg-white p-2.5 text-left transition-all hover:border-purple-400 hover:shadow-xs cursor-pointer group"
                >
                  <div className="flex items-center justify-between w-full">
                    <span className="text-xs font-bold text-slate-900 group-hover:text-purple-600">
                      Login as Admin
                    </span>
                    <span className="rounded bg-purple-100 px-1.5 py-0.2 text-[10px] font-bold text-purple-700">
                      Full Access
                    </span>
                  </div>
                  <span className="text-[11px] text-slate-500 mt-0.5">admin@estatecrm.com</span>
                </button>

                <button
                  type="button"
                  onClick={() => handleQuickFill(ROLES.SALES_EMPLOYEE)}
                  className="flex flex-col items-start rounded-xl border border-purple-200 bg-white p-2.5 text-left transition-all hover:border-purple-400 hover:shadow-xs cursor-pointer group"
                >
                  <div className="flex items-center justify-between w-full">
                    <span className="text-xs font-bold text-slate-900 group-hover:text-purple-600">
                      Login as Sales
                    </span>
                    <span className="rounded bg-emerald-100 px-1.5 py-0.2 text-[10px] font-bold text-emerald-700">
                      Agent Role
                    </span>
                  </div>
                  <span className="text-[11px] text-slate-500 mt-0.5">agent@estatecrm.com</span>
                </button>
              </div>
            </div>

            {/* Error Banner */}
            {errorMessage && (
              <div className="mt-4 rounded-xl border border-rose-200 bg-rose-50 p-3.5 text-xs text-rose-800 flex items-start gap-2.5 animate-fadeIn">
                <AlertCircle className="h-4 w-4 text-rose-600 shrink-0 mt-0.5" />
                <div>
                  <div className="font-bold text-rose-900">Authentication Failed</div>
                  <div className="mt-0.5">{errorMessage}</div>
                </div>
              </div>
            )}

            {/* Login Form */}
            <form onSubmit={handleSubmit} className="mt-6 space-y-4">
              {/* Email Input */}
              <div>
                <label
                  htmlFor="login-email"
                  className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1.5"
                >
                  Work Email Address
                </label>
                <div className="relative">
                  <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3.5 text-slate-400">
                    <Mail className="h-4 w-4" />
                  </div>
                  <input
                    id="login-email"
                    type="email"
                    value={email}
                    disabled={isLoading}
                    onChange={(e) => {
                      setEmail(e.target.value);
                      if (validationErrors.email) {
                        setValidationErrors((prev) => ({ ...prev, email: null }));
                      }
                    }}
                    placeholder="name@estatecrm.com"
                    autoComplete="email"
                    className={`w-full rounded-xl border bg-slate-50/70 py-2.5 pl-10 pr-4 text-xs sm:text-sm text-slate-800 transition-all focus:bg-white focus:outline-none focus:ring-2 ${
                      validationErrors.email
                        ? 'border-rose-400 focus:border-rose-500 focus:ring-rose-100'
                        : 'border-slate-200 focus:border-purple-500 focus:ring-purple-100'
                    } disabled:opacity-60 disabled:cursor-not-allowed`}
                  />
                </div>
                {validationErrors.email && (
                  <p className="mt-1 flex items-center gap-1 text-xs text-rose-500">
                    <AlertCircle className="h-3 w-3" />
                    {validationErrors.email}
                  </p>
                )}
              </div>

              {/* Password Input with Show/Hide Toggle */}
              <div>
                <div className="flex items-center justify-between mb-1.5">
                  <label
                    htmlFor="login-password"
                    className="block text-xs font-semibold text-slate-700 uppercase tracking-wider"
                  >
                    Password
                  </label>
                  <span className="text-[11px] font-medium text-purple-600 hover:text-purple-700 cursor-pointer">
                    Forgot password?
                  </span>
                </div>
                <div className="relative">
                  <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3.5 text-slate-400">
                    <Lock className="h-4 w-4" />
                  </div>
                  <input
                    id="login-password"
                    type={showPassword ? 'text' : 'password'}
                    value={password}
                    disabled={isLoading}
                    onChange={(e) => {
                      setPassword(e.target.value);
                      if (validationErrors.password) {
                        setValidationErrors((prev) => ({ ...prev, password: null }));
                      }
                    }}
                    placeholder="Enter your password"
                    autoComplete="current-password"
                    className={`w-full rounded-xl border bg-slate-50/70 py-2.5 pl-10 pr-10 text-xs sm:text-sm text-slate-800 transition-all focus:bg-white focus:outline-none focus:ring-2 ${
                      validationErrors.password
                        ? 'border-rose-400 focus:border-rose-500 focus:ring-rose-100'
                        : 'border-slate-200 focus:border-purple-500 focus:ring-purple-100'
                    } disabled:opacity-60 disabled:cursor-not-allowed`}
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    disabled={isLoading}
                    className="absolute inset-y-0 right-0 flex items-center pr-3 text-slate-400 hover:text-slate-600 cursor-pointer focus:outline-none"
                    aria-label={showPassword ? 'Hide password' : 'Show password'}
                  >
                    {showPassword ? (
                       <EyeOff className="h-4 w-4" />
                    ) : (
                      <Eye className="h-4 w-4" />
                    )}
                  </button>
                </div>
                {validationErrors.password && (
                  <p className="mt-1 flex items-center gap-1 text-xs text-rose-500">
                    <AlertCircle className="h-3 w-3" />
                    {validationErrors.password}
                  </p>
                )}
              </div>

              {/* Remember Me Checkbox */}
              <div className="flex items-center justify-between text-xs pt-1">
                <label className="flex items-center gap-2 text-slate-600 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={rememberMe}
                    onChange={(e) => setRememberMe(e.target.checked)}
                    className="h-4 w-4 rounded border-slate-300 text-purple-600 focus:ring-purple-500 cursor-pointer"
                  />
                  <span>Keep me signed in</span>
                </label>
              </div>

              {/* Submit Button with Loading State */}
              <button
                type="submit"
                disabled={isLoading}
                className="w-full flex items-center justify-center gap-2 rounded-xl bg-purple-600 py-3 px-4 text-xs sm:text-sm font-semibold text-white shadow-md shadow-purple-200 hover:bg-purple-700 active:scale-[0.99] transition-all disabled:opacity-60 disabled:cursor-not-allowed cursor-pointer"
              >
                {isLoading ? (
                  <>
                    <Loader2 className="h-4 w-4 animate-spin text-white" />
                    <span>Signing in to workspace...</span>
                  </>
                ) : (
                  <span>Sign In</span>
                )}
              </button>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}
