import { useState, useEffect } from 'react'
import { calculateFloodRisk, getRiskColor, getRecommendations } from '../services/simulation'
import './SimulationPage.css'

function SimulationPage() {
  const [forestCover, setForestCover] = useState(60)
  const [rainfall, setRainfall] = useState(100)
  const [soilAbsorption, setSoilAbsorption] = useState('medium')
  const [results, setResults] = useState(null)

  useEffect(() => {
    const newResults = calculateFloodRisk(forestCover, rainfall, soilAbsorption)
    setResults(newResults)
  }, [forestCover, rainfall, soilAbsorption])

  const recommendations = results ? getRecommendations(results) : []

  return (
    <div className="simulation-page">
      <div className="container">
        <div className="page-header fade-in">
          <h1>🧪 Environmental Simulation Lab</h1>
          <p>
            Experiment with environmental parameters to see how deforestation,
            rainfall, and soil quality impact flood risk in real-time.
          </p>
        </div>

        <div className="simulation-container">
          {/* Controls Panel */}
          <div className="controls-panel glass">
            <h2>Parameters</h2>
            
            <div className="control-group">
              <label htmlFor="forest-cover">
                🌳 Forest Cover: <strong>{forestCover}%</strong>
              </label>
              <input
                id="forest-cover"
                type="range"
                min="0"
                max="100"
                value={forestCover}
                onChange={(e) => setForestCover(Number(e.target.value))}
                className="slider slider-green"
              />
              <div className="control-hint">
                Lower forest cover reduces natural water absorption
              </div>
            </div>

            <div className="control-group">
              <label htmlFor="rainfall">
                💧 Rainfall Intensity: <strong>{rainfall} mm</strong>
              </label>
              <input
                id="rainfall"
                type="range"
                min="0"
                max="300"
                value={rainfall}
                onChange={(e) => setRainfall(Number(e.target.value))}
                className="slider slider-blue"
              />
              <div className="control-hint">
                Higher rainfall increases runoff and flood potential
              </div>
            </div>

            <div className="control-group">
              <label htmlFor="soil">
                🌱 Soil Absorption Capacity
              </label>
              <select
                id="soil"
                value={soilAbsorption}
                onChange={(e) => setSoilAbsorption(e.target.value)}
              >
                <option value="low">Low (Degraded/Compacted)</option>
                <option value="medium">Medium (Moderate Health)</option>
                <option value="high">High (Healthy/Porous)</option>
              </select>
              <div className="control-hint">
                Healthy soil absorbs more water, reducing flood risk
              </div>
            </div>

            <button
              className="btn btn-secondary"
              onClick={() => {
                setForestCover(60)
                setRainfall(100)
                setSoilAbsorption('medium')
              }}
            >
              Reset to Defaults
            </button>
          </div>

          {/* Results Panel */}
          {results && (
            <div className="results-panel">
              <div className="result-card glass" style={{ borderColor: getRiskColor(results.riskLevel) }}>
                <div className="result-header">
                  <h3>Flood Probability</h3>
                  <div 
                    className="risk-badge"
                    style={{ backgroundColor: getRiskColor(results.riskLevel) }}
                  >
                    {results.riskLevel.toUpperCase()}
                  </div>
                </div>
                <div className="result-value" style={{ color: getRiskColor(results.riskLevel) }}>
                  {results.floodProbability}%
                </div>
                <div className="result-bar">
                  <div 
                    className="result-bar-fill"
                    style={{ 
                      width: `${results.floodProbability}%`,
                      backgroundColor: getRiskColor(results.riskLevel)
                    }}
                  ></div>
                </div>
              </div>

              <div className="result-card glass">
                <h3>Water Runoff</h3>
                <div className="result-value">{results.waterRunoff}%</div>
                <div className="result-bar">
                  <div 
                    className="result-bar-fill"
                    style={{ 
                      width: `${results.waterRunoff}%`,
                      backgroundColor: 'var(--color-secondary)'
                    }}
                  ></div>
                </div>
                <p className="result-description">
                  Amount of water that runs off instead of being absorbed
                </p>
              </div>

              <div className="result-card glass">
                <h3>Environmental Health</h3>
                <div className="result-value" style={{ color: 'var(--color-primary)' }}>
                  {results.environmentalHealth}%
                </div>
                <div className="result-bar">
                  <div 
                    className="result-bar-fill"
                    style={{ 
                      width: `${results.environmentalHealth}%`,
                      backgroundColor: 'var(--color-primary)'
                    }}
                  ></div>
                </div>
                <p className="result-description">
                  Overall ecosystem capacity to manage water
                </p>
              </div>

              {/* Factor Breakdown */}
              <div className="factors-card glass">
                <h3>Impact Breakdown</h3>
                <div className="factors-list">
                  <div className="factor-item">
                    <span className="factor-label">🌳 Forest Impact</span>
                    <span className="factor-value">{results.factors.forestImpact}%</span>
                  </div>
                  <div className="factor-item">
                    <span className="factor-label">💧 Rainfall Impact</span>
                    <span className="factor-value">{results.factors.rainfallImpact}%</span>
                  </div>
                  <div className="factor-item">
                    <span className="factor-label">🌱 Soil Impact</span>
                    <span className="factor-value">{results.factors.soilImpact}%</span>
                  </div>
                </div>
              </div>

              {/* Recommendations */}
              <div className="recommendations-card glass">
                <h3>Recommendations</h3>
                <ul className="recommendations-list">
                  {recommendations.map((rec, index) => (
                    <li key={index}>{rec}</li>
                  ))}
                </ul>
              </div>
            </div>
          )}
        </div>

        {/* Info Section */}
        <div className="info-section">
          <div className="info-card glass">
            <h3>How It Works</h3>
            <p>
              This simulation uses a simplified model to demonstrate the relationship
              between forest cover, rainfall, and flood risk. The calculation considers:
            </p>
            <ul>
              <li><strong>Forest Cover:</strong> Trees and vegetation absorb rainfall and reduce runoff</li>
              <li><strong>Rainfall Intensity:</strong> Higher amounts overwhelm absorption capacity</li>
              <li><strong>Soil Quality:</strong> Healthy soil acts like a sponge, storing water</li>
            </ul>
            <p>
              Real-world flood prediction involves many more variables, but this model
              illustrates the critical role forests play in water management.
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}

export default SimulationPage
