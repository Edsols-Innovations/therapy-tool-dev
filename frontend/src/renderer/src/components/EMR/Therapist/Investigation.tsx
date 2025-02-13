import React, { useState } from 'react'
import { FaTrash, FaUpload } from 'react-icons/fa'

const BASE_URL = 'http://127.0.0.1:8000'

interface InvestigationProps {
  onUploadSuccess: () => void; // Add this prop
}
const Investigation: React.FC<InvestigationProps> = ({ onUploadSuccess }) => {
  const [files, setFiles] = useState<{ file: File; name: string }[]>([])
  const [currentFile, setCurrentFile] = useState<File | null>(null)
  const [currentDocumentName, setCurrentDocumentName] = useState('')
  const [draggedOver, setDraggedOver] = useState(false)
  const [fileMessage, setFileMessage] = useState('No file uploaded yet.')

  const savedState = localStorage.getItem('patientState')
  const patientState = savedState ? JSON.parse(savedState) : {}
  const [notification, setNotification] = useState<{
    message: string
    type: 'success' | 'error'
  } | null>(null)

  const Notification = () => {
    if (!notification) return null
    return (
      <div
        className={`fixed top-4 right-4 px-4 py-2 rounded shadow-lg text-white ${
          notification.type === 'success' ? 'bg-green-500' : 'bg-red-500'
        }`}
      >
        {notification.message}
      </div>
    )
  }

  const showNotification = (message: string, type: 'success' | 'error') => {
    setNotification({ message, type })
    setTimeout(() => setNotification(null), 3000)
  }

  const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault()
    const droppedFile = e.dataTransfer.files[0]
    if (
      droppedFile &&
      ['image/', 'video/', 'application/pdf'].some((type) => droppedFile.type.startsWith(type))
    ) {
      setCurrentFile(droppedFile)
      setFileMessage(`File "${droppedFile.name}" uploaded successfully.`)
      showNotification(`File "${droppedFile.name}" uploaded successfully.`, 'success')
    } else {
      showNotification('Only images or PDFs are allowed.', 'error')
      setFileMessage('No valid file uploaded.')
    }
    setDraggedOver(false)
  }

  const handleDragOver = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault()
    setDraggedOver(true)
  }

  const handleDragLeave = () => {
    setDraggedOver(false)
  }

  const handleFileInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = e.target.files ? e.target.files[0] : null
    if (
      selectedFile &&
      ['image/', 'video/', 'application/pdf'].some((type) => selectedFile.type.startsWith(type))
    ) {
      setCurrentFile(selectedFile)
      setFileMessage(`File "${selectedFile.name}" uploaded successfully.`)
      showNotification(`File "${selectedFile.name}" uploaded successfully.`, 'success')
    } else {
      showNotification('Only images or PDFs are allowed.', 'error')
      setFileMessage('No valid file uploaded.')
    }
  }

  const handleAddFile = () => {
    if (!currentFile || !currentDocumentName) {
      showNotification('Please upload a file and provide a document name.', 'error')
      return
    }
    showNotification(`Document "${currentDocumentName}" added successfully.`, 'success')

    setFiles((prevFiles) => [...prevFiles, { file: currentFile, name: currentDocumentName }])
    setCurrentFile(null)
    setCurrentDocumentName('')
    setFileMessage('No file uploaded yet.')
  }

  const handleRemoveFile = (index: number) => {
    setFiles((prevFiles) => prevFiles.filter((_, i) => i !== index))
  }

  const handleSubmit = async () => {
    if (!files.length) {
      showNotification('No files to submit.', 'error')
      return
    }

    const formData = new FormData()
    formData.append('patient_id', patientState.id)

    // Ensure files are properly appended
    files.forEach(({ file, name }) => {
      formData.append('files', file) // The field name must match the FastAPI parameter name
      formData.append('names', name)
    })

    try {
      const response = await fetch(`${BASE_URL}/investigations/upload/`, {
        method: 'POST',
        body: formData,
        // Add these headers if needed
        credentials: 'include' // If you need to send cookies
      })

      if (!response.ok) {
        const error = await response.json()
        throw new Error(error.detail || 'Upload failed')
      }

      const result = await response.json()
      console.log('Files uploaded successfully:', result)
      showNotification('Files submitted successfully!', 'success')
      setFiles([])
      onUploadSuccess();
    } catch (err) {
      console.error('Error uploading files:', err)
      if (err instanceof Error) {
        showNotification(`Failed to submit files: ${err.message}`, 'error')
      } else {
        showNotification('Failed to submit files due to an unknown error.', 'error')
      }
    }
  }

  return (
    <div className="min-h-[80vh] flex flex-col items-center justify-center bg-blue-200 p-8">
      <div className="max-w-2xl w-full bg-white shadow-lg rounded-lg p-6">
        <h2 className="text-2xl font-semibold text-gray-800 mb-4">Upload and Name Documents</h2>
        <div
          onDrop={handleDrop}
          onDragOver={handleDragOver}
          onDragLeave={handleDragLeave}
          className={`w-full h-36 border-2 rounded-lg flex items-center justify-center text-center transition ${
            draggedOver ? 'border-blue-500 bg-blue-100' : 'border-gray-300'
          }`}
        >
          <p className="text-gray-500">
            Drag & drop a file here, or{' '}
            <label htmlFor="file-input" className="text-blue-500 cursor-pointer underline">
              click to select
            </label>
          </p>
          <input type="file" id="file-input" onChange={handleFileInput} className="hidden" />
        </div>
        <p className="mt-2 text-sm text-gray-600">{fileMessage}</p>
        <div className="mt-4">
          <label className="block text-gray-700 font-medium mb-2">Document Name</label>
          <input
            type="text"
            placeholder="Enter document name"
            value={currentDocumentName}
            onChange={(e) => setCurrentDocumentName(e.target.value)}
            className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>
        <button
          onClick={handleAddFile}
          className="mt-4 w-full bg-blue-500 text-white font-semibold py-2 rounded-md hover:bg-blue-600 transition"
        >
          Add Document
        </button>
        <div className="mt-6">
          <h3 className="text-lg font-semibold text-gray-800">Added Documents</h3>
          {files.length === 0 ? (
            <p className="text-gray-500 mt-2">No documents added yet.</p>
          ) : (
            <ul className="mt-4 space-y-4">
              {files.map(({ name, file }, index) => (
                <li
                  key={index}
                  className="flex items-center justify-between bg-gray-100 px-4 py-2 rounded-lg"
                >
                  <div>
                    <p className="text-gray-700 font-medium">{name}</p>
                    <p className="text-sm text-gray-500">({file.name})</p>
                  </div>
                  <button
                    onClick={() => handleRemoveFile(index)}
                    className="text-red-500 hover:text-red-700 transition"
                  >
                    <FaTrash />
                  </button>
                </li>
              ))}
            </ul>
          )}
        </div>
        <button
          onClick={handleSubmit}
          className="mt-6 w-full bg-green-500 text-white font-semibold py-2 rounded-md hover:bg-green-600 transition"
        >
          <FaUpload className="inline mr-2" />
          Submit All Documents
        </button>
      </div>
      <Notification />
    </div>
  )
}

export default Investigation
