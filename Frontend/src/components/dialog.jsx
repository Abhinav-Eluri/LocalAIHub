import React, { useEffect, useRef } from 'react';
import { X } from 'lucide-react';

// Size configurations
const SIZES = {
    xs: 'max-w-xs',
    sm: 'max-w-sm',
    md: 'max-w-md',
    lg: 'max-w-lg',
    xl: 'max-w-xl',
    '2xl': 'max-w-2xl',
    full: 'max-w-full mx-4'
};

// Base Dialog Component
const Dialog = ({
                    open,
                    onClose,
                    size = 'md',
                    fullScreen = false,
                    children
                }) => {
    const dialogRef = useRef(null);

    useEffect(() => {
        const handleEscape = (e) => {
            if (e.key === 'Escape') {
                onClose();
            }
        };

        if (open) {
            document.addEventListener('keydown', handleEscape);
            document.body.style.overflow = 'hidden';
        }

        return () => {
            document.removeEventListener('keydown', handleEscape);
            document.body.style.overflow = 'unset';
        };
    }, [open, onClose]);

    if (!open) return null;

    const handleBackdropClick = (e) => {
        if (e.target === dialogRef.current) {
            onClose();
        }
    };

    return (
        <div
            ref={dialogRef}
            onClick={handleBackdropClick}
            className={`
        fixed inset-0 z-50 
        bg-black/50 
        flex items-center justify-center
        p-4
      `}
        >
            <div
                className={`
          bg-white rounded-lg shadow-xl 
          ${fullScreen ? 'w-screen h-screen m-0' : SIZES[size]} 
          ${fullScreen ? '' : 'max-h-[90vh]'} 
          overflow-hidden
        `}
            >
                {children}
            </div>
        </div>
    );
};

// Dialog Title Component
const DialogTitle = ({ children, onClose, className = '' }) => (
    <div className={`px-6 py-4 border-b relative flex items-center justify-between ${className}`}>
        <h2 className="text-lg font-semibold text-gray-900">{children}</h2>
        {onClose && (
            <button
                onClick={onClose}
                className="w-8 h-8 flex items-center justify-center rounded-full hover:bg-gray-100 transition-colors"
            >
                <X className="w-5 h-5 text-gray-500" />
                <span className="sr-only">Close</span>
            </button>
        )}
    </div>
);

// Dialog Content Component
const DialogContent = ({ children, className = '' }) => (
    <div className={`px-6 py-4 overflow-auto ${className}`}>
        {children}
    </div>
);

// Dialog Actions Component
const DialogActions = ({ children, className = '' }) => (
    <div className={`px-6 py-4 border-t flex justify-end gap-3 ${className}`}>
        {children}
    </div>
);


export { Dialog, DialogTitle, DialogContent, DialogActions };
export default DialogExample;