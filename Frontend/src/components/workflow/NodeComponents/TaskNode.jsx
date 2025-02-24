// src/components/Workflow/NodeComponents/TaskNode.jsx
import React from 'react';
import { Handle, Position } from '@xyflow/react';

const TaskNode = ({ data }) => {
    return (
        <div style={{ border: '1px solid green', padding: '10px', backgroundColor: '#f0fff0', width: '200px' }}>
            <Handle
                type="source"
                position= {Position.Right}
                id="a"
                style={{ background: 'rgba(0, 255, 0, 0.5)' }}
            />
            <div>Task: {data.label}</div>
        </div>
    );
};

export default TaskNode;