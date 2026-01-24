import { describe, it, expect } from 'vitest';
import { calculateDailySummary, formatNumber, calculateZScoreAnomalies } from '@/src/shared/utils';
import { Meal, Transaction } from '@/src/models/types';

describe('calculateDailySummary', () => {
    it('should calculate summary for today meals', () => {
        const today = new Date().toISOString().split('T')[0];
        const meals: Meal[] = [
            {
                id: '1',
                date: today,
                type: 'Breakfast',
                description: 'Eggs',
                ingredients: [{ name: 'Egg', quantity: '2', unit: 'pcs', calories: 150, protein: 12 }],
                timestamp: Date.now()
            }
        ];
        const summary = calculateDailySummary(meals);
        expect(summary.totalCalories).toBe(150);
        expect(summary.totalProtein).toBe(12);
    });

    it('should ignore meals from other days', () => {
        const meals: Meal[] = [
            {
                id: '1',
                date: '2020-01-01',
                type: 'Breakfast',
                description: 'Old Eggs',
                ingredients: [{ name: 'Egg', quantity: '2', unit: 'pcs', calories: 150, protein: 12 }],
                timestamp: Date.now()
            }
        ];
        const summary = calculateDailySummary(meals);
        expect(summary.totalCalories).toBe(0);
    });
});

describe('formatNumber', () => {
    it('should format numbers with fr-FR locale', () => {
        // Use regex to be resilient to different types of space characters (\u202f vs \u00A0)
        expect(formatNumber(1234.5).replace(/\s/g, ' ')).toBe('1 235');
    });
});

describe('calculateZScoreAnomalies', () => {
    it('should identify statistical anomalies', () => {
        const transactions: Transaction[] = [
            { id: '1', date: '2024-05-01', amount: 100, category: 'Divers', description: 'desc', timestamp: 1 },
            { id: '2', date: '2024-05-02', amount: 110, category: 'Divers', description: 'desc', timestamp: 2 },
            { id: '3', date: '2024-05-03', amount: 105, category: 'Divers', description: 'desc', timestamp: 3 },
            { id: '4', date: '2024-05-04', amount: 100, category: 'Divers', description: 'desc', timestamp: 4 },
            { id: '5', date: '2024-05-05', amount: 100, category: 'Divers', description: 'desc', timestamp: 5 },
            { id: '6', date: '2024-05-06', amount: 10000, category: 'Divers', description: 'desc', timestamp: 6 }, // Extreme Anomaly
        ];
        const anomalies = calculateZScoreAnomalies(transactions);
        expect(anomalies[5].isStatisticalAnomaly).toBe(true);
        expect(anomalies[0].isStatisticalAnomaly).toBe(false);
    });
});
