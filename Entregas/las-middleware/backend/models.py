from sqlalchemy import Column, String, Integer, ForeignKey
from sqlalchemy.orm import relationship
from database import Base


class Team(Base):
    __tablename__ = "equipos"

    id = Column(String(3), primary_key=True)
    name = Column(String(100), nullable=False)
    flag = Column(String(20), nullable=False)
    group_letter = Column(String(1), nullable=False)


class Match(Base):
    __tablename__ = "partidos"

    id = Column(String(10), primary_key=True)
    group_letter = Column(String(1), nullable=True)
    local_team_id = Column(String(3), ForeignKey("equipos.id"), nullable=True)
    visitor_team_id = Column(String(3), ForeignKey("equipos.id"), nullable=True)
    date = Column(String(10), nullable=True)
    time = Column(String(5), nullable=True)
    phase = Column(String(20), nullable=False)
    jornada = Column(Integer, nullable=True)
    ronda = Column(String(50), nullable=True)
    fixture_num = Column(Integer, nullable=True)

    local_goals = Column(Integer, nullable=True)
    visitor_goals = Column(Integer, nullable=True)
    penales_local = Column(Integer, nullable=True)
    penales_visitor = Column(Integer, nullable=True)

    goals = relationship("Goal", back_populates="match", cascade="all, delete-orphan")


class Goal(Base):
    __tablename__ = "goles"

    id = Column(Integer, primary_key=True, autoincrement=True)
    match_id = Column(String(10), ForeignKey("partidos.id"), nullable=False)
    team_id = Column(String(3), ForeignKey("equipos.id"), nullable=False)
    player_name = Column(String(100), nullable=False)
    minute = Column(Integer, nullable=True)
    assist_player = Column(String(100), nullable=True)

    match = relationship("Match", back_populates="goals")


class User(Base):
    __tablename__ = "usuarios"

    id = Column(Integer, primary_key=True, autoincrement=True)
    username = Column(String(50), unique=True, nullable=False)
    hashed_password = Column(String(255), nullable=False)
