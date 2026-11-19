import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Aperture, ArrowRight, Instagram, Linkedin, Youtube } from 'lucide-react';
import { toast } from 'sonner';
import { CATEGORY_DETAILS, STUDIO_CATEGORIES } from '../types';
import { apiRequest } from '../lib/api';
import { XSocialIcon } from './icons/BrandIcons';

export function Footer() {
  const [email, setEmail] = useState('');
  const [submitting, setSubmitting] = useState(false);

  const handleSubscribe = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email.trim()) {
      toast.error('Please enter your email address.');
      return;
    }
    setSubmitting(true);
    try {
      const res = await apiRequest<{ message: string }>('/api/newsletter', {
        method: 'POST',
        body: JSON.stringify({ email }),
      });
      toast.success(res.message);
      setEmail('');
    } catch (err) {
      toast.error(err instanceof Error ? err.message : 'Unable to subscribe right now.');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <footer className="bg-zinc-100 dark:bg-zinc-900/70 border-t border-zinc-200 dark:border-zinc-800 text-zinc-600 dark:text-zinc-400">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-12 gap-12">
          {/* Brand + Mission */}
          <div className="lg:col-span-4 space-y-5">
            <Link
              to="/"
              className="inline-flex items-center gap-2.5 font-display text-xl font-bold tracking-tight text-zinc-950 dark:text-zinc-50"
            >
              <span className="w-8 h-8 rounded-lg bg-zinc-950 dark:bg-zinc-100 text-white dark:text-zinc-950 flex items-center justify-center">
                <Aperture className="w-4 h-4" strokeWidth={2.2} />
              </span>
              <span>StudioSpace</span>
            </Link>

            <p className="text-sm leading-relaxed max-w-sm">
              Connecting independent directors, photographers, podcasters, and musicians directly with
              architectural production spaces—backed by transparent hourly rates and verified host
              coverage.
            </p>

            <div className="flex items-center gap-2.5 pt-1">
              <a
                href="https://x.com"
                target="_blank"
                rel="noreferrer"
                aria-label="StudioSpace on X"
                className="w-10 h-10 rounded-lg border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 text-zinc-700 dark:text-zinc-300 hover:text-zinc-950 dark:hover:text-white hover:border-zinc-400 dark:hover:border-zinc-600 flex items-center justify-center transition-colors"
              >
                <XSocialIcon className="w-4 h-4" />
              </a>
              <a
                href="https://instagram.com"
                target="_blank"
                rel="noreferrer"
                aria-label="StudioSpace on Instagram"
                className="w-10 h-10 rounded-lg border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 text-zinc-700 dark:text-zinc-300 hover:text-zinc-950 dark:hover:text-white hover:border-zinc-400 dark:hover:border-zinc-600 flex items-center justify-center transition-colors"
              >
                <Instagram className="w-4 h-4" />
              </a>
              <a
                href="https://youtube.com"
                target="_blank"
                rel="noreferrer"
                aria-label="StudioSpace on YouTube"
                className="w-10 h-10 rounded-lg border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 text-zinc-700 dark:text-zinc-300 hover:text-zinc-950 dark:hover:text-white hover:border-zinc-400 dark:hover:border-zinc-600 flex items-center justify-center transition-colors"
              >
                <Youtube className="w-4 h-4" />
              </a>
              <a
                href="https://linkedin.com"
                target="_blank"
                rel="noreferrer"
                aria-label="StudioSpace on LinkedIn"
                className="w-10 h-10 rounded-lg border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 text-zinc-700 dark:text-zinc-300 hover:text-zinc-950 dark:hover:text-white hover:border-zinc-400 dark:hover:border-zinc-600 flex items-center justify-center transition-colors"
              >
                <Linkedin className="w-4 h-4" />
              </a>
            </div>
          </div>

          {/* Quick Navigation */}
          <div className="lg:col-span-2 space-y-4">
            <h3 className="font-display text-sm font-semibold text-zinc-950 dark:text-zinc-50">
              Platform
            </h3>
            <ul className="space-y-2.5 text-sm">
              <li>
                <Link to="/" className="hover:text-zinc-950 dark:hover:text-white transition-colors">
                  Home
                </Link>
              </li>
              <li>
                <Link
                  to="/studios"
                  className="hover:text-zinc-950 dark:hover:text-white transition-colors"
                >
                  Explore Studios
                </Link>
              </li>
              <li>
                <Link
                  to="/how-it-works"
                  className="hover:text-zinc-950 dark:hover:text-white transition-colors"
                >
                  How It Works
                </Link>
              </li>
              <li>
                <Link
                  to="/about"
                  className="hover:text-zinc-950 dark:hover:text-white transition-colors"
                >
                  About Us
                </Link>
              </li>
              <li>
                <Link
                  to="/add-studio"
                  className="hover:text-zinc-950 dark:hover:text-white transition-colors"
                >
                  Host Your Space
                </Link>
              </li>
            </ul>
          </div>

          {/* Popular Categories */}
          <div className="lg:col-span-2 space-y-4">
            <h3 className="font-display text-sm font-semibold text-zinc-950 dark:text-zinc-50">
              Studio Categories
            </h3>
            <ul className="space-y-2.5 text-sm">
              {STUDIO_CATEGORIES.map((category) => (
                <li key={category}>
                  <Link
                    to={`/studios?category=${encodeURIComponent(category)}`}
                    className="hover:text-zinc-950 dark:hover:text-white transition-colors"
                  >
                    {CATEGORY_DETAILS[category].pluralLabel}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Newsletter */}
          <div className="lg:col-span-4 space-y-4">
            <h3 className="font-display text-sm font-semibold text-zinc-950 dark:text-zinc-50">
              Production Dispatch
            </h3>
            <p className="text-sm leading-relaxed">
              Receive weekly openings for newly vetted sound stages, daylight lofts, and seasonal
              host availability.
            </p>
            <form onSubmit={handleSubscribe} className="flex gap-2">
              <label htmlFor="footer-newsletter" className="sr-only">
                Email address
              </label>
              <input
                id="footer-newsletter"
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="producer@company.com"
                className="flex-1 min-w-0 h-11 px-3.5 rounded-lg bg-white dark:bg-zinc-950 border border-zinc-300 dark:border-zinc-700 text-sm text-zinc-950 dark:text-zinc-100 placeholder:text-zinc-400 focus:outline-none focus:ring-2 focus:ring-blue-600"
              />
              <button
                type="submit"
                disabled={submitting}
                className="h-11 px-4 rounded-lg bg-zinc-950 dark:bg-zinc-100 text-white dark:text-zinc-950 hover:bg-blue-700 dark:hover:bg-blue-500 dark:hover:text-white text-sm font-semibold inline-flex items-center gap-1.5 transition-colors disabled:opacity-60 whitespace-nowrap shrink-0"
              >
                <span>{submitting ? 'Joining' : 'Subscribe'}</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </form>
          </div>
        </div>

        <div className="mt-14 pt-6 border-t border-zinc-200 dark:border-zinc-800 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-zinc-500 dark:text-zinc-400">
          <p>© {new Date().getFullYear()} StudioSpace Inc. All rights reserved.</p>
          <div className="flex items-center gap-6">
            <Link to="/about" className="hover:text-zinc-950 dark:hover:text-zinc-200 transition-colors">
              Terms of Booking
            </Link>
            <Link to="/about" className="hover:text-zinc-950 dark:hover:text-zinc-200 transition-colors">
              Host Liability Policy
            </Link>
            <Link to="/about" className="hover:text-zinc-950 dark:hover:text-zinc-200 transition-colors">
              Privacy Notice
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
