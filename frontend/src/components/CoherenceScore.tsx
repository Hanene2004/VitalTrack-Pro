import React from 'react';
import { motion } from 'framer-motion';
import { TrendingUp, Activity, Utensils, Moon } from 'lucide-react';

interface CoherenceScoreProps {
    score: {
        daily_score: number;
        weekly_score: number;
        message: string;
        factors: {
            meal_regularity?: number;
            activity_regularity?: number;
            sleep_regularity?: number;
        };
    };
}

export const CoherenceScore: React.FC<CoherenceScoreProps> = ({ score }) => {
    const getScoreColor = (value: number) => {
        if (value >= 80) return 'emerald';
        if (value >= 60) return 'blue';
        if (value >= 40) return 'amber';
        return 'slate';
    };

    const scoreColor = getScoreColor(score.daily_score);
    const colorClasses = {
        emerald: 'from-emerald-500 to-emerald-600',
        blue: 'from-blue-500 to-blue-600',
        amber: 'from-amber-500 to-amber-600',
        slate: 'from-slate-500 to-slate-600'
    };

    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="glass-card rounded-[50px] p-10 bg-gradient-to-br from-purple-600/10 to-indigo-600/10 border-purple-500/20"
        >
            <div className="flex items-center gap-3 mb-8">
                <TrendingUp size={24} className="text-purple-500" />
                <h3 className="text-xl font-black text-white italic">Score de Cohérence</h3>
            </div>

            <div className="mb-8">
                <div className="flex items-baseline gap-4 mb-3">
                    <span className={`text-6xl font-black bg-gradient-to-r ${colorClasses[scoreColor]} bg-clip-text text-transparent`}>
                        {Math.round(score.daily_score)}
                    </span>
                    <span className="text-slate-500 text-sm font-black uppercase">/100</span>
                </div>
                <p className="text-white text-sm font-medium italic">"{score.message}"</p>
            </div>

            <div className="space-y-4">
                <div className="p-4 bg-white/5 rounded-2xl border border-white/5">
                    <div className="flex items-center justify-between mb-2">
                        <div className="flex items-center gap-2">
                            <Utensils size={16} className="text-emerald-500" />
                            <span className="text-xs font-black text-slate-400 uppercase">Régularité Repas</span>
                        </div>
                        <span className="text-sm font-black text-white">{Math.round(score.factors.meal_regularity || 0)}%</span>
                    </div>
                    <div className="h-1.5 bg-white/5 rounded-full overflow-hidden">
                        <div
                            className="h-full bg-emerald-500 transition-all duration-500"
                            style={{ width: `${score.factors.meal_regularity || 0}%` }}
                        />
                    </div>
                </div>

                <div className="p-4 bg-white/5 rounded-2xl border border-white/5">
                    <div className="flex items-center justify-between mb-2">
                        <div className="flex items-center gap-2">
                            <Activity size={16} className="text-blue-500" />
                            <span className="text-xs font-black text-slate-400 uppercase">Régularité Sport</span>
                        </div>
                        <span className="text-sm font-black text-white">{Math.round(score.factors.activity_regularity || 0)}%</span>
                    </div>
                    <div className="h-1.5 bg-white/5 rounded-full overflow-hidden">
                        <div
                            className="h-full bg-blue-500 transition-all duration-500"
                            style={{ width: `${score.factors.activity_regularity || 0}%` }}
                        />
                    </div>
                </div>

                {(score.factors.sleep_regularity || 0) > 0 && (
                    <div className="p-4 bg-white/5 rounded-2xl border border-white/5">
                        <div className="flex items-center justify-between mb-2">
                            <div className="flex items-center gap-2">
                                <Moon size={16} className="text-purple-500" />
                                <span className="text-xs font-black text-slate-400 uppercase">Régularité Sommeil</span>
                            </div>
                            <span className="text-sm font-black text-white">{Math.round(score.factors.sleep_regularity || 0)}%</span>
                        </div>
                        <div className="h-1.5 bg-white/5 rounded-full overflow-hidden">
                            <div
                                className="h-full bg-purple-500 transition-all duration-500"
                                style={{ width: `${score.factors.sleep_regularity || 0}%` }}
                            />
                        </div>
                    </div>
                )}
            </div>

            <div className="mt-6 p-4 bg-purple-500/10 border border-purple-500/20 rounded-2xl">
                <p className="text-xs text-purple-200 italic">
                    Ce score mesure la régularité de tes habitudes, pas leur qualité. La constance est la clé.
                </p>
            </div>
        </motion.div>
    );
};
