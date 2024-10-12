// src/Appointment/Appointment.jsx

import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const Appointment = () => {
  const [showForm, setShowForm] = useState(false);
  const [appointmentData, setAppointmentData] = useState({
    patientId: '',  // Add patientId
    patientName: '', // Add patientName
    date: '',
    time: '',
    reason: '',
  });
  const [loading, setLoading] = useState(false);

  const toggleForm = () => setShowForm(!showForm);

  const handleChange = (e) => {
    setAppointmentData({
      ...appointmentData,
      [e.target.name]: e.target.value,
    });
  };

  const validateForm = () => {
    const { patientId, patientName, date, time, reason } = appointmentData;
    if (!patientId || !patientName || !date || !time || !reason) {
      toast.error('Please fill in all fields.');
      return false;
    }
    return true;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validateForm()) return;

    setLoading(true);
    try {
      const res = await axios.post(
        'http://localhost:8500/appointments/create',
        appointmentData,
        {
          headers: {
            'Content-Type': 'application/json',
          },
        }
      );
      toast.success('Appointment requested successfully!');
      setAppointmentData({ patientId: '', patientName: '', date: '', time: '', reason: '' });
      setShowForm(false);
    } catch (err) {
      console.error(err.response?.data || err.message);
      toast.error(err.response?.data?.message || 'Failed to request appointment.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100 p-4">
      <h1 className="text-4xl font-bold mb-6 text-purple-600">Appointment Page</h1>
      <button
        onClick={toggleForm}
        className="bg-indigo-500 text-white px-4 py-2 rounded-lg hover:bg-indigo-600 focus:outline-none transition-colors duration-300"
      >
        {showForm ? 'Cancel' : 'Request Appointment'}
      </button>

      {showForm && (
        <form onSubmit={handleSubmit} className="mt-6 bg-white p-6 rounded shadow-md w-full max-w-md">
          <div className="mb-4">
            <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="patientId">
              Patient ID
            </label>
            <input
              type="text"
              name="patientId"
              value={appointmentData.patientId}
              onChange={handleChange}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-indigo-500"
              required
            />
          </div>
          <div className="mb-4">
            <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="patientName">
              Patient Name
            </label>
            <input
              type="text"
              name="patientName"
              value={appointmentData.patientName}
              onChange={handleChange}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-indigo-500"
              required
            />
          </div>
          {/* Existing fields for date, time, and reason */}
          <div className="mb-4">
            <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="date">
              Date
            </label>
            <input
              type="date"
              name="date"
              value={appointmentData.date}
              onChange={handleChange}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-indigo-500"
              required
            />
          </div>
          <div className="mb-4">
            <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="time">
              Phone Number
            </label>
            <input
              type="text"
              name="time"
              value={appointmentData.time}
              onChange={handleChange}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-indigo-500"
              required
            />
          </div>
          <div className="mb-4">
            <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="reason">
              Reason for appointment
            </label>
            <textarea
              name="reason"
              value={appointmentData.reason}
              onChange={handleChange}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-indigo-500"
              placeholder="Enter the reason for your appointment"
              required
            />
          </div>
          <button
            type="submit"
            className="bg-indigo-500 text-white px-4 py-2 rounded-lg hover:bg-indigo-600 focus:outline-none transition-colors duration-300 w-full"
            disabled={loading}
          >
            {loading ? 'Submitting...' : 'Submit'}
          </button>
        </form>
      )}

      <ToastContainer />
    </div>
  );
};

export default Appointment;
