import React, {useState} from 'react';
import {Link, useNavigate} from 'react-router-dom';
import {Mail, Lock, Eye, EyeOff} from 'lucide-react';
import {authAPI} from '../../services/api';
import {useSelector, useDispatch} from 'react-redux'
import {loginSuccess} from "../../redux/slices/authSlice.js";
import {useDialog} from "../../hooks/use-dialog.js";
import Dialog from "../../components/dialog.jsx";
import ForgotPasswordDialog from "../../components/dialogs/forgot-password-dialog.jsx";

const Login = () => {
    const navigate = useNavigate();
    const {user} = useSelector(state => state.auth);
    const [formData, setFormData] = useState({
        email: '',
        password: '',
    });
    const [showPassword, setShowPassword] = useState(false);
    const [errors, setErrors] = useState({});
    const [isLoading, setIsLoading] = useState(false);
    const dispatch = useDispatch();
    const forgotPasswordDialog = useDialog()

    const handleChange = (e) => {
        const {name, value} = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: value
        }));
        // Clear error when user starts typing
        if (errors[name]) {
            setErrors(prev => ({
                ...prev,
                [name]: ''
            }));
        }
    };

    const validateForm = () => {
        const newErrors = {};

        if (!formData.email) {
            newErrors.email = 'Email is required';
        } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
            newErrors.email = 'Email is invalid';
        }

        if (!formData.password) {
            newErrors.password = 'Password is required';
        }

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleSubmit = (e) => {
        e.preventDefault();

        if (validateForm()) {
            setIsLoading(true);

            const loginData = {
                username: formData.email, // Adjust if backend expects "email"
                password: formData.password,
            };

            authAPI.login(loginData)
                .then((response) => {
                    const data = response.data; // Extract data from response
                    console.log("response.data", data);

                    dispatch(loginSuccess(data));

                    // Redirect to dashboard
                    navigate('/home');

                })
                .catch((error) => {
                    console.error("Error logging in", error);
                    setErrors({
                        submit: error.response?.data?.detail || 'Login failed. Please try again.'
                    });
                })
                .finally(() => {
                    setIsLoading(false);
                });
        }
    };


    return (
        <div className="min-h-screen bg-gray-50 flex flex-col justify-center py-12 sm:px-6 lg:px-8">
            <div className="sm:mx-auto sm:w-full sm:max-w-md">
                <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900">
                    Sign in to your account
                </h2>
            </div>

            <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
                <div className="bg-white py-8 px-4 shadow sm:rounded-lg sm:px-10">
                    <form className="space-y-6" onSubmit={handleSubmit}>
                        {/* Display general error if any */}
                        {errors.submit && (
                            <div className="rounded-md bg-red-50 p-4">
                                <p className="text-sm text-red-700">{errors.submit}</p>
                            </div>
                        )}

                        {/* Email Input */}
                        <div>
                            <label htmlFor="email" className="block text-sm font-medium text-gray-700">
                                Email address
                            </label>
                            <div className="mt-1 relative rounded-md shadow-sm">
                                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                    <Mail className="h-5 w-5 text-gray-400"/>
                                </div>
                                <input
                                    id="email"
                                    name="email"
                                    type="email"
                                    autoComplete="email"
                                    value={formData.email}
                                    onChange={handleChange}
                                    className={`block w-full pl-10 pr-3 py-2 border ${
                                        errors.email ? 'border-red-300' : 'border-gray-300'
                                    } rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500`}
                                    placeholder="you@example.com"
                                />
                            </div>
                            {errors.email && (
                                <p className="mt-2 text-sm text-red-600">{errors.email}</p>
                            )}
                        </div>

                        {/* Password Input */}
                        <div>
                            <label htmlFor="password" className="block text-sm font-medium text-gray-700">
                                Password
                            </label>
                            <div className="mt-1 relative rounded-md shadow-sm">
                                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                    <Lock className="h-5 w-5 text-gray-400"/>
                                </div>
                                <input
                                    id="password"
                                    name="password"
                                    type={showPassword ? 'text' : 'password'}
                                    value={formData.password}
                                    onChange={handleChange}
                                    className={`block w-full pl-10 pr-10 py-2 border ${
                                        errors.password ? 'border-red-300' : 'border-gray-300'
                                    } rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500`}
                                />
                                <button
                                    type="button"
                                    className="absolute inset-y-0 right-0 pr-3 flex items-center"
                                    onClick={() => setShowPassword(!showPassword)}
                                >
                                    {showPassword ? (
                                        <EyeOff className="h-5 w-5 text-gray-400"/>
                                    ) : (
                                        <Eye className="h-5 w-5 text-gray-400"/>
                                    )}
                                </button>
                            </div>
                            {errors.password && (
                                <p className="mt-2 text-sm text-red-600">{errors.password}</p>
                            )}
                        </div>

                        {/* Submit Button */}
                        <div>
                            <button
                                type="submit"
                                disabled={isLoading}
                                className={`w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white 
                                    ${isLoading ? 'bg-blue-400 cursor-not-allowed' : 'bg-blue-600 hover:bg-blue-700'}
                                    focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500`}
                            >
                                {isLoading ? 'Signing in...' : 'Sign in'}
                            </button>
                        </div>
                    </form>
                    {/* Forgot Password */}
                    <div className="flex items-center justify-end">
                        <div className="text-sm mt-2">
                            <button
                                onClick={forgotPasswordDialog.handleOpen}
                                className="font-medium text-blue-600 hover:text-blue-500"
                            >
                                Forgot your password?
                            </button>

                        </div>
                    </div>

                </div>
            </div>

            <div className="sm:mx-auto sm:w-full sm:max-w-md">
                <p className="mt-2 text-center text-sm text-gray-600">
                    Don't have an account?{' '}
                    <Link to="/register" className="font-medium text-blue-600 hover:text-blue-500">
                        Sign up
                    </Link>
                </p>
            </div>
            <ForgotPasswordDialog open={forgotPasswordDialog.open} onClose={forgotPasswordDialog.handleClose} />
        </div>
    );
};

export default Login;