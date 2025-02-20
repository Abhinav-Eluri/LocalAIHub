import { Send } from "lucide-react";
import React, { useState } from "react";
import { chatAPI } from "../../services/api.js";

export default function Home() {
    const [searchActive, setSearchActive] = useState(false);
    const [message, setMessage] = useState("");
    const [response, setResponse] = useState(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);

    async function handleSubmit() {
        if (!message.trim()) return; // Prevent empty submissions
        setLoading(true);
        setError(null);
        try {
            const resp = await chatAPI.searchWithTool({ message:message, searchActive: searchActive });
            setResponse(resp.data.message);
        } catch (err) {
            console.error("API Error:", err);
            setError("Something went wrong. Please try again.");
        } finally {
            setLoading(false);
            setMessage("");
        }
    }

    function handleWebSearch() {
        setSearchActive((prev) => !prev);
    }

    return (
        <div className="flex flex-col items-center justify-center min-h-screen bg-gray-900 text-white p-6">
            <h1 className="text-2xl sm:text-3xl font-semibold mb-6 text-center">
                How can I help you today?
            </h1>

            {/* Input Section */}
            <div className="w-full max-w-xl relative">
                <input
                    type="text"
                    placeholder="Ask your question here..."
                    className="w-full px-4 py-3 rounded-lg bg-gray-800 text-white placeholder-gray-400 border border-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500 transition"
                    value={message}
                    onChange={(e) => setMessage(e.target.value)}
                />
                <button
                    onClick={handleSubmit}
                    className="absolute right-4 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-white transition"
                    disabled={loading}
                >
                    <Send className="w-5 h-5" />
                </button>
            </div>

            {/* Loading Indicator */}
            {loading && <p className="mt-4 text-blue-400 animate-pulse">Loading...</p>}

            {/* Error Message */}
            {error && <p className="mt-4 text-red-400">{error}</p>}

            {/* Response Section */}
            {response && (
                <div className="w-full max-w-2xl mt-6 p-4 bg-gray-800 rounded-lg shadow-lg">
                    <h2 className="text-lg font-semibold text-white mb-3">Response</h2>
                    <p className="p-3 bg-gray-700 text-white rounded-lg">
                        {response}
                    </p>
                </div>
            )}

            {/* Web Search Toggle Button */}
            <button
                onClick={handleWebSearch}
                className={`mt-6 px-5 py-2 rounded-full transition text-white font-medium ${
                    searchActive ? "bg-blue-600 hover:bg-blue-700" : "bg-gray-600 hover:bg-gray-700"
                }`}
            >
                {searchActive ? "Disable Web Search" : "Enable Web Search"}
            </button>
        </div>
    );
}
