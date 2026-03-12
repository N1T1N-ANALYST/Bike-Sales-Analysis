import * as XLSX from 'xlsx'

/**
 * Parse a CSV or Excel file and return an array of row objects.
 * @param {File} file
 * @param {string|null} sheetName - optional sheet name to parse
 * @returns {Promise<Array>}
 */
export function parseFile(file, sheetName = null) {
  return new Promise((resolve, reject) => {
    const reader = new FileReader()
    reader.onload = (e) => {
      try {
        const data = new Uint8Array(e.target.result)
        const workbook = XLSX.read(data, { type: 'array', cellDates: true })
        const sheet = sheetName
          ? workbook.Sheets[sheetName]
          : workbook.Sheets[workbook.SheetNames[0]]
        if (!sheet) {
          reject(new Error(`Sheet "${sheetName}" not found`))
          return
        }
        const rows = XLSX.utils.sheet_to_json(sheet, { defval: '' })
        resolve(rows)
      } catch (err) {
        reject(err)
      }
    }
    reader.onerror = () => reject(new Error('Failed to read file'))
    reader.readAsArrayBuffer(file)
  })
}

/**
 * Parse an Excel file and return all sheets as an object { sheetName: rows[] }
 * @param {File} file
 * @returns {Promise<Object>}
 */
export function parseAllSheets(file) {
  return new Promise((resolve, reject) => {
    const reader = new FileReader()
    reader.onload = (e) => {
      try {
        const data = new Uint8Array(e.target.result)
        const workbook = XLSX.read(data, { type: 'array', cellDates: true })
        const result = {}
        workbook.SheetNames.forEach(name => {
          result[name] = XLSX.utils.sheet_to_json(workbook.Sheets[name], { defval: '' })
        })
        resolve(result)
      } catch (err) {
        reject(err)
      }
    }
    reader.onerror = () => reject(new Error('Failed to read file'))
    reader.readAsArrayBuffer(file)
  })
}
