import React, { useState, useEffect } from 'react';
import {
    MessageSquare,
    Bot,
    Sparkles,
    Brain,
    Moon,
    Sun,
    ChevronRight,
    Star,
    Zap,
    MessageCircle,
    Code,
    Image,
    FileText,
    Music,
    Video
} from 'lucide-react';
import {useSelector} from "react-redux";

const Home = () => {

    const {user} = useSelector((state) => state.auth);
    const [darkMode, setDarkMode] = useState(false);
    const [activeModel, setActiveModel] = useState(0);

    const toggleDarkMode = () => {
        setDarkMode(!darkMode);
        document.documentElement.classList.toggle('dark');
    };

    const aiModels = [
        {
            name: "ChatGPT",
            icon: <MessageCircle className="h-6 w-6" />,
            description: "Advanced conversational AI",
            color: "from-green-400 to-emerald-600"
        },
        {
            name: "Claude",
            icon: <Brain className="h-6 w-6" />,
            description: "Analytical and reasoning expert",
            color: "from-purple-400 to-indigo-600"
        },
        {
            name: "DALL-E",
            icon: <Image className="h-6 w-6" />,
            description: "Image generation specialist",
            color: "from-pink-400 to-rose-600"
        },
        {
            name: "Midjourney",
            icon: <Sparkles className="h-6 w-6" />,
            description: "Creative visuals generator",
            color: "from-blue-400 to-cyan-600"
        }
    ];

    const features = [
        { icon: <MessageSquare />, title: "Chat", desc: "Natural conversations" },
        { icon: <Code />, title: "Code", desc: "Programming assistance" },
        { icon: <Image />, title: "Images", desc: "Visual creation" },
        { icon: <FileText />, title: "Text", desc: "Content writing" },
        { icon: <Music />, title: "Audio", desc: "Sound generation" },
        { icon: <Video />, title: "Video", desc: "Video creation" }
    ];

    useEffect(() => {
        const interval = setInterval(() => {
            setActiveModel((prev) => (prev + 1) % aiModels.length);
        }, 3000);
        return () => clearInterval(interval);
    }, []);

    return (
        <div className="min-h-screen transition-colors duration-300 dark:bg-gray-900">
            {/* Hero Section */}
            <section className="relative pt-32 pb-20 overflow-hidden">
                <div className="absolute inset-0 bg-gradient-to-br from-blue-50 to-indigo-50 dark:from-gray-800 dark:to-gray-900"></div>
                <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
                        <div>
                            <div className="relative">
                                <div className="absolute -top-4 -left-4 w-72 h-72 bg-blue-400 rounded-full mix-blend-multiply filter blur-xl opacity-70"></div>
                                <div className="absolute -bottom-4 right-4 w-72 h-72 bg-purple-400 rounded-full mix-blend-multiply filter blur-xl opacity-70"></div>
                                <div className="absolute -right-4 -top-4 w-72 h-72 bg-indigo-400 rounded-full mix-blend-multiply filter blur-xl opacity-70"></div>
                                <div className="relative">
                                    <h1 className="text-5xl md:text-6xl font-bold text-gray-900 dark:text-white mb-6">
                                        Next-Gen AI Chat
                                        <span className="text-blue-600 dark:text-blue-400"> Experience</span>
                                    </h1>
                                    <p className="text-xl text-gray-600 dark:text-gray-300 mb-8">
                                        Access multiple AI models in one place. Enhance your productivity with intelligent conversations.
                                    </p>
                                    <div className="flex gap-4">
                                        <button className="bg-blue-600 text-white px-8 py-3 rounded-full font-medium hover:bg-blue-700 dark:bg-blue-500 dark:hover:bg-blue-600 transition-colors duration-300 flex items-center">
                                            Try Now
                                            <ChevronRight className="ml-2 h-5 w-5" />
                                        </button>
                                        <button className="bg-white text-gray-900 px-8 py-3 rounded-full font-medium hover:bg-gray-100 dark:bg-gray-800 dark:text-white dark:hover:bg-gray-700 transition-colors duration-300">
                                            Learn More
                                        </button>
                                    </div>
                                </div>
                            </div>
                        </div>
                        <div className="relative">
                            {/* Animated Model Cards */}
                            <div className="relative h-[500px]">
                                {aiModels.map((model, index) => (
                                    <div
                                        key={model.name}
                                        className={`absolute w-full max-w-md transform transition-all duration-500 ${
                                            index === activeModel
                                                ? 'translate-x-0 opacity-100 scale-100'
                                                : index < activeModel
                                                    ? '-translate-x-full opacity-0 scale-95'
                                                    : 'translate-x-full opacity-0 scale-95'
                                        }`}
                                    >
                                        <div className={`bg-gradient-to-r ${model.color} p-8 rounded-2xl shadow-xl`}>
                                            <div className="flex items-center gap-4 mb-4">
                                                <div className="p-3 bg-white/20 rounded-lg">
                                                    {model.icon}
                                                </div>
                                                <div>
                                                    <h3 className="text-xl font-semibold text-white">{model.name}</h3>
                                                    <p className="text-white/80">{model.description}</p>
                                                </div>
                                            </div>
                                            <div className="space-y-4">
                                                <div className="bg-white/10 p-4 rounded-lg">
                                                    <div className="flex items-center gap-3 text-white/90">
                                                        <Bot className="h-5 w-5" />
                                                        <span>Advanced natural language processing</span>
                                                    </div>
                                                </div>
                                                <div className="bg-white/10 p-4 rounded-lg">
                                                    <div className="flex items-center gap-3 text-white/90">
                                                        <Zap className="h-5 w-5" />
                                                        <span>Real-time responses</span>
                                                    </div>
                                                </div>
                                                <div className="bg-white/10 p-4 rounded-lg">
                                                    <div className="flex items-center gap-3 text-white/90">
                                                        <Star className="h-5 w-5" />
                                                        <span>Contextual understanding</span>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* Features Grid */}
            <section id="features" className="py-20">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="text-center mb-16">
                        <h2 className="text-4xl font-bold text-gray-900 dark:text-white mb-4">
                            Everything You Need
                        </h2>
                        <p className="text-xl text-gray-600 dark:text-gray-300">
                            One platform, unlimited possibilities
                        </p>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                        {features.map((feature, index) => (
                            <div
                                key={index}
                                className="group relative bg-white dark:bg-gray-800 p-8 rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 overflow-hidden"
                            >
                                <div className="absolute inset-0 bg-gradient-to-r from-blue-600 to-indigo-600 translate-y-full group-hover:translate-y-0 transition-transform duration-300"></div>
                                <div className="relative">
                                    <div className="w-12 h-12 bg-blue-100 dark:bg-gray-700 rounded-lg flex items-center justify-center mb-6 text-blue-600 dark:text-blue-400 group-hover:bg-white/20 group-hover:text-white transition-colors duration-300">
                                        {feature.icon}
                                    </div>
                                    <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2 group-hover:text-white">
                                        {feature.title}
                                    </h3>
                                    <p className="text-gray-600 dark:text-gray-300 group-hover:text-white/90">
                                        {feature.desc}
                                    </p>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </section>
        </div>
    );
};

export default Home;