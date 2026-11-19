export type StudioCategory =
  | 'Photo Studio'
  | 'Film Stage'
  | 'Podcast Lounge'
  | 'Music Suite'
  | 'Art Workshop';

export const STUDIO_CATEGORIES: StudioCategory[] = [
  'Photo Studio',
  'Film Stage',
  'Podcast Lounge',
  'Music Suite',
  'Art Workshop',
];

export const CATEGORY_DETAILS: Record<
  StudioCategory,
  {
    pluralLabel: string;
    subtitle: string;
    image: string;
  }
> = {
  'Photo Studio': {
    pluralLabel: 'Photo Studios',
    subtitle: 'Daylight lofts, curved cycloramas, and strobe-ready commercial sets.',
    image: '/src/assets/images/studio_photo_cyc_1795069832715.jpg',
  },
  'Film Stage': {
    pluralLabel: 'Sound Stages',
    subtitle: 'Acoustically isolated stages with pre-rigged trusses and roll-in bays.',
    image: '/src/assets/images/studio_cinema_stage_1795069833041.jpg',
  },
  'Podcast Lounge': {
    pluralLabel: 'Podcast Rooms',
    subtitle: 'Turnkey multi-cam video podcast rooms with broadcast microphones.',
    image: '/src/assets/images/studio_podcast_lounge_1795069833511.jpg',
  },
  'Music Suite': {
    pluralLabel: 'Music Suites',
    subtitle: 'Analog control rooms, tuned live tracking floors, and iso booths.',
    image: '/src/assets/images/studio_music_suite_1795069835817.jpg',
  },
  'Art Workshop': {
    pluralLabel: 'Art Workshops',
    subtitle: 'Skylit fabrication lofts, ceramics tables, and fine art ateliers.',
    image: '/src/assets/images/studio_art_workshop_1795070044560.jpg',
  },
};

export const AMENITY_PRESETS: string[] = [
  'Seamless Cyclorama Wall',
  'North-Facing Daylight Windows',
  'Blackout Drapes',
  'Profoto Lighting Kit',
  'C-Stands & Sandbags',
  'Overhead Lighting Grid',
  'Acoustic Soundproofing',
  '4x Broadcast Microphones',
  'Multi-Cam 4K Video Rig',
  'Analog Mixing Console',
  'Freight Elevator',
  'Drive-In Roll-Up Bay',
  'Hair & Makeup Station',
  'Green Room & Client Monitor',
  '1Gbps Fiber Wi-Fi',
  'Espresso Bar & Kitchenette',
];

export interface User {
  id: string;
  name: string;
  email: string;
  photoUrl: string;
  provider?: string;
  createdAt?: string;
}

export interface Studio {
  id: string;
  title: string;
  category: StudioCategory | string;
  hourlyRate: number;
  securityDeposit: number;
  maxCapacity: number;
  location: string;
  imageUrl: string;
  gallery: string[];
  amenities: string[];
  overview: string;
  rating: number;
  reviewCount: number;
  sqft: number;
  ceilingHeight: string;
  ownerEmail: string;
  ownerName: string;
  ownerPhoto: string;
  createdAt: string;
  updatedAt: string;
}

export type BookingStatus = 'Pending' | 'Confirmed' | 'Completed' | 'Cancelled';

export interface Booking {
  id: string;
  studioId: string;
  studioTitle: string;
  studioImage: string;
  studioLocation: string;
  studioCategory: string;
  hostEmail: string;
  hostName: string;
  userEmail: string;
  userName: string;
  bookingDate: string;
  startHour: number;
  endHour: number;
  durationHours: number;
  hourlyRate: number;
  securityDeposit: number;
  totalAmount: number;
  status: BookingStatus;
  notes: string;
  invoiceNumber: string;
  createdAt: string;
}

export interface Review {
  id: string;
  studioId: string;
  userEmail: string;
  userName: string;
  userPhoto: string;
  rating: number;
  comment: string;
  createdAt: string;
}

export function formatHour(hour: number): string {
  const h = hour % 12 === 0 ? 12 : hour % 12;
  const period = hour < 12 ? 'AM' : 'PM';
  return `${h}:00 ${period}`;
}

export function formatCurrency(amount: number): string {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    maximumFractionDigits: 0,
  }).format(amount);
}
