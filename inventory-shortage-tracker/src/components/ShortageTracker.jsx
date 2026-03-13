import React, { useState } from 'react'
import FileUpload from './FileUpload'
import ExportButton from './ExportButton'
import { parseCSVOrExcel } from '../utils/parseFile'
import { computeShortages } from '../utils/shortageLogic'
import { exportToExcel } from '../utils/exportToExcel'

const URGENCY_STYLES = {
  CRITICAL: 'bg-red-100 text-red-800 border border-red-300',
  Critical: 'bg-red-100 text-red-800 border border-red-300',
  Warning: 'bg-orange-100 text-orange-800 border border-orange-300',
  OK: 'bg-green-100 text-green-800 border border-green-300',
}

export default function ShortageTracker() {
  const [data, setData] = useState([])
  const [shortages, setShortages] = useState([])
  const [fileName, setFileName] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [sortField, setSortField] = useState('')
  const [sortDir, setSortDir] = useState('asc')

  async function handleFile(file) {
    setLoading(true)
    setError('')
    try {
      const rows = await parseCSVOrExcel(file)
      setData(rows)
      setShortages(computeShortages(rows))
      setFileName(file.name)
    } catch (err) {
      setError('Failed to parse file. Please check the format.')
    } finally {
      setLoading(false)
    }
  }

  function handleSort(field) {
    if (sortField === field) {
      setSortDir(sortDir === 'asc' ? 'desc' : 'asc')
    } else {
      setSortField(field)
      setSortDir('asc')
    }
  }

  const sortedShortages = [...shortages].sort((a, b) => {
    if (!sortField) return 0
    const va = a[sortField] ?? ''
    const vb = b[sortField] ?? ''
    if (typeof va === 'number' && typeof vb === 'number') {
      return sortDir === 'asc' ? va - vb : vb - va
    }
    return sortDir === 'asc'
      ? String(va).localeCompare(String(vb))
      : String(vb).localeCompare(String(va))
  })

  const totalItems = data.length
  const totalShortage = shortages.length
  const criticalCount = shortages.filter((r) =>
    ['CRITICAL', 'Critical'].includes(r.Urgency)
  ).length
  const warningCount = shortages.filter((r) => r.Urgency === 'Warning').length

  const columns = [
    'Item Code', 'Item Name', 'Current Stock', 'Reorder Level',
    'Shortage Qty', 'Supplier', 'Lead Time', 'Urgency',
  ]

  function SortIcon({ field }) {
    if (sortField !== field) return <span className="text-gray-300 ml-1">↕</span>
    return <span className="ml-1">{sortDir === 'asc' ? '↑' : '↓'}</span>
  }

  return (
    <div className="p-6 space-y-6">
      <div>
        <h2 className="text-2xl font-bold text-gray-800 mb-1">📋 Shortage Tracker</h2>
        <p className="text-gray-500 text-sm">
          Upload a CSV or Excel file with inventory data to identify shortage items.
        </p>
      </div>

      <FileUpload
        onFile={handleFile}
        accept=".csv,.xlsx,.xls"
        label="Upload inventory CSV or Excel file"
        selectedName={fileName}
      />

      {loading && <p className="text-blue-600 font-medium">⏳ Processing file…</p>}
      {error && <p className="text-red-600 font-medium">❌ {error}</p>}

      {shortages.length > 0 && (
        <>
          {/* Summary cards */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <StatCard label="Total Items" value={totalItems} color="border-blue-400" icon="📦" />
            <StatCard label="In Shortage" value={totalShortage} color="border-red-400" icon="⚠️" />
            <StatCard label="Critical" value={criticalCount} color="border-red-600" icon="🔴" />
            <StatCard label="Warning" value={warningCount} color="border-orange-400" icon="🟠" />
          </div>

          <div className="flex justify-end">
            <ExportButton
              onClick={() => exportToExcel(shortages, 'shortage_tracker_report')}
            />
          </div>

          {/* Table */}
          <div className="overflow-x-auto rounded-xl border border-gray-200 shadow-sm">
            <table className="min-w-full text-sm">
              <thead className="bg-gray-800 text-white">
                <tr>
                  {columns.map((col) => (
                    <th
                      key={col}
                      className="px-4 py-3 text-left cursor-pointer hover:bg-gray-700 select-none"
                      onClick={() => handleSort(col)}
                    >
                      {col} <SortIcon field={col} />
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {sortedShortages.map((row, i) => (
                  <tr key={i} className={i % 2 === 0 ? 'bg-white' : 'bg-gray-50'}>
                    <td className="px-4 py-2 text-gray-700">{row['Item Code']}</td>
                    <td className="px-4 py-2 font-medium text-gray-800">{row['Item Name']}</td>
                    <td className="px-4 py-2 text-gray-700">{row['Current Stock']}</td>
                    <td className="px-4 py-2 text-gray-700">{row['Reorder Level']}</td>
                    <td className="px-4 py-2 font-semibold text-red-700">{row['Shortage Qty']}</td>
                    <td className="px-4 py-2 text-gray-700">{row['Supplier']}</td>
                    <td className="px-4 py-2 text-gray-700">{row['Lead Time']}</td>
                    <td className="px-4 py-2">
                      <span
                        className={`px-2 py-1 rounded-full text-xs font-semibold ${
                          URGENCY_STYLES[row.Urgency] || 'bg-gray-100 text-gray-700'
                        }`}
                      >
                        {row.Urgency}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </>
      )}

      {!loading && data.length === 0 && (
        <div className="bg-blue-50 rounded-xl p-6 text-sm text-blue-700">
          <p className="font-semibold mb-2">📋 Required columns:</p>
          <code className="block bg-white rounded p-2 text-xs">
            Item Code | Item Name | Current Stock | Reorder Level | Supplier | Lead Time
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
