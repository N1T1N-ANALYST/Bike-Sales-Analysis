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
import FileUpload from './FileUpload'
import ExportButton from './ExportButton'
import { parseCSVOrExcel } from '../utils/parseFile'
import { predictShortages } from '../utils/predictionLogic'
import { exportToExcel } from '../utils/exportToExcel'

ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend)

const RISK_STYLES = {
  CRITICAL: 'bg-red-100 text-red-800 border border-red-300',
  High: 'bg-orange-100 text-orange-800 border border-orange-300',
  Medium: 'bg-yellow-100 text-yellow-800 border border-yellow-300',
  Safe: 'bg-green-100 text-green-800 border border-green-300',
}

function barColor(days) {
  if (days === '∞') return '#22c55e'
  const d = Number(days)
  if (d <= 7) return '#ef4444'
  if (d <= 14) return '#f97316'
  if (d <= 30) return '#eab308'
  return '#22c55e'
}

export default function ShortagePrediction() {
  const [predictions, setPredictions] = useState([])
  const [fileName, setFileName] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  async function handleFile(file) {
    setLoading(true)
    setError('')
    try {
      const rows = await parseCSVOrExcel(file)
      setPredictions(predictShortages(rows))
      setFileName(file.name)
    } catch {
      setError('Failed to parse file. Please check the format.')
    } finally {
      setLoading(false)
    }
  }

  const totalAnalyzed = predictions.length
  const predictedShortage = predictions.filter((r) => r['Will Hit Shortage'] === 'YES').length
  const critical = predictions.filter(
    (r) => r['Days to Stockout'] !== '∞' && Number(r['Days to Stockout']) <= 7
  ).length

  // Top 15 items for chart
  const chartItems = predictions
    .filter((r) => r['Days to Stockout'] !== '∞')
    .slice(0, 15)

  const chartData = {
    labels: chartItems.map((r) => r['Item Name']),
    datasets: [
      {
        label: 'Days to Stockout',
        data: chartItems.map((r) => Number(r['Days to Stockout'])),
        backgroundColor: chartItems.map((r) => barColor(r['Days to Stockout'])),
        borderRadius: 4,
      },
    ],
  }

  const chartOptions = {
    indexAxis: 'y',
    responsive: true,
    plugins: {
      legend: { display: false },
      title: {
        display: true,
        text: '🔮 Predicted Days Until Stockout (Top 15)',
        font: { size: 14 },
      },
    },
    scales: {
      x: { title: { display: true, text: 'Days Until Stockout' } },
    },
  }

  return (
    <div className="p-6 space-y-6">
      <div>
        <h2 className="text-2xl font-bold text-gray-800 mb-1">🔮 Shortage Prediction</h2>
        <p className="text-gray-500 text-sm">
          Upload historical stock data to predict items likely to hit shortage in 30 days.
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

      {predictions.length > 0 && (
        <>
          {/* Summary cards */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <StatCard label="Total Analyzed" value={totalAnalyzed} color="border-blue-400" icon="📊" />
            <StatCard label="Predicted In Shortage" value={predictedShortage} color="border-red-400" icon="⚠️" />
            <StatCard label="Critical (≤7 days)" value={critical} color="border-red-600" icon="🔴" />
          </div>

          {/* Bar chart */}
          {chartItems.length > 0 && (
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-4">
              <Bar data={chartData} options={chartOptions} />
            </div>
          )}

          <div className="flex justify-end">
            <ExportButton
              onClick={() => exportToExcel(predictions, 'shortage_prediction_report')}
            />
          </div>

          {/* Prediction table */}
          <div className="overflow-x-auto rounded-xl border border-gray-200 shadow-sm">
            <table className="min-w-full text-sm">
              <thead className="bg-gray-800 text-white">
                <tr>
                  {[
                    'Item Name', 'Current Stock', 'Avg Daily Consumption',
                    'Predicted Stock (30d)', 'Reorder Level', 'Days to Reorder',
                    'Days to Stockout', 'Will Hit Shortage', 'Risk Level',
                  ].map((col) => (
                    <th key={col} className="px-4 py-3 text-left text-xs">{col}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {predictions.map((row, i) => (
                  <tr key={i} className={i % 2 === 0 ? 'bg-white' : 'bg-gray-50'}>
                    <td className="px-4 py-2 font-medium text-gray-800">{row['Item Name']}</td>
                    <td className="px-4 py-2 text-gray-700">{row['Current Stock']}</td>
                    <td className="px-4 py-2 text-gray-700">{row['Avg Daily Consumption']}</td>
                    <td className="px-4 py-2 text-gray-700">{row['Predicted Stock (30d)']}</td>
                    <td className="px-4 py-2 text-gray-700">{row['Reorder Level']}</td>
                    <td className="px-4 py-2 text-gray-700">{row['Days to Reorder']}</td>
                    <td className="px-4 py-2 font-semibold text-orange-700">{row['Days to Stockout']}</td>
                    <td className="px-4 py-2">
                      <span
                        className={`px-2 py-0.5 rounded-full text-xs font-semibold ${
                          row['Will Hit Shortage'] === 'YES'
                            ? 'bg-red-100 text-red-800 border border-red-300'
                            : 'bg-green-100 text-green-800 border border-green-300'
                        }`}
                      >
                        {row['Will Hit Shortage']}
                      </span>
                    </td>
                    <td className="px-4 py-2">
                      <span
                        className={`px-2 py-0.5 rounded-full text-xs font-semibold ${
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

      {!loading && predictions.length === 0 && !fileName && (
        <div className="bg-blue-50 rounded-xl p-6 text-sm text-blue-700">
          <p className="font-semibold mb-2">📋 Required columns:</p>
          <code className="block bg-white rounded p-2 text-xs">
            Date | Item Name | Stock Level | Consumption | Reorder Level
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
