import React, { useEffect, useState } from 'react';
import { Users, Calendar, Clock } from 'lucide-react';
import { useDialog } from "../../hooks/use-dialog.js";
import SlotDialog from "./slot-dialog.jsx";
import { badmintonAPI } from "../../services/api.js";

const SlotCard = ({ slot, onClick }) => {
    const formatDateTime = (dateTime) => {
        const date = new Date(dateTime);
        return date.toLocaleDateString();
    };

    const getTimeRange = (dateTime, durationHours) => {
        const startDate = new Date(dateTime);
        const endDate = new Date(startDate.getTime() + durationHours * 3600000);

        return {
            start: startDate.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
            end: endDate.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
        };
    };

    const timeRange = getTimeRange(slot.game_date, slot.duration);

    return (
        <div
            className="bg-white rounded-lg shadow-md p-4 cursor-pointer hover:shadow-lg transition-all hover:scale-105"
            onClick={() => onClick(slot)}
        >
            <h3 className="text-lg font-semibold mb-4">Available Slot</h3>
            <div className="space-y-4">
                <div className="flex items-center gap-2">
                    <Calendar className="h-5 w-5 text-gray-500" />
                    <span>{formatDateTime(slot.game_date)}</span>
                </div>
                <div className="flex items-center gap-2">
                    <Clock className="h-5 w-5 text-gray-500" />
                    <span>{timeRange.start} - {timeRange.end}</span>
                </div>
                <div className="flex items-center gap-2">
                    <Users className="h-5 w-5 text-gray-500" />
                    <span>Max participants: {slot.max_participants}</span>
                </div>
            </div>
        </div>
    );
};

const AvailableSlots = () => {
    const dialog = useDialog();
    const [selectedSlot, setSelectedSlot] = useState(null);
    const [slots, setSlots] = useState([]);

    useEffect(() => {
        const fetchSlots = async () => {
            try {
                const response = await badmintonAPI.getSlots();
                setSlots(response.data);
            } catch (error) {
                console.error('Error fetching slots:', error);
            }
        };
        fetchSlots();
    }, []);

    const handleSlotClick = (slot) => {
        setSelectedSlot(slot);
        dialog.handleOpen();
    };

    return (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 p-4">
            {slots.map((slot) => (
                <SlotCard
                    key={slot.id || Math.random()}
                    slot={slot}
                    onClick={handleSlotClick}
                />
            ))}
            <SlotDialog
                open={dialog.open}
                onClose={dialog.handleClose}
                data={selectedSlot}
            />
        </div>
    );
};

export default AvailableSlots;