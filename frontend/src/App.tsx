
import React, { useState, useEffect, useMemo, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Leaf, Utensils, CloudUpload, Settings, Plus, X,
  TrendingUp, Zap, Target, Sparkles,
  ChevronRight, Camera, CheckCircle2, Mic, MicOff,
  User, Award, AlertTriangle, BarChart3, History,
  Flame, Trophy, Info, Save, ChevronDown
} from 'lucide-react';
import confetti from 'canvas-confetti';
import { Meal, MealType, UserProfile, Achievement } from './models/types';
import { calculateDailySummary, formatNumber } from './shared/utils';
import { NutritionRadar, CalorieTrend } from './components/Charts';
import { PerformanceCoach } from './components/PerformanceCoach';
import { MetabolicDashboard } from './components/MetabolicDashboard';
import { EnergyBalanceScale } from './components/EnergyBalanceScale';
import { ActivityLogger } from './components/ActivityLogger';
import { calculateBMR } from './shared/energy-engine';
import {
  ProStat, InsightGauge, MacroRow, NavIcon, ProfileInput
} from './components/UIComponents';
import { CoherenceScore } from './components/CoherenceScore';
import { RiskDayAlerts } from './components/RiskDayAlerts';
import { MicroImprovements } from './components/MicroImprovements';
import { HeroCarousel } from './components/HeroCarousel';
import { EnhancedProfile } from './components/EnhancedProfile';
import { CameraCapture } from './components/CameraCapture';
import { Dumbbell, HeartPulse, Timer, Zap as ZapIcon, Scale, Activity as ActivityIcon } from 'lucide-react';

const SAMPLE_PROFILE: UserProfile = {
  age: 28,
  weight: 75,
  height: 180,
  gender: 'male',
  goal: 'longevity',
  dietaryPref: 'balanced'
};

const getDateOffset = (daysAgo: number) => {
  const date = new Date();
  date.setDate(date.getDate() - daysAgo);
  return date.toISOString().split('T')[0];
};

const DEMO_MEALS: Meal[] = [
  // Today - Good balance
  {
    id: 'm1',
    date: getDateOffset(0),
    type: 'Breakfast',
    description: 'Omelette aux légumes et toast complet',
    ingredients: [
      { name: 'Oeufs', quantity: '3', unit: 'pcs', calories: 210, protein: 18, carbs: 2, fat: 15 },
      { name: 'Pain complet', quantity: '2', unit: 'tranches', calories: 160, protein: 6, carbs: 30, fat: 2 },
      { name: 'Avocat', quantity: '0.5', unit: 'pcs', calories: 120, protein: 1, carbs: 6, fat: 11 }
    ],
    timestamp: Date.now() - 3 * 60 * 60 * 1000
  },
  {
    id: 'm2',
    date: getDateOffset(0),
    type: 'Lunch',
    description: 'Poulet grillé avec quinoa et brocoli',
    ingredients: [
      { name: 'Poulet', quantity: '150', unit: 'g', calories: 250, protein: 45, carbs: 0, fat: 5 },
      { name: 'Quinoa', quantity: '100', unit: 'g', calories: 180, protein: 8, carbs: 32, fat: 3 },
      { name: 'Brocoli', quantity: '150', unit: 'g', calories: 50, protein: 4, carbs: 10, fat: 0 }
    ],
    timestamp: Date.now() - 1 * 60 * 60 * 1000
  },
  // Yesterday - High activity day
  {
    id: 'm3',
    date: getDateOffset(1),
    type: 'Breakfast',
    description: 'Smoothie protéiné et banane',
    ingredients: [
      { name: 'Whey protein', quantity: '30', unit: 'g', calories: 120, protein: 25, carbs: 3, fat: 1 },
      { name: 'Banane', quantity: '1', unit: 'pcs', calories: 105, protein: 1, carbs: 27, fat: 0 },
      { name: 'Lait amande', quantity: '250', unit: 'ml', calories: 40, protein: 1, carbs: 2, fat: 3 }
    ],
    timestamp: Date.now() - 27 * 60 * 60 * 1000
  },
  {
    id: 'm4',
    date: getDateOffset(1),
    type: 'Lunch',
    description: 'Salade de thon et légumes',
    ingredients: [
      { name: 'Thon', quantity: '120', unit: 'g', calories: 140, protein: 30, carbs: 0, fat: 2 },
      { name: 'Salade verte', quantity: '100', unit: 'g', calories: 20, protein: 2, carbs: 4, fat: 0 },
      { name: 'Tomates', quantity: '100', unit: 'g', calories: 18, protein: 1, carbs: 4, fat: 0 }
    ],
    timestamp: Date.now() - 24 * 60 * 60 * 1000
  },
  {
    id: 'm5',
    date: getDateOffset(1),
    type: 'Dinner',
    description: 'Saumon avec patate douce',
    ingredients: [
      { name: 'Saumon', quantity: '150', unit: 'g', calories: 300, protein: 30, carbs: 0, fat: 18 },
      { name: 'Patate douce', quantity: '200', unit: 'g', calories: 180, protein: 2, carbs: 41, fat: 0 }
    ],
    timestamp: Date.now() - 20 * 60 * 60 * 1000
  },
  // 2 days ago - Sedentary day with heavy eating (risk day)
  {
    id: 'm6',
    date: getDateOffset(2),
    type: 'Breakfast',
    description: 'Croissants et chocolat chaud',
    ingredients: [
      { name: 'Croissants', quantity: '2', unit: 'pcs', calories: 460, protein: 8, carbs: 46, fat: 26 },
      { name: 'Chocolat chaud', quantity: '1', unit: 'cup', calories: 200, protein: 8, carbs: 30, fat: 6 }
    ],
    timestamp: Date.now() - 51 * 60 * 60 * 1000
  },
  {
    id: 'm7',
    date: getDateOffset(2),
    type: 'Lunch',
    description: 'Pizza margherita',
    ingredients: [
      { name: 'Pizza', quantity: '3', unit: 'slices', calories: 900, protein: 36, carbs: 108, fat: 36 }
    ],
    timestamp: Date.now() - 48 * 60 * 60 * 1000
  },
  {
    id: 'm8',
    date: getDateOffset(2),
    type: 'Dinner',
    description: 'Burger frites',
    ingredients: [
      { name: 'Burger', quantity: '1', unit: 'pcs', calories: 540, protein: 25, carbs: 40, fat: 30 },
      { name: 'Frites', quantity: '150', unit: 'g', calories: 450, protein: 6, carbs: 63, fat: 20 }
    ],
    timestamp: Date.now() - 44 * 60 * 60 * 1000
  },
  // 3 days ago - Good day
  {
    id: 'm9',
    date: getDateOffset(3),
    type: 'Breakfast',
    description: 'Flocons d\'avoine et fruits',
    ingredients: [
      { name: 'Avoine', quantity: '60', unit: 'g', calories: 220, protein: 8, carbs: 40, fat: 4 },
      { name: 'Myrtilles', quantity: '100', unit: 'g', calories: 57, protein: 1, carbs: 14, fat: 0 }
    ],
    timestamp: Date.now() - 75 * 60 * 60 * 1000
  },
  {
    id: 'm10',
    date: getDateOffset(3),
    type: 'Lunch',
    description: 'Riz complet et poulet curry',
    ingredients: [
      { name: 'Riz complet', quantity: '150', unit: 'g', calories: 195, protein: 5, carbs: 41, fat: 2 },
      { name: 'Poulet curry', quantity: '150', unit: 'g', calories: 280, protein: 40, carbs: 8, fat: 10 }
    ],
    timestamp: Date.now() - 72 * 60 * 60 * 1000
  }
];

const DEMO_ACTIVITIES = [
  // Today - Moderate activity
  {
    id: 'a1',
    date: getDateOffset(0),
    type: 'Running',
    duration: 35,
    intensity: 'Moderate',
    caloriesBurned: 350,
    timestamp: Date.now() - 5 * 60 * 60 * 1000
  },
  // Yesterday - High intensity (risk day - high activity, low fuel)
  {
    id: 'a2',
    date: getDateOffset(1),
    type: 'Running',
    duration: 60,
    intensity: 'Vigorous',
    caloriesBurned: 650,
    timestamp: Date.now() - 22 * 60 * 60 * 1000
  },
  {
    id: 'a3',
    date: getDateOffset(1),
    type: 'Gym',
    duration: 45,
    intensity: 'Vigorous',
    caloriesBurned: 380,
    timestamp: Date.now() - 28 * 60 * 60 * 1000
  },
  // 2 days ago - No activity (risk day - sedentary + heavy eating)
  // 3 days ago - Light activity
  {
    id: 'a4',
    date: getDateOffset(3),
    type: 'Yoga',
    duration: 30,
    intensity: 'Low',
    caloriesBurned: 90,
    timestamp: Date.now() - 70 * 60 * 60 * 1000
  },
  // 4 days ago - Good balance
  {
    id: 'a5',
    date: getDateOffset(4),
    type: 'Cycling',
    duration: 40,
    intensity: 'Moderate',
    caloriesBurned: 320,
    timestamp: Date.now() - 94 * 60 * 60 * 1000
  }
];

const ACHIEVEMENTS_LIST: Achievement[] = [
  { id: '1', title: 'Streak Master', icon: '🔥', unlockedAt: Date.now() - 5 * 24 * 60 * 60 * 1000 },
  { id: '2', title: 'Protein King', icon: '🥩', unlockedAt: Date.now() - 2 * 24 * 60 * 60 * 1000 },
  { id: '3', title: 'Vitamin Scout', icon: '🥝', unlockedAt: 0 },
  { id: '4', title: 'Hydration Hero', icon: '💧', unlockedAt: 0 },
  { id: '5', title: 'Iron Will', icon: '💪', unlockedAt: Date.now() - 10 * 24 * 60 * 60 * 1000 },
  { id: '6', title: 'Balance Master', icon: '⚖️', unlockedAt: 0 },
  { id: '7', title: 'Early Bird', icon: '🌅', unlockedAt: Date.now() - 1 * 24 * 60 * 60 * 1000 },
  { id: '8', title: 'Consistency Champion', icon: '🏆', unlockedAt: 0 }
];

const App: React.FC = () => {
  const [meals, setMeals] = useState<Meal[]>(DEMO_MEALS);
  const [profile, setProfile] = useState<UserProfile>(SAMPLE_PROFILE);
  const [streak, setStreak] = useState(5);
  const [achievements, setAchievements] = useState<Achievement[]>(ACHIEVEMENTS_LIST);
  const [activeTab, setActiveTab] = useState<'overview' | 'meals' | 'awards' | 'profile' | 'performance'>('overview');

  // Elite Sport State
  const [workouts, setWorkouts] = useState<any[]>([]);
  const [performanceAdvice, setPerformanceAdvice] = useState<any>(null);
  const [recoveryScore, setRecoveryScore] = useState(88);

  // Ultra Sport State
  const [activities, setActivities] = useState<any[]>(DEMO_ACTIVITIES);
  const [energyAnalysis, setEnergyAnalysis] = useState<any>(null);
  const [showSportEntry, setShowSportEntry] = useState(false);
  const [whatIfResponse, setWhatIfResponse] = useState<any>(null);

  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [showEntry, setShowEntry] = useState(false);
  const [isRecording, setIsRecording] = useState(false);
  const [showCamera, setShowCamera] = useState(false);
  const [aiInsight, setAiInsight] = useState<{ score: number, insight: string, trend: string } | null>(null);
  const [anomalies, setAnomalies] = useState<string[]>([]);

  // Advanced Intelligence State
  const [coherenceScore, setCoherenceScore] = useState<any>(null);
  const [riskDays, setRiskDays] = useState<any[]>([]);
  const [microImprovements, setMicroImprovements] = useState<any[]>([]);
  const [viewMode, setViewMode] = useState<'full' | 'minimalist'>('full');

  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    const saved = localStorage.getItem('vitaltrack_pro_data');
    if (saved) {
      const data = JSON.parse(saved);
      if (data.meals) setMeals(data.meals);
      if (data.profile) setProfile(data.profile);
      if (data.streak) setStreak(data.streak);
      if (data.activities) setActivities(data.activities);
    }
    // Demo data is already set in useState, so we only override if saved data exists
  }, []);

  useEffect(() => {
    localStorage.setItem('vitaltrack_pro_data', JSON.stringify({ meals, profile, streak, activities }));
    if (meals.length > 0) {
      fetchPatterns();
      fetchCoherenceScore();
      fetchRiskDays();
      fetchMicroImprovements();
    }
    if (activities.length > 0) fetchEnergyAnalysis();
  }, [meals, activities]);

  useEffect(() => {
    if (activeTab === 'performance' && !performanceAdvice) {
      fetchPerformanceAdvice();
    }
  }, [activeTab]);

  const summary = useMemo(() => calculateDailySummary(meals), [meals]);

  const fetchPatterns = async () => {
    try {
      const response = await fetch('/api/predict-trends', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ meals, energyBalance: energyAnalysis })
      });
      const data = await response.json();
      setAiInsight({ score: data.score_next_week, insight: data.projection, trend: "Positive" });
    } catch (e) {
      console.error("Pattern detection failed", e);
    }
  };

  const fetchCoherenceScore = async () => {
    try {
      const response = await fetch('/api/coherence-score', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ meals, activities })
      });
      const data = await response.json();
      setCoherenceScore(data);
    } catch (e) {
      console.error("Coherence score failed", e);
    }
  };

  const fetchRiskDays = async () => {
    try {
      const response = await fetch('/api/detect-risk-days', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ meals, activities, today: new Date().toISOString().split('T')[0] })
      });
      const data = await response.json();
      setRiskDays(data.risk_days || []);
    } catch (e) {
      console.error("Risk detection failed", e);
    }
  };

  const fetchMicroImprovements = async () => {
    try {
      const current = {
        avg_activity_minutes: activities.reduce((sum, a) => sum + (a.duration || 0), 0) / Math.max(1, activities.length),
        avg_protein_training_days: 120,
        meals_per_day: meals.length / 7
      };
      const historical = {
        avg_activity_minutes: 25,
        avg_protein_training_days: 100,
        meals_per_day: 2.5
      };
      const response = await fetch('/api/micro-improvements', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ current, historical })
      });
      const data = await response.json();
      setMicroImprovements(data.improvements || []);
    } catch (e) {
      console.error("Micro improvements failed", e);
    }
  };

  const fetchPerformanceAdvice = async () => {
    try {
      const response = await fetch('/api/performance-coach', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ recoveryScore, workouts })
      });
      const data = await response.json();
      setPerformanceAdvice(data);
    } catch (e) {
      setPerformanceAdvice({
        coach_directive: "Elevate hydration levels. Metabolic data suggests slight electrolyte deficiency.",
        next_optimal_workout: "HIIT Precision",
        nutrient_recommendation: "Electrolyte Surge"
      });
    }
  };

  const fetchEnergyAnalysis = async () => {
    try {
      const response = await fetch('/api/energy-analysis', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ activities, meals, today: new Date().toISOString().split('T')[0] })
      });
      const data = await response.json();
      setEnergyAnalysis(data);
    } catch (e) {
      console.error("Energy analysis failed", e);
    }
  };

  const runWhatIfAction = async (addedKcal: number) => {
    try {
      const state = { activities, meals, energyBalance: energyAnalysis };
      const response = await fetch('/api/sport-what-if', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ scenario: { kcal: addedKcal }, state })
      });
      const data = await response.json();
      setWhatIfResponse(data);
    } catch (e) {
      console.error("What-If simulation failed", e);
    }
  };

  const currentBurnedToday = useMemo(() => {
    const today = new Date().toISOString().split('T')[0];
    const bmr = calculateBMR(profile);
    const activityBurn = activities
      .filter(a => a.date === today || new Date(a.timestamp).toISOString().split('T')[0] === today)
      .reduce((sum, a) => sum + a.caloriesBurned, 0);
    return Math.round(bmr + activityBurn);
  }, [activities, profile]);

  const currentNet = useMemo(() => summary.totalCalories - currentBurnedToday, [summary, currentBurnedToday]);

  const addActivity = (activity: any) => {
    const newActivity = {
      ...activity,
      id: Math.random().toString(36).substr(2, 9),
      date: new Date().toISOString().split('T')[0]
    };
    setActivities([newActivity, ...activities]);
    setShowSportEntry(false);
  };

  const addMeal = async (description: string, type: MealType) => {
    setIsAnalyzing(true);
    setAnomalies([]);
    try {
      const response = await fetch('/api/analyze-meal', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ description })
      });
      const aiData = await response.json();

      const newMeal: Meal = {
        id: Math.random().toString(36).substr(2, 9),
        date: new Date().toISOString().split('T')[0],
        type,
        description,
        ingredients: aiData.ingredients,
        timestamp: Date.now()
      };

      setMeals([newMeal, ...meals]);
      if (aiData.anomalies) setAnomalies(aiData.anomalies);
      setShowEntry(false);

      if (summary.balanceScore > 75) {
        confetti({ particleCount: 150, spread: 70, origin: { y: 0.6 }, colors: ['#10b981', '#3b82f6', '#ffffff'] });
      }
    } catch (error) {
      console.error("AI Analysis failed", error);
    } finally {
      setIsAnalyzing(false);
    }
  };

  const toggleVoice = () => {
    setIsRecording(!isRecording);
    if (!isRecording) {
      setTimeout(async () => {
        const transcript = "Grilled Salmon with Lemon and Quinoa Salad";
        if (inputRef.current) inputRef.current.value = transcript;
        setIsRecording(false);
        addMeal(transcript, 'Lunch');
      }, 3000);
    }
  };

  const handleCameraCapture = async (imageData: string) => {
    setShowCamera(false);
    setIsAnalyzing(true);
    try {
      // Convert base64 to blob for upload
      const base64Data = imageData.split(',')[1];
      const response = await fetch('/api/analyze-image', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ image_b64: base64Data })
      });
      const aiData = await response.json();

      const newMeal: Meal = {
        id: Math.random().toString(36).substr(2, 9),
        date: new Date().toISOString().split('T')[0],
        type: 'Lunch',
        description: aiData.detected_dish || 'Repas scanné',
        ingredients: aiData.ingredients || [],
        timestamp: Date.now()
      };

      setMeals([newMeal, ...meals]);
      if (summary.balanceScore > 75) {
        confetti({ particleCount: 150, spread: 70, origin: { y: 0.6 }, colors: ['#10b981', '#3b82f6', '#ffffff'] });
      }
    } catch (error) {
      console.error("Camera analysis failed", error);
    } finally {
      setIsAnalyzing(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#020617] text-slate-200 selection:bg-emerald-500/30 overflow-x-hidden font-sans">
      <motion.div animate={{ scale: [1, 1.2, 1], opacity: [0.1, 0.15, 0.1], x: [0, 100, 0] }} transition={{ duration: 15, repeat: Infinity, ease: "linear" }} className="fixed top-[-20%] left-[-20%] w-[60%] h-[60%] bg-emerald-600/20 blur-[180px] rounded-full z-0 pointer-events-none" />
      <motion.div animate={{ scale: [1.3, 1, 1.3], opacity: [0.1, 0.2, 0.1], x: [0, -100, 0] }} transition={{ duration: 18, repeat: Infinity, ease: "linear" }} className="fixed bottom-[-20%] right-[-20%] w-[60%] h-[60%] bg-blue-600/20 blur-[180px] rounded-full z-0 pointer-events-none" />

      <nav className="fixed left-0 top-0 bottom-0 w-28 bg-[#0f172a]/40 backdrop-blur-3xl border-r border-white/5 flex flex-col items-center py-12 gap-10 z-50">
        <motion.div whileHover={{ rotate: 180, scale: 1.15 }} className="w-16 h-16 vitality-gradient rounded-[24px] flex items-center justify-center text-white shadow-[0_0_50px_rgba(16,185,129,0.5)] cursor-pointer">
          <Leaf size={32} />
        </motion.div>

        <div className="flex flex-col gap-8 mt-4">
          <NavIcon icon={<BarChart3 size={24} />} active={activeTab === 'overview'} onClick={() => setActiveTab('overview')} label="Insight" testId="nav-insight" />
          <NavIcon icon={<Dumbbell size={24} />} active={activeTab === 'performance'} onClick={() => setActiveTab('performance')} label="Elite" testId="nav-performance" />
          <NavIcon icon={<History size={24} />} active={activeTab === 'meals'} onClick={() => setActiveTab('meals')} label="Logs" testId="nav-logs" />
          <NavIcon icon={<Award size={24} />} active={activeTab === 'awards'} onClick={() => setActiveTab('awards')} label="Awards" testId="nav-awards" />
          <NavIcon icon={<User size={24} />} active={activeTab === 'profile'} onClick={() => setActiveTab('profile')} label="Pro" testId="nav-profile" />
        </div>

        <div className="mt-auto flex flex-col items-center gap-6">
          <div className="flex flex-col items-center gap-1 group">
            <div className="w-12 h-12 rounded-full bg-white/5 border border-white/10 flex items-center justify-center text-amber-500 overflow-hidden relative">
              <Flame size={20} className="relative z-10" />
              <motion.div animate={{ y: [0, -2, 0] }} transition={{ repeat: Infinity, duration: 1 }} className="absolute inset-0 bg-amber-500/20" />
            </div>
            <span className="text-[10px] font-black text-white">{streak}d</span>
          </div>
        </div>
      </nav>

      <motion.main initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="pl-40 pr-16 py-16 max-w-[1800px] mx-auto relative z-10">
        <header className="flex flex-col lg:flex-row justify-between items-start lg:items-end mb-24 gap-12">
          <div className="space-y-4">
            <h1 className="text-7xl font-black tracking-tighter text-white">Vital<span className="text-emerald-500">Track</span> <span className="text-slate-500 font-light opacity-50">PRO</span></h1>
            <p className="text-slate-400 text-lg font-medium max-w-xl leading-relaxed">Autonomous nutritional intelligence for high-performance longevity.</p>
          </div>
          <div className="flex gap-6">
            <motion.button whileHover={{ scale: 1.05, y: -2 }} whileTap={{ scale: 0.95 }} onClick={() => setShowEntry(true)} className="premium-btn px-10 py-6 rounded-[32px] text-white font-black uppercase text-xs tracking-[0.2em] flex items-center gap-4 group shadow-[0_20px_40px_-10px_rgba(16,185,129,0.3)]">
              <Plus size={22} className="group-hover:rotate-90 transition-transform duration-500" /> Meal
            </motion.button>
            <motion.button whileHover={{ scale: 1.05, y: -2 }} whileTap={{ scale: 0.95 }} onClick={() => setShowSportEntry(true)} className="bg-blue-600 hover:bg-blue-500 px-10 py-6 rounded-[32px] text-white font-black uppercase text-xs tracking-[0.2em] flex items-center gap-4 shadow-[0_20px_40px_-10px_rgba(59,130,246,0.3)]">
              <Dumbbell size={22} /> Sport
            </motion.button>
            <motion.button whileHover={{ scale: 1.05, y: -2 }} whileTap={{ scale: 0.95 }} onClick={() => setShowCamera(true)} className="bg-purple-600 hover:bg-purple-500 px-10 py-6 rounded-[32px] text-white font-black uppercase text-xs tracking-[0.2em] flex items-center gap-4 shadow-[0_20px_40px_-10px_rgba(147,51,234,0.3)]">
              <Camera size={22} /> Photo
            </motion.button>
            <button onClick={toggleVoice} className={`w-20 h-20 rounded-[32px] flex items-center justify-center transition-all duration-500 border shadow-2xl ${isRecording ? 'bg-rose-500 border-rose-400 text-white animate-pulse' : 'bg-white/5 border-white/10 text-slate-400 hover:border-emerald-500/50 hover:text-white'}`}>
              {isRecording ? <MicOff size={28} /> : <Mic size={28} />}
            </button>
          </div>
        </header>

        <AnimatePresence mode="wait">
          {activeTab === 'overview' && (
            <motion.div key="overview" initial={{ opacity: 0, scale: 0.98 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, x: -20 }} className="space-y-12">
              <HeroCarousel />
              <div className="grid grid-cols-1 xl:grid-cols-12 gap-12">
                <div className="xl:col-span-8 space-y-12">
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                    <ProStat label="Bio-Balance" value={summary.balanceScore} icon={<Zap />} color="emerald" sub="Score Multiplier 1.2x" />
                    <ProStat label="Energy Balance" value={currentNet} icon={<Scale />} color={currentNet > 0 ? "orange" : "emerald"} sub={currentNet > 0 ? "Surplus Mode" : "Deficit mode"} />
                    <ProStat label="Fiber Meta" value={22} icon={<Sparkles />} color="blue" sub="Optimal levels" />
                  </div>
                  <EnergyBalanceScale consumed={summary.totalCalories} burned={currentBurnedToday} />
                  <div className="glass-card rounded-[60px] p-16 relative overflow-hidden group border-white/10">
                    <div className="flex justify-between items-start mb-16 relative z-10">
                      <div className="space-y-4">
                        <h3 className="text-3xl font-black text-white italic">Molecular Synthesis</h3>
                        <p className="text-sm font-black text-slate-500 uppercase tracking-widest">Live Bio-Feed Radar</p>
                      </div>
                    </div>
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-20 items-center">
                      <NutritionRadar meals={meals} />
                      <div className="space-y-10">
                        <InsightGauge label="Protein Satiety" progress={Math.min(100, (summary.totalProtein / 120) * 100)} color="emerald" />
                        <InsightGauge label="Insulin Sensitivity" progress={82} color="blue" />
                        <InsightGauge label="Lipid Oxidation" progress={64} color="amber" />
                        <div className="pt-6 border-t border-white/5 space-y-4">
                          {anomalies.map((a, i) => (
                            <motion.div key={i} animate={{ x: [0, 5, 0] }} className="p-4 bg-amber-500/10 border border-amber-500/20 rounded-2xl flex gap-3 items-center">
                              <AlertTriangle size={16} className="text-amber-500" />
                              <span className="text-xs font-bold text-amber-200">{a}</span>
                            </motion.div>
                          ))}
                        </div>
                      </div>
                    </div>
                  </div>
                  <div className="glass-card rounded-[50px] p-12 bg-[#020617]/40">
                    <CalorieTrend meals={meals} />
                  </div>

                  {coherenceScore && <CoherenceScore score={coherenceScore} />}
                  {riskDays.length > 0 && <RiskDayAlerts riskDays={riskDays} />}
                </div>

                <div className="xl:col-span-4 space-y-12">
                  <motion.div whileHover={{ y: -5 }} className="glass-card rounded-[60px] p-12 bg-blue-600 shadow-[0_45px_100px_rgba(59,130,246,0.5)] border-none relative overflow-hidden group cursor-pointer">
                    <History className="text-white/40 mb-10" size={56} />
                    <h2 className="text-4xl font-black text-white leading-[1.1] mb-10 italic">"{aiInsight?.insight || "Your current trajectory builds elite metabolic resilience."}"</h2>
                    <div className="bg-white/10 backdrop-blur-3xl rounded-3xl p-8 border border-white/20">
                      <div className="flex justify-between items-baseline">
                        <span className="text-white font-black text-5xl">{aiInsight?.score || 88}%</span>
                        <span className="text-blue-200 font-black text-xs uppercase tracking-widest">Expected Score</span>
                      </div>
                    </div>
                  </motion.div>

                  <div className="glass-card rounded-[50px] p-10 bg-gradient-to-br from-purple-600/10 to-pink-600/10 border-purple-500/20">
                    <div className="flex items-center gap-3 mb-8">
                      <Sparkles size={24} className="text-purple-500" />
                      <h3 className="text-xl font-black text-white italic">AI Recommendations</h3>
                    </div>
                    <div className="space-y-4">
                      <div className="p-6 bg-white/5 rounded-2xl border border-white/5">
                        <div className="flex items-start gap-3">
                          <div className="w-8 h-8 rounded-full bg-emerald-500/20 flex items-center justify-center flex-shrink-0">
                            <CheckCircle2 size={16} className="text-emerald-500" />
                          </div>
                          <div>
                            <p className="text-xs font-black text-white uppercase mb-1">Protein Timing</p>
                            <p className="text-xs text-slate-400">Distribute protein across 4 meals for optimal synthesis</p>
                          </div>
                        </div>
                      </div>
                      <div className="p-6 bg-white/5 rounded-2xl border border-white/5">
                        <div className="flex items-start gap-3">
                          <div className="w-8 h-8 rounded-full bg-blue-500/20 flex items-center justify-center flex-shrink-0">
                            <Target size={16} className="text-blue-500" />
                          </div>
                          <div>
                            <p className="text-xs font-black text-white uppercase mb-1">Hydration Sync</p>
                            <p className="text-xs text-slate-400">Increase water intake by 500ml pre-workout</p>
                          </div>
                        </div>
                      </div>
                      <div className="p-6 bg-white/5 rounded-2xl border border-white/5">
                        <div className="flex items-start gap-3">
                          <div className="w-8 h-8 rounded-full bg-amber-500/20 flex items-center justify-center flex-shrink-0">
                            <TrendingUp size={16} className="text-amber-500" />
                          </div>
                          <div>
                            <p className="text-xs font-black text-white uppercase mb-1">Micronutrient Focus</p>
                            <p className="text-xs text-slate-400">Add leafy greens for magnesium optimization</p>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="glass-card rounded-[50px] p-12 bg-white/5">
                    <div className="grid grid-cols-2 gap-6">
                      {achievements.map((a, i) => (
                        <div key={i} className={`p-6 rounded-[32px] border flex flex-col items-center gap-4 transition-all ${a.unlockedAt > 0 ? 'bg-emerald-500/10 border-emerald-500/20' : 'bg-white/5 border-white/10 grayscale opacity-40'}`}>
                          <span className="text-4xl">{a.icon}</span>
                          <span className="text-[10px] font-black uppercase text-center">{a.title}</span>
                        </div>
                      ))}
                    </div>
                  </div>

                  <div className="glass-card rounded-[50px] p-10 bg-white/5 border-white/10">
                    <h3 className="text-xl font-black text-white mb-6 italic">Weekly Trends</h3>
                    <div className="space-y-6">
                      <div>
                        <div className="flex justify-between items-baseline mb-2">
                          <span className="text-xs font-black text-slate-500 uppercase">Avg Daily Calories</span>
                          <span className="text-lg font-black text-white">{Math.round(meals.reduce((sum, m) => sum + m.ingredients.reduce((s, i) => s + (i.calories || 0), 0), 0) / Math.max(1, meals.length))}</span>
                        </div>
                        <div className="h-2 bg-white/5 rounded-full overflow-hidden">
                          <div className="h-full bg-gradient-to-r from-emerald-500 to-blue-500" style={{ width: '72%' }} />
                        </div>
                      </div>
                      <div>
                        <div className="flex justify-between items-baseline mb-2">
                          <span className="text-xs font-black text-slate-500 uppercase">Protein Consistency</span>
                          <span className="text-lg font-black text-emerald-500">94%</span>
                        </div>
                        <div className="h-2 bg-white/5 rounded-full overflow-hidden">
                          <div className="h-full bg-emerald-500" style={{ width: '94%' }} />
                        </div>
                      </div>
                      <div>
                        <div className="flex justify-between items-baseline mb-2">
                          <span className="text-xs font-black text-slate-500 uppercase">Meal Frequency</span>
                          <span className="text-lg font-black text-blue-500">{meals.length} meals</span>
                        </div>
                        <div className="h-2 bg-white/5 rounded-full overflow-hidden">
                          <div className="h-full bg-blue-500" style={{ width: `${Math.min(100, (meals.length / 20) * 100)}%` }} />
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </motion.div>
          )}

          {activeTab === 'performance' && (
            <motion.div key="performance" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, scale: 0.95 }} className="space-y-12">
              <div className="grid grid-cols-1 xl:grid-cols-12 gap-12">
                <div className="xl:col-span-8 space-y-12">
                  <MetabolicDashboard metrics={{ vo2Max: 54, restingHeartRate: 58, hydrationLevel: 92, trainingLoad: 'Optimal' }} recovery={recoveryScore} />
                  <div className="glass-card rounded-[40px] p-10 bg-white/5 border-white/5 mt-8">
                    <h3 className="text-xl font-black text-white mb-8 italic">Performance History</h3>
                    <div className="space-y-4">
                      {activities.map((a, i) => (
                        <div key={i} className="flex justify-between items-center p-6 bg-white/5 rounded-2xl border border-white/5">
                          <div className="flex items-center gap-4">
                            <div className="w-10 h-10 rounded-xl bg-blue-500/20 flex items-center justify-center text-blue-500">
                              <ActivityIcon size={20} />
                            </div>
                            <div>
                              <p className="text-xs font-black text-white uppercase">{a.type}</p>
                              <p className="text-[10px] font-bold text-slate-500 uppercase">{a.duration} MIN • {a.intensity}</p>
                            </div>
                          </div>
                          <div className="text-right">
                            <p className="text-sm font-black text-white">-{a.caloriesBurned} KCAL</p>
                          </div>
                        </div>
                      ))}
                      {activities.length === 0 && <p className="text-center py-10 text-slate-700 text-[10px] font-black uppercase tracking-widest">No spectral telemetry recorded</p>}
                    </div>
                  </div>
                </div>
                <div className="xl:col-span-4 space-y-12">
                  <PerformanceCoach advice={performanceAdvice} />

                  <div className="glass-card rounded-[40px] p-10 bg-blue-600/5 border-blue-500/10">
                    <div className="flex items-center gap-3 mb-8">
                      <ZapIcon size={20} className="text-blue-500" />
                      <h3 className="text-xl font-black text-white italic">AI What-If Simulator</h3>
                    </div>
                    <div className="space-y-6">
                      <p className="text-[10px] font-bold text-slate-500 uppercase tracking-widest">Simulate added activity impact</p>
                      <div className="grid grid-cols-2 gap-4">
                        <button onClick={() => runWhatIfAction(300)} className="py-4 bg-white/5 hover:bg-white/10 rounded-2xl text-[10px] font-black uppercase transition-all">🏃‍♂️ 30m Run</button>
                        <button onClick={() => runWhatIfAction(200)} className="py-4 bg-white/5 hover:bg-white/10 rounded-2xl text-[10px] font-black uppercase transition-all">🧘‍♀️ 45m Yoga</button>
                      </div>

                      {whatIfResponse && (
                        <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="p-6 bg-blue-500/10 border border-blue-500/20 rounded-2xl space-y-3">
                          <p className="text-xs font-medium text-blue-200 italic">"{whatIfResponse.insight}"</p>
                          <div className="flex justify-between items-baseline pt-2 border-t border-white/5">
                            <span className="text-[10px] font-black text-blue-500 uppercase">Impact</span>
                            <span className="text-white font-black">{whatIfResponse.weekly_impact}</span>
                          </div>
                        </motion.div>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            </motion.div>
          )}

          {activeTab === 'meals' && (
            <motion.div key="meals" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, scale: 0.95 }} className="space-y-12">
              <div className="glass-card rounded-[60px] p-16 bg-white/5 border-white/10">
                <div className="flex justify-between items-center mb-12">
                  <div>
                    <h2 className="text-4xl font-black text-white italic">Nutrition Timeline</h2>
                    <p className="text-sm font-black text-slate-500 uppercase tracking-widest mt-2">Complete Meal History</p>
                  </div>
                  <div className="flex gap-4">
                    <div className="px-6 py-3 bg-emerald-500/10 border border-emerald-500/20 rounded-2xl">
                      <span className="text-xs font-black text-emerald-500 uppercase">{meals.length} Meals Logged</span>
                    </div>
                  </div>
                </div>
                <div className="space-y-6">
                  {meals.map((meal, i) => {
                    const getMealImage = (type: string, description: string) => {
                      const desc = description.toLowerCase();
                      if (desc.includes('salmon')) return '/meal-salmon.png';
                      if (desc.includes('smoothie')) return '/meal-smoothie.png';
                      if (desc.includes('salad') || desc.includes('thon')) return '/meal-salad.png';
                      if (desc.includes('toast') || desc.includes('avocat')) return '/meal-toast.png';
                      if (desc.includes('omelette') || desc.includes('avoine')) return '/meal-breakfast.png';
                      // Fallback based on meal type
                      if (type === 'Breakfast') return '/meal-breakfast.png';
                      if (type === 'Lunch') return '/meal-salad.png';
                      if (type === 'Dinner') return '/meal-dinner.png';
                      return '/meal-breakfast.png';
                    };

                    return (
                      <motion.div key={meal.id} initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: i * 0.05 }} className="p-8 bg-white/5 rounded-[32px] border border-white/5 hover:border-emerald-500/20 transition-all group overflow-hidden">
                        <div className="flex gap-6 mb-6">
                          {/* Meal Image */}
                          <div className="w-32 h-32 rounded-2xl overflow-hidden flex-shrink-0 bg-white/5">
                            <img
                              src={getMealImage(meal.type, meal.description)}
                              alt={meal.description}
                              className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                            />
                          </div>

                          {/* Meal Info */}
                          <div className="flex-1 flex justify-between items-start">
                            <div className="flex items-center gap-4">
                              <div className="w-16 h-16 rounded-2xl bg-emerald-500/10 flex items-center justify-center text-3xl">
                                {meal.type === 'Breakfast' ? '🌅' : meal.type === 'Lunch' ? '☀️' : meal.type === 'Dinner' ? '🌙' : '🍎'}
                              </div>
                              <div>
                                <h3 className="text-xl font-black text-white">{meal.description}</h3>
                                <p className="text-xs font-bold text-slate-500 uppercase mt-1">{meal.type} • {new Date(meal.timestamp).toLocaleDateString()}</p>
                              </div>
                            </div>
                            <div className="text-right">
                              <p className="text-2xl font-black text-emerald-500">{meal.ingredients.reduce((sum, ing) => sum + (ing.calories || 0), 0)} kcal</p>
                              <p className="text-xs font-bold text-slate-600 uppercase mt-1">{meal.ingredients.reduce((sum, ing) => sum + (ing.protein || 0), 0)}g protein</p>
                            </div>
                          </div>
                        </div>
                        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                          {meal.ingredients.map((ing, idx) => (
                            <div key={idx} className="p-4 bg-white/5 rounded-2xl border border-white/5">
                              <p className="text-xs font-black text-white uppercase">{ing.name}</p>
                              <p className="text-[10px] font-bold text-slate-600 mt-1">{ing.quantity} {ing.unit}</p>
                            </div>
                          ))}
                        </div>
                      </motion.div>
                    );
                  })}
                  {meals.length === 0 && (
                    <div className="py-20 text-center">
                      <Utensils size={64} className="mx-auto text-slate-800 mb-6" />
                      <p className="text-slate-700 text-sm font-black uppercase tracking-widest">No meals logged yet</p>
                      <p className="text-slate-800 text-xs mt-2">Start tracking your nutrition journey</p>
                    </div>
                  )}
                </div>
              </div>
            </motion.div>
          )}

          {activeTab === 'awards' && (
            <motion.div key="awards" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, scale: 0.95 }} className="space-y-12">
              <div className="glass-card rounded-[60px] p-16 bg-white/5 border-white/10">
                <div className="mb-12">
                  <h2 className="text-4xl font-black text-white italic">Achievement Gallery</h2>
                  <p className="text-sm font-black text-slate-500 uppercase tracking-widest mt-2">Your Elite Performance Badges</p>
                </div>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
                  {achievements.map((achievement) => (
                    <motion.div
                      key={achievement.id}
                      whileHover={{ scale: 1.05, y: -5 }}
                      className={`p-10 rounded-[40px] border flex flex-col items-center gap-6 transition-all cursor-pointer ${achievement.unlockedAt > 0
                        ? 'bg-gradient-to-br from-emerald-500/20 to-blue-500/20 border-emerald-500/30 shadow-[0_20px_60px_-10px_rgba(16,185,129,0.4)]'
                        : 'bg-white/5 border-white/10 grayscale opacity-40'
                        }`}
                    >
                      <span className="text-6xl">{achievement.icon}</span>
                      <div className="text-center">
                        <p className="text-sm font-black uppercase text-white">{achievement.title}</p>
                        {achievement.unlockedAt > 0 && (
                          <p className="text-[10px] font-bold text-emerald-500 uppercase mt-2">
                            Unlocked {new Date(achievement.unlockedAt).toLocaleDateString()}
                          </p>
                        )}
                        {achievement.unlockedAt === 0 && (
                          <p className="text-[10px] font-bold text-slate-600 uppercase mt-2">Locked</p>
                        )}
                      </div>
                    </motion.div>
                  ))}
                </div>
                <div className="mt-16 p-10 bg-blue-600/10 border border-blue-500/20 rounded-[40px]">
                  <div className="flex items-center gap-4 mb-6">
                    <Trophy size={32} className="text-blue-500" />
                    <h3 className="text-2xl font-black text-white italic">Progress Tracker</h3>
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="p-6 bg-white/5 rounded-2xl">
                      <p className="text-xs font-black text-slate-500 uppercase mb-3">Total Achievements</p>
                      <p className="text-3xl font-black text-white">{achievements.filter(a => a.unlockedAt > 0).length}/{achievements.length}</p>
                    </div>
                    <div className="p-6 bg-white/5 rounded-2xl">
                      <p className="text-xs font-black text-slate-500 uppercase mb-3">Completion Rate</p>
                      <p className="text-3xl font-black text-emerald-500">{Math.round((achievements.filter(a => a.unlockedAt > 0).length / achievements.length) * 100)}%</p>
                    </div>
                  </div>
                </div>
              </div>
            </motion.div>
          )}

          {activeTab === 'profile' && (
            <motion.div key="profile" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }}>
              <EnhancedProfile
                profile={profile}
                onUpdateProfile={setProfile}
                streak={streak}
                totalMeals={meals.length}
                totalActivities={activities.length}
              />
            </motion.div>
          )}
        </AnimatePresence>

        <AnimatePresence>
          {showEntry && (
            <div className="fixed inset-0 z-[100] flex items-center justify-center p-8">
              <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={() => setShowEntry(false)} className="absolute inset-0 bg-[#020617]/90 backdrop-blur-2xl" />
              <motion.div initial={{ scale: 0.9, y: 40, opacity: 0 }} animate={{ scale: 1, y: 0, opacity: 1 }} exit={{ scale: 0.9, y: 40, opacity: 0 }} className="w-full max-w-4xl glass-card rounded-[80px] p-24 relative z-10 border-white/10">
                <header className="flex justify-between items-center mb-16">
                  <h2 className="text-6xl font-black text-white italic">Bio-Link <span className="text-emerald-500">Sync</span></h2>
                  <button onClick={() => setShowEntry(false)} className="w-16 h-16 rounded-full bg-white/5 border border-white/10 flex items-center justify-center text-slate-500 hover:text-white transition-colors">
                    <X size={32} />
                  </button>
                </header>
                <div className="space-y-16">
                  <div className="relative group">
                    <input ref={inputRef} autoFocus type="text" placeholder="Ex: Salmon Bowl..." className="w-full bg-white/5 border-2 border-white/10 rounded-[42px] px-12 py-10 text-3xl text-white font-black focus:outline-none focus:border-emerald-500/50 transition-all placeholder:text-slate-800" />
                    <div className="absolute right-8 top-1/2 -translate-y-1/2">
                      <button onClick={toggleVoice} className={`w-16 h-16 rounded-2xl flex items-center justify-center transition-all ${isRecording ? 'bg-rose-500 animate-pulse' : 'bg-white/10 text-emerald-500 hover:bg-emerald-500 hover:text-emerald-950'}`}>
                        {isRecording ? <MicOff size={24} /> : <Mic size={24} />}
                      </button>
                    </div>
                  </div>
                  <motion.button whileHover={{ scale: 1.02, y: -4 }} whileTap={{ scale: 0.98 }} onClick={() => { const val = inputRef.current?.value || ""; if (val) addMeal(val, 'Lunch'); }} className="w-full py-10 vitality-gradient rounded-[42px] text-white font-black text-xl uppercase tracking-[0.5em] shadow-[0_40px_80px_-20px_rgba(16,185,129,0.5)]">Execute Analysis</motion.button>
                </div>
              </motion.div>
            </div>
          )}
          <AnimatePresence>
            {showSportEntry && (
              <div className="fixed inset-0 z-[100] flex items-center justify-center p-8">
                <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={() => setShowSportEntry(false)} className="absolute inset-0 bg-[#020617]/90 backdrop-blur-2xl" />
                <motion.div initial={{ scale: 0.9, y: 40, opacity: 0 }} animate={{ scale: 1, y: 0, opacity: 1 }} exit={{ scale: 0.9, y: 40, opacity: 0 }} className="w-full max-w-5xl glass-card rounded-[80px] p-24 relative z-10 border-white/10">
                  <header className="flex justify-between items-center mb-16">
                    <div className="flex items-center gap-6">
                      <div className="w-16 h-16 rounded-2xl bg-blue-500 flex items-center justify-center text-white shadow-xl shadow-blue-500/20">
                        <ActivityIcon size={32} />
                      </div>
                      <h2 className="text-6xl font-black text-white italic">Neural <span className="text-blue-500">Perform</span></h2>
                    </div>
                    <button onClick={() => setShowSportEntry(false)} className="w-16 h-16 rounded-full bg-white/5 border border-white/10 flex items-center justify-center text-slate-500 hover:text-white transition-colors">
                      <X size={32} />
                    </button>
                  </header>
                  <ActivityLogger weight={profile.weight} onAdd={addActivity} onCancel={() => setShowSportEntry(false)} />
                </motion.div>
              </div>
            )}
          </AnimatePresence>
        </AnimatePresence>

        {showCamera && (
          <CameraCapture
            onCapture={handleCameraCapture}
            onClose={() => setShowCamera(false)}
          />
        )}

        {isAnalyzing && (
          <motion.div initial={{ y: 100, opacity: 0 }} animate={{ y: 0, opacity: 1 }} className="fixed bottom-12 left-1/2 -translate-x-1/2 bg-[#020617] px-12 py-6 rounded-full border border-emerald-500/40 z-[200] flex items-center gap-8 backdrop-blur-3xl">
            <div className="w-4 h-4 bg-emerald-500 rounded-full animate-ping shadow-[0_0_20px_rgba(16,185,129,1)]" />
            <p className="text-[11px] font-black text-white uppercase tracking-[0.4em]">Proprietary AI Neural-Sync Active</p>
          </motion.div>
        )}
      </motion.main>
    </div>
  );
};

export default App;
