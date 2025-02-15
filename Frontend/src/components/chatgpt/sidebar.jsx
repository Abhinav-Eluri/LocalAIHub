import React, { useEffect, useState } from 'react';
import { MessageSquare, PlusIcon, Trash2, X, ChevronLeft, ChevronRight } from "lucide-react";
import CreateChatDialog from "../dialogs/create-chat-dialog.jsx";
import { useDialog } from "../../hooks/use-dialog.js";
import { chatAPI } from "../../services/api.js";
import { useSelector } from "react-redux";

// Delete Alert Dialog Component
const DeleteAlert = ({ isOpen, onClose, onConfirm, chatName }) => {
    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-gray-900 dark:bg-gray-100 rounded-lg p-6 max-w-md w-full mx-4 border border-gray-800 dark:border-gray-200 shadow-xl">
                <div className="flex justify-between items-start mb-4">
                    <h2 className="text-xl font-semibold text-white dark:text-gray-800">Delete Chat?</h2>
                    <button
                        onClick={onClose}
                        className="text-gray-400 dark:text-gray-600 hover:text-white dark:hover:text-gray-800 transition-colors"
                    >
                        <X className="w-5 h-5" />
                    </button>
                </div>

                <p className="text-gray-300 dark:text-gray-600 mb-6">
                    Are you sure you want to delete <span className="font-semibold">{chatName || "this chat"}</span>?
                    This action cannot be undone.
                </p>

                <div className="flex justify-end gap-3">
                    <button
                        onClick={onClose}
                        className="px-4 py-2 text-sm font-medium text-gray-300 dark:text-gray-600
                                   hover:text-white dark:hover:text-gray-800 bg-gray-800 dark:bg-gray-200
                                   hover:bg-gray-700 dark:hover:bg-gray-300 rounded-lg transition-colors"
                    >
                        Cancel
                    </button>
                    <button
                        onClick={onConfirm}
                        className="px-4 py-2 text-sm font-medium text-white dark:text-white bg-red-600
                                   hover:bg-red-700 rounded-lg transition-colors"
                    >
                        Delete
                    </button>
                </div>
            </div>
        </div>
    );
};

function Sidebar({ setSelectedChat, onCollapseChange }) {
    const createChatDialog = useDialog();
    const { user } = useSelector(state => state.auth);
    const [chats, setChats] = useState([]);
    const [chatToDelete, setChatToDelete] = useState(null);
    const [showDeleteDialog, setShowDeleteDialog] = useState(false);
    const [isCollapsed, setIsCollapsed] = useState(false);

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

    const handleNewChat = () => {
        createChatDialog.handleOpen();
    };

    const fetchChats = () => {
        chatAPI.getChats({ user_id: user?.id }).then((response) => {
            const sortedChats = response.data.sort((a, b) => new Date(b.created_at) - new Date(a.created_at));
            setChats(sortedChats);
        }).catch((error) => {
            console.log(error);
        });
    };

    useEffect(() => {
        if (user?.id) {
            fetchChats();
        }
    }, [user?.id]);

    const handleChatCreated = (newChat) => {
        fetchChats();
        setSelectedChat(newChat.id);
        createChatDialog.handleClose();
    };

    const handleConfirmDelete = () => {
        if (chatToDelete) {
            chatAPI.deleteChat(chatToDelete.id).then(() => {
                setChats((prevChats) => prevChats.filter(chat => chat.id !== chatToDelete.id));
                setChatToDelete(null);
                setShowDeleteDialog(false);
            }).catch((error) => {
                console.log(error);
            });
        }
    };

    const handleCollapse = () => {
        setIsCollapsed(!isCollapsed);
        onCollapseChange?.(!isCollapsed);
    };

    return (
        <>
            {user && (
                <div className={`flex flex-col h-screen min-h-full bg-gray-900 dark:bg-gray-100 border-r border-gray-800 dark:border-gray-200 relative transition-all duration-300 
                    ${isCollapsed ? 'w-16' : 'w-64'}`}>

                    {/* Toggle Collapse Button */}
                    <button
                        onClick={handleCollapse}
                        className="absolute -right-3 top-4 bg-gray-800 dark:bg-gray-200 rounded-full p-1 hover:bg-gray-700 dark:hover:bg-gray-300 z-10"
                    >
                        {isCollapsed ?
                            <ChevronRight className="w-4 h-4 text-gray-400 dark:text-gray-600" /> :
                            <ChevronLeft className="w-4 h-4 text-gray-400 dark:text-gray-600" />
                        }
                    </button>

                    {/* Create New Chat Button */}
                    <div className="p-4">
                        {isCollapsed ? (
                            <button
                                onClick={handleNewChat}
                                className="w-full flex justify-center p-2 text-white dark:text-white bg-blue-600 rounded-lg
                                         hover:bg-blue-700 transition-colors duration-200"
                            >
                                <PlusIcon className="w-5 h-5" />
                            </button>
                        ) : (
                            <button
                                onClick={handleNewChat}
                                className="w-full inline-flex items-center justify-center gap-2 px-4 py-3 text-sm
                                         font-medium text-white dark:text-white bg-blue-600 rounded-lg hover:bg-blue-700
                                         transition-colors duration-200 focus:outline-none focus:ring-2
                                         focus:ring-blue-500 focus:ring-offset-2 focus:ring-offset-gray-900 dark:focus:ring-offset-gray-100"
                            >
                                <PlusIcon className="w-5 h-5" />
                                Create New Chat
                            </button>
                        )}
                    </div>

                    {/* Chat List */}
                    <div className="flex-1 overflow-y-auto px-2">
                        {chats.length > 0 ? (
                            <>
                                {!isCollapsed && (
                                    <h1 className="text-gray-400 dark:text-gray-600 text-xs font-semibold uppercase tracking-wider px-3 mb-2">
                                        Your Chats
                                    </h1>
                                )}
                                <div className="space-y-1">
                                    {chats.map((chat) => (
                                        <div
                                            key={chat.id}
                                            className="flex items-center justify-between p-3 rounded-lg
                                                     hover:bg-gray-800 dark:hover:bg-gray-200 transition-all duration-200 group cursor-pointer"
                                            onClick={() => setSelectedChat(chat.id)}
                                        >
                                            <div className="flex items-start gap-3">
                                                <div className="flex-shrink-0 mt-1">
                                                    <MessageSquare className="w-4 h-4 text-gray-500 dark:text-gray-400 group-hover:text-blue-400" />
                                                </div>
                                                {!isCollapsed && (
                                                    <div className="flex-1 min-w-0">
                                                        <h3 className="text-sm font-medium text-gray-200 dark:text-gray-800 group-hover:text-white dark:group-hover:text-gray-600 truncate">
                                                            {chat.name || 'Untitled Chat'}
                                                        </h3>
                                                        <p className="mt-1 text-xs text-gray-500 dark:text-gray-600 group-hover:text-gray-400 dark:group-hover:text-gray-500">
                                                            {chat.model}
                                                        </p>
                                                    </div>
                                                )}
                                            </div>
                                            {!isCollapsed && (
                                                <button
                                                    onClick={(e) => {
                                                        e.stopPropagation();
                                                        setChatToDelete(chat);
                                                        setShowDeleteDialog(true);
                                                    }}
                                                    className="p-1 rounded-lg hover:bg-red-700 transition-colors duration-200"
                                                >
                                                    <Trash2 className="w-4 h-4 text-gray-400 dark:text-gray-500 hover:text-white dark:hover:text-gray-800" />
                                                </button>
                                            )}
                                        </div>
                                    ))}
                                </div>
                            </>
                        ) : (
                            <div className="flex flex-col items-center justify-center h-full px-4 py-8">
                                <MessageSquare className="w-12 h-12 text-gray-600 dark:text-gray-400 mb-4" />
                                {!isCollapsed && (
                                    <p className="text-sm text-gray-400 dark:text-gray-600 text-center">
                                        No chats yet. Create your first chat to get started!
                                    </p>
                                )}
                            </div>
                        )}
                    </div>

                    {/* Delete Dialog */}
                    <DeleteAlert
                        isOpen={showDeleteDialog}
                        onClose={() => {
                            setShowDeleteDialog(false);
                            setChatToDelete(null);
                        }}
                        onConfirm={handleConfirmDelete}
                        chatName={chatToDelete?.name}
                    />

                    {/* Create Chat Dialog */}
                    <CreateChatDialog
                        open={createChatDialog.open}
                        onClose={createChatDialog.handleClose}
                        onSuccess={handleChatCreated}
                    />
                </div>
            )}
        </>
    );
}

export default Sidebar;