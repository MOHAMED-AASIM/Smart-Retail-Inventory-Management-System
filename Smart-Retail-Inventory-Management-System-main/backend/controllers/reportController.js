const store = require('../store');

// @desc    Generate reports & dashboard analytics
// @route   GET /api/reports/:type
// @access  Admin, Manager
const getReports = async (req, res) => {
  try {
    const { type } = req.params;

    const totalProducts = store.products.length;
    const totalInventoryValue = store.products.reduce((sum, p) => sum + (p.price * p.quantity), 0);
    const totalItemsInStock = store.products.reduce((sum, p) => sum + p.quantity, 0);
    const lowStockItems = store.products.filter(p => p.quantity <= p.minStockLevel);
    const totalSalesRevenue = store.sales.reduce((sum, s) => sum + s.totalPrice, 0);
    const totalSalesCount = store.sales.length;

    if (type === 'dashboard') {
      // Monthly/Daily breakdown for charts
      const monthlySales = [
        { month: 'Jan', revenue: 1200, items: 35 },
        { month: 'Feb', revenue: 1900, items: 48 },
        { month: 'Mar', revenue: 1600, items: 40 },
        { month: 'Apr', revenue: 2400, items: 62 },
        { month: 'May', revenue: 2100, items: 55 },
        { month: 'Jun', revenue: 2800, items: 78 },
        { month: 'Jul', revenue: Number(totalSalesRevenue.toFixed(2)), items: totalSalesCount }
      ];

      const categoryDistribution = {};
      store.products.forEach(p => {
        categoryDistribution[p.category] = (categoryDistribution[p.category] || 0) + p.quantity;
      });

      return res.json({
        kpis: {
          totalProducts,
          totalInventoryValue: Number(totalInventoryValue.toFixed(2)),
          totalItemsInStock,
          lowStockCount: lowStockItems.length,
          totalSalesRevenue: Number(totalSalesRevenue.toFixed(2)),
          totalSalesCount
        },
        monthlySales,
        categoryDistribution,
        recentSales: store.sales.slice(0, 5),
        lowStockProducts: lowStockItems
      });
    }

    if (type === 'inventory') {
      return res.json({
        reportTitle: 'Inventory Stock & Valuation Report',
        generatedAt: new Date(),
        summary: {
          totalProducts,
          totalItemsInStock,
          totalInventoryValue: Number(totalInventoryValue.toFixed(2)),
          lowStockCount: lowStockItems.length
        },
        products: store.products.map(p => ({
          _id: p._id,
          productName: p.productName,
          category: p.category,
          price: p.price,
          quantity: p.quantity,
          minStockLevel: p.minStockLevel,
          totalValue: Number((p.price * p.quantity).toFixed(2)),
          status: p.quantity <= p.minStockLevel ? 'Low Stock' : 'Optimal'
        }))
      });
    }

    if (type === 'sales' || type === 'daily' || type === 'monthly') {
      return res.json({
        reportTitle: `${type.toUpperCase()} Sales Performance Report`,
        generatedAt: new Date(),
        summary: {
          totalRevenue: Number(totalSalesRevenue.toFixed(2)),
          totalTransactions: totalSalesCount,
          averageOrderValue: totalSalesCount ? Number((totalSalesRevenue / totalSalesCount).toFixed(2)) : 0
        },
        sales: store.sales
      });
    }

    if (type === 'performance') {
      // Top selling products logic
      const productSalesMap = {};
      store.sales.forEach(s => {
        if (!productSalesMap[s.productName]) {
          productSalesMap[s.productName] = { quantitySold: 0, revenue: 0 };
        }
        productSalesMap[s.productName].quantitySold += s.quantity;
        productSalesMap[s.productName].revenue += s.totalPrice;
      });

      const topProducts = Object.keys(productSalesMap).map(name => ({
        productName: name,
        quantitySold: productSalesMap[name].quantitySold,
        revenue: Number(productSalesMap[name].revenue.toFixed(2))
      })).sort((a, b) => b.revenue - a.revenue);

      return res.json({
        reportTitle: 'Product Performance & Top Sellers Analysis',
        generatedAt: new Date(),
        topProducts
      });
    }

    res.status(400).json({ message: `Unknown report type '${type}'` });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = { getReports };
