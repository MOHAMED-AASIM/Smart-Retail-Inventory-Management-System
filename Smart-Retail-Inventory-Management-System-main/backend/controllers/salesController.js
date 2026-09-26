const store = require('../store');

// @desc    Record a new sale (Atomic stock decrement & transaction logging)
// @route   POST /api/sales
// @access  Employee, Admin
const recordSale = async (req, res) => {
  try {
    const { productId, quantity } = req.body;

    if (!productId || !quantity || Number(quantity) <= 0) {
      return res.status(400).json({ message: 'Please provide a valid product ID and positive sale quantity' });
    }

    const product = store.products.find(p => p._id === productId);
    if (!product) {
      return res.status(404).json({ message: 'Product not found' });
    }

    const saleQty = Number(quantity);

    // Validate available stock
    if (product.quantity < saleQty) {
      return res.status(400).json({
        message: `Insufficient stock! Required: ${saleQty}, Available: ${product.quantity}`
      });
    }

    // Atomic decrement
    product.quantity -= saleQty;

    const totalPrice = Number((product.price * saleQty).toFixed(2));

    const newSale = {
      _id: `sale_${Date.now()}`,
      productId: product._id,
      productName: product.productName,
      quantity: saleQty,
      unitPrice: product.price,
      totalPrice,
      saleDate: new Date(),
      recordedBy: req.user ? req.user.name : 'Employee',
      recordedById: req.user ? req.user.id : null
    };

    store.sales.unshift(newSale); // Newest sales first

    const isLowStockNow = product.quantity <= product.minStockLevel;

    res.status(201).json({
      message: 'Sale recorded successfully',
      sale: newSale,
      updatedProduct: product,
      isLowStockAlert: isLowStockNow
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Get sales history log
// @route   GET /api/sales
// @access  Admin, Manager
const getSalesHistory = async (req, res) => {
  try {
    const totalRevenue = store.sales.reduce((sum, s) => sum + s.totalPrice, 0);
    const totalTransactions = store.sales.length;

    res.json({
      totalRevenue: Number(totalRevenue.toFixed(2)),
      totalTransactions,
      sales: store.sales
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = {
  recordSale,
  getSalesHistory
};
