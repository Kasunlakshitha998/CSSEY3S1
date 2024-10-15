import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useParams } from 'react-router-dom';

const Message = () => {
    const { patientId } = useParams(); // Get patientId from route params
    const [messages, setMessages] = useState([]);
    const [inputValue, setInputValue] = useState('');
    const [file, setFile] = useState(null);
    const [patients, setPatients] = useState([]); // Fetch patient list

    useEffect(() => {
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

    useEffect(() => {
        const fetchMessages = async () => {
            if (patientId) {
                try {
                    const response = await axios.get(`http://localhost:8500/chat/messages/${patientId}`);
                    console.log("Fetched messages for patient ID:", patientId, response.data); // Log fetched messages
                    setMessages(response.data); // Set the fetched messages
                } catch (error) {
                    console.error('Error fetching messages:', error.message);
                }
            }
        };
        fetchMessages();
    }, [patientId]);

    const handleSendMessage = async (e) => {
        e.preventDefault();
        const formData = new FormData();
        formData.append('sender', 'Doctor');
        formData.append('receiver', patientId); // Use patientId as the receiver

        if (file) {
            formData.append('file', file); // Send image file if available
        } else {
            formData.append('message', inputValue); // Send text message
        }

        try {
            const response = await axios.post('http://localhost:8500/chat/messages', formData, {
                headers: {
                    'Content-Type': 'multipart/form-data',
                },
            });
            setMessages([...messages, response.data]); // Add new message to the messages state
            setInputValue(''); // Clear input field
            setFile(null); // Clear file input
        } catch (error) {
            console.error('Error sending message:', error.message);
        }
    };

    return (
        <div className="flex flex-col h-full bg-gray-100">
            <h2 style={styles.title}>
                Prescriptions for:
                {/* Display the selected patient's name here if needed */}
                {patients
                    .filter((patient) => patient._id === patientId) // Filter patients by patientId
                    .map((patient) => (
                        <span key={patient._id}>
                            {'  '}{patient.name} {/* Display the matched patient's name */}
                        </span>
                    ))}
            </h2>

            {/* Message History */}
            <div className="message-history" style={styles.messageHistory}>
                {messages.map((msg, index) => (
                    <div key={index} style={msg.sender === 'Doctor' ? styles.doctorMessage : styles.patientMessage}>
                        {/* Display text message if available */}
                        {msg.message && <p style={styles.messageText}>{msg.message}</p>}

                        {/* Display image if available */}
                        {msg.file && (
                            <div style={styles.imageContainer}>
                                <img
                                    src={`http://localhost:8500/${msg.file}`}
                                    alt="attachment"
                                    style={styles.image}
                                />
                            </div>
                        )}
                    </div>
                ))}
            </div>

            {/* Message Input */}
            <form 
                onSubmit={handleSendMessage} 
                className="message-form flex p-5 bg-white border-t border-gray-300"
                style={styles.formstyle}
            >
                <input
                    type="text"
                    value={inputValue}
                    onChange={(e) => setInputValue(e.target.value)}
                    placeholder="Type your message..."
                />
                <input type="file" onChange={(e) => setFile(e.target.files[0])} />
                <button type="submit">Send</button>
            </form>
        </div>
    );
};

const styles = {
    title: {
        textAlign: 'center',  // Center the text
        fontSize: '24px',     // Increase the font size
        margin: '20px 0',     // Optional: Add some vertical margin
        fontWeight: 'bold',    // Optional: Make the font bold
    },
    messageHistory: {
        padding: '10px',
        overflowY: 'auto', // Allow scrolling if messages exceed the height
        maxHeight: '400px', // Set a max height for the message history
        backgroundColor: '#f5f5f5', // Light background color
    },
    doctorMessage: {
        margin: '10px 0',
        padding: '10px',
        borderRadius: '15px',
        backgroundColor: '#dcf8c6', // Light green for sent messages
        alignSelf: 'flex-end', // Align to the right
        maxWidth: '70%', // Max width of the message bubble
        wordWrap: 'break-word', // Allow text to wrap
        alignSelf: 'flex-end',
    },
    patientMessage: {
        margin: '10px 0',
        padding: '10px',
        borderRadius: '15px',
        backgroundColor: '#ffffff', // White for received messages
        alignSelf: 'flex-start', // Align to the left
        maxWidth: '70%', // Max width of the message bubble
        wordWrap: 'break-word', // Allow text to wrap
        alignSelf: 'flex-start',
    },
    messageText: {
        margin: '0', // Remove default margin for paragraphs
        fontSize: '16px', // Font size for message text
    },
    imageContainer: {
        marginTop: '5px', // Space between text and image
        display: 'flex',
        justifyContent: 'flex-start', // Align image to the right for doctor messages
    },
    image: {
        width: '200px',
        height: 'auto',
        borderRadius: '5px',
    },
    formstyle:{
        position: 'fixed', 
        bottom: 0, 
        left: 0, 
        right: 0, 
        backgroundColor: 'white',
    },
};

export default Message;
