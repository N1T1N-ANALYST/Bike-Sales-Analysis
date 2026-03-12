import React, { useCallback } from 'react'

export default function FileUpload({ onFileLoaded, accept = '.csv,.xlsx,.xls', label = 'Upload CSV or Excel file' }) {
  const handleChange = useCallback((e) => {
    const file = e.target.files[0]
    if (file) onFileLoaded(file)
  }, [onFileLoaded])

  const handleDrop = useCallback((e) => {
    e.preventDefault()
    const file = e.dataTransfer.files[0]
    if (file) onFileLoaded(file)
  }, [onFileLoaded])

  const handleDragOver = (e) => e.preventDefault()

  return (
    <div
      onDrop={handleDrop}
      onDragOver={handleDragOver}
      className="border-2 border-dashed border-blue-300 rounded-xl p-8 text-center bg-blue-50 hover:bg-blue-100 transition-colors cursor-pointer"
    >
      <div className="text-4xl mb-3">📂</div>
      <p className="text-gray-700 font-medium mb-1">{label}</p>
      <p className="text-sm text-gray-500 mb-4">Drag & drop here, or click to browse</p>
      <label className="cursor-pointer inline-block bg-blue-600 text-white px-5 py-2 rounded-lg text-sm font-medium hover:bg-blue-700 transition-colors">
        Choose File
        <input
          type="file"
          accept={accept}
          onChange={handleChange}
          className="hidden"
        />
      </label>
      <p className="text-xs text-gray-400 mt-3">Supported: {accept}</p>
    </div>
  )
}
