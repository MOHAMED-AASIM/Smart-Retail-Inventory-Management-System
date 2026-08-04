import React, { useState, useEffect } from 'react';
import Navbar from '../components/Navbar';
import api from '../services/api';
import { Boxes, AlertCircle, CheckCircle, RefreshCw, ArrowUpRight, PlusCircle, MinusCircle } from 'lucide-react';

const Inventory = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [adjustmentQty, setAdjustmentQty] = useState('');
  const [actionType, setActionType] = useState('add'); // 'add' | 'subtract' | 'set'
  const [message, setMessage] = useState('');

  const fetchInventory = async () => {
    setLoading(true);
    try {
      const response = await api.get('/products');
      setProducts(response.data);
      if (response.data.length > 0 && !selectedProduct) {
        setSelectedProduct(response.data[0]);
      }
    } catch (err) {
      console.error('Failed to load inventory list', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchInventory();
  }, []);

  const handleStockUpdate = async (e) => {
    e.preventDefault();
    if (!selectedProduct || !adjustmentQty) return;

    try {
      const response = await api.put(`/inventory/${selectedProduct._id}/stock`, {
        quantity: Number(adjustmentQty),
        action: actionType
      });

      setMessage({
        type: 'success',
        text: `Stock for '${selectedProduct.productName}' updated to ${response.data.product.quantity} units.`
      });

      setAdjustmentQty('');
      fetchInventory();
    } catch (err) {
      setMessage({
        type: 'error',
        text: err.response?.data?.message || 'Stock update failed'
      });
    }
  };

  return (
    <div>
      <Navbar pageTitle="Inventory Stock Management" />

      <div className="page-body">
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 320px', gap: 24 }}>
          {/* Main Inventory Status Table */}
          <div className="glass-card">
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 20 }}>
              <div>
                <h3 style={{ fontWeight: 800, color: 'white', fontSize: '1.1rem' }}>Stock Status & Threshold Monitoring</h3>
                <span style={{ fontSize: '0.82rem', color: '#94a3b8' }}>Real-time physical stock levels</span>
              </div>
              <button onClick={fetchInventory} className="btn btn-secondary" style={{ padding: 8 }}>
                <RefreshCw size={14} />
              </button>
            </div>

            <div className="data-table-container">
              <table className="data-table">
                <thead>
                  <tr>
                    <th>Product</th>
                    <th>Category</th>
                    <th>Current Stock</th>
                    <th>Min Threshold</th>
                    <th>Alert Status</th>
                    <th>Action</th>
                  </tr>
                </thead>
                <tbody>
                  {loading ? (
                    <tr><td colSpan={6} style={{ textAlign: 'center', padding: 40, color: '#94a3b8' }}>Loading inventory...</td></tr>
                  ) : (
                    products.map(p => {
                      const isLow = p.quantity <= p.minStockLevel;
                      return (
                        <tr key={p._id}>
                          <td style={{ fontWeight: 700, color: 'white' }}>{p.productName}</td>
                          <td>{p.category}</td>
                          <td style={{ fontWeight: 800, fontSize: '1.05rem', color: isLow ? '#ef4444' : '#10b981' }}>
                            {p.quantity} units
                          </td>
                          <td style={{ color: '#94a3b8' }}>{p.minStockLevel} units</td>
                          <td>
                            <span className={`badge ${isLow ? 'badge-low-stock' : 'badge-optimal'}`}>
                              {isLow ? 'Low Stock' : 'Optimal'}
                            </span>
                          </td>
                          <td>
                            <button
                              onClick={() => setSelectedProduct(p)}
                              className="btn btn-secondary"
                              style={{ padding: '4px 10px', fontSize: '0.78rem' }}
                            >
                              Update Stock
                            </button>
                          </td>
                        </tr>
                      );
                    })
                  )}
                </tbody>
              </table>
            </div>
          </div>

          {/* Quick Adjustment Panel */}
          <div className="glass-card" style={{ height: 'fit-content' }}>
            <h3 style={{ fontWeight: 800, color: 'white', fontSize: '1.05rem', marginBottom: 16, display: 'flex', alignItems: 'center', gap: 8 }}>
              <Boxes size={18} color="#6366f1" />
              Adjust Stock Level
            </h3>

            {message && (
              <div style={{
                padding: 12,
                borderRadius: 8,
                fontSize: '0.84rem',
                marginBottom: 16,
                background: message.type === 'success' ? 'rgba(16, 185, 129, 0.15)' : 'rgba(239, 68, 68, 0.15)',
                border: `1px solid ${message.type === 'success' ? 'rgba(16, 185, 129, 0.4)' : 'rgba(239, 68, 68, 0.4)'}`,
                color: message.type === 'success' ? '#34d399' : '#f87171'
              }}>
                {message.text}
              </div>
            )}

            <form onSubmit={handleStockUpdate}>
              <div className="form-group">
                <label className="form-label">Select Target Product</label>
                <select
                  className="form-select"
                  value={selectedProduct?._id || ''}
                  onChange={(e) => {
                    const found = products.find(p => p._id === e.target.value);
                    setSelectedProduct(found);
                  }}
                  required
                >
                  {products.map(p => (
                    <option key={p._id} value={p._id}>
                      {p.productName} ({p.quantity} in stock)
                    </option>
                  ))}
                </select>
              </div>

              <div className="form-group">
                <label className="form-label">Update Action</label>
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 6 }}>
                  <button
                    type="button"
                    className={`btn ${actionType === 'add' ? 'btn-emerald' : 'btn-secondary'}`}
                    style={{ fontSize: '0.75rem', padding: 8 }}
                    onClick={() => setActionType('add')}
                  >
                    + Add
                  </button>
                  <button
                    type="button"
                    className={`btn ${actionType === 'subtract' ? 'btn-danger' : 'btn-secondary'}`}
                    style={{ fontSize: '0.75rem', padding: 8 }}
                    onClick={() => setActionType('subtract')}
                  >
                    - Subtract
                  </button>
                  <button
                    type="button"
                    className={`btn ${actionType === 'set' ? 'btn-primary' : 'btn-secondary'}`}
                    style={{ fontSize: '0.75rem', padding: 8 }}
                    onClick={() => setActionType('set')}
                  >
                    Set Equal
                  </button>
                </div>
              </div>

              <div className="form-group" style={{ marginBottom: 24 }}>
                <label className="form-label">Quantity</label>
                <input
                  type="number"
                  min="1"
                  className="form-input"
                  placeholder="Enter unit count..."
                  value={adjustmentQty}
                  onChange={(e) => setAdjustmentQty(e.target.value)}
                  required
                />
              </div>

              <button type="submit" className="btn btn-primary" style={{ width: '100%' }}>
                Apply Stock Adjustment
              </button>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Inventory;
