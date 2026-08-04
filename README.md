# 🛒 Smart Retail Inventory Management System

A full-stack **MERN Stack** web application that helps small and medium-sized retail businesses manage products, inventory, suppliers, and sales through a centralized dashboard.

---

## 📖 Overview

The Smart Retail Inventory Management System replaces manual inventory tracking methods with a real-time digital solution. The application enables businesses to monitor stock levels, record sales, generate reports, and receive automatic low-stock alerts.

---

## 🎯 Project Objectives

- Manage products and categories
- Track inventory in real time
- Record sales transactions
- Generate inventory and sales reports
- Manage suppliers
- Provide dashboard analytics
- Implement secure authentication and authorization

---

## ✨ Features

### 🔐 Authentication
- JWT Authentication
- Secure password hashing using bcrypt
- User login and registration

### 👥 Role-Based Access Control
- Admin
- Manager
- Employee

### 📦 Product Management
- Add products
- Edit products
- Delete products
- Search products
- Product categorization

### 📊 Inventory Management
- Real-time stock updates
- Inventory history
- Low-stock alerts
- Automatic stock reduction after sales

### 💰 Sales Management
- Record sales
- View sales history
- Revenue tracking

### 🚚 Supplier Management
- Add suppliers
- Update supplier information
- Supplier-product relationships

### 📈 Dashboard Analytics
- Total Products
- Total Sales
- Available Stock
- Low Stock Items
- Monthly Revenue
- Sales Charts

### 📄 Reports
- Daily Sales Report
- Monthly Sales Report
- Inventory Report
- Product Performance Report

---

## 👥 User Roles

### Admin
- Manage users
- Manage products
- Manage suppliers
- View reports

### Manager
- View dashboard
- Monitor inventory
- Analyze sales

### Employee
- Update stock
- Record sales
- Search products

---

## 🛠️ Technology Stack

### Frontend
- React.js
- HTML5
- CSS3
- JavaScript
- Tailwind CSS
- Axios
- React Router

### Backend
- Node.js
- Express.js

### Database
- MongoDB

### Authentication
- JWT
- bcrypt

---

## 🏗️ System Architecture

```
User
   │
React Frontend
   │
REST API
   │
Express.js + Node.js
   │
MongoDB
```

---

## 📂 Project Structure

```
Smart-Retail-Inventory-System/
│
├── client/
│   ├── public/
│   ├── src/
│   └── package.json
│
├── server/
│   ├── controllers/
│   ├── middleware/
│   ├── models/
│   ├── routes/
│   ├── config/
│   └── server.js
│
├── README.md
└── package.json
```

---

## 🗄️ Database Collections

### Users
- Name
- Email
- Password
- Role

### Products
- Product Name
- Category
- Price
- Quantity
- Minimum Stock Level
- Supplier

### Sales
- Product ID
- Quantity
- Total Price
- Sale Date

### Suppliers
- Supplier Name
- Contact
- Address

---

## 🔗 API Endpoints

### Authentication

```
POST /api/auth/register
POST /api/auth/login
```

### Products

```
GET    /api/products
POST   /api/products
PUT    /api/products/:id
DELETE /api/products/:id
```

### Inventory

```
PUT /api/inventory/:id/stock
GET /api/inventory/low-stock
```

### Sales

```
POST /api/sales
GET  /api/sales
```

### Suppliers

```
GET  /api/suppliers
POST /api/suppliers
```

### Reports

```
GET /api/reports/:type
```

---

## 🔒 Security Features

- JWT Authentication
- Password Encryption using bcrypt
- Protected API Routes
- Role-Based Authorization

---

## 📈 Future Enhancements

- Mobile Application (React Native)
- Barcode Scanner
- Online Ordering System
- Payment Gateway Integration
- Customer Management Module
- AI-Based Sales Prediction
- IoT Smart Shelf Sensors
- CI/CD Deployment

---

## 🚀 Installation

### Clone Repository

```bash
git clone https://github.com/yourusername/smart-retail-inventory-system.git
```

### Backend

```bash
cd server
npm install
npm run dev
```

### Frontend

```bash
cd client
npm install
npm start
```

---

## 🌐 Environment Variables

Create a `.env` file inside the server folder.

```env
PORT=5000
MONGO_URI=your_mongodb_connection
JWT_SECRET=your_secret_key
```

---

## 📊 Expected Outcomes

- Faster inventory tracking
- Reduced manual errors
- Better sales analysis
- Improved stock management
- Scalable MERN application

---

## 👨‍💻 Author

**Your Name**

Final Year Project

Smart Retail Inventory Management System

---

## 📄 License

This project is developed for educational purposes as a Final Year Software Engineering / Cloud Computing project.
