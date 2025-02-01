import { createSlice } from "@reduxjs/toolkit";

// Get user from localStorage (so user stays logged in on refresh)
const user = JSON.parse(localStorage.getItem("user"));

const initialState = {
    user: user || null,  // Load user from storage or default to null
    accessToken: user?.access || null,  // JWT Access Token
    refreshToken: user?.refresh || null,  // JWT Refresh Token
    isAuthenticated: !!user,  // Boolean to track login state
};

const authSlice = createSlice({
    name: "auth",
    initialState,
    reducers: {
        loginSuccess: (state, action) => {
            console.log("Login success", action.payload.user);
            state.user = action.payload.user;
            state.accessToken = action.payload.access_token;
            state.refreshToken = action.payload.refresh_token;
            state.isAuthenticated = true;
            localStorage.setItem("user", JSON.stringify(action.payload.user)); // Persist user
        },
        logout: (state) => {
            state.user = null;
            state.accessToken = null;
            state.refreshToken = null;
            state.isAuthenticated = false;
            localStorage.removeItem("user"); // Remove user from storage
        },
    },
});

export const { loginSuccess, logout } = authSlice.actions;
export default authSlice.reducer;
