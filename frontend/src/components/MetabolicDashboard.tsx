import React from 'react';
import { motion } from 'framer-motion';
import {
    ResponsiveContainer, AreaChart, Area, XAxis, YAxis,
    CartesianGrid, Tooltip, BarChart, Bar
} from 'recharts';
import { Activity, Heart, Zap, Clock, Droplets } from 'lucide-react';

export const MetabolicDashboard: React.FC<{ metrics: any, recovery: number }> = ({ metrics, recovery }) => {
    const heartRateData = [
        { time: '06:00', hr: 62 }, { time: '09:00', hr: 75 }, { time: '12:00', hr: 88 },
        { time: '15:00', hr: 110 }, { time: '18:00', hr: 95 }, { time: '21:00', hr: 68 }
    ];

    return (
        <div className="space-y-8">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                <MetricCard label="VO2 Max" value={metrics?.vo2Max || 54} unit="ml/kg" icon={<Activity />} color="emerald" trend="+2.4%" />
                <MetricCard label="Recovery" value={recovery} unit="%" icon={<Clock />} color="blue" trend="Optimal" />
                <MetricCard label="Resting HR" value={metrics?.restingHeartRate || 58} unit="bpm" icon={<Heart />} color="rose" trend="-3bpm" />
                <MetricCard label="Hydration" value={metrics?.hydrationLevel || 88} unit="%" icon={<Droplets />} color="cyan" trend="Target hit" />
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                <div className="lg:col-span-2 glass-card rounded-[40px] p-8 border-white/5 bg-[#0f172a]/40">
                    <div className="flex justify-between items-center mb-8">
                        <h3 className="text-xl font-black text-white italic">Heart Rate Dynamics</h3>
                        <div className="px-4 py-2 bg-rose-500/10 rounded-xl border border-rose-500/20 text-rose-500 text-[10px] font-black uppercase tracking-widest">
                            Live Bio-Feed
                        </div>
                    </div>
                    <div className="h-[250px]">
                        <ResponsiveContainer width="100%" height="100%">
                            <AreaChart data={heartRateData}>
                                <defs>
                                    <linearGradient id="colorHR" x1="0" y1="0" x2="0" y2="1">
                                        <stop offset="5%" stopColor="#f43f5e" stopOpacity={0.3} />
                                        <stop offset="95%" stopColor="#f43f5e" stopOpacity={0} />
                                    </linearGradient>
                                </defs>
                                <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" vertical={false} />
                                <XAxis dataKey="time" stroke="#475569" fontSize={10} axisLine={false} tickLine={false} />
                                <Tooltip contentStyle={{ backgroundColor: '#0f172a', border: 'none', borderRadius: '12px', color: '#fff' }} />
                                <Area type="monotone" dataKey="hr" stroke="#f43f5e" fill="url(#colorHR)" strokeWidth={3} />
                            </AreaChart>
                        </ResponsiveContainer>
                    </div>
                </div>

                <div className="glass-card rounded-[40px] p-8 border-white/5 bg-gradient-to-b from-blue-600/10 to-transparent">
                    <h3 className="text-xl font-black text-white mb-6 italic">Metabolic Status</h3>
                    <div className="space-y-6">
                        <StatusBar label="Anaerobic Threshold" score={82} color="emerald" />
                        <StatusBar label="Lactate Clearance" score={64} color="blue" />
                        <StatusBar label="Lipid Metabolism" score={75} color="cyan" />
                        <div className="pt-4 mt-4 border-t border-white/5">
                            <p className="text-[10px] font-bold text-slate-500 uppercase tracking-widest mb-4">Training Load Score</p>
                            <div className="flex items-baseline gap-2">
                                <span className="text-5xl font-black text-white">{metrics?.trainingLoad === 'Optimal' ? '88' : '72'}</span>
                                <span className="text-xs font-black text-emerald-500 uppercase">Optimal Range</span>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

const MetricCard: React.FC<{ label: string, value: any, unit: string, icon: any, color: string, trend: string }> = ({ label, value, unit, icon, color, trend }) => (
    <motion.div whileHover={{ y: -5 }} className="glass-card rounded-[32px] p-6 border-white/5 bg-white/5 relative overflow-hidden group">
        <div className={`absolute top-0 right-0 p-6 opacity-5 group-hover:scale-110 transition-transform ${color === 'emerald' ? 'text-emerald-500' : color === 'blue' ? 'text-blue-500' : color === 'rose' ? 'text-rose-500' : 'text-cyan-500'}`}>
            {icon}
        </div>
        <p className="text-[10px] font-black text-slate-500 uppercase tracking-[0.2em] mb-3">{label}</p>
        <div className="flex items-baseline gap-2 mb-2">
            <span className="text-4xl font-black text-white">{value}</span>
            <span className="text-[10px] font-bold text-slate-600 uppercase">{unit}</span>
        </div>
        <div className={`text-[9px] font-black uppercase flex items-center gap-1 ${trend.includes('+') || trend === 'Optimal' ? 'text-emerald-500' : 'text-rose-500'}`}>
            {trend}
        </div>
    </motion.div>
);

const StatusBar: React.FC<{ label: string, score: number, color: string }> = ({ label, score, color }) => (
    <div className="space-y-2">
        <div className="flex justify-between items-center text-[10px] font-black uppercase tracking-widest">
            <span className="text-slate-500">{label}</span>
            <span className={color === 'emerald' ? 'text-emerald-400' : color === 'blue' ? 'text-blue-400' : 'text-cyan-400'}>{score}%</span>
        </div>
        <div className="h-1.5 w-full bg-white/5 rounded-full overflow-hidden">
            <motion.div
                initial={{ width: 0 }}
                animate={{ width: `${score}%` }}
                className={`h-full rounded-full ${color === 'emerald' ? 'bg-emerald-500' : color === 'blue' ? 'bg-blue-500' : 'bg-cyan-500'}`}
            />
        </div>
    </div>
);
