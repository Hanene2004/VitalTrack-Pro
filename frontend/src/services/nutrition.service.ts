import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { Meal, NutrientSummary, AppState, Ingredient } from '../models/types';
import { GeminiService } from './gemini.service';

const SAMPLE_MEALS: Meal[] = [
    {
        id: '1',
        date: new Date().toISOString().split('T')[0],
        type: 'Breakfast',
        description: 'Omelette aux fines herbes et toast complet',
        ingredients: [
            { name: 'Oeufs', quantity: '2', unit: 'pcs', calories: 140 },
            { name: 'Pain complet', quantity: '1', unit: 'tranche', calories: 80 }
        ],
        timestamp: Date.now()
    },
    {
        id: '2',
        date: new Date().toISOString().split('T')[0],
        type: 'Lunch',
        description: 'Salade de quinoa et poulet grillé',
        ingredients: [
            { name: 'Quinoa', quantity: '150', unit: 'g', calories: 180 },
            { name: 'Poulet', quantity: '100', unit: 'g', calories: 165 }
        ],
        timestamp: Date.now()
    }
];

@Injectable({
    providedIn: 'root'
})
export class NutritionService {
    private state = new BehaviorSubject<AppState>({
        // VitalTrack Pro
        meals: [],
        dailySummary: null,
        aiSuggestions: [],
        // BizGuard AI (Default/Empty)
        transactions: [],
        anomalies: [],
        summary: null,
        profile: null,
        streak: 0,
        achievements: [],
        // Elite Sport & Performance
        workouts: [],
        performanceMetrics: null,
        recoveryScore: 100,
        // Ultra-Sport & Energy Intelligence
        activities: [],
        energyBalance: null
    });

    state$ = this.state.asObservable();
    isAnalyzing$ = new BehaviorSubject<boolean>(false);

    constructor(private geminiService: GeminiService) {
        this.loadInitialData();
    }

    private loadInitialData() {
        const saved = localStorage.getItem('vitaltrack_data');
        if (saved) {
            this.updateState({ meals: JSON.parse(saved) });
        } else {
            this.updateState({ meals: SAMPLE_MEALS });
        }
        this.calculateDailySummary();
    }

    private updateState(partialState: Partial<AppState>) {
        const newState = { ...this.state.value, ...partialState };
        this.state.next(newState);
        localStorage.setItem('vitaltrack_data', JSON.stringify(newState.meals));
    }
    private calculateDailySummary() {
        const { meals } = this.state.value;
        const totalCalories = (meals || []).reduce((acc: number, m: Meal) => acc + (m.ingredients || []).reduce((iAcc: number, i: Ingredient) => iAcc + (i.calories || 0), 0), 0);
        const totalProtein = (meals || []).reduce((acc: number, m: Meal) => acc + (m.ingredients || []).reduce((iAcc: number, i: Ingredient) => iAcc + (i.protein || 0), 0), 0);

        const summary: NutrientSummary = {
            ingredients: (this.state.value.meals || []).flatMap(m => m.ingredients || []).map((i: Ingredient) => ({
                ...i,
                calories: i.calories || 0,
                protein: i.protein || 0
            })),
            totalCalories,
            totalProtein,
            totalCarbs: 0,
            totalFat: 0,
            balanceScore: 85 // Mock score for now
        };
        this.updateState({ dailySummary: summary });
    }
    async addMeal(meal: Meal) {
        const meals = [meal, ...(this.state.value.meals || [])];
        this.updateState({ meals });
        this.calculateDailySummary();
    }
    async runAIPatternAnalysis() {
        if (!this.state.value.meals || this.state.value.meals.length === 0) return;
        this.isAnalyzing$.next(true);
        try {
            const summary = "Votre consommation de protéines est excellente, mais essayez d'ajouter plus de fibres le soir.";
            this.updateState({ aiSuggestions: [summary] });
        } catch (error) {
            console.error(error);
        } finally {
            this.isAnalyzing$.next(false);
        }
    }
    resetData() {
        this.updateState({ meals: [], dailySummary: null, aiSuggestions: [] });
    }
    loadDemo() {
        this.updateState({ meals: SAMPLE_MEALS });
        this.calculateDailySummary();
    }
}
