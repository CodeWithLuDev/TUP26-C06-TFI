import { useState } from 'react'
import * as Flags from 'country-flag-icons/react/3x2'
import { useAuth } from '../context/AuthContext'
import { usePredicciones } from '../context/PrediccionesContext'
import '../styles/predicciones.css'

function Bandera({ codigo, size = 28 }) {
  const Flag = Flags[codigo]
  if (!Flag) return null
  return <Flag style={{ width: size, height: 'auto', borderRadius: '3px' }} />
}

// Botón que se pone en la card de cada partido
export function BtnPredecir({ partido }) {
  const [abierto, setAbierto] = useState(false)
  const { usuario } = useAuth()
  const { predecir, miPrediccion } = usePredicciones()

  // Solo se puede predecir si el partido todavía no empezó
  const yaEmpezó = partido.horaUTC ? new Date(partido.horaUTC) <= new Date() : false
  if (yaEmpezó) return null

  const pred = miPrediccion(partido.id)

  return (
    <>
      <button
        className={`btn-predecir ${pred ? 'tiene-pred' : ''}`}
        onClick={() => setAbierto(true)}
      >
        🔮 {pred ? `Mi pred: ${pred.local}-${pred.visitante}` : 'Predecir'}
      </button>

      {abierto && (
        <ModalPredecir
          partido={partido}
          usuario={usuario}
          predExistente={pred}
          onPredecir={predecir}
          onCerrar={() => setAbierto(false)}
        />
      )}
    </>
  )
}

function ModalPredecir({ partido, usuario, predExistente, onPredecir, onCerrar }) {
  const [local, setLocal] = useState(predExistente?.local ?? '')
  const [visitante, setVisitante] = useState(predExistente?.visitante ?? '')
  const [exito, setExito] = useState(false)

  // Sin cuenta: mostrar aviso
  if (!usuario) {
    return (
      <div className="pred-modal-overlay" onClick={onCerrar}>
        <div className="pred-modal pred-modal-info" onClick={e => e.stopPropagation()}>
          <span className="pred-modal-info-icon">🔐</span>
          <h3>Necesitás una cuenta</h3>
          <p>Para predecir resultados tenés que iniciar sesión o crear una cuenta gratuita.</p>
          <button className="pred-modal-info-btn" onClick={onCerrar}>
            Entendido
          </button>
        </div>
      </div>
    )
  }

  function confirmar() {
    if (local === '' || visitante === '') return
    onPredecir(partido.id, Number(local), Number(visitante))
    setExito(true)
    setTimeout(onCerrar, 900)
  }

  return (
    <div className="pred-modal-overlay" onClick={onCerrar}>
      <div className="pred-modal" onClick={e => e.stopPropagation()}>
        {exito ? (
          <div style={{ textAlign: 'center', padding: '1rem 0' }}>
            <div style={{ fontSize: '2.5rem', marginBottom: '0.5rem' }}>✅</div>
            <p style={{ fontWeight: 700 }}>¡Predicción guardada!</p>
          </div>
        ) : (
          <>
            <h3>🔮 Predecir resultado</h3>
            <p className="pred-modal-sub">{partido.fecha} · {partido.fase || partido.grupo}</p>

            <div className="pred-modal-equipos">
              <div className="pred-modal-equipo">
                <Bandera codigo={partido.codigoLocal} />
                <span>{partido.local}</span>
                <input
                  type="number"
                  min="0"
                  max="99"
                  value={local}
                  onChange={e => setLocal(e.target.value)}
                  placeholder="0"
                />
              </div>

              <span className="pred-modal-vs">VS</span>

              <div className="pred-modal-equipo">
                <Bandera codigo={partido.codigoVisitante} />
                <span>{partido.visitante}</span>
                <input
                  type="number"
                  min="0"
                  max="99"
                  value={visitante}
                  onChange={e => setVisitante(e.target.value)}
                  placeholder="0"
                />
              </div>
            </div>

            <p style={{ fontSize: '0.75rem', color: 'rgba(255,255,255,0.35)', textAlign: 'center', marginBottom: '1rem' }}>
              +3 pts resultado exacto · +1 pt solo el ganador
            </p>

            <div className="pred-modal-acciones">
              <button className="pred-modal-cancelar" onClick={onCerrar}>Cancelar</button>
              <button
                className="pred-modal-confirmar"
                onClick={confirmar}
                disabled={local === '' || visitante === ''}
              >
                {predExistente ? 'Actualizar' : 'Confirmar'}
              </button>
            </div>
          </>
        )}
      </div>
    </div>
  )
}

export default ModalPredecir
