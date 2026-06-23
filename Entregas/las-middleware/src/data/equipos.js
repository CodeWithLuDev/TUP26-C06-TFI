const equipos = [
  { id: 'mex', nombre: 'México', bandera: '🇲🇽', grupo: 'A' },
  { id: 'rsa', nombre: 'Sudáfrica', bandera: '🇿🇦', grupo: 'A' },
  { id: 'kor', nombre: 'Corea del Sur', bandera: '🇰🇷', grupo: 'A' },
  { id: 'cze', nombre: 'Chequia', bandera: '🇨🇿', grupo: 'A' },
  { id: 'can', nombre: 'Canadá', bandera: '🇨🇦', grupo: 'B' },
  { id: 'bih', nombre: 'Bosnia y Herzegovina', bandera: '🇧🇦', grupo: 'B' },
  { id: 'qat', nombre: 'Qatar', bandera: '🇶🇦', grupo: 'B' },
  { id: 'sui', nombre: 'Suiza', bandera: '🇨🇭', grupo: 'B' },
  { id: 'bra', nombre: 'Brasil', bandera: '🇧🇷', grupo: 'C' },
  { id: 'mar', nombre: 'Marruecos', bandera: '🇲🇦', grupo: 'C' },
  { id: 'hai', nombre: 'Haití', bandera: '🇭🇹', grupo: 'C' },
  { id: 'sco', nombre: 'Escocia', bandera: '🏴󠁧󠁢󠁳󠁣󠁴󠁿', grupo: 'C' },
  { id: 'usa', nombre: 'EE.UU.', bandera: '🇺🇸', grupo: 'D' },
  { id: 'par', nombre: 'Paraguay', bandera: '🇵🇾', grupo: 'D' },
  { id: 'aus', nombre: 'Australia', bandera: '🇦🇺', grupo: 'D' },
  { id: 'tur', nombre: 'Turquía', bandera: '🇹🇷', grupo: 'D' },
  { id: 'ger', nombre: 'Alemania', bandera: '🇩🇪', grupo: 'E' },
  { id: 'cuw', nombre: 'Curazao', bandera: '🇨🇼', grupo: 'E' },
  { id: 'civ', nombre: 'Costa de Marfil', bandera: '🇨🇮', grupo: 'E' },
  { id: 'ecu', nombre: 'Ecuador', bandera: '🇪🇨', grupo: 'E' },
  { id: 'ned', nombre: 'Países Bajos', bandera: '🇳🇱', grupo: 'F' },
  { id: 'jpn', nombre: 'Japón', bandera: '🇯🇵', grupo: 'F' },
  { id: 'swe', nombre: 'Suecia', bandera: '🇸🇪', grupo: 'F' },
  { id: 'tun', nombre: 'Túnez', bandera: '🇹🇳', grupo: 'F' },
  { id: 'bel', nombre: 'Bélgica', bandera: '🇧🇪', grupo: 'G' },
  { id: 'egy', nombre: 'Egipto', bandera: '🇪🇬', grupo: 'G' },
  { id: 'irn', nombre: 'Irán', bandera: '🇮🇷', grupo: 'G' },
  { id: 'nzl', nombre: 'Nueva Zelanda', bandera: '🇳🇿', grupo: 'G' },
  { id: 'esp', nombre: 'España', bandera: '🇪🇸', grupo: 'H' },
  { id: 'cpv', nombre: 'Cabo Verde', bandera: '🇨🇻', grupo: 'H' },
  { id: 'ksa', nombre: 'Arabia Saudita', bandera: '🇸🇦', grupo: 'H' },
  { id: 'ury', nombre: 'Uruguay', bandera: '🇺🇾', grupo: 'H' },
  { id: 'fra', nombre: 'Francia', bandera: '🇫🇷', grupo: 'I' },
  { id: 'sen', nombre: 'Senegal', bandera: '🇸🇳', grupo: 'I' },
  { id: 'irq', nombre: 'Irak', bandera: '🇮🇶', grupo: 'I' },
  { id: 'nor', nombre: 'Noruega', bandera: '🇳🇴', grupo: 'I' },
  { id: 'arg', nombre: 'Argentina', bandera: '🇦🇷', grupo: 'J' },
  { id: 'alg', nombre: 'Argelia', bandera: '🇩🇿', grupo: 'J' },
  { id: 'aut', nombre: 'Austria', bandera: '🇦�', grupo: 'J' },
  { id: 'jor', nombre: 'Jordania', bandera: '🇯🇴', grupo: 'J' },
  { id: 'por', nombre: 'Portugal', bandera: '🇵🇹', grupo: 'K' },
  { id: 'cod', nombre: 'RD Congo', bandera: '🇨🇩', grupo: 'K' },
  { id: 'uzb', nombre: 'Uzbekistán', bandera: '🇺🇿', grupo: 'K' },
  { id: 'col', nombre: 'Colombia', bandera: '🇨🇴', grupo: 'K' },
  { id: 'eng', nombre: 'Inglaterra', bandera: '🏴󠁧󠁢󠁥󠁮󠁧󠁿', grupo: 'L' },
  { id: 'cro', nombre: 'Croacia', bandera: '🇭🇷', grupo: 'L' },
  { id: 'gha', nombre: 'Ghana', bandera: '🇬🇭', grupo: 'L' },
  { id: 'pan', nombre: 'Panamá', bandera: '🇵🇦', grupo: 'L' }
];

const gruposDisponibles = ['A', 'B', 'C', 'D', 'E', 'F', 'G', 'H', 'I', 'J', 'K', 'L'];

function obtenerEquiposPorGrupo(grupo) {
  return equipos.filter(e => e.grupo === grupo);
}

function obtenerEquipoPorId(id) {
  return equipos.find(e => e.id === id);
}
