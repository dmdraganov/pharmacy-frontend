# Repository Guidelines

## Project Structure & Module Organization

This React 19 + TypeScript Vite SPA follows a Feature-Sliced Design style:

- `src/app`: application entry, routing, global CSS, and layouts.
- `src/pages`: route-level pages composed from widgets and features.
- `src/widgets`: larger UI blocks for layout, cart, checkout, orders, and products.
- `src/features`: user-facing business actions such as auth, cart, favorites, filtering, search, and region selection.
- `src/entities`: domain models and entity UI for cart, order, pharmacy, product, section, and user.
- `src/shared`: reusable UI, hooks, API clients, config, and assets with no business logic.
- `docs/`: architecture, routing, data, UI, and planning notes.
- `public/`: static files served by Vite.

Use the `@/*` alias for `src`, for example `import Button from '@/shared/ui/Button';`.

## Build, Test, and Development Commands

- `npm run dev`: start the local Vite development server.
- `npm run build`: run TypeScript project build checks and create a production build in `dist/`.
- `npm run build:gh`: build with `VITE_BASE_URL=/pharmacy-frontend/` for GitHub Pages.
- `npm run preview`: serve the production build locally.
- `npm run lint`: run ESLint across the repository.
- `npm run format`: format files with Prettier.
- `npm run deploy`: publish `dist/` with `gh-pages`.

## Coding Style & Naming Conventions

Use TypeScript and `.tsx` for React components. Component files use `PascalCase` (`ProductGrid.tsx`), hooks use `useCamelCase` (`usePagination.ts`), and feature/entity folders use lowercase or kebab-case (`filter-products`). Format with Prettier. ESLint enforces TypeScript, React Hooks, React Refresh, and no unused variables except names prefixed with `_`.

Respect FSD dependencies: layers import only downward (`pages` -> `widgets` -> `features` -> `entities` -> `shared`). Do not import between independent features. Put API access in `src/shared/api`; avoid direct `fetch` calls elsewhere.

## Testing Guidelines

There is currently no test script or test framework configured. Before merging behavior-heavy changes, run `npm run lint` and `npm run build`. If tests are introduced, prefer colocated `*.test.ts` or `*.test.tsx` files and add an `npm test` script.

## Commit & Pull Request Guidelines

Recent commits use short summaries such as `backend update`, `routes config refactoring`, and `Orders`. Keep commits focused and concise; use English summaries when possible. Pull requests should include a description, linked issue or task when available, screenshots for UI changes, and verification commands, especially `npm run lint` and `npm run build`.
