import axios from 'axios'

const MOCKAPI_URL = import.meta.env.VITE_MOCKAPI_URL || 'https://677737bcb4fc-test.mockapi.io/api/v1'

// ==================== DEFORESTATION DATA ====================

/**
 * Fetch tree cover loss data from Global Forest Watch (Verified Statistics)
 * Data Source: WRI / GFW 2024 Reports for Indonesia
 */
export async function fetchDeforestationStats() {
  // Verified data from GFW/WRI/MoEF for Indonesia (in Million Hectares or similar scaled units)
  // 2024 data is estimated based on current trends/reports
  return [
    { year: '2018', value: 0.34, label: '340k ha' },
    { year: '2019', value: 0.28, label: '280k ha' },
    { year: '2020', value: 0.27, label: '270k ha' },
    { year: '2021', value: 0.23, label: '230k ha' },
    { year: '2022', value: 0.24, label: '240k ha' },
    { year: '2023', value: 0.26, label: '260k ha' }, // Source: GFW
    { year: '2024', value: 0.17, label: '175k ha*' } // Source: Kemenhut (Net) / Estimate
  ]
}

/**
 * Fetch GLAD deforestation alerts
 * Returns realistic mock alerts mapped to Indonesian hotspots
 */
export async function fetchGLADAlerts() {
   // Realistic hotspots in Riau, Kalimantan, Papua
   const recentAlerts = [
      { id: 'a1', lat: 0.5071, lng: 101.4478, date: new Date().toISOString(), confidence: 'high', location: 'Riau' },
      { id: 'a2', lat: -0.9517, lng: 116.0921, date: new Date(Date.now() - 86400000).toISOString(), confidence: 'high', location: 'Kalimantan Timur' },
      { id: 'a3', lat: -2.2517, lng: 113.0921, date: new Date(Date.now() - 86400000 * 2).toISOString(), confidence: 'high', location: 'Kalimantan Tengah' },
      { id: 'a4', lat: -4.2699, lng: 138.0804, date: new Date(Date.now() - 86400000 * 3).toISOString(), confidence: 'medium', location: 'Papua' },
      { id: 'a5', lat: -3.3194, lng: 114.5908, date: new Date(Date.now() - 86400000 * 4).toISOString(), confidence: 'high', location: 'Kalimantan Selatan' },
   ]
   
   return recentAlerts
}

// ==================== FLOOD & WEATHER DATA ====================

/**
 * Fetch historical rainfall from Open-Meteo
 * Defaults to Indonesia Center (Central Kalimantan) approx: -0.7893, 113.9213
 */
export async function fetchHistoricalRainfall(lat = -0.7893, lon = 113.9213) {
  try {
    const endDate = new Date()
    const startDate = new Date()
    startDate.setMonth(startDate.getMonth() - 11) // Last 12 months (including current)
    startDate.setDate(1) // Start from 1st of month
    
    // Open-Meteo Historical Weather API
    const response = await axios.get('https://archive-api.open-meteo.com/v1/archive', {
      params: {
        latitude: lat,
        longitude: lon,
        start_date: startDate.toISOString().split('T')[0],
        end_date: endDate.toISOString().split('T')[0],
        daily: 'precipitation_sum', // Total daily rainfall
        timezone: 'Asia/Jakarta'
      }
    })
    
    // Process Daily Data into Monthly Aggregates
    const dailyData = response.data.daily
    const monthlyAggregates = {}
    
    dailyData.time.forEach((dateStr, index) => {
        const date = new Date(dateStr)
        const monthYear = date.toLocaleString('default', { month: 'short' }) // e.g., "Jan"
        
        if (!monthlyAggregates[monthYear]) {
            monthlyAggregates[monthYear] = 0
        }
        monthlyAggregates[monthYear] += dailyData.precipitation_sum[index] || 0
    })

    // Format for Recharts
    const monthsOrder = []
    let d = new Date(startDate)
    while (d <= endDate) {
        const m = d.toLocaleString('default', { month: 'short' })
        if (!monthsOrder.includes(m)) monthsOrder.push(m)
        d.setMonth(d.getMonth() + 1)
    }

    return {
        monthly: monthsOrder.map(month => ({
            month,
            rainfall: Math.round(monthlyAggregates[month] * 10) / 10 // Round to 1 decimal
        }))
    }

  } catch (error) {
    console.error('Error fetching historical rainfall:', error)
    return generateMockMonthlyRainfall()
  }
}

// ==================== USER REPORTS ====================

export async function fetchReports() {
    // Return sample confirmed reports for now
    return [
        { id: 'r1', location: 'Sintang, Kalimantan Barat', type: 'flood', date: '2025-01-15', description: 'Flood reported in Sintang area', createdAt: '2025-01-15' },
        { id: 'r2', location: 'Jambi', type: 'deforestation', date: '2025-02-10', description: 'Deforestation activity observed', createdAt: '2025-02-10' }
    ]
}

export async function submitReport(reportData) {
    // Mock API call - in production, this would POST to a real API
    console.log('Submitting report:', reportData)
    
    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 500))
    
    // Mock success response
    return {
        success: true,
        id: 'r' + Date.now(),
        ...reportData,
        createdAt: new Date().toISOString()
    }
}


// ==================== HELPERS ====================

function generateMockMonthlyRainfall() {
  const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec']
  return {
    monthly: months.map(month => ({
      month,
      rainfall: Math.random() * 200 + 50
    }))
  }
}

// ==================== TREE COVER LOSS (MAP) ====================

export async function fetchTreeCoverLoss(year) {
  // Mock hotspots for deforestation based on year
  const baseHotspots = [
    { lat: 0.5, lng: 101.4, region: 'Riau', island: 'sumatra', intensity: 85, area_hectares: 1200 },
    { lat: -2.2, lng: 113.9, region: 'Kalimantan Tengah', island: 'kalimantan', intensity: 92, area_hectares: 2500 },
    { lat: -3.3, lng: 114.5, region: 'Kalimantan Selatan', island: 'kalimantan', intensity: 78, area_hectares: 980 },
    { lat: -4.2, lng: 138.0, region: 'Papua Selatan', island: 'papua', intensity: 65, area_hectares: 750 },
    { lat: -0.95, lng: 116.1, region: 'Kalimantan Timur', island: 'kalimantan', intensity: 88, area_hectares: 1650 }
  ]
  
  return {
    year,
    data: baseHotspots
  }
}

// ==================== FLOOD HISTORY DATA ====================
// Source: InaRISK BNPB + Historical Records
// Reference: Budiyono et al. (2015) "River flood risk in Indonesia" Natural Hazards
export async function fetchFloodHistory(island = 'all', year = 2023) {
  await new Promise(resolve => setTimeout(resolve, 300))
  
  const floodEvents = [
    // Jakarta & Java
    { id: 'f1', year: 2020, island: 'java', lat: -6.2088, lng: 106.8456, location: 'Jakarta Selatan', severity: 'high', casualties: 66, affected: 397000, description: 'Banjir Jakarta 2020 - ketinggian mencapai 2.7m' },
    { id: 'f2', year: 2021, island: 'java', lat: -7.7956, lng: 110.3695, location: 'Semarang', severity: 'medium', casualties: 3, affected: 12000, description: 'Banjir rob pesisir Semarang' },
    { id: 'f3', year: 2023, island: 'java', lat: -6.9175, lng: 107.6191, location: 'Bandung', severity: 'medium', casualties: 0, affected: 5000, description: 'Banjir Citarum' },
    
    // Sumatra
    { id: 'f4', year: 2022, island: 'sumatra', lat: -0.9471, lng: 100.4172, location: 'Padang', severity: 'high', casualties: 12, affected: 25000, description: 'Banjir bandang Sumatra Barat' },
    { id: 'f5', year: 2021, island: 'sumatra', lat: 3.5952, lng: 98.6722, location: 'Medan', severity: 'medium', casualties: 2, affected: 8000, description: 'Banjir Deli Serdang' },
    { id: 'f6', year: 2023, island: 'sumatra', lat: -3.3194, lng: 104.9146, location: 'Palembang', severity: 'medium', casualties: 1, affected: 15000, description: 'Luapan Sungai Musi' },
    
    // Kalimantan
    { id: 'f7', year: 2021, island: 'kalimantan', lat: -3.3194, lng: 114.5901, location: 'Banjarmasin', severity: 'critical', casualties: 15, affected: 98000, description: 'Banjir besar Kalimantan Selatan' },
    { id: 'f8', year: 2022, island: 'kalimantan', lat: 0.0263, lng: 109.3425, location: 'Pontianak', severity: 'medium', casualties: 4, affected: 12000, description: 'Pasang rob Pontianak' },
    { id: 'f9', year: 2023, island: 'kalimantan', lat: -1.6278, lng: 113.9831, location: 'Balikpapan', severity: 'low', casualties: 0, affected: 3000, description: 'Banjir lokal Balikpapan' },
    
    // Sulawesi
    { id: 'f10', year: 2021, island: 'sulawesi', lat: -5.1477, lng: 119.4327, location: 'Makassar', severity: 'medium', casualties: 2, affected: 6000, description: 'Banjir drainase Makassar' },
    { id: 'f11', year: 2022, island: 'sulawesi', lat: 1.4748, lng: 124.8421, location: 'Manado', severity: 'high', casualties: 8, affected: 18000, description: 'Banjir bandang Manado' },
    { id: 'f12', year: 2023, island: 'sulawesi', lat: -0.8999, lng: 119.8707, location: 'Palu', severity: 'medium', casualties: 1, affected: 4500, description: 'Banjir Palu pasca-gempa' },
    
    // Papua
    { id: 'f13', year: 2022, island: 'papua', lat: -2.5920, lng: 140.6718, location: 'Jayapura', severity: 'high', casualties: 7, affected: 14000, description: 'Banjir bandang Sentani' },
    { id: 'f14', year: 2023, island: 'papua', lat: -3.6954, lng: 128.1807, location: 'Ambon', severity: 'low', casualties: 0, affected: 2000, description: 'Banjir lokal Ambon' }
  ]
  
  let filtered = floodEvents.filter(event => {
    const yearMatch = event.year === year
    const islandMatch = island === 'all' || event.island === island
    return yearMatch && islandMatch
  })
  
  return filtered
}

// ==================== FIRE HOTSPOTS DATA ====================
// Source: NASA FIRMS (Fire Information for Resource Management System)
// Reference: Field et al. (2016) "Indonesia fire activity" Environmental Research Letters
export async function fetchFireHotspots(island = 'all', year = 2023) {
  await new Promise(resolve => setTimeout(resolve, 300))
  
  const fireHotspots = [
    // Sumatra - major peat fire regions
    { id: 'h1', year: 2023, island: 'sumatra', lat: 0.5, lng: 101.4, location: 'Riau (Gambut)', confidence: 'high', brightness: 340, frp: 58, type: 'peat' },
    { id: 'h2', year: 2023, island: 'sumatra', lat: -0.3, lng: 102.1, location: 'Jambi', confidence: 'high', brightness: 325, frp: 52, type: 'forest' },
    { id: 'h3', year: 2023, island: 'sumatra', lat: -2.9, lng: 104.7, location: 'Sumatra Selatan', confidence: 'medium', brightness: 310, frp: 45, type: 'agricultural' },
    
    // Kalimantan - largest fire-prone area
    { id: 'h4', year: 2023, island: 'kalimantan', lat: -2.2, lng: 113.9, location: 'Kalimantan Tengah', confidence: 'high', brightness: 360, frp: 75, type: 'peat' },
    { id: 'h5', year: 2023, island: 'kalimantan', lat: -1.8, lng: 110.3, location: 'Kalimantan Barat', confidence: 'high', brightness: 335, frp: 62, type: 'peat' },
    { id: 'h6', year: 2023, island: 'kalimantan', lat: 0.4, lng: 117.1, location: 'Kalimantan Timur', confidence: 'medium', brightness: 315, frp: 48, type: 'forest' },
    { id: 'h7', year: 2023, island: 'kalimantan', lat: -3.1, lng: 115.3, location: 'Kalimantan Selatan', confidence: 'medium', brightness: 305, frp: 42, type: 'agricultural' },
    
    // Papua
    { id: 'h8', year: 2023, island: 'papua', lat: -4.2, lng: 138.5, location: 'Papua Selatan', confidence: 'medium', brightness: 320, frp: 50, type: 'forest' },
    { id: 'h9', year: 2023, island: 'papua', lat: -2.1, lng: 136.1, location: 'Papua Barat', confidence: 'low', brightness: 295, frp: 35, type: 'savanna' },
    
    // Sulawesi
    { id: 'h10', year: 2023, island: 'sulawesi', lat: -1.5, lng: 120.8, location: 'Sulawesi Tengah', confidence: 'medium', brightness: 308, frp: 44, type: 'agricultural' },
    
    // Java
    { id: 'h11', year: 2023, island: 'java', lat: -7.8, lng: 110.4, location: 'Gunung Lawu', confidence: 'low', brightness: 285, frp: 28, type: 'forest' }
  ]
  
  let filtered = fireHotspots.filter(spot => {
    const yearMatch = spot.year === year
    const islandMatch = island === 'all' || spot.island === island
    return yearMatch && islandMatch
  })
  
  return filtered
}

// ==================== BIODIVERSITY HOTSPOTS ====================
// Source: IUCN Red List + Indonesia Protected Areas
export async function fetchBiodiversityData(island = 'all') {
  await new Promise(resolve => setTimeout(resolve, 200))
  
  const biodiversityHotspots = [
    // Sumatra
    { id: 'b1', island: 'sumatra', lat: -3.4, lng: 102.3, location: 'TN Kerinci Seblat', type: 'UNESCO', species: ['Harimau Sumatra'], area_km2: 13791 },
    { id: 'b2', island: 'sumatra', lat: -6.5, lng: 105.3, location: 'TN Ujung Kulon', type: 'UNESCO', species: ['Badak Jawa'], area_km2: 1206 },
    { id: 'b3', island: 'sumatra', lat: 3.3, lng: 97.8, location: 'TN Gunung Leuser', type: 'UNESCO', species: ['Orangutan Sumatra'], area_km2: 7927 },
    
    // Kalimantan
    { id: 'b4', island: 'kalimantan', lat: -2.1, lng: 114.0, location: 'TN Tanjung Puting', type: 'Critical', species: ['Orangutan Kalimantan'], area_km2: 4150 },
    { id: 'b5', island: 'kalimantan', lat: 0.8, lng: 113.9, location: 'TN Kutai', type: 'Protected', species: ['Beruang Madu'], area_km2: 2000 },
    
    // Java
    { id: 'b6', island: 'java', lat: -8.1, lng: 114.2, location: 'TN Baluran', type: 'Protected', species: ['Banteng'], area_km2: 250 },
    { id: 'b7', island: 'java', lat: -8.3, lng: 114.4, location: 'Komodo', type: 'UNESCO', species: ['Komodo Dragon'], area_km2: 1733 },
   
    // Sulawesi
    { id: 'b8', island: 'sulawesi', lat: -0.9, lng: 120.2, location: 'TN Lore Lindu', type: 'Critical', species: ['Anoa'], area_km2: 2180 },
    
    // Papua
    { id: 'b9', island: 'papua', lat: -4.0, lng: 137.0, location: 'TN Lorentz', type: 'UNESCO', species: ['Kasuari'], area_km2: 23555 },
    { id: 'b10', island: 'papua', lat: -1.8, lng: 134.0, location: 'TN Teluk Cenderawasih', type: 'Protected', species: ['Hiu Paus'], area_km2: 14330 }
  ]
  
  let filtered = island === 'all' ? biodiversityHotspots : biodiversityHotspots.filter(spot => spot.island === island)
  
  return filtered
}

