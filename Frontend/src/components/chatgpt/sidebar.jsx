import React, {useEffect, useState} from 'react';
import {MessageSquare, PlusIcon} from "lucide-react";
import CreateChatDialog from "../dialogs/create-chat-dialog.jsx";
import {useDialog} from "../../hooks/use-dialog.js";
import {chatAPI} from "../../services/api.js";
import {useSelector} from "react-redux";


function Sidebar(props) {
    const {setSelectedChat} = props;
    const createChatDialog = useDialog()
    const {user} = useSelector(state => state.auth);
    const [chats, setChats] = useState([]);
    const handleNewChat = () => {
        createChatDialog.handleOpen()
    }

    const fetchChats = () => {
        chatAPI.getChats({user_id: user?.id}).then((response) => {
            const sortedChats = response.data.sort((a, b) => new Date(b.created_at) - new Date(a.created_at));
            setChats(sortedChats);
        }).catch((error) => {
            console.log(error);
        })
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

    return (
        <>
            {user && (
                <div className="flex flex-col h-full bg-gray-900 border-r border-gray-800">
                    <div className="p-4">
                        <button
                            onClick={handleNewChat}
                            className="w-full inline-flex items-center justify-center gap-2 px-4 py-3 text-sm font-medium text-white bg-blue-600 rounded-lg hover:bg-blue-700 transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 focus:ring-offset-gray-900"
                        >
                            <PlusIcon className="w-5 h-5"/>
                            Create New Chat
                        </button>
                    </div>

                    <div className="flex-1 overflow-y-auto px-2">
                        {chats.length > 0 ? (
                            <>
                                <h1 className="text-gray-400 text-xs font-semibold uppercase tracking-wider px-3 mb-2">
                                    Your Chats
                                </h1>
                                <div className="space-y-1">
                                    {chats.map((chat) => (
                                        <button
                                            key={chat.id}
                                            onClick={() => setSelectedChat(chat.id)}
                                            className="w-full flex items-start gap-3 p-3 text-left rounded-lg hover:bg-gray-800 transition-all duration-200 group"
                                        >
                                            <div className="flex-shrink-0 mt-1">
                                                <MessageSquare className="w-4 h-4 text-gray-500 group-hover:text-blue-400"/>
                                            </div>
                                            <div className="flex-1 min-w-0">
                                                <h3 className="text-sm font-medium text-gray-200 group-hover:text-white truncate">
                                                    {chat.name || 'Untitled Chat'}
                                                </h3>
                                                <p className="mt-1 text-xs text-gray-500 group-hover:text-gray-400">
                                                    {chat.model}
                                                </p>
                                            </div>
                                        </button>
                                    ))}
                                </div>
                            </>
                        ) : (
                            <div className="flex flex-col items-center justify-center h-full px-4 py-8">
                                <MessageSquare className="w-12 h-12 text-gray-600 mb-4"/>
                                <p className="text-sm text-gray-400 text-center">
                                    No chats yet. Create your first chat to get started!
                                </p>
                            </div>
                        )}
                    </div>

                    <CreateChatDialog open={createChatDialog.open} onClose={createChatDialog.handleClose}
                                      onSuccess={handleChatCreated}/>
                </div>
            )}
        </>


    );
}

export default Sidebar;