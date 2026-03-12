import React, { useState } from 'react'
import FileUpload from './FileUpload.jsx'
import ExportButton from './ExportButton.jsx'
import { parseAllSheets } from '../utils/parseFile.js'
import { processReconciliation, getReconciliationStats } from '../utils/reconciliationLogic.js'

const STATUS_STYLES = {
  'Fully Received': 'bg-green-100 text-green-700',
  'Under Delivered': 'bg-red-100 text-red-700',
  'Over Delivered': 'bg-yellow-100 text-yellow-700',
}

export default function POGRNReconciliation() {
  const [data, setData] = useState([])
  const [stats, setStats] = useState(null)
  const [error, setError] = useState('')

  const handleFile = async (file) => {
    setError('')
    try {
      const sheets = await parseAllSheets(file)
      const poRows = sheets['PO']
      const grnRows = sheets['GRN']
      if (!poRows || !grnRows) {
        setError('Excel file must contain two sheets named "PO" and "GRN".')
        return
      }
      const processed = processReconciliation(poRows, grnRows)
      setData(processed)
      setStats(getReconciliationStats(processed))
    } catch (e) {
      setError('Failed to parse file. Ensure it contains sheets named "PO" and "GRN".')
    }
  }

  return (
    <div className="space-y-6">
      <div className="bg-white rounded-xl p-6 shadow-sm">
        <h3 className="text-lg font-semibold text-gray-800 mb-4">Upload PO & GRN Excel File</h3>
        <FileUpload
          onFileLoaded={handleFile}
          accept=".xlsx,.xls"
          label="Upload Excel file with two sheets: 'PO' and 'GRN'"
        />
        {error && <p className="mt-3 text-sm text-red-600">{error}</p>}
        <div className="mt-4 grid grid-cols-1 md:grid-cols-2 gap-4 text-xs text-gray-500">
          <div>
            <p className="font-semibold text-gray-600 mb-1">PO Sheet columns:</p>
            <p>PO Number, Item, Ordered Qty, Supplier, PO Date</p>
          </div>
          <div>
            <p className="font-semibold text-gray-600 mb-1">GRN Sheet columns:</p>
            <p>GRN Number, Item, Received Qty, Date</p>
          </div>
        </div>
      </div>

      {stats && (
        <>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="bg-blue-50 border border-blue-200 rounded-xl p-4">
              <p className="text-sm font-medium text-blue-600">Total Items</p>
              <p className="text-3xl font-bold text-blue-700">{stats.total}</p>
            </div>
            <div className="bg-red-50 border border-red-200 rounded-xl p-4">
              <p className="text-sm font-medium text-red-600">Under Delivered</p>
              <p className="text-3xl font-bold text-red-700">{stats.underDelivered}</p>
            </div>
            <div className="bg-green-50 border border-green-200 rounded-xl p-4">
              <p className="text-sm font-medium text-green-600">Fully Received</p>
              <p className="text-3xl font-bold text-green-700">{stats.fullyReceived}</p>
            </div>
            <div className="bg-yellow-50 border border-yellow-200 rounded-xl p-4">
              <p className="text-sm font-medium text-yellow-600">Over Delivered</p>
              <p className="text-3xl font-bold text-yellow-700">{stats.overDelivered}</p>
            </div>
          </div>

          <div className="bg-white rounded-xl shadow-sm overflow-hidden">
            <div className="px-6 py-4 border-b flex items-center justify-between">
              <h3 className="text-lg font-semibold text-gray-800">Reconciliation Report</h3>
              <ExportButton data={data} filename="po_grn_reconciliation.xlsx" />
            </div>
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead className="bg-gray-50 border-b">
                  <tr>
                    {['Item', 'Supplier', 'Total Ordered Qty', 'Total Received Qty', 'Shortage Qty', 'Shortage %', 'Excess Qty', 'Status'].map(col => (
                      <th key={col} className="px-4 py-3 text-left font-semibold text-gray-600 whitespace-nowrap">{col}</th>
                    ))}
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100">
                  {data.map((row, i) => (
                    <tr key={i} className={row['Status'] === 'Under Delivered' ? 'bg-red-50/30' : ''}>
                      <td className="px-4 py-3 font-medium text-gray-800">{row['Item']}</td>
                      <td className="px-4 py-3 text-gray-700">{row['Supplier']}</td>
                      <td className="px-4 py-3 text-gray-700">{row['Total Ordered Qty']}</td>
                      <td className="px-4 py-3 text-gray-700">{row['Total Received Qty']}</td>
                      <td className="px-4 py-3 font-semibold text-gray-800">{row['Shortage Qty']}</td>
                      <td className="px-4 py-3 text-gray-700">{row['Shortage %']}%</td>
                      <td className="px-4 py-3 text-gray-700">{row['Excess Qty']}</td>
                      <td className="px-4 py-3">
                        <span className={`inline-block px-2 py-1 rounded-full text-xs font-semibold ${STATUS_STYLES[row['Status']] || ''}`}>
                          {row['Status']}
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
          <div className="text-5xl mb-3">🔄</div>
          <p className="font-medium">Upload an Excel file with PO and GRN sheets</p>
        </div>
      )}
    </div>
  )
}
