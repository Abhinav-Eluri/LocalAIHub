// src/components/Workflow/Workflow.jsx
import React, { useCallback, useEffect, useState } from 'react';
import {
    useNodesState,
    useEdgesState,
    addEdge,
    ReactFlow,
    Controls,
    Background,
    Position,
    Handle,
    Panel
} from '@xyflow/react';
import { useSelector } from "react-redux";
import { toast } from 'react-toastify';

import AgentNode from "./NodeComponents/AgentNode";
import TaskNode from "./NodeComponents/TaskNode";
import { workflowAPI } from "../../services/api.js";
import CreateEntity from "../../components/workflow/CreateEntity.jsx"; // Add this import
import { useDialog } from "../../hooks/use-dialog.js"; // Add this import

// Helper function to generate a random number
const generateRandomNumber = () => Math.floor(Math.random() * 100);

// Custom node types
const nodeTypes = {
    agent: AgentNode,
    task: TaskNode
};

function Workflow({ workflowId }) {
    const [nodes, setNodes, onNodesChange] = useNodesState([]);
    const [edges, setEdges, onEdgesChange] = useEdgesState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [isSaving, setIsSaving] = useState(false);
    const [entityType, setEntityType] = useState(null);
    const { user } = useSelector(state => state.auth);
    const createEntity = useDialog(); // Initialize useDialog

    useEffect(() => {
        const loadWorkflowData = async () => {
            setIsLoading(true);
            try {
                const response = await workflowAPI.getWorkflow(workflowId);
                const data = response.data;
                console.log("data", data);
                // Transform agents and tasks into nodes
                const agentNodes = data.agents.map(agent => ({
                    id: agent.agent_id, // Use agent_id as the node ID
                    type: 'agent',
                    position: { x: generateRandomNumber(), y: generateRandomNumber() },
                    data: { ...agent, label: agent.role }, // Agent data and role as label
                }));

                const taskNodes = data.tasks.map(task => ({
                    id: task.id.toString(), // Convert task ID to string
                    type: 'task',
                    position: { x: generateRandomNumber(), y: generateRandomNumber() },
                    data: { ...task, label: task.name }, // Task data and name as label
                }));

                // Create edges based on agent/task relationships
                const taskEdges = data.tasks.map(task => { //Filter as needed
                    if (task.agent) {
                        return{
                            id: `edge-${task.id}-${task.agent.agent_id}`, // Unique edge ID
                            source: task.id.toString(),
                            target: task.agent.agent_id,
                            animated: true
                        }
                    }
                });
                console.log("taskEdges", taskEdges);

                // Set the nodes and edges state
                setNodes([...agentNodes, ...taskNodes]);
                setEdges(taskEdges);
            } catch (error) {
                toast.error("Error loading workflow");
                console.error("Error loading workflow", error);
            } finally {
                setIsLoading(false);
            }
        };

        loadWorkflowData();
    }, [workflowId, setNodes, setEdges]);

    const generateNodeId = useCallback((type) => {
        const timestamp = Date.now();
        const randomString = Math.random().toString(36).substring(2, 8);
        return `${type}-${timestamp}-${randomString}`;
    }, []);

    const handleAddAgent = useCallback(() => {
        const newNode = {
            id: generateNodeId("agent"),
            type: "agent",
            data: { label: "New Agent" },
            position: { x: generateRandomNumber(), y: generateRandomNumber() },
        };
        setNodes((nds) => [...nds, newNode]);
    }, [setNodes, generateNodeId]);

    const handleAddTask = useCallback(() => {
        const newNode = {
            id: generateNodeId("task"),
            type: "task",
            data: { label: "New Task" },
            position: { x: generateRandomNumber(), y: generateRandomNumber() },
        };
        setNodes((nds) => [...nds, newNode]);
    }, [setNodes, generateNodeId]);

    const handleEntityDialogOpen = useCallback((type) => {
        setEntityType(type);
        createEntity.handleOpen();
    }, [createEntity, setEntityType]);

    const handleCreateEntitySubmit = useCallback((formData) => {
        const position = { x: generateRandomNumber(), y: generateRandomNumber() };
        const nodeId = generateNodeId(entityType);
        let label = "";
        if (entityType === "agent") {
            label = formData.role;
        } else {
            label = formData.name;
        }
        const newNode = {
            id: nodeId,
            type: entityType,
            position: position,
            data: { ...formData, label: label },
        };

        setNodes(prevNodes => [...prevNodes, newNode]);
        // Create edge if it's a task and an agent is selected
        if (entityType === 'task' && formData.agent) {
            const newEdge = {
                id: `edge-${nodeId}-${formData.agent}`,
                source: nodeId,
                target: formData.agent,
                animated: true,
            };
            setEdges((prevEdges) => [...prevEdges, newEdge]);
        }
        createEntity.handleClose();

    }, [entityType, setNodes, generateNodeId, createEntity, setEdges]);

    const onConnect = useCallback((params) => {
        setEdges((eds) => addEdge(params, eds));
    }, [setEdges]);

    const handleSave = useCallback(async () => {
        try {
            setIsSaving(true);
            await workflowAPI.saveWorkflow(workflowId, {
                nodes,
                edges,
            });
            toast.success('Workflow saved successfully');
        } catch (error) {
            toast.error('Failed to save workflow');
            console.error('Error saving workflow:', error);
        } finally {
            setIsSaving(false);
        }
    }, [workflowId, nodes, edges, user]);

    return (
        <div style={{ display: 'flex' }}>
            <div style={{ width: '100%', height: '600px' }}>
                <ReactFlow
                    nodes={nodes}
                    edges={edges}
                    onNodesChange={onNodesChange}
                    onEdgesChange={onEdgesChange}
                    onConnect={onConnect}
                    fitView
                    nodeTypes={nodeTypes}
                >
                    <Controls />
                    <Background variant="dots" gap={12} size={1} />
                    <Panel position="top-left">
                        <div className="flex gap-2">
                            <button
                                onClick={() => handleEntityDialogOpen('agent')}
                                className="px-4 py-2 bg-blue-500 text-white rounded"
                            >
                                Add Agent
                            </button>
                            <button
                                onClick={() => handleEntityDialogOpen('task')}
                                className="px-4 py-2 bg-blue-500 text-white rounded"
                            >
                                Add Task
                            </button>
                        </div>
                    </Panel>
                    <Panel position="bottom-right">
                        <div className="flex gap-2">
                            <button
                                onClick={handleSave}
                                disabled={isSaving}
                                className="px-4 py-2 bg-blue-500 text-white rounded"
                            >
                                {isSaving ? 'Saving...' : 'Save'}
                            </button>
                        </div>
                    </Panel>
                </ReactFlow>
            </div>
            {/* Add CreateEntity Dialog here */}
            <CreateEntity
                open={createEntity.open}
                onClose={createEntity.handleClose}
                entityType={entityType}
                nodes={nodes}
                onSubmit={handleCreateEntitySubmit}
            />
        </div>
    );
}

export default Workflow;