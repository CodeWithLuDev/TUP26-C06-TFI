# Clasificación de equipos y armado de llaves eliminatorias oficiales FIFA 2026

from models import obtener_partidos_por_grupo
from logic.posiciones import calcular_tabla

GRUPOS = ["A","B","C","D","E","F","G","H","I","J","K","L"]


def obtener_todas_las_tablas():
    """Calcula y devuelve las tablas de los 12 grupos."""
    return {grupo: calcular_tabla(grupo) for grupo in GRUPOS}


def obtener_clasificados():
    """
    Determina los clasificados:
    - 1° y 2° de cada grupo (24 equipos)
    - 8 mejores terceros
    """
    tablas = obtener_todas_las_tablas()

    primeros  = []
    segundos  = []
    terceros  = []

    for grupo, tabla in tablas.items():
        if len(tabla) < 3:
            continue
        primeros.append({**tabla[0], "grupo": grupo})
        segundos.append({**tabla[1], "grupo": grupo})
        terceros.append({**tabla[2], "grupo": grupo})

    mejores_terceros = _ordenar_terceros(terceros)[:8]

    return {
        "primeros":         primeros,
        "segundos":         segundos,
        "mejores_terceros": mejores_terceros
    }


def armar_ronda_32(clasificados):
    """
    Arma los 16 partidos de la Ronda de 32 siguiendo los cruces
    oficiales de la FIFA para el Mundial 2026.
    """
    primeros = {e["grupo"]: e for e in clasificados["primeros"]}
    segundos = {e["grupo"]: e for e in clasificados["segundos"]}
    terceros = clasificados["mejores_terceros"]

    # Distribuir los 8 mejores terceros en orden
    t = [terceros[i]["id"] if i < len(terceros) else None for i in range(8)]

    def p(g): return primeros.get(g, {}).get("id")
    def s(g): return segundos.get(g, {}).get("id")

    # Cruces oficiales FIFA Mundial 2026
    partidos = [
        {"id": "R32_1",  "local": s("A"),  "visitante": s("B"),  "fecha": "2026-06-28", "hora": "17:00", "sede": "SoFi Stadium, Los Ángeles"},
        {"id": "R32_2",  "local": p("E"),  "visitante": t[0],    "fecha": "2026-06-29", "hora": "18:30", "sede": "Gillette Stadium, Boston"},
        {"id": "R32_3",  "local": p("F"),  "visitante": s("C"),  "fecha": "2026-06-29", "hora": "23:00", "sede": "Estadio BBVA, Monterrey"},
        {"id": "R32_4",  "local": p("C"),  "visitante": s("F"),  "fecha": "2026-06-29", "hora": "15:00", "sede": "NRG Stadium, Houston"},
        {"id": "R32_5",  "local": p("I"),  "visitante": t[1],    "fecha": "2026-06-30", "hora": "19:00", "sede": "MetLife Stadium, Nueva Jersey"},
        {"id": "R32_6",  "local": s("E"),  "visitante": s("I"),  "fecha": "2026-06-30", "hora": "15:00", "sede": "AT&T Stadium, Dallas"},
        {"id": "R32_7",  "local": p("A"),  "visitante": t[2],    "fecha": "2026-06-30", "hora": "23:00", "sede": "Estadio Azteca, Ciudad de México"},
        {"id": "R32_8",  "local": p("L"),  "visitante": t[3],    "fecha": "2026-07-01", "hora": "14:00", "sede": "Mercedes-Benz Stadium, Atlanta"},
        {"id": "R32_9",  "local": p("D"),  "visitante": t[4],    "fecha": "2026-07-01", "hora": "22:00", "sede": "Levi's Stadium, Santa Clara"},
        {"id": "R32_10", "local": p("G"),  "visitante": t[5],    "fecha": "2026-07-01", "hora": "18:00", "sede": "Lumen Field, Seattle"},
        {"id": "R32_11", "local": s("K"),  "visitante": s("L"),  "fecha": "2026-07-02", "hora": "21:00", "sede": "BMO Field, Toronto"},
        {"id": "R32_12", "local": p("H"),  "visitante": s("J"),  "fecha": "2026-07-02", "hora": "17:00", "sede": "SoFi Stadium, Los Ángeles"},
        {"id": "R32_13", "local": p("B"),  "visitante": t[6],    "fecha": "2026-07-02", "hora": "01:00", "sede": "BC Place, Vancouver"},
        {"id": "R32_14", "local": p("J"),  "visitante": s("H"),  "fecha": "2026-07-03", "hora": "20:00", "sede": "Hard Rock Stadium, Miami"},
        {"id": "R32_15", "local": p("K"),  "visitante": t[7],    "fecha": "2026-07-03", "hora": "23:30", "sede": "Arrowhead Stadium, Kansas City"},
        {"id": "R32_16", "local": s("D"),  "visitante": s("G"),  "fecha": "2026-07-03", "hora": "16:00", "sede": "AT&T Stadium, Dallas"},
    ]

    return partidos


def crear_partido_playoff(id, ronda, equipo_a=None, equipo_b=None, fecha=None, hora=None, sede=None):
    """Crea un partido de playoff vacío."""
    return {
        "id":          id,
        "ronda":       ronda,
        "equipo_a":    equipo_a,
        "equipo_b":    equipo_b,
        "goles_a":     None,
        "goles_b":     None,
        "ganador":     None,
        "definido_en": None,
        "fecha":       fecha,
        "hora":        hora,
        "sede":        sede,
    }


def registrar_resultado_playoff(partido, goles_a, goles_b, definido_en="regular", ganador=None):
    """Registra el resultado de un partido eliminatorio."""
    partido["goles_a"]     = goles_a
    partido["goles_b"]     = goles_b
    partido["definido_en"] = definido_en

    if goles_a > goles_b:
        partido["ganador"] = partido["equipo_a"]
    elif goles_b > goles_a:
        partido["ganador"] = partido["equipo_b"]
    else:
        partido["ganador"] = ganador

    return partido


def _ordenar_terceros(terceros):
    """Ordena los terceros por criterios FIFA."""
    return sorted(terceros, key=lambda e: (-e["PTS"], -e["DG"], -e["GF"]))