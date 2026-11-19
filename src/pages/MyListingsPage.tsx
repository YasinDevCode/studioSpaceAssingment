import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { Edit3, ExternalLink, MapPin, Plus, Trash2, Building2 } from 'lucide-react';
import { toast } from 'sonner';
import type { Studio } from '../types';
import { formatCurrency } from '../types';
import { useAuth } from '../context/AuthContext';
import { apiRequest } from '../lib/api';
import { StudioImage } from '../components/StudioImage';
import { ConfirmModal } from '../components/ConfirmModal';
import { BrandedPageLoader } from '../components/Skeletons';

export function MyListingsPage() {
  const { user } = useAuth();
  const [studios, setStudios] = useState<Studio[]>([]);
  const [loading, setLoading] = useState(true);
  const [deleteTarget, setDeleteTarget] = useState<Studio | null>(null);
  const [deleting, setDeleting] = useState(false);

  useEffect(() => {
    if (!user?.email) return;
    let active = true;
    setLoading(true);
    apiRequest<{ studios: Studio[] }>(
      `/api/studios?ownerEmail=${encodeURIComponent(user.email)}&sort=newest`
    )
      .then((res) => {
        if (active) setStudios(res.studios || []);
      })
      .catch(() => {
        if (active) setStudios([]);
      })
      .finally(() => {
        if (active) setLoading(false);
      });
    return () => {
      active = false;
    };
  }, [user?.email]);

  const handleConfirmDelete = async () => {
    if (!deleteTarget) return;
    setDeleting(true);
    try {
      await apiRequest(`/api/studios/${deleteTarget.id}`, {
        method: 'DELETE',
      });
      setStudios((prev) => prev.filter((s) => s.id !== deleteTarget.id));
      toast.success(`Deleted "${deleteTarget.title}" from StudioSpace.`);
      setDeleteTarget(null);
    } catch (err) {
      toast.error(err instanceof Error ? err.message : 'Unable to delete listing.');
    } finally {
      setDeleting(false);
    }
  };

  if (loading) {
    return <BrandedPageLoader label="Loading your studio listings..." />;
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 space-y-8">
      <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4">
        <div>
          <p className="text-sm font-medium text-blue-700 dark:text-blue-400">Host Inventory</p>
          <h1 className="mt-1 font-display text-3xl sm:text-4xl font-bold tracking-tight text-zinc-950 dark:text-zinc-50">
            My Studio Listings
          </h1>
          <p className="mt-2 text-sm sm:text-base text-zinc-600 dark:text-zinc-400">
            Manage hourly rates, photography, and availability across your owned production spaces.
          </p>
        </div>
        <Link
          to="/add-studio"
          className="inline-flex items-center justify-center gap-2 px-5 py-2.5 rounded-lg bg-blue-700 hover:bg-blue-800 dark:bg-blue-600 dark:hover:bg-blue-500 text-white text-sm font-semibold transition-colors whitespace-nowrap shrink-0"
        >
          <Plus className="w-4 h-4" />
          <span>Add New Studio</span>
        </Link>
      </div>

      {studios.length === 0 ? (
        <div className="py-20 px-6 text-center rounded-xl bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800">
          <div className="w-12 h-12 rounded-xl bg-zinc-100 dark:bg-zinc-800 text-zinc-500 dark:text-zinc-400 flex items-center justify-center mx-auto">
            <Building2 className="w-5 h-5" />
          </div>
          <h2 className="mt-4 font-display text-xl font-semibold text-zinc-950 dark:text-zinc-50">
            You have not listed a studio yet
          </h2>
          <p className="mt-2 text-sm text-zinc-600 dark:text-zinc-400 max-w-md mx-auto">
            Turn off-peak studio days into reliable revenue by listing your photography loft, stage,
            or recording room.
          </p>
          <Link
            to="/add-studio"
            className="mt-6 inline-flex items-center gap-2 px-5 py-2.5 rounded-lg bg-blue-700 hover:bg-blue-800 text-white text-sm font-semibold transition-colors"
          >
            <Plus className="w-4 h-4" />
            <span>List Your First Studio</span>
          </Link>
        </div>
      ) : (
        <div className="bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-xl overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="border-b border-zinc-200 dark:border-zinc-800 bg-zinc-50 dark:bg-zinc-950/60 text-xs font-semibold text-zinc-500 dark:text-zinc-400">
                  <th className="py-3.5 px-5">Studio Workspace</th>
                  <th className="py-3.5 px-4">Category</th>
                  <th className="py-3.5 px-4">Hourly Rate</th>
                  <th className="py-3.5 px-4">Capacity</th>
                  <th className="py-3.5 px-5 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-zinc-200 dark:divide-zinc-800 text-sm">
                {studios.map((studio) => (
                  <tr
                    key={studio.id}
                    className="hover:bg-zinc-50/70 dark:hover:bg-zinc-800/30 transition-colors"
                  >
                    <td className="py-4 px-5">
                      <div className="flex items-center gap-4 min-w-[240px]">
                        <div className="w-20 aspect-[4/3] rounded-lg overflow-hidden bg-zinc-200 dark:bg-zinc-800 shrink-0">
                          <StudioImage src={studio.imageUrl} alt={studio.title} />
                        </div>
                        <div className="min-w-0">
                          <Link
                            to={`/studios/${studio.id}`}
                            className="font-display font-semibold text-zinc-950 dark:text-zinc-50 hover:text-blue-700 dark:hover:text-blue-400 transition-colors line-clamp-1"
                          >
                            {studio.title}
                          </Link>
                          <p className="mt-1 flex items-center gap-1 text-xs text-zinc-500 dark:text-zinc-400 truncate">
                            <MapPin className="w-3.5 h-3.5 shrink-0" />
                            <span>{studio.location}</span>
                          </p>
                        </div>
                      </div>
                    </td>
                    <td className="py-4 px-4 whitespace-nowrap text-zinc-700 dark:text-zinc-300 font-medium">
                      {studio.category}
                    </td>
                    <td className="py-4 px-4 whitespace-nowrap font-mono tabular-nums font-semibold text-zinc-950 dark:text-zinc-50">
                      {formatCurrency(studio.hourlyRate)} / hr
                    </td>
                    <td className="py-4 px-4 whitespace-nowrap font-mono tabular-nums text-zinc-600 dark:text-zinc-400">
                      {studio.maxCapacity} crew
                    </td>
                    <td className="py-4 px-5 whitespace-nowrap text-right">
                      <div className="inline-flex items-center gap-2">
                        <Link
                          to={`/studios/${studio.id}`}
                          aria-label={`View ${studio.title}`}
                          className="inline-flex items-center gap-1.5 px-3 py-2 rounded-lg border border-zinc-200 dark:border-zinc-700 text-xs font-medium text-zinc-700 dark:text-zinc-300 hover:bg-zinc-100 dark:hover:bg-zinc-800 transition-colors"
                        >
                          <ExternalLink className="w-3.5 h-3.5" />
                          <span>View</span>
                        </Link>
                        <Link
                          to={`/studios/edit/${studio.id}`}
                          className="inline-flex items-center gap-1.5 px-3 py-2 rounded-lg border border-zinc-200 dark:border-zinc-700 text-xs font-semibold text-zinc-900 dark:text-zinc-100 hover:border-blue-600 hover:text-blue-700 dark:hover:text-blue-400 transition-colors"
                        >
                          <Edit3 className="w-3.5 h-3.5" />
                          <span>Update</span>
                        </Link>
                        <button
                          type="button"
                          onClick={() => setDeleteTarget(studio)}
                          className="inline-flex items-center gap-1.5 px-3 py-2 rounded-lg border border-rose-200 dark:border-rose-900/80 text-xs font-semibold text-rose-600 dark:text-rose-400 hover:bg-rose-50 dark:hover:bg-rose-950/40 transition-colors"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                          <span>Delete</span>
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      <ConfirmModal
        open={Boolean(deleteTarget)}
        title="Delete studio listing?"
        description={
          deleteTarget
            ? `Are you sure you want to permanently remove "${deleteTarget.title}"? Existing associated records will also be cleared.`
            : ''
        }
        confirmLabel="Delete Studio"
        destructive
        busy={deleting}
        onConfirm={handleConfirmDelete}
        onClose={() => setDeleteTarget(null)}
      />
    </div>
  );
}
