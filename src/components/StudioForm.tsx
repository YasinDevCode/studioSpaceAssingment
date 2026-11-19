import React, { useState } from 'react';
import { Plus, Upload, X } from 'lucide-react';
import { toast } from 'sonner';
import { AMENITY_PRESETS, STUDIO_CATEGORIES } from '../types';
import type { StudioCategory } from '../types';
import { apiRequest } from '../lib/api';
import { StudioImage } from './StudioImage';

export interface StudioFormValues {
  title: string;
  category: StudioCategory | string;
  hourlyRate: string;
  securityDeposit: string;
  maxCapacity: string;
  sqft: string;
  ceilingHeight: string;
  location: string;
  imageUrl: string;
  amenities: string[];
  overview: string;
}

interface StudioFormProps {
  initialValues?: StudioFormValues;
  ownerName: string;
  ownerEmail: string;
  submitLabel: string;
  submitting: boolean;
  onSubmit: (values: StudioFormValues) => Promise<void>;
}

const DEFAULT_VALUES: StudioFormValues = {
  title: '',
  category: 'Photo Studio',
  hourlyRate: '140',
  securityDeposit: '200',
  maxCapacity: '15',
  sqft: '1800',
  ceilingHeight: '14 ft',
  location: '',
  imageUrl: '',
  amenities: ['1Gbps Fiber Wi-Fi', 'C-Stands & Sandbags'],
  overview: '',
};

export function StudioForm({
  initialValues,
  ownerName,
  ownerEmail,
  submitLabel,
  submitting,
  onSubmit,
}: StudioFormProps) {
  const [form, setForm] = useState<StudioFormValues>(initialValues || DEFAULT_VALUES);
  const [customAmenity, setCustomAmenity] = useState('');
  const [uploadingImage, setUploadingImage] = useState(false);

  const toggleAmenity = (amenity: string) => {
    setForm((prev) => ({
      ...prev,
      amenities: prev.amenities.includes(amenity)
        ? prev.amenities.filter((a) => a !== amenity)
        : [...prev.amenities, amenity],
    }));
  };

  const addCustomAmenity = () => {
    const trimmed = customAmenity.trim();
    if (!trimmed) return;
    if (form.amenities.includes(trimmed)) {
      toast.info('Amenity already added.');
      return;
    }
    setForm((prev) => ({ ...prev, amenities: [...prev.amenities, trimmed] }));
    setCustomAmenity('');
  };

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    if (file.size > 5 * 1024 * 1024) {
      toast.error('Image must be smaller than 5 MB.');
      return;
    }

    const body = new FormData();
    body.append('image', file);
    setUploadingImage(true);
    try {
      const res = await apiRequest<{ url: string; provider: string }>('/api/upload', {
        method: 'POST',
        body,
      });
      setForm((prev) => ({ ...prev, imageUrl: res.url }));
      toast.success(
        res.provider === 'imgbb'
          ? 'Image uploaded to ImgBB successfully.'
          : 'Studio photograph uploaded successfully.'
      );
    } catch (err) {
      toast.error(err instanceof Error ? err.message : 'Failed to upload studio image.');
    } finally {
      setUploadingImage(false);
      e.target.value = '';
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.title.trim() || !form.location.trim() || !form.imageUrl.trim() || !form.overview.trim()) {
      toast.error('Please fill in all required studio fields including an image.');
      return;
    }
    await onSubmit(form);
  };

  const customAmenities = form.amenities.filter((a) => !AMENITY_PRESETS.includes(a));

  return (
    <form onSubmit={handleSubmit} className="space-y-8">
      {/* Core Specifications */}
      <div className="bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-xl p-6 sm:p-8 space-y-6">
        <div>
          <h2 className="font-display text-lg font-semibold text-zinc-950 dark:text-zinc-50">
            Workspace Overview & Specifications
          </h2>
          <p className="text-sm text-zinc-600 dark:text-zinc-400 mt-1">
            Provide clear dimensions, transparent hourly rates, and location details for incoming
            crews.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          <div className="md:col-span-2">
            <label
              htmlFor="studio-title"
              className="block text-sm font-medium text-zinc-800 dark:text-zinc-200 mb-1.5"
            >
              Studio Title *
            </label>
            <input
              id="studio-title"
              type="text"
              required
              value={form.title}
              onChange={(e) => setForm({ ...form, title: e.target.value })}
              placeholder="e.g., Dumbo North-Light Cyclorama Loft"
              className="w-full h-11 px-3.5 rounded-lg bg-zinc-50 dark:bg-zinc-950 border border-zinc-300 dark:border-zinc-700 text-sm text-zinc-950 dark:text-zinc-100 focus:outline-none focus:ring-2 focus:ring-blue-600"
            />
          </div>

          <div>
            <label
              htmlFor="studio-category"
              className="block text-sm font-medium text-zinc-800 dark:text-zinc-200 mb-1.5"
            >
              Category *
            </label>
            <select
              id="studio-category"
              value={form.category}
              onChange={(e) => setForm({ ...form, category: e.target.value })}
              className="w-full h-11 px-3.5 rounded-lg bg-zinc-50 dark:bg-zinc-950 border border-zinc-300 dark:border-zinc-700 text-sm text-zinc-950 dark:text-zinc-100 focus:outline-none focus:ring-2 focus:ring-blue-600"
            >
              {STUDIO_CATEGORIES.map((cat) => (
                <option key={cat} value={cat}>
                  {cat}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label
              htmlFor="studio-location"
              className="block text-sm font-medium text-zinc-800 dark:text-zinc-200 mb-1.5"
            >
              Location / Address *
            </label>
            <input
              id="studio-location"
              type="text"
              required
              value={form.location}
              onChange={(e) => setForm({ ...form, location: e.target.value })}
              placeholder="e.g., Greenpoint, Brooklyn, NY"
              className="w-full h-11 px-3.5 rounded-lg bg-zinc-50 dark:bg-zinc-950 border border-zinc-300 dark:border-zinc-700 text-sm text-zinc-950 dark:text-zinc-100 focus:outline-none focus:ring-2 focus:ring-blue-600"
            />
          </div>

          <div>
            <label
              htmlFor="studio-rate"
              className="block text-sm font-medium text-zinc-800 dark:text-zinc-200 mb-1.5"
            >
              Hourly Rate ($ USD) *
            </label>
            <input
              id="studio-rate"
              type="number"
              min="10"
              step="1"
              required
              value={form.hourlyRate}
              onChange={(e) => setForm({ ...form, hourlyRate: e.target.value })}
              className="w-full h-11 px-3.5 rounded-lg bg-zinc-50 dark:bg-zinc-950 border border-zinc-300 dark:border-zinc-700 text-sm font-mono tabular-nums text-zinc-950 dark:text-zinc-100 focus:outline-none focus:ring-2 focus:ring-blue-600"
            />
          </div>

          <div>
            <label
              htmlFor="studio-deposit"
              className="block text-sm font-medium text-zinc-800 dark:text-zinc-200 mb-1.5"
            >
              Security Deposit ($ USD) *
            </label>
            <input
              id="studio-deposit"
              type="number"
              min="0"
              step="1"
              required
              value={form.securityDeposit}
              onChange={(e) => setForm({ ...form, securityDeposit: e.target.value })}
              className="w-full h-11 px-3.5 rounded-lg bg-zinc-50 dark:bg-zinc-950 border border-zinc-300 dark:border-zinc-700 text-sm font-mono tabular-nums text-zinc-950 dark:text-zinc-100 focus:outline-none focus:ring-2 focus:ring-blue-600"
            />
          </div>

          <div>
            <label
              htmlFor="studio-capacity"
              className="block text-sm font-medium text-zinc-800 dark:text-zinc-200 mb-1.5"
            >
              Max Crew Capacity *
            </label>
            <input
              id="studio-capacity"
              type="number"
              min="1"
              max="200"
              required
              value={form.maxCapacity}
              onChange={(e) => setForm({ ...form, maxCapacity: e.target.value })}
              className="w-full h-11 px-3.5 rounded-lg bg-zinc-50 dark:bg-zinc-950 border border-zinc-300 dark:border-zinc-700 text-sm font-mono tabular-nums text-zinc-950 dark:text-zinc-100 focus:outline-none focus:ring-2 focus:ring-blue-600"
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label
                htmlFor="studio-sqft"
                className="block text-sm font-medium text-zinc-800 dark:text-zinc-200 mb-1.5"
              >
                Floor Area (sq ft)
              </label>
              <input
                id="studio-sqft"
                type="number"
                min="100"
                value={form.sqft}
                onChange={(e) => setForm({ ...form, sqft: e.target.value })}
                className="w-full h-11 px-3.5 rounded-lg bg-zinc-50 dark:bg-zinc-950 border border-zinc-300 dark:border-zinc-700 text-sm font-mono tabular-nums text-zinc-950 dark:text-zinc-100 focus:outline-none focus:ring-2 focus:ring-blue-600"
              />
            </div>
            <div>
              <label
                htmlFor="studio-ceiling"
                className="block text-sm font-medium text-zinc-800 dark:text-zinc-200 mb-1.5"
              >
                Ceiling Height
              </label>
              <input
                id="studio-ceiling"
                type="text"
                value={form.ceilingHeight}
                onChange={(e) => setForm({ ...form, ceilingHeight: e.target.value })}
                placeholder="14 ft"
                className="w-full h-11 px-3.5 rounded-lg bg-zinc-50 dark:bg-zinc-950 border border-zinc-300 dark:border-zinc-700 text-sm text-zinc-950 dark:text-zinc-100 focus:outline-none focus:ring-2 focus:ring-blue-600"
              />
            </div>
          </div>
        </div>
      </div>

      {/* Studio Photography (Upload + Direct URL) */}
      <div className="bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-xl p-6 sm:p-8 space-y-5">
        <div>
          <h2 className="font-display text-lg font-semibold text-zinc-950 dark:text-zinc-50">
            Studio Photography
          </h2>
          <p className="text-sm text-zinc-600 dark:text-zinc-400 mt-1">
            Upload a high-resolution studio image (hosted via ImgBB / StudioSpace media storage) or
            paste an image URL.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
          <div className="lg:col-span-7 space-y-4">
            <div>
              <label
                htmlFor="studio-image-url"
                className="block text-sm font-medium text-zinc-800 dark:text-zinc-200 mb-1.5"
              >
                Cover Image URL *
              </label>
              <input
                id="studio-image-url"
                type="text"
                required
                value={form.imageUrl}
                onChange={(e) => setForm({ ...form, imageUrl: e.target.value })}
                placeholder="https://i.ibb.co/... or upload a file below"
                className="w-full h-11 px-3.5 rounded-lg bg-zinc-50 dark:bg-zinc-950 border border-zinc-300 dark:border-zinc-700 text-sm text-zinc-950 dark:text-zinc-100 focus:outline-none focus:ring-2 focus:ring-blue-600"
              />
            </div>

            <div className="flex flex-wrap items-center gap-3">
              <label className="inline-flex items-center gap-2 px-4 py-2.5 rounded-lg border border-zinc-300 dark:border-zinc-700 bg-zinc-50 dark:bg-zinc-950 text-sm font-medium text-zinc-800 dark:text-zinc-200 hover:border-blue-600 cursor-pointer transition-colors">
                <Upload className="w-4 h-4 text-blue-700 dark:text-blue-400" />
                <span>{uploadingImage ? 'Uploading image...' : 'Upload Image File'}</span>
                <input
                  type="file"
                  accept="image/jpeg,image/png,image/webp,image/gif"
                  onChange={handleFileUpload}
                  disabled={uploadingImage}
                  className="sr-only"
                />
              </label>
              <span className="text-xs text-zinc-500 dark:text-zinc-400">
                JPG, PNG, or WebP · Max 5 MB
              </span>
            </div>
          </div>

          <div className="lg:col-span-5">
            <div className="aspect-[4/3] w-full rounded-lg overflow-hidden border border-zinc-200 dark:border-zinc-800 bg-zinc-100 dark:bg-zinc-950">
              <StudioImage
                src={form.imageUrl}
                alt={form.title || 'Studio cover preview'}
                fallbackLabel="Cover photo preview"
              />
            </div>
          </div>
        </div>
      </div>

      {/* Amenities & Detailed Overview */}
      <div className="bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-xl p-6 sm:p-8 space-y-6">
        <div>
          <h2 className="font-display text-lg font-semibold text-zinc-950 dark:text-zinc-50">
            Included Amenities & Production Overview
          </h2>
          <p className="text-sm text-zinc-600 dark:text-zinc-400 mt-1">
            Select included grip, lighting, acoustic, and facility features.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-2.5">
          {AMENITY_PRESETS.map((item) => {
            const checked = form.amenities.includes(item);
            return (
              <label
                key={item}
                className={`flex items-center gap-2.5 px-3.5 py-2.5 rounded-lg border text-sm cursor-pointer transition-colors ${
                  checked
                    ? 'border-blue-600 bg-blue-50/70 dark:bg-blue-950/40 text-zinc-950 dark:text-zinc-50 font-medium'
                    : 'border-zinc-200 dark:border-zinc-800 bg-zinc-50 dark:bg-zinc-950 text-zinc-700 dark:text-zinc-300 hover:border-zinc-300 dark:hover:border-zinc-700'
                }`}
              >
                <input
                  type="checkbox"
                  checked={checked}
                  onChange={() => toggleAmenity(item)}
                  className="rounded accent-blue-700 w-4 h-4"
                />
                <span className="truncate">{item}</span>
              </label>
            );
          })}
        </div>

        {/* Custom Amenity Input */}
        <div className="space-y-2.5">
          <div className="flex gap-2 max-w-md">
            <input
              type="text"
              value={customAmenity}
              onChange={(e) => setCustomAmenity(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === 'Enter') {
                  e.preventDefault();
                  addCustomAmenity();
                }
              }}
              placeholder="Add custom equipment or feature..."
              className="flex-1 h-10 px-3.5 rounded-lg bg-zinc-50 dark:bg-zinc-950 border border-zinc-300 dark:border-zinc-700 text-sm text-zinc-950 dark:text-zinc-100 focus:outline-none focus:ring-2 focus:ring-blue-600"
            />
            <button
              type="button"
              onClick={addCustomAmenity}
              className="h-10 px-3.5 rounded-lg border border-zinc-300 dark:border-zinc-700 text-sm font-medium text-zinc-800 dark:text-zinc-200 hover:bg-zinc-100 dark:hover:bg-zinc-800 inline-flex items-center gap-1.5"
            >
              <Plus className="w-4 h-4" />
              <span>Add</span>
            </button>
          </div>

          {customAmenities.length > 0 && (
            <div className="flex flex-wrap gap-2">
              {customAmenities.map((item) => (
                <button
                  key={item}
                  type="button"
                  onClick={() => toggleAmenity(item)}
                  className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-zinc-100 dark:bg-zinc-800 text-xs font-medium text-zinc-800 dark:text-zinc-200 hover:bg-rose-50 hover:text-rose-700 dark:hover:bg-rose-950/50 dark:hover:text-rose-300 transition-colors"
                >
                  <span>{item}</span>
                  <X className="w-3 h-3" />
                </button>
              ))}
            </div>
          )}
        </div>

        <div>
          <label
            htmlFor="studio-overview"
            className="block text-sm font-medium text-zinc-800 dark:text-zinc-200 mb-1.5"
          >
            Detailed Studio Overview *
          </label>
          <textarea
            id="studio-overview"
            rows={5}
            required
            value={form.overview}
            onChange={(e) => setForm({ ...form, overview: e.target.value })}
            placeholder="Describe natural lighting direction, power distribution, acoustic isolation, load-in access, and ideal production types..."
            className="w-full px-3.5 py-3 rounded-lg bg-zinc-50 dark:bg-zinc-950 border border-zinc-300 dark:border-zinc-700 text-sm text-zinc-950 dark:text-zinc-100 leading-relaxed focus:outline-none focus:ring-2 focus:ring-blue-600"
          />
        </div>
      </div>

      {/* Read-Only Host Details */}
      <div className="bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-xl p-6 sm:p-8 space-y-4">
        <h2 className="font-display text-lg font-semibold text-zinc-950 dark:text-zinc-50">
          Verified Host Information
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          <div>
            <label className="block text-sm font-medium text-zinc-700 dark:text-zinc-300 mb-1.5">
              Host Name (Read-only)
            </label>
            <input
              type="text"
              readOnly
              value={ownerName}
              className="w-full h-11 px-3.5 rounded-lg bg-zinc-100 dark:bg-zinc-950/70 border border-zinc-200 dark:border-zinc-800 text-sm text-zinc-600 dark:text-zinc-400 cursor-not-allowed"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-zinc-700 dark:text-zinc-300 mb-1.5">
              Host Email (Read-only)
            </label>
            <input
              type="email"
              readOnly
              value={ownerEmail}
              className="w-full h-11 px-3.5 rounded-lg bg-zinc-100 dark:bg-zinc-950/70 border border-zinc-200 dark:border-zinc-800 text-sm text-zinc-600 dark:text-zinc-400 cursor-not-allowed"
            />
          </div>
        </div>
      </div>

      <div className="flex items-center justify-end gap-3">
        <button
          type="submit"
          disabled={submitting || uploadingImage}
          className="px-6 py-3 rounded-lg bg-blue-700 hover:bg-blue-800 dark:bg-blue-600 dark:hover:bg-blue-500 text-white text-sm font-semibold transition-colors disabled:opacity-60"
        >
          {submitting ? 'Saving Studio...' : submitLabel}
        </button>
      </div>
    </form>
  );
}
