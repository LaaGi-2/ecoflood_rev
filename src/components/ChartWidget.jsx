import { LineChart, Line, BarChart, Bar, AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend } from 'recharts'
import './ChartWidget.css'

function ChartWidget({ title, description, data, loading, error, type = 'line', dataKey, color }) {
  if (loading) {
    return (
      <div className="chart-widget glass">
        <div className="chart-loading">
          <div className="spinner"></div>
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="chart-widget glass">
        <div className="chart-error">
          <p>⚠️ {error}</p>
        </div>
      </div>
    )
  }

  const renderChart = () => {
    const commonProps = {
      data,
      margin: { top: 5, right: 20, left: 0, bottom: 5 }
    }

    switch (type) {
      case 'bar':
        return (
          <BarChart {...commonProps}>
            <CartesianGrid strokeDasharray="3 3" stroke="rgba(148, 163, 184, 0.2)" />
            <XAxis dataKey="name" stroke="#94a3b8" style={{ fontSize: '0.75rem' }} />
            <YAxis stroke="#94a3b8" style={{ fontSize: '0.75rem' }} />
            <Tooltip 
              contentStyle={{ 
                backgroundColor: '#1e293b', 
                border: '1px solid rgba(148, 163, 184, 0.2)',
                borderRadius: '8px',
                color: '#f1f5f9'
              }}
            />
            <Bar dataKey={dataKey} fill={color || '#10b981'} radius={[8, 8, 0, 0]} />
          </BarChart>
        )
      
      case 'area':
        return (
          <AreaChart {...commonProps}>
            <defs>
              <linearGradient id="colorValue" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor={color || '#ef4444'} stopOpacity={0.8}/>
                <stop offset="95%" stopColor={color || '#ef4444'} stopOpacity={0}/>
              </linearGradient>
            </defs>
            <CartesianGrid strokeDasharray="3 3" stroke="rgba(148, 163, 184, 0.2)" />
            <XAxis dataKey="name" stroke="#94a3b8" style={{ fontSize: '0.75rem' }} />
            <YAxis stroke="#94a3b8" style={{ fontSize: '0.75rem' }} />
            <Tooltip 
              contentStyle={{ 
                backgroundColor: '#1e293b', 
                border: '1px solid rgba(148, 163, 184, 0.2)',
                borderRadius: '8px',
                color: '#f1f5f9'
              }}
            />
            <Area type="monotone" dataKey={dataKey} stroke={color || '#ef4444'} fillOpacity={1} fill="url(#colorValue)" />
          </AreaChart>
        )
      
      default: // line
        return (
          <LineChart {...commonProps}>
            <CartesianGrid strokeDasharray="3 3" stroke="rgba(148, 163, 184, 0.2)" />
            <XAxis dataKey="name" stroke="#94a3b8" style={{ fontSize: '0.75rem' }} />
            <YAxis stroke="#94a3b8" style={{ fontSize: '0.75rem' }} />
            <Tooltip 
              contentStyle={{ 
                backgroundColor: '#1e293b', 
                border: '1px solid rgba(148, 163, 184, 0.2)',
                borderRadius: '8px',
                color: '#f1f5f9'
              }}
            />
            <Line type="monotone" dataKey={dataKey} stroke={color || '#06b6d4'} strokeWidth={3} dot={{ fill: color || '#06b6d4', r: 4 }} />
          </LineChart>
        )
    }
  }

  return (
    <div className="chart-widget glass">
      <div className="chart-header">
        <h3>{title}</h3>
        {description && <p>{description}</p>}
      </div>
      <div className="chart-container">
        <ResponsiveContainer width="100%" height={250}>
          {renderChart()}
        </ResponsiveContainer>
      </div>
    </div>
  )
}

export default ChartWidget
