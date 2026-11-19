import { Aperture } from 'lucide-react';

export function StudioCardSkeleton() {
  return (
    <div className="bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-xl overflow-hidden animate-pulse">
      <div className="aspect-[4/3] bg-zinc-200 dark:bg-zinc-800" />
      <div className="p-5 space-y-3">
        <div className="flex items-center justify-between">
          <div className="h-3 w-28 bg-zinc-200 dark:bg-zinc-800 rounded" />
          <div className="h-3 w-10 bg-zinc-200 dark:bg-zinc-800 rounded" />
        </div>
        <div className="h-5 w-3/4 bg-zinc-200 dark:bg-zinc-800 rounded" />
        <div className="h-4 w-1/2 bg-zinc-200 dark:bg-zinc-800 rounded" />
        <div className="pt-4 border-t border-zinc-100 dark:border-zinc-800 flex items-center justify-between">
          <div className="h-6 w-20 bg-zinc-200 dark:bg-zinc-800 rounded" />
          <div className="h-8 w-24 bg-zinc-200 dark:bg-zinc-800 rounded-lg" />
        </div>
      </div>
    </div>
  );
}

export function BrandedPageLoader({ label = 'Loading StudioSpace...' }: { label?: string }) {
  return (
    <div className="min-h-[60vh] flex flex-col items-center justify-center gap-4 px-4">
      <div className="w-12 h-12 rounded-xl bg-zinc-950 dark:bg-zinc-100 text-white dark:text-zinc-950 flex items-center justify-center">
        <Aperture className="w-6 h-6 animate-spin" style={{ animationDuration: '2.4s' }} />
      </div>
      <p className="text-sm font-medium text-zinc-600 dark:text-zinc-400">{label}</p>
    </div>
  );
}
