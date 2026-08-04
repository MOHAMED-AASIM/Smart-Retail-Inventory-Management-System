const store = require('../store');

// @desc    Get all products (with optional search & category filter)
// @route   GET /api/products
// @access  All Roles
const getProducts = async (req, res) => {
  try {
    let result = [...store.products];

    const { search, category } = req.query;

    if (search) {
      const term = search.toLowerCase();
      result = result.filter(
        p =>
          p.productName.toLowerCase().includes(term) ||
          p.category.toLowerCase().includes(term) ||
          (p.supplier && p.supplier.toLowerCase().includes(term))
      );
    }

    if (category && category !== 'All') {
      result = result.filter(
        p => p.category.toLowerCase() === category.toLowerCase()
      );
    }

    res.json(result);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Get single product by ID
// @route   GET /api/products/:id
// @access  All Roles
const getProductById = async (req, res) => {
  try {
    const product = store.products.find(p => p._id === req.params.id);
    if (!product) {
      return res.status(404).json({ message: 'Product not found' });
    }
    res.json(product);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Create a new product
// @route   POST /api/products
// @access  Admin
const createProduct = async (req, res) => {
  try {
    const { productName, category, price, quantity, minStockLevel, supplier, supplierId } = req.body;

    if (!productName || !category || price === undefined || quantity === undefined) {
      return res.status(400).json({ message: 'Please provide all required product fields' });
    }

    const newProduct = {
      _id: `prod_${Date.now()}`,
      productName,
      category,
      price: Number(price),
      quantity: Number(quantity),
      minStockLevel: Number(minStockLevel !== undefined ? minStockLevel : 10),
      supplier: supplier || 'General Supplier',
      supplierId: supplierId || null,
      createdDate: new Date()
    };

    store.products.push(newProduct);

    res.status(201).json(newProduct);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Update a product
// @route   PUT /api/products/:id
// @access  Admin
const updateProduct = async (req, res) => {
  try {
    const productIndex = store.products.findIndex(p => p._id === req.params.id);
    if (productIndex === -1) {
      return res.status(404).json({ message: 'Product not found' });
    }

    const current = store.products[productIndex];
    const { productName, category, price, quantity, minStockLevel, supplier, supplierId } = req.body;

    const updatedProduct = {
      ...current,
      productName: productName !== undefined ? productName : current.productName,
      category: category !== undefined ? category : current.category,
      price: price !== undefined ? Number(price) : current.price,
      quantity: quantity !== undefined ? Number(quantity) : current.quantity,
      minStockLevel: minStockLevel !== undefined ? Number(minStockLevel) : current.minStockLevel,
      supplier: supplier !== undefined ? supplier : current.supplier,
      supplierId: supplierId !== undefined ? supplierId : current.supplierId
    };

    store.products[productIndex] = updatedProduct;

    res.json(updatedProduct);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Delete a product
// @route   DELETE /api/products/:id
// @access  Admin
const deleteProduct = async (req, res) => {
  try {
    const productIndex = store.products.findIndex(p => p._id === req.params.id);
    if (productIndex === -1) {
      return res.status(404).json({ message: 'Product not found' });
    }

    const deleted = store.products.splice(productIndex, 1);
    res.json({ message: 'Product removed successfully', product: deleted[0] });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = {
  getProducts,
  getProductById,
  createProduct,
  updateProduct,
  deleteProduct
};
