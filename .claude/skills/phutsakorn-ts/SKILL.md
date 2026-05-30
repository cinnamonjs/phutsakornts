---
name: phutsakorn-ts
description: >-
  Conventions for phutsakorn-ts TanStack Start app. Use whenever write or edit
  code in repo — add or change components, routes, hooks, Storybook stories,
  tests, forms, data fetching, env vars, i18n strings — even when user no
  mention conventions, SOLID, style. Encodes stack (TanStack Start/Router/Query,
  React 19 + React Compiler, Tailwind v4, Zod v4, Paraglide i18n, Storybook,
  Vitest), where files go, strict-SOLID module boundaries adapted to functional
  React, hard no-code-comments rule. Consult before generate code so output fit
  codebase not fight Prettier, compiler, Paraglide.
---

# phutsakorn-ts conventions

TanStack Start (SSR React) app. Code you add must look like always here: same
imports, same formatting, same data flow. Rules below exist because toolchain
already make decisions — fight them = churn (Prettier rewrite your semicolons,
React Compiler make your `useMemo` redundant, hardcoded strings break i18n).
Follow them, code merge clean.

## Stack snapshot

- **bun** = runtime/package manager. Use `bun ...`, never `npm`/`pnpm`/`yarn`.
- **TanStack Start** — full-stack SSR React. **Router** file-based in `src/routes`. **Query** hold server state. **Table** for data grids.
- **React 19 + React Compiler** (`babel-plugin-react-compiler`). Compiler auto-memoize. Do **not** hand-write `useMemo`/`useCallback`/`React.memo` for perf — noise compiler already handle.
- **Tailwind v4** for styling. Compose conditional classes with `cn()` from `#/lib/utils`. Multi-variant components use `class-variance-authority` (cva).
- **Zod v4** for validation. Env vars only through `src/env.ts` (`@t3-oss/env-core`).
- **Paraglide** (inlang) for i18n. All user-facing text = message, never literal.
- **Storybook 10** for shared UI in `src/components/storybook`.
- **Vitest + Testing Library + jsdom** for tests.

## Where things go

```
src/
├── routes/                    # file-based routes → URLs. index.tsx = "/", about.tsx = "/about"
│   └── __root.tsx             # root shell + document
├── components/                # app-specific components
│   └── storybook/             # shared/reusable UI primitives (Button, Input, ...) + .stories + index.ts barrel
├── integrations/              # cross-cutting wiring (e.g. tanstack-query providers)
├── lib/                       # framework-agnostic helpers (cn, formatters)
├── env.ts                     # validated env access
└── paraglide/                 # GENERATED i18n output — never edit by hand
messages/{en,th}.json          # i18n source strings
```

Decide placement by **reason to change** (this SRP, see SOLID below):

- URL user visit → `src/routes/<path>.tsx`.
- Reusable, presentation-only UI, no app/domain knowledge → `src/components/storybook/` (add `.stories` + barrel export).
- Component tied to this app screens/domain → `src/components/`.
- Pure logic reused across layers → `src/lib/`.
- Wire library into app (providers, clients) → `src/integrations/`.

## Conventions

**Imports.** Use `#/` alias for cross-directory imports (`#/lib/utils`, `#/paraglide/messages`). Relative imports only for same-directory siblings. No reorder existing imports — ESLint has `import/order` and `sort-imports` off on purpose.

**Formatting not your job — Prettier own it.** No semicolons, single quotes, trailing comma `all`. No fight it; write natural, let `bun run format` settle it.

**Components.** Named export. Export `Props` interface alongside (e.g. `CardProps`). Destructure props with defaults. Reusable primitives also get barrel re-export in `src/components/storybook/index.ts` (value + type).

**Styling.** Tailwind utility classes. Merge/conditionalize with `cn(...)` — never string-concatenate class names by hand (break Tailwind conflict resolution). Component with discrete visual variants → define with `cva` not nested ternaries.

**i18n — no hardcoded user-facing text.** Any string user read = Paraglide message: call `m.some_key()` from `#/paraglide/messages`. Add key to **both** `messages/en.json` and `messages/th.json`. Locale APIs (`getLocale`, `setLocale`, `locales`) come from `#/paraglide/runtime`. Code-only strings (test ids, object keys, aria roles) stay literals.

**Validation & env.** Schemas use Zod v4. Read env only via `import { env } from '#/env'` — never `import.meta.env`/`process.env` direct, so validation not bypassed.

**Data.** Server state live in TanStack Query, reach through router context (`queryClient`), not ad-hoc `fetch` inside components. Keep fetching out of presentation components (this DIP — see SOLID).

**Tests.** Vitest + Testing Library. Colocate as `<name>.test.tsx`. Run with `bun run test`.

## No code comments

Write **zero comments** in code you author or edit — no `//`, no `/* */`, no JSDoc. Reason: comment = second source of truth that drift from code and signal code no explain itself. Instead make code self-documenting — rename unclear variable, extract confusing expression into well-named function, split function doing two things. Feel urge to comment _why_? That "why" usually belong in commit message or a name.

You see comments in some existing scaffold files (`env.ts`, `LocaleSwitcher.tsx`, `__root.tsx`). Those upstream template leftovers — treat as legacy, no replicate style, no add more. (No go delete them either unless that file your actual task; that unrelated churn.)

## SOLID (strict, mapped to React)

Apply SOLID to **module and dependency boundaries**, not OOP ceremony. Goal = low coupling, easy change. Full definitions and worked before/after examples in `references/solid-react.md` — read when design component, hook, or module with more than trivial structure. Short form:

- **S — Single Responsibility.** One reason to change per file. Component render; hook own one slice of behavior; lib function do one transform. Component both fetch and render and format → split it.
- **O — Open/Closed.** Extend through props, composition, `children`, cva variants — not by editing component every time new case appear.
- **L — Liskov.** Variants of component honor same prop contract, so swap `variant="primary"` for `"danger"` never change call shape.
- **I — Interface Segregation.** Keep `Props` interfaces narrow and specific. No god-props bag half callers pass `undefined` for. Split into focused components instead.
- **D — Dependency Inversion.** Presentation depend on **injected** data and handlers (props, context), never on concrete data-fetching/storage it import direct. Pass `onSave`, `items` in — no `import { db }` into a button.

**Precedence / guardrail.** SOLID here govern _where boundaries fall_, not how much code to write. Does **not** license speculative abstraction: no interface for single implementation, no DI indirection for one-off, no splitting 10-line component into five. When SOLID-by-boundary and "keep minimal" seem conflict, draw boundary clean but implement smallest thing behind it. Add seam when second real caller/case exist, not before.

## Commands

```bash
bun install
bun run dev        # dev server on :3000
bun run build
bun run test       # vitest
bun run lint       # eslint
bun run format     # prettier --write + eslint --fix
bun run check      # prettier --check (verify formatting)
```

## Before you call it done

- [ ] No comments anywhere in code you touched.
- [ ] User-facing strings are `m.key()` and key exist in `en.json` **and** `th.json`.
- [ ] File in right directory by its reason-to-change.
- [ ] Reusable component: exports `Props` interface + barrel entry + has `.stories`.
- [ ] Classes composed with `cn()`; variants via `cva`.
- [ ] No hand-written `useMemo`/`useCallback`/`memo` for perf.
- [ ] Imports use `#/` for cross-dir; env via `#/env`.
- [ ] `bun run check` and `bun run lint` pass.

See `references/recipes.md` for copy-ready, comment-free templates (component, route, story, i18n string, test).
