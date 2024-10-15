import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import DoctorNav from '../Navbar/Doctor/DoctorNav';
import { FaSearch, FaSort, FaSortUp, FaSortDown } from 'react-icons/fa'; // Import sort icons
import 'react-toastify/dist/ReactToastify.css';

const DoctorAppointments = () => {
    const [appointments, setAppointments] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [searchTerm, setSearchTerm] = useState('');
    const [sortType, setSortType] = useState('date'); // Default sorting by date
    const [sortOrder, setSortOrder] = useState('asc'); // Ascending by default
    const navigate = useNavigate();
    const [sidebarOpen, setSidebarOpen] = useState(false);

    const toggleSidebar = () => {
        setSidebarOpen(!sidebarOpen);
    };

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

    const handleMarkAsDone = async (id) => {
        try {
            // Find the appointment to copy
            const appointmentToCopy = appointments.find(appointment => appointment._id === id);

            // Check if necessary fields are available
            if (!appointmentToCopy.patientId || !appointmentToCopy.patientName) {
                throw new Error('Patient ID or Name missing');
            }

            // Copy the appointment data to clientPatients
            await axios.post('http://localhost:8500/chatPatients/', {
                appointmentId: id,
                clientId: appointmentToCopy.patientId,
                clientName: appointmentToCopy.patientName,
                date: appointmentToCopy.date,
                time: appointmentToCopy.time,
                email: appointmentToCopy.email
                // Add any other fields as needed
            });

            // Optionally, update UI to reflect that the action was successful
            alert('Record copied to clientPatients successfully!');

        } catch (err) {
            setError(err.message || 'Error copying record to clientPatients');
            console.error(err);
        }
    };

    const handleMessage = (patientId) => {
        navigate(`/message/${patientId}`);
    };

    // Handle sorting toggle
    const toggleSortOrder = () => {
        setSortOrder((prevOrder) => (prevOrder === 'asc' ? 'desc' : 'asc'));
    };

    // Filter appointments based on search term
    const filteredAppointments = appointments.filter((appointment) => {
        const searchLower = searchTerm.toLowerCase();
        return (
            appointment.patientId.toLowerCase().includes(searchLower) ||
            appointment.patientName.toLowerCase().includes(searchLower) ||
            appointment.date.toLowerCase().includes(searchLower)
        );
    });

    // Sort appointments based on selected sort type and order
    const sortedAppointments = filteredAppointments.sort((a, b) => {
        if (sortType === 'date') {
            return sortOrder === 'asc'
                ? new Date(a.date) - new Date(b.date)
                : new Date(b.date) - new Date(a.date);
        } else if (sortType === 'name') {
            return sortOrder === 'asc'
                ? a.patientName.localeCompare(b.patientName)
                : b.patientName.localeCompare(a.patientName);
        } else if (sortType === 'id') {
            return sortOrder === 'asc'
                ? a.patientId.localeCompare(b.patientId)
                : b.patientId.localeCompare(a.patientId);
        }
        return 0;
    });

    if (loading) return <div className="loading">Loading...</div>;
    if (error) return <div className="error">Error: {error}</div>;

    return (
        <>
            <DoctorNav sidebarOpen={sidebarOpen} toggleSidebar={toggleSidebar} />

            <div className="admin-container">
                <h2 className="admin-title">Doctor Appointments</h2>

                {/* Search Bar and Sort By */}
                <div className="search-sort-container">
                    <div className="search-bar">
                        <input
                            type="text"
                            placeholder="Search by Patient ID, Name, or Date"
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            className="search-input"
                        />
                        <FaSearch className="search-icon" />
                    </div>

                    {/* Sort By Dropdown and Icon */}
                    <div className="sort-by">
                        <select
                            value={sortType}
                            onChange={(e) => setSortType(e.target.value)}
                            className="sort-select"
                        >
                            <option value="date">Date</option>
                            <option value="name">Name</option>
                            <option value="id">Patient ID</option>
                        </select>
                        {/* Toggle between ascending and descending icons */}
                        <div className="sort-icon" onClick={toggleSortOrder}>
                            {sortOrder === 'asc' ? <FaSortUp /> : <FaSortDown />}
                        </div>
                    </div>
                </div>

                <table className="admin-table">
                    <thead>
                        <tr>
                            <th>Patient ID</th>
                            <th>Patient Name</th>
                            <th>Date</th>
                            <th>Time</th>
                            <th>Email</th>
                            <th>Action</th>
                        </tr>
                    </thead>
                    <tbody>
                        {sortedAppointments.map((appointment) => (
                            <tr key={appointment._id}>
                                <td>{appointment.patientId}</td>
                                <td>{appointment.patientName}</td>
                                <td>{appointment.date}</td>
                                <td>{appointment.time}</td>
                                <td>{appointment.email}</td>
                                <td>
                                    <button
                                        className="done-button"
                                        onClick={() => handleMarkAsDone(appointment._id)}
                                    >
                                        Mark as Done
                                    </button>
                                    <button
                                        className="message-button"
                                        onClick={() => handleMessage(appointment.patientId)}
                                    >
                                        Message
                                    </button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>

                {error && <p className="error">{error}</p>}

                <style jsx>{`
                    .admin-container {
                        max-width: 1000px;
                        margin: 0 auto;
                        margin-top: 20px;
                        padding: 100px;
                        text-align: center;
                        background-color: #f9f9f9;
                        border-radius: 8px;
                        box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
                        margin-left: 100px;
                    }

                    .admin-title {
                        font-size: 24px;
                        font-weight: bold;
                        margin-bottom: 20px;
                        color: #333;
                        text-align: center;
                    }

                    .search-sort-container {
                        display: flex;
                        align-items: center;
                        justify-content: space-between;
                        margin-bottom: 20px;
                    }

                    .search-bar {
                        position: relative;
                        width: 60%;
                    }

                    .search-input {
                        width: 100%;
                        padding: 10px 40px 10px 10px; /* Extra padding for the icon */
                        font-size: 16px;
                        border: 1px solid #ccc;
                        border-radius: 4px;
                    }

                    .search-icon {
                        position: absolute;
                        right: 10px;
                        top: 50%;
                        transform: translateY(-50%);
                        font-size: 18px;
                        color: #333;
                    }

                    .sort-by {
                        display: flex;
                        align-items: center;
                    }

                    .sort-select {
                        padding: 10px;
                        font-size: 16px;
                        border: 1px solid #ccc;
                        border-radius: 4px;
                        margin-right: 10px;
                    }

                    .sort-icon {
                        font-size: 24px;
                        color: #333;
                        cursor: pointer;
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

                    .done-button,
                    .message-button {
                        padding: 8px 12px;
                        background-color: #4caf50;
                        color: white;
                        border: none;
                        border-radius: 4px;
                        cursor: pointer;
                        transition: background-color 0.3s ease;
                    }

                    .done-button:hover,
                    .message-button:hover {
                        background-color: #45a049;
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

export default DoctorAppointments;
