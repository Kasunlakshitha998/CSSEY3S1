// src/pages/Chat.js
import React, { useState, useEffect } from 'react';
import axios from 'axios';

const patientsData = [
    { id: 1, name: 'Patient A' },
    { id: 2, name: 'Patient B' },
    { id: 3, name: 'Patient C' },
];

const Chat = () => {
    const [messages, setMessages] = useState([]);
    const [inputValue, setInputValue] = useState('');
    const [selectedPatient, setSelectedPatient] = useState(patientsData[0].id);
    const [file, setFile] = useState(null);

    useEffect(() => {
        const fetchMessages = async () => {
            try {
                const response = await axios.get(`/chat/messages/${selectedPatient}`);
                setMessages(response.data);
            } catch (error) {
                console.error('Error fetching messages:', error.response ? error.response.data : error.message);
            }
        };
        fetchMessages();
    }, [selectedPatient]);

    const handleSendMessage = async (e) => {
        e.preventDefault(); // Prevent form submission
        const formData = new FormData();
        formData.append('sender', 'Doctor');
        formData.append('receiver', selectedPatient);

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

    const handlePatientChange = (e) => {
        setSelectedPatient(parseInt(e.target.value));
    };

    const handleFileChange = (e) => {
        setFile(e.target.files[0]);
    };

    return (
        <div className="flex flex-col h-full">
            <div className="flex-1 overflow-auto p-4 bg-gray-100">
                <h2 className="text-xl font-semibold mb-4">Chat with Patients</h2>
                <select value={selectedPatient} onChange={handlePatientChange} className="mb-4 p-2 border rounded">
                    {patientsData.map(patient => (
                        <option key={patient.id} value={patient.id}>
                            {patient.name}
                        </option>
                    ))}
                </select>

                <div className="space-y-4">
                    {messages.map((msg, index) => (
                        <div key={index} className={`p-2 rounded-lg ${msg.sender === 'Doctor' ? 'ml-auto bg-indigo-200' : 'mr-auto bg-gray-300'}`} style={{ minWidth: '215px', maxWidth: '70%', width: 'fit-content' }}>
                            <span>{msg.message}</span>
                            {msg.file && <img src={`http://localhost:8500/${msg.file}`} alt="attachment" style={{ width: '200px', height: 'auto', borderRadius: '5px' }} />} {/* Render image directly */}
                        </div>
                    ))}
                </div>
            </div>

            <form onSubmit={handleSendMessage} className="flex p-2 bg-white border-t border-gray-300">
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
                <button type="submit" className="ml-2 p-2 bg-indigo-600 text-white rounded">Send</button>
            </form>
        </div>
    );
};

export default Chat;
