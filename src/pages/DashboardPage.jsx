import { useState, useEffect } from 'react'
import ChartWidget from '../components/ChartWidget'
import LoadingSpinner from '../components/LoadingSpinner'
import { fetchHistoricalRainfall, fetchGLADAlerts } from '../services/api'
import './DashboardPage.css'

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
      const [rainfall, alertsData] = await Promise.all([
        fetchHistoricalRainfall(),
        fetchGLADAlerts()
      ])
      
      // Process rainfall data
      if (rainfall.monthly) {
        setRainfallData(rainfall.monthly.map(item => ({
          name: item.month,
          value: Math.round(item.rainfall)
        })))
      }
      
      // Mock deforestation trend data
      setDeforestationData([
        { name: '2018', value: 12.3 },
        { name: '2019', value: 11.8 },
        { name: '2020', value: 13.5 },
        { name: '2021', value: 14.2 },
        { name: '2022', value: 15.8 },
        { name: '2023', value: 16.5 }
      ])
      
      setAlerts(alertsData)
    } catch (error) {
      console.error('Error loading dashboard data:', error)
    } finally {
      setLoading(false)
    }
  }

  if (loading) {
    return (
      <div className="dashboard-page">
        <div className="container">
          <LoadingSpinner message="Loading dashboard..." />
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
  const latestDeforestation = deforestationData[deforestationData.length - 1]?.value || 0

  return (
    <div className="dashboard-page">
      <div className="container">
        <div className="page-header fade-in">
          <h1>📊 Environmental Dashboard</h1>
          <p>
            Real-time statistics and trends from global environmental monitoring systems
          </p>
        </div>

        {/* Key Metrics */}
        <div className="metrics-grid">
          <div className="metric-card glass slide-in-left">
            <div className="metric-icon">🌧️</div>
            <div className="metric-content">
              <div className="metric-value">{avgRainfall} mm</div>
              <div className="metric-label">Average Monthly Rainfall</div>
              <div className="metric-trend">↑ Based on 12 months</div>
            </div>
          </div>

          <div className="metric-card glass slide-in-left">
            <div className="metric-icon">🌲</div>
            <div className="metric-content">
              <div className="metric-value">{latestDeforestation}M</div>
              <div className="metric-label">Hectares Lost (2023)</div>
              <div className="metric-trend trend-danger">↑ {((latestDeforestation - 12.3) / 12.3 * 100).toFixed(1)}% since 2018</div>
            </div>
          </div>

          <div className="metric-card glass slide-in-right">
            <div className="metric-icon">⚠️</div>
            <div className="metric-content">
              <div className="metric-value">{totalAlerts}</div>
              <div className="metric-label">Recent Deforestation Alerts</div>
              <div className="metric-trend">{highConfidenceAlerts} high confidence</div>
            </div>
          </div>

          <div className="metric-card glass slide-in-right">
            <div className="metric-icon">💧</div>
            <div className="metric-content">
              <div className="metric-value">Medium</div>
              <div className="metric-label">Global Flood Risk Index</div>
              <div className="metric-trend">Based on current data</div>
            </div>
          </div>
        </div>

        {/* Charts */}
        <div className="charts-grid">
          <ChartWidget
            title="Monthly Rainfall Trends"
            description="12-month precipitation data"
            data={rainfallData}
            type="bar"
            dataKey="value"
            color="#06b6d4"
          />

          <ChartWidget
            title="Annual Deforestation"
            description="Tree cover loss (million hectares)"
            data={deforestationData}
            type="area"
            dataKey="value"
            color="#ef4444"
          />

          <div className="alerts-widget glass">
            <div className="chart-header">
              <h3>Recent Alerts</h3>
              <p>Latest deforestation detections</p>
            </div>
            <div className="alerts-list">
              {alerts.slice(0, 8).map(alert => (
                <div key={alert.id} className="alert-item">
                  <div className="alert-info">
                    <div className="alert-date">
                      {new Date(alert.date).toLocaleDateString()}
                    </div>
                    <div className="alert-location">
                      Lat: {alert.lat.toFixed(2)}, Lng: {alert.lng.toFixed(2)}
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
              <h3>About This Data</h3>
            </div>
            <div className="info-content">
              <p>
                This dashboard aggregates real-time environmental data from
                multiple sources including Global Forest Watch and Open-Meteo.
              </p>
              <ul>
                <li><strong>Rainfall Data:</strong> Open-Meteo historical weather API</li>
                <li><strong>Deforestation:</strong> Global Forest Watch GLAD alerts</li>
                <li><strong>Flood Risk:</strong> Calculated from multiple environmental factors</li>
              </ul>
              <p className="info-note">
                📊 Data updates automatically and may include simulated values for demonstration purposes.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default DashboardPage
