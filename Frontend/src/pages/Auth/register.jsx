import React, {useState} from 'react';
import {Link, useNavigate} from 'react-router-dom';
import {Mail, Lock, User, Eye, EyeOff, Phone} from 'lucide-react';
import {authAPI} from '../../services/api';

const Register = () => {
    const navigate = useNavigate();
    const [formData, setFormData] = useState({
        firstName: '',
        lastName: '',
        email: '',
        phone: '',
        password: '',
        password2: '', // Confirm password for Django backend
    });

    const [showPassword, setShowPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);
    const [errors, setErrors] = useState({});
    const [termsAccepted, setTermsAccepted] = useState(false);
    const [isLoading, setIsLoading] = useState(false);

    const handleChange = (e) => {
        const {name, value} = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: value,
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

        // First Name validation
        if (!formData.firstName.trim()) {
            newErrors.firstName = 'First name is required';
        }

        // Last Name validation
        if (!formData.lastName.trim()) {
            newErrors.lastName = 'Last name is required';
        }

        // Email validation
        if (!formData.email) {
            newErrors.email = 'Email is required';
        } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
            newErrors.email = 'Email is invalid';
        }

        // Phone validation
        if (!formData.phone) {
            newErrors.phone = 'Phone number is required';
        } else if (!/^\d{11}$/.test(formData.phone.replace(/\D/g, ''))) {
            newErrors.phone = 'Phone number must be 11 digits';
        }

        // Password validation
        if (!formData.password) {
            newErrors.password = 'Password is required';
        } else if (formData.password.length < 8) {
            newErrors.password = 'Password must be at least 8 characters';
        } else if (!/(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/.test(formData.password)) {
            newErrors.password = 'Password must contain uppercase, lowercase and number';
        }

        // Confirm Password validation
        if (!formData.password2) {
            newErrors.password2 = 'Please confirm your password';
        } else if (formData.password !== formData.password2) {
            newErrors.password2 = 'Passwords do not match';
        }

        if (!termsAccepted) {
            newErrors.terms = 'You must accept the terms and conditions';
        }

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        if (validateForm()) {
            setIsLoading(true);
            try {
                // Format data for Django backend
                const registrationData = {
                    username: formData.email, // Using email as username
                    email: formData.email,
                    password: formData.password,
                    password2: formData.password2,
                    first_name: formData.firstName,
                    last_name: formData.lastName,
                    phone_number: formData.phone,
                };

                authAPI.register(registrationData)
                    .then((data) => {
                        console.log("User created successfully");
                        navigate('/login', {replace: true});
                    }
                    )
                    .catch((error) => {
                    console.log("User already exists");

                    })

            } catch (error) {
                const serverErrors = error.response?.data || {};
                const formattedErrors = {};

                // Format backend validation errors
                Object.keys(serverErrors).forEach(key => {
                    formattedErrors[key] = Array.isArray(serverErrors[key])
                        ? serverErrors[key][0]
                        : serverErrors[key];
                });

                setErrors({
                    ...formattedErrors,
                    submit: 'Registration failed. Please check your information and try again.'
                });
            } finally {
                setIsLoading(false);
            }
        }
    };

    return (
        <div className="min-h-screen bg-gray-50 flex flex-col justify-center py-12 sm:px-6 lg:px-8">
            <div className="sm:mx-auto sm:w-full sm:max-w-md">
                <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900">
                    Create your account
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

                        {/* Name Fields */}
                        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
                            {/* First Name */}
                            <div>
                                <label htmlFor="firstName" className="block text-sm font-medium text-gray-700">
                                    First Name
                                </label>
                                <div className="mt-1 relative rounded-md shadow-sm">
                                    <div
                                        className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                        <User className="h-5 w-5 text-gray-400"/>
                                    </div>
                                    <input
                                        id="firstName"
                                        name="firstName"
                                        type="text"
                                        value={formData.firstName}
                                        onChange={handleChange}
                                        className={`block w-full pl-10 pr-3 py-2 border ${
                                            errors.firstName ? 'border-red-300' : 'border-gray-300'
                                        } rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500`}
                                    />
                                </div>
                                {errors.firstName && (
                                    <p className="mt-2 text-sm text-red-600">{errors.firstName}</p>
                                )}
                            </div>

                            {/* Last Name */}
                            <div>
                                <label htmlFor="lastName" className="block text-sm font-medium text-gray-700">
                                    Last Name
                                </label>
                                <div className="mt-1 relative rounded-md shadow-sm">
                                    <div
                                        className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                        <User className="h-5 w-5 text-gray-400"/>
                                    </div>
                                    <input
                                        id="lastName"
                                        name="lastName"
                                        type="text"
                                        value={formData.lastName}
                                        onChange={handleChange}
                                        className={`block w-full pl-10 pr-3 py-2 border ${
                                            errors.lastName ? 'border-red-300' : 'border-gray-300'
                                        } rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500`}
                                    />
                                </div>
                                {errors.lastName && (
                                    <p className="mt-2 text-sm text-red-600">{errors.lastName}</p>
                                )}
                            </div>
                        </div>

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

                        {/* Phone Input */}
                        <div>
                            <label htmlFor="phone" className="block text-sm font-medium text-gray-700">
                                Phone Number
                            </label>
                            <div className="mt-1 relative rounded-md shadow-sm">
                                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                    <Phone className="h-5 w-5 text-gray-400"/>
                                </div>
                                <input
                                    id="phone"
                                    name="phone"
                                    type="tel"
                                    value={formData.phone}
                                    onChange={handleChange}
                                    className={`block w-full pl-10 pr-3 py-2 border ${
                                        errors.phone ? 'border-red-300' : 'border-gray-300'
                                    } rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500`}
                                    placeholder="1234567890"
                                />
                            </div>
                            {errors.phone && (
                                <p className="mt-2 text-sm text-red-600">{errors.phone}</p>
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

                        {/* Confirm Password Input */}
                        <div>
                            <label htmlFor="password2" className="block text-sm font-medium text-gray-700">
                                Confirm Password
                            </label>
                            <div className="mt-1 relative rounded-md shadow-sm">
                                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                    <Lock className="h-5 w-5 text-gray-400"/>
                                </div>
                                <input
                                    id="password2"
                                    name="password2"
                                    type={showConfirmPassword ? 'text' : 'password'}
                                    value={formData.password2}
                                    onChange={handleChange}
                                    className={`block w-full pl-10 pr-10 py-2 border ${
                                        errors.password2 ? 'border-red-300' : 'border-gray-300'
                                    } rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500`}
                                />
                                <button
                                    type="button"
                                    className="absolute inset-y-0 right-0 pr-3 flex items-center"
                                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                                >
                                    {showConfirmPassword ? (
                                        <EyeOff className="h-5 w-5 text-gray-400"/>
                                    ) : (
                                        <Eye className="h-5 w-5 text-gray-400"/>
                                    )}
                                </button>
                            </div>
                            {errors.password2 && (
                                <p className="mt-2 text-sm text-red-600">{errors.password2}</p>
                            )}
                        </div>

                        {/* Terms and Conditions */}
                        <div className="flex items-center">
                            <input
                                id="terms"
                                name="terms"
                                type="checkbox"
                                checked={termsAccepted}
                                onChange={(e) => setTermsAccepted(e.target.checked)}
                                className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                            />
                            <label htmlFor="terms" className="ml-2 block text-sm text-gray-900">
                                I agree to the{' '}
                                <Link to="/terms" className="text-blue-600 hover:text-blue-500">
                                    Terms and Conditions
                                </Link>
                            </label>
                        </div>
                        {errors.terms && (
                            <p className="mt-2 text-sm text-red-600">{errors.terms}</p>
                        )}

                        {/* Submit Button */}
                        <div>
                            <button
                                type="submit"
                                disabled={!termsAccepted || isLoading}
                                className={`w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white 
                                ${(!termsAccepted || isLoading)
                                    ? 'bg-blue-300 cursor-not-allowed'
                                    : 'bg-blue-600 hover:bg-blue-700'}
                                focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500`}
                            >
                                {isLoading ? 'Creating Account...' : 'Create Account'}
                            </button>
                        </div>
                    </form>
                </div>
            </div>
            <div className="sm:mx-auto sm:w-full sm:max-w-md">
                <p className="mt-2 text-center text-sm text-gray-600">
                    Already have an account?{' '}
                    <Link to="/login" className="font-medium text-blue-600 hover:text-blue-500">
                        Sign in
                    </Link>
                </p>
            </div>
        </div>
    );
};

export default Register;