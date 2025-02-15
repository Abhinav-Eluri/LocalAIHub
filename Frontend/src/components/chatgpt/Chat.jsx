import React, { useEffect, useState, useRef } from 'react';
import { Send, User, Bot, Copy, Check } from 'lucide-react';
import { chatAPI } from "../../services/api.js";
import { useSelector } from "react-redux";
import config from "../../config/index.js";

const CodeBlock = ({ code }) => {
    const [copied, setCopied] = useState(false);

    const handleCopy = async () => {
        try {
            await navigator.clipboard.writeText(code);
            setCopied(true);
            setTimeout(() => setCopied(false), 2000);
        } catch (err) {
            console.error('Failed to copy:', err);
        }
    };

    return (
        <div className="relative my-2 w-full">
            <pre className="bg-gray-950 p-4 rounded-lg overflow-x-auto">
                <code className="text-sm font-mono text-gray-200">{code}</code>
            </pre>
            <button
                onClick={handleCopy}
                className="absolute top-2 right-2 p-2 rounded-lg bg-gray-800 hover:bg-gray-700 transition-colors duration-200"
                title={copied ? "Copied!" : "Copy to clipboard"}
            >
                {copied ? (
                    <Check className="w-4 h-4 text-green-500" />
                ) : (
                    <Copy className="w-4 h-4 text-gray-400" />
                )}
            </button>
        </div>
    );
};

// Message Content Component for handling code formatting
const MessageContent = ({ content }) => {
    const isCodeBlock = (text) => {
        return text.includes('```') || text.includes('def ') || text.includes('class ') ||
            text.includes('function') || text.includes('import ') || text.includes('const ') ||
            text.includes('let ') || text.includes('var ');
    };

    const formatContent = (text) => {
        if (!isCodeBlock(text)) {
            return <p className="text-sm whitespace-pre-wrap">{text}</p>;
        }

        const parts = text.split(/(```[\s\S]*?```)/g);

        return parts.map((part, index) => {
            if (part.startsWith('```') && part.endsWith('```')) {
                const code = part.slice(3, -3).replace(/^[a-z]+\n/, '');
                return <CodeBlock key={index} code={code} />;
            }

            if (isCodeBlock(part)) {
                return <CodeBlock key={index} code={part} />;
            }

            return <p key={index} className="text-sm whitespace-pre-wrap">{part}</p>;
        });
    };

    return (
        <div className="space-y-2">
            {formatContent(content)}
        </div>
    );
};

// Main Chat Component
const Chat = ({ selectedChat }) => {
    const [message, setMessage] = useState('');
    const [chat, setChat] = useState({});
    const [messages, setMessages] = useState([]);
    const [isLoading, setIsLoading] = useState(false);
    const messagesEndRef = useRef(null);
    const { accessToken } = useSelector(state => state.auth);

    useEffect(() => {
        if (selectedChat) {
            chatAPI.getChat(selectedChat)
                .then(response => {
                    setChat(response.data);
                    setMessages(response.data.messages || []);
                })
                .catch(err => console.error("Error fetching chat:", err));
        }
    }, [selectedChat]);

    useEffect(() => {
        messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    }, [messages]);

    const handleSubmit = (e) => {
        e.preventDefault();
        if (!message.trim() || isLoading) return;

        const userMessage = {
            id: Date.now(),
            content: message,
            sender: 'user',
            timestamp: new Date().toISOString()
        };

        setMessages(prev => [...prev, userMessage]);
        setMessage('');
        setIsLoading(true);

        const assistantMessageId = Date.now() + 1;
        const assistantMessage = {
            id: assistantMessageId,
            content: '',
            sender: 'assistant',
            timestamp: new Date().toISOString()
        };
        setMessages(prev => [...prev, assistantMessage]);

        const baseUrl = config.apiUrl;
        const eventSource = new EventSource(
            `${baseUrl}/api/chat/${selectedChat}/stream/?message=${encodeURIComponent(message)}&token=${accessToken}`
        );

        eventSource.onmessage = (event) => {
            try {
                const data = JSON.parse(event.data);
                if (data.content === '[DONE]') {
                    setIsLoading(false);
                    eventSource.close();
                    return;
                }

                setMessages(prev =>
                    prev.map(msg => msg.id === assistantMessageId
                        ? { ...msg, content: msg.content + data.content }
                        : msg
                    )
                );
            } catch (error) {
                console.error("Error parsing SSE data:", error);
            }
        };

        eventSource.onerror = (error) => {
            console.error("SSE Error:", error);
            setIsLoading(false);
            eventSource.close();
        };
    };

    const formatTime = (timestamp) => new Date(timestamp).toLocaleTimeString([], {
        hour: '2-digit',
        minute: '2-digit'
    });

    return (
        <>
            {selectedChat ? (
                <div className="min-h-screen flex flex-col bg-gray-900">
                    {/* Chat Header */}
                    <div className="border-b border-gray-800 p-4">
                        <h2 className="text-lg font-semibold text-white">{chat?.name}</h2>
                        <h5 className="text-sm font-semibold text-gray-600">{chat?.model}</h5>
                    </div>

                    {/* Messages Area */}
                    <div className="flex-1 overflow-y-auto p-4 space-y-4">
                        {messages.map((msg) => (
                            <div key={msg.id} className={`flex ${msg.sender === 'user' ? 'justify-end' : 'justify-start'}`}>
                                <div className={`flex max-w-3xl ${msg.sender === 'user' ? 'flex-row-reverse' : 'flex-row'}`}>
                                    {/* Avatar */}
                                    <div className="flex-shrink-0">
                                        <div className={`w-8 h-8 rounded-full flex items-center justify-center
                                            ${msg.sender === 'user' ? 'bg-blue-600 ml-2' : 'bg-gray-700 mr-2'}`}>
                                            {msg.sender === 'user' ?
                                                <User className="w-5 h-5 text-white" /> :
                                                <Bot className="w-5 h-5 text-white" />}
                                        </div>
                                    </div>

                                    {/* Message Bubble */}
                                    <div className={`group relative px-4 py-2 rounded-lg
                                        ${msg.sender === 'user' ? 'bg-blue-600 text-white' : 'bg-gray-800 text-gray-200'}`}>
                                        <MessageContent content={msg.content} />
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
                        <div ref={messagesEndRef} />
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
                                disabled={isLoading}
                            />
                            <button
                                type="submit"
                                disabled={!message.trim() || isLoading}
                                className="inline-flex items-center justify-center p-2 text-white bg-blue-600 rounded-lg hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed transition-colors duration-200"
                            >
                                <Send className="w-5 h-5" />
                            </button>
                        </form>
                    </div>
                </div>
            ) : (
                <div className="min-h-screen flex items-center justify-center bg-gray-900">
                    <h1 className="text-xl text-white">Select a chat to preview</h1>
                </div>
            )}
        </>
    );
};

export default Chat;