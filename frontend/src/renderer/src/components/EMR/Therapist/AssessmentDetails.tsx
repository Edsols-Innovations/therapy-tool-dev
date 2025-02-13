import React from 'react'
import AssessmentPdf from './AssessmentPdf'

interface AssessmentDetailsProps {
  assessment: {
    id: number
    date: string
    content: string // HTML content
    taken_by: string
    role: string // Role (Doctor or Therapist)
  }
  patient: {
    first_name: string
    last_name: string
  }
}

const AssessmentDetails: React.FC<AssessmentDetailsProps> = ({ assessment, patient }) => {
  const formatDate = (isoDate: string) => {
    const dateObj = new Date(isoDate)
    return dateObj.toLocaleString('en-US', {
      day: '2-digit',
      month: 'short',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
      hour12: true
    })
  }

  return (
    <div className="min-h-screen bg-blue-100 flex flex-col">
      {/* Patient Header */}
      <div className="bg-blue-100 w-full p-6 rounded-lg shadow-lg">
        <h1 className="text-2xl font-semibold text-gray-800">
          {patient.first_name} {patient.last_name}'s Assessment
        </h1>
        <p className="text-gray-600">
          <strong>Date:</strong> {formatDate(assessment.date)}
        </p>
        <p className="text-gray-600">
          <strong>Taken By:</strong> {assessment.taken_by} ({assessment.role})
        </p>
      </div>

      {/* Assessment Content */}
      <div className="p-6">
        <div
          className="p-4 prose border rounded-md bg-gray-50 shadow-md text-gray-800"
          dangerouslySetInnerHTML={{ __html: assessment.content }}
        ></div>
      </div>
      <div className="flex justify-center">
            <AssessmentPdf patient={patient} assessment={assessment} />
          </div>
    </div>
  )
}

export default AssessmentDetails
