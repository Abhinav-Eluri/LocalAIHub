import React, { useState, useEffect } from 'react';
import { Menu, X, Sun, Moon } from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from "react-redux";
import { logout } from "../redux/slices/authSlice.js";
import {authAPI} from "../services/api.js";

const NavBar = () => {
    const [isOpen, setIsOpen] = useState(false);
    const [isDarkMode, setIsDarkMode] = useState(() => {
        // Initialize dark mode state from localStorage
        const savedTheme = localStorage.getItem('theme');
        return savedTheme === 'dark';
    });
    const navigate = useNavigate();
    const { user, isAuthenticated, refreshToken } = useSelector(state => state.auth);
    const dispatch = useDispatch();

    // Theme toggle effect
    useEffect(() => {
        if (isDarkMode) {
            document.documentElement.classList.add('dark');
            localStorage.setItem('theme', 'dark');
        } else {
            document.documentElement.classList.remove('dark');
            localStorage.setItem('theme', 'light');
        }
    }, [isDarkMode]);

    const handleLogin = () => {
        navigate('/login');
    };

    const handleRegister = () => {
        navigate('/register');
    };

    const handleLogout = async() => {
        if (!refreshToken) {
            console.error('No refresh token found');
            return;
        }

        await authAPI.logout({ refresh_token: refreshToken })
        dispatch(logout());
        navigate("/login");
    };

    const toggleTheme = () => {
        setIsDarkMode(!isDarkMode);
    };

    // Helper function to safely display user name
    const displayName = user?.first_name ? `Welcome, ${user.first_name}` : "Welcome";

    return (
        <nav className="bg-gray-900 dark:bg-white shadow-lg">
            <div className="max-w-7xl mx-auto">
                <div className="flex justify-between h-16">
                    {/* Left side - Logo */}
                    <div className="flex items-center">
                        <Link to="/" className="text-xl font-bold text-white dark:text-gray-800">
                            LOGO
                        </Link>
                    </div>

                    {/* Center - Navigation Links (Hidden on mobile) */}
                    <div className="hidden md:flex items-center space-x-8">
                        <Link to="/" className="text-gray-300 hover:text-white dark:text-gray-600 dark:hover:text-gray-900">Home</Link>
                        <Link to="/chat" className="text-gray-300 hover:text-white dark:text-gray-600 dark:hover:text-gray-900">Chat</Link>
                    </div>

                    {/* Right side - Auth Buttons and Theme Toggle (Hidden on mobile) */}
                    <div className="hidden md:flex items-center space-x-4">
                        {/* Theme Toggle Button */}
                        <button
                            onClick={toggleTheme}
                            className="p-2 rounded-full hover:bg-gray-800 dark:hover:bg-gray-100 transition-colors"
                            aria-label="Toggle theme"
                        >
                            {isDarkMode ? <Sun className="text-gray-600" size={20}/> : <Sun className="text-gray-300" size={20}/>}
                        </button>

                        {isAuthenticated ? (
                            <>
                                <span className="text-gray-300 dark:text-gray-700">{displayName}</span>
                                <button
                                    onClick={handleLogout}
                                    className="px-4 py-2 text-gray-300 hover:text-white dark:text-gray-600 dark:hover:text-gray-900 cursor-pointer">
                                    Logout
                                </button>
                            </>
                        ) : (
                            <>
                                <button
                                    onClick={handleLogin}
                                    className="px-4 py-2 text-gray-300 hover:text-white dark:text-gray-600 dark:hover:text-gray-900 cursor-pointer">
                                    Login
                                </button>
                                <button
                                    onClick={handleRegister}
                                    className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 dark:bg-blue-500 dark:text-white dark:hover:bg-blue-600 cursor-pointer">
                                    Register
                                </button>
                            </>
                        )}
                    </div>

                    {/* Mobile menu button */}
                    <div className="md:hidden flex items-center">
                        <button
                            onClick={() => setIsOpen(!isOpen)}
                            className="inline-flex items-center justify-center p-2 rounded-md text-gray-300 hover:text-white dark:text-gray-600 dark:hover:text-gray-900 focus:outline-none cursor-pointer"
                        >
                            {isOpen ? <X size={24}/> : <Menu size={24}/>}
                        </button>
                    </div>
                </div>

                {/* Mobile menu */}
                {isOpen && (
                    <div className="md:hidden bg-gray-900 dark:bg-white">
                        <div className="px-2 pt-2 pb-3 space-y-1">
                            <Link to="/" className="block px-3 py-2 text-gray-300 hover:text-white dark:text-gray-600 dark:hover:text-gray-900">Home</Link>
                            <Link to="/products" className="block px-3 py-2 text-gray-300 hover:text-white dark:text-gray-600 dark:hover:text-gray-900">Products</Link>
                            <Link to="/about" className="block px-3 py-2 text-gray-300 hover:text-white dark:text-gray-600 dark:hover:text-gray-900">About</Link>
                            <Link to="/contact" className="block px-3 py-2 text-gray-300 hover:text-white dark:text-gray-600 dark:hover:text-gray-900">Contact</Link>

                            {/* Theme Toggle in Mobile Menu */}
                            <div className="block px-3 py-2">
                                <button
                                    onClick={toggleTheme}
                                    className="flex items-center space-x-2 text-gray-300 hover:text-white dark:text-gray-600 dark:hover:text-gray-900"
                                >
                                    {isDarkMode ? <Sun size={20}/> : <Moon size={20}/>}
                                    <span>{isDarkMode ? 'Light Mode' : 'Dark Mode'}</span>
                                </button>
                            </div>

                            {isAuthenticated ? (
                                <div className="pt-4 space-y-2">
                                    <span className="block px-3 py-2 text-gray-300 dark:text-gray-700">{displayName}</span>
                                    <button
                                        onClick={handleLogout}
                                        className="w-full px-4 py-2 text-left text-gray-300 hover:text-white dark:text-gray-600 dark:hover:text-gray-900 cursor-pointer">
                                        Logout
                                    </button>
                                </div>
                            ) : (
                                <div className="pt-4 space-y-2">
                                    <button
                                        onClick={handleLogin}
                                        className="w-full px-4 py-2 text-left text-gray-300 hover:text-white dark:text-gray-600 dark:hover:text-gray-900 cursor-pointer">
                                        Login
                                    </button>
                                    <button
                                        onClick={handleRegister}
                                        className="w-full px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 dark:bg-blue-500 dark:text-white dark:hover:bg-blue-600 cursor-pointer">
                                        Register
                                    </button>
                                </div>
                            )}
                        </div>
                    </div>
                )}
            </div>
        </nav>
    );
};

export default NavBar;