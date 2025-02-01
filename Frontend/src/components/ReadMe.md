// Example Usage Component

//code
const DialogExample = () => {
const [open, setOpen] = React.useState(false);
const [size, setSize] = React.useState('md');
const [fullScreen, setFullScreen] = React.useState(false);

    const handleClose = () => {
        setOpen(false);
        setFullScreen(false);
    };

    return (
        <div className="p-4 space-y-4">
            <div className="flex flex-wrap gap-4">
                {Object.keys(SIZES).map((sizeKey) => (
                    <button
                        key={sizeKey}
                        onClick={() => { setSize(sizeKey); setOpen(true); }}
                        className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
                    >
                        {sizeKey.toUpperCase()}
                    </button>
                ))}
                <button
                    onClick={() => { setFullScreen(true); setOpen(true); }}
                    className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
                >
                    Full Screen
                </button>
            </div>

            <Dialog
                open={open}
                onClose={handleClose}
                size={size}
                fullScreen={fullScreen}
            >
                <DialogTitle onClose={handleClose}>
                    {fullScreen ? 'Full Screen Dialog' : `${size.toUpperCase()} Size Dialog`}
                </DialogTitle>

                <DialogContent>
                    <p className="mb-4">This is a custom dialog without any UI library dependencies.</p>
                    <div className="space-y-2">
                        <p className="font-medium">Features included:</p>
                        <ul className="list-disc pl-5 space-y-1">
                            <li>Multiple size variants</li>
                            <li>Full screen mode</li>
                            <li>Click outside to close</li>
                            <li>ESC key to close</li>
                            <li>Focus trap (TODO)</li>
                            <li>Fixed positioning</li>
                            <li>Smooth transitions</li>
                        </ul>
                    </div>
                </DialogContent>

                <DialogActions>
                    <button
                        onClick={handleClose}
                        className="px-4 py-2 text-gray-700 border rounded hover:bg-gray-50"
                    >
                        Cancel
                    </button>
                    <button
                        onClick={handleClose}
                        className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
                    >
                        Confirm
                    </button>
                </DialogActions>
            </Dialog>
        </div>
    );
};
