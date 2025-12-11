import './IslandSelector.css'

const ISLANDS = [
  { id: 'all', name: 'Seluruh Indonesia', center: [-2.5, 118.0], zoom: 5 },
  { id: 'sumatra', name: 'Sumatra', center: [0.5, 101.5], zoom: 6 },
  { id: 'java', name: 'Jawa & Bali', center: [-7.5, 110.0], zoom: 7 },
  { id: 'kalimantan', name: 'Kalimantan', center: [0.5, 114.0], zoom: 6 },
  { id: 'sulawesi', name: 'Sulawesi', center: [-2.0, 120.5], zoom: 6 },
  { id: 'papua', name: 'Papua & Maluku', center: [-4.0, 135.0], zoom: 6 }
]

function IslandSelector({ selectedIsland, onSelect }) {
  return (
    <div className="island-selector">
      <label htmlFor="island-select" className="selector-label">
        🏝️ Pilih Pulau/Wilayah
      </label>
      <select 
        id="island-select"
        value={selectedIsland} 
        onChange={(e) => onSelect(e.target.value)}
        className="island-select"
      >
        {ISLANDS.map(island => (
          <option key={island.id} value={island.id}>
            {island.name}
          </option>
        ))}
      </select>
    </div>
  )
}

export { IslandSelector, ISLANDS }
export default IslandSelector
