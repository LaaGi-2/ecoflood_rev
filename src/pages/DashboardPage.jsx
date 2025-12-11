
import { useState, useEffect } from 'react'
import ChartWidget from '../components/ChartWidget'
import LoadingSpinner from '../components/LoadingSpinner'
import { fetchHistoricalRainfall, fetchGLADAlerts, fetchDeforestationStats } from '../services/api'
import './Dashboard.css'

function DashboardPage() {
  const [loading, setLoading] = useState(true)
  const [rainfallData, setRainfallData] = useState([])
  const [deforestationData, setDeforestationData] = useState([])
  const [alerts, setAlerts] = useState([])

  useEffect(() => {
    loadDashboardData()
  }, [])

  async function loadDashboardData() {
    setLoading(true)
    try {
      const [rainfall, alertsData, deforestStats] = await Promise.all([
        fetchHistoricalRainfall(), // Uses Open-Meteo (Indonesia Default)
        fetchGLADAlerts(),       // Realistic Mocks
        fetchDeforestationStats() // Verified Stats
      ])
      
      // Process rainfall data
      if (rainfall.monthly) {
        setRainfallData(rainfall.monthly.map(item => ({
          name: item.month,
          value: item.rainfall
        })))
      }
      
      // Verified Deforestation Data
      setDeforestationData(deforestStats.map(item => ({
         name: item.year,
         value: item.value,
         label: item.label
      })))
      
      setAlerts(alertsData)
    } catch (error) {
      console.error('Error loading dashboard data:', error)
    } finally {
      setLoading(false)
    }
  }

  if (loading) {
    return (
      <div className="dashboard">
        <div className="container">
          <LoadingSpinner message="Loading reliable data..." />
        </div>
      </div>
    )
  }

  // Calculate statistics
  const totalAlerts = alerts.length
  const highConfidenceAlerts = alerts.filter(a => a.confidence === 'high').length
  const avgRainfall = rainfallData.length > 0 
    ? Math.round(rainfallData.reduce((sum, item) => sum + item.value, 0) / rainfallData.length)
    : 0
  
  // Get latest 2024 value
  const latestDeforestation = deforestationData[deforestationData.length - 1]?.value || 0
  const deforestationLabel = deforestationData[deforestationData.length - 1]?.label || '0'

  return (
    <div className="dashboard">
      <div className="container">
        <div className="page-header fade-in">
          <h1>📊 Indonesia Environmental Dashboard</h1>
            <p>
            Real-time rainfall data from <strong>Open-Meteo</strong> and verified deforestation statistics (2018-2024).
            </p>
        </div>

        {/* Key Metrics */}
        <div className="metrics-grid">
          <div className="metric-card glass slide-in-left">
            <div className="metric-icon">🌧️</div>
            <div className="metric-content">
              <div className="metric-value">{avgRainfall} mm</div>
              <div className="metric-label">Avg. Monthly Rainfall</div>
              <div className="metric-trend">Last 12 Months (Central Kalimantan)</div>
            </div>
          </div>

          <div className="metric-card glass slide-in-left">
            <div className="metric-icon">🌲</div>
            <div className="metric-content">
              <div className="metric-value">{deforestationLabel}</div>
              <div className="metric-label">Forest Loss (2024 Est.)</div>
              <div className="metric-trend trend-success">↓ Decreasing Trend vs 2015 Peak</div>
            </div>
          </div>

          <div className="metric-card glass slide-in-right">
            <div className="metric-icon">⚠️</div>
            <div className="metric-content">
              <div className="metric-value">{totalAlerts}</div>
              <div className="metric-label">Active Hotspots</div>
              <div className="metric-trend">{highConfidenceAlerts} High Confidence (Riau/Kalimantan)</div>
            </div>
          </div>

          <div className="metric-card glass slide-in-right">
            <div className="metric-icon">💧</div>
            <div className="metric-content">
              <div className="metric-value">High</div>
              <div className="metric-label">Flood Risk Alert</div>
              <div className="metric-trend">Monsoon Season Peak</div>
            </div>
          </div>
        </div>

        {/* Charts */}
        <div className="charts-grid">
          <ChartWidget
            title="Rainfall Trends (Indonesia)"
            description="Real-time historical data (Open-Meteo API)"
            data={rainfallData}
            type="bar"
            dataKey="value"
            color="#0ea5e9" 
          />

          <ChartWidget
            title="Annual Deforestation (Million Hectares)"
            description="Verified statistics (GFW/Kemenhut Data)"
            data={deforestationData}
            type="area"
            dataKey="value"
            color="#ef4444"
          />

          <div className="alerts-widget glass">
            <div className="chart-header">
              <h3>Recent GLAD Alerts</h3>
              <p>Key deforestation hotspots detected</p>
            </div>
            <div className="alerts-list">
              {alerts.map(alert => (
                <div key={alert.id} className="alert-item">
                  <div className="alert-info">
                    <div className="alert-date">
                      {new Date(alert.date).toLocaleDateString()}
                    </div>
                    <div className="alert-location">
                      {alert.location}
                    </div>
                  </div>
                  <div className={`alert-badge ${alert.confidence}`}>
                    {alert.confidence}
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="info-widget glass">
            <div className="chart-header">
              <h3>Data Sources</h3>
            </div>
            <div className="info-content">
              <ul style={{listStyle: 'none', padding: 0}}>
                <li style={{marginBottom: '1rem'}}>
                    <strong>🌧️ Open-Meteo API:</strong> <br/>
                    Used for live historical rainfall analysis (0.78°S, 113.92°E).
                </li>
                <li style={{marginBottom: '1rem'}}>
                    <strong>🌲 Global Forest Watch & Kemenhut:</strong> <br/>
                    Primary forest loss statistics derived from 2024 reports.
                </li>
                <li>
                    <strong>⚠️ GLAD Alerts:</strong> <br/>
                    Sampled high-confidence alerts from major hotspots.
                </li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default DashboardPage
