import React, { useState } from 'react';
import Dialog, { DialogActions, DialogContent, DialogTitle } from "../dialog.jsx";
import { workflowAPI } from "../../services/api.js";
import { useSelector } from "react-redux";

const WorkflowCreate = ({ open, onClose, onWorkflowCreated }) => {
    // Initialize with empty string to ensure it's controlled from the start
    const [name, setName] = useState('');

    const handleCreateWorkflow = async () => {
        try {
            const response = await workflowAPI.createWorkflow({ name });
            setName(''); // Clear the input
            onWorkflowCreated()
            onClose(); // Close the dialog after successful creation
        } catch (error) {
            console.error("Error creating workflow:", error);
        }
    };

    const handleCancel = () => {
        setName(''); // Clear the input
        onClose(); // Close the dialog
    };

    return (
        <Dialog open={open} size="md" onClose={onClose}>
            <DialogTitle className="text-lg font-semibold text-gray-700 p-4 border-b">
                Create Workflow
            </DialogTitle>
            <DialogContent className="p-4">
                <p className="text-sm text-gray-600 mb-2">
                    Enter the details below to create a new workflow.
                </p>
                <input
                    type="text"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    className="mt-3 w-full p-2 border-2 rounded-lg focus:ring-2 focus:ring-blue-400 focus:outline-none mb-4"
                    placeholder="Enter workflow name"
                />
            </DialogContent>
            <DialogActions className="p-4 border-t flex gap-2 justify-end">
                <button
                    onClick={handleCancel}
                    className="rounded-md bg-gray-400 hover:bg-gray-500 text-white px-4 py-2"
                >
                    Cancel
                </button>
                <button
                    onClick={handleCreateWorkflow}
                    disabled={!name.trim()}
                    className="rounded-md bg-blue-400 hover:bg-blue-500 text-white px-4 py-2 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                    Create
                </button>
            </DialogActions>
        </Dialog>
    );
};

export default WorkflowCreate;