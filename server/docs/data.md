# Data Model

## General Principles

- PostgreSQL is the primary database and source of truth.
- All business data is stored in PostgreSQL.
- Full-text search is handled exclusively by Elasticsearch.

---

# Identifiers

## UUID

Used for core business entities:

- users
- products
- orders
- cart_items

Reasons:

- Security
- Non-sequential identifiers
- Easier integrations

## SERIAL / SMALLSERIAL

Used for lookup/reference tables:

- roles
- sections
- categories
- brands
- manufacturers
- pharmacies
- order_statuses
- delivery_methods
- payment_methods

---

# Users

## User

Fields:

```text
id: UUID
first_name: string
last_name: string|null
email: string
phone: string|null
password_hash: string
created_at: datetime
updated_at: datetime
```

Relations:

```text
User
 ├── Roles
 ├── Orders
 ├── Favorites
 └── CartItems
```

## Role

Values:

```text
USER
MANAGER
ADMIN
```

## UserRole

Many-to-Many relationship:

```text
User ↔ Role
```

---

# Catalog

## Section

Top-level catalog grouping.

Examples:

```text
Medicines
Vitamins
Medical Devices
```

Relation:

```text
Section → Categories
```

## Category

Product category.

Examples:

```text
Antivirals
Pain Relievers
Antibiotics
```

Relation:

```text
Category → Products
```

## Brand

Product trademark/brand.

Examples:

```text
Aspirin
Nurofen
```

## Manufacturer

Fields:

```text
id
name
country
```

Examples:

```text
Bayer
Pfizer
```

## Product

Fields:

```text
id: UUID
category_id
brand_id
manufacturer_id

slug
name

price
old_price

description

is_popular
is_prescription

info: JSONB

created_at
updated_at

created_by
updated_by
```

Rules:

```text
price >= 0
old_price > 0
slug is unique
```

Prescription products:

```text
is_prescription = true
```

Business rules:

```text
delivery prohibited
pickup required
```

Relations:

```text
Product
 ├── Category
 ├── Brand
 ├── Manufacturer
 ├── Images
 ├── Attributes
 ├── Inventory
 ├── Favorites
 ├── CartItems
 └── OrderItems
```

## ProductImage

Fields:

```text
id: UUID
product_id
image_url
alt_text
sort_order
is_main
```

Rule:

```text
Exactly one image per product must have:
is_main = true
```

## Attribute

Attribute dictionary.

Examples:

```text
Country
Dosage Form
Expiration Date
```

## ProductAttribute

Stores product-specific attribute values.

Example:

```text
Country = Germany
```

---

# Pharmacies

## Pharmacy

Order pickup location.

Fields:

```text
id
name
address
working_hours
```

Relations:

```text
Pharmacy
 ├── Inventory
 └── Orders
```

---

# Inventory

Stock per pharmacy.

Fields:

```text
pharmacy_id
product_id

stock_quantity
reserved_quantity

updated_at
```

Rules:

```text
stock_quantity >= 0
reserved_quantity >= 0
reserved_quantity <= stock_quantity
```

Available stock:

```text
available = stock_quantity - reserved_quantity
```

Reservation logic:

```text
Order created:
reserved_quantity += quantity

Order cancelled:
reserved_quantity -= quantity
```

---

# Cart

## CartItem

Fields:

```text
id

user_id|null
session_id|null

product_id
quantity

added_at
```

Rules:

```text
Either user_id or session_id must be set.
Both cannot be used simultaneously.

quantity > 0
```

---

# Favorites

## UserFavorite

Many-to-Many relationship:

```text
User ↔ Product
```

---

# Orders

## OrderStatus

Values:

```text
new
processing
shipping
delivered
completed
cancelled
```

## DeliveryMethod

Values:

```text
pickup
delivery
```

## PaymentMethod

Values:

```text
online
on_receipt
```

## Order

Fields:

```text
id: UUID

user_id
status_id

delivery_method_id
payment_method_id

total_amount
comment

pharmacy_id

delivery_country
delivery_city
delivery_street
delivery_house
delivery_apartment
delivery_postal_code

order_date
```

Delivery rules:

For delivery:

```text
Address required
pharmacy_id must be null
```

For pickup:

```text
pharmacy_id required
Address fields must be null
```

Relations:

```text
Order
 ├── User
 ├── Status
 ├── DeliveryMethod
 ├── PaymentMethod
 └── OrderItems
```

## OrderItem

Fields:

```text
id

order_id
product_id

quantity

price_at_order
```

Rule:

```text
Product price is frozen at order creation.
Future price changes do not affect existing orders.
```

---

# Search

## Elasticsearch Product Index

Separate Elasticsearch index.

Not a source of truth.

Source of truth:

```text
PostgreSQL
```

Indexed fields:

```text
id
name
description
category
brand
manufacturer
is_prescription
price
attributes
```

Synchronization triggers:

```text
Product created
Product updated
Product deleted
```

---

# Source of Truth Policy

```text
PostgreSQL = Source of Truth
Elasticsearch = Search Engine
S3 = File Storage
```

Neither Elasticsearch nor S3 can be considered authoritative sources for business data.
