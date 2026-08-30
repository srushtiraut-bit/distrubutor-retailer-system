import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import ProtectedRoute from './components/common/ProtectedRoute';

import Login from './pages/auth/Login';
import Signup from './pages/auth/Signup';
import RetailerDashboard from './pages/retailer/Dashboard';
import SelectDistributor from './pages/retailer/SelectDistributor';
//import BrowseProducts from './pages/retailer/BrowseProducts';

function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <Routes>
          <Route path="/login" element={<Login />} />
          <Route path="/signup" element={<Signup />} />
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
        </Routes>
      </BrowserRouter>
    </AuthProvider>
  );
}

export default App;