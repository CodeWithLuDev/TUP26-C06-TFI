export interface Team {
  id: string;
  name: string;
  flag: string;
  group_letter: string;
}

export interface GoalData {
  team_id: string;
  player_name: string;
  minute?: number | null;
  assist_player?: string | null;
}

export interface GoalOut {
  id: number;
  match_id: string;
  team_id: string;
  player_name: string;
  minute?: number | null;
  assist_player?: string | null;
}

export interface MatchData {
  id: string;
  group_letter?: string | null;
  local_team_id?: string | null;
  visitor_team_id?: string | null;
  date?: string | null;
  time?: string | null;
  phase: string;
  jornada?: number | null;
  ronda?: string | null;
  fixture_num?: number | null;
  local_goals?: number | null;
  visitor_goals?: number | null;
  penales_local?: number | null;
  penales_visitor?: number | null;
  goals: GoalOut[];
}

export interface StandingRow {
  id: string;
  name: string;
  flag: string;
  group_letter: string;
  pj: number;
  pg: number;
  pe: number;
  pp: number;
  gf: number;
  gc: number;
  dg: number;
  pts: number;
}

export interface ThirdPlaceRow extends StandingRow {
  grupo: string;
}

export interface BracketMatch {
  id: string;
  phase: string;
  ronda?: string | null;
  local_team_id?: string | null;
  visitor_team_id?: string | null;
  local_goals?: number | null;
  visitor_goals?: number | null;
  penales_local?: number | null;
  penales_visitor?: number | null;
}

export interface Scorer {
  player_name: string;
  team_id: string;
  goals: number;
}

export interface Assister {
  player_name: string;
  team_id: string;
  assists: number;
}

export interface ResultPayload {
  local_goals: number;
  visitor_goals: number;
  penales_local?: number | null;
  penales_visitor?: number | null;
  goals: GoalData[];
}

export interface JugadorDestacado {
  nombre: string;
  edad: number;
  posicion: string;
  equipo: string;
  pais: string;
  paisId: string;
  goles: number;
  asistencias: number;
  imagen: string;
  descripcion: string;
}

export const GRUPOS = ["A","B","C","D","E","F","G","H","I","J","K","L"];
