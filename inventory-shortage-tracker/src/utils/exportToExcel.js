import * as XLSX from 'xlsx'
import { saveAs } from 'file-saver'

/**
 * Export an array of objects to an Excel (.xlsx) file and trigger download.
 * @param {Object[]} data
 * @param {string} filename  - without extension
 */
export function exportToExcel(data, filename = 'report') {
  const worksheet = XLSX.utils.json_to_sheet(data)
  const workbook = XLSX.utils.book_new()
  XLSX.utils.book_append_sheet(workbook, worksheet, 'Report')
  const excelBuffer = XLSX.write(workbook, { bookType: 'xlsx', type: 'array' })
  const blob = new Blob([excelBuffer], {
    type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
  })
  saveAs(blob, `${filename}.xlsx`)
}
