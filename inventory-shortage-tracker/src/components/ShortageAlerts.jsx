import React, { useState } from 'react'
import FileUpload from './FileUpload'
import ExportButton from './ExportButton'
import { parseCSVOrExcel } from '../utils/parseFile'
import { computeAlerts } from '../utils/shortageLogic'
import { exportToExcel } from '../utils/exportToExcel'

const ALERT_STYLES = {
  CRITICAL: { card: 'border-red-400 bg-red-50', badge: 'bg-red-100 text-red-800 border border-red-300' },
  High: { card: 'border-orange-400 bg-orange-50', badge: 'bg-orange-100 text-orange-800 border border-orange-300' },
  Medium: { card: 'border-yellow-400 bg-yellow-50', badge: 'bg-yellow-100 text-yellow-800 border border-yellow-300' },
  Low: { card: 'border-green-400 bg-green-50', badge: 'bg-green-100 text-green-800 border border-green-300' },
}

export default function ShortageAlerts() {
  const [alerts, setAlerts] = useState([])
  const [fileName, setFileName] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  async function handleFile(file) {
    setLoading(true)
    setError('')
    try {
      const rows = await parseCSVOrExcel(file)
      setAlerts(computeAlerts(rows))
      setFileName(file.name)
    } catch {
      setError('Failed to parse file. Please check the format.')
    } finally {
      setLoading(false)
    }
  }

  const counts = {
    CRITICAL: alerts.filter((a) => a['Alert Level'] === 'CRITICAL').length,
    High: alerts.filter((a) => a['Alert Level'] === 'High').length,
    Medium: alerts.filter((a) => a['Alert Level'] === 'Medium').length,
    Low: alerts.filter((a) => a['Alert Level'] === 'Low').length,
  }

  return (
    <div className="p-6 space-y-6">
      <div>
        <h2 className="text-2xl font-bold text-gray-800 mb-1">🚨 Shortage Alerts</h2>
        <p className="text-gray-500 text-sm">
          Upload inventory file to get alert cards with days until stockout.
        </p>
      </div>

      <FileUpload
        onFile={handleFile}
        accept=".csv,.xlsx,.xls"
        label="Upload inventory file (with Avg Daily Consumption)"
        selectedName={fileName}
      />

      {loading && <p className="text-blue-600 font-medium">⏳ Processing file…</p>}
      {error && <p className="text-red-600 font-medium">❌ {error}</p>}

      {alerts.length > 0 && (
        <>
          {/* Summary counts */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <StatCard label="CRITICAL" value={counts.CRITICAL} color="border-red-600" icon="🔴" />
            <StatCard label="High" value={counts.High} color="border-orange-400" icon="🟠" />
            <StatCard label="Medium" value={counts.Medium} color="border-yellow-400" icon="🟡" />
            <StatCard label="Low" value={counts.Low} color="border-green-400" icon="🟢" />
          </div>

          <div className="flex justify-end">
            <ExportButton
              onClick={() => exportToExcel(alerts, 'shortage_alerts')}
            />
          </div>

          {/* Alert cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
            {alerts.map((alert, i) => {
              const styles = ALERT_STYLES[alert['Alert Level']] || ALERT_STYLES.Low
              return (
                <div key={i} className={`rounded-xl border-l-4 p-4 shadow-sm ${styles.card}`}>
                  <div className="flex items-start justify-between mb-2">
                    <span className="font-semibold text-gray-800 text-sm">
                      {alert['Item Name'] || alert['Item Code'] || 'Unknown'}
                    </span>
                    <span className={`text-xs font-bold px-2 py-0.5 rounded-full ${styles.badge}`}>
                      {alert['Alert Level']}
                    </span>
                  </div>
                  <div className="space-y-1 text-xs text-gray-600">
                    <p>
                      <span className="font-medium">Supplier:</span> {alert['Supplier'] || '—'}
                    </p>
                    <p>
                      <span className="font-medium">Current Stock:</span>{' '}
                      {alert['Current Stock']} units
                    </p>
                    <p>
                      <span className="font-medium">Shortage Gap:</span>{' '}
                      <span className="text-red-700 font-semibold">
                        {alert['Shortage Gap']} units
                      </span>
                    </p>
                    <p>
                      <span className="font-medium">Days Until Stockout:</span>{' '}
                      <span className="font-bold text-orange-700">
                        {alert['Days Until Stockout']} days
                      </span>
                    </p>
                    <p>
                      <span className="font-medium">Lead Time:</span>{' '}
                      {alert['Lead Time'] || '—'} days
                    </p>
                  </div>
                </div>
              )
            })}
          </div>
        </>
      )}

      {!loading && alerts.length === 0 && !fileName && (
        <div className="bg-blue-50 rounded-xl p-6 text-sm text-blue-700">
          <p className="font-semibold mb-2">📋 Required columns:</p>
          <code className="block bg-white rounded p-2 text-xs">
            Item Name | Current Stock | Reorder Level | Supplier | Lead Time | Avg Daily Consumption
          </code>
        </div>
      )}
    </div>
  )
}

function StatCard({ label, value, color, icon }) {
  return (
    <div className={`bg-white rounded-xl border-l-4 ${color} shadow-sm p-4 flex items-center gap-3`}>
      <span className="text-2xl">{icon}</span>
      <div>
        <p className="text-xs text-gray-500 uppercase tracking-wide">{label}</p>
        <p className="text-2xl font-bold text-gray-800">{value}</p>
      </div>
    </div>
  )
}
