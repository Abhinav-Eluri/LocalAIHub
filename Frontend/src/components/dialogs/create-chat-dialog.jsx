import React, { useState, useEffect } from 'react';
import { Search, Sparkles, Bot, Cpu, Crown, Zap, Check } from 'lucide-react';
import Dialog from "../dialog.jsx";
import { DialogActions, DialogContent, DialogTitle } from "../dialog.jsx";
import { chatAPI } from "../../services/api.js";
import { useSelector } from "react-redux";

const ModelSelection = ({ selectedModel, onModelSelect }) => {
    const [searchTerm, setSearchTerm] = useState('');
    const [activeTab, setActiveTab] = useState('OPENAI');

    const modelCategories = {
        'OPENAI': {
            icon: Crown,
            models: [
                { value: 'gpt-3.5-turbo', label: 'GPT 3.5 Turbo', feature: 'Fast & Efficient' },
                { value: 'gpt-4o-mini', label: 'GPT 4.0 Mini', feature: 'Balanced' },
                { value: 'gpt-4o', label: 'GPT 4.0', feature: 'Most Capable' },
                { value: 'gpt-4o-realtime-preview', label: 'GPT 4.0 Realtime', feature: 'Preview' }
            ]
        },
        'Gemini': {
            icon: Sparkles,
            models: [
                { value: 'gemini-1.5-pro', label: 'GEMINI 1.5 PRO', feature: 'Advanced' },
                { value: 'gemini-1.5-flash', label: 'Gemini 1.5 Flash', feature: 'Fast' },
                { value: 'gemini-2.0-flash', label: 'Gemini 2.0 Flash', feature: 'Latest' }
            ]
        },
        'Claude': {
            icon: Bot,
            models: [
                { value: 'claude-3-5-sonnet-latest', label: 'Claude 3.5 Sonnet', feature: 'Latest' },
                { value: 'claude-3-5-haiku-latest', label: 'Claude 3.5 Haiku', feature: 'Fast' },
                { value: 'claude-3-haiku-20240307', label: 'Claude 3 Haiku', feature: 'Efficient' }
            ]
        },
        'Offline': {
            icon: Cpu,
            models: [
                { value: 'llama3.2', label: 'LLama3.2', feature: 'Open Source' },
                { value: 'deepseek-r1', label: 'DEEPSEEK', feature: 'Research' },
                {value: 'llama3.3', label: 'LLama3.3', feature: 'Powerful' },
            ]
        },
        'Cohere': {
            icon: Crown,
            models: [
                {
                    value: 'command-light', label: 'Command Light', feature: 'Efficient',
                },
                {
                    value: 'command-light-nightly', label: 'Command Light Nightly', feature: 'Efficient',
                },
                {
                    value: 'command-nightly', label: 'Command Nightly', feature: 'Powerful',
                },
                {
                    value: 'command-r', label: 'Command R', feature: 'Reasoning',
                },
                {
                    value: 'command-r-plus-08-2024', label: 'Command R+', feature: 'Advanced Reasoning',
                }
            ]
        }

    };

    const filterModels = (models, term) => {
        if (!term) return models;
        const lowerTerm = term.toLowerCase();
        return models.filter(model =>
            model.label.toLowerCase().includes(lowerTerm) ||
            model.value.toLowerCase().includes(lowerTerm) ||
            model.feature.toLowerCase().includes(lowerTerm)
        );
    };

    const models = searchTerm
        ? Object.values(modelCategories).flatMap(cat => filterModels(cat.models, searchTerm))
        : modelCategories[activeTab].models;

    return (
        <div className="relative">
            {/* Search Bar */}
            <div className="relative mb-4">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
                <input
                    type="text"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="w-full pl-10 pr-4 py-2 border border-gray-200 rounded-lg
                             focus:ring-2 focus:ring-blue-500 focus:border-blue-500
                             outline-none transition duration-200 text-sm"
                    placeholder="Search AI models..."
                />
            </div>

            {/* Tabs */}
            {!searchTerm && (
                <div className="flex space-x-1 mb-4 overflow-x-auto hide-scrollbar">
                    {Object.keys(modelCategories).map((category) => {
                        const Icon = modelCategories[category].icon;
                        return (
                            <button
                                key={category}
                                onClick={() => setActiveTab(category)}
                                className={`flex items-center px-4 py-2 rounded-lg text-sm font-medium 
                                          whitespace-nowrap transition-colors duration-200 
                                          ${activeTab === category
                                    ? 'bg-blue-100 text-blue-700'
                                    : 'text-gray-500 hover:text-gray-700 hover:bg-gray-100'}`}
                            >
                                <Icon className="w-4 h-4 mr-2" />
                                {category}
                            </button>
                        );
                    })}
                </div>
            )}

            {/* Models Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 max-h-[280px] overflow-y-auto pr-2">
                {models.map(model => (
                    <button
                        key={model.value}
                        onClick={() => onModelSelect(model.value)}
                        className={`flex flex-col p-3 rounded-lg border transition-all duration-200
                            ${selectedModel === model.value
                            ? 'border-blue-500 bg-blue-50 ring-2 ring-blue-500 ring-opacity-50'
                            : 'border-gray-200 hover:border-blue-200 hover:bg-gray-50'}`}
                    >
                        <div className="flex items-center justify-between mb-2">
                            <span className="font-medium text-gray-900 text-sm truncate mr-2">
                                {model.label}
                            </span>
                            {selectedModel === model.value && (
                                <Check className="w-4 h-4 text-blue-500 flex-shrink-0" />
                            )}
                        </div>
                        <div className="flex items-center gap-1.5 mt-auto">
                            <Zap className="w-3 h-3 text-gray-400 flex-shrink-0" />
                            <span className="text-xs text-gray-500 truncate">{model.feature}</span>
                        </div>
                    </button>
                ))}

                {models.length === 0 && (
                    <div className="col-span-full text-center py-8">
                        <p className="text-gray-500">No models found matching your search.</p>
                    </div>
                )}
            </div>
        </div>
    );
};

function CreateChatDialog({ open, onClose, onSuccess }) {
    const { user } = useSelector(state => state.auth);
    const [loading, setLoading] = useState(false);
    const [name, setName] = useState('');
    const [model, setModel] = useState('');

    useEffect(() => {
        if (open) {
            setName('');
            setModel('');
            setLoading(false);
        }
    }, [open]);

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

    return (
        <Dialog open={open} onClose={onClose} size="xl">
            <DialogTitle className="text-xl font-semibold text-gray-900 p-6 border-b border-gray-200">
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
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2
                                 focus:ring-blue-500 focus:border-blue-500 outline-none transition
                                 duration-200 text-gray-900"
                        placeholder="Enter chat name..."
                    />
                </div>

                <div className="space-y-2">
                    <label className="block text-sm font-medium text-gray-700">
                        Select Model
                    </label>
                    <ModelSelection
                        selectedModel={model}
                        onModelSelect={setModel}
                    />
                    <p className="text-xs text-gray-500 mt-2">
                        Choose the AI model that best fits your needs
                    </p>
                </div>
            </DialogContent>

            <DialogActions className="p-6 border-t border-gray-200 flex flex-col sm:flex-row gap-3 sm:justify-end">
                <button
                    onClick={onClose}
                    className="px-6 py-2 text-gray-700 bg-gray-100 rounded-lg hover:bg-gray-200
                             transition duration-200 font-medium"
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