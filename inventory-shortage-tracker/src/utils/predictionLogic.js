/**
 * Process shortage prediction data.
 * Expected columns: Date, Item Name, Stock Level, Consumption, Reorder Level
 */

const MA_WINDOW = 7
const FORECAST_DAYS = 30

export function processPredictionData(rows) {
  // Parse rows
  const parsed = rows.map(row => ({
    date: row['Date'] ? new Date(row['Date']) : new Date(0),
    itemName: row['Item Name'] || '',
    stockLevel: Number(row['Stock Level']) || 0,
    consumption: Number(row['Consumption']) || 0,
    reorderLevel: Number(row['Reorder Level']) || 0,
  })).sort((a, b) => a.date - b.date)

  // Group by item
  const itemMap = {}
  parsed.forEach(r => {
    if (!itemMap[r.itemName]) itemMap[r.itemName] = []
    itemMap[r.itemName].push(r)
  })

  const results = Object.entries(itemMap).map(([name, records]) => {
    // Apply 7-day moving average on consumption
    const maConsumption = records.map((r, i) => {
      const window = records.slice(Math.max(0, i - MA_WINDOW + 1), i + 1)
      const avg = window.reduce((s, w) => s + w.consumption, 0) / window.length
      return avg
    })

    const latestStock = records[records.length - 1].stockLevel
    const avgConsumption = maConsumption[maConsumption.length - 1]
    const reorderLevel = records[records.length - 1].reorderLevel

    const predictedStock = Math.max(0, latestStock - avgConsumption * FORECAST_DAYS)
    const daysToStockout = avgConsumption > 0 ? +(latestStock / avgConsumption).toFixed(1) : Infinity
    const daysToReorder = avgConsumption > 0
      ? +((latestStock - reorderLevel) / avgConsumption).toFixed(1)
      : Infinity
    const willHitShortage = predictedStock < reorderLevel

    let riskLevel
    if (daysToStockout <= 7) riskLevel = 'CRITICAL'
    else if (daysToStockout <= 14) riskLevel = 'High'
    else if (daysToStockout <= 30) riskLevel = 'Medium'
    else riskLevel = 'Safe'

    return {
      'Item Name': name,
      'Current Stock': +latestStock.toFixed(1),
      'Avg Daily Consumption': +avgConsumption.toFixed(2),
      'Predicted Stock (30d)': +predictedStock.toFixed(1),
      'Reorder Level': reorderLevel,
      'Days to Reorder Point': daysToReorder === Infinity ? 'N/A' : daysToReorder,
      'Days to Stockout': daysToStockout === Infinity ? 9999 : daysToStockout,
      'Will Hit Shortage': willHitShortage ? 'YES' : 'NO',
      'Risk Level': riskLevel,
    }
  }).sort((a, b) => {
    const aD = a['Days to Stockout'] === 'N/A' ? 9999 : Number(a['Days to Stockout'])
    const bD = b['Days to Stockout'] === 'N/A' ? 9999 : Number(b['Days to Stockout'])
    return aD - bD
  })

  // Chart: top 15 items by days to stockout
  const top15 = results.slice(0, 15)
  const chartData = {
    labels: top15.map(r => r['Item Name']),
    datasets: [
      {
        label: 'Days to Stockout',
        data: top15.map(r => Math.min(Number(r['Days to Stockout']), 60)),
        backgroundColor: top15.map(r => {
          const d = Number(r['Days to Stockout'])
          if (d <= 7) return '#ef4444'
          if (d <= 14) return '#f97316'
          if (d <= 30) return '#eab308'
          return '#22c55e'
        }),
        borderRadius: 4,
      },
    ],
  }

  return { results, chartData }
}

export function getPredictionStats(results) {
  return {
    total: results.length,
    critical: results.filter(r => r['Risk Level'] === 'CRITICAL').length,
    high: results.filter(r => r['Risk Level'] === 'High').length,
    willHitShortage: results.filter(r => r['Will Hit Shortage'] === 'YES').length,
  }
}
