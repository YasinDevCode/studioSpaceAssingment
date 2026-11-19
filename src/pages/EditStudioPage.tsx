import { useEffect, useState } from 'react';
import { Link, useNavigate, useParams } from 'react-router-dom';
import { ArrowLeft } from 'lucide-react';
import { toast } from 'sonner';
import type { Studio } from '../types';
import { useAuth } from '../context/AuthContext';
import { apiRequest } from '../lib/api';
import { StudioForm } from '../components/StudioForm';
import type { StudioFormValues } from '../components/StudioForm';
import { BrandedPageLoader } from '../components/Skeletons';
import { toStudioPayload } from '../utils/format';

export function EditStudioPage() {
  const { id } = useParams<{ id: string }>();
  const { user } = useAuth();
  const navigate = useNavigate();

  const [studio, setStudio] = useState<Studio | null>(null);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    if (!id) return;
    let active = true;
    setLoading(true);
    apiRequest<{ studio: Studio }>(`/api/studios/${id}`)
      .then((res) => {
        if (!active) return;
        if (user && res.studio.ownerEmail.toLowerCase() !== user.email.toLowerCase()) {
          toast.error('You can only edit studio listings that you own.');
          navigate('/my-listings', { replace: true });
          return;
        }
        setStudio(res.studio);
      })
      .catch(() => {
        toast.error('Studio listing not found.');
        navigate('/my-listings', { replace: true });
      })
      .finally(() => {
        if (active) setLoading(false);
      });

    return () => {
      active = false;
    };
  }, [id, user, navigate]);

  const handleUpdate = async (values: StudioFormValues) => {
    if (!id) return;
    setSubmitting(true);
    try {
      await apiRequest(`/api/studios/${id}`, {
        method: 'PUT',
        body: JSON.stringify(toStudioPayload(values)),
      });
      toast.success(`Updated "${values.title}" successfully.`);
      navigate('/my-listings');
    } catch (err) {
      toast.error(err instanceof Error ? err.message : 'Unable to update studio listing.');
    } finally {
      setSubmitting(false);
    }
  };

  if (loading || !studio) {
    return <BrandedPageLoader label="Loading listing details..." />;
  }

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
          <p className="text-sm font-medium text-blue-700 dark:text-blue-400">Edit Listing</p>
          <h1 className="mt-1 font-display text-3xl sm:text-4xl font-bold tracking-tight text-zinc-950 dark:text-zinc-50">
            Update {studio.title}
          </h1>
          <p className="mt-2 text-base text-zinc-600 dark:text-zinc-400">
            Changes sync immediately to your public studio page and booking schedule.
          </p>
        </div>
      </div>

      <StudioForm
        initialValues={{
          title: studio.title,
          category: studio.category,
          hourlyRate: String(studio.hourlyRate),
          securityDeposit: String(studio.securityDeposit),
          maxCapacity: String(studio.maxCapacity),
          sqft: String(studio.sqft),
          ceilingHeight: studio.ceilingHeight,
          location: studio.location,
          imageUrl: studio.imageUrl,
          amenities: studio.amenities,
          overview: studio.overview,
        }}
        ownerName={studio.ownerName}
        ownerEmail={studio.ownerEmail}
        submitLabel="Save Studio Changes"
        submitting={submitting}
        onSubmit={handleUpdate}
      />
    </div>
  );
}
