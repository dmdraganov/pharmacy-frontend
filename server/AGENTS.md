# Repository Guidelines

## Project Structure & Module Organization

This is a Laravel backend organized around domain modules. Core feature code lives under `app/modules/<module>/`, with layers such as `domain`, `application`, `infrastructure/Persistence`, and `presentation`. Shared abstractions are in `app/shared`, framework providers and middleware remain in `app/Providers` and `app/Http`, and routes are defined in `routes/api.php` and `routes/web.php`.

Database migrations and seeders live in `database/migrations` and `database/seeders`. Tests are split into `tests/Feature` for HTTP/integration behavior and `tests/Unit` for isolated checks. Vite assets are in `resources/js` and `resources/css`.

## Build, Test, and Development Commands

- `composer install`: install PHP dependencies.
- `npm install`: install Vite/Tailwind tooling.
- `composer setup`: install dependencies, create `.env`, generate the app key, migrate, and build assets.
- `composer dev`: run the Laravel server, queue listener, log tailing, and Vite together.
- `composer test`: clear config and run the Laravel test suite.
- `./vendor/bin/pint`: format PHP code using Laravel Pint.
- `npm run build`: build frontend assets for production.

## Coding Style & Naming Conventions

Use PSR-4 namespaces under `App\`, matching file paths exactly. Keep module classes in their layer: controllers, requests, and resources under `presentation`; use cases and DTOs under `application`; entities, events, and contracts under `domain`; Eloquent models and repositories under `infrastructure/Persistence/Eloquent`.

Follow Laravel conventions: singular model/entity names, plural table names, `*Controller`, `*Request`, `*Resource`, `*UseCase`, `*DTO`, and `*RepositoryContract` suffixes. Format PHP with Pint before submitting changes.

## Testing Guidelines

Use PHPUnit through Laravel's test runner. Place endpoint, auth, database, and module integration tests in `tests/Feature`; place isolated business-rule tests in `tests/Unit`. Name test files after the behavior or class under test, for example `AuthTest.php` or `CreateOrderUseCaseTest.php`.

The test environment is configured in `phpunit.xml` to use PostgreSQL database `pharmacy_testing`, array cache/session drivers, and synchronous queues. Run `composer test` before opening a PR.

## Commit & Pull Request Guidelines

Recent commits use short summaries such as `Orders`, `routes config refactoring`, and `fix images base url`. Keep messages concise and action-oriented; include the affected area when helpful.

Pull requests should include a brief description, relevant issue link, migration or configuration notes, and test results. For API changes, document routes, request fields, response shape, and authorization expectations.

## Security & Configuration Tips

Do not commit `.env`, credentials, tokens, or generated secrets. Keep environment-specific services such as PostgreSQL, queues, Sanctum, and Elasticsearch configured through `.env` and `config/*.php`. When changing migrations or seeders, note any required data reset or backfill in the PR.
