from typing import List, Dict

def analyze_meal_description(description: str):
    """
    Mock AI logic for meal analysis. 
    In the future, this would call Gemini 2.0.
    """
    desc = description.lower()
    ingredients = []
    
    if "salmon" in desc:
        ingredients.append({"name": "Salmon", "quantity": "150", "unit": "g", "calories": 300, "protein": 30, "carbs": 0, "fat": 15, "sodium": 120, "sugar": 0})
    if "quinoa" in desc:
        ingredients.append({"name": "Quinoa", "quantity": "100", "unit": "g", "calories": 120, "protein": 4, "carbs": 21, "fat": 2, "sodium": 5, "sugar": 1})
    if "avocado" in desc:
        ingredients.append({"name": "Avocado", "quantity": "0.5", "unit": "pcs", "calories": 160, "protein": 2, "carbs": 9, "fat": 15, "sodium": 7, "sugar": 0.5})
    if "chicken" in desc:
        ingredients.append({"name": "Chicken Breast", "quantity": "150", "unit": "g", "calories": 250, "protein": 45, "carbs": 0, "fat": 5, "sodium": 80, "sugar": 0})
    if "salad" in desc:
        ingredients.append({"name": "Mixed Greens", "quantity": "1", "unit": "bowl", "calories": 50, "protein": 2, "carbs": 10, "fat": 0, "sodium": 10, "sugar": 2})
    
    if not ingredients:
        ingredients.append({"name": "Misc Dish", "quantity": "1", "unit": "serving", "calories": 450, "protein": 15, "carbs": 40, "fat": 20, "sodium": 500, "sugar": 12})

    total_cal = sum(i['calories'] for i in ingredients)
    total_prot = sum(i['protein'] for i in ingredients)
    total_sugar = sum(i['sugar'] for i in ingredients)
    total_sodium = sum(i['sodium'] for i in ingredients)
    
    suggestion = "Looks balanced."
    anomalies = []
    
    if total_prot < 20:
        suggestion = "Consider adding a protein source like eggs or chicken to reach your muscle synthesis goals."
    elif total_cal > 700:
        suggestion = "This is a calorific meal. High energy density detected. Monitor your activity levels today."

    if total_sugar > 15:
        anomalies.append("High Glycemic Load: This meal contains significant sugar.")
    if total_sodium > 800:
        anomalies.append("Sodium Alert: Unusually high sodium level detected.")

    return {
        "ingredients": ingredients,
        "suggestion": suggestion,
        "anomalies": anomalies
    }

def estimate_portion_size(image_b64: str):
    """
    Pro: Vision-based portion estimation.
    """
    # Mock result: 1.2x of standard portion
    return {
        "scale": 1.2,
        "confidence": 0.88,
        "message": "Dish appears slightly larger than standard serving size. Calories scaled +20%."
    }

def predict_future_trends(meal_history: List[Dict], energy_balance: Dict = None):
    """
    Pro: If you continue this habit...
    """
    if len(meal_history) < 3:
        return {"projection": "Insufficent data for projection", "score_next_week": 0}
    
    recent_avg = sum(sum(i['calories'] for i in m['ingredients']) for m in meal_history) / len(meal_history)
    
    # Simple linear projection
    projected_score = 85
    if recent_avg > 2500:
        projected_score = 65
        analysis = "Continuing this caloric density may lead to metabolic slow-down."
    else:
        analysis = "Excellent trend. Nutrient density indicates high energy levels next week."

    # Pro: Correlation with activity
    if energy_balance and energy_balance.get('status') == 'Deficit':
        analysis += " Your active deficit is accelerating metabolic efficiency."
    
    return {
        "projection": analysis,
        "score_next_week": projected_score,
        "trend_data": [projected_score - 5, projected_score - 2, projected_score],
        "energy_sync": energy_balance.get('status', 'Unknown') if energy_balance else "Calculating..."
    }

def transcribe_voice_meal(audio_b64: str):
    """
    Pro: Voice to Transcription.
    """
    # Mock: Always returns "Grilled Salmon with Lemon and Quinoa Salad"
    return {
        "transcript": "Grilled Salmon with Lemon and Quinoa Salad",
        "confidence": 0.98
    }

def process_image_to_nutrition(image_b64: str):
    """
    Mock Image Recognition Pipeline.
    Simulates Gemini 2.0 Vision analysis.
    """
    # In a real scenario, we'd send image_b64 to Gemini
    # For now, return a high-confidence mock result
    return {
        "detected_dish": "Mediterranean Salad Bowl",
        "confidence": 0.94,
        "ingredients": [
            {"name": "Chickpeas", "calories": 150, "protein": 8, "carbs": 25, "fat": 2},
            {"name": "Cucumber & Tomato", "calories": 40, "protein": 1, "carbs": 8, "fat": 0},
            {"name": "Olive Oil Dressing", "calories": 120, "protein": 0, "carbs": 0, "fat": 14}
        ],
        "message": "AI Vision successfully mapped dish to nutritional profile."
    }

def detect_health_patterns(meal_history: List[Dict], energy_balance: Dict = None):
    """
    Pattern Detection AI Service.
    Analyzes historical data for habit trends.
    """
    if not meal_history:
        return {"score": 50, "insight": "Start logging to unlock AI health insights."}
    
    avg_calories = sum(sum(i['calories'] for i in m['ingredients']) for m in meal_history) / len(meal_history)
    avg_protein = sum(sum(i['protein'] for i in m['ingredients']) for m in meal_history) / len(meal_history)
    
    score = 70
    insight = "Your habit consistency is good."
    
    if avg_protein > 25:
        score += 15
        insight = "High-protein consistency detected. Excellent for metabolic health."
    elif avg_calories > 600:
        score -= 10
        insight = "High energy surplus detected over recent meals. Consider focusing on nutrient density."
        
    return {
        "score": min(100, score),
        "insight": insight,
        "trend": "Positive" if score > 75 else "Stable"
    }

def analyze_workout_performance(workout: Dict):
    """
    Pro: Metabolic impact analysis of physical activity.
    """
    intensity_map = {"Low": 1, "Medium": 1.5, "High": 2, "Elite": 3}
    base_score = intensity_map.get(workout.get('intensity', 'Medium'), 1.5)
    
    load = workout['totalDuration'] * base_score
    recovery_needed = load / 10 # hours
    
    return {
        "training_load": "Optimal" if 30 <= load <= 60 else "Light" if load < 30 else "Overreaching",
        "recovery_hours": round(recovery_needed, 1),
        "epoc_estimate": round(workout['caloriesBurned'] * 0.15, 0), # Afterburn effect
        "ai_insight": f"Target hit. Your {workout['type']} session focused on endurance. Ensure 20g post-workout protein."
    }

def get_performance_coach_advice(state: Dict):
    """
    Elite AI: Synthesize nutrition + sport for ultimate advice.
    """
    # Synthesis of data
    advice = "Continue focused training. Your VO2 Max trend is ascending."
    if state.get('recoveryScore', 100) < 40:
        advice = "Alert: Recovery score low. Pivot to active recovery (Yoga/Walk) and increase hydration."
    
    return {
        "coach_directive": advice,
        "next_optimal_workout": "HIIT" if state.get('recoveryScore', 100) > 80 else "Recovery",
        "nutrient_recommendation": "Extra Magnesium and Electrolytes tonight."
    }

def analyze_energy_and_patterns(state: Dict):
    """
    Ultra AI: Comprehensive synthesis of sport and food.
    Detects low protein on training days, inactivity, and overtraining.
    """
    activities = state.get('activities', [])
    meals = state.get('meals', [])
    
    # 1. Detect Inactivity/Overtraining
    recent_intensity = sum(1 for a in activities[-3:] if a['intensity'] == 'Vigorous')
    pattern_label = "Balanced"
    if recent_intensity >= 3:
        pattern_label = "Warning: Overtraining Risk"
    elif len(activities) == 0:
        pattern_label = "Insight: Inactivity detected"
        
    # 2. Nutrition vs Activity Correlation
    correlation_insight = "Fueling perfectly matched to activity sync."
    today_active = any(a['date'] == state.get('today') for a in activities)
    today_protein = sum(sum(i.get('protein', 0) for i in m['ingredients']) for m in meals if m['date'] == state.get('today'))
    
    if today_active and today_protein < 100:
        correlation_insight = "Bio-Conflict: Low protein recorded on a training day. Muscle recovery compromised."
        
    return {
        "pattern": pattern_label,
        "correlation": correlation_insight,
        "daily_score": 95 if pattern_label == "Balanced" else 72,
        "recommendation": "Increase Carb loading 2h before next endurance session."
    }

def get_sport_what_if(scenario: Dict, state: Dict):
    """
    Ultra AI: Predict the impact of adding an activity.
    """
    added_kcal = scenario.get('kcal', 300)
    current_net = state.get('energyBalance', {}).get('net', 0)
    new_net = current_net - added_kcal
    
    improvement = "Significant improvement in weekly metabolic burn." if added_kcal > 500 else "Moderate metabolic boost."
    
    return {
        "projected_net": new_net,
        "weekly_impact": f"This change shifts your weekly balance by {added_kcal * 5} kcal.",
        "insight": f"Scenario valid: {improvement} New net balance: {new_net} kcal."
    }
