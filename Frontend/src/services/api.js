// src/services/api.js
import axios from 'axios';
import config from '../config';
import store from "../redux/store.js";


const axiosInstance = axios.create({
    baseURL: config.apiUrl,
    headers: {
        'Content-Type': 'application/json',
    },
});

// Request interceptor
axiosInstance.interceptors.request.use((config) => {
    const state = store.getState();
    const token = state.auth.accessToken;
    if (token) {
        config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
});

export const authAPI = {
    register: (userData) =>
        axiosInstance.post('/api/auth/register/', userData),

    login: (credentials) =>
        axiosInstance.post('/api/auth/login/', credentials),

    logout: (refreshToken) =>
        axiosInstance.post('/api/auth/logout/', refreshToken),

    forgotPassword: (email) =>
        axiosInstance.post('/api/auth/reset_password/', email),

    getProfile: () =>
        axiosInstance.get('/api/auth/profile/'),
};

export const chatAPI = {
    createChat: (chatData) =>
        axiosInstance.post('/api/chat/', chatData),
    getChats: (userId) =>
        axiosInstance.get('/api/chat/', userId),
    getChat: (chatId) =>
        axiosInstance.get(`/api/chat/${chatId}`),
    requestResponse: (chatData) =>
        axiosInstance.get(`/api/chat/request_response`, chatData),

}

export const BadmintonAPI = {
    createSlot: (slotData) => {
        return axiosInstance.post('/api/slot/', slotData);
    },
    getSlots: () =>
        axiosInstance.get('/api/slot/'),

    addParticipant: (participantData) =>
        axiosInstance.post('/api/slot/add_participant/', participantData),

}