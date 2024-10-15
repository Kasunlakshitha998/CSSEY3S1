import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useParams } from 'react-router-dom'; // Import useParams to get patientId from URL

const Message = () => {
    const { patientId } = useParams(); // Get the patient ID from the route parameter
    const [messages, setMessages] = useState([]);
    const [inputValue, setInputValue] = useState('');
    const [file, setFile] = useState(null);
    const [patients, setPatients] = useState([]); // Fetch patient list
    const [selectedPatientId, setSelectedPatientId] = useState(''); // Track selected patient
    const [searchTerm, setSearchTerm] = useState(''); // Track search term

    useEffect(() => {
        // Fetch patients (users with type 'user') if needed
        const fetchPatients = async () => {
            try {
                const response = await axios.get('http://localhost:8500/user/users');
                setPatients(response.data); // Set the list of patients
            } catch (error) {
                console.error('Error fetching patients:', error.message);
            }
        };
        fetchPatients();
    }, []);

    // Fetch messages when the component loads and when selectedPatientId changes
    useEffect(() => {
        const fetchMessages = async () => {
            if (selectedPatientId) {
                try {
                    const response = await axios.get(`/chat/messages/${selectedPatientId}`);
                    setMessages(response.data);
                } catch (error) {
                    console.error('Error fetching messages:', error.response ? error.response.data : error.message);
                }
            }
        };
        fetchMessages();
    }, [selectedPatientId]);

    // Handle sending a message
    const handleSendMessage = async (e) => {
        e.preventDefault(); // Prevent form submission
        const formData = new FormData();
        formData.append('sender', 'Doctor'); // Adjust as needed
        formData.append('receiver', selectedPatientId); // Use the selected patient ID

        if (file) {
            formData.append('file', file); // Append the selected image file
        } else {
            formData.append('message', inputValue); // Append the text message
        }

        try {
            const response = await axios.post('http://localhost:8500/chat/messages', formData, {
                headers: {
                    'Content-Type': 'multipart/form-data',
                },
            });
            // Add the new message to the messages state
            setMessages([...messages, response.data]);
            // Clear input fields
            setInputValue('');
            setFile(null);
        } catch (error) {
            console.error('Error sending message:', error.response ? error.response.data : error.message);
        }
    };

    const handleFileChange = (e) => {
        setFile(e.target.files[0]); // Set the selected file
    };

    // Filter patients based on search term
    const filteredPatients = patients.filter((patient) =>
        patient.name.toLowerCase().includes(searchTerm.toLowerCase())
    );

    return (
        <div className="flex flex-col h-full bg-gray-100">
            <div className="flex-1 overflow-auto p-4">
                <h2 className="text-xl font-semibold mb-4">Message Patient</h2>
                {/* Dropdown for selecting a patient with search functionality */}
                <div className="relative mb-4">
                    <input
                        type="text"
                        placeholder="Search for a patient..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)} // Update search term
                        className="mb-2 p-2 border rounded w-full"
                    />
                    <select
                        value={selectedPatientId || ''} // Set value to selectedPatientId or empty string for default
                        onChange={(e) => setSelectedPatientId(e.target.value)}
                        className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                    >
                        <option value="" disabled>Select a patient</option> {/* Default option */}
                        {filteredPatients.map((patient) => (
                            <option key={patient._id} value={patient._id}>
                                {patient.name}
                            </option>
                        ))}
                    </select>
                    {/* Display filtered patient names in the dropdown */}
                    {filteredPatients.length === 0 && (
                        <div className="absolute left-0 right-0 bg-white border border-gray-300 rounded mt-1 p-2">
                            No patients found
                        </div>
                    )}
                </div>
            </div>

            {/* Input form for sending messages */}
            <form
                onSubmit={handleSendMessage}
                className="flex p-5 bg-white border-t border-gray-300"
                style={{ position: 'fixed', bottom: 0, left: 0, right: 0, backgroundColor: 'white' }}
            >
                <input
                    type="text"
                    value={inputValue}
                    onChange={(e) => setInputValue(e.target.value)}
                    placeholder="Type your message..."
                    className="flex-1 p-2 border rounded"
                />
                <input
                    type="file"
                    onChange={handleFileChange}
                    className="ml-2 p-2 border rounded"
                />
                <button
                    type="submit"
                    className="ml-2 p-2 bg-indigo-600 text-white rounded"
                >
                    Send
                </button>
            </form>
        </div>
    );
};

export default Message;
