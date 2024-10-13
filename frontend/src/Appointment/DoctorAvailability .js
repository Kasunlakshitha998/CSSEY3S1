// src/components/DoctorAvailability.js

import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import AdminNav from '../Navbar/Admin/AdminNav';
import Cookies from 'js-cookie';

const DoctorAvailability = () => {
  const [showForm, setShowForm] = useState(false);
  const [availabilityData, setAvailabilityData] = useState({
    doctorId: '',
    doctorName: '',
    specialization: '',
    date: '',
    startTime: '',
    endTime: '',
    isAvailable: true, // Assuming this is a boolean
  });
  const [loading, setLoading] = useState(false);
  const [availabilities, setAvailabilities] = useState([]);
  const [fetchingAvailabilities, setFetchingAvailabilities] = useState(true);
  const [user, setUser] = useState(null); // To store user information
  const [editingId, setEditingId] = useState(null); // To store the ID of the availability being edited

  useEffect(() => {
    const storedUser = JSON.parse(localStorage.getItem('user'));
    setUser(storedUser);

    const fetchAvailabilities = async () => {
      try {
        let res;
        if (storedUser.type === 'admin') {
          res = await axios.get('http://localhost:8500/doctor-availability');
        } else if (storedUser.type === 'doctor') {
          res = await axios.get(`http://localhost:8500/doctor-availability/doctor/${storedUser.id}`);
        } else {
          toast.error('Unauthorized access.');
          setFetchingAvailabilities(false);
          return;
        }
        setAvailabilities(res.data);
      } catch (err) {
        console.error(err);
        toast.error('Failed to fetch doctor availabilities.');
      } finally {
        setFetchingAvailabilities(false);
      }
    };

    fetchAvailabilities();
  }, []);

  const toggleForm = () => {
    setShowForm(!showForm);
    // Reset form fields if closing the form
    if (showForm) {
      resetForm();
    }
  };

  const resetForm = () => {
    setAvailabilityData({
      doctorId: '',
      doctorName: '',
      specialization: '',
      date: '',
      startTime: '',
      endTime: '',
      isAvailable: true,
    });
    setEditingId(null);
  };

  const handleChange = (e) => {
    setAvailabilityData({
      ...availabilityData,
      [e.target.name]: e.target.value,
    });
  };

  const validateForm = () => {
    const { doctorId, doctorName, specialization, date, startTime, endTime } = availabilityData;
    if (!doctorId || !doctorName || !specialization || !date || !startTime || !endTime) {
      toast.error('Please fill in all required fields.');
      return false;
    }
    return true;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validateForm()) return;

    setLoading(true);
    try {
      if (editingId) {
        // Update existing availability
        const res = await axios.put(`http://localhost:8500/doctor-availability/${editingId}`, availabilityData);
        toast.success('Doctor availability updated successfully!');
        setAvailabilities(availabilities.map(avail => (avail._id === editingId ? res.data : avail)));
      } else {
        // Add new availability
        const res = await axios.post('http://localhost:8500/doctor-availability', availabilityData, {
          headers: {
            'Content-Type': 'application/json',
          },
        });
        toast.success('Doctor availability added successfully!');
        setAvailabilities([...availabilities, res.data]);
      }

      resetForm();
      setShowForm(false);
    } catch (err) {
      console.error(err);
      toast.error(err.response?.data?.message || 'Failed to add/update availability.');
    } finally {
      setLoading(false);
    }
  };

  const handleEdit = (avail) => {
    setAvailabilityData({
      doctorId: avail.doctorId,
      doctorName: avail.doctorName,
      specialization: avail.specialization,
      date: avail.date,
      startTime: avail.startTime,
      endTime: avail.endTime,
      isAvailable: avail.isAvailable,
    });
    setEditingId(avail._id);
    setShowForm(true);
  };

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this availability?')) {
      try {
        await axios.delete(`http://localhost:8500/doctor-availability/${id}`);
        setAvailabilities(availabilities.filter(avail => avail._id !== id));
        toast.success('Doctor availability deleted successfully!');
      } catch (err) {
        console.error(err);
        toast.error('Failed to delete availability.');
      }
    }
  };

  return (
    <>
      <AdminNav />
      <div className="flex flex-col items-center justify-start min-h-screen bg-gray-50 p-4 pt-20">
        <h1 className="text-4xl font-bold mb-6 text-purple-600">Doctor Availability</h1>
        <button onClick={toggleForm} className="bg-indigo-600 text-white px-6 py-3 rounded-lg hover:bg-indigo-700 focus:outline-none transition-colors duration-300 mb-4">
          {showForm ? 'Cancel' : 'Add Availability'}
        </button>

        {showForm && (
          <form onSubmit={handleSubmit} className="bg-white p-6 rounded shadow-md w-full max-w-2xl mb-6">
            <div className="grid grid-cols-1 gap-4">
              <div>
                <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="doctorId">Doctor ID</label>
                <input type="text" name="doctorId" value={availabilityData.doctorId} onChange={handleChange} className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-indigo-500" required disabled={user && user.type === 'doctor'} />
              </div>
              <div>
                <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="doctorName">Doctor Name</label>
                <input type="text" name="doctorName" value={availabilityData.doctorName} onChange={handleChange} className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-indigo-500" required disabled={user && user.type === 'doctor'} />
              </div>
              <div>
                <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="specialization">Specialization</label>
                <input type="text" name="specialization" value={availabilityData.specialization} onChange={handleChange} className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-indigo-500" required disabled={user && user.type === 'doctor'} />
              </div>
              <div>
                <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="date">Date</label>
                <input type="date" name="date" value={availabilityData.date} onChange={handleChange} className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-indigo-500" required />
              </div>
              <div>
                <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="startTime">Start Time</label>
                <input type="time" name="startTime" value={availabilityData.startTime} onChange={handleChange} className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-indigo-500" required />
              </div>
              <div>
                <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="endTime">End Time</label>
                <input type="time" name="endTime" value={availabilityData.endTime} onChange={handleChange} className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-indigo-500" required />
              </div>
              <div className="flex items-center">
                <input type="checkbox" name="isAvailable" checked={availabilityData.isAvailable} onChange={() => setAvailabilityData({ ...availabilityData, isAvailable: !availabilityData.isAvailable })} className="mr-2" />
                <label className="text-gray-700 text-sm font-bold">Available</label>
              </div>
              <button type="submit" className="bg-indigo-600 text-white px-4 py-2 rounded-lg hover:bg-indigo-700 transition-colors duration-300" disabled={loading}>
                {loading ? 'Loading...' : (editingId ? 'Update Availability' : 'Add Availability')}
              </button>
            </div>
          </form>
        )}

        <h2 className="text-2xl font-bold text-purple-600 mb-4">Current Availabilities</h2>
        {fetchingAvailabilities ? (
          <p>Loading availabilities...</p>
        ) : (
          <table className=" w-auto bg-white shadow-md rounded-lg">
            <thead className="bg-indigo-600 text-white">
              <tr>
                <th className="py-3 px-4 text-left">Doctor Name</th>
                <th className="py-3 px-4 text-left">Specialization</th>
                <th className="py-3 px-4 text-left">Date</th>
                <th className="py-3 px-4 text-left">Start Time</th>
                <th className="py-3 px-4 text-left">End Time</th>
                <th className="py-3 px-4 text-left">Actions</th>
              </tr>
            </thead>
            <tbody>
              {availabilities.map(avail => (
                <tr key={avail._id} className="border-b hover:bg-gray-100">
                  <td className="py-2 px-4">{avail.doctorName}</td>
                  <td className="py-2 px-4">{avail.specialization}</td>
                  <td className="py-2 px-4">{new Date(avail.date).toLocaleDateString()}</td>
                  <td className="py-2 px-4">{avail.startTime}</td>
                  <td className="py-2 px-4">{avail.endTime}</td>
                  <td className="py-2 px-4">
                    <button onClick={() => handleEdit(avail)} className="bg-blue-600 text-white px-3 py-1 rounded-lg hover:bg-blue-700 focus:outline-none transition-colors duration-300 mr-2">
                      Edit
                    </button>
                    <button onClick={() => handleDelete(avail._id)} className="bg-red-600 text-white px-3 py-1 rounded-lg hover:bg-red-700 focus:outline-none transition-colors duration-300">
                      Delete
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
      <ToastContainer />
    </>
  );
};

export default DoctorAvailability;
