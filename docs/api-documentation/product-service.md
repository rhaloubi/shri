# 📦 Product Service API Documentation

Base URL:

```
/api
```

---

## 🔑 Authentication

All routes that modify data (`POST`, `PUT`, `DELETE`) require a **JWT Bearer token**.
Provide it in the `Authorization` header:

```
Authorization: Bearer <your_token>
```

---

## 🛍️ Products

### ➕ Create Product

`POST /products`

**Content Types:**

- `application/json`
- `multipart/form-data` (if uploading image)

**Request (JSON):**

```json
{
  "name": "Wireless Headphones",
  "description": "Noise-cancelling headphones",
  "category": "Electronics",
  "price": 129.99,
  "sku": "WH-12345",
  "isActive": true
}
```

**Multipart Example (with image):**

```
form-data:
- name: Wireless Headphones
- description: Noise-cancelling headphones
- category: Electronics
- price: 129.99
- sku: WH-12345
- isActive: true
- image: <file>
- altText: "Headphones front view"
```

**Response (201):**

```json
{
  "success": true,
  "message": "Product created successfully",
  "product_id": "7e5c8f47-bd64-4a19-93d0-f1f0bbf7de2a"
}
```

---

### 📦 Get Product by ID

`GET /products/{id}`

**Response (200):**

```json
{
  "id": "7e5c8f47-bd64-4a19-93d0-f1f0bbf7de2a",
  "storeId": "2c9a1f5c-2ad4-42b3-8f34-f84c5b9d2e5e",
  "name": "Wireless Headphones",
  "description": "Noise-cancelling headphones",
  "category": "Electronics",
  "price": 129.99,
  "sku": "WH-12345",
  "isActive": true,
  "images": [
    {
      "id": "a1b2c3d4",
      "url": "https://res.cloudinary.com/.../headphones.jpg",
      "altText": "Headphones front view",
      "isPrimary": true
    }
  ],
  "createdAt": "2025-08-30T12:45:00Z",
  "updatedAt": "2025-08-30T12:45:00Z"
}
```

---

### ✏️ Update Product

`PUT /products/{id}`

**Request:**

```json
{
  "name": "Wireless Headphones Pro",
  "price": 149.99,
  "isActive": false
}
```

**Response (200):**

```json
{
  "success": true,
  "message": "Product updated successfully",
  "product": { ...updated product... }
}
```

---

### ❌ Delete Product

`DELETE /products/{id}`

**Response (204):**

```json
{
  "success": true,
  "message": "Product deleted successfully"
}
```

---

### 📑 List Products by Store

`GET /stores/{storeId}/products`

**Response (200):**

```json
[
  {
    "id": "7e5c8f47-bd64-4a19-93d0-f1f0bbf7de2a",
    "name": "Wireless Headphones",
    "price": 129.99,
    "isActive": true,
    "images": [...]
  }
]
```

---

## 🖼️ Images

### Upload Product Image

`POST /products/{productId}/images`

**Multipart form-data:**

```
- image: <file>
- altText: "Side view"
```

**Response (201):**

```json
{
  "id": "img-123",
  "productId": "7e5c8f47-bd64-4a19-93d0-f1f0bbf7de2a",
  "url": "https://res.cloudinary.com/.../side-view.jpg",
  "altText": "Side view",
  "isPrimary": false
}
```

---

### Set Primary Image

`PUT /products/{productId}/images/{imageId}/primary`

**Response (200):**

```
Primary image updated
```

---

### Update Image Alt Text

`PUT /products/{productId}/images/{imageId}/alt-text`

**Request:**

```json
{
  "altText": "Wireless headphones top view"
}
```

---

### Delete Image

`DELETE /products/{productId}/images/{imageId}`

**Response (204)**

---

## 📦 Inventory

### Get Inventory

`GET /products/{productId}/inventory`

**Response (200):**

```json
{
  "id": "inv-789",
  "productId": "7e5c8f47-bd64-4a19-93d0-f1f0bbf7de2a",
  "quantity": 120,
  "reserved": 10,
  "updatedAt": "2025-08-30T12:50:00Z"
}
```

---

### Update Inventory

`PUT /products/{productId}/inventory`

**Request:**

```json
{
  "quantity": 150,
  "reserved": 5
}
```

**Response (200):**

```json
{
  "id": "inv-789",
  "productId": "7e5c8f47-bd64-4a19-93d0-f1f0bbf7de2a",
  "quantity": 150,
  "reserved": 5,
  "updatedAt": "2025-08-30T12:55:00Z"
}
```
