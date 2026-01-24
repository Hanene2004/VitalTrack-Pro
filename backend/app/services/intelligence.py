"""
Advanced Intelligence Services
ML/Data-Science features for behavioral analysis
"""
from typing import List, Dict, Optional
from datetime import datetime, timedelta
import statistics

def calculate_coherence_score(meals: List[Dict], activities: List[Dict], sleep_data: Optional[Dict] = None) -> Dict:
    """
    Calculate daily/weekly coherence score based on regularity of habits.
    No moral judgment - just consistency measurement.
    """
    if not meals and not activities:
        return {
            "daily_score": 0,
            "weekly_score": 0,
            "message": "Pas assez de données pour calculer la cohérence",
            "factors": {
                "meal_regularity": 0,
                "activity_regularity": 0,
                "sleep_regularity": 0
            }
        }
    
    # Calculate meal regularity (timing consistency)
    meal_regularity = 0
    if len(meals) >= 2:
        meal_times = []
        for meal in meals:
            if 'timestamp' in meal:
                hour = datetime.fromtimestamp(meal['timestamp'] / 1000).hour
                meal_times.append(hour)
        
        if meal_times:
            # Lower standard deviation = more regular
            std_dev = statistics.stdev(meal_times) if len(meal_times) > 1 else 0
            meal_regularity = max(0, 100 - (std_dev * 10))
    
    # Calculate activity regularity (frequency consistency)
    activity_regularity = 0
    if len(activities) >= 2:
        # Check if activities are spread across days
        activity_dates = set()
        for activity in activities:
            if 'date' in activity:
                activity_dates.add(activity['date'])
        
        # More days with activity = more regular
        activity_regularity = min(100, len(activity_dates) * 20)
    
    # Sleep regularity (placeholder for future implementation)
    sleep_regularity = 70 if sleep_data else 0
    
    # Calculate overall scores
    factors_count = sum([1 for x in [meal_regularity, activity_regularity, sleep_regularity] if x > 0])
    daily_score = (meal_regularity + activity_regularity + sleep_regularity) / max(1, factors_count)
    weekly_score = daily_score  # For now, same as daily
    
    # Generate message
    if daily_score >= 80:
        message = "Tes habitudes sont très cohérentes aujourd'hui"
    elif daily_score >= 60:
        message = "Tes habitudes sont cohérentes aujourd'hui"
    elif daily_score >= 40:
        message = "Tes habitudes sont modérément régulières"
    else:
        message = "Tes habitudes varient beaucoup aujourd'hui"
    
    return {
        "daily_score": round(daily_score, 1),
        "weekly_score": round(weekly_score, 1),
        "message": message,
        "factors": {
            "meal_regularity": round(meal_regularity, 1),
            "activity_regularity": round(activity_regularity, 1),
            "sleep_regularity": round(sleep_regularity, 1)
        }
    }


def detect_risk_days(meals: List[Dict], activities: List[Dict], today: str) -> List[Dict]:
    """
    Detect days with behavioral anomalies.
    Non-judgmental alerts about unusual patterns.
    """
    risk_days = []
    
    # Group data by date
    daily_data = {}
    
    # Process meals
    for meal in meals:
        date = meal.get('date', today)
        if date not in daily_data:
            daily_data[date] = {'calories': 0, 'activity_burn': 0, 'meals': [], 'activities': []}
        
        calories = sum(ing.get('calories', 0) for ing in meal.get('ingredients', []))
        daily_data[date]['calories'] += calories
        daily_data[date]['meals'].append(meal)
    
    # Process activities
    for activity in activities:
        date = activity.get('date', today)
        if date not in daily_data:
            daily_data[date] = {'calories': 0, 'activity_burn': 0, 'meals': [], 'activities': []}
        
        daily_data[date]['activity_burn'] += activity.get('caloriesBurned', 0)
        daily_data[date]['activities'].append(activity)
    
    # Analyze each day
    for date, data in daily_data.items():
        calories = data['calories']
        activity_burn = data['activity_burn']
        
        # Risk 1: High activity + Low fuel
        if activity_burn > 500 and calories < 1500:
            risk_days.append({
                "date": date,
                "type": "high_activity_low_fuel",
                "severity": "medium",
                "message": "Cette journée sort de ton schéma habituel : beaucoup d'activité, peu de calories",
                "details": {
                    "calories": calories,
                    "activity_burn": activity_burn,
                    "deficit": activity_burn - calories
                }
            })
        
        # Risk 2: Zero activity + Heavy eating
        if activity_burn == 0 and calories > 2500:
            risk_days.append({
                "date": date,
                "type": "sedentary_overeating",
                "severity": "low",
                "message": "Cette journée sort de ton schéma habituel : aucune activité, alimentation dense",
                "details": {
                    "calories": calories,
                    "activity_burn": activity_burn
                }
            })
        
        # Risk 3: Extreme deficit
        if activity_burn > 0 and (calories - activity_burn) < -1000:
            risk_days.append({
                "date": date,
                "type": "extreme_deficit",
                "severity": "high",
                "message": "Déficit énergétique important détecté",
                "details": {
                    "calories": calories,
                    "activity_burn": activity_burn,
                    "net": calories - activity_burn
                }
            })
    
    return risk_days


def detect_micro_improvements(current_data: Dict, historical_data: Dict) -> List[Dict]:
    """
    Detect small, invisible improvements in behavior.
    Positive reinforcement without pressure.
    """
    improvements = []
    
    # Compare average activity duration
    current_avg_activity = current_data.get('avg_activity_minutes', 0)
    historical_avg_activity = historical_data.get('avg_activity_minutes', 0)
    
    if current_avg_activity > historical_avg_activity + 5:
        improvements.append({
            "type": "activity_increase",
            "message": f"+{round(current_avg_activity - historical_avg_activity)} min d'activité en moyenne",
            "icon": "📈",
            "value": round(current_avg_activity - historical_avg_activity, 1)
        })
    
    # Compare protein on training days
    current_protein_on_training = current_data.get('avg_protein_training_days', 0)
    historical_protein_on_training = historical_data.get('avg_protein_training_days', 0)
    
    if current_protein_on_training > historical_protein_on_training + 10:
        improvements.append({
            "type": "protein_timing",
            "message": "Plus de protéines les jours de sport",
            "icon": "💪",
            "value": round(current_protein_on_training - historical_protein_on_training, 1)
        })
    
    # Meal consistency
    current_meal_frequency = current_data.get('meals_per_day', 0)
    historical_meal_frequency = historical_data.get('meals_per_day', 0)
    
    if abs(current_meal_frequency - 3) < abs(historical_meal_frequency - 3):
        improvements.append({
            "type": "meal_consistency",
            "message": "Meilleure régularité des repas",
            "icon": "🎯",
            "value": round(current_meal_frequency, 1)
        })
    
    return improvements


def analyze_behavior_evolution(current_period: Dict, previous_period: Dict) -> Dict:
    """
    Analyze behavioral changes over time.
    Comparative analysis without judgment.
    """
    changes = []
    
    # Activity evolution
    current_activity = current_period.get('total_activity_minutes', 0)
    previous_activity = previous_period.get('total_activity_minutes', 0)
    
    if current_activity > previous_activity * 1.1:
        changes.append({
            "type": "activity_increase",
            "message": "Tu es plus actif qu'il y a 30 jours",
            "change_percent": round(((current_activity - previous_activity) / max(1, previous_activity)) * 100, 1)
        })
    elif current_activity < previous_activity * 0.9:
        changes.append({
            "type": "activity_decrease",
            "message": "Ton activité a diminué ce mois-ci",
            "change_percent": round(((current_activity - previous_activity) / max(1, previous_activity)) * 100, 1)
        })
    
    # Eating pattern evolution
    current_avg_calories = current_period.get('avg_calories', 0)
    previous_avg_calories = previous_period.get('avg_calories', 0)
    
    if abs(current_avg_calories - previous_avg_calories) > 200:
        changes.append({
            "type": "eating_pattern_change",
            "message": "Tes habitudes alimentaires ont changé ce mois-ci",
            "change_percent": round(((current_avg_calories - previous_avg_calories) / max(1, previous_avg_calories)) * 100, 1)
        })
    
    return {
        "summary": "Tes habitudes ont changé ce mois-ci" if changes else "Tes habitudes sont stables",
        "changes": changes,
        "trend": "improving" if len([c for c in changes if 'increase' in c['type']]) > 0 else "stable"
    }
