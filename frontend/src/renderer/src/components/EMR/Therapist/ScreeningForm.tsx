import React, { useState } from 'react'
import RichTextEditor from './Editor/RichTextEditor'
import {
  TwoMonths,
  FourMonths,
  SixMonths,
  NineMonths,
  OneYear,
  FifteenMonths,
  EighteenMonths,
  TwentyFourMonths,
  AboveTwoYears
} from './PatientForm'
import { useLocation } from 'react-router-dom'

const BASE_URL = 'http://127.0.0.1:8000'

const ScreeningForm: React.FC = () => {
  const [selectedAge, setSelectedAge] = useState('')
  const [doctorComment, setDoctorComment] = useState('')
  const [formResponses, setFormResponses] = useState({
    social: {},
    language: {},
    cognitive: {},
    movement: {}
  })
  const [notification, setNotification] = useState<{
    message: string
    type: 'success' | 'error'
  } | null>(null)
  

  const ageOptions = [
    { value: '', label: 'Select Age/Month' },
    { value: '2-months', label: '2 Months' },
    { value: '4-months', label: '4 Months' },
    { value: '6-months', label: '6 Months' },
    { value: '9-months', label: '9 Months' },
    { value: '1-year', label: '1 Year' },
    { value: '15-months', label: '15 Months' },
    { value: '18-months', label: '18 Months' },
    { value: '24-months', label: '24 Months' },
    { value: 'above-2-years', label: 'Above 2 Years' }
  ]

  const handleResponseChange = (category: string, question: string, value: string) => {
    setFormResponses((prev) => ({
      ...prev,
      [category]: {
        ...prev[category],
        [question]: value
      }
    }))
  }

  const renderComponent = () => {
    switch (selectedAge) {
      case '2-months':
        return <TwoMonths onResponseChange={handleResponseChange} />
      case '4-months':
        return <FourMonths onResponseChange={handleResponseChange} />
      case '6-months':
        return <SixMonths onResponseChange={handleResponseChange} />
      case '9-months':
        return <NineMonths onResponseChange={handleResponseChange} />
      case '1-year':
        return <OneYear onResponseChange={handleResponseChange} />
      case '15-months':
        return <FifteenMonths onResponseChange={handleResponseChange} />
      case '18-months':
        return <EighteenMonths onResponseChange={handleResponseChange} />
      case '24-months':
        return <TwentyFourMonths onResponseChange={handleResponseChange} />
      case 'above-2-years':
        return <AboveTwoYears onResponseChange={handleResponseChange} />
      default:
        return (
          <div className="text-gray-500 text-lg">Please select an age/month from the dropdown.</div>
        )
    }
  }

  const location = useLocation()
  const userState = JSON.parse(localStorage.getItem('userState') || '{}')
  const roleId = userState?.id || location.state?.id
  const role = userState?.role || location.state?.role
  const savedState = localStorage.getItem('patientState')
  const patientState = savedState ? JSON.parse(savedState) : {}

  const doctor_id = role?.toLowerCase() === 'doctor' ? roleId : null
  const therapist_id = role?.toLowerCase() === 'therapist' ? roleId : null

  const handleSubmit = async () => {
    console.log(userState?.id)
    try {
      const response = await fetch(`${BASE_URL}/screenings/save`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          patient_id: patientState.id,
          age_group: selectedAge,
          screening_data: formResponses,
          doctor_comment: doctorComment,
          therapist_id,
          doctor_id
        })
      })

      if (response.ok) {
        setSelectedAge('')
        setFormResponses({
          social: {},
          language: {},
          cognitive: {},
          movement: {}
        })
        setDoctorComment('')
        setNotification({ message: 'Form submitted successfully!', type: 'success' })
      } else {
        throw new Error('Submission failed')
      }
    } catch (error) {
      setNotification({ message: 'Error submitting form', type: 'error' })
      console.error(error)
    } finally {
      // Clear notification after 3 seconds
      setTimeout(() => setNotification(null), 3000)
    }
  }

  return (
    <div className="p-8">
      {notification && (
        <div
          className={`fixed top-4 right-4 px-4 py-2 rounded shadow-md text-white ${
            notification.type === 'success' ? 'bg-green-500' : 'bg-red-500'
          }`}
        >
          {notification.message}
        </div>
      )}
      <div className="mb-6">
        <label className="block text-gray-700 font-semibold mb-2">Select Age/Month</label>
        <select
          className="w-full px-3 py-2 border rounded-lg shadow-sm focus:outline-none focus:ring focus:border-blue-300"
          value={selectedAge}
          onChange={(e) => setSelectedAge(e.target.value)}
        >
          {ageOptions.map((option) => (
            <option key={option.value} value={option.value}>
              {option.label}
            </option>
          ))}
        </select>
      </div>

      <div className="mt-8">{renderComponent()}</div>

      <div className="mt-8">
        <label className="block text-gray-700 font-semibold mb-2">Doctor's Comment</label>
        <div>
          <RichTextEditor
            showSaveButton={false}
            onContentChange={(newContent) => setDoctorComment(newContent)}
          />
        </div>
      </div>

      <div className="mt-8">
        <button
          onClick={handleSubmit}
          disabled={!selectedAge && !doctorComment.trim()}
          className={`px-6 py-2 rounded-lg shadow focus:outline-none focus:ring-2 ${
            selectedAge || doctorComment.trim()
              ? 'bg-blue-600 text-white hover:bg-blue-700 focus:ring-blue-400'
              : 'bg-gray-300 text-gray-500 cursor-not-allowed'
          }`}
        >
          Submit
        </button>
      </div>
    </div>
  )
}

export default ScreeningForm
