import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import {
  Calendar,
  CheckCircle2,
  Clock,
  Download,
  MapPin,
  XCircle,
  Ban,
  ArrowRight,
} from 'lucide-react';
import { toast } from 'sonner';
import type { Booking, BookingStatus } from '../types';
import { formatCurrency, formatHour } from '../types';
import { apiRequest } from '../lib/api';
import { StudioImage } from '../components/StudioImage';
import { ConfirmModal } from '../components/ConfirmModal';
import { BrandedPageLoader } from '../components/Skeletons';
import { downloadBookingInvoicePdf } from '../utils/invoicePdf';

const STATUS_STYLES: Record<BookingStatus, { icon: typeof Clock; className: string }> = {
  Confirmed: { icon: CheckCircle2, className: 'text-emerald-700 dark:text-emerald-400' },
  Completed: { icon: CheckCircle2, className: 'text-blue-700 dark:text-blue-400' },
  Cancelled: { icon: XCircle, className: 'text-zinc-500 dark:text-zinc-400' },
  Pending: { icon: Clock, className: 'text-amber-700 dark:text-amber-400' },
};

function StatusIndicator({ status }: { status: BookingStatus }) {
  const { icon: Icon, className } = STATUS_STYLES[status] ?? STATUS_STYLES.Pending;
  return (
    <span className={`inline-flex items-center gap-1.5 text-xs font-semibold ${className}`}>
      <Icon className="w-3.5 h-3.5" />
      <span>{status}</span>
    </span>
  );
}

export function MyBookingsPage() {
  const [myBookings, setMyBookings] = useState<Booking[]>([]);
  const [hostBookings, setHostBookings] = useState<Booking[]>([]);
  const [activeTab, setActiveTab] = useState<'creator' | 'host'>('creator');
  const [loading, setLoading] = useState(true);
  const [cancelTarget, setCancelTarget] = useState<Booking | null>(null);
  const [updatingId, setUpdatingId] = useState<string | null>(null);

  const loadBookings = async () => {
    setLoading(true);
    try {
      const data = await apiRequest<{ myBookings: Booking[]; hostBookings: Booking[] }>(
        '/api/bookings'
      );
      setMyBookings(data.myBookings || []);
      setHostBookings(data.hostBookings || []);
    } catch (err) {
      toast.error(err instanceof Error ? err.message : 'Unable to load bookings.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadBookings();
  }, []);

  const updateStatus = async (booking: Booking, nextStatus: BookingStatus) => {
    setUpdatingId(booking.id);
    try {
      const res = await apiRequest<{ booking: Booking }>(`/api/bookings/${booking.id}/status`, {
        method: 'PATCH',
        body: JSON.stringify({ status: nextStatus }),
      });
      setMyBookings((prev) => prev.map((b) => (b.id === booking.id ? res.booking : b)));
      setHostBookings((prev) => prev.map((b) => (b.id === booking.id ? res.booking : b)));
      toast.success(`Reservation updated to ${nextStatus}.`);
      setCancelTarget(null);
    } catch (err) {
      toast.error(err instanceof Error ? err.message : 'Unable to update booking status.');
    } finally {
      setUpdatingId(null);
    }
  };

  const handleDownloadInvoice = (booking: Booking) => {
    try {
      downloadBookingInvoicePdf(booking);
      toast.success(`Downloaded PDF receipt ${booking.invoiceNumber}.pdf`);
    } catch {
      toast.error('Unable to generate PDF invoice.');
    }
  };

  if (loading) {
    return <BrandedPageLoader label="Loading your studio reservations..." />;
  }

  const displayedList = activeTab === 'creator' ? myBookings : hostBookings;

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 space-y-8">
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
        <div>
          <p className="text-sm font-medium text-blue-700 dark:text-blue-400">
            Schedule & Invoices
          </p>
          <h1 className="mt-1 font-display text-3xl sm:text-4xl font-bold tracking-tight text-zinc-950 dark:text-zinc-50">
            My Bookings
          </h1>
          <p className="mt-2 text-sm sm:text-base text-zinc-600 dark:text-zinc-400">
            Track pending studio slots, download PDF receipts for confirmed bookings, or manage
            incoming host requests.
          </p>
        </div>

        {/* Interactive Tab Switcher */}
        <div
          className="inline-flex items-center p-1 rounded-lg bg-zinc-200/70 dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 self-start"
          role="tablist"
        >
          <button
            type="button"
            role="tab"
            aria-selected={activeTab === 'creator'}
            onClick={() => setActiveTab('creator')}
            className={`px-4 py-2 rounded-md text-xs font-semibold transition-colors whitespace-nowrap ${
              activeTab === 'creator'
                ? 'bg-white dark:bg-zinc-800 text-zinc-950 dark:text-white shadow-xs'
                : 'text-zinc-600 dark:text-zinc-400 hover:text-zinc-950 dark:hover:text-zinc-200'
            }`}
          >
            My Reservations ({myBookings.length})
          </button>
          <button
            type="button"
            role="tab"
            aria-selected={activeTab === 'host'}
            onClick={() => setActiveTab('host')}
            className={`px-4 py-2 rounded-md text-xs font-semibold transition-colors whitespace-nowrap ${
              activeTab === 'host'
                ? 'bg-white dark:bg-zinc-800 text-zinc-950 dark:text-white shadow-xs'
                : 'text-zinc-600 dark:text-zinc-400 hover:text-zinc-950 dark:hover:text-zinc-200'
            }`}
          >
            Incoming Host Requests ({hostBookings.length})
          </button>
        </div>
      </div>

      {displayedList.length === 0 ? (
        <div className="py-20 px-6 text-center rounded-xl bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800">
          <div className="w-12 h-12 rounded-xl bg-zinc-100 dark:bg-zinc-800 text-zinc-500 dark:text-zinc-400 flex items-center justify-center mx-auto">
            <Calendar className="w-5 h-5" />
          </div>
          <h2 className="mt-4 font-display text-xl font-semibold text-zinc-950 dark:text-zinc-50">
            {activeTab === 'creator'
              ? 'No studio reservations yet'
              : 'No incoming host booking requests yet'}
          </h2>
          <p className="mt-2 text-sm text-zinc-600 dark:text-zinc-400 max-w-md mx-auto">
            {activeTab === 'creator'
              ? 'Browse daylight photo lofts, sound stages, podcast lounges, and recording rooms to schedule your next shoot.'
              : 'When creators request shoot hours in your listed studios, you can approve or manage them right here.'}
          </p>
          <Link
            to={activeTab === 'creator' ? '/studios' : '/add-studio'}
            className="mt-6 inline-flex items-center gap-2 px-5 py-2.5 rounded-lg bg-blue-700 hover:bg-blue-800 text-white text-sm font-semibold transition-colors"
          >
            <span>{activeTab === 'creator' ? 'Explore Studios' : 'Add a Studio Listing'}</span>
            <ArrowRight className="w-4 h-4" />
          </Link>
        </div>
      ) : (
        <div className="space-y-4">
          {displayedList.map((booking) => (
            <article
              key={booking.id}
              className="bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-xl p-5 flex flex-col lg:flex-row lg:items-center justify-between gap-6"
            >
              <div className="flex flex-col sm:flex-row gap-5 min-w-0">
                <Link
                  to={`/studios/${booking.studioId}`}
                  className="w-full sm:w-44 aspect-[4/3] rounded-lg overflow-hidden bg-zinc-200 dark:bg-zinc-800 shrink-0 block"
                >
                  <StudioImage src={booking.studioImage} alt={booking.studioTitle} />
                </Link>

                <div className="space-y-2 min-w-0">
                  <div className="flex flex-wrap items-center gap-2 text-xs text-zinc-500 dark:text-zinc-400">
                    <StatusIndicator status={booking.status} />
                    <span aria-hidden="true">·</span>
                    <span className="font-mono tabular-nums">{booking.invoiceNumber}</span>
                    <span aria-hidden="true">·</span>
                    <span>{booking.studioCategory}</span>
                  </div>

                  <Link
                    to={`/studios/${booking.studioId}`}
                    className="block font-display text-xl font-semibold text-zinc-950 dark:text-zinc-50 hover:text-blue-700 dark:hover:text-blue-400 transition-colors"
                  >
                    {booking.studioTitle}
                  </Link>

                  <div className="flex flex-wrap items-center gap-x-4 gap-y-1 text-xs sm:text-sm text-zinc-600 dark:text-zinc-400">
                    <span className="inline-flex items-center gap-1">
                      <MapPin className="w-3.5 h-3.5" />
                      {booking.studioLocation}
                    </span>
                    <span className="inline-flex items-center gap-1 font-mono tabular-nums text-zinc-900 dark:text-zinc-200 font-medium">
                      <Calendar className="w-3.5 h-3.5 text-zinc-400" />
                      {booking.bookingDate} · {formatHour(booking.startHour)} –{' '}
                      {formatHour(booking.endHour)} ({booking.durationHours}h)
                    </span>
                  </div>

                  <p className="text-xs text-zinc-500 dark:text-zinc-400">
                    {activeTab === 'creator'
                      ? `Host: ${booking.hostName} (${booking.hostEmail})`
                      : `Booked by: ${booking.userName} (${booking.userEmail})`}
                  </p>

                  {booking.notes && (
                    <p className="text-xs text-zinc-600 dark:text-zinc-400 line-clamp-2 max-w-xl pt-0.5">
                      Notes: {booking.notes}
                    </p>
                  )}
                </div>
              </div>

              {/* Right Cost & Action Controls */}
              <div className="flex flex-col sm:flex-row lg:flex-col items-start sm:items-center lg:items-end justify-between gap-4 pt-4 lg:pt-0 border-t lg:border-t-0 border-zinc-100 dark:border-zinc-800 shrink-0">
                <div className="lg:text-right">
                  <p className="font-mono text-xl font-bold text-zinc-950 dark:text-zinc-50 tabular-nums">
                    {formatCurrency(booking.totalAmount)}
                  </p>
                  <p className="text-xs text-zinc-500 dark:text-zinc-400 font-mono tabular-nums">
                    {formatCurrency(booking.hourlyRate)}/hr + {formatCurrency(booking.securityDeposit)}{' '}
                    deposit
                  </p>
                </div>

                <div className="flex flex-wrap items-center gap-2">
                  {(booking.status === 'Confirmed' || booking.status === 'Completed') && (
                    <button
                      type="button"
                      onClick={() => handleDownloadInvoice(booking)}
                      className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-lg bg-zinc-950 dark:bg-zinc-100 text-white dark:text-zinc-950 hover:bg-blue-700 dark:hover:bg-blue-500 dark:hover:text-white text-xs font-semibold transition-colors whitespace-nowrap"
                    >
                      <Download className="w-3.5 h-3.5" />
                      <span>PDF Invoice</span>
                    </button>
                  )}

                  {/* Creator Cancel Action for Pending slots */}
                  {activeTab === 'creator' && booking.status === 'Pending' && (
                    <button
                      type="button"
                      disabled={updatingId === booking.id}
                      onClick={() => setCancelTarget(booking)}
                      className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-lg border border-rose-200 dark:border-rose-900/80 text-xs font-semibold text-rose-600 dark:text-rose-400 hover:bg-rose-50 dark:hover:bg-rose-950/40 transition-colors whitespace-nowrap disabled:opacity-60"
                    >
                      <Ban className="w-3.5 h-3.5" />
                      <span>Cancel Booking</span>
                    </button>
                  )}

                  {/* Host Approval Controls */}
                  {activeTab === 'host' && booking.status === 'Pending' && (
                    <>
                      <button
                        type="button"
                        disabled={updatingId === booking.id}
                        onClick={() => updateStatus(booking, 'Confirmed')}
                        className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-lg bg-blue-700 hover:bg-blue-800 dark:bg-blue-600 dark:hover:bg-blue-500 text-white text-xs font-semibold transition-colors whitespace-nowrap disabled:opacity-60"
                      >
                        <CheckCircle2 className="w-3.5 h-3.5" />
                        <span>Confirm Slot</span>
                      </button>
                      <button
                        type="button"
                        disabled={updatingId === booking.id}
                        onClick={() => setCancelTarget(booking)}
                        className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-lg border border-rose-200 dark:border-rose-900/80 text-xs font-semibold text-rose-600 dark:text-rose-400 hover:bg-rose-50 dark:hover:bg-rose-950/40 transition-colors whitespace-nowrap disabled:opacity-60"
                      >
                        <span>Decline</span>
                      </button>
                    </>
                  )}

                  {activeTab === 'host' && booking.status === 'Confirmed' && (
                    <button
                      type="button"
                      disabled={updatingId === booking.id}
                      onClick={() => updateStatus(booking, 'Completed')}
                      className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-lg border border-zinc-300 dark:border-zinc-700 text-xs font-semibold text-zinc-800 dark:text-zinc-200 hover:bg-zinc-100 dark:hover:bg-zinc-800 transition-colors whitespace-nowrap disabled:opacity-60"
                    >
                      <span>Mark Completed</span>
                    </button>
                  )}
                </div>
              </div>
            </article>
          ))}
        </div>
      )}

      <ConfirmModal
        open={Boolean(cancelTarget)}
        title="Cancel this reservation?"
        description={
          cancelTarget
            ? `Are you sure you want to cancel the ${cancelTarget.bookingDate} reservation (${formatHour(cancelTarget.startHour)} – ${formatHour(cancelTarget.endHour)}) at "${cancelTarget.studioTitle}"?`
            : ''
        }
        confirmLabel="Cancel Booking"
        destructive
        busy={Boolean(updatingId)}
        onConfirm={() => cancelTarget && updateStatus(cancelTarget, 'Cancelled')}
        onClose={() => setCancelTarget(null)}
      />
    </div>
  );
}
