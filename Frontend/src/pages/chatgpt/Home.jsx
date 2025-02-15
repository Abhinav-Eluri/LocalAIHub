import React, { useState, useEffect } from "react";
import Sidebar from "../../components/chatgpt/sidebar.jsx";
import Chat from "../../components/chatgpt/Chat.jsx";

function Home() {
    const [selectedChat, setSelectedChat] = useState("");
    const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false);

    // Theme initialization
    const [isDarkMode, setIsDarkMode] = useState(() => {
        const savedTheme = localStorage.getItem('theme');
        return savedTheme === 'dark';
    });

    // Theme toggle effect
    useEffect(() => {
        if (isDarkMode) {
            document.documentElement.classList.add('dark');
            localStorage.setItem('theme', 'dark');
        } else {
            document.documentElement.classList.remove('dark');
            localStorage.setItem('theme', 'light');
        }
    }, [isDarkMode]);

    return (
        <div className="w-full min-h-screen bg-gray-900 dark:bg-gray-100 flex">
            <Sidebar
                setSelectedChat={setSelectedChat}
                onCollapseChange={setIsSidebarCollapsed}
            />

            <div className={`flex-1 transition-all duration-300 ${isSidebarCollapsed ? 'pl-16' : 'pl-64'}`}>
                <Chat selectedChat={selectedChat} />
            </div>
        </div>
    );
}

export default Home;