import React, { useState } from 'react'
import Navbar from './components/Navbar'
import ShortageTracker from './components/ShortageTracker'
import ShortageAlerts from './components/ShortageAlerts'
import POGRNReconciliation from './components/POGRNReconciliation'
import TrendReport from './components/TrendReport'
import ShortagePrediction from './components/ShortagePrediction'

const TABS = [
  { id: 'tracker', label: 'Shortage Tracker', icon: '📋' },
  { id: 'alerts', label: 'Shortage Alerts', icon: '🚨' },
  { id: 'po-grn', label: 'PO vs GRN', icon: '🔄' },
  { id: 'trends', label: 'Trend Report', icon: '📈' },
  { id: 'prediction', label: 'Prediction', icon: '🔮' },
]

function TabContent({ activeTab }) {
  switch (activeTab) {
    case 'tracker': return <ShortageTracker />
    case 'alerts': return <ShortageAlerts />
    case 'po-grn': return <POGRNReconciliation />
    case 'trends': return <TrendReport />
    case 'prediction': return <ShortagePrediction />
    default: return <ShortageTracker />
  }
}

export default function App() {
  const [activeTab, setActiveTab] = useState('tracker')

  return (
    <div className="flex h-screen bg-gray-100 overflow-hidden">
      {/* Sidebar */}
      <nav className="bg-gray-900 w-56 flex-shrink-0 flex flex-col py-4">
        <div className="px-4 mb-6">
          <p className="text-white font-bold text-lg leading-tight">📦 Inventory</p>
          <p className="text-gray-400 text-xs">Shortage Tracker</p>
        </div>
        <ul className="flex-1 space-y-1 px-2">
          {TABS.map((tab) => (
            <li key={tab.id}>
              <button
                onClick={() => setActiveTab(tab.id)}
                className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-colors ${
                  activeTab === tab.id
                    ? 'bg-blue-600 text-white'
                    : 'text-gray-300 hover:bg-gray-700 hover:text-white'
                }`}
              >
                <span className="text-lg">{tab.icon}</span>
                <span>{tab.label}</span>
              </button>
            </li>
          ))}
        </ul>
        <div className="px-4 mt-4">
          <p className="text-gray-500 text-xs">v1.0.0 — 100% browser-based</p>
        </div>
      </nav>

      {/* Main content */}
      <div className="flex-1 flex flex-col overflow-hidden">
        <Navbar />
        <main className="flex-1 overflow-y-auto">
          <TabContent activeTab={activeTab} />
        </main>
      </div>
    </div>
  )
}
