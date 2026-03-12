import React, { useState } from 'react'
import FileUpload from './FileUpload.jsx'
import ExportButton from './ExportButton.jsx'
import { parseFile } from '../utils/parseFile.js'

function alertLevel(days) {
  if (days <= 3) return 'CRITICAL'
  if (days <= 7) return 'High'
  if (days <= 14) return 'Medium'
  return 'Low'
}

const ALERT_STYLES = {
  CRITICAL: { card: 'border-red-400 bg-red-50', badge: 'bg-red-600 text-white', icon: '🔴' },
  High: { card: 'border-orange-400 bg-orange-50', badge: 'bg-orange-500 text-white', icon: '🟠' },
  Medium: { card: 'border-yellow-400 bg-yellow-50', badge: 'bg-yellow-500 text-white', icon: '🟡' },
  Low: { card: 'border-green-400 bg-green-50', badge: 'bg-green-600 text-white', icon: '🟢' },
}

const ALERT_ORDER = { CRITICAL: 0, High: 1, Medium: 2, Low: 3 }

export default function ShortageAlerts() {
  const [alerts, setAlerts] = useState([])
  const [error, setError] = useState('')

  const handleFile = async (file) => {
    setError('')
    try {
      const rows = await parseFile(file)
      const processed = rows
        .map(row => {
          const currentStock = Number(row['Current Stock']) || 0
          const reorderLevel = Number(row['Reorder Level']) || 0
          const avgDaily = Number(row['Avg Daily Consumption']) || 0
          const shortageGap = Math.max(0, reorderLevel - currentStock)
          const daysUntilStockout = avgDaily > 0 ? +(currentStock / avgDaily).toFixed(1) : 9999
          const level = alertLevel(daysUntilStockout)
          return {
            'Item Code': row['Item Code'] || '',
            'Item Name': row['Item Name'] || '',
            'Current Stock': currentStock,
            'Reorder Level': reorderLevel,
            'Shortage Gap': shortageGap,
            'Supplier': row['Supplier'] || '',
            'Lead Time': row['Lead Time'] || '',
            'Avg Daily Consumption': avgDaily,
            'Days Until Stockout': daysUntilStockout === 9999 ? 'N/A' : daysUntilStockout,
            'Alert Level': level,
          }
        })
        .filter(r => r['Current Stock'] < (r['Reorder Level']))
        .sort((a, b) => {
          const aD = a['Days Until Stockout'] === 'N/A' ? 9999 : Number(a['Days Until Stockout'])
          const bD = b['Days Until Stockout'] === 'N/A' ? 9999 : Number(b['Days Until Stockout'])
          return aD - bD
        })
      setAlerts(processed)
    } catch (e) {
      setError('Failed to parse file. Check that all required columns are present.')
    }
  }

  const counts = {
    CRITICAL: alerts.filter(a => a['Alert Level'] === 'CRITICAL').length,
    High: alerts.filter(a => a['Alert Level'] === 'High').length,
    Medium: alerts.filter(a => a['Alert Level'] === 'Medium').length,
    Low: alerts.filter(a => a['Alert Level'] === 'Low').length,
  }

  return (
    <div className="space-y-6">
      <div className="bg-white rounded-xl p-6 shadow-sm">
        <h3 className="text-lg font-semibold text-gray-800 mb-4">Upload Inventory File</h3>
        <FileUpload
          onFileLoaded={handleFile}
          label="Upload Excel/CSV with: Item Code, Item Name, Current Stock, Reorder Level, Supplier, Lead Time, Avg Daily Consumption"
        />
        {error && <p className="mt-3 text-sm text-red-600">{error}</p>}
      </div>

      {alerts.length > 0 && (
        <>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="bg-red-50 border border-red-200 rounded-xl p-4">
              <p className="text-sm font-medium text-red-600">🔴 CRITICAL</p>
              <p className="text-3xl font-bold text-red-700">{counts.CRITICAL}</p>
            </div>
            <div className="bg-orange-50 border border-orange-200 rounded-xl p-4">
              <p className="text-sm font-medium text-orange-600">🟠 High</p>
              <p className="text-3xl font-bold text-orange-700">{counts.High}</p>
            </div>
            <div className="bg-yellow-50 border border-yellow-200 rounded-xl p-4">
              <p className="text-sm font-medium text-yellow-600">🟡 Medium</p>
              <p className="text-3xl font-bold text-yellow-700">{counts.Medium}</p>
            </div>
            <div className="bg-green-50 border border-green-200 rounded-xl p-4">
              <p className="text-sm font-medium text-green-600">🟢 Low</p>
              <p className="text-3xl font-bold text-green-700">{counts.Low}</p>
            </div>
          </div>

          <div className="bg-white rounded-xl shadow-sm overflow-hidden">
            <div className="px-6 py-4 border-b flex items-center justify-between">
              <h3 className="text-lg font-semibold text-gray-800">Alert Cards ({alerts.length} items)</h3>
              <ExportButton data={alerts} filename="shortage_alerts.xlsx" />
            </div>
            <div className="p-6 grid grid-cols-1 md:grid-cols-2 gap-4">
              {alerts.map((alert, i) => {
                const style = ALERT_STYLES[alert['Alert Level']] || ALERT_STYLES.Low
                return (
                  <div key={i} className={`border-2 rounded-xl p-4 ${style.card}`}>
                    <div className="flex items-start justify-between mb-2">
                      <div>
                        <span className="text-lg mr-2">{style.icon}</span>
                        <span className="font-bold text-gray-800">{alert['Item Name']}</span>
                        {alert['Item Code'] && <span className="ml-2 text-xs text-gray-500">#{alert['Item Code']}</span>}
                      </div>
                      <span className={`px-2 py-1 rounded-full text-xs font-bold ${style.badge}`}>
                        {alert['Alert Level']}
                      </span>
                    </div>
                    <div className="grid grid-cols-2 gap-2 text-sm mt-3">
                      <div>
                        <span className="text-gray-500">Supplier:</span>
                        <span className="ml-1 font-medium text-gray-700">{alert['Supplier']}</span>
                      </div>
                      <div>
                        <span className="text-gray-500">Lead Time:</span>
                        <span className="ml-1 font-medium text-gray-700">{alert['Lead Time']}</span>
                      </div>
                      <div>
                        <span className="text-gray-500">Current Stock:</span>
                        <span className="ml-1 font-medium text-gray-700">{alert['Current Stock']} units</span>
                      </div>
                      <div>
                        <span className="text-gray-500">Shortage Gap:</span>
                        <span className="ml-1 font-semibold text-red-700">{alert['Shortage Gap']} units</span>
                      </div>
                      <div>
                        <span className="text-gray-500">Avg Daily:</span>
                        <span className="ml-1 font-medium text-gray-700">{alert['Avg Daily Consumption']} units/day</span>
                      </div>
                      <div>
                        <span className="text-gray-500">Days Until Stockout:</span>
                        <span className="ml-1 font-bold text-gray-800">{alert['Days Until Stockout']}</span>
                      </div>
                    </div>
                  </div>
                )
              })}
            </div>
          </div>
        </>
      )}

      {alerts.length === 0 && (
        <div className="bg-white rounded-xl p-8 shadow-sm text-center text-gray-400">
          <div className="text-5xl mb-3">🚨</div>
          <p className="font-medium">Upload a file to see shortage alerts</p>
          <p className="text-sm mt-1">Required columns: Item Code, Item Name, Current Stock, Reorder Level, Supplier, Lead Time, Avg Daily Consumption</p>
        </div>
      )}
    </div>
  )
}
