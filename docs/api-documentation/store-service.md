📘 Store Management API

Authentication:

All endpoints require JWT Bearer token in Authorization header.

Example:

Authorization: Bearer <your-jwt-token>

🏪 Store Endpoints
Create Store

POST /stores
Creates a store for the authenticated StoreOwner.

Headers:

Authorization: Bearer <token>

Content-Type: multipart/form-data

Form Data:

name (string, required) – Store name

description (string, optional) – Store description

street (string, required) – Street address

city (string, required) – City in Morocco

state (string, required) – Region in Morocco

logo (file, optional) – Store logo (image file)

Responses:

201 Created → Store object JSON

403 Forbidden → User is not a StoreOwner

409 Conflict → StoreOwner already has a store

Update Store

PUT /stores/{id}
Updates a store by ID.

Headers:

Authorization: Bearer <token>

Content-Type: multipart/form-data

Path Params:

id (uuid, required) – Store ID

Form Data (any subset):

name, description, street, city, state

logo (new image file, replaces existing logo)

Responses:

200 OK → Updated store JSON

404 Not Found → Store not found

Delete Store

DELETE /stores/{id}

Path Params:

id (uuid, required) – Store ID

Responses:

204 No Content → Store deleted

404 Not Found → Store not found

List Stores

GET /stores

Behavior:

admin → returns all stores

store owner → returns only their own stores

Responses:

200 OK → List of stores

Get Stores by Owner

GET /stores/owner/{ownerID}

Path Params:

ownerID (uuid, required) – StoreOwner ID

Responses:

200 OK → List of stores for that owner

👤 StoreOwner Endpoints
Create Store Owner Profile

POST /store-owners

Headers:

Authorization: Bearer <token>

Content-Type: application/json

Body JSON:

{
"businessName": "Atlas Foods",
"phone": "+212600000000"
}

Responses:

201 Created → StoreOwner object JSON

409 Conflict → User already has StoreOwner profile

Get Store Owner by ID

GET /store-owners/{id}

Path Params:

id (uuid, required) – StoreOwner ID

Responses:

200 OK → StoreOwner JSON

403 Forbidden → Not admin or not the owner

404 Not Found → StoreOwner not found

Update Store Owner

PUT /store-owners/{id}

Headers:

Authorization: Bearer <token>

Content-Type: application/json

Path Params:

id (uuid, required) – StoreOwner ID

Body JSON (any subset):

{
"businessName": "New Business",
"phone": "+212611111111"
}

Responses:

200 OK → Updated StoreOwner

404 Not Found

Delete Store Owner

DELETE /store-owners/{id}

Path Params:

id (uuid, required) – StoreOwner ID

Responses:

204 No Content

404 Not Found

List Store Owners

GET /store-owners

Behavior:

admin → returns all store owners

user → returns only their own profile

Responses:

200 OK → List of store owners
