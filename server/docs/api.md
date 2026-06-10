# API Specification

## General Rules

### API Style

REST API

### Base URL

```text
/api
```

### Content-Type

```http
Content-Type: application/json
```

---

# Authentication

Uses Laravel Sanctum.

All protected routes require:

```http
Authorization: Bearer {token}
```

---

# Success Response Format

Successful JSON responses use this envelope:

```json
{
    "data": {},
    "message": "Success"
}
```

Paginated list endpoints include `meta`:

```json
{
    "data": [],
    "meta": {
        "current_page": 1,
        "per_page": 15,
        "total": 0,
        "last_page": 1
    },
    "message": "Success"
}
```

Delete, logout, and other no-body commands return `204 No Content`.

### Pagination

Supported by list endpoints unless stated otherwise.

| Parameter  | Default | Max | Notes                     |
| ---------- | ------- | --- | ------------------------- |
| page       | 1       | —   | Page number, minimum `1`. |
| per_page   | 15      | 100 | Items per page.           |

---

# Error Response Format

```json
{
    "message": "Validation failed",
    "errors": {
        "email": ["The email field is required."]
    }
}
```

---

# HTTP Status Codes

| Code | Meaning               |
| ---- | --------------------- |
| 200  | OK                    |
| 201  | Created               |
| 204  | No Content            |
| 400  | Bad Request           |
| 401  | Unauthorized          |
| 403  | Forbidden             |
| 404  | Not Found             |
| 409  | Conflict              |
| 422  | Validation Error      |
| 500  | Internal Server Error |

---

# AUTH

## Register

```http
POST /auth/register
```

### Request

```json
{
    "first_name": "John",
    "last_name": "Doe",
    "email": "john@example.com",
    "phone": "+79999999999",
    "password": "password",
    "password_confirmation": "password"
}
```

### Response

```json
{
    "data": {
        "user": {},
        "token": "..."
    },
    "message": "User registered successfully"
}
```

---

## Login

```http
POST /auth/login
```

### Request

```json
{
    "email": "john@example.com",
    "password": "password"
}
```

### Response

```json
{
    "data": {
        "token": "..."
    },
    "message": "User logged in successfully"
}
```

---

## Logout

```http
POST /auth/logout
```

### Roles

```text
USER
MANAGER
ADMIN
```

---

## Current User

```http
GET /auth/me
```

---

# USERS

## Profile

```http
GET /users/profile
```

## Update Profile

```http
PATCH /users/profile
```

### Request

```json
{
    "first_name": "John",
    "last_name": "Doe",
    "phone": "+79999999999"
}
```

---

# CATALOG

## Products List

```http
GET /products
```

### Query Parameters

```text
page
per_page

category_id
brand_id
manufacturer_id

min_price
max_price

is_prescription

sort
```

### Response

```json
{
    "data": [
        {
            "id": "uuid",
            "name": "Aspirin",
            "price": 250
        }
    ],
    "meta": {},
    "message": "Success"
}
```

---

## Product Details

```http
GET /products/{id}
```

## Popular Products

```http
GET /products/popular
```

## Sections

```http
GET /sections
```

### Query Parameters

```text
page
per_page
```

## Categories

```http
GET /categories
```

### Query Parameters

```text
page
per_page
```

## Brands

```http
GET /brands
```

### Query Parameters

```text
page
per_page
```

## Manufacturers

```http
GET /manufacturers
```

### Query Parameters

```text
page
per_page
```

---

# SEARCH

## Search Products

```http
GET /search/products
```

### Query Parameters

```text
query
page
per_page

category_id
brand_id
manufacturer_id

min_price
max_price
is_prescription
sort
```

### Notes

Search is executed by the backend with PostgreSQL filters over product fields.

### Example

```http
/search/products?query=aspirin
```

---

# FAVORITES

## Get Favorites

```http
GET /favorites
```

### Query Parameters

```text
page
per_page
```

## Add Favorite

```http
POST /favorites
```

```json
{
    "product_id": "uuid"
}
```

## Remove Favorite

```http
DELETE /favorites/{productId}
```

---

# CART

## Cart Items

```http
GET /cart
```

### Query Parameters

```text
page
per_page
```

## Add Item

```http
POST /cart
```

```json
{
    "product_id": "uuid",
    "quantity": 2
}
```

## Update Quantity

```http
PATCH /cart/{itemId}
```

```json
{
    "quantity": 5
}
```

## Remove Item

```http
DELETE /cart/{itemId}
```

## Clear Cart

```http
DELETE /cart
```

---

# ORDERS

## Create Order

```http
POST /orders
```

### Request

```json
{
    "delivery_method_id": 1,
    "payment_method_id": 1,

    "pharmacy_id": 2,

    "delivery_country": null,
    "delivery_city": null,
    "delivery_street": null,
    "delivery_house": null,
    "delivery_apartment": null,
    "delivery_postal_code": null,

    "items": [
        {
            "product_id": "uuid",
            "quantity": 1
        }
    ]
}
```

---

## Business Rules

### Prescription Products

If an order contains:

```text
is_prescription = true
```

then:

```text
delivery is disabled
pickup is required
```

---

### Inventory Reservation

On successful order creation:

```text
reserved_quantity += quantity
```

---

### Validation Rule

An order cannot be created if:

```text
available_quantity < requested_quantity
```

---

## User Orders

```http
GET /orders
```

### Query Parameters

```text
page
per_page
```

## Order Details

```http
GET /orders/{id}
```

## Cancel Order

```http
POST /orders/{id}/cancel
```

---

# PHARMACIES

## List Pharmacies

```http
GET /pharmacies
```

### Query Parameters

```text
page
per_page
```

## Pharmacy Details

```http
GET /pharmacies/{id}
```

## Pharmacy Products

```http
GET /pharmacies/{id}/products
```

### Query Parameters

```text
page
per_page

category_id
brand_id
manufacturer_id

min_price
max_price

is_prescription
sort
```

---

# ADMIN API

Admin CRUD endpoints require role:

```text
ADMIN
```

Inventory and order-management endpoints are documented separately and allow `ADMIN` and `MANAGER`.

---

# ADMIN PRODUCTS

```http
POST   /admin/products
PUT    /admin/products/{id}
DELETE /admin/products/{id}
```

### Create/Update Request

```json
{
    "name": "Aspirin",
    "slug": "aspirin",
    "description": "Pain reliever",
    "price": 250,
    "old_price": 300,
    "is_popular": true,
    "is_prescription": false,
    "info": {
        "dosage": "500mg"
    },
    "category_id": 1,
    "brand_id": 1,
    "manufacturer_id": 1
}
```

---

# ADMIN CATEGORIES

```http
POST   /admin/categories
PUT    /admin/categories/{id}
DELETE /admin/categories/{id}
```

### Create/Update Request

```json
{
    "name": "Pain Relievers",
    "description": "Medicines for pain relief",
    "section_id": 1
}
```

---

# ADMIN SECTIONS

```http
POST   /admin/sections
PUT    /admin/sections/{id}
DELETE /admin/sections/{id}
```

### Create/Update Request

```json
{
    "name": "Medicines",
    "description": "Medicinal products"
}
```

---

# ADMIN BRANDS

```http
POST   /admin/brands
PUT    /admin/brands/{id}
DELETE /admin/brands/{id}
```

### Create/Update Request

```json
{
    "name": "Aspirin"
}
```

---

# ADMIN MANUFACTURERS

```http
POST   /admin/manufacturers
PUT    /admin/manufacturers/{id}
DELETE /admin/manufacturers/{id}
```

### Create/Update Request

```json
{
    "name": "Bayer",
    "country": "Germany"
}
```

---

# ADMIN PHARMACIES

```http
POST   /admin/pharmacies
PUT    /admin/pharmacies/{id}
DELETE /admin/pharmacies/{id}
```

### Create/Update Request

```json
{
    "name": "Central Pharmacy",
    "address": "1 Main St",
    "working_hours": "09:00-21:00"
}
```

---

# INVENTORY MANAGEMENT

Access:

```text
ADMIN
MANAGER
```

## Inventory List

```http
GET /admin/inventory
```

### Query Parameters

```text
pharmacy_id
page
per_page
```

## Inventory Details

```http
GET /admin/inventory/{pharmacyId}/{productId}
```

## Update Inventory

```http
PATCH /admin/inventory/{pharmacyId}/{productId}
```

```json
{
    "stock_quantity": 100
}
```

---

# ORDER MANAGEMENT

Access:

```text
ADMIN
MANAGER
```

## Orders List

```http
GET /admin/orders
```

### Query Parameters

```text
page
per_page
```

## Order Details

```http
GET /admin/orders/{id}
```

## Update Status

```http
PATCH /admin/orders/{id}/status
```

```json
{
    "status_id": 2
}
```

## Status Flow

```text
new → processing → shipping → delivered → completed
new → cancelled
processing → cancelled
```

Allowed status transitions:

```text
new: processing, cancelled
processing: shipping, cancelled
shipping: delivered
delivered: completed
completed: none
cancelled: none
```

`POST /orders/{id}/cancel` is allowed only when the current status is `new` or `processing`.

---

# FILE STORAGE

## Upload Product Image

```http
POST /admin/products/{id}/images
Content-Type: multipart/form-data
```

### Response

```json
{
    "data": {
        "image_url": "/storage/products/..."
    },
    "message": "Created"
}
```

## Delete Product Image

```http
DELETE /admin/products/{id}/images/{imageId}
```

---

# RBAC MATRIX

| Endpoint Group   | USER | MANAGER | ADMIN |
| ---------------- | ---- | ------- | ----- |
| Auth             | ✓    | ✓       | ✓     |
| Catalog          | ✓    | ✓       | ✓     |
| Search           | ✓    | ✓       | ✓     |
| Favorites        | ✓    | ✓       | ✓     |
| Cart             | ✓    | ✓       | ✓     |
| Orders (Own)     | ✓    | ✓       | ✓     |
| Inventory        | ✗    | ✓       | ✓     |
| Order Management | ✗    | ✓       | ✓     |
| Admin CRUD       | ✗    | ✗       | ✓     |

---

# API Versioning

No API versioning is currently used.

All changes must remain backward compatible.

Future versioning (if needed):

```text
/api/v1
/api/v2
```

Currently, versioning is not implemented.
