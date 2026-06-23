export const equipos = [
  // ── GRUPO A ──────────────────────────────────────────────
  { id:'mex', nombre:'México', nombreCorto:'MEX', confederacion:'CONCACAF', grupo:'A', escudo:'https://flagcdn.com/w80/mx.png', rankingFifa:12, estadisticasTorneo:stats(), wiki:{
    mundialesGanados:0, aniosCampeon:[],
    directorTecnico:{ nombre:'Javier Aguirre', nacionalidad:'México' },
    resumenHistorico:'México es uno de los anfitriones del torneo y un clásico participante de Copas del Mundo, conocido por su gran arraigo futbolero y su afición incondicional.',
    mejorResultado:'Cuartos de final (1970, 1986)',
    jugadoresDestacados:[ { nombre:'Santiago Giménez', posicion:'Delantero' }, { nombre:'Edson Álvarez', posicion:'Mediocampista' } ],
  } },
  { id:'rsa', nombre:'Sudáfrica', nombreCorto:'RSA', confederacion:'CAF', grupo:'A', escudo:'https://flagcdn.com/w80/za.png', rankingFifa:58, estadisticasTorneo:stats(), wiki:{
    mundialesGanados:0, aniosCampeon:[],
    directorTecnico:{ nombre:'Hugo Broos', nacionalidad:'Bélgica' },
    resumenHistorico:'Sudáfrica, los "Bafana Bafana", fue el primer país africano en organizar un Mundial, en 2010, y busca afianzarse como mundialista habitual.',
    mejorResultado:'Fase de grupos',
    jugadoresDestacados:[ { nombre:'Percy Tau', posicion:'Delantero' }, { nombre:'Ronwen Williams', posicion:'Arquero' } ],
  } },
  { id:'kor', nombre:'Corea del Sur', nombreCorto:'KOR', confederacion:'AFC', grupo:'A', escudo:'https://flagcdn.com/w80/kr.png', rankingFifa:22, estadisticasTorneo:stats(), wiki:{
    mundialesGanados:0, aniosCampeon:[],
    directorTecnico:{ nombre:'Hong Myung-bo', nacionalidad:'Corea del Sur' },
    resumenHistorico:'Corea del Sur es la potencia futbolística más constante de Asia, coanfitriona del histórico Mundial 2002 en el que llegó a semifinales.',
    mejorResultado:'Semifinales (2002)',
    jugadoresDestacados:[ { nombre:'Son Heung-min', posicion:'Delantero' }, { nombre:'Kim Min-jae', posicion:'Defensor' } ],
  } },
  { id:'cze', nombre:'Chequia', nombreCorto:'CZE', confederacion:'UEFA', grupo:'A', escudo:'https://flagcdn.com/w80/cz.png', rankingFifa:37, estadisticasTorneo:stats(), wiki:{
    mundialesGanados:0, aniosCampeon:[],
    directorTecnico:{ nombre:'Ivan Hašek', nacionalidad:'Chequia' },
    resumenHistorico:'Chequia hereda la rica tradición futbolística de la antigua Checoslovaquia, que llegó a dos finales mundialistas antes de la división del país.',
    mejorResultado:'Subcampeón (1934 y 1962, como Checoslovaquia)',
    jugadoresDestacados:[ { nombre:'Patrik Schick', posicion:'Delantero' }, { nombre:'Tomáš Souček', posicion:'Mediocampista' } ],
  } },

  // ── GRUPO B ──────────────────────────────────────────────
  { id:'can', nombre:'Canadá', nombreCorto:'CAN', confederacion:'CONCACAF', grupo:'B', escudo:'https://flagcdn.com/w80/ca.png', rankingFifa:48, estadisticasTorneo:stats(), wiki:{
    mundialesGanados:0, aniosCampeon:[],
    directorTecnico:{ nombre:'Jesse Marsch', nacionalidad:'EE.UU.' },
    resumenHistorico:'Canadá vive un crecimiento explosivo del fútbol impulsado por su generación más talentosa, y es uno de los tres anfitriones del Mundial 2026.',
    mejorResultado:'Fase de grupos (1986)',
    jugadoresDestacados:[ { nombre:'Alphonso Davies', posicion:'Defensor / Extremo' }, { nombre:'Jonathan David', posicion:'Delantero' } ],
  } },
  { id:'bih', nombre:'Bosnia y Herz.', nombreCorto:'BIH', confederacion:'UEFA', grupo:'B', escudo:'https://flagcdn.com/w80/ba.png', rankingFifa:61, estadisticasTorneo:stats(), wiki:{
    mundialesGanados:0, aniosCampeon:[],
    directorTecnico:{ nombre:'Sergej Barbarez', nacionalidad:'Bosnia' },
    resumenHistorico:'Bosnia y Herzegovina debutó en una Copa del Mundo en 2014, impulsada por una generación dorada liderada por Edin Džeko.',
    mejorResultado:'Fase de grupos (2014)',
    jugadoresDestacados:[ { nombre:'Edin Džeko', posicion:'Delantero' }, { nombre:'Miralem Pjanić', posicion:'Mediocampista' } ],
  } },
  { id:'qat', nombre:'Catar', nombreCorto:'QAT', confederacion:'AFC', grupo:'B', escudo:'https://flagcdn.com/w80/qa.png', rankingFifa:35, estadisticasTorneo:stats(), wiki:{
    mundialesGanados:0, aniosCampeon:[],
    directorTecnico:{ nombre:'Marquez Lopez', nacionalidad:'España' },
    resumenHistorico:'Catar fue el primer anfitrión árabe de una Copa del Mundo en 2022 y busca dar el salto deportivo como potencia asiática.',
    mejorResultado:'Fase de grupos',
    jugadoresDestacados:[ { nombre:'Akram Afif', posicion:'Extremo' }, { nombre:'Almoez Ali', posicion:'Delantero' } ],
  } },
  { id:'sui', nombre:'Suiza', nombreCorto:'SUI', confederacion:'UEFA', grupo:'B', escudo:'https://flagcdn.com/w80/ch.png', rankingFifa:19, estadisticasTorneo:stats(), wiki:{
    mundialesGanados:0, aniosCampeon:[],
    directorTecnico:{ nombre:'Murat Yakin', nacionalidad:'Suiza' },
    resumenHistorico:'Suiza es habitual de las últimas Copas del Mundo, reconocida por su disciplina táctica y su gran nivel competitivo en Europa.',
    mejorResultado:'Cuartos de final (1934, 1938, 1954)',
    jugadoresDestacados:[ { nombre:'Granit Xhaka', posicion:'Mediocampista' }, { nombre:'Manuel Akanji', posicion:'Defensor' } ],
  } },

  // ── GRUPO C ──────────────────────────────────────────────
  { id:'bra', nombre:'Brasil', nombreCorto:'BRA', confederacion:'CONMEBOL', grupo:'C', escudo:'https://flagcdn.com/w80/br.png', rankingFifa:5, estadisticasTorneo:stats(), wiki:{
    mundialesGanados:5, aniosCampeon:[1958,1962,1970,1994,2002],
    directorTecnico:{ nombre:'Dorival Júnior', nacionalidad:'Brasil' },
    resumenHistorico:'Brasil es la selección más laureada de la historia y la única presente en todas las ediciones de la Copa del Mundo.',
    mejorResultado:'Campeón (5 veces)',
    jugadoresDestacados:[ { nombre:'Vinícius Júnior', posicion:'Extremo' }, { nombre:'Rodrygo', posicion:'Extremo' } ],
  } },
  { id:'mar', nombre:'Marruecos', nombreCorto:'MAR', confederacion:'CAF', grupo:'C', escudo:'https://flagcdn.com/w80/ma.png', rankingFifa:13, estadisticasTorneo:stats(), wiki:{
    mundialesGanados:0, aniosCampeon:[],
    directorTecnico:{ nombre:'Walid Regragui', nacionalidad:'Marruecos' },
    resumenHistorico:'Marruecos hizo historia llegando a semifinales en Qatar 2022, la mejor actuación africana en un Mundial.',
    mejorResultado:'Semifinales (2022)',
    jugadoresDestacados:[ { nombre:'Achraf Hakimi', posicion:'Defensor' }, { nombre:'Hakim Ziyech', posicion:'Mediocampista' } ],
  } },
  { id:'hai', nombre:'Haití', nombreCorto:'HAI', confederacion:'CONCACAF', grupo:'C', escudo:'https://flagcdn.com/w80/ht.png', rankingFifa:83, estadisticasTorneo:stats(), wiki:{
    mundialesGanados:0, aniosCampeon:[],
    directorTecnico:{ nombre:'Marc Collat', nacionalidad:'Francia' },
    resumenHistorico:'Haití regresa a una Copa del Mundo tras su única participación histórica en 1974.',
    mejorResultado:'Fase de grupos (1974)',
    jugadoresDestacados:[ { nombre:'Duckens Nazon', posicion:'Delantero' }, { nombre:'Frantzdy Pierrot', posicion:'Delantero' } ],
  } },
  { id:'sco', nombre:'Escocia', nombreCorto:'SCO', confederacion:'UEFA', grupo:'C', escudo:'https://flagcdn.com/w80/gb-sct.png', rankingFifa:39, estadisticasTorneo:stats(), wiki:{
    mundialesGanados:0, aniosCampeon:[],
    directorTecnico:{ nombre:'Steve Clarke', nacionalidad:'Escocia' },
    resumenHistorico:'Escocia vuelve a una Copa del Mundo apoyada en una de las aficiones más célebres y pasionales del fútbol europeo.',
    mejorResultado:'Fase de grupos',
    jugadoresDestacados:[ { nombre:'Scott McTominay', posicion:'Mediocampista' }, { nombre:'Andy Robertson', posicion:'Defensor' } ],
  } },

  // ── GRUPO D ──────────────────────────────────────────────
  { id:'usa', nombre:'Estados Unidos', nombreCorto:'USA', confederacion:'CONCACAF', grupo:'D', escudo:'https://flagcdn.com/w80/us.png', rankingFifa:16, estadisticasTorneo:stats(), wiki:{
    mundialesGanados:0, aniosCampeon:[],
    directorTecnico:{ nombre:'Mauricio Pochettino', nacionalidad:'Argentina' },
    resumenHistorico:'Estados Unidos, coanfitrión del Mundial 2026, atraviesa un boom de talento joven que juega en las principales ligas de Europa.',
    mejorResultado:'Semifinales (1930)',
    jugadoresDestacados:[ { nombre:'Christian Pulisic', posicion:'Extremo' }, { nombre:'Folarin Balogun', posicion:'Delantero' } ],
  } },
  { id:'par', nombre:'Paraguay', nombreCorto:'PAR', confederacion:'CONMEBOL', grupo:'D', escudo:'https://flagcdn.com/w80/py.png', rankingFifa:60, estadisticasTorneo:stats(), wiki:{
    mundialesGanados:0, aniosCampeon:[],
    directorTecnico:{ nombre:'Gustavo Alfaro', nacionalidad:'Argentina' },
    resumenHistorico:'Paraguay regresa a la Copa del Mundo apoyado en una defensa sólida, su sello histórico en el fútbol sudamericano.',
    mejorResultado:'Cuartos de final (2010)',
    jugadoresDestacados:[ { nombre:'Miguel Almirón', posicion:'Extremo' }, { nombre:'Julio Enciso', posicion:'Mediocampista' } ],
  } },
  { id:'aus', nombre:'Australia', nombreCorto:'AUS', confederacion:'AFC', grupo:'D', escudo:'https://flagcdn.com/w80/au.png', rankingFifa:24, estadisticasTorneo:stats(), wiki:{
    mundialesGanados:0, aniosCampeon:[],
    directorTecnico:{ nombre:'Tony Popovic', nacionalidad:'Australia' },
    resumenHistorico:'Australia, los "Socceroos", llega de protagonizar su mejor Mundial histórico en Qatar 2022.',
    mejorResultado:'Octavos de final (2022)',
    jugadoresDestacados:[ { nombre:'Mathew Ryan', posicion:'Arquero' }, { nombre:'Mitchell Duke', posicion:'Delantero' } ],
  } },
  { id:'tur', nombre:'Turquía', nombreCorto:'TUR', confederacion:'UEFA', grupo:'D', escudo:'https://flagcdn.com/w80/tr.png', rankingFifa:29, estadisticasTorneo:stats(), wiki:{
    mundialesGanados:0, aniosCampeon:[],
    directorTecnico:{ nombre:'Vincenzo Montella', nacionalidad:'Italia' },
    resumenHistorico:'Turquía vuelve a una Copa del Mundo tras más de dos décadas, con una de las generaciones más prometedoras de su historia.',
    mejorResultado:'Tercer puesto (2002)',
    jugadoresDestacados:[ { nombre:'Arda Güler', posicion:'Mediocampista' }, { nombre:'Hakan Çalhanoğlu', posicion:'Mediocampista' } ],
  } },

  // ── GRUPO E ──────────────────────────────────────────────
  { id:'ger', nombre:'Alemania', nombreCorto:'GER', confederacion:'UEFA', grupo:'E', escudo:'https://flagcdn.com/w80/de.png', rankingFifa:14, estadisticasTorneo:stats(), wiki:{
    mundialesGanados:4, aniosCampeon:[1954,1974,1990,2014],
    directorTecnico:{ nombre:'Julian Nagelsmann', nacionalidad:'Alemania' },
    resumenHistorico:'Alemania es una de las grandes potencias históricas del fútbol mundial, con cuatro títulos mundialistas en su poder.',
    mejorResultado:'Campeón (4 veces)',
    jugadoresDestacados:[ { nombre:'Jamal Musiala', posicion:'Mediocampista' }, { nombre:'Florian Wirtz', posicion:'Mediocampista' } ],
  } },
  { id:'cur', nombre:'Curazao', nombreCorto:'CUR', confederacion:'CONCACAF', grupo:'E', escudo:'https://flagcdn.com/w80/cw.png', rankingFifa:86, estadisticasTorneo:stats(), wiki:{
    mundialesGanados:0, aniosCampeon:[],
    directorTecnico:{ nombre:'Remko Bicentini', nacionalidad:'Curazao' },
    resumenHistorico:'Curazao, una de las naciones más pequeñas en debutar en una Copa del Mundo, vive el momento más histórico de su fútbol.',
    mejorResultado:'Debut mundialista',
    jugadoresDestacados:[ { nombre:'Leandro Bacuna', posicion:'Mediocampista' }, { nombre:'Tahith Chong', posicion:'Extremo' } ],
  } },
  { id:'civ', nombre:'Costa de Marfil', nombreCorto:'CIV', confederacion:'CAF', grupo:'E', escudo:'https://flagcdn.com/w80/ci.png', rankingFifa:51, estadisticasTorneo:stats(), wiki:{
    mundialesGanados:0, aniosCampeon:[],
    directorTecnico:{ nombre:'Emerse Faé', nacionalidad:'Costa de Marfil' },
    resumenHistorico:'Costa de Marfil, campeona de África vigente, apunta a dar su mejor Mundial con un plantel de jerarquía europea.',
    mejorResultado:'Fase de grupos',
    jugadoresDestacados:[ { nombre:'Sébastien Haller', posicion:'Delantero' }, { nombre:'Franck Kessié', posicion:'Mediocampista' } ],
  } },
  { id:'ecu', nombre:'Ecuador', nombreCorto:'ECU', confederacion:'CONMEBOL', grupo:'E', escudo:'https://flagcdn.com/w80/ec.png', rankingFifa:44, estadisticasTorneo:stats(), wiki:{
    mundialesGanados:0, aniosCampeon:[],
    directorTecnico:{ nombre:'Sebastián Beccacece', nacionalidad:'Argentina' },
    resumenHistorico:'Ecuador es un clásico sudamericano del siglo XXI en Mundiales, conocido por su fortaleza física y su altura de juego.',
    mejorResultado:'Octavos de final (2006)',
    jugadoresDestacados:[ { nombre:'Moisés Caicedo', posicion:'Mediocampista' }, { nombre:'Enner Valencia', posicion:'Delantero' } ],
  } },

  // ── GRUPO F ──────────────────────────────────────────────
  { id:'ned', nombre:'Países Bajos', nombreCorto:'NED', confederacion:'UEFA', grupo:'F', escudo:'https://flagcdn.com/w80/nl.png', rankingFifa:7, estadisticasTorneo:stats(), wiki:{
    mundialesGanados:0, aniosCampeon:[],
    directorTecnico:{ nombre:'Ronald Koeman', nacionalidad:'Países Bajos' },
    resumenHistorico:'Países Bajos es una de las selecciones más influyentes de la historia sin título mundial, con tres finales perdidas.',
    mejorResultado:'Subcampeón (1974, 1978, 2010)',
    jugadoresDestacados:[ { nombre:'Memphis Depay', posicion:'Delantero' }, { nombre:'Virgil van Dijk', posicion:'Defensor' } ],
  } },
  { id:'jpn', nombre:'Japón', nombreCorto:'JPN', confederacion:'AFC', grupo:'F', escudo:'https://flagcdn.com/w80/jp.png', rankingFifa:17, estadisticasTorneo:stats(), wiki:{
    mundialesGanados:0, aniosCampeon:[],
    directorTecnico:{ nombre:'Hajime Moriyasu', nacionalidad:'Japón' },
    resumenHistorico:'Japón es la principal referencia asiática reciente, con presencia ininterrumpida en Copas del Mundo desde 1998.',
    mejorResultado:'Octavos de final (2002, 2010, 2018, 2022)',
    jugadoresDestacados:[ { nombre:'Takefusa Kubo', posicion:'Extremo' }, { nombre:'Kaoru Mitoma', posicion:'Extremo' } ],
  } },
  { id:'swe', nombre:'Suecia', nombreCorto:'SWE', confederacion:'UEFA', grupo:'F', escudo:'https://flagcdn.com/w80/se.png', rankingFifa:25, estadisticasTorneo:stats(), wiki:{
    mundialesGanados:0, aniosCampeon:[],
    directorTecnico:{ nombre:'Jon Dahl Tomasson', nacionalidad:'Dinamarca' },
    resumenHistorico:'Suecia tiene una rica historia mundialista, con una final disputada en 1958 jugando como anfitriona.',
    mejorResultado:'Subcampeón (1958)',
    jugadoresDestacados:[ { nombre:'Alexander Isak', posicion:'Delantero' }, { nombre:'Dejan Kulusevski', posicion:'Mediocampista' } ],
  } },
  { id:'tun', nombre:'Túnez', nombreCorto:'TUN', confederacion:'CAF', grupo:'F', escudo:'https://flagcdn.com/w80/tn.png', rankingFifa:34, estadisticasTorneo:stats(), wiki:{
    mundialesGanados:0, aniosCampeon:[],
    directorTecnico:{ nombre:'Faouzi Benzarti', nacionalidad:'Túnez' },
    resumenHistorico:'Túnez es uno de los representantes africanos más constantes de los últimos Mundiales.',
    mejorResultado:'Fase de grupos',
    jugadoresDestacados:[ { nombre:'Hannibal Mejbri', posicion:'Mediocampista' }, { nombre:'Issam Jebali', posicion:'Delantero' } ],
  } },

  // ── GRUPO G ──────────────────────────────────────────────
  { id:'bel', nombre:'Bélgica', nombreCorto:'BEL', confederacion:'UEFA', grupo:'G', escudo:'https://flagcdn.com/w80/be.png', rankingFifa:3, estadisticasTorneo:stats(), wiki:{
    mundialesGanados:0, aniosCampeon:[],
    directorTecnico:{ nombre:'Domenico Tedesco', nacionalidad:'Alemania' },
    resumenHistorico:'Bélgica vivió su "generación dorada" liderada por Kevin De Bruyne, que la llevó al tercer puesto en Rusia 2018.',
    mejorResultado:'Tercer puesto (2018)',
    jugadoresDestacados:[ { nombre:'Kevin De Bruyne', posicion:'Mediocampista' }, { nombre:'Jérémy Doku', posicion:'Extremo' } ],
  } },
  { id:'egy', nombre:'Egipto', nombreCorto:'EGY', confederacion:'CAF', grupo:'G', escudo:'https://flagcdn.com/w80/eg.png', rankingFifa:32, estadisticasTorneo:stats(), wiki:{
    mundialesGanados:0, aniosCampeon:[],
    directorTecnico:{ nombre:'Hossam Hassan', nacionalidad:'Egipto' },
    resumenHistorico:'Egipto, la mayor potencia histórica africana en títulos continentales, busca romper su sequía mundialista.',
    mejorResultado:'Fase de grupos',
    jugadoresDestacados:[ { nombre:'Mohamed Salah', posicion:'Delantero' }, { nombre:'Omar Marmoush', posicion:'Delantero' } ],
  } },
  { id:'iri', nombre:'Irán', nombreCorto:'IRI', confederacion:'AFC', grupo:'G', escudo:'https://flagcdn.com/w80/ir.png', rankingFifa:23, estadisticasTorneo:stats(), wiki:{
    mundialesGanados:0, aniosCampeon:[],
    directorTecnico:{ nombre:'Amir Ghalenoei', nacionalidad:'Irán' },
    resumenHistorico:'Irán es un habitual asiático de Copas del Mundo, con participaciones destacadas desde los años 70.',
    mejorResultado:'Fase de grupos',
    jugadoresDestacados:[ { nombre:'Sardar Azmoun', posicion:'Delantero' }, { nombre:'Mehdi Taremi', posicion:'Delantero' } ],
  } },
  { id:'nzl', nombre:'Nueva Zelanda', nombreCorto:'NZL', confederacion:'OFC', grupo:'G', escudo:'https://flagcdn.com/w80/nz.png', rankingFifa:96, estadisticasTorneo:stats(), wiki:{
    mundialesGanados:0, aniosCampeon:[],
    directorTecnico:{ nombre:'Darren Bazeley', nacionalidad:'Nueva Zelanda' },
    resumenHistorico:'Nueva Zelanda representa a Oceanía, recordada por terminar invicta la fase de grupos de Sudáfrica 2010.',
    mejorResultado:'Fase de grupos (invicta en 2010)',
    jugadoresDestacados:[ { nombre:'Chris Wood', posicion:'Delantero' }, { nombre:'Marko Stamenić', posicion:'Mediocampista' } ],
  } },

  // ── GRUPO H ──────────────────────────────────────────────
  { id:'esp', nombre:'España', nombreCorto:'ESP', confederacion:'UEFA', grupo:'H', escudo:'https://flagcdn.com/w80/es.png', rankingFifa:4, estadisticasTorneo:stats(), wiki:{
    mundialesGanados:1, aniosCampeon:[2010],
    directorTecnico:{ nombre:'Luis de la Fuente', nacionalidad:'España' },
    resumenHistorico:'España es campeona del mundo y vigente campeona de Europa, referente del fútbol de posesión de las últimas dos décadas.',
    mejorResultado:'Campeón (2010)',
    jugadoresDestacados:[ { nombre:'Lamine Yamal', posicion:'Extremo' }, { nombre:'Pedri', posicion:'Mediocampista' } ],
  } },
  { id:'cpv', nombre:'Cabo Verde', nombreCorto:'CPV', confederacion:'CAF', grupo:'H', escudo:'https://flagcdn.com/w80/cv.png', rankingFifa:77, estadisticasTorneo:stats(), wiki:{
    mundialesGanados:0, aniosCampeon:[],
    directorTecnico:{ nombre:'Pedro Brito', nacionalidad:'Cabo Verde' },
    resumenHistorico:'Cabo Verde, debutante absoluto en una Copa del Mundo, vive el mayor logro deportivo de su historia.',
    mejorResultado:'Debut mundialista',
    jugadoresDestacados:[ { nombre:'Ryan Mendes', posicion:'Extremo' }, { nombre:'Jamiro Monteiro', posicion:'Mediocampista' } ],
  } },
  { id:'ksa', nombre:'Arabia Saudí', nombreCorto:'KSA', confederacion:'AFC', grupo:'H', escudo:'https://flagcdn.com/w80/sa.png', rankingFifa:56, estadisticasTorneo:stats(), wiki:{
    mundialesGanados:0, aniosCampeon:[],
    directorTecnico:{ nombre:'Roberto Mancini', nacionalidad:'Italia' },
    resumenHistorico:'Arabia Saudí sorprendió al mundo al vencer a Argentina en Qatar 2022, uno de los resultados más recordados del fútbol asiático.',
    mejorResultado:'Octavos de final (1994)',
    jugadoresDestacados:[ { nombre:'Salem Al-Dawsari', posicion:'Extremo' }, { nombre:'Firas Al-Buraikan', posicion:'Delantero' } ],
  } },
  { id:'uru', nombre:'Uruguay', nombreCorto:'URU', confederacion:'CONMEBOL', grupo:'H', escudo:'https://flagcdn.com/w80/uy.png', rankingFifa:18, estadisticasTorneo:stats(), wiki:{
    mundialesGanados:2, aniosCampeon:[1930,1950],
    directorTecnico:{ nombre:'Marcelo Bielsa', nacionalidad:'Argentina' },
    resumenHistorico:'Uruguay es bicampeón del mundo y una de las selecciones de mayor tradición histórica, anfitriona y campeona del primer Mundial de 1930.',
    mejorResultado:'Campeón (1930, 1950)',
    jugadoresDestacados:[ { nombre:'Darwin Núñez', posicion:'Delantero' }, { nombre:'Federico Valverde', posicion:'Mediocampista' } ],
  } },

  // ── GRUPO I ──────────────────────────────────────────────
  { id:'fra', nombre:'Francia', nombreCorto:'FRA', confederacion:'UEFA', grupo:'I', escudo:'https://flagcdn.com/w80/fr.png', rankingFifa:2, estadisticasTorneo:stats(), wiki:{
    mundialesGanados:2, aniosCampeon:[1998,2018],
    directorTecnico:{ nombre:'Didier Deschamps', nacionalidad:'Francia' },
    resumenHistorico:'Francia es bicampeona del mundo y una de las selecciones más competitivas de las últimas décadas.',
    mejorResultado:'Campeón (1998, 2018)',
    jugadoresDestacados:[ { nombre:'Kylian Mbappé', posicion:'Delantero' }, { nombre:'Aurélien Tchouaméni', posicion:'Mediocampista' } ],
  } },
  { id:'sen', nombre:'Senegal', nombreCorto:'SEN', confederacion:'CAF', grupo:'I', escudo:'https://flagcdn.com/w80/sn.png', rankingFifa:20, estadisticasTorneo:stats(), wiki:{
    mundialesGanados:0, aniosCampeon:[],
    directorTecnico:{ nombre:'Aliou Cissé', nacionalidad:'Senegal' },
    resumenHistorico:'Senegal, campeón de África vigente en su continente, es una de las grandes potencias del fútbol africano actual.',
    mejorResultado:'Cuartos de final (2002)',
    jugadoresDestacados:[ { nombre:'Sadio Mané', posicion:'Delantero' }, { nombre:'Nicolas Jackson', posicion:'Delantero' } ],
  } },
  { id:'irq', nombre:'Irak', nombreCorto:'IRQ', confederacion:'AFC', grupo:'I', escudo:'https://flagcdn.com/w80/iq.png', rankingFifa:55, estadisticasTorneo:stats(), wiki:{
    mundialesGanados:0, aniosCampeon:[],
    directorTecnico:{ nombre:'Jesús Casas', nacionalidad:'España' },
    resumenHistorico:'Irak vuelve a una Copa del Mundo apoyado en un fútbol en ascenso dentro de la confederación asiática.',
    mejorResultado:'Fase de grupos',
    jugadoresDestacados:[ { nombre:'Aymen Hussein', posicion:'Delantero' }, { nombre:'Ali Jasim', posicion:'Extremo' } ],
  } },
  { id:'nor', nombre:'Noruega', nombreCorto:'NOR', confederacion:'UEFA', grupo:'I', escudo:'https://flagcdn.com/w80/no.png', rankingFifa:26, estadisticasTorneo:stats(), wiki:{
    mundialesGanados:0, aniosCampeon:[],
    directorTecnico:{ nombre:'Ståle Solbakken', nacionalidad:'Noruega' },
    resumenHistorico:'Noruega vuelve a un Mundial después de más de dos décadas, con Erling Haaland como su gran estandarte.',
    mejorResultado:'Octavos de final (1994, 1998)',
    jugadoresDestacados:[ { nombre:'Erling Haaland', posicion:'Delantero' }, { nombre:'Martin Ødegaard', posicion:'Mediocampista' } ],
  } },

  // ── GRUPO J ──────────────────────────────────────────────
  { id:'arg', nombre:'Argentina', nombreCorto:'ARG', confederacion:'CONMEBOL', grupo:'J', escudo:'https://flagcdn.com/w80/ar.png', rankingFifa:1, estadisticasTorneo:stats(), wiki:{
    mundialesGanados:3, aniosCampeon:[1978,1986,2022],
    directorTecnico:{ nombre:'Lionel Scaloni', nacionalidad:'Argentina' },
    resumenHistorico:'Argentina es tricampeona del mundo y vigente campeona, con Lionel Messi como su máximo emblema histórico.',
    mejorResultado:'Campeón (1978, 1986, 2022)',
    jugadoresDestacados:[ { nombre:'Lionel Messi', posicion:'Delantero' }, { nombre:'Julián Álvarez', posicion:'Delantero' } ],
  } },
  { id:'alg', nombre:'Argelia', nombreCorto:'ALG', confederacion:'CAF', grupo:'J', escudo:'https://flagcdn.com/w80/dz.png', rankingFifa:42, estadisticasTorneo:stats(), wiki:{
    mundialesGanados:0, aniosCampeon:[],
    directorTecnico:{ nombre:'Vladimir Petković', nacionalidad:'Suiza' },
    resumenHistorico:'Argelia es una de las selecciones árabe-africanas más combativas, recordada por su gran actuación en Brasil 2014.',
    mejorResultado:'Octavos de final (2014)',
    jugadoresDestacados:[ { nombre:'Riyad Mahrez', posicion:'Extremo' }, { nombre:'Ismaël Bennacer', posicion:'Mediocampista' } ],
  } },
  { id:'aut', nombre:'Austria', nombreCorto:'AUT', confederacion:'UEFA', grupo:'J', escudo:'https://flagcdn.com/w80/at.png', rankingFifa:27, estadisticasTorneo:stats(), wiki:{
    mundialesGanados:0, aniosCampeon:[],
    directorTecnico:{ nombre:'Ralf Rangnick', nacionalidad:'Alemania' },
    resumenHistorico:'Austria atraviesa un renacimiento futbolístico con una generación ofensiva muy destacada en las principales ligas europeas.',
    mejorResultado:'Cuartos de final (1934, 1954)',
    jugadoresDestacados:[ { nombre:'David Alaba', posicion:'Defensor' }, { nombre:'Marcel Sabitzer', posicion:'Mediocampista' } ],
  } },
  { id:'jor', nombre:'Jordania', nombreCorto:'JOR', confederacion:'AFC', grupo:'J', escudo:'https://flagcdn.com/w80/jo.png', rankingFifa:71, estadisticasTorneo:stats(), wiki:{
    mundialesGanados:0, aniosCampeon:[],
    directorTecnico:{ nombre:'Hussein Ammouta', nacionalidad:'Marruecos' },
    resumenHistorico:'Jordania vive su primera clasificación mundialista tras alcanzar la final de la Copa de Asia 2023.',
    mejorResultado:'Debut mundialista',
    jugadoresDestacados:[ { nombre:'Musa Al-Taamari', posicion:'Extremo' }, { nombre:'Yazan Al-Naimat', posicion:'Delantero' } ],
  } },

  // ── GRUPO K ──────────────────────────────────────────────
  { id:'por', nombre:'Portugal', nombreCorto:'POR', confederacion:'UEFA', grupo:'K', escudo:'https://flagcdn.com/w80/pt.png', rankingFifa:6, estadisticasTorneo:stats(), wiki:{
    mundialesGanados:0, aniosCampeon:[],
    directorTecnico:{ nombre:'Roberto Martínez', nacionalidad:'España' },
    resumenHistorico:'Portugal cuenta con una de las generaciones más talentosas de Europa de las últimas décadas, aunque todavía sin título mundialista.',
    mejorResultado:'Tercer puesto (1966)',
    jugadoresDestacados:[ { nombre:'Cristiano Ronaldo', posicion:'Delantero' }, { nombre:'Bruno Fernandes', posicion:'Mediocampista' } ],
  } },
  { id:'cod', nombre:'RD Congo', nombreCorto:'COD', confederacion:'CAF', grupo:'K', escudo:'https://flagcdn.com/w80/cd.png', rankingFifa:50, estadisticasTorneo:stats(), wiki:{
    mundialesGanados:0, aniosCampeon:[],
    directorTecnico:{ nombre:'Sébastien Desabre', nacionalidad:'Francia' },
    resumenHistorico:'RD Congo, los "Leopardos", busca volver a un Mundial tras su única participación histórica como Zaire en 1974.',
    mejorResultado:'Fase de grupos (1974, como Zaire)',
    jugadoresDestacados:[ { nombre:'Chancel Mbemba', posicion:'Defensor' }, { nombre:'Yoane Wissa', posicion:'Delantero' } ],
  } },
  { id:'uzb', nombre:'Uzbekistán', nombreCorto:'UZB', confederacion:'AFC', grupo:'K', escudo:'https://flagcdn.com/w80/uz.png', rankingFifa:65, estadisticasTorneo:stats(), wiki:{
    mundialesGanados:0, aniosCampeon:[],
    directorTecnico:{ nombre:'Srečko Katanec', nacionalidad:'Eslovenia' },
    resumenHistorico:'Uzbekistán logra su histórica clasificación debut a una Copa del Mundo, un hito para el fútbol centroasiático.',
    mejorResultado:'Debut mundialista',
    jugadoresDestacados:[ { nombre:'Eldor Shomurodov', posicion:'Delantero' }, { nombre:'Abbosbek Fayzullaev', posicion:'Mediocampista' } ],
  } },
  { id:'col', nombre:'Colombia', nombreCorto:'COL', confederacion:'CONMEBOL', grupo:'K', escudo:'https://flagcdn.com/w80/co.png', rankingFifa:9, estadisticasTorneo:stats(), wiki:{
    mundialesGanados:0, aniosCampeon:[],
    directorTecnico:{ nombre:'Néstor Lorenzo', nacionalidad:'Argentina' },
    resumenHistorico:'Colombia es un clásico sudamericano del siglo XXI en Mundiales, con su mejor actuación reciente en Brasil 2014.',
    mejorResultado:'Cuartos de final (2014)',
    jugadoresDestacados:[ { nombre:'Luis Díaz', posicion:'Extremo' }, { nombre:'James Rodríguez', posicion:'Mediocampista' } ],
  } },

  // ── GRUPO L ──────────────────────────────────────────────
  { id:'eng', nombre:'Inglaterra', nombreCorto:'ENG', confederacion:'UEFA', grupo:'L', escudo:'https://flagcdn.com/w80/gb-eng.png', rankingFifa:5, estadisticasTorneo:stats(), wiki:{
    mundialesGanados:1, aniosCampeon:[1966],
    directorTecnico:{ nombre:'Thomas Tuchel', nacionalidad:'Alemania' },
    resumenHistorico:'Inglaterra, inventora del fútbol moderno, es campeona del mundo de 1966 jugando como anfitriona.',
    mejorResultado:'Campeón (1966)',
    jugadoresDestacados:[ { nombre:'Jude Bellingham', posicion:'Mediocampista' }, { nombre:'Harry Kane', posicion:'Delantero' } ],
  } },
  { id:'cro', nombre:'Croacia', nombreCorto:'CRO', confederacion:'UEFA', grupo:'L', escudo:'https://flagcdn.com/w80/hr.png', rankingFifa:10, estadisticasTorneo:stats(), wiki:{
    mundialesGanados:0, aniosCampeon:[],
    directorTecnico:{ nombre:'Zlatko Dalić', nacionalidad:'Croacia' },
    resumenHistorico:'Croacia ha sido una de las selecciones más competitivas del siglo XXI, subcampeona del mundo en Rusia 2018.',
    mejorResultado:'Subcampeón (2018)',
    jugadoresDestacados:[ { nombre:'Luka Modrić', posicion:'Mediocampista' }, { nombre:'Joško Gvardiol', posicion:'Defensor' } ],
  } },
  { id:'gha', nombre:'Ghana', nombreCorto:'GHA', confederacion:'CAF', grupo:'L', escudo:'https://flagcdn.com/w80/gh.png', rankingFifa:64, estadisticasTorneo:stats(), wiki:{
    mundialesGanados:0, aniosCampeon:[],
    directorTecnico:{ nombre:'Otto Addo', nacionalidad:'Ghana' },
    resumenHistorico:'Ghana, los "Black Stars", es uno de los representantes africanos más constantes en los Mundiales recientes.',
    mejorResultado:'Cuartos de final (2010)',
    jugadoresDestacados:[ { nombre:'Mohammed Kudus', posicion:'Extremo' }, { nombre:'Thomas Partey', posicion:'Mediocampista' } ],
  } },
  { id:'pan', nombre:'Panamá', nombreCorto:'PAN', confederacion:'CONCACAF', grupo:'L', escudo:'https://flagcdn.com/w80/pa.png', rankingFifa:54, estadisticasTorneo:stats(), wiki:{
    mundialesGanados:0, aniosCampeon:[],
    directorTecnico:{ nombre:'Thomas Christiansen', nacionalidad:'Alemania' },
    resumenHistorico:'Panamá vive su segunda clasificación mundialista, reflejo del crecimiento del fútbol centroamericano.',
    mejorResultado:'Fase de grupos (2018)',
    jugadoresDestacados:[ { nombre:'Adalberto Carrasquilla', posicion:'Mediocampista' }, { nombre:'José Fajardo', posicion:'Delantero' } ],
  } },
];

function stats() {
  return {
    puntos:0, partidosJugados:0, partidosGanados:0,
    partidosEmpatados:0, partidosPerdidos:0,
    golesFavor:0, golesContra:0, diferenciaGoles:0,
  };
}

export function obtenerEquipoPorId(id) {
  return equipos.find(e => e.id === id);
}

export function obtenerEquiposPorGrupo(grupo) {
  return equipos.filter(e => e.grupo === grupo);
}

export function obtenerListaDeGrupos() {
  return [...new Set(equipos.map(e => e.grupo))].sort();
}
