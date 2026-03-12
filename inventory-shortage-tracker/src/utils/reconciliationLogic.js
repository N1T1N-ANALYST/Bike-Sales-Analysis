/**
 * Process PO and GRN sheets for reconciliation.
 * PO columns: PO Number, Item, Ordered Qty, Supplier, PO Date
 * GRN columns: GRN Number, Item, Received Qty, Date
 */
export function processReconciliation(poRows, grnRows) {
  // Aggregate PO by Item
  const poMap = {}
  poRows.forEach(row => {
    const item = row['Item'] || ''
    const qty = Number(row['Ordered Qty']) || 0
    const supplier = row['Supplier'] || ''
    if (!poMap[item]) poMap[item] = { item, supplier, orderedQty: 0 }
    poMap[item].orderedQty += qty
  })

  // Aggregate GRN by Item
  const grnMap = {}
  grnRows.forEach(row => {
    const item = row['Item'] || ''
    const qty = Number(row['Received Qty']) || 0
    if (!grnMap[item]) grnMap[item] = { receivedQty: 0 }
    grnMap[item].receivedQty += qty
  })

  // Merge
  const results = Object.keys(poMap).map(item => {
    const ordered = poMap[item].orderedQty
    const received = (grnMap[item]?.receivedQty) || 0
    const shortageQty = Math.max(0, ordered - received)
    const excessQty = Math.max(0, received - ordered)
    const shortagePercent = ordered > 0 ? +((shortageQty / ordered) * 100).toFixed(2) : 0

    let status
    if (shortageQty === 0 && excessQty === 0) status = 'Fully Received'
    else if (shortageQty > 0) status = 'Under Delivered'
    else status = 'Over Delivered'

    return {
      'Item': item,
      'Supplier': poMap[item].supplier,
      'Total Ordered Qty': ordered,
      'Total Received Qty': received,
      'Shortage Qty': shortageQty,
      'Shortage %': shortagePercent,
      'Excess Qty': excessQty,
      'Status': status,
    }
  })

  return results.sort((a, b) => b['Shortage Qty'] - a['Shortage Qty'])
}

export function getReconciliationStats(data) {
  return {
    total: data.length,
    underDelivered: data.filter(r => r['Status'] === 'Under Delivered').length,
    fullyReceived: data.filter(r => r['Status'] === 'Fully Received').length,
    overDelivered: data.filter(r => r['Status'] === 'Over Delivered').length,
  }
}
