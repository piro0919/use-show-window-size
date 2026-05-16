# CLAUDE.md

## Project Overview

**use-show-window-size** is a React hook that overlays the current viewport size in a corner of the page. v1.0.0 is a rewrite of the legacy 0.0.1 — same UX, dependency-free, with a configurable corner and a `{ width, height }` return value.

- **npm package:** use-show-window-size
- **Demo site:** <https://use-show-window-size.kkweb.io>

## Tech Stack

- React 18/19 (peers)
- TypeScript 5
- Next.js 16 (App Router) — demo site only
- tsup — library build (ESM + CJS + .d.ts)
- Vitest + Testing Library + jsdom
- ESLint flat config + Prettier
- Lefthook + Renovate

## Project Structure

```text
src/
├── index.ts
├── hooks/useShowWindowSize/
│   ├── index.ts
│   └── useShowWindowSize.ts        # "use client"
└── app/                            # Next.js demo
    ├── layout.tsx
    ├── page.tsx
    └── globals.css

tests/useShowWindowSize.test.tsx
```

## Public API

```ts
const size = useShowWindowSize({
  disable: process.env.NODE_ENV === "production",
  position: "top-right" | "top-left" | "bottom-right" | "bottom-left",
  style: { background: "#000", color: "#fff" },
});
```

- Appends a fixed-position `<div id="use-show-window-size">` to `document.body` while the hook is mounted.
- Updates on `resize` events.
- Returns `{ width, height }` for programmatic consumption.
- Removed `usehooks-ts` dependency — uses a native `resize` listener.

## Publishing Notes

- `files: ["dist", "README.md", "LICENSE"]`.
- v1.0.0 changes the default export to a named export `{ useShowWindowSize }`, adds a `position` option, and returns the size value.
