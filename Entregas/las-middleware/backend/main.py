import os
from dotenv import load_dotenv
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from database import engine, Base
from routers import auth, equipos, partidos, estadisticas
from seed import seed_data

load_dotenv()

Base.metadata.create_all(bind=engine)

app = FastAPI(
    title="Mundial 2026 — API",
    description="Backend para el Fixture del Mundial 2026 en Tiempo Real",
    version="1.0.0",
)

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(auth.router)
app.include_router(equipos.router)
app.include_router(partidos.router)
app.include_router(estadisticas.router)


@app.on_event("startup")
def startup():
    seed_data()


@app.get("/api/health")
def health():
    return {"status": "ok"}
