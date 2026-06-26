from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from database import get_db
from models import Team
from schemas import TeamOut

router = APIRouter(prefix="/api/equipos", tags=["equipos"])


@router.get("", response_model=list[TeamOut])
def listar_equipos(db: Session = Depends(get_db)):
    return db.query(Team).order_by(Team.group_letter, Team.name).all()


@router.get("/{grupo}", response_model=list[TeamOut])
def equipos_por_grupo(grupo: str, db: Session = Depends(get_db)):
    return db.query(Team).filter(Team.group_letter == grupo.upper()).order_by(Team.name).all()
