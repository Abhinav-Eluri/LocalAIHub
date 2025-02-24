// src/components/Workflow/NodeComponents/AgentNode.jsx
import React from 'react';
import { Handle, Position } from '@xyflow/react';

const AgentNode = ({ data }) => {
    return (
        <div style={{ border: '1px solid blue', padding: '10px', backgroundColor: '#f0f0ff', width: '200px' }}>
            <Handle
                type="target"
                position={Position.Left}
                id="b"
                style={{ background: 'rgba(0, 0, 255, 0.5)' }}
            />
            Agent: {data.label}
        </div>
    );
};

export default AgentNode;