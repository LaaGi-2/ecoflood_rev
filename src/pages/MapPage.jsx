import { useState, useEffect } from 'react'
import MapView from '../components/MapView'
import LoadingSpinner from '../components/LoadingSpinner'
import { fetchTreeCoverLoss, fetchReports } from '../services/api'
import './MapPage.css'

function MapPage() {
  const [selectedYear, setSelectedYear] = useState(2023)
  const [layers, setLayers] = useState({
    deforestation: true,
    flood: false,
    reports: false
  })
  const [deforestationData, setDeforestationData] = useState([])
  const [reportsData, setReportsData] = useState([])
  const [loading, setLoading] = useState(true)

  // Indonesia center coordinates
  const indonesiaCenter = [-2.5, 118.0]
  const indonesiaZoom = 5

  useEffect(() => {
    loadData()
  }, [selectedYear])

  async function loadData() {
    setLoading(true)
    try {
      const [deforestationResult, reports] = await Promise.all([
        fetchTreeCoverLoss(selectedYear),
        fetchReports()
      ])
      
      setDeforestationData(deforestationResult.data || [])
      setReportsData(reports || [])
    } catch (error) {
      console.error('Error loading map data:', error)
    } finally {
      setLoading(false)
    }
  }

  const toggleLayer = (layerName) => {
    setLayers(prev => ({
      ...prev,
      [layerName]: !prev[layerName]
    }))
  }

  // Prepare markers based on active layers
  const markers = []
  
  if (layers.deforestation) {
    deforestationData.forEach(point => {
      markers.push({
        lat: point.lat,
        lng: point.lng,
        color: '#E07856',
        radius: Math.min(point.intensity / 10, 15),
        title: 'Hotspot Deforestasi',
        description: `Kehilangan tutupan hutan terdeteksi pada ${selectedYear}`,
        intensity: point.intensity,
        area_hectares: point.area_hectares,
        region: point.region
      })
    })
  }
  
  if (layers.reports) {
    reportsData.forEach(report => {
      if (report.lat && report.lng) {
        markers.push({
          lat: report.lat,
          lng: report.lng,
          color: report.type === 'flood' ? '#5B9AA9' : '#F4A259',
          radius: 6,
          title: report.location,
          description: report.description,
          type: report.type
        })
      }
    })
  }

  return (
    <div className="map-page">
      <div className="map-container">
        <div className="map-sidebar glass">
          <h2>🗺️ Peta Interaktif Indonesia</h2>
          <p className="sidebar-description">
            Jelajahi pola deforestasi dan laporan banjir di seluruh Indonesia
          </p>

          {/* Timeline Slider */}
          <div className="controls-section">
            <h3>Timeline</h3>
            <label htmlFor="year-slider">
              Tahun: <strong>{selectedYear}</strong>
            </label>
            <input
              id="year-slider"
              type="range"
              min="2001"
              max="2023"
              value={selectedYear}
              onChange={(e) => setSelectedYear(Number(e.target.value))}
              className="slider slider-timeline"
            />
            <div className="timeline-labels">
              <span>2001</span>
              <span>2023</span>
            </div>
          </div>

          {/* Layer Controls */}
          <div className="controls-section">
            <h3>Layer</h3>
            <div className="layer-controls">
              <label className="layer-toggle">
                <input
                  type="checkbox"
                  checked={layers.deforestation}
                  onChange={() => toggleLayer('deforestation')}
                />
                <span className="layer-name">
                  <span className="layer-dot" style={{ backgroundColor: '#E07856' }}></span>
                  Hotspot Deforestasi
                </span>
              </label>

              <label className="layer-toggle">
                <input
                  type="checkbox"
                  checked={layers.reports}
                  onChange={() => toggleLayer('reports')}
                />
                <span className="layer-name">
                  <span className="layer-dot" style={{ backgroundColor: '#5B9AA9' }}></span>
                  Laporan Komunitas
                </span>
              </label>
            </div>
          </div>

          {/* Legend */}
          <div className="controls-section">
            <h3>Legenda</h3>
            <div className="legend">
              {layers.deforestation && (
                <div className="legend-item">
                  <div className="legend-symbol" style={{ backgroundColor: '#E07856' }}></div>
                  <span>Deforestasi (ukuran = intensitas)</span>
                </div>
              )}
              {layers.reports && (
                <>
                  <div className="legend-item">
                    <div className="legend-symbol" style={{ backgroundColor: '#5B9AA9' }}></div>
                    <span>Laporan Banjir</span>
                  </div>
                  <div className="legend-item">
                    <div className="legend-symbol" style={{ backgroundColor: '#F4A259' }}></div>
                    <span>Laporan Deforestasi</span>
                  </div>
                </>
              )}
            </div>
          </div>

          {/* Stats */}
          <div className="controls-section">
            <h3>Statistik</h3>
            <div className="stats-grid">
              <div className="stat-item">
                <div className="stat-value">{deforestationData.length}</div>
                <div className="stat-label">Hotspot</div>
              </div>
              <div className="stat-item">
                <div className="stat-value">{reportsData.length}</div>
                <div className="stat-label">Laporan</div>
              </div>
            </div>
          </div>
        </div>

        <div className="map-content">
          {loading ? (
            <div className="map-loading">
              <LoadingSpinner message="Memuat data peta..." />
            </div>
          ) : (
            <MapView 
              center={indonesiaCenter} 
              zoom={indonesiaZoom} 
              markers={markers} 
            />
          )}
        </div>
      </div>
    </div>
  )
}

export default MapPage
