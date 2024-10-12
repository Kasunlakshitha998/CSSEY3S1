// components/AdminAppointments.jsx
import React, { useEffect, useState } from 'react';
import axios from 'axios';

const AdminAppointments = () => {
  const [appointments, setAppointments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchAppointments = async () => {
      try {
        const response = await axios.get('http://localhost:8500/appointments/'); // Adjust the path as necessary
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
      await axios.delete(`http://localhost:8500/appointments/${id}`); // Use the full URL
      setAppointments((prev) => prev.filter((appointment) => appointment._id !== id));
    } catch (err) {
      setError(err.message || 'Error deleting appointment');
      console.error(err);
    }
  };

  if (loading) return <div>Loading...</div>;
  if (error) return <div>Error: {error}</div>;

  return (
    <div>
      <h2>Appointment Requests</h2>
      <table style={{ width: '100%', borderCollapse: 'collapse' }}>
        <thead>
          <tr>
            <th style={{ border: '1px solid #ccc', padding: '8px' }}>Patient ID</th>
            <th style={{ border: '1px solid #ccc', padding: '8px' }}>Patient Name</th>
            <th style={{ border: '1px solid #ccc', padding: '8px' }}>Date</th>
            <th style={{ border: '1px solid #ccc', padding: '8px' }}>Phone Number</th>
            <th style={{ border: '1px solid #ccc', padding: '8px' }}>Action</th>
          </tr>
        </thead>
        <tbody>
          {appointments.map((appointment) => (
            <tr key={appointment._id}>
              <td style={{ border: '1px solid #ccc', padding: '8px' }}>{appointment.patientId}</td>
              <td style={{ border: '1px solid #ccc', padding: '8px' }}>{appointment.patientName}</td>
              <td style={{ border: '1px solid #ccc', padding: '8px' }}>{appointment.date}</td>
              <td style={{ border: '1px solid #ccc', padding: '8px' }}>{appointment.time}</td>
              <td style={{ border: '1px solid #ccc', padding: '8px' }}>
                <button onClick={() => handleDelete(appointment._id)}>Delete</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
      {error && <p style={{ color: 'red' }}>{error}</p>} {/* Display error if any */}
    </div>
  );
};

export default AdminAppointments;
