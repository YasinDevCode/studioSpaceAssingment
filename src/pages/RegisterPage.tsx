import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { AlertCircle, Aperture, Check, Eye, EyeOff } from 'lucide-react';
import { toast } from 'sonner';
import { useAuth } from '../context/AuthContext';
import { GoogleAuthModal } from '../components/GoogleAuthModal';
import { GoogleIcon } from '../components/icons/BrandIcons';
import { validatePassword } from '../utils/format';

export function RegisterPage() {
  const { register, loginWithGoogle } = useAuth();
  const navigate = useNavigate();

  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [photoUrl, setPhotoUrl] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [passwordError, setPasswordError] = useState('');
  const [formError, setFormError] = useState('');
  const [googleModalOpen, setGoogleModalOpen] = useState(false);

  const hasUppercase = /[A-Z]/.test(password);
  const hasLowercase = /[a-z]/.test(password);
  const hasMinLength = password.length >= 6;
  const isPasswordValid = hasUppercase && hasLowercase && hasMinLength;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setFormError('');
    const pwdErr = validatePassword(password);
    if (pwdErr) {
      setPasswordError(pwdErr);
      toast.error(pwdErr);
      return;
    }
    setPasswordError('');
    setSubmitting(true);

    try {
      await register({
        name: name.trim(),
        email: email.trim(),
        photoUrl: photoUrl.trim(),
        password,
      });
      toast.success('Registration successful! Please log in with your new account.');
      navigate('/login');
    } catch (err) {
      const msg = err instanceof Error ? err.message : 'Unable to complete registration.';
      setFormError(msg);
      toast.error(msg);
    } finally {
      setSubmitting(false);
    }
  };

  const handleGoogleSelect = async (account: { name: string; email: string }) => {
    setFormError('');
    setSubmitting(true);
    try {
      const user = await loginWithGoogle(account);
      setGoogleModalOpen(false);
      toast.success(`Signed in with Google as ${user.name}.`);
      navigate('/');
    } catch (err) {
      const msg = err instanceof Error ? err.message : 'Google authentication failed.';
      setFormError(msg);
      toast.error(msg);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="min-h-[calc(100vh-8rem)] flex items-center justify-center px-4 py-12">
      <div className="w-full max-w-md bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-xl p-7 sm:p-8 space-y-6">
        <div className="space-y-2">
          <div className="inline-flex items-center gap-2 text-xs font-medium text-blue-700 dark:text-blue-400">
            <Aperture className="w-4 h-4" />
            <span>Create Account</span>
          </div>
          <h1 className="font-display text-3xl font-bold tracking-tight text-zinc-950 dark:text-zinc-50">
            Register on StudioSpace
          </h1>
          <p className="text-sm text-zinc-600 dark:text-zinc-400">
            Join filmmakers, photographers, podcasters, and studio hosts across the marketplace.
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label
              htmlFor="reg-name"
              className="block text-sm font-medium text-zinc-800 dark:text-zinc-200 mb-1.5"
            >
              Full Name
            </label>
            <input
              id="reg-name"
              type="text"
              required
              autoComplete="name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Jordan Alvarez"
              className="w-full h-11 px-3.5 rounded-lg bg-zinc-50 dark:bg-zinc-950 border border-zinc-300 dark:border-zinc-700 text-sm text-zinc-950 dark:text-zinc-100 focus:outline-none focus:ring-2 focus:ring-blue-600"
            />
          </div>

          <div>
            <label
              htmlFor="reg-email"
              className="block text-sm font-medium text-zinc-800 dark:text-zinc-200 mb-1.5"
            >
              Email Address
            </label>
            <input
              id="reg-email"
              type="email"
              required
              autoComplete="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="jordan@production.co"
              className="w-full h-11 px-3.5 rounded-lg bg-zinc-50 dark:bg-zinc-950 border border-zinc-300 dark:border-zinc-700 text-sm text-zinc-950 dark:text-zinc-100 focus:outline-none focus:ring-2 focus:ring-blue-600"
            />
          </div>

          <div>
            <label
              htmlFor="reg-photo"
              className="block text-sm font-medium text-zinc-800 dark:text-zinc-200 mb-1.5"
            >
              Photo URL <span className="text-zinc-400 font-normal">(optional)</span>
            </label>
            <input
              id="reg-photo"
              type="url"
              value={photoUrl}
              onChange={(e) => setPhotoUrl(e.target.value)}
              placeholder="https://i.ibb.co/your-avatar.jpg"
              className="w-full h-11 px-3.5 rounded-lg bg-zinc-50 dark:bg-zinc-950 border border-zinc-300 dark:border-zinc-700 text-sm text-zinc-950 dark:text-zinc-100 focus:outline-none focus:ring-2 focus:ring-blue-600"
            />
          </div>

          <div>
            <label
              htmlFor="reg-password"
              className="block text-sm font-medium text-zinc-800 dark:text-zinc-200 mb-1.5"
            >
              Password
            </label>
            <div className="relative">
              <input
                id="reg-password"
                type={showPassword ? 'text' : 'password'}
                required
                autoComplete="new-password"
                value={password}
                onChange={(e) => {
                  const val = e.target.value;
                  setPassword(val);
                  if (passwordError) {
                    setPasswordError(validatePassword(val));
                  }
                }}
                placeholder="Create a secure password"
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

            {/* Password Criteria Checklist */}
            <ul className="mt-2.5 space-y-1 text-xs">
              <li
                className={`flex items-center gap-1.5 ${
                  hasUppercase
                    ? 'text-emerald-700 dark:text-emerald-400 font-medium'
                    : 'text-zinc-500 dark:text-zinc-400'
                }`}
              >
                <Check className="w-3.5 h-3.5" />
                <span>At least one uppercase letter (A–Z)</span>
              </li>
              <li
                className={`flex items-center gap-1.5 ${
                  hasLowercase
                    ? 'text-emerald-700 dark:text-emerald-400 font-medium'
                    : 'text-zinc-500 dark:text-zinc-400'
                }`}
              >
                <Check className="w-3.5 h-3.5" />
                <span>At least one lowercase letter (a–z)</span>
              </li>
              <li
                className={`flex items-center gap-1.5 ${
                  hasMinLength
                    ? 'text-emerald-700 dark:text-emerald-400 font-medium'
                    : 'text-zinc-500 dark:text-zinc-400'
                }`}
              >
                <Check className="w-3.5 h-3.5" />
                <span>Minimum 6 characters</span>
              </li>
            </ul>

            {passwordError && (
              <p
                role="alert"
                className="mt-2 text-xs font-medium text-rose-600 dark:text-rose-400 flex items-center gap-1.5"
              >
                <AlertCircle className="w-3.5 h-3.5 shrink-0" />
                <span>{passwordError}</span>
              </p>
            )}
          </div>

          {formError && (
            <div
              role="alert"
              className="p-3 rounded-lg bg-rose-50 dark:bg-rose-950/50 border border-rose-200 dark:border-rose-900 text-xs text-rose-700 dark:text-rose-300 flex items-start gap-2"
            >
              <AlertCircle className="w-4 h-4 shrink-0 mt-0.5" />
              <span>{formError}</span>
            </div>
          )}

          <button
            type="submit"
            disabled={submitting || (password.length > 0 && !isPasswordValid)}
            className="w-full h-11 rounded-lg bg-blue-700 hover:bg-blue-800 dark:bg-blue-600 dark:hover:bg-blue-500 text-white text-sm font-semibold transition-colors disabled:opacity-60"
          >
            {submitting ? 'Creating Account...' : 'Register'}
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
          Already have an account?{' '}
          <Link
            to="/login"
            className="font-semibold text-blue-700 dark:text-blue-400 hover:underline"
          >
            Login here
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
