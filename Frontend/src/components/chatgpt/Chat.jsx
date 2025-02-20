import React, { useEffect, useState, useRef } from 'react';
import { Send, User, Bot, Clipboard, Check } from 'lucide-react';
import { useSelector } from "react-redux";
import ReactMarkdown from 'react-markdown';
import "highlight.js/styles/github-dark.css";
import { chatAPI } from "../../services/api";
import config from "../../config";

const CodeBlock = ({ node, inline, className, children, ...props }) => {
    const [copied, setCopied] = useState(false);
    const code = String(children).replace(/\n$/, '');
    const isFencedCodeBlock = className?.includes('language-');

    if (isFencedCodeBlock) {
        return (
            <div className="relative group my-2">
                <pre className="dark:bg-gray-800/80 bg-black rounded-lg p-2 sm:p-3 overflow-x-auto">
                    <code className="dark:text-gray-200 text-white font-mono text-[10px] xs:text-xs sm:text-sm" {...props}>
                        {code}
                    </code>
                </pre>
                <button
                    onClick={async () => {
                        try {
                            await navigator.clipboard.writeText(code);
                            setCopied(true);
                            setTimeout(() => setCopied(false), 2000);
                        } catch (err) {
                            console.error('Failed to copy:', err);
                        }
                    }}
                    className="absolute top-1.5 right-1.5 p-1 sm:p-1.5 rounded-md bg-gray-700/90 hover:bg-gray-600
                             text-gray-300 opacity-0 group-hover:opacity-100 transition-all duration-200"
                >
                    {copied ? <Check className="w-3 h-3" /> : <Clipboard className="w-3 h-3" />}
                </button>
            </div>
        );
    }

    return inline ? (
        <span className="px-1 py-0.5 bg-gray-600 dark:bg-black rounded text-[11px] sm:text-sm font-mono text-blue-400">
            {code}
        </span>
    ) : (
        <code {...props}>{children}</code>
    );
};

const MessageContent = ({ content }) => {
    return (
        <div className="prose prose-invert dark:prose-light max-w-full">
            <ReactMarkdown
                components={{
                    code: CodeBlock,
                    p: ({ children }) => (
                        <p className="text-xs sm:text-sm md:text-base mb-2 leading-relaxed">{children}</p>
                    ),
                    ul: ({ children }) => (
                        <ul className="space-y-1 my-2 list-disc pl-4">{children}</ul>
                    ),
                    ol: ({ children }) => (
                        <ol className="space-y-1 my-2 list-decimal pl-4">{children}</ol>
                    ),
                    li: ({ children }) => (
                        <li className="text-xs sm:text-sm">{children}</li>
                    ),
                    h1: ({ children }) => (
                        <h1 className="text-base sm:text-lg font-bold mb-2 mt-3">{children}</h1>
                    ),
                    h2: ({ children }) => (
                        <h2 className="text-sm sm:text-base font-bold mb-2 mt-3">{children}</h2>
                    ),
                    h3: ({ children }) => (
                        <h3 className="text-xs sm:text-sm font-bold mb-1 mt-2">{children}</h3>
                    ),
                }}
            >
                {content}
            </ReactMarkdown>
        </div>
    );
};

const Chat = ({ selectedChat }) => {
    const [message, setMessage] = useState('');
    const [chat, setChat] = useState({});
    const [messages, setMessages] = useState([]);
    const [isLoading, setIsLoading] = useState(false);
    const messagesEndRef = useRef(null);
    const { accessToken } = useSelector(state => state.auth);
    const messageInputRef = useRef(null);

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
                    messageInputRef.current?.focus();
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

    if (!selectedChat) {
        return (
            <div className="flex flex-col items-center justify-center h-full bg-gray-900 dark:bg-gray-100 p-4">
                <Bot className="w-12 h-12 text-gray-600 dark:text-gray-400 mb-4" />
                <h2 className="text-xl font-semibold text-white dark:text-gray-800 mb-2">
                    Welcome to Chat
                </h2>
                <p className="text-gray-400 dark:text-gray-600 text-center max-w-md">
                    Select a chat from the sidebar or create a new one to start messaging
                </p>
            </div>
        );
    }

    return (
        <div className="flex flex-col h-full">
            {/* Chat Header */}
            <div className="border-b border-gray-800 dark:border-gray-200 bg-gray-800/50 dark:bg-gray-200/50">
                <div className="px-3 py-2 sm:px-4 sm:py-3">
                    <h2 className="text-sm sm:text-base md:text-lg font-semibold text-white dark:text-gray-800 truncate">
                        {chat?.name || 'New Chat'}
                    </h2>
                    <p className="text-[10px] sm:text-xs md:text-sm text-gray-400 dark:text-gray-600">
                        {chat?.model || 'AI Assistant'}
                    </p>
                </div>
            </div>

            {/* Messages Area */}
            <div className="flex-1 overflow-y-scroll overscroll-y-auto p-2 sm:p-4 space-y-4">
                {messages.map((msg) => (
                    <div
                        key={msg.id}
                        className={`flex items-start gap-2 ${msg.sender === 'user' ? 'flex-row-reverse' : ''}`}
                    >
                        {/* Avatar */}
                        <div className={`flex-shrink-0 rounded-full p-1 sm:p-1.5 
                            ${msg.sender === 'user'
                            ? 'bg-blue-600/20'
                            : 'bg-gray-700/20 dark:bg-gray-300/20'}`}
                        >
                            {msg.sender === 'user' ? (
                                <User className="w-3 h-3 sm:w-4 sm:h-4 text-blue-400" />
                            ) : (
                                <Bot className="w-3 h-3 sm:w-4 sm:h-4 text-gray-400 dark:text-gray-600" />
                            )}
                        </div>

                        {/* Message Content */}
                        <div className={`px-2.5 py-1.5 sm:px-3 sm:py-2 rounded-lg break-words
                            ${msg.sender === 'user'
                            ? 'bg-blue-600 text-white ml-auto mr-8 sm:mr-12 max-w-[85%] sm:max-w-[75%] md:max-w-[65%]'
                            : 'bg-gray-800 dark:bg-gray-200 text-gray-100 dark:text-gray-800 mr-auto ml-8 sm:ml-12 max-w-[85%] sm:max-w-[75%] md:max-w-[65%]'}`}
                        >
                            <MessageContent content={msg.content} />
                        </div>
                    </div>
                ))}
                <div ref={messagesEndRef} />
            </div>

            {/* Message Input */}
            <div className="border-t border-gray-800 dark:border-gray-200 bg-gray-800/50 dark:bg-gray-200/50">
                <form onSubmit={handleSubmit} className="p-2 ">
                    <div className="flex items-center gap-2 max-w-[850px] mx-auto">
                        <input
                            ref={messageInputRef}
                            type="text"
                            value={message}
                            onChange={(e) => setMessage(e.target.value)}
                            placeholder={isLoading ? "Please wait..." : "Type your message..."}
                            disabled={isLoading}
                            className="flex-1 bg-gray-800 dark:bg-gray-200 text-white dark:text-gray-800
                                     rounded-lg px-2.5 py-1.5 sm:px-3 sm:py-2
                                     text-xs sm:text-sm md:text-base
                                     focus:outline-none focus:ring-2 focus:ring-blue-500
                                     dark:focus:ring-blue-400 disabled:opacity-50
                                     placeholder-gray-500 dark:placeholder-gray-400"
                        />
                        <button
                            type="submit"
                            disabled={!message.trim() || isLoading}
                            className="p-1.5 sm:p-2 text-white bg-blue-600 rounded-lg
                                     hover:bg-blue-700 focus:outline-none focus:ring-2
                                     focus:ring-blue-500 disabled:opacity-50
                                     disabled:hover:bg-blue-600 transition-all duration-200"
                        >
                            <Send className="w-3 h-3 sm:w-4 sm:h-4" />
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default Chat;