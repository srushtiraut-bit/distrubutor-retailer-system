import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import ProtectedRoute from './components/common/ProtectedRoute';

import Login from './pages/auth/Login';
import Signup from './pages/auth/Signup';
import Dashboard from './pages/distributor/Dashboard';
import ManageProducts from './pages/distributor/ManageProducts';
import ManageStock from './pages/distributor/ManageStock';
import IncomingOrders from './pages/distributor/IncomingOrders';
import ProfitLossReport from './pages/distributor/ProfitLossReport';
import Payments from './pages/distributor/Payments';
import RetailerDashboard from './pages/retailer/Dashboard';
import SelectDistributor from './pages/retailer/SelectDistributor';
import BrowseProducts from './pages/retailer/BrowseProducts';

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

          <Route
            path="/retailer/dashboard"
            element={
              <ProtectedRoute allowedRole="retailer">
                <RetailerDashboard />
              </ProtectedRoute>
            }
          />

          <Route
            path="/retailer/select-distributor"
            element={
              <ProtectedRoute allowedRole="retailer">
                <SelectDistributor />
              </ProtectedRoute>
            }
          />
          <Route
            path="/retailer/browse-products/:distributorId"
            element={
              <ProtectedRoute allowedRole="retailer">
                <BrowseProducts />
              </ProtectedRoute>
            }
          />
        </Routes>
      </BrowserRouter>
    </AuthProvider>
  );
}

export default App;