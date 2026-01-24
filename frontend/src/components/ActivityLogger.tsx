import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Dumbbell, Clock, Zap, Plus, X, ChevronRight } from 'lucide-react';
import { SportType } from '../models/types';
import { MET_VALUES, calculateCaloriesBurned } from '../shared/energy-engine';

export const ActivityLogger: React.FC<{ onAdd: (activity: any) => void, onCancel: () => void, weight: number }> = ({ onAdd, onCancel, weight }) => {
    const [type, setType] = useState<SportType>('Running');
    const [duration, setDuration] = useState(30);
    const [intensity, setIntensity] = useState<'Low' | 'Moderate' | 'Vigorous'>('Moderate');

    const kcalBurned = calculateCaloriesBurned(type, duration, intensity, weight);

    const sports: SportType[] = ['Running', 'Cycling', 'Swimming', 'Gym', 'Yoga', 'Football', 'Walking'];

    return (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
            <div className="space-y-10">
                <div className="space-y-6">
                    <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest ml-4">Activity Discipline</label>
                    <div className="grid grid-cols-3 gap-3">
                        {sports.map(s => (
                            <button
                                key={s}
                                onClick={() => setType(s)}
                                className={`py-4 px-2 rounded-2xl border text-[10px] font-black uppercase transition-all ${type === s ? 'bg-white text-slate-950 border-white shadow-xl' : 'bg-white/5 text-slate-500 border-white/5 hover:bg-white/10'}`}
                            >
                                {s}
                            </button>
                        ))}
                    </div>
                </div>

                <div className="space-y-6">
                    <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest ml-4">Intensity Spectrum</label>
                    <div className="flex gap-4">
                        {(['Low', 'Moderate', 'Vigorous'] as const).map(i => (
                            <button
                                key={i}
                                onClick={() => setIntensity(i)}
                                className={`flex-1 py-4 rounded-2xl border text-[10px] font-black uppercase transition-all ${intensity === i ? 'bg-blue-500 text-white border-blue-400 shadow-lg shadow-blue-500/20' : 'bg-white/5 text-slate-500 border-white/5 hover:bg-white/10'}`}
                            >
                                {i}
                            </button>
                        ))}
                    </div>
                </div>
            </div>

            <div className="glass-card bg-blue-500/10 border-blue-500/20 rounded-[40px] p-10 flex flex-col justify-between">
                <div className="space-y-8">
                    <div className="flex justify-between items-center">
                        <h4 className="text-xl font-black text-white italic">Neural Projection</h4>
                        <Zap className="text-blue-400 animate-pulse" size={24} />
                    </div>

                    <div className="space-y-4">
                        <div className="flex justify-between items-baseline">
                            <span className="text-slate-400 text-xs font-bold uppercase">Estimated Burn</span>
                            <span className="text-6xl font-black text-white">{kcalBurned}</span>
                        </div>
                        <p className="text-[10px] font-black text-blue-500 uppercase tracking-widest">Kcal Expenditure</p>
                    </div>

                    <div className="h-px bg-white/5" />

                    <div className="space-y-4">
                        <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest">Duration (Minutes)</label>
                        <input
                            type="range" min="10" max="180" step="5"
                            value={duration}
                            onChange={(e) => setDuration(parseInt(e.target.value))}
                            className="w-full h-2 bg-blue-900/50 rounded-lg appearance-none cursor-pointer accent-blue-500"
                        />
                        <div className="flex justify-between text-white font-black text-xl italic">
                            <span>{duration}</span>
                            <span className="text-slate-700 text-xs mt-1 uppercase">MIN</span>
                        </div>
                    </div>
                </div>

                <button
                    onClick={() => onAdd({ type, duration, intensity, caloriesBurned: kcalBurned, timestamp: Date.now() })}
                    className="w-full py-6 bg-blue-500 hover:bg-blue-600 text-white rounded-[30px] font-black uppercase text-xs tracking-widest flex items-center justify-center gap-3 transition-all active:scale-95"
                >
                    <span>Log Performance</span>
                    <ChevronRight size={18} />
                </button>
            </div>
        </div>
    );
};
