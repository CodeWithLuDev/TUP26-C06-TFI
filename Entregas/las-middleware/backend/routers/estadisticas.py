from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from sqlalchemy import func
from database import get_db
from models import Goal
from schemas import ScorerOut, AssistOut, StandingRow, ThirdPlaceRow
from logic.posiciones import GRUPOS, calcular_posiciones, obtener_terceros, obtener_clasificados
from logic.playoffs import generar_bracket
from schemas import BracketMatch

router = APIRouter(prefix="/api/estadisticas", tags=["estadisticas"])


@router.get("/goleadores", response_model=list[ScorerOut])
def goleadores(db: Session = Depends(get_db)):
    rows = (
        db.query(Goal.player_name, Goal.team_id, func.count(Goal.id).label("total"))
        .group_by(Goal.player_name, Goal.team_id)
        .order_by(func.count(Goal.id).desc())
        .all()
    )
    return [ScorerOut(player_name=r.player_name, team_id=r.team_id, goals=r.total) for r in rows]


@router.get("/asistidores", response_model=list[AssistOut])
def asistidores(db: Session = Depends(get_db)):
    rows = (
        db.query(Goal.assist_player, Goal.team_id, func.count(Goal.id).label("total"))
        .filter(Goal.assist_player != None, Goal.assist_player != "")
        .group_by(Goal.assist_player, Goal.team_id)
        .order_by(func.count(Goal.id).desc())
        .all()
    )
    return [AssistOut(player_name=r.assist_player, team_id=r.team_id, assists=r.total) for r in rows]


@router.get("/posiciones/{grupo}", response_model=list[StandingRow])
def posiciones_grupo(grupo: str, db: Session = Depends(get_db)):
    return calcular_posiciones(grupo.upper(), db)


@router.get("/terceros", response_model=list[ThirdPlaceRow])
def terceros(db: Session = Depends(get_db)):
    return obtener_terceros(db)


@router.get("/bracket", response_model=list[BracketMatch])
def bracket(db: Session = Depends(get_db)):
    return generar_bracket(db)
