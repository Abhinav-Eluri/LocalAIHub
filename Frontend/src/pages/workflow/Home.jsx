import React, { useState } from 'react';
import Workflow from "../../components/workflow/workflow.jsx";
import WorkflowSidebar from "../../components/workflow/sidebar.jsx";
import { Plus } from 'lucide-react';

function Home() {
    const [selectedWorkflowId, setSelectedWorkflowId] = useState(null);
    const [sidebarWidth, setSidebarWidth] = useState('w-64');

    const handleWorkflowChange = (workflowId) => {
        setSelectedWorkflowId(workflowId);
    };

    const handleSidebarCollapse = (isCollapsed) => {
        setSidebarWidth(isCollapsed ? 'w-16' : 'w-64');
    };

    return (
        <div className="h-screen w-full flex">
            <div className={`h-full flex-shrink-0 transition-all duration-300 ${sidebarWidth}`}>
                <WorkflowSidebar
                    handleWorkflowChange={handleWorkflowChange}
                    onCollapseChange={handleSidebarCollapse}
                />
            </div>

            <div className="flex-1 flex flex-col h-screen overflow-hidden">
                <div className="flex-1 relative overflow-hidden">
                    {selectedWorkflowId ? (
                        <Workflow workflowId={selectedWorkflowId} />
                    ) : (
                        <div className="h-full flex items-center justify-center">
                            <div className="text-center space-y-4">
                                <div className="bg-gray-100 dark:bg-gray-800 rounded-full p-4 mx-auto w-fit">
                                    <Plus className="w-8 h-8 text-gray-400 dark:text-gray-500" />
                                </div>
                                <h2 className="text-xl font-semibold text-gray-700 dark:text-gray-300">
                                    No Workflow Selected
                                </h2>
                                <p className="text-gray-500 dark:text-gray-400 max-w-sm">
                                    Select an existing workflow from the sidebar or create a new one to get started
                                </p>
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}

export default Home;