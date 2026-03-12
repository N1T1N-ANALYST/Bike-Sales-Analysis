import readXlsxFile from 'read-excel-file/browser'
import Papa from 'papaparse'

/**
 * Convert an array-of-arrays (rows[0] = headers) into an array of objects.
 */
function rowsToObjects(rows) {
  if (!rows || rows.length === 0) return []
  const headers = rows[0].map(h => (h !== null && h !== undefined ? String(h) : ''))
  return rows.slice(1).map(row => {
    const obj = {}
    headers.forEach((h, i) => {
      const val = row[i]
      obj[h] = val !== null && val !== undefined ? val : ''
    })
    return obj
  })
}

/**
 * Parse a CSV or Excel file and return an array of row objects.
 * @param {File} file
 * @param {string|number|null} sheetName - optional sheet name or 1-based index to parse
 * @returns {Promise<Array>}
 */
export async function parseFile(file, sheetName = null) {
  const isCsv = file.name.toLowerCase().endsWith('.csv')
  if (isCsv) {
    return new Promise((resolve, reject) => {
      Papa.parse(file, {
        header: true,
        skipEmptyLines: true,
        dynamicTyping: true,
        complete: (result) => resolve(result.data),
        error: (err) => reject(new Error(err.message)),
      })
    })
  }
  const rows = await readXlsxFile(file, sheetName ? { sheet: sheetName } : {})
  return rowsToObjects(rows)
}

/**
 * Parse an Excel file and return specific named sheets as { sheetName: rows[] }.
 * @param {File} file
 * @param {string[]} sheetNames - list of sheet names to parse
 * @returns {Promise<Object>}
 */
export async function parseAllSheets(file, sheetNames = ['PO', 'GRN']) {
  const result = {}
  for (const name of sheetNames) {
    try {
      const rows = await readXlsxFile(file, { sheet: name })
      result[name] = rowsToObjects(rows)
    } catch {
      result[name] = null
    }
  }
  return result
}
