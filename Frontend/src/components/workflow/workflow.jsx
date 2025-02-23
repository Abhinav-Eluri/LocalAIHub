import React, {useCallback, useEffect, useState} from 'react';
import {
    addEdge,
    Background,
    Controls,
    Panel,
    ReactFlow,
    useEdgesState,
    useNodesState,
    SelectionMode
} from "@xyflow/react";
import '@xyflow/react/dist/style.css'
import CreateEntity from "../dialogs/create-entity.jsx";
import {useDialog} from "../../hooks/use-dialog.js";
import {useSelector} from "react-redux";
import {workflowAPI} from "../../services/api.js";

// Node styling constants
const AGENT_NODE_STYLE = {
    background: '#4CAF50',
    color: 'white',
    border: '1px solid #45a049',
    borderRadius: '8px',
    padding: '10px',
    width: 200,
};

const TASK_NODE_STYLE = {
    background: '#2196F3',
    color: 'white',
    border: '1px solid #1e88e5',
    borderRadius: '8px',
    padding: '10px',
    width: 200,
};

function Workflow(props) {
    const {user} = useSelector(state => state.auth);
    const initialNodes = []
    const initialEdges = []
    const {workflowId} = props;
    const [nodes, setNodes, onNodesChange] = useNodesState(initialNodes);
    const [edges, setEdges, onEdgesChange] = useEdgesState(initialEdges);
    const [entityType, setEntityType] = useState(null);

    const createEntity = useDialog()

    const onConnect = useCallback(
        (connection) => setEdges((eds) => addEdge(connection, eds)),
        [setEdges],
    );

    const handleEntityDialogOpen = (type) => {
        setEntityType(type);
        createEntity.handleOpen();
    };

    // Function to generate a unique node ID
    const generateNodeId = (type) => {
        const timestamp = Date.now();
        return `${type}-${timestamp}`;
    };

    // Function to calculate new node position
    const calculateNewNodePosition = () => {
        // Get the current number of nodes to offset new nodes
        const offset = nodes.length * 50;
        return {
            x: 100 + offset,
            y: 100 + offset
        };
    };

    const createNewNode = (formData) => {
        const { x, y } = calculateNewNodePosition();
        const isAgent = entityType === 'agent';
        const nodeId = generateNodeId(entityType);

        const newNode = {
            id: nodeId,
            type: 'default', // You can create custom node types if needed
            position: { x, y },
            data: {
                label: isAgent ? formData.role : formData.name,
                ...formData,
                createdAt: new Date().toISOString(),
                createdBy: `${user?.first_name}`, // Using the current user's login
                type: entityType,
            },
            style: isAgent ? AGENT_NODE_STYLE : TASK_NODE_STYLE,
        };

        // Add metadata to help with node management
        newNode.data.metadata = {
            created: new Date().toISOString(),
            lastModified: new Date().toISOString(),
            version: 1,
        };

        setNodes((prevNodes) => [...prevNodes, newNode]);
        return nodeId;
    };

    const handleEntityCreate = (formData) => {
        const nodeId = createNewNode(formData);

        // If this is a task and it has selected agents, create edges
        if (entityType === 'task' && formData.selectedAgents) {
            const newEdges = formData.selectedAgents.map(agentId => ({
                id: `edge-${agentId}-${nodeId}`,
                source: agentId,
                target: nodeId,
                type: 'default',
                animated: true,
                style: { stroke: '#888' },
            }));

            setEdges((prevEdges) => [...prevEdges, ...newEdges]);
        }

        createEntity.handleClose();
    };
    console.log("nodes", nodes)
    console.log("Edges", edges)

    function handleSave() {
        workflowAPI.saveWorkflow(workflowId, {nodes:nodes,edges:edges})
    }



    return (
        <>
            <ReactFlow
                nodes={nodes}
                edges={edges}
                onEdgesChange={onEdgesChange}
                onNodesChange={onNodesChange}
                onConnect={onConnect}
                panOnScroll
                selectionOnDrag
                selectionMode={SelectionMode.Partial}
                fitView
            >
                <Panel position="top-left">
                    <button
                        className="bg-black text-white px-3 py-1 rounded-full ml-5 mr-1"
                        onClick={() => handleEntityDialogOpen('agent')}
                    >+ Agent
                    </button>
                    <button
                        className="bg-black text-white px-3 py-1 rounded-full"
                        onClick={() => handleEntityDialogOpen('task')}
                    >+ Task
                    </button>
                </Panel>
                <Panel position="top-right">
                    <button onClick={handleSave} className="mr-3 rounded-full bg-green-400 px-3 py-1"> Save</button>
                    <button className="bg-violet-400 text-white px-3 mr-10 py-1 rounded-full">Execute</button>
                </Panel>
                <Background/>
                <Controls position="top-right"/>
            </ReactFlow>
            <CreateEntity
                open={createEntity.open}
                onClose={createEntity.handleClose}
                entityType={entityType}
                nodes={nodes}
                onSubmit={handleEntityCreate}
            />
        </>
    );
}

export default Workflow;