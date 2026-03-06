# PPC United — Admin Panel Implementation Guide
> Multi-Agent Cursor Instructions | Next.js 14 App Router

---

## Project Overview

**Company:** PPC United  
**Industry:** MEP (Mechanical, Electrical, Plumbing) & Finishing — Saudi Arabia  
**Stack:** Next.js 14 (App Router), Prisma ORM, PostgreSQL, NextAuth.js, Tailwind CSS, GSAP 
**Goal:** Refactor the existing file structure into two route groups — `(public)` and `(admin)` — and build a fully protected admin panel with CRUD modules for Projects, News, and Users.

---

## Design & Style Instructions

Before writing any UI code, thoroughly read through all existing components in the `components/` directory — especially `Header.js`, `Hero.js`, `Footer.js`, `Services.js`, and `globals.css`. Extract and internalize the PPC United visual identity: color palette, typography, spacing rhythm, button styles, card styles, and any animation or transition patterns already in use.

The admin panel must feel like a natural, consistent extension of the same brand — not a generic dashboard template pasted on top. Apply the same primary and accent colors, the same font family and weight hierarchy, and the same overall design tone. Buttons, inputs, badges, and table elements should reflect the existing design language.

The login page in particular must carry the PPC United brand prominently — use the logo, brand colors, and a clean centered layout that matches the professionalism of the public site.

All UI text, labels, and form fields in the admin panel are in **English only**.

---

## Target File Structure

```
app/
├── (public)/                        # Public-facing website
│   ├── layout.js
│   ├── page.js                      # Home page
│   ├── about/
│   │   └── page.js
│   ├── contact/
│   │   └── page.js
│   └── projects/
│       └── page.js
│
├── (admin)/                         # Admin panel (protected)
│   ├── layout.js                    # Admin shell: sidebar + topbar
│   └── admin/
│       ├── page.js                  # Dashboard with stats
│       ├── projects/
│       │   ├── page.js              # List all projects
│       │   ├── new/
│       │   │   └── page.js          # Create new project
│       │   └── [id]/
│       │       └── edit/
│       │           └── page.js      # Edit existing project
│       ├── news/
│       │   ├── page.js              # List all news articles
│       │   ├── new/
│       │   │   └── page.js          # Create new article
│       │   └── [id]/
│       │       └── edit/
│       │           └── page.js      # Edit existing article
│       └── users/
│           ├── page.js              # List all users
│           ├── new/
│           │   └── page.js          # Create new user
│           └── [id]/
│               └── edit/
│                   └── page.js      # Edit existing user
│
├── login/
│   └── page.js                      # Login page (branded)
│
├── api/
│   ├── auth/
│   │   └── [...nextauth]/
│   │       └── route.js             # NextAuth handler
│   ├── projects/
│   │   ├── route.js                 # GET all, POST
│   │   └── [id]/
│   │       └── route.js             # GET one, PUT, DELETE
│   ├── news/
│   │   ├── route.js
│   │   └── [id]/
│   │       └── route.js
│   └── users/
│       ├── route.js
│       └── [id]/
│           └── route.js
│
├── globals.css
└── layout.js                        # Root layout

components/
├── admin/
│   ├── AdminSidebar.js
│   ├── AdminHeader.js
│   ├── DeleteButton.js
│   └── forms/
│       ├── ProjectForm.js
│       ├── NewsForm.js
│       └── UserForm.js
├── AboutTeaser.js                   # Existing public components — do not modify
├── ClientsPartners.js
├── Clouds.js
├── ContactForm.js
├── Footer.js
├── GetInTouch.js
├── Header.js
├── Hero.js
├── HorizontalTimeline.js
├── LatestProjects.js
├── MediaNews.js
├── Services.js
└── SmoothScrollProvider.js

lib/
├── auth.js                          # NextAuth config & options
├── prisma.js                        # Prisma client singleton
└── utils.js

prisma/
├── schema.prisma
└── migrations/

middleware.js                        # Route protection (project root)
```

---

## Phase 1 — Dependencies & Database Setup

Install the required packages: `next-auth`, `@prisma/client`, `prisma`, and `bcryptjs`. Initialize Prisma with `npx prisma init`.

Configure `.env.local` with the PostgreSQL `DATABASE_URL`, `NEXTAUTH_URL` set to `http://localhost:3000`, and a `NEXTAUTH_SECRET` generated via `openssl rand -base64 32`.

### Database Models

Define the following models in `prisma/schema.prisma`:

**User**  
Fields: `id`, `name`, `email` (unique), `password` (hashed), `role` (enum: `ADMIN` or `SUPER_ADMIN`), `createdAt`, `updatedAt`.

**Project**  
Fields: `id`, `title`, `description`, `category`, `location`, `imageUrl`, `images` (string array), `status` (enum: `ACTIVE`, `COMPLETED`, `UPCOMING`), `completedAt` (optional), `createdAt`, `updatedAt`.

**News**  
Fields: `id`, `title`, `content`, `excerpt` (optional), `imageUrl` (optional), `slug` (unique), `published` (boolean, default false), `publishedAt` (optional), `createdAt`, `updatedAt`.

After writing the schema, run `npx prisma migrate dev --name init` followed by `npx prisma generate`.

### Seed Script

Create `prisma/seed.js` to insert the first `SUPER_ADMIN` user with a bcrypt-hashed password. Register the seed command in `package.json` under the `prisma` key and run it with `npx prisma db seed`.

---

## Phase 2 — Authentication & Authorization

### NextAuth Setup

Configure NextAuth in `lib/auth.js` using the Credentials provider. The `authorize` function should look up the user by email via Prisma, compare the submitted password against the stored hash using bcrypt, and return the user object (including `role` and `id`) on success or `null` on failure.

Add `jwt` and `session` callbacks to forward the user's `id` and `role` into the session token, making `session.user.role` available in server components.

Set the custom sign-in page to `/login` and use the `jwt` session strategy.

Create the NextAuth API handler at `app/api/auth/[...nextauth]/route.js`.

Create a Prisma singleton at `lib/prisma.js` to avoid multiple client instances during development hot reloads.

### Middleware

Create `middleware.js` at the project root using NextAuth's `withAuth` helper. Protect all routes matching `/admin/:path*`. Any request without a valid session, or with a role other than `ADMIN` or `SUPER_ADMIN`, must be redirected to `/login`.

### Login Page

Build `app/login/page.js` as a client component. Use `signIn('credentials', { redirect: false })` from NextAuth, display an inline error message on failure, and redirect to `/admin` on success. The page must reflect the PPC United brand — logo, colors, and typography drawn from the existing public components and `globals.css`.

---

## Phase 3 — Route Group Refactor

Move the existing pages (`page.js`, `about/`, `contact/`, `projects/`) into `app/(public)/`. Create `app/(public)/layout.js` to wrap children with the existing `Header`, `Footer`, and `SmoothScrollProvider` components exactly as before. Do not modify any existing component files.

Create `app/(admin)/layout.js` as an async server component. Verify the session using `getServerSession` and redirect to `/login` if unauthenticated. Render `AdminSidebar` and `AdminHeader` as the persistent shell around all admin pages.

---

## Phase 4 — Projects CRUD Module

### API Routes

`app/api/projects/route.js` handles `GET` (return all projects ordered by newest first) and `POST` (create a project, requires an authenticated session).

`app/api/projects/[id]/route.js` handles `GET` (single project by ID), `PUT` (update, requires session), and `DELETE` (remove, requires session).

### Admin Pages

`app/(admin)/admin/projects/page.js` — server component. Fetches all projects from Prisma and renders a data table. Columns: Title, Category, Location, Status (colored badge), Created date, and Actions (Edit link + Delete button). Include a "New Project" button linking to `/admin/projects/new`.

`app/(admin)/admin/projects/new/page.js` — renders `ProjectForm` with no initial data.

`app/(admin)/admin/projects/[id]/edit/page.js` — fetches the project by ID, calls `notFound()` if missing, and renders `ProjectForm` with the project data passed as `initialData`.

### ProjectForm Component

`components/admin/forms/ProjectForm.js` — client component. Calls `POST /api/projects` on create or `PUT /api/projects/:id` on edit, then redirects to `/admin/projects` on success. Show a loading state on the submit button during the request.

Fields:

| Field | Type | Notes |
|-------|------|-------|
| `title` | text | Required |
| `description` | textarea | Required |
| `category` | select | MEP, Finishing, Civil |
| `location` | text | Required |
| `status` | select | Active, Completed, Upcoming |
| `imageUrl` | text | Main image URL |
| `completedAt` | date | Optional; show only when status is Completed |

---

## Phase 5 — News CRUD Module

### API Routes

`app/api/news/route.js` handles `GET` (all articles, newest first) and `POST` (create article, requires session). Auto-generate the `slug` from the title if none is provided — lowercase, spaces replaced with hyphens, special characters removed.

`app/api/news/[id]/route.js` handles `GET`, `PUT`, and `DELETE` following the same pattern as the Projects module.

### Admin Pages

`app/(admin)/admin/news/page.js` — lists all news articles in a table. Columns: Title, Published (badge), Published date, Created date, Actions.

`app/(admin)/admin/news/new/page.js` — renders `NewsForm` with no initial data.

`app/(admin)/admin/news/[id]/edit/page.js` — fetches the article by ID and renders `NewsForm` with `initialData`.

### NewsForm Component

`components/admin/forms/NewsForm.js` — client component, same submit pattern as `ProjectForm`.

Fields:

| Field | Type | Notes |
|-------|------|-------|
| `title` | text | Required; slug auto-generated from this |
| `slug` | text | Auto-filled but editable |
| `excerpt` | textarea | Short summary for listing pages |
| `content` | textarea | Full article body |
| `imageUrl` | text | Featured image URL |
| `published` | checkbox | Toggle to publish or unpublish |

---

## Phase 6 — User Management CRUD

### API Routes

`app/api/users/route.js` handles `GET` (all users — never return the `password` field) and `POST` (create user with bcrypt-hashed password, requires session).

`app/api/users/[id]/route.js` handles `PUT` (update user — only re-hash and update the password if a new one was submitted; otherwise omit it from the update data) and `DELETE` (remove user — reject with a 400 error if the requesting user is trying to delete their own account).

### Admin Pages

`app/(admin)/admin/users/page.js` — lists all users. Columns: Name, Email, Role (badge), Created date, Actions.

`app/(admin)/admin/users/new/page.js` — renders `UserForm` with no initial data.

`app/(admin)/admin/users/[id]/edit/page.js` — fetches the user by ID and renders `UserForm` with `initialData`.

### UserForm Component

`components/admin/forms/UserForm.js` — client component.

Fields:

| Field | Type | Notes |
|-------|------|-------|
| `name` | text | Required |
| `email` | email | Required, must be unique |
| `password` | password | Required on create; leave blank on edit to keep existing password |
| `role` | select | Admin, Super Admin |

---

## Phase 7 — Shared Admin Components

### AdminSidebar

`components/admin/AdminSidebar.js` — client component. Vertical navigation with links to Dashboard, Projects, News, and Users. Use `usePathname` to highlight the active link. Style using the PPC United brand colors from the public site — do not default to generic Tailwind grays.

### AdminHeader

`components/admin/AdminHeader.js` — displays the current section title, the logged-in user's name from the session, and a Sign Out button that calls `signOut()` from NextAuth.

### DeleteButton

`components/admin/DeleteButton.js` — client component. On first click shows an inline "Confirm / Cancel" prompt before making the `DELETE` request. On confirmed deletion, call `router.refresh()` to re-fetch the updated list without a full page reload.

---

## Phase 8 — Admin Dashboard

`app/(admin)/admin/page.js` — server component. Run three parallel Prisma count queries for projects, news, and users and display the results as stat cards. Style the cards using the PPC United brand palette. Optionally display the 5 most recently created projects and news articles in compact preview lists below the stats.

---

## Implementation Checklist

### Foundation
- [ ] Install `next-auth`, `prisma`, `@prisma/client`, `bcryptjs`
- [ ] Configure `.env.local` with `DATABASE_URL`, `NEXTAUTH_URL`, `NEXTAUTH_SECRET`
- [ ] Write `prisma/schema.prisma` with User, Project, News models and enums
- [ ] Run `npx prisma migrate dev --name init` and `npx prisma generate`
- [ ] Create `lib/prisma.js` (singleton client)
- [ ] Create `lib/auth.js` (NextAuth credentials config)
- [ ] Create `app/api/auth/[...nextauth]/route.js`
- [ ] Create `middleware.js` to protect `/admin/*` routes
- [ ] Create `prisma/seed.js` and run `npx prisma db seed`

### Route Structure
- [ ] Move existing pages into `app/(public)/` with a matching public layout
- [ ] Create `app/(admin)/layout.js` with session guard
- [ ] Create `app/login/page.js` with PPC United branding

### Projects Module
- [ ] `app/api/projects/route.js`
- [ ] `app/api/projects/[id]/route.js`
- [ ] `app/(admin)/admin/projects/page.js`
- [ ] `app/(admin)/admin/projects/new/page.js`
- [ ] `app/(admin)/admin/projects/[id]/edit/page.js`
- [ ] `components/admin/forms/ProjectForm.js`

### News Module
- [ ] `app/api/news/route.js`
- [ ] `app/api/news/[id]/route.js`
- [ ] `app/(admin)/admin/news/page.js`
- [ ] `app/(admin)/admin/news/new/page.js`
- [ ] `app/(admin)/admin/news/[id]/edit/page.js`
- [ ] `components/admin/forms/NewsForm.js`

### Users Module
- [ ] `app/api/users/route.js`
- [ ] `app/api/users/[id]/route.js`
- [ ] `app/(admin)/admin/users/page.js`
- [ ] `app/(admin)/admin/users/new/page.js`
- [ ] `app/(admin)/admin/users/[id]/edit/page.js`
- [ ] `components/admin/forms/UserForm.js`

### Shared Admin UI
- [ ] `components/admin/AdminSidebar.js`
- [ ] `components/admin/AdminHeader.js`
- [ ] `components/admin/DeleteButton.js`
- [ ] `app/(admin)/admin/page.js` (dashboard)

### Final Verification
- [ ] Login at `/login` works with seeded credentials
- [ ] Unauthenticated access to `/admin` redirects to `/login`
- [ ] All CRUD operations work correctly for Projects, News, and Users
- [ ] Admin UI visual identity is consistent with the public PPC United website

---

*PPC United — Next.js 14 Admin Panel | Multi-Agent Implementation Guide*
