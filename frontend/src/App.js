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
<<<<<<< Updated upstream
import DoctorDashboard from './Pages/DoctorDashboard'; 
import DoctorAppointments from './Pages/DoctorAppointments';
import Reminders from './Pages/Reminders'; 
import Reports from './Pages/Reports';
import VideoConsultation from './Pages/VideoConsultation'; 
import Chat from './Pages/Chat'; 
=======
import Chat from './pages/Chat';
>>>>>>> Stashed changes

import UserTypeSelection from './Auth/UserTypeSelection'; // Import UserTypeSelection
import Appointment from './Appointment/Appointment'; // Import the Appointment component
import AdminAppointments from './Appointment/AdminAppointments';
import DoctorAvailability from './Appointment/DoctorAvailability ';

import DoctorDashboard from './pages/DoctorDashboard';
import DoctorRegister from './pages/DoctorRegister'; // Assuming registration is a separate component
import Appointments from './pages/Appointments';
import Patients from './pages/Patients';
import Reports from './pages/Reports';
import Settings from './pages/Settings';


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
      <Route path="/usertype" element={<UserTypeSelection />} />
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
        <Route path="/appointment" element={<Appointment />} /> {/* New Appointment route */}
        <Route path="/adminappointment" element={<AdminAppointments />} /> {/* New Appointment route */}
<<<<<<< Updated upstream
        <Route path="/doctor-availability" element={<DoctorAvailability />} />
        
        <Route path="/dashboard" element={<DoctorDashboard />} />
        <Route path="/doctorappointments" element={<DoctorAppointments />} />
        <Route path="/reminders" element={<Reminders />} />
        <Route path="/reports" element={<Reports />} />
        <Route path="/video-consultation" element={<VideoConsultation />} />
        <Route path="/chat" element={<Chat />} />
=======

        <Route path="/dashboard" element={<DoctorDashboard />} />
        <Route path="/chat" element={<Chat />} /> {/* Add the Chat route */}

        
        <Route path="/register" element={<DoctorRegister />} />
        <Route path="/register" element={<DoctorRegister />} />
        <Route path="/appointments" element={<Appointments />} />
        <Route path="/patients" element={<Patients />} />
        <Route path="/reports" element={<Reports />} />
        <Route path="/settings" element={<Settings />} />
    
>>>>>>> Stashed changes
      </Routes>
    </Router>
  );
}

export default App;
