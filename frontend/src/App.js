import React, { useEffect, useState } from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import AddBill from './Billing/Admin/AddBill';
import BillList from './Billing/User/BillList';
import BillDetails from './Billing/User/BillDetails';
import PaymentPage from './Billing/User/PaymentPage';
import AllBill from './Billing/Admin/AllBill';
import Login from './Auth/Login';
import Register from './Auth/Register';
import AdminDash from './Home/AdminDash';
import UserDash from './Home/UserDash';
import ProtectedRoute from './Auth/ProtectedRoute';
import DoctorDash from './Home/DoctorDash';

function App() {

  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [user, setUser] = useState(null);

  useEffect(() => {
    // Restore authentication state from localStorage on page load
    const isAuthenticatedFromStorage =
      localStorage.getItem('isAuthenticated') === 'true';
    if (isAuthenticatedFromStorage) {
      setIsAuthenticated(true);
    }
  }, []); // This effect runs only once on component mount

  const handleLogin = (userData) => {
    setIsAuthenticated(true);
    setUser(userData);
    localStorage.setItem('isAuthenticated', 'true'); // Store 'true' as a string
    localStorage.setItem('user', JSON.stringify(userData)); // Store user as a JSON string
  };

  const handleLogout = () => {
    setIsAuthenticated(false);
    setUser(null);
    localStorage.removeItem('isAuthenticated');
    localStorage.removeItem('user');
  };

  return (
    <Router>
      <Routes>
        <Route path="/login" element={<Login onLogin={handleLogin} />} />
        <Route path="/register" element={<Register />} />
        <Route
          path="/"
          element={
            <ProtectedRoute
              isAuthenticated={isAuthenticated}
              user={user}
              requiredRole="user"
            >
              <UserDash handleLogout={handleLogout} />
            </ProtectedRoute>
          }
        />

        {/* Protected Admin Dashboard */}
        <Route
          path="/admin"
          element={
            <ProtectedRoute
              isAuthenticated={isAuthenticated}
              user={user}
              requiredRole="admin"
            >
              <AdminDash handleLogout={handleLogout} />
            </ProtectedRoute>
          }
        />

        <Route
          path="/doctor"
          element={
            <ProtectedRoute
              isAuthenticated={isAuthenticated}
              user={user}
              requiredRole="doctor"
            >
              <DoctorDash handleLogout={handleLogout} />
            </ProtectedRoute>
          }
        />

        <Route path="/AddNewBill" element={<AddBill />} />
        <Route path="/bill" element={<BillList />} />
        <Route path="/billDetails/:billId" element={<BillDetails />} />
        <Route path="/payment" element={<PaymentPage />} />
        <Route path="/AllBill" element={<AllBill />} />
      </Routes>
    </Router>
  );
}

export default App;
