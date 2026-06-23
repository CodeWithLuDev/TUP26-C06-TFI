from sqlalchemy.orm import Session
from models import Match
from schemas import BracketMatch
from logic.posiciones import obtener_clasificados

R32_CONFIG = [
    {"id": "r32_1",  "local": {"tipo": "segundo", "grupo": "A"}, "visitante": {"tipo": "segundo", "grupo": "B"}},
    {"id": "r32_2",  "local": {"tipo": "primero", "grupo": "E"}, "visitante": {"tipo": "tercero", "pools": ["A","B","C","D","F"]}},
    {"id": "r32_3",  "local": {"tipo": "primero", "grupo": "F"}, "visitante": {"tipo": "segundo", "grupo": "C"}},
    {"id": "r32_4",  "local": {"tipo": "primero", "grupo": "G"}, "visitante": {"tipo": "segundo", "grupo": "D"}},
    {"id": "r32_5",  "local": {"tipo": "primero", "grupo": "I"}, "visitante": {"tipo": "tercero", "pools": ["C","D","F","G","H"]}},
    {"id": "r32_6",  "local": {"tipo": "segundo", "grupo": "E"}, "visitante": {"tipo": "segundo", "grupo": "I"}},
    {"id": "r32_7",  "local": {"tipo": "primero", "grupo": "A"}, "visitante": {"tipo": "tercero", "pools": ["C","E","F","H","I"]}},
    {"id": "r32_8",  "local": {"tipo": "primero", "grupo": "D"}, "visitante": {"tipo": "tercero", "pools": ["B","E","F","I","J"]}},
    {"id": "r32_9",  "local": {"tipo": "primero", "grupo": "G"}, "visitante": {"tipo": "tercero", "pools": ["A","E","H","I","J"]}},
    {"id": "r32_10", "local": {"tipo": "primero", "grupo": "H"}, "visitante": {"tipo": "segundo", "grupo": "D"}},
    {"id": "r32_11", "local": {"tipo": "segundo", "grupo": "K"}, "visitante": {"tipo": "segundo", "grupo": "L"}},
    {"id": "r32_12", "local": {"tipo": "primero", "grupo": "L"}, "visitante": {"tipo": "tercero", "pools": ["A","B","C","D","E","F"]}},
    {"id": "r32_13", "local": {"tipo": "primero", "grupo": "B"}, "visitante": {"tipo": "tercero", "pools": ["E","F","G","I","J"]}},
    {"id": "r32_14", "local": {"tipo": "primero", "grupo": "J"}, "visitante": {"tipo": "segundo", "grupo": "H"}},
    {"id": "r32_15", "local": {"tipo": "primero", "grupo": "C"}, "visitante": {"tipo": "tercero", "pools": ["I","J","K","L"]}},
    {"id": "r32_16", "local": {"tipo": "primero", "grupo": "K"}, "visitante": {"tipo": "segundo", "grupo": "G"}},
]

R16_CONFIG = [
    {"id": "r16_1", "parent": ["r32_1", "r32_3"]},
    {"id": "r16_2", "parent": ["r32_2", "r32_5"]},
    {"id": "r16_3", "parent": ["r32_4", "r32_6"]},
    {"id": "r16_4", "parent": ["r32_7", "r32_8"]},
    {"id": "r16_5", "parent": ["r32_9", "r32_11"]},
    {"id": "r16_6", "parent": ["r32_10", "r32_12"]},
    {"id": "r16_7", "parent": ["r32_13", "r32_15"]},
    {"id": "r16_8", "parent": ["r32_14", "r32_16"]},
]

QF_CONFIG = [
    {"id": "qf_1", "parent": ["r16_1", "r16_2"]},
    {"id": "qf_2", "parent": ["r16_3", "r16_4"]},
    {"id": "qf_3", "parent": ["r16_5", "r16_6"]},
    {"id": "qf_4", "parent": ["r16_7", "r16_8"]},
]

SF_CONFIG = [
    {"id": "sf_1", "parent": ["qf_1", "qf_3"]},
    {"id": "sf_2", "parent": ["qf_2", "qf_4"]},
]

TP_CONFIG = {"parent": ["sf_1", "sf_2"], "lados": ["perdedor", "perdedor"]}
FINAL_CONFIG = {"parent": ["sf_1", "sf_2"], "lados": ["ganador", "ganador"]}


def _obtener_ganador(p: Match) -> str | None:
    if not p or p.local_goals is None:
        return None
    if p.penales_local is not None and p.local_goals == p.visitor_goals:
        return p.local_team_id if p.penales_local > p.penales_visitor else p.visitor_team_id
    return p.local_team_id if p.local_goals > p.visitor_goals else p.visitor_team_id


def _obtener_perdedor(p: Match) -> str | None:
    if not p or p.local_goals is None:
        return None
    if p.penales_local is not None and p.local_goals == p.visitor_goals:
        return p.local_team_id if p.penales_local < p.penales_visitor else p.visitor_team_id
    return p.local_team_id if p.local_goals < p.visitor_goals else p.visitor_team_id


def _resolver_tercero(pools: list[str], mejores_terceros: list) -> str | None:
    terceros_map = {t.grupo: t.id for t in mejores_terceros}
    for g in pools:
        if g in terceros_map:
            return terceros_map[g]
    return mejores_terceros[0].id if mejores_terceros else None


def generar_bracket(db: Session) -> list[BracketMatch]:
    from logic.posiciones import calcular_posiciones

    primeros, segundos, mejores_terceros, _ = obtener_clasificados(db)

    def team_id(tipo: str, grupo: str, pools: list[str] | None = None) -> str | None:
        if tipo == "primero":
            pos = calcular_posiciones(grupo, db)
            return pos[0].id if pos else None
        if tipo == "segundo":
            pos = calcular_posiciones(grupo, db)
            return pos[1].id if len(pos) > 1 else None
        if tipo == "tercero":
            return _resolver_tercero(pools or [], mejores_terceros)
        return None

    bracket_map: dict[str, BracketMatch] = {}

    for cfg in R32_CONFIG:
        local_grupo = cfg["local"].get("grupo", "")
        vis_grupo = cfg["visitante"].get("grupo", "")
        local_team = team_id(cfg["local"]["tipo"], local_grupo, cfg["local"].get("pools"))
        vis_team = team_id(cfg["visitante"]["tipo"], vis_grupo, cfg["visitante"].get("pools"))
        m = db.query(Match).filter(Match.id == cfg["id"]).first()
        bracket_map[cfg["id"]] = BracketMatch(
            id=cfg["id"], phase="r32", ronda="Dieciseisavos",
            local_team_id=m.local_team_id if (m and m.local_team_id) else local_team,
            visitor_team_id=m.visitor_team_id if (m and m.visitor_team_id) else vis_team,
            local_goals=m.local_goals if m else None,
            visitor_goals=m.visitor_goals if m else None,
            penales_local=m.penales_local if m else None,
            penales_visitor=m.penales_visitor if m else None,
        )

    rondas = [
        (R16_CONFIG, "r16", "Octavos"),
        (QF_CONFIG, "qf", "Cuartos"),
        (SF_CONFIG, "sf", "Semifinales"),
    ]

    for configs, phase, ronda in rondas:
        for cfg in configs:
            p1 = db.query(Match).filter(Match.id == cfg["parent"][0]).first()
            p2 = db.query(Match).filter(Match.id == cfg["parent"][1]).first()
            local_team = _obtener_ganador(p1) if p1 else (bracket_map.get(cfg["parent"][0]).local_team_id if bracket_map.get(cfg["parent"][0]) else None)
            vis_team = _obtener_ganador(p2) if p2 else (bracket_map.get(cfg["parent"][1]).local_team_id if bracket_map.get(cfg["parent"][1]) else None)
            m = db.query(Match).filter(Match.id == cfg["id"]).first()
            bracket_map[cfg["id"]] = BracketMatch(
                id=cfg["id"], phase=phase, ronda=ronda,
                local_team_id=m.local_team_id if (m and m.local_team_id) else local_team,
                visitor_team_id=m.visitor_team_id if (m and m.visitor_team_id) else vis_team,
                local_goals=m.local_goals if m else None,
                visitor_goals=m.visitor_goals if m else None,
                penales_local=m.penales_local if m else None,
                penales_visitor=m.penales_visitor if m else None,
            )

    for match_id, cfg, lados in [("tp", TP_CONFIG, ["perdedor", "perdedor"]), ("final", FINAL_CONFIG, ["ganador", "ganador"])]:
        p1 = db.query(Match).filter(Match.id == cfg["parent"][0]).first()
        p2 = db.query(Match).filter(Match.id == cfg["parent"][1]).first()
        fn = _obtener_perdedor if lados[0] == "perdedor" else _obtener_ganador
        fn2 = _obtener_perdedor if lados[1] == "perdedor" else _obtener_ganador
        local_team = fn(p1) if p1 else None
        vis_team = fn2(p2) if p2 else None
        m = db.query(Match).filter(Match.id == match_id).first()
        bracket_map[match_id] = BracketMatch(
            id=match_id, phase="tp" if match_id == "tp" else "final",
            ronda="Tercer Puesto" if match_id == "tp" else "Final",
            local_team_id=m.local_team_id if (m and m.local_team_id) else local_team,
            visitor_team_id=m.visitor_team_id if (m and m.visitor_team_id) else vis_team,
            local_goals=m.local_goals if m else None,
            visitor_goals=m.visitor_goals if m else None,
            penales_local=m.penales_local if m else None,
            penales_visitor=m.penales_visitor if m else None,
        )

    order = [f"r32_{i}" for i in range(1, 17)] + [f"r16_{i}" for i in range(1, 9)] + \
            [f"qf_{i}" for i in range(1, 5)] + [f"sf_{i}" for i in range(1, 3)] + ["tp", "final"]
    return [bracket_map[oid] for oid in order if oid in bracket_map]
