import React, { useState, useEffect } from 'react';
import Navbar from '../components/Navbar';
import api from '../services/api';
import { ShoppingCart, CheckCircle2, AlertCircle, DollarSign, Package, UserCheck } from 'lucide-react';

const Sales = () => {
  const [products, setProducts] = useState([]);
  const [selectedProductId, setSelectedProductId] = useState('');
  const [saleQuantity, setSaleQuantity] = useState(1);
  const [recentSales, setRecentSales] = useState([]);
  const [loading, setLoading] = useState(true);
  const [statusMsg, setStatusMsg] = useState(null);

  const fetchSalesData = async () => {
    setLoading(true);
    try {
      const [prodRes, salesRes] = await Promise.all([
        api.get('/products'),
        api.get('/sales')
      ]);
      setProducts(prodRes.data);
      setRecentSales(salesRes.data.sales || []);
      if (prodRes.data.length > 0 && !selectedProductId) {
        setSelectedProductId(prodRes.data[0]._id);
      }
    } catch (err) {
      console.error('Failed to load products/sales', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchSalesData();
  }, []);

  const activeProduct = products.find(p => p._id === selectedProductId);
  const calculatedTotal = (activeProduct && saleQuantity && !isNaN(saleQuantity)) ? (activeProduct.price * Number(saleQuantity)).toFixed(2) : '0.00';

  const handleRecordSale = async (e) => {
    e.preventDefault();
    if (!selectedProductId || saleQuantity < 1) return;

    try {
      const response = await api.post('/sales', {
        productId: selectedProductId,
        quantity: Number(saleQuantity)
      });

      setStatusMsg({
        type: 'success',
        text: `Sale recorded successfully! ${saleQuantity}x ${response.data.sale.productName} for $${response.data.sale.totalPrice}. Stock auto-updated!`
      });

      setSaleQuantity(1);
      fetchSalesData();
    } catch (err) {
      setStatusMsg({
        type: 'error',
        text: err.response?.data?.message || 'Failed to record sale transaction.'
      });
    }
  };

  return (
    <div>
      <Navbar pageTitle="Record Sale (POS)" />

      <div className="page-body">
        <div style={{ display: 'grid', gridTemplateColumns: '420px 1fr', gap: 24 }}>
          {/* Sale Entry Checkout Card */}
          <div className="glass-card">
            <h3 style={{ fontWeight: 800, color: 'white', fontSize: '1.15rem', marginBottom: 20, display: 'flex', alignItems: 'center', gap: 10 }}>
              <ShoppingCart size={22} color="#6366f1" />
              New Sale Transaction
            </h3>

            {statusMsg && (
              <div style={{
                padding: 14,
                borderRadius: 10,
                fontSize: '0.86rem',
                marginBottom: 20,
                background: statusMsg.type === 'success' ? 'rgba(16, 185, 129, 0.15)' : 'rgba(239, 68, 68, 0.15)',
                border: `1px solid ${statusMsg.type === 'success' ? 'rgba(16, 185, 129, 0.4)' : 'rgba(239, 68, 68, 0.4)'}`,
                color: statusMsg.type === 'success' ? '#34d399' : '#f87171'
              }}>
                {statusMsg.text}
              </div>
            )}

            <form onSubmit={handleRecordSale}>
              <div className="form-group">
                <label className="form-label">Select Product</label>
                <select
                  className="form-select"
                  value={selectedProductId}
                  onChange={(e) => setSelectedProductId(e.target.value)}
                  required
                >
                  {products.map(p => (
                    <option key={p._id} value={p._id} disabled={p.quantity === 0}>
                      {p.productName} — ${p.price.toFixed(2)} ({p.quantity === 0 ? 'OUT OF STOCK' : `${p.quantity} in stock`})
                    </option>
                  ))}
                </select>
              </div>

              {activeProduct && (
                <div style={{ background: 'rgba(255,255,255,0.03)', padding: 16, borderRadius: 10, marginBottom: 20, border: '1px solid var(--border-color)' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 6 }}>
                    <span style={{ color: '#94a3b8', fontSize: '0.85rem' }}>Unit Price:</span>
                    <strong style={{ color: '#10b981' }}>${activeProduct.price.toFixed(2)}</strong>
                  </div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 6 }}>
                    <span style={{ color: '#94a3b8', fontSize: '0.85rem' }}>Available Inventory:</span>
                    <strong style={{ color: activeProduct.quantity <= activeProduct.minStockLevel ? '#ef4444' : '#f8fafc' }}>
                      {activeProduct.quantity} units
                    </strong>
                  </div>
                  <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                    <span style={{ color: '#94a3b8', fontSize: '0.85rem' }}>Category:</span>
                    <span style={{ color: '#e2e8f0' }}>{activeProduct.category}</span>
                  </div>
                </div>
              )}

              <div className="form-group">
                <label className="form-label">Sale Quantity</label>
                <input
                  type="number"
                  min="1"
                  max={activeProduct ? activeProduct.quantity : 1}
                  className="form-input"
                  value={saleQuantity}
                  onChange={(e) => setSaleQuantity(e.target.value)}
                  required
                />
              </div>

              {/* Total Calculation Display */}
              <div style={{ background: 'linear-gradient(135deg, rgba(99, 102, 241, 0.2), rgba(168, 85, 247, 0.2))', padding: 20, borderRadius: 12, border: '1px solid rgba(99, 102, 241, 0.4)', textAlign: 'center', marginBottom: 24 }}>
                <div style={{ fontSize: '0.8rem', textTransform: 'uppercase', letterSpacing: 1, color: '#a5b4fc', fontWeight: 700 }}>
                  Computed Sale Total
                </div>
                <div style={{ fontSize: '2.4rem', fontWeight: 800, color: 'white', letterSpacing: '-1px', marginTop: 4 }}>
                  ${calculatedTotal}
                </div>
              </div>

              <button
                type="submit"
                className="btn btn-emerald"
                style={{ width: '100%', padding: 14, fontSize: '1rem' }}
                disabled={!activeProduct || activeProduct.quantity === 0}
              >
                <ShoppingCart size={18} />
                <span>Confirm & Log Sale</span>
              </button>
            </form>
          </div>

          {/* Sales Log History Table */}
          <div className="glass-card">
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 20 }}>
              <div>
                <h3 style={{ fontWeight: 800, color: 'white', fontSize: '1.1rem' }}>Recorded Sales Log</h3>
                <span style={{ fontSize: '0.82rem', color: '#94a3b8' }}>Real-time sales checkout history</span>
              </div>
            </div>

            <div className="data-table-container">
              <table className="data-table">
                <thead>
                  <tr>
                    <th>Product</th>
                    <th>Qty Sold</th>
                    <th>Unit Price</th>
                    <th>Total Price</th>
                    <th>Checkout Date</th>
                    <th>Staff</th>
                  </tr>
                </thead>
                <tbody>
                  {recentSales.map(s => (
                    <tr key={s._id}>
                      <td style={{ fontWeight: 700, color: 'white' }}>{s.productName}</td>
                      <td>{s.quantity} units</td>
                      <td>${s.unitPrice.toFixed(2)}</td>
                      <td style={{ fontWeight: 700, color: '#10b981' }}>${s.totalPrice.toFixed(2)}</td>
                      <td style={{ color: '#94a3b8', fontSize: '0.82rem' }}>{new Date(s.saleDate).toLocaleString()}</td>
                      <td><span className="badge badge-employee">{s.recordedBy}</span></td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Sales;
