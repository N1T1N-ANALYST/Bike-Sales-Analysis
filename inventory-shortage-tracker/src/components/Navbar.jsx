import React from 'react'

export default function Navbar() {
  return (
    <header className="bg-white shadow z-10 flex items-center px-6 py-3">
      <div>
        <h1 className="text-xl font-bold text-gray-800">📦 Inventory Shortage Tracker</h1>
        <p className="text-xs text-gray-500">Upload your data files and get instant reports</p>
      </div>
    </header>
  )
}
