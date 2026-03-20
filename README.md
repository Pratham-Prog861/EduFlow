# EduFlow

A modern, AI-powered LMS platform where instructors can create and publish courses, and students can enroll, learn, and track progress in a clean dashboard experience.

## What This Project Includes

- Role-based app flows for `student` and `instructor`
- Clerk authentication + Convex user sync
- Instructor course builder:
  - Create/edit courses
  - Upload thumbnails and lecture videos
  - Organize content (sections + lectures)
  - Publish/unpublish courses
- Student learning flow:
  - Browse published courses
  - Enroll in courses
  - Continue learning with lecture-level progress
  - Course completion state
- AI course summary support (Gemini integration)
- Premium landing page with testimonials, FAQ, and animated section reveals

## Tech Stack

- Framework: Next.js (App Router), React, TypeScript
- Backend: Convex (database, queries, mutations, realtime)
- Auth: Clerk
- Media Uploads: Cloudinary Upload Widget (thumbnails + videos)
- AI: Google Gemini API
- Styling/UI: Tailwind CSS, shadcn/ui, Lucide Icons
- Notifications: Sonner

## Project Structure (High-Level)

- `app/` - Next.js app routes (public, auth, student dashboard, instructor dashboard)
- `components/` - shared UI, layout, course/player components
- `features/` - feature-level hooks/actions/components
- `convex/` - schema, queries, mutations, auth config
- `lib/` - service integrations and helpers

## Environment Variables

Create `.env.local` in project root:

```bash
# Convex
NEXT_PUBLIC_CONVEX_URL=

# Clerk
NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY=
CLERK_SECRET_KEY=
CLERK_JWT_ISSUER_DOMAIN=

# Cloudinary
NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME=
NEXT_PUBLIC_CLOUDINARY_UPLOAD_PRESET=

# Gemini
GEMINI_API_KEY=
NEXT_PUBLIC_GEMINI_API_KEY=
```

Notes:

- `GEMINI_API_KEY` is used in Convex server functions.
- `NEXT_PUBLIC_GEMINI_API_KEY` is used by client-side helpers currently in this project.

## Getting Started

1. Install dependencies:

```bash
npm install
```

2. Start Convex dev backend:

```bash
npx convex dev
```

3. In another terminal, start Next.js:

```bash
npm run dev:frontend
```

Or run both together:

```bash
npm run dev
```

## Available Scripts

- `npm run dev` - run frontend + Convex in parallel
- `npm run dev:frontend` - run Next.js dev server
- `npm run dev:backend` - run Convex dev
- `npm run build` - production build
- `npm run start` - run production server
- `npm run lint` - lint project

## Auth + Roles

- User login/signup is handled by Clerk.
- Convex stores user profile and role (`student` or `instructor`) in `users` table.
- Dashboard routing and UI actions are role-aware.

## Media Uploads

- Thumbnail and lecture video uploads are handled through Cloudinary upload widget.
- Ensure Cloudinary env vars are set before testing uploads.

## License

This project is licensed under the MIT License. See [LICENSE](LICENSE).
