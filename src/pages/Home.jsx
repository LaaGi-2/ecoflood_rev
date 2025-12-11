import { Link } from 'react-router-dom'
import './Home.css'

function Home() {
  return (
    <div className="home">
      {/* Hero Section */}
      <section className="hero">
        <div className="hero-background"></div>
        <div className="container hero-content">
          <div className="hero-text fade-in">
            <h1 className="hero-title">
              The Hidden Connection Between
              <span className="highlight"> Deforestation</span> and
              <span className="highlight-secondary"> Flooding</span>
            </h1>
            <p className="hero-description">
              Explore real-time environmental data, interactive maps, and simulations
              to understand how forest loss impacts flood risk worldwide.
            </p>
            <div className="hero-ctas">
              <Link to="/map" className="btn btn-primary">
                🗺️ Explore Interactive Map
              </Link>
              <Link to="/simulation" className="btn btn-secondary">
                🧪 Try Simulation Lab
              </Link>
            </div>
          </div>
          
          <div className="hero-visual slide-in-right">
            <div className="earth-container">
              <div className="earth"></div>
              <div className="glow"></div>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="features">
        <div className="container">
          <h2 className="section-title">Explore EcoFlood</h2>
          <p className="section-subtitle">
            Powerful tools to visualize and understand environmental impact
          </p>
          
          <div className="features-grid">
            <Link to="/map" className="feature-card">
              <div className="feature-icon">🗺️</div>
              <h3>Interactive Map</h3>
              <p>
                View deforestation and flood risk layers with timeline controls.
                Toggle between data sources and explore hotspots globally.
              </p>
              <span className="feature-link">Explore Map →</span>
            </Link>

            <Link to="/simulation" className="feature-card">
              <div className="feature-icon">🧪</div>
              <h3>Simulation Lab</h3>
              <p>
                Experiment with forest cover, rainfall, and soil absorption
                to see real-time flood risk calculations.
              </p>
              <span className="feature-link">Try Simulation →</span>
            </Link>

            <Link to="/dashboard" className="feature-card">
              <div className="feature-icon">📊</div>
              <h3>Live Dashboard</h3>
              <p>
                Access charts and statistics showing rainfall trends,
                deforestation rates, and recent environmental alerts.
              </p>
              <span className="feature-link">View Dashboard →</span>
            </Link>

            <Link to="/reports" className="feature-card">
              <div className="feature-icon">📝</div>
              <h3>Community Reports</h3>
              <p>
                Submit and view flood or deforestation reports from around
                the world. Help build a community-driven database.
              </p>
              <span className="feature-link">Submit Report →</span>
            </Link>
          </div>
        </div>
      </section>

      {/* Impact Section */}
      <section className="impact">
        <div className="container">
          <div className="impact-content">
            <div className="impact-text">
              <h2>Why It Matters</h2>
              <p>
                Forests act as natural sponges, absorbing rainfall and reducing
                runoff. When trees are removed, soil loses its capacity to retain
                water, leading to increased flood risk downstream.
              </p>
              <p>
                Since 2001, the world has lost over <strong>437 million hectares</strong> of
                tree cover. Understanding this connection is critical for climate
                action and disaster prevention.
              </p>
              <div className="impact-stats">
                <div className="stat">
                  <div className="stat-number">437M+</div>
                  <div className="stat-label">Hectares Lost</div>
                </div>
                <div className="stat">
                  <div className="stat-number">2001-2023</div>
                  <div className="stat-label">Data Timeline</div>
                </div>
                <div className="stat">
                  <div className="stat-number">Global</div>
                  <div className="stat-label">Coverage</div>
                </div>
              </div>
            </div>
            <div className="impact-visual">
              <div className="stat-card glass">
                <div className="stat-card-icon">🌍</div>
                <div className="stat-card-content">
                  <h4>Real-Time Data</h4>
                  <p>Connected to Global Forest Watch and Open-Meteo APIs</p>
                </div>
              </div>
              <div className="stat-card glass">
                <div className="stat-card-icon">💧</div>
                <div className="stat-card-content">
                  <h4>Flood Risk Analysis</h4>
                  <p>Advanced calculations based on environmental factors</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  )
}

export default Home
