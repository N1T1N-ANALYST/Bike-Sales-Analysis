const MA_WINDOW = 7
const FORECAST_DAYS = 30

/**
 * Predict shortages using 7-day Simple Moving Average on Consumption.
 * Expected columns: Date, Item Name, Stock Level, Consumption, Reorder Level
 * @param {Object[]} data
 * @returns {Object[]} prediction results sorted by days to stockout
 */
export function predictShortages(data) {
  // Group by item
  const itemMap = {}
  data.forEach((row) => {
    const item = row['Item Name'] || row['Item'] || ''
    if (!itemMap[item]) itemMap[item] = []
    itemMap[item].push(row)
  })

  const results = []

  Object.entries(itemMap).forEach(([item, rows]) => {
    // Sort by date
    const sorted = rows
      .slice()
      .sort((a, b) => new Date(a['Date']) - new Date(b['Date']))

    // Compute 7-day SMA on consumption
    const consumptions = sorted.map((r) => Number(r['Consumption']) || 0)
    const sma = consumptions.map((_, i) => {
      const start = Math.max(0, i - MA_WINDOW + 1)
      const window = consumptions.slice(start, i + 1)
      return window.reduce((s, v) => s + v, 0) / window.length
    })

    const latestRow = sorted[sorted.length - 1]
    const latestStock = Number(latestRow['Stock Level']) || 0
    const avgConsumption = sma[sma.length - 1] || 0
    const reorderLevel = Number(latestRow['Reorder Level']) || 0

    const predictedStock = Math.max(0, latestStock - avgConsumption * FORECAST_DAYS)
    const daysToReorder =
      avgConsumption > 0
        ? Math.max(0, Math.round(((latestStock - reorderLevel) / avgConsumption) * 10) / 10)
        : Infinity
    const daysToStockout =
      avgConsumption > 0
        ? Math.max(0, Math.round((latestStock / avgConsumption) * 10) / 10)
        : Infinity

    const willHitShortage = predictedStock < reorderLevel

    let riskLevel
    if (daysToStockout <= 7) riskLevel = 'CRITICAL'
    else if (daysToStockout <= 14) riskLevel = 'High'
    else if (daysToStockout <= 30) riskLevel = 'Medium'
    else riskLevel = 'Safe'

    results.push({
      'Item Name': item,
      'Current Stock': Math.round(latestStock * 10) / 10,
      'Avg Daily Consumption': Math.round(avgConsumption * 100) / 100,
      'Predicted Stock (30d)': Math.round(predictedStock * 10) / 10,
      'Reorder Level': reorderLevel,
      'Days to Reorder': daysToReorder === Infinity ? '∞' : daysToReorder,
      'Days to Stockout': daysToStockout === Infinity ? '∞' : daysToStockout,
      'Will Hit Shortage': willHitShortage ? 'YES' : 'NO',
      'Risk Level': riskLevel,
    })
  })

  results.sort((a, b) => {
    const dA = a['Days to Stockout'] === '∞' ? Infinity : Number(a['Days to Stockout'])
    const dB = b['Days to Stockout'] === '∞' ? Infinity : Number(b['Days to Stockout'])
    return dA - dB
  })

  return results
}
