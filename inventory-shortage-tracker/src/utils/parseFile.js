import * as XLSX from 'xlsx'

/**
 * Parse a CSV or Excel file and return an array of row objects.
 * @param {File} file
 * @returns {Promise<Object[]>}
 */
export function parseCSVOrExcel(file) {
  return new Promise((resolve, reject) => {
    const reader = new FileReader()
    reader.onload = (e) => {
      try {
        const data = new Uint8Array(e.target.result)
        const workbook = XLSX.read(data, { type: 'array', cellDates: true })
        const sheetName = workbook.SheetNames[0]
        const worksheet = workbook.Sheets[sheetName]
        const rows = XLSX.utils.sheet_to_json(worksheet, { defval: '' })
        resolve(rows)
      } catch (err) {
        reject(err)
      }
    }
    reader.onerror = reject
    reader.readAsArrayBuffer(file)
  })
}

/**
 * Parse a multi-sheet Excel file and return an object keyed by sheet name.
 * @param {File} file
 * @returns {Promise<Object.<string, Object[]>>}
 */
export function parseMultiSheet(file) {
  return new Promise((resolve, reject) => {
    const reader = new FileReader()
    reader.onload = (e) => {
      try {
        const data = new Uint8Array(e.target.result)
        const workbook = XLSX.read(data, { type: 'array', cellDates: true })
        const result = {}
        workbook.SheetNames.forEach((name) => {
          result[name] = XLSX.utils.sheet_to_json(workbook.Sheets[name], { defval: '' })
        })
        resolve(result)
      } catch (err) {
        reject(err)
      }
    }
    reader.onerror = reject
    reader.readAsArrayBuffer(file)
  })
}
