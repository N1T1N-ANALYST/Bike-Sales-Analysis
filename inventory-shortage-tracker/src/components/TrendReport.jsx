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
import FileUpload from './FileUpload.jsx'
import ExportButton from './ExportButton.jsx'
import { parseFile } from '../utils/parseFile.js'
import { processTrendData } from '../utils/trendLogic.js'

ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend)

const RISK_STYLES = {
  High: 'bg-red-100 text-red-700',
  Medium: 'bg-yellow-100 text-yellow-700',
  Low: 'bg-green-100 text-green-700',
}

export default function TrendReport() {
  const [summary, setSummary] = useState([])
  const [chartData, setChartData] = useState(null)
  const [reorderDatasets, setReorderDatasets] = useState([])
  const [showReorder, setShowReorder] = useState(true)
  const [error, setError] = useState('')

  const handleFile = async (file) => {
    setError('')
    try {
      const rows = await parseFile(file)
      const result = processTrendData(rows)
      setSummary(result.summary)
      setChartData(result.chartData)
      setReorderDatasets(result.reorderDatasets)
    } catch (e) {
      setError('Failed to parse file. Check column names match the required format.')
    }
  }

  const combinedChartData = chartData
    ? {
        ...chartData,
        datasets: showReorder
          ? [...chartData.datasets, ...reorderDatasets]
          : chartData.datasets,
      }
    : null

  const chartOptions = {
    responsive: true,
    plugins: {
      legend: { position: 'bottom', labels: { boxWidth: 12, font: { size: 11 } } },
      title: { display: true, text: '📈 Stock Level Trends — Top At-Risk Items', font: { size: 14 } },
    },
    scales: {
      x: { title: { display: true, text: 'Month' } },
      y: { title: { display: true, text: 'Stock Level (units)' }, beginAtZero: true },
    },
    interaction: { mode: 'index', intersect: false },
  }

  return (
    <div className="space-y-6">
      <div className="bg-white rounded-xl p-6 shadow-sm">
        <h3 className="text-lg font-semibold text-gray-800 mb-4">Upload Stock History File</h3>
        <FileUpload
          onFileLoaded={handleFile}
          label="Upload Excel/CSV with: Item Name, Month (YYYY-MM), Stock Level, Reorder Level"
        />
        {error && <p className="mt-3 text-sm text-red-600">{error}</p>}
      </div>

      {summary.length > 0 && (
        <>
          <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
            <div className="bg-blue-50 border border-blue-200 rounded-xl p-4">
              <p className="text-sm font-medium text-blue-600">Total Items</p>
              <p className="text-3xl font-bold text-blue-700">{summary.length}</p>
            </div>
            <div className="bg-red-50 border border-red-200 rounded-xl p-4">
              <p className="text-sm font-medium text-red-600">High Risk</p>
              <p className="text-3xl font-bold text-red-700">{summary.filter(r => r['Risk Level'] === 'High').length}</p>
            </div>
            <div className="bg-yellow-50 border border-yellow-200 rounded-xl p-4">
              <p className="text-sm font-medium text-yellow-600">Medium Risk</p>
              <p className="text-3xl font-bold text-yellow-700">{summary.filter(r => r['Risk Level'] === 'Medium').length}</p>
            </div>
          </div>

          {/* Chart */}
          {combinedChartData && (
            <div className="bg-white rounded-xl shadow-sm p-6">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-semibold text-gray-800">Trend Chart (Top 8 At-Risk Items)</h3>
                <label className="flex items-center gap-2 text-sm text-gray-600 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={showReorder}
                    onChange={e => setShowReorder(e.target.checked)}
                    className="rounded"
                  />
                  Show reorder levels
                </label>
              </div>
              <Line data={combinedChartData} options={chartOptions} />
            </div>
          )}

          {/* Summary Table */}
          <div className="bg-white rounded-xl shadow-sm overflow-hidden">
            <div className="px-6 py-4 border-b flex items-center justify-between">
              <h3 className="text-lg font-semibold text-gray-800">Trend Summary</h3>
              <ExportButton data={summary} filename="shortage_trend_summary.xlsx" />
            </div>
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead className="bg-gray-50 border-b">
                  <tr>
                    {['Item Name', 'Months In Shortage', 'Total Months', 'Shortage %', 'Avg Stock', 'Min Stock', 'Risk Level'].map(col => (
                      <th key={col} className="px-4 py-3 text-left font-semibold text-gray-600 whitespace-nowrap">{col}</th>
                    ))}
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100">
                  {summary.map((row, i) => (
                    <tr key={i}>
                      <td className="px-4 py-3 font-medium text-gray-800">{row['Item Name']}</td>
                      <td className="px-4 py-3 text-gray-700">{row['Months In Shortage']}</td>
                      <td className="px-4 py-3 text-gray-700">{row['Total Months']}</td>
                      <td className="px-4 py-3 font-semibold text-gray-800">{row['Shortage %']}%</td>
                      <td className="px-4 py-3 text-gray-700">{row['Avg Stock']}</td>
                      <td className="px-4 py-3 text-gray-700">{row['Min Stock']}</td>
                      <td className="px-4 py-3">
                        <span className={`inline-block px-2 py-1 rounded-full text-xs font-semibold ${RISK_STYLES[row['Risk Level']] || ''}`}>
                          {row['Risk Level']}
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

      {summary.length === 0 && (
        <div className="bg-white rounded-xl p-8 shadow-sm text-center text-gray-400">
          <div className="text-5xl mb-3">📈</div>
          <p className="font-medium">Upload a file to see trend reports and charts</p>
          <p className="text-sm mt-1">Required columns: Item Name, Month (YYYY-MM), Stock Level, Reorder Level</p>
        </div>
      )}
    </div>
  )
}
