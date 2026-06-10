# Online Pharmacy Backend API

## Project Type

Backend-only.

## Purpose

Provides a REST API for an online pharmacy platform.

### Responsibilities

- User management
- Product catalog management
- Categories and sections
- Brands and manufacturers
- Pharmacies and inventory management
- Shopping cart
- Favorites/Wishlist
- Orders
- Product search
- Administrative management

Frontend development is out of scope and implemented separately.

---

## Project Goals

Educational college-level project designed with production-inspired architecture.

### Objectives

- Demonstrate Clean Architecture
- Demonstrate Modular Monolith architecture
- Implement a complete REST API
- Integrate PostgreSQL
- Implement simple product search with PostgreSQL
- Store product images on the application server
- Implement RBAC (Role-Based Access Control)

---

## Technology Stack

### Backend

- PHP 8.4+
- Laravel 12
- PostgreSQL 17+
- Docker
- Laravel Sanctum

### Architecture

- Clean Architecture
- Modular Monolith
- REST API
- Repository Pattern
- Service Layer

---

## User Roles

### USER

Customer role.
Permissions:

- Registration
- Authentication
- Browse catalog
- Manage shopping cart
- Place orders
- Manage favorites

### MANAGER

Online pharmacy manager.
Permissions:

- Manage orders
- Update order statuses
- Manage inventory
- View users

### ADMIN

System administrator.

Permissions:

- Full system access

---

## Core Modules

- auth
- users
- catalog
- inventory
- pharmacies
- orders
- search

---

## Search

Product search is implemented with simple PostgreSQL filtering over product fields.

---

## File Storage

Product images are stored on the application server using Laravel's `public` filesystem disk.
The backend stores public file URLs and image metadata.

---

## Security

- Laravel Sanctum
- Bearer Token Authentication
- Role-Based Access Control (RBAC)
- Validation on all incoming requests

---

## Project Scale

The system is designed as a Modular Monolith.
Migration to microservices is not planned.
