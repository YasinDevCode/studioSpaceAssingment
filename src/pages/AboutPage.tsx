import { Link } from 'react-router-dom';
import { ArrowRight } from 'lucide-react';
import { StudioImage } from '../components/StudioImage';

const METRICS = [
  { value: '420+', label: 'Vetted production studios across 14 metro hubs' },
  { value: '99.4%', label: 'On-time studio access rate across 2026 bookings' },
  { value: '$2M', label: 'Primary liability protection included per confirmed shoot' },
  { value: '< 45m', label: 'Median host response window on new requests' },
];

export function AboutPage() {
  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-14 space-y-16">
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-stretch">
        <div className="lg:col-span-6 flex flex-col justify-center space-y-5">
          <p className="text-sm font-medium text-blue-700 dark:text-blue-400">About StudioSpace</p>
          <h1 className="font-display text-4xl sm:text-5xl font-bold tracking-tight text-zinc-950 dark:text-zinc-50 text-balance">
            Unlocking dormant creative infrastructure for independent makers
          </h1>
          <p className="text-base text-zinc-600 dark:text-zinc-400 leading-relaxed">
            Across major creative cities, thousands of extraordinary cyclorama studios, acoustic
            stages, and analog recording rooms sit idle between internal commercial shoots.
            Meanwhile, independent directors, photographers, and podcasters struggle to find
            honest, transparent hourly access without agency markups.
          </p>
          <p className="text-base text-zinc-600 dark:text-zinc-400 leading-relaxed">
            StudioSpace was engineered by working gaffers, studio managers, and full-stack
            developers to bridge that divide—delivering accurate technical specifications, secure
            HTTPOnly cookie authentication, automated conflict prevention, and clean production
            invoicing.
          </p>
          <div className="pt-2 flex flex-wrap gap-3">
            <Link
              to="/studios"
              className="inline-flex items-center gap-2 px-5 py-3 rounded-lg bg-blue-700 hover:bg-blue-800 dark:bg-blue-600 dark:hover:bg-blue-500 text-white text-sm font-semibold transition-colors"
            >
              <span>Browse Studios</span>
              <ArrowRight className="w-4 h-4" />
            </Link>
            <Link
              to="/add-studio"
              className="inline-flex items-center gap-2 px-5 py-3 rounded-lg border border-zinc-300 dark:border-zinc-700 text-zinc-900 dark:text-zinc-100 hover:bg-zinc-100 dark:hover:bg-zinc-800 text-sm font-semibold transition-colors"
            >
              <span>Become a Host</span>
            </Link>
          </div>
        </div>

        <div className="lg:col-span-6">
          <div className="w-full h-full min-h-[320px] rounded-xl overflow-hidden border border-zinc-200 dark:border-zinc-800">
            <StudioImage
              src="/src/assets/images/studio_art_workshop_1795070044560.jpg"
              alt="Sunlit StudioSpace creative atelier"
              className="w-full h-full object-cover"
            />
          </div>
        </div>
      </div>

      {/* Quantitative Rigor Strip */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
        {METRICS.map((m) => (
          <div
            key={m.label}
            className="p-6 rounded-xl bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800"
          >
            <p className="font-mono text-3xl font-bold text-zinc-950 dark:text-zinc-50 tabular-nums">
              {m.value}
            </p>
            <p className="mt-2 text-sm text-zinc-600 dark:text-zinc-400 leading-relaxed">
              {m.label}
            </p>
          </div>
        ))}
      </div>
    </div>
  );
}
