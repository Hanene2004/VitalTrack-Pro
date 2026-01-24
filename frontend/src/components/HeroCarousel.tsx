import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronLeft, ChevronRight } from 'lucide-react';

const HERO_SLIDES = [
    {
        image: '/hero-yoga.jpg',
        title: 'Performance Optimale',
        subtitle: 'Synchronisez votre nutrition avec votre entraînement',
        color: 'from-teal-500 to-emerald-500'
    },
    {
        image: '/hero-nutrition.jpg',
        title: 'Nutrition Intelligente',
        subtitle: 'Des repas équilibrés pour une santé durable',
        color: 'from-emerald-500 to-green-500'
    },
    {
        image: '/hero-energy.jpg',
        title: 'Équilibre Énergétique',
        subtitle: 'Suivez votre balance métabolique en temps réel',
        color: 'from-blue-500 to-cyan-500'
    }
];

export const HeroCarousel: React.FC = () => {
    const [currentSlide, setCurrentSlide] = useState(0);

    useEffect(() => {
        const timer = setInterval(() => {
            setCurrentSlide((prev) => (prev + 1) % HERO_SLIDES.length);
        }, 5000);
        return () => clearInterval(timer);
    }, []);

    const nextSlide = () => setCurrentSlide((prev) => (prev + 1) % HERO_SLIDES.length);
    const prevSlide = () => setCurrentSlide((prev) => (prev - 1 + HERO_SLIDES.length) % HERO_SLIDES.length);

    return (
        <div className="relative w-full h-[400px] rounded-[60px] overflow-hidden group">
            <AnimatePresence mode="wait">
                <motion.div
                    key={currentSlide}
                    initial={{ opacity: 0, scale: 1.1 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.95 }}
                    transition={{ duration: 0.7 }}
                    className="absolute inset-0"
                >
                    <img
                        src={HERO_SLIDES[currentSlide].image}
                        alt={HERO_SLIDES[currentSlide].title}
                        className="w-full h-full object-cover"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-[#020617] via-[#020617]/60 to-transparent" />

                    <div className="absolute bottom-0 left-0 right-0 p-12">
                        <motion.div
                            initial={{ y: 20, opacity: 0 }}
                            animate={{ y: 0, opacity: 1 }}
                            transition={{ delay: 0.2 }}
                        >
                            <div className={`inline-block px-4 py-2 rounded-full bg-gradient-to-r ${HERO_SLIDES[currentSlide].color} mb-4`}>
                                <span className="text-xs font-black text-white uppercase tracking-widest">
                                    VitalTrack Pro
                                </span>
                            </div>
                            <h2 className="text-4xl font-black text-white mb-2 italic">
                                {HERO_SLIDES[currentSlide].title}
                            </h2>
                            <p className="text-slate-300 text-lg font-medium">
                                {HERO_SLIDES[currentSlide].subtitle}
                            </p>
                        </motion.div>
                    </div>
                </motion.div>
            </AnimatePresence>

            {/* Navigation Arrows */}
            <button
                onClick={prevSlide}
                className="absolute left-6 top-1/2 -translate-y-1/2 w-12 h-12 rounded-full bg-white/10 backdrop-blur-xl border border-white/20 flex items-center justify-center text-white opacity-0 group-hover:opacity-100 transition-opacity hover:bg-white/20"
            >
                <ChevronLeft size={24} />
            </button>
            <button
                onClick={nextSlide}
                className="absolute right-6 top-1/2 -translate-y-1/2 w-12 h-12 rounded-full bg-white/10 backdrop-blur-xl border border-white/20 flex items-center justify-center text-white opacity-0 group-hover:opacity-100 transition-opacity hover:bg-white/20"
            >
                <ChevronRight size={24} />
            </button>

            {/* Dots Indicator */}
            <div className="absolute bottom-6 left-1/2 -translate-x-1/2 flex gap-2">
                {HERO_SLIDES.map((_, index) => (
                    <button
                        key={index}
                        onClick={() => setCurrentSlide(index)}
                        className={`w-2 h-2 rounded-full transition-all ${index === currentSlide
                                ? 'bg-white w-8'
                                : 'bg-white/40 hover:bg-white/60'
                            }`}
                    />
                ))}
            </div>
        </div>
    );
};
