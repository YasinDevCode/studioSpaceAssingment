import React, { createContext, useCallback, useContext, useEffect, useState } from 'react';
import { toast } from 'sonner';
import type { Studio } from '../types';
import { apiRequest } from '../lib/api';
import { useAuth } from './AuthContext';

interface WishlistContextValue {
  savedIds: Set<string>;
  savedStudios: Studio[];
  loading: boolean;
  toggleWishlist: (studioId: string, studioTitle?: string) => Promise<boolean>;
  refreshWishlist: () => Promise<void>;
}

const WishlistContext = createContext<WishlistContextValue | undefined>(undefined);

export function WishlistProvider({ children }: { children: React.ReactNode }) {
  const { user } = useAuth();
  const [savedIds, setSavedIds] = useState<Set<string>>(new Set());
  const [savedStudios, setSavedStudios] = useState<Studio[]>([]);
  const [loading, setLoading] = useState(false);

  const refreshWishlist = useCallback(async () => {
    if (!user) {
      setSavedIds(new Set());
      setSavedStudios([]);
      return;
    }
    setLoading(true);
    try {
      const data = await apiRequest<{ studioIds: string[]; studios: Studio[] }>('/api/wishlist');
      setSavedIds(new Set(data.studioIds));
      setSavedStudios(data.studios);
    } catch {
      // Ignore silent refresh error
    } finally {
      setLoading(false);
    }
  }, [user]);

  useEffect(() => {
    refreshWishlist();
  }, [refreshWishlist]);

  const toggleWishlist = async (studioId: string, studioTitle?: string): Promise<boolean> => {
    if (!user) {
      toast.info('Please log in to save studios to your wishlist.');
      return false;
    }
    try {
      const data = await apiRequest<{ studioId: string; saved: boolean }>('/api/wishlist/toggle', {
        method: 'POST',
        body: JSON.stringify({ studioId }),
      });
      await refreshWishlist();
      if (data.saved) {
        toast.success(
          studioTitle ? `Saved "${studioTitle}" to your wishlist.` : 'Studio saved to wishlist.'
        );
      } else {
        toast.message(
          studioTitle ? `Removed "${studioTitle}" from wishlist.` : 'Removed from wishlist.'
        );
      }
      return data.saved;
    } catch (err) {
      toast.error(err instanceof Error ? err.message : 'Unable to update wishlist.');
      return false;
    }
  };

  return (
    <WishlistContext.Provider
      value={{ savedIds, savedStudios, loading, toggleWishlist, refreshWishlist }}
    >
      {children}
    </WishlistContext.Provider>
  );
}

export function useWishlist() {
  const ctx = useContext(WishlistContext);
  if (!ctx) throw new Error('useWishlist must be used inside WishlistProvider');
  return ctx;
}
