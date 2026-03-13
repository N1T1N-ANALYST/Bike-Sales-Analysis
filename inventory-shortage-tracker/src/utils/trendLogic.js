/**
 * Compute shortage trends from historical data.
 * Expected columns: Item Name, Month, Stock Level, Reorder Level
 * @param {Object[]} data
 * @returns {Object[]} summary per item sorted by shortage %
 */
export function computeTrends(data) {
  // Group by item
  const itemMap = {}
  data.forEach((row) => {
    const item = row['Item Name'] || row['Item'] || ''
    if (!itemMap[item]) itemMap[item] = []
    itemMap[item].push(row)
  })

  const summary = Object.entries(itemMap).map(([item, rows]) => {
    const totalMonths = rows.length
    const monthsInShortage = rows.filter(
      (r) => (Number(r['Stock Level']) || 0) < (Number(r['Reorder Level']) || 0)
    ).length
    const shortagePercent =
      totalMonths > 0 ? Math.round((monthsInShortage / totalMonths) * 1000) / 10 : 0

    let riskLevel
    if (shortagePercent >= 66) riskLevel = 'High Risk'
    else if (shortagePercent >= 33) riskLevel = 'Medium Risk'
    else riskLevel = 'Low Risk'

    // Build monthly series sorted by month string
    const monthlySeries = rows
      .slice()
      .sort((a, b) => String(a['Month']).localeCompare(String(b['Month'])))
      .map((r) => ({
        month: String(r['Month']),
        stockLevel: Number(r['Stock Level']) || 0,
        reorderLevel: Number(r['Reorder Level']) || 0,
      }))

    return {
      'Item Name': item,
      'Months In Shortage': monthsInShortage,
      'Total Months': totalMonths,
      'Shortage %': shortagePercent,
      'Risk Level': riskLevel,
      monthlySeries,
    }
  })

  summary.sort((a, b) => b['Shortage %'] - a['Shortage %'])
  return summary
}
