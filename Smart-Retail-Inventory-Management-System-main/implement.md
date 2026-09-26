# Smart Retail Inventory Management System - Technical Implementation Specification

## 1. Technical Stack Specifications

- **Frontend Engine**: React 18, Vite, React Router DOM v6, Axios, Lucide React Icons, Recharts.
- **Backend Engine**: Node.js v18+, Express.js v4.x, Mongoose v8.x / MongoDB, JWT (`jsonwebtoken`), BcryptJS (`bcryptjs`), CORS.
- **Data Persistence**: MongoDB Database Schema with built-in embedded fallback memory layer for immediate out-of-the-box demo functionality.

---

## 2. MongoDB Data Models & Schemas

### 2.1 Users Collection (`User.js`)
```javascript
{
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true }, // bcrypt-hashed
  role: { 
    type: String, 
    enum: ['admin', 'manager', 'employee'], 
    default: 'employee' 
  },
  createdAt: { type: Date, default: Date.now }
}
```

### 2.2 Products Collection (`Product.js`)
```javascript
{
  productName: { type: String, required: true },
  category: { type: String, required: true },
  price: { type: Number, required: true, min: 0 },
  quantity: { type: Number, required: true, min: 0 },
  minStockLevel: { type: Number, required: true, default: 10 },
  supplier: { type: String, default: 'General Supplier' },
  createdDate: { type: Date, default: Date.now }
}
```

### 2.3 Sales Collection (`Sale.js`)
```javascript
{
  productId: { type: mongoose.Schema.Types.ObjectId, ref: 'Product', required: true },
  quantity: { type: Number, required: true, min: 1 },
  totalPrice: { type: Number, required: true },
  saleDate: { type: Date, default: Date.now },
  employeeId: { type: mongoose.Schema.Types.ObjectId, ref: 'User' }
}
```

### 2.4 Suppliers Collection (`Supplier.js`)
```javascript
{
  supplierName: { type: String, required: true },
  contact: { type: String, required: true },
  address: { type: String, required: true },
  email: { type: String },
  suppliedProducts: [{ type: String }]
}
```

---

## 3. REST API Contract & Endpoints

### Auth Endpoint Routes (`/api/auth`)
- `POST /api/auth/register` (Public): Registers user, returns JWT & user payload.
- `POST /api/auth/login` (Public): Validates credentials, returns JWT & user payload.
- `GET /api/auth/me` (Protected): Returns current logged in user metadata.

### Products Endpoint Routes (`/api/products`)
- `GET /api/products` (All Roles): Returns list of products, supports category & name filtering.
- `POST /api/products` (Admin): Creates product entry.
- `PUT /api/products/:id` (Admin): Updates product details.
- `DELETE /api/products/:id` (Admin): Deletes product entry.

### Inventory Endpoint Routes (`/api/inventory`)
- `PUT /api/inventory/:id/stock` (Admin, Employee): Updates stock count for product.
- `GET /api/inventory/low-stock` (All Roles): Returns products where `quantity <= minStockLevel`.

### Sales Endpoint Routes (`/api/sales`)
- `POST /api/sales` (Employee): Records sale, validates stock availability, atomically decrements product quantity, creates sale record.
- `GET /api/sales` (Admin, Manager): Returns sales history log with populated product & user metadata.

### Suppliers Endpoint Routes (`/api/suppliers`)
- `GET /api/suppliers` (Admin, Manager): Returns list of suppliers.
- `POST /api/suppliers` (Admin): Adds new supplier entry.
- `PUT /api/suppliers/:id` (Admin): Updates supplier info.
- `DELETE /api/suppliers/:id` (Admin): Removes supplier.

### Reports Endpoint Routes (`/api/reports`)
- `GET /api/reports/:type` (Admin, Manager): Generates analytics payload for `type` in `['daily', 'monthly', 'inventory', 'performance', 'dashboard']`.

---

## 4. Frontend UI/UX & Architecture

- **Theme & Aesthetics**: Deep dark glassmorphism design with vibrant accent highlights (`#6366F1` indigo, `#10B981` emerald, `#F59E0B` amber, `#EF4444` rose).
- **State Management**: React `AuthContext` for JWT & user role persistence, custom API hooks for asynchronous CRUD interactions.
- **Routing**: `react-router-dom` with `ProtectedRoute` wrapper guarding views by required role.

---

## 5. Execution Roadmap After User Approval

Upon user approval of `implementation_plan.md`, `plan.md`, and `implement.md`:
1. Initialize project files under `scratch/smart-retail-inventory`.
2. Install dependencies for backend and frontend.
3. Build backend models, routes, controllers, middleware, and seed script.
4. Build frontend React components, contexts, routing, styling, and views.
5. Launch and verify end-to-end functionality across all user personas.
