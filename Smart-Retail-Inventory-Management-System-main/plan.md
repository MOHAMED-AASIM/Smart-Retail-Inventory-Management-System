# Smart Retail Inventory Management System - Project Plan

## 1. Overview
The Smart Retail Inventory Management System is a full-stack MERN application providing real-time inventory visibility, automated stock calculations, low-stock alerts, role-based dashboards, and sales/supplier reporting for retail businesses.

## 2. Requirements Summary & Traceability Matrix

| Requirement ID | Module | Description | Primary Persona | API Endpoint |
|---|---|---|---|---|
| FR-1 | Auth | JWT Registration & Login with bcrypt password hashing | All | `/api/auth/register`, `/api/auth/login` |
| FR-2 | Security | Role-Based Access Control (Admin, Manager, Employee) | All | Auth Middleware (`authorize`) |
| FR-3 | Products | Product Catalog CRUD & Category management | Admin | `/api/products` |
| FR-4 | Inventory | Real-time stock tracking & update history | Admin, Employee | `/api/inventory/:id/stock` |
| FR-5 | Alerts | Low-stock detection when stock < minStockLevel | All | `/api/inventory/low-stock` |
| FR-6 | Sales | Atomic sale recording and automated stock decrement | Employee | `/api/sales` |
| FR-7 | Sales History| Historical sales logs and total revenue calculations | Admin, Manager | `/api/sales` |
| FR-8 | Suppliers | Supplier contact management and product mapping | Admin, Manager | `/api/suppliers` |
| FR-9 | Dashboard | Real-time KPIs, sales charts, low-stock indicators | Admin, Manager | `/api/reports/dashboard` |
| FR-10 | Reports | Daily/Monthly sales, inventory, and performance reports | Admin, Manager | `/api/reports/:type` |

## 3. Personas & Authorization Matrix

| Feature | Admin | Manager | Employee |
|---|---|---|---|
| View Dashboard & Analytics | ✅ | ✅ | ❌ |
| Create / Edit / Delete Products | ✅ | ❌ | ❌ |
| Search & View Products | ✅ | ✅ | ✅ |
| Update Stock Quantities | ✅ | ❌ | ✅ |
| View Low-Stock Alerts | ✅ | ✅ | ✅ |
| Record Sales | ❌ | ❌ | ✅ |
| View Sales History | ✅ | ✅ | ❌ |
| Supplier Management | ✅ (Full) | ✅ (View) | ❌ |
| Generate Business Reports | ✅ | ✅ | ❌ |

## 4. Milestones & Phase Breakdown

### Phase 1: Planning & Architecture (Current)
- Requirements breakdown from PRD & Proposal.
- Creation of `plan.md` and `implement.md`.
- User review and approval of technical architecture.

### Phase 2: Core Backend Engine & API Surface
- Express server initialization with CORS, JWT, and error handling.
- MongoDB / Mongoose Data Models (`User`, `Product`, `Sale`, `Supplier`).
- Authentication endpoints (`register`, `login`, `me`).
- Controllers and routes for Products, Inventory, Sales, Suppliers, Reports.
- Seed script for default accounts and demo inventory items.

### Phase 3: Frontend Application & Design System
- Vite React setup with dark glassmorphic styling tokens (`index.css`).
- AuthContext state & Protected Route component.
- Navigation header and sidebar adapted to active user role.
- Dashboard with key metrics cards, sales revenue charts, and alert banners.
- Management views: Products CRUD, Inventory updater, Sales POS checkout, Suppliers list, Reports generator.

### Phase 4: Integration Testing & Verification
- Endpoint verification tests.
- End-to-end user story walkthroughs across Admin, Manager, and Employee personas.
- Production build validation.
