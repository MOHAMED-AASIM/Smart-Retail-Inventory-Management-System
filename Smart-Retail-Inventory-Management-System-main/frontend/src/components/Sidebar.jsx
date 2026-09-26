import React, { useContext } from 'react';
import { NavLink } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';
import {
  LayoutDashboard,
  Package,
  Boxes,
  ShoppingCart,
  Users,
  BarChart3,
  Store,
  LogOut
} from 'lucide-react';

const Sidebar = () => {
  const { user, logout } = useContext(AuthContext);

  const role = user?.role || 'employee';

  const navItems = [
    {
      name: 'Dashboard',
      path: '/dashboard',
      icon: LayoutDashboard,
      roles: ['admin', 'manager']
    },
    {
      name: 'Products',
      path: '/products',
      icon: Package,
      roles: ['admin', 'manager', 'employee']
    },
    {
      name: 'Inventory',
      path: '/inventory',
      icon: Boxes,
      roles: ['admin', 'manager', 'employee']
    },
    {
      name: 'Record Sale (POS)',
      path: '/sales',
      icon: ShoppingCart,
      roles: ['employee', 'admin']
    },
    {
      name: 'Suppliers',
      path: '/suppliers',
      icon: Users,
      roles: ['admin', 'manager']
    },
    {
      name: 'Reports & Analytics',
      path: '/reports',
      icon: BarChart3,
      roles: ['admin', 'manager']
    }
  ];

  const filteredNavItems = navItems.filter(item => item.roles.includes(role));

  return (
    <aside className="sidebar">
      <div className="brand-box">
        <div className="brand-icon">
          <Store size={22} />
        </div>
        <div>
          <h1 className="brand-title">SmartRetail</h1>
          <span style={{ fontSize: '0.72rem', color: '#94a3b8', display: 'block', fontWeight: 600 }}>
            INVENTORY OS v1.0
          </span>
        </div>
      </div>

      <nav style={{ flex: 1 }}>
        <ul className="nav-list">
          {filteredNavItems.map(item => {
            const Icon = item.icon;
            return (
              <li key={item.path} className="nav-item">
                <NavLink
                  to={item.path}
                  className={({ isActive }) => (isActive ? 'active' : '')}
                >
                  <Icon size={18} />
                  <span>{item.name}</span>
                </NavLink>
              </li>
            );
          })}
        </ul>
      </nav>

      <div className="user-info-card">
        <div className="user-avatar">
          {user?.name ? user.name.charAt(0).toUpperCase() : 'U'}
        </div>
        <div style={{ flex: 1, overflow: 'hidden' }}>
          <div style={{ fontWeight: 700, fontSize: '0.88rem', whiteSpace: 'nowrap', textOverflow: 'ellipsis', overflow: 'hidden' }}>
            {user?.name}
          </div>
          <span className={`badge badge-${role}`}>
            {role}
          </span>
        </div>
        <button
          onClick={logout}
          title="Sign Out"
          style={{ background: 'none', border: 'none', color: '#94a3b8', cursor: 'pointer', padding: 4 }}
        >
          <LogOut size={18} />
        </button>
      </div>
    </aside>
  );
};

export default Sidebar;
