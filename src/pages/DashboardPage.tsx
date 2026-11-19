import { useEffect, useState } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import {
  ArrowRight,
  Building2,
  CalendarCheck,
  Heart,
  PlusSquare,
  ListChecks,
} from 'lucide-react';
import type { Booking, Studio } from '../types';
import { useAuth } from '../context/AuthContext';
import { useWishlist } from '../context/WishlistContext';
import { apiRequest } from '../lib/api';
import { StudioCard } from '../components/StudioCard';
import { BrandedPageLoader } from '../components/Skeletons';

export function DashboardPage() {
  const { user } = useAuth();
  const { savedStudios } = useWishlist();
  const [searchParams, setSearchParams] = useSearchParams();
  const activeTab = searchParams.get('tab') === 'wishlist' ? 'wishlist' : 'overview';

  const [ownedStudios, setOwnedStudios] = useState<Studio[]>([]);
  const [myBookings, setMyBookings] = useState<Booking[]>([]);
  const [hostBookings, setHostBookings] = useState<Booking[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!user?.email) return;
    let active = true;
    setLoading(true);
    Promise.all([
      apiRequest<{ studios: Studio[] }>(
        `/api/studios?ownerEmail=${encodeURIComponent(user.email)}`
      ),
      apiRequest<{ myBookings: Booking[]; hostBookings: Booking[] }>('/api/bookings'),
    ])
      .then(([studioRes, bookingRes]) => {
        if (!active) return;
        setOwnedStudios(studioRes.studios || []);
        setMyBookings(bookingRes.myBookings || []);
        setHostBookings(bookingRes.hostBookings || []);
      })
      .catch(() => {})
      .finally(() => {
        if (active) setLoading(false);
      });
    return () => {
      active = false;
    };
  }, [user?.email]);

  if (loading) {
    return <BrandedPageLoader label="Loading your StudioSpace dashboard..." />;
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 space-y-10">
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
        <div>
          <p className="text-sm font-medium text-blue-700 dark:text-blue-400">Creator & Host Hub</p>
          <h1 className="mt-1 font-display text-3xl sm:text-4xl font-bold tracking-tight text-zinc-950 dark:text-zinc-50">
            Welcome, {user?.name}
          </h1>
          <p className="mt-2 text-sm sm:text-base text-zinc-600 dark:text-zinc-400">
            {user?.email} · Manage your studios, upcoming shoot bookings, and saved spaces.
          </p>
        </div>

        <div className="inline-flex items-center p-1 rounded-lg bg-zinc-200/70 dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 self-start">
          <button
            type="button"
            onClick={() => setSearchParams({}, { replace: true })}
            className={`px-4 py-2 rounded-md text-xs font-semibold transition-colors whitespace-nowrap ${
              activeTab === 'overview'
                ? 'bg-white dark:bg-zinc-800 text-zinc-950 dark:text-white shadow-xs'
                : 'text-zinc-600 dark:text-zinc-400'
            }`}
          >
            Overview
          </button>
          <button
            type="button"
            onClick={() => setSearchParams({ tab: 'wishlist' }, { replace: true })}
            className={`px-4 py-2 rounded-md text-xs font-semibold transition-colors whitespace-nowrap ${
              activeTab === 'wishlist'
                ? 'bg-white dark:bg-zinc-800 text-zinc-950 dark:text-white shadow-xs'
                : 'text-zinc-600 dark:text-zinc-400'
            }`}
          >
            Saved Studios ({savedStudios.length})
          </button>
        </div>
      </div>

      {/* KPI Summary Row */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
        <div className="p-6 rounded-xl bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800">
          <span className="text-xs font-medium text-zinc-500 dark:text-zinc-400 flex items-center gap-1.5">
            <Building2 className="w-4 h-4 text-blue-700 dark:text-blue-400" />
            My Studio Listings
          </span>
          <p className="mt-3 font-mono text-3xl font-bold text-zinc-950 dark:text-zinc-50 tabular-nums">
            {ownedStudios.length}
          </p>
        </div>

        <div className="p-6 rounded-xl bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800">
          <span className="text-xs font-medium text-zinc-500 dark:text-zinc-400 flex items-center gap-1.5">
            <CalendarCheck className="w-4 h-4 text-blue-700 dark:text-blue-400" />
            My Reservations
          </span>
          <p className="mt-3 font-mono text-3xl font-bold text-zinc-950 dark:text-zinc-50 tabular-nums">
            {myBookings.length}
          </p>
        </div>

        <div className="p-6 rounded-xl bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800">
          <span className="text-xs font-medium text-zinc-500 dark:text-zinc-400 flex items-center gap-1.5">
            <ListChecks className="w-4 h-4 text-blue-700 dark:text-blue-400" />
            Incoming Host Bookings
          </span>
          <p className="mt-3 font-mono text-3xl font-bold text-zinc-950 dark:text-zinc-50 tabular-nums">
            {hostBookings.length}
          </p>
        </div>

        <div className="p-6 rounded-xl bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800">
          <span className="text-xs font-medium text-zinc-500 dark:text-zinc-400 flex items-center gap-1.5">
            <Heart className="w-4 h-4 text-rose-500" />
            Saved Wishlist
          </span>
          <p className="mt-3 font-mono text-3xl font-bold text-zinc-950 dark:text-zinc-50 tabular-nums">
            {savedStudios.length}
          </p>
        </div>
      </div>

      {activeTab === 'overview' ? (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <Link
            to="/add-studio"
            className="group p-6 rounded-xl bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 hover:border-blue-600 dark:hover:border-blue-500 transition-colors flex flex-col justify-between gap-4"
          >
            <div className="space-y-2">
              <PlusSquare className="w-5 h-5 text-blue-700 dark:text-blue-400" />
              <h2 className="font-display text-lg font-semibold text-zinc-950 dark:text-zinc-50">
                Add New Studio
              </h2>
              <p className="text-sm text-zinc-600 dark:text-zinc-400">
                List a photography loft, cinema sound stage, or recording suite with hourly pricing.
              </p>
            </div>
            <span className="inline-flex items-center gap-1.5 text-xs font-semibold text-blue-700 dark:text-blue-400">
              <span>Publish Listing</span>
              <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-0.5 transition-transform" />
            </span>
          </Link>

          <Link
            to="/my-listings"
            className="group p-6 rounded-xl bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 hover:border-blue-600 dark:hover:border-blue-500 transition-colors flex flex-col justify-between gap-4"
          >
            <div className="space-y-2">
              <ListChecks className="w-5 h-5 text-blue-700 dark:text-blue-400" />
              <h2 className="font-display text-lg font-semibold text-zinc-950 dark:text-zinc-50">
                My Studio Listings
              </h2>
              <p className="text-sm text-zinc-600 dark:text-zinc-400">
                Edit workspace descriptions, update hourly rates, or retire spaces you host.
              </p>
            </div>
            <span className="inline-flex items-center gap-1.5 text-xs font-semibold text-blue-700 dark:text-blue-400">
              <span>Manage Inventory</span>
              <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-0.5 transition-transform" />
            </span>
          </Link>

          <Link
            to="/my-bookings"
            className="group p-6 rounded-xl bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 hover:border-blue-600 dark:hover:border-blue-500 transition-colors flex flex-col justify-between gap-4"
          >
            <div className="space-y-2">
              <CalendarCheck className="w-5 h-5 text-blue-700 dark:text-blue-400" />
              <h2 className="font-display text-lg font-semibold text-zinc-950 dark:text-zinc-50">
                My Bookings & Invoices
              </h2>
              <p className="text-sm text-zinc-600 dark:text-zinc-400">
                Review shoot reservations, confirm incoming host requests, and export PDF receipts.
              </p>
            </div>
            <span className="inline-flex items-center gap-1.5 text-xs font-semibold text-blue-700 dark:text-blue-400">
              <span>Open Schedule</span>
              <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-0.5 transition-transform" />
            </span>
          </Link>
        </div>
      ) : savedStudios.length === 0 ? (
        <div className="py-16 px-6 text-center rounded-xl bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800">
          <Heart className="w-8 h-8 text-zinc-400 mx-auto" />
          <h2 className="mt-4 font-display text-xl font-semibold text-zinc-950 dark:text-zinc-50">
            No saved studios yet
          </h2>
          <p className="mt-2 text-sm text-zinc-600 dark:text-zinc-400 max-w-md mx-auto">
            Click the heart icon on any studio card to bookmark spaces for your upcoming production
            treatments.
          </p>
          <Link
            to="/studios"
            className="mt-6 inline-flex items-center gap-2 px-5 py-2.5 rounded-lg bg-blue-700 hover:bg-blue-800 text-white text-sm font-semibold transition-colors"
          >
            <span>Explore Studios</span>
            <ArrowRight className="w-4 h-4" />
          </Link>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {savedStudios.map((studio) => (
            <StudioCard key={studio.id} studio={studio} />
          ))}
        </div>
      )}
    </div>
  );
}
