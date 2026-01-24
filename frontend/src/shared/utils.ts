import { Meal, NutrientSummary, Transaction, AnomalyResult, Ingredient } from "../models/types";

export const calculateDailySummary = (meals: Meal[]): NutrientSummary => {
  const today = new Date().toISOString().split('T')[0];
  const todaysMeals = meals.filter(m => m.date === today);

  const summary: NutrientSummary = {
    totalCalories: 0,
    totalProtein: 0,
    totalCarbs: 0,
    totalFat: 0,
    balanceScore: 0
  };

  todaysMeals.forEach(meal => {
    meal.ingredients.forEach((ing: Ingredient) => {
      summary.totalCalories += ing.calories || 0;
      summary.totalProtein += ing.protein || 0;
      summary.totalCarbs += ing.carbs || 0;
      summary.totalFat += ing.fat || 0;
    });
  });

  const totalMacros = summary.totalProtein + summary.totalCarbs + summary.totalFat;
  if (totalMacros > 0) {
    const pPct = (summary.totalProtein / totalMacros) * 100;
    const cPct = (summary.totalCarbs / totalMacros) * 100;
    const fPct = (summary.totalFat / totalMacros) * 100;
    const deviation = Math.abs(pPct - 25) + Math.abs(cPct - 60) + Math.abs(fPct - 15);
    summary.balanceScore = Math.max(0, 100 - Math.round(deviation));
  }

  return summary;
};

export const formatNumber = (num: number) => {
  if (num === undefined || num === null) return "0";
  return Math.round(num).toLocaleString('fr-FR');
};

export const calculateZScoreAnomalies = (transactions: Transaction[]): AnomalyResult[] => {
  if (transactions.length < 3) return [];

  const amounts = transactions.map(t => t.amount);
  const mean = amounts.reduce((a, b) => a + b, 0) / amounts.length;
  const stdDev = Math.sqrt(amounts.map(x => Math.pow(x - mean, 2)).reduce((a, b) => a + b, 0) / amounts.length);

  return transactions.map(t => {
    const zScore = Math.abs((t.amount - mean) / (stdDev || 1));
    const isAnom = zScore > 2;
    return {
      transactionId: t.id,
      isStatisticalAnomaly: isAnom,
      suspicionScore: Math.min(zScore / 5, 1),
      reason: isAnom ? "Écart statistique significatif (Z-Score > 2)" : "Normal"
    };
  });
};

export const parseCSV = (text: string): Transaction[] => {
  const lines = text.split('\n').filter(l => l.trim());
  return lines.slice(1).map(line => {
    const [date, amount, category, description] = line.split(',');
    return {
      id: Math.random().toString(36).substr(2, 9),
      date,
      amount: parseFloat(amount),
      category: (category as any) || 'Divers',
      description: description || '',
      timestamp: new Date(date).getTime() || Date.now()
    };
  });
};

export const formatCurrency = (amount: number) => {
  return new Intl.NumberFormat('fr-FR', { style: 'currency', currency: 'EUR' }).format(amount);
};
