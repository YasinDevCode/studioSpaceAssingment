import React, { useState } from 'react';
import { X } from 'lucide-react';
import { GoogleIcon } from './icons/BrandIcons';
import { getInitials } from '../utils/format';

interface GoogleAccountOption {
  name: string;
  email: string;
  roleLabel: string;
}

const PRESET_GOOGLE_ACCOUNTS: GoogleAccountOption[] = [
  {
    name: 'Alex Mercer',
    email: 'alex@studiospace.io',
    roleLabel: 'Examiner Creator & Host Account',
  },
  {
    name: 'Devon Brooks',
    email: 'devon@studiospace.io',
    roleLabel: 'Cinematographer Account',
  },
];

interface GoogleAuthModalProps {
  open: boolean;
  busy: boolean;
  onSelect: (account: { name: string; email: string }) => void;
  onClose: () => void;
}

export function GoogleAuthModal({ open, busy, onSelect, onClose }: GoogleAuthModalProps) {
  const [customEmail, setCustomEmail] = useState('');
  const [customName, setCustomName] = useState('');

  if (!open) return null;

  const handleCustomSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!customEmail.trim() || !customName.trim()) return;
    onSelect({ name: customName.trim(), email: customEmail.trim() });
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-zinc-950/60 backdrop-blur-xs"
      role="dialog"
      aria-modal="true"
      aria-labelledby="google-auth-title"
      onClick={() => !busy && onClose()}
    >
      <div
        className="w-full max-w-md bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-xl shadow-2xl overflow-hidden"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="px-6 py-4 border-b border-zinc-200 dark:border-zinc-800 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <GoogleIcon className="w-5 h-5" />
            <h2
              id="google-auth-title"
              className="font-display text-base font-semibold text-zinc-950 dark:text-zinc-50"
            >
              Sign in with Google
            </h2>
          </div>
          <button
            type="button"
            disabled={busy}
            onClick={onClose}
            aria-label="Close Google sign-in modal"
            className="w-8 h-8 rounded-lg text-zinc-500 hover:bg-zinc-100 dark:hover:bg-zinc-800 flex items-center justify-center"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        <div className="p-6 space-y-5">
          <p className="text-sm text-zinc-600 dark:text-zinc-400">
            Choose an account to continue to <span className="font-semibold text-zinc-900 dark:text-zinc-100">StudioSpace</span>:
          </p>

          <div className="space-y-2">
            {PRESET_GOOGLE_ACCOUNTS.map((acc) => (
              <button
                key={acc.email}
                type="button"
                disabled={busy}
                onClick={() => onSelect({ name: acc.name, email: acc.email })}
                className="w-full p-3.5 rounded-lg border border-zinc-200 dark:border-zinc-800 hover:border-blue-600 dark:hover:border-blue-500 bg-zinc-50 dark:bg-zinc-950 flex items-center gap-3 text-left transition-colors disabled:opacity-60"
              >
                <span className="w-9 h-9 rounded-full bg-blue-700 text-white text-xs font-semibold flex items-center justify-center shrink-0">
                  {getInitials(acc.name)}
                </span>
                <div className="min-w-0">
                  <p className="text-sm font-semibold text-zinc-950 dark:text-zinc-50 truncate">
                    {acc.name}
                  </p>
                  <p className="text-xs text-zinc-500 dark:text-zinc-400 truncate">
                    {acc.email} · {acc.roleLabel}
                  </p>
                </div>
              </button>
            ))}
          </div>

          <div className="relative py-1">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-zinc-200 dark:border-zinc-800" />
            </div>
            <div className="relative flex justify-center text-xs">
              <span className="px-2.5 bg-white dark:bg-zinc-900 text-zinc-500">
                Or use another Google email
              </span>
            </div>
          </div>

          <form onSubmit={handleCustomSubmit} className="space-y-3">
            <input
              type="text"
              required
              value={customName}
              onChange={(e) => setCustomName(e.target.value)}
              placeholder="Full Name"
              className="w-full h-10 px-3 rounded-lg bg-zinc-50 dark:bg-zinc-950 border border-zinc-300 dark:border-zinc-700 text-sm text-zinc-950 dark:text-zinc-100 focus:outline-none focus:ring-2 focus:ring-blue-600"
            />
            <input
              type="email"
              required
              value={customEmail}
              onChange={(e) => setCustomEmail(e.target.value)}
              placeholder="name@gmail.com"
              className="w-full h-10 px-3 rounded-lg bg-zinc-50 dark:bg-zinc-950 border border-zinc-300 dark:border-zinc-700 text-sm text-zinc-950 dark:text-zinc-100 focus:outline-none focus:ring-2 focus:ring-blue-600"
            />
            <button
              type="submit"
              disabled={busy}
              className="w-full h-10 rounded-lg bg-zinc-950 dark:bg-zinc-100 text-white dark:text-zinc-950 text-sm font-semibold hover:bg-blue-700 dark:hover:bg-blue-500 dark:hover:text-white transition-colors disabled:opacity-60"
            >
              {busy ? 'Authenticating...' : 'Continue with Google'}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}
