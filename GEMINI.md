# GEMINI.md

## Project Overview

This is a frontend application for an online pharmacy. It's an educational project built with React and TypeScript, designed to showcase a clean, feature-based architecture. The application is a Single-Page Application (SPA) and does not have a backend; all data is stored locally within the application.

Key features include a product catalog, product filtering, a shopping cart, and a favorites list. The state for the cart and favorites is persisted in the browser's `localStorage`.

## Technology Stack

*   **Framework:** React 19
*   **Language:** TypeScript 5.9
*   **Build Tool:** Vite (with Rolldown)
*   **Routing:** React Router DOM
*   **Styling:** Tailwind CSS 4
*   **Linting:** ESLint
*   **Formatting:** Prettier

## Project Structure

The project follows a feature-based architectural style to promote scalability and maintainability.

*   `src/app/`: Initializes the application, routing, and global providers.
*   `src/features/`: Contains distinct business features like the shopping cart (`cart`) or product search (`search`).
*   `src/entities/`: Defines core business models, such as `product` or `category`.
*   `src/shared/`: Holds reusable components, hooks, utilities, and UI elements that are not tied to business logic.
*   `src/data/`: Contains static mock data used by the application.

## Building and Running

### Development

To run the application in development mode with hot-reloading:

```bash
npm run dev
```

### Build

To create a production-ready build of the application. This command first runs the TypeScript compiler (`tsc`) to check for type errors and then uses Vite to bundle the code.

```bash
npm run build
```

### Preview

To serve the production build locally for previewing:

```bash
npm run preview
```

## Development Conventions

### Linting and Formatting

The project uses ESLint for identifying and fixing problems in the code and Prettier for enforcing a consistent code style.

*   **To run the linter:**
    ```bash
    npm run lint
    ```

*   **To automatically format all files:**
    ```bash
    npm run format
    ```

### Architectural Rules

*   **Modularity:** Features should be self-contained and not directly import from one another.
*   **Separation of Concerns:**
    *   The `shared` layer must not depend on `features` or `entities`.
    *   `entities` should not have dependencies on the UI.
*   **State Management:** Global state (cart, favorites) is managed via React Context. Component-local state uses `useState`. Persistence is handled in the `shared` layer to abstract `localStorage` access.

## Documentation

The `docs/` directory contains detailed information about the project's architecture, constraints, and guidelines.

*   `docs/architecture.md`: Describes the project's technology stack, high-level structure (Feature-based), data flow, state management, and architectural rules.
*   `docs/constraints.md`: Lists the technical, functional, and architectural limitations, such as the absence of a backend or the prohibition of certain libraries.
*   `docs/data.md`: Defines the core data models (`Product`, `Category`), their relationships, and the rules governing them.
*   `docs/routes.md`: Outlines the client-side routes, providing a complete list of application paths (e.g., `/catalog`, `/cart`).
*   `docs/ui-guide.md`: Provides guidelines on the user interface, including style, layout, component behavior, and empty states.
