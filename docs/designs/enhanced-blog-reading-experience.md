# Enhanced Technical Blog Reading Experience

* **Author:** Aniket Das
* **Status:** Approved
* **Date:** 2026-10-27

---

## Overview

This specification establishes an accessible, high-performance reading layout and presentation pipeline for technical blog posts hosted on the portfolio (`app/(root)/blogs/[slug]/page.tsx`). The system optimizes content delivery for technical recruiters seeking rapid scannability and engineers inspecting code snippets, while maintaining a server-rendered foundation with zero client-side syntax tokenization libraries.

## Problem Statement

The blog reader renders raw markdown via `remark-html` into a single 768px (`max-w-3xl`) text column with static styling:
1. **Missing Section Navigation**: Long technical articles lack an automated table of contents, requiring readers to manually scroll through long documents to locate architectural solutions.
2. **Unstyled Code Blocks and Manual Copying**: Code blocks lack syntax highlighting themes, language identification badges, and keyboard-accessible copy buttons. Readers must manually select text, which frequently captures extraneous indentation and whitespace.
3. **Indistinguishable Callouts**: Critical architectural warnings, tips, and notes render as standard blockquotes with identical visual styling, making them difficult to distinguish from quoted excerpts.
4. **Legacy In-Content Anchors**: Existing posts in `content/blogs/` contain manually authored TOC sections and hardcoded `<a id="...">` anchors. Automated TOC generation must preserve existing heading IDs and anchor targets to prevent broken deep links.

## Goals & Non-Goals

### Goals

* **G-1 (Scannable Navigation)**: Provide a sticky desktop Table of Contents (TOC) with scroll-spy active section tracking and an accessible mobile collapsible accordion using the portfolio's Radix accordion primitive, maintaining zero Cumulative Layout Shift (CLS < 0.01).
* **G-2 (Server-Side Syntax Highlighting)**: Pre-render code block tokens and language badges at build time using `remark-prism` with CSS variables mapped to existing portfolio themes, shipping zero runtime syntax parsers to the client.
* **G-3 (Accessible Code Interaction)**: Provide keyboard-navigable (`:focus-visible`), screen-reader-announced copy-to-clipboard buttons on all code blocks using event delegation, reading clean text directly from the DOM without attribute serialization.
* **G-4 (Standardized Callouts)**: Transform GitHub-Flavored Markdown alerts (`> [!NOTE]`, `> [!TIP]`, `> [!WARNING]`) and existing emoji-prefixed blockquotes into accessible callout containers with left accent borders and background tints.
* **G-5 (Backward Compatibility)**: Ensure all existing posts in `content/blogs/` compile without errors, aliasing `#table-of-contents` on the dynamic TOC container to preserve legacy back-to-top links.

### Non-Goals

* **NG-1 (No Full MDX Migration)**: Compiling posts via `@next/mdx` or `next-mdx-remote` is out of scope; parsing remains a deterministic build-time Remark pipeline.
* **NG-2 (No Client-Side Highlighting)**: Client-side Prism/Highlight.js/Shiki bundles are excluded from client bundles.
* **NG-3 (No Interactive Code Playgrounds)**: Browser-based code sandboxes, REPLs, or dynamic execution widgets are excluded.
* **NG-4 (No Third-Party Comment Systems)**: Discussion widgets (Giscus, Disqus) are excluded.
* **NG-5 (No Redundant Progress Bars)**: Dedicated reading progress bars are omitted; scroll progress is communicated cleanly via active TOC highlight states.

## Critical User Journeys (CUJs)

### CUJ 1: Document Scan and Navigation
* **Given**: A technical recruiter or engineer opens a blog link (e.g., `/blogs/debugging-multi-threaded-java-applications`).
* **When**: The page loads on desktop or mobile.
* **Then**: The reader sees the post title, reading time, and tags above the fold. On desktop (≥1024px), a sticky sidebar rail displays the Table of Contents with the active section highlighted as they scroll. On mobile (<1024px), a collapsible accordion above the article provides section jumps.

### CUJ 2: Software Engineer Code Inspection & Copy
* **Given**: A developer navigates to a technical implementation snippet.
* **When**: They navigate to a code block via mouse or keyboard `Tab` and press the Copy button (or Enter on focus).
* **Then**: The unescaped code text is written to `navigator.clipboard`, a visual checkmark feedback state displays for 2 seconds, and a polite screen-reader announcement confirms success.

### CUJ 3: Author Markdown Publishing
* **Given**: The site author adds a new `.md` file to `content/blogs/` using standard Markdown and optional `> [!NOTE]` alerts.
* **When**: Next.js runs static site generation (`npm run build`).
* **Then**: The post automatically pre-renders with heading slug IDs, TOC hierarchy, syntax-highlighted blocks, and OpenGraph metadata without requiring manual HTML anchors.

## Proposed Architecture

### 1. System Architecture & Rendering Boundary

All Markdown AST processing executes strictly on the server during Next.js Static Site Generation (SSG). The output HTML rendered by `BlogPostPage` arrives in the browser pre-tokenized, pre-slugged, and structured. Interactive functionality is limited to two isolated client components (`DesktopTableOfContents`, `MobileTableOfContents`) and a single event delegation wrapper (`BlogArticleWrapper`).

```text
Build Time (SSG / Server)
┌─────────────────────────────────────────────────────────────────────────────┐
│ content/blogs/*.md (Clean Markdown, manual TOC sections pruned)            │
│         │                                                                   │
│         ▼                                                                   │
│ lib/blogs.ts (Remark Pipeline)                                              │
│   ├── gray-matter (Frontmatter parsing)                                     │
│   ├── remark-gfm (Tables, tasklists, autolinks)                             │
│   ├── remarkCodeBlockChrome (AST visitor injecting header & copy button)    │
│   ├── remarkHeadingExtractor (Extracts h2/h3 to post.toc, injects slug IDs) │
│   ├── remarkAlertTransformer (Transforms GFM alerts & emojis to callouts)   │
│   ├── remark-prism (Build-time syntax tokenization)                         │
│   └── remark-html ({ sanitize: false })                                     │
└─────────────────────────────────────────────────────────────────────────────┘
          │
          ▼ Returns { ...post, toc: TocItem[], contentHtml: string }
Client Hydration (Runtime)
┌─────────────────────────────────────────────────────────────────────────────┐
│ app/(root)/blogs/[slug]/page.tsx (Server Component Layout)                  │
│   │                                                                         │
│   ├── Post Header (Breadcrumb, Tags, H1, Author, Date, Reading Time)        │
│   │                                                                         │
│   ├── MobileTableOfContents (lg:hidden)                                     │
│   │     └── Built with @/components/ui/accordion                            │
│   │                                                                         │
│   └── 2-Column Grid (lg:grid lg:grid-cols-[minmax(0,1fr)_260px] gap-12)     │
│         ├── Left Column: BlogArticleWrapper (Client Event Delegation)       │
│         │     ├── <section dangerouslySetInnerHTML={{ __html }} />          │
│         │     └── Delegated Click Listener (reads code.textContent directly)│
│         │                                                                   │
│         └── Right Column: DesktopTableOfContents (hidden lg:block)          │
│               └── Sticky sidebar rail (IntersectionObserver scroll-spy)     │
└─────────────────────────────────────────────────────────────────────────────┘
```

### 2. Component Design & Responsibilities

#### A. Data Layer (`lib/blogs.ts`)

* **Heading & TOC Extraction**:
  * Traverses AST to extract `h2` and `h3` nodes.
  * Formats slug IDs using `github-slugger`.
  * If a heading node contains an inline `<a id="...">` anchor tag, the existing ID is assigned to the parent heading and the manual `<a id="...">` tag is removed from AST children to prevent duplicate DOM IDs.
  * Injects `id` into `node.data.hProperties.id`.
  * Populates `BlogPost.toc`:
    ```typescript
    export interface TocItem {
      id: string;
      text: string;
      level: 2 | 3;
    }
    ```
* **Code Block Chrome Visitor**:
  * A custom Remark AST visitor function executed before `remark-prism`.
  * Transforms mdast `code` nodes into a wrapped structure containing the `.code-header`, language label, and copy button.
  * Avoids serializing raw code into HTML `data-code` attributes; the client reads clean code directly from `pre > code` text content.
* **Alert & Callout Transformer**:
  * Transforms blockquotes starting with GFM alert identifiers (`[!NOTE]`, `[!TIP]`, `[!WARNING]`, `[!IMPORTANT]`) or recognized emojis (`💡`, `⚠️`, `🧠`, `✅`) into `<div class="callout callout-<type>" role="note">` containers with decorative SVGs (`aria-hidden="true"`).

#### B. Presentation Layer (`components/blogs/`)

* **`desktop-table-of-contents.tsx`** (`"use client"`):
  * Mounted in the sticky right sidebar track (`sticky top-24 max-h-[calc(100vh-7rem)] overflow-y-auto`).
  * Tracks the active heading using a stateful `IntersectionObserver` observing heading IDs.
  * Highlights active item with an accent background indicator.
  * Returns `null` if `toc.length === 0`.
* **`mobile-table-of-contents.tsx`** (`"use client"`):
  * Positioned above the article body on viewports `< 1024px` (`lg:hidden`).
  * Reuses `@/components/ui/accordion` (`Accordion`, `AccordionItem`, `AccordionTrigger`, `AccordionContent`) for accessible keyboard navigation and animated disclosure.
  * Returns `null` if `toc.length === 0`.
* **`blog-article-wrapper.tsx`** (`"use client"`):
  * Wraps the article body HTML.
  * Attaches a single delegated click listener listening for `[data-copy-code="true"]`.
  * Reads unescaped text content directly:
    ```typescript
    const code = button.closest('.code-block-wrapper')?.querySelector('pre > code')?.textContent ?? '';
    ```
  * Copies text to `navigator.clipboard`, provides fallback for older WebViews, manages a 2-second visual `.copied` feedback state with timer clearance, and updates an `aria-live="polite"` element for assistive tech.

#### C. Layout Architecture (`app/(root)/blogs/[slug]/page.tsx`)

* Container: `max-w-6xl mx-auto px-4 sm:px-6 py-8`.
* Conditional Grid:
  * When `post.toc.length > 0`: `grid grid-cols-1 lg:grid-cols-[minmax(0,1fr)_260px] gap-8 lg:gap-12 items-start`.
  * When `post.toc.length === 0`: Falls back to a centered single-column layout (`max-w-3xl mx-auto`) to prevent an empty right gutter.
* Enforces `min-w-0` on the prose column container to prevent preformatted code blocks from expanding the grid track beyond viewport boundaries.
* Sets `scroll-mt-24` on article `h2` and `h3` elements to prevent sticky `SiteHeader` (80px) from obscuring heading titles on anchor jumps.

### 3. File Inventory

| File Path | Action | Description |
| :--- | :--- | :--- |
| `package.json` | **Modify** | Add `github-slugger` and `@types/github-slugger` dependencies. |
| `lib/blogs.ts` | **Modify** | Add heading extraction, code block chrome visitor, callout transformation, and TypeScript interface exports. |
| `app/globals.css` | **Modify** | Add Prism syntax token variables, callout container styles, code block header styles, and `scroll-mt-24` rules. |
| `components/blogs/desktop-table-of-contents.tsx` | **Create** | Client component for desktop sticky sidebar TOC rail. |
| `components/blogs/mobile-table-of-contents.tsx` | **Create** | Client component for mobile collapsible TOC accordion using Radix UI. |
| `components/blogs/blog-article-wrapper.tsx` | **Create** | Client component providing delegated click handling for code copy buttons. |
| `app/(root)/blogs/[slug]/page.tsx` | **Modify** | Integrate responsive 2-column grid, mobile TOC accordion, desktop TOC rail, and article wrapper. |

## Alternatives Considered

### Alternative A: Full MDX Migration (`@next/mdx` or `next-mdx-remote`)
* **Description**: Compiling Markdown posts into full JSX components via MDX.
* **Pros**:
  * Native JSX embedding and custom component usage directly in blog text.
* **Cons**:
  * Adds compile-time dependencies (`@next/mdx`, loader plugins) to the build pipeline.
  * Breaks compilation on existing markdown posts in `content/blogs/` containing raw HTML tags (`<a id="...">`, `<div style="...">`) and inline base64 image strings.
  * Increases client bundle size.
* **Reason for Rejection**: Standard CommonMark parsing with build-time AST transformations satisfies all functional requirements without modifying existing post content.

### Alternative B: Client-Side Syntax Highlighting (Prism.js / Highlight.js in Browser)
* **Description**: Deferring syntax highlighting to client-side runtime scripts.
* **Pros**:
  * Keeps server-side markdown compilation minimal.
* **Cons**:
  * Ships 200KB–1MB of syntax tokenizers and language grammars to the client.
  * Causes visible layout shifts and flashing as code blocks highlight post-hydration.
  * Degrades Core Web Vitals on low-end mobile devices.
* **Reason for Rejection**: Pre-rendering token spans at build time via `remark-prism` costs 0 KB client JavaScript.

### Alternative C: Build-Time AST Heuristic Suppression of In-Content TOCs
* **Description**: Writing complex AST node visitor algorithms to match and strip legacy in-content TOCs during build.
* **Pros**:
  * Leaves existing static markdown files untouched in git.
* **Cons**:
  * Leaves fragile heuristic regex logic permanently embedded in the build pipeline.
  * Risks accidentally stripping legitimate headings and content.
  * Breaks inbound navigation links such as `[Back to Top ↑](#table-of-contents)`.
* **Reason for Rejection**: Exactly 3 static files in `content/blogs/` have manual TOCs (totaling 34 lines). A one-time manual deletion is cleaner, permanent, and eliminates build-time heuristic debt.

### Alternative D: Dedicated 2px Reading Progress Bar
* **Description**: Mounting an animated 2px progress bar anchored to the bottom of the sticky header.
* **Pros**:
  * Provides visual indication of scroll progress.
* **Cons**:
  * Duplicates the orientation cues already provided by the sticky TOC active highlight.
  * Collides with container padding in `app/(root)/layout.tsx` (`container` adds 32px padding), preventing edge-to-edge alignment with the header.
  * Requires client scroll listener or rAF loop.
* **Reason for Rejection**: The sticky desktop TOC already provides superior section-by-section orientation; adding a progress bar adds visual clutter and redundant code.

### Alternative E: Shiki / Rehype-Pretty-Code Syntax Engine
* **Description**: Replacing `remark-prism` with `@shikijs/rehype`.
* **Pros**:
  * Precise TextMate grammar highlighting with dual light/dark theme generation.
* **Cons**:
  * Requires compiling heavy Oniguruma WASM engines during Next.js SSG build.
  * Significantly increases build time and adds external dependencies.
* **Reason for Rejection**: `remark-prism` is already installed (`^1.3.6`) and generates standard Prism token classes that map directly to the portfolio's 7 CSS theme variables in `app/globals.css`.

## Risks & Mitigations

| Risk | Impact | Likelihood | Mitigation Strategy |
| :--- | :--- | :--- | :--- |
| **Clipboard API Rejection** | Medium | Medium | In non-secure contexts or mobile in-app WebViews (LinkedIn/Twitter), `navigator.clipboard.writeText()` may reject. Mitigate with a `try/catch` fallback using a hidden textarea and `document.execCommand('copy')`. |
| **Duplicate Heading DOM IDs** | High | Low | If manual `<a id="...">` anchors coincide with auto-slugged headings, duplicate IDs break HTML validation and scroll-spy. Mitigate by stripping manual `<a id="...">` tags in the AST visitor and assigning the ID directly to `node.data.hProperties.id`. |
| **Sticky Header Occlusion** | High | High | Clicking TOC anchor links navigates the target heading to `top: 0`, obscuring it behind the 80px sticky `SiteHeader`. Mitigate by setting `scroll-mt-24` (96px scroll margin) on all article headings in `app/globals.css`. |
| **Legacy Back-to-Top Link Breakage** | Medium | High | Posts contain `[Back to Top ↑](#table-of-contents)` links. Pruning manual TOCs breaks these targets. Mitigate by assigning `id="table-of-contents"` to the dynamic TOC container so legacy back-to-top links continue to resolve. |
| **Layout Gutter Defect on Posts Without Headings** | Low | Low | Articles without `h2`/`h3` headings would reserve an empty 260px right track in the grid. Mitigate by conditionally rendering a single-column `max-w-3xl mx-auto` layout when `post.toc.length === 0`. |

## Security & Privacy Considerations

* **Trusted Content Boundary**: Blog articles are authored locally under `content/blogs/` as trusted static content. The `remark-html` parser runs with `{ sanitize: false }` to preserve intentional embedded SVGs, diagrams, and base64 images. No untrusted user inputs or dynamic runtime strings are processed by this pipeline.
* **Zero Attribute Injection**: Code text is not serialized into HTML attributes (`data-code`), eliminating attribute breakout injection attack vectors and preventing newline normalization bugs.
* **Zero Third-Party Scripts**: All interactive enhancements use declarative React components and native browser APIs. No third-party analytics, tracking scripts, or dynamic `eval` calls are introduced.

## Implementation Plan

### Phase 1: Dependencies & Markdown AST Pipeline (`lib/blogs.ts`)

1. **Install Dependencies**:
   * Run `npm install github-slugger` and `npm install -D @types/github-slugger`.
2. **Update Type Interfaces in `lib/blogs.ts`**:
   * Export `TocItem` interface:
     ```typescript
     export interface TocItem {
       id: string;
       text: string;
       level: 2 | 3;
     }
     ```
   * Update `BlogFrontmatter` with optional `showToc?: boolean`.
   * Update `BlogPost` interface to include `toc: TocItem[]`.
3. **Implement Code Block Chrome Visitor**:
   * Add AST visitor that runs before `remark-prism` to wrap `code` nodes in `<div class="code-block-wrapper">` containing a `.code-header` bar, language label, and copy button.
4. **Implement Heading Extractor Visitor**:
   * Use `github-slugger` and `unist-util-visit` to extract `h2` and `h3` nodes into `post.toc`.
   * Inspect children for `<a id="...">` manual anchors; if present, adopt the manual ID and delete the inner anchor element.
   * Attach `id` to `node.data.hProperties.id`.
5. **Implement Alert Block Transformer**:
   * Transform GFM alerts (`[!NOTE]`, `[!TIP]`, `[!WARNING]`, `[!IMPORTANT]`) and emoji prefixes (`💡`, `⚠️`, `🧠`, `✅`) into `<div class="callout callout-<type>" role="note">` with decorative SVGs.
6. **Register `remark-prism`**:
   * Ensure `remark-prism` is registered in the Remark processing pipeline before `remark-html`.

### Phase 2: Static Content Cleanup (`content/blogs/*.md`)

1. **Remove Manual In-Content TOCs**:
   * Remove the 8-line manual TOC in `content/blogs/nextjs-client-server-secret-env.md` (lines 35–43).
   * Remove the 10-line manual TOC in `content/blogs/modernization-angular-20.md` (lines 35–45).
   * Remove the 16-line manual TOC in `content/blogs/java-pki-crisis.md` (lines 10–26).
2. **Preserve Navigation Targets**:
   * Retain heading text and ensure the dynamic TOC container in `page.tsx` has `id="table-of-contents"` to preserve legacy `[Back to Top ↑](#table-of-contents)` targets.

### Phase 3: Global Styles & Theme Tokens (`app/globals.css`)

1. **Prism Syntax Token Variables**:
   * Map Prism token classes to existing theme CSS variables across all 7 portfolio themes:
     * `.token.keyword`, `.token.operator`: `hsl(var(--primary))`
     * `.token.string`, `.token.char`: `hsl(var(--accent))`
     * `.token.function`, `.token.class-name`: `hsl(var(--foreground))`
     * `.token.comment`: `hsl(var(--muted-foreground))`
2. **Code Chrome Rules**:
   * Style `.code-block-wrapper`, `.code-header`, `.code-lang`, and `.copy-code-btn` with focus indicators, rounded borders, and copy transition states (`.copy-code-btn.copied`).
3. **Callout Styling**:
   * Style `.callout` containers with 4px left accent borders, tinted background fills, and aligned SVG icons.
4. **Scroll Margins**:
   * Set `scroll-margin-top: 6rem;` (`scroll-mt-24`) on all article `h2` and `h3` elements to clear the sticky header on anchor jumps.

### Phase 4: Interactive Presentation Components (`components/blogs/`)

1. **Create `components/blogs/desktop-table-of-contents.tsx`** (`"use client"`):
   * Props: `{ toc: TocItem[] }`.
   * Sticky sidebar rail at `sticky top-24 max-h-[calc(100vh-7rem)] overflow-y-auto`.
   * Sets up `IntersectionObserver` to track active heading ID and highlight active link.
   * Returns `null` if `toc.length === 0`.
2. **Create `components/blogs/mobile-table-of-contents.tsx`** (`"use client"`):
   * Props: `{ toc: TocItem[] }`.
   * Reuses `Accordion`, `AccordionItem`, `AccordionTrigger`, and `AccordionContent` from `@/components/ui/accordion`.
   * Collapsible drawer displayed above prose on viewports `< 1024px` (`lg:hidden`).
   * Returns `null` if `toc.length === 0`.
3. **Create `components/blogs/blog-article-wrapper.tsx`** (`"use client"`):
   * Props: `{ children: React.ReactNode }`.
   * Mounts a single delegated click listener for `[data-copy-code="true"]`.
   * Reads plain text directly via `pre > code` text content.
   * Executes `navigator.clipboard.writeText`, manages `.copied` class for 2000ms with timeout cancellation, and provides polite screen reader announcement.

### Phase 5: Route Layout Refactoring (`app/(root)/blogs/[slug]/page.tsx`)

1. **Layout Structure**:
   * Container: `max-w-6xl mx-auto px-4 sm:px-6 py-8`.
   * Keep post `<header>` (breadcrumbs, title, tags, author, date, reading time) spanning the full container width above the grid.
2. **Mount TOC Components**:
   * Mount `<MobileTableOfContents toc={post.toc} />` above prose (`lg:hidden`).
   * In 2-column grid (`lg:grid lg:grid-cols-[minmax(0,1fr)_260px] gap-8 lg:gap-12 items-start`):
     * Left Column: Wrap prose `<section>` with `<BlogArticleWrapper>`.
     * Right Column: Mount `<DesktopTableOfContents toc={post.toc} />` (`hidden lg:block`).
3. **Empty TOC Fallback**:
   * If `post.toc.length === 0`, render single-column container (`max-w-3xl mx-auto`).

### Phase 6: Verification & Build Integrity

1. **Typecheck & Build**:
   * Run `npm run lint` and `npm run build` to verify clean static site generation for all 4 blog posts.
2. **E2E & Responsive Audit**:
   * Test keyboard navigation on code copy buttons across Chrome, Firefox, and Safari.
   * Verify TOC scroll-spy highlighting across desktop viewports (1440px, 1280px, 1024px).
   * Verify mobile accordion disclosure on 375px and 768px viewports.
   * Verify legacy `#video` and `#table-of-contents` anchors resolve accurately without clipping behind the header.

## Testing Strategy

1. **SSG Build Integrity**:
   * Execute `npm run build` to verify all 4 posts pre-render into `.next/server/app/(root)/blogs/` without Remark warnings or TypeScript errors.
2. **Anchor Deep-Link & Heading Resolution**:
   * Click each TOC item on desktop and mobile to confirm the browser scrolls to the section.
   * Verify the heading title rests 24px below the bottom edge of `SiteHeader` (ensured by `scroll-mt-24`).
   * Verify inbound URLs with `#video` or `#table-of-contents` resolve correctly.
3. **Code Copy Interaction & Accessibility**:
   * Click the copy button on code blocks in both desktop and mobile viewports.
   * Confirm the system clipboard contains unescaped code matching the rendered snippet with preserved newlines.
   * Confirm keyboard Tab focus displays visible `:focus-visible` ring on copy button.
   * Confirm assistive technologies receive an `aria-live` announcement: "Code copied to clipboard".
4. **Responsive Layout Shift (CLS)**:
   * Audit viewports across Mobile (375px), Tablet (768px), Laptop (1024px, 1280px), and Desktop (1440px).
   * Verify Cumulative Layout Shift remains < 0.01 during page load and TOC expansion.

## Rollback Strategy

If any deployment regression occurs:
1. Revert git changes:
   ```bash
   git checkout HEAD -- lib/blogs.ts app/globals.css app/\(root\)/blogs/\[slug\]/page.tsx content/blogs package.json package-lock.json
   ```
2. Remove created components:
   ```bash
   rm -rf components/blogs
   ```
3. Run `npm run build` to verify instantaneous restoration of the legacy reading experience.
