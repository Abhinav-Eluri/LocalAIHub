import React, {useEffect, useState} from 'react';
import { Send, User, Bot } from 'lucide-react';
import {chatAPI} from "../../services/api.js";

const Chat = (props) => {
    const {selectedChat} = props;
    const [message, setMessage] = useState('');
    const [chat, setChat] = useState({});
    // Example messages for preview
    const [messages, setMessages] = useState([]);

    useEffect(()=>{
        chatAPI.getChat(selectedChat).then(response=>{
            setChat(response.data);
        }).catch(err=>{
            console.log(err);
        })
    }, [selectedChat]);

    const handleSubmit = (e) => {
        e.preventDefault();
        if (!message.trim()) return;
        chatAPI.requestResponse(selectedChat, {chat_id:selectedChat, message:message}).then(response=>{
        })
        setMessage('');
    };

    const formatTime = (timestamp) => {
        return new Date(timestamp).toLocaleTimeString([], {
            hour: '2-digit',
            minute: '2-digit'
        });
    };

    return (
        <>
            {
                selectedChat ?(
                    <div className="min-h-screen flex flex-col bg-gray-900">
                        {/* Chat Header */}
                        <div className="border-b border-gray-800 p-4">
                            <h2 className="text-lg font-semibold text-white">{chat?.name}</h2>
                            <h5 className="text-sm font-semibold text-gray-600">{chat?.model}</h5>
                        </div>

                        {/* Messages Area */}
                        <div className="flex-1 overflow-y-auto p-4 space-y-4">
                            {messages.map((msg) => (
                                <div
                                    key={msg.id}
                                    className={`flex ${msg.sender === 'user' ? 'justify-end' : 'justify-start'}`}
                                >
                                    <div className={`flex max-w-2xl ${msg.sender === 'user' ? 'flex-row-reverse' : 'flex-row'}`}>
                                        {/* Avatar */}
                                        <div className="flex-shrink-0">
                                            <div className={`w-8 h-8 rounded-full flex items-center justify-center
                                    ${msg.sender === 'user' ? 'bg-blue-600 ml-2' : 'bg-gray-700 mr-2'}`}>
                                                {msg.sender === 'user' ?
                                                    <User className="w-5 h-5 text-white" /> :
                                                    <Bot className="w-5 h-5 text-white" />
                                                }
                                            </div>
                                        </div>

                                        {/* Message Bubble */}
                                        <div className={`group relative px-4 py-2 rounded-lg
                                ${msg.sender === 'user'
                                            ? 'bg-blue-600 text-white'
                                            : 'bg-gray-800 text-gray-200'}`}
                                        >
                                            <p className="text-sm">{msg.content}</p>
                                            <span className="absolute bottom-0 text-xs text-gray-400 opacity-0 group-hover:opacity-100 transition-opacity duration-200"
                                                  style={{
                                                      [msg.sender === 'user' ? 'right' : 'left']: '10px',
                                                      transform: 'translateY(100%)',
                                                      paddingTop: '4px'
                                                  }}>
                                    {formatTime(msg.timestamp)}
                                </span>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>

                        {/* Message Input */}
                        <div className="border-t border-gray-800 p-4">
                            <form onSubmit={handleSubmit} className="flex gap-2">
                                <input
                                    type="text"
                                    value={message}
                                    onChange={(e) => setMessage(e.target.value)}
                                    placeholder="Type your message..."
                                    className="flex-1 bg-gray-800 text-white rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                                />
                                <button
                                    type="submit"
                                    disabled={!message.trim()}
                                    className="inline-flex items-center justify-center p-2 text-white bg-blue-600 rounded-lg hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed transition-colors duration-200"
                                    onClick={handleSubmit}
                                >
                                    <Send className="w-5 h-5" />
                                </button>
                            </form>
                        </div>
                    </div>
                )
            : (
            <h1>Select a chat to preview </h1>)}
        </>
    );
};

export default Chat;