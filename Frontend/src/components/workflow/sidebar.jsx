import React, { useEffect, useState } from 'react';
import { Plus, Clock, Star, ChevronLeft, ChevronRight } from 'lucide-react';
import { useDialog } from "../../hooks/use-dialog.js";
import WorkflowCreate from "../dialogs/workflow-create.jsx";
import { workflowAPI } from "../../services/api.js";

function WorkflowSidebar({ handleWorkflowChange, onCollapseChange }) {
    const [workflows, setWorkflows] = useState([]);
    const [selectedWorkflowId, setSelectedWorkflowId] = useState(null);
    const [isCollapsed, setIsCollapsed] = useState(false);
    const WorkflowCreateDialog = useDialog();

    const handleCollapse = () => {
        setIsCollapsed(!isCollapsed);
        onCollapseChange?.(!isCollapsed);
    };

    const fetchWorkflows = () => {
        workflowAPI.getWorkflows().then((response) => {
            setWorkflows(response.data);
        });
    };

    useEffect(() => {
        fetchWorkflows();
    }, []);

    const handleWorkflowSelect = (workflowId) => {
        setSelectedWorkflowId(workflowId);
        handleWorkflowChange(workflowId);
    };

    return (
        <div className={`relative h-full bg-gray-50 dark:bg-gray-900 border-r border-gray-200 
                        dark:border-gray-700 transition-all duration-300 ${isCollapsed ? 'w-16' : 'w-64'}`}>
            {/* Toggle Collapse Button */}
            <button
                onClick={handleCollapse}
                className="absolute -right-3 top-4 bg-gray-100 dark:bg-gray-800 rounded-full p-1
                         hover:bg-gray-200 dark:hover:bg-gray-700 z-10"
            >
                {isCollapsed ? (
                    <ChevronRight className="w-4 h-4 text-gray-600 dark:text-gray-400" />
                ) : (
                    <ChevronLeft className="w-4 h-4 text-gray-600 dark:text-gray-400" />
                )}
            </button>

            <div className="p-4 space-y-6">
                {/* Create Workflow Button */}
                {isCollapsed ? (
                    <button
                        onClick={WorkflowCreateDialog.handleOpen}
                        className="w-full flex justify-center p-2 text-white bg-blue-600
                                 hover:bg-blue-700 dark:bg-blue-500 dark:hover:bg-blue-600
                                 rounded-lg transition-colors"
                    >
                        <Plus className="w-5 h-5" />
                    </button>
                ) : (
                    <button
                        onClick={WorkflowCreateDialog.handleOpen}
                        className="w-full flex items-center justify-center gap-2 py-3 px-4
                                 bg-blue-600 hover:bg-blue-700 dark:bg-blue-500
                                 dark:hover:bg-blue-600 text-white font-semibold
                                 rounded-lg transition-colors"
                    >
                        <Plus size={20} />
                        Create Workflow
                    </button>
                )}

                {/* Quick Actions */}
                <div className="space-y-2">
                    {!isCollapsed && (
                        <h3 className="text-sm font-medium text-gray-500 dark:text-gray-400 uppercase">
                            Quick Actions
                        </h3>
                    )}
                    <div className="space-y-1">
                        <button className="w-full flex items-center gap-2 px-3 py-2 text-gray-700
                                       dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800
                                       rounded-md text-left">
                            <Star size={18} />
                            {!isCollapsed && <span>Favorites</span>}
                        </button>
                        <button className="w-full flex items-center gap-2 px-3 py-2 text-gray-700
                                       dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800
                                       rounded-md text-left">
                            <Clock size={18} />
                            {!isCollapsed && <span>Recent</span>}
                        </button>
                    </div>
                </div>

                {/* Past Workflows */}
                <div className="space-y-2">
                    {!isCollapsed && (
                        <h3 className="text-sm font-medium text-gray-500 dark:text-gray-400 uppercase">
                            Past Workflows
                        </h3>
                    )}
                    <div className="space-y-1">
                        {workflows.length > 0 ? (
                            workflows.map((workflow) => (
                                <button
                                    key={workflow.id}
                                    onClick={() => handleWorkflowSelect(workflow.id)}
                                    className={`w-full px-3 py-2 text-left rounded-md transition-colors
                                            flex items-center gap-2 ${
                                        selectedWorkflowId === workflow.id
                                            ? 'bg-blue-100 dark:bg-blue-900 text-blue-700 dark:text-blue-300 hover:bg-blue-200 dark:hover:bg-blue-800'
                                            : 'text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800'
                                    }`}
                                >
                                    <Plus size={18} className="flex-shrink-0" />
                                    {!isCollapsed && workflow.name}
                                </button>
                            ))
                        ) : (
                            !isCollapsed && (
                                <p className="text-sm text-gray-500 dark:text-gray-400 px-3 py-2">
                                    No workflows yet
                                </p>
                            )
                        )}
                    </div>
                </div>
            </div>
            <WorkflowCreate
                open={WorkflowCreateDialog.open}
                onClose={WorkflowCreateDialog.handleClose}
                onWorkflowCreated={fetchWorkflows}
            />
        </div>
    );
}

export default WorkflowSidebar;