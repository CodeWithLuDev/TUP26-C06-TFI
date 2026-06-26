# Debug bracket generation
from database import SessionLocal
from logic.posiciones import obtener_clasificados
from logic.playoffs import generar_bracket

db = SessionLocal()
try:
    primeros, segundos, terceros, _ = obtener_clasificados(db)
    print(f"Primeros: {len(primeros)}, Segundos: {len(segundos)}, Terceros: {len(terceros)}")
    for p in primeros:
        print(f"  Primero grupo {p.group_letter}: {p.name}")
    for p in segundos:
        print(f"  Segundo grupo {p.group_letter}: {p.name}")
    for t in terceros:
        print(f"  Tercero grupo {t.grupo}: {t.name} ({t.pts} pts)")

    bracket = generar_bracket(db)
    print(f"\nBracket: {len(bracket)} matches")
    for b in bracket:
        print(f"  {b.id}: {b.local_team_id} vs {b.visitor_team_id} ({b.phase})")
except Exception as e:
    import traceback
    traceback.print_exc()
finally:
    db.close()
