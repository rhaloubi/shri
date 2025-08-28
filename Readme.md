# Marketplace Microservices Architecture

## Project Overview

A microservices-based marketplace platform with Go backend services and neon postgresql as a database.

## Service Architecture Overview

```
┌─────────────────────────────────────────────────────────────┐
│                    FRONTEND (NextJS)                       │
│  ┌─────────────────────────────────────────────────────┐    │
│  │          User Management Service                    │    │
│  │  - Authentication & Authorization (BetterAuth)     │    │
│  │  - User Profile Management                         │    │
│  │  - Address Management                              │    │
│  │  - Wishlist Management                             │    │
│  │  Tables: users, sessions, accounts,                │    │
│  │          verification_tokens, addresses, wishlist  │    │
│  └─────────────────────────────────────────────────────┘    │
└─────────────────────────────────────────────────────────────┘
                            │ HTTP/REST API
┌─────────────────────────────────────────────────────────────┐
│                     API GATEWAY                            │
│              Route Proxy, Auth, Rate Limiting              │
└─────────────────────────────────────────────────────────────┘
                            │
        ┌───────────────────┼───────────────────┐
        │                   │                   │
┌───────────────┐  ┌──────────────────┐  ┌─────────────────┐
│ Store Mgmt    │  │ Product Catalog  │  │ Order Mgmt      │
│ Service (Go)  │  │ Service (Go)     │  │ Service (Go)    │
│               │  │                  │  │                 │
│ Tables:       │  │ Tables:          │  │ Tables:         │
│ - store_owners│  │ - products       │  │ - orders        │
│ - stores      │  │ - images         │  │ - order_items   │
│               │  │ - inventory      │  │ - payments      │
│               │  │ - reviews        │  │                 │
└───────────────┘  └──────────────────┘  └─────────────────┘
```

## Database Schema & UML Class Diagram

### Tables Structure

```
USER (NextJS + BetterAuth)
----
- id: UUID
- email: string
- email_verified: boolean
- name: string
- image: string
- is_admin: boolean
- created_at: timestamp
- updated_at: timestamp

ADDRESS (NextJS)
-------
- id: UUID
- user_id: UUID
- street: string
- city: string
- state: string (region in Morocco)
- postal_code: string
- latitude: decimal
- longitude: decimal
- is_default: boolean
- created_at: timestamp

WISHLIST (NextJS)
--------
- id: UUID
- user_id: UUID
- product_id: UUID
- added_at: timestamp

STORE_OWNER (Go - Store Service)
-----------
- id: UUID
- user_id: UUID (unique)
- business_name: string
- phone: string
- created_at: timestamp
- updated_at: timestamp

STORE (Go - Store Service)
-----
- id: UUID
- store_owner_id: UUID
- name: string
- description: string
- street: string
- city: string
- state: string (region in Morocco)
- latitude: decimal
- longitude: decimal
- logo_url: string
- is_active: boolean
- created_at: timestamp
- updated_at: timestamp

PRODUCT (Go - Product Service)
-------
- id: UUID
- store_id: UUID
- name: string
- description: text
- category: string
- price: decimal
- sku: string
- is_active: boolean
- created_at: timestamp
- updated_at: timestamp

IMAGE (Go - Product Service)
-----
- id: UUID
- product_id: UUID
- url: string
- alt_text: string
- is_primary: boolean

INVENTORY (Go - Product Service)
---------
- id: UUID
- product_id: UUID
- quantity: integer
- reserved: integer
- updated_at: timestamp

REVIEW (Go - Product Service)
------
- id: UUID
- user_id: UUID
- product_id: UUID
- rating: integer (1-5)
- comment: text
- created_at: timestamp

ORDER (Go - Order Service)
-----
- id: UUID
- user_id: UUID
- order_number: string
- status: enum (pending, confirmed, shipped, delivered, cancelled)
- total_amount: decimal
- shipping_address_id: UUID
- created_at: timestamp
- updated_at: timestamp

ORDER_ITEM (Go - Order Service)
----------
- id: UUID
- order_id: UUID
- product_id: UUID
- quantity: integer
- unit_price: decimal
- total_price: decimal

PAYMENT (Go - Order Service)
-------
- id: UUID
- order_id: UUID
- amount: decimal
- payment_method: string (WhatsApp, COD, Bank Transfer, etc.)
- status: enum (pending, completed, failed, refunded)
- transaction_id: string
- notes: text
- created_at: timestamp
```

### Service Relationships

```
RELATIONSHIPS
-------------
User 1:1 StoreOwner (user_id) [Cross-service via API]
StoreOwner 1:1 Store (store_owner_id)
Store 1:N Product (store_id) [Cross-service via API]
Product 1:N Image (product_id)
Product 1:1 Inventory (product_id)
User 1:N Order (user_id) [Cross-service via API]
Order 1:N OrderItem (order_id)
Product 1:N OrderItem (product_id) [Cross-service via API]
User 1:N Wishlist (user_id)
Product 1:N Wishlist (product_id) [Cross-service via API]
User 1:N Address (user_id)
Address 1:N Order (shipping_address_id) [Cross-service via API]
User 1:N Review (user_id) [Cross-service via API]
Product 1:N Review (product_id)
Order 1:N Payment (order_id)
```

## Project Root Structure

```
marketplace-project/
├── frontend-user-management/          # NextJS + BetterAuth
├── backend-services/                  # Go Microservices
│   ├── api-gateway/
│   ├── services/
│   │   ├── store-management/
│   │   ├── product-catalog/
│   │   └── order-management/
│   ├── shared/
│   ├── docker-compose.yml
│   ├── .env.example
│   └── README.md
└── docs/
    ├── api-documentation/
    └── database-schema/
```

## 2. API Gateway Service

```
api-gateway/
├── cmd/
│   └── main.go
├── internal/
│   ├── config/
│   │   └── config.go
│   ├── middleware/
│   │   ├── auth.go
│   │   ├── cors.go
│   │   ├── rate_limit.go
│   │   └── logging.go
│   ├── proxy/
│   │   ├── router.go
│   │   └── load_balancer.go
│   └── handlers/
│       └── health.go
├── pkg/
│   └── jwt/
│       └── jwt.go
├── go.mod
├── go.sum
├── Dockerfile
└── .env
```

## 3. Store Management Service

```
store-management/
├── cmd/
│   └── main.go
├── internal/
│   ├── config/
│   │   └── config.go
│   ├── domain/
│   │   ├── store_owner.go
│   │   └── store.go
│   ├── repository/
│   │   ├── interfaces/
│   │   │   ├── store_owner_repository.go
│   │   │   └── store_repository.go
│   │   └── postgres/
│   │       ├── store_owner_repository.go
│   │       └── store_repository.go
│   ├── service/
│   │   ├── interfaces/
│   │   │   ├── store_owner_service.go
│   │   │   └── store_service.go
│   │   └── impl/
│   │       ├── store_owner_service.go
│   │       └── store_service.go
│   ├── handlers/
│   │   ├── store_owner_handler.go
│   │   ├── store_handler.go
│   │   └── health_handler.go
│   ├── middleware/
│   │   ├── auth.go
│   │   ├── validation.go
│   │   └── error_handler.go
│   ├── dto/
│   │   ├── store_owner_dto.go
│   │   └── store_dto.go
│   └── database/
│       ├── connection.go
│       └── migrations/
│           ├── 001_create_store_owners_table.sql
│           └── 002_create_stores_table.sql
├── pkg/
│   ├── utils/
│   │   ├── response.go
│   │   ├── validator.go
│   │   └── pagination.go
│   └── errors/
│       └── custom_errors.go
├── api/
│   └── routes/
│       ├── store_owner_routes.go
│       └── store_routes.go
├── go.mod
├── go.sum
├── Dockerfile
└── .env
```

## 4. Product Catalog Service

```
product-catalog/
├── cmd/
│   └── main.go
├── internal/
│   ├── config/
│   │   └── config.go
│   ├── domain/
│   │   ├── product.go
│   │   ├── image.go
│   │   ├── inventory.go
│   │   └── review.go
│   ├── repository/
│   │   ├── interfaces/
│   │   │   ├── product_repository.go
│   │   │   ├── image_repository.go
│   │   │   ├── inventory_repository.go
│   │   │   └── review_repository.go
│   │   └── postgres/
│   │       ├── product_repository.go
│   │       ├── image_repository.go
│   │       ├── inventory_repository.go
│   │       └── review_repository.go
│   ├── service/
│   │   ├── interfaces/
│   │   │   ├── product_service.go
│   │   │   ├── image_service.go
│   │   │   ├── inventory_service.go
│   │   │   └── review_service.go
│   │   └── impl/
│   │       ├── product_service.go
│   │       ├── image_service.go
│   │       ├── inventory_service.go
│   │       └── review_service.go
│   ├── handlers/
│   │   ├── product_handler.go
│   │   ├── image_handler.go
│   │   ├── inventory_handler.go
│   │   ├── review_handler.go
│   │   └── health_handler.go
│   ├── middleware/
│   │   ├── auth.go
│   │   ├── validation.go
│   │   └── error_handler.go
│   ├── dto/
│   │   ├── product_dto.go
│   │   ├── image_dto.go
│   │   ├── inventory_dto.go
│   │   └── review_dto.go
│   └── database/
│       ├── connection.go
│       └── migrations/
│           ├── 001_create_products_table.sql
│           ├── 002_create_images_table.sql
│           ├── 003_create_inventory_table.sql
│           └── 004_create_reviews_table.sql
├── pkg/
│   ├── utils/
│   │   ├── response.go
│   │   ├── validator.go
│   │   ├── pagination.go
│   │   └── file_upload.go
│   └── errors/
│       └── custom_errors.go
├── api/
│   └── routes/
│       ├── product_routes.go
│       ├── image_routes.go
│       ├── inventory_routes.go
│       └── review_routes.go
├── go.mod
├── go.sum
├── Dockerfile
└── .env
```

## 5. Order Management Service

```
order-management/
├── cmd/
│   └── main.go
├── internal/
│   ├── config/
│   │   └── config.go
│   ├── domain/
│   │   ├── order.go
│   │   ├── order_item.go
│   │   └── payment.go
│   ├── repository/
│   │   ├── interfaces/
│   │   │   ├── order_repository.go
│   │   │   ├── order_item_repository.go
│   │   │   └── payment_repository.go
│   │   └── postgres/
│   │       ├── order_repository.go
│   │       ├── order_item_repository.go
│   │       └── payment_repository.go
│   ├── service/
│   │   ├── interfaces/
│   │   │   ├── order_service.go
│   │   │   ├── order_item_service.go
│   │   │   └── payment_service.go
│   │   └── impl/
│   │       ├── order_service.go
│   │       ├── order_item_service.go
│   │       └── payment_service.go
│   ├── handlers/
│   │   ├── order_handler.go
│   │   ├── order_item_handler.go
│   │   ├── payment_handler.go
│   │   └── health_handler.go
│   ├── middleware/
│   │   ├── auth.go
│   │   ├── validation.go
│   │   └── error_handler.go
│   ├── dto/
│   │   ├── order_dto.go
│   │   ├── order_item_dto.go
│   │   └── payment_dto.go
│   └── database/
│       ├── connection.go
│       └── migrations/
│           ├── 001_create_orders_table.sql
│           ├── 002_create_order_items_table.sql
│           └── 003_create_payments_table.sql
├── pkg/
│   ├── utils/
│   │   ├── response.go
│   │   ├── validator.go
│   │   ├── pagination.go
│   │   └── order_number.go
│   └── errors/
│       └── custom_errors.go
├── api/
│   └── routes/
│       ├── order_routes.go
│       ├── order_item_routes.go
│       └── payment_routes.go
├── go.mod
├── go.sum
├── Dockerfile
└── .env
```

## 6. Shared Package

```
shared/
├── pkg/
│   ├── database/
│   │   ├── postgres.go
│   │   └── migrations.go
│   ├── middleware/
│   │   ├── cors.go
│   │   ├── logging.go
│   │   └── recovery.go
│   ├── utils/
│   │   ├── response.go
│   │   ├── validation.go
│   │   ├── pagination.go
│   │   └── constants.go
│   ├── jwt/
│   │   ├── jwt.go
│   │   └── claims.go
│   └── errors/
│       └── errors.go
├── proto/ (if using gRPC later)
│   ├── user/
│   ├── store/
│   ├── product/
│   └── order/
└── go.mod
```

## Key Architecture Points:

### **Clean Architecture Pattern:**

- **Domain**: Business entities/models
- **Repository**: Data access layer with interfaces
- **Service**: Business logic layer
- **Handlers**: HTTP handlers (controllers)
- **DTO**: Data Transfer Objects for API

### **Each Service Includes:**

- **Health checks** for monitoring
- **Middleware** for auth, validation, error handling
- **Database migrations** for schema management
- **Docker support and k8s deployment** for containerization
- **Environment configuration**

### **API Gateway Features:**

- **Route proxy** to microservices
- **JWT authentication** validation
- **Rate limiting** and CORS
- **Load balancing** between service instances

### **Inter-Service Communication:**

- HTTP REST APIs between services
- Shared JWT validation
- Standardized response formats
- Error handling
