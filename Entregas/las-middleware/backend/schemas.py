from pydantic import BaseModel
from typing import Optional


class GoalCreate(BaseModel):
    team_id: str
    player_name: str
    minute: Optional[int] = None
    assist_player: Optional[str] = None


class GoalOut(BaseModel):
    id: int
    match_id: str
    team_id: str
    player_name: str
    minute: Optional[int] = None
    assist_player: Optional[str] = None

    class Config:
        from_attributes = True


class ResultUpdate(BaseModel):
    local_goals: int
    visitor_goals: int
    penales_local: Optional[int] = None
    penales_visitor: Optional[int] = None
    goals: list[GoalCreate] = []


class TeamOut(BaseModel):
    id: str
    name: str
    flag: str
    group_letter: str

    class Config:
        from_attributes = True


class MatchOut(BaseModel):
    id: str
    group_letter: Optional[str] = None
    local_team_id: Optional[str] = None
    visitor_team_id: Optional[str] = None
    date: Optional[str] = None
    time: Optional[str] = None
    phase: str
    jornada: Optional[int] = None
    ronda: Optional[str] = None
    fixture_num: Optional[int] = None
    local_goals: Optional[int] = None
    visitor_goals: Optional[int] = None
    penales_local: Optional[int] = None
    penales_visitor: Optional[int] = None
    goals: list[GoalOut] = []

    class Config:
        from_attributes = True


class StandingRow(BaseModel):
    id: str
    name: str
    flag: str
    group_letter: str
    pj: int = 0
    pg: int = 0
    pe: int = 0
    pp: int = 0
    gf: int = 0
    gc: int = 0
    dg: int = 0
    pts: int = 0


class ThirdPlaceRow(BaseModel):
    id: str
    name: str
    flag: str
    group_letter: str
    pj: int = 0
    pg: int = 0
    pe: int = 0
    pp: int = 0
    gf: int = 0
    gc: int = 0
    dg: int = 0
    pts: int = 0
    grupo: str


class BracketMatch(BaseModel):
    id: str
    phase: str
    ronda: Optional[str] = None
    local_team_id: Optional[str] = None
    visitor_team_id: Optional[str] = None
    local_goals: Optional[int] = None
    visitor_goals: Optional[int] = None
    penales_local: Optional[int] = None
    penales_visitor: Optional[int] = None


class ScorerOut(BaseModel):
    player_name: str
    team_id: str
    goals: int


class AssistOut(BaseModel):
    player_name: str
    team_id: str
    assists: int


class LoginRequest(BaseModel):
    username: str
    password: str


class TokenOut(BaseModel):
    access_token: str
    token_type: str


class RegisterRequest(BaseModel):
    username: str
    password: str
