// src/services/api.js
import axios from 'axios';
import config from '../config';

const axiosInstance = axios.create({
    baseURL: config.apiUrl,
    headers: {
        'Content-Type': 'application/json',
    },
});

// Request interceptor
axiosInstance.interceptors.request.use(
    (config) => {
        const token = localStorage.getItem('accessToken');
        if (token) {
            config.headers.Authorization = `Bearer ${token}`;
        }
        return config;
    },
    (error) => {
        return Promise.reject(error);
    }
);

export const authAPI = {
    register: (userData) =>
        axiosInstance.post('/api/auth/register/', userData),

    login: (credentials) =>
        axiosInstance.post('/api/auth/login/', credentials),

    getProfile: () =>
        axiosInstance.get('/api/auth/profile/'),
};