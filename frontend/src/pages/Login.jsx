import React, { useState, useContext } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';
import { Store, Lock, Mail, ArrowRight, Shield } from 'lucide-react';

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const { login } = useContext(AuthContext);
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    const result = await login(email, password);
    setLoading(false);

    if (result.success) {
      if (result.user.role === 'employee') {
        navigate('/products');
      } else {
        navigate('/dashboard');
      }
    } else {
      setError(result.message);
    }
  };

  const setDemoRole = (roleEmail) => {
    setEmail(roleEmail);
    setPassword('password123');
  };

  return (
    <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 20 }}>
      <div className="glass-card" style={{ width: '100%', maxWidth: 440, padding: 40, border: '1px solid var(--border-glow)' }}>
        <div style={{ textAlign: 'center', marginBottom: 32 }}>
          <div className="brand-icon" style={{ margin: '0 auto 16px auto', width: 56, height: 56, borderRadius: 16 }}>
            <Store size={30} />
          </div>
          <h2 style={{ fontSize: '1.6rem', fontWeight: 800, color: 'white' }}>Welcome Back</h2>
          <p style={{ fontSize: '0.88rem', color: '#94a3b8', marginTop: 4 }}>
            Smart Retail Inventory Management System
          </p>
        </div>

        {error && (
          <div style={{ background: 'rgba(239, 68, 68, 0.15)', border: '1px solid rgba(239, 68, 68, 0.4)', color: '#f87171', padding: 12, borderRadius: 8, fontSize: '0.88rem', marginBottom: 20 }}>
            {error}
          </div>
        )}

        <form onSubmit={handleLogin}>
          <div className="form-group">
            <label className="form-label">Email Address</label>
            <div style={{ position: 'relative' }}>
              <Mail size={18} style={{ position: 'absolute', left: 14, top: 14, color: '#64748b' }} />
              <input
                type="email"
                className="form-input"
                style={{ paddingLeft: 42 }}
                placeholder="name@retail.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </div>
          </div>

          <div className="form-group" style={{ marginBottom: 24 }}>
            <label className="form-label">Password</label>
            <div style={{ position: 'relative' }}>
              <Lock size={18} style={{ position: 'absolute', left: 14, top: 14, color: '#64748b' }} />
              <input
                type="password"
                className="form-input"
                style={{ paddingLeft: 42 }}
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
            </div>
          </div>

          <button type="submit" className="btn btn-primary" style={{ width: '100%', padding: 14 }} disabled={loading}>
            <span>{loading ? 'Authenticating...' : 'Sign In to Dashboard'}</span>
            <ArrowRight size={18} />
          </button>
        </form>

        <div style={{ marginTop: 32, paddingTop: 24, borderTop: '1px solid var(--border-color)' }}>
          <div style={{ fontSize: '0.8rem', fontWeight: 700, color: '#94a3b8', textTransform: 'uppercase', marginBottom: 12, display: 'flex', alignItems: 'center', gap: 6 }}>
            <Shield size={14} color="#6366f1" /> Quick Demo Role Switcher
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 8 }}>
            <button
              onClick={() => setDemoRole('admin@retail.com')}
              className="btn btn-secondary"
              style={{ fontSize: '0.75rem', padding: '8px 4px' }}
            >
              Admin
            </button>
            <button
              onClick={() => setDemoRole('manager@retail.com')}
              className="btn btn-secondary"
              style={{ fontSize: '0.75rem', padding: '8px 4px' }}
            >
              Manager
            </button>
            <button
              onClick={() => setDemoRole('employee@retail.com')}
              className="btn btn-secondary"
              style={{ fontSize: '0.75rem', padding: '8px 4px' }}
            >
              Employee
            </button>
          </div>
        </div>

        <div style={{ marginTop: 24, textAlign: 'center', fontSize: '0.85rem', color: '#94a3b8' }}>
          Don't have an account? <Link to="/register" style={{ color: '#6366f1', fontWeight: 600 }}>Register now</Link>
        </div>
      </div>
    </div>
  );
};

export default Login;
