import React from 'react';
import { motion } from 'framer-motion';
import { calculateDailySummary, formatNumber } from '../shared/utils';

export const ProStat: React.FC<{ label: string, value: number, icon: any, color: string, sub: string }> = ({ label, value, icon, color, sub }) => {
    const colorClasses = {
        emerald: { text: 'text-emerald-500', bg: 'bg-emerald-500/20', border: 'border-emerald-500/30' },
        orange: { text: 'text-orange-500', bg: 'bg-orange-500/20', border: 'border-orange-500/30' },
        blue: { text: 'text-blue-500', bg: 'bg-blue-500/20', border: 'border-blue-500/30' },
        amber: { text: 'text-amber-500', bg: 'bg-amber-500/20', border: 'border-amber-500/30' }
    };
    const colors = colorClasses[color as keyof typeof colorClasses] || colorClasses.emerald;

    return (
        <motion.div whileHover={{ y: -8 }} className="glass-card rounded-[42px] p-12 relative overflow-hidden group border-white/10">
            <div className="flex items-center gap-4 mb-6">
                <div className={`w-16 h-16 rounded-2xl ${colors.bg} ${colors.border} border-2 flex items-center justify-center ${colors.text}`}>
                    {React.cloneElement(icon, { size: 32 })}
                </div>
                <p className="text-[10px] font-black text-slate-500 tracking-widest uppercase">{label}</p>
            </div>
            <div className="flex items-baseline gap-2 mb-3">
                <span className="text-6xl font-black text-white">{formatNumber(value)}</span>
                <span className={`text-xs font-black uppercase ${colors.text}`}>{label === 'Bio-Balance' ? '%' : 'amt'}</span>
            </div>
            <p className="text-[10px] font-bold text-slate-700 uppercase">{sub}</p>
        </motion.div>
    );
};

export const InsightGauge: React.FC<{ label: string, progress: number, color: string }> = ({ label, progress, color }) => (
    <div className="space-y-4">
        <div className="flex justify-between items-center"><span className="text-[11px] font-black text-slate-500 uppercase leading-none">{label}</span><span className={`text-[11px] font-black ${color === 'emerald' ? 'text-emerald-400' : color === 'blue' ? 'text-blue-400' : 'text-amber-400'}`}>{Math.round(progress)}%</span></div>
        <div className="w-full h-2.5 bg-white/5 rounded-full overflow-hidden border border-white/5"><motion.div initial={{ width: 0 }} animate={{ width: `${progress}%` }} transition={{ duration: 2 }} className={`h-full rounded-full ${color === 'emerald' ? 'bg-emerald-500' : color === 'blue' ? 'bg-blue-500' : 'bg-amber-500'}`} /></div>
    </div>
);

export const MacroRow: React.FC<{ label: string, current: number, target: number, unit: string, color: string }> = ({ label, current, target, unit, color }) => (
    <div className="space-y-4">
        <div className="flex justify-between items-baseline"><span className="text-xs font-black text-slate-500 uppercase">{label}</span><div className="space-x-2"><span className="text-xl font-black text-white">{formatNumber(current)}</span><span className="text-[10px] font-bold text-slate-600 uppercase">/ {formatNumber(target)} {unit}</span></div></div>
        <div className="w-full h-2 bg-white/5 rounded-full overflow-hidden"><motion.div initial={{ width: 0 }} animate={{ width: `${Math.min(100, (current / target) * 100)}%` }} className={`h-full ${color === 'emerald' ? 'bg-emerald-500' : color === 'blue' ? 'bg-blue-500' : 'bg-amber-500'}`} /></div>
    </div>
);

export const NavIcon: React.FC<{ icon: any, active: boolean, onClick: () => void, label: string, testId?: string }> = ({ icon, active, onClick, label, testId }) => (
    <div className="flex flex-col items-center gap-2 group">
        <button data-testid={testId} onClick={onClick} className={`w-16 h-16 rounded-[22px] flex items-center justify-center transition-all duration-500 relative ${active ? 'bg-emerald-600 text-white shadow-[0_15px_40px_rgba(5,150,105,0.4)]' : 'text-slate-600 hover:text-slate-300 hover:bg-white/5'}`}>{icon}{active && <div className="absolute -inset-2 bg-emerald-500/20 blur-xl rounded-full z-[-1]" />}</button>
        <span className={`text-[9px] font-black uppercase tracking-widest ${active ? 'text-emerald-500' : 'text-slate-700 group-hover:text-slate-400'}`}>{label}</span>
    </div>
);

export const ProfileInput: React.FC<{ label: string, value: any, unit: string }> = ({ label, value, unit }) => (
    <div className="space-y-3 group">
        <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest ml-2 group-focus-within:text-emerald-400">{label}</label>
        <div className="h-20 bg-white/5 border border-white/10 rounded-[32px] px-8 flex items-center justify-between transition-all"><span className="text-2xl font-black text-white">{value}</span><span className="text-[10px] font-bold text-slate-600 uppercase">{unit}</span></div>
    </div>
);
