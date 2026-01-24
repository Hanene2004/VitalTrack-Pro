import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Scale, Flame, Utensils, Zap } from 'lucide-react';

export const EnergyBalanceScale: React.FC<{ consumed: number, burned: number }> = ({ consumed, burned }) => {
    const net = consumed - burned;
    const balance = burned > 0 ? (consumed / burned) : 1;
    const pivotPos = Math.min(Math.max((balance - 1) * 50 + 50, 10), 90);

    return (
        <div className="glass-card rounded-[48px] p-10 bg-gradient-to-br from-slate-900 to-slate-950 border-white/5 relative overflow-hidden">
            <div className="flex justify-between items-center mb-10">
                <div>
                    <h3 className="text-2xl font-black text-white italic uppercase tracking-tighter">Energy Equilibrium</h3>
                    <p className="text-[10px] font-bold text-slate-500 uppercase tracking-widest">Real-time Biometric Balance</p>
                </div>
                <div className={`px-4 py-2 rounded-xl text-[10px] font-black uppercase tracking-widest border ${net > 100 ? 'bg-orange-500/10 text-orange-500 border-orange-500/20' : net < -100 ? 'bg-emerald-500/10 text-emerald-500 border-emerald-500/20' : 'bg-blue-500/10 text-blue-500 border-blue-500/20'}`}>
                    {net > 100 ? 'Energy Surplus' : net < -100 ? 'Dynamic Deficit' : 'Perfectly Balanced'}
                </div>
            </div>

            <div className="relative h-24 flex items-center px-12 mb-10">
                {/* Scale Line */}
                <div className="absolute inset-x-12 h-1 bg-white/5 rounded-full overflow-hidden">
                    <div className="absolute inset-0 bg-gradient-to-r from-emerald-500 via-blue-500 to-orange-500 opacity-40" />
                </div>

                {/* Icons */}
                <div className="absolute left-0 w-12 h-12 rounded-full bg-white/5 flex items-center justify-center text-emerald-500">
                    <Flame size={20} />
                </div>
                <div className="absolute right-0 w-12 h-12 rounded-full bg-white/5 flex items-center justify-center text-orange-500">
                    <Utensils size={20} />
                </div>

                {/* Pivot Pointer */}
                <motion.div
                    animate={{ left: `${pivotPos}%` }}
                    transition={{ type: 'spring', stiffness: 100, damping: 20 }}
                    className="absolute -top-4 -bottom-4 w-1 bg-white shadow-[0_0_20px_rgba(255,255,255,0.5)] z-10"
                >
                    <div className="absolute -bottom-8 left-1/2 -translate-x-1/2 whitespace-nowrap">
                        <span className="text-2xl font-black text-white">{Math.abs(net)}</span>
                        <span className="text-[10px] font-bold text-slate-600 uppercase ml-1">kcal {net > 0 ? 'Surplus' : 'Deficit'}</span>
                    </div>
                </motion.div>
            </div>

            <div className="grid grid-cols-2 gap-8 mt-12">
                <div className="p-6 bg-white/5 rounded-3xl border border-white/5">
                    <span className="text-[10px] font-black text-slate-500 uppercase block mb-2">Fuel Intake</span>
                    <div className="flex items-baseline gap-2 text-3xl font-black text-white">
                        {consumed} <span className="text-xs text-slate-700">KCAL</span>
                    </div>
                </div>
                <div className="p-6 bg-white/5 rounded-3xl border border-white/5">
                    <span className="text-[10px] font-black text-slate-500 uppercase block mb-2">Metabolic Burn</span>
                    <div className="flex items-baseline gap-2 text-3xl font-black text-white">
                        {burned} <span className="text-xs text-slate-700">KCAL</span>
                    </div>
                </div>
            </div>
        </div>
    );
};
