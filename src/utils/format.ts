import type { StudioFormValues } from '../components/StudioForm';

export function getInitials(name?: string, fallback = 'SS'): string {
  if (!name?.trim()) return fallback;
  return name
    .trim()
    .split(/\s+/)
    .map((part) => part[0])
    .slice(0, 2)
    .join('')
    .toUpperCase();
}

export function validatePassword(password: string): string {
  if (password.length < 6) {
    return 'Password must be at least 6 characters long.';
  }
  if (!/[A-Z]/.test(password)) {
    return 'Password must include at least one uppercase letter (A-Z).';
  }
  if (!/[a-z]/.test(password)) {
    return 'Password must include at least one lowercase letter (a-z).';
  }
  return '';
}

export function toStudioPayload(values: StudioFormValues) {
  return {
    title: values.title,
    category: values.category,
    hourlyRate: Number(values.hourlyRate),
    securityDeposit: Number(values.securityDeposit),
    maxCapacity: Number(values.maxCapacity),
    sqft: Number(values.sqft),
    ceilingHeight: values.ceilingHeight,
    location: values.location,
    imageUrl: values.imageUrl,
    amenities: values.amenities,
    overview: values.overview,
  };
}
