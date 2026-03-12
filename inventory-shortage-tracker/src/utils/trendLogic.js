/**
 * Process trend report data.
 * Expected columns: Item Name, Month (YYYY-MM), Stock Level, Reorder Level
 */
export function processTrendData(rows) {
  // Parse months and flag shortage
  const parsed = rows.map(row => ({
    itemName: row['Item Name'] || '',
    month: String(row['Month'] || ''),
    stockLevel: Number(row['Stock Level']) || 0,
    reorderLevel: Number(row['Reorder Level']) || 0,
    inShortage: Number(row['Stock Level']) < Number(row['Reorder Level']),
  }))

  // Group by item
  const itemMap = {}
  parsed.forEach(r => {
    if (!itemMap[r.itemName]) itemMap[r.itemName] = []
    itemMap[r.itemName].push(r)
  })

  // Summary per item
  const summary = Object.entries(itemMap).map(([name, records]) => {
    const monthsInShortage = records.filter(r => r.inShortage).length
    const totalMonths = records.length
    const shortagePercent = totalMonths > 0 ? +((monthsInShortage / totalMonths) * 100).toFixed(1) : 0
    const avgStock = +(records.reduce((s, r) => s + r.stockLevel, 0) / totalMonths).toFixed(1)
    const minStock = Math.min(...records.map(r => r.stockLevel))
    let riskLevel
    if (shortagePercent >= 66) riskLevel = 'High'
    else if (shortagePercent >= 33) riskLevel = 'Medium'
    else riskLevel = 'Low'

    return {
      'Item Name': name,
      'Months In Shortage': monthsInShortage,
      'Total Months': totalMonths,
      'Shortage %': shortagePercent,
      'Avg Stock': avgStock,
      'Min Stock': minStock,
      'Risk Level': riskLevel,
    }
  }).sort((a, b) => b['Shortage %'] - a['Shortage %'])

  // All months (sorted) for chart x-axis
  const allMonths = [...new Set(parsed.map(r => r.month))].sort()

  // Top 8 at-risk items for chart
  const top8 = summary.slice(0, 8).map(s => s['Item Name'])

  // Chart datasets
  const chartData = {
    labels: allMonths,
    datasets: top8.map((name, idx) => {
      const records = itemMap[name] || []
      const monthMap = {}
      records.forEach(r => { monthMap[r.month] = r })
      return {
        label: name,
        data: allMonths.map(m => monthMap[m]?.stockLevel ?? null),
        borderColor: COLORS[idx % COLORS.length],
        backgroundColor: COLORS[idx % COLORS.length] + '22',
        borderWidth: 2,
        pointRadius: 3,
        tension: 0.3,
        fill: false,
      }
    }),
  }

  // Reorder level reference lines (annotation plugin or separate datasets)
  const reorderDatasets = top8.map((name, idx) => {
    const records = itemMap[name] || []
    const avgReorder = records.length > 0
      ? records.reduce((s, r) => s + r.reorderLevel, 0) / records.length
      : 0
    return {
      label: `${name} (Reorder)`,
      data: allMonths.map(() => +avgReorder.toFixed(1)),
      borderColor: COLORS[idx % COLORS.length],
      borderWidth: 1,
      borderDash: [6, 4],
      borderDashOffset: 0,
      pointRadius: 0,
      fill: false,
    }
  })

  return { summary, chartData, reorderDatasets, top8 }
}

const COLORS = [
  '#3b82f6', '#ef4444', '#10b981', '#f59e0b',
  '#8b5cf6', '#ec4899', '#14b8a6', '#f97316',
]
