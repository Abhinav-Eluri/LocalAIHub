import axios from 'axios';
import config from '../config';
import store from "../redux/store.js";
import { logout, updateAccessToken } from "../redux/slices/authSlice.js";

class AuthError extends Error {
    constructor(message) {
        super(message);
        this.name = 'AuthError';
    }
}

const clearAuthState = () => {
    store.dispatch(logout());
    localStorage.clear();
    window.location.replace('/login');
};

const blacklistToken = async (refreshToken) => {
    if (!refreshToken) return;

    try {
        const response = await axios.post(
            `${config.apiUrl}/api/auth/logout/`,
            { refresh: refreshToken },
            { validateStatus: status => status < 500 }
        );
        return response.status === 200;
    } catch (error) {
        console.error('Failed to blacklist token:', error);
        return false;
    }
};

const handleLogout = async (refreshToken) => {
    try {
        await blacklistToken(refreshToken);
    } finally {
        clearAuthState();
    }
};

const axiosInstance = axios.create({
    baseURL: config.apiUrl,
    headers: {
        'Content-Type': 'application/json',
    },
    timeout: 10000,
});

axiosInstance.interceptors.request.use(
    (config) => {
        const state = store.getState();
        const token = state.auth.accessToken;

        if (token) {
            config.headers.Authorization = `Bearer ${token}`;
        }
        return config;
    },
    (error) => Promise.reject(error)
);

axiosInstance.interceptors.response.use(
    (response) => response,
    async (error) => {
        const originalRequest = error.config;

        if (error.response?.status === 401 && !originalRequest._retry) {
            originalRequest._retry = true;

            try {
                const state = store.getState();
                const refreshToken = state.auth.refreshToken;

                if (!refreshToken) {
                    throw new AuthError("No refresh token available");
                }

                const tokenResponse = await axios.post(
                    `${config.apiUrl}/api/token/refresh/`,
                    { refresh: refreshToken }
                );

                if (!tokenResponse.data.access) {
                    throw new AuthError("Invalid token refresh response");
                }

                const newAccessToken = tokenResponse.data.access;
                store.dispatch(updateAccessToken(newAccessToken));

                originalRequest.headers.Authorization = `Bearer ${newAccessToken}`;
                return axiosInstance(originalRequest);

            } catch (err) {
                if (err.response?.status === 401 || err instanceof AuthError) {
                    const state = store.getState();
                    await handleLogout(state.auth.refreshToken);
                    throw new AuthError("Session expired. Please login again.");
                }

                clearAuthState();
                throw new Error("Authentication failed. Please try again.");
            }
        }

        if (error.response?.status === 401) {
            const state = store.getState();
            await handleLogout(state.auth.refreshToken);
            throw new AuthError("Authentication failed. Please login again.");
        }

        return Promise.reject(error);
    }
);

export const authAPI = {
    register: (userData) =>
        axiosInstance.post('/api/auth/register/', userData),

    login: (credentials) =>
        axiosInstance.post('/api/auth/login/', credentials),

    logout: () => {
        const state = store.getState();
        return handleLogout(state.auth.refreshToken);
    },

    forgotPassword: (email) =>
        axiosInstance.post('/api/auth/reset_password/', { email }),

    getProfile: () =>
        axiosInstance.get('/api/auth/profile/'),
};

export const chatAPI = {
    createChat: (chatData) =>
        axiosInstance.post('/api/chat/', chatData),

    getChats: (userId) =>
        axiosInstance.get('/api/chat/', { params: { userId } }),

    getChat: (chatId) =>
        axiosInstance.get(`/api/chat/${chatId}`),

    deleteChat: (chatId) =>
        axiosInstance.delete(`/api/chat/${chatId}`),


};

export const badmintonAPI = {
    createSlot: (slotData) =>
        axiosInstance.post('/api/slot/', slotData),

    getSlots: () =>
        axiosInstance.get('/api/slot/'),

    addParticipant: (participantData) =>
        axiosInstance.post('/api/slot/add_participant/', participantData),
};