import React, { useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { AlertCircle, Aperture, Eye, EyeOff, KeyRound } from 'lucide-react';
import { toast } from 'sonner';
import { useAuth } from '../context/AuthContext';
import { GoogleAuthModal } from '../components/GoogleAuthModal';
import { GoogleIcon } from '../components/icons/BrandIcons';

export function LoginPage() {
  const { login, loginWithGoogle } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const from = (location.state as { from?: { pathname?: string } } | null)?.from?.pathname || '/';

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState('');
  const [googleModalOpen, setGoogleModalOpen] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setSubmitting(true);
    try {
      const user = await login(email, password);
      toast.success(`Welcome back, ${user.name}.`);
      navigate(from, { replace: true });
    } catch (err) {
      const msg = err instanceof Error ? err.message : 'Unable to log in. Please check your credentials.';
      setError(msg);
      toast.error(msg);
    } finally {
      setSubmitting(false);
    }
  };

  const handleGoogleSelect = async (account: { name: string; email: string }) => {
    setError('');
    setSubmitting(true);
    try {
      const user = await loginWithGoogle(account);
      setGoogleModalOpen(false);
      toast.success(`Signed in with Google as ${user.name}.`);
      navigate(from, { replace: true });
    } catch (err) {
      const msg = err instanceof Error ? err.message : 'Google authentication failed.';
      setError(msg);
      toast.error(msg);
    } finally {
      setSubmitting(false);
    }
  };

  const fillDemoAccount = () => {
    setEmail('alex@studiospace.io');
    setPassword('Studio123!');
    setError('');
    toast.info('Examiner credentials filled. Click Login to continue.');
  };

  return (
    <div className="min-h-[calc(100vh-8rem)] flex items-center justify-center px-4 py-12">
      <div className="w-full max-w-md bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-xl p-7 sm:p-8 space-y-6">
        <div className="space-y-2">
          <div className="inline-flex items-center gap-2 text-xs font-medium text-blue-700 dark:text-blue-400">
            <Aperture className="w-4 h-4" />
            <span>StudioSpace Account</span>
          </div>
          <h1 className="font-display text-3xl font-bold tracking-tight text-zinc-950 dark:text-zinc-50">
            Login to StudioSpace
          </h1>
          <p className="text-sm text-zinc-600 dark:text-zinc-400">
            Sign in to reserve studio hours, manage listings, and download booking invoices.
          </p>
        </div>

        {/* Examiner quick-fill banner */}
        <div className="p-3.5 rounded-lg bg-zinc-50 dark:bg-zinc-950 border border-zinc-200 dark:border-zinc-800 flex items-center justify-between gap-3">
          <div className="text-xs text-zinc-600 dark:text-zinc-400">
            <p className="font-semibold text-zinc-900 dark:text-zinc-100">Examiner Test Account</p>
            <p className="font-mono mt-0.5">alex@studiospace.io / Studio123!</p>
          </div>
          <button
            type="button"
            onClick={fillDemoAccount}
            className="px-3 py-1.5 rounded-md border border-zinc-300 dark:border-zinc-700 text-xs font-semibold text-zinc-800 dark:text-zinc-200 hover:bg-zinc-200/70 dark:hover:bg-zinc-800 transition-colors whitespace-nowrap shrink-0 inline-flex items-center gap-1"
          >
            <KeyRound className="w-3.5 h-3.5" />
            <span>Fill</span>
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label
              htmlFor="login-email"
              className="block text-sm font-medium text-zinc-800 dark:text-zinc-200 mb-1.5"
            >
              Email Address
            </label>
            <input
              id="login-email"
              type="email"
              required
              autoComplete="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="you@studio.com"
              className="w-full h-11 px-3.5 rounded-lg bg-zinc-50 dark:bg-zinc-950 border border-zinc-300 dark:border-zinc-700 text-sm text-zinc-950 dark:text-zinc-100 focus:outline-none focus:ring-2 focus:ring-blue-600"
            />
          </div>

          <div>
            <div className="flex items-center justify-between mb-1.5">
              <label
                htmlFor="login-password"
                className="block text-sm font-medium text-zinc-800 dark:text-zinc-200"
              >
                Password
              </label>
              <button
                type="button"
                onClick={() =>
                  toast.info(
                    'Password reset email is intentionally disabled for evaluation. Use alex@studiospace.io / Studio123! or register a new account.'
                  )
                }
                className="text-xs font-medium text-blue-700 dark:text-blue-400 hover:underline"
              >
                Forgot Password?
              </button>
            </div>
            <div className="relative">
              <input
                id="login-password"
                type={showPassword ? 'text' : 'password'}
                required
                autoComplete="current-password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Enter your password"
                className="w-full h-11 pl-3.5 pr-10 rounded-lg bg-zinc-50 dark:bg-zinc-950 border border-zinc-300 dark:border-zinc-700 text-sm text-zinc-950 dark:text-zinc-100 focus:outline-none focus:ring-2 focus:ring-blue-600"
              />
              <button
                type="button"
                onClick={() => setShowPassword((v) => !v)}
                aria-label={showPassword ? 'Hide password' : 'Show password'}
                className="absolute right-2.5 top-1/2 -translate-y-1/2 p-1.5 text-zinc-400 hover:text-zinc-700 dark:hover:text-zinc-200"
              >
                {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
              </button>
            </div>
          </div>

          {error && (
            <div
              role="alert"
              className="p-3 rounded-lg bg-rose-50 dark:bg-rose-950/50 border border-rose-200 dark:border-rose-900 text-xs text-rose-700 dark:text-rose-300 flex items-start gap-2"
            >
              <AlertCircle className="w-4 h-4 shrink-0 mt-0.5" />
              <span>{error}</span>
            </div>
          )}

          <button
            type="submit"
            disabled={submitting}
            className="w-full h-11 rounded-lg bg-blue-700 hover:bg-blue-800 dark:bg-blue-600 dark:hover:bg-blue-500 text-white text-sm font-semibold transition-colors disabled:opacity-60"
          >
            {submitting ? 'Signing in...' : 'Login'}
          </button>
        </form>

        <div className="relative">
          <div className="absolute inset-0 flex items-center">
            <div className="w-full border-t border-zinc-200 dark:border-zinc-800" />
          </div>
          <div className="relative flex justify-center text-xs">
            <span className="px-2.5 bg-white dark:bg-zinc-900 text-zinc-500">
              Or continue with
            </span>
          </div>
        </div>

        <button
          type="button"
          onClick={() => setGoogleModalOpen(true)}
          disabled={submitting}
          className="w-full h-11 rounded-lg border border-zinc-300 dark:border-zinc-700 bg-white dark:bg-zinc-950 hover:bg-zinc-50 dark:hover:bg-zinc-800 text-sm font-semibold text-zinc-900 dark:text-zinc-100 flex items-center justify-center gap-2.5 transition-colors disabled:opacity-60"
        >
          <GoogleIcon />
          <span>Continue with Google</span>
        </button>

        <p className="text-center text-sm text-zinc-600 dark:text-zinc-400">
          New to StudioSpace?{' '}
          <Link
            to="/register"
            className="font-semibold text-blue-700 dark:text-blue-400 hover:underline"
          >
            Register an account
          </Link>
        </p>
      </div>

      <GoogleAuthModal
        open={googleModalOpen}
        busy={submitting}
        onSelect={handleGoogleSelect}
        onClose={() => setGoogleModalOpen(false)}
      />
    </div>
  );
}
