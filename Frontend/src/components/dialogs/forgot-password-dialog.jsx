import React, { useState } from "react";
import Dialog, { DialogActions, DialogTitle, DialogContent } from "../dialog.jsx";
import { authAPI } from "../../services/api.js";

function ForgotPasswordDialog({ open, onClose }) {
    const [email, setEmail] = useState("");
    const [error, setError] = useState("");
    const [loading, setLoading] = useState(false);

    const handleSubmit = () => {
        setError("");

        if (!email.trim()) {
            setError("Email is required.");
            return;
        }

        if (!/\S+@\S+\.\S+/.test(email)) {
            setError("Please enter a valid email address.");
            return;
        }

        setLoading(true);

        authAPI.forgotPassword({ email }).then((response) => {
            setLoading(false);
            alert("Password reset link sent to " + email);
            onClose(); // Close the dialog after submission
        }).catch((error) => {
            setLoading(false);
            if (error.response && error.response.data.message) {
                setError(error.response.data.message); // Show backend error message
            } else {
                setError("An error occurred. Please try again.");
            }
        });
    };

    return (
        <Dialog open={open} onClose={onClose} size="sm">
            <DialogTitle className="text-center text-2xl font-semibold">Forgot Password</DialogTitle>
            <DialogContent>
                <p className="text-sm text-gray-600 mb-2">Enter your email address to reset your password.</p>

                <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="mt-3 w-full p-2 border-2 rounded-lg focus:ring-2 focus:ring-blue-400 focus:outline-none mb-4"
                    placeholder="Enter your email"
                />
                {error && <p className="mt-2 text-sm text-red-500">{error}</p>}
            </DialogContent>
            <DialogActions>
                <button
                    onClick={onClose}
                    className="px-6 py-3 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 transition duration-200 w-full sm:w-auto"
                >
                    Cancel
                </button>
                <button
                    onClick={handleSubmit}
                    disabled={loading}
                    className={`px-6 py-3 text-white rounded-lg transition duration-200 w-full sm:w-auto ${
                        loading ? "bg-blue-300 cursor-not-allowed" : "bg-blue-600 hover:bg-blue-700"
                    }`}
                >
                    {loading ? "Sending..." : "Submit"}
                </button>
            </DialogActions>
        </Dialog>
    );
}

export default ForgotPasswordDialog;
