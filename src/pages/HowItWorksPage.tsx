import { Link } from 'react-router-dom';
import { ArrowRight, CalendarCheck, CheckCircle2, FileText, ShieldCheck } from 'lucide-react';

const STEPS = [
  {
    num: '01',
    title: 'Discover & Filter Verified Spaces',
    body: 'Browse architectural daylight lofts, NC-20 cinema stages, podcast rooms, and analog music suites. Every listing includes verified ceiling height, square footage, power access, and included grip equipment.',
  },
  {
    num: '02',
    title: 'Inspect Real-Time Availability',
    body: 'Select your shoot date and inspect confirmed production windows directly inside the booking drawer. Our server-side double-booking engine checks every confirmed overlap before accepting reservations.',
  },
  {
    num: '03',
    title: 'Reserve with Transparent Pricing',
    body: 'See your exact hourly rate, refundable security deposit, and total cost upfront with zero hidden facility surcharges. Track reservation status live from Pending to Confirmed.',
  },
  {
    num: '04',
    title: 'Download Invoice & Roll Camera',
    body: 'Once confirmed, download a formal PDF booking receipt for your production accountant, arrive with load-in instructions, and shoot backed by $2M primary liability coverage.',
  },
];

export function HowItWorksPage() {
  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-14 space-y-16">
      <div className="max-w-3xl space-y-4">
        <p className="text-sm font-medium text-blue-700 dark:text-blue-400">How It Works</p>
        <h1 className="font-display text-4xl sm:text-5xl font-bold tracking-tight text-zinc-950 dark:text-zinc-50 text-balance">
          From location scout to confirmed call sheet in minutes
        </h1>
        <p className="text-lg text-zinc-600 dark:text-zinc-400 leading-relaxed">
          StudioSpace removes opaque day-rate quotes and endless email chains so independent crews
          and studio owners can schedule shoots with confidence.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {STEPS.map((item) => (
          <div
            key={item.num}
            className="p-7 rounded-xl bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 space-y-3"
          >
            <span className="font-mono text-sm font-semibold text-blue-700 dark:text-blue-400 tabular-nums">
              {item.num}.
            </span>
            <h2 className="font-display text-2xl font-semibold text-zinc-950 dark:text-zinc-50">
              {item.title}
            </h2>
            <p className="text-sm sm:text-base text-zinc-600 dark:text-zinc-400 leading-relaxed">
              {item.body}
            </p>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="p-6 rounded-xl bg-zinc-100 dark:bg-zinc-900/70 border border-zinc-200 dark:border-zinc-800 space-y-2.5">
          <CalendarCheck className="w-5 h-5 text-blue-700 dark:text-blue-400" />
          <h3 className="font-display text-lg font-semibold text-zinc-950 dark:text-zinc-50">
            Zero Double-Booking Collisions
          </h3>
          <p className="text-sm text-zinc-600 dark:text-zinc-400 leading-relaxed">
            Every reservation request is validated against confirmed bookings on our backend so two
            crews are never scheduled in the same room at the same hour.
          </p>
        </div>

        <div className="p-6 rounded-xl bg-zinc-100 dark:bg-zinc-900/70 border border-zinc-200 dark:border-zinc-800 space-y-2.5">
          <FileText className="w-5 h-5 text-blue-700 dark:text-blue-400" />
          <h3 className="font-display text-lg font-semibold text-zinc-950 dark:text-zinc-50">
            Instant PDF Production Invoices
          </h3>
          <p className="text-sm text-zinc-600 dark:text-zinc-400 leading-relaxed">
            Download clean itemized PDF receipts for confirmed studio bookings directly from your
            My Bookings dashboard.
          </p>
        </div>

        <div className="p-6 rounded-xl bg-zinc-100 dark:bg-zinc-900/70 border border-zinc-200 dark:border-zinc-800 space-y-2.5">
          <ShieldCheck className="w-5 h-5 text-blue-700 dark:text-blue-400" />
          <h3 className="font-display text-lg font-semibold text-zinc-950 dark:text-zinc-50">
            Host-Controlled Confirmations
          </h3>
          <p className="text-sm text-zinc-600 dark:text-zinc-400 leading-relaxed">
            Hosts review production notes and crew counts before confirming slots, while creators
            can freely cancel any pending request.
          </p>
        </div>
      </div>

      <div className="p-8 sm:p-10 rounded-xl bg-zinc-950 dark:bg-zinc-900 border border-zinc-800 text-white flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div className="space-y-2 max-w-xl">
          <h2 className="font-display text-2xl sm:text-3xl font-bold text-balance">
            Ready to book your next production day?
          </h2>
          <p className="text-sm text-zinc-300">
            Explore curated workspaces across New York, Los Angeles, Chicago, Nashville, and San
            Francisco.
          </p>
        </div>
        <div className="flex flex-wrap gap-3 shrink-0">
          <Link
            to="/studios"
            className="inline-flex items-center gap-2 px-5 py-3 rounded-lg bg-blue-600 hover:bg-blue-500 text-white text-sm font-semibold transition-colors"
          >
            <span>Explore Studios</span>
            <ArrowRight className="w-4 h-4" />
          </Link>
          <Link
            to="/add-studio"
            className="inline-flex items-center gap-2 px-5 py-3 rounded-lg border border-zinc-700 hover:bg-zinc-800 text-white text-sm font-semibold transition-colors"
          >
            <CheckCircle2 className="w-4 h-4" />
            <span>Host Your Space</span>
          </Link>
        </div>
      </div>
    </div>
  );
}
