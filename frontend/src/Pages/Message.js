import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useParams } from 'react-router-dom';

const Message = () => {
    const { patientId } = useParams(); // Get the patientId from the route
    const [messages, setMessages] = useState([]);
    const [inputValue, setInputValue] = useState('');
    const [file, setFile] = useState(null);

    useEffect(() => {
        const fetchMessages = async () => {
            try {
                const response = await axios.get(`/chat/messages/${patientId}`);
                setMessages(response.data);
            } catch (error) {
                console.error('Error fetching messages:', error.response ? error.response.data : error.message);
            }
        };
        fetchMessages();
    }, [patientId]);

    const handleSendMessage = async (e) => {
        e.preventDefault();
        const formData = new FormData();
        formData.append('sender', 'Doctor');
        formData.append('receiver', patientId);

        if (file) {
            formData.append('file', file);
        } else {
            formData.append('message', inputValue);
        }

        try {
            const response = await axios.post('http://localhost:8500/chat/messages', formData, {
                headers: {
                    'Content-Type': 'multipart/form-data',
                },
            });
            setMessages([...messages, response.data]);
            setInputValue('');
            setFile(null);
        } catch (error) {
            console.error('Error sending message:', error.response ? error.response.data : error.message);
        }
    };

    const handleFileChange = (e) => {
        setFile(e.target.files[0]);
    };

    return (
        <div className="flex flex-col h-full bg-gray-100">
            <h2>Message Patient {patientId}</h2>

            <div className="message-history">
                {messages.map((msg, index) => (
                    <div key={index}>
                        <span>{msg.message}</span>
                        {msg.file && <img src={`http://localhost:8500/${msg.file}`} alt="attachment" />}
                    </div>
                ))}
            </div>

            <form onSubmit={handleSendMessage}>
                <input
                    type="text"
                    value={inputValue}
                    onChange={(e) => setInputValue(e.target.value)}
                    placeholder="Type your message..."
                />
                <input type="file" onChange={handleFileChange} />
                <button type="submit">Send</button>
            </form>
        </div>
    );
};

export default Message;
