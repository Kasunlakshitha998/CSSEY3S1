// src/components/DoctorAvailability.test.js

import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import DoctorAvailability from './DoctorAvailability';
import axios from 'axios';
import '@testing-library/jest-dom/extend-expect';

// Mock axios
jest.mock('axios');

describe('DoctorAvailability Component', () => {
  const mockAvailabilityData = [
    {
      _id: '1',
      doctorId: 'D001',
      doctorName: 'Dr. Smith',
      specialization: 'Cardiology',
      date: '2024-10-15',
      startTime: '10:00',
      endTime: '11:00',
      isAvailable: true,
    },
    {
      _id: '2',
      doctorId: 'D002',
      doctorName: 'Dr. Jones',
      specialization: 'Neurology',
      date: '2024-10-16',
      startTime: '13:00',
      endTime: '14:00',
      isAvailable: true,
    },
  ];

  const newAvailability = {
    _id: '3',
    doctorId: 'D003',
    doctorName: 'Dr. Adams',
    specialization: 'Pediatrics',
    date: '2024-10-17',
    startTime: '15:00',
    endTime: '16:00',
    isAvailable: true,
  };

  beforeEach(() => {
    // Clear all mocks before each test
    jest.clearAllMocks();
  });

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
    axios.post.mockResolvedValueOnce({ data: newAvailability });

    render(<DoctorAvailability />);

    // Wait for the initial data to be displayed
    await waitFor(() => {
      expect(screen.getByText('Dr. Smith')).toBeInTheDocument();
    });

    // Click the "Add Availability" button to show the form
    fireEvent.click(screen.getByText(/add availability/i));

    // Fill out the form fields
    fireEvent.change(screen.getByLabelText(/doctor id/i), { target: { value: 'D003' } });
    fireEvent.change(screen.getByLabelText(/doctor name/i), { target: { value: 'Dr. Adams' } });
    fireEvent.change(screen.getByLabelText(/specialization/i), { target: { value: 'Pediatrics' } });
    fireEvent.change(screen.getByLabelText(/date/i), { target: { value: '2024-10-17' } });
    fireEvent.change(screen.getByLabelText(/start time/i), { target: { value: '15:00' } });
    fireEvent.change(screen.getByLabelText(/end time/i), { target: { value: '16:00' } });
    fireEvent.click(screen.getByLabelText(/available/i)); // Toggle availability if needed

    // Submit the form
    fireEvent.click(screen.getByText(/add availability/i));

    // Wait for the new entry to appear
    await waitFor(() => {
      expect(screen.getByText('Dr. Adams')).toBeInTheDocument();
    });
  });
});
