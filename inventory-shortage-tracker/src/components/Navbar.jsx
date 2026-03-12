import React from 'react'

export default function Navbar({ activeTab }) {
  return (
    <header className="bg-white border-b border-gray-200 px-6 py-4 flex items-center justify-between shadow-sm">
      <div className="flex items-center gap-3">
        <span className="text-2xl">{activeTab?.icon}</span>
        <div>
          <h2 className="text-xl font-bold text-gray-800">{activeTab?.label}</h2>
          <p className="text-xs text-gray-500">Upload your file to get started</p>
        </div>
      </div>
      <div className="text-sm text-gray-400 font-medium">📦 Inventory Shortage Tracker</div>
    </header>
  )
}
