const bcrypt = require('bcryptjs');

class LocalStore {
  constructor() {
    this.users = [];
    this.products = [];
    this.sales = [];
    this.suppliers = [];
    this.initialized = false;
  }

  async init() {
    if (this.initialized) return;

    // Seed Users
    const salt = await bcrypt.genSalt(10);
    const defaultPassword = await bcrypt.hash('password123', salt);

    this.users = [
      {
        _id: 'user_admin_01',
        name: 'Sarah Connor (Admin)',
        email: 'admin@retail.com',
        password: defaultPassword,
        role: 'admin',
        createdAt: new Date()
      },
      {
        _id: 'user_manager_01',
        name: 'Michael Scott (Manager)',
        email: 'manager@retail.com',
        password: defaultPassword,
        role: 'manager',
        createdAt: new Date()
      },
      {
        _id: 'user_employee_01',
        name: 'Dwight Schrute (Employee)',
        email: 'employee@retail.com',
        password: defaultPassword,
        role: 'employee',
        createdAt: new Date()
      }
    ];

    // Seed Suppliers
    this.suppliers = [
      {
        _id: 'sup_01',
        supplierName: 'TechSource Logistics',
        contact: '+1 (555) 019-2834',
        address: '100 Silicon Way, Tech District, CA',
        email: 'contact@techsource.io',
        categories: ['Electronics', 'Accessories'],
        createdAt: new Date()
      },
      {
        _id: 'sup_02',
        supplierName: 'Organic Harvest Co.',
        contact: '+1 (555) 014-9988',
        address: '45 Green Valley Road, Austin, TX',
        email: 'sales@organicharvest.com',
        categories: ['Groceries', 'Beverages'],
        createdAt: new Date()
      },
      {
        _id: 'sup_03',
        supplierName: 'Urban Wear Distributors',
        contact: '+1 (555) 018-7711',
        address: '88 Fashion Avenue, New York, NY',
        email: 'info@urbanwear.com',
        categories: ['Apparel', 'Footwear'],
        createdAt: new Date()
      }
    ];

    // Seed Products
    this.products = [
      {
        _id: 'prod_01',
        productName: 'Wireless Noise-Canceling Headphones',
        category: 'Electronics',
        price: 199.99,
        quantity: 24,
        minStockLevel: 10,
        supplier: 'TechSource Logistics',
        supplierId: 'sup_01',
        createdDate: new Date(Date.now() - 30 * 86400000)
      },
      {
        _id: 'prod_02',
        productName: 'Smart Ergonomic Keyboard',
        category: 'Electronics',
        price: 129.50,
        quantity: 5, // LOW STOCK
        minStockLevel: 8,
        supplier: 'TechSource Logistics',
        supplierId: 'sup_01',
        createdDate: new Date(Date.now() - 25 * 86400000)
      },
      {
        _id: 'prod_03',
        productName: 'Ultra HD 4K Monitor 27"',
        category: 'Electronics',
        price: 349.00,
        quantity: 3, // LOW STOCK
        minStockLevel: 5,
        supplier: 'TechSource Logistics',
        supplierId: 'sup_01',
        createdDate: new Date(Date.now() - 20 * 86400000)
      },
      {
        _id: 'prod_04',
        productName: 'Organic Cold Brew Coffee (12 Pack)',
        category: 'Beverages',
        price: 32.99,
        quantity: 45,
        minStockLevel: 15,
        supplier: 'Organic Harvest Co.',
        supplierId: 'sup_02',
        createdDate: new Date(Date.now() - 15 * 86400000)
      },
      {
        _id: 'prod_05',
        productName: 'Artisan Matcha Powder 100g',
        category: 'Groceries',
        price: 24.00,
        quantity: 4, // LOW STOCK
        minStockLevel: 10,
        supplier: 'Organic Harvest Co.',
        supplierId: 'sup_02',
        createdDate: new Date(Date.now() - 10 * 86400000)
      },
      {
        _id: 'prod_06',
        productName: 'Breathable Running Shoes (Size 10)',
        category: 'Footwear',
        price: 89.99,
        quantity: 18,
        minStockLevel: 6,
        supplier: 'Urban Wear Distributors',
        supplierId: 'sup_03',
        createdDate: new Date(Date.now() - 5 * 86400000)
      }
    ];

    // Seed Historical Sales
    const now = Date.now();
    const dayMs = 86400000;

    this.sales = [
      {
        _id: 'sale_01',
        productId: 'prod_01',
        productName: 'Wireless Noise-Canceling Headphones',
        quantity: 2,
        unitPrice: 199.99,
        totalPrice: 399.98,
        saleDate: new Date(now - 6 * dayMs),
        recordedBy: 'Dwight Schrute (Employee)',
        recordedById: 'user_employee_01'
      },
      {
        _id: 'sale_02',
        productId: 'prod_04',
        productName: 'Organic Cold Brew Coffee (12 Pack)',
        quantity: 5,
        unitPrice: 32.99,
        totalPrice: 164.95,
        saleDate: new Date(now - 4 * dayMs),
        recordedBy: 'Dwight Schrute (Employee)',
        recordedById: 'user_employee_01'
      },
      {
        _id: 'sale_03',
        productId: 'prod_06',
        productName: 'Breathable Running Shoes (Size 10)',
        quantity: 1,
        unitPrice: 89.99,
        totalPrice: 89.99,
        saleDate: new Date(now - 2 * dayMs),
        recordedBy: 'Dwight Schrute (Employee)',
        recordedById: 'user_employee_01'
      },
      {
        _id: 'sale_04',
        productId: 'prod_02',
        productName: 'Smart Ergonomic Keyboard',
        quantity: 3,
        unitPrice: 129.50,
        totalPrice: 388.50,
        saleDate: new Date(now - 1 * dayMs),
        recordedBy: 'Dwight Schrute (Employee)',
        recordedById: 'user_employee_01'
      }
    ];

    this.initialized = true;
  }
}

const store = new LocalStore();
module.exports = store;
