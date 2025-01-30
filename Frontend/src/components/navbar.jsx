import React, { useState } from 'react';
import { Menu, X } from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';

const NavBar = () => {
    const [isOpen, setIsOpen] = useState(false);
    const navigate = useNavigate();

    const handleLogin = () => {
        navigate('/login');
    };

    const handleRegister = () => {
        navigate('/register');
    };

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
                        <button
                            onClick={handleLogin}
                            className="px-4 py-2 text-gray-600 hover:text-gray-900">
                            Login
                        </button>
                        <button
                            onClick={handleRegister}
                            className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700">
                            Register
                        </button>
                    </div>

                    {/* Mobile menu button */}
                    <div className="md:hidden flex items-center">
                        <button
                            onClick={() => setIsOpen(!isOpen)}
                            className="inline-flex items-center justify-center p-2 rounded-md text-gray-600 hover:text-gray-900 focus:outline-none"
                        >
                            {isOpen ? <X size={24} /> : <Menu size={24} />}
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
                            <div className="pt-4 space-y-2">
                                <button
                                    onClick={handleLogin}
                                    className="w-full px-4 py-2 text-left text-gray-600 hover:text-gray-900">
                                    Login
                                </button>
                                <button
                                    onClick={handleRegister}
                                    className="w-full px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700">
                                    Register
                                </button>
                            </div>
                        </div>
                    </div>
                )}
            </div>
        </nav>
    );
};

export default NavBar;