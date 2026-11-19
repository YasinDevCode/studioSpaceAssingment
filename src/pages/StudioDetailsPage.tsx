import React, { useEffect, useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import {
  ArrowLeft,
  Calendar,
  Check,
  ChevronLeft,
  ChevronRight,
  Heart,
  MapPin,
  Maximize2,
  Ruler,
  ShieldCheck,
  Star,
  Users,
} from 'lucide-react';
import { toast } from 'sonner';
import type { Review, Studio } from '../types';
import { formatCurrency, formatHour } from '../types';
import { apiRequest } from '../lib/api';
import { StudioImage } from '../components/StudioImage';
import { BookingModal } from '../components/BookingModal';
import { BrandedPageLoader } from '../components/Skeletons';
import { useWishlist } from '../context/WishlistContext';
import { useAuth } from '../context/AuthContext';
import { getInitials } from '../utils/format';

interface ConfirmedSlotSummary {
  bookingDate: string;
  startHour: number;
  endHour: number;
}

export function StudioDetailsPage() {
  const { id } = useParams<{ id: string }>();
  const { user } = useAuth();
  const { savedIds, toggleWishlist } = useWishlist();

  const [studio, setStudio] = useState<Studio | null>(null);
  const [reviews, setReviews] = useState<Review[]>([]);
  const [confirmedBookings, setConfirmedBookings] = useState<ConfirmedSlotSummary[]>([]);
  const [loading, setLoading] = useState(true);
  const [notFound, setNotFound] = useState(false);
  const [activeSlide, setActiveSlide] = useState(0);
  const [bookingOpen, setBookingOpen] = useState(false);

  // Review form state
  const [reviewRating, setReviewRating] = useState(5);
  const [reviewComment, setReviewComment] = useState('');
  const [submittingReview, setSubmittingReview] = useState(false);

  useEffect(() => {
    if (!id) return;
    let active = true;
    setLoading(true);
    setNotFound(false);
    setActiveSlide(0);

    apiRequest<{
      studio: Studio;
      reviews: Review[];
      confirmedBookings: ConfirmedSlotSummary[];
    }>(`/api/studios/${id}`)
      .then((res) => {
        if (!active) return;
        setStudio(res.studio);
        setReviews(res.reviews || []);
        setConfirmedBookings(res.confirmedBookings || []);
      })
      .catch(() => {
        if (active) setNotFound(true);
      })
      .finally(() => {
        if (active) setLoading(false);
      });

    return () => {
      active = false;
    };
  }, [id]);

  if (loading) {
    return <BrandedPageLoader label="Loading workspace specifications..." />;
  }

  if (notFound || !studio) {
    return (
      <div className="max-w-3xl mx-auto px-4 py-24 text-center space-y-5">
        <h1 className="font-display text-3xl font-bold text-zinc-950 dark:text-zinc-50">
          Studio workspace not found
        </h1>
        <p className="text-zinc-600 dark:text-zinc-400">
          This listing may have been removed or updated by its host.
        </p>
        <Link
          to="/studios"
          className="inline-flex items-center gap-2 px-5 py-2.5 rounded-lg bg-blue-700 text-white text-sm font-semibold hover:bg-blue-800 transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Back to Explore Studios</span>
        </Link>
      </div>
    );
  }

  const gallery = studio.gallery.length > 0 ? studio.gallery : [studio.imageUrl];
  const isSaved = savedIds.has(studio.id);
  const isOwner = user?.email.toLowerCase() === studio.ownerEmail.toLowerCase();

  const prevSlide = () => setActiveSlide((i) => (i === 0 ? gallery.length - 1 : i - 1));
  const nextSlide = () => setActiveSlide((i) => (i === gallery.length - 1 ? 0 : i + 1));

  const handleSubmitReview = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) {
      toast.info('Please log in to leave a studio review.');
      return;
    }
    if (reviewComment.trim().length < 10) {
      toast.error('Please write at least 10 characters in your review.');
      return;
    }
    setSubmittingReview(true);
    try {
      const res = await apiRequest<{ review: Review; rating: number; reviewCount: number }>(
        `/api/studios/${studio.id}/reviews`,
        {
          method: 'POST',
          body: JSON.stringify({ rating: reviewRating, comment: reviewComment }),
        }
      );
      setReviews((prev) => [res.review, ...prev]);
      setStudio((prev) =>
        prev ? { ...prev, rating: res.rating, reviewCount: res.reviewCount } : prev
      );
      setReviewComment('');
      setReviewRating(5);
      toast.success('Review published. Thank you for sharing your shoot experience.');
    } catch (err) {
      toast.error(err instanceof Error ? err.message : 'Unable to submit review.');
    } finally {
      setSubmittingReview(false);
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
      {/* Breadcrumb Back Navigation */}
      <div className="flex items-center justify-between gap-4 mb-6">
        <Link
          to="/studios"
          className="inline-flex items-center gap-1.5 text-sm font-medium text-zinc-600 dark:text-zinc-400 hover:text-zinc-950 dark:hover:text-white transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>All Studios</span>
        </Link>

        <div className="flex items-center gap-2.5">
          {isOwner && (
            <Link
              to={`/studios/edit/${studio.id}`}
              className="px-3.5 py-2 rounded-lg border border-zinc-300 dark:border-zinc-700 text-xs font-semibold text-zinc-800 dark:text-zinc-200 hover:bg-zinc-100 dark:hover:bg-zinc-800 transition-colors"
            >
              Edit Listing
            </Link>
          )}
          <button
            type="button"
            onClick={() => toggleWishlist(studio.id, studio.title)}
            className={`inline-flex items-center gap-1.5 px-3.5 py-2 rounded-lg border text-xs font-semibold transition-colors ${
              isSaved
                ? 'border-rose-300 dark:border-rose-800 bg-rose-50 dark:bg-rose-950/50 text-rose-700 dark:text-rose-300'
                : 'border-zinc-300 dark:border-zinc-700 text-zinc-800 dark:text-zinc-200 hover:bg-zinc-100 dark:hover:bg-zinc-800'
            }`}
          >
            <Heart className={`w-3.5 h-3.5 ${isSaved ? 'fill-current' : ''}`} />
            <span>{isSaved ? 'Saved' : 'Save Studio'}</span>
          </button>
        </div>
      </div>

      {/* Main Two-Column Contiguous PDP Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-start">
        {/* Left Column: Gallery Carousel + Specs + Overview + Amenities + Reviews */}
        <div className="lg:col-span-8 space-y-10">
          {/* Interactive Gallery Carousel */}
          <div className="space-y-3">
            <div className="relative aspect-[16/10] w-full rounded-xl overflow-hidden bg-zinc-200 dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800">
              <StudioImage
                src={gallery[activeSlide]}
                alt={`${studio.title} view ${activeSlide + 1}`}
                className="w-full h-full object-cover"
              />
              {gallery.length > 1 && (
                <>
                  <button
                    type="button"
                    onClick={prevSlide}
                    aria-label="Previous gallery photo"
                    className="absolute left-3 top-1/2 -translate-y-1/2 w-10 h-10 rounded-lg bg-zinc-950/70 hover:bg-zinc-950 text-white flex items-center justify-center backdrop-blur-xs transition-colors"
                  >
                    <ChevronLeft className="w-5 h-5" />
                  </button>
                  <button
                    type="button"
                    onClick={nextSlide}
                    aria-label="Next gallery photo"
                    className="absolute right-3 top-1/2 -translate-y-1/2 w-10 h-10 rounded-lg bg-zinc-950/70 hover:bg-zinc-950 text-white flex items-center justify-center backdrop-blur-xs transition-colors"
                  >
                    <ChevronRight className="w-5 h-5" />
                  </button>
                  <div className="absolute bottom-3 right-3 px-2.5 py-1 rounded-md bg-zinc-950/75 text-white text-xs font-mono tabular-nums">
                    {activeSlide + 1} / {gallery.length}
                  </div>
                </>
              )}
            </div>

            {gallery.length > 1 && (
              <div className="flex items-center gap-2.5 overflow-x-auto pb-1">
                {gallery.map((img, idx) => (
                  <button
                    key={`${img}-${idx}`}
                    type="button"
                    onClick={() => setActiveSlide(idx)}
                    className={`w-24 aspect-[4/3] rounded-lg overflow-hidden border-2 shrink-0 transition-opacity ${
                      idx === activeSlide
                        ? 'border-blue-600 opacity-100'
                        : 'border-transparent opacity-65 hover:opacity-100'
                    }`}
                  >
                    <StudioImage src={img} alt={`${studio.title} thumbnail ${idx + 1}`} />
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Title & Inline Metadata */}
          <div className="space-y-3 pb-8 border-b border-zinc-200 dark:border-zinc-800">
            <div className="flex flex-wrap items-center gap-2 text-xs text-zinc-500 dark:text-zinc-400">
              <span className="font-semibold text-blue-700 dark:text-blue-400">
                {studio.category}
              </span>
              <span aria-hidden="true">·</span>
              <span className="inline-flex items-center gap-1">
                <MapPin className="w-3.5 h-3.5" />
                {studio.location}
              </span>
              <span aria-hidden="true">·</span>
              <span className="inline-flex items-center gap-1 font-mono tabular-nums text-zinc-900 dark:text-zinc-100 font-medium">
                <Star className="w-3.5 h-3.5 fill-amber-500 text-amber-500" />
                {studio.rating.toFixed(1)} ({studio.reviewCount}{' '}
                {studio.reviewCount === 1 ? 'review' : 'reviews'})
              </span>
            </div>

            <h1 className="font-display text-3xl sm:text-4xl font-bold tracking-tight text-zinc-950 dark:text-zinc-50 text-balance">
              {studio.title}
            </h1>

            {/* Technical Specs Strip */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 pt-4">
              <div className="p-3.5 rounded-lg bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800">
                <span className="text-xs text-zinc-500 dark:text-zinc-400 flex items-center gap-1.5">
                  <Maximize2 className="w-3.5 h-3.5" /> Floor Area
                </span>
                <p className="mt-1 font-mono text-sm font-semibold text-zinc-950 dark:text-zinc-50 tabular-nums">
                  {studio.sqft.toLocaleString()} sq ft
                </p>
              </div>
              <div className="p-3.5 rounded-lg bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800">
                <span className="text-xs text-zinc-500 dark:text-zinc-400 flex items-center gap-1.5">
                  <Ruler className="w-3.5 h-3.5" /> Ceiling Height
                </span>
                <p className="mt-1 font-mono text-sm font-semibold text-zinc-950 dark:text-zinc-50">
                  {studio.ceilingHeight}
                </p>
              </div>
              <div className="p-3.5 rounded-lg bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800">
                <span className="text-xs text-zinc-500 dark:text-zinc-400 flex items-center gap-1.5">
                  <Users className="w-3.5 h-3.5" /> Max Capacity
                </span>
                <p className="mt-1 font-mono text-sm font-semibold text-zinc-950 dark:text-zinc-50 tabular-nums">
                  {studio.maxCapacity} crew
                </p>
              </div>
              <div className="p-3.5 rounded-lg bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800">
                <span className="text-xs text-zinc-500 dark:text-zinc-400 flex items-center gap-1.5">
                  <ShieldCheck className="w-3.5 h-3.5" /> Deposit
                </span>
                <p className="mt-1 font-mono text-sm font-semibold text-zinc-950 dark:text-zinc-50 tabular-nums">
                  {formatCurrency(studio.securityDeposit)}
                </p>
              </div>
            </div>
          </div>

          {/* Detailed Overview */}
          <div className="space-y-3 pb-8 border-b border-zinc-200 dark:border-zinc-800">
            <h2 className="font-display text-xl font-semibold text-zinc-950 dark:text-zinc-50">
              About This Production Space
            </h2>
            <p className="text-base text-zinc-700 dark:text-zinc-300 leading-relaxed whitespace-pre-line">
              {studio.overview}
            </p>
          </div>

          {/* Amenities List */}
          <div className="space-y-4 pb-8 border-b border-zinc-200 dark:border-zinc-800">
            <h2 className="font-display text-xl font-semibold text-zinc-950 dark:text-zinc-50">
              Included Equipment & Amenities
            </h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {studio.amenities.map((amenity) => (
                <div
                  key={amenity}
                  className="flex items-center gap-2.5 text-sm text-zinc-700 dark:text-zinc-300"
                >
                  <Check className="w-4 h-4 text-blue-700 dark:text-blue-400 shrink-0" />
                  <span>{amenity}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Host Details */}
          <div className="pb-8 border-b border-zinc-200 dark:border-zinc-800 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 rounded-xl bg-zinc-950 dark:bg-zinc-100 text-white dark:text-zinc-950 font-display font-bold flex items-center justify-center shrink-0">
                {getInitials(studio.ownerName)}
              </div>
              <div>
                <p className="text-xs text-zinc-500 dark:text-zinc-400">Verified Studio Host</p>
                <h3 className="font-display text-lg font-semibold text-zinc-950 dark:text-zinc-50">
                  {studio.ownerName}
                </h3>
                <p className="text-xs text-zinc-500 dark:text-zinc-400">{studio.ownerEmail}</p>
              </div>
            </div>
            <div className="text-xs text-zinc-600 dark:text-zinc-400 sm:text-right">
              <p className="font-medium text-zinc-900 dark:text-zinc-100">
                Typically responds in under 1 hour
              </p>
              <p>Identity & facility verified by StudioSpace</p>
            </div>
          </div>

          {/* Reviews Section */}
          <div className="space-y-6">
            <div className="flex items-center justify-between">
              <h2 className="font-display text-xl font-semibold text-zinc-950 dark:text-zinc-50">
                Creator Reviews ({reviews.length})
              </h2>
              <span className="inline-flex items-center gap-1.5 text-sm font-mono font-semibold text-zinc-900 dark:text-zinc-100 tabular-nums">
                <Star className="w-4 h-4 fill-amber-500 text-amber-500" />
                {studio.rating.toFixed(1)} average
              </span>
            </div>

            {reviews.length === 0 ? (
              <p className="text-sm text-zinc-500 dark:text-zinc-400">
                No production reviews yet. Be the first creator to review this space after your
                session.
              </p>
            ) : (
              <div className="space-y-4">
                {reviews.map((rev) => (
                  <div
                    key={rev.id}
                    className="p-5 rounded-xl bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 space-y-2.5"
                  >
                    <div className="flex items-center justify-between gap-4">
                      <div>
                        <p className="text-sm font-semibold text-zinc-950 dark:text-zinc-50">
                          {rev.userName}
                        </p>
                        <p className="text-xs text-zinc-500 dark:text-zinc-400">
                          {new Date(rev.createdAt).toLocaleDateString('en-US', {
                            month: 'short',
                            day: 'numeric',
                            year: 'numeric',
                          })}
                        </p>
                      </div>
                      <div className="flex items-center gap-0.5 font-mono text-xs font-semibold text-zinc-900 dark:text-zinc-100">
                        <Star className="w-3.5 h-3.5 fill-amber-500 text-amber-500" />
                        <span>{rev.rating}.0</span>
                      </div>
                    </div>
                    <p className="text-sm text-zinc-700 dark:text-zinc-300 leading-relaxed">
                      {rev.comment}
                    </p>
                  </div>
                ))}
              </div>
            )}

            {/* Add Review Form */}
            {user ? (
              <form
                onSubmit={handleSubmitReview}
                className="p-5 rounded-xl bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 space-y-4"
              >
                <h3 className="font-display text-base font-semibold text-zinc-950 dark:text-zinc-50">
                  Leave a Production Review
                </h3>
                <div className="flex items-center gap-2">
                  <span className="text-xs font-medium text-zinc-600 dark:text-zinc-400">
                    Rating:
                  </span>
                  {[1, 2, 3, 4, 5].map((star) => (
                    <button
                      key={star}
                      type="button"
                      onClick={() => setReviewRating(star)}
                      aria-label={`Rate ${star} stars`}
                      className="p-1"
                    >
                      <Star
                        className={`w-5 h-5 ${
                          star <= reviewRating
                            ? 'fill-amber-500 text-amber-500'
                            : 'text-zinc-300 dark:text-zinc-700'
                        }`}
                      />
                    </button>
                  ))}
                </div>
                <textarea
                  rows={3}
                  required
                  value={reviewComment}
                  onChange={(e) => setReviewComment(e.target.value)}
                  placeholder="Share notes on lighting, acoustics, load-in access, and host responsiveness..."
                  className="w-full px-3.5 py-2.5 rounded-lg bg-zinc-50 dark:bg-zinc-950 border border-zinc-300 dark:border-zinc-700 text-sm text-zinc-950 dark:text-zinc-100 focus:outline-none focus:ring-2 focus:ring-blue-600"
                />
                <button
                  type="submit"
                  disabled={submittingReview}
                  className="px-4 py-2 rounded-lg bg-zinc-950 dark:bg-zinc-100 text-white dark:text-zinc-950 text-xs font-semibold hover:bg-blue-700 dark:hover:bg-blue-500 dark:hover:text-white transition-colors disabled:opacity-60"
                >
                  {submittingReview ? 'Publishing...' : 'Post Review'}
                </button>
              </form>
            ) : (
              <p className="text-xs text-zinc-500 dark:text-zinc-400">
                <Link to="/login" className="text-blue-700 dark:text-blue-400 font-medium underline">
                  Sign in
                </Link>{' '}
                to share a review of this studio workspace.
              </p>
            )}
          </div>
        </div>

        {/* Right Sticky Purchase / Booking Module */}
        <aside className="lg:col-span-4 lg:sticky lg:top-24">
          <div className="bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-xl p-6 space-y-6">
            <div className="flex items-baseline justify-between gap-4 pb-5 border-b border-zinc-200 dark:border-zinc-800">
              <div className="flex items-baseline gap-1 font-mono tabular-nums">
                <span className="text-3xl font-bold text-zinc-950 dark:text-zinc-50">
                  {formatCurrency(studio.hourlyRate)}
                </span>
                <span className="text-sm text-zinc-500 dark:text-zinc-400">/ hour</span>
              </div>
              <span className="text-xs text-zinc-500 dark:text-zinc-400">
                +{formatCurrency(studio.securityDeposit)} refundable deposit
              </span>
            </div>

            <div className="space-y-3 text-sm text-zinc-600 dark:text-zinc-400">
              <div className="flex items-center justify-between">
                <span>Maximum crew capacity</span>
                <span className="font-mono font-medium text-zinc-950 dark:text-zinc-100 tabular-nums">
                  {studio.maxCapacity} people
                </span>
              </div>
              <div className="flex items-center justify-between">
                <span>Liability coverage</span>
                <span className="font-medium text-zinc-950 dark:text-zinc-100">$2M Included</span>
              </div>
              <div className="flex items-center justify-between">
                <span>Double-booking guard</span>
                <span className="font-medium text-zinc-950 dark:text-zinc-100">Active</span>
              </div>
            </div>

            {confirmedBookings.length > 0 && (
              <div className="p-4 rounded-lg bg-zinc-50 dark:bg-zinc-950 border border-zinc-200 dark:border-zinc-800 space-y-2">
                <p className="text-xs font-semibold text-zinc-800 dark:text-zinc-200 flex items-center gap-1.5">
                  <Calendar className="w-3.5 h-3.5 text-blue-700 dark:text-blue-400" />
                  <span>Confirmed Reserved Windows</span>
                </p>
                <ul className="space-y-1 text-xs font-mono tabular-nums text-zinc-600 dark:text-zinc-400">
                  {confirmedBookings.slice(0, 4).map((b, i) => (
                    <li key={`${b.bookingDate}-${b.startHour}-${i}`}>
                      {b.bookingDate} · {formatHour(b.startHour)} – {formatHour(b.endHour)}
                    </li>
                  ))}
                </ul>
              </div>
            )}

            <button
              type="button"
              onClick={() => setBookingOpen(true)}
              className="w-full py-3.5 px-5 rounded-lg bg-blue-700 hover:bg-blue-800 dark:bg-blue-600 dark:hover:bg-blue-500 text-white text-sm font-semibold transition-colors focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-600"
            >
              Book Workspace Now
            </button>

            <p className="text-xs text-center text-zinc-500 dark:text-zinc-400 leading-relaxed">
              Bookings start as Pending. Cancel anytime before host confirmation with zero penalty.
            </p>
          </div>
        </aside>
      </div>

      <BookingModal studio={studio} open={bookingOpen} onClose={() => setBookingOpen(false)} />
    </div>
  );
}
