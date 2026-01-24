import React from 'react';
import { motion } from 'framer-motion';
import { Zap, Target, Sparkles, ChevronRight, Activity } from 'lucide-react';

export const PerformanceCoach: React.FC<{ advice: any }> = ({ advice }) => {
    return (
        <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="glass-card rounded-[40px] p-10 bg-gradient-to-br from-blue-600/20 to-emerald-600/20 border-white/10 relative overflow-hidden"
        >
            <div className="absolute top-0 right-0 p-8 opacity-10">
                <Sparkles size={120} className="text-emerald-400" />
            </div>

            <div className="flex items-center gap-4 mb-8">
                <div className="w-12 h-12 rounded-2xl bg-emerald-500 flex items-center justify-center text-white shadow-lg shadow-emerald-500/20">
                    <Activity size={24} />
                </div>
                <div>
                    <h3 className="text-xl font-black text-white italic">Elite Performance AI</h3>
                    <p className="text-[10px] font-bold text-emerald-500 uppercase tracking-widest text-xs">Neural-Coach Active</p>
                </div>
            </div>

            <div className="space-y-6 relative z-10">
                <div className="p-6 bg-white/5 rounded-[24px] border border-white/5">
                    <p className="text-lg font-medium text-slate-200 leading-relaxed italic">
                        "{advice?.coach_directive || "Synthesizing biometric data for optimal directive..."}"
                    </p>
                </div>

                <div className="grid grid-cols-2 gap-4">
                    <div className="p-4 bg-emerald-500/10 rounded-2xl border border-emerald-500/20">
                        <span className="text-[10px] font-black text-emerald-500 uppercase block mb-1">Recommended Load</span>
                        <span className="text-white font-bold">{advice?.next_optimal_workout || "HIIT Precision"}</span>
                    </div>
                    <div className="p-4 bg-blue-500/10 rounded-2xl border border-blue-500/20">
                        <span className="text-[10px] font-black text-blue-500 uppercase block mb-1">Nutrient Optimization</span>
                        <span className="text-white font-bold">{advice?.nutrient_recommendation || "Electrolyte Surge"}</span>
                    </div>
                </div>

                <button className="w-full py-5 bg-white/5 hover:bg-white/10 rounded-2xl border border-white/10 flex items-center justify-center gap-3 transition-all group">
                    <span className="text-xs font-black uppercase tracking-widest text-slate-300 group-hover:text-white">View Full Protocol</span>
                    <ChevronRight size={16} className="text-slate-500 group-hover:translate-x-1 transition-transform" />
                </button>
            </div>
        </motion.div>
    );
};
