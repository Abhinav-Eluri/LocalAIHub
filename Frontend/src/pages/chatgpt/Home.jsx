import React from "react";
import Sidebar from "../../components/chatgpt/sidebar.jsx";
import Chat from "../../components/chatgpt/Chat.jsx";

function Home() {
    const [selectedChat, setSelectedChat] = React.useState("");

    return (
        <div className="w-full min-h-screen bg-white dark:bg-gray-800 flex">
            {/* Sidebar */}
            <div className="w-1/4 bg-black text-white flex flex-col">
                <Sidebar setSelectedChat={setSelectedChat}  />
            </div>

            {/* Main Content */}
            <div className="w-3/4 flex flex-col">
                <Chat selectedChat={selectedChat} />
            </div>
        </div>
    );
}

export default Home;
