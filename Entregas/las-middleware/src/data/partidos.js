const partidosBase = [
  // ===== GRUPO A =====
  { id: 'a1', grupo: 'A', local: 'mex', visitante: 'rsa', fecha: '2026-06-11', hora: '15:00', fase: 'grupos', jornada: 1, resultado: { golesLocal: 2, golesVisitante: 0, goles: [] } },
  { id: 'a2', grupo: 'A', local: 'kor', visitante: 'cze', fecha: '2026-06-11', hora: '22:00', fase: 'grupos', jornada: 1, resultado: { golesLocal: 2, golesVisitante: 1, goles: [] } },
  { id: 'a3', grupo: 'A', local: 'cze', visitante: 'rsa', fecha: '2026-06-18', hora: '12:00', fase: 'grupos', jornada: 2 },
  { id: 'a4', grupo: 'A', local: 'mex', visitante: 'kor', fecha: '2026-06-18', hora: '21:00', fase: 'grupos', jornada: 2 },
  { id: 'a5', grupo: 'A', local: 'cze', visitante: 'mex', fecha: '2026-06-24', hora: '21:00', fase: 'grupos', jornada: 3 },
  { id: 'a6', grupo: 'A', local: 'rsa', visitante: 'kor', fecha: '2026-06-24', hora: '21:00', fase: 'grupos', jornada: 3 },

  // ===== GRUPO B =====
  { id: 'b1', grupo: 'B', local: 'can', visitante: 'bih', fecha: '2026-06-12', hora: '15:00', fase: 'grupos', jornada: 1, resultado: { golesLocal: 1, golesVisitante: 1, goles: [] } },
  { id: 'b2', grupo: 'B', local: 'sui', visitante: 'qat', fecha: '2026-06-13', hora: '15:00', fase: 'grupos', jornada: 1, resultado: { golesLocal: 1, golesVisitante: 1, goles: [] } },
  { id: 'b3', grupo: 'B', local: 'sui', visitante: 'bih', fecha: '2026-06-18', hora: '15:00', fase: 'grupos', jornada: 2 },
  { id: 'b4', grupo: 'B', local: 'can', visitante: 'qat', fecha: '2026-06-18', hora: '18:00', fase: 'grupos', jornada: 2 },
  { id: 'b5', grupo: 'B', local: 'sui', visitante: 'can', fecha: '2026-06-24', hora: '15:00', fase: 'grupos', jornada: 3 },
  { id: 'b6', grupo: 'B', local: 'bih', visitante: 'qat', fecha: '2026-06-24', hora: '15:00', fase: 'grupos', jornada: 3 },

  // ===== GRUPO C =====
  { id: 'c1', grupo: 'C', local: 'bra', visitante: 'mar', fecha: '2026-06-13', hora: '18:00', fase: 'grupos', jornada: 1 },
  { id: 'c2', grupo: 'C', local: 'hai', visitante: 'sco', fecha: '2026-06-13', hora: '21:00', fase: 'grupos', jornada: 1 },
  { id: 'c3', grupo: 'C', local: 'sco', visitante: 'mar', fecha: '2026-06-19', hora: '15:00', fase: 'grupos', jornada: 2 },
  { id: 'c4', grupo: 'C', local: 'bra', visitante: 'hai', fecha: '2026-06-19', hora: '18:00', fase: 'grupos', jornada: 2 },
  { id: 'c5', grupo: 'C', local: 'sco', visitante: 'bra', fecha: '2026-06-25', hora: '15:00', fase: 'grupos', jornada: 3 },
  { id: 'c6', grupo: 'C', local: 'mar', visitante: 'hai', fecha: '2026-06-25', hora: '15:00', fase: 'grupos', jornada: 3 },

  // ===== GRUPO D =====
  { id: 'd1', grupo: 'D', local: 'usa', visitante: 'par', fecha: '2026-06-12', hora: '21:00', fase: 'grupos', jornada: 1, resultado: { golesLocal: 4, golesVisitante: 1, goles: [] } },
  { id: 'd2', grupo: 'D', local: 'aus', visitante: 'tur', fecha: '2026-06-13', hora: '22:00', fase: 'grupos', jornada: 1 },
  { id: 'd3', grupo: 'D', local: 'tur', visitante: 'par', fecha: '2026-06-19', hora: '21:00', fase: 'grupos', jornada: 2 },
  { id: 'd4', grupo: 'D', local: 'usa', visitante: 'aus', fecha: '2026-06-19', hora: '15:00', fase: 'grupos', jornada: 2 },
  { id: 'd5', grupo: 'D', local: 'tur', visitante: 'usa', fecha: '2026-06-25', hora: '22:00', fase: 'grupos', jornada: 3 },
  { id: 'd6', grupo: 'D', local: 'par', visitante: 'aus', fecha: '2026-06-25', hora: '22:00', fase: 'grupos', jornada: 3 },

  // ===== GRUPO E =====
  { id: 'e1', grupo: 'E', local: 'ger', visitante: 'cuw', fecha: '2026-06-14', hora: '13:00', fase: 'grupos', jornada: 1 },
  { id: 'e2', grupo: 'E', local: 'civ', visitante: 'ecu', fecha: '2026-06-14', hora: '19:00', fase: 'grupos', jornada: 1 },
  { id: 'e3', grupo: 'E', local: 'ecu', visitante: 'cuw', fecha: '2026-06-20', hora: '15:00', fase: 'grupos', jornada: 2 },
  { id: 'e4', grupo: 'E', local: 'ger', visitante: 'civ', fecha: '2026-06-20', hora: '18:00', fase: 'grupos', jornada: 2 },
  { id: 'e5', grupo: 'E', local: 'ecu', visitante: 'ger', fecha: '2026-06-26', hora: '15:00', fase: 'grupos', jornada: 3 },
  { id: 'e6', grupo: 'E', local: 'cuw', visitante: 'civ', fecha: '2026-06-26', hora: '15:00', fase: 'grupos', jornada: 3 },

  // ===== GRUPO F =====
  { id: 'f1', grupo: 'F', local: 'ned', visitante: 'jpn', fecha: '2026-06-14', hora: '16:00', fase: 'grupos', jornada: 1 },
  { id: 'f2', grupo: 'F', local: 'swe', visitante: 'tun', fecha: '2026-06-14', hora: '22:00', fase: 'grupos', jornada: 1 },
  { id: 'f3', grupo: 'F', local: 'tun', visitante: 'jpn', fecha: '2026-06-20', hora: '21:00', fase: 'grupos', jornada: 2 },
  { id: 'f4', grupo: 'F', local: 'ned', visitante: 'swe', fecha: '2026-06-20', hora: '18:00', fase: 'grupos', jornada: 2 },
  { id: 'f5', grupo: 'F', local: 'tun', visitante: 'ned', fecha: '2026-06-26', hora: '18:00', fase: 'grupos', jornada: 3 },
  { id: 'f6', grupo: 'F', local: 'jpn', visitante: 'swe', fecha: '2026-06-26', hora: '18:00', fase: 'grupos', jornada: 3 },

  // ===== GRUPO G =====
  { id: 'g1', grupo: 'G', local: 'bel', visitante: 'egy', fecha: '2026-06-15', hora: '15:00', fase: 'grupos', jornada: 1 },
  { id: 'g2', grupo: 'G', local: 'irn', visitante: 'nzl', fecha: '2026-06-15', hora: '21:00', fase: 'grupos', jornada: 1 },
  { id: 'g3', grupo: 'G', local: 'nzl', visitante: 'egy', fecha: '2026-06-21', hora: '15:00', fase: 'grupos', jornada: 2 },
  { id: 'g4', grupo: 'G', local: 'bel', visitante: 'irn', fecha: '2026-06-21', hora: '18:00', fase: 'grupos', jornada: 2 },
  { id: 'g5', grupo: 'G', local: 'nzl', visitante: 'bel', fecha: '2026-06-27', hora: '15:00', fase: 'grupos', jornada: 3 },
  { id: 'g6', grupo: 'G', local: 'egy', visitante: 'irn', fecha: '2026-06-27', hora: '15:00', fase: 'grupos', jornada: 3 },

  // ===== GRUPO H =====
  { id: 'h1', grupo: 'H', local: 'esp', visitante: 'cpv', fecha: '2026-06-15', hora: '12:00', fase: 'grupos', jornada: 1 },
  { id: 'h2', grupo: 'H', local: 'ksa', visitante: 'ury', fecha: '2026-06-15', hora: '18:00', fase: 'grupos', jornada: 1 },
  { id: 'h3', grupo: 'H', local: 'ury', visitante: 'cpv', fecha: '2026-06-21', hora: '18:00', fase: 'grupos', jornada: 2 },
  { id: 'h4', grupo: 'H', local: 'esp', visitante: 'ksa', fecha: '2026-06-21', hora: '12:00', fase: 'grupos', jornada: 2 },
  { id: 'h5', grupo: 'H', local: 'cpv', visitante: 'ksa', fecha: '2026-06-27', hora: '18:00', fase: 'grupos', jornada: 3 },
  { id: 'h6', grupo: 'H', local: 'ury', visitante: 'esp', fecha: '2026-06-27', hora: '18:00', fase: 'grupos', jornada: 3 },

  // ===== GRUPO I =====
  { id: 'i1', grupo: 'I', local: 'fra', visitante: 'sen', fecha: '2026-06-16', hora: '15:00', fase: 'grupos', jornada: 1 },
  { id: 'i2', grupo: 'I', local: 'irq', visitante: 'nor', fecha: '2026-06-16', hora: '18:00', fase: 'grupos', jornada: 1 },
  { id: 'i3', grupo: 'I', local: 'nor', visitante: 'sen', fecha: '2026-06-22', hora: '15:00', fase: 'grupos', jornada: 2 },
  { id: 'i4', grupo: 'I', local: 'fra', visitante: 'irq', fecha: '2026-06-22', hora: '18:00', fase: 'grupos', jornada: 2 },
  { id: 'i5', grupo: 'I', local: 'nor', visitante: 'fra', fecha: '2026-06-27', hora: '21:00', fase: 'grupos', jornada: 3 },
  { id: 'i6', grupo: 'I', local: 'sen', visitante: 'irq', fecha: '2026-06-27', hora: '21:00', fase: 'grupos', jornada: 3 },

  // ===== GRUPO J =====
  { id: 'j1', grupo: 'J', local: 'arg', visitante: 'alg', fecha: '2026-06-16', hora: '21:00', fase: 'grupos', jornada: 1 },
  { id: 'j2', grupo: 'J', local: 'aut', visitante: 'jor', fecha: '2026-06-16', hora: '22:00', fase: 'grupos', jornada: 1 },
  { id: 'j3', grupo: 'J', local: 'jor', visitante: 'alg', fecha: '2026-06-22', hora: '21:00', fase: 'grupos', jornada: 2 },
  { id: 'j4', grupo: 'J', local: 'arg', visitante: 'aut', fecha: '2026-06-22', hora: '18:00', fase: 'grupos', jornada: 2 },
  { id: 'j5', grupo: 'J', local: 'jor', visitante: 'arg', fecha: '2026-06-27', hora: '22:00', fase: 'grupos', jornada: 3 },
  { id: 'j6', grupo: 'J', local: 'alg', visitante: 'aut', fecha: '2026-06-27', hora: '22:00', fase: 'grupos', jornada: 3 },

  // ===== GRUPO K =====
  { id: 'k1', grupo: 'K', local: 'por', visitante: 'cod', fecha: '2026-06-17', hora: '13:00', fase: 'grupos', jornada: 1 },
  { id: 'k2', grupo: 'K', local: 'uzb', visitante: 'col', fecha: '2026-06-17', hora: '22:00', fase: 'grupos', jornada: 1 },
  { id: 'k3', grupo: 'K', local: 'col', visitante: 'cod', fecha: '2026-06-23', hora: '18:00', fase: 'grupos', jornada: 2 },
  { id: 'k4', grupo: 'K', local: 'por', visitante: 'uzb', fecha: '2026-06-23', hora: '15:00', fase: 'grupos', jornada: 2 },
  { id: 'k5', grupo: 'K', local: 'col', visitante: 'por', fecha: '2026-06-27', hora: '22:00', fase: 'grupos', jornada: 3 },
  { id: 'k6', grupo: 'K', local: 'cod', visitante: 'uzb', fecha: '2026-06-27', hora: '22:00', fase: 'grupos', jornada: 3 },

  // ===== GRUPO L =====
  { id: 'l1', grupo: 'L', local: 'eng', visitante: 'cro', fecha: '2026-06-17', hora: '16:00', fase: 'grupos', jornada: 1 },
  { id: 'l2', grupo: 'L', local: 'gha', visitante: 'pan', fecha: '2026-06-17', hora: '19:00', fase: 'grupos', jornada: 1 },
  { id: 'l3', grupo: 'L', local: 'pan', visitante: 'cro', fecha: '2026-06-23', hora: '21:00', fase: 'grupos', jornada: 2 },
  { id: 'l4', grupo: 'L', local: 'eng', visitante: 'gha', fecha: '2026-06-23', hora: '15:00', fase: 'grupos', jornada: 2 },
  { id: 'l5', grupo: 'L', local: 'pan', visitante: 'eng', fecha: '2026-06-27', hora: '22:00', fase: 'grupos', jornada: 3 },
  { id: 'l6', grupo: 'L', local: 'cro', visitante: 'gha', fecha: '2026-06-27', hora: '22:00', fase: 'grupos', jornada: 3 }
];

// Generate Round of 32 structure (16 matches, ids r32_1 to r32_16)
for (let i = 1; i <= 16; i++) {
  const matchNum = 72 + i;
  partidosBase.push({
    id: `r32_${i}`,
    fase: 'r32',
    local: null,
    visitante: null,
    fecha: '',
    hora: '',
    ronda: 'Dieciseisavos',
    fixture: i,
    matchNum
  });
}

// Generate Round of 16 (8 matches, ids r16_1 to r16_8)
for (let i = 1; i <= 8; i++) {
  const matchNum = 88 + i;
  partidosBase.push({
    id: `r16_${i}`,
    fase: 'r16',
    local: null,
    visitante: null,
    fecha: '',
    hora: '',
    ronda: 'Octavos',
    fixture: i,
    matchNum
  });
}

// Quarterfinals (4 matches)
for (let i = 1; i <= 4; i++) {
  partidosBase.push({
    id: `qf_${i}`,
    fase: 'qf',
    local: null,
    visitante: null,
    fecha: '',
    hora: '',
    ronda: 'Cuartos',
    fixture: i
  });
}

// Semifinals (2 matches)
for (let i = 1; i <= 2; i++) {
  partidosBase.push({
    id: `sf_${i}`,
    fase: 'sf',
    local: null,
    visitante: null,
    fecha: '',
    hora: '',
    ronda: 'Semifinales',
    fixture: i
  });
}

// Third place
partidosBase.push({
  id: 'tp',
  fase: 'tp',
  local: null,
  visitante: null,
  fecha: '',
  hora: '',
  ronda: 'Tercer Puesto'
});

// Final
partidosBase.push({
  id: 'final',
  fase: 'final',
  local: null,
  visitante: null,
  fecha: '',
  hora: '',
  ronda: 'Final'
});
