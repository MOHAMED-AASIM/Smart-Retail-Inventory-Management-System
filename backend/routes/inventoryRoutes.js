const express = require('express');
const router = express.Router();
const {
  updateStockQuantity,
  getLowStockProducts
} = require('../controllers/inventoryController');
const { protect, authorize } = require('../middleware/authMiddleware');

router.get('/low-stock', getLowStockProducts);
router.put('/:id/stock', protect, authorize('admin', 'employee'), updateStockQuantity);

module.exports = router;
