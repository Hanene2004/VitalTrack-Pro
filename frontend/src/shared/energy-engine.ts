import { SportType, UserProfile } from '../models/types';

export const MET_VALUES: Record<SportType, Record<'Low' | 'Moderate' | 'Vigorous', number>> = {
    'Running': { 'Low': 6.0, 'Moderate': 10.0, 'Vigorous': 13.5 },
    'Cycling': { 'Low': 4.0, 'Moderate': 8.0, 'Vigorous': 12.0 },
    'Swimming': { 'Low': 5.0, 'Moderate': 8.0, 'Vigorous': 11.0 },
    'Gym': { 'Low': 3.5, 'Moderate': 5.5, 'Vigorous': 8.0 },
    'Yoga': { 'Low': 2.0, 'Moderate': 3.0, 'Vigorous': 4.0 },
    'Football': { 'Low': 6.0, 'Moderate': 9.0, 'Vigorous': 12.0 },
    'Walking': { 'Low': 2.5, 'Moderate': 3.5, 'Vigorous': 4.5 }
};

export const calculateCaloriesBurned = (
    type: SportType,
    durationMinutes: number,
    intensity: 'Low' | 'Moderate' | 'Vigorous',
    weightKg: number
): number => {
    const met = MET_VALUES[type][intensity];
    // Formula: kcal = MET * weight (kg) * time (hrs)
    return Math.round(met * weightKg * (durationMinutes / 60));
};

export const calculateBMR = (profile: UserProfile): number => {
    // Mifflin-St Jeor Equation
    const { weight, height, age, gender } = profile;
    if (gender === 'male') {
        return 10 * weight + 6.25 * height - 5 * age + 5;
    } else {
        return 10 * weight + 6.25 * height - 5 * age - 161;
    }
};
