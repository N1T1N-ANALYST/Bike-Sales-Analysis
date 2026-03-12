/**
 * Reconcile PO rows vs GRN rows by Item.
 * @param {Object[]} poRows  - columns: Item, Supplier, Ordered Qty
 * @param {Object[]} grnRows - columns: Item, Received Qty
 * @returns {Object[]} reconciled rows per item
 */
export function reconcilePOvsGRN(poRows, grnRows) {
  // Aggregate PO quantities per item
  const poMap = {}
  poRows.forEach((row) => {
    const item = row['Item'] || row['Item Name'] || ''
    const supplier = row['Supplier'] || ''
    const qty = Number(row['Ordered Qty']) || 0
    if (!poMap[item]) poMap[item] = { supplier, totalOrdered: 0 }
    poMap[item].totalOrdered += qty
    if (supplier) poMap[item].supplier = supplier
  })

  // Aggregate GRN quantities per item
  const grnMap = {}
  grnRows.forEach((row) => {
    const item = row['Item'] || row['Item Name'] || ''
    const qty = Number(row['Received Qty']) || 0
    grnMap[item] = (grnMap[item] || 0) + qty
  })

  // Build reconciliation rows
  const result = Object.keys(poMap).map((item) => {
    const totalOrdered = poMap[item].totalOrdered
    const totalReceived = grnMap[item] || 0
    const shortageQty = Math.max(0, totalOrdered - totalReceived)
    const shortagePercent =
      totalOrdered > 0 ? Math.round((shortageQty / totalOrdered) * 10000) / 100 : 0
    const excessQty = Math.max(0, totalReceived - totalOrdered)

    let status
    if (shortageQty === 0 && excessQty === 0) status = 'Fully Received'
    else if (shortageQty > 0) status = 'Under Delivered'
    else status = 'Over Delivered'

    return {
      Item: item,
      Supplier: poMap[item].supplier,
      'Total Ordered Qty': totalOrdered,
      'Total Received Qty': totalReceived,
      'Shortage Qty': shortageQty,
      'Shortage %': shortagePercent,
      'Excess Qty': excessQty,
      Status: status,
    }
  })

  result.sort((a, b) => b['Shortage Qty'] - a['Shortage Qty'])
  return result
}
