import React, { useState, useEffect, useContext } from 'react';
import Navbar from '../components/Navbar';
import api from '../services/api';
import { AuthContext } from '../context/AuthContext';
import { Users, Plus, Phone, MapPin, Mail, Package, X, Trash2, Edit } from 'lucide-react';

const Suppliers = () => {
  const [suppliers, setSuppliers] = useState([]);
  const [loading, setLoading] = useState(true);

  // Modal State
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingSupplier, setEditingSupplier] = useState(null);
  const [formData, setFormData] = useState({
    supplierName: '',
    contact: '',
    address: '',
    email: '',
    categories: ''
  });

  const { user } = useContext(AuthContext);
  const isAdmin = user?.role === 'admin';

  const fetchSuppliers = async () => {
    setLoading(true);
    try {
      const response = await api.get('/suppliers');
      setSuppliers(response.data);
    } catch (err) {
      console.error('Failed to fetch suppliers', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchSuppliers();
  }, []);

  const handleOpenCreateModal = () => {
    setEditingSupplier(null);
    setFormData({
      supplierName: '',
      contact: '',
      address: '',
      email: '',
      categories: ''
    });
    setIsModalOpen(true);
  };

  const handleOpenEditModal = (sup) => {
    setEditingSupplier(sup);
    setFormData({
      supplierName: sup.supplierName,
      contact: sup.contact,
      address: sup.address,
      email: sup.email || '',
      categories: Array.isArray(sup.categories) ? sup.categories.join(', ') : ''
    });
    setIsModalOpen(true);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (editingSupplier) {
        await api.put(`/suppliers/${editingSupplier._id}`, formData);
      } else {
        await api.post('/suppliers', formData);
      }
      setIsModalOpen(false);
      fetchSuppliers();
    } catch (err) {
      alert(err.response?.data?.message || 'Error saving supplier');
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Delete supplier?')) return;
    try {
      await api.delete(`/suppliers/${id}`);
      fetchSuppliers();
    } catch (err) {
      alert(err.response?.data?.message || 'Error deleting supplier');
    }
  };

  return (
    <div>
      <Navbar pageTitle="Supplier Management" />

      <div className="page-body">
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 24 }}>
          <div>
            <h3 style={{ fontWeight: 800, color: 'white', fontSize: '1.2rem' }}>Retail Suppliers Directory</h3>
            <span style={{ fontSize: '0.82rem', color: '#94a3b8' }}>Partner suppliers & inventory supply chains</span>
          </div>

          {isAdmin && (
            <button onClick={handleOpenCreateModal} className="btn btn-primary">
              <Plus size={18} />
              <span>Add New Supplier</span>
            </button>
          )}
        </div>

        {/* Suppliers Cards Grid */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: 20 }}>
          {suppliers.map(sup => (
            <div key={sup._id} className="glass-card" style={{ display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
              <div>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 16 }}>
                  <div>
                    <h4 style={{ fontWeight: 800, color: 'white', fontSize: '1.1rem' }}>{sup.supplierName}</h4>
                    <span style={{ fontSize: '0.78rem', color: '#6366f1', fontWeight: 700, textTransform: 'uppercase' }}>
                      {sup.productCount || 0} Linked Products
                    </span>
                  </div>
                  {isAdmin && (
                    <div style={{ display: 'flex', gap: 6 }}>
                      <button onClick={() => handleOpenEditModal(sup)} className="btn btn-secondary" style={{ padding: 6 }}>
                        <Edit size={14} />
                      </button>
                      <button onClick={() => handleDelete(sup._id)} className="btn btn-danger" style={{ padding: 6 }}>
                        <Trash2 size={14} />
                      </button>
                    </div>
                  )}
                </div>

                <div style={{ display: 'flex', flexDirection: 'column', gap: 10, fontSize: '0.88rem', color: '#cbd5e1', marginBottom: 20 }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                    <Phone size={16} color="#38bdf8" />
                    <span>{sup.contact}</span>
                  </div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                    <Mail size={16} color="#a855f7" />
                    <span>{sup.email || 'No email provided'}</span>
                  </div>
                  <div style={{ display: 'flex', alignItems: 'flex-start', gap: 10 }}>
                    <MapPin size={16} color="#10b981" style={{ marginTop: 3 }} />
                    <span>{sup.address}</span>
                  </div>
                </div>
              </div>

              {sup.products && sup.products.length > 0 && (
                <div style={{ borderTop: '1px solid var(--border-color)', paddingTop: 14, marginTop: 10 }}>
                  <div style={{ fontSize: '0.78rem', fontWeight: 700, color: '#94a3b8', textTransform: 'uppercase', marginBottom: 6 }}>
                    Supplied Products:
                  </div>
                  <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6 }}>
                    {sup.products.map((pName, idx) => (
                      <span key={idx} style={{ background: 'rgba(255,255,255,0.05)', padding: '4px 8px', borderRadius: 6, fontSize: '0.78rem', color: '#e2e8f0' }}>
                        {pName}
                      </span>
                    ))}
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>
      </div>

      {/* Modal for Supplier Create/Edit */}
      {isModalOpen && (
        <div className="modal-overlay" onClick={() => setIsModalOpen(false)}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 20 }}>
              <h3 style={{ fontWeight: 800, color: 'white', fontSize: '1.2rem' }}>
                {editingSupplier ? 'Edit Supplier Details' : 'Add New Supplier'}
              </h3>
              <button onClick={() => setIsModalOpen(false)} style={{ background: 'none', border: 'none', color: '#94a3b8', cursor: 'pointer' }}>
                <X size={20} />
              </button>
            </div>

            <form onSubmit={handleSubmit}>
              <div className="form-group">
                <label className="form-label">Supplier Business Name</label>
                <input
                  type="text"
                  className="form-input"
                  value={formData.supplierName}
                  onChange={(e) => setFormData({ ...formData, supplierName: e.target.value })}
                  required
                />
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 }}>
                <div className="form-group">
                  <label className="form-label">Contact Phone</label>
                  <input
                    type="text"
                    className="form-input"
                    value={formData.contact}
                    onChange={(e) => setFormData({ ...formData, contact: e.target.value })}
                    required
                  />
                </div>

                <div className="form-group">
                  <label className="form-label">Email Address</label>
                  <input
                    type="email"
                    className="form-input"
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  />
                </div>
              </div>

              <div className="form-group">
                <label className="form-label">Address</label>
                <input
                  type="text"
                  className="form-input"
                  value={formData.address}
                  onChange={(e) => setFormData({ ...formData, address: e.target.value })}
                  required
                />
              </div>

              <div className="form-group" style={{ marginBottom: 24 }}>
                <label className="form-label">Categories Supplied (Comma separated)</label>
                <input
                  type="text"
                  className="form-input"
                  placeholder="Electronics, Accessories"
                  value={formData.categories}
                  onChange={(e) => setFormData({ ...formData, categories: e.target.value })}
                />
              </div>

              <div style={{ display: 'flex', gap: 12, justifyContent: 'flex-end' }}>
                <button type="button" onClick={() => setIsModalOpen(false)} className="btn btn-secondary">
                  Cancel
                </button>
                <button type="submit" className="btn btn-primary">
                  {editingSupplier ? 'Update Supplier' : 'Save Supplier'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default Suppliers;
