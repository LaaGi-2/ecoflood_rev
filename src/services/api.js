import axios from 'axios'

const MOCKAPI_URL = import.meta.env.VITE_MOCKAPI_URL || 'https://677737bcb4fc-test.mockapi.io/api/v1'

// ==================== DEFORESTATION DATA ====================

/**
 * Fetch tree cover loss data from Global Forest Watch
 * Note: GFW API may require authentication - using mock/fallback data if needed
 */
export async function fetchTreeCoverLoss(year = 2023, region = null) {
  try {
    // This is a simplified placeholder - actual GFW API requires more complex queries
    // For production, you'd use: https://data-api.globalforestwatch.org/
    
    // Mock data for demonstration
    return {
      year,
      data: generateMockDeforestationData(),
      source: 'mock'
    }
  } catch (error) {
    console.error('Error fetching tree cover loss:', error)
    return {
      year,
      data: generateMockDeforestationData(),
      source: 'fallback'
    }
  }
}

/**
 * Fetch GLAD deforestation alerts
 */
export async function fetchGLADAlerts() {
  try {
    // Mock recent alerts
    return generateMockAlerts()
  } catch (error) {
    console.error('Error fetching GLAD alerts:', error)
    return []
  }
}

// ==================== FLOOD & WEATHER DATA ====================

/**
 * Fetch flood risk index from Open-Meteo
 */
export async function fetchFloodRisk(lat, lon) {
  try {
    // Open-Meteo flood API
    const response = await axios.get('https://api.open-meteo.com/v1/flood', {
      params: {
        latitude: lat,
        longitude: lon,
        daily: 'river_discharge'
      }
    })
    
    return response.data
  } catch (error) {
    console.error('Error fetching flood risk:', error)
    // Return mock data
    return {
      latitude: lat,
      longitude: lon,
      daily: {
        time: Array.from({length: 7}, (_, i) => new Date(Date.now() + i * 86400000).toISOString()),
        river_discharge: Array.from({length: 7}, () => Math.random() * 100)
      }
    }
  }
}

/**
 * Fetch rainfall and weather data from Open-Meteo
 */
export async function fetchRainfallData(lat, lon) {
  try {
    const response = await axios.get('https://api.open-meteo.com/v1/forecast', {
      params: {
        latitude: lat,
        longitude: lon,
        daily: 'precipitation_sum,precipitation_probability_max',
        timezone: 'auto'
      }
    })
    
    return response.data
  } catch (error) {
    console.error('Error fetching rainfall data:', error)
    // Return mock data
    return generateMockRainfallData()
  }
}

/**
 * Fetch historical rainfall for charts
 */
export async function fetchHistoricalRainfall(lat = 0, lon = 0) {
  try {
    const endDate = new Date()
    const startDate = new Date()
    startDate.setMonth(startDate.getMonth() - 12)
    
    const response = await axios.get('https://archive-api.open-meteo.com/v1/archive', {
      params: {
        latitude: lat,
        longitude: lon,
        start_date: startDate.toISOString().split('T')[0],
        end_date: endDate.toISOString().split('T')[0],
        daily: 'precipitation_sum',
        timezone: 'auto'
      }
    })
    
    return response.data
  } catch (error) {
    console.error('Error fetching historical rainfall:', error)
    return generateMockMonthlyRainfall()
  }
}

// ==================== USER REPORTS ====================

/**
 * Submit a new user report
 */
export async function submitReport(reportData) {
  try {
    const response = await axios.post(`${MOCKAPI_URL}/reports`, {
      ...reportData,
      createdAt: new Date().toISOString()
    })
    
    return response.data
  } catch (error) {
    console.error('Error submitting report:', error)
    
    // Fallback to localStorage
    const reports = JSON.parse(localStorage.getItem('ecoflood_reports') || '[]')
    const newReport = {
      id: Date.now().toString(),
      ...reportData,
      createdAt: new Date().toISOString()
    }
    reports.push(newReport)
    localStorage.setItem('ecoflood_reports', JSON.stringify(reports))
    
    return newReport
  }
}

/**
 * Fetch all user reports
 */
export async function fetchReports() {
  try {
    const response = await axios.get(`${MOCKAPI_URL}/reports`)
    return response.data
  } catch (error) {
    console.error('Error fetching reports:', error)
    
    // Fallback to localStorage
    const reports = JSON.parse(localStorage.getItem('ecoflood_reports') || '[]')
    if (reports.length === 0) {
      return generateMockReports()
    }
    return reports
  }
}

// ==================== MOCK DATA GENERATORS ====================

function generateMockDeforestationData() {
  // Generate random deforestation hotspots in Indonesia
  const hotspots = []
  const indonesiaRegions = [
    { lat: -0.5, lng: 117.0, name: 'Kalimantan Timur' },
    { lat: -2.5, lng: 113.0, name: 'Kalimantan Tengah' },
    { lat: 0.5, lng: 101.5, name: 'Riau, Sumatra' },
    { lat: -2.0, lng: 106.0, name: 'Jambi, Sumatra' },
    { lat: -4.0, lng: 138.0, name: 'Papua' },
    { lat: -1.5, lng: 120.0, name: 'Sulawesi Tengah' },
    { lat: -6.2, lng: 106.8, name: 'Jawa Barat' },
    { lat: -7.8, lng: 110.4, name: 'Jawa Tengah' }
  ]
  
  indonesiaRegions.forEach(region => {
    for (let i = 0; i < 4; i++) {
      hotspots.push({
        lat: region.lat + (Math.random() - 0.5) * 1.5,
        lng: region.lng + (Math.random() - 0.5) * 1.5,
        intensity: Math.random() * 100,
        area_hectares: Math.random() * 5000,
        region: region.name
      })
    }
  })
  
  return hotspots
}

function generateMockAlerts() {
  return Array.from({ length: 15 }, (_, i) => ({
    id: i + 1,
    date: new Date(Date.now() - i * 86400000 * 3).toISOString(),
    lat: (Math.random() - 0.5) * 180,
    lng: (Math.random() - 0.5) * 360,
    confidence: Math.random() > 0.3 ? 'high' : 'medium'
  }))
}

function generateMockRainfallData() {
  return {
    daily: {
      time: Array.from({length: 7}, (_, i) => {
        const date = new Date()
        date.setDate(date.getDate() + i)
        return date.toISOString().split('T')[0]
      }),
      precipitation_sum: Array.from({length: 7}, () => Math.random() * 50),
      precipitation_probability_max: Array.from({length: 7}, () => Math.random() * 100)
    }
  }
}

function generateMockMonthlyRainfall() {
  const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec']
  return {
    monthly: months.map(month => ({
      month,
      rainfall: Math.random() * 200 + 50
    }))
  }
}

function generateMockReports() {
  return [
    {
      id: '1',
      location: 'Kalimantan Timur',
      lat: -0.9517,
      lng: 116.0921,
      type: 'deforestation',
      description: 'Area hutan yang luas dibuka untuk perkebunan kelapa sawit',
      imageUrl: '',
      createdAt: new Date(Date.now() - 86400000 * 2).toISOString()
    },
    {
      id: '2',
      location: 'Jakarta',
      lat: -6.2088,
      lng: 106.8456,
      type: 'flood',
      description: 'Banjir parah di area perkotaan setelah hujan deras',
      imageUrl: '',
      createdAt: new Date(Date.now() - 86400000 * 5).toISOString()
    },
    {
      id: '3',
      location: 'Riau, Sumatra',
      lat: 0.5071,
      lng: 101.4478,
      type: 'deforestation',
      description: 'Aktivitas penebangan liar terdeteksi',
      imageUrl: '',
      createdAt: new Date(Date.now() - 86400000 * 7).toISOString()
    },
    {
      id: '4',
      location: 'Papua',
      lat: -4.2699,
      lng: 138.0804,
      type: 'deforestation',
      description: 'Pembukaan hutan untuk pertambangan',
      imageUrl: '',
      createdAt: new Date(Date.now() - 86400000 * 10).toISOString()
    },
    {
      id: '5',
      location: 'Semarang, Jawa Tengah',
      lat: -7.0051,
      lng: 110.4381,
      type: 'flood',
      description: 'Banjir rob dan hujan ekstrem',
      imageUrl: '',
      createdAt: new Date(Date.now() - 86400000 * 12).toISOString()
    }
  ]
}
