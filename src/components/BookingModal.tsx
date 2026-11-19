import React, { useEffect, useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { AlertCircle, Calendar, Clock, ShieldCheck, X } from 'lucide-react';
import { toast } from 'sonner';
import type { Studio } from '../types';
import { formatCurrency, formatHour } from '../types';
import { apiRequest } from '../lib/api';
import { useAuth } from '../context/AuthContext';

interface BookingModalProps {
  studio: Studio;
  open: boolean;
  onClose: () => void;
}

interface ConfirmedSlot {
  id: string;
  startHour: number;
  endHour: number;
  status: string;
}

const HOURS = Array.from({ length: 18 }, (_, i) => i + 6); // 6 AM to 11 PM

function getDefaultDate(): string {
  const d = new Date();
  d.setDate(d.getDate() + 2);
  return d.toISOString().split('T')[0];
}

export function BookingModal({ studio, open, onClose }: BookingModalProps) {
  const { user } = useAuth();
  const navigate = useNavigate();

  const [bookingDate, setBookingDate] = useState(getDefaultDate);
  const [startHour, setStartHour] = useState(10);
  const [endHour, setEndHour] = useState(14);
  const [notes, setNotes] = useState('');
  const [confirmedSlots, setConfirmedSlots] = useState<ConfirmedSlot[]>([]);
  const [loadingSlots, setLoadingSlots] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');

  useEffect(() => {
    if (!open) return;
    setErrorMessage('');
    let active = true;
    setLoadingSlots(true);
    apiRequest<{ confirmedSlots: ConfirmedSlot[] }>(
      `/api/studios/${studio.id}/availability?date=${encodeURIComponent(bookingDate)}`
    )
      .then((res) => {
        if (active) setConfirmedSlots(res.confirmedSlots || []);
      })
      .catch(() => {
        if (active) setConfirmedSlots([]);
      })
      .finally(() => {
        if (active) setLoadingSlots(false);
      });

    return () => {
      active = false;
    };
  }, [open, bookingDate, studio.id]);

  useEffect(() => {
    if (!open) return;
    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && !submitting) onClose();
    };
    window.addEventListener('keydown', onKeyDown);
    return () => window.removeEventListener('keydown', onKeyDown);
  }, [open, submitting, onClose]);

  const duration = Math.max(0, endHour - startHour);
  const studioSubtotal = duration * studio.hourlyRate;
  const totalAmount = studioSubtotal + studio.securityDeposit;

  const clientOverlap = useMemo(() => {
    return confirmedSlots.find((s) => s.startHour < endHour && s.endHour > startHour);
  }, [confirmedSlots, startHour, endHour]);

  if (!open) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage('');

    if (!user) {
      toast.info('Please sign in to reserve this workspace.');
      onClose();
      navigate('/login', { state: { from: { pathname: `/studios/${studio.id}` } } });
      return;
    }

    if (endHour <= startHour) {
      setErrorMessage('Wrap hour must be after the call time (minimum 1 hour).');
      return;
    }

    setSubmitting(true);
    try {
      await apiRequest('/api/bookings', {
        method: 'POST',
        body: JSON.stringify({
          studioId: studio.id,
          bookingDate,
          startHour,
          endHour,
          notes,
        }),
      });
      toast.success(`Reservation request submitted for ${studio.title} (Status: Pending).`);
      onClose();
      navigate('/my-bookings');
    } catch (err) {
      const msg = err instanceof Error ? err.message : 'Unable to submit reservation.';
      setErrorMessage(msg);
      toast.error(msg);
    } finally {
      setSubmitting(false);
    }
  };

  const minDate = new Date().toISOString().split('T')[0];

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-zinc-950/65 backdrop-blur-xs overflow-y-auto"
      role="dialog"
      aria-modal="true"
      aria-labelledby="booking-modal-title"
      onClick={() => !submitting && onClose()}
    >
      <div
        className="w-full max-w-xl bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-xl shadow-2xl overflow-hidden my-auto"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="px-6 py-5 border-b border-zinc-200 dark:border-zinc-800 flex items-start justify-between gap-4">
          <div>
            <p className="text-xs font-medium text-blue-700 dark:text-blue-400">
              {studio.category} · {studio.location}
            </p>
            <h2
              id="booking-modal-title"
              className="mt-0.5 font-display text-xl font-semibold text-zinc-950 dark:text-zinc-50"
            >
              Reserve {studio.title}
            </h2>
          </div>
          <button
            type="button"
            onClick={onClose}
            disabled={submitting}
            aria-label="Close booking dialog"
            className="w-9 h-9 rounded-lg text-zinc-500 hover:bg-zinc-100 dark:hover:bg-zinc-800 flex items-center justify-center"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-5">
          {/* Shoot Date */}
          <div>
            <label
              htmlFor="booking-date"
              className="block text-sm font-medium text-zinc-800 dark:text-zinc-200 mb-1.5"
            >
              Shoot Date
            </label>
            <div className="relative">
              <Calendar className="w-4 h-4 text-zinc-400 absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
              <input
                id="booking-date"
                type="date"
                min={minDate}
                required
                value={bookingDate}
                onChange={(e) => setBookingDate(e.target.value)}
                className="w-full h-11 pl-10 pr-3.5 rounded-lg bg-zinc-50 dark:bg-zinc-950 border border-zinc-300 dark:border-zinc-700 text-sm text-zinc-950 dark:text-zinc-100 font-mono tabular-nums focus:outline-none focus:ring-2 focus:ring-blue-600"
              />
            </div>

            {/* Live Confirmed Availability Strip */}
            <div className="mt-2 text-xs text-zinc-600 dark:text-zinc-400">
              {loadingSlots ? (
                <span>Checking confirmed studio calendar...</span>
              ) : confirmedSlots.length === 0 ? (
                <span>No confirmed bookings yet on {bookingDate}. All hours open.</span>
              ) : (
                <div className="space-y-1">
                  <span className="font-medium text-amber-700 dark:text-amber-400">
                    Confirmed occupied windows on {bookingDate}:
                  </span>
                  <div className="flex flex-wrap gap-x-3 gap-y-1 font-mono tabular-nums text-zinc-800 dark:text-zinc-200">
                    {confirmedSlots.map((slot) => (
                      <span key={slot.id}>
                        {formatHour(slot.startHour)} – {formatHour(slot.endHour)}
                      </span>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Time Window */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label
                htmlFor="start-hour"
                className="block text-sm font-medium text-zinc-800 dark:text-zinc-200 mb-1.5"
              >
                Call Time (Start)
              </label>
              <div className="relative">
                <Clock className="w-4 h-4 text-zinc-400 absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
                <select
                  id="start-hour"
                  value={startHour}
                  onChange={(e) => {
                    const next = Number(e.target.value);
                    setStartHour(next);
                    if (endHour <= next) setEndHour(Math.min(23, next + 2));
                  }}
                  className="w-full h-11 pl-10 pr-3 rounded-lg bg-zinc-50 dark:bg-zinc-950 border border-zinc-300 dark:border-zinc-700 text-sm text-zinc-950 dark:text-zinc-100 font-mono tabular-nums focus:outline-none focus:ring-2 focus:ring-blue-600"
                >
                  {HOURS.slice(0, -1).map((h) => (
                    <option key={h} value={h}>
                      {formatHour(h)}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            <div>
              <label
                htmlFor="end-hour"
                className="block text-sm font-medium text-zinc-800 dark:text-zinc-200 mb-1.5"
              >
                Wrap Time (End)
              </label>
              <div className="relative">
                <Clock className="w-4 h-4 text-zinc-400 absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
                <select
                  id="end-hour"
                  value={endHour}
                  onChange={(e) => setEndHour(Number(e.target.value))}
                  className="w-full h-11 pl-10 pr-3 rounded-lg bg-zinc-50 dark:bg-zinc-950 border border-zinc-300 dark:border-zinc-700 text-sm text-zinc-950 dark:text-zinc-100 font-mono tabular-nums focus:outline-none focus:ring-2 focus:ring-blue-600"
                >
                  {HOURS.filter((h) => h > startHour).map((h) => (
                    <option key={h} value={h}>
                      {formatHour(h)}
                    </option>
                  ))}
                </select>
              </div>
            </div>
          </div>

          {clientOverlap && (
            <div className="p-3.5 rounded-lg bg-amber-50 dark:bg-amber-950/40 border border-amber-200 dark:border-amber-800 text-xs text-amber-900 dark:text-amber-200 flex items-start gap-2.5">
              <AlertCircle className="w-4 h-4 shrink-0 mt-0.5 text-amber-600 dark:text-amber-400" />
              <p>
                Heads up: Your selected window overlaps a Confirmed reservation (
                {formatHour(clientOverlap.startHour)} – {formatHour(clientOverlap.endHour)}). The
                server will reject overlapping bookings to prevent double-booking.
              </p>
            </div>
          )}

          {/* Production Notes */}
          <div>
            <label
              htmlFor="booking-notes"
              className="block text-sm font-medium text-zinc-800 dark:text-zinc-200 mb-1.5"
            >
              Production Notes & Crew Size
            </label>
            <textarea
              id="booking-notes"
              rows={2}
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              placeholder="Share crew count, load-in equipment needs, or freight elevator requests..."
              className="w-full px-3.5 py-2.5 rounded-lg bg-zinc-50 dark:bg-zinc-950 border border-zinc-300 dark:border-zinc-700 text-sm text-zinc-950 dark:text-zinc-100 placeholder:text-zinc-400 focus:outline-none focus:ring-2 focus:ring-blue-600"
            />
          </div>

          {/* Transparent Pricing Summary */}
          <div className="p-4 rounded-lg bg-zinc-50 dark:bg-zinc-950 border border-zinc-200 dark:border-zinc-800 space-y-2 text-sm">
            <div className="flex items-center justify-between text-zinc-600 dark:text-zinc-400">
              <span>
                {formatCurrency(studio.hourlyRate)} × {duration} {duration === 1 ? 'hour' : 'hours'}
              </span>
              <span className="font-mono tabular-nums text-zinc-900 dark:text-zinc-100">
                {formatCurrency(studioSubtotal)}
              </span>
            </div>
            <div className="flex items-center justify-between text-zinc-600 dark:text-zinc-400">
              <span>Refundable security deposit</span>
              <span className="font-mono tabular-nums text-zinc-900 dark:text-zinc-100">
                {formatCurrency(studio.securityDeposit)}
              </span>
            </div>
            <div className="pt-2.5 border-t border-zinc-200 dark:border-zinc-800 flex items-center justify-between font-semibold text-zinc-950 dark:text-zinc-50">
              <span>Estimated Total</span>
              <span className="font-mono tabular-nums text-base">{formatCurrency(totalAmount)}</span>
            </div>
          </div>

          {errorMessage && (
            <div className="p-3.5 rounded-lg bg-rose-50 dark:bg-rose-950/50 border border-rose-200 dark:border-rose-900 text-xs text-rose-700 dark:text-rose-300 flex items-start gap-2.5">
              <AlertCircle className="w-4 h-4 shrink-0 mt-0.5" />
              <p>{errorMessage}</p>
            </div>
          )}

          <div className="flex items-center justify-between gap-4 pt-1">
            <p className="text-xs text-zinc-500 dark:text-zinc-400 flex items-center gap-1.5">
              <ShieldCheck className="w-4 h-4 text-blue-700 dark:text-blue-400 shrink-0" />
              <span>Starts as Pending · Free cancel until confirmed</span>
            </p>
            <div className="flex items-center gap-2.5 shrink-0">
              <button
                type="button"
                onClick={onClose}
                disabled={submitting}
                className="px-4 py-2.5 text-sm font-medium rounded-lg border border-zinc-300 dark:border-zinc-700 text-zinc-700 dark:text-zinc-300 hover:bg-zinc-100 dark:hover:bg-zinc-800 transition-colors"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={submitting || duration <= 0}
                className="px-5 py-2.5 text-sm font-semibold rounded-lg bg-blue-700 hover:bg-blue-800 dark:bg-blue-600 dark:hover:bg-blue-500 text-white transition-colors disabled:opacity-60 whitespace-nowrap"
              >
                {submitting ? 'Submitting...' : 'Confirm Booking Request'}
              </button>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
}
