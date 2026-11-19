import { useState } from 'react';
import { Aperture } from 'lucide-react';

interface StudioImageProps {
  src?: string;
  alt: string;
  className?: string;
  fallbackLabel?: string;
}

export function StudioImage({
  src,
  alt,
  className = 'w-full h-full object-cover',
  fallbackLabel,
}: StudioImageProps) {
  const [failed, setFailed] = useState(false);

  if (!src || failed) {
    return (
      <div
        role="img"
        aria-label={alt}
        className="w-full h-full flex flex-col items-center justify-center gap-2 bg-gradient-to-br from-zinc-200 via-zinc-100 to-zinc-200 dark:from-zinc-900 dark:via-zinc-800 dark:to-zinc-900 text-zinc-500 dark:text-zinc-400 p-4 text-center"
      >
        <Aperture className="w-8 h-8 opacity-60" strokeWidth={1.5} />
        <span className="text-xs font-medium tracking-tight line-clamp-2 max-w-[180px]">
          {fallbackLabel || alt}
        </span>
      </div>
    );
  }

  return (
    <img
      src={src}
      alt={alt}
      referrerPolicy="no-referrer"
      onError={() => setFailed(true)}
      className={className}
      loading="lazy"
    />
  );
}
