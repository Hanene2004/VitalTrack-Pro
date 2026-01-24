
export type MealType = 'Breakfast' | 'Lunch' | 'Dinner' | 'Snack';
export type Category = 'Ventes' | 'Fournitures' | 'Salaire' | 'Loyer' | 'Marketing' | 'Divers';

export interface Ingredient {
  name: string;
  quantity: string;
  unit: string;
  calories?: number;
  protein?: number;
  carbs?: number;
  fat?: number;
  sodium?: number;
  sugar?: number;
}

export interface Meal {
  id: string;
  date: string;
  type: MealType;
  description: string;
  ingredients: Ingredient[];
  imageUrl?: string;
  timestamp: number;
  portionScale?: number;
  voiceTranscript?: string;
}

export interface UserProfile {
  age: number;
  weight: number;
  height: number;
  gender: 'male' | 'female' | 'other';
  goal: 'weight-loss' | 'muscle-gain' | 'maintenance' | 'longevity';
  dietaryPref: 'vegan' | 'keto' | 'paleo' | 'balanced';
}

export interface Achievement {
  id: string;
  title: string;
  icon: string;
  unlockedAt: number;
}

export interface NutrientSummary {
  totalCalories: number;
  totalProtein: number;
  totalCarbs: number;
  totalFat: number;
  balanceScore: number;
  ingredients?: Ingredient[];
}

export interface Transaction {
  id: string;
  date: string;
  amount: number;
  category: Category;
  description: string;
  timestamp: number;
}

export interface AnomalyResult {
  transactionId: string;
  suspicionScore: number;
  reason: string;
  isStatisticalAnomaly: boolean;
}

export interface AppState {
  // VitalTrack Pro
  meals: Meal[];
  profile: UserProfile | null;
  streak: number;
  achievements: Achievement[];
  dailySummary: NutrientSummary | null;
  aiSuggestions: string[];

  // Elite Sport & Performance
  workouts: Workout[];
  performanceMetrics: PerformanceMetrics | null;
  recoveryScore: number; // 0-100

  // Ultra-Sport & Energy Intelligence
  activities: SportActivity[];
  energyBalance: EnergyBalance | null;

  // BizGuard AI
  transactions: Transaction[];
  anomalies: AnomalyResult[];
  summary: string | null;
}

export type WorkoutType = 'Strength' | 'Cardio' | 'HIIT' | 'Yoga' | 'Recovery';

export interface Exercise {
  name: string;
  sets?: number;
  reps?: number;
  weight?: number;
  duration?: number; // in seconds
  intensity: 'Low' | 'Medium' | 'High' | 'Elite';
}

export interface Workout {
  id: string;
  date: string;
  type: WorkoutType;
  exercises: Exercise[];
  totalDuration: number; // minutes
  caloriesBurned: number;
  avgHeartRate: number;
  timestamp: number;
  aiAnalysis?: string;
}

export interface PerformanceMetrics {
  vo2Max: number;
  restingHeartRate: number;
  trainingLoad: 'Light' | 'Optimal' | 'Overreaching' | 'Excessive';
  metabolicAge: number;
  hydrationLevel: number; // 0-100
}

export type SportType = 'Running' | 'Cycling' | 'Swimming' | 'Gym' | 'Yoga' | 'Football' | 'Walking';

export interface SportActivity {
  id: string;
  type: SportType;
  duration: number; // minutes
  intensity: 'Low' | 'Moderate' | 'Vigorous';
  caloriesBurned: number;
  date: string;
  timestamp: number;
  metValue: number;
}

export interface EnergyBalance {
  consumed: number; // kcal
  burned: number; // kcal (BMR + Activity)
  net: number; // kcal
  status: 'Surplus' | 'Deficit' | 'Balanced';
  weeklyTrend: number[];
}
