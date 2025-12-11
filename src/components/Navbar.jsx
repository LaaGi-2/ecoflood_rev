import { Link, useLocation } from 'react-router-dom'
import './Navbar.css'

function Navbar() {
  const location = useLocation()
  
  const isActive = (path) => location.pathname === path ? 'active' : ''

  return (
    <nav className="navbar">
      <div className="container navbar-container">
        <Link to="/" className="navbar-brand">
          <span className="brand-icon">🌳</span>
          <span className="brand-text">EcoFlood</span>
        </Link>
        
        <div className="navbar-links">
          <Link to="/" className={`nav-link ${isActive('/')}`}>
            Home
          </Link>
          <Link to="/map" className={`nav-link ${isActive('/map')}`}>
            Peta
          </Link>
          <Link to="/simulation" className={`nav-link ${isActive('/simulation')}`}>
            Simulasi
          </Link>
          <Link to="/reports" className={`nav-link ${isActive('/reports')}`}>
            Laporan
          </Link>
        </div>
        
        <Link to="/dashboard" className="btn btn-primary btn-sm">
           Dashboard
        </Link>
      </div>
    </nav>
  )
}

export default Navbar
