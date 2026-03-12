import React, { useRef } from 'react'

/**
 * Reusable file upload component with drag-and-drop support.
 * @param {Object} props
 * @param {function} props.onFile - callback(file)
 * @param {string}   props.accept - e.g. ".csv,.xlsx,.xls"
 * @param {string}   props.label  - description of what to upload
 * @param {string}   props.selectedName - currently selected filename
 */
export default function FileUpload({ onFile, accept = '.csv,.xlsx,.xls', label = '', selectedName }) {
  const inputRef = useRef()

  function handleDrop(e) {
    e.preventDefault()
    const file = e.dataTransfer.files[0]
    if (file) onFile(file)
  }

  function handleChange(e) {
    const file = e.target.files[0]
    if (file) onFile(file)
  }

  return (
    <div
      className="border-2 border-dashed border-blue-300 rounded-xl p-6 text-center cursor-pointer hover:bg-blue-50 transition-colors"
      onDragOver={(e) => e.preventDefault()}
      onDrop={handleDrop}
      onClick={() => inputRef.current.click()}
    >
      <input
        ref={inputRef}
        type="file"
        accept={accept}
        className="hidden"
        onChange={handleChange}
      />
      <div className="text-4xl mb-2">📂</div>
      <p className="text-gray-600 font-medium">{label || 'Drag & drop your file here'}</p>
      <p className="text-gray-400 text-sm mt-1">or click to browse</p>
      <div className="mt-2 inline-block bg-blue-100 text-blue-700 text-xs font-semibold px-2 py-1 rounded">
        {accept}
      </div>
      {selectedName && (
        <p className="mt-2 text-green-600 text-sm font-medium">✅ {selectedName}</p>
      )}
    </div>
  )
}
