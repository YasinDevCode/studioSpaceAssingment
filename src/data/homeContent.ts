import { Headphones, Lock, ShieldCheck, UserCheck } from 'lucide-react';

export const HERO_SLIDES = [
  {
    id: 'slide-daylight',
    kicker: 'Photography & Editorial Lofts',
    headline: 'Architectural daylight spaces built for real production.',
    subtext:
      'Discover vetted cyclorama studios, cast-iron lofts, and strobe-ready commercial sets with transparent hourly rates and real-time slot checks.',
    image: '/src/assets/images/hero_daylight_loft_1795069737562.jpg',
    primaryLabel: 'Explore Studios',
    primaryTo: '/studios',
    secondaryLabel: 'Host Your Space',
    secondaryTo: '/add-studio',
  },
  {
    id: 'slide-cinema',
    kicker: 'Acoustic Film Sound Stages',
    headline: 'Soundproof stages pre-rigged for your next call sheet.',
    subtext:
      'Book NC-20 isolated stages with overhead lighting trusses, 200-amp power distribution, and ground-level roll-in bays across major creative hubs.',
    image: '/src/assets/images/studio_cinema_stage_1795069833041.jpg',
    primaryLabel: 'Explore Studios',
    primaryTo: '/studios?category=Film%20Stage',
    secondaryLabel: 'Host Your Space',
    secondaryTo: '/add-studio',
  },
  {
    id: 'slide-audio',
    kicker: 'Music Suites & Broadcast Lounges',
    headline: 'Analog warmth and broadcast clarity, reserved by the hour.',
    subtext:
      'Reserve acoustically tuned control rooms, live tracking floors, and multi-camera 4K podcast lounges directly from working studio owners.',
    image: '/src/assets/images/studio_music_suite_1795069835817.jpg',
    primaryLabel: 'Explore Studios',
    primaryTo: '/studios?category=Music%20Suite',
    secondaryLabel: 'Host Your Space',
    secondaryTo: '/add-studio',
  },
];

export const WORKFLOW_STEPS = [
  {
    step: '01',
    title: 'Discover Spaces',
    description:
      'Filter verified photo lofts, sound stages, podcast rooms, and recording suites by location, acoustic specs, and hourly rate.',
  },
  {
    step: '02',
    title: 'Select Shoot Hours',
    description:
      'Inspect live confirmed availability by date so your call time and wrap window never collide with another production.',
  },
  {
    step: '03',
    title: 'Book Instantly',
    description:
      'Lock in transparent hourly pricing and refundable security deposits with automatic conflict protection and downloadable invoices.',
  },
  {
    step: '04',
    title: 'Create & Produce',
    description:
      'Load in with verified host instructions, included grip and lighting packages, and $2M production liability coverage.',
  },
];

export const GUARANTEES = [
  {
    icon: ShieldCheck,
    title: '$2M Production Liability Protection',
    description:
      'Every confirmed reservation automatically carries primary general liability coverage protecting studio architecture and third-party claims.',
  },
  {
    icon: UserCheck,
    title: 'Verified Profiles & Crew Identity',
    description:
      'Hosts and booking producers complete identity verification and review history checks prior to high-value stage bookings.',
  },
  {
    icon: Lock,
    title: 'Equipment Safety & Escrow Deposits',
    description:
      'Refundable security deposits are held cleanly in escrow and released within 48 hours of wrap inspection with transparent itemized records.',
  },
  {
    icon: Headphones,
    title: '24/7 Live Production Desk',
    description:
      'Early 5:00 AM load-in or midnight overtime? Our production specialists resolve access, power, or schedule adjustments around the clock.',
  },
];

export const TESTIMONIALS = [
  {
    quote:
      'We moved our quarterly footwear lookbooks onto StudioSpace and cut location scouting time from four days to twenty minutes. Every breaker map and cyc measurement matched reality.',
    author: 'Hannah Sato',
    role: 'Executive Producer, Northbound Studio',
  },
  {
    quote:
      'Listing our off-peak tracking days covered 65% of our studio lease within three months, and double-booking conflict protection keeps our engineer calendar completely clean.',
    author: 'Marcus Thorne',
    role: 'Owner, Redhook Analog Sound',
  },
];
