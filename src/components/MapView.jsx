import { useEffect } from 'react'
import { MapContainer, TileLayer, CircleMarker, Popup, useMap } from 'react-leaflet'
import 'leaflet/dist/leaflet.css'
import './MapView.css'

// Component to update map view
function ChangeView({ center, zoom }) {
  const map = useMap()
  useEffect(() => {
    map.setView(center, zoom)
  }, [center, zoom, map])
  return null
}

function MapView({ center = [0, 20], zoom = 3, markers = [], onMarkerClick }) {
  return (
    <div className="map-view">
      <MapContainer
        center={center}
        zoom={zoom}
        style={{ height: '100%', width: '100%' }}
        className="leaflet-map-container"
      >
        <ChangeView center={center} zoom={zoom} />
        
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />
        
        {markers.map((marker, index) => (
          <CircleMarker
            key={index}
            center={[marker.lat, marker.lng]}
            radius={marker.radius || 8}
            fillColor={marker.color || '#ef4444'}
            color="#fff"
            weight={2}
            opacity={0.8}
            fillOpacity={0.6}
            eventHandlers={{
              click: () => onMarkerClick && onMarkerClick(marker)
            }}
          >
            <Popup>
              <div className="map-popup">
                <h4>{marker.title || 'Location'}</h4>
                {marker.description && <p>{marker.description}</p>}
                {marker.intensity !== undefined && (
                  <p><strong>Intensity:</strong> {Math.round(marker.intensity)}%</p>
                )}
                {marker.area_hectares && (
                  <p><strong>Area:</strong> {Math.round(marker.area_hectares).toLocaleString()} ha</p>
                )}
                {marker.region && (
                  <p><strong>Region:</strong> {marker.region}</p>
                )}
              </div>
            </Popup>
          </CircleMarker>
        ))}
      </MapContainer>
    </div>
  )
}

export default MapView
