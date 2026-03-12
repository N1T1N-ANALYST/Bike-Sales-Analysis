import React, { useState } from 'react'
import FileUpload from './FileUpload.jsx'
import ExportButton from './ExportButton.jsx'
import { parseFile } from '../utils/parseFile.js'
import { processShortageData, getShortageStats } from '../utils/shortageLogic.js'

const URGENCY_STYLES = {
  CRITICAL: 'bg-red-100 text-red-800 font-bold',
  Critical: 'bg-red-50 text-red-700',
  Warning: 'bg-orange-50 text-orange-700',
  OK: 'bg-green-50 text-green-700',
}

const ROW_STYLES = {
  CRITICAL: 'bg-red-50',
  Critical: 'bg-red-50/50',
  Warning: 'bg-orange-50/50',
  OK: '',
}

export default function ShortageTracker() {
  const [data, setData] = useState([])
  const [stats, setStats] = useState(null)
  const [error, setError] = useState('')
  const [sortField, setSortField] = useState('Urgency')
  const [sortDir, setSortDir] = useState('asc')

  const handleFile = async (file) => {
    setError('')
    try {
      const rows = await parseFile(file)
      const processed = processShortageData(rows)
      setData(processed)
      setStats(getShortageStats(processed))
    } catch (e) {
      setError('Failed to parse file. Please check the column names match the required format.')
    }
  }

  const handleSort = (field) => {
    if (sortField === field) {
      setSortDir(d => d === 'asc' ? 'desc' : 'asc')
    } else {
      setSortField(field)
      setSortDir('asc')
    }
  }

  const sorted = [...data].sort((a, b) => {
    const va = a[sortField]
    const vb = b[sortField]
    if (typeof va === 'number' && typeof vb === 'number') {
      return sortDir === 'asc' ? va - vb : vb - va
    }
    return sortDir === 'asc'
      ? String(va).localeCompare(String(vb))
      : String(vb).localeCompare(String(va))
  })

  const SortIcon = ({ field }) => (
    <span className="ml-1 text-xs opacity-60">
      {sortField === field ? (sortDir === 'asc' ? '▲' : '▼') : '⇅'}
    </span>
  )

  return (
    <div className="space-y-6">
      {/* File Upload */}
      <div className="bg-white rounded-xl p-6 shadow-sm">
        <h3 className="text-lg font-semibold text-gray-800 mb-4">Upload Inventory File</h3>
        <FileUpload
          onFileLoaded={handleFile}
          label="Upload CSV or Excel with: Item Code, Item Name, Current Stock, Reorder Level, Supplier, Lead Time"
        />
        {error && <p className="mt-3 text-sm text-red-600">{error}</p>}
      </div>

      {stats && (
        <>
          {/* Stats Cards */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <StatCard label="Total Items" value={stats.total} color="blue" />
            <StatCard label="In Shortage" value={stats.inShortage} color="red" />
            <StatCard label="Critical" value={stats.critical} color="red" />
            <StatCard label="Warning" value={stats.warning} color="orange" />
          </div>

          {/* Table */}
          <div className="bg-white rounded-xl shadow-sm overflow-hidden">
            <div className="px-6 py-4 border-b flex items-center justify-between">
              <h3 className="text-lg font-semibold text-gray-800">Shortage Report</h3>
              <ExportButton data={sorted} filename="shortage_tracker_report.xlsx" />
            </div>
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead className="bg-gray-50 border-b">
                  <tr>
                    {['Item Code', 'Item Name', 'Current Stock', 'Reorder Level', 'Shortage Qty', 'Supplier', 'Lead Time', 'Urgency'].map(col => (
                      <th
                        key={col}
                        onClick={() => handleSort(col)}
                        className="px-4 py-3 text-left font-semibold text-gray-600 cursor-pointer hover:text-gray-900 whitespace-nowrap"
                      >
                        {col}<SortIcon field={col} />
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100">
                  {sorted.map((row, i) => (
                    <tr key={i} className={ROW_STYLES[row.Urgency] || ''}>
                      <td className="px-4 py-3 text-gray-700">{row['Item Code']}</td>
                      <td className="px-4 py-3 font-medium text-gray-800">{row['Item Name']}</td>
                      <td className="px-4 py-3 text-gray-700">{row['Current Stock']}</td>
                      <td className="px-4 py-3 text-gray-700">{row['Reorder Level']}</td>
                      <td className="px-4 py-3 font-semibold text-gray-800">{row['Shortage Qty']}</td>
                      <td className="px-4 py-3 text-gray-700">{row['Supplier']}</td>
                      <td className="px-4 py-3 text-gray-700">{row['Lead Time']}</td>
                      <td className="px-4 py-3">
                        <span className={`inline-block px-2 py-1 rounded-full text-xs font-semibold ${URGENCY_STYLES[row.Urgency] || ''}`}>
                          {row.Urgency}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </>
      )}

      {!stats && (
        <div className="bg-white rounded-xl p-8 shadow-sm text-center text-gray-400">
          <div className="text-5xl mb-3">📋</div>
          <p className="font-medium">Upload a file to see the shortage report</p>
          <p className="text-sm mt-1">Required columns: Item Code, Item Name, Current Stock, Reorder Level, Supplier, Lead Time</p>
        </div>
      )}
    </div>
  )
}

function StatCard({ label, value, color }) {
  const colors = {
    blue: 'bg-blue-50 text-blue-700 border-blue-200',
    red: 'bg-red-50 text-red-700 border-red-200',
    orange: 'bg-orange-50 text-orange-700 border-orange-200',
    green: 'bg-green-50 text-green-700 border-green-200',
  }
  return (
    <div className={`rounded-xl p-4 border ${colors[color] || colors.blue}`}>
      <p className="text-sm font-medium opacity-75">{label}</p>
      <p className="text-3xl font-bold mt-1">{value}</p>
    </div>
  )
}
