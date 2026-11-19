import { Link } from 'react-router-dom';
import { ArrowLeft } from 'lucide-react';

export function NotFoundPage() {
  return (
    <div className="min-h-[72vh] flex items-center justify-center px-4 py-16">
      <div className="max-w-lg w-full text-center space-y-6">
        {/* Bespoke Creative Studio Spotlight & Clapperboard Illustration */}
        <div className="mx-auto w-56 h-44 flex items-center justify-center">
          <svg
            viewBox="0 0 240 180"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
            className="w-full h-full"
            aria-hidden="true"
          >
            {/* Studio floor line */}
            <line
              x1="20"
              y1="154"
              x2="220"
              y2="154"
              className="stroke-zinc-300 dark:stroke-zinc-700"
              strokeWidth="2"
              strokeLinecap="round"
            />
            {/* Light beam cone */}
            <polygon
              points="108,58 212,152 132,152"
              className="fill-blue-600/12 dark:fill-blue-400/15"
            />
            {/* Tripod stand */}
            <line
              x1="76"
              y1="74"
              x2="76"
              y2="154"
              className="stroke-zinc-800 dark:stroke-zinc-300"
              strokeWidth="3"
              strokeLinecap="round"
            />
            <line
              x1="76"
              y1="118"
              x2="48"
              y2="154"
              className="stroke-zinc-800 dark:stroke-zinc-300"
              strokeWidth="2.5"
              strokeLinecap="round"
            />
            <line
              x1="76"
              y1="118"
              x2="104"
              y2="154"
              className="stroke-zinc-800 dark:stroke-zinc-300"
              strokeWidth="2.5"
              strokeLinecap="round"
            />
            {/* Studio Fresnel housing */}
            <rect
              x="54"
              y="38"
              width="48"
              height="32"
              rx="6"
              transform="rotate(24 76 54)"
              className="fill-zinc-900 dark:fill-zinc-100"
            />
            {/* Barn doors */}
            <path
              d="M98 46L114 38M92 66L106 78"
              className="stroke-zinc-900 dark:stroke-zinc-200"
              strokeWidth="3"
              strokeLinecap="round"
            />
            {/* Empty camera slate frame */}
            <rect
              x="144"
              y="108"
              width="52"
              height="44"
              rx="5"
              className="fill-white dark:fill-zinc-900 stroke-zinc-400 dark:stroke-zinc-600"
              strokeWidth="2"
            />
            <line
              x1="144"
              y1="120"
              x2="196"
              y2="120"
              className="stroke-zinc-400 dark:stroke-zinc-600"
              strokeWidth="2"
            />
            <text
              x="170"
              y="141"
              textAnchor="middle"
              className="fill-zinc-700 dark:fill-zinc-300 font-mono text-[13px] font-bold"
            >
              404
            </text>
          </svg>
        </div>

        <div className="space-y-2.5">
          <p className="font-mono text-xs font-semibold text-blue-700 dark:text-blue-400">
            Scene Missing · Error 404
          </p>
          <h1 className="font-display text-3xl sm:text-4xl font-bold tracking-tight text-zinc-950 dark:text-zinc-50 text-balance">
            This studio stage is currently dark
          </h1>
          <p className="text-sm sm:text-base text-zinc-600 dark:text-zinc-400 leading-relaxed">
            The page or production space you are looking for does not exist or may have moved to a
            new address.
          </p>
        </div>

        <div className="pt-2 flex flex-wrap items-center justify-center gap-3">
          <Link
            to="/"
            className="inline-flex items-center gap-2 px-5 py-3 rounded-lg bg-blue-700 hover:bg-blue-800 dark:bg-blue-600 dark:hover:bg-blue-500 text-white text-sm font-semibold transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Return to Home</span>
          </Link>
          <Link
            to="/studios"
            className="inline-flex items-center gap-2 px-5 py-3 rounded-lg border border-zinc-300 dark:border-zinc-700 text-zinc-900 dark:text-zinc-100 hover:bg-zinc-100 dark:hover:bg-zinc-800 text-sm font-semibold transition-colors"
          >
            <span>Explore Studios</span>
          </Link>
        </div>
      </div>
    </div>
  );
}
