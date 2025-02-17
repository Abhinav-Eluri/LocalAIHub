import React, { useState, useEffect, useRef } from 'react';
import Dialog from "../dialog.jsx";
import { DialogActions, DialogContent, DialogTitle } from "../dialog.jsx";
import { chatAPI } from "../../services/api.js";
import { useSelector } from "react-redux";
import { Search } from 'lucide-react';

function CreateChatDialog(props) {
    const { user } = useSelector(state => state.auth);
    const { open, onClose, onSuccess } = props;
    const [loading, setLoading] = useState(false);
    const [name, setName] = useState('');
    const [model, setModel] = useState('');
    const [searchTerm, setSearchTerm] = useState('');
    const [isOpen, setIsOpen] = useState(false);
    const dropdownRef = useRef(null);
    const searchRef = useRef(null);

    const allModels = {
        'OPENAI': [
            { value: 'gpt-3.5-turbo', label: 'GPT 3.5 Turbo' },
            { value: 'gpt-4o-mini', label: 'GPT 4.0 Mini' },
            { value: 'gpt-4o', label: 'GPT 4.0' },
            { value: 'gpt-4o-realtime-preview', label: 'GPT 4.0 Realtime Preview' }
        ],
        'Gemini': [
            { value: 'gemini-1.5-pro', label: 'GEMINI 1.5 PRO' },
            { value: 'gemini-1.5-flash', label: 'Gemini 1.5 Flash' },
            { value: 'gemini-1.5-flash-8b', label: 'Gemini 1.5 Flash-8B' },
            { value: 'gemini-2.0-flash-lite-preview-02-05', label: 'Gemini 2.0 Flash-Lite Preview' },
            { value: 'gemini-2.0-flash', label: 'Gemini 2.0 Flash' }
        ],
        'Claude': [
            { value: 'claude-3-5-sonnet-latest', label: 'Claude 3.5 Sonnet latest' },
            { value: 'claude-3-5-haiku-latest', label: 'Claude 3.5 Haiku latest' },
            { value: 'claude-3-haiku-20240307', label: 'Claude 3 Haiku' }
        ],
        'Offline': [
            { value: 'llama3.2', label: 'LLama3.2' },
            { value: 'deepseek-r1', label: 'DEEPSEEK' },
        ]
    };

    useEffect(() => {
        if (open) {
            setName('');
            setModel('');
            setSearchTerm('');
            setLoading(false);
            setIsOpen(false);
        }
    }, [open]);

    useEffect(() => {
        const handleClickOutside = (event) => {
            if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
                setIsOpen(false);
                setSearchTerm('');
            }
        };

        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);

    const handleSubmit = async () => {
        try {
            setLoading(true);
            const response = await chatAPI.createChat({
                name: name,
                model: model,
                user_id: user.id,
            });
            if (onSuccess) {
                onSuccess(response.data);
            }
            onClose();
        } catch (error) {
            console.error('Error creating chat:', error);
        } finally {
            setLoading(false);
        }
    };

    const filterModels = (models, term) => {
        if (!term) return models;

        const lowerTerm = term.toLowerCase();
        const filtered = {};

        Object.entries(models).forEach(([category, modelList]) => {
            const filteredModels = modelList.filter(model =>
                model.label.toLowerCase().includes(lowerTerm) ||
                model.value.toLowerCase().includes(lowerTerm)
            );
            if (filteredModels.length > 0) {
                filtered[category] = filteredModels;
            }
        });

        return filtered;
    };

    const getSelectedModelLabel = () => {
        for (const category of Object.values(allModels)) {
            const found = category.find(m => m.value === model);
            if (found) return found.label;
        }
        return '';
    };

    const handleOpen = () => {
        setIsOpen(true);
        // Focus search input after dropdown opens
        setTimeout(() => {
            if (searchRef.current) {
                searchRef.current.focus();
            }
        }, 0);
    };

    const handleModelSelect = (modelValue) => {
        setModel(modelValue);
        setIsOpen(false);
        setSearchTerm('');
    };

    const filteredModels = filterModels(allModels, searchTerm);

    return (
        <Dialog open={open} onClose={onClose} size="lg">
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
                    <div className="relative" ref={dropdownRef}>
                        <button
                            type="button"
                            onClick={handleOpen}
                            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition duration-200 text-gray-900 text-left bg-white"
                        >
                            {model ? getSelectedModelLabel() : 'Select a model'}
                        </button>

                        {isOpen && (
                            <div className="absolute z-10 w-full mt-1 bg-white border border-gray-200 rounded-lg shadow-lg">
                                <div className="p-2 border-b border-gray-200">
                                    <div className="flex items-center px-2 py-1 border border-gray-300 rounded">
                                        <Search className="w-4 h-4 text-gray-400 mr-2" />
                                        <input
                                            ref={searchRef}
                                            type="text"
                                            value={searchTerm}
                                            onChange={(e) => setSearchTerm(e.target.value)}
                                            className="w-full outline-none text-sm"
                                            placeholder="Search models..."
                                        />
                                    </div>
                                </div>
                                <div className="max-h-64 overflow-y-auto">
                                    {Object.entries(filteredModels).map(([category, models]) => (
                                        <div key={category} className="px-2 py-1">
                                            <div className="text-xs font-semibold text-gray-500 px-2 py-1">
                                                {category}
                                            </div>
                                            {models.map(modelOption => (
                                                <div
                                                    key={modelOption.value}
                                                    onClick={() => handleModelSelect(modelOption.value)}
                                                    className={`px-2 py-2 rounded-md cursor-pointer text-sm ${
                                                        model === modelOption.value
                                                            ? 'bg-blue-50 text-blue-700'
                                                            : 'hover:bg-gray-50 text-gray-900'
                                                    }`}
                                                >
                                                    {modelOption.label}
                                                </div>
                                            ))}
                                        </div>
                                    ))}
                                    {Object.keys(filteredModels).length === 0 && (
                                        <div className="px-4 py-3 text-sm text-gray-500 text-center">
                                            No models found
                                        </div>
                                    )}
                                </div>
                            </div>
                        )}
                    </div>
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