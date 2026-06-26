from sqlalchemy.orm import Session
from models import Match
from schemas import StandingRow, ThirdPlaceRow

GRUPOS = ["A", "B", "C", "D", "E", "F", "G", "H", "I", "J", "K", "L"]


def calcular_posiciones(grupo: str, db: Session) -> list[StandingRow]:
    from models import Team

    equipos = db.query(Team).filter(Team.group_letter == grupo).all()
    stats = {e.id: {"pj": 0, "pg": 0, "pe": 0, "pp": 0, "gf": 0, "gc": 0, "dg": 0, "pts": 0} for e in equipos}

    partidos = (
        db.query(Match)
        .filter(Match.group_letter == grupo, Match.phase == "grupos", Match.local_goals != None)
        .all()
    )

    for p in partidos:
        gl, gv = p.local_goals, p.visitor_goals
        loc = stats[p.local_team_id]
        vis = stats[p.visitor_team_id]

        loc["pj"] += 1; vis["pj"] += 1
        loc["gf"] += gl; loc["gc"] += gv
        vis["gf"] += gv; vis["gc"] += gl

        if gl > gv:
            loc["pg"] += 1; loc["pts"] += 3; vis["pp"] += 1
        elif gv > gl:
            vis["pg"] += 1; vis["pts"] += 3; loc["pp"] += 1
        else:
            loc["pe"] += 1; loc["pts"] += 1
            vis["pe"] += 1; vis["pts"] += 1

    for s in stats.values():
        s["dg"] = s["gf"] - s["gc"]

    ordenado: list[StandingRow] = []
    for e in equipos:
        s = stats[e.id]
        ordenado.append(StandingRow(
            id=e.id, name=e.name, flag=e.flag, group_letter=e.group_letter,
            pj=s["pj"], pg=s["pg"], pe=s["pe"], pp=s["pp"],
            gf=s["gf"], gc=s["gc"], dg=s["dg"], pts=s["pts"],
        ))

    ordenado.sort(key=lambda r: (
        -r.pts, -r.dg, -r.gf, r.name
    ))

    return ordenado


def obtener_terceros(db: Session) -> list[ThirdPlaceRow]:
    terceros = []
    for g in GRUPOS:
        pos = calcular_posiciones(g, db)
        if len(pos) >= 3:
            t = pos[2]
            terceros.append(ThirdPlaceRow(
                id=t.id, name=t.name, flag=t.flag, group_letter=t.group_letter,
                pj=t.pj, pg=t.pg, pe=t.pe, pp=t.pp,
                gf=t.gf, gc=t.gc, dg=t.dg, pts=t.pts,
                grupo=g,
            ))

    terceros.sort(key=lambda r: (-r.pts, -r.dg, -r.gf, r.name))
    return terceros


def obtener_clasificados(db: Session) -> tuple[list[StandingRow], list[StandingRow], list[ThirdPlaceRow], list[ThirdPlaceRow]]:
    primeros = []
    segundos = []

    for g in GRUPOS:
        tiene_resultados = db.query(Match).filter(
            Match.group_letter == g, Match.phase == "grupos",
            Match.local_goals != None
        ).count() > 0

        if not tiene_resultados:
            continue
        pos = calcular_posiciones(g, db)
        if len(pos) >= 1:
            primeros.append(pos[0])
        if len(pos) >= 2:
            segundos.append(pos[1])

    todos_terceros = obtener_terceros(db)
    mejores_terceros = todos_terceros[:8]

    return primeros, segundos, mejores_terceros, todos_terceros
