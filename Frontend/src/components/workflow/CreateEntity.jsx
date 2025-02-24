// src/components/Workflow/CreateEntity.jsx
import React, { useState, useEffect, useCallback } from 'react';
import Dialog from '../Dialog'; // Your custom Dialog component
import { DialogContent, DialogTitle, DialogActions } from '../Dialog'; //Your subcomponents

const CreateEntity = ({ open, onClose, entityType, nodes, onSubmit }) => {
    const initialAgentData = {
        role: '',
        goal: '',
        backstory: '',
    };

    const initialTaskData = {
        name: '',
        description: '',
        expectedOutput: '',
        agent: '', // Or an array for multiple agents
        tools: '',
    };

    const [formData, setFormData] = useState(
        entityType === 'agent' ? initialAgentData : initialTaskData
    );

    const [availableAgents, setAvailableAgents] = useState([]);

    useEffect(() => {
        if (open) {
            setFormData(entityType === 'agent' ? initialAgentData : initialTaskData);
        }
    }, [open, entityType]);

    useEffect(() => {
        // Populate available agents
        const agentList = Array.isArray(nodes)
            ? nodes
                .filter(node => node?.type === 'agent')
                .map(node => ({
                    id: node.id,
                    label: node.data?.role || 'Unnamed Agent'
                }))
            : [];
        setAvailableAgents(agentList);
    }, [nodes]);

    const handleChange = (event) => {
        const { name, value } = event.target;
        setFormData({
            ...formData,
            [name]: value,
        });
    };

    const handleSubmit = () => {
        onSubmit(formData);
        onClose();
    };

    const renderAgentForm = () => {
        return (
            <>
                <div className="flex flex-col mb-4">
                    <label htmlFor="role" className="text-sm font-medium mb-1">Agent Role</label>
                    <input
                        type="text"
                        id="role"
                        name="role"
                        value={formData.role}
                        onChange={handleChange}
                        className="border rounded-md p-2"
                    />
                </div>
                <div className="flex flex-col mb-4">
                    <label htmlFor="goal" className="text-sm font-medium mb-1">Agent Goal</label>
                    <textarea
                        id="goal"
                        name="goal"
                        value={formData.goal}
                        onChange={handleChange}
                        className="border rounded-md p-2"
                        rows="3"
                    />
                </div>
                <div className="flex flex-col mb-4">
                    <label htmlFor="backstory" className="text-sm font-medium mb-1">Agent Backstory</label>
                    <textarea
                        id="backstory"
                        name="backstory"
                        value={formData.backstory}
                        onChange={handleChange}
                        className="border rounded-md p-2"
                        rows="3"
                    />
                </div>
            </>
        );
    };

    const renderTaskForm = () => {
        return (
            <>
                <div className="flex flex-col mb-4">
                    <label htmlFor="name" className="text-sm font-medium mb-1">Task Name</label>
                    <input
                        type="text"
                        id="name"
                        name="name"
                        value={formData.name}
                        onChange={handleChange}
                        className="border rounded-md p-2"
                    />
                </div>
                <div className="flex flex-col mb-4">
                    <label htmlFor="description" className="text-sm font-medium mb-1">Task Description</label>
                    <textarea
                        id="description"
                        name="description"
                        value={formData.description}
                        onChange={handleChange}
                        className="border rounded-md p-2"
                        rows="3"
                    />
                </div>
                <div className="flex flex-col mb-4">
                    <label htmlFor="expectedOutput" className="text-sm font-medium mb-1">Expected Output</label>
                    <textarea
                        id="expectedOutput"
                        name="expectedOutput"
                        value={formData.expectedOutput}
                        onChange={handleChange}
                        className="border rounded-md p-2"
                        rows="3"
                    />
                </div>
                <div className="flex flex-col mb-4">
                    <label htmlFor="agent" className="text-sm font-medium mb-1">Assigned Agent</label>
                    <select
                        id="agent"
                        name="agent"
                        value={formData.agent}
                        onChange={handleChange}
                        className="border rounded-md p-2"
                    >
                        <option value="">Select an Agent</option>
                        {availableAgents && availableAgents.map((agent) => (
                            <option key={agent.id} value={agent.id}>
                                {agent.label}
                            </option>
                        ))}
                    </select>
                </div>
                <div className="flex flex-col mb-4">
                    <label htmlFor="tools" className="text-sm font-medium mb-1">Tools</label>
                    <input
                        type="text"
                        id="tools"
                        name="tools"
                        value={formData.tools}
                        onChange={handleChange}
                        className="border rounded-md p-2"
                    />
                    <p className="text-xs text-gray-500">Comma-separated list</p>
                </div>
            </>
        );
    };

    return (
        <Dialog open={open} onClose={onClose} size="md">
            <DialogTitle>
                Create {entityType === 'agent' ? 'Agent' : 'Task'}
            </DialogTitle>
            <DialogContent>
                <form className="space-y-4">
                    {entityType === 'agent' ? renderAgentForm() : renderTaskForm()}
                </form>
            </DialogContent>
            <DialogActions>
                <button onClick={onClose} className="px-4 py-2 bg-gray-200 rounded">Cancel</button>
                <button onClick={handleSubmit} className="px-4 py-2 bg-blue-500 text-white rounded">Create</button>
            </DialogActions>
        </Dialog>
    );
};

export default CreateEntity;