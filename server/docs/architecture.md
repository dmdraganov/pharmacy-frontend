# Architecture

## Architectural Style

Clean Architecture.

The system is organized into four isolated layers:

- Domain
- Application
- Infrastructure
- Presentation

Each module is fully isolated.

---

# Project Structure

```text
src/
├── modules/
│   ├── auth/
│   ├── users/
│   ├── catalog/
│   ├── inventory/
│   ├── pharmacies/
│   ├── orders/
│   └── search/
│
├── shared/
│
├── Console/
├── Exceptions/
├── Providers/
└── bootstrap/
```

---

# Module Structure

```text
<module>/
├── domain/
├── application/
├── infrastructure/
└── presentation/
```

---

# Domain Layer

Contains core business logic.

Allowed:

- Entities
- Value Objects
- Domain Services
- Business Rules
- Repository Contracts

Forbidden:

- SQL
- Eloquent
- HTTP
- Laravel Facades

---

# Application Layer

Contains use cases and application workflows.

Examples:

- CreateOrder
- AddToCart
- CreateProduct
- UpdateInventory

Allowed:

- DTOs
- Use Cases
- Transactions
- Domain Services

---

# Infrastructure Layer

Contains technical implementations.

Examples:

- Eloquent Repositories
- Local File Storage
- Sanctum Integration

---

# Presentation Layer

Exposes the API.

Examples:

- Controllers
- Requests
- Resources
- Policies

---

# Request Flow

```text
Request
  ↓
Controller
  ↓
Use Case
  ↓
Domain
  ↓
Repository
  ↓
Database
  ↓
Resource
  ↓
Response
```

---

# Modules

### auth

Authentication and authorization.

### users

Users, roles, and permissions.

### catalog

Product catalog management.

### inventory

Stock and inventory management.

### pharmacies

Pharmacies and pickup locations.

### orders

Orders and shopping cart management.

### search

Simple product search.

---

# Inter-Module Communication

Modules communicate exclusively through public contracts.

Direct access to another module’s internal services is prohibited.

---

# Search

Product search is implemented with PostgreSQL queries through the catalog repository.
No external search service is used.
