import os

from dotenv import load_dotenv
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from .routers import ai_routes, generate_plan

load_dotenv()

app = FastAPI(title="Civil Architect API")

allowed_origins = os.getenv(
    "CORS_ORIGINS",
    "http://localhost:5173,http://localhost:4173,null",
).split(",")
# "null" is the Origin header sent by Electron when loading from file://

app.add_middleware(
    CORSMiddleware,
    allow_origins=allowed_origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(generate_plan.router)
app.include_router(ai_routes.router)


@app.get("/")
def root():
    return {"message": "Civil Architect API is running"}
