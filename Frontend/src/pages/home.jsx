import React from 'react';
import { ArrowRight, ShoppingBag, Shield, Truck, Clock } from 'lucide-react';
import {useSelector} from "react-redux";
import SplitText from "../blocks/TextAnimations/SplitText/SplitText.jsx";
import StarBorder from "../blocks/Animations/StarBorder/StarBorder.jsx";

const Home = () => {
    const {user, isAuthenticated} = useSelector(state => state.auth);
    return (
        <div className="w-full">
            {/* Hero Section */}
            <section className="bg-gradient-to-r from-blue-600 to-blue-700 text-white">
                <div className="max-w-7xl mx-auto px-4 py-24 sm:px-6 lg:px-8">
                    <div className="text-center">
                        {isAuthenticated ? (
                            <SplitText text={`Welcome ${user.first_name}`} className="text-4xl text-bold"/>
                        ): (
                            <SplitText text={`Welcome to Our Store`} />

                        )
                        }

                        <p className="mt-6 text-xl text-blue-100">
                            Discover amazing products at unbeatable prices
                        </p>
                        <div className="mt-10">
                                <button className="bg-white text-blue-600 px-8 py-3 rounded-lg font-medium hover:bg-blue-50 transition-colors duration-300 inline-flex items-center">
                                    Shop Now
                                    <ArrowRight className="ml-2 h-5 w-5" />
                                </button>
                        </div>
                    </div>
                </div>
            </section>

            {/* Features Section */}
            <section className="py-20 bg-gray-50">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="text-center">
                        <h2 className="text-3xl font-bold text-gray-900">
                            Why Choose Us
                        </h2>
                        <p className="mt-4 text-lg text-gray-600">
                            We offer the best shopping experience for our customers
                        </p>
                    </div>

                    <div className="mt-20 grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-4">
                        {/* Feature 1 */}
                        <div className="text-center">
                            <div className="mx-auto h-12 w-12 text-blue-600">
                                <ShoppingBag className="h-12 w-12" />
                            </div>
                            <h3 className="mt-6 text-lg font-medium text-gray-900">
                                Quality Products
                            </h3>
                            <p className="mt-2 text-gray-600">
                                Handpicked products from trusted suppliers
                            </p>
                        </div>

                        {/* Feature 2 */}
                        <div className="text-center">
                            <div className="mx-auto h-12 w-12 text-blue-600">
                                <Shield className="h-12 w-12" />
                            </div>
                            <h3 className="mt-6 text-lg font-medium text-gray-900">
                                Secure Shopping
                            </h3>
                            <p className="mt-2 text-gray-600">
                                Your transactions are always protected
                            </p>
                        </div>

                        {/* Feature 3 */}
                        <div className="text-center">
                            <div className="mx-auto h-12 w-12 text-blue-600">
                                <Truck className="h-12 w-12" />
                            </div>
                            <h3 className="mt-6 text-lg font-medium text-gray-900">
                                Fast Delivery
                            </h3>
                            <p className="mt-2 text-gray-600">
                                Quick shipping to your doorstep
                            </p>
                        </div>

                        {/* Feature 4 */}
                        <div className="text-center">
                            <div className="mx-auto h-12 w-12 text-blue-600">
                                <Clock className="h-12 w-12" />
                            </div>
                            <h3 className="mt-6 text-lg font-medium text-gray-900">
                                24/7 Support
                            </h3>
                            <p className="mt-2 text-gray-600">
                                Always here to help you
                            </p>
                        </div>
                    </div>
                </div>
            </section>

            {/* Featured Products Section */}
            <section className="py-20">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <h2 className="text-3xl font-bold text-gray-900 text-center">
                        Featured Products
                    </h2>
                    <div className="mt-12 grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-3">
                        {/* Product Cards */}
                        {[1, 2, 3].map((item) => (
                            <div key={item} className="bg-white rounded-lg shadow-md overflow-hidden">
                                <div className="h-48 bg-gray-200">
                                    <img
                                        src={`/api/placeholder/400/300`}
                                        alt="Product"
                                        className="w-full h-full object-cover"
                                    />
                                </div>
                                <div className="p-6">
                                    <h3 className="text-lg font-medium text-gray-900">Product {item}</h3>
                                    <p className="mt-2 text-gray-600">
                                        Lorem ipsum dolor sit amet, consectetur adipiscing elit.
                                    </p>
                                    <div className="mt-4 flex items-center justify-between">
                                        <span className="text-lg font-bold text-blue-600">$99.99</span>
                                        <button className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700">
                                            Add to Cart
                                        </button>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* Newsletter Section */}
            <section className="bg-gray-50 py-20">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="text-center">
                        <h2 className="text-3xl font-bold text-gray-900">
                            Stay Updated
                        </h2>
                        <p className="mt-4 text-lg text-gray-600">
                            Subscribe to our newsletter for the latest updates and exclusive offers
                        </p>
                        <div className="mt-8 max-w-md mx-auto">
                            <div className="flex gap-4">
                                <input
                                    type="email"
                                    placeholder="Enter your email"
                                    className="flex-1 rounded-lg border-gray-300 px-4 py-3 focus:border-blue-500 focus:ring-blue-500"
                                />
                                <button className="bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700">
                                    Subscribe
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            </section>
        </div>
    );
};

export default Home;