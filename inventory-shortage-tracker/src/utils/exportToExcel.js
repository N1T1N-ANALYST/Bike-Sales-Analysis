import writeXlsxFile from 'write-excel-file/browser'

/**
 * Export an array of objects to an Excel (.xlsx) file and trigger download.
 * @param {Object[]} data
 * @param {string} filename  - without extension
 */
export async function exportToExcel(data, filename = 'report') {
  if (!data || data.length === 0) return

  // Build a 2-D array: first row = headers, remaining rows = values
  const headers = Object.keys(data[0])
  const rows = [
    headers.map((h) => ({ value: h, fontWeight: 'bold' })),
    ...data.map((row) =>
      headers.map((h) => {
        const val = row[h]
        if (val == null || val === '') return { value: '' }
        if (typeof val === 'number') return { value: val }
        return { value: String(val) }
      })
    ),
  ]

  await writeXlsxFile(rows, { fileName: `${filename}.xlsx` })
}

