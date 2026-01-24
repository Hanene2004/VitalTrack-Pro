from fastapi import APIRouter

router = APIRouter()

@router.get("/health")
async def health_check():
    return {"status": "ok"}

# Placeholder for meals
@router.post("/meals")
async def add_meal(meal: dict):
    return {"message": "Meal received", "data": meal}

@router.get("/stats")
async def get_stats():
    return {"summary": "Daily nutrition look good."}
