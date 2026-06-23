from database import SessionLocal
from models import Team, Match, Goal


def seed_data():
    db = SessionLocal()
    try:
        if db.query(Team).count() > 0:
            return

        equipos = [
            Team(id="mex", name="México", flag="🇲🇽", group_letter="A"),
            Team(id="rsa", name="Sudáfrica", flag="🇿🇦", group_letter="A"),
            Team(id="kor", name="Corea del Sur", flag="🇰🇷", group_letter="A"),
            Team(id="cze", name="Chequia", flag="🇨🇿", group_letter="A"),
            Team(id="can", name="Canadá", flag="🇨🇦", group_letter="B"),
            Team(id="bih", name="Bosnia y Herzegovina", flag="🇧🇦", group_letter="B"),
            Team(id="qat", name="Qatar", flag="🇶🇦", group_letter="B"),
            Team(id="sui", name="Suiza", flag="🇨🇭", group_letter="B"),
            Team(id="bra", name="Brasil", flag="🇧🇷", group_letter="C"),
            Team(id="mar", name="Marruecos", flag="🇲🇦", group_letter="C"),
            Team(id="hai", name="Haití", flag="🇭🇹", group_letter="C"),
            Team(id="sco", name="Escocia", flag="🏴󠁧󠁢󠁳󠁣󠁴󠁿", group_letter="C"),
            Team(id="usa", name="EE.UU.", flag="🇺🇸", group_letter="D"),
            Team(id="par", name="Paraguay", flag="🇵🇾", group_letter="D"),
            Team(id="aus", name="Australia", flag="🇦🇺", group_letter="D"),
            Team(id="tur", name="Turquía", flag="🇹🇷", group_letter="D"),
            Team(id="ger", name="Alemania", flag="🇩🇪", group_letter="E"),
            Team(id="cuw", name="Curazao", flag="🇨🇼", group_letter="E"),
            Team(id="civ", name="Costa de Marfil", flag="🇨🇮", group_letter="E"),
            Team(id="ecu", name="Ecuador", flag="🇪🇨", group_letter="E"),
            Team(id="ned", name="Países Bajos", flag="🇳🇱", group_letter="F"),
            Team(id="jpn", name="Japón", flag="🇯🇵", group_letter="F"),
            Team(id="swe", name="Suecia", flag="🇸🇪", group_letter="F"),
            Team(id="tun", name="Túnez", flag="🇹🇳", group_letter="F"),
            Team(id="bel", name="Bélgica", flag="🇧🇪", group_letter="G"),
            Team(id="egy", name="Egipto", flag="🇪🇬", group_letter="G"),
            Team(id="irn", name="Irán", flag="🇮🇷", group_letter="G"),
            Team(id="nzl", name="Nueva Zelanda", flag="🇳🇿", group_letter="G"),
            Team(id="esp", name="España", flag="🇪🇸", group_letter="H"),
            Team(id="cpv", name="Cabo Verde", flag="🇨🇻", group_letter="H"),
            Team(id="ksa", name="Arabia Saudita", flag="🇸🇦", group_letter="H"),
            Team(id="ury", name="Uruguay", flag="🇺🇾", group_letter="H"),
            Team(id="fra", name="Francia", flag="🇫🇷", group_letter="I"),
            Team(id="sen", name="Senegal", flag="🇸🇳", group_letter="I"),
            Team(id="irq", name="Irak", flag="🇮🇶", group_letter="I"),
            Team(id="nor", name="Noruega", flag="🇳🇴", group_letter="I"),
            Team(id="arg", name="Argentina", flag="🇦🇷", group_letter="J"),
            Team(id="alg", name="Argelia", flag="🇩🇿", group_letter="J"),
            Team(id="aut", name="Austria", flag="🇦🇹", group_letter="J"),
            Team(id="jor", name="Jordania", flag="🇯🇴", group_letter="J"),
            Team(id="por", name="Portugal", flag="🇵🇹", group_letter="K"),
            Team(id="cod", name="RD Congo", flag="🇨🇩", group_letter="K"),
            Team(id="uzb", name="Uzbekistán", flag="🇺🇿", group_letter="K"),
            Team(id="col", name="Colombia", flag="🇨🇴", group_letter="K"),
            Team(id="eng", name="Inglaterra", flag="🏴󠁧󠁢󠁥󠁮󠁧󠁿", group_letter="L"),
            Team(id="cro", name="Croacia", flag="🇭🇷", group_letter="L"),
            Team(id="gha", name="Ghana", flag="🇬🇭", group_letter="L"),
            Team(id="pan", name="Panamá", flag="🇵🇦", group_letter="L"),
        ]
        db.add_all(equipos)

        partidos = [
            Match(id="a1", group_letter="A", local_team_id="mex", visitor_team_id="rsa", date="2026-06-11", time="15:00", phase="grupos", jornada=1, local_goals=2, visitor_goals=0),
            Match(id="a2", group_letter="A", local_team_id="kor", visitor_team_id="cze", date="2026-06-11", time="22:00", phase="grupos", jornada=1, local_goals=2, visitor_goals=1),
            Match(id="a3", group_letter="A", local_team_id="cze", visitor_team_id="rsa", date="2026-06-18", time="12:00", phase="grupos", jornada=2, local_goals=3, visitor_goals=1),
            Match(id="a4", group_letter="A", local_team_id="mex", visitor_team_id="kor", date="2026-06-18", time="21:00", phase="grupos", jornada=2, local_goals=1, visitor_goals=0),
            Match(id="a5", group_letter="A", local_team_id="cze", visitor_team_id="mex", date="2026-06-24", time="21:00", phase="grupos", jornada=3),
            Match(id="a6", group_letter="A", local_team_id="rsa", visitor_team_id="kor", date="2026-06-24", time="21:00", phase="grupos", jornada=3),
            Match(id="b1", group_letter="B", local_team_id="can", visitor_team_id="bih", date="2026-06-12", time="15:00", phase="grupos", jornada=1, local_goals=1, visitor_goals=1),
            Match(id="b2", group_letter="B", local_team_id="sui", visitor_team_id="qat", date="2026-06-13", time="15:00", phase="grupos", jornada=1, local_goals=1, visitor_goals=1),
            Match(id="b3", group_letter="B", local_team_id="sui", visitor_team_id="bih", date="2026-06-18", time="15:00", phase="grupos", jornada=2, local_goals=2, visitor_goals=0),
            Match(id="b4", group_letter="B", local_team_id="can", visitor_team_id="qat", date="2026-06-18", time="18:00", phase="grupos", jornada=2, local_goals=3, visitor_goals=2),
            Match(id="b5", group_letter="B", local_team_id="sui", visitor_team_id="can", date="2026-06-24", time="15:00", phase="grupos", jornada=3),
            Match(id="b6", group_letter="B", local_team_id="bih", visitor_team_id="qat", date="2026-06-24", time="15:00", phase="grupos", jornada=3),
            Match(id="c1", group_letter="C", local_team_id="bra", visitor_team_id="mar", date="2026-06-13", time="18:00", phase="grupos", jornada=1, local_goals=3, visitor_goals=0),
            Match(id="c2", group_letter="C", local_team_id="hai", visitor_team_id="sco", date="2026-06-13", time="21:00", phase="grupos", jornada=1, local_goals=1, visitor_goals=2),
            Match(id="c3", group_letter="C", local_team_id="sco", visitor_team_id="mar", date="2026-06-19", time="15:00", phase="grupos", jornada=2, local_goals=0, visitor_goals=0),
            Match(id="c4", group_letter="C", local_team_id="bra", visitor_team_id="hai", date="2026-06-19", time="18:00", phase="grupos", jornada=2, local_goals=4, visitor_goals=0),
            Match(id="c5", group_letter="C", local_team_id="sco", visitor_team_id="bra", date="2026-06-25", time="15:00", phase="grupos", jornada=3),
            Match(id="c6", group_letter="C", local_team_id="mar", visitor_team_id="hai", date="2026-06-25", time="15:00", phase="grupos", jornada=3),
            Match(id="d1", group_letter="D", local_team_id="usa", visitor_team_id="par", date="2026-06-12", time="21:00", phase="grupos", jornada=1, local_goals=4, visitor_goals=1),
            Match(id="d2", group_letter="D", local_team_id="aus", visitor_team_id="tur", date="2026-06-13", time="22:00", phase="grupos", jornada=1, local_goals=2, visitor_goals=2),
            Match(id="d3", group_letter="D", local_team_id="tur", visitor_team_id="par", date="2026-06-19", time="21:00", phase="grupos", jornada=2, local_goals=1, visitor_goals=3),
            Match(id="d4", group_letter="D", local_team_id="usa", visitor_team_id="aus", date="2026-06-19", time="15:00", phase="grupos", jornada=2, local_goals=2, visitor_goals=0),
            Match(id="d5", group_letter="D", local_team_id="tur", visitor_team_id="usa", date="2026-06-25", time="22:00", phase="grupos", jornada=3),
            Match(id="d6", group_letter="D", local_team_id="par", visitor_team_id="aus", date="2026-06-25", time="22:00", phase="grupos", jornada=3),
            Match(id="e1", group_letter="E", local_team_id="ger", visitor_team_id="cuw", date="2026-06-14", time="13:00", phase="grupos", jornada=1, local_goals=5, visitor_goals=0),
            Match(id="e2", group_letter="E", local_team_id="civ", visitor_team_id="ecu", date="2026-06-14", time="19:00", phase="grupos", jornada=1, local_goals=1, visitor_goals=2),
            Match(id="e3", group_letter="E", local_team_id="ecu", visitor_team_id="cuw", date="2026-06-20", time="15:00", phase="grupos", jornada=2, local_goals=3, visitor_goals=0),
            Match(id="e4", group_letter="E", local_team_id="ger", visitor_team_id="civ", date="2026-06-20", time="18:00", phase="grupos", jornada=2, local_goals=2, visitor_goals=1),
            Match(id="e5", group_letter="E", local_team_id="ecu", visitor_team_id="ger", date="2026-06-26", time="15:00", phase="grupos", jornada=3),
            Match(id="e6", group_letter="E", local_team_id="cuw", visitor_team_id="civ", date="2026-06-26", time="15:00", phase="grupos", jornada=3),
            Match(id="f1", group_letter="F", local_team_id="ned", visitor_team_id="jpn", date="2026-06-14", time="16:00", phase="grupos", jornada=1, local_goals=2, visitor_goals=1),
            Match(id="f2", group_letter="F", local_team_id="swe", visitor_team_id="tun", date="2026-06-14", time="22:00", phase="grupos", jornada=1, local_goals=1, visitor_goals=1),
            Match(id="f3", group_letter="F", local_team_id="tun", visitor_team_id="jpn", date="2026-06-20", time="21:00", phase="grupos", jornada=2, local_goals=0, visitor_goals=2),
            Match(id="f4", group_letter="F", local_team_id="ned", visitor_team_id="swe", date="2026-06-20", time="18:00", phase="grupos", jornada=2, local_goals=1, visitor_goals=1),
            Match(id="f5", group_letter="F", local_team_id="tun", visitor_team_id="ned", date="2026-06-26", time="18:00", phase="grupos", jornada=3),
            Match(id="f6", group_letter="F", local_team_id="jpn", visitor_team_id="swe", date="2026-06-26", time="18:00", phase="grupos", jornada=3),
            Match(id="g1", group_letter="G", local_team_id="bel", visitor_team_id="egy", date="2026-06-15", time="15:00", phase="grupos", jornada=1, local_goals=2, visitor_goals=0),
            Match(id="g2", group_letter="G", local_team_id="irn", visitor_team_id="nzl", date="2026-06-15", time="21:00", phase="grupos", jornada=1, local_goals=1, visitor_goals=1),
            Match(id="g3", group_letter="G", local_team_id="nzl", visitor_team_id="egy", date="2026-06-21", time="15:00", phase="grupos", jornada=2, local_goals=0, visitor_goals=2),
            Match(id="g4", group_letter="G", local_team_id="bel", visitor_team_id="irn", date="2026-06-21", time="18:00", phase="grupos", jornada=2, local_goals=3, visitor_goals=0),
            Match(id="g5", group_letter="G", local_team_id="nzl", visitor_team_id="bel", date="2026-06-27", time="15:00", phase="grupos", jornada=3),
            Match(id="g6", group_letter="G", local_team_id="egy", visitor_team_id="irn", date="2026-06-27", time="15:00", phase="grupos", jornada=3),
            Match(id="h1", group_letter="H", local_team_id="esp", visitor_team_id="cpv", date="2026-06-15", time="12:00", phase="grupos", jornada=1, local_goals=3, visitor_goals=0),
            Match(id="h2", group_letter="H", local_team_id="ksa", visitor_team_id="ury", date="2026-06-15", time="18:00", phase="grupos", jornada=1, local_goals=1, visitor_goals=2),
            Match(id="h3", group_letter="H", local_team_id="ury", visitor_team_id="cpv", date="2026-06-21", time="18:00", phase="grupos", jornada=2, local_goals=2, visitor_goals=1),
            Match(id="h4", group_letter="H", local_team_id="esp", visitor_team_id="ksa", date="2026-06-21", time="12:00", phase="grupos", jornada=2, local_goals=1, visitor_goals=1),
            Match(id="h5", group_letter="H", local_team_id="cpv", visitor_team_id="ksa", date="2026-06-27", time="18:00", phase="grupos", jornada=3),
            Match(id="h6", group_letter="H", local_team_id="ury", visitor_team_id="esp", date="2026-06-27", time="18:00", phase="grupos", jornada=3),
            Match(id="i1", group_letter="I", local_team_id="fra", visitor_team_id="sen", date="2026-06-16", time="15:00", phase="grupos", jornada=1, local_goals=2, visitor_goals=0),
            Match(id="i2", group_letter="I", local_team_id="irq", visitor_team_id="nor", date="2026-06-16", time="18:00", phase="grupos", jornada=1, local_goals=1, visitor_goals=3),
            Match(id="i3", group_letter="I", local_team_id="nor", visitor_team_id="sen", date="2026-06-22", time="15:00", phase="grupos", jornada=2),
            Match(id="i4", group_letter="I", local_team_id="fra", visitor_team_id="irq", date="2026-06-22", time="18:00", phase="grupos", jornada=2),
            Match(id="i5", group_letter="I", local_team_id="nor", visitor_team_id="fra", date="2026-06-27", time="21:00", phase="grupos", jornada=3),
            Match(id="i6", group_letter="I", local_team_id="sen", visitor_team_id="irq", date="2026-06-27", time="21:00", phase="grupos", jornada=3),
            Match(id="j1", group_letter="J", local_team_id="arg", visitor_team_id="alg", date="2026-06-16", time="21:00", phase="grupos", jornada=1, local_goals=3, visitor_goals=0),
            Match(id="j2", group_letter="J", local_team_id="aut", visitor_team_id="jor", date="2026-06-16", time="22:00", phase="grupos", jornada=1, local_goals=2, visitor_goals=1),
            Match(id="j3", group_letter="J", local_team_id="jor", visitor_team_id="alg", date="2026-06-22", time="21:00", phase="grupos", jornada=2),
            Match(id="j4", group_letter="J", local_team_id="arg", visitor_team_id="aut", date="2026-06-22", time="14:00", phase="grupos", jornada=2),
            Match(id="j5", group_letter="J", local_team_id="jor", visitor_team_id="arg", date="2026-06-27", time="22:00", phase="grupos", jornada=3),
            Match(id="j6", group_letter="J", local_team_id="alg", visitor_team_id="aut", date="2026-06-27", time="22:00", phase="grupos", jornada=3),
            Match(id="k1", group_letter="K", local_team_id="por", visitor_team_id="cod", date="2026-06-17", time="13:00", phase="grupos", jornada=1, local_goals=3, visitor_goals=1),
            Match(id="k2", group_letter="K", local_team_id="uzb", visitor_team_id="col", date="2026-06-17", time="22:00", phase="grupos", jornada=1, local_goals=0, visitor_goals=2),
            Match(id="k3", group_letter="K", local_team_id="col", visitor_team_id="cod", date="2026-06-23", time="18:00", phase="grupos", jornada=2),
            Match(id="k4", group_letter="K", local_team_id="por", visitor_team_id="uzb", date="2026-06-23", time="15:00", phase="grupos", jornada=2),
            Match(id="k5", group_letter="K", local_team_id="col", visitor_team_id="por", date="2026-06-27", time="22:00", phase="grupos", jornada=3),
            Match(id="k6", group_letter="K", local_team_id="cod", visitor_team_id="uzb", date="2026-06-27", time="22:00", phase="grupos", jornada=3),
            Match(id="l1", group_letter="L", local_team_id="eng", visitor_team_id="cro", date="2026-06-17", time="16:00", phase="grupos", jornada=1, local_goals=2, visitor_goals=0),
            Match(id="l2", group_letter="L", local_team_id="gha", visitor_team_id="pan", date="2026-06-17", time="19:00", phase="grupos", jornada=1, local_goals=1, visitor_goals=0),
            Match(id="l3", group_letter="L", local_team_id="pan", visitor_team_id="cro", date="2026-06-23", time="21:00", phase="grupos", jornada=2),
            Match(id="l4", group_letter="L", local_team_id="eng", visitor_team_id="gha", date="2026-06-23", time="15:00", phase="grupos", jornada=2),
            Match(id="l5", group_letter="L", local_team_id="pan", visitor_team_id="eng", date="2026-06-27", time="22:00", phase="grupos", jornada=3),
            Match(id="l6", group_letter="L", local_team_id="cro", visitor_team_id="gha", date="2026-06-27", time="22:00", phase="grupos", jornada=3),
        ]

        for i in range(1, 17):
            partidos.append(Match(id=f"r32_{i}", phase="r32", ronda="Dieciseisavos", fixture_num=i))

        for i in range(1, 9):
            partidos.append(Match(id=f"r16_{i}", phase="r16", ronda="Octavos", fixture_num=i))

        for i in range(1, 5):
            partidos.append(Match(id=f"qf_{i}", phase="qf", ronda="Cuartos", fixture_num=i))

        for i in range(1, 3):
            partidos.append(Match(id=f"sf_{i}", phase="sf", ronda="Semifinales", fixture_num=i))

        partidos.append(Match(id="tp", phase="tp", ronda="Tercer Puesto"))
        partidos.append(Match(id="final", phase="final", ronda="Final"))

        db.add_all(partidos)
        db.commit()

        for pid in ["a1", "a2"]:
            goles = [
                Goal(match_id=pid, team_id="mex", player_name="J. Quiñones", minute=9) if pid == "a1" else None,
                Goal(match_id=pid, team_id="mex", player_name="R. Jiménez", minute=38) if pid == "a1" else None,
                Goal(match_id=pid, team_id="kor", player_name="Hwang In-Beom", minute=67) if pid == "a2" else None,
                Goal(match_id=pid, team_id="kor", player_name="Oh Hyeon-Gyu", minute=80) if pid == "a2" else None,
                Goal(match_id=pid, team_id="cze", player_name="L. Krejci", minute=59, assist_player="P. Šulc") if pid == "a2" else None,
            ]
            db.add_all([g for g in goles if g])

        db.commit()
    finally:
        db.close()
