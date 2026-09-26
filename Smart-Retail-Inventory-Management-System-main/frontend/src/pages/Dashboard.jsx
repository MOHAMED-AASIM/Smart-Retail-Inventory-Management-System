import React, { useState, useEffect } from 'react';
import Navbar from '../components/Navbar';
import StatCard from '../components/StatCard';
import LowStockBanner from '../components/LowStockBanner';
import api from '../services/api';
import { Package, Boxes, AlertTriangle, DollarSign, TrendingUp, RefreshCw } from 'lucide-react';
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, Cell } from 'recharts';

const Dashboard = () => {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);

  const fetchDashboardData = async () => {
    setLoading(true);
    try {
      const response = await api.get('/reports/dashboard');
      setData(response.data);
    } catch (err) {
      console.error('Failed to load dashboard metrics', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDashboardData();
  }, []);

  if (loading || !data) {
    return (
      <div>
        <Navbar pageTitle="Dashboard Analytics" />
        <div className="page-body" style={{ color: '#94a3b8', textAlign: 'center', paddingTop: 100 }}>
          Fetching real-time inventory and sales metrics...
        </div>
      </div>
    );
  }

  const { kpis, monthlySales, lowStockProducts, recentSales } = data;

  const barColors = ['#6366f1', '#818cf8', '#a5b4fc', '#c7d2fe', '#38bdf8', '#34d399', '#10b981'];

  return (
    <div>
      <Navbar pageTitle="Dashboard Analytics" />

      <div className="page-body">
        {/* Low Stock Warning Banner */}
        <LowStockBanner count={kpis.lowStockCount} items={lowStockProducts} />

        {/* Top Metric Cards */}
        <div className="stats-grid">
          <StatCard
            title="Total Products"
            value={kpis.totalProducts}
            icon={Package}
            accentColor="#6366f1"
            trend={{ isPositive: true, text: 'Active Catalog' }}
          />
          <StatCard
            title="Items In Stock"
            value={kpis.totalItemsInStock}
            icon={Boxes}
            accentColor="#10b981"
            trend={{ isPositive: true, text: `Valued at $${kpis.totalInventoryValue.toLocaleString()}` }}
          />
          <StatCard
            title="Low Stock Items"
            value={kpis.lowStockCount}
            icon={AlertTriangle}
            accentColor="#ef4444"
            trend={{ isPositive: kpis.lowStockCount === 0, text: kpis.lowStockCount > 0 ? 'Requires Restock' : 'Optimal Stock' }}
          />
          <StatCard
            title="Total Revenue"
            value={`$${kpis.totalSalesRevenue.toLocaleString()}`}
            icon={DollarSign}
            accentColor="#a855f7"
            trend={{ isPositive: true, text: `${kpis.totalSalesCount} Orders Recorded` }}
          />
        </div>

        {/* Charts Section */}
        <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr', gap: 24, marginBottom: 32 }}>
          {/* Revenue Chart */}
          <div className="glass-card">
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 20 }}>
              <div>
                <h3 style={{ fontWeight: 800, color: 'white', fontSize: '1.05rem' }}>Sales Revenue Trend ($)</h3>
                <span style={{ fontSize: '0.8rem', color: '#94a3b8' }}>Monthly performance summary</span>
              </div>
              <button onClick={fetchDashboardData} className="btn btn-secondary" style={{ padding: 8 }}>
                <RefreshCw size={14} />
              </button>
            </div>
            <div style={{ height: 260 }}>
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={monthlySales}>
                  <XAxis dataKey="month" stroke="#64748b" />
                  <YAxis stroke="#64748b" />
                  <Tooltip
                    contentStyle={{ backgroundColor: '#1e293b', borderColor: '#334155', borderRadius: 8, color: '#fff' }}
                  />
                  <Bar dataKey="revenue" radius={[6, 6, 0, 0]}>
                    {monthlySales.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={barColors[index % barColors.length]} />
                    ))}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* Low Stock Quick Focus */}
          <div className="glass-card">
            <h3 style={{ fontWeight: 800, color: 'white', fontSize: '1.05rem', marginBottom: 16, display: 'flex', alignItems: 'center', gap: 8 }}>
              <AlertTriangle size={18} color="#ef4444" />
              Low Stock Items ({lowStockProducts.length})
            </h3>
            {lowStockProducts.length === 0 ? (
              <div style={{ padding: 30, textAlign: 'center', color: '#34d399', fontWeight: 600 }}>
                ✓ All inventory items are above minimum levels!
              </div>
            ) : (
              <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
                {lowStockProducts.map(p => (
                  <div key={p._id} style={{ background: 'rgba(255,255,255,0.03)', padding: '12px 16px', borderRadius: 10, display: 'flex', justifyContent: 'space-between', alignItems: 'center', border: '1px solid rgba(239, 68, 68, 0.2)' }}>
                    <div>
                      <div style={{ fontWeight: 700, fontSize: '0.88rem', color: 'white' }}>{p.productName}</div>
                      <div style={{ fontSize: '0.76rem', color: '#94a3b8' }}>Category: {p.category}</div>
                    </div>
                    <span className="badge badge-low-stock">
                      {p.quantity} / {p.minStockLevel} units
                    </span>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Recent Sales Log Table */}
        <div className="glass-card">
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 }}>
            <h3 style={{ fontWeight: 800, color: 'white', fontSize: '1.05rem' }}>Recent Sales Transactions</h3>
            <span style={{ fontSize: '0.8rem', color: '#94a3b8' }}>Latest logged checkout sales</span>
          </div>

          <div className="data-table-container">
            <table className="data-table">
              <thead>
                <tr>
                  <th>Product</th>
                  <th>Quantity</th>
                  <th>Unit Price</th>
                  <th>Total Revenue</th>
                  <th>Date & Time</th>
                  <th>Processed By</th>
                </tr>
              </thead>
              <tbody>
                {recentSales && recentSales.map(sale => (
                  <tr key={sale._id}>
                    <td style={{ fontWeight: 700, color: '#f8fafc' }}>{sale.productName}</td>
                    <td>{sale.quantity} units</td>
                    <td>${sale.unitPrice.toFixed(2)}</td>
                    <td style={{ fontWeight: 700, color: '#10b981' }}>${sale.totalPrice.toFixed(2)}</td>
                    <td style={{ color: '#94a3b8', fontSize: '0.84rem' }}>{new Date(sale.saleDate).toLocaleString()}</td>
                    <td><span className="badge badge-employee">{sale.recordedBy}</span></td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
