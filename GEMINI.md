# GEMINI Project Context: pharmacy-frontend

## Project Overview

This is a frontend-only Single Page Application (SPA) for an online pharmacy. It's an educational project built with a focus on a clean, scalable, feature-based architecture. The application provides standard e-commerce functionalities like a product catalog, shopping cart, and a favorites list, but operates entirely without a backend, using local static data.

## Technology Stack

- **Framework**: React 19
- **Language**: TypeScript
- **Bundler**: Vite (with Rolldown)
- **Routing**: React Router v7
- **Styling**: Tailwind CSS v4
- **Linting**: ESLint with Prettier

## Architectural Style

The project follows a strict **Feature-Sliced Design (FSD)** like methodology. The codebase is organized by business domains rather than technical roles.

- `src/app`: Core application setup, including routing, global providers, and layouts.
- `src/pages`: Application pages, composed of features and widgets.
- `src/widgets`: Composite UI blocks made of features and entities (e.g., Header, Footer).
- `src/features`: Business-level functionality that users interact with (e.g., `cart`, `catalog`, `search`).
- `src/entities`: Business entities or domain models (e.g., `product`, `category`).
- `src/shared`: Reusable code with no business logic (e.g., UI components, hooks, utils).
- `src/data`: Static mock data used in place of a backend API.

**Key Architectural Rules:**

- Layers can only depend on layers below them (e.g., `features` can use `entities` and `shared`, but not `pages` or `app`).
- Features cannot directly import other features.
- State is managed primarily through React Context API for global concerns (cart, favorites) and `useState` for local component state.
- `localStorage` is used via a `useLocalStorage` hook to persist the cart and favorites across sessions.

## Building and Running

### Key Scripts

- **Development Server**: Start the local development server.

  ```bash
  npm run dev
  ```

- **Build**: Create a production-ready build of the application.

  ```bash
  npm run build
  ```

- **Lint**: Check the codebase for style and syntax errors.

  ```bash
  npm run lint
  ```

- **Format**: Automatically format all code with Prettier.

  ```bash
  npm run format
  ```

- **Preview Build**: Serve the production build locally to preview it.
  ```bash
  npm run preview
  ```

### Path Aliases

The project is configured with a path alias `@` that points to the `src` directory to simplify import paths.
Example: `import Spinner from '@/shared/ui/Spinner';`
