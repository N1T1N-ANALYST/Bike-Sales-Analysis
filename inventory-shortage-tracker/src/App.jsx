import React, { useState } from 'react'
import Navbar from './components/Navbar.jsx'
import ShortageTracker from './components/ShortageTracker.jsx'
import ShortageAlerts from './components/ShortageAlerts.jsx'
import POGRNReconciliation from './components/POGRNReconciliation.jsx'
import TrendReport from './components/TrendReport.jsx'
import ShortagePrediction from './components/ShortagePrediction.jsx'

const TABS = [
  { id: 'tracker', label: 'Shortage Tracker', icon: '📋' },
  { id: 'alerts', label: 'Shortage Alerts', icon: '🚨' },
  { id: 'reconciliation', label: 'PO vs GRN', icon: '🔄' },
  { id: 'trend', label: 'Trend Report', icon: '📈' },
  { id: 'prediction', label: 'Prediction', icon: '🔮' },
]

export default function App() {
  const [activeTab, setActiveTab] = useState('tracker')

  const renderTab = () => {
    switch (activeTab) {
      case 'tracker': return <ShortageTracker />
      case 'alerts': return <ShortageAlerts />
      case 'reconciliation': return <POGRNReconciliation />
      case 'trend': return <TrendReport />
      case 'prediction': return <ShortagePrediction />
      default: return <ShortageTracker />
    }
  }

  return (
    <div className="flex h-screen overflow-hidden bg-slate-100">
      {/* Sidebar */}
      <aside className="w-64 bg-gray-900 text-white flex flex-col flex-shrink-0">
        <div className="p-4 border-b border-gray-700">
          <h1 className="text-lg font-bold text-white">📦 Inventory</h1>
          <p className="text-xs text-gray-400">Shortage Tracker</p>
        </div>
        <nav className="flex-1 p-3 space-y-1">
          {TABS.map(tab => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg text-sm font-medium transition-colors ${
                activeTab === tab.id
                  ? 'bg-blue-600 text-white'
                  : 'text-gray-300 hover:bg-gray-700 hover:text-white'
              }`}
            >
              <span className="text-lg">{tab.icon}</span>
              <span>{tab.label}</span>
            </button>
          ))}
        </nav>
        <div className="p-4 border-t border-gray-700">
          <p className="text-xs text-gray-500">100% Browser-Based</p>
          <p className="text-xs text-gray-500">No backend required</p>
        </div>
      </aside>

      {/* Main Content */}
      <div className="flex-1 flex flex-col overflow-hidden">
        <Navbar activeTab={TABS.find(t => t.id === activeTab)} />
        <main className="flex-1 overflow-y-auto p-6">
          {renderTab()}
        </main>
      </div>
    </div>
  )
}
