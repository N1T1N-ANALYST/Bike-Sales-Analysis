import Papa from 'papaparse'
import readXlsxFile, { readSheetNames } from 'read-excel-file/browser'

/**
 * Convert a 2-D array of cell values (rows[0] = headers) into an array of objects.
 * @param {Array[]} rows
 * @returns {Object[]}
 */
function rowsToObjects(rows) {
  if (rows.length === 0) return []
  const headers = rows[0].map((h) => (h == null ? '' : String(h)))
  return rows.slice(1).map((row) => {
    const obj = {}
    headers.forEach((h, i) => {
      obj[h] = row[i] == null ? '' : row[i]
    })
    return obj
  })
}

/**
 * Parse a CSV or Excel file and return an array of row objects.
 * @param {File} file
 * @returns {Promise<Object[]>}
 */
export function parseCSVOrExcel(file) {
  if (file.name.toLowerCase().endsWith('.csv')) {
    return new Promise((resolve, reject) => {
      Papa.parse(file, {
        header: true,
        skipEmptyLines: true,
        complete: (results) => resolve(results.data),
        error: reject,
      })
    })
  }
  // XLSX / XLS
  return readXlsxFile(file).then(rowsToObjects)
}

/**
 * Parse a multi-sheet Excel file and return an object keyed by sheet name.
 * @param {File} file
 * @returns {Promise<Object.<string, Object[]>>}
 */
export async function parseMultiSheet(file) {
  const sheetNames = await readSheetNames(file)
  const result = {}
  for (const name of sheetNames) {
    const rows = await readXlsxFile(file, { sheet: name })
    result[name] = rowsToObjects(rows)
  }
  return result
}

