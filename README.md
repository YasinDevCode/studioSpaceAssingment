# StudioSpace — Peer-to-Peer Creative Workspace & Production Studio Sharing Platform

**Live Application URL:** Deployed on Cloud Run / AI Studio Hosting (runs on port `3000`)

StudioSpace is a full-stack peer-to-peer marketplace engineered for filmmakers, photographers, podcasters, musicians, and visual artists. Studio hosts list architectural production workspaces with transparent hourly rates and equipment inventories, while creators inspect live confirmed availability, book shoot hours without collisions, and download itemized PDF production invoices.

## Core Features

- **Dynamic Studio Discovery & Filtering:** Interactive Swiper.js hero showcase, dynamic top-6 featured studios grid, category pre-selection (`Photo Studio`, `Film Stage`, `Podcast Lounge`, `Music Suite`, `Art Workshop`), live search, rate ceiling filter, and sorting.
- **Full Studio CRUD & Image Uploading:** Authenticated hosts can create (`/add-studio`), inspect (`/studios/:id`), update (`/studios/edit/:id`), and delete (`/my-listings`) production studio listings with direct image uploads (ImgBB API integration with automatic local `/uploads` fallback) and custom confirmation modals.
- **HTTPOnly JWT Cookie Authentication (Challenge 1):** Server-side mutations (`POST /api/studios`, `PUT/PATCH /api/studios/:id`, `DELETE /api/studios/:id`, `POST /api/bookings`, `PATCH /api/bookings/:id/status`) are protected by signed JWTs stored exclusively in `HttpOnly` cookies, returning `401 Unauthorized` to unauthenticated callers and preserving sessions cleanly across browser reloads on private routes.
- **Server-Side Double-Booking Prevention (Challenge 2):** Every booking submission and host confirmation verifies time-interval overlap (`startHour < requestedEnd && endHour > requestedStart`) against existing `Confirmed` reservations for that studio and date, rejecting collisions with `409 Conflict` and a descriptive error banner.
- **Full Light / Dark Theme System (Challenge 3):** Persistent Light and Dark mode switching across every page, card, modal, form, and toast notification via Tailwind CSS v4 `@custom-variant dark`.
- **PDF Booking Invoice Generator & Saved Studios Wishlist (Bonus Features):** Confirmed and completed studio bookings include one-click downloadable PDF receipts generated with `jsPDF`, and logged-in creators can bookmark favorite studios via the heart toggle persisted on the backend.

## Tech Stack

- **Frontend:** React 19, TypeScript, Vite, Tailwind CSS v4, React Router v7, Swiper.js, Sonner Toasts, Lucide Icons, jsPDF
- **Backend:** Express.js, TypeScript, `jsonwebtoken`, `cookie-parser`, `bcryptjs`, `multer`, `better-sqlite3`

## Examiner Test Credentials

| Account | Email | Password | Included Demo Data |
| --- | --- | --- | --- |
| **Examiner Creator & Host** | `alex@studiospace.io` | `Studio123!` | Owns 2 studios (`Crosby White Cyclorama Studio`, `Oak & Brass Broadcast Lounge`), has 1 `Confirmed` booking (PDF Invoice + Double-Booking test ready), 1 `Pending` booking (Cancel Booking test ready), and 1 incoming host request |
| **Secondary Studio Host** | `maya@studiospace.io` | `Studio123!` | Owns 6 featured production studios across NYC, LA, Nashville, and SF |

> **Testing Double-Booking Prevention (Challenge 2):** Open **Mercer Street Daylight Loft** (`/studios/std_mercer_daylight_loft`), click **Book Workspace Now**, and submit a reservation overlapping the displayed Confirmed window (default date +2 days, `10:00 AM – 2:00 PM`). The backend immediately rejects the collision with HTTP `409 Conflict`.

## Local Setup

1. Install dependencies:
   ```bash
   npm install
   ```
2. Copy `.env.example` to `.env` and optionally configure `JWT_SECRET` and `IMGBB_API_KEY`.
3. Start the full-stack development server (Express API + Vite on `http://localhost:3000`):
   ```bash
   npm run dev
   ```
4. Build for production:
   ```bash
   npm run build
   ```
