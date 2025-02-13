import React, { useState } from 'react'
import RichTextEditor from './Editor/RichTextEditor'
import { useLocation } from 'react-router-dom'

const BASE_URL = 'http://127.0.0.1:8000' // Update with your backend URL

const Assessment: React.FC = () => {
  const [content, setContent] = useState<string>('') // Store editor content
  const [notification, setNotification] = useState<{
    message: string
    type: 'success' | 'error'
  } | null>(null)

  const savedState = localStorage.getItem('patientState')
  const patientState = savedState ? JSON.parse(savedState) : {}
  const patientId = patientState.id

  const location = useLocation()
  const userState = JSON.parse(localStorage.getItem('userState') || '{}')
  const roleId = userState?.id || location.state?.id
  const role = userState?.role || location.state?.role

  const handleSave = async () => {
    if (!content || !patientId) {
      setNotification({
        message: 'Please provide content and ensure the patient is selected.',
        type: 'error'
      })
      return
    }

    const doctor_id = role?.toLowerCase() === 'doctor' ? roleId : null
    const therapist_id = role?.toLowerCase() === 'therapist' ? roleId : null

    const payload = {
      patient_id: patientId,
      content,
      doctor_id,
      therapist_id
    }

    try {
      const response = await fetch(`${BASE_URL}/assessments/save`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(payload)
      })

      if (response.ok) {
        const result = await response.json()
        setNotification({
          message: result.message || 'Assessment saved successfully!',
          type: 'success'
        })
        setTimeout(() => setNotification(null), 3000)
      } else {
        const error = await response.json()
        setNotification({ message: `Error: ${error.detail}`, type: 'error' })
        setTimeout(() => setNotification(null), 3000)
      }
    } catch (error) {
      console.error('Failed to save assessment:', error)
      setNotification({ message: 'An unexpected error occurred while saving.', type: 'error' })
      setTimeout(() => setNotification(null), 3000)
    }
  }

  return (
    <div className="relative bg-white h-full">
      <RichTextEditor content="Assessment" onContentChange={setContent} showSaveButton={false} />
      <button
        onClick={handleSave}
        className="fixed z-10 bottom-0 right-0 mb-4 mr-4 px-4 py-3 bg-black text-white font-semibold rounded-md hover:bg-gray-700 transition"
      >
        Save Assessment
      </button>
      {notification && (
        <div
          className={`fixed bottom-4 left-1/2 transform -translate-x-1/2 px-4 py-2 rounded shadow-lg ${
            notification.type === 'success' ? 'bg-green-500 text-white' : 'bg-red-500 text-white'
          }`}
        >
          {notification.message}
        </div>
      )}
    </div>
  )
}

export default Assessment
