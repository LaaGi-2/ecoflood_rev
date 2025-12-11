import { useState, useEffect } from 'react'
import { fetchReports, submitReport } from '../services/api'
import LoadingSpinner from '../components/LoadingSpinner'
import './ReportPage.css'

function ReportPage() {
  const [reports, setReports] = useState([])
  const [loading, setLoading] = useState(true)
  const [submitting, setSubmitting] = useState(false)
  const [showForm, setShowForm] = useState(false)
  const [formData, setFormData] = useState({
    location: '',
    lat: '',
    lng: '',
    type: 'flood',
    description: '',
    imageUrl: ''
  })
  const [submitSuccess, setSubmitSuccess] = useState(false)

  useEffect(() => {
    loadReports()
  }, [])

  async function loadReports() {
    setLoading(true)
    try {
      const data = await fetchReports()
      setReports(data)
    } catch (error) {
      console.error('Error loading reports:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleInputChange = (e) => {
    const { name, value } = e.target
    setFormData(prev => ({
      ...prev,
      [name]: value
    }))
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setSubmitting(true)
    setSubmitSuccess(false)

    try {
      // Convert lat/lng to numbers
      const reportData = {
        ...formData,
        lat: formData.lat ? parseFloat(formData.lat) : undefined,
        lng: formData.lng ? parseFloat(formData.lng) : undefined
      }

      await submitReport(reportData)
      
      // Reset form
      setFormData({
        location: '',
        lat: '',
        lng: '',
        type: 'flood',
        description: '',
        imageUrl: ''
      })
      
      setSubmitSuccess(true)
      setShowForm(false)
      
      // Reload reports
      loadReports()
    } catch (error) {
      console.error('Error submitting report:', error)
      alert('Failed to submit report. Please try again.')
    } finally {
      setSubmitting(false)
    }
  }

  if (loading) {
    return (
      <div className="report-page">
        <div className="container">
          <LoadingSpinner message="Loading reports..." />
        </div>
      </div>
    )
  }

  return (
    <div className="report-page">
      <div className="container">
        <div className="page-header fade-in">
          <h1>📝 Community Reports</h1>
          <p>
            Share your observations or view reports from around the world about
            deforestation and flooding events.
          </p>
        </div>

        {/* Submit Button */}
        <div className="submit-section">
          <button
            className="btn btn-primary"
            onClick={() => setShowForm(!showForm)}
          >
            {showForm ? '✕ Cancel' : '+ Submit New Report'}
          </button>
          
          {submitSuccess && (
            <div className="success-message">
              ✅ Report submitted successfully!
            </div>
          )}
        </div>

        {/* Report Form */}
        {showForm && (
          <div className="report-form-container glass fade-in">
            <h2>Submit a Report</h2>
            <form onSubmit={handleSubmit} className="report-form">
              <div className="form-row">
                <div className="form-group">
                  <label htmlFor="location">Location *</label>
                  <input
                    id="location"
                    type="text"
                    name="location"
                    value={formData.location}
                    onChange={handleInputChange}
                    placeholder="e.g., Amazon Rainforest, Brazil"
                    required
                  />
                </div>

                <div className="form-group">
                  <label htmlFor="type">Report Type *</label>
                  <select
                    id="type"
                    name="type"
                    value={formData.type}
                    onChange={handleInputChange}
                    required
                  >
                    <option value="flood">Flood Event</option>
                    <option value="deforestation">Deforestation</option>
                  </select>
                </div>
              </div>

              <div className="form-row">
                <div className="form-group">
                  <label htmlFor="lat">Latitude (optional)</label>
                  <input
                    id="lat"
                    type="number"
                    name="lat"
                    value={formData.lat}
                    onChange={handleInputChange}
                    placeholder="e.g., -3.4653"
                    step="any"
                  />
                </div>

                <div className="form-group">
                  <label htmlFor="lng">Longitude (optional)</label>
                  <input
                    id="lng"
                    type="number"
                    name="lng"
                    value={formData.lng}
                    onChange={handleInputChange}
                    placeholder="e.g., -62.2159"
                    step="any"
                  />
                </div>
              </div>

              <div className="form-group">
                <label htmlFor="description">Description *</label>
                <textarea
                  id="description"
                  name="description"
                  value={formData.description}
                  onChange={handleInputChange}
                  placeholder="Describe what you observed..."
                  rows="4"
                  required
                ></textarea>
              </div>

              <div className="form-group">
                <label htmlFor="imageUrl">Image URL (optional)</label>
                <input
                  id="imageUrl"
                  type="url"
                  name="imageUrl"
                  value={formData.imageUrl}
                  onChange={handleInputChange}
                  placeholder="https://example.com/image.jpg"
                />
              </div>

              <button
                type="submit"
                className="btn btn-primary"
                disabled={submitting}
              >
                {submitting ? 'Submitting...' : 'Submit Report'}
              </button>
            </form>
          </div>
        )}

        {/* Reports Grid */}
        <div className="reports-section">
          <h2>Recent Reports ({reports.length})</h2>
          
          {reports.length === 0 ? (
            <div className="no-reports glass">
              <p>No reports yet. Be the first to submit one!</p>
            </div>
          ) : (
            <div className="reports-grid">
              {reports.map(report => (
                <div key={report.id} className="report-card glass">
                  <div className="report-header">
                    <div className={`report-type-badge ${report.type}`}>
                      {report.type === 'flood' ? '💧' : '🌳'} {report.type}
                    </div>
                    <div className="report-date">
                      {new Date(report.createdAt).toLocaleDateString()}
                    </div>
                  </div>
                  
                  <h3 className="report-location">{report.location}</h3>
                  
                  <p className="report-description">{report.description}</p>
                  
                  {report.imageUrl && (
                    <div className="report-image">
                      <img src={report.imageUrl} alt="Report" />
                    </div>
                  )}
                  
                  {report.lat && report.lng && (
                    <div className="report-coords">
                      📍 {report.lat.toFixed(4)}, {report.lng.toFixed(4)}
                    </div>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

export default ReportPage
