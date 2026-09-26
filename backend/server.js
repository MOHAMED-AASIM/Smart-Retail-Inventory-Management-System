const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
const store = require('./store');

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

// Initialize Store
store.init().then(() => {
  console.log('[Store] Seed data initialized successfully');
});

// Middleware
app.use(cors());
app.use(express.json());

// Request logger
app.use((req, res, next) => {
  console.log(`[API] ${req.method} ${req.url}`);
  next();
});

// Health check endpoint
app.get('/api/health', (req, res) => {
  res.json({
    status: 'OK',
    service: 'Smart Retail Inventory Management System API',
    timestamp: new Date()
  });
});

// Mount Routes
app.use('/api/auth', require('./routes/authRoutes'));
app.use('/api/products', require('./routes/productRoutes'));
app.use('/api/inventory', require('./routes/inventoryRoutes'));
app.use('/api/sales', require('./routes/salesRoutes'));
app.use('/api/suppliers', require('./routes/supplierRoutes'));
app.use('/api/reports', require('./routes/reportRoutes'));

// 404 Handler
app.use((req, res) => {
  res.status(404).json({ message: `Route '${req.originalUrl}' not found` });
});

// Global Error Handler
app.use(require('./middleware/errorHandler'));

app.listen(PORT, () => {
  console.log(`=======================================================`);
  console.log(`🚀 Smart Retail Backend Server running on port ${PORT}`);
  console.log(`   Health Check: http://localhost:${PORT}/api/health`);
  console.log(`=======================================================`);
});
