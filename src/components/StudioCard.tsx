import { Link } from 'react-router-dom';
import { Heart, MapPin, Star, ArrowUpRight } from 'lucide-react';
import type { Studio } from '../types';
import { formatCurrency } from '../types';
import { StudioImage } from './StudioImage';
import { useWishlist } from '../context/WishlistContext';

interface StudioCardProps {
  studio: Studio;
}

export function StudioCard({ studio }: StudioCardProps) {
  const { savedIds, toggleWishlist } = useWishlist();
  const isSaved = savedIds.has(studio.id);

  return (
    <article className="group h-full flex flex-col bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-xl overflow-hidden transition-transform duration-200 ease-out hover:-translate-y-0.5 hover:border-zinc-300 dark:hover:border-zinc-700">
      <div className="relative aspect-[4/3] w-full overflow-hidden bg-zinc-100 dark:bg-zinc-800 shrink-0">
        <Link to={`/studios/${studio.id}`} className="block w-full h-full">
          <StudioImage
            src={studio.imageUrl}
            alt={studio.title}
            fallbackLabel={studio.title}
            className="w-full h-full object-cover transition-transform duration-300 ease-out group-hover:scale-[1.03]"
          />
        </Link>

        <button
          type="button"
          onClick={() => toggleWishlist(studio.id, studio.title)}
          aria-label={isSaved ? `Remove ${studio.title} from wishlist` : `Save ${studio.title} to wishlist`}
          className={`absolute top-3 right-3 w-10 h-10 rounded-lg flex items-center justify-center backdrop-blur-md transition-colors focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-600 ${
            isSaved
              ? 'bg-zinc-950/85 text-rose-400'
              : 'bg-zinc-950/60 text-white hover:bg-zinc-950/85'
          }`}
        >
          <Heart className={`w-4 h-4 ${isSaved ? 'fill-current' : ''}`} />
        </button>
      </div>

      <div className="p-5 flex-1 flex flex-col">
        {/* Clean unboxed metadata row */}
        <div className="flex items-center justify-between gap-2 text-xs text-zinc-500 dark:text-zinc-400 mb-2">
          <div className="flex items-center gap-1.5 min-w-0">
            <span className="font-medium text-blue-700 dark:text-blue-400 truncate">
              {studio.category}
            </span>
            <span aria-hidden="true">·</span>
            <span className="truncate">{studio.sqft.toLocaleString()} sq ft</span>
          </div>
          <div className="flex items-center gap-1 shrink-0 font-mono tabular-nums text-zinc-800 dark:text-zinc-200 font-medium">
            <Star className="w-3.5 h-3.5 fill-amber-500 text-amber-500" />
            <span>{studio.rating.toFixed(1)}</span>
          </div>
        </div>

        <Link to={`/studios/${studio.id}`} className="block">
          <h3 className="font-display text-lg font-semibold tracking-tight text-zinc-950 dark:text-zinc-50 line-clamp-1 group-hover:text-blue-700 dark:group-hover:text-blue-400 transition-colors">
            {studio.title}
          </h3>
        </Link>

        <p className="mt-1.5 flex items-center gap-1.5 text-sm text-zinc-600 dark:text-zinc-400 line-clamp-1">
          <MapPin className="w-3.5 h-3.5 shrink-0 text-zinc-400 dark:text-zinc-500" />
          <span className="truncate">{studio.location}</span>
        </p>

        <div className="mt-auto pt-4 border-t border-zinc-100 dark:border-zinc-800/90 flex items-center justify-between gap-3">
          <div className="flex items-baseline gap-1 font-mono tabular-nums">
            <span className="text-lg font-semibold text-zinc-950 dark:text-zinc-50">
              {formatCurrency(studio.hourlyRate)}
            </span>
            <span className="text-xs text-zinc-500 dark:text-zinc-400">/ hr</span>
          </div>

          <Link
            to={`/studios/${studio.id}`}
            className="inline-flex items-center justify-center gap-1.5 px-4 py-2 text-xs font-semibold rounded-lg bg-zinc-950 text-white dark:bg-zinc-100 dark:text-zinc-950 hover:bg-blue-700 dark:hover:bg-blue-500 dark:hover:text-white transition-colors whitespace-nowrap shrink-0 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-600"
          >
            <span>View Details</span>
            <ArrowUpRight className="w-3.5 h-3.5" />
          </Link>
        </div>
      </div>
    </article>
  );
}
