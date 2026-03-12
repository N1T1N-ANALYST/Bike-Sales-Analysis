import React from 'react'
import { saveAs } from 'file-saver'
import * as XLSX from 'xlsx'

export default function ExportButton({ data, filename = 'export.xlsx', label = 'Export to Excel' }) {
  const handleExport = () => {
    if (!data || data.length === 0) return
    const ws = XLSX.utils.json_to_sheet(data)
    const wb = XLSX.utils.book_new()
    XLSX.utils.book_append_sheet(wb, ws, 'Report')
    const buf = XLSX.write(wb, { bookType: 'xlsx', type: 'array' })
    saveAs(new Blob([buf], { type: 'application/octet-stream' }), filename)
  }

  return (
    <button
      onClick={handleExport}
      disabled={!data || data.length === 0}
      className="flex items-center gap-2 bg-green-600 text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-green-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
    >
      📥 {label}
    </button>
  )
}
