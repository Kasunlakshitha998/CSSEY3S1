// /frontend/src/components/Login.js
import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

const Login = () => {
    const [formData, setFormData] = useState({
        username: '',
        password: ''
    });
    const navigate = useNavigate();

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        axios.post('http://localhost:5000/api/user/login', formData)
            .then(response => {
                localStorage.setItem('token', response.data.token);
                alert('Login successful!');
                

                const decoded = JSON.parse(atob(response.data.token.split('.')[1]));
                console.log('Decoded JWT:', decoded);
                if (decoded.role === 'admin') {
                    console.log('Navigating to admin...');
                    navigate('/admin');
                    window.location.reload();
                } else {
                    console.log('Navigating to patient...');
                    navigate('/patient');
                    window.location.reload();
                }
            })
            .catch(error => {
                console.error("Error during login!", error.response ? error.response.data : error.message);
                alert("Error: " + (error.response ? error.response.data.msg : error.message));
            });
    };

    return (
        <div>
            <form onSubmit={handleSubmit}>
                <input type="text" name="username" placeholder="Username" onChange={handleChange} required />
                <input type="password" name="password" placeholder="Password" onChange={handleChange} required />
                <button type="submit">Login</button>
            </form>
            <p>Not registered yet? <a href="/register">Register here</a></p> {/* Link to Register */}
        </div>
    );
};

export default Login;
