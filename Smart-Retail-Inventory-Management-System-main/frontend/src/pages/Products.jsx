import React, { useState, useEffect, useContext } from 'react';
import Navbar from '../components/Navbar';
import api from '../services/api';
import { AuthContext } from '../context/AuthContext';
import { Plus, Search, Filter, Edit, Trash2, Package, Tag, DollarSign, X } from 'lucide-react';

const Products = () => {
  const [products, setProducts] = useState([]);
  const [search, setSearch] = useState('');
  const [category, setCategory] = useState('All');
  const [loading, setLoading] = useState(true);

  // Modal State
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingProduct, setEditingProduct] = useState(null);
  const [formData, setFormData] = useState({
    productName: '',
    category: 'Electronics',
    price: '',
    quantity: '',
    minStockLevel: 10,
    supplier: 'General Supplier'
  });

  const { user } = useContext(AuthContext);
  const isAdmin = user?.role === 'admin';

  const fetchProducts = async () => {
    setLoading(true);
    try {
      const response = await api.get('/products', {
        params: { search, category: category !== 'All' ? category : '' }
      });
      setProducts(response.data);
    } catch (err) {
      console.error('Failed to fetch products', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProducts();
  }, [search, category]);

  const handleOpenCreateModal = () => {
    setEditingProduct(null);
    setFormData({
      productName: '',
      category: 'Electronics',
      price: '',
      quantity: '',
      minStockLevel: 10,
      supplier: 'General Supplier'
    });
    setIsModalOpen(true);
  };

  const handleOpenEditModal = (prod) => {
    setEditingProduct(prod);
    setFormData({
      productName: prod.productName,
      category: prod.category,
      price: prod.price,
      quantity: prod.quantity,
      minStockLevel: prod.minStockLevel,
      supplier: prod.supplier || 'General Supplier'
    });
    setIsModalOpen(true);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (editingProduct) {
        await api.put(`/products/${editingProduct._id}`, formData);
      } else {
        await api.post('/products', formData);
      }
      setIsModalOpen(false);
      fetchProducts();
    } catch (err) {
      alert(err.response?.data?.message || 'Error saving product');
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Are you sure you want to delete this product?')) return;
    try {
      await api.delete(`/products/${id}`);
      fetchProducts();
    } catch (err) {
      alert(err.response?.data?.message || 'Error deleting product');
    }
  };

  const categories = ['All', 'Electronics', 'Beverages', 'Groceries', 'Footwear', 'Apparel', 'Accessories'];

  return (
    <div>
      <Navbar pageTitle="Product Catalog" />

      <div className="page-body">
        {/* Controls Bar */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 24, flexWrap: 'wrap', gap: 16 }}>
          <div style={{ display: 'flex', gap: 12, flex: 1, minWidth: 300 }}>
            {/* Search Input */}
            <div style={{ position: 'relative', flex: 1 }}>
              <Search size={18} style={{ position: 'absolute', left: 14, top: 14, color: '#64748b' }} />
              <input
                type="text"
                className="form-input"
                style={{ paddingLeft: 42 }}
                placeholder="Search products by name, category, or supplier..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
              />
            </div>

            {/* Category Filter */}
            <div style={{ position: 'relative', width: 180 }}>
              <Filter size={18} style={{ position: 'absolute', left: 14, top: 14, color: '#64748b' }} />
              <select
                className="form-select"
                style={{ paddingLeft: 42 }}
                value={category}
                onChange={(e) => setCategory(e.target.value)}
              >
                {categories.map(c => (
                  <option key={c} value={c}>{c}</option>
                ))}
              </select>
            </div>
          </div>

          {isAdmin && (
            <button onClick={handleOpenCreateModal} className="btn btn-primary">
              <Plus size={18} />
              <span>Add New Product</span>
            </button>
          )}
        </div>

        {/* Products Table */}
        <div className="glass-card">
          <div className="data-table-container">
            <table className="data-table">
              <thead>
                <tr>
                  <th>Product Name</th>
                  <th>Category</th>
                  <th>Price</th>
                  <th>Available Stock</th>
                  <th>Min Level</th>
                  <th>Supplier</th>
                  <th>Stock Status</th>
                  {isAdmin && <th>Actions</th>}
                </tr>
              </thead>
              <tbody>
                {loading ? (
                  <tr>
                    <td colSpan={isAdmin ? 8 : 7} style={{ textAlign: 'center', padding: 40, color: '#94a3b8' }}>
                      Loading product catalog...
                    </td>
                  </tr>
                ) : products.length === 0 ? (
                  <tr>
                    <td colSpan={isAdmin ? 8 : 7} style={{ textAlign: 'center', padding: 40, color: '#94a3b8' }}>
                      No products found matching filters.
                    </td>
                  </tr>
                ) : (
                  products.map(p => {
                    const isLow = p.quantity <= p.minStockLevel;
                    return (
                      <tr key={p._id}>
                        <td style={{ fontWeight: 700, color: '#f8fafc' }}>{p.productName}</td>
                        <td>
                          <span style={{ background: 'rgba(255,255,255,0.06)', padding: '4px 10px', borderRadius: 6, fontSize: '0.82rem', fontWeight: 600 }}>
                            {p.category}
                          </span>
                        </td>
                        <td style={{ fontWeight: 700, color: '#10b981' }}>${p.price.toFixed(2)}</td>
                        <td style={{ fontWeight: 700, fontSize: '1rem' }}>{p.quantity} units</td>
                        <td style={{ color: '#94a3b8' }}>{p.minStockLevel}</td>
                        <td style={{ color: '#cbd5e1' }}>{p.supplier || 'General Supplier'}</td>
                        <td>
                          <span className={`badge ${isLow ? 'badge-low-stock' : 'badge-optimal'}`}>
                            {isLow ? 'Low Stock' : 'In Stock'}
                          </span>
                        </td>
                        {isAdmin && (
                          <td>
                            <div style={{ display: 'flex', gap: 8 }}>
                              <button
                                onClick={() => handleOpenEditModal(p)}
                                className="btn btn-secondary"
                                style={{ padding: '6px 10px' }}
                                title="Edit Product"
                              >
                                <Edit size={14} />
                              </button>
                              <button
                                onClick={() => handleDelete(p._id)}
                                className="btn btn-danger"
                                style={{ padding: '6px 10px' }}
                                title="Delete Product"
                              >
                                <Trash2 size={14} />
                              </button>
                            </div>
                          </td>
                        )}
                      </tr>
                    );
                  })
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      {/* Modal for Create/Edit */}
      {isModalOpen && (
        <div className="modal-overlay" onClick={() => setIsModalOpen(false)}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 20 }}>
              <h3 style={{ fontWeight: 800, color: 'white', fontSize: '1.2rem' }}>
                {editingProduct ? 'Edit Product Entry' : 'Add New Product'}
              </h3>
              <button onClick={() => setIsModalOpen(false)} style={{ background: 'none', border: 'none', color: '#94a3b8', cursor: 'pointer' }}>
                <X size={20} />
              </button>
            </div>

            <form onSubmit={handleSubmit}>
              <div className="form-group">
                <label className="form-label">Product Name</label>
                <input
                  type="text"
                  className="form-input"
                  value={formData.productName}
                  onChange={(e) => setFormData({ ...formData, productName: e.target.value })}
                  required
                />
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 }}>
                <div className="form-group">
                  <label className="form-label">Category</label>
                  <select
                    className="form-select"
                    value={formData.category}
                    onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                  >
                    <option value="Electronics">Electronics</option>
                    <option value="Beverages">Beverages</option>
                    <option value="Groceries">Groceries</option>
                    <option value="Footwear">Footwear</option>
                    <option value="Apparel">Apparel</option>
                    <option value="Accessories">Accessories</option>
                  </select>
                </div>

                <div className="form-group">
                  <label className="form-label">Unit Price ($)</label>
                  <input
                    type="number"
                    step="0.01"
                    className="form-input"
                    value={formData.price}
                    onChange={(e) => setFormData({ ...formData, price: e.target.value })}
                    required
                  />
                </div>
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 }}>
                <div className="form-group">
                  <label className="form-label">Initial Quantity</label>
                  <input
                    type="number"
                    className="form-input"
                    value={formData.quantity}
                    onChange={(e) => setFormData({ ...formData, quantity: e.target.value })}
                    required
                  />
                </div>

                <div className="form-group">
                  <label className="form-label">Min Stock Threshold</label>
                  <input
                    type="number"
                    className="form-input"
                    value={formData.minStockLevel}
                    onChange={(e) => setFormData({ ...formData, minStockLevel: e.target.value })}
                    required
                  />
                </div>
              </div>

              <div className="form-group" style={{ marginBottom: 24 }}>
                <label className="form-label">Supplier Name</label>
                <input
                  type="text"
                  className="form-input"
                  value={formData.supplier}
                  onChange={(e) => setFormData({ ...formData, supplier: e.target.value })}
                />
              </div>

              <div style={{ display: 'flex', gap: 12, justifyContent: 'flex-end' }}>
                <button type="button" onClick={() => setIsModalOpen(false)} className="btn btn-secondary">
                  Cancel
                </button>
                <button type="submit" className="btn btn-primary">
                  {editingProduct ? 'Update Product' : 'Save Product'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default Products;
