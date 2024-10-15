import React, { useEffect, useState } from 'react';
import Cookies from 'js-cookie';
import axios from 'axios';

const PatientList = () => {
    const [patients, setPatients] = useState([]);
    const [loading, setLoading] = useState(true);
    const userId = Cookies.get('userId'); // Assuming userId is stored in cookies

    useEffect(() => {
        const fetchPatients = async () => {
            try {
                const response = await axios.get(`/api/chatpatients/${userId}`);
                setPatients(response.data);
            } catch (error) {
                console.error('Error fetching patients:', error);
            } finally {
                setLoading(false);
            }
        };

        fetchPatients();
    }, [userId]);

    if (loading) {
        return <p>Loading...</p>;
    }

    return (
        <div>
            <h2>Patient List</h2>
            <ul>
                {patients.map(patient => (
                    <li key={patient.clientId}>{patient.clientName}</li>
                ))}
            </ul>
        </div>
    );
};

export default PatientList;
