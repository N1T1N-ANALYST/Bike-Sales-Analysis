import React from 'react'

/**
 * Reusable export to Excel button.
 * @param {Object} props
 * @param {function} props.onClick
 * @param {string}   props.label
 * @param {boolean}  props.disabled
 */
export default function ExportButton({ onClick, label = 'Export to Excel', disabled = false }) {
  return (
    <button
      onClick={onClick}
      disabled={disabled}
      className="flex items-center gap-2 bg-green-600 hover:bg-green-700 disabled:bg-gray-400 text-white font-semibold px-4 py-2 rounded-lg transition-colors"
    >
      <span>⬇️</span>
      {label}
    </button>
  )
}
