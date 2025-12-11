import { useState, useEffect } from 'react'
import MapView from '../components/MapView'
import LoadingSpinner from '../components/LoadingSpinner'
import IslandSelector, { ISLANDS } from '../components/IslandSelector'
import { fetchTreeCoverLoss, fetchReports, fetchFloodHistory, fetchFireHotspots, fetchBiodiversityData } from '../services/api'
import './MapPage.css'

function MapPage() {
  const [selectedYear, setSelectedYear] = useState(2023)
  const [selectedIsland, setSelectedIsland] = useState('all')
  const [layers, setLayers] = useState({
    deforestation: true,
    flood: false,
    fire: false,
    biodiversity: false,
    reports: false
  })
  const [deforestationData, setDeforestationData] = useState([])
  const [floodData, setFloodData] = useState([])
  const [fireData, setFireData] = useState([])
  const [biodiversityData, setBiodiversityData] = useState([])
  const [reportsData, setReportsData] = useState([])
  const [loading, setLoading] = useState(true)

  // Get map center and zoom based on selected island
  const getIslandConfig = () => {
    const island = ISLANDS.find(i => i.id === selectedIsland)
    return island || ISLANDS[0]
  }

  const { center, zoom } = getIslandConfig()

  useEffect(() => {
    console.log('MapPage: Loading data for year:', selectedYear, 'island:', selectedIsland)
    loadData()
  }, [selectedYear, selectedIsland])

  async function loadData() {
    setLoading(true)
    try {
      console.log('MapPage: Fetching data...')
      const [deforestationResult, reports, floods, fires, biodiversity] = await Promise.all([
        fetchTreeCoverLoss(selectedYear),
        fetchReports(),
        fetchFloodHistory(selectedIsland, selectedYear),
        fetchFireHotspots(selectedIsland, selectedYear),
        fetchBiodiversityData(selectedIsland)
      ])
      
      console.log('MapPage: Data loaded successfully', {
        deforestation: deforestationResult?.data?.length,
        floods: floods?.length,
        fires: fires?.length,
        biodiversity: biodiversity?.length
      })
      
      setDeforestationData(deforestationResult.data || [])
      setReportsData(reports || [])
      setFloodData(floods || [])
      setFireData(fires || [])
      setBiodiversityData(biodiversity || [])
    } catch (error) {
      console.error('MapPage: Error loading map data:', error)
    } finally {
      console.log('MapPage: Setting loading to false')
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
        description: `${point.region} - ${point.area_hectares} hektar`,
        intensity: point.intensity,
        area_hectares: point.area_hectares,
        region: point.region
      })
    })
  }
  
  if (layers.flood) {
    floodData.forEach(flood => {
      const severityColors = {
        critical: '#dc2626',
        high: '#f59e0b',
        medium: '#3b82f6',
        low: '#60a5fa'
      }
      markers.push({
        lat: flood.lat,
        lng: flood.lng,
        color: severityColors[flood.severity] || '#3b82f6',
        radius: 8,
        title: `Banjir ${flood.location}`,
        description: `${flood.description} (${flood.affected.toLocaleString()} terdampak)`,
        severity: flood.severity,
        casualties: flood.casualties,
        affected: flood.affected
      })
    })
  }

  if (layers.fire) {
    fireData.forEach(fire => {
      const confidenceColors = {
        high: '#dc2626',
        medium: '#f59e0b',
        low: '#fbbf24'
      }
      markers.push({
        lat: fire.lat,
        lng: fire.lng,
        color: confidenceColors[fire.confidence] || '#f59e0b',
        radius: 6,
        title: `Hotspot Kebakaran`,
        description: `${fire.location} - ${fire.type} (${fire.confidence} confidence)`,
        type: fire.type,
        confidence: fire.confidence
      })
    })
  }

  if (layers.biodiversity) {
    biodiversityData.forEach(spot => {
      markers.push({
        lat: spot.lat,
        lng: spot.lng,
        color: '#10b981',
        radius: 10,
        title: spot.location,
        description: `${spot.type} - ${spot.species.join(', ')} (${spot.area_km2} km²)`,
        type: spot.type,
        species: spot.species
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

  console.log('MapPage: Rendering with', markers.length, 'markers, loading:', loading)

  return (
    <div className="map-page">
      <div className="map-container">
        <div className="map-sidebar glass">
          <h2>🗺️ Peta Interaktif Indonesia</h2>
          <p className="sidebar-description">
            Jelajahi data lingkungan di seluruh Indonesia berdasarkan pulau dan tahun
          </p>

          {/* Island Selector */}
          <div className="controls-section">
            <IslandSelector 
              selectedIsland={selectedIsland}
              onSelect={setSelectedIsland}
            />
          </div>

          {/* Timeline Slider */}
          <div className="controls-section">
            <h3>Timeline</h3>
            <label htmlFor="year-slider">
              Tahun: <strong>{selectedYear}</strong>
            </label>
            <input
              id="year-slider"
              type="range"
              min="2020"
              max="2023"
              value={selectedYear}
              onChange={(e) => setSelectedYear(Number(e.target.value))}
              className="slider slider-timeline"
            />
            <div className="timeline-labels">
              <span>2020</span>
              <span>2023</span>
            </div>
          </div>

          {/* Layer Controls */}
          <div className="controls-section">
            <h3>Layer Data</h3>
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
                  checked={layers.flood}
                  onChange={() => toggleLayer('flood')}
                />
                <span className="layer-name">
                  <span className="layer-dot" style={{ backgroundColor: 'var(--color-flood)' }}></span>
                  Riwayat Banjir
                </span>
              </label>

              <label className="layer-toggle">
                <input
                  type="checkbox"
                  checked={layers.fire}
                  onChange={() => toggleLayer('fire')}
                />
                <span className="layer-name">
                  <span className="layer-dot" style={{ backgroundColor: 'var(--color-fire)' }}></span>
                  Hotspot Kebakaran
                </span>
              </label>

              <label className="layer-toggle">
                <input
                  type="checkbox"
                  checked={layers.biodiversity}
                  onChange={() => toggleLayer('biodiversity')}
                />
                <span className="layer-name">
                  <span className="layer-dot" style={{ backgroundColor: 'var(--color-biodiversity)' }}></span>
                  Biodiversitas
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

          {/* Stats */}
          <div className="controls-section">
            <h3>Statistik</h3>
            <div className="stats-grid">
              <div className="stat-item">
                <div className="stat-value">{deforestationData.length}</div>
                <div className="stat-label">Deforestasi</div>
              </div>
              <div className="stat-item">
                <div className="stat-value">{floodData.length}</div>
                <div className="stat-label">Banjir</div>
              </div>
              <div className="stat-item">
                <div className="stat-value">{fireData.length}</div>
                <div className="stat-label">Kebakaran</div>
              </div>
              <div className="stat-item">
                <div className="stat-value">{biodiversityData.length}</div>
                <div className="stat-label">Kawasan</div>
              </div>
            </div>
          </div>

          {/* Data Sources */}
          <div className="controls-section data-sources">
            <h3>Sumber Data</h3>
            <ul>
              <li><strong>InaRISK BNPB</strong> - Riwayat banjir</li>
              <li><strong>NASA FIRMS</strong> - Hotspot kebakaran</li>
              <li><strong>GFW</strong> - Data deforestasi</li>
              <li><strong>IUCN</strong> - Kawasan biodiversitas</li>
            </ul>
          </div>
        </div>

        <div className="map-content">
          {loading ? (
            <div className="map-loading">
              <LoadingSpinner message="Memuat data peta..." />
            </div>
          ) : (
            <MapView 
              center={center} 
              zoom={zoom} 
              markers={markers} 
            />
          )}
        </div>
      </div>
    </div>
  )
}

export default MapPage
