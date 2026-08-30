import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import Login from './pages/auth/Login';
import Signup from './pages/auth/Signup';
import Dashboard from './pages/distributor/Dashboard';
import ManageProducts from './pages/distributor/ManageProducts';
import ManageStock from './pages/distributor/ManageStock';
import IncomingOrders from './pages/distributor/IncomingOrders';
import ProfitLossReport from './pages/distributor/ProfitLossReport';
import Payments from './pages/distributor/Payments';

function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <Routes>
          <Route path="/login" element={<Login />} />
          <Route path="/signup" element={<Signup />} />
          <Route path="/distributor/dashboard" element={<Dashboard />} />
          <Route path="/distributor/products" element={<ManageProducts />} />
          <Route path="/distributor/stock" element={<ManageStock />} />
          <Route path="/distributor/orders" element={<IncomingOrders />} />
          <Route path="/distributor/profit-loss" element={<ProfitLossReport />} />
          <Route path="/distributor/payments" element={<Payments />} />
          <Route path="/" element={<Navigate to="/login" />} />
        </Routes>
      </BrowserRouter>
    </AuthProvider>
  );
}

export default App;