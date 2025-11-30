# Next.js + shadcn boilerplate

Opinionated starter using the Next.js App Router, shadcn/ui primitives, React Query, and a demo auth flow with persistent sessions.

## Stack
- Next.js 15 (App Router) with React 19 and TypeScript
- Tailwind CSS 4 (`@tailwindcss/postcss`) with `tw-animate-css`
- shadcn/ui (New York style) with `class-variance-authority` and `tailwind-merge`
- React Query (`@tanstack/react-query`) for data fetching/caching
- React Hook Form + Zod + `@hookform/resolvers` for form handling/validation
- Axios-based API client with auth header injection and param cleaning
- Icons via `lucide-react`

## Architecture
- `src/app` – App Router entries. `auth` routes use `AuthLayout` to redirect authenticated users away; `(dashboard)` group uses `DashboardLayout` to guard access and redirect to login.
- `src/store/index.tsx` – wraps the app with `QueryClientProvider` and `AuthProvider`.
- `src/store/AuthProvider.tsx` – client-side auth state with encrypted localStorage persistence and login/logout helpers exposed through `useAuth`.
- `src/lib/api-client.ts` – shared Axios client that injects the stored token and normalizes request params.
- `src/utils` – environment helpers and a small XOR-based `LocalStore` encryption wrapper.
- `src/features` – page-level features (auth flows, dashboard UI).
- `src/components` – shadcn/ui button plus shared form primitives used across features.

## Implemented features
- Email/password login powered by React Hook Form + Zod, using React Query mutation to simulate an API call before storing a token/user in localStorage.
- Signup page that provisions a demo token, persists the session, and redirects into the dashboard.
- Protected dashboard that reads the stored user, shows basic session info, and supports logout.
- Gradient-backed auth and dashboard screens styled with Tailwind CSS 4 and Geist fonts.

## Ready-made components
- `src/components/ui/button.tsx` – shadcn-style button with variants and sizes.
- `src/components/shared/form/TextInput.tsx` – text input with label, helper, and error states.
- `src/components/shared/form/PasswordInput.tsx` – password field with show/hide toggle.
- `src/components/shared/form/PhoneInput.tsx` – tel-optimized input.
- `src/components/shared/form/TextAreaInput.tsx` – textarea with label and validation messaging.

## Environment variables
Set these in `.env.local` (or pass them at runtime):
- `NEXT_PUBLIC_API_BASE_URL` – base URL for the Axios client.
- `NEXT_PUBLIC_ENCRYPTION_KEY` – key used by `LocalStore` to encrypt auth data (defaults to `xanadu-lms-encryption-key` for local development).

## Getting started (local)
```bash
yarn install
yarn dev
# open http://localhost:3000
```

Available scripts:
- `yarn dev` – start the Next.js dev server
- `yarn build` – production build
- `yarn start` – run the built app
- `yarn lint` – lint with ESLint
- `yarn format` / `yarn format:check` – format with Prettier

## Docker
Build and run the production image:
```bash
docker build -t nextjs-shadcn .
docker run -p 3000:3000 --env-file .env.local nextjs-shadcn
# open http://localhost:3000
```

The image uses a multi-stage build (`Dockerfile`) on `node:20-alpine`, installs dependencies with Yarn, builds the Next.js app, installs production dependencies in the final stage, and serves with `yarn start`.
