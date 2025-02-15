import { createSlice } from "@reduxjs/toolkit";

// Get user from localStorage (so user stays logged in on refresh)
const user = JSON.parse(localStorage.getItem("user"));
const accessToken = localStorage.getItem("accessToken");
const refreshToken = localStorage.getItem("refreshToken");

const initialState = {
    user: user || null,  // Load user from storage or default to null
    accessToken: accessToken || null,  // JWT Access Token
    refreshToken: accessToken || null,  // JWT Refresh Token
    isAuthenticated: !!user,  // Boolean to track login state
};

const authSlice = createSlice({
    name: "auth",
    initialState,
    reducers: {
        loginSuccess: (state, action) => {
            console.log(action.payload);
            state.user = action.payload.user;
            state.accessToken = action.payload.access_token;
            state.refreshToken = action.payload.refresh_token;
            state.isAuthenticated = true;
            localStorage.setItem("user", JSON.stringify(action.payload.user));
            localStorage.setItem("accessToken", action.payload.access_token);
            localStorage.setItem("refreshToken", action.payload.refresh_token);
        },
        logout: (state) => {
            state.user = null;
            state.accessToken = null;
            state.refreshToken = null;
            state.isAuthenticated = false;
            localStorage.removeItem("user");
            localStorage.removeItem("accessToken")
            localStorage.removeItem("refreshToken")// Remove user from storage
        },
        updateAccessToken: (state, action) => {
            localStorage.setItem("accessToken", action.payload);
            return { ...state, accessToken: action.payload };
        }
    },
});

export const { loginSuccess, logout, updateAccessToken } = authSlice.actions;
export default authSlice.reducer;
