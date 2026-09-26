import React, { useState, useContext } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';
import { Store, Lock, Mail, User, Shield, ArrowRight } from 'lucide-react';

const Register = () => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [role, setRole] = useState('employee');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const { register } = useContext(AuthContext);
  const navigate = useNavigate();

  const handleRegister = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    const result = await register(name, email, password, role);
    setLoading(false);

    if (result.success) {
      navigate('/dashboard');
    } else {
      setError(result.message);
    }
  };

  return (
    <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 20 }}>
      <div className="glass-card" style={{ width: '100%', maxWidth: 460, padding: 40, border: '1px solid var(--border-glow)' }}>
        <div style={{ textAlign: 'center', marginBottom: 28 }}>
          <div className="brand-icon" style={{ margin: '0 auto 16px auto', width: 56, height: 56, borderRadius: 16 }}>
            <Store size={30} />
          </div>
          <h2 style={{ fontSize: '1.6rem', fontWeight: 800, color: 'white' }}>Create Account</h2>
          <p style={{ fontSize: '0.88rem', color: '#94a3b8', marginTop: 4 }}>
            Register new staff persona for Smart Retail
          </p>
        </div>

        {error && (
          <div style={{ background: 'rgba(239, 68, 68, 0.15)', border: '1px solid rgba(239, 68, 68, 0.4)', color: '#f87171', padding: 12, borderRadius: 8, fontSize: '0.88rem', marginBottom: 20 }}>
            {error}
          </div>
        )}

        <form onSubmit={handleRegister}>
          <div className="form-group">
            <label className="form-label">Full Name</label>
            <div style={{ position: 'relative' }}>
              <User size={18} style={{ position: 'absolute', left: 14, top: 14, color: '#64748b' }} />
              <input
                type="text"
                className="form-input"
                style={{ paddingLeft: 42 }}
                placeholder="Alex Morgan"
                value={name}
                onChange={(e) => setName(e.target.value)}
                required
              />
            </div>
          </div>

          <div className="form-group">
            <label className="form-label">Email Address</label>
            <div style={{ position: 'relative' }}>
              <Mail size={18} style={{ position: 'absolute', left: 14, top: 14, color: '#64748b' }} />
              <input
                type="email"
                className="form-input"
                style={{ paddingLeft: 42 }}
                placeholder="alex@retail.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </div>
          </div>

          <div className="form-group">
            <label className="form-label">Password</label>
            <div style={{ position: 'relative' }}>
              <Lock size={18} style={{ position: 'absolute', left: 14, top: 14, color: '#64748b' }} />
              <input
                type="password"
                className="form-input"
                style={{ paddingLeft: 42 }}
                placeholder="Minimum 6 characters"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                minLength={6}
              />
            </div>
          </div>

          <div className="form-group" style={{ marginBottom: 28 }}>
            <label className="form-label">System Access Role</label>
            <div style={{ position: 'relative' }}>
              <Shield size={18} style={{ position: 'absolute', left: 14, top: 14, color: '#64748b' }} />
              <select
                className="form-select"
                style={{ paddingLeft: 42 }}
                value={role}
                onChange={(e) => setRole(e.target.value)}
              >
                <option value="employee">Employee (Record Sales, View Products)</option>
                <option value="manager">Manager (Dashboard, Analytics, Reports)</option>
                <option value="admin">Admin (Full Control, Products CRUD, Suppliers)</option>
              </select>
            </div>
          </div>

          <button type="submit" className="btn btn-primary" style={{ width: '100%', padding: 14 }} disabled={loading}>
            <span>{loading ? 'Creating User Account...' : 'Complete Registration'}</span>
            <ArrowRight size={18} />
          </button>
        </form>

        <div style={{ marginTop: 24, textAlign: 'center', fontSize: '0.85rem', color: '#94a3b8' }}>
          Already registered? <Link to="/login" style={{ color: '#6366f1', fontWeight: 600 }}>Sign In</Link>
        </div>
      </div>
    </div>
  );
};

export default Register;
