const store = require('../store');

// @desc    Get all suppliers
// @route   GET /api/suppliers
// @access  Admin, Manager
const getSuppliers = async (req, res) => {
  try {
    const list = store.suppliers.map(sup => {
      const suppliedProds = store.products.filter(
        p => p.supplierId === sup._id || p.supplier === sup.supplierName
      );
      return {
        ...sup,
        productCount: suppliedProds.length,
        products: suppliedProds.map(p => p.productName)
      };
    });
    res.json(list);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Create a supplier
// @route   POST /api/suppliers
// @access  Admin
const createSupplier = async (req, res) => {
  try {
    const { supplierName, contact, address, email, categories } = req.body;

    if (!supplierName || !contact || !address) {
      return res.status(400).json({ message: 'Please provide supplier name, contact, and address' });
    }

    const newSupplier = {
      _id: `sup_${Date.now()}`,
      supplierName,
      contact,
      address,
      email: email || '',
      categories: Array.isArray(categories) ? categories : (categories ? categories.split(',') : []),
      createdAt: new Date()
    };

    store.suppliers.push(newSupplier);
    res.status(201).json(newSupplier);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Update a supplier
// @route   PUT /api/suppliers/:id
// @access  Admin
const updateSupplier = async (req, res) => {
  try {
    const index = store.suppliers.findIndex(s => s._id === req.params.id);
    if (index === -1) {
      return res.status(404).json({ message: 'Supplier not found' });
    }

    const current = store.suppliers[index];
    const { supplierName, contact, address, email, categories } = req.body;

    const updated = {
      ...current,
      supplierName: supplierName || current.supplierName,
      contact: contact || current.contact,
      address: address || current.address,
      email: email !== undefined ? email : current.email,
      categories: Array.isArray(categories) ? categories : (categories ? categories.split(',') : current.categories)
    };

    store.suppliers[index] = updated;
    res.json(updated);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Delete a supplier
// @route   DELETE /api/suppliers/:id
// @access  Admin
const deleteSupplier = async (req, res) => {
  try {
    const index = store.suppliers.findIndex(s => s._id === req.params.id);
    if (index === -1) {
      return res.status(404).json({ message: 'Supplier not found' });
    }

    const deleted = store.suppliers.splice(index, 1);
    res.json({ message: 'Supplier deleted successfully', supplier: deleted[0] });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = {
  getSuppliers,
  createSupplier,
  updateSupplier,
  deleteSupplier
};
