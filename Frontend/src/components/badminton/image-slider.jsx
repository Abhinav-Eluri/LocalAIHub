import React, { useState, useEffect } from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';

function ImageSlider() {
    const [currentIndex, setCurrentIndex] = useState(0);
    const [isTransitioning, setIsTransitioning] = useState(false);
    const images = [
        { src: "/images/badminton1.jpg", alt: "Badminton 1" },
        { src: "/images/badminton2.jpg", alt: "Badminton 2" },
        { src: "/images/badminton3.jpg", alt: "Badminton 3" },
        { src: "/images/badminton4.jpg", alt: "Badminton 4" },
        { src: "/images/badminton5.jpg", alt: "Badminton 5" }
    ];

    const changeSlide = (newIndex) => {
        setIsTransitioning(true);
        setCurrentIndex(newIndex);
        setTimeout(() => setIsTransitioning(false), 500);
    };

    useEffect(() => {
        const interval = setInterval(() => {
            const newIndex = currentIndex === images.length - 1 ? 0 : currentIndex + 1;
            changeSlide(newIndex);
        }, 3000);
        return () => clearInterval(interval);
    }, [currentIndex]);

    const nextSlide = () => {
        const newIndex = currentIndex === images.length - 1 ? 0 : currentIndex + 1;
        changeSlide(newIndex);
    };

    const prevSlide = () => {
        const newIndex = currentIndex === 0 ? images.length - 1 : currentIndex - 1;
        changeSlide(newIndex);
    };

    return (
        <div className="relative w-full min-h-[400px] overflow-hidden bg-gray-900">
            {images.map((image, index) => (
                <div
                    key={index}
                    className={`absolute inset-0 transform transition-all duration-500 ease-in-out
                        ${index === currentIndex ? 'translate-x-0 opacity-100' :
                        index < currentIndex ? '-translate-x-full opacity-0' : 'translate-x-full opacity-0'}`}
                    style={{ zIndex: index === currentIndex ? 1 : 0 }}
                >
                    <img
                        src={image.src}
                        alt={image.alt}
                        className="w-full h-full object-cover"
                    />
                </div>
            ))}

            <button
                onClick={prevSlide}
                disabled={isTransitioning}
                className="absolute left-4 top-1/2 -translate-y-1/2 bg-black/50 p-2 rounded-full text-white hover:bg-black/75 transition-all z-10"
            >
                <ChevronLeft size={24} />
            </button>
            <button
                onClick={nextSlide}
                disabled={isTransitioning}
                className="absolute right-4 top-1/2 -translate-y-1/2 bg-black/50 p-2 rounded-full text-white hover:bg-black/75 transition-all z-10"
            >
                <ChevronRight size={24} />
            </button>

            <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex gap-2 z-10">
                {images.map((_, index) => (
                    <button
                        key={index}
                        onClick={() => !isTransitioning && changeSlide(index)}
                        className={`w-3 h-3 rounded-full transition-all ${
                            currentIndex === index ? "bg-white" : "bg-white/50"
                        }`}
                    />
                ))}
            </div>
        </div>
    );
}

export default ImageSlider;