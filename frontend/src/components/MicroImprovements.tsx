import React from 'react';
import { motion } from 'framer-motion';
import { Sparkles, TrendingUp, Target, Award } from 'lucide-react';

interface Improvement {
    type: string;
    message: string;
    icon: string;
    value: number;
}

interface MicroImprovementsProps {
    improvements: Improvement[];
}

export const MicroImprovements: React.FC<MicroImprovementsProps> = ({ improvements }) => {
    if (improvements.length === 0) {
        return (
            <div className="glass-card rounded-[50px] p-10 bg-gradient-to-br from-emerald-600/10 to-teal-600/10 border-emerald-500/20">
                <div className="flex items-center gap-3 mb-6">
                    <Sparkles size={24} className="text-emerald-500" />
                    <h3 className="text-xl font-black text-white italic">Signaux Positifs</h3>
                </div>
                <p className="text-slate-400 text-sm text-center py-8">
                    Continue à logger tes données pour détecter tes micro-améliorations
                </p>
            </div>
        );
    }

    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="glass-card rounded-[50px] p-10 bg-gradient-to-br from-emerald-600/10 to-teal-600/10 border-emerald-500/20"
        >
            <div className="flex items-center gap-3 mb-8">
                <Sparkles size={24} className="text-emerald-500" />
                <h3 className="text-xl font-black text-white italic">Signaux Positifs</h3>
            </div>

            <div className="space-y-4">
                {improvements.map((improvement, index) => (
                    <motion.div
                        key={index}
                        initial={{ opacity: 0, scale: 0.95 }}
                        animate={{ opacity: 1, scale: 1 }}
                        transition={{ delay: index * 0.1 }}
                        className="p-6 bg-emerald-500/10 border border-emerald-500/20 rounded-2xl"
                    >
                        <div className="flex items-center gap-4">
                            <div className="w-12 h-12 rounded-xl bg-emerald-500/20 flex items-center justify-center text-2xl flex-shrink-0">
                                {improvement.icon}
                            </div>
                            <div className="flex-1">
                                <p className="text-sm font-black text-emerald-400 uppercase mb-1">
                                    {improvement.type === 'activity_increase' && 'Activité en hausse'}
                                    {improvement.type === 'protein_timing' && 'Timing protéines'}
                                    {improvement.type === 'meal_consistency' && 'Régularité repas'}
                                </p>
                                <p className="text-white text-base font-medium">
                                    {improvement.message}
                                </p>
                            </div>
                            <div className="text-right">
                                <div className="flex items-baseline gap-1">
                                    <TrendingUp size={16} className="text-emerald-500" />
                                    <span className="text-2xl font-black text-emerald-500">
                                        {improvement.value > 0 ? '+' : ''}{Math.round(improvement.value)}
                                    </span>
                                </div>
                            </div>
                        </div>
                    </motion.div>
                ))}
            </div>

            <div className="mt-6 p-4 bg-emerald-500/10 border border-emerald-500/20 rounded-2xl flex items-start gap-3">
                <Award size={16} className="text-emerald-500 flex-shrink-0 mt-0.5" />
                <p className="text-xs text-emerald-200 italic">
                    Ces petits progrès sont souvent invisibles, mais ils construisent ta réussite à long terme.
                </p>
            </div>
        </motion.div>
    );
};
