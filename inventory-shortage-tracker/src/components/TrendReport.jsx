import React, { useState } from 'react'
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
} from 'chart.js'
import { Line } from 'react-chartjs-2'
import FileUpload from './FileUpload'
import ExportButton from './ExportButton'
import { parseCSVOrExcel } from '../utils/parseFile'
import { computeTrends } from '../utils/trendLogic'
import { exportToExcel } from '../utils/exportToExcel'

ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend)

const RISK_STYLES = {
  'High Risk': 'bg-red-100 text-red-800 border border-red-300',
  'Medium Risk': 'bg-yellow-100 text-yellow-800 border border-yellow-300',
  'Low Risk': 'bg-green-100 text-green-800 border border-green-300',
}

const LINE_COLORS = [
  '#ef4444', '#f97316', '#eab308', '#22c55e',
  '#3b82f6', '#8b5cf6', '#ec4899', '#06b6d4',
]

export default function TrendReport() {
  const [summary, setSummary] = useState([])
  const [fileName, setFileName] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  async function handleFile(file) {
    setLoading(true)
    setError('')
    try {
      const rows = await parseCSVOrExcel(file)
      setSummary(computeTrends(rows))
      setFileName(file.name)
    } catch {
      setError('Failed to parse file. Please check the format.')
    } finally {
      setLoading(false)
    }
  }

  // Build chart data from top 8 items
  const top8 = summary.slice(0, 8)
  const allMonths = [
    ...new Set(
      top8.flatMap((item) => item.monthlySeries.map((s) => s.month))
    ),
  ].sort()

  const chartData = {
    labels: allMonths,
    datasets: top8.map((item, i) => {
      const monthMap = {}
      item.monthlySeries.forEach((s) => { monthMap[s.month] = s.stockLevel })
      return {
        label: item['Item Name'],
        data: allMonths.map((m) => monthMap[m] ?? null),
        borderColor: LINE_COLORS[i % LINE_COLORS.length],
        backgroundColor: LINE_COLORS[i % LINE_COLORS.length] + '33',
        tension: 0.3,
        pointRadius: 4,
      }
    }),
  }

  const chartOptions = {
    responsive: true,
    plugins: {
      legend: { position: 'top' },
      title: {
        display: true,
        text: '📈 Stock Level Trends — Top At-Risk Items',
        font: { size: 14 },
      },
    },
    scales: {
      y: { title: { display: true, text: 'Stock Level (units)' } },
      x: { title: { display: true, text: 'Month' } },
    },
  }

  return (
    <div className="p-6 space-y-6">
      <div>
        <h2 className="text-2xl font-bold text-gray-800 mb-1">📈 Shortage Trend Report</h2>
        <p className="text-gray-500 text-sm">
          Upload monthly stock history to identify consistently low-stock items.
        </p>
      </div>

      <FileUpload
        onFile={handleFile}
        accept=".csv,.xlsx,.xls"
        label="Upload stock history file"
        selectedName={fileName}
      />

      {loading && <p className="text-blue-600 font-medium">⏳ Processing file…</p>}
      {error && <p className="text-red-600 font-medium">❌ {error}</p>}

      {summary.length > 0 && (
        <>
          {/* Line chart */}
          {top8.length > 0 && allMonths.length > 0 && (
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-4">
              <Line data={chartData} options={chartOptions} />
            </div>
          )}

          <div className="flex justify-end">
            <ExportButton
              onClick={() =>
                exportToExcel(
                  summary.map(({ monthlySeries, ...r }) => r),
                  'shortage_trend_report'
                )
              }
            />
          </div>

          {/* Summary table */}
          <div className="overflow-x-auto rounded-xl border border-gray-200 shadow-sm">
            <table className="min-w-full text-sm">
              <thead className="bg-gray-800 text-white">
                <tr>
                  {['Item Name', 'Months In Shortage', 'Total Months', 'Shortage %', 'Risk Level'].map(
                    (col) => (
                      <th key={col} className="px-4 py-3 text-left">{col}</th>
                    )
                  )}
                </tr>
              </thead>
              <tbody>
                {summary.map((row, i) => (
                  <tr key={i} className={i % 2 === 0 ? 'bg-white' : 'bg-gray-50'}>
                    <td className="px-4 py-2 font-medium text-gray-800">{row['Item Name']}</td>
                    <td className="px-4 py-2 text-gray-700">{row['Months In Shortage']}</td>
                    <td className="px-4 py-2 text-gray-700">{row['Total Months']}</td>
                    <td className="px-4 py-2 font-semibold text-gray-800">{row['Shortage %']}%</td>
                    <td className="px-4 py-2">
                      <span
                        className={`px-2 py-1 rounded-full text-xs font-semibold ${
                          RISK_STYLES[row['Risk Level']] || 'bg-gray-100 text-gray-700'
                        }`}
                      >
                        {row['Risk Level']}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </>
      )}

      {!loading && summary.length === 0 && !fileName && (
        <div className="bg-blue-50 rounded-xl p-6 text-sm text-blue-700">
          <p className="font-semibold mb-2">📋 Required columns:</p>
          <code className="block bg-white rounded p-2 text-xs">
            Item Name | Month (e.g. 2025-08) | Stock Level | Reorder Level
          </code>
        </div>
      )}
    </div>
  )
}
