import { Link } from 'react-router-dom'
import '../styles/footer.css'

function Footer() {
  return (
    <footer className="footer">
      <div className="footer-left">
        <Link to="/">
          <img src="/logo-m26.png" alt="Mundial 2026" />
        </Link>
      </div>
      <div className="footer-right">
        <p>© 2026 Copa Mundial FIFA. Todos los derechos reservados.</p>
      </div>
    </footer>
  )
}

export default Footer