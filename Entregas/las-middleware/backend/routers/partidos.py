from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from database import get_db
from models import Match, Goal
from schemas import MatchOut, ResultUpdate
from logic.posiciones import calcular_posiciones

router = APIRouter(prefix="/api/partidos", tags=["partidos"])


@router.get("", response_model=list[MatchOut])
def listar_partidos(db: Session = Depends(get_db)):
    return db.query(Match).order_by(Match.date, Match.time).all()


@router.get("/{match_id}", response_model=MatchOut)
def obtener_partido(match_id: str, db: Session = Depends(get_db)):
    m = db.query(Match).filter(Match.id == match_id).first()
    if not m:
        raise HTTPException(status_code=404, detail="Partido no encontrado")
    return m


@router.put("/{match_id}/resultado", response_model=MatchOut)
def cargar_resultado(match_id: str, result: ResultUpdate, db: Session = Depends(get_db)):
    m = db.query(Match).filter(Match.id == match_id).first()
    if not m:
        raise HTTPException(status_code=404, detail="Partido no encontrado")
    if not m.local_team_id or not m.visitor_team_id:
        raise HTTPException(status_code=400, detail="El partido aún no tiene equipos asignados")

    m.local_goals = result.local_goals
    m.visitor_goals = result.visitor_goals
    m.penales_local = result.penales_local
    m.penales_visitor = result.penales_visitor

    db.query(Goal).filter(Goal.match_id == match_id).delete()
    for g in result.goals:
        db.add(Goal(
            match_id=match_id,
            team_id=g.team_id,
            player_name=g.player_name,
            minute=g.minute,
            assist_player=g.assist_player,
        ))

    db.commit()
    db.refresh(m)
    return m


@router.get("/grupo/{grupo}", response_model=list[MatchOut])
def partidos_por_grupo(grupo: str, db: Session = Depends(get_db)):
    return db.query(Match).filter(
        Match.group_letter == grupo.upper(), Match.phase == "grupos"
    ).order_by(Match.jornada, Match.date, Match.time).all()
