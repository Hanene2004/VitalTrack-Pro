import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { AlertTriangle, TrendingDown, TrendingUp, Info } from 'lucide-react';

interface RiskDay {
    date: string;
    type: string;
    severity: string;
    message: string;
    details: any;
}

interface RiskDayAlertsProps {
    riskDays: RiskDay[];
}

export const RiskDayAlerts: React.FC<RiskDayAlertsProps> = ({ riskDays }) => {
    if (riskDays.length === 0) return null;

    const getSeverityColor = (severity: string) => {
        switch (severity) {
            case 'high': return { bg: 'bg-rose-500/10', border: 'border-rose-500/30', text: 'text-rose-500', icon: 'text-rose-500' };
            case 'medium': return { bg: 'bg-amber-500/10', border: 'border-amber-500/30', text: 'text-amber-500', icon: 'text-amber-500' };
            default: return { bg: 'bg-blue-500/10', border: 'border-blue-500/30', text: 'text-blue-500', icon: 'text-blue-500' };
        }
    };

    return (
        <div className="glass-card rounded-[50px] p-10 bg-white/5 border-white/10">
            <div className="flex items-center gap-3 mb-8">
                <AlertTriangle size={24} className="text-amber-500" />
                <h3 className="text-xl font-black text-white italic">Journées Atypiques</h3>
            </div>

            <div className="space-y-4">
                <AnimatePresence>
                    {riskDays.map((risk, index) => {
                        const colors = getSeverityColor(risk.severity);
                        return (
                            <motion.div
                                key={risk.date + index}
                                initial={{ opacity: 0, x: -20 }}
                                animate={{ opacity: 1, x: 0 }}
                                exit={{ opacity: 0, x: 20 }}
                                transition={{ delay: index * 0.1 }}
                                className={`p-6 ${colors.bg} border ${colors.border} rounded-2xl`}
                            >
                                <div className="flex items-start gap-4">
                                    <div className={`w-10 h-10 rounded-xl ${colors.bg} flex items-center justify-center flex-shrink-0`}>
                                        {risk.type === 'high_activity_low_fuel' && <TrendingDown size={20} className={colors.icon} />}
                                        {risk.type === 'sedentary_overeating' && <TrendingUp size={20} className={colors.icon} />}
                                        {risk.type === 'extreme_deficit' && <AlertTriangle size={20} className={colors.icon} />}
                                    </div>
                                    <div className="flex-1">
                                        <div className="flex items-center justify-between mb-2">
                                            <span className="text-xs font-black text-slate-400 uppercase">
                                                {new Date(risk.date).toLocaleDateString('fr-FR', { weekday: 'short', day: 'numeric', month: 'short' })}
                                            </span>
                                            {risk.severity === 'high' && (
                                                <span className="px-2 py-1 bg-rose-500/20 border border-rose-500/30 rounded-lg text-[10px] font-black text-rose-500 uppercase">
                                                    Important
                                                </span>
                                            )}
                                        </div>
                                        <p className={`text-sm font-medium ${colors.text} mb-3`}>
                                            {risk.message}
                                        </p>
                                        {risk.details && (
                                            <div className="flex gap-4 text-xs">
                                                {risk.details.calories !== undefined && (
                                                    <div>
                                                        <span className="text-slate-500 font-bold uppercase">Calories: </span>
                                                        <span className="text-white font-black">{risk.details.calories}</span>
                                                    </div>
                                                )}
                                                {risk.details.activity_burn !== undefined && (
                                                    <div>
                                                        <span className="text-slate-500 font-bold uppercase">Brûlées: </span>
                                                        <span className="text-white font-black">{risk.details.activity_burn}</span>
                                                    </div>
                                                )}
                                                {risk.details.net !== undefined && (
                                                    <div>
                                                        <span className="text-slate-500 font-bold uppercase">Net: </span>
                                                        <span className={`font-black ${risk.details.net < 0 ? 'text-rose-500' : 'text-emerald-500'}`}>
                                                            {risk.details.net}
                                                        </span>
                                                    </div>
                                                )}
                                            </div>
                                        )}
                                    </div>
                                </div>
                            </motion.div>
                        );
                    })}
                </AnimatePresence>
            </div>

            <div className="mt-6 p-4 bg-blue-500/10 border border-blue-500/20 rounded-2xl flex items-start gap-3">
                <Info size={16} className="text-blue-500 flex-shrink-0 mt-0.5" />
                <p className="text-xs text-blue-200">
                    Ces alertes ne sont pas des jugements. Elles signalent simplement des journées qui sortent de ton schéma habituel.
                </p>
            </div>
        </div>
    );
};
