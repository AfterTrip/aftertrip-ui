# AfterTrip UI

AfterTrip is a travel web app for publishing real trip journeys, exploring community trips, bookmarking and liking trips, viewing shareable trip detail pages, and sharing public traveler profiles with travel footprint maps.

This repository contains the Next.js frontend for the AfterTrip app.

## Stack

- Next.js App Router
- React 19
- TypeScript
- Tailwind CSS v4 with app-level CSS tokens
- Mapbox GL for travel footprint maps
- Google Identity Services for authentication
- Vitest, React Testing Library, ESLint, and Playwright

## Requirements

- Node.js compatible with Next.js 16
- pnpm 11
- A running AfterTrip API service
- Google OAuth web client ID
- Mapbox public token

## Environment Variables

Copy `.env.example` to `.env.local` for local development.

```bash
cp .env.example .env.local
```

Set these values:

```env
NEXT_PUBLIC_API_BASE_URL=http://localhost:8080
NEXT_PUBLIC_GOOGLE_CLIENT_ID=replace-with-google-web-client-id.apps.googleusercontent.com
NEXT_PUBLIC_MAPBOX_TOKEN=replace-with-mapbox-public-token
```

For Vercel production, set the same variables in the Vercel project settings:

- `NEXT_PUBLIC_API_BASE_URL`: production API base URL, for example `https://api.after-trip.com`
- `NEXT_PUBLIC_GOOGLE_CLIENT_ID`: Google OAuth web client ID
- `NEXT_PUBLIC_MAPBOX_TOKEN`: Mapbox public access token

## Local Development

```bash
pnpm install
pnpm dev
```

Open `http://localhost:3000`.

The app proxies frontend `/api/v1/*` requests to `NEXT_PUBLIC_API_BASE_URL` through `next.config.ts`.

## Quality Checks

Run these before merging or deploying a release branch:

```bash
pnpm lint
pnpm typecheck
pnpm test
pnpm build
```

Optional browser tests:

```bash
pnpm test:e2e
```

## Main App Areas

- `/` landing page
- `/explore` trip discovery
- `/trips/[slug]` shareable trip detail pages
- `/travelers/[slug]` shareable public profile pages
- `/login` and `/signup` Google sign-in entry points
- `/dashboard` my trips and drafts
- `/dashboard/create-trip` publish/edit trip journey flow
- `/dashboard/bookmarks` saved trips
- `/dashboard/travel-footprint` signed-in travel footprint
- `/dashboard/edit-profile` profile settings

## Release Notes

Use `release/v1.0.0` for the first production release candidate. Before deploying, confirm:

- Vercel environment variables are set for Production and Preview.
- Google OAuth authorized JavaScript origins include the production domain.
- Google OAuth authorized redirect/origin settings include Vercel preview URLs if previews are tested with auth.
- Mapbox token is allowed for the production domain.
- The backend CORS allowlist includes the production frontend domain.
- Legal, support email, and public metadata are correct.

See `docs/RELEASE_CHECKLIST.md` for a final release checklist.
