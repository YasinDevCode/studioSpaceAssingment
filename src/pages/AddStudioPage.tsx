import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { ArrowLeft } from 'lucide-react';
import { toast } from 'sonner';
import { useAuth } from '../context/AuthContext';
import { apiRequest } from '../lib/api';
import { StudioForm } from '../components/StudioForm';
import type { StudioFormValues } from '../components/StudioForm';
import { toStudioPayload } from '../utils/format';

export function AddStudioPage() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [submitting, setSubmitting] = useState(false);

  const handleCreate = async (values: StudioFormValues) => {
    setSubmitting(true);
    try {
      await apiRequest('/api/studios', {
        method: 'POST',
        body: JSON.stringify(toStudioPayload(values)),
      });
      toast.success(`"${values.title}" is now live in the StudioSpace marketplace.`);
      navigate('/my-listings');
    } catch (err) {
      toast.error(err instanceof Error ? err.message : 'Unable to create studio listing.');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12 space-y-8">
      <div className="space-y-3">
        <Link
          to="/my-listings"
          className="inline-flex items-center gap-1.5 text-sm font-medium text-zinc-600 dark:text-zinc-400 hover:text-zinc-950 dark:hover:text-white transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Back to My Listings</span>
        </Link>
        <div>
          <p className="text-sm font-medium text-blue-700 dark:text-blue-400">Host Studio</p>
          <h1 className="mt-1 font-display text-3xl sm:text-4xl font-bold tracking-tight text-zinc-950 dark:text-zinc-50">
            Add New Production Studio
          </h1>
          <p className="mt-2 text-base text-zinc-600 dark:text-zinc-400">
            Publish your creative workspace with hourly rates, included gear, and studio
            photography.
          </p>
        </div>
      </div>

      <StudioForm
        ownerName={user?.name || ''}
        ownerEmail={user?.email || ''}
        submitLabel="Publish Studio Listing"
        submitting={submitting}
        onSubmit={handleCreate}
      />
    </div>
  );
}
