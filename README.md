# Minimal Portfolio & Blog Blueprint

View the live demo at [https://anik3t.dev/](https://anik3t.dev)

## System Overview
A high-performance personal developer portfolio and markdown blogging platform built with Next.js 16 (App Router), React 19, Tailwind CSS, Radix UI primitives, and Framer Motion. Serves as a public showcase for software engineering skills, career experience, open-source contributions, and technical writing.

## Subdirectories & System Boundaries
- [app](./app/README.md): Next.js App Router core orchestrating application shell, public route groups, sitemaps, and serverless API handlers.
- [components](./components/README.md): Modular component library containing UI primitives, layout headers/footers, and domain views.
- [config](./config/README.md): Static configuration single-source-of-truth for site metadata, routes, experience timeline, and project catalog.
- [content/blogs](./content/blogs): Markdown blog articles authored using [SKILL.md](./docs/SKILL.md).
- [hooks](./hooks/README.md): Reusable React client hooks for global modal store and body lock management.
- [lib](./lib/README.md): Markdown processing pipeline (Remark/Gray-Matter) and styling utilities.
- [providers](./providers/README.md): Client-side hydration wrappers for modal dialogs and animation contexts.

## Global Invariants
- Content-Driven Blogs: Blog posts are authored as static Markdown files under `content/blogs/` and parsed at build time.
- Zero External Database: Architecture relies entirely on static configuration objects and markdown file parsing with no persistent database dependency.
- Client/Server Separation: Server Components are utilized by default; interactive components explicitly declare `"use client"` and isolate browser-only APIs.

## Global Side Effects
- Outbound contact submissions forward user inputs to external Google Form webhooks (`app/api/contact/route.ts`).
- Periodic GitHub API requests to fetch repository star counts with ISR caching (`app/api/github-stars/route.ts`).
- Client telemetry dispatched to Vercel Analytics.

## System Verification
- Run: `npm run build`
- Run: `npm run lint`
