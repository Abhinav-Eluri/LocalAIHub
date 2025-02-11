import React, { useState } from 'react';
import { BadmintonAPI } from "../../services/api.js";

const CreateSlotForm = () => {
    const [formData, setFormData] = useState({
        gameDate: '',
        duration: '',
        maxParticipants: ''
    });
    const [message, setMessage] = useState('');
    const [showAlert, setShowAlert] = useState(false);

    const handleSubmit = async (e) => {
        e.preventDefault();
        const slotData = {
            game_date: new Date(formData.gameDate),
            duration: parseInt(formData.duration),
            max_participants: parseInt(formData.maxParticipants)
        };
        try {
            const response = await BadmintonAPI.createSlot({slot_data: slotData});
            setFormData({
                gameDate: '',
                duration: '',
                maxParticipants: ''
            });
            setMessage(response.data.message);
            setShowAlert(true);
            setTimeout(() => setShowAlert(false), 3000);
        } catch (error) {
            setMessage(error.response?.data?.error || 'Error creating slot');
            setShowAlert(true);
            setTimeout(() => setShowAlert(false), 3000);
        }
    };

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: value
        }));
    };

    return (
        <div className="max-w-lg mx-auto p-6">
            {showAlert && (
                <div className={`p-4 mb-4 rounded ${message.includes('Error') ? 'bg-red-100 text-red-700' : 'bg-green-100 text-green-700'}`}>
                    {message}
                </div>
            )}
            <h2 className="text-xl font-bold mb-4">Create New Slot</h2>
            <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                    <label className="block text-sm font-medium mb-1">Date and Time</label>
                    <input
                        type="datetime-local"
                        name="gameDate"
                        value={formData.gameDate}
                        onChange={handleChange}
                        className="w-full p-2 border rounded"
                        required
                    />
                </div>

                <div>
                    <label className="block text-sm font-medium mb-1">Duration (minutes)</label>
                    <input
                        type="number"
                        name="duration"
                        value={formData.duration}
                        onChange={handleChange}
                        min="1"
                        className="w-full p-2 border rounded"
                        required
                    />
                </div>

                <div>
                    <label className="block text-sm font-medium mb-1">Max Participants</label>
                    <input
                        type="number"
                        name="maxParticipants"
                        value={formData.maxParticipants}
                        onChange={handleChange}
                        min="1"
                        className="w-full p-2 border rounded"
                        required
                    />
                </div>

                <button
                    type="submit"
                    className="w-full bg-blue-500 text-white p-2 rounded hover:bg-blue-600"
                >
                    Create Slot
                </button>
            </form>
        </div>
    );
};

export default CreateSlotForm;