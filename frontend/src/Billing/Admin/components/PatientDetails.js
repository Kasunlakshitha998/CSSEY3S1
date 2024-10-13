import React, { useState, useEffect } from 'react';
import axios from 'axios';

const PatientDetails = ({
  patientName,
  setPatientName,
  patientID,
  setPatientID,
  appointmentID,
  setAppointmentID,
  errors, // pass errors for validation messages
  setErrors, // function to update error messages
}) => {
  const [suggestions, setSuggestions] = useState([]); // For patient name suggestions
  const [searching, setSearching] = useState(false); // Indicate search is in progress
  const [cachedUsers, setCachedUsers] = useState([]); // To store cached users

  // Handle input change for all fields
  const handleInputChange = (setter, field, value) => {
    setErrors((prevErrors) => ({ ...prevErrors, [field]: '' }));
    setter(value);
  };

  // Validate the patient name input
  const validatePatientName = (value) => {
    const isValid = /^[^0-9]*$/.test(value) || /[a-zA-Z]/.test(value); // Must contain at least one letter
    if (!isValid) {
      setErrors((prevErrors) => ({
        ...prevErrors,
        patientName:
          'Patient name cannot be only numbers and must contain at least one letter.',
      }));
    } else {
      setErrors((prevErrors) => ({
        ...prevErrors,
        patientName: '', // Clear error if valid
      }));
      setPatientName(value);
    }
  };

  // Load most active/recent users on mount
  useEffect(() => {
    const loadInitialUsers = async () => {
      try {
        const response = await axios.get('http://localhost:8500/user/initial');
        setCachedUsers(response.data); // Store the initial user list in the cache
      } catch (error) {
        console.error('Error loading initial users:', error);
      }
    };

    loadInitialUsers();
  }, []);

  // Fetch users dynamically when typing
  useEffect(() => {
    if (!patientName || patientName.trim() === '') {
      setSuggestions([]);
      return;
    }

    console.log('Searching for: ', patientName); // Debugging log

    // Search in cached users first, ensuring user.name is defined
    const cachedSuggestions = cachedUsers.filter((user) => {
      if (!user.name) {
        console.warn('User name is undefined:', user); // Debugging log for undefined names
        return false;
      }
      return user.name.toLowerCase().includes(patientName.toLowerCase());
    });

    console.log('Cached Suggestions: ', cachedSuggestions); // Debugging log

    if (cachedSuggestions.length > 0) {
      setSuggestions(cachedSuggestions);
    } else {
      // No match in cache, fetch from the backend
      const fetchUserSuggestions = async () => {
        setSearching(true); // Indicate searching state
        try {
          const response = await axios.get(
            `http://localhost:8500/user/search?username=${patientName}`
          );
          setSuggestions(response.data);
        } catch (error) {
          console.error('Error fetching user suggestions:', error);
        } finally {
          setSearching(false); // Stop searching state
        }
      };

      // Add debouncing to reduce excessive API calls
      const debounceFetch = setTimeout(() => {
        fetchUserSuggestions();
      }, 300);

      return () => clearTimeout(debounceFetch);
    }
  }, [patientName, cachedUsers]);

  // Handle user selection from suggestions
  const handleSelectPatient = (patient) => {
    setPatientName(patient.username);
    setPatientID(patient.id);
    setSuggestions([]); // Clear suggestions after selection
  };

  // Handle blur event to validate the field when the user leaves it
  const handleBlur = (field) => {
    if (field === 'patientName') {
      if (!patientName) {
        setErrors((prevErrors) => ({
          ...prevErrors,
          patientName: 'Patient name is required.',
        }));
      } else {
        validatePatientName(patientName);
      }
    }

    if (field === 'patientID') {
      if (!patientID) {
        setErrors((prevErrors) => ({
          ...prevErrors,
          patientID: 'Patient ID is required.',
        }));
      } else {
        setErrors((prevErrors) => ({
          ...prevErrors,
          patientID: '', // Clear error if valid
        }));
      }
    }

    if (field === 'appointmentID') {
      if (!appointmentID) {
        setErrors((prevErrors) => ({
          ...prevErrors,
          appointmentID: 'Appointment ID is required.',
        }));
      } else {
        setErrors((prevErrors) => ({
          ...prevErrors,
          appointmentID: '', // Clear error if valid
        }));
      }
    }
  };

  return (
    <div className="space-y-4">
      {/* Patient Name */}
      <div>
        <label className="block text-gray-700">Patient Name:</label>
        <input
          type="text"
          className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded"
          value={patientName}
          onChange={(e) => validatePatientName(e.target.value)}
          onBlur={() => handleBlur('patientName')}
          required
        />
        {errors.patientName && (
          <p className="text-red-600 text-sm">{errors.patientName}</p>
        )}

        {/* Suggestions Dropdown */}
        {suggestions.length > 0 && (
          <ul className="border border-gray-300 mt-1 max-h-40 overflow-y-auto">
            {suggestions.map((patient) => (
              <li
                key={patient.id}
                onClick={() => handleSelectPatient(patient)}
                className="cursor-pointer p-2 hover:bg-gray-100"
              >
                {patient.username}
              </li>
            ))}
          </ul>
        )}

        {searching && <p className="text-gray-500 text-sm">Searching...</p>}
      </div>

      {/* Patient ID */}
      <div>
        <label className="block text-gray-700">Patient ID:</label>
        <input
          type="text"
          className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded"
          value={patientID}
          onChange={(e) =>
            handleInputChange(setPatientID, 'patientID', e.target.value)
          }
          onBlur={() => handleBlur('patientID')}
          readOnly={true} // Auto-filled, hence read-only
          required
        />
        {errors.patientID && (
          <p className="text-red-600 text-sm">{errors.patientID}</p>
        )}
      </div>

      {/* Appointment ID */}
      <div>
        <label className="block text-gray-700">Appointment ID:</label>
        <input
          type="text"
          className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded"
          value={appointmentID}
          onChange={(e) =>
            handleInputChange(setAppointmentID, 'appointmentID', e.target.value)
          }
          onBlur={() => handleBlur('appointmentID')}
          required
        />
        {errors.appointmentID && (
          <p className="text-red-600 text-sm">{errors.appointmentID}</p>
        )}
      </div>
    </div>
  );
};

export default PatientDetails;
