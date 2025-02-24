import React, { useCallback } from 'react';
import { ReactFlow, addEdge, Controls, Background } from '@xyflow/react';
import '@xyflow/react/dist/style.css';

const WorkflowCanvas = ({ nodes, edges, onNodesChange, onEdgesChange, nodeTypes }) => {
    const onConnect = useCallback((params) => {
        onEdgesChange((eds) => addEdge(params, eds));
    }, [onEdgesChange]);

    return (
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
            </ReactFlow>
        </div>
    );
};

export default WorkflowCanvas;