import React from 'react';
import { AlertTriangle, ArrowRight } from 'lucide-react';
import { Link } from 'react-router-dom';

const LowStockBanner = ({ count, items }) => {
  if (!count || count === 0) return null;

  return (
    <div className="alert-banner">
      <div style={{ display: 'flex', alignItems: 'center', gap: 14 }}>
        <div style={{ background: 'rgba(239, 68, 68, 0.2)', padding: 10, borderRadius: '50%', color: '#f87171' }}>
          <AlertTriangle size={22} />
        </div>
        <div>
          <h4 style={{ fontWeight: 800, color: '#f87171', fontSize: '0.98rem' }}>
            Low Stock Warning ({count} {count === 1 ? 'item' : 'items'} require immediate restocking)
          </h4>
          <p style={{ fontSize: '0.84rem', color: '#cbd5e1', marginTop: 2 }}>
            Products: {items.map(i => `${i.productName} (${i.quantity} left)`).join(', ')}
          </p>
        </div>
      </div>

      <Link to="/inventory" className="btn btn-secondary" style={{ fontSize: '0.82rem', padding: '8px 14px' }}>
        <span>Manage Restock</span>
        <ArrowRight size={14} />
      </Link>
    </div>
  );
};

export default LowStockBanner;
