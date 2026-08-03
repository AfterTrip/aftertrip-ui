# AfterTrip UI

Production-quality frontend foundation for the AfterTrip landing page.

## Stack

- Next.js App Router
- TypeScript strict mode
- Tailwind CSS v4
- React Server Components by default
- Lucide React icons
- Radix Dialog for the accessible mobile menu
- Vitest, React Testing Library, and Playwright

## Setup

```bash
pnpm install
pnpm dev
```

Open `http://localhost:3000`.

## Quality Commands

```bash
pnpm lint
pnpm typecheck
pnpm test
pnpm test:e2e
pnpm build
```

## Architecture

Landing content is composed from typed mock data in `src/data`, small Server Components in `src/components/landing`, and isolated Client Components for interactions that need browser state: mobile navigation and the mock search controls.

Design tokens live in `src/styles/tokens.css` and are consumed by `src/app/globals.css`. Local photography-style placeholder assets are stored in `public/images` and can be replaced with final licensed photography without changing component structure.
