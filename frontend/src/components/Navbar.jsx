import React, { useContext } from 'react';
import { AuthContext } from '../context/AuthContext';
import { Bell, ShieldCheck } from 'lucide-react';

const Navbar = ({ pageTitle }) => {
  const { user } = useContext(AuthContext);

  return (
    <header className="top-navbar">
      <div>
        <h2 style={{ fontSize: '1.25rem', fontWeight: 800, color: 'white', letterSpacing: '-0.5px' }}>
          {pageTitle}
        </h2>
        <span style={{ fontSize: '0.8rem', color: '#94a3b8' }}>
          Real-time Inventory Management Dashboard
        </span>
      </div>

      <div style={{ display: 'flex', alignItems: 'center', gap: '20px' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', background: 'rgba(255,255,255,0.05)', padding: '6px 14px', borderRadius: '20px', border: '1px solid rgba(255,255,255,0.1)' }}>
          <ShieldCheck size={16} color="#10b981" />
          <span style={{ fontSize: '0.82rem', fontWeight: 600, color: '#e2e8f0' }}>
            Role: <strong style={{ color: '#6366f1', textTransform: 'uppercase' }}>{user?.role}</strong>
          </span>
        </div>

        <div style={{ position: 'relative', cursor: 'pointer', padding: 8, borderRadius: '50%', background: 'rgba(255,255,255,0.05)' }}>
          <Bell size={18} color="#cbd5e1" />
          <span style={{ position: 'absolute', top: 4, right: 4, width: 8, height: 8, borderRadius: '50%', background: '#ef4444' }}></span>
        </div>
      </div>
    </header>
  );
};

export default Navbar;
