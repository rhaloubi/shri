# SHRI — Marketplace Microservices

---

# Marketplace Microservices Architecture

## Project Overview

SHRI is a marketplace platform built as microservices. The project includes a Next.js frontend, a user-auth service using the BetterAuth library, three Go backend services, an API Gateway that enforces CORS, rate limiting and JWT validation, and Neon PostgreSQL databases. The API Gateway is the only external entrypoint to backend services.

---

## Service Architecture Overview

```
                       ┌────────────────────────────┐
                       │     FRONTEND (Next.js)     │
                       │  - Public UI / SSR / SPA    │
                       │  - Calls API Gateway        │
                       └─────────────┬──────────────┘
                                     │ HTTP/REST
                                     ▼
                       ┌────────────────────────────┐
                       │        API GATEWAY         │
                       │ • Single public entrypoint │
                       │ • Auth validation (JWT)    │
                       │ • CORS / Rate Limiting     │
                       │ • Routing & Request Proxy  │
                       └─────────────┬──────────────┘
                                     │
                ┌────────────────────┼────────────────────┐
                │                    │                    │
  ┌─────────────▼──────┐  ┌──────────▼─────────┐  ┌──────▼──────────┐
  │  User Auth Service  │  │ Product Catalog    │  │ Store Management │
  │  (BetterAuth + JWT) │  │ Service (Go)       │  │ Service (Go)     │
  │  - users, sessions  │  │ - products, images │  │ - store_owners    │
  │  - accounts         │  │ - inventory,review │  │ - stores          │
  │  DB: `user-management` ││  DB: `market-micro` │  │ DB: `market-micro`│
  └─────────────────────┘  └────────────────────┘  └──────────────────┘
                │                    │                    │
                │                    │                    │
                └──────────┬─────────┴─────────┬──────────┘
                           │                   │
                     ┌─────▼─────┐       ┌─────▼─────┐
                     │Order Mgmt │       │Shared infra│
                     │Service    │       │(logging,   │
                     │(Go)       │       │metrics, svc │
                     │- orders   │       │discovery)   │
                     │- order_items│     └─────────────┘
                     │- payments │
                     │DB: `market-micro`│
                     └───────────┘
```

> **Notes:** the API Gateway is the mandatory path for all client requests. Internal services are not accessible externally.

---

## Services & Key Tables

| Service (folder)         | Language  | DB Name           | Key tables (examples)                                               |
| ------------------------ | --------- | ----------------- | ------------------------------------------------------------------- |
| frontend-user-management | Next.js   | (connects to API) | N/A (frontend)                                                      |
| user-auth                | Node.js   | `user-management` | users, sessions, accounts, verification_tokens, addresses, wishlist |
| product-catalog          | Go        | `market-micro`    | products, images, inventory, reviews                                |
| store-management         | Go        | `market-micro`    | store_owners, stores                                                |
| order-management         | Go        | `market-micro`    | orders, order_items, payments                                       |
| api-gateway              | (Go/Node) | N/A (proxy)       | (routes, auth rules)                                                |

---

## Security & Auth

* **Authentication:** BetterAuth handles user sign-in/up flows for the user-auth service.
* **Authorization:** JWT tokens are issued by the auth service and must be presented to the API Gateway.
* **Gateway enforcement:** The gateway validates JWTs and checks scopes/claims as needed; it also enforces CORS and rate-limits before proxying the request to services.
* **Secrets management:** Store `JWT_SECRET`, DB credentials, and BetterAuth keys in Kubernetes Secrets or an external vault.

---

## Deployment & Infra

* **Kubernetes:** manifests live in `/k8s`.
* **Cluster topology (your setup):** 4 servers (nodes), 2 pods per server, and a LoadBalancer exposing the API Gateway.
* **CI/CD:** GitHub Actions workflows for pushing images to Docker Hub and running SonarCloud checks are in `.github/workflows/`.
* **No docker-compose:** the system uses Kubernetes (no docker-compose).

---

## Getting started (developer quickstart)

### Prerequisites

* Git
* Node.js (version used by `frontend-user-management` — see `package.json`)
* Go (version used by backend services — see `go.mod`)
* kubectl and access to the target Kubernetes cluster
* Docker Hub account (for CI/CD image pushes)
* Neon/Postgres instance(s)

### Clone

```bash
git clone https://github.com/rhaloubi/shri.git
cd shri
```

### Env configuration

Create `.env` files or Kubernetes Secrets for each service. Example variables you will need:

* `USER_DB_URL` (Postgres connection for `user-management` / Neon)
* `MARKET_DB_URL` (Postgres connection for `market-micro`)
* `JWT_SECRET` (secret for signing JWT tokens)
* `BETTER_AUTH_CLIENT_ID` / `BETTER_AUTH_CLIENT_SECRET`
* `FRONTEND_BASE_URL`
* `GATEWAY_URL`
* Any DockerHub credentials for CI/CD (push)

### Deploy on Kubernetes

```bash
kubectl apply -f k8s/
```

---

## Example `.env.example`

```env
# Database connections
USER_DB_URL=postgres://user:pass@host:5432/user-management?sslmode=require
MARKET_DB_URL=postgres://user:pass@host:5432/market-micro?sslmode=require

# JWT
JWT_SECRET=change_this_to_a_long_random_secret

# BetterAuth (user-auth)
BETTER_AUTH_CLIENT_ID=your_betterauth_client_id
BETTER_AUTH_CLIENT_SECRET=your_betterauth_secret

# Frontend / Gateway
FRONTEND_BASE_URL=https://example.com
GATEWAY_URL=https://api.example.com

# Optional: Docker / CI
DOCKERHUB_USERNAME=your_dockerhub_username
DOCKERHUB_REPO=your_dockerhub_repo
```

---

## Health checks & sample endpoints (replace with actual implementations)

* `GET /health` — overall service health
* `GET /api/products` — product list (via gateway)
* `POST /api/orders` — create order (via gateway)

---

## Contributing

* Open issues for bugs or feature requests.
* Fork the repo, create a feature branch, and open a pull request.
* Ensure the SonarCloud checks pass in CI before merging.

---

---

##

---

*Document last edited: updated on request.*
