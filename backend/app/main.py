from dotenv import load_dotenv
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from .routers import ai_routes, generate_plan

load_dotenv()

app = FastAPI(title="Civil Architect API")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(generate_plan.router)
app.include_router(ai_routes.router)


@app.get("/")
def root():
    return {"message": "Civil Architect API is running"}
