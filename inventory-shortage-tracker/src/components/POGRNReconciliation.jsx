import React, { useState } from 'react'
import FileUpload from './FileUpload'
import ExportButton from './ExportButton'
import { parseMultiSheet } from '../utils/parseFile'
import { reconcilePOvsGRN } from '../utils/reconciliationLogic'
import { exportToExcel } from '../utils/exportToExcel'

const STATUS_STYLES = {
  'Under Delivered': 'bg-red-100 text-red-800 border border-red-300',
  'Fully Received': 'bg-green-100 text-green-800 border border-green-300',
  'Over Delivered': 'bg-yellow-100 text-yellow-800 border border-yellow-300',
}

export default function POGRNReconciliation() {
  const [rows, setRows] = useState([])
  const [fileName, setFileName] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  async function handleFile(file) {
    setLoading(true)
    setError('')
    try {
      const sheets = await parseMultiSheet(file)
      const sheetNames = Object.keys(sheets)
      // Try to find PO and GRN sheets (case-insensitive)
      const poKey = sheetNames.find((k) => k.toLowerCase().includes('po')) || sheetNames[0]
      const grnKey = sheetNames.find((k) => k.toLowerCase().includes('grn')) || sheetNames[1]
      if (!poKey || !grnKey || poKey === grnKey) {
        setError('Excel file must have two sheets: "PO" and "GRN".')
        return
      }
      const result = reconcilePOvsGRN(sheets[poKey], sheets[grnKey])
      setRows(result)
      setFileName(file.name)
    } catch {
      setError('Failed to parse file. Please check the format.')
    } finally {
      setLoading(false)
    }
  }

  const underDelivered = rows.filter((r) => r.Status === 'Under Delivered').length
  const fullyReceived = rows.filter((r) => r.Status === 'Fully Received').length
  const overDelivered = rows.filter((r) => r.Status === 'Over Delivered').length

  return (
    <div className="p-6 space-y-6">
      <div>
        <h2 className="text-2xl font-bold text-gray-800 mb-1">🔄 PO vs GRN Reconciliation</h2>
        <p className="text-gray-500 text-sm">
          Upload an Excel file with two sheets: "PO" and "GRN" to reconcile ordered vs received quantities.
        </p>
      </div>

      <FileUpload
        onFile={handleFile}
        accept=".xlsx,.xls"
        label="Upload Excel file with PO and GRN sheets"
        selectedName={fileName}
      />

      {loading && <p className="text-blue-600 font-medium">⏳ Processing file…</p>}
      {error && <p className="text-red-600 font-medium">❌ {error}</p>}

      {rows.length > 0 && (
        <>
          {/* Summary cards */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <StatCard label="Total Items" value={rows.length} color="border-blue-400" icon="📦" />
            <StatCard label="Under Delivered" value={underDelivered} color="border-red-400" icon="🔴" />
            <StatCard label="Fully Received" value={fullyReceived} color="border-green-400" icon="✅" />
            <StatCard label="Over Delivered" value={overDelivered} color="border-yellow-400" icon="🟡" />
          </div>

          <div className="flex justify-end">
            <ExportButton
              onClick={() => exportToExcel(rows, 'po_grn_reconciliation')}
            />
          </div>

          {/* Table */}
          <div className="overflow-x-auto rounded-xl border border-gray-200 shadow-sm">
            <table className="min-w-full text-sm">
              <thead className="bg-gray-800 text-white">
                <tr>
                  {['Item', 'Supplier', 'Total Ordered Qty', 'Total Received Qty',
                    'Shortage Qty', 'Shortage %', 'Excess Qty', 'Status'].map((col) => (
                    <th key={col} className="px-4 py-3 text-left">{col}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {rows.map((row, i) => (
                  <tr key={i} className={i % 2 === 0 ? 'bg-white' : 'bg-gray-50'}>
                    <td className="px-4 py-2 font-medium text-gray-800">{row['Item']}</td>
                    <td className="px-4 py-2 text-gray-700">{row['Supplier']}</td>
                    <td className="px-4 py-2 text-gray-700">{row['Total Ordered Qty']}</td>
                    <td className="px-4 py-2 text-gray-700">{row['Total Received Qty']}</td>
                    <td className="px-4 py-2 font-semibold text-red-700">{row['Shortage Qty']}</td>
                    <td className="px-4 py-2 text-gray-700">{row['Shortage %']}%</td>
                    <td className="px-4 py-2 text-gray-700">{row['Excess Qty']}</td>
                    <td className="px-4 py-2">
                      <span
                        className={`px-2 py-1 rounded-full text-xs font-semibold ${
                          STATUS_STYLES[row['Status']] || 'bg-gray-100 text-gray-700'
                        }`}
                      >
                        {row['Status']}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </>
      )}

      {!loading && rows.length === 0 && !fileName && (
        <div className="bg-blue-50 rounded-xl p-6 text-sm text-blue-700 space-y-2">
          <p className="font-semibold">📋 Sheet "PO" required columns:</p>
          <code className="block bg-white rounded p-2 text-xs">
            PO Number | Item | Ordered Qty | Supplier | PO Date
          </code>
          <p className="font-semibold">📋 Sheet "GRN" required columns:</p>
          <code className="block bg-white rounded p-2 text-xs">
            GRN Number | Item | Received Qty | Date
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
