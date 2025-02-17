import React, { useState, useEffect } from "react";
import Sidebar from "../../components/chatgpt/sidebar.jsx";
import Chat from "../../components/chatgpt/Chat.jsx";
import CreateChatDialog from "../../components/dialogs/create-chat-dialog.jsx";
import { Menu } from "lucide-react";
import { useDialog } from "../../hooks/use-dialog.js";

function Home() {
    const [selectedChat, setSelectedChat] = useState("");
    const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false);
    const [isMobileSidebarOpen, setIsMobileSidebarOpen] = useState(false);
    const createChatDialog = useDialog();

    // Theme initialization
    const [isDarkMode, setIsDarkMode] = useState(() => {
        const savedTheme = localStorage.getItem('theme');
        return savedTheme === 'dark';
    });

    useEffect(() => {
        if (isDarkMode) {
            document.documentElement.classList.add('dark');
            localStorage.setItem('theme', 'dark');
        } else {
            document.documentElement.classList.remove('dark');
            localStorage.setItem('theme', 'light');
        }
    }, [isDarkMode]);

    useEffect(() => {
        if (selectedChat && isMobileSidebarOpen) {
            setIsMobileSidebarOpen(false);
        }
    }, [selectedChat]);

    const handleChatCreated = (newChat) => {
        setSelectedChat(newChat.id);
        createChatDialog.handleClose();
    };

    return (
        <div className="h-screen w-full bg-gray-900 dark:bg-gray-100 flex relative">
            {/* Mobile Overlay */}
            {isMobileSidebarOpen && (
                <div
                    className="fixed inset-0 bg-black bg-opacity-50 z-20 md:hidden"
                    onClick={() => setIsMobileSidebarOpen(false)}
                />
            )}

            {/* Sidebar - Fixed position */}
            <div className={`
                fixed inset-y-0 left-0 z-30 
                md:relative md:inset-y-auto md:left-auto
                h-full flex-shrink-0
                transition-all duration-300 ease-in-out
                ${isMobileSidebarOpen ? 'translate-x-0' : '-translate-x-full md:translate-x-0'}
                ${isSidebarCollapsed ? 'w-20' : 'w-80'}
            `}>
                <Sidebar
                    setSelectedChat={setSelectedChat}
                    onCollapseChange={setIsSidebarCollapsed}
                    onMobileClose={() => setIsMobileSidebarOpen(false)}
                    onNewChat={createChatDialog.handleOpen}
                />
            </div>

            {/* Main Content Area - With overflow handling */}
            <div className="flex-1 flex flex-col h-screen overflow-hidden">
                {/* Mobile Header */}
                <div className="md:hidden flex items-center h-16 px-4 bg-gray-800/50 dark:bg-gray-200/50 border-b border-gray-800 dark:border-gray-200">
                    <button
                        onClick={() => setIsMobileSidebarOpen(true)}
                        className="p-2 text-gray-400 dark:text-gray-600 hover:text-white dark:hover:text-gray-800"
                    >
                        <Menu className="w-6 h-6" />
                    </button>
                </div>

                {/* Chat Area - With overflow */}
                <div className="flex-1 relative overflow-hidden">
                    <Chat selectedChat={selectedChat} />
                </div>
            </div>

            {/* Create Chat Dialog */}
            <CreateChatDialog
                open={createChatDialog.open}
                onClose={createChatDialog.handleClose}
                onSuccess={handleChatCreated}
            />
        </div>
    );
}

export default Home;