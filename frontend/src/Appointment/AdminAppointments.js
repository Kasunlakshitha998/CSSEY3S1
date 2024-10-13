import React, { useEffect, useState } from 'react';
import axios from 'axios';
import AdminNav from '../Navbar/Admin/AdminNav';

const AdminAppointments = () => {
  const [appointments, setAppointments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  
  // State for the form fields
  const [formData, setFormData] = useState({
    patientId: '',
    patientName: '',
    email: '',
    date: '',
    time: '',
    hospitalname: '',
    doctorName: '',
    specialization: '',
  });
  
  // State for showing/hiding the create appointment form
  const [showCreateForm, setShowCreateForm] = useState(false);

  useEffect(() => {
    const fetchAppointments = async () => {
      try {
        const response = await axios.get('http://localhost:8500/appointments/');
        setAppointments(response.data);
        setLoading(false);
      } catch (err) {
        setError(err.message || 'Error fetching appointments');
        setLoading(false);
      }
    };

    fetchAppointments();
  }, []);

  const handleDelete = async (id) => {
    try {
      await axios.delete(`http://localhost:8500/appointments/${id}`);
      setAppointments((prev) => prev.filter((appointment) => appointment._id !== id));
    } catch (err) {
      setError(err.message || 'Error deleting appointment');
      console.error(err);
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleCreateAppointment = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post('http://localhost:8500/actual-appointments/', formData);
      setAppointments((prev) => [...prev, response.data]);
      setFormData({ patientId: '', patientName: '', email: '', date: '', time: '', hospitalname: '', doctorName: '', specialization: '' }); // Reset form
      setShowCreateForm(false); // Hide form after submission
    } catch (err) {
      setError(err.message || 'Error creating appointment');
      console.error(err);
    }
  };

  if (loading) return <div className="loading">Loading...</div>;
  if (error) return <div className="error">Error: {error}</div>;

  return (
    <>
    <AdminNav/>
    <div className="admin-container">
      <h2 className="admin-title">Appointment Requests</h2>
      <button onClick={() => setShowCreateForm(!showCreateForm)} className="create-button">
        {showCreateForm ? 'Cancel' : 'Create Appointment'}
      </button>

      {showCreateForm && (
        <form onSubmit={handleCreateAppointment} className="appointment-form">
          <h3>Create Appointment</h3>
          <input
            type="text"
            name="patientId"
            placeholder="Patient ID"
            value={formData.patientId}
            onChange={handleInputChange}
            required
          />
          <input
            type="text"
            name="patientName"
            placeholder="Patient Name"
            value={formData.patientName}
            onChange={handleInputChange}
            required
          />
          <input
            type="email"
            name="email"
            placeholder="Email"
            value={formData.email}
            onChange={handleInputChange}
            required
          />
          <input
            type="date"
            name="date"
            value={formData.date}
            onChange={handleInputChange}
            required
          />
          <input
            type="time"
            name="time"
            value={formData.time}
            onChange={handleInputChange}
            required
          />

          <input
            type="text"
            name="hospitalname"
            placeholder="hospitalname"
            value={formData.hospitalname}
            onChange={handleInputChange}
            required
          />
          <input
            type="text"
            name="doctorName"
            placeholder="Doctor Name"
            value={formData.doctorName}
            onChange={handleInputChange}
            required
          />
          <input
            type="text"
            name="specialization"
            placeholder="Specialization"
            value={formData.specialization}
            onChange={handleInputChange}
            required
          />
          <button type="submit" className="submit-button">Add Appointment</button>
        </form>
      )}

      <table className="admin-table">
        <thead>
          <tr>
            <th>Patient ID</th>
            <th>Patient Name</th>
            <th>Date</th>
            <th>Time</th>
            <th>Email</th> {/* New column for email */}
      
            <th>Action</th>
          </tr>
        </thead>
        <tbody>
          {appointments.map((appointment) => (
            <tr key={appointment._id}>
              <td>{appointment.patientId}</td>
              <td>{appointment.patientName}</td>
              <td>{appointment.date}</td>
              <td>{appointment.time}</td>
              <td>{appointment.email}</td> {/* Display email */}
          
              <td>
                <button
                  className="delete-button"
                  onClick={() => handleDelete(appointment._id)}
                >
                  Delete
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
      {error && <p className="error">{error}</p>} {/* Display error if any */}
      
      {/* Inline CSS for the component */}
      <style jsx>{`
        .admin-container {
          max-width: 1000px;
          margin: 0 auto;
          padding: 20px;
          text-align: center;
          background-color: #f9f9f9;
          border-radius: 8px;
          box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
        }

        .admin-title {
          font-size: 24px;
          font-weight: bold;
          margin-bottom: 20px;
          color: #333;
        }

        .create-button, .submit-button {
          padding: 10px 20px;
          margin: 10px 0;
          background-color: #4caf50;
          color: white;
          border: none;
          border-radius: 4px;
          cursor: pointer;
          transition: background-color 0.3s ease;
        }

        .create-button:hover, .submit-button:hover {
          background-color: #45a049;
        }

        .appointment-form {
          margin: 20px 0;
          padding: 20px;
          background-color: #fff;
          border-radius: 8px;
          box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
        }

        .appointment-form input {
          display: block;
          margin: 10px auto;
          padding: 10px;
          width: 80%;
          border: 1px solid #ccc;
          border-radius: 4px;
        }

        .admin-table {
          width: 100%;
          border-collapse: collapse;
          margin-bottom: 20px;
        }

        .admin-table th,
        .admin-table td {
          padding: 12px;
          border: 1px solid #ccc;
          text-align: left;
        }

        .admin-table th {
          background-color: #4caf50;
          color: white;
          text-transform: uppercase;
        }

        .admin-table tr:nth-child(even) {
          background-color: #f2f2f2;
        }

        .admin-table tr:hover {
          background-color: #ddd;
        }

        .delete-button {
          padding: 8px 12px;
          background-color: #ff4d4d;
          color: white;
          border: none;
          border-radius: 4px;
          cursor: pointer;
          transition: background-color 0.3s ease;
        }

        .delete-button:hover {
          background-color: #ff1a1a;
        }

        .loading,
        .error {
          font-size: 18px;
          color: #ff4d4d;
          margin-top: 20px;
        }
      `}</style>
    </div>
    </>
  );
};

export default AdminAppointments;
