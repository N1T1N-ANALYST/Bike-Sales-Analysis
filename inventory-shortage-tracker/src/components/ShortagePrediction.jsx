import React, { useState } from 'react'
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
} from 'chart.js'
import { Bar } from 'react-chartjs-2'
import FileUpload from './FileUpload.jsx'
import ExportButton from './ExportButton.jsx'
import { parseFile } from '../utils/parseFile.js'
import { processPredictionData, getPredictionStats } from '../utils/predictionLogic.js'

ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend)

const RISK_STYLES = {
  CRITICAL: 'bg-red-100 text-red-700',
  High: 'bg-orange-100 text-orange-700',
  Medium: 'bg-yellow-100 text-yellow-700',
  Safe: 'bg-green-100 text-green-700',
}

export default function ShortagePrediction() {
  const [results, setResults] = useState([])
  const [chartData, setChartData] = useState(null)
  const [stats, setStats] = useState(null)
  const [error, setError] = useState('')

  const handleFile = async (file) => {
    setError('')
    try {
      const rows = await parseFile(file)
      const { results: res, chartData: cd } = processPredictionData(rows)
      setResults(res)
      setChartData(cd)
      setStats(getPredictionStats(res))
    } catch (e) {
      setError('Failed to parse file. Check that all required columns are present.')
    }
  }

  const chartOptions = {
    indexAxis: 'y',
    responsive: true,
    plugins: {
      legend: { display: false },
      title: { display: true, text: '🔮 Predicted Days Until Stockout (Top 15 Items)', font: { size: 14 } },
      tooltip: {
        callbacks: {
          label: (ctx) => `${ctx.parsed.x} days`,
        },
      },
    },
    scales: {
      x: {
        title: { display: true, text: 'Days Until Stockout' },
        beginAtZero: true,
      },
    },
  }

  // Add vertical reference lines via annotation plugin alternative — using a plugin inline
  const refLinesPlugin = {
    id: 'refLines',
    afterDraw(chart) {
      const { ctx, chartArea, scales } = chart
      if (!chartArea) return
      const lines = [
        { x: 7, color: 'rgba(220,38,38,0.7)', label: 'Critical (7d)' },
        { x: 14, color: 'rgba(249,115,22,0.7)', label: 'High (14d)' },
        { x: 30, color: 'rgba(234,179,8,0.7)', label: 'Medium (30d)' },
      ]
      lines.forEach(({ x, color, label }) => {
        const px = scales.x.getPixelForValue(x)
        if (px < chartArea.left || px > chartArea.right) return
        ctx.save()
        ctx.beginPath()
        ctx.setLineDash([6, 4])
        ctx.strokeStyle = color
        ctx.lineWidth = 2
        ctx.moveTo(px, chartArea.top)
        ctx.lineTo(px, chartArea.bottom)
        ctx.stroke()
        ctx.setLineDash([])
        ctx.fillStyle = color
        ctx.font = '11px sans-serif'
        ctx.fillText(label, px + 4, chartArea.top + 12)
        ctx.restore()
      })
    },
  }

  return (
    <div className="space-y-6">
      <div className="bg-white rounded-xl p-6 shadow-sm">
        <h3 className="text-lg font-semibold text-gray-800 mb-4">Upload Stock History File</h3>
        <FileUpload
          onFileLoaded={handleFile}
          label="Upload Excel/CSV with: Date, Item Name, Stock Level, Consumption, Reorder Level"
        />
        {error && <p className="mt-3 text-sm text-red-600">{error}</p>}
      </div>

      {stats && (
        <>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="bg-blue-50 border border-blue-200 rounded-xl p-4">
              <p className="text-sm font-medium text-blue-600">Total Items</p>
              <p className="text-3xl font-bold text-blue-700">{stats.total}</p>
            </div>
            <div className="bg-red-50 border border-red-200 rounded-xl p-4">
              <p className="text-sm font-medium text-red-600">🔴 CRITICAL</p>
              <p className="text-3xl font-bold text-red-700">{stats.critical}</p>
            </div>
            <div className="bg-orange-50 border border-orange-200 rounded-xl p-4">
              <p className="text-sm font-medium text-orange-600">🟠 High Risk</p>
              <p className="text-3xl font-bold text-orange-700">{stats.high}</p>
            </div>
            <div className="bg-yellow-50 border border-yellow-200 rounded-xl p-4">
              <p className="text-sm font-medium text-yellow-600">Will Hit Shortage</p>
              <p className="text-3xl font-bold text-yellow-700">{stats.willHitShortage}</p>
            </div>
          </div>

          {chartData && (
            <div className="bg-white rounded-xl shadow-sm p-6">
              <Bar data={chartData} options={chartOptions} plugins={[refLinesPlugin]} />
            </div>
          )}

          <div className="bg-white rounded-xl shadow-sm overflow-hidden">
            <div className="px-6 py-4 border-b flex items-center justify-between">
              <h3 className="text-lg font-semibold text-gray-800">30-Day Prediction Report</h3>
              <ExportButton data={results} filename="shortage_prediction_report.xlsx" />
            </div>
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead className="bg-gray-50 border-b">
                  <tr>
                    {['Item Name', 'Current Stock', 'Avg Daily Consumption', 'Predicted Stock (30d)', 'Reorder Level', 'Days to Stockout', 'Will Hit Shortage', 'Risk Level'].map(col => (
                      <th key={col} className="px-4 py-3 text-left font-semibold text-gray-600 whitespace-nowrap">{col}</th>
                    ))}
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100">
                  {results.map((row, i) => (
                    <tr key={i} className={row['Risk Level'] === 'CRITICAL' ? 'bg-red-50/40' : ''}>
                      <td className="px-4 py-3 font-medium text-gray-800">{row['Item Name']}</td>
                      <td className="px-4 py-3 text-gray-700">{row['Current Stock']}</td>
                      <td className="px-4 py-3 text-gray-700">{row['Avg Daily Consumption']}</td>
                      <td className="px-4 py-3 text-gray-700">{row['Predicted Stock (30d)']}</td>
                      <td className="px-4 py-3 text-gray-700">{row['Reorder Level']}</td>
                      <td className="px-4 py-3 font-semibold text-gray-800">{row['Days to Stockout']}</td>
                      <td className="px-4 py-3">
                        <span className={`font-semibold ${row['Will Hit Shortage'] === 'YES' ? 'text-red-600' : 'text-green-600'}`}>
                          {row['Will Hit Shortage'] === 'YES' ? '⚠️ YES' : '✅ NO'}
                        </span>
                      </td>
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

      {!stats && (
        <div className="bg-white rounded-xl p-8 shadow-sm text-center text-gray-400">
          <div className="text-5xl mb-3">🔮</div>
          <p className="font-medium">Upload a file to see 30-day shortage predictions</p>
          <p className="text-sm mt-1">Required columns: Date, Item Name, Stock Level, Consumption, Reorder Level</p>
        </div>
      )}
    </div>
  )
}
