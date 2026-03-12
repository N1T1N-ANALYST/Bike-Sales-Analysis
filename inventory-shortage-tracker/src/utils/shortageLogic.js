/**
 * Assign urgency level to an item based on stock vs reorder level.
 */
export function assignUrgency(currentStock, reorderLevel) {
  if (currentStock === 0) return 'CRITICAL'
  if (currentStock < reorderLevel * 0.5) return 'Critical'
  if (currentStock < reorderLevel) return 'Warning'
  return 'OK'
}

/**
 * Process rows from the shortage tracker file.
 * Expected columns: Item Code, Item Name, Current Stock, Reorder Level, Supplier, Lead Time
 */
export function processShortageData(rows) {
  return rows.map(row => {
    const currentStock = Number(row['Current Stock']) || 0
    const reorderLevel = Number(row['Reorder Level']) || 0
    const shortageQty = Math.max(0, reorderLevel - currentStock)
    const urgency = assignUrgency(currentStock, reorderLevel)
    return {
      'Item Code': row['Item Code'] || '',
      'Item Name': row['Item Name'] || '',
      'Current Stock': currentStock,
      'Reorder Level': reorderLevel,
      'Shortage Qty': shortageQty,
      'Supplier': row['Supplier'] || '',
      'Lead Time': row['Lead Time'] || '',
      'Urgency': urgency,
    }
  }).sort((a, b) => {
    const order = { CRITICAL: 0, Critical: 1, Warning: 2, OK: 3 }
    const diff = (order[a.Urgency] ?? 3) - (order[b.Urgency] ?? 3)
    if (diff !== 0) return diff
    return b['Shortage Qty'] - a['Shortage Qty']
  })
}

export function getShortageStats(data) {
  const shortage = data.filter(r => r['Current Stock'] < r['Reorder Level'])
  const critical = data.filter(r => r['Urgency'] === 'CRITICAL' || r['Urgency'] === 'Critical')
  const warning = data.filter(r => r['Urgency'] === 'Warning')
  return {
    total: data.length,
    inShortage: shortage.length,
    critical: critical.length,
    warning: warning.length,
  }
}
