# Project Constraints

**Highest-priority document.**

If requirements conflict, this document overrides all others.

---

# General Constraints

- Backend-only system.
- Any frontend logic is strictly prohibited.

---

# Architecture Constraints

Required:

- Clean Architecture
- Modular Monolith
- REST API

Prohibited:

- MVC as the primary architecture
- Microservices
- Event Sourcing
- CQRS

---

# Database Constraints

- PostgreSQL is the only database.

Prohibited:

- Multiple SQL databases
- Business logic inside SQL procedures/functions
- Database triggers for business logic

---

# Search Constraints

Only search engine:

- Elasticsearch

Prohibited:

- LIKE
- ILIKE
- to_tsvector
- PostgreSQL Full-Text Search

All product search functionality must use Elasticsearch.

---

# File Storage Constraints

Allowed:

- S3
- MinIO
- Cloudflare R2

Prohibited:

- Storing images inside the database
- Storing files as Base64

---

# Authentication & Authorization

Required:

- Laravel Sanctum

Prohibited:

- JWT
- Laravel Passport
- Session Authentication

---

# Order Constraints

For prescription products (`is_prescription = true`):

- Delivery is prohibited
- Pickup is the only allowed fulfillment method

The backend must reject delivery orders containing prescription products.

---

# Inventory Constraints

- Stock must be reserved during order placement.
- Orders cannot exceed available inventory.

---

# Administration Constraints

- Backend exposes API only.
- Any admin UI/panel is outside the project scope.

---

# Scaling Constraints

Supported:

- Vertical scaling

Not a project goal:

- Horizontal scaling

---

# Non-Functional Requirements

The system must guarantee:

- Data correctness
- Protection against invalid requests
- Validation of all incoming data
- Role-based access control (RBAC)
- Inventory consistency
- Atomic order placement
