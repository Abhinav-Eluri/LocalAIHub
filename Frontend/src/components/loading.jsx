import React from 'react';

const Loading = () => {
    return (
        <div className="fixed inset-0 flex items-center justify-center bg-white bg-opacity-80 backdrop-blur-sm">
            <div className="flex flex-col items-center gap-4">
                {/* Main spinning circle */}
                <div className="relative">
                    <div className="w-16 h-16 border-4 border-blue-200 rounded-full animate-spin border-t-blue-500"></div>
                    <div className="absolute top-0 w-16 h-16 border-4 border-transparent rounded-full animate-pulse border-t-blue-300 animate-[spin_2s_linear_infinite]"></div>
                </div>

                {/* Pulse dots */}
                <div className="flex space-x-2">
                    <div className="w-3 h-3 bg-blue-500 rounded-full animate-[bounce_1s_infinite]"></div>
                    <div className="w-3 h-3 bg-blue-500 rounded-full animate-[bounce_1s_infinite_200ms]"></div>
                    <div className="w-3 h-3 bg-blue-500 rounded-full animate-[bounce_1s_infinite_400ms]"></div>
                </div>

                {/* Loading text */}
                <div className="text-blue-600 font-medium">
                    <span className="inline-block animate-[pulse_1.5s_infinite]">Loading</span>
                    <span className="inline-block animate-[bounce_1s_infinite_100ms]">.</span>
                    <span className="inline-block animate-[bounce_1s_infinite_200ms]">.</span>
                    <span className="inline-block animate-[bounce_1s_infinite_300ms]">.</span>
                </div>
            </div>
        </div>
    );
};

export default Loading;