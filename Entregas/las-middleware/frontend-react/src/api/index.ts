import type { Team, MatchData, StandingRow, BracketMatch, Scorer, Assister, ResultPayload } from '../types';

const BASE = '/api';

async function request<T>(path: string, options: RequestInit = {}): Promise<T> {
  const headers: Record<string, string> = { 'Content-Type': 'application/json' };
  const res = await fetch(`${BASE}${path}`, { ...options, headers });
  if (!res.ok) {
    const detail = await res.json().catch(() => ({ detail: res.statusText }));
    throw new Error(detail.detail || 'Error en la solicitud');
  }
  return res.json();
}

export const api = {
  equipos: () => request<Team[]>('/equipos'),
  equiposPorGrupo: (grupo: string) => request<Team[]>(`/equipos/${grupo}`),

  partidos: () => request<MatchData[]>('/partidos'),
  partido: (id: string) => request<MatchData>(`/partidos/${id}`),
  cargarResultado: (id: string, data: ResultPayload) =>
    request<MatchData>(`/partidos/${id}/resultado`, { method: 'PUT', body: JSON.stringify(data) }),

  posiciones: (grupo: string) => request<StandingRow[]>(`/estadisticas/posiciones/${grupo}`),
  terceros: () => request<any[]>('/estadisticas/terceros'),

  bracket: () => request<BracketMatch[]>('/estadisticas/bracket'),

  goleadores: () => request<Scorer[]>('/estadisticas/goleadores'),
  asistidores: () => request<Assister[]>('/estadisticas/asistidores'),
};
