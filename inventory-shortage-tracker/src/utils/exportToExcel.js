import writeXlsxFile from 'write-excel-file/browser'

/**
 * Export an array of objects to an .xlsx file and trigger a browser download.
 * @param {Array<Object>} data - rows to export
 * @param {string} filename - download file name
 * @param {string} sheetName - sheet name (unused by write-excel-file, kept for API compat)
 */
export async function exportToExcel(data, filename = 'report.xlsx') {
  if (!data || data.length === 0) return
  const headers = Object.keys(data[0])
  const schema = headers.map(key => ({
    column: key,
    type: (typeof data[0][key] === 'number') ? Number : String,
    value: row => {
      const v = row[key]
      return v !== null && v !== undefined ? v : ''
    },
  }))
  await writeXlsxFile(data, { schema, fileName: filename })
}
