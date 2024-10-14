// DoctorAvailability.test.js

import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import DoctorAvailability from './DoctorAvailability';
import axios from 'axios';

// Mock axios
jest.mock('axios');

describe('DoctorAvailability Component', () => {
  const mockAvailabilityData = [
    { id: 1, date: '2024-10-15', time: '10:00 AM - 11:00 AM', doctor: 'Dr. Smith' },
    { id: 2, date: '2024-10-16', time: '01:00 PM - 02:00 PM', doctor: 'Dr. Jones' },
  ];

  test('renders availability data correctly', async () => {
    // Mock the GET request
    axios.get.mockResolvedValueOnce({ data: mockAvailabilityData });

    render(<DoctorAvailability />);

    // Expect loading text to be in the document
    expect(screen.getByText(/loading/i)).toBeInTheDocument();

    // Wait for the availability data to be displayed
    await waitFor(() => {
      expect(screen.getByText('Dr. Smith')).toBeInTheDocument();
      expect(screen.getByText('Dr. Jones')).toBeInTheDocument();
    });
  });

  test('displays an error message on failed data fetch', async () => {
    // Mock the GET request to simulate an error
    axios.get.mockRejectedValueOnce(new Error('Failed to fetch'));

    render(<DoctorAvailability />);

    // Expect loading text to be in the document
    expect(screen.getByText(/loading/i)).toBeInTheDocument();

    // Wait for the error message to be displayed
    await waitFor(() => {
      expect(screen.getByText(/failed to fetch doctor availabilities/i)).toBeInTheDocument();
    });
  });

  test('allows adding a new availability', async () => {
    // Mock the GET request
    axios.get.mockResolvedValueOnce({ data: mockAvailabilityData });

    // Mock the POST request
    axios.post.mockResolvedValueOnce({ data: { id: 3, date: '2024-10-17', time: '03:00 PM - 04:00 PM', doctor: 'Dr. Adams' } });

    render(<DoctorAvailability />);

    // Wait for the initial data to be displayed
    await waitFor(() => {
      expect(screen.getByText('Dr. Smith')).toBeInTheDocument();
    });

    // Simulate filling out and submitting the form
    fireEvent.change(screen.getByPlaceholderText(/date/i), { target: { value: '2024-10-17' } });
    fireEvent.change(screen.getByPlaceholderText(/time/i), { target: { value: '03:00 PM - 04:00 PM' } });
    fireEvent.change(screen.getByPlaceholderText(/doctor name/i), { target: { value: 'Dr. Adams' } });
    fireEvent.click(screen.getByText(/add availability/i));

    // Wait for the new entry to appear
    await waitFor(() => {
      expect(screen.getByText('Dr. Adams')).toBeInTheDocument();
    });
  });
});
