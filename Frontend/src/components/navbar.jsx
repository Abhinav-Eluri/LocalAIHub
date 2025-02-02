import React, { useState } from 'react';
import { Menu, X } from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from "react-redux";
import { logout } from "../redux/slices/authSlice.js";
import {authAPI} from "../services/api.js";

const NavBar = () => {
    const [isOpen, setIsOpen] = useState(false);
    const navigate = useNavigate();
    const { user, isAuthenticated, refreshToken } = useSelector(state => state.auth);
    const dispatch = useDispatch();

    const handleLogin = () => {
        navigate('/login');
    };

    const handleRegister = () => {
        navigate('/register');
    };

    const handleLogout = () => {
        authAPI.logout(refreshToken);
        dispatch(logout());
        navigate("/login");
    };

    // Helper function to safely display user name
    const displayName = user?.first_name ? `Welcome, ${user.first_name}` : "Welcome";

    return (
        <nav className="bg-white shadow-lg">
            <div className="max-w-7xl mx-auto">
                <div className="flex justify-between h-16">
                    {/* Left side - Logo */}
                    <div className="flex items-center">
                        <Link to="/" className="text-xl font-bold text-gray-800">
                            LOGO
                        </Link>
                    </div>

                    {/* Center - Navigation Links (Hidden on mobile) */}
                    <div className="hidden md:flex items-center space-x-8">
                        <Link to="/" className="text-gray-600 hover:text-gray-900">Home</Link>
                        <Link to="/products" className="text-gray-600 hover:text-gray-900">Products</Link>
                        <Link to="/about" className="text-gray-600 hover:text-gray-900">About</Link>
                        <Link to="/contact" className="text-gray-600 hover:text-gray-900">Contact</Link>
                    </div>

                    {/* Right side - Auth Buttons (Hidden on mobile) */}
                    <div className="hidden md:flex items-center space-x-4">
                        {isAuthenticated ? (
                            <>
                                <span className="text-gray-700">{displayName}</span>
                                <button
                                    onClick={handleLogout}
                                    className="px-4 py-2 text-gray-600 hover:text-gray-900 cursor-pointer">
                                    Logout
                                </button>
                            </>
                        ) : (
                            <>
                                <button
                                    onClick={handleLogin}
                                    className="px-4 py-2 text-gray-600 hover:text-gray-900 cursor-pointer">
                                    Login
                                </button>
                                <button
                                    onClick={handleRegister}
                                    className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 cursor-pointer">
                                    Register
                                </button>
                            </>
                        )}
                    </div>

                    {/* Mobile menu button */}
                    <div className="md:hidden flex items-center">
                        <button
                            onClick={() => setIsOpen(!isOpen)}
                            className="inline-flex items-center justify-center p-2 rounded-md text-gray-600 hover:text-gray-900 focus:outline-none cursor-pointer"
                        >
                            {isOpen ? <X size={24}/> : <Menu size={24}/>}
                        </button>
                    </div>
                </div>

                {/* Mobile menu */}
                {isOpen && (
                    <div className="md:hidden">
                        <div className="px-2 pt-2 pb-3 space-y-1">
                            <Link to="/" className="block px-3 py-2 text-gray-600 hover:text-gray-900">Home</Link>
                            <Link to="/products" className="block px-3 py-2 text-gray-600 hover:text-gray-900">Products</Link>
                            <Link to="/about" className="block px-3 py-2 text-gray-600 hover:text-gray-900">About</Link>
                            <Link to="/contact" className="block px-3 py-2 text-gray-600 hover:text-gray-900">Contact</Link>
                            {isAuthenticated ? (
                                <div className="pt-4 space-y-2">
                                    <span className="block px-3 py-2 text-gray-700">{displayName}</span>
                                    <button
                                        onClick={handleLogout}
                                        className="w-full px-4 py-2 text-left text-gray-600 hover:text-gray-900 cursor-pointer">
                                        Logout
                                    </button>
                                </div>
                            ) : (
                                <div className="pt-4 space-y-2">
                                    <button
                                        onClick={handleLogin}
                                        className="w-full px-4 py-2 text-left text-gray-600 hover:text-gray-900 cursor-pointer">
                                        Login
                                    </button>
                                    <button
                                        onClick={handleRegister}
                                        className="w-full px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 cursor-pointer">
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