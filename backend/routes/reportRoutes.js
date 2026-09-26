const express = require('express');
const router = express.Router();
const { getReports } = require('../controllers/reportController');
const { protect, authorize } = require('../middleware/authMiddleware');

router.get('/:type', protect, authorize('admin', 'manager'), getReports);

module.exports = router;
