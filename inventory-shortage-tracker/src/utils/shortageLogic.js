/**
 * Assign urgency level based on stock vs reorder level.
 */
function assignUrgency(row) {
  const stock = Number(row['Current Stock']) || 0
  const reorder = Number(row['Reorder Level']) || 0
  if (stock === 0) return 'CRITICAL'
  if (stock < reorder * 0.5) return 'Critical'
  if (stock < reorder) return 'Warning'
  return 'OK'
}

const URGENCY_ORDER = { CRITICAL: 0, Critical: 1, Warning: 2, OK: 3 }

/**
 * Compute shortage items with urgency levels.
 * @param {Object[]} data - parsed rows
 * @returns {Object[]} shortage rows sorted by urgency then shortage qty
 */
export function computeShortages(data) {
  const rows = data.map((row) => ({
    ...row,
    'Shortage Qty': Math.max(
      0,
      (Number(row['Reorder Level']) || 0) - (Number(row['Current Stock']) || 0)
    ),
    Urgency: assignUrgency(row),
  }))

  const shortages = rows.filter((r) => (Number(r['Current Stock']) || 0) < (Number(r['Reorder Level']) || 0))

  shortages.sort((a, b) => {
    const urgencyDiff = (URGENCY_ORDER[a.Urgency] ?? 3) - (URGENCY_ORDER[b.Urgency] ?? 3)
    if (urgencyDiff !== 0) return urgencyDiff
    return b['Shortage Qty'] - a['Shortage Qty']
  })

  return shortages
}

/**
 * Compute shortage alerts with days until stockout.
 * @param {Object[]} data - parsed rows (must include Avg Daily Consumption)
 * @returns {Object[]} alert rows sorted by days until stockout
 */
export function computeAlerts(data) {
  const rows = data
    .filter((row) => (Number(row['Current Stock']) || 0) < (Number(row['Reorder Level']) || 0))
    .map((row) => {
      const stock = Number(row['Current Stock']) || 0
      const reorder = Number(row['Reorder Level']) || 0
      const consumption = Number(row['Avg Daily Consumption']) || 1
      const shortageGap = Math.max(0, reorder - stock)
      const daysUntilStockout = Math.max(0, Math.round((stock / consumption) * 10) / 10)

      let alertLevel
      if (daysUntilStockout <= 3) alertLevel = 'CRITICAL'
      else if (daysUntilStockout <= 7) alertLevel = 'High'
      else if (daysUntilStockout <= 14) alertLevel = 'Medium'
      else alertLevel = 'Low'

      return {
        ...row,
        'Shortage Gap': shortageGap,
        'Days Until Stockout': daysUntilStockout,
        'Alert Level': alertLevel,
      }
    })

  rows.sort((a, b) => a['Days Until Stockout'] - b['Days Until Stockout'])
  return rows
}
