import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Edit2, Check, X, TrendingUp, Target, Award, Calendar, Download, Droplet } from 'lucide-react';
import { UserProfile } from '../models/types';
import { calculateBMR } from '../shared/energy-engine';

interface EnhancedProfileProps {
    profile: UserProfile;
    onUpdateProfile: (profile: UserProfile) => void;
    streak: number;
    totalMeals: number;
    totalActivities: number;
}

export const EnhancedProfile: React.FC<EnhancedProfileProps> = ({
    profile,
    onUpdateProfile,
    streak,
    totalMeals,
    totalActivities
}) => {
    const [isEditing, setIsEditing] = useState(false);
    const [editedProfile, setEditedProfile] = useState(profile);
    const [waterIntake, setWaterIntake] = useState(6); // glasses

    const bmr = calculateBMR(profile);
    const tdee = Math.round(bmr * 1.55); // Moderate activity multiplier

    const handleSave = () => {
        onUpdateProfile(editedProfile);
        setIsEditing(false);
    };

    const handleCancel = () => {
        setEditedProfile(profile);
        setIsEditing(false);
    };

    const exportData = () => {
        const data = {
            profile,
            stats: { streak, totalMeals, totalActivities },
            exportDate: new Date().toISOString()
        };
        const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `vitaltrack-profile-${new Date().toISOString().split('T')[0]}.json`;
        a.click();
    };

    return (
        <div className="space-y-12">
            {/* Header with Edit Button */}
            <div className="flex justify-between items-center">
                <div>
                    <h2 className="text-5xl font-black text-white italic">Mon Profil</h2>
                    <p className="text-slate-500 text-sm font-black uppercase tracking-widest mt-2">
                        Elite Performance Dashboard
                    </p>
                </div>
                <div className="flex gap-4">
                    <button
                        onClick={exportData}
                        className="px-6 py-3 bg-blue-600/20 border border-blue-500/30 rounded-2xl text-blue-500 font-black text-xs uppercase flex items-center gap-2 hover:bg-blue-600/30 transition-all"
                    >
                        <Download size={16} />
                        Export
                    </button>
                    {!isEditing ? (
                        <button
                            onClick={() => setIsEditing(true)}
                            className="px-6 py-3 bg-emerald-600/20 border border-emerald-500/30 rounded-2xl text-emerald-500 font-black text-xs uppercase flex items-center gap-2 hover:bg-emerald-600/30 transition-all"
                        >
                            <Edit2 size={16} />
                            Modifier
                        </button>
                    ) : (
                        <div className="flex gap-2">
                            <button
                                onClick={handleSave}
                                className="px-6 py-3 bg-emerald-500 rounded-2xl text-white font-black text-xs uppercase flex items-center gap-2 hover:bg-emerald-600 transition-all"
                            >
                                <Check size={16} />
                                Sauvegarder
                            </button>
                            <button
                                onClick={handleCancel}
                                className="px-6 py-3 bg-rose-600/20 border border-rose-500/30 rounded-2xl text-rose-500 font-black text-xs uppercase flex items-center gap-2 hover:bg-rose-600/30 transition-all"
                            >
                                <X size={16} />
                                Annuler
                            </button>
                        </div>
                    )}
                </div>
            </div>

            <div className="grid grid-cols-1 xl:grid-cols-12 gap-12">
                {/* Left Column - Profile Info */}
                <div className="xl:col-span-8 space-y-12">
                    {/* Bio Metrics */}
                    <div className="glass-card rounded-[60px] p-12 bg-white/5 border-white/10">
                        <h3 className="text-2xl font-black text-white mb-8 italic">Métriques Biologiques</h3>
                        <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
                            <div className="p-6 bg-white/5 rounded-3xl border border-white/10">
                                <label className="text-xs font-black text-slate-500 uppercase block mb-2">Poids</label>
                                {isEditing ? (
                                    <input
                                        type="number"
                                        value={editedProfile.weight}
                                        onChange={(e) => setEditedProfile({ ...editedProfile, weight: Number(e.target.value) })}
                                        className="w-full bg-white/10 border border-white/20 rounded-xl px-3 py-2 text-white font-black text-2xl focus:outline-none focus:border-emerald-500"
                                    />
                                ) : (
                                    <p className="text-3xl font-black text-white">{profile.weight}</p>
                                )}
                                <span className="text-xs text-slate-600 font-bold uppercase">KG</span>
                            </div>

                            <div className="p-6 bg-white/5 rounded-3xl border border-white/10">
                                <label className="text-xs font-black text-slate-500 uppercase block mb-2">Taille</label>
                                {isEditing ? (
                                    <input
                                        type="number"
                                        value={editedProfile.height}
                                        onChange={(e) => setEditedProfile({ ...editedProfile, height: Number(e.target.value) })}
                                        className="w-full bg-white/10 border border-white/20 rounded-xl px-3 py-2 text-white font-black text-2xl focus:outline-none focus:border-emerald-500"
                                    />
                                ) : (
                                    <p className="text-3xl font-black text-white">{profile.height}</p>
                                )}
                                <span className="text-xs text-slate-600 font-bold uppercase">CM</span>
                            </div>

                            <div className="p-6 bg-white/5 rounded-3xl border border-white/10">
                                <label className="text-xs font-black text-slate-500 uppercase block mb-2">Âge</label>
                                {isEditing ? (
                                    <input
                                        type="number"
                                        value={editedProfile.age}
                                        onChange={(e) => setEditedProfile({ ...editedProfile, age: Number(e.target.value) })}
                                        className="w-full bg-white/10 border border-white/20 rounded-xl px-3 py-2 text-white font-black text-2xl focus:outline-none focus:border-emerald-500"
                                    />
                                ) : (
                                    <p className="text-3xl font-black text-white">{profile.age}</p>
                                )}
                                <span className="text-xs text-slate-600 font-bold uppercase">ANS</span>
                            </div>

                            <div className="p-6 bg-white/5 rounded-3xl border border-white/10">
                                <label className="text-xs font-black text-slate-500 uppercase block mb-2">Genre</label>
                                {isEditing ? (
                                    <select
                                        value={editedProfile.gender}
                                        onChange={(e) => setEditedProfile({ ...editedProfile, gender: e.target.value as 'male' | 'female' })}
                                        className="w-full bg-white/10 border border-white/20 rounded-xl px-3 py-2 text-white font-black text-xl focus:outline-none focus:border-emerald-500"
                                    >
                                        <option value="male">Homme</option>
                                        <option value="female">Femme</option>
                                    </select>
                                ) : (
                                    <p className="text-3xl font-black text-white">{profile.gender === 'male' ? '♂' : '♀'}</p>
                                )}
                            </div>
                        </div>
                    </div>

                    {/* BMR/TDEE Calculator */}
                    <div className="glass-card rounded-[60px] p-12 bg-gradient-to-br from-blue-600/10 to-cyan-600/10 border-blue-500/20">
                        <div className="flex items-center gap-3 mb-8">
                            <TrendingUp size={24} className="text-blue-500" />
                            <h3 className="text-2xl font-black text-white italic">Métabolisme Basal</h3>
                        </div>
                        <div className="grid grid-cols-2 gap-8">
                            <div className="p-8 bg-white/5 rounded-3xl border border-white/10">
                                <p className="text-xs font-black text-slate-500 uppercase mb-3">BMR (Repos)</p>
                                <p className="text-5xl font-black text-blue-500">{Math.round(bmr)}</p>
                                <p className="text-xs text-slate-600 font-bold uppercase mt-2">kcal/jour</p>
                            </div>
                            <div className="p-8 bg-white/5 rounded-3xl border border-white/10">
                                <p className="text-xs font-black text-slate-500 uppercase mb-3">TDEE (Actif)</p>
                                <p className="text-5xl font-black text-emerald-500">{tdee}</p>
                                <p className="text-xs text-slate-600 font-bold uppercase mt-2">kcal/jour</p>
                            </div>
                        </div>
                        <p className="text-xs text-blue-200 italic mt-6">
                            Votre métabolisme de base (BMR) représente l'énergie nécessaire au repos. Le TDEE inclut vos activités quotidiennes.
                        </p>
                    </div>

                    {/* Water Intake Tracker */}
                    <div className="glass-card rounded-[60px] p-12 bg-gradient-to-br from-cyan-600/10 to-blue-600/10 border-cyan-500/20">
                        <div className="flex items-center gap-3 mb-8">
                            <Droplet size={24} className="text-cyan-500" />
                            <h3 className="text-2xl font-black text-white italic">Hydratation</h3>
                        </div>
                        <div className="flex items-center gap-6 mb-6">
                            {[...Array(8)].map((_, i) => (
                                <motion.button
                                    key={i}
                                    whileHover={{ scale: 1.1 }}
                                    whileTap={{ scale: 0.95 }}
                                    onClick={() => setWaterIntake(i + 1)}
                                    className={`w-12 h-16 rounded-2xl border-2 transition-all ${i < waterIntake
                                            ? 'bg-cyan-500 border-cyan-400 shadow-lg shadow-cyan-500/30'
                                            : 'bg-white/5 border-white/10'
                                        }`}
                                >
                                    <Droplet size={20} className={i < waterIntake ? 'text-white mx-auto' : 'text-slate-700 mx-auto'} />
                                </motion.button>
                            ))}
                        </div>
                        <p className="text-sm text-cyan-200">
                            <span className="font-black">{waterIntake}</span> / 8 verres aujourd'hui
                            <span className="text-xs text-slate-500 ml-2">({waterIntake * 250}ml / 2000ml)</span>
                        </p>
                    </div>
                </div>

                {/* Right Column - Stats & Records */}
                <div className="xl:col-span-4 space-y-12">
                    {/* Quick Stats */}
                    <div className="glass-card rounded-[60px] p-10 bg-gradient-to-br from-purple-600/10 to-pink-600/10 border-purple-500/20">
                        <div className="flex items-center gap-3 mb-8">
                            <Award size={24} className="text-purple-500" />
                            <h3 className="text-xl font-black text-white italic">Statistiques</h3>
                        </div>
                        <div className="space-y-6">
                            <div className="flex items-center justify-between p-4 bg-white/5 rounded-2xl">
                                <div className="flex items-center gap-3">
                                    <div className="w-10 h-10 rounded-xl bg-amber-500/20 flex items-center justify-center">
                                        <Calendar size={20} className="text-amber-500" />
                                    </div>
                                    <span className="text-sm font-bold text-slate-400 uppercase">Streak</span>
                                </div>
                                <span className="text-2xl font-black text-white">{streak} jours</span>
                            </div>

                            <div className="flex items-center justify-between p-4 bg-white/5 rounded-2xl">
                                <div className="flex items-center gap-3">
                                    <div className="w-10 h-10 rounded-xl bg-emerald-500/20 flex items-center justify-center">
                                        <Target size={20} className="text-emerald-500" />
                                    </div>
                                    <span className="text-sm font-bold text-slate-400 uppercase">Repas</span>
                                </div>
                                <span className="text-2xl font-black text-white">{totalMeals}</span>
                            </div>

                            <div className="flex items-center justify-between p-4 bg-white/5 rounded-2xl">
                                <div className="flex items-center gap-3">
                                    <div className="w-10 h-10 rounded-xl bg-blue-500/20 flex items-center justify-center">
                                        <TrendingUp size={20} className="text-blue-500" />
                                    </div>
                                    <span className="text-sm font-bold text-slate-400 uppercase">Activités</span>
                                </div>
                                <span className="text-2xl font-black text-white">{totalActivities}</span>
                            </div>
                        </div>
                    </div>

                    {/* Personal Records */}
                    <div className="glass-card rounded-[60px] p-10 bg-white/5 border-white/10">
                        <h3 className="text-xl font-black text-white mb-6 italic">Records Personnels</h3>
                        <div className="space-y-4">
                            <div className="p-4 bg-gradient-to-r from-emerald-500/10 to-emerald-500/5 border border-emerald-500/20 rounded-2xl">
                                <p className="text-xs font-black text-emerald-500 uppercase mb-1">Plus longue activité</p>
                                <p className="text-2xl font-black text-white">60 min</p>
                                <p className="text-xs text-slate-600">Running - Hier</p>
                            </div>

                            <div className="p-4 bg-gradient-to-r from-blue-500/10 to-blue-500/5 border border-blue-500/20 rounded-2xl">
                                <p className="text-xs font-black text-blue-500 uppercase mb-1">Plus de protéines</p>
                                <p className="text-2xl font-black text-white">92g</p>
                                <p className="text-xs text-slate-600">Hier</p>
                            </div>

                            <div className="p-4 bg-gradient-to-r from-amber-500/10 to-amber-500/5 border border-amber-500/20 rounded-2xl">
                                <p className="text-xs font-black text-amber-500 uppercase mb-1">Meilleur streak</p>
                                <p className="text-2xl font-black text-white">{streak} jours</p>
                                <p className="text-xs text-slate-600">En cours !</p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};
