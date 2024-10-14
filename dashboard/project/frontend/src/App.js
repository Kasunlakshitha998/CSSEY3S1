import React from 'react';
import { BrowserRouter as Router, Route, Routes, Navigate } from 'react-router-dom';
import Login from './components/Login';
import Register from './components/Register';
import AdminDashboard from './components/AdminDashboard';
import PatientDashboard from './components/PatientDashboard';

const App = () => {
    const token = localStorage.getItem('token'); // Retrieve token from localStorage

   // Function to check if the user is an admin
    const isAdmin = () => {
        if (token) {
            const decoded = JSON.parse(atob(token.split('.')[1]));
            return decoded.role === 'admin';
        }
        return false;
    };

    return (
        <Router>
            <Routes>
                <Route path="/" element={<Login />} />
                <Route path="/register" element={<Register />} />
                {/* Protected Admin and Patient Routes */}
                <Route path="/admin" element={token && isAdmin() ? <AdminDashboard /> : <Navigate to="/" />} />
                <Route path="/patient" element={token && !isAdmin() ? <PatientDashboard /> : <Navigate to="/" />} />
            </Routes>
        </Router>
    );
};

export default App;
