const store = require('../store');

// @desc    Update stock quantity for a product
// @route   PUT /api/inventory/:id/stock
// @access  Admin, Employee
const updateStockQuantity = async (req, res) => {
  try {
    const { id } = req.params;
    const { quantity, action } = req.body; // action: 'set' | 'add' | 'subtract'

    const product = store.products.find(p => p._id === id);
    if (!product) {
      return res.status(404).json({ message: 'Product not found' });
    }

    let newQuantity = product.quantity;

    if (action === 'add') {
      newQuantity += Number(quantity);
    } else if (action === 'subtract') {
      if (product.quantity < Number(quantity)) {
        return res.status(400).json({ message: 'Insufficient stock available for subtraction' });
      }
      newQuantity -= Number(quantity);
    } else {
      // default 'set'
      newQuantity = Number(quantity);
    }

    if (newQuantity < 0) {
      return res.status(400).json({ message: 'Stock quantity cannot be negative' });
    }

    product.quantity = newQuantity;

    const isLowStock = product.quantity <= product.minStockLevel;

    res.json({
      message: 'Stock updated successfully',
      product,
      isLowStock
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Get low-stock products (where quantity <= minStockLevel)
// @route   GET /api/inventory/low-stock
// @access  All Roles
const getLowStockProducts = async (req, res) => {
  try {
    const lowStockItems = store.products.filter(
      p => p.quantity <= p.minStockLevel
    );
    res.json({
      count: lowStockItems.length,
      products: lowStockItems
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = {
  updateStockQuantity,
  getLowStockProducts
};
