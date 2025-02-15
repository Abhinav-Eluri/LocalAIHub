import React, { useState } from 'react';
import Dialog, { DialogActions, DialogContent, DialogTitle } from "../dialog.jsx";
import { Calendar, Clock, Users, CheckCircle, XCircle } from 'lucide-react';
import { badmintonAPI } from "../../services/api.js";

function SlotDialog({ open, onClose, onSuccess, data }) {
    const [loading, setLoading] = useState(false);
    const [name, setName] = useState('');
    const [alert, setAlert] = useState({ show: false, message: '', type: '' });

    const formatDateTime = (dateTime) => {
        if (!dateTime) return '';
        const date = new Date(dateTime);
        return date.toLocaleDateString();
    };

    const getTimeRange = (dateTime, durationHours) => {
        if (!dateTime || !durationHours) return { start: '', end: '' };
        const startDate = new Date(dateTime);
        const endDate = new Date(startDate.getTime() + durationHours * 3600000);

        return {
            start: startDate.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
            end: endDate.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
        };
    };

    const timeRange = getTimeRange(data?.game_date, data?.duration);

    const handleSubmit = async () => {
        try {
            setLoading(true);
            const response = await badmintonAPI.addParticipant({ name: name, slotId: data.id });
            setAlert({
                show: true,
                message: response.data.message,
                type: 'success'
            });
            setName("");
            setLoading(false);
            if (onSuccess) {
                onSuccess({ name, slotId: data?.id });
            }
            setTimeout(() => {
                setAlert({ show: false, message: '', type: '' });
                onClose();
            }, 2000);
        } catch (error) {
            setAlert({
                show: true,
                message: error.response?.data?.error || 'Error booking slot',
                type: 'error'
            });
            setTimeout(() => setAlert({ show: false, message: '', type: '' }), 3000);
            setLoading(false);
        }
    };

    return (
        <Dialog open={open} onClose={onClose} size="md">
            <DialogTitle className="text-center text-2xl font-semibold text-gray-900 p-6 border-b border-gray-200">
                Book Slot
            </DialogTitle>

            {alert.show && (
                <div className={`p-4 ${alert.type === 'success' ? 'bg-green-100' : 'bg-red-100'} flex items-center gap-2`}>
                    {alert.type === 'success' ? (
                        <CheckCircle className="h-5 w-5 text-green-500" />
                    ) : (
                        <XCircle className="h-5 w-5 text-red-500" />
                    )}
                    <span className={alert.type === 'success' ? 'text-green-700' : 'text-red-700'}>
                        {alert.message}
                    </span>
                </div>
            )}

            <DialogContent className="p-6 space-y-6">
                <div className="bg-gray-50 p-4 rounded-lg space-y-3">
                    <div className="flex items-center gap-2">
                        <Calendar className="h-5 w-5 text-gray-500" />
                        <span>{formatDateTime(data?.game_date)}</span>
                    </div>
                    <div className="flex items-center gap-2">
                        <Clock className="h-5 w-5 text-gray-500" />
                        <span>{timeRange.start} - {timeRange.end}</span>
                    </div>
                    <div className="flex items-center gap-2">
                        <Users className="h-5 w-5 text-gray-500" />
                        <span>Max participants: {data?.max_participants}</span>
                    </div>
                </div>

                <div className="space-y-2">
                    <label htmlFor="name" className="block text-sm font-medium text-gray-700">
                        Name
                    </label>
                    <input
                        id="name"
                        type="text"
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition duration-200 text-gray-900"
                        placeholder="Enter your name..."
                    />
                </div>
            </DialogContent>

            <DialogActions className="p-6 border-t border-gray-200 flex flex-col sm:flex-row gap-3 sm:justify-end">
                <button
                    onClick={onClose}
                    className="px-6 py-2 text-gray-700 bg-gray-100 rounded-lg hover:bg-gray-200 transition duration-200 font-medium"
                >
                    Cancel
                </button>
                <button
                    onClick={handleSubmit}
                    disabled={loading || !name}
                    className={`px-6 py-2 text-white rounded-lg transition duration-200 font-medium ${
                        loading || !name
                            ? "bg-blue-400 cursor-not-allowed"
                            : "bg-blue-600 hover:bg-blue-700"
                    }`}
                >
                    {loading ? "Booking..." : "Book Slot"}
                </button>
            </DialogActions>
        </Dialog>
    );
}

export default SlotDialog;