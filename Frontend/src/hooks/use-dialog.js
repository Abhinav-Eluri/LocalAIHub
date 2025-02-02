import { useCallback, useState } from "react";

export function useDialog() {
    const [state, setState] = useState({
        open: false,
        closing: false,
        data: undefined,
    });

    const handleOpen = useCallback((data) => {
        setState({ open: true, closing: false, data });
    }, []);

    const updateData = useCallback((data) => {
        setState((prev) => ({
            open: prev.open,
            closing: prev.closing,
            data,
        }));
    }, []);

    const handleClose = useCallback(() => {
        setState((prev) => ({
            open: false,
            closing: true,
            data: prev.data,
        }));

        setTimeout(() => {
            setState((prev) => ({
                open: prev.open,
                closing: prev.closing,
                data: prev.closing ? undefined : prev.data,
            }));
        }, 500); // Animation duration
    }, []);

    return {
        data: state.data,
        handleClose,
        handleOpen,
        open: state.open,
        updateData,
    };
}
