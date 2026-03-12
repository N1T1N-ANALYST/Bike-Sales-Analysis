import React, { useState } from 'react'
import { exportToExcel } from '../utils/exportToExcel.js'

export default function ExportButton({ data, filename = 'export.xlsx', label = 'Export to Excel' }) {
  const [exporting, setExporting] = useState(false)

  const handleExport = async () => {
    if (!data || data.length === 0) return
    setExporting(true)
    try {
      await exportToExcel(data, filename)
    } finally {
      setExporting(false)
    }
  }

  return (
    <button
      onClick={handleExport}
      disabled={!data || data.length === 0 || exporting}
      className="flex items-center gap-2 bg-green-600 text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-green-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
    >
      📥 {exporting ? 'Exporting…' : label}
    </button>
  )
}
