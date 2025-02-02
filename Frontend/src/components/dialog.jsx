import React from "react";

export default function Dialog({ open, onClose, children, size = "md" }) {
    if (!open) return null;

    // Define width and height classes based on the `size` prop
    const sizeClasses = {
        sm: "w-1/3 h-1/3",   // Small - 33% width and height
        md: "w-1/2 h-1/2",   // Medium (Default) - 50% width and height
        lg: "w-3/4 h-3/4",   // Large - 75% width and height
        xl: "w-5/6 h-5/6",   // Extra Large - 83% width and height
        full: "w-full h-full", // Full screen - 100% width and height
    };

    return (
        <div
            className="fixed inset-0 flex items-center justify-center z-50 transition-opacity duration-500 backdrop-blur-md bg-opacity-40"
            onClick={onClose} // Close when clicking outside
        >
            {/* Dialog Box (Stops Click Propagation) */}
            <div
                className={`bg-white p-6 rounded-lg shadow-lg z-50 transition-all duration-500 ${sizeClasses[size]} flex flex-col`}
                onClick={(e) => e.stopPropagation()} // Prevent closing when clicking inside
            >
                {children}
            </div>
        </div>
    );
}

// Sub-components
export function DialogTitle({ children }) {
    return <h2 className="text-lg font-semibold pb-2">{children}</h2>;
}

export function DialogContent({ children }) {
    return <div className="m-4 flex-1 overflow-y-auto">{children}</div>; // Flex-1 and scrollable content
}

export function DialogActions({ children }) {
    return <div className="mt-4 flex justify-end space-x-2 pt-2">{children}</div>;
}
