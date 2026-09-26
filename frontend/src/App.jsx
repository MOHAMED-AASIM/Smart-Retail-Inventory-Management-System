import React, { useContext } from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, AuthContext } from './context/AuthContext';
import ProtectedRoute from './components/ProtectedRoute';
import Sidebar from './components/Sidebar';

import Login from './pages/Login';
import Register from './pages/Register';
import Dashboard from './pages/Dashboard';
import Products from './pages/Products';
import Inventory from './pages/Inventory';
import Sales from './pages/Sales';
import Suppliers from './pages/Suppliers';
import Reports from './pages/Reports';

const AppLayout = () => {
  return (
    <div className="app-container">
      <Sidebar />
      <main className="main-content">
        <Routes>
          {/* Dashboard for Admin & Manager */}
          <Route element={<ProtectedRoute allowedRoles={['admin', 'manager']} />}>
            <Route path="/dashboard" element={<Dashboard />} />
            <Route path="/suppliers" element={<Suppliers />} />
            <Route path="/reports" element={<Reports />} />
          </Route>

          {/* All authenticated roles */}
          <Route element={<ProtectedRoute allowedRoles={['admin', 'manager', 'employee']} />}>
            <Route path="/products" element={<Products />} />
            <Route path="/inventory" element={<Inventory />} />
          </Route>

          {/* Sales checkout POS for Employee & Admin */}
          <Route element={<ProtectedRoute allowedRoles={['employee', 'admin']} />}>
            <Route path="/sales" element={<Sales />} />
          </Route>

          {/* Fallback */}
          <Route path="*" element={<Navigate to="/dashboard" replace />} />
        </Routes>
      </main>
    </div>
  );
};

const RootNavigator = () => {
  const { user } = useContext(AuthContext);
  const defaultPath = user?.role === 'employee' ? '/products' : '/dashboard';

  return (
    <Routes>
      <Route path="/login" element={user ? <Navigate to={defaultPath} replace /> : <Login />} />
      <Route path="/register" element={user ? <Navigate to={defaultPath} replace /> : <Register />} />
      <Route path="/*" element={user ? <AppLayout /> : <Navigate to="/login" replace />} />
    </Routes>
  );
};

function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <RootNavigator />
      </BrowserRouter>
    </AuthProvider>
  );
}

export default App;
