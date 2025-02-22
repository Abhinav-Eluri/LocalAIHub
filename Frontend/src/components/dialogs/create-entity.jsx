import React, { useState, useEffect } from 'react';
import Dialog, { DialogContent, DialogTitle } from "../dialog.jsx";

function CreateEntity(props) {
    const { open, onClose, entityType, nodes, onSubmit } = props;
    const [formData, setFormData] = useState({
        name: '',
        role: '',
        goal: '',
        backstory: '',
        description: '',
        selectedAgents: [],
        tools: ''
    });

    // Reset form when dialog opens/closes or entity type changes
    useEffect(() => {
        if (open) {
            setFormData({
                name: '',
                role: '',
                goal: '',
                backstory: '',
                description: '',
                selectedAgents: [],
                tools: ''
            });
        }
    }, [open, entityType]);

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: value
        }));
    };

    const handleAgentSelection = (e) => {
        const selectedOptions = Array.from(e.target.selectedOptions, option => option.value);
        setFormData(prev => ({
            ...prev,
            selectedAgents: selectedOptions
        }));
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        onSubmit(formData);
    };

    // Get available agents for task creation
    const availableAgents = nodes.filter(node =>
        node.data.type === 'agent'
    ).map(node => ({
        id: node.id,
        label: node.data.label
    }));

    return (
        <Dialog open={open} onClose={onClose} size="lg">
            <DialogTitle>
                Create {entityType === 'agent' ? 'Agent' : 'Task'}
            </DialogTitle>
            <DialogContent>
                <form onSubmit={handleSubmit} className="space-y-4">
                    {entityType === 'agent' ? (
                        // Agent Form Fields
                        <>
                            <div className="flex flex-col">
                                <label className="text-sm font-medium mb-1">Role</label>
                                <input
                                    type="text"
                                    name="role"
                                    value={formData.role}
                                    onChange={handleInputChange}
                                    className="border rounded-md p-2"
                                    required
                                    placeholder="Enter agent's role"
                                />
                            </div>
                            <div className="flex flex-col">
                                <label className="text-sm font-medium mb-1">Goal</label>
                                <textarea
                                    name="goal"
                                    value={formData.goal}
                                    onChange={handleInputChange}
                                    className="border rounded-md p-2"
                                    rows="3"
                                    required
                                    placeholder="What is this agent's primary goal?"
                                />
                            </div>
                            <div className="flex flex-col">
                                <label className="text-sm font-medium mb-1">Backstory</label>
                                <textarea
                                    name="backstory"
                                    value={formData.backstory}
                                    onChange={handleInputChange}
                                    className="border rounded-md p-2"
                                    rows="5"
                                    required
                                    placeholder="Provide context and background for this agent"
                                />
                            </div>
                        </>
                    ) : (
                        // Task Form Fields
                        <>
                            <div className="flex flex-col">
                                <label className="text-sm font-medium mb-1">Name</label>
                                <input
                                    type="text"
                                    name="name"
                                    value={formData.name}
                                    onChange={handleInputChange}
                                    className="border rounded-md p-2"
                                    required
                                    placeholder="Enter task name"
                                />
                                <label className="text-sm font-medium mb-1">Description</label>
                                <textarea
                                    name="description"
                                    value={formData.description}
                                    onChange={handleInputChange}
                                    className="border rounded-md p-2"
                                    rows="3"
                                    required
                                    placeholder="Describe the task in detail"
                                />
                            </div>
                            <div className="flex flex-col">
                                <label className="text-sm font-medium mb-1">Available Agents</label>
                                <select
                                    multiple
                                    name="selectedAgents"
                                    value={formData.selectedAgents}
                                    onChange={handleAgentSelection}
                                    className="border rounded-md p-2"
                                    required
                                    size={4}
                                >
                                    {availableAgents.map(agent => (
                                        <option key={agent.id} value={agent.id}>
                                            {agent.label}
                                        </option>
                                    ))}
                                </select>
                                <span className="text-xs text-gray-500 mt-1">
                                    Hold Ctrl/Cmd to select multiple agents
                                </span>
                            </div>
                            <div className="flex flex-col">
                                <label className="text-sm font-medium mb-1">Tools</label>
                                <textarea
                                    name="tools"
                                    value={formData.tools}
                                    onChange={handleInputChange}
                                    className="border rounded-md p-2"
                                    rows="2"
                                    placeholder="Enter tools (comma-separated)"
                                />
                            </div>
                        </>
                    )}

                    <div className="flex justify-end space-x-2 mt-4">
                        <button
                            type="button"
                            onClick={onClose}
                            className="px-4 py-2 border rounded-md hover:bg-gray-100"
                        >
                            Cancel
                        </button>
                        <button
                            type="submit"
                            className="px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600"
                        >
                            Create
                        </button>
                    </div>
                </form>
            </DialogContent>
        </Dialog>
    );
}

export default CreateEntity;