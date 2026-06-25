# StayFinder — Hotel Booking Platform

A modern hotel booking platform built with Next.js App Router, featuring destination search, advanced filtering, and a premium booking experience.

## Getting Started

### Prerequisites

- Node.js 18.17+
- npm, yarn, pnpm, or bun

### Setup

```bash
npm install
npm run dev
```

Open http://localhost:3000

### Build

```bash
npm run build
npm start
```

### Lint & Test

```bash
npm run lint
npm test
```

---

## Architecture

### App Router (Next.js 16)

The application uses Next.js App Router with a `src/app` directory structure:

- `app/page.tsx` — Homepage with search form and promotional sections
- `app/hotels/page.tsx` — Server component that fetches mock hotel data and passes it to the client listing
- `app/layout.tsx` — Root layout wrapping store providers, theme provider, navbar, and footer

### Server vs Client Components

- **Server Components**: Pages (`page.tsx`) fetch data from external APIs on the server, reducing client bundle size
- **Client Components**: Interactive UI pieces (search form, listing with filters, hotel cards) use `'use client'` directive
- Data flows down: server fetches → server component props → client component state

### External Data Sources

- **Hotels**: `dummyjson.com/products?limit=20` — mapped to a `Hotel` domain model in `src/utils/mappers.ts`
- **Destinations**: `countriesnow.space/api/v0.1/countries` — used to assign realistic city/country destinations and populate the search combobox
- Mock data is intentional; the app is not connected to a real hotel backend

---

## State Management

### Redux Toolkit + redux-persist

Global state is managed via Redux Toolkit with the following slices:

| Slice | Purpose | Persisted |
|-------|---------|-----------|
| `search` | Destination, dates, guest/room counts | No |
| `hotel` | Hotels list, filters, sorting, loading state | No |
| `booking` | Current booking draft, booking history | Yes |
| `ui` | Theme preference (light/dark) | Yes |

**Persistence**: `booking` and `ui` slices are persisted to `localStorage` via redux-persist. The `serializableCheck` middleware has specific actions ignored to accommodate date strings and non-serializable values.

### Forms

- `react-hook-form` is used for the search form (client-side validation, destination combobox) and hotel listing filters (price range, rating, sort)
- Active filters in `HotelsListingClient` are managed locally with `useState` (not Global Redux) to avoid excessive re-renders; search pre-fills from the `search` Redux slice

### Animations

- `gsap` is used for entrance animations on the homepage hero elements
- Animations are scoped using `gsap.context()` and cleaned up on unmount

---

## Component Structure

```
src/components/
├── home/             — Search form, hero sections, testimonials, stats
├── hotels/           — Listing, filters, price slider, skeleton loaders
├── features/         — HotelCard (shared between home and listings)
├── layout/           — Navbar, Footer
├── ui/               — Reusable UI (MapPreviewCard, QuickFilterTags, UrgencyBadge)
├── ThemeProvider.tsx — Dark mode class toggling
```

---

## Key Features

- **Destination combobox**: debounced, keyboard-accessible, fetches 500+ cities from the countries API
- **Hotel filtering**: price range (slider), minimum rating, amenity quick tags, text search
- **Sorting**: by price or rating, ascending/descending
- **Pagination**: 6 hotels per page with prev/next and page number buttons
- **Featured deals carousel**: top-rated hotels with horizontal scroll
- **Dark mode**: persisted via Redux
- **Responsive**: mobile-first Tailwind classes, collapsible filters on small screens

---

## Assumptions

1. **No real backend**: Data is sourced from public mock APIs; there is no authentication, booking persistence to a server, or payment processing
2. **Hotel model**: `Product` from dummyjson is mapped to a `Hotel` shape; images fall back to thumbnails, locations fall back to a hardcoded city list if the countries API fails
3. **Availability**: `stock` field from the mock API is repurposed as `availableRooms`; actual room inventory logic is not implemented
4. **Booking state**: `currentBooking` and `bookings` live in Redux and are persisted, but no booking flow UI is fully wired up beyond data storage
5. **Webpack**: `next dev --webpack` is used (instead of Turbopack) to ensure compatibility with `redux-persist` browser storage in the dev environment
