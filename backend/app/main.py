from fastapi import FastAPI, File, UploadFile
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from typing import List
import base64
from .services.ai_nutrition import (
    analyze_meal_description, 
    process_image_to_nutrition, 
    detect_health_patterns,
    transcribe_voice_meal,
    estimate_portion_size,
    predict_future_trends
)

app = FastAPI(title="VitalTrack Pro Neural API")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_methods=["*"],
    allow_headers=["*"],
)

@app.middleware("http")
async def log_requests(request, call_next):
    import time
    start_time = time.time()
    response = await call_next(request)
    duration = time.time() - start_time
    print(f"DEBUG: {request.method} {request.url.path} - {response.status_code} ({duration:.2f}s)")
    return response

@app.exception_handler(Exception)
async def global_exception_handler(request, exc):
    return {"error": "Internal Metabolic Engine Failure", "detail": str(exc)}, 500

class MealRequest(BaseModel):
    description: str

class AudioRequest(BaseModel):
    audio_b64: str

class ImageRequest(BaseModel):
    image_b64: str

class HistoryRequest(BaseModel):
    meals: List[dict]
    energyBalance: dict = None

@app.get("/")
async def root():
    return {"status": "VitalTrack Pro Backend Online"}

@app.post("/analyze-meal")
async def analyze_meal(meal: MealRequest):
    return analyze_meal_description(meal.description)

@app.post("/transcribe-audio")
async def transcribe(audio: AudioRequest):
    return transcribe_voice_meal(audio.audio_b64)

@app.post("/analyze-portion")
async def analyze_portion(image: ImageRequest):
    return estimate_portion_size(image.image_b64)

@app.post("/predict-trends")
async def predict_trends(data: HistoryRequest):
    return predict_future_trends(data.meals, data.energyBalance)

@app.post("/analyze-image")
async def analyze_image(file: UploadFile = File(...)):
    content = await file.read()
    image_b64 = base64.b64encode(content).decode('utf-8')
    return process_image_to_nutrition(image_b64)

@app.post("/detect-patterns")
async def detect_patterns(data: HistoryRequest):
    return detect_health_patterns(data.meals, data.energyBalance)

@app.post("/analyze-workout")
async def analyze_workout(workout: dict):
    from .services.ai_nutrition import analyze_workout_performance
    return analyze_workout_performance(workout)

@app.post("/performance-coach")
async def coach_advice(state: dict):
    from .services.ai_nutrition import get_performance_coach_advice
    return get_performance_coach_advice(state)

@app.post("/energy-analysis")
async def energy_analysis(state: dict):
    from .services.ai_nutrition import analyze_energy_and_patterns
    return analyze_energy_and_patterns(state)

@app.post("/sport-what-if")
async def what_if_logic(data: dict):
    from .services.ai_nutrition import get_sport_what_if
    return get_sport_what_if(data['scenario'], data['state'])

@app.get("/health-check")
async def health_check():
    return {"status": "ok"}

@app.post("/coherence-score")
async def coherence_score(data: dict):
    from .services.intelligence import calculate_coherence_score
    meals = data.get('meals', [])
    activities = data.get('activities', [])
    sleep_data = data.get('sleep_data')
    return calculate_coherence_score(meals, activities, sleep_data)

@app.post("/detect-risk-days")
async def detect_risk_days(data: dict):
    from .services.intelligence import detect_risk_days
    meals = data.get('meals', [])
    activities = data.get('activities', [])
    today = data.get('today', '')
    return {"risk_days": detect_risk_days(meals, activities, today)}

@app.post("/micro-improvements")
async def micro_improvements(data: dict):
    from .services.intelligence import detect_micro_improvements
    current = data.get('current', {})
    historical = data.get('historical', {})
    return {"improvements": detect_micro_improvements(current, historical)}

@app.post("/behavior-evolution")
async def behavior_evolution(data: dict):
    from .services.intelligence import analyze_behavior_evolution
    current_period = data.get('current_period', {})
    previous_period = data.get('previous_period', {})
    return analyze_behavior_evolution(current_period, previous_period)
