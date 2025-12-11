/**
 * Calculate flood probability based on environmental parameters
 * @param {number} forestCover - Forest coverage percentage (0-100)
 * @param {number} rainfall - Rainfall intensity in mm (0-300)
 * @param {string} soilAbsorption - Soil absorption level: 'low', 'medium', 'high'
 * @returns {object} Simulation results
 */
export function calculateFloodRisk(forestCover, rainfall, soilAbsorption) {
  // Normalize inputs
  const forestFactor = 1 - (forestCover / 100) // Less forest = higher risk
  const rainfallFactor = rainfall / 300 // Normalized 0-1
  
  const soilFactors = {
    low: 0.9,
    medium: 0.5,
    high: 0.2
  }
  const soilFactor = soilFactors[soilAbsorption] || 0.5
  
  // Calculate flood probability (0-100)
  const baseProbability = (forestFactor * 40) + (rainfallFactor * 40) + (soilFactor * 20)
  const floodProbability = Math.min(100, Math.max(0, baseProbability))
  
  // Calculate water runoff (higher = more runoff)
  const runoff = ((forestFactor * 0.5) + (rainfallFactor * 0.3) + (soilFactor * 0.2)) * 100
  
  // Calculate environmental health (inverse of flood risk)
  const environmentalHealth = 100 - floodProbability
  
  // Risk level classification
  let riskLevel = 'low'
  if (floodProbability > 70) riskLevel = 'critical'
  else if (floodProbability > 50) riskLevel = 'high'
  else if (floodProbability > 30) riskLevel = 'medium'
  
  return {
    floodProbability: Math.round(floodProbability),
    waterRunoff: Math.round(runoff),
    environmentalHealth: Math.round(environmentalHealth),
    riskLevel,
    factors: {
      forestImpact: Math.round(forestFactor * 100),
      rainfallImpact: Math.round(rainfallFactor * 100),
      soilImpact: Math.round(soilFactor * 100)
    }
  }
}

/**
 * Get risk level color
 */
export function getRiskColor(riskLevel) {
  const colors = {
    low: '#10b981',
    medium: '#f59e0b',
    high: '#ef4444',
    critical: '#991b1b'
  }
  return colors[riskLevel] || colors.low
}

/**
 * Generate recommendations based on simulation
 */
export function getRecommendations(results) {
  const recommendations = []
  
  if (results.factors.forestImpact > 60) {
    recommendations.push('🌳 Increase forest cover through reforestation programs')
  }
  
  if (results.factors.rainfallImpact > 70) {
    recommendations.push('💧 Improve drainage systems and water management')
  }
  
  if (results.factors.soilImpact > 60) {
    recommendations.push('🌱 Enhance soil quality and natural absorption capacity')
  }
  
  if (results.floodProbability > 70) {
    recommendations.push('⚠️ Consider flood prevention infrastructure')
  }
  
  if (recommendations.length === 0) {
    recommendations.push('✅ Current conditions show low flood risk')
  }
  
  return recommendations
}
