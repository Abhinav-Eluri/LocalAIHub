// src/styles/nodeStyles.js

export const AGENT_NODE_STYLE = {
    background: '#4CAF50', // Green background
    color: 'white',
    border: '1px solid #45a049',
    borderRadius: '8px',
    padding: '10px',
    width: 200,
    fontSize: '12px',
    boxShadow: '0 2px 4px rgba(0,0,0,0.1)',
    cursor: 'pointer',
    transition: 'all 0.2s ease',

    // Hover state can be handled in CSS
    ':hover': {
        boxShadow: '0 4px 8px rgba(0,0,0,0.2)',
        transform: 'translateY(-1px)',
    },

    // Selected state styling
    '&.selected': {
        borderColor: '#2196F3',
        boxShadow: '0 0 0 2px #2196F3',
    }
};

export const TASK_NODE_STYLE = {
    background: '#2196F3', // Blue background
    color: 'white',
    border: '1px solid #1e88e5',
    borderRadius: '8px',
    padding: '10px',
    width: 200,
    fontSize: '12px',
    boxShadow: '0 2px 4px rgba(0,0,0,0.1)',
    cursor: 'pointer',
    transition: 'all 0.2s ease',

    // Hover state can be handled in CSS
    ':hover': {
        boxShadow: '0 4px 8px rgba(0,0,0,0.2)',
        transform: 'translateY(-1px)',
    },

    // Selected state styling
    '&.selected': {
        borderColor: '#FF4081',
        boxShadow: '0 0 0 2px #FF4081',
    }
};

// Additional style variations for different states
export const NODE_STYLES = {
    // Status-based styles for agents
    agent: {
        active: {
            ...AGENT_NODE_STYLE,
            background: '#43A047', // Darker green for active
        },
        inactive: {
            ...AGENT_NODE_STYLE,
            background: '#7CB342', // Lighter green for inactive
            opacity: 0.8,
        },
        error: {
            ...AGENT_NODE_STYLE,
            background: '#E57373', // Red for error state
        }
    },

    // Priority-based styles for tasks
    task: {
        high: {
            ...TASK_NODE_STYLE,
            background: '#F44336', // Red for high priority
        },
        medium: {
            ...TASK_NODE_STYLE,
            background: '#FB8C00', // Orange for medium priority
        },
        low: {
            ...TASK_NODE_STYLE,
            background: '#2196F3', // Default blue for low priority
        },
        completed: {
            ...TASK_NODE_STYLE,
            background: '#66BB6A', // Green for completed
            opacity: 0.8,
        }
    },

    // Common style modifiers
    modifiers: {
        disabled: {
            opacity: 0.6,
            cursor: 'not-allowed',
        },
        highlighted: {
            boxShadow: '0 0 0 2px #FFC107',
        },
        selected: {
            boxShadow: '0 0 0 2px #2196F3',
        }
    }
};

// Handle styles for node connections
export const HANDLE_STYLES = {
    source: {
        width: 10,
        height: 10,
        background: '#555',
        border: '2px solid white',
        borderRadius: '50%',
    },
    target: {
        width: 10,
        height: 10,
        background: '#555',
        border: '2px solid white',
        borderRadius: '50%',
    }
};

// Edge styles for connections
export const EDGE_STYLES = {
    default: {
        stroke: '#888',
        strokeWidth: 2,
        animated: true,
    },
    selected: {
        stroke: '#2196F3',
        strokeWidth: 3,
    },
    highlighted: {
        stroke: '#FFC107',
        strokeWidth: 3,
    }
};