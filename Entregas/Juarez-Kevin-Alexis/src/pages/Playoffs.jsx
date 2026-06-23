import Bracket from '../components/Bracket'
import '../styles/playoffs.css'

export default function Playoffs() {
  return (
    <div className="playoffs-page" style={{ padding: '0 2rem', maxWidth: 1400, margin: '0 auto' }}>
      <Bracket />
    </div>
  )
}
