import * as XLSX from 'xlsx'
import { saveAs } from 'file-saver'

export function exportToExcel(data, filename = 'report.xlsx', sheetName = 'Report') {
  if (!data || data.length === 0) return
  const ws = XLSX.utils.json_to_sheet(data)
  const wb = XLSX.utils.book_new()
  XLSX.utils.book_append_sheet(wb, ws, sheetName)
  const buf = XLSX.write(wb, { bookType: 'xlsx', type: 'array' })
  saveAs(new Blob([buf], { type: 'application/octet-stream' }), filename)
}
