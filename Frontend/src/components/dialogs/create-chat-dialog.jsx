import React, { useState } from 'react';
import Dialog, {DialogActions, DialogContent, DialogTitle} from "../dialog.jsx";
import {chatAPI} from "../../services/api.js";
import {useSelector} from "react-redux";

function CreateChatDialog(props) {
    const {user} = useSelector(state => state.auth)
    const { open, onClose, onSuccess } = props;
    const [loading, setLoading] = useState(false);
    const [name, setName] = useState('');
    const [model, setModel] = useState('');

    const handleSubmit = async () => {
        try {
            const response = await chatAPI.createChat({
                name: name,
                model: model,
                user_id: user.id,
            });
            if (onSuccess) {
                onSuccess(response.data);
            }
        } catch (error) {
            console.error('Error creating chat:', error);
            // Handle error appropriately
        }
    };

    return (
        <Dialog open={open} onClose={onClose} size="md">
            <DialogTitle className="text-center text-2xl font-semibold text-gray-900 p-6 border-b border-gray-200">
                Create New Chat
            </DialogTitle>

            <DialogContent className="p-6 space-y-6">
                <div className="space-y-2">
                    <label htmlFor="chat-name" className="block text-sm font-medium text-gray-700">
                        Chat Name
                    </label>
                    <input
                        id="chat-name"
                        type="text"
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition duration-200 text-gray-900"
                        placeholder="Enter chat name..."
                    />
                </div>

                <div className="space-y-2">
                    <label htmlFor="model" className="block text-sm font-medium text-gray-700">
                        Select Model
                    </label>
                    <select
                        id="model"
                        value={model}
                        onChange={(e) => setModel(e.target.value)}
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition duration-200 text-gray-900"
                    >
                        <option value="" disabled className="text-gray-500">Select a model</option>
                        <optgroup label="GPT Models" className="text-gray-900">
                            <option value="gpt-3.5-turbo" className="text-gray-900">GPT 3.5 Turbo</option>
                            <option value="gpt-4o-mini" className="text-gray-900">GPT 4.0 Mini</option>
                            <option value="gpt-4o" className="text-gray-900">GPT 4.0</option>
                            <option value="gpt-4o-realtime-preview" className="text-gray-900">GPT 4.0 Realtime Preview</option>
                            <option value="gemini-1.5-pro" className="text-gray-900">GEMINI 1.5 PRO</option>
                            <option value="gemini-1.5-flash" className={"text-gray-900"}>Gemini 1.5 Flash</option>
                            <option value="gemini-1.5-flash-8b" className={"text-gray-900"}>Gemini 1.5 Flash-8B</option>
                            <option value="gemini-2.0-flash-lite-preview-02-05" className="text-gray-900">Gemini 2.0 Flash-Lite Preview</option>
                            <option value="gemini-2.0-flash" className="text-gray-900">Gemini 2.0 Flash</option>
                        </optgroup>
                        <optgroup label="Reasoning Models" className="text-gray-900">
                            <option value="o1" className="text-gray-900">GPT o1</option>
                            <option value="o1-mini" className="text-gray-900">GPT o1-mini</option>
                            <option value="o3-mini" className="text-gray-900">GPT o3-mini</option>
                        </optgroup>
                    </select>
                    <p className="text-sm text-gray-500">
                        Choose the AI model that best fits your needs
                    </p>
                </div>
            </DialogContent>

            <DialogActions className="p-6 border-t border-gray-200 flex flex-col sm:flex-row gap-3 sm:justify-end">
                <button
                    onClick={onClose}
                    className="px-6 py-2 text-gray-700 bg-gray-100 rounded-lg hover:bg-gray-200 transition duration-200 font-medium"
                >
                    Cancel
                </button>
                <button
                    onClick={handleSubmit}
                    disabled={loading || !name || !model}
                    className={`px-6 py-2 text-white rounded-lg transition duration-200 font-medium ${
                        loading || !name || !model
                            ? "bg-blue-400 cursor-not-allowed"
                            : "bg-blue-600 hover:bg-blue-700"
                    }`}
                >
                    {loading ? "Creating..." : "Create Chat"}
                </button>
            </DialogActions>
        </Dialog>
    );
}

export default CreateChatDialog;