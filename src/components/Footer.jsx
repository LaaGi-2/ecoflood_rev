import './Footer.css'

function Footer() {
  return (
    <footer className="footer">
      <div className="container">
        <div className="footer-content">
          <div className="footer-section">
            <h4>🌳 EcoFlood</h4>
            <p>Exploring the critical connection between deforestation and flood risk through data visualization.</p>
          </div>
          
          <div className="footer-section">
            <h4>Data Sources</h4>
            <ul>
              <li>
                <a href="https://www.globalforestwatch.org/" target="_blank" rel="noopener noreferrer">
                  Global Forest Watch
                </a>
              </li>
              <li>
                <a href="https://open-meteo.com/" target="_blank" rel="noopener noreferrer">
                  Open-Meteo API
                </a>
              </li>
              <li>
                <a href="https://www.openstreetmap.org/" target="_blank" rel="noopener noreferrer">
                  OpenStreetMap
                </a>
              </li>
            </ul>
          </div>
          
          <div className="footer-section">
            <h4>Resources</h4>
            <ul>
              <li><a href="https://leafletjs.com/" target="_blank" rel="noopener noreferrer">Leaflet.js</a></li>
              <li><a href="https://recharts.org/" target="_blank" rel="noopener noreferrer">Recharts</a></li>
              <li><a href="https://react.dev/" target="_blank" rel="noopener noreferrer">React</a></li>
            </ul>
          </div>
        </div>
        
        <div className="footer-bottom">
          <p>&copy; 2024 EcoFlood. Built for environmental awareness.</p>
        </div>
      </div>
    </footer>
  )
}

export default Footer
