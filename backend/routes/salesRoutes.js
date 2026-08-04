const express = require('express');
const router = express.Router();
const { recordSale, getSalesHistory } = require('../controllers/salesController');
const { protect, authorize } = require('../middleware/authMiddleware');

// Employees can record sales
router.post('/', protect, authorize('employee', 'admin'), recordSale);

// Admin & Manager can view sales history
router.get('/', protect, authorize('admin', 'manager'), getSalesHistory);

module.exports = router;
